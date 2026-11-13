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
const puzzle = (x: number, y: number, s: number, col: string, kind: 'tabR' | 'slotL' | 'tabL') => at(x, y, s, path(kind === 'tabR' ? 'M-14 -14 L14 -14 L14 -5 C21 -7 21 7 14 5 L14 14 L-14 14 Z'
  : kind === 'tabL' ? 'M-14 -14 L14 -14 L14 14 L-14 14 L-14 5 C-21 7 -21 -7 -14 -5 Z' : 'M-14 -14 L14 -14 L14 14 L-14 14 L-14 5 C-7 7 -7 -7 -14 -5 Z', col, C.ink, 1.4));
const lantern = (x: number, y: number, s = 1) => at(x, y, s, glow(0, 0, 12, 'rgba(242,193,78,0.45)'), rect(-4, -6, 8, 11, '#fff2c0', 1, C.ink, 1.1), path('M-5 -6 L0 -10 L5 -6 Z', C.dark, C.ink, 0.9), line('M0 -10 L0 -13', C.ink, 1));
const bed = (x: number, y: number, w = 40, head: Svg = '') => all(rect(x - w / 2, y - 6, w, 8, C.white, 2, C.ink, 1.3), rect(x - w / 2 - 2, y - 16, 4, 22, C.brown, 1, C.ink, 1.1), line(`M${x - w / 2 + 2} ${y + 2} L${x - w / 2 + 2} ${y + 10} M${x + w / 2 - 2} ${y + 2} L${x + w / 2 - 2} ${y + 10}`, C.brown, 2), head);
const tramCar = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -14, 32, 16, C.yellow, 3, C.ink, 1.4), rect(-12, -11, 9, 7, '#bfe3f5', 1, C.ink, 0.9), rect(1, -11, 9, 7, '#bfe3f5', 1, C.ink, 0.9), circle(-9, 3, 3, C.dark, C.ink, 1), circle(9, 3, 3, C.dark, C.ink, 1), line('M0 -14 L-4 -22 L4 -22', C.ink, 1.2));
const door = (x: number, y: number, col: string) => all(rect(x - 12, y - 34, 24, 34, col, 2, C.ink, 1.4), circle(x + 7, y - 16, 1.6, GOLD, C.ink, 0.6));
const coinStack = (x: number, y: number, n: number, r = 5) => all(...Array.from({ length: n }, (_, i) => all(ellipse(x, y - i * 3, r, r * 0.4, GOLD, C.ink, 1), line(`M${x - r} ${y - i * 3} L${x - r} ${y - i * 3 + 1.6} M${x + r} ${y - i * 3} L${x + r} ${y - i * 3 + 1.6}`, C.ink, 1))));
const domino = (x: number, y: number, rot: number, col: string = C.white) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -16, 6, 16, col, 1, C.ink, 1.2), circle(0, -12, 0.9, C.ink, null), circle(0, -5, 0.9, C.ink, null));
const meter = (x: number, y: number, h: number, frac: number, col: string = C.green) => all(rect(x - 6, y - h, 12, h, C.white, 2, C.ink, 1.3), rect(x - 4, y - 2 - (h - 4) * frac, 8, (h - 4) * frac, col, 1, null));
const umbrella = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-16 0 C-16 -14 16 -14 16 0 C12 -3 8 -3 5 0 C2 -3 -2 -3 -5 0 C-8 -3 -12 -3 -16 0 Z', col, C.ink, 1.3), line('M0 -11 L0 16', C.ink, 1.4));
const rainLines = (x1: number, x2: number, y1: number) => all(...Array.from({ length: Math.floor((x2 - x1) / 7) }, (_, i) => line(`M${x1 + i * 7} ${y1 + (i % 3) * 4} l-2 6 M${x1 + i * 7 + 3} ${y1 + 14 + (i % 2) * 6} l-2 6`, '#6aa8d8', 1.2)));
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
const ladderOf = (x: number, y: number) => all(line(`M${x - 6} ${y} L${x - 6} ${y - 40} M${x + 6} ${y} L${x + 6} ${y - 40}`, C.brown, 2.2), ...[6, 14, 22, 30, 38].map((d) => line(`M${x - 6} ${y - d} L${x + 6} ${y - d}`, C.brown, 1.8)));
const veil = (x: number, y: number, w: number, h: number) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} C${x + w * 0.75} ${y + h - 4} ${x + w * 0.5} ${y + h + 4} ${x + w * 0.25} ${y + h - 2} C${x + w * 0.1} ${y + h + 2} ${x} ${y + h} ${x} ${y + h} Z`, 'rgba(200,190,230,0.82)', '#8a7fb0', 1.2),
  ...Array.from({ length: Math.floor(w / 8) }, (_, i) => line(`M${x + 4 + i * 8} ${y + 2} L${x + 4 + i * 8} ${y + h - 4}`, 'rgba(138,127,176,0.5)', 0.8)), line(`M${x - 2} ${y} L${x + w + 2} ${y}`, C.brown, 2.4));
const hut = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -12, 20, 12, '#c9a77a', 1, C.ink, 1.1), path('M-13 -12 L0 -22 L13 -12 Z', '#9a8a6a', C.ink, 1.1));
const villa = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -20, 32, 20, '#f2ece0', 1, C.ink, 1.2), path('M-19 -20 L0 -32 L19 -20 Z', '#9a4a3a', C.ink, 1.2), rect(-11, -15, 6, 6, '#bfe3f5', 1, C.ink, 0.8), rect(5, -15, 6, 6, '#bfe3f5', 1, C.ink, 0.8), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.8), coin(16, -28, 4));
const mirrorFrame = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#e8f4fb', 3, '#a8743f', 3), line(`M${x + 6} ${y + 10} L${x + 14} ${y + 4} M${x + 6} ${y + 20} L${x + 20} ${y + 6}`, C.white, 2));
const pedestal = (x: number, w: number, h: number, col: string = C.grey2) => rect(x - w / 2, 112 - h, w, h, col, 1, C.ink, 1.2);
const globe = (x: number, y: number, r: number) => all(circle(x, y, r, WATER, C.ink, 1.4), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.4)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.2)} ${f1(y - r * 0.1)} ${f1(x - r * 0.2)} ${f1(y + r * 0.2)} C${f1(x - r * 0.6)} ${f1(y + r * 0.4)} ${f1(x - r * 0.8)} ${f1(y)} ${f1(x - r * 0.6)} ${f1(y - r * 0.4)} Z M${f1(x + r * 0.3)} ${f1(y + r * 0.1)} C${f1(x + r * 0.8)} ${f1(y - r * 0.1)} ${f1(x + r * 0.7)} ${f1(y + r * 0.6)} ${f1(x + r * 0.3)} ${f1(y + r * 0.7)} Z`, '#7fbf6a', C.ink, 0.8));
const bowl = (x: number, y: number) => all(path(`M${x - 9} ${y - 4} C${x - 9} ${y + 4} ${x + 9} ${y + 4} ${x + 9} ${y - 4} Z`, '#f2ece0', C.ink, 1.2), path(`M${x - 7} ${y - 4} C${x - 4} ${y - 9} ${x + 4} ${y - 9} ${x + 7} ${y - 4} Z`, '#c9975a', C.ink, 0.8));

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
  'etik.omoralisk': all(sky(DAY, 112), rect(50, 70, 20, 30, '#e6d3b3', 2, C.ink, 1.4), rect(56, 70, 8, 3, C.dark, 0.5, null), heart(60, 86, 0.6, C.red), line('M60 100 L60 112', C.brown, 3),
    fig(88, '#4a3b63', 'angry'), reach(88, 1, -1, 64, 72), coin(64, 66, 4), cross(100, 22, 1.4),
    greyed(fig(26, C.grey, 'smile'), reach(26, 1, 1, 52, 66), coin(52, 62, 3.5)), ground),
  'etik.moralfilosofi': all(sky('#f6f2ea', 112), sage(34, 1, ROBE), reach(34, 1, 1, 50, 72), at(56, 72, 1, path('M0 6 C-8 2 -14 2 -18 6 L-18 -8 C-14 -12 -8 -12 0 -8 Z M0 6 C8 2 14 2 18 6 L18 -8 C14 -12 8 -12 0 -8 Z', '#fbf5e4', C.ink, 1.2)),
    thought(84, 26, 56, all(heart(70, 26, 0.6, C.red), line('M84 18 L84 34', C.grey, 1.4), bolt(98, 26, 0.6))),
    ...[[20, 20], [12, 44]].map(([x, y]) => qm(x!, y!, 12, HL)), ground),
  'etik.orätt': all(sky(DAY, 112), rect(96, 40, 16, 72, '#e6d3b3', 2, C.ink, 1.4), rect(98, 52, 12, 10, '#bfe3f5', 1, C.ink, 1),
    fig(78, '#4a3b63', 'smile', { h: 0.98 }), reach(78, 0.98, -1, 56, 80),
    g('rotate(-14 46 112)', kid(44, C.yellow, 'frown')), arrow(64, 70, 52, 66, C.red, 2),
    greyed(fig(18, C.grey, 'smile', { h: 0.8 })), zig(30, 30, 30), ground),
  'etik.fördöma': all(sky('#f3ece0', 112), lectern(30), fig(30, C.navy, 'angry', { h: 1 }), reach(30, 1, 1, 50, 50), palmOut(50, 46), mic(22, 70),
    bubble(86, 30, 50, all(fist(80, 30, 1.1), bolt(92, 28, 0.55), stop(86, 30, 1.6)), true),
    ...[[64, 98], [80, 102], [96, 98], [110, 102]].map(([x, y]) => bust(x!, y!, C.grey, 0.95, 'none', true))),
  'etik.anständig': all(sky(DAY, 112), rect(4, 30, 30, 82, '#e6d3b3', 2, C.ink, 1.4), rect(26, 40, 18, 72, '#a8743f', 1, C.ink, 1.4), circle(41, 76, 1.8, GOLD, C.ink, 0.6),
    fig(58, C.green, 'smile', { h: 0.94 }), reach(58, 0.94, -1, 42, 74),
    fig(92, '#b07a2a', 'smile', { h: 0.84, hair: '#e6e6e6' }), line('M104 72 L108 112', C.brown, 2.4), reach(92, 0.84, 1, 104, 74), tick(70, 18, 1.2), ground),
  'etik.relativism': all(rect(4, 4, 56, 108, '#fde2c2', 3, null), rect(60, 4, 56, 108, '#d4ecf7', 3, null), bowl(60, 74), line('M60 66 L60 6', C.white, 2, '3 3'),
    fig(26, '#c96b3c', 'smile', { h: 0.78 }), fig(94, '#2f6fb0', 'smile', { h: 0.78, hairStyle: 'long' }),
    bubble(26, 22, 26, tick(26, 22, 0.9), false), bubble(94, 22, 26, cross(94, 22, 0.9), true),
    path('M40 98 C52 106 68 106 80 98', 'none', HL, 1.8), arrow(46, 101, 40, 98, HL, 1.6), arrow(74, 101, 80, 98, HL, 1.6), ground),
  'etik.allmängiltig': all(sky('#eef4fa', 112), globe(60, 66, 26), tablet(60, 22, 0.9, PARCH, heart(0, -6, 0.5, C.red)),
    ...[[22, 70], [98, 70], [34, 102], [86, 102], [60, 104], [24, 40], [96, 40]].map(([x, y]) => all(bust(x!, y!, ['#c96b3c', C.denim, GREEN, '#7a5aa8', '#d64545', '#b07a2a', C.orange][(x! + y!) % 7]!, 0.9), tick(x! + 9, y! - 8, 0.55))),
    line('M60 40 L60 44', GOLD, 2), rays(60, 66, 28, 32, 16, GOLD, 1.2)),

  // ── 2222 Plikt och ansvar ──
  'etik.ansvarslös': all(sky('#f6f2ea', 112), rect(68, 74, 40, 38, C.white, 2, C.ink, 1.4), rect(72, 68, 20, 6, C.dark, 1, C.ink, 1.2),
    path('M74 68 C74 60 90 60 90 68 Z', '#9aa3ad', C.ink, 1.2), smoke(82, 56), path('M78 70 C80 64 84 66 86 70', 'none', C.orange, 2), excl(102, 44, 18),
    fig(32, C.orange, 'laugh', { h: 0.9 }), reach(32, 0.9, 1, 44, 66), at(46, 64, 1, rect(-4, -7, 8, 14, C.dark, 2, C.ink, 1), rect(-3, -5, 6, 9, '#bfe3f5', 1, null)), note(16, 40), note(20, 28), ground),
  'etik.plikttrogen': all(sky('#c9d6e3', 112), snow(6, 114, 8, 100),
    fig(46, C.navy, 'smile', { h: 0.94 }), on(46, 0.94, rect(-10, -66, 20, 6, C.navy, 2, C.ink, 1.2)), reach(46, 0.94, 1, 64, 76), at(68, 82, 1, path('M-8 -8 L8 -8 L10 10 L-10 10 Z', '#b07a2a', C.ink, 1.2)), envelopeS(74, 66),
    greyed(rect(88, 50, 26, 30, '#e6d3b3', 2, C.ink, 1.2), rect(92, 56, 18, 14, '#fde2a0', 1, C.ink, 1), bust(101, 68, C.grey, 0.7)),
    tick(20, 20, 1.1), path('M6 112 C30 106 80 108 114 104 L114 112 Z', C.white, '#c9d6e3', 1)),
  'etik.pliktetik': all(sky('#f6f2ea', 112), sage(26, 0.9, ROBE2), tablet(64, 34, 1.2, PARCH, tick(0, -10, 0.7)), arrow(64, 56, 64, 72, GOLD, 2.4),
    fig(64, C.green, 'smile', { h: 0.42 }), reach(64, 0.42, 1, 74, 98), rect(73, 94, 8, 5, C.dark, 1, C.ink, 0.8),
    greyed(cloud(100, 82, 0.8, C.grey2), qm(100, 86, 10, C.ink)), ground),
  'etik.maxim': all(sky(WARM, 112), fig(28, C.denim, 'smile', { h: 0.86 }), reach(28, 0.86, 1, 30, 18), at(32, 22, 1, rect(-14, -10, 28, 18, PARCH, 2, C.ink, 1.3), path('M-6 -1 Q0 5 6 -1', 'none', C.red, 1.6), tick(9, -4, 0.45)),
    ...[44, 68, 92].map((y, i) => all(rect(56, y - 16, 56, 22, i % 2 ? '#fdf6e6' : '#f6efe0', 2, '#d8c9a8', 1), bust(68, y - 4, C.denim, 0.8), bubble(92, y - 6, 22, tick(92, y - 6, 0.5), true))),
    line('M44 30 L54 40', GOLD, 1.6, '2 2'), ground),
  'etik.kategoriskt-imperativ': all(sky('#eef4fa', 112), fig(30, '#c96b3c', 'smile', { h: 0.62 }), reach(30, 0.62, 1, 44, 82), coin(46, 80, 3.5),
    thought(30, 22, 44, all(...[16, 26, 36, 46].map((x) => bust(x, 20, '#c96b3c', 0.5)))), arrow(52, 74, 62, 74, HL, 2.4),
    ...[[74, 62], [92, 62], [110, 62], [74, 92], [92, 92], [110, 92]].map(([x, y]) => all(bust(x!, y!, '#c96b3c', 0.85), coin(x! + 6, y! + 10, 2.4))), tick(96, 22, 1.3), ground),
  'etik.självändamål': all(sky('#f6f2ea', 112), glow(34, 72, 30), rays(34, 72, 30, 36, 14, GOLD, 1.4), fig(34, C.orange, 'smile', { h: 0.8, hairStyle: 'long' }),
    greyed(ladderOf(92, 112), grey(84, 'frown', { h: 0.62 }), grey(98, 'smile', { h: 0.62 }), g('translate(0 -36)', grey(96, 'smile', { h: 0.5 }))), cross(106, 30, 0.9), tick(34, 18, 1.1), ground),

  // ── 2223 Konsekvenser och nytta ──
  'etik.nytta': all(sky('#c9d6e3', 112), rainLines(6, 114, 8), rainLines(6, 114, 40), umbrella(36, 52, 1.5), fig(36, C.green, 'smile', { h: 0.84 }), reach(36, 0.84, 1, 36, 70), tick(36, 18, 1),
    greyed(fig(90, C.grey, 'frown', { h: 0.84 }), drop(84, 50, 1), drop(96, 46, 1), drop(90, 60, 1)), ground),
  'etik.konsekvensetik': all(sky('#f6f2ea', 112), sage(16, 0.6, ROBE2), ...[30, 40, 50, 60].map((x, i) => domino(x, 100, 40 - i * 10)), ...[70, 80].map((x) => domino(x, 100, 0)),
    arrow(86, 92, 94, 80, GOLD, 2.2), glow(102, 62, 18), ...[[96, 58], [108, 58], [102, 70]].map(([x, y]) => bust(x!, y!, ['#c96b3c', GREEN, C.denim][(x! + y!) % 3]!, 0.7)), sun(102, 30, 7), ground),
  'etik.utilitarism': all(sky('#eef4fa', 112), scales(60, 86, 1.25, 12, all(bust(-4, -10, C.grey, 0.6, 'frown', true)), all(...[[-8, -14], [0, -16], [8, -14], [-4, -6], [4, -6]].map(([x, y]) => bust(x!, y!, ['#c96b3c', GREEN, C.denim, '#7a5aa8', '#d64545'][(x! + y! + 30) % 5]!, 0.55)))),
    sage(14, 0.56, ROBE2), num(98, 26, '5', 14, GREEN), num(34, 30, '1', 12, GREY), tick(110, 40, 0.8)),
  'etik.välbefinnande': all(sky('#e8f6ea', 112), sun(98, 20, 7), tree(18, 104, 0.9), fig(60, C.mint, 'calm', { h: 0.9, hairStyle: 'long' }), reach(60, 0.9, -1, 42, 66), reach(60, 0.9, 1, 78, 66),
    heart(60, 58, 0.5, C.red), glow(60, 62, 26, 'rgba(127,191,106,0.25)'), ...[[30, 40], [90, 50], [80, 34]].map(([x, y]) => sparkle(x!, y!, 3, GOLD)), path('M4 104 C40 100 80 100 116 104 L116 112 L4 112 Z', '#9fd18a', null)),
  'etik.njutning': all(sky('#fde2c2', 112), fig(54, C.pink, 'calm', { h: 0.96, hairStyle: 'long' }), reach(54, 0.96, 1, 72, 52),
    at(74, 44, 1, path('M-5 4 L0 18 L5 4 Z', '#d4a373', C.ink, 1), circle(0, 0, 6, '#fff2c0', C.ink, 1), circle(-3, -5, 4.5, C.pink, C.ink, 1)),
    ...[[30, 30], [86, 22], [92, 40], [34, 50]].map(([x, y]) => sparkle(x!, y!, 3.4, GOLD)), heart(28, 70, 0.6, C.red), ground),
  'etik.största-möjliga-lycka': all(sky(WARM, 112), sun(60, 20, 10), rays(60, 20, 13, 18, 12, GOLD, 1.4), meter(108, 104, 64, 1, GOLD), arrow(108, 30, 108, 18, GOLD, 2),
    ...[[18, 60], [36, 56], [54, 60], [72, 56], [90, 60], [26, 80], [44, 76], [62, 80], [80, 76], [18, 100], [36, 98], [54, 100], [72, 98], [90, 100]].map(([x, y], i) => bust(x!, y!, ['#c96b3c', GREEN, C.denim, '#7a5aa8', '#d64545', '#b07a2a'][i % 6]!, 0.9))),
  'etik.maximera': all(sky('#eef4fa', 112), line('M14 104 L110 104 M14 104 L14 14', C.ink, 1.8), ...[[28, 20], [46, 36], [64, 54], [82, 72]].map(([x, h]) => rect(x! - 7, 104 - h!, 14, h!, C.grey2, 1, C.ink, 1)),
    rect(93, 18, 14, 86, GREEN, 1, C.ink, 1.4), arrow(100, 40, 100, 22, C.white, 2), line('M14 18 L110 18', HL, 1.6, '4 3'), star(100, 12, 5, GOLD)),
  'etik.ändamålet-helgar-medlen': all(sky(DAY, 112), path('M80 112 L80 40 L112 40 L112 112 Z', '#d9c8a4', C.ink, 1.2), star(96, 26, 9, GOLD), rays(96, 26, 11, 15, 10, GOLD, 1.2),
    ...[30, 40, 50].map((x) => all(line(`M${x} 112 L${x} 84`, C.brown, 2), line(`M${x - 5} 92 L${x + 5} 92 M${x - 5} 102 L${x + 5} 102`, C.brown, 1.6))), g('rotate(-50 62 112)', line('M58 112 L58 84 M53 92 L63 92 M53 102 L63 102', C.brown, 2)),
    crushed(20, 111), crushed(66, 111), fig(70, '#4a3b63', 'smile', { h: 0.72 }), reach(70, 0.72, 1, 86, 58), arrow(70, 30, 86, 30, GOLD, 2), qm(30, 34, 22, C.red), ground),

  // ── 2224 Dygder och karaktär ──
  'etik.dygd': all(sky(WARM, 112), glow(40, 60, 28), fig(40, C.green, 'smile'), on(40, 1, star(0, -22, 7, GOLD)), reach(40, 1, 1, 64, 82),
    kid(78, C.sky, 'smile'), reach(78, 0.56, -1, 66, 84), heart(60, 28, 0.6, C.red), greyed(fig(104, C.grey, 'smile', { h: 0.8 })), ground),
  'etik.dygdetik': all(sky('#f6f2ea', 112), mirrorFrame(62, 18, 46, 86), sage(34, 0.9, ROBE2, 'calm'),
    g('translate(0 0)', glow(85, 64, 22), fig(85, ROBE2, 'smile', { h: 0.78, bottom: ROBE2 }), on(85, 0.78, star(0, -22, 7, GOLD))), thought(30, 18, 34, qm(30, 23, 12, HL)), ground),
  'etik.måttlighet': all(sky('#f6f2ea', 112), rect(8, 86, 104, 6, C.tan, 2, C.ink, 1.4), line('M14 92 L14 112 M106 92 L106 112', C.brown, 3),
    fig(32, C.green, 'smile', { h: 0.62 }), plate(32, 84, 12), apple(28, 81, 1), circle(36, 81, 3, '#9fd18a', C.ink, 0.8), tick(32, 22, 1),
    greyed(fig(86, C.grey, 'smile', { h: 0.62, belly: 1 }), plate(86, 84, 16), ...Array.from({ length: 7 }, (_, i) => circle(80 + (i % 3) * 6, 80 - Math.floor(i / 3) * 6, 3.4, C.grey2, C.ink, 0.8))), cross(86, 22, 0.9)),
  'etik.klokhet': all(sky(NIGHT, 112), ...[[22, 14], [48, 10], [100, 12]].map(([x, y]) => sparkle(x!, y!, 2, '#f6e8a8')),
    path('M52 112 L68 112 L66 92 L34 56 L24 60 L56 94 Z', '#6a6478', C.ink, 1), path('M54 94 L62 92 L96 54 L106 58 L68 98 Z', '#e6d3b3', C.ink, 1),
    path('M14 58 L30 52 L32 60 L16 66 Z', '#3a3348', null), storm(26, 34, 0.6), zig(14, 62, 18, C.red),
    house2(100, 52), glow(92, 66, 24, 'rgba(242,193,78,0.3)'),
    fig(62, ROBE, 'calm', { h: 0.5 }), reach(62, 0.5, 1, 76, 90), lantern(78, 88, 0.9), thought(34, 86, 24, qm(34, 91, 10, HL), false)),
  'etik.rättrådig': all(sky('#eef0f4', 112), fig(42, C.navy, 'calm', { h: 1 }), reach(42, 1, -1, 22, 54), scales(22, 60, 0.45, 0), reach(42, 1, 1, 60, 60), palmOut(62, 56),
    greyed(fig(94, C.grey, 'smile', { h: 0.9 }), reach(94, 0.9, -1, 76, 70), bag(72, 74, 0.8, C.grey2)), coin(72, 62, 3.5), cross(72, 40, 0.9), ground),
  'etik.generositet': all(sky(WARM, 112), fig(36, C.orange, 'smile', { hairStyle: 'long' }), bag(22, 98, 1), ...[[18, 88], [24, 86], [28, 90]].map(([x, y]) => apple(x!, y!)),
    reach(36, 1, 1, 56, 74), apple(58, 72, 1.2), kid(66, C.sky, 'smile'), kid(82, GREEN, 'smile'), kid(98, '#7a5aa8', 'smile'), apple(72, 92), apple(88, 92), apple(104, 92),
    greyed(at(104, 30, 0.5, fig(0, C.grey, 'frown'))), heart(54, 26, 0.6, C.red), ground),
  'etik.ödmjukhet': all(sky('#eef4fa', 112), fig(34, C.green, 'smile', { h: 0.84 }), on(34, 0.84, medal(0, -24, 1.2)), reach(34, 0.84, 1, 54, 80),
    bust(62, 96, '#c96b3c', 1), bust(78, 98, C.denim, 1), heart(54, 66, 0.5, C.red),
    greyed(pedestal(100, 26, 26), g('translate(0 -26)', fig(100, C.grey, 'laugh', { h: 0.6 }), on(100, 0.6, medal(0, -24, 1.4)))), ground),
  'etik.feghet': all(sky(DAY, 112), tree(30, 112, 1.4), fig(34, '#d4c06a', 'shock', { h: 0.86 }), g('translate(0 0)', path('M14 112 L14 60 C14 50 40 46 46 60 L46 112 Z', C.green, C.ink, 1.2)), on(34, 0.86, circle(0, -56, 10, C.skin, C.ink, 2), circle(-3.4, -56, 1.8, C.white, C.ink, 0.9), circle(3.4, -56, 1.8, C.white, C.ink, 0.9)), shake(34, 32), sweat(46, 34),
    kid(92, C.sky, 'frown'), bubble(96, 54, 22, excl(96, 59, 14), false), fig(70, '#4a3b63', 'angry', { h: 0.82 }), reach(70, 0.82, 1, 86, 74), ground),
  'etik.den-gyllene-medelvägen': all(sky('#f6f2ea', 112), path('M4 80 L24 80 L24 112 L4 112 Z', '#c9b98a', C.ink, 1.2), path('M96 80 L116 80 L116 112 L96 112 Z', '#c9b98a', C.ink, 1.2),
    rect(4, 74, 112, 8, C.grey2, 2, C.ink, 1.2), rect(46, 74, 28, 8, GOLD, 2, C.ink, 1.2), glow(60, 60, 22),
    g('translate(0 -38)', fig(60, C.green, 'smile', { h: 0.6 })), cross(14, 56, 0.9), cross(106, 56, 0.9), shake(14, 72), bolt(106, 34, 0.6), tick(60, 14, 1.1), arrow(30, 96, 44, 96, GOLD, 1.8), arrow(90, 96, 76, 96, GOLD, 1.8)),

  // ── 2225 Moralisk konflikt ──
  'etik.värdekonflikt': all(sky('#f6f2ea', 112), fig(60, '#d4c06a', 'frown', { h: 0.84 }), reach(60, 0.84, -1, 36, 62), reach(60, 0.84, 1, 84, 62),
    line('M14 56 L36 62', C.brown, 2), line('M84 62 L106 56', C.brown, 2), heart(14, 50, 1, C.red), glow(14, 50, 14), shieldL(106, 50, 0.9, C.navy, star(0, 0, 4, GOLD)),
    arrow(30, 40, 18, 36, HL, 1.8), arrow(90, 40, 102, 36, HL, 1.8), zig(48, 20, 24, HL), ground),
  'etik.lojalitetskonflikt': all(sky('#eef4fa', 112), fig(60, '#d4c06a', 'frown', { h: 0.8 }), fig(22, C.red, 'angry', { h: 0.92 }), fig(98, C.denim, 'angry', { h: 0.92, hairStyle: 'long' }),
    reach(22, 0.92, 1, 46, 70), reach(98, 0.92, -1, 74, 70), heart(40, 30, 0.5, C.red), heart(80, 30, 0.5, C.red), bolt(60, 18, 0.7), ground),
  'etik.samvetskval': all(sky(NIGHT, 112), ...[[14, 14], [30, 22], [100, 12], [110, 30]].map(([x, y]) => sparkle(x!, y!, 2, '#f6e8a8')), path('M96 40 A10 10 0 1 0 96 60 A7 10 0 1 1 96 40 Z', '#f6e08a', C.ink, 0.8),
    bed(56, 96, 80, ''), path('M24 90 C40 82 80 82 94 90 L94 94 L24 94 Z', C.lilac, C.ink, 1.2), circle(28, 84, 7, C.skin, C.ink, 1.2), circle(26, 84, 1.6, C.white, C.ink, 0.6), circle(31, 84, 1.6, C.white, C.ink, 0.6), line('M25 88 Q28 86.6 31 88', C.ink, 0.9),
    thought(46, 44, 46, all(path('M36 50 L40 38 L46 38 L50 50 Z', '#7ab0d0', C.ink, 1), line('M41 42 L44 46 L42 48', C.ink, 1), storm(56, 36, 0.4)), false), shake(28, 72)),
  'etik.oförenlig': all(sky('#f6f2ea', 112), puzzle(40, 44, 1.1, '#f2d9a0', 'tabR'), puzzle(80, 44, 1.1, '#bfe3f5', 'tabL'), zig(54, 24, 12, C.red), cross(60, 84, 1.5),
    greyed(at(28, 98, 0.45, puzzle(0, 0, 1, C.grey2, 'tabR'), puzzle(30, 0, 1, C.grey2, 'slotL')), tick(20, 82, 0.6))),
  'etik.ge-vika': all(sky(DAY, 112), line('M30 74 L84 80', C.brown, 2.4), fig(24, C.red, 'laugh', { h: 0.9 }), reach(24, 0.9, 1, 34, 72),
    fig(92, C.denim, 'frown', { h: 0.9 }), reach(92, 0.9, -1, 76, 60), reach(92, 0.9, 1, 108, 60), path('M84 80 C88 90 82 96 86 104', 'none', C.brown, 2.4), arrow(56, 60, 40, 56, HL, 2), ground),
  'etik.dubbelmoral': all(sky(DAY, 112), rect(96, 84, 14, 28, '#5a8a5a', 2, C.ink, 1.2), fig(54, C.navy, 'angry'), reach(54, 1, -1, 32, 56), palmOut(30, 52),
    kid(18, C.yellow, 'frown'), can(28, 110), cross(14, 30, 0.9), reach(54, 1, 1, 74, 84), can(80, 92), arrow(78, 98, 82, 106, C.red, 1.6), can(84, 110), qm(96, 30, 22, C.red), ground),
  'etik.hyckleri': all(sky('#f6f2ea', 112), fig(56, '#4a3b63', 'angry', { h: 1 }), reach(56, 1, 1, 64, 54), mask(58, 46, 1.25),
    greyed(fig(98, C.grey, 'smile', { h: 0.8 }), fig(18, C.grey, 'smile', { h: 0.8 })), heart(30, 28, 0.6, C.red), on(56, 1, path('M-13 -66 L-7 -72 M13 -66 L7 -72', 'none', C.red, 1.4)), ground),
  'etik.försvarbar': all(sky('#eef4fa', 112), fig(30, C.green, 'smile', { h: 0.92 }), reach(30, 0.92, 1, 50, 60), palmUp(52, 58),
    bubble(36, 18, 54, all(num(18, 23, '1', 9), tick(25, 19, 0.45), num(38, 23, '2', 9), tick(45, 19, 0.45), num(56, 23, '3', 9), tick(63, 19, 0.45)), true), shieldL(52, 82, 0.8, C.navy, tick(0, 0, 0.6)),
    ...[[78, 98], [94, 96], [110, 98]].map(([x, y]) => all(bust(x!, y!, C.grey, 1, 'smile', true), line(`M${x! - 3} ${y! - 12} L${x!} ${y! - 9} L${x! + 3} ${y! - 12}`, GREEN, 1.2))), ground),

  // ── 2226 Rättvisa och jämlikhet ──
  'etik.rättvisa': all(sky(WARM, 112), scales(60, 50, 1.3, 0, all(...[-6, 0, 6].map((x) => apple(x, -4, 1.1))), all(...[-6, 0, 6].map((x) => apple(x, -4, 1.1)))), glow(60, 20, 14),
    ...[18, 42, 78, 102].map((x, i) => all(bust(x, 98, ['#c96b3c', GREEN, C.denim, '#7a5aa8'][i]!, 1.1), apple(x + 8, 106, 1))), tick(104, 20, 1)),
  'etik.orättvisa': all(sky('#f3ece0', 112), scales(60, 46, 1.2, 18, '', all(coinStack(0, -2, 4, 4))), fig(28, '#4a3b63', 'laugh', { h: 0.72 }), coinStack(16, 110, 6, 5), coinStack(42, 110, 5, 5),
    fig(92, C.sky, 'frown', { h: 0.72 }), reach(92, 0.72, -1, 80, 90), plate(80, 92, 8), zig(70, 104, 18), cross(104, 24, 0.9)),
  'etik.ojämlikhet': all(sky('#eef4fa', 112), box(30, 112, 26, 64, '#c9a24a'), box(60, 112, 26, 22, '#c9a24a'), box(90, 112, 26, 6, '#c9a24a'),
    g('translate(0 -64)', fig(30, '#4a3b63', 'laugh', { h: 0.42 })), g('translate(0 -22)', fig(60, C.green, 'smile', { h: 0.42 })), g('translate(0 -6)', fig(90, C.sky, 'frown', { h: 0.42 })),
    greyed(at(100, 20, 0.35, box(-20, 0, 18, 30, C.grey2), box(0, 0, 18, 30, C.grey2), box(20, 0, 18, 30, C.grey2))), zig(14, 30, 30, HL), ground),
  'etik.förtjäna': all(sky(WARM, 112), path('M4 100 L56 100 L56 112 L4 112 Z', '#8a5a34', null), ...[12, 24, 36, 48].map((x) => all(line(`M${x} 100 L${x} 92`, C.green, 1.6), circle(x, 90, 3, C.green, C.ink, 0.8))),
    fig(70, C.orange, 'laugh', { h: 0.9 }), sweat(80, 36), reach(70, 0.9, -1, 52, 82), line('M52 82 L44 106 M40 106 L48 106', C.brown, 2), arrow(86, 56, 96, 46, GOLD, 2), medal(104, 40, 1.4), rays(104, 40, 9, 13, 10, GOLD, 1.2), ground),
  'etik.okunnighetens-slöja': all(sky('#f6f2ea', 112), villa(92, 50, 0.9), hut(92, 96, 1), fig(28, '#7a5aa8', 'calm', { h: 0.84 }), veil(8, 20, 42, 92),
    arrow(52, 64, 70, 46, HL, 1.8), arrow(52, 74, 70, 90, HL, 1.8), qm(62, 70, 16, HL), ground),
  'etik.lika-möjligheter': all(sky('#e8f6ea', 112), path('M4 98 L116 98 L116 112 L4 112 Z', '#c9775a', null), line('M20 112 L20 76', C.white, 3), line('M100 112 L100 76', C.dark, 2, '3 3'),
    ...[[30, C.red], [52, C.denim], [74, GREEN]].map(([x, c]) => fig(+x!, c as string, 'smile', { h: 0.5 })), line('M20 104 L110 104', C.white, 1, '4 3'), tick(60, 24, 1.2),
    greyed(at(84, 30, 0.3, ...[-10, 6, 22].map((x, i) => rect(x, -i * 8, 10, 30 + i * 8, C.grey2, 1, C.ink, 1))))),

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
function palmUp(x: number, y: number): Svg { return at(x, y, 1, path('M-6 0 C-6 4 6 4 6 0 L6 -2 L-6 -2 Z', C.skin, C.ink, 1)); }
function envelopeS(x: number, y: number): Svg { return at(x, y, 1, rect(-7, -5, 14, 10, C.white, 1, C.ink, 1), path('M-7 -5 L0 1 L7 -5', 'none', C.ink, 0.9)); }
function note(x: number, y: number): Svg { return at(x, y, 0.8, path('M0 6 L0 -8 L6 -10 L6 4', 'none', C.navy, 1.6), ellipse(-2, 6, 2.6, 2, C.navy, null), ellipse(4, 4, 2.6, 2, C.navy, null)); }
function house2(x: number, y: number): Svg { return at(x, y, 0.8, rect(-10, -12, 20, 12, '#f2ece0', 1, C.ink, 1), path('M-13 -12 L0 -22 L13 -12 Z', '#9a4a3a', C.ink, 1), rect(-3, -7, 6, 7, '#fde2a0', 1, C.ink, 0.8)); }
