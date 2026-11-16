/**
 * Natur & geografi → Djurvärlden → Insekter & andra ryggradslösa, 2731–2737 (0.44): butterflies and moths, bees and
 * bumblebees, ants and colonies, beetles, spiders and mites, worms and snails, metamorphosis and life cycles.
 * Insects are drawn large and concrete with the features that tell close kinds apart made explicit: the butterfly's
 * club antennae and bright open wings against the moth's feathery antennae and dull roof-shaped wings; the slim
 * golden honeybee, the round furry black-yellow-white bumblebee and the bright yellow wasp with its narrow waist;
 * the red-and-black wood ant on its needle mound, the big black carpenter ant in wood; the ladybird's red spotted
 * dome, the stag beetle's antler jaws and the cockchafer's fan antennae; the spider's eight legs and two body parts,
 * the cross spider's white cross, the harvestman's tiny body on long legs and the flat blood-sucking tick. Life-cycle
 * words are shown as stages with arrows and the stage a word names framed in orange. An orange highlight (ring,
 * outline or arrow) marks the part a word names; concepts are small scenes with a grey reference panel that lacks
 * the property. Digits only; no words, no letters, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#d4e8f5';
const NIGHT = '#2f3b5c';
const GRASS = '#a6cf72';
const GRASS2 = '#7fb356';
const FOREST = '#3f8a4f';
const SOIL = '#8a6a4a';
const SOIL2 = '#6b4f36';
const WATER = '#5d9fd0';
const GREY = '#b9bec4';
const GREY2 = '#9ea4ab';
const LEAF = '#6fb35a';
const LEAF2 = '#4f9443';
const BARK = '#7a5838';
const HONEY = '#e9a825';
const WAX = '#f3d27a';
const ROCKCOL = '#9a9590';
const WING = 'rgba(226,240,250,0.8)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);
const flipX = (...k: Svg[]) => g('scale(-1 1)', ...k);
/** Draw a left half and its mirror image. */
const both = (...k: Svg[]) => all(...k, flipX(...k));
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const panel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, C.white, 3, C.ink, 1.2), k.join(''));
const greyPanel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, '#eceef0', 3, GREY2, 1.2), k.join(''));
const cross = (x: number, y: number, r = 6) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, C.red, 2.6);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const sunS = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.75} ${r} 0 1 1 ${x} ${y - r} Z`, '#f6e7a8', C.ink, 1);
const starDot = (x: number, y: number) => circle(x, y, 0.9, '#fff6c8', null);
const grassTufts = (y: number, xs: number[], col: string = GRASS2) => line(xs.map((x) => `M${x} ${y} l-2 -5 M${x + 2} ${y} l0 -6 M${x + 4} ${y} l2 -5`).join(' '), col, 1.3);
const flower = (x: number, y: number, s = 1, col: string = C.pink, mid: string = C.yellow, stemLen = 0) => at(x, y, s, stemLen ? line(`M0 0 L0 ${stemLen}`, LEAF2, 2) : '', ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return circle(f1(Math.cos(a) * 5), f1(Math.sin(a) * 5), 4, col, C.ink, 0.9); }), circle(0, 0, 3.4, mid, C.ink, 0.9));
const leafShape = (x: number, y: number, s = 1, a = 0, col: string = LEAF) => rot(x, y, a, s, path('M-14 0 C-8 -9 8 -9 14 0 C8 9 -8 9 -14 0 Z', col, C.ink, 1.1), line('M-13 0 L13 0', LEAF2, 0.9));
const pine = (x: number, y: number, s = 1, col: string = FOREST) => at(x, y, s, rect(-1.5, -5, 3, 5, C.brown, 0, C.ink, 0.8), path('M0 -30 L9 -5 L-9 -5 Z', col, C.ink, 1.1), path('M0 -30 L6 -14 L-6 -14 Z', col, null));
const trunk = (x: number, w: number, col: string = BARK) => all(rect(x, 4, w, 108, col, 0, C.ink, 1.2), line(range(7).map((i) => `M${x + 3 + (i % 3) * (w / 3)} ${10 + i * 15} l2 8`).join(' '), shade(col, 0.75), 1.2));
/** Small stem of grass with a seed head. */
const blade = (x: number, y: number, h: number, col: string = GRASS2) => line(`M${x} ${y} C${x - 2} ${y - h / 2} ${x + 2} ${y - h * 0.8} ${x} ${y - h}`, col, 1.6);
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16), c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('');
};
const hlBox = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const dropS = (x: number, y: number, s = 1, col: string = HONEY) => at(x, y, s, path('M0 -5 C3 -1 4 2 0 4 C-4 2 -3 -1 0 -5 Z', col, C.ink, 0.8));

// ── Insect parts ─────────────────────────────────────────────────────
/** Mirrored legs: each entry is a hip point (left side) and two segment vectors. */
const legs = (ls: [number, number, number, number, number, number][], col: string = C.ink, sw = 1.3) =>
  line(ls.map(([x, y, a, b, c, d]) => `M${x} ${y} l${a} ${b} l${c} ${d} M${-x} ${y} l${-a} ${b} l${-c} ${d}`).join(' '), col, sw);
/** Mirrored antennae from (x, y) curving by (dx, dy); kind club / feather / thread / elbow. */
const antennae = (x: number, y: number, dx: number, dy: number, kind: 'club' | 'feather' | 'thread' | 'fan' = 'thread', col: string = C.ink) => {
  const d = `M${x} ${y} Q${f1(x + dx * 0.2)} ${f1(y + dy * 0.7)} ${x + dx} ${y + dy}`;
  const side = (): Svg => {
    if (kind === 'club') return all(line(d, col, 1), ellipse(x + dx, y + dy, 1.4, 2, col, null));
    if (kind === 'fan') return all(line(d, col, 1), path(`M${x + dx} ${y + dy} l-4 -3 l1 4 l-3 0 Z`, col, null));
    if (kind === 'feather') return all(line(d, col, 1), line(range(5).map((i) => { const t = 0.3 + i * 0.15, px = f1(x + dx * t), py = f1(y + dy * t); return `M${px} ${py} l-2.4 1.2 M${px} ${py} l2 -1.6`; }).join(' '), col, 0.7));
    return line(d, col, 1);
  };
  return both(side());
};
const wingPair = (x: number, y: number, rx: number, ry: number, a: number, fill: string = WING) => both(rot(x, y, a, 1, ellipse(0, 0, rx, ry, fill, C.ink, 0.9), line(`M0 ${-ry * 0.2} L${f1(rx * 0.7)} 0`, '#9fb7c7', 0.6)));
/** Fuzzy outline: short radial strokes around an ellipse. */
const fuzz = (cx: number, cy: number, rx: number, ry: number, col: string, n = 18) => line(range(n).map((i) => { const a = (i / n) * Math.PI * 2; return `M${f1(cx + Math.cos(a) * rx)} ${f1(cy + Math.sin(a) * ry)} l${f1(Math.cos(a) * 1.8)} ${f1(Math.sin(a) * 1.8)}`; }).join(' '), col, 1.2);

// ── Butterflies and moths (top view, head up) ────────────────────────
type Bf = { fw: string; hw?: string; spots?: [number, number, number, string][]; eyes?: boolean; tips?: string; dot?: string; ant?: 'club' | 'feather'; body?: string; shape?: 'round' | 'leaf'; grey?: boolean };
function bfly(o: Bf): Svg {
  const gr = o.grey, fw = gr ? GREY : o.fw, hw = gr ? GREY2 : o.hw ?? o.fw, body = gr ? GREY2 : o.body ?? '#3a3030', sw = 1.2;
  const F = o.shape === 'leaf' ? 'M-1 -3 C-8 -22 -22 -30 -32 -30 C-30 -18 -20 -4 -1 0 Z' : 'M-1 -3 C-10 -24 -30 -30 -34 -20 C-34 -10 -20 -2 -1 0 Z';
  const H = o.shape === 'leaf' ? 'M-1 0 C-16 0 -28 6 -26 18 C-24 22 -8 16 -1 4 Z' : 'M-1 0 C-16 0 -28 8 -26 18 C-20 26 -6 16 -1 4 Z';
  const left: Svg[] = [path(H, hw, C.ink, sw), path(F, fw, C.ink, sw)];
  if (o.tips && !gr) left.push(path('M-26 -27 C-31 -26 -34 -22 -34 -20 C-31 -16 -27 -19 -24 -22 Z', o.tips, null));
  if (o.eyes && !gr) left.push(circle(-24, -19, 5.5, '#f2d24a', C.ink, 0.8), circle(-24, -19, 3.6, '#3b5fb5', null), circle(-24, -19, 1.8, C.ink, null), circle(-19, 12, 5, C.ink, '#cfd6e0', 0.8), circle(-19, 12, 3, '#6b7fb0', null), circle(-19, 12, 1.4, C.white, null));
  if (o.dot && !gr) left.push(circle(-17, -12, 1.6, o.dot, null), circle(-14, 8, 1.4, o.dot, null));
  for (const [x, y, r, c] of o.spots ?? []) left.push(circle(x, y, r, gr ? GREY2 : c, null));
  const fe = o.ant === 'feather';
  return all(antennae(-1.2, -14, -6, -12, o.ant ?? 'club', gr ? GREY2 : C.ink), both(...left), ellipse(0, 2, 2.4, fe ? 15 : 14, body, C.ink, 1), circle(0, -13, 2.6, body, C.ink, 1), fe ? fuzz(0, 0, 2.6, 12, body, 14) : '');
}
/** Moth at rest, wings swept back like a roof, feathery antennae. */
function moth(col = '#a08364', col2 = '#6f5a44', grey = false): Svg {
  const c1 = grey ? GREY : col, c2 = grey ? GREY2 : col2;
  return all(antennae(-1.4, -12, -8, -10, 'feather', grey ? GREY2 : C.ink),
    both(path('M-2 -8 C-12 -6 -24 12 -22 24 C-14 26 -4 18 -1 10 Z', c1, C.ink, 1.2), line('M-8 0 C-12 8 -16 14 -18 20 M-5 4 l-6 2 M-10 12 l-6 1', c2, 1.2), circle(-10, 6, 1.6, c2, null)),
    ellipse(0, 0, 3.2, 12, c2, C.ink, 1), fuzz(0, -6, 3.4, 5, c2, 12), circle(0, -11, 3, c2, C.ink, 1));
}
/** Butterfly from the side with wings folded up, facing right; ground at y=0. */
function bflySide(col: string, under: string = col, proboscis = false): Svg {
  return all(line('M-4 0 l-2 -5 M0 0 l0 -5 M4 0 l2 -5', C.ink, 1), path('M2 -6 C-6 -22 0 -36 16 -36 C16 -24 12 -12 6 -6 Z', col, C.ink, 1.2), path('M0 -6 C-12 -10 -14 -20 -6 -22 C-2 -16 0 -12 4 -7 Z', under, C.ink, 1.2),
    ellipse(2, -6, 10, 2.6, '#3a3030', C.ink, 1), circle(13, -7, 2.6, '#3a3030', C.ink, 1), line('M14 -9 C16 -14 18 -16 20 -18', C.ink, 1), ellipse(20.4, -18.4, 1.2, 1.8, C.ink, null),
    proboscis ? line('M15 -6 C20 -4 22 0 22 4', C.ink, 1) : '');
}

// ── Bees and wasps (top view, head up) ───────────────────────────────
type BeeKind = 'honey' | 'bumble' | 'wasp' | 'drone' | 'queen' | 'wild' | 'grey';
function bee(k: BeeKind = 'honey'): Svg {
  const legsBee = legs([[3, -4, -5, 3, -2, 5], [3, -2, -6, 6, -1, 5], [3, 0, -5, 10, 1, 6]], C.ink, 1.2);
  if (k === 'bumble') return all(legs([[4, -4, -7, 3, -2, 5], [4, -1, -8, 7, -1, 6], [4, 2, -7, 12, 1, 6]], C.ink, 1.4), wingPair(-8, -2, 9, 4, -25),
    fuzz(0, 9, 9, 10, C.ink, 22), ellipse(0, 9, 9, 10, C.ink, C.ink, 1), path('M-9 6 C-6 2 6 2 9 6 L9 8 C6 5 -6 5 -9 8 Z', '#f2c94c', null), path('M-6 15 C-3 19 3 19 6 15 C5 19 2 20 0 20 C-2 20 -5 19 -6 15 Z', C.white, null),
    fuzz(0, -4, 7, 6, C.ink, 16), circle(0, -4, 7, '#f2c94c', C.ink, 1), ellipse(0, -3, 5, 3.6, C.ink, null), circle(0, -12, 4, C.ink, C.ink, 1), antennae(-1.5, -15, -4, -6, 'thread'));
  if (k === 'wasp') return all(legs([[2.4, -5, -5, 3, -2, 5], [2.4, -3, -6, 6, -1, 5], [2.4, -1, -5, 10, 1, 6]], C.ink, 1.1),
    path('M0 2 C-5 4 -5.5 12 -4 16 C-2.5 21 2.5 21 4 16 C5.5 12 5 4 0 2 Z', '#f5c400', C.ink, 1), path('M-5 7 L5 7 L5 9 L0 11 L-5 9 Z M-5 13 L5 13 L4 15 L0 17 L-4 15 Z', C.ink, null), path('M-1 19 L0 23 L1 19 Z', C.ink, null),
    both(rot(-4, -3, -8, 1, path('M0 0 C-3 4 -4 14 -2 20 C0 18 1 8 1 0 Z', 'rgba(205,190,140,0.75)', C.ink, 0.8))),
    circle(0, 0.6, 1, C.ink, null), ellipse(0, -4, 4, 4.4, C.ink, C.ink, 1), line('M-3 -6 l1.5 2 M3 -6 l-1.5 2', '#f5c400', 1.2), circle(0, -11, 3.6, '#f5c400', C.ink, 1), path('M-3 -12 C-3 -15 3 -15 3 -12 C1 -13 -1 -13 -3 -12 Z', C.ink, null), antennae(-1.4, -14, -4, -6, 'thread'));
  const pal = k === 'grey' ? { th: GREY, ab: GREY, st: GREY2, h: GREY2 } : k === 'wild' ? { th: C.ink, ab: '#c8632f', st: '#a24e24', h: C.ink } : { th: '#8a5a2b', ab: '#d99a2b', st: '#5a3a1e', h: '#3a2a1e' };
  const ry = k === 'queen' ? 13 : k === 'drone' ? 9 : 8, rx = k === 'drone' ? 6.2 : 5, cy = ry - 1;
  return all(legsBee, wingPair(-6, -2, k === 'queen' ? 6.5 : 8, 3.6, -25),
    ellipse(0, cy, rx, ry, pal.ab, C.ink, 1), line(range(k === 'queen' ? 4 : 3).map((i) => `M${-rx + 0.6} ${cy - ry * 0.45 + i * (ry * 0.45)} Q0 ${cy - ry * 0.3 + i * (ry * 0.45)} ${rx - 0.6} ${cy - ry * 0.45 + i * (ry * 0.45)}`).join(' '), pal.st, 1.8),
    k === 'honey' || k === 'queen' ? path(`M-0.8 ${cy + ry - 0.5} L0 ${cy + ry + 3} L0.8 ${cy + ry - 0.5} Z`, C.ink, null) : '',
    fuzz(0, -4, 5, 4.6, pal.th, 14), circle(0, -4, 5, pal.th, C.ink, 1),
    circle(0, -11, 3.6, pal.h, C.ink, 1), k === 'drone' ? both(ellipse(-2.4, -12, 2.4, 3, '#1e1a16', null)) : '', antennae(-1.4, -14, -4, -6, 'thread'));
}

// ── Ants, aphids and termites (side view facing right, feet at y=0) ──
type AntO = { head?: string; thorax?: string; gaster?: string; wings?: boolean; grey?: boolean; load?: Svg };
function antS(o: AntO = {}): Svg {
  const dk = o.grey ? GREY2 : '#2b2420', h = o.grey ? GREY2 : o.head ?? dk, t = o.grey ? GREY2 : o.thorax ?? dk, ga = o.grey ? GREY : o.gaster ?? dk, lc = o.grey ? GREY2 : C.ink;
  return all(line('M2 -7 L-3 -3 L-6 0 M4 -7 L4 -3 L2 0 M6 -7 L10 -3 L13 0', lc, 1.3), line('M14 -11 L16 -16 L22 -15', lc, 1),
    o.wings ? all(ellipse(-6, -15, 11, 3.6, WING, C.ink, 0.8, ), ellipse(-4, -13, 9, 2.8, WING, C.ink, 0.7)) : '',
    ellipse(-9, -7, 6.5, 5, ga, lc, 1), circle(-1.8, -7, 1.6, t, null), ellipse(4.5, -8, 5.5, 3, t, lc, 1), circle(13, -9, 4, h, lc, 1), line('M16.5 -8 l3 1 l-2 1.5', lc, 1), circle(14, -10, 0.8, o.grey ? GREY : C.white, null),
    o.load ?? '');
}
function aphid(col = '#7cc44f'): Svg {
  return all(line('M-2 0 l-2 3 M1 0 l0 3 M4 0 l2 3', C.ink, 0.9), path('M-8 -2 C-8 -8 2 -9 6 -5 C8 -3 7 0 4 0 L-6 0 C-8 0 -8 -1 -8 -2 Z', col, C.ink, 1), line('M-5 -6 l-3 -3 M-3 -7 l-2 -4', C.ink, 0.9), circle(5.5, -3.5, 0.7, C.ink, null), line('M6 -5 C9 -9 11 -10 14 -10', C.ink, 0.8));
}
function termite(): Svg {
  return all(line('M2 -5 L-2 -2 L-5 0 M4 -5 L4 -2 L2 0 M6 -5 L10 -2 L13 0', C.ink, 1.2), ellipse(-7, -5, 9, 4.4, '#f1e6c8', C.ink, 1), line('M-12 -7 l0 4 M-8 -8 l0 6 M-4 -8 l0 6', '#d8c9a4', 0.8),
    ellipse(5, -5.5, 4.6, 3.2, '#efe2c0', C.ink, 1), circle(12, -6, 3.6, '#c98a3c', C.ink, 1), line('M15 -5 l3 1 M15 -7 l3 -1', C.ink, 1), line('M13 -9 C15 -12 18 -13 21 -12', C.ink, 0.9));
}

// ── Beetles (top view, head up) ──────────────────────────────────────
type Bt = { col: string; col2?: string; spots?: [number, number, number][]; round?: boolean; shine?: boolean; jaws?: boolean; fan?: boolean; grey?: boolean; open?: boolean; rx?: number; ry?: number; head?: string };
function beetle(o: Bt): Svg {
  const gr = o.grey, c = gr ? GREY : o.col, c2 = gr ? GREY2 : o.col2 ?? shade(o.col, 0.6), lc = gr ? GREY2 : C.ink;
  const rx = o.rx ?? (o.round ? 11 : 9), ry = o.ry ?? (o.round ? 10.5 : 13), cy = o.round ? 4 : 6;
  const elytra = o.open
    ? all(wingPair(-8, 6, 13, 5, -20), both(rot(-3, -3, 28, 1, path(`M0 0 C-${rx} 2 -${rx} ${ry * 1.4} 0 ${ry * 1.7} Z`, c, lc, 1.1))))
    : all(ellipse(0, cy, rx, ry, c, lc, 1.2), line(`M0 ${cy - ry} L0 ${cy + ry}`, lc, 1));
  return all(legs([[4, -5, -7, -2, -3, -5], [5, 0, -9, 3, -2, 5], [5, 5, -8, 8, 0, 6]], lc, 1.4),
    o.fan ? antennae(-2, -11, -4, -5, 'fan', lc) : o.jaws ? '' : antennae(-2, -11, -5, -7, 'thread', lc),
    elytra, ...(o.spots ?? []).map(([x, y, r]) => both(circle(x, y, r, gr ? GREY2 : C.ink, null))),
    o.shine && !gr ? all(path(`M-${rx * 0.55} ${cy - ry * 0.6} C-${rx * 0.75} ${cy - ry * 0.2} -${rx * 0.7} ${cy + ry * 0.3} -${rx * 0.5} ${cy + ry * 0.55}`, 'none', 'rgba(255,255,255,0.75)', 2), path(`M${rx * 0.4} ${cy - ry * 0.55} C${rx * 0.55} ${cy - ry * 0.3} ${rx * 0.55} ${cy} ${rx * 0.45} ${cy + ry * 0.2}`, 'none', 'rgba(255,255,255,0.55)', 1.4)) : '',
    ellipse(0, -5, o.round ? 7 : 6, 4.2, c2, lc, 1.1), o.head ? both(path('M-5 -6 C-5 -8 -3 -8.5 -2 -7 Z', o.head, null)) : '',
    o.jaws ? both(path('M-2 -11 C-6 -16 -9 -22 -6 -30 C-5 -25 -3 -22 -2 -24 C-1 -20 -3 -16 -1 -12 Z', gr ? GREY2 : '#8a3b22', lc, 1.1), line('M-5 -22 l-2.4 -0.6', lc, 0.9)) : '',
    ellipse(0, -10, o.jaws ? 5 : 3.6, 2.8, c2, lc, 1));
}
const ladybird = (grey = false) => beetle({ col: grey ? GREY : '#d8352a', col2: grey ? GREY2 : '#1f1d22', round: true, spots: [[-5, 0, 2.2], [-6, 9, 2], [-2.6, 13, 1.6]], grey, head: grey ? undefined : C.white, shine: !grey });

// ── Spiders, harvestmen, ticks and mites (top view, head up) ─────────
function spider(col = '#6b4a32', crossMark = false, grey = false): Svg {
  const c = grey ? GREY : col, lc = grey ? GREY2 : C.ink;
  return all(legs([[3, -7, -8, -6, -5, -10], [3.5, -5, -11, -3, -7, -4], [3.5, -3, -11, 2, -6, 6], [3, -1, -9, 6, -3, 11]], lc, 1.5),
    ellipse(0, -4, 4.4, 5, shade(c, 0.8), lc, 1.1), ellipse(0, 8, 7, 8.5, c, lc, 1.2),
    crossMark && !grey ? line('M0 2 L0 13 M-4 6 L4 6', C.white, 1.8) + both(circle(-3, 10, 0.9, C.white, null), circle(-2.5, 3, 0.8, C.white, null)) : '',
    both(circle(-1.4, -7.4, 0.8, grey ? GREY : C.ink, null)), line('M-1 -9 l-1 -2 M1 -9 l1 -2', lc, 1.2));
}
function harvestman(grey = false): Svg {
  const lc = grey ? GREY2 : '#4a3a2a';
  return all(line(range(4).map((i) => { const a = -40 + i * 26; const r = (a * Math.PI) / 180; return `M-2 0 Q${f1(-2 - Math.cos(r) * 14)} ${f1(-10 + i * 4)} ${f1(-2 - Math.cos(r) * 30)} ${f1(Math.sin(r) * 6 + 16)} M2 0 Q${f1(2 + Math.cos(r) * 14)} ${f1(-10 + i * 4)} ${f1(2 + Math.cos(r) * 30)} ${f1(Math.sin(r) * 6 + 16)}`; }).join(' '), lc, 1),
    ellipse(0, 0, 4.4, 3.4, grey ? GREY : '#9a7a52', grey ? GREY2 : C.ink, 1), circle(0, -1.6, 0.9, grey ? GREY2 : C.ink, null));
}
function tick(full = false, grey = false): Svg {
  const c = grey ? GREY : full ? '#7d5a5a' : '#6b2a1e', lc = grey ? GREY2 : C.ink;
  return all(legs([[2.4, -4, -5, -3, -3, -4], [3, -2.5, -7, -1, -3, 1], [3, -1, -7, 2, -2, 5], [2.6, 0.5, -5, 5, -1, 6]], lc, 1.2),
    full ? ellipse(0, 5, 8, 9.5, c, lc, 1.1) : path('M0 -5 C-6 -5 -7 4 -5 9 C-3 13 3 13 5 9 C7 4 6 -5 0 -5 Z', c, lc, 1.1),
    path('M0 -5 C-4 -5 -4.5 0 -3 2 C-1 3 1 3 3 2 C4.5 0 4 -5 0 -5 Z', grey ? GREY2 : '#2b1a14', null), path('M-1.6 -5 L-1 -9 L1 -9 L1.6 -5 Z', grey ? GREY2 : '#2b1a14', lc, 0.8));
}

// ── Worms, snails and slugs (side view facing right, ground at y=0) ─
function snail(shell = '#c9a26a', body = '#cdb8a0', s = 1): Svg {
  return at(0, 0, s, path('M-22 0 C-22 -5 -10 -6 6 -6 C14 -6 16 -12 18 -14 C22 -12 24 -6 22 0 Z', body, C.ink, 1.2), line('M17 -13 L20 -24 M19 -12 L26 -20', C.ink, 1.2), circle(20, -24, 1.4, C.ink, null), circle(26, -20, 1.4, C.ink, null), line('M22 -4 l4 1', C.ink, 1),
    circle(-4, -14, 12, shell, C.ink, 1.3), path('M-4 -14 m0 -2 a2 2 0 1 1 -2 2 a4.5 4.5 0 1 1 4.5 4.5 a7.5 7.5 0 1 1 -7.5 -7.5 a10.5 10.5 0 0 1 10.5 -2', 'none', shade(shell, 0.65), 1.4));
}
function slug(col = '#c9662f', s = 1): Svg {
  return at(0, 0, s, path('M-28 0 C-26 -6 -14 -9 2 -9 C14 -9 18 -14 22 -14 C27 -13 28 -6 26 0 Z', col, C.ink, 1.2), path('M2 -9 C6 -16 18 -16 22 -12 C18 -9 10 -8 2 -9 Z', shade(col, 0.85), C.ink, 1), circle(10, -11, 1.4, shade(col, 0.6), null),
    line('M22 -13 L24 -24 M24 -12 L31 -20', C.ink, 1.2), circle(24, -24, 1.4, C.ink, null), circle(31, -20, 1.4, C.ink, null), line('M-20 -4 l6 0 M-10 -6 l6 0 M-14 -2 l5 0', shade(col, 0.7), 0.8));
}
/** Earthworm along a path in local coordinates. */
const wormPath = (d: string, col = '#d98a8a', w = 4.4) => all(line(d, C.ink, w + 1.6), line(d, col, w), line(d, shade(col, 0.82), w * 0.25, '1 2.4'));

// ── Larvae, pupae and other insects (side view facing right) ─────────
function caterpillar(col = '#7cc44f', grey = false, n = 7): Svg {
  const c = grey ? GREY : col, lc = grey ? GREY2 : C.ink;
  return all(...range(n).map((i) => all(circle(-n * 3.4 + i * 5.6, -4.6, 4.6, c, lc, 1), !grey ? circle(-n * 3.4 + i * 5.6, -6.4, 0.9, '#2f6b2a', null) : '', i < n - 1 && (i < 3 || i > 4) ? line(`M${-n * 3.4 + i * 5.6} 0 l0 1.4`, lc, 1.4) : '')),
    circle(-n * 3.4 + n * 5.6, -6, 4.4, grey ? GREY2 : shade(col, 0.75), lc, 1), circle(-n * 3.4 + n * 5.6 + 1.6, -7, 0.8, grey ? GREY : C.ink, null));
}
function chrysalis(col = '#8fbf5a', grey = false): Svg {
  const c = grey ? GREY : col, lc = grey ? GREY2 : C.ink;
  return all(line('M0 -2 L0 3', lc, 1.4), path('M0 3 C-5 5 -6 14 -4 20 C-3 25 -1 27 0 28 C1 27 3 25 4 20 C6 14 5 5 0 3 Z', c, lc, 1.2), line('M-3 10 C-1 12 1 12 3 10 M-3.5 15 C-1 17 1 17 3.5 15', grey ? GREY2 : shade(col, 0.7), 0.9), !grey ? both(circle(-2, 7, 0.8, C.gold, null)) : '');
}
const egg = (grey = false) => all(...[[-3, 0], [3, 0], [0, -4]].map(([x, y]) => ellipse(x!, y!, 2.4, 3, grey ? GREY : '#f4efd8', grey ? GREY2 : C.ink, 0.9)));
function grasshopper(col = '#6fb33f', wings = true, grey = false): Svg {
  const c = grey ? GREY : col, lc = grey ? GREY2 : C.ink, d = grey ? GREY2 : shade(col, 0.7);
  return all(line('M8 -6 L10 -2 L8 0 M4 -6 L4 -2 L2 0', lc, 1.1), path('M-4 -8 L-14 -18 L-24 0', 'none', lc, 3.4), path('M-4 -8 L-14 -18 L-24 0', 'none', c, 2), path('M-2 -8 C-4 -14 -12 -18 -16 -18 C-14 -14 -8 -10 -2 -6 Z', d, lc, 1),
    path('M-20 -6 C-18 -11 0 -12 10 -10 C12 -8 12 -4 10 -3 C0 -2 -16 -2 -20 -6 Z', c, lc, 1.1), wings ? path('M-22 -7 C-14 -12 0 -12 6 -10 L4 -7 C-6 -7 -16 -6 -22 -7 Z', d, lc, 0.9) : '',
    path('M8 -11 C14 -13 18 -10 17 -4 C16 -2 12 -2 10 -3 Z', c, lc, 1.1), circle(14, -9, 1.6, grey ? GREY2 : '#3a2a1e', null), line('M15 -12 C18 -22 24 -26 30 -28', lc, 0.9));
}
function dragonfly(col = '#3f8fd0', grey = false): Svg {
  const c = grey ? GREY : col, lc = grey ? GREY2 : C.ink;
  return all(both(rot(-2, -6, -8, 1, ellipse(-14, 0, 15, 3.4, WING, lc, 0.8)), rot(-2, -1, 12, 1, ellipse(-13, 0, 13, 3.4, WING, lc, 0.8))),
    path('M-1.6 -2 L-1 30 C-1 32 1 32 1 30 L1.6 -2 Z', c, lc, 1), line(range(6).map((i) => `M-1.2 ${4 + i * 4.4} l2.4 0`).join(' '), lc, 0.8),
    ellipse(0, -4, 3, 4.4, shade(c, 0.8), lc, 1), both(circle(-2.4, -9.6, 2.6, grey ? GREY2 : '#2f6fae', lc, 0.9)));
}
function mayfly(): Svg {
  return all(line('M-4 0 L-2 -4 M0 0 L1 -4 M8 0 L6 -4', C.ink, 1), line('M-14 -6 C-24 -10 -32 -18 -40 -30 M-14 -6 C-26 -8 -36 -12 -44 -20 M-14 -6 C-26 -6 -36 -6 -44 -8', C.ink, 0.8),
    path('M-2 -6 C-4 -16 -2 -28 6 -36 C8 -26 8 -14 6 -6 Z', WING, C.ink, 0.9), line('M2 -8 L4 -32 M0 -8 L0 -24', '#9fb7c7', 0.6), path('M-14 -6 C-8 -8 2 -8 10 -6 C10 -4 2 -3 -14 -5 Z', '#c9a86a', C.ink, 1),
    circle(11, -6, 2.4, '#8a6a3a', C.ink, 0.9), line('M10 -5 L16 -10 M10 -5 L18 -4', C.ink, 0.9));
}
function fly(grey = false): Svg {
  const lc = grey ? GREY2 : C.ink, b = grey ? GREY : '#5a5d63';
  return all(legs([[3, -3, -6, -2, -2, -4], [3, 0, -7, 3, -1, 4], [3, 3, -6, 6, 0, 5]], lc, 1.2), both(rot(-3, 0, -28, 1, ellipse(-8, 0, 9, 4, grey ? '#e6e8ea' : 'rgba(220,232,240,0.8)', lc, 0.9))),
    ellipse(0, 8, 5, 7, shade(b, 0.9), lc, 1), ellipse(0, -1, 5, 4.6, b, lc, 1), line('M-2 -4 L-2 2 M2 -4 L2 2', grey ? GREY2 : '#2f3034', 1), ellipse(0, -7, 4.4, 3, b, lc, 1), both(ellipse(-3, -7.5, 2.6, 3, grey ? GREY2 : '#b33a2a', lc, 0.8)));
}
function mosquito(): Svg {
  return all(line('M2 -8 L-4 -16 L-10 0 M4 -8 L4 -18 L8 0 M6 -8 L14 -16 L18 0', C.ink, 0.9), path('M-20 -10 C-14 -12 -2 -10 2 -8 C0 -6 -14 -6 -20 -10 Z', '#8a7a6a', C.ink, 0.9), line('M-18 -10 l0 2 M-14 -10 l0 2 M-10 -9 l0 2', '#5a4a3a', 0.6),
    path('M0 -10 C-6 -18 -14 -22 -22 -20 C-14 -16 -6 -12 0 -9 Z', WING, C.ink, 0.7), ellipse(4, -9, 4, 2.6, '#6a5a4a', C.ink, 0.9), circle(9, -9, 2.2, '#4a3a2a', C.ink, 0.8), line('M10 -8 L16 2', C.ink, 1), line('M10 -10 C14 -14 16 -16 18 -18', C.ink, 0.6));
}
function dragonNymph(): Svg {
  return all(line('M-4 -2 L-10 2 L-14 2 M0 -2 L-2 3 L-4 4 M4 -2 L8 3 L12 3', C.ink, 1.2), path('M-26 -4 C-24 -9 -10 -9 0 -7 L0 -1 C-10 0 -24 0 -26 -4 Z', '#7a6a42', C.ink, 1.1), line('M-22 -6 l0 4 M-17 -7 l0 5 M-12 -7 l0 6', '#5a4c2e', 0.8),
    ellipse(5, -4, 6, 4, '#7a6a42', C.ink, 1.1), path('M2 -7 L-6 -11 L-2 -7 Z', '#6a5a36', C.ink, 0.8), circle(12, -4, 4, '#857548', C.ink, 1.1), both(circle(-2, 0, 0, C.ink, null)), circle(13.5, -6, 2, '#3f5a2a', C.ink, 0.8));
}

// ── Life cycles ──────────────────────────────────────────────────────
const stageIcon = (i: number, grey = false): Svg =>
  i === 0 ? at(0, 2, 1.4, egg(grey)) : i === 1 ? at(2, 6, 0.62, caterpillar('#7cc44f', grey, 6)) : i === 2 ? at(0, -11, 0.72, chrysalis('#8fbf5a', grey)) : at(0, 0, 0.42, bfly({ fw: '#ef8a3c', hw: '#e0602a', spots: [[-26, -18, 2.4, C.ink], [-18, 12, 2, C.ink]], grey }));
/** Four stages in a row near the bottom with arrows; the stage `on` is framed in orange, the others grey. */
const strip = (on: number, y = 96) => all(rect(6, y - 14, 108, 28, C.white, 4, GREY2, 1), ...range(4).map((i) => all(at(18 + i * 28, y, 1, stageIcon(i, i !== on)), i < 3 ? arrow(26 + i * 28, y, 34 + i * 28, y, GREY2, 1.6) : '')), hlBox(6 + on * 28, y - 13, 24, 26));
/** Stage icons round a circle with arrows between them. */
const cycle = (icons: Svg[], cx = 60, cy = 58, r = 34) => {
  const n = icons.length;
  return all(circle(cx, cy, r, 'none', GREY2, 1.2, ), ...icons.map((ic, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2, a2 = -Math.PI / 2 + ((i + 0.5) / n) * Math.PI * 2, a3 = -Math.PI / 2 + ((i + 0.62) / n) * Math.PI * 2;
    return all(circle(f1(cx + Math.cos(a) * r), f1(cy + Math.sin(a) * r), 13, C.white, C.ink, 1.2), at(f1(cx + Math.cos(a) * r), f1(cy + Math.sin(a) * r), 1, ic),
      arrow(f1(cx + Math.cos(a2) * r), f1(cy + Math.sin(a2) * r), f1(cx + Math.cos(a3) * r), f1(cy + Math.sin(a3) * r), HL, 2.2));
  }));
};

// ── Recurring scenes ─────────────────────────────────────────────────
const meadow = () => all(bg(), field(92), grassTufts(100, [12, 40, 86, 104]));
const night = () => all(bg(NIGHT), starDot(20, 16), starDot(44, 24), starDot(98, 14), starDot(108, 34));
const comb = (x: number, y: number, cols: number, rows: number, r = 5, fill: (c: number, rr: number) => string = () => HONEY) =>
  all(...range(rows).flatMap((rr) => range(cols).map((c) => { const cx = x + c * r * 1.74 + (rr % 2) * r * 0.87, cy = y + rr * r * 1.5; return path(range(6).map((i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return `${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`; }).join(' ') + ' Z', fill(c, rr), '#b7862a', 0.9); })));
const hive = (x: number, y: number, s = 1, col = '#e9d9a6') => at(x, y, s, rect(-16, -6, 32, 6, '#8a6a4a', 0, C.ink, 1), line('M-12 0 L-12 6 M12 0 L12 6', C.ink, 2), rect(-14, -20, 28, 14, col, 1, C.ink, 1.2), rect(-14, -34, 28, 14, shade(col, 0.92), 1, C.ink, 1.2), path('M-17 -34 L17 -34 L15 -40 L-15 -40 Z', '#9a8a7a', C.ink, 1.2), rect(-6, -8, 12, 2.4, C.ink, 0, null));
const mound = (x: number, y: number, w: number, h: number) => all(path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h * 0.9} ${x - w / 5} ${y - h} ${x} ${y - h} C${x + w / 5} ${y - h} ${x + w / 2} ${y - h * 0.9} ${x + w / 2} ${y} Z`, '#a2774a', C.ink, 1.3),
  line(range(22).map((i) => { const px = x - w * 0.4 + ((i * 37) % 100) / 100 * w * 0.8, py = y - 3 - ((i * 53) % 100) / 100 * h * 0.8; return `M${f1(px)} ${f1(py)} l${i % 2 ? 3 : -3} 1.4`; }).join(' '), '#6e4e2e', 1.1));
const skinBg = () => all(bg('#f3d9c4'), path('M4 30 C40 24 80 24 116 30 L116 112 L4 112 Z', C.skin, C.ink, 1.2), line('M20 60 l6 1 M60 80 l5 -1 M90 52 l6 1 M40 96 l5 0', C.skin2, 0.9));
const soilBg = (y = 30) => all(bg(), field(y - 6, GRASS), rect(4, y, 112, 112 - y, SOIL, 0, null), ...range(14).map((i) => circle(10 + ((i * 41) % 100), y + 8 + ((i * 29) % (100 - y)) * 0.8, 1.2, SOIL2, null)));

// ── Motifs ───────────────────────────────────────────────────────────
const peacock = (grey = false) => bfly({ fw: '#b8322a', hw: '#8e2a24', eyes: true, body: '#3a2a26', grey });
const lemon = () => bfly({ fw: '#f4dc3a', hw: '#ecd43a', dot: '#e07a2a', shape: 'leaf', body: '#6a6a3a' });
const cabbage = () => bfly({ fw: '#f7f6ef', hw: '#f1efe4', tips: '#2e2e36', spots: [[-20, -14, 2.4, '#2e2e36'], [-16, -9, 2.2, '#2e2e36']], body: '#4a4a4a' });

export const INVERTEBRATE_MOTIFS: Record<string, Svg> = {
  // 2731 Fjärilar och nattfjärilar
  'insekt.insekt': all(bg('#f2ede2'), panel(8, 8, 50, 46, at(33, 33, 0.55, cabbage())), panel(62, 8, 50, 46, at(87, 30, 0.95, bee('honey'))), panel(8, 58, 50, 50, at(33, 82, 1.1, ladybird())), panel(62, 58, 50, 50, at(84, 92, 1.3, antS({ head: '#a8452a', thorax: '#a8452a' }))),
    circle(60, 56, 9, C.white, HL, 2.4), num(60, 60, '6', 11, HL)),
  'insekt.fjäril': all(meadow(), flower(34, 84, 1.3, C.pink, C.yellow, 20), flower(92, 92, 1, C.lilac, C.yellow, 14), rot(62, 44, 12, 1.15, bfly({ fw: '#ef8a3c', hw: '#e0602a', tips: C.ink, spots: [[-26, -18, 2.4, C.ink], [-30, -24, 1.6, C.white], [-18, 12, 2, C.ink]] }))),
  'insekt.fladdra.2': all(meadow(), flower(98, 88, 1.2, C.pink, C.yellow, 18), line('M10 76 C20 50 30 84 42 56 C52 34 62 70 74 44', HL, 1.8, '3 3'),
    rot(24, 66, -20, 0.36, bfly({ fw: '#f7c35a', hw: '#ef9a3c', grey: true })), rot(48, 50, 10, 0.4, bfly({ fw: '#f7c35a', hw: '#ef9a3c', grey: true })), rot(80, 38, 20, 0.7, bfly({ fw: '#f7c35a', hw: '#ef9a3c', spots: [[-24, -18, 2.4, C.ink]] })),
    path('M66 30 l-4 -3 M66 46 l-4 3 M94 30 l4 -3 M94 46 l4 3', 'none', C.ink, 1.2)),
  'insekt.dagfjäril': all(bg('#cfe8f7'), sunS(98, 20, 8), field(92), flower(56, 84, 1.6, C.white, C.yellow, 20), at(56, 74, 1.3, bflySide('#ef8a3c', '#c9a46a', true)), grassTufts(100, [14, 90, 104])),
  'insekt.nattfjäril': all(night(), moon(22, 22, 7), rect(4, 96, 112, 16, '#3e4a3a', 0, null), line('M86 96 L86 30 L74 30', '#5a5d63', 3), path('M66 30 L82 30 L80 38 L68 38 Z', '#5a5d63', C.ink, 1), circle(74, 42, 6, '#ffe9a0', C.ink, 1),
    circle(74, 42, 14, 'rgba(255,236,160,0.25)', null), rot(48, 62, -20, 1.05, moth()), rot(96, 64, 30, 0.45, moth('#b39a7a', '#7a644c'))),
  'insekt.citronfjäril': all(bg('#dcecf6'), field(92, '#b7d68a'), ...[[18, 96], [34, 102], [90, 98], [104, 104]].map(([x, y]) => at(x!, y!, 0.6, flower(0, 0, 1, C.white, C.yellow, 8))), path('M4 92 C30 88 60 90 116 92', 'none', '#e6eef4', 6),
    rot(60, 52, 8, 1.3, lemon())),
  'insekt.kålfjäril': all(bg('#dfeee0'), field(90, '#9fc56a'), ...[[34, 96], [86, 98]].map(([x, y]) => at(x!, y!, 1, ellipse(0, 0, 18, 9, '#8fbf6a', C.ink, 1.2), path('M-14 -2 C-10 -12 10 -12 14 -2 C8 -6 -8 -6 -14 -2 Z', '#b7dc8a', C.ink, 1), line('M0 -8 L0 6 M-6 -4 L-10 4 M6 -4 L10 4', '#6f9f4f', 0.9))),
    rot(60, 50, -6, 1.25, cabbage())),
  'insekt.påfågelöga': all(bg('#e6efd9'), field(90, GRASS), flower(98, 96, 1.1, C.lilac, C.yellow, 12), rot(58, 50, 0, 1.4, peacock())),
  'insekt.ögonfläck': all(bg('#f2ede2'), at(60, 78, 1.7, both(path('M-1 -3 C-10 -24 -30 -30 -34 -20 C-34 -10 -20 -2 -1 0 Z', '#b8322a', C.ink, 0.6)), both(circle(-24, -19, 5.5, '#f2d24a', C.ink, 0.5), circle(-24, -19, 3.6, '#3b5fb5', null), circle(-24, -19, 1.8, C.ink, null)), ellipse(0, -4, 2.4, 6, '#3a2a26', C.ink, 0.6)),
    ring(19, 46, 12), ring(101, 46, 12), rot(104, 96, 0, 1, path('M-10 0 C-10 -8 2 -10 8 -6 L14 -8 L10 -3 C10 2 4 6 -4 4 Z', '#9aa36e', C.ink, 1.1), circle(5, -5, 1, C.ink, null)), arrow(92, 100, 112, 106, GREY2, 1.6)),
  'insekt.sugsnabel': all(bg('#f6eef4'), at(86, 92, 2.2, flower(0, 0, 1, C.pink, '#f2d06a')), at(22, 44, 2.2, ellipse(0, 0, 5, 4, '#3a3030', C.ink, 0.8), circle(-1, -1, 2.2, '#5a4a3a', null), circle(-0.4, -1.6, 0.7, C.white, null), line('M2 -3 C4 -10 8 -14 12 -16', C.ink, 0.6)),
    line('M30 52 C46 60 60 70 80 84', C.ink, 4), line('M30 52 C46 60 60 70 80 84', '#4a3a3a', 2.4), oval(54, 68, 26, 13)),
  'insekt.nektar': all(bg('#f6eef4'), at(60, 70, 3, path('M-12 -12 C-12 4 -6 10 0 10 C6 10 12 4 12 -12 C6 -6 -6 -6 -12 -12 Z', C.pink, C.ink, 0.6), path('M-6 -4 C-4 6 4 6 6 -4 Z', '#f9e7b0', null), line('M0 10 L0 16', LEAF2, 1.4)),
    dropS(60, 74, 2.2, '#f3c64a'), ring(60, 75, 14), rot(28, 34, 30, 0.8, bee('honey'))),
  'insekt.håv': all(meadow(), flower(96, 90, 1, C.pink, C.yellow, 12), line('M12 108 L62 54', '#9a6a3a', 3.4), ellipse(76, 42, 18, 12, 'rgba(255,255,255,0.55)', C.ink, 1.6), path('M60 46 C66 74 84 78 94 46', 'rgba(255,255,255,0.5)', C.ink, 1.2),
    line('M64 50 L74 70 M72 52 L80 72 M82 50 L86 66 M66 58 L90 58', '#b9bec4', 0.7), rot(80, 62, 10, 0.35, bfly({ fw: '#4f8fd0', hw: '#3f6fb5' }))),
  // 2732 Bin och humlor
  'insekt.bi': all(bg('#e6f2dc'), field(98, GRASS), flower(60, 64, 3, '#f7f0a8', '#e9a825'), rot(62, 58, 20, 1.9, bee('honey'))),
  'insekt.humla': all(bg('#e6f2dc'), field(98, GRASS), at(56, 70, 2.4, flower(0, 0, 1, '#b48ad6', '#f2c94c')), rot(58, 58, -10, 2, bee('bumble'))),
  'insekt.geting': all(bg('#f3e6d4'), rect(4, 88, 112, 24, '#c9a27a', 0, null), rect(24, 52, 22, 38, 'rgba(230,240,250,0.8)', 2, C.ink, 1.4), rect(26, 62, 18, 26, '#f29a3c', 0, null), at(84, 92, 1, ellipse(0, 0, 20, 5, C.white, C.ink, 1.2), path('M-12 -2 C-10 -10 10 -10 12 -2 Z', '#d9a05a', C.ink, 1)),
    rot(78, 52, 30, 2.1, bee('wasp'))),
  'insekt.surra': all(bg('#e6f2dc'), field(98, GRASS), flower(24, 86, 1.3, C.pink, C.yellow, 12), rot(60, 52, 15, 2, bee('bumble')), ...[0, 1, 2].map((i) => path(`M${88 + i * 7} ${36 - i * 2} C${92 + i * 8} 44 ${92 + i * 8} 56 ${88 + i * 7} ${64 + i * 2}`, 'none', HL, 2)), ...[0, 1, 2].map((i) => path(`M${30 - i * 7} ${36 - i * 2} C${26 - i * 8} 44 ${26 - i * 8} 56 ${30 - i * 7} ${64 + i * 2}`, 'none', HL, 2))),
  'insekt.pollinera': all(meadow(), flower(22, 62, 1.6, '#f7f0a8', '#e9a825', 30), flower(98, 62, 1.6, '#f7f0a8', '#e9a825', 30), line('M28 50 C44 22 76 22 92 50', HL, 2, '4 3'), path('M92 50 l-7 -3 l1 7 Z', HL, null),
    rot(60, 30, 80, 1.3, bee('honey')), ...[[50, 34], [56, 38], [64, 37], [70, 33]].map(([x, y]) => circle(x!, y!, 1.6, '#f2c94c', C.ink, 0.6))),
  'insekt.biodlare': all(meadow(), hive(92, 98, 1.1),
    at(44, 0, 1, path('M30 66 L58 66 L58 110 L48 110 L44 82 L40 110 L30 110 Z', '#f4f4ee', C.ink, 1.4), path('M28 36 L60 36 L60 70 L28 70 Z', '#f4f4ee', C.ink, 1.4), path('M28 38 L18 66 L25 68 L32 46 Z M60 38 L70 62 L64 66 L56 46 Z', '#f4f4ee', C.ink, 1.4), circle(21, 69, 4, '#e6c24a', C.ink, 1.2), circle(67, 66, 4, '#e6c24a', C.ink, 1.2),
      circle(44, 24, 11, C.skin, C.ink, 1.4), path('M30 26 C30 34 58 34 58 26 L56 36 C50 40 38 40 32 36 Z', 'rgba(60,60,60,0.45)', C.ink, 1), path('M26 16 L62 16 L58 10 C54 4 34 4 30 10 Z', '#f4f4ee', C.ink, 1.4), line('M33 20 L33 34 M38 22 L38 36 M44 22 L44 37 M50 22 L50 36 M55 20 L55 34', 'rgba(40,40,40,0.5)', 0.6),
      circle(40, 23, 1.2, C.ink, null), circle(48, 23, 1.2, C.ink, null)),
    ...[[96, 52], [104, 64], [84, 58]].map(([x, y]) => rot(x!, y!, 40, 0.5, bee('honey')))),
  'insekt.bikupa': all(meadow(), hive(40, 100, 1.6), hive(94, 100, 1.1, '#cfe0f0'), ...[[58, 46], [68, 60], [30, 26], [76, 40]].map(([x, y], i) => rot(x!, y!, 30 + i * 40, 0.55, bee('honey')))),
  'insekt.vaxkaka': all(bg('#f2e6c8'), rect(8, 14, 104, 88, '#c9a46a', 2, C.ink, 1.6), rect(14, 20, 92, 76, WAX, 0, C.ink, 1),
    comb(20, 26, 10, 9, 5.4, (c, r) => ((c * 7 + r * 3) % 5 === 0 ? '#f6e3a6' : HONEY)), rot(64, 58, -20, 0.9, bee('honey'))),
  'insekt.bisamhälle': all(bg('#f2e6c8'), path('M14 108 L14 30 C14 18 106 18 106 30 L106 108 Z', '#e9d9a6', C.ink, 1.6), rect(20, 30, 80, 72, WAX, 2, C.ink, 1), comb(24, 36, 8, 8, 5, () => HONEY),
    ...range(14).map((i) => rot(28 + ((i * 37) % 70), 38 + ((i * 23) % 58), (i * 47) % 360, 0.42, bee('honey'))), rect(50, 104, 20, 4, C.ink, 0, null)),
  'insekt.drottning.2': all(bg('#f2e6c8'), rect(6, 6, 108, 104, WAX, 2, C.ink, 1), comb(10, 12, 12, 13, 5, () => '#f6e3a6'),
    ...[[22, 30, 40], [96, 34, 200], [24, 90, 120], [96, 90, 300], [60, 18, 90], [60, 102, 270], [30, 60, 0], [92, 62, 180]].map(([x, y, a]) => rot(x!, y!, a!, 0.95, bee('honey'))),
    rot(60, 58, -20, 1.9, bee('queen')), ring(60, 59, 30)),
  'insekt.drönare.2': all(bg('#f2e6c8'), comb(8, 12, 12, 13, 5, () => '#f6e3a6'), at(40, 58, 2.6, bee('drone')), oval(40, 28, 13, 9), greyPanel(78, 34, 32, 52, at(94, 60, 1.6, bee('grey')))),
  'insekt.vildbi': all(bg('#e9e1cf'), path('M4 112 L4 70 C30 60 80 58 116 66 L116 112 Z', '#d8b98a', C.ink, 1.2), ...[[24, 84], [50, 92], [80, 80], [96, 100]].map(([x, y]) => ellipse(x!, y!, 3.4, 2.6, '#5a4632', null)),
    flower(96, 40, 1.2, '#f7f0a8', '#e9a825', 26), rot(54, 62, 160, 1.6, bee('wild'))),
  'insekt.bihotell': all(bg('#e9e1cf'), rect(4, 4, 112, 108, '#cfc2a8', 0, null), path('M30 30 L60 12 L90 30 Z', '#9a6a3a', C.ink, 1.4), rect(32, 30, 56, 66, '#b07a45', 1, C.ink, 1.4),
    ...range(4).flatMap((r) => range(5).map((c) => all(circle(40 + c * 10, 40 + r * 14, 4.2, '#e6d3a8', C.ink, 1), circle(40 + c * 10, 40 + r * 14, 2, '#4a3624', null)))), rot(70, 48, 200, 0.8, bee('wild'))),
  // 2733 Myror och kolonier
  'insekt.myra': all(bg('#efe6d2'), rect(4, 86, 112, 26, '#c9a87a', 0, null), at(54, 86, 2.4, antS({ head: '#3a2a20', thorax: '#3a2a20', gaster: '#2b2420' }))),
  'insekt.barr': all(bg('#e2ecd6'), rect(4, 90, 112, 22, '#c7a87a', 0, null), line(range(26).map((i) => `M${8 + i * 4} ${96 + (i % 4) * 3} l${i % 2 ? 6 : -6} ${i % 3 ? 2 : -2}`).join(' '), '#9a7a42', 1.2),
    line('M10 30 L110 50', '#8a5a30', 3), line(range(20).map((i) => { const x = 14 + i * 5, y = 30.8 + (x - 10) * 0.2; return `M${x} ${f1(y)} l-4 -10 M${x} ${f1(y)} l4 10`; }).join(' '), FOREST, 1.6)),
  'insekt.myrstack': all(bg('#d8e6cc'), pine(14, 86, 1.6), pine(106, 84, 1.4), field(84, '#8aa86a'), mound(60, 100, 86, 52), ...[[44, 64], [70, 58], [56, 80], [84, 82], [30, 90]].map(([x, y], i) => at(x!, y!, 0.5, i % 2 ? flipX(antS({ head: '#a8452a', thorax: '#a8452a' })) : antS({ head: '#a8452a', thorax: '#a8452a' })))),
  'insekt.skogsmyra': all(bg('#d8e6cc'), mound(60, 112, 116, 40), at(54, 76, 2.4, antS({ head: '#b0482a', thorax: '#b0482a', gaster: '#2b2420' }))),
  'insekt.hästmyra': all(bg('#e2ecd6'), trunk(4, 112, '#9a7550'), ...[[30, 30], [84, 26], [24, 92], [96, 96]].map(([x, y]) => ellipse(x!, y!, 5, 7, '#4a3220', C.ink, 1)), at(50, 66, 2.3, antS()), greyPanel(78, 74, 32, 28, at(90, 96, 1.4, antS({ grey: true })))),
  'insekt.koloni.2': all(soilBg(26), mound(60, 26, 50, 16), ...[[34, 46, 18], [80, 50, 16], [50, 74, 20], [90, 86, 14], [24, 92, 14]].map(([x, y, r]) => ellipse(x!, y!, r!, r! * 0.55, '#c9a882', C.ink, 1)),
    line('M60 26 L60 40 L36 46 M60 40 L80 50 M50 56 L50 74 M60 40 L52 60 M70 72 L88 86 M40 80 L26 92', '#c9a882', 4),
    ...[[30, 47], [38, 46], [76, 51], [84, 50], [46, 75], [56, 75], [88, 87], [22, 93], [60, 34], [44, 64]].map(([x, y], i) => at(x!, y! + 2, 0.36, i % 2 ? flipX(antS()) : antS())), at(52, 76, 0.36, egg())),
  'insekt.arbetare.2': all(bg('#efe6d2'), rect(4, 90, 112, 22, '#c9a87a', 0, null), at(46, 90, 1.9, antS({ load: line('M14 -14 L32 -24', '#6f8f3a', 2) + path('M22 -22 C26 -30 34 -30 36 -26 C34 -22 28 -20 22 -22 Z', LEAF, C.ink, 0.6) })), oval(44, 76, 22, 13),
    greyPanel(80, 8, 32, 34, at(98, 34, 0.8, antS({ grey: true })), at(90, 37, 0.5, ellipse(-10, -6, 12, 6, GREY, GREY2, 1)))),
  'insekt.doftspår': all(bg('#efe6d2'), rect(4, 4, 112, 108, '#d9c49a', 0, null), mound(98, 40, 34, 22), circle(20, 96, 8, '#f4c0c0', C.ink, 1.2), path('M14 90 C16 86 24 86 26 90', 'none', C.ink, 0.8),
    line('M24 88 C40 72 30 56 52 54 C72 52 70 36 90 34', '#7fc46a', 3, '1 4'), ...[[34, 74, 300], [40, 60, 330], [58, 53, 350], [72, 46, 320], [84, 37, 340]].map(([x, y, a]) => rot(x!, y!, a!, 0.42, antS()))),
  'insekt.myrsyra': all(bg('#efe6d2'), rect(4, 88, 112, 24, '#c9a87a', 0, null), at(66, 88, 2.4, g('rotate(-14)', antS({ head: '#b0482a', thorax: '#b0482a' }))),
    ...[[30, 54], [24, 46], [36, 44], [20, 58], [30, 36]].map(([x, y]) => circle(x!, y!, 2, '#bfe0f0', '#5d9fd0', 0.9)), line('M48 70 C42 62 38 58 34 54', HL, 2, '2 3'), line('M10 22 l6 6 M8 32 l8 2 M18 14 l2 8', HL, 1.6)),
  'insekt.bladlus': all(bg('#e6f2dc'), line('M8 84 C40 76 80 72 112 60', LEAF2, 7), line('M8 84 C40 76 80 72 112 60', '#8fcf6a', 4.4), leafShape(96, 40, 1.4, -30),
    ...[[24, 80, 1.6], [42, 76, 1.9], [62, 72, 1.6], [80, 68, 1.9], [98, 62, 1.4]].map(([x, y, s]) => rot(x!, y!, -10, s!, aphid()))),
  'insekt.honungsdagg': all(bg('#e6f2dc'), line('M4 70 C40 62 80 58 116 52', LEAF2, 7), line('M4 70 C40 62 80 58 116 52', '#8fcf6a', 4.4), rot(42, 62, -8, 2.6, aphid()), dropS(26, 70, 1.6, '#f3e3a0'), ring(26, 70, 9), at(80, 96, 1.7, flipX(antS()))),
  'insekt.svärma': all(bg('#cfe3f2'), field(96, '#8aa86a'), mound(60, 104, 60, 26), ...range(10).map((i) => rot(16 + ((i * 41) % 90), 18 + ((i * 29) % 52), (i * 61) % 360 - 30, 0.65, antS({ wings: true })))),
  'insekt.bevingad': all(bg('#efe6d2'), rect(4, 90, 112, 22, '#c9a87a', 0, null), at(54, 86, 2.1, antS({ wings: true })), oval(42, 55, 26, 11), greyPanel(80, 8, 32, 26, at(94, 30, 1, antS({ grey: true })))),
  'insekt.termit': all(bg('#f2e0b8'), rect(4, 96, 112, 16, '#d9b98a', 0, null), path('M24 98 C26 70 30 40 36 18 C40 40 42 52 48 60 C52 48 54 40 58 36 C62 52 66 76 68 98 Z', '#c99a5a', C.ink, 1.4), line('M34 40 l2 6 M30 66 l3 4 M56 56 l2 6 M46 80 l3 3', '#9a7040', 1.2),
    at(86, 98, 1.5, termite())),
  // 2734 Skalbaggar
  'insekt.skalbagge': all(bg('#e2ecd6'), leafShape(60, 66, 3.2, -15), at(60, 64, 2.4, beetle({ col: '#3f6e4a', col2: '#2b4a34', shine: true }))),
  'insekt.täckvinge': all(bg('#d4e8f5'), at(60, 64, 2.4, beetle({ col: '#b0582a', open: true })), oval(46, 66, 13, 22), oval(74, 66, 13, 22)),
  'insekt.glänsa': all(bg('#f2ede2'), at(44, 62, 2.6, beetle({ col: '#2f9a6a', col2: '#1f6a4a', shine: true })), ...[[22, 26], [68, 34], [62, 96]].map(([x, y]) => path(`M${x} ${y! - 6} L${x! + 1.6} ${y! - 1.6} L${x! + 6} ${y} L${x! + 1.6} ${y! + 1.6} L${x} ${y! + 6} L${x! - 1.6} ${y! + 1.6} L${x! - 6} ${y} L${x! - 1.6} ${y! - 1.6} Z`, '#fff3b0', C.gold, 0.8)),
    greyPanel(80, 8, 32, 34, at(96, 28, 0.9, beetle({ col: GREY, grey: true })))),
  'insekt.artrik': all(bg('#f2ede2'), panel(6, 6, 108, 62, rect(7, 7, 106, 60, '#d8ecc8', 3, null), pine(20, 60, 1.2), flower(40, 54, 0.9, C.pink, C.yellow, 8), flower(92, 56, 0.8, C.lilac, C.yellow, 6), rot(60, 30, 10, 0.4, bfly({ fw: '#ef8a3c', hw: '#e0602a' })),
    at(76, 50, 0.6, ladybird()), rot(34, 30, 30, 0.5, bee('honey')), at(104, 30, 0.5, beetle({ col: '#3f6e4a' })), at(56, 60, 0.4, antS()), at(84, 22, 0.35, bee('bumble'))),
    greyPanel(6, 74, 108, 34, rect(8, 92, 104, 14, '#d6dccf', 0, null), ...[20, 44, 68, 92].map((x) => at(x, 92, 0.5, line('M0 0 L0 -12 M-4 -8 L0 -12 L4 -8', GREY2, 2))))),
  'insekt.nyckelpiga': all(bg('#e6f2dc'), leafShape(60, 70, 3.4, -10, '#8fcf6a'), at(60, 64, 2.6, ladybird())),
  'insekt.ollonborre': all(bg('#f2c58a'), circle(96, 22, 8, '#f8e0a0', null), field(94, '#8aa86a'), rect(10, 60, 26, 36, '#8a5a30', 0, C.ink, 1), circle(24, 46, 22, '#5f9a4f', C.ink, 1.2), at(66, 62, 2.4, beetle({ col: '#9a5a2a', col2: '#3a2a20', fan: true, rx: 9, ry: 12 }))),
  'insekt.ekoxe': all(bg('#e2ecd6'), trunk(4, 112, '#8a6a4a'), at(60, 70, 2.1, beetle({ col: '#5a2e1e', col2: '#3a1e14', jaws: true, rx: 9, ry: 13 }))),
  'insekt.spillning': all(bg('#e2ecd6'), field(70, '#9fc56a'), grassTufts(78, [12, 30, 96]), ...[[44, 92], [52, 96], [60, 90], [66, 98], [56, 102], [72, 92], [48, 100], [62, 106]].map(([x, y]) => ellipse(x!, y!, 4, 3.2, '#4a3624', C.ink, 0.9)), at(22, 60, 0.9, path('M-6 0 C-6 -4 0 -6 6 -4 C4 0 0 2 -6 0 Z', '#c98a3c', null))),
  'insekt.dyngbagge': all(bg('#f2e0b8'), rect(4, 90, 112, 22, '#d9b98a', 0, null), circle(36, 72, 18, '#6b4f36', C.ink, 1.4), line('M26 64 l4 2 M38 60 l2 4 M44 76 l3 1 M30 80 l3 -2', '#4a3624', 1.2), rot(74, 82, -60, 1.8, beetle({ col: '#1f1d22', col2: '#2b2a33', shine: true, round: true }))),
  'insekt.lysmask': all(bg(NIGHT), starDot(20, 14), starDot(90, 20), starDot(56, 10), field(84, '#2e4a32'), grassTufts(86, [10, 26, 90, 104], '#4a7a4a'), circle(60, 80, 22, 'rgba(180,255,120,0.18)', null), circle(60, 80, 12, 'rgba(180,255,120,0.3)', null),
    at(60, 86, 2, path('M-14 0 C-14 -4 -4 -6 6 -6 C12 -6 14 -2 12 0 Z', '#7a6a4a', C.ink, 0.8), path('M-14 0 C-14 -3 -10 -4 -6 -4 L-6 0 Z', '#c8ff7a', null), line('M-2 -6 l0 6 M2 -6 l0 6', '#5a4a32', 0.6))),
  'insekt.bark': all(bg('#e2ecd6'), trunk(30, 60, '#8a6a4a'), path('M30 40 C50 36 70 36 90 40 L90 78 C70 74 50 74 30 78 Z', '#6e5034', C.ink, 1.2), line('M36 46 l4 12 M48 42 l3 14 M60 44 l4 16 M74 42 l2 14 M84 48 l3 12 M42 62 l3 10 M66 60 l2 10', '#4a3420', 1.6), oval(60, 58, 34, 24)),
  'insekt.granbarkborre': all(bg('#e2ecd6'), pine(16, 50, 1.2, '#a07a3a'), pine(104, 48, 1.1, '#a07a3a'), rect(28, 4, 64, 108, '#8a6a4a', 0, C.ink, 1.2), path('M36 20 L84 20 L84 100 L36 100 Z', '#e8d2a8', C.ink, 1.2),
    line('M60 26 L60 94 ' + range(8).map((i) => `M60 ${32 + i * 8} C${52 - i} ${30 + i * 8} ${44} ${34 + i * 8} ${40} ${36 + i * 8} M60 ${32 + i * 8} C${68 + i} ${30 + i * 8} ${76} ${34 + i * 8} ${80} ${36 + i * 8}`).join(' '), '#7a5434', 1.6), at(60, 60, 1.3, beetle({ col: '#5a3a24', col2: '#3a2618', rx: 5, ry: 8 }))),
  'insekt.död-ved': all(bg('#d8e6cc'), pine(16, 60, 1.4), pine(104, 58, 1.2), field(78, '#7a9a5a'), path('M8 96 C8 84 104 78 112 88 C114 96 112 104 108 106 L12 108 C8 106 8 100 8 96 Z', '#8a6a4a', C.ink, 1.4), ellipse(10, 101, 6, 8, '#c9a87a', C.ink, 1.2), path('M7 98 a3 3 0 1 1 3 3', 'none', '#8a6a4a', 0.9),
    line('M30 90 l10 -2 M54 88 l14 0 M80 86 l12 2', '#5a4430', 1.4), ...[[40, 84], [48, 82], [86, 82]].map(([x, y]) => at(x!, y!, 1, path('M-5 0 C-5 -5 5 -5 5 0 Z', '#d9a05a', C.ink, 0.9), rect(-1, 0, 2, 3, '#f2ead8', 0, null))), at(66, 94, 0.6, beetle({ col: '#3f6e4a' })), path('M70 76 C74 62 86 60 92 66', 'none', '#4f6a3a', 2)),
  'insekt.rödlistad': all(bg('#f2ede2'), rect(14, 10, 54, 72, C.white, 3, C.ink, 1.4), rect(14, 10, 54, 12, C.red, 3, C.ink, 1.4), ...range(5).map((i) => all(circle(24, 32 + i * 10, 2.6, i === 2 ? C.red : GREY, null), line(`M30 ${32 + i * 10} L60 ${32 + i * 10}`, GREY, 2.4))),
    at(86, 82, 1.3, beetle({ col: '#5a2e1e', col2: '#3a1e14', jaws: true, rx: 9, ry: 13 })), arrow(24, 92, 50, 104, C.red, 2.6), ring(24, 52, 6)),
  // 2735 Spindlar och kvalster
  'insekt.småkryp': all(bg('#e2ecd6'), rect(4, 70, 112, 42, SOIL, 0, null), path('M66 70 C70 54 100 50 112 58 L112 72 C96 74 80 74 66 72 Z', ROCKCOL, C.ink, 1.4), ellipse(60, 84, 50, 14, '#6b4f36', null),
    at(30, 86, 0.9, spider('#5a4a3a')), at(52, 92, 0.9, beetle({ col: '#3a3a44' })), at(76, 84, 0.6, slug('#c9662f')), at(90, 96, 1, antS()), at(44, 78, 0.7, wormPath('M-10 0 C-6 -4 -2 4 2 0 C6 -4 10 2 14 0'))),
  'insekt.spindel': all(bg('#efe9df'), path('M4 4 L116 4 L116 112 L4 112 Z', '#e6ded0', null), line('M4 4 L60 60 M4 34 L50 50 M34 4 L50 46 M4 70 L46 60', '#cfc7b8', 0.8), at(60, 60, 2.0, spider('#5a4434'))),
  'insekt.spindeldjur': all(bg('#f2ede2'), panel(6, 6, 52, 50, at(32, 30, 1.2, spider('#5a4434'))), panel(62, 6, 52, 50, at(88, 34, 1.4, tick())), panel(6, 60, 52, 48, at(32, 82, 0.8, harvestman())),
    circle(60, 58, 9, C.white, HL, 2.4), num(60, 62, '8', 11, HL), greyPanel(62, 60, 52, 48, at(88, 84, 1.3, beetle({ col: GREY, grey: true })), cross(88, 84, 14))),
  'insekt.spinna.2': all(bg('#dfe8ef'), line('M10 10 L110 10', C.ink, 1.4), line('M60 10 L60 54', '#f4f8fb', 1.6), rot(60, 70, 180, 2.2, spider('#6b4a32', true)), ring(60, 54, 7), line('M54 56 C40 72 30 90 20 104 M66 56 C80 72 92 88 104 100', '#f4f8fb', 1.4), line('M54 56 C40 72 30 90 20 104 M66 56 C80 72 92 88 104 100', '#b9c6d2', 0.6)),
  'insekt.spindelnät': all(bg('#5d7a5a'), all(...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M60 58 L${f1(60 + Math.cos(a) * 50)} ${f1(58 + Math.sin(a) * 50)}`, '#f4f8fb', 0.9); })),
    ...range(6).map((k) => path(range(13).map((i) => { const a = (i / 12) * Math.PI * 2, r = 8 + k * 7.4; return `${i ? 'L' : 'M'}${f1(60 + Math.cos(a) * r)} ${f1(58 + Math.sin(a) * r)}`; }).join(' '), 'none', '#f4f8fb', 0.8)), ...[[38, 40], [84, 66], [70, 34], [44, 78], [92, 46]].map(([x, y]) => circle(x!, y!, 1.6, '#e8f6ff', '#9fd1ff', 0.6))),
  'insekt.korsspindel': all(bg('#5d7a5a'), ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return line(`M60 60 L${f1(60 + Math.cos(a) * 52)} ${f1(60 + Math.sin(a) * 52)}`, 'rgba(244,248,251,0.7)', 0.7); }),
    ...range(5).map((k) => circle(60, 60, 10 + k * 9, 'none', 'rgba(244,248,251,0.7)', 0.7)), at(60, 58, 2.2, spider('#9a6a3a', true))),
  'insekt.lockespindel': all(bg('#efe9df'), rect(4, 4, 112, 108, '#e6ded0', 0, null), line('M4 70 L116 70', '#d4cabb', 1), at(60, 52, 1.7, harvestman())),
  'insekt.fästingbett': all(skinBg(), circle(60, 70, 22, 'rgba(214,69,69,0.18)', null), at(60, 70, 2.6, tick(true)), ring(60, 70, 30)),
  // 2736 Maskar och snäckor
  'insekt.luckra-upp': all(bg(), field(26, GRASS), panel(6, 32, 52, 76, rect(7, 33, 50, 74, '#7a5a3e', 2, null), ...range(18).map((i) => circle(12 + ((i * 29) % 44), 40 + ((i * 17) % 62), 3, '#9a7a56', null)), line('M20 40 C24 56 14 70 22 90 M42 38 C36 54 46 72 40 96', '#c9a882', 3.4), at(30, 76, 0.7, wormPath('M-12 0 C-6 -6 2 4 10 -2')), arrow(46, 40, 46, 66, WATER, 2), arrow(16, 40, 16, 60, '#cfe3f2', 2)),
    greyPanel(62, 32, 52, 76, rect(63, 33, 50, 74, '#a8a49e', 2, null), line('M66 50 L110 50 M66 70 L110 70 M66 90 L110 90', '#8f8b86', 2), arrow(88, 36, 88, 46, GREY2, 2), cross(88, 60, 6))),
  'insekt.vinbergssnäcka': all(bg('#e2ecd6'), rect(4, 92, 112, 20, '#9a9590', 0, null), leafShape(22, 86, 1.2, -20), at(58, 92, 2, snail('#d4b07a', '#cfbca2'))),
  'insekt.snigel': all(bg('#e2ecd6'), field(90, GRASS), grassTufts(92, [12, 96, 106]), at(58, 90, 1.7, slug('#6f6a62'))),
  'insekt.slemspår': all(bg('#d8d4ce'), rect(4, 60, 112, 52, '#a8a49e', 0, null), line('M4 60 L116 60', C.ink, 1), path('M8 100 C30 92 40 80 66 78', 'none', 'rgba(255,255,255,0.75)', 6), path('M8 100 C30 92 40 80 66 78', 'none', '#cfe3f2', 2), oval(36, 88, 30, 12), at(86, 80, 0.9, slug('#6f6a62'))),
  'insekt.mördarsnigel': all(bg('#e2ecd6'), field(90, '#9fc56a'), at(34, 86, 1.6, path('M-14 0 C-18 -10 -10 -22 0 -20 C10 -22 18 -10 14 0 Z', '#9fd36a', C.ink, 1), path('M-8 -2 C-10 -10 -4 -16 0 -14 C4 -16 10 -10 8 -2 Z', '#c8ea9a', C.ink, 0.8), path('M10 -16 C14 -16 16 -12 14 -10 L10 -12 Z', '#e2ecd6', null)), at(76, 96, 1.5, slug('#d0652a'))),
  'insekt.tvåkönad': all(bg('#f2ede2'), panel(6, 6, 108, 60, at(50, 56, 1.4, snail('#d4b07a', '#cfbca2'))), at(92, 28, 1, circle(0, 0, 7, 'none', C.navy, 2.2), line('M5 -5 L11 -11 M7 -11 L11 -11 L11 -7', C.navy, 2.2), circle(0, 0, 7, 'none', C.red, 0.1), line('M0 7 L0 15 M-4 11 L4 11', C.red, 2.2)),
    greyPanel(6, 70, 108, 38, at(34, 100, 0.7, snail(GREY, '#d6dccf')), at(84, 100, 0.7, snail(GREY, '#d6dccf')), at(54, 84, 0.6, circle(0, 0, 7, 'none', GREY2, 2.2), line('M5 -5 L11 -11 M7 -11 L11 -11 L11 -7', GREY2, 2.2)), at(104, 82, 0.6, circle(0, 0, 7, 'none', GREY2, 2.2), line('M0 7 L0 15 M-4 11 L4 11', GREY2, 2.2)))),
  'insekt.parasit': all(bg('#d4e8f5'), rect(4, 60, 112, 52, WATER, 0, null), at(56, 72, 2.2, path('M-20 0 C-12 -10 10 -10 18 0 C10 10 -12 10 -20 0 Z M18 0 L26 -7 L26 7 Z', '#9fb3c4', C.ink, 0.9), circle(-12, -2, 1.2, C.ink, null)),
    at(70, 84, 1.6, path('M-6 0 C-6 -3 6 -3 8 0 C6 3 -6 3 -6 0 Z', '#3a3a2a', C.ink, 0.8)), ring(72, 84, 10), arrow(64, 88, 50, 104, HL, 2), arrow(80, 76, 96, 60, GREY2, 1.6)),
  'insekt.igel': all(bg('#d4e8f5'), rect(4, 40, 112, 72, '#6fa8d6', 0, null), line('M4 40 L116 40', C.white, 1.2), path('M40 4 L40 112 L80 112 L80 4 Z', C.skin, C.ink, 1.4), line('M60 112 L60 96', C.skin2, 1),
    at(62, 72, 1, line('M-6 -18 C-14 -10 -10 4 -4 14', '#1f2a1e', 9), line('M-6 -18 C-14 -10 -10 4 -4 14', '#4a5a3a', 6.4), line('M-8 -12 l4 0 M-10 -4 l4 0 M-8 4 l4 0', '#3a4a2a', 1)), ring(56, 70, 20)),
  'insekt.bandmask': all(bg('#f3d9c4'), path('M14 20 C14 10 106 10 106 20 L106 100 C106 110 14 110 14 100 Z', '#f2b8a8', C.ink, 1.4), path('M24 30 C24 22 96 22 96 30 L96 90 C96 98 24 98 24 90 Z', '#f8d8cc', '#d99a8a', 1),
    path('M30 40 C50 30 80 30 88 44 C96 58 70 62 50 58 C30 54 26 70 40 80 C54 90 80 88 90 82', 'none', '#f4efd8', 6), line('M30 40 C50 30 80 30 88 44 C96 58 70 62 50 58 C30 54 26 70 40 80 C54 90 80 88 90 82', '#c9bf9a', 6, '0.8 3'), circle(30, 40, 3, '#f4efd8', C.ink, 1)),
  // 2737 Metamorfos och livscykler
  'insekt.fluga.3': all(bg('#f3e6d4'), rect(4, 80, 112, 32, '#c9a27a', 0, null), path('M20 84 C20 66 100 66 100 84 Z', '#e0b070', C.ink, 1.4), path('M26 80 C30 72 90 72 94 80', 'none', '#f2d8a8', 2), at(62, 60, 2.6, fly())),
  'insekt.livscykel': all(bg('#f2ede2'), cycle([stageIcon(0), stageIcon(1), stageIcon(2), stageIcon(3)])),
  'insekt.larv': all(bg('#e6f2dc'), line('M8 70 C40 60 80 58 112 50', '#7a5a3a', 3.4), leafShape(40, 52, 2, -30), at(72, 54, 1.9, caterpillar()), strip(1)),
  'insekt.puppa': all(bg('#e6f2dc'), line('M10 14 L110 14', '#7a5a3a', 4), leafShape(30, 26, 1.2, 30), at(64, 16, 1.9, chrysalis()), strip(2)),
  'insekt.förpuppa-sig': all(bg('#e6f2dc'), line('M8 14 L112 14', '#7a5a3a', 4), at(30, 16, 1, line('M0 0 L0 6', C.ink, 1.4), g('rotate(90) translate(26 0)', caterpillar('#7cc44f', false, 6))),
    arrow(46, 46, 70, 46, HL, 3), at(88, 16, 1.7, chrysalis())),
  'insekt.fullbildad': all(bg('#e6f2dc'), rot(62, 42, 0, 0.95, bfly({ fw: '#ef8a3c', hw: '#e0602a', tips: C.ink, spots: [[-26, -18, 2.4, C.ink], [-18, 12, 2, C.ink]] })), strip(3)),
  'insekt.metamorfos': all(bg('#f2ede2'), at(20, 96, 0.9, caterpillar()), at(58, 70, 1, chrysalis()), rot(96, 40, 0, 0.55, bfly({ fw: '#ef8a3c', hw: '#e0602a', tips: C.ink })), path('M20 80 C24 50 40 40 54 62', 'none', HL, 2.4), path('M54 62 l-2 -8 l-5 6 Z', HL, null), path('M66 72 C78 70 84 62 88 58', 'none', HL, 2.4), path('M88 58 l-8 1 l4 6 Z', HL, null)),
  'insekt.fullständig-förvandling': all(bg('#f2ede2'), cycle([stageIcon(0), stageIcon(1), stageIcon(2), stageIcon(3)]), circle(60, 58, 11, C.white, HL, 2.4), num(60, 62, '4', 12, HL)),
  'insekt.nymf': all(bg('#d4e8f5'), rect(4, 30, 112, 82, '#6fa8d6', 0, null), line('M4 30 L116 30', C.white, 1.2), rect(4, 100, 112, 12, '#8a7a5a', 0, null), line('M80 112 C78 80 84 50 82 20', LEAF2, 3), at(56, 80, 1.8, dragonNymph()), ring(58, 78, 26)),
  'insekt.ofullständig-förvandling': all(bg('#f2ede2'), cycle([at(0, 2, 1.4, egg()), at(2, 4, 0.3, grasshopper('#6fb33f', false)), at(3, 7, 0.46, grasshopper())]), circle(60, 58, 11, C.white, HL, 2.4), num(60, 62, '3', 12, HL),
    greyPanel(92, 92, 22, 18, at(103, 90, 0.4, chrysalis('#8fbf5a', true)), cross(103, 101, 6))),
  'insekt.gräshoppa': all(bg('#e6f2dc'), field(94, GRASS), blade(30, 100, 70), blade(90, 100, 60), line('M10 96 L110 96', GRASS2, 1), at(58, 88, 1.7, grasshopper())),
  'insekt.trollslända': all(bg('#d4e8f5'), rect(4, 76, 112, 36, WATER, 0, null), line('M4 76 L116 76', C.white, 1.2), line('M20 112 L20 40 M28 112 L30 50', '#7a9a4a', 2.4), rot(66, 48, 90, 1.25, dragonfly())),
  'insekt.dagslända': all(bg('#f6d6a0'), circle(26, 30, 10, '#f9e6a8', null), rect(4, 80, 112, 32, WATER, 0, null), line('M4 80 L116 80', C.white, 1.2), at(70, 64, 1.5, mayfly())),
  'insekt.mygga': all(skinBg(), at(64, 74, 2.0, mosquito()), circle(102, 78, 3, 'rgba(214,69,69,0.4)', null)),
};
