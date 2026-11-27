/**
 * Kultur & fritid → Sport & träning → Bollsporter, 4631–4637 (0.64): football, basketball, handball, volleyball,
 * tennis and padel, floorball (innebandy) and table tennis.
 * Players are drawn with a posable figure (`pl`): hip, neck, elbows, hands, knees and feet are joints, so a pose can
 * show a kick, a throw, a jump shot, a dive or a forehand with two arms and two legs in sensible proportions (straight
 * back, knees over the feet, the throwing arm cocked behind the head, the racket in the hand). The thing the word names
 * is orange (accent ring, frame, arrow or fill); grey figures and things are the reference.
 * Each sport has its own ball and setting (grass and white goal, wooden floor and hoop, red-white handball goal, high
 * net, clay court, glass cage, low boards around the floor, green table). Pairs that are easy to mix up get different
 * kinds of picture: the sport (a scene with players) against the place (empty court seen from above) against the
 * equipment (a close-up of the object); forehand (racket and ball on the racket-hand side, one hand) against backhand
 * (racket across the body, two hands); attack (arrows towards the other goal) against defence (a wall in front of the
 * own basket). Verbs move (base state = poster frame, transform and opacity only). Scores are digits only.
 * No letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, star, waBob, waSpin, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const cross = (x: number, y: number, r = 6, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
/** Rock a part about (cx, cy) by ±deg. */
const rotAbout = (name: string, cx: number, cy: number, deg: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:rotate(0)}50%{transform:translate(${cx}px,${cy}px) rotate(${deg}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);
/** Swing a part from `deg` back to its drawn position about (cx, cy). */
const swingFrom = (name: string, cx: number, cy: number, deg: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,20%{transform:translate(${cx}px,${cy}px) rotate(${deg}deg) translate(${-cx}px,${-cy}px)}55%,100%{transform:rotate(0)}`, { dur }, ...k);
/** Travel from (dx, dy) to the drawn place and stay there. */
const flyIn = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,15%{transform:translate(${dx}px,${dy}px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}`, { dur }, ...k);

// ── The posable player ──────────────────────────────────────────────
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = { top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'cap' | 'band'; shoe?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'frown'; sleeves?: boolean; gloves?: string; num?: string; shorts?: boolean; sock?: string };
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
/** Player with feet near (x, y); local height ≈ 86·s. Shorts + socks by default (sports kit). */
function pl(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.red), leg = grey ? C.grey : (o.leg ?? C.white);
  const hair = grey ? C.grey : (o.hair ?? C.hair), shoe = grey ? C.grey : (o.shoe ?? C.black), sock = grey ? C.grey2 : (o.sock ?? top);
  const shorts = o.shorts ?? true;
  const seg = (a: Pt, b: Pt, col: string, w: number) => { const d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`; return all(line(d, ink, w + 2.4), line(d, col, w)); };
  const mid = (a: Pt, b: Pt, t: number): Pt => [f1(a[0] + (b[0] - a[0]) * t), f1(a[1] + (b[1] - a[1]) * t)];
  const legDraw = (j: [Pt, Pt]) => shorts
    ? all(seg(p.h, mid(p.h, j[0], 0.7), leg, 6), seg(mid(p.h, j[0], 0.7), j[0], skin, 4.6), seg(j[0], mid(j[0], j[1], 0.35), skin, 4.6), seg(mid(j[0], j[1], 0.35), j[1], sock, 4.8))
    : all(seg(p.h, j[0], leg, 5), seg(j[0], j[1], leg, 5));
  const armDraw = (j: [Pt, Pt]) => o.sleeves === false ? all(seg(p.n, j[0], skin, 4.2), seg(j[0], j[1], skin, 4.2))
    : all(seg(p.n, mid(p.n, j[0], 0.6), top, 4.6), seg(mid(p.n, j[0], 0.6), j[0], skin, 4.2), seg(j[0], j[1], skin, 4.2));
  const dx = p.n[0] - p.h[0], dy = p.n[1] - p.h[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const head: Pt = [f1(p.n[0] + ux * 10), f1(p.n[1] + uy * 10)];
  const ang = f1((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const torso = `M${p.n[0]} ${p.n[1]} L${p.h[0]} ${p.h[1]}`;
  const hand = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], o.gloves ? 3.6 : 2.8, o.gloves ?? skin, ink, 1);
  const foot = (j: [Pt, Pt]) => circle(j[1][0], j[1][1], 3, shoe, ink, 1);
  const hairBack = o.hs === 'long' ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2)) : '';
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`,
    o.hs === 'cap' ? all(path('M-8.5 -1 C-8.5 -12 8.5 -12 8.5 -1 Z', C.white, ink, 1.2), path('M4 -2 L14 -1 L8.5 -1 Z', C.white, ink, 1.2))
      : o.hs === 'band' ? all(path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2), path('M-8.4 -2.6 L8.4 -2.6 L8 -5.4 L-8 -5.4 Z', C.white, ink, 0.8))
        : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null),
    m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'frown' ? path('M-2.4 5 Q0 2.6 2.4 5', 'none', ink, 1) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  const tnum = o.num ? g(`translate(${f1((p.n[0] + p.h[0]) / 2)} ${f1((p.n[1] + p.h[1]) / 2)}) rotate(${ang})`, num(0, 3, o.num, 8, C.white)) : '';
  return at(x, y, s, hairBack, legDraw(p.lL), foot(p.lL), legDraw(p.lR), foot(p.lR),
    line(torso, ink, 14.4), line(torso, top, 12), tnum, armDraw(p.aL), hand(p.aL), armDraw(p.aR), hand(p.aR),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face);
}
/** Local point of a pose part → canvas point for a player drawn with pl(x, y, s, …). */
const P = (x: number, y: number, s: number, q: Pt): Pt => [f1(x + q[0] * s), f1(y + q[1] * s)];

// ── Poses (facing right unless the name says otherwise) ─────────────
const RUN = pose({ h: [0, -44], n: [5, -69], aL: [[-7, -58], [-14, -51]], aR: [[13, -60], [18, -67]], lL: [[-6, -26], [-17, -15]], lR: [[10, -25], [7, -1]] });
const KICK = pose({ h: [0, -44], n: [-5, -69], aL: [[-14, -62], [-24, -58]], aR: [[8, -62], [17, -57]], lL: [[-2, -22], [-4, -1]], lR: [[14, -32], [27, -24]] });
const KICK_BACK = pose({ h: [0, -44], n: [3, -69], aL: [[-10, -60], [-18, -64]], aR: [[12, -60], [18, -54]], lL: [[-1, -22], [-2, -1]], lR: [[-4, -24], [-18, -16]] });
const THROW = pose({ h: [0, -44], n: [-2, -70], aL: [[10, -62], [19, -60]], aR: [[-10, -74], [-15, -88]], lL: [[8, -22], [13, -1]], lR: [[-6, -22], [-13, -1]] });
const THROWN = pose({ h: [0, -44], n: [4, -69], aL: [[-8, -58], [-13, -50]], aR: [[14, -72], [26, -70]], lL: [[8, -22], [13, -1]], lR: [[-6, -22], [-13, -1]] });
const CATCH = pose({ h: [0, -44], n: [-1, -70], aL: [[9, -64], [18, -68]], aR: [[9, -58], [18, -62]], lL: [[4, -22], [7, -1]], lR: [[-5, -22], [-9, -1]] });
const KEEPER = pose({ h: [0, -36], n: [0, -62], aL: [[-14, -68], [-24, -78]], aR: [[14, -68], [24, -78]], lL: [[-12, -20], [-13, -1]], lR: [[12, -20], [13, -1]] });
const JUMP_UP = pose({ h: [0, -44], n: [0, -70], aL: [[-4, -84], [-2, -96]], aR: [[4, -84], [2, -96]], lL: [[-5, -24], [-8, -6]], lR: [[5, -24], [8, -6]] });
const SHOOT = pose({ h: [0, -46], n: [1, -72], aL: [[5, -82], [9, -93]], aR: [[9, -80], [13, -92]], lL: [[-3, -24], [-4, -4]], lR: [[4, -24], [6, -4]] });
const DRIBBLE = pose({ h: [0, -38], n: [6, -63], aL: [[-6, -54], [-10, -46]], aR: [[14, -52], [19, -40]], lL: [[-8, -20], [-12, -1]], lR: [[10, -20], [11, -1]] });
const CHEER = pose({ h: [0, -44], n: [0, -70], aL: [[-12, -82], [-16, -96]], aR: [[12, -82], [16, -96]], lL: [[-6, -22], [-8, -1]], lR: [[6, -22], [8, -1]] });
const SAD = pose({ h: [0, -40], n: [3, -64], aL: [[-3, -52], [-2, -40]], aR: [[7, -52], [8, -40]], lL: [[-4, -20], [-5, -1]], lR: [[4, -20], [5, -1]] });
const SERVE_UP = pose({ h: [0, -44], n: [-2, -70], aL: [[2, -84], [6, -97]], aR: [[-10, -80], [-6, -94]], lL: [[5, -22], [8, -1]], lR: [[-5, -22], [-9, -1]] });
const FORE = pose({ h: [0, -42], n: [2, -68], aL: [[-9, -60], [-16, -56]], aR: [[14, -60], [24, -56]], lL: [[-7, -21], [-10, -1]], lR: [[8, -21], [11, -1]] });
const BACK2 = pose({ h: [0, -42], n: [-2, -68], aL: [[-12, -58], [-20, -54]], aR: [[-6, -56], [-17, -52]], lL: [[-8, -21], [-11, -1]], lR: [[7, -21], [10, -1]] });
const BLOCK = pose({ h: [0, -46], n: [0, -72], aL: [[-3, -86], [-4, -100]], aR: [[5, -86], [6, -100]], lL: [[-4, -24], [-5, -6]], lR: [[4, -24], [5, -6]] });
const SMASH = pose({ h: [0, -46], n: [-1, -72], aL: [[8, -82], [14, -90]], aR: [[-6, -86], [2, -100]], lL: [[-5, -26], [-10, -8]], lR: [[5, -26], [2, -6]] });
const CROUCH = pose({ h: [0, -30], n: [8, -54], aL: [[12, -42], [18, -30]], aR: [[16, -44], [22, -32]], lL: [[-8, -16], [-6, -1]], lR: [[10, -16], [8, -1]] });
const STICK = pose({ h: [0, -38], n: [7, -62], aL: [[2, -52], [12, -44]], aR: [[12, -48], [16, -36]], lL: [[-8, -20], [-12, -1]], lR: [[9, -20], [11, -1]] });
const WIND_UP = pose({ h: [0, -40], n: [3, -65], aL: [[-8, -62], [-16, -70]], aR: [[-4, -60], [-12, -68]], lL: [[-8, -20], [-12, -1]], lR: [[9, -20], [12, -1]] });
const HEAD = pose({ h: [0, -50], n: [3, -76], aL: [[-12, -70], [-20, -76]], aR: [[12, -70], [20, -76]], lL: [[-6, -30], [-9, -10]], lR: [[5, -30], [2, -12]] });

// ── Balls ───────────────────────────────────────────────────────────
const fball = (x: number, y: number, r = 5) => all(circle(x, y, r, C.white, C.ink, 1.3), path(`M${x} ${f1(y - r * 0.45)} L${f1(x + r * 0.43)} ${f1(y - r * 0.12)} L${f1(x + r * 0.27)} ${f1(y + r * 0.38)} L${f1(x - r * 0.27)} ${f1(y + r * 0.38)} L${f1(x - r * 0.43)} ${f1(y - r * 0.12)} Z`, C.black, null));
const bball = (x: number, y: number, r = 5.5) => all(circle(x, y, r, C.orange, C.ink, 1.3), line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, C.ink, 0.9), path(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} Q${f1(x - r * 0.2)} ${y} ${f1(x - r * 0.7)} ${f1(y + r * 0.7)} M${f1(x + r * 0.7)} ${f1(y - r * 0.7)} Q${f1(x + r * 0.2)} ${y} ${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, 'none', C.ink, 0.9));
const hball = (x: number, y: number, r = 4.6) => all(circle(x, y, r, C.yellow, C.ink, 1.3), path(`M${x - r} ${y} Q${x} ${f1(y - r * 0.6)} ${x + r} ${y}`, 'none', C.navy, 1.6), path(`M${x} ${y - r} Q${f1(x + r * 0.5)} ${y} ${x} ${y + r}`, 'none', C.red, 1.4));
const vball = (x: number, y: number, r = 5.5) => all(circle(x, y, r, C.white, C.ink, 1.3), path(`M${x} ${y - r} Q${f1(x - r * 0.4)} ${y} ${f1(x - r * 0.9)} ${f1(y + r * 0.4)}`, 'none', C.denim, 1.6), path(`M${f1(x - r * 0.4)} ${f1(y + r * 0.1)} Q${f1(x + r * 0.3)} ${f1(y + r * 0.3)} ${f1(x + r * 0.8)} ${f1(y + r * 0.5)}`, 'none', C.yellow, 1.6), path(`M${x} ${y - r} Q${f1(x + r * 0.6)} ${f1(y - r * 0.3)} ${f1(x + r * 0.9)} ${f1(y + r * 0.2)}`, 'none', C.ink, 0.8));
const tball = (x: number, y: number, r = 3.4) => all(circle(x, y, r, C.reflex, C.ink, 1.1), path(`M${f1(x - r * 0.8)} ${f1(y - r * 0.5)} Q${x} ${y} ${f1(x - r * 0.8)} ${f1(y + r * 0.5)} M${f1(x + r * 0.8)} ${f1(y - r * 0.5)} Q${x} ${y} ${f1(x + r * 0.8)} ${f1(y + r * 0.5)}`, 'none', C.white, 0.9));
const iball = (x: number, y: number, r = 3.6, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1.1), ...[[-0.4, -0.35], [0.4, -0.35], [0, 0.1], [-0.45, 0.45], [0.45, 0.45]].map(([a, b]) => circle(f1(x + a! * r), f1(y + b! * r), f1(r * 0.17), C.ink, null)));
const pball = (x: number, y: number, r = 2.4, col: string = C.white) => circle(x, y, r, col, C.ink, 1);
const motionLines = (x: number, y: number, dx: number, dy: number, col: string = C.grey) => {
  const len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, px = -uy, py = ux;
  return line([-4, 0, 4].map((o) => `M${f1(x + px * o)} ${f1(y + py * o)} L${f1(x + px * o - ux * (12 - Math.abs(o)))} ${f1(y + py * o - uy * (12 - Math.abs(o)))}`).join(' '), col, 1.4);
};

// ── Equipment ───────────────────────────────────────────────────────
/** Racket with the handle end at (x, y), pointing at `rot` degrees (0 = right). */
const racket = (x: number, y: number, rot: number, kind: 'tennis' | 'padel' | 'pingis' = 'tennis', col: string = C.red, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  kind === 'tennis' ? all(rect(0, -1.4, 11, 2.8, C.dark, 1, C.ink, 0.8), path('M11 0 L15 -3 M11 0 L15 3', 'none', col, 1.6), ellipse(22, 0, 8, 6, 'none', col, 2.2), ellipse(22, 0, 7, 5, '#ffffff66', null), line('M17 -4 L17 4 M20 -5 L20 5 M23 -5 L23 5 M26 -4 L26 4 M15.5 -2 L28.5 -2 M15 0 L29 0 M15.5 2 L28.5 2', C.grey, 0.5))
    : kind === 'padel' ? all(rect(0, -1.6, 9, 3.2, C.dark, 1, C.ink, 0.8), path('M9 -3 C9 -9 29 -9 29 0 C29 9 9 9 9 3 Z', col, C.ink, 1.2), ...[[15, -2], [19, -3], [23, -2], [17, 2], [21, 2], [25, 1], [21, -0.5]].map(([a, b]) => circle(a!, b!, 0.8, C.ink, null)))
      : all(rect(0, -1.4, 7, 2.8, C.tan, 1, C.ink, 0.8), circle(13, 0, 6.5, col, C.ink, 1.2)));
/** Floorball stick: handle end at (x, y), length L, blade at the far end. */
const fstick = (x: number, y: number, rot: number, L = 34, col: string = C.white, blade: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`,
  line(`M0 0 L${L} 0`, C.ink, 3.6), line(`M0 0 L${L} 0`, col, 2.2), rect(-1, -2, 7, 4, C.dark, 1, null), path(`M${L} -2 C${L + 3} 2 ${L + 3} 6 ${L + 9} 6 L${L + 9} 3 C${L + 6} 3 ${L + 5} 0 ${L + 3} -2 Z`, blade, C.ink, 1));
const whistle = (x: number, y: number) => all(rect(x - 3, y - 1.6, 6, 3.2, C.silver, 1.2, C.ink, 0.8), circle(x + 3, y, 2, C.silver, C.ink, 0.8));
const scoreboard = (x: number, y: number, a: string, b: string, colA: string = C.red, colB: string = C.denim, w = 50) => all(
  rect(x - w / 2, y - 12, w, 22, C.black, 3, C.ink, 1.6), rect(x - w / 2 + 4, y - 9, 6, 4, colA, 1, null), rect(x + w / 2 - 10, y - 9, 6, 4, colB, 1, null),
  num(x - w / 4, y + 7, a, 13, C.yellow), num(x + w / 4, y + 7, b, 13, C.yellow), rect(x - 1.2, y, 2.4, 2.4, C.yellow, 0, null));

// ── Settings ────────────────────────────────────────────────────────
const GRASS = '#6aa85b', GRASS2 = '#5d9a50', FLOOR = '#dcb27a', FLOOR2 = '#c99d63', HALL = '#eef0ea', CLAY = '#cd6f45', HARD = '#4e7fb5', SAND = '#ecd49a';
const sky = (top = '#dcefF8') => rect(0, 0, 120, 120, top, 0, null);
const grass = (y = 70) => all(rect(0, y, 120, 120 - y, GRASS, 0, null), ...range(4).map((i) => rect(i * 30, y, 15, 120 - y, GRASS2, 0, null)), line(`M0 ${y} L120 ${y}`, C.ink, 1.2));
const outdoor = (y = 70) => all(sky(), grass(y));
const hall = (y = 78) => all(rect(0, 0, 120, 120, HALL, 0, null), rect(0, y, 120, 120 - y, FLOOR, 0, null), ...range(6).map((i) => line(`M${i * 22} ${y} L${i * 22 - 10} 120`, FLOOR2, 1)), line(`M0 ${y} L120 ${y}`, C.ink, 1.2));
const crowd = (y: number, n: number, x0 = 6, x1 = 114, cols = [C.navy, C.purple, C.green, C.red, C.denim, C.yellow]) => all(...range(n).map((i) => {
  const x = f1(x0 + (i * (x1 - x0)) / (n - 1)), c = cols[i % cols.length]!;
  return all(path(`M${x - 6} ${y + 10} C${x - 6} ${y + 2} ${x + 6} ${y + 2} ${x + 6} ${y + 10} Z`, c, C.ink, 0.8), circle(x, y - 1, 4.2, C.skin, C.ink, 0.8));
}));
/** Football goal seen from the front, posts at x..x+w, crossbar at y, ground at gy. */
const fgoal = (x: number, y: number, w: number, gy: number, col: string = C.white) => all(
  ...range(Math.floor(w / 5)).map((i) => line(`M${x + 3 + i * 5} ${y + 2} L${x + 3 + i * 5} ${gy}`, '#ffffff99', 0.7)), ...range(Math.floor((gy - y) / 5)).map((i) => line(`M${x + 2} ${y + 4 + i * 5} L${x + w - 2} ${y + 4 + i * 5}`, '#ffffff99', 0.7)),
  path(`M${x} ${gy} L${x} ${y} L${x + w} ${y} L${x + w} ${gy}`, 'none', C.ink, 4.4), path(`M${x} ${gy} L${x} ${y} L${x + w} ${y} L${x + w} ${gy}`, 'none', col, 2.6));
/** Handball (or floorball) goal: red and white striped frame. */
const hgoal = (x: number, y: number, w: number, gy: number) => all(fgoal(x, y, w, gy, C.white),
  ...range(Math.ceil(w / 8)).map((i) => i % 2 ? '' : line(`M${x + i * 8} ${y} L${Math.min(x + i * 8 + 8, x + w)} ${y}`, C.red, 2.6)),
  ...range(Math.ceil((gy - y) / 8)).map((i) => i % 2 ? '' : line(`M${x} ${y + i * 8} L${x} ${Math.min(y + i * 8 + 8, gy)} M${x + w} ${y + i * 8} L${x + w} ${Math.min(y + i * 8 + 8, gy)}`, C.red, 2.6)));
/** Basketball hoop on a pole (side view), ring centre at (rx, ry), board to the right. */
const hoop = (rx: number, ry: number, ringCol: string = C.orange) => all(
  line(`M${rx + 20} ${ry - 8} L${rx + 20} 112`, C.dark, 4), line(`M${rx + 10} ${ry - 4} L${rx + 20} ${ry - 4}`, C.dark, 3),
  rect(rx + 7, ry - 24, 4, 30, C.white, 1, C.ink, 1.4),
  path(`M${rx - 9} ${ry} L${rx - 6} ${ry + 13} L${rx + 6} ${ry + 13} L${rx + 9} ${ry}`, 'none', C.white, 1.2), line(`M${rx - 4} ${ry} L${rx - 3} ${ry + 13} M${rx} ${ry} L${rx} ${ry + 13} M${rx + 4} ${ry} L${rx + 3} ${ry + 13} M${rx - 8} ${ry + 5} L${rx + 8} ${ry + 5} M${rx - 7} ${ry + 9} L${rx + 7} ${ry + 9}`, C.white, 0.8),
  ellipse(rx, ry, 9.5, 2.6, 'none', C.ink, 3.4), ellipse(rx, ry, 9.5, 2.6, 'none', ringCol, 2));
/** A high volleyball net across the picture at x, from y top (tape) down to bottom. */
const vnet = (x: number, top: number, h = 22, gy = 112) => all(line(`M${x} ${top - 4} L${x} ${gy}`, C.dark, 2.6),
  rect(x - 1.6, top, 3.2, h, '#2b2a3366', 0, null), ...range(Math.floor(h / 4)).map((i) => line(`M${x - 1.6} ${top + 2 + i * 4} L${x + 1.6} ${top + 2 + i * 4}`, C.white, 0.6)), rect(x - 2.2, top - 2, 4.4, 3, C.white, 0.5, C.ink, 0.8));
/** Low tennis net (side view). */
const tnet = (x: number, gy = 112, h = 12) => all(line(`M${x} ${gy - h - 2} L${x} ${gy}`, C.dark, 2), rect(x - 1.4, gy - h, 2.8, h, '#2b2a3366', 0, null), rect(x - 2, gy - h - 1.5, 4, 2.4, C.white, 0.5, C.ink, 0.6));
/** Football pitch seen from above (x, y, w, h). */
const pitchTop = (x: number, y: number, w: number, h: number, lineCol: string = C.white) => all(rect(x, y, w, h, GRASS, 2, C.ink, 1.6),
  ...range(6).map((i) => i % 2 ? rect(x + (i * w) / 6, y, w / 6, h, GRASS2, 0, null) : ''),
  rect(x + 3, y + 3, w - 6, h - 6, 'none', 0, lineCol, 1.4), line(`M${x + w / 2} ${y + 3} L${x + w / 2} ${y + h - 3}`, lineCol, 1.4), circle(x + w / 2, y + h / 2, h * 0.16, 'none', lineCol, 1.4),
  rect(x + 3, y + h * 0.28, w * 0.14, h * 0.44, 'none', 0, lineCol, 1.4), rect(x + w - 3 - w * 0.14, y + h * 0.28, w * 0.14, h * 0.44, 'none', 0, lineCol, 1.4),
  rect(x - 2, y + h * 0.42, 5, h * 0.16, C.white, 0, C.ink, 1), rect(x + w - 3, y + h * 0.42, 5, h * 0.16, C.white, 0, C.ink, 1));
const tennisTop = (x: number, y: number, w: number, h: number, court: string = HARD) => all(rect(x - 5, y - 5, w + 10, h + 10, '#3f6e44', 2, C.ink, 1.4), rect(x, y, w, h, court, 0, C.white, 1.6),
  line(`M${x} ${y + h * 0.12} L${x + w} ${y + h * 0.12} M${x} ${y + h * 0.88} L${x + w} ${y + h * 0.88}`, C.white, 1.2),
  line(`M${x + w * 0.23} ${y + h * 0.12} L${x + w * 0.23} ${y + h * 0.88} M${x + w * 0.77} ${y + h * 0.12} L${x + w * 0.77} ${y + h * 0.88} M${x + w * 0.23} ${y + h / 2} L${x + w * 0.77} ${y + h / 2}`, C.white, 1.2),
  line(`M${x + w / 2} ${y - 4} L${x + w / 2} ${y + h + 4}`, C.ink, 2.6), line(`M${x + w / 2} ${y - 4} L${x + w / 2} ${y + h + 4}`, C.white, 1));
/** Table-tennis table, side view with a little top surface. */
const ptable = (x: number, y: number, w: number, col = '#2f6f9a') => all(line(`M${x + 6} ${y + 4} L${x + 4} 112 M${x + w - 6} ${y + 4} L${x + w - 4} 112`, C.dark, 3),
  path(`M${x} ${y} L${x + w} ${y} L${x + w - 6} ${y - 8} L${x + 6} ${y - 8} Z`, col, C.ink, 1.4), rect(x, y, w, 4, col, 0, C.ink, 1.4), line(`M${x + 3} ${y - 4} L${x + w - 3} ${y - 4}`, C.white, 0.8),
  rect(x + w / 2 - 1, y - 15, 2, 15, '#2b2a3388', 0, C.ink, 0.6));
/** Floorball boards (side view) along the bottom. */
const boards = (y = 98, col: string = C.white) => all(rect(0, y, 120, 10, col, 0, C.ink, 1.6), line(`M0 ${y + 3} L120 ${y + 3}`, C.grey2, 1), ...range(6).map((i) => line(`M${10 + i * 20} ${y} L${10 + i * 20} ${y + 10}`, C.grey2, 1)));
const cornerFlag = (x: number, y: number) => all(line(`M${x} ${y} L${x} ${y - 22}`, C.ink, 1.6), path(`M${x} ${y - 22} L${x + 10} ${y - 18} L${x} ${y - 14} Z`, C.yellow, C.ink, 1));
const stopwatch = (x: number, y: number, r: number, from: number, to: number, col: string = HL) => {
  const pt = (m: number) => { const a = (m / 60) * Math.PI * 2 - Math.PI / 2; return [f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r)]; };
  const [ax, ay] = pt(from), [bx, by] = pt(to);
  return all(rect(x - 3, y - r - 7, 6, 5, C.grey, 1, C.ink, 1.2), circle(x, y, r, C.white, C.ink, 2), path(`M${x} ${y} L${ax} ${ay} A${r} ${r} 0 ${to - from > 30 ? 1 : 0} 1 ${bx} ${by} Z`, col, C.ink, 1),
    ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r - 3))} ${f1(y + Math.sin(a) * (r - 3))} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`, C.ink, 1); }));
};

const KIT_A = { top: C.red, leg: C.white, sock: C.red };
const KIT_B = { top: C.denim, leg: C.navy, sock: C.denim };
const KEEP = { top: C.yellow, leg: C.black, sock: C.yellow, gloves: C.green };

export const BALLSP_MOTIFS: Record<string, Svg> = {
  // ── 4631 Fotboll ─────────────────────────────────────────────────
  // boll: one striped ball that bounces on the ground (its shadow stays)
  'ballsp.boll': all(rect(0, 0, 120, 120, '#f3efe6', 0, null), line('M8 108 L112 108', C.grey2, 2), ellipse(60, 108, 22, 4, '#00000022', null),
    moving('bsboll', '0%,100%{transform:translate(0,0)}45%{transform:translate(0,-34px)}', { dur: 1.4 },
      circle(60, 80, 26, C.white, C.ink, 2.2), path('M60 54 C46 64 46 96 60 106 C52 96 52 64 60 54 Z', C.red, C.ink, 1.4), path('M60 54 C74 64 74 96 60 106 C68 96 68 64 60 54 Z', C.denim, C.ink, 1.4), path('M35 74 Q60 82 85 74', 'none', C.yellow, 3), ellipse(50, 66, 5, 3, '#ffffff99', null))),
  // spela (spel och sport): two children kick a ball between them on the grass
  'ballsp.spela.2': all(outdoor(76), pl(24, 108, 0.62, KICK, { ...KIT_A, hs: 'long', hair: '#6b4a2b' }), pl(96, 108, 0.62, pose({ ...CATCH, aL: [[-9, -58], [-14, -50]], aR: [[9, -58], [14, -50]], lL: [[-4, -22], [-6, -1]], lR: [[4, -22], [6, -1]] }), { ...KIT_B }),
    flyIn('bsspela', -50, 0, 2.4, fball(78, 104, 4.6)), line('M38 102 L70 102', HL, 1.6, '3 3')),
  // fotboll: a match – white goal, keeper, attacker shooting, the ball on its way
  'ballsp.fotboll': all(outdoor(64), fgoal(70, 36, 44, 92), pl(92, 92, 0.5, KEEPER, KEEP), pl(30, 112, 0.66, KICK, KIT_A), fball(52, 92, 5), motionLines(52, 92, 18, -6), pl(70, 112, 0.6, pose({ ...RUN, n: [-5, -69], aL: [[-13, -60], [-18, -67]], aR: [[7, -58], [14, -51]] }), { ...KIT_B, grey: false })),
  // match: two teams face each other on the pitch under a scoreboard
  'ballsp.match': all(outdoor(66), scoreboard(60, 20, '2', '1'), ...[14, 32, 50].map((x) => pl(x, 108, 0.48, pose({ aR: [[7, -56], [10, -44]] }), KIT_A)), ...[70, 88, 106].map((x) => pl(x, 108, 0.48, STAND, KIT_B)), fball(60, 104, 4)),
  // lag (i sport): five players in the same shirt, arms on each other's shoulders, framed
  'ballsp.lag.2': all(outdoor(70), frame(6, 30, 108, 84), ...[18, 39, 60, 81, 102].map((x, i) => pl(x, 110, 0.6, pose({ aL: [[-12, -66], [-20, -66]], aR: [[12, -66], [20, -66]] }), { ...KIT_A, num: String(i + 2), hs: i % 2 ? 'long' : 'short', hair: i === 2 ? '#c4542a' : C.hair })), fball(60, 20, 7)),
  // spelare: one player in kit with the ball at the foot, ring round him
  'ballsp.spelare': all(outdoor(72), greyed(pl(20, 108, 0.5, STAND, KIT_B), pl(102, 108, 0.5, STAND, KIT_B)), pl(60, 110, 0.95, pose({ aL: [[-10, -56], [-14, -44]], aR: [[10, -56], [14, -44]], lR: [[6, -21], [10, -1]] }), { ...KIT_A, num: '9' }), fball(76, 106, 6), ring(60, 66, 44)),
  // plan (för sport): the football pitch seen from above, lines and goals
  'ballsp.plan.2': all(rect(0, 0, 120, 120, '#e6efe2', 0, null), pitchTop(10, 24, 100, 72), frame(5, 19, 110, 82)),
  // mål (i sport): symbol – the ball in the bulging net behind the line, the score goes up by one
  'ballsp.mål.3': all(outdoor(80), fgoal(24, 30, 72, 100), path('M28 100 C40 104 80 104 92 100', 'none', '#ffffffaa', 1), fball(70, 86, 8), ring(70, 86, 13), greyed(scoreboard(30, 14, '0', '0', C.red, C.denim, 40)), arrow(52, 14, 66, 14, HL, 2.6), scoreboard(90, 14, '1', '0', C.red, C.denim, 40)),
  // målvakt: the keeper in a different shirt and gloves, alone in front of the goal, arms wide
  'ballsp.målvakt': all(outdoor(60), fgoal(14, 30, 92, 96), pl(60, 106, 0.82, KEEPER, KEEP), ring(60, 70, 34), fball(100, 106, 4)),
  // sparka: the kicking leg swings through and the ball flies away
  'ballsp.sparka': all(outdoor(80), swingFrom('bssparkleg', 42, 76.8, 70, 1.8, kickLeg(42, 112, 0.8, KICK.h, KICK.lR, KIT_A)), pl(42, 112, 0.8, { ...KICK, lR: KICK.lL }, KIT_A), moving('bssparkball', '0%,40%{transform:translate(-14px,10px)}80%,100%{transform:translate(0,0)}', { dur: 1.8 }, fball(84, 82, 6)), motionLines(84, 82, 16, -6, HL)),
  // passa (i sport): a player passes the ball along the ground to a teammate in the same shirt
  'ballsp.passa.4': all(outdoor(74), pl(22, 110, 0.6, KICK, KIT_A), pl(98, 110, 0.6, pose({ aR: [[7, -60], [3, -48]], aL: [[-8, -60], [-14, -66]] }), KIT_A), line('M42 106 L86 106', HL, 1.8, '4 3'), flyIn('bspassa', -46, 0, 2.2, fball(86, 106, 4.6)), arrow(70, 98, 84, 98, HL, 2.2)),
  // skott (i sport): a shot – the ball races towards the corner of the goal, past the keeper's hands
  'ballsp.skott.3': all(outdoor(66), fgoal(64, 34, 52, 96), pl(84, 96, 0.5, pose({ ...KEEPER, aL: [[-14, -68], [-22, -60]] }), KEEP), pl(22, 112, 0.66, KICK, KIT_A), fball(104, 46, 5), line('M44 96 Q74 60 100 48', HL, 2, '4 3'), ring(104, 46, 9)),
  // nicka (i fotboll): a player jumps and heads the ball, which flies away from the forehead
  'ballsp.nicka.2': all(outdoor(80), waBob('bsnickbody', 4, pl(52, 108, 0.86, HEAD, KIT_A)), moving('bsnickball', '0%,30%{transform:translate(-22px,4px)}75%,100%{transform:translate(0,0)}', { dur: 2 }, fball(90, 20, 6)), motionLines(90, 20, 20, -10, HL), ring(56, 30, 14)),
  // oavgjort: symbol – the scoreboard shows the same number for both, an equals sign; grey reference: a win 2–1
  'ballsp.oavgjort': all(rect(0, 0, 120, 120, '#eef2f4', 0, null), greyed(scoreboard(30, 22, '2', '1', C.red, C.denim, 44)), greyed(star(16, 6, 5, C.gold)),
    scoreboard(60, 70, '1', '1', C.red, C.denim, 80), num(60, 104, '=', 26, HL), rect(18, 46, 84, 48, 'none', 4, HL, 2.6),
    pl(18, 116, 0.32, SAD, KIT_A), pl(102, 116, 0.32, SAD, KIT_B)),
  // halvlek: a stopwatch with the first 45 minutes coloured, and a line through the middle of the match
  'ballsp.halvlek': all(rect(0, 0, 120, 120, '#f1f4ee', 0, null), stopwatch(60, 50, 34, 0, 45), num(60, 112, '45', 16, HL), pitchTop(6, 96, 34, 20), rect(6, 96, 17, 20, '#e4572e66', 0, null), greyed(pitchTop(80, 96, 34, 20))),
  // frispark: the ball on the grass, a wall of defenders, the referee's whistle, a player taking the kick
  'ballsp.frispark': all(outdoor(66), fgoal(84, 40, 34, 90), ...[58, 66, 74].map((x) => pl(x, 100, 0.5, pose({ aL: [[-4, -50], [0, -40]], aR: [[4, -50], [0, -40]] }), KIT_B)), pl(24, 112, 0.64, KICK_BACK, KIT_A), fball(40, 108, 5), ring(40, 108, 9),
    pl(104, 112, 0.5, pose({ aL: [[-10, -62], [-16, -70]] }), { top: C.black, leg: C.black, sock: C.black }), whistle(98, 79)),
  // hörna (i fotboll): the ball by the corner flag, a player about to kick it into the box
  'ballsp.hörna.2': all(outdoor(60), path('M0 112 L0 96 A16 16 0 0 1 16 112 Z', 'none', C.white, 1.6), line('M0 112 L120 112', C.white, 2), cornerFlag(8, 108), fball(12, 104, 5), ring(12, 104, 9), pl(30, 112, 0.6, KICK_BACK, { ...KIT_A }),
    greyed(fgoal(80, 46, 36, 84), pl(92, 84, 0.4, STAND, KEEP), pl(74, 96, 0.44, STAND, KIT_B))),
  // straff (sport): only the shooter, the ball on the spot and the keeper in the goal
  'ballsp.straff.2': all(outdoor(66), fgoal(20, 36, 80, 92), pl(60, 92, 0.52, KEEPER, KEEP), ellipse(60, 104, 3, 1.2, C.white, null), fball(60, 100, 5), ring(60, 100, 9), pl(84, 116, 0.62, pose({ ...KICK_BACK, n: [-3, -69], aL: [[-12, -60], [-18, -54]], aR: [[10, -60], [18, -64]] }), KIT_A)),
  // offside: symbol – seen from above, the attacker (orange ring) is past the last defender's line when the pass is played; the flag goes up
  'ballsp.offside': all(rect(0, 0, 120, 120, '#e6efe2', 0, null), rect(6, 10, 92, 106, GRASS, 2, C.ink, 1.6), ...[0, 2, 4].map((k) => rect(6, 10 + k * 21, 92, 10.5, GRASS2, 0, null)), rect(6, 10, 92, 106, 'none', 2, C.white, 1.4),
    rect(26, 10, 48, 18, 'none', 0, C.white, 1.4), rect(38, 4, 24, 7, C.white, 0, C.ink, 1.2), line('M6 110 L98 110', C.white, 1.4),
    line('M2 54 L104 54', C.ink, 5.4), line('M2 54 L104 54', HL, 3.4, '8 4'),
    circle(50, 18, 5, C.yellow, C.ink, 1.2), circle(30, 54, 5.5, C.denim, C.ink, 1.4), circle(74, 54, 5.5, C.denim, C.ink, 1.4),
    circle(40, 94, 5.5, C.red, C.ink, 1.4), fball(47, 88, 3.2), line('M47 88 L59 46', C.ink, 1.6, '3 3'), arrow(55, 60, 59, 46, C.ink, 2),
    circle(60, 36, 5.5, C.red, C.ink, 1.4), ring(60, 36, 10),
    pl(110, 64, 0.42, pose({ aL: [[-7, -56], [-9, -43]], aR: [[6, -80], [8, -94]] }), { top: C.black, leg: C.black, sock: C.black }),
    line('M113.4 25 L113.4 8', C.ink, 1.6), path('M113.4 8 L101 11 L113.4 15 Z', C.yellow, C.ink, 1), path('M107 9.5 L101 11 L107 12.6 Z', C.red, null)),

  // ── 4632 Basketboll ──────────────────────────────────────────────
  // basket: a player jumps and puts the ball in the hoop in a hall
  'ballsp.basket': all(hall(84), hoop(86, 40), pl(60, 104, 0.74, SHOOT, { top: C.orange, leg: C.orange, sock: C.white, num: '7' }), bball(78, 30, 5), greyed(pl(24, 112, 0.6, pose({ aL: [[-6, -80], [-2, -92]] }), { top: C.denim, leg: C.denim }))),
  // korg (i basket): close-up of the ring with its net on the board, the ball dropping through
  'ballsp.korg.2': all(rect(0, 0, 120, 120, '#e9ecef', 0, null), rect(70, 14, 40, 56, C.white, 2, C.ink, 2), rect(80, 34, 20, 16, 'none', 0, C.red, 2), line('M92 52 L100 52', C.dark, 4),
    path('M48 52 L54 88 L84 88 L90 52', 'none', C.white, 2), line('M56 52 L60 88 M64 52 L66 88 M72 52 L72 88 M80 52 L78 88 M51 62 L87 62 M53 74 L85 74', C.white, 1.2), path('M48 52 L54 88 L84 88 L90 52', 'none', C.grey, 0.6),
    ellipse(69, 52, 21, 5, 'none', C.ink, 4.6), ellipse(69, 52, 21, 5, 'none', HL, 3), bball(68, 66, 10)),
  // dribbla: the ball bounces between the hand and the floor while the player runs
  'ballsp.dribbla': all(hall(80), pl(54, 110, 0.86, DRIBBLE, { top: C.orange, leg: C.orange, sock: C.white }), moving('bsdribb', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-26px)}', { dur: 0.9 }, bball(72, 104, 5.5)), ellipse(72, 110, 6, 1.6, '#00000033', null)),
  // skjuta (i sport): the ball leaves the hands in an arc towards the hoop
  'ballsp.skjuta.3': all(hall(84), hoop(94, 34), pl(30, 110, 0.78, SHOOT, { top: C.orange, leg: C.orange, sock: C.white }), line('M40 36 Q64 4 88 30', HL, 1.8, '4 3'), flyIn('bsskjut', -44, 6, 2.2, bball(84, 26, 5))),
  // trepoängare: the player shoots from behind the curved line far from the hoop; the digit 3 above
  'ballsp.trepoängare': all(hall(70), path('M0 106 C30 74 90 74 120 106', 'none', C.white, 2.4), hoop(96, 32), pl(22, 112, 0.66, SHOOT, { top: C.orange, leg: C.orange, sock: C.white }), bball(30, 48, 4.6), line('M30 48 Q60 0 92 28', HL, 1.6, '4 3'), circle(56, 18, 10, C.white, HL, 2.6), num(56, 24, '3', 16, HL)),
  // straffkast: one player alone at the line in front of the hoop, the others wait along the sides; the digit 1
  'ballsp.straffkast': all(hall(74), path('M40 112 L52 80 L76 80 L88 112', 'none', C.white, 2), line('M50 84 L78 84', HL, 3), hoop(64, 30), pl(64, 84, 0.52, pose({ aL: [[-4, -58], [2, -64]], aR: [[6, -58], [2, -64]] }), { top: C.orange, leg: C.orange, sock: C.white }), bball(66, 46, 4),
    ...[[30, 106], [98, 106], [34, 96], [94, 96]].map(([x, y], i) => greyed(pl(x!, y!, 0.44, STAND, { top: i % 2 ? C.denim : C.orange }))), circle(18, 20, 9, C.white, HL, 2.4), num(18, 25, '1', 14, HL)),
  // vinna: the winner jumps with both arms up beside a cup; the grey losers stand still
  'ballsp.vinna': all(hall(86), greyed(pl(92, 110, 0.6, SAD, KIT_B), pl(108, 110, 0.56, SAD, KIT_B)),
    waBob('bsvinn', 8, pl(46, 108, 0.86, CHEER, { top: C.orange, leg: C.orange, sock: C.white, mouth: 'open' })), g('translate(76 66)', path('M-8 -12 L8 -12 L6 0 C4 4 -4 4 -6 0 Z', C.gold, C.ink, 1.4), path('M-8 -10 C-14 -10 -14 -2 -6 -2 M8 -10 C14 -10 14 -2 6 -2', 'none', C.ink, 1.4), rect(-2, 3, 4, 5, C.gold, 0, C.ink, 1), rect(-7, 8, 14, 4, C.brown, 1, C.ink, 1.2)), star(20, 22, 6, C.gold), star(100, 20, 5, C.gold)),
  // förlora (spel och sport): the player hangs his head, the grey winners cheer behind
  'ballsp.förlora.2': all(hall(86), greyed(pl(86, 106, 0.56, CHEER, KIT_B), pl(106, 106, 0.52, CHEER, KIT_B)), scoreboard(32, 22, '70', '75', C.orange, C.denim, 50),
    rotAbout('bsforl', 46, 72, 6, 2.6, pl(46, 110, 0.86, SAD, { top: C.orange, leg: C.orange, sock: C.white, mouth: 'frown' })), path('M40 56 Q41 60 40 62', 'none', C.sky, 1.6)),
  // övertid (i sport): symbol – the full match time (grey) and an extra orange piece of five minutes, the score level
  'ballsp.övertid.2': all(rect(0, 0, 120, 120, '#eef2f4', 0, null), greyed(stopwatch(40, 56, 26, 0, 59.9, C.grey)), stopwatch(92, 56, 18, 0, 5), num(66, 62, '+', 22, HL), num(92, 100, '5', 18, HL), scoreboard(40, 104, '80', '80', C.orange, C.denim, 44)),
  // timeout: the team in a huddle round the coach and her tactics board, the clock stopped
  'ballsp.timeout': all(hall(84), rect(48, 50, 26, 20, C.white, 2, C.ink, 1.6), circle(54, 56, 2, C.red, null), circle(66, 62, 2, C.red, null), circle(58, 66, 2, C.denim, null), arrow(55, 58, 64, 61, C.ink, 1.4),
    pl(60, 112, 0.58, pose({ aL: [[-8, -58], [-12, -64]], aR: [[8, -58], [0, -60]] }), { top: C.dark, leg: C.dark, shorts: false, hs: 'long' }), ...[[24, 112], [38, 108], [84, 108], [98, 112]].map(([x, y]) => pl(x!, y!, 0.54, pose({ aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]] }), { top: C.orange, leg: C.orange, sock: C.white })),
    rect(84, 10, 30, 16, C.black, 2, C.ink, 1.2), num(99, 23, '2:00', 9, C.yellow), frame(42, 44, 38, 30)),
  // försvar (i sport): three defenders stand like a wall in front of their own basket, arms out, facing the attacker
  'ballsp.försvar.2': all(hall(80), hoop(14, 36), ...[42, 56, 70].map((x, i) => pl(x, 108 - i * 2, 0.58, pose({ h: [0, -38], n: [0, -62], aL: [[-12, -60], [-22, -62]], aR: [[12, -60], [22, -62]], lL: [[-9, -19], [-11, -1]], lR: [[9, -19], [11, -1]] }), { top: C.denim, leg: C.denim, sock: C.white })),
    greyed(pl(102, 110, 0.6, pose({ ...DRIBBLE, n: [-6, -63], aR: [[-14, -52], [-19, -40]], aL: [[6, -54], [10, -46]] }), { top: C.orange, leg: C.orange }), bball(90, 102, 4)), frame(30, 52, 54, 62)),
  // anfall (i sport): the team with the ball runs towards the other basket, orange arrows forward
  'ballsp.anfall.2': all(hall(80), hoop(100, 36), pl(30, 110, 0.6, RUN, { top: C.orange, leg: C.orange, sock: C.white }), pl(52, 104, 0.56, DRIBBLE, { top: C.orange, leg: C.orange, sock: C.white }), bball(63, 102, 4), pl(16, 100, 0.5, RUN, { top: C.orange, leg: C.orange, sock: C.white }),
    arrow(36, 64, 60, 58, HL, 3), arrow(66, 72, 86, 62, HL, 3), arrow(20, 78, 42, 74, HL, 3), greyed(pl(88, 108, 0.54, STAND, { top: C.denim }))),
  // retur (i basket): the missed shot bounces off the ring and one player reaches it first
  'ballsp.retur.2': all(hall(86), hoop(70, 30), bball(56, 18, 5), ring(56, 18, 9), path('M66 28 Q62 18 58 20', 'none', C.ink, 1.2, ), greyed(pl(78, 108, 0.66, JUMP_UP, { top: C.denim })), pl(48, 104, 0.72, pose({ ...JUMP_UP, aR: [[6, -84], [10, -96]] }), { top: C.orange, leg: C.orange, sock: C.white })),

  // ── 4633 Handboll ────────────────────────────────────────────────
  // handboll: a jump throw at the red-and-white goal, the keeper reaching
  'ballsp.handboll': all(hall(82), hgoal(76, 46, 40, 96), pl(96, 96, 0.5, KEEPER, { top: C.green, leg: C.green, sock: C.green }), pl(42, 98, 0.72, pose({ ...THROW, lL: [[6, -24], [4, -8]], lR: [[-6, -22], [-12, -10]] }), { top: C.red, leg: C.black, sock: C.red }), hball(32, 32, 5), path('M0 108 C30 92 50 92 70 108', 'none', C.white, 1.6, )),
  // kasta (med armen): the throwing arm swings forward and the ball flies out of the hand
  'ballsp.kasta': all(rect(0, 0, 120, 120, '#eef3f7', 0, null), line('M4 112 L116 112', C.grey2, 2), pl(36, 112, 0.92, THROWN, { top: C.sky, leg: C.navy, shorts: false }), flyIn('bskastball', -40, -10, 2, hball(96, 44, 6)), motionLines(96, 44, 18, 0, HL)),
  // fånga (ta emot): the ball flies in and lands between the two outstretched hands
  'ballsp.fånga.2': all(rect(0, 0, 120, 120, '#eef3f7', 0, null), line('M4 112 L116 112', C.grey2, 2), mirrorPl(80, 112, 0.92, CATCH, { top: C.green, leg: C.navy, shorts: false }), flyIn('bsfanga', -56, 6, 2, hball(55, 52, 6)), ring(55, 52, 11)),
  // passning: the ball travels in an arc from one handball player to a teammate
  'ballsp.passning': all(hall(84), pl(22, 112, 0.62, THROWN, { top: C.red, leg: C.black, sock: C.red }), mirrorPl(98, 112, 0.62, CATCH, { top: C.red, leg: C.black, sock: C.red }), path('M38 64 Q60 40 84 62', 'none', HL, 1.8, ), flyIn('bspassn', -40, 6, 2.2, hball(84, 62, 4.6))),
  // hoppskott: the player throws from high in the air over the raised arms of the defence
  'ballsp.hoppskott': all(hall(86), hgoal(84, 56, 34, 100), greyed(pl(60, 110, 0.6, BLOCK, { top: C.denim }), pl(72, 110, 0.6, BLOCK, { top: C.denim })), pl(32, 82, 0.72, pose({ ...THROW, lL: [[6, -24], [4, -6]], lR: [[-6, -24], [-12, -8]] }), { top: C.red, leg: C.black, sock: C.red }), hball(22, 16, 5), arrow(32, 112, 32, 92, HL, 2.4)),
  // fint: the attacker shows one way (grey ghost) and goes the other; the defender leans the wrong way
  'ballsp.fint': all(hall(86), greyed(pl(44, 110, 0.7, pose({ ...RUN, n: [-4, -68], h: [-2, -44] }), { top: C.red })), path('M50 30 C40 26 34 30 30 36', 'none', C.grey, 1.6, ), pl(70, 110, 0.74, pose({ ...RUN }), { top: C.red, leg: C.black, sock: C.red }), hball(86, 64, 4.6), arrow(78, 30, 100, 30, HL, 3),
    pl(26, 110, 0.66, pose({ h: [0, -40], n: [-10, -64], aL: [[-18, -58], [-26, -54]], aR: [[-2, -58], [-8, -50]], lL: [[-8, -20], [-12, -1]], lR: [[6, -20], [6, -1]] }), { top: C.denim, leg: C.navy, mouth: 'open' })),
  // målgård: seen from above, the curved goal area in front of the goal is orange; only the keeper is inside
  'ballsp.målgård': all(rect(0, 0, 120, 120, '#e8ece6', 0, null), rect(6, 10, 108, 100, FLOOR, 2, C.ink, 1.6), path('M20 10 C20 54 100 54 100 10 Z', '#e4572e55', HL, 2.6), path('M8 10 C8 70 112 70 112 10', 'none', C.white, 1.6, ), rect(48, 4, 24, 7, C.white, 0, C.red, 2),
    circle(60, 22, 5, C.green, C.ink, 1.2), ...[[22, 66], [44, 78], [74, 78], [98, 66], [60, 92]].map(([x, y]) => circle(x!, y!, 5, C.red, C.ink, 1.2)), ...[[30, 50], [52, 56], [70, 56], [90, 50]].map(([x, y]) => circle(x!, y!, 5, C.denim, C.ink, 1.2)), hball(62, 88, 2.6)),
  // räddning (i sport): the shot flies in and the keeper's glove stops it in a dive
  'ballsp.räddning.2': all(hall(88), hgoal(14, 40, 92, 104), g('rotate(-28 60 80)', pl(60, 112, 0.74, pose({ ...KEEPER, aR: [[16, -72], [28, -80]] }), { top: C.green, leg: C.green, sock: C.green, gloves: C.yellow })), flyIn('bsradd', 50, 10, 1.8, hball(92, 44, 5.4)), ring(92, 44, 10)),
  // frikast: the player throws from the dashed line; the defenders stand at a distance; the referee points
  'ballsp.frikast': all(hall(74), line('M0 104 C30 84 90 84 120 104', C.white, 2, '5 4'), hgoal(40, 34, 40, 74), pl(60, 112, 0.6, pose({ aL: [[-8, -60], [-14, -54]], aR: [[6, -74], [4, -88]] }), { top: C.red, leg: C.black, sock: C.red }), hball(64, 56, 4.4), ring(64, 56, 8),
    ...[34, 50, 70, 86].map((x) => greyed(pl(x, 92, 0.46, BLOCK, { top: C.denim }))), pl(106, 112, 0.52, pose({ aL: [[-12, -66], [-24, -70]] }), { top: C.black, leg: C.black, sock: C.black }), whistle(110, 75)),
  // kontring: seen from above, a player runs alone and fast towards the far goal; the others are far behind
  'ballsp.kontring': all(rect(0, 0, 120, 120, '#e8ece6', 0, null), rect(6, 18, 108, 84, FLOOR, 2, C.ink, 1.6), line('M60 18 L60 102', C.white, 1.4), rect(2, 50, 4, 20, C.white, 0, C.red, 1.6), rect(114, 50, 4, 20, C.white, 0, C.red, 1.6),
    path('M6 40 C24 40 24 80 6 80 M114 40 C96 40 96 80 114 80', 'none', C.white, 1.4), ...[[16, 34], [22, 54], [16, 74], [30, 88], [34, 42]].map(([x, y]) => greyed(circle(x!, y!, 5, C.denim, C.ink, 1.2), circle(x! + 8, y! + 6, 5, C.red, C.ink, 1.2))),
    circle(92, 58, 6, C.red, C.ink, 1.4), hball(98, 62, 2.6), arrow(48, 58, 84, 58, HL, 3.4), arrow(36, 58, 50, 58, HL, 3.4)),

  // ── 4634 Volleyboll ──────────────────────────────────────────────
  // volleyboll: indoor game – the high net, a player on each side, the ball over the tape
  'ballsp.volleyboll': all(hall(90), vnet(60, 36, 26), pl(30, 112, 0.72, pose({ aL: [[-2, -84], [2, -96]], aR: [[6, -84], [6, -96]] }), { top: C.yellow, leg: C.navy, sock: C.white }), mirrorPl(94, 112, 0.72, BLOCK, { top: C.denim, leg: C.navy, sock: C.white }), vball(52, 22, 6), ...[14, 106].map((x) => greyed(pl(x, 112, 0.5, STAND, { top: x < 60 ? C.yellow : C.denim })))),
  // nät (av trådar): close-up of a knotted net with square holes, a ball pressed into it; a little fishing net as reference
  'ballsp.nät': all(rect(0, 0, 120, 120, '#eef3f7', 0, null), line('M8 14 L8 108 M112 14 L112 108', C.dark, 4), rect(8, 18, 104, 4, C.white, 0, C.ink, 1),
    ...range(12).map((i) => line(`M${14 + i * 8} 22 Q${14 + i * 8 + (i > 4 && i < 8 ? 3 : 0)} 50 ${14 + i * 8} 78`, C.ink, 1.1)), ...range(8).map((i) => line(`M8 ${26 + i * 7} Q60 ${26 + i * 7 + (i > 2 && i < 6 ? 4 : 0)} 112 ${26 + i * 7}`, C.ink, 1.1)),
    vball(60, 50, 9), frame(4, 14, 112, 68), greyed(path('M20 112 L30 92 L42 92 L52 112 Z', 'none', C.ink, 1.4), line('M26 104 L46 104 M24 108 L48 108 M32 92 L28 112 M40 92 L44 112', C.ink, 1), line('M36 92 L36 84', C.brown, 3))),
  // serva (i volleyboll): the server throws the ball up and hits it over her head; the ball flies off
  'ballsp.serva.3': all(hall(90), vnet(108, 40, 24), pl(36, 112, 0.86, SERVE_UP, { top: C.yellow, leg: C.navy, sock: C.white }), moving('bsserva', '0%,30%{transform:translate(-6px,8px)}75%,100%{transform:translate(0,0)}', { dur: 2.2 }, vball(50, 18, 5.5)), motionLines(50, 18, 18, -2, HL), line('M8 112 L20 112', C.white, 3)),
  // smasha: the player jumps above the net and hits the ball steeply down into the floor on the other side
  'ballsp.smasha': all(hall(94), vnet(66, 34, 26), pl(48, 92, 0.78, SMASH, { top: C.yellow, leg: C.navy, sock: C.white }), line('M52 18 L92 108', HL, 1.8, '4 3'), flyIn('bssmash', -36, -82, 1.4, vball(92, 106, 5.5)), path('M84 112 L88 104 M100 112 L96 104', 'none', HL, 1.6, )),
  // blockera (i volleyboll): two players jump at the net with their arms up; the ball bounces back off their hands
  'ballsp.blockera.3': all(hall(94), vnet(60, 40, 26), waBob('bsblock', 6, pl(70, 106, 0.74, BLOCK, { top: C.denim, leg: C.navy, sock: C.white }), pl(86, 106, 0.74, BLOCK, { top: C.denim, leg: C.navy, sock: C.white })),
    greyed(pl(40, 104, 0.72, SMASH, { top: C.yellow })), moving('bsblockball', '0%,30%{transform:translate(18px,4px)}75%,100%{transform:translate(0,0)}', { dur: 1.8 }, vball(46, 30, 5.5)), arrow(64, 22, 52, 30, HL, 2.6), frame(62, 14, 34, 46)),
  // dyka (kasta sig): the player throws herself flat and gets her arms under the ball just above the floor
  'ballsp.dyka.2': all(hall(84), flyIn('bsdyka', -30, -14, 1.8, g('rotate(74 22 104)', pl(22, 104, 0.82, pose({ aL: [[6, -80], [10, -92]], aR: [[2, -80], [6, -92]], lL: [[-3, -22], [-4, -1]], lR: [[4, -22], [8, -2]] }), { top: C.yellow, leg: C.navy, sock: C.white }))), vball(108, 96, 5.5), ring(108, 96, 10), line('M8 112 L40 112', C.grey, 1.4, '2 3')),
  // beachvolley: two against two on sand by the sea, sun, low posts
  'ballsp.beachvolley': all(sky('#bfe3f5'), rect(0, 52, 120, 16, '#5aa7d6', 0, null), rect(0, 66, 120, 54, SAND, 0, null), circle(102, 18, 9, C.yellow, C.ink, 1.4), vnet(60, 40, 22),
    pl(20, 110, 0.54, pose({ aL: [[-3, -84], [0, -96]], aR: [[4, -84], [6, -96]] }), { top: C.red, leg: C.red, sock: C.skin, sleeves: false, shoe: C.skin }), pl(40, 108, 0.54, STAND, { top: C.red, leg: C.red, sock: C.skin, sleeves: false, shoe: C.skin }),
    mirrorPl(82, 108, 0.54, BLOCK, { top: C.denim, leg: C.denim, sock: C.skin, sleeves: false, shoe: C.skin }), mirrorPl(100, 110, 0.54, STAND, { top: C.denim, leg: C.denim, sock: C.skin, sleeves: false, shoe: C.skin }), vball(36, 30, 5)),

  // ── 4635 Tennis och padel ────────────────────────────────────────
  // tennis: a player on a clay court hits the yellow ball over the low net to the other player
  'ballsp.tennis': all(sky('#e3f0e6'), rect(0, 84, 120, 36, CLAY, 0, null), line('M0 84 L120 84', C.ink, 1.2), line('M4 110 L116 110', C.white, 1.6), tnet(60, 112, 14),
    pl(28, 112, 0.66, FORE, { top: C.white, leg: C.white, sock: C.white, hs: 'band' }), racket(44, 75, -20, 'tennis', C.red, 0.9), tball(56, 66), greyed(mirrorPl(96, 112, 0.6, STAND, { top: C.navy }))),
  // racket: the tennis racket close-up with strings and grip, a ball on it
  'ballsp.racket': all(rect(0, 0, 120, 120, '#f2f0e8', 0, null), racket(16, 98, -45, 'tennis', C.red, 2.6), tball(92, 28, 7), ring(70, 46, 30)),
  // tennisbana: the court seen from above: blue surface, white lines, the net across the middle
  'ballsp.tennisbana': all(rect(0, 0, 120, 120, '#e6efe2', 0, null), tennisTop(14, 20, 92, 80), frame(6, 12, 108, 96)),
  // slag (i sport): three small panels with three different shots, each with an orange swing arc and the ball leaving
  'ballsp.slag.2': all(rect(0, 0, 120, 120, '#f3efe6', 0, null), ...[0, 1, 2].map((i) => all(rect(4 + i * 38, 24, 36, 72, CLAY, 3, C.ink, 1.4), line(`M${6 + i * 38} 90 L${38 + i * 38} 90`, C.white, 1))),
    pl(18, 90, 0.48, FORE, { top: C.white, leg: C.white, sock: C.white }), racket(29, 63, -20, 'tennis', C.red, 0.7), path('M10 70 Q20 52 34 58', 'none', HL, 2), tball(36, 52, 2.6),
    pl(60, 90, 0.48, BACK2, { top: C.white, leg: C.white, sock: C.white }), racket(52, 65, 200, 'tennis', C.red, 0.7), path('M66 72 Q56 54 44 60', 'none', HL, 2), tball(44, 50, 2.6),
    pl(98, 90, 0.48, SERVE_UP, { top: C.white, leg: C.white, sock: C.white }), racket(98, 44, -70, 'tennis', C.red, 0.7), path('M88 56 Q96 26 110 34', 'none', HL, 2), tball(108, 28, 2.6)),
  // serve: at the baseline the player throws the ball high and reaches up with the racket
  'ballsp.serve': all(sky('#e3f0e6'), rect(0, 84, 120, 36, HARD, 0, null), line('M0 110 L60 110', C.white, 2), line('M30 104 L30 112', C.white, 2), tnet(104, 112, 14),
    pl(36, 110, 0.86, SERVE_UP, { top: C.white, leg: C.navy, sock: C.white, hs: 'cap' }), racket(30, 30, -100, 'tennis', C.red, 1), tball(41, 10, 3.6), ring(41, 10, 7), line('M41 16 L41 26', HL, 1.4, '2 2')),
  // dubbelfel (i tennis): two serves, numbered 1 and 2, both go into the net – two red crosses
  'ballsp.dubbelfel': all(rect(0, 0, 120, 120, '#f1f4ee', 0, null), ...[0, 1].map((i) => all(rect(6 + i * 56, 20, 52, 60, HARD, 3, C.ink, 1.4), tnet(46 + i * 56, 80, 14), pl(18 + i * 56, 80, 0.42, SERVE_UP, { top: C.white, leg: C.navy, sock: C.white }), line(`M${22 + i * 56} 46 Q${34 + i * 56} 50 ${44 + i * 56} 70`, C.ink, 1.2, '3 2'), tball(44 + i * 56, 70, 2.6), cross(44 + i * 56, 58, 5), num(18 + i * 56, 98, String(i + 1), 13))),
    rect(30, 104, 60, 12, 'none', 3, HL, 2.2), num(48, 114, '0', 10, C.ink), num(72, 114, '15', 10, HL), arrow(54, 110, 64, 110, HL, 1.6)),
  // ess (i tennis): the serve lands in the corner and flies past the opponent, who cannot reach it
  'ballsp.ess.2': all(sky('#e3f0e6'), rect(0, 84, 120, 36, HARD, 0, null), line('M4 110 L116 110', C.white, 1.6), tnet(30, 112, 14),
    mirrorPl(80, 112, 0.7, pose({ ...FORE, n: [6, -66], aR: [[16, -58], [26, -52]], lR: [[12, -20], [20, -1]] }), { top: C.navy, leg: C.navy, sock: C.white, mouth: 'open' }), racket(58, 75, 160, 'tennis', C.grey, 0.8), line('M8 70 Q60 60 104 106', HL, 1.8, '4 3'), tball(104, 104), ring(104, 104, 8), sparkleStar(110, 92)),
  // forehand: the racket and the ball are on the same side as the racket hand; palm forward, one hand
  'ballsp.forehand': all(rect(0, 0, 120, 120, '#f6efe6', 0, null), rect(0, 92, 120, 28, CLAY, 0, null), pl(48, 112, 1, FORE, { top: C.white, leg: C.white, sock: C.white, hs: 'band' }), racket(72, 56, -20, 'tennis', C.red, 1.2), tball(104, 40, 4),
    path('M66 82 Q70 50 100 46', 'none', HL, 2.4), arrow(90, 47, 101, 44, HL, 2.4), ring(72, 56, 8)),
  // backhand: the racket is taken across the body to the other side and held with both hands
  'ballsp.backhand': all(rect(0, 0, 120, 120, '#f6efe6', 0, null), rect(0, 92, 120, 28, CLAY, 0, null), pl(68, 112, 1, BACK2, { top: C.white, leg: C.white, sock: C.white, hs: 'band' }), racket(51, 60, 200, 'tennis', C.red, 1.2), tball(14, 40, 4),
    path('M56 84 Q50 52 20 46', 'none', HL, 2.4), arrow(30, 47, 19, 44, HL, 2.4), ring(54, 59, 9)),
  // volley: at the net the player meets the ball in the air; the crossed-out bounce mark shows it never touched the court
  'ballsp.volley': all(sky('#e3f0e6'), rect(0, 84, 120, 36, HARD, 0, null), tnet(84, 112, 14), pl(64, 112, 0.84, pose({ ...FORE, aR: [[14, -66], [22, -70]] }), { top: C.white, leg: C.navy, sock: C.white }), racket(83, 53, -30, 'tennis', C.red, 1), tball(104, 46), line('M118 40 L104 46', C.ink, 1.2, '3 2'),
    ellipse(100, 104, 6, 1.6, 'none', C.grey, 1.2), cross(100, 104, 4, C.red), ring(104, 46, 8)),
  // singel (sport): one player on each side of the net – one against one
  'ballsp.singel.3': all(rect(0, 0, 120, 120, '#e6efe2', 0, null), tennisTop(14, 40, 92, 60), circle(34, 70, 6, C.red, C.ink, 1.4), circle(86, 70, 6, C.denim, C.ink, 1.4), tball(60, 62, 2.4), num(34, 30, '1', 16, HL), num(86, 30, '1', 16, HL), line('M52 24 L68 24', HL, 2.4)),
  // padel: four players, two against two, in a small court with glass walls
  'ballsp.padel': all(rect(0, 0, 120, 120, '#e8eef2', 0, null), rect(0, 86, 120, 34, '#3d7fb8', 0, null), rect(4, 34, 112, 60, '#cfe6f299', 2, C.ink, 1.6), line('M4 58 L116 58', C.dark, 1.2), line('M8 40 L20 56 M96 40 L108 56', '#ffffff', 2), tnet(60, 112, 12),
    pl(18, 108, 0.5, FORE, { top: C.yellow, leg: C.navy, sock: C.white }), racket(29, 82, -20, 'padel', C.orange, 0.6), pl(42, 112, 0.5, STAND, { top: C.yellow, leg: C.navy, sock: C.white }),
    mirrorPl(80, 112, 0.5, STAND, { top: C.denim, leg: C.navy, sock: C.white }), mirrorPl(102, 108, 0.5, FORE, { top: C.denim, leg: C.navy, sock: C.white }), tball(56, 72, 2.6)),
  // padelbana: the empty court from above at an angle: glass walls (orange) and fence around a small blue court
  'ballsp.padelbana': all(rect(0, 0, 120, 120, '#ececec', 0, null), path('M14 96 L106 96 L94 34 L26 34 Z', '#3d7fb8', C.ink, 1.6), line('M20 65 L100 65', C.white, 2.6), line('M60 34 L60 96 M23 50 L97 50 M17 80 L103 80', C.white, 1),
    path('M14 96 L14 74 L26 18 L26 34 Z M106 96 L106 74 L94 18 L94 34 Z', '#e4572e44', HL, 2), path('M26 18 L94 18 L94 34 L26 34 Z', '#e4572e44', HL, 2), path('M14 74 L14 96 L106 96 L106 74', 'none', HL, 2), line('M20 52 L28 60 M98 52 L92 60', '#ffffff', 1.6)),
  // lobb: the ball goes in a high orange arc over the opponent standing at the net
  'ballsp.lobb': all(sky('#e3f0e6'), rect(0, 84, 120, 36, HARD, 0, null), tnet(64, 112, 14), pl(22, 112, 0.66, BACK2, { top: C.white, leg: C.navy, sock: C.white }), racket(13, 84, 230, 'tennis', C.red, 0.8), greyed(mirrorPl(76, 112, 0.66, pose({ aL: [[-4, -80], [0, -92]] }), { top: C.navy })),
    path('M14 66 Q60 -20 108 102', 'none', HL, 2.2, ), tball(108, 102), tball(62, 22, 3)),

  // ── 4636 Innebandy ───────────────────────────────────────────────
  // innebandyklubba: the light plastic stick with its curved blade, close-up, a ball by the blade
  'ballsp.innebandyklubba': all(rect(0, 0, 120, 120, '#eef0f3', 0, null), fstick(14, 24, 50, 90, C.white, C.navy), iball(84, 106, 5), ring(78, 96, 16)),
  // innebandyboll: the white plastic ball with many holes, big
  'ballsp.innebandyboll': all(rect(0, 0, 120, 120, '#eef0f3', 0, null), ellipse(60, 104, 26, 5, '#00000022', null), iball(60, 62, 34), ring(60, 62, 42), greyed(fstick(4, 108, -8, 30))),
  // sarg: the low white boards round the floor; the ball bounces off them back into play
  'ballsp.sarg': all(rect(0, 0, 120, 120, '#e7e9ea', 0, null), path('M6 96 L114 96 L102 40 L18 40 Z', '#2f7a5b', C.ink, 1.4), path('M6 96 L6 86 L18 32 L18 40 Z M114 96 L114 86 L102 32 L102 40 Z M18 32 L102 32 L102 40 L18 40 Z M6 86 L6 96 L114 96 L114 86', C.white, HL, 2.2),
    line('M60 40 L60 96', C.white, 1), iball(96, 70, 3.2), line('M70 82 L104 64 L84 52', HL, 1.4, '3 2'), arrow(88, 58, 84, 52, HL, 1.6)),
  // tekning: two players crouch face to face, sticks down; the referee puts the ball down between them
  'ballsp.tekning': all(hall(80), circle(60, 104, 10, 'none', C.white, 1.4), pl(34, 110, 0.7, CROUCH, { top: C.denim, leg: C.navy, sock: C.white }), fstick(46, 88, 64, 18, C.white, C.navy), mirrorPl(86, 110, 0.7, CROUCH, { top: C.red, leg: C.black, sock: C.red }), fstick(74, 88, 116, 18, C.white, C.red),
    pl(60, 82, 0.46, pose({ aR: [[6, -52], [4, -40]] }), { top: C.black, leg: C.black, sock: C.black }), flyIn('bstekn', 0, -18, 2, iball(60, 106, 3)), ring(60, 106, 7)),
  // byte (i sport): one player climbs out over the boards while a teammate in the same shirt jumps in; arrows both ways
  'ballsp.byte.3': all(hall(70), boards(84), rect(0, 94, 120, 26, '#d7cfc0', 0, null), flyIn('bsbytein', 0, 22, 2.4, pl(36, 84, 0.58, JUMP_UP, { top: C.red, leg: C.black, sock: C.red })), moving('bsbyteout', '0%,15%{transform:translate(0,-18px)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, pl(84, 116, 0.58, SAD, { top: C.red, leg: C.black, sock: C.red })),
    arrow(20, 104, 20, 76, HL, 3), arrow(102, 64, 102, 92, HL, 3)),
  // frislag: the ball lies on a spot; a player hits it; the opponents stand at a distance; the referee points
  'ballsp.frislag': all(hall(76), pl(36, 110, 0.7, STICK, { top: C.red, leg: C.black, sock: C.red }), fstick(46, 82, 70, 20, C.white, C.red), iball(56, 108, 3.2), ring(56, 108, 7), circle(56, 108, 16, 'none', C.white, 1.2, ),
    ...[80, 94].map((x) => greyed(pl(x, 104, 0.54, STAND, { top: C.denim }))), pl(108, 112, 0.5, pose({ aL: [[-12, -66], [-24, -70]] }), { top: C.black, leg: C.black, sock: C.black })),
  // slagskott: the stick swings from high behind down through the ball, which shoots off
  'ballsp.slagskott': all(hall(84), pl(46, 112, 0.84, WIND_UP, { top: C.red, leg: C.black, sock: C.red }), swingFrom('bsslag', 34, 55, 110, 1.6, fstick(34, 55, 66, 42, C.white, C.red)), flyIn('bsslagball', -30, 0, 1.6, iball(94, 104, 3.4)), motionLines(94, 104, 20, 0, HL)),
  // hemmaplan (i sport): our hall with a little house on the roof, the stands full of fans in the team colour
  'ballsp.hemmaplan': all(rect(0, 0, 120, 120, '#e3eef6', 0, null), path('M10 70 L10 40 L60 22 L110 40 L110 70 Z', '#dfd2bf', C.ink, 1.6), path('M50 26 L60 12 L70 26 L70 34 L50 34 Z', HL, C.ink, 1.6), rect(57, 27, 6, 7, C.white, 0, C.ink, 1),
    rect(0, 70, 120, 50, '#c9d3d8', 0, null), crowd(84, 9, 8, 112, [C.red]), crowd(102, 8, 14, 106, [C.red]), greyed(crowd(116, 3, 90, 112, [C.denim])), rect(48, 48, 24, 22, C.brown, 2, C.ink, 1.4)),

  // ── 4637 Bordtennis ──────────────────────────────────────────────
  // bordtennis: a competition – two players in kit at a table in a hall, a scoreboard
  'ballsp.bordtennis': all(rect(0, 0, 120, 120, '#2c4a6e', 0, null), rect(0, 86, 120, 34, '#b5523d', 0, null), ptable(30, 88, 60), pl(18, 114, 0.6, FORE, { top: C.red, leg: C.black, sock: C.white }), racket(31, 81, -10, 'pingis', C.red, 0.7), mirrorPl(102, 114, 0.6, FORE, { top: C.denim, leg: C.black, sock: C.white }), racket(89, 81, 190, 'pingis', C.black, 0.7),
    pball(60, 62), scoreboard(60, 22, '7', '5', C.red, C.denim, 40)),
  // pingis: two friends in everyday clothes at a table in a basement, a lamp overhead
  'ballsp.pingis': all(rect(0, 0, 120, 120, '#e9e2d6', 0, null), rect(0, 90, 120, 30, '#a7a196', 0, null), line('M60 0 L60 14', C.ink, 1.2), path('M50 22 L70 22 L64 14 L56 14 Z', C.yellow, C.ink, 1.2), ptable(30, 92, 60, '#3d8a4f'),
    pl(18, 116, 0.6, FORE, { top: C.purple, leg: C.denim, shorts: false }), racket(31, 83, -10, 'pingis', C.red, 0.7), mirrorPl(102, 116, 0.6, STAND, { top: C.orange, leg: C.navy, shorts: false, hs: 'long' }), racket(93, 90, 120, 'pingis', C.black, 0.7), pball(56, 66, 2.6, C.orange)),
  // pingisbord: the table itself, seen at an angle: green top, white lines, low net, folded legs
  'ballsp.pingisbord': all(rect(0, 0, 120, 120, '#efece6', 0, null), path('M10 70 L110 70 L96 40 L24 40 Z', '#2f6f9a', C.ink, 1.8), line('M17 55 L103 55', '#2b2a3388', 3), line('M17 55 L103 55', C.white, 0.8), path('M10 70 L110 70 L96 40 L24 40 Z', 'none', C.white, 1.4), line('M60 40 L60 70', C.white, 1),
    rect(10, 70, 100, 5, '#2f6f9a', 0, C.ink, 1.4), line('M18 75 L16 108 M102 75 L104 108 M30 75 L32 100 M90 75 L88 100', C.dark, 3), frame(4, 34, 112, 46)),
  // returnera (i sport): the ball comes in, the player meets it, and it goes back over the net
  'ballsp.returnera.3': all(rect(0, 0, 120, 120, '#e9eef2', 0, null), ptable(16, 94, 88), pl(106, 118, 0.6, pose({ ...FORE, n: [-2, -68], aR: [[-14, -60], [-22, -56]], aL: [[9, -60], [16, -56]] }), { top: C.denim, leg: C.black, sock: C.white }), racket(93, 84, 190, 'pingis', C.red, 0.7),
    moving('bsretur', '0%{transform:translate(-64px,10px)}40%{transform:translate(0,0)}100%{transform:translate(-64px,-6px)}', { dur: 2.2 }, pball(86, 76, 3)), line('M22 86 Q54 60 84 76', C.grey, 1.2, '3 2'), arrow(76, 66, 40, 60, HL, 2.4)),
  // skruv (på en boll): the ball spins round itself (orange curved arrows) and curves in the air
  'ballsp.skruv.2': all(rect(0, 0, 120, 120, '#eef0f3', 0, null), line('M10 100 Q40 20 108 60', C.grey, 1.6, '4 3'), waSpin('bsskruv', 1.2, g('translate(60 52)', circle(0, 0, 22, C.orange, C.ink, 2), path('M-22 0 Q0 -10 22 0', 'none', C.white, 2), path('M-14 14 Q0 6 14 14', 'none', C.white, 1.6))),
    path('M30 30 A34 34 0 0 1 90 30', 'none', HL, 3), path('M90 30 L84 22 L94 24 Z', HL, HL, 1.4), path('M90 76 A34 34 0 0 1 30 76', 'none', HL, 3), path('M30 76 L36 84 L26 82 Z', HL, HL, 1.4)),
  // kantboll (i bordtennis): close-up of the table edge – the ball touches the very edge (orange ring)
  'ballsp.kantboll': all(rect(0, 0, 120, 120, '#e9eef2', 0, null), path('M0 64 L84 64 L84 74 L0 74 Z', '#2f6f9a', C.ink, 2), path('M0 64 L84 64 L70 40 L0 40 Z', '#3d82b0', C.ink, 2), line('M0 64 L84 64', C.white, 2.4), line('M84 64 L70 40', C.white, 2.4),
    line('M84 74 L84 112', C.dark, 4), pball(88, 59, 6), ring(88, 59, 11), line('M40 20 Q76 30 86 52', C.grey, 1.4, '3 2'), line('M92 62 Q104 80 110 112', C.grey, 1.4, '3 2')),
  // parti (omgång): one whole game from start to finish – 0–0, 5–4 and 11–7, the winner with arms up
  'ballsp.parti.2': all(rect(0, 0, 120, 120, '#f1f4ee', 0, null), ...[['0', '0'], ['5', '4'], ['11', '7']].map(([a, b], i) => scoreboard(20 + i * 40, 22, a!, b!, C.red, C.denim, 34)), arrow(37, 22, 43, 22, C.grey, 1.6), arrow(77, 22, 83, 22, C.grey, 1.6),
    ptable(14, 96, 92, '#2f6f9a'), pl(8, 118, 0.48, FORE, { top: C.red, leg: C.black, sock: C.white }), mirrorPl(112, 118, 0.48, SAD, { top: C.denim, leg: C.black, sock: C.white }), frame(2, 8, 116, 30), pl(100, 64, 0.32, CHEER, { top: C.red, leg: C.black, sock: C.white })),
  // rundpingis: many children run round the table in a ring, each hits once; the one who misses goes out
  'ballsp.rundpingis': all(rect(0, 0, 120, 120, '#efe8dc', 0, null), ellipse(60, 70, 52, 30, 'none', HL, 2.4, ), path('M110 66 L112 76 L104 72 Z', HL, HL, 1), path('M10 74 L8 64 L16 68 Z', HL, HL, 1), ptable(36, 78, 48, '#3d8a4f'),
    ...[[18, 76, C.purple], [36, 104, C.orange], [62, 108, C.green], [88, 104, C.denim], [104, 78, C.red], [80, 50, C.yellow], [40, 50, C.pink]].map(([x, y, c]) => pl(x as number, y as number, 0.34, RUN, { top: c as string, leg: C.navy, shorts: false })), pball(60, 58, 2.2, C.orange),
    greyed(pl(110, 116, 0.3, SAD, { top: C.navy, shorts: false }))),
};

/** One leg in kit (shorts, skin, sock, shoe) from the hip, for a kicking leg that moves on its own. */
function kickLeg(x: number, y: number, s: number, h: Pt, j: [Pt, Pt], o: Look = {}): Svg {
  const leg = o.leg ?? C.white, sock = o.sock ?? o.top ?? C.red;
  const seg = (a: Pt, b: Pt, col: string, w: number) => { const d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`; return all(line(d, C.ink, w + 2.4), line(d, col, w)); };
  const mid = (a: Pt, b: Pt, t: number): Pt => [f1(a[0] + (b[0] - a[0]) * t), f1(a[1] + (b[1] - a[1]) * t)];
  return at(x, y, s, seg(h, mid(h, j[0], 0.7), leg, 6), seg(mid(h, j[0], 0.7), j[0], C.skin, 4.6), seg(j[0], mid(j[0], j[1], 0.35), C.skin, 4.6), seg(mid(j[0], j[1], 0.35), j[1], sock, 4.8), circle(j[1][0], j[1][1], 3, o.shoe ?? C.black, C.ink, 1));
}
/** Player facing left (mirrored about its own x). */
function mirrorPl(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg { return g(`translate(${2 * x} 0) scale(-1 1)`, pl(x, y, s, p, o)); }
/** Small sparkle for the ace. */
function sparkleStar(x: number, y: number): Svg { return star(x, y, 5, HL); }
void P;
