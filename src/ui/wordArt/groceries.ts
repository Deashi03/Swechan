/**
 * Groceries (0.15, backfill of Vardag & hem → Mat & dryck 108–113): poultry and eggs, fish and
 * shellfish, vegetarian protein, dairy, choosing produce, storage. One clear object per word;
 * adjectives use a before/after or a badge, verbs a still with a hand, tool or arrow.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { figure } from './figures';
import { HL, T, bubble, brokenHeart } from './people';

const ground = line('M4 112 L116 112', C.grey2, 2);
const grass = all(rect(0, 96, 120, 24, '#cfe8b8', 0, null), line('M8 96 l2 -5 M30 96 l-2 -6 M58 96 l3 -5 M88 96 l-2 -6 M110 96 l2 -5', C.green, 1.6));
const plate = (x: number, y: number, w = 40) => all(ellipse(x, y, w, w * 0.3, C.white, C.ink, 2), ellipse(x, y, w * 0.72, w * 0.2, '#eef2f5', null));
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 C8 -8 8 0 6 6 C4 10 -4 10 -6 6 C-8 0 -6 -6 -2 -10 C-2 -6 0 -4 2 -4 C2 -8 0 -12 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -6 C4 -2 4 4 0 6 C-4 4 -3 0 0 -6 Z', C.yellow, null));
const badge = (x: number, y: number, r: number, col: string, inner: Svg) => all(circle(x, y, r, col, C.ink, 2), circle(x, y, r - 4, 'none', C.white, 1.4), inner);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 L-2 6 L9 -7', 'none', col, 4));
const leafB = (x: number, y: number, rot = 0, s = 1, col: string = C.green) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 C6 -8 18 -8 22 0 C18 8 6 8 0 0 Z', col, C.ink, 1.4), line('M2 0 L18 0', '#2f6b45', 1));

// birds and eggs
const bird = (kind: 'höna' | 'tupp' | 'kalkon' | 'anka' | 'gås', x = 60, y = 70, s = 1) => {
  const body = kind === 'anka' ? '#f2c14e' : kind === 'gås' ? C.white : kind === 'kalkon' ? '#8a5a3c' : kind === 'tupp' ? '#c4572e' : '#f6ead8';
  const neck = kind === 'gås' ? 'M18 -8 C22 -24 22 -36 18 -44' : kind === 'anka' ? 'M18 -6 C22 -14 22 -20 18 -26' : 'M14 -10 C18 -18 18 -24 16 -28';
  const hy = kind === 'gås' ? -48 : kind === 'anka' ? -30 : -32;
  return g(`translate(${x} ${y}) scale(${s})`,
    kind === 'kalkon' ? all(...[-60, -40, -20, 0, 20].map((a, i) => g(`rotate(${a} -14 -4)`, ellipse(-14, -30, 8, 22, ['#a0673d', '#c99a6a', '#8a5a3c', '#c99a6a', '#a0673d'][i]!, C.ink, 1.4)))) : '',
    kind === 'tupp' ? all(path('M-20 -6 C-36 -20 -40 -34 -30 -40 C-28 -30 -24 -20 -16 -12 Z', C.green, C.ink, 1.4), path('M-20 -4 C-40 -10 -46 -24 -40 -30 C-34 -22 -28 -14 -18 -8 Z', '#2f4a7a', C.ink, 1.4)) : '',
    kind === 'höna' ? path('M-20 -6 C-30 -16 -30 -22 -24 -24 C-22 -18 -18 -12 -14 -10 Z', '#e6d3b3', C.ink, 1.4) : '',
    ellipse(0, 0, 24, 16, body, C.ink, 2), path(neck, 'none', C.ink, 9), path(neck, 'none', body, 6.4),
    circle(16, hy, 8, body, C.ink, 1.8), circle(18, hy - 1, 1.4, C.ink, null),
    kind === 'anka' || kind === 'gås' ? path(`M22 ${hy + 1} L34 ${hy + 3} L22 ${hy + 5} Z`, C.orange, C.ink, 1.2) : path(`M23 ${hy} L30 ${hy + 2} L23 ${hy + 4} Z`, C.yellow, C.ink, 1.2),
    kind === 'tupp' || kind === 'höna' ? all(path(`M10 ${hy - 6} C10 ${hy - 14} 14 ${hy - 12} 15 ${hy - 8} C16 ${hy - 14} 20 ${hy - 14} 20 ${hy - 7} C22 ${hy - 11} 26 ${hy - 8} 22 ${hy - 4} Z`, C.red, C.ink, 1.2), path(`M22 ${hy + 4} C24 ${hy + 10} 20 ${hy + 12} 19 ${hy + 6} Z`, C.red, C.ink, 1)) : '',
    kind === 'kalkon' ? path(`M22 ${hy + 3} C26 ${hy + 12} 20 ${hy + 16} 20 ${hy + 6} Z`, C.red, C.ink, 1) : '',
    path('M-6 -2 C0 6 10 6 14 0', 'none', C.ink, 1.4),
    kind === 'anka' || kind === 'gås' ? '' : line('M-6 14 L-6 28 M6 14 L6 28 M-6 28 L-10 30 M-6 28 L-2 30 M6 28 L2 30 M6 28 L10 30', C.orange, 2.2));
};
const egg = (x: number, y: number, s = 1, col: string = '#f6ead8') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -14 C9 -14 12 0 11 6 C10 12 6 15 0 15 C-6 15 -10 12 -11 6 C-12 0 -9 -14 0 -14 Z', col, C.ink, 1.8));
const halfEgg = (x: number, y: number, s: number, yolk: 'hard' | 'soft') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 0 C-16 -16 16 -16 16 0 C16 14 8 20 0 20 C-8 20 -16 14 -16 0 Z', C.white, C.ink, 2), yolk === 'hard' ? circle(0, 2, 8, '#f6c343', C.ink, 1) : path('M-8 2 C-8 -6 8 -6 8 2 C8 6 10 14 4 16 C2 10 -2 12 -4 16 C-10 12 -8 6 -8 2 Z', '#f2a516', C.ink, 1));
const friedEgg = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-24 0 C-28 -14 -10 -20 0 -16 C14 -22 30 -10 24 4 C28 16 8 22 -4 18 C-18 22 -30 12 -24 0 Z', C.white, C.ink, 2), circle(0, 0, 9, '#f6b419', C.ink, 1.6));
const drumstick = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-20 -10 C-34 -10 -34 14 -20 14 C-10 14 -2 6 6 4 L6 -2 C-2 -4 -10 -10 -20 -10 Z', '#c97b3c', C.ink, 2), rect(6, -2, 14, 6, '#f6ead8', 3, C.ink, 1.4), circle(22, -2, 3.4, '#f6ead8', C.ink, 1.2), circle(22, 4, 3.4, '#f6ead8', C.ink, 1.2));
const grill = (x: number, y: number) => all(path(`M${x - 34} ${y} L${x + 34} ${y} C${x + 34} ${y + 22} ${x - 34} ${y + 22} ${x - 34} ${y} Z`, C.dark, C.ink, 2), line(`M${x - 20} ${y + 16} L${x - 28} ${y + 40} M${x + 20} ${y + 16} L${x + 28} ${y + 40} M${x} ${y + 18} L${x} ${y + 40}`, C.dark, 3), ...[-24, -12, 0, 12, 24].map((d) => line(`M${x + d} ${y - 2} L${x + d} ${y + 2}`, C.grey, 1)), line(`M${x - 34} ${y} L${x + 34} ${y}`, C.grey, 2.4));
const cage = (x: number, y: number, w: number, h: number) => all(...Array.from({ length: Math.round(w / 8) + 1 }, (_, i) => line(`M${x - w / 2 + i * 8} ${y - h} L${x - w / 2 + i * 8} ${y}`, C.grey, 1.8)), line(`M${x - w / 2} ${y - h} L${x + w / 2} ${y - h} M${x - w / 2} ${y} L${x + w / 2} ${y}`, C.dark, 3), path(`M${x - w / 2} ${y - h} C${x - w / 2} ${y - h - 14} ${x + w / 2} ${y - h - 14} ${x + w / 2} ${y - h}`, 'none', C.dark, 2.4), circle(x, y - h - 12, 3, 'none', C.dark, 2));

// fish and shellfish
const fish = (x: number, y: number, s: number, body: string, o: { belly?: string; stripes?: string; spots?: boolean; bars?: boolean; fin?: string } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M30 0 L44 -12 L42 0 L44 12 Z', o.fin ?? body, C.ink, 1.8),
  path('M-36 0 C-28 -16 6 -20 30 0 C6 20 -28 16 -36 0 Z', body, C.ink, 2),
  o.belly ? path('M-34 2 C-24 14 6 16 28 2 C6 8 -20 8 -34 2 Z', o.belly, null) : '',
  o.stripes ? all(...[-14, -4, 6, 16].map((d) => path(`M${d} -12 C${d + 4} -6 ${d - 2} -2 ${d + 2} 2`, 'none', o.stripes!, 1.6))) : '',
  o.bars ? all(...[-12, 0, 12].map((d) => path(`M${d} -13 L${d + 2} 10`, 'none', '#3d4a2f', 3))) : '',
  o.spots ? all(...[[-10, -6], [2, -8], [12, -4], [-2, -2]].map(([a, b]) => circle(a!, b!, 1.6, '#3d3f4a', null))) : '',
  path('M-4 -14 L4 -24 L12 -14', o.fin ?? body, C.ink, 1.4), circle(-26, -3, 2.4, C.white, C.ink, 1), circle(-26, -3, 1, C.ink, null), path('M-36 2 L-32 3', 'none', C.ink, 1.2), path('M-18 -8 C-14 -2 -14 4 -18 8', 'none', C.ink, 1.2));
const fillet = (x: number, y: number, s: number, col: string, lines: string) => g(`translate(${x} ${y}) scale(${s})`, path('M-34 -6 C-20 -18 20 -18 34 -8 C30 4 24 14 -30 12 C-36 6 -36 0 -34 -6 Z', col, C.ink, 2), ...[-20, -8, 4, 16].map((d) => path(`M${d} -12 C${d + 4} -4 ${d - 2} 4 ${d + 2} 12`, 'none', lines, 1.6)));
const shrimp = (x: number, y: number, s = 1, col: string = '#f4927a') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -12 C4 -20 22 -8 20 8 C18 18 6 20 0 12 C8 10 10 2 4 -2 C-4 -6 -12 -2 -16 -12 Z', col, C.ink, 1.8), ...[-4, 4, 12].map((d) => path(`M${d} -10 C${d + 4} -4 ${d + 4} 2 ${d} 6`, 'none', 'rgba(0,0,0,0.25)', 1.2)), path('M-16 -12 L-24 -20 M-16 -12 L-26 -12', 'none', C.ink, 1), circle(-12, -12, 1.2, C.ink, null), path('M0 12 L-6 18 L4 18 Z', col, C.ink, 1.2));
const crayfish = (x: number, y: number, s = 1, col: string = '#d6452f') => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -20 L4 -20 L6 20 L0 30 L-6 20 Z', col, C.ink, 1.8), ...[-10, -2, 6, 14].map((d) => line(`M-5 ${d} L5 ${d}`, 'rgba(0,0,0,0.3)', 1.2)), path('M-4 -18 C-14 -26 -16 -38 -10 -44 C-4 -40 -6 -30 -2 -22 Z', col, C.ink, 1.6), path('M4 -18 C14 -26 16 -38 10 -44 C4 -40 6 -30 2 -22 Z', col, C.ink, 1.6), path('M-10 -44 L-16 -50 M-10 -44 L-4 -50 M10 -44 L4 -50 M10 -44 L16 -50', 'none', C.ink, 1.4), ...[-12, -4, 4].map((d) => line(`M-5 ${d} L-14 ${d + 4} M5 ${d} L14 ${d + 4}`, C.ink, 1.2)), line('M-2 -22 L-10 -34 M2 -22 L10 -34', C.ink, 0.8), path('M0 30 L-8 36 L8 36 Z', col, C.ink, 1.2));
const mussel = (x: number, y: number, s = 1, open = false) => g(`translate(${x} ${y}) scale(${s})`, path('M-20 6 C-24 -6 -10 -16 6 -14 C18 -12 22 -2 18 6 C10 10 -10 12 -20 6 Z', '#2f3550', C.ink, 1.8), path('M-16 4 C-8 -4 4 -8 14 -4', 'none', '#5a6b9a', 1.4), open ? path('M-20 6 C-14 18 10 18 18 6 C10 10 -10 12 -20 6 Z', '#f2a26e', C.ink, 1.4) : '');

// vegetarian
const leafBadge = (x: number, y: number, r = 26) => badge(x, y, r, C.green, all(leafB(x - 12, y + 6, -40, 1.2, '#a8dcc0')));
const burger = (x: number, y: number, s = 1, patty: string = '#7a4a24') => g(`translate(${x} ${y}) scale(${s})`, path('M-30 -4 C-30 -26 30 -26 30 -4 Z', '#e0a458', C.ink, 2), ...[[-12, -14], [0, -18], [12, -14], [-4, -10], [8, -10]].map(([a, b]) => ellipse(a!, b!, 1.6, 1, C.white, null)), path('M-32 -2 C-20 4 -8 -4 0 2 C8 -4 20 4 32 -2 L32 2 L-32 2 Z', C.green, C.ink, 1.2), rect(-30, 2, 60, 10, patty, 4, C.ink, 1.6), rect(-28, 12, 56, 4, C.red, 2, C.ink, 1), path('M-30 16 L30 16 C30 26 -30 26 -30 16 Z', '#e0a458', C.ink, 2));
const dropOil = (x: number, y: number, s = 1, col: string = '#e8c547') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -10 C6 -2 8 4 6 8 C4 12 -4 12 -6 8 C-8 4 -6 -2 0 -10 Z', col, C.ink, 1.2));
const cow = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-20, -10, 14, 22].map((d) => rect(d - 3, 10, 6, 18, C.white, 2, C.ink, 1.4)), ellipse(0, 4, 30, 16, C.white, C.ink, 2), ellipse(-6, 0, 7, 5, C.dark, null), ellipse(12, 8, 6, 4, C.dark, null), ellipse(-32, -6, 11, 10, C.white, C.ink, 2), ellipse(-38, 0, 5, 4, '#f2b6b6', C.ink, 1), circle(-34, -8, 1.4, C.ink, null), path('M-28 -14 L-24 -20 M-36 -14 L-40 -20', 'none', C.ink, 2), path('M30 0 C38 0 38 10 34 12', 'none', C.ink, 1.6), path('M6 18 C6 24 12 24 12 18', '#f2b6b6', C.ink, 1));

export const GROCERY_MOTIFS: Record<string, Svg> = {
  // ── Fågel och ägg (108) ─────────────────────────────────────────
  'livs.tupp': all(grass, bird('tupp', 56, 70, 1.3), bubble(98, 20, 30, T(98, 24, 'kuckeliku', 6, C.navy), true), line('M90 40 l4 -4 M96 44 l6 -2', HL, 1.6)),
  'livs.kyckling': all(plate(60, 88, 50), g('translate(30 72) rotate(-50)', drumstick(0, 0, 0, 0.7)), g('translate(90 72) rotate(-130) scale(1 -1)', drumstick(0, 0, 0, 0.7)), ellipse(60, 72, 30, 20, '#c97b3c', C.ink, 2), path('M40 66 C50 58 70 58 80 66', 'none', '#e0a458', 3), leafB(70, 92, -10, 0.8), leafB(48, 94, 190, 0.7), line('M50 40 C46 34 52 30 48 24 M70 40 C66 34 72 30 68 24', C.grey2, 2)),
  'livs.kalkon': all(grass, bird('kalkon', 62, 72, 1.25)),
  'livs.anka': all(rect(0, 76, 120, 44, '#8cc7e8', 0, null), line('M10 82 C20 78 30 86 40 82 M70 84 C80 80 90 88 100 84', '#5aa7d6', 2), bird('anka', 58, 76, 1.3), line('M4 76 L116 76', '#5aa7d6', 2)),
  'livs.gås': all(grass, bird('gås', 54, 82, 1.2)),
  'livs.grilla': all(grill(60, 70), ...[[42, 62], [60, 60], [78, 62]].map(([x, y]) => g(`translate(${x} ${y}) rotate(-8)`, rect(-8, -4, 16, 8, '#a8533a', 3, C.ink, 1.4), line('M-5 -4 L-2 4 M1 -4 L4 4', C.dark, 1))), flame(48, 74, 0.7), flame(72, 74, 0.7), line('M44 50 C40 42 48 38 44 30 M64 48 C60 40 68 36 64 28 M82 50 C78 42 86 38 82 30', C.grey2, 2)),
  'livs.vinge': all(bird('höna', 60, 76, 1.4), path('M42 76 C48 64 64 62 76 68 C68 74 58 80 44 80 Z', '#f2d28a', HL, 2.4)),
  'livs.lår': all(plate(60, 84, 46), drumstick(56, 72, -14, 1.5)),
  'livs.värpa': all(rect(10, 80, 100, 32, '#e6c48a', 6, C.ink, 2), line('M14 86 l6 -4 M30 84 l8 4 M60 86 l6 -4 M88 84 l8 4', '#b8925a', 1.4), bird('höna', 62, 70, 1.25), egg(30, 90, 0.9), line('M38 84 l6 -4 M40 92 l7 0', HL, 1.6)),
  'livs.kläcka': all(path('M30 92 C30 66 90 66 90 92 Z', '#f6ead8', C.ink, 2), path('M28 72 L40 64 L50 74 L60 62 L70 74 L80 64 L92 72 L90 92 L30 92 Z', 'none', C.ink, 0), path('M34 70 L42 62 L50 70 L58 60 L66 70 L74 62 L84 70', 'none', C.ink, 2), circle(60, 50, 16, C.yellow, C.ink, 2), circle(55, 46, 1.8, C.ink, null), circle(65, 46, 1.8, C.ink, null), path('M57 52 L63 52 L60 56 Z', C.orange, C.ink, 1), path('M30 92 C32 104 88 104 90 92 Z', '#f6ead8', C.ink, 2), path('M16 40 L24 34 L26 42 Z M98 44 L106 38 L106 48 Z', '#f6ead8', C.ink, 1.4)),
  'livs.äggula': all(friedEgg(60, 62, 1.8), path('M46 40 L54 52', 'none', HL, 0), arrow(96, 26, 70, 52, HL, 2.6)),
  'livs.äggvita': all(friedEgg(60, 62, 1.8), arrow(100, 28, 92, 50, HL, 2.6), arrow(20, 98, 28, 78, HL, 2.6)),
  'livs.hårdkokt': all(halfEgg(60, 56, 2.2, 'hard'), g('translate(98 26)', circle(0, 0, 12, C.white, C.ink, 1.6), line('M0 0 L0 -8 M0 0 L6 4', C.ink, 1.6)), T(98, 50, '10 min', 8, C.navy)),
  'livs.löskokt': all(rect(44, 74, 32, 30, C.yellow, 4, C.ink, 2), path('M44 74 C44 60 76 60 76 74', '#f2d28a', C.ink, 0), halfEgg(60, 62, 1.5, 'soft'), g('translate(98 26)', circle(0, 0, 12, C.white, C.ink, 1.6), line('M0 0 L0 -8 M0 0 L4 -6', C.ink, 1.6)), T(98, 50, '4 min', 8, C.navy)),
  'livs.bur': all(cage(60, 100, 64, 64), bird('höna', 60, 80, 0.8), rect(20, 100, 80, 8, C.dark, 2, C.ink, 1.6)),
  'livs.frigående': all(grass, rect(0, 0, 120, 96, '#eaf4fb', 0, null), line('M2 70 L118 70', C.brown, 2), ...[10, 40, 70, 100].map((x) => line(`M${x} 64 L${x} 96`, C.brown, 3)), grass, bird('höna', 40, 84, 0.8), bird('höna', 86, 90, 0.7), check(100, 24, 1.4)),
  // ── Fiskarter och skaldjur (109) ────────────────────────────────
  'livs.fiska': all(rect(0, 70, 120, 50, '#8cc7e8', 0, null), path('M8 66 L46 66 L42 76 L12 76 Z', C.brown, C.ink, 1.8), figure({ x: 28, h: 0.5, top: C.orange }), line('M36 52 L96 20', C.brown, 2.4), line('M96 20 L96 92', C.ink, 1), fish(96, 100, 0.4, '#8a9a6a', { bars: true }), line('M70 74 C76 70 82 78 88 74', '#5aa7d6', 1.6)),
  'livs.lax': all(fish(58, 54, 1.3, '#9aa8b8', { belly: '#e8ecf0', spots: true }), fillet(60, 96, 0.8, '#f4927a', '#fde3d8')),
  'livs.torsk': all(fish(58, 54, 1.3, '#a8a07a', { belly: '#f0ead8', spots: true }), fillet(60, 96, 0.8, '#f6f2ea', '#d8d4c8')),
  'livs.sill': all(...[[54, 34], [66, 60], [54, 86]].map(([x, y]) => fish(x!, y!, 0.75, '#5a7a9a', { belly: '#e8ecf0' }))),
  'livs.strömming': all(path('M8 74 C30 96 90 96 112 74 Z', C.grey, C.ink, 2), rect(4, 70, 112, 6, C.dark, 3, C.ink, 1.6), ...[[36, 72], [60, 76], [84, 72]].map(([x, y]) => fish(x!, y!, 0.42, '#c98a4a', { belly: '#e0a458' })), path('M10 30 C20 22 34 26 40 18', 'none', C.sky, 0), rect(8, 18, 104, 26, '#bfe3f5', 6, C.ink, 1.4), T(60, 36, 'Östersjön', 10, C.navy)),
  'livs.makrill': all(fish(58, 60, 1.35, '#3f6fb5', { belly: '#e8ecf0', stripes: '#1f3a6a' })),
  'livs.abborre': all(rect(0, 84, 120, 36, '#8cc7e8', 0, null), fish(60, 58, 1.3, '#9ab06a', { belly: '#f0ead8', bars: true, fin: '#e86a3a' })),
  'livs.skaldjur': all(plate(60, 82, 50), shrimp(36, 72, 0.9), crayfish(64, 70, 0.6), mussel(88, 78, 0.8, true), mussel(46, 90, 0.6)),
  'livs.räka': all(shrimp(58, 62, 2.2)),
  'livs.kräfta': all(crayfish(60, 66, 1.3)),
  'livs.hummer': all(crayfish(60, 70, 1.35, '#2f4a7a'), path('M40 16 C28 14 26 30 38 34 C42 28 40 24 46 24 C44 20 44 18 40 16 Z M80 16 C92 14 94 30 82 34 C78 28 80 24 74 24 C76 20 76 18 80 16 Z', '#2f4a7a', C.ink, 1.6), T(100, 106, '€€€', 9, C.green)),
  'livs.mussla': all(mussel(44, 74, 1.4, true), mussel(84, 64, 1.1), mussel(78, 94, 0.9)),
  'livs.rökt': all(fillet(60, 82, 1.2, '#e86a4a', '#fbd0c0'), path('M36 58 C28 46 40 40 32 26 M60 56 C52 44 64 38 56 24 M84 58 C76 46 88 40 80 26', 'none', C.grey, 3)),
  'livs.gravad': all(fillet(60, 74, 1.25, '#f4927a', '#fde3d8'), ...[[36, 66], [52, 62], [70, 64], [86, 70]].map(([x, y]) => all(line(`M${x} ${y} l6 -6`, '#4a7a3a', 1.6), line(`M${x! + 3} ${y! - 3} l-3 -4 M${x! + 3} ${y! - 3} l4 -2`, '#4a7a3a', 1.2))), ...[[30, 82], [48, 86], [74, 84], [92, 80]].map(([x, y]) => rect(x!, y!, 2.4, 2.4, C.white, 0, C.grey, 0.6))),
  'livs.inlagd': all(rect(32, 26, 56, 82, 'rgba(255,255,255,0.7)', 8, C.ink, 2), rect(36, 40, 48, 64, '#f6eec8', 6, null), rect(28, 16, 64, 12, C.red, 3, C.ink, 2), ...[50, 66, 82].map((y) => path(`M40 ${y} C52 ${y - 8} 68 ${y - 8} 80 ${y} C68 ${y + 6} 52 ${y + 6} 40 ${y} Z`, '#c9ced4', C.ink, 1.2)), ...[[48, 58], [70, 74], [56, 92]].map(([x, y]) => circle(x!, y!, 4, '#f6f2ea', '#c45', 1))),
  'livs.fiskpinne': all(plate(60, 84, 48), ...[-18, 0, 18].map((d, i) => g(`translate(${60 + d * 0.4} ${78 + i * 2 - 4}) rotate(${d})`, rect(-24, -6, 48, 12, '#e0a458', 3, C.ink, 1.8), ...[-16, -6, 4, 14].map((x) => circle(x, 0, 1, '#b8792a', null)))), path('M88 70 C96 62 104 66 100 74', '#f2c14e', C.ink, 1)),
  // ── Vegetariska proteinkällor (110) ─────────────────────────────
  'livs.vegetarisk': all(plate(60, 80, 46), ...[[44, 72, C.green], [58, 68, C.red], [72, 72, C.orange], [52, 80, '#e0d07a'], [68, 80, C.green]].map(([x, y, c]) => circle(x as number, y as number, 7, c as string, C.ink, 1.2)), leafBadge(96, 26, 16), g('translate(24 26)', circle(0, 0, 14, C.white, C.red, 2.4), fish(0, 0, 0.26, C.grey), line('M-10 -10 L10 10', C.red, 2.4))),
  'livs.vegetarian': all(ground, figure({ x: 46, top: C.green, hairStyle: 'long' }), plate(88, 76, 20), circle(84, 72, 5, C.green, C.ink, 1), circle(92, 72, 5, C.red, C.ink, 1), line('M56 64 L70 70', C.skin, 5), leafBadge(96, 24, 14)),
  'livs.vegan': all(ground, figure({ x: 46, top: C.mint }), leafBadge(96, 24, 14), g('translate(90 74)', ...[[egg(-14, 0, 0.6)], [g('translate(0 0)', rect(-6, -10, 12, 20, C.white, 3, C.ink, 1.4), rect(-6, -4, 12, 6, C.sky, 0, null))], [g('translate(14 0)', path('M-7 -8 L7 -8 L5 8 L-5 8 Z', '#f2c14e', C.ink, 1.4))]].map(([s]) => s as Svg)), line('M70 62 L110 88', C.red, 3)),
  'livs.vegansk': all(g('translate(56 74)', path('M-30 10 L30 10 L24 -14 L-24 -14 Z', '#c98a5a', C.ink, 2), path('M-24 -14 C-20 -26 20 -26 24 -14 Z', '#f6e7c8', C.ink, 1.8), circle(-8, -18, 3, C.red, C.ink, 1), circle(8, -20, 3, C.red, C.ink, 1)), badge(96, 30, 16, C.green, T(96, 34, 'V', 12, C.white))),
  'livs.köttfri': all(g('translate(60 58)', circle(0, 0, 40, C.white, C.red, 5), path('M-22 0 C-22 -16 -2 -20 8 -16 C22 -12 26 0 20 10 C12 20 -14 18 -20 10 C-22 6 -22 2 -22 0 Z', '#d46a6a', C.ink, 2), path('M-22 0 C-22 -16 -2 -20 8 -16 C2 -12 -8 -14 -16 -8 Z', '#f6ead8', C.ink, 1.2), line('M-28 -28 L28 28', C.red, 5))),
  'livs.växtbaserad': all(path('M60 104 C60 80 60 60 60 40', 'none', C.green, 3), leafB(60, 70, -150, 1.4), leafB(60, 56, -30, 1.4), leafB(60, 44, -150, 1.1), rect(30, 100, 60, 10, '#a0673d', 3, C.ink, 1.6), path('M24 30 L36 30 L30 18 Z', C.green, null), arrow(86, 30, 104, 30, HL, 2), g('translate(104 52)', rect(-10, -12, 20, 24, C.white, 3, C.ink, 1.6), rect(-10, -4, 20, 8, C.green, 0, null))),
  'livs.tofu': all(...[[44, 72], [72, 66], [60, 90]].map(([x, y]) => all(path(`M${x! - 16} ${y! - 8} L${x! + 8} ${y! - 14} L${x! + 18} ${y! - 6} L${x! + 18} ${y! + 10} L${x! - 6} ${y! + 16} L${x! - 16} ${y! + 8} Z`, '#f6f2e0', C.ink, 1.8), line(`M${x! - 16} ${y! - 8} L${x! - 6} ${y!} L${x! + 18} ${y! - 6} M${x! - 6} ${y!} L${x! - 6} ${y! + 16}`, C.ink, 1.2))), g('translate(96 26)', ellipse(0, 0, 12, 8, '#d8c27a', C.ink, 1.4), path('M-10 0 C-4 4 4 4 10 0', 'none', C.ink, 1))),
  'livs.falafel': all(plate(60, 84, 46), ...[[44, 72], [62, 68], [78, 74], [52, 84], [70, 84]].map(([x, y]) => all(circle(x!, y!, 9, '#9a6a2a', C.ink, 1.6), ...[[-3, -3], [3, 2], [-2, 4]].map(([a, b]) => circle(x! + a!, y! + b!, 1, '#4a7a3a', null)))), g('translate(96 28)', circle(-4, 0, 6, '#e0c87a', C.ink, 1.2), circle(4, 2, 6, '#e0c87a', C.ink, 1.2), circle(0, -6, 6, '#e0c87a', C.ink, 1.2))),
  'livs.halloumi': all(grill(60, 76), ...[44, 62, 80].map((x) => all(rect(x - 8, 58, 16, 16, '#f6f0d8', 3, C.ink, 1.6), line(`M${x - 6} 62 L${x + 6} 66 M${x - 6} 68 L${x + 6} 72`, '#8a5a2a', 2)))),
  'livs.burgare': all(burger(60, 66, 1.4, '#6a8a3a'), leafBadge(100, 22, 12)),
  'livs.marinera': all(path('M24 74 L96 74 C96 98 24 98 24 74 Z', C.white, C.ink, 2), ellipse(60, 74, 36, 6, '#c9873a', C.ink, 1.4), ...[44, 60, 76].map((x) => rect(x - 7, 66, 14, 12, '#f6f2e0', 2, C.ink, 1.2)), g('translate(88 34) rotate(30)', rect(-6, -20, 12, 30, '#3d2a1a', 3, C.ink, 1.6), rect(-3, -26, 6, 6, C.red, 1, C.ink, 1)), dropOil(76, 58, 0.8, '#3d2a1a'), dropOil(70, 50, 0.6, '#3d2a1a'), g('translate(30 40)', path('M-6 -4 C-6 -14 6 -14 6 -4 L4 10 L-4 10 Z', '#f6f2ea', C.ink, 1.4))),
  'livs.marinad': all(path('M30 60 L90 60 C90 100 30 100 30 60 Z', C.white, C.ink, 2.2), ellipse(60, 60, 30, 6, '#e0b84a', C.ink, 1.4), ...[[48, 62], [62, 60], [72, 63]].map(([x, y]) => circle(x!, y!, 2, C.green, null)), circle(56, 64, 2, C.red, null), g('translate(26 30)', circle(0, 0, 9, C.yellow, C.ink, 1.4), line('M-6 0 L6 0 M0 -6 L0 6', '#e0c040', 1)), g('translate(60 26)', path('M-6 6 C-10 -4 -2 -10 0 -12 C2 -10 10 -4 6 6 Z', '#f6f2ea', C.ink, 1.4)), dropOil(94, 26, 1.2)),
  'livs.avstå': all(ground, figure({ x: 34, top: C.green, hairStyle: 'long' }), line('M42 62 L56 54', C.skin, 5), path('M56 48 L62 46 L64 58 L58 60 Z', C.skin, C.ink, 1.4), plate(90, 80, 22), g('translate(90 72)', path('M-12 0 C-12 -8 0 -10 6 -8 C14 -6 16 0 12 4 C6 8 -8 8 -12 4 Z', '#d46a6a', C.ink, 1.4)), bubble(56, 9, 30, T(56, 13, 'Nej tack', 6, C.navy))),
  'livs.skäl': all(ground, figure({ x: 28, top: C.purple }), bubble(76, 24, 64, T(76, 28, 'Därför att …', 8, C.navy), true), ...[[60, 64, C.green], [76, 72, C.sky], [92, 64, C.red]].map(([x, y, c], i) => all(circle(x as number, y as number, 9, c as string, C.ink, 1.4), T(x as number, (y as number) + 4, `${i + 1}`, 9, C.white)))),
  'livs.lida': all(ground, cow(64, 74, 1.2), path('M20 66 C18 72 22 74 22 70 Z', C.sky, C.ink, 0.8), brokenHeart(96, 26, 1.4)),
};
