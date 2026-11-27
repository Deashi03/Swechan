/**
 * Kultur & fritid → Bildkonst & design → Skulptur & hantverk, 4531–4537 (0.63): sculpting in clay, stone carving,
 * wood carving, metal sculpture, ceramics and glass, textile crafts and craft training.
 * People are drawn with a posable worker (`wk`, every limb a joint chain) so that a pose can show sculpting, carving,
 * whittling or dipping; a statue is the same figure in one stone or bronze colour (`mono`). The part the word names is
 * orange (orange ring, frame, apron or arrow); grey figures and things are the reference.
 * Words that are easy to mix up get different kinds of picture: the person (skulptör: standing with finished works,
 * keramiker: with a shelf of pots) against the action (skulptera, glasera: a moving arm); the tool alone (mejsel,
 * klubba, täljkniv, virknål: an object in close-up) against the verb (hugga, snida, tälja, virka: the tool at work);
 * the finished thing (broderi, träsnideri, smide) against the making (brodera, snida, smida). Verbs move (base state =
 * poster frame, transform and opacity only). No letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, heart } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, deg: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, ...k);
const bg = (col: string) => rect(0, 0, 120, 120, col, 0, null);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
/** Rock a part about (cx, cy) by ±deg (coordinates of the parent). */
const rotAbout = (name: string, cx: number, cy: number, deg: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:rotate(0)}50%{transform:translate(${cx}px,${cy}px) rotate(${deg}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);
const slide = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:translate(0,0)}50%{transform:translate(${dx}px,${dy}px)}`, { dur }, ...k);

// ── Colours ───────────────────────────────────────────────────────────
const CLAY = '#a8826a', TERRA = '#c8693f', PLASTER = '#f3f0e8', STONE = '#b9b5ad', MARBLE = '#ece8e1';
const BRONZE = '#a7733b', WOOD = '#d7a86e', WOOD2 = '#b07a45', IRON = '#3d3f4a', GLOW = '#ffb23e';
const STUDIO = '#efe8dc', WALL = '#f4efe6';

// ── The posable worker ────────────────────────────────────────────────
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = {
  top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun'; apron?: string; goggles?: boolean;
  grey?: boolean; mono?: string; mouth?: 'smile' | 'flat' | 'o'; noArm?: 'L' | 'R' | 'both'; skirt?: string;
};
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
/** Worker with feet near (x, y); local height ≈ 86·s. */
function wk(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  const grey = o.grey ?? false, ink = C.ink, mono = o.mono;
  const skin = mono ?? (grey ? C.grey2 : (o.skin ?? C.skin)), top = mono ?? (grey ? C.grey : (o.top ?? C.sky)), leg = mono ?? (grey ? C.grey : (o.leg ?? C.navy));
  const hair = mono ?? (grey ? C.grey : (o.hair ?? C.hair)), shoe = mono ?? (grey ? C.grey : C.black);
  const limb = (from: Pt, j: [Pt, Pt], col: string, w: number) => {
    const d = `M${from[0]} ${from[1]} L${j[0][0]} ${j[0][1]} L${j[1][0]} ${j[1][1]}`;
    return all(line(d, ink, w + 2.4), line(d, col, w));
  };
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const hand = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 2.8, skin, ink, 1);
  const foot = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 3, shoe, ink, 1);
  const waist: Pt = [f1(p.h[0] + dx * 0.15), f1(p.h[1] + dy * 0.15)];
  const apron = o.apron && !mono ? g(`translate(${p.n[0]} ${p.n[1]}) rotate(${ang})`, path(`M-5 4 L5 4 L8 ${f1(len + 8)} L-8 ${f1(len + 8)} Z`, o.apron, ink, 1.2), line('M-5 4 L-4 -2 M5 4 L4 -2', ink, 0.8)) : '';
  const skirt = o.skirt && !mono ? g(`translate(${waist[0]} ${waist[1]}) rotate(${ang})`, path('M-6 0 L6 0 L12 15 Q0 18 -12 15 Z', o.skirt, ink, 1.4)) : '';
  const hairBack = o.hs === 'long' ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2)) : '';
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`,
    o.hs === 'bun' ? all(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2))
      : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`,
    o.goggles && !mono ? all(rect(-7, -2, 14, 5, '#bfe3f5', 2, ink, 1.2), line('M-8 0 L-9 1 M8 0 L9 1', ink, 1)) : all(circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null)),
    m === 'o' ? circle(0, 4.2, 1.2, '#c84a4a', ink, 0.8) : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  return at(x, y, s,
    hairBack, limb(p.h, p.lL, leg, 5), foot(p.lL), limb(p.h, p.lR, leg, 5), foot(p.lR), skirt,
    line(torso, ink, 14.4), line(torso, top, 12), apron,
    o.noArm === 'L' || o.noArm === 'both' ? '' : all(limb(p.n, p.aL, top, 4.4), hand(p.aL)), o.noArm === 'R' || o.noArm === 'both' ? '' : all(limb(p.n, p.aR, top, 4.4), hand(p.aR)),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face);
}
/** One arm of a worker drawn on its own (for animation), in the worker's local units. */
const wkArm = (x: number, y: number, s: number, from: Pt, j: [Pt, Pt], col: string = C.sky, extra: Svg = '') => {
  const d = `M${from[0]} ${from[1]} L${j[0][0]} ${j[0][1]} L${j[1][0]} ${j[1][1]}`;
  return at(x, y, s, line(d, C.ink, 6.8), line(d, col, 4.4), extra, circle(j[1][0], j[1][1], 2.8, C.skin, C.ink, 1));
};
const gx = (x: number, s: number, lx: number) => f1(x + s * lx);

// ── Sculpture objects ─────────────────────────────────────────────────
/** Head in profile facing right, on a neck; feet of the neck at (x, y). */
const headSide = (x: number, y: number, s: number, col: string, face = true) => at(x, y, s,
  rect(-6, -10, 12, 11, col, 2, C.ink, 1.4), ellipse(0, -24, 12, 15, col, C.ink, 1.6), path('M11 -26 L15 -20 L11 -18', col, C.ink, 1.2),
  face ? all(line('M3 -28 L8 -28', C.ink, 1.3), line('M4 -15 L9 -16', C.ink, 1.3), path('M-6 -24 C-3 -27 -3 -21 -6 -22', 'none', C.ink, 1)) : '');
/** Bust seen from the front: shoulders, neck and head; base at (x, y). */
const bust = (x: number, y: number, s: number, col: string, hair?: string) => at(x, y, s,
  path('M-24 0 C-24 -12 -14 -17 -7 -19 L7 -19 C14 -17 24 -12 24 0 Z', col, C.ink, 1.6), rect(-4.5, -27, 9, 9, col, 1, C.ink, 1.4),
  ellipse(0, -38, 10, 12.5, col, C.ink, 1.6), path('M-10 -40 C-10 -54 10 -54 10 -40 C6 -46 -6 -46 -10 -40 Z', hair ?? col, C.ink, 1.2),
  line('M-5 -39 L-2 -39 M2 -39 L5 -39', C.ink, 1.2), line('M0 -37 L-1 -33 L1 -33', C.ink, 1), line('M-3 -30 L3 -30', C.ink, 1.1));
const pedestal = (x: number, y: number, w: number, h: number, col = '#e6e0d4') => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.6), rect(x - w / 2 - 3, y - h - 4, w + 6, 5, col, 1, C.ink, 1.4));
/** Modelling stand: tripod with a turntable; top at (x, y). */
const stand = (x: number, y: number, h = 40) => all(line(`M${x} ${y + 3} L${x} ${y + h - 10} M${x} ${y + h - 10} L${x - 14} ${y + h} M${x} ${y + h - 10} L${x + 14} ${y + h} M${x} ${y + h - 10} L${x} ${y + h}`, C.brown, 2.6), rect(x - 14, y, 28, 4, C.tan, 1, C.ink, 1.4));
const statue = (x: number, y: number, s: number, col: string, p: Pose = STAND) => wk(x, y, s, p, { mono: col, mouth: 'flat' });
const crumbs = (x: number, y: number, col: string = CLAY) => all(circle(x, y, 1.6, col, null), circle(x + 4, y + 5, 1.2, col, null), circle(x - 3, y + 8, 1.4, col, null));
const chips = (x: number, y: number, col: string = STONE) => all(path(`M${x} ${y} l3 -2 l1 3 Z`, col, C.ink, 0.6), path(`M${x + 7} ${y - 6} l3 1 l-2 3 Z`, col, C.ink, 0.6), path(`M${x + 2} ${y - 11} l2 -2 l2 2 Z`, col, C.ink, 0.6));
/** Chisel pointing down (tip at 0,0 before rotation). */
const chisel = (x: number, y: number, deg: number, s = 1, col: string = C.silver) => rot(x, y, deg, s,
  path('M-2.6 -4 L2.6 -4 L1 2 L-1 2 Z', col, C.ink, 1), rect(-2.6, -30, 5.2, 26, col, 1, C.ink, 1.2), ellipse(0, -31, 4.4, 2.4, col, C.ink, 1.2));
/** Wood chisel (stämjärn-like) with a wooden handle. */
const woodChisel = (x: number, y: number, deg: number, s = 1) => rot(x, y, deg, s,
  path('M-3 -2 L3 -2 L3 2 L-3 2 Z', C.silver, C.ink, 1), rect(-2.2, -16, 4.4, 14, C.silver, 1, C.ink, 1.1), rect(-3.6, -34, 7.2, 18, WOOD2, 3, C.ink, 1.2));
/** Wooden mallet, head at (0,0) before rotation, handle downwards. */
const mallet = (x: number, y: number, deg: number, s = 1, col: string = WOOD2) => rot(x, y, deg, s,
  rect(-1.8, 2, 3.6, 26, C.tan, 1, C.ink, 1.2), rect(-11, -7, 22, 12, col, 4, C.ink, 1.6), line('M-6 -7 L-6 5 M6 -7 L6 5', '#8a5a2e', 1));
const knife = (x: number, y: number, deg: number, s = 1, handle: string = C.red) => rot(x, y, deg, s,
  path('M0 -3 L26 -2 C30 -1 30 2 26 3 L0 3 Z', C.silver, C.ink, 1.2), line('M2 0 L24 0', '#9aa2ab', 0.8), path('M-24 -4.5 L0 -4 L0 4 L-24 4.5 C-27 4 -27 -4 -24 -4.5 Z', handle, C.ink, 1.4));
const block = (x: number, y: number, w: number, h: number, col: string = STONE) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w} ${y - h} L${x + w - 6} ${y - h - 6} L${x - 6} ${y - h - 6} L${x - 6} ${y - 6} Z`, col, C.ink, 1.6), line(`M${x} ${y} L${x} ${y - h} L${x + w} ${y - h} M${x} ${y - h} L${x - 6} ${y - h - 6}`, C.ink, 1.2));
const speckle = (x0: number, y0: number, w: number, h: number, n: number, col: string = C.ink) => all(...range(n).map((i) => circle(f1(x0 + ((i * 37) % 97) / 97 * w), f1(y0 + ((i * 53) % 89) / 89 * h), 0.9, col, null)));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -10, 4, 10, C.brown, 1, null), path('M0 -40 L12 -10 L-12 -10 Z', '#3f7d4f', C.ink, 1.2), path('M0 -50 L9 -26 L-9 -26 Z', '#4f9d69', C.ink, 1.2));
const birch = (x: number, y: number, s = 1) => at(x, y, s, rect(-2.4, -34, 4.8, 34, C.white, 1, C.ink, 1), line('M-2 -24 L1 -24 M-1 -12 L2 -12', C.ink, 1), circle(0, -40, 11, '#7fbf6a', C.ink, 1.2));

// ── Wood, metal, glass and textile objects ────────────────────────────
const dalaHorse = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s,
  path('M-20 0 L-19 -14 C-21 -20 -17 -24 -11 -24 L7 -24 L11 -36 C13 -43 23 -43 25 -37 L27 -31 L23 -29 L19 -22 L19 0 L11 0 L11 -9 L-11 -9 L-11 0 Z', col, C.ink, 1.8),
  path('M-6 -24 C-2 -14 4 -14 7 -24', 'none', C.white, 1.8), path('M11 -36 C13 -32 17 -30 21 -32', 'none', C.white, 1.4), circle(20, -36, 1.2, C.ink, null),
  path('M-15 -18 C-13 -22 -9 -22 -8 -18', 'none', C.yellow, 1.6), circle(-12, -15, 1.6, C.green, null), circle(13, -16, 1.6, C.yellow, null), line('M12 -40 L8 -32', C.ink, 1.6),
  path('M-19 -16 C-26 -14 -26 -6 -22 -2', 'none', C.ink, 2.2));
const kasa = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-15 -10 L13 -10 C13 4 7 11 -1 11 C-9 11 -15 4 -15 -10 Z', WOOD, C.ink, 1.8), path('M13 -10 C26 -12 27 2 15 1', WOOD, C.ink, 1.8), circle(19, -5, 2.6, '#f2ead8', C.ink, 1),
  line('M-11 -4 C-6 -2 0 -6 6 -3 M-9 3 C-4 5 2 1 7 4', WOOD2, 1), ellipse(-1, -10, 14, 3, '#6b3e1f', C.ink, 1.2));
const spiral = (x: number, y: number, r: number, flip = false) => g(`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`, path(`M0 0 C${r} 0 ${r} ${-r * 1.4} 0 ${-r * 1.4} C${-r * 0.8} ${-r * 1.4} ${-r * 0.8} ${-r * 0.5} 0 ${-r * 0.5}`, 'none', IRON, 2.2));
const vase = (x: number, y: number, s = 1, col: string = C.sky, stroke: string = C.ink) => at(x, y, s, path('M-6 -34 L6 -34 L5 -28 C14 -20 14 -4 7 0 L-7 0 C-14 -4 -14 -20 -5 -28 Z', col, stroke, 1.6));
const bowl = (x: number, y: number, s = 1, col: string = C.sky, glaze?: string) => at(x, y, s, path('M-16 -10 L16 -10 C15 0 9 6 0 6 C-9 6 -15 0 -16 -10 Z', col, C.ink, 1.6),
  glaze ? path('M-16 -10 L16 -10 C16 -6 15 -3 14 -2 C8 1 -8 1 -14 -2 C-15 -3 -16 -6 -16 -10 Z', glaze, C.ink, 1) : '', ellipse(0, -10, 16, 3, '#5a4636', C.ink, 1.2));
const yarnBall = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 1.6), path(`M${x - r * 0.8} ${y - r * 0.3} C${x - r * 0.2} ${y - r * 0.9} ${x + r * 0.4} ${y - r * 0.6} ${x + r * 0.8} ${y + r * 0.2}`, 'none', C.ink, 0.9),
  path(`M${x - r * 0.7} ${y + r * 0.4} C${x - r * 0.1} ${y - r * 0.2} ${x + r * 0.5} ${y + r * 0.1} ${x + r * 0.5} ${y + r * 0.7}`, 'none', C.ink, 0.9), path(`M${x - r * 0.3} ${y - r * 0.9} C${x + r * 0.2} ${y - r * 0.2} ${x + r * 0.1} ${y + r * 0.5} ${x - r * 0.2} ${y + r * 0.95}`, 'none', C.ink, 0.9));
/** Rows of knitted stitches (small V shapes). */
const knit = (x0: number, y0: number, cols: number, rows: number, col: string, w = 6, h = 5) => all(rect(x0, y0, cols * w, rows * h, col, 1, C.ink, 1.4),
  ...range(rows).flatMap((r) => range(cols).map((c) => line(`M${x0 + c * w + 0.8} ${y0 + r * h + 0.8} L${x0 + c * w + w / 2} ${y0 + r * h + h - 0.8} L${x0 + c * w + w - 0.8} ${y0 + r * h + 0.8}`, 'rgba(0,0,0,0.28)', 0.9))));
const hook = (x: number, y: number, deg: number, s = 1, col: string = C.gold) => rot(x, y, deg, s, rect(-1.6, -2, 3.2, 40, col, 1.6, C.ink, 1.2), path('M-1.6 -2 C-1.6 -8 4 -8 3.6 -4 L1.6 -3', 'none', C.ink, 1.4), rect(-3, 18, 6, 10, '#6b7fa8', 2, C.ink, 1));
const hoop = (x: number, y: number, r: number) => all(circle(x, y, r, '#f6f1e6', '#b9894f', 4), circle(x, y, r + 2.5, 'none', C.ink, 1), circle(x, y, r - 2.5, 'none', C.ink, 0.8), rect(x - 3, y - r - 7, 6, 6, '#b9894f', 1, C.ink, 1));
const flower = (x: number, y: number, r: number, col: string, mid: string = C.yellow) => all(...range(5).map((i) => { const a = (i / 5) * Math.PI * 2; return circle(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r), r * 0.75, col, C.ink, 0.6); }), circle(x, y, r * 0.6, mid, C.ink, 0.6));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, C.gold, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.9));
const bench = (x: number, y: number, w: number) => all(rect(x, y, w, 7, WOOD, 1.5, C.ink, 1.6), line(`M${x + 5} ${y + 7} L${x + 5} 112 M${x + w - 5} ${y + 7} L${x + w - 5} 112`, WOOD2, 3.4));

export const SCULP_MOTIFS: Record<string, Svg> = {
  // ── 4531 Skulptera i lera ──────────────────────────────────────────
  // skulptör: the person – a sculptor in an orange apron stands proudly between finished works on pedestals
  'sculp.skulptör': all(bg(STUDIO), ground(), pedestal(22, 112, 18, 30), bust(22, 78, 0.62, PLASTER), pedestal(98, 112, 18, 24), statue(98, 84, 0.42, BRONZE, pose({ aL: [[-8, -76], [-6, -90]] })),
    wk(60, 111, 0.98, pose({ aL: [[-10, -54], [-16, -44]], aR: [[11, -56], [4, -48]] }), { top: C.green, leg: C.navy, apron: HL, hs: 'short' })),
  // skulptera: the action – a woman shapes a clay head on a stand; her arm with the tool moves
  'sculp.skulptera': all(bg(STUDIO), ground(), stand(84, 64, 48), headSide(84, 64, 0.95, CLAY), crumbs(98, 76),
    wk(40, 111, 0.98, pose({ n: [3, -68], aL: [[12, -58], [26, -56]] }), { top: C.purple, leg: C.dark, hs: 'bun', noArm: 'R', apron: '#e8dccb' }),
    rotAbout('sculp-skulptera', gx(40, 0.98, 3), 111 - 0.98 * 68, -10, 1.4, wkArm(40, 111, 0.98, [3, -68], [[22, -68], [40, -74]], C.purple, rot(42, -76, 30, 1, rect(-1.2, -8, 2.4, 14, WOOD2, 1, C.ink, 0.8), circle(0, -9, 2.6, 'none', C.silver, 1.4))))),
  // ståltråd: a coil of steel wire and a small wire skeleton bent from it
  'sculp.ståltråd': all(bg('#eef0f2'), ground(),
    ...range(6).map((i) => ellipse(34, 92 - i * 2.4, 20, 9, 'none', C.dark, 1.6)), ring(34, 86, 25),
    rect(66, 104, 40, 6, WOOD2, 1, C.ink, 1.4), line('M86 104 L86 84 M86 84 L86 62 M86 66 L74 78 M86 66 L98 76 M86 84 L78 104 M86 84 L94 104', C.dark, 2.4), circle(86, 55, 7, 'none', C.dark, 2.4),
    line('M54 86 C62 82 66 76 70 68', C.dark, 1.6)),
  // byst: head, neck and shoulders in bronze on a pedestal; a small grey full statue as the reference
  'sculp.byst': all(bg(WALL), ground(), greyed(pedestal(22, 112, 14, 20), statue(22, 88, 0.42, STONE)),
    pedestal(70, 112, 30, 40), bust(70, 68, 1.05, BRONZE, '#7d5228'), frame(40, 10, 60, 62)),
  // terrakotta: red-brown unglazed things – a pot, a small soldier and a tile
  'sculp.terrakotta': all(bg('#f5ece2'), ground(),
    at(30, 112, 1, path('M-16 -40 L16 -40 L12 0 L-12 0 Z', TERRA, C.ink, 1.8), rect(-19, -46, 38, 7, TERRA, 1, C.ink, 1.6)),
    statue(66, 111, 0.62, TERRA, pose({ aL: [[-8, -56], [-6, -46]], aR: [[8, -56], [6, -46]] })),
    rect(86, 82, 26, 26, TERRA, 2, C.ink, 1.6), path('M90 95 C94 88 104 88 108 95 C104 102 94 102 90 95 Z', 'none', '#9a4a28', 1.6), ring(66, 70, 34)),
  // gips: plaster – a sack of white powder, a bowl of white paste and water
  'sculp.gips.2': all(bg('#e9eef2'), ground(),
    path('M14 112 L18 52 C24 48 44 48 50 52 L54 112 Z', '#e8dcc4', C.ink, 1.8), path('M18 52 C26 60 42 60 50 52 C44 46 24 46 18 52 Z', PLASTER, C.ink, 1.4), path('M50 60 C58 66 60 80 58 96 C66 96 70 104 70 112 L56 112', PLASTER, C.ink, 1.2),
    bowl(90, 106, 1.1, '#9fb3c0'), path('M73 95 C78 91 102 91 107 95', PLASTER, C.ink, 1.2), ellipse(90, 95, 15, 3.2, PLASTER, null),
    line('M96 94 L110 72', C.brown, 2.4), ring(34, 80, 30)),
  // avgjutning: white plaster is poured into a mould of the clay head, and a white copy comes out next to the original
  'sculp.avgjutning': all(bg(STUDIO), ground(), greyed(headSide(20, 112, 0.7, CLAY)),
    rect(42, 70, 34, 42, '#c4a27a', 2, C.ink, 1.8), line('M59 70 L59 112', C.ink, 1.4), rect(46, 74, 26, 34, '#8f7356', 2, null), g('translate(61 110) scale(0.62)', ellipse(0, -24, 12, 15, '#5e4a38', null), rect(-6, -10, 12, 11, '#5e4a38', 1, null), path('M11 -26 L15 -20 L11 -18', '#5e4a38', null)), ellipse(61, 86, 6, 4, PLASTER, null),
    rot(80, 40, -40, 1, path('M-10 -12 L10 -12 L8 10 L-8 10 Z', '#7d93a6', C.ink, 1.6), ellipse(0, -12, 10, 3, PLASTER, C.ink, 1)),
    waPulse('sculp-avgj-ström', path('M68 50 C64 56 62 62 62 72', 'none', PLASTER, 4), path('M68 50 C64 56 62 62 62 72', 'none', C.ink, 0.6)),
    arrow(80, 100, 90, 100, HL, 2.2), waGrow('sculp-avgj-kopia', headSide(104, 112, 0.7, PLASTER))),
  // i naturlig storlek: a man next to a statue of himself that is exactly as tall; a grey miniature for contrast
  'sculp.i-naturlig-storlek': all(bg(WALL), ground(), line('M14 32 L108 32 M14 111 L108 111', HL, 1.6, '4 3'),
    wk(36, 111, 0.98, STAND, { top: C.green, leg: C.navy }), pedestal(78, 112, 26, 0.1), statue(78, 111, 0.98, STONE), greyed(statue(106, 111, 0.3, STONE)),
    arrow(58, 72, 58, 34, HL, 2), arrow(58, 72, 58, 109, HL, 2)),
  // modell (person): a model sits still on a stool on a platform while a grey artist works
  'sculp.modell.3': all(bg(STUDIO), ground(), rect(52, 96, 56, 16, '#c9a98a', 2, C.ink, 1.6), line('M74 96 L74 74 M90 96 L90 74', C.brown, 3), rect(70, 70, 24, 5, C.brown, 1, C.ink, 1.2),
    wk(80, 96, 0.82, pose({ h: [0, -32], n: [0, -58], aL: [[-8, -46], [2, -66]], aR: [[10, -46], [8, -34]], lL: [[-10, -30], [-12, -1]], lR: [[12, -26], [14, -1]] }), { top: C.red, leg: C.dark, hs: 'long', mouth: 'flat' }),
    greyed(wk(24, 111, 0.82, pose({ aR: [[10, -60], [20, -66]] }), { apron: C.grey2 }), stand(26, 70, 42), headSide(26, 70, 0.5, CLAY, false)), ring(80, 50, 18)),

  // ── 4532 Stenhuggeri ───────────────────────────────────────────────
  // stenhuggeri: the workshop – a shed with stone blocks and gravestone blanks outside and a crane
  'sculp.stenhuggeri': all(bg('#e8eef3'), ground(), path('M10 112 L10 54 L50 34 L90 54 L90 112 Z', '#c9b9a3', C.ink, 1.8), rect(34, 74, 32, 38, '#5a5048', 2, C.ink, 1.6),
    line('M98 112 L98 22 L66 22 M98 30 L90 22', C.dark, 3), line('M72 22 L72 44', C.ink, 1.2), path('M69 44 L75 44 L72 50 Z', C.dark, null),
    block(18, 112, 14, 12), block(96, 112, 16, 18, '#9c9a96'), speckle(96, 94, 16, 18, 12),
    at(110, 112, 1, path('M-6 0 L-6 -20 C-6 -26 6 -26 6 -20 L6 0 Z', '#8d8a86', C.ink, 1.4)), frame(6, 18, 108, 96)),
  // hugga (i sten): a stone mason strikes the chisel with a mallet; a face appears in the block and chips fly
  'sculp.hugga.2': all(bg('#eef1f4'), ground(), block(62, 112, 46, 54, MARBLE),
    path('M88 74 C82 74 80 66 84 62 C82 56 90 52 96 56 C102 54 106 62 102 68 C104 74 96 78 92 76', '#e2ddd5', C.ink, 1.2), line('M88 64 L92 64 M96 64 L99 64 M91 70 L96 70', C.ink, 1),
    wk(32, 111, 0.92, pose({ n: [4, -68], aL: [[16, -60], [28, -62]] }), { top: C.denim, leg: C.dark, goggles: true, noArm: 'R' }), chisel(62, 62, -64, 0.8),
    rotAbout('sculp-hugga', gx(32, 0.92, 4), 111 - 0.92 * 68, -26, 0.9, wkArm(32, 111, 0.92, [4, -68], [[18, -82], [30, -84]], C.denim, mallet(34, -88, -70, 0.7))),
    waIn('sculp-hugga-flis', -10, 6, chips(66, 54, MARBLE))),
  // klubba: the round wooden mallet in close-up (orange ring); the chisel it strikes is grey
  'sculp.klubba': all(bg('#f2ede4'), greyed(chisel(34, 104, 20, 1.4)), mallet(70, 46, -40, 2.1), ring(66, 44, 32), line('M40 40 L32 34 M44 32 L40 24', C.ink, 1.4)),
  // mejsel: three steel chisels of different widths on a cloth; the middle one is marked, with stone chips at its tip
  'sculp.mejsel': all(bg('#e7e3dc'), rect(10, 20, 100, 84, '#c5b49a', 4, C.ink, 1.4),
    greyed(chisel(32, 92, 0, 1.6)), chisel(60, 96, 0, 2), greyed(chisel(88, 92, 0, 1.6)), chips(56, 104, STONE), ring(60, 92, 9)),
  // inskription: a stone slab with carved signs and a year, the carved text framed
  'sculp.inskription': all(bg('#e7ecef'), ground(), path('M20 112 L20 34 C20 14 100 14 100 34 L100 112 Z', '#a9a6a1', C.ink, 1.8), speckle(24, 22, 72, 88, 26, '#8b8883'),
    ...[40, 52, 64].map((y, i) => line(`M32 ${y} L${88 - i * 8} ${y}`, '#55524e', 3, '5 2 2 2')), num(60, 88, '1742', 15, '#4a4743'), frame(26, 32, 68, 62)),

  // ── 4533 Träsnideri ────────────────────────────────────────────────
  // träsnideri: a carved wooden panel with leaves and a flower, and small carved animals on a shelf
  'sculp.träsnideri': all(bg('#f3ece0'), rect(14, 10, 62, 92, WOOD, 3, C.ink, 1.8), rect(20, 16, 50, 80, '#c9945a', 2, C.ink, 1.2),
    path('M45 90 C45 70 45 50 45 30', 'none', '#8a5a2e', 3), ...[[34, 70, -1], [56, 60, 1], [34, 46, -1], [56, 38, 1]].map(([x, y, d]) => path(`M45 ${y! + 4} C${x! + d! * 4} ${y! - 2} ${x} ${y! - 6} ${x} ${y}`, '#e2b47a', C.ink, 1.2)),
    flower(45, 26, 5, '#e2b47a', '#8a5a2e'), rect(82, 78, 34, 4, WOOD2, 1, C.ink, 1.2),
    at(92, 78, 1, path('M-8 0 L-8 -8 C-8 -14 -2 -16 2 -14 C4 -18 10 -18 10 -12 L10 0 Z', '#c9945a', C.ink, 1.2), circle(6, -14, 1, C.ink, null)), at(108, 78, 1, path('M-5 0 C-6 -8 0 -12 4 -10 L8 -12 L5 -7 C6 -3 4 0 0 0 Z', '#c9945a', C.ink, 1.2)), frame(10, 6, 70, 100)),
  // snida: a carver taps a wood chisel with a mallet and cuts a flower into a board on the bench; chips fly
  'sculp.snida': all(bg('#f3ece0'), ground(), bench(56, 82, 58), rect(64, 66, 44, 16, WOOD, 2, C.ink, 1.6), flower(90, 74, 3.4, '#e2b47a', '#8a5a2e'), line('M70 74 C76 70 80 78 86 74', '#8a5a2e', 1.4),
    wk(30, 111, 0.92, pose({ n: [4, -66], aL: [[16, -56], [34, -54]] }), { top: C.green, leg: C.dark, apron: '#e8dccb' }), woodChisel(66, 72, -50, 0.9),
    rotAbout('sculp-snida', gx(30, 0.92, 4), 111 - 0.92 * 66, -18, 1, wkArm(30, 111, 0.92, [4, -66], [[16, -78], [30, -76]], C.green, mallet(32, -80, -60, 0.55))),
    waIn('sculp-snida-spån', -8, 4, path('M74 62 c2 -3 5 -3 6 0', 'none', WOOD2, 1.6), path('M80 56 c2 -3 5 -3 6 0', 'none', WOOD2, 1.6))),
  // tälja: a man sits on a stump by a lake and whittles a stick away from himself; curly shavings fall
  'sculp.tälja': all(bg('#e6f0e8'), rect(0, 86, 120, 26, '#9bc6dc', 0, null), ground(112, '#7d9c6a'), tree(102, 86, 0.8), birch(14, 86, 0.9),
    rect(28, 92, 22, 20, WOOD2, 2, C.ink, 1.4), ellipse(39, 92, 11, 3, '#e2b47a', C.ink, 1.2),
    wk(40, 111, 0.92, pose({ h: [0, -22], n: [0, -48], aL: [[8, -36], [18, -34]], lL: [[14, -20], [16, -1]], lR: [[17, -19], [20, -1]] }), { top: C.red, leg: C.navy, noArm: 'R' }),
    line('M56 80 L80 72', '#c9945a', 3.4),
    slide('sculp-tälja', 8, -3, 1.2, wkArm(40, 111, 0.92, [0, -48], [[12, -38], [24, -38]], C.red, knife(30, -38, -18, 0.32, WOOD2))),
    waIn('sculp-tälja-spån', -6, -8, path('M70 86 c3 -2 5 1 3 4 c-2 2 -5 0 -3 -2', 'none', '#c9945a', 1.6), path('M78 96 c3 -2 5 1 3 4', 'none', '#c9945a', 1.6))),
  // täljkniv: the short whittling knife with a wooden handle in close-up, its leather sheath below
  'sculp.täljkniv': all(bg('#efe9df'), knife(54, 52, -12, 1.5, WOOD2), path('M24 82 L74 80 C82 80 84 92 76 94 L24 96 C18 96 18 82 24 82 Z', '#7a4a2a', C.ink, 1.8), line('M30 89 L70 87', '#5a3418', 1, '3 2'), ring(84, 46, 22),
    greyed(line('M92 104 L114 96', '#c9945a', 3), path('M96 108 c2 -2 4 0 2 2', 'none', '#c9945a', 1.4))),
  // dalahäst: the red wooden horse with painted harness and flowers
  'sculp.dalahäst': all(bg('#eef3f6'), ground(), dalaHorse(56, 111, 2.1)),
  // kåsa: a wooden cup with a handle hangs from a cord by a campfire; steam rises from the coffee
  'sculp.kåsa': all(bg('#e9f1e6'), ground(112, '#7d9c6a'), tree(16, 112, 1), line('M84 112 L92 98 L100 112 M88 112 L100 100', C.brown, 2.4), waPulse('sculp-kåsa-eld', path('M92 108 C88 100 94 96 92 90 C98 96 100 102 96 108 Z', C.orange, C.ink, 1)),
    kasa(52, 66, 1.9), line('M70 54 C78 46 80 40 78 30', C.brown, 1.4), waBob('sculp-kåsa-ånga', 4, line('M44 40 C40 34 48 30 44 22 M56 40 C52 34 60 30 56 22', C.grey, 1.6)), ring(54, 62, 34)),

  // ── 4534 Metallskulptur ────────────────────────────────────────────
  // smide: a black wrought-iron garden gate with spirals and leaves
  'sculp.smide': all(bg('#e9f0e4'), ground(112, '#7d9c6a'), rect(12, 30, 10, 82, '#b9b5ad', 1, C.ink, 1.6), rect(98, 30, 10, 82, '#b9b5ad', 1, C.ink, 1.6),
    line('M22 108 L98 108 M22 44 L98 44 M22 60 L98 60', IRON, 2.6), ...[32, 44, 56, 64, 76, 88].map((x) => line(`M${x} 44 L${x} 108`, IRON, 2.2)),
    ...[30, 50, 70, 90].map((x, i) => spiral(x, 58, 6, i % 2 === 1)), path('M22 44 C40 26 80 26 98 44', 'none', IRON, 2.6), spiral(60, 36, 6), spiral(60, 36, 6, true), frame(8, 18, 104, 94)),
  // offentlig konst: a big orange sculpture on a town square; people walk past it
  'sculp.offentlig-konst': all(bg('#e6eef4'), rect(0, 96, 120, 24, '#d8d3ca', 0, null), path('M0 96 L0 40 L24 40 L24 30 L44 30 L44 96 Z M76 96 L76 36 L120 36 L120 96 Z', '#c9c0b2', C.ink, 1.4),
    ...[[6, 48], [16, 48], [28, 40], [36, 40], [84, 46], [96, 46], [108, 46]].map(([x, y]) => rect(x!, y!, 6, 8, '#bfe3f5', 1, C.ink, 0.8)),
    rect(52, 96, 16, 6, '#9c978e', 1, C.ink, 1.2), path('M60 96 C40 80 50 50 62 44 C72 40 80 52 70 62 C62 70 76 84 68 96 Z', HL, C.ink, 1.8),
    greyed(wk(22, 116, 0.5, pose({ lL: [[-6, -20], [-10, -1]], lR: [[6, -20], [10, -1]] })), wk(96, 116, 0.5, pose({ lL: [[-6, -20], [-10, -1]], lR: [[6, -20], [10, -1]] }), { hs: 'long' })),
    wk(84, 118, 0.42, pose({ aR: [[8, -62], [4, -76]] }), { top: C.yellow })),
  // installation (konst): a white room filled with hanging lamps and metal sheets that a visitor walks through
  'sculp.installation.3': all(bg('#fafaf7'), path('M0 0 L24 20 L96 20 L120 0 Z', '#ecebe6', null), path('M0 120 L24 96 L96 96 L120 120 Z', '#dedbd2', null), path('M0 0 L24 20 L24 96 L0 120 Z M120 0 L96 20 L96 96 L120 120 Z', '#e6e4dd', null),
    line('M24 20 L96 20 L96 96 L24 96 Z', C.ink, 1),
    ...range(7).map((i) => { const x = 30 + i * 10, y = 40 + ((i * 17) % 30); return all(line(`M${x} 20 L${x} ${y}`, C.ink, 0.8), i % 2 ? rect(x - 4, y, 8, 12, C.silver, 1, C.ink, 1) : circle(x, y + 4, 4, C.yellow, C.ink, 1)); }),
    waPulse('sculp-inst', ...range(4).map((i) => circle(30 + i * 20, 46 + ((i * 2 * 17) % 30), 7, 'rgba(242,193,78,0.35)', null))),
    wk(58, 108, 0.55, pose({ lL: [[-6, -20], [-10, -1]], lR: [[6, -20], [10, -1]] }), { top: C.purple }), frame(22, 18, 76, 80)),

  // ── 4535 Keramik och glas ──────────────────────────────────────────
  // keramiker: the person – a potter in an orange apron holds up a finished bowl in front of shelves with pots
  'sculp.keramiker': all(bg('#f1ebe2'), ground(), rect(64, 26, 50, 4, WOOD2, 1, C.ink, 1.2), rect(64, 58, 50, 4, WOOD2, 1, C.ink, 1.2),
    vase(74, 26, 0.6, '#7fa7c4'), bowl(92, 24, 0.6, '#d9c3a0', '#5f9c8a'), vase(106, 26, 0.5, TERRA), bowl(76, 56, 0.6, '#d9c3a0', '#c9583a'), vase(96, 58, 0.66, '#e6dccb'),
    wk(38, 111, 1.0, pose({ aL: [[-12, -56], [-8, -48]], aR: [[12, -56], [8, -48]] }), { top: C.denim, leg: C.dark, apron: HL, hs: 'long' }), bowl(38, 64, 0.7, '#d9c3a0', '#5f9c8a')),
  // glasera: a potter behind a table dips a bowl into a bucket of blue glaze (moves down and up), blue drops
  'sculp.glasera': all(bg('#eef1f4'), wk(60, 120, 1.0, pose({ aL: [[-12, -58], [-4, -48]], aR: [[12, -58], [4, -48]] }), { top: C.green, apron: '#e8dccb', hs: 'bun' }),
    rect(4, 92, 112, 8, WOOD, 1.5, C.ink, 1.6), rect(4, 100, 112, 20, WOOD2, 0, C.ink, 1.2),
    path('M42 92 L44 66 L76 66 L78 92 Z', '#9aa3ad', C.ink, 1.6), ellipse(60, 66, 16, 4, '#3f6fb5', C.ink, 1.4),
    slide('sculp-glasera', 0, 14, 2.2, bowl(60, 62, 0.8, '#e6dccb', C.denim), path('M54 66 C54 70 56 70 56 66 M64 66 C64 71 66 71 66 66', 'none', C.denim, 1.6)),
    arrow(92, 46, 92, 64, HL, 2.4)),
  // lergods: earthenware – red-brown jug and bowl fired at low heat (low flame and thermometer); water seeps through
  'sculp.lergods': all(bg('#f4ede4'), ground(), at(34, 112, 1, path('M-14 0 C-20 -12 -18 -30 -8 -36 L-8 -46 L8 -46 L8 -36 C18 -30 20 -12 14 0 Z', '#b9653d', C.ink, 1.8), path('M8 -42 C18 -42 20 -26 12 -22', 'none', C.ink, 2)),
    path('M22 96 C22 100 24 102 24 104 M44 92 C44 96 46 98 46 100', 'none', C.sky, 2), circle(24, 106, 1.6, C.sky, null), circle(46, 102, 1.6, C.sky, null),
    bowl(76, 112, 1.1, '#b9653d'), rect(98, 44, 8, 52, C.white, 4, C.ink, 1.4), rect(100, 76, 4, 18, C.red, 2, null), circle(102, 100, 6, C.red, C.ink, 1.4),
    path('M70 90 C68 84 74 82 72 76 C78 80 80 86 76 90 Z', C.orange, C.ink, 1), ring(52, 84, 40)),
  // glasbruk: a red glassworks in the Småland forest with a chimney; the furnace glows through the open door
  'sculp.glasbruk': all(bg('#e2ecf2'), ground(112, '#7d9c6a'), tree(10, 112, 0.9), tree(112, 112, 0.8), path('M18 112 L18 58 L60 38 L102 58 L102 112 Z', '#a8332e', C.ink, 1.8), rect(80, 18, 12, 34, '#8a8682', 1, C.ink, 1.6),
    waBob('sculp-glasbruk-rök', 4, circle(86, 12, 5, C.grey2, null), circle(92, 6, 4, C.grey2, null)), rect(44, 74, 32, 38, '#3a2a22', 2, C.ink, 1.6),
    waPulse('sculp-glasbruk-ugn', circle(60, 96, 10, GLOW, null), circle(60, 96, 5, C.yellow, null)), rect(24, 66, 14, 14, '#bfe3f5', 1, C.ink, 1.2), rect(82, 66, 14, 14, '#bfe3f5', 1, C.ink, 1.2),
    vase(31, 79, 0.3, C.denim), vase(89, 79, 0.3, C.green), frame(14, 14, 92, 100)),
  // glasblåsning: the end of a long pipe with a glowing glass bubble that grows as air is blown in
  'sculp.glasblåsning': all(bg('#2e2b33'), rect(0, 96, 120, 24, '#3d3a44', 0, null), line('M4 40 L62 66', '#8a8f98', 4), line('M4 40 L62 66', C.ink, 0.8),
    waIn('sculp-glasbl-luft', -16, -7, arrow(16, 44, 34, 52, C.sky, 2.2)), waGrow('sculp-glasbl-bubbla', circle(80, 74, 20, GLOW, C.ink, 1.6), circle(80, 74, 11, '#ffe08a', null), circle(74, 68, 4, '#fff6d2', null)),
    path('M64 98 C72 104 88 104 96 98', 'none', HL, 2.2), arrow(94, 100, 98, 96, HL, 2.2)),
  // kristall (glas): a heavy cut-crystal vase with facets that sparkles; a plain grey glass beside it
  'sculp.kristall.2': all(bg('#eef2f6'), ground(), greyed(path('M14 112 L16 78 L34 78 L36 112 Z', 'rgba(220,240,252,0.6)', C.ink, 1.4)),
    path('M54 112 L50 50 L94 50 L90 112 Z', 'rgba(210,232,248,0.85)', C.ink, 2), ...[60, 72, 84].map((x) => line(`M${x} 52 L${x - 2} 110`, '#8fb2cc', 1.2)), ...[66, 82, 98].map((y) => line(`M52 ${y} L92 ${y}`, '#8fb2cc', 1.2)),
    ...[[56, 58], [80, 70], [62, 90]].map(([x, y]) => path(`M${x} ${y} l6 6 l-6 6 l-6 -6 Z`, '#e6f3fc', '#8fb2cc', 1)),
    waPulse('sculp-kristall', sparkle(98, 46, 7, C.gold), sparkle(46, 66, 5, C.gold), sparkle(86, 92, 4, C.gold)), ring(72, 80, 32)),

  // ── 4536 Textilt hantverk ──────────────────────────────────────────
  // sticka (med garn): two knitting needles and a growing piece of knitting with yarn from a ball; the needles move
  'sculp.sticka.4': all(bg('#f4eef4'), yarnBall(98, 92, 14, C.purple), path('M84 92 C70 96 66 80 58 70', 'none', C.purple, 2),
    knit(30, 60, 6, 7, C.purple), rotAbout('sculp-sticka-v', 40, 60, 8, 1.1, line('M14 70 L64 50', C.ink, 4.4), line('M14 70 L64 50', C.silver, 3), circle(14, 70, 3, C.red, C.ink, 1)),
    rotAbout('sculp-sticka-h', 50, 60, -8, 1.1, line('M86 70 L36 50', C.ink, 4.4), line('M86 70 L36 50', C.silver, 3), circle(86, 70, 3, C.red, C.ink, 1))),
  // virka: one crochet hook pulls a loop of yarn through a round piece of crochet (the hook moves in and out)
  'sculp.virka': all(bg('#eef4f0'), yarnBall(100, 96, 13, C.green), path('M88 96 C76 98 72 86 66 80', 'none', C.green, 2),
    circle(48, 74, 26, '#a8dcc0', C.ink, 1.6), circle(48, 74, 16, 'none', C.green, 3, ), circle(48, 74, 7, C.yellow, C.ink, 1.2), ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return circle(f1(48 + Math.cos(a) * 22), f1(74 + Math.sin(a) * 22), 2.6, 'none', C.green, 1.4); }),
    slide('sculp-virka', 8, -8, 1.2, hook(76, 50, 45, 1.2), path('M70 54 C66 50 70 46 74 50', 'none', C.green, 2))),
  // virknål: crochet hooks of three sizes; the big one is marked, its little hook shown enlarged
  'sculp.virknål': all(bg('#f2efe8'), greyed(hook(24, 30, 0, 1.1, C.sky), hook(100, 30, 0, 1.1, C.pink)), hook(62, 24, 0, 1.8), circle(62, 20, 12, 'none', HL, 2.6), line('M74 24 L86 52', HL, 1.4, '3 2')),
  // brodera: a needle with red thread goes up and down through cloth in an embroidery hoop where a flower is half done
  'sculp.brodera': all(bg('#f6f0ea'), hoop(56, 66, 40), flower(48, 70, 6, C.red), path('M66 60 l4 4 m-4 0 l4 -4 M72 66 l4 4 m-4 0 l4 -4', 'none', C.red, 1.2), line('M48 80 L48 100', C.green, 2.4),
    slide('sculp-brodera', 0, 12, 1.4, line('M70 34 L70 62', C.silver, 2.4), circle(70, 36, 1.4, '#f6f0ea', C.ink, 0.6), path('M70 36 C80 38 84 52 76 62', 'none', C.red, 1.4))),
  // broderi: a finished embroidered cushion with flowers and leaves (no needle)
  'sculp.broderi': all(bg('#efe8de'), rect(14, 26, 92, 72, '#f6f0e6', 10, C.ink, 2), rect(20, 32, 80, 60, 'none', 8, '#c9b9a3', 1, ),
    flower(40, 58, 7, C.red), flower(80, 58, 7, C.denim), flower(60, 74, 6, C.yellow, C.red), ...[[50, 66], [70, 66], [40, 76], [80, 76]].map(([x, y]) => path(`M${x} ${y} c3 -4 7 -4 8 0 c-3 3 -6 3 -8 0`, C.green, C.ink, 0.6)),
    path('M30 40 l3 3 m-3 0 l3 -3 M86 40 l3 3 m-3 0 l3 -3 M30 82 l3 3 m-3 0 l3 -3 M86 82 l3 3 m-3 0 l3 -3', 'none', C.red, 1.2), frame(10, 22, 100, 80)),
  // tova: fluffy wool (grey) becomes a firm felt ball when rubbed in soapy water; the ball rolls back and forth
  'sculp.tova': all(bg('#eaf2f6'), rect(10, 70, 100, 40, '#cfe6f2', 4, C.ink, 1.6), greyed(path('M14 54 C10 44 22 38 28 44 C32 36 44 40 42 48 C50 50 46 62 38 60 C34 66 22 64 22 58 C14 62 10 58 14 54 Z', '#f2efe6', C.ink, 1.2)),
    arrow(46, 50, 60, 50, C.ink, 2), ...[[30, 80], [50, 96], [80, 82], [96, 98], [66, 104]].map(([x, y]) => circle(x!, y!, 4, 'rgba(255,255,255,0.8)', '#9cc4dc', 1)),
    waShake('sculp-tova', circle(76, 54, 13, C.red, C.ink, 1.8), path('M66 50 C72 46 82 48 86 54 M68 60 C74 62 82 60 86 58', 'none', '#a83434', 1.2)), ring(76, 54, 18)),
  // lapptäcke: a quilt of many coloured squares on a bed
  'sculp.lapptäcke': all(bg('#f2ede4'), ground(), rect(8, 84, 104, 12, WOOD2, 2, C.ink, 1.6), line('M14 96 L14 110 M106 96 L106 110', WOOD2, 3.4), rect(10, 52, 18, 30, C.white, 5, C.ink, 1.4),
    ...range(3).flatMap((r) => range(5).map((c) => rect(30 + c * 16, 48 + r * 12, 16, 12, [C.red, C.yellow, C.denim, C.mint, C.pink, C.orange, C.lilac][(r * 5 + c * 3) % 7]!, 0, C.ink, 1))), frame(26, 44, 88, 44)),
  // trasmatta: a striped rag rug with fringes on a wooden floor, a strip of an old shirt beside it
  'sculp.trasmatta': all(bg('#efe6d6'), rect(0, 40, 120, 80, '#d9b98c', 0, null), ...range(6).map((i) => line(`M0 ${48 + i * 12} L120 ${48 + i * 12}`, '#c4a272', 1)),
    rect(18, 52, 84, 50, '#e9e2d4', 2, C.ink, 1.6), ...range(10).map((i) => rect(20 + i * 8, 54, 8, 46, [C.denim, C.red, '#e9e2d4', C.yellow, C.denim, C.green, '#e9e2d4', C.red, C.denim, C.mint][i]!, 0, null)),
    ...range(10).map((i) => line(`M20 ${56 + i * 4.6} L100 ${56 + i * 4.6}`, 'rgba(0,0,0,0.15)', 0.8)), ...range(9).map((i) => line(`M${22 + i * 10} 52 L${22 + i * 10} 46 M${22 + i * 10} 102 L${22 + i * 10} 108`, C.ink, 1.2)),
    path('M86 22 C92 18 104 20 110 26 L104 30 C100 26 94 26 90 28 Z', C.denim, C.ink, 1.2), frame(14, 42, 92, 70)),
  // ── 4537 Hantverkstekniker ─────────────────────────────────────────
  // konsthantverk: a gallery with spotlit pedestals – an artistic glass bowl, a tall ceramic vase and a silver necklace
  'sculp.konsthantverk': all(bg('#f7f5f0'), ground(),
    ...[[22, 0], [60, 1], [98, 2]].map(([x, i]) => all(path(`M${x! - 6} 0 L${x! + 6} 0 L${x! + 22} 70 L${x! - 22} 70 Z`, 'rgba(255,240,180,0.35)', null), pedestal(x!, 112, 22, 40 - i! * 4))),
    path('M8 66 C8 54 36 54 36 66 C36 72 28 74 22 70 C16 74 8 72 8 66 Z', 'rgba(140,199,232,0.8)', C.ink, 1.6), path('M14 62 C20 58 26 66 32 60', 'none', C.white, 1.4),
    at(60, 72, 1, path('M-8 -46 C-2 -50 6 -44 8 -36 C12 -24 10 -8 6 0 L-6 0 C-12 -10 -12 -30 -8 -46 Z', '#2f4a7a', C.ink, 1.6), path('M-8 -30 C-2 -26 4 -34 10 -28', 'none', C.gold, 1.6)),
    at(98, 76, 1, path('M-10 0 C-10 -12 10 -12 10 0 Z', '#3d3f4a', C.ink, 1.2), rect(-3, -22, 6, 12, '#3d3f4a', 1, null), path('M-9 -4 C-4 6 4 6 9 -4', 'none', C.silver, 2), circle(0, 3, 2.6, C.silver, C.ink, 0.8)),
    frame(4, 4, 112, 106)),
  // hemslöjd: traditional handmade things on a checked cloth – patterned mittens, a birch-bark basket, a wooden butter knife
  'sculp.hemslöjd': all(bg('#e9dcc8'), ...range(5).map((i) => line(`M0 ${18 + i * 6} L120 ${18 + i * 6}`, '#b98f5f', 1)), rect(0, 60, 120, 60, '#d64545', 0, null),
    ...range(6).flatMap((r) => range(6).map((c) => ((r + c) % 2 ? rect(c * 20, 60 + r * 10, 20, 10, '#f3ebe0', 0, null) : ''))),
    at(30, 92, 1, path('M-10 18 L-10 -6 C-10 -18 8 -18 8 -6 L8 18 Z', '#f3ebe0', C.ink, 1.6), path('M8 -2 C16 -4 16 8 8 8', '#f3ebe0', C.ink, 1.4), path('M-8 0 L-4 -4 L0 0 L4 -4 L6 -2 M-8 8 L-4 4 L0 8 L4 4 L6 6', 'none', C.red, 1.4), rect(-10, 12, 18, 6, C.red, 0, C.ink, 1)),
    at(70, 98, 1, path('M-18 -18 L18 -18 L14 10 L-14 10 Z', '#c9a16a', C.ink, 1.6), ...range(5).map((i) => line(`M${-16 + i * 8} -18 L${-12 + i * 6} 10`, '#8a6a3e', 1)), path('M-12 -18 C-12 -34 12 -34 12 -18', 'none', '#8a6a3e', 2.4)),
    rot(102, 92, -60, 1, path('M-4 -22 C-6 -10 -4 4 -2 14 L2 14 C4 4 6 -10 4 -22 Z', WOOD, C.ink, 1.2)), frame(4, 50, 112, 64)),
  // slöjda: a pupil at a school workbench saws a board for a birdhouse (the saw moves); a finished birdhouse on the bench
  'sculp.slöjda': all(bg('#f0ece2'), ground(), bench(48, 80, 66), rect(56, 70, 40, 10, WOOD, 1, C.ink, 1.4),
    at(104, 80, 1, path('M-8 0 L-8 -14 L0 -22 L8 -14 L8 0 Z', '#c9945a', C.ink, 1.2), circle(0, -10, 2.4, '#5a3418', null)),
    wk(32, 111, 0.82, pose({ n: [3, -66], aL: [[14, -58], [26, -52]] }), { top: C.yellow, leg: C.denim, noArm: 'R' }),
    slide('sculp-slöjda', 10, 2, 0.8, wkArm(32, 111, 0.82, [3, -66], [[16, -58], [32, -50]], C.yellow, g('translate(36 -49) rotate(20)', path('M0 -4 L30 -2 L30 6 L0 4 Z', C.silver, C.ink, 1.2), line('M2 4 L30 6', C.ink, 1, '1.5 1.5'), rect(-10, -5, 10, 10, C.red, 3, C.ink, 1.2))))),
  // handgjord: two hands hold an uneven bowl with fingerprints (made by hand); grey identical bowls from a machine behind
  'sculp.handgjord': all(bg('#f3eee6'), greyed(rect(4, 34, 112, 8, '#8a8f98', 2, C.ink, 1.2), ...range(5).map((i) => bowl(16 + i * 22, 34, 0.5, '#c9ced4'))),
    path('M30 64 C30 92 42 100 60 100 C80 100 92 90 90 62 C78 58 44 58 30 64 Z', '#c9945a', C.ink, 1.8), ellipse(60, 63, 30, 6, '#8a5a2e', C.ink, 1.4),
    ...[[46, 80], [70, 84], [58, 92]].map(([x, y]) => all(ellipse(x!, y!, 3.4, 4.4, 'none', '#8a5a2e', 0.8), ellipse(x!, y!, 1.8, 2.6, 'none', '#8a5a2e', 0.8))),
    path('M14 104 C20 92 30 90 36 94 L40 102 C34 110 22 112 14 104 Z', C.skin, C.ink, 1.4), path('M106 104 C100 92 90 90 84 94 L80 102 C86 110 98 112 106 104 Z', C.skin, C.ink, 1.4), heart(60, 54, 0.5, HL)),
  // gesällprov: an apprentice stands by the chair she has made while two masters judge it; a certificate with a ribbon
  'sculp.gesällprov': all(bg('#f2ede4'), ground(), at(56, 112, 1, rect(-14, -26, 28, 4, WOOD, 1, C.ink, 1.4), line('M-12 -22 L-12 0 M12 -22 L12 0', WOOD2, 3), line('M-12 -26 L-12 -52 M12 -26 L12 -52 M-12 -46 L12 -46 M-12 -36 L12 -36', WOOD2, 3)),
    wk(26, 111, 0.82, pose({ aR: [[10, -58], [20, -52]] }), { top: C.green, leg: C.dark, hs: 'bun', apron: '#e8dccb' }),
    greyed(wk(86, 111, 0.82, pose({ aL: [[-10, -58], [-16, -50]] })), wk(106, 111, 0.82, pose({ aL: [[-10, -58], [-14, -48]] }), { hs: 'short' })), rect(66, 58, 8, 10, C.white, 1, C.ink, 1),
    rect(32, 10, 44, 30, C.white, 2, C.ink, 1.6), line('M38 18 L70 18 M38 24 L64 24', C.grey, 1.6), circle(66, 34, 6, HL, C.ink, 1.2), path('M62 38 L60 46 L64 44 L66 48 L68 40', HL, C.ink, 1), coin(44, 33, 3)),
};
