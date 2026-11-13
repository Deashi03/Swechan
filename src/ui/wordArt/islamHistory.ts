/**
 * Historia & humaniora → Religion & idéhistoria → Islamisk historia & kultur, 2121–2127 (0.38): the Koran and
 * the hadiths, the time of the Prophet, the caliphates, mosques and religious practice, the Islamic festivals,
 * the history of science in the Muslim world and the different Muslim traditions. The pictures are built
 * from buildings, objects and patterns: a mosque with a green dome and a minaret, a book on a wooden X-stand,
 * an eight-pointed star, a crescent, sand dunes and palms, lanterns and astrolabes. Ordinary believers and
 * scholars appear as small figures; the Prophet Muhammad is never shown, and the words about his life are
 * drawn with places, light and paths only. Script is shown as loose decorative curves, never as real
 * letters or verses. A grey copy stands beside the coloured one where the contrast carries the meaning.
 * Digits only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, bubble, heart } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GREEN = '#2f8a6a';
const GREEN2 = '#1f6b52';
const TURQ = '#3aa6a0';
const TILE = '#2f6fb0';
const GOLD = C.gold;
const CREAM = '#f3ead7';
const WALL = '#efe6d2';
const SAND = '#ecd49a';
const SAND2 = '#d9b56e';
const NIGHT = '#2b3a67';
const DUSK = '#f2a65a';
const RED = '#c8372d';
const WOOD = '#a8743f';
const WOOD2 = '#7a4a20';
const PALM = '#4f9d69';
const GREY = '#8d949c';
const INK2 = '#5a4a3a';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const gfig = (x: number, more: Partial<Build> = {}) => F({ x, grey: true, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
const faceL = (mood: 'smile' | 'calm' = 'smile') => all(circle(0, -55, 7.4, C.skin, C.ink, 1.1),
  mood === 'calm' ? path('M-5 -55.5 Q-3.2 -58 -1.4 -55.5 M1.4 -55.5 Q3.2 -58 5 -55.5', 'none', C.ink, 1.2) : all(circle(-3, -56, 1.1, C.ink, null), circle(3, -56, 1.1, C.ink, null)),
  line('M-2.6 -51.6 Q0 -49.4 2.6 -51.6', C.ink, 1.2));
// head wear in standing-figure coordinates (head centre 0,−56)
const scarfL = (col: string, mood: 'smile' | 'calm' = 'smile') => all(path('M-12.5 -54 C-14 -72 14 -72 12.5 -54 L14 -38 C6 -35 -6 -35 -14 -38 Z', col, C.ink, 1.3), faceL(mood));
const capL = (col: string = C.white) => path('M-9.5 -61 C-9.5 -69.5 9.5 -69.5 9.5 -61 Z', col, C.ink, 1.2);
const turbanL = (col: string = C.white) => all(path('M-11 -59 C-13 -75 13 -75 11 -59 C6 -62 -6 -62 -11 -59 Z', col, C.ink, 1.3), path('M-10 -64 C-4 -68 4 -68 10 -64 M-8 -69 C-3 -72 3 -72 8 -69', 'none', '#c9c1b2', 1));
const bigTurbanL = () => all(path('M-13 -60 C-17 -84 17 -84 13 -60 C6 -63 -6 -63 -13 -60 Z', C.white, C.ink, 1.3), path('M-12 -66 C-4 -71 4 -71 12 -66 M-11 -73 C-4 -77 4 -77 11 -73', 'none', '#c9c1b2', 1), circle(0, -70, 2.6, RED, C.ink, 0.8), path('M0 -72 C-2 -80 2 -84 3 -88', 'none', C.white, 2.2));
const beardL = (col: string = '#5a4a3a') => path('M-7.5 -53 C-7 -42 7 -42 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', col, C.ink, 1);
const robeL = (col: string) => path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4);
/** A woman in a headscarf standing at x. */
const woman = (x: number, h = 1, top: string = C.purple, scarf: string = TURQ, mood: 'smile' | 'calm' = 'smile') => all(fig(x, top, 'smile', { h, bottom: top, hairStyle: 'long' }), on(x, h, scarfL(scarf, mood)));
/** A man with a white cap standing at x. */
const manCap = (x: number, h = 1, top: string = C.white, mood: Mood = 'smile', beard = false) => all(fig(x, top, mood, { h, bottom: '#6b7a8a' }), on(x, h, capL(), beard ? beardL() : ''));
/** A scholar in a long robe and turban. */
const scholar = (x: number, h = 1, robe: string = '#3f6fb5', mood: Mood = 'smile', beard: string = '#5a4a3a') => all(fig(x, robe, mood, { h, bottom: robe }), on(x, h, robeL(robe), turbanL(), beardL(beard)), on(x, h, line('M-12 -18 L12 -18', GOLD, 2)));

// seated cross-legged figure, facing the viewer; local: ground 0, head centre (0, −52)
const sitL = (top: string, o: { skin?: string; cap?: Svg; mood?: 'smile' | 'calm' } = {}) => all(
  path('M-24 0 C-24 -10 -12 -12 0 -10 C12 -12 24 -10 24 0 Z', '#6b7a8a', C.ink, 1.6),
  path('M-13 -36 L13 -36 C15 -24 16 -14 14 -8 L-14 -8 C-16 -14 -15 -24 -13 -36 Z', top, C.ink, 1.8),
  rect(-3.5, -43, 7, 7, o.skin ?? C.skin, 2, C.ink, 1.4), circle(0, -52, 10, o.skin ?? C.skin, C.ink, 1.8),
  path('M-10 -54 C-10 -66 10 -66 10 -54 C6 -59 -6 -59 -10 -54 Z', C.hair, C.ink, 1.4),
  o.mood === 'calm' ? path('M-5.5 -52 Q-3.6 -55 -1.8 -52 M1.8 -52 Q3.6 -55 5.5 -52', 'none', C.ink, 1.2) : all(circle(-3.4, -52, 1.2, C.ink, null), circle(3.4, -52, 1.2, C.ink, null)),
  line('M-3 -47.5 Q0 -45 3 -47.5', C.ink, 1.2), o.cap ?? '');
const sit = (x: number, s: number, top: string, o: { cap?: Svg; mood?: 'smile' | 'calm' } = {}) => at(x, 112, s, sitL(top, o));
const sCap = g('translate(0 4)', capL());
const sTurban = g('translate(0 4)', turbanL());
const sScarf = (col: string) => g('translate(0 4)', path('M-12.5 -54 C-14 -72 14 -72 12.5 -54 L14 -38 C6 -35 -6 -35 -14 -38 Z', col, C.ink, 1.3), circle(0, -55, 7.4, C.skin, C.ink, 1.1), circle(-3, -56, 1.1, C.ink, null), circle(3, -56, 1.1, C.ink, null), line('M-2.6 -51.6 Q0 -49.4 2.6 -51.6', C.ink, 1.2));
// kneeling figure in profile facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string, sk: string = C.skin, hr: string = C.hair) => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1),
  lo('M-4 -22 L11 -22 L12 -3', bottom, 8),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8),
  circle(6, -58, 9, sk, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', hr, C.ink, 1.4),
  circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1),
  lo('M0 -46 L10 -32', top, 6), circle(11, -31, 3, sk, C.ink, 1.2));
const kneel = (x: number, s: number, top: string, bottom: string, o: { flip?: boolean; grey?: boolean; hat?: Svg } = {}) => {
  const k = g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, kneelL(o.grey ? C.grey : top, o.grey ? C.grey : bottom, o.grey ? C.grey2 : C.skin, o.grey ? C.grey : C.hair), o.hat ? g('translate(6 -2)', o.hat) : '');
  return o.grey ? greyed(k) : k;
};
const kCap = capL();
/** A small bust (head and shoulders) for crowds and charts. */
const bust = (x: number, y: number, top: string, hat: Svg = '', s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const bCap = path('M-5 -2.5 C-5 -8 5 -8 5 -2.5 Z', C.white, C.ink, 0.9);
const bTurban = path('M-6 -1.5 C-7 -11 7 -11 6 -1.5 C3 -3.5 -3 -3.5 -6 -1.5 Z', C.white, C.ink, 0.9);
const bScarf = (col: string) => all(path('M-7 1 C-8 -10 8 -10 7 1 L8 8 L-8 8 Z', col, C.ink, 0.9), circle(0, 0, 4.2, C.skin, C.ink, 0.8), circle(-1.6, -0.4, 0.7, C.ink, null), circle(1.6, -0.4, 0.7, C.ink, null));

// ── Things ───────────────────────────────────────────────────────────
/** A crescent opening to the right. */
const crescent = (x: number, y: number, r: number, col: string = GOLD, stroke: string | null = C.ink) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.78)} ${r} 0 1 1 ${x} ${y - r} Z`, col, stroke, 1);
const finial = (x: number, y: number, s = 1) => all(line(`M${x} ${y} L${x} ${f1(y - 7 * s)}`, GOLD, 1.6), circle(x, y - 1.5 * s, 1.6 * s, GOLD, null), crescent(x, y - 10 * s, 3 * s, GOLD, null));
/** Eight-pointed star made of two squares. */
const star8 = (x: number, y: number, r: number, col: string = GOLD, stroke: string = C.ink) => {
  const sq = (rot: number) => path(Array.from({ length: 4 }, (_, i) => { const a = (rot + i * 90) * Math.PI / 180; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' ') + ' Z', col, stroke, 1);
  return all(sq(0), sq(45), circle(x, y, r * 0.32, C.white, stroke, 0.8));
};
/** A band of eight-pointed stars. */
const starBand = (y: number, col: string = TILE, x1 = 10, x2 = 110, step = 14, r = 5) => all(...Array.from({ length: Math.floor((x2 - x1) / step) + 1 }, (_, i) => star8(x1 + i * step, y, r, col)));
/** Loose decorative curves that stand for script, written from right to left (not real letters). */
const scriptL = (x: number, y: number, w: number, col: string = INK2, sw = 1.2) => all(path(`M${x + w} ${y} c${f1(-w * 0.12)} -4 ${f1(-w * 0.18)} 3 ${f1(-w * 0.3)} 0 s${f1(-w * 0.14)} -5 ${f1(-w * 0.26)} -1 s${f1(-w * 0.2)} 4 ${f1(-w * 0.44)} 0`, 'none', col, sw), circle(x + w * 0.7, y - 4, 0.8, col, null), circle(x + w * 0.35, y + 3.5, 0.8, col, null));
/** An ornamental swirl (arabesque), clearly decoration and not letters. */
const flourish = (x: number, y: number, s = 1, col: string = GREEN2) => at(x, y, s,
  path('M0 0 C0 -10 14 -10 14 0 C14 12 -6 14 -8 0 C-10 -16 18 -20 22 -2 C26 16 2 24 -10 14', 'none', col, 2.6),
  path('M0 0 C0 -10 -14 -10 -14 0 C-14 12 6 14 8 0 C10 -16 -18 -20 -22 -2 C-26 16 -2 24 10 14', 'none', GOLD, 2.2),
  ...[[22, -2], [-22, -2], [-10, 14], [10, 14]].map(([a, b]) => path(`M${a} ${b} c3 -5 8 -4 8 0 c-2 3 -6 3 -8 0 Z`, '#7ac08a', C.ink, 0.8)),
  circle(0, 0, 2.4, GOLD, C.ink, 0.8));
/** A book on a wooden X-shaped stand. */
const standBook = (x: number, y: number, s = 1, cover: string = GREEN) => at(x, y, s,
  lo('M-16 14 L14 -6 M16 14 L-14 -6', WOOD, 3.4),
  path('M0 -4 C-8 -8 -20 -8 -26 -4 L-24 -20 C-18 -24 -8 -24 0 -20 Z', '#f6ecd2', C.ink, 1.3), path('M0 -4 C8 -8 20 -8 26 -4 L24 -20 C18 -24 8 -24 0 -20 Z', '#f6ecd2', C.ink, 1.3),
  path('M-26 -4 C-20 -8 -8 -8 0 -4 C8 -8 20 -8 26 -4 L26 -2 C20 -6 8 -6 0 -2 C-8 -6 -20 -6 -26 -2 Z', cover, C.ink, 1),
  scriptL(-21, -17, 16), scriptL(-21, -11, 16), scriptL(5, -17, 16), scriptL(5, -11, 16));
const closedBook = (x: number, y: number, s = 1, cover: string = GREEN) => at(x, y, s, rect(-12, -9, 24, 18, cover, 2, C.ink, 1.4), star8(0, 0, 5, GOLD, C.ink), line('M-12 7 L12 7', '#f6ecd2', 1.6));
const books = (x: number, y: number, n: number, s = 1) => at(x, y, s, ...Array.from({ length: n }, (_, i) => rect(-12 + (i % 2) * 2, -6 - i * 6, 24, 6, [GREEN, RED, TILE, '#b07a2a', '#7a3f8a'][i % 5]!, 1, C.ink, 1)));
const scroll = (x: number, y: number, s = 1, col: string = '#f6ecd2') => at(x, y, s, rect(-12, -14, 24, 28, col, 1, C.ink, 1.3), ellipse(0, -14, 13, 3, '#e6d6b0', C.ink, 1.1), ellipse(0, 14, 13, 3, '#e6d6b0', C.ink, 1.1), scriptL(-8, -6, 16), scriptL(-8, 0, 16), scriptL(-8, 6, 16));
const dunes = (y = 92, col: string = SAND, col2: string = SAND2) => all(path(`M4 ${y} C24 ${y - 14} 40 ${y - 14} 60 ${y - 2} C78 ${y - 16} 98 ${y - 16} 116 ${y - 4} L116 112 L4 112 Z`, col2, C.ink, 1.3), path(`M4 ${y + 8} C30 ${y - 2} 54 ${y - 2} 80 ${y + 8} C96 ${y + 2} 108 ${y + 2} 116 ${y + 6} L116 112 L4 112 Z`, col, C.ink, 1.3));
const palmT = (x: number, y: number, s = 1) => at(x, y, s, path('M-2 0 C-1 -12 1 -24 4 -34 L7 -33 C4 -23 3 -12 3 0 Z', WOOD, C.ink, 1.2),
  ...[[-22, -26], [-14, -40], [4, -46], [22, -40], [26, -26]].map(([dx, dy]) => path(`M5 -34 C${f1(5 + dx! * 0.4)} ${f1(-34 + dy! * 0.3 - 6)} ${f1(5 + dx! * 0.8)} ${f1(-34 + dy! * 0.5)} ${5 + dx!} ${-34 + dy! * 0.25 + 14}`, 'none', PALM, 4)),
  circle(3, -32, 2, '#7a4a20', null), circle(7, -31, 2, '#7a4a20', null));
const camel = (x: number, y: number, s = 1, col: string = '#c9975a', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`,
  lo('M-12 -16 L-13 0 M-6 -16 L-6 0 M8 -16 L8 0 M13 -16 L15 0', col, 3),
  path('M-18 -16 C-20 -26 -12 -30 -6 -28 C-2 -40 8 -40 10 -28 C14 -28 16 -24 16 -16 Z', col, C.ink, 1.4),
  path('M14 -22 C20 -26 20 -36 22 -42 C24 -46 30 -46 32 -42 L32 -38 L26 -38 C24 -32 24 -24 18 -16 Z', col, C.ink, 1.4),
  circle(27, -42, 1, C.ink, null), path('M-18 -20 C-22 -18 -23 -12 -22 -8', 'none', C.ink, 1.2));
const sunS = (x: number, y: number, r = 6, col: string = C.yellow) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, col, C.ink, 1.2));
const starDot = (x: number, y: number, r = 1.4) => path(`M${x} ${y - r * 2} L${f1(x + r * 0.5)} ${f1(y - r * 0.5)} L${x + r * 2} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.5)} L${x} ${y + r * 2} L${f1(x - r * 0.5)} ${f1(y + r * 0.5)} L${x - r * 2} ${y} L${f1(x - r * 0.5)} ${f1(y - r * 0.5)} Z`, '#f6e8a8', null);
const sky = (col: string = NIGHT, y2 = 112) => rect(4, 4, 112, y2 - 4, col, 3, null);
/** A minaret with its base at (x, y). */
const minaretT = (x: number, y: number, s = 1, col: string = CREAM, cap: string = GREEN) => at(x, y, s,
  path('M-5 0 L-4 -56 L4 -56 L5 0 Z', col, C.ink, 1.3), rect(-7, -58, 14, 4, col, 1, C.ink, 1.2), path('M-7 -54 L7 -54 L5 -51 L-5 -51 Z', '#c9b98a', C.ink, 0.9),
  rect(-3.5, -70, 7, 12, col, 1, C.ink, 1.2), path('M-4.5 -70 C-4.5 -78 4.5 -78 4.5 -70 Z', cap, C.ink, 1.2), line('M0 -77 L0 -82', GOLD, 1.4), crescent(0, -85, 2.6, GOLD, null),
  rect(-1.6, -44, 3.2, 6, '#5a6a80', 1.5, null), rect(-1.6, -26, 3.2, 6, '#5a6a80', 1.5, null));
/** A mosque with its base centre at (x, y): a hall, a dome and up to two minarets. */
const mosque = (x: number, y: number, s = 1, o: { minarets?: 0 | 1 | 2; dome?: string; wall?: string; door?: string } = {}) => {
  const wall = o.wall ?? CREAM, dome = o.dome ?? GREEN, n = o.minarets ?? 1;
  return at(x, y, s,
    n >= 1 ? minaretT(-34, 0, 0.9, wall, dome) : '', n >= 2 ? minaretT(34, 0, 0.9, wall, dome) : '',
    rect(-26, -30, 52, 30, wall, 1, C.ink, 1.5), rect(-26, -34, 52, 5, '#d9c9a0', 1, C.ink, 1.2),
    path('M-18 -34 C-18 -58 18 -58 18 -34 Z', dome, C.ink, 1.5), rect(-19, -37, 38, 4, wall, 1, C.ink, 1.1), finial(0, -52, 1),
    path('M-7 0 L-7 -14 C-7 -22 7 -22 7 -14 L7 0 Z', o.door ?? '#6b4a2e', C.ink, 1.2),
    ...[-18, 14].map((d) => path(`M${d} -10 L${d} -18 C${d} -22 ${d + 4} -22 ${d + 4} -18 L${d + 4} -10 Z`, TILE, C.ink, 0.9)));
};
/** A black cube with a gold band (the Kaaba). */
const kaaba = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-14 0 L-14 -22 L0 -28 L0 -6 Z', '#1d1d24', C.ink, 1.3), path('M0 -6 L0 -28 L16 -22 L16 0 Z', '#2e2e36', C.ink, 1.3), path('M-14 -22 L0 -28 L16 -22 L2 -16 Z', '#3a3a44', C.ink, 1.1),
  path('M-14 -17 L0 -23 L0 -20 L-14 -14 Z M0 -23 L16 -17 L16 -14 L0 -20 Z', GOLD, null), path('M4 0 L4 -10 L9 -9 L9 0 Z', GOLD, null));
const lantern = (x: number, y: number, s = 1, col: string = GOLD, glass: string = '#fbe39a') => at(x, y, s,
  line('M0 -24 L0 -18', C.ink, 1.2), path('M-6 -18 L6 -18 L4 -14 L-4 -14 Z', col, C.ink, 1),
  path('M-6 -14 L6 -14 L8 -2 L4 6 L-4 6 L-8 -2 Z', glass, C.ink, 1.2), line('M0 -14 L0 6 M-6 -14 L-4 6 M6 -14 L4 6 M-8 -2 L8 -2', col, 1),
  path('M-4 6 L4 6 L0 11 Z', col, C.ink, 1), circle(0, -4, 2.4, '#fff6c8', null));
const glow = (x: number, y: number, r: number, col: string = '#fff3b0') => circle(x, y, r, col, null);
const rug = (x: number, y: number, w: number, h: number, col: string = RED, col2: string = '#f2d48a') => all(rect(x, y, w, h, col, 1.5, C.ink, 1.3), rect(x + 3, y + 3, w - 6, h - 6, 'none', 1, col2, 1.2),
  path(`M${x + w * 0.3} ${y + h - 4} L${x + w * 0.3} ${y + h * 0.4} C${x + w * 0.3} ${y + 5} ${x + w * 0.7} ${y + 5} ${x + w * 0.7} ${y + h * 0.4} L${x + w * 0.7} ${y + h - 4}`, 'none', col2, 1.4),
  ...Array.from({ length: Math.floor(w / 4) }, (_, i) => line(`M${x + 2 + i * 4} ${y + h} l0 2.5`, col2, 1)));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, GOLD, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const sheep = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 0 L-6 6 M5 0 L5 6', C.ink, 1.6), path('M-10 -2 C-12 -10 -4 -12 0 -9 C4 -12 12 -10 10 -2 C12 4 4 6 0 4 C-4 6 -12 4 -10 -2 Z', C.white, C.ink, 1.3), ellipse(11, -5, 3.5, 3, C.dark, C.ink, 1));
const plate = (x: number, y: number, r = 9, food: Svg = '') => all(ellipse(x, y, r, r * 0.38, C.white, C.ink, 1.3), food);
const dateFruit = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ellipse(0, 0, 3, 5, '#7a3a1e', C.ink, 0.9), path('M-1 -3 C0 -1 0 1 -1 3', 'none', '#a8562e', 0.8));
const glass = (x: number, y: number, h = 12, fill: string = '#bfe3f5') => all(path(`M${x - 4} ${y - h} L${x + 4} ${y - h} L${x + 3.4} ${y} L${x - 3.4} ${y} Z`, 'rgba(220,240,252,0.6)', C.ink, 1.1), path(`M${x - 3.7} ${y - h * 0.6} L${x + 3.7} ${y - h * 0.6} L${x + 3.4} ${y} L${x - 3.4} ${y} Z`, fill, null));
const drop = (x: number, y: number, s = 1, col = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const astrolabe = (x: number, y: number, r: number) => all(circle(x, y - r - 3, 3, 'none', '#b88a20', 2), circle(x, y, r, GOLD, C.ink, 1.5), circle(x, y, r * 0.82, '#f2d48a', C.ink, 1),
  circle(x, y - r * 0.15, r * 0.5, 'none', '#b88a20', 1.1), circle(x, y + r * 0.2, r * 0.32, 'none', '#b88a20', 1.1),
  ...Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r * 0.82)} ${f1(y + Math.sin(a) * r * 0.82)} L${f1(x + Math.cos(a) * r * 0.95)} ${f1(y + Math.sin(a) * r * 0.95)}`, C.ink, 0.8); }),
  line(`M${f1(x - r * 0.8)} ${f1(y + r * 0.35)} L${f1(x + r * 0.8)} ${f1(y - r * 0.35)}`, C.ink, 2), circle(x, y, 2, C.ink, null),
  ...[[-0.3, -0.45], [0.35, -0.25], [0.1, 0.45], [-0.45, 0.2]].map(([a, b]) => path(`M${f1(x + a! * r)} ${f1(y + b! * r - 2)} L${f1(x + a! * r + 2)} ${f1(y + b! * r + 1)} L${f1(x + a! * r - 2)} ${f1(y + b! * r + 1)} Z`, RED, null)));
const archWin = (x: number, y: number, w: number, h: number, col: string = TILE) => path(`M${x} ${y + h} L${x} ${y + w / 2} C${x} ${y - w * 0.1} ${x + w} ${y - w * 0.1} ${x + w} ${y + w / 2} L${x + w} ${y + h} Z`, col, C.ink, 1);
const pie = (x: number, y: number, r: number, frac: number, col: string, rest: string = C.grey2) => {
  const a = frac * Math.PI * 2 - Math.PI / 2, big = frac > 0.5 ? 1 : 0;
  return all(circle(x, y, r, rest, C.ink, 1.4), path(`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${big} 1 ${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)} Z`, col, C.ink, 1.4));
};
const flagT = (x: number, y: number, col: string, s = 1) => at(x, y, s, line('M0 0 L0 -26', WOOD2, 1.8), path('M0 -26 L14 -22 L0 -17 Z', col, C.ink, 1));
const tent = (x: number, y: number, s = 1, col: string = '#c9a87a') => at(x, y, s, path('M-14 0 L0 -18 L14 0 Z', col, C.ink, 1.3), path('M-3 0 L0 -8 L3 0 Z', '#5a4a3a', null));
const hand = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 4 C-12 -2 -8 -6 -2 -6 L10 -6 C13 -6 13 -2 10 -2 L4 -2 L12 -2 C15 -2 15 2 12 2 L-2 4 C-6 6 -9 6 -10 4 Z', C.skin, C.ink, 1.2));
const footprint = (x: number, y: number, s = 1, col: string = GOLD, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ellipse(0, 0, 2.6, 4.4, col, null), circle(-1.4, -6, 1, col, null), circle(0.4, -6.5, 1, col, null), circle(2, -5.8, 1, col, null));
const palace = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-50, -30, 100, 30, '#f6efe0', 1, C.ink, 1.5), rect(-50, -34, 100, 5, '#d9c9a0', 1, C.ink, 1.1),
  ...[-42, -28, -14, 0, 14, 28].map((d) => path(`M${d} 0 L${d} -16 C${d} -24 ${d + 10} -24 ${d + 10} -16 L${d + 10} 0 Z`, '#c8a96a', C.ink, 1)),
  path('M-14 -34 C-14 -52 14 -52 14 -34 Z', GOLD, C.ink, 1.4), path('M-46 -34 C-46 -44 -32 -44 -32 -34 Z', TURQ, C.ink, 1.2), path('M32 -34 C32 -44 46 -44 46 -34 Z', TURQ, C.ink, 1.2),
  rect(-54, -42, 8, 42, '#f6efe0', 1, C.ink, 1.3), rect(46, -42, 8, 42, '#f6efe0', 1, C.ink, 1.3), path('M-55 -42 L-50 -50 L-45 -42 Z', RED, C.ink, 1), path('M45 -42 L50 -50 L55 -42 Z', RED, C.ink, 1));
const flask = (x: number, y: number, s = 1, liquid: string = '#7ac08a') => at(x, y, s, path('M-3 -16 L3 -16 L3 -8 L10 6 C11 9 9 10 7 10 L-7 10 C-9 10 -11 9 -10 6 L-3 -8 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-6 2 L6 2 L9 7 C9 9 8 9 7 9 L-7 9 C-8 9 -9 9 -9 7 Z', liquid, null));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const eye = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 0 C-8 -10 8 -10 16 0 C8 10 -8 10 -16 0 Z', C.white, C.ink, 1.6), circle(0, 0, 6, '#6a8f5a', C.ink, 1.2), circle(0, 0, 2.6, C.ink, null), circle(1.8, -1.8, 1, C.white, null));
const lamp = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 C-12 -6 6 -8 12 -4 L18 -6 L14 0 Z', GOLD, C.ink, 1.2), path('M-4 -6 L-2 -10 L2 -10 L4 -6', 'none', C.ink, 1), path('M15 -6 C17 -12 19 -12 18 -16 C21 -12 20 -8 17 -6 Z', C.orange, C.ink, 0.8));
const gift = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, rect(-7, -6, 14, 12, col, 1, C.ink, 1.1), line('M0 -6 L0 6 M-7 0 L7 0', GOLD, 1.6), path('M0 -6 C-4 -11 -7 -8 0 -6 C7 -8 4 -11 0 -6', 'none', GOLD, 1.4));
const waves = (x: number, y: number, n = 3, col: string = HL) => all(...Array.from({ length: n }, (_, i) => path(`M${x + i * 5} ${y - 4 - i * 2} C${x + 3 + i * 5} ${y - 1} ${x + 3 + i * 5} ${y + 1} ${x + i * 5} ${y + 4 + i * 2}`, 'none', col, 1.6)));

export const ISLAM_MOTIFS: Record<string, Svg> = {
  // ── 2121 Koranen och hadither ──
  'islam.islam': all(circle(60, 56, 50, '#e8f2ec', null), starBand(12, TILE, 18, 102, 14, 4.5), mosque(60, 104, 1.05, { minarets: 2 }), standBook(60, 104, 0.55), ground),
  'islam.muslim': all(greyed(mosque(60, 96, 0.8, { minarets: 2 })), manCap(42, 0.9, '#e8eef2', 'smile', true), woman(78, 0.86, '#7a5aa8', TURQ), ground),
  'islam.muslimsk': all(rect(4, 4, 112, 108, '#f5efe2', 3, null), starBand(10, GREEN, 14, 106, 13, 4), mosque(30, 104, 0.62, { minarets: 1 }), woman(68, 0.72, '#c96b3c', '#3f6fb5'), manCap(96, 0.76, '#5a8a6a'), fig(83, '#f2c14e', 'laugh', { h: 0.42 }), on(83, 0.42, capL()), ground),
  'islam.arabiska': all(fig(28, C.denim, 'smile', { h: 0.9 }), woman(92, 0.86, '#c96b3c', '#7a5aa8'), bubble(60, 26, 54, all(scriptL(38, 22, 40, NIGHT, 1.6), scriptL(38, 31, 40, NIGHT, 1.6)), true), arrow(80, 46, 44, 46, HL, 2.2), ground),
  'islam.koran': all(rect(14, 98, 92, 6, '#8a5a3a', 1.5, C.ink, 1.2), standBook(60, 86, 1.55, GREEN), starBand(14, GREEN, 26, 94, 17, 5)),
  'islam.sura': all(path('M60 34 C44 28 18 28 8 34 L8 104 C18 98 44 98 60 104 Z', '#f6ecd2', C.ink, 1.5), path('M60 34 C76 28 102 28 112 34 L112 104 C102 98 76 98 60 104 Z', '#f6ecd2', C.ink, 1.5),
    ...[44, 52, 60].map((y) => scriptL(66, y, 40)), rect(64, 66, 44, 30, 'rgba(242,193,78,0.35)', 2, HL, 2), ...[74, 82, 90].map((y) => scriptL(66, y, 40, C.ink, 1.4)), ...[44, 52, 60, 68, 76, 84, 92].map((y) => scriptL(12, y, 42)),
    ...Array.from({ length: 9 }, (_, i) => rect(18 + i * 10, 18 - (i === 6 ? 6 : 0), 6, 14, i === 6 ? HL : [GREEN, TILE, RED][i % 3]!, 1, C.ink, 0.9))),
  'islam.recitera': all(rect(4, 4, 112, 108, '#f2ece0', 3, null), sit(42, 1, '#e8eef2', { cap: sCap }), standBook(84, 108, 0.9), waves(56, 60, 3, HL), ground),
  'islam.kalligrafi': all(rect(14, 18, 92, 70, '#f6ecd2', 2, C.ink, 1.5), flourish(58, 52, 1.1, GREEN2), circle(30, 36, 2, GOLD, null), circle(88, 70, 2, GOLD, null),
    g('translate(84 74) rotate(-35)', rect(-2, -26, 4, 30, WOOD, 1, C.ink, 1), path('M-2 4 L0 9 L2 4 Z', C.ink, null)), hand(96, 90, 1, -35), rect(16, 92, 14, 14, C.dark, 3, C.ink, 1.2), ellipse(23, 92, 6, 2, '#1d1d24', null)),
  'islam.lärd': all(greyed(fig(24, C.grey, 'smile', { h: 0.82 }), rect(30, 74, 12, 4, C.grey, 1, null)), scholar(68, 0.95, '#3f6fb5', 'calm', '#e2e2e2'), books(100, 112, 8, 1), closedBook(46, 76, 0.7, RED), reach(68, 0.95, -1, 52, 76), ground),
  'islam.hadith': all(...[[18, '#c96b3c'], [52, C.denim], [86, C.green]].map(([x, col], i) => all(bust(+x!, 78, col as string, i === 1 ? bTurban : bCap, 1.7), i < 2 ? bubble(+x! + 15, 44, 24, scriptL(+x! + 6, 44, 18, NIGHT, 1.4), true) : '', i < 2 ? arrow(+x! + 12, 62, +x! + 26, 62, HL, 2) : '')), closedBook(104, 102, 0.75), arrow(96, 92, 104, 92, HL, 1.8), ground),
  'islam.sunna': all(path('M8 112 C40 100 60 80 70 50 C76 34 86 24 96 22', 'none', '#e6d6b0', 16), ...[[18, 106, 70], [30, 101, 64], [42, 94, 56], [52, 86, 48], [60, 76, 34], [66, 64, 24], [72, 52, 20], [78, 41, 34], [86, 31, 50]].map(([x, y, r], i) => footprint(x!, y!, 1, i % 2 ? GOLD : '#c99a2a', r!)), mosque(100, 30, 0.42, { minarets: 1 }), fig(28, '#5a8a6a', 'smile', { h: 0.62 }), on(28, 0.62, capL())),

  // ── 2122 Profeten Muhammeds tid ──
  'islam.öken': all(sky('#bfe3f5', 92), sunS(92, 24, 9), dunes(80), path('M24 84 C30 80 34 82 36 86', 'none', SAND2, 1.4)),
  'islam.oas': all(sky('#bfe3f5', 92), sunS(102, 18, 6), dunes(84), ellipse(60, 98, 30, 7, '#7cc3e6', C.ink, 1.3), palmT(36, 96, 1), palmT(80, 96, 0.9), palmT(58, 92, 0.7), path('M40 96 C46 92 52 94 56 96', 'none', '#6fae5a', 3)),
  'islam.kamel': all(dunes(96, SAND, SAND2), camel(54, 108, 1.7, '#c9975a')),
  'islam.föräldralös': all(g('translate(-26 0)', greyed(gfig(60, { h: 1 }))), g('translate(26 0)', greyed(gfig(60, { h: 0.96, hairStyle: 'long' }))),
    line('M20 26 L48 26 M72 26 L100 26', C.grey, 1.2, '3 3'), fig(60, '#e86a6a', 'frown', { h: 0.56, hairStyle: 'long', bottom: '#5a6a80' }), ground),
  'islam.hijra': all(sky(NIGHT, 112), crescent(96, 18, 7, '#f6e08a', null), ...[[20, 14], [50, 22], [74, 10], [110, 40]].map(([x, y]) => starDot(x!, y!)), rect(4, 70, 112, 42, SAND, 0, null),
    at(20, 84, 1, rect(-14, -10, 10, 10, CREAM, 1, C.ink, 1), rect(2, -14, 12, 14, CREAM, 1, C.ink, 1), kaaba(-2, 6, 0.55)), at(100, 82, 1, rect(-14, -12, 12, 12, CREAM, 1, C.ink, 1), rect(0, -8, 14, 8, CREAM, 1, C.ink, 1)), palmT(108, 76, 0.5), palmT(88, 76, 0.45),
    path('M30 92 C50 104 70 104 88 90', 'none', GOLD, 2, ), ...[[44, 100], [58, 102], [72, 99]].map(([x, y]) => camel(x!, y!, 0.42, '#c9975a')), arrow(78, 94, 88, 88, HL, 2), T(60, 62, '622', 12, '#f6e08a')),
  'islam.tideräkning': all(line('M10 46 L110 46', GREY, 2.4), ...[10, 40, 70, 100].map((x) => line(`M${x} 41 L${x} 51`, GREY, 1.8)), T(40, 36, '622', 11, GREY), T(100, 36, '2026', 11, GREY),
    line('M40 84 L110 84', GREEN, 3), arrow(96, 84, 112, 84, GREEN, 3), circle(40, 84, 5, GOLD, C.ink, 1.2), crescent(26, 72, 6, GOLD, C.ink), ...[70, 100].map((x) => line(`M${x} 79 L${x} 89`, GREEN, 2)), T(40, 104, '1', 13, GREEN2), T(100, 104, '1447', 11, GREEN2), line('M40 52 L40 76', HL, 1.6, '3 3')),
  'islam.förena': all(...[[18, 30, '#c96b3c'], [18, 76, C.denim], [44, 54, '#b07aa1']].map(([x, y, col]) => greyed(tent(+x!, +y!, 0.8), flagT(+x! + 10, +y!, col as string, 0.6))), ...[[34, 34], [34, 74], [56, 54]].map(([x, y]) => arrow(x!, y!, 70, 58, HL, 2)),
    circle(92, 64, 22, '#e8f2ec', GREEN, 2), tent(84, 74, 0.7, '#c96b3c'), tent(100, 74, 0.7, '#3f6fb5'), tent(92, 62, 0.7, '#b07aa1'), flagT(92, 52, GREEN, 0.8)),

  // ── 2123 Kalifaten ──
  'islam.kalif': all(rect(4, 4, 112, 108, '#f5efe2', 3, null), rect(14, 86, 56, 10, RED, 3, C.ink, 1.3), sit(42, 1, '#2f4a7a', { cap: sTurban }), at(42, 112, 1, g('translate(0 6)', beardL('#2b2a33'))), lo('M72 112 L72 30', WOOD2, 2.4), flagT(72, 30, C.black, 1.1), ...[86, 102].map((x) => kneel(x, 0.5, '#c96b3c', '#6b5a44', { flip: true, hat: kCap })), ground),
  'islam.kalifat': all(rect(4, 14, 112, 92, '#bfe3f5', 3, C.ink, 1.2), path('M6 40 C16 34 28 38 36 34 C48 28 60 30 72 34 C84 30 98 32 114 26 L114 90 C100 92 88 86 76 90 C62 96 48 90 36 94 C24 98 14 92 6 96 Z', '#e8dcc0', C.ink, 1.2),
    path('M14 50 C26 44 40 48 52 42 C64 40 80 44 96 40 C104 40 110 44 112 48 L110 72 C96 76 86 70 74 76 C60 80 46 74 34 78 C24 80 16 76 12 72 Z', 'rgba(47,138,106,0.45)', GREEN, 2), star8(62, 60, 6, GOLD), crescent(62, 46, 4, GOLD, C.ink), ...[[24, 62], [40, 56], [86, 58], [102, 60]].map(([x, y]) => circle(x!, y!, 2.6, C.white, C.ink, 1))),
  'islam.guvernör': all(palace(26, 60, 0.42), at(96, 100, 1, rect(-16, -18, 32, 18, CREAM, 1, C.ink, 1.3), path('M-18 -18 L0 -28 L18 -18 Z', '#c8a96a', C.ink, 1.2)), arrow(42, 50, 82, 54, HL, 2), scroll(62, 46, 0.45), all(fig(70, '#8a5a3a', 'smile', { h: 0.72, bottom: '#8a5a3a' }), on(70, 0.72, turbanL(), robeL('#8a5a3a'), line('M-12 -18 L12 -18', GOLD, 2))), coin(84, 106, 3.5), coin(92, 107, 3.5), coin(88, 102, 3.5), ground),
  'islam.dynasti': all(...[[60, 22, 1.5], [60, 56, 1.35], [60, 90, 1.2]].map(([x, y, s], i) => all(bust(x!, y!, ['#2f4a7a', '#3a5a8a', '#4a6a9a'][i]!, bTurban, s!), i < 2 ? arrow(x!, y! + 16, x!, y! + 24, HL, 2) : '')), greyed(bust(100, 56, C.grey, '', 1.2), bust(100, 90, C.grey, '', 1.2)), ...[[30, 22, '1'], [30, 56, '2'], [30, 90, '3']].map(([x, y, n]) => T(+x!, +y! + 4, n as string, 11, GREEN2))),
  'islam.palats': all(sky('#bfe3f5', 112), palace(60, 92, 1), rect(4, 92, 112, 20, '#9fcb84', 0, null), ellipse(60, 102, 26, 5, '#7cc3e6', C.ink, 1.2), line('M60 102 L60 94', '#7cc3e6', 2), palmT(14, 108, 0.6), palmT(106, 108, 0.6)),
  'islam.guldålder': all(line('M10 98 L110 98', C.grey, 1.6), path('M10 94 C24 92 30 86 40 70 C48 54 54 30 62 28 C70 26 74 50 82 70 C90 84 98 92 110 94', 'none', GOLD, 4), path('M10 94 C24 92 30 86 40 70', 'none', C.grey, 4), path('M82 70 C90 84 98 92 110 94', 'none', C.grey, 4),
    circle(62, 30, 14, 'rgba(242,193,78,0.3)', null), closedBook(52, 18, 0.5), astrolabe(74, 18, 6), star8(62, 44, 4, GOLD), T(36, 110, '750', 9, GREY), T(88, 110, '1250', 9, GREY)),
  'islam.falla-sönder': all(greyed(path('M8 44 C14 30 34 28 44 36 C50 50 40 70 24 70 C14 68 8 58 8 44 Z', C.grey, C.ink, 1.4)), arrow(46, 52, 58, 52, HL, 2.4),
    ...[[0, 0, -4, -4], [1, 0, 4, -3], [0, 1, -3, 4], [1, 1, 5, 5]].map(([cx, cy, dx, dy]) => g(`translate(${dx} ${dy})`, path(cx ? (cy ? 'M90 56 L112 56 C110 70 100 80 90 80 Z' : 'M90 30 C100 28 110 36 112 56 L90 56 Z') : (cy ? 'M66 56 L90 56 L90 80 C76 80 66 70 66 56 Z' : 'M70 38 C76 30 84 30 90 30 L90 56 L66 56 C66 48 68 42 70 38 Z'), 'rgba(47,138,106,0.75)', C.ink, 1.4))),
    line('M90 22 L90 88 M60 56 L118 56', C.ink, 1.4, '2 3'), ground),
  'islam.sultan': all(rect(4, 4, 112, 108, '#f5efe2', 3, null), greyed(at(92, 82, 0.9, rect(-20, -20, 40, 20, CREAM, 1, C.ink, 1.2), path('M-14 -20 C-14 -36 14 -36 14 -20 Z', '#8d949c', C.ink, 1.2)), minaretT(68, 82, 0.6), minaretT(116, 82, 0.6)), fig(42, RED, 'calm', { h: 1, bottom: RED }), on(42, 1, path('M-14 -40 L14 -40 L18 48 L-18 48 Z', RED, C.ink, 1.4), path('M-4 -40 L4 -40 L6 48 L-6 48 Z', GOLD, C.ink, 0.9), bigTurbanL(), beardL('#2b2a33')), ground),
  'islam.osmansk': all(sky('#f6e2c4', 90), rect(4, 90, 112, 22, '#9fd0ea', 0, null), at(60, 90, 1, rect(-30, -20, 60, 20, '#d8d0c0', 1, C.ink, 1.3), path('M-18 -20 C-18 -46 18 -46 18 -20 Z', '#8d9aa8', C.ink, 1.4), path('M-30 -20 C-30 -32 -18 -32 -18 -20 Z M18 -20 C18 -32 30 -32 30 -20 Z', '#8d9aa8', C.ink, 1.2), finial(0, -42, 1)),
    ...[18, 34, 86, 102].map((x) => at(x, 90, 1, path('M-2.5 0 L-2 -62 L2 -62 L2.5 0 Z', '#d8d0c0', C.ink, 1), rect(-3.5, -44, 7, 2.5, '#d8d0c0', 1, C.ink, 0.8), path('M-2 -62 L0 -74 L2 -62 Z', '#6b7a8a', C.ink, 0.9))), crescent(100, 18, 6, GOLD, C.ink), path('M10 102 q6 -3 12 0 q6 3 12 0 M60 104 q6 -3 12 0 q6 3 12 0', 'none', '#4d8fc0', 1.4)),

  // ── 2124 Moskéer och religiösa praktiker ──
  'islam.moské': all(sky('#d8ecf6', 112), mosque(60, 112, 1.5, { minarets: 2 }), ground),
  'islam.minaret': all(greyed(mosque(46, 112, 1.15, { minarets: 0 })), minaretT(96, 112, 1.25, CREAM, GREEN), circle(96, 30, 16, 'none', HL, 2), ground),
  'islam.imam': all(rect(4, 4, 112, 108, WALL, 3, null), archWin(40, 18, 40, 70, '#2f6fb0'), starBand(8, GREEN, 16, 104, 14, 3.5), scholar(60, 0.95, C.white, 'calm', '#2b2a33'), ...[14, 32, 88, 106].map((x) => greyed(kneel(x, 0.5, C.grey, C.grey, { flip: x > 60, hat: kCap }))), ground),
  'islam.fredagsbön': all(rect(4, 4, 112, 108, WALL, 3, null), sunS(60, 16, 6), ...Array.from({ length: 7 }, (_, i) => rect(16 + i * 13, 30, 11, 11, i === 4 ? HL : C.white, 1.5, C.ink, 1.1)), T(70.5, 39, '5', 9, C.white),
    rug(4, 104, 112, 8, RED), ...[18, 44, 70, 96].map((x, i) => kneel(x, 0.62, ['#e8eef2', '#c9d8e6', '#d8c9a0', '#e8eef2'][i]!, '#6b7a8a', { hat: kCap }))),
  'islam.böneutropare': all(sky('#f6d9a8', 112), minaretT(52, 112, 1.3, CREAM, GREEN), bust(52, 34, C.white, bCap, 1.2), hand(62, 32, 0.5, -20), waves(68, 34, 4, HL), greyed(at(98, 112, 1, rect(-14, -24, 28, 24, CREAM, 1, C.ink, 1.2), rect(-4, -12, 8, 12, '#6b4a2e', 1, null))), ground),
  'islam.bönematta': all(g('translate(60 70) rotate(-8)', rug(-40, -26, 80, 52, RED, '#f2d48a')), g('translate(60 70) rotate(-8)', star8(0, 6, 7, '#f2d48a', C.ink), path('M40 -26 C48 -26 48 26 40 26', '#8a2a24', C.ink, 1.3))),
  'islam.tvagning': all(rect(4, 4, 112, 108, '#e8f0f2', 3, null), rect(4, 40, 112, 6, '#c9d2d6', 1, C.ink, 1.2), ...[24, 60, 96].map((x) => all(path(`M${x - 3} 46 L${x - 3} 52 L${x + 4} 52`, 'none', C.silver, 3), drop(x + 4, 58, 0.8), drop(x + 4, 66, 0.7))),
    rect(4, 90, 112, 6, '#c9d2d6', 1, C.ink, 1), sit(60, 0.9, '#e8eef2', { cap: sCap }), hand(70, 74, 0.6, 180), drop(64, 82, 0.8), drop(70, 84, 0.7), greyed(sit(24, 0.7, C.grey), sit(96, 0.7, C.grey))),
  'islam.de-fem-pelarna': all(path('M8 30 L60 8 L112 30 Z', GREEN, C.ink, 1.6), finial(60, 9, 1.2), rect(8, 30, 104, 8, '#d9c9a0', 1, C.ink, 1.3), rect(8, 104, 104, 8, '#d9c9a0', 1, C.ink, 1.3),
    ...[20, 40, 60, 80, 100].map((x) => all(rect(x - 6, 38, 12, 66, CREAM, 1, C.ink, 1.3), line(`M${x - 2} 42 L${x - 2} 100 M${x + 2} 42 L${x + 2} 100`, '#d9c9a0', 1))),
    bubble(20, 60, 12, T(20, 63, '1', 8, NIGHT), true), at(40, 64, 0.5, rug(-10, -8, 20, 16, RED)), coin(60, 62, 5), at(80, 62, 1, crescent(0, 0, 5, GOLD, C.ink)), kaaba(100, 70, 0.55)),
  'islam.allmosa': all(fig(32, '#5a8a6a', 'smile', { h: 0.95 }), on(32, 0.95, capL()), reach(32, 0.95, 1, 56, 70), coin(58, 64, 3.5), coin(63, 68, 3.5), arrow(56, 56, 76, 66, HL, 2), fig(90, '#9a8a70', 'smile', { h: 0.84, bottom: '#6b5a44' }), reach(90, 0.84, -1, 72, 76), ellipse(70, 80, 8, 3, '#c9b98a', C.ink, 1.1), coin(68, 77, 3), ground),
  'islam.slöja': all(woman(60, 1.02, '#3f6fb5', '#c96b3c'), on(60, 1.02, path('M-12 -48 C-6 -44 6 -44 12 -48', 'none', '#e8a07a', 1.4)), ground),

  // ── 2125 Islamiska högtider ──
  'islam.nymåne': all(sky(NIGHT, 112), rect(4, 86, 112, 26, '#1f2a4a', 0, null), path('M4 92 C30 84 60 90 80 86 C96 84 108 88 116 86 L116 112 L4 112 Z', '#3a3a3a', null), circle(60, 50, 16, 'none', '#5a6a8a', 1.2, ), crescent(60, 50, 16, '#f6e08a', null), ...[[16, 16], [100, 20], [30, 40], [96, 64], [80, 14]].map(([x, y]) => starDot(x!, y!))),
  'islam.ramadan': all(sky(NIGHT, 112), crescent(60, 26, 13, '#f6e08a', null), ...[[18, 18], [100, 22], [32, 46], [92, 48]].map(([x, y]) => starDot(x!, y!)), line('M4 54 C30 64 90 64 116 54', '#c9b98a', 1.2),
    ...[[20, 66, GOLD], [40, 70, RED], [60, 72, GREEN], [80, 70, TILE], [100, 66, GOLD]].map(([x, y, col]) => all(glow(+x!, +y! - 4, 7), lantern(+x!, +y!, 0.7, col as string))), at(60, 112, 0.7, mosque(0, 0, 1, { minarets: 2, wall: '#3a4a7a', dome: '#4a5a8a', door: '#f6e08a' }))),
  'islam.soluppgång': all(sky('#f8d9b0', 82), path('M4 82 L116 82 L116 112 L4 112 Z', '#7ab07a', null), path('M26 82 A34 34 0 0 1 94 82 Z', C.yellow, C.ink, 1.4), ...[-60, -30, 0, 30, 60].map((a) => { const r = Math.PI * (a - 90) / 180; return line(`M${f1(60 + Math.cos(r) * 40)} ${f1(82 + Math.sin(r) * 40)} L${f1(60 + Math.cos(r) * 50)} ${f1(82 + Math.sin(r) * 50)}`, GOLD, 2.4); }), arrow(108, 74, 108, 44, HL, 3), line('M4 82 L116 82', C.ink, 1.4)),
  'islam.solnedgång': all(sky('#4a4a7a', 40), rect(4, 40, 112, 42, DUSK, 0, null), path('M4 82 L116 82 L116 112 L4 112 Z', '#3a5a4a', null), path('M36 82 A24 24 0 0 1 84 82 Z', '#e8543c', C.ink, 1.4), arrow(108, 50, 108, 78, HL, 3), crescent(22, 20, 6, '#f6e08a', null), starDot(46, 14), starDot(90, 18), line('M4 82 L116 82', C.ink, 1.4)),
  'islam.dadel': all(ellipse(60, 92, 42, 12, '#c9975a', C.ink, 1.5), ellipse(60, 88, 38, 9, '#e6c088', C.ink, 1.2), ...[[40, 84, 20], [52, 80, -10], [64, 84, 30], [76, 80, 0], [48, 90, 70], [70, 90, -60], [84, 86, 40], [58, 76, 80]].map(([x, y, r]) => dateFruit(x!, y!, 1.5, r!)),
    path('M84 14 C80 30 74 40 66 52', 'none', '#c9975a', 2.4), ...Array.from({ length: 7 }, (_, i) => all(line(`M${82 - i * 2.6} ${18 + i * 5} L${92 - i * 2} ${24 + i * 5}`, '#c9975a', 1.4), dateFruit(93 - i * 2, 27 + i * 5, 1, 30))), ...Array.from({ length: 5 }, (_, i) => dateFruit(76 - i * 3, 28 + i * 6, 1, -30))),
  'islam.iftar': all(rect(4, 4, 112, 108, '#efe3cf', 3, null), rect(76, 12, 32, 30, DUSK, 2, C.ink, 1.4), path('M80 42 A12 12 0 0 1 104 42 Z', '#e8543c', null), line('M92 12 L92 42 M76 27 L108 27', C.ink, 1.2),
    rect(10, 92, 100, 8, '#f2d48a', 2, C.ink, 1.3), sit(24, 0.62, '#c96b3c', { cap: sScarf('#7a5aa8') }), sit(98, 0.62, C.denim, { cap: sCap }), sit(46, 0.5, '#f2c14e'), plate(60, 90, 9, all(dateFruit(56, 88, 0.8, 70), dateFruit(62, 87, 0.8, 60), dateFruit(66, 89, 0.8, 90))), glass(78, 90, 10), at(40, 92, 1, ellipse(0, -2, 8, 4, '#e8a050', C.ink, 1.1)), lantern(30, 30, 0.8)),
  'islam.lykta': all(rect(4, 4, 112, 108, '#2b3a67', 3, null), line('M60 4 L60 22', C.ink, 1.6), glow(60, 60, 30, 'rgba(255,236,150,0.35)'), lantern(60, 66, 2.6, GOLD), starDot(20, 24), starDot(100, 30), starDot(96, 90)),
  'islam.eid-al-fitr': all(rect(4, 4, 112, 108, '#fbf3e0', 3, null), line('M4 14 C30 26 90 26 116 14', C.ink, 1), ...[16, 34, 52, 70, 88, 104].map((x, i) => path(`M${x - 6} ${16 + Math.sin(i) * 2} L${x + 6} ${16 + Math.sin(i) * 2} L${x} ${28}`, [RED, GOLD, GREEN, TILE, '#b07aa1', GOLD][i]!, C.ink, 0.9)), crescent(60, 40, 8, GOLD, C.ink),
    woman(30, 0.86, '#c84a8a', GOLD), manCap(90, 0.9, '#2f8a6a'), fig(60, '#f2c14e', 'laugh', { h: 0.55, hairStyle: 'long', bottom: '#e86a6a' }), gift(60, 66, 1.2), reach(60, 0.55, 1, 60, 70), reach(30, 0.86, 1, 46, 70), reach(90, 0.9, -1, 74, 70), ground),
  'islam.hajj': all(rect(4, 4, 112, 108, '#e8e2d2', 3, null), ellipse(60, 70, 54, 34, '#d6cdb8', C.ink, 1.2), ...Array.from({ length: 3 }, (_, k) => Array.from({ length: 14 + k * 6 }, (_, i) => { const a = (i / (14 + k * 6)) * Math.PI * 2; return circle(60 + Math.cos(a) * (20 + k * 11), 70 + Math.sin(a) * (12 + k * 7), 2.1, C.white, C.ink, 0.6); }).join('')), kaaba(60, 78, 0.9), path('M84 40 C92 46 92 56 86 62', 'none', HL, 2), path('M86 62 L82 56 M86 62 L90 56', 'none', HL, 2)),
  'islam.offerfest': all(sheep(24, 96, 1.6), arrow(42, 86, 54, 86, HL, 2), plate(66, 70, 9, ellipse(66, 68, 5, 2.4, '#c9705a', C.ink, 0.8)), plate(66, 86, 9, ellipse(66, 84, 5, 2.4, '#c9705a', C.ink, 0.8)), plate(66, 102, 9, ellipse(66, 100, 5, 2.4, '#c9705a', C.ink, 0.8)),
    ...[0, 1, 2].map((i) => all(arrow(78, [70, 86, 102][i]!, 88, [70, 86, 102][i]!, HL, 1.6), bust(102, [66, 82, 98][i]! as number, ['#3f6fb5', '#c96b3c', '#9a8a70'][i]!, i === 0 ? bScarf(TURQ) : i === 1 ? bCap : '', 1.1))), crescent(24, 30, 8, GOLD, C.ink), ground),
  'islam.välgörenhet': all(at(60, 96, 1, rect(-26, -30, 52, 34, '#3f8fc0', 3, C.ink, 1.6), rect(-12, -32, 24, 4, C.ink, 1, null), heart(0, -10, 1.2, C.red)), coin(52, 44, 4.5), coin(64, 52, 4.5), arrow(76, 30, 64, 46, HL, 2), hand(84, 28, 1, 200), ground),

  // ── 2126 Islamisk vetenskapshistoria ──
  'islam.vetenskapsman': all(rect(4, 4, 112, 108, '#f2ece0', 3, null), rect(56, 76, 56, 6, WOOD, 2, C.ink, 1.4), line('M62 82 L62 112 M106 82 L106 112', WOOD2, 3), scholar(36, 0.95, '#7a3f8a', 'smile', '#2b2a33'), astrolabe(96, 56, 14), scroll(70, 64, 0.5), books(84, 76, 2, 0.7), reach(36, 0.95, 1, 80, 56), ground),
  'islam.astronomi': all(sky(NIGHT, 112), ...[[14, 14], [30, 30], [50, 12], [72, 24], [96, 14], [108, 40], [86, 46], [40, 50]].map(([x, y]) => starDot(x!, y!, 1.6)), line('M30 30 L50 12 L72 24 L96 14', '#8fa8d8', 0.8, '2 2'), circle(100, 70, 7, '#d98a4a', C.ink, 1.2), ellipse(100, 70, 12, 3, 'none', '#f2d48a', 1.2),
    bust(34, 98, '#3f6fb5', bTurban, 1.6), at(48, 84, 1, rect(0, -3, 26, 6, '#b88a20', 2, C.ink, 1.2)), path('M74 81 L84 76', 'none', '#f6e08a', 1.4, )),
  'islam.observatorium': all(sky('#2b3a67', 112), ...[[14, 16], [40, 10], [90, 12], [106, 30], [24, 40]].map(([x, y]) => starDot(x!, y!)), path('M4 112 L4 96 C30 88 90 88 116 96 L116 112 Z', '#4a5a4a', null),
    rect(32, 66, 56, 30, '#d8d0c0', 1, C.ink, 1.5), path('M30 66 C30 34 90 34 90 66 Z', '#b8bcc4', C.ink, 1.5), path('M56 66 L56 39 C58 38 62 38 64 39 L64 66 Z', '#1a2240', C.ink, 1), line('M60 50 L78 22', '#e6d6b0', 3), rect(54, 80, 12, 16, '#6b4a2e', 1, C.ink, 1)),
  'islam.astrolabium': all(rect(4, 4, 112, 108, '#efe6d2', 3, null), astrolabe(60, 62, 40)),
  'islam.algebra': all(rect(10, 16, 100, 70, '#2f4a3a', 3, C.ink, 1.8), rect(10, 86, 100, 5, WOOD, 1, C.ink, 1.2), T(60, 46, 'x + 3 = 7', 15, C.white, 700), T(60, 72, 'x = 4', 15, '#f2d48a', 700), rect(86, 82, 10, 4, C.white, 1, null), ground),
  'islam.arabiska-siffror': all(rect(4, 4, 112, 108, '#f6f1e6', 3, null), ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d, i) => T(18 + (i % 5) * 21, 36 + Math.floor(i / 5) * 26, d, 20, i === 9 ? HL : GREEN2)), greyed(T(60, 96, 'I  V  X  L', 14, C.grey)), line('M14 78 L106 78', C.grey2, 1.2)),
  'islam.läkekonst': all(rect(4, 4, 112, 108, '#f2ece0', 3, null), scholar(34, 0.95, '#2f8a6a', 'smile', '#e2e2e2'), reach(34, 0.95, 1, 64, 68), at(80, 112, 1, rect(-20, -16, 40, 16, '#c9b98a', 1, C.ink, 1.3)), sit(84, 0.6, '#c96b3c', { cap: sScarf('#7a5aa8') }), flask(64, 64, 0.8, '#7ac08a'), ...[[100, 30], [108, 40]].map(([x, y]) => path(`M${x!} ${y!} C${x! - 4} ${y! - 8} ${x! + 4} ${y! - 12} ${x! + 2} ${y! - 18}`, 'none', PALM, 2.4)), rect(94, 36, 18, 14, '#c9975a', 2, C.ink, 1.2), closedBook(60, 30, 0.8, RED)),
  'islam.alkemi': all(rect(4, 4, 112, 108, '#ece4d4', 3, null), flame(36, 104, 1), rect(24, 86, 24, 4, C.dark, 1, null), flask(36, 70, 1.6, '#7ac08a'), path('M38 44 C46 34 60 34 70 42 L92 64', 'none', '#b8c4cc', 3.4), path('M38 44 C46 34 60 34 70 42 L92 64', 'none', C.ink, 0.8), at(96, 88, 1, path('M-10 -18 L10 -18 L8 4 C8 8 -8 8 -8 4 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-9 -4 L9 -4 L8 4 C8 7 -8 7 -8 4 Z', '#7ac08a', null)), drop(92, 72, 0.8, '#7ac08a'),
    path('M70 104 L78 96 L88 96 L94 104 Z', GOLD, C.ink, 1.2), line('M76 100 L80 98', '#fff3b0', 1.4), ground),
  'islam.optik': all(rect(4, 4, 112, 108, '#f2ece0', 3, null), lamp(22, 66, 1.2), ...[[50, 52], [50, 66], [50, 80]].map(([x, y]) => arrow(x! - 12, 66 + (y! - 66) * 0.2, x! + 30, 66 + (y! - 66) * 0.05, '#e8a020', 2.2)), eye(96, 66, 1.3), greyed(arrow(96, 92, 60, 100, C.grey, 2)), noSign(78, 98, 7)),

  // ── 2127 Olika muslimska traditioner ──
  'islam.riktning.2': all(path('M54 112 L56 70 L64 70 L66 112 Z', WOOD, C.ink, 1.4), path('M58 72 C50 54 36 46 22 40', 'none', GREEN, 6), path('M60 72 C60 54 60 40 60 26', 'none', TILE, 6), path('M62 72 C70 54 84 46 98 40', 'none', '#b07a2a', 6),
    ...[[18, 30, GREEN], [60, 16, TILE], [102, 30, '#b07a2a']].map(([x, y, col]) => all(circle(+x!, +y!, 13, C.white, col as string, 2.4), bust(+x! - 4, +y! - 2, col as string, bCap, 0.7), bust(+x! + 5, +y! + 1, col as string, bScarf(col as string), 0.7))), closedBook(60, 94, 0.8, GREEN), ground),
  'islam.sunnimuslim': all(pie(44, 56, 34, 0.87, GREEN), T(44, 64, '87', 14, C.white), bust(98, 50, '#2f8a6a', bCap, 1.6), bust(98, 90, '#2f8a6a', bScarf(GREEN), 1.6), line('M78 56 L88 56', GREEN, 2)),
  'islam.shiamuslim': all(pie(44, 56, 34, 0.13, '#3f6fb5'), g('translate(4 -4)', path('M44 56 L44 22 A34 34 0 0 1 68.1 32 Z', '#3f6fb5', C.ink, 1.4)), T(54, 38, '13', 10, C.white), bust(98, 50, '#3f6fb5', bTurban, 1.6), bust(98, 90, '#3f6fb5', bScarf('#2b2a33'), 1.6)),
  'islam.sharia': all(path('M10 112 C34 96 46 84 54 64 C60 50 68 40 80 34', 'none', '#e6d6b0', 14), mosque(92, 40, 0.45, { minarets: 1 }), closedBook(34, 50, 1.4, GREEN2), at(34, 26, 1, line('M0 -10 L0 8 M-14 -6 L14 -6', C.ink, 1.6), path('M-18 2 L-14 -6 L-10 2 Z M10 2 L14 -6 L18 2 Z', 'none', C.ink, 1), ellipse(-14, 2, 5, 1.6, GOLD, C.ink, 0.9), ellipse(14, 2, 5, 1.6, GOLD, C.ink, 0.9)), ...[[20, 104], [34, 96], [46, 84]].map(([x, y]) => footprint(x!, y!, 1, GOLD, 50)), ground),
  'islam.rättsskola': all(scroll(60, 56, 0.9), ...[[20, 24, GREEN], [100, 24, TILE], [20, 92, '#b07a2a'], [100, 92, '#7a3f8a']].map(([x, y, col]) => all(circle(+x!, +y!, 16, C.white, col as string, 2.4), closedBook(+x!, +y! + 4, 0.55, col as string), bust(+x! - 7, +y! - 6, col as string, bTurban, 0.6), bust(+x! + 7, +y! - 6, col as string, bTurban, 0.6), line(`M${+x! < 60 ? +x! + 16 : +x! - 16} ${+y!} L${+x! < 60 ? 46 : 74} ${+y! < 60 ? 44 : 68}`, col as string, 1.6, '3 2')))),
  'islam.mystiker': all(rect(4, 4, 112, 108, '#2b3a67', 3, null), glow(60, 64, 40, 'rgba(255,236,150,0.18)'), ...Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(60 + Math.cos(a) * 14)} ${f1(80 + Math.sin(a) * 14)} L${f1(60 + Math.cos(a) * 22)} ${f1(80 + Math.sin(a) * 22)}`, '#f6e08a', 1.6); }), sit(60, 1, '#c9b98a', { cap: sTurban, mood: 'calm' }), heart(60, 82, 0.55, '#f6c040'), starDot(18, 20), starDot(100, 18), crescent(96, 30, 6, '#f6e08a', null)),
  'islam.sufism': all(rect(4, 4, 112, 108, '#f2ece0', 3, null), ellipse(60, 100, 50, 10, '#e6d6b0', null), sit(60, 0.8, '#5a4a3a', { cap: sTurban, mood: 'calm' }), ...[[20, 0.6], [100, 0.6], [36, 0.5], [84, 0.5]].map(([x, s]) => sit(x!, s!, '#c9b98a', { cap: sCap, mood: 'calm' })), heart(60, 30, 0.8, C.red), ...[44, 76].map((x) => path(`M${x} 28 q4 -4 0 -8 q-4 -4 0 -8`, 'none', HL, 1.6)), at(100, 70, 1, ellipse(0, 0, 8, 3, '#c9975a', C.ink, 1.2), rect(-8, 0, 16, 8, '#c9975a', 1, C.ink, 1.2))),
  'islam.dervisch': all(rect(4, 4, 112, 108, '#eadfcf', 3, null), path('M60 50 L28 108 C46 114 74 114 92 108 Z', C.white, C.ink, 1.6), path('M44 108 C52 100 52 80 56 60 M76 108 C68 100 68 80 64 60', 'none', '#d6d6d0', 1.2), rect(50, 30, 20, 26, C.white, 3, C.ink, 1.5),
    lo('M52 34 L34 18', C.white, 4.5), lo('M68 36 L88 46', C.white, 4.5), circle(33, 17, 3, C.skin, C.ink, 1.1), circle(89, 47, 3, C.skin, C.ink, 1.1), circle(60, 22, 7.5, C.skin, C.ink, 1.3), path('M54.5 22 Q56.4 19 58.2 22 M61.8 22 Q63.6 19 65.5 22', 'none', C.ink, 1.1), line('M57.4 25.5 Q60 27.5 62.6 25.5', C.ink, 1.1), path('M54 16 L55 0 L65 0 L66 16 Z', '#a8743f', C.ink, 1.3), path('M18 92 C14 80 14 68 20 58', 'none', HL, 2), path('M102 92 C106 80 106 68 100 58', 'none', HL, 2), arrow(19, 62, 21, 56, HL, 2)),
  'islam.mångfald': all(...[[16, '#c96b3c', 'cap'], [34, '#2b2a33', 'scarf'], [52, '#3f6fb5', 'none'], [70, '#e8a050', 'turban'], [88, '#7a5aa8', 'scarf2'], [106, C.green, 'none']].map(([x, col, hat], i) => all(fig(+x!, col as string, 'smile', { h: [0.8, 0.74, 0.86, 0.9, 0.7, 0.62][i], hairStyle: i % 2 ? 'long' : 'short', skin: ['#f1c7a1', '#c98b5e', '#8d5a3a', '#f1c7a1', '#d9a57c', '#a8704a'][i], hair: ['#3b2f2f', '#2b2a33', '#e8c870', '#2b2a33', '#3b2f2f', '#2b2a33'][i] }),
    on(+x!, [0.8, 0.74, 0.86, 0.9, 0.7, 0.62][i]!, hat === 'cap' ? capL() : hat === 'turban' ? turbanL() : hat === 'scarf' ? scarfL('#2f8a6a') : hat === 'scarf2' ? scarfL('#e86a6a') : ''))), starBand(14, GOLD, 16, 104, 15, 4.5), ground),
};
