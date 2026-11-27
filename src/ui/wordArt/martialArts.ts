/**
 * Kultur & fritid → Sport & träning → Kampsporter, 4641–4647 (0.64): judo, wrestling and grips, boxing, karate,
 * taekwondo, Brazilian jiu-jitsu, competition and decisions.
 * Fighters are drawn with a posable figure (`fz`, the same joint-chain idea as the dancer in dance.ts): every limb is
 * hip–knee–foot or shoulder–elbow–hand with fixed segment lengths (thigh/shin ≈ 20, upper arm/forearm ≈ 13), so
 * stances, kicks, throws and holds stay anatomically plausible. Judo and karate wear white gi (judo partner in blue),
 * wrestlers singlets, boxers red or blue gloves, taekwondo fighters vests and head guards.
 * Recurring signs: the part the word names is orange (ring, outline or arrow); grey figures and things are the
 * reference; a green tick means allowed and a red cross not allowed. Actions are two-frame flips (`flip`): the start
 * pose is shown first and the end pose (the poster frame, what quizzes show) last, so the poster is always the
 * informative moment. The start pose is drawn off the canvas in the base state, so the poster never shows both.
 * Words that are easy to mix up get different kinds of picture: the sport (two fighters in its setting, often with a
 * referee) against the verb (people doing it, moving) against the person (one portrait), the object alone (glove,
 * mouthguard, vest, head guard, mat) against the action; the punches by the path of the fist (straight, curved from the
 * side, from below), the kicks by the path of the leg (knee lifted then straight forward, a curve from the side,
 * sideways with the heel first). No letters, no brands, digits only on scales and score cards.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, star, waBob, waIn, waPulse, waShake, waSway, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, C.green, C.ink, 1.4), line('M-4 0 L-1 3.5 L4.5 -3.5', C.white, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, C.red, C.ink, 1.4), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', C.white, 2.4));
/** Rock a part about canvas point (cx, cy) by deg; base state = no rotation. */
const rotAbout = (name: string, cx: number, cy: number, deg: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:rotate(0)}50%{transform:translate(${cx}px,${cy}px) rotate(${deg}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);
/** Two-frame action: `start` shows during the first part of the loop, `end` (= the poster frame) during the rest. */
const flip = (name: string, start: Svg, end: Svg, dur = 2.8): Svg => all(
  moving(`${name}-a`, '0%,38%{transform:translate(-300px,0);opacity:1}42%,100%{transform:translate(-300px,0);opacity:0}', { dur }, g('translate(300 0)', start)),
  moving(`${name}-b`, '0%,38%{opacity:0}42%,100%{opacity:1}', { dur }, end));

// ── The posable fighter ──────────────────────────────────────────────
/** h hip, n neck, a* shoulder→(elbow, hand), l* hip→(knee, foot); local units, feet near y = 0, height ≈ 86. */
export type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = {
  top?: string; leg?: string; legLow?: string; armLow?: string; skin?: string; hair?: string; grey?: boolean; belt?: string; gi?: boolean;
  gloves?: string; head?: string; vest?: string; bare?: boolean; armsBare?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'o' | 'frown'; hs?: 'short' | 'long' | 'bun' | 'top';
  noArm?: 'L' | 'R' | 'both'; noLeg?: 'L' | 'R'; barefoot?: boolean; shoe?: string; eyes?: 'x' | 'closed';
};
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
function colours(o: Look) {
  const grey = o.grey ?? false;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin);
  const top = grey ? C.grey : (o.top ?? C.sky), leg = grey ? C.grey : (o.leg ?? C.navy);
  return { grey, skin, top, leg, legLow: grey ? (o.legLow ? C.grey2 : leg) : (o.legLow ?? leg), armLow: grey ? (o.armLow ? C.grey2 : top) : (o.armLow ?? top),
    hair: grey ? C.grey : (o.hair ?? C.hair), foot: grey ? C.grey2 : o.barefoot === false ? (o.shoe ?? C.black) : skin,
    gloves: o.gloves ? (grey ? C.grey : o.gloves) : undefined, belt: o.belt ? (grey ? C.dark : o.belt) : undefined };
}
const seg = (a: Pt, b: Pt, col: string, w: number) => { const d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`; return all(line(d, C.ink, w + 2.4), line(d, col, w)); };
function legOf(p: Pose, side: 'L' | 'R', o: Look): Svg {
  const c = colours(o), j = side === 'L' ? p.lL : p.lR;
  return all(seg(p.h, j[0], c.leg, 5.4), seg(j[0], j[1], c.legLow, 5), circle(j[0][0], j[0][1], 2.6, c.legLow === c.leg ? c.leg : c.legLow, null), ellipse(j[1][0], j[1][1], 3.4, 2.6, c.foot, C.ink, 1));
}
function armOf(p: Pose, side: 'L' | 'R', o: Look): Svg {
  const c = colours(o), j = side === 'L' ? p.aL : p.aR;
  const sleeve = o.bare || o.armsBare ? c.skin : c.top, low = o.bare || o.armsBare ? c.skin : c.armLow;
  const hand = c.gloves ? circle(j[1][0], j[1][1], 4.6, c.gloves, C.ink, 1.3) : circle(j[1][0], j[1][1], 2.8, c.skin, C.ink, 1);
  return all(seg(p.n, j[0], sleeve, 4.6), seg(j[0], j[1], low, 4.2), hand);
}
function bodyOf(p: Pose, o: Look): Svg {
  const c = colours(o);
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const waist: Pt = [f1(p.h[0] + ux * 4), f1(p.h[1] + uy * 4)];
  const gi = o.gi ? line(`M${f1(p.n[0] - uy * 3)} ${f1(p.n[1] + ux * 3)} L${f1(p.h[0] + ux * 8 + uy * 3)} ${f1(p.h[1] + uy * 8 - ux * 3)}`, c.grey ? C.grey2 : 'rgba(0,0,0,0.28)', 1.6) : '';
  const vest = o.vest ? g(`translate(${f1(p.h[0] + ux * 15)} ${f1(p.h[1] + uy * 15)}) rotate(${ang})`, rect(-8.4, -10, 16.8, 18, c.grey ? C.grey2 : o.vest, 4, C.ink, 1.4), line('M-5 -6 L5 -6', C.white, 1.4)) : '';
  const belt = c.belt ? g(`translate(${waist[0]} ${waist[1]}) rotate(${ang})`, rect(-7.6, -1.8, 15.2, 3.6, c.belt, 1, C.ink, 0.9), path('M1 1.6 L-1 7 M2 1.6 L4 6.6', 'none', c.belt, 2.2)) : '';
  const hs = o.hs ?? 'short';
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`,
    hs === 'bun' ? all(circle(0, -10.5, 3.8, c.hair, C.ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', c.hair, C.ink, 1.2))
      : hs === 'top' ? all(ellipse(0, -10, 4.4, 2.6, c.hair, C.ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', c.hair, C.ink, 1.2))
        : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', c.hair, C.ink, 1.2));
  const hairBack = hs === 'long' ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', c.hair, C.ink, 1.2)) : '';
  const guard = o.head ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, path('M-9.6 3 C-11 -14 11 -14 9.6 3 L7 3 C7 -6 -7 -6 -7 3 Z', c.grey ? C.grey : o.head, C.ink, 1.3), rect(-10, -1, 4, 8, c.grey ? C.grey : o.head, 2, C.ink, 1), rect(6, -1, 4, 8, c.grey ? C.grey : o.head, 2, C.ink, 1)) : '';
  const m = o.mouth ?? 'smile', ink = C.ink;
  const eyes = o.eyes === 'x' ? all(line('M-4 -0.6 L-1.6 1.6 M-1.6 -0.6 L-4 1.6 M1.6 -0.6 L4 1.6 M4 -0.6 L1.6 1.6', ink, 0.9)) : o.eyes === 'closed' ? line('M-4 0.6 L-1.6 0.6 M1.6 0.6 L4 0.6', ink, 1) : all(circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null));
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, eyes,
    m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.2, 1.2, '#c84a4a', ink, 0.8)
      : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'frown' ? path('M-2.4 5 Q0 2.6 2.4 5', 'none', ink, 1) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  return all(hairBack, line(torso, ink, 14.6), line(torso, o.bare ? c.skin : c.top, 12.2), gi, vest, belt, circle(head[0], head[1], 8, c.skin, ink, 1.6), hairTop, face, guard);
}
/** Fighter with feet near (x, y). The far limbs (L) are drawn first. */
function fz(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  return at(x, y, s,
    o.noLeg === 'L' ? '' : legOf(p, 'L', o), o.noArm === 'L' || o.noArm === 'both' ? '' : armOf(p, 'L', o),
    o.noLeg === 'R' ? '' : legOf(p, 'R', o), bodyOf(p, o), o.noArm === 'R' || o.noArm === 'both' ? '' : armOf(p, 'R', o));
}
/** One limb alone, placed like fz (for limbs that move on their own). */
const leg1 = (x: number, y: number, s: number, p: Pose, side: 'L' | 'R', o: Look = {}) => at(x, y, s, legOf(p, side, o));
const arm1 = (x: number, y: number, s: number, p: Pose, side: 'L' | 'R', o: Look = {}) => at(x, y, s, armOf(p, side, o));

// ── Looks ─────────────────────────────────────────────────────────────
const GI_BLUE = '#3a62b0';
const GI = (belt: string = C.black): Look => ({ top: C.white, leg: C.white, gi: true, belt, barefoot: true });
const GIB = (belt: string = C.black): Look => ({ top: GI_BLUE, leg: GI_BLUE, gi: true, belt, barefoot: true });
const SINGLET = (col: string): Look => ({ top: col, leg: col, legLow: C.skin, armsBare: true, barefoot: false, shoe: col });
const BOXER = (col: string, gloves: string = col): Look => ({ top: col, leg: col, legLow: C.skin, armsBare: true, gloves, barefoot: false, shoe: C.black });
const TKD = (vest: string, head: string = vest): Look => ({ top: C.white, leg: C.white, gi: true, belt: C.black, vest, head, barefoot: true });

// ── Poses (facing right = towards +x unless the name says L) ───────────
const P = {
  // standing grip (judo): arms forward to the partner's collar and sleeve
  gripR: pose({ h: [0, -42], n: [3, -67], aL: [[12, -60], [22, -60]], aR: [[13, -56], [23, -52]], lL: [[-3, -21], [-6, -1]], lR: [[6, -21], [8, -1]] }),
  // boxing guard: lead (R) fist in front of the face, rear fist at the chin
  guard: pose({ h: [0, -40], n: [3, -66], aL: [[8, -55], [12, -65]], aR: [[13, -58], [17, -67]], lL: [[-6, -21], [-11, -1]], lR: [[8, -21], [11, -1]] }),
  jab: pose({ h: [0, -40], n: [5, -66], aL: [[8, -55], [12, -65]], aR: [[18, -66], [31, -67]], lL: [[-6, -21], [-11, -1]], lR: [[8, -21], [12, -1]] }),
  hook: pose({ h: [0, -40], n: [5, -66], aL: [[8, -55], [12, -65]], aR: [[15, -71], [24, -63]], lL: [[-6, -21], [-11, -1]], lR: [[8, -21], [12, -1]] }),
  upper: pose({ h: [0, -38], n: [5, -64], aR: [[13, -57], [17, -67]], aL: [[13, -50], [22, -60]], lL: [[-7, -20], [-11, -1]], lR: [[8, -20], [12, -1]] }),
  uppLow: pose({ h: [0, -36], n: [3, -62], aR: [[13, -56], [17, -65]], aL: [[6, -49], [14, -42]], lL: [[-7, -19], [-11, -1]], lR: [[8, -19], [12, -1]] }),
  duck: pose({ h: [-2, -26], n: [14, -44], aL: [[18, -36], [24, -44]], aR: [[22, -36], [28, -44]], lL: [[-8, -12], [-14, -1]], lR: [[14, -12], [12, -1]] }),
  // front kick: knee lifted (chamber) and leg straight
  chamber: pose({ h: [0, -42], n: [-3, -68], aL: [[5, -57], [10, -66]], aR: [[9, -56], [14, -64]], lL: [[-2, -21], [-3, -1]], lR: [[15, -55], [16, -36]] }),
  frontKick: pose({ h: [0, -42], n: [-6, -67], aL: [[2, -57], [8, -66]], aR: [[6, -56], [12, -63]], lL: [[-2, -21], [-3, -1]], lR: [[19, -47], [38, -50]] }),
  // round kick: body turned, leg horizontal at chest height
  roundKick: pose({ h: [0, -44], n: [-12, -66], aL: [[-8, -54], [-2, -60]], aR: [[-18, -56], [-24, -48]], lL: [[-1, -23], [-2, -1]], lR: [[18, -52], [37, -58]] }),
  // side kick: torso tilted away, heel first, foot flat (horizontal)
  sideKick: pose({ h: [0, -44], n: [-20, -60], aL: [[-12, -52], [-6, -58]], aR: [[-27, -52], [-33, -46]], lL: [[-2, -23], [-2, -1]], lR: [[20, -45], [40, -46]] }),
  // karate front stance punch (zenkutsu-dachi)
  punch: pose({ h: [0, -36], n: [2, -62], aL: [[-8, -50], [-5, -42]], aR: [[15, -61], [28, -62]], lL: [[-12, -20], [-26, -1]], lR: [[14, -20], [16, -1]] }),
  // horse stance (kiba-dachi), seen from the front
  horse: pose({ h: [0, -32], n: [0, -58], aL: [[-9, -46], [-4, -40]], aR: [[9, -46], [4, -40]], lL: [[-17, -20], [-19, -1]], lR: [[17, -20], [19, -1]] }),
  bowUp: pose({ h: [0, -42], n: [0, -68], aL: [[-3, -56], [-3, -43]], aR: [[3, -56], [3, -43]], lL: [[-2, -21], [-2, -1]], lR: [[2, -21], [2, -1]] }),
  bowDown: pose({ h: [0, -42], n: [12, -65], aL: [[9, -53], [5, -42]], aR: [[11, -53], [7, -42]], lL: [[-2, -21], [-2, -1]], lR: [[2, -21], [2, -1]] }),
  // inside block: forearm across in front of the face
  block: pose({ h: [0, -38], n: [3, -64], aR: [[14, -60], [14, -73]], aL: [[-5, -50], [-4, -42]], lL: [[-10, -20], [-20, -1]], lR: [[12, -20], [14, -1]] }),
};

// ── Settings ──────────────────────────────────────────────────────────
const WALL = '#efe6d6', TATAMI = '#b9cf7e', TATAMI2 = '#a6bf6a', COMP = '#3f6fb5', COMP2 = '#f2c14e';
const dojo = (wood = false) => all(rect(0, 0, 120, 120, WALL, 0, null), wood ? all(rect(0, 0, 120, 92, '#e3cfa8', 0, null), ...[20, 40, 60, 80, 100].map((x) => line(`M${x} 0 L${x} 92`, '#cdb68a', 1.4))) : '',
  rect(0, 92, 120, 28, TATAMI, 0, null), line('M0 92 L120 92', C.ink, 1.4), line('M40 92 L34 120 M80 92 L86 120 M2 104 L118 104', TATAMI2, 1.4));
const compMat = () => all(rect(0, 0, 120, 120, '#e9eef3', 0, null), rect(0, 90, 120, 30, COMP2, 0, null), path('M10 90 L110 90 L118 120 L2 120 Z', COMP, null), line('M0 90 L120 90', C.ink, 1.4));
const gym = () => all(rect(0, 0, 120, 120, '#e8e4dc', 0, null), rect(0, 96, 120, 24, '#9a9389', 0, null), line('M0 96 L120 96', C.ink, 1.4));
const wrestleMat = () => all(rect(0, 0, 120, 120, '#e9eef3', 0, null), rect(0, 88, 120, 32, '#3f6fb5', 0, null), ellipse(60, 104, 54, 11, '#e4572e', null), ellipse(60, 104, 46, 8.6, '#f2c14e', null), ellipse(60, 104, 40, 7, '#3f6fb5', null), line('M0 88 L120 88', C.ink, 1.4));
const grass = () => all(rect(0, 0, 120, 120, '#dff0fa', 0, null), rect(0, 94, 120, 26, '#a8d08a', 0, null), line('M0 94 L120 94', C.ink, 1.2), circle(100, 20, 8, C.yellow, C.ink, 1.2));
/** Boxing ring seen from the side: posts, three ropes, canvas. */
const boxRing = (dark = false) => all(rect(0, 0, 120, 120, dark ? '#2d2a3e' : '#e9eef3', 0, null), path('M0 96 L120 96 L120 106 L0 106 Z', '#3f6fb5', C.ink, 1.4), rect(0, 106, 120, 14, '#2e3a5c', 0, null),
  rect(6, 36, 6, 62, C.red, 1, C.ink, 1.2), rect(108, 36, 6, 62, '#3f6fb5', 1, C.ink, 1.2), ...[46, 60, 74].map((y) => line(`M9 ${y} L111 ${y}`, C.white, 2.2)), ...[46, 60, 74].map((y) => line(`M9 ${y} L111 ${y}`, 'rgba(0,0,0,0.25)', 0.6)));
const ringFront = (y: number) => all(...[y, y + 10].map((yy) => line(`M2 ${yy} L118 ${yy}`, C.white, 2.2)));

// ── Objects ───────────────────────────────────────────────────────────
const glove = (x: number, y: number, s = 1, col: string = C.red, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M-14 -2 C-16 -18 -6 -24 6 -22 C18 -20 20 -6 16 6 C14 12 8 14 2 14 L-10 14 C-14 10 -14 4 -14 -2 Z', col, C.ink, 1.8),
  path('M-14 -2 C-20 -4 -22 4 -16 8 C-12 10 -8 8 -8 4', col, C.ink, 1.6), rect(-12, 14, 16, 10, C.white, 2, C.ink, 1.6), line('M-12 19 L4 19', C.grey2, 1.2), path('M-4 -18 C2 -16 8 -14 12 -8', 'none', 'rgba(255,255,255,0.45)', 2.4));
const bell = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -16, 4, 6, C.dark, 1, C.ink, 1), path('M-14 6 C-14 -10 14 -10 14 6 Z', C.gold, C.ink, 1.6), rect(-16, 5, 32, 4, C.dark, 1.5, C.ink, 1.2), circle(0, 12, 3, C.dark, C.ink, 1));
const scale = (x: number, y: number, digits: string, s = 1) => at(x, y, s, rect(-16, -6, 32, 8, C.white, 3, C.ink, 1.6), rect(-7, -5, 14, 5, '#1f2a36', 1, null), num(0, -1, digits, 4.6, '#7cf2a8'));
const mat3d = (x: number, y: number, w: number, col: string = TATAMI) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w + 8} ${y + 10} L${x + 8} ${y + 10} Z`, col, C.ink, 1.6), path(`M${x + 8} ${y + 10} L${x + w + 8} ${y + 10} L${x + w + 8} ${y + 18} L${x + 8} ${y + 18} Z`, TATAMI2, C.ink, 1.6), path(`M${x} ${y} L${x + 8} ${y + 10} L${x + 8} ${y + 18} L${x} ${y + 8} Z`, TATAMI2, C.ink, 1.6));
const beltStrip = (x: number, y: number, col: string, w = 26) => all(rect(x, y, w, 5, col, 1.5, C.ink, 1.1), line(`M${x + 3} ${y + 2.5} L${x + w - 3} ${y + 2.5}`, 'rgba(0,0,0,0.15)', 0.8));
const scoreCard = (x: number, y: number, n: string, col: string = C.white, s = 1) => at(x, y, s, rect(-8, -10, 16, 13, col, 1.5, C.ink, 1.2), num(0, 0, n, 9));
const table = (x: number, y: number, w: number) => all(rect(x, y, w, 5, C.brown, 1, C.ink, 1.4), line(`M${x + 4} ${y + 5} L${x + 4} ${y + 18} M${x + w - 4} ${y + 5} L${x + w - 4} ${y + 18}`, C.ink, 2));
const impact = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M0 -10 L3 -3 L10 -4 L5 1 L9 8 L1 4 L-4 10 L-3 3 L-10 1 L-3 -2 Z', col, C.ink, 1.2));
const motion = (d: string, col = 'rgba(43,42,51,0.45)') => line(d, col, 1.6);
const stopwatch = (x: number, y: number, s = 1, frac = 0.25) => {
  const a = -Math.PI / 2 + frac * Math.PI * 2, ex = f1(Math.cos(a) * 8), ey = f1(Math.sin(a) * 8);
  return at(x, y, s, rect(-2, -14, 4, 4, C.dark, 1, null), circle(0, 0, 10, C.white, C.ink, 1.6), path(`M0 0 L0 -8 A8 8 0 ${frac > 0.5 ? 1 : 0} 1 ${ex} ${ey} Z`, 'rgba(228,87,46,0.35)', null), line(`M0 0 L${ex} ${ey}`, C.ink, 1.4));
};
// referee shirts
const REF_JUDO: Look = { top: C.dark, leg: C.dark, barefoot: false, shoe: C.black, mouth: 'flat' };
const REF_BOX: Look = { top: C.white, leg: C.black, barefoot: false, shoe: C.black, mouth: 'flat' };
const REF_WR: Look = { top: C.white, leg: C.white, barefoot: false, shoe: C.black, mouth: 'flat' };

// lying figures: torso horizontal on the mat (y local ≈ -7)
const lieBack = (dir: 1 | -1 = 1): Pose => ({ h: [0, -7], n: [dir * 26, -8], aL: [[dir * 22, -18], [dir * 16, -26]], aR: [[dir * 28, -2], [dir * 18, -1]], lL: [[dir * -16, -18], [dir * -30, -4]], lR: [[dir * -19, -4], [dir * -38, -3]] });

// ── Motifs ────────────────────────────────────────────────────────────
export const MARTIAL_MOTIFS: Record<string, Svg> = {
  // ═══ 4641 Judons tekniker ═══
  // three martial arts side by side: judo grip, boxing guard, a karate punch
  'martial.kampsport': all(rect(0, 0, 120, 120, WALL, 0, null), rect(0, 96, 120, 24, TATAMI, 0, null), line('M0 96 L120 96', C.ink, 1.4), line('M40 6 L40 96 M80 6 L80 96', C.grey2, 1.4, '3 3'),
    fz(12, 108, 0.62, P.gripR, GI(C.black)), fz(30, 108, 0.62, { ...P.gripR, n: [-3, -67], aL: [[-12, -60], [-22, -60]], aR: [[-13, -56], [-23, -52]], lL: [[3, -21], [6, -1]], lR: [[-6, -21], [-8, -1]] }, GIB(C.black)),
    fz(56, 108, 0.66, P.guard, BOXER(C.red)), fz(92, 108, 0.66, P.punch, GI(C.orange))),
  // two judoka gripping each other on the tatami, belts tied
  'martial.judo': all(dojo(true), fz(42, 108, 0.95, P.gripR, GI(C.black)),
    fz(80, 108, 0.95, { h: [0, -42], n: [-3, -67], aL: [[-12, -60], [-22, -60]], aR: [[-13, -56], [-23, -52]], lL: [[3, -21], [6, -1]], lR: [[-6, -21], [-8, -1]] }, GIB(C.black))),
  // a thick training mat (its thickness shows), shoes left beside it
  'martial.matta.2': all(rect(0, 0, 120, 120, WALL, 0, null), rect(0, 96, 120, 24, '#cdb68a', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    mat3d(18, 62, 76), path('M18 62 L94 62 L102 72 L102 80 L26 80 L18 70 Z', 'none', HL, 2.6),
    path('M10 104 C8 98 14 96 20 98 L28 100 L28 106 L10 106 Z', C.dark, C.ink, 1.2), path('M30 106 C28 100 34 98 40 100 L48 102 L48 108 L30 108 Z', C.dark, C.ink, 1.2),
    arrow(82, 40, 72, 58, HL)),
  // the judo gi on its own: wrap jacket with thick lapels, trousers, belt
  'martial.judodräkt': all(rect(0, 0, 120, 120, WALL, 0, null),
    path('M28 22 L48 18 L60 30 L72 18 L92 22 L112 46 L100 58 L90 48 L90 98 L30 98 L30 48 L20 58 L8 46 Z', C.white, C.ink, 2),
    path('M48 18 L60 30 L72 18 L76 22 L58 58 L54 54 L66 26 L60 32 L52 22 Z', '#e3e3de', C.ink, 1.4), path('M52 22 L60 32 L64 98 L58 98 L56 58 Z', 'none', C.ink, 1.2),
    line('M30 60 L90 60', C.ink, 0.8, '2 2'), rect(28, 62, 64, 6, C.black, 2, C.ink, 1.2), path('M58 68 L52 84 M62 68 L68 84', 'none', C.black, 4), path('M58 68 L52 84 M62 68 L68 84', 'none', C.ink, 0.6)),
  // the knotted belt close up; small belts of other colours as reference
  'martial.bälte.2': all(rect(0, 0, 120, 120, WALL, 0, null),
    path('M8 40 L112 40 L112 56 L8 56 Z', C.white, C.ink, 1.6), rect(8, 44, 104, 8, C.yellow, 1, C.ink, 1.4),
    path('M50 38 L70 38 L72 58 L48 58 Z', C.yellow, C.ink, 1.6), path('M54 58 L40 92 L50 94 L60 60 Z M66 58 L80 92 L70 94 L60 60 Z', C.yellow, C.ink, 1.6), ring(60, 56, 28),
    greyed(beltStrip(10, 102, C.white), beltStrip(46, 102, C.orange), beltStrip(82, 102, C.black))),
  // breakfall: start crouched, end on the back with both arms slapping the mat
  'martial.fallteknik': all(dojo(),
    flip('mfall', fz(60, 104, 0.95, pose({ h: [0, -26], n: [6, -50], aL: [[14, -42], [20, -48]], aR: [[16, -40], [22, -46]], lL: [[10, -14], [8, -1]], lR: [[12, -14], [14, -1]] }), GI(C.white)),
      all(fz(56, 104, 0.95, { h: [0, -8], n: [-24, -16], aL: [[-30, -6], [-40, -1]], aR: [[-16, -2], [-8, 0]], lL: [[12, -24], [26, -34]], lR: [[16, -20], [30, -24]] }, { ...GI(C.white), mouth: 'flat' }),
        motion('M14 96 l-4 -4 M18 94 l-2 -5 M22 94 l0 -5'), ring(17, 103, 9))),
    arrow(86, 52, 70, 82, HL)),
  // throw: start in grip, end with the partner landed on his back; the arc of the flight is dashed
  'martial.kast.3': all(dojo(),
    flip('mkast', all(fz(46, 106, 0.9, P.gripR, GI()), fz(80, 106, 0.9, { h: [0, -42], n: [-3, -67], aL: [[-12, -60], [-22, -60]], aR: [[-13, -56], [-23, -52]], lL: [[3, -21], [6, -1]], lR: [[-6, -21], [-8, -1]] }, GIB())),
      all(fz(30, 106, 0.92, pose({ h: [0, -42], n: [3, -67], aL: [[12, -64], [20, -72]], aR: [[12, -58], [22, -60]], lL: [[-5, -21], [-9, -1]], lR: [[6, -21], [9, -1]] }), GI()),
        fz(70, 64, 0.85, { h: [0, -10], n: [24, -14], aL: [[30, -26], [36, -34]], aR: [[28, -2], [34, 6]], lL: [[-14, -24], [-26, -36]], lR: [[-18, -14], [-34, -20]] }, { ...GIB(), mouth: 'o' }),
        line('M84 92 L104 100', C.grey2, 1.6, '3 3'))),
    path('M36 40 C50 6 84 2 104 92', 'none', HL, 2.4, ), path('M104 92 L97 84 L107 84 Z', HL, HL, 1)),
  // hip throw: the partner rolls over the thrower's hip (ringed)
  'martial.höftkast': all(dojo(),
    flip('mhoft', all(fz(46, 106, 0.9, P.gripR, GI()), fz(80, 106, 0.9, { h: [0, -42], n: [-3, -67], aL: [[-12, -60], [-22, -60]], aR: [[-13, -56], [-23, -52]], lL: [[3, -21], [6, -1]], lR: [[-6, -21], [-8, -1]] }, GIB())),
      all(fz(56, 106, 0.95, pose({ h: [6, -36], n: [-10, -60], aL: [[-18, -52], [-26, -44]], aR: [[-16, -48], [-24, -38]], lL: [[-4, -18], [-8, -1]], lR: [[10, -18], [6, -1]] }), GI()),
        fz(56, 106, 0.95, { h: [16, -48], n: [-10, -68], aL: [[-20, -60], [-26, -50]], aR: [[-16, -74], [-26, -78]], lL: [[30, -60], [42, -74]], lR: [[32, -52], [46, -58]] }, { ...GIB(), mouth: 'o' }),
        ring(64, 70, 10))),
    path('M100 44 C92 18 58 12 34 30', 'none', HL, 2.4), path('M34 30 L37 21 L43 30 Z', HL, HL, 1)),
  // hold-down: partner on his back, the holder across him; the trapped legs kick in vain; a stopwatch runs
  'martial.fasthållning': all(dojo(),
    fz(64, 106, 0.95, lieBack(1), { ...GIB(), mouth: 'frown', noLeg: 'R' }),
    waShake('mfast-leg', leg1(64, 106, 0.95, lieBack(1), 'R', GIB())),
    fz(64, 106, 0.92, { h: [8, -10], n: [20, -34], aL: [[28, -24], [32, -12]], aR: [[12, -24], [6, -16]], lL: [[-6, -14], [-20, -3]], lR: [[-2, -4], [-16, -1]] }, GI()),
    ring(84, 82, 18), stopwatch(98, 24, 1, 0.6), waPulse('mfast-sw', path('M98 14 L98 10', 'none', HL, 2))),
  // arm lock: partner on his back, his arm straight across the holder's chest; elbow ringed; his free hand taps
  'martial.armlås': all(dojo(), g('translate(-4 -44) scale(1.4)',
    fz(50, 106, 1, { h: [0, -8], n: [-28, -8], aL: [[-34, -2], [-42, 0]], aR: [[-14, -14], [0, -20]], lL: [[10, -22], [22, -6]], lR: [[12, -12], [26, -3]] }, { ...GIB(), mouth: 'frown', noArm: 'L' }),
    waShake('mlas-tap', arm1(50, 106, 1, { h: [0, -8], n: [-28, -8], aL: [[-34, -2], [-42, 0]], aR: [[-14, -14], [0, -20]], lL: [[10, -22], [22, -6]], lR: [[12, -12], [26, -3]] }, 'L', GIB()), motion('M4 100 l-1 -5 M10 98 l0 -5')),
    fz(60, 106, 1, { h: [-22, -8], n: [4, -9], aL: [[-2, -20], [-10, -22]], aR: [[0, -16], [-8, -20]], lL: [[-34, -22], [-46, -12]], lR: [[-36, -6], [-50, -3]] }, GI()),
    line('M22 98 L50 86', 'rgba(228,87,46,0.45)', 9), ring(36, 92, 7), arrow(36, 70, 36, 82, HL))),
  // training partners: one helps the other up by the hand, both smile
  'martial.träningspartner': all(dojo(),
    fz(30, 106, 0.9, { h: [0, -10], n: [6, -36], aL: [[10, -46], [20, -52]], aR: [[-6, -26], [-12, -14]], lL: [[16, -18], [24, -2]], lR: [[18, -12], [30, -2]] }, GIB(C.yellow)),
    fz(78, 106, 0.95, pose({ h: [0, -42], n: [-4, -67], aL: [[-14, -62], [-26, -58]], aR: [[6, -55], [8, -43]], lL: [[-4, -21], [-8, -1]], lR: [[4, -21], [6, -1]] }), GI(C.yellow)),
    ring(52, 52, 8), path('M46 22 C50 16 58 16 60 22 C62 16 70 16 72 22 C72 30 60 36 60 36 C60 36 48 30 46 22 Z', C.red, C.ink, 1.2)),
  // grade: a staircase of belts, a small judoka on one step (ringed); the black belt at the top
  'martial.grad.3': all(rect(0, 0, 120, 120, WALL, 0, null),
    ...[0, 1, 2, 3, 4].map((i) => all(rect(8 + i * 21, 96 - i * 16, 104 - i * 21, 16, i === 2 ? '#fff3dc' : C.white, 1, C.ink, 1.4),
      beltStrip(10 + i * 21, 101 - i * 16, [C.white, C.yellow, C.orange, C.green, C.black][i]!, 16))),
    fz(60, 64, 0.42, pose({ ...P.bowUp, aL: [[-6, -80], [-3, -92]], aR: [[6, -80], [3, -92]] }), GI(C.orange)), ring(60, 56, 16), arrow(30, 50, 94, 18, C.grey, 2.4)),
  // grading: a judoka shows a technique to two examiners at a table, and a new belt comes to him
  'martial.gradering': all(dojo(true), table(66, 74, 50), fz(76, 74, 0.5, pose({ h: [0, -30], n: [0, -56] }), { top: C.dark, leg: C.dark, mouth: 'flat' }),
    fz(104, 74, 0.5, pose({ h: [0, -30], n: [0, -56] }), { top: C.dark, leg: C.dark, mouth: 'flat' }), rect(84, 68, 12, 6, C.white, 1, C.ink, 1),
    fz(32, 108, 0.9, P.punch, GI(C.white)),
    waIn('mgrad', 30, 0, g('translate(46 22) rotate(-10)', beltStrip(0, 0, C.yellow, 30), path('M14 5 L10 14 M18 5 L22 14', 'none', C.yellow, 3))), ring(60, 26, 18)),

  // ═══ 4642 Brottning och grepp ═══
  // the sport: two wrestlers in singlets on the round mat, a referee behind
  'martial.brottning': all(wrestleMat(),
    fz(92, 98, 0.6, pose({ h: [0, -42], n: [0, -68], aL: [[-10, -60], [-14, -70]], aR: [[10, -60], [14, -70]] }), REF_WR),
    fz(44, 108, 0.95, pose({ h: [0, -36], n: [10, -58], aL: [[18, -54], [26, -60]], aR: [[20, -50], [28, -54]], lL: [[-8, -20], [-14, -1]], lR: [[8, -20], [10, -1]] }), SINGLET(C.red)),
    fz(74, 108, 0.95, pose({ h: [0, -36], n: [-10, -58], aL: [[-18, -54], [-26, -60]], aR: [[-20, -50], [-28, -54]], lL: [[8, -20], [14, -1]], lR: [[-8, -20], [-10, -1]] }), SINGLET('#3f6fb5'))),
  // children wrestle on the grass and roll back and forth
  'martial.brottas': all(grass(),
    waSway('mbrot', 6, g('translate(0 0)',
      fz(52, 110, 0.78, pose({ h: [0, -30], n: [14, -48], aL: [[24, -46], [34, -40]], aR: [[22, -40], [30, -34]], lL: [[-8, -16], [-16, -1]], lR: [[6, -16], [6, -1]] }), { top: C.orange, leg: C.navy, barefoot: false }),
      fz(74, 110, 0.78, pose({ h: [0, -28], n: [-14, -46], aL: [[-22, -44], [-30, -50]], aR: [[-18, -36], [-12, -30]], lL: [[8, -14], [16, -1]], lR: [[-4, -14], [-4, -1]] }), { top: C.green, leg: C.denim, barefoot: false }))),
    motion('M28 70 l-6 -2 M28 78 l-6 0 M96 70 l6 -2 M96 78 l6 0')),
  // the wrestler: one portrait in singlet and wrestling shoes, ready stance
  'martial.brottare': all(rect(0, 0, 120, 120, '#e9eef3', 0, null), rect(0, 96, 120, 24, '#3f6fb5', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    fz(60, 110, 1.15, pose({ h: [0, -36], n: [0, -62], aL: [[-14, -54], [-18, -42]], aR: [[14, -54], [18, -42]], lL: [[-11, -18], [-14, -1]], lR: [[11, -18], [14, -1]] }), { ...SINGLET(C.red), mouth: 'flat' })),
  // the grip close up: one hand round the wrist, the other on the elbow
  'martial.grepp.5': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    path('M0 62 L84 58 L84 80 L0 86 Z', GI_BLUE, C.ink, 1.8), line('M30 64 L34 82 M60 62 L62 80', 'rgba(0,0,0,0.25)', 1.4), path('M84 58 C96 56 104 62 104 70 C104 78 96 82 84 80 Z', C.skin, C.ink, 1.8),
    path('M50 0 L72 0 L70 52 L50 52 Z', C.white, C.ink, 1.8), path('M46 52 C46 44 74 44 76 52 L78 66 C78 70 74 72 70 70 L70 92 C70 96 64 96 64 92 L64 84 L58 84 L58 92 C58 96 52 96 52 92 L52 84 C46 84 44 76 46 70 Z', C.skin, C.ink, 1.8),
    line('M58 72 L58 84 M64 72 L64 84', C.skin2, 1.2),
    path('M8 0 L28 0 L28 48 L8 50 Z', C.white, C.ink, 1.8), path('M4 50 C4 42 30 42 32 50 L32 66 C26 70 12 70 6 66 Z', C.skin, C.ink, 1.8), path('M8 64 C12 70 20 70 26 66', 'none', C.ink, 1.2),
    ring(62, 68, 22), ring(18, 60, 14, 'rgba(228,87,46,0.7)')),
  // a firm hold with both hands: a child hangs from a bar and does not let go
  'martial.tag.2': all(rect(0, 0, 120, 120, '#e8e4dc', 0, null), rect(0, 104, 120, 16, '#9a9389', 0, null), line('M14 16 L14 104 M106 16 L106 104', C.dark, 4), line('M10 20 L110 20', C.silver, 4), line('M10 20 L110 20', C.ink, 0.8),
    fz(60, 102, 0.85, pose({ h: [0, -50], n: [0, -76], aL: [[-6, -88], [-6, -97]], aR: [[6, -88], [6, -97]], lL: [[-4, -30], [-6, -10]], lR: [[4, -30], [8, -12]] }), { top: C.orange, leg: C.navy, barefoot: false }),
    ring(60, 21, 13), motion('M44 12 l-4 -4 M76 12 l4 -4')),
  // body lock: arms round the opponent's body; he is lifted off the mat
  'martial.livtag': all(wrestleMat(),
    waBob('mliv', 4, fz(70, 104, 0.9, pose({ h: [0, -42], n: [-6, -66], aL: [[-14, -60], [-18, -50]], aR: [[2, -56], [8, -48]], lL: [[2, -21], [2, -1]], lR: [[8, -20], [10, -1]] }), { ...SINGLET('#3f6fb5'), mouth: 'o' })),
    fz(46, 108, 0.92, pose({ h: [0, -38], n: [8, -62], aL: [[18, -60], [26, -52]], aR: [[16, -52], [26, -48]], lL: [[-8, -20], [-14, -1]], lR: [[8, -20], [10, -1]] }), SINGLET(C.red)),
    ring(66, 60, 12), motion('M64 108 l0 -6 M72 108 l0 -6')),
  // takedown: start both standing; end one on a knee with arms round the legs, the other falling back
  'martial.nedtagning': all(wrestleMat(),
    flip('mned', all(fz(42, 106, 0.9, pose({ h: [0, -38], n: [6, -62], aL: [[14, -56], [20, -50]], aR: [[16, -52], [22, -46]], lL: [[-8, -20], [-12, -1]], lR: [[8, -20], [10, -1]] }), SINGLET(C.red)),
      fz(80, 106, 0.9, pose({ h: [0, -38], n: [-6, -62], aL: [[-14, -56], [-20, -50]], aR: [[-16, -52], [-22, -46]], lL: [[8, -20], [12, -1]], lR: [[-8, -20], [-10, -1]] }), SINGLET('#3f6fb5'))),
      all(fz(82, 106, 0.9, { h: [4, -30], n: [26, -46], aL: [[18, -54], [10, -62]], aR: [[30, -34], [34, -22]], lL: [[-12, -16], [-14, -1]], lR: [[-8, -32], [-22, -36]] }, { ...SINGLET('#3f6fb5'), mouth: 'o' }),
        fz(48, 106, 0.9, { h: [0, -22], n: [18, -38], aL: [[30, -36], [38, -28]], aR: [[28, -30], [36, -22]], lL: [[-6, -4], [-22, -1]], lR: [[12, -12], [14, -1]] }, SINGLET(C.red)))),
    arrow(98, 40, 108, 70, HL)),
  // Greco-Roman: grip only above the waist (dashed line); legs are crossed out
  'martial.grekisk-romersk-stil': all(wrestleMat(),
    fz(44, 106, 0.92, pose({ h: [0, -40], n: [8, -64], aL: [[16, -64], [24, -70]], aR: [[16, -58], [26, -60]], lL: [[-6, -20], [-10, -1]], lR: [[8, -20], [10, -1]] }), SINGLET(C.red)),
    fz(76, 106, 0.92, pose({ h: [0, -40], n: [-8, -64], aL: [[-16, -64], [-24, -70]], aR: [[-16, -58], [-26, -60]], lL: [[6, -20], [10, -1]], lR: [[-8, -20], [-10, -1]] }), SINGLET('#3f6fb5')),
    line('M14 70 L106 70', HL, 2.2, '4 3'), rect(30, 26, 60, 42, 'none', 4, HL, 2.4), tick(104, 40), cross(104, 92)),
  // freestyle: the leg grab is allowed (tick)
  'martial.fristil': all(wrestleMat(),
    fz(80, 106, 0.92, pose({ h: [0, -40], n: [-8, -64], aL: [[-16, -58], [-24, -54]], aR: [[-12, -52], [-20, -46]], lL: [[6, -20], [10, -1]], lR: [[-10, -32], [-26, -34]] }), { ...SINGLET('#3f6fb5'), mouth: 'o' }),
    fz(40, 106, 0.92, { h: [0, -26], n: [16, -44], aL: [[26, -42], [32, -34]], aR: [[26, -36], [34, -30]], lL: [[-8, -8], [-24, -1]], lR: [[12, -14], [14, -1]] }, SINGLET(C.red)),
    ring(64, 72, 11), tick(18, 30)),
  // bridge: lying face up, the belly lifted high, body resting on the feet and the head
  'martial.brygga.4': all(wrestleMat(),
    flip('mbrygga', fz(56, 104, 1.05, { h: [0, -7], n: [24, -8], aL: [[22, -18], [14, -22]], aR: [[24, -18], [16, -24]], lL: [[-12, -18], [-20, -1]], lR: [[-8, -16], [-16, -1]] }, SINGLET(C.red)),
      fz(56, 104, 1.05, { h: [0, -28], n: [22, -14], aL: [[22, -24], [14, -28]], aR: [[24, -24], [16, -30]], lL: [[-12, -18], [-20, -1]], lR: [[-8, -16], [-16, -1]] }, SINGLET(C.red))),
    ring(86, 98, 8), ring(36, 102, 8), arrow(60, 40, 60, 62, HL)),
  // sumo: two big wrestlers with topknots and belts push in the straw ring
  'martial.sumo': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), path('M0 92 L120 92 L120 120 L0 120 Z', '#d9c08f', null), ellipse(60, 102, 54, 10, 'none', '#a88a4e', 3), line('M0 92 L120 92', C.ink, 1.2),
    ...[[34, 1], [86, -1]].map(([x, d]) => g(`translate(${x} 0)`,
      path(`M${d! * -4} 104 L${d! * -10} 104 L${d! * -12} 84 L${d! * 2} 84 Z`, C.skin, C.ink, 1.6), path(`M${d! * 6} 104 L${d! * 12} 104 L${d! * 10} 84 L${d! * -2} 84 Z`, C.skin, C.ink, 1.6),
      ellipse(d! * 2, 70, 20, 20, C.skin, C.ink, 1.8), path(`M${d! * -16} 78 L${d! * 20} 78 L${d! * 18} 88 L${d! * -14} 88 Z`, d === 1 ? '#5a3b7a' : '#2f6b4f', C.ink, 1.4),
      path(`M${d! * 14} 62 L${d! * 26} 58`, 'none', C.ink, 7.4), path(`M${d! * 14} 62 L${d! * 26} 58`, 'none', C.skin, 5),
      circle(d! * 10, 44, 9, C.skin, C.ink, 1.6), path(`M${d! * 2} 42 C${d! * 2} 34 ${d! * 18} 34 ${d! * 18} 42 C${d! * 14} 38 ${d! * 6} 38 ${d! * 2} 42 Z`, C.hair, null), ellipse(d! * 6, 34, 4, 2.4, C.hair, null),
      circle(d! * 13, 45, 1, C.ink, null), line(`M${d! * 10} 49 l${d! * 4} 0`, C.ink, 1))),
    motion('M50 50 l-4 -4 M70 50 l4 -4')),

  // ═══ 4643 Boxning ═══
  // the sport: ring, two boxers facing, a referee between them
  'martial.boxning': all(boxRing(), fz(60, 102, 0.66, pose({ aL: [[-10, -56], [-12, -44]], aR: [[10, -56], [12, -44]] }), REF_BOX),
    fz(34, 104, 0.85, P.guard, BOXER(C.red)), fz(86, 104, 0.85, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, BOXER('#3f6fb5')),
    ringFront(98)),
  // to box: two people spar in the gym; the punches go out and back
  'martial.boxas': all(gym(), flip('mboxas', all(fz(38, 110, 0.95, P.guard, BOXER(C.red)), fz(84, 110, 0.95, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, BOXER('#3f6fb5'))),
    all(fz(38, 110, 0.95, P.jab, BOXER(C.red)), fz(84, 110, 0.95, { ...P.block, n: [-3, -64], aR: [[-14, -60], [-14, -73]], aL: [[5, -50], [4, -42]], lL: [[10, -20], [20, -1]], lR: [[-12, -20], [-14, -1]] }, BOXER('#3f6fb5')), motion('M50 40 l8 0 M50 46 l8 0'))),
    arrow(52, 28, 70, 28, HL)),
  // the boxer: a portrait with gloves up, robe over the shoulders
  'martial.boxare': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), path('M30 0 L90 0 L104 120 L16 120 Z', 'rgba(255,240,180,0.25)', null),
    fz(60, 114, 1.2, pose({ h: [0, -40], n: [0, -66], aL: [[-12, -58], [-8, -70]], aR: [[12, -58], [8, -70]], lL: [[-8, -20], [-10, -1]], lR: [[8, -20], [10, -1]] }), { ...BOXER(C.red), mouth: 'flat' })),
  // the ring itself, empty
  'martial.ring.5': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    path('M10 70 L60 50 L110 70 L60 92 Z', '#7fa8d8', C.ink, 1.6), path('M10 70 L60 92 L60 100 L10 78 Z M110 70 L60 92 L60 100 L110 78 Z', '#2e3a5c', C.ink, 1.4),
    ...[[10, 70, C.red], [60, 50, C.white], [110, 70, '#3f6fb5'], [60, 92, C.white]].map(([x, y, c]) => rect((x as number) - 2.5, (y as number) - 30, 5, 30, c as string, 1, C.ink, 1.2)),
    ...[10, 18, 26].map((d) => all(line(`M10 ${70 - d} L60 ${50 - d} L110 ${70 - d}`, C.white, 2), line(`M10 ${70 - d} L60 ${92 - d} L110 ${70 - d}`, C.white, 2.2))),
    path('M10 70 L60 50 L110 70 L60 92 Z', 'none', HL, 2.6)),
  // round: the bell and a round card with a digit; a clock shows the three minutes
  'martial.rond': all(boxRing(), bell(30, 26, 1.1), waShake('mrond', motion('M12 18 l-4 -2 M12 26 l-5 0 M48 18 l4 -2 M48 26 l5 0')), scoreCard(84, 86, '2', C.white, 2.1), stopwatch(88, 26, 1.2, 0.75)),
  // the glove alone
  'martial.boxningshandske': all(rect(0, 0, 120, 120, '#e9eef3', 0, null), glove(60, 56, 2.2, C.red, -12)),
  // the mouthguard alone (U shape) and how it sits over the teeth
  'martial.tandskydd': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    path('M24 70 C20 36 100 36 96 70 L84 72 C86 50 34 50 36 72 Z', '#59b4e8', C.ink, 2), path('M30 66 C30 46 90 46 90 66', 'none', 'rgba(255,255,255,0.5)', 2),
    ...[40, 50, 60, 70, 80].map((x) => rect(x - 4, 52 + Math.abs(x - 60) * 0.2, 8, 7, C.white, 2, C.ink, 0.8)),
    g('translate(60 98)', path('M-22 0 C-22 -10 22 -10 22 0 C22 10 -22 10 -22 0 Z', C.skin, C.ink, 1.6), path('M-14 -1 C-6 4 6 4 14 -1 C6 -3 -6 -3 -14 -1 Z', '#59b4e8', C.ink, 1.2))),
  // shadow boxing: alone in front of a mirror, punching the air; a dashed opponent
  'martial.skuggboxning': all(gym(), rect(72, 14, 44, 82, '#d6eaf2', 2, C.ink, 1.6), line('M80 20 L92 84 M100 20 L110 70', C.white, 2.2),
    greyed(fz(96, 92, 0.7, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, { top: C.grey, leg: C.grey, bare: true })),
    flip('mskugga', fz(36, 110, 0.95, P.guard, { top: C.orange, leg: C.navy, bare: false, barefoot: false }), fz(36, 110, 0.95, P.jab, { top: C.orange, leg: C.navy, bare: false, barefoot: false })),
    path('M64 50 C70 46 70 40 66 36', 'none', C.grey, 1.6, ), motion('M58 46 l8 0 M58 52 l6 0')),
  // the heavy bag hanging on a chain, swinging after a punch
  'martial.sandsäck.2': all(gym(), line('M60 0 L60 14', C.dark, 2.4), path('M52 14 L68 14 L60 22 Z', C.dark, C.ink, 1),
    waSway('msack', 5, g('translate(0 0)', rect(46, 22, 28, 66, '#7a3b3b', 8, C.ink, 2), line('M46 32 L74 32 M46 78 L74 78', '#5a2b2b', 2.4), line('M60 22 L60 14', C.dark, 2.4))),
    glove(26, 56, 0.8, C.red, 80), motion('M38 50 l6 0 M38 58 l6 0 M84 46 l6 -2 M84 56 l7 0')),
  // the guard: hands up at the face, elbows in (orange); grey reference with the hands down
  'martial.garde': all(gym(), greyed(fz(30, 108, 0.85, STAND, { top: C.grey, leg: C.grey, bare: true, gloves: C.grey })),
    fz(82, 108, 1, pose({ h: [0, -40], n: [0, -66], aL: [[-9, -55], [-6, -68]], aR: [[9, -55], [6, -68]], lL: [[-8, -20], [-11, -1]], lR: [[8, -20], [11, -1]] }), { ...BOXER(C.red), mouth: 'flat' }),
    rect(64, 30, 36, 30, 'none', 6, HL, 2.6), cross(30, 20), tick(110, 20)),
  // the jab: from the guard, the front fist goes straight out (straight arrow)
  'martial.jabb': all(gym(), greyed(rect(92, 30, 18, 64, '#7a3b3b', 6, C.ink, 1.6)),
    flip('mjabb', fz(44, 110, 1, P.guard, BOXER(C.red)), fz(44, 110, 1, P.jab, BOXER(C.red))), arrow(56, 30, 86, 30, HL)),
  // the hook: the fist comes round from the side with the elbow bent (curved arrow)
  'martial.krok.3': all(gym(), greyed(rect(92, 30, 18, 64, '#7a3b3b', 6, C.ink, 1.6)),
    flip('mkrok', fz(44, 110, 1, P.guard, BOXER(C.red)), fz(44, 110, 1, P.hook, BOXER(C.red))), path('M50 52 C50 14 80 12 84 36', 'none', HL, 3), path('M84 36 L78 28 L88 30 Z', HL, HL, 1)),
  // the uppercut: the rear fist goes from low up towards the chin (arrow upwards)
  'martial.uppercut': all(gym(), greyed(rect(92, 30, 18, 64, '#7a3b3b', 6, C.ink, 1.6)),
    flip('mupp', fz(44, 110, 1, P.uppLow, BOXER(C.red)), fz(44, 110, 1, P.upper, BOXER(C.red))), path('M58 80 C70 76 72 60 68 44', 'none', HL, 3), path('M68 44 L64 52 L73 51 Z', HL, HL, 1)),
  // parry: the blue boxer's jab is pushed aside by the red boxer's hand (ringed contact, arrow aside)
  'martial.parera': all(gym(),
    fz(84, 110, 0.95, { ...P.jab, n: [-5, -66], aL: [[-8, -55], [-12, -65]], aR: [[-18, -66], [-31, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-12, -1]] }, BOXER('#3f6fb5')),
    flip('mpar', fz(36, 110, 0.95, P.guard, BOXER(C.red)), fz(36, 110, 0.95, pose({ ...P.guard, aR: [[14, -60], [22, -66]] }), BOXER(C.red))),
    ring(56, 47, 9), arrow(56, 38, 60, 22, HL)),
  // duck: the red boxer drops under the punch, which goes over his head
  'martial.ducka': all(gym(),
    fz(86, 110, 0.95, { ...P.jab, n: [-5, -66], aL: [[-8, -55], [-12, -65]], aR: [[-18, -66], [-31, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-12, -1]] }, BOXER('#3f6fb5')),
    flip('mduck', fz(38, 110, 0.95, P.guard, BOXER(C.red)), fz(38, 110, 0.95, P.duck, BOXER(C.red))), arrow(40, 32, 44, 54, HL), motion('M52 44 l10 0')),
  // footwork: the feet step in small steps, footprints behind them
  'martial.fotarbete': all(gym(), ...[[20, 104], [34, 100], [50, 104], [64, 100]].map(([x, y], i) => greyed(ellipse(x!, y!, 5, 2.4, C.dark, null), circle(x! + 4, y!, 1.4, C.dark, null), ...(i === 3 ? [] : []))),
    moving('mfot', '0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,0)}', { dur: 1.8 }, g('translate(0 0)',
      at(84, 112, 1.3, legOf(P.guard, 'L', BOXER(C.red)), legOf(P.guard, 'R', BOXER(C.red)), path('M-14 -46 L16 -46 L14 -34 L-14 -34 Z', C.red, C.ink, 1.4)))),
    arrow(66, 84, 46, 84, HL), arrow(70, 76, 96, 76, HL)),

  // ═══ 4644 Karate ═══
  // the sport: a karateka in white with a black belt punches in a front stance; a brush circle on the wall
  'martial.karate': all(dojo(true), rect(88, 10, 26, 40, '#f6f2ea', 1, C.ink, 1.2), circle(101, 28, 8, 'none', C.ink, 2.6), rect(107, 40, 3, 3, C.red, 0, null),
    fz(38, 108, 1.05, P.punch, { ...GI(C.black), mouth: 'open' })),
  // the bow: from upright to bowed, the partner bows back
  'martial.bugning': all(dojo(true),
    greyed(fz(98, 108, 0.9, { ...P.bowDown, n: [-12, -65], aL: [[-9, -53], [-5, -42]], aR: [[-11, -53], [-7, -42]] }, GI(C.black))),
    flip('mbug', fz(30, 108, 0.95, P.bowUp, GI(C.black)), fz(30, 108, 0.95, P.bowDown, GI(C.black))), path('M30 30 C40 28 46 34 48 42', 'none', HL, 2.4), path('M48 42 L42 38 L49 34 Z', HL, HL, 1)),
  // basic technique: a row of students do the same punch together; a loop arrow = again and again
  'martial.grundteknik': all(dojo(true), ...[22, 52, 82].map((x) => fz(x, 108, 0.62, P.punch, GI(x === 52 ? C.yellow : C.white))),
    path('M90 30 C100 18 114 26 108 38 C104 46 92 44 90 36', 'none', HL, 2.4), path('M90 36 L88 28 L96 32 Z', HL, HL, 1)),
  // stance (how one holds the body): a low, wide stance with the feet width and lowered hips marked; grey upright reference
  'martial.ställning.3': all(dojo(), greyed(fz(24, 106, 0.8, STAND, GI(C.white))),
    fz(74, 106, 1, P.horse, GI(C.black)), line('M53 110 L95 110', HL, 2.6), path('M53 106 L53 114 M95 106 L95 114', 'none', HL, 2.6), arrow(108, 50, 108, 70, HL)),
  // a kick: the foot goes out (front kick) and hits a pad; impact star
  'martial.spark': all(dojo(true), fz(40, 108, 0.95, pose({ ...P.frontKick, lR: [[19, -47], [38, -50]] }), { ...GI(C.black), noLeg: 'R' }),
    rotAbout('mspark', 40, 68, 55, 2.2, leg1(40, 108, 0.95, P.frontKick, 'R', GI(C.black))), rect(80, 46, 10, 26, C.red, 4, C.ink, 1.6), impact(78, 60, 0.8)),
  // block: the forearm meets the partner's punch and stops it (ringed)
  'martial.blockera.4': all(dojo(true),
    fz(84, 108, 0.95, { ...P.punch, n: [-2, -62], aL: [[8, -50], [5, -42]], aR: [[-15, -61], [-28, -62]], lL: [[12, -20], [26, -1]], lR: [[-14, -20], [-16, -1]] }, GIB(C.black)),
    flip('mblock', fz(38, 108, 0.95, pose({ ...P.block, aR: [[12, -52], [18, -44]] }), GI(C.black)), fz(38, 108, 0.95, P.block, GI(C.black))), ring(53, 46, 8), impact(58, 42, 0.5)),
  // the edge of the hand: an open hand from the side, little-finger edge to the wrist in orange
  'martial.handkant': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), path('M40 120 L44 96 L76 96 L80 120 Z', C.white, C.ink, 1.8),
    path('M44 98 L42 50 C42 40 46 22 52 18 C56 16 60 18 60 22 C62 16 68 16 70 22 C74 20 78 24 78 30 L80 60 L80 98 Z', C.skin, C.ink, 2),
    path('M44 66 C36 62 30 54 32 48 C34 44 40 46 44 52', C.skin, C.ink, 1.8), line('M60 22 L60 54 M70 22 L71 56', C.skin2, 1.4),
    path('M78 30 L80 60 L80 98', 'none', HL, 5), arrow(104, 56, 86, 64, HL)),
  // kata alone: one karateka; grey ghosts and footprints show the pattern of moves
  'martial.kata': all(dojo(true), path('M18 104 L48 98 L80 104 L104 96', 'none', C.grey, 1.6, ), ...[[18, 104], [48, 98], [80, 104], [104, 96]].map(([x, y]) => ellipse(x!, y!, 3, 1.6, C.grey, null)),
    greyed(fz(22, 104, 0.6, P.block, GI(C.white)), fz(98, 104, 0.6, P.horse, GI(C.white))), fz(58, 104, 0.85, P.punch, GI(C.green)), arrow(30, 40, 50, 34, C.grey, 2), arrow(76, 34, 94, 40, C.grey, 2)),
  // kumite: two karateka face each other, the punch stops just in front of the face (gap marked)
  'martial.kumite': all(dojo(true),
    fz(84, 108, 0.95, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, { ...GIB(C.black), gloves: C.red }),
    flip('mkum', fz(32, 108, 0.95, P.guard, { ...GI(C.black), gloves: '#3f6fb5' }), fz(32, 108, 0.95, pose({ ...P.punch, aR: [[14, -60], [27, -61]] }), { ...GI(C.black), gloves: '#3f6fb5' })),
    line('M62 50 L76 50', HL, 2, '2 2'), path('M62 46 L62 54 M76 46 L76 54', 'none', HL, 2)),
  // speed: a fist rushes in with long speed lines; a stopwatch has hardly moved
  'martial.snabbhet': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), stopwatch(92, 26, 1.3, 0.06),
    moving('msnabb', '0%{transform:translate(-60px,0);opacity:.2}30%,100%{transform:translate(0,0);opacity:1}', { dur: 1.6 }, g('translate(0 0)',
      ...[54, 62, 70, 78].map((y, i) => line(`M${8 + i * 4} ${y} L${56 - i * 2} ${y}`, HL, 2)),
      path('M60 52 L86 50 C94 50 98 56 98 64 C98 74 92 80 84 80 L60 80 Z', C.skin, C.ink, 2), line('M86 58 L96 58 M86 66 L97 66 M86 74 L95 74', C.ink, 1.2), rect(40, 54, 22, 24, C.white, 3, C.ink, 1.6)))),

  // ═══ 4645 Taekwondo ═══
  // the sport: two fighters with vests and head guards, one kicks high
  'martial.taekwondo': all(compMat(),
    fz(84, 108, 0.9, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, TKD('#3f6fb5')),
    fz(34, 108, 0.9, P.roundKick, TKD(C.red))),
  // Korean: the Korean peninsula in orange, Japan and the mainland in grey
  'martial.koreansk': all(rect(0, 0, 120, 120, '#dff0fa', 0, null),
    path('M30 26 L76 24 C72 34 64 40 66 48 C68 58 66 68 60 76 C56 82 48 86 42 84 C40 78 44 72 40 66 C36 60 40 54 36 48 C34 42 30 38 30 26 Z', HL, C.ink, 2),
    path('M0 0 L120 0 L120 12 C108 16 96 20 86 20 C80 20 78 26 74 30 L30 31 C24 38 18 46 12 58 C8 66 4 70 0 72 Z', '#c9c3b6', C.ink, 1.4), greyed(
      path('M104 26 C110 32 108 42 100 48 C96 56 96 66 90 74 C84 82 76 86 68 92 C64 96 60 100 56 100 C54 96 58 92 64 88 C72 82 78 74 82 64 C86 54 90 42 98 32 Z', '#b9b2a4', C.ink, 1.4),
      path('M46 102 C50 98 56 100 56 106 C52 110 46 108 46 102 Z', '#b9b2a4', C.ink, 1.2)),
),
  // the vest alone (red, padded, with straps)
  'martial.skyddsväst.2': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    path('M34 22 L50 22 C52 30 68 30 70 22 L86 22 L92 36 L92 98 C80 104 40 104 28 98 L28 36 Z', C.red, C.ink, 2), path('M40 40 L80 40 L82 86 C70 90 50 90 38 86 Z', '#e86a6a', C.ink, 1.4),
    circle(60, 62, 10, 'none', C.white, 2), line('M28 52 L18 56 M92 52 L102 56 M28 70 L18 74 M92 70 L102 74', C.ink, 2.4), path('M44 22 L44 10 M76 22 L76 10', 'none', C.ink, 2.4)),
  // the head guard on a head, from the front
  'martial.huvudskydd': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    path('M42 104 C42 92 78 92 78 104 Z', C.white, C.ink, 1.6), circle(60, 62, 24, C.skin, C.ink, 2),
    path('M34 66 C30 22 90 22 86 66 L78 66 C78 44 42 44 42 66 Z', '#3f6fb5', C.ink, 2), rect(32, 58, 12, 24, '#3f6fb5', 5, C.ink, 1.8), rect(76, 58, 12, 24, '#3f6fb5', 5, C.ink, 1.8),
    path('M44 82 C52 90 68 90 76 82', 'none', '#3f6fb5', 3.4), circle(52, 66, 2, C.ink, null), circle(68, 66, 2, C.ink, null), path('M54 76 Q60 79 66 76', 'none', C.ink, 1.4), ring(60, 50, 34)),
  // front kick: knee up first (start), then the leg straight forward to the pad (straight arrow)
  'martial.framspark': all(compMat(), fz(96, 108, 0.82, pose({ h: [0, -42], n: [0, -68], aL: [[-10, -60], [-14, -62]], aR: [[-10, -56], [-14, -54]] }), { top: C.white, leg: C.white, gi: true, belt: C.black, barefoot: true }),
    rect(74, 54, 8, 20, C.red, 3, C.ink, 1.4),
    flip('mfram', fz(34, 108, 0.95, P.chamber, TKD(C.red)), fz(34, 108, 0.95, P.frontKick, TKD(C.red))), arrow(54, 46, 70, 46, HL)),
  // round kick: the leg sweeps in a curve from the side to the vest (curved arrow)
  'martial.rundspark': all(compMat(),
    fz(92, 108, 0.9, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, TKD('#3f6fb5')),
    flip('mrund', fz(42, 108, 0.95, P.chamber, TKD(C.red)), fz(42, 108, 0.95, P.roundKick, TKD(C.red))), path('M52 96 C40 70 54 40 78 48', 'none', HL, 3), path('M78 48 L69 44 L72 54 Z', HL, HL, 1)),
  // side kick: the body turns sideways and the heel goes first (heel ringed)
  'martial.sidospark': all(compMat(), rect(92, 52, 10, 24, C.red, 3, C.ink, 1.4),
    flip('msido', fz(48, 108, 0.95, P.chamber, TKD(C.red)), fz(48, 108, 0.95, P.sideKick, TKD(C.red))), ring(85, 64, 6), arrow(60, 82, 84, 82, HL)),
  // a hit: the foot lands on the vest; burst and the vest light up
  'martial.träff.3': all(compMat(),
    fz(88, 108, 0.95, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, TKD('#3f6fb5')),
    fz(36, 108, 0.95, { ...P.frontKick, lR: [[19, -50], [38, -56]] }, TKD(C.red)),
    waPulse('mtraff', impact(74, 54, 1.4), circle(84, 56, 14, 'none', C.green, 2.4)), sensorWaves(98, 30)),

  // ═══ 4646 Brasiliansk jiu-jitsu ═══
  // the sport: one fighter on his back holds the other between his legs (closed guard) on the mat
  'martial.jiu-jitsu': all(dojo(), g('translate(2 -26) scale(1.25)',
    fz(40, 106, 1, { h: [0, -8], n: [-26, -10], aL: [[-16, -22], [-6, -30]], aR: [[-14, -18], [-4, -26]], lL: [[16, -26], [32, -32]], lR: [[18, -22], [34, -26]] }, { ...GIB(C.purple), noLeg: 'R' }),
    fz(70, 106, 1, { h: [0, -18], n: [-8, -42], aL: [[-16, -34], [-24, -24]], aR: [[-14, -32], [-22, -22]], lL: [[-4, -2], [14, -1]], lR: [[-2, -2], [16, -1]] }, GI(C.black)),
    leg1(40, 106, 1, { h: [0, -8], n: [-26, -10], aL: [[0, 0], [0, 0]], aR: [[0, 0], [0, 0]], lL: [[0, 0], [0, 0]], lR: [[18, -22], [34, -26]] }, 'R', GIB(C.purple)))),
  // Brazilian: South America in grey, Brazil in green
  'martial.brasiliansk': all(rect(0, 0, 120, 120, '#dff0fa', 0, null),
    greyed(path('M34 10 L58 8 L80 14 L98 24 L112 40 L104 58 L88 70 L74 84 L62 98 L54 114 L48 112 L46 96 L42 80 L30 62 L22 44 L24 26 Z', '#c9c3b6', C.ink, 1.4)),
    path('M56 12 L80 14 L98 24 L112 40 L104 58 L88 70 L76 80 L66 86 L60 76 L58 62 L46 52 L40 42 L48 30 Z', C.green, C.ink, 2),
    path('M74 38 L90 46 L74 54 L58 46 Z', C.yellow, null), circle(74, 46, 4.6, '#2f4a9a', null)),
  // ground fighting: start standing (grey arrow down), end on the mat
  'martial.markkamp': all(dojo(),
    flip('mmark', all(fz(44, 106, 0.85, P.gripR, GI(C.purple)), fz(76, 106, 0.85, { ...P.gripR, n: [-3, -67], aL: [[-12, -60], [-22, -60]], aR: [[-13, -56], [-23, -52]], lL: [[3, -21], [6, -1]], lR: [[-6, -21], [-8, -1]] }, GIB(C.purple))),
      all(fz(44, 106, 0.95, lieBack(-1), GIB(C.purple)), fz(62, 104, 0.92, { h: [-4, -10], n: [-26, -18], aL: [[-30, -8], [-36, -2]], aR: [[-20, -6], [-14, 0]], lL: [[10, -4], [26, -1]], lR: [[14, -2], [30, -2]] }, GI(C.purple)))),
    rect(4, 88, 112, 20, 'none', 4, HL, 2.4), arrow(104, 30, 104, 62, HL)),
  // upper hand: the one on top (in colour) presses the grey one down; green arrow up
  'martial.överläge': all(dojo(),
    greyed(fz(58, 106, 0.95, lieBack(1), GIB(C.purple))),
    fz(58, 106, 0.95, { h: [8, -16], n: [10, -42], aL: [[16, -32], [22, -18]], aR: [[18, -32], [26, -18]], lL: [[-2, -4], [-16, -1]], lR: [[14, -4], [28, -1]] }, GI(C.purple)),
    arrow(104, 70, 104, 30, C.green), ring(68, 64, 20)),
  // under: the same picture, but the one underneath is in colour and the top one grey; arrow down
  'martial.underläge': all(dojo(),
    fz(58, 106, 0.95, lieBack(1), { ...GIB(C.purple), mouth: 'frown' }),
    greyed(fz(58, 106, 0.95, { h: [8, -16], n: [10, -42], aL: [[16, -32], [22, -18]], aR: [[18, -32], [26, -18]], lL: [[-2, -4], [-16, -1]], lR: [[14, -4], [28, -1]] }, GI(C.purple))),
    arrow(104, 30, 104, 70, C.red), ring(66, 100, 14)),
  // body weight: a person on a scale; a heavy arrow from the body down
  'martial.kroppsvikt': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 104, 120, 16, '#cdb68a', 0, null), scale(56, 108, '72', 1.5),
    fz(56, 98, 0.95, STAND, { top: C.white, leg: C.white, gi: true, belt: C.purple }), arrow(92, 34, 92, 86, HL, 5), arrow(20, 34, 20, 86, HL, 5)),
  // leg lock: the bottom one holds the opponent's leg; the knee is ringed; the other taps
  'martial.benlås': all(dojo(),
    fz(34, 106, 0.95, { ...lieBack(-1), lR: [[18, -10], [36, -22]], aR: [[-28, -2], [-18, -1]] }, { ...GIB(C.purple), mouth: 'frown', noArm: 'R' }),
    waShake('mben', arm1(34, 106, 0.95, { ...lieBack(-1), aR: [[-22, -2], [-30, -1]] }, 'R', GIB(C.purple)), motion('M4 98 l1 -5 M10 96 l2 -5')),
    fz(84, 106, 0.95, { h: [0, -8], n: [8, -32], aL: [[0, -26], [-10, -24]], aR: [[2, -22], [-8, -20]], lL: [[-14, -12], [-28, -6]], lR: [[-10, -4], [-24, -2]] }, GI(C.purple)),
    ring(52, 96, 7), ring(68, 85, 6, 'rgba(228,87,46,0.7)')),
  // self-defence: an attacker grabs the wrist; the person breaks free and steps away
  'martial.självförsvar': all(rect(0, 0, 120, 120, '#e3e7ec', 0, null), rect(0, 100, 120, 20, '#b9bec5', 0, null), line('M0 100 L120 100', C.ink, 1.2),
    greyed(fz(90, 110, 0.95, pose({ h: [0, -42], n: [-4, -67], aL: [[-14, -60], [-26, -58]], aR: [[-10, -56], [-14, -44]] }), { top: C.grey, leg: C.grey })),
    flip('msjalv', fz(58, 110, 0.95, pose({ h: [0, -42], n: [-3, -67], aR: [[10, -60], [21, -59]], aL: [[-6, -56], [-8, -44]], lL: [[-6, -21], [-8, -1]], lR: [[4, -21], [6, -1]] }), { top: C.orange, leg: C.navy, hs: 'long', barefoot: false, mouth: 'o' }),
      fz(30, 110, 0.95, pose({ h: [0, -42], n: [-2, -67], aR: [[10, -62], [14, -74]], aL: [[-8, -56], [-12, -46]], lL: [[-10, -21], [-16, -1]], lR: [[6, -21], [8, -1]] }), { top: C.orange, leg: C.navy, hs: 'long', barefoot: false, mouth: 'flat' })),
    arrow(52, 40, 22, 40, HL)),

  // ═══ 4647 Tävling och domslut ═══
  // weight class: three groups by size, each with its weight on a card; one class ringed
  'martial.klass.5': all(rect(0, 0, 120, 120, '#e9eef3', 0, null), ...[[20, 0.6, '60'], [60, 0.75, '73'], [100, 0.9, '90']].map(([x, s, n]) => all(
    rect((x as number) - 18, 22, 36, 88, x === 60 ? '#fff3dc' : C.white, 4, C.ink, 1.4), fz((x as number) - 6, 106, s as number, STAND, GI(C.white)), fz((x as number) + 7, 106, s as number, STAND, GIB(C.white)),
    scoreCard(x as number, 16, n as string, C.white, 1))), rect(40, 20, 40, 92, 'none', 5, HL, 2.6)),
  // weigh-in: a judoka on the scale, an official writes; the digits blink
  'martial.invägning': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 104, 120, 16, '#cdb68a', 0, null),
    fz(40, 100, 0.95, STAND, { top: C.white, leg: C.white, gi: true, belt: C.black }), waPulse('minv', scale(40, 108, '72', 1.5)),
    fz(92, 110, 0.9, pose({ n: [-2, -68], aL: [[-10, -60], [-16, -52]], aR: [[-6, -58], [-14, -60]] }), { top: C.dark, leg: C.dark, mouth: 'flat', barefoot: false }),
    rect(70, 46, 12, 16, C.white, 1, C.ink, 1.2), line('M72 50 L80 50 M72 54 L80 54 M72 58 L78 58', C.grey, 1)),
  // the ring referee: in white shirt inside the ring, arms out between the two boxers
  'martial.ringdomare': all(boxRing(),
    fz(30, 104, 0.82, P.guard, BOXER(C.red)), fz(90, 104, 0.82, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, BOXER('#3f6fb5')),
    fz(60, 104, 0.9, pose({ aL: [[-12, -62], [-24, -64]], aR: [[12, -62], [24, -64]] }), REF_BOX), path('M57 44 L60 46 L63 44 L63 48 L60 46 L57 48 Z', C.black, null), ring(60, 64, 30), ringFront(98)),
  // the judge: sits at the ringside table with a score card and pen; the ring behind
  'martial.poängdomare': all(boxRing(), greyed(fz(44, 96, 0.6, P.guard, BOXER(C.red)), fz(76, 96, 0.6, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, BOXER('#3f6fb5'))),
    rect(0, 92, 120, 28, '#2d2a3e', 0, null), fz(60, 120, 0.85, pose({ h: [0, -28], n: [0, -54], aL: [[-10, -44], [-14, -34]], aR: [[10, -44], [16, -36]] }), { top: C.white, leg: C.dark, mouth: 'flat' }),
    table(30, 96, 60), rect(66, 86, 16, 12, C.white, 1, C.ink, 1.2), line('M68 90 L80 90 M68 94 L78 94', C.grey, 1), line('M76 76 L82 92', C.ink, 1.6), ring(60, 76, 22)),
  // ippon: the partner lies on his back, the referee raises one arm straight up (ringed)
  'martial.ippon': all(compMat(),
    fz(30, 108, 0.85, pose({ h: [0, -42], n: [4, -66], aL: [[12, -58], [20, -54]], aR: [[10, -54], [18, -50]] }), GI(C.black)), fz(70, 108, 0.85, lieBack(1), GIB(C.black)),
    fz(98, 104, 0.8, pose({ aR: [[2, -82], [2, -96]], aL: [[-6, -56], [-8, -43]] }), REF_JUDO), ring(100, 30, 12)),
  // fall (wrestling): both shoulders pressed to the mat (rings); the referee slaps the mat
  'martial.fall.4': all(wrestleMat(),
    fz(58, 106, 0.95, lieBack(1), { ...SINGLET('#3f6fb5'), mouth: 'frown' }),
    fz(54, 98, 0.92, { h: [-14, -18], n: [12, -24], aL: [[18, -12], [24, -4]], aR: [[8, -12], [12, -2]], lL: [[-26, -8], [-36, 6]], lR: [[-20, -2], [-8, 8]] }, SINGLET(C.red)),
    ring(80, 99, 8),
    waShake('mfall4', motion('M86 112 l-2 -4 M92 112 l0 -4 M98 112 l2 -4'))),
  // knockout: a boxer lies on the canvas with stars round his head; the referee counts with his fingers
  'martial.knockout': all(boxRing(),
    fz(46, 102, 0.9, { h: [0, -6], n: [26, -6], aL: [[30, -14], [38, -18]], aR: [[22, 2], [34, 2]], lL: [[-16, -12], [-30, -4]], lR: [[-18, -4], [-36, -3]] }, { ...BOXER('#3f6fb5'), eyes: 'x', mouth: 'o' }),
    moving('mko', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 3, spin: true }, g('translate(0 0)', star(72, 82, 3.4), star(86, 84, 3), star(80, 76, 2.6))),
    fz(96, 102, 0.75, pose({ aR: [[-8, -64], [-16, -74]], aL: [[-6, -56], [-8, -44]] }), REF_BOX), waPulse('mko2', at(84, 38, 1, path('M-4 6 L-4 -6 M0 6 L0 -8 M4 6 L4 -6', 'none', C.skin, 3), path('M-4 6 L-4 -6 M0 6 L0 -8 M4 6 L4 -6', 'none', C.ink, 0.6))),
    greyed(fz(16, 102, 0.6, P.guard, BOXER(C.red))), ringFront(98)),
  // win on points: two score cards with digits, the higher one ringed; the referee lifts the winner's arm
  'martial.poängseger': all(boxRing(),
    fz(78, 104, 0.85, pose({ aL: [[-6, -56], [-8, -44]], aR: [[-10, -60], [-16, -52]] }), { ...BOXER('#3f6fb5'), mouth: 'frown' }),
    fz(52, 104, 0.85, pose({ aL: [[-6, -56], [-8, -44]], aR: [[12, -62], [22, -60]] }), REF_BOX),
    moving('mpoang', '0%,30%{transform:translate(0,14px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, fz(26, 104, 0.85, pose({ aR: [[4, -80], [4, -94]], aL: [[-6, -56], [-8, -44]] }), BOXER(C.red))),
    scoreCard(18, 22, '3', '#fbe1e1', 1.3), scoreCard(102, 22, '1', '#dde8f7', 1.3), ring(18, 18, 13), ringFront(98)),
  // decision: three judges each hold up a card of the same colour (blue) = the judges decide together
  'martial.domslut.2': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), rect(0, 86, 120, 34, '#3a3550', 0, null), table(6, 92, 108),
    ...[22, 60, 98].map((x) => all(fz(x, 92, 0.7, pose({ h: [0, -28], n: [0, -54], aR: [[8, -66], [10, -80]], aL: [[-8, -44], [-10, -34]] }), { top: C.white, leg: C.dark, mouth: 'flat' }),
      rect(x + 3, 30, 14, 12, '#3f6fb5', 1.5, C.ink, 1.2))), ...[22, 60, 98].map((x) => tick(x + 10, 22, 0.5)), rect(10, 16, 104, 30, 'none', 4, HL, 2.4)),
  // warning: the referee holds up a yellow card and an open palm towards the fighter
  'martial.varning.2': all(compMat(),
    fz(34, 108, 0.9, pose({ n: [2, -68], aL: [[-6, -56], [-8, -44]], aR: [[6, -56], [8, -44]] }), { ...GI(C.black), mouth: 'frown' }),
    fz(84, 108, 0.9, pose({ aL: [[-12, -66], [-24, -70]], aR: [[8, -80], [12, -92]] }), REF_JUDO), rect(66, 4, 14, 18, C.yellow, 1.5, C.ink, 1.4), ring(73, 13, 13)),
  // a foul: a punch below the belt (red cross); it shows again and again
  'martial.regelbrott': all(boxRing(),
    fz(84, 104, 0.9, { ...P.guard, n: [-3, -66], aL: [[-8, -55], [-12, -65]], aR: [[-13, -58], [-17, -67]], lL: [[6, -21], [11, -1]], lR: [[-8, -21], [-11, -1]] }, { ...BOXER('#3f6fb5'), mouth: 'o' }),
    flip('mregel', fz(40, 104, 0.9, P.guard, BOXER(C.red)), fz(40, 104, 0.9, pose({ h: [0, -38], n: [6, -62], aL: [[8, -55], [12, -65]], aR: [[16, -50], [29, -46]], lL: [[-6, -20], [-11, -1]], lR: [[8, -20], [12, -1]] }), BOXER(C.red))),
    line('M60 62 L104 62', HL, 2, '3 2'), waPulse('mregel2', cross(70, 76, 1.2)), ringFront(98)),
  // disqualified: the fighter walks out of the ring, crossed out; a red cross over his place
  'martial.diskvalificera': all(boxRing(), fz(84, 104, 0.82, pose({ aR: [[4, -80], [4, -94]], aL: [[-6, -56], [-8, -44]] }), BOXER('#3f6fb5')),
    fz(64, 104, 0.82, pose({ aL: [[-12, -62], [-24, -64]], aR: [[6, -56], [8, -44]] }), REF_BOX),
    moving('mdisk', '0%,20%{transform:translate(18px,0);opacity:1}80%,100%{transform:translate(0,0);opacity:.55}', { dur: 3 }, fz(26, 104, 0.82, pose({ n: [-2, -68], aL: [[-6, -56], [-6, -44]], aR: [[6, -56], [6, -44]], lL: [[-6, -21], [-10, -1]], lR: [[4, -21], [6, -1]] }), { ...BOXER(C.red), mouth: 'frown' })),
    cross(26, 24, 1.4), arrow(40, 40, 10, 40, C.red)),
};

/** Sensor waves (the vest registers the hit). */
function sensorWaves(x: number, y: number): Svg {
  return at(x, y, 1, path('M-6 4 C-2 0 2 0 6 4', 'none', C.green, 2), path('M-10 0 C-4 -6 4 -6 10 0', 'none', C.green, 2), path('M-14 -4 C-6 -12 6 -12 14 -4', 'none', C.green, 2), circle(0, 8, 2.4, C.green, null));
}
