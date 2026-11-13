/**
 * Historia & humaniora → Filosofi & etik → Existens & verklighet, 2251–2257 (0.39): existence and being,
 * cause and necessity, time and space, reality and appearance, the meaning of life, death and finitude, and
 * the themes of existentialism. Abstract words are symbolic mini-scenes: the coloured idea dominates and a grey
 * or dashed copy stands beside it as contrast (what exists is solid colour, what does not is a dashed grey
 * outline). Philosophers are small neutral figures in robes, never portraits. Time is an hourglass, a clock or
 * an arrow; the infinite is a gold loop. No words, no letters, no pointing fingers, no religious or national
 * symbols.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { arm, bubble, cloud, heart, plaster, sun, thought } from './people';
import { P as F, type Mood, coin, greyed, drop } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const DAY = '#dff0fa';
const WARM = '#fdf0d5';
const NIGHT = '#1f2a4d';
const DUSK = '#4a3b63';
const ROBE = '#b0643a';
const ROBE2 = '#5a7fa8';
const PARCH = '#f3e6c4';
const GREY = '#8d949c';
const STONE = '#9a8f7a';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const sky = (col: string = DAY, y2 = 112) => rect(4, 4, 112, y2 - 4, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−54; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** A philosopher: a small neutral figure in a long robe with a sash. */
const sage = (x: number, h = 1, col: string = ROBE, mood: Mood = 'calm') => all(fig(x, col, mood, { h, bottom: col }),
  on(x, h, path('M-13 -40 L13 -40 L17 48 L-17 48 Z', col, C.ink, 1.4), path('M-13 -40 L13 6', 'none', PARCH, 4), line('M-13 -40 L13 6', C.ink, 0.6)));
/** A dashed grey outline of a person: something that does not exist (any more). */
const outline = (x: number, h = 1, col: string = GREY) => on(x, h, line('M-8 -54 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', col, 1.8, '3 3'), line('M-14 -42 L14 -42 L13 2 L11 48 L-11 48 L-13 2 Z', col, 1.8, '3 3'));
/** A small bust (head and shoulders). */
const bust = (x: number, y: number, top: string, s = 1, greyOut = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', greyOut ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, greyOut ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', greyOut ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null));
const kid = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, top, mood, { h: 0.56, ...more });
const old = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, top, mood, { h: 0.9, hair: '#e6e6e6', ...more });

// ── Things ───────────────────────────────────────────────────────────
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, C.white, C.green, 1.6), line('M-4 0 L-1 3 L4 -3', C.green, 2.2));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, C.white, C.red, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', C.red, 2.2));
const qm = (x: number, y: number, size = 14, col: string = C.accent) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">?</text>`;
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
/** A gold infinity loop. */
const inf = (x: number, y: number, s = 1, col: string = GOLD, sw = 3.4) => at(x, y, s, path('M0 0 C-6 -9 -18 -9 -18 0 C-18 9 -6 9 0 0 C6 -9 18 -9 18 0 C18 9 6 9 0 0 Z', 'none', col, sw));
/** An hourglass; frac = sand left on top (0–1). */
const hourglass = (x: number, y: number, s = 1, frac = 0.5, col: string = '#e8c27a') => at(x, y, s,
  path('M-10 -16 L10 -16 L1.5 0 L10 16 L-10 16 L-1.5 0 Z', '#eef6fb', C.ink, 1.4),
  frac > 0 ? path(`M${f1(-8 * frac)} ${f1(-2 - 12 * frac)} L${f1(8 * frac)} ${f1(-2 - 12 * frac)} L0 -1 Z`, col, null) : '',
  path(`M-8 14 L8 14 L${f1(8 - 7 * (1 - frac))} ${f1(14 - 10 * (1 - frac))} L${f1(-8 + 7 * (1 - frac))} ${f1(14 - 10 * (1 - frac))} Z`, col, null), frac > 0 && frac < 1 ? line('M0 -1 L0 13', col, 1) : '',
  rect(-13, -19, 26, 4, '#a8743f', 1, C.ink, 1.1), rect(-13, 15, 26, 4, '#a8743f', 1, C.ink, 1.1));
const clock = (x: number, y: number, r = 10, col: string = C.white, hh = -60, mm = 0) => all(circle(x, y, r, col, C.ink, 1.6),
  ...[0, 90, 180, 270].map((a) => line(`M${f1(x + Math.cos(a * Math.PI / 180) * r * 0.78)} ${f1(y + Math.sin(a * Math.PI / 180) * r * 0.78)} L${f1(x + Math.cos(a * Math.PI / 180) * r * 0.9)} ${f1(y + Math.sin(a * Math.PI / 180) * r * 0.9)}`, C.ink, 1.2)),
  line(`M${x} ${y} L${f1(x + Math.cos((hh - 90) * Math.PI / 180) * r * 0.5)} ${f1(y + Math.sin((hh - 90) * Math.PI / 180) * r * 0.5)}`, C.ink, 1.8),
  line(`M${x} ${y} L${f1(x + Math.cos((mm - 90) * Math.PI / 180) * r * 0.75)} ${f1(y + Math.sin((mm - 90) * Math.PI / 180) * r * 0.75)}`, C.ink, 1.2));
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-3, -18, 6, 18, C.brown, 1, C.ink, 1), circle(0, -28, 13, col, C.ink, 1.2), circle(-8, -22, 8, col, C.ink, 1.2), circle(8, -22, 8, col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col = '#f2ece0') => at(x, y, s, rect(-14, -18, 28, 18, col, 1, C.ink, 1.2), path('M-17 -18 L0 -30 L17 -18 Z', '#c4553c', C.ink, 1.2), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.8), rect(-11, -14, 6, 5, '#bfe3f5', 1, C.ink, 0.8));
const book = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, rect(-8, -10, 16, 20, col, 1.5, C.ink, 1.2), line('M-5 -10 L-5 10', C.white, 1));
const apple = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 7, col, C.ink, 1.2), line('M0 -7 Q1 -11 3 -12', C.brown, 1.6), path('M1 -9 C5 -12 8 -9 6 -7 C4 -7 2 -8 1 -9 Z', C.green, C.ink, 0.8));
const ball = (x: number, y: number, r = 6, col: string = C.red) => all(circle(x, y, r, col, C.ink, 1.3), circle(x - r * 0.35, y - r * 0.35, r * 0.25, 'rgba(255,255,255,0.7)', null));
const flower = (x: number, y: number, s = 1, col: string = C.pink, droop = 0) => at(x, y, s, line(`M0 0 Q${droop * 0.4} -10 ${droop} -18`, C.green, 1.8),
  g(`translate(${droop} -20)`, ...[0, 72, 144, 216, 288].map((a) => ellipse(Math.cos(a * Math.PI / 180) * 4, Math.sin(a * Math.PI / 180) * 4, 3.4, 2.4, col, C.ink, 0.8)), circle(0, 0, 2.4, C.yellow, C.ink, 0.8)));
const stars = (n = 14, col = '#fff2c0') => all(...Array.from({ length: n }, (_, i) => sparkle(10 + ((i * 41) % 100), 10 + ((i * 29) % 60), 1.6 + (i % 3) * 0.6, col)));
const flag = (x: number, y: number, col: string = C.red) => all(line(`M${x} ${y} L${x} ${y - 22}`, C.ink, 1.6), path(`M${x} ${y - 22} L${x + 14} ${y - 18} L${x} ${y - 13} Z`, col, C.ink, 1.1));
const stone = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 6 C-14 -4 -6 -10 2 -9 C10 -8 14 -2 12 6 Z', STONE, C.ink, 1.3));
const grave = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 L-10 -18 C-10 -27 10 -27 10 -18 L10 0 Z', '#b9b4aa', C.ink, 1.4), line('M-6 -16 L6 -16 M-6 -11 L6 -11', '#8f897d', 1.2), rect(-14, -1, 28, 4, '#8f897d', 1, C.ink, 1));
const candle = (x: number, y: number, h = 18, lit = true) => all(rect(x - 3, y - h, 6, h, C.white, 1, C.ink, 1.1), lit ? all(glow(x, y - h - 5, 7), path(`M${x} ${y - h - 10} C${x + 4} ${y - h - 4} ${x + 2} ${y - h} ${x} ${y - h} C${x - 2} ${y - h} ${x - 4} ${y - h - 4} ${x} ${y - h - 10} Z`, C.orange, C.ink, 0.8)) : line(`M${x} ${y - h} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -9`, GREY, 1.2));
const fork = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 30 L-4 0 L-26 -26 L-14 -30 L0 -12 L14 -30 L26 -26 L4 0 L6 30 Z', '#d9cdb4', C.ink, 1.2));
const fist = (x: number, y: number, s = 1) => at(x, y, s, rect(-5, -4, 10, 8, C.skin, 3, C.ink, 1), line('M-2 -4 L-2 0 M1 -4 L1 0', C.ink, 0.7));
const puzzle = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, path('M-8 -8 L-2 -8 C-2 -12 2 -12 2 -8 L8 -8 L8 -2 C12 -2 12 2 8 2 L8 8 L-8 8 Z', col, C.ink, 1.2));
const cube = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, path('M-10 -4 L0 -10 L10 -4 L10 8 L0 14 L-10 8 Z', col, C.ink, 1.4), path('M-10 -4 L0 2 L10 -4 M0 2 L0 14', 'none', C.ink, 1.2), path('M-10 -4 L0 -10 L10 -4 L0 2 Z', 'rgba(255,255,255,0.4)', null));
const eye = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 Q0 -8 10 0 Q0 8 -10 0 Z', C.white, C.ink, 1.3), circle(0, 0, 3.4, '#5a7fa8', C.ink, 0.9), circle(0, 0, 1.4, C.ink, null));
const bed = (x: number, y: number, w = 56) => all(rect(x - w / 2, y - 8, w, 10, C.white, 2, C.ink, 1.3), rect(x - w / 2 - 3, y - 20, 5, 30, C.brown, 1, C.ink, 1.1), rect(x + w / 2 - 2, y - 12, 5, 22, C.brown, 1, C.ink, 1.1));
const lying = (x: number, y: number, hair: string = C.hair, cover = '#bfd7ea') => all(ellipse(x + 2, y - 10, 7, 4, C.white, C.ink, 1), circle(x, y - 14, 5.4, C.skin, C.ink, 1.2), path(`M${x - 5.4} ${y - 15} C${x - 5} ${y - 21} ${x + 5} ${y - 21} ${x + 5.4} ${y - 15} Z`, hair, null), path(`M${x + 6} ${y - 12} C${x + 20} ${y - 18} ${x + 40} ${y - 16} ${x + 44} ${y - 10} L${x + 44} ${y - 6} L${x + 6} ${y - 6} Z`, cover, C.ink, 1.2));
const road = (x1: number, x2: number, y: number) => path(`M${x1} ${y} L${x2} ${y} L${x2} ${y - 6} L${x1} ${y - 6} Z`, '#d9cdb4', C.ink, 1);
const chair = (x: number) => all(line(`M${x - 8} 112 L${x - 8} 90 L${x + 8} 90 L${x + 8} 112 M${x - 8} 90 L${x - 10} 70`, C.brown, 2.4));
const cafeTable = (x: number) => all(line(`M${x} 88 L${x} 112 M${x - 8} 112 L${x + 8} 112`, C.dark, 2.4), ellipse(x, 86, 14, 3, C.white, C.ink, 1.3));
const cup = (x: number, y: number) => all(path(`M${x - 4} ${y - 6} L${x + 4} ${y - 6} L${x + 3} ${y} L${x - 3} ${y} Z`, C.white, C.ink, 1), line(`M${x + 4} ${y - 5} q3 1 0 4`, C.ink, 0.9));
const lantern2 = (x: number, y: number) => all(glow(x, y, 16, 'rgba(242,193,78,0.45)'), rect(x - 5, y - 8, 10, 14, '#fff2c0', 1, C.ink, 1.1), path(`M${x - 6} ${y - 8} L${x} ${y - 13} L${x + 6} ${y - 8} Z`, C.dark, C.ink, 0.9), line(`M${x} ${y + 6} L${x} 112`, C.ink, 1.6));
const chain = (x1: number, y1: number, x2: number, y2: number) => { const n = 5, out: Svg[] = []; for (let i = 0; i <= n; i++) out.push(ellipse(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, 2.6, 1.8, 'none', GREY, 1.4)); return all(...out); };

export const EXISTENCE_MOTIFS: Record<string, Svg> = {
  // ── 2251 Existens och varande ──
  'exi.existera': all(sky(WARM), ellipse(38, 112, 18, 3, 'rgba(0,0,0,0.18)', null), glow(38, 60, 34), fig(38, C.orange, 'smile'), tick(38, 10, 1.1), outline(86, 1), ground),
  'exi.existens': all(sky('#f6f2ea'), fig(30, C.orange, 'calm'), thought(82, 40, 52, all(glow(82, 40, 16), at(82, 50, 0.32, circle(0, -54, 7, C.skin, C.ink, 2), path('M-14 -42 L14 -42 L12 2 L-12 2 Z', C.orange, C.ink, 2), path('M-11 2 L-11 46 L11 46 L11 2 Z', C.navy, C.ink, 2)), sparkle(70, 34, 3), sparkle(96, 36, 3)), true), ground),
  'exi.finnas-till': all(sky(WARM), ellipse(36, 112, 22, 3, 'rgba(0,0,0,0.18)', null), glow(36, 76, 32), tree(36, 112, 1.3), tick(36, 14, 1.1), at(90, 112, 1.3, line('M-3 0 L-3 -18 L3 -18 L3 0 M0 -41 a13 13 0 1 0 0.1 0', GREY, 1.8, '3 3'), line('M-13 -28 a8 8 0 1 0 0 0.1 M13 -28 a8 8 0 1 0 0 0.1', GREY, 1.6, '3 3')), ground),
  'exi.tillvaro': all(sky(WARM), circle(60, 60, 50, 'rgba(255,255,255,0.6)', GOLD, 2.4), house(34, 66, 0.8), tree(88, 66, 0.6), sun(84, 26, 5), book(36, 86, 0.6), cup(86, 90),
    fig(60, C.green, 'smile', { h: 0.6 }), line('M60 18 C40 18 28 30 26 40', GOLD, 1.6, '2 3'), arrow(94, 36, 98, 46, GOLD, 2)),
  'exi.ting': all(sky('#f6f2ea'), rect(14, 78, 92, 8, '#a8743f', 2, C.ink, 1.4), line('M22 86 L22 112 M98 86 L98 112', '#a8743f', 4),
    book(30, 68, 0.9, C.red), apple(52, 71, 1), stone(74, 72, 0.8), cup(94, 77), ...[[30, 54], [52, 58], [74, 60], [94, 64]].map(([x, y]) => sparkle(x!, y!, 3, GOLD)), ground),
  'exi.varande': all(sky('#f2efe7'), circle(64, 56, 46, 'rgba(242,193,78,0.18)', GOLD, 2.6), rays(64, 56, 47, 53, 24, GOLD, 1.2), sun(64, 24, 5), tree(42, 70, 0.55), stone(86, 66, 0.8), house(64, 92, 0.6), at(40, 90, 1, path('M-8 0 C-4 -6 6 -6 8 0 C6 6 -4 6 -8 0 Z M8 0 L14 -4 L14 4 Z', C.orange, C.ink, 1)), star(90, 40, 5, C.yellow), fig(88, C.green, 'smile', { h: 0.3 }), sage(14, 0.6, ROBE), ground),
  'exi.metafysik': all(sky(NIGHT), stars(22), at(60, 30, 1, circle(0, 0, 13, '#e0a060', C.ink, 1.4), ellipse(0, 0, 20, 4, 'none', '#f2d7a0', 1.6)), clock(96, 22, 8, '#fff2c0'), path('M4 112 L4 96 C40 90 80 90 116 96 L116 112 Z', '#3a4a6a', null), sage(28, 0.62, ROBE2), qm(62, 74, 22, C.yellow), qm(88, 60, 14, C.yellow), qm(40, 50, 12, C.yellow)),
  'exi.ontologi': all(sky('#f6f2ea'), rect(40, 10, 74, 100, '#c9a77a', 2, C.ink, 1.6), line('M40 35 L114 35 M40 60 L114 60 M40 85 L114 85', C.ink, 1.6), stone(62, 30, 0.7), tree(92, 32, 0.32),
    thought(77, 47, 40, circle(77, 47, 4, C.yellow, C.ink, 1)), num(62, 80, '1', 14, C.navy), num(77, 80, '2', 14, C.navy), num(92, 80, '3', 14, C.navy), heart(68, 98, 0.45, C.red), heart(88, 98, 0.45, C.red), sage(18, 0.7, ROBE), reach(18, 0.7, 1, 38, 64), ground),
  'exi.väsen': all(sky('#f6f2ea'), kid(28, C.yellow, 'smile'), old(88, C.navy, 'smile', { h: 0.92 }), on(28, 0.56, glow(0, -24, 14), star(0, -24, 8, GOLD)), on(88, 0.92, glow(0, -24, 12), star(0, -24, 7, GOLD)), line('M36 82 C52 60 70 60 80 74', GOLD, 2, '3 3'), sparkle(58, 56, 4), ground),
  'exi.beståndsdel': all(sky(WARM), path('M60 104 C40 104 36 86 46 80 C56 74 76 74 84 82 C92 92 82 104 60 104 Z', '#d9a057', C.ink, 1.6), line('M50 86 L56 82 M62 86 L68 82 M74 88 L78 84', '#a8743f', 1.6),
    at(20, 30, 1, path('M-10 12 L-12 -6 L12 -6 L10 12 Z', C.white, C.ink, 1.3), line('M-8 0 L8 0', C.grey2, 2)), drop(60, 26, 2.2), at(100, 30, 1, rect(-6, -10, 12, 20, C.white, 2, C.ink, 1.2), rect(-6, -10, 12, 5, C.grey, 1, C.ink, 1)),
    arrow(28, 46, 46, 72, GOLD, 2.4), arrow(60, 40, 60, 70, GOLD, 2.4), arrow(92, 46, 76, 72, GOLD, 2.4), ground),
  'exi.helhet': all(sky('#f6f2ea'), glow(44, 58, 34), ...[[32, 46, C.red], [56, 46, C.denim], [32, 70, C.green], [56, 70, C.yellow]].map(([x, y, c]) => rect(x as number - 12, y as number - 12, 24, 24, c as string, 2, C.ink, 1.4)), rect(20, 34, 48, 48, 'none', 3, GOLD, 3),
    greyed(puzzle(92, 40, 1, C.red), puzzle(100, 70, 1, C.green), puzzle(84, 96, 1, C.yellow))),
  'exi.ur-intet': all(sky(NIGHT), line('M14 60 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0', '#6a7392', 1.6, '3 3'), arrow(50, 60, 68, 60, GOLD, 2.6), glow(90, 60, 22, 'rgba(255,242,192,0.4)'), star(90, 60, 13, C.yellow), sparkle(104, 42, 4, '#fff2c0'), sparkle(76, 80, 3, '#fff2c0')),

  // ── 2252 Orsak och nödvändighet ──
  'exi.orsak': all(sky(DAY), greyed(rect(70, 26, 40, 50, '#e6d3b3', 2, C.ink, 1.4), rect(76, 34, 28, 22, '#bfe3f5', 1, C.ink, 1.2), line('M84 38 L90 46 L86 52 M96 36 L92 44 L100 50', C.ink, 1.2)), ball(46, 98, 8), glow(46, 98, 18), circle(40, 92, 16, 'none', C.ink, 3), line('M28 104 L16 116', C.brown, 5), arrow(64, 88, 76, 70, GREY, 2), ground),
  'exi.orsakskedja': all(sky('#f6f2ea'), ...[[20, 50], [48, 50], [76, 50], [104, 50]].map(([x, y]) => ellipse(x!, y!, 14, 20, '#fbfbf8', GOLD, 3)), ...[34, 62, 90].map((x) => ellipse(x, 50, 6, 3.4, 'none', GOLD, 3)),
    cloud(20, 46, 0.6, C.grey2), ...[16, 22].map((x) => drop(x, 60, 0.6)), ellipse(48, 58, 10, 3, '#8cc7e8', C.ink, 1), at(48, 44, 0.6, drop(0, 0, 1.6)), at(76, 52, 0.7, line('M-8 6 L8 6 M-6 6 L-2 -10 M2 -10 L6 6', C.ink, 1.6), ellipse(0, 8, 10, 2, '#8cc7e8', null)), at(104, 54, 1, plaster(0, 0)), ground),
  'exi.kausalitet': all(sky('#f6f2ea'), rect(30, 12, 84, 74, '#2f4a3a', 3, C.ink, 2), ...[[26, 'fire'], [48, 'rain'], [70, 'ball']].map(([y, k]) => all(arrow(64, y as number, 82, y as number, GOLD, 2.2),
    k === 'fire' ? all(path('M48 32 C48 22 52 18 52 14 C56 20 58 24 56 32 Z', C.orange, C.ink, 1), cloud(98, 26, 0.5, '#9a9aa0')) : k === 'rain' ? all(cloud(50, 46, 0.6, C.grey2), drop(98, 50, 1.2)) : all(ball(50, 70, 5), at(98, 70, 0.6, rect(-10, -8, 20, 16, '#bfe3f5', 1, C.ink, 1.2), line('M-4 -6 L2 0 L-2 6', C.ink, 1))))), sage(16, 0.8, ROBE), ground),
  'exi.nödvändighet.2': all(sky('#f6f2ea'), rect(12, 30, 96, 36, C.white, 4, C.ink, 1.6), num(30, 56, '2', 22), num(46, 56, '+', 22), num(62, 56, '2', 22), num(78, 56, '=', 22), num(96, 56, '4', 22, C.green),
    at(96, 84, 1.3, rect(-7, -3, 14, 11, GOLD, 2, C.ink, 1.3), path('M-4 -3 L-4 -8 C-4 -13 4 -13 4 -8 L4 -3', 'none', C.ink, 1.6)), greyed(num(30, 100, '5', 20)), cross(44, 94, 0.8), ground),
  'exi.nödvändigtvis': all(sky('#f6f2ea'), at(28, 40, 1, ...[0, 1, 2, 3, 4, 5].map((i) => all(ellipse(0, 8 - i * 4, 9, 3.4, GOLD, C.ink, 1), line(`M-9 ${8 - i * 4} l0 2 M9 ${8 - i * 4} l0 2`, C.ink, 1)))), at(28, 88, 1, ellipse(0, 0, 14, 5, C.white, C.ink, 1.2), path('M-8 -2 C-6 -10 6 -10 8 -2 Z', '#8a7a5a', C.ink, 1)), arrow(28, 54, 28, 74, GREY, 2), cross(46, 82, 0.8),
    coin(92, 44, 5), at(92, 88, 1, ellipse(0, 0, 14, 5, C.white, C.ink, 1.2), path('M-8 -2 C-6 -10 6 -10 8 -2 Z', C.orange, C.ink, 1), sparkle(8, -12, 3)), arrow(92, 52, 92, 74, GREY, 2), tick(110, 82, 0.8), num(60, 70, '≠', 20, C.accent), ground),
  'exi.tillfällighet': all(sky(DAY), fig(34, C.orange, 'shock'), on(34, 1, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', C.red, C.ink, 1.2), rect(-14, -61, 28, 3, C.red, 1, C.ink, 1)),
    fig(86, C.denim, 'shock', { hairStyle: 'long' }), on(86, 1, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', C.red, C.ink, 1.2), rect(-14, -61, 28, 3, C.red, 1, C.ink, 1)),
    sparkle(60, 30, 6), sparkle(52, 44, 3.4), sparkle(68, 46, 3.4), ground),

  // ── 2253 Tid och rum ──
  'exi.tidens-gång': all(sky(DAY), arrow(8, 104, 112, 104, GOLD, 2.6), tree(18, 100, 0.3), tree(44, 100, 0.55), tree(72, 100, 0.8), tree(100, 100, 1.05, '#c98a3c'), hourglass(22, 30, 0.8, 0.7), ground),
  'exi.evig': all(sky(NIGHT), stars(8), glow(42, 56, 30, 'rgba(242,140,60,0.4)'), rect(30, 78, 24, 34, STONE, 2, C.ink, 1.4), path('M42 38 C54 52 54 66 48 76 L36 76 C30 66 30 52 42 38 Z', C.orange, C.ink, 1.4), path('M42 54 C48 62 47 70 44 76 L40 76 C37 70 36 62 42 54 Z', C.yellow, null), inf(42, 22, 0.7),
    greyed(candle(94, 112, 8, false), hourglass(94, 70, 0.7, 0))),
  'exi.oändlighet': all(sky(NIGHT), glow(60, 40, 30, 'rgba(242,193,78,0.25)'), inf(60, 40, 2), ...['1', '2', '3', '4', '5'].map((d, i) => num(16 + i * 18, 92 - i * 4, d, 16 - i * 2.4, '#fff2c0')), ...[0, 1, 2].map((i) => circle(102 + i * 5, 76 - i * 1.6, 1.4 - i * 0.3, '#fff2c0', null))),
  'exi.rymd': all(sky(NIGHT), stars(18), circle(92, 30, 14, '#e0a060', C.ink, 1.4), ellipse(92, 30, 22, 5, 'none', '#f2d7a0', 1.6),
    g('rotate(-20 48 70)', circle(48, 54, 10, '#eef6fb', C.ink, 1.6), rect(43, 51, 10, 6, '#5a7fa8', 2, C.ink, 1), rect(38, 64, 20, 22, C.white, 4, C.ink, 1.6), rect(34, 66, 6, 16, C.white, 3, C.ink, 1.2), rect(56, 66, 6, 16, C.white, 3, C.ink, 1.2), rect(40, 86, 7, 12, C.white, 3, C.ink, 1.2), rect(49, 86, 7, 12, C.white, 3, C.ink, 1.2)), globe2(18, 104)),
  'exi.ljusår': all(sky(NIGHT), stars(8), glow(18, 30, 12, 'rgba(255,242,192,0.5)'), star(18, 30, 8, C.yellow), line('M28 36 L94 84', '#fff2c0', 2.4, '5 4'), arrow(86, 78, 96, 86, '#fff2c0', 2.4), globe2(104, 94),
    at(66, 30, 1, circle(0, 0, 11, 'none', '#8cc7e8', 1.6), sun(0, -11, 2.4), circle(11, 0, 2.6, '#8cc7e8', null), circle(-11, 0, 2.6, '#8cc7e8', null), circle(0, 11, 2.6, C.white, null)), ...[40, 52, 64, 76].map((x) => line(`M${x} ${f1(36 + (x - 28) * 0.727 - 4)} l3 4`, '#fff2c0', 1.2))),
  'exi.tid-och-rum': all(sky('#eef3fb'), ...[0, 1, 2, 3, 4].map((i) => line(`M${20 + i * 16} 96 L${44 + i * 16} 72`, '#9fb3c8', 1)), ...[0, 1, 2].map((i) => line(`M${20 + i * 12} ${96 - i * 12} L${84 + i * 12} ${96 - i * 12}`, '#9fb3c8', 1)),
    arrow(20, 96, 100, 96, C.navy, 2), arrow(20, 96, 20, 20, C.navy, 2), arrow(20, 96, 48, 68, C.navy, 2), clock(70, 44, 14, '#fff2c0', 60, 0), sparkle(92, 26, 4)),
  'exi.rumslig': all(sky('#f6f2ea'), cube(52, 64, 2.2, C.sky), arrow(30, 96, 100, 96, C.red, 2.2), arrow(30, 96, 30, 22, C.green, 2.2), arrow(30, 96, 12, 108, C.denim, 2.2), greyed(rect(88, 22, 20, 20, C.sky, 1, C.ink, 1.2))),
  'exi.dimension': all(sky('#f6f2ea'), line('M12 74 L30 74', C.ink, 2.6), circle(12, 74, 2, C.ink, null), circle(30, 74, 2, C.ink, null), rect(42, 62, 22, 22, C.mint, 1, C.ink, 1.6), cube(94, 72, 1.6, GOLD),
    num(21, 98, '1', 11), num(53, 98, '2', 11), num(94, 104, '3', 11), arrow(32, 40, 88, 40, GREY, 1.6)),
  'exi.relativitetsteori': all(sky(NIGHT), stars(8), ...[0, 1, 2, 3, 4, 5].map((i) => path(`M8 ${50 + i * 10} C40 ${50 + i * 10} 48 ${70 + i * 6} 60 ${70 + i * 6} C72 ${70 + i * 6} 80 ${50 + i * 10} 112 ${50 + i * 10}`, 'none', '#6a86c0', 1)),
    circle(60, 66, 12, '#e0a060', C.ink, 1.4), at(30, 26, 1, path('M-12 0 L6 -5 L14 0 L6 5 Z', C.white, C.ink, 1.3), path('M-12 0 L-20 -4 L-20 4 Z', C.orange, C.ink, 1)), line('M4 26 L14 26 M2 30 L12 30', '#fff2c0', 1.2), clock(30, 44, 6, '#fff2c0', 10, 20), clock(96, 30, 8, '#fff2c0', 120, 240)),
  'exi.tidsresa': all(sky('#efe8f6'), ...[22, 16, 10].map((r) => circle(60, 62, r, 'none', C.purple, 2)), clock(60, 62, 6, C.white, 30, 200), at(18, 100, 0.8, path('M-12 0 L-12 -24 L-6 -24 L-6 -20 L0 -20 L0 -24 L6 -24 L6 -20 L12 -20 L12 0 Z', STONE, C.ink, 1.2)),
    at(102, 100, 0.8, rect(-10, -40, 20, 40, '#9fb3c8', 1, C.ink, 1.2), ...[0, 1, 2, 3].map((i) => rect(-6, -36 + i * 9, 12, 5, '#fff2c0', 0.5, null))), arrow(30, 88, 44, 74, C.purple, 2), arrow(76, 74, 90, 88, C.purple, 2), fig(60, C.orange, 'shock', { h: 0.5 })),
  'exi.linjär': all(sky('#f6f2ea'), rect(6, 58, 108, 6, '#8a7a6a', 1, C.ink, 1.2), ...Array.from({ length: 12 }, (_, i) => line(`M${10 + i * 9} 64 L${10 + i * 9} 68`, C.ink, 1.4)), at(40, 50, 1, rect(-14, -10, 28, 12, C.red, 3, C.ink, 1.3), rect(-10, -8, 8, 6, '#bfe3f5', 1, C.ink, 0.8), rect(2, -8, 8, 6, '#bfe3f5', 1, C.ink, 0.8)), arrow(62, 44, 112, 44, GOLD, 3),
    greyed(at(84, 92, 1, circle(0, 0, 14, 'none', '#8a7a6a', 4), path('M0 -14 A14 14 0 0 1 14 0', 'none', C.ink, 1.4))), cross(104, 82, 0.7)),
  // ── 2254 Verklighet och sken ──
  'exi.verklighet': all(sky(DAY), tree(76, 112, 1.4), sun(100, 20, 6), fig(36, C.orange, 'smile'), reach(36, 1, 1, 66, 76), tick(62, 16, 1.1), ground),
  'exi.overklig': all(sky('#efe8f6'), path('M4 112 L44 50 L64 70 L84 44 L116 112 Z', '#9aa7b8', C.ink, 1.6), path('M76 56 L84 44 L92 56 Z', C.white, null), fig(84, C.red, 'shock', { h: 0.36 }),
    ...[[30, 18], [60, 14], [98, 22], [16, 44], [108, 50]].map(([x, y]) => sparkle(x!, y!, 5)), ellipse(84, 52, 22, 18, 'rgba(199,179,230,0.35)', C.purple, 1.4), ...[0, 1, 2].map((i) => path(`M${14 + i * 30} ${80 + i * 4} q5 -5 10 0 q5 5 10 0`, 'none', C.purple, 1.6))),
  'exi.sken': all(sky(WARM), fig(36, C.navy, 'frown'), drop(30, 32, 0.9), drop(42, 34, 0.7), reach(36, 1, 1, 60, 54), glow(80, 32, 22), at(80, 32, 2, path('M-10 -10 C-10 -16 10 -16 10 -10 L10 2 C10 12 -10 12 -10 2 Z', C.white, C.ink, 0.8), circle(-4, -5, 1.6, C.ink, null), circle(4, -5, 1.6, C.ink, null), path('M-6 2 Q0 9 6 2', 'none', C.ink, 1.2), ellipse(-6, 1, 1.8, 1, '#f08aa0', null), ellipse(6, 1, 1.8, 1, '#f08aa0', null)), line('M78 52 L62 56', C.brown, 2.4), sparkle(104, 14, 4), ground),
  'exi.skenbar': all(sky(DAY), path('M14 30 L60 30 L60 104 L14 104 Z', '#f2ece0', C.ink, 1.6), path('M10 30 L37 12 L64 30 Z', '#c4553c', C.ink, 1.4), rect(20, 40, 12, 10, '#bfe3f5', 1, C.ink, 1), rect(42, 40, 12, 10, '#bfe3f5', 1, C.ink, 1), rect(31, 78, 12, 26, '#8a5a34', 1, C.ink, 1), sparkle(66, 18, 4),
    line('M60 60 L96 104 M60 40 L104 104', C.brown, 2.4), line('M60 30 L60 104', C.ink, 2.6), greyed(rect(64, 30, 46, 74, 'none', 0, C.grey, 1.2)), ground),
  'exi.skenet-bedrar': all(sky('#f6f2ea'), glow(30, 60, 24), apple(30, 62, 2.2), sparkle(46, 40, 4), arrow(52, 62, 66, 62, GREY, 2),
    at(92, 66, 2.2, path('M0 -7 A7 7 0 0 0 0 7 Z', C.red, C.ink, 0.8), path('M0 -6 A6 6 0 0 0 0 6 Z', '#fbf3dc', null), path('M2 -7 A7 7 0 0 1 2 7 Z', C.red, C.ink, 0.8), path('M2 -6 A6 6 0 0 1 2 6 Z', '#fbf3dc', null)), path('M82 66 c3 -4 6 4 9 0 c3 -4 6 4 9 0', 'none', '#b88aa0', 3), circle(101, 66, 1.6, '#b88aa0', C.ink, 0.6), ground),
  'exi.bedräglig': all(sky('#e6f1f8'), rect(4, 70, 112, 42, '#dff3fb', 0, null), line('M4 70 L116 70', '#9fc7dd', 2), sparkle(30, 76, 3, C.white), sparkle(90, 80, 3, C.white), path('M60 72 L66 82 L58 90 L68 100 M66 82 L76 86', 'none', 'rgba(60,90,120,0.45)', 1.4),
    g('translate(0 -42)', fig(52, C.orange, 'smile', { h: 0.6 })), rect(96, 40, 3, 30, C.brown, 0, null), at(98, 36, 1, path('M0 -12 L12 8 L-12 8 Z', C.yellow, C.ink, 1.3), num(0, 6, '!', 11, C.ink))),
  'exi.verklighetsuppfattning': all(sky('#f6f2ea'), at(60, 92, 1, ellipse(0, -18, 10, 3.4, C.sky, C.ink, 1.2), path('M-10 -18 L-10 0 C-10 4 10 4 10 0 L10 -18', C.sky, C.ink, 1.2)),
    fig(20, C.orange, 'smile', { h: 0.7 }), fig(100, C.green, 'smile', { h: 0.7 }), thought(24, 26, 30, circle(24, 26, 7, C.sky, C.ink, 1.2), false), thought(96, 26, 30, rect(89, 20, 14, 12, C.sky, 0, C.ink, 1.2)), ground),
  'exi.fenomen': all(sky(NIGHT), stars(10), path('M4 40 C30 20 50 50 76 30 C92 18 104 26 116 22 L116 44 C100 48 90 40 76 52 C50 70 30 42 4 60 Z', 'rgba(110,230,160,0.55)', null), path('M4 30 C30 12 60 40 116 14', 'none', 'rgba(170,140,240,0.6)', 3),
    path('M4 112 L4 96 C40 90 80 90 116 96 L116 112 Z', '#e8eef5', null), fig(80, C.red, 'shock', { h: 0.4 }), fig(92, C.navy, 'smile', { h: 0.4 })),
  'exi.tinget-i-sig': all(sky('#f6f2ea'), rect(72, 20, 40, 90, '#d7e3ee', 2, '#9fb3c8', 1.4), line('M76 28 L82 22 M76 40 L90 26', C.white, 2), at(92, 66, 1, line('M-10 -10 L10 -10 L10 10 L-10 10 Z', GREY, 1.6, '3 3')), qm(92, 72, 16, GREY),
    eye(22, 60, 1.4), ...[44, 52, 60].map((x) => circle(x, 60, 2, GOLD, null)), cube(58, 86, 0.9, GOLD), ground),
  'exi.idealism': all(sky('#f6f2ea'), fig(26, ROBE2, 'calm', { h: 0.8 }), path('M34 50 C44 40 52 40 58 40', 'none', C.ink, 0), thought(76, 40, 76, all(glow(76, 40, 30, 'rgba(242,193,78,0.25)'), sun(98, 24, 4), house(66, 52, 0.6), tree(88, 54, 0.45), stone(52, 48, 0.4)), true),
    line('M48 104 L112 104', GREY, 1.6, '3 3'), line('M60 96 L60 104 M80 92 L80 104 M100 96 L100 104', GREY, 1.4, '3 3'), ground),
  'exi.grottliknelse': all(rect(4, 4, 112, 108, '#3b3244', 3, null), path('M4 4 L116 4 L116 30 C80 20 40 24 4 36 Z', '#2b2433', null), rect(60, 34, 52, 48, '#5a4c66', 2, null),
    at(86, 58, 1, circle(-8, -10, 4, '#2b2433', null), path('M-14 8 C-14 -4 -2 -4 -2 8 Z', '#2b2433', null), circle(10, -8, 4, '#2b2433', null), path('M4 8 C4 -2 16 -2 16 8 Z', '#2b2433', null)),
    glow(20, 92, 16, 'rgba(242,140,60,0.5)'), path('M14 104 C14 92 20 86 20 80 C24 88 28 94 26 104 Z', C.orange, C.ink, 1), ...[38, 54, 70].map((x) => bust(x, 98, '#7a6a5a', 1)), line('M28 108 L84 108', '#6a5a4a', 2)),
  'exi.idévärld': all(sky('#eef3fb'), cloud(30, 56, 1.4, C.white), cloud(84, 58, 1.6, C.white), glow(60, 26, 20), circle(48, 24, 9, 'none', GOLD, 2.6), path('M66 32 L74 16 L82 32 Z', 'none', GOLD, 2.6), rays(60, 26, 22, 26, 12, GOLD, 1),
    fig(34, C.orange, 'calm', { h: 0.4 }), reach(34, 0.4, 1, 46, 98), path('M52 100 C46 92 58 86 64 92 C70 100 58 106 52 100 Z', 'none', GREY, 1.6), ground),
  'exi.avbild': all(sky(WARM), fig(36, C.green, 'smile', { hair: '#7a4a2a' }), on(36, 1, rect(-3, -30, 6, 4, C.red, 1, null)), fig(84, C.green, 'smile', { h: 0.56, hair: '#7a4a2a' }), on(84, 0.56, rect(-3, -30, 6, 4, C.red, 1, null)), sparkle(60, 50, 5), sparkle(66, 62, 3), ground),
  'exi.simulering': all(sky('#f6f2ea'), rect(8, 14, 104, 70, '#1f2a4d', 4, C.ink, 2), ...Array.from({ length: 6 }, (_, i) => line(`M${12 + i * 18} 18 L${12 + i * 18} 80`, '#3a5a9a', 0.8)), ...Array.from({ length: 4 }, (_, i) => line(`M12 ${24 + i * 16} L108 ${24 + i * 16}`, '#3a5a9a', 0.8)),
    tree(36, 72, 0.6, '#5ad08a'), house(80, 72, 0.7, '#9fd8f5'), rect(24, 24, 8, 8, '#f2c14e', 0, null), fig(60, C.orange, 'smile', { h: 0.62 }), on(60, 0.62, rect(-10, -59, 20, 8, C.dark, 2, C.ink, 1.2), line('M-10 -55 L-14 -52 M10 -55 L14 -52', C.dark, 1.6)), ground),

  // ── 2255 Livets mening ──
  'exi.meningslöshet': all(rect(4, 4, 112, 108, '#d0d1d5', 3, null), greyed(fig(44, C.grey, 'frown', { h: 0.82 }), clock(98, 26, 10)), thought(86, 60, 40, line('M78 58 C70 50 76 44 86 52 C96 44 102 50 94 58 L86 66 Z', GREY, 1.8, '3 3'), true), ground),
  'exi.livsmål': all(sky(DAY), path('M4 112 L60 24 L116 112 Z', '#9fbf8a', C.ink, 1.4), path('M30 112 C50 100 40 86 60 76 C78 66 56 50 62 34', 'none', '#e6d3b3', 4), flag(62, 30, C.red), glow(68, 18, 12), fig(34, C.orange, 'smile', { h: 0.36 })),
  'exi.livsuppgift': all(sky(WARM), road(6, 114, 108), kid(22, C.green, 'smile', { h: 0.5 }), tree(36, 104, 0.2), fig(60, C.green, 'smile', { h: 0.76 }), tree(76, 104, 0.55), old(96, C.green, 'smile', { h: 0.82 }), tree(112, 104, 0.9), arrow(10, 14, 110, 14, GOLD, 2.2), heart(60, 28, 0.6, C.red)),
  'exi.ge-mening-åt': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), greyed(rect(10, 30, 36, 44, C.white, 2, C.ink, 1.4), line('M16 42 L40 42 M16 52 L40 52 M16 62 L40 62', C.grey2, 1.4)), arrow(50, 52, 66, 52, GOLD, 2.6),
    glow(90, 52, 26), rect(72, 30, 36, 44, WARM, 2, C.ink, 1.6), heart(90, 54, 1, C.red), rays(90, 52, 24, 30, 12), fig(58, C.orange, 'smile', { h: 0.42 }), ground),
  'exi.ha-något-att-leva-för': all(sky(WARM), sun(100, 20, 7), rays(100, 20, 12, 18, 10), chair(30), old(30, C.navy, 'laugh', { h: 0.86 }), reach(30, 0.86, 1, 52, 70), kid(70, C.yellow, 'laugh'), reach(70, 0.56, -1, 56, 74), heart(50, 40, 0.8, C.red), arrow(60, 30, 44, 34, C.red, 1.6), ground),
  'exi.det-goda-livet': all(sky(WARM), circle(60, 60, 50, 'rgba(255,255,255,0.6)', GOLD, 2.4), sage(60, 0.62, ROBE), ...[[60, 18, 'sun'], [24, 44, 'book'], [96, 44, 'friend'], [26, 86, 'food'], [94, 86, 'tree']].map(([x, y, k]) => k === 'sun' ? sun(x as number, y as number, 5) : k === 'book' ? book(x as number, y as number, 0.6, C.red) : k === 'friend' ? all(bust(x as number - 5, y as number, C.orange, 0.8), bust(x as number + 6, y as number, C.green, 0.8)) : k === 'food' ? all(ellipse(x as number, y as number, 9, 3, C.white, C.ink, 1), circle(x as number - 3, y as number - 3, 3, C.green, C.ink, 0.8), circle(x as number + 3, y as number - 3, 3, C.red, C.ink, 0.8)) : tree(x as number, y as number + 8, 0.4))),
  'exi.hängivenhet': all(sky(NIGHT), stars(8), circle(100, 18, 7, '#fff2c0', C.ink, 1), lantern2(18, 70), fig(46, C.green, 'calm', { h: 0.82 }), reach(46, 0.82, 1, 70, 90), flower(82, 112, 1.6, C.red), heart(46, 24, 0.6, C.red), drop(56, 36, 0.8), clock(100, 50, 8, '#fff2c0', 0, 60), line('M4 112 L116 112', C.grey2, 2)),
  'exi.känsla-av-sammanhang': all(sky('#f6f2ea'), circle(42, 44, 24, 'rgba(242,193,78,0.15)', GOLD, 3), circle(78, 44, 24, 'rgba(242,193,78,0.15)', GOLD, 3), circle(60, 76, 24, 'rgba(242,193,78,0.15)', GOLD, 3),
    at(36, 38, 1, circle(0, -2, 6, C.yellow, C.ink, 1.2), rect(-3, 4, 6, 4, C.grey, 1, C.ink, 0.8)), at(86, 38, 1, rect(-2, -8, 4, 16, C.brown, 1, C.ink, 1), rect(-7, -12, 14, 6, C.grey, 1, C.ink, 1)), heart(60, 88, 0.6, C.red), fig(60, C.green, 'calm', { h: 0.32 })),
  // ── 2256 Döden och ändligheten ──
  'exi.död': all(sky('#e9e6ef'), grave(54, 112, 1.4), flower(28, 112, 1, C.pink), flower(80, 112, 1, C.yellow), candle(96, 112, 14, false), ground),
  'exi.dödlig': all(sky('#f6f2ea'), fig(34, C.orange, 'calm'), hourglass(62, 30, 0.8, 0.4), path('M58 112 C62 90 80 84 94 92', 'none', GREY, 1.6, ), grave(98, 112, 0.8), greyed(at(98, 60, 0.8, rect(-10, -26, 20, 26, STONE, 2, C.ink, 1), inf(0, -36, 0.4, C.grey))), ground),
  'exi.odödlig': all(sky(WARM), glow(44, 60, 36), fig(44, GOLD, 'smile', { bottom: '#b08a2a' }), inf(44, 8, 0.6), hourglass(96, 40, 0.7, 0.6), path('M106 26 C116 40 116 56 106 64', 'none', GOLD, 1.6), arrow(106, 64, 104, 54, GOLD, 1.6), greyed(grave(96, 112, 0.8)), cross(108, 90, 0.7), ground),
  'exi.ändlig': all(sky('#f6f2ea'), rect(10, 66, 88, 10, GOLD, 2, C.ink, 1.6), rect(10, 56, 5, 30, C.ink, 0, null), rect(96, 52, 6, 38, C.red, 1, C.ink, 1.2), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(`M${20 + i * 10} 66 L${20 + i * 10} 70`, C.ink, 1.2)),
    greyed(inf(60, 26, 0.8, C.grey)), cross(84, 18, 0.7), ground),
  'exi.ändlighet': all(sky(DUSK), sun(60, 96, 12), path('M4 112 L4 96 L116 96 L116 112 Z', '#6a5a7a', null), rect(14, 90, 34, 4, C.brown, 1, C.ink, 1), old(30, C.navy, 'calm', { h: 0.84 }), thought(82, 36, 56, all(road(60, 96, 42), rect(94, 30, 3, 14, C.red, 0, null)), false)),
  'exi.förgänglighet': all(sky('#f6f2ea'), arrow(8, 100, 112, 100, GOLD, 2.4), at(20, 92, 1, line('M0 0 L0 -16', C.green, 1.8), ellipse(0, -20, 3, 5, C.pink, C.ink, 0.8)), flower(48, 92, 1.3, C.pink), flower(78, 92, 1.1, '#d9a0b0', 8), at(104, 92, 1, line('M0 0 Q4 -8 8 -10', '#9a8a5a', 1.8)), ellipse(98, 96, 3, 1.4, '#d9a0b0', null), ellipse(108, 95, 3, 1.4, '#d9a0b0', null), ground),
  'exi.dödsångest': all(sky(NIGHT), stars(6), bed(54, 98, 70), lying(30, 96), circle(31, 82, 1, C.ink, null), circle(29, 82, 1, C.ink, null), drop(40, 74, 0.8), drop(22, 72, 0.7), thought(84, 34, 46, all(hourglass(76, 34, 0.45, 0.1), grave(96, 44, 0.5)), true), line('M18 70 l-3 2 l3 2 M44 70 l3 2 l-3 2', C.white, 1)),
  'exi.livet-efter-döden': all(sky('#e9e6ef'), path('M4 112 L4 96 C40 92 80 92 116 96 L116 112 Z', '#bfdcae', null), grave(30, 104, 1), glow(84, 22, 22, 'rgba(255,242,192,0.7)'), cloud(84, 26, 1.2, C.white),
    ...[[44, 76], [56, 60], [68, 44]].map(([x, y], i) => circle(x!, y!, 2.4 + i * 0.8, '#fff2c0', GOLD, 1)), line('M36 86 C46 72 58 56 74 36', GOLD, 1.4, '2 4')),
  'exi.dödsbädd': all(sky('#f2efe7'), bed(48, 100, 72), lying(22, 98, '#e6e6e6'), fig(96, C.denim, 'frown', { h: 0.9 }), reach(96, 0.9, -1, 66, 88), kid(76, C.yellow, 'frown'), candle(16, 66, 10, true)),
  'exi.efterlämna': all(sky(WARM), outline(24, 0.9), arrow(40, 70, 52, 70, GOLD, 2), house(76, 72, 0.9), kid(66, C.yellow, 'smile'), kid(90, C.sky, 'smile'), flower(106, 112, 1, C.red), tree(100, 112, 0.5), ground),
  'exi.eftervärlden': all(sky('#f6f2ea'), greyed(at(22, 112, 1, rect(-12, -10, 24, 10, STONE, 1, C.ink, 1.2), rect(-6, -40, 12, 30, STONE, 2, C.ink, 1.2), circle(0, -46, 6, STONE, C.ink, 1.2))), arrow(40, 30, 112, 30, GOLD, 2.6),
    ...[[54, 0.56, C.yellow], [70, 0.5, C.orange], [86, 0.56, C.sky], [102, 0.5, C.green]].map(([x, h, c]) => kid(x as number, c as string, 'smile', { h: h as number })), ...[60, 76, 92, 108].map((x) => kid(x, C.pink, 'smile', { h: 0.36 })), ground),
  // ── 2257 Existentialismens teman ──
  'exi.existentialism': all(sky('#eef3fb'), path('M60 96 C46 88 26 88 12 92 L12 40 C26 36 46 36 60 44 Z', '#fbf5e4', C.ink, 1.6), path('M60 96 C74 88 94 88 108 92 L108 40 C94 36 74 36 60 44 Z', '#fbf5e4', C.ink, 1.6),
    at(36, 76, 0.5, fork(0, 0, 1)), g('translate(0 -36)', fig(36, C.dark, 'calm', { h: 0.2 })), hourglass(76, 62, 0.5, 0.5), cloud(96, 58, 0.5, '#5d5a70'), heart(86, 80, 0.4, C.red), sparkle(60, 22, 5)),
  'exi.existentialist': all(sky('#f2efe7'), chair(26), fig(36, C.black, 'calm', { bottom: C.black, h: 0.9 }), reach(36, 0.9, 1, 60, 80), book(62, 78, 0.6, C.purple), cafeTable(74), cup(84, 84), thought(84, 30, 46, all(fork(84, 30, 0.35), arrow(80, 24, 72, 18, GOLD, 1.4), arrow(88, 24, 96, 18, GOLD, 1.4)), true), ground),
  'exi.dömd-till-frihet': all(sky('#f6f2ea'), fig(40, C.orange, 'frown'), chain(46, 106, 72, 106), at(84, 100, 1, circle(0, 0, 12, C.white, C.ink, 1.6), ...[0, 60, 120, 180, 240, 300].map((a) => arrow(0, 0, Math.round(Math.cos(a * Math.PI / 180) * 10), Math.round(Math.sin(a * Math.PI / 180) * 10), GOLD, 1.4))),
    ...[[96, 30], [104, 52], [82, 22]].map(([x, y]) => arrow(60, 40, x!, y!, GOLD, 2)), ground),
  'exi.vägval': all(sky(DAY), fork(60, 82, 1.2), fig(60, C.orange, 'calm', { h: 0.5 }), at(26, 46, 0.7, rect(-14, -30, 10, 30, '#9fb3c8', 1, C.ink, 1), rect(0, -40, 12, 40, '#7f93a8', 1, C.ink, 1)), tree(96, 52, 0.55), tree(108, 54, 0.4), ground),
  'exi.autentisk': all(sky('#f6f2ea'), greyed(...[16, 38, 82, 104].map((x) => fig(x, C.grey, 'smile', { h: 0.62 }))), glow(60, 80, 24), fig(60, C.purple, 'laugh', { h: 0.7, hairStyle: 'long' }), on(60, 0.7, heart(0, -24, 0.7, C.red)), sparkle(76, 40, 4), ground),
  'exi.ond-tro': all(sky('#f6f2ea'), rect(70, 24, 34, 88, '#fff7d6', 2, C.ink, 1.6), path('M70 24 L60 30 L60 106 L70 112 Z', '#a8743f', C.ink, 1.4), glow(87, 60, 20), ...[[80, 50], [94, 70]].map(([x, y]) => arrow(87, 90, x!, y!, GOLD, 2)),
    fig(30, C.navy, 'calm'), on(30, 1, rect(-10, -58, 20, 6, C.dark, 2, C.ink, 1)), reach(30, 1, -1, 10, 64), reach(30, 1, 1, 50, 64), chain(10, 66, 10, 96), chain(50, 66, 50, 96), ellipse(10, 100, 3, 2, 'none', GREY, 1.4), ellipse(50, 100, 3, 2, 'none', GREY, 1.4), ground),
  'exi.skapa-sig-själv': all(sky('#f6f2ea'), line('M74 112 L84 40 L94 112 M84 40 L84 112', C.brown, 2.4), rect(66, 34, 36, 44, C.white, 1, C.ink, 1.4), at(84, 56, 0.9, circle(0, -8, 6, C.skin, C.ink, 1.2), path('M-9 14 C-9 2 9 2 9 14 Z', C.orange, C.ink, 1.2), path('M-6 -10 C-6 -16 6 -16 6 -10 Z', C.hair, null)),
    fig(36, C.orange, 'smile'), reach(36, 1, 1, 66, 60), line('M66 60 L70 52', C.brown, 2), ground),
  'exi.existensen-föregår-essensen': all(sky('#f6f2ea'), greyed(num(8, 26, '1', 10), rect(14, 12, 24, 18, '#bfe3f5', 1, C.ink, 1), line('M18 22 L34 22', C.ink, 1.2), arrow(42, 21, 56, 21, C.ink, 1.6), num(64, 26, '2', 10), path('M72 24 L96 18 L96 26 L72 26 Z', C.silver, C.ink, 1.2), rect(96, 18, 14, 8, C.brown, 2, C.ink, 1)),
    line('M8 46 L112 46', C.grey2, 1.2, '3 3'), num(10, 66, '1', 12), outline(26, 0.62, C.ink), arrow(42, 84, 64, 84, GOLD, 2.6), num(72, 66, '2', 12), glow(94, 80, 22), fig(94, C.purple, 'laugh', { h: 0.62 }), on(94, 0.62, heart(0, -24, 0.7, C.red)), book(108, 92, 0.5, C.red), ground),
  'exi.det-absurda': all(sky('#2b2a3a'), stars(10, '#8a8aa0'), rect(70, 8, 46, 104, '#4a4a5a', 0, null), fig(36, C.orange, 'shock', { h: 0.8 }), reach(36, 0.8, 1, 54, 46), bubble(40, 22, 32, all(heart(34, 22, 0.45, C.red), qm(46, 27, 12)), false), bubble(92, 44, 30, '', true), ground),
  'exi.sisyfosarbete': all(sky(DAY), path('M4 112 L96 30 L116 30 L116 112 Z', '#b8a07a', C.ink, 1.4), g('translate(0 -48)', fig(56, C.orange, 'frown', { h: 0.5 }), reach(56, 0.5, 1, 70, 88)), circle(82, 30, 13, STONE, C.ink, 1.6), drop(48, 22, 0.8), path('M100 40 C114 60 104 96 74 104', 'none', C.accent, 2), arrow(80, 102, 64, 106, C.accent, 2.2)),
  'exi.revolt': all(sky(DUSK), cloud(30, 22, 1.2, '#5d5a70'), cloud(88, 18, 1.1, '#5d5a70'), ...[[24, 40], [44, 46], [92, 36]].map(([x, y]) => line(`M${x} ${y} l-4 10`, '#8cc7e8', 1.4)), glow(60, 70, 30), fig(60, C.red, 'angry'), reach(60, 1, 1, 82, 30), fist(82, 26, 1.4), ground),
  'exi.främlingskap': all(sky('#f6f2ea'), greyed(...[[60, 60], [76, 76], [44, 76], [60, 90]].map(([x, y]) => bust(x!, y!, C.grey, 1.4)), ellipse(60, 80, 30, 22, 'none', C.grey, 1.4)), fig(104, C.orange, 'frown', { h: 0.6 }), line('M86 112 L86 60', C.grey2, 1.4, '3 3'), ground),
};
function globe2(x: number, y: number): Svg { return all(circle(x, y, 10, '#bfe3f5', C.ink, 1.4), path(`M${x - 6} ${y - 4} C${x - 2} ${y - 7} ${x + 1} ${y - 2} ${x - 2} ${y + 1} C${x - 5} ${y + 3} ${x - 8} ${y} ${x - 6} ${y - 4} Z M${x + 2} ${y - 1} C${x + 6} ${y - 3} ${x + 8} ${y + 3} ${x + 3} ${y + 6} Z`, C.green, C.ink, 0.8)); }
