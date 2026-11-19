/**
 * Matematik & naturvetenskap → Fysik → Mekanik, 3311–3317 (0.50): distance and displacement, speed and
 * acceleration, force and mass, Newton's laws of motion, work and energy, momentum and impulse, rotation
 * and torque.
 * Recurring signs: the part that the word names is orange (arrow, bracket, ring, segment or object) and a
 * grey reference shows what the word is not. Words in a contrast pair or trio share one layout where only
 * the marked part differs: rörelse/i vila (two frames with a clock), konstant hastighet/acceleration/
 * retardation (equal, growing or shrinking gaps between positions second by second), lägesenergi/
 * rörelseenergi (ball at the top or at the bottom of a hill), elastisk/oelastisk stöt (before and after a
 * collision) and centripetalkraft/centrifugalkraft (ball on a string seen from above, arrow in or out).
 * Digits, maths signs and the variable names m, v, F, t and p only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, star, waBob, waIn, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { clock } from './time';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#5b9bd5';
const ICE = '#dff1fb';
const SOFT = 'rgba(228,87,46,0.16)';
const ASPH = '#9aa3ad';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const dot = (x: number, y: number, col: string = C.ink, r = 3.4) => circle(x, y, r, col, C.ink, 1);
const ball = (x: number, y: number, r: number, col: string = C.red) => all(circle(x, y, r, col, C.ink, 1.6), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.28), 'rgba(255,255,255,0.7)', null));
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
/** Horizontal bracket from x1 to x2 at height y with end ticks. */
const hbr = (x1: number, x2: number, y: number, col: string = HL, sw = 2.4) => all(line(`M${x1} ${y} L${x2} ${y}`, col, sw), line(`M${x1} ${y - 5} L${x1} ${y + 5} M${x2} ${y - 5} L${x2} ${y + 5}`, col, sw));
const vbr = (x: number, y1: number, y2: number, col: string = HL, sw = 2.4) => all(line(`M${x} ${y1} L${x} ${y2}`, col, sw), line(`M${x - 5} ${y1} L${x + 5} ${y1} M${x - 5} ${y2} L${x + 5} ${y2}`, col, sw));
/** Speed lines behind something moving to the right, ending at x. */
const speed = (x: number, y: number, col: string = C.grey, n = 3, len = 14) => line(range(n).map((i) => `M${x - len - i * 3} ${y - (n - 1) * 3 + i * 6} L${x - i * 3} ${y - (n - 1) * 3 + i * 6}`).join(' '), col, 2);
/** Curved arrow (arc) around (cx, cy) from angle a1 to a2 (degrees, 0 = right, counter-clockwise positive in maths). */
const arc = (cx: number, cy: number, r: number, a1: number, a2: number, col: string = HL, sw = 2.6) => {
  const p = (a: number) => [f1(cx + Math.cos(rad(a)) * r), f1(cy - Math.sin(rad(a)) * r)] as const;
  const [x1, y1] = p(a1), [x2, y2] = p(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
  const t = a2 + (a2 > a1 ? -14 : 14), [tx, ty] = p(t);
  const ang = Math.atan2(y2 - ty, x2 - tx), h = 6 + sw;
  return all(path(`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`, 'none', col, sw),
    path(`M${x2} ${y2} L${f1(x2 - h * Math.cos(ang - 0.5))} ${f1(y2 - h * Math.sin(ang - 0.5))} L${f1(x2 - h * Math.cos(ang + 0.5))} ${f1(y2 - h * Math.sin(ang + 0.5))} Z`, col, null));
};

// ── People ───────────────────────────────────────────────────────────
type Pose = { lean?: number; a1?: number; a2?: number; l1?: number; l2?: number; k1?: number; k2?: number; top?: string; bot?: string; long?: boolean; s?: number };
const seg = (x1: number, y1: number, ang: number, len: number) => [f1(x1 + Math.sin(rad(ang)) * len), f1(y1 + Math.cos(rad(ang)) * len)] as const;
const limb = (pts: (readonly [number, number])[], col: string, w: number) => {
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return all(line(d, C.ink, w + 2.2), line(d, col, w));
};
/**
 * Side-view person, feet near (x, y). Angles in degrees: 0 = straight down, 90 = forward (right), 180 = up.
 * a1/a2 arms (far/near), l1/l2 thighs, k1/k2 extra bend at the knee/elbow (added to the limb angle).
 */
const pal = (x: number, y: number, p: Pose = {}) => {
  const lean = p.lean ?? 0, top = p.top ?? C.sky, bot = p.bot ?? C.navy;
  const hip = [0, -30] as const, sh = seg(0, -30, 180 - lean, 26), head = seg(sh[0], sh[1], 180 - lean, 11);
  const leg = (a: number, k: number) => { const kn = seg(hip[0], hip[1], a, 15); return [hip, kn, seg(kn[0], kn[1], a + k, 15)]; };
  const armP = (a: number, k: number) => { const el = seg(sh[0], sh[1], a, 11); return [sh, el, seg(el[0], el[1], a + k, 11)]; };
  const arm1 = armP(p.a1 ?? -10, p.k1 ?? 0), arm2 = armP(p.a2 ?? 10, p.k2 ?? 0);
  const [hx, hy] = head;
  return g(`translate(${x} ${y}) scale(${p.s ?? 1})`,
    limb(arm1 as (readonly [number, number])[], C.skin, 4), limb(leg(p.l1 ?? -8, 0) as (readonly [number, number])[], bot, 6),
    limb(leg(p.l2 ?? 8, 0) as (readonly [number, number])[], bot, 6),
    limb([hip, sh], top, 10),
    p.long ? path(`M${hx - 8} ${hy - 1} C${hx - 10} ${hy + 10} ${hx - 2} ${hy + 10} ${hx} ${hy + 6} Z`, C.hair, null) : '',
    circle(hx, hy, 7, C.skin, C.ink, 1.6), path(`M${hx - 7} ${hy - 1} C${hx - 7} ${hy - 10} ${hx + 7} ${hy - 10} ${hx + 7} ${hy - 1} C${hx + 3} ${hy - 5} ${hx - 3} ${hy - 5} ${hx - 7} ${hy - 1} Z`, C.hair, null),
    circle(f1(hx + 3.4), f1(hy - 0.6), 1, C.ink, null),
    limb(arm2 as (readonly [number, number])[], C.skin, 4));
};

// ── Vehicles and things ──────────────────────────────────────────────
const car = (x: number, y: number, col: string = C.red, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-22 -6 L-20 -13 L-11 -15 L-5 -23 L10 -23 L16 -15 L22 -13 L23 -6 Z', col, C.ink, 1.5), path('M-3 -21 L1 -15 L12 -15 L8 -21 Z', '#cfe8f7', C.ink, 1), path('M-9 -15 L-5 -21 L-2 -21 L-3 -15 Z', '#cfe8f7', C.ink, 1),
  circle(-12, -5, 5.5, C.dark, C.ink, 1.2), circle(13, -5, 5.5, C.dark, C.ink, 1.2), circle(-12, -5, 2, C.silver, null), circle(13, -5, 2, C.silver, null));
const road = (y1 = 84, y2 = 108) => all(rect(0, y1, 120, y2 - y1, ASPH, 0, null), line(`M0 ${y1} L120 ${y1} M0 ${y2} L120 ${y2}`, C.ink, 1.2), line(`M6 ${(y1 + y2) / 2} L118 ${(y1 + y2) / 2}`, C.white, 2, '8 7'));
const box = (x: number, y: number, w: number, h: number, col: string = C.tan) => all(rect(x, y, w, h, col, 2, C.ink, 1.8), line(`M${x} ${y + 6} L${x + w} ${y + 6}`, '#a0673d', 1.2));
const stopwatch = (x: number, y: number, r: number, secShade = 0, col: string = HL) => all(rect(x - 3, y - r - 7, 6, 5, C.dark, 1, C.ink, 1), line(`M${x + r * 0.7} ${y - r * 0.7} l3 -3`, C.dark, 2.4),
  circle(x, y, r, C.white, C.ink, 2), secShade ? path(`M${x} ${y} L${x} ${y - r + 2} A${r - 2} ${r - 2} 0 ${secShade > 30 ? 1 : 0} 1 ${f1(x + Math.sin(rad(secShade * 6)) * (r - 2))} ${f1(y - Math.cos(rad(secShade * 6)) * (r - 2))} Z`, 'rgba(228,87,46,0.35)', null) : '',
  line(`M${x} ${y} L${f1(x + Math.sin(rad(secShade * 6)) * (r - 3))} ${f1(y - Math.cos(rad(secShade * 6)) * (r - 3))}`, col, 2), circle(x, y, 1.6, C.ink, null));
const apple = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C-4 -10 -11 -8 -11 0 C-11 8 -5 12 0 10 C5 12 11 8 11 0 C11 -8 4 -10 0 -6 Z', C.red, C.ink, 1.4), line('M0 -6 L1 -12', C.brown, 1.8), path('M1 -10 C4 -14 8 -13 9 -11 C6 -9 3 -9 1 -10 Z', C.green, C.ink, 0.8));
/** Open hand seen from the side, palm up, at (x, y) (fingers to the right). */
const palmUp = (x: number, y: number) => all(path(`M${x - 24} ${y + 10} L${x - 10} ${y + 4} C${x - 4} ${y + 2} ${x + 14} ${y + 1} ${x + 18} ${y + 3} C${x + 21} ${y + 5} ${x + 18} ${y + 9} ${x + 12} ${y + 9} L${x - 6} ${y + 12} L${x - 24} ${y + 18} Z`, C.skin, C.ink, 1.6),
  path(`M${x - 8} ${y + 4} C${x - 12} ${y - 2} ${x - 6} ${y - 6} ${x - 2} ${y + 2}`, C.skin, C.ink, 1.4));
const bulb = (x: number, y: number, lit = true, r = 11) => all(lit ? line(range(7).map((i) => { const a = rad(-90 + (i - 3) * 30); return `M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 8))} ${f1(y + Math.sin(a) * (r + 8))}`; }).join(' '), C.gold, 2) : '',
  circle(x, y, r, lit ? C.yellow : C.white, C.ink, 1.6), rect(x - r * 0.45, y + r - 1, r * 0.9, r * 0.6, C.grey, 1, C.ink, 1.2), path(`M${x - 3} ${y + 4} L${x - 3} ${y} C${x - 3} ${y - 4} ${x + 3} ${y - 4} ${x + 3} ${y} L${x + 3} ${y + 4}`, 'none', C.dark, 1));
const bolt = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
/** Coil spring between y1 (top) and y2 (bottom) at x. */
const spring = (x: number, y1: number, y2: number, w: number, n: number, col: string = HL, sw = 2.6) => {
  const step = (y2 - y1) / n;
  return line(`M${x} ${y1} ` + range(n).map((i) => `L${x + (i % 2 ? -w : w)} ${f1(y1 + step * (i + 0.5))}`).join(' ') + ` L${x} ${y2}`, col, sw);
};
const gear = (cx: number, cy: number, r: number, teeth: number, col: string, rot = 0) => {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) { const a = rad(rot + (i * 360) / (teeth * 4)), rr = i % 4 < 2 ? r : r - 5; pts.push(`${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr)}`); }
  return all(path(pts.join(' ') + ' Z', col, C.ink, 1.6), circle(cx, cy, r * 0.42, C.white, C.ink, 1.4), circle(cx, cy, r * 0.16, C.dark, null));
};
const cycWheel = (x: number, y: number, r: number) => all(circle(x, y, r, 'none', C.dark, 4), circle(x, y, r - 3, 'none', C.silver, 1),
  line(range(8).map((i) => { const a = rad(i * 22.5); return `M${f1(x - Math.cos(a) * (r - 3))} ${f1(y - Math.sin(a) * (r - 3))} L${f1(x + Math.cos(a) * (r - 3))} ${f1(y + Math.sin(a) * (r - 3))}`; }).join(' '), C.silver, 0.8), circle(x, y, 2.4, C.dark, null));

// ── Shared layouts ───────────────────────────────────────────────────
/** Two frames, each with a clock above: a ball that stays (still) or that has moved. */
const twoFrames = (moving: boolean) => all(
  clock(32, 18, 10, 3, 0), clock(88, 18, 10, 3, 10, { shade: [0, 60] }),
  rect(6, 36, 52, 70, C.white, 4, C.grey2, 1.4), rect(62, 36, 52, 70, C.white, 4, C.grey2, 1.4),
  line('M8 94 L56 94 M64 94 L112 94', '#8fc26a', 3),
  ball(22, 86, 8, BLUE),
  moving ? all(greyed(ball(78, 86, 8, BLUE)), ball(100, 86, 8, BLUE), speed(88, 86, HL), arrow(70, 62, 104, 62, HL, 3)) : all(ball(78, 86, 8, BLUE), line('M74 60 L84 60 M74 66 L84 66', HL, 3), ring(78, 86, 12)));
/** Positions second by second on a road; gaps equal, growing or shrinking; the car at the end. */
const strobe = (kind: 'const' | 'acc' | 'ret') => {
  const xs = kind === 'const' ? [10, 30, 50, 70, 90, 110] : kind === 'acc' ? [8, 15, 27, 45, 71, 106] : [8, 43, 69, 87, 99, 106];
  const out: Svg[] = [road(80, 106), stopwatch(16, 22, 11, 10)];
  xs.forEach((x, i) => { out.push(line(`M${x} 52 L${x} 80`, C.grey, 1.2, '2 2'), dot(x, 52, i === xs.length - 1 ? HL : C.ink, 3)); });
  xs.slice(1).forEach((x, i) => { const a = xs[i]!; if (x - a > 10) out.push(arrow(a + 1, 64, x - 1, 64, HL, 2.4)); else out.push(line(`M${a + 1} 64 L${x - 1} 64`, HL, 3.4)); });
  const last = xs[xs.length - 1]!, cx = Math.min(last, 98);
  out.push(waIn(`b4-mek-strobe-${kind}`, -28, 0, car(cx, 100, C.red, 0.7)));
  if (kind === 'ret') out.push(line(`M${cx - 30} 103 L${cx - 10} 103 M${cx - 26} 99 L${cx - 12} 99`, C.dark, 1.6));
  if (kind === 'acc') out.push(speed(cx - 16, 92, C.white, 3, 12));
  return all(...out);
};
/** A hill: plateau on the left, slope down to the right. Ball at the top (pot) or at the bottom (kin). */
// Kvalitetsplanen A5: the ball moves along the hill (rolls down for rörelseenergi, is lifted up for
// lägesenergi); the still picture (poster frame) is unchanged.
const ROLL = '0%{transform:translate(-80px,-64px)}12%{transform:translate(-68px,-64px)}32%{transform:translate(-50px,-40px)}46%{transform:translate(-35px,-13px)}56%{transform:translate(-20px,-1px)}70%,100%{transform:translate(0,0)}';
const LIFT = '0%,10%{transform:translate(80px,64px)}40%{transform:translate(40px,60px)}60%{transform:translate(12px,30px)}75%,100%{transform:translate(0,0)}';
const hill = (atTop: boolean) => all(rect(0, 0, 120, 112, '#eaf5fb', 0, null), path('M0 112 L0 40 L32 40 C52 40 60 104 88 104 L120 104 L120 112 Z', '#bfe0a6', C.ink, 1.6),
  atTop ? all(moving('mek-lift', LIFT, { dur: 3.2 }, ball(20, 31, 9, C.red), circle(20, 31, 15, 'rgba(228,87,46,0.18)', null)), vbr(8, 40, 104, HL), line('M4 104 L32 104', C.grey, 1.2, '3 3'), greyed(ball(100, 95, 9, C.red)))
    : all(greyed(ball(20, 31, 9, C.red)), moving('mek-roll', ROLL, { dur: 3.2 }, ball(100, 95, 9, C.red)), speed(88, 95, HL, 3, 16), arrow(92, 80, 116, 80, HL, 3)));
/** Before (top row) and after (bottom row) a collision of two balls. */
const collide = (elastic: boolean) => {
  const A = elastic ? (x: number, y: number) => ball(x, y, 9, BLUE) : (x: number, y: number) => all(circle(x, y, 9, '#c98b5a', C.ink, 1.6), path(`M${x - 4} ${y - 2} q3 -3 6 0`, 'none', '#a0673d', 1));
  const B = elastic ? (x: number, y: number) => ball(x, y, 9, C.red) : (x: number, y: number) => all(circle(x, y, 9, '#b07a4a', C.ink, 1.6), path(`M${x - 3} ${y + 2} q3 3 6 0`, 'none', '#7a4f2e', 1));
  return all(rect(4, 6, 112, 46, C.white, 4, C.grey2, 1.2), rect(4, 62, 112, 46, C.white, 4, C.grey2, 1.2), T(12, 18, '1', 9, C.grey), T(12, 74, '2', 9, C.grey),
    A(28, 30), arrow(40, 30, 54, 30, C.grey, 2.4), B(92, 30), arrow(80, 30, 66, 30, C.grey, 2.4),
    elastic ? all(A(26, 86), arrow(16, 86, 6, 86, HL, 3), B(94, 86), arrow(104, 86, 114, 86, HL, 3), star(60, 86, 6, C.yellow))
      : all(path('M44 86 C44 74 60 76 62 78 C66 74 78 76 78 86 C78 96 64 98 60 94 C56 98 44 96 44 86 Z', '#bd8352', C.ink, 1.6), line('M60 78 L60 94', '#7a4f2e', 1, '2 2'), arrow(82, 86, 96, 86, HL, 3)));
};
/** Ball on a string swung around a hand, seen from above; arrow in (centripetal) or out (centrifugal). */
const whirl = (inward: boolean) => all(circle(60, 60, 38, 'none', C.grey, 1.6, ), line('M60 60 L98 60', C.dark, 1.6), circle(60, 60, 7, C.skin, C.ink, 1.6), circle(60, 60, 2, C.ink, null),
  arc(60, 60, 46, 200, 250, C.grey, 2), ball(98, 60, 7, BLUE), arrow(98, 52, 98, 30, C.grey, 2.2),
  inward ? arrow(90, 60, 70, 60, HL, 4) : arrow(106, 60, 118, 60, HL, 4));

export const MECHANICS_MOTIFS: Record<string, Svg> = {
  // ── 3311 Sträcka och förflyttning ───────────────────────────────
  'mek.rörelse': twoFrames(true),
  'mek.förflyttning': all(rect(4, 6, 112, 104, '#f3f7f1', 4, C.grey2, 1.2), line(range(9).map((i) => `M${4 + i * 14} 6 L${4 + i * 14} 110 M4 ${6 + i * 13} L116 ${6 + i * 13}`).join(' '), '#dde6da', 0.8),
    path('M22 92 C10 70 46 70 40 52 C34 34 70 54 74 36 C78 20 100 40 98 28', 'none', C.grey, 2.4), line('M22 92 C10 70 46 70 40 52 C34 34 70 54 74 36 C78 20 100 40 98 28', C.white, 0.8, '3 3'),
    g('translate(22 100)', path('M-9 0 L-9 -10 L0 -17 L9 -10 L9 0 Z', C.white, C.ink, 1.4), rect(-3, -7, 6, 7, C.brown, 1, null)),
    dot(22, 92, C.ink, 3.4), dot(98, 28, C.ink, 3.4), arrow(24, 89, 95, 31, HL, 4.2)),
  'mek.slutpunkt': all(ground(), path('M8 98 C30 98 30 70 52 70 C74 70 74 52 96 52', 'none', C.grey2, 7), line('M8 98 C30 98 30 70 52 70 C74 70 74 52 96 52', C.grey, 1.2, '4 4'),
    dot(8, 98, C.grey, 3), arrow(40, 77, 46, 72, C.grey, 2), arrow(76, 58, 82, 55, C.grey, 2),
    line('M100 52 L100 18', C.dark, 2.4), path('M100 18 L118 18 L118 32 L100 32 Z', C.white, C.ink, 1.2), path('M100 18 h4.5 v3.5 h-4.5 Z M109 18 h4.5 v3.5 h-4.5 Z M104.5 21.5 h4.5 v3.5 h-4.5 Z M113.5 21.5 h4.5 v3.5 h-4.5 Z M100 25 h4.5 v3.5 h-4.5 Z M109 25 h4.5 v3.5 h-4.5 Z M104.5 28.5 h4.5 v3.5 h-4.5 Z M113.5 28.5 h4.5 v3.5 h-4.5 Z', C.ink, null),
    dot(96, 52, HL, 5.5), ring(96, 52, 11)),
  'mek.referenspunkt': all(ground(), line('M60 112 L60 30', C.dark, 3), circle(60, 28, 7, HL, C.ink, 1.6), T(60, 31, '0', 9, C.white), ring(60, 28, 12),
    g('translate(22 112)', rect(-3, -22, 6, 22, C.brown, 1, C.ink, 1.2), circle(0, -32, 14, C.green, C.ink, 1.6)), pal(100, 112, { top: C.green, s: 0.8 }),
    arrow(54, 60, 28, 60, HL, 2.4), arrow(66, 60, 94, 60, HL, 2.4), T(41, 54, '20', 9, HL), T(80, 54, '30', 9, HL)),
  'mek.tillryggalägga': all(rect(0, 0, 120, 112, '#eaf5fb', 0, null), rect(0, 84, 120, 28, '#d9d2c3', 0, null), line('M0 84 L120 84', C.ink, 1.2),
    waPulse('b4-mek-tillryggalagga-1', line('M4 98 L84 98', HL, 5)), line('M84 98 L116 98', C.grey, 2.4, '4 4'),
    ...[1, 2, 3, 4, 5].map((n, i) => g(`translate(${10 + i * 24} 84)`, line('M0 0 L0 -14', C.dark, 1.8), rect(-5, -24, 10, 10, C.white, 1, C.ink, 1), T(0, -16, String(n), 7, i < 4 ? HL : C.grey))),
    pal(88, 96, { lean: 14, a1: 60, a2: -40, k1: -70, k2: -60, l1: 40, l2: -30, top: C.yellow, s: 0.9 }), hbr(4, 84, 108, HL, 2)),
  'mek.rätlinjig': all(rect(4, 10, 112, 44, C.white, 4, HL, 2.4), line('M12 32 L104 32', HL, 3.4), ...[16, 34, 52, 70].map((x) => greyed(dot(x, 32, C.ink, 2.6))), ball(92, 32, 7, BLUE), arrow(100, 32, 114, 32, HL, 3),
    greyed(rect(4, 64, 112, 44, C.white, 4, C.grey2, 1.2), path('M12 86 C24 66 36 106 48 86 C60 66 72 106 84 86 C90 76 98 76 104 84', 'none', C.grey, 3), ball(100, 80, 7, BLUE))),
  // ── 3312 Hastighet och acceleration ─────────────────────────────
  'mek.momentanhastighet': all(line(range(8).map((i) => `M${20 + i * 12} 14 L${20 + i * 12} 100 M20 ${16 + i * 12} L108 ${16 + i * 12}`).join(' '), '#e4e8ee', 0.8), arrow(20, 100, 114, 100, C.ink, 2), arrow(20, 104, 20, 8, C.ink, 2), T(110, 112, 't', 10), T(12, 14, 'v', 10),
    greyed(line('M20 58 L108 58', C.grey, 1.6, '5 4')), path('M20 96 C34 50 44 40 54 62 C62 80 72 30 84 34 C94 38 100 60 108 52', 'none', C.ink, 2.4),
    line('M72 38 L72 100 M20 38 L72 38', HL, 1.6, '3 3'), dot(72, 38, HL, 5), ring(72, 38, 10),
    g('translate(98 22)', circle(0, 0, 13, C.dark, C.ink, 1.6), line('M0 0 L5 -9', HL, 2.4), line('M-9 5 l2 -1 M-10 -2 l2 0 M-6 -9 l1 2 M0 -11 l0 2 M6 -9 l-1 2', C.white, 1), circle(0, 0, 2, C.silver, null)), line('M80 34 L86 28', HL, 1.4, '2 2')),
  'mek.meter-per-sekund': all(ground(), pal(60, 104, { lean: 16, a1: 60, a2: -45, k1: -70, k2: -60, l1: 42, l2: -30, top: C.orange, s: 0.9 }),
    hbr(30, 92, 108, HL, 2.6), T(61, 104, '1', 11, HL), stopwatch(98, 24, 13, 10), T(98, 56, '1', 15, HL), ring(98, 24, 18)),
  'mek.konstant-hastighet': strobe('const'),
  'mek.acceleration': strobe('acc'),
  'mek.retardation': strobe('ret'),
  'mek.bromssträcka': all(road(78, 106), line('M26 70 L26 110', C.ink, 1.6, '3 3'), line('M26 101 L84 101 M26 96 L84 96', C.black, 2.4), car(98, 104, C.red, 0.9),
    hbr(26, 98, 60, HL, 3), arrow(40, 46, 70, 46, C.grey, 2), line('M70 40 L70 52', C.grey, 2)),
  'mek.fartkamera': all(road(84, 108), line('M20 84 L20 30', C.dark, 3), rect(8, 18, 28, 20, C.silver, 3, HL, 2.6), circle(28, 28, 6, C.dark, C.ink, 1.2), circle(28, 28, 2.4, BLUE, null), rect(10, 22, 8, 5, C.yellow, 1, C.ink, 0.8),
    line('M40 22 L52 16 M40 30 L54 30 M40 38 L52 44', C.gold, 2.2), car(86, 104, C.red, 0.9), speed(62, 94, C.grey, 3, 14)),
  'mek.fritt-fall': all(rect(4, 44, 40, 68, '#cdb79e', 1, C.ink, 1.6), ...[56, 80].map((y) => all(rect(10, y, 10, 12, '#cfe8f7', 1, C.ink, 1), rect(28, y, 10, 12, '#cfe8f7', 1, C.ink, 1))), rect(2, 42, 44, 4, C.dark, 1, null),
    pal(28, 42, { s: 0.5, a2: 95, a1: 20 }), ground(),
    greyed(ball(48, 18, 5, C.red), ball(48, 24, 5, C.red), ball(48, 36, 5, C.red), ball(48, 54, 5, C.red)), ball(48, 82, 6, C.red),
    waIn('b4-mek-fritt-fall-1', -0, -14, arrow(80, 16, 80, 104, HL, 3.6)), line('M64 16 L64 22 M64 26 L64 34 M64 40 L64 52 M64 58 L64 78', HL, 2.4)),
  // ── 3313 Kraft och massa ────────────────────────────────────────
  'mek.kraft': all(ground(), pal(34, 112, { lean: 30, a1: 80, a2: 75, l1: -30, l2: 20, top: C.green }), box(56, 70, 40, 42), arrow(62, 90, 114, 90, HL, 5)),
  'mek.newton': all(palmUp(52, 86), apple(56, 76, 1.1), arrow(74, 72, 74, 108, HL, 3.6), T(90, 96, '1', 16, HL)),
  'mek.normalkraft': all(ground(), rect(14, 74, 92, 8, C.tan, 2, C.ink, 1.8), line('M22 82 L22 112 M98 82 L98 112', C.brown, 4), box(44, 44, 32, 30, C.beige),
    greyed(arrow(30, 50, 30, 70, C.grey, 3)), arrow(60, 74, 60, 14, HL, 5), line('M50 74 L70 74', HL, 3)),
  'mek.friktion': all(path('M0 96 ' + range(30).map((i) => `L${i * 4 + 2} ${i % 2 ? 96 : 92}`).join(' ') + ' L120 96 L120 112 L0 112 Z', '#c9b28c', C.ink, 1.4), box(46, 62, 36, 32),
    arrow(14, 78, 44, 78, C.grey, 3), arrow(64, 102, 34, 102, HL, 4),
    circle(96, 30, 20, C.white, C.ink, 1.6), path('M78 30 L82 26 L86 32 L90 26 L94 32 L98 26 L102 32 L106 26 L112 30 L112 22 L78 22 Z', C.tan, C.ink, 1), path('M78 34 L82 30 L86 36 L90 30 L94 36 L98 30 L102 36 L106 30 L112 34 L112 44 L78 44 Z', '#c9b28c', C.ink, 1),
    ring(96, 30, 22), line('M64 94 L80 48', C.grey, 1, '2 2')),
  'mek.luftmotstånd': all(ground(), cycWheel(42, 98, 13), cycWheel(84, 98, 13), line('M42 98 L58 76 L78 76 L84 98 M58 76 L64 98 L42 98 M64 98 L78 76', C.red, 2.6),
    pal(62, 98, { lean: 58, a1: 120, a2: 116, l1: 70, l2: 30, top: C.yellow, s: 0.85 }),
    line('M100 40 L118 40 M96 54 L118 54 M102 68 L118 68', BLUE, 2.2), arrow(96, 30, 70, 30, HL, 4)),
  'mek.resulterande-kraft': all(box(46, 30, 28, 28, C.beige), arrow(46, 44, 14, 44, C.grey, 3.4), arrow(74, 44, 116, 44, C.grey, 3.4), T(30, 36, '3', 10, C.grey), T(96, 36, '5', 10, C.grey),
    line('M10 70 L110 70', C.grey2, 1.2), T(46, 98, '=', 16, C.ink), box(52, 82, 20, 20, C.beige), arrow(72, 92, 100, 92, HL, 5), T(86, 82, '2', 12, HL)),
  'mek.fjäder.2': all(ground(), rect(14, 104, 92, 8, C.grey, 1, C.ink, 1.4), spring(80, 50, 104, 10, 12, HL, 3), rect(66, 44, 28, 6, C.silver, 1, C.ink, 1.4),
    rect(66, 22, 28, 22, C.dark, 3, C.ink, 1.6), arrow(80, 4, 80, 18, C.grey, 2.6),
    greyed(spring(34, 24, 104, 10, 12, C.grey, 2.6), rect(20, 18, 28, 6, C.silver, 1, C.ink, 1.4))),
  'mek.dynamometer': all(line('M10 8 L110 8', C.dark, 3), line('M60 8 L60 14', C.dark, 2), path('M60 14 C54 14 54 20 60 20', 'none', C.dark, 1.8),
    rect(52, 20, 16, 52, C.white, 3, HL, 2.6), spring(60, 24, 62, 4, 10, C.grey, 1.6), line(range(8).map((i) => `M53 ${26 + i * 6} L57 ${26 + i * 6}`).join(' '), C.ink, 1), rect(56, 62, 8, 4, HL, 1, null),
    line('M60 72 L60 82', C.dark, 2), path('M60 82 C66 82 66 88 60 88', 'none', C.dark, 1.8), path('M46 90 L74 90 L78 112 L42 112 Z', C.beige, C.ink, 1.6), line('M54 90 C54 84 66 84 66 90', C.ink, 1.4)),
  'mek.tyngdlöshet': all(rect(2, 4, 116, 108, '#e4e8ee', 16, C.ink, 2), circle(96, 26, 15, '#0f2040', C.ink, 1.6), path('M86 30 C90 22 98 34 104 24 C106 30 100 38 92 38 Z', '#4f9d69', null), circle(96, 26, 15, 'none', C.dark, 3),
    waBob('b4-mek-tyngdloshet-1', 5, g('rotate(-62 52 72)', pal(52, 96, { a1: 140, a2: 110, l1: 20, l2: -10, top: C.orange }))), waBob('b4-mek-tyngdloshet-2', 3, cupFloat(22, 30)), ...[[30, 54], [24, 62], [36, 60]].map(([x, y]) => circle(x!, y!, 2.6, '#8cc7e8', C.ink, 0.8))),
  // ── 3314 Newtons rörelselagar ───────────────────────────────────
  'mek.tröghet': all(ground(), rect(4, 34, 112, 66, '#f2c14e', 10, C.ink, 2), rect(12, 42, 30, 24, '#cfe8f7', 3, C.ink, 1.4), rect(78, 42, 30, 24, '#cfe8f7', 3, C.ink, 1.4), rect(4, 86, 112, 4, C.dark, 0, null),
    circle(26, 102, 9, C.dark, C.ink, 1.6), circle(94, 102, 9, C.dark, C.ink, 1.6), line('M52 40 L52 50 L70 50', C.silver, 2.4),
    pal(56, 86, { lean: 30, a1: 110, a2: 95, l1: -16, l2: 10, top: C.green, s: 0.82 }), arrow(76, 58, 100, 58, HL, 3.6), arrow(108, 112, 88, 112, C.grey, 2)),
  'mek.i-vila': twoFrames(false),
  'mek.glida': all(rect(0, 70, 120, 42, ICE, 0, null), line('M0 70 L120 70', '#9fcfe8', 2), line('M6 94 L70 94', '#b9dff2', 6), line('M10 100 L66 100 M20 88 L60 88', C.white, 1.4),
    g('translate(86 94)', ellipse(0, 4, 16, 6, C.grey, C.ink, 1.6), rect(-16, -4, 32, 8, C.grey2, 3, C.ink, 1.6), ellipse(0, -4, 16, 5, C.red, C.ink, 1.4), path('M-4 -6 L-4 -14 L10 -14', 'none', C.dark, 3)),
    waIn('b4-mek-glida-1', -14, -0, arrow(70, 60, 112, 60, HL, 3.6)), speed(66, 92, HL, 3, 14)),
  'mek.tvärbromsa': all(road(80, 106), g('rotate(6 70 100)', car(70, 100, C.red, 1.1)), line('M30 100 L52 100 M34 105 L52 105', C.black, 2.4),
    ...[[46, 92], [40, 96], [92, 94], [86, 98]].map(([x, y]) => circle(x!, y!, 5, '#e4e8ee', C.grey, 1)), ball(108, 98, 6, C.yellow),
    T(70, 52, '!', 26, HL), waPulse('b4-mek-tvarbromsa-1', line('M56 66 l-6 -6 M84 66 l6 -6', HL, 2.4))),
  'mek.motkraft': all(rect(92, 4, 24, 108, '#cdb79e', 1, C.ink, 1.8), line('M92 20 L116 20 M92 40 L116 40 M92 60 L116 60 M92 80 L116 80 M92 100 L116 100 M104 4 L104 20 M104 40 L104 60 M104 80 L104 100 M98 20 L98 40 M110 60 L110 80', '#a8916f', 1),
    pal(48, 112, { lean: 22, a1: 82, a2: 78, l1: -24, l2: 16, top: C.orange }), arrow(72, 46, 90, 46, C.grey, 3.6), arrow(90, 62, 72, 62, HL, 4.2), circle(91, 54, 3, HL, null)),
  'mek.trycka-ifrån': all(rect(0, 26, 120, 86, '#8cc7e8', 0, null), rect(0, 4, 12, 108, C.white, 0, C.ink, 1.6), line('M12 26 L120 26', '#5aa7d6', 2),
    line('M12 50 L120 50', C.white, 1, '2 6'), line(range(4).map((i) => `M${20 + i * 26} 36 q4 -3 8 0`).join(' '), C.white, 1.2),
    g('translate(13 74) rotate(90)', pal(0, 0, { lean: 0, a1: 175, a2: 170, l1: 12, l2: -12, top: C.red, s: 0.9 })),
    arrow(14, 96, 4, 96, C.grey, 2.4), waIn('b4-mek-trycka-ifran-1', -14, -0, arrow(86, 74, 116, 74, HL, 4)), line('M56 66 L70 66 M52 82 L70 82', C.white, 2)),
  // ── 3315 Arbete och energi ──────────────────────────────────────
  'mek.arbete': all(ground(), greyed(box(14, 76, 30, 36)), pal(52, 112, { lean: 30, a1: 82, a2: 78, l1: -28, l2: 18, top: C.green }), box(74, 76, 30, 36),
    arrow(78, 64, 112, 64, HL, 3.4), T(96, 56, 'F', 11, HL), hbr(29, 89, 104, HL, 2.6)),
  'mek.lägesenergi': hill(true),
  'mek.rörelseenergi': hill(false),
  'mek.energiomvandling': all(g('translate(22 60)', circle(0, 0, 16, C.white, C.ink, 1.8), line('M0 -12 L0 12 M-12 0 L12 0 M-8 -8 L8 8 M8 -8 L-8 8', C.dark, 1.4), circle(0, 0, 3, C.dark, null), arc(0, 0, 22, 140, 40, C.grey, 2.2)),
    arrow(42, 60, 52, 60, HL, 3.4), bolt(62, 60, 1.2), arrow(72, 60, 82, 60, HL, 3.4), bulb(100, 58, true, 11), arc(60, 82, 40, 200, 340, HL, 2.2)),
  'mek.effekt': all(line('M4 18 L116 18', C.dark, 2), line('M32 18 L32 40 M88 18 L88 40', C.dark, 1.6),
    greyed(bulb(32, 54, false, 14), rect(14, 90, 36, 18, C.white, 3, C.grey, 1.2), T(32, 104, '25', 12, C.grey)),
    circle(88, 54, 30, 'rgba(242,193,78,0.35)', null), bulb(88, 54, true, 14), line('M60 54 L66 54 M110 54 L116 54 M70 30 L74 34 M106 30 L102 34 M70 78 L74 74 M106 78 L102 74', C.gold, 2.4),
    rect(68, 90, 40, 18, C.white, 3, HL, 2.4), T(88, 104, '100', 12, HL)),
  'mek.verkningsgrad': all(path('M4 46 L44 46 L44 74 L4 74 Z', C.yellow, C.ink, 1.4), T(22, 64, '100', 10), bulb(58, 60, true, 13),
    path('M74 54 L104 54 L104 48 L116 58 L104 68 L104 62 L74 62 Z', HL, C.ink, 1.2), T(96, 82, '10 %', 11, HL),
    greyed(line('M50 40 C46 32 54 28 50 20 M60 40 C56 32 64 28 60 20 M70 40 C66 32 74 28 70 20', C.grey, 3), T(60, 14, '90 %', 9, C.grey))),
  'mek.berg-och-dal-bana': all(rect(0, 0, 120, 112, '#eaf5fb', 0, null), ground(), line('M14 112 L14 60 M44 112 L44 30 M74 112 L74 82 M104 112 L104 52', C.grey, 2), line('M14 80 L44 60 M44 70 L74 96 M74 96 L104 76', C.grey2, 1.2),
    path('M2 70 C14 56 30 20 44 24 C58 28 62 90 74 90 C86 90 94 52 104 50 C112 48 116 60 118 64', 'none', C.dark, 3.4), path('M2 74 C14 60 30 24 44 28 C58 32 62 94 74 94 C86 94 94 56 104 54 C112 52 116 64 118 68', 'none', C.red, 1.6),
    g('translate(58 56) rotate(64)', rect(-9, -8, 18, 9, C.yellow, 2, C.ink, 1.4), circle(-4, -11, 3, C.skin, C.ink, 1), circle(4, -11, 3, C.skin, C.ink, 1), line('M-4 -14 L-6 -20 M4 -14 L6 -20', C.ink, 1.4)),
    g('translate(48 32) rotate(30)', rect(-9, -8, 18, 9, C.yellow, 2, C.ink, 1.4), circle(0, -11, 3, C.skin, C.ink, 1), line('M0 -14 L-2 -20 M0 -14 L3 -20', C.ink, 1.4))),
  'mek.dynamo': all(moving('mek-wheel', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 2.4, spin: true }, cycWheel(46, 74, 34)), line('M46 74 L74 22 L96 22', C.dark, 3.4), g('translate(77 48) rotate(28)', rect(-5, -12, 10, 20, C.silver, 3, HL, 2.6), rect(-3, 8, 6, 4, C.dark, 1, null)),
    path('M80 36 C90 30 92 20 98 20', 'none', C.red, 1.4), g('translate(102 22)', rect(-6, -6, 12, 12, C.dark, 3, C.ink, 1.2), circle(5, 0, 4, C.yellow, C.ink, 1.2)), line('M110 16 L118 12 M110 22 L118 22 M110 28 L118 32', C.gold, 2),
    arc(46, 74, 42, 60, 20, HL, 2.2)),
  // ── 3316 Rörelsemängd och impuls ────────────────────────────────
  'mek.rörelsemängd': all(T(60, 14, 'p = m · v', 11, C.ink), line('M0 56 L120 56', C.grey2, 1.2), line('M0 106 L120 106', C.grey2, 1.2),
    g('translate(40 54)', rect(-30, -26, 40, 22, C.white, 2, C.ink, 1.6), path('M10 -20 L22 -20 L28 -10 L28 -4 L10 -4 Z', BLUE, C.ink, 1.6), circle(-20, -3, 5, C.dark, C.ink, 1.2), circle(-6, -3, 5, C.dark, C.ink, 1.2), circle(18, -3, 5, C.dark, C.ink, 1.2)),
    arrow(72, 38, 116, 38, HL, 6),
    g('translate(36 104)', circle(-10, -8, 7, 'none', C.dark, 2), circle(10, -8, 7, 'none', C.dark, 2), line('M-10 -8 L-2 -18 L8 -18 L10 -8 M-2 -18 L0 -8 L-10 -8', C.green, 2), circle(-1, -27, 3.4, C.skin, C.ink, 1)),
    arrow(72, 90, 86, 90, HL, 3), speed(16, 34, C.grey, 3, 10), speed(22, 92, C.grey, 3, 10)),
  'mek.impuls.2': all(ground(), path('M4 20 L30 66 L40 62 L18 16 Z', C.navy, C.ink, 1.6), path('M28 64 C30 76 50 78 56 74 L56 68 C48 66 42 62 40 60 Z', C.dark, C.ink, 1.6),
    star(60, 74, 9, C.yellow), ball(70, 76, 10, C.white), line('M64 68 l4 4 M74 70 l-2 6 M66 82 l6 -2', C.ink, 1), arrow(84, 76, 116, 76, HL, 4),
    g('translate(70 10)', rect(0, 0, 46, 36, C.white, 3, C.grey2, 1.2), line('M6 30 L42 30 M6 30 L6 4', C.ink, 1.2), path('M10 30 L16 30 C18 30 19 8 22 8 C25 8 26 30 28 30 Z', SOFT, HL, 1.8), T(40, 38 - 2, 't', 7), T(4, 6, 'F', 7))),
  'mek.elastisk-stöt': collide(true),
  'mek.oelastisk-stöt': collide(false),
  'mek.krockkudde': all(rect(0, 0, 120, 112, '#e8ecf1', 0, null), path('M4 16 L76 16 L112 60 L112 112 L4 112 Z', '#cfe8f7', C.ink, 1.4), rect(4, 70, 112, 42, C.dark, 0, null),
    path('M8 112 L8 44 C8 38 20 38 20 44 L22 86 L50 88 L50 112 Z', '#5a5f6b', C.ink, 1.6), pal(26, 116, { lean: -6, a1: 70, a2: 60, l1: 84, l2: 80, top: C.green, s: 0.95 }), line('M64 84 L86 64', C.dark, 4), ellipse(66, 58, 18, 22, C.white, HL, 2.6), path('M56 50 C60 46 70 46 72 52', 'none', C.grey2, 1.4), path('M54 66 C60 70 70 70 76 64', 'none', C.grey2, 1.4)),
  'mek.krocktest': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), ground(), rect(96, 24, 22, 88, '#b8bec6', 2, C.ink, 1.8), line('M96 44 L118 44 M96 70 L118 70 M96 92 L118 92', C.grey, 1),
    g('translate(58 110)', path('M-48 -8 L-46 -18 L-30 -21 L-20 -34 L4 -34 L14 -22 L30 -20 L34 -14 L38 -8 Z', C.white, C.ink, 1.6), path('M30 -20 L36 -22 L34 -16 L38 -14 L36 -8 L30 -10 Z', C.silver, C.ink, 1.2),
      path('M-16 -32 L-8 -22 L10 -22 L4 -32 Z', '#cfe8f7', C.ink, 1), circle(-28, -6, 7, C.dark, C.ink, 1.4), circle(22, -6, 7, C.dark, C.ink, 1.4)),
    circle(58, 82, 6, C.yellow, C.ink, 1.2), path('M58 76 A6 6 0 0 1 64 82 L58 82 Z M58 88 A6 6 0 0 1 52 82 L58 82 Z', C.ink, null),
    circle(26, 92, 5, C.yellow, C.ink, 1.2), path('M26 87 A5 5 0 0 1 31 92 L26 92 Z M26 97 A5 5 0 0 1 21 92 L26 92 Z', C.ink, null),
    line('M90 70 L96 66 M90 84 L96 86 M92 100 L96 98', HL, 2.4), star(94, 78, 6, C.yellow)),
  'mek.stötdämpare': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), path('M0 112 L0 104 L40 104 C48 104 50 92 60 92 C70 92 72 104 80 104 L120 104 L120 112 Z', '#9aa3ad', C.ink, 1.4),
    rect(20, 8, 84, 22, C.red, 6, C.ink, 1.8), circle(60, 76, 18, C.dark, C.ink, 1.8), circle(60, 76, 7, C.silver, C.ink, 1.2),
    rect(55, 30, 10, 22, C.silver, 2, C.ink, 1.4), rect(57, 50, 6, 20, C.grey2, 1, C.ink, 1.2), spring(60, 32, 64, 9, 9, HL, 2.6), ring(60, 47, 22), arrow(92, 70, 92, 54, C.grey, 2.4)),
  'mek.biljard': all(path('M14 30 L106 30 L118 100 L2 100 Z', '#3c8a55', C.ink, 2), path('M14 30 L106 30 L118 100 L2 100 Z', 'none', C.brown, 4), ...[[14, 30], [106, 30], [2, 100], [118, 100], [60, 30], [60, 100]].map(([x, y]) => circle(x!, y!, 4, C.black, null)),
    ball(36, 76, 5.5, C.white), ball(70, 54, 5, C.red), ball(78, 48, 5, C.yellow), ball(78, 60, 5, BLUE), ball(86, 54, 5, C.purple), line('M4 106 L32 80', C.tan, 3.4), line('M4 106 L10 100', C.dark, 3.4), line('M42 72 L62 58', C.white, 1.2, '2 2')),
  // ── 3317 Rotation och vridmoment ────────────────────────────────
  'mek.rotationsaxel': all(g('rotate(20 60 60)', line('M60 4 L60 116', C.ink, 9), line('M60 4 L60 116', HL, 6), circle(60, 60, 34, '#bfe3f5', C.ink, 2),
      path('M40 44 C48 36 58 42 54 52 C50 60 40 62 36 56 Z M66 62 C76 56 88 62 84 74 C80 84 68 82 66 74 Z', C.green, C.ink, 1.2), line('M26 60 C40 68 80 68 94 60', C.grey, 0.8, '2 2'),
      line('M60 4 L60 28 M60 92 L60 116', HL, 6), circle(60, 4, 4.5, HL, C.ink, 1.4), circle(60, 116, 4.5, HL, C.ink, 1.4)),
    greyed(arc(60, 60, 44, 200, 250, C.grey, 1.4))),
  'mek.varvtal': all(rect(16, 6, 88, 104, C.white, 6, C.ink, 2), rect(16, 6, 88, 20, '#e4e8ee', 6, C.ink, 1.6), rect(56, 10, 40, 12, C.black, 2, HL, 2), T(76, 20, '1400', 10, '#ff8a5c'), circle(28, 16, 4, C.grey, C.ink, 1),
    circle(60, 68, 32, C.grey2, C.ink, 2), circle(60, 68, 24, '#cfe8f7', C.ink, 1.6), path('M60 52 C76 54 78 74 64 80 C52 84 44 70 52 62', 'none', BLUE, 2.4), arc(60, 68, 16, 120, -150, HL, 2.6)),
  'mek.kugghjul': all(gear(40, 60, 28, 10, HL, 0), gear(84, 60, 18, 7, C.silver, 13), arc(40, 60, 36, 150, 210, C.grey, 2.2), arc(84, 60, 26, 30, -30, C.grey, 2.2)),
  'mek.vridmoment': all(rect(4, 52, 12, 60, '#cdb79e', 1, C.ink, 1.6), circle(18, 58, 4, C.dark, C.ink, 1.2), rect(18, 54, 94, 8, C.tan, 2, C.ink, 1.6), circle(100, 58, 3, C.dark, null),
    arrow(104, 28, 104, 52, HL, 4), arc(18, 58, 50, -8, -70, HL, 3), hbr(18, 104, 76, HL, 2), greyed(arrow(30, 38, 30, 52, C.grey, 2.4))),
  'mek.hävstång': all(ground(), path('M44 112 L54 92 L64 112 Z', C.grey, C.ink, 1.6), line('M8 98 L110 83', HL, 5), path('M8 96 C2 80 14 66 26 68 C38 64 44 80 38 94 Z', '#8a8f99', C.ink, 1.8),
    pal(98, 112, { lean: 18, a1: 40, a2: 28, top: C.green, s: 0.8 }), arrow(112, 56, 112, 76, HL, 3), arrow(20, 62, 20, 44, C.grey, 2.6)),
  'mek.centripetalkraft': whirl(true),
  'mek.centrifugalkraft': whirl(false),
  'mek.karusell': all(ground(), path('M10 34 L60 10 L110 34 Z', C.red, C.ink, 1.8), path('M10 34 L23 34 L36 22 L23 34 M36 34 L48 16 M60 34 L60 10 M84 34 L72 16 M110 34 L97 34', 'none', C.white, 2),
    path('M10 34 Q16 40 22 34 Q28 40 35 34 Q41 40 47 34 Q53 40 60 34 Q66 40 72 34 Q78 40 85 34 Q91 40 97 34 Q103 40 110 34', C.yellow, C.ink, 1.2), line('M60 34 L60 98', C.gold, 3),
    ellipse(60, 100, 52, 8, C.tan, C.ink, 1.8), ...[26, 94].map((x) => all(line(`M${x} 40 L${x} 96`, C.silver, 2), g(`translate(${x} 74)`, line('M-7 3 L-9 13 M-3 4 L-4 13 M5 4 L6 13 M8 3 L11 12', C.ink, 1.8), path('M-12 -4 C-16 0 -16 6 -14 8', 'none', C.brown, 2.4), ellipse(0, 0, 12, 6, C.white, C.ink, 1.4), path('M8 -3 L13 -14 L19 -13 L20 -9 L15 -9 L12 0 Z', C.white, C.ink, 1.4), path('M12 -14 L9 -8', 'none', C.brown, 2.4), circle(16, -12, 0.9, C.ink, null)))),
    arc(60, 100, 60, 250, 290, HL, 2.6)),
  'mek.gångjärn': all(rect(30, 6, 12, 106, '#cdb79e', 1, C.ink, 1.6), rect(42, 6, 58, 106, '#d9b58a', 2, C.ink, 1.8), circle(90, 62, 3, C.dark, null),
    ...[22, 90].map((y) => all(rect(36, y, 6, 14, C.silver, 1, C.ink, 1), rect(42, y, 6, 14, C.silver, 1, C.ink, 1), rect(40, y - 1, 4, 16, C.grey, 2, C.ink, 1))),
    ring(42, 29, 12), arc(42, 62, 30, 20, -20, C.grey, 2)),
};

/** A mug floating in the air (used in tyngdlöshet). */
function cupFloat(x: number, y: number): Svg {
  return g(`translate(${x} ${y}) rotate(-25)`, path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', C.white, C.ink, 1.4), path('M7 -3 C12 -3 12 4 6 4', 'none', C.ink, 1.4));
}
