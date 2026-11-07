/**
 * Love and partnership (0.15, Relationer & familj → Kärlek & partnerskap): couples drawn with the
 * shared people helpers (people.ts) — hearts, rings, homes and everyday scenes for two.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { figure } from './figures';
import { HL, T, P, Q, ground, heart, mini, bubble, tableTop, bed } from './people';

const PINK = C.pink;
const butterfly = (x: number, y: number, s = 1, col: string = C.purple) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 -10 -14 -4 -10 2 C-12 8 -4 10 0 2 Z', col, C.ink, 1), path('M0 0 C8 -10 14 -4 10 2 C12 8 4 10 0 2 Z', col, C.ink, 1), line('M0 -4 L0 6', C.ink, 1.4));
const sparkle = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z', col, null));
const hearts = (pts: number[][], col: string = C.red) => all(...pts.map(([x, y, s]) => heart(x!, y!, s ?? 0.6, col)));
const flower = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 20', C.green, 2), ...[0, 72, 144, 216, 288].map((a) => circle(+(Math.cos((a * Math.PI) / 180) * 4).toFixed(1), +(Math.sin((a * Math.PI) / 180) * 4).toFixed(1), 3.4, col, C.ink, 0.8)), circle(0, 0, 2.4, C.yellow, null));
const magnet = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -16 L-14 2 C-14 22 14 22 14 2 L14 -16 L6 -16 L6 2 C6 12 -6 12 -6 2 L-6 -16 Z', C.red, C.ink, 1.8), rect(-14, -16, 8, 6, C.silver, 0, C.ink, 1.4), rect(6, -16, 8, 6, C.silver, 0, C.ink, 1.4));
const glass = (x: number, y: number, col: string) => all(path(`M${x - 6} ${y - 12} L${x + 6} ${y - 12} L${x} ${y} Z`, col, C.ink, 1.4), line(`M${x} ${y} L${x} ${y + 10} M${x - 5} ${y + 10} L${x + 5} ${y + 10}`, C.ink, 1.6));
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = C.gold) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${(x + Math.cos(a) * r1).toFixed(1)} ${(y + Math.sin(a) * r1).toFixed(1)} L${(x + Math.cos(a) * r2).toFixed(1)} ${(y + Math.sin(a) * r2).toFixed(1)}`, col, 2.4); }));

export const LOVE_MOTIFS: Record<string, Svg> = {
  // ── Förälskelse och attraktion ──────────────────────────────────
  'kär.bli-kär': all(ground, P(44, { top: C.pink }), hearts([[64, 34, 0.5], [76, 22, 0.7], [90, 10, 0.9]]), Q(96, { h: 0.84, top: C.sky })),
  'kär.förälskad': all(ground, P(60, { top: C.pink }), hearts([[38, 22, 0.7], [82, 20, 0.8], [46, 8, 0.5], [76, 6, 0.5]]), flower(72, 58, 1, C.red), line('M68 66 L72 72', C.skin, 5)),
  'kär.fjärilar-i-magen': all(ground, figure({ x: 60, top: C.white, hairStyle: 'long' }), butterfly(54, 70, 0.8, C.purple), butterfly(66, 80, 0.7, C.orange), butterfly(60, 62, 0.6, C.sky), butterfly(90, 40, 0.9, C.pink), butterfly(30, 46, 0.7, C.yellow)),
  'kär.kärlek-vid-första-ögonkastet': all(ground, P(24, { top: C.pink }), Q(96, { top: C.sky }), line('M34 24 L86 24', HL, 2, '3 3'), heart(60, 22, 1.2), sparkle(48, 10), sparkle(74, 12, 0.8), T(60, 48, '1', 12, HL)),
  'kär.falla-för': all(ground, heart(70, 82, 3.4, PINK), g('rotate(28 40 100)', figure({ x: 40, h: 0.8, top: C.orange })), line('M18 30 l-6 -4 M22 22 l-4 -6', C.grey2, 2)),
  'kär.crush': all(ground, figure({ x: 44, h: 0.86, top: C.purple, hairStyle: 'long' }), rect(4, 20, 34, 92, C.beige, 2, C.ink, 2), line('M4 40 L38 40 M4 60 L38 60 M4 80 L38 80 M4 100 L38 100 M20 20 L20 40 M12 40 L12 60 M28 60 L28 80 M20 80 L20 100', '#b7a07a', 1.4), heart(52, 16, 0.6), Q(92, { top: C.green })),
  'kär.attraktiv': all(ground, Q(60, { top: C.navy }), sparkle(36, 30), sparkle(86, 24, 1.2), sparkle(30, 64, 0.8), sparkle(92, 60, 0.9), hearts([[18, 18, 0.6], [104, 14, 0.6]])),
  'kär.utstrålning': all(rays(60, 50, 34, 48, 16), circle(60, 50, 32, 'rgba(242,193,78,0.25)', null), ground, P(60, { top: C.yellow })),
  'kär.attraktion': all(magnet(60, 30, 1.1), heart(60, 30, 0.6), line('M40 52 C38 60 44 64 40 70 M80 52 C82 60 76 64 80 70', HL, 1.8, '2 3'), mini(30, 96, C.orange, true), mini(90, 96, C.green), arrow(40, 86, 50, 86, HL, 2), arrow(80, 86, 70, 86, HL, 2)),
  'kär.gnista': all(ground, P(36, { top: C.pink }), Q(84, { top: C.sky }), line('M44 64 L54 60 M76 64 L66 60', C.skin, 5), rays(60, 58, 5, 14, 10, C.yellow), sparkle(60, 58, 1.2, C.orange), sparkle(50, 40, 0.7), sparkle(72, 44, 0.6)),
  'kär.flirta': all(ground, Q(32, { top: C.navy }), bubble(52, 9, 22, T(52, 13, ';)', 9, C.navy)), P(88, { top: C.pink }), circle(84, 26, 2.4, 'rgba(214,69,69,0.4)', null), circle(92, 26, 2.4, 'rgba(214,69,69,0.4)', null), heart(64, 40, 0.6)),
  'kär.flört': all(tableTop(86), glass(42, 74, C.red), glass(78, 74, C.yellow), mini(18, 72, C.orange, true), mini(102, 72, C.green), hearts([[60, 50, 0.6], [54, 36, 0.4], [66, 28, 0.5]], PINK)),
  'kär.ha-ett-gott-öga-till': all(ground, `<ellipse cx="34" cy="28" rx="22" ry="13" fill="${C.white}" stroke="${C.ink}" stroke-width="2"/>`, heart(34, 29, 0.9), Q(34, { h: 0.7, top: C.green }), P(94, { top: C.purple }), line('M54 32 L78 40', HL, 1.6, '3 3')),
  'kär.kärleksbrev': all(g('translate(60 66) rotate(-6)', rect(-38, -26, 76, 52, C.white, 3, C.ink, 2.2), path('M-38 -26 L0 4 L38 -26', 'none', C.ink, 1.8), circle(0, 4, 9, C.red, C.ink, 1.4), heart(0, 4, 0.5, C.white)), hearts([[24, 18, 0.6], [96, 22, 0.8], [104, 104, 0.5]], PINK)),
  'kär.förälskelse': all(ellipse(60, 92, 44, 16, C.rose, C.ink, 1.6), heart(60, 54, 3, C.red), sparkle(22, 30, 1.2), sparkle(98, 24), sparkle(96, 72, 0.8), sparkle(26, 70, 0.7)),
  'kär.kärlekskrank': all(bed(30), line('M38 68 L50 62', C.white, 3), circle(50, 62, 1.8, C.red, null), hearts([[60, 40, 0.7], [76, 30, 0.9], [94, 20, 1.1]], PINK), T(30, 46, '…', 12, C.grey)),
  'kär.betagen': all(ground, Q(28, { top: C.navy }), line('M36 62 L44 52', C.skin, 5), rect(42, 44, 6, 10, C.dark, 2, null), T(54, 30, '♪', 14, C.purple), T(68, 18, '♫', 12, C.purple), P(92, { top: C.pink }), circle(92, 28, 2.2, C.ink, null), hearts([[104, 12, 0.6], [80, 10, 0.5]])),
  'kär.obesvarad': all(ground, P(30, { top: C.pink, face: 'neutral' }), line('M38 64 L50 54', C.skin, 5), heart(56, 50, 1, C.red), `<g opacity="0.5">${figure({ x: 96, top: C.grey })}</g>`, line('M78 96 L88 96', C.grey2, 2.4), path('M90 96 l-5 -3 l0 6 Z', C.grey2, C.grey2, 1), T(96, 16, '…', 12, C.grey)),
};
