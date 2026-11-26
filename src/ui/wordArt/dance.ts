/**
 * Kultur & fritid → Musik & scenkonst → Dans & musikal, 4461–4467 (0.62): classical ballet, modern dance, ballroom
 * dance, street dance, dance verbs, the parts of a musical, choreography and stage presence.
 * Dancers are drawn with their own posable figure (`dz`): every limb is a joint chain, so a pose can show a plié, an
 * arabesque, a leap, a dip or a headspin. The part the word names is orange (orange ring, frame, arrow or fill); grey
 * figures and things are the reference. Music is shown as notes, time signatures as digits, scores as digits on cards.
 * Words that are easy to mix up get different kinds of picture: one dancing person (dansa) against a couple (vals,
 * tango, bugg, salsa: each with its own setting and props), the shoe (tåspetssko) against the skirt (tutu) against
 * the dancer (ballerina), the jump up (hoppa) against the landing (landa) against the fall (falla), a ring of people
 * holding hands (ring) against two dancers facing each other inside a crowd (battle) against a podium (tävling).
 * Verbs move (base state = poster frame, transform and opacity only). No letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, heart } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const mnote = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M2.6 5 L2.6 -10 C6 -8 8 -6 8 -2', col, 2), ellipse(0, 5.6, 3.4, 2.6, col, null));
const dnote = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
/** Rock a part about (cx, cy) by ±deg (local units). */
const rotAbout = (name: string, cx: number, cy: number, deg: number, dur: number, ...k: Svg[]) =>
  moving(name, `0%,100%{transform:rotate(0)}50%{transform:translate(${cx}px,${cy}px) rotate(${deg}deg) translate(${-cx}px,${-cy}px)}`, { dur }, ...k);

// ── The posable dancer ───────────────────────────────────────────────
type Pose = { h: Pt; n: Pt; aL: [Pt, Pt]; aR: [Pt, Pt]; lL: [Pt, Pt]; lR: [Pt, Pt] };
type Look = {
  top?: string; leg?: string; skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'cap'; tutu?: string; skirt?: string; dress?: string;
  shoe?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'o' | 'frown'; sleeves?: boolean; front?: Svg; tie?: boolean; noArm?: 'L' | 'R' | 'both';
};
const STAND: Pose = { h: [0, -42], n: [0, -68], aL: [[-7, -56], [-9, -43]], aR: [[7, -56], [9, -43]], lL: [[-4, -21], [-5, -1]], lR: [[4, -21], [5, -1]] };
const pose = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });
/** Dancer with feet near (x, y); local height ≈ 86·s. */
function dz(x: number, y: number, s: number, p: Pose, o: Look = {}): Svg {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.sky), leg = grey ? C.grey : (o.leg ?? C.navy);
  const hair = grey ? C.grey : (o.hair ?? C.hair), shoe = grey ? C.grey : (o.shoe ?? C.black);
  const armCol = o.sleeves === false ? skin : top;
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
  const legsSkirt = o.dress ? g(`translate(${waist[0]} ${waist[1]}) rotate(${ang})`, path('M-6 0 L6 0 L17 30 Q0 34 -17 30 Z', o.dress, ink, 1.6))
    : o.skirt ? g(`translate(${waist[0]} ${waist[1]}) rotate(${ang})`, path('M-6 0 L6 0 L13 16 Q0 19 -13 16 Z', o.skirt, ink, 1.6)) : '';
  const tutu = o.tutu ? g(`translate(${p.h[0]} ${p.h[1]}) rotate(${ang})`, ellipse(0, 0, 17, 4.6, o.tutu, ink, 1.4), path('M-15 0 L-11 3 L-7 0 L-3 3 L1 0 L5 3 L9 0 L13 3', 'none', ink, 0.8)) : '';
  const hairBack = o.hs === 'long' ? g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, path('M-9 -2 C-11 12 -6 14 0 13 C6 14 11 12 9 -2 Z', hair, ink, 1.2)) : '';
  const hairTop = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`,
    o.hs === 'bun' ? all(circle(0, -10.5, 3.8, hair, ink, 1.2), path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2))
      : o.hs === 'cap' ? all(path('M-8.5 -1 C-8.5 -12 8.5 -12 8.5 -1 Z', C.red, ink, 1.2), path('M4 -2 L14 -1 L8.5 -1 Z', C.red, ink, 1.2))
        : path('M-8 -1 C-8 -11 8 -11 8 -1 C5 -5 -5 -5 -8 -1 Z', hair, ink, 1.2));
  const m = o.mouth ?? 'smile';
  const face = g(`translate(${head[0]} ${head[1]}) rotate(${ang})`, circle(-2.8, 0.5, 1, ink, null), circle(2.8, 0.5, 1, ink, null),
    m === 'open' ? ellipse(0, 4.2, 1.8, 2, '#c84a4a', ink, 0.8) : m === 'o' ? circle(0, 4.2, 1.2, '#c84a4a', ink, 0.8)
      : m === 'flat' ? line('M-2.4 4 L2.4 4', ink, 1) : m === 'frown' ? path('M-2.4 5 Q0 2.6 2.4 5', 'none', ink, 1) : path('M-2.6 3.2 Q0 5.6 2.6 3.2', 'none', ink, 1));
  return at(x, y, s,
    hairBack, limb(p.h, p.lL, leg, 5), foot(p.lL), limb(p.h, p.lR, leg, 5), foot(p.lR), legsSkirt,
    line(torso, ink, 14.4), line(torso, top, 12), o.tie ? line(`M${p.n[0]} ${p.n[1] + 2} L${f1(p.n[0] - ux * 8)} ${f1(p.n[1] - uy * 8)}`, C.white, 2.6) : '', tutu,
    o.noArm === 'L' || o.noArm === 'both' ? '' : all(limb(p.n, p.aL, armCol, 4.4), hand(p.aL)), o.noArm === 'R' || o.noArm === 'both' ? '' : all(limb(p.n, p.aR, armCol, 4.4), hand(p.aR)),
    circle(head[0], head[1], 8, skin, ink, 1.6), hairTop, face, o.front ?? '');
}
// ── Poses ─────────────────────────────────────────────────────────────
const ARMS_UP = { aL: [[-6, -80], [-3, -92]] as [Pt, Pt], aR: [[6, -80], [3, -92]] as [Pt, Pt] };
const ARMS_OUT = { aL: [[-13, -66], [-25, -64]] as [Pt, Pt], aR: [[13, -66], [25, -64]] as [Pt, Pt] };
const ARMS_ROUND = { aL: [[-11, -56], [-3, -50]] as [Pt, Pt], aR: [[11, -56], [3, -50]] as [Pt, Pt] };
const ARABESQUE = pose({ h: [0, -40], n: [6, -64], aL: [[-6, -66], [-16, -70]], aR: [[16, -70], [28, -76]], lL: [[-1, -20], [0, -1]], lR: [[-12, -44], [-30, -50]] });
const RELEVE = pose({ ...ARMS_UP, h: [0, -46], n: [0, -72], lL: [[-2, -24], [-1, -3]], lR: [[2, -24], [1, -3]] });
const LEAP = pose({ h: [0, -52], n: [5, -77], aL: [[-10, -80], [-20, -88]], aR: [[16, -76], [28, -80]], lL: [[-14, -46], [-30, -42]], lR: [[12, -46], [28, -48]] });
const PLIE = pose({ ...ARMS_ROUND, h: [0, -32], n: [0, -58], lL: [[-11, -18], [-5, -1]], lR: [[11, -18], [5, -1]] });

// ── Settings ──────────────────────────────────────────────────────────
const STAGE = '#2d2a3e', CURTAIN = '#8c2b3a', FLOOR = '#6b4a33', STUDIO = '#efe6d6', WOOD = '#c98a4b';
const stage = () => all(rect(0, 0, 120, 120, STAGE, 0, null), path('M0 0 L18 0 C14 30 18 60 10 92 L0 92 Z', CURTAIN, null), path('M120 0 L102 0 C106 30 102 60 110 92 L120 92 Z', CURTAIN, null), rect(0, 92, 120, 28, FLOOR, 0, null), line('M0 92 L120 92', C.ink, 1.6));
const spot = (x: number, w = 40, y = 104) => path(`M${x - 6} 0 L${x + 6} 0 L${x + w / 2} ${y} L${x - w / 2} ${y} Z`, 'rgba(255,240,180,0.33)', null);
const audience = (n: number, y = 120, col = '#1c1a28') => all(...range(n).map((i) => { const x = 8 + i * (104 / (n - 1)); return all(circle(x, y - 10, 7, col, null), rect(f1(x - 9), y - 4, 18, 10, col, 4, null)); }));
const studio = (mirror = true, barre = false) => all(rect(0, 0, 120, 120, STUDIO, 0, null), rect(0, 96, 120, 24, '#d9b98c', 0, null), line('M0 96 L120 96', C.ink, 1.4),
  mirror ? all(rect(10, 14, 100, 66, '#d6eaf2', 2, C.ink, 1.6), line('M24 20 L36 72 M80 20 L92 72', '#ffffff', 2.4)) : '',
  barre ? all(line('M4 60 L116 60', '#a8743e', 3.2), line('M14 60 L14 70 M106 60 L106 70', C.ink, 1.4)) : '');
const wood = () => all(rect(0, 0, 120, 120, '#f2ead8', 0, null), rect(0, 98, 120, 22, WOOD, 0, null), line('M0 98 L120 98', C.ink, 1.4));
const chandelier = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -12 L0 0', C.ink, 1.2), path('M-14 0 Q0 8 14 0', 'none', C.gold, 2.4), ...[-14, -5, 5, 14].map((cx) => all(line(`M${cx} 0 L${cx} -4`, C.ink, 1), ellipse(cx, -6, 1.6, 2.6, C.yellow, null))));
const crowdRow = (y: number, n: number, x0 = 6, x1 = 114, cols = [C.navy, C.purple, C.green, C.red, C.denim]) => all(...range(n).map((i) => {
  const x = f1(x0 + (i * (x1 - x0)) / (n - 1)), c = cols[i % cols.length]!;
  return greyed(all(path(`M${x - 7} ${y + 12} C${x - 7} ${y + 2} ${x + 7} ${y + 2} ${x + 7} ${y + 12} Z`, c, C.ink, 1), circle(x, y - 2, 5, C.skin, C.ink, 1)));
}));

// ── Objects ───────────────────────────────────────────────────────────
const pointeShoe = (x: number, y: number, s = 1, rot = 0, col: string = C.rose) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M-20 6 C-22 -2 -14 -8 -4 -8 L16 -6 C24 -5 24 5 16 6 Z', col, C.ink, 1.8), path('M14 -6 C20 -5 20 5 14 6 Z', '#e7a9b9', C.ink, 1.2),
  path('M-14 -6 C-8 -2 0 -2 6 -6', 'none', C.ink, 1.2), path('M-8 -6 C-14 -24 -22 -28 -30 -30 M-4 -6 C-2 -24 6 -30 12 -34', 'none', '#f2a6bc', 2.2));
const tutuObj = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s,
  path('M-10 -18 L10 -18 L12 -4 L-12 -4 Z', col, C.ink, 1.6), ellipse(0, 0, 34, 8, col, C.ink, 1.8), ellipse(0, -2, 28, 5, '#f4f0f6', C.ink, 1),
  path('M-32 2 L-26 6 L-20 2 L-14 6 L-8 2 L-2 6 L4 2 L10 6 L16 2 L22 6 L28 2', 'none', C.ink, 1));
const danceShoe = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-14 4 C-14 -6 -4 -8 4 -4 L14 2 L14 6 L-14 6 Z', col, C.ink, 1.6), path('M10 4 L12 14 L15 14 L14 4 Z', col, C.ink, 1.2), line('M-6 -6 L2 -2', C.ink, 1.4));
const menShoe = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 6 C-16 -4 -6 -6 2 -4 C10 -3 16 0 16 6 Z', C.black, C.ink, 1.6), path('M-14 6 L16 6 L16 9 L-14 9 Z', C.dark, C.ink, 1), line('M-4 -4 L2 -1', C.white, 1.2));
const headset = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 -2 C-9 -14 9 -14 9 -2', 'none', C.dark, 1.6), line('M-9 0 C-9 6 -6 8 -2 8', C.dark, 1.4), circle(-1, 8, 1.8, HL, C.ink, 0.8));
const book = (x: number, y: number, s = 1, col = '#7a3b3b') => at(x, y, s, path('M-26 -16 L0 -12 L0 18 L-26 14 Z', C.white, C.ink, 1.6), path('M26 -16 L0 -12 L0 18 L26 14 Z', C.white, C.ink, 1.6), path('M-28 -14 L-28 16 L0 20 L28 16 L28 -14', 'none', col, 2.4));
const scoreCard = (x: number, y: number, n: string, col: string = C.white) => all(rect(x - 7, y - 9, 14, 12, col, 1.5, C.ink, 1.2), num(x, y, n, 9));
const boombox = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -9, 32, 18, C.dark, 3, C.ink, 1.6), circle(-8, 1, 5, '#55586a', C.ink, 1), circle(8, 1, 5, '#55586a', C.ink, 1), path('M-10 -9 L-8 -15 L8 -15 L10 -9', 'none', C.ink, 1.6));
const trophy = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -12 L8 -12 L6 0 C4 4 -4 4 -6 0 Z', C.gold, C.ink, 1.4), path('M-8 -10 C-14 -10 -14 -2 -6 -2 M8 -10 C14 -10 14 -2 6 -2', 'none', C.ink, 1.4), rect(-2, 3, 4, 5, C.gold, 0, C.ink, 1), rect(-7, 8, 14, 4, C.brown, 1, C.ink, 1.2));
const rose = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L10 6', C.green, 1.8), circle(0, 0, 3.4, C.red, C.ink, 1));
const accordion = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -7, 6, 14, C.dark, 1, C.ink, 1), path('M-4 -6 L-1 6 L2 -6 L5 6', 'none', C.ink, 1.2), path('M-4 -6 L6 -6 L6 6 L-4 6 Z', '#c9a26b', C.ink, 1), rect(6, -7, 6, 14, C.dark, 1, C.ink, 1));
const maraca = (x: number, y: number, rot = 0, col: string = C.yellow) => g(`translate(${x} ${y}) rotate(${rot})`, ellipse(0, -6, 4.4, 6, col, C.ink, 1.2), line('M0 0 L0 8', C.brown, 2.2));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -6, 4, 12, C.brown, 1, null), path('M0 -30 L11 -8 L-11 -8 Z', '#3f7d4f', C.ink, 1.2), path('M0 -38 L8 -20 L-8 -20 Z', '#4f9d69', C.ink, 1.2));
const birch = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -30, 4, 30, C.white, 1, C.ink, 1), line('M-2 -22 L0 -22 M0 -12 L2 -12', C.ink, 1), circle(0, -36, 10, '#7fbf6a', C.ink, 1.2));

// ── Couples ───────────────────────────────────────────────────────────
/** Ballroom hold: man (left) and woman (right) facing each other. */
const hold = (x: number, y: number, s: number, man: Look, woman: Look, womanPose?: Pose, manPose?: Pose) => all(
  dz(x - 9, y, s, manPose ?? pose({ n: [2, -68], aL: [[-6, -76], [6, -84]], aR: [[10, -60], [18, -60]], lL: [[-4, -21], [-6, -1]], lR: [[4, -21], [7, -1]] }), { top: C.black, leg: C.black, sleeves: true, tie: true, ...man }),
  dz(x + 9, y, s, womanPose ?? pose({ n: [-2, -68], aL: [[-10, -76], [-12, -84]], aR: [[-8, -62], [-14, -64]], lL: [[-4, -21], [-6, -1]], lR: [[4, -21], [6, -1]] }), { hs: 'bun', top: C.red, dress: C.red, sleeves: false, ...woman }));

export const DANCE_MOTIFS: Record<string, Svg> = {
  // ── 4461 Klassisk balett ───────────────────────────────────────────
  // dans: dance as a whole – three framed small scenes (ballet, couple, street) around a note
  'dance.dans': all(rect(0, 0, 120, 120, '#f7f1e6', 0, null),
    frame(6, 8, 50, 50, C.grey), dz(31, 54, 0.46, ARABESQUE, { top: C.rose, leg: C.rose, tutu: C.white, hs: 'bun', sleeves: false, shoe: C.rose }),
    frame(64, 8, 50, 50, C.grey), hold(89, 54, 0.44, {}, {}),
    frame(35, 64, 50, 50, C.grey), dz(60, 110, 0.44, pose({ h: [0, -38], n: [-6, -62], aL: [[-16, -70], [-22, -82]], aR: [[12, -56], [20, -66]], lL: [[-10, -20], [-16, -1]], lR: [[10, -22], [14, -4]] }), { top: C.yellow, leg: C.denim, hs: 'cap' }),
    dnote(18, 92, 1.2, HL), mnote(102, 92, 1.2, HL)),
  // balett: a ballet on stage – a row of ballerinas in the same arabesque
  'dance.balett': all(stage(), spot(60, 90), ...[26, 60, 94].map((x, i) => dz(x, 100, 0.62, ARABESQUE, { top: C.white, leg: C.rose, tutu: C.white, hs: 'bun', sleeves: false, shoe: C.rose, hair: i === 1 ? '#6b4a2b' : C.hair })), audience(6, 122)),
  // ballerina: one woman on pointe in a tutu, arms up
  'dance.ballerina': all(rect(0, 0, 120, 120, '#f3eaf2', 0, null), ground(), sparkle(24, 30, 5), sparkle(98, 40, 4),
    dz(60, 111, 1.15, RELEVE, { top: C.pink, leg: C.rose, tutu: C.pink, hs: 'bun', sleeves: false, shoe: C.rose }), ring(60, 16, 12)),
  // tåspetssko: the pointe shoe with ribbons (object)
  'dance.tåspetssko': all(rect(0, 0, 120, 120, '#f7eef0', 0, null), greyed(pointeShoe(44, 96, 0.8, 0, C.rose)), pointeShoe(66, 72, 1.5, -18), ring(92, 58, 12)),
  // tutu: the stiff short skirt alone on a hanger
  'dance.tutu': all(rect(0, 0, 120, 120, '#eef2f7', 0, null), line('M60 12 L60 22', C.ink, 1.6), path('M60 12 C64 8 60 4 57 7', 'none', C.ink, 1.6), path('M34 30 L60 22 L86 30', 'none', C.ink, 2),
    tutuObj(60, 70, 1.3, C.white), frame(12, 50, 96, 32)),
  // balettstång: dancers holding the barre in the studio
  'dance.balettstång': all(studio(true, true), ...[30, 66].map((x) => greyed(dz(x, 110, 0.72, pose({ aL: [[-12, -58], [-18, -50]], aR: [[12, -66], [22, -74]], lR: [[10, -26], [16, -6]] }), { top: C.lilac, leg: C.rose, hs: 'bun', sleeves: false }))),
    line('M4 60 L116 60', HL, 3.6), line('M14 60 L14 70 M106 60 L106 70', HL, 1.8)),
  // balettskola: a school building with a ballerina sign-shape and children in tutus going in
  'dance.balettskola': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), ground(), path('M14 112 L14 44 L60 18 L106 44 L106 112 Z', '#e9d8c4', C.ink, 1.8), rect(48, 80, 24, 32, C.brown, 2, C.ink, 1.6),
    rect(22, 54, 18, 16, '#bfe3f5', 1, C.ink, 1.2), rect(80, 54, 18, 16, '#bfe3f5', 1, C.ink, 1.2), circle(60, 46, 11, C.white, C.ink, 1.4), at(60, 56, 0.2, dz(0, 0, 1, RELEVE, { tutu: C.pink, top: C.pink, leg: C.rose, hs: 'bun', sleeves: false })),
    ...[30, 88].map((x) => dz(x, 112, 0.42, pose({ ...ARMS_ROUND }), { tutu: C.pink, top: C.pink, leg: C.rose, hs: 'bun', sleeves: false })), frame(10, 14, 100, 100)),
  // position (in ballet): feet seen from above in first position, dancer standing in it
  'dance.position.3': all(rect(0, 0, 120, 120, '#f6f0e8', 0, null), ground(),
    dz(34, 110, 0.95, pose({ aL: [[-9, -50], [-4, -44]], aR: [[9, -50], [4, -44]], lL: [[-2, -21], [-3, -1]], lR: [[2, -21], [3, -1]] }), { top: C.lilac, leg: C.rose, tutu: C.lilac, hs: 'bun', sleeves: false, shoe: C.rose }),
    rect(66, 30, 46, 50, C.white, 4, C.ink, 1.4), g('translate(89 62)', ellipse(-9, -6, 4, 10, C.rose, C.ink, 1.2), ellipse(9, -6, 4, 10, C.rose, C.ink, 1.2)), g('translate(89 62) rotate(0)', g('rotate(-35 -3 4)', ellipse(-7, -6, 4, 11, C.rose, C.ink, 1.2)), g('rotate(35 3 4)', ellipse(7, -6, 4, 11, C.rose, C.ink, 1.2))),
    frame(64, 28, 50, 54), line('M40 108 L66 70', HL, 1.6, '3 3')),
  // plié: knees bend slowly with a straight back (moves down and up)
  'dance.plié': all(studio(true, true), greyed(dz(28, 110, 0.85, STAND, { top: C.lilac, leg: C.rose, hs: 'bun', sleeves: false })),
    moving('dance-plie', '0%,100%{transform:translate(0,-8px)}50%{transform:translate(0,0)}', { dur: 2.6 }, dz(80, 110, 0.85, PLIE, { top: C.pink, leg: C.rose, hs: 'bun', sleeves: false })),
    arrow(104, 46, 104, 70, HL, 2.6), line('M80 46 L80 80', HL, 1.4, '3 3')),
  // piruett: a spin on one leg (turns)
  'dance.piruett': all(stage(), spot(60, 60), ellipse(60, 104, 22, 5, 'none', HL, 2.2), arrow(76, 106, 82, 102, HL, 2.2),
    moving('dance-piruett', '0%,100%{transform:scale(1,1)}25%{transform:scale(-1,1)}50%{transform:scale(1,1)}75%{transform:scale(-1,1)}', { dur: 1.6, spin: true },
      dz(60, 104, 0.95, pose({ ...ARMS_ROUND, aL: [[-12, -70], [-4, -78]], aR: [[12, -70], [4, -78]], lL: [[-1, -22], [0, -2]], lR: [[10, -32], [1, -24]] }), { top: C.pink, leg: C.rose, tutu: C.pink, hs: 'bun', sleeves: false, shoe: C.rose }))),
  // språng: a big leap across the stage
  'dance.språng.2': all(stage(), spot(60, 80), line('M10 96 Q60 20 110 96', HL, 2, '4 4'),
    waIn('dance-sprang', -20, 16, dz(62, 92, 0.9, LEAP, { top: C.white, leg: C.white, tutu: C.white, hs: 'bun', sleeves: false, shoe: C.rose }))),
  // graciös: a dancer moves softly (bright) beside a grey stiff figure
  'dance.graciös': all(rect(0, 0, 120, 120, '#f3f0f7', 0, null), ground(),
    greyed(dz(24, 111, 0.82, pose({ aL: [[-10, -60], [-6, -46]], aR: [[10, -56], [14, -66]], lL: [[-6, -20], [-10, -1]], lR: [[6, -20], [10, -1]] }), { mouth: 'frown' })),
    rotAbout('dance-gracios', 76, 111, 6, 3, dz(76, 111, 0.95, ARABESQUE, { top: C.lilac, leg: C.lilac, dress: C.lilac, hs: 'bun', sleeves: false })),
    line('M54 40 C66 26 92 20 110 30', HL, 2.4), line('M52 52 C66 40 90 38 108 44', HL, 1.6)),

  // ── 4462 Modern dans ───────────────────────────────────────────────
  // modern dans: barefoot dancer in a loose grey-blue costume reaching out and down to the floor, abstract shapes behind
  'dance.modern-dans': all(rect(0, 0, 120, 120, '#ecebe6', 0, null), circle(84, 34, 20, '#d9c8e8', null), rect(14, 22, 30, 30, '#cfe1ea', 0, null), ground(),
    dz(58, 111, 1.0, pose({ h: [-2, -34], n: [16, -56], aL: [[30, -60], [42, -54]], aR: [[2, -70], [-10, -84]], lL: [[-14, -16], [-30, -1]], lR: [[8, -14], [12, -1]] }), { top: '#6c8fb3', leg: '#6c8fb3', skin: C.skin, shoe: C.skin, hs: 'long' })),
  // dansare: a dancer bows to the audience after the performance (the person)
  'dance.dansare': all(stage(), spot(60, 50), audience(7, 122),
    dz(60, 100, 0.9, pose({ h: [0, -40], n: [12, -60], aL: [[14, -48], [12, -38]], aR: [[26, -60], [36, -66]], lL: [[-3, -20], [-4, -1]], lR: [[3, -20], [6, -1]] }), { top: C.green, leg: C.dark }), ring(70, 34, 14), heart(30, 30, 0.8), heart(92, 26, 0.7)),
  // danskompani: a group of dancers in the same costume, posed together like a group photo
  'dance.danskompani': all(rect(0, 0, 120, 120, '#efeae2', 0, null), ground(), rect(8, 18, 104, 6, C.grey2, 2, null),
    ...[18, 42, 66, 90].map((x, i) => dz(x + 6, 111, 0.68, i % 2 ? pose(ARMS_OUT) : pose(ARMS_UP), { top: C.purple, leg: C.purple, hs: i % 2 ? 'long' : 'short', shoe: C.skin })),
    ...[30, 54, 78].map((x) => dz(x + 6, 100, 0.5, pose({ ...ARMS_ROUND }), { top: C.purple, leg: C.purple, shoe: C.skin })), frame(6, 30, 108, 84)),
  // dansföreställning: seen from the seats – the audience in front of a stage with dancers
  'dance.dansföreställning': all(stage(), spot(40, 40), spot(82, 40), dz(42, 96, 0.55, LEAP, { top: C.yellow, leg: C.yellow }), dz(80, 96, 0.55, ARABESQUE, { top: C.yellow, leg: C.yellow, hs: 'long' }),
    audience(7, 122), audience(6, 110, '#2a2738'), rect(42, 4, 36, 10, C.gold, 2, C.ink, 1), dnote(60, 10, 0.4, C.ink)),
  // experimentell: dance + film + strange shapes: a dancer in front of a projected film and a lab flask shape (new ways)
  'dance.experimentell': all(rect(0, 0, 120, 120, '#20202a', 0, null), rect(10, 10, 100, 56, '#3c6a8a', 2, C.ink, 1.4), path('M10 50 L40 28 L62 46 L84 22 L110 40 L110 66 L10 66 Z', '#66a0c0', null),
    ...[[26, 26], [92, 52]].map(([x, y]) => star(x!, y!, 5, C.reflex)), rect(0, 96, 120, 24, '#3a3a48', 0, null),
    dz(54, 104, 0.72, pose({ h: [0, -36], n: [-14, -54], aL: [[-26, -50], [-34, -40]], aR: [[-4, -70], [8, -78]], lL: [[8, -20], [18, -4]], lR: [[-6, -18], [-2, -1]] }), { top: '#e6e6e6', leg: '#e6e6e6', shoe: C.skin }),
    at(96, 98, 0.9, path('M-5 -18 L5 -18 L5 -8 L14 10 L-14 10 L-5 -8 Z', 'rgba(215,242,58,0.45)', C.reflex, 1.6), line('M-7 -18 L7 -18', C.reflex, 2)), waPulse('dance-exp', circle(96, 102, 3, C.reflex, null), circle(92, 96, 2, C.reflex, null))),
  // frigörande: a dancer breaks out of a grey box with chains/rules, arms wide, birds fly
  'dance.frigörande': all(rect(0, 0, 120, 120, '#eaf3f8', 0, null), ground(), greyed(rect(18, 40, 34, 72, 'none', 2, C.grey, 3), line('M18 60 L52 60 M18 80 L52 80 M18 100 L52 100', C.grey, 2)),
    dz(76, 111, 0.98, pose({ h: [0, -46], n: [0, -72], aL: [[-14, -82], [-26, -90]], aR: [[14, -82], [26, -90]], lL: [[-6, -24], [-10, -3]], lR: [[6, -24], [10, -3]] }), { top: C.yellow, leg: C.orange, shoe: C.skin, mouth: 'open' }),
    waIn('dance-frig', -6, 10, path('M96 20 q4 -4 8 0 q4 -4 8 0', 'none', C.ink, 1.6), path('M84 10 q3 -3 6 0 q3 -3 6 0', 'none', C.ink, 1.4)), sparkle(52, 30, 5, HL)),

  // ── 4463 Sällskapsdans ─────────────────────────────────────────────
  // sällskapsdans: several couples in ballroom clothes on a parquet floor under a chandelier
  'dance.sällskapsdans': all(rect(0, 0, 120, 120, '#f4e9d8', 0, null), rect(0, 86, 120, 34, '#c99a63', 0, null), line('M0 86 L120 86 M20 86 L10 120 M50 86 L46 120 M80 86 L82 120 M110 86 L116 120', '#a77a46', 1.2), chandelier(60, 14, 1.2),
    hold(30, 100, 0.5, {}, { dress: C.purple, top: C.purple }), hold(88, 102, 0.52, {}, { dress: C.sky, top: C.sky }), hold(60, 114, 0.56, {}, { dress: C.red, top: C.red })),
  // dansa: one person dancing alone to music at home (moves)
  'dance.dansa': all(rect(0, 0, 120, 120, '#f6efe4', 0, null), ground(), boombox(22, 102), waBob('dance-dansa-n', 4, mnote(20, 70, 1), dnote(38, 56, 1)),
    waSway('dance-dansa', 8, dz(74, 111, 0.98, pose({ h: [0, -42], n: [-4, -68], aL: [[-16, -74], [-20, -88]], aR: [[14, -58], [24, -66]], lL: [[-8, -20], [-12, -1]], lR: [[8, -24], [8, -4]] }), { top: C.orange, leg: C.navy, hs: 'long', mouth: 'open' }))),
  // danskurs: a teacher shows steps to a row of couples, footprints on the floor
  'dance.danskurs': all(wood(), rect(8, 10, 104, 40, '#d6eaf2', 2, C.ink, 1.4),
    dz(60, 96, 0.62, pose({ ...ARMS_OUT }), { top: HL, leg: C.dark }), ...[[48, 100], [56, 108], [64, 100], [72, 108]].map(([x, y]) => ellipse(x!, y!, 2.4, 4, HL, null)),
    greyed(hold(22, 116, 0.42, {}, {}), hold(98, 116, 0.42, {}, {})), at(98, 26, 0.9, rect(-10, -10, 20, 18, C.white, 2, C.ink, 1.2), line('M-10 -5 L10 -5', C.red, 3), ...range(6).map((i) => circle(-6 + (i % 3) * 6, 0 + Math.floor(i / 3) * 5, 1.2, i === 1 ? HL : C.grey, null)))),
  // danspartner: a man reaches out his hand; the partner (orange ring) is the one he dances with
  'dance.danspartner': all(wood(), heart(60, 30, 0.9, C.rose),
    dz(40, 106, 0.9, pose({ n: [2, -68], aR: [[12, -60], [22, -58]] }), { top: C.navy, leg: C.dark }), dz(78, 106, 0.9, pose({ n: [-2, -68], aL: [[-12, -60], [-18, -58]] }), { top: C.red, dress: C.red, hs: 'long', sleeves: false }), ring(78, 64, 26)),
  // bjuda upp: a man walks up to a woman on a chair, bows and offers his hand (moves in)
  'dance.bjuda-upp': all(wood(), rect(78, 76, 22, 4, C.brown, 1, C.ink, 1.2), line('M80 80 L80 98 M98 80 L98 98 M98 76 L98 56', C.brown, 2.4),
    dz(88, 96, 0.82, pose({ h: [0, -26], n: [0, -52], aL: [[-8, -40], [-14, -34]], aR: [[8, -40], [4, -30]], lL: [[-14, -24], [-14, -1]], lR: [[-10, -26], [-8, -2]] }), { top: C.sky, dress: C.sky, hs: 'long', sleeves: false }),
    waIn('dance-bjuda', -24, 0, dz(48, 106, 0.88, pose({ h: [0, -42], n: [8, -64], aL: [[-2, -52], [-6, -44]], aR: [[18, -58], [28, -56]] }), { top: C.navy, leg: C.dark, tie: true })), mnote(30, 30, 1, C.navy), dnote(60, 22, 1, C.navy)),
  // föra: the leading dancer's hand on the partner's back steers – orange arrow shows the direction
  'dance.föra.4': all(wood(), hold(56, 106, 0.95, { top: HL, leg: C.dark }, { top: C.grey2, dress: C.grey2 }),
    waIn('dance-fora', -14, 0, arrow(36, 30, 96, 30, HL, 3.4)), circle(64, 52, 4, 'none', HL, 2)),
  // vals: a couple turning in three-four time under a chandelier (they circle)
  'dance.vals': all(rect(0, 0, 120, 120, '#f4ead6', 0, null), rect(0, 96, 120, 24, '#c99a63', 0, null), chandelier(60, 12, 1.1), num(16, 34, '3', 14), num(16, 50, '4', 14), line('M10 37 L22 37', C.ink, 1.2),
    waSpin('dance-vals', 4, ellipse(60, 104, 32, 6, 'none', HL, 2), circle(92, 104, 3, HL, null)),
    hold(60, 104, 0.85, {}, { dress: C.sky, top: C.sky })),
  // tango: a dramatic dip, a rose, red and black, an accordion-like bandoneon
  'dance.tango': all(rect(0, 0, 120, 120, '#2a1d22', 0, null), rect(0, 98, 120, 22, '#4a2a2e', 0, null), circle(96, 24, 10, '#f2d07a', null),
    dz(46, 104, 0.95, pose({ h: [0, -42], n: [10, -66], aL: [[18, -76], [28, -78]], aR: [[22, -60], [34, -56]], lL: [[-10, -20], [-18, -1]], lR: [[8, -22], [12, -1]] }), { top: C.black, leg: C.black, tie: true }),
    dz(78, 92, 0.95, pose({ h: [0, -30], n: [-24, -44], aL: [[-34, -50], [-40, -60]], aR: [[-10, -60], [-16, -70]], lL: [[6, -14], [14, -2]], lR: [[10, -44], [22, -60]] }), { top: C.red, dress: C.red, hs: 'bun', sleeves: false }),
    rose(53, 47, 1), accordion(22, 30, 1.1)),
  // bugg: the woman spins under the man's raised hand, jeans and wide skirt, outdoors
  'dance.bugg.2': all(rect(0, 0, 120, 120, '#dff0e4', 0, null), birch(10, 98, 1), birch(112, 96, 1), rect(0, 98, 120, 22, WOOD, 0, null),
    dz(42, 106, 0.92, pose({ aR: [[12, -80], [18, -94]], aL: [[-10, -56], [-14, -46]] }), { top: C.denim, leg: C.denim2 }),
    moving('dance-bugg', '0%,100%{transform:scale(1,1)}50%{transform:scale(-1,1)}', { dur: 1.2, spin: true }, dz(72, 106, 0.92, pose({ aL: [[-8, -82], [-12, -95]], aR: [[12, -56], [16, -46]] }), { top: C.yellow, skirt: C.red, hs: 'long', sleeves: false })),
    path('M60 18 C74 14 82 22 78 32', 'none', HL, 2), arrow(80, 26, 78, 33, HL, 2)),
  // salsa: hips move, ruffled dress, maracas and drums
  'dance.salsa.2': all(rect(0, 0, 120, 120, '#fde6c8', 0, null), rect(0, 98, 120, 22, '#e3a35a', 0, null), maraca(14, 30, -20), maraca(24, 26, 20, C.red), at(104, 84, 0.9, rect(-8, -16, 16, 28, '#c56b2c', 3, C.ink, 1.4), ellipse(0, -16, 8, 3, '#f4efe2', C.ink, 1.2)),
    dz(44, 106, 0.9, pose({ n: [-2, -68], aL: [[-14, -74], [-22, -82]], aR: [[12, -62], [22, -64]], lL: [[-6, -20], [-4, -1]], lR: [[8, -20], [12, -2]] }), { top: C.white, leg: C.black }),
    rotAbout('dance-salsa', 76, 64, 8, 0.8, dz(76, 106, 0.9, pose({ n: [3, -68], aL: [[-10, -62], [-20, -64]], aR: [[12, -76], [18, -88]], lL: [[-4, -20], [-8, -1]], lR: [[6, -20], [4, -1]] }), { top: C.red, dress: C.orange, hs: 'long', sleeves: false }))),
  // trampa på tårna: close-up of feet – a black shoe steps on a red shoe, star of pain
  'dance.trampa-på-tårna': all(rect(0, 0, 120, 120, '#efe5d2', 0, null), rect(0, 80, 120, 40, WOOD, 0, null), line('M0 80 L120 80', C.ink, 1.4),
    rect(70, 20, 12, 62, C.skin, 3, C.ink, 1.6), danceShoe(70, 86, 1.6), rect(30, 4, 14, 60, C.dark, 3, C.ink, 1.6),
    moving('dance-trampa', '0%,40%{transform:translate(0,-18px)}60%,100%{transform:translate(0,0)}', { dur: 2.2 }, menShoe(54, 76, 1.6)),
    waPulse('dance-trampa-s', star(96, 56, 9, C.yellow), line('M104 70 L112 74 M100 44 L106 36', C.red, 2.4))),
  // dansbana: an outdoor wooden dance floor with a roof by a lake in summer
  'dance.dansbana': all(rect(0, 0, 120, 120, '#cfe9f5', 0, null), rect(0, 70, 120, 50, '#8cc06a', 0, null), path('M70 70 L120 70 L120 86 Q96 80 70 86 Z', '#5a9fd0', null),
    tree(10, 70, 1), tree(110, 66, 0.8), path('M16 52 L60 30 L104 52 Z', '#b94a3a', C.ink, 1.6), line('M24 52 L24 92 M96 52 L96 92', C.ink, 2), rect(14, 90, 92, 8, WOOD, 1, C.ink, 1.6),
    hold(46, 90, 0.38, {}, { dress: C.yellow, top: C.yellow }), hold(74, 90, 0.38, {}, { dress: C.pink, top: C.pink }), frame(10, 26, 100, 76)),
  // danssko: a pair of dance shoes (women's with heel and strap, men's shiny)
  'dance.danssko': all(rect(0, 0, 120, 120, '#f4efe6', 0, null), ground(96), danceShoe(42, 80, 2), menShoe(82, 86, 1.8), ring(60, 76, 44)),

  // ── 4464 Streetdance ───────────────────────────────────────────────
  // streetdance: a group dancing on the street, graffiti wall, loudspeaker box
  'dance.streetdance': all(rect(0, 0, 120, 120, '#b8b0a4', 0, null), rect(0, 12, 120, 70, '#8f8a84', 0, null), ...range(6).map((i) => line(`M0 ${22 + i * 12} L120 ${22 + i * 12}`, '#7d7871', 1)),
    path('M10 40 C20 22 40 30 34 48 C30 60 50 62 56 48', 'none', C.purple, 5), path('M66 30 C80 20 96 40 108 30', 'none', C.green, 5), rect(0, 82, 120, 38, '#6e6e6e', 0, null), boombox(102, 100, 0.9),
    dz(26, 112, 0.66, pose({ h: [0, -38], n: [-6, -62], aL: [[-16, -70], [-22, -82]], aR: [[12, -56], [20, -66]], lL: [[-10, -20], [-16, -1]], lR: [[10, -22], [14, -4]] }), { top: C.yellow, leg: C.denim, hs: 'cap' }),
    dz(56, 112, 0.7, pose({ h: [0, -36], n: [4, -60], aL: [[-12, -56], [-20, -48]], aR: [[16, -62], [26, -56]], lL: [[-12, -18], [-12, -1]], lR: [[12, -18], [12, -1]] }), { top: C.red, leg: C.dark }),
    dz(82, 112, 0.66, pose({ h: [0, -40], n: [0, -66], aL: [[-14, -60], [-14, -74]], aR: [[14, -60], [14, -74]], lL: [[-8, -20], [-6, -1]], lR: [[8, -20], [6, -1]] }), { top: C.green, leg: C.black, hs: 'long' })),
  // breakdance: a dancer spinning on one hand on the floor, legs in the air (spins)
  'dance.breakdance': all(rect(0, 0, 120, 120, '#d8d2c8', 0, null), rect(0, 96, 120, 24, '#7d7d7d', 0, null), ellipse(60, 100, 26, 5, 'none', HL, 2), boombox(18, 90, 0.8),
    waSpin('dance-break', 1.6, g('translate(60 64)', dz(0, 34, 0.86, pose({ h: [0, -46], n: [0, -20], aL: [[-8, -10], [-6, -1]], aR: [[10, -12], [18, -16]], lL: [[-16, -60], [-30, -70]], lR: [[16, -62], [26, -78]] }), { top: C.orange, leg: C.dark, hs: 'cap' })))),
  // dansstil: three silhouettes of different styles side by side, each with its own colour and music sign
  'dance.dansstil': all(rect(0, 0, 120, 120, '#f2efe8', 0, null), ground(),
    ...[[22, C.pink, ARABESQUE, { tutu: C.pink, hs: 'bun' as const, sleeves: false }], [60, C.yellow, pose({ h: [0, -38], n: [-6, -62], aL: [[-16, -70], [-22, -82]], aR: [[12, -56], [20, -66]], lL: [[-10, -20], [-16, -1]], lR: [[10, -22], [14, -4]] }), { hs: 'cap' as const, leg: C.denim }], [98, C.red, pose({ n: [3, -68], aL: [[-10, -62], [-20, -64]], aR: [[12, -76], [18, -88]] }), { dress: C.red, hs: 'long' as const, sleeves: false }]].map(([x, c, p, o]) =>
      all(rect((x as number) - 17, 22, 34, 90, '#ffffff', 4, C.grey2, 1.4), dz(x as number, 110, 0.72, p as Pose, { top: c as string, ...(o as Look) }))),
    frame(4, 18, 112, 98)),
  // gatukultur: graffiti wall, a rapper with mic, skateboard, dancer – the whole street culture
  'dance.gatukultur': all(rect(0, 0, 120, 120, '#9a948c', 0, null), rect(0, 86, 120, 34, '#6e6e6e', 0, null),
    path('M8 30 C16 12 36 18 32 36 C28 50 46 52 52 38', 'none', C.orange, 6), path('M62 22 L74 44 L84 20 L96 44 L108 22', 'none', C.green, 5), circle(90, 60, 10, 'none', C.purple, 4),
    dz(26, 112, 0.6, pose({ aR: [[10, -60], [6, -72]] }), { top: C.purple, leg: C.dark, hs: 'cap', front: g('translate(6 -72)', rect(-2, -6, 4, 7, C.dark, 1, C.ink, 0.8)) }),
    dz(62, 112, 0.62, pose({ h: [0, -38], n: [-6, -62], aL: [[-16, -70], [-22, -82]], aR: [[12, -56], [20, -66]], lL: [[-10, -20], [-16, -1]], lR: [[10, -22], [14, -4]] }), { top: C.yellow, leg: C.denim }),
    rect(84, 104, 28, 4, C.red, 2, C.ink, 1.2), circle(89, 110, 2.4, C.dark, null), circle(107, 110, 2.4, C.dark, null), frame(4, 6, 112, 110)),
  // battle: two dancers face each other inside a ring of watchers, one dances, the other waits with crossed arms
  'dance.battle': all(rect(0, 0, 120, 120, '#e4dfd6', 0, null), crowdRow(18, 7), ellipse(60, 92, 44, 12, '#cfc7ba', C.grey, 1.2),
    dz(36, 104, 0.8, pose({ h: [0, -36], n: [6, -60], aL: [[-8, -66], [-14, -78]], aR: [[18, -60], [30, -58]], lL: [[-12, -18], [-14, -1]], lR: [[10, -18], [14, -1]] }), { top: C.red, leg: C.dark, hs: 'cap' }),
    dz(86, 104, 0.8, pose({ aL: [[-8, -56], [6, -54]], aR: [[8, -56], [-6, -54]] }), { top: C.denim, leg: C.black, mouth: 'flat' }),
    waShake('dance-battle', path('M52 50 L58 44 L58 56 Z', HL, C.ink, 1), path('M68 50 L62 44 L62 56 Z', HL, C.ink, 1))),
  // ring (of people): people holding hands in a circle, seen from above
  'dance.ring.4': all(rect(0, 0, 120, 120, '#d9efd2', 0, null), circle(60, 60, 34, 'none', HL, 2.4, ),
    ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; const x = f1(60 + Math.cos(a) * 34), y = f1(60 + Math.sin(a) * 34); return all(circle(x, y, 9, [C.red, C.yellow, C.sky, C.green][i % 4]!, C.ink, 1.2), circle(x, y, 5, C.skin, C.ink, 1), path(`M${f1(x - 4)} ${f1(y - 2)} C${f1(x - 4)} ${f1(y - 6)} ${f1(x + 4)} ${f1(y - 6)} ${f1(x + 4)} ${f1(y - 2)}`, C.hair, null)); })),
  // domare (in a contest): three judges at a table hold up score cards
  'dance.domare.2': all(rect(0, 0, 120, 120, '#ede8df', 0, null), ...[24, 60, 96].map((x, i) => all(
    dz(x, 96, 0.6, pose({ aR: [[10, -70], [10, -84]] }), { top: [C.navy, C.dark, C.navy][i]!, leg: C.dark, mouth: 'flat' }), scoreCard(x + 6, 40 - (i === 1 ? 0 : 0), ['8', '9', '7'][i]!, i === 1 ? '#fde3c8' : C.white))),
    rect(4, 82, 112, 30, C.brown, 2, C.ink, 1.8), ring(60, 66, 26)),
  // tävling: a podium with three places, winner with trophy
  'dance.tävling': all(rect(0, 0, 120, 120, '#e9f1f7', 0, null), ground(), rect(44, 74, 32, 38, C.gold, 2, C.ink, 1.6), rect(12, 86, 32, 26, C.silver, 2, C.ink, 1.6), rect(76, 94, 32, 18, '#cd8f5a', 2, C.ink, 1.6),
    num(60, 98, '1', 16), num(28, 104, '2', 14), num(92, 108, '3', 12),
    dz(60, 74, 0.5, pose({ ...ARMS_UP }), { top: C.red, leg: C.dark }), trophy(60, 18, 1.1), greyed(dz(28, 86, 0.46, STAND, { top: C.green }), dz(92, 94, 0.44, STAND, { top: C.sky })), sparkle(40, 24, 4), sparkle(82, 20, 4)),
  // respekt: after the battle the two dancers shake hands and bow their heads; the others clap
  'dance.respekt': all(rect(0, 0, 120, 120, '#ece7de', 0, null), crowdRow(18, 6),
    dz(44, 108, 0.86, pose({ n: [4, -66], aR: [[12, -54], [18, -52]] }), { top: C.red, leg: C.dark, hs: 'cap' }),
    dz(76, 108, 0.86, pose({ n: [-4, -66], aL: [[-12, -54], [-18, -52]] }), { top: C.denim, leg: C.black }), ring(60, 60, 9), heart(60, 36, 0.7, HL)),
  // uppvisning: children dance on a small stage for parents who film with phones
  'dance.uppvisning': all(rect(0, 0, 120, 120, '#f2ece2', 0, null), rect(10, 20, 100, 50, '#f9f6ef', 2, C.ink, 1.4), rect(10, 64, 100, 8, C.brown, 1, C.ink, 1.4),
    ...[34, 60, 86].map((x) => dz(x, 64, 0.42, pose({ ...ARMS_UP }), { top: C.pink, leg: C.pink })), crowdRow(98, 6, 10, 110),
    ...[28, 76].map((x) => g(`translate(${x} 84)`, rect(-4, -7, 8, 13, C.dark, 1.5, C.ink, 1), rect(-3, -5, 6, 8, '#bfe3f5', 0.6, null))), frame(8, 18, 104, 56)),

  // ── 4465 Dansens rörelseord ────────────────────────────────────────
  // hoppa: the figure leaves the floor (moves up and down), arrow up
  'dance.hoppa': all(rect(0, 0, 120, 120, '#eef3ea', 0, null), ground(), ellipse(60, 112, 14, 3, C.grey2, null),
    moving('dance-hoppa', '0%,100%{transform:translate(0,22px)}45%,55%{transform:translate(0,0)}', { dur: 1.4 }, dz(60, 88, 0.9, pose({ aL: [[-12, -80], [-20, -92]], aR: [[12, -80], [20, -92]], lL: [[-8, -24], [-4, -8]], lR: [[8, -24], [4, -8]] }), { top: C.green, leg: C.navy })),
    arrow(98, 92, 98, 52, HL, 3)),
  // landa: coming down onto the floor, knees bent, dust puffs (moves down)
  'dance.landa.2': all(rect(0, 0, 120, 120, '#eef3ea', 0, null), ground(),
    moving('dance-landa', '0%{transform:translate(0,-34px)}50%,100%{transform:translate(0,0)}', { dur: 1.8 }, dz(60, 112, 0.9, PLIE, { top: C.green, leg: C.navy, ...{} })),
    arrow(98, 50, 98, 92, HL, 3), waGrow('dance-landa-d', circle(42, 110, 4, '#d8d0c0', null), circle(78, 110, 4, '#d8d0c0', null), circle(36, 106, 3, '#d8d0c0', null), circle(84, 106, 3, '#d8d0c0', null))),
  // böja: bending the knees and the back (moves)
  'dance.böja': all(rect(0, 0, 120, 120, '#f4efe6', 0, null), ground(), greyed(dz(28, 111, 0.82, STAND, {})),
    rotAbout('dance-boja', 76, 72, -14, 2.4, dz(76, 111, 0.9, pose({ h: [0, -34], n: [14, -56], aL: [[20, -44], [24, -34]], aR: [[22, -46], [28, -36]], lL: [[-10, -18], [-4, -1]], lR: [[-8, -18], [2, -1]] }), { top: C.orange, leg: C.navy })),
    path('M96 40 C106 52 106 66 98 76', 'none', HL, 2.4), arrow(100, 70, 97, 77, HL, 2.4)),
  // svänga (fram och tillbaka): arms swing back and forth (moves)
  'dance.svänga.3': all(rect(0, 0, 120, 120, '#f4efe6', 0, null), ground(),
    dz(60, 111, 1.0, pose({ aL: [[-4, -54], [-2, -40]], aR: [[4, -54], [2, -40]] }), { top: C.purple, leg: C.navy, noArm: 'both', front: all(
      rotAbout('dance-svanga-l', -6, -64, 50, 1.6, line('M-6 -64 L-12 -50 L-16 -36', C.ink, 6.8), line('M-6 -64 L-12 -50 L-16 -36', C.purple, 4.4), circle(-16, -36, 2.8, C.skin, C.ink, 1)),
      rotAbout('dance-svanga-r', 6, -64, -50, 1.6, line('M6 -64 L12 -50 L16 -36', C.ink, 6.8), line('M6 -64 L12 -50 L16 -36', C.purple, 4.4), circle(16, -36, 2.8, C.skin, C.ink, 1))) }),
    path('M22 70 C30 92 42 98 50 96', 'none', HL, 2.2), path('M98 70 C90 92 78 98 70 96', 'none', HL, 2.2)),
  // svepa (röra i en båge): a dancer sweeps the arm in a big arc over the floor (moves)
  'dance.svepa.2': all(rect(0, 0, 120, 120, '#efe9f3', 0, null), ground(), line('M18 106 C14 60 60 24 104 40', HL, 2.6, '5 4'),
    dz(56, 111, 0.98, pose({ h: [0, -34], n: [6, -58], aL: [[-8, -56], [-16, -50]], lL: [[-12, -16], [-18, -1]], lR: [[10, -18], [14, -1]] }), { top: C.lilac, leg: C.purple, shoe: C.skin, noArm: 'R', front:
      rotAbout('dance-svepa', 6, -58, -70, 2.2, line('M6 -58 L24 -66 L40 -72', C.ink, 6.8), line('M6 -58 L24 -66 L40 -72', C.lilac, 4.4), circle(40, -72, 2.8, C.skin, C.ink, 1)) })),
  // falla: the figure tips over towards the floor (moves), stars
  'dance.falla': all(rect(0, 0, 120, 120, '#f1ece4', 0, null), ground(),
    moving('dance-falla', '0%,20%{transform:translate(40px,111px) rotate(-40deg) translate(-40px,-111px)}80%,100%{transform:rotate(0)}', { dur: 2.4 }, g('rotate(40 40 111)', dz(40, 111, 0.92, pose({ aL: [[-12, -76], [-18, -88]], aR: [[12, -76], [18, -88]] }), { top: C.red, leg: C.navy, mouth: 'o' }))),
    arrow(30, 30, 66, 54, HL, 3)),

  // ── 4466 Musikalens delar ──────────────────────────────────────────
  // musikal: a big stage show – singers and dancers in costumes, an orchestra pit, notes
  'dance.musikal': all(stage(), spot(36, 40), spot(84, 40), rect(0, 104, 120, 16, '#1c1a28', 0, null),
    dz(36, 92, 0.6, pose({ aL: [[-10, -70], [-14, -82]], aR: [[10, -62], [20, -66]] }), { top: C.yellow, dress: C.yellow, hs: 'long', sleeves: false, mouth: 'open' }),
    dz(60, 92, 0.6, LEAP, { top: C.red, leg: C.red }), dz(84, 92, 0.6, pose({ aR: [[12, -70], [18, -82]], aL: [[-10, -62], [-20, -66]] }), { top: C.green, leg: C.dark, mouth: 'open' }),
    mnote(26, 30, 1, C.white), dnote(92, 24, 1, C.white), ...[20, 40, 60, 80, 100].map((x) => circle(x, 112, 4, '#2d2a3e', null)), line('M30 110 L40 104 M70 110 L80 104', C.gold, 1.6)),
  // musikalartist: one performer singing and dancing at the same time with a headset microphone
  'dance.musikalartist': all(stage(), spot(60, 56), audience(6, 122),
    dz(60, 100, 0.95, pose({ h: [0, -40], n: [-2, -66], aL: [[-14, -76], [-20, -88]], aR: [[14, -56], [24, -50]], lL: [[-4, -20], [-6, -1]], lR: [[8, -24], [18, -14]] }), { top: C.purple, leg: C.dark, hs: 'long', mouth: 'open', front: headset(-2, -76, 0.9) }),
    mnote(90, 30, 1, C.white), dnote(28, 26, 1, C.white), ring(58, 30, 14)),
  // nummer (in a show): a programme with a list of items; one item is lit on stage and in the list
  'dance.nummer.4': all(rect(0, 0, 120, 120, '#f2ece2', 0, null), rect(8, 14, 44, 92, C.white, 3, C.ink, 1.6),
    ...range(5).map((i) => all(num(16, 32 + i * 16, String(i + 1), 9, i === 2 ? HL : C.grey), line(`M24 ${29 + i * 16} L46 ${29 + i * 16}`, i === 2 ? HL : C.grey2, 3))), frame(10, 50, 40, 14),
    rect(60, 20, 54, 70, STAGE, 3, C.ink, 1.4), path('M78 20 L96 20 L108 82 L66 82 Z', 'rgba(255,240,180,0.33)', null), dz(87, 82, 0.5, pose({ ...ARMS_UP }), { top: HL, leg: HL, mouth: 'open' }), num(102, 36, '3', 10, C.white), mnote(70, 36, 0.7, C.white)),
  // duett: two singers on stage singing to each other, two coloured note lines that meet
  'dance.duett': all(stage(), spot(40, 40), spot(80, 40),
    dz(38, 100, 0.8, pose({ n: [2, -68], aR: [[10, -64], [14, -72]], aL: [[-10, -60], [-16, -54]] }), { top: C.navy, leg: C.dark, mouth: 'open' }),
    dz(82, 100, 0.8, pose({ n: [-2, -68], aL: [[-10, -64], [-14, -72]], aR: [[10, -60], [16, -54]] }), { top: C.red, dress: C.red, hs: 'long', sleeves: false, mouth: 'open' }),
    path('M44 30 C52 20 60 26 60 34', 'none', C.sky, 2.4), path('M76 30 C68 20 60 26 60 34', 'none', C.pink, 2.4), mnote(46, 22, 0.8, C.sky), mnote(74, 22, 0.8, C.pink), heart(60, 40, 0.6, HL)),
  // ouvertyr: dark hall, closed curtain, the orchestra plays in front of it before the show (notes rise)
  'dance.ouvertyr': all(rect(0, 0, 120, 120, STAGE, 0, null), path('M0 0 L120 0 L120 80 L0 80 Z', CURTAIN, null), ...range(7).map((i) => line(`M${10 + i * 17} 0 C${6 + i * 17} 30 ${14 + i * 17} 50 ${10 + i * 17} 80`, '#6e2230', 2)), rect(0, 80, 120, 40, '#1c1a28', 0, null),
    ...[20, 44, 76, 100].map((x, i) => all(circle(x, 96, 5, C.skin, C.ink, 1), rect(x - 6, 101, 12, 10, C.dark, 3, null), i === 1 ? line(`M${x + 4} 96 L${x + 16} 88`, '#a0673d', 2) : '')), dz(60, 112, 0.36, pose({ ...ARMS_UP }), { top: C.black, leg: C.black }),
    waIn('dance-ouv', 0, 20, mnote(30, 56, 1, C.gold), dnote(60, 48, 1, C.gold), mnote(90, 58, 1, C.gold)), frame(4, 4, 112, 76, C.gold)),
  // libretto: an open thick book with dialogue lines and lines of notes
  'dance.libretto': all(rect(0, 0, 120, 120, '#efe8dc', 0, null), book(60, 62, 1.7),
    ...range(4).map((i) => line(`M${20} ${42 + i * 12} L${52} ${44 + i * 12}`, C.grey, 2)), ...range(2).map((i) => all(line(`M68 ${42 + i * 22} L100 ${40 + i * 22} M68 ${46 + i * 22} L100 ${44 + i * 22} M68 ${50 + i * 22} L100 ${48 + i * 22}`, C.grey2, 1), mnote(76, 46 + i * 22, 0.55, C.ink), mnote(90, 44 + i * 22, 0.55, C.ink))),
    rect(14, 12, 10, 10, C.white, 2, C.ink, 1.2), line('M16 16 L22 16 M16 19 L20 19', C.grey, 1), ring(60, 62, 52)),
  // stepp: tap shoes with metal plates make rhythm sounds on the floor (foot taps)
  'dance.stepp': all(stage(), spot(60, 70), dz(60, 100, 1.0, pose({ aL: [[-12, -60], [-22, -54]], aR: [[12, -60], [22, -54]], lL: [[-6, -20], [-10, -1]], lR: [[8, -22], [16, -12]] }), { top: C.black, leg: C.black, tie: true, shoe: C.black }),
    rect(10, 104, 12, 3, C.silver, 1, C.ink, 0.8), moving('dance-stepp', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-6px)}', { dur: 0.5 }, circle(76, 89, 4, C.silver, C.ink, 1)),
    waPulse('dance-stepp-s', line('M84 96 L92 92 M86 102 L96 102 M44 96 L36 92', C.gold, 2.4)), dnote(94, 60, 0.9, C.white)),
  // mikroport: close-up of a face with a thin headset microphone at the cheek (object ringed)
  'dance.mikroport': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), circle(54, 60, 34, C.skin, C.ink, 2), path('M20 54 C18 16 92 16 88 54 C80 34 30 34 20 54 Z', C.hair, C.ink, 1.6),
    circle(42, 60, 3, C.ink, null), circle(66, 60, 3, C.ink, null), ellipse(54, 78, 6, 5, '#c84a4a', C.ink, 1.2),
    path('M86 52 C92 60 90 72 80 80 L66 84', 'none', C.dark, 2.2), circle(66, 84, 3.4, HL, C.ink, 1.2), ring(70, 80, 12)),
  // spektakulär: a stage with fireworks, a big turning set, many lights – everything bursts out
  'dance.spektakulär': all(stage(), ...[16, 40, 80, 104].map((x) => path(`M${x} 0 L${x - 10} 92 L${x + 10} 92 Z`, 'rgba(255,240,180,0.25)', null)),
    waGrow('dance-spekt', ...[[30, 26, C.yellow], [60, 16, HL], [92, 28, C.pink]].map(([x, y, c]) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${x} ${y} L${f1((x as number) + Math.cos(a) * 12)} ${f1((y as number) + Math.sin(a) * 12)}`, c as string, 2.4); })))),
    ...[30, 50, 70, 90].map((x, i) => dz(x, 92, 0.42, i % 2 ? LEAP : pose({ ...ARMS_UP }), { top: C.gold, leg: C.gold })), audience(7, 122)),
  // medley: several different songs (different note colours) joined into one ribbon
  'dance.medley': all(rect(0, 0, 120, 120, '#f2ece2', 0, null), ...[[10, C.red], [42, C.green], [74, C.purple]].map(([x, c]) => all(rect(x as number, 20, 30, 30, '#ffffff', 3, c as string, 2), mnote((x as number) + 10, 38, 0.9, c as string), dnote((x as number) + 18, 34, 0.7, c as string))),
    arrow(25, 54, 40, 76, C.grey, 2), arrow(57, 54, 58, 76, C.grey, 2), arrow(89, 54, 76, 76, C.grey, 2),
    path('M8 86 L40 86 L40 104 L8 104 Z', '#fde3c8', C.red, 1.6), path('M40 86 L76 86 L76 104 L40 104 Z', '#e0f2e4', C.green, 1.6), path('M76 86 L112 86 L112 104 L76 104 Z', '#ece2f6', C.purple, 1.6),
    mnote(22, 98, 0.7, C.red), mnote(58, 98, 0.7, C.green), mnote(94, 98, 0.7, C.purple), frame(4, 82, 112, 26)),

  // ── 4467 Koreografi och scenuttryck ────────────────────────────────
  // koreografi: a sheet with a floor plan – numbered dancer dots and arrows for the order of movements
  'dance.koreografi': all(rect(0, 0, 120, 120, '#eef0f2', 0, null), rect(14, 10, 92, 100, C.white, 3, C.ink, 1.6), rect(22, 20, 76, 60, '#f7f3ea', 2, C.grey, 1.2),
    ...[[36, 34, '1'], [60, 34, '2'], [84, 34, '3'], [48, 62, '4'], [72, 62, '5']].map(([x, y, n]) => all(circle(x as number, y as number, 6, '#fde3c8', HL, 1.6), num(x as number, (y as number) + 3, n as string, 8))),
    arrow(36, 42, 44, 56, HL, 2), arrow(84, 42, 76, 56, HL, 2), path('M60 42 C56 50 64 52 60 58', 'none', HL, 2),
    ...range(3).map((i) => line(`M24 ${88 + i * 7} L${92 - i * 14} ${88 + i * 7}`, C.grey2, 2.4))),
  // koreograf: a person in front of dancers counts and shows the movement; dancers copy
  'dance.koreograf': all(studio(true, false), greyed(...[24, 50].map((x) => dz(x, 110, 0.6, pose({ ...ARMS_OUT }), { top: C.grey }))),
    dz(88, 110, 0.86, pose({ n: [-2, -68], aL: [[-14, -66], [-26, -64]], aR: [[10, -78], [10, -92]] }), { top: HL, leg: C.dark, mouth: 'open' }),
    rect(100, 70, 14, 18, C.white, 2, C.ink, 1.2), line('M103 75 L111 75 M103 79 L111 79 M103 83 L109 83', C.grey, 1), ring(88, 50, 14)),
  // steg (in dance): footprints of one step pattern on the floor, numbered, with the feet stepping
  'dance.steg.2': all(rect(0, 0, 120, 120, '#efe5d2', 0, null), rect(0, 60, 120, 60, WOOD, 0, null), line('M0 60 L120 60', C.ink, 1.4),
    ...[[30, 96, -10, '1'], [52, 80, 8, '2'], [74, 96, -6, '3']].map(([x, y, r, n]) => all(g(`translate(${x} ${y}) rotate(${r})`, ellipse(0, 0, 6, 11, '#fde3c8', HL, 1.8)), num(x as number, (y as number) + 22, n as string, 9, HL))),
    arrow(36, 88, 46, 82, HL, 2), arrow(58, 84, 68, 90, HL, 2), rect(26, 6, 10, 54, C.navy, 3, C.ink, 1.4),
    moving('dance-steg', '0%,30%{transform:translate(0,0)}50%,80%{transform:translate(22px,-16px)}100%{transform:translate(0,0)}', { dur: 2.6 }, rect(36, 6, 10, 54, C.navy, 3, C.ink, 1.4), ellipse(41, 60, 7, 4, C.black, null))),
  // i synk: four dancers in exactly the same pose at the same time, with one grey dancer out of step
  'dance.i-synk': all(studio(true, false), ...[16, 40, 64, 88].map((x, i) => moving(`dance-synk-${i}`, '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-6px)}', { dur: 1.2 },
    dz(x + 8, 110, 0.6, pose({ aL: [[-12, -76], [-18, -88]], aR: [[12, -58], [22, -52]], lL: [[-4, -21], [-5, -1]], lR: [[8, -22], [16, -12]] }), { top: HL, leg: C.dark }))),
    line('M10 44 L114 44', HL, 1.4, '3 3')),
  // formation (in dance): seen from above, dancers stand as a V; arrows show they change from a line
  'dance.formation.2': all(rect(0, 0, 120, 120, '#efe5d2', 0, null), rect(8, 8, 104, 104, '#d9b98c', 4, C.ink, 1.6),
    ...[[24, 30], [42, 48], [60, 66], [78, 48], [96, 30]].map(([x, y]) => all(circle(x!, y!, 7, HL, C.ink, 1.2), circle(x!, y!, 3.4, C.hair, null))),
    greyed(...[24, 42, 60, 78, 96].map((x) => circle(x, 96, 6, C.grey, C.ink, 1))), ...[42, 60, 78].map((x, i) => line(`M${x} 90 L${x} ${[56, 74, 56][i]}`, C.grey, 1.2, '3 3'))),
  // lyft (in dance): one dancer lifts the other high in the air (moves up)
  'dance.lyft.3': all(stage(), spot(60, 70),
    dz(60, 100, 0.85, pose({ aL: [[-8, -82], [-6, -94]], aR: [[8, -82], [6, -94]], lL: [[-8, -21], [-10, -1]], lR: [[8, -21], [10, -1]] }), { top: C.navy, leg: C.navy }),
    moving('dance-lyft', '0%,100%{transform:translate(0,20px)}50%{transform:translate(0,0)}', { dur: 2.4 }, g('translate(60 36) rotate(-80)', dz(0, 24, 0.75, pose({ ...ARMS_OUT, lR: [[-10, -26], [-24, -30]] }), { top: C.white, leg: C.rose, tutu: C.white, hs: 'bun', sleeves: false }))),
    arrow(98, 60, 98, 30, HL, 2.6)),
  // musikalitet: the dancer's arm follows the curve of the music line exactly (big where the music is loud)
  'dance.musikalitet': all(rect(0, 0, 120, 120, '#f2eff7', 0, null), ground(),
    path('M6 40 C20 40 26 20 40 22 C54 24 56 46 70 44 C86 42 92 10 114 12', 'none', C.navy, 3), ...[[14, 34], [40, 16], [70, 38], [104, 8]].map(([x, y]) => mnote(x!, y!, 0.6, C.navy)),
    rotAbout('dance-musik', 60, 70, 10, 2.4, dz(60, 111, 0.82, pose({ aL: [[-14, -76], [-26, -84]], aR: [[16, -76], [30, -90]], lR: [[10, -24], [14, -4]] }), { top: C.purple, leg: C.purple, hs: 'long', shoe: C.skin })),
    line('M30 46 C40 30 50 46 60 50', HL, 2.2, '3 3'), ear(18, 70)),
  // scennärvaro: on a stage with several dancers, everyone looks at the one who stands still in the light
  'dance.scennärvaro': all(stage(), spot(60, 44), greyed(...[24, 96].map((x) => dz(x, 100, 0.6, pose({ ...ARMS_OUT }), { grey: true }))),
    dz(60, 100, 0.86, pose({ h: [0, -42], n: [0, -70], aL: [[-10, -56], [-12, -44]], aR: [[14, -78], [20, -92]] }), { top: C.red, leg: C.dark, hs: 'long', mouth: 'flat' }),
    audience(7, 122), ...[18, 42, 78, 102].map((x) => line(`M${x} 108 L${f1(x + (60 - x) * 0.2)} 100`, HL, 1.4, '2 2')), waPulse('dance-narvaro', ring(60, 66, 30))),
};

/** Small ear sign (listening). */
function ear(x: number, y: number) {
  return at(x, y, 0.6, path('M-6 -16 C8 -20 16 -8 12 2 C10 8 4 8 4 14 C4 20 -4 22 -8 16', C.skin, C.ink, 2), path('M-2 -8 C6 -10 8 -2 4 2 C2 4 0 2 0 6', 'none', C.ink, 1.6));
}
