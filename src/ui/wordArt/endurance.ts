/**
 * Kultur & fritid → Sport & träning → Löpning & uthållighet, 4621–4627 (0.64): jogging and distance running,
 * intervals, running technique, heart-rate training, cycling and spinning, swim training and endurance races.
 * Athletes are drawn with their own posable figure (`fig`): every limb is a joint chain (hip–knee–foot,
 * shoulder–elbow–hand), so a pose can show a correct running stride (landing under the body, opposite arm
 * and leg forward, elbows bent), a pedal stroke, or a crawl, breaststroke, backstroke or butterfly stroke.
 * Moving words swing the limbs about the hip and the shoulder (base state = the poster frame), so the figure
 * never loses or doubles a limb. The far arm and leg are drawn a shade darker than the near ones.
 * The part the word names is orange (ring, frame, arrow or fill); grey figures and things are the reference.
 * Times and distances are digits only. No letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL, heart } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const bg = (col: string) => rect(0, 0, 120, 120, col, 0, null);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
/** Rock a part about (cx, cy) between a and b degrees (local units). */
const rock = (name: string, cx: number, cy: number, a: number, b: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:translate(${cx}px,${cy}px) rotate(${a}deg) translate(${-cx}px,${-cy}px)}50%{transform:translate(${cx}px,${cy}px) rotate(${b}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);
/** Turn a part round (cx, cy) a full circle. */
const turn = (name: string, cx: number, cy: number, dur: number, phase = 0, ...k: Svg[]) =>
  moving(name, `0%{transform:translate(${cx}px,${cy}px) rotate(${phase}deg) translate(${-cx}px,${-cy}px)}100%{transform:translate(${cx}px,${cy}px) rotate(${phase + 360}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);
/** Move a part from (dx, dy) to its place and on, like travelling across the picture. */
const travel = (name: string, dx0: number, dx1: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%{transform:translate(${dx0}px,0)}100%{transform:translate(${dx1}px,0)}`, { dur }, ...k);

// ── The posable athlete ──────────────────────────────────────────────
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = {
  top?: string; leg?: string; skin?: string; hair?: string; shoe?: string; grey?: boolean;
  hs?: 'short' | 'long' | 'bun' | 'cap' | 'swimcap' | 'helmet' | 'none'; capCol?: string;
  mouth?: 'smile' | 'open' | 'flat' | 'grit' | 'o' | 'none'; shorts?: boolean; sleeves?: boolean; bib?: string; goggles?: boolean;
  suit?: string; vest?: string; noArm?: 'L' | 'R'; hlLegs?: boolean; hlArms?: boolean; front?: Svg;
};
/** Limb swing: legs rock about the hip, arms about the shoulder, near and far in opposite phase. */
type Swing = { name: string; leg?: number; arm?: number; dur?: number; armTurn?: 'both' | 'alt' };
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-3, -55], [-4, -43]], aR: [[3, -55], [4, -43]], lL: [[-3, -21], [-4, -1]], lR: [[3, -21], [4, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
/** Athlete with feet near (x, y), facing right; local height ≈ 86·s. */
function fig(x: number, y: number, s: number, p: Pose, o: Look = {}, sw?: Swing): Svg {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.suit ?? o.top ?? C.sky), leg = grey ? C.grey : (o.suit ?? o.leg ?? C.navy);
  const hair = grey ? C.grey : (o.hair ?? C.hair), shoe = grey ? C.grey : (o.shoe ?? C.white);
  const armCol = o.sleeves === true ? top : skin;
  const dark = 'rgba(0,0,0,0.2)';
  const limb = (from: Pt, j: [Pt, Pt], upper: string, lower: string, w: number, far: boolean, hl: boolean) => {
    const d1 = `M${from[0]} ${from[1]} L${j[0][0]} ${j[0][1]}`, d2 = `M${j[0][0]} ${j[0][1]} L${j[1][0]} ${j[1][1]}`;
    return all(line(d1 + ` L${j[1][0]} ${j[1][1]}`, ink, w + 2.4), line(d1, upper, w), line(d2, lower, w),
      far ? line(d1 + ` L${j[1][0]} ${j[1][1]}`, dark, w) : '', hl && !grey ? line(d1 + ` L${j[1][0]} ${j[1][1]}`, HL, w * 0.45) : '');
  };
  const legC = o.shorts ? skin : leg;
  const footEl = (j: [Pt, Pt]) => o.suit && o.hs === 'swimcap' ? circle(j[1][0], j[1][1], 2.6, skin, ink, 1) : ellipse(j[1][0] + 1.5, j[1][1], 4.2, 2.6, shoe, ink, 1.1);
  const handEl = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 2.7, skin, ink, 1);
  const legEl = (j: [Pt, Pt], far: boolean) => all(limb(p.h, j, leg, legC, 5.2, far, !!o.hlLegs), footEl(j));
  const armEl = (j: [Pt, Pt], far: boolean) => all(limb(p.n, j, o.sleeves === false ? skin : (o.sleeves ? top : skin), armCol, 4.4, far, !!o.hlArms), handEl(j));
  const dur = sw?.dur ?? 0.7, L = sw?.leg ?? 0, A = sw?.arm ?? 0;
  const wrapLeg = (k: Svg, which: 'L' | 'R') => !sw || !L ? k : rock(`${sw.name}-l${which}`, p.h[0], p.h[1], which === 'R' ? L : -L, which === 'R' ? -L : L, dur, k);
  const wrapArm = (k: Svg, which: 'L' | 'R') => {
    if (!sw) return k;
    if (sw.armTurn) return turn(`${sw.name}-a${which}`, p.n[0], p.n[1], dur * 2, sw.armTurn === 'alt' && which === 'L' ? 180 : 0, k);
    return A ? rock(`${sw.name}-a${which}`, p.n[0], p.n[1], which === 'R' ? -A : A, which === 'R' ? A : -A, dur, k) : k;
  };
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const hd = (...k: Svg[]) => g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, ...k);
  const capC = grey ? C.grey : (o.capCol ?? C.red);
  const hairBack = o.hs === 'long' ? hd(path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2)) : '';
  const hairTop = o.hs === 'none' ? '' : hd(
    o.hs === 'bun' ? all(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2))
      : o.hs === 'cap' ? all(path('M-8.5 -1 C-8.5 -12 8.5 -12 8.5 -1 Z', capC, ink, 1.2), path('M4 -2 L14 -1 L8.5 -1 Z', capC, ink, 1.2))
        : o.hs === 'swimcap' ? path('M-8.6 1 C-9 -12 9 -12 8.6 1 C4 -2 -4 -2 -8.6 1 Z', capC, ink, 1.2)
          : o.hs === 'helmet' ? all(path('M-10 0 C-10 -13 10 -14 11 -2 L6 -1 C2 -4 -4 -4 -10 0 Z', capC, ink, 1.3), line('M-6 -8 L-2 -11 M0 -9 L4 -12', C.white, 1.2))
            : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = m === 'none' ? (o.goggles ? hd(rect(-6, -1.5, 12, 3.4, C.sky, 1.5, ink, 0.8)) : '') : hd(
    o.goggles ? rect(-6, -1.5, 12, 3.4, C.sky, 1.5, ink, 0.8) : all(circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null)),
    m === 'open' ? ellipse(0, 4.4, 1.9, 2.1, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.4, 1.3, '#c84a4a', ink, 0.8)
      : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'grit' ? all(rect(-3, 3, 6, 2.6, C.white, 0.8, ink, 0.8), line('M-3 4.3 L3 4.3', ink, 0.6)) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  const bib = o.bib ? g(`translate(${f1(p.n[0] + (p.h[0] - p.n[0]) * 0.45)} ${f1(p.n[1] + (p.h[1] - p.n[1]) * 0.45)}) rotate(${ang})`, rect(-4.6, -3.6, 9.2, 7.2, C.white, 1, ink, 0.8), num(0, 2.4, o.bib, 5.4)) : '';
  const vest = o.vest ? line(`M${f1(p.n[0] + (p.h[0] - p.n[0]) * 0.1)} ${f1(p.n[1] + (p.h[1] - p.n[1]) * 0.1)} L${f1(p.n[0] + (p.h[0] - p.n[0]) * 0.8)} ${f1(p.n[1] + (p.h[1] - p.n[1]) * 0.8)}`, o.vest, 12.6) : '';
  return at(x, y, s,
    hairBack,
    o.noArm === 'L' ? '' : wrapArm(armEl(p.aL, true), 'L'), wrapLeg(legEl(p.lL, true), 'L'),
    line(torso, ink, 14.4), line(torso, top, 12), vest, bib,
    wrapLeg(legEl(p.lR, false), 'R'), o.noArm === 'R' ? '' : wrapArm(armEl(p.aR, false), 'R'),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face, o.front ?? '');
}
// ── Poses ─────────────────────────────────────────────────────────────
/** Running, near (right) leg in support under the hip, far leg swinging behind, far arm forward. */
const RUN = pose({ h: [0, -42], n: [5, -67], aL: [[12, -56], [19, -63]], aR: [[-6, -57], [-3, -48]], lL: [[-5, -26], [-15, -31]], lR: [[5, -22], [2, -1]] });
/** Running in flight: near leg reaching forward, far leg pushing off behind. */
const FLY = pose({ h: [0, -45], n: [6, -70], aL: [[-6, -59], [-3, -50]], aR: [[13, -59], [20, -66]], lL: [[-5, -25], [-16, -14]], lR: [[11, -32], [10, -12]] });
/** Fast running: more lean, longer reach, high back heel. */
const SPRINT = pose({ h: [0, -44], n: [9, -68], aL: [[16, -57], [24, -66]], aR: [[-6, -58], [-6, -47]], lL: [[-7, -27], [-19, -34]], lR: [[13, -31], [14, -12]] });
const JOG = pose({ h: [0, -42], n: [3, -68], aL: [[9, -57], [15, -61]], aR: [[-4, -57], [0, -49]], lL: [[-3, -24], [-10, -23]], lR: [[4, -22], [3, -1]] });
const HANDS_KNEES = pose({ h: [-6, -40], n: [8, -58], aL: [[8, -46], [6, -26]], aR: [[10, -46], [9, -26]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] });
const ARMS_UP = pose({ h: [0, -43], n: [1, -69], aL: [[-6, -82], [-4, -95]], aR: [[9, -82], [8, -95]], lL: [[-6, -22], [-9, -2]], lR: [[5, -22], [7, -1]] });
const KNEEL = pose({ h: [-2, -24], n: [5, -48], aL: [[9, -36], [10, -24]], aR: [[2, -36], [5, -24]], lL: [[7, -3], [-12, -2]], lR: [[9, -4], [-9, -1]] });
const KNEE_UP = pose({ h: [0, -43], n: [1, -69], aL: [[10, -58], [16, -64]], aR: [[-6, -58], [-4, -49]], lL: [[-2, -22], [-3, -1]], lR: [[13, -46], [11, -27]] });
const RIDE = pose({ h: [-8, -37], n: [9, -56], aL: [[13, -47], [18, -38]], aR: [[14, -46], [19, -38]], lL: [[-2, -29], [-6, -17]], lR: [[5, -27], [3, -9]] });
const CRAWL = pose({ h: [-16, 0], n: [10, -1], aL: [[10, 9], [0, 13]], aR: [[17, -15], [29, -18]], lL: [[-28, 1], [-40, -1]], lR: [[-28, -2], [-40, -5]] });

// ── Settings and things ──────────────────────────────────────────────
const PARK = '#e3f0dc', SKY = '#e4f1f8', GYM = '#efeae2', POOL = '#5cb6d8', TRACK = '#c4583b', LAKE = '#4f8fb3';
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -6, 4, 6, C.brown, 1, null), path('M0 -32 L12 -6 L-12 -6 Z', '#3f7d4f', C.ink, 1.2), path('M0 -40 L8 -20 L-8 -20 Z', '#4f9d69', C.ink, 1.2));
const bush = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -6, 12, 7, '#6aa86a', C.ink, 1.1));
const cloud = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 4 C-14 -4 -4 -6 -2 -2 C0 -8 10 -8 10 -1 C16 -1 16 4 12 4 Z', C.white, null));
const speed = (x: number, y: number, n = 3, col: string = C.grey) => all(...range(n).map((i) => line(`M${x} ${y + i * 6} L${x - 12 + i * 3} ${y + i * 6}`, col, 1.8)));
const stone = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 C-9 -6 -3 -9 2 -8 C8 -7 10 -3 8 0 Z', '#a7a9ad', C.ink, 1.1));
const trackBand = (y: number, h = 20) => all(rect(0, y, 120, h, TRACK, 0, null), ...range(3).map((i) => line(`M0 ${f1(y + (h / 3) * (i + 1) - 0.5)} L120 ${f1(y + (h / 3) * (i + 1) - 0.5)}`, C.white, 1.2)), line(`M0 ${y} L120 ${y}`, C.white, 1.4));
/** Running shoe in side view, toe to the right. */
const shoe = (x: number, y: number, s = 1, col: string = C.orange, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M-22 4 C-24 -6 -18 -12 -10 -12 L-2 -12 C4 -6 12 -4 20 -2 C26 0 26 4 22 6 L-20 6 Z', col, C.ink, 1.8),
  path('M-24 6 L24 6 C24 10 20 11 16 11 L-20 11 C-24 11 -25 8 -24 6 Z', C.white, C.ink, 1.4), line('M-20 8.5 L20 8.5', C.grey2, 1),
  line('M-6 -10 L0 -5 M-3 -11 L3 -6 M0 -12 L6 -7', C.white, 1.4), path('M-10 -12 C-12 -18 -2 -18 -2 -12', 'none', C.ink, 1.4));
const dressShoe = (x: number, y: number, s = 1) => at(x, y, s, path('M-18 6 C-20 -4 -8 -6 0 -4 C10 -3 18 0 18 6 Z', C.black, C.ink, 1.6), path('M-18 6 L18 6 L18 9 L-18 9 Z', C.dark, C.ink, 1));
/** Wrist watch seen from the front; `screen` is drawn in local units around (0, 0). */
const watch = (x: number, y: number, s: number, screen: Svg, strap: string = C.dark) => at(x, y, s,
  rect(-9, -26, 18, 18, strap, 4, C.ink, 1.4), rect(-9, 8, 18, 18, strap, 4, C.ink, 1.4), rect(-14, -12, 28, 24, C.black, 6, C.ink, 1.8), rect(-11, -9, 22, 18, '#1f2d36', 4, null), screen);
const stopwatch = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-4, -26, 8, 6, C.silver, 1.5, C.ink, 1.2), line('M14 -16 L18 -20', C.ink, 3), circle(0, 0, 21, C.silver, C.ink, 2), circle(0, 0, 17, C.white, C.ink, 1.4),
  ...range(12).map((i) => { const a = (i * Math.PI) / 6; return line(`M${f1(Math.sin(a) * 14)} ${f1(-Math.cos(a) * 14)} L${f1(Math.sin(a) * 16)} ${f1(-Math.cos(a) * 16)}`, C.ink, 1.2); }));
const swHand = (name: string, x: number, y: number, s = 1) => at(x, y, s, waSpin(name, 2.4, line('M0 2 L0 -14', C.red, 2), line('M0 -14 L0 14', 'none', 0)), circle(0, 0, 2, C.ink, null));
/** Bicycle facing right; wheel bottoms at local y = 0. kind: road (drop bar, thin tyres), mtb (knobby tyres, suspension), spin (fixed, flywheel). */
function bike(x: number, y: number, s: number, kind: 'road' | 'mtb' | 'city', col: string = C.red, o: { crank?: string; hlTyre?: boolean; spinWheels?: string } = {}): Svg {
  const r = kind === 'mtb' ? 15 : 14, tw = kind === 'mtb' ? 4.4 : kind === 'road' ? 1.6 : 2.6;
  const wheel = (cx: number, nm?: string) => {
    const w = all(circle(cx, -r, r, 'none', C.ink, tw + 1.6), circle(cx, -r, r, 'none', o.hlTyre ? HL : C.dark, tw), circle(cx, -r, 2, C.grey, C.ink, 0.8),
      ...range(6).map((i) => { const a = (i * Math.PI) / 3; return line(`M${cx} ${-r} L${f1(cx + Math.cos(a) * (r - 2))} ${f1(-r + Math.sin(a) * (r - 2))}`, C.grey, 0.7); }),
      kind === 'mtb' ? all(...range(16).map((i) => { const a = (i * Math.PI) / 8; return circle(f1(cx + Math.cos(a) * (r + 1.6)), f1(-r + Math.sin(a) * (r + 1.6)), 0.9, C.dark, null); })) : '');
    return nm ? waSpin(nm, 0.8, w) : w;
  };
  const bx = -20, fx = 21, cr: Pt = [-2, -r], seat: Pt = [-9, -34], head: Pt = [15, -35];
  const frameD = `M${bx} ${-r} L${cr[0]} ${cr[1]} L${seat[0] + 1} ${seat[1] + 3} Z M${cr[0]} ${cr[1]} L${head[0]} ${head[1] + 3} L${seat[0] + 1} ${seat[1] + 3} M${head[0]} ${head[1] + 3} L${fx} ${-r}`;
  const bar = kind === 'road' ? path(`M${head[0]} ${head[1]} L${head[0] + 5} ${head[1]} C${head[0] + 10} ${head[1]} ${head[0] + 10} ${head[1] + 9} ${head[0] + 4} ${head[1] + 8}`, 'none', C.ink, 2.2)
    : line(`M${head[0]} ${head[1] + 1} L${head[0] + 2} ${head[1] - 3} L${head[0] + 7} ${head[1] - 3}`, C.ink, 2.4);
  const fork = kind === 'mtb' ? all(rect(head[0] + 0.5, head[1] + 6, 4, 10, C.dark, 1.5, C.ink, 0.8)) : '';
  const crank = o.crank ? waSpin(o.crank, 1.1, line(`M${cr[0] - 6} ${cr[1] - 3} L${cr[0] + 6} ${cr[1] + 3}`, C.ink, 2.2), rect(cr[0] + 4, cr[1] + 2, 5, 2.4, C.dark, 0.6, null), rect(cr[0] - 9, cr[1] - 4.4, 5, 2.4, C.dark, 0.6, null))
    : all(line(`M${cr[0] - 6} ${cr[1] - 3} L${cr[0] + 6} ${cr[1] + 3}`, C.ink, 2.2), rect(cr[0] + 4, cr[1] + 2, 5, 2.4, C.dark, 0.6, null), rect(cr[0] - 9, cr[1] - 4.4, 5, 2.4, C.dark, 0.6, null));
  return at(x, y, s, wheel(bx, o.spinWheels ? o.spinWheels + 'b' : undefined), wheel(fx, o.spinWheels ? o.spinWheels + 'f' : undefined),
    line(frameD, C.ink, kind === 'mtb' ? 5.2 : 4.2), line(frameD, col, kind === 'mtb' ? 3.4 : 2.4), fork, line(`M${seat[0] + 1} ${seat[1] + 3} L${seat[0]} ${seat[1]}`, C.ink, 2),
    path(`M${seat[0] - 6} ${seat[1]} L${seat[0] + 5} ${seat[1] - 1} L${seat[0] + 4} ${seat[1] + 1.6} L${seat[0] - 5} ${seat[1] + 2} Z`, C.black, C.ink, 1), bar,
    circle(cr[0], cr[1], 4, C.silver, C.ink, 1), crank);
}
/** Spinning bike (stationary) facing right; floor at local y = 0. */
const spinBike = (x: number, y: number, s: number, o: { crank?: string; hlKnob?: boolean; col?: string } = {}) => at(x, y, s,
  rect(-26, -4, 22, 4, C.dark, 2, C.ink, 1.2), rect(6, -4, 22, 4, C.dark, 2, C.ink, 1.2),
  path('M-16 -4 L-8 -30 M18 -4 L12 -36 M-8 -30 L12 -30', 'none', C.ink, 5), path('M-16 -4 L-8 -30 M18 -4 L12 -36 M-8 -30 L12 -30', 'none', o.col ?? C.silver, 3.2),
  circle(17, -16, 11, C.dark, C.ink, 1.6), circle(17, -16, 7, C.grey, C.ink, 1), circle(17, -16, 2, C.ink, null),
  line('M-8 -30 L-9 -38', C.ink, 2.2), path('M-15 -38 L-3 -39 L-4 -36.5 L-14 -36 Z', C.black, C.ink, 1),
  line('M12 -36 L14 -44 L20 -44', C.ink, 2.6), circle(3, -33, 3.2, o.hlKnob ? HL : C.red, C.ink, 1),
  circle(2, -16, 3.6, C.silver, C.ink, 1),
  o.crank ? waSpin(o.crank, 1.1, line('M-4 -19 L8 -13', C.ink, 2.2), rect(6, -14, 5, 2.4, C.dark, 0.6, null), rect(-7, -20.4, 5, 2.4, C.dark, 0.6, null))
    : all(line('M-4 -19 L8 -13', C.ink, 2.2), rect(6, -14, 5, 2.4, C.dark, 0.6, null), rect(-7, -20.4, 5, 2.4, C.dark, 0.6, null)));
/** Water band with ripples and lane ropes. */
const water = (y: number, col: string = POOL, lanes = true) => all(rect(0, y, 120, 120 - y, col, 0, null), path(`M0 ${y} q5 -2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0`, 'none', '#bfe6f4', 1.6),
  lanes ? all(...[y + 24, y + 2 + (120 - y) * 0.75].filter((v) => v < 118).map((ly) => all(...range(13).map((i) => circle(i * 10 + 4, ly, 2, i % 2 ? C.red : C.white, C.ink, 0.6))))) : '');
const splash = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 C-6 -6 -2 -8 0 -12 C2 -8 6 -6 6 0', 'none', C.white, 1.6), circle(-8, -5, 1.4, C.white, null), circle(8, -6, 1.2, C.white, null));
const bubbles = (x: number, y: number) => all(circle(x, y, 1.6, 'none', C.white, 1), circle(x + 4, y - 4, 1.2, 'none', C.white, 1), circle(x + 1, y - 8, 0.9, 'none', C.white, 1));
const checkered = (x: number, y: number, w: number, h: number, n = 8) => all(rect(x, y, w, h, C.white, 0, C.ink, 1), ...range(n).flatMap((i) => range(2).map((j) => ((i + j) % 2 ? rect(f1(x + (i * w) / n), f1(y + (j * h) / 2), f1(w / n), f1(h / 2), C.black, 0, null) : ''))));
/** Finish/start arch over the road. */
const arch = (x0: number, x1: number, top: number, col: string = C.navy, chk = true) => all(rect(x0, top, 6, 112 - top, col, 1, C.ink, 1.2), rect(x1 - 6, top, 6, 112 - top, col, 1, C.ink, 1.2), rect(x0, top, x1 - x0, 12, col, 2, C.ink, 1.4), chk ? checkered(x0 + 8, top + 2.5, x1 - x0 - 16, 7) : '');
const medalEl = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M-8 -30 L-2 -6 L2 -6 L-4 -30 Z', C.denim, C.ink, 1), path('M8 -30 L2 -6 L-2 -6 L4 -30 Z', C.red, C.ink, 1), circle(0, 4, 11, col, C.ink, 1.6), circle(0, 4, 7.5, 'none', '#b8862a', 1.2), star(0, 4, 4.5, '#fff1b8'));
const cup = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-4 -8 L4 -8 L3 2 L-3 2 Z', col, C.ink, 1), ellipse(0, -8, 4, 1.2, '#bfe6f4', C.ink, 0.6));
const kmSign = (x: number, y: number, n: string, s = 1, col: string = C.white) => at(x, y, s, line('M0 0 L0 -16', C.dark, 2), rect(-9, -28, 18, 12, col, 2, C.ink, 1.2), num(0, -19, n, 8));
const road = (y: number, h = 14) => all(rect(0, y, 120, h, '#8d9097', 0, null), line(`M0 ${f1(y + h / 2)} L120 ${f1(y + h / 2)}`, C.white, 1.4, '6 6'));
const gauge = (x: number, y: number, s: number, deg: number, o: { name?: string; from?: number; grey?: boolean; mark?: number } = {}) => {
  const segs = [['#6fb3e0', -90, -54], ['#7cc576', -54, -18], ['#f2c14e', -18, 18], ['#ef8a3c', 18, 54], ['#d64545', 54, 90]] as const;
  const arc = (a0: number, a1: number, col: string) => { const r = 20, p0 = [Math.sin((a0 * Math.PI) / 180) * r, -Math.cos((a0 * Math.PI) / 180) * r], p1 = [Math.sin((a1 * Math.PI) / 180) * r, -Math.cos((a1 * Math.PI) / 180) * r]; return path(`M${f1(p0[0]!)} ${f1(p0[1]!)} A${r} ${r} 0 0 1 ${f1(p1[0]!)} ${f1(p1[1]!)}`, 'none', col, 7); };
  const needle = g(`rotate(${deg})`, path('M-2 0 L0 -18 L2 0 Z', C.ink, C.ink, 0.8));
  const k = all(...segs.map(([c, a0, a1]) => arc(a0, a1, c)),
    o.mark !== undefined ? g(`rotate(${o.mark})`, line('M0 -26 L0 -13', C.ink, 1.6, '2 2')) : '',
    o.name ? moving(o.name, `0%{transform:rotate(${o.from ?? -80}deg)}60%,100%{transform:rotate(0deg)}`, { dur: 2.4 }, needle) : needle, circle(0, 0, 3, C.ink, null));
  return at(x, y, s, o.grey ? greyed(k) : k);
};
const bubble = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x + 10} ${y + h} L${x + 4} ${y + h + 6} L${x + 5} ${y + h} L${x} ${y + h} Z`, C.white, C.ink, 1.2), ...k);
const puff = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C4 -4 10 -2 10 2 C14 2 14 8 9 8 C6 11 0 10 0 6 C-4 6 -4 0 0 0 Z', '#e8f2f8', C.ink, 0.9));
const sweat = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -4 C3 0 3 3 0 3 C-3 3 -3 0 0 -4 Z', '#8cc7e8', C.ink, 0.7));
const flag = (x: number, y: number, col: string = C.green, s = 1) => at(x, y, s, line('M0 0 L0 -24', C.dark, 1.8), path('M0 -24 L14 -20 L0 -15 Z', col, C.ink, 1));
const cone = (x: number, y: number) => all(path(`M${x - 5} ${y} L${x} ${y - 11} L${x + 5} ${y} Z`, C.orange, C.ink, 1), line(`M${x - 2.6} ${y - 5} L${x + 2.6} ${y - 5}`, C.white, 1.4));
const footprint = (x: number, y: number, s = 1, col: string = C.dark, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ellipse(0, -3, 2.6, 4.4, col, null), ellipse(0, 3.6, 2, 2.4, col, null));
const lungs = (x: number, y: number, s = 1, col: string = '#f2a3a3') => at(x, y, s, line('M0 -18 L0 -6 M0 -6 L-6 0 M0 -6 L6 0', C.ink, 2), path('M-4 -8 C-16 -10 -22 4 -20 14 C-18 20 -8 20 -4 14 Z', col, C.ink, 1.4), path('M4 -8 C16 -10 22 4 20 14 C18 20 8 20 4 14 Z', col, C.ink, 1.4));
const ecg = (x: number, y: number, w: number, col: string = C.red) => line(`M${x} ${y} L${x + w * 0.2} ${y} L${x + w * 0.26} ${y - 4} L${x + w * 0.32} ${y + 3} L${x + w * 0.38} ${y - 14} L${x + w * 0.44} ${y + 8} L${x + w * 0.5} ${y} L${x + w * 0.7} ${y} L${x + w * 0.76} ${y - 4} L${x + w * 0.82} ${y + 3} L${x + w * 0.88} ${y - 14} L${x + w * 0.94} ${y + 8} L${x + w} ${y}`, col, 1.8);
const swimmerHead = (x: number, y: number, col: string = C.yellow, s = 1) => at(x, y, s, circle(0, 0, 6, C.skin, C.ink, 1.2), path('M-6.2 0 C-6.4 -8 6.4 -8 6.2 0 Z', col, C.ink, 1), rect(-4.6, -1.2, 9.2, 2.6, C.sky, 1, C.ink, 0.6), path('M-10 4 q5 -3 10 0 t10 0', 'none', C.white, 1.2));
const buoy = (x: number, y: number) => all(path(`M${x - 6} ${y} L${x} ${y - 16} L${x + 6} ${y} Z`, C.orange, C.ink, 1.2), path(`M${x - 8} ${y} q4 -2 8 0 t8 0`, 'none', C.white, 1.2));
const board = (x: number, y: number, s = 1, col: string = '#5fb0e8', rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-16 -6 C-16 -12 -10 -12 -6 -12 L14 -12 C18 -12 20 -9 20 -6 L20 6 C20 9 18 12 14 12 L-6 12 C-10 12 -16 12 -16 6 Z', col, C.ink, 1.6), path('M-8 -12 C-12 -8 -12 8 -8 12', 'none', '#3d8fcc', 1.4), circle(12, -6, 1.6, '#3d8fcc', null), circle(12, 6, 1.6, '#3d8fcc', null));
const calCell = (x: number, y: number, w: number, h: number, fill: string = C.white) => rect(x, y, w, h, fill, 2, C.ink, 1);

// ── Swimmers drawn one by one (each stroke in its own characteristic poster position) ──
const SUIT = C.navy, CAPC = C.red;
/** Thick limb with outline: a polyline through the points. */
const limbL = (pts: Pt[], col: string, w = 5.2) => { const d = 'M' + pts.map((q) => `${q[0]} ${q[1]}`).join(' L'); return all(line(d, C.ink, w + 2.4), line(d, col, w)); };
const handAt = (q: Pt) => circle(q[0], q[1], 2.9, C.skin, C.ink, 1);
const footAt = (q: Pt) => circle(q[0], q[1], 2.7, C.skin, C.ink, 1);
/** Head in profile facing `dir` (deg: 0 = right, -90 = up), cap at the back, goggles. */
const profileHead = (x: number, y: number, dir: number, cap: string = CAPC) => g(`translate(${x} ${y}) rotate(${dir})`,
  circle(0, 0, 8, C.skin, C.ink, 1.6), path('M-8 2 C-9 -9 4 -10 5 -7 C1 -6 -2 -2 -1 5 C-4 7 -7 6 -8 2 Z', cap, C.ink, 1.1),
  path('M7.6 -1 L10.4 1 L7.6 2.6', 'none', C.ink, 1.1), rect(2.4, -4.6, 4.6, 3, C.sky, 1, C.ink, 0.7), path('M4 4.4 Q6 5.4 7.4 4.4', 'none', C.ink, 0.9));
const underwater = (y: number) => rect(0, y, 120, 120 - y, 'rgba(92,182,216,0.5)', 0, null);

export const ENDUR_MOTIFS: Record<string, Svg> = {
  // ── 4621 Jogging och distanslöpning ────────────────────────────────
  // springa: a man in work clothes runs to catch the bus (both feet off the ground, limbs swing)
  'endur.springa': all(bg(SKY), cloud(26, 20), rect(0, 96, 120, 24, '#bfc3c9', 0, null), ground(96, C.grey),
    rect(78, 52, 40, 32, C.yellow, 4, C.ink, 1.6), rect(82, 56, 8, 10, '#bfe3f5', 1, C.ink, 1), rect(93, 56, 8, 10, '#bfe3f5', 1, C.ink, 1), rect(104, 56, 8, 10, '#bfe3f5', 1, C.ink, 1), circle(88, 86, 5, C.dark, C.ink, 1.2), circle(110, 86, 5, C.dark, C.ink, 1.2),
    line('M70 96 L70 56', C.dark, 2), rect(65, 50, 10, 8, C.green, 1.5, C.ink, 1),
    waBob('endur-springa-b', 2, fig(40, 96, 0.82, FLY, { top: C.white, leg: C.dark, shoe: C.black, sleeves: true, mouth: 'open' }, { name: 'endur-springa', leg: 18, arm: 22, dur: 0.6 })), speed(16, 50, 3)),
  // löpning: running as an activity – people in sports clothes running along a park path
  'endur.löpning': all(bg(PARK), tree(14, 70, 0.9), tree(104, 66, 0.8), bush(60, 70, 1.2), path('M0 112 C30 96 80 96 120 84 L120 98 C84 108 40 110 0 120 Z', '#d8c39a', C.ink, 1),
    fig(30, 108, 0.62, RUN, { top: C.pink, leg: C.dark, shorts: true, hs: 'bun', shoe: C.orange }), fig(64, 101, 0.56, FLY, { top: C.green, leg: C.navy, shorts: true, shoe: C.sky }), fig(96, 94, 0.5, RUN, { top: C.yellow, leg: C.dark, shorts: true, hs: 'long', shoe: C.white }),
    frame(4, 40, 112, 76)),
  // löpa: running in a race (sport) on the track, swinging limbs
  'endur.löpa': all(bg(SKY), rect(0, 60, 120, 30, '#9ec98a', 0, null), trackBand(90, 30),
    fig(58, 108, 0.86, FLY, { top: C.red, leg: C.red, shorts: true, shoe: C.yellow, bib: '7' }, { name: 'endur-lopa', leg: 18, arm: 22, dur: 0.55 }), speed(28, 58, 3)),
  // löpare: the person – a runner (orange ring) among grey people who walk
  'endur.löpare': all(bg(PARK), path('M0 108 L120 100 L120 120 L0 120 Z', '#d8c39a', null), ground(112),
    greyed(fig(20, 112, 0.6, STAND), fig(102, 110, 0.6, pose({ lL: [[-5, -21], [-8, -1]], lR: [[5, -21], [8, -1]] }), { hs: 'long' })),
    fig(62, 108, 0.8, RUN, { top: C.orange, leg: C.dark, shorts: true, shoe: C.sky, hs: 'cap', capCol: C.navy }), ring(64, 70, 34)),
  // löprunda: a loop from home round the lake and back (map seen from above)
  'endur.löprunda': all(bg('#e8f1df'), ellipse(64, 60, 30, 18, LAKE, C.ink, 1.4), tree(18, 34, 0.5), tree(100, 30, 0.5), tree(104, 96, 0.5),
    path('M22 96 L16 88 L22 82 L28 88 L28 96 Z', C.red, C.ink, 1.2), path('M16 88 L22 80 L28 88', 'none', C.ink, 1.2),
    line('M28 92 C40 100 92 100 100 78 C108 56 100 32 70 30 C40 28 24 40 20 60 C18 72 22 80 22 82', HL, 2.6, '5 4'), arrow(98, 86, 101, 76, HL, 2.4), arrow(40, 31, 34, 34, HL, 2.4),
    fig(68, 100, 0.26, RUN, { top: C.orange, shorts: true })),
  // distanslöpning: a long road to the horizon with kilometre signs; a lone runner
  'endur.distanslöpning': all(bg(SKY), rect(0, 54, 120, 66, '#a8cf8a', 0, null), path('M56 54 L64 54 L104 120 L16 120 Z', '#8d9097', C.ink, 1.2), line('M60 56 L60 118', C.white, 1.4, '6 6'),
    kmSign(78, 62, '30', 0.45), kmSign(90, 80, '20', 0.7), kmSign(104, 108, '10', 1), tree(20, 66, 0.4), tree(30, 60, 0.3),
    fig(50, 106, 0.5, RUN, { top: C.sky, leg: C.dark, shorts: true }), line('M60 54 L60 46', HL, 1.6), arrow(70, 112, 62, 58, HL, 2)),
  // långpass: a week of training – Sunday has by far the longest bar (orange), with the runner on it
  'endur.långpass': all(bg('#f6f1e6'), ...range(7).map((i) => {
    const hgt = [18, 0, 22, 0, 16, 0, 64][i]!, x = 10 + i * 15;
    return all(calCell(x, 30, 12, 82, C.white), hgt ? rect(x + 2, 110 - hgt, 8, hgt, i === 6 ? HL : C.grey2, 1.5, C.ink, 1) : circle(x + 6, 104, 2.4, C.grey2, null));
  }), ...range(7).map((i) => rect(10 + i * 15, 22, 12, 8, i === 6 ? C.red : C.dark, 1.5, C.ink, 0.8)), fig(106, 44, 0.24, RUN, { top: C.orange, shorts: true }), frame(98, 18, 20, 96)),
  // löparsko: the running shoe (object) – a grey dress shoe for contrast
  'endur.löparsko': all(bg('#eef3f7'), ground(104), greyed(dressShoe(26, 98, 0.8)), shoe(72, 92, 1.5, C.orange), ring(72, 86, 30)),
  // kilometertid: the time for one kilometre – between two kilometre posts, the watch shows minutes and seconds
  'endur.kilometertid': all(bg(SKY), road(92, 16), kmSign(14, 92, '4', 0.9), kmSign(106, 92, '5', 0.9), line('M14 70 L106 70', HL, 2), arrow(60, 70, 104, 70, HL, 2.2), arrow(60, 70, 16, 70, HL, 2.2),
    fig(60, 104, 0.5, RUN, { top: C.sky, shorts: true }), watch(60, 34, 0.9, num(0, 4, '5:30', 9, '#9ff3c0')), frame(36, 14, 48, 40)),
  // flås: stamina (informal) – the coloured runner reaches the top easily; the grey one behind is out of breath
  'endur.flås': all(bg(SKY), path('M0 116 L64 82 L120 82 L120 120 L0 120 Z', '#a8cf8a', C.ink, 1.2),
    greyed(fig(26, 106, 0.5, HANDS_KNEES, { mouth: 'open' }), puff(40, 70, 0.6)),
    fig(86, 82, 0.66, RUN, { top: C.orange, shorts: true }, { name: 'endur-flas', leg: 16, arm: 20, dur: 0.6 }), waPulse('endur-flas-l', lungs(104, 30, 0.6, HL)), sparkle(60, 24, 4, HL)),
  // ── 4622 Intervaller ───────────────────────────────────────────────
  // intervall (training): hard bouts (orange blocks) with rests between, run on the track with a stopwatch
  'endur.intervall.3': all(bg('#f6f1e6'), trackBand(96, 24), stopwatch(104, 20, 0.5),
    ...range(4).map((i) => all(rect(8 + i * 28, 34, 14, 40, HL, 2, C.ink, 1.2), i < 3 ? rect(22 + i * 28, 62, 14, 12, C.grey2, 2, C.ink, 1) : '')), line('M6 74 L114 74', C.ink, 1.4),
    fig(60, 112, 0.42, SPRINT, { top: C.orange, shorts: true }, { name: 'endur-int3', leg: 18, arm: 22, dur: 0.45 })),
  // fartlek: in the forest, fast to the stone (orange) and easy after it (grey) – no clock, the runner decides
  'endur.fartlek': all(bg(PARK), tree(14, 70, 0.8), tree(96, 62, 0.7), tree(112, 72, 0.6), bush(72, 74, 1),
    path('M0 100 C30 92 70 104 120 94 L120 112 C70 120 30 110 0 116 Z', '#d8c39a', C.ink, 1), stone(70, 104, 1.1),
    line('M8 108 C24 102 40 104 62 106', HL, 3.6), line('M78 106 C90 104 102 102 116 102', C.grey, 1.8, '3 3'),
    fig(42, 106, 0.56, SPRINT, { top: C.green, shorts: true }, { name: 'endur-fartlek', leg: 18, arm: 22, dur: 0.45 }), speed(24, 66, 3),
    fig(98, 103, 0.4, JOG, { top: C.green, shorts: true })),
  // backintervall: fast up the hill (orange arrow), easy back down (grey arrow); the runner climbs
  'endur.backintervall': all(bg(SKY), path('M0 112 L104 44 L120 44 L120 120 L0 120 Z', '#a8cf8a', C.ink, 1.2),
    arrow(14, 88, 82, 42, HL, 3), line('M96 60 L34 100', C.grey, 2, '4 3'), path('M34 100 L42 99 L38 94 Z', C.grey, null),
    moving('endur-backint', '0%{transform:translate(-26px,17px)}100%{transform:translate(8px,-5px)}', { dur: 2.2 }, fig(56, 76, 0.5, SPRINT, { top: C.red, shorts: true }, { name: 'endur-backint-f', leg: 16, arm: 20, dur: 0.45 }))),
  // joggvila: between two hard bouts (grey runner far behind) the runner jogs calmly – a pause sign in the bubble
  'endur.joggvila': all(bg(SKY), rect(0, 60, 120, 36, '#9ec98a', 0, null), trackBand(96, 24),
    greyed(fig(18, 106, 0.42, SPRINT)), fig(64, 108, 0.62, JOG, { top: C.mint, leg: C.dark, shorts: true }, { name: 'endur-joggvila', leg: 9, arm: 10, dur: 0.9 }),
    bubble(80, 18, 30, 20, rect(89, 22, 4, 12, C.green, 1, null), rect(97, 22, 4, 12, C.green, 1, null)), ring(64, 74, 30)),
  // tidtagarur: the stopwatch – a thumb presses the button and the hand runs
  'endur.tidtagarur': all(bg('#eef3f7'), stopwatch(58, 68, 1.7), swHand('endur-tidtagarur', 58, 68, 1.7),
    path('M50 14 C52 6 62 4 66 10 L68 20 C64 24 54 24 50 20 Z', C.skin, C.ink, 1.4), ring(58, 68, 42)),
  // stegringslopp: one short run where the speed grows all the way (the wedge widens, the runner speeds up)
  'endur.stegringslopp': all(bg(SKY), trackBand(96, 24), path('M6 112 L114 104 L114 118 Z', HL, C.ink, 1),
    greyed(fig(20, 102, 0.46, JOG), fig(46, 102, 0.48, RUN)),
    moving('endur-stegr', '0%{transform:translate(-56px,0);opacity:.3}100%{transform:translate(0,0);opacity:1}', { dur: 2.2 }, fig(84, 102, 0.54, SPRINT, { top: C.orange, shorts: true })), speed(64, 60, 3, HL)),
  // löparbana: the running track of a sports ground seen from above, red lanes round a green field
  'endur.löparbana': all(bg('#cfe3c4'), rect(6, 22, 108, 78, TRACK, 39, C.ink, 1.6),
    ...[1, 2, 3].map((i) => rect(6 + i * 5, 22 + i * 5, 108 - i * 10, 78 - i * 10, 'none', 39 - i * 5, C.white, 1)), rect(26, 42, 68, 38, '#7cbf6a', 19, C.white, 1.6),
    line('M60 22 L60 42', C.white, 2.4), circle(30, 30, 2.6, C.yellow, C.ink, 0.8), circle(36, 92, 2.6, C.sky, C.ink, 0.8), circle(96, 33, 2.6, C.pink, C.ink, 0.8)),
  // ta ut sig: after the last bout the runner sinks to the knees; the battery is empty
  'endur.ta-ut-sig': all(bg(SKY), trackBand(98, 22),
    moving('endur-taut', '0%{transform:translate(0,-14px)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, fig(52, 106, 0.82, KNEEL, { top: C.orange, shorts: true, mouth: 'open' })),
    sweat(68, 40), sweat(42, 44), puff(70, 48, 0.6),
    at(96, 28, 1, rect(-14, -8, 26, 16, C.white, 3, C.ink, 1.6), rect(12, -3, 3, 6, C.ink, 1, null), waPulse('endur-taut-b', rect(-11, -5, 5, 10, C.red, 1, null)))),
  // pressa sig: teeth clenched, leaning into the wind, still pushing forward (orange arrow); the grey runner drops back
  'endur.pressa-sig': all(bg(SKY), road(98, 22), greyed(fig(20, 108, 0.52, JOG, { mouth: 'open' })),
    waShake('endur-pressa', fig(64, 108, 0.82, SPRINT, { top: C.red, shorts: true, mouth: 'grit' }, { name: 'endur-pressa-f', leg: 18, arm: 22, dur: 0.45 })),
    arrow(84, 30, 112, 30, HL, 3.4), sweat(80, 22), sweat(92, 40), ...range(3).map((i) => line(`M114 ${56 + i * 9} L100 ${56 + i * 9}`, C.grey, 1.6))),
  // flåsa: hands on the knees, mouth open, the breath puffs out again and again
  'endur.flåsa': all(bg(PARK), ground(), waBob('endur-flasa', 1.6, fig(50, 112, 1, HANDS_KNEES, { top: C.purple, shorts: true, mouth: 'open' })),
    moving('endur-flasa-p', '0%{transform:scale(.4);opacity:0}50%{opacity:1}100%{transform:scale(1.1);opacity:0}', { dur: 1, spin: true }, puff(76, 36, 1.2)), sweat(64, 30), sweat(46, 34)),

  // ── 4623 Löpningens teknik ─────────────────────────────────────────
  // löpteknik: a runner with good form – head, hip and foot in line (dashed), knee over the foot, elbows bent
  'endur.löpteknik': all(bg('#eef3f7'), ground(), fig(56, 112, 1.1, RUN, { top: C.sky, shorts: true }), line('M67 14 L56 112', HL, 1.8, '4 3'),
    path('M74 50 A8 8 0 0 0 70 42', 'none', HL, 2), path('M50 54 A7 7 0 0 1 55 48', 'none', HL, 2),
    at(100, 26, 1, circle(0, 0, 11, C.white, C.green, 2.4), line('M-5 0 L-1 4 L6 -4', C.green, 2.6))),
  // steglängd: how far one step reaches – the double arrow between two footprints
  'endur.steglängd.2': all(bg('#f2ede2'), rect(0, 88, 120, 32, '#e2d3b5', 0, null), footprint(22, 104, 1.3, C.dark, 90), footprint(98, 98, 1.3, C.dark, 90),
    line('M22 96 L22 116 M98 90 L98 116', HL, 1.4, '2 2'), arrow(60, 112, 94, 112, HL, 2.4), arrow(60, 112, 26, 112, HL, 2.4), fig(60, 84, 0.62, FLY, { top: C.orange, shorts: true })),
  // stegfrekvens: many short, quick steps in a minute (orange, top) against few long steps (grey, bottom)
  'endur.stegfrekvens': all(bg('#f6f1e6'), stopwatch(16, 20, 0.45), swHand('endur-stegf-h', 16, 20, 0.45),
    ...range(8).map((i) => footprint(30 + i * 11, 34 + (i % 2 ? 4 : -4), 0.9, HL, 90)), line('M26 48 L116 48', C.ink, 1),
    greyed(...range(4).map((i) => footprint(30 + i * 26, 84 + (i % 2 ? 4 : -4), 0.9, C.dark, 90)), line('M26 98 L116 98', C.ink, 1)),
    waPulse('endur-stegf', ring(16, 20, 13)), frame(22, 18, 96, 36)),
  // hälisättning: the heel touches the ground first (orange), toe still up
  'endur.hälisättning': all(bg('#eef3f7'), rect(0, 96, 120, 24, '#cdb89a', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    path('M28 4 L41 1 L61 58 L49 63 Z', C.navy, C.ink, 1.6), ellipse(55, 62, 7, 5, C.skin, C.ink, 1.2),
    shoe(66, 74, 1.3, C.sky, -18), ring(43, 94, 10), line('M33 104 L29 110 M43 104 L43 112 M53 104 L57 110', HL, 1.8)),
  // framfotslöpning: the front of the foot touches the ground first (orange), heel still up
  'endur.framfotslöpning': all(bg('#eef3f7'), rect(0, 96, 120, 24, '#cdb89a', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    path('M46 2 L59 2 L61 55 L49 57 Z', C.navy, C.ink, 1.6), ellipse(56, 57, 7, 5, C.skin, C.ink, 1.2),
    shoe(60, 74, 1.3, C.sky, 16), ring(86, 94, 10), line('M76 104 L72 110 M86 104 L86 112 M96 104 L100 110', HL, 1.8)),
  // armpendling: the arms swing forward and back along the body (orange arms, arcs with arrows)
  'endur.armpendling': all(bg('#eef3f7'), ground(), fig(54, 112, 1.1, RUN, { top: C.sky, shorts: true, hlArms: true }, { name: 'endur-armp', arm: 26, dur: 0.7 }),
    path('M38 58 A26 26 0 0 0 86 54', 'none', HL, 2), arrow(82, 60, 88, 50, HL, 2.2), arrow(42, 62, 36, 52, HL, 2.2)),
  // knälyft: running on the spot with the knee lifted to hip height (orange legs, arrow up)
  'endur.knälyft': all(bg(PARK), ground(), cone(14, 112), cone(106, 112),
    fig(56, 112, 1, KNEE_UP, { top: C.green, shorts: true, hlLegs: true }, { name: 'endur-knalyft', leg: 20, arm: 22, dur: 0.5 }), arrow(90, 84, 90, 62, HL, 2.6), line('M58 69 L90 69', HL, 1.2, '3 3')),
  // löpskolning: drills on a straight between cones – knee lifts, heel to the seat, short steps; the coach watches
  'endur.löpskolning': all(bg(PARK), rect(0, 96, 120, 24, '#9ec98a', 0, null), ...[10, 40, 70, 100].map((x) => cone(x, 112)),
    fig(24, 110, 0.56, KNEE_UP, { top: C.yellow, shorts: true }), fig(54, 110, 0.56, pose({ h: [0, -44], n: [2, -70], aL: [[9, -60], [14, -66]], aR: [[-5, -60], [-3, -51]], lL: [[-2, -22], [-2, -3]], lR: [[4, -27], [-8, -36]] }), { top: C.pink, shorts: true, hs: 'bun' }),
    fig(84, 110, 0.56, JOG, { top: C.sky, shorts: true }), greyed(fig(108, 80, 0.4, STAND, { hs: 'cap' })), frame(4, 50, 112, 66)),
  // löpanalys: in the shoe shop the runner is filmed from behind on a treadmill; the screen shows the legs
  'endur.löpanalys': all(bg(GYM), rect(0, 106, 120, 14, '#c9b79a', 0, null), path('M50 106 L112 100 L114 106 L52 110 Z', C.dark, C.ink, 1.2), line('M108 100 L104 64', C.ink, 3),
    fig(80, 103, 0.62, RUN, { top: C.purple, shorts: true }, { name: 'endur-lopan', leg: 14, arm: 18, dur: 0.6 }),
    line('M20 106 L26 76 M32 106 L26 76 M26 106 L26 76', C.ink, 1.6), rect(16, 66, 20, 12, C.dark, 2, C.ink, 1.2), circle(36, 72, 4, C.grey, C.ink, 1), path('M38 70 L62 60 L62 84 Z', 'rgba(255,240,180,0.45)', null),
    rect(8, 14, 44, 32, C.black, 3, C.ink, 1.4), rect(11, 17, 38, 26, '#1f2d36', 2, null), line('M24 20 L26 30 L24 40 M34 20 L32 30 L34 40', '#9ff3c0', 1.6), line('M20 30 L40 30', HL, 1, '2 2'), frame(6, 12, 48, 36)),
  // pronation: the foot rolls slightly inwards after landing (seen from behind; grey = straight reference)
  'endur.pronation': all(bg('#eef3f7'), rect(0, 100, 120, 20, '#cdb89a', 0, null), line('M0 100 L120 100', C.ink, 1.4),
    greyed(rect(24, 30, 12, 50, C.navy, 3, C.ink, 1.2), rect(23, 78, 14, 8, C.skin, 3, C.ink, 1), rect(18, 84, 24, 16, C.sky, 5, C.ink, 1.4)),
    rock('endur-pron', 82, 98, 0, 9, 1.6, g('rotate(9 82 98)', rect(76, 30, 12, 50, C.navy, 3, C.ink, 1.2), rect(75, 78, 14, 8, C.skin, 3, C.ink, 1), rect(70, 84, 24, 16, C.sky, 5, C.ink, 1.4))),
    path('M100 56 C108 66 106 80 96 88', 'none', HL, 2.4), path('M96 88 L104 86 L99 80 Z', HL, null), line('M82 20 L82 100', HL, 1.2, '3 3')),

  // ── 4624 Pulsträning ───────────────────────────────────────────────
  // pulsklocka: the watch on the wrist shows a heart and the pulse in digits
  'endur.pulsklocka': all(bg('#eef3f7'), path('M0 64 L120 52 L120 84 L0 96 Z', C.skin, C.ink, 1.6),
    watch(60, 70, 1.5, all(waPulse('endur-pulsklocka', heart(-5, -2, 0.42, C.red)), num(4, 4, '142', 7, '#9ff3c0'))), ring(60, 70, 30)),
  // pulsband: the strap round the chest (orange) sends the pulse wirelessly to the watch
  'endur.pulsband': all(bg('#eef3f7'), path('M20 120 C20 80 34 62 60 62 C86 62 100 80 100 120 Z', C.skin, C.ink, 1.6), circle(60, 40, 18, C.skin, C.ink, 1.6),
    path('M42 34 C42 20 78 20 78 34 C72 28 48 28 42 34 Z', C.hair, C.ink, 1.2), circle(54, 40, 1.4, C.ink, null), circle(66, 40, 1.4, C.ink, null), path('M56 47 Q60 50 64 47', 'none', C.ink, 1.2),
    rect(22, 92, 76, 9, HL, 4, C.ink, 1.4), rect(52, 89, 16, 15, C.dark, 4, C.ink, 1.4), heart(60, 98, 0.32, C.red),
    waPulse('endur-pulsband', path('M76 84 A10 10 0 0 1 84 76 M80 88 A16 16 0 0 1 90 74', 'none', HL, 1.8)), watch(104, 66, 0.55, heart(0, 0, 0.4, C.red))),
  // maxpuls: the needle swings all the way into the red at the top of the scale – the highest pulse
  'endur.maxpuls': all(bg('#f6f1e6'), gauge(60, 70, 1.9, 84, { name: 'endur-maxpuls', from: -70 }), waPulse('endur-maxpuls-h', heart(60, 98, 1.1, C.red)), num(60, 22, '190', 12), ring(96, 34, 12)),
  // pulszon: five zones from easy to hard; the pointer is in zone 2 (ring)
  'endur.pulszon': all(bg('#f6f1e6'), heart(16, 60, 0.9, C.red),
    ...['#6fb3e0', '#7cc576', '#f2c14e', '#ef8a3c', '#d64545'].map((c, i) => all(rect(30 + i * 17, 52, 17, 20, c, 0, C.ink, 1), num(38.5 + i * 17, 46, String(i + 1), 9))),
    path('M55.5 76 L51 84 L60 84 Z', C.ink, null), frame(45, 34, 21, 42), fig(55.5, 116, 0.3, JOG, { top: C.green, shorts: true })),
  // hjärtfrekvens: how many times the heart beats in a minute – heart, beat curve and the count
  'endur.hjärtfrekvens': all(bg('#f6f1e6'), waPulse('endur-hjf', heart(30, 38, 1.4, C.red)), ecg(8, 82, 104), stopwatch(92, 34, 0.6), num(60, 112, '72', 14, C.red), frame(6, 62, 108, 32)),
  // lågintensiv: calm – the needle stays low (blue/green side), the walker can talk; grey reference: a sprinter with the needle high
  'endur.lågintensiv': all(bg('#eef6ee'), ground(), gauge(84, 40, 1.1, -60), fig(44, 112, 0.8, pose({ n: [2, -68], aL: [[6, -56], [8, -44]], aR: [[-4, -56], [-6, -44]], lL: [[3, -21], [7, -1]], lR: [[-3, -21], [-6, -1]] }), { top: C.green }),
    bubble(56, 30, 18, 12, line('M60 36 L70 36', C.ink, 1.4)), greyed(fig(12, 112, 0.34, SPRINT), gauge(14, 70, 0.4, 70)), ring(84, 34, 20)),
  // högintensiv: very hard – the needle is in the red, the runner sprints and sweats; grey reference: a walker with the needle low
  'endur.högintensiv': all(bg('#fbefe9'), ground(), gauge(84, 40, 1.1, 70), fig(46, 112, 0.84, SPRINT, { top: C.red, shorts: true, mouth: 'open' }), sweat(62, 36), sweat(70, 48),
    greyed(fig(12, 112, 0.34, STAND), gauge(14, 70, 0.4, -60)), ring(84, 34, 20)),
  // tröskelpass: a hard but even run just below the line (dashed threshold) for about half an hour
  'endur.tröskelpass': all(bg(SKY), road(98, 22), rect(96, 14, 16, 76, C.white, 3, C.ink, 1.4), rect(98, 40, 12, 48, HL, 2, null), line('M92 34 L116 34', C.ink, 2, '3 2'),
    fig(50, 108, 0.74, RUN, { top: C.orange, shorts: true, mouth: 'flat' }, { name: 'endur-troskel', leg: 16, arm: 20, dur: 0.55 }), watch(22, 30, 0.6, num(0, 4, '30', 10, '#9ff3c0'))),
  // konditionstest: on an exercise bike in a test room; the tester notes the values, the screen shows the curve
  'endur.konditionstest': all(bg('#f2f2f0'), ground(), spinBike(46, 112, 1),
    fig(46, 112, 1, pose({ h: [-11, -40], n: [-2, -64], aL: [[6, -54], [14, -46]], aR: [[6, -53], [14, -46]], lL: [[-2, -30], [-3, -20]], lR: [[4, -27], [4, -12]] }), { top: C.sky, shorts: true }),
    fig(98, 112, 0.84, STAND, { top: C.white, leg: C.grey, sleeves: true, front: rect(6, -50, 10, 13, C.beige, 1, C.ink, 1) }),
    rect(70, 14, 40, 28, C.black, 3, C.ink, 1.4), path('M74 36 L82 32 L90 30 L98 24 L106 18', 'none', '#9ff3c0', 1.8), frame(68, 12, 44, 32)),
  // ── 4625 Cykling och spinning ──────────────────────────────────────
  // cykla: riding a bike along the road – the wheels and pedals turn, the legs push
  'endur.cykla': all(bg(SKY), cloud(30, 20), tree(102, 90, 0.7), road(96, 16),
    bike(56, 104, 1.1, 'city', C.green, { crank: 'endur-cykla-c', spinWheels: 'endur-cykla-w' }),
    fig(56, 104, 1.1, RIDE, { top: C.yellow, leg: C.navy, hs: 'helmet', capCol: C.sky, shoe: C.dark, sleeves: true }, { name: 'endur-cykla', leg: 9, dur: 0.55 }), speed(18, 60, 3)),
  // cykling: cycling as sport and hobby – road bike, mountain bike in the forest and spinning indoors
  'endur.cykling': all(bg('#f6f1e6'),
    frame(4, 6, 54, 52, C.grey), at(31, 50, 0.62, road(4, 6), bike(0, 4, 1, 'road', C.red), fig(0, 4, 1, RIDE, { top: C.red, leg: C.dark, hs: 'helmet', capCol: C.white, shoe: C.dark })),
    frame(62, 6, 54, 52, C.grey), tree(76, 40, 0.5), tree(104, 38, 0.45), at(89, 52, 0.6, bike(0, 0, 1, 'mtb', C.green), fig(0, 0, 1, RIDE, { top: C.green, leg: C.dark, hs: 'helmet', capCol: C.yellow, shoe: C.dark })),
    frame(33, 62, 54, 52, C.grey), at(60, 108, 0.66, spinBike(0, 0, 1), fig(0, 0, 1, pose({ h: [-9, -41], n: [6, -62], aL: [[12, -52], [18, -44]], aR: [[12, -51], [18, -44]], lL: [[0, -33], [-6, -19]], lR: [[8, -30], [9, -13]] }), { top: C.purple, shorts: true })),
    sparkle(16, 90, 4, HL), sparkle(104, 92, 4, HL)),
  // landsvägscykel: the road bike – light, thin tyres (orange), curved handlebar
  'endur.landsvägscykel': all(bg('#eef3f7'), ground(102), bike(60, 102, 1.6, 'road', C.red, { hlTyre: true }), ring(91, 46, 12)),
  // terrängcykel: the mountain bike – thick knobbly tyres (orange) and suspension, in mud and stones
  'endur.terrängcykel': all(bg(PARK), tree(16, 60, 0.6), tree(104, 56, 0.55), path('M0 104 C30 98 80 108 120 100 L120 120 L0 120 Z', '#8b6b4a', null),
    stone(18, 108, 1), stone(104, 108, 0.8), bike(60, 104, 1.5, 'mtb', C.green, { hlTyre: true }), ...[[30, 96], [36, 90], [92, 94]].map(([x, y]) => circle(x!, y!, 2, '#6b4a2b', null))),
  // spinning: a group class on fixed bikes; the leader (right) sets the pace to music
  'endur.spinning': all(bg('#2f2b3d'), rect(0, 100, 120, 20, '#4b4560', 0, null),
    ...[[18, 108, 0.62, C.pink], [50, 104, 0.58, C.sky]].map(([x, y, sc, c], i) => all(spinBike(x as number, y as number, sc as number, { crank: `endur-spinning-c${i}` }),
      fig(x as number, y as number, sc as number, pose({ h: [-9, -41], n: [6, -62], aL: [[12, -52], [18, -44]], aR: [[12, -51], [18, -44]], lL: [[0, -33], [-6, -19]], lR: [[8, -30], [9, -13]] }), { top: c as string, shorts: true }))),
    g('translate(196 0) scale(-1 1)', spinBike(98, 102, 0.66), fig(98, 102, 0.66, pose({ h: [-9, -41], n: [4, -64], aL: [[10, -74], [14, -86]], aR: [[12, -52], [18, -44]], lL: [[0, -33], [-6, -19]], lR: [[8, -30], [9, -13]] }), { top: C.yellow, shorts: true, mouth: 'open' })),
    waIn('endur-spinning-n', -10, 0, path('M66 30 L66 18 L74 16 L74 28', 'none', C.white, 1.8), ellipse(64, 30, 3, 2.2, C.white, null), ellipse(72, 28, 3, 2.2, C.white, null)), frame(4, 40, 112, 76)),
  // spinningcykel: the fixed indoor bike with the heavy wheel in front (object)
  'endur.spinningcykel': all(bg(GYM), ground(108), spinBike(58, 108, 1.9), ring(90, 78, 22)),
  // motstånd (training): the knob is turned towards heavy – the marks grow, the arrow turns
  'endur.motstånd.3': all(bg('#f6f1e6'), circle(60, 58, 34, C.white, C.ink, 2),
    ...range(9).map((i) => { const a = ((-135 + i * 33.75) * Math.PI) / 180, r0 = 26, r1 = 26 + 2 + i * 0.9; return line(`M${f1(60 + Math.sin(a) * r0)} ${f1(58 - Math.cos(a) * r0)} L${f1(60 + Math.sin(a) * r1)} ${f1(58 - Math.cos(a) * r1)}`, i > 5 ? HL : C.ink, 1.4 + i * 0.35); }),
    rock('endur-motst', 60, 58, -60, 60, 2.6, circle(60, 58, 18, C.red, C.ink, 1.8), rect(57, 40, 6, 14, C.white, 2, C.ink, 1)),
    path('M30 94 A40 40 0 0 0 92 94', 'none', HL, 2.4), path('M92 94 L84 96 L90 88 Z', HL, null), greyed(spinBike(18, 118, 0.4))),
  // trampa (on a bike): the foot on the pedal pushes it round – crank, chainring, chain and part of the frame
  'endur.trampa.2': all(bg('#eef3f7'), line('M60 74 L24 18 M60 74 L120 82', C.ink, 6), line('M60 74 L24 18 M60 74 L120 82', C.red, 4),
    path('M60 55 L112 70 M60 93 L112 92', 'none', C.dark, 2.2, ), circle(112, 81, 11, C.silver, C.ink, 1.4),
    circle(60, 74, 19, C.silver, C.ink, 1.8), ...range(24).map((i) => { const a = (i * Math.PI) / 12; return circle(f1(60 + Math.cos(a) * 19), f1(74 + Math.sin(a) * 19), 1.7, C.ink, null); }), circle(60, 74, 13, 'none', C.grey, 1.2),
    moving('endur-trampa-c', '0.0%{transform:translate(60px,74px) rotate(0deg) translate(-60px,-74px)}12.5%{transform:translate(60px,74px) rotate(45deg) translate(-60px,-74px)}25.0%{transform:translate(60px,74px) rotate(90deg) translate(-60px,-74px)}37.5%{transform:translate(60px,74px) rotate(135deg) translate(-60px,-74px)}50.0%{transform:translate(60px,74px) rotate(180deg) translate(-60px,-74px)}62.5%{transform:translate(60px,74px) rotate(225deg) translate(-60px,-74px)}75.0%{transform:translate(60px,74px) rotate(270deg) translate(-60px,-74px)}87.5%{transform:translate(60px,74px) rotate(315deg) translate(-60px,-74px)}100.0%{transform:translate(60px,74px) rotate(360deg) translate(-60px,-74px)}', { dur: 1.6 }, line('M60 74 L82 74', C.ink, 5), line('M60 74 L82 74', C.dark, 3), circle(60, 74, 4, C.dark, C.ink, 1)),
    moving('endur-trampa-f', '0.0%{transform:translate(0.0px,0.0px)}12.5%{transform:translate(-6.4px,15.6px)}25.0%{transform:translate(-22.0px,22.0px)}37.5%{transform:translate(-37.6px,15.6px)}50.0%{transform:translate(-44.0px,0.0px)}62.5%{transform:translate(-37.6px,-15.6px)}75.0%{transform:translate(-22.0px,-22.0px)}87.5%{transform:translate(-6.4px,-15.6px)}100.0%{transform:translate(0.0px,-0.0px)}', { dur: 1.6 }, path('M70 -4 L84 -4 L88 62 L76 64 Z', C.navy, C.ink, 1.6), rect(72, 72, 22, 4, C.dark, 1.5, C.ink, 1), shoe(84, 64, 0.9, C.sky)),
    path('M86 40 A34 34 0 0 1 90 106', 'none', HL, 2.6), path('M90 106 L84 98 L95 99 Z', HL, null)),
  // klunga: many cyclists riding close together in one bunch
  'endur.klunga': all(bg(SKY), rect(0, 74, 120, 46, '#a8cf8a', 0, null), road(88, 30),
    ...[[30, 98, C.red], [56, 96, C.sky], [82, 98, C.yellow], [42, 112, C.green], [68, 114, C.purple], [94, 112, C.orange], [18, 112, C.pink]].map(([x, y, c]) => all(bike(x as number, y as number, 0.5, 'road', C.dark), fig(x as number, y as number, 0.5, RIDE, { top: c as string, leg: C.dark, hs: 'helmet', capCol: C.white, shoe: C.dark }))),
    ellipse(58, 94, 54, 26, 'none', HL, 2.6)),
  // ligga på hjul: the second rider tucks in right behind the first, out of the wind that hits the leader
  'endur.ligga-på-hjul': all(bg(SKY), road(96, 24),
    bike(76, 106, 0.72, 'road', C.red), fig(76, 106, 0.72, RIDE, { top: C.red, leg: C.dark, hs: 'helmet', capCol: C.white, shoe: C.dark }),
    bike(42, 106, 0.72, 'road', C.sky), fig(42, 106, 0.72, RIDE, { top: C.sky, leg: C.dark, hs: 'helmet', capCol: C.white, shoe: C.dark }),
    waIn('endur-hjul', 18, 0, ...[56, 68, 80].map((y) => line(`M118 ${y} L102 ${y}`, C.grey, 2)), path('M102 56 C96 56 94 50 90 46 M102 80 C96 80 94 88 90 92', 'none', C.grey, 1.6)),
    line('M52 104 L62 104', HL, 2), ring(50, 76, 18)),

  // ── 4626 Simträning ────────────────────────────────────────────────
  // simma: swimming crawl in a lake – the arms turn, the legs kick
  'endur.simma': all(bg(SKY), path('M0 58 L20 50 L40 56 L70 46 L100 54 L120 50 L120 64 L0 64 Z', '#6aa86a', C.ink, 1), tree(16, 56, 0.4), tree(92, 52, 0.4), water(64, LAKE, false),
    fig(64, 76, 0.95, CRAWL, { suit: C.navy, hs: 'swimcap', capCol: C.yellow, mouth: 'none', goggles: true }, { name: 'endur-simma', leg: 6, dur: 0.8, armTurn: 'alt' }),
    rect(0, 79, 120, 41, 'rgba(79,143,179,0.55)', 0, null), splash(28, 76, 0.8)),
  // simning: swimming as sport – starting blocks and lanes, swimmers racing
  'endur.simning': all(bg('#dfeef5'), rect(0, 30, 120, 18, C.white, 0, null), ...[0, 1, 2].map((i) => all(rect(10 + i * 40, 36, 18, 10, C.white, 1.5, C.ink, 1.2), num(19 + i * 40, 44, String(i + 1), 7))),
    rect(0, 48, 120, 72, POOL, 0, null), ...[48, 88].map((x) => all(...range(8).map((j) => circle(x, 54 + j * 9, 2, j % 2 ? C.red : C.white, C.ink, 0.6)))),
    ...[[20, 70, C.yellow], [60, 86, C.red], [100, 64, C.green]].map(([x, y, c]) => g(`translate(${x} ${y}) rotate(90)`, fig(0, 0, 0.5, CRAWL, { suit: C.navy, hs: 'swimcap', capCol: c as string, mouth: 'none', goggles: true }))),
    frame(4, 32, 112, 84)),
  // crawl: on the front, face down in the water; one arm out of the water reaching forward, the other pulling under the water; straight legs kick up and down
  'endur.crawl': all(bg('#dfeef5'), water(62, POOL),
    rock('endur-crawl-l', 44, 66, -7, 7, 0.4, limbL([[44, 66], [30, 70], [16, 66]], SUIT), footAt([16, 66])), rock('endur-crawl-l2', 44, 66, 7, -7, 0.4, limbL([[44, 66], [30, 64], [16, 60]], SUIT), footAt([16, 60])),
    line('M44 66 L80 66', C.ink, 14.4), line('M44 66 L80 66', SUIT, 12),
    limbL([[78, 66], [86, 80], [74, 90]], C.skin, 4.4), handAt([74, 90]),
    profileHead(90, 67, 70),
    turn('endur-crawl-a', 78, 64, 1.4, 0, limbL([[78, 64], [88, 42], [104, 46]], C.skin, 4.6), handAt([104, 46])),
    underwater(68), path('M88 40 C100 30 112 38 112 52', 'none', HL, 2.4), path('M112 52 L108 44 L116 45 Z', HL, null), splash(14, 62, 1), splash(26, 62, 0.7)),
  // bröstsim: head above the water looking forward, both arms stretched forward together under the water, frog kick with the knees out
  'endur.bröstsim': all(bg('#dfeef5'), water(62, POOL),
    rock('endur-brost-l', 50, 74, -10, 6, 1.4, limbL([[50, 74], [38, 62], [24, 70]], SUIT), footAt([24, 70]), limbL([[50, 74], [38, 88], [24, 78]], SUIT), footAt([24, 78])),
    line('M50 74 L80 64', C.ink, 14.4), line('M50 74 L80 64', SUIT, 12),
    rock('endur-brost-a', 82, 64, -12, 8, 1.4, limbL([[82, 64], [96, 68], [112, 68]], C.skin, 4.4), handAt([112, 68]), limbL([[82, 66], [96, 72], [112, 73]], C.skin, 4.4), handAt([112, 73])),
    underwater(64), profileHead(88, 54, 0, C.green), line('M98 52 L114 52', HL, 1.6, '3 2'), path('M114 52 L109 49 L109 55 Z', HL, null),
    ring(38, 75, 17)),
  // ryggsim: lying on the back, face and nose up out of the water; one straight arm goes back over the head
  'endur.ryggsim': all(bg('#dfeef5'), water(62, POOL),
    limbL([[48, 64], [32, 66], [16, 64]], SUIT), footAt([16, 64]), limbL([[48, 64], [32, 62], [16, 60]], SUIT), footAt([16, 60]),
    line('M48 64 L80 62', C.ink, 14.4), line('M48 64 L80 62', SUIT, 12),
    limbL([[78, 64], [66, 70], [56, 70]], C.skin, 4.4), handAt([56, 70]),
    profileHead(90, 61, -90, C.purple),
    turn('endur-rygg-a', 80, 60, 1.6, 0, limbL([[80, 60], [92, 40], [102, 22]], C.skin, 4.6), handAt([102, 22])),
    underwater(66), path('M76 26 C82 12 100 10 110 20', 'none', HL, 2.4), path('M110 20 L102 18 L106 26 Z', HL, null)),
  // fjärilsim: upper body lifted, both arms out of the water at the same time in an arc forward, legs together in a dolphin kick
  'endur.fjärilsim': all(bg('#dfeef5'), water(64, POOL),
    rock('endur-fjaril-l', 50, 76, -10, 10, 0.9, limbL([[50, 76], [34, 82], [22, 72]], SUIT), limbL([[50, 74], [34, 80], [22, 70]], SUIT), footAt([22, 71])),
    line('M50 76 L78 54', C.ink, 14.4), line('M50 76 L78 54', SUIT, 12),
    profileHead(88, 52, 20, C.orange),
    limbL([[78, 54], [86, 32], [106, 30]], C.skin, 4.6), handAt([106, 30]), limbL([[76, 56], [92, 38], [112, 40]], C.skin, 4.6), handAt([112, 40]),
    underwater(66), path('M62 36 C70 18 98 14 112 24', 'none', HL, 2.4), path('M112 24 L104 22 L108 30 Z', HL, null), splash(96, 64, 1), splash(60, 64, 0.8)),
  // simtag: close-up of one arm pulling through the water from in front to behind (orange arrows), bubbles around the hand
  'endur.simtag': all(bg('#dfeef5'), water(24, POOL, false),
    moving('endur-simtag', '0%{transform:translate(18px,-6px)}100%{transform:translate(-14px,4px)}', { dur: 1.4 },
      path('M40 0 L56 0 L70 70 L58 74 Z', C.navy, C.ink, 1.6), path('M58 74 L70 70 L82 92 C84 98 78 102 72 98 L58 80 Z', C.skin, C.ink, 1.6),
      path('M72 98 C66 104 60 104 58 98 M76 100 C72 108 64 108 62 102', 'none', C.ink, 1.2)),
    path('M108 72 C100 96 70 106 30 92', 'none', HL, 3.2), path('M30 92 L40 88 L38 98 Z', HL, null), path('M104 46 C110 54 110 62 106 68', 'none', HL, 2), bubbles(92, 104), bubbles(48, 104), bubbles(24, 80)),
  // benspark: holding a kickboard, only the legs kick up and down (orange legs, splashes)
  'endur.benspark': all(bg('#dfeef5'), water(64, POOL),
    board(96, 66, 0.7, '#5fb0e8'), fig(60, 68, 1.05, pose({ h: [-16, 0], n: [10, -1], aL: [[20, -1], [30, -1]], aR: [[20, -3], [30, -3]], lL: [[-28, 1], [-40, -1]], lR: [[-28, -2], [-40, -5]] }), { suit: C.navy, hs: 'swimcap', capCol: C.yellow, mouth: 'none', goggles: true, hlLegs: true }, { name: 'endur-benspark', leg: 9, dur: 0.4 }),
    rect(0, 70, 120, 50, 'rgba(92,182,216,0.5)', 0, null), waPulse('endur-benspark-s', splash(14, 64, 1.1), splash(4, 66, 0.8))),
  // simplatta: the kickboard (object), floating on the water
  'endur.simplatta': all(bg('#dfeef5'), water(76, POOL, false), board(60, 64, 1.9, '#5fb0e8', -8), ring(60, 64, 44)),
  // vändning (swimming): at the wall the swimmer turns and pushes off with the feet (U-turn arrow)
  'endur.vändning.4': all(bg('#dfeef5'), water(40, POOL, false), rect(104, 30, 16, 90, '#e8eef2', 0, C.ink, 1.6), line('M104 70 L120 70', C.ink, 1, '4 3'),
    waIn('endur-vandning', 20, 0, fig(70, 76, 1, pose({ h: [10, 0], n: [-16, 2], aL: [[-26, 2], [-36, 2]], aR: [[-26, -1], [-36, -1]], lL: [[22, -10], [32, 0]], lR: [[22, -6], [33, 3]] }), { suit: C.navy, hs: 'swimcap', capCol: C.red, mouth: 'none', goggles: true, hlLegs: true })),
    path('M96 46 C60 30 36 44 40 60', 'none', HL, 2.6), path('M40 60 L36 52 L46 54 Z', HL, null)),
  // våtdräkt: the wetsuit (object) – black, tight, long arms and legs, the zip cord at the back
  'endur.våtdräkt': all(bg('#eef3f7'), line('M60 6 L60 14', C.ink, 1.6), path('M38 22 L60 14 L82 22', 'none', C.ink, 2),
    path('M48 20 L72 20 L94 30 L98 66 L90 66 L84 38 L80 64 L82 112 L66 112 L60 72 L54 112 L38 112 L40 64 L36 38 L30 66 L22 66 L26 30 Z', C.black, C.ink, 1.8),
    path('M48 20 C52 28 68 28 72 20', 'none', C.sky, 1.6), line('M40 64 L80 64 M26 30 L30 66 M94 30 L90 66', C.sky, 1.2), line('M60 22 L60 54', C.grey, 1.2), line('M60 54 L68 80', C.sky, 1.4), ring(60, 64, 52)),
  // öppet vatten: open water in nature – a lake with forest, a buoy and swimmers, no lanes
  'endur.öppet-vatten': all(bg(SKY), path('M0 50 L22 40 L44 48 L70 36 L98 46 L120 40 L120 56 L0 56 Z', '#4f8a5a', C.ink, 1), tree(20, 50, 0.45), tree(76, 46, 0.4), tree(104, 50, 0.42), water(56, LAKE, false),
    buoy(92, 80), swimmerHead(30, 76, C.yellow), swimmerHead(52, 88, C.orange), swimmerHead(74, 98, C.green), frame(4, 34, 112, 82)),

  // ── 4627 Uthållighetstävlingar ─────────────────────────────────────
  // lopp: a race – many runners with numbers on the road under the arch
  'endur.lopp': all(bg(SKY), road(94, 26), arch(8, 112, 20, C.navy, false),
    ...[[24, 106, C.red, '12'], [48, 110, C.green, '37'], [72, 106, C.yellow, '58'], [94, 112, C.sky, '81']].map(([x, y, c, n], i) => fig(x as number, y as number, 0.56, i % 2 ? FLY : RUN, { top: c as string, shorts: true, bib: n as string }))),
  // maraton: the long road race – the sign shows 42,195 kilometres
  'endur.maraton': all(bg(SKY), rect(0, 54, 120, 66, '#a8cf8a', 0, null), path('M56 54 L64 54 L104 120 L16 120 Z', '#8d9097', C.ink, 1.2), line('M60 56 L60 118', C.white, 1.4, '6 6'),
    at(94, 74, 1, line('M0 0 L0 30', C.dark, 2.4), rect(-22, -18, 44, 20, C.white, 3, C.ink, 1.6), num(0, -3, '42,195', 11, HL)), fig(44, 108, 0.6, RUN, { top: C.red, shorts: true, bib: '7' }), frame(70, 54, 48, 24)),
  // halvmaraton: half of it – the sign shows 21,1 and a half-filled circle
  'endur.halvmaraton': all(bg(SKY), road(96, 24), at(84, 70, 1, line('M0 0 L0 26', C.dark, 2.4), rect(-20, -20, 40, 22, C.white, 3, C.ink, 1.6), num(0, -4, '21,1', 12, HL)),
    circle(28, 32, 16, C.white, C.ink, 1.6), path('M28 16 A16 16 0 0 1 28 48 Z', HL, C.ink, 1.2), fig(40, 108, 0.6, RUN, { top: C.green, shorts: true, bib: '21' }), frame(62, 48, 44, 26)),
  // triathlon: swim, then bike, then run – three pictures joined by arrows
  'endur.triathlon': all(bg('#f6f1e6'),
    frame(4, 8, 50, 46, C.grey), rect(6, 34, 46, 18, POOL, 0, null), swimmerHead(28, 34, C.yellow, 1.2),
    frame(66, 8, 50, 46, C.grey), at(91, 50, 0.55, bike(0, 0, 1, 'road', C.red), fig(0, 0, 1, RIDE, { top: C.red, leg: C.dark, hs: 'helmet', capCol: C.white, shoe: C.dark })),
    frame(35, 66, 50, 46, C.grey), fig(60, 108, 0.42, RUN, { top: C.sky, shorts: true }),
    arrow(56, 30, 64, 30, HL, 2.6), arrow(92, 58, 80, 70, HL, 2.6)),
  // tävla: two runners side by side, both fighting to be first
  'endur.tävla': all(bg(SKY), trackBand(96, 24), line('M110 96 L110 120', C.white, 3),
    fig(52, 104, 0.74, SPRINT, { top: C.sky, shorts: true, mouth: 'grit', bib: '4' }, { name: 'endur-tavla-a', leg: 18, arm: 22, dur: 0.45 }),
    fig(70, 114, 0.74, SPRINT, { top: C.red, shorts: true, mouth: 'grit', bib: '9' }, { name: 'endur-tavla-b', leg: 18, arm: 22, dur: 0.45 }), speed(30, 50, 3), arrow(96, 30, 112, 30, HL, 2.6), arrow(96, 40, 112, 40, HL, 2.6)),
  // motionslopp: anyone can join – a child, a parent with a pram, an older runner and a runner in costume, all smiling
  'endur.motionslopp': all(bg(SKY), road(94, 26), arch(4, 116, 18, C.green, false),
    fig(20, 112, 0.4, JOG, { top: C.yellow, shorts: true, bib: '3' }), fig(46, 110, 0.6, JOG, { top: C.pink, hs: 'long', bib: '45', front: '' }),
    at(64, 110, 1, rect(0, -18, 16, 10, C.navy, 3, C.ink, 1.2), circle(3, -4, 3, C.dark, null), circle(13, -4, 3, C.dark, null), line('M-2 -22 L0 -18', C.ink, 1.6)),
    fig(86, 108, 0.56, JOG, { top: C.green, hair: '#d8d8d8', bib: '60' }), fig(106, 112, 0.5, RUN, { top: C.red, shorts: true, hs: 'cap', capCol: C.yellow, front: path('M-2 -64 L-14 -40 L-2 -42 Z', C.purple, C.ink, 1) }), heart(60, 38, 0.7)),
  // klassikern: four long races within a year – skis, bike, swimming, running round the twelve months
  'endur.klassiker.2': all(bg('#f6f1e6'), circle(60, 60, 40, 'none', C.grey2, 6), rect(46, 48, 28, 26, C.white, 3, C.ink, 1.4), rect(46, 48, 28, 7, C.red, 2, C.ink, 1), num(60, 70, '12', 12),
    at(60, 18, 1, line('M-12 6 L12 0 M-12 10 L12 4', C.denim, 2.4), line('M-6 -6 L-8 10 M6 -8 L4 8', C.dark, 1.4)),
    at(100, 66, 0.4, bike(0, 0, 1, 'road', C.red)), swimmerHead(60, 102, C.yellow, 1.1), fig(20, 74, 0.32, RUN, { top: C.sky, shorts: true }),
    path('M78 24 A40 40 0 0 1 98 44', 'none', HL, 2.4), path('M96 82 A40 40 0 0 1 76 98', 'none', HL, 2.4), path('M42 98 A40 40 0 0 1 22 80', 'none', HL, 2.4), path('M22 40 A40 40 0 0 1 42 22', 'none', HL, 2.4)),
  // startnummer: the race number pinned to the shirt with safety pins
  'endur.startnummer': all(bg('#eef3f7'), path('M20 120 L24 34 L44 22 C52 30 68 30 76 22 L96 34 L100 120 Z', C.sky, C.ink, 1.8),
    rect(32, 50, 56, 40, C.white, 3, C.ink, 1.8), num(60, 80, '1234', 18), ...[[36, 54], [84, 54], [36, 86], [84, 86]].map(([x, y]) => circle(x!, y!, 2, C.silver, C.ink, 0.8)), ring(60, 70, 36)),
  // start (in a race): the runners wait behind the start line (orange); the green flag goes up
  'endur.start.3': all(bg(SKY), road(90, 30), arch(4, 116, 16, C.green, false), line('M10 106 L110 106', HL, 3.4),
    ...[[26, 102, C.red], [48, 100, C.yellow], [70, 102, C.sky], [92, 100, C.pink]].map(([x, y, c]) => fig(x as number, y as number, 0.5, pose({ h: [0, -40], n: [6, -64], aL: [[12, -54], [18, -60]], aR: [[-2, -54], [0, -45]], lL: [[-5, -21], [-10, -2]], lR: [[6, -21], [8, -1]] }), { top: c as string, shorts: true })),
    waIn('endur-start-f', 0, 8, flag(108, 44, C.green, 1.2))),
  // gå i mål: the runner reaches the finish and breaks the tape with arms up
  'endur.gå-i-mål': all(bg(SKY), road(92, 28), arch(70, 118, 14, C.navy, true),
    waIn('endur-gaimal', -30, 0, fig(80, 110, 0.72, ARMS_UP, { top: C.orange, shorts: true, bib: '5', mouth: 'open' })), line('M70 82 L76 80 M90 80 L118 82', HL, 2.6), sparkle(56, 30, 5, HL), sparkle(104, 54, 4, HL)),
  // spurta: at the end of the race the runner gives everything and passes another one; the finish arch is close
  'endur.spurta': all(bg(SKY), road(94, 26), arch(92, 120, 22, C.navy, true), greyed(fig(40, 110, 0.6, RUN)),
    travel('endur-spurta', -26, 6, 1.6, fig(62, 112, 0.7, SPRINT, { top: C.red, shorts: true, mouth: 'grit', bib: '9' }, { name: 'endur-spurta-f', leg: 18, arm: 22, dur: 0.4 })), speed(42, 60, 3, HL)),
  // sluttid: the finish clock shows the time from start to finish (orange frame); the runner walks on with the medal
  'endur.sluttid': all(bg(SKY), road(92, 28), arch(6, 74, 40, C.navy, true), rect(14, 8, 78, 28, C.black, 3, C.ink, 1.6), num(53, 29, '2:21:05', 16, '#ffd25a'), frame(10, 4, 86, 36),
    fig(98, 112, 0.56, STAND, { top: C.orange, shorts: true, bib: '5', front: medalEl(1, -56, 0.32) })),
  // vätskekontroll: a table of cups by the course; a helper holds out water to a runner
  'endur.vätskekontroll': all(bg(SKY), road(98, 22), rect(8, 76, 46, 6, C.white, 1, C.ink, 1.4), line('M12 82 L12 108 M50 82 L50 108', C.ink, 2),
    ...range(5).map((i) => cup(14 + i * 8, 76, 0.8)), fig(30, 108, 0.6, pose({ aR: [[10, -60], [18, -60]] }), { top: C.yellow, vest: C.reflex, sleeves: true, front: cup(18, -62, 1) }),
    fig(80, 114, 0.66, RUN, { top: C.red, shorts: true, bib: '8' }), frame(4, 60, 54, 52)),
  // funktionär: a helper in a vest shows the runners the way with a flag
  'endur.funktionär': all(bg(SKY), road(94, 26),
    fig(30, 110, 0.86, pose({ aR: [[12, -72], [24, -76]], aL: [[-3, -55], [-4, -43]] }), { top: C.navy, vest: C.reflex, sleeves: true, hs: 'cap', capCol: C.reflex, mouth: 'open', front: flag(24, -76, C.orange, 0.8) }),
    fig(70, 114, 0.5, RUN, { top: C.red, shorts: true, bib: '3' }), fig(96, 110, 0.46, FLY, { top: C.green, shorts: true, bib: '6' }), arrow(64, 40, 100, 40, HL, 2.6), ring(32, 70, 30)),
  // medalj: the medal on its ribbon (object)
  'endur.medalj': all(bg('#f6f1e6'), medalEl(60, 64, 2.2), sparkle(26, 70, 5), sparkle(94, 80, 4)),
  // rekord: the scoreboard – the old best time is struck out (grey), the new, faster one is orange
  'endur.rekord': all(bg('#f6f1e6'), rect(12, 16, 96, 80, C.black, 4, C.ink, 1.8),
    greyed(num(60, 44, '3:05', 20, C.white), line('M30 38 L90 32', C.red, 3)), num(60, 82, '2:58', 24, HL), star(98, 70, 7, C.yellow), arrow(22, 86, 22, 60, HL, 2.6), sparkle(100, 30, 4, C.yellow)),
  // stafett: one runner hands over the baton (orange) to the next, who is already running
  'endur.stafett': all(bg(SKY), trackBand(94, 26),
    fig(42, 110, 0.72, pose({ h: [0, -42], n: [5, -67], aL: [[-6, -57], [-3, -48]], aR: [[14, -58], [24, -56]], lL: [[-5, -26], [-15, -31]], lR: [[5, -22], [2, -1]] }), { top: C.navy, shorts: true, bib: '2', mouth: 'open' }),
    fig(76, 110, 0.72, pose({ h: [0, -42], n: [4, -67], aL: [[10, -56], [16, -62]], aR: [[-8, -56], [-16, -54]], lL: [[-5, -26], [-15, -31]], lR: [[5, -22], [2, -1]] }), { top: C.denim, shorts: true, bib: '2' }),
    g('rotate(-10 60 70)', rect(54, 67, 14, 5, HL, 2, C.ink, 1.2)), ring(60, 70, 12)),
};
