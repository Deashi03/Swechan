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
import { arm, bubble, cloud, heart, sun, thought } from './people';
import { P as F, type Mood, greyed, drop } from './blindFix';

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
const domino = (x: number, y: number, rot: number, col: string = C.white) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -16, 6, 16, col, 1, C.ink, 1.2), circle(0, -12, 0.9, C.ink, null), circle(0, -5, 0.9, C.ink, null));
const ball = (x: number, y: number, r = 6, col: string = C.red) => all(circle(x, y, r, col, C.ink, 1.3), circle(x - r * 0.35, y - r * 0.35, r * 0.25, 'rgba(255,255,255,0.7)', null));
const flower = (x: number, y: number, s = 1, col: string = C.pink, droop = 0) => at(x, y, s, line(`M0 0 Q${droop * 0.4} -10 ${droop} -18`, C.green, 1.8),
  g(`translate(${droop} -20)`, ...[0, 72, 144, 216, 288].map((a) => ellipse(Math.cos(a * Math.PI / 180) * 4, Math.sin(a * Math.PI / 180) * 4, 3.4, 2.4, col, C.ink, 0.8)), circle(0, 0, 2.4, C.yellow, C.ink, 0.8)));
const stars = (n = 14, col = '#fff2c0') => all(...Array.from({ length: n }, (_, i) => sparkle(10 + ((i * 41) % 100), 10 + ((i * 29) % 60), 1.6 + (i % 3) * 0.6, col)));
const flag = (x: number, y: number, col: string = C.red) => all(line(`M${x} ${y} L${x} ${y - 22}`, C.ink, 1.6), path(`M${x} ${y - 22} L${x + 14} ${y - 18} L${x} ${y - 13} Z`, col, C.ink, 1.1));
const stone = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 6 C-14 -4 -6 -10 2 -9 C10 -8 14 -2 12 6 Z', STONE, C.ink, 1.3));
const grave = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 L-10 -18 C-10 -27 10 -27 10 -18 L10 0 Z', '#b9b4aa', C.ink, 1.4), line('M-6 -16 L6 -16 M-6 -11 L6 -11', '#8f897d', 1.2), rect(-14, -1, 28, 4, '#8f897d', 1, C.ink, 1));
const candle = (x: number, y: number, h = 18, lit = true) => all(rect(x - 3, y - h, 6, h, C.white, 1, C.ink, 1.1), lit ? all(glow(x, y - h - 5, 7), path(`M${x} ${y - h - 10} C${x + 4} ${y - h - 4} ${x + 2} ${y - h} ${x} ${y - h} C${x - 2} ${y - h} ${x - 4} ${y - h - 4} ${x} ${y - h - 10} Z`, C.orange, C.ink, 0.8)) : line(`M${x} ${y - h} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -9`, GREY, 1.2));
const mask = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 -10 C-10 -16 10 -16 10 -10 L10 2 C10 12 -10 12 -10 2 Z', C.white, C.ink, 1.3), circle(-4, -5, 1.6, C.ink, null), circle(4, -5, 1.6, C.ink, null), path('M-5 3 Q0 8 5 3', 'none', C.ink, 1.4), line('M0 10 L0 22', C.brown, 1.8));
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
const chain = (x1: number, y1: number, x2: number, y2: number) => { const n = 5, out: Svg[] = []; for (let i = 0; i <= n; i++) out.push(ellipse(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, 2.6, 1.8, 'none', GREY, 1.4)); return all(...out); };

export const EXISTENCE_MOTIFS: Record<string, Svg> = {
  // ── 2251 Existens och varande ──
  'exi.existera': all(sky(WARM), ellipse(38, 112, 18, 3, 'rgba(0,0,0,0.18)', null), glow(38, 60, 34), fig(38, C.orange, 'smile'), tick(38, 10, 1.1), outline(86, 1), ground),
  'exi.existens': all(sky('#f6f2ea'), glow(48, 74, 38), rays(48, 74, 30, 38, 14), kid(48, C.yellow, 'calm'), on(48, 0.56, heart(0, -24, 0.7, C.red)), outline(96, 0.56), ground),
  'exi.finnas-till': all(sky(NIGHT), stars(16), glow(46, 58, 34, 'rgba(140,199,232,0.3)'), circle(46, 58, 24, '#bfe3f5', C.ink, 2), path('M30 48 C38 42 44 52 38 60 C32 66 26 58 30 48 Z M50 44 C60 40 68 50 62 60 C58 66 50 62 52 54 Z', C.green, C.ink, 1.2),
    line('M90 46 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0', GREY, 1.6, '3 3'), sun(26, 100, 5)),
  'exi.tillvaro': all(sky(WARM), circle(60, 60, 50, 'rgba(255,255,255,0.6)', GOLD, 2.4), house(34, 66, 0.8), tree(88, 66, 0.6), sun(84, 26, 5), book(36, 86, 0.6), cup(86, 90),
    fig(60, C.green, 'smile', { h: 0.6 }), line('M60 18 C40 18 28 30 26 40', GOLD, 1.6, '2 3'), arrow(94, 36, 98, 46, GOLD, 2)),
  'exi.ting': all(sky('#f6f2ea'), rect(14, 78, 92, 8, '#a8743f', 2, C.ink, 1.4), line('M22 86 L22 112 M98 86 L98 112', '#a8743f', 4),
    book(30, 68, 0.9, C.red), apple(52, 71, 1), stone(74, 72, 0.8), cup(94, 77), ...[[30, 54], [52, 58], [74, 60], [94, 64]].map(([x, y]) => sparkle(x!, y!, 3, GOLD)), ground),
  'exi.varande': all(sky('#f2efe7'), sage(28, 0.9, ROBE), glow(84, 58, 30), rays(84, 58, 18, 28, 16), circle(84, 58, 14, GOLD, C.ink, 1.6), circle(84, 58, 6, '#fff2c0', null),
    rect(72, 80, 24, 32, '#d9cdb4', 1, C.ink, 1.3), reach(28, 0.9, 1, 54, 64), ground),
  'exi.metafysik': all(sky('#f6f2ea'), sage(32, 0.95, ROBE2), thought(80, 32, 64, all(at(62, 32, 0.4, circle(0, 0, 20, '#bfe3f5', C.ink, 3)), clock(80, 32, 7), star(98, 32, 6, C.yellow))), qm(80, 64, 18), ground),
  'exi.ontologi': all(sky('#f6f2ea'), rect(52, 26, 60, 84, '#c9a77a', 2, C.ink, 1.4), line('M52 54 L112 54 M52 82 L112 82', C.ink, 1.4),
    stone(82, 48, 0.8), at(82, 72, 1, circle(0, -4, 6, C.yellow, C.ink, 1.2), rect(-3, 2, 6, 4, C.grey, 1, C.ink, 0.8)), ...[72, 82, 92].map((x) => circle(x, 100, 3, C.navy, null)),
    sage(26, 0.9, ROBE), reach(26, 0.9, 1, 52, 66), ground),
  'exi.väsen': all(sky('#f6f2ea'), glow(40, 52, 22), outline(40, 1, C.ink), on(40, 1, circle(0, -24, 9, GOLD, C.ink, 1.4), rays(0, -24, 11, 16, 10)),
    greyed(path('M76 102 L84 70 L104 70 L112 102 Z', C.navy, C.ink, 1.2), path('M80 62 L108 62 L104 54 L84 54 Z', C.dark, C.ink, 1.2)), arrow(56, 82, 72, 88, GREY, 2), ground),
  'exi.beståndsdel': all(sky(WARM), path('M60 104 C40 104 36 86 46 80 C56 74 76 74 84 82 C92 92 82 104 60 104 Z', '#d9a057', C.ink, 1.6), line('M50 86 L56 82 M62 86 L68 82 M74 88 L78 84', '#a8743f', 1.6),
    at(20, 30, 1, path('M-10 12 L-12 -6 L12 -6 L10 12 Z', C.white, C.ink, 1.3), line('M-8 0 L8 0', C.grey2, 2)), drop(60, 26, 2.2), at(100, 30, 1, rect(-6, -10, 12, 20, C.white, 2, C.ink, 1.2), rect(-6, -10, 12, 5, C.grey, 1, C.ink, 1)),
    arrow(28, 46, 46, 72, GOLD, 2.4), arrow(60, 40, 60, 70, GOLD, 2.4), arrow(92, 46, 76, 72, GOLD, 2.4), ground),
  'exi.helhet': all(sky('#f6f2ea'), glow(44, 58, 34), ...[[32, 46, C.red], [56, 46, C.denim], [32, 70, C.green], [56, 70, C.yellow]].map(([x, y, c]) => rect(x as number - 12, y as number - 12, 24, 24, c as string, 2, C.ink, 1.4)), rect(20, 34, 48, 48, 'none', 3, GOLD, 3),
    greyed(puzzle(92, 40, 1, C.red), puzzle(100, 70, 1, C.green), puzzle(84, 96, 1, C.yellow))),
  'exi.ur-intet': all(sky(NIGHT), line('M14 60 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0', '#6a7392', 1.6, '3 3'), arrow(50, 60, 68, 60, GOLD, 2.6), glow(90, 60, 22, 'rgba(255,242,192,0.4)'), star(90, 60, 13, C.yellow), sparkle(104, 42, 4, '#fff2c0'), sparkle(76, 80, 3, '#fff2c0')),

  // ── 2252 Orsak och nödvändighet ──
  'exi.orsak': all(sky(DAY), rect(70, 30, 40, 50, '#e6d3b3', 2, C.ink, 1.4), rect(76, 38, 28, 22, '#bfe3f5', 1, C.ink, 1.2), line('M84 42 L90 50 L86 56 M96 40 L92 48 L100 54', C.ink, 1.2),
    glow(32, 44, 14), ball(32, 44, 7), line('M16 54 C20 50 24 48 26 46', C.accent, 1.6, '3 3'), arrow(42, 44, 72, 48, C.accent, 2.4), greyed(kid(22, C.green, 'shock')), ground),
  'exi.orsakskedja': all(sky('#f6f2ea'), domino(16, 112, -60, C.yellow), domino(30, 112, -45), domino(44, 112, -30), domino(58, 112, -15), domino(72, 112, 0), domino(86, 112, 0), domino(100, 112, 0),
    ...[[22, 84, 34, 84], [38, 82, 50, 82], [52, 82, 64, 84]].map(([a, b, c, d]) => arrow(a!, b!, c!, d!, GOLD, 2)), ground),
  'exi.kausalitet': all(sky('#eaf2e6'), rect(8, 70, 104, 34, '#3f8a5a', 4, C.ink, 1.6), ball(36, 86, 7, C.white), ball(70, 86, 7, C.red), at(56, 86, 1, star(0, 0, 5, C.yellow)), arrow(14, 86, 26, 86, GOLD, 2.4), arrow(80, 86, 104, 86, GOLD, 2.4), sage(30, 0.5, ROBE2), thought(84, 36, 44, all(ball(74, 36, 4, C.white), arrow(80, 36, 90, 36, GOLD, 1.6), ball(96, 36, 4, C.red)), false)),
  'exi.nödvändighet.2': all(sky(DAY), tree(28, 112, 1.2), apple(46, 44, 1), arrow(46, 56, 46, 100, C.accent, 2.6), apple(46, 106, 0.8),
    at(62, 76, 1, rect(-7, -3, 14, 11, GOLD, 2, C.ink, 1.3), path('M-4 -3 L-4 -8 C-4 -13 4 -13 4 -8 L4 -3', 'none', C.ink, 1.6)),
    greyed(apple(92, 80, 1)), line('M92 72 L92 40', GREY, 1.6, '3 3'), cross(102, 40, 0.9), ground),
  'exi.nödvändigtvis': all(sky('#f6f2ea'), at(26, 60, 1, ...[0, 1, 2, 3, 4].map((i) => all(ellipse(0, 8 - i * 4, 9, 3.4, GOLD, C.ink, 1), line(`M-9 ${8 - i * 4} l0 2 M9 ${8 - i * 4} l0 2`, C.ink, 1)))),
    arrow(40, 56, 72, 34, GREY, 2.2), arrow(40, 60, 72, 84, GREY, 2.2), tick(86, 30, 1.3), cross(86, 86, 1.3), qm(60, 64, 14, C.accent), ground),
  'exi.tillfällighet': all(sky(DAY), fig(34, C.orange, 'shock'), on(34, 1, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', C.red, C.ink, 1.2), rect(-14, -61, 28, 3, C.red, 1, C.ink, 1)),
    fig(86, C.denim, 'shock', { hairStyle: 'long' }), on(86, 1, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', C.red, C.ink, 1.2), rect(-14, -61, 28, 3, C.red, 1, C.ink, 1)),
    sparkle(60, 30, 6), sparkle(52, 44, 3.4), sparkle(68, 46, 3.4), ground),

  // ── 2253 Tid och rum ──
  'exi.tidens-gång': all(sky(DAY), arrow(8, 104, 112, 104, GOLD, 2.6), tree(18, 100, 0.3), tree(44, 100, 0.55), tree(72, 100, 0.8), tree(100, 100, 1.05, '#c98a3c'), hourglass(22, 30, 0.8, 0.7), ground),
  'exi.evig': all(sky(NIGHT), stars(10), glow(60, 48, 34, 'rgba(242,193,78,0.3)'), inf(60, 48, 1.6), clock(60, 48, 9), greyed(hourglass(98, 92, 0.8, 0), candle(22, 104, 10, false))),
  'exi.oändlighet': all(sky(NIGHT), ...Array.from({ length: 10 }, (_, i) => { const t = i / 9, s = 1 - t * 0.85; return star(Math.round(16 + t * 84), Math.round(96 - t * 66), 7 * s, C.yellow); }), inf(30, 30, 0.9), line('M16 96 L100 30', 'rgba(255,242,192,0.4)', 1, '2 4')),
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
  'exi.linjär': all(sky('#f6f2ea'), arrow(8, 76, 114, 76, GOLD, 3), ...[[18, 0.34], [44, 0.5], [72, 0.62], [100, 0.6]].map(([x, h], i) => i === 3 ? old(x!, C.green, 'smile', { h: h! }) : fig(x!, C.green, 'smile', { h: h! })),
    greyed(at(100, 26, 1, path('M0 -12 A12 12 0 1 1 -12 0', 'none', C.ink, 2), path('M-12 0 L-15 -6 L-8 -4 Z', C.ink, null))), ground),

  // ── 2254 Verklighet och sken ──
  'exi.verklighet': all(sky('#f6f2ea'), rect(8, 40, 60, 66, DAY, 3, C.ink, 2.4), tree(24, 104, 0.6), house(50, 104, 0.8), sun(56, 52, 5),
    greyed(cloud(92, 40, 1.4, C.white), at(92, 40, 0.8, tree(-6, 10, 0.4), house(8, 10, 0.4))), fig(96, C.orange, 'smile', { h: 0.62 }), ground),
  'exi.overklig': all(sky('#efe8f6'), path('M4 112 L44 50 L64 70 L84 44 L116 112 Z', '#9aa7b8', C.ink, 1.6), path('M76 56 L84 44 L92 56 Z', C.white, null), fig(84, C.red, 'shock', { h: 0.4 }),
    ...[[64, 22], [100, 26], [54, 40], [110, 52]].map(([x, y]) => sparkle(x!, y!, 4)), path('M20 28 q6 -6 12 0 q6 6 12 0', 'none', C.purple, 1.6), path('M16 40 q6 -6 12 0 q6 6 12 0', 'none', C.purple, 1.6)),
  'exi.sken': all(sky(WARM), fig(54, C.navy, 'frown'), drop(48, 34, 0.8), reach(54, 1, 1, 66, 46), mask(74, 22, 1.4), sparkle(96, 14, 4)),
  'exi.skenbar': all(sky(DAY), rect(4, 46, 112, 66, '#2e5d86', 2, null), line('M4 46 L116 46', '#bfe3f5', 3), at(30, 40, 0.8, path('M-12 0 L12 0 L8 6 L-8 6 Z', C.red, C.ink, 1.2), line('M0 0 L0 -14', C.ink, 1.2), path('M0 -14 L10 -4 L0 -4 Z', C.white, C.ink, 1)),
    ...[[40, 74], [72, 88], [90, 66]].map(([x, y]) => path(`M${x} ${y} c6 -10 18 -4 12 4 c-4 6 -12 2 -8 -4`, 'none', '#6a86c0', 1.6)), at(66, 72, 1, path('M-8 0 C-4 -6 6 -6 8 0 C6 6 -4 6 -8 0 Z M8 0 L14 -4 L14 4 Z', C.orange, C.ink, 1)), cloud(90, 22, 0.8, C.white)),
  'exi.skenet-bedrar': all(sky('#f6f2ea'), glow(30, 60, 24), apple(30, 62, 2.2), sparkle(46, 40, 4), arrow(52, 62, 66, 62, GREY, 2),
    at(92, 66, 2.2, path('M0 -7 A7 7 0 0 0 0 7 Z', C.red, C.ink, 0.8), path('M0 -6 A6 6 0 0 0 0 6 Z', '#fbf3dc', null), path('M2 -7 A7 7 0 0 1 2 7 Z', C.red, C.ink, 0.8), path('M2 -6 A6 6 0 0 1 2 6 Z', '#fbf3dc', null)), path('M82 66 c3 -4 6 4 9 0 c3 -4 6 4 9 0', 'none', '#b88aa0', 3), circle(101, 66, 1.6, '#b88aa0', C.ink, 0.6), ground),
  'exi.bedräglig': all(sky('#fbe6b8'), sun(98, 18, 7), path('M4 112 L4 90 C30 84 90 84 116 90 L116 112 Z', '#e8c27a', null), ellipse(78, 78, 26, 6, 'rgba(140,199,232,0.6)', '#8cc7e8', 1.2, ), ...[66, 78, 90].map((x) => path(`M${x - 6} 70 q3 -3 6 0 q3 3 6 0`, 'none', '#8cc7e8', 1)), tree(92, 76, 0.4),
    fig(30, C.orange, 'smile', { h: 0.8 }), reach(30, 0.8, 1, 50, 70), drop(22, 40, 0.8), line('M52 78 L104 78', GREY, 1, '2 3')),
  'exi.verklighetsuppfattning': all(sky('#f6f2ea'), at(60, 92, 1, ellipse(0, -18, 10, 3.4, C.sky, C.ink, 1.2), path('M-10 -18 L-10 0 C-10 4 10 4 10 0 L10 -18', C.sky, C.ink, 1.2)),
    fig(20, C.orange, 'smile', { h: 0.7 }), fig(100, C.green, 'smile', { h: 0.7 }), thought(24, 26, 30, circle(24, 26, 7, C.sky, C.ink, 1.2), false), thought(96, 26, 30, rect(89, 20, 14, 12, C.sky, 0, C.ink, 1.2)), ground),
  'exi.fenomen': all(sky(NIGHT), stars(10), path('M4 40 C30 20 50 50 76 30 C92 18 104 26 116 22 L116 44 C100 48 90 40 76 52 C50 70 30 42 4 60 Z', 'rgba(110,230,160,0.55)', null), path('M4 30 C30 12 60 40 116 14', 'none', 'rgba(170,140,240,0.6)', 3),
    path('M4 112 L4 96 C40 90 80 90 116 96 L116 112 Z', '#e8eef5', null), fig(80, C.red, 'shock', { h: 0.4 }), fig(92, C.navy, 'smile', { h: 0.4 })),
  'exi.tinget-i-sig': all(sky('#f6f2ea'), rect(72, 20, 40, 90, '#d7e3ee', 2, '#9fb3c8', 1.4), line('M76 28 L82 22 M76 40 L90 26', C.white, 2), at(92, 66, 1, line('M-10 -10 L10 -10 L10 10 L-10 10 Z', GREY, 1.6, '3 3')), qm(92, 72, 16, GREY),
    eye(22, 60, 1.4), ...[44, 52, 60].map((x) => circle(x, 60, 2, GOLD, null)), cube(58, 86, 0.9, GOLD), ground),
  'exi.idealism': all(sky('#f6f2ea'), fig(30, ROBE2, 'calm'), thought(80, 42, 64, all(sun(96, 30, 4), house(72, 52, 0.6), tree(92, 54, 0.45), glow(80, 42, 26, 'rgba(242,193,78,0.2)')), true), greyed(stone(96, 104, 0.9)), ground),
  'exi.grottliknelse': all(rect(4, 4, 112, 108, '#3b3244', 3, null), path('M4 4 L116 4 L116 30 C80 20 40 24 4 36 Z', '#2b2433', null), rect(60, 34, 52, 48, '#5a4c66', 2, null),
    at(86, 58, 1, circle(-8, -10, 4, '#2b2433', null), path('M-14 8 C-14 -4 -2 -4 -2 8 Z', '#2b2433', null), circle(10, -8, 4, '#2b2433', null), path('M4 8 C4 -2 16 -2 16 8 Z', '#2b2433', null)),
    glow(20, 92, 16, 'rgba(242,140,60,0.5)'), path('M14 104 C14 92 20 86 20 80 C24 88 28 94 26 104 Z', C.orange, C.ink, 1), ...[38, 54, 70].map((x) => bust(x, 98, '#7a6a5a', 1)), line('M28 108 L84 108', '#6a5a4a', 2)),
  'exi.idévärld': all(sky('#eef3fb'), cloud(30, 56, 1.4, C.white), cloud(84, 58, 1.6, C.white), glow(60, 26, 20), circle(48, 24, 9, 'none', GOLD, 2.6), path('M66 32 L74 16 L82 32 Z', 'none', GOLD, 2.6), rays(60, 26, 22, 26, 12, GOLD, 1),
    fig(34, C.orange, 'calm', { h: 0.4 }), reach(34, 0.4, 1, 46, 98), path('M52 100 C46 92 58 86 64 92 C70 100 58 106 52 100 Z', 'none', GREY, 1.6), ground),
  'exi.avbild': all(sky(WARM), fig(36, C.green, 'smile', { hair: '#7a4a2a' }), on(36, 1, rect(-3, -30, 6, 4, C.red, 1, null)), fig(84, C.green, 'smile', { h: 0.56, hair: '#7a4a2a' }), on(84, 0.56, rect(-3, -30, 6, 4, C.red, 1, null)), sparkle(60, 50, 5), sparkle(66, 62, 3), ground),
  'exi.simulering': all(sky('#f6f2ea'), rect(8, 14, 104, 70, '#1f2a4d', 4, C.ink, 2), ...Array.from({ length: 6 }, (_, i) => line(`M${12 + i * 18} 18 L${12 + i * 18} 80`, '#3a5a9a', 0.8)), ...Array.from({ length: 4 }, (_, i) => line(`M12 ${24 + i * 16} L108 ${24 + i * 16}`, '#3a5a9a', 0.8)),
    tree(36, 72, 0.6, '#5ad08a'), house(80, 72, 0.7, '#9fd8f5'), rect(24, 24, 8, 8, '#f2c14e', 0, null), fig(60, C.orange, 'smile', { h: 0.62 }), on(60, 0.62, rect(-10, -59, 20, 8, C.dark, 2, C.ink, 1.2), line('M-10 -55 L-14 -52 M10 -55 L14 -52', C.dark, 1.6)), ground),

  // ── 2255 Livets mening ──
  'exi.meningslöshet': all(rect(4, 4, 112, 108, '#d9dadd', 3, null), greyed(fig(54, C.grey, 'frown', { h: 0.8 }), flower(92, 112, 1.2, C.grey, 10), clock(26, 30, 10)), cloud(54, 18, 0.9, '#7a7a80'), path('M44 30 c4 -4 8 4 12 0 c4 -4 8 4 12 0', 'none', '#7a7a80', 1.4), ground),
  'exi.livsmål': all(sky(DAY), path('M4 112 L60 24 L116 112 Z', '#9fbf8a', C.ink, 1.4), path('M30 112 C50 100 40 86 60 76 C78 66 56 50 62 34', 'none', '#e6d3b3', 4), flag(62, 30, C.red), glow(68, 18, 12), fig(34, C.orange, 'smile', { h: 0.36 })),
  'exi.livsuppgift': all(sky(WARM), old(30, C.green, 'smile'), reach(30, 0.9, 1, 54, 72), book(58, 70, 0.7, C.red), kid(76, C.yellow, 'smile'), kid(98, C.sky, 'laugh'), heart(52, 26, 0.8, C.red), line('M8 18 C20 10 34 10 44 20', GOLD, 1.6, '2 3'), ground),
  'exi.ge-mening-åt': all(rect(4, 4, 56, 108, '#d9dadd', 3, null), rect(60, 4, 56, 108, WARM, 3, null), greyed(tree(30, 108, 0.7), house(30, 70, 0.6)), tree(88, 108, 0.7), sun(98, 20, 5), fig(60, C.orange, 'smile', { h: 0.62 }), reach(60, 0.62, 1, 76, 66), heart(80, 60, 0.7, C.red), rays(80, 60, 8, 12, 8)),
  'exi.ha-något-att-leva-för': all(sky(WARM), sun(98, 22, 7), old(36, C.navy, 'laugh'), reach(36, 0.9, 1, 60, 80), kid(70, C.yellow, 'laugh'), flower(92, 112, 1, C.red), flower(104, 112, 0.8, C.pink), heart(52, 30, 0.8, C.red), ground),
  'exi.det-goda-livet': all(sky(WARM), sun(100, 18, 6), sage(24, 0.9, ROBE), fig(96, ROBE2, 'laugh', { h: 0.9 }), rect(40, 86, 40, 6, '#a8743f', 2, C.ink, 1.2), line('M46 92 L46 112 M74 92 L74 112', '#a8743f', 3),
    at(52, 82, 0.6, circle(0, 0, 4, C.green, C.ink, 1), circle(6, 0, 4, C.red, C.ink, 1)), book(68, 80, 0.5, C.red), heart(60, 40, 0.9, C.red), ground),
  'exi.hängivenhet': all(sky(DAY), fig(36, C.green, 'calm', { h: 0.9 }), reach(36, 0.9, 1, 60, 70), at(64, 72, 1, path('M-8 -6 L8 -6 L6 6 L-6 6 Z', C.denim, C.ink, 1.2), line('M8 -4 L16 2', C.denim, 2)), ...[[80, 80], [84, 86], [88, 82]].map(([x, y]) => drop(x!, y!, 0.6)),
    flower(84, 112, 1.1, C.red), flower(98, 112, 1, C.yellow), flower(108, 112, 0.9, C.pink), heart(36, 12, 0.6, C.red), drop(46, 26, 0.8), ground),
  'exi.känsla-av-sammanhang': all(sky('#f6f2ea'), circle(60, 60, 44, 'none', GOLD, 2.6), fig(60, C.green, 'calm', { h: 0.6 }), at(60, 22, 0.7, circle(0, -2, 6, C.yellow, C.ink, 1.2), rect(-3, 4, 6, 4, C.grey, 1, C.ink, 0.8)),
    at(24, 70, 1, rect(-2, -10, 4, 18, C.brown, 1, C.ink, 1), rect(-7, -14, 14, 6, C.grey, 1, C.ink, 1)), heart(96, 70, 0.9, C.red), ground),

  // ── 2256 Döden och ändligheten ──
  'exi.död': all(sky('#e9e6ef'), grave(54, 112, 1.4), flower(28, 112, 1, C.pink), flower(80, 112, 1, C.yellow), candle(96, 112, 14, false), ground),
  'exi.dödlig': all(sky('#f6f2ea'), ...[[24, C.orange], [60, C.green], [96, C.denim]].map(([x, c]) => all(fig(x as number, c as string, 'calm', { h: 0.7 }), hourglass(x as number, 20, 0.6, 0.45)))),
  'exi.odödlig': all(sky(WARM), glow(44, 60, 36), fig(44, GOLD, 'smile', { bottom: '#b08a2a' }), inf(44, 8, 0.6), hourglass(96, 40, 0.7, 0.6), path('M106 26 C116 40 116 56 106 64', 'none', GOLD, 1.6), arrow(106, 64, 104, 54, GOLD, 1.6), greyed(grave(96, 112, 0.8)), cross(108, 90, 0.7), ground),
  'exi.ändlig': all(sky('#f6f2ea'), road(6, 92, 104), rect(90, 70, 4, 40, C.ink, 0, null), at(92, 66, 1, rect(-10, -8, 20, 10, C.white, 1, C.ink, 1.2), ...[0, 1, 2, 3, 4].map((i) => rect(-10 + i * 4, i % 2 ? -8 : -3, 4, 5, C.ink, 0, null))), fig(54, C.orange, 'calm', { h: 0.62 }), candle(22, 98, 12, true), greyed(inf(96, 28, 0.6, C.grey)), cross(108, 20, 0.6)),
  'exi.ändlighet': all(sky(DUSK), sun(96, 90, 9), path('M4 112 L4 96 L116 96 L116 112 Z', '#6a5a7a', null), old(36, C.navy, 'calm'), reach(36, 0.9, 1, 60, 72), hourglass(66, 66, 0.8, 0.15)),
  'exi.förgänglighet': all(sky('#f6f2ea'), arrow(8, 100, 112, 100, GOLD, 2.4), at(20, 92, 1, line('M0 0 L0 -16', C.green, 1.8), ellipse(0, -20, 3, 5, C.pink, C.ink, 0.8)), flower(48, 92, 1.3, C.pink), flower(78, 92, 1.1, '#d9a0b0', 8), at(104, 92, 1, line('M0 0 Q4 -8 8 -10', '#9a8a5a', 1.8)), ellipse(98, 96, 3, 1.4, '#d9a0b0', null), ellipse(108, 95, 3, 1.4, '#d9a0b0', null), ground),
  'exi.dödsångest': all(sky(NIGHT), stars(6), bed(54, 98, 70), lying(30, 96), circle(31, 82, 1, C.ink, null), circle(29, 82, 1, C.ink, null), drop(40, 74, 0.8), drop(22, 72, 0.7), thought(84, 34, 46, all(hourglass(76, 34, 0.45, 0.1), grave(96, 44, 0.5)), true), line('M18 70 l-3 2 l3 2 M44 70 l3 2 l-3 2', C.white, 1)),
  'exi.livet-efter-döden': all(sky('#e9e6ef'), path('M4 112 L4 96 C40 92 80 92 116 96 L116 112 Z', '#bfdcae', null), grave(30, 104, 1), glow(84, 22, 22, 'rgba(255,242,192,0.7)'), cloud(84, 26, 1.2, C.white),
    ...[[44, 76], [56, 60], [68, 44]].map(([x, y], i) => circle(x!, y!, 2.4 + i * 0.8, '#fff2c0', GOLD, 1)), line('M36 86 C46 72 58 56 74 36', GOLD, 1.4, '2 4')),
  'exi.dödsbädd': all(sky('#f2efe7'), bed(48, 100, 72), lying(22, 98, '#e6e6e6'), fig(96, C.denim, 'frown', { h: 0.9 }), reach(96, 0.9, -1, 66, 88), kid(76, C.yellow, 'frown'), candle(16, 66, 10, true)),
  'exi.efterlämna': all(sky(WARM), outline(24, 0.9), arrow(40, 70, 52, 70, GOLD, 2), house(76, 72, 0.9), kid(66, C.yellow, 'smile'), kid(90, C.sky, 'smile'), flower(106, 112, 1, C.red), tree(100, 112, 0.5), ground),
  'exi.eftervärlden': all(sky('#f6f2ea'), old(18, C.navy, 'smile', { h: 0.86 }), reach(18, 0.86, 1, 34, 72), book(38, 72, 0.6, C.red), fig(58, C.green, 'smile', { h: 0.72 }), kid(84, C.yellow, 'smile'), kid(104, C.orange, 'smile', { h: 0.44 }),
    arrow(46, 30, 110, 30, GOLD, 2.6), ground),

  // ── 2257 Existentialismens teman ──
  'exi.existentialism': all(sky('#eef3fb'), fork(60, 82, 1.1), fig(60, C.dark, 'calm', { h: 0.62, bottom: C.black }), ...[[26, 40, -1], [94, 40, 1]].map(([x, y, d]) => arrow(60 + (d as number) * 14, 56, x as number, y as number, GOLD, 2.2)), house(22, 34, 0.5), tree(98, 34, 0.5), ground),
  'exi.existentialist': all(sky('#f2efe7'), chair(26), fig(36, C.black, 'calm', { bottom: C.black, h: 0.9 }), reach(36, 0.9, 1, 60, 80), book(62, 78, 0.6, C.purple), cafeTable(74), cup(84, 84), thought(84, 30, 46, all(fork(84, 30, 0.35), arrow(80, 24, 72, 18, GOLD, 1.4), arrow(88, 24, 96, 18, GOLD, 1.4)), true), ground),
  'exi.dömd-till-frihet': all(sky('#f6f2ea'), fig(40, C.orange, 'frown'), chain(46, 106, 72, 106), at(84, 100, 1, circle(0, 0, 12, C.white, C.ink, 1.6), ...[0, 60, 120, 180, 240, 300].map((a) => arrow(0, 0, Math.round(Math.cos(a * Math.PI / 180) * 10), Math.round(Math.sin(a * Math.PI / 180) * 10), GOLD, 1.4))),
    ...[[96, 30], [104, 52], [82, 22]].map(([x, y]) => arrow(60, 40, x!, y!, GOLD, 2)), ground),
  'exi.vägval': all(sky(DAY), fork(60, 82, 1.2), fig(60, C.orange, 'calm', { h: 0.5 }), at(26, 46, 0.7, rect(-14, -30, 10, 30, '#9fb3c8', 1, C.ink, 1), rect(0, -40, 12, 40, '#7f93a8', 1, C.ink, 1)), tree(96, 52, 0.55), tree(108, 54, 0.4), ground),
  'exi.autentisk': all(sky('#f6f2ea'), greyed(...[16, 38, 82, 104].map((x) => fig(x, C.grey, 'smile', { h: 0.62 }))), glow(60, 80, 24), fig(60, C.purple, 'laugh', { h: 0.7, hairStyle: 'long' }), on(60, 0.7, heart(0, -24, 0.7, C.red)), sparkle(76, 40, 4), ground),
  'exi.ond-tro': all(sky('#f6f2ea'), rect(70, 24, 34, 88, '#fff7d6', 2, C.ink, 1.6), path('M70 24 L60 30 L60 106 L70 112 Z', '#a8743f', C.ink, 1.4), glow(87, 60, 20), ...[[80, 50], [94, 70]].map(([x, y]) => arrow(87, 90, x!, y!, GOLD, 2)),
    fig(30, C.navy, 'calm'), on(30, 1, rect(-10, -58, 20, 6, C.dark, 2, C.ink, 1)), reach(30, 1, -1, 10, 64), reach(30, 1, 1, 50, 64), ground),
  'exi.skapa-sig-själv': all(sky('#f6f2ea'), line('M74 112 L84 40 L94 112 M84 40 L84 112', C.brown, 2.4), rect(66, 34, 36, 44, C.white, 1, C.ink, 1.4), at(84, 56, 0.9, circle(0, -8, 6, C.skin, C.ink, 1.2), path('M-9 14 C-9 2 9 2 9 14 Z', C.orange, C.ink, 1.2), path('M-6 -10 C-6 -16 6 -16 6 -10 Z', C.hair, null)),
    fig(36, C.orange, 'smile'), reach(36, 1, 1, 66, 60), line('M66 60 L70 52', C.brown, 2), ground),
  'exi.existensen-föregår-essensen': all(sky('#f6f2ea'), greyed(rect(10, 12, 24, 18, '#bfe3f5', 1, C.ink, 1), line('M14 22 L30 22', C.ink, 1.2), arrow(38, 21, 54, 21, C.ink, 1.6), path('M60 24 L84 18 L84 26 L60 26 Z', C.silver, C.ink, 1.2), rect(84, 18, 14, 8, C.brown, 2, C.ink, 1)),
    line('M8 46 L112 46', C.grey2, 1.2, '3 3'), outline(24, 0.62, C.ink), arrow(42, 84, 66, 84, GOLD, 2.6), glow(92, 80, 22), fig(92, C.purple, 'laugh', { h: 0.62 }), on(92, 0.62, heart(0, -24, 0.7, C.red)), book(106, 92, 0.5, C.red), ground),
  'exi.det-absurda': all(sky('#2b2a3a'), stars(10, '#8a8aa0'), fig(36, C.orange, 'shock', { h: 0.8 }), reach(36, 0.8, -1, 18, 46), reach(36, 0.8, 1, 54, 46), bubble(64, 26, 30, all(heart(58, 27, 0.45, C.red), qm(70, 31, 12)), true), line('M86 50 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', '#6a6a80', 1.6, '3 3'), ground),
  'exi.sisyfosarbete': all(sky(DAY), path('M4 112 L96 30 L116 30 L116 112 Z', '#b8a07a', C.ink, 1.4), g('translate(0 -48)', fig(56, C.orange, 'frown', { h: 0.5 }), reach(56, 0.5, 1, 70, 88)), circle(82, 30, 13, STONE, C.ink, 1.6), drop(48, 22, 0.8), path('M100 40 C114 60 104 96 74 104', 'none', C.accent, 2), arrow(80, 102, 64, 106, C.accent, 2.2)),
  'exi.revolt': all(sky(DUSK), cloud(30, 22, 1.2, '#5d5a70'), cloud(88, 18, 1.1, '#5d5a70'), ...[[24, 40], [44, 46], [92, 36]].map(([x, y]) => line(`M${x} ${y} l-4 10`, '#8cc7e8', 1.4)), glow(60, 70, 30), fig(60, C.red, 'angry'), reach(60, 1, 1, 82, 30), fist(82, 26, 1.4), ground),
  'exi.främlingskap': all(sky('#f6f2ea'), greyed(...[[60, 60], [76, 76], [44, 76], [60, 90]].map(([x, y]) => bust(x!, y!, C.grey, 1.4)), ellipse(60, 80, 30, 22, 'none', C.grey, 1.4)), fig(104, C.orange, 'frown', { h: 0.6 }), line('M86 112 L86 60', C.grey2, 1.4, '3 3'), ground),
};
function globe2(x: number, y: number): Svg { return all(circle(x, y, 10, '#bfe3f5', C.ink, 1.4), path(`M${x - 6} ${y - 4} C${x - 2} ${y - 7} ${x + 1} ${y - 2} ${x - 2} ${y + 1} C${x - 5} ${y + 3} ${x - 8} ${y} ${x - 6} ${y - 4} Z M${x + 2} ${y - 1} C${x + 6} ${y - 3} ${x + 8} ${y + 3} ${x + 3} ${y + 6} Z`, C.green, C.ink, 0.8)); }
