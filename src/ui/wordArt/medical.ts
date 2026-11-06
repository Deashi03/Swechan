/**
 * Medical things, small diagrams and symbols for Kroppen & sinnena (0.13): aids (crutch, cast,
 * sling), injuries, blood, digestion, hormones, immune system, pain qualities. Builds on the
 * body kits (body.ts, limbs.ts, anatomy.ts, organs.ts, senses.ts).
 */
import { C, all, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { headFront, headProfile, skull } from './body';
import { handPalm, legSide, pointAt } from './limbs';
import { kneeJoint, tendon } from './anatomy';
import { organs, urinary } from './organs';
import { earSection } from './senses';
import { figure, forearm } from './figures';

const HL = C.accent;
const text = (x: number, y: number, s: string, size: number, fill: string = C.ink, weight = 800) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${weight}" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const glow = (cx: number, cy: number, r: number) => circle(cx, cy, r, 'rgba(228,87,46,0.28)', null);
const bolt = (x: number, y: number, s = 1, fill: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -10 L-6 2 L-1 2 L-4 12 L6 -2 L1 -2 L4 -10 Z', fill, C.ink, 1.4));
const moon = (x: number, y: number, r: number) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, C.yellow, C.ink, 1.6);
const sun = (x: number, y: number, r: number) => all(circle(x, y, r, C.yellow, C.ink, 1.6), line(`M${x} ${y - r - 3} l0 -4 M${x} ${y + r + 3} l0 4 M${x - r - 3} ${y} l-4 0 M${x + r + 3} ${y} l4 0`, C.gold, 2));
const virus = (x: number, y: number, r: number, fill = '#86b86a') => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${x + Math.cos(a) * r} ${y + Math.sin(a) * r} l${(Math.cos(a) * r * 0.45).toFixed(1)} ${(Math.sin(a) * r * 0.45).toFixed(1)}`, C.ink, 1.6); }), circle(x, y, r, fill, C.ink, 1.8), circle(x - r * 0.3, y - r * 0.2, r * 0.18, C.ink, null), circle(x + r * 0.3, y + r * 0.2, r * 0.15, C.ink, null));
const pill = (x: number, y: number, rot: number, c1: string = C.red, c2: string = C.white) => g(`translate(${x} ${y}) rotate(${rot})`, path('M-10 -5 L0 -5 L0 5 L-10 5 A5 5 0 0 1 -10 -5 Z', c1, C.ink, 1.6), path('M0 -5 L10 -5 A5 5 0 0 1 10 5 L0 5 Z', c2, C.ink, 1.6));
const hexagon = (x: number, y: number, r: number, fill: string) => path(Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return `${i ? 'L' : 'M'}${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`; }).join(' ') + ' Z', fill, C.ink, 1.8);
const molecule = (fill: string) => all(line('M38 60 L60 48 L82 60', C.ink, 2.4), hexagon(38, 62, 14, fill), hexagon(60, 48, 14, fill), hexagon(82, 62, 14, fill));
const lungsShape = (fill: string) => all(path('M54 26 L54 12 L66 12 L66 26', 'none', C.ink, 3), path('M54 30 C36 24 22 40 20 74 C30 80 44 80 54 74 Z', fill, C.ink, 2.4), path('M66 30 C84 24 98 40 100 74 C90 80 76 80 66 74 Z', fill, C.ink, 2.4));

// ── Injuries and aids ───────────────────────────────────────────────────────
export const swollenAnkle = (): Svg => all(legSide([]), ellipse(57, 94, 11, 8, '#f3a68a', C.ink, 2), line('M42 86 l-6 -4 M42 100 l-7 2 M72 86 l6 -4', HL, 2.4), pointAt([60, 94], [100, 74]));
export const inflamedJoint = (): Svg => all(kneeJoint([]), glow(60, 66, 30), bolt(100, 30, 1.1, HL));
export const kneePad = (): Svg => all(legSide([]), path('M60 40 C76 40 78 62 64 66 L56 64 C54 56 54 46 60 40 Z', C.navy, C.ink, 2.2), line('M58 44 L74 46 M58 60 L72 62', C.white, 1.6), pointAt([68, 52], [104, 30]));
export const tendonInflamed = (): Svg => all(tendon(['sena']), glow(86, 62, 18), bolt(104, 24, 1, HL));
export function mouseArm(): Svg {
  return all(rect(0, 92, 120, 28, C.tan, 0, C.ink, 2), forearm(''), ellipse(106, 84, 12, 8, C.grey2, C.ink, 2), line('M106 76 L106 84', C.ink, 1.4), glow(48, 62, 26), bolt(48, 30, 1, HL));
}
export const angleArc = (): Svg => all(line('M20 100 L60 100', C.ink, 8), line('M20 100 L60 100', '#f3ead6', 5.4), line('M60 100 L60 40', C.ink, 8), line('M60 100 L60 40', '#f3ead6', 5.4), circle(60, 100, 6, HL, C.ink, 1.8), path('M40 100 A20 20 0 0 1 60 80', 'none', HL, 3), text(86, 72, '90°', 18, HL));
export function brokenBone(xray = false): Svg {
  const boneC = xray ? '#e9f2ff' : '#f3ead6', ink = xray ? '#9fb7d9' : C.ink;
  const halfA = 'M26 18 C18 10 30 0 38 8 C42 4 52 6 50 16 L60 50 L54 54 L48 46 L44 56 Z', halfB = 'M62 58 L70 54 L74 62 L80 66 L84 98 C92 98 98 110 90 114 C86 120 74 118 74 110 C68 112 60 106 64 98 Z';
  return all(xray ? rect(4, 4, 112, 112, '#1f2d44', 14, null) : '', path(halfA, boneC, ink, 2.4), path(halfB, boneC, ink, 2.4), line('M50 52 L58 50 L54 58 L62 56', xray ? '#ffffff' : HL, 2.4), xray ? '' : bolt(96, 30, 1, HL));
}
export const sprain = (): Svg => all(legSide([]), ellipse(57, 96, 9, 6, '#f3a68a', C.ink, 1.8), path('M36 112 C30 98 34 86 44 82', 'none', HL, 3), path('M44 82 l-7 0 l3 6 Z', HL, HL, 1), bolt(84, 82, 0.9, HL));
export const strainedMuscle = (torn: boolean): Svg => all(
  torn ? path('M10 40 C30 30 50 32 56 44 L50 52 L56 60 C50 72 30 72 10 64 Z', '#e9a98b', C.ink, 2.4) : path('M10 40 C40 28 80 28 110 40 L110 64 C80 76 40 76 10 64 Z', '#e9a98b', C.ink, 2.4),
  torn ? path('M110 40 C90 30 70 32 64 44 L70 52 L64 60 C70 72 90 72 110 64 Z', '#e9a98b', C.ink, 2.4) : line('M20 44 C50 38 70 38 100 44 M20 58 C50 64 70 64 100 58', C.ink, 1),
  torn ? line('M58 46 L62 50 L58 54 L62 58', HL, 2.4) : all(line('M6 52 L22 52 M98 52 L114 52', HL, 3), path('M6 52 l6 -4 l0 8 Z M114 52 l-6 -4 l0 8 Z', HL, HL, 1)),
  bolt(60, 92, 1.1, HL));
export const xray = (): Svg => all(rect(14, 6, 92, 108, '#1f2d44', 8, C.ink, 2.4), g('translate(60 60) scale(0.78) translate(-60 -60)', skull().replace(new RegExp(C.beige, 'g'), '#e9f2ff')), circle(98, 14, 3, C.mint, null));
export const cast = (applying = false): Svg => all(legSide([]), path(applying ? 'M44 64 L66 64 C66 76 64 84 62 92 L52 92 C48 84 44 76 44 64 Z' : 'M43 58 L68 58 C68 72 64 86 64 92 C72 96 92 98 98 104 C100 110 96 112 92 112 L50 112 C44 112 44 100 48 90 C44 80 42 70 43 58 Z', C.white, C.ink, 2.4),
  line(applying ? 'M45 70 L66 70 M45 78 L65 78 M47 86 L63 86' : 'M44 66 L68 66 M44 76 L66 76 M46 86 L64 86 M60 100 L90 104', C.grey2, 1.6),
  applying ? all(rect(66, 50, 18, 14, C.white, 4, C.ink, 2), path('M30 40 C40 36 50 40 54 50 L50 56 C44 48 36 46 30 48 Z', C.skin, C.ink, 2), path('M92 40 C82 36 72 40 68 50 L72 56 C78 48 86 46 92 48 Z', C.skin, C.ink, 2)) : '');
export const crutch = (): Svg => g('rotate(-12 60 60)', path('M48 10 L72 10 C76 10 76 18 72 18 L48 18 C44 18 44 10 48 10 Z', C.grey, C.ink, 2), line('M50 18 L56 96 M70 18 L64 96', C.silver, 5), line('M50 18 L56 96 M70 18 L64 96', C.ink, 1), rect(50, 52, 20, 6, C.dark, 2, C.ink, 1.6), line('M60 96 L60 114', C.silver, 5), rect(55, 112, 10, 6, C.dark, 2, C.ink, 1.4));
export const sling = (): Svg => all(figure({ top: C.sky }), path('M50 46 L70 46 L66 70 L44 64 Z', C.white, C.ink, 2.2), line('M50 46 L64 30 M70 46 L56 30', C.white, 3), line('M50 46 L64 30 M70 46 L56 30', C.ink, 0.8), pointAt([58, 58], [104, 84]));
export const elasticBandage = (): Svg => all(legSide([]), path('M43 40 L70 40 L68 64 L44 64 Z', '#e8c9a0', C.ink, 2), line('M44 46 L69 44 M44 52 L69 50 M44 58 L68 56', '#c9a77a', 1.6), pointAt([66, 52], [104, 30]));

// ── Lungs and airways ───────────────────────────────────────────────────────
export const alveoli = (): Svg => all(line('M60 0 L60 30 M60 30 L40 50 M60 30 L80 50', '#cfd8e6', 6), ...[[34, 60], [46, 66], [40, 76], [28, 72], [74, 60], [86, 66], [80, 76], [92, 72], [60, 80]].map(([x, y]) => circle(x!, y!, 9, '#f4b6b6', C.ink, 1.8)), circle(60, 80, 9, HL, C.ink, 1.8), line('M30 92 C50 100 70 100 90 92', MUTE_RED, 3), line('M30 98 C50 106 70 106 90 98', MUTE_BLUE, 3));
const MUTE_RED = '#d64545', MUTE_BLUE = '#4a78c2';
export const inhaler = (): Svg => all(path('M40 20 L64 20 L64 74 L40 74 Z', C.sky, C.ink, 2.4), path('M40 70 L92 70 L92 92 L52 92 C44 92 40 86 40 80 Z', C.navy, C.ink, 2.4), rect(44, 8, 16, 14, C.white, 3, C.ink, 2), line('M96 76 l10 -4 M96 82 l12 0 M96 88 l10 4', '#8cc7e8', 2.4));
export const pneumonia = (): Svg => all(lungsShape('#f4b6b6'), ...[[34, 50], [40, 62], [30, 64], [84, 48], [88, 62], [78, 58]].map(([x, y]) => circle(x!, y!, 3.6, '#c0392b', null)), glow(60, 54, 40), bolt(104, 18, 1, HL));
export const lungCapacity = (): Svg => all(lungsShape('#f4b6b6'), path('M22 74 C30 80 44 80 54 74 L54 50 L22 50 Z', '#8cc7e8', null, 0), path('M66 74 C76 80 90 80 98 74 L98 50 L66 50 Z', '#8cc7e8', null, 0), lungsShape('none'), line('M16 50 L104 50', HL, 2, '4 3'), path('M108 90 L108 30', 'none', C.ink, 2), path('M108 30 l-4 6 l8 0 Z', C.ink, C.ink, 1));
export function smoker(): Svg {
  return all(headProfile([]), line('M90 78 L112 74', C.white, 4), line('M90 78 L112 74', C.ink, 0.8), circle(112, 74, 2, C.orange, null), path('M112 70 C108 62 116 56 110 48 C106 42 112 36 108 30', 'none', C.grey, 2.4));
}
export const appendicitis = (): Svg => all(organs(['blindtarm']), glow(33, 114, 14), bolt(12, 96, 0.9, HL));

// ── Liver, kidneys, poisons ─────────────────────────────────────────────────
export const poison = (): Svg => all(path('M46 10 L74 10 L74 24 C88 30 92 40 92 54 L92 104 C92 110 88 114 82 114 L38 114 C32 114 28 110 28 104 L28 54 C28 40 32 30 46 24 Z', '#86b86a', C.ink, 2.4), rect(44, 4, 32, 10, C.dark, 3, C.ink, 2),
  g('translate(60 72) scale(0.42) translate(-60 -60)', skull()), line('M40 96 L80 110 M80 96 L40 110', C.white, 4), line('M40 96 L80 110 M80 96 L40 110', C.ink, 1));
export const detox = (): Svg => all(path('M22 44 C44 34 70 36 80 44 C74 58 58 70 36 72 C26 70 18 58 22 44 Z', '#b5654a', C.ink, 2.4), ...[[6, 40], [12, 56], [4, 64]].map(([x, y]) => circle(x!, y!, 4, C.dark, C.ink, 1)), line('M84 56 L100 56', C.ink, 2.4), path('M100 56 l-6 -4 l0 8 Z', C.ink, C.ink, 1), path('M108 46 C112 52 112 56 108 58 C104 56 104 52 108 46 Z', C.sky, C.ink, 1.4), star(60, 96, 8, C.yellow));
export const bile = (): Svg => all(path('M40 30 C40 16 66 16 70 30 C74 46 62 70 52 74 C42 70 36 46 40 30 Z', '#86b86a', C.ink, 2.4), path('M88 60 C96 72 96 82 88 86 C80 82 80 72 88 60 Z', '#9bc46a', C.ink, 2), path('M88 66 C92 72 92 78 88 80', 'none', C.white, 1.6), line('M56 74 C60 86 72 92 82 88', '#86b86a', 3));
export const insulinPen = (): Svg => g('rotate(-30 60 60)', rect(24, 50, 70, 18, C.sky, 8, C.ink, 2.4), rect(56, 54, 22, 10, C.white, 2, C.ink, 1.4), line('M60 56 L60 62 M64 56 L64 60 M68 56 L68 62 M72 56 L72 60', C.ink, 1), rect(94, 54, 10, 10, C.grey, 2, C.ink, 1.6), line('M104 59 L114 59', C.ink, 1.6), rect(12, 54, 12, 10, C.navy, 3, C.ink, 1.6));
export const bloodTest = (): Svg => all(rect(20, 14, 18, 84, C.white, 9, C.ink, 2.4), path('M22 50 L36 50 L36 88 C36 96 22 96 22 88 Z', '#c0392b', null), rect(18, 8, 22, 10, '#9a5fa8', 3, C.ink, 2), rect(52, 30, 58, 70, C.white, 4, C.ink, 2), ...[[60, 80, 12], [72, 70, 22], [84, 54, 38], [96, 76, 16]].map(([x, y, h], i) => rect(x!, y!, 8, h!, i === 2 ? HL : C.sky, 1, C.ink, 1.2)));
export const urineCup = (label = false): Svg => all(path('M34 36 L86 36 L80 108 C80 112 76 114 72 114 L48 114 C44 114 40 112 40 108 Z', 'rgba(255,255,255,0.75)', C.ink, 2.4), path('M38 60 L82 60 L80 108 C80 112 76 114 72 114 L48 114 C44 114 40 112 40 108 Z', '#f2d27a', null), rect(30, 26, 60, 12, label ? C.red : C.white, 3, C.ink, 2.2), label ? all(rect(44, 70, 32, 18, C.white, 2, C.ink, 1.4), line('M48 76 L72 76 M48 82 L64 82', C.grey, 1.6)) : '');
export const bladderInfection = (): Svg => all(urinary(['urinblåsa']), glow(60, 96, 20), ...[[52, 94], [62, 100], [68, 92]].map(([x, y]) => ellipse(x!, y!, 3, 1.8, C.green, C.ink, 0.8)), bolt(98, 100, 0.8, HL));
export const dialysis = (): Svg => all(rect(60, 20, 46, 86, C.white, 6, C.ink, 2.4), rect(68, 30, 30, 18, '#d8eef8', 3, C.ink, 1.6), circle(76, 66, 6, C.grey2, C.ink, 1.4), circle(92, 66, 6, C.grey2, C.ink, 1.4), path('M10 100 C10 80 20 76 34 76 L44 76', 'none', C.skin, 12), path('M10 100 C10 80 20 76 34 76 L44 76', 'none', C.ink, 1), line('M42 72 C50 62 56 66 76 66', MUTE_RED, 2.6), line('M42 80 C54 90 60 80 92 66', MUTE_BLUE, 2.6));
export const donate = (): Svg => all(path('M14 88 C30 76 46 78 56 86 L56 104 L14 104 Z', C.skin, C.ink, 2.2), path('M106 88 C90 76 74 78 64 86 L64 104 L106 104 Z', C.skin, C.ink, 2.2), path('M44 40 C44 28 58 26 60 38 C62 26 76 28 76 40 C76 54 60 64 60 72 C60 64 44 54 44 42 Z', C.red, C.ink, 2.2));
export const waterBalance = (): Svg => all(line('M60 20 L60 104 M30 104 L90 104', C.ink, 3), line('M20 40 L100 40', C.ink, 3), line('M24 40 L16 70 M24 40 L32 70 M96 40 L88 70 M96 40 L104 70', C.ink, 1.4), path('M10 70 L38 70 C36 80 12 80 10 70 Z', C.grey2, C.ink, 1.8), path('M82 70 L110 70 C108 80 84 80 82 70 Z', C.grey2, C.ink, 1.8), path('M24 50 C28 58 28 64 24 66 C20 64 20 58 24 50 Z', C.sky, C.ink, 1.4), path('M96 50 C100 58 100 64 96 66 C92 64 92 58 96 50 Z', C.sky, C.ink, 1.4), circle(60, 20, 4, C.ink, null));

// ── Reproduction ────────────────────────────────────────────────────────────
export const family = (): Svg => all(line('M6 112 L114 112', C.grey2, 2), figure({ x: 30, top: C.green }), figure({ x: 90, hairStyle: 'long', top: C.orange }), figure({ x: 60, h: 0.55, top: C.yellow }));
export const sexSymbols = (): Svg => all(circle(40, 66, 18, 'none', HL, 5), line('M40 84 L40 108 M30 98 L50 98', HL, 5), circle(80, 54, 18, 'none', C.navy, 5), line('M93 41 L108 26 M96 26 L108 26 L108 38', C.navy, 5));
export const underwear = (): Svg => all(path('M14 30 L106 30 L106 46 C90 50 76 66 72 92 L48 92 C44 66 30 50 14 46 Z', HL, C.ink, 2.6), line('M14 38 L106 38', C.white, 2), path('M14 46 C30 50 44 66 48 92 L14 92 Z M106 46 C90 50 76 66 72 92 L106 92 Z', C.skin, C.ink, 2));
export const contraception = (): Svg => all(rect(14, 24, 60, 76, C.silver, 8, C.ink, 2.2), ...Array.from({ length: 12 }, (_, i) => circle(26 + (i % 3) * 18, 38 + Math.floor(i / 3) * 18, 6, i < 5 ? C.grey2 : C.white, C.ink, 1.4)), rect(80, 50, 32, 32, '#c7b3e6', 4, C.ink, 2), circle(96, 66, 9, 'none', C.ink, 1.6));

// ── Sight and hearing ───────────────────────────────────────────────────────
function treeIcon(x: number, y: number, s: number, op = 1): Svg { return `<g opacity="${op}">${g(`translate(${x} ${y}) scale(${s})`, rect(-3, 0, 6, 20, C.brown, 1, C.ink, 1.6), circle(0, -6, 14, C.green, C.ink, 1.8))}</g>`; }
function bookIcon(x: number, y: number, op = 1): Svg { return `<g opacity="${op}">${all(path(`M${x - 24} ${y} L${x} ${y + 6} L${x + 24} ${y} L${x + 24} ${y + 26} L${x} ${y + 32} L${x - 24} ${y + 26} Z`, C.white, C.ink, 2), line(`M${x} ${y + 6} L${x} ${y + 32} M${x - 18} ${y + 8} l14 4 M${x - 18} ${y + 14} l14 4 M${x + 4} ${y + 12} l14 -4 M${x + 4} ${y + 18} l14 -4`, C.ink, 1.2))}</g>`; }
const blurred = (s: Svg) => `<g opacity="0.35">${s}</g><g opacity="0.35" transform="translate(3 1)">${s}</g><g opacity="0.25" transform="translate(-3 -1)">${s}</g>`;
export const nearSighted = (): Svg => all(blurred(treeIcon(86, 26, 1)), bookIcon(40, 74));
export const farSighted = (): Svg => all(treeIcon(86, 26, 1), blurred(bookIcon(40, 74)));
export const eyeDoctor = (): Svg => all(rect(76, 10, 34, 50, C.white, 3, C.ink, 2), ...[[93, 20, 8], [88, 32, 5], [98, 32, 5], [86, 42, 3.4], [93, 42, 3.4], [100, 42, 3.4]].map(([x, y, s]) => rect(x! - s! / 2, y! - s! / 2, s!, s!, C.ink, 1, null)), figure({ x: 40, top: C.white }));
export const whiteCane = (): Svg => all(figure({ x: 46, top: C.navy }), rect(37, 21, 18, 5, C.dark, 2, null), line('M62 76 L96 112', C.white, 4), line('M62 76 L96 112', C.ink, 0.8), line('M90 105 L96 112', C.red, 4));
export function colorBlindTest(): Svg {
  const out: Svg[] = [circle(60, 60, 50, C.white, C.ink, 2)];
  for (let i = 0; i < 120; i++) { const a = i * 2.39996, r = 46 * Math.sqrt(i / 120); const x = 60 + Math.cos(a) * r, y = 60 + Math.sin(a) * r; const inSeven = (y < 44 && x > 42 && x < 80) || (Math.abs((x - 74) + (y - 44) * 0.45) < 6 && y >= 40 && y < 92); out.push(circle(+x.toFixed(1), +y.toFixed(1), 3.6 + (i % 3) * 0.6, inSeven ? '#d68a4f' : '#8fb06a', null)); }
  return all(...out);
}
export const earPain = (): Svg => all(earSection(['mellanöra']), bolt(78, 24, 1.2, HL));
export const blockedEar = (): Svg => all(earSection([], undefined, { plug: true }), line('M2 50 C8 56 8 64 2 70', C.grey2, 2.4), line('M2 40 C14 52 14 68 2 80', C.grey2, 2.4), bolt(104, 104, 0.8, C.grey));
export const earPressure = (): Svg => all(earSection(['trumhinna']), ...[[50, 30], [50, 90]].map(([x, y]) => line(`M${x} ${y} L62 ${y! < 60 ? 50 : 70}`, HL, 3)), path('M98 14 l14 -6 l-4 8 l6 2 l-16 0 Z', C.grey2, C.ink, 1.4));
export const radioNoise = (): Svg => all(rect(16, 30, 88, 64, C.dark, 8, C.ink, 2.4), rect(24, 38, 54, 48, C.grey2, 3, C.ink, 1.6), ...Array.from({ length: 60 }, (_, i) => rect(26 + (i * 37) % 50, 40 + (i * 53) % 44, 3, 2, i % 2 ? C.white : C.dark, 0, null)), circle(92, 52, 6, C.grey, C.ink, 1.4), circle(92, 74, 6, C.grey, C.ink, 1.4), line('M108 40 C114 46 114 54 108 60 M112 34 C120 44 120 56 112 66', C.grey, 2));
export const echo = (): Svg => all(path('M60 112 L84 44 L96 64 L104 50 L120 112 Z', C.grey, C.ink, 2.2), path('M84 44 L78 60 L90 58 Z', C.white, null), figure({ x: 18, h: 0.6, top: C.orange }), ...[0, 1, 2].map((i) => line(`M${34 + i * 12} ${60 - i * 4} q4 6 0 12`, C.navy, 2.4 - i * 0.6)), ...[0, 1, 2].map((i) => line(`M${72 - i * 12} ${66 + i * 4} q-4 6 0 12`, HL, 2.4 - i * 0.6)));
export const hearingImpaired = (): Svg => all(g('translate(120 0) scale(-1 1)', headProfile([])), path('M60 48 C70 46 72 58 66 62 L62 64 Z', HL, C.ink, 2), ...[0, 1, 2].map((i) => line(`M${30 - i * 8} ${48 - i * 4} q6 10 0 20`, i === 2 ? C.grey2 : C.navy, 2.4, i === 2 ? '3 3' : undefined)));
export const scaldingHot = (): Svg => all(path('M14 70 L106 70 C104 92 86 104 60 104 C34 104 16 92 14 70 Z', C.white, C.ink, 2.4), path('M18 70 L102 70', 'none', C.ink, 2), line('M40 58 C34 48 46 42 40 30 M60 56 C54 44 66 38 60 24 M80 58 C74 48 86 42 80 30', HL, 3), rect(98, 14, 10, 40, C.white, 5, C.ink, 2), path('M100 30 L106 30 L106 50 L100 50 Z', C.red, null), circle(103, 54, 6, C.red, C.ink, 1.8));

// ── Senses (overview) ───────────────────────────────────────────────────────
const eyeMini = (x: number, y: number) => all(path(`M${x - 12} ${y} Q${x} ${y - 10} ${x + 12} ${y} Q${x} ${y + 10} ${x - 12} ${y} Z`, C.white, C.ink, 1.8), circle(x, y, 4, C.navy, null));
const earMini = (x: number, y: number) => path(`M${x - 4} ${y - 12} C${x + 10} ${y - 14} ${x + 12} ${y + 2} ${x + 2} ${y + 6} C${x} ${y + 12} ${x - 6} ${y + 12} ${x - 6} ${y + 6} C${x - 10} ${y - 2} ${x - 10} ${y - 10} ${x - 4} ${y - 12} Z`, C.skin, C.ink, 1.8);
const noseMini = (x: number, y: number) => path(`M${x} ${y - 12} C${x - 2} ${y - 2} ${x - 10} ${y + 6} ${x - 6} ${y + 10} C${x - 2} ${y + 12} ${x + 4} ${y + 12} ${x + 8} ${y + 8} C${x + 6} ${y} ${x + 2} ${y - 6} ${x} ${y - 12} Z`, C.skin, C.ink, 1.8);
const tongueMini = (x: number, y: number) => path(`M${x - 10} ${y - 6} L${x + 10} ${y - 6} L${x + 10} ${y + 2} C${x + 10} ${y + 14} ${x - 10} ${y + 14} ${x - 10} ${y + 2} Z`, '#f08a8a', C.ink, 1.8);
const handMini = (x: number, y: number) => g(`translate(${x - 60} ${y - 60}) scale(1)`, g('translate(60 60) scale(0.3) translate(-60 -70)', handPalm([])));
export const fiveSenses = (): Svg => all(circle(60, 60, 14, HL, C.ink, 2), text(60, 66, '5', 16, C.white), eyeMini(60, 18), earMini(100, 50), noseMini(86, 96), tongueMini(34, 96), handMini(20, 52));
export const impressions = (): Svg => all(headProfile([]), ...[[110, 20, 'eye'], [112, 60, 'ear'], [108, 100, 'nose']].map(([x, y, k]) => (k === 'eye' ? eyeMini(x as number, y as number) : k === 'ear' ? earMini(x as number, y as number) : noseMini(x as number, y as number))), line('M96 22 L84 34 M98 60 L92 60 M96 96 L88 84', HL, 2.4));
export const sixthSense = (): Svg => all(headFront([], { eyesClosed: true, smile: true }), path('M60 30 Q70 36 60 42 Q50 36 60 30 Z', HL, C.ink, 1.4), circle(60, 36, 2, C.ink, null), star(24, 20, 6, C.yellow), star(98, 16, 5, C.yellow), star(104, 40, 4, C.yellow));

// ── Breathing and blood ─────────────────────────────────────────────────────
export const breath = (kind: 'andetag' | 'in' | 'ut'): Svg => all(lungsShape(kind === 'ut' ? '#f8d0d0' : '#f4b6b6'),
  kind === 'andetag' ? all(path('M60 98 m-22 0 a22 10 0 1 0 44 0 a22 10 0 1 0 -44 0', 'none', HL, 2.6), path('M82 98 l-4 -6 l-3 7 Z', HL, HL, 1)) : '',
  kind === 'in' ? all(line('M82 4 L66 18', HL, 3), path('M66 18 l1 -8 l6 5 Z', HL, HL, 1), line('M30 40 C36 50 36 60 32 66', HL, 2, '3 3'), line('M90 40 C84 50 84 60 88 66', HL, 2, '3 3')) : '',
  kind === 'ut' ? all(line('M66 18 L82 4', HL, 3), path('M82 4 l-8 1 l3 6 Z', HL, HL, 1)) : '');
export const co2 = (): Svg => all(circle(60, 56, 16, C.dark, C.ink, 2), circle(30, 56, 13, C.red, C.ink, 2), circle(90, 56, 13, C.red, C.ink, 2), line('M43 52 L44 52 M43 60 L44 60 M76 52 L77 52 M76 60 L77 60', C.ink, 3), text(60, 104, 'CO₂', 22, C.navy));
export const oxygenate = (): Svg => all(ellipse(70, 70, 26, 18, '#d64545', C.ink, 2.2), ellipse(70, 70, 10, 6, '#b03030', null), ...[[20, 30], [34, 22], [28, 44]].map(([x, y]) => all(circle(x!, y!, 7, C.white, C.navy, 1.6), text(x!, y! + 3, 'O', 8, C.navy))), line('M38 40 L50 54', HL, 2.4), path('M50 54 l-7 -1 l4 -5 Z', HL, HL, 1));
export const bpCuff = (high = false): Svg => all(path('M10 70 L80 64 L80 96 L10 100 Z', C.skin, C.ink, 2.2), rect(30, 62, 30, 38, C.navy, 4, C.ink, 2), line('M44 62 C44 40 70 30 80 36', C.ink, 2), circle(90, 34, 20, C.white, C.ink, 2.4), path('M76 40 A16 16 0 0 1 104 40', 'none', C.green, 4), path('M96 24 A16 16 0 0 1 104 40', 'none', C.red, 4), line(high ? 'M90 34 L102 28' : 'M90 34 L80 26', C.ink, 2.4), circle(90, 34, 2.4, C.ink, null), high ? all(line('M108 66 L108 50', HL, 3), path('M108 46 l-5 7 l10 0 Z', HL, HL, 1)) : '');
export const restingPulse = (): Svg => all(path('M44 22 C44 12 58 10 60 22 C62 10 76 12 76 24 C76 38 60 48 60 56 C60 48 44 38 44 26 Z', C.red, C.ink, 2.2), rect(8, 70, 104, 36, C.dark, 6, C.ink, 2), line('M12 90 L36 90 L40 82 L44 98 L48 90 L84 90 L88 82 L92 98 L96 90 L108 90', C.mint, 2.4));
export const bloodCells = (which: 'röd' | 'vit' | 'plätt'): Svg => all(rect(4, 4, 112, 112, '#fbe3dc', 14, null),
  ...[[24, 30], [86, 24], [30, 88], [92, 86], [60, 100]].map(([x, y]) => all(ellipse(x!, y!, 14, 10, which === 'röd' ? HL : '#e57373', C.ink, 1.8), ellipse(x!, y!, 6, 3.6, which === 'röd' ? '#b03a1a' : '#c75050', null))),
  all(circle(60, 56, 18, which === 'vit' ? HL : '#f3f0ff', C.ink, 2), path('M52 52 C54 44 64 46 62 54 C68 56 64 64 58 62 C54 66 48 60 52 52 Z', '#a48ad1', C.ink, 1.2)),
  ...[[40, 60], [84, 54], [70, 80], [46, 30]].map(([x, y]) => ellipse(x!, y!, 4, 2.6, which === 'plätt' ? HL : '#f2c14e', C.ink, 1.2)));
export const bloodTypes = (): Svg => all(...['A', 'B', 'AB', '0'].map((t, i) => { const x = 20 + i * 27; return all(rect(x - 11, 36, 22, 40, '#f6c4c4', 5, C.ink, 1.8), path(`M${x - 11} 56 L${x + 11} 56 L${x + 11} 71 C${x + 11} 75 ${x + 7} 76 ${x + 3} 76 L${x - 3} 76 C${x - 7} 76 ${x - 11} 75 ${x - 11} 71 Z`, '#d64545', null), text(x, 52, t, t.length > 1 ? 11 : 14, C.ink), line(`M${x} 36 L${x} 26`, C.ink, 1.6)); }));

// ── Digestion ───────────────────────────────────────────────────────────────
export const digestion = (): Svg => all(organs(['magsäck', 'tarm']), ...[[64, 40], [80, 88], [60, 116]].map(([x, y]) => path(`M${x! - 4} ${y! - 4} L${x} ${y! + 2} L${x! + 4} ${y! - 4}`, 'none', HL, 2.4)));
export const digesting = (): Svg => all(path('M20 30 C40 18 74 22 86 40 C96 58 84 86 60 88 C44 88 34 80 28 70 C40 66 44 56 36 44 C30 40 24 36 20 30 Z', '#f2a7a0', C.ink, 2.4), rect(40, 40, 10, 8, C.brown, 2, C.ink, 1.2), rect(56, 50, 8, 8, C.green, 2, C.ink, 1.2), ...[[50, 66], [56, 70], [62, 66], [68, 72], [60, 76]].map(([x, y]) => circle(x!, y!, 2, C.brown, null)), line('M48 50 C50 58 52 62 54 64', HL, 2, '2 3'), line('M104 50 L104 82', HL, 3), path('M104 86 l-5 -7 l10 0 Z', HL, HL, 1));
export const saliva = (): Svg => all(path('M20 40 C30 20 90 20 100 40 C104 60 94 90 60 100 C26 90 16 60 20 40 Z', '#c0392b', C.ink, 2.4), path('M34 50 C40 40 80 40 86 50 C90 70 80 90 60 94 C40 90 30 70 34 50 Z', '#f08a8a', C.ink, 2), ...[[48, 56], [70, 60], [58, 72], [44, 74], [76, 76]].map(([x, y]) => circle(x!, y!, 4, 'rgba(180,220,245,0.9)', C.navy, 1.2)));
export const enzyme = (): Svg => all(...[0, 1, 2, 3, 4, 5].map((i) => circle(14 + i * 16, 70, 7, i < 3 ? C.yellow : C.orange, C.ink, 1.6)), line('M21 70 L27 70 M37 70 L43 70 M69 70 L75 70 M85 70 L91 70', C.ink, 2), path('M56 40 C46 46 46 58 56 62 L64 54 Z', HL, C.ink, 2), path('M56 40 C66 34 76 40 74 50 L64 54 Z', HL, C.ink, 2), circle(60, 48, 2, C.ink, null));
export const gastricJuice = (): Svg => all(path('M20 30 C40 18 74 22 86 40 C96 58 84 86 60 88 C44 88 34 80 28 70 C40 66 44 56 36 44 C30 40 24 36 20 30 Z', '#f2a7a0', C.ink, 2.4), path('M34 66 C46 60 80 60 90 62 C88 76 76 88 60 88 C46 88 38 80 34 66 Z', '#9fd356', C.ink, 1.4), ...[[52, 72], [66, 76], [74, 70]].map(([x, y]) => circle(x!, y!, 2, C.white, null)), pointAt([64, 74], [110, 104]));
export const absorb = (): Svg => all(path('M0 20 L120 20 L120 56 L0 56 Z', '#f3c09a', C.ink, 2), ...[[20, 38], [50, 34], [86, 40]].map(([x, y]) => circle(x!, y!, 4, C.green, C.ink, 1.2)), path('M0 86 L120 86 L120 108 L0 108 Z', '#f6c4c4', C.ink, 2), line('M0 97 L120 97', '#d64545', 6), ...[20, 50, 86].map((x) => all(line(`M${x} 46 L${x} 80`, HL, 2.6), path(`M${x} 84 l-4 -7 l8 0 Z`, HL, HL, 1))));
export const metabolism = (): Svg => all(circle(22, 60, 12, C.red, C.ink, 2), line('M22 48 C22 42 26 40 28 40', C.brown, 2), line('M38 60 L48 60', C.ink, 2.4), path('M48 60 l-6 -4 l0 8 Z', C.ink, C.ink, 1), path('M70 36 C86 52 86 66 78 76 C74 82 64 82 60 76 C54 66 60 56 64 50 C66 58 70 56 70 50 C70 46 70 40 70 36 Z', C.orange, C.ink, 2), line('M90 60 L100 60', C.ink, 2.4), path('M100 60 l-6 -4 l0 8 Z', C.ink, C.ink, 1), bolt(110, 60, 1, C.yellow));
export const easyToDigest = (): Svg => all(path('M14 54 L106 54 C104 82 86 96 60 96 C34 96 16 82 14 54 Z', C.white, C.ink, 2.4), path('M18 58 L102 58 C100 66 92 70 60 70 C28 70 20 66 18 58 Z', '#f2d27a', null), line('M44 44 C40 36 48 32 44 24 M64 44 C60 36 68 32 64 24', C.grey2, 2.2), circle(96, 20, 12, C.green, C.ink, 2), path('M90 20 L95 25 L103 15', 'none', C.white, 2.6));
export const toilet = (): Svg => all(rect(70, 14, 30, 40, C.white, 4, C.ink, 2.4), path('M24 54 L100 54 C100 74 84 84 64 84 L60 84 L64 110 L40 110 L44 84 C30 80 24 70 24 54 Z', C.white, C.ink, 2.4), ellipse(56, 56, 28, 6, C.grey2, C.ink, 1.6), rect(86, 22, 8, 4, C.grey, 1, C.ink, 1));

// ── Temperature and sleep ───────────────────────────────────────────────────
export const thermometer = (): Svg => all(rect(52, 10, 16, 80, C.white, 8, C.ink, 2.4), path('M56 50 L64 50 L64 90 L56 90 Z', C.red, null), circle(60, 96, 14, C.red, C.ink, 2.4), line('M68 30 L74 30 M68 40 L74 40 M68 50 L76 50 M68 60 L74 60 M68 70 L74 70', C.ink, 1.4), text(94, 54, '37°', 16, C.navy));
export const bodyHeat = (): Svg => all(circle(60, 64, 52, 'rgba(239,138,60,0.16)', null), circle(60, 64, 40, 'rgba(239,138,60,0.22)', null), figure({ top: C.orange }));
export const frostbite = (): Svg => all(handPalm([]), ...[[45, 31], [58, 26], [71, 30], [83, 39]].map(([x, y]) => circle(x!, y!, 5.4, '#b9d8f2', C.ink, 1.4)), star(104, 18, 8, '#d8eef8'));
export const dehydration = (): Svg => all(path('M30 20 L70 20 L64 104 L36 104 Z', 'rgba(255,255,255,0.7)', C.ink, 2.4), path('M37 96 L63 96 L63 104 L37 104 Z', '#8cc7e8', null), path('M92 40 C102 56 102 66 92 70 C82 66 82 56 92 40 Z', '#d8eef8', C.ink, 2), line('M80 36 L104 74', C.red, 3.4));
export const dayRhythm = (): Svg => all(circle(60, 60, 46, C.white, C.ink, 2.4), path('M60 14 A46 46 0 0 1 60 106 Z', '#2f4a7a', null), circle(60, 60, 46, 'none', C.ink, 2.4), sun(38, 50, 9), moon(80, 50, 9), line('M60 60 L60 28 M60 60 L78 72', C.ink, 2.6), circle(60, 60, 3, C.ink, null));
export const swapDay = (): Svg => all(sun(34, 34, 12), moon(88, 86, 13), path('M60 24 C86 24 96 40 96 58', 'none', HL, 3), path('M96 58 l-5 -7 l9 -1 Z', HL, HL, 1), path('M60 96 C34 96 24 80 24 62', 'none', HL, 3), path('M24 62 l5 7 l-9 1 Z', HL, HL, 1));
export const sleepingPills = (): Svg => all(rect(20, 36, 44, 70, '#d8eef8', 6, C.ink, 2.4), rect(18, 24, 48, 14, C.white, 4, C.ink, 2.2), moon(42, 72, 10), pill(84, 90, 20, C.lilac, C.white), pill(96, 70, -30, C.lilac, C.white));

// ── Hormones and glands ─────────────────────────────────────────────────────
export const glands = (): Svg => all(figure({ top: C.sky }), circle(60, 30, 4, HL, C.ink, 1.4), circle(54, 66, 3, HL, C.ink, 1.2), circle(66, 66, 3, HL, C.ink, 1.2), pointAt([60, 30], [100, 14]));
export const bloodSugar = (): Svg => all(path('M40 20 C56 44 60 56 60 68 C60 84 50 92 40 92 C30 92 20 84 20 68 C20 56 24 44 40 20 Z', C.red, C.ink, 2.4), rect(72, 54, 24, 24, C.white, 3, C.ink, 2), line('M76 60 L92 60 M76 66 L92 66 M76 72 L92 72', C.grey2, 1.2), rect(66, 92, 44, 20, C.dark, 4, C.ink, 2), text(88, 107, '5.6', 13, C.mint));
export const hormone = (kind: 'kortisol' | 'melatonin' | 'östrogen' | 'testosteron' | 'tillväxt' | 'balans'): Svg => {
  if (kind === 'tillväxt') return all(rect(88, 10, 14, 102, '#fff6d8', 2, C.ink, 2), ...[20, 36, 52, 68, 84, 100].map((y) => line(`M88 ${y} L96 ${y}`, C.ink, 1.4)), figure({ x: 40, h: 0.62, top: C.yellow }), figure({ x: 64, h: 0.95, top: C.green }), line('M28 60 L50 26', HL, 3), path('M50 26 l-8 2 l5 6 Z', HL, HL, 1));
  if (kind === 'balans') return all(line('M60 30 L60 104 M36 104 L84 104 M20 40 L100 40', C.ink, 3), hexagon(24, 58, 10, C.lilac), hexagon(96, 58, 10, C.mint), line('M24 40 L24 48 M96 40 L96 48', C.ink, 1.4), circle(60, 30, 4, C.ink, null));
  const extra = kind === 'kortisol' ? all(bolt(98, 20, 1.2), circle(22, 22, 10, C.white, C.navy, 2), line('M22 22 L22 16 M22 22 L27 24', C.navy, 1.8))
    : kind === 'melatonin' ? all(moon(96, 22, 12), star(20, 18, 5, C.yellow))
      : kind === 'östrogen' ? all(circle(96, 22, 10, 'none', HL, 3.4), line('M96 32 L96 44 M90 39 L102 39', HL, 3.4))
        : all(circle(94, 26, 10, 'none', C.navy, 3.4), line('M101 19 L110 10 M103 10 L110 10 L110 17', C.navy, 3.4));
  const fill = kind === 'kortisol' ? C.yellow : kind === 'melatonin' ? C.lilac : kind === 'östrogen' ? C.pink : C.sky;
  return all(molecule(fill), extra);
};

// ── Immune system ───────────────────────────────────────────────────────────
export const vaccine = (): Svg => g('rotate(-35 60 60)', rect(26, 52, 60, 16, 'rgba(216,238,248,0.9)', 3, C.ink, 2.4), path('M30 54 L60 54 L60 66 L30 66 Z', '#8cc7e8', null), rect(86, 56, 16, 8, C.grey2, 1, C.ink, 1.6), line('M102 60 L118 60', C.ink, 1.6), rect(14, 50, 12, 20, C.white, 2, C.ink, 2), line('M6 54 L14 54 M6 66 L14 66', C.ink, 2), line('M36 52 L36 58 M44 52 L44 56 M52 52 L52 58', C.ink, 1));
const antibodyY = (x: number, y: number, rot: number) => g(`translate(${x} ${y}) rotate(${rot})`, line('M0 0 L0 14 M0 0 L-7 -8 M0 0 L7 -8', C.navy, 3), circle(-7, -8, 2, C.navy, null), circle(7, -8, 2, C.navy, null));
export const antibodies = (): Svg => all(virus(60, 60, 18), antibodyY(60, 100, 0), antibodyY(22, 60, 90), antibodyY(98, 60, -90), antibodyY(60, 20, 180));
export const lymphNodes = (): Svg => all(headFront([]), ...[[40, 100], [46, 106], [74, 100], [80, 106]].map(([x, y]) => circle(x!, y!, 4, HL, C.ink, 1.4)), pointAt([80, 104], [110, 84]));
export const immuneSystem = (): Svg => all(figure({ top: C.sky }), path('M60 6 C84 10 96 18 96 18 L96 60 C96 88 76 104 60 112 C44 104 24 88 24 60 L24 18 C24 18 36 10 60 6 Z', 'rgba(79,157,105,0.12)', C.green, 3), virus(14, 30, 7), virus(108, 70, 7));
export const incubation = (): Svg => all(rect(14, 22, 72, 66, C.white, 6, C.ink, 2.4), rect(14, 22, 72, 14, C.red, 6, C.ink, 2.4), ...Array.from({ length: 12 }, (_, i) => rect(20 + (i % 4) * 16, 42 + Math.floor(i / 4) * 14, 12, 10, i < 7 ? '#fde2d7' : C.white, 2, C.ink, 1)), virus(98, 92, 12));
export const resistance = (): Svg => all(path('M60 14 C80 18 92 24 92 24 L92 58 C92 82 76 98 60 106 C44 98 28 82 28 58 L28 24 C28 24 40 18 60 14 Z', C.green, C.ink, 2.6), path('M46 58 L56 68 L76 46', 'none', C.white, 5), virus(108, 30, 7), virus(10, 96, 7));
export const antibiotics = (): Svg => all(pill(36, 40, -20, C.red, C.white), pill(60, 24, 30, C.orange, C.white), pill(34, 74, 10, C.red, C.white), ellipse(86, 82, 16, 9, '#86b86a', C.ink, 2), line('M70 66 L102 98', C.red, 4));

// ── Weight, grip, hands ─────────────────────────────────────────────────────
export const weight = (): Svg => all(path('M40 34 C40 14 80 14 80 34 L72 34 C72 24 48 24 48 34 Z', C.dark, C.ink, 2.2), path('M28 40 L92 40 C100 60 100 90 90 104 L30 104 C20 90 20 60 28 40 Z', C.dark, C.ink, 2.4), text(60, 80, 'kg', 20, C.white));
export function piggyback(): Svg {
  return all(line('M6 112 L114 112', C.grey2, 2), figure({ x: 60, top: C.green }), g('translate(-12 -40)', figure({ x: 60, h: 0.55, top: C.yellow })));
}
export const gripBar = (): Svg => all(line('M4 52 L116 52', C.grey, 8), line('M4 52 L116 52', C.ink, 1), path('M36 40 C36 30 84 30 84 40 L84 70 C84 82 36 82 36 70 Z', C.skin, C.ink, 2.4), ...[44, 56, 68, 80].map((x) => path(`M${x - 6} 44 C${x - 6} 38 ${x + 6} 38 ${x + 6} 44 L${x + 6} 60 C${x + 6} 64 ${x - 6} 64 ${x - 6} 60 Z`, C.skin, C.ink, 1.8)), path('M50 104 L46 82 L74 82 L70 104 Z', C.skin, C.ink, 2.2), pointAt([60, 50], [104, 14]));
export const makeFist = (): Svg => all(g('translate(-30 6) scale(0.55)', handPalm([])), line('M56 60 L68 60', C.ink, 2.6), path('M70 60 l-6 -4 l0 8 Z', C.ink, C.ink, 1), g('translate(50 30) scale(0.55)', path('M34 52 C34 42 86 40 88 50 L90 82 C90 94 78 98 62 98 C46 98 34 94 34 82 Z', C.skin, C.ink, 3), ...[42, 54, 66, 78].map((x) => path(`M${x - 6} 50 C${x - 6} 42 ${x + 6} 42 ${x + 6} 50 L${x + 6} 66 C${x + 6} 70 ${x - 6} 70 ${x - 6} 66 Z`, C.skin, C.ink, 2.6)), path('M34 70 C40 64 56 66 66 72 C64 78 52 80 38 80 Z', C.skin, C.ink, 2.6)));
export const crossedFingers = (): Svg => all(path('M40 120 L40 70 C40 60 80 60 82 70 L80 120 Z', C.skin, C.ink, 2.4), path('M48 66 L44 20 C44 12 56 12 56 20 L60 64 Z', C.skin, C.ink, 2.2), path('M64 64 L48 22 C46 14 58 10 60 18 L74 60 Z', C.skin, C.ink, 2.2), path('M74 70 C80 66 84 70 84 76 L82 88 Z', C.skin, C.ink, 2), path('M36 86 C28 80 30 70 40 72 L46 80 Z', C.skin, C.ink, 2.2), star(98, 26, 8, C.yellow));
export const thumbsUp = (): Svg => all(path('M34 56 L56 56 L56 104 L34 104 Z', C.skin, C.ink, 2.4), path('M56 58 C64 44 66 30 70 20 C76 12 86 18 82 30 L78 50 L98 50 C106 50 108 60 102 64 C108 68 104 76 98 76 C104 80 100 88 94 88 C98 92 94 100 88 100 L56 100 Z', C.skin, C.ink, 2.4), line('M82 62 L100 62 M82 76 L98 76 M80 88 L94 88', C.skin2, 1.6));

// ── Pain ───────────────────────────────────────────────────────────────────
export const pain = (): Svg => all(figure({ top: C.sky }), glow(60, 92, 18), ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return line(`M${(60 + Math.cos(a) * 14).toFixed(1)} ${(92 + Math.sin(a) * 14).toFixed(1)} l${(Math.cos(a) * 8).toFixed(1)} ${(Math.sin(a) * 8).toFixed(1)}`, HL, 2.6); }), bolt(96, 22, 1.1, HL));
export const cramp = (): Svg => all(legSide(['vadmuskel']), path('M46 68 m-5 0 a5 5 0 1 0 10 0 a3 3 0 1 0 -6 0', 'none', C.ink, 1.6), bolt(24, 66, 1, HL), bolt(14, 86, 0.7, HL));
export const painScale = (): Svg => all(...Array.from({ length: 10 }, (_, i) => rect(8 + i * 10.6, 70, 9, 22, ['#4f9d69', '#6aa860', '#85b357', '#a8be4e', '#cfc845', '#f2c14e', '#f0a245', '#ec823d', '#e86235', '#d64545'][i]!, 2, C.ink, 1.2)), path('M23 62 L17 52 L29 52 Z', HL, C.ink, 1.4), g('translate(4 2) scale(0.36)', headFront([], { smile: true })));
export const painQuality = (kind: 'stickande' | 'brännande' | 'molande' | 'myrkrypning'): Svg => {
  if (kind === 'stickande') return all(forearm(''), ...[[30, 56], [50, 62], [70, 54]].map(([x, y]) => all(line(`M${x} ${y! - 24} L${x} ${y! - 4}`, C.grey, 2.4), path(`M${x! - 2} ${y! - 6} L${x! + 2} ${y! - 6} L${x} ${y} Z`, C.ink, C.ink, 1), line(`M${x! - 6} ${y! + 2} l-3 3 M${x! + 6} ${y! + 2} l3 3`, HL, 1.8))));
  if (kind === 'brännande') return all(forearm(''), ...[30, 52, 74].map((x) => path(`M${x} 40 C${x + 10} 50 ${x + 8} 60 ${x} 64 C${x - 8} 60 ${x - 10} 50 ${x} 40 Z`, C.orange, C.ink, 1.6)), ...[30, 52, 74].map((x) => path(`M${x} 50 C${x + 4} 54 ${x + 4} 58 ${x} 61 C${x - 4} 58 ${x - 4} 54 ${x} 50 Z`, C.yellow, null)));
  if (kind === 'molande') return all(forearm(''), glow(48, 62, 22), line('M10 22 C26 14 34 30 50 22 C66 14 74 30 90 22', HL, 3), line('M10 34 C26 26 34 42 50 34 C66 26 74 42 90 34', HL, 2));
  return all(forearm(''), ...Array.from({ length: 14 }, (_, i) => circle(10 + ((i * 29) % 84), 50 + ((i * 17) % 28), 1.5, C.ink, null)), circle(70, 64, 14, 'none', C.navy, 2.4), line('M80 74 L92 88', C.navy, 4));
};
