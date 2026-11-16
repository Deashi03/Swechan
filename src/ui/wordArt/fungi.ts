/**
 * Natur & geografi → Växter & svampar → Svampriket, 2831–2837 (0.45): Swedish edible mushrooms, poisonous mushrooms,
 * the build of a mushroom, mycelium and spores, decomposers, mushroom growing, and safe mushroom picking.
 * Recurring signs: a species is drawn from the side with the features a field guide names (cap shape and colour,
 * gills, tubes or spines under the cap, ring, sack at the foot); a white magnifier disc shows a detail up close; an
 * orange ring or oval marks the part the word names; danger is a red-bordered triangle with "!"; the soil is shown
 * in section with white threads when the word is about what happens under the ground. Abstract words are small
 * symbolic scenes with a grey reference beside them as contrast. Digits only; no words, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const PAPER = '#f6f2ea';
const MOSS = '#7fae5a';
const MOSS2 = '#5f9145';
const LITTER = '#b89a6a';
const SOIL = '#8a6a48';
const SOIL2 = '#6e5236';
const LEAF = '#5aa04a';
const LEAF2 = '#3f8a3e';
const NEEDLE = '#2f6b45';
const BARK = '#8a5a34';
const BARK2 = '#6e4526';
const BIRCH = '#f4f1ea';
const WOODL = '#e8c896';
const WOODD = '#b07a44';
const CHANT = '#f2b630';
const CHANT2 = '#d99a1c';
const BOLETE = '#8a5530';
const PORE = '#e8d27a';
const STEMP = '#efe4cc';
const FLYRED = '#d6332a';
const DEATH = '#a8b46a';
const CORT = '#b0622e';
const MOREL = '#7a4a2a';
const TRUMP = '#3a3438';
const HEDGE = '#ecd9a4';
const OYSTER = '#a8a8b0';
const SHII = '#7a4a2e';
const CHAMP = '#f3eee4';
const THREAD = '#fbfbf8';
const WATERC = '#5aa6dc';
const RED = '#d93a3a';
const WHITE = '#fbfbf8';
const AUT_O = '#e8792e';
const AUT_Y = '#e8b830';
const BLUEING = '#3f6fd0';
const MILK = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery and signs ────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const floor = (y = 96, col: string = MOSS) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, MOSS2, 1));
/** Soil in section from y down to the bottom, with a mossy top. */
const section = (y = 64) => all(rect(4, y, 112, 112 - y, SOIL, 0, null), rect(4, y - 3, 112, 5, MOSS, 0, null), line(`M4 ${y - 3} L116 ${y - 3}`, MOSS2, 1),
  ...[[14, y + 14], [40, y + 30], [72, y + 12], [100, y + 34], [26, y + 40], [88, y + 22]].map(([x, yy]) => ellipse(x!, yy!, 3, 1.6, SOIL2, null)));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const warn = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -11 L11 8 L-11 8 Z', '#ffe08a', RED, 2.4), line('M0 -4 L0 2', C.ink, 2.2), circle(0, 5, 1.2, C.ink, null));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.green, 2), line('M-4 0 L-1 3.5 L4.5 -3.5', C.green, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, RED, 2), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', RED, 2.4));
const qmark = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.navy, 1.6), path('M-3 -2.5 C-3 -7 3 -7 3 -3 C3 -0.5 0 0 0 2.5', 'none', C.navy, 2), circle(0, 5.2, 1.2, C.navy, null));
const zoom = (cx: number, cy: number, r: number, fx: number, fy: number, inner: Svg) => all(
  line(`M${fx} ${fy} L${f1(cx - r * 0.7)} ${f1(cy + r * 0.7)}`, C.grey, 1.2, '2 2'), circle(fx, fy, 3, 'none', C.grey, 1.2), circle(cx, cy, r, WHITE, C.ink, 1.6), inner);
const spruce = (x: number, y = 112, s = 1) => at(x, y, s, rect(-2, -8, 4, 8, BARK, 0, C.ink, 0.9),
  path('M0 -62 L7 -48 L4 -48 L12 -32 L7 -32 L16 -16 L10 -16 L19 -8 L-19 -8 L-10 -16 L-16 -16 L-7 -32 L-12 -32 L-4 -48 L-7 -48 Z', NEEDLE, C.ink, 1.2));
const decid = (x: number, y = 112, s = 1, col: string = LEAF) => at(x, y, s, path('M-4 0 L-2.6 -30 L2.6 -30 L4 0 Z', BARK, C.ink, 1.2), line('M0 -20 L-9 -30 M0 -24 L8 -33', BARK, 2.6),
  ...[[0, -42, 15], [-11, -38, 10], [11, -38, 10], [-6, -52, 10], [6, -52, 10]].map(([cx, cy, r]) => circle(cx!, cy!, r!, col, C.ink, 1.2)), ...[[0, -42, 14], [-11, -38, 9], [11, -38, 9], [-6, -52, 9], [6, -52, 9]].map(([cx, cy, r]) => circle(cx!, cy!, r!, col, null)));
const birch = (x: number, y = 112, s = 1) => at(x, y, s, path('M-3 0 L-2 -46 L2 -46 L3 0 Z', BIRCH, C.ink, 1.2), line('M-2 -8 L1 -8 M0 -16 L2.5 -16 M-2.5 -24 L0 -24 M0 -32 L2 -32 M-1.5 -40 L1 -40', C.ink, 1.4),
  ...[[0, -50, 10], [-8, -42, 8], [8, -42, 8], [-5, -58, 7], [5, -58, 7]].map(([cx, cy, r]) => circle(cx!, cy!, r!, '#a9dc6a', C.ink, 1.1)), ...[[0, -50, 9], [-8, -42, 7], [8, -42, 7], [-5, -58, 6], [5, -58, 6]].map(([cx, cy, r]) => circle(cx!, cy!, r!, '#a9dc6a', null)));
const leafBit = (x: number, y: number, a: number, col: string = AUT_O, s = 1) => rot(x, y, a, s, path('M0 0 C3 -3 9 -3 12 0 C9 3 3 3 0 0 Z', col, C.ink, 0.7));
const needles = (x: number, y: number) => line(`M${x} ${y} l5 -2 M${x + 2} ${y + 2} l5 1 M${x + 8} ${y - 1} l4 3`, '#9a7a4a', 1.1);
const mossTuft = (x: number, y: number) => all(...[-4, -1, 2, 5].map((d, i) => line(`M${x + d} ${y} l${i % 2 ? 1 : -1} -4`, MOSS2, 1.4)));
const cone = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, ellipse(0, 0, 4, 9, '#9a6a3a', C.ink, 1), line('M-3 -4 L3 -2 M-3 1 L3 3 M-3 5 L3 6', C.ink, 0.6));

// ── Mushrooms ────────────────────────────────────────────────────────
type Shape = 'dome' | 'flat' | 'cone' | 'bun' | 'funnel' | 'wavy';
type MO = { cap?: string; stem?: string; shape?: Shape; under?: 'gills' | 'pores' | 'spines' | 'none'; uc?: string; dots?: boolean; ring?: boolean; volva?: boolean; net?: boolean; w?: number; h?: number; hl?: 'cap' | 'under' | 'ring' | 'volva' | 'stem' | 'all' };
/** A mushroom from the side with its foot at (x, y). Unit size: cap ≈ 34 wide, ≈ 44 tall. */
function mush(x: number, y: number, s: number, o: MO = {}): Svg {
  const cap = o.cap ?? BOLETE, st = o.stem ?? STEMP, sh = o.shape ?? 'dome', w = o.w ?? 1, h = o.h ?? 1, top = f1(-24 * h);
  const sw = (n: number) => f1(n * w);
  const out: Svg[] = [];
  const stemD = sh === 'bun' ? `M${sw(-7)} 0 C${sw(-9)} -8 ${sw(-6)} ${top} ${sw(-5)} ${top} L${sw(5)} ${top} C${sw(6)} ${top} ${sw(9)} -8 ${sw(7)} 0 Z`
    : sh === 'funnel' ? `M${sw(-4)} 0 L${sw(-3)} ${f1(-18 * h)} L${sw(3)} ${f1(-18 * h)} L${sw(4)} 0 Z`
    : `M${sw(-4)} 0 L${sw(-3)} ${top} L${sw(3)} ${top} L${sw(4)} 0 Z`;
  out.push(path(stemD, sh === 'funnel' ? cap : st, C.ink, 1.2));
  if (o.net) out.push(line(range(4).map((i) => `M${sw(-5)} ${f1(-4 - i * 4.5)} L${sw(5)} ${f1(-6 - i * 4.5)}`).join(' '), '#c9b48a', 0.8));
  if (o.volva) out.push(path(`M${sw(-8)} 0 C${sw(-9)} -6 ${sw(-6)} -9 ${sw(-4)} -7 L${sw(4)} -7 C${sw(6)} -9 ${sw(9)} -6 ${sw(8)} 0 Z`, WHITE, C.ink, 1.1));
  if (o.ring) out.push(path(`M${sw(-6)} ${f1(top + 6)} L${sw(6)} ${f1(top + 6)} L${sw(4)} ${f1(top + 10)} L${sw(-4)} ${f1(top + 10)} Z`, WHITE, C.ink, 1));
  const capD: Record<Shape, string> = {
    dome: `M-17 ${top} C-17 ${f1(top - 20)} 17 ${f1(top - 20)} 17 ${top} Z`,
    flat: `M-19 ${top} C-17 ${f1(top - 10)} 17 ${f1(top - 10)} 19 ${top} Z`,
    cone: `M-14 ${top} C-12 ${f1(top - 8)} -4 ${f1(top - 16)} 0 ${f1(top - 20)} C4 ${f1(top - 16)} 12 ${f1(top - 8)} 14 ${top} Z`,
    bun: `M-19 ${f1(top + 1)} C-21 ${f1(top - 21)} 21 ${f1(top - 21)} 19 ${f1(top + 1)} C10 ${f1(top + 4)} -10 ${f1(top + 4)} -19 ${f1(top + 1)} Z`,
    funnel: `M-16 ${f1(-36 * h)} C-9 ${f1(-31 * h)} -5 ${f1(-25 * h)} -3 ${f1(-18 * h)} L3 ${f1(-18 * h)} C5 ${f1(-25 * h)} 9 ${f1(-31 * h)} 16 ${f1(-36 * h)} C10 ${f1(-40 * h)} -10 ${f1(-40 * h)} -16 ${f1(-36 * h)} Z`,
    wavy: `M-18 ${top} C-19 ${f1(top - 6)} -14 ${f1(top - 12)} -6 ${f1(top - 12)} C0 ${f1(top - 14)} 8 ${f1(top - 12)} 14 ${f1(top - 10)} C19 ${f1(top - 7)} 20 ${f1(top - 2)} 18 ${top} Z`,
  };
  const capS = at(0, 0, 1, path(capD[sh], cap, C.ink, 1.3));
  const und = o.under ?? (sh === 'bun' ? 'pores' : sh === 'funnel' ? 'none' : 'gills');
  const uc = o.uc ?? (und === 'pores' ? PORE : und === 'spines' ? HEDGE : WHITE);
  const undS: Svg[] = [];
  if (sh === 'funnel') undS.push(line(`M-13 ${f1(-34 * h)} L-4 ${f1(-21 * h)} M-8 ${f1(-35 * h)} L-2 ${f1(-22 * h)} M8 ${f1(-35 * h)} L2 ${f1(-22 * h)} M13 ${f1(-34 * h)} L4 ${f1(-21 * h)}`, CHANT2, 0.9));
  else if (und !== 'none') {
    const half = sh === 'flat' ? 18 : sh === 'cone' ? 13 : sh === 'bun' ? 18 : 16, by = sh === 'bun' ? f1(top + 1) : top;
    undS.push(path(`M${-half} ${by} C${f1(-half / 2)} ${f1(by + 4)} ${f1(half / 2)} ${f1(by + 4)} ${half} ${by} Z`, uc, C.ink, 1));
    if (und === 'gills') undS.push(line(range(7).map((i) => { const xx = f1(-half * 0.8 + (i * half * 1.6) / 6); return `M${xx} ${by} L${f1(xx * 0.8)} ${f1(by + 2.6)}`; }).join(' '), C.ink, 0.6));
    if (und === 'pores') undS.push(...range(6).map((i) => circle(f1(-half * 0.7 + (i * half * 1.4) / 5), f1(by + 1.6), 0.7, C.ink, null)));
    if (und === 'spines') undS.push(line(range(8).map((i) => { const xx = f1(-half * 0.85 + (i * half * 1.7) / 7); return `M${xx} ${by} l0 ${3 + (i % 2)}`; }).join(' '), C.ink, 0.9));
  }
  const dots = o.dots ? [[-8, top - 7], [0, top - 12], [8, top - 6], [-12, top - 2], [12, top - 2], [-3, top - 5], [5, top - 11]].map(([dx, dy]) => circle(dx!, f1(dy!), 1.7, WHITE, C.ink, 0.6)) : [];
  out.push(capS, ...undS, ...dots);
  if (sh === 'funnel') out.push(ellipse(0, f1(-37 * h), 13, 2.4, CHANT2, null));
  const hl: Svg[] = [];
  if (o.hl === 'cap') hl.push(sh === 'funnel' ? oval(0, f1(-36 * h), 20, 7) : oval(0, f1(top - 8), 22, 13));
  if (o.hl === 'under') hl.push(oval(0, f1(top + 2), 22, 5));
  if (o.hl === 'ring') hl.push(oval(0, f1(top + 8), 10, 5));
  if (o.hl === 'volva') hl.push(oval(0, -4, 12, 7));
  if (o.hl === 'stem') hl.push(oval(0, f1(top / 2), 8, f1(-top / 2 + 3)));
  if (o.hl === 'all') hl.push(oval(0, f1(top / 2 - 6), 24, f1(-top / 2 + 14)));
  return at(x, y, s, ...out, ...hl);
}
// species presets
const chant = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'funnel', cap: CHANT, ...more });
const tratt = (x: number, y: number, s = 1) => at(x, y, s, path('M-2.5 0 L-2 -20 L2 -20 L2.5 0 Z', '#e8c040', C.ink, 1.1), path('M-11 -26 C-6 -24 -3 -22 -2 -18 L2 -18 C3 -22 6 -24 11 -26 C8 -30 -8 -30 -11 -26 Z', '#7a5a3a', C.ink, 1.1), ellipse(0, -26.5, 6, 1.4, '#4a3420', null));
const bolete = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'bun', cap: BOLETE, net: true, w: 1.3, ...more });
const flyAg = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'dome', cap: FLYRED, dots: true, ring: true, volva: true, h: 1.15, ...more });
const deathCap = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'dome', cap: DEATH, ring: true, volva: true, h: 1.2, ...more });
const cortin = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'cone', cap: CORT, stem: '#d9a070', uc: '#c08050', h: 1.1, ...more });
const russula = (x: number, y: number, s = 1, cap: string = FLYRED) => mush(x, y, s, { shape: 'flat', cap, stem: WHITE, w: 1.2 });
const milkcap = (x: number, y: number, s = 1) => mush(x, y, s, { shape: 'wavy', cap: '#e88a3a', stem: '#e8a060', uc: '#e8a868' });
const hedgeh = (x: number, y: number, s = 1) => mush(x, y, s, { shape: 'wavy', cap: HEDGE, stem: WHITE, under: 'spines', w: 1.3 });
const champ = (x: number, y: number, s = 1, more: MO = {}) => mush(x, y, s, { shape: 'dome', cap: CHAMP, stem: WHITE, uc: '#a87a6a', w: 1.2, ...more });
const trumpet = (x: number, y: number, s = 1) => at(x, y, s, path('M-2.5 0 L-2 -10 C-4 -20 -10 -28 -13 -36 C-6 -33 6 -33 13 -36 C10 -28 4 -20 2 -10 L2.5 0 Z', TRUMP, C.ink, 1.1), ellipse(0, -35, 11, 2.6, '#1e1a1e', null));
const morel = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-4 -12 L4 -12 L5 0 Z', '#e8dcc8', C.ink, 1.1),
  path('M-14 -12 C-18 -22 -12 -36 0 -38 C12 -36 18 -22 14 -12 C8 -9 -8 -9 -14 -12 Z', MOREL, C.ink, 1.3), line('M-10 -16 C-12 -22 -6 -22 -8 -28 C-6 -32 -2 -30 0 -34 M2 -14 C0 -20 6 -20 4 -26 C6 -30 10 -28 10 -22 M-4 -20 C-2 -24 2 -22 2 -28', '#4a2a18', 1.1));
const oyster = (x: number, y: number, s = 1, a = 0, col: string = OYSTER) => rot(x, y, a, s, path('M0 0 C4 -2 18 -10 22 -4 C26 2 20 10 8 8 C4 6 2 4 0 0 Z', col, C.ink, 1.1), line('M2 1 L18 -4 M3 3 L20 2 M3 4 L14 7', '#7a7a84', 0.6));
const shiitake = (x: number, y: number, s = 1) => at(x, y, s, mush(0, 0, 1, { shape: 'flat', cap: SHII, stem: '#e8dcc0', h: 0.8 }), line('M-10 -24 l3 -2 M-2 -26 l2 2 M6 -24 l3 -1 M-6 -21 l2 -1 M10 -21 l2 -2', '#f0e6d0', 1.3));
const bracket = (x: number, y: number, s = 1, col: string = '#b89a78', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M0 -6 C10 -8 22 -4 24 4 C14 8 6 6 0 6 Z', col, C.ink, 1.2), line('M2 -2 C10 -3 18 -1 21 3 M2 2 C8 2 14 3 18 5', '#7a5a40', 0.7));
const thread = (d: string, sw = 1.3) => line(d, THREAD, sw);
const threads = (x: number, y: number, s = 1) => at(x, y, s, thread('M0 0 C-8 6 -18 4 -26 12 M0 0 C6 8 18 6 26 14 M0 0 C-2 10 -10 16 -12 26 M0 0 C4 12 10 18 8 28 M-26 12 C-32 14 -36 22 -40 24 M26 14 C32 18 36 16 42 22 M-18 6 C-22 0 -30 0 -34 -2 M18 8 C22 2 30 4 36 0 M-12 26 C-18 30 -24 28 -30 32 M8 28 C14 32 22 30 28 34', 1.1));
const spores = (x: number, y: number, n: number, spread: number, col: string = '#7a5a3a') => all(...range(n).map((i) => circle(f1(x + Math.sin(i * 2.4) * spread * ((i % 5) / 5 + 0.3)), f1(y + Math.cos(i * 1.7) * spread * 0.6 * ((i % 4) / 4 + 0.3)), 0.9, col, null)));
const basket = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, path('M-12 -14 C-12 -26 12 -26 12 -14', 'none', '#8a5a2a', 2), inner, path('M-14 -14 L14 -14 L11 0 L-11 0 Z', '#c89a5a', C.ink, 1.2), line('M-12 -9 L12 -9 M-11.5 -4 L11.5 -4 M-6 -14 L-5 0 M0 -14 L0 0 M6 -14 L5 0', '#8a5a2a', 0.8));
const knife = (x: number, y: number, a = 0, s = 1, brush = true) => rot(x, y, a, s, rect(-14, -2.4, 14, 4.8, '#b8623a', 2, C.ink, 1), path('M0 -2 L16 -1 C18 0 18 1 16 2 L0 2 Z', C.silver, C.ink, 1), brush ? all(rect(-19, -3, 5, 6, '#e8d8a0', 1, C.ink, 0.8), line('M-19 -2 l-3 0 M-19 0 l-3 0 M-19 2 l-3 0', '#8a7a4a', 1)) : '');
const plateOf = (x: number, y: number, food: Svg = '') => all(ellipse(x, y, 24, 7, WHITE, C.ink, 1.4), ellipse(x, y - 1, 17, 4, '#efefe8', null), food);
const book = (x: number, y: number, s = 1, l: Svg = '', r: Svg = '') => at(x, y, s, path('M0 -2 C-8 -6 -20 -6 -26 -3 L-26 26 C-20 23 -8 23 0 27 Z', WHITE, C.ink, 1.2), path('M0 -2 C8 -6 20 -6 26 -3 L26 26 C20 23 8 23 0 27 Z', WHITE, C.ink, 1.2), line('M0 -2 L0 27', C.ink, 1), l, r);
const bag = (x: number, y: number, s = 1, col = 'rgba(220,235,240,0.85)') => at(x, y, s, path('M-12 -30 L12 -30 L14 0 L-14 0 Z', col, C.ink, 1.2), line('M-12 -30 L-10 -36 L10 -36 L12 -30', C.ink, 1.1));
const stock = (x: number, y: number, len: number, r = 7, col: string = BARK) => all(rect(x, y - r, len, r * 2, col, 2, C.ink, 1.2), ellipse(x + len, y, r * 0.55, r, WOODL, C.ink, 1.1), ellipse(x + len, y, r * 0.3, r * 0.55, 'none', WOODD, 0.8), line(`M${x + 4} ${y - r * 0.4} l${len * 0.3} 0 M${x + len * 0.4} ${y + r * 0.3} l${len * 0.35} 0`, BARK2, 0.8));
const clock = (x: number, y: number, r = 9, h = 3) => all(circle(x, y, r, WHITE, C.ink, 1.4), line(`M${x} ${y} L${x} ${f1(y - r * 0.7)} M${x} ${y} L${f1(x + Math.sin((h / 12) * Math.PI * 2) * r * 0.5)} ${f1(y - Math.cos((h / 12) * Math.PI * 2) * r * 0.5)}`, C.ink, 1.4));
const microscope = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -4, 28, 4, C.dark, 1, C.ink, 1), path('M6 -4 C14 -14 14 -26 6 -34', 'none', C.dark, 4), rect(-6, -12, 14, 3, C.grey, 1, C.ink, 0.8), rot(0, -26, -20, 1, rect(-3, -16, 6, 24, C.silver, 2, C.ink, 1.1), rect(-4, -20, 8, 5, C.dark, 1, C.ink, 0.9)));
const bed = (x: number, y: number) => all(rect(x - 30, y, 60, 9, C.white, 2, C.ink, 1.4), rect(x - 30, y + 9, 60, 4, C.brown, 1, C.ink, 1.2), line(`M${x - 28} ${y + 13} L${x - 28} 112 M${x + 28} ${y + 13} L${x + 28} 112`, C.brown, 3), rect(x - 34, y - 14, 5, 27, C.brown, 1, C.ink, 1.2));
const sprayer = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -6, 12, 22, '#7ab8e8', 3, C.ink, 1.2), rect(-3, -12, 6, 6, C.white, 1, C.ink, 1), path('M3 -12 L12 -12 L12 -9 L3 -9 Z', C.white, C.ink, 1), path('M-3 -10 L-8 -4', 'none', C.ink, 1.6));
const mist = (x: number, y: number) => all(...[[0, 0], [4, -3], [5, 3], [9, -1], [10, 5], [13, -4], [14, 2]].map(([dx, dy]) => circle(x + dx!, y + dy!, 1, WATERC, null)));
const drop = (x: number, y: number, s = 1, col: string = WATERC) => path(`M${x} ${f1(y - 5 * s)} C${f1(x + 4 * s)} ${y} ${f1(x + 3 * s)} ${f1(y + 4 * s)} ${x} ${f1(y + 4 * s)} C${f1(x - 3 * s)} ${f1(y + 4 * s)} ${f1(x - 4 * s)} ${y} ${x} ${f1(y - 5 * s)} Z`, col, C.ink, 0.9);
const sugarCube = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 -3 L0 -6 L5 -3 L5 3 L0 6 L-5 3 Z', WHITE, C.ink, 1), line('M-5 -3 L0 0 L5 -3 M0 0 L0 6', C.ink, 0.8));
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', h = 1, more: Record<string, unknown> = {}) => F({ x, top, mood, h, ...more });
const thumbUp = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -2, 8, 16, C.skin, 2, C.ink, 1.2), path('M-2 0 C2 -4 3 -10 4 -14 C6 -18 10 -16 9 -11 L8 -4 L15 -4 C18 -4 19 0 17 2 C19 4 18 7 16 8 C18 10 16 13 14 13 L-2 13 Z', C.skin, C.ink, 1.2));
const palm = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 14 L-8 -2 C-8 -6 -4 -6 -4 -2 L-4 -10 C-4 -14 0 -14 0 -10 L0 -12 C0 -16 4 -16 4 -12 L4 -9 C4 -13 8 -13 8 -9 L8 6 C8 12 4 16 -2 16 Z', C.skin, C.ink, 1.2));
const pulseFlat = (x: number, y: number, w: number, beat = true) => line(beat ? `M${x} ${y} L${x + w * 0.2} ${y} L${x + w * 0.26} ${y - 9} L${x + w * 0.34} ${y + 8} L${x + w * 0.4} ${y} L${x + w} ${y}` : `M${x} ${y} L${x + w} ${y}`, beat ? '#4ac06a' : RED, 2);
const monitor = (x: number, y: number, beat: boolean) => all(rect(x - 20, y - 14, 40, 28, C.dark, 3, C.ink, 1.4), pulseFlat(x - 16, y, 32, beat), line(`M${x} ${y + 14} L${x} ${y + 22} M${x - 8} ${y + 22} L${x + 8} ${y + 22}`, C.ink, 2));
const calendar = (x: number, y: number, hi: number[], icon: (cx: number, cy: number) => Svg) => all(rect(x - 46, y - 30, 92, 62, WHITE, 3, C.ink, 1.4), rect(x - 46, y - 30, 92, 9, RED, 3, C.ink, 1.2),
  ...range(12).map((i) => { const cx = x - 34 + (i % 4) * 23, cy = y - 12 + Math.floor(i / 4) * 17; const on = hi.includes(i + 1); return all(rect(cx - 10, cy - 7, 20, 15, on ? '#ffe6b8' : '#eef0f2', 2, on ? HL : C.grey2, on ? 1.6 : 0.8), on ? icon(cx + 4, cy + 6) : '', num(cx - 4, cy + 1, String(i + 1), 6.5, on ? C.ink : C.grey)); }));
const hunterCap = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 C-8 -9 8 -9 8 0 Z', AUT_O, C.ink, 1), rect(-2, -1, 14, 2.4, AUT_O, 1, C.ink, 0.8));
const moose = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -16, 14, 8, '#6a4a30', C.ink, 1.1), line('M-9 -10 L-9 0 M-4 -10 L-4 0 M5 -10 L5 0 M10 -10 L10 0', '#4a3020', 2.4), path('M12 -20 L20 -26 L26 -22 L24 -18 L16 -16 Z', '#6a4a30', C.ink, 1.1), path('M18 -26 C14 -32 16 -36 12 -38 M18 -26 C20 -32 24 -34 22 -38 M19 -26 C24 -30 28 -30 28 -34', 'none', '#c8a878', 2));

// ── Motifs ───────────────────────────────────────────────────────────
export const FUNGI_MOTIFS: Record<string, Svg> = {
  // 2831 Matsvampar i Sverige
  'svamp.matsvamp': all(bg(PAPER), rect(4, 92, 112, 20, '#c9a27a', 0, null), ellipse(56, 92, 36, 10, WHITE, C.ink, 1.4), ellipse(56, 91, 27, 6, '#efefe8', null), chant(40, 92, 0.9), bolete(58, 94, 0.8), chant(74, 92, 0.85), chant(52, 90, 0.6),
    line('M12 104 L12 66 M8 66 L8 76 C8 80 16 80 16 76 L16 66', C.silver, 2), line('M104 104 L104 66', C.silver, 2.4), path('M104 66 C110 68 110 80 104 82', C.silver, C.ink, 1), check(98, 26, 1.5)),
  'svamp.kantarell': all(bg(), floor(84), ...[[16, 92], [44, 98], [100, 94], [80, 104]].map(([x, y]) => mossTuft(x!, y!)), chant(40, 100, 1.5), chant(70, 104, 1.1), chant(90, 96, 0.8), chant(22, 106, 0.7), needles(56, 92), needles(98, 106), zoom(92, 32, 20, 74, 72, chant(92, 48, 0.75))),
  'svamp.trattkantarell': all(bg('#e6e8ee'), floor(80, '#8a9a5a'), ...[[18, 90, 20], [86, 88, -30], [60, 106, 60], [104, 104, 10]].map(([x, y, a]) => leafBit(x!, y!, a!, AUT_O)), tratt(36, 104, 1.8), tratt(62, 102, 1.4), tratt(84, 106, 1.2), tratt(50, 108, 0.9),
    ...[[20, 20], [40, 12], [70, 18], [100, 24]].map(([x, y]) => line(`M${x} ${y} l0 6 M${x! - 3} ${y! + 3} l6 0`, '#9ab8d8', 1.2)), zoom(94, 36, 18, 64, 72, at(94, 52, 1, tratt(0, 0, 1.1), oval(0, -10, 4, 11)))),
  'svamp.karljohansvamp': all(bg(), floor(88), spruce(100, 100, 1), bolete(46, 108, 2.2), mossTuft(16, 104), mossTuft(84, 108), zoom(96, 26, 16, 48, 82, at(96, 26, 1, rect(-6, -12, 12, 24, STEMP, 2, C.ink, 1), line('M-6 -8 L6 -4 M-6 -2 L6 2 M-6 4 L6 8 M-3 -12 L-1 12 M3 -12 L1 12', '#a8906a', 0.9)))),
  'svamp.sopp': all(bg(), floor(96), bolete(30, 104, 1.3), bolete(64, 106, 1.1, { cap: '#c8803a', uc: '#e8c84a' }), greyed(mush(98, 106, 1, { shape: 'dome', cap: '#999' })), zoom(46, 30, 20, 30, 70, all(circle(46, 30, 16, PORE, null), ...range(19).map((i) => { const a = i * 2.4, r = Math.sqrt(i) * 3.4; return circle(f1(46 + Math.cos(a) * r), f1(30 + Math.sin(a) * r), 1.4, '#a8903a', null); })))),
  'svamp.kremla': all(bg(), floor(92), russula(28, 104, 1.3, FLYRED), russula(62, 102, 1.2, '#7aa84a'), russula(94, 106, 1.1, '#e8c040'), mossTuft(46, 108), mossTuft(80, 108), zoom(62, 30, 18, 62, 74, all(path('M46 30 C50 20 74 20 78 30 Z', '#7aa84a', C.ink, 1.1), path('M46 30 C52 36 72 36 78 30 Z', WHITE, C.ink, 1), line('M50 31 L52 34 M56 31 L57 35 M62 31 L62 35 M68 31 L67 35 M74 31 L72 34', C.ink, 0.6)))),
  'svamp.riska': all(bg(), floor(100), milkcap(30, 108, 1.5), milkcap(58, 108, 0.9), at(88, 82, 0.8, path('M-20 0 C-18 -14 0 -16 4 -8 L0 6 C-8 6 -16 4 -20 0 Z', '#e88a3a', C.ink, 1.2), path('M4 -8 L0 6 C8 6 18 4 22 -2 C18 -12 10 -14 4 -8 Z', '#e88a3a', C.ink, 1.2), path('M4 -8 L0 6', 'none', '#f0d0a0', 2)), ...[[88, 90], [88, 98]].map(([x, y]) => drop(x!, y!, 0.8, '#f6a040'))),
  'svamp.trumpetsvamp': all(bg('#efe6d6'), floor(86, LITTER), ...[[14, 96, 30], [100, 92, -20], [70, 108, 70], [30, 108, 120]].map(([x, y, a]) => leafBit(x!, y!, a!, '#c8903a', 1.2)), trumpet(40, 106, 1.6), trumpet(62, 104, 1.3), trumpet(80, 108, 1.1), trumpet(52, 110, 0.9), greyed(decid(102, 74, 0.6))),
  'svamp.taggsvamp': all(bg(), floor(100), hedgeh(40, 108, 2.2), oval(40, 60, 30, 6), zoom(94, 30, 18, 56, 62, all(path('M78 20 C84 16 104 16 110 20 Z', HEDGE, C.ink, 1), line(range(8).map((i) => `M${81 + i * 3.6} 20 l0 ${8 + (i % 2) * 3}`).join(' '), '#c8a868', 2.2)))),
  'svamp.svampställe': all(bg(), floor(90), spruce(20, 100, 0.9), spruce(108, 96, 0.6), ...[[44, 98, 1], [56, 102, 0.9], [66, 96, 0.8], [50, 108, 0.7], [72, 106, 0.8], [38, 106, 0.7]].map(([x, y, s]) => chant(x!, y!, s!)), at(56, 54, 1, path('M0 22 C-10 8 -12 -2 -12 -6 C-12 -14 -6 -18 0 -18 C6 -18 12 -14 12 -6 C12 -2 10 8 0 22 Z', RED, C.ink, 1.4), circle(0, -6, 4.5, WHITE, C.ink, 1)), fig(92, C.green, 'calm', 0.55), reach(92, 0.55, -1, 84, 78)),
  'svamp.svampsäsong': all(bg(PAPER), calendar(60, 62, [7, 8, 9, 10], (cx, cy) => chant(cx, cy, 0.25))),
  'svamp.svamptur': all(bg(), floor(100), spruce(14, 104, 1.1), spruce(108, 106, 1), decid(90, 100, 0.8), line('M4 112 C30 104 60 108 116 100', '#c9b088', 5), fig(42, C.orange, 'smile', 0.85), fig(64, C.navy, 'smile', 0.6), basket(26, 96, 1.1, chant(0, -12, 0.35)), reach(42, 0.85, -1, 28, 82), chant(76, 108, 0.6)),
  'svamp.skogsbotten': all(bg(), greyed(spruce(30, 60, 0.7), decid(86, 60, 0.6)), rect(4, 60, 112, 52, MOSS, 0, null), ...range(14).map((i) => mossTuft(10 + (i % 7) * 16, 70 + Math.floor(i / 7) * 22)), ...[[22, 86, 20], [64, 78, -40], [96, 98, 60], [40, 104, 150]].map(([x, y, a]) => leafBit(x!, y!, a!, i_(a!), 1.2)),
    needles(76, 96), needles(30, 74), cone(54, 96, 0.9, 70), cone(100, 76, 0.8, -30), chant(84, 84, 0.5), oval(60, 86, 54, 24)),
  'svamp.svampstuvning': all(bg(PAPER), rect(4, 92, 112, 20, '#c9a27a', 0, null), ellipse(60, 92, 44, 12, WHITE, C.ink, 1.4), path('M30 90 L90 90 L88 76 L32 76 Z', '#d8a868', C.ink, 1.2), path('M28 78 C34 62 86 62 92 78 C74 84 46 84 28 78 Z', '#f6e6c4', C.ink, 1.1),
    ...[[42, 72], [54, 70], [66, 70], [78, 74], [48, 77], [62, 77], [72, 78]].map(([x, y]) => path(`M${x! - 4} ${y} C${x! - 4} ${y! - 5} ${x! + 4} ${y! - 5} ${x! + 4} ${y} Z`, CHANT, C.ink, 0.7)), line('M48 54 q-3 -4 0 -8 q3 -4 0 -8 M60 52 q-3 -4 0 -8 q3 -4 0 -8 M72 54 q-3 -4 0 -8 q3 -4 0 -8', '#9aa3ad', 1.4)),

  // 2832 Giftsvampar
  'svamp.giftsvamp': all(bg(), floor(96), cortin(36, 106, 1.6), deathCap(74, 106, 1.2), warn(56, 32, 2), greyed(chant(104, 108, 0.7))),
  'svamp.flugsvamp': all(bg(), floor(94), spruce(102, 98, 0.8), flyAg(40, 106, 2), flyAg(80, 108, 1.1), mush(66, 108, 0.7, { shape: 'bun', cap: FLYRED, under: 'gills', dots: true, stem: WHITE, w: 0.8 })),
  'svamp.lömsk-flugsvamp': all(bg(), floor(92, '#9aa65a'), greyed(decid(100, 92, 0.7)), deathCap(44, 106, 2), ...[[18, 102, 30], [76, 106, -40], [70, 96, 80]].map(([x, y, a]) => leafBit(x!, y!, a!, '#8a6a3a', 1.1)), oval(44, 63, 14, 4), oval(44, 101, 15, 8), warn(92, 30, 1.6)),
  'svamp.toppig-giftspindling': all(bg(), floor(88), ...[[18, 96], [100, 100]].map(([x, y]) => mossTuft(x!, y!)), cortin(44, 106, 2), cortin(80, 104, 1.2), ring(44, 52, 6), warn(96, 30, 1.6)),
  'svamp.stenmurkla': all(bg('#e6eef2'), floor(92, '#a89a6a'), ...[[18, 96], [100, 98]].map(([x, y]) => all(ellipse(x!, y!, 10, 4, '#a8783a', C.ink, 1), ellipse(x!, y! - 1, 6, 2, '#e8c896', null))), path('M60 92 C66 90 74 92 80 92 L82 96 L58 96 Z', WHITE, null), morel(46, 106, 1.8), morel(80, 106, 1.1), warn(96, 28, 1.5),
    ...[[30, 20], [56, 14]].map(([x, y]) => all(line(`M${x} ${y} l3 -4 l3 4`, LEAF2, 1.2), circle(x! + 3, y! - 5, 1.6, '#f2e060', null)))),
  'svamp.svampförgiftning': all(bg(PAPER), bed(66, 82), at(0, 0, 1, path('M44 82 C44 72 50 70 56 72 L94 74 C96 76 96 82 94 82 Z', '#bfe3f5', C.ink, 1.2)), circle(44, 72, 8, '#cfe0b0', C.ink, 1.4), path('M40 74 q2 -2 4 0 M46 74 q2 -2 4 0', 'none', C.ink, 1), path('M41 79 q3 -2 6 0', 'none', C.ink, 1.1), path('M36 66 C36 60 52 60 52 66 Z', C.hair, null),
    rect(84, 64, 30, 4, C.tan, 1, C.ink, 1), line('M90 68 L90 112 M108 68 L108 112', C.brown, 2.4), ellipse(99, 62, 12, 3, WHITE, C.ink, 1.1), mush(99, 62, 0.45, { cap: CORT, shape: 'cone' }), line('M20 30 C24 24 28 36 32 30 C36 24 40 36 44 30', '#7ab060', 1.6), warn(98, 30, 1.2)),
  'svamp.dödlig.2': all(bg(PAPER), deathCap(26, 92, 1.3), arrow(44, 64, 62, 64, HL, 3), monitor(88, 62, false), greyed(monitor(88, 26, true))),
  'svamp.livsfarlig': all(bg(), floor(96), fig(36, C.green, 'smile', 0.9), reach(36, 0.9, 1, 54, 64), at(54, 64, 0.5, deathCap(0, 10, 1)), warn(84, 48, 3), line('M100 22 L110 14 M104 30 L114 28', RED, 2)),
  'svamp.förväxlingsrisk': all(bg(), floor(96), tratt(34, 104, 2.2), cortin(84, 104, 1.6, { cap: '#8a5a3a', stem: '#e8b860' }), path('M54 58 L66 58 M54 66 L66 66', 'none', C.ink, 2.2), check(34, 22, 1.2), warn(84, 22, 1.3), path('M44 40 C52 30 68 30 76 40', 'none', HL, 2.4), path('M73 34 L76 40 L70 41', 'none', HL, 2.4), path('M47 34 L44 40 L50 41', 'none', HL, 2.4)),
  'svamp.fördröjd': all(bg(PAPER), line('M10 100 L110 100', C.grey, 2), fig(18, C.green, 'smile', 0.42), at(30, 92, 0.4, cortin(0, 0, 1)), line('M30 78 L82 78', HL, 2.6, '4 4'), path('M82 72 L90 78 L82 84', 'none', HL, 2.6), clock(56, 54, 11, 9), num(56, 34, '48', 9), fig(100, C.green, 'sick', 0.42, { skin: '#cfe0b0' })),

  // 2833 Svampens byggnad
  'svamp.hatt.2': all(bg(), floor(100), mush(60, 108, 2, { cap: BOLETE, shape: 'dome', w: 1.1, hl: 'cap' }), greyed(mush(18, 108, 0.8), mush(102, 108, 0.7, { shape: 'bun' }))),
  'svamp.rör.2': all(bg(), floor(100), bolete(38, 108, 1.4, { hl: 'under' }), zoom(90, 36, 22, 42, 72, all(...range(5).map((i) => rect(74 + i * 7, 30, 5, 20, PORE, 1, C.ink, 0.8)), rect(72, 22, 36, 8, BOLETE, 2, C.ink, 1)))),
  'svamp.ring.2': all(bg(), floor(100), deathCap(52, 108, 2.4, { cap: '#c8a070', hl: 'ring' }), greyed(mush(100, 108, 0.8))),
  'svamp.strumpa.2': all(bg(), section(84), flyAg(52, 104, 2, { hl: 'volva' }), path('M30 84 C34 98 70 98 74 84', 'none', SOIL2, 1.4, ), knife(96, 92, -30, 1)),
  'svamp.lamell': all(bg(), circle(56, 60, 42, '#f6efe0', C.ink, 1.6), circle(56, 60, 6, STEMP, C.ink, 1.2), ...range(28).map((i) => { const a = (i / 28) * Math.PI * 2; return line(`M${f1(56 + Math.cos(a) * 7)} ${f1(60 + Math.sin(a) * 7)} L${f1(56 + Math.cos(a) * 41)} ${f1(60 + Math.sin(a) * 41)}`, C.ink, 0.9); }),
    line(`M${f1(56 + Math.cos(0.4) * 8)} ${f1(60 + Math.sin(0.4) * 8)} L${f1(56 + Math.cos(0.4) * 40)} ${f1(60 + Math.sin(0.4) * 40)}`, HL, 3.4), greyed(mush(104, 108, 0.6))),
  'svamp.fruktkropp': all(bg(), section(76), threads(60, 86, 1.1), mush(60, 76, 1.6, { cap: '#c8803a', hl: 'all' }), greyed(mush(22, 76, 0.6), mush(98, 76, 0.5))),
  'svamp.skivling': all(bg(), floor(100), champ(30, 108, 1.4), mush(74, 108, 1.5, { shape: 'flat', cap: '#c89a6a' }), oval(30, 77, 22, 5), oval(74, 85, 28, 5), greyed(bolete(106, 108, 0.6))),
  'svamp.välvd': all(bg(), floor(100), mush(36, 108, 2, { cap: '#c8803a', shape: 'dome', h: 1.1 }), path('M8 52 C10 26 62 26 64 52', 'none', HL, 2.4), greyed(mush(92, 108, 1.4, { cap: '#888', shape: 'flat' }))),
  'svamp.mjölksaft': all(bg(), path('M14 56 C18 36 52 32 60 48 L54 70 C40 72 24 68 14 56 Z', '#e88a3a', C.ink, 1.4), path('M68 48 L74 70 C86 70 100 66 108 56 C102 40 80 36 68 48 Z', '#e88a3a', C.ink, 1.4), path('M60 48 L54 70 M68 48 L74 70', 'none', '#f8e8d0', 3),
    ...[[57, 58], [70, 60]].map(([x, y]) => circle(x!, y!, 2.6, MILK, C.ink, 0.9)), ...[[58, 76], [57, 88], [59, 100], [70, 80], [71, 94]].map(([x, y]) => drop(x!, y!, 1.4, MILK)), oval(64, 82, 16, 24)),
  'svamp.genomskärning': all(bg(), path('M24 60 C24 30 96 30 96 60 C86 64 70 64 66 64 L68 104 L52 104 L54 64 C50 64 34 64 24 60 Z', '#fbf3e0', C.ink, 1.6), path('M24 60 C24 30 96 30 96 60 C94 46 26 46 24 60 Z', BOLETE, null), path('M26 58 C40 62 50 62 54 62 M66 62 C70 62 80 62 94 58', 'none', '#e8d27a', 3.4), knife(60, 18, 90, 1.1, false), line('M60 26 L60 108', HL, 1.8, '3 3')),
  'svamp.blåna': all(bg(), path('M10 70 C10 46 50 46 50 70 L44 102 L16 102 Z', '#f2e2a0', C.ink, 1.4), path('M10 70 C10 50 50 50 50 70 C40 66 20 66 10 70 Z', BOLETE, null), arrow(54, 78, 66, 78, HL, 3), path('M70 70 C70 46 110 46 110 70 L104 102 L76 102 Z', '#f2e2a0', C.ink, 1.4), path('M70 70 C70 50 110 50 110 70 C100 66 80 66 70 70 Z', BOLETE, null), path('M76 74 C84 70 96 70 104 76 L102 98 L80 98 Z', BLUEING, null), path('M70 70 C70 46 110 46 110 70 L104 102 L76 102 Z', 'none', C.ink, 1.4)),
  'svamp.undersida': all(bg(), floor(100), fig(84, C.orange, 'smile', 0.9), reach(84, 0.9, -1, 52, 66), rot(44, 58, 160, 1.4, mush(0, 18, 1, { cap: '#c8803a', shape: 'flat' })), oval(44, 60, 22, 8), greyed(mush(18, 108, 0.6))),

  // 2834 Mycel och sporer
  'svamp.rike.2': all(bg(PAPER), ...[[22, 'a'], [60, 'p'], [98, 'f']].map(([x, k]) => rect((x as number) - 16, 30, 32, 60, k === 'f' ? '#fff3dc' : '#eef0f2', 4, k === 'f' ? HL : C.grey2, k === 'f' ? 2.6 : 1.2)),
    greyed(at(22, 76, 0.5, path('M-16 -6 C-16 -18 12 -18 14 -8 L22 -14 L20 -4 C16 4 -12 6 -16 -6 Z', '#c89a6a', C.ink, 1.2), line('M-10 2 L-12 12 M8 2 L10 12', C.ink, 2)), at(22, 54, 0.45, path('M-8 0 C-8 -8 8 -8 8 0 L12 6 L-12 6 Z', C.sky, C.ink, 1.2))),
    greyed(at(60, 86, 0.8, line('M0 0 L0 -40', LEAF2, 2.4), path('M0 -20 C-10 -26 -14 -20 -14 -16 C-8 -16 -4 -18 0 -20 Z M0 -28 C10 -34 14 -28 14 -24 C8 -24 4 -26 0 -28 Z', LEAF, C.ink, 1), circle(0, -44, 5, C.yellow, C.ink, 1))),
    flyAg(92, 86, 0.6), chant(106, 86, 0.5), mush(98, 62, 0.5, { shape: 'bun' })),
  'svamp.mycel': all(bg(), section(44), threads(60, 70, 1.3), threads(30, 90, 0.7), threads(92, 92, 0.7), greyed(mush(60, 44, 0.7), mush(26, 44, 0.5)), oval(60, 82, 52, 26)),
  'svamp.svamptråd': all(bg(), floor(70, LITTER), rot(30, 70, -30, 1.6, path('M0 0 C4 -6 16 -6 22 0 C16 6 4 6 0 0 Z', '#c8903a', C.ink, 1)), fig(20, C.green, 'smile', 0.5), thread('M30 96 C40 90 50 98 60 92 C70 86 78 94 90 90 M44 104 C52 98 60 104 70 100 M56 86 C60 80 66 82 70 76', 1.4),
    zoom(88, 34, 22, 62, 92, all(circle(88, 34, 20, LITTER, null), thread('M70 30 C78 22 90 40 106 30 M68 40 C80 36 92 46 104 42 M74 22 C82 28 86 26 96 20', 2.4)))),
  'svamp.spor': all(bg(), floor(100), mush(34, 108, 1.6, { cap: '#a8784a', shape: 'flat' }), spores(36, 84, 40, 22), zoom(88, 36, 22, 40, 82, all(...[[80, 30], [92, 28], [86, 42], [98, 40], [78, 44]].map(([x, y]) => ellipse(x!, y!, 4, 2.6, '#a8784a', C.ink, 0.9))))),
  'svamp.sporavtryck': all(bg(), rect(10, 60, 100, 44, WHITE, 2, C.ink, 1.2), mush(36, 78, 1.1, { shape: 'flat', cap: '#c8803a', h: 0.5 }), arrow(54, 80, 64, 80, HL, 2.6), at(86, 82, 1, ...range(24).map((i) => { const a = (i / 24) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 4)} ${f1(Math.sin(a) * 4)} L${f1(Math.cos(a) * 17)} ${f1(Math.sin(a) * 17)}`, '#7a5a3a', 1.6); }), circle(0, 0, 3.5, WHITE, null)), ring(86, 82, 20), greyed(clock(24, 30, 9, 8))),
  'svamp.sporspridning': all(bg(), floor(100), mush(20, 108, 1.2, { cap: '#a8784a', shape: 'flat' }), ...range(4).map((i) => line(`M${30 + i * 4} ${66 + i * 6} C50 ${60 + i * 6} 70 ${70 + i * 4} 100 ${62 + i * 6}`, '#9ab8d8', 1.4)), spores(52, 70, 22, 18), spores(84, 74, 16, 14), arrow(88, 54, 104, 54, HL, 2.6), mush(72, 108, 0.4, { cap: '#a8784a', shape: 'flat' }), mush(98, 108, 0.5, { cap: '#a8784a', shape: 'flat' }), mush(108, 108, 0.35, { cap: '#a8784a', shape: 'flat' })),
  'svamp.mykorrhiza': all(bg(), section(52), decid(30, 52, 0.75), line('M30 52 C26 64 18 70 10 74 M30 52 C34 66 44 72 52 76 M30 52 C30 66 28 80 26 92', BARK2, 2.4), thread('M10 74 C16 80 22 82 26 92 C34 96 44 90 52 76 M18 70 C20 64 28 70 34 66', 1.3), mush(80, 52, 0.8, { cap: '#c8803a', shape: 'bun' }), thread('M80 54 C70 64 60 72 52 76 M80 54 C82 70 74 84 60 92 C44 98 36 94 26 92', 1.3),
    zoom(92, 86, 18, 48, 78, all(rot(92, 86, -20, 1, line('M-16 0 L16 0', BARK2, 5), thread('M-14 -4 C-10 4 -6 -6 -2 4 C2 -6 6 4 10 -4 C12 2 14 -2 16 2', 1.4))))),
  'svamp.värdträd': all(bg(), floor(100), at(44, 108, 1.6, birch(0, 0, 1)), oval(44, 58, 22, 40), chant(26, 108, 0.6), mush(62, 108, 0.6, { shape: 'bun', cap: '#b8703a' }), mush(70, 108, 0.45, { shape: 'flat', cap: '#c8a070' }), greyed(spruce(100, 108, 0.9))),
  'svamp.häxring': all(bg(), rect(4, 40, 112, 72, '#8cc96a', 0, null), line('M4 40 L116 40', '#6fae55', 1), ...range(13).map((i) => { const a = (i / 13) * Math.PI * 2; return mush(f1(60 + Math.cos(a) * 40), f1(80 + Math.sin(a) * 22), f1(0.42 + Math.sin(a) * 0.08), { shape: 'dome', cap: '#d8c8a8', stem: WHITE }); }), ellipse(60, 80, 30, 14, 'none', '#6fae55', 1, )),
  'svamp.underjordisk': all(bg(), section(48), greyed(decid(26, 45, 0.6), mush(90, 45, 0.6)), threads(84, 70, 0.7), line('M26 46 C22 60 14 66 10 72 M26 46 C30 62 38 70 46 74', BARK2, 2), at(60, 96, 1, ellipse(0, 0, 14, 6, '#4a3424', C.ink, 1), ellipse(-6, -2, 4, 3, '#7a6a5a', null)), arrow(60, 30, 60, 60, HL, 3.4), rect(8, 52, 104, 56, 'none', 3, HL, 2)),
  'svamp.mikroskopisk': all(bg(PAPER), microscope(28, 104, 1.4), zoom(84, 44, 26, 32, 70, all(...[[72, 36], [84, 30], [96, 40], [80, 52], [92, 56], [70, 50]].map(([x, y]) => ellipse(x!, y!, 4.6, 3, '#a8784a', C.ink, 1)))), circle(30, 69, 0.8, '#a8784a', null), greyed(circle(96, 98, 7, '#a8784a', C.ink, 1))),
  'svamp.utbyte': all(bg(), section(70), at(28, 70, 1, decid(0, 0, 0.8)), mush(92, 70, 0.9, { shape: 'bun', cap: '#c8803a' }), thread('M92 72 C80 84 50 86 34 80 M28 72 C34 80 38 84 34 80', 1.3), path('M42 36 C58 26 72 26 86 36', 'none', HL, 2.6), path('M80 30 L86 36 L78 38', 'none', HL, 2.6), sugarCube(64, 22, 1.3), path('M86 54 C72 64 56 64 42 54', 'none', '#3f86c0', 2.6), path('M48 60 L42 54 L50 52', 'none', '#3f86c0', 2.6), drop(64, 66, 1.4)),

  // 2835 Nedbrytare i naturen
  'svamp.angripa.2': all(bg(), floor(100), at(42, 108, 1.4, path('M-5 0 L-4 -40 L4 -40 L5 0 Z', BARK, C.ink, 1.2), line('M0 -36 L-12 -48 M0 -38 L12 -52', BARK, 2.4), ...[[-12, -52, 8], [12, -56, 8], [0, -58, 9]].map(([x, y, r]) => circle(x!, y!, r!, '#b8b060', C.ink, 1))),
    ...[[36, 92], [50, 82], [36, 72]].map(([x, y], i) => bracket(x!, y!, 0.7, '#c8a878', i === 1)), arrow(22, 86, 34, 84, HL, 2.4), arrow(66, 76, 54, 78, HL, 2.4), greyed(decid(100, 108, 0.8))),
  'svamp.rötsvamp': all(bg(), floor(100), at(54, 104, 1, rect(-40, -16, 80, 18, '#a87a4a', 3, C.ink, 1.3), ...[[-30, -10], [-10, -12], [12, -8], [28, -12]].map(([x, y]) => path(`M${x} ${y} l3 3 l-2 3 l4 2`, 'none', '#5a3a20', 1)), ...[[-24, 2], [6, 3], [30, 2]].map(([x, y]) => ellipse(x!, y!, 3, 1.6, '#c8a070', C.ink, 0.6))), mush(36, 88, 0.6, { cap: '#c8a060', shape: 'flat' }), mush(48, 88, 0.45, { cap: '#c8a060', shape: 'flat' }), mush(72, 88, 0.5, { cap: '#c8a060', shape: 'flat' }),
    zoom(88, 34, 20, 60, 92, all(path('M72 30 L104 30 L104 44 L72 44 Z', '#c8a070', C.ink, 1), path('M74 34 l4 4 l-3 3 M86 32 l2 5 l4 2 M96 36 l3 4', 'none', '#5a3a20', 1), thread('M72 26 C80 20 90 30 104 24', 1.6)))),
  'svamp.ticka': all(bg(), floor(100), at(50, 112, 1, path('M-10 0 L-9 -100 L9 -100 L10 0 Z', BIRCH, C.ink, 1.4), line('M-8 -20 L2 -20 M-2 -46 L8 -46 M-8 -72 L0 -72 M2 -86 L8 -86', C.ink, 1.6)), bracket(60, 50, 1.4, '#b89a78'), bracket(60, 70, 1.1, '#a88a6a'), bracket(40, 82, 1, '#b89a78', true), oval(76, 52, 20, 11), greyed(spruce(100, 108, 0.9))),
  'svamp.murken': all(bg(), floor(100), stock(14, 92, 54, 10, '#a87a4a'), ...[[40, 104], [48, 108], [34, 108], [44, 112]].map(([x, y]) => rect(x!, y! - 4, 4, 3, '#a87a4a', 1, C.ink, 0.6)), path('M38 82 l3 4 l-2 4 l4 3 M52 84 l2 4 l-3 4', 'none', '#5a3a20', 1), fig(92, C.orange, 'shock', 0.8), reach(92, 0.8, -1, 62, 82), greyed(stock(20, 30, 40, 7, BARK))),
  'svamp.frigöra': all(bg(), section(70), rot(60, 52, -10, 2.4, path('M0 0 C4 -6 16 -6 22 0 C16 6 4 6 0 0 Z', '#a8783a', C.ink, 0.7)), path('M70 44 l3 4 l-3 3 M80 52 l2 3', 'none', '#5a3a20', 0.8), ...range(10).map((i) => circle(50 + (i % 5) * 9, 74 + Math.floor(i / 5) * 10 + (i % 2) * 3, 2, C.yellow, C.ink, 0.7)),
    ...[[54, 70, 52, 86], [72, 70, 70, 84], [88, 70, 92, 86]].map(([a, b, c, d]) => arrow(a!, b!, c!, d!, HL, 2.2)), at(22, 70, 1, line('M0 0 L0 -30', LEAF2, 2.2), path('M0 -16 C-8 -22 -12 -16 -12 -12 C-6 -12 -2 -14 0 -16 Z M0 -24 C8 -30 12 -24 12 -20 C6 -20 2 -22 0 -24 Z', LEAF, C.ink, 1), line('M0 0 L-6 14 M0 0 L6 16 M0 0 L0 20', '#e8e0c8', 1.4)), path('M40 96 C30 96 26 92 22 88', 'none', HL, 2, ), path('M27 86 L22 88 L25 93', 'none', HL, 2)),

  // 2836 Svampodling
  'svamp.svampodling': all(bg('#ece6dc'), rect(10, 20, 4, 92, WOODD, 0, C.ink, 1), rect(106, 20, 4, 92, WOODD, 0, C.ink, 1), ...[44, 76, 106].map((y) => rect(10, y, 100, 4, WOODD, 1, C.ink, 1)),
    ...[[30, 44], [60, 44], [90, 44], [30, 76], [60, 76], [90, 76]].map(([x, y]) => all(bag(x!, y!, 0.75), oyster(x! - 2, y! - 16, 0.4, -20), oyster(x! - 1, y! - 10, 0.35, 10))), at(60, 106, 1, plateOf(0, 0), champ(-6, -1, 0.35), champ(6, -1, 0.35))),
  'svamp.champinjon': all(bg(PAPER), rect(4, 92, 112, 20, '#c9a27a', 0, null), path('M18 96 L102 96 L96 72 L24 72 Z', '#6a8ab8', C.ink, 1.3), ...[[34, 74], [50, 72], [66, 74], [82, 72], [42, 84], [60, 84], [76, 84]].map(([x, y]) => champ(x!, y!, 0.6)), champ(92, 58, 0.9, { hl: 'under' }), greyed(cortin(16, 60, 0.6))),
  'svamp.ostronskivling': all(bg(), stock(6, 82, 60, 16), oyster(40, 66, 1.1, -30), oyster(46, 74, 1.2, -5), oyster(42, 84, 1, 20), oyster(54, 64, 0.8, -40), zoom(94, 32, 18, 60, 70, oyster(84, 34, 1, -10))),
  'svamp.shiitakesvamp': all(bg(), floor(102), at(60, 92, 1, rot(0, 0, -10, 1, rect(-44, -12, 88, 24, '#7a6a5a', 4, C.ink, 1.4), line('M-40 -6 L40 -8 M-38 4 L36 2', '#5a4a3a', 1))), shiitake(32, 80, 0.9), shiitake(58, 76, 1.1), shiitake(84, 70, 0.9), zoom(96, 28, 18, 58, 60, shiitake(96, 40, 0.7))),
  'svamp.substrat': all(bg(PAPER), path('M24 30 L96 30 L90 108 L30 108 Z', '#efe4cc', C.ink, 1.4), ...range(18).map((i) => line(`M${30 + (i % 6) * 10} ${40 + Math.floor(i / 6) * 22} l${i % 2 ? 6 : -6} ${4}`, '#d8b860', 2)), ...range(14).map((i) => circle(34 + (i % 7) * 8, 52 + Math.floor(i / 7) * 30, 1.6, '#c8a070', null)),
    thread('M30 60 C44 56 56 70 70 62 C80 56 86 66 90 60 M34 86 C46 80 58 92 72 86 C80 82 84 90 88 86', 1.4), rect(24, 30, 72, 78, 'none', 3, HL, 2.4)),
  'svamp.sågspån': all(bg(), rect(10, 50, 70, 18, WOODL, 2, C.ink, 1.3), line('M60 50 L60 68', WOODD, 1.6, '2 2'), at(60, 40, 1, rect(-6, -14, 34, 6, C.silver, 1, C.ink, 1), path('M-6 -8 L28 -8 L28 6 L-6 6 Z', C.silver, C.ink, 1), line(range(10).map((i) => `M${-4 + i * 3.2} 6 l1.6 2.4 l1.6 -2.4`).join(' '), C.ink, 0.8), rect(28, -14, 12, 14, RED, 3, C.ink, 1.1)),
    path('M40 112 C44 92 76 92 80 112 Z', '#e8c896', C.ink, 1.2), ...range(20).map((i) => rect(44 + (i % 10) * 3.4, 100 + Math.floor(i / 10) * 5 + (i % 3), 1.8, 1, WOODD, 0, null)), ...[[62, 74], [56, 80], [66, 84]].map(([x, y]) => rect(x!, y!, 2, 1.2, WOODD, 0, null)), oval(60, 102, 24, 12)),
  'svamp.kaffesump': all(bg(PAPER), rect(4, 96, 112, 16, '#c9a27a', 0, null), at(36, 60, 1, path('M-18 -16 L18 -16 L6 8 L-6 8 Z', WHITE, C.ink, 1.3), path('M-15 -12 L15 -12 L5 6 L-5 6 Z', '#4a3020', null), ...range(8).map((i) => circle(-10 + i * 3, -11 + (i % 2), 1, '#2a1a10', null))), path('M30 72 L42 72 L44 88 L28 88 Z', 'rgba(220,235,240,0.7)', C.ink, 1),
    arrow(58, 62, 74, 72, HL, 2.6), bag(92, 98, 1), path('M80 82 L104 82 L104 96 L80 96 Z', '#4a3020', null), oyster(84, 76, 0.5, -30), oyster(94, 72, 0.5, -10), oval(36, 52, 24, 14)),
  'svamp.trästock': all(bg(), floor(96), stock(18, 88, 64, 13), oval(54, 88, 44, 20), greyed(at(102, 108, 0.6, path('M-4 0 L-3 -40 L3 -40 L4 0 Z', BARK, C.ink, 1.2), circle(0, -50, 12, LEAF, C.ink, 1.2)))),
  'svamp.odlingspåse': all(bg(PAPER), rect(4, 100, 112, 12, '#c9a27a', 0, null), at(60, 100, 2, path('M-14 -36 L14 -36 L16 0 L-16 0 Z', '#e8e4d8', C.ink, 0.8), line('M-14 -36 L-10 -42 L10 -42 L14 -36', C.ink, 0.7), thread('M-12 -28 C-6 -32 0 -24 8 -30 M-12 -14 C-4 -18 4 -10 12 -16', 0.8)), oyster(52, 70, 0.7, -40), oyster(54, 76, 0.8, -10), oyster(76, 50, 0.7, -20), oyster(78, 56, 0.6, 20), oval(60, 64, 34, 40)),
  'svamp.fukta': all(bg(), bag(46, 108, 1.6), oyster(36, 72, 0.9, -30), oyster(40, 80, 1, 0), sprayer(94, 62, 1.4), mist(62, 54), mist(56, 64), drop(48, 64, 0.8), drop(54, 74, 0.7)),
  'svamp.sterilisera': all(bg(PAPER), rect(4, 104, 112, 8, C.dark, 0, null), path('M22 60 L82 60 L80 104 L24 104 Z', C.silver, C.ink, 1.4), rect(18, 56, 68, 6, C.grey, 2, C.ink, 1.1), path('M24 64 L80 64 L79 70 L25 70 Z', '#9fd0ec', null), bag(52, 98, 0.9, '#e8dcb8'), line('M36 50 q-3 -4 0 -8 q3 -4 0 -8 M52 48 q-3 -4 0 -8 q3 -4 0 -8 M68 50 q-3 -4 0 -8 q3 -4 0 -8', '#9aa3ad', 1.6),
    ...[[100, 30], [104, 52]].map(([x, y]) => all(ellipse(x!, y!, 6, 4, '#8ac06a', C.ink, 1), line(`M${x! - 6} ${y} l-3 -2 M${x! + 6} ${y} l3 2`, C.ink, 0.8), line(`M${x! - 9} ${y! - 7} L${x! + 9} ${y! + 7}`, RED, 2.4))), ...[[20, 100], [36, 102], [62, 102], [84, 100]].map(([x, y]) => path(`M${x} ${y} q-3 -6 0 -10 q2 4 4 0 q2 6 -1 10 Z`, AUT_O, null))),

  // 2837 Svampplockning och säkerhet
  'svamp.rensa.3': all(bg(), mush(44, 98, 1.6, { shape: 'bun', cap: BOLETE, w: 1.3 }), ...[[40, 96], [46, 100], [52, 97], [36, 102], [56, 104]].map(([x, y]) => circle(x!, y!, 1.6, SOIL, null)), ...[[30, 110], [48, 111], [60, 110]].map(([x, y]) => circle(x!, y!, 1.4, SOIL, null)), fig(96, C.green, 'smile', 0.85), knife(76, 86, -150, 1.1), reach(96, 0.85, -1, 82, 84), needles(30, 60), line('M60 92 L66 100 M64 88 L70 96', HL, 1.6)),
  'svamp.svampplockare': all(bg(), floor(100), spruce(20, 104, 0.8), spruce(104, 102, 0.75), fig(54, C.orange, 'smile', 0.9, { bottom: C.green }), basket(80, 96, 1.1, all(chant(-4, -12, 0.35), chant(4, -12, 0.3))), reach(54, 0.9, 1, 72, 82), chant(30, 108, 0.7), chant(40, 110, 0.5)),
  'svamp.svampkniv': all(bg(), knife(62, 56, -20, 2.4), oval(25, 69, 10, 9), greyed(knife(66, 98, 0, 1.4, false))),
  'svamp.svampbok': all(bg(PAPER), book(52, 54, 1.6, all(chant(-14, 18, 0.45), tratt(-6, 18, 0.35)), all(bolete(14, 18, 0.4), flyAg(6, 18, 0.25))), chant(100, 104, 0.9), arrow(94, 84, 80, 72, HL, 2.4)),
  'svamp.svampkunnig': all(bg(), floor(100), fig(32, C.green, 'laugh', 0.85), at(56, 52, 1, chant(0, 0, 0.5), check(10, -18, 0.6)), at(10, 34, 1, flyAg(0, 0, 0.35), cross(10, -12, 0.5)), greyed(fig(92, C.grey, 'frown', 0.75)), greyed(mush(110, 100, 0.5)), qmark(92, 18, 1)),
  'svamp.svampkonsulent': all(bg(PAPER), rect(4, 82, 112, 6, C.tan, 2, C.ink, 1.2), line('M14 88 L14 112 M106 88 L106 112', C.brown, 3), fig(30, C.navy, 'calm', 0.85), basket(64, 82, 1.2, all(chant(-5, -12, 0.35), mush(5, -12, 0.35, { cap: CORT, shape: 'cone' }))), at(46, 64, 1, circle(0, 0, 7, 'rgba(220,240,250,0.6)', C.ink, 1.6), line('M5 5 L11 11', C.dark, 3)), reach(30, 0.85, 1, 42, 66),
    fig(96, C.orange, 'smile', 0.75), at(30, 52, 1, rect(-5, -3, 10, 7, C.yellow, 1, C.ink, 0.8), chant(0, 3, 0.12))),
  'svamp.vid-minsta-tvekan': all(bg(), floor(100), fig(34, C.green, 'calm', 0.85), at(64, 58, 1, cortin(0, 0, 0.6)), qmark(54, 16, 0.6), arrow(72, 46, 86, 46, HL, 2.6), palm(100, 46, 1.2), cross(100, 80, 1.2)),
  'svamp.tumregel': all(bg(PAPER), thumbUp(24, 60, 1.6), rect(50, 20, 60, 80, WHITE, 3, C.ink, 1.4), at(64, 40, 1, chant(0, 8, 0.3)), check(94, 38, 0.9), at(64, 64, 1, qmark(0, 0, 0.7)), cross(94, 64, 0.9), at(64, 88, 1, mush(0, 6, 0.3, { cap: CORT, shape: 'cone' })), cross(94, 86, 0.9)),
  'svamp.jaktsäsong': all(bg('#f4ead8'), floor(98, '#b8a86a'), spruce(20, 104, 0.8), decid(100, 100, 0.8, AUT_O), moose(78, 106, 1), fig(38, AUT_O, 'calm', 0.8, { bottom: '#5a6a3a' }), hunterCap(38, 30, 1.1), line('M50 70 L66 52', C.dark, 2.6), reach(38, 0.8, 1, 54, 66),
    at(98, 24, 0.7, rect(-14, -12, 28, 26, WHITE, 2, C.ink, 1.2), rect(-14, -12, 28, 6, RED, 2, C.ink, 1), leafBit(-6, 6, -30, AUT_O, 1))),
};
function i_(a: number): string { return a > 0 ? AUT_Y : AUT_O; }
