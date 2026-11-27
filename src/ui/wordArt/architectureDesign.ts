/**
 * Kultur & fritid → Bildkonst & design → Arkitektur & formgivning, 4561–4567 (0.63): architectural styles, facades and
 * details, furniture design, industrial design, function and aesthetics, sustainable design, design history.
 * Recurring signs: blue sky and green grass outside, warm paper indoors; the part that the word names is in full colour
 * and ringed or outlined in orange, and a smaller grey copy shows what the word is not. Good/bad is a green tick or a
 * red cross. Style words share one layout (a building on grass under the sky) so that only the style differs:
 * funkis (white cube, flat roof, ribbon windows), brutalism (heavy grey concrete), postmodernism (pink and turquoise
 * with a big broken gable), sekelskifteshus (tall ornamented stone house). Roof words share one house: platt tak (the
 * whole flat roof), takkupa (a small window box on the slope), frontespis (the wall that rises above the eaves).
 * Opposites are mirror pictures: funktionell/opraktisk, stilren/dekorativ. No words, letters or brands.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SKY = '#dff0fa';
const GRASS = '#a8d08a';
const ROOM = '#f6efe2';
const CONC = '#aeaca6';
const CONC2 = '#8d8b85';
const STONE = '#ead8b0';
const STONE2 = '#cdb88a';
const WALLW = '#fbfbf8';
const GLASS = '#bfe3f5';
const GLASS2 = '#8fc6e6';
const WOOD = '#c99a62';
const WOOD2 = '#9a6a3a';
const PINK = '#f2a7b8';
const TURQ = '#5fbfb3';
const IRON = '#2e2e36';
const GREEN = '#3fa45b';
const RED = '#e8302c';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const sky = (col: string = SKY) => rect(0, 0, 120, 120, col, 0, null);
const grass = (y = 104) => rect(0, y, 120, 120 - y, GRASS, 0, null);
const outdoor = () => all(sky(), grass());
const room = (col: string = ROOM) => rect(0, 0, 120, 120, col, 0, null);
const floor = (y = 100, col: string = '#e2cfae') => all(rect(0, y, 120, 120 - y, col, 0, null), line(`M0 ${y} L120 ${y}`, C.ink, 1.2));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 3, col, 2.6);
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, GREEN, C.ink, 1.2), path('M-3.4 0 L-1 2.6 L3.8 -2.8', 'none', C.white, 1.9));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, RED, C.ink, 1.2), line('M-3 -3 L3 3 M3 -3 L-3 3', C.white, 1.9));
const cloud = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', C.white, null));
const tree = (x: number, y = 112, s = 1, col: string = '#4f9d69') => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -22, 10, col, C.ink, 1.3));
const qmark = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-3.5 -4 C-3.5 -9 4 -9 4 -4 C4 -1 0 -0.5 0 3', 'none', col, 2.2), circle(0, 7, 1.4, col, null));
const heart = (x: number, y: number, s = 1, fill: string = RED) => at(x, y, s, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', fill, C.ink, 1.2));
/** A window with frame and glass; bars = glazing bars. */
const win = (x: number, y: number, w = 8, h = 10, bars = true, frameCol: string = WALLW, glass: string = GLASS) => all(rect(x, y, w, h, frameCol, 0.8, C.ink, 0.9), rect(f1(x + 1.2), f1(y + 1.2), f1(w - 2.4), f1(h - 2.4), glass, 0.4, null),
  bars ? line(`M${f1(x + w / 2)} ${f1(y + 1.2)} L${f1(x + w / 2)} ${f1(y + h - 1.2)} M${f1(x + 1.2)} ${f1(y + h / 2)} L${f1(x + w - 1.2)} ${f1(y + h / 2)}`, frameCol, 1) : '');
const door = (x: number, y: number, w = 8, h = 13, col: string = '#7a4b2a') => all(rect(x, y - h, w, h, col, 0.8, C.ink, 1), circle(x + w - 2, y - h / 2, 0.7, C.gold, null));
/** Speech bubble with a mark inside, tail towards (tx, ty). */
const bubble = (x: number, y: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => all(
  path(`M${x + 3} ${y} L${x + w - 3} ${y} Q${x + w} ${y} ${x + w} ${y + 3} L${x + w} ${y + h - 3} Q${x + w} ${y + h} ${x + w - 3} ${y + h} L${f1(x + w / 2 + 3)} ${y + h} L${tx} ${ty} L${f1(x + w / 2 - 2)} ${y + h} L${x + 3} ${y + h} Q${x} ${y + h} ${x} ${y + h - 3} L${x} ${y + 3} Q${x} ${y} ${x + 3} ${y} Z`, C.white, C.ink, 1.2), inner);

// ── People ───────────────────────────────────────────────────────────
type Pt = [number, number];
type Fig = { top?: string; bottom?: string; hair?: 'short' | 'long' | 'bun'; grey?: boolean; mouth?: 'smile' | 'flat' | 'frown' | 'o'; armL?: Pt[]; armR?: Pt[]; skirt?: boolean; front?: Svg };
const HANG_L: Pt[] = [[-14, -48], [-15, -34]];
const HANG_R: Pt[] = [[14, -48], [15, -34]];
/** Standing person, feet at (x, y), local units: head centre (0, −80), shoulders (±9, −62). Height ≈ 92·s. */
const fig = (x: number, s: number, o: Fig = {}, y = 112) => {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : C.skin, top = grey ? C.grey : (o.top ?? C.sky), bot = grey ? C.grey : (o.bottom ?? C.navy), hair = grey ? C.grey : C.hair;
  const armPath = (side: number, pts: Pt[]) => { const d = `M${side * 9} -62 ` + pts.map(([a, b]) => `L${a} ${b}`).join(' '); const [hx, hy] = pts[pts.length - 1]!; return all(line(d, ink, 7.4), line(d, top, 5), circle(hx, hy, 3.2, skin, ink, 1.2)); };
  const m = o.mouth ?? 'smile';
  const mouth = m === 'o' ? circle(0, -74.5, 1.6, '#c84a4a', ink, 1) : m === 'flat' ? line('M-3 -74.5 L3 -74.5', ink, 1.2) : m === 'frown' ? path('M-3 -73.5 Q0 -76.5 3 -73.5', 'none', ink, 1.3) : path('M-3.4 -75.5 Q0 -72.5 3.4 -75.5', 'none', ink, 1.3);
  const legs = o.skirt ? all(path('M-11 -36 L11 -36 L15 -12 L-15 -12 Z', bot, ink, 1.8), line('M-5 -12 L-5 -1 M5 -12 L5 -1', skin, 4.4))
    : all(line('M-5 -36 L-6 -2', ink, 7.6), line('M-5 -36 L-6 -2', bot, 5.6), line('M5 -36 L6 -2', ink, 7.6), line('M5 -36 L6 -2', bot, 5.6));
  const hairBack = o.hair === 'long' ? path('M-11 -82 C-14 -64 -8 -62 0 -64 C8 -62 14 -64 11 -82 C10 -96 -10 -96 -11 -82 Z', hair, ink, 1.6) : '';
  const hairTop = o.hair === 'bun' ? all(circle(0, -93, 4.5, hair, ink, 1.4), path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6)) : path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6);
  return g(`translate(${x} ${y}) scale(${s})`, legs, ellipse(-7, -1, 5, 2.4, grey ? C.grey : C.black, null), ellipse(7, -1, 5, 2.4, grey ? C.grey : C.black, null), hairBack,
    path('M-11 -66 L11 -66 L10 -34 L-10 -34 Z', top, ink, 1.8), armPath(-1, o.armL ?? HANG_L), armPath(1, o.armR ?? HANG_R),
    rect(-3, -71, 6, 6, skin, 2, ink, 1.2), circle(0, -80, 10, skin, ink, 1.8), hairTop,
    circle(-3.6, -81, 1.2, ink, null), circle(3.6, -81, 1.2, ink, null), mouth, o.front ?? '');
};
const W = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { hair: 'long', top: C.orange, skirt: true, bottom: C.purple, ...o }, y);
const M = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { top: C.green, ...o }, y);
/** A small person seen in profile from the side, sitting with the seat at (x, y), facing right (dir 1) or left (−1). */
const sitSide = (x: number, y: number, s = 1, dir: 1 | -1 = 1, o: { top?: string; grey?: boolean; lean?: number; mouth?: 'smile' | 'frown' } = {}) => {
  const top = o.grey ? C.grey : (o.top ?? C.sky), skin = o.grey ? C.grey2 : C.skin, hair = o.grey ? C.grey : C.hair, bot = o.grey ? C.grey : C.navy, lean = o.lean ?? 0;
  return g(`translate(${x} ${y}) scale(${dir * s} ${s})`,
    line('M0 0 L14 0 L14 16', C.ink, 7), line('M0 0 L14 0 L14 16', bot, 5), ellipse(17, 17, 4.5, 2.2, o.grey ? C.grey : C.black, null),
    g(`rotate(${-lean})`, line('M0 0 L0 -24', C.ink, 9), line('M0 0 L0 -24', top, 7), line('M0 -20 L9 -10', C.ink, 6), line('M0 -20 L9 -10', top, 4), circle(10, -9, 2.6, skin, C.ink, 1),
      circle(1, -32, 7, skin, C.ink, 1.4), path('M-6 -33 C-7 -42 7 -42 8 -35 C3 -38 -2 -37 -6 -33 Z', hair, C.ink, 1), circle(4.5, -33, 0.9, C.ink, null),
      o.mouth === 'frown' ? path('M2.5 -27.5 Q4.5 -29.5 6.5 -27.5', 'none', C.ink, 1) : path('M2.5 -29 Q4.5 -27 6.5 -29', 'none', C.ink, 1)));
};

// ── Buildings ────────────────────────────────────────────────────────
/** White funkis house: cube with flat roof, ribbon windows and a round corner balcony. */
const funkisHouse = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-34, -46, 68, 46, WALLW, 0, C.ink, 1.6), rect(-36, -49, 72, 4, WALLW, 0, C.ink, 1.4),
  rect(-28, -38, 40, 9, GLASS, 0, C.ink, 1.2), line('M-18 -38 L-18 -29 M-8 -38 L-8 -29 M2 -38 L2 -29', C.ink, 1),
  rect(-28, -20, 26, 9, GLASS, 0, C.ink, 1.2), line('M-15 -20 L-15 -11', C.ink, 1),
  path('M18 -26 L38 -26 C44 -26 44 -16 38 -16 L18 -16 Z', WALLW, C.ink, 1.4), line('M20 -26 L20 -32 L38 -32 C42 -32 42 -26 40 -26', C.ink, 1), circle(26, -36, 4, GLASS, C.ink, 1.1),
  door(4, 0, 9, 15, '#3f6fb5'));
/** Brutalist concrete block: heavy cantilevered top floors, deep small windows, board marks. */
const brutalHouse = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-26, -34, 52, 34, CONC, 0, C.ink, 1.6), rect(-44, -70, 88, 36, CONC, 0, C.ink, 1.8),
  ...range(5).map((i) => line(`M-44 ${-66 + i * 7} L44 ${-66 + i * 7}`, CONC2, 0.6)),
  ...range(6).map((i) => all(rect(-38 + i * 14, -62, 8, 10, '#5c5e66', 0, C.ink, 1), rect(-38 + i * 14, -48, 8, 10, '#5c5e66', 0, C.ink, 1))),
  rect(-20, -26, 40, 4, CONC2, 0, null), rect(-10, -16, 20, 16, '#5c5e66', 0, C.ink, 1.2), rect(-44, -74, 88, 4, CONC2, 0, C.ink, 1.2));
/** Postmodern office: pink and turquoise, a big broken gable, a round window, fat striped columns. */
const postmodHouse = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-40, -60, 80, 60, '#f6e3c8', 0, C.ink, 1.6), path('M-44 -60 L-6 -84 L-6 -72 L-30 -60 Z M44 -60 L6 -84 L6 -72 L30 -60 Z', PINK, C.ink, 1.5),
  circle(0, -62, 8, GLASS, C.ink, 1.4), line('M0 -70 L0 -54 M-8 -62 L8 -62', TURQ, 1.6),
  rect(-40, -44, 80, 6, TURQ, 0, C.ink, 1.2),
  ...[-30, 22].map((cx) => all(rect(cx, -38, 8, 38, PINK, 0, C.ink, 1.3), ...range(4).map((i) => line(`M${cx} ${-32 + i * 9} L${cx + 8} ${-32 + i * 9}`, TURQ, 2)), rect(cx - 2, -40, 12, 3, TURQ, 0, C.ink, 1))),
  path('M-12 0 L-12 -20 A12 12 0 0 1 12 -20 L12 0 Z', TURQ, C.ink, 1.4), path('M-8 0 L-8 -19 A8 8 0 0 1 8 -19 L8 0 Z', GLASS, C.ink, 1),
  win(-20, -32, 6, 9), win(14, -32, 6, 9));
/** Turn-of-the-century stone town house: five floors, ornaments, a small tower. */
const stoneHouse = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s,
  rect(-34, -86, 68, 86, col, 0, C.ink, 1.6), path('M-36 -86 L-36 -92 L36 -92 L36 -86 Z', '#7a6a5a', C.ink, 1.2), path('M14 -92 L14 -100 C14 -108 30 -108 30 -100 L30 -92 Z', '#5fb3a0', C.ink, 1.3), line('M22 -106 L22 -112', C.ink, 1.4),
  ...range(4).map((r) => line(`M-34 ${-70 + r * 16} L34 ${-70 + r * 16}`, STONE2, 1.6)),
  ...range(5).flatMap((r) => [-26, -11, 4, 19].map((c) => all(win(c, -84 + r * 16, 8, 11), r === 0 ? '' : path(`M${c - 1} ${-85 + r * 16} Q${c + 4} ${-89 + r * 16} ${c + 9} ${-85 + r * 16}`, 'none', STONE2, 1.2)))),
  rect(-34, -12, 68, 12, STONE2, 0, C.ink, 1.2), path('M-6 0 L-6 -10 A6 6 0 0 1 6 -10 L6 0 Z', '#7a4b2a', C.ink, 1.2),
  circle(-30, -78, 2, STONE2, null), circle(30, -78, 2, STONE2, null));
/** A small pagoda (Japanese temple) of three roofs. */
const pagoda = (x: number, y: number, s = 1, col: string = '#c0563f') => at(x, y, s,
  ...range(3).map((i) => all(rect(-8 + i * 2, -14 - i * 14, 16 - i * 4, 10, '#f3e6c8', 0, C.ink, 1), path(`M${-18 + i * 4} ${-14 - i * 14} Q0 ${-22 - i * 14} ${18 - i * 4} ${-14 - i * 14} L${14 - i * 4} ${-18 - i * 14} L${-14 + i * 4} ${-18 - i * 14} Z`, col, C.ink, 1.1))),
  line('M0 -46 L0 -56', C.ink, 1.4), rect(-10, -4, 20, 4, '#9e978a', 0, C.ink, 1));
/** A villa front with a frontispiece, two windows each side, panel and a pitched roof. hl = outline the frontispiece. */
const villa = (hlFront = false, hlDormer = false, grey = false) => {
  const wall = grey ? C.grey2 : '#f0d68a', roof = grey ? C.grey : '#5a4a44';
  return all(
    rect(14, 62, 92, 50, wall, 0, C.ink, 1.6), ...range(9).map((i) => line(`M${24 + i * 10} 62 L${24 + i * 10} 112`, grey ? C.grey : '#d9b860', 0.7)),
    path('M8 62 L30 40 L90 40 L112 62 Z', roof, C.ink, 1.6),
    rect(44, 40, 32, 22, wall, 0, C.ink, 1.4), path('M40 40 L60 24 L80 40 Z', roof, C.ink, 1.5), circle(60, 34, 3.6, GLASS, C.ink, 1), win(53, 44, 14, 13),
    hlDormer ? all(rect(88, 44, 12, 10, wall, 0, C.ink, 1.2), path('M86 44 L94 37 L102 44 Z', roof, C.ink, 1.2), win(90.5, 46, 7, 7, false), ring(94, 46, 11)) : rect(88, 44, 12, 10, wall, 0, C.ink, 1.2) + path('M86 44 L94 37 L102 44 Z', roof, C.ink, 1.2) + win(90.5, 46, 7, 7, false),
    win(22, 70, 10, 14), win(38, 70, 10, 14), win(72, 70, 10, 14), win(88, 70, 10, 14), door(55, 112, 10, 18),
    hlFront ? path('M44 62 L44 40 L40 40 L60 22 L80 40 L76 40 L76 62', 'none', HL, 3) : '');
};
/** A long block of flats of n floors and m window bays, left edge x, ground y. */
const slab = (x: number, y: number, m: number, n: number, col: string = '#e8dcc6', w = 8, h = 9) => all(rect(x, y - n * h - 3, m * w + 4, n * h + 3, col, 0, C.ink, 1.3),
  ...range(n).flatMap((r) => range(m).map((c) => rect(x + 2 + c * w + 1.2, y - (r + 1) * h + 1.5, w - 2.4, h - 4.5, GLASS, 0.3, C.ink, 0.6))), rect(x - 1, y - n * h - 4.5, m * w + 6, 2, '#6a6a6a', 0, null));

// ── Furniture ────────────────────────────────────────────────────────
/** A wooden chair in side view facing right, seat front at (x, y). arms = armrest, hl = ring the armrest. */
const chairSide = (x: number, y: number, s = 1, o: { arms?: boolean; col?: string; hlArms?: boolean; grey?: boolean } = {}) => {
  const col = o.grey ? C.grey : (o.col ?? WOOD), ink = C.ink;
  return at(x, y, s, line('M-22 0 L-22 30 M0 0 L0 30', ink, 4.6), line('M-22 0 L-22 30 M0 0 L0 30', col, 3),
    line('M-22 0 L-26 -34', ink, 4.6), line('M-22 0 L-26 -34', col, 3), ...range(3).map((i) => line(`M${-23 - i * 0.2} ${-8 - i * 9} L${-25 - i * 0.4} ${-10 - i * 9}`, ink, 0.6)),
    rect(-25, -36, 6, 14, col, 1.5, ink, 1.2), rect(-24, -4, 26, 5, col, 1.5, ink, 1.3),
    o.arms ? all(line('M-23 -16 L2 -16 L0 -2', ink, 4.6), line('M-23 -16 L2 -16 L0 -2', col, 3)) : '',
    o.hlArms ? rect(-26, -21, 32, 10, 'none', 4, HL, 2.6) : '');
};
const vase = (x: number, y: number, s = 1, col: string = '#5f9fcf', deco: Svg = '') => at(x, y, s, path('M-5 0 C-10 -6 -10 -16 -4 -22 L-4 -28 L4 -28 L4 -22 C10 -16 10 -6 5 0 Z', col, C.ink, 1.3), deco);
const bowl = (x: number, y: number, s = 1, col: string = '#c4703e', grain = false) => at(x, y, s, path('M-14 -8 C-14 2 14 2 14 -8 Z', col, C.ink, 1.4), ellipse(0, -8, 14, 3, col, C.ink, 1.2),
  grain ? line('M-10 -5 C-4 -2 4 -2 10 -5 M-8 -3 C-2 -0.5 2 -0.5 8 -3', WOOD2, 0.8) : '');
const kettle = (x: number, y: number, s = 1, col: string = '#e8edf0', stripe: string = HL) => at(x, y, s, path('M-10 0 C-12 -10 -10 -20 0 -22 C10 -20 12 -10 10 0 Z', col, C.ink, 1.4), rect(-4, -26, 8, 4, C.dark, 1.5, C.ink, 1),
  path('M10 -16 C16 -18 18 -8 10 -4', 'none', C.ink, 2.4), path('M-10 -14 L-17 -20 L-15 -22 L-9 -18', col, C.ink, 1.2), line('M-10 -8 L10 -8', stripe, 2));
const glassCup = (x: number, y: number, s = 1, fill = 0.6) => at(x, y, s, path('M-6 -16 L6 -16 L5 0 L-5 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), rect(-5, f1(-16 * fill), 10, f1(16 * fill - 0.6), '#7fb8dc', 0.5, null));

// ── Motifs ───────────────────────────────────────────────────────────
export const ARCHD_MOTIFS: Record<string, Svg> = {
  // ── 4561 Arkitekturens stilar ──────────────────────────────────────
  // stildrag: the same round arched window with a flower above it on two different houses (ringed and joined); a grey house without it
  'archd.stildrag': all(outdoor(),
    rect(6, 40, 34, 64, STONE, 0, C.ink, 1.4), path('M4 40 L23 26 L42 40 Z', '#7a6a5a', C.ink, 1.3), win(10, 74, 7, 10), win(29, 74, 7, 10),
    path('M16 66 L16 52 A7 7 0 0 1 30 52 L30 66 Z', GLASS, C.ink, 1.3), circle(23, 45, 2.6, PINK, C.ink, 0.8), door(19, 104, 8, 12),
    rect(80, 60, 34, 44, '#f6e3c8', 0, C.ink, 1.4), path('M77 60 L97 44 L117 60 Z', '#c0563f', C.ink, 1.3), path('M90 86 L90 74 A7 7 0 0 1 104 74 L104 86 Z', GLASS, C.ink, 1.3), circle(97, 67, 2.6, PINK, C.ink, 0.8), door(93, 104, 8, 12),
    greyed(rect(46, 76, 26, 28, '#e0e0e0', 0, C.ink, 1.2), path('M44 76 L59 64 L74 76 Z', C.grey, C.ink, 1.2), win(50, 84, 7, 8), win(61, 84, 7, 8)),
    ring(23, 57, 11), ring(97, 79, 11), line('M34 52 Q60 30 86 74', HL, 1.8, '4 3')),
  // sekelskifteshus: a tall ornamented stone town house from around 1900 with a small copper tower
  'archd.sekelskifteshus': all(sky(), rect(0, 108, 120, 12, '#c9c3b6', 0, null), cloud(98, 22), stoneHouse(60, 110, 1, STONE), rect(0, 108, 26, 2, C.grey, 0, null)),
  // funkis: a white cube with a flat roof, ribbon windows and a round balcony
  'archd.funkis': all(outdoor(), cloud(24, 20), cloud(96, 26, 0.8), funkisHouse(58, 106, 1.15), tree(110, 106, 0.8)),
  // brutalism: a heavy grey concrete building with deep small windows and a tiny person in front
  'archd.brutalism': all(sky('#e6ebef'), rect(0, 104, 120, 16, '#c9c3b6', 0, null), brutalHouse(60, 106, 1.15), fig(100, 0.26, { top: C.red })),
  // miljonprogrammet: three long identical blocks of flats around a green yard with parked cars
  'archd.miljonprogrammet': all(outdoor(), cloud(100, 14, 0.8),
    slab(6, 52, 13, 4, '#e8dcc6', 8, 9), slab(16, 78, 12, 3, '#d9cbb0', 8, 8), rect(0, 80, 120, 4, GRASS, 0, null), slab(4, 104, 14, 3, '#efe4cf', 8, 8),
    ...[18, 46, 80].map((cx, i) => at(cx, 114, 0.9, rect(-8, -6, 16, 6, [C.red, C.denim, C.yellow][i]!, 2, C.ink, 1), circle(-5, 0, 2, C.dark, null), circle(5, 0, 2, C.dark, null)))),
  // postmodernism: pink and turquoise office with a big broken gable, round window and striped columns
  'archd.postmodernism': all(outdoor(), postmodHouse(60, 106, 1.15)),
  // monumental: a huge columned building with wide stairs; a tiny person and a small grey house for scale
  'archd.monumental': all(sky(), rect(0, 108, 120, 12, '#d8d1c2', 0, null),
    path('M14 30 L60 8 L106 30 Z', STONE, C.ink, 1.6), rect(16, 30, 88, 6, STONE2, 0, C.ink, 1.3),
    ...range(6).map((i) => all(rect(20 + i * 14.4, 36, 8, 52, WALLW, 0, C.ink, 1.2), line(`M${22.5 + i * 14.4} 38 L${22.5 + i * 14.4} 86 M${25.5 + i * 14.4} 38 L${25.5 + i * 14.4} 86`, C.grey2, 0.6))),
    ...range(4).map((i) => rect(10 + i * 3, 88 + i * 5, 100 - i * 6, 5, i % 2 ? STONE : STONE2, 0, C.ink, 1)),
    fig(60, 0.13, { top: C.red }, 108), greyed(rect(104, 96, 12, 12, '#e0e0e0', 0, C.ink, 1), path('M102 96 L110 89 L118 96 Z', C.grey, C.ink, 1)),
    line('M6 108 L6 10', HL, 1.4), path('M3 14 L6 8 L9 14 Z', HL, null)),
  // inspirerad: a small grey pagoda gives an idea (dashed arrow and light bulb) to a new house with the same stacked roofs
  'archd.inspirerad': all(outdoor(), greyed(pagoda(24, 104, 0.9)),
    line('M36 60 Q50 40 64 54', HL, 2, '4 3'), path('M60 50 L66 56 L58 58 Z', HL, null),
    at(50, 34, 1, circle(0, 0, 6, C.yellow, C.ink, 1.2), rect(-3, 5, 6, 4, C.grey, 1, C.ink, 1), line('M-10 -6 L-7 -4 M10 -6 L7 -4 M0 -11 L0 -8', C.gold, 1.6)),
    rect(68, 80, 44, 24, WALLW, 0, C.ink, 1.4), path('M62 80 Q90 72 118 80 L112 74 L68 74 Z', '#3d3f4a', C.ink, 1.2),
    rect(74, 60, 32, 14, WALLW, 0, C.ink, 1.3), path('M68 60 Q90 54 112 60 L106 55 L74 55 Z', '#3d3f4a', C.ink, 1.2), rect(72, 84, 18, 10, GLASS, 0, C.ink, 1), win(80, 62, 18, 9, false), door(96, 104, 8, 14, WOOD)),
  // omdebatterad: a new building with people around it: two speech bubbles for (ticks) and two against (crosses)
  'archd.omdebatterad': all(outdoor(), rect(42, 30, 36, 74, GLASS, 0, C.ink, 1.5), ...range(6).map((i) => line(`M42 ${40 + i * 11} L78 ${40 + i * 11}`, GLASS2, 1)), line('M54 30 L54 104 M66 30 L66 104', GLASS2, 1),
    M(14, 0.42, { armR: [[16, -64], [24, -74]] }), W(30, 0.4, { armL: [[-16, -64], [-24, -72]] }), M(92, 0.42, { top: C.yellow, mouth: 'frown' }), W(108, 0.4, { top: C.purple, mouth: 'frown' }),
    bubble(4, 46, 18, 12, 12, 64, tick(13, 52, 0.6)), bubble(24, 30, 18, 12, 30, 68, tick(33, 36, 0.6)), bubble(86, 30, 18, 12, 92, 66, cross(95, 36, 0.6)), bubble(100, 46, 18, 12, 106, 66, cross(109, 52, 0.6))),

  // ── 4562 Fasader och detaljer ──────────────────────────────────────
  // platt tak: a grey house with a pitched roof beside a coloured house whose flat roof is outlined
  'archd.platt-tak': all(outdoor(), greyed(rect(8, 70, 36, 34, '#e0e0e0', 0, C.ink, 1.3), path('M4 70 L26 48 L48 70 Z', C.grey, C.ink, 1.3), win(14, 80, 8, 9), win(30, 80, 8, 9)),
    rect(56, 56, 58, 48, WALLW, 0, C.ink, 1.6), rect(53, 51, 64, 6, '#d9d4c8', 0, C.ink, 1.4), win(62, 66, 18, 10, false), win(88, 66, 18, 10, false), door(78, 104, 9, 15, '#3f6fb5'),
    rect(50, 47, 70, 13, 'none', 3, HL, 2.6)),
  // takkupa: the roof slope of a house with two small window boxes; one is ringed
  'archd.takkupa': all(outdoor(), rect(10, 76, 100, 28, '#c0563f', 0, C.ink, 1.6), path('M4 76 L22 34 L98 34 L116 76 Z', '#5a4a44', C.ink, 1.6),
    ...range(4).map((i) => line(`M${10 + i * 2} ${66 - i * 9} L${110 - i * 2} ${66 - i * 9}`, '#4a3c37', 0.7)),
    ...[34, 78].map((cx) => all(rect(cx - 9, 50, 18, 16, WALLW, 0, C.ink, 1.3), path(`M${cx - 12} 50 L${cx} 41 L${cx + 12} 50 Z`, '#5a4a44', C.ink, 1.3), win(cx - 5, 53, 10, 10))),
    win(20, 84, 10, 12), win(46, 84, 10, 12), win(90, 84, 10, 12), door(66, 104, 10, 18, WALLW), ring(78, 52, 17)),
  // frontespis: a yellow villa whose centre wall rises above the eaves with its own small gable (outlined)
  'archd.frontespis': all(outdoor(), villa(true)),
  // burspråk: a stone facade with a three-sided window bay that sticks out; ringed
  'archd.burspråk': all(sky(), rect(4, 4, 112, 108, STONE, 0, C.ink, 1.4), ...range(3).map((i) => line(`M4 ${30 + i * 34} L116 ${30 + i * 34}`, STONE2, 1.4)),
    win(12, 40, 12, 18), win(96, 40, 12, 18), win(12, 80, 12, 18), win(96, 80, 12, 18),
    path('M34 34 L44 28 L76 28 L86 34 L86 92 L76 98 L44 98 L34 92 Z', '#e0c99a', C.ink, 1.6), path('M34 34 L44 28 L76 28 L86 34 Z', '#7a6a5a', C.ink, 1.3),
    path('M37 42 L44 38 L44 88 L37 84 Z M83 42 L76 38 L76 88 L83 84 Z', GLASS2, C.ink, 1.1), rect(48, 38, 24, 50, GLASS, 0, C.ink, 1.2), line('M60 38 L60 88 M48 60 L72 60', '#e0c99a', 1.6),
    path('M34 92 L44 98 L76 98 L86 92 L80 104 L40 104 Z', STONE2, C.ink, 1.2), ring(60, 64, 40)),
  // loftgång: a block of flats with open walkways outside each floor; the top walkway is outlined and a person walks on it
  'archd.loftgång': all(outdoor(), rect(10, 24, 100, 80, '#e8dcc6', 0, C.ink, 1.6),
    ...range(3).map((r) => all(rect(8, 46 + r * 26, 104, 3, CONC, 0, C.ink, 1.1), line(`M8 ${36 + r * 26} L112 ${36 + r * 26}`, C.ink, 1.2), ...range(14).map((i) => line(`M${12 + i * 7.5} ${36 + r * 26} L${12 + i * 7.5} ${46 + r * 26}`, C.ink, 0.7)),
      ...range(4).map((i) => all(door(18 + i * 25, 46 + r * 26, 7, 14, ['#3f6fb5', C.red, C.green, C.yellow][(i + r) % 4]!), win(28 + i * 25, 33 + r * 26, 6, 7, false))))),
    fig(64, 0.2, { top: C.orange }, 46), rect(6, 31, 108, 20, 'none', 3, HL, 2.4)),
  // smidesräcke: close-up of a balcony with a black iron railing of curls and flowers
  'archd.smidesräcke': all(rect(0, 0, 120, 120, STONE, 0, null), win(36, 8, 48, 44), rect(10, 86, 100, 8, STONE2, 0, C.ink, 1.4),
    line('M12 52 L108 52 M12 86 L12 52 M108 86 L108 52', IRON, 3),
    ...range(4).map((i) => all(line(`M${24 + i * 24} 54 L${24 + i * 24} 86`, IRON, 2), path(`M${24 + i * 24} 70 C${14 + i * 24} 70 ${14 + i * 24} 60 ${20 + i * 24} 60 C${24 + i * 24} 60 ${24 + i * 24} 65 ${21 + i * 24} 65`, 'none', IRON, 1.8),
      path(`M${24 + i * 24} 70 C${34 + i * 24} 70 ${34 + i * 24} 80 ${28 + i * 24} 80 C${24 + i * 24} 80 ${24 + i * 24} 75 ${27 + i * 24} 75`, 'none', IRON, 1.8))),
    ...range(3).map((i) => at(36 + i * 24, 66, 1, ...range(5).map((k) => { const a = (k / 5) * Math.PI * 2; return circle(f1(Math.cos(a) * 3.4), f1(Math.sin(a) * 3.4), 2.2, IRON, null); }), circle(0, 0, 1.6, C.gold, null))),
    line('M12 82 L108 82', IRON, 1.6)),
  // listverk: a facade with long white profiled bands round the window and under the roof (outlined), with a cut through one band
  'archd.listverk': all(rect(0, 0, 120, 120, '#e7c7a0', 0, null),
    rect(0, 10, 120, 6, WALLW, 0, C.ink, 1.2), rect(0, 16, 120, 3, '#e6e1d6', 0, C.ink, 0.9), rect(0, 19, 120, 2, WALLW, 0, C.ink, 0.8),
    rect(32, 36, 40, 56, WALLW, 0, C.ink, 1.3), win(38, 42, 28, 44), rect(28, 92, 48, 5, WALLW, 0, C.ink, 1.2), rect(28, 31, 48, 5, WALLW, 0, C.ink, 1.2),
    rect(0, 104, 120, 5, WALLW, 0, C.ink, 1.2),
    at(98, 60, 1, circle(0, 0, 14, C.white, C.ink, 1.3), path('M-8 -8 L4 -8 L4 -4 L8 -4 L8 0 L4 0 C6 3 6 6 2 8 L-8 8 Z', WALLW, C.ink, 1.2), line('M-8 -8 L-8 8', '#e7c7a0', 3)),
    line('M84 52 L72 34', C.ink, 1, '2 2'),
    frame(0, 8, 120, 15), frame(26, 29, 52, 70)),
  // glasfasad: a tall office building that is all glass, reflecting clouds
  'archd.glasfasad': all(outdoor(), cloud(20, 22), rect(28, 10, 64, 94, GLASS, 0, C.ink, 1.6),
    ...range(9).map((i) => line(`M28 ${20 + i * 10} L92 ${20 + i * 10}`, GLASS2, 1.2)), ...range(5).map((i) => line(`M${38.7 + i * 10.7} 10 L${38.7 + i * 10.7} 104`, GLASS2, 1.2)),
    path('M50 26 C48 22 54 20 56 23 C58 20 64 22 62 26 Z', C.white, null), path('M70 54 C68 50 74 48 76 51 C78 48 84 50 82 54 Z', C.white, null), path('M30 60 L58 32 L64 32 L30 66 Z', 'rgba(255,255,255,0.5)', null),
    rect(52, 90, 16, 14, '#7fb8dc', 0, C.ink, 1.2), tree(16, 104, 0.8), tree(104, 104, 0.8)),

  // ── 4563 Möbeldesign ───────────────────────────────────────────────
  // formgivare: a woman at a desk draws a chair on paper; a small model chair stands on the desk
  'archd.formgivare': all(room(), floor(104), line('M64 104 L74 64 M104 104 L94 64', WOOD2, 3), rect(56, 16, 56, 50, C.white, 2, C.ink, 1.5),
    at(88, 52, 0.62, path('M-22 0 L-22 30 M0 0 L0 30 M-22 0 L-26 -34 M-24 -4 L2 -4', 'none', C.navy, 2.6)), line('M66 30 L72 26 M66 58 L74 58', C.grey2, 1),
    W(36, 0.66, { top: C.purple, bottom: C.navy, armR: [[16, -60], [32, -66]] }, 104), g('translate(60 42) rotate(30)', rect(-1.6, -12, 3.2, 12, C.yellow, 0.8, C.ink, 0.8)),
    rect(4, 96, 22, 8, WOOD, 1, C.ink, 1), at(15, 96, 0.22, chairSide(10, -30, 1, { col: C.orange })), ring(84, 44, 20)),
  // möbelsnickare: a man at a workbench planes a board; shavings curl off, a half-built chair stands behind
  'archd.möbelsnickare': all(room('#f1e6d4'), floor(104), rect(8, 78, 104, 6, WOOD2, 1.5, C.ink, 1.4), line('M14 84 L14 104 M106 84 L106 104', WOOD2, 4),
    rect(40, 72, 60, 6, WOOD, 1, C.ink, 1.1), M(28, 0.62, { top: C.denim, armR: [[14, -50], [34, -40]] }, 104),
    at(58, 70, 1, rect(-6, -5, 14, 6, '#b05a2a', 1.5, C.ink, 1.1), rect(-3, -8, 4, 3, C.dark, 0.5, null)),
    ...[72, 80, 88].map((x, i) => path(`M${x} ${70 - i} C${x + 4} ${64 - i} ${x + 9} ${68 - i} ${x + 5} ${72 - i}`, 'none', '#e2b27a', 1.6)),
    at(98, 63, 0.5, chairSide(0, 0, 1)), line('M10 40 L40 40', C.grey, 2), path('M12 40 L12 34 L36 34 L38 40', 'none', C.grey, 1.2)),
  // karmstol: a wooden chair with armrests (ringed); a grey plain chair behind
  'archd.karmstol': all(room(), floor(104), greyed(at(36, 85.4, 0.62, chairSide(0, 0, 1))), chairSide(78, 72.5, 1.05, { arms: true, col: WOOD, hlArms: true })),
  // vilstol: a woman half-lying in a long low lounge chair with a curved frame, reading
  'archd.vilstol': all(room(), floor(104),
    path('M18 104 C22 96 26 92 32 90 L70 84 C78 82 84 70 88 52', 'none', C.ink, 5.4), path('M18 104 C22 96 26 92 32 90 L70 84 C78 82 84 70 88 52', 'none', WOOD, 3.6),
    path('M26 94 L70 86 C78 84 82 72 86 56 L92 58 C88 74 84 88 72 92 L30 99 Z', '#e9c46a', C.ink, 1.3), line('M30 104 L40 90 M76 104 L74 88', WOOD2, 3),
    g('translate(52 84) rotate(-28)', sitSide(0, 0, 0.9, -1, { top: C.green, lean: 0 })),
    rect(40, 62, 10, 8, C.red, 1, C.ink, 1)),
  // sittkomfort: a relaxed smiling person in a soft armchair with hearts; a grey person frowning on a hard stool
  'archd.sittkomfort': all(room(), floor(104),
    path('M48 104 L48 70 C48 62 56 60 60 60 L94 60 C102 60 106 66 106 74 L106 104 Z', '#5aa0b8', C.ink, 1.6), rect(52, 82, 52, 12, '#7ec0d4', 6, C.ink, 1.3), rect(44, 76, 10, 24, '#5aa0b8', 5, C.ink, 1.3), rect(100, 76, 10, 24, '#5aa0b8', 5, C.ink, 1.3),
    sitSide(64, 84, 0.95, 1, { top: C.orange, lean: 18 }), heart(92, 40, 0.5), heart(102, 30, 0.38),
    greyed(rect(10, 86, 22, 4, C.grey, 1, C.ink, 1), line('M12 90 L12 104 M30 90 L30 104', C.ink, 2.4), sitSide(16, 84, 0.7, 1, { grey: true, mouth: 'frown' }))),
  // böjträ: a café chair whose back and legs are bent wood in smooth curves (ringed); a straight stick bends into a curve
  'archd.böjträ': all(room(), floor(104),
    path('M44 104 C44 90 46 80 48 72 M76 104 C76 90 74 80 72 72', 'none', C.ink, 5), path('M44 104 C44 90 46 80 48 72 M76 104 C76 90 74 80 72 72', 'none', '#7a4b2a', 3.4),
    ellipse(60, 72, 18, 4, '#7a4b2a', C.ink, 1.4), path('M46 70 C40 50 44 24 60 22 C76 24 80 50 74 70', 'none', C.ink, 5), path('M46 70 C40 50 44 24 60 22 C76 24 80 50 74 70', 'none', '#7a4b2a', 3.4),
    path('M50 66 C46 50 50 34 60 32 C70 34 74 50 70 66', 'none', C.ink, 4), path('M50 66 C46 50 50 34 60 32 C70 34 74 50 70 66', 'none', '#7a4b2a', 2.4), ellipse(60, 92, 12, 3, 'none', '#7a4b2a', 2),
    ring(60, 44, 26), line('M90 30 L110 30', '#b07a48', 4), arrow(100, 36, 100, 48, HL, 2.2), path('M88 66 C92 54 108 54 112 66', 'none', '#b07a48', 4)),
  // faner: a cut through a board: a thick plain core and a very thin layer of patterned wood on top that peels at the corner
  'archd.faner': all(room(), rect(10, 56, 92, 30, '#d8c9a8', 0, C.ink, 1.6), ...range(40).map((i) => circle(14 + (i * 37) % 86, 60 + (i * 13) % 24, 0.9, '#b7a57f', null)),
    path('M10 52 L92 52 C98 52 102 46 110 38 L112 42 C104 50 100 56 92 56 L10 56 Z', '#b9783f', C.ink, 1.4), line('M14 54 C30 52 50 55 70 53 C80 52 88 54 92 54', '#8a5228', 0.8),
    ring(100, 46, 12), arrow(100, 18, 100, 32, HL, 2.2), line('M10 92 L102 92', C.ink, 1, '3 2'), rect(14, 94, 20, 14, '#b9783f', 1, C.ink, 1), rect(14, 94, 20, 2, '#8a5228', 0, null)),

  // ── 4564 Industridesign ────────────────────────────────────────────
  // industridesign: a drawing of a kettle on a board turns (arrow) into identical kettles coming off a factory belt
  'archd.industridesign': all(room(), rect(6, 18, 40, 46, C.white, 2, C.ink, 1.4), at(26, 56, 1, path('M-10 0 C-12 -10 -10 -20 0 -22 C10 -20 12 -10 10 0 Z', 'none', C.navy, 1.2), path('M10 -16 C16 -18 18 -8 10 -4', 'none', C.navy, 1.2), line('M-12 4 L12 4 M0 -30 L0 -24', C.grey, 0.8, '2 2')),
    line('M18 64 L12 80 M34 64 L40 80', C.ink, 1.6), arrow(50, 42, 66, 42, HL, 3),
    rect(60, 88, 58, 6, C.dark, 3, C.ink, 1.3), ...range(4).map((i) => circle(66 + i * 15, 91, 2, C.grey, null)), ...[72, 90, 108].map((x) => kettle(x, 88, 0.62)),
    rect(68, 34, 50, 30, '#c9ced4', 0, C.ink, 1.3), path('M68 34 L80 24 L80 34 L92 24 L92 34 L104 24 L104 34 L118 24 L118 34', '#c9ced4', C.ink, 1.3), rect(104, 8, 6, 18, '#9aa3ad', 0, C.ink, 1), rect(76, 46, 18, 18, '#3d3f4a', 0, C.ink, 1)),
  // formge: a hand with a pencil draws, and a lamp takes shape on the paper (the lamp grows in, the pencil moves)
  'archd.formge': all(room(), rect(14, 14, 92, 84, C.white, 2, C.ink, 1.5), line('M20 90 L100 90', C.grey2, 1),
    moving('archd-formge-lamp', '0%{opacity:0;transform:scale(.4)}60%,100%{opacity:1;transform:scale(1)}', { dur: 3, spin: true },
      path('M44 42 L76 42 L84 58 L36 58 Z', C.orange, C.ink, 1.4), line('M60 58 L60 82', C.ink, 2.2), ellipse(60, 84, 14, 3.5, C.dark, C.ink, 1.2), ellipse(60, 59, 6, 2, '#fff3b0', null)),
    moving('archd-formge-pen', '0%{transform:translate(-30px,-8px)}50%{transform:translate(-10px,6px)}100%{transform:translate(0,0)}', { dur: 3 },
      g('translate(86 64) rotate(35)', rect(-2.5, -28, 5, 26, C.yellow, 1, C.ink, 1.1), path('M-2.5 -2 L2.5 -2 L0 4 Z', '#f1c7a1', C.ink, 0.9), rect(-2.5, -31, 5, 3, C.pink, 0.5, C.ink, 0.8)),
      path('M92 70 C98 68 106 72 110 80 L116 96 L100 100 L90 84 C86 80 88 72 92 70 Z', C.skin, C.ink, 1.3))),
  // användartest: a man tries to open a new kettle and wonders; a designer behind him writes notes on a clipboard
  'archd.användartest': all(room(), floor(104), rect(8, 76, 70, 5, WOOD, 1.5, C.ink, 1.3), line('M14 81 L14 104 M72 81 L72 104', WOOD2, 3),
    M(30, 0.6, { top: C.yellow, armR: [[14, -56], [24, -50]], mouth: 'o' }, 104), kettle(52, 76, 0.75), qmark(40, 20, 1.1),
    W(98, 0.66, { top: C.purple, armL: [[-14, -56], [-12, -48]], armR: [[14, -56], [6, -48]], front: all(rect(-12, -60, 16, 20, C.tan, 1.5, C.ink, 1.1), line('M-9 -54 L1 -54 M-9 -50 L-1 -50 M-9 -46 L0 -46', C.grey, 0.9)) }, 104)),
  // formspråk: a kettle, a toaster and a lamp that share the same round shapes and orange band; below, a grey mixed set
  'archd.formspråk': all(room(),
    kettle(24, 60, 1.05, '#f2f2ee'), at(60, 60, 1, rect(-14, -22, 28, 22, '#f2f2ee', 9, C.ink, 1.4), line('M-14 -8 L14 -8', HL, 2), line('M-6 -22 L-6 -26 M6 -22 L6 -26', C.ink, 1.6)),
    at(96, 60, 1, path('M-10 -18 C-10 -32 10 -32 10 -18 Z', '#f2f2ee', C.ink, 1.4), line('M-10 -20 L10 -20', HL, 2), line('M0 -18 L0 -2', C.ink, 1.8), ellipse(0, 0, 9, 2.4, '#f2f2ee', C.ink, 1.2)),
    frame(6, 22, 108, 44),
    greyed(at(26, 108, 0.6, rect(-12, -26, 24, 26, '#ddd', 0, C.ink, 1.3), path('M12 -20 L18 -20 L18 -6 L12 -6', 'none', C.ink, 1.6)), at(60, 108, 0.6, path('M-16 0 L-10 -24 L10 -24 L16 0 Z', '#ddd', C.ink, 1.3)), at(94, 108, 0.6, path('M-12 -30 L12 -30 L4 -16 L-4 -16 Z', '#ddd', C.ink, 1.3), line('M0 -16 L0 0', C.ink, 1.6)))),

  // ── 4565 Funktion och estetik ──────────────────────────────────────
  // estetik: a big eye looks at a beautiful vase with flowers and sparkles; a grey lumpy vase at the side
  'archd.estetik': all(room(), at(60, 22, 1, path('M-18 0 Q0 -14 18 0 Q0 14 -18 0 Z', C.white, C.ink, 1.6), circle(0, 0, 6, '#5a8fc0', C.ink, 1.2), circle(0, 0, 2.6, C.ink, null), circle(1.6, -1.6, 1, C.white, null)),
    line('M60 34 L60 44', C.grey, 1, '2 2'), vase(60, 102, 1.6, '#5f9fcf', line('M-6 -10 C-2 -6 2 -6 6 -10', C.white, 1)),
    ...[[-8, -42], [0, -50], [8, -44]].map(([dx, dy]) => all(line(`M60 58 L${60 + dx!} ${58 + dy! + 30}`, GREEN, 1.6), circle(60 + dx!, 58 + dy! + 28, 4, [PINK, C.yellow, PINK][(dx! + 8) / 8]!, C.ink, 1))),
    sparkle(34, 66, 5), sparkle(88, 60, 4), heart(90, 84, 0.45),
    greyed(at(16, 102, 0.9, path('M-6 0 C-12 -4 -6 -10 -9 -16 C-6 -22 2 -18 4 -24 L7 -22 C6 -14 12 -8 6 0 Z', '#ddd', C.ink, 1.2)))),
  // funktionell: a coloured jug pours neatly into a glass (tick); a small grey jug beside it spills
  'archd.funktionell': all(room(), floor(100),
    g('translate(48 56) rotate(-35)', path('M-12 22 L-14 -10 L-4 -16 L10 -16 L12 22 Z', '#4f9d69', C.ink, 1.6), path('M-14 -10 L-22 -16 L-10 -16 Z', '#4f9d69', C.ink, 1.3), path('M12 -6 C22 -6 22 14 12 14', 'none', C.ink, 2.4)),
    path('M28 50 C30 60 34 72 40 82', 'none', '#7fb8dc', 2.6), glassCup(42, 100, 1.3, 0.6), tick(74, 22, 1.1),
    greyed(g('translate(96 82) rotate(-35) scale(0.5)', path('M-12 22 L-14 -10 L10 -16 L12 22 Z', '#ddd', C.ink, 1.6), path('M12 -6 C22 -6 22 14 12 14', 'none', C.ink, 2.4)), line('M86 80 C84 88 88 92 84 98 M90 86 L92 96', '#7fb8dc', 1.2))),
  // opraktisk: a coloured cup with its handle on the inside spills when lifted (cross); a small grey normal cup beside it
  'archd.opraktisk': all(room(), floor(100),
    g('translate(50 66) rotate(20)', path('M-16 -20 L16 -20 L13 14 C13 18 -13 18 -13 14 Z', '#e07a5f', C.ink, 1.6), path('M-6 -16 C2 -16 2 -2 -6 -2', 'none', C.ink, 2.4), ellipse(0, -20, 16, 3.5, '#7a4b2a', C.ink, 1.2)),
    path('M70 52 C76 58 74 70 80 78 M74 60 C78 70 82 76 86 92', 'none', '#7a4b2a', 2), circle(82, 98, 3, '#7a4b2a', null), circle(90, 99, 2, '#7a4b2a', null),
    cross(22, 26, 1.1), greyed(at(100, 100, 0.55, path('M-12 -24 L12 -24 L10 0 L-10 0 Z', '#ddd', C.ink, 1.6), path('M12 -18 C22 -18 22 -6 11 -6', 'none', C.ink, 2.4)))),
  // form följer funktion: two rows – what a thing must do (water drop, a cut) leads by an arrow to its shape (a jug, a knife)
  'archd.form-följer-funktion': all(room(),
    at(22, 34, 1, path('M0 -12 C6 -4 8 2 8 5 C8 10 4 13 0 13 C-4 13 -8 10 -8 5 C-8 2 -6 -4 0 -12 Z', '#7fb8dc', C.ink, 1.4)), arrow(38, 34, 64, 34, HL, 3),
    at(88, 50, 1, path('M-12 0 L-14 -26 L-6 -30 L10 -30 L12 0 Z', '#4f9d69', C.ink, 1.5), path('M-14 -26 L-22 -32 L-8 -30 Z', '#4f9d69', C.ink, 1.2), path('M12 -22 C22 -22 22 -6 12 -6', 'none', C.ink, 2.2)),
    at(22, 86, 1, line('M-10 8 L10 -8', C.ink, 2, '3 2'), path('M-12 -2 L-6 -8 M6 8 L12 2', 'none', C.ink, 1.4)), arrow(38, 86, 64, 86, HL, 3),
    at(88, 88, 1, path('M-20 4 L6 4 L22 -2 L6 -6 L-20 -6 Z', '#c9ced4', C.ink, 1.4), rect(-24, -7, 12, 12, WOOD2, 2, C.ink, 1.2))),
  // stilren: a clean shelf with one vase and one bowl and lots of space; a small grey shelf full of clutter
  'archd.stilren': all(room('#f4f1ea'), rect(14, 70, 70, 4, WALLW, 0, C.ink, 1.4), vase(34, 70, 1.1, WALLW), bowl(64, 70, 0.8, '#d9d4c8'), rect(14, 100, 70, 4, WALLW, 0, C.ink, 1.4), rect(26, 88, 20, 12, '#c9ced4', 1, C.ink, 1.1),
    sparkle(90, 40, 4),
    greyed(rect(88, 74, 28, 2, '#ddd', 0, C.ink, 0.8), ...range(7).map((i) => rect(89 + i * 3.8, 62 - (i % 3) * 3, 3.2, 12 + (i % 3) * 3, ['#bbb', '#999', '#ccc'][i % 3]!, 0.5, C.ink, 0.6)), circle(100, 56, 3, '#aaa', C.ink, 0.6), rect(88, 98, 28, 2, '#ddd', 0, C.ink, 0.8), ...range(5).map((i) => circle(91 + i * 5.5, 94 - (i % 2) * 3, 3, '#bbb', C.ink, 0.6)))),
  // dekorativ: a plate on the wall full of patterns and flowers, with sparkles; a small grey plain plate on a table
  'archd.dekorativ': all(room('#f4f1ea'), line('M52 10 L60 18 L68 10', C.ink, 1),
    circle(60, 50, 32, C.white, C.ink, 1.6), circle(60, 50, 26, 'none', '#3f6fb5', 2), circle(60, 50, 14, '#f6e3c8', C.ink, 1),
    ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(60 + Math.cos(a) * 20), f1(50 + Math.sin(a) * 20), 3.4, i % 2 ? PINK : '#3f6fb5', C.ink, 0.7); }),
    ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return ellipse(f1(60 + Math.cos(a) * 7), f1(50 + Math.sin(a) * 7), 3, 1.6, C.green, null); }), circle(60, 50, 3, C.yellow, C.ink, 0.8),
    sparkle(22, 24, 5), sparkle(98, 26, 4),
    greyed(rect(76, 104, 40, 4, '#ccc', 1, C.ink, 1), ellipse(96, 102, 14, 3, '#eee', C.ink, 1.2))),
  // materialkänsla: a hand strokes a wooden bowl with visible grain and sparkles; a small grey painted bowl
  'archd.materialkänsla': all(room(), floor(100), bowl(56, 98, 2.4, '#c99a62', true),
    path('M60 52 C70 48 82 52 88 58 L100 70 L92 76 L82 66 C76 62 66 62 60 60 Z', C.skin, C.ink, 1.3), line('M64 54 L74 54 M66 58 L76 58', C.ink, 0.6),
    sparkle(26, 64, 4), sparkle(36, 52, 3), line('M30 82 C40 78 72 78 84 82', WOOD2, 0.8),
    greyed(bowl(104, 100, 0.8, '#d0d0d0'))),
  // lagom: three bowls of rice: too little (grey), just right (coloured, tick), far too much spilling over (grey)
  'archd.lagom': all(room(), floor(96),
    greyed(at(22, 96, 1, path('M-14 -8 C-14 2 14 2 14 -8 Z', '#ddd', C.ink, 1.4), ellipse(0, -8, 14, 3, '#eee', C.ink, 1.2), ellipse(0, -9, 4, 1.4, C.white, null))),
    at(60, 96, 1.25, path('M-14 -8 C-14 2 14 2 14 -8 Z', '#3f6fb5', C.ink, 1.4), path('M-13 -8 C-12 -15 12 -15 13 -8 Z', C.white, C.ink, 1.1)), tick(60, 58, 1.1),
    greyed(at(98, 96, 1, path('M-14 -8 C-14 2 14 2 14 -8 Z', '#ddd', C.ink, 1.4), path('M-15 -8 C-14 -30 14 -30 15 -8 Z', C.white, C.ink, 1.1), circle(-17, -2, 2, C.white, C.ink, 0.6), circle(18, -1, 2, C.white, C.ink, 0.6)))),

  // ── 4566 Hållbar design ────────────────────────────────────────────
  // hållbarhet (för miljön): the earth with a leaf, and a chair that goes round in a loop of green arrows
  'archd.hållbarhet.2': all(room('#eef6ea'), circle(60, 60, 22, '#7fb8dc', C.ink, 1.6), path('M46 50 C52 44 58 52 64 48 C70 46 72 56 66 62 C60 66 54 60 48 64 Z', '#6fa45a', null),
    path('M60 18 C40 18 22 34 22 56', 'none', GREEN, 3.4), path('M18 50 L22 60 L28 50 Z', GREEN, null), path('M98 64 C98 86 80 102 60 102', 'none', GREEN, 3.4), path('M102 70 L98 60 L92 70 Z', GREEN, null),
    path('M80 16 C92 12 100 20 98 30 C88 32 80 26 80 16 Z', '#6fa45a', C.ink, 1.2), line('M82 18 L96 28', C.ink, 0.8), at(102, 100, 0.34, chairSide(0, 0, 1)), at(16, 36, 0.3, chairSide(0, 0, 1))),
  // materialval: a hand chooses a wood sample with a leaf (tick) instead of a grey plastic sample
  'archd.materialval': all(room(), rect(14, 70, 30, 22, '#c99a62', 2, C.ink, 1.4), line('M17 76 C26 74 34 78 41 75 M17 84 C26 82 34 86 41 83', WOOD2, 0.8), path('M24 62 C30 54 40 56 40 62 C34 66 28 66 24 62 Z', '#6fa45a', C.ink, 1),
    greyed(rect(76, 70, 30, 22, '#cfd6dc', 5, C.ink, 1.4)), tick(29, 104, 0.9), qmark(60, 40, 1.2),
    path('M40 40 C44 30 54 28 58 34 L52 52 L44 58 Z', C.skin, C.ink, 1.3), line('M40 40 L30 64', C.ink, 1, '2 2'), frame(10, 52, 38, 44)),
  // reparerbar: an opened toaster held by screws; a new part slides in and a screwdriver waits (tick); a grey glued box with a cross
  'archd.reparerbar': all(room(), floor(104), rect(14, 54, 56, 50, '#c9ced4', 6, C.ink, 1.6), rect(20, 60, 44, 38, '#3d3f4a', 2, C.ink, 1.1), ...[[18, 58], [66, 58], [18, 100], [66, 100]].map(([x, y]) => circle(x!, y!, 2, C.silver, C.ink, 0.8)),
    rect(26, 66, 14, 26, '#e07a5f', 1, C.ink, 1), rect(44, 66, 14, 26, C.orange, 1, C.ink, 1.1), arrow(51, 40, 51, 60, GREEN, 2.4),
    g('translate(86 52) rotate(40)', rect(-3, -14, 6, 16, C.red, 2, C.ink, 1.1), line('M0 2 L0 18', C.silver, 2.4)), tick(32, 30, 1),
    greyed(rect(84, 82, 26, 22, '#ddd', 4, C.ink, 1.2), path('M86 84 C92 88 100 86 108 90', 'none', '#bbb', 2), cross(97, 70, 0.8))),
  // modulär: a sofa of three equal blocks; a fourth block slides in from the side to make it longer
  'archd.modulär': all(room(), floor(100), ...range(3).map((i) => all(rect(8 + i * 26, 74, 26, 22, '#5aa0b8', 4, C.ink, 1.4), rect(8 + i * 26, 58, 26, 16, '#4a8aa0', 4, C.ink, 1.3))),
    moving('archd-modular', '0%{transform:translate(14px,-6px);opacity:.3}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, rect(88, 74, 26, 22, C.orange, 4, C.ink, 1.4), rect(88, 58, 26, 16, '#d9752e', 4, C.ink, 1.3)),
    line('M8 100 L8 104 M112 100 L112 104', C.ink, 2), arrow(112, 40, 98, 40, HL, 2.4)),
  // restmaterial: a board is cut into a shape, and the leftover pieces become a small stool (arrow)
  'archd.restmaterial': all(room(), rect(6, 22, 66, 34, '#e2b27a', 1, C.ink, 1.4), path('M14 28 L52 28 C60 28 64 34 64 40 C64 46 60 50 52 50 L14 50 Z', 'none', C.ink, 1.2, ) , path('M14 28 L52 28 C60 28 64 34 64 40 C64 46 60 50 52 50 L14 50 Z', 'rgba(255,255,255,0.35)', null),
    ...[[56, 22, 16, 8], [62, 46, 10, 10], [6, 22, 8, 34]].map(([x, y, w, h]) => rect(x!, y!, w!, h!, C.orange, 0.5, C.ink, 1.1)), frame(4, 20, 70, 38),
    arrow(60, 66, 76, 80, HL, 2.6),
    rect(76, 80, 36, 6, C.orange, 1, C.ink, 1.3), ...[80, 90, 98, 106].map((x, i) => rect(x, 86, 5, 18, i % 2 ? '#e2b27a' : C.orange, 0.5, C.ink, 1)), floor(104)),

  // ── 4567 Designhistoria ────────────────────────────────────────────
  // formgivning: the way from a drawing on paper to a model to a finished chair, with arrows between
  'archd.formgivning': all(room(), floor(100),
    rect(4, 54, 30, 36, C.white, 1, C.ink, 1.2), at(22, 82, 0.55, chairSide(0, 0, 1, { col: 'none' })), arrow(36, 76, 44, 76, HL, 2.2),
    at(64, 92, 0.6, chairSide(0, 0, 1, { col: '#e8dcc6' })), arrow(72, 76, 80, 76, HL, 2.2),
    chairSide(108, 70, 0.9, { col: C.orange })),
  // brukskonst: beautiful things for everyday use on a table – a glass vase, a bowl and a woven cloth
  'archd.brukskonst': all(room('#f4ece0'), rect(6, 84, 108, 6, WOOD, 1.5, C.ink, 1.4), line('M12 90 L12 112 M108 90 L108 112', WOOD2, 3),
    rect(20, 80, 80, 4, C.red, 0, C.ink, 1), ...range(10).map((i) => line(`M${22 + i * 8} 80 L${22 + i * 8} 84`, C.white, 1.4)),
    at(36, 80, 1.4, path('M-6 0 C-11 -8 -10 -18 -4 -24 L-4 -32 L4 -32 L4 -24 C10 -18 11 -8 6 0 Z', 'rgba(120,190,220,0.6)', C.ink, 1.2), line('M-2 -28 L-3 -6', C.white, 1.2)),
    bowl(76, 80, 1.3, '#4f7fb5'), line('M62 72 C70 74 82 74 90 72', C.white, 1.2), sparkle(56, 34, 4), sparkle(96, 44, 3)),
  // modernism: a steel-tube chair and simple white shapes in colour; a grey carved chair with curls beside
  'archd.modernism': all(room(), floor(104),
    path('M24 104 L24 86 L54 86 L58 104 M24 86 L22 54 L28 54', 'none', C.ink, 4.4), path('M24 104 L24 86 L54 86 L58 104 M24 86 L22 54 L28 54', 'none', C.silver, 2.8),
    rect(24, 80, 32, 6, C.black, 1.5, C.ink, 1), rect(20, 54, 8, 22, C.black, 1.5, C.ink, 1),
    rect(30, 22, 16, 16, C.red, 0, C.ink, 1.2), circle(54, 30, 8, C.yellow, C.ink, 1.2), path('M62 38 L72 22 L82 38 Z', '#3f6fb5', C.ink, 1.2),
    greyed(at(96, 104, 0.8, path('M-12 0 L-12 -20 M12 0 L12 -20', 'none', C.ink, 3), rect(-14, -24, 28, 6, '#ccc', 2, C.ink, 1.2), path('M-12 -24 C-16 -40 -10 -52 0 -54 C10 -52 16 -40 12 -24', '#ddd', C.ink, 1.4), path('M-6 -40 C-2 -46 2 -46 6 -40 C2 -36 -2 -36 -6 -40 Z', '#bbb', C.ink, 0.8), circle(-14, -2, 2, '#bbb', null), circle(14, -2, 2, '#bbb', null)))),
  // ikonisk: a chair on a pedestal in a spotlight; many eyes and hearts around it recognise it
  'archd.ikonisk': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), path('M52 0 L68 0 L92 92 L28 92 Z', 'rgba(255,240,180,0.35)', null),
    rect(36, 92, 48, 16, '#e8dcc6', 1, C.ink, 1.4), at(66, 64, 0.8, chairSide(0, 0, 1, { col: C.orange })),
    ...[[14, 30], [104, 26], [16, 70], [106, 66]].map(([x, y]) => at(x!, y!, 0.6, path('M-12 0 Q0 -9 12 0 Q0 9 -12 0 Z', C.white, C.ink, 1.2), circle(0, 0, 3.6, C.ink, null))),
    heart(24, 50, 0.4), heart(96, 46, 0.4), sparkle(60, 12, 4)),
  // retro: a brand-new radio in an old style (price tag, sparkles); the old radio it copies in a sepia thought cloud
  'archd.retro': all(room(), floor(100),
    rect(24, 62, 56, 38, C.orange, 10, C.ink, 1.6), circle(40, 81, 11, '#f6e3c8', C.ink, 1.3), ...range(4).map((i) => line(`M${32 + i * 5} 74 L${32 + i * 5} 88`, '#c4703e', 1)), circle(66, 74, 4, '#f6e3c8', C.ink, 1.1), circle(66, 88, 4, '#f6e3c8', C.ink, 1.1), line('M34 62 L44 50', C.ink, 1.4),
    at(86, 64, 1, path('M0 0 L14 0 L18 6 L14 12 L0 12 Z', C.white, C.ink, 1.1), circle(13, 6, 1.4, C.ink, null)), sparkle(18, 56, 4), sparkle(88, 90, 3.5),
    path('M70 40 C62 40 62 30 70 30 C70 18 88 16 92 24 C100 18 112 26 106 34 C112 40 104 46 98 42 C92 48 76 48 70 40 Z', '#f3e2c4', C.ink, 1.2), circle(68, 50, 2, '#f3e2c4', C.ink, 0.8),
    at(88, 33, 0.32, rect(-26, -18, 52, 36, '#8a5a34', 8, C.ink, 2), circle(-10, 0, 10, '#e2c99a', C.ink, 1.6), circle(14, -6, 4, '#e2c99a', C.ink, 1.4), circle(14, 8, 4, '#e2c99a', C.ink, 1.4))),
};
