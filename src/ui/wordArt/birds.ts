/**
 * Natur & geografi → Djurvärlden → Fåglar, 2711–2717 (0.44): small birds in Sweden, birds of prey, water birds,
 * migratory birds, beaks and plumage, nesting, and bird calls and behaviour.
 * Recurring signs: each species is drawn with its field marks in clear colours (talgoxe yellow with a black
 * stripe, blåmes blue cap, domherre red breast and black cap, skata black and white with a long tail, gräsand
 * green head with a white collar, knölsvan orange bill with a black knob, havsörn white tail and huge yellow
 * beak …), a blue sky or water, a brown branch or green grass, small people in orange or blue for scale, and an
 * orange highlight (ring, outline or arrow) on the part that the word names. Sounds are short grey or ink marks
 * beside the beak (jagged for harsh calls, round rings for soft calls, notes for song). Adjectives are scenes
 * where the property dominates, with a small grey reference panel that lacks it. No words, no letters, no
 * brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#cfe6f7';
const DUSK = '#2a3560';
const WATER = '#7db7df';
const WATER2 = '#5c9fd0';
const GRASS = '#9fcb6e';
const GRASS2 = '#7fb356';
const SNOW = '#f5f8fb';
const BARK = '#8a5a35';
const ROCK = '#a7a39b';
const SAND = '#ecd9a8';
const AUTUMN = '#e39a3b';
const BLACK = '#26262c';
const GREY = '#8d949c';
const LGREY = '#c9cfd5';
const WHITE = '#fbfbf8';
const YEL = '#f4cf3a';
const OLIVE = '#9aa860';
const BLUE = '#3f86d6';
const BROWN = '#8b5a33';
const LBROWN = '#c49a6c';
const PINK = '#e7a08d';
const RED = '#d23b2e';
const ORANGE = '#ef8a3c';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Same as at() but mirrored, so the figure faces left. */
const atL = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const sea = (y = 80, col: string = WATER) => all(rect(4, y, 112, 112 - y, col, 0, null), line(range(5).map((i) => `M${10 + i * 22} ${y + 8 + (i % 2) * 10} q4 -2 8 0`).join(' '), WHITE, 1));
const wave = (x: number, y: number, w: number) => line(`M${x} ${y} q${f1(w / 4)} -2.5 ${f1(w / 2)} 0 q${f1(w / 4)} 2.5 ${f1(w / 2)} 0`, WATER2, 1.4);
const branch = (x1: number, y1: number, x2: number, y2: number, w = 4) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, w + 2), line(`M${x1} ${y1} L${x2} ${y2}`, BARK, w));
const leaf = (x: number, y: number, a = 0, col: string = GRASS2) => rot(x, y, a, 1, path('M0 0 C3 -4 9 -4 12 0 C9 4 3 4 0 0 Z', col, C.ink, 0.7));
const trunk = (x: number, w = 22, col: string = BARK) => all(rect(x - w / 2, 4, w, 108, col, 0, C.ink, 1.2), line(`M${x - w / 4} 14 l0 10 M${x + w / 5} 40 l0 12 M${x - w / 6} 70 l0 9`, '#6d4528', 1.2));
const pine = (x: number, y: number, s = 1, col = '#3f8a4f') => at(x, y, s, rect(-1.5, -5, 3, 5, BARK, 0, C.ink, 0.8), path('M0 -30 L9 -5 L-9 -5 Z', col, C.ink, 1.1));
const tree = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, rect(-2, -14, 4, 14, BARK, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2), circle(-5, -15, 5.5, col, null), circle(5, -16, 5.5, col, null));
const birch = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, rect(-2, -26, 4, 26, WHITE, 1, C.ink, 1), line('M-2 -20 l2 0 M0 -12 l2 0 M-2 -6 l1.5 0', C.ink, 1), ellipse(0, -32, 9, 11, col, C.ink, 1.1));
const rockAt = (x: number, y: number, w: number, h: number, col: string = ROCK) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h} ${x - w / 5} ${y - h} ${x} ${y - h} C${x + w / 4} ${y - h} ${x + w / 2} ${y - h * 0.7} ${x + w / 2} ${y} Z`, col, C.ink, 1.2);
const post = (x: number, top: number, bottom = 112, w = 6) => rect(x - w / 2, top, w, bottom - top, '#9b7a55', 1, C.ink, 1.1);
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2.5))} ${f1(y + Math.sin(a) * (r + 2.5))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.5} A${r * 0.8} ${r * 0.8} 0 1 1 ${x} ${y - r} Z`, '#f5e7a8', C.ink, 0.8);
const starDot = (x: number, y: number) => path(`M${x} ${y - 2.4} L${x + 0.7} ${y - 0.7} L${x + 2.4} ${y} L${x + 0.7} ${y + 0.7} L${x} ${y + 2.4} L${x - 0.7} ${y + 0.7} L${x - 2.4} ${y} L${x - 0.7} ${y - 0.7} Z`, '#f5e7a8', null);
const flower = (x: number, y: number, col: string = WHITE) => all(line(`M${x} ${y} L${x} ${y - 7}`, GRASS2, 1.2), circle(x, y - 8, 2.2, col, C.ink, 0.6));
const snowdrop = (x: number, y: number) => all(line(`M${x} ${y} L${x} ${y - 9} q2 -1 3 1`, GRASS2, 1.2), path(`M${x + 3} ${y - 8} c-2 1 -2 5 0 6 c2 -1 2 -5 0 -6 Z`, WHITE, C.ink, 0.6));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const frame = (x: number, y: number, w: number, h: number, col: string = C.ink) => rect(x, y, w, h, 'none', 2, col, 1.2);
/** A full 120×120 drawing shrunk into a panel at (x, y) with scale s, with a frame. */
const pane = (x: number, y: number, s: number, ...k: Svg[]) => all(rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, C.white, 2, null), g(`translate(${x} ${y}) scale(${s})`, ...k), frame(x + 4 * s, y + 4 * s, 112 * s, 108 * s));
/** Grey reference: the same kind of scene without the property, drained of colour. */
const grey = (...k: Svg[]): Svg => `<g opacity="0.8" style="filter:grayscale(1)">${k.join('')}</g>`;
const greyPane = (x: number, y: number, s: number, ...k: Svg[]) => all(rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, C.white, 2, null), grey(g(`translate(${x} ${y}) scale(${s})`, ...k)), rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, 'none', 2, C.grey, 1.2));
/** A reference panel that keeps its colours but has a grey frame. */
const refPane = (x: number, y: number, s: number, ...k: Svg[]) => all(rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, C.white, 2, null), `<g opacity="0.85">${g(`translate(${x} ${y}) scale(${s})`, ...k)}</g>`, rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, 'none', 2, C.grey, 1.2));
const cross = (x: number, y: number, r: number) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, RED, 3);

// ── Sounds ───────────────────────────────────────────────────────────
const note = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M0 6 L0 -6 L5 -8', col, 1.4), ellipse(-1.8, 6, 2.4, 1.8, col, null));
const chirp = (x: number, y: number, col: string = C.ink) => line(`M${x} ${y} l4 -3 M${x + 1} ${y + 3} l5 0 M${x} ${y + 6} l4 3`, col, 1.2);
const jag = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M0 -6 L4 -3 L1 0 L5 3 L2 6 M7 -9 L12 -5 L8 -1 L13 3 L9 7 L13 10', col, 1.5));
const rings = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M0 -4 A5 5 0 0 1 0 4 M4 -8 A10 10 0 0 1 4 8 M8 -12 A15 15 0 0 1 8 12', col, 1.4));
const speed = (x: number, y: number, len: number, n = 3, gap = 5, col: string = C.grey) => line(range(n).map((i) => `M${x + i * gap} ${y} l0 ${-len}`).join(' '), col, 1.4);

// ── People ───────────────────────────────────────────────────────────
/** A standing person, feet at (x, y); arms is an optional path in local coordinates (shoulders at y≈-16). */
const kid = (x: number, y: number, s = 1, col: string = C.orange, arms = '', extra: Svg = '') => at(x, y, s, line('M-2 0 L-1.5 -8 M2 0 L1.5 -8', C.ink, 1.8), path('M-3.8 -8 L3.8 -8 L3.2 -17 L-3.2 -17 Z', col, C.ink, 0.9), circle(0, -20.5, 3.4, C.skin, C.ink, 0.9), path('M-3.4 -21 C-3.4 -25.5 3.4 -25.5 3.4 -21 C1.5 -22.5 -1.5 -22.5 -3.4 -21 Z', C.hair, null), line(arms || 'M-3.2 -16 L-4.6 -9 M3.2 -16 L4.6 -9', C.ink, 1.5), extra);
/** Binoculars held at the eyes of a kid() at the same position and scale. */
const binoc = (x: number, y: number, s = 1) => at(x, y, s, rect(-1, -23.5, 6, 3.6, C.dark, 1, C.ink, 0.6), circle(5.6, -21.7, 1.6, '#bfe3f5', C.ink, 0.5));
const binocArms = 'M-3.2 -16 L1 -20 M3.2 -16 L4 -20';
/** A mitten hand seen from the side, palm up (no finger). */
const palm = (x: number, y: number, s = 1, col: string = C.skin) => at(x, y, s, path('M-14 4 L-2 4 C4 4 10 2 12 -1 C13 -3 11 -4 9 -3 C6 -1 2 -1 -2 -1 L-14 -1 Z', col, C.ink, 1), path('M-24 6 L-14 5 L-14 -2 L-24 -3 Z', C.denim, C.ink, 1));

// ── Birds ────────────────────────────────────────────────────────────
type Song = {
  body?: string; back?: string; belly?: string; head?: string; cap?: string; cheek?: string; eyeStripe?: string; bib?: string; stripe?: string;
  face?: string; breast?: string; wing?: string; bar?: string; bar2?: string; tail?: string; tailLen?: number; tailUp?: number; beak?: string; beakLen?: number;
  beakW?: number; eyeRing?: string; spots?: string; streaks?: string; nape?: string; crest?: string; legs?: string; open?: boolean; bars?: string; noLegs?: boolean;
};
/** A perching songbird facing right, feet at (0, 0); about 30 × 25 units at scale 1. */
const song = (o: Song = {}): Svg => {
  const body = o.body ?? LBROWN, tl = o.tailLen ?? 10, tu = o.tailUp ?? 0, bl = o.beakLen ?? 4, bw = o.beakW ?? 1.4;
  const outline = 'M-8 -16 C-2 -21 8 -19 10 -14 C12 -9 8 -4 1 -4 C-5 -4 -9 -8 -10 -12 Z';
  return all(
    path(`M-7 -14.5 L${-8 - tl} ${-10 - tu} L${-7 - tl} ${-6.5 - tu} L-6 -9 Z`, o.tail ?? o.wing ?? body, C.ink, 1),
    o.noLegs ? '' : line('M-1 -5 L-2 0 M3 -5 L3.5 0 M-4 0 L1 0 M1 0 L6 0', o.legs ?? '#6b5b4f', 1.2),
    path(outline, body, null),
    o.back ? path('M-8 -16 C-2 -21 8 -19 10 -14 C5 -14.5 -2 -14.5 -10 -12 Z', o.back, null) : '',
    o.belly ? path('M-7 -7.5 C-3 -4.2 6 -3.5 9 -8 C10 -11 10.3 -13 10 -14.5 C6 -12 0 -9.5 -7 -7.5 Z', o.belly, null) : '',
    o.breast ? path('M3 -16 C8 -17 11 -15 10.6 -11 C10 -8 8 -6.5 5 -6.5 C3 -9 2 -13 3 -16 Z', o.breast, null) : '',
    o.streaks ? line('M3 -12 l-1 2 M6 -11 l-1 2 M8 -13 l-1 2 M4 -8 l-1 2 M7 -8 l-1 2 M0 -9 l-1 2 M-3 -8 l-1 2', o.streaks, 1) : '',
    o.bars ? line('M0 -10 l5 -1 M1 -7.5 l6 -1 M3 -12.5 l5 -1 M-3 -7 l4 -0.5', o.bars, 0.9) : '',
    o.stripe ? line('M9.5 -13 C8 -10 6 -7 3 -4.5', o.stripe, 2.2) : '',
    path('M-7 -15 C-2 -18.5 5 -16.5 6 -12 C2 -9 -4 -9 -9.5 -11 Z', o.wing ?? body, C.ink, 0.9),
    o.bar ? line('M-5.5 -12.8 C-2 -14.6 1.5 -14 4.5 -12.3', o.bar, 1.5) : '',
    o.bar2 ? line('M-7 -11 C-4 -12 -1 -11.8 2 -10.6', o.bar2, 1.3) : '',
    o.spots ? all(...[[-4, -13], [0, -15], [4, -13.5], [-1, -10], [3, -9], [7, -10], [6, -6.5], [1, -6], [-5, -9]].map(([x, y]) => circle(x!, y!, 0.75, o.spots!, null))) : '',
    path(outline, 'none', C.ink, 1.1),
    o.crest ? path('M6.5 -23 L3.5 -28 L9.5 -24 Z', o.crest, C.ink, 0.8) : '',
    circle(9, -19, 5.5, o.head ?? body, C.ink, 1.1),
    o.face ? path('M9.5 -24.4 A5.5 5.5 0 0 1 9.5 -13.6 C8 -15 7.5 -18 9.5 -24.4 Z', o.face, null) : '',
    o.nape ? path('M4.2 -21.5 C3.4 -19 3.6 -16.5 5 -14.6 L7 -17 Z', o.nape, null) : '',
    o.cap ? path('M3.6 -19.8 A5.5 5.5 0 0 1 14.4 -19.8 Z', o.cap, null) : '',
    o.cheek ? ellipse(8.4, -17.6, 3, 2, o.cheek, null) : '',
    o.eyeStripe ? line('M5 -19.5 L14 -19.5', o.eyeStripe, 1.2) : '',
    o.bib ? path('M13.6 -16 C12.6 -13 10.5 -11.5 8 -11.5 C8.5 -13.5 10 -15.5 12 -16.4 Z', o.bib, null) : '',
    circle(9, -19, 5.5, 'none', C.ink, 1.1),
    o.eyeRing ? circle(11, -20, 1.6, o.eyeRing, null) : '',
    circle(11, -20, 0.9, C.ink, null),
    o.open
      ? path(`M14 ${-19.4 - bw} L${14 + bl} ${-21 - bw} L14 -19.2 L${14 + bl} -16.4 L14 ${-18.6 + bw} Z`, o.beak ?? C.dark, C.ink, 0.7)
      : path(`M14 ${-19 - bw} L${14 + bl} -18.6 L14 ${-19 + bw} Z`, o.beak ?? C.dark, C.ink, 0.7),
  );
};
// Species presets (field marks).
const TALGOXE: Song = { body: OLIVE, back: '#93a85a', belly: YEL, head: BLACK, cheek: WHITE, stripe: BLACK, wing: '#7d93a8', bar: WHITE, tail: '#5d6f80' };
const BLAMES: Song = { body: '#9fb070', belly: YEL, head: WHITE, cap: BLUE, eyeStripe: '#1f3a6b', bib: '#1f3a6b', wing: BLUE, bar: WHITE, tail: BLUE, beakLen: 3 };
const DOMHERRE: Song = { body: '#9ea4ab', belly: '#e0574a', breast: '#e0574a', head: '#e0574a', cap: BLACK, wing: BLACK, bar: WHITE, tail: BLACK, beakLen: 3, beakW: 2.2, beak: BLACK };
const RODHAKE: Song = { body: '#9a8155', belly: '#f1ead8', breast: '#ec8a3a', head: '#9a8155', face: '#ec8a3a', wing: '#8a7048', tail: '#8a7048', beakLen: 3.6, beakW: 1 };
const BOFINK: Song = { body: '#b07a52', back: '#9b6440', belly: '#d9a08a', breast: '#d38a72', head: '#7f95b3', face: '#d38a72', wing: BLACK, bar: WHITE, bar2: WHITE, tail: '#4a4a50', beak: '#8f9aa4' };
const GRASPARV: Song = { body: '#b48a5a', back: '#9b6e42', belly: '#c9c6bd', head: '#b07040', cap: '#8e959c', cheek: '#d9d6cf', bib: BLACK, wing: '#8b5e36', bar: WHITE, tail: '#7a5532', streaks: '#5e3f22', beakW: 1.8 };
const KOLTRAST: Song = { body: BLACK, wing: '#33333a', tail: BLACK, head: BLACK, beak: '#f0a530', eyeRing: '#f0a530', tailLen: 13, beakLen: 4.5 };
const STARE: Song = { body: '#2d3036', wing: '#3a3d45', tail: '#2d3036', head: '#2d3036', spots: WHITE, beak: YEL, beakLen: 5, beakW: 1.1, tailLen: 7 };
const SKATA: Song = { body: WHITE, back: BLACK, head: BLACK, bib: BLACK, breast: BLACK, wing: BLACK, bar: WHITE, tail: '#1f3d3a', tailLen: 26, tailUp: 2, beak: BLACK, beakLen: 5, beakW: 1.6 };
const KRAKA: Song = { body: '#9aa0a7', head: BLACK, bib: BLACK, wing: BLACK, tail: BLACK, beak: BLACK, beakLen: 6, beakW: 1.9, tailLen: 11 };
const ARLA: Song = { body: '#a7adb3', belly: WHITE, head: WHITE, cap: BLACK, bib: BLACK, breast: BLACK, wing: '#6f757c', bar: WHITE, tail: BLACK, tailLen: 20, tailUp: -3, beakLen: 3.4, beakW: 1 };
const GOK: Song = { body: '#8a929c', belly: '#eef0f2', bars: '#555b63', head: '#8a929c', wing: '#6f7781', tail: '#5f6670', tailLen: 18, beakLen: 4, beakW: 1.2, eyeRing: YEL, beak: '#555' };
const LARKA: Song = { body: '#b8925f', back: '#a07d4c', belly: '#ece0c6', streaks: '#6b4a28', head: '#b8925f', crest: '#a07d4c', wing: '#9b7646', bar: '#e6d5b0', tail: '#8a6a3e', beakLen: 3.6 };
const GENERIC: Song = { body: '#b98e5c', belly: '#ecdcc0', head: '#b98e5c', wing: '#8f6740', bar: '#e9d8b8', tail: '#7f5a36' };

/** A woodpecker clinging to a trunk to its left; (x, y) is the foot point, facing up-right. */
const woodpecker = (x: number, y: number, s = 1, pecking = false) => rot(x, y, -62, s,
  path('M-7 -14.5 L-20 -9 L-19 -6 L-6 -9 Z', BLACK, C.ink, 1),
  song({ body: BLACK, belly: '#f0ece2', head: WHITE, cap: BLACK, nape: RED, cheek: WHITE, wing: BLACK, bar: WHITE, bar2: WHITE, tail: BLACK, beak: C.dark, beakLen: pecking ? 7 : 6, beakW: 1.3, noLegs: true }),
  path('M-6 -6 C-4 -4 -1 -3.6 1 -4 C0 -6 -3 -7 -6 -6 Z', RED, C.ink, 0.6), line('M-1 -4 L-3 0 M3 -5 L2 0', C.dark, 1.4));

type Duck = { body?: string; breast?: string; flank?: string; head?: string; bill?: string; ring?: boolean; cheekSpot?: boolean; peaked?: boolean; tail?: string; eye?: string; nape?: string; cap?: string; longBill?: boolean; wedge?: boolean; checks?: boolean; neckBars?: boolean; dagger?: boolean; low?: boolean; open?: boolean };
/** A swimming duck facing right; the water line is y = 0. */
const duck = (o: Duck = {}): Svg => {
  const body = o.body ?? '#b8a083';
  const dy = o.low ? 4 : 0;
  const bill = o.longBill ? path('M16.5 -22 L27 -20.6 L27.6 -19.2 L26 -19.6 L16.5 -18.6 Z', o.bill ?? RED, C.ink, 0.8)
    : o.dagger ? path('M16.5 -22 L26 -20 L16.5 -18.4 Z', o.bill ?? BLACK, C.ink, 0.8)
    : o.wedge ? path('M14 -25 L24 -19.5 L16.5 -17.6 Z', o.bill ?? '#b9c7a3', C.ink, 0.8)
    : o.open ? path('M17 -22 C20 -23 23 -23.5 24 -22.5 L18 -20.4 L24 -18 C22 -17 19 -17.6 17 -18.6 Z', o.bill ?? YEL, C.ink, 0.8)
    : path('M17 -22 C20 -22 23 -21.4 23.4 -19.8 C21.4 -19 19 -19 17 -18.8 Z', o.bill ?? YEL, C.ink, 0.8);
  return g(`translate(0 ${dy})`,
    path('M-15 -6 L-22 -10 L-17 -2.5 Z', o.tail ?? body, C.ink, 1),
    path('M-18 -2 C-20 -9 -13 -11.5 -4 -11.5 L6 -11.5 C12 -11.5 15 -7 14 -3 C12 1 4 2 -4 2 C-12 2 -17 1 -18 -2 Z', body, C.ink, 1.1),
    o.flank ? path('M-13 -8 C-6 -11 3 -11 8 -8 C3 -4.5 -6 -4.5 -13 -8 Z', o.flank, C.ink, 0.7) : '',
    o.checks ? all(...range(5).flatMap((i) => range(2).map((j) => rect(-12 + i * 4.5, -10 + j * 3, 1.6, 1.4, WHITE, 0.3, null)))) : '',
    o.breast ? path('M6 -11.5 C12 -11.5 15 -7 14 -3 C12 0 8 1 5 1 C7.5 -3 7.5 -8 6 -11.5 Z', o.breast, C.ink, 0.8) : '',
    path('M6.5 -10 C6.5 -15 9 -19 11 -21 L15.5 -19 C13.5 -16 13.5 -12.5 13.5 -8.5 Z', o.head ?? body, C.ink, 1),
    o.neckBars ? line('M9 -15.5 l3 -0.6 M8.6 -13.6 l3.4 -0.6 M8.5 -11.6 l3.6 -0.6', WHITE, 0.9) : '',
    o.peaked ? path('M9 -19 C8.6 -26 12 -29 15 -27 C18 -25 18.4 -21 17.4 -18 L11 -16 Z', o.head ?? body, C.ink, 1) : circle(13, -21, 5, o.head ?? body, C.ink, 1),
    o.cap ? path('M8.2 -22 A5 5 0 0 1 17.8 -22 Z', o.cap, null) : '',
    o.nape ? path('M8.4 -20 C8.6 -17.6 10 -16.6 11.6 -17 L10.6 -21 Z', o.nape, null) : '',
    o.ring ? line('M7.5 -12.6 Q10.5 -11.2 13.6 -12.8', WHITE, 1.8) : '',
    o.cheekSpot ? circle(15.6, -19.6, 1.5, WHITE, null) : '',
    bill,
    circle(14.4, -22.4, o.eye ? 1.2 : 0.9, o.eye ?? C.ink, o.eye ? C.ink : null, 0.5),
  );
};
const GRASAND: Duck = { body: '#b9bcc0', flank: '#c9ccd0', breast: '#7a3f2c', head: '#2f7d4f', ring: true, bill: YEL, tail: BLACK };
const GRASAND_F: Duck = { body: '#b78f60', flank: '#a07850', head: '#b78f60', bill: '#d28a3a', tail: '#9a7650' };
const KNIPA: Duck = { body: WHITE, flank: BLACK, head: '#1f3b33', peaked: true, cheekSpot: true, eye: YEL, bill: BLACK, tail: BLACK };
const EJDER: Duck = { body: BLACK, flank: WHITE, breast: '#f4e3cf', head: WHITE, cap: BLACK, nape: '#a8d8a0', wedge: true, bill: '#b9c7a3', tail: BLACK };
const EJDER_F: Duck = { body: '#9a6b42', flank: '#86592f', head: '#9a6b42', wedge: true, bill: '#7f8a72', tail: '#86592f' };
const SKRAKE: Duck = { body: '#f3e6dc', flank: BLACK, head: '#1d4a3a', longBill: true, bill: RED, tail: GREY };
const LOM: Duck = { body: BLACK, checks: true, head: '#7d858d', breast: WHITE, neckBars: true, dagger: true, low: true, eye: RED, tail: BLACK };

type Swan = { neck?: 's' | 'up' | 'down'; bill?: string; knob?: boolean; wings?: boolean; col?: string; tip?: string; open?: boolean };
/** A swimming swan facing right, water line y = 0. */
const swan = (o: Swan = {}): Svg => {
  const col = o.col ?? WHITE;
  const neck = o.neck === 'up' ? 'M8 -10 C11 -18 12 -28 13 -38' : o.neck === 'down' ? 'M8 -10 C16 -16 20 -10 22 -4' : 'M8 -10 C17 -17 6 -29 11 -36 C12.6 -38.6 15.4 -38.6 17 -37';
  const hx = o.neck === 'up' ? 14 : o.neck === 'down' ? 23 : 17.5, hy = o.neck === 'up' ? -39 : o.neck === 'down' ? -3 : -36.5;
  const bill = o.neck === 'up'
    ? (o.open ? path(`M${hx + 3} ${hy - 1.6} L${hx + 11} ${hy - 4} L${hx + 4} ${hy} L${hx + 11} ${hy + 3} L${hx + 3} ${hy + 1.6} Z`, o.bill ?? YEL, C.ink, 0.8) : path(`M${hx + 3} ${hy - 1.8} L${hx + 11} ${hy - 0.4} L${hx + 11} ${hy + 1} L${hx + 3} ${hy + 1.8} Z`, o.bill ?? YEL, C.ink, 0.8))
    : path(`M${hx + 2.4} ${hy - 1} L${hx + 9} ${hy + 3.6} L${hx + 8} ${hy + 5} L${hx + 2} ${hy + 2} Z`, o.bill ?? ORANGE, C.ink, 0.8);
  return all(
    path('M-20 -4 L-28 -10 L-22 -1 Z', col, C.ink, 1),
    path('M-24 -2 C-26 -12 -14 -15 -2 -14 C8 -13 15 -10 14 -3 C12 1 2 2 -10 2 C-18 2 -23 1 -24 -2 Z', col, C.ink, 1.1),
    o.wings ? path('M-22 -10 C-22 -26 -6 -30 6 -15 C-2 -14 -12 -12 -22 -10 Z', col, C.ink, 1) : path('M-18 -8 C-10 -12 0 -12 6 -9 C0 -6 -10 -5.5 -18 -8 Z', col, C.ink, 0.8),
    o.wings ? line('M-18 -14 C-12 -20 -4 -21 2 -15 M-16 -11 C-10 -16 -4 -16 0 -13', LGREY, 1) : '',
    line(neck, C.ink, 7), line(neck, col, 5),
    circle(hx, hy, 4.2, col, C.ink, 1), bill,
    o.tip ? path(o.neck === 'up' ? `M${hx + 7.5} ${hy - 0.9} L${hx + 11} ${hy - 0.4} L${hx + 11} ${hy + 1} L${hx + 7.5} ${hy + 1.3} Z` : '', o.tip, null) : '',
    o.knob ? circle(hx + 3.2, hy - 0.6, 2.5, BLACK, C.ink, 0.6) : '',
    o.neck === 'up' || o.neck === undefined || o.neck === 's' ? path(`M${hx + 2.6} ${hy - 1.6} L${hx + 4.2} ${hy - 0.8} L${hx + 3} ${hy + 1.6} Z`, BLACK, null) : '',
    circle(hx + 1, hy - 1.2, 0.8, C.ink, null),
  );
};

type Gull = { back?: string; bill?: string; spot?: boolean; legs?: string; size?: number; cap?: string; tipSpots?: boolean; open?: boolean };
/** A standing gull facing right, feet at (0, 0). */
const gull = (o: Gull = {}): Svg => all(
  line('M-1 -8 L-2 0 M3 -8 L3 0', o.legs ?? '#e2c24a', 1.4), line('M-5 0 L1 0 M1 0 L6 0', o.legs ?? '#e2c24a', 1.4),
  path('M-14 -16 C-8 -21 6 -21 10 -16 C13 -12 10 -7 2 -7 C-6 -7 -12 -10 -14 -16 Z', WHITE, C.ink, 1.1),
  path('M-20 -15 C-14 -20 0 -21 6 -16 C2 -12 -8 -11 -15 -12 Z', o.back ?? '#aab3bc', C.ink, 1),
  path('M-24 -13 L-15 -15.4 L-14 -12.2 Z', BLACK, C.ink, 0.8), o.tipSpots === false ? '' : circle(-19, -13.6, 0.8, WHITE, null),
  circle(9, -21, 5, WHITE, C.ink, 1.1), o.cap ? path('M4 -22 A5 5 0 0 1 14 -22 Z', o.cap, null) : '', circle(11, -22, 0.9, C.ink, null),
  o.open ? path('M13.6 -22 L20 -24 L15 -20.4 L20 -18 L13.6 -19.6 Z', o.bill ?? YEL, C.ink, 0.7) : path('M13.6 -22.4 L20.5 -21.2 C21 -20.4 20.6 -19.6 19.6 -19.6 L13.6 -19.4 Z', o.bill ?? YEL, C.ink, 0.7),
  o.spot ? circle(18.6, -19.8, 0.9, RED, null) : '',
);

type Soar = { wing?: string; under?: string; tail?: string; head?: string; tailShape?: 'fan' | 'fork' | 'wedge' | 'long'; tips?: string; pointed?: boolean; span?: number; tailCol2?: string; beak?: string };
/** A bird of prey seen from below with spread wings; centre (0, 0), head up. */
const soar = (o: Soar = {}): Svg => {
  const sp = o.span ?? 36, w = o.wing ?? BROWN;
  const wingR = o.pointed
    ? `M2 -4 C10 -7 22 -6 ${sp} 2 C26 2 14 4 3 4 Z`
    : `M2 -5 C10 -8 22 -9 ${sp - 2} -7 L${sp} -4 L${sp - 3} -2.5 L${sp - 1} -0.5 L${sp - 4} 0.6 L${sp - 3} 2.4 C24 3 12 5 3 5 Z`;
  const tail = o.tailShape === 'fork' ? 'M-3 6 L-7 22 L0 16 L7 22 L3 6 Z' : o.tailShape === 'wedge' ? 'M-3.5 6 L-6 15 L0 20 L6 15 L3.5 6 Z' : o.tailShape === 'long' ? 'M-3 6 L-4.5 22 L4.5 22 L3 6 Z' : 'M-3 6 L-8 16 C-4 18 4 18 8 16 L3 6 Z';
  return all(
    path(tail, o.tail ?? w, C.ink, 1),
    o.tailCol2 ? path('M-6 14 L-8 16 C-4 18 4 18 8 16 L6 14 Z', o.tailCol2, null) : '',
    path(wingR, w, C.ink, 1), g('scale(-1 1)', path(wingR, w, C.ink, 1)),
    o.tips ? all(path(`M${sp - 8} -6.5 L${sp} -4 L${sp - 3} -2.5 L${sp - 1} -0.5 L${sp - 4} 0.6 L${sp - 3} 2.4 L${sp - 9} 2.6 Z`, o.tips, null), g('scale(-1 1)', path(`M${sp - 8} -6.5 L${sp} -4 L${sp - 3} -2.5 L${sp - 1} -0.5 L${sp - 4} 0.6 L${sp - 3} 2.4 L${sp - 9} 2.6 Z`, o.tips, null))) : '',
    o.under ? all(path(`M4 -2 C12 -4 20 -4 ${sp - 12} -2 C20 0 12 1 4 1 Z`, o.under, null), g('scale(-1 1)', path(`M4 -2 C12 -4 20 -4 ${sp - 12} -2 C20 0 12 1 4 1 Z`, o.under, null))) : '',
    ellipse(0, 0, 4.4, 9, w, C.ink, 1),
    circle(0, -9.5, 3.6, o.head ?? w, C.ink, 1),
    path('M-1.2 -12.5 L0 -15.4 L1.2 -12.5 Z', o.beak ?? YEL, C.ink, 0.6),
  );
};

type Perch = { body?: string; breast?: string; head?: string; nape?: string; wing?: string; tail?: string; beak?: string; eye?: string; bars?: string; mustache?: string; brow?: string; legs?: string; tailBand?: string; feathered?: boolean; big?: boolean; streaks?: string };
/** An upright bird of prey facing right, feet at (0, 0) on a perch. */
const perch = (o: Perch = {}): Svg => {
  const body = o.body ?? BROWN;
  return all(
    path('M-5 -8 L-10 8 L-2 9 L1 -6 Z', o.tail ?? body, C.ink, 1),
    o.tailBand ? path('M-8.8 3.6 L-10 8 L-2 9 L-1.3 4.8 Z', o.tailBand, null) : '',
    path('M-2 -32 C6 -33 10 -25 9 -16 C8 -8 5 -3 0 -2 L-4 -2 C-8 -8 -9 -20 -6 -27 Z', body, C.ink, 1.1),
    o.breast ? path('M3 -30 C8 -28 9.5 -22 9 -16 C8 -9 5 -4 1 -3 C2 -10 1.5 -22 3 -30 Z', o.breast, null) : '',
    o.bars ? line('M3 -24 l5 0 M2.5 -20 l6 0 M2.5 -16 l6.2 0 M2.4 -12 l5.6 0 M2 -8 l4.6 0', o.bars, 1) : '',
    o.streaks ? line('M4 -25 l0 3 M7 -23 l0 3 M3.5 -18 l0 3 M6.5 -16 l0 3 M4 -11 l0 3', o.streaks, 1.1) : '',
    path('M-6 -27 C1 -27 6 -18 3 -4 C-3 -7 -7 -16 -6 -27 Z', o.wing ?? body, C.ink, 1),
    line('M-3 -20 C-1 -16 0 -12 0 -8 M-5 -16 C-3.6 -12 -3 -9 -2.6 -6', 'rgba(0,0,0,0.25)', 0.9),
    path('M-2 -32 C6 -33 10 -25 9 -16 C8 -8 5 -3 0 -2 L-4 -2 C-8 -8 -9 -20 -6 -27 Z', 'none', C.ink, 1.1),
    o.feathered ? path('M-2 -3 L-3 2 L1 2 L2 -3 Z M2 -3 L2 2 L5.5 2 L5 -3 Z', body, C.ink, 0.8) : line('M-1 -3 L-1.4 0 M3.4 -3 L3.8 0', o.legs ?? YEL, 2),
    line('M-4 1 L-1 0 L1.5 1.2 M1.2 1 L4 0 L6.5 1.2', C.ink, 1.2),
    circle(2.5, -35, o.big ? 7 : 6, o.head ?? body, C.ink, 1.1),
    o.nape ? path('M-3.4 -36 C-3.6 -32 -2 -30 0.6 -29.6 L-1 -36 Z', o.nape, null) : '',
    o.brow ? line('M1 -38.4 L8 -37.6', o.brow, 1.3) : '',
    o.mustache ? path('M4.4 -35 C5 -32 4.6 -30 3.6 -28.6 L6 -29.4 C6.6 -31.4 6.6 -33.6 6 -35 Z', o.mustache, null) : '',
    circle(5.2, -36.6, 1.4, o.eye ?? '#e8b23a', C.ink, 0.6), circle(5.4, -36.6, 0.6, C.ink, null),
    path(o.big ? 'M7.6 -38.6 C13 -39 15.4 -35 13 -31 L11.6 -32.6 C11.6 -34.2 10 -34.8 8.2 -34.2 Z' : 'M7.8 -37.6 C11.6 -37.8 13 -35 11.4 -32.2 L10.2 -33.6 C10.2 -34.8 9 -35 8 -34.6 Z', o.beak ?? C.dark, C.ink, 0.8),
  );
};
const HAVSORN: Perch = { body: '#7a5634', head: '#d8c5a2', wing: '#6b4a2b', tail: WHITE, beak: YEL, eye: '#f0d060', big: true };
const KUNGSORN: Perch = { body: '#4e3520', head: '#4e3520', nape: '#d9a441', wing: '#3f2a18', tail: '#4e3520', beak: '#3a3a3a', feathered: true };
const PILGRIM: Perch = { body: '#5f6f86', breast: '#f2ece0', bars: '#4a4a52', head: '#2f3442', mustache: '#2f3442', wing: '#55657c', tail: '#55657c', beak: '#4a4f5a', eye: '#3b2f2f' };
const HOK: Perch = { body: '#6c7480', breast: '#f2efe8', bars: '#6c7480', head: '#5c6470', brow: WHITE, wing: '#5c6470', tail: '#6c7480', beak: '#3e434c', eye: ORANGE };
const VRAK: Perch = { body: '#7a5332', breast: '#e9dcc3', streaks: '#7a5332', head: '#86603c', wing: '#6a462a', tail: '#9c7650', beak: '#3e3a36' };

type Owl = { body?: string; disc?: string; eye?: string; tufts?: boolean; streaks?: string; s?: number };
/** An owl seen from the front, feet at (0, 0). */
const owl = (o: Owl = {}): Svg => {
  const b = o.body ?? '#9a7552';
  return all(
    ellipse(0, -16, 12, 16, b, C.ink, 1.2),
    path('M-12 -16 C-12 -4 -6 0 -3 0 C-6 -6 -8 -12 -12 -16 Z M12 -16 C12 -4 6 0 3 0 C6 -6 8 -12 12 -16 Z', 'rgba(0,0,0,0.18)', null),
    o.streaks ? line('M-4 -14 l0 3 M0 -10 l0 3 M4 -14 l0 3 M-6 -8 l0 3 M6 -8 l0 3 M-2 -5 l0 3 M2 -16 l0 3', o.streaks, 1.1) : '',
    o.tufts ? path('M-9 -36 L-12 -46 L-4 -38 Z M9 -36 L12 -46 L4 -38 Z', b, C.ink, 1) : '',
    circle(0, -32, 11, b, C.ink, 1.2),
    ellipse(-4.6, -32, 5, 5.4, o.disc ?? '#d8c0a0', null), ellipse(4.6, -32, 5, 5.4, o.disc ?? '#d8c0a0', null),
    circle(-4.6, -32.6, 3, o.eye ?? BLACK, C.ink, 0.7), circle(4.6, -32.6, 3, o.eye ?? BLACK, C.ink, 0.7),
    o.eye ? all(circle(-4.6, -32.6, 1.3, BLACK, null), circle(4.6, -32.6, 1.3, BLACK, null)) : '',
    circle(-4, -33.4, 0.7, WHITE, null), circle(5.2, -33.4, 0.7, WHITE, null),
    path('M-1.4 -29 L1.4 -29 L0 -25.4 Z', '#e7c35a', C.ink, 0.6),
    line('M-4 0 L-4 -2 M-2 0 L-2 -2 M2 0 L2 -2 M4 0 L4 -2', C.ink, 1.1),
  );
};

type Wader = { body?: string; neck?: string; head?: string; crown?: string; bill?: string; legs?: string; wing?: string; bustle?: string; neckStripe?: string; bend?: number };
/** A long-legged bird facing right, feet at (0, 0). */
const wader = (o: Wader = {}): Svg => {
  const body = o.body ?? '#a8b0b8';
  return all(
    line('M-2 -30 L-3 0 M4 -30 L5 0', o.legs ?? '#555', 1.8), line('M-7 0 L1 0 M1 0 L9 0', o.legs ?? '#555', 1.4),
    o.bustle ? path('M-14 -34 C-22 -32 -24 -24 -18 -22 C-16 -26 -12 -28 -8 -28 Z', o.bustle, C.ink, 1) : '',
    path('M-16 -36 C-14 -44 2 -46 10 -40 C14 -36 10 -28 0 -28 C-8 -28 -14 -30 -16 -36 Z', body, C.ink, 1.1),
    o.wing ? path('M-16 -36 C-10 -38 0 -36 6 -32 C0 -29 -8 -29 -14 -31 Z', o.wing, C.ink, 0.8) : '',
    line('M8 -40 C12 -48 12 -54 14 -60', C.ink, 6), line('M8 -40 C12 -48 12 -54 14 -60', o.neck ?? body, 4),
    o.neckStripe ? line('M11.5 -46 C12.4 -52 13 -56 14.6 -60', o.neckStripe, 1.6) : '',
    circle(15, -62, 3.6, o.head ?? body, C.ink, 1),
    o.crown ? path('M12 -64.4 A3.6 3.6 0 0 1 17.4 -64.4 Z', o.crown, null) : '',
    path('M18 -63 L27 -61 L18 -60.6 Z', o.bill ?? '#5a5a5a', C.ink, 0.7),
    circle(16, -62.6, 0.7, C.ink, null),
  );
};
const TRANA: Wader = { body: '#a9b1b9', neck: BLACK, neckStripe: WHITE, head: BLACK, crown: RED, bill: '#6b6f74', legs: '#3d3f45', bustle: '#5d646c' };
const STORK: Wader = { body: WHITE, wing: BLACK, neck: WHITE, head: WHITE, bill: RED, legs: RED };

/** A bird flying sideways, facing right; wings up or down. */
const flySide = (o: { body?: string; wing?: string; head?: string; cap?: string; bill?: string; fork?: boolean; streamers?: boolean; throat?: string; belly?: string; up?: boolean } = {}) => all(
  o.fork || o.streamers ? path(o.streamers ? 'M-8 -1 L-24 -6 L-12 0 L-24 4 L-8 1 Z' : 'M-8 -1 L-18 -5 L-12 0 L-18 4 L-8 1 Z', o.body ?? WHITE, C.ink, 0.9) : path('M-8 -1.5 L-16 -2 L-16 2 L-8 1.5 Z', o.body ?? WHITE, C.ink, 0.9),
  ellipse(0, 0, 9, 3.6, o.body ?? WHITE, C.ink, 1),
  o.belly ? path('M-6 1.6 C-2 3.6 4 3.6 8 1 C3 0.6 -2 0.8 -6 1.6 Z', o.belly, null) : '',
  path(o.up === false ? 'M-3 0 C0 6 4 14 2 18 C6 12 6 6 4 0 Z' : 'M-3 -1 C0 -8 6 -16 4 -20 C9 -14 8 -6 4 -1 Z', o.wing ?? o.body ?? WHITE, C.ink, 1),
  circle(9, -1.4, 3.2, o.head ?? o.body ?? WHITE, C.ink, 1),
  o.cap ? path('M5.8 -1.8 A3.2 3.2 0 0 1 12.2 -1.8 Z', o.cap, null) : '',
  o.throat ? path('M10.5 0 C11.6 1 11 2.6 9 2.6 C9 1.6 9.6 0.6 10.5 0 Z', o.throat, null) : '',
  path('M12 -2.4 L17 -1 L12 0 Z', o.bill ?? C.dark, C.ink, 0.6), circle(10.2, -2.2, 0.6, C.ink, null),
);
/** A tiny bird silhouette in flight. */
const flyer = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M-8 1 Q-4 -5 0 0 Q4 -5 8 1', col, 1.5));
/** A V of flying birds. */
const vee = (x: number, y: number, n: number, s = 1, col: string = C.ink) => all(...range(n).map((i) => { const k = Math.ceil(i / 2) * (i % 2 ? 1 : -1); return flyer(x - Math.abs(k) * 7 * s, y + k * 5 * s, s * 0.6, col); }));

// ── Nests and eggs ───────────────────────────────────────────────────
const egg = (x: number, y: number, s = 1, col: string = '#bfe0ea', speck?: string) => at(x, y, s, path('M0 -5 C3 -5 4 -1 4 1 C4 4 2 5 0 5 C-2 5 -4 4 -4 1 C-4 -1 -3 -5 0 -5 Z', col, C.ink, 0.7), speck ? all(circle(-1.4, -1, 0.5, speck, null), circle(1.2, 1.4, 0.5, speck, null), circle(1.6, -2, 0.4, speck, null)) : '');
/** An open cup nest seen from the side; (x, y) is the rim centre. */
const nestCup = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, ellipse(0, 0, 16, 4.6, '#6b4a2b', C.ink, 1), inner, path('M-16 0 C-15 9 15 9 16 0 C10 3 -10 3 -16 0 Z', '#9a6b3e', C.ink, 1.1), line('M-14 2 C-6 6 6 6 14 2 M-12 4.6 C-4 8 4 8 12 4.6 M-9 1 l4 4 M2 2 l5 4 M10 1 l-3 5', '#6b4a2b', 0.9));
const chick = (x: number, y: number, s = 1, gape = true, col: string = '#c7bba8') => at(x, y, s, ellipse(0, 0, 5, 4.6, col, C.ink, 0.9), line('M-3 -3 l-1 -2.6 M0 -4 l0 -2.6 M3 -3 l1 -2.6', col, 0.9), circle(2, -1.4, 0.7, C.ink, null),
  gape ? path('M3.4 -3.6 L10 -7 L5 -1.6 L10 1.6 L3.4 0.4 Z', YEL, C.ink, 0.7) : path('M4 -2 L8 -1 L4 0 Z', YEL, C.ink, 0.6), gape ? path('M4.6 -2.4 L8.4 -4.6 L5.6 -1.4 L8.4 0.4 Z', RED, null) : '');
const twig = (x: number, y: number, a: number, s = 1) => rot(x, y, a, s, line('M-10 0 L10 0 M-3 0 L-7 -4 M3 0 L7 -4 M6 0 l3 3', BARK, 1.6));
const nestBox = (x: number, y: number, s = 1, col = '#b98a58') => at(x, y, s, rect(-10, -14, 20, 26, col, 1, C.ink, 1.1), path('M-13 -14 L13 -14 L10 -19 L-10 -19 Z', '#7a5634', C.ink, 1), circle(0, -5, 3.4, '#3a2a1e', C.ink, 0.8));
/** A simple map of northern Europe and Africa; Sweden marked. */
const mapEA = (hl = false) => all(rect(4, 4, 112, 108, '#9cc9ea', 3, null),
  path('M38 6 C44 6 48 12 46 20 C44 28 40 34 36 38 C33 34 32 26 33 18 C34 12 35 8 38 6 Z', '#bcd99a', C.ink, 1),
  path('M47 8 C54 6 60 10 60 16 C58 22 54 26 52 32 C49 32 48 26 48 20 Z', '#d5e6b8', C.ink, 1),
  path('M20 44 C30 40 50 38 66 42 C76 44 84 46 90 50 C84 54 74 54 66 52 C56 52 44 54 34 54 C26 54 20 50 20 44 Z', '#d5e6b8', C.ink, 1),
  path('M22 60 C40 56 70 56 90 62 C98 70 96 84 86 94 C78 102 72 110 66 112 L54 112 C52 104 46 96 40 88 C30 82 22 74 22 60 Z', hl ? '#f3d59a' : '#e3d3a0', C.ink, 1),
  line('M24 66 C40 64 70 64 92 68', 'rgba(160,120,60,0.6)', 0.9, '2 2'));

// ── Motifs ───────────────────────────────────────────────────────────
const snowBranch = (x1: number, y1: number, x2: number, y2: number) => all(branch(x1, y1, x2, y2, 4), path(`M${x1} ${y1 - 2} L${x2} ${y2 - 2} L${x2} ${y2 - 5} C${(x1 + x2) / 2} ${(y1 + y2) / 2 - 7} ${x1} ${y1 - 5} ${x1} ${y1 - 3} Z`, SNOW, C.ink, 0.7));
const fatBall = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -16 L0 -7', C.ink, 1), circle(0, 0, 7, '#d9c08a', C.ink, 1), line('M-6 -3 L6 -3 M-7 1 L7 1 M-5 4.5 L5 4.5 M-3 -6.5 L-3 6.5 M3 -6.5 L3 6.5', '#3a8a4a', 0.9), circle(-2, 2, 0.8, BROWN, null), circle(2.6, -1.4, 0.8, BROWN, null), circle(0, 5, 0.7, BROWN, null));
const birdTable = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -2, 4, 30, '#8a6440', 1, C.ink, 1), rect(-18, -6, 36, 5, '#b98a58', 1, C.ink, 1.1), path('M-22 -24 L0 -34 L22 -24 L18 -24 L0 -31 L-18 -24 Z', '#7a5634', C.ink, 1.1), line('M-14 -24 L-14 -6 M14 -24 L14 -6', '#7a5634', 2), ...range(6).map((i) => ellipse(-12 + i * 5, -7.4, 1.3, 0.8, '#3a3026', null)));
const worm = (x: number, y: number) => line(`M${x} ${y} q3 -3 6 0 q3 3 6 0`, PINK, 2);
const cat = (x: number, y: number, s = 1) => at(x, y, s, path('M12 -4 C20 -6 22 -16 18 -20', 'none', C.ink, 3.4), path('M12 -4 C20 -6 22 -16 18 -20', 'none', '#7a7a80', 2), ellipse(0, -6, 13, 7, '#7a7a80', C.ink, 1.2), circle(-12, -14, 6.5, '#7a7a80', C.ink, 1.2), path('M-17 -18 L-16 -25 L-12 -20 Z M-10 -20 L-6 -25 L-6 -17 Z', '#7a7a80', C.ink, 1), circle(-14, -15, 0.9, YEL, null), circle(-10, -15, 0.9, YEL, null), line('M-8 -1 L-8 0 M6 -1 L6 0', C.ink, 1.2));
const downPuff = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 2 C-14 -1 -11 -7 -7 -5 C-7 -10 -1 -12 0 -8 C2 -12 8 -10 7 -5 C11 -7 14 -1 10 2 C12 6 6 8 3 6 C1 9 -4 9 -5 6 C-8 8 -13 5 -10 2 Z', '#f6f3ee', C.ink, 0.8), line('M0 9 L0 3', '#b9b3a8', 1));
const metalRing = (x: number, y: number, s = 1) => at(x, y, s, rect(-2.4, -2.4, 4.8, 4.8, '#d9dde1', 1.4, C.ink, 0.8), line('M-1.2 0 l2.4 0', GREY, 0.7));
const lighthouse = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-3 -30 L3 -30 L5 0 Z', WHITE, C.ink, 1), rect(-3.6, -22, 7.2, 4, RED, 0, null), rect(-4.2, -10, 8.4, 4, RED, 0, null), path('M-5 0 L-3 -30 L3 -30 L5 0 Z', 'none', C.ink, 1), rect(-4, -36, 8, 6, YEL, 1, C.ink, 0.9), path('M-5 -36 L0 -41 L5 -36 Z', RED, C.ink, 0.9));
const fishShape = (x: number, y: number, s = 1, col = '#a9c3d6') => at(x, y, s, path('M-6 0 C-3 -3 3 -3 6 0 C3 3 -3 3 -6 0 Z M-6 0 L-10 -3 L-10 3 Z', col, C.ink, 0.8), circle(3.4, -0.5, 0.6, C.ink, null));
const mouse = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 5, 3, '#8b7d70', C.ink, 0.8), circle(-4.4, -1, 2.2, '#8b7d70', C.ink, 0.8), circle(-5, -3, 1.2, '#b7a99c', C.ink, 0.6), line('M5 0 q4 1 6 -2', C.ink, 0.8));

const pigeon = (x: number, y: number, s = 1, flip = false) => (flip ? atL : at)(x, y, s, song({ body: '#9aa2ad', belly: '#b4a2b8', breast: '#8f9db0', head: '#7d8796', wing: '#8a94a1', bar: '#4a4f58', bar2: '#4a4f58', tail: '#6f7884', beak: '#3e3a3a', beakLen: 3, legs: '#d46a6a', tailLen: 9 }));
const rooster = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -20 C-20 -36 -26 -20 -20 -10 C-16 -14 -12 -16 -8 -14 Z', '#2f6a4a', C.ink, 1), path('M-12 -18 C-22 -30 -24 -18 -18 -12', 'none', '#1f4a8a', 2.4),
  line('M-2 -6 L-3 0 M3 -6 L4 0 M-6 0 L0 0 M1 0 L7 0', YEL, 1.6), ellipse(0, -13, 11, 8, '#c4562b', C.ink, 1.1), path('M-6 -15 C0 -18 6 -15 6 -10 C0 -8 -4 -9 -7 -11 Z', '#8a3a1a', C.ink, 0.8),
  path('M5 -18 C4 -24 6 -30 10 -31 L14 -26 C11 -22 11 -18 10 -14 Z', '#e9a33a', C.ink, 1), circle(11, -29, 4.4, '#e9a33a', C.ink, 1), path('M8 -33 L9 -36 L10.6 -33.4 L12 -36.4 L13 -33 L14.4 -35 L14.6 -31.6 Z', RED, C.ink, 0.7),
  path('M14.6 -29 L20 -31 L16 -27.6 L20 -25 L14.6 -26.6 Z', YEL, C.ink, 0.6), path('M13.4 -26 C14.4 -23 13.4 -21.6 12 -22 L12.4 -25.6 Z', RED, null), circle(12, -30, 0.8, C.ink, null));

export const BIRD_MOTIFS: Record<string, Svg> = {
  // ── 2711 Småfåglar i Sverige ──
  'fagel.fågel': all(bg(), field(98), branch(4, 72, 90, 68, 5), leaf(80, 64, -30), leaf(88, 70, 20), at(52, 70, 2.2, song(GENERIC)), flyer(94, 22, 1.1), flyer(104, 34, 0.9), flyer(22, 26, 0.8), tree(100, 104, 0.9)),
  'fagel.näbb': all(bg(), branch(4, 98, 116, 94, 5), at(52, 96, 2.6, song({ ...GENERIC, beakLen: 6, beakW: 2 })), oval(97, 47, 11, 8)),
  'fagel.fjäder': all(bg(), rot(60, 60, 35, 1, line('M0 -44 L0 46', C.ink, 1.6), path('M0 -44 C14 -30 16 0 8 36 L0 40 Z', '#6f8fb5', C.ink, 1.2), path('M0 -40 C-12 -26 -14 4 -6 34 L0 38 Z', '#88a7cc', C.ink, 1.2), line('M0 -24 L10 -30 M0 -10 L12 -16 M0 6 L11 0 M0 20 L9 16 M0 -20 L-9 -25 M0 -4 L-11 -9 M0 12 L-9 8', '#4c6a91', 0.9)), line('M20 100 q6 -3 12 0', C.grey, 1.2), line('M84 96 q6 -3 12 0', C.grey, 1.2)),
  'fagel.småfågel': all(bg(), branch(4, 64, 116, 60, 4), at(28, 63, 1.1, song(TALGOXE)), at(56, 62, 1.0, song(BLAMES)), at(86, 61, 1.1, song(BOFINK)), line('M14 74 L14 78 L102 78 L102 74', HL, 2), greyPane(56, 72, 0.44, bg(), field(96), at(56, 96, 2.6, song(KRAKA)))),
  'fagel.talgoxe': all(bg(), snowBranch(4, 86, 116, 80), at(60, 84, 2.6, song(TALGOXE))),
  'fagel.blåmes': all(bg(), branch(4, 30, 116, 26, 4), leaf(20, 30, 160), leaf(100, 26, -20), g('translate(60 30) scale(2.8 -2.8)', song(BLAMES))),
  'fagel.domherre': all(bg('#dde9f2'), snowBranch(4, 88, 116, 82), at(58, 86, 2.6, song(DOMHERRE)), circle(100, 74, 2.6, RED, C.ink, 0.6), circle(104, 76, 2.6, RED, C.ink, 0.6)),
  'fagel.rödhake': all(bg(), field(94, GRASS), branch(8, 86, 112, 84, 5), at(60, 85, 2.6, song(RODHAKE))),
  'fagel.bofink': all(bg(), field(90, GRASS), at(60, 100, 2.6, song(BOFINK)), ...[[24, 104], [90, 102], [100, 106]].map(([x, y]) => ellipse(x!, y!, 1.4, 0.9, '#3a3026', null))),
  'fagel.gråsparv': all(bg(), rect(4, 96, 112, 16, '#e3d2b0', 0, null), rect(4, 90, 112, 8, '#a34a32', 0, C.ink, 1.1), line('M4 94 L116 94', '#7a3524', 1), at(62, 90, 2.6, song(GRASPARV))),
  'fagel.koltrast': all(bg(), field(84, GRASS), at(62, 100, 2.3, song(KOLTRAST)), worm(98, 104), tree(102, 84, 0.8)),
  'fagel.skata': all(bg(), field(88, GRASS), at(72, 100, 1.9, song(SKATA)), birch(16, 74, 0.8)),
  'fagel.kråka': all(bg(), rect(4, 96, 112, 16, '#b5372e', 0, null), path('M4 96 L60 80 L116 96 Z', '#5f646c', C.ink, 1.2), at(60, 82, 2.3, song(KRAKA))),
  'fagel.stare': all(bg(), line('M4 94 L116 90', C.ink, 1.2), post(10, 86), post(110, 82), at(62, 92, 2.6, song(STARE))),
  'fagel.hackspett': all(bg(), trunk(36, 30), at(30, 40, 1, ellipse(0, 0, 2.6, 3.4, '#3a2a1e', null)), at(28, 70, 1, ellipse(0, 0, 2.2, 3, '#3a2a1e', null)), woodpecker(60, 84, 2.6), pine(100, 108, 1.2)),
  'fagel.sädesärla': all(bg(), field(90, GRASS), at(66, 100, 2.0, song(ARLA)), line('M12 70 q-4 6 0 12 M6 72 q-3 4 0 8', C.grey, 1.3)),
  'fagel.fågelbord': all(bg('#dde9f2'), field(100, SNOW), birdTable(60, 76, 1.9), at(40, 63, 0.9, song(TALGOXE)), atL(84, 63, 0.9, song(GRASPARV)), oval(60, 54, 44, 30)),
  'fagel.talgboll': all(bg('#dde9f2'), branch(4, 22, 116, 18, 5), fatBall(48, 56, 2.4), atL(90, 21, 1.4, song(TALGOXE)), oval(48, 56, 22, 22)),
  // ── 2712 Rovfåglar ──
  'fagel.rovfågel': all(bg(), field(96, GRASS), post(50, 76, 112, 12), at(50, 78, 1.6, perch(VRAK)), at(56, 78, 1.4, mouse(0, 0)), at(96, 24, 0.5, soar({ wing: '#5a3d26', tail: WHITE })), atL(20, 30, 0.6, flySide({ body: '#6f7781', wing: '#5f6670' }))),
  'fagel.havsörn': all(bg(), sea(82), rockAt(54, 112, 70, 26), at(54, 92, 1.8, perch(HAVSORN))),
  'fagel.kungsörn': all(bg(), path('M4 96 L28 52 L42 66 L62 34 L84 64 L98 54 L116 74 L116 112 L4 112 Z', '#8d8a86', C.ink, 1.1), path('M54 46 L62 34 L70 46 Z M22 62 L28 52 L33 60 Z', SNOW, C.ink, 0.7), rockAt(60, 112, 44, 16, '#77736e'), at(60, 98, 1.9, perch(KUNGSORN))),
  'fagel.pilgrimsfalk': all(bg(), path('M4 112 L4 92 C20 88 30 96 44 94 L56 112 Z', '#9b968e', C.ink, 1.1), at(36, 95, 1.8, perch(PILGRIM)), flyer(94, 30, 1), flyer(104, 40, 0.8)),
  'fagel.hök': all(bg('#dbead0'), pine(16, 112, 2.2, '#2f7040'), pine(104, 112, 2.4, '#2f7040'), branch(30, 96, 100, 94, 5), at(60, 95, 1.8, perch(HOK))),
  'fagel.ormvråk': all(bg(), field(84, '#c9d98a'), rect(4, 96, 112, 16, '#8d939b', 0, null), line('M10 104 l10 0 M40 104 l10 0 M70 104 l10 0 M100 104 l10 0', WHITE, 1.4), post(56, 78, 98, 8), at(56, 80, 1.5, perch(VRAK))),
  'fagel.glada': all(bg(), field(92, '#c9d98a'), at(60, 46, 1.4, soar({ wing: '#a8562c', tail: '#c4562b', head: '#d9cdbd', tailShape: 'fork', tips: BLACK, under: '#e9e2d6', span: 34 })), oval(60, 72, 10, 12)),
  'fagel.uggla': all(bg(DUSK), moon(96, 20, 8), starDot(20, 18), starDot(40, 28), trunk(60, 46, '#6b4a2b'), ellipse(60, 64, 14, 22, '#2a1c12', null), at(60, 84, 1.25, owl({ streaks: '#5e3f22' }))),
  'fagel.berguv': all(bg('#e9c9a4'), path('M4 112 L4 82 C20 74 50 76 66 84 L74 112 Z', '#8d8578', C.ink, 1.1), at(36, 82, 1.45, owl({ tufts: true, eye: ORANGE, body: '#a0784c', disc: '#c9a57a', streaks: '#5a3a20' })), kid(98, 108, 1.1, C.denim)),
  'fagel.störtdyka': all(bg(), field(100, GRASS), rot(56, 50, 90, 1.7, flySide({ body: '#5f6f86', wing: '#55657c', head: '#2f3442', up: true })), speed(44, 40, 22, 3, 6), arrow(84, 24, 84, 72, HL, 3), atL(28, 98, 0.9, pigeon(0, 0, 1))),
  'fagel.vingbredd': all(bg(), field(100, GRASS), at(60, 40, 1.4, soar({ wing: '#7a5634', tail: WHITE, head: '#d8c5a2', span: 37 })), line('M8 62 L112 62', HL, 2.2), line('M8 58 L8 66 M112 58 L112 66', HL, 2.2), kid(60, 106, 1.3, C.denim)),
  'fagel.fridlyst': all(bg(), field(100, GRASS), circle(40, 54, 32, 'rgba(79,157,105,0.18)', '#3f8a4f', 3), nestCup(40, 72, 1.2, all(egg(-4, -1, 0.8, '#efe8dc'), egg(4, -1, 0.8, '#efe8dc'))), at(40, 68, 1.2, perch(HAVSORN)), greyPane(74, 66, 0.36, bg(), field(96), kid(50, 100, 2, C.green, 'M-3.2 -16 L10 -18 M3.2 -16 L10 -16', line('M6 -17 L20 -19', C.ink, 1.6)), at(92, 60, 1.4, flySide({ body: '#7a5634' }))), cross(92, 94, 12)),
  'fagel.miljögift': all(bg(), sea(70, '#7aa9b0'), at(22, 70, 1, rect(-10, -26, 20, 26, '#d9a03a', 2, C.ink, 1.1), line('M-10 -18 L10 -18 M-10 -8 L10 -8', '#9a6a20', 1.2), circle(0, -13, 4, BLACK, null)), path('M30 64 C34 70 32 78 40 84 C48 90 70 88 76 96 C60 100 36 96 28 88 Z', 'rgba(60,50,40,0.75)', null), fishShape(56, 92, 1.2, '#8fa59a'), at(92, 64, 1.1, perch(HAVSORN)), arrow(64, 88, 82, 70, HL, 2.2), egg(108, 98, 1.3, '#efe8dc'), line('M106 94 l2 3 l-2 2 l3 2', C.ink, 0.9)),
  // ── 2713 Sjöfåglar ──
  'fagel.and': all(bg(), sea(74), at(26, 84, 1, duck(GRASAND)), at(70, 92, 1, duck(GRASAND_F)), at(92, 104, 1, duck(KNIPA)), at(34, 106, 0.9, duck(EJDER_F))),
  'fagel.gräsand': all(bg(), sea(70), at(60, 92, 2.2, duck(GRASAND)), wave(14, 100, 16), wave(92, 104, 16)),
  'fagel.knipa': all(bg(), sea(70), at(60, 92, 2.2, duck(KNIPA)), pine(14, 70, 1, '#3f8a4f'), pine(26, 70, 1.2, '#3f8a4f'), wave(92, 104, 16)),
  'fagel.ejder': all(bg(), sea(70), rockAt(104, 78, 26, 12), at(50, 88, 2, duck(EJDER)), at(84, 104, 1.2, duck(EJDER_F))),
  'fagel.skrake': all(bg(), sea(70), at(46, 92, 2.2, duck(SKRAKE)), at(46, 92, 2.2, fishShape(27, -20, 0.6, '#c9d3da'))),
  'fagel.svan': all(bg(), sea(64), at(40, 98, 1.2, swan({ neck: 's', knob: false, bill: ORANGE })), at(92, 84, 0.9, swan({ neck: 's', knob: false, bill: ORANGE })), tree(16, 64, 0.8), tree(104, 64, 0.7)),
  'fagel.knölsvan': all(bg(), sea(60), at(52, 98, 2, swan({ neck: 's', knob: true, wings: true }))),
  'fagel.sångsvan': all(bg(), sea(64), at(48, 98, 1.9, swan({ neck: 'up', bill: YEL, tip: BLACK, open: true })), jag(92, 18, 1.1)),
  'fagel.grågås': all(bg(), field(76, GRASS), at(54, 100, 2.1, g('translate(0 -6)', duck({ body: '#a49c90', flank: '#8b8378', breast: '#b3aca0', head: '#968e82', bill: ORANGE, tail: WHITE })), line('M-3 -4 L-3 6 M3 -4 L3 6', '#e8a0a0', 1.6)), line('M90 104 l2 -6 M96 106 l1 -7 M14 102 l2 -7', GRASS2, 1.4)),
  'fagel.mås': all(bg(), sea(78), post(56, 76, 112, 10), at(56, 76, 1.7, gull({ back: '#b8c2cc', bill: '#d9d36a', legs: '#d9d36a' })), flyer(94, 24, 1.1, GREY), flyer(20, 30, 0.9, GREY)),
  'fagel.trut': all(bg(), rect(4, 78, 112, 34, ROCK, 0, null), sea(96), at(60, 92, 2.1, gull({ back: '#9fa9b3', bill: YEL, spot: true, legs: '#e8a7a0' })), fishShape(100, 88, 1.4)),
  'fagel.tärna.2': all(bg(), sea(78), rot(56, 50, 55, 2, flySide({ body: WHITE, wing: '#d9dee3', cap: BLACK, bill: RED, fork: true })), arrow(80, 30, 80, 70, HL, 2.4), fishShape(64, 92, 1.1), line('M54 80 q4 -4 8 0 q4 -4 8 0', WHITE, 1.4)),
  'fagel.skarv': all(bg(), sea(86), rockAt(60, 112, 66, 30), at(60, 86, 1.9, path('M-3 -4 C-24 -24 -30 -10 -32 -2 L-26 -4 L-28 2 L-22 -1 L-22 4 L-4 0 Z', BLACK, C.ink, 1), path('M3 -4 C24 -24 30 -10 32 -2 L26 -4 L28 2 L22 -1 L22 4 L4 0 Z', BLACK, C.ink, 1), ellipse(0, -6, 6, 9, BLACK, C.ink, 1), line('M0 -12 C0 -18 2 -22 4 -24', C.ink, 4.4), line('M0 -12 C0 -18 2 -22 4 -24', BLACK, 2.8), circle(4.6, -25.4, 2.6, BLACK, C.ink, 0.8), path('M6.6 -26.6 L13 -26 C13.6 -25 13 -24.2 12.2 -24.6 L6.6 -24.6 Z', '#6b6f74', C.ink, 0.6), circle(5.2, -26, 0.7, '#3fa36a', null), path('M4 -23.6 C6 -23 7 -22 7 -21 L4.6 -21.6 Z', YEL, null))),
  'fagel.lom': all(bg('#d5e3ea'), sea(72, '#6d9fc4'), pine(14, 72, 1, '#2f7040'), pine(28, 72, 1.3, '#2f7040'), pine(104, 72, 1.1, '#2f7040'), at(60, 96, 2.1, duck(LOM))),
  'fagel.simhud': all(bg(), sea(80), at(52, 46, 3, line('M0 -12 L0 0', '#e08a3a', 2.6), path('M0 0 L-10 10 L-4 9 L0 13 L4 9 L10 10 Z', '#f0a04a', C.ink, 1), line('M0 0 L-10 10 M0 0 L0 13 M0 0 L10 10', '#b86a20', 1)), oval(52, 76, 30, 14), greyPane(84, 78, 0.27, bg(), field(96), at(60, 96, 3, song(GENERIC)))),
  // ── 2714 Flyttfåglar ──
  'fagel.flyttfågel': all(mapEA(), line('M40 28 C60 40 66 60 62 82', HL, 2, '4 3'), arrow(60, 78, 62, 86, HL, 2.4), line('M70 82 C76 60 70 40 50 26', '#3f8a4f', 2, '4 3'), arrow(52, 28, 46, 24, '#3f8a4f', 2.4), at(44, 22, 1, flySide({ body: '#1f3b6b', wing: '#1f3b6b', throat: RED, belly: WHITE, streamers: true })), at(68, 96, 1, flySide({ body: '#1f3b6b', wing: '#1f3b6b', throat: RED, belly: WHITE, streamers: true }))),
  'fagel.stannfågel': all(bg('#dde9f2'), field(100, SNOW), snowBranch(4, 84, 90, 80), at(46, 83, 2.2, song(TALGOXE)), ring(56, 70, 22), grey(vee(96, 24, 5, 1.2)), arrow(104, 46, 116, 40, C.grey, 2)),
  'fagel.flytta.2': all(bg('#e9f0f6'), field(98, '#c9b56a'), tree(16, 104, 1.1, AUTUMN), tree(36, 106, 0.9, '#d7742e'), vee(70, 40, 7, 1.4), arrow(84, 64, 112, 82, HL, 3)),
  'fagel.sträcka-verb.2': all(bg(), sea(90), ...[[30, 30], [62, 22], [96, 34], [44, 58], [84, 62]].map(([x, y]) => vee(x!, y!, 5, 0.8)), arrow(14, 80, 108, 80, HL, 2.4)),
  'fagel.sträck': all(bg(), sea(86), rect(4, 96, 112, 16, SAND, 0, null), lighthouse(24, 96, 1.2), ...range(18).map((i) => flyer(46 + (i % 6) * 11, 18 + Math.floor(i / 6) * 12 + (i % 2) * 4, 0.6)), ...range(9).map((i) => flyer(52 + (i % 3) * 14, 58 + Math.floor(i / 3) * 6, 0.45)), kid(100, 110, 1.1, C.orange, binocArms, binoc(0, 0, 1))),
  'fagel.flyttväg': all(mapEA(), line('M40 26 C30 46 38 56 46 62 C54 70 58 80 60 96', HL, 2.6, '5 3'), circle(40, 26, 3, HL, C.ink, 0.8), arrow(58, 90, 60, 100, HL, 2.6), at(72, 64, 1, flySide({ body: '#1f3b6b', wing: '#1f3b6b', throat: RED, belly: WHITE, streamers: true }))),
  'fagel.övervintra': all(bg('#fbe6b5'), field(96, SAND), sun(96, 22, 9), at(30, 96, 1.1, rect(-1.5, -40, 3, 40, BARK, 1, C.ink, 0.8), path('M0 -40 C-10 -44 -18 -40 -22 -34 M0 -40 C10 -44 18 -40 22 -34 M0 -40 C-6 -48 -14 -50 -18 -48 M0 -40 C6 -48 14 -50 18 -48', 'none', GRASS2, 3)), at(44, 94, 1.6, song({ body: '#1f3b6b', belly: WHITE, face: RED, head: '#1f3b6b', wing: '#1f3b6b', tail: '#1f3b6b', tailLen: 14 })), greyPane(82, 64, 0.28, bg('#dde9f2'), field(96, SNOW), snowBranch(4, 70, 116, 66), pine(30, 100, 1.4), pine(90, 100, 1.6))),
  'fagel.vinterkvarter.2': all(mapEA(true), ...[[52, 84], [62, 80], [70, 88], [58, 94], [76, 78], [66, 98]].map(([x, y]) => flyer(x!, y!, 0.6)), oval(64, 88, 24, 18), circle(40, 26, 3, '#3f8a4f', C.ink, 0.8)),
  'fagel.trana': all(bg(), field(90, '#c9d98a'), at(58, 106, 1.45, wader(TRANA)), tree(104, 90, 0.7)),
  'fagel.stork': all(bg(), rect(4, 86, 112, 26, '#e3d2b0', 0, null), path('M4 86 L60 66 L116 86 Z', '#a34a32', C.ink, 1.1), rect(52, 66, 14, 12, '#b5372e', 0, C.ink, 1), at(59, 68, 1.2, ellipse(0, 0, 16, 4, '#8a6440', C.ink, 1), line('M-14 0 l4 -3 M-6 1 l4 -4 M4 0 l5 -3 M10 1 l4 -3', '#6b4a2b', 1)), at(54, 66, 0.85, wader(STORK))),
  'fagel.svala': all(bg(), line('M4 94 C40 100 80 100 116 92', C.ink, 1.2), at(66, 98, 2.0, song({ body: '#1f3b6b', back: '#1f3b6b', belly: '#f4ead8', head: '#1f3b6b', face: '#c8442e', wing: '#1f3b6b', tail: '#1f3b6b', tailLen: 18, beakLen: 2.6, beakW: 1.1 })), at(66, 98, 2.0, path('M-24 -6 L-28 -3 L-24 -9 Z', '#1f3b6b', C.ink, 0.6)), at(36, 30, 1.1, flySide({ body: '#1f3b6b', wing: '#1f3b6b', throat: RED, belly: WHITE, streamers: true }))),
  'fagel.gök': all(bg(), tree(104, 112, 1.6), branch(4, 88, 96, 86, 5), at(62, 87, 2.0, song(GOK)), rings(104, 42, 0.9)),
  'fagel.lärka': all(bg(), field(90, '#b9c96a'), line('M4 98 L116 98 M4 104 L116 104', '#9aab52', 1), at(56, 52, 2.2, flySide({ body: '#b8925f', wing: '#9b7646', head: '#b8925f', belly: '#ece0c6', up: true })), note(86, 34, 1.1), note(96, 48, 0.9), note(30, 30, 0.9), line('M56 70 l0 16', C.grey, 1, '2 3')),
  'fagel.flyttande': all(bg(), field(98, '#c9b56a'), vee(56, 40, 7, 1.4), arrow(80, 64, 108, 78, HL, 3), greyPane(6, 70, 0.3, bg(), field(96), branch(4, 70, 116, 66, 4), at(40, 68, 1.6, song(GENERIC)), at(80, 66, 1.6, song(GENERIC)))),
  'fagel.fågelstation': all(bg(), field(90, GRASS), lighthouse(100, 90, 1.2), at(34, 92, 1, rect(-18, -20, 36, 20, '#b5372e', 0, C.ink, 1.1), path('M-22 -20 L0 -32 L22 -20 Z', BLACK, C.ink, 1), rect(-4, -12, 8, 12, WHITE, 0, C.ink, 0.8), rect(8, -16, 6, 6, WHITE, 0, C.ink, 0.7)), line('M58 98 L58 70 M86 98 L86 70', C.ink, 1.4), rect(58, 72, 28, 20, 'rgba(60,60,70,0.12)', 0, null), line('M58 77 L86 77 M58 82 L86 82 M58 87 L86 87 M63 72 L63 92 M70 72 L70 92 M77 72 L77 92', '#555', 0.5), kid(48, 108, 1.1, C.green, 'M-3.2 -16 L4 -12 M3.2 -16 L6 -12', at(5, -12, 0.35, song(RODHAKE)))),
  'fagel.ringmärka': all(bg(), palm(40, 74, 2.2), at(54, 72, 2.0, g('rotate(-10)', song({ ...RODHAKE, noLegs: true }))), line('M58 74 L58 88', '#6b5b4f', 2), metalRing(58, 82, 1.6), at(86, 92, 1.6, path('M-14 4 L-2 4 C4 4 10 2 12 -1 C13 -3 11 -4 9 -3 C6 -1 2 -1 -2 -1 L-14 -1 Z', C.skin, C.ink, 1)), ring(58, 82, 9)),
  'fagel.vårtecken': all(bg(), rect(4, 90, 112, 22, '#8a6a4a', 0, null), path('M4 96 C20 92 34 98 46 94 L46 112 L4 112 Z', SNOW, null), ...[[58, 100], [66, 104], [74, 99], [84, 103], [94, 100], [104, 104]].map(([x, y]) => snowdrop(x!, y!)), sun(98, 22, 8), at(46, 46, 1.6, flySide({ body: '#b8925f', wing: '#9b7646', head: '#b8925f', up: true })), note(70, 30, 0.9)),
  // ── 2715 Näbbar och fjäderdräkt ──
  'fagel.dun': all(bg(), field(84, GRASS), at(60, 86, 2, ellipse(0, 0, 22, 6, '#8a6a4a', C.ink, 1), ...[[-18, -2], [-10, -5], [-2, -6], [6, -6], [14, -4], [20, -1], [-14, 2], [16, 2]].map(([x, y]) => downPuff(x!, y!, 0.55)), egg(-5, -3, 0.9, '#c9cfae'), egg(4, -3, 0.9, '#c9cfae')), downPuff(30, 40, 1.4), downPuff(88, 32, 1.1), oval(60, 82, 50, 18)),
  'fagel.fjäderdräkt': all(bg(), branch(4, 96, 116, 92, 5), at(56, 94, 3, song({ ...BOFINK, streaks: '#7a4a2a' })), line('M8 70 C14 44 48 30 76 34 C100 38 108 56 100 66 C92 80 60 90 30 84 C14 82 6 78 8 70 Z', HL, 2.2, '5 3')),
  'fagel.stjärt.2': all(bg(), field(90, GRASS), at(78, 100, 1.9, song(SKATA)), oval(30, 82, 22, 9)),
  'fagel.tofs.2': all(bg(), branch(4, 92, 116, 88, 5), at(56, 96, 2.6, song({ body: '#9c8a74', belly: '#e9e1d2', head: WHITE, crest: '#3a3a40', cap: '#3a3a40', bib: BLACK, eyeStripe: BLACK, wing: '#8a7a64', tail: '#8a7a64' })), ring(73, 30, 8)),
  'fagel.praktdräkt': all(bg(), sea(70), at(36, 94, 1.6, duck(GRASAND)), ring(42, 80, 24), refPane(70, 70, 0.36, bg(), sea(70), at(56, 92, 2.4, duck(GRASAND_F)))),
  'fagel.rugga': all(bg(), field(96, GRASS), at(60, 100, 2.4, song({ ...GENERIC, wing: '#a77f55' })), ...[[84, 74, 30], [96, 90, -20], [20, 84, 60], [74, 98, 80]].map(([x, y, a]) => rot(x!, y!, a!, 1, path('M0 -7 C3 -4 3 4 1 7 L0 7 C-2 4 -2 -4 0 -7 Z', '#a77f55', C.ink, 0.7), line('M0 -7 L0 8', C.ink, 0.6))), line('M30 54 l3 4 M38 50 l2 4', C.ink, 1)),
  'fagel.krokig': all(bg(), at(40, 104, 2.2, perch({ ...KUNGSORN, beak: YEL, big: true })), oval(64, 26, 9, 8), greyPane(76, 70, 0.34, bg(), at(30, 104, 3.6, song({ ...GENERIC, noLegs: true, beakLen: 6 })))),
  'fagel.spetsig': all(bg(), branch(4, 70, 116, 66, 5), at(44, 69, 2.2, song({ body: WHITE, head: BLACK, cap: BLACK, nape: RED, cheek: WHITE, wing: BLACK, bar: WHITE, tail: BLACK, beakLen: 10, beakW: 1.6 })), oval(94, 27, 13, 7), greyPane(76, 74, 0.32, bg(), at(30, 104, 3.4, song({ ...DOMHERRE, noLegs: true, beakLen: 3, beakW: 2.6 })))),
  'fagel.oansenlig': all(bg(), field(96, '#c2b591'), at(42, 100, 2.2, song({ body: '#a08a6c', belly: '#c8b89a', head: '#a08a6c', wing: '#8f7a5c', tail: '#8f7a5c' })), refPane(78, 64, 0.32, bg(), branch(4, 80, 116, 76, 4), at(56, 80, 2.6, song(BOFINK)))),
  'fagel.strimmig': all(bg(), field(96, '#c2b591'), at(42, 100, 2.2, song({ ...LARKA, crest: undefined, streaks: '#5a3a1a' })), at(42, 100, 2.2, line('M-6 -16 l-1 3 M-2 -17 l-1 3 M2 -16 l-1 3 M-8 -12 l-1 3 M-4 -13 l-1 3', '#5a3a1a', 0.9)), greyPane(78, 64, 0.32, bg(), field(96), at(56, 96, 2.6, song({ body: '#b8925f', belly: '#ece0c6', head: '#b8925f', wing: '#9b7646', tail: '#8a6a3e' })))),
  // ── 2716 Häckning och bon ──
  'fagel.häcka': all(bg(), branch(4, 90, 116, 86, 6), nestCup(60, 80, 1.6, all(egg(-6, -1, 0.9, '#bfe0ea'), egg(0, -2, 0.9, '#bfe0ea'), egg(6, -1, 0.9, '#bfe0ea'))), at(32, 87, 1.1, song(KOLTRAST)), atL(90, 87, 1.1, song({ ...KOLTRAST, body: '#5a4434', head: '#5a4434', wing: '#4d3a2c', tail: '#4d3a2c', beak: '#a07a40', eyeRing: undefined })), flower(14, 112), flower(104, 112, C.pink)),
  'fagel.häckning': all(bg(), ...[0, 1, 2].map((i) => pane(2 + i * 39, 30, 0.31, bg(), branch(4, 80, 116, 76, 6), nestCup(60, 72, 2.2, i === 0 ? all(egg(-6, -1, 0.9), egg(0, -2, 0.9), egg(6, -1, 0.9)) : i === 1 ? all(chick(-6, -3, 0.8, true), chick(6, -3, 0.8, true)) : ''), i === 2 ? at(70, 40, 2.4, flySide({ body: LBROWN, wing: '#8f6740' })) : '')), arrow(37, 50, 43, 50, HL, 2), arrow(76, 50, 82, 50, HL, 2), flower(16, 100), flower(30, 104, C.pink), flower(90, 102), sun(100, 86, 6)),
  'fagel.bo-noun': all(bg(), branch(4, 86, 70, 70, 6), branch(116, 82, 60, 70, 6), nestCup(60, 70, 2.4, all(egg(-6, -1.4, 0.9), egg(0, -2.2, 0.9), egg(6, -1.4, 0.9))), leaf(14, 82, 150), leaf(106, 78, 20), oval(60, 74, 44, 20)),
  'fagel.bygga-bo': all(bg(), branch(4, 92, 116, 86, 6), at(46, 86, 1.6, ellipse(0, 0, 16, 4, '#6b4a2b', C.ink, 1), path('M-16 0 C-14 5 -4 7 0 6 L0 2 C-6 2 -12 1 -16 0 Z', '#9a6b3e', C.ink, 1), line('M-12 2 l4 3 M-6 2 l3 4', '#6b4a2b', 0.9)), at(88, 56, 2, flySide({ body: '#b8925f', wing: '#9b7646', head: '#b8925f', up: true })), twig(108, 56, -5, 0.9), arrow(76, 70, 62, 80, HL, 2.4)),
  'fagel.kvist': all(bg(), at(60, 60, 2.4, line('M-20 14 L20 -14', BARK, 2.6), line('M-6 4 L-12 -6 M4 -3 L4 -14 M10 -7 L18 -6', BARK, 1.8), leaf(-12, -6, -120, '#9fcb6e'), circle(4, -15, 1.6, '#9fcb6e', C.ink, 0.6), circle(19, -6, 1.6, '#9fcb6e', C.ink, 0.6)), oval(60, 60, 50, 38)),
  'fagel.äggskal': all(bg(), field(84, GRASS), at(60, 92, 3, path('M-8 0 L-8 -3 C-8 -8 -4 -10 0 -10 L-2 -7 L1 -5 L-1 -2 L2 0 Z', '#9fd3e0', C.ink, 0.9), path('M3 1 L5 -2 L3 -4 L6 -6 C9 -4 10 -1 9 2 C7 4 4 4 3 1 Z', '#9fd3e0', C.ink, 0.9), path('M-12 3 l3 -1 l1 2 l-3 1 Z M10 4 l2 -1 l1 2 Z', '#9fd3e0', C.ink, 0.6)), oval(60, 88, 40, 20)),
  'fagel.ruva': all(bg(), branch(4, 96, 116, 92, 6), nestCup(60, 84, 2, all(egg(-6, -1, 0.9), egg(0, -2, 0.9), egg(6, -1, 0.9))), at(58, 84, 2.1, song({ ...GENERIC, noLegs: true })), line('M28 58 q-3 -4 0 -8 q3 -4 0 -8 M94 58 q-3 -4 0 -8 q3 -4 0 -8', '#e9764a', 1.4)),
  'fagel.fågelunge': all(bg(), branch(4, 96, 116, 92, 6), nestCup(60, 84, 2.4), chick(56, 74, 3.2), oval(64, 66, 30, 22)),
  'fagel.flygfärdig': all(bg(), branch(4, 88, 116, 84, 6), at(56, 86, 2.2, song({ ...GENERIC, wing: '#8f6740' })), at(56, 86, 2.2, path('M-6 -15 C-2 -28 8 -30 12 -26 C8 -22 4 -18 0 -14 Z', '#8f6740', C.ink, 0.9)), arrow(90, 60, 108, 40, HL, 2.6), greyPane(6, 76, 0.3, bg(), branch(4, 96, 116, 92, 6), nestCup(60, 84, 2.4), chick(56, 76, 3, true, '#e9c4b0'))),
  'fagel.lämna-boet': all(bg(), trunk(18, 24), nestBox(34, 56, 1.4), at(80, 40, 1.8, flySide({ body: OLIVE, head: BLACK, wing: '#7d93a8', belly: YEL })), arrow(50, 54, 66, 46, HL, 2.6), line('M52 64 q4 -2 8 0', C.grey, 1)),
  'fagel.boparasit': all(bg(), branch(4, 96, 116, 92, 6), nestCup(60, 86, 1.6), chick(56, 70, 4, true, '#9a8a74'), at(94, 66, 1.3, song({ body: '#a08a5c', belly: '#e6dcc0', head: '#a08a5c', wing: '#8a7448', tail: '#8a7448', beakLen: 4, open: true })), egg(26, 104, 0.9, '#d9e6c8', BROWN), ring(56, 66, 24)),
  // ── 2717 Fåglars läten och beteenden ──
  'fagel.läte': all(bg(), branch(4, 84, 116, 80, 5), at(48, 82, 2.2, song({ ...GENERIC, open: true })), rings(94, 40, 1.4)),
  'fagel.kvittra': all(bg(), branch(4, 70, 116, 66, 4), at(26, 69, 1.2, song({ ...BLAMES, open: true })), at(58, 68, 1.2, song({ ...TALGOXE, open: true })), at(90, 67, 1.2, song({ ...GRASPARV, open: true })), chirp(46, 38), chirp(78, 38), chirp(108, 36)),
  'fagel.fågelsång': all(bg('#f6d9b4'), sun(22, 98, 12), field(100, GRASS2), tree(70, 104, 2.4), at(64, 56, 1.9, song({ ...KOLTRAST, open: true })), note(96, 28, 1.2), note(106, 44, 1), note(90, 14, 0.9)),
  'fagel.kraxa': all(bg(), branch(4, 92, 116, 88, 5), at(52, 90, 2.1, song({ ...KRAKA, open: true })), jag(96, 34, 1.3)),
  'fagel.hoa': all(bg(DUSK), moon(20, 20, 8), starDot(100, 14), starDot(70, 22), branch(4, 100, 116, 96, 6), at(46, 98, 1.6, owl({ streaks: '#5e3f22' })), rings(72, 46, 1.4, '#f5e7a8')),
  'fagel.kuttra': all(bg(), rect(4, 62, 112, 50, '#e3d2b0', 0, null), path('M4 62 L116 62 L116 56 L4 56 Z', '#7a8088', C.ink, 1), pigeon(34, 56, 1.6), pigeon(88, 56, 1.6, true), rings(56, 22, 0.9, C.grey)),
  'fagel.snattra': all(bg(), sea(72), at(32, 94, 1.5, duck({ ...GRASAND, open: true })), at(80, 102, 1.4, duck({ ...GRASAND_F, open: true })), chirp(64, 44), chirp(70, 60), chirp(108, 70)),
  'fagel.gala': all(bg('#f6d9b4'), sun(100, 70, 12), field(86, GRASS), line('M4 82 L116 82', BARK, 3), rooster(56, 82, 1.9), jag(96, 18, 1.2)),
  'fagel.hacka.3': all(bg(), field(90, GRASS), circle(100, 92, 9, '#d64545', C.ink, 1.1), line('M100 83 l1 -4', BARK, 1.4), at(38, 100, 2.2, g('rotate(28)', song(KOLTRAST))), line('M90 76 l-3 -4 M95 73 l0 -5 M100 76 l3 -4', C.ink, 1.2)),
  'fagel.varningsläte': all(bg(), branch(4, 70, 80, 66, 5), at(42, 68, 1.9, song({ ...TALGOXE, open: true })), jag(74, 22, 1.2, RED), at(96, 32, 0.6, soar({ wing: '#6c7480', tail: '#6c7480', head: '#5c6470' })), flyer(96, 60, 0.9), flyer(108, 70, 0.8), field(100, GRASS), cat(40, 108, 0.9)),
  'fagel.flaxa': all(bg(), sea(76), at(56, 92, 1.5, swan({ neck: 's', wings: true })), path('M14 50 C20 40 34 36 40 40 M10 62 C18 54 30 52 36 56', 'none', C.grey, 1.4), line('M70 96 q4 -3 8 0 M84 98 q4 -3 8 0', WHITE, 1.4)),
  'fagel.tranedans': all(bg(), field(92, '#c9d98a'), at(36, 100, 1.1, wader(TRANA)), at(36, 100, 1.1, path('M-14 -38 C-24 -54 -6 -60 4 -42 Z', '#a9b1b9', C.ink, 1)), atL(86, 84, 1.1, wader(TRANA)), atL(86, 84, 1.1, path('M-14 -38 C-24 -56 -6 -62 4 -42 Z M-6 -36 C2 -54 18 -50 10 -36 Z', '#a9b1b9', C.ink, 1)), line('M80 96 l12 0', C.grey, 1)),
  'fagel.fågelskådare': all(bg(), field(90, GRASS), tree(96, 92, 1.4), at(92, 64, 0.8, song(BOFINK)), kid(40, 108, 2.2, C.green, binocArms, binoc(0, 0, 1)), rect(56, 84, 10, 12, WHITE, 1, C.ink, 0.8)),
};
