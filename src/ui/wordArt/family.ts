/**
 * Families and relations (0.14, Relationer & familj): groups of figures (figures.ts) on a
 * ground line where the person the word is about is in colour with an accent marker, the
 * others muted – so related words (förstfödd, mellanbarn, sladdbarn …) differ only in who
 * is marked.
 */
import { C, all, circle, g, line, path, rect, type Svg } from './kit';
import { figure, type Build } from './figures';

const HL = C.accent;
export type Member = Build & { mark?: boolean; mute?: boolean };

/** A row of people; `mark` gets a coloured arrow above the head, `mute` is faded. */
export function group(members: Member[], o: { ground?: boolean } = {}): Svg {
  const out: Svg[] = [];
  if (o.ground !== false) out.push(line('M4 112 L116 112', C.grey2, 2));
  for (const m of members) {
    out.push(m.mute ? `<g opacity="0.4">${figure(m)}</g>` : figure(m));
    if (m.mark) { const h = m.h ?? 1, top = 112 - 115 * 0.84 * h; out.push(path(`M${m.x! - 5} ${top - 12} L${m.x! + 5} ${top - 12} L${m.x} ${top - 4} Z`, HL, C.ink, 1.4)); }
  }
  return all(...out);
}

export const heart = (x: number, y: number, s = 1, fill: string = C.red): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', fill, C.ink, 1.4));
export const house = (x: number, y: number, s = 1, fill: string = C.yellow): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-16 0 L0 -14 L16 0 Z', C.red, C.ink, 1.8), rect(-13, 0, 26, 20, fill, 1, C.ink, 1.8), rect(-4, 8, 8, 12, C.brown, 1, C.ink, 1.4));
export const doc = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -16, 24, 32, C.white, 2, C.ink, 1.8), line('M-7 -8 L7 -8 M-7 -2 L7 -2 M-7 4 L3 4', C.grey, 1.6), path('M-6 10 C-2 6 2 14 6 10', 'none', C.navy, 1.6));
export const suitcase = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -12, 18, 14, C.brown, 2, C.ink, 1.6), path('M-4 -12 L-4 -16 L4 -16 L4 -12', 'none', C.ink, 1.6));

// adults and children used across the family pictures
const MUM = (x: number, more: Partial<Member> = {}): Member => ({ x, hairStyle: 'long', top: C.orange, ...more });
const DAD = (x: number, more: Partial<Member> = {}): Member => ({ x, top: C.green, ...more });
const KID = (x: number, h = 0.6, more: Partial<Member> = {}): Member => ({ x, h, top: C.yellow, ...more });
const GREY = '#d3d6db';
const GRAN = (x: number, more: Partial<Member> = {}): Member => ({ x, h: 0.92, hairStyle: 'long', hair: GREY, top: C.lilac, ...more });
const GRAMPS = (x: number, more: Partial<Member> = {}): Member => ({ x, h: 0.95, hair: GREY, top: C.brown, ...more });
const frame = (x: number, y: number, inner: Svg, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -20, 32, 40, C.tan, 3, C.ink, 2), rect(-12, -16, 24, 32, '#efe6d2', 2, C.ink, 1.2), inner);
const coin = (x: number, y: number): Svg => g(`translate(${x} ${y})`, `<circle r="7" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.4"/><text y="3.5" font-family="system-ui" font-weight="800" font-size="9" text-anchor="middle" fill="${C.ink}">kr</text>`);

const T = (x: number, y: number, s: string, size: number, fill: string = C.ink, w = 800, anchor = 'middle') => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${w}" font-size="${size}" text-anchor="${anchor}" fill="${fill}">${s}</text>`;
/** A name badge "Sara Maria Lindblom" with one part highlighted. */
function nameTag(mark: 0 | 1 | 2 | -1, parts: [string, string, string] = ['Sara', 'Maria', 'Lindblom']): Svg {
  const pos: [number, number][] = [[38, 70], [80, 70], [60, 92]];
  return all(rect(8, 30, 104, 74, C.white, 8, C.ink, 2.4), rect(8, 30, 104, 16, C.red, 6, C.ink, 2.4), T(60, 42, 'HEJ! JAG HETER', 10, C.white),
    ...parts.map((p, i) => { const [x, y] = pos[i]!, w = p.length * 8.4 + 8; return all(i === mark ? rect(x - w / 2, y - 14, w, 19, HL, 5, null) : '', T(x, y, p, 15, i === mark ? C.white : C.ink)); }));
}
const face = (x: number, y: number, o: { ears?: boolean; nose?: string; hair?: string; long?: boolean } = {}) => all(
  o.long ? path(`M${x - 13} ${y} C${x - 15} ${y + 14} ${x + 15} ${y + 14} ${x + 13} ${y} Z`, o.hair ?? C.hair, C.ink, 1.4) : '',
  o.ears ? `<ellipse cx="${x - 12}" cy="${y + 2}" rx="5" ry="7" fill="${HL}" stroke="${C.ink}" stroke-width="1.6"/><ellipse cx="${x + 12}" cy="${y + 2}" rx="5" ry="7" fill="${HL}" stroke="${C.ink}" stroke-width="1.6"/>` : '',
  `<circle cx="${x}" cy="${y}" r="12" fill="${C.skin}" stroke="${C.ink}" stroke-width="1.8"/>`, path(`M${x - 12} ${y - 2} C${x - 12} ${y - 16} ${x + 12} ${y - 16} ${x + 12} ${y - 2} C${x + 8} ${y - 8} ${x - 8} ${y - 8} ${x - 12} ${y - 2} Z`, o.hair ?? C.hair, C.ink, 1.4),
  `<circle cx="${x - 4}" cy="${y}" r="1.4" fill="${C.ink}"/><circle cx="${x + 4}" cy="${y}" r="1.4" fill="${C.ink}"/>`, path(`M${x} ${y + 1} L${x - 3} ${y + 6} L${x + 2} ${y + 6}`, o.nose ?? 'none', C.ink, 1.4), line(`M${x - 4} ${y + 9} Q${x} ${y + 11} ${x + 4} ${y + 9}`, C.ink, 1.3));

/** In-law picture: Johan's family on the left, the couple (Johan + Aiko, heart) on the right; `mark` picks who the word is about. */
function inlaw(mark: Array<'mor' | 'far' | 'bror' | 'syster' | 'johan' | 'aiko'>, o: { bracket?: boolean } = {}): Svg {
  const m = (k: 'mor' | 'far' | 'bror' | 'syster' | 'johan' | 'aiko') => mark.includes(k);
  return all(group([
    GRAN(12, { h: 0.78, hair: GREY, mark: m('mor'), mute: !m('mor') && !o.bracket }), GRAMPS(32, { h: 0.8, mark: m('far'), mute: !m('far') && !o.bracket }),
    DAD(52, { h: 0.74, top: C.sky, mark: m('bror'), mute: !m('bror') && !o.bracket }), MUM(70, { h: 0.72, top: C.pink, mark: m('syster'), mute: !m('syster') && !o.bracket }),
    DAD(90, { h: 0.78, mark: m('johan') }), MUM(108, { h: 0.74, top: C.purple, mark: m('aiko') }),
  ]), heart(99, 40, 0.6), rect(98, 14, 20, 12, C.navy, 6, null), T(108, 23, 'jag', 8, C.white), o.bracket ? path('M4 26 L4 18 L78 18 L78 26', 'none', HL, 2.4) : '');
}
const ring = (x: number, y: number) => g(`translate(${x} ${y})`, `<circle r="5" fill="none" stroke="${C.gold}" stroke-width="2.4"/>`, path('M-2 -6 L2 -6 L0 -9 Z', C.sky, C.ink, 0.8));

// ── Släktträd: nodes (circles with a small person) joined by lines ─────────────
const node = (x: number, y: number, o: { mark?: boolean; dead?: boolean; long?: boolean; r?: number; mute?: boolean } = {}): Svg => {
  const r = o.r ?? 9, op = o.mute ? 0.4 : 1;
  return `<g opacity="${op}">${all(circle(x, y, r, o.mark ? HL : o.dead ? C.grey2 : C.white, C.ink, 1.8), circle(x, y - r * 0.2, r * 0.32, o.dead ? C.grey : C.skin, C.ink, 1), path(`M${x - r * 0.55} ${y + r * 0.6} C${x - r * 0.55} ${y + r * 0.1} ${x + r * 0.55} ${y + r * 0.1} ${x + r * 0.55} ${y + r * 0.6} Z`, o.dead ? C.grey : o.long ? C.orange : C.green, C.ink, 1), o.dead ? line(`M${x + r * 0.7} ${y - r - 6} l0 8 M${x + r * 0.7 - 3} ${y - r - 3} l6 0`, C.ink, 1.6) : '')}</g>`;
};
const marry = (x1: number, x2: number, y: number, kind: 'gift' | 'skild' | 'none' = 'gift', mark = false) => kind === 'none' ? '' : all(line(`M${x1 + 9} ${y - 2} L${x2 - 9} ${y - 2} M${x1 + 9} ${y + 2} L${x2 - 9} ${y + 2}`, mark ? HL : C.ink, mark ? 2.2 : 1.4), kind === 'skild' ? line(`M${(x1 + x2) / 2 - 4} ${y + 7} l5 -14 M${(x1 + x2) / 2 + 2} ${y + 7} l5 -14`, HL, 2.4) : '');
const kids = (from: number, y1: number, xs: number[], y2: number, mark = false) => line(`M${from} ${y1} L${from} ${(y1 + y2) / 2} M${Math.min(...xs)} ${(y1 + y2) / 2} L${Math.max(...xs)} ${(y1 + y2) / 2} ${xs.map((x) => `M${x} ${(y1 + y2) / 2} L${x} ${y2 - 9}`).join(' ')}`, mark ? HL : C.ink, mark ? 2.2 : 1.4);
const yearTag = (x: number, y: number, s: string, mark: boolean) => all(rect(x - s.length * 3.3 - 3, y - 8, s.length * 6.6 + 6, 12, mark ? HL : C.white, 3, C.ink, 1), T(x, y + 1.5, s, 9, mark ? C.white : C.ink));

export const FAMILY_MOTIFS: Record<string, Svg> = {
  'familj.kärnfamilj': all(group([MUM(22), KID(48, 0.55, { top: C.sky }), KID(70, 0.62), DAD(98)]), path('M10 18 C40 6 80 6 110 18', 'none', HL, 3)),
  'familj.enda-barn': group([MUM(30), KID(60, 0.6, { mark: true }), DAD(90)]),
  'familj.tvilling': all(group([KID(42, 0.75, { top: C.purple, mark: true }), KID(78, 0.75, { top: C.purple, mark: true })]), line('M48 34 L72 34', HL, 2.4, '3 3')),
  'familj.mellanbarn': group([KID(26, 0.8, { mute: true }), KID(60, 0.62, { mark: true }), KID(92, 0.45, { mute: true })]),
  'familj.förstfödd': group([KID(26, 0.8, { mark: true }), KID(60, 0.62, { mute: true }), KID(92, 0.45, { mute: true })]),
  'familj.sladdbarn': group([KID(22, 0.9, { mute: true, top: C.grey2 }), KID(50, 0.92, { mute: true }), KID(90, 0.36, { mark: true, top: C.pink })]),
  'familj.ensamstående': group([MUM(46, { mark: true }), KID(76, 0.55), KID(96, 0.42, { top: C.sky })]),
  'familj.styvförälder': all(group([MUM(20, { mute: true }), KID(50, 0.58), DAD(84, { mark: true, top: C.purple })]), heart(52, 30, 0.8, C.pink)),
  'familj.bonusförälder': all(group([DAD(20, { mute: true }), KID(50, 0.58), MUM(84, { mark: true, top: C.purple })]), heart(52, 30, 0.8, C.pink), star2(98, 22)),
  'familj.bonusbarn': all(group([MUM(22, { mute: true }), DAD(52, { mute: true }), KID(92, 0.6, { mark: true, top: C.mint })]), star2(104, 44)),
  'familj.adoptera': all(group([MUM(24), DAD(56), KID(92, 0.55, { skin: '#a8714c', hair: C.hair, top: C.sky })]), heart(74, 40, 0.9), path('M100 92 C108 80 108 70 100 62', 'none', HL, 2.4), path('M100 62 l-5 2 l4 4 Z', HL, HL, 1)),
  'familj.adoptivbarn': all(group([MUM(26, { mute: true }), KID(60, 0.6, { mark: true, skin: '#a8714c', top: C.sky }), DAD(94, { mute: true })]), heart(60, 30, 0.8)),
  'familj.fosterbarn': all(house(22, 66, 1, C.grey2), house(98, 66, 1), group([KID(60, 0.6, { mark: true })], { ground: true }), suitcase(76, 106, 1), path('M36 50 C46 40 74 40 84 50', 'none', HL, 2.4), path('M84 50 l-6 -1 l2 5 Z', HL, HL, 1)),
  'familj.uppväxt': all(group([KID(22, 0.45, { top: C.purple }), KID(54, 0.72, { top: C.purple }), { x: 92, h: 1, top: C.purple }]), path('M14 40 C40 22 76 14 108 10', 'none', HL, 2.6), path('M108 10 l-7 0 l3 6 Z', HL, HL, 1)),
  'familj.vårdnad': all(group([MUM(26), KID(60, 0.55), DAD(94)]), path('M60 6 C72 9 80 12 80 12 L80 30 C80 42 70 50 60 54 C50 50 40 42 40 30 L40 12 C40 12 48 9 60 6 Z', 'rgba(79,157,105,0.18)', C.green, 2.4)),
  'familj.vårdnadshavare': all(group([MUM(40, { mark: true }), KID(76, 0.55)]), doc(98, 44, 1)),
  // ── Syskon och kusiner ──────────────────────────────────────────
  'familj.storasyster': group([KID(40, 0.85, { hairStyle: 'long', top: C.pink, mark: true }), KID(82, 0.5, { top: C.sky, mute: true })]),
  'familj.lillasyster': group([KID(40, 0.85, { top: C.sky, mute: true }), KID(82, 0.5, { hairStyle: 'long', top: C.pink, mark: true })]),
  'familj.helsyskon': all(group([MUM(18), KID(48, 0.55, { mark: true }), KID(72, 0.6, { top: C.sky, mark: true }), DAD(102)]), line('M18 22 L48 50 M18 22 L72 46 M102 22 L48 50 M102 22 L72 46', HL, 1.6, '3 3')),
  'familj.halvsyskon': all(group([DAD(14, { top: C.navy }), KID(38, 0.55, { mark: true }), MUM(62), KID(86, 0.55, { top: C.sky, mark: true }), DAD(108)]), line('M14 22 L38 54 M62 22 L38 54 M62 22 L86 54 M108 22 L86 54', HL, 1.6, '3 3'), circle(62, 18, 9, 'none', HL, 2.4)),
  'familj.syskonskara': group([KID(12, 0.85, { top: C.green }), KID(30, 0.75, { hairStyle: 'long', top: C.pink }), KID(48, 0.66, { top: C.sky }), KID(66, 0.58, { hairStyle: 'long', top: C.yellow }), KID(84, 0.5, { top: C.orange }), KID(102, 0.42, { top: C.purple })]),
  'familj.syskonkärlek': all(group([KID(48, 0.8, { hairStyle: 'long', top: C.pink }), KID(72, 0.6, { top: C.sky })]), heart(60, 26, 1.2), line('M52 70 L70 74', C.skin, 5)),
  'familj.syskonbråk': all(group([KID(32, 0.75, { top: C.sky, face: 'neutral' }), KID(88, 0.7, { hairStyle: 'long', top: C.pink, face: 'neutral' })]), g('translate(60 50)', path('M2 -16 L-8 2 L-1 2 L-5 16 L8 -4 L1 -4 Z', C.yellow, C.ink, 1.6)), line('M44 40 l6 -4 M44 46 l7 0 M76 40 l-6 -4 M76 46 l-7 0', HL, 2)),
  'familj.skvallra': all(group([MUM(30, { face: 'neutral' }), KID(62, 0.55, { mark: true }), KID(98, 0.6, { top: C.sky, mute: true })]), path('M64 30 L92 30 L92 44 L74 44 L68 50 L69 44 L64 44 Z', C.white, C.ink, 1.6), line('M69 37 L87 37', C.grey, 1.6), path('M70 70 L86 66', 'none', C.ink, 2), path('M88 66 l-5 -2 l1 5 Z', C.ink, C.ink, 1)),
  'familj.ta-parti-för': all(group([MUM(54, { face: 'neutral' }), KID(30, 0.55, { mark: true }), KID(98, 0.58, { top: C.sky, mute: true, face: 'neutral' })]), line('M46 76 C40 74 36 76 34 80', C.orange, 5)),
  'familj.dela-rum': all(rect(6, 60, 48, 22, C.sky, 3, C.ink, 2), rect(6, 54, 14, 10, C.white, 3, C.ink, 1.6), rect(66, 60, 48, 22, C.pink, 3, C.ink, 2), rect(100, 54, 14, 10, C.white, 3, C.ink, 1.6), line('M10 82 L10 92 M50 82 L50 92 M70 82 L70 92 M110 82 L110 92', C.brown, 3), line('M60 14 L60 100', C.grey2, 1.4, '4 4'), rect(44, 12, 32, 22, '#d8eef8', 2, C.ink, 1.8)),
  'familj.ärva': all(group([KID(24, 0.85, { top: C.green }), KID(96, 0.5, { top: C.green, mark: true })]), path('M44 40 C60 30 70 34 82 44', 'none', HL, 2.6), path('M84 46 l-7 -1 l3 -5 Z', HL, HL, 1), g('translate(60 26)', path('M-9 -6 L-4 -9 L4 -9 L9 -6 L7 0 L5 -1 L5 8 L-5 8 L-5 -1 L-7 0 Z', C.green, C.ink, 1.4))),
  'familj.se-upp-till': all(group([KID(40, 0.95, { top: C.purple }), KID(84, 0.45, { top: C.sky, mark: true })]), g('translate(40 6)', path('M0 -6 L1.8 -1.8 L6 -1.8 L2.6 0.8 L3.8 5 L0 2.6 L-3.8 5 L-2.6 0.8 L-6 -1.8 L-1.8 -1.8 Z', C.yellow, C.ink, 1)), line('M78 70 C70 50 60 40 52 34', C.navy, 1.6, '3 3')),
  'familj.hålla-ihop': all(group([KID(28, 0.8, { top: C.green }), KID(60, 0.7, { hairStyle: 'long', top: C.pink }), KID(92, 0.6, { top: C.sky })]), line('M36 62 L52 62 M68 66 L84 66', C.skin, 5), heart(60, 18, 1)),
  'familj.syskonbarn': all(group([MUM(30, { top: C.purple }), KID(66, 0.5, { mark: true }), KID(94, 0.45, { hairStyle: 'long', top: C.pink, mark: true })])),
  'familj.syssling': all(...[[30, 14], [90, 14]].map(([x, y]) => circle(x!, y!, 7, C.grey2, C.ink, 1.6)), line('M30 21 L30 30 M90 21 L90 30 M30 30 L90 30 M60 30 L60 8', C.ink, 1.4),
    circle(20, 50, 7, C.grey2, C.ink, 1.6), circle(100, 50, 7, C.grey2, C.ink, 1.6), line('M30 30 L20 43 M90 30 L100 43', C.ink, 1.4),
    circle(20, 86, 9, C.yellow, C.ink, 2), circle(100, 86, 9, HL, C.ink, 2), line('M20 57 L20 77 M100 57 L100 77', C.ink, 1.4), line('M30 86 L90 86', HL, 2, '4 3')),
  'familj.kusinträff': all(rect(20, 90, 80, 8, C.tan, 2, C.ink, 1.6), group([KID(14, 0.6, { top: C.green }), KID(32, 0.5, { hairStyle: 'long', top: C.pink }), KID(50, 0.66, { top: C.sky }), KID(70, 0.55, { top: C.yellow }), KID(88, 0.62, { hairStyle: 'long', top: C.orange }), KID(106, 0.45, { top: C.purple })]), path('M30 14 C50 4 70 4 90 14', 'none', C.red, 3), ...[40, 60, 80].map((x) => path(`M${x} 9 l-4 8 l8 0 Z`, C.yellow, C.ink, 1))),
  // ── Mor- och farföräldrar ───────────────────────────────────────
  'familj.farförälder': all(group([GRAN(16, { mark: true }), GRAMPS(40, { mark: true }), DAD(74), KID(102, 0.5)]), line('M28 4 L28 8 M74 14 L74 8 L28 8', HL, 1.6, '3 3')),
  'familj.morförälder': all(group([GRAN(16, { mark: true }), GRAMPS(40, { mark: true }), MUM(74), KID(102, 0.5)]), line('M28 4 L28 8 M74 14 L74 8 L28 8', HL, 1.6, '3 3')),
  'familj.gammelmormor': group([{ x: 16, h: 0.85, hairStyle: 'long', hair: '#ffffff', top: C.purple, mark: true }, GRAN(44, { mute: true }), MUM(76, { mute: true }), KID(104, 0.5, { mute: true })]),
  'familj.gammelfarfar': all(frame(60, 54, g('translate(0 6) scale(0.32) translate(-60 -60)', figure({ hair: '#ffffff', top: C.dark }).replace(/#f1c7a1/g, '#d9c6a6')), 1.8)),
  'familj.barnbarn': group([GRAN(22, { mute: true }), GRAMPS(50, { mute: true }), KID(84, 0.55, { mark: true }), KID(104, 0.45, { top: C.pink, hairStyle: 'long', mark: true })]),
  'familj.barnbarnsbarn': group([{ x: 16, h: 0.85, hairStyle: 'long', hair: '#ffffff', top: C.purple, mute: true }, GRAN(44, { mute: true }), MUM(76, { mute: true }), KID(104, 0.4, { mark: true })]),
  'familj.generation': all(group([KID(18, 0.5), MUM(46), GRAN(78), { x: 104, h: 0.85, hair: '#ffffff', top: C.purple }]), ...[18, 46, 78, 104].map((x, i) => `<text x="${x}" y="8" font-family="system-ui" font-weight="800" font-size="10" text-anchor="middle" fill="${HL}">${i + 1}</text>`)),
  'familj.generationsklyfta': all(path('M0 112 L46 112 L52 120 L0 120 Z M120 112 L74 112 L68 120 L120 120 Z', C.tan, C.ink, 1.6),  group([KID(20, 0.62, { top: C.sky }), GRAMPS(100)], { ground: false }), g('translate(60 40)', `<text font-family="system-ui" font-weight="800" font-size="22" text-anchor="middle" fill="${HL}">?</text>`)),
  'familj.ålderdom': all(rect(20, 84, 80, 6, C.brown, 2, C.ink, 1.6), line('M28 90 L28 104 M92 90 L92 104', C.brown, 3), group([GRAN(46, { h: 0.8 }), GRAMPS(74, { h: 0.82 })]), g('translate(102 18)', `<circle r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.6"/>`)),
  'familj.pension': all(group([GRAMPS(40, { top: C.orange })]), coin(78, 52), coin(92, 64), coin(80, 76), g('translate(100 20)', `<circle r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.6"/>`)),
  'familj.gå-i-pension': all(group([GRAMPS(40, { top: C.navy })]), rect(70, 86, 26, 18, C.brown, 3, C.ink, 2), path('M78 86 L78 82 L88 82 L88 86', 'none', C.ink, 2), path('M100 40 C108 44 110 52 106 60', 'none', HL, 2.4), g('translate(98 26)', `<circle r="8" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.6"/>`)),
  'familj.barnvakt': all(group([GRAMPS(40, { mark: true }), KID(82, 0.5)]), g('translate(62 66)', rect(-10, -8, 20, 14, C.red, 2, C.ink, 1.6), line('M0 -8 L0 6', C.ink, 1.2))),
  'familj.skämma-bort': all(group([GRAN(34), KID(86, 0.55, { mark: true })]), ...[[66, 60], [72, 54], [78, 62], [70, 66], [62, 54]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${[C.red, C.yellow, C.green, C.pink, C.sky][i]}" stroke="${C.ink}" stroke-width="1"/>`), heart(60, 30, 0.8)),
  'familj.änka': all(group([GRAN(40, { top: C.dark, mark: true })]), frame(88, 64, g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: GREY, top: C.brown })), 1)),
  'familj.änkling': all(group([GRAMPS(40, { top: C.dark, mark: true })]), frame(88, 64, g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: GREY, hairStyle: 'long', top: C.lilac })), 1)),
  'familj.livserfarenhet': all(group([{ x: 42, h: 0.95, hair: '#ffffff', top: C.brown }]), ...[0, 1, 2].map((i) => rect(76, 96 - i * 10, 30, 9, [C.red, C.green, C.sky][i]!, 2, C.ink, 1.4)), g('translate(92 30)', path('M-7 -2 C-7 -12 7 -12 7 -2 C7 3 3 5 3 8 L-3 8 C-3 5 -7 3 -7 -2 Z', C.yellow, C.ink, 1.6), line('M-12 -8 l-4 -2 M12 -8 l4 -2 M0 -16 l0 -4', C.gold, 1.8))),
  'familj.arv': all(path('M10 70 C24 62 40 62 50 68 L50 80 L10 82 Z', '#e8d3b8', C.ink, 2), path('M110 70 C96 62 80 62 70 68 L70 80 L110 82 Z', C.skin, C.ink, 2), g('translate(60 56)', `<circle r="12" fill="${C.gold}" stroke="${C.ink}" stroke-width="2"/><circle r="8.5" fill="${C.white}" stroke="${C.ink}" stroke-width="1.2"/>`, line('M0 0 L0 -6 M0 0 L4 2', C.ink, 1.6), line('M0 -12 L0 -16', C.ink, 2)), path('M30 40 C44 28 76 28 90 40', 'none', HL, 2.4), path('M90 40 l-7 -1 l3 6 Z', HL, HL, 1)),
  'familj.släktgård': all(path('M0 100 L120 100 L120 102 C120 112 112 120 102 120 L18 120 C8 120 0 112 0 102 Z', C.mint, null), path('M22 60 L60 34 L98 60 Z', C.dark, C.ink, 2), rect(28, 60, 64, 40, '#b53a2c', 2, C.ink, 2), rect(36, 68, 12, 12, C.white, 1, C.ink, 1.4), rect(72, 68, 12, 12, C.white, 1, C.ink, 1.4), rect(54, 78, 12, 22, C.white, 1, C.ink, 1.4), line('M104 100 L104 40', C.grey, 2), path('M104 40 L118 44 L104 48 Z', C.sky, C.ink, 1)),
  // ── Släktrelationer ─────────────────────────────────────────────
  'familj.förnamn': nameTag(0),
  'familj.mellannamn': nameTag(1),
  'familj.efternamn': nameTag(2),
  'familj.släktnamn': all(group([GRAMPS(18, { h: 0.7 }), MUM(46, { h: 0.7 }), DAD(74, { h: 0.7 }), KID(100, 0.45)]), rect(22, 6, 76, 18, HL, 6, C.ink, 1.6), T(60, 19, 'Lindblom', 12, C.white)),
  'familj.flicknamn': all(group([{ x: 30, hairStyle: 'long', top: C.white }]), rect(56, 30, 58, 18, C.white, 4, C.ink, 1.6), T(85, 43, 'Andersson', 10, HL), rect(56, 62, 58, 18, C.white, 4, C.ink, 1.6), T(85, 75, 'Lindblom', 10), path('M85 50 L85 60', 'none', C.ink, 1.6), path('M85 61 l-3 -5 l6 0 Z', C.ink, C.ink, 1)),
  'familj.heta-efter': all(group([GRAN(30, { mark: true }), KID(84, 0.35, { top: C.pink })]), rect(8, 60, 44, 14, C.white, 4, C.ink, 1.4), T(30, 71, 'Maria', 10, HL), rect(62, 80, 44, 14, C.white, 4, C.ink, 1.4), T(84, 91, 'Maria', 10, HL), path('M52 66 C66 60 76 66 82 78', 'none', HL, 2), path('M82 79 l-1 -6 l-5 3 Z', HL, HL, 1)),
  'familj.namnsdag': all(rect(24, 18, 72, 84, C.white, 6, C.ink, 2.4), rect(24, 18, 72, 22, C.red, 6, C.ink, 2.4), T(60, 34, 'MAJ', 13, C.white), T(60, 74, '18', 30), rect(36, 82, 48, 14, HL, 4, null), T(60, 93, 'Maria', 10, C.white), line('M100 12 L100 44', C.grey, 2), path('M100 12 L114 16 L100 20 Z', C.sky, C.ink, 1), line('M100 16 L114 16', C.yellow, 1.6)),
  'familj.nära-släkt': all(circle(60, 74, 50, 'rgba(228,87,46,0.08)', HL, 2), group([MUM(30), KID(60, 0.6, { mark: true }), DAD(90)])),
  'familj.på-pappas-sida': all(...[[16, 30], [36, 30], [84, 30], [104, 30]].map(([x, y], i) => circle(x!, y!, 7, i < 2 ? C.grey2 : HL, C.ink, 1.6)), line('M16 37 L16 44 L36 44 L36 37 M84 37 L84 44 L104 44 L104 37 M26 44 L26 56 M94 44 L94 56', C.ink, 1.4), circle(26, 64, 8, C.grey2, C.ink, 1.6), circle(94, 64, 8, HL, C.ink, 1.6), line('M26 72 L26 80 L94 80 L94 72 M60 80 L60 92', C.ink, 1.4), circle(60, 100, 9, C.yellow, C.ink, 2), path('M76 14 L114 14 L114 76 L76 76 Z', 'none', HL, 2)),
  'familj.släktträff': all(rect(10, 78, 100, 8, C.tan, 2, C.ink, 1.6), line('M16 86 L16 104 M104 86 L104 104', C.brown, 3), group([GRAN(14, { h: 0.7 }), DAD(32, { h: 0.72 }), MUM(50, { h: 0.7, top: C.pink }), GRAMPS(68, { h: 0.72 }), DAD(86, { h: 0.7, top: C.sky }), MUM(104, { h: 0.68 })], { ground: false }), path('M20 10 C46 2 74 2 100 10', 'none', C.red, 3), ...[34, 60, 86].map((x) => path(`M${x} 6 l-4 8 l8 0 Z`, C.yellow, C.ink, 1))),
  'familj.släktskap': all(group([MUM(26), DAD(94, { top: C.sky })]), line('M40 50 L80 50', HL, 2.4, '4 4'), circle(60, 40, 10, C.white, HL, 2), T(60, 45, '?', 14, HL)),
  'familj.likhet': all(g('translate(32 58) scale(1.55)', face(0, 0, { nose: HL, long: true })), g('translate(88 58) scale(1.55)', face(0, 0, { nose: HL })), T(60, 66, '=', 24, HL)),
  'familj.släktdrag': all(g('translate(22 60) scale(1.15)', face(0, 0, { ears: true, hair: GREY })), g('translate(60 60) scale(1.15)', face(0, 0, { ears: true, long: true })), g('translate(98 60) scale(1.15)', face(0, 0, { ears: true }))),
  'familj.ta-efter': all(group([DAD(34, { top: C.white }), KID(88, 0.6, { top: C.white })]), ...[[48, 62], [100, 76]].map(([x, y]) => g(`translate(${x} ${y})`, path('M-8 0 L8 0 C8 6 4 8 0 8 C-4 8 -8 6 -8 0 Z', C.grey, C.ink, 1.4), line('M8 1 L14 -1', C.ink, 2))), path('M52 30 C66 22 76 26 84 40', 'none', HL, 2.4), path('M85 41 l-1 -6 l-5 3 Z', HL, HL, 1)),
  'familj.blodsband': all(group([MUM(30), KID(88, 0.6, { top: C.pink })]), path('M44 60 C58 50 70 52 82 64', 'none', C.red, 3.4), path('M60 30 C64 36 64 40 60 42 C56 40 56 36 60 30 Z', C.red, C.ink, 1.4)),
  'familj.förfader': all(frame(26, 52, g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: '#ffffff', top: C.dark })), 1.1), frame(64, 44, g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: GREY, hairStyle: 'long', top: C.brown })), 1), frame(98, 60, g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: C.hair, top: C.navy })), 0.9), T(60, 104, '1850', 12, C.brown)),
  'familj.härstamma': all(path('M10 24 C30 12 50 30 70 18 C90 8 104 20 112 14 L112 70 L10 70 Z', C.mint, C.ink, 1.6), path('M26 40 C26 32 38 32 38 40 C38 48 32 52 32 56 C32 52 26 48 26 40 Z', HL, C.ink, 1.4), house(76, 46, 0.7), path('M38 46 C52 70 70 84 84 90', 'none', HL, 2.4), group([KID(96, 0.42, { top: C.sky })], { ground: false })),
  'familj.ättling': all(frame(28, 42, all(g('translate(0 6) scale(0.3) translate(-60 -60)', figure({ hair: C.hair, top: C.red })), path('M-7 -12 L-7 -17 L-3 -14 L0 -18 L3 -14 L7 -17 L7 -12 Z', C.gold, C.ink, 0.8)), 1.1), path('M44 54 C58 74 70 84 80 90', 'none', HL, 2.4), path('M81 91 l-6 0 l2 -6 Z', HL, HL, 1), group([{ x: 96, h: 0.6, top: C.sky, mark: true }])),
  // ── Svärfamilj och ingifta ──────────────────────────────────────
  'familj.svärfamilj': inlaw(['mor', 'far', 'bror', 'syster'], { bracket: true }),
  'familj.svärförälder': inlaw(['mor', 'far']),
  'familj.svärmor': inlaw(['mor']),
  'familj.svärfar': inlaw(['far']),
  'familj.svåger': inlaw(['bror']),
  'familj.svägerska': inlaw(['syster']),
  'familj.svärdotter': all(group([GRAN(16, { h: 0.85 }), GRAMPS(40, { h: 0.88 }), DAD(72, { h: 0.82, mute: true }), MUM(98, { h: 0.78, top: C.purple, mark: true })]), heart(85, 24, 0.7)),
  'familj.svärson': all(group([GRAN(16, { h: 0.85 }), GRAMPS(40, { h: 0.88 }), MUM(72, { h: 0.78, mute: true }), DAD(98, { h: 0.82, top: C.navy, mark: true })]), heart(85, 24, 0.7)),
  'familj.maka': all(group([DAD(40, { top: C.navy, mute: true }), MUM(80, { top: C.white, mark: true })]), ring(60, 56)),
  'familj.äkta-make': all(group([DAD(40, { top: C.navy, mark: true }), MUM(80, { top: C.white, mute: true })]), ring(60, 56)),
  'familj.ingift': all(group([GRAN(14, { h: 0.8, mute: true }), GRAMPS(36, { h: 0.82, mute: true }), DAD(60, { h: 0.8, mute: true }), MUM(84, { h: 0.78, top: C.purple, mark: true }), KID(106, 0.45, { mute: true })]), ring(72, 50)),
  'familj.gifta-in-sig': all(group([GRAN(52, { h: 0.82, mute: true }), GRAMPS(74, { h: 0.84, mute: true }), DAD(96, { h: 0.8, top: C.navy, mute: true }), MUM(20, { h: 0.78, top: C.white, mark: true })]), path('M30 50 C38 42 44 42 48 46', 'none', HL, 2.6), path('M49 47 l-6 -1 l2 -5 Z', HL, HL, 1), ring(36, 34)),
  'familj.träffa-föräldrarna': all(group([GRAN(16, { h: 0.85 }), GRAMPS(38, { h: 0.88 }), DAD(78, { h: 0.82 }), MUM(100, { h: 0.78, top: C.purple, mark: true })]), line('M48 70 L68 70', C.skin, 5), heart(89, 28, 0.6)),
  'familj.presentera': all(group([MUM(22, { top: C.purple }), DAD(60, { top: C.green }), GRAN(98, { h: 0.9 })]), path('M64 30 L94 30 L94 44 L76 44 L70 50 L71 44 L64 44 Z', C.white, C.ink, 1.6), T(79, 41, 'Aiko', 9, C.navy), line('M50 64 L36 62', C.skin, 5)),
  'familj.välkomna': all(rect(80, 30, 34, 82, C.brown, 2, C.ink, 2), rect(84, 34, 26, 78, '#f6e7c8', 1, C.ink, 1.4), group([GRAN(30, { h: 0.88 }), GRAMPS(56, { h: 0.9 }), MUM(96, { h: 0.78, top: C.purple, mark: true })]), heart(44, 22, 0.8)),
  'familj.bli-en-del-av': all(group([DAD(20, { h: 0.8 }), MUM(44, { h: 0.78 }), KID(64, 0.5), MUM(96, { h: 0.78, top: C.purple, mark: true })]), path('M8 12 L74 12 L74 108', 'none', HL, 1.8), path('M80 58 C76 54 72 56 70 60', 'none', HL, 2.4), path('M69 61 l1 -6 l5 3 Z', HL, HL, 1)),
  'familj.svärmorsdröm': all(group([GRAN(28, { h: 0.88 }), DAD(84, { top: C.navy })]), heart(18, 22, 0.7), heart(38, 18, 0.9), g('translate(66 60)', line('M0 0 L0 -14 M-3 -2 L0 -14 M3 -2 L0 -14', C.green, 1.6), `<circle cy="-16" r="4" fill="${C.red}" stroke="${C.ink}" stroke-width="1"/><circle cx="-4" cy="-13" r="3.4" fill="${C.pink}" stroke="${C.ink}" stroke-width="1"/><circle cx="4" cy="-13" r="3.4" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1"/>`), T(84, 14, '★', 14, C.gold)),
  // ── Beskriva ett släktträd ──────────────────────────────────────
  'familj.släktträd': all(rect(54, 70, 12, 44, C.brown, 2, C.ink, 2), path('M60 8 C96 8 112 34 104 58 C98 76 76 80 60 76 C44 80 22 76 16 58 C8 34 24 8 60 8 Z', C.mint, C.ink, 2), node(60, 24, { r: 7 }), node(38, 44, { r: 7 }), node(82, 44, { r: 7 }), node(28, 64, { r: 6 }), node(48, 64, { r: 6 }), node(72, 64, { r: 6 }), node(92, 64, { r: 6 }), line('M60 31 L42 38 M60 31 L78 38 M38 51 L30 58 M38 51 L46 58 M82 51 L74 58 M82 51 L90 58', C.green, 1.4)),
  'familj.födelseår': all(node(60, 56, { r: 22, long: true }), yearTag(60, 96, '1952 –', true)),
  'familj.dödsår': all(node(60, 56, { r: 22, dead: true }), all(rect(28, 88, 64, 14, C.white, 3, C.ink, 1), T(46, 98, '1931 –', 9), rect(64, 88, 28, 14, HL, 3, null), T(78, 98, '2019', 9, C.white))),
  'familj.vara-gift-med': all(node(34, 56, { r: 16 }), node(86, 56, { r: 16, long: true }), line('M50 53 L70 53 M50 59 L70 59', HL, 2.4), g('translate(60 40)', circle(-3, 0, 4, 'none', C.gold, 2), circle(3, 0, 4, 'none', C.gold, 2))),
  'familj.skild': all(node(30, 56, { r: 16 }), node(90, 56, { r: 16, long: true }), line('M46 53 L74 53 M46 59 L74 59', C.ink, 1.6), line('M54 66 l6 -20 M62 66 l6 -20', HL, 3)),
  'familj.omgift': all(node(16, 44, { r: 11, long: true, mute: true }), node(60, 44, { r: 13, mark: true }), node(104, 44, { r: 11, long: true }), marry(16, 60, 44, 'skild'), marry(60, 104, 44, 'gift', true), kids(38, 44, [38], 88), kids(82, 44, [82], 88), node(38, 90, { r: 8, mute: true }), node(82, 90, { r: 8 })),
  'familj.ogift': all(node(60, 52, { r: 18, mark: true }), line('M84 52 L104 52', C.grey2, 2, '3 3'), circle(104, 52, 10, 'none', C.grey2, 2), T(104, 56, '?', 11, C.grey)),
  'familj.barnlös': all(node(34, 46, { r: 14 }), node(86, 46, { r: 14, long: true }), marry(34, 86, 46), line('M60 50 L60 74', C.grey2, 2, '3 3'), line('M71 86 A11 11 0 1 1 71 85.9', C.grey2, 2, '3 3'), line('M52 78 L68 94', HL, 2.6)),
  'familj.avliden': all(node(60, 54, { r: 24, dead: true }), path('M30 92 C42 100 78 100 90 92', 'none', C.grey, 2), path('M86 22 C90 16 98 18 96 26 C94 30 88 30 86 22 Z', C.white, C.grey, 1.2)),
  'familj.släktgren': all(node(60, 16, { r: 7 }), kids(60, 16, [28, 92], 46), node(28, 46, { r: 7, mute: true }), node(92, 46, { r: 7, mark: true }), kids(28, 46, [14, 42], 78), kids(92, 46, [78, 106], 78, true), node(14, 78, { r: 6, mute: true }), node(42, 78, { r: 6, mute: true }), node(78, 78, { r: 6, mark: true }), node(106, 78, { r: 6, mark: true }), kids(78, 78, [70, 86], 106, true), node(70, 106, { r: 5, mark: true }), node(86, 106, { r: 5, mark: true }), path('M66 34 L118 34 L118 116 L62 116 Z', 'none', HL, 1.6)),
  'familj.efterkommande': all(node(60, 16, { r: 8 }), kids(60, 16, [30, 90], 48, true), node(30, 48, { r: 7, mark: true }), node(90, 48, { r: 7, mark: true }), kids(30, 48, [18, 42], 80, true), kids(90, 48, [78, 102], 80, true), ...[18, 42, 78, 102].map((x) => node(x, 80, { r: 6, mark: true })), kids(42, 80, [42], 108, true), node(42, 108, { r: 5, mark: true })),
  'familj.bakåt-i-släkten': all(node(60, 104, { r: 8, mark: true }), node(60, 72, { r: 8 }), node(60, 42, { r: 8, mute: true }), node(60, 14, { r: 7, mute: true }), line('M60 96 L60 80 M60 64 L60 50 M60 34 L60 21', C.ink, 1.4), path('M88 104 L88 20', 'none', HL, 3), path('M88 14 l-6 9 l12 0 Z', HL, HL, 1), T(100, 60, '1700', 8, HL)),
  'familj.kyrkbok': all(path('M10 30 L58 34 L58 104 L10 100 Z', '#efe2c4', C.ink, 2), path('M110 30 L62 34 L62 104 L110 100 Z', '#efe2c4', C.ink, 2), rect(57, 32, 6, 74, '#6b4320', 1, C.ink, 1.4), ...[44, 54, 64, 74, 84].map((y) => path(`M16 ${y} C24 ${y - 3} 32 ${y + 3} 40 ${y} C46 ${y - 2} 50 ${y + 2} 54 ${y}`, 'none', '#6b4320', 1.2)), ...[44, 54, 64, 74, 84].map((y) => path(`M66 ${y} C74 ${y - 3} 82 ${y + 3} 90 ${y} C96 ${y - 2} 100 ${y + 2} 104 ${y}`, 'none', '#6b4320', 1.2)), path('M58 14 L62 14 L62 30 L58 30 Z M54 18 L66 18 L66 22 L54 22 Z', C.gold, C.ink, 1)),
  'familj.arkiv': all(rect(10, 12, 100, 100, '#c9a77a', 3, C.ink, 2), ...[16, 48, 80].map((y) => all(line(`M10 ${y + 28} L110 ${y + 28}`, C.ink, 2), ...[18, 42, 66, 90].map((x, i) => all(rect(x, y + 4, 20, 24, [C.white, '#e8dcc0', C.white, '#f1e5c9'][i]!, 1, C.ink, 1.4), rect(x + 6, y + 10, 8, 4, C.grey2, 1, C.ink, 0.8)))))),
  'familj.släktforskning': all(node(48, 24, { r: 7 }), kids(48, 24, [28, 68], 54), node(28, 54, { r: 7 }), node(68, 54, { r: 7 }), kids(28, 54, [18, 38], 84), node(18, 84, { r: 6 }), node(38, 84, { r: 6 }), circle(84, 70, 20, 'rgba(255,255,255,0.4)', C.navy, 3.4), line('M98 84 L112 100', C.navy, 6), node(84, 70, { r: 8, mark: true })),
  'familj.släktforskare': all(group([GRAMPS(30, { h: 0.9, top: C.green })]), path('M58 74 L108 70 L108 100 L58 104 Z', '#efe2c4', C.ink, 1.8), ...[78, 86, 94].map((y) => path(`M64 ${y} C72 ${y - 2} 80 ${y + 2} 100 ${y - 2}`, 'none', '#6b4320', 1.2)), circle(80, 62, 12, 'rgba(255,255,255,0.4)', C.navy, 3), line('M72 70 L62 80', C.navy, 4)),
  'familj.stamtavla': all(node(16, 60, { r: 9, mark: true }), line('M25 60 L36 60 M36 34 L36 86 M36 34 L48 34 M36 86 L48 86', C.ink, 1.6), node(56, 34, { r: 8 }), node(56, 86, { r: 8, long: true }), line('M64 34 L74 34 M74 18 L74 50 M74 18 L84 18 M74 50 L84 50 M64 86 L74 86 M74 70 L74 102 M74 70 L84 70 M74 102 L84 102', C.ink, 1.4), ...[18, 50, 70, 102].map((y, i) => node(92, y, { r: 7, long: i % 2 === 1 })), T(108, 20, '…', 10), T(108, 104, '…', 10)),
  'familj.ha-sina-rötter-i': all(rect(8, 70, 104, 44, '#a0673d', 8, null), group([MUM(60, { top: C.purple, h: 0.6 })], { ground: false }), path('M54 70 C50 82 40 90 26 96 M60 70 C60 84 58 96 60 108 M66 70 C70 82 80 90 94 96 M57 74 C50 90 38 102 30 108 M63 74 C70 90 82 102 90 108', 'none', HL, 2.6), g('translate(96 26)', rect(-14, -10, 28, 20, C.white, 1, C.ink, 1.4), circle(0, 0, 5.5, C.red, null)), g('translate(22 26)', rect(-14, -10, 28, 20, '#2f6fb5', 1, C.ink, 1.4), rect(-14, -2, 28, 4, C.yellow, 0, null), rect(-6, -10, 4, 20, C.yellow, 0, null))),
};
function star2(x: number, y: number): Svg { return g(`translate(${x} ${y})`, path('M0 -7 L2 -2 L7 -2 L3 1 L4.5 6 L0 3 L-4.5 6 L-3 1 L-7 -2 L-2 -2 Z', C.yellow, C.ink, 1)); }
