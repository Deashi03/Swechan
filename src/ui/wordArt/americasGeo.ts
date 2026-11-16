/**
 * Natur & geografi → Världsgeografi → Amerika, 3041–3047 (0.47): North America's natural regions, Central America,
 * the Andes, the Amazon rainforest, the Caribbean islands, the countries and capitals of the Americas, and the big
 * city regions. Recurring signs: simplified maps seen from above (sea blue, land pale green, what the word names in
 * orange with an orange outline, land the word is not about grey), landscape and animal scenes, demonyms as a person
 * next to a highlighted map. Digits only; no words, no flags, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, bubble } from './people';
import { P, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#d6ecf8';
const SEA = '#8cc4e6';
const SEA2 = '#5fa3d0';
const LAND = '#d7e6c0';
const LAND2 = '#8cc96a';
const GREEN = '#4f9d4a';
const GREEN2 = '#3a7d3a';
const DARKF = '#2f6e3e';
const OTHER = '#d9d6d0';
const HLF = '#f6b48e';
const SAND = '#ecd49a';
const DRY = '#d9b07a';
const ROCK = '#9a8a78';
const SNOW = '#f7f8fa';
const WOOD = '#a0673d';
const WOOD2 = '#7a4a28';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND2) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.ink, 1));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5.5))} ${f1(y + Math.sin(a) * (r + 5.5))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const cloud = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M-22 8 C-31 8 -31 -4 -20 -4 C-21 -14 -7 -18 -2 -9 C2 -21 22 -19 20 -4 C31 -5 31 8 22 8 Z', fill, C.ink, f1(1.3 / s)));
const waves = (x1: number, x2: number, y: number, col: string = C.white, sw = 1.1) => line(range(Math.floor((x2 - x1) / 10)).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, sw);
const mountain = (x1: number, x2: number, px: number, py: number, base = 112, col: string = ROCK, snowY = 0) => all(path(`M${x1} ${base} L${px} ${py} L${x2} ${base} Z`, col, C.ink, 1.3), snowY ? path(`M${f1(px - ((px - x1) * (snowY - py)) / (base - py))} ${snowY} L${px} ${py} L${f1(px + ((x2 - px) * (snowY - py)) / (base - py))} ${snowY} L${f1(px + 4)} ${snowY - 3} L${px} ${snowY + 2} L${f1(px - 5)} ${snowY - 3} Z`, SNOW, C.ink, 1) : '');
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const tri = (x: number, y: number, s = 1, col: string = ROCK, cap = false) => all(path(`M${f1(x - 4 * s)} ${y} L${x} ${f1(y - 6 * s)} L${f1(x + 4 * s)} ${y} Z`, col, C.ink, 0.8), cap ? path(`M${f1(x - 1.6 * s)} ${f1(y - 3.6 * s)} L${x} ${f1(y - 6 * s)} L${f1(x + 1.6 * s)} ${f1(y - 3.6 * s)} Z`, SNOW, null) : '');
const hump = (x: number, y: number, s = 1, col: string = '#7fae5a') => path(`M${f1(x - 5 * s)} ${y} C${f1(x - 4 * s)} ${f1(y - 4 * s)} ${f1(x + 4 * s)} ${f1(y - 4 * s)} ${f1(x + 5 * s)} ${y} Z`, col, C.ink, 0.8);
const ship = (x: number, y: number, s = 1, col: string = '#c44a3a') => at(x, y, s, path('M-12 -3 L12 -3 L9 3 L-9 3 Z', col, C.ink, 1), rect(-6, -8, 9, 5, C.white, 1, C.ink, 0.9), rect(4, -10, 3, 7, C.dark, 0.5, null));
const palmTree = (x: number, y = 112, s = 1) => at(x, y, s, path('M-1.5 0 C-2 -12 0 -24 3 -34 L6 -33 C3 -24 2 -12 2.5 0 Z', C.brown, C.ink, 1), path('M4 -34 C-6 -40 -16 -36 -20 -28 C-12 -34 -4 -34 4 -34 Z M4 -34 C14 -42 24 -38 26 -30 C18 -36 10 -35 4 -34 Z M4 -34 C0 -46 8 -52 14 -50 C8 -46 6 -40 4 -34 Z M4 -34 C-6 -46 -14 -44 -16 -40 C-8 -42 -2 -40 4 -34 Z', GREEN, C.ink, 1));
const tree = (x: number, y: number, s = 1, col: string = GREEN) => at(x, y, s, rect(-1.5, -10, 3, 10, WOOD2, 0, C.ink, 0.6), circle(0, -15, 8, col, C.ink, 1), circle(-6, -11, 5, col, C.ink, 0.9), circle(6, -11, 5, col, C.ink, 0.9));
const person = (x: number, h = 0.5, top: string = C.orange, more = {}) => P({ x, h, top, ...more });
const lift = (dy: number, ...k: Svg[]) => g(`translate(0 ${dy})`, ...k);
const house = (x: number, y: number, w: number, h: number, col: string, roof: string = '#b8503a') => all(rect(x, y - h, w, h, col, 0, C.ink, 0.8), path(`M${x - 1} ${y - h} L${f1(x + w / 2)} ${f1(y - h - w * 0.4)} L${x + w + 1} ${y - h} Z`, roof, C.ink, 0.8), rect(f1(x + w / 2 - 1.2), y - 3.5, 2.4, 3.5, C.dark, 0, null));
const box = (x: number, y: number, w: number, h: number, col: string) => all(rect(x, y - h, w, h, col, 0, C.ink, 0.7), rect(f1(x + w / 2 - 1), f1(y - h + 1.5), 2, 2, '#3d5a7a', 0, null));
const tower = (x: number, w: number, top: number, col = '#9fc4dc', base = 112) => all(rect(x, top, w, base - top, col, 0.5, C.ink, 1), line(range(Math.floor((base - top - 4) / 5)).map((i) => `M${f1(x + 2)} ${top + 4 + i * 5} L${f1(x + w - 2)} ${top + 4 + i * 5}`).join(' '), 'rgba(255,255,255,0.7)', 1));

// ── Map of North America ─────────────────────────────────────────────
const NA = 'M4 22 L12 12 L28 8 L50 6 L72 6 L86 10 L94 16 L102 22 L108 30 L104 36 L98 38 L94 44 L88 50 L86 58 L80 62 L84 66 L86 74 L82 74 L78 66 L70 64 L62 66 L58 72 L60 80 L66 78 L70 82 L74 84 L76 88 L70 92 L66 98 L62 104 L58 102 L52 96 L46 86 L40 76 L34 66 L32 72 L29 66 L26 58 L22 50 L18 42 L14 34 L8 30 Z';
const HUDSON = 'M62 16 L74 14 L80 22 L76 32 L68 32 L62 24 Z';
const GULF = 'M62 67 L78 67 L82 75 L76 82 L71 81 L67 78 L60 79 L59 72 Z';
const LAKES: [number, number, number, number][] = [[69, 42, 4.2, 1.5], [75, 47, 1.3, 3.2], [79.5, 44.5, 2, 2.4], [82, 50, 3, 1], [87.5, 47.5, 2.6, 1]];
const ROCKIES: [number, number][] = [[14, 26], [17, 31], [20, 36], [23, 41], [26, 46], [29, 51], [32, 56], [35, 61]];
const APP: [number, number][] = [[86, 49], [83, 53], [80, 57], [77, 61]];
const na = (o: { gulf?: boolean; lakes?: boolean; rockies?: 'hl' | 'grey' | ''; app?: 'hl' | 'grey' | ''; river?: boolean } = {}, extra: Svg = '') => all(
  rect(4, 4, 112, 108, SEA, 3, null),
  path(NA, LAND, C.ink, 1.1),
  path('M100 4 L116 4 L116 20 L108 24 L102 16 Z', LAND, C.ink, 1),
  path(HUDSON, SEA, C.ink, 1),
  path('M80 80 L90 78 L100 82 L90 83 Z', LAND, C.ink, 0.8),
  o.gulf ? path(GULF, HLF, HL, 2.6) : '',
  ...LAKES.map(([x, y, rx, ry]) => ellipse(x, y, rx, ry, o.lakes ? SEA : SEA, o.lakes ? HL : C.ink, o.lakes ? 1.6 : 0.6)),
  o.rockies === 'hl' ? path('M10 24 L18 22 L28 38 L36 52 L42 64 L34 66 L26 52 L18 38 Z', HLF, HL, 2.2) : '',
  o.app === 'hl' ? path('M88 46 L91 50 L82 62 L76 65 L74 60 L82 52 Z', HLF, HL, 2.2) : '',
  ...(o.rockies ? ROCKIES.map(([x, y]) => tri(x + 2, y + 4, 1.1, o.rockies === 'hl' ? '#8a7a68' : '#b8b2a8', o.rockies === 'hl')) : []),
  ...(o.app ? APP.map(([x, y]) => hump(x, y + 3, 1, o.app === 'hl' ? '#5f9a4a' : '#c4c0b8')) : []),
  o.river ? all(line('M66 34 C63 42 68 48 65 55 C63 60 68 63 67 67', C.ink, 4.6), line('M66 34 C63 42 68 48 65 55 C63 60 68 63 67 67', HL, 3), line('M40 40 C50 44 58 48 65 52 M82 50 C76 54 70 54 66 56', SEA2, 1.4)) : '',
  extra);

// ── Map of Central America and the Caribbean ─────────────────────────
const MEXS = 'M4 4 L40 4 L42 16 L36 26 L34 36 L40 44 L50 46 L54 38 L52 28 L58 22 L70 22 L72 30 L66 40 L62 50 L58 54 L48 56 L38 54 L26 48 L16 40 L8 30 L4 26 Z';
const YUC = 'M52 28 L58 22 L70 22 L72 30 L66 40 L60 44 L54 38 Z';
const CAM = 'M38 54 L48 56 L58 54 L62 50 L66 52 L68 60 L74 68 L80 74 L86 80 L92 84 L96 82 L100 86 L94 92 L88 90 L82 86 L74 80 L66 74 L58 66 L50 62 L42 60 Z';
const SAM = 'M96 82 L106 76 L116 76 L116 112 L80 112 L84 100 L94 92 L100 86 Z';
const FLA = 'M62 4 L76 4 L80 10 L78 18 L74 12 L66 8 Z';
const CUBA = 'M66 20 L78 14 L92 18 L102 24 L98 28 L88 26 L78 22 L70 24 Z';
const HISP = 'M102 28 L110 26 L114 30 L110 35 L103 34 Z';
const JAM = 'M84 33 L92 32 L94 36 L86 37 Z';
const PR = 'M111 37 L115 37 L115 40 L111 40 Z';
const LESSER: [number, number][] = [[112, 46], [113, 51], [112, 56], [113, 61], [112, 66], [110, 71], [106, 74]];
const CARIB = 'M58 54 L62 50 L66 40 L72 30 L80 26 L92 30 L102 30 L106 36 L108 46 L110 60 L106 70 L100 76 L96 82 L92 84 L86 80 L80 74 L74 68 L68 60 L66 52 Z';
const cam = (o: { yuc?: boolean; carib?: boolean; big?: boolean; small?: boolean; greyNorth?: boolean } = {}, extra: Svg = '') => all(
  rect(4, 4, 112, 108, SEA, 3, null),
  o.carib ? path(CARIB, HLF, null) : '',
  path(MEXS, o.greyNorth ? OTHER : LAND, C.ink, 1.1),
  o.yuc ? path(YUC, HLF, HL, 2.6) : '',
  path(CAM, LAND, C.ink, 1.1),
  path(SAM, o.greyNorth ? OTHER : LAND, C.ink, 1.1),
  path(FLA, o.greyNorth ? OTHER : LAND, C.ink, 1),
  ...[CUBA, HISP, JAM, PR].map((d) => path(d, o.big ? HLF : LAND, o.big ? HL : C.ink, o.big ? 2 : 0.9)),
  ...LESSER.map(([x, y]) => ellipse(x, y, 1.6, 1.4, o.small ? HLF : LAND, o.small ? HL : C.ink, o.small ? 1.4 : 0.7)),
  o.carib ? path(CARIB, 'none', HL, 2.4) : '',
  extra);

// ── Map of South America ─────────────────────────────────────────────
const SA = 'M30 8 L50 6 L66 10 L80 16 L96 22 L110 34 L108 44 L100 52 L92 62 L84 72 L72 80 L62 92 L54 104 L50 112 L44 112 L42 100 L40 86 L36 72 L30 60 L24 46 L22 32 L24 20 Z';
const ANDES = 'M30 8 L36 8 L30 22 L30 34 L36 48 L42 62 L46 78 L48 96 L52 110 L46 112 L42 100 L40 86 L36 72 L30 60 L24 46 L22 32 L24 20 Z';
const sam = (o: { andes?: boolean; river?: boolean; atacama?: boolean; lake?: boolean } = {}, extra: Svg = '') => all(
  rect(4, 4, 112, 108, SEA, 3, null),
  path('M4 4 L30 4 L30 8 L24 14 L12 10 L4 12 Z', OTHER, C.ink, 1),
  path(SA, LAND, C.ink, 1.2),
  o.andes ? path(ANDES, HLF, HL, 2.4) : path(ANDES, '#e4dcc8', null),
  ...[[30, 16], [28, 28], [30, 40], [35, 52], [39, 64], [42, 76], [44, 88], [46, 100]].map(([x, y]) => tri(x!, y!, 1, o.andes ? '#8a7a68' : '#b8ac98', !!o.andes)),
  o.atacama ? path('M33 58 L38 57 L42 72 L37 74 Z', HLF, HL, 2.2) : '',
  o.lake ? all(ellipse(40, 50, 2.8, 1.8, SEA, C.ink, 0.8), ring(40, 50, 6)) : '',
  o.river ? all(path('M32 30 C44 32 56 26 68 30 C80 34 90 30 104 32', 'none', C.ink, 5), path('M32 30 C44 32 56 26 68 30 C80 34 90 30 104 32', 'none', HL, 3.2), line('M50 44 C52 38 54 34 56 28 M64 50 C66 42 66 36 68 31 M80 48 C80 42 82 36 84 32 M48 16 C50 22 54 26 58 28 M76 18 C76 24 78 28 80 32', SEA2, 1.3)) : '',
  extra);

// ── Map of the Atlantic (languages) ──────────────────────────────────
const AT_NA = 'M4 8 L30 6 L40 12 L40 22 L34 30 L30 38 L24 40 L22 46 L16 42 L10 34 L4 32 Z';
const AT_CA = 'M16 42 L22 46 L28 50 L32 54 L30 56 L22 52 Z';
const AT_SA = 'M30 56 L40 54 L50 60 L54 68 L48 80 L42 92 L38 106 L34 106 L32 90 L30 76 L28 64 Z';
const AT_BR = 'M36 58 L40 54 L50 60 L54 68 L48 80 L42 86 L38 80 L36 70 Z';
const AT_EU = 'M84 6 L116 6 L116 30 L104 30 L98 28 L92 24 L86 18 Z';
const AT_IB = 'M84 24 L96 24 L98 30 L92 34 L84 32 Z';
const AT_PT = 'M84 25 L87 25 L87 33 L84 32 Z';
const AT_AF = 'M84 38 L104 36 L116 40 L116 112 L104 112 L100 84 L90 64 L82 54 L80 44 Z';
const atlantic = (lang: 'es' | 'pt') => all(
  rect(4, 4, 112, 108, SEA, 3, null),
  path(AT_NA, LAND, C.ink, 1), path(AT_EU, LAND, C.ink, 1), path(AT_AF, OTHER, C.ink, 1),
  path(AT_CA, lang === 'es' ? HLF : LAND, lang === 'es' ? HL : C.ink, lang === 'es' ? 1.8 : 1),
  path(AT_SA, lang === 'es' ? HLF : LAND, lang === 'es' ? HL : C.ink, lang === 'es' ? 2 : 1),
  path(AT_BR, lang === 'pt' ? HLF : LAND, lang === 'pt' ? HL : C.ink, lang === 'pt' ? 2 : 1),
  path('M14 34 L24 40 L22 46 L16 42 Z', lang === 'es' ? HLF : LAND, lang === 'es' ? HL : C.ink, lang === 'es' ? 1.8 : 0.8),
  path(AT_IB, lang === 'es' ? HLF : LAND, lang === 'es' ? HL : C.ink, lang === 'es' ? 2 : 1),
  path(AT_PT, lang === 'pt' ? HLF : LAND, lang === 'pt' ? HL : C.ink, lang === 'pt' ? 2 : 0.8),
  lang === 'es' ? path(AT_BR, LAND, C.ink, 1) : '');

// ── Map of the Americas (demonyms) ───────────────────────────────────
const AM: Record<'CAN' | 'USA' | 'MEX' | 'CAM' | 'BRA' | 'SAR', string> = {
  CAN: 'M2 14 L10 6 L30 4 L50 4 L62 8 L70 14 L66 20 L58 22 L54 24 L44 22 L20 22 L12 20 L6 20 Z',
  USA: 'M12 20 L20 22 L44 22 L54 24 L58 22 L62 24 L58 30 L56 36 L54 42 L50 39 L44 40 L36 40 L28 43 L20 38 L14 32 Z',
  MEX: 'M14 32 L20 38 L28 42 L36 40 L36 46 L40 50 L36 54 L30 52 L24 46 L18 40 Z',
  CAM: 'M36 54 L40 50 L44 54 L50 60 L48 62 L42 58 Z',
  BRA: 'M54 62 L66 62 L80 70 L82 78 L74 90 L66 98 L60 96 L58 86 L52 80 L48 72 Z',
  SAR: 'M48 62 L54 62 L48 72 L52 80 L58 86 L60 96 L66 98 L56 104 L52 116 L48 116 L46 102 L44 88 L42 76 L44 68 Z',
};
const americas = (hl: keyof typeof AM) => at(48, 7, 0.68, ...(Object.keys(AM) as (keyof typeof AM)[]).map((k) => path(AM[k], k === hl ? HLF : LAND, k === hl ? HL : C.ink, k === hl ? 3.4 : 1.4)), path('M2 14 L6 20 L12 20 L14 32 L4 26 Z', hl === 'USA' ? HLF : LAND, hl === 'USA' ? HL : C.ink, 1.4));
/** Country highlighted on a mini map of the Americas + a person next to it (demonyms). */
const demonym = (hl: keyof typeof AM, top: string) => all(bg('#f2efe8'), rect(40, 6, 74, 80, SEA, 3, C.ink, 1.2), americas(hl), line('M30 50 L44 44', C.grey, 1.2, '3 2'), P({ x: 24, h: 0.72, top, bottom: C.navy, mood: 'smile' }));

// ── Animals, plants and things ───────────────────────────────────────
const grizzly = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-26 -4 C-30 -18 -22 -32 -6 -34 C0 -40 10 -38 14 -32 C22 -30 26 -24 26 -16 L26 -4 Z', '#8a5a34', C.ink, 1.4),
  path('M-4 -36 C0 -42 8 -42 12 -36', 'none', '#6a4424', 3),
  rect(-22, -8, 9, 12, '#7a4a28', 2, C.ink, 1), rect(14, -8, 9, 12, '#7a4a28', 2, C.ink, 1),
  circle(28, -26, 9, '#8a5a34', C.ink, 1.3), circle(24, -34, 3, '#8a5a34', C.ink, 1), circle(33, -33, 3, '#8a5a34', C.ink, 1),
  ellipse(34, -23, 4.4, 3.4, '#c8a07a', C.ink, 0.9), circle(37, -24, 1.3, C.ink, null), circle(29, -28, 1.2, C.ink, null),
  path('M-4 -36 C2 -40 8 -40 14 -33', 'none', '#c8a07a', 1));
const fish = (x: number, y: number, s = 1, col = '#c0c8d0') => at(x, y, s, path('M-8 0 C-4 -5 4 -5 8 0 C4 5 -4 5 -8 0 Z M-8 0 L-13 -4 L-13 4 Z', col, C.ink, 0.9), circle(5, -1, 0.8, C.ink, null));
const toucan = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-6 -10 C-12 -2 -12 14 -6 22 L4 24 C8 14 8 0 4 -10 Z', '#22222a', C.ink, 1.2),
  path('M-4 -8 C2 -10 6 -6 6 0 C2 2 -4 0 -4 -8 Z', '#f6e08a', C.ink, 0.8),
  circle(0, -12, 7, '#22222a', C.ink, 1.2), circle(2, -13, 2.6, '#9ed65a', null), circle(2, -13, 1.2, C.ink, null),
  path('M5 -16 C16 -20 28 -16 32 -8 C24 -6 14 -6 5 -8 Z', '#f29a2e', C.ink, 1.2), path('M24 -13 C28 -11 30 -9 32 -8 C28 -7 25 -8 23 -9 Z', '#d64545', null), path('M5 -12 L30 -10', 'none', C.ink, 0.6),
  path('M-6 22 L-8 34 M2 24 L2 34', 'none', C.ink, 1.4), path('M-2 24 L-10 30 L-2 32 Z', '#d64545', C.ink, 0.8));
const condor = (x: number, y: number, s = 1) => at(x, y, s,
  path('M0 0 C-10 -6 -26 -8 -48 -4 L-44 -1 L-48 2 L-42 3 L-46 6 L-38 6 C-24 6 -10 6 0 4 Z', '#1f1f26', C.ink, 1),
  path('M0 0 C10 -6 26 -8 48 -4 L44 -1 L48 2 L42 3 L46 6 L38 6 C24 6 10 6 0 4 Z', '#1f1f26', C.ink, 1),
  path('M-24 0 C-16 -2 -8 -2 -4 0 M24 0 C16 -2 8 -2 4 0', 'none', C.white, 1.6),
  ellipse(0, 4, 5, 9, '#1f1f26', C.ink, 1), path('M-4 -4 C-2 -2 2 -2 4 -4 C2 -6 -2 -6 -4 -4 Z', C.white, C.ink, 0.6),
  circle(0, -8, 3.2, '#c97a6a', C.ink, 0.9), path('M0 -10 L2 -13 L3 -10 Z', '#c97a6a', null), path('M-1 -6 L1 -3 L2 -6', '#e8d8c0', null));
const jaguar = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-24 -10 C-24 -20 -12 -22 4 -21 C14 -21 20 -18 22 -14 L22 -6 C20 -4 16 -4 14 -6 L-18 -6 C-22 -6 -24 -8 -24 -10 Z', '#e8b04a', C.ink, 1.2),
  line('M-18 -7 L-19 0 M-12 -7 L-12 0 M12 -7 L12 0 M18 -7 L19 0', '#e0a640', 3.8), line('M-18 -7 L-19 0 M-12 -7 L-12 0 M12 -7 L12 0 M18 -7 L19 0', C.ink, 0.5),
  circle(25, -17, 7, '#e8b04a', C.ink, 1.2), path('M20 -23 L21 -27 L24 -24 Z M27 -24 L29 -27 L30 -22 Z', '#e8b04a', C.ink, 0.8), circle(27, -18, 1, C.ink, null), ellipse(30.5, -14.6, 1.6, 1.1, '#3a2a2a', null),
  path('M-24 -12 C-34 -12 -38 -4 -34 2', 'none', '#e8b04a', 3), path('M-24 -12 C-34 -12 -38 -4 -34 2', 'none', C.ink, 0.5),
  ...[[-16, -16], [-8, -18], [0, -17], [8, -16], [-12, -11], [-2, -11], [8, -10], [16, -12]].map(([a, b]) => all(circle(a!, b!, 2, 'none', '#2a2222', 1.1), circle(a!, b!, 0.6, '#2a2222', null))),
  ...[[18, -16], [22, -11], [-30, -8]].map(([a, b]) => circle(a!, b!, 0.9, '#2a2222', null)));
const sloth = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-14 0 C-18 10 -12 22 0 22 C12 22 18 10 14 0 C8 -4 -8 -4 -14 0 Z', '#a8906a', C.ink, 1.3),
  line('M-12 2 L-16 -10 M12 2 L16 -10 M-8 20 L-12 30 M8 20 L12 30', '#a8906a', 4), line('M-16 -10 l-2 -3 M-16 -10 l1 -3 M16 -10 l-1 -3 M16 -10 l2 -3', C.ink, 1),
  circle(0, 28, 8, '#a8906a', C.ink, 1.2), ellipse(0, 28, 6, 4.6, '#e6d6b8', C.ink, 0.8), path('M-5 27 C-4 25 -2 25 -1 27 M1 27 C2 25 4 25 5 27', '#5a4630', null), circle(-3, 27, 0.8, C.ink, null), circle(3, 27, 0.8, C.ink, null), path('M-2 31 Q0 32.5 2 31', 'none', C.ink, 0.8));
const piranha = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-20 0 C-14 -14 10 -16 20 -4 L22 0 L20 6 C10 14 -14 12 -20 0 Z', '#8a96a4', C.ink, 1.2),
  path('M-14 4 C-6 12 10 12 18 4 L18 6 C10 14 -14 12 -16 6 Z', '#d64545', null),
  path('M-20 0 L-30 -8 L-28 0 L-30 8 Z', '#8a96a4', C.ink, 1.1),
  path('M12 0 L22 0 L20 6 Z', '#5a2a2a', C.ink, 0.8), path('M13 0 L14.5 2.6 L16 0 L17.5 2.6 L19 0 L20.5 2.6 L22 0', C.white, C.ink, 0.6),
  circle(12, -5, 2, '#f2c14e', C.ink, 0.8), circle(12, -5, 0.9, C.ink, null),
  ...range(10).map((i) => circle(-12 + (i % 5) * 5, -5 + Math.floor(i / 5) * 4, 0.7, '#5a6470', null)));
const anaconda = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-50 10 C-40 -6 -20 -6 -10 6 C0 18 20 18 30 4 C36 -4 42 -6 48 -4', 'none', C.ink, 11), path('M-50 10 C-40 -6 -20 -6 -10 6 C0 18 20 18 30 4 C36 -4 42 -6 48 -4', 'none', '#6a8a3a', 8.6),
  ...[[-44, 2], [-34, -2], [-22, 0], [-12, 6], [-2, 13], [10, 14], [22, 10], [32, 2]].map(([a, b]) => ellipse(a!, b!, 2, 1.4, '#2a3a1a', null)),
  ellipse(52, -4, 7, 4.4, '#6a8a3a', C.ink, 1.2), circle(54, -6, 1.1, '#f2c14e', C.ink, 0.5), path('M59 -3 l4 1 l-2 1 l2 1 l-4 0', 'none', '#d64545', 0.8));
const coffeeBush = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 C-11 -8 -5 -12 0 -11 C5 -12 11 -8 8 0 Z', '#2f7a3a', C.ink, 0.9), ...[[-4, -5], [2, -7], [5, -3], [-1, -2]].map(([a, b]) => circle(a!, b!, 1.2, '#d64545', null)));
const reedBoat = (x: number, y: number, s = 1) => at(x, y, s, path('M-20 -2 C-14 4 14 4 20 -2 C22 -6 24 -8 22 -10 C18 -4 -18 -4 -22 -10 C-24 -8 -22 -6 -20 -2 Z', '#d8b860', C.ink, 1.1), line('M-16 -2 L16 -2 M-18 -5 L18 -5', '#a88a3a', 0.8), line('M0 -4 L0 -26', WOOD2, 1.4), path('M0 -26 L12 -10 L0 -8 Z', '#e8dcc0', C.ink, 0.8));
const quinoaHead = (x: number, y: number, col: string, s = 1) => at(x, y, s, line('M0 0 L0 -20', '#6a8a3a', 1.6), ...range(9).map((i) => circle(f1(((i % 3) - 1) * 3), f1(-22 - Math.floor(i / 3) * 3.4), 2.4, col, C.ink, 0.5)), path('M0 -8 C-6 -10 -8 -6 -6 -4 Z M0 -12 C6 -14 8 -10 6 -8 Z', '#7a9a4a', C.ink, 0.5));
const calendar = (hl: number[]) => all(rect(10, 22, 100, 84, C.white, 3, C.ink, 1.4), rect(10, 22, 100, 12, '#7aa6c8', 3, C.ink, 1.4), ...[24, 48, 72, 96].map((x) => all(rect(x - 2, 17, 4, 9, C.grey, 1, C.ink, 0.8))),
  ...range(12).map((i) => { const cx = 23 + (i % 4) * 25, cy = 50 + Math.floor(i / 4) * 22, on = hl.includes(i + 1); return all(rect(cx - 10, cy - 9, 20, 18, on ? HLF : '#f2f0ea', 2, on ? HL : C.grey2, on ? 1.8 : 1), num(cx, cy + 3.5, String(i + 1), 9, on ? C.ink : C.grey)); }));
const spiral = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 3, C.white, C.ink, 1), path('M0 -3 C8 -10 16 -2 12 6 M3 0 C10 8 2 16 -6 12 M0 3 C-8 10 -16 2 -12 -6 M-3 0 C-10 -8 -2 -16 6 -12', 'none', '#5a6aa0', 2.6));
const cruise = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-48 0 L46 0 L40 14 L-40 14 Z', '#2f4a7a', C.ink, 1.3), path('M-48 0 L46 0 L44 5 L-46 5 Z', C.white, null),
  rect(-40, -10, 78, 10, C.white, 1, C.ink, 1.1), rect(-32, -19, 62, 9, C.white, 1, C.ink, 1.1), rect(-24, -27, 44, 8, C.white, 1, C.ink, 1.1),
  ...range(18).map((i) => circle(-36 + i * 4.2, -5, 1.2, '#5a8ab8', null)), ...range(14).map((i) => circle(-28 + i * 4.2, -14.5, 1.1, '#5a8ab8', null)), ...range(10).map((i) => circle(-20 + i * 4.2, -23, 1, '#5a8ab8', null)),
  rect(2, -38, 10, 11, '#d64545', 1, C.ink, 1), rect(2, -38, 10, 3, C.dark, 0, null));
const bill = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-26, -13, 52, 26, '#b8d8a8', 2, C.ink, 1.3), rect(-22, -9, 44, 18, 'none', 1.5, '#4f8a4a', 1), ellipse(0, 0, 8, 8, '#d8ecc8', '#4f8a4a', 1), num(0, 4.2, '$', 12, '#2f6a3a'), num(-16, -1.5, '1', 6, '#2f6a3a'), num(16, 7, '1', 6, '#2f6a3a'));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1), circle(x, y, f1(r * 0.55), 'none', '#b88a20', 0.9));
const waveLines = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#f4f0e6', 0, C.ink, 1), ...range(Math.floor(h / 5)).map((i) => path(range(Math.floor(w / 10)).map((j) => `${j === 0 ? `M${x} ${y + 3 + i * 5}` : ''} q2.5 -3 5 0 t5 0`).join(''), 'none', '#2b2a33', 1.5)));
const feather = (x: number, y: number, rot: number, col: string) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 C-3 -6 -3 -14 0 -20 C3 -14 3 -6 0 0 Z', col, C.ink, 0.6));
const dancer = (x: number, top: string, plume: string[]) => all(...plume.map((c, i) => feather(x, 70, -50 + i * 25, c)), person(x, 0.5, top, { bottom: top }), line(`M${x - 6} 74 L${x - 14} 64 M${x + 6} 74 L${x + 14} 64`, C.skin, 2.6));
const drum = (x: number, y: number) => all(rect(x - 6, y - 8, 12, 12, '#d64545', 1, C.ink, 1), ellipse(x, y - 8, 6, 2, '#f2efe8', C.ink, 0.9), line(`M${x - 4} ${y - 6} L${x + 4} ${y + 2} M${x + 4} ${y - 6} L${x - 4} ${y + 2}`, C.gold, 0.8));
const confetti = all(...range(26).map((i) => rect(f1(8 + ((i * 37) % 104)), f1(8 + ((i * 23) % 40)), 2.2, 1.4, [C.red, C.yellow, '#3a9a5a', C.denim, C.pink][i % 5]!, 0.3, null)));
const fenceLine = (x: number, y1: number, y2: number) => all(line(`M${x} ${y1} L${x} ${y2}`, C.dark, 2), ...range(Math.floor((y2 - y1) / 6)).map((i) => line(`M${x - 2} ${y1 + 3 + i * 6} L${x + 2} ${y1 + 3 + i * 6}`, C.dark, 1)));

export const AMERICAS_GEO_MOTIFS: Record<string, Svg> = {
  // 3041 Nordamerikas naturregioner
  'gam.Klippiga-bergen': all(na({ rockies: 'hl', app: 'grey' }), at(86, 96, 1, rect(-22, -14, 34, 22, SKY, 2, C.ink, 1), path('M-22 8 L-14 -8 L-8 0 L-2 -12 L4 -2 L12 8 Z', ROCK, C.ink, 1), path('M-16 -4 L-14 -8 L-12 -4 Z M-4 -8 L-2 -12 L0 -8 Z', SNOW, null))),
  'gam.Appalacherna': all(na({ rockies: 'grey', app: 'hl' }), at(28, 96, 1, rect(-18, -14, 36, 22, SKY, 2, C.ink, 1), path('M-18 8 C-12 -4 -6 -4 -2 2 C2 -6 10 -6 18 8 Z', '#6aa44a', C.ink, 1), ...[[-12, 2], [-6, 0], [4, -1], [10, 2]].map(([a, b]) => circle(a!, b!, 2, GREEN2, null)))),
  'gam.Stora-sjöarna': all(rect(4, 4, 112, 108, LAND, 3, null), line('M4 30 L40 30 L56 52 L70 64 L84 62 L116 46', C.grey, 1.2, '4 3'),
    path('M10 22 C20 14 40 12 52 16 C56 20 50 24 42 24 C34 30 22 32 14 30 C8 28 6 26 10 22 Z', SEA, HL, 2.2),
    path('M48 36 C52 34 56 38 54 50 C54 62 52 74 46 78 C42 74 42 62 44 50 C44 42 44 38 48 36 Z', SEA, HL, 2.2),
    path('M58 30 C64 26 72 30 72 38 C76 44 76 54 68 58 C64 54 66 46 60 42 C56 38 54 34 58 30 Z', SEA, HL, 2.2),
    path('M58 82 C66 74 78 68 90 66 C94 68 90 72 82 76 C74 82 64 88 58 86 Z', SEA, HL, 2.2),
    path('M92 58 C98 54 108 52 112 54 C112 58 104 62 96 62 C92 62 90 60 92 58 Z', SEA, HL, 2.2),
    line('M90 64 L94 62', SEA2, 2), circle(92, 63, 1.6, C.white, C.ink, 0.8)),
  'gam.Mississippifloden': na({ river: true }),
  'gam.Mexikanska-golfen': na({ gulf: true }, waves(64, 76, 74, C.white, 0.9)),
  'gam.Niagarafallen': all(bg(), path('M4 30 L116 30 L116 40 C96 44 76 58 60 58 C44 58 24 44 4 40 Z', '#8cc4e6', C.ink, 1), waves(10, 110, 35),
    path('M4 40 C24 44 44 58 60 58 C76 58 96 44 116 40 L116 86 L4 86 Z', '#e4f2f8', C.ink, 1.2),
    ...range(15).map((i) => { const x = 6 + i * 7.6, t = 40 + Math.sin((i / 14) * Math.PI) * 17; return line(`M${f1(x)} ${f1(t + 1)} L${f1(x)} 86`, '#9cc8e0', 1.3); }),
    rect(4, 86, 112, 26, '#5f9ec8', 0, null), ...[[12, 86], [32, 88], [52, 86], [72, 88], [92, 86], [110, 88]].map(([x, y]) => cloud(x!, y!, 0.4)),
    ship(60, 104, 1.1, '#2f4a7a'), ...[55, 60, 65].map((x) => circle(x, 95, 1.6, '#3a6ab0', C.ink, 0.6)),
    at(94, 18, 1, rect(-16, -12, 30, 22, LAND, 2, C.ink, 1), ellipse(-8, -4, 6, 2.4, SEA, C.ink, 0.8), ellipse(8, 4, 5, 2, SEA, C.ink, 0.8), line('M-2 -2 L3 2', SEA2, 1.4), circle(0.5, 0, 2.4, 'none', HL, 1.6))),
  'gam.grizzlybjörn': all(bg(), mountain(4, 70, 34, 18, 82, '#8a7a68', 34), mountain(48, 116, 88, 12, 82, ROCK, 28), ...[[10, 82], [20, 82], [96, 82], [108, 82]].map(([x, y]) => at(x!, y!, 1, path('M-5 0 L0 -16 L5 0 Z', DARKF, C.ink, 0.8))), rect(4, 82, 112, 30, '#6fb0d8', 0, null), line('M4 82 L116 82', C.ink, 1), waves(8, 112, 102), grizzly(50, 100, 1.1), fish(94, 72, 0.9), path('M86 80 C88 76 92 74 96 76', 'none', C.white, 1)),

  // 3042 Centralamerikas geografi
  'gam.Panamakanalen': all(rect(4, 4, 112, 108, SEA, 3, null), path('M4 40 C20 30 40 36 54 46 C66 54 80 50 92 40 C100 34 110 34 116 36 L116 72 C104 70 94 74 84 82 C70 92 50 88 38 78 C26 68 14 70 4 76 Z', LAND, C.ink, 1.2),
    path('M48 44 C54 54 58 62 60 70 C62 78 66 82 70 88', 'none', C.ink, 6), path('M48 44 C54 54 58 62 60 70 C62 78 66 82 70 88', 'none', SEA, 4.4), ellipse(58, 62, 7, 4, SEA, C.ink, 0.8),
    line('M48 44 C54 54 58 62 60 70 C62 78 66 82 70 88', HL, 1.4, '3 2'), ship(52, 50, 0.45), ship(64, 80, 0.45, '#3a6ab0'),
    arrow(30, 22, 46, 38, C.grey, 1.6), arrow(90, 100, 74, 90, C.grey, 1.6), waves(14, 44, 16), waves(80, 110, 104)),
  'gam.Yucatanhalvön': cam({ yuc: true }),
  'gam.slukhål': all(bg(), rect(4, 40, 112, 72, '#b89a72', 0, null), line('M4 40 L116 40', C.ink, 1), ...[[12, 40], [24, 40], [96, 40], [108, 40]].map(([x, y]) => tree(x!, y!, 1, GREEN)),
    path('M30 40 C30 60 34 88 40 100 L80 100 C86 88 90 60 90 40 Z', '#7a5e40', C.ink, 1.3), path('M38 96 C40 84 80 84 82 96 L80 100 L40 100 Z', '#3fa0c8', C.ink, 1), waves(44, 76, 92, '#bfe6f4'),
    line('M36 40 C38 54 40 66 42 80 M84 40 C82 54 80 66 78 80', '#3a7d3a', 1.6), path('M36 52 l-3 3 M40 64 l3 3 M82 50 l3 3 M80 64 l-3 3', 'none', GREEN, 1.6),
    ...[[52, 72], [70, 66]].map(([x, y]) => line(`M${x} 40 L${x} ${y}`, GREEN2, 1)), ellipse(60, 40, 30, 3, 'none', HL, 2.2), lift(-18, person(60, 0.16, C.red))),
  'gam.molnskog': all(bg('#e4eef4'), path('M4 112 L4 70 C30 40 60 24 90 30 C104 32 112 40 116 46 L116 112 Z', '#4f8a4a', C.ink, 1.2),
    ...[[16, 86], [30, 70], [46, 56], [62, 46], [78, 42], [94, 44], [108, 52], [24, 100], [44, 88], [64, 78], [84, 74], [104, 80]].map(([x, y]) => tree(x!, y! + 10, 0.8, x! % 3 ? GREEN2 : DARKF)),
    ...[[30, 74], [62, 50], [94, 48], [46, 92], [84, 78]].map(([x, y]) => line(`M${x! - 6} ${y} l2 4 M${x! + 4} ${y! - 2} l1 5`, '#9ad86a', 2)),
    `<g opacity="0.85">${all(cloud(30, 62, 0.9), cloud(68, 46, 1.1), cloud(102, 54, 0.8), cloud(54, 74, 0.7))}</g>`),
  'gam.tukan': all(bg('#e2f0dc'), ...[[10, 10], [30, 4], [96, 6], [112, 18]].map(([x, y]) => circle(x!, y!, 10, GREEN, C.ink, 0.8)), line('M4 74 C40 70 80 72 116 66', WOOD2, 5), path('M84 70 l8 -8 M30 72 l-6 8', 'none', WOOD2, 2.4), toucan(50, 48, 1.3), path('M90 58 C98 52 104 58 98 64 Z', GREEN, C.ink, 0.8)),
  'gam.kaffeodling': all(bg(), at(92, 40, 1, path('M-24 14 L-6 -14 L6 -14 L24 14 Z', '#a89888', C.ink, 1.1), path('M-6 -14 L0 -10 L6 -14 Z', '#8a7a68', null)),
    path('M4 112 L4 54 C30 46 70 44 116 54 L116 112 Z', LAND2, C.ink, 1.1), ...range(5).map((i) => line(`M4 ${62 + i * 11} C40 ${56 + i * 11} 80 ${56 + i * 11} 116 ${62 + i * 11}`, '#6a9a3a', 1)),
    ...range(5).flatMap((i) => range(7).map((j) => coffeeBush(10 + j * 16 + (i % 2) * 6, 64 + i * 11 - (j > 2 && j < 5 ? 3 : 0), 0.7 + i * 0.12))),
    lift(-8, P({ x: 34, h: 0.4, top: C.yellow, bottom: C.navy })), path('M42 92 L52 92 L50 100 L44 100 Z', '#c9a060', C.ink, 0.9), ...[[45, 92], [48, 91.4]].map(([x, y]) => circle(x!, y!, 1.3, '#d64545', null))),

  // 3043 Andernas bergsområden
  'gam.Anderna': sam({ andes: true }),
  'gam.Aconcagua': all(bg(), mountain(4, 56, 28, 50, 112, '#a89a88', 62), mountain(70, 116, 98, 46, 112, '#a89a88', 58), mountain(30, 94, 60, 16, 112, ROCK, 34), ring(60, 16, 7), line('M110 112 L110 16', C.ink, 1.2), line('M106 16 L114 16 M106 112 L114 112', C.ink, 1.2), rect(84, 24, 24, 12, C.white, 2, C.ink, 0.8), num(96, 33, '6961', 8), line('M68 16 L106 16', HL, 1, '2 2')),
  'gam.Titicacasjön': all(bg(), mountain(4, 60, 28, 22, 64, '#a89a88', 34), mountain(40, 116, 84, 16, 64, ROCK, 28), rect(4, 64, 112, 48, '#d2bf8e', 0, null), path('M4 72 C30 66 90 66 116 72 L116 100 C90 106 30 106 4 100 Z', '#4f8fc8', C.ink, 1.1), waves(14, 104, 84, '#bfe0f2'), reedBoat(60, 92, 1), line('M4 64 L116 64', C.ink, 1),
    rect(4, 4, 25, 26, SEA, 1, C.ink, 0.8), at(4, 4, 0.22, path(SA, LAND, C.ink, 4), circle(40, 50, 8, HL, null))),
  'gam.Atacamaöknen': all(bg('#eef4f8'), sun(94, 18, 6), mountain(34, 92, 64, 22, 70, '#b89a7a', 30), mountain(70, 116, 96, 30, 70, '#a88a6a'), rect(4, 70, 30, 42, SEA2, 0, null), waves(6, 30, 84), waves(6, 30, 98),
    path('M30 112 L34 70 L116 70 L116 112 Z', DRY, C.ink, 1), ...[[44, 80], [60, 86], [80, 78], [96, 90], [52, 100], [76, 98], [104, 104]].map(([x, y]) => line(`M${x} ${y} l5 2 l3 -3 M${x! + 5} ${y! + 2} l1 4`, '#a8804a', 0.9)),
    rect(4, 4, 25, 26, SEA, 1, C.ink, 0.8), at(4, 4, 0.22, path(SA, LAND, C.ink, 4), path('M31 56 L39 55 L43 74 L36 76 Z', HL, null))),
  'gam.kondor': all(bg(), mountain(4, 70, 34, 50, 112, ROCK, 66), mountain(50, 116, 90, 44, 112, '#8a7a68', 60), condor(60, 30, 1), greyed(at(98, 76, 0.4, path('M-10 0 C-5 -4 0 -2 0 0 C0 -2 5 -4 10 0', 'none', C.ink, 2)))),
  'gam.quinoa': all(bg('#f2ecdc'), rect(4, 88, 112, 24, '#c8a878', 0, C.ink, 1), quinoaHead(18, 88, '#d8603a', 1.4), quinoaHead(34, 88, '#e8c04a', 1.2), quinoaHead(100, 88, '#c84a6a', 1.3),
    path('M44 74 C44 96 92 96 92 74 Z', C.white, C.ink, 1.4), ellipse(68, 74, 24, 6, '#f2e6c4', C.ink, 1.2), ...range(36).map((i) => circle(f1(50 + ((i * 13) % 36)), f1(71 + ((i * 7) % 6)), 0.9, i % 4 ? '#e8d8a8' : '#c84a4a', null)), path('M86 68 L106 50', 'none', '#c8a060', 2.4)),

  // 3044 Amazonas regnskog
  'gam.Amazonasfloden': sam({ river: true }),
  'gam.jaguar': all(bg('#d6ecd0'), ...[[12, 12], [34, 8], [86, 10], [108, 14]].map(([x, y]) => circle(x!, y!, 10, GREEN, C.ink, 0.8)), field(92, '#5a8a3a'), path('M4 66 C30 60 70 62 116 56', 'none', WOOD2, 6), jaguar(58, 70, 1.4), ...[[16, 104], [104, 104]].map(([x, y]) => path(`M${x} ${y} l-6 -10 M${x} ${y} l0 -12 M${x} ${y} l6 -10`, 'none', GREEN2, 2))),
  'gam.sengångare': all(bg('#d6ecd0'), line('M4 24 C40 20 80 22 116 18', WOOD2, 5), ...[[14, 14], [100, 10]].map(([x, y]) => circle(x!, y!, 9, GREEN, C.ink, 0.8)), at(60, 22, 1, sloth(0, 0, 1.4)), path('M20 24 C18 40 22 60 18 80 M98 20 C102 40 96 60 100 84', 'none', GREEN2, 1.6), path('M18 60 C12 58 10 64 16 66 Z M100 56 C106 54 108 60 102 62 Z', GREEN, C.ink, 0.6)),
  'gam.piraya': all(bg('#cfe3e8'), rect(4, 4, 112, 108, '#7fa8b0', 3, null), waves(8, 112, 14, '#bfe0e8'), piranha(60, 58, 1.8), ...[[18, 96], [100, 92], [96, 30]].map(([x, y]) => greyed(fish(x!, y!, 0.7))), path('M4 104 C30 100 60 106 116 100 L116 112 L4 112 Z', '#8a7a5a', null)),
  'gam.anakonda': all(bg('#d6ecd0'), rect(4, 60, 112, 52, '#6f9aa8', 0, null), line('M4 60 L116 60', C.ink, 1), waves(8, 112, 100, '#bfe0e8'), anaconda(56, 76, 1), ...[[12, 52], [108, 54]].map(([x, y]) => path(`M${x} ${y} l-6 -14 M${x} ${y} l0 -16 M${x} ${y} l6 -14`, 'none', GREEN2, 2))),

  // 3045 Karibiska övärlden
  'gam.Karibiska-havet': cam({ carib: true, greyNorth: true }, waves(80, 100, 52)),
  'gam.Stora-Antillerna': cam({ big: true, greyNorth: true }),
  'gam.Små-Antillerna': cam({ small: true, greyNorth: true }),
  'gam.orkansäsong': all(bg('#eef2f6'), calendar([6, 7, 8, 9, 10, 11]), spiral(100, 14, 0.7)),
  'gam.kryssningsfartyg': all(bg(), rect(4, 78, 112, 34, SEA2, 0, null), line('M4 78 L116 78', C.ink, 1), path('M86 78 C92 66 108 64 116 66 L116 78 Z', SAND, C.ink, 1), palmTree(104, 74, 0.6), cruise(54, 74, 1), waves(8, 112, 96), greyed(at(100, 100, 0.6, path('M-10 -2 L10 -2 L7 3 L-7 3 Z', C.white, C.ink, 1)))),

  // 3046 Amerikas länder och huvudstäder
  'gam.amerikan': demonym('USA', C.denim),
  'gam.kanadensare': demonym('CAN', C.red),
  'gam.mexikan': demonym('MEX', '#3a9a5a'),
  'gam.brasilianare': demonym('BRA', C.yellow),
  'gam.dollar': all(bg('#f2efe8'), bill(52, 48, 1.3, -8), bill(66, 72, 1.3, 6), coin(26, 96, 7), coin(40, 100, 6), coin(96, 98, 7)),
  'gam.spanska': all(atlantic('es'), bubble(74, 100, 30, line('M64 98 q4 -3 8 0 t8 0 M64 103 q4 -3 8 0 t8 0', C.navy, 1.4), true)),
  'gam.portugisiska': all(atlantic('pt'), bubble(74, 100, 30, line('M64 98 q4 -3 8 0 t8 0 M64 103 q4 -3 8 0 t8 0', C.navy, 1.4), true)),

  // 3047 Amerikas storstadsregioner
  'gam.favela': all(bg(), path('M4 112 L4 40 C20 26 44 22 64 34 C76 42 82 56 92 70 L92 112 Z', '#8ab06a', C.ink, 1.2),
    ...range(6).flatMap((i) => range(8 - i).map((j) => box(f1(8 + j * 9 + i * 3), f1(104 - i * 11 - (j > 4 ? (j - 4) * 2 : 0)), 8, 9, ['#e8a07a', '#f2d06a', '#8ab8d8', '#d88aa0', '#f4f0e6', '#a8d08a'][(i * 3 + j) % 6]!))),
    rect(92, 96, 24, 16, SAND, 0, null), line('M92 96 L116 96', C.ink, 0.8), greyed(tower(96, 8, 60, '#9fc4dc', 96), tower(106, 8, 68, '#9fc4dc', 96)), sun(100, 18, 5)),
  'gam.gränsstad': all(bg(), field(84, '#c8d8a8'), fenceLine(60, 60, 112), line('M60 30 L60 60', HL, 2, '4 3'),
    house(10, 84, 14, 12, '#f2d06a'), house(28, 84, 12, 16, '#e8a07a'), house(44, 84, 10, 10, '#f4f0e6'), house(68, 84, 12, 14, '#8ab8d8', '#5a6a8a'), house(84, 84, 14, 12, '#f4f0e6', '#5a6a8a'), house(102, 84, 10, 16, '#d8c8a8', '#5a6a8a'),
    rect(54, 70, 12, 14, C.white, 1, C.ink, 1), line('M44 98 L56 98', C.red, 2.4), line('M64 98 L76 98', C.red, 2.4), ...[40, 80].map((x) => lift(0, person(x, 0.3, x < 60 ? C.orange : C.green)))),
  'gam.väggmålning': all(bg('#efe8dc'), rect(8, 14, 90, 80, '#f4efe4', 1, C.ink, 1.4), rect(14, 20, 78, 68, '#f2d8a8', 0, C.ink, 0.8), sun(34, 36, 7), path('M14 88 L14 64 C30 56 48 60 60 66 C72 72 84 66 92 60 L92 88 Z', '#4f9d6a', C.ink, 0.9),
    ...[[30, 0.36, C.red], [52, 0.4, C.denim], [74, 0.34, '#8a6bbf']].map(([x, h, c]) => lift(-24, P({ x: x as number, h: h as number, top: c as string, bottom: C.brown }))), field(94, '#c9c2b0'),
    line('M104 112 L98 40 M114 112 L108 40 M100 56 L110 56 M101 70 L111 70 M102 84 L112 84 M103 98 L113 98', WOOD, 1.6), lift(-56, person(106, 0.36, C.white)), line('M98 50 L92 46', C.ink, 1.4), circle(92, 46, 1.6, C.red, null)),
  'gam.strandpromenad': all(bg(), rect(4, 46, 112, 22, SEA2, 0, null), waves(8, 112, 54), waves(14, 110, 62), path('M4 68 L116 68 L116 80 L4 80 Z', SAND, C.ink, 1), waveLines(4, 80, 112, 20), rect(4, 100, 112, 12, '#9aa3ad', 0, C.ink, 1),
    palmTree(14, 100, 0.8), palmTree(106, 100, 0.8), lift(-14, person(44, 0.34, C.red), person(56, 0.32, C.denim), person(84, 0.34, C.yellow)), mountain(4, 30, 16, 26, 46, '#6a9a5a'), mountain(84, 116, 104, 22, 46, '#6a9a5a')),
  'gam.karneval': all(bg('#f6e8f0'), confetti, field(100, '#c9c2b0'), path('M60 100 L60 70 L104 70 L112 100 Z', '#f2c14e', C.ink, 1.2), path('M64 70 C70 54 96 54 102 70', '#e86aa0', C.ink, 1.2), circle(83, 58, 5, '#f6b48e', C.ink, 1),
    dancer(20, C.pink, [C.red, C.yellow, '#3a9a5a', C.denim, C.purple]), dancer(44, C.yellow, ['#3a9a5a', C.orange, C.red, C.yellow, C.pink]), drum(78, 96), drum(96, 96), ...[70, 102].map((x) => circle(x, 102, 4, C.dark, C.ink, 0.8))),
};
