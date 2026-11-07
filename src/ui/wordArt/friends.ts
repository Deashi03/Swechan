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

const bubble = (x: number, y: number, w: number, inner: Svg, tailLeft = true): Svg => all(path(`M${x - w / 2} ${y - 11} L${x + w / 2} ${y - 11} L${x + w / 2} ${y + 9} L${tailLeft ? x - 4 : x + 8} ${y + 9} L${tailLeft ? x - 10 : x + 2} ${y + 16} L${tailLeft ? x - 9 : x + 1} ${y + 9} L${x - w / 2} ${y + 9} Z`, C.white, C.ink, 1.6), inner);
const phone = (x: number, y: number) => g(`translate(${x} ${y})`, rect(-9, -16, 18, 32, C.dark, 3, C.ink, 1.6), rect(-7, -12, 14, 22, '#bfe3f5', 1, null));
const note = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), `<ellipse cx="-2.5" cy="6" rx="3.4" ry="2.6" fill="${col}"/><ellipse cx="5.5" cy="4" rx="3.4" ry="2.6" fill="${col}"/>`);

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
  // ── Lära känna någon ────────────────────────────────────────────
  'vän.främling': all(ground, P(30, { face: 'neutral' }), `<g opacity="0.55">${figure({ x: 88, top: C.grey, hair: C.grey, face: 'neutral' })}</g>`, T(88, 22, '?', 16, HL)),
  'vän.nyinflyttad': all(ground, rect(78, 30, 34, 82, C.brown, 2, C.ink, 2), rect(82, 34, 26, 78, '#f6e7c8', 1, C.ink, 1.4), P(46, { top: C.purple }), ...[[18, 96], [18, 80], [62, 100]].map(([x, y]) => all(rect(x! - 9, y! - 8, 18, 16, C.tan, 1, C.ink, 1.6), line(`M${x! - 9} ${y! - 2} L${x! + 9} ${y! - 2}`, '#a0673d', 1.4))), T(95, 24, 'NY', 9, HL)),
  'vän.ta-kontakt': all(ground, P(34), Q(96, { top: C.sky, face: 'neutral' }), bubble(46, 20, 26, T(46, 24, 'Hej!', 9, C.navy)), path('M50 82 L70 82', 'none', HL, 2.6), path('M72 82 l-6 -4 l0 8 Z', HL, HL, 1)),
  'vän.ta-initiativ': all(ground, `<g opacity="0.45">${figure({ x: 22, top: C.grey2 })}${figure({ x: 98, top: C.grey2 })}</g>`, P(60, { top: C.orange }), line('M70 52 L80 30', C.skin, 5), T(90, 22, '!', 18, HL)),
  'vän.presentera-sig': all(ground, P(40), line('M46 66 L50 54', C.skin, 5), bubble(78, 26, 56, T(78, 30, 'Jag heter …', 9, C.navy))),
  'vän.kallprata': all(ground, P(28), Q(92, { top: C.sky }), bubble(40, 20, 22, g('translate(40 18)', circle(0, 0, 5, C.yellow, C.ink, 1))), bubble(84, 34, 22, g('translate(84 32)', path('M-7 2 C-9 2 -9 -4 -5 -4 C-5 -8 2 -8 3 -4 C7 -5 9 2 5 2 Z', C.grey2, C.ink, 1)), false)),
  'vän.isbrytare': all(rect(4, 64, 112, 50, '#8cc7e8', 10, null), path('M4 64 L44 64 L50 70 L56 64 L116 64 L116 76 L4 76 Z', C.white, C.ink, 1.4), path('M40 70 L52 62 L88 62 L92 52 L100 52 L100 62 L104 62 L98 78 L46 78 Z', C.red, C.ink, 2), rect(60, 48, 22, 14, C.white, 1, C.ink, 1.6), line('M38 64 l-6 -6 M40 70 l-8 2 M36 74 l-4 6', C.white, 2)),
  'vän.lära-känna': all(ground, P(32), Q(88, { top: C.sky }), bubble(46, 22, 18, T(46, 26, '?', 11, C.navy)), bubble(74, 34, 18, T(74, 38, '!', 11, C.navy), false), heart(60, 58, 0.8, C.pink)),
  'vän.ställa-frågor': all(ground, P(36), bubble(70, 22, 18, T(70, 26, '?', 11, C.navy)), bubble(94, 44, 18, T(94, 48, '?', 11, C.navy)), bubble(76, 64, 18, T(76, 68, '?', 11, C.navy))),
  'vän.gemensamt-intresse': all(ground, P(30, { top: C.white }), Q(90, { top: C.white }), ...[44, 76].map((x) => g(`translate(${x} 66)`, path('M-8 0 L8 0 C8 6 4 8 0 8 C-4 8 -8 6 -8 0 Z', C.grey, C.ink, 1.4), line('M8 1 L14 -1', C.ink, 2))), heart(60, 30, 1)),
  'vän.hitta-tonen': all(ground, P(30), Q(90, { top: C.sky }), note(50, 36), note(70, 28, 1.1, HL), note(60, 50, 0.8, C.purple)),
  'vän.personkemi': all(ground, P(28), Q(92, { top: C.sky }), g('translate(60 50)', path('M-6 -16 L6 -16 L6 -6 L14 12 C16 16 -16 16 -14 12 L-6 -6 Z', 'rgba(140,199,232,0.4)', C.ink, 1.8), path('M-12 8 L12 8 L14 12 C16 16 -16 16 -14 12 Z', HL, null)), ...[[48, 26], [72, 22], [60, 18]].map(([x, y]) => circle(x!, y!, 2.6, C.yellow, C.ink, 0.8))),
  'vän.göra-ett-gott-intryck': all(ground, P(32, { top: C.navy }), figure({ x: 90, top: C.lilac, hair: '#d3d6db', hairStyle: 'long' }), ...[0, 1, 2, 3, 4].map((i) => T(14 + i * 9, 18, '★', 10, C.gold)), line('M82 62 L76 46', C.skin, 5), circle(76, 44, 4, C.skin, C.ink, 1)),
  'vän.byta-nummer': all(phone(30, 60), phone(90, 60), path('M42 48 C54 40 66 40 78 48', 'none', HL, 2.4), path('M78 48 l-6 -1 l2 5 Z', HL, HL, 1), path('M78 72 C66 80 54 80 42 72', 'none', HL, 2.4), path('M42 72 l6 1 l-2 -5 Z', HL, HL, 1), T(30, 62, '07…', 6, C.navy), T(90, 62, '07…', 6, C.navy)),
  'vän.bjuda-in': all(rect(18, 34, 84, 56, C.white, 4, C.ink, 2.4), path('M18 34 L60 66 L102 34', 'none', C.ink, 2), heart(60, 76, 0.8), path('M66 14 L70 24 L80 24 L72 30 L75 40 L66 34 L57 40 L60 30 L52 24 L62 24 Z', C.yellow, C.ink, 1.2)),
  'vän.bekantskap': all(ground, P(40), Q(80, { top: C.sky }), line('M48 64 L58 60 M72 64 L62 60', C.skin, 5), rect(46, 18, 28, 14, HL, 6, null), T(60, 28, 'ny', 9, C.white)),
  'vän.stifta-bekantskap': all(ground, P(36, { top: C.purple }), Q(84, { top: C.navy }), line('M44 64 L58 60 M76 64 L62 60', C.skin, 5), bubble(82, 22, 52, T(82, 26, 'Angenämt!', 8, C.navy), false)),
  'vän.slå-följe': all(path('M0 112 L120 112 L120 102 C120 108 116 112 110 112 Z', C.grey2, null), path('M10 112 C40 100 80 100 110 112', 'none', C.grey2, 8), P(46, { h: 0.85 }), Q(70, { h: 0.88, top: C.sky }), path('M86 64 L104 64', 'none', HL, 2.6), path('M106 64 l-6 -4 l0 8 Z', HL, HL, 1), bubble(38, 20, 18, T(38, 24, '…', 10, C.navy))),
};
