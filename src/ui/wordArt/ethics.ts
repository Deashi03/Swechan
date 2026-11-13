/**
 * Historia & humaniora → Filosofi & etik → Etik & moral, 2221–2227 (0.39): right and wrong, duty and
 * responsibility, consequences and utility, virtues and character, moral conflict, justice and equality,
 * and ethical dilemmas. Abstract ideas are symbolic mini-scenes in which the coloured idea dominates and
 * a grey copy stands beside it as contrast. Philosophers are small neutral figures in robes, never
 * portraits. Good is warm (gold, heart, sun), bad is dark (storm, bolt); a green tick and a red cross
 * only support the scene. No words, no letters, no pointing fingers, no religious or national symbols.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, bolt, bubble, cloud, heart, sun, thought } from './people';
import { P as F, type Mood, coin, greyed, drop } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const DAY = '#dff0fa';
const WARM = '#fdf0d5';
const NIGHT = '#2b3a67';
const DUSK = '#4a3b63';
const ROBE = '#b0643a';
const ROBE2 = '#5a7fa8';
const PARCH = '#f3e6c4';
const GREEN = '#2f8a6a';
const GREY = '#8d949c';
const RAIL = '#6d6a66';
const WATER = '#5aa7d6';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const sky = (col: string = DAY, y2 = 112) => rect(4, 4, 112, y2 - 4, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s, hy: ty - 56 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const grey = (x: number, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top: C.grey, mood, grey: true, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** A philosopher: a small neutral figure in a long robe with a sash. */
const sage = (x: number, h = 1, col: string = ROBE, mood: Mood = 'calm') => all(fig(x, col, mood, { h, bottom: col }),
  on(x, h, path('M-13 -40 L13 -40 L17 48 L-17 48 Z', col, C.ink, 1.4), path('M-13 -40 L13 6', 'none', PARCH, 4), line('M-13 -40 L13 6', C.ink, 0.6)));
/** A small bust (head and shoulders) for crowds. */
const bust = (x: number, y: number, top: string, s = 1, mood: 'smile' | 'frown' | 'none' = 'smile', greyOut = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', greyOut ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, greyOut ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', greyOut ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null),
  mood === 'smile' ? line('M-1.8 2.4 Q0 4 1.8 2.4', C.ink, 0.8) : mood === 'frown' ? line('M-1.8 3.6 Q0 2 1.8 3.6', C.ink, 0.8) : '');
/** A child at about half height. */
const kid = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, top, mood, { h: 0.56, ...more });

// ── Things ───────────────────────────────────────────────────────────
const tick = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));
const qm = (x: number, y: number, size = 14, col: string = HL) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">?</text>`;
const excl = (x: number, y: number, size = 14, col: string = C.red) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">!</text>`;
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const storm = (x: number, y: number, s = 1) => all(cloud(x, y, s, '#5d5a70'), bolt(x + 2 * s, y + 14 * s, 0.7 * s));
/** A stone tablet with blank lines (a rule), optional icon on top. */
const tablet = (x: number, y: number, s = 1, col: string = PARCH, icon: Svg = '') => at(x, y, s, path('M-14 16 L-14 -10 C-14 -18 14 -18 14 -10 L14 16 Z', col, C.ink, 1.4),
  line('M-9 -2 L9 -2 M-9 4 L9 4 M-9 10 L9 10', '#9a8f7a', 1.2), icon);
/** A balance; tilt in degrees (positive = right pan down); l, r drawn in the pans. */
const scales = (x: number, y: number, s = 1, tilt = 0, l: Svg = '', r: Svg = '', col: string = GOLD) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -26 L0 22 M-12 22 L12 22', C.ink, 2.4),
  g(`rotate(${tilt} 0 -24)`, line('M-26 -24 L26 -24', C.ink, 2.4), line('M-26 -24 L-32 -8 M-26 -24 L-20 -8 M26 -24 L20 -8 M26 -24 L32 -8', C.ink, 1),
    path('M-34 -8 C-34 -2 -18 -2 -18 -8 Z', col, C.ink, 1.2), path('M18 -8 C18 -2 34 -2 34 -8 Z', col, C.ink, 1.2), g(`translate(-26 -9) rotate(${-tilt})`, l), g(`translate(26 -9) rotate(${-tilt})`, r)), circle(0, -26, 2.4, col, C.ink, 1));
const crushed = (x: number, y: number) => all(line(`M${x - 6} ${y} L${x + 6} ${y - 2}`, C.green, 1.6), ...[[-4, -1], [1, 1], [5, -2]].map(([dx, dy]) => ellipse(x + dx!, y + dy!, 2.6, 1.2, '#b88aa0', C.ink, 0.6)));
const box = (x: number, y: number, w: number, h: number, col: string) => rect(x - w / 2, y - h, w, h, col, 1.5, C.ink, 1.2);
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-3, -18, 6, 18, C.brown, 1, C.ink, 1), circle(0, -28, 13, col, C.ink, 1.2), circle(-8, -22, 8, col, C.ink, 1.2), circle(8, -22, 8, col, C.ink, 1.2));
const apple = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 3.2, C.red, C.ink, 0.8), line('M0 -3 L1 -5', C.brown, 1));
const bag = (x: number, y: number, s = 1, col: string = C.tan) => at(x, y, s, path('M-10 12 L-12 -4 C-6 -8 6 -8 12 -4 L10 12 Z', col, C.ink, 1.3), line('M-6 -6 C-4 -12 4 -12 6 -6', C.ink, 1.2));
const plate = (x: number, y: number, r = 10) => ellipse(x, y, r, r * 0.35, C.white, C.ink, 1.2);
const medal = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 -12 L0 -4 L4 -12', 'none', C.red, 2.4), circle(0, 0, 5, GOLD, C.ink, 1.2), star(0, 0, 2.6, '#fff2c0'));
const mask = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 -10 C-10 -16 10 -16 10 -10 L10 2 C10 12 -10 12 -10 2 Z', C.white, C.ink, 1.3), circle(-4, -5, 1.6, C.ink, null), circle(4, -5, 1.6, C.ink, null), line('M-5 3 Q0 8 5 3', C.ink, 1.4), ellipse(-6, 1, 1.8, 1, '#f08aa0', null), ellipse(6, 1, 1.8, 1, '#f08aa0', null), line('M0 10 L0 22', C.brown, 1.8));
const bed = (x: number, y: number, w = 40, head: Svg = '') => all(rect(x - w / 2, y - 6, w, 8, C.white, 2, C.ink, 1.3), rect(x - w / 2 - 2, y - 16, 4, 22, C.brown, 1, C.ink, 1.1), line(`M${x - w / 2 + 2} ${y + 2} L${x - w / 2 + 2} ${y + 10} M${x + w / 2 - 2} ${y + 2} L${x + w / 2 - 2} ${y + 10}`, C.brown, 2), head);
const tramCar = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -14, 32, 16, C.yellow, 3, C.ink, 1.4), rect(-12, -11, 9, 7, '#bfe3f5', 1, C.ink, 0.9), rect(1, -11, 9, 7, '#bfe3f5', 1, C.ink, 0.9), circle(-9, 3, 3, C.dark, C.ink, 1), circle(9, 3, 3, C.dark, C.ink, 1), line('M0 -14 L-4 -22 L4 -22', C.ink, 1.2));
const door = (x: number, y: number, col: string) => all(rect(x - 12, y - 34, 24, 34, col, 2, C.ink, 1.4), circle(x + 7, y - 16, 1.6, GOLD, C.ink, 0.6));
const coinStack = (x: number, y: number, n: number, r = 5) => all(...Array.from({ length: n }, (_, i) => all(ellipse(x, y - i * 3, r, r * 0.4, GOLD, C.ink, 1), line(`M${x - r} ${y - i * 3} L${x - r} ${y - i * 3 + 1.6} M${x + r} ${y - i * 3} L${x + r} ${y - i * 3 + 1.6}`, C.ink, 1))));
const domino = (x: number, y: number, rot: number, col: string = C.white) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -16, 6, 16, col, 1, C.ink, 1.2), circle(0, -12, 0.9, C.ink, null), circle(0, -5, 0.9, C.ink, null));
const meter = (x: number, y: number, h: number, frac: number, col: string = C.green) => all(rect(x - 6, y - h, 12, h, C.white, 2, C.ink, 1.3), rect(x - 4, y - 2 - (h - 4) * frac, 8, (h - 4) * frac, col, 1, null));
const snow = (x1: number, x2: number, y1: number, y2: number) => all(...Array.from({ length: 16 }, (_, i) => circle(x1 + ((i * 37) % (x2 - x1)), y1 + ((i * 23) % (y2 - y1)), 1.4, C.white, '#9fb3c8', 0.5)));
const shake = (x: number, y: number) => line(`M${x - 3} ${y - 6} l-3 2 l3 2 l-3 2 M${x + 3} ${y - 6} l3 2 l-3 2 l3 2`, C.ink, 1);
const sweat = (x: number, y: number) => drop(x, y, 0.9, '#8cc7e8');
const zig = (x: number, y: number, w: number, col: string = C.red) => line(`M${x} ${y} l${w / 6} -4 l${w / 6} 8 l${w / 6} -8 l${w / 6} 8 l${w / 6} -8 l${w / 6} 4`, col, 1.8);
const stop = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, C.white, C.red, 2), line('M-6 6 L6 -6', C.red, 2));
const fist = (x: number, y: number, s = 1) => at(x, y, s, rect(-5, -4, 10, 8, C.skin, 3, C.ink, 1), line('M-2 -4 L-2 0 M1 -4 L1 0', C.ink, 0.7));
const mic = (x: number, y: number) => all(line(`M${x} ${y} L${x} ${y + 12}`, C.ink, 1.4), ellipse(x, y - 2, 2.4, 3.4, C.dark, C.ink, 0.8));
const lectern = (x: number) => all(path(`M${x - 12} 112 L${x - 9} 82 L${x + 9} 82 L${x + 12} 112 Z`, '#8a5a34', C.ink, 1.4), rect(x - 14, 78, 28, 5, '#a8743f', 1, C.ink, 1.2));
const can = (x: number, y: number) => all(rect(x - 3, y - 7, 6, 8, C.red, 1, C.ink, 0.9), line(`M${x - 3} ${y - 4} L${x + 3} ${y - 4}`, C.white, 1));
const smoke = (x: number, y: number) => all(cloud(x, y, 0.5, '#7a7a80'), cloud(x + 10, y - 10, 0.6, '#8a8a90'), cloud(x + 4, y - 22, 0.7, '#9a9aa0'));
const shieldL = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => at(x, y, s, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const cooler = (x: number, y: number) => all(rect(x - 10, y - 12, 20, 14, C.white, 2, C.ink, 1.3), rect(x - 11, y - 15, 22, 4, C.sky, 1, C.ink, 1.1), heart(x, y - 5, 0.4, C.red));
const ring = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, 'none', C.red, 5), circle(0, 0, 8, 'none', C.white, 5), ...[0, 90, 180, 270].map((a) => path(`M${f1(Math.cos(a * Math.PI / 180) * 8)} ${f1(Math.sin(a * Math.PI / 180) * 8)} m-2 -2 l4 4`, 'none', C.red, 5)));
const veil = (x: number, y: number, w: number, h: number) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} C${x + w * 0.75} ${y + h - 4} ${x + w * 0.5} ${y + h + 4} ${x + w * 0.25} ${y + h - 2} C${x + w * 0.1} ${y + h + 2} ${x} ${y + h} ${x} ${y + h} Z`, 'rgba(200,190,230,0.82)', '#8a7fb0', 1.2),
  ...Array.from({ length: Math.floor(w / 8) }, (_, i) => line(`M${x + 4 + i * 8} ${y + 2} L${x + 4 + i * 8} ${y + h - 4}`, 'rgba(138,127,176,0.5)', 0.8)), line(`M${x - 2} ${y} L${x + w + 2} ${y}`, C.brown, 2.4));
const hut = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -12, 20, 12, '#c9a77a', 1, C.ink, 1.1), path('M-13 -12 L0 -22 L13 -12 Z', '#9a8a6a', C.ink, 1.1));
const villa = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -20, 32, 20, '#f2ece0', 1, C.ink, 1.2), path('M-19 -20 L0 -32 L19 -20 Z', '#9a4a3a', C.ink, 1.2), rect(-11, -15, 6, 6, '#bfe3f5', 1, C.ink, 0.8), rect(5, -15, 6, 6, '#bfe3f5', 1, C.ink, 0.8), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.8), coin(16, -28, 4));

export const ETHICS_MOTIFS: Record<string, Svg> = {
  // ── 2221 Rätt och fel ──
  'etik.gott-och-ont': all(rect(4, 4, 56, 108, WARM, 3, null), rect(60, 4, 56, 108, '#3d3a52', 3, null), sun(30, 22, 8), storm(90, 20, 1),
    fig(30, C.green, 'smile', { h: 0.62 }), reach(30, 0.62, 1, 44, 84), heart(48, 80, 0.7, C.red),
    fig(90, '#5d5a70', 'angry', { h: 0.62 }), reach(90, 0.62, -1, 76, 84), crushed(72, 110), line('M60 6 L60 110', C.white, 2, '3 3'), line('M4 112 L116 112', C.grey2, 2)),
  'etik.ondska': all(sky(DUSK, 112), storm(30, 18, 1), storm(92, 22, 0.9),
    fig(48, '#3a3348', 'angry', { h: 0.92, bottom: '#2b2a33' }), reach(48, 0.92, 1, 72, 70),
    kid(94, C.sky, 'frown'), drop(90, 82, 0.8, '#8cc7e8'), sandcastle(78, 112), line('M64 76 L82 98', '#e45b5b', 2.2), ground),
  'etik.godhet': all(sky(WARM, 112), glow(44, 48, 30), fig(40, C.orange, 'smile', { hairStyle: 'long' }), reach(40, 1, 1, 70, 74),
    path('M66 66 L86 66 L84 84 L68 84 Z', C.red, C.ink, 1.3), heart(44, 18, 0.9, C.red), rays(44, 18, 12, 17, 10, GOLD, 1.2),
    grey(92, 'frown', { h: 0.9 }), snowFlakes(100), ground),
  'etik.omoralisk': all(sky(DAY, 112), rect(30, 70, 20, 30, '#e6d3b3', 2, C.ink, 1.4), rect(36, 70, 8, 3, C.dark, 0.5, null), heart(40, 86, 0.6, C.red), line('M40 100 L40 112', C.brown, 3),
    fig(62, '#4a3b63', 'smile', { h: 0.9 }), reach(62, 0.9, -1, 44, 72), coin(44, 66, 4), brokenMoral(30, 34),
    ...[[90, 'shock'], [106, 'angry']].map(([x, m]) => all(fig(+x!, C.grey, m as Mood, { h: 0.72, grey: true }))), bubble(98, 44, 26, cross(98, 44, 0.8), true), ground),
  'etik.moralfilosofi': all(sky('#f6f2ea', 112), sage(34, 1, ROBE), reach(34, 1, 1, 50, 72), at(56, 72, 1, path('M0 6 C-8 2 -14 2 -18 6 L-18 -8 C-14 -12 -8 -12 0 -8 Z M0 6 C8 2 14 2 18 6 L18 -8 C14 -12 8 -12 0 -8 Z', '#fbf5e4', C.ink, 1.2)),
    thought(84, 26, 56, all(heart(70, 26, 0.6, C.red), line('M84 18 L84 34', C.grey, 1.4), bolt(98, 26, 0.6))),
    ...[[20, 20], [12, 44]].map(([x, y]) => qm(x!, y!, 12, HL)), ground),
  'etik.orätt': all(sky(DAY, 112), fig(30, '#4a3b63', 'laugh', { h: 0.96 }), reach(30, 0.96, 1, 46, 72), at(48, 70, 1, circle(0, 0, 7, C.red, C.ink, 1.2), line('M-7 0 L7 0 M0 -7 L0 7', C.white, 1)),
    kid(84, C.yellow, 'frown'), reach(84, 0.56, -1, 66, 84), drop(80, 74, 0.8, '#8cc7e8'), arrow(52, 86, 68, 86, C.red, 2.2),
    scales(90, 34, 0.55, -20, '', '', C.grey2), zig(70, 104, 20), ground),
  'etik.fördöma': all(sky('#f3ece0', 112), lectern(30), fig(30, C.navy, 'angry', { h: 1 }), reach(30, 1, 1, 50, 50), palmOut(50, 46), mic(22, 70),
    bubble(86, 30, 50, all(fist(80, 30, 1.1), bolt(92, 28, 0.55), stop(86, 30, 1.6)), true),
    ...[[64, 98], [80, 102], [96, 98], [110, 102]].map(([x, y]) => bust(x!, y!, C.grey, 0.95, 'none', true))),
  'etik.anständig': all(sky(DAY, 112), rect(4, 30, 30, 82, '#e6d3b3', 2, C.ink, 1.4), rect(26, 40, 18, 72, '#a8743f', 1, C.ink, 1.4), circle(41, 76, 1.8, GOLD, C.ink, 0.6),
    fig(58, C.green, 'smile', { h: 0.94 }), reach(58, 0.94, -1, 42, 74),
    fig(92, '#b07a2a', 'smile', { h: 0.84, hair: '#e6e6e6' }), line('M104 72 L108 112', C.brown, 2.4), reach(92, 0.84, 1, 104, 74), tick(70, 18, 1.2), ground),
  'etik.ansvarslös': all(sky('#f6f2ea', 112), rect(68, 74, 40, 38, C.white, 2, C.ink, 1.4), rect(72, 68, 20, 6, C.dark, 1, C.ink, 1.2),
    path('M74 68 C74 60 90 60 90 68 Z', '#9aa3ad', C.ink, 1.2), smoke(82, 56), path('M78 70 C80 64 84 66 86 70', 'none', C.orange, 2), excl(102, 44, 18),
    fig(32, C.orange, 'laugh', { h: 0.9 }), reach(32, 0.9, 1, 44, 66), at(46, 64, 1, rect(-4, -7, 8, 14, C.dark, 2, C.ink, 1), rect(-3, -5, 6, 9, '#bfe3f5', 1, null)), note(16, 40), note(20, 28), ground),
  'etik.plikttrogen': all(sky('#c9d6e3', 112), snow(6, 114, 8, 100),
    fig(46, C.navy, 'smile', { h: 0.94 }), on(46, 0.94, rect(-10, -66, 20, 6, C.navy, 2, C.ink, 1.2)), reach(46, 0.94, 1, 64, 76), at(68, 82, 1, path('M-8 -8 L8 -8 L10 10 L-10 10 Z', '#b07a2a', C.ink, 1.2)), envelopeS(74, 66),
    greyed(rect(88, 50, 26, 30, '#e6d3b3', 2, C.ink, 1.2), rect(92, 56, 18, 14, '#fde2a0', 1, C.ink, 1), bust(101, 68, C.grey, 0.7)),
    tick(20, 20, 1.1), path('M6 112 C30 106 80 108 114 104 L114 112 Z', C.white, '#c9d6e3', 1)),
  'etik.pliktetik': all(sky('#f6f2ea', 112), sage(22, 0.82, ROBE2), tablet(60, 34, 1.3, PARCH, excl(0, -6, 14, C.red)), arrow(60, 58, 60, 70, GOLD, 2.4),
    fig(60, C.green, 'smile', { h: 0.42 }), reach(60, 0.42, 1, 72, 98), rect(71, 94, 8, 5, C.dark, 1, C.ink, 0.8),
    greyed(at(100, 70, 1, circle(0, -10, 8, C.white, C.ink, 1), line('M-3 -9 Q0 -6 3 -9', C.ink, 1), circle(0, 10, 8, C.white, C.ink, 1), line('M-3 13 Q0 10 3 13', C.ink, 1))), cross(100, 60, 1.6), ground),
  'etik.maxim': all(sky(WARM, 112), fig(36, C.denim, 'smile', { h: 0.9 }), reach(36, 0.9, 1, 36, 64), palmOut(36, 60),
    thought(80, 34, 56, all(rect(62, 24, 36, 22, PARCH, 2, C.ink, 1.3), ellipse(74, 35, 6, 4, '#c84a4a', C.ink, 1), line('M70 35 L78 35', C.white, 0.8), tick(89, 35, 0.6))),
    at(92, 98, 1, rect(-12, -12, 24, 20, '#7a5aa8', 2, C.ink, 1.3), line('M-8 -12 L-8 8', 'rgba(255,255,255,0.4)', 1.6), heart(2, -2, 0.4, C.white)), ground),
  'etik.kategoriskt-imperativ': all(sky('#eef4fa', 112), fig(22, '#c96b3c', 'smile', { h: 0.62 }), reach(22, 0.62, 1, 34, 50), at(38, 46, 1, rect(-8, -6, 16, 12, PARCH, 1, C.ink, 1), excl(0, 4, 10, C.red)),
    arrow(46, 50, 58, 50, HL, 2.4), globeMini(84, 46), ...[[64, 26], [104, 26], [62, 66], [106, 66], [84, 20], [84, 74]].map(([x, y]) => at(x!, y!, 1, rect(-5, -4, 10, 8, PARCH, 1, C.ink, 0.8), excl(0, 3, 7, C.red))),
    num(84, 102, '=', 12, C.ink), tick(100, 98, 1.1), ground),
  'etik.självändamål': all(sky(WARM, 112), glow(40, 66, 30), fig(40, C.orange, 'laugh', { h: 0.86, hairStyle: 'long' }), reach(40, 0.86, 1, 58, 60), reach(40, 0.86, -1, 22, 60),
    ...[[62, 46], [18, 44], [30, 26], [54, 28]].map(([x, y]) => sparkle(x!, y!, 3, GOLD)), loop(40, 64, 34),
    greyed(coin(84, 30, 6), arrow(92, 30, 102, 30, GREY, 2), bag(110, 32, 0.6, C.grey2)), cross(96, 56, 0.8), tick(40, 14, 1), ground),

  // ── 2223 Konsekvenser och nytta ──
  'etik.nytta': all(sky(DAY, 112), tree(84, 112, 1.6), ...[[74, 56], [92, 52], [84, 66], [100, 64]].map(([x, y]) => apple(x!, y!, 1.3)),
    line('M58 112 L74 58 M66 112 L82 58', C.brown, 2.2), ...[100, 90, 80, 70].map((y) => line(`M${f1(58 + (112 - y) * 0.3)} ${y} L${f1(66 + (112 - y) * 0.3)} ${y}`, C.brown, 1.8)),
    g('translate(10 -34)', fig(62, C.green, 'laugh', { h: 0.5 })), reach(72, 0.5, 1, 86, 48), bag(30, 104, 0.9), apple(26, 92), apple(32, 94), num(48, 30, '+', 22, GREEN),
    greyed(fig(14, C.grey, 'frown', { h: 0.5 })), ground),
  'etik.konsekvensetik': all(sky('#f6f2ea', 112), sage(16, 0.6, ROBE2), ...[30, 40, 50, 60].map((x, i) => domino(x, 100, 40 - i * 10)), ...[70, 80].map((x) => domino(x, 100, 0)),
    arrow(86, 92, 94, 80, GOLD, 2.2), glow(102, 62, 18), ...[[96, 58], [108, 58], [102, 70]].map(([x, y]) => bust(x!, y!, ['#c96b3c', GREEN, C.denim][(x! + y!) % 3]!, 0.7)), sun(102, 30, 7), ground),
  'etik.utilitarism': all(sky('#eef4fa', 112), sage(16, 0.62, ROBE2),
    ...[34, 52, 70].map((x, i) => all(bust(x, 40, ['#c96b3c', GREEN, C.denim][i]!, 0.8), num(x + 9, 44, '+', 10, GREEN))), bust(88, 40, '#7a5aa8', 0.8), num(98, 44, '+', 10, GREEN),
    bust(40, 72, C.grey, 0.8, 'frown', true), num(50, 76, '−', 12, C.red), line('M30 88 L110 88', C.ink, 2), num(66, 104, '=', 14, C.ink), sun(92, 100, 7), num(108, 104, '+', 14, GREEN)),
  'etik.välbefinnande': all(sky('#e8f6ea', 112), sun(98, 20, 7), tree(18, 104, 0.9), fig(60, C.mint, 'calm', { h: 0.9, hairStyle: 'long' }), reach(60, 0.9, -1, 42, 66), reach(60, 0.9, 1, 78, 66),
    heart(60, 58, 0.5, C.red), glow(60, 62, 26, 'rgba(127,191,106,0.25)'), ...[[30, 40], [90, 50], [80, 34]].map(([x, y]) => sparkle(x!, y!, 3, GOLD)), path('M4 104 C40 100 80 100 116 104 L116 112 L4 112 Z', '#9fd18a', null)),
  'etik.njutning': all(sky('#fde2c2', 112), fig(54, C.pink, 'calm', { h: 0.96, hairStyle: 'long' }), reach(54, 0.96, 1, 72, 52),
    at(74, 44, 1, path('M-5 4 L0 18 L5 4 Z', '#d4a373', C.ink, 1), circle(0, 0, 6, '#fff2c0', C.ink, 1), circle(-3, -5, 4.5, C.pink, C.ink, 1)),
    ...[[30, 30], [86, 22], [92, 40], [34, 50]].map(([x, y]) => sparkle(x!, y!, 3.4, GOLD)), heart(28, 70, 0.6, C.red), ground),
  'etik.största-möjliga-lycka': all(sky(WARM, 112), sun(60, 20, 10), rays(60, 20, 13, 18, 12, GOLD, 1.4), meter(108, 104, 64, 1, GOLD), arrow(108, 30, 108, 18, GOLD, 2),
    ...[[18, 60], [36, 56], [54, 60], [72, 56], [90, 60], [26, 80], [44, 76], [62, 80], [80, 76], [18, 100], [36, 98], [54, 100], [72, 98], [90, 100]].map(([x, y], i) => bust(x!, y!, ['#c96b3c', GREEN, C.denim, '#7a5aa8', '#d64545', '#b07a2a'][i % 6]!, 0.9))),
  'etik.maximera': all(sky('#eef4fa', 112), line('M14 104 L110 104 M14 104 L14 14', C.ink, 1.8), ...[[28, 20], [46, 36], [64, 54], [82, 72]].map(([x, h]) => rect(x! - 7, 104 - h!, 14, h!, C.grey2, 1, C.ink, 1)),
    rect(93, 18, 14, 86, GREEN, 1, C.ink, 1.4), arrow(100, 40, 100, 22, C.white, 2), line('M14 18 L110 18', HL, 1.6, '4 3'), star(100, 12, 5, GOLD)),
  'etik.ändamålet-helgar-medlen': all(sky(DAY, 112), at(84, 40, 1, glow(0, 0, 18), path('M-8 -10 L8 -10 L6 4 C4 8 -4 8 -6 4 Z', GOLD, C.ink, 1.3), rect(-2, 6, 4, 6, GOLD, 0.5, C.ink, 1), rect(-7, 12, 14, 4, '#a8743f', 1, C.ink, 1)),
    greyed(at(54, 112, 1, line('M-18 -10 L-20 0 M-10 -10 L-10 0 M12 -10 L12 0 M18 -10 L20 0', C.grey, 3), path('M-22 -6 C-22 -20 18 -20 20 -8 L-22 -6 Z', C.grey, C.ink, 1.2), circle(26, -10, 6, C.grey2, C.ink, 1.2))), drop(80, 98, 0.8, '#8cc7e8'),
    g('translate(0 -16)', fig(52, '#4a3b63', 'laugh', { h: 0.82 })), reach(52, 0.82, 1, 74, 40), arrow(20, 40, 40, 40, GOLD, 2), cross(18, 90, 0.9), ground),

  // ── 2224 Dygder och karaktär ──
  'etik.dygd': all(sky(WARM, 112), glow(42, 60, 34), fig(42, C.green, 'smile'), on(42, 1, circle(0, -22, 10, '#fff2c0', GOLD, 1.6), star(0, -22, 7, GOLD)),
    loopIcons(42, 58, 34), greyed(fig(98, C.grey, 'smile', { h: 0.84 }), on(98, 0.84, circle(0, -22, 10, 'none', C.ink, 1.6))), ground),
  'etik.dygdetik': all(sky('#f6f2ea', 112), rect(52, 10, 62, 62, '#2f5a46', 2, '#7a4a20', 2.4), at(83, 44, 0.9, fig(0, C.white, 'smile', { h: 0.6 })),
    ...[[64, 22], [102, 22], [64, 60], [102, 60]].map(([x, y], i) => [heart(x!, y!, 0.45, C.pink), shieldL(x!, y!, 0.4, C.sky), star(x!, y!, 4.4, C.yellow), circle(x!, y!, 4, 'none', C.white, 1.4)][i]!),
    sage(28, 0.94, ROBE2), reach(28, 0.94, 1, 50, 50), palmOut(52, 46), bust(70, 96, C.denim, 1.1), bust(94, 98, '#c96b3c', 1.1), ground),
  'etik.måttlighet': all(sky('#f6f2ea', 112), rect(8, 86, 104, 6, C.tan, 2, C.ink, 1.4), line('M14 92 L14 112 M106 92 L106 112', C.brown, 3),
    fig(32, C.green, 'smile', { h: 0.62 }), plate(32, 84, 12), apple(28, 81, 1), circle(36, 81, 3, '#9fd18a', C.ink, 0.8), tick(32, 22, 1),
    greyed(fig(86, C.grey, 'smile', { h: 0.62, belly: 1 }), plate(86, 84, 16), ...Array.from({ length: 7 }, (_, i) => circle(80 + (i % 3) * 6, 80 - Math.floor(i / 3) * 6, 3.4, C.grey2, C.ink, 0.8))), cross(86, 22, 0.9)),
  'etik.klokhet': all(sky(DAY, 112), path('M4 84 L116 84 L116 112 L4 112 Z', '#9fd18a', null), path('M4 90 C30 86 40 96 60 92 L60 100 C40 104 30 94 4 98 Z', WATER, null),
    path('M60 112 L60 100 L28 92 M60 100 L94 92', 'none', '#e6d3b3', 5), line('M16 88 L28 92 M30 90 L22 96', C.brown, 2.4), cross(18, 74, 0.9), line('M86 88 L104 88 M86 92 L104 92', C.brown, 2.4), tick(96, 74, 0.9),
    fig(60, ROBE, 'calm', { h: 0.58 }), g('translate(0 -2)', thought(60, 22, 40, all(cross(50, 22, 0.6), arrow(56, 22, 64, 22, HL, 1.6), tick(70, 22, 0.6)))), arrow(66, 64, 80, 70, GOLD, 2)),
  'etik.rättrådig': all(sky('#eef0f4', 112), fig(42, C.navy, 'calm', { h: 1 }), reach(42, 1, -1, 22, 54), scales(22, 60, 0.45, 0), reach(42, 1, 1, 60, 60), palmOut(62, 56),
    greyed(fig(94, C.grey, 'smile', { h: 0.9 }), reach(94, 0.9, -1, 76, 70), bag(72, 74, 0.8, C.grey2)), coin(72, 62, 3.5), cross(72, 40, 0.9), ground),
  'etik.generositet': all(sky(WARM, 112), fig(36, C.orange, 'smile', { hairStyle: 'long' }), bag(22, 98, 1), ...[[18, 88], [24, 86], [28, 90]].map(([x, y]) => apple(x!, y!)),
    reach(36, 1, 1, 56, 74), apple(58, 72, 1.2), kid(66, C.sky, 'smile'), kid(82, GREEN, 'smile'), kid(98, '#7a5aa8', 'smile'), apple(72, 92), apple(88, 92), apple(104, 92),
    greyed(at(104, 30, 0.5, fig(0, C.grey, 'frown'))), heart(54, 26, 0.6, C.red), ground),
  'etik.feghet': all(sky(DAY, 112), tree(30, 112, 1.4), fig(34, '#d4c06a', 'shock', { h: 0.86 }), g('translate(0 0)', path('M14 112 L14 60 C14 50 40 46 46 60 L46 112 Z', C.green, C.ink, 1.2)), on(34, 0.86, circle(0, -56, 10, C.skin, C.ink, 2), circle(-3.4, -56, 1.8, C.white, C.ink, 0.9), circle(3.4, -56, 1.8, C.white, C.ink, 0.9)), shake(34, 32), sweat(46, 34),
    kid(92, C.sky, 'frown'), bubble(96, 54, 22, excl(96, 59, 14), false), fig(70, '#4a3b63', 'angry', { h: 0.82 }), reach(70, 0.82, 1, 86, 74), ground),
  'etik.den-gyllene-medelvägen': all(sky('#f6f2ea', 112), path('M4 80 L24 80 L24 112 L4 112 Z', '#c9b98a', C.ink, 1.2), path('M96 80 L116 80 L116 112 L96 112 Z', '#c9b98a', C.ink, 1.2),
    rect(4, 74, 112, 8, C.grey2, 2, C.ink, 1.2), rect(46, 74, 28, 8, GOLD, 2, C.ink, 1.2), glow(60, 60, 22),
    g('translate(0 -38)', fig(60, C.green, 'smile', { h: 0.6 })), cross(14, 56, 0.9), cross(106, 56, 0.9), shake(14, 72), bolt(106, 34, 0.6), tick(60, 14, 1.1), arrow(30, 96, 44, 96, GOLD, 1.8), arrow(90, 96, 76, 96, GOLD, 1.8)),

  // ── 2225 Moralisk konflikt ──
  'etik.värdekonflikt': all(sky('#f6f2ea', 112), at(30, 40, 1.4, glow(0, 0, 14, 'rgba(90,167,214,0.25)'), path('M-10 0 C-6 -8 -2 -8 0 -2 C2 -8 6 -8 10 0 C6 -4 2 -2 0 2 C-2 -2 -6 -4 -10 0 Z', C.sky, C.ink, 1.2)),
    at(90, 44, 1.3, rect(-12, -6, 24, 18, '#f2ece0', 1, C.ink, 1.2), path('M-15 -6 L0 -18 L15 -6 Z', '#9a4a3a', C.ink, 1.2), path('M-4 4 L-4 0 C-4 -5 4 -5 4 0 L4 4', 'none', C.ink, 1.4), rect(-6, 3, 12, 8, GOLD, 1, C.ink, 1)),
    arrow(44, 42, 54, 42, C.red, 2.4), arrow(76, 42, 66, 42, C.red, 2.4), at(60, 42, 1, path('M0 -10 L3 -3 L10 -3 L4 2 L7 10 L0 5 L-7 10 L-4 2 L-10 -3 L-3 -3 Z', C.yellow, C.red, 1.4)),
    fig(60, '#d4c06a', 'frown', { h: 0.5 }), qm(76, 74, 14, HL), ground),
  'etik.lojalitetskonflikt': all(sky('#eef4fa', 112), fig(60, '#d4c06a', 'frown', { h: 0.8 }), fig(22, C.red, 'angry', { h: 0.92 }), fig(98, C.denim, 'angry', { h: 0.92, hairStyle: 'long' }),
    reach(22, 0.92, 1, 46, 70), reach(98, 0.92, -1, 74, 70), heart(40, 30, 0.5, C.red), heart(80, 30, 0.5, C.red), bolt(60, 18, 0.7), ground),
  'etik.samvetskval': all(sky(NIGHT, 112), ...[[14, 14], [30, 22], [100, 12], [110, 30]].map(([x, y]) => sparkle(x!, y!, 2, '#f6e8a8')), path('M96 40 A10 10 0 1 0 96 60 A7 10 0 1 1 96 40 Z', '#f6e08a', C.ink, 0.8),
    bed(56, 96, 80, ''), path('M24 90 C40 82 80 82 94 90 L94 94 L24 94 Z', C.lilac, C.ink, 1.2), circle(28, 84, 7, C.skin, C.ink, 1.2), circle(26, 84, 1.6, C.white, C.ink, 0.6), circle(31, 84, 1.6, C.white, C.ink, 0.6), line('M25 88 Q28 86.6 31 88', C.ink, 0.9),
    thought(46, 44, 46, all(path('M36 50 L40 38 L46 38 L50 50 Z', '#7ab0d0', C.ink, 1), line('M41 42 L44 46 L42 48', C.ink, 1), storm(56, 36, 0.4)), false), shake(28, 72)),
  'etik.ge-vika': all(sky(DAY, 112), line('M60 8 L60 108', C.grey2, 1.6, '3 3'),
    fig(32, C.denim, 'angry', { h: 0.72 }), reach(32, 0.72, 1, 44, 66), palmOut(46, 62), arrow(58, 64, 48, 64, C.red, 3.4), num(30, 26, '1', 12, GREY),
    fig(84, C.denim, 'frown', { h: 0.72 }), reach(84, 0.72, -1, 72, 80), reach(84, 0.72, 1, 98, 80), arrow(64, 46, 112, 46, C.red, 3.4), g('translate(2 0)', line('M76 30 L74 26 M92 30 L94 26', C.ink, 1)), num(104, 26, '2', 12, GREY), ground),
  'etik.dubbelmoral': all(sky(DAY, 112), rect(96, 84, 14, 28, '#5a8a5a', 2, C.ink, 1.2), fig(54, C.navy, 'angry'), reach(54, 1, -1, 32, 56), palmOut(30, 52),
    kid(18, C.yellow, 'frown'), can(28, 110), cross(14, 30, 0.9), reach(54, 1, 1, 74, 84), can(80, 92), arrow(78, 98, 82, 106, C.red, 1.6), can(84, 110), qm(96, 30, 22, C.red), ground),
  'etik.hyckleri': all(sky('#f6f2ea', 112), fig(56, '#4a3b63', 'angry', { h: 1 }), reach(56, 1, 1, 64, 54), mask(58, 46, 1.25),
    greyed(fig(98, C.grey, 'smile', { h: 0.8 }), fig(18, C.grey, 'smile', { h: 0.8 })), heart(30, 28, 0.6, C.red), on(56, 1, path('M-13 -66 L-7 -72 M13 -66 L7 -72', 'none', C.red, 1.4)), ground),
  'etik.rättvisa': all(sky(WARM, 112), glow(60, 42, 34), rays(60, 42, 34, 40, 16, GOLD, 1.2), scales(60, 70, 1.6, 0, '', ''),
    at(60, 108, 1, rect(-14, -6, 16, 8, '#8a5a34', 2, C.ink, 1.2), rect(2, -4, 14, 4, '#a8743f', 1, C.ink, 1)),
    fig(16, C.denim, 'calm', { h: 0.5 }), fig(104, '#c96b3c', 'calm', { h: 0.5, hairStyle: 'long' }), ground),
  'etik.orättvisa': all(sky('#f3ece0', 112), scales(60, 46, 1.2, 18, '', all(coinStack(0, -2, 4, 4))), fig(28, '#4a3b63', 'laugh', { h: 0.72 }), coinStack(16, 110, 6, 5), coinStack(42, 110, 5, 5),
    fig(92, C.sky, 'frown', { h: 0.72 }), reach(92, 0.72, -1, 80, 90), plate(80, 92, 8), zig(70, 104, 18), cross(104, 24, 0.9)),
  'etik.ojämlikhet': all(sky('#eef4fa', 112), box(30, 112, 26, 64, '#c9a24a'), box(60, 112, 26, 22, '#c9a24a'), box(90, 112, 26, 6, '#c9a24a'),
    g('translate(0 -64)', fig(30, '#4a3b63', 'laugh', { h: 0.42 })), g('translate(0 -22)', fig(60, C.green, 'smile', { h: 0.42 })), g('translate(0 -6)', fig(90, C.sky, 'frown', { h: 0.42 })),
    greyed(at(100, 20, 0.35, box(-20, 0, 18, 30, C.grey2), box(0, 0, 18, 30, C.grey2), box(20, 0, 18, 30, C.grey2))), zig(14, 30, 30, HL), ground),
  'etik.förtjäna': all(sky(WARM, 112), path('M4 100 L56 100 L56 112 L4 112 Z', '#8a5a34', null), ...[12, 24, 36, 48].map((x) => all(line(`M${x} 100 L${x} 92`, C.green, 1.6), circle(x, 90, 3, C.green, C.ink, 0.8))),
    fig(70, C.orange, 'laugh', { h: 0.9 }), sweat(80, 36), reach(70, 0.9, -1, 52, 82), line('M52 82 L44 106 M40 106 L48 106', C.brown, 2), arrow(86, 56, 96, 46, GOLD, 2), medal(104, 40, 1.4), rays(104, 40, 9, 13, 10, GOLD, 1.2), ground),
  'etik.okunnighetens-slöja': all(sky('#f6f2ea', 112), villa(92, 50, 0.9), hut(92, 96, 1), fig(28, '#7a5aa8', 'calm', { h: 0.84 }), veil(8, 20, 42, 92),
    arrow(52, 64, 70, 46, HL, 1.8), arrow(52, 74, 70, 90, HL, 1.8), qm(62, 70, 16, HL), ground),
  'etik.lika-möjligheter': all(sky('#e8f6ea', 112), cloud(60, 18, 1.6, C.white), star(60, 16, 6, GOLD),
    ...[[30, C.red], [60, C.denim], [90, GREEN]].map(([x, c]) => all(ladder(+x!, 112, 70), g('translate(0 0)', kid(+x! - 12, c as string, 'smile', { h: 0.42 })))), tick(108, 40, 0.9),
    greyed(at(108, 96, 0.3, ladder(-14, 0, 30), ladder(0, 0, 60), ladder(14, 0, 90))), ground),

  // ── 2227 Etiska dilemman ──
  'etik.rädda': all(sky(DAY, 64), path('M4 64 L116 64 L116 112 L4 112 Z', WATER, null), path('M4 70 C20 66 30 74 46 70 C62 66 72 74 88 70 C100 67 110 72 116 70', 'none', C.white, 1.4),
    path('M70 64 L116 64 L116 112 L96 112 Z', '#e6d3b3', C.ink, 1.2), fig(96, C.red, 'smile', { h: 0.72 }), reach(96, 0.72, -1, 64, 70), line('M64 70 L44 82', C.ink, 1),
    ring(40, 84, 1), circle(32, 82, 6, C.skin, C.ink, 1.2), path('M27 78 C27 74 37 74 37 78', 'none', C.hair, 2), line('M28 86 L22 80 M36 86 L40 78', C.skin, 3), drop(20, 74, 0.8, C.white)),
  'etik.spårvagnsproblemet': all(sky('#eef4fa', 112), line('M4 92 L50 92 C70 92 80 76 116 70 M50 92 L116 96', RAIL, 3), line('M4 98 L50 98 C70 98 82 82 116 76 M50 98 L116 102', RAIL, 3), tramCar(26, 90, 0.9),
    ...[86, 94, 102, 110].map((x) => bust(x, 66, C.orange, 0.62)), bust(106, 88, C.denim, 0.7), bust(94, 58, C.orange, 0.62),
    rect(44, 60, 8, 12, C.dark, 1, C.ink, 1), circle(48, 64, 2.4, C.red, C.ink, 0.6), fig(60, C.green, 'shock', { h: 0.42 }), reach(60, 0.42, -1, 50, 66), qm(60, 30, 18, HL)),
  'etik.organdonation': all(sky('#eef6f6', 112), bed(26, 92, 40, ''), path('M8 86 L44 86 L44 90 L8 90 Z', '#cfe4f0', null), greyed(circle(12, 82, 6, C.grey2, C.ink, 1)), at(18, 50, 1, rect(-8, -6, 16, 12, C.white, 2, C.ink, 1), heart(0, 0, 0.35, C.red)),
    bed(94, 92, 40, ''), path('M76 86 L112 86 L112 90 L76 90 Z', '#f6d6d6', null), circle(80, 82, 6, C.skin, C.ink, 1.2), line('M77 84 Q80 86 83 84', C.ink, 0.9),
    fig(60, C.mint, 'smile', { h: 0.62 }), reach(60, 0.62, 1, 70, 82), cooler(72, 86), arrow(40, 40, 84, 40, C.red, 2.2), heart(62, 34, 0.5, C.red)),
  'etik.det-minst-onda': all(sky('#f3ece0', 112), door(36, 104, '#7a6a8a'), storm(36, 50, 1.1), bolt(28, 64, 0.5), door(86, 104, '#9a8a9a'), cloud(86, 54, 0.6, '#8a8a96'), drop(84, 62, 0.6),
    fig(60, C.green, 'frown', { h: 0.5 }), arrow(66, 92, 74, 92, HL, 2), tick(104, 28, 0.9), cross(18, 28, 0.9), line('M4 104 L116 104', C.grey2, 2)),
};

function sandcastle(x: number, y: number): Svg { return all(path(`M${x - 10} ${y} L${x - 8} ${y - 6} L${x - 12} ${y - 9} L${x - 2} ${y - 4} L${x + 4} ${y - 10} L${x + 6} ${y - 2} L${x + 12} ${y} Z`, '#e6c98a', C.ink, 1), sparkle(x + 10, y - 12, 2, C.red)); }
function snowFlakes(x: number): Svg { return all(...[[x - 6, 30], [x + 8, 40], [x - 2, 50], [x + 10, 22]].map(([a, b]) => circle(a!, b!, 1.6, C.white, '#9fb3c8', 0.6))); }
function palmOut(x: number, y: number): Svg { return at(x, y, 1, path('M-4 6 L-4 -4 C-4 -7 -2 -7 -2 -4 L-2 -7 C-2 -10 0 -10 0 -7 L0 -8 C0 -11 2 -11 2 -8 L2 -6 C2 -9 4 -9 4 -6 L4 4 C4 8 -1 9 -4 6 Z', C.skin, C.ink, 1)); }
function envelopeS(x: number, y: number): Svg { return at(x, y, 1, rect(-7, -5, 14, 10, C.white, 1, C.ink, 1), path('M-7 -5 L0 1 L7 -5', 'none', C.ink, 0.9)); }
function note(x: number, y: number): Svg { return at(x, y, 0.8, path('M0 6 L0 -8 L6 -10 L6 4', 'none', C.navy, 1.6), ellipse(-2, 6, 2.6, 2, C.navy, null), ellipse(4, 4, 2.6, 2, C.navy, null)); }
function brokenMoral(x: number, y: number): Svg { return at(x, y, 1, path('M-1 8 C-12 0 -10 -10 -4 -10 C-1 -10 -1 -8 -1 -6 L-3 -2 L0 2 Z', C.red, C.ink, 1.2), path('M2 9 C13 1 11 -9 5 -9 C2 -9 1 -7 1 -5 L-1 -1 L2 3 Z', C.red, C.ink, 1.2), cross(14, -8, 0.6)); }
function loop(x: number, y: number, r: number): Svg { return all(path(`M${x + r} ${y} A${r} ${r} 0 1 1 ${x} ${y - r}`, 'none', GOLD, 2.6), arrow(x - 1, y - r, x + 5, y - r + 1, GOLD, 2.6)); }
function loopIcons(x: number, y: number, r: number): Svg { return all(heart(x - r, y - 10, 0.55, C.red), shieldL(x + r, y - 10, 0.5, C.navy), at(x - r + 4, y + 30, 1, circle(0, 0, 5, C.yellow, C.ink, 1)), apple(x + r - 4, y + 30, 1.4)); }
function globeMini(x: number, y: number): Svg { return all(circle(x, y, 14, WATER, C.ink, 1.3), path(`M${x - 8} ${y - 4} C${x - 2} ${y - 10} ${x + 2} ${y - 2} ${x - 3} ${y + 3} Z M${x + 4} ${y + 2} C${x + 10} ${y} ${x + 9} ${y + 8} ${x + 4} ${y + 9} Z`, '#7fbf6a', C.ink, 0.8)); }
function ladder(x: number, y: number, h: number): Svg { return all(line(`M${x - 6} ${y} L${x - 6} ${y - h} M${x + 6} ${y} L${x + 6} ${y - h}`, C.brown, 2.2), ...Array.from({ length: Math.floor(h / 9) }, (_, i) => line(`M${x - 6} ${y - 6 - i * 9} L${x + 6} ${y - 6 - i * 9}`, C.brown, 1.8))); }
