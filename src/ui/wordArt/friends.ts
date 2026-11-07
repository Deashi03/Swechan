/**
 * Friendship (0.14, Relationer & familj → Vänskap): pairs and groups of figures (figures.ts)
 * with distance, gestures, hearts and circles that show how close people are.
 */
import { C, all, circle, g, line, path, rect, type Svg } from './kit';
import { figure, type Build } from './figures';

const HL = C.accent;
const T = (x: number, y: number, s: string, size: number, fill: string = C.ink, w = 800) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const P = (x: number, more: Partial<Build> = {}) => figure({ x, top: C.orange, hairStyle: 'long', ...more });
const Q = (x: number, more: Partial<Build> = {}) => figure({ x, top: C.green, ...more });
const ground = line('M4 112 L116 112', C.grey2, 2);
export const heart = (x: number, y: number, s = 1, fill: string = C.red): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', fill, C.ink, 1.4));
const bolt = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const arm = (x1: number, y1: number, x2: number, y2: number) => line(`M${x1} ${y1} L${x2} ${y2}`, C.skin, 5) + line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 0.6);
const mini = (x: number, y: number, col: string, long = false) => all(long ? path(`M${x - 7} ${y} C${x - 8} ${y + 8} ${x + 8} ${y + 8} ${x + 7} ${y} Z`, C.hair, null) : '', circle(x, y - 2, 6, C.skin, C.ink, 1.4), path(`M${x - 6} ${y - 4} C${x - 6} ${y - 11} ${x + 6} ${y - 11} ${x + 6} ${y - 4} C${x + 3} ${y - 7} ${x - 3} ${y - 7} ${x - 6} ${y - 4} Z`, C.hair, null), path(`M${x - 8} ${y + 12} C${x - 8} ${y + 4} ${x + 8} ${y + 4} ${x + 8} ${y + 12} Z`, col, C.ink, 1.2));

export const FRIEND_MOTIFS: Record<string, Svg> = {
  // ── Bekanta och vänner ──────────────────────────────────────────
  'vän.bästa-vän': all(ground, P(46), Q(76, { top: C.sky }), arm(54, 66, 68, 62), heart(61, 22, 1.1), T(60, 48, '1', 10, C.white)),
  'vän.bästis': all(ground, P(46, { top: C.pink }), P(76, { top: C.purple }), arm(54, 66, 68, 62), heart(52, 20, 0.7), heart(70, 16, 0.9), T(100, 30, '♥ ♥', 9, C.red)),
  'vän.nära-vän': all(ground, P(50), Q(72, { top: C.sky }), arm(56, 64, 66, 62), circle(61, 64, 40, 'none', HL, 2)),
  'vän.bekant': all(ground, P(26), Q(94, { top: C.sky }), line('M34 50 L42 36', C.skin, 5), line('M86 50 L78 36', C.skin, 5), line('M44 60 L76 60', C.grey2, 2, '4 4')),
  'vän.ytligt-bekant': all(ground, P(20), Q(100, { top: C.sky, face: 'neutral' }), line('M32 60 L88 60', C.grey2, 2, '2 6'), T(60, 50, '…', 14, C.grey)),
  'vän.barndomsvän': all(ground, figure({ x: 16, h: 0.5, top: C.yellow }), figure({ x: 34, h: 0.5, top: C.pink, hairStyle: 'long' }), path('M46 82 L64 82', 'none', HL, 2.6), path('M66 82 l-6 -4 l0 8 Z', HL, HL, 1), Q(82, { top: C.yellow, h: 0.88 }), P(104, { top: C.pink, h: 0.85 }), T(25, 40, '1995', 8, C.grey), T(93, 14, 'nu', 9, C.grey)),
  'vän.kamrat': all(ground, figure({ x: 34, h: 0.6, top: C.yellow }), figure({ x: 86, h: 0.6, top: C.sky, hairStyle: 'long' }), g('translate(60 92)', circle(0, 0, 8, C.red, C.ink, 1.6), path('M-8 0 C-3 -3 3 3 8 0', 'none', C.white, 1.4))),
  'vän.lagkamrat': all(ground, Q(30, { top: C.red }), Q(60, { top: C.red, hairStyle: 'long' }), Q(90, { top: C.red }), T(30, 74, '7', 10, C.white), T(60, 74, '10', 10, C.white), T(90, 74, '4', 10, C.white)),
  'vän.gäng': all(ground, P(18, { h: 0.85 }), Q(44, { h: 0.9, top: C.sky }), P(72, { h: 0.86, top: C.purple }), Q(100, { h: 0.88, top: C.yellow })),
  'vän.kompisgäng': all(ground, P(18, { h: 0.85 }), Q(44, { h: 0.9, top: C.sky }), P(72, { h: 0.86, top: C.purple }), Q(100, { h: 0.88, top: C.yellow }), arm(24, 62, 38, 62), arm(50, 62, 66, 62), arm(78, 62, 94, 62), path('M10 14 C40 2 80 2 110 14', 'none', HL, 2.4)),
  'vän.polare': all(ground, Q(34, { top: C.navy }), Q(86, { top: C.dark }), line('M42 60 L56 54', C.skin, 6), line('M78 60 L64 54', C.skin, 6), circle(60, 53, 5, C.skin, C.ink, 1.4), line('M54 42 l-3 -5 M60 40 l0 -6 M66 42 l3 -5', HL, 2)),
  'vän.vänkrets': all(circle(60, 60, 44, 'rgba(228,87,46,0.08)', HL, 2), mini(60, 60, C.purple, true), ...[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return mini(+(60 + Math.cos(a) * 34).toFixed(1), +(58 + Math.sin(a) * 34).toFixed(1), [C.orange, C.green, C.sky, C.pink, C.yellow][i]!, i % 2 === 0); })),
  'vän.umgängeskrets': all(circle(60, 60, 54, 'rgba(140,199,232,0.12)', C.sky, 2), circle(60, 60, 30, 'rgba(228,87,46,0.1)', HL, 2), mini(60, 60, C.purple, true), ...[0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 - Math.PI / 2; return mini(+(60 + Math.cos(a) * 20).toFixed(1), +(58 + Math.sin(a) * 20).toFixed(1), [C.orange, C.green, C.pink][i]!); }), ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return mini(+(60 + Math.cos(a) * 44).toFixed(1), +(58 + Math.sin(a) * 44).toFixed(1), C.grey2); })),
  'vän.jämnårig': all(ground, figure({ x: 38, h: 0.62, top: C.yellow }), figure({ x: 82, h: 0.62, top: C.sky, hairStyle: 'long' }), line('M20 40 L100 40', HL, 1.6, '3 3'), rect(28, 20, 20, 12, C.white, 4, C.ink, 1.2), T(38, 29, '9 år', 7), rect(72, 20, 20, 12, C.white, 4, C.ink, 1.2), T(82, 29, '9 år', 7)),
  'vän.vänskaplig': all(ground, P(40), Q(80, { top: C.sky }), line('M48 64 L58 60 M72 64 L62 60', C.skin, 5), T(60, 30, '☺', 16, HL)),
  'vän.ovän': all(ground, figure({ x: 30, top: C.orange, hairStyle: 'long', face: 'neutral' }), figure({ x: 90, top: C.sky, face: 'neutral' }), bolt(60, 44, 1.2), line('M44 30 l6 4 M76 30 l-6 4', HL, 2)),
  'vän.ha-mycket-gemensamt': all(circle(44, 62, 32, 'rgba(239,138,60,0.25)', C.orange, 2), circle(76, 62, 32, 'rgba(79,157,105,0.25)', C.green, 2), path('M60 34 A32 32 0 0 1 60 90 A32 32 0 0 1 60 34 Z', HL, C.ink, 1.4), T(60, 60, '♪', 14, C.white), T(60, 76, '☕', 10, C.white), mini(28, 56, C.orange, true), mini(92, 56, C.green)),
  'vän.vän-för-livet': all(rect(16, 84, 88, 6, C.brown, 2, C.ink, 1.6), line('M24 90 L24 104 M96 90 L96 104', C.brown, 3), figure({ x: 46, h: 0.82, hair: '#d3d6db', hairStyle: 'long', top: C.orange }), figure({ x: 74, h: 0.84, hair: '#d3d6db', top: C.green }), heart(60, 22, 1.1), T(60, 50, '∞', 14, HL)),
};
