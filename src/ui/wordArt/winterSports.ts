/**
 * Kultur & fritid → Sport & träning → Vintersporter, 4651–4657 (0.64): alpine skiing, cross-country skiing,
 * snowboarding, ice hockey, figure skating, skating on natural ice and biathlon.
 * People are drawn with a posable figure (`wz`, the joint-chain idea of `dz` in dance.ts): every limb is a chain
 * hip–knee–foot or shoulder–elbow–hand, so a skier can bend the knees over the boots with the upper body leaning
 * forward, a cross-country skier can push with the opposite arm and leg (diagonal) or with both poles (staka), and a
 * snowboarder can stand sideways on the board. Skiers are drawn from the side so knees, poles and skis are visible.
 * Skis, poles, boards and sticks are drawn in the figure's own coordinates (`back`/`front`), so they follow the body.
 * The part the word names is orange (HL: ring, frame, arrow or fill); grey figures and things are the reference.
 * Verbs move (base state = poster frame, transform and opacity only). No letters, no brands, no logos.
 * Easily confused words get different kinds of picture: one skier moving (åka skidor) against a whole resort with
 * several activities (skidåkning); the slope itself with groomed lines (pist) against untouched powder among trees
 * (offpist); a chairlift (lift) against a T-bar pulling a standing rider (släplift); gates close together and a turning
 * skier (slalom) against a crouched skier going straight down (störtlopp); the pole that tests the ice (ispik) against
 * the pair of hand spikes round the neck (isdubbar); a loop (straffrunda) against a clock with a plus (tidstillägg).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waIn, waPulse, waShake, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (deg: number, cx: number, cy: number, ...k: Svg[]) => g(`rotate(${deg} ${cx} ${cy})`, ...k);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, C.red, C.ink, 1.4), line('M-4 -4 L4 4 M4 -4 L-4 4', C.white, 2.6));
/** Move a part from (-dx, -dy) to its place: travel. Base state = poster. */
const travel = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%{transform:translate(${-dx}px,${-dy}px)}70%,100%{transform:translate(0,0)}`, { dur }, ...k);
/** Start pose first, then the end pose (poster frame). Opacity only. */
const swap = (name: string, a: Svg, b: Svg, dur = 2.4): Svg => all(
  `<style data-wa>@keyframes wa-${name}-s{0%,40%{opacity:1}50%,90%{opacity:0}100%{opacity:1}}.wa-${name}-s{animation:wa-${name}-s ${dur}s ease-in-out infinite both}</style><g data-wa="${name}-s" class="wa-${name}-s" opacity="0">${a}</g>`,
  moving(name, '0%,40%{opacity:0}50%,90%{opacity:1}100%{opacity:0}', { dur }, b));

// ── Colours and settings ──────────────────────────────────────────────
const SKY = '#cfe6f5', SKY2 = '#e4f1fa', SNOW = '#f8fbff', SNOW2 = '#e3ecf5', SHADE = '#c9d7e6', ICE = '#d6eef8', ICE2 = '#a9d6ec', DARKICE = '#33485e', WATER = '#2f5f86', NIGHT = '#27324a', PINE = '#2f6b4a', WOOD = '#8a5a35', RED = '#c8463d';
const sky = (col: string = SKY) => rect(0, 0, 120, 120, col, 0, null);
const flat = (y = 96, col: string = SNOW) => all(rect(0, y, 120, 120 - y, col, 0, null), line(`M0 ${y} L120 ${y}`, SHADE, 1.4));
/** Snowy slope falling from left to right (angle ≈ 22°). */
const SLOPE_DEG = 22;
const TAN = Math.tan((SLOPE_DEG * Math.PI) / 180);
const slope = (y0 = 44, col: string = SNOW) => all(path(`M0 ${y0} L120 ${f1(y0 + 120 * TAN)} L120 120 L0 120 Z`, col, null), line(`M0 ${y0} L120 ${f1(y0 + 120 * TAN)}`, SHADE, 1.4));
const slopeY = (x: number, y0 = 44) => f1(y0 + x * TAN);
const mountains = (y = 60, col = '#b9cbe0', cap: string = C.white) => all(path(`M-4 ${y} L26 ${y - 34} L46 ${y - 14} L70 ${y - 44} L98 ${y - 12} L124 ${y - 30} L124 ${y} Z`, col, null),
  path(`M18 ${y - 26} L26 ${y - 34} L33 ${y - 26} L29 ${y - 28} L26 ${y - 24} L22 ${y - 28} Z M62 ${y - 34} L70 ${y - 44} L78 ${y - 34} L73 ${y - 36} L70 ${y - 31} L66 ${y - 36} Z`, cap, null));
const tree = (x: number, y: number, s = 1, col: string = PINE, snow = true) => at(x, y, s, rect(-1.5, -6, 3, 6, WOOD, 0, null),
  path('M0 -34 L-9 -18 L-5 -18 L-12 -6 L12 -6 L5 -18 L9 -18 Z', col, C.ink, 1.1), snow ? path('M0 -34 L-4 -27 L-1 -28 L0 -26 L2 -28 L4 -27 Z M-8 -18 L-4 -20 L0 -18 L4 -20 L8 -18', C.white, null) : '');
const sun = (x: number, y: number, r = 8) => all(circle(x, y, r, C.yellow, null), ...range(8).map((i) => { const a = (i * Math.PI) / 4; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.yellow, 1.6); }));
const flake = (x: number, y: number, r = 3, col: string = C.white) => line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r} M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)} M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, col, 1.1);
const groomed = (x1: number, y1: number, x2: number, y2: number, n = 6) => all(...range(n).map((i) => line(`M${x1} ${y1 + i * 4} L${x2} ${y2 + i * 4}`, SNOW2, 1)));
const clock = (x: number, y: number, r: number, hand = 0, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1.8), line(`M${x} ${y} L${x} ${f1(y - r * 0.7)}`, C.ink, 1.8), line(`M${x} ${y} L${f1(x + Math.sin((hand * Math.PI) / 180) * r * 0.55)} ${f1(y - Math.cos((hand * Math.PI) / 180) * r * 0.55)}`, C.ink, 2.2), circle(x, y, 1.4, C.ink, null));

// ── The posable winter-sports figure ──────────────────────────────────
// Local units: feet at y = 0, standing height ≈ 86. Upper arm ≈ 12, forearm ≈ 13, thigh ≈ 21, shin ≈ 20, torso 26.
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = {
  top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'helmet' | 'hat' | 'hockey' | 'cap';
  hat?: string; goggles?: boolean; shoe?: string; glove?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'o' | 'frown';
  front?: Svg; back?: Svg; skirt?: string; noArm?: 'L' | 'R'; bib?: string; pads?: boolean; backView?: boolean;
};
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
function wz(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.sky), leg = grey ? C.grey : (o.leg ?? C.navy);
  const hair = grey ? C.grey : (o.hair ?? C.hair), shoe = grey ? C.grey : (o.shoe ?? C.black), glove = grey ? C.grey : (o.glove ?? C.dark);
  const hatCol = grey ? C.grey2 : (o.hat ?? C.red);
  const limb = (from: Pt, j: [Pt, Pt], col: string, w: number) => {
    const d = `M${from[0]} ${from[1]} L${j[0][0]} ${j[0][1]} L${j[1][0]} ${j[1][1]}`;
    return all(line(d, ink, w + 2.4), line(d, col, w));
  };
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const hand = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 3, glove, ink, 1);
  const foot = (j: [Pt, Pt]) => ellipse(j[1][0] + 1.5, j[1][1], 4.4, 3, shoe, ink, 1);
  const H = (...k: Svg[]) => g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, ...k);
  const hairBack = o.hs === 'long' ? H(path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2)) : '';
  const hs = o.hs ?? 'short';
  const hairTop = hs === 'bun' ? H(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2))
    : hs === 'helmet' ? H(path('M-9.5 1 C-10 -13 10 -13 9.5 1 L6 0 C4 -4 -4 -4 -6 0 Z', hatCol, ink, 1.3), line('M-6 -7 C-2 -9 2 -9 6 -7', 'rgba(255,255,255,0.5)', 1.4))
      : hs === 'hockey' ? H(path('M-9.5 1 C-10 -13 10 -13 9.5 1 L7 0 C5 -4 -5 -4 -7 0 Z', hatCol, ink, 1.3), path('M-7 2 L-7 8 C-3 11 3 11 7 8 L7 2', 'none', C.silver, 1.2), line('M-7 5 L7 5 M-3 2 L-3 10 M3 2 L3 10', C.silver, 0.9))
        : hs === 'hat' ? H(path('M-8.6 -1 C-9 -12 9 -12 8.6 -1 Z', hatCol, ink, 1.3), rect(-9, -3, 18, 3.4, C.white, 1.5, ink, 0.9), circle(0, -11.5, 2.6, C.white, ink, 0.9))
          : hs === 'cap' ? H(path('M-8.5 -1 C-8.5 -12 8.5 -12 8.5 -1 Z', hatCol, ink, 1.2))
            : H(path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = o.backView ? H(path('M-8 -1 C-9 6 -5 8 0 8 C5 8 9 6 8 -1 Z', hair, ink, 1.1)) : o.goggles
    ? H(rect(-8, -3.2, 16, 6, '#f2a541', 3, ink, 1.1), line('M-6 -1.6 L-1 -1.6', 'rgba(255,255,255,0.7)', 1), m === 'open' ? ellipse(0, 5.2, 1.6, 1.6, '#c84a4a', ink, 0.8) : path('M-2.4 4.6 Q0 6.4 2.4 4.6', 'none', ink, 1))
    : H(circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null),
      m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.2, 1.2, '#c84a4a', ink, 0.8)
        : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'frown' ? path('M-2.4 5 Q0 2.6 2.4 5', 'none', ink, 1) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  const waist: Pt = [f1(p.h[0] + dx * 0.15), f1(p.h[1] + dy * 0.15)];
  const skirt = o.skirt ? g(`translate(${waist[0]} ${waist[1]}) rotate(${ang})`, path('M-6 0 L6 0 L12 14 Q0 17 -12 14 Z', o.skirt, ink, 1.4)) : '';
  const bib = o.bib ? g(`translate(${f1(p.h[0] + dx * 0.55)} ${f1(p.h[1] + dy * 0.55)}) rotate(${ang})`, rect(-5.5, -5, 11, 9, o.bib, 1.5, ink, 0.9)) : '';
  const body = o.pads ? all(line(torso, ink, 19.4), line(torso, top, 17)) : all(line(torso, ink, 14.4), line(torso, top, 12));
  return at(x, y, s, o.back ?? '',
    hairBack, limb(p.h, p.lL, leg, 5.2), foot(p.lL), limb(p.h, p.lR, leg, 5.2), foot(p.lR), skirt,
    body, bib,
    o.noArm === 'L' ? '' : all(limb(p.n, p.aL, top, 4.6), hand(p.aL)), o.noArm === 'R' ? '' : all(limb(p.n, p.aR, top, 4.6), hand(p.aR)),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face, o.front ?? '');
}
// ── Gear (local coordinates of the figure) ────────────────────────────
/** A ski under a foot at (fx, fy): tail behind, tip in front (facing right), turned up at the tip. */
const ski = (fx: number, fy: number, back = 16, ahead = 20, col: string = RED, thin = false) => {
  const d = `M${fx - back} ${fy + 3} L${fx + ahead - 4} ${fy + 3} Q${fx + ahead + 1} ${fy + 3} ${fx + ahead + 2} ${fy - 1}`;
  return all(path(d, 'none', C.ink, thin ? 3.6 : 4.6), path(d, 'none', col, thin ? 1.8 : 2.6));
};
/** A pole from the hand (hx, hy) to the tip (tx, ty), with a small basket near the tip. */
const pole = (hx: number, hy: number, tx: number, ty: number, col: string = C.silver) => {
  const bx = f1(tx + (hx - tx) * 0.08), by = f1(ty + (hy - ty) * 0.08);
  return all(line(`M${hx} ${hy} L${tx} ${ty}`, C.ink, 3), line(`M${hx} ${hy} L${tx} ${ty}`, col, 1.6), ellipse(bx, by, 3, 1, 'none', C.ink, 1.1));
};
/** A snowboard under both feet (feet at x1 and x2, y). */
const board = (x1: number, x2: number, y: number, col: string = C.purple) => all(path(`M${x1 - 8} ${y + 1} Q${x1 - 13} ${y + 1} ${x1 - 13} ${y + 4} Q${x1 - 13} ${y + 7} ${x1 - 8} ${y + 7} L${x2 + 8} ${y + 7} Q${x2 + 13} ${y + 7} ${x2 + 13} ${y + 4} Q${x2 + 13} ${y + 1} ${x2 + 8} ${y + 1} Z`, col, C.ink, 1.4), line(`M${x1 - 6} ${y + 4} L${x2 + 6} ${y + 4}`, 'rgba(255,255,255,0.35)', 1.2));
/** A hockey stick from the hand (hx, hy) down to the blade at (bx, by), blade pointing right. */
const stick = (hx: number, hy: number, bx: number, by: number, col: string = WOOD) => all(line(`M${hx} ${hy} L${bx} ${by}`, C.ink, 4), line(`M${hx} ${hy} L${bx} ${by}`, col, 2.4), path(`M${bx - 1} ${by - 2} L${bx + 12} ${by - 1} L${bx + 12} ${by + 2} L${bx - 1} ${by + 2} Z`, C.black, C.ink, 1));
/** A skate blade under a foot. */
const blade = (fx: number, fy: number, len = 12) => all(line(`M${fx - len / 2} ${fy + 4.5} L${fx + len / 2 + 2} ${fy + 4.5}`, C.ink, 2.4), line(`M${fx - len / 2} ${fy + 4.5} L${fx + len / 2 + 2} ${fy + 4.5}`, C.silver, 1.2), line(`M${fx - 3} ${fy + 2} L${fx - 3} ${fy + 4.5} M${fx + 4} ${fy + 2} L${fx + 4} ${fy + 4.5}`, C.ink, 1));
/** Rifle carried on the back. */
const rifleBack = (p: Pose) => { const [nx, ny] = p.n, [hx, hy] = p.h; return all(line(`M${f1(nx - 6)} ${f1(ny - 6)} L${f1(hx - 4)} ${f1(hy + 4)}`, C.ink, 4.2), line(`M${f1(nx - 6)} ${f1(ny - 6)} L${f1(hx - 4)} ${f1(hy + 4)}`, '#5a4636', 2.6)); };

// ── Poses (side view, facing right) ───────────────────────────────────
/** Alpine skier: knees bent over the boots, back straight and leaning forward, hands in front. */
const ALPINE = pose({ h: [-3, -37], n: [5, -62], aL: [[12, -52], [20, -46]], aR: [[14, -54], [22, -47]], lL: [[7, -20], [-1, -1]], lR: [[9, -19], [2, -1]] });
const ALPINE_GEAR = all(ski(-1, -1, 16, 22), ski(2, -1, 16, 22, '#a83a33'), pole(20, -46, 4, -2), pole(22, -47, 8, -2));
/** Crouched downhill skier (tuck): chest low over the thighs, hands in front of the face, poles under the arms. */
const TUCK = pose({ h: [-6, -30], n: [12, -44], aL: [[20, -38], [26, -44]], aR: [[21, -37], [27, -43]], lL: [[8, -18], [-2, -1]], lR: [[10, -17], [1, -1]] });
const TUCK_GEAR = all(ski(-2, -1, 18, 24), ski(1, -1, 18, 24, '#a83a33'), pole(26, -44, -14, -34), pole(27, -43, -12, -30));
/** Front view, knees slightly bent and in, arms out a little (snow-plough, herringbone). */
const PLOUGH = pose({ h: [0, -38], n: [0, -64], aL: [[-10, -52], [-16, -40]], aR: [[10, -52], [16, -40]], lL: [[-7, -19], [-11, -1]], lR: [[7, -19], [11, -1]] });
/** Diagonal stride (classic): left leg forward and bent, right leg back, right arm forward. */
const DIAGONAL = pose({ h: [0, -40], n: [6, -64], aR: [[14, -56], [22, -50]], aL: [[-4, -54], [-12, -46]], lL: [[8, -21], [10, -1]], lR: [[-6, -21], [-14, -2]] });
/** Double poling (staka), end of the push: body folded forward, both arms back. */
const POLE_END = pose({ h: [-4, -38], n: [16, -54], aL: [[8, -46], [-5, -40]], aR: [[9, -45], [-4, -39]], lL: [[2, -19], [0, -1]], lR: [[4, -19], [3, -1]] });
/** Double poling, start: upright, both arms forward and up. */
const POLE_START = pose({ h: [0, -42], n: [3, -68], aL: [[14, -64], [24, -64]], aR: [[15, -63], [25, -63]], lL: [[2, -21], [0, -1]], lR: [[4, -21], [3, -1]] });
/** Skate (fristil): weight on the left leg, right leg pushed out to the side and back. */
const SKATE = pose({ h: [0, -40], n: [4, -65], aL: [[12, -56], [20, -50]], aR: [[12, -57], [21, -51]], lL: [[4, -21], [3, -1]], lR: [[-8, -20], [-18, -4]] });
/** Snowboarder: sideways, knees bent, arms out for balance. Front foot right. */
const RIDE = pose({ h: [0, -36], n: [2, -61], aL: [[-10, -56], [-20, -52]], aR: [[12, -56], [22, -54]], lL: [[-6, -19], [-9, -1]], lR: [[7, -19], [9, -1]] });
/** Hockey player: knees bent, leaning forward, both hands on the stick. */
const HOCKEY = pose({ h: [-2, -36], n: [6, -60], aL: [[10, -50], [14, -42]], aR: [[12, -48], [20, -36]], lL: [[6, -19], [2, -1]], lR: [[-6, -18], [-12, -3]] });
/** Skater gliding: one leg forward and bent, the other stretched back, arms relaxed. */
const GLIDE = pose({ h: [0, -40], n: [6, -65], aL: [[-4, -54], [-10, -44]], aR: [[12, -56], [16, -46]], lL: [[6, -21], [4, -1]], lR: [[-10, -24], [-26, -16]] });
/** Prone shooting: lying on the stomach, elbows on the snow, rifle forward. Head right. */
const PRONE = pose({ h: [-14, -7], n: [10, -11], aL: [[16, -4], [24, -12]], aR: [[14, -5], [20, -13]], lL: [[-30, -5], [-46, -3]], lR: [[-30, -3], [-46, -1]] });
/** Standing shooting: upright side view, rifle at the shoulder. */
const STANDSHOOT = pose({ h: [0, -42], n: [-2, -68], aL: [[6, -52], [10, -62]], aR: [[6, -64], [2, -60]], lL: [[-4, -21], [-6, -1]], lR: [[5, -21], [7, -1]] });

// ── Composite people and things ───────────────────────────────────────
/** An alpine skier with gear, rotated to the slope at (x, y). */
const alpineSkier = (x: number, y: number, s: number, o: Look = {}) => rot(SLOPE_DEG, x, y, wz(x, y, s, ALPINE, { hs: 'helmet', goggles: true, top: C.orange, leg: C.dark, ...o, back: ALPINE_GEAR }));
const DIAG_GEAR = (col: string = C.yellow) => all(ski(10, -1, 18, 22, col, true), ski(-14, -2, 18, 22, col, true), pole(22, -50, 8, -1), pole(-12, -46, -28, -1));
const classicSkier = (x: number, y: number, s: number, o: Look = {}) => wz(x, y, s, DIAGONAL, { hs: 'hat', hat: C.navy, top: C.green, leg: C.dark, ...o, back: all(DIAG_GEAR(), o.back ?? '') });
const SKATE_GEAR = all(ski(3, -1, 16, 22, C.yellow, true), rot(-24, -18, -4, ski(-18, -4, 14, 20, C.yellow, true)), pole(20, -50, 4, -1), pole(21, -51, 8, -1));
const skateSkier = (x: number, y: number, s: number, o: Look = {}) => wz(x, y, s, SKATE, { hs: 'hat', hat: C.red, top: C.purple, leg: C.dark, ...o, back: SKATE_GEAR });
const chair = (x: number, y: number, s = 1, people = 2, col: string = C.dark) => at(x, y, s, line('M0 -22 L0 0', C.ink, 1.6), path('M-14 0 L14 0 L14 4 L-14 4 Z', col, C.ink, 1.2), path('M-14 4 L-14 14 L14 14 L14 4', 'none', C.ink, 1.4), line('M-14 -6 L-14 0 M14 -6 L14 0', C.ink, 1.2),
  ...range(people).map((i) => { const px = people === 1 ? 0 : -6 + i * 12; return all(rect(px - 4, -12, 8, 12, [C.red, C.navy, C.green][i]!, 2, C.ink, 1), circle(px, -16, 4, C.skin, C.ink, 1), path(`M${px - 4} -17 C${px - 4} -22 ${px + 4} -22 ${px + 4} -17 Z`, [C.yellow, C.red, C.navy][i]!, C.ink, 0.8), line(`M${px - 2} 0 L${px - 2} 12 M${px + 2} 0 L${px + 2} 12`, C.dark, 2.6), path(`M${px - 8} 13 L${px + 10} 13`, RED, RED, 1.8)); }));
const gate = (x: number, y: number, col: string = C.red, h = 18) => all(line(`M${x} ${y} L${x} ${y - h}`, C.ink, 2.6), line(`M${x} ${y} L${x} ${y - h}`, col, 1.6), path(`M${x} ${y - h} L${x + 7} ${y - h + 3} L${x} ${y - h + 6} Z`, col, C.ink, 0.8));
const bootObj = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-10 0 L-10 -26 C-10 -30 -4 -32 2 -30 L8 -28 L8 -14 L18 -8 C20 -6 20 -2 18 0 Z', col, C.ink, 1.6), path('M-12 0 L20 0 L20 4 L-12 4 Z', C.dark, C.ink, 1.2),
  ...[-22, -15, -8].map((yy) => rect(-11, yy - 1.5, 10, 3, C.silver, 1, C.ink, 0.8)), line('M-10 -26 L8 -26', 'rgba(255,255,255,0.4)', 1.4));
const goggleObj = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 -2 C-30 0 -30 6 -22 8 M22 -2 C30 0 30 6 22 8', 'none', C.dark, 3.4), rect(-22, -9, 44, 22, '#f2a541', 10, C.ink, 1.8), line('M-18 -5 L-4 -5', 'rgba(255,255,255,0.7)', 2), path('M-4 13 C-2 7 2 7 4 13', C.dark, C.ink, 1.2));
const liftCard = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, rect(-16, -11, 32, 22, col, 3, C.ink, 1.6), path('M-12 4 L-6 -4 L-2 1 L2 -6 L10 4 Z', C.white, C.ink, 0.9), rect(-12, 6, 24, 2.4, C.white, 1, null), circle(11, -6, 2.4, C.yellow, C.ink, 0.8));
const skiPair = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, path('M-4 30 L-4 -24 Q-4 -30 -1 -32 Q2 -30 2 -24 L2 30 Z', col, C.ink, 1.2), path('M6 30 L6 -24 Q6 -30 9 -32 Q12 -30 12 -24 L12 30 Z', col, C.ink, 1.2), rect(-5, -2, 8, 6, C.dark, 1, C.ink, 0.8), rect(5, -2, 8, 6, C.dark, 1, C.ink, 0.8));
/** Twin classic tracks in perspective. */
const tracks = (col: string = SHADE, w = 1.6) => all(line('M30 120 L56 70', col, w), line('M40 120 L59 70', col, w), line('M76 120 L63 70', col, w), line('M86 120 L66 70', col, w));
const forest = (y = 72) => all(...[6, 20, 34, 86, 100, 114].map((x, i) => tree(x, y + (i % 2) * 3, 0.8 + (i % 3) * 0.1)));
const lamp = (x: number, y: number, s = 1) => at(x, y, s, path('M7 -32 L-6 2 L20 2 Z', 'rgba(255,236,150,0.35)', null), line('M0 0 L0 -34 L6 -36', C.grey, 2), circle(7, -35, 3, C.yellow, C.ink, 0.8));
const waxBlock = (x: number, y: number, s = 1, col: string = C.purple) => at(x, y, s, rect(-6, -10, 12, 20, col, 2, C.ink, 1.2), rect(-6, 4, 12, 6, C.silver, 1, C.ink, 1));
const cup = (x: number, y: number, s = 1, fill: string = '#5b2a6e') => at(x, y, s, path('M-14 -12 L14 -12 L11 14 L-11 14 Z', C.white, C.ink, 1.6), path('M14 -6 C22 -6 22 6 12 6', 'none', C.ink, 1.6), ellipse(0, -12, 14, 3.4, fill, C.ink, 1.2));

// ── 4651 Alpint och utförsåkning ─────────────────────────────────────
const M1: Record<string, Svg> = {
  // åka skidor: the verb – one skier close up in motion, snow spraying from the skis, speed lines (moves)
  'winter.åka-skidor': all(sky(), slope(50), line('M4 30 L26 38 M2 42 L22 49 M6 54 L20 58', SHADE, 2),
    travel('ws-aka', 24, 10, 2.4, alpineSkier(68, slopeY(68, 50) + 4, 0.84, { top: C.orange }),
      ...[[38, 72], [32, 66], [44, 74], [28, 72]].map(([x, y]) => circle(x!, y!, 3.4, C.white, SHADE, 1)))),
  // skidåkning: the activity as a whole – two panels side by side: a downhill skier on a slope and a cross-country skier in a track
  'winter.skidåkning': all(rect(0, 0, 120, 120, C.white, 0, null),
    rect(4, 14, 54, 92, SKY, 4, C.ink, 1.4), path('M4 50 L58 76 L58 106 L4 106 Z', SNOW, null), rot(SLOPE_DEG, 30, 70, wz(30, 70, 0.4, ALPINE, { hs: 'helmet', goggles: true, top: C.orange, leg: C.dark, back: ALPINE_GEAR })),
    rect(62, 14, 54, 92, SKY, 4, C.ink, 1.4), rect(62, 80, 54, 26, SNOW, 0, null), tree(70, 80, 0.5), tree(108, 80, 0.5), line('M62 98 L116 98 M62 102 L116 102', SHADE, 1.2), classicSkier(90, 98, 0.4, { hat: C.yellow }),
    frame(2, 10, 116, 100, HL)),
  // pist: the groomed slope itself – corduroy lines, marker poles, one small skier for scale
  'winter.pist': all(sky(), mountains(48), tree(10, 70, 0.7), tree(110, 74, 0.7), tree(100, 86, 0.6),
    path('M38 30 L82 30 L108 120 L12 120 Z', SNOW, C.ink, 1.2), ...range(10).map((i) => line(`M${f1(38 - i * 2.6)} ${30 + i * 9} L${f1(82 + i * 2.6)} ${30 + i * 9}`, SNOW2, 1.4)),
    ...[[30, 56], [92, 56], [22, 86], [100, 86]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 12}`, C.ink, 2.6), line(`M${x} ${y} L${x} ${y! - 12}`, C.green, 1.6))),
    at(60, 70, 0.3, wz(0, 0, 1, PLOUGH, { hs: 'helmet', top: C.red })), path('M38 30 L82 30 L108 120 L12 120 Z', 'none', HL, 2.6)),
  // lift: a chairlift with two passengers on the cable, going up the mountain
  'winter.lift': all(sky(), mountains(64), slope(70), line('M-4 18 L124 66', C.ink, 1.6), line('M-4 26 L124 74', C.grey, 1.2),
    rect(10, 22, 5, 70, C.grey, 1, C.ink, 1.2), rect(96, 54, 5, 50, C.grey, 1, C.ink, 1.2),
    moving('ws-lift', '0%{transform:translate(-18px,-7px)}100%{transform:translate(0,0)}', { dur: 4 }, chair(56, 50, 0.95)), ring(56, 44, 26)),
  // utförsåkning: the ski area seen from above like a piste map – lift line with towers up the mountain, groomed runs winding down, small skiers
  'winter.utförsåkning': all(sky(), path('M2 112 L30 20 Q60 4 90 20 L118 112 Z', SNOW, C.ink, 1.4), ...range(8).map((i) => line(`M${f1(30 - i * 3)} ${30 + i * 10} L${f1(90 + i * 3)} ${30 + i * 10}`, SNOW2, 1)),
    path('M58 18 C40 40 70 54 50 72 C34 88 58 98 52 112', 'none', C.green, 6), path('M66 20 C84 40 70 60 88 78 C100 92 86 104 92 112', 'none', C.navy, 6),
    line('M74 112 L62 14', RED, 1.6, '4 3'), ...[[72, 96], [68, 64], [64, 32]].map(([x, y]) => rect(x! - 1.5, y! - 6, 3, 8, C.dark, 1, null)),
    ...[[48, 70], [86, 76], [56, 40], [80, 46]].map(([x, y], i) => all(circle(x!, y! - 3, 2, [C.red, C.orange, C.yellow, C.purple][i]!, C.ink, 0.6), line(`M${x! - 3} ${y! + 1} L${x! + 3} ${y! + 3}`, C.ink, 1.4))),
    frame(4, 4, 112, 112, HL)),
  // alpin (i skidsport): a racer with a bib passing a gate, in front of high alpine peaks
  'winter.alpin.2': all(sky(), mountains(50, '#a9bdd6'), line('M60 4 L124 40', C.ink, 1.4), rect(100, 26, 4, 40, C.grey, 1, C.ink, 1), chair(80, 34, 0.36), chair(112, 52, 0.36),
    path('M0 30 L120 92 L120 120 L0 120 Z', SNOW, null), line('M0 30 L120 92', SHADE, 1.4), ...range(6).map((i) => line(`M0 ${38 + i * 9} L120 ${100 + i * 9}`, SNOW2, 1)),
    rot(27, 50, 70, wz(50, 70, 0.5, ALPINE, { hs: 'helmet', goggles: true, top: C.red, leg: C.dark, back: ALPINE_GEAR })),
    rect(6, 84, 40, 30, SKY2, 3, C.grey, 1.2), greyed(rect(6, 104, 40, 10, SNOW, 0, null), line('M8 108 L44 108 M8 111 L44 111', C.grey, 1), classicSkier(26, 108, 0.24)), cross(40, 90, 0.7),
    frame(4, 4, 112, 76, HL)),
  // liftkort: the card in a hand, held up to the gate reader that turns green
  'winter.liftkort': all(sky(SKY2), flat(98), rect(76, 34, 18, 64, C.grey, 3, C.ink, 1.4), rect(79, 40, 12, 10, C.dark, 2, C.ink, 1), waPulse('ws-kort', circle(85, 45, 3.4, C.green, null)),
    line('M94 64 L116 64', C.ink, 3), line('M94 64 L116 64', C.yellow, 1.6),
    line('M30 100 L36 76 L56 58', C.ink, 13), line('M30 100 L36 76 L56 58', C.navy, 10.5), liftCard(66, 50, 0.9, C.sky), circle(57, 57, 5, C.dark, C.ink, 1.2), ring(66, 50, 18)),
  // pjäxa: one ski boot with buckles (object), a grey shoe for reference
  'winter.pjäxa': all(sky(SKY2), flat(100), greyed(at(30, 100, 0.7, path('M-12 0 L-12 -10 C-12 -14 -4 -16 4 -14 L16 -8 C18 -6 18 -2 16 0 Z', C.grey, C.ink, 1.4))), bootObj(74, 98, 1.6, C.navy), ring(76, 72, 30)),
  // stav: one pole with grip, strap and basket, next to a grey pair of skis
  'winter.stav': all(sky(SKY2), flat(104), greyed(skiPair(26, 70, 1)), line('M74 16 L90 106', C.ink, 4.4), line('M74 16 L90 106', C.silver, 2.6), path('M70 12 L78 10 L80 26 L73 28 Z', C.dark, C.ink, 1.2),
    path('M72 14 C62 18 62 30 72 28', 'none', C.red, 2), ellipse(88.6, 98, 8, 2.6, 'none', C.ink, 2), ring(80, 60, 30)),
  // skidglasögon: the goggles as an object with snow falling around
  'winter.skidglasögon': all(sky(), flat(96), flake(18, 24), flake(100, 18), flake(30, 80, 2.4), flake(94, 84, 2.4), goggleObj(60, 56, 1.4), ring(60, 58, 36)),
  // skiduthyrning: a counter with skis in a rack and a pair being handed over
  'winter.skiduthyrning': all(rect(0, 0, 120, 120, '#f1e7d8', 0, null), rect(0, 96, 120, 24, '#c9a27a', 0, null), line('M0 96 L120 96', C.ink, 1.2),
    rect(4, 20, 50, 4, WOOD, 1, C.ink, 1), ...range(6).map((i) => skiPair(10 + i * 8, 52, 0.6, [RED, C.navy, C.yellow, C.green, C.orange, C.purple][i]!)),
    rect(56, 64, 60, 32, WOOD, 2, C.ink, 1.4), wz(92, 64, 0.5, pose({ aL: [[-8, -56], [-16, -50]] }), { top: C.green, hs: 'short' }), skiPair(70, 54, 0.7, RED),
    ...range(3).map((i) => bootObj(14 + i * 14, 112, 0.42, [C.navy, C.red, C.dark][i]!)), frame(56, 18, 60, 80, HL)),
  // skidskola: an instructor and three small children in a line on a gentle slope
  'winter.skidskola': all(sky(), mountains(56), flat(86), ...[0, 1, 2].map((i) => at(30 + i * 20, 104, 0.36, wz(0, 0, 1, PLOUGH, { hs: 'helmet', hat: [C.yellow, C.green, C.pink][i], top: [C.sky, C.orange, C.purple][i], back: all(path('M-20 -8 L-3 10', 'none', RED, 3.4), path('M20 -8 L3 10', 'none', RED, 3.4)) }))),
    wz(96, 104, 0.6, pose({ aL: [[-10, -60], [-20, -66]] }), { top: C.red, leg: C.dark, hs: 'hat', hat: C.red }), frame(14, 44, 100, 70, HL)),
  // ploga: from the front, the skis form a V (tips together) and the skier slows down (comes closer and stops)
  'winter.ploga.2': all(sky(), mountains(50), flat(70), groomed(0, 74, 120, 74, 10),
    moving('ws-ploga', '0%{transform:translate(0,-14px) scale(.8)}60%,100%{transform:translate(0,0) scale(1)}', { dur: 3, spin: true },
      at(60, 104, 0.8, wz(0, 0, 1, PLOUGH, { hs: 'helmet', hat: C.yellow, top: C.sky, goggles: true, back: all(path('M-20 -8 L-3 10', 'none', C.ink, 6.4), path('M-20 -8 L-3 10', 'none', HL, 4), path('M20 -8 L3 10', 'none', C.ink, 6.4), path('M20 -8 L3 10', 'none', HL, 4)), front: all(pole(-16, -40, -24, -4), pole(16, -40, 24, -4)) })))),
  // slalom: many gates close together and a skier leaning into a turn between them (tracks wind round the gates)
  'winter.slalom': all(sky(), slope(24), path(`M20 ${slopeY(20, 24) + 4} C40 ${slopeY(30, 24)} 30 ${slopeY(44, 24) + 14} 52 ${slopeY(52, 24) + 10} C74 ${slopeY(62, 24) + 2} 66 ${slopeY(78, 24) + 18} 88 ${slopeY(88, 24) + 10}`, 'none', SHADE, 2),
    ...([[30, C.red], [48, C.navy], [66, C.red], [84, C.navy], [102, C.red]] as [number, string][]).map(([x, c]) => gate(x, slopeY(x, 24) + 4, c, 16)),
    rot(-14, 58, slopeY(58, 24) + 10, alpineSkier(58, slopeY(58, 24) + 10, 0.5, { top: C.yellow, bib: C.white })), frame(4, 4, 112, 112, HL)),
  // störtlopp: a crouched skier going straight down a long steep slope at speed (speed lines), no gates near
  'winter.störtlopp': all(sky(), mountains(40), path('M0 24 L120 84 L120 120 L0 120 Z', SNOW, null), line('M0 24 L120 84', SHADE, 1.4),
    ...[0, 1, 2].map((i) => line(`M${10 + i * 4} ${44 + i * 6} L${38 + i * 4} ${58 + i * 6}`, HL, 2)),
    rot(26.6, 66, 64, wz(66, 64, 0.62, TUCK, { hs: 'helmet', hat: C.white, goggles: true, top: C.red, leg: C.red, bib: C.white, back: TUCK_GEAR }))),
};

// ── 4652 Längdskidåkning ─────────────────────────────────────────────
const M2: Record<string, Svg> = {
  // längdskidåkning: the activity – a classic and a skating skier on a flat track through a forest
  'winter.längdskidåkning': all(sky(), forest(70), flat(70), tracks(), classicSkier(36, 106, 0.44), skateSkier(86, 96, 0.36), frame(4, 4, 112, 112, HL)),
  // spår (skidor, löpning): the prepared twin tracks themselves, no skier, through the forest
  'winter.spår.5': all(sky(), forest(68), flat(68), groomed(0, 72, 120, 72, 12), tracks(HL, 2.6)),
  // elljusspår: night, a row of lamps lighting a track in the forest, one skier under the light
  'winter.elljusspår': all(rect(0, 0, 120, 120, NIGHT, 0, null), ...[10, 34, 92, 112].map((x) => tree(x, 76, 0.9, '#1f4a35', false)), rect(0, 76, 120, 44, '#dfe8f3', 0, null), tracks('#b8c6d8'),
    ...[[24, 96], [96, 96], [44, 82], [76, 82]].map(([x, y]) => lamp(x!, y!, y === 96 ? 1 : 0.6)), waPulse('ws-ljus', circle(31, 61, 5, 'rgba(255,236,150,0.8)', null), circle(103, 61, 5, 'rgba(255,236,150,0.8)', null)),
    classicSkier(58, 112, 0.36, { top: C.reflex }), star(16, 14, 2, C.white), star(100, 20, 2, C.white), star(60, 10, 1.6, C.white)),
  // klassisk stil: skis straight inside the two parallel tracks (orange); the skate pattern greyed out beside
  'winter.klassisk-stil': all(sky(), flat(72), line('M0 98 L120 98 M0 104 L120 104', HL, 2.6), classicSkier(56, 101, 0.56), greyed(at(98, 84, 0.5, line('M-14 6 L0 -6 L14 6 M-14 18 L0 6 L14 18', C.grey, 3))), check(18, 28)),
  // fristil (på skidor): the skater pushes the skis out to the side; the V marks in the snow (orange) show the pattern
  'winter.fristil.2': all(sky(), flat(70), ...[0, 1, 2].map((i) => line(`M${8 + i * 22} 112 L${16 + i * 22} 98 L${24 + i * 22} 112`, HL, 2.4)), travel('ws-fri', 24, 0, 2.6, skateSkier(88, 104, 0.56)), greyed(at(18, 84, 0.5, line('M0 0 L30 0 M0 6 L30 6', C.grey, 3)))),
  // staka: start – arms up and forward; end (poster) – body folded forward, both arms pushed back past the hips
  'winter.staka': all(sky(), forest(72), flat(72), swap('ws-staka',
    wz(56, 104, 0.62, POLE_START, { hs: 'hat', hat: C.red, top: C.sky, back: all(ski(1, -1, 18, 24, C.yellow, true), ski(3, -1, 18, 24, C.yellow, true), pole(24, -64, 30, -1), pole(25, -63, 34, -1)) }),
    wz(56, 104, 0.62, POLE_END, { hs: 'hat', hat: C.red, top: C.sky, back: all(ski(1, -1, 18, 24, C.yellow, true), ski(3, -1, 18, 24, C.yellow, true), pole(-5, -40, -30, -1, HL), pole(-4, -39, -28, -1, HL)) })),
    arrow(88, 66, 110, 66)),
  // saxa: from behind on a steep slope – skis in a V (tips out), herringbone marks below, moving up the hill
  'winter.saxa': all(sky(), path('M0 120 L0 74 L120 30 L120 120 Z', SNOW, null), line('M0 74 L120 30', SHADE, 1.4),
    ...[0, 1, 2, 3].map((i) => all(line(`M${20 + i * 12} ${112 - i * 6} L${15 + i * 12} ${104 - i * 6}`, HL, 2), line(`M${26 + i * 12} ${112 - i * 6} L${31 + i * 12} ${104 - i * 6}`, HL, 2))),
    travel('ws-saxa', 12, -6, 3, wz(84, 98, 0.56, PLOUGH, { hs: 'hat', hat: C.yellow, top: C.green, backView: true, back: all(path('M-6 4 L-18 -18', 'none', C.ink, 6), path('M-6 4 L-18 -18', 'none', C.yellow, 3.6), path('M6 4 L18 -18', 'none', C.ink, 6), path('M6 4 L18 -18', 'none', C.yellow, 3.6)), front: all(pole(-16, -40, -22, 4), pole(16, -40, 22, 4)) })),
    arrow(104, 44, 112, 30)),
  // valla: a ski upside down on a bench, a hand rubs a wax block along it (moves to and fro)
  'winter.valla': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 92, 120, 28, '#c9a27a', 0, null), rect(10, 70, 100, 6, WOOD, 1, C.ink, 1.2), line('M18 76 L18 92 M102 76 L102 92', C.ink, 3),
    path('M8 66 L108 66 Q114 66 116 61', 'none', C.ink, 6), path('M8 66 L108 66 Q114 66 116 61', 'none', C.yellow, 4), rect(40, 62, 30, 3, HL, 1, null),
    moving('ws-valla', '0%,100%{transform:translate(-12px,0)}50%{transform:translate(12px,0)}', { dur: 1.6 }, line('M58 40 L64 14', C.ink, 9), line('M58 40 L64 14', C.sky, 7), waxBlock(56, 52, 1.1), circle(57, 42, 5, C.skin, C.ink, 1.2))),
  // fästvalla: a ski from the side, the middle grip zone is orange and sticky; the tip and tail are plain grey
  'winter.fästvalla': all(sky(SKY2), flat(96), path('M6 70 L104 70 Q112 70 114 62', 'none', C.ink, 7), path('M6 70 L104 70 Q112 70 114 62', 'none', C.grey2, 5), waPulse('ws-fast', path('M42 70 L76 70', 'none', HL, 5)),
    ...range(6).map((i) => path(`M${44 + i * 6} 73 q2 4 0 7`, 'none', HL, 1.6)), at(60, 34, 1, path('M-10 -14 L10 -14 L10 10 L-10 10 Z', HL, C.ink, 1.4), path('M-4 10 L4 10 L2 18 L-2 18 Z', C.grey, C.ink, 1)), arrow(60, 54, 60, 64, C.ink, 2)),
  // masstart: many skiers side by side at a start line under a banner, all leaving at the same moment
  'winter.masstart': all(sky(), forest(56), flat(56), line('M8 106 L112 106', HL, 3),
    ...range(5).map((i) => travel(`ws-mass${i}`, 0, -6, 2.4, classicSkier(14 + i * 22, 100 - (i % 2) * 10, 0.32, { top: [C.red, C.navy, C.green, C.purple, C.orange][i], hat: [C.yellow, C.red, C.white, C.yellow, C.navy][i], bib: C.white }))),
    rect(4, 22, 4, 84, C.grey, 1, C.ink, 1), rect(112, 22, 4, 84, C.grey, 1, C.ink, 1), rect(4, 22, 112, 8, HL, 1, C.ink, 1.2)),
  // motlut: the track goes up a long hill; the hill edge is orange and a skier works up it
  'winter.motlut': all(sky(), path('M0 106 L36 106 L110 40 L120 40 L120 120 L0 120 Z', SNOW, null), line('M0 106 L36 106 L110 40 L120 40', HL, 3),
    rot(-40, 72, 74, classicSkier(72, 74, 0.44, { mouth: 'open' })), tree(14, 104, 0.6), arrow(22, 66, 50, 40, C.ink, 2.4)),
  // skidtur: a skier with a backpack on a dotted route round a frozen lake, a small cabin as the goal
  'winter.skidtur': all(sky(), mountains(50), flat(56), ellipse(64, 84, 34, 12, ICE, SHADE, 1.4), line('M20 106 C10 80 40 64 70 66 C100 68 116 86 100 104', HL, 2.2, '4 4'),
    at(100, 104, 0.6, path('M-10 0 L-10 -12 L0 -20 L10 -12 L10 0 Z', RED, C.ink, 1.2), rect(-3, -8, 6, 8, C.white, 1, C.ink, 0.8)), tree(112, 70, 0.6), tree(8, 70, 0.6),
    classicSkier(30, 104, 0.4, { top: C.red, front: rect(-12, -64, 9, 16, C.green, 2, C.ink, 1) }), sun(98, 20)),
  // blåbärssoppa: a steaming cup of warm purple soup, blueberries beside it
  'winter.blåbärssoppa': all(sky(SKY2), flat(96), cup(60, 80, 1.6), ...[0, 1, 2].map((i) => waIn(`ws-anga${i}`, 0, 6, line(`M${48 + i * 12} 50 C${44 + i * 12} 42 ${52 + i * 12} 36 ${48 + i * 12} 28`, C.grey, 2))),
    ...[[18, 100], [26, 104], [96, 102], [104, 98], [100, 106]].map(([x, y]) => circle(x!, y!, 4, '#3c3f8f', C.ink, 1)), ring(60, 66, 36)),
};

// ── 4653 Snowboard ───────────────────────────────────────────────────
const rider = (x: number, y: number, s: number, o: Look = {}, col: string = C.purple) => wz(x, y, s, RIDE, { hs: 'helmet', hat: C.navy, goggles: true, top: C.yellow, leg: C.navy, ...o, back: all(board(-9, 9, -2, col), o.back ?? '') });
const bindingObj = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M-20 0 L-20 -26 C-20 -30 -16 -32 -12 -32 L0 -32 L2 -16 L18 -10 C22 -8 22 -2 20 0 Z', C.dark, C.ink, 1.4),
  path('M-24 0 L-24 -30 C-24 -34 -20 -34 -20 -30 L-20 0 Z', col, C.ink, 1.2), path('M-26 0 L24 0 L24 4 L-26 4 Z', col, C.ink, 1.2),
  path('M-21 -22 L3 -20 L3 -14 L-21 -16 Z', col, C.ink, 1.1), path('M6 -14 L19 -9 L17 -4 L4 -9 Z', col, C.ink, 1.1), circle(-1, -18, 1.6, C.silver, C.ink, 0.6), circle(11, -9, 1.6, C.silver, C.ink, 0.6));
const M3: Record<string, Svg> = {
  // snowboard: one board standing up in the snow (object), grey skis beside for contrast
  'winter.snowboard': all(sky(), mountains(60), flat(92), greyed(skiPair(26, 64, 0.9)), rot(8, 72, 60, path('M60 14 Q72 6 84 14 L84 104 Q72 112 60 104 Z', C.purple, C.ink, 1.8), path('M64 30 L80 30 M64 84 L80 84', 'none', C.white, 3), rect(62, 36, 20, 6, C.dark, 2, C.ink, 1), rect(62, 72, 20, 6, C.dark, 2, C.ink, 1)), ring(74, 60, 40)),
  // bindning (på skidor): a boot strapped into the binding on a board; the straps and frame are orange
  'winter.bindning.2': all(sky(SKY2), flat(96), path('M4 96 L116 96 L116 104 L4 104 Z', C.purple, C.ink, 1.6), bindingObj(62, 96, 1.6), ring(60, 76, 36)),
  // släplift: a rider standing on the board is pulled up the slope by a T-bar hanging from a cable (moves up)
  'winter.släplift': all(sky(), mountains(56), path('M0 110 L120 50 L120 120 L0 120 Z', SNOW, null), line('M0 110 L120 50', SHADE, 1.4), line('M-4 40 L124 -16', C.ink, 1.6),
    rect(100, -2, 5, 62, C.grey, 1, C.ink, 1.2),
    travel('ws-slap', 20, -10, 3.4, line('M62 13 L70 62', C.ink, 1.6), line('M60 63 L80 59', C.ink, 3), line('M60 63 L80 59', HL, 1.8), rot(-26, 66, 86, rider(66, 86, 0.42, { top: C.red }, C.green))),
    rot(-26, 30, 104, greyed(rider(30, 104, 0.32))), arrow(86, 48, 104, 38)),
  // hopp: a rider in the air above a snow ramp, knees up, landing hill below (moves up off the ramp)
  'winter.hopp.2': all(sky(), mountains(60), flat(104), path('M0 104 L30 104 L56 80 L56 104 Z', SNOW, SHADE, 1.4), path('M88 104 L120 90 L120 104 Z', SNOW, null), line('M52 76 C62 30 92 28 104 74', HL, 2.4, '4 4'),
    travel('ws-hopp', -20, 26, 2.6, rot(-10, 80, 76, wz(80, 76, 0.52, pose({ h: [0, -32], n: [2, -56], aL: [[-12, -54], [-22, -48]], aR: [[12, -52], [22, -46]], lL: [[-10, -24], [-8, -6]], lR: [[10, -24], [8, -6]] }), { hs: 'helmet', hat: C.navy, goggles: true, top: C.orange, leg: C.navy, back: board(-8, 8, -7, C.green) }))), sparkle(108, 22, 4)),
  // halfpipe: the U-shaped snow channel seen from the front, a rider at the top of one wall
  'winter.halfpipe': all(sky(), mountains(46), path('M0 40 L10 40 C14 96 106 96 110 40 L120 40 L120 120 L0 120 Z', SNOW, C.ink, 1.4), path('M10 40 C14 96 106 96 110 40 Z', SNOW2, null), path('M10 40 C14 96 106 96 110 40', 'none', HL, 3),
    line('M20 70 C40 88 80 88 100 70', SNOW2, 1.4), travel('ws-half', -40, 30, 2.8, rot(30, 20, 40, rider(20, 36, 0.36, { top: C.red }))), arrow(30, 76, 90, 76, C.grey, 2)),
  // carva: the board on its edge, leaning into the turn; one clean narrow arc in the snow (moves along the arc)
  'winter.carva': all(sky(), slope(30), path(`M8 ${slopeY(8, 30) + 30} C40 ${slopeY(40, 30) + 50} 60 ${slopeY(60, 30) + 10} 96 ${slopeY(96, 30) + 18}`, 'none', HL, 2.4), path(`M8 ${slopeY(8, 30) + 34} C40 ${slopeY(40, 30) + 54} 60 ${slopeY(60, 30) + 14} 96 ${slopeY(96, 30) + 22}`, 'none', HL, 1.2),
    travel('ws-carva', 30, 10, 2.8, rot(-6, 72, 74, wz(72, 74, 0.56, pose({ h: [-6, -34], n: [-10, -58], aL: [[-18, -46], [-26, -38]], aR: [[2, -52], [10, -44]], lL: [[-14, -18], [-9, -1]], lR: [[2, -19], [9, -1]] }), { hs: 'helmet', hat: C.navy, goggles: true, top: C.yellow, back: rot(-30, 0, -2, board(-9, 9, -2, C.purple)) })))),
  // offpist: a rider in deep untouched powder among trees, snow spraying; the groomed piste is small and grey far behind
  'winter.offpist': all(sky(), mountains(50), path('M0 54 L120 54 L120 120 L0 120 Z', '#fdfeff', null),
    path('M0 54 L30 54 L46 120 L0 120 Z', SNOW2, null), ...range(8).map((i) => line(`M0 ${60 + i * 8} L${f1(31 + i * 2)} ${60 + i * 8}`, SHADE, 1)),
    ...[[32, 64], [36, 80], [40, 96], [44, 112]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 14}`, C.ink, 3), line(`M${x} ${y} L${x} ${y! - 7}`, C.orange, 1.8), line(`M${x} ${y! - 7} L${x} ${y! - 14}`, C.black, 1.8))),
    tree(62, 74, 0.8), tree(108, 70, 0.9), tree(112, 104, 0.8), tree(76, 116, 0.6),
    rider(86, 104, 0.5, { top: C.red }), path('M56 106 C66 96 80 94 98 98 C108 100 114 104 120 102 L120 120 L56 120 Z', C.white, SHADE, 1.2), ...[[64, 96], [70, 90], [60, 90], [74, 98]].map(([x, y]) => circle(x!, y!, 4, C.white, SHADE, 1)), frame(52, 56, 64, 60, HL)),
  // lavinsändare: a small device with signal waves (pulse) on the chest strap, snow below
  'winter.lavinsändare': all(sky(), flat(96), path('M40 30 L52 96 M80 30 L68 96', 'none', C.dark, 4), rect(44, 46, 32, 40, C.yellow, 6, C.ink, 1.8), rect(50, 52, 20, 12, C.dark, 2, C.ink, 1), circle(60, 74, 4, C.red, C.ink, 1),
    waPulse('ws-sand', path('M84 54 C90 60 90 70 84 76 M90 48 C100 58 100 72 90 82 M36 54 C30 60 30 70 36 76 M30 48 C20 58 20 72 30 82', 'none', HL, 2.4))),
  // ryggskydd: the back protector (segmented plates with straps) as an object
  'winter.ryggskydd': all(sky(SKY2), flat(104), path('M40 34 L80 34', 'none', C.dark, 4), path('M38 70 L82 70', 'none', C.dark, 6), ...range(6).map((i) => rect(46, 20 + i * 14, 28, 12, C.dark, 3, C.ink, 1.4)),
    path('M46 20 C40 40 40 80 46 102 M74 20 C80 40 80 80 74 102', 'none', C.ink, 1.2), ring(60, 62, 40)),
};

// ── 4654 Ishockey ────────────────────────────────────────────────────
const iceFloor = (y = 80) => all(rect(0, y, 120, 120 - y, ICE, 0, null), line(`M0 ${y} L120 ${y}`, ICE2, 1.4), line(`M0 ${y + 14} L120 ${y + 18}`, 'rgba(255,255,255,0.6)', 2));
const boards = (y = 80) => all(rect(0, y - 14, 120, 14, C.white, 0, C.ink, 1.2), line(`M0 ${y - 4} L120 ${y - 4}`, C.yellow, 2.4));
const puckObj = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 2, 7, 2.6, C.black, C.ink, 1), rect(-7, -2, 14, 4, C.black, 0, null), ellipse(0, -2, 7, 2.6, '#3a3a44', C.ink, 1));
const goalObj = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 0 L-16 -18 L16 -18 L16 0', 'none', C.red, 3), path('M-16 -18 L-10 -12 L10 -12 L16 -18 M-10 -12 L-10 0 M10 -12 L10 0', 'none', C.grey, 1), ...range(5).map((i) => line(`M${-14 + i * 7} -17 L${-14 + i * 7} 0`, C.grey2, 0.8)));
const hockeyPlayer = (x: number, y: number, s: number, o: Look = {}, mirrorX = false) => {
  const fig = wz(0, 0, 1, HOCKEY, { hs: 'hockey', hat: o.top ?? C.navy, top: C.navy, leg: C.dark, glove: C.dark, pads: true, ...o, back: all(blade(2, -1), blade(-12, -3), o.back ?? ''), front: all(stick(20, -36, 30, -2), o.front ?? '') });
  return g(`translate(${x} ${y}) scale(${mirrorX ? -s : s} ${s})`, fig);
};
/** Rink seen from above. */
const rinkTop = (x = 6, y = 24, w = 108, h = 72) => all(rect(x, y, w, h, ICE, 18, C.ink, 2.4), line(`M${x + w / 2} ${y} L${x + w / 2} ${y + h}`, C.red, 2), line(`M${x + w * 0.34} ${y} L${x + w * 0.34} ${y + h} M${x + w * 0.66} ${y} L${x + w * 0.66} ${y + h}`, C.navy, 2),
  circle(x + w / 2, y + h / 2, 9, 'none', C.navy, 1.2), line(`M${x + 8} ${y + 6} L${x + 8} ${y + h - 6} M${x + w - 8} ${y + 6} L${x + w - 8} ${y + h - 6}`, C.red, 1), rect(x + 3, y + h / 2 - 5, 5, 10, 'none', 0, C.red, 1.4), rect(x + w - 8, y + h / 2 - 5, 5, 10, 'none', 0, C.red, 1.4));
const dot = (x: number, y: number, col: string, r = 4.2) => circle(x, y, r, col, C.ink, 1.2);
const M4: Record<string, Svg> = {
  // ishockey: a player with stick and puck skating towards a goal on the ice, boards behind
  'winter.ishockey': all(rect(0, 0, 120, 120, '#e9eef4', 0, null), boards(70), iceFloor(70), goalObj(100, 96, 1), hockeyPlayer(46, 104, 0.6, { top: C.red }), puckObj(70, 104, 0.7), frame(4, 4, 112, 112, HL)),
  // skridsko: one hockey skate (boot with blade) as an object, a grey shoe for reference
  'winter.skridsko': all(sky(SKY2), iceFloor(100), greyed(at(28, 100, 0.7, path('M-12 0 L-12 -10 C-12 -14 -4 -16 4 -14 L16 -8 C18 -6 18 -2 16 0 Z', C.grey, C.ink, 1.4))),
    at(74, 88, 1.5, path('M-14 0 L-14 -26 C-14 -30 -8 -32 -2 -30 L4 -28 L6 -14 L18 -8 C20 -6 20 -2 18 0 Z', C.dark, C.ink, 1.6), line('M-12 -22 L4 -22 M-12 -16 L6 -16', C.white, 1), path('M-16 4 L22 4 Q24 4 24 7 L-16 7 Z', C.silver, C.ink, 1.2), line('M-10 0 L-10 4 M12 0 L12 4', C.ink, 1.4)), ring(76, 70, 32)),
  // klubba (i sport): the hockey stick as an object; a grey mallet beside it for contrast
  'winter.klubba.2': all(sky(SKY2), iceFloor(100), greyed(at(24, 96, 0.8, rect(-3, -40, 6, 40, WOOD, 1, C.ink, 1), rect(-10, -50, 20, 12, WOOD, 2, C.ink, 1.2))),
    line('M60 10 L82 96', C.ink, 6), line('M60 10 L82 96', WOOD, 4), line('M62 18 L66 34', C.black, 4.4), path('M80 92 L110 96 L110 102 L80 100 Z', C.black, C.ink, 1.2), ring(80, 56, 40)),
  // puck: the black rubber disc on the ice, close up, with motion lines
  'winter.puck': all(sky(SKY2), iceFloor(70), puckObj(66, 92, 3), line('M10 86 L34 86 M14 96 L36 96', C.grey, 2.4), ring(66, 90, 28)),
  // rink: the rink from above – boards round the ice, red centre line, blue lines, goals at each end
  'winter.rink': all(sky(SKY2), rinkTop(), rect(6, 24, 108, 72, 'none', 18, HL, 3)),
  // ishall: an arena building cut open – roof, stands full of people and the rink inside
  'winter.ishall': all(sky(), path('M4 112 L4 46 Q60 6 116 46 L116 112 Z', '#d9dde3', C.ink, 1.8), path('M10 108 L10 50 Q60 16 110 50 L110 108 Z', '#3d4250', null),
    path('M14 92 L30 62 L90 62 L106 92 Z', '#5b6070', null), ...range(14).map((i) => circle(20 + i * 6.2, 70 + (i % 2) * 4, 2.2, [C.red, C.yellow, C.sky, C.white][i % 4]!, null)),
    rect(16, 92, 88, 14, ICE, 4, C.ink, 1), line('M60 92 L60 106', C.red, 1.4), ...range(4).map((i) => circle(30 + i * 20, 30 - (i === 1 || i === 2 ? 6 : 0), 2.4, C.yellow, null)), frame(2, 4, 116, 110, HL)),
  // forward: from above, three players of the orange team near the other team's goal (right), with the puck
  'winter.forward': all(sky(SKY2), rinkTop(), dot(30, 46, C.grey), dot(30, 74, C.grey), dot(18, 60, C.grey2),
    dot(84, 42, HL), dot(92, 60, HL), dot(84, 78, HL), circle(98, 60, 1.8, C.black, null), arrow(70, 60, 86, 60, C.ink, 2), ring(88, 60, 24)),
  // back: from above, two players of the orange team near their own goal (left), defending
  'winter.back': all(sky(SKY2), rinkTop(), dot(80, 44, C.grey), dot(84, 60, C.grey), dot(80, 76, C.grey), dot(102, 60, C.grey2),
    dot(32, 46, HL), dot(32, 74, HL), dot(16, 60, C.grey2), ring(28, 60, 24)),
  // period (ishockey): a match bar in three equal parts, the first part orange, and a clock
  'winter.period.4': all(sky(SKY2), iceFloor(96), rect(10, 56, 32, 18, HL, 3, C.ink, 1.6), rect(44, 56, 32, 18, C.grey2, 3, C.ink, 1.6), rect(78, 56, 32, 18, C.grey2, 3, C.ink, 1.6), clock(26, 30, 14, 120), puckObj(60, 104, 1)),
  // tackla: a player pushes an opponent with the body into the boards (comes in, the other is shaken)
  'winter.tackla': all(rect(0, 0, 120, 120, '#e9eef4', 0, null), boards(76), iceFloor(76),
    waShake('ws-tack2', hockeyPlayer(86, 104, 0.58, { top: C.green }, true)), travel('ws-tack', 14, 0, 1.8, hockeyPlayer(54, 104, 0.6, { top: C.red })),
    path('M74 48 L80 44 L78 52 L86 50', 'none', HL, 2.4), sparkle(82, 40, 5, HL)),
  // utvisningsbås: a small box with a bench behind glass at the side of the rink, a player sits there; a clock on the wall
  'winter.utvisningsbås': all(rect(0, 0, 120, 120, '#e9eef4', 0, null), rect(14, 34, 92, 66, '#5b6070', 2, C.ink, 1.6), rect(20, 74, 80, 8, WOOD, 1, C.ink, 1.2),
    wz(60, 92, 0.5, pose({ h: [0, -26], n: [0, -52], lL: [[-10, -26], [-10, -6]], lR: [[10, -26], [10, -6]], aL: [[-8, -40], [-6, -28]], aR: [[8, -40], [6, -28]] }), { hs: 'hockey', hat: C.red, top: C.red, pads: true, mouth: 'frown' }),
    rect(14, 34, 92, 66, 'rgba(200,230,250,0.35)', 2, C.ink, 1.6), boards(112), clock(92, 20, 10, 60), frame(10, 30, 100, 74, HL)),
  // powerplay: from above, five orange players against four grey ones, the fifth grey player sits in the box beside the rink
  'winter.powerplay': all(sky(SKY2), rinkTop(6, 30, 108, 66), ...[[70, 44], [78, 63], [70, 82], [92, 52], [92, 74]].map(([x, y]) => dot(x!, y!, HL)), ...[[98, 63], [86, 40], [86, 86], [104, 46]].map(([x, y]) => dot(x!, y!, C.grey)),
    rect(50, 6, 20, 16, '#5b6070', 2, C.ink, 1.2), waPulse('ws-pp', dot(60, 14, C.grey)), num(30, 22, '5:4', 14)),
  // bandy: a big outdoor ice field with trees, players with curved sticks and a small orange ball (no boards)
  'winter.bandy': all(sky(), forest(60), rect(0, 60, 120, 60, ICE, 0, null), line('M0 60 L120 60', ICE2, 1.4), line('M60 62 L60 120', C.red, 1.4),
    ...[[36, 104, C.red, false], [84, 100, C.navy, true]].map(([x, y, c, m]) => g(`translate(${x} ${y}) scale(${m ? -0.5 : 0.5} 0.5)`, wz(0, 0, 1, HOCKEY, { hs: 'helmet', hat: c as string, top: c as string, leg: C.dark, back: all(blade(2, -1), blade(-12, -3)), front: all(path('M20 -36 L30 -6 Q32 0 38 -2', 'none', C.ink, 4), path('M20 -36 L30 -6 Q32 0 38 -2', 'none', WOOD, 2.4)) }))),
    circle(58, 106, 3, C.orange, C.ink, 1), frame(4, 4, 112, 112, HL)),
};

// ── 4655 Konståkning ─────────────────────────────────────────────────
const arena = () => all(rect(0, 0, 120, 120, '#2f3550', 0, null), ...range(10).map((i) => circle(8 + i * 11.5, 40 + (i % 2) * 4, 3, '#4a5070', null)), rect(0, 70, 120, 50, ICE, 0, null), line('M0 70 L120 70', ICE2, 1.4), line('M0 86 L120 90', 'rgba(255,255,255,0.6)', 2));
const note = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, line('M2.6 5 L2.6 -10 C6 -8 8 -6 8 -2', col, 2), ellipse(0, 5.6, 3.4, 2.6, col, null));
const sector = (cx: number, cy: number, r: number, deg: number, col: string) => { const a = (deg * Math.PI) / 180; return path(`M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${f1(cx + Math.sin(a) * r)} ${f1(cy - Math.cos(a) * r)} Z`, col, C.ink, 1.2); };
const LIFT_M = pose({ h: [0, -42], n: [0, -68], aL: [[-6, -80], [-4, -92]], aR: [[6, -80], [4, -92]], lL: [[-4, -21], [-6, -1]], lR: [[6, -21], [14, -4]] });
const LIFT_W = pose({ h: [0, -6], n: [-24, -8], aL: [[-34, -14], [-44, -20]], aR: [[-30, -4], [-38, 2]], lL: [[14, -10], [28, -16]], lR: [[14, -4], [26, 0]] });
const M5: Record<string, Svg> = {
  // konståkning: a skater in a spin on the ice to music, judges with score cards at the side
  'winter.konståkning': all(arena(), rect(80, 54, 36, 16, '#5b6070', 2, C.ink, 1), ...[88, 98, 108].map((x) => all(circle(x, 50, 3.4, C.skin, C.ink, 0.8), rect(x - 4, 54, 8, 6, C.white, 1, C.ink, 0.6))),
    wz(44, 108, 0.62, pose({ ...{ aL: [[-6, -80], [-2, -90]] as [Pt, Pt], aR: [[6, -80], [2, -90]] as [Pt, Pt] }, lR: [[8, -26], [2, -36]] }), { hs: 'bun', top: C.pink, leg: C.rose, skirt: C.pink, shoe: C.white, back: blade(-5, -1), front: '' }),
    note(20, 30, 1.2), note(70, 22, 1), frame(4, 4, 112, 112, HL)),
  // paråkning: the man holds the woman high above his head while he skates (pair lift)
  'winter.paråkning': all(arena(), wz(56, 110, 0.56, LIFT_M, { hs: 'short', top: C.navy, leg: C.black, shoe: C.black, back: all(blade(-6, -1), blade(14, -4)), front: travel('ws-par', 0, -24, 2.6, g('translate(2 -98)', wz(0, 0, 1, LIFT_W, { hs: 'bun', top: C.red, leg: C.rose, skirt: C.red, shoe: C.white }))) }), ring(58, 46, 30)),
  // dödsspiral: the man in the middle holds her hand; she circles round him almost lying, head near the ice (circle arrow)
  'winter.dödsspiral': all(arena(), ellipse(60, 100, 46, 10, 'none', HL, 2, ), path('M100 96 L106 100 L98 104', HL, HL, 1.4),
    wz(56, 104, 0.56, pose({ h: [0, -34], n: [-4, -58], aL: [[6, -54], [16, -50]], aR: [[-12, -48], [-18, -40]], lL: [[-10, -18], [-12, -1]], lR: [[10, -18], [20, -4]] }), { hs: 'short', top: C.navy, leg: C.black, back: all(blade(-12, -1), blade(20, -4)) }),
    wz(70, 100, 0.56, pose({ h: [10, -12], n: [36, -6], aL: [[22, -12], [16, -18]], aR: [[46, -2], [54, 0]], lL: [[0, -10], [-10, -4]], lR: [[-4, -8], [-18, -10]] }), { hs: 'bun', top: C.red, leg: C.rose, shoe: C.white, back: blade(-10, -4) })),
  // isdans: a couple in a close dance hold gliding together to music, no jumps
  'winter.isdans': all(arena(), note(18, 26, 1.2), note(100, 20, 1.2), note(84, 34, 1),
    wz(50, 108, 0.6, pose({ n: [2, -68], aL: [[10, -76], [18, -82]], aR: [[12, -58], [20, -56]], lR: [[-8, -22], [-20, -12]] }), { hs: 'short', top: C.navy, leg: C.black, back: all(blade(-5, -1), blade(-20, -12)) }),
    wz(68, 108, 0.58, pose({ n: [-2, -68], aL: [[-8, -76], [-14, -82]], aR: [[-8, -60], [-14, -58]], lR: [[10, -22], [24, -14]] }), { hs: 'bun', top: C.purple, leg: C.rose, skirt: C.purple, shoe: C.white, back: all(blade(-5, -1), blade(24, -14)) }),
    path('M24 112 C50 104 70 104 100 112', 'none', HL, 2.4)),
  // kortprogram: of the two programmes, the first and short one is orange (small sector); the long one is grey
  'winter.kortprogram': all(rect(0, 0, 120, 120, '#eef2f7', 0, null), circle(32, 48, 22, C.white, C.ink, 1.8), waPulse('ws-kort', sector(32, 48, 22, 240, HL)), circle(88, 48, 22, C.white, C.grey, 1.4), greyed(sector(88, 48, 22, 360, C.grey2)),
    num(32, 92, '2:40', 14, HL), num(88, 92, '4:00', 12, C.grey), rect(8, 18, 48, 92, 'none', 6, HL, 2.6), num(32, 112, '1', 9), num(88, 112, '2', 9, C.grey)),
  // friåkning: of the two programmes, the second and longer one is orange; the short one is grey
  'winter.friåkning': all(rect(0, 0, 120, 120, '#eef2f7', 0, null), circle(32, 48, 22, C.white, C.grey, 1.4), greyed(sector(32, 48, 22, 240, C.grey2)), circle(88, 48, 22, C.white, C.ink, 1.8), sector(88, 48, 22, 359, HL),
    num(32, 92, '2:40', 12, C.grey), num(88, 92, '4:00', 14, HL), rect(64, 18, 48, 92, 'none', 6, HL, 2.6), num(32, 112, '1', 9, C.grey), num(88, 112, '2', 9)),
};

// ── 4656 Skridskoåkning ──────────────────────────────────────────────
const lake = (y = 70, col: string = ICE) => all(sky(), path(`M0 ${y} L20 ${y - 6} L50 ${y - 3} L80 ${y - 8} L120 ${y - 4} L120 ${y} Z`, '#9fb3c8', null), ...[8, 30, 90, 110].map((x) => tree(x, y - 3, 0.5)), rect(0, y, 120, 120 - y, col, 0, null), line(`M0 ${y} L120 ${y}`, ICE2, 1.4));
const skater = (x: number, y: number, s: number, o: Look = {}) => wz(x, y, s, GLIDE, { hs: 'hat', hat: C.red, top: C.sky, leg: C.navy, ...o, back: all(blade(4, -1, 16), rot(-18, -26, -16, blade(-26, -16, 16)), o.back ?? '') });
const iceSlab = (x: number, y: number, w: number, h: number, col: string = ICE2) => all(rect(x, y, w, h, col, 1, C.ink, 1.4), line(`M${x + 4} ${y + h / 2} L${x + w - 4} ${y + h / 2}`, 'rgba(255,255,255,0.5)', 1));
const spikes = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M-26 -30 C-14 -46 14 -46 26 -30', 'none', C.ink, 1.8), rect(-34, -30, 14, 26, col, 5, C.ink, 1.6), rect(20, -30, 14, 26, col, 5, C.ink, 1.6),
  path('M-27 -4 L-27 6 L-25 -4 Z M27 -4 L27 6 L29 -4 Z', C.silver, C.ink, 1), line('M-30 -22 L-24 -22 M24 -22 L30 -22', 'rgba(255,255,255,0.6)', 1.6));
const M6: Record<string, Svg> = {
  // åka skridskor: one skater gliding across a frozen lake (moves along), the back leg pushes off
  'winter.åka-skridskor': all(lake(64), line('M10 108 C30 104 50 112 70 106', ICE2, 1.4), travel('ws-skrid', 30, 0, 3, skater(72, 104, 0.62))),
  // skridskoåkning: the activity – several people skate on a frozen lake: a child, adults, one with long skis-like blades
  'winter.skridskoåkning': all(lake(60), skater(30, 92, 0.38, { top: C.green, hat: C.yellow }), skater(70, 104, 0.5, { top: C.red }), skater(98, 86, 0.32, { top: C.purple, hat: C.navy }), frame(4, 4, 112, 112, HL)),
  // isbana: an outdoor rink in a park – low boards round the ice, snowbanks, lamp posts; small skaters
  'winter.isbana': all(sky(), rect(0, 62, 120, 58, SNOW, 0, null), ...[10, 110].map((x) => tree(x, 62, 0.6)), lamp(18, 82, 0.8), lamp(98, 82, 0.8),
    path('M14 84 L106 84 L116 112 L4 112 Z', ICE, C.white, 3), path('M14 84 L106 84 L116 112 L4 112 Z', 'none', C.ink, 1), skater(48, 104, 0.24, { top: C.red }), skater(76, 96, 0.22, { top: C.green }), path('M14 84 L106 84 L116 112 L4 112 Z', 'none', HL, 2.6)),
  // långfärdsskridsko: a long blade fixed under a normal boot; a short grey hockey skate beside it
  'winter.långfärdsskridsko': all(sky(SKY2), iceFloor(100), greyed(at(24, 90, 0.8, path('M-12 0 L-12 -20 C-12 -24 -6 -26 0 -24 L6 -12 L14 -8 C16 -6 16 -2 14 0 Z', C.grey, C.ink, 1.2), line('M-14 4 L16 4', C.grey, 2))),
    at(76, 82, 1.2, path('M-14 0 L-14 -16 C-14 -20 -8 -22 -2 -20 L4 -12 L16 -8 C18 -6 18 -2 16 0 Z', C.brown, C.ink, 1.4), rect(-16, 0, 36, 4, C.dark, 1, C.ink, 1), path('M-30 7 L36 7 Q42 7 42 3', 'none', C.ink, 3.4), path('M-30 7 L36 7 Q42 7 42 3', 'none', HL, 2), line('M-14 4 L-14 7 M14 4 L14 7', C.ink, 1.2)), ring(76, 80, 36)),
  // svartis: dark, clear new ice – you see stones and a fish through it; a white snowy patch at the edge for contrast
  'winter.svartis': all(sky(), rect(0, 50, 120, 70, DARKICE, 0, null), line('M0 50 L120 50', ICE2, 1.4), path('M0 50 L30 50 L22 64 L0 70 Z', C.white, SHADE, 1),
    ...[[40, 96], [70, 104], [96, 92]].map(([x, y]) => ellipse(x!, y!, 7, 4, '#4f6577', null)), path('M60 78 C66 72 76 72 80 78 C76 84 66 84 60 78 Z M80 78 L86 74 L86 82 Z', '#7a8fa3', null),
    line('M44 60 L60 58 M70 64 L92 60', 'rgba(255,255,255,0.5)', 1.4), skater(64, 70, 0.28, { top: C.red }), frame(30, 52, 86, 64, HL)),
  // bärig: a thick ice slab carries a person (check); a thin grey slab cracks under the same weight (cross)
  'winter.bärig': all(rect(0, 0, 120, 120, SKY2, 0, null), rect(0, 76, 120, 44, WATER, 0, null),
    iceSlab(8, 64, 48, 18, HL), wz(32, 64, 0.42, STAND, { hs: 'hat', top: C.red }), check(32, 100, 0.9),
    greyed(iceSlab(68, 72, 44, 5, C.grey2), line('M88 72 L92 77 M94 72 L90 77', C.ink, 1.4), wz(90, 72, 0.42, STAND, { hs: 'hat', top: C.grey, mouth: 'o' })), cross(90, 100, 0.9)),
  // vak: an open hole in the ice with dark water, a small stream runs in at the shore
  'winter.vak': all(lake(54), path('M0 54 L40 54 L36 70 L0 76 Z', SNOW, null), line('M10 70 C24 72 34 76 46 84', '#5f8fb5', 3), ellipse(66, 92, 24, 11, WATER, C.ink, 1.6), waPulse('ws-vak', path('M50 88 C58 84 74 84 82 90 M54 96 C62 92 72 92 78 97', 'none', '#5f8fb5', 1.6)), ring(66, 92, 30)),
  // gå igenom isen: the ice breaks and the person falls into the water (moves down), splash
  'winter.gå-igenom-isen': all(lake(54), ellipse(60, 98, 26, 9, WATER, C.ink, 1.6), path('M34 96 L40 90 L46 96 L54 88 M66 88 L74 96 L80 90 L86 96', 'none', C.white, 2),
    moving('ws-ige', '0%,20%{transform:translate(0,-18px)}70%,100%{transform:translate(0,0)}', { dur: 2.6 }, wz(60, 118, 0.5, pose({ aL: [[-12, -76], [-16, -88]], aR: [[12, -76], [16, -88]] }), { hs: 'hat', top: C.red, mouth: 'o' })),
    path('M34 100 L86 100 L86 120 L34 120 Z', WATER, null), waIn('ws-plask', 0, 6, path('M40 84 l-4 -8 M50 80 l-1 -10 M70 80 l1 -10 M80 84 l4 -8', 'none', C.sky, 2))),
  // ispik: the leading skater strikes the ice ahead with a long pole with a metal tip (the pole is orange)
  'winter.ispik': all(lake(56), wz(48, 104, 0.6, pose({ n: [4, -68], aR: [[14, -60], [22, -56]], aL: [[10, -58], [20, -60]] }), { hs: 'hat', top: C.navy, back: all(blade(-5, -1, 16), blade(5, -1, 16)) }),
    moving('ws-pik', '0%,100%{transform:translate(0,-5px)}50%{transform:translate(0,0)}', { dur: 1.2 }, line('M60 64 L92 106', C.ink, 4.4), line('M60 64 L92 106', HL, 2.6), path('M90 104 L95 110 L94 102 Z', C.silver, C.ink, 1)),
    path('M86 110 L90 106 M96 110 L94 106', 'none', C.white, 1.6)),
  // isdubb (ett par isdubbar): the pair of handles with steel spikes on a cord, as worn round the neck
  'winter.isdubb': all(sky(SKY2), path('M36 30 C40 4 80 4 84 30', 'none', C.skin, 0), spikes(60, 78, 1.3), ring(60, 66, 44)),
  // kastlina: a bag with a rope is thrown from the ice to a person in a hole (the bag flies to the person)
  'winter.kastlina': all(lake(54), ellipse(88, 100, 18, 7, WATER, C.ink, 1.4), wz(88, 112, 0.36, pose({ aL: [[-10, -76], [-14, -86]], aR: [[10, -76], [14, -86]] }), { hs: 'hat', top: C.red, mouth: 'o' }), path('M70 100 L106 100 L106 120 L70 120 Z', WATER, null),
    wz(26, 104, 0.5, pose({ aR: [[10, -74], [18, -82]] }), { hs: 'hat', top: C.navy }), path('M35 63 C56 28 76 40 84 70', 'none', C.yellow, 1.8),
    travel('ws-kast', 40, -12, 2.4, at(84, 72, 1, rect(-6, -8, 12, 14, HL, 3, C.ink, 1.4), line('M-6 -4 L6 -4', C.ink, 1)))),
};

// ── 4657 Skidskytte ──────────────────────────────────────────────────
const targetPlate = (x: number, y: number, s = 1, hits: boolean[] = [false, false, false, false, false], hl: number = -1) => at(x, y, s, rect(-30, -8, 60, 16, C.white, 2, C.ink, 1.4),
  ...range(5).map((i) => all(circle(-24 + i * 12, 0, 4.6, hits[i] ? C.white : C.black, C.ink, 1.2), i === hl ? circle(-24 + i * 12, 0, 6.6, 'none', HL, 1.6) : '')));
const rifle = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 4.6), line(`M${x1} ${y1} L${x2} ${y2}`, '#5a4636', 3), line(`M${f1(x1 + (x2 - x1) * 0.55)} ${f1(y1 + (y2 - y1) * 0.55)} L${x2} ${y2}`, C.dark, 1.6));
const flash = (name: string, x: number, y: number) => waPulse(name, path(`M${x} ${y} l6 -3 l-2 3 l6 0 l-6 2 l2 3 Z`, C.yellow, C.orange, 0.8));
const biathlete = (x: number, y: number, s: number, o: Look = {}) => wz(x, y, s, DIAGONAL, { hs: 'hat', hat: C.yellow, top: C.navy, leg: C.dark, bib: C.white, ...o, back: all(DIAG_GEAR(), rifleBack(DIAGONAL)) });
const M7: Record<string, Svg> = {
  // skidskytte: a skier with a rifle on the back in the track; the shooting range with black targets behind
  'winter.skidskytte': all(sky(), forest(54), flat(56), rect(8, 40, 56, 14, C.white, 2, C.ink, 1.2), ...range(5).map((i) => circle(16 + i * 10, 47, 3, C.black, null)), tracks(), biathlete(70, 108, 0.6), frame(4, 4, 112, 112, HL)),
  // skjuta (med vapen): a standing shooter fires at a target; the flash and the bullet path appear, one disc turns white
  'winter.skjuta': all(sky(), forest(56), flat(58), swap('ws-skjut', targetPlate(96, 50, 0.4), targetPlate(96, 50, 0.4, [true, false, false, false, false]), 2.2),
    wz(36, 108, 0.62, STANDSHOOT, { hs: 'hat', hat: C.yellow, top: C.navy, front: rifle(-2, -64, 32, -64) }), flash('ws-skjutf', 57, 66), waIn('ws-kula', -20, 6, line('M66 68 L86 52', HL, 1.8, '3 3'))),
  // skjutvall: the range seen from behind the mats – lanes with a lying and a standing shooter, targets far away
  'winter.skjutvall': all(sky(), forest(44), flat(46), ...range(4).map((i) => targetPlate(18 + i * 28, 52, 0.36)), ...range(5).map((i) => line(`M${4 + i * 28} 120 L${14 + i * 26} 60`, SHADE, 1.2)),
    wz(30, 108, 0.42, PRONE, { hs: 'hat', hat: C.yellow, top: C.red, back: rifle(22, -14, 46, -16) }), wz(86, 110, 0.4, STANDSHOOT, { hs: 'hat', hat: C.navy, top: C.green, front: rifle(-2, -64, 26, -64) }), frame(4, 40, 112, 76, HL)),
  // måltavla: the target plate with five black discs; two are hit and have turned white
  'winter.måltavla': all(sky(), forest(60), flat(60), rect(54, 72, 12, 30, C.grey, 1, C.ink, 1.2), swap('ws-tavla', targetPlate(60, 64, 1.5), targetPlate(60, 64, 1.5, [true, true, false, false, false]), 2.6), ring(60, 64, 50)),
  // liggande skytte: lying on the stomach with the rifle on the snow mat, elbows down (the muzzle flashes)
  'winter.liggande-skytte': all(sky(), forest(56), flat(58), targetPlate(92, 50, 0.4), rect(6, 96, 84, 8, C.red, 2, C.ink, 1),
    wz(54, 102, 0.8, PRONE, { hs: 'hat', hat: C.yellow, top: C.navy, bib: C.white, back: rifle(20, -14, 46, -17) }), flash('ws-ligg', 92, 88), path('M4 112 L90 112', 'none', HL, 3), greyed(wz(14, 70, 0.3, STANDSHOOT, { hs: 'hat', front: rifle(-2, -64, 26, -64) }))),
  // stående skytte: standing upright, rifle at the shoulder without support (the muzzle flashes)
  'winter.stående-skytte': all(sky(), forest(56), flat(58), targetPlate(92, 50, 0.4), wz(48, 108, 0.62, STANDSHOOT, { hs: 'hat', hat: C.yellow, top: C.navy, bib: C.white, front: rifle(-2, -64, 32, -64) }), flash('ws-stå', 70, 66), path('M34 112 L62 112', 'none', HL, 3), greyed(wz(98, 108, 0.3, PRONE, { hs: 'hat', back: rifle(20, -14, 46, -17) }))),
  // bomma: the shot (orange line) passes beside a target, which stays black; a red cross
  'winter.bomma': all(sky(SKY2), targetPlate(60, 50, 1.6, [true, true, false, true, true], 2), travel('ws-bom', 0, 60, 1.8, path('M64 16 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z', HL, C.ink, 0.8)), line('M60 34 L63 26', HL, 1.6, '2 2'), cross(96, 96)),
  // skjuta fullt: all five discs turn white one after another (hits), a green check
  'winter.skjuta-fullt': all(sky(SKY2), swap('ws-full', targetPlate(60, 50, 1.6), targetPlate(60, 50, 1.6, [true, true, true, true, true]), 2.6), rect(8, 30, 104, 40, 'none', 6, HL, 2.6), check(60, 96, 1.3)),
  // straffrunda: a small extra loop beside the track (orange), a skier going round it
  'winter.straffrunda': all(sky(), forest(54), flat(56), line('M0 74 L120 74', SHADE, 2), ellipse(60, 94, 34, 14, 'none', HL, 4), path('M92 90 L98 94 L90 98', HL, HL, 1.4),
    targetPlate(26, 64, 0.34, [true, false, true, true, true]), biathlete(52, 112, 0.36, { mouth: 'flat' })),
  // tidstillägg: a stopwatch with a plus and one minute added (orange sector), instead of a loop (grey, crossed)
  'winter.tidstillägg': all(sky(SKY2), circle(52, 62, 32, C.white, C.ink, 2), rect(46, 22, 12, 8, C.dark, 2, C.ink, 1), sector(52, 62, 32, 60, HL), line('M52 62 L52 38', C.ink, 2.4), circle(52, 62, 2, C.ink, null),
    num(98, 46, '+1', 20, HL), greyed(ellipse(98, 92, 14, 6, 'none', C.grey, 2.4)), line('M86 84 L110 100 M110 84 L86 100', C.red, 2.4)),
  // jaktstart: skiers start one by one from a line – gaps between them, a small clock above each
  'winter.jaktstart': all(sky(), forest(54), flat(56), line('M20 64 L20 116', HL, 3),
    ...[[94, 0], [66, 14], [40, 32]].map(([x, h], i) => all(biathlete(x!, 104, 0.32, { top: [C.red, C.navy, C.green][i] }), clock(x! + 2, 36, 7, h! * 6, i === 0 ? HL : C.white))),
    arrow(96, 76, 116, 76, C.grey, 2)),
};

export const WINTER_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
