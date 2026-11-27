/**
 * Kultur & fritid → Sport & träning → Träningens grunder, 4611–4617 (0.64): warming up and cooling down, cardio,
 * strength training, mobility and stretching, sessions and sets, recovery, training goals and progression.
 * People are drawn with a posable figure (`fz`, the same joint-chain idea as `dz` in dance.ts): every limb is a
 * chain hip–knee–foot or shoulder–elbow–hand with fixed segment lengths, so squats, deadlifts, push-ups and lunges
 * can be drawn with a straight back, knees over the toes and both arms and legs in place. Exercises are drawn from
 * the side (profile) so the line of the back is visible.
 * Movement: `swap()` shows the start position first and then the end position (opacity only). The end position is
 * the poster frame; the start position has opacity 0 outside the animation, so the still picture shows one figure.
 * The part the word names is orange (HL); grey figures and things are the reference. No letters, no brands.
 * Easily confused words get different kinds of picture: the whole barbell being lifted (skivstång) against one plate
 * in a hand (viktskiva) against a pair of dumbbells (hantel) against a swinging bell (kettlebell); a plan on a
 * clipboard (träningsprogram) against a calendar day (pass) against a phone that gets a tick (logga).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, C.red, C.ink, 1.4), line('M-4 -4 L4 4 M4 -4 L-4 4', C.white, 2.6));

/** Start pose first, then the end pose (poster frame). Opacity only. */
const swap = (name: string, a: Svg, b: Svg, dur = 2.4): Svg => all(
  `<style data-wa>@keyframes wa-${name}-s{0%,40%{opacity:1}50%,90%{opacity:0}100%{opacity:1}}.wa-${name}-s{animation:wa-${name}-s ${dur}s ease-in-out infinite both}</style><g data-wa="${name}-s" class="wa-${name}-s" opacity="0">${a}</g>`,
  moving(name, '0%,40%{opacity:0}50%,90%{opacity:1}100%{opacity:0}', { dur }, b));

// ── The posable figure ────────────────────────────────────────────────
// Local units: feet at y = 0, standing height ≈ 86. Upper arm ≈ 12, forearm ≈ 13, thigh ≈ 21, shin ≈ 20, torso 26.
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = { top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'pony'; shoe?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'o' | 'grit'; sleeves?: boolean; front?: Svg; back?: Svg; shorts?: boolean };
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
function fz(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.sky), leg = grey ? C.grey : (o.leg ?? C.navy);
  const hair = grey ? C.grey : (o.hair ?? C.hair), shoe = grey ? C.grey : (o.shoe ?? C.white);
  const armCol = o.sleeves === false ? skin : top;
  const limb = (from: Pt, j: [Pt, Pt], col: string, w: number, col2?: string) => {
    const d1 = `M${from[0]} ${from[1]} L${j[0][0]} ${j[0][1]}`, d2 = `M${j[0][0]} ${j[0][1]} L${j[1][0]} ${j[1][1]}`;
    return all(line(d1 + ` L${j[1][0]} ${j[1][1]}`, ink, w + 2.4), line(d1, col, w), line(d2, col2 ?? col, w), circle(j[0][0], j[0][1], w / 2, col2 ?? col, null));
  };
  const legLimb = (j: [Pt, Pt]) => limb(p.h, j, leg, 5.4, o.shorts ? skin : leg);
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const hand = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 2.8, skin, ink, 1);
  const foot = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 3.2, shoe, ink, 1.1);
  const hairBack = o.hs === 'long' || o.hs === 'pony' ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, o.hs === 'long' ? path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2) : path('M6 -6 C14 -4 16 6 12 12 C12 6 10 2 6 0 Z', hair, ink, 1.2)) : '';
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, o.hs === 'bun' ? all(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2)) : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null),
    m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.2, 1.3, '#c84a4a', ink, 0.8)
      : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'grit' ? all(rect(-3, 2.8, 6, 2.6, C.white, 0.6, ink, 0.8), line('M-3 4.1 L3 4.1', ink, 0.6)) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  return at(x, y, s, o.back ?? '',
    hairBack, legLimb(p.lL), foot(p.lL), legLimb(p.lR), foot(p.lR),
    line(torso, ink, 14.4), line(torso, top, 12),
    limb(p.n, p.aL, armCol, 4.4, o.sleeves === false ? skin : (o.sleeves === true ? top : skin)), hand(p.aL), limb(p.n, p.aR, armCol, 4.4, o.sleeves === false ? skin : (o.sleeves === true ? top : skin)), hand(p.aR),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face, o.front ?? '');
}

// ── Poses (profile poses face right) ──────────────────────────────────
const ARMS_UP = { aL: [[-8, -80], [-12, -92]] as [Pt, Pt], aR: [[8, -80], [12, -92]] as [Pt, Pt] };
const JACK_OUT = pose({ aL: [[-14, -78], [-20, -90]], aR: [[14, -78], [20, -90]], lL: [[-10, -21], [-17, -1]], lR: [[10, -21], [17, -1]] });
const JACK_IN = pose({ aL: [[-7, -56], [-8, -43]], aR: [[7, -56], [8, -43]], lL: [[-3, -21], [-3, -1]], lR: [[3, -21], [3, -1]] });
const JOG_A = pose({ h: [0, -43], n: [2, -69], aL: [[-6, -60], [0, -52]], aR: [[10, -60], [12, -70]], lL: [[-2, -22], [-4, -1]], lR: [[10, -32], [8, -14]] });
const JOG_B = pose({ h: [0, -43], n: [2, -69], aL: [[-4, -62], [4, -70]], aR: [[8, -58], [4, -50]], lL: [[10, -32], [8, -14]], lR: [[-2, -22], [-4, -1]] });
const RUN_A = pose({ h: [0, -44], n: [5, -69], aL: [[-6, -60], [-2, -50]], aR: [[12, -60], [18, -68]], lL: [[-8, -26], [-20, -16]], lR: [[10, -26], [8, -2]] });
const RUN_B = pose({ h: [0, -44], n: [5, -69], aL: [[10, -60], [16, -68]], aR: [[-4, -60], [-1, -50]], lL: [[10, -26], [8, -2]], lR: [[-8, -26], [-20, -16]] });
const WALK_A = pose({ n: [1, -68], aL: [[-6, -56], [-11, -45]], aR: [[7, -56], [12, -46]], lL: [[-5, -21], [-10, -1]], lR: [[6, -21], [10, -1]] });
const WALK_B = pose({ n: [1, -68], aL: [[6, -56], [11, -46]], aR: [[-5, -56], [-10, -45]], lL: [[6, -21], [10, -1]], lR: [[-5, -21], [-10, -1]] });
// Deadlift: start hinged with a straight back, end standing tall; hands straight below the shoulders.
const DL_START = pose({ h: [-7, -27], n: [15, -41], aL: [[15, -29], [14, -16]], aR: [[16, -29], [15, -16]], lL: [[11, -17], [2, -1]], lR: [[12, -17], [4, -1]] });
// Deadlift start for the poster: shins nearly upright, hips above the knees, straight back ≈40°, arms hanging straight
// down to the bar at mid-shin height (bar centre = plate centre, plate radius 10.7 standing on the floor).
const DL_LOW = pose({ h: [-5.9, -26], n: [14, -42.7], aL: [[12.6, -27.7], [12.6, -10.7]], aR: [[14, -27.7], [14, -10.7]], lL: [[11.9, -19.6], [3, -1]], lR: [[13.9, -19.1], [5.4, -1]] });
const DL_END = pose({ h: [2, -42], n: [3, -68], aL: [[4, -56], [5, -43]], aR: [[5, -56], [6, -43]], lL: [[3, -21], [2, -1]], lR: [[4, -21], [4, -1]] });
// Bench press: lying on the bench, feet on the floor; bar on the chest → arms straight up.
const BP_DOWN = pose({ h: [-12, -22], n: [12, -22], aL: [[1, -24], [8, -31]], aR: [[2, -24], [9, -31]], lL: [[-30, -20], [-33, -1]], lR: [[-29, -20], [-31, -1]] });
const BP_UP = pose({ h: [-12, -22], n: [12, -22], aL: [[11, -34], [10, -47]], aR: [[12, -34], [11, -47]], lL: [[-30, -20], [-33, -1]], lR: [[-29, -20], [-31, -1]] });
// Push-up: hands and toes stay on the floor, the body is a straight line.
const PU_UP = pose({ h: [-8.3, -15.7], n: [16, -25], aL: [[16, -13], [16, -1]], aR: [[17, -13], [17, -1]], lL: [[-27.9, -8.2], [-46, -1]], lR: [[-27.9, -8.2], [-46, -1]] });
const PU_DOWN = pose({ h: [-5.2, -5.7], n: [20.7, -8], aL: [[10, -12], [16, -1]], aR: [[11, -12], [17, -1]], lL: [[-26, -3.6], [-46, -1]], lR: [[-26, -3.6], [-46, -1]] });
// Lunge: front shin vertical (knee over the ankle), back knee just above the floor, upright torso.
const LUNGE = pose({ h: [-2, -24], n: [-1, -50], aL: [[-8, -40], [-5, -28]], aR: [[5, -40], [2, -28]], lL: [[18, -22], [18, -1]], lR: [[-10, -6], [-26, -2]] });
const HANDS_HIPS = pose({ aL: [[-8, -56], [-4, -44]], aR: [[8, -56], [4, -44]] });
// Kettlebell swing: hinge with the bell between the legs → standing, arms straight forward at chest height.
const KB_LOW = pose({ h: [-8, -36], n: [10, -54], aL: [[6, -43], [1, -32]], aR: [[7, -43], [2, -32]], lL: [[5, -19], [1, -1]], lR: [[6, -19], [3, -1]] });
const KB_HIGH = pose({ h: [0, -42], n: [1, -68], aL: [[13, -66], [25, -64]], aR: [[13, -65], [25, -63]], lL: [[1, -21], [0, -1]], lR: [[2, -21], [2, -1]] });
// Sitting on the floor
const SIT_CROSS = pose({ h: [0, -8], n: [0, -34], aL: [[-10, -22], [-14, -10]], aR: [[10, -22], [14, -10]], lL: [[-14, -6], [6, -2]], lR: [[14, -6], [-6, -2]] });
const SIT_TWIST = pose({ h: [0, -8], n: [0, -34], aL: [[8, -26], [14, -12]], aR: [[-6, -24], [-18, -14]], lL: [[-14, -6], [6, -2]], lR: [[14, -6], [-6, -2]] });

// ── Settings and things ───────────────────────────────────────────────
const GYM_WALL = '#e9edf1', MAT = '#5aa6a0', BENCH = '#2f3440';
const gym = (floor = 96) => all(rect(0, 0, 120, 120, GYM_WALL, 0, null), rect(0, floor, 120, 120 - floor, '#c9ccd2', 0, null), line(`M0 ${floor} L120 ${floor}`, C.ink, 1.4));
const hall = () => all(rect(0, 0, 120, 120, '#f1ead9', 0, null), rect(0, 94, 120, 26, '#d9b07a', 0, null), line('M0 94 L120 94', C.ink, 1.4), line('M0 104 L120 104 M30 94 L22 120 M90 94 L98 120', '#c0965f', 1));
const outdoor = () => all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), rect(0, 92, 120, 28, '#a9d18e', 0, null), line('M0 92 L120 92', C.ink, 1.2));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -10, 4, 10, C.brown, 1, null), circle(0, -18, 10, '#6fb36a', C.ink, 1.2));
const dumbbell = (x: number, y: number, s = 1, rot = 0, col: string = C.dark) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-9, -1.6, 18, 3.2, C.silver, 1, C.ink, 1), rect(-14, -6, 5, 12, col, 1.5, C.ink, 1.2), rect(9, -6, 5, 12, col, 1.5, C.ink, 1.2), rect(-17, -4.5, 3, 9, col, 1, C.ink, 1), rect(14, -4.5, 3, 9, col, 1, C.ink, 1));
/** Barbell seen from the front: long bar, plates at both ends. */
const barbell = (x: number, y: number, s = 1, bar: string = C.silver, plate: string = C.dark) => at(x, y, s,
  rect(-52, -1.8, 104, 3.6, bar, 1.5, C.ink, 1.2), ...[-1, 1].map((d) => all(rect(d * 38 - 3, -15, 6, 30, plate, 2, C.ink, 1.4), rect(d * 44 - 2.5, -12, 5, 24, plate, 2, C.ink, 1.2), rect(d * 49 - 1.5, -4, 3, 8, C.grey, 1, C.ink, 1))));
/** Plate seen face on (also a barbell seen from the side). */
const plate = (x: number, y: number, r: number, col: string = C.dark) => all(circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.62, 'none', '#6b6f7a', 1.2), circle(x, y, r * 0.16, C.silver, C.ink, 1));
const kettlebell = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, path('M-7 -10 C-8 -20 8 -20 7 -10', 'none', C.ink, 6.4), path('M-7 -10 C-8 -20 8 -20 7 -10', 'none', col, 3.6), circle(0, 0, 11, col, C.ink, 1.6), path('M-11 6 L11 6 L9 10 L-9 10 Z', col, C.ink, 1.2), circle(-4, -3, 2.2, 'rgba(255,255,255,0.35)', null));
const bench = (x: number, y: number, w = 40, h = 18) => all(rect(x - w / 2, y - h, w, 5, BENCH, 2, C.ink, 1.4), line(`M${x - w / 2 + 5} ${y - h + 5} L${x - w / 2 + 5} ${y} M${x + w / 2 - 5} ${y - h + 5} L${x + w / 2 - 5} ${y}`, C.ink, 2.6));
const mat = (x: number, y: number, w = 70, col: string = MAT) => rect(x - w / 2, y - 3, w, 4, col, 2, C.ink, 1.2);
const heart = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', col, C.ink, 1.4));
const thermo = (x: number, y: number, s: number, lvl: number, col: string = C.red) => at(x, y, s, rect(-4, -30, 8, 32, C.white, 4, C.ink, 1.4), circle(0, 6, 7, col, C.ink, 1.4), rect(-2, 2 - lvl, 4, lvl, col, 1, null), ...[-22, -14, -6].map((ty) => line(`M4 ${ty} L8 ${ty}`, C.ink, 1)));
const clock = (x: number, y: number, r = 9, hand = 60) => all(circle(x, y, r, C.white, C.ink, 1.4), line(`M${x} ${y} L${x} ${y - r * 0.7}`, C.ink, 1.4), line(`M${x} ${y} L${f1(x + Math.sin((hand * Math.PI) / 180) * r * 0.6)} ${f1(y - Math.cos((hand * Math.PI) / 180) * r * 0.6)}`, C.ink, 1.4));
const bottle = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, rect(-4, -14, 8, 16, col, 2, C.ink, 1.2), rect(-2.5, -18, 5, 4, C.white, 1, C.ink, 1));
const gauge = (x: number, y: number, r: number, needle: Svg) => all(path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, C.white, C.ink, 1.6),
  path(`M${x - r + 3} ${y} A${r - 3} ${r - 3} 0 0 1 ${f1(x - (r - 3) * 0.5)} ${f1(y - (r - 3) * 0.866)}`, 'none', C.green, 4), path(`M${f1(x - (r - 3) * 0.5)} ${f1(y - (r - 3) * 0.866)} A${r - 3} ${r - 3} 0 0 1 ${f1(x + (r - 3) * 0.5)} ${f1(y - (r - 3) * 0.866)}`, 'none', C.yellow, 4),
  path(`M${f1(x + (r - 3) * 0.5)} ${f1(y - (r - 3) * 0.866)} A${r - 3} ${r - 3} 0 0 1 ${x + r - 3} ${y}`, 'none', C.red, 4), needle, circle(x, y, 2.4, C.ink, null));
const card = (x: number, y: number, w: number, h: number, fill: string = C.white) => rect(x, y, w, h, fill, 3, C.ink, 1.6);
const phone = (x: number, y: number, s = 1, screen: Svg = '') => at(x, y, s, rect(-14, -24, 28, 48, C.dark, 4, C.ink, 1.6), rect(-11, -19, 22, 36, '#eef6fb', 1.5, null), screen, circle(0, 20.5, 1.6, C.grey, null));
const stepBox = (x: number, y: number, w = 26) => all(rect(x - w / 2, y - 7, w, 7, C.dark, 2, C.ink, 1.2), rect(x - w / 2 + 2, y - 9, w - 4, 3, '#6b6f7a', 1, C.ink, 0.8));
const mnote = (x: number, y: number, col: string = C.navy) => at(x, y, 1, line('M2.6 5 L2.6 -10 C6 -8 8 -6 8 -2', col, 2), ellipse(0, 5.6, 3.4, 2.6, col, null));
const ball = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, C.ink, 1.4), path(`M${x - r * 0.4} ${y - r * 0.3} L${x} ${y - r * 0.6} L${x + r * 0.4} ${y - r * 0.3} L${x + r * 0.25} ${y + r * 0.2} L${x - r * 0.25} ${y + r * 0.2} Z`, C.ink, null));
const racket = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ellipse(0, -10, 8, 10, 'none', C.red, 2.4), line('M0 0 L0 12', C.ink, 3), line('M-5 -14 L5 -14 M-6 -9 L6 -9 M-5 -4 L5 -4 M-3 -18 L-3 -1 M3 -18 L3 -1', C.grey, 0.7));
const skis = (x: number, y: number, s = 1) => at(x, y, s, line('M-4 14 L-6 -16 C-6 -19 -4 -20 -3 -18', C.denim, 3.2), line('M4 14 L6 -16 C6 -19 4 -20 3 -18', C.denim, 3.2), line('M-10 12 L-12 -14 M12 12 L14 -14', C.ink, 1.4));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 C6 -6 8 0 4 6 C2 8 -2 8 -4 6 C-8 0 -4 -4 0 -12 Z', C.orange, C.ink, 1.2), path('M0 -4 C3 -1 3 3 1 5 C0 6 -1 6 -2 5 C-3 3 -2 0 0 -4 Z', C.yellow, null));
const swish = (d: string) => line(d, HL, 2.2, '4 3');
const battery = (x: number, y: number, lvl: number, col: string = C.green) => all(rect(x - 12, y - 6, 22, 12, C.white, 2, C.ink, 1.4), rect(x + 10, y - 3, 3, 6, C.ink, 1, null), rect(x - 10, y - 4, f1(18 * lvl), 8, col, 1, null));

// ── Machines ──────────────────────────────────────────────────────────
const treadmill = (x: number, y: number) => all(path(`M${x - 40} ${y} L${x + 30} ${y} L${x + 34} ${y - 8} L${x - 36} ${y - 8} Z`, C.dark, C.ink, 1.6), line(`M${x - 34} ${y - 8} L${x + 32} ${y - 8}`, '#1f2128', 3),
  line(`M${x + 30} ${y - 8} L${x + 24} ${y - 58}`, C.ink, 3), rect(x + 12, y - 66, 22, 10, C.grey2, 2, C.ink, 1.4), rect(x + 15, y - 64, 10, 6, '#bfe3f5', 1, null), line(`M${x + 24} ${y - 52} L${x + 8} ${y - 48}`, C.ink, 2.4));
const rower = (x: number, y: number) => all(line(`M${x - 44} ${y - 6} L${x + 30} ${y - 6}`, C.dark, 4), line(`M${x - 44} ${y - 6} L${x - 46} ${y} M${x + 26} ${y - 6} L${x + 30} ${y}`, C.ink, 2.4),
  circle(x + 34, y - 12, 10, C.grey2, C.ink, 1.6), circle(x + 34, y - 12, 3, C.dark, null), rect(x + 14, y - 12, 8, 4, C.dark, 1, C.ink, 1));
const bike = (x: number, y: number) => all(line(`M${x - 22} ${y} L${x + 24} ${y}`, C.ink, 3), path(`M${x - 14} ${y} L${x - 6} ${y - 30} L${x + 14} ${y - 24} L${x + 18} ${y}`, 'none', C.dark, 4),
  line(`M${x - 6} ${y - 30} L${x - 9} ${y - 38}`, C.dark, 3), rect(x - 15, y - 41, 12, 4, C.ink, 2, null), line(`M${x + 14} ${y - 24} L${x + 18} ${y - 44}`, C.dark, 3), line(`M${x + 14} ${y - 44} L${x + 24} ${y - 46}`, C.ink, 3),
  circle(x + 18, y - 16, 9, C.grey2, C.ink, 1.4));

export const TRNG_MOTIFS: Record<string, Svg> = {
  // ── 4611 Uppvärmning och nedvarvning ───────────────────────────────
  // idrott: an athletics field – a runner, a high jumper over the bar, a footballer with a ball
  'trng.idrott': all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), rect(0, 70, 120, 50, '#7fbf6a', 0, null), path('M0 92 C40 84 80 84 120 92 L120 108 C80 100 40 100 0 108 Z', '#d0694f', null), line('M0 100 C40 92 80 92 120 100', C.white, 1),
    line('M70 46 L70 70 M102 46 L102 70', C.ink, 1.6), line('M70 50 L102 50', C.ink, 1.4),
    fz(28, 100, 0.5, RUN_A, { top: C.red, leg: C.red, shorts: true, sleeves: false }),
    g('rotate(-80 86 44)', fz(86, 44, 0.42, pose({ ...ARMS_UP }), { top: C.yellow, leg: C.navy, shorts: true, sleeves: false })),
    fz(94, 86, 0.42, pose({ h: [0, -42], n: [-3, -68], lR: [[10, -26], [20, -18]], aL: [[-12, -60], [-18, -52]], aR: [[10, -58], [16, -50]] }), { top: C.green, leg: C.white, shorts: true, sleeves: false }), ball(106, 80, 3.4),
    frame(4, 30, 112, 86)),
  // sport: sports gear on a shelf – ball, racket, skis, dumbbell, puck and stick
  'trng.sport': all(rect(0, 0, 120, 120, '#f4efe6', 0, null), rect(10, 56, 100, 4, C.brown, 1, C.ink, 1.2), rect(10, 98, 100, 4, C.brown, 1, C.ink, 1.2),
    ball(28, 47, 8), racket(56, 46, 0.9, 20), skis(88, 36, 0.8), dumbbell(30, 92, 0.8), line('M58 96 L66 70 M58 96 L76 96', C.ink, 3), ellipse(90, 93, 8, 3.4, C.black, C.ink, 1), frame(6, 18, 108, 88)),
  // värma upp: jumping jacks (moves) while the thermometer rises
  'trng.värma-upp.3': all(hall(), swap('trng-varma', fz(50, 104, 0.95, JACK_IN, { top: C.orange, leg: C.navy }), fz(50, 104, 0.95, JACK_OUT, { top: C.orange, leg: C.navy, mouth: 'open' }), 0.9),
    thermo(98, 66, 1, 8, C.grey), waGrow('trng-varma-t', thermo(98, 66, 1, 26)), flame(98, 20, 0.8)),
  // övning (träning): an exercise card on the wall shows one movement; the person does exactly that movement
  'trng.övning.3': all(gym(), card(14, 14, 40, 52), at(34, 58, 0.36, fz(0, 0, 1, pose({ h: [-8, -30], n: [8, -50], aL: [[16, -44], [24, -40]], aR: [[16, -46], [26, -42]], lL: [[6, -16], [0, -1]], lR: [[8, -16], [2, -1]] }), { top: HL, leg: C.navy })),
    line('M22 24 L46 24 M22 30 L40 30', C.grey2, 2), frame(10, 10, 48, 60),
    fz(84, 106, 0.8, pose({ h: [-8, -30], n: [8, -50], aL: [[16, -44], [24, -40]], aR: [[16, -46], [26, -42]], lL: [[6, -16], [0, -1]], lR: [[8, -16], [2, -1]] }), { top: HL, leg: C.navy }), mat(84, 108, 60)),
  // jogga på stället: jogging but staying on one marked spot (legs change, the figure does not travel)
  'trng.jogga-på-stället': all(hall(), ellipse(60, 106, 24, 5, 'none', HL, 2.4), line('M36 106 L28 106 M84 106 L92 106', HL, 2),
    swap('trng-jogga', fz(60, 104, 0.95, JOG_A, { top: C.green, leg: C.navy }), fz(60, 104, 0.95, JOG_B, { top: C.green, leg: C.navy }), 0.7)),
  // höja pulsen: the pulse needle climbs from green to red, the heart grows; a small jogger
  'trng.höja-pulsen': all(rect(0, 0, 120, 120, '#f6f0f0', 0, null), gauge(60, 64, 38, moving('trng-puls-n', '0%{transform:rotate(-70deg)}60%,100%{transform:rotate(0deg)}', { dur: 2.6 }, g('translate(60 64)', line('M0 0 L18 -28', C.ink, 3)))),
    waGrow('trng-puls-h', heart(60, 92, 1.4)), arrow(100, 100, 100, 70, HL, 3), fz(18, 112, 0.36, JOG_A, { top: C.green, leg: C.navy })),
  // mjuka upp: rolling the shoulders (shoulders up and back), circular arrows at both shoulders
  'trng.mjuka-upp.2': all(rect(0, 0, 120, 120, '#eef4ee', 0, null), ground(),
    swap('trng-mjuka', fz(60, 111, 1.05, pose({ n: [0, -70], aL: [[-9, -60], [-10, -46]], aR: [[9, -60], [10, -46]] }), { top: C.purple, leg: C.navy }), fz(60, 111, 1.05, pose({ n: [0, -66], aL: [[-8, -54], [-9, -41]], aR: [[8, -54], [9, -41]] }), { top: C.purple, leg: C.navy }), 1.6),
    path('M38 30 A10 10 0 1 1 40 46', 'none', HL, 2.4), arrow(42, 44, 39, 47, HL, 2.4), path('M82 30 A10 10 0 1 0 80 46', 'none', HL, 2.4), arrow(78, 44, 81, 47, HL, 2.4)),
  // nedvarvning: the end of a session in three steps – run → walk → stretch on the mat; a heart that gets calmer
  'trng.nedvarvning.2': all(rect(0, 0, 120, 120, '#f2efe8', 0, null), ...[4, 42, 80].map((x, i) => rect(x, 30, 36, 56, i === 0 ? '#f6e3dc' : '#e1efe6', 3, C.ink, 1.2)),
    fz(22, 82, 0.5, RUN_A, { top: C.grey, leg: C.grey, grey: true }), fz(60, 82, 0.5, WALK_A, { top: C.green, leg: C.navy }),
    fz(98, 82, 0.5, pose({ h: [0, -40], n: [-2, -66], aL: [[-10, -76], [-14, -90]], aR: [[10, -76], [14, -90]] }), { top: C.green, leg: C.navy }), mat(98, 84, 30),
    heart(22, 18, 0.9), heart(60, 18, 0.7, '#e88a8a'), heart(98, 18, 0.55, C.pink), arrow(30, 98, 90, 98, HL, 2.6), frame(40, 26, 78, 64)),
  // varva ner: the speed needle sinks from red to green while the runner slows to a walk
  'trng.varva-ner.2': all(rect(0, 0, 120, 120, '#eef4f6', 0, null), ground(),
    gauge(84, 42, 26, moving('trng-varva-n', '0%{transform:rotate(130deg)}60%,100%{transform:rotate(0deg)}', { dur: 2.8 }, g('translate(84 42)', line('M0 0 L-12 -18', C.ink, 3)))),
    swap('trng-varva', fz(34, 111, 0.9, RUN_A, { top: C.sky, leg: C.navy, mouth: 'open' }), fz(34, 111, 0.9, WALK_A, { top: C.sky, leg: C.navy }), 2.8),
    arrow(84, 76, 84, 98, HL, 3)),

  // ── 4612 Konditionsträning ─────────────────────────────────────────
  // motionera: a brisk walk in the park, arms swinging (moves), a tree and the sun
  'trng.motionera': all(outdoor(), tree(18, 92, 1.2), tree(104, 92), circle(96, 22, 8, C.yellow, C.ink, 1.2),
    swap('trng-motion', fz(60, 108, 0.95, WALK_A, { top: C.pink, leg: C.navy, hs: 'long' }), fz(60, 108, 0.95, WALK_B, { top: C.pink, leg: C.navy, hs: 'long' }), 1.2)),
  // orka (ha kraft): one runner keeps going up the hill with a full battery; a grey runner has stopped
  'trng.orka.1': all(rect(0, 0, 120, 120, '#eef5ea', 0, null), path('M0 112 L120 52 L120 120 L0 120 Z', '#a9d18e', C.ink, 1.4),
    greyed(fz(22, 104, 0.6, pose({ h: [0, -26], n: [0, -52], aL: [[-8, -40], [-6, -28]], aR: [[8, -40], [6, -28]], lL: [[-10, -14], [-6, -1]], lR: [[10, -14], [6, -1]] }), { mouth: 'open' })),
    waIn('trng-orka', -14, 7, fz(76, 76, 0.7, RUN_A, { top: C.orange, leg: C.navy })), battery(88, 18, 1), battery(22, 54, 0.15, C.red)),
  // ta i (kraft): pushing a heavy block with all one's strength (shakes), effort lines
  'trng.ta-i.2': all(rect(0, 0, 120, 120, '#f5efe6', 0, null), ground(),
    waShake('trng-tai', rect(66, 62, 44, 50, C.grey, 3, C.ink, 1.8), line('M70 70 L104 70', '#7d858f', 1.2)),
    fz(44, 111, 0.95, pose({ h: [-6, -38], n: [14, -58], aL: [[20, -60], [28, -62]], aR: [[21, -58], [29, -60]], lL: [[-14, -20], [-26, -1]], lR: [[6, -20], [2, -1]] }), { top: C.red, leg: C.navy, mouth: 'grit' }),
    line('M48 30 l-6 -8 M56 28 l0 -10 M64 30 l6 -8', HL, 2.4)),
  // löpband: running on a treadmill indoors (the stride changes, the runner stays on the belt)
  'trng.löpband': all(gym(104), treadmill(56, 104),
    swap('trng-lopband', fz(50, 96, 0.85, RUN_A, { top: C.yellow, leg: C.navy, hs: 'pony' }), fz(50, 96, 0.85, RUN_B, { top: C.yellow, leg: C.navy, hs: 'pony' }), 0.7),
    moving('trng-lopband-b', '0%{transform:translate(6px,0)}100%{transform:translate(-6px,0)}', { dur: 0.7 }, line('M24 96 L28 96 M44 96 L48 96 M64 96 L68 96', '#6b6f7a', 1.4))),
  // roddmaskin: rowing machine from the side; pulling the handle to the belly, legs straight (moves)
  'trng.roddmaskin': all(gym(), rower(54, 106),
    swap('trng-rodd', fz(46, 100, 0.6, pose({ h: [30, -8], n: [52, -30], aL: [[62, -20], [70, -14]], aR: [[63, -20], [71, -14]], lL: [[48, 4], [70, 8]], lR: [[48, 4], [70, 8]] }), { top: C.denim, leg: C.navy }),
      fz(46, 100, 0.6, pose({ h: [-10, -8], n: [-18, -32], aL: [[-8, -22], [2, -20]], aR: [[-7, -22], [3, -20]], lL: [[14, -10], [40, -6]], lR: [[14, -10], [40, -6]] }), { top: C.denim, leg: C.navy }), 2),
    line('M48 88 L84 94', C.ink, 1.2)),
  // motionscykel: an exercise bike standing on the floor; the pedals go round (moves)
  'trng.motionscykel': all(gym(), bike(58, 106),
    swap('trng-cykel', fz(52, 106, 0.8, pose({ h: [-6, -48], n: [8, -74], aL: [[18, -66], [26, -62]], aR: [[19, -66], [27, -62]], lL: [[14, -38], [24, -22]], lR: [[10, -30], [16, -12]] }), { top: C.green, leg: C.navy, sleeves: false }),
      fz(52, 106, 0.8, pose({ h: [-6, -48], n: [8, -74], aL: [[18, -66], [26, -62]], aR: [[19, -66], [27, -62]], lL: [[10, -30], [16, -12]], lR: [[14, -38], [24, -22]] }), { top: C.green, leg: C.navy, sleeves: false }), 0.8)),
  // aerobics: three people on step boxes in a group, arms up, music notes
  'trng.aerobics': all(hall(), ...[24, 60, 96].map((x, i) => all(stepBox(x, 104), fz(x, 96, 0.62, pose({ ...ARMS_UP, lR: [[8, -30], [6, -14]] }), { top: [C.pink, HL, C.lilac][i], leg: C.navy, hs: i === 1 ? 'pony' : 'long', sleeves: false }))),
    mnote(14, 24), mnote(104, 18), mnote(60, 14)),
  // syreupptagning: lungs take in oxygen (bubbles), it goes to the heart and on to a working leg muscle
  'trng.syreupptagning': all(rect(0, 0, 120, 120, '#eef5fb', 0, null),
    path('M40 30 C24 34 18 66 26 78 C34 84 44 78 46 66 L46 34 Z', '#f2a6a6', C.ink, 1.6), path('M80 30 C96 34 102 66 94 78 C86 84 76 78 74 66 L74 34 Z', '#f2a6a6', C.ink, 1.6), line('M60 8 L60 30 M60 30 L46 36 M60 30 L74 36', C.ink, 3),
    heart(60, 66, 1.1), line('M60 74 C60 90 70 98 84 100', C.red, 3), path('M84 92 C96 92 104 98 104 104 C104 110 96 112 84 110 Z', '#d9534f', C.ink, 1.4),
    waIn('trng-syre', 0, -16, ...[[52, 18], [66, 14], [56, 46], [66, 50], [72, 96]].map(([x, y]) => all(circle(x!, y!, 4.4, C.white, C.sky, 1.6), num(x!, y! + 2, 'O', 5.6, C.denim))))),

  // ── 4613 Styrketräning ─────────────────────────────────────────────
  // gym: a training room – a rack with a barbell, a bench, a dumbbell rack, a treadmill, two people training
  'trng.gym': all(gym(90), rect(6, 26, 22, 64, 'none', 2, C.ink, 2.4), barbell(17, 50, 0.24), rect(84, 70, 30, 4, C.ink, 1, null), line('M88 74 L88 90 M110 74 L110 90', C.ink, 2),
    ...[88, 96, 104, 110].map((x) => dumbbell(x, 66, 0.3, 90)), treadmill(70, 112), fz(64, 104, 0.5, RUN_A, { top: C.yellow, leg: C.navy }),
    bench(36, 112, 30, 14), fz(44, 100, 0.5, BP_UP, { top: C.red, leg: C.navy }), plate(49, 76, 4.4), plate(49, 76, 4.4), rect(0, 0, 120, 10, '#d4d8de', 0, null)),
  // muskel: a figure flexing; the muscles of arms, chest and thighs are drawn in red
  'trng.muskel': all(rect(0, 0, 120, 120, '#f6efe9', 0, null), ground(),
    fz(60, 111, 1.1, pose({ aL: [[-16, -70], [-14, -84]], aR: [[16, -70], [14, -84]] }), { top: C.skin, leg: C.navy, sleeves: false, front: all(
      ellipse(-15, -76, 3.4, 5, '#d9534f', C.ink, 0.8), ellipse(15, -76, 3.4, 5, '#d9534f', C.ink, 0.8), ellipse(-4, -60, 5, 4, '#d9534f', C.ink, 0.8), ellipse(4, -60, 5, 4, '#d9534f', C.ink, 0.8),
      ellipse(-4, -30, 2.6, 6, '#d9534f', C.ink, 0.8), ellipse(4, -30, 2.6, 6, '#d9534f', C.ink, 0.8)) })),
  // hantel: a pair of dumbbells on the floor and one lifted in the hand
  'trng.hantel': all(gym(), dumbbell(30, 102, 1.1), dumbbell(30, 86, 1.1, 0, HL),
    fz(84, 110, 0.9, pose({ aR: [[8, -56], [12, -72]] }), { top: C.green, leg: C.navy, sleeves: false, front: dumbbell(12, -72, 0.55, 90, HL) })),
  // skivstång: the whole barbell with plates at both ends is lifted from the floor (moves up)
  'trng.skivstång': all(gym(), shadowLine(),
    waBob('trng-skiv', 14, barbell(60, 84, 0.98, HL), ...[[48, 84], [72, 84]].map(([x, y]) => circle(x!, y!, 3.4, C.skin, C.ink, 1)))),
  // viktskiva: one plate held in two hands next to the end of a bar
  'trng.viktskiva': all(gym(), rect(0, 74, 46, 5, C.silver, 1.5, C.ink, 1.2), plate(20, 76, 20, C.dark), plate(76, 64, 26, HL), circle(52, 64, 4, C.skin, C.ink, 1), circle(100, 64, 4, C.skin, C.ink, 1)),
  // kettlebell: the round iron weight with a handle swings forward and up between the legs (moves)
  'trng.kettlebell': all(gym(), swap('trng-kb', fz(54, 106, 0.95, KB_LOW, { top: C.purple, leg: C.navy, sleeves: false, front: kettlebell(1.5, -24, 0.5, HL) }),
    fz(54, 106, 0.95, KB_HIGH, { top: C.purple, leg: C.navy, sleeves: false, front: kettlebell(25, -55, 0.5, HL) }), 1.4), swish('M58 82 C70 76 76 66 78 56')),
  // marklyft (profile): poster = the low position – bar at the shins, straight arms, hips back, straight back (dashed line); moves up to standing
  'trng.marklyft': all(gym(110), swap('trng-mark', all(plate(56.9, 60.6, 12.3, HL), fz(50, 110, 1.15, DL_END, { top: C.red, leg: C.denim, sleeves: false })),
    all(plate(68.4, 92.9, 17.1, HL), fz(46, 110, 1.6, DL_LOW, { top: C.red, leg: C.denim, sleeves: false }), line('M33 64 L65 38', C.green, 2, '3 3')), 2.2)),
  // bänkpress (profile): lying on the bench, feet on the floor, bar above the chest on straight arms (poster); moves from the chest
  'trng.bänkpress': all(gym(110), bench(50, 112, 56, 22), swap('trng-bank', all(plate(62.8, 74.8, 10, HL), fz(52, 112, 1.2, BP_DOWN, { top: C.navy, leg: C.dark, sleeves: false })),
    all(plate(65.2, 55.6, 11, HL), fz(52, 112, 1.2, BP_UP, { top: C.navy, leg: C.dark, sleeves: false })), 2), line('M104 60 L104 38 M98 44 L104 36 L110 44', HL, 2.4)),
  // armhävning: straight body, down to the floor and up again (moves); hands and toes stay put
  'trng.armhävning': all(rect(0, 0, 120, 120, '#eef1f5', 0, null), mat(62, 112, 100), swap('trng-arm', fz(64, 111, 0.95, PU_DOWN, { top: C.orange, leg: C.navy, sleeves: false }), fz(64, 111, 0.95, PU_UP, { top: C.orange, leg: C.navy, sleeves: false }), 1.6),
    line('M22 108 L81 87', C.green, 1.6, '3 3')),
  // utfallssteg: a long step forward, front shin upright, back knee near the floor (moves)
  'trng.utfallssteg': all(hall(), swap('trng-utfall', fz(56, 104, 1, HANDS_HIPS, { top: C.lilac, leg: C.navy }), fz(56, 104, 1, LUNGE, { top: C.lilac, leg: C.navy }), 1.8),
    line('M74 104 L74 74', C.green, 1.4, '3 3'), arrow(60, 116, 78, 116, HL, 2.4)),
  // teknik (sätt att göra): the same lift done right (straight back, tick, orange) and wrong (round back, grey, cross)
  'trng.teknik.2': all(gym(), greyed(fz(30, 108, 0.8, pose({ h: [-7, -28], n: [12, -36], aL: [[14, -26], [14, -15]], aR: [[15, -26], [15, -15]], lL: [[2, -18], [0, -1]], lR: [[3, -18], [2, -1]] }), { mouth: 'flat', back: path('M-7 -28 C0 -46 10 -44 12 -36', 'none', C.ink, 2) })), plate(42, 96, 9.6, C.grey), cross(30, 30),
    fz(84, 108, 0.8, DL_START, { top: C.red, leg: C.navy, sleeves: false }), plate(96, 95, 9.6, HL), line('M78 86 L96 75', C.green, 2, '3 3'), waPulse('trng-teknik', check(88, 30))),

  // ── 4614 Rörlighet och stretching ──────────────────────────────────
  // stelna (kroppen): sitting still at the desk for hours – the clock runs and stiff marks grow at neck and back
  'trng.stelna.2': all(rect(0, 0, 120, 120, '#f1f0ec', 0, null), ground(), rect(54, 60, 50, 4, C.brown, 1, C.ink, 1.2), line('M58 64 L58 112 M100 64 L100 112', C.ink, 2), rect(66, 40, 26, 18, C.dark, 2, C.ink, 1.2),
    rect(18, 76, 22, 4, C.dark, 1, null), line('M22 80 L22 112 M36 80 L36 112', C.ink, 2),
    fz(30, 111, 0.85, pose({ h: [0, -38], n: [6, -64], aL: [[18, -58], [30, -60]], aR: [[18, -56], [30, -58]], lL: [[18, -38], [20, -1]], lR: [[18, -38], [22, -1]] }), { top: C.grey, leg: C.navy, mouth: 'flat' }),
    clock(100, 18, 10, 300), waGrow('trng-stel', ...[[33, 48], [26, 66]].map(([x, y]) => path(`M${x! - 6} ${y} l3 -4 l3 4 l3 -4 l3 4`, 'none', HL, 2.2)))),
  // vrida (kroppen): sitting cross-legged and turning the upper body to the side (moves), curved arrow
  'trng.vrida.2': all(rect(0, 0, 120, 120, '#eef4f1', 0, null), mat(60, 112, 80), swap('trng-vrida', fz(60, 110, 1.3, SIT_CROSS, { top: C.green, leg: C.navy }), fz(60, 110, 1.3, SIT_TWIST, { top: C.green, leg: C.navy, front: ellipse(0, -52, 7, 3, 'none', C.ink, 0) }), 2.2),
    path('M38 46 C44 34 76 34 82 46', 'none', HL, 2.6), arrow(78, 41, 83, 47, HL, 2.6)),
  // spagat: sitting in a front split on the mat, legs straight forward and back, arms out
  'trng.spagat': all(rect(0, 0, 120, 120, '#f3eef6', 0, null), mat(60, 108, 104),
    fz(60, 106, 1, pose({ h: [0, -4], n: [0, -30], aL: [[-12, -36], [-24, -40]], aR: [[12, -36], [24, -40]], lL: [[-21, -2], [-41, -1]], lR: [[21, -2], [41, -1]] }), { top: C.lilac, leg: C.purple, hs: 'bun' }),
    line('M14 98 L106 98', HL, 2.4, '4 3')),
  // pilates: lying on the mat with head and legs lifted, a soft ring between the hands, arms pumping (moves)
  'trng.pilates': all(rect(0, 0, 120, 120, '#eef3f6', 0, null), mat(60, 106, 96),
    fz(60, 104, 1, pose({ h: [-6, -4], n: [16, -14], aL: [[24, -10], [34, -12]], aR: [[24, -9], [34, -11]], lL: [[-20, -22], [-38, -22]], lR: [[-20, -22], [-38, -22]] }), { top: C.mint, leg: C.navy, hs: 'pony',
      front: waBob('trng-pilates', 3, ellipse(36, -14, 4, 8, 'none', HL, 3)) })),
  // träningsmatta: a rolled mat and an unrolled mat on the floor (things)
  'trng.träningsmatta': all(rect(0, 0, 120, 120, '#f2efe8', 0, null), ground(), path('M14 104 L96 104 L110 92 L28 92 Z', HL, C.ink, 1.6), path('M96 104 L110 92 L110 95 L96 107 Z', '#c94a26', C.ink, 1.2),
    ellipse(30, 66, 10, 10, MAT, C.ink, 1.6), rect(30, 56, 56, 20, MAT, 0, null), line('M30 56 L86 56 M30 76 L86 76', C.ink, 1.6), ellipse(86, 66, 10, 10, MAT, C.ink, 1.6), path('M86 60 A6 6 0 1 1 86 72', 'none', C.ink, 1)),

  // ── 4615 Träningspass och set ──────────────────────────────────────
  // pass (träning): one calendar day with a dumbbell and a clock: a booked training session
  'trng.pass.4': all(rect(0, 0, 120, 120, '#f4f1ea', 0, null), card(14, 18, 92, 84), rect(14, 18, 92, 16, C.red, 3, C.ink, 1.6), ...[30, 52, 74, 96].map((x) => line(`M${x} 14 L${x} 24`, C.ink, 2.4)),
    ...[0, 1, 2, 3].map((i) => rect(22 + i * 20, 42, 14, 12, '#ece7dc', 1, null)), ...[0, 1, 2, 3].map((i) => rect(22 + i * 20, 82, 14, 12, '#ece7dc', 1, null)),
    rect(22, 60, 76, 18, '#fde3d6', 2, HL, 2.2), dumbbell(44, 69, 0.6), clock(78, 69, 7, 180)),
  // träningsprogram: a clipboard with a plan – exercise pictures in rows and the numbers of sets × repetitions
  'trng.träningsprogram': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), rect(26, 10, 68, 102, C.brown, 4, C.ink, 1.6), rect(31, 18, 58, 90, C.white, 2, C.ink, 1.2), rect(48, 6, 24, 9, C.silver, 2, C.ink, 1.2),
    ...[0, 1, 2, 3].map((i) => all(rect(35, 26 + i * 20, 14, 14, '#e9eef3', 2, null), i === 0 ? dumbbell(42, 33 + i * 20, 0.34) : i === 1 ? plate(42, 53, 5) : i === 2 ? kettlebell(42, 75, 0.4) : mat(42, 94, 12), num(70, 37 + i * 20, '3×10', 9))), frame(30, 22, 60, 86)),
  // set (styrketräning): three blocks of ten lifts with a pause between them; the second block is marked
  'trng.set.3': all(gym(), fz(18, 106, 0.6, pose({ aR: [[8, -56], [12, -70]] }), { top: C.green, leg: C.navy, sleeves: false, front: dumbbell(12, -70, 0.5, 90) }),
    ...[0, 1, 2].map((b) => all(...Array.from({ length: 10 }, (_, i) => line(`M${40 + b * 26 + (i % 5) * 4} ${i < 5 ? 40 : 58} l0 12`, C.ink, 1.8)), b < 2 ? clock(62 + b * 26, 84, 5, 90) : '')), frame(63, 34, 24, 40)),
  // repetition (styrketräning): one lift up and down is one repetition – counter 1, 2, 3, the latest one marked (moves)
  'trng.repetition.3': all(gym(), swap('trng-rep', fz(40, 106, 0.95, pose({ aR: [[8, -56], [9, -43]] }), { top: C.denim, leg: C.navy, sleeves: false, front: dumbbell(9, -43, 0.5, 90) }),
    fz(40, 106, 0.95, pose({ aR: [[8, -56], [12, -70]] }), { top: C.denim, leg: C.navy, sleeves: false, front: dumbbell(12, -70, 0.5, 90) }), 1.4),
    path('M60 76 C70 70 70 50 60 44', 'none', HL, 2.4), arrow(62, 46, 59, 43, HL, 2.4), num(86, 34, '1', 14, C.grey), num(86, 58, '2', 14, C.grey), circle(86, 77, 10, 'none', HL, 2.6), num(86, 82, '3', 14, HL)),
  // cirkelträning: stations around a circle (bike, rope, dumbbell, mat, box) with arrows going round
  'trng.cirkelträning': all(hall(), circle(60, 60, 38, 'none', HL, 2.4, ), ...[0, 72, 144, 216, 288].map((a, i) => { const x = f1(60 + Math.sin((a * Math.PI) / 180) * 38), y = f1(60 - Math.cos((a * Math.PI) / 180) * 38);
    return all(circle(x, y, 12, C.white, C.ink, 1.6), i === 0 ? dumbbell(x, y, 0.5) : i === 1 ? kettlebell(x, y + 2, 0.45) : i === 2 ? stepBox(x, y + 4, 16) : i === 3 ? mat(x, y + 2, 16) : all(path(`M${x - 6} ${y + 4} C${x - 6} ${y - 10} ${x + 6} ${y - 10} ${x + 6} ${y + 4}`, 'none', C.brown, 1.6), line(`M${x - 6} ${y + 4} l0 3 M${x + 6} ${y + 4} l0 3`, C.ink, 2.4))); }),
    ...[36, 108, 180, 252, 324].map((a) => { const x = f1(60 + Math.sin((a * Math.PI) / 180) * 38), y = f1(60 - Math.cos((a * Math.PI) / 180) * 38), x2 = f1(60 + Math.sin(((a + 10) * Math.PI) / 180) * 38), y2 = f1(60 - Math.cos(((a + 10) * Math.PI) / 180) * 38); return arrow(x, y, x2, y2, HL, 2.4); }),
    fz(60, 82, 0.4, pose({ ...ARMS_UP }), { top: C.orange, leg: C.navy })),
  // instruktör: one person in front with a headset shows the movement; a grey group copies it
  'trng.instruktör': all(hall(), ...[18, 42, 66].map((x) => greyed(fz(x, 112, 0.5, pose({ aL: [[-12, -66], [-22, -64]], aR: [[12, -66], [22, -64]] }), {}))),
    fz(94, 96, 0.8, pose({ aL: [[-12, -66], [-22, -64]], aR: [[12, -66], [22, -64]] }), { top: HL, leg: C.dark, hs: 'pony', mouth: 'open', front: all(path('M-9 -76 C-9 -88 9 -88 9 -76', 'none', C.dark, 1.6), line('M-9 -76 C-9 -71 -6 -70 -2 -70', C.dark, 1.4)) }), stepBox(94, 104, 30)),
  // personlig tränare: one trainer with a clipboard right next to one person lifting – one to one
  'trng.personlig-tränare': all(gym(), bench(42, 110, 40, 20), fz(42, 110, 0.85, pose({ h: [-12, -24], n: [12, -24], aL: [[11, -36], [10, -48]], aR: [[12, -36], [11, -48]], lL: [[-28, -22], [-31, -1]], lR: [[-27, -22], [-29, -1]] }), { top: C.navy, leg: C.dark, sleeves: false }), plate(51, 69, 8),
    fz(90, 110, 0.95, pose({ aL: [[-8, -56], [-14, -48]], aR: [[8, -56], [10, -46]] }), { top: HL, leg: C.dark, hs: 'short', front: rect(6, -54, 10, 13, C.brown, 1, C.ink, 1) }), ring(90, 30, 12)),

  // ── 4616 Återhämtning ──────────────────────────────────────────────
  // vila: sitting on a bench with a towel and water after the effort, breathing calmly; the battery fills (moves)
  'trng.vila.1': all(gym(), bench(54, 112, 50, 22), fz(52, 112, 0.95, pose({ h: [0, -26], n: [-2, -52], aL: [[-10, -40], [-6, -28]], aR: [[10, -40], [8, -28]], lL: [[12, -24], [14, -1]], lR: [[12, -24], [16, -1]] }), { top: C.sky, leg: C.navy, mouth: 'flat', front: path('M-9 -54 C-6 -48 -4 -44 -5 -36 L-1 -36 C0 -44 0 -50 -2 -54 Z M9 -54 C6 -48 4 -44 5 -36 L1 -36 C0 -44 0 -50 2 -54 Z', C.mint, C.ink, 1) }),
    bottle(86, 90, 1.1), battery(94, 22, 0.4, C.yellow), waGrow('trng-vila', battery(94, 22, 1))),
  // aktiv vila: a rest day with a calm walk – the calendar day shows a crossed-out dumbbell, the walker is relaxed
  'trng.aktiv-vila': all(outdoor(), tree(102, 92, 1.1), card(8, 10, 34, 34), rect(8, 10, 34, 9, C.green, 3, C.ink, 1.4), dumbbell(25, 30, 0.6, 0, C.grey), line('M15 23 L35 39', C.red, 2.6),
    fz(64, 108, 0.9, WALK_A, { top: C.mint, leg: C.navy }), ring(64, 70, 34)),
  // lyssna på kroppen: hand to the ear, signals coming from the knee and the heart (they pulse)
  'trng.lyssna-på-kroppen': all(rect(0, 0, 120, 120, '#f2eef6', 0, null), ground(),
    fz(56, 111, 1.05, pose({ aR: [[12, -76], [8, -86]] }), { top: C.lilac, leg: C.navy }), path('M70 10 C76 14 76 22 70 26 M76 6 C84 12 84 24 76 30', 'none', HL, 2),
    waPulse('trng-lyssna', path('M68 86 C76 82 78 76 74 70 M74 92 C84 86 86 74 80 66', 'none', HL, 2.2), path('M66 52 C74 48 76 42 72 36', 'none', HL, 2.2)), circle(60, 89, 5, 'none', HL, 2), heart(60, 48, 0.4)),

  // ── 4617 Träningsmål och progression ───────────────────────────────
  // träningsmål: a target with a dumbbell in the middle and an arrow in the centre
  'trng.träningsmål': all(rect(0, 0, 120, 120, '#f3f0ea', 0, null), circle(56, 60, 40, C.white, C.ink, 1.6), circle(56, 60, 30, '#f6c9b8', C.ink, 1.2), circle(56, 60, 20, C.white, C.ink, 1.2), circle(56, 60, 10, HL, C.ink, 1.2),
    dumbbell(56, 60, 0.42), line('M60 56 L104 18', C.brown, 3), path('M104 18 L110 10 M104 18 L112 16', 'none', C.red, 2.4)),
  // förbättra: before (grey) a light dumbbell, after (orange) a heavier one, arrow upward between them (moves)
  'trng.förbättra.1': all(rect(0, 0, 120, 120, '#eef3ee', 0, null), ground(), greyed(fz(28, 111, 0.8, pose({ aR: [[8, -56], [12, -70]] }), { front: dumbbell(12, -70, 0.35, 90) })),
    fz(88, 111, 0.9, pose({ aR: [[8, -56], [12, -70]], aL: [[-8, -56], [-12, -70]] }), { top: HL, leg: C.navy, sleeves: false, front: all(dumbbell(12, -70, 0.6, 90), dumbbell(-12, -70, 0.6, 90)) }),
    waIn('trng-forb', -10, 10, arrow(46, 70, 66, 44, C.green, 3.4))),
  // personbästa: a list of one's own results – the new best one is marked with a star; the person cheers
  'trng.personbästa': all(rect(0, 0, 120, 120, '#f4f1ea', 0, null), ground(), card(8, 14, 54, 74), ...[0, 1, 2].map((i) => all(rect(14, 22 + i * 14, 42, 9, '#ece7dc', 1, null), num(35, 29.5 + i * 14, ['50', '55', '55'][i]!, 8, C.grey))),
    rect(12, 66, 46, 14, '#fde3d6', 2, HL, 2.2), num(35, 77, '60', 11, HL), star(56, 64, 7), sparkle(100, 20, 5),
    fz(92, 111, 0.85, pose({ ...ARMS_UP }), { top: C.red, leg: C.navy, mouth: 'open' })),
  // logga (skriva upp): finishing a session and adding it to the list in the phone – a new tick appears (moves)
  'trng.logga.2': all(rect(0, 0, 120, 120, '#eef1f5', 0, null), phone(62, 62, 1.6, all(...[0, 1, 2].map((i) => all(rect(-9, -15 + i * 9, 12, 6, '#d7e2ea', 1, null), check(6, -12 + i * 9, 0.3))),
    waIn('trng-logga', 14, 0, rect(-9, 12, 12, 6, '#fde3d6', 1, HL, 1), check(6, 15, 0.3, HL)))), dumbbell(20, 104, 0.6)),
};

/** A faint floor shadow under a lifted thing. */
function shadowLine(): Svg { return ellipse(60, 108, 46, 3, 'rgba(0,0,0,0.12)', null); }
