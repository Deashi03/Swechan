/**
 * Matematik & naturvetenskap → Biologi → Evolution, 3531–3537 (0.52): natural selection, adaptation and
 * breeding, speciation, fossils and relationship, evolutionary trees, sexual selection and human evolution.
 * Recurring signs: change over time as an orange arrow between two states; the thing the word names is ringed
 * or bracketed in orange; a grey copy stands beside it as the contrast (what the word is not); a red cross
 * marks what does not happen; land is green, sea light blue and stone warm grey-beige. The three tree words
 * share one diagram (fish, frog, mouse, lizard, bird) where only the marked part differs: the whole tree
 * (stamträd), one clade bracketed (gren), one branching point ringed (gemensam förfader). Close pairs share a
 * layout: korsning (horse + donkey = mule) and ofruktsam (the mule without a foal beside a grey mare with one).
 * Digits and maths signs only; no words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, heart } from './people';
import { P as F, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const GRASS = '#8cc96a';
const GRASS2 = '#5f9e45';
const LEAF = '#4f9d4a';
const SEA = '#9fd2ee';
const SAND = '#e8d3a2';
const STONE = '#cbbd9e';
const STONE2 = '#a8977a';
const ROCK = '#9a9184';
const SNOW = '#f4f8fb';
const BARK = '#7a5232';
const BIRCH = '#f7f5ee';
const FUR = '#a8784a';
const FUR2 = '#6e4a2c';
const LION = '#e0a64e';
const MANE = '#a8642a';
const RED = '#d8343a';
const YEL = '#f2c14e';
const WHITE = '#fbfbf8';
const BONE = '#f1e7cf';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atF = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const field = (y: number, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, rx: number, ry = rx, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const cross = (x: number, y: number, r = 5, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const plus = (x: number, y: number, r = 5) => line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, C.ink, 2.4);
const eq = (x: number, y: number, r = 5) => line(`M${x - r} ${y - 2.5} L${x + r} ${y - 2.5} M${x - r} ${y + 2.5} L${x + r} ${y + 2.5}`, C.ink, 2.4);
const panel = (x: number, y: number, w: number, h: number, col: string = WHITE) => rect(x, y, w, h, col, 3, C.ink, 1.4);
const dash = (d: string, col: string = HL, w = 1.6) => line(d, col, w, '3 3');
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const okC = (x: number, y: number, r = 6) => all(circle(x, y, r, C.green, C.ink, 1.1), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.26)));

// ── Plants and landscape ─────────────────────────────────────────────
const tuft = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, line('M-3 0 Q-4 -4 -6 -7 M0 0 L0 -8 M3 0 Q4 -4 6 -7', col, 1.4));
const bush = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, circle(-6, -6, 7, col, C.ink, 1.2), circle(6, -6, 7, col, C.ink, 1.2), circle(0, -11, 8, col, C.ink, 1.2), rect(-12, -6, 24, 6, col, 2, null));
const palm = (x: number, y: number, s = 1) => at(x, y, s, path('M-1.5 0 Q-3 -14 1 -26 L3 -26 Q0 -14 1.5 0 Z', BARK, C.ink, 1),
  ...[[-14, -22], [14, -22], [-10, -32], [10, -32], [0, -36]].map(([dx, dy]) => path(`M2 -26 Q${f1(dx! / 2 + 2)} ${dy! - 6} ${dx! + 2} ${dy}`, 'none', LEAF, 3)));
const island = (x: number, y: number, w: number, col: string = GRASS) => path(`M${x - w / 2} ${y} C${x - w / 2 + 4} ${y - 12} ${x + w / 2 - 4} ${y - 12} ${x + w / 2} ${y} Z`, col, C.ink, 1.4);
const sea = (y: number, h = 112 - y) => all(rect(4, y, 112, h, SEA, 0, null), line(`M10 ${y + 6} l7 0 M44 ${y + 10} l9 0 M80 ${y + 5} l8 0 M100 ${y + 12} l7 0`, WHITE, 1.2));
const mountains = (x: number, y: number, s = 1) => at(x, y, s, path('M-30 0 L-14 -34 L-6 -20 L4 -44 L18 -18 L24 -26 L34 0 Z', ROCK, C.ink, 1.6), path('M-18 -26 L-14 -34 L-10 -27 Z M0 -36 L4 -44 L8 -36 L4 -38 Z', SNOW, C.ink, 1));
const birchTrunk = (x: number, w = 30) => all(rect(x - w / 2, 4, w, 108, BIRCH, 0, C.ink, 1.6), ...range(9).map((i) => line(`M${f1(x - w / 2 + 3 + ((i * 11) % (w - 12)))} ${10 + i * 12} l${6 + (i % 3) * 2} 0`, C.ink, 2.2)));
const tomatoPlant = (x: number, s: number, fruit: number, n: number) => at(x, 112, s, line('M0 0 L0 -60 M0 -20 L-12 -32 M0 -36 L12 -46 M0 -48 L-10 -58', GRASS2, 3),
  ...[[-14, -34], [14, -48], [-12, -60], [6, -64], [10, -28]].map(([lx, ly]) => ellipse(lx!, ly!, 5, 3, LEAF, C.ink, 0.8)),
  ...range(n).map((i) => { const pts = [[-10, -26], [8, -40], [-6, -50], [5, -18], [-3, -38]][i]!; return all(circle(pts[0]!, pts[1]! + fruit, fruit, RED, C.ink, 1), path(`M${pts[0]! - 2} ${pts[1]! - 0.5} L${pts[0]} ${pts[1]! + 1} L${pts[0]! + 2} ${pts[1]! - 0.5}`, 'none', GRASS2, 1.2)); }));

// ── Animals (side view, facing right unless flipped) ─────────────────
type BirdO = { body?: string; wing?: string; head?: string; beak?: 'thick' | 'thin'; tail?: number; tailCol?: string; legs?: boolean };
/** Small bird centred on its body; s = 1 is about 30 px long. */
const bird = (x: number, y: number, s = 1, o: BirdO = {}) => {
  const body = o.body ?? '#c98a4a', wing = o.wing ?? '#8a5a2e', head = o.head ?? body, tl = o.tail ?? 8;
  return at(x, y, s, path(`M-9 -1 L${-9 - tl} -4 L${-9 - tl} 3 Z`, o.tailCol ?? wing, C.ink, 1.1), ellipse(0, 0, 11, 7.5, body, C.ink, 1.3),
    path('M-8 -2 C-3 -8 5 -6 5 0 C2 3 -4 3 -8 -2 Z', wing, C.ink, 1), circle(9, -6, 5.6, head, C.ink, 1.3), circle(11, -7, 1.1, C.ink, null),
    o.beak === 'thin' ? path('M14 -7.5 L22 -6.5 L14 -4.8 Z', '#3d3f4a', C.ink, 0.8) : path('M13.5 -9.5 L20 -6 L13.5 -2.5 Z', '#e8b04a', C.ink, 1),
    o.legs === false ? '' : line('M-2 7 L-3 12 M3 7 L4 12', C.ink, 1.2));
};
/** Moth seen from above; spots = dark speckles. */
const moth = (x: number, y: number, s: number, col: string, spots = true) => {
  const w = all(path('M0 -3 C-6 -12 -20 -12 -18 -1 C-16 4 -7 3 0 1 Z', col, C.ink, 1), path('M0 1 C-6 3 -14 6 -12 12 C-9 15 -3 9 0 4 Z', col, C.ink, 1),
    spots ? all(circle(-10, -5, 1.2, C.ink, null), circle(-14, -2, 0.9, C.ink, null), circle(-6, -8, 0.8, C.ink, null), circle(-8, 7, 1, C.ink, null), circle(-12, 1, 0.7, C.ink, null)) : '');
  return at(x, y, s, w, g('scale(-1 1)', w), ellipse(0, 2, 2, 8, '#6a6258', C.ink, 0.8), line('M-1 -6 C-3 -11 -6 -13 -8 -14 M1 -6 C3 -11 6 -13 8 -14', C.ink, 0.8));
};
/** Insect seen from the side: wasp (sting) or hoverfly (no sting, big eye, short body). */
const insect = (x: number, y: number, s: number, kind: 'wasp' | 'fly') => at(x, y, s,
  ellipse(-2, -9, 7, 4, 'rgba(210,230,245,0.85)', C.ink, 0.8),
  kind === 'wasp' ? all(ellipse(-8, 0, 9, 5, YEL, C.ink, 1.1), line('M-12 -4.6 L-12 4.6 M-8 -5 L-8 5 M-4 -4.6 L-4 4.6', C.ink, 2), path('M-17 0 L-21 1 L-17 2 Z', C.ink, null),
    ellipse(3, 0, 3, 2.4, YEL, C.ink, 1), circle(8, -1, 4, YEL, C.ink, 1.1), circle(9.5, -2, 1.3, C.ink, null))
    : all(ellipse(-6, 0, 7, 5, YEL, C.ink, 1.1), line('M-9 -4.6 L-9 4.6 M-5 -5 L-5 5', C.ink, 2), ellipse(3, 0, 3.4, 3, '#6a5a3a', C.ink, 1), circle(8, -1, 4.2, '#8a3a2a', C.ink, 1.1)),
  line('M0 3 L-2 8 M3 3 L3 8 M5 2 L7 7', C.ink, 0.9));
/** Dog: build changes the breed. */
type DogO = { len?: number; leg?: number; h?: number; col?: string; curly?: boolean; ears?: 'flop' | 'up'; tail?: 'up' | 'down' };
const dogD = (x: number, y: number, s: number, o: DogO = {}) => {
  const L = o.len ?? 24, lg = o.leg ?? 12, H = o.h ?? 10, col = o.col ?? '#c98a4a';
  const body = o.curly ? all(...range(Math.round(L / 5) + 1).map((i) => circle(-L / 2 + i * 5, -lg - H / 2, H / 2 + 1, col, C.ink, 1))) : rect(-L / 2, -lg - H, L, H, col, H / 2, C.ink, 1.3);
  const legs = all(...[-L / 2 + 3, -L / 2 + 7, L / 2 - 7, L / 2 - 3].map((lx) => rect(lx - 1.6, -lg - 2, 3.2, lg + 2, col, 1, C.ink, 1)));
  const hx = L / 2 + 3, hy = -lg - H - 3;
  const head = all(rect(hx - 6, hy - 6, 11, 10, col, 4, C.ink, 1.2), rect(hx + 2, hy - 1, 7, 5, col, 2, C.ink, 1.1), circle(hx + 8.6, hy, 1.4, C.ink, null), circle(hx + 1, hy - 2, 1.1, C.ink, null),
    o.ears === 'up' ? path(`M${hx - 5} ${hy - 5} L${hx - 3} ${hy - 12} L${hx} ${hy - 5} Z`, col, C.ink, 1) : path(`M${hx - 5} ${hy - 5} C${hx - 9} ${hy - 4} ${hx - 9} ${hy + 4} ${hx - 6} ${hy + 5} C${hx - 3} ${hy + 2} ${hx - 3} ${hy - 3} ${hx - 5} ${hy - 5} Z`, o.curly ? col : '#8a5a2e', C.ink, 1),
    o.curly ? circle(hx - 1, hy - 7, 4, col, C.ink, 1) : '');
  const tail = o.tail === 'down' ? line(`M${-L / 2} ${-lg - H + 3} q-6 4 -7 10`, col, 3) : line(`M${-L / 2} ${-lg - H + 3} q-6 -2 -6 -9`, col, 3);
  return at(x, y, s, tail, legs, body, head);
};
const wolf = (x: number, y: number, s: number, col = '#8d8f94') => at(x, y, s, line('M-12 -18 q-8 4 -9 12', col, 4), line('M-12 -18 q-8 4 -9 12', C.ink, 0.6),
  ...[-9, -5, 6, 10].map((lx) => rect(lx - 1.8, -16, 3.6, 16, col, 1, C.ink, 1)), path('M-13 -14 C-14 -24 -4 -26 6 -25 C12 -24 14 -20 13 -14 Z', col, C.ink, 1.3),
  path('M10 -22 L12 -31 L15 -24 L18 -31 L19 -22 L26 -18 L24 -15 L14 -15 Z', col, C.ink, 1.2), circle(16, -21, 1.1, C.ink, null), circle(25.5, -17.6, 1.2, C.ink, null), path('M-6 -16 C-2 -12 4 -12 8 -15', 'none', '#d9d9dc', 2));
/** Horse-like animal: horse, donkey or mule (ears and colours differ). */
const equid = (x: number, y: number, s: number, kind: 'horse' | 'donkey' | 'mule', o: { foal?: boolean } = {}) => {
  const col = kind === 'horse' ? '#a0673d' : kind === 'donkey' ? '#9a9aa0' : '#8a6a52', ear = kind === 'horse' ? 5 : kind === 'donkey' ? 12 : 9;
  const legLen = o.foal ? 18 : 20;
  return at(x, y, s, ...[-12, -7, 9, 14].map((lx) => rect(lx - 1.8, -legLen - 2, 3.6, legLen + 2, col, 1, C.ink, 1.1)),
    path('M-15 -22 C-16 -34 16 -36 17 -24 C17 -18 12 -18 0 -18 C-10 -18 -15 -17 -15 -22 Z', col, C.ink, 1.4),
    path('M12 -30 L18 -46 L23 -46 L32 -34 L29 -31 L22 -36 L19 -26 Z', col, C.ink, 1.3),
    path(`M18 -45 L${17 - ear * 0.15} ${-45 - ear} L21 -46 Z M21 -46 L${21 + ear * 0.1} ${-46 - ear} L23 -46 Z`, col, C.ink, 1),
    kind === 'horse' ? path('M18 -46 C14 -42 12 -36 11 -29 L14 -31 C15 -37 17 -42 20 -45 Z', '#3b2a20', null) : line('M18 -45 C15 -40 13 -34 12 -30', '#3d3f4a', 2),
    circle(23, -41, 1.2, C.ink, null), circle(30.5, -33.6, 0.9, C.ink, null),
    kind === 'horse' ? path('M-15 -26 C-22 -24 -24 -14 -21 -6 C-19 -14 -17 -20 -15 -22 Z', '#3b2a20', C.ink, 1) : path('M-15 -24 L-20 -12 L-18 -11 Z', col, C.ink, 1),
    kind === 'donkey' ? ellipse(30, -32.5, 3, 2.4, '#e8e8ea', null) : '');
};
const lionD = (x: number, y: number, s: number, o: { mane?: boolean; grey?: boolean } = {}) => {
  const b = o.grey ? C.grey2 : LION, m = o.grey ? C.grey : MANE;
  return at(x, y, s, line('M-16 -20 q-10 2 -12 12', b, 3), circle(-28, -8, 2.4, m, null),
    ...[-12, -7, 8, 13].map((lx) => rect(lx - 2.2, -18, 4.4, 18, b, 1.5, C.ink, 1.1)), path('M-17 -16 C-18 -28 10 -30 16 -26 C18 -20 14 -14 10 -14 L-12 -14 C-15 -14 -17 -15 -17 -16 Z', b, C.ink, 1.4),
    o.mane !== false ? circle(16, -30, 13, m, C.ink, 1.4) : '', circle(18, -30, 8, b, C.ink, 1.3), path('M23 -29 L27 -28 L24 -25 Z', '#6a4a3a', null), circle(20, -32, 1.2, C.ink, null),
    path('M20 -25 Q23 -23 25 -25', 'none', C.ink, 0.9), o.mane === false ? path('M12 -37 L13 -40 L16 -37 Z', b, C.ink, 1) : '');
};
const catD = (x: number, y: number, s: number, col: string, o: { up?: boolean } = {}) => at(x, y, s, line('M-12 -12 C-20 -14 -22 -24 -16 -28', col, 3.4), line('M-12 -12 C-20 -14 -22 -24 -16 -28', C.ink, 0.5),
  ...[-9, -5, 5, 9].map((lx) => rect(lx - 1.6, -10, 3.2, 10, col, 1, C.ink, 0.9)), ellipse(0, -13, 13, 6.5, col, C.ink, 1.2),
  o.up ? at(12, -24, 1, g('rotate(-35)', circle(0, 0, 7, col, C.ink, 1.2), path('M-5 -4 L-4 -11 L0 -6 Z M5 -4 L4 -11 L0 -6 Z', col, C.ink, 1), line('M-4 -1 Q-2.5 -2.6 -1 -1 M1 -1 Q2.5 -2.6 4 -1', C.ink, 1), circle(0, 2, 1, '#e08a9a', null)))
    : all(circle(12, -20, 7, col, C.ink, 1.2), path('M7 -24 L8 -31 L12 -26 Z M17 -24 L16 -31 L12 -26 Z', col, C.ink, 1), circle(9.5, -21, 1.1, C.ink, null), circle(14.5, -21, 1.1, C.ink, null), circle(12, -18, 1, '#e08a9a', null)));
const fishI = (x: number, y: number, s = 1, col = '#6aa6d6') => at(x, y, s, path('M-10 0 C-5 -7 6 -7 9 0 C6 7 -5 7 -10 0 Z M-10 0 L-16 -6 L-16 6 Z', col, C.ink, 1.1), circle(4, -1.5, 1.2, C.ink, null));
const frogI = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 10, 6.5, '#6ab04a', C.ink, 1.1), circle(-4, -6, 3, '#6ab04a', C.ink, 1), circle(4, -6, 3, '#6ab04a', C.ink, 1), circle(-4, -6.5, 1.1, C.ink, null), circle(4, -6.5, 1.1, C.ink, null), path('M-10 4 L-14 8 L-8 7 M10 4 L14 8 L8 7', 'none', C.ink, 1.2));
const lizardI = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 C-14 0 -18 -2 -22 1 C-18 3 -14 3 -8 3 Z', '#8ab84a', C.ink, 1), ellipse(0, 0, 9, 4, '#8ab84a', C.ink, 1.1), ellipse(11, -1, 4.5, 3, '#8ab84a', C.ink, 1), circle(12, -2, 0.9, C.ink, null), line('M-5 3 L-8 7 M5 3 L8 7', C.ink, 1.3));
const mouseI = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 1 C-16 2 -18 -4 -22 -2', 'none', C.ink, 1.1), ellipse(0, 0, 9, 6, '#b0a49a', C.ink, 1.1), circle(8, -2, 4.5, '#b0a49a', C.ink, 1), circle(6, -7, 3, '#e0b0b0', C.ink, 1), circle(10, -3, 0.9, C.ink, null), circle(12.4, -1.4, 0.9, '#e08a9a', null));

// ── Fossils and bones ────────────────────────────────────────────────
const slab = (x: number, y: number, w: number, h: number, col: string = STONE) => all(rect(x, y, w, h, col, 6, C.ink, 1.6), line(`M${x + 6} ${y + h * 0.35} l${w * 0.3} 2 M${x + w * 0.55} ${y + h * 0.75} l${w * 0.35} -2`, STONE2, 1));
const spiral = (s: number, col: string, ink: string) => at(0, 0, s, circle(0, 0, 16, col, ink, 1.6), path('M0 0 C0 -6 8 -6 8 0 C8 8 -6 10 -8 0 C-10 -12 12 -14 14 0', 'none', ink, 1.4),
  ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 10)} ${f1(Math.sin(a) * 10)} L${f1(Math.cos(a) * 15.5)} ${f1(Math.sin(a) * 15.5)}`, ink, 0.8); }));
const trilo = (s: number, col: string, ink: string) => at(0, 0, s, path('M-12 -14 C-12 -22 12 -22 12 -14 L10 12 C6 20 -6 20 -10 12 Z', col, ink, 1.5), path('M-4 -18 C-4 -14 4 -14 4 -18 L3 14 C2 17 -2 17 -3 14 Z', 'none', ink, 1.1),
  line(range(7).map((i) => `M-10 ${-8 + i * 3.4} L-4 ${-8 + i * 3.4} M4 ${-8 + i * 3.4} L10 ${-8 + i * 3.4}`).join(' '), ink, 0.9), circle(-6, -15, 1.6, ink, null), circle(6, -15, 1.6, ink, null));
const bone = (x: number, y: number, len: number, rot: number, col: string = BONE, w = 3) => g(`translate(${x} ${y}) rotate(${rot})`, rect(0, -w / 2, len, w, col, w / 2, C.ink, 0.9), circle(0, -w / 2, w * 0.6, col, C.ink, 0.8), circle(0, w / 2, w * 0.6, col, C.ink, 0.8), circle(len, -w / 2, w * 0.6, col, C.ink, 0.8), circle(len, w / 2, w * 0.6, col, C.ink, 0.8));
/** Horseshoe crab seen from above: horseshoe-shaped shield, spiny abdomen and a long tail spine (pointing down). */
const horseshoeCrab = (x: number, y: number, s: number, col: string, ink: string = C.ink) => at(x, y, s,
  path('M-20 8 C-22 -18 22 -18 20 8 C14 3 -14 3 -20 8 Z', col, ink, 1.4), path('M-12 5 L12 5 L9 18 L0 21 L-9 18 Z', col, ink, 1.2),
  line('M-12 8 l-4 1 M-11 12 l-4 1 M-10 16 l-3 1 M12 8 l4 1 M11 12 l4 1 M10 16 l3 1', ink, 1), line('M0 21 L0 40', ink, 2.2),
  circle(-8, -6, 1.5, ink, null), circle(8, -6, 1.5, ink, null), line('M-14 2 C-8 -4 8 -4 14 2 M0 -12 L0 4', ink, 0.9));

// ── People-like figures ──────────────────────────────────────────────
/** Ape or early human in profile facing right; posture: 'knuckle' (four limbs) or 'upright'. */
const hominid = (x: number, s: number, o: { posture: 'knuckle' | 'upright'; col?: string; face?: string; brow?: boolean; clothes?: string; grey?: boolean }) => {
  const col = o.grey ? C.grey : (o.col ?? FUR2), face = o.grey ? C.grey2 : (o.face ?? '#d9a57c'), ink = C.ink;
  if (o.posture === 'knuckle') return at(x, 112, s, rect(-14, -20, 4.4, 20, col, 2, ink, 1), rect(6, -24, 4.4, 24, col, 2, ink, 1), rect(10, -22, 4.4, 22, col, 2, ink, 1), rect(-9, -20, 4.4, 20, col, 2, ink, 1),
    path('M-16 -22 C-18 -34 4 -40 14 -34 C18 -30 16 -22 10 -20 L-12 -18 Z', col, ink, 1.4), circle(18, -32, 7, col, ink, 1.3), ellipse(21, -30, 4.2, 4, face, ink, 1), circle(20.5, -32.5, 0.9, ink, null), line('M17 -35.5 L24 -35', ink, 1.6));
  const legs = all(path('M-6 -40 L-8 -2 L-2 -2 L0 -30 L2 -2 L8 -2 L6 -40 Z', o.clothes ?? col, ink, 1.4), ellipse(-5, -1, 4.5, 1.8, face, ink, 0.9), ellipse(5, -1, 4.5, 1.8, face, ink, 0.9));
  const torso = path('M-9 -66 C-10 -56 -9 -46 -7 -38 L7 -38 C9 -46 10 -56 9 -66 C4 -69 -4 -69 -9 -66 Z', o.clothes ?? col, ink, 1.5);
  const arm = all(path('M5 -64 C10 -56 11 -46 9 -36 L5 -36 C6 -46 5 -54 2 -62 Z', col, ink, 1.2), circle(7.4, -35, 2.4, face, ink, 0.9));
  const head = all(circle(0, -75, 8.6, col, ink, 1.4), ellipse(4, -73, 5.2, 5.6, face, ink, 1), circle(5, -76, 1, ink, null), o.brow ? path('M1 -79 L10 -78.4 L9.6 -76.4 L1 -77 Z', col, ink, 0.8) : '', line('M5 -70 Q7 -69 8.5 -70.5', ink, 0.9));
  return at(x, 112, s, legs, torso, arm, head);
};
/** Skull in profile facing right: low (ape), brow (neanderthal) or high (modern); optional brain inside. */
const skullP = (x: number, y: number, s: number, kind: 'low' | 'brow' | 'high', brain?: string) => {
  const cap = kind === 'low' ? 'M-14 0 C-16 -10 -8 -16 2 -15 C8 -14 12 -10 13 -6 L16 -4 L16 2 Z' : kind === 'brow' ? 'M-18 2 C-22 -12 -6 -20 4 -18 C10 -17 13 -12 13 -7 L17 -5 L16 2 Z' : 'M-14 2 C-17 -18 4 -26 10 -14 C12 -10 12 -7 12 -5 L14 -2 L14 3 Z';
  const br = kind === 'low' ? 'M-11 -2 C-12 -9 -6 -12 1 -12 C6 -11 9 -8 9 -4 Z' : kind === 'brow' ? 'M-15 0 C-18 -10 -6 -16 3 -15 C8 -14 10 -10 10 -5 Z' : 'M-11 0 C-14 -15 2 -22 8 -12 C9 -9 9 -6 9 -3 Z';
  return at(x, y, s, path(cap, BONE, C.ink, 1.4), brain ? path(br, brain, C.ink, 0.8) : '', path('M-6 2 L14 2 L15 8 L12 12 L2 12 L0 7 Z', BONE, C.ink, 1.3), circle(9, -2, 2.6, '#6a5a4a', null), line('M5 10 L13 10', C.ink, 0.8));
};
const handAxe = (x: number, y: number, s: number, rot = 0, col = '#7a8090') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -16 C7 -10 9 4 6 12 C3 16 -3 16 -6 12 C-9 4 -7 -10 0 -16 Z', col, C.ink, 1.4),
  path('M0 -12 L-3 -4 L2 2 L-2 9 M0 -12 L4 -3 L1 5', 'none', '#565b64', 0.9));

// ── Tree diagram (fish, frog, mouse, lizard, bird) ───────────────────
const treeLines = {
  root: 'M60 106 L60 96',
  fish: 'M60 96 L16 46', rest: 'M60 96 L71 84', frog: 'M71 84 L38 46', amn: 'M71 84 L82 72', mouse: 'M82 72 L60 46', sau: 'M82 72 L93 60', lizard: 'M93 60 L82 46', bird: 'M93 60 L104 46',
};
const treeIcons = (mute = false) => {
  const k = all(fishI(16, 30, 0.85), frogI(38, 31, 0.85), mouseI(61, 31, 0.8), lizardI(85, 31, 0.75), bird(104, 30, 0.6, { body: '#5aa7e8', wing: '#2f6fb0', beak: 'thin', legs: false }));
  return mute ? greyed(k) : k;
};
const treeBase = (hl: (keyof typeof treeLines)[], col: string = HL) => all(bg(), rect(4, 100, 112, 12, '#d9c7a0', 0, null),
  ...Object.entries(treeLines).map(([k, d]) => line(d, hl.includes(k as keyof typeof treeLines) ? col : C.grey, hl.includes(k as keyof typeof treeLines) ? 3.4 : 2.4)));

export const EVOLUTION_MOTIFS: Record<string, Svg> = {
  // ── Naturligt urval ────────────────────────────────────────────────
  'evo.björkmätare': all(bg('#e8f0e0'), tuft(20, 112, 1.4), tuft(100, 112, 1.4), birchTrunk(60, 40), path('M80 30 L104 18 M80 44 L110 40', 'none', BARK, 2.4), ellipse(106, 16, 8, 4, LEAF, C.ink, 0.8), ellipse(112, 38, 6, 3.4, LEAF, C.ink, 0.8),
    moth(60, 58, 1.35, '#ecebe3'), ring(60, 59, 30, 22)),
  'evo.födobrist': all(bg('#e4eef6'), field(90, SNOW), line('M4 90 L116 90', C.grey2, 1.2),
    at(18, 90, 1, line('M0 0 L0 -26 M0 -12 L-8 -20 M0 -18 L7 -26 M0 -6 L6 -12', BARK, 1.8)), at(102, 90, 1, line('M0 0 L0 -22 M0 -10 L-7 -17 M0 -15 L6 -22', BARK, 1.8)),
    bird(42, 82, 1, { body: '#9a8a7a', wing: '#6a5a4a' }), atF(74, 82, 1, bird(0, 0, 1, { body: '#9a8a7a', wing: '#6a5a4a' })),
    ellipse(58, 96, 16, 4, '#e6edf2', C.grey, 1), panel(38, 12, 44, 34), at(50, 30, 1, circle(-4, 2, 3.4, RED, C.ink, 0.9), circle(3, 3, 3.4, RED, C.ink, 0.9), circle(0, -3, 3.4, RED, C.ink, 0.9), line('M0 -6 L1 -12', GRASS2, 1.2)),
    at(70, 30, 1, path('M-5 6 L-2 -6 M0 6 L0 -8 M5 6 L2 -6', 'none', GRASS2, 1.6)), cross(60, 29, 14), line('M52 46 L56 54 M68 46 L64 54', C.grey, 1.4)),
  'evo.giraff': all(bg(SKY), field(100, '#d9c27a'), at(92, 112, 1, rect(-3, -64, 6, 64, BARK, 1, C.ink, 1.2), path('M-28 -64 C-24 -76 24 -76 28 -64 C20 -60 -20 -60 -28 -64 Z', LEAF, C.ink, 1.4)),
    at(46, 112, 1, ...[-14, -8, 6, 12].map((lx) => rect(lx - 2, -30, 4, 30, '#e8b04a', 1, C.ink, 1.1)), path('M-18 -30 C-18 -42 14 -46 18 -38 C20 -32 14 -28 8 -28 L-14 -28 Z', '#e8b04a', C.ink, 1.4),
      path('M10 -40 L30 -82 L37 -79 L18 -36 Z', '#e8b04a', C.ink, 1.3), path('M29 -84 C30 -90 40 -90 44 -84 L50 -80 L47 -76 L36 -76 Z', '#e8b04a', C.ink, 1.3), line('M32 -88 L31 -93 M36 -89 L36 -94', C.ink, 1.4), circle(38, -84, 1.2, C.ink, null),
      ...[[-10, -36], [0, -38], [8, -34], [-4, -32], [16, -48], [22, -60], [27, -70]].map(([px, py]) => circle(px!, py!, 2.6, '#a0673d', null)), line('M-18 -36 l-6 6', C.ink, 1.4))),
  // ── Anpassning och selektion ───────────────────────────────────────
  'evo.selektion': all(bg(), ...[[22, 16, LEAF], [36, 12, '#a0673d'], [50, 18, LEAF], [64, 12, '#a0673d'], [78, 18, LEAF], [92, 14, '#a0673d'], [44, 28, LEAF], [72, 28, '#a0673d']].map(([bx, by, c]) => at(bx as number, by as number, 0.7, ellipse(0, 0, 6, 4.4, c as string, C.ink, 1), line('M0 -4.4 L0 4.4', C.ink, 0.7), circle(6, 0, 2.2, C.ink, null))),
    path('M14 40 L106 40 L80 70 L40 70 Z', '#e6edf2', C.ink, 1.6), line(range(9).map((i) => `M${22 + i * 10} 40 L${42 + i * 4.5} 70`).join(' '), C.grey, 0.8), line('M28 50 L92 50 M34 60 L86 60', C.grey, 0.8),
    greyed(at(36, 46, 0.7, ellipse(0, 0, 6, 4.4, '#a0673d', C.ink, 1)), at(84, 46, 0.7, ellipse(0, 0, 6, 4.4, '#a0673d', C.ink, 1)), at(66, 56, 0.7, ellipse(0, 0, 6, 4.4, '#a0673d', C.ink, 1))),
    arrow(60, 72, 60, 84, HL, 2.6), rect(20, 92, 80, 18, '#d8eccb', 4, C.ink, 1.2), ...[34, 52, 70, 88].map((bx) => at(bx, 101, 0.8, ellipse(0, 0, 6, 4.4, LEAF, C.ink, 1), line('M0 -4.4 L0 4.4', C.ink, 0.7), circle(6, 0, 2.2, C.ink, null)))),
  'evo.mimikry': all(bg('#eef6ea'), field(96), at(78, 96, 1, line('M0 0 L0 -26', GRASS2, 2.4), ...range(6).map((i) => g(`rotate(${i * 60} 0 -32)`, ellipse(0, -38, 3.4, 6, WHITE, C.ink, 0.9))), circle(0, -32, 4, YEL, C.ink, 1)),
    insect(80, 60, 1.3, 'fly'), ring(80, 58, 18, 14), atF(26, 80, 1.3, bird(0, 0, 1, { body: '#d06a3a', wing: '#7a5a3a', head: '#5a4a3a' })),
    path('M10 26 C10 12 46 12 46 26 C46 38 10 38 10 26 Z', WHITE, C.ink, 1.4), circle(22, 44, 2.6, WHITE, C.ink, 1), circle(26, 52, 1.8, WHITE, C.ink, 1), insect(30, 28, 0.9, 'wasp'),
    path('M8 70 l-6 -4 M8 64 l-7 0', 'none', C.ink, 1.2), eq(56, 30, 4)),
  'evo.avel': all(bg(), field(104), at(60, 56, 0.9, dogD(0, 0, 1, { col: '#e3c07a', ears: 'flop' })), ring(64, 42, 20, 16), atF(24, 56, 0.8, dogD(0, 0, 1, { col: '#c9a160' })), atF(100, 56, 0.8, dogD(0, 0, 1, { col: '#b08a50' })),
    greyed(atF(24, 56, 0.8, dogD(0, 0, 1, { col: '#c9a160' })), atF(100, 56, 0.8, dogD(0, 0, 1, { col: '#b08a50' }))), line('M4 58 L116 58', C.grey2, 1.4),
    arrow(60, 62, 60, 76, HL, 2.6), ...[36, 60, 84].map((px) => at(px, 104, 0.6, dogD(0, 0, 1, { col: '#e3c07a', len: 18, leg: 8, h: 8 })))),
  'evo.hundras': all(bg(), field(104), at(22, 104, 0.95, dogD(0, 0, 1, { len: 30, leg: 5, h: 9, col: '#8a4a2a', ears: 'flop' })),
    at(56, 104, 0.95, dogD(0, 0, 1, { len: 18, leg: 14, h: 10, col: '#f4f2ee', curly: true, tail: 'up' })), at(94, 104, 1, dogD(0, 0, 1, { len: 24, leg: 30, h: 13, col: '#9a9ca2', ears: 'up', tail: 'down' }))),
  'evo.förädla.2': all(bg(), field(106, SAND), tomatoPlant(26, 0.9, 1.8, 5), arrow(46, 70, 66, 70, HL, 3), tomatoPlant(90, 1.15, 6.5, 3), rect(4, 106, 112, 6, '#a0673d', 0, null)),
  // ── Artbildning ────────────────────────────────────────────────────
  'evo.artbildning': all(bg(SKY), sea(60), island(60, 34, 44), ...[48, 60, 72].map((bx) => bird(bx, 26, 0.5, { body: '#b08a5a', wing: '#7a5a3a' })),
    arrow(46, 38, 28, 74, HL, 2.4), arrow(74, 38, 92, 74, HL, 2.4), island(24, 100, 38), island(96, 100, 38),
    ...[16, 30].map((bx) => bird(bx, 92, 0.5, { body: '#5aa7e8', wing: '#2f6fb0', beak: 'thin' })), ...[88, 102].map((bx) => bird(bx, 92, 0.5, { body: '#e85a3a', wing: '#9a3a2a', tail: 14 }))),
  'evo.barriär': all(bg(SKY), field(84), mountains(60, 96, 1.5), rect(4, 96, 112, 16, GRASS, 0, null),
    at(18, 104, 0.55, wolf(0, 0, 1, '#b08a5a')), atF(102, 104, 0.55, wolf(0, 0, 1, '#b08a5a')), dash('M24 86 C40 40 80 40 96 86', C.ink, 1.4), cross(60, 52, 7), ring(60, 70, 42, 30)),
  'evo.landbrygga': all(bg(SKY), sea(70), path('M4 62 L30 62 C40 62 44 74 50 76 L70 76 C76 74 80 62 90 62 L116 62 L116 112 L4 112 Z', '#d9c27a', null),
    path('M4 62 L30 62 C40 62 44 74 50 76 L70 76 C76 74 80 62 90 62 L116 62', 'none', C.ink, 1.6), rect(4, 82, 112, 30, SEA, 0, null), path('M44 78 L76 78 L74 84 L46 84 Z', '#d9c27a', null),
    line('M10 88 l7 0 M90 94 l8 0', WHITE, 1.2), ring(60, 76, 18, 7), at(48, 74, 0.45, wolf(0, 0, 1, '#a0673d')), at(68, 74, 0.4, wolf(0, 0, 1, '#c9a160')), arrow(82, 54, 100, 54, HL, 2.2), palm(14, 62, 0.7), palm(104, 62, 0.6)),
  'evo.kolonisera.2': all(bg(SKY), sea(70), path('M4 70 L4 50 L24 50 C30 54 32 62 34 70 Z', GRASS, C.ink, 1.4), bush(14, 50, 0.6),
    island(92, 72, 40, SAND), at(84, 66, 1, line('M0 0 L0 -8 M-3 -4 L0 -8 L3 -4', GRASS2, 1.6)), at(98, 66, 0.9, line('M0 0 L0 -8 M-3 -4 L0 -8 L3 -4', GRASS2, 1.6)),
    ellipse(92, 64, 6, 2.6, '#a0673d', C.ink, 1), circle(90, 62.6, 1.6, WHITE, C.ink, 0.6), circle(93.6, 62.6, 1.6, WHITE, C.ink, 0.6),
    bird(46, 34, 0.55, { legs: false }), bird(62, 28, 0.55, { legs: false }), bird(76, 40, 0.55, { legs: false }), dash('M32 44 C48 20 72 20 88 54', HL, 2), arrow(84, 48, 88, 56, HL, 2)),
  'evo.fink': all(bg('#e8f0e0'), path('M4 78 L116 70', 'none', BARK, 5), ellipse(26, 72, 7, 3.4, LEAF, C.ink, 0.8), ellipse(100, 64, 7, 3.4, LEAF, C.ink, 0.8),
    bird(58, 58, 1.9, { body: '#d88a5a', wing: '#5a6a4a', head: '#6a7a8a', beak: 'thick' }), ellipse(98, 46, 3, 2, '#c9a160', C.ink, 0.8), ellipse(94, 50, 2.4, 1.6, '#c9a160', C.ink, 0.8), line('M100 42 l3 -3 M95 40 l0 -4', C.ink, 0.8)),
  'evo.åsna': all(bg(SKY), field(100, '#c9b97a'), mountains(90, 100, 0.7), at(52, 108, 1.3, equid(0, 0, 1, 'donkey'))),
  'evo.korsning.2': all(bg(), ground, at(20, 64, 0.62, equid(0, 0, 1, 'horse')), plus(44, 40), at(58, 64, 0.62, equid(0, 0, 1, 'donkey')), eq(80, 40),
    at(88, 108, 0.78, equid(0, 0, 1, 'mule')), ring(90, 86, 24, 26), line('M4 66 L70 66', C.grey2, 1.6)),
  'evo.ofruktsam': all(bg(), ground, greyed(at(22, 108, 0.78, equid(0, 0, 1, 'horse')), at(46, 108, 0.45, equid(0, 0, 1, 'horse', { foal: true })), okC(40, 66, 6)),
    at(80, 108, 0.78, equid(0, 0, 1, 'mule')), at(102, 108, 0.5, line('M-12 -20 L-12 0 M-6 -20 L-6 0 M10 -20 L10 0 M15 -20 L15 0 M-15 -22 C-16 -34 16 -36 17 -24 C17 -18 12 -18 0 -18 C-10 -18 -15 -17 -15 -22 Z M12 -30 L18 -46 L23 -46 L32 -34 L29 -31 L22 -36 L19 -26 Z', '#7a828c', 2.4, '4 3')), cross(108, 92, 9), line('M64 20 L64 108', C.grey2, 1.2, '3 3')),
  // ── Fossil och släktskap ───────────────────────────────────────────
  'evo.förstenad': all(bg(), ground,
    greyed(at(28, 96, 1.15, path('M-18 -14 L14 -14 L14 14 L-18 14 Z', '#c9a06a', C.ink, 1.6), ellipse(14, 0, 8, 14, '#e8c890', C.ink, 1.6), ellipse(14, 0, 5, 9, 'none', '#a8784a', 1), ellipse(14, 0, 2.4, 4.4, 'none', '#a8784a', 1),
      line('M-14 -6 L8 -6 M-12 5 L10 5', '#8a6a3a', 1), g('translate(4 -14) rotate(-20)', rect(-1.6, -26, 3.2, 26, '#a0673d', 1, C.ink, 1), path('M-8 -30 L6 -30 L6 -22 L-8 -22 Z', '#9aa0aa', C.ink, 1.2)))),
    at(84, 96, 1.15, path('M-18 -14 L14 -14 L14 14 L-18 14 Z', '#a8a29a', C.ink, 1.6), line('M-14 -8 L-6 -2 L2 -9 M-10 6 L0 2 L8 8', '#7a7470', 1), ellipse(14, 0, 8, 14, '#c9c2b8', C.ink, 1.6),
      ellipse(14, 0, 6, 11, 'none', '#c0504a', 1.6), ellipse(14, 0, 4, 7.5, 'none', '#d8a03a', 1.6), ellipse(14, 0, 2.2, 4, '#8a6ab0', null),
      g('translate(2 -30) rotate(25)', rect(-1.6, 0, 3.2, 20, '#a0673d', 1, C.ink, 1), rect(-8, -5, 16, 6, '#565b64', 1.5, C.ink, 1.2)), line('M-6 -18 l-5 -4 M2 -20 l0 -6 M10 -18 l5 -4', HL, 1.6), ring(2, -4, 24, 24)),
    line('M60 64 L60 112', C.grey2, 1.2, '3 3')),
  'evo.avtryck': all(bg(), slab(30, 30, 80, 70), at(70, 64, 1.2, path('M-20 0 C-12 -14 12 -14 20 0 C12 14 -12 14 -20 0 Z', '#b0a080', '#6a5a3a', 1.6), line('M-20 0 L20 0 M-10 0 L-4 -7 M0 0 L6 -8 M-10 0 L-4 7 M0 0 L6 8 M10 0 L14 -4 M10 0 L14 4', '#6a5a3a', 1)),
    greyed(at(18, 26, 0.7, path('M-20 0 C-12 -14 12 -14 20 0 C12 14 -12 14 -20 0 Z', LEAF, C.ink, 1.4))), arrow(26, 38, 40, 50, HL, 2.4)),
  'evo.ammonit': all(bg(), rect(4, 4, 52, 108, SEA, 3, null), line('M10 20 l8 0 M30 90 l10 0', WHITE, 1.2),
    at(30, 52, 1, spiral(0.9, '#e8b07a', C.ink), path('M12 4 C20 8 22 14 18 20 M12 8 C18 14 16 20 12 24 M10 10 C12 18 8 22 4 24', 'none', '#c97a5a', 2)),
    arrow(54, 60, 66, 60, HL, 2.4), slab(64, 26, 48, 64), at(88, 58, 1, spiral(1, STONE, '#6a5a3a'))),
  'evo.trilobit': all(bg(), rect(4, 4, 52, 108, SEA, 3, null), rect(4, 96, 52, 16, SAND, 0, null), line('M10 20 l8 0 M30 40 l10 0', WHITE, 1.2),
    at(30, 80, 1, line('M-13 -10 l-6 -2 M-13 -4 l-6 0 M-12 2 l-6 2 M-11 8 l-5 4 M13 -10 l6 -2 M13 -4 l6 0 M12 2 l6 2 M11 8 l5 4 M-4 -19 l-6 -8 M4 -19 l6 -8', C.ink, 1), trilo(0.85, '#b07a5a', C.ink)),
    arrow(54, 60, 66, 60, HL, 2.4), slab(64, 26, 48, 64), at(88, 58, 1, trilo(1, STONE, '#6a5a3a'))),
  'evo.urfågel': all(bg('#eef0e0'), field(100, '#c9b97a'), at(62, 70, 1.6,
    path('M-14 2 L-40 -2 L-40 4 Z', '#6a7a5a', C.ink, 1), ...range(5).map((i) => path(`M${-16 - i * 5} 2 l-3 -6 l3 1 Z M${-16 - i * 5} 2 l-3 6 l3 -1 Z`, '#8a9a6a', C.ink, 0.6)),
    ellipse(0, 0, 14, 8, '#7a8a5a', C.ink, 1.2), path('M-6 -4 C0 -24 14 -28 22 -22 L10 -4 Z', '#9aaa6a', C.ink, 1.1), line('M22 -22 l4 -1 M20 -18 l4 0', C.ink, 1.2),
    path('M10 -6 C14 -14 22 -14 26 -10 L36 -9 L34 -5 L22 -4 Z', '#7a8a5a', C.ink, 1.1), line('M26 -6 L34 -6', C.ink, 0.8), path('M27 -6 l1 2 l1 -2 l1 2 l1 -2 l1 2', 'none', WHITE, 0.8), circle(22, -10, 1.2, C.ink, null),
    line('M-2 8 L-4 18 L-1 20 M4 8 L6 18 L9 20', C.ink, 1.4))),
  'evo.besläktad': all(bg(), ground, line('M30 26 L30 40 L84 40 L84 66 M30 40 L30 66 M57 18 L57 40', HL, 2.6), circle(57, 40, 3.2, HL, null),
    at(26, 108, 1.15, wolf(0, 0, 1)), at(80, 108, 1.15, dogD(0, 0, 1, { col: '#c98a4a', ears: 'up', leg: 14 })), greyed(at(104, 26, 0.7, catD(0, 0, 1, '#d89a5a')))),
  'evo.levande-fossil': all(bg(SEA), rect(4, 70, 52, 42, SAND, 0, null), horseshoeCrab(30, 40, 1.05, '#9a7a5a'), eq(62, 46, 5), slab(70, 14, 42, 64), horseshoeCrab(91, 36, 0.8, STONE, '#6a5a3a'),
    ...[[18, 94], [40, 100], [28, 86]].map(([sx, sy]) => ellipse(sx!, sy!, 3, 1.6, '#c9b080', null))),
  'evo.paleontolog': all(bg('#f2ead8'), field(92, SAND), path('M50 100 C56 92 72 92 80 96 L104 100 L104 104 L52 104 Z', '#c9b080', null),
    at(78, 98, 1, path('M8 -8 C14 -14 26 -12 28 -4 L26 2 L10 2 Z', BONE, C.ink, 1.2), circle(17, -5, 2.4, '#6a5a3a', null), path('M12 2 l2 3 l2 -3 l2 3 l2 -3 l2 3', 'none', C.ink, 0.8),
      bone(-24, 0, 26, 0, BONE, 3), ...range(5).map((i) => path(`M${-20 + i * 5} 0 C${-22 + i * 5} -8 ${-16 + i * 5} -10 ${-14 + i * 5} -4`, 'none', BONE, 2.4))),
    F({ x: 34, h: 0.82, top: '#d8c8a0', bottom: '#6a7a5a', mood: 'smile' }), at(34, 78.2, 0.69, ellipse(0, -64, 17, 3.4, '#e6d3a0', C.ink, 1.4), path('M-9 -64 C-9 -76 9 -76 9 -64 Z', '#e6d3a0', C.ink, 1.4)),
    line('M45 76 L62 90', '#a0673d', 2.4), path('M60 88 L66 94 L70 90 L64 84 Z', '#e8d8b0', C.ink, 1)),
  'evo.benbyggnad': all(bg(), ...[22, 60, 98].map((cx) => circle(cx, 60, 34, '#eef3f7', null)),
    // human arm
    at(22, 30, 1, bone(0, 0, 22, 90, '#f4a24a', 4), bone(-2, 24, 20, 90, '#7ab0e0', 2.4), bone(2, 24, 20, 90, '#7ab0e0', 2.4), ...[-4, -1.5, 1.5, 4].map((fx) => bone(fx, 46, 9, 90, '#7ac06a', 1.6))),
    // bat wing
    at(60, 34, 1, path('M0 0 L-20 42 L-4 34 L6 44 L16 30 L20 10 Z', 'rgba(150,120,110,0.35)', C.ink, 0.8), bone(0, 0, 16, 70, '#f4a24a', 4), bone(5, 15, 16, 80, '#7ab0e0', 2.6), bone(8, 30, 14, 120, '#7ac06a', 1.6), bone(8, 30, 14, 85, '#7ac06a', 1.6), bone(8, 30, 14, 60, '#7ac06a', 1.6), bone(8, 30, 14, 30, '#7ac06a', 1.6)),
    // whale flipper
    at(98, 32, 1, path('M-8 6 C-12 30 -6 50 4 60 C10 48 10 24 6 4 Z', 'rgba(110,140,170,0.35)', C.ink, 1), bone(-1, 6, 10, 90, '#f4a24a', 4), bone(-3, 18, 10, 90, '#7ab0e0', 2.6), bone(1, 18, 10, 90, '#7ab0e0', 2.6), ...[-4, -1, 2, 5].map((fx, i) => bone(fx, 30, 18 + (i % 2) * 4, 90 - (fx * 2), '#7ac06a', 1.6)))),
  // ── Evolutionära träd ──────────────────────────────────────────────
  'evo.stamträd': all(treeBase(Object.keys(treeLines) as (keyof typeof treeLines)[], '#3f8a4a'), treeIcons()),
  'evo.gren.2': all(treeBase(['amn', 'mouse', 'sau', 'lizard', 'bird']), greyed(fishI(16, 30, 0.85), frogI(38, 31, 0.85)), mouseI(61, 31, 0.8), lizardI(85, 31, 0.75), bird(104, 30, 0.6, { body: '#5aa7e8', wing: '#2f6fb0', beak: 'thin', legs: false }),
    line('M50 14 L50 8 L114 8 L114 14', HL, 2.6)),
  'evo.gemensam-förfader': all(treeBase(['mouse', 'amn', 'sau', 'bird']), greyed(fishI(16, 30, 0.85), frogI(38, 31, 0.85), lizardI(85, 31, 0.75)), mouseI(61, 31, 0.8), bird(104, 30, 0.6, { body: '#5aa7e8', wing: '#2f6fb0', beak: 'thin', legs: false }),
    circle(82, 72, 5, HL, C.ink, 1.2), ring(82, 72, 11), ring(61, 30, 12), ring(104, 30, 12)),
  // ── Sexuell selektion ──────────────────────────────────────────────
  'evo.sexuell-selektion': all(bg('#eef6ea'), field(96),
    greyed(at(20, 84, 1, bird(0, 0, 0.9, { body: '#3a7a9a', tail: 8 })), at(48, 84, 1, bird(0, 0, 0.9, { body: '#3a7a9a', tail: 12 }))),
    at(84, 80, 1, ...range(7).map((i) => g(`rotate(${-80 + i * 22} -6 0)`, path('M-6 0 L-6 -34 C-10 -40 -2 -40 -6 -34', '#3a9a6a', C.ink, 0.9), circle(-6, -36, 3.2, '#2f6fb0', C.ink, 0.8), circle(-6, -36, 1.4, YEL, null))), bird(0, 0, 0.9, { body: '#2f6fb0', wing: '#2a5a8a', tail: 0 })),
    atF(58, 106, 1, bird(0, 0, 0.8, { body: '#a08060', wing: '#6a5a4a' })), heart(72, 94, 0.6), arrow(64, 100, 74, 92, HL, 1.6)),
  'evo.kräsen': all(bg(), ground, rect(4, 104, 112, 8, '#e8dcc6', 0, null),
    greyed(at(26, 106, 0.9, catD(0, 0, 1, '#d89a5a')), at(45, 106, 1, ellipse(0, -3, 8, 3, '#7ab0e0', C.ink, 1), ellipse(0, -5, 6, 1.6, '#a0673d', null))),
    atF(98, 106, 1.2, catD(0, 0, 1, '#d89a5a', { up: true })), at(66, 106, 1.1, ellipse(0, -3, 8, 3, '#e85a5a', C.ink, 1), ellipse(0, -5, 6, 1.6, '#a0673d', null)), line('M72 74 l-6 -4 M74 66 l-7 -1', C.ink, 1.2), cross(66, 88, 5)),
  'evo.paradisfågel': all(bg('#d8eccb'), path('M4 50 L116 44', 'none', BARK, 4), ellipse(14, 44, 10, 4, LEAF, C.ink, 0.8), ellipse(110, 38, 10, 4, LEAF, C.ink, 0.8),
    at(60, 40, 1.4, path('M-6 4 C-14 30 -26 50 -40 52 C-24 46 -14 28 -10 4 Z', '#f2c14e', C.ink, 0.8), path('M-4 4 C-8 30 -14 52 -22 58 C-12 50 -8 30 -6 4 Z', '#f4a24a', C.ink, 0.8),
      line('M-2 4 C0 24 8 40 4 54 M0 4 C6 20 14 34 18 50', '#3d3f4a', 0.8), circle(4, 54, 1.6, '#3d3f4a', null), circle(18, 50, 1.6, '#3d3f4a', null), bird(0, 0, 1, { body: '#6a3a2a', wing: '#4a2a1a', head: '#f2d24e', beak: 'thin', tail: 0 }), ellipse(11, -3, 3, 2, '#3ab07a', null))),
  'evo.ståtlig': all(bg('#f2ead0'), field(100, '#d9c27a'), at(68, 104, 1.3, lionD(0, 0, 1)),
    greyed(g('translate(16 104) scale(0.5) rotate(8)', lionD(0, 0, 1, { mane: false })))),
  // ── Människans evolution ───────────────────────────────────────────
  'evo.människoapa': all(bg('#e2efd8'), field(96, GRASS),
    at(30, 0, 1, hominid(0, 0.95, { posture: 'knuckle', col: '#3d3f4a', face: '#6a6a72' })), at(66, 0, 1, hominid(0, 0.78, { posture: 'knuckle', col: '#6e4a2c' })), at(96, 0, 1, hominid(0, 0.8, { posture: 'knuckle', col: '#c96a2a', face: '#d9a57c' })),
    path('M70 30 C84 26 100 26 116 30', 'none', BARK, 3), greyed(at(96, 24, 1, ellipse(0, 0, 9, 6, FUR, C.ink, 1), circle(10, -4, 4.6, FUR, C.ink, 1), circle(12, -3.4, 2.6, '#d9a57c', null), path('M-8 2 C-16 6 -16 18 -10 22 C-6 24 -4 20 -6 18', 'none', C.ink, 1.8))), cross(112, 12, 4)),
  'evo.förmänniska': all(bg('#f2e6c4'), field(100, '#d9c27a'), tuft(16, 100), tuft(104, 100), at(98, 100, 0.7, rect(-2, -40, 4, 40, BARK, 1, C.ink, 1), path('M-24 -40 C-16 -50 16 -50 24 -40 C14 -36 -14 -36 -24 -40 Z', LEAF, C.ink, 1.2)),
    at(56, 0, 1, hominid(0, 0.78, { posture: 'upright', col: '#7d5634', face: '#b8865a', brow: true })), ...[[24, 108], [32, 104], [14, 104]].map(([fx, fy]) => ellipse(fx!, fy!, 2.6, 1.4, '#a8935a', null))),
  'evo.neandertalare': all(bg('#dde8f0'), field(98, SNOW), mountains(92, 98, 0.8), at(54, 0, 1,
    hominid(0, 0.92, { posture: 'upright', col: '#5a3a2a', face: '#e0b088', brow: true, clothes: '#a8784a' })), line('M66 112 L62 30', '#a0673d', 2.4), path('M62 30 L60 22 L64 22 Z', '#7a8090', C.ink, 1),
    at(26, 108, 1, line('M-8 0 L8 0', '#6a4a2a', 3), path('M0 -2 C-6 -2 -6 -10 -2 -16 C-1 -12 1 -12 1 -16 C5 -12 6 -4 0 -2 Z', '#f28a2a', C.ink, 1))),
  'evo.homo-sapiens': all(bg(), ground, greyed(at(20, 0, 1, hominid(0, 0.7, { posture: 'upright', brow: true })), at(48, 0, 1, hominid(0, 0.82, { posture: 'upright', brow: true }))),
    F({ x: 88, h: 0.96, top: '#5aa7e8', bottom: '#2f4a7a', mood: 'smile' }), ring(88, 62, 24, 50)),
  'evo.upprätt': all(bg('#f2e6c4'), field(104, '#d9c27a'), greyed(at(30, -8, 1, hominid(0, 0.9, { posture: 'knuckle' }))),
    at(80, -8, 1, hominid(0, 0.95, { posture: 'upright', col: '#7d5634', face: '#d9a57c' })), arrow(100, 100, 100, 30, HL, 2.6)),
  'evo.hjärnvolym': all(bg(), ...[[22, 0.85, 'low', '400'], [60, 1, 'brow', '900'], [98, 1.15, 'high', '1350']].map(([sx, ss, kind, n]) =>
    all(skullP(sx as number, 64, ss as number, kind as 'low' | 'brow' | 'high', '#f2a0b0'), T0(n as string, 8, sx as number, 96))), line('M10 102 L110 102', C.grey2, 1.2), arrow(20, 30, 100, 18, HL, 2.4)),
  'evo.stenverktyg': all(bg('#efe6d2'), field(98, '#c9b080'), handAxe(56, 58, 2.2, -12), ...[[90, 100, 0.5, 30], [100, 106, 0.4, -50], [22, 104, 0.5, 70]].map(([fx, fy, fs, fr]) => handAxe(fx!, fy!, fs!, fr!, '#9aa0aa')),
    path('M84 76 C88 66 100 66 104 74 L102 84 L88 86 Z', '#7a8090', C.ink, 1.3), line('M90 78 L98 74', '#565b64', 0.9)),
  'evo.grottmålning': all(rect(4, 4, 112, 108, '#5a4a3e', 3, null), path('M8 20 C30 10 90 10 112 20 L112 108 L8 108 Z', '#c9a078', C.ink, 1.4), path('M18 96 C40 90 80 92 104 98 L104 108 L18 108 Z', '#8a7058', null),
    at(46, 48, 1, path('M-22 0 C-22 -10 -6 -14 6 -12 C12 -18 22 -16 24 -10 L20 -6 C22 0 20 6 16 8 L16 20 L12 20 L10 10 L-10 10 L-14 20 L-18 20 L-18 8 C-22 6 -22 2 -22 0 Z', '#9a3a1a', null), line('M-22 -2 C-26 0 -28 6 -26 10', '#9a3a1a', 2.4), path('M12 -14 L10 -20 L14 -16 Z', '#9a3a1a', null)),
    at(86, 76, 0.7, path('M-20 0 C-20 -12 4 -16 12 -10 C20 -10 22 -4 20 2 L18 14 L14 14 L12 6 L-10 6 L-12 14 L-16 14 Z', '#2e2e36', null), path('M10 -10 L14 -18 L16 -10 Z', '#2e2e36', null)),
    ...[[90, 34], [24, 80]].map(([hx, hy]) => at(hx!, hy!, 1, path('M-5 6 L-5 -2 C-5 -6 -3 -6 -3 -2 L-3 -8 C-3 -11 -1 -11 -1 -8 L-1 -9 C-1 -12 1 -12 1 -9 L1 -7 C1 -10 3 -10 3 -7 L3 0 L6 -3 C8 -4 9 -2 7 0 L3 6 Z', '#c0402a', null)))),
};

/** Digits as small centred text (numbers only, never words). */
function T0(s: string, size: number, x = 0, y = 0): Svg {
  return `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${C.ink}" text-anchor="middle">${s}</text>`;
}
