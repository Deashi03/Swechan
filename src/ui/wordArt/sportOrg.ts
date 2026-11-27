/**
 * Kultur & fritid → Sport & träning → Sportens organisation, 4661–4667 (0.64): clubs and associations, coaches and
 * leaders, training groups, competitions and tournaments, rules and referees, sports injuries and safety, ethics
 * and fair play.
 * People are drawn with the posable figure from trainingBasics.ts (`fz`: joint chains hip–knee–foot and
 * shoulder–elbow–hand with fixed segment lengths, two arms and two legs). Clubs are shown with a shield badge
 * without letters; national teams with a plain blue flag with a yellow cross. No brands, no letters that give away
 * the word (digits on scoreboards and tickets are fine).
 * Movement: `swap()` shows the start pose first and then the end pose (opacity only; the end pose is the poster
 * frame). `moving()`/`waIn()` move things with transform only. The named part is orange (HL); grey is the reference.
 * Easily confused pairs get different kinds of picture: the narrow top of the pyramid (elitidrott) against its
 * wide base (breddidrott); a group box where all meet all (gruppspel) against a knock-out tree (slutspel), a shield
 * that climbs from the group to the tree (kvalificera sig) against a shield that falls out of the tree (åka ut);
 * the middle of three heights (junior) against the tallest (senior); a tick on the allowed kick (tillåten).
 */
import { C, all, arrow, circle, ellipse, g, heart, line, moving, path, rect, sparkle, star, waPulse, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, C.red, C.ink, 1.4), line('M-4 -4 L4 4 M4 -4 L-4 4', C.white, 2.6));

/** Start pose first, then the end pose (poster frame). Opacity only. */
const swap = (name: string, a: Svg, b: Svg, dur = 2.4): Svg => all(
  `<style data-wa>@keyframes wa-${name}-s{0%,40%{opacity:1}50%,90%{opacity:0}100%{opacity:1}}.wa-${name}-s{animation:wa-${name}-s ${dur}s ease-in-out infinite both}</style><g data-wa="${name}-s" class="wa-${name}-s" opacity="0">${a}</g>`,
  moving(name, '0%,40%{opacity:0}50%,90%{opacity:1}100%{opacity:0}', { dur }, b));
/** Hidden at first, appears halfway and stays (poster frame: visible). */
const appear = (name: string, delay: number, ...k: Svg[]) => moving(name, `0%,${delay}%{opacity:0}${delay + 8}%,100%{opacity:1}`, { dur: 3 }, ...k);

// ── The posable figure (same construction as `fz` in trainingBasics.ts) ──
// Local units: feet at y = 0, standing height ≈ 86. Upper arm ≈ 12, forearm ≈ 13, thigh ≈ 21, shin ≈ 20, torso 26.
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = { top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'pony' | 'cap'; shoe?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'o' | 'grit' | 'sad'; sleeves?: boolean; front?: Svg; back?: Svg; shorts?: boolean; badge?: string; band?: boolean };
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
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, o.hs === 'bun' ? all(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2))
    : o.hs === 'cap' ? all(path('M-8.5 -2 C-8.5 -12 8.5 -12 8.5 -2 Z', grey ? C.grey : C.dark, ink, 1.2), path('M2 -3 L14 -3 L13 -1 L2 -1 Z', grey ? C.grey : C.dark, ink, 1))
      : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null),
    m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.2, 1.3, '#c84a4a', ink, 0.8)
      : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'sad' ? path('M-2.6 5 Q0 2.8 2.6 5', 'none', ink, 1)
        : m === 'grit' ? all(rect(-3, 2.8, 6, 2.6, C.white, 0.6, ink, 0.8), line('M-3 4.1 L3 4.1', ink, 0.6)) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  const badge = o.badge ? g(`translate(${f1(p.n[0] + (p.h[0] - p.n[0]) * 0.3)} ${f1(p.n[1] + (p.h[1] - p.n[1]) * 0.3)})`, path('M-3 -3 L3 -3 L3 0.5 C3 2.5 0 3.8 0 3.8 C0 3.8 -3 2.5 -3 0.5 Z', o.badge, ink, 0.8)) : '';
  const band = o.band ? circle(f1((p.n[0] + p.aR[0][0]) / 2), f1((p.n[1] + p.aR[0][1]) / 2), 3.8, HL, ink, 1.1) : '';
  return at(x, y, s, o.back ?? '',
    hairBack, legLimb(p.lL), foot(p.lL), legLimb(p.lR), foot(p.lR),
    line(torso, ink, 14.4), line(torso, top, 12), badge,
    limb(p.n, p.aL, armCol, 4.4, o.sleeves === false ? skin : (o.sleeves === true ? top : skin)), hand(p.aL), limb(p.n, p.aR, armCol, 4.4, o.sleeves === false ? skin : (o.sleeves === true ? top : skin)), hand(p.aR), band,
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face, o.front ?? '');
}

// ── Poses (profile poses face right) ──────────────────────────────────
const ARMS_UP = pose({ aL: [[-8, -80], [-12, -92]], aR: [[8, -80], [12, -92]] });
const RUN_A = pose({ h: [0, -44], n: [5, -69], aL: [[-6, -60], [-2, -50]], aR: [[12, -60], [18, -68]], lL: [[-8, -26], [-20, -16]], lR: [[10, -26], [8, -2]] });
const RUN_B = pose({ h: [0, -44], n: [5, -69], aL: [[10, -60], [16, -68]], aR: [[-4, -60], [-1, -50]], lL: [[10, -26], [8, -2]], lR: [[-8, -26], [-20, -16]] });
const WALK_A = pose({ n: [1, -68], aL: [[-6, -56], [-11, -45]], aR: [[7, -56], [12, -46]], lL: [[-5, -21], [-10, -1]], lR: [[6, -21], [10, -1]] });
const KICK = pose({ h: [0, -43], n: [-3, -68], aL: [[-12, -60], [-20, -54]], aR: [[8, -60], [16, -54]], lL: [[-3, -22], [-5, -1]], lR: [[14, -32], [28, -22]] });
const WHISTLE = pose({ aR: [[9, -58], [4, -73]], aL: [[-10, -60], [-24, -66]] });
const CARD_UP = pose({ aR: [[9, -80], [11, -93]] });
const SHAKE_R = pose({ aR: [[10, -58], [21, -55]] });
const SAD = pose({ n: [3, -67], aL: [[-5, -55], [-6, -42]], aR: [[8, -55], [9, -42]] });
const CARRY = pose({ aL: [[-6, -56], [-8, -44]], aR: [[6, -56], [8, -44]] });
const HANDS_HIPS = pose({ aL: [[-9, -56], [-4, -44]], aR: [[9, -56], [4, -44]] });
const SIT_KNEE = pose({ h: [0, -8], n: [-6, -34], aL: [[2, -24], [10, -18]], aR: [[4, -26], [12, -20]], lL: [[12, -18], [22, -2]], lR: [[16, -6], [34, -3]] });
const LIE = pose({ h: [-14, -6], n: [12, -6], aL: [[2, -4], [-8, -3]], aR: [[3, -8], [-6, -12]], lL: [[-34, -6], [-54, -5]], lR: [[-34, -5], [-54, -4]] });
const BALANCE = pose({ aL: [[-12, -58], [-24, -60]], aR: [[12, -58], [24, -60]], lR: [[10, -26], [6, -10]] });
const SIT_CHAIR = pose({ h: [0, -26], n: [0, -52], aL: [[-4, -40], [6, -32]], aR: [[4, -40], [12, -32]], lL: [[18, -26], [18, -1]], lR: [[19, -26], [20, -1]] });

// ── Settings and things ───────────────────────────────────────────────
const CLUB = '#2c7a5b', CLUB2 = '#e9c46a', RIVAL = '#5a6fbf', REF = '#2e2e36';
const hall = () => all(rect(0, 0, 120, 120, '#f1ead9', 0, null), rect(0, 94, 120, 26, '#d9b07a', 0, null), line('M0 94 L120 94', C.ink, 1.4), line('M0 104 L120 104 M30 94 L22 120 M90 94 L98 120', '#c0965f', 1));
const pitch = (sky = '#e3f1fa') => all(rect(0, 0, 120, 120, sky, 0, null), rect(0, 80, 120, 40, '#7fbf6a', 0, null), line('M0 80 L120 80', C.ink, 1.2), line('M0 98 L120 98', 'rgba(255,255,255,0.7)', 1.4));
const room = (wall = '#eef1f4', floor = '#cfd3da', fy = 96) => all(rect(0, 0, 120, 120, wall, 0, null), rect(0, fy, 120, 120 - fy, floor, 0, null), line(`M0 ${fy} L120 ${fy}`, C.ink, 1.4));
/** Club badge: a shield with a stripe (no letters). */
const shield = (x: number, y: number, s = 1, col: string = CLUB, col2: string = CLUB2) => at(x, y, s,
  path('M-10 -12 L10 -12 L10 0 C10 8 0 13 0 13 C0 13 -10 8 -10 0 Z', col, C.ink, 1.6), path('M-10 -4 L10 -4 L10 1 L-10 1 Z', col2, null), circle(0, -8, 2.2, C.white, C.ink, 0.8));
const ball = (x: number, y: number, r = 6) => all(circle(x, y, r, C.white, C.ink, 1.3), path(`M${x - r * 0.4} ${y - r * 0.3} L${x} ${y - r * 0.6} L${x + r * 0.4} ${y - r * 0.3} L${x + r * 0.25} ${y + r * 0.2} L${x - r * 0.25} ${y + r * 0.2} Z`, C.ink, null));
const trophy = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M-9 -24 L9 -24 C9 -12 5 -8 0 -8 C-5 -8 -9 -12 -9 -24 Z', col, C.ink, 1.4),
  path('M-9 -21 C-15 -21 -15 -13 -7 -12 M9 -21 C15 -21 15 -13 7 -12', 'none', C.ink, 1.6), rect(-2, -8, 4, 6, col, 0, C.ink, 1.1), rect(-7, -2, 14, 4, C.brown, 1, C.ink, 1.2));
const medal = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M-4 -12 L0 -4 L4 -12', 'none', C.red, 2.4), circle(0, 0, 4.5, col, C.ink, 1.1));
const flagSE = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, '#2a63b0', 0, C.ink, 1), rect(x + w * 0.31, y, w * 0.14, h, C.yellow, 0, null), rect(x, y + h * 0.42, w, h * 0.16, C.yellow, 0, null), rect(x, y, w, h, 'none', 0, C.ink, 1));
const pole = (x: number, y1: number, y2: number) => line(`M${x} ${y1} L${x} ${y2}`, C.ink, 2);
const paper = (x: number, y: number, w: number, h: number, fill: string = C.white) => all(rect(x, y, w, h, fill, 2, C.ink, 1.5), ...Array.from({ length: Math.max(1, Math.floor((h - 10) / 6)) }, (_, i) => line(`M${x + 4} ${y + 10 + i * 6} L${x + w - 4} ${y + 10 + i * 6}`, C.grey2, 1.4)));
const clipboard = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -12, 18, 24, C.brown, 2, C.ink, 1.3), rect(-7, -9, 14, 19, C.white, 1, null), rect(-4, -14, 8, 4, C.grey, 1, C.ink, 1),
  line('M-5 -4 L5 -4 M-5 1 L5 1 M-5 6 L3 6', C.grey2, 1.3));
const whistle = (x: number, y: number, s = 1, rot = 0, col: string = C.silver) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-8 -5 L6 -5 L6 -2 L12 -2 L12 2 L6 2 C6 6 2 8 -2 8 C-7 8 -10 5 -10 1 C-10 -2 -9 -4 -8 -5 Z', col, C.ink, 1.3), circle(-2, 1.5, 2.4, C.dark, null), circle(-8, -6, 2.2, 'none', C.ink, 1.2));
const sound = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M0 -6 C3 -3 3 3 0 6', 'none', col, 2), path('M5 -10 C10 -4 10 4 5 10', 'none', col, 2), path('M10 -14 C17 -6 17 6 10 14', 'none', col, 2));
const cardY = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) rotate(8) scale(${s})`, rect(-5, -8, 10, 15, col, 1.5, C.ink, 1.3));
const net = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, 'rgba(255,255,255,0.5)', 0, C.white, 2), ...Array.from({ length: Math.floor(w / 5) }, (_, i) => line(`M${x + i * 5} ${y} L${x + i * 5} ${y + h}`, 'rgba(255,255,255,0.8)', 0.6)), ...Array.from({ length: Math.floor(h / 5) }, (_, i) => line(`M${x} ${y + i * 5} L${x + w} ${y + i * 5}`, 'rgba(255,255,255,0.8)', 0.6)));
const goal = (x: number, y: number, s = 1) => at(x, y, s, net(0, -18, 30, 18), line('M0 0 L0 -18 L30 -18 L30 0', C.white, 2.6), line('M0 0 L0 -18 L30 -18 L30 0', C.ink, 0.6));
const calendar = (x: number, y: number, w: number, h: number, cols = 7, rows = 4) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.5), rect(x, y, w, 7, C.red, 2, C.ink, 1.2),
  ...Array.from({ length: cols - 1 }, (_, i) => line(`M${f1(x + ((i + 1) * w) / cols)} ${y + 7} L${f1(x + ((i + 1) * w) / cols)} ${y + h}`, C.grey2, 1)),
  ...Array.from({ length: rows - 1 }, (_, i) => line(`M${x} ${f1(y + 7 + ((i + 1) * (h - 7)) / rows)} L${x + w} ${f1(y + 7 + ((i + 1) * (h - 7)) / rows)}`, C.grey2, 1)));
const cell = (x: number, y: number, w: number, h: number, cols: number, rows: number, c: number, r: number) => [f1(x + (c * w) / cols), f1(y + 7 + (r * (h - 7)) / rows), f1(w / cols), f1((h - 7) / rows)] as const;
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, C.gold, C.ink, 1), circle(x, y, r * 0.55, 'none', '#b88a1c', 0.8));
const bill = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-9, -5, 18, 10, '#9fd39a', 1.5, C.ink, 1.1), circle(0, 0, 2.6, 'none', '#4f9d69', 1));
const hut = (x: number, y: number, w: number, h: number, wall: string = '#c8553d', roof: string = C.dark) => all(rect(x, y - h, w, h, wall, 1, C.ink, 1.6), path(`M${x - 5} ${y - h} L${x + w / 2} ${y - h - 18} L${x + w + 5} ${y - h} Z`, roof, C.ink, 1.6));
const syringe = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-12, -4, 20, 8, '#dff1fb', 1.5, C.ink, 1.2), rect(-12, -4, 11, 8, '#e88a8a', 1, null), rect(-12, -4, 20, 8, 'none', 1.5, C.ink, 1.2),
  line('M8 0 L18 0', C.ink, 1.2), line('M-12 0 L-18 0 M-18 -5 L-18 5', C.ink, 1.8));
const pill = (x: number, y: number, rot = 0, col: string = C.red) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-5, -2.6, 10, 5.2, C.white, 2.6, C.ink, 1), rect(-5, -2.6, 5, 5.2, col, 2.6, null), rect(-5, -2.6, 10, 5.2, 'none', 2.6, C.ink, 1));
const sampleCup = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -14, 12, 16, '#fff6c9', 2, C.ink, 1.3), rect(-7, -18, 14, 5, C.dark, 1.5, C.ink, 1.2), rect(-4, -8, 8, 5, C.white, 0.5, C.ink, 0.8));
const crowd = (y: number, n = 10, cols: string[] = [CLUB, CLUB2, C.white]) => all(...Array.from({ length: n }, (_, i) => { const x = 6 + i * (108 / (n - 1)); return all(rect(x - 4, y, 8, 10, cols[i % cols.length]!, 3, C.ink, 0.8), circle(x, y - 3, 3.6, C.skin, C.ink, 0.8)); }));
const bracketLines = (col: string = C.ink) => line('M22 24 L36 24 L36 34 L22 34 M22 54 L36 54 L36 64 L22 64 M22 84 L36 84 L36 94 L22 94 M36 29 L54 29 L54 59 L36 59 M36 89 L54 89 M54 44 L74 44 L74 89 L54 89 M74 66 L88 66', col, 1.6);

// ── Round 2 helpers (used only by the redrawn junior/senior/respekt pictures) ──
const HANDS_BACK = pose({ n: [2, -67], aL: [[-6, -56], [-9, -45]], aR: [[-5, -56], [-8, -46]] });
/** Age scale 10 – 15 – 20 – 30 under the three people. */
const ageScale = () => all(line('M8 102 L114 102', C.ink, 2), ...[[18, '10'], [44, '15'], [70, '20'], [100, '30']].map(([x, t]) => all(line(`M${x} 98 L${x} 106`, C.ink, 1.6), num(x as number, 116, t as string, 9))));
/** A child with a ball. */
const kidFig = () => all(fz(18, 92, 0.42, pose({ aR: [[7, -56], [10, -46]] }), { top: C.yellow, leg: C.navy, shorts: true, sleeves: false }), ball(25, 88, 3));
/** A teenager with headphones and a sports bag. */
const teenFig = (hl: boolean) => all(fz(50, 92, 0.66, pose({}), { top: hl ? HL : C.sky, leg: C.navy, hs: 'pony' }), at(50, 92, 0.66, path('M-9 -80 C-9 -94 9 -94 9 -80', 'none', C.dark, 2.4), rect(-11, -82, 4, 7, C.dark, 1.5, null), rect(7, -82, 4, 7, C.dark, 1.5, null)));
/** A grown-up player with a beard. */
const adultFig = (hl = false) => all(fz(90, 92, 0.86, pose({}), { top: hl ? HL : C.green, leg: C.navy }), at(90, 92, 0.86, path('M-7 -76 C-6 -68 6 -68 7 -76 C4 -72 -4 -72 -7 -76 Z', C.hair, C.ink, 0.8)));

export const SPORG_MOTIFS: Record<string, Svg> = {
  // ── 4661 Föreningar och klubbar ─────────────────────────────────────
  // klubb: children and adults in the same shirts with the same badge, under a banner with that badge
  'sporg.klubb': all(hall(), rect(30, 10, 60, 30, CLUB, 2, C.ink, 1.6), line('M30 10 L30 4 M90 10 L90 4', C.ink, 1.4), shield(60, 26, 1.1),
    fz(22, 110, 0.62, HANDS_HIPS, { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }), fz(45, 110, 0.74, pose({}), { top: CLUB, leg: C.navy, badge: CLUB2, hs: 'long' }),
    fz(70, 110, 0.86, pose({ aR: [[9, -60], [16, -50]] }), { top: CLUB, leg: C.navy, badge: CLUB2 }), fz(96, 110, 0.6, HANDS_HIPS, { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2, hs: 'pony' }), ball(84, 106, 4)),
  // medlem: one person (orange) steps into the circle of club members, holding up a membership card with the badge
  'sporg.medlem': all(rect(0, 0, 120, 120, '#f2efe8', 0, null), ground(), ellipse(60, 108, 52, 8, 'none', CLUB, 2),
    greyed(fz(16, 108, 0.66, pose({}), {}), fz(36, 104, 0.6, pose({}), { hs: 'long' }), fz(86, 104, 0.6, pose({}), {}), fz(104, 108, 0.66, pose({}), { hs: 'bun' })),
    fz(60, 110, 0.86, pose({ aR: [[10, -64], [14, -78]] }), { top: HL, leg: C.navy }),
    at(76, 34, 1, rect(-12, -8, 24, 16, C.white, 2, C.ink, 1.4), shield(-5, 0, 0.42), line('M1 -3 L9 -3 M1 1 L9 1 M1 5 L6 5', C.grey, 1.3))),
  // klubbhus: a small wooden house with the club flag on the roof, beside the pitch
  'sporg.klubbhus': all(pitch(), goal(84, 98, 0.9), hut(14, 92, 46, 34, '#c8553d', C.dark), rect(30, 72, 12, 20, C.brown, 1, C.ink, 1.3), rect(18, 66, 9, 9, '#bfe3f5', 1, C.ink, 1.2), rect(46, 66, 9, 9, '#bfe3f5', 1, C.ink, 1.2),
    pole(37, 22, 40), rect(37, 22, 18, 12, CLUB, 0, C.ink, 1), shield(46, 29, 0.36), frame(9, 18, 56, 78)),
  // lott: a fan of numbered tickets, one with a star (a prize), and a child holding them out
  'sporg.lott': all(rect(0, 0, 120, 120, '#f7f1e3', 0, null), ground(),
    ...[[-24, C.sky], [-8, C.mint], [8, C.yellow]].map(([r, col], i) => g(`translate(68 54) rotate(${r})`, rect(-14, -26, 28, 40, col as string, 2, C.ink, 1.4), num(0, -10, String(312 + i * 7), 9), line('M-10 -2 L10 -2', C.ink, 0.8, '2 2'))),
    g('translate(68 54) rotate(8)', star(0, 6, 6, HL)), fz(28, 110, 0.72, pose({ aR: [[10, -60], [22, -58]] }), { top: CLUB, leg: C.navy, badge: CLUB2, hs: 'pony' }), sparkle(98, 30, 5)),
  // förbund (idrott): one big badge on top, joined by lines to many club badges below
  'sporg.förbund.2': all(rect(0, 0, 120, 120, '#eef3f7', 0, null), line('M60 36 L18 78 M60 36 L46 78 M60 36 L74 78 M60 36 L102 78', HL, 2.2),
    shield(60, 26, 1.5, HL, C.white), ball(60, 24, 3.4), shield(18, 88, 0.9, CLUB), shield(46, 88, 0.9, RIVAL, C.white), shield(74, 88, 0.9, C.red, C.white), shield(102, 88, 0.9, C.purple, CLUB2),
    ...[18, 46, 74, 102].map((x) => ball(x, 87, 2.4))),
  // licens (idrott): at the start area the official checks the athlete's licence card (federation shield, ball) and ticks the list
  'sporg.licens.2': all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), rect(0, 92, 120, 28, '#a9d18e', 0, null), line('M0 92 L120 92', C.ink, 1.2),
    path('M6 92 L6 30 C6 14 114 14 114 30 L114 92', 'none', C.ink, 6), path('M6 92 L6 30 C6 14 114 14 114 30 L114 92', 'none', '#f2c14e', 3.6),
    rect(70, 74, 40, 6, C.tan, 1, C.ink, 1.3), line('M74 80 L74 110 M106 80 L106 110', C.brown, 2.6),
    fz(98, 110, 0.72, pose({ aL: [[-8, -60], [-14, -50]], aR: [[6, -58], [2, -50]] }), { top: C.yellow, leg: C.dark, hs: 'cap' }), at(84, 64, 0.8, clipboard(0, 0), check(2, 0, 0.5)),
    fz(30, 110, 0.86, pose({ aR: [[11, -62], [24, -66]] }), { top: C.red, leg: C.white, shorts: true, sleeves: false, front: rect(-6, -60, 12, 9, C.white, 1, C.ink, 0.8) }),
    at(54, 40, 1, rect(-15, -11, 30, 22, C.white, 2, HL, 2.4), shield(-6, 1, 0.55, HL, C.white), ball(-6, 0, 2.2), ball(7, -3, 3), line('M2 5 L12 5', C.grey, 1.3))),
  // ── 4662 Tränare och ledare ─────────────────────────────────────────
  // ledare: an adult with a cap walks first; a line of children follows
  'sporg.ledare': all(pitch(), fz(90, 106, 0.92, pose({ ...WALK_A, aL: [[-10, -62], [-22, -66]] }), { top: HL, leg: C.navy, hs: 'cap' }),
    ...[22, 42, 62].map((x, i) => fz(x, 106, 0.58, WALK_A, { top: CLUB, leg: C.white, shorts: true, sleeves: false, hs: i === 1 ? 'pony' : 'short' })), arrow(16, 44, 64, 44, HL, 2.4)),
  // lagledare: the team manager with a checklist, a phone and a bag of balls by the minibus
  'sporg.lagledare': all(room('#eef4f6', '#c9ccd2'), rect(64, 56, 54, 40, C.white, 6, C.ink, 1.6), rect(70, 62, 16, 12, '#bfe3f5', 2, C.ink, 1), rect(92, 62, 20, 12, '#bfe3f5', 2, C.ink, 1), circle(76, 98, 6, C.dark, C.ink, 1.2), circle(108, 98, 6, C.dark, C.ink, 1.2),
    fz(34, 110, 0.92, pose({ aR: [[10, -58], [16, -48]], aL: [[-6, -58], [2, -52]] }), { top: HL, leg: C.navy }),
    at(50, 60, 0.9, clipboard(0, 0), line('M-5 -4 l1.5 1.5 l3 -3 M-5 1 l1.5 1.5 l3 -3', C.green, 1.4)),
    ellipse(52, 104, 10, 7, C.navy, C.ink, 1.2), ball(48, 99, 3.4), ball(55, 98, 3.4)),
  // belastningsregister: an adult hands the club an official extract with the police star seal and a tick
  'sporg.belastningsregister': all(room('#f2f0ea', '#d5d0c4'), fz(96, 108, 0.82, pose({ aL: [[-10, -60], [-20, -62]] }), { top: CLUB, leg: C.navy, badge: CLUB2, hs: 'long' }), rect(70, 74, 46, 7, C.tan, 1, C.ink, 1.4), rect(74, 81, 38, 31, '#b98a5a', 1, C.ink, 1.4),
    fz(28, 110, 0.9, pose({ aR: [[11, -60], [24, -62]] }), { top: C.denim, leg: C.dark }),
    at(60, 46, 1, paper(-14, -18, 28, 36), rect(-14, -18, 28, 8, '#2a4d8f', 2, C.ink, 1.2), star(0, -14, 3.4, C.yellow), check(8, 12, 0.7)), frame(44, 26, 32, 40)),
  // tränarutbildning: a course leader draws a tactic on a whiteboard; adults with notebooks
  'sporg.tränarutbildning': all(room(), rect(14, 12, 70, 42, C.white, 2, C.ink, 1.6), rect(18, 16, 62, 34, '#dff0dc', 1, null), line('M49 16 L49 50', C.white, 1.2), circle(49, 33, 6, 'none', C.white, 1.2),
    circle(30, 26, 2.6, C.red, null), circle(34, 40, 2.6, C.red, null), circle(64, 30, 2.6, C.navy, null), path('M32 27 C40 20 50 22 60 29', 'none', HL, 1.8), arrow(56, 27, 61, 29.5, HL, 1.8),
    fz(98, 108, 0.86, pose({ aL: [[-10, -66], [-20, -74]] }), { top: HL, leg: C.navy }),
    fz(26, 112, 0.52, SIT_CHAIR, { top: C.green, leg: C.navy }), fz(54, 112, 0.52, SIT_CHAIR, { top: C.purple, leg: C.dark, hs: 'long' }), rect(28, 92, 10, 3, C.white, 0.5, C.ink, 0.8), rect(56, 92, 10, 3, C.white, 0.5, C.ink, 0.8)),
  // ta ut (laget): the coach picks players – one by one children step forward and get a tick
  'sporg.ta-ut.2': all(hall(), fz(18, 108, 0.86, pose({ aR: [[10, -58], [16, -50]], aL: [[-6, -58], [6, -54]] }), { top: C.dark, leg: C.dark, hs: 'cap' }), at(26, 56, 0.8, clipboard(0, 0)),
    ...([[44, 0], [62, 1], [80, 0], [98, 1]] as const).map(([x, sel], i) => sel
      ? moving(`sporg-taut-${i}`, `0%,${20 + i * 15}%{transform:translate(0,0)}${32 + i * 15}%,100%{transform:translate(0,8px)}`, { dur: 3.4 }, fz(x, 98, 0.56, pose({}), { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }), check(x, 30, 0.6))
      : greyed(fz(x, 98, 0.56, pose({}), {})))),
  // kapten (i ett lag): the captain with an orange armband shakes hands with the referee before the match
  'sporg.kapten.2': all(pitch(), fz(42, 108, 0.95, SHAKE_R, { top: CLUB, leg: C.white, shorts: true, sleeves: true, band: true }),
    g('translate(120 0) scale(-1 1)', fz(42, 108, 0.95, SHAKE_R, { top: REF, leg: REF, shorts: true })),),

  // ── 4663 Träningsgrupper ────────────────────────────────────────────
  // träningsgrupp: a ring around children of the same size training together with one coach
  'sporg.träningsgrupp': all(hall(), ellipse(60, 100, 54, 14, 'none', HL, 2.4),
    ...[18, 38, 82, 102].map((x, i) => fz(x, 102, 0.56, pose({ aL: [[-8, -66], [-12, -78]], aR: [[8, -66], [12, -78]] }), { top: [CLUB, C.red, C.purple, C.denim][i]!, leg: C.navy, shorts: true, sleeves: false, hs: i % 2 ? 'pony' : 'short' })),
    fz(60, 108, 0.84, pose({ aL: [[-8, -66], [-12, -78]], aR: [[8, -66], [12, -78]] }), { top: C.dark, leg: C.dark, hs: 'cap' })),
  // nivå (hur bra): three training groups on three steps with one, two and three stars; one player moves up a step
  'sporg.nivå.2': all(rect(0, 0, 120, 120, '#f0f2f6', 0, null), ground(), rect(4, 92, 36, 20, C.grey2, 1, C.ink, 1.4), rect(42, 76, 36, 36, C.grey2, 1, C.ink, 1.4), rect(80, 60, 36, 52, C.grey2, 1, C.ink, 1.4),
    star(22, 104, 4.4, C.gold), star(54, 92, 4.4, C.gold), star(66, 92, 4.4, C.gold), star(86, 78, 4.4, C.gold), star(98, 78, 4.4, C.gold), star(110, 78, 4.4, C.gold),
    ...[10, 22].map((x) => fz(x, 92, 0.3, pose({}), { top: C.sky, leg: C.navy })), ...[62, 72].map((x) => fz(x, 76, 0.3, pose({}), { top: C.green, leg: C.navy })), ...[88, 100, 110].map((x) => fz(x, 60, 0.3, pose({}), { top: C.purple, leg: C.navy })),
    fz(34, 92, 0.3, pose({}), { top: C.sky, leg: C.navy, grey: true }), line('M34 62 C36 46 44 44 48 52', HL, 2.4, '4 3'), arrow(46, 50, 49, 57, HL, 2.6), fz(50, 76, 0.34, ARMS_UP, { top: HL, leg: C.navy, mouth: 'open' })),
  // träningstid: the week schedule on the hall wall; one evening block is the group's time, a clock beside
  'sporg.träningstid': all(hall(), calendar(10, 14, 76, 60, 7, 4), ...[[1, 1], [4, 2], [2, 3]].map(([c, r]) => { const [x, y, w, h] = cell(10, 14, 76, 60, 7, 4, c!, r!); return rect(x + 1, y + 1, w - 2, h - 2, C.grey2, 1, null); }),
    (() => { const [x, y, w, h] = cell(10, 14, 76, 60, 7, 4, 3, 1); return rect(x + 0.5, y + 0.5, w - 1, h - 1, HL, 1, C.ink, 1.2); })(),
    circle(102, 30, 12, C.white, C.ink, 1.6), line('M102 30 L102 21 M102 30 L109 34', C.ink, 1.8), fz(100, 104, 0.5, RUN_A, { top: HL, leg: C.navy, shorts: true }), ball(114, 100, 3)),
  // knatte: very small children run after the ball all at once; a grown-up for scale
  'sporg.knatte': all(pitch(), greyed(fz(102, 110, 0.86, pose({}), {})),
    ...[[20, C.yellow], [34, C.red], [48, C.sky], [62, C.pink]].map(([x, col], i) => fz(x as number, 108, 0.38, i % 2 ? RUN_B : RUN_A, { top: col as string, leg: C.navy, shorts: true, sleeves: false, mouth: 'open', hs: i % 2 ? 'pony' : 'short' })),
    ball(76, 104, 6), frame(10, 64, 76, 50)),
  // lagsport: four players in the same shirts pass the ball between them (arrows join them)
  'sporg.lagsport': all(pitch(), line('M30 40 C44 30 62 30 72 44', HL, 2, '4 3'), line('M78 54 C92 64 94 80 86 92', HL, 2, '4 3'), line('M78 98 C60 108 40 104 30 92', HL, 2, '4 3'),
    fz(24, 98, 0.62, KICK, { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }), fz(72, 72, 0.5, pose({}), { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }),
    fz(96, 108, 0.6, RUN_A, { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2, hs: 'pony' }), fz(48, 66, 0.44, RUN_B, { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }), ball(30, 40, 4)),
  // junior: one age scale under a child, a teenager (headphones) and an adult (beard); the teenager and the teen years are marked
  'sporg.junior': all(rect(0, 0, 120, 120, '#eef4ee', 0, null), ageScale(), rect(32, 99, 34, 6, HL, 2, C.ink, 1),
    greyed(kidFig(), adultFig()), teenFig(true), ellipse(50, 92, 14, 2.6, 'none', HL, 2)),
  // senior (i idrott): the same age scale and people; the adult and the years from 20 upwards are marked
  'sporg.senior.2': all(rect(0, 0, 120, 120, '#eef4ee', 0, null), ageScale(), rect(68, 99, 46, 6, HL, 2, C.ink, 1), arrow(108, 102, 116, 102, HL, 2.2),
    greyed(kidFig(), teenFig(false)), adultFig(true), ellipse(90, 92, 16, 2.6, 'none', HL, 2)),
  // elitidrott: the narrow top of the pyramid – one athlete with a trophy on the peak (marked)
  'sporg.elitidrott': all(rect(0, 0, 120, 120, '#eef1f8', 0, null), path('M60 30 L110 110 L10 110 Z', C.grey2, C.ink, 1.6), path('M60 30 L72 50 L48 50 Z', HL, C.ink, 1.6),
    ...[24, 38, 52, 66, 80, 96].map((x) => circle(x, 102, 3, C.grey, null)), ...[38, 52, 66, 82].map((x) => circle(x, 84, 3, C.grey, null)),
    fz(60, 32, 0.28, ARMS_UP, { top: HL, leg: C.navy }), trophy(84, 30, 0.6), star(30, 30, 4, C.gold)),
  // breddidrott: the wide base of the pyramid is marked – many different people play and move there
  'sporg.breddidrott': all(rect(0, 0, 120, 120, '#eef1f8', 0, null), path('M60 30 L110 110 L10 110 Z', C.grey2, C.ink, 1.6), path('M28 80 L92 80 L110 110 L10 110 Z', HL, C.ink, 1.6),
    ...[[26, C.yellow, 0.26], [44, C.sky, 0.3], [60, C.green, 0.24], [76, C.pink, 0.32], [94, C.purple, 0.26]].map(([x, col, s], i) => fz(x as number, 108, s as number, i % 2 ? RUN_A : ARMS_UP, { top: col as string, leg: C.navy, mouth: 'open' })),
    greyed(fz(60, 32, 0.22, pose({}), {}))),

  // ── 4664 Tävlingar och turneringar ──────────────────────────────────
  // turnering: several small pitches at once, team flags along the side and the cup waiting
  'sporg.turnering': all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), rect(0, 50, 120, 70, '#7fbf6a', 0, null),
    ...[[6, 58], [62, 58], [6, 88], [62, 88]].map(([x, y]) => all(rect(x!, y!, 52, 26, 'none', 0, C.white, 1.4), line(`M${x! + 26} ${y} L${x! + 26} ${y! + 26}`, C.white, 1.2))),
    ...[[18, 70, C.red], [40, 72, RIVAL], [74, 70, CLUB], [96, 72, C.yellow], [20, 100, C.purple], [42, 98, C.orange], [76, 100, C.pink], [98, 98, C.sky]].map(([x, y, c]) => all(circle(x as number, (y as number) - 5, 2.6, C.skin, C.ink, 0.6), rect((x as number) - 2.6, (y as number) - 3, 5.2, 7, c as string, 1.5, C.ink, 0.6))),
    ...[[8, C.red], [24, RIVAL], [40, CLUB], [80, C.yellow], [96, C.purple], [112, C.orange]].map(([x, c]) => all(pole(x as number, 22, 48), rect(x as number, 22, 10, 7, c as string, 0, C.ink, 0.8))), trophy(60, 46, 0.9)),
  // gruppspel: four badges in one box, every team joined to every other team (all meet all)
  'sporg.gruppspel': all(rect(0, 0, 120, 120, '#f2f4f7', 0, null), rect(14, 14, 92, 92, C.white, 6, HL, 2.6),
    line('M34 34 L86 34 L86 86 L34 86 Z M34 34 L86 86 M86 34 L34 86', C.grey, 1.8, '4 3'),
    shield(34, 36, 1.1, CLUB), shield(86, 36, 1.1, RIVAL, C.white), shield(34, 88, 1.1, C.red, C.white), shield(86, 88, 1.1, C.purple, CLUB2)),
  // kvalificera sig: a badge climbs from the group box up into the next round
  'sporg.kvalificera-sig.2': all(rect(0, 0, 120, 120, '#f2f4f7', 0, null), rect(8, 62, 56, 50, C.white, 5, C.ink, 1.6), rect(74, 10, 38, 36, C.white, 5, HL, 2.6), trophy(93, 40, 0.6),
    greyed(shield(22, 98, 0.8, RIVAL, C.white), shield(50, 98, 0.8, C.red, C.white)), shield(22, 76, 0.8, C.purple, CLUB2), line('M46 72 C52 40 66 30 82 28', HL, 2.4, '4 3'), arrow(76, 30, 84, 28, HL, 2.4),
    moving('sporg-kval', '0%,10%{transform:translate(-40px,48px)}60%,100%{transform:translate(0,0)}', { dur: 3 }, shield(86, 28, 0.9, CLUB))),
  // slutspel: the knock-out tree – two teams meet, the winner moves on, until the cup
  'sporg.slutspel': all(rect(0, 0, 120, 120, '#f2f4f7', 0, null), bracketLines(HL),
    ...[[14, 24, CLUB], [14, 34, RIVAL], [14, 54, C.red], [14, 64, C.purple], [14, 84, C.orange], [14, 94, C.sky]].map(([x, y, c]) => shield(x as number, y as number, 0.42, c as string, C.white)),
    shield(46, 29, 0.42, CLUB), shield(46, 59, 0.42, C.purple, C.white), shield(46, 89, 0.42, C.sky, C.white), shield(66, 44, 0.42, CLUB), trophy(100, 76, 0.85)),
  // åka ut: in the knock-out tree, one losing badge falls out of the tree and turns grey
  'sporg.åka-ut.2': all(rect(0, 0, 120, 120, '#f2f4f7', 0, null), bracketLines(C.grey), shield(14, 24, 0.42, CLUB), shield(46, 29, 0.42, CLUB), trophy(100, 76, 0.85),
    moving('sporg-akaut', '0%,25%{transform:translate(-4px,-58px) rotate(-30deg)}75%,100%{transform:translate(0,0) rotate(0)}', { dur: 3, spin: true }, g('translate(18 92) rotate(30)', shield(0, 0, 0.5, HL, C.white))),
    line('M8 34 L24 34', C.red, 1.6, '3 2'), cross(30, 100, 0.6)),
  // final: the last match – two teams face each other with the cup on a stand between them, spotlights
  'sporg.final': all(pitch('#24314f'), path('M20 0 L40 80 L0 80 Z', 'rgba(255,240,180,0.25)', null), path('M100 0 L120 80 L80 80 Z', 'rgba(255,240,180,0.25)', null),
    fz(26, 108, 0.8, pose({ aL: [[-8, -56], [-4, -44]], aR: [[9, -56], [4, -44]] }), { top: CLUB, leg: C.white, shorts: true, sleeves: false, badge: CLUB2 }),
    g('translate(120 0) scale(-1 1)', fz(26, 108, 0.8, HANDS_HIPS, { top: RIVAL, leg: C.white, shorts: true, sleeves: false, badge: C.white })),
    rect(52, 76, 16, 30, C.white, 1, C.ink, 1.4), trophy(60, 76, 1.2), sparkle(42, 40, 4), sparkle(78, 36, 4), ball(60, 108, 4)),
  // vinnare: the winner lifts the cup with both arms; a grey loser beside
  'sporg.vinnare': all(pitch(), greyed(fz(28, 108, 0.82, SAD, { mouth: 'sad' })),
    fz(76, 108, 0.95, ARMS_UP, { top: HL, leg: C.white, shorts: true, sleeves: false, mouth: 'open' }), trophy(76, 26, 0.9), sparkle(100, 30, 4), sparkle(54, 24, 3.4)),
  // prispall: three steps; first, second and third stand with medals
  'sporg.prispall': all(rect(0, 0, 120, 120, '#eef3f8', 0, null), ground(),
    rect(44, 72, 32, 40, HL, 1, C.ink, 1.6), rect(10, 86, 34, 26, C.silver, 1, C.ink, 1.6), rect(76, 94, 34, 18, '#d39a62', 1, C.ink, 1.6), num(60, 96, '1', 16, C.white), num(27, 104, '2', 13), num(93, 108, '3', 11),
    fz(60, 72, 0.6, ARMS_UP, { top: C.red, leg: C.navy, mouth: 'open' }), fz(27, 86, 0.58, pose({}), { top: C.sky, leg: C.navy }), fz(93, 94, 0.56, pose({}), { top: C.green, leg: C.navy, hs: 'long' }),
    medal(60, 34, 0.7), medal(27, 48, 0.6, C.silver), medal(93, 58, 0.6, '#c98a4b')),
  // liga: one long table with many club badges; the season's calendar is full of matches
  'sporg.liga': all(rect(0, 0, 120, 120, '#f2f4f7', 0, null), rect(10, 10, 72, 100, C.white, 4, HL, 2.4),
    ...[CLUB, RIVAL, C.red, C.purple, C.orange, C.sky, C.yellow].map((c, i) => all(shield(22, 22 + i * 13.5, 0.42, c, C.white), rect(32, 18 + i * 13.5, 44 - i * 5, 6, i === 0 ? HL : C.grey2, 2, null), line(`M14 ${f1(28.5 + i * 13.5)} L78 ${f1(28.5 + i * 13.5)}`, C.grey2, 0.8))),
    calendar(88, 30, 26, 30, 3, 3), ...[0, 1, 2].flatMap((c) => [0, 1, 2].map((r) => { const [x, y, w, h] = cell(88, 30, 26, 30, 3, 3, c, r); return ball(x + w / 2, y + h / 2, 2.2); }))),
  // mästerskap: a big event – an arena with flags of many countries, groups leading to one final, the cup with a star on top
  'sporg.mästerskap': all(rect(0, 0, 120, 120, '#eef1f8', 0, null), ellipse(60, 92, 56, 24, '#c9ced6', C.ink, 1.6), ellipse(60, 94, 44, 16, '#7fbf6a', C.ink, 1.2),
    ...[[8, C.red, C.white], [22, '#2a63b0', C.yellow], [36, C.green, C.white], [84, C.yellow, C.red], [98, C.white, C.red], [112, '#2a63b0', C.white]].map(([x, a, b]) => all(pole(x as number, 46, 76), rect(x as number, 46, 10, 7, a as string, 0, C.ink, 0.8), rect(x as number, 49.5, 10, 3.5, b as string, 0, null), rect(x as number, 46, 10, 7, 'none', 0, C.ink, 0.8))),
    ...[[28, 86], [28, 100], [92, 86], [92, 100]].map(([x, y]) => rect(x! - 6, y! - 4, 12, 8, C.white, 1.5, C.ink, 1)), line('M34 86 L42 86 L42 100 L34 100 M42 93 L52 93 M86 86 L78 86 L78 100 L86 100 M78 93 L68 93', C.ink, 1.4),
    rect(52, 88, 16, 10, HL, 2, C.ink, 1.2), line('M60 88 L60 50', HL, 2, '3 2'), trophy(60, 46, 1.2), star(60, 10, 6, C.gold)),
  // landslag: the national team in a row with the national flag behind them
  'sporg.landslag': all(pitch(), flagSE(36, 10, 48, 30), pole(36, 10, 64),
    ...[20, 42, 64, 86, 108].map((x, i) => fz(x, 108, 0.62, pose({ aR: [[6, -60], [2, -56]] }), { top: C.yellow, leg: '#2a63b0', shorts: true, sleeves: false, hs: i % 2 ? 'pony' : 'short' }))),
  // arena: a big roofed building with lights; people stream in
  'sporg.arena': all(rect(0, 0, 120, 120, '#2f3a5c', 0, null), circle(100, 16, 5, '#fff2b0', null), rect(0, 96, 120, 24, '#8a8f9a', 0, null),
    path('M6 96 L6 58 C6 30 114 30 114 58 L114 96 Z', '#d7dde6', C.ink, 1.8), path('M6 58 C6 30 114 30 114 58', 'none', HL, 3), ...[22, 40, 58, 76, 94].map((x) => rect(x - 5, 62, 10, 14, '#fff2b0', 1, C.ink, 1)),
    rect(46, 80, 28, 16, C.dark, 1, C.ink, 1.2), ...[30, 40, 52, 70, 82, 92].map((x, i) => all(circle(x, 102, 2.6, C.skin, C.ink, 0.6), rect(x - 2.6, 104, 5.2, 7, [CLUB, C.red, CLUB2][i % 3]!, 1.5, C.ink, 0.6)))),
  // supporter: a fan holds the club scarf high and sings; the stand behind
  'sporg.supporter': all(rect(0, 0, 120, 120, '#d9dde4', 0, null), crowd(40, 9), crowd(66, 9),
    fz(60, 116, 0.95, ARMS_UP, { top: CLUB, leg: C.navy, mouth: 'open', badge: CLUB2 }),
    path('M46 24 L74 24 L74 31 L46 31 Z', CLUB, C.ink, 1.2), ...[50, 58, 66].map((x) => rect(x, 24, 4, 7, CLUB2, 0, null)), line('M46 24 L44 34 M74 24 L76 34', CLUB2, 2)),

  // ── 4665 Regler och domare ──────────────────────────────────────────
  // döma (en match): the referee in black runs with the play, then stops, blows and points
  'sporg.döma.2': all(pitch(), greyed(fz(92, 108, 0.62, RUN_A, {}), fz(106, 108, 0.62, RUN_B, {})), ball(80, 106, 4),
    swap('sporg-doma', fz(42, 110, 0.95, RUN_A, { top: REF, leg: REF, shorts: true, front: whistle(10, -78, 0.4) }), fz(42, 110, 0.95, WHISTLE, { top: REF, leg: REF, shorts: true, front: whistle(4, -76, 0.45) }), 2.6),
    appear('sporg-doma-snd', 50, sound(52, 28, 0.8))),
  // visselpipa: the whistle on its cord, sound coming out
  'sporg.visselpipa': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), path('M30 10 C10 50 20 80 44 70', 'none', C.red, 2.4), whistle(58, 66, 3, -10), sound(96, 60, 1.2, C.ink)),
  // blåsa av: the referee blows – the sound goes out, the players stop and the ball stands still
  'sporg.blåsa-av.2': all(pitch(), fz(30, 110, 0.95, WHISTLE, { top: REF, leg: REF, shorts: true, front: whistle(4, -76, 0.45) }),
    waPulse('sporg-blasa', sound(40, 32, 1)),
    swap('sporg-blasa-p', all(fz(84, 108, 0.66, RUN_A, { top: CLUB, leg: C.white, shorts: true, sleeves: false }), ball(100, 104, 4)),
      all(fz(84, 108, 0.66, pose({ aL: [[-8, -62], [-10, -74]], aR: [[8, -62], [10, -74]] }), { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'o' }), ball(98, 106, 4)), 2.2),
    rect(70, 20, 40, 24, C.white, 3, C.ink, 1.2), line('M80 28 L80 36 M86 28 L86 36', C.ink, 3)),
  // linjedomare: on the side line, the assistant referee holds up the flag
  'sporg.linjedomare': all(pitch(), line('M10 80 L110 80', C.white, 2.6), fz(56, 104, 0.8, pose({ aR: [[10, -70], [16, -84]] }), { top: C.yellow, leg: REF, shorts: true }),
    at(56, 104, 0.8, line('M16 -84 L21 -106', C.ink, 2.4), g('translate(21 -106) rotate(14)', rect(0, 0, 18, 13, C.red, 0, C.ink, 1), rect(0, 0, 9, 6.5, C.yellow, 0, null), rect(9, 6.5, 9, 6.5, C.yellow, 0, null), rect(0, 0, 18, 13, 'none', 0, C.ink, 1))),
    greyed(fz(20, 112, 0.5, RUN_A, {})), ball(102, 108, 3.4)),
  // tillåten: a clean slide tackle on the ball under a big green tick; behind, the referee waves play on with both arms forward
  'sporg.tillåten': all(pitch(), fz(104, 96, 0.56, pose({ aL: [[9, -62], [21, -64]], aR: [[10, -60], [22, -60]] }), { top: REF, leg: REF, shorts: true }),
    fz(82, 110, 0.7, RUN_B, { top: RIVAL, leg: C.white, shorts: true, sleeves: false }),
    fz(34, 110, 0.8, pose({ h: [0, -10], n: [-14, -32], aL: [[-22, -22], [-26, -6]], aR: [[-6, -30], [4, -36]], lL: [[18, -7], [36, -4]], lR: [[10, -14], [4, -2]] }), { top: CLUB, leg: C.white, shorts: true, sleeves: false }),
    ball(66, 106, 4.4), line('M52 108 L60 108 M54 104 L60 104', HL, 1.6), check(50, 38, 2.2)),
  // tidtagare: at the table beside the court, the timekeeper stops the match clock with one hand on the button
  'sporg.tidtagare': all(hall(), rect(30, 10, 60, 24, C.black, 3, C.ink, 1.6), num(60, 29, '12:34', 15, C.yellow),
    fz(60, 96, 0.7, pose({ h: [0, -26], n: [0, -52], aL: [[-6, -42], [-2, -32]], aR: [[10, -44], [20, -34]], lL: [[14, -26], [14, -1]], lR: [[15, -26], [16, -1]] }), { top: C.white, leg: C.dark, hs: 'long' }),
    rect(26, 74, 72, 6, C.tan, 1, C.ink, 1.4), rect(30, 80, 64, 30, '#b98a5a', 1, C.ink, 1.4), rect(70, 66, 18, 8, C.dark, 2, C.ink, 1.2), circle(79, 66, 3.4, HL, C.ink, 1.2),
    at(42, 70, 1, circle(0, 0, 6, C.white, C.ink, 1.4), line('M0 0 L0 -4 M0 0 L3 1', C.ink, 1.2), rect(-1.5, -9, 3, 3, C.ink, 0.5, null)), frame(26, 6, 68, 32)),
  // gult kort: the referee holds up a yellow card at a player
  'sporg.gult-kort': all(pitch(), fz(40, 108, 0.95, CARD_UP, { top: REF, leg: REF, shorts: true }), cardY(51, 14, 1.6, C.yellow),
    g('translate(120 0) scale(-1 1)', fz(30, 108, 0.82, SAD, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' }))),
  // rött kort: the referee holds up a red card; the player walks off the pitch
  'sporg.rött-kort': all(pitch(), fz(40, 108, 0.95, CARD_UP, { top: REF, leg: REF, shorts: true }), cardY(51, 14, 1.6, C.red),
    fz(90, 108, 0.82, WALK_A, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'sad' }), arrow(98, 70, 116, 70, C.red, 2.6)),
  // visa ut: the referee points to the side; the player walks off the court towards the bench
  'sporg.visa-ut.2': all(hall(), rect(96, 70, 22, 24, '#cfd6de', 2, C.ink, 1.4), line('M96 78 L118 78', C.ink, 1),
    fz(30, 110, 0.92, pose({ aR: [[11, -64], [24, -70]] }), { top: REF, leg: REF, shorts: true }),
    swap('sporg-visaut', fz(62, 108, 0.72, SAD, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'sad' }), fz(92, 108, 0.72, WALK_A, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'sad' }), 2.6),
    line('M56 50 L80 50', HL, 2.4, '4 3'), arrow(78, 50, 90, 50, HL, 2.6)),
  // stänga av: the player sits in ordinary clothes on the stand; the next match in the calendar gets crossed out
  'sporg.stänga-av.3': all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), rect(0, 76, 120, 44, '#bfc5ce', 0, null), line('M0 92 L120 92', C.ink, 1),
    fz(30, 110, 0.86, SIT_CHAIR, { top: C.purple, leg: C.denim, mouth: 'sad' }),
    calendar(62, 14, 50, 44, 4, 2), (() => { const [x, y, w, h] = cell(62, 14, 50, 44, 4, 2, 1, 0); return all(ball(x + w / 2, y + h / 2, 4), appear('sporg-stang', 45, line(`M${x + 2} ${y + 2} L${x + w - 2} ${y + h - 2} M${x + w - 2} ${y + 2} L${x + 2} ${y + h - 2}`, C.red, 3))); })(),
    greyed(fz(92, 110, 0.5, RUN_A, {}))),
  // protest (i tävling): the team leader hands in a written protest at the officials' table
  'sporg.protest.2': all(room(), fz(96, 106, 0.82, pose({}), { top: REF, leg: REF }), rect(62, 70, 54, 7, C.tan, 1, C.ink, 1.4), rect(66, 77, 46, 35, '#b98a5a', 1, C.ink, 1.4),
    fz(30, 110, 0.92, pose({ aR: [[11, -60], [24, -62]] }), { top: CLUB, leg: C.navy, badge: CLUB2, mouth: 'flat' }),
    at(60, 44, 1, paper(-12, -16, 24, 32), rect(-12, -16, 24, 32, 'none', 2, HL, 2.2), line('M2 10 C5 6 8 12 11 8', C.navy, 1.4)), shield(84, 30, 0.6)),

  // ── 4666 Idrottsskador och säkerhet ─────────────────────────────────
  // idrottsskada: a player lies on the pitch holding the knee, the ball has rolled away, pain marks
  'sporg.idrottsskada': all(pitch(), fz(42, 110, 0.95, SIT_KNEE, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'grit' }), path('M62 80 l6 -6 M66 86 l8 -2 M60 76 l2 -8', 'none', C.red, 2.2), circle(55, 94, 7, 'none', HL, 2.4), ball(100, 106, 5)),
  // benskydd: a shin guard on its own and one in place under the sock
  'sporg.benskydd': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), ground(),
    at(36, 62, 1, path('M-12 -30 C-14 0 -10 26 0 32 C10 26 14 0 12 -30 C6 -34 -6 -34 -12 -30 Z', HL, C.ink, 1.8), path('M-8 -20 C-9 0 -6 18 0 22', 'none', 'rgba(255,255,255,0.6)', 2), line('M-11 -24 L11 -24 M-11 22 L11 22', C.dark, 2.2)),
    rect(82, 22, 18, 80, C.skin, 6, C.ink, 1.6), rect(81, 46, 20, 50, CLUB, 4, C.ink, 1.6), path('M84 50 C83 66 84 82 91 90 C98 82 99 66 98 50 Z', 'rgba(239,138,60,0.75)', C.ink, 1), rect(78, 96, 30, 12, C.dark, 3, C.ink, 1.4)),
  // tejpa (idrott): white tape strips wind around the ankle, one after the other
  'sporg.tejpa.2': all(rect(0, 0, 120, 120, '#f2efe8', 0, null), path('M40 10 L66 10 L68 74 C70 84 96 84 106 90 C112 94 110 104 100 104 L44 104 C38 104 38 98 40 92 Z', C.skin, C.ink, 1.8),
    ...[0, 1, 2, 3].map((i) => appear(`sporg-tejpa-${i}`, 8 + i * 18, path(`M${38 + i} ${f1(66 + i * 7)} L${70 + i * 4} ${f1(60 + i * 9)} L${72 + i * 4} ${f1(67 + i * 9)} L${38 + i} ${f1(73 + i * 7)} Z`, C.white, C.ink, 1.2))),
    at(92, 34, 1, circle(0, 0, 12, C.white, C.ink, 1.6), circle(0, 0, 5, C.grey2, C.ink, 1.2))),
  // skadeförebyggande: a player balances on one leg in the warm-up; a shield protects the knee (marked); grey injured reference
  'sporg.skadeförebyggande': all(rect(0, 0, 120, 120, '#eef6f2', 0, null), ground(), fz(50, 110, 1.0, BALANCE, { top: C.green, leg: C.navy, shorts: true, sleeves: false }),
    at(56, 84, 0.95, path('M0 -14 L12 -10 C12 2 7 9 0 13 C-7 9 -12 2 -12 -10 Z', 'rgba(228,87,46,0.25)', HL, 2.2)), check(94, 30, 1.2),
    greyed(fz(100, 112, 0.42, SIT_KNEE, { mouth: 'grit' }))),
  // kylspray: a spray can sprays a cold mist onto a knee
  'sporg.kylspray': all(rect(0, 0, 120, 120, '#eef5fb', 0, null), rect(60, 30, 50, 22, C.skin, 10, C.ink, 1.6), circle(80, 41, 8, 'rgba(214,69,69,0.3)', null),
    g('translate(30 70) rotate(-35)', rect(-9, -26, 18, 44, '#4a8fd6', 4, C.ink, 1.6), rect(-5, -32, 10, 7, C.white, 2, C.ink, 1.2), rect(-9, -10, 18, 10, C.white, 0, null), path('M-6 -6 L0 -2 L6 -6', 'none', '#4a8fd6', 1.6)),
    ...[[50, 44], [58, 38], [56, 50], [66, 44], [64, 34]].map(([x, y]) => circle(x!, y!, 2.2, '#bfe3f5', '#7fb6dc', 0.8)), line('M46 42 L58 38 M47 48 L60 50', '#7fb6dc', 1.2, '2 2')),
  // överbelastningsskada: a runner does lap after lap; the heel (Achilles) glows more each lap
  'sporg.överbelastningsskada': all(rect(0, 0, 120, 120, '#f5f0ea', 0, null), ellipse(60, 78, 52, 26, 'none', '#d0694f', 7), ellipse(60, 78, 52, 26, 'none', C.white, 0.8),
    ...[0, 1, 2, 3, 4].map((i) => line(`M${12 + i * 7} 12 L${12 + i * 7} 24`, C.ink, 2)), line('M10 20 L44 14', C.ink, 1.6),
    fz(70, 100, 0.72, RUN_A, { top: C.sky, leg: C.navy, shorts: true, sleeves: false, mouth: 'grit' }), waPulse('sporg-over', circle(56, 88, 5.5, 'rgba(214,69,69,0.55)', C.red, 1.4))),
  // bår: two helpers carry a player on a stretcher off the pitch
  'sporg.bår': all(pitch(), rect(22, 72, 76, 6, '#e8e1d2', 2, C.ink, 1.4), line('M14 75 L22 75 M98 75 L106 75', C.ink, 2.6), fz(70, 72, 0.7, LIE, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' }),
    fz(12, 110, 0.82, CARRY, { top: C.red, leg: C.dark }), fz(108, 110, 0.82, CARRY, { top: C.red, leg: C.dark })),

  // ── 4667 Idrottens etik och fair play ───────────────────────────────
  // fair play: an opponent lies injured, so the player with the ball kicks it out over the side line on purpose (arrow, tick, heart)
  'sporg.fair-play': all(pitch(), line('M106 80 L106 120', C.white, 3), fz(40, 112, 0.6, LIE, { top: RIVAL, leg: C.white, shorts: true, sleeves: false, mouth: 'grit' }), line('M46 100 l2 -8 M52 102 l6 -6', C.red, 2),
    fz(66, 110, 0.86, KICK, { top: CLUB, leg: C.white, shorts: true, sleeves: false }), line('M94 92 C102 80 108 80 114 88', HL, 2.4, '4 3'), arrow(110, 84, 115, 90, HL, 2.6), ball(115, 100, 4),
    check(92, 30, 1.2), heart(64, 24, 7)),
  // respekt (hänsyn): the referee shows a decision; the player stands still with hands behind the back and nods, the teammates do the same
  'sporg.respekt.2': all(pitch(), fz(22, 110, 0.92, pose({ aR: [[11, -64], [24, -70]] }), { top: REF, leg: REF, shorts: true }),
    g('translate(120 0) scale(-1 1)', fz(54, 110, 0.88, HANDS_BACK, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' }), fz(30, 106, 0.7, HANDS_BACK, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' }), fz(12, 104, 0.62, HANDS_BACK, { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' })),
    path('M58 20 C62 14 70 14 72 20', 'none', HL, 2.2), arrow(70, 18, 72, 23, HL, 2.2), path('M84 32 C87 27 93 27 95 32', 'none', HL, 1.8), path('M102 38 C104 34 110 34 111 38', 'none', HL, 1.6)),
  // fusk: a runner cuts straight across the inside of the track while the others run around the bend
  'sporg.fusk': all(rect(0, 0, 120, 120, '#e3f1fa', 0, null), path('M10 110 L10 60 C10 20 110 20 110 60 L110 110', 'none', '#d0694f', 16), line('M10 110 L10 60 C10 20 110 20 110 60 L110 110', C.white, 0.8, '3 3'),
    rect(26, 40, 68, 72, '#7fbf6a', 0, null), greyed(fz(20, 50, 0.4, RUN_A, {}), fz(100, 44, 0.4, RUN_B, {})),
    line('M24 96 L84 66', HL, 2.4, '4 3'), fz(62, 92, 0.6, RUN_A, { top: HL, leg: C.navy, shorts: true, sleeves: false }), cross(98, 92, 0.9)),
  // osportslig: on the court a player slams the stick into the floor and shouts at the referee; a red cross over the player
  'sporg.osportslig': all(hall(), fz(94, 110, 0.84, pose({ aL: [[-8, -56], [-10, -44]] }), { top: REF, leg: REF, shorts: true, mouth: 'flat' }),
    fz(40, 110, 0.95, pose({ aR: [[12, -58], [20, -46]], aL: [[-10, -66], [-18, -76]] }), { top: C.red, leg: C.white, shorts: true, sleeves: false, mouth: 'open' }),
    line('M59 66 L72 108', C.ink, 3.6), line('M59 66 L72 108', C.white, 2), path('M70 106 L80 110 L78 112 L68 110 Z', C.dark, C.ink, 1), line('M64 104 l-6 -4 M82 104 l6 -4 M74 100 l0 -6', HL, 2),
    path('M58 26 L66 22 L64 30 L74 28 L68 36 L76 40', 'none', C.red, 2.4), cross(40, 12, 1.1)),
  // förlorare: the player who lost sits head down on the bench; the winners cheer in grey behind
  'sporg.förlorare': all(pitch(), greyed(fz(86, 92, 0.5, ARMS_UP, { mouth: 'open' }), fz(104, 92, 0.5, ARMS_UP, { mouth: 'open' }), trophy(95, 40, 0.5)),
    rect(14, 86, 52, 5, C.brown, 1, C.ink, 1.2), line('M18 91 L18 108 M62 91 L62 108', C.ink, 2.4),
    fz(40, 108, 0.86, pose({ h: [0, -26], n: [8, -50], aL: [[10, -38], [14, -46]], aR: [[11, -38], [15, -46]], lL: [[18, -26], [18, -1]], lR: [[19, -26], [20, -1]] }), { top: HL, leg: C.navy, shorts: true, sleeves: false, mouth: 'sad' })),
  // doping: a syringe and pills beside the running shoes and the dumbbell – forbidden help for the body
  'sporg.doping': all(rect(0, 0, 120, 120, '#f4eef0', 0, null), ground(), rect(10, 96, 100, 6, C.tan, 1, C.ink, 1.2),
    syringe(48, 70, 1.8, -25), pill(80, 88, 20), pill(92, 90, -10, C.yellow), pill(86, 80, 60, C.sky),
    at(26, 92, 1, path('M-12 0 L-12 -8 C-6 -10 2 -14 10 -10 L14 0 Z', C.white, C.ink, 1.2)), frame(18, 30, 70, 50)),
  // dopingkontroll: an official with a clipboard waits while the athlete holds up a sealed sample bottle
  'sporg.dopingkontroll': all(room('#f0f4f7', '#ccd3da'), fz(84, 110, 0.92, pose({ aL: [[-4, -58], [4, -54]], aR: [[6, -58], [12, -54]] }), { top: C.white, leg: C.dark, hs: 'bun' }), at(96, 56, 0.9, clipboard(0, 0)),
    fz(32, 110, 0.92, pose({ aR: [[11, -62], [16, -76]] }), { top: C.red, leg: C.white, shorts: true, sleeves: false, front: medal(2, -60, 0.6) }), sampleCup(48, 30, 1.3), frame(36, 6, 24, 34)),
  // matchfixning: money is passed under the table while the scoreboard already shows the result
  'sporg.matchfixning': all(rect(0, 0, 120, 120, '#2f3442', 0, null), rect(24, 8, 72, 28, C.black, 3, C.ink, 1.6), num(46, 30, '0', 20, C.yellow), num(60, 29, ':', 18, C.yellow), num(74, 30, '3', 20, C.yellow),
    rect(10, 72, 100, 6, C.brown, 1, C.ink, 1.4), line('M16 78 L16 112 M104 78 L104 112', C.brown, 3),
    fz(24, 112, 0.7, pose({ aR: [[10, -58], [22, -40]] }), { top: C.dark, leg: C.dark, hs: 'cap', mouth: 'flat' }),
    g('translate(120 0) scale(-1 1)', fz(24, 112, 0.7, pose({ aR: [[10, -58], [22, -40]] }), { top: CLUB, leg: C.white, shorts: true, sleeves: false, mouth: 'flat' })),
    at(60, 88, 1, rect(-10, -6, 20, 13, '#e8dcc0', 1, C.ink, 1.2), path('M-10 -6 L0 2 L10 -6', 'none', C.ink, 1)), bill(52, 82, -15), bill(68, 82, 12), coin(60, 96), frame(44, 76, 32, 26)),
};
