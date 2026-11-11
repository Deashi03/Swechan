/**
 * Non-verbal communication (0.29, Kommunikation & samspel → Icke-verbal kommunikation, modules 1141–1147):
 * facial expressions, posture, gaze, tone of voice, distance, gestures across cultures and social signals.
 * Faces that carry the word are drawn large with a face whose brows, lids, pupils and mouth can be set one
 * by one; postures use a posable figure (front or side view) so that the body itself shows the word.
 * Speech bubbles hold icons and sound shapes, never words. Swedish gestures are drawn as done in Sweden.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, arm, cup, heart } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { type Build } from './figures';

type Pt = readonly [number, number];
const f1 = (n: number) => +n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const T = (x: number, y: number, s: string, size = 12, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
const qm = (x: number, y: number, s = 13, col: string = C.navy) => T(x, y + s * 0.36, '?', s, col);
const exm = (x: number, y: number, s = 13, col: string = HL) => T(x, y + s * 0.36, '!', s, col);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const RED = '#e8302c';
const GOOD = '#3a9a5a';
const tear = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-3 5 -3 8 0 8 C3 8 3 5 0 0 Z', '#9ad0f0', C.ink, 0.6));
const sweat = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -5 C-3.4 0 -3 4 0 4 C3 4 3.4 0 0 -5 Z', '#9ad0f0', C.ink, 0.8));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, GOOD, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.24));
const noC = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.24));
const motion = (x: number, y: number, side: 1 | -1, n = 3, len = 6, col: string = HL) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y - (n - 1) * 3 + i * 6} l${side * len} 0`, col, 1.5)));
const flagJP = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, C.white, 1, C.ink, 1), circle(0, 0, 3.4, '#d6302c', null));
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, '#2f6ab8', 1, C.ink, 1), rect(-4.5, -6, 3, 12, '#f2c94e', 0, null), rect(-9, -1.5, 18, 3, '#f2c94e', 0, null));
const clock = (x: number, y: number, r = 8, hm: [number, number] = [-90, 0]) => all(circle(x, y, r, C.white, C.ink, 1.4), ...[0, 90, 180, 270].map((a) => circle(f1(x + Math.cos((a * Math.PI) / 180) * r * 0.75), f1(y + Math.sin((a * Math.PI) / 180) * r * 0.75), 0.7, C.ink, null)),
  line(`M${x} ${y} L${f1(x + Math.cos((hm[0] * Math.PI) / 180) * r * 0.5)} ${f1(y + Math.sin((hm[0] * Math.PI) / 180) * r * 0.5)}`, C.ink, 1.6), line(`M${x} ${y} L${f1(x + Math.cos((hm[1] * Math.PI) / 180) * r * 0.75)} ${f1(y + Math.sin((hm[1] * Math.PI) / 180) * r * 0.75)}`, C.ink, 1.2));
const chair = (x: number, y = 112, dir: 1 | -1 = 1, col: string = C.brown) => all(line(`M${x - dir * 12} ${y - 30} L${x - dir * 13} ${y - 62}`, col, 4), rect(x - 13, y - 32, 26, 5, col, 2, C.ink, 1.4), line(`M${x - 10} ${y - 27} L${x - 11} ${y} M${x + 10} ${y - 27} L${x + 11} ${y}`, col, 3));
const bench = (x1: number, x2: number, y = 86) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));

// ── Speech ───────────────────────────────────────────────────────────
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white, stroke: string = C.ink) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[], a2: number[], b2: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, inw = tx < L ? 1.6 : -1.6, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; a2 = [e + inw, by - 3.6]; b2 = [e + inw, by + 3.6]; }
  else { const e = ty > cy ? B : Tp, inw = ty > cy ? -1.6 : 1.6, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; a2 = [bx - 4, e + inw]; b2 = [bx + 4, e + inw]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, stroke, 1.5), rect(L, Tp, w, h, fill, 6, stroke, 1.5), path(`M${a2[0]} ${a2[1]} L${tx} ${ty} L${b2[0]} ${b2[1]} Z`, fill, null), inner);
};
/** Jagged bubble (sharp, abrupt speech). */
const shout = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number, inner: Svg = '', n = 14) => {
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, k = i % 2 ? 0.72 : 1; return `${f1(cx + Math.cos(a) * rx * k)} ${f1(cy + Math.sin(a) * ry * k)}`; });
  return all(path(`M${cx - 3} ${cy + ry * 0.4} L${tx} ${ty} L${cx + 4} ${cy + ry * 0.3} Z`, C.white, C.ink, 1.4), path(`M${pts.join(' L')} Z`, C.white, C.ink, 1.5), inner);
};
/** Sound wave of given amplitudes centred at x. */
const wave = (x: number, y: number, amps: number[], step = 4, col: string = C.navy, w = 1.8) => { const x0 = x - ((amps.length - 1) * step) / 2; return line(amps.map((a, i) => `M${f1(x0 + i * step)} ${f1(y - a)} L${f1(x0 + i * step)} ${f1(y + a)}`).join(' '), col, w); };
const melody = (x: number, y: number, pts: number[], step = 6, col: string = C.navy) => { const x0 = x - ((pts.length - 1) * step) / 2; return line(pts.map((p, i) => `${i ? 'L' : 'M'}${f1(x0 + i * step)} ${f1(y - p)}`).join(' '), col, 2); };
const noteI = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 4 L0 -9 L6 -11', 'none', col, 1.6), ellipse(-2.2, 4, 2.8, 2.1, col, null));

// ── Big face ─────────────────────────────────────────────────────────
type FaceO = {
  skin?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'none'; tilt?: number; grey?: boolean;
  b?: number; ba?: number; b2?: number; ba2?: number; // brow raise (+ up) and tilt (+ angry, − worried); 2 = right brow
  eo?: number; eo2?: number; lid?: number; px?: number; py?: number; happy?: boolean; wink?: boolean; // eyes
  mc?: number; mw?: number; mo?: number; pout?: boolean; skew?: number; press?: boolean; teeth?: boolean; // mouth
  blush?: boolean; wr?: boolean; sweat?: boolean; tears?: boolean; red?: boolean; glint?: boolean; cheeks?: boolean;
};
/** A large face (r ≈ 30–40) whose features are set one by one. */
const face = (cx: number, cy: number, r: number, o: FaceO = {}): Svg => {
  const k = r / 30, ink = C.ink, grey = o.grey ?? false;
  const sk = grey ? C.grey2 : o.red ? '#f2a08a' : (o.skin ?? C.skin), hc = grey ? C.grey : (o.hair ?? C.hair);
  const X = (dx: number) => f1(cx + dx * k), Y = (dy: number) => f1(cy + dy * k);
  const out: Svg[] = [];
  if (o.hs === 'long') out.push(path(`M${X(-31)} ${Y(-4)} C${X(-36)} ${Y(30)} ${X(-24)} ${Y(38)} ${X(-14)} ${Y(30)} L${X(14)} ${Y(30)} C${X(24)} ${Y(38)} ${X(36)} ${Y(30)} ${X(31)} ${Y(-4)} Z`, hc, ink, 1.6 * k));
  out.push(ellipse(X(-30), Y(4), 4.4 * k, 7 * k, sk, ink, 1.6 * k), ellipse(X(30), Y(4), 4.4 * k, 7 * k, sk, ink, 1.6 * k));
  out.push(circle(cx, cy, r, sk, ink, 2.2 * k));
  if (o.hs !== 'none') out.push(path(`M${X(-30)} ${Y(-6)} C${X(-32)} ${Y(-40)} ${X(32)} ${Y(-40)} ${X(30)} ${Y(-6)} C${X(24)} ${Y(-20)} ${X(-10)} ${Y(-24)} ${X(-30)} ${Y(-6)} Z`, hc, ink, 1.6 * k));
  if (o.hs === 'bun') out.push(circle(cx, Y(-36), 8 * k, hc, ink, 1.6 * k));
  if (o.wr) out.push(line(`M${X(-12)} ${Y(-17)} Q${X(0)} ${Y(-20)} ${X(12)} ${Y(-17)} M${X(-9)} ${Y(-13)} Q${X(0)} ${Y(-15.5)} ${X(9)} ${Y(-13)}`, C.skin2, 1.4 * k));
  // brows
  const brow = (s: -1 | 1, raise: number, tilt: number) => { const bx = 11 * s, by = -12 - raise; const inner = by + tilt * 0.9, outer = by - tilt * 0.9; return line(`M${X(bx - 6 * s)} ${Y(inner)} Q${X(bx)} ${Y(Math.min(inner, outer) - 1.6)} ${X(bx + 6 * s)} ${Y(outer)}`, hc === C.hair ? '#3b2f2f' : hc, 2.6 * k); };
  out.push(brow(-1, o.b ?? 0, o.ba ?? 0), brow(1, o.b2 ?? o.b ?? 0, o.ba2 ?? o.ba ?? 0));
  // eyes
  const eye = (s: -1 | 1) => {
    const ex = 11 * s, ey = -2, open = s > 0 ? (o.eo2 ?? o.eo ?? 1) : (o.eo ?? 1);
    if (o.happy) return path(`M${X(ex - 5)} ${Y(ey + 1.5)} Q${X(ex)} ${Y(ey - 4.5)} ${X(ex + 5)} ${Y(ey + 1.5)}`, 'none', ink, 2 * k);
    if ((o.wink && s > 0) || open <= 0.05) return path(`M${X(ex - 5)} ${Y(ey)} Q${X(ex)} ${Y(ey + 3.6)} ${X(ex + 5)} ${Y(ey)}`, 'none', ink, 2 * k);
    const ry = 4.6 * open, rx = 4.4 + Math.max(0, open - 1) * 1.6;
    const pupil = circle(X(ex + (o.px ?? 0) * 2.4), Y(ey + (o.py ?? 0) * 2.2 * Math.min(1, open)), 2.3 * k, ink, null);
    const lid = (o.lid ?? 0) > 0 ? path(`M${X(ex - rx - 0.6)} ${Y(ey)} A${f1(rx * k)} ${f1(ry * k)} 0 0 1 ${X(ex + rx + 0.6)} ${Y(ey)} L${X(ex + rx + 0.6)} ${Y(ey - ry + 2 * ry * (o.lid ?? 0))} L${X(ex - rx - 0.6)} ${Y(ey - ry + 2 * ry * (o.lid ?? 0))} Z`, sk, null) + line(`M${X(ex - rx)} ${Y(ey - ry + 2 * ry * (o.lid ?? 0))} L${X(ex + rx)} ${Y(ey - ry + 2 * ry * (o.lid ?? 0))}`, ink, 1.6 * k) : '';
    const gl = o.glint ? all(sparkle(Number(X(ex + 1.6)), Number(Y(ey - 1.6)), 2.4 * k, C.white)) : '';
    return all(ellipse(X(ex), Y(ey), rx * k, ry * k, C.white, ink, 1.3 * k), pupil, gl, lid);
  };
  out.push(eye(-1), eye(1));
  out.push(path(`M${X(0)} ${Y(1)} Q${X(-3)} ${Y(8)} ${X(0)} ${Y(8.6)}`, 'none', C.skin2, 1.6 * k));
  if (o.blush) out.push(ellipse(X(-18), Y(8), 5 * k, 3 * k, '#f29a9a', null), ellipse(X(18), Y(8), 5 * k, 3 * k, '#f29a9a', null));
  if (o.cheeks) out.push(ellipse(X(-15), Y(12), 6 * k, 5 * k, sk, null), circle(X(-15), Y(12), 6 * k, 'none', C.skin2, 1 * k), circle(X(15), Y(12), 6 * k, 'none', C.skin2, 1 * k));
  // mouth
  const my = 15, w = 10 * (o.mw ?? 1), c = o.mc ?? 0.4, sk2 = o.skew ?? 0;
  if (o.pout) out.push(ellipse(X(0), Y(my + 1), 5.2 * k, 4.2 * k, '#d86a7a', ink, 1.4 * k), ellipse(X(0), Y(my + 1), 1.8 * k, 1.4 * k, '#8a3040', null), line(`M${X(-8)} ${Y(my - 1)} l${f1(-2 * k)} ${f1(-1 * k)} M${X(8)} ${Y(my - 1)} l${f1(2 * k)} ${f1(-1 * k)} M${X(-7)} ${Y(my + 5)} l${f1(-2 * k)} ${f1(1 * k)} M${X(7)} ${Y(my + 5)} l${f1(2 * k)} ${f1(1 * k)}`, C.skin2, 1.2 * k));
  else if (o.press) out.push(line(`M${X(-w * 0.7)} ${Y(my + 1)} Q${X(0)} ${Y(my - 1)} ${X(w * 0.7)} ${Y(my + 1)}`, ink, 2.6 * k), line(`M${X(-w * 0.75)} ${Y(my - 1)} l${f1(-1.4 * k)} ${f1(2 * k)} M${X(w * 0.75)} ${Y(my - 1)} l${f1(1.4 * k)} ${f1(2 * k)}`, ink, 1.2 * k));
  else if ((o.mo ?? 0) > 0) { const h = 9 * (o.mo ?? 0); out.push(path(`M${X(-w)} ${Y(my - c * 4)} Q${X(0)} ${Y(my + c * 6 + h)} ${X(w)} ${Y(my - c * 4)} Q${X(0)} ${Y(my - h * 0.35)} ${X(-w)} ${Y(my - c * 4)} Z`, '#a83a4a', ink, 1.6 * k)); if (o.teeth) out.push(path(`M${X(-w * 0.7)} ${Y(my - c * 3 - h * 0.1)} Q${X(0)} ${Y(my - h * 0.3)} ${X(w * 0.7)} ${Y(my - c * 3 - h * 0.1)} L${X(w * 0.6)} ${Y(my - c * 2 + h * 0.15)} Q${X(0)} ${Y(my + h * 0.05)} ${X(-w * 0.6)} ${Y(my - c * 2 + h * 0.15)} Z`, C.white, null)); }
  else out.push(path(`M${X(-w)} ${Y(my - c * 4 - sk2 * 4)} Q${X(0)} ${Y(my + c * 6)} ${X(w)} ${Y(my - c * 4 + sk2 * 4)}`, 'none', ink, 2.2 * k));
  if (o.sweat) out.push(sweat(Number(X(24)), Number(Y(-16)), 1.2 * k));
  if (o.tears) out.push(tear(Number(X(-12)), Number(Y(4)), 1.1 * k), tear(Number(X(12)), Number(Y(6)), 1.1 * k));
  const body = all(...out);
  return o.tilt ? g(`rotate(${o.tilt} ${cx} ${cy})`, body) : body;
};
/** Face with neck and shoulders below (bust). */
const bust = (cx: number, cy: number, r: number, top: string, o: FaceO = {}) => { const k = r / 30; return all(path(`M${f1(cx - 46 * k)} ${f1(cy + 76 * k)} C${f1(cx - 44 * k)} ${f1(cy + 46 * k)} ${f1(cx - 26 * k)} ${f1(cy + 38 * k)} ${cx} ${f1(cy + 38 * k)} C${f1(cx + 26 * k)} ${f1(cy + 38 * k)} ${f1(cx + 44 * k)} ${f1(cy + 46 * k)} ${f1(cx + 46 * k)} ${f1(cy + 76 * k)} Z`, o.grey ? C.grey : top, C.ink, 2 * k), rect(cx - 7 * k, cy + 22 * k, 14 * k, 18 * k, o.grey ? C.grey2 : (o.skin ?? C.skin), 3 * k, C.ink, 1.6 * k), face(cx, cy, r, o)); };

// ── Posable figure ───────────────────────────────────────────────────
type FMood = 'smile' | 'frown' | 'calm' | 'sad' | 'angry' | 'shock' | 'flat' | 'laugh' | 'worried' | 'smirk' | 'open' | 'down' | 'closed' | 'squint';
type Pose = {
  n: Pt; h: Pt; side?: 0 | 1 | -1; arms?: [Pt, Pt][]; legs?: [Pt, Pt][]; top?: string; bot?: string; skin?: string; hair?: string; long?: boolean; bun?: boolean;
  mood?: FMood; head?: Pt; look?: Pt; sw?: number; hw?: number; grey?: boolean; skirt?: string; blush?: boolean; back?: boolean; hr?: number; noHand?: [boolean, boolean]; tilt?: number;
};
const limb = (pts: Pt[], col: string, w: number) => { const d = pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join(' '); return line(d, C.ink, w + 2.4) + line(d, col, w); };
const unit = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
const add = (a: Pt, b: Pt, s = 1): Pt => [a[0] + b[0] * s, a[1] + b[1] * s];
/** Small head with a simple face (front or side). */
const head = (c: Pt, r: number, o: { side?: 0 | 1 | -1; mood?: FMood; skin?: string; hair?: string; long?: boolean; bun?: boolean; look?: Pt; grey?: boolean; blush?: boolean; back?: boolean; tilt?: number }) => {
  const [x, y] = c, k = r / 10, ink = C.ink, sk = o.grey ? C.grey2 : (o.skin ?? C.skin), hc = o.grey ? C.grey : (o.hair ?? C.hair), s = o.side ?? 0, m = o.mood ?? 'smile';
  const out: Svg[] = [];
  if (o.long && s === 0 && !o.back) out.push(path(`M${f1(x - 10.5 * k)} ${f1(y - 2 * k)} C${f1(x - 13 * k)} ${f1(y + 10 * k)} ${f1(x - 12 * k)} ${f1(y + 13 * k)} ${f1(x - 7 * k)} ${f1(y + 13 * k)} L${f1(x - 6 * k)} ${f1(y + 4 * k)} Z M${f1(x + 10.5 * k)} ${f1(y - 2 * k)} C${f1(x + 13 * k)} ${f1(y + 10 * k)} ${f1(x + 12 * k)} ${f1(y + 13 * k)} ${f1(x + 7 * k)} ${f1(y + 13 * k)} L${f1(x + 6 * k)} ${f1(y + 4 * k)} Z`, hc, ink, 1.6));
  out.push(circle(x, y, r, sk, ink, 1.8));
  if (o.back) { out.push(path(`M${f1(x - r - 0.6)} ${f1(y + 3 * k)} C${f1(x - r - 1.4)} ${f1(y - r * 1.35)} ${f1(x + r + 1.4)} ${f1(y - r * 1.35)} ${f1(x + r + 0.6)} ${f1(y + 3 * k)} C${f1(x + r * 0.5)} ${f1(y + 9 * k)} ${f1(x - r * 0.5)} ${f1(y + 9 * k)} ${f1(x - r - 0.6)} ${f1(y + 3 * k)} Z`, hc, ink, 1.6)); if (o.long) out.push(path(`M${f1(x - r)} ${y} C${f1(x - r - 2)} ${f1(y + 14 * k)} ${f1(x + r + 2)} ${f1(y + 14 * k)} ${f1(x + r)} ${y} Z`, hc, ink, 1.6)); return all(...out); }
  if (s === 0) out.push(path(`M${f1(x - r)} ${f1(y - 2 * k)} C${f1(x - r)} ${f1(y - r * 1.45)} ${f1(x + r)} ${f1(y - r * 1.45)} ${f1(x + r)} ${f1(y - 2 * k)} C${f1(x + r * 0.6)} ${f1(y - 7 * k)} ${f1(x - r * 0.6)} ${f1(y - 7 * k)} ${f1(x - r)} ${f1(y - 2 * k)} Z`, hc, ink, 1.6));
  else out.push(path(`M${f1(x - s * r)} ${f1(y + 4 * k)} C${f1(x - s * r * 1.2)} ${f1(y - r * 1.3)} ${f1(x + s * r * 0.9)} ${f1(y - r * 1.4)} ${f1(x + s * r * 0.9)} ${f1(y - 4 * k)} C${f1(x + s * 2 * k)} ${f1(y - 7 * k)} ${f1(x - s * 2 * k)} ${f1(y - 3 * k)} ${f1(x - s * 3 * k)} ${f1(y + 4 * k)} Z`, hc, ink, 1.6), o.long ? path(`M${f1(x - s * r)} ${y} C${f1(x - s * r * 1.3)} ${f1(y + 12 * k)} ${f1(x - s * 2 * k)} ${f1(y + 14 * k)} ${f1(x - s * 2 * k)} ${f1(y + 6 * k)} Z`, hc, ink, 1.4) : '', path(`M${f1(x + s * r * 0.96)} ${f1(y - 1 * k)} l${f1(s * 3 * k)} ${f1(3 * k)} l${f1(-s * 3 * k)} ${f1(1 * k)}`, sk, ink, 1.2));
  if (o.bun) out.push(circle(f1(x - s * 6 * k), f1(y - r - 2 * k), 4 * k, hc, ink, 1.4));
  const lx = (o.look?.[0] ?? 0) * 1.2 * k, ly = (o.look?.[1] ?? 0) * 1.2 * k;
  const ex = s === 0 ? [-3.6, 3.6] : [s * 4.6];
  const eyeY = y - 0.5 * k;
  for (const e of ex) {
    const exx = x + e * k;
    if (m === 'laugh' || m === 'calm' || m === 'closed') out.push(path(m === 'closed' ? `M${f1(exx - 2 * k)} ${f1(eyeY)} Q${f1(exx)} ${f1(eyeY + 1.6 * k)} ${f1(exx + 2 * k)} ${f1(eyeY)}` : `M${f1(exx - 2 * k)} ${f1(eyeY + 0.6 * k)} Q${f1(exx)} ${f1(eyeY - 2.4 * k)} ${f1(exx + 2 * k)} ${f1(eyeY + 0.6 * k)}`, 'none', ink, 1.3));
    else if (m === 'shock') out.push(circle(f1(exx), f1(eyeY), 2 * k, C.white, ink, 0.9), circle(f1(exx + lx), f1(eyeY + ly), 0.9 * k, ink, null));
    else if (m === 'down') out.push(line(`M${f1(exx - 1.8 * k)} ${f1(eyeY + 1 * k)} L${f1(exx + 1.8 * k)} ${f1(eyeY + 1 * k)}`, ink, 1.3));
    else if (m === 'squint') out.push(line(`M${f1(exx - 2 * k)} ${f1(eyeY)} L${f1(exx + 2 * k)} ${f1(eyeY)}`, ink, 1.5));
    else out.push(circle(f1(exx + lx), f1(eyeY + ly), 1.25 * k, ink, null));
  }
  const bx = s === 0 ? [[-1, -3.6], [1, 3.6]] : [[s, s * 4.6]];
  for (const [d, e] of bx as [number, number][]) {
    const bxx = x + e * k, by = y - 4.6 * k;
    if (m === 'angry' || m === 'squint') out.push(line(`M${f1(bxx - d * 2.4 * k)} ${f1(by - 1.4 * k)} L${f1(bxx + d * 2 * k)} ${f1(by + 0.8 * k)}`, ink, 1.4));
    if (m === 'sad' || m === 'worried' || m === 'frown') out.push(line(`M${f1(bxx - d * 2.4 * k)} ${f1(by + 0.6 * k)} L${f1(bxx + d * 2 * k)} ${f1(by - 1 * k)}`, ink, 1.2));
    if (m === 'shock' || m === 'open') out.push(line(`M${f1(bxx - 2 * k)} ${f1(by - 1.4 * k)} Q${f1(bxx)} ${f1(by - 3 * k)} ${f1(bxx + 2 * k)} ${f1(by - 1.4 * k)}`, ink, 1.2));
  }
  const mx = x + (s === 0 ? 0 : s * 4 * k), my = y + 4.6 * k;
  if (m === 'frown' || m === 'sad' || m === 'angry') out.push(path(`M${f1(mx - 3 * k)} ${f1(my + 1 * k)} Q${f1(mx)} ${f1(my - 1.6 * k)} ${f1(mx + 3 * k)} ${f1(my + 1 * k)}`, 'none', ink, 1.3));
  else if (m === 'laugh') out.push(path(`M${f1(mx - 3.4 * k)} ${f1(my - 1 * k)} Q${f1(mx)} ${f1(my + 4.6 * k)} ${f1(mx + 3.4 * k)} ${f1(my - 1 * k)} Z`, '#c84a4a', ink, 1));
  else if (m === 'shock' || m === 'open') out.push(ellipse(f1(mx), f1(my + 0.6 * k), 1.6 * k, 2 * k, '#c84a4a', ink, 0.9));
  else if (m === 'flat' || m === 'down' || m === 'worried' || m === 'squint') out.push(line(`M${f1(mx - 2.6 * k)} ${f1(my)} L${f1(mx + 2.6 * k)} ${f1(my)}`, ink, 1.3));
  else if (m === 'smirk') out.push(path(`M${f1(mx - 3 * k)} ${f1(my)} Q${f1(mx + 1 * k)} ${f1(my + 1.6 * k)} ${f1(mx + 3.4 * k)} ${f1(my - 1.8 * k)}`, 'none', ink, 1.3));
  else if (m !== 'closed') out.push(path(`M${f1(mx - 3 * k)} ${f1(my - 0.8 * k)} Q${f1(mx)} ${f1(my + 2.2 * k)} ${f1(mx + 3 * k)} ${f1(my - 0.8 * k)}`, 'none', ink, 1.3));
  else out.push(path(`M${f1(mx - 2.4 * k)} ${f1(my - 0.4 * k)} Q${f1(mx)} ${f1(my + 1.6 * k)} ${f1(mx + 2.4 * k)} ${f1(my - 0.4 * k)}`, 'none', ink, 1.3));
  if (o.blush) out.push(ellipse(f1(x - 5.6 * k), f1(y + 2.4 * k), 2 * k, 1.2 * k, '#f08aa0', null), s === 0 ? ellipse(f1(x + 5.6 * k), f1(y + 2.4 * k), 2 * k, 1.2 * k, '#f08aa0', null) : '');
  const body = all(...out);
  return o.tilt ? g(`rotate(${o.tilt} ${x} ${y})`, body) : body;
};
/** A posable figure. n = neck base, h = hip centre; arms/legs as [elbow, hand] / [knee, foot], picture-left first. */
const pose = (p: Pose): Svg => {
  const grey = p.grey ?? false, top = grey ? C.grey : (p.top ?? C.sky), bot = grey ? C.grey : (p.bot ?? C.navy), sk = grey ? C.grey2 : (p.skin ?? C.skin);
  const s = p.side ?? 0, hr = p.hr ?? 9.5;
  const up = unit(p.h, p.n), perp: Pt = [-up[1], up[0]];
  const sw = p.sw ?? (s === 0 ? 12 : 3), hw = p.hw ?? (s === 0 ? 10 : 3);
  const sl = add(p.n, perp, sw), sr = add(p.n, perp, -sw), hl = add(p.h, perp, hw), hrr = add(p.h, perp, -hw);
  const shoulders: Pt[] = s === 0 ? (sl[0] < sr[0] ? [sl, sr] : [sr, sl]) : [p.n, p.n];
  const hips: Pt[] = s === 0 ? (hl[0] < hrr[0] ? [add(hl, perp, 0), hrr] : [hrr, hl]) : [p.h, p.h];
  const legStart = (i: number): Pt => s === 0 ? [hips[i]![0] + (i ? -4 : 4), hips[i]![1]] : p.h;
  const out: Svg[] = [];
  const armSvg = (i: number) => { const a = p.arms?.[i]; if (!a) return ''; const st = s === 0 ? add(shoulders[i]!, up, -3) : add(p.n, up, -3); return all(limb([st, a[0], a[1]], top, 6), p.noHand?.[i] ? '' : circle(f1(a[1][0]), f1(a[1][1]), 3.3, sk, C.ink, 1.3)); };
  const legSvg = (i: number) => { const l = p.legs?.[i]; if (!l) return ''; const st = legStart(i); const d = unit(l[0], l[1]); const fx = s === 0 ? (i ? 1 : -1) : s; return all(limb([st, l[0], l[1]], bot, 8), ellipse(f1(l[1][0] + fx * 3 - d[0] * 0), f1(l[1][1] + 1), 6, 3.4, grey ? C.grey : C.black, C.ink, 1.3)); };
  // far side first
  if (s !== 0) { out.push(g('opacity="1"', armSvg(1).replace(new RegExp(top, 'g'), shade(top))), legSvg(1).replace(new RegExp(bot, 'g'), shade(bot))); }
  if (p.skirt) out.push(legSvg(0), legSvg(1)); else out.push(legSvg(0), s === 0 ? legSvg(1) : '');
  // torso
  if (s === 0) out.push(path(`M${f1(shoulders[0]![0])} ${f1(shoulders[0]![1])} L${f1(shoulders[1]![0])} ${f1(shoulders[1]![1])} L${f1(hips[1]![0])} ${f1(hips[1]![1] + 2)} L${f1(hips[0]![0])} ${f1(hips[0]![1] + 2)} Z`, top, C.ink, 2));
  else out.push(line(`M${f1(p.h[0])} ${f1(p.h[1])} L${f1(p.n[0])} ${f1(p.n[1])}`, C.ink, 17.4), line(`M${f1(p.h[0])} ${f1(p.h[1])} L${f1(p.n[0])} ${f1(p.n[1])}`, top, 15));
  if (p.skirt) out.push(path(`M${f1(hips[0]![0] - 2)} ${f1(hips[0]![1] - 4)} L${f1(hips[1]![0] + 2)} ${f1(hips[1]![1] - 4)} L${f1(hips[1]![0] + 9)} ${f1(hips[1]![1] + 20)} L${f1(hips[0]![0] - 9)} ${f1(hips[0]![1] + 20)} Z`, p.skirt, C.ink, 1.8));
  if (s === 0) out.push(armSvg(0), armSvg(1)); else out.push(armSvg(0));
  const hc = p.head ?? add(p.n, up, hr + 1.5);
  out.push(line(`M${f1(p.n[0])} ${f1(p.n[1])} L${f1(hc[0])} ${f1(hc[1])}`, C.ink, 7.4), line(`M${f1(p.n[0])} ${f1(p.n[1])} L${f1(hc[0])} ${f1(hc[1])}`, sk, 5));
  out.push(head(hc, hr, { side: s, mood: p.mood, skin: sk, hair: p.hair, long: p.long, bun: p.bun, look: p.look, grey, blush: p.blush, back: p.back, tilt: p.tilt }));
  return all(...out);
};
const shade = (hex: string) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g2 = (n >> 8) & 255, b = n & 255; const d = (v: number) => Math.round(v * 0.8).toString(16).padStart(2, '0'); return `#${d(r)}${d(g2)}${d(b)}`; };
/** Standing front figure with arms hanging (posable defaults). */
const stand = (x: number, more: Partial<Pose> = {}) => pose({ n: [x, 50], h: [x, 80], arms: [[[x - 16, 66], [x - 18, 80]], [[x + 16, 66], [x + 18, 80]]], legs: [[[x - 6, 96], [x - 7, 110]], [[x + 6, 96], [x + 7, 110]]], ...more });
const BF_MOODS = ['smile', 'frown', 'angry', 'love', 'sleepy', 'shock', 'laugh', 'blush', 'sick', 'calm'];
/** Standing figure (figures.ts) with any face mood: blindFix moods directly, others drawn over the head. */
const F2 = (b: Build & { mood?: FMood | Mood; look?: Pt }): Svg => {
  if (!b.mood || (BF_MOODS.includes(b.mood) && !b.look)) return F(b as Build & { mood?: Mood });
  const s = 0.84 * (b.h ?? 1), x = b.x ?? 60, hy = 112 - 49 * s - 56 * s;
  return all(F({ ...b, mood: undefined }), head([x, hy], 10 * s, { mood: (BF_MOODS.includes(b.mood) ? (b.mood === 'blush' ? 'smile' : b.mood) : b.mood) as FMood, long: b.hairStyle === 'long', hair: b.hair, look: b.look, grey: b.grey, blush: b.mood === 'blush' }));
};
const fig = (x: number, top: string, mood: FMood | Mood = 'smile', more: Partial<Build> & { look?: Pt } = {}) => F2({ x, top, mood, ...more });

const crossA = (x: number, y = 62): [Pt, Pt][] => [[[x - 15, y], [x + 9, y + 5]], [[x + 15, y], [x - 9, y + 3]]];
const cards = (cx: number, cy: number) => all(...[-30, -10, 10, 30].map((a, i) => g(`rotate(${a} ${cx} ${cy + 30})`, rect(cx - 9, cy - 14, 18, 26, C.white, 2.4, C.ink, 1.4), i % 2 ? path(`M${cx} ${cy - 6} L${cx + 5} ${cy} L${cx} ${cy + 6} L${cx - 5} ${cy} Z`, RED, null) : heart(cx, cy, 0.5, RED))));
const battery = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -5, 18, 10, C.white, 2, C.ink, 1.3), rect(9, -2, 2.4, 4, C.ink, 0.6, null), rect(-7, -3, 3.4, 6, RED, 0.6, null));
const banana = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 2 C-4 6 4 6 8 2 L6 0 C2 3 -2 3 -6 0 Z', '#f2d04a', C.ink, 1.2), path('M-6 0 L-10 -4 M6 0 L10 -4', 'none', '#f2d04a', 2.4));
const rays = (x: number, y: number, r1: number, r2: number, n = 10, col: string = C.gold) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, 2.2); }));
const giftB = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 18, '#e85a7a', 2, C.ink, 1.4), rect(-2.4, -8, 4.8, 18, C.yellow, 0, null), rect(-14, -13, 28, 6, '#e85a7a', 2, C.ink, 1.4), path('M0 -13 C-7 -21 -12 -14 0 -13 C7 -21 12 -14 0 -13', 'none', C.yellow, 2));
const yarn = (x: number, y: number) => all(path(`M${x + 8} ${y + 4} C${x + 20} ${y + 14} ${x - 30} ${y + 18} ${x - 22} ${y + 4} C${x - 16} ${y - 6} ${x - 34} ${y - 4} ${x - 30} ${y + 10}`, 'none', '#e85a7a', 1.4), circle(x, y, 9, '#e85a7a', C.ink, 1.4), path(`M${x - 7} ${y - 4} Q${x} ${y + 2} ${x + 7} ${y - 5} M${x - 8} ${y + 2} Q${x} ${y + 7} ${x + 6} ${y + 5}`, 'none', '#b03a5a', 1));
const kitten = (x: number, y: number) => g(`translate(${x} ${y})`, path('M8 -2 C16 -6 16 -14 12 -16', 'none', C.ink, 3.4), path('M8 -2 C16 -6 16 -14 12 -16', 'none', C.orange, 2), ellipse(0, 0, 10, 6, C.orange, C.ink, 1.4), circle(-10, -6, 6, C.orange, C.ink, 1.4), path('M-15 -9 L-14 -15 L-11 -11 Z M-8 -11 L-5 -15 L-5 -8 Z', C.orange, C.ink, 1), circle(-12, -7, 0.9, C.ink, null), circle(-8.6, -7, 0.9, C.ink, null), line('M-6 4 L-6 8 M5 4 L5 8', C.ink, 1.6));
const cloudS = (x: number, y: number, s = 1, col = '#8a92a0') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.4));
const medal = (x: number, y: number) => all(path(`M${x - 4} ${y - 10} L${x} ${y} L${x + 4} ${y - 10}`, 'none', C.navy, 2.4), circle(x, y + 3, 4, C.gold, C.ink, 1.2));
const dogS = (x: number, y: number, sad = true) => g(`translate(${x} ${y})`, path('M10 -6 C14 -4 16 0 18 4', 'none', C.ink, 3.4), path('M10 -6 C14 -4 16 0 18 4', 'none', C.tan, 2), line('M-8 -2 L-9 8 M-3 -2 L-3 8 M4 -2 L4 8 M8 -3 L9 8', C.ink, 3), ellipse(0, -6, 12, 7, C.tan, C.ink, 1.4), circle(-13, sad ? -6 : -12, 6.4, C.tan, C.ink, 1.4), path(sad ? 'M-17 -10 C-22 -6 -21 4 -17 3 Z M-10 -11 C-6 -6 -8 3 -11 2 Z' : 'M-17 -16 L-19 -24 L-13 -18 Z', '#a0673d', C.ink, 1.2), circle(-15, sad ? -5 : -12, 0.9, C.ink, null), circle(-11, sad ? -5 : -12, 0.9, C.ink, null), circle(-13, sad ? -1.4 : -8, 1.4, C.ink, null));
const zig = (x: number, y: number, col: string = HL) => line(`M${x} ${y} l3 -3 l3 3 l3 -3 l3 3`, col, 1.6);
const pockets = (x: number) => line(`M${x - 10} 82 l3 6 M${x + 10} 82 l-3 6`, C.ink, 1.4);
const busSign = (x: number) => all(line(`M${x} 112 L${x} 50`, C.grey, 2.4), circle(x, 42, 10, '#f2c14e', C.ink, 1.4), rect(x - 6, 36, 12, 9, '#2f6ab8', 1.6, C.ink, 0.9), rect(x - 4.4, 37.6, 8.8, 3.4, '#bfe3f5', 0.6, null), circle(x - 3.4, 46, 1.2, C.ink, null), circle(x + 3.4, 46, 1.2, C.ink, null));
const table2 = (x1: number, x2: number, y = 78) => all(rect(x1, y, x2 - x1, 5, C.tan, 2, C.ink, 1.6), line(`M${(x1 + x2) / 2} ${y + 5} L${(x1 + x2) / 2} 110 M${(x1 + x2) / 2 - 10} 111 L${(x1 + x2) / 2 + 10} 111`, C.brown, 3));
const stool = (x: number) => all(rect(x - 12, 80, 24, 5, C.brown, 2, C.ink, 1.4), line(`M${x - 9} 85 L${x - 11} 112 M${x + 9} 85 L${x + 11} 112`, C.brown, 3));
const inward = (x: number, y: number, r: number) => all(arrow(x - r - 14, y, x - r, y, HL, 2), arrow(x + r + 14, y, x + r, y, HL, 2), arrow(x, y - r - 14, x, y - r, HL, 2));
const eyeLine = (x1: number, y1: number, x2: number, y2: number, col: string = HL) => dash(`M${x1} ${y1} L${x2} ${y2}`, col, 1.6, '3 3');
const eyeArrow = (x1: number, y1: number, x2: number, y2: number, col: string = HL) => all(dash(`M${x1} ${y1} L${x2} ${y2}`, col, 1.6, '3 3'), arrow(x2 - (x2 - x1) * 0.01, y2 - (y2 - y1) * 0.01, x2, y2, col, 1.6));
/** Big hand seen from the palm side; f = [thumb, index, middle, ring, little] (true = straight). */
const bigHand = (x: number, y: number, s: number, rot: number, f: [boolean, boolean, boolean, boolean, boolean], sleeve: string = C.sky) => {
  const xs = [-9, -3, 3, 9], lens = [17, 19, 17, 13];
  const fingers = xs.map((dx, i) => f[i + 1] ? rect(dx - 2.8 + (i === 0 ? -1 : i === 3 ? 1 : 0) * 0, -10 - lens[i]!, 5.6, lens[i]! + 6, C.skin, 2.8, C.ink, 1.3) : rect(dx - 2.8, -14, 5.6, 8, C.skin, 2.8, C.ink, 1.3));
  const thumb = f[0] ? path('M-12 2 L-21 -10 C-23 -13 -19 -16 -17 -13 L-9 -4 Z', C.skin, C.ink, 1.3) : path('M-12 4 C-6 0 0 -2 4 -4 C6 -1 2 2 -2 4 Z', C.skin, C.ink, 1.3);
  return g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-10, 10, 20, 16, sleeve, 2, C.ink, 1.4), ...fingers, rect(-12, -10, 24, 22, C.skin, 6, C.ink, 1.4), f[0] ? thumb : '', f[0] ? '' : thumb, line('M-6 4 Q0 6 6 3', C.skin2, 1));
};
/** Thumb-up fist (down = rotated); seen from the side. */
const thumbFist = (x: number, y: number, s = 1, down = false, sleeve: string = C.sky) => g(`translate(${x} ${y}) scale(${s}) rotate(${down ? 180 : 0})`, rect(-8, 10, 16, 14, sleeve, 2, C.ink, 1.4), rect(-10, -6, 20, 18, C.skin, 5, C.ink, 1.4), line('M-10 0 L8 0 M-10 5 L8 5', C.ink, 1), rect(-8, -22, 7, 18, C.skin, 3.5, C.ink, 1.4));
const house2 = (x: number, col: string) => all(rect(x - 16, 74, 32, 38, col, 1, C.ink, 1.6), path(`M${x - 20} 76 L${x} 58 L${x + 20} 76 Z`, '#8a3a2a', C.ink, 1.6), rect(x - 5, 92, 10, 20, C.brown, 1, C.ink, 1.2));
const globeS = (x: number, y: number, r: number) => all(circle(x, y, r, '#bfe3f5', C.ink, 2), path(`M${x - r * 0.6} ${y - r * 0.5} C${x - r * 0.2} ${y - r * 0.7} ${x} ${y - r * 0.2} ${x - r * 0.3} ${y + r * 0.1} C${x - r * 0.6} ${y + r * 0.3} ${x - r * 0.8} ${y} ${x - r * 0.6} ${y - r * 0.5} Z`, GOOD, C.ink, 1.2), path(`M${x + r * 0.2} ${y - r * 0.2} C${x + r * 0.6} ${y - r * 0.4} ${x + r * 0.8} ${y + r * 0.2} ${x + r * 0.4} ${y + r * 0.6} C${x + r * 0.1} ${y + r * 0.5} ${x} ${y + r * 0.1} ${x + r * 0.2} ${y - r * 0.2} Z`, GOOD, C.ink, 1.2));
const smiley = (x: number, y: number, r: number, col: string = C.yellow, sad = false) => all(circle(x, y, r, col, C.ink, 1.1), circle(x - r * 0.35, y - r * 0.2, r * 0.13, C.ink, null), circle(x + r * 0.35, y - r * 0.2, r * 0.13, C.ink, null), path(sad ? `M${x - r * 0.42} ${y + r * 0.55} Q${x} ${y + r * 0.15} ${x + r * 0.42} ${y + r * 0.55}` : `M${x - r * 0.45} ${y + r * 0.2} Q${x} ${y + r * 0.7} ${x + r * 0.45} ${y + r * 0.2}`, 'none', C.ink, 1.1));
const bolt = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const mag = (x: number, y: number, r: number, inner: Svg = '') => all(circle(x, y, r, 'rgba(255,255,255,0.75)', C.navy, 3), inner, line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.4)} ${f1(y + r * 1.4)}`, C.navy, 5));
const coat = (x: number, y: number, col: string) => path(`M${x - 6} ${y} L${x + 6} ${y} L${x + 9} ${y + 20} L${x - 9} ${y + 20} Z`, col, C.ink, 1.2);
const mask = (x: number, y: number, r: number) => all(ellipse(x, y, r, r * 1.15, C.white, C.ink, 1.6), path(`M${x - r * 0.55} ${y - r * 0.2} q${r * 0.2} ${-r * 0.25} ${r * 0.4} 0 M${x + r * 0.15} ${y - r * 0.2} q${r * 0.2} ${-r * 0.25} ${r * 0.4} 0`, 'none', C.ink, 1.6), path(`M${x - r * 0.5} ${y + r * 0.35} Q${x} ${y + r * 0.85} ${x + r * 0.5} ${y + r * 0.35}`, 'none', C.ink, 1.8));

export const NONVERBAL_MOTIFS: Record<string, Svg> = {
  // ── 1141 Ansiktsuttryck ───────────────────────────────────────────
  'gest.mimik': all(face(20, 60, 15, { happy: true, mc: 0.9, mo: 0.6, b: 2 }), face(60, 60, 15, { b: 7, eo: 1.4, mc: 0, mo: 0.6, mw: 0.5 }), face(100, 60, 15, { b: -2, ba: 6, mc: -0.7, mw: 0.8 }), arrow(34, 38, 46, 38, HL, 2), arrow(74, 38, 86, 38, HL, 2), path('M96 84 Q60 104 24 84', 'none', HL, 2), arrow(28, 86.5, 24, 84, HL, 2)),
  'gest.uttrycksfull': all(greyed(face(22, 76, 15, { mc: 0.15, mw: 0.7 })), face(76, 58, 34, { b: 6, eo: 1.3, mc: 1, mo: 0.9, teeth: true, blush: true }), sparkle(110, 22, 5), sparkle(44, 20, 4), sparkle(110, 94, 4), line('M54 20 l-4 -5 M64 15 l-1 -6 M88 15 l1 -6 M98 20 l4 -5', HL, 1.6)),
  'gest.uttryckslös': all(face(60, 60, 40, { eo: 0.9, mc: 0, mw: 0.8 }), qm(106, 24, 16)),
  'gest.pokeransikte': all(bust(60, 40, 26, C.navy, { eo: 0.9, mc: 0, mw: 0.7, lid: 0.15 }), cards(60, 90), circle(44, 112, 5, C.skin, C.ink, 1.3), circle(76, 112, 5, C.skin, C.ink, 1.3)),
  'gest.hålla-masken': all(face(40, 52, 30, { b: 2, ba: -2, eo: 0.6, press: true, cheeks: true, mw: 0.7, blush: true }), tear(24, 54, 1), ground, g('rotate(-40 100 110)', F2({ x: 100, h: 0.46, top: C.yellow, mood: 'shock' })), banana(110, 109, 0.8), motion(84, 98, -1, 3, 5)),
  'gest.dra-på-munnen': all(face(60, 58, 40, { mc: 0.25, mw: 0.9 }), arrow(39, 92, 44, 80, HL, 2), arrow(81, 92, 76, 80, HL, 2)),
  'gest.skina-upp': all(greyed(face(22, 44, 15, { mc: -0.1, mw: 0.6 })), arrow(38, 50, 50, 56, HL, 2.4), rays(82, 54, 32, 40, 14), face(82, 54, 29, { happy: true, b: 4, mc: 1, mo: 0.8, teeth: true, blush: true }), giftB(24, 96, 1.1)),
  'gest.spärra-upp-ögonen': all(face(60, 62, 40, { b: 8, eo: 1.5, mc: 0, mo: 0.5, mw: 0.5 }), arrow(42, 46, 24, 30, HL, 2), arrow(78, 46, 96, 30, HL, 2)),
  'gest.pluta-med-munnen': all(path('M22 120 C24 100 40 94 60 94 C80 94 96 100 98 120 Z', C.pink, C.ink, 1.8), face(60, 54, 34, { b: -1, ba: 3, pout: true, px: 0.7 })),
  'gest.bister': all(bust(60, 50, 30, C.dark, { b: -3, ba: 5, mc: -0.5, mw: 0.8, wr: true, lid: 0.25 }), path('M56 90 L64 90 L66 112 L60 117 L54 112 Z', C.red, C.ink, 1.2)),
  'gest.road': all(face(42, 52, 30, { b: 1, b2: 5, lid: 0.15, mc: 0.6, skew: 0.5, mw: 0.8, px: 1, py: 0.8 }), ground, yarn(78, 102), kitten(100, 104)),
  'gest.förnärmad': all(face(52, 58, 34, { tilt: -14, b: 3, eo: 0, mc: -0.4, mw: 0.45 }), line('M92 34 l8 -3 M94 42 l9 0 M92 50 l8 3', HL, 1.8), g('translate(98 100)', ellipse(0, 6, 15, 4, C.white, C.ink, 1.4), path('M-11 4 L-11 -6 L11 -6 L11 4 Z', '#f6d8a8', C.ink, 1.4), path('M-11 -6 L11 -6 L11 -2 L-11 -2 Z', '#e85a7a', null), circle(0, -9, 2.4, RED, C.ink, 0.8))),
  'gest.påklistrad': all(face(60, 56, 40, { b: 2, ba: -3, lid: 0.45, mc: 0, mw: 0.01 }), g('rotate(-6 60 76)', rect(40, 66, 40, 20, '#fbf6dc', 2, C.ink, 1.2), path('M73 86 L80 79 L80 86 Z', '#e8dfb8', C.ink, 1), path('M46 71 Q60 86 74 71', 'none', C.ink, 2.6))),
  'gest.stå-skrivet-i-ansiktet': all(face(60, 62, 40, { b: 0, ba: -3, lid: 0.55, mc: -0.3, mw: 0.7 }), battery(60, 37, 1.3)),
  // ── 1142 Kroppshållning ──────────────────────────────────────────
  'gest.räta-på-ryggen': all(ground, greyed(stool(30), pose({ side: 1, h: [26, 80], n: [38, 60], head: [46, 62], mood: 'down', arms: [[[42, 70], [46, 78]], [[42, 70], [46, 78]]], legs: [[[46, 82], [48, 110]], [[46, 82], [48, 110]]] })), stool(84), pose({ side: 1, h: [80, 80], n: [81, 50], top: C.green, mood: 'smile', arms: [[[84, 64], [96, 76]], [[84, 64], [96, 76]]], legs: [[[100, 82], [102, 110]], [[100, 82], [102, 110]]] }), arrow(68, 84, 68, 40, HL, 2.6), path('M40 40 Q52 22 66 30', 'none', HL, 2), arrow(62, 27.6, 66, 30, HL, 2)),
  'gest.hålla-huvudet-högt': all(ground, pose({ side: 1, h: [58, 80], n: [60, 49], head: [63, 36], tilt: -18, top: C.orange, long: true, mood: 'smile', arms: [[[66, 62], [72, 76]], [[52, 62], [46, 76]]], legs: [[[66, 96], [70, 110]], [[52, 96], [46, 110]]] }), medal(64, 56), arrow(80, 40, 88, 20, HL, 2.2)),
  'gest.hänga-med-huvudet': all(ground, pose({ side: 1, h: [56, 80], n: [64, 54], head: [72, 58], top: C.sky, mood: 'sad', arms: [[[68, 68], [70, 82]], [[66, 68], [66, 82]]], legs: [[[58, 96], [60, 110]], [[54, 96], [52, 110]]] }), cloudS(80, 20, 0.9), line('M70 30 l-2 5 M78 30 l-2 5 M86 30 l-2 5', '#5aa7e8', 1.6), arrow(92, 50, 92, 70, HL, 2)),
  'gest.slokörad': all(ground, pose({ side: 1, h: [40, 80], n: [48, 54], head: [56, 58], top: '#7a8ab8', mood: 'sad', arms: [[[52, 68], [54, 82]], [[50, 68], [50, 82]]], legs: [[[44, 96], [46, 110]], [[38, 96], [36, 110]]] }), dogS(94, 102), cloudS(70, 18, 0.8)),
  'gest.dra-upp-axlarna': all(ground, stand(60, { n: [60, 54], head: [60, 46], h: [60, 82], sw: 14, top: C.lilac, mood: 'worried', arms: [[[42, 70], [44, 84]], [[78, 70], [76, 84]]] }), arrow(30, 70, 30, 48, HL, 2.2), arrow(90, 70, 90, 48, HL, 2.2), path('M46 58 C44 48 48 44 52 46 L54 56 Z M74 58 C76 48 72 44 68 46 L66 56 Z', C.lilac, C.ink, 1.6), zig(8, 40), zig(100, 40)),
  'gest.sänka-axlarna': all(ground, stand(60, { n: [60, 54], head: [60, 40], h: [60, 82], sw: 13, top: C.mint, mood: 'calm', arms: [[[43, 72], [43, 88]], [[77, 72], [77, 88]]] }), arrow(30, 44, 30, 64, HL, 2.2), arrow(90, 44, 90, 64, HL, 2.2), path('M72 40 C80 38 84 42 92 38', 'none', '#9ad0f0', 2)),
  'gest.luta-sig-fram': all(ground, table2(48, 80, 78), chair(24, 112, 1), pose({ side: 1, h: [26, 80], n: [44, 56], head: [53, 48], top: C.orange, long: true, mood: 'open', arms: [[[50, 70], [60, 76]], [[50, 70], [60, 76]]], legs: [[[42, 84], [42, 110]], [[42, 84], [42, 110]]] }), chair(98, 112, -1), pose({ side: -1, h: [96, 80], n: [96, 50], top: C.green, mood: 'smile', arms: [[[90, 64], [82, 74]], [[90, 64], [82, 74]]], legs: [[[82, 84], [82, 110]], [[82, 84], [82, 110]]] }), say(98, 14, 26, 16, 96, 28, wave(98, 14, [2, 4, 3, 5, 2])), arrow(26, 40, 40, 36, HL, 2)),
  'gest.luta-sig-tillbaka': all(ground, chair(58, 112, 1), pose({ side: 1, n: [44, 52], h: [56, 80], top: C.green, mood: 'calm', head: [40, 40], arms: [[[30, 44], [36, 32]], [[32, 46], [38, 32]]], legs: [[[78, 82], [86, 110]], [[80, 84], [90, 110]]] }), arrow(64, 40, 50, 30, HL, 2)),
  'gest.med-händerna-i-sidorna': all(ground, stand(60, { top: C.orange, long: true, mood: 'angry', arms: [[[38, 66], [48, 80]], [[82, 66], [72, 80]]] })),
  'gest.med-händerna-i-fickorna': all(ground, busSign(100), stand(52, { top: C.green, mood: 'flat', noHand: [true, true], arms: [[[36, 68], [44, 84]], [[68, 68], [60, 84]]] }), pockets(52)),
  'gest.bredbent': all(ground, greyed(stand(28, { mood: 'flat' })), stand(84, { top: C.dark, bot: C.dark, mood: 'flat', legs: [[[70, 96], [62, 110]], [[98, 96], [106, 110]]] })),
  'gest.göra-sig-liten': all(ground, chair(60, 112, 1), pose({ side: 1, h: [58, 82], n: [66, 64], head: [74, 66], hr: 8, top: C.sky, mood: 'worried', arms: [[[74, 76], [80, 72]], [[74, 76], [80, 72]]], legs: [[[80, 68], [78, 96]], [[80, 68], [78, 96]]] }), inward(66, 76, 26)),
  'gest.skruva-på-sig': all(ground, chair(60, 112, 1), pose({ n: [58, 54], h: [60, 82], top: C.orange, mood: 'worried', arms: [[[46, 72], [54, 84]], [[74, 70], [66, 84]]], legs: [[[50, 90], [44, 110]], [[70, 90], [72, 110]]] }), sweat(74, 34, 1.2), line('M32 70 q-4 6 0 12 M26 66 q-5 10 0 20 M88 70 q4 6 0 12 M94 66 q5 10 0 20', HL, 1.6), say(98, 16, 22, 16, 72, 32, qm(98, 16, 12))),
  'gest.sluten': all(ground, greyed(stand(28, { mood: 'smile', arms: [[[14, 60], [8, 48]], [[42, 60], [48, 48]]] })), stand(84, { top: C.navy, mood: 'flat', look: [1.6, 0], arms: crossA(84), legs: [[[87, 96], [91, 110]], [[81, 96], [77, 110]]] })),
  'gest.vända-ryggen-till': all(ground, stand(30, { top: C.orange, long: true, mood: 'sad', arms: [[[18, 66], [16, 80]], [[44, 60], [54, 56]]] }), stand(86, { back: true, top: C.green, arms: [[[72, 66], [70, 80]], [[100, 66], [102, 80]]] }), arrow(100, 26, 114, 26, HL, 2)),
  // ── 1143 Blick och ögonkontakt ───────────────────────────────────
  'gest.möta-blicken': all(bust(30, 52, 21, C.orange, { hs: 'long', px: 1, mc: 0.4, mw: 0.7 }), bust(90, 52, 21, C.green, { px: -1, mc: 0.4, mw: 0.7 }), dash('M47 50 L73 50', HL, 1.8, '3 3'), arrow(56, 50, 47.5, 50, HL, 1.8), arrow(64, 50, 72.5, 50, HL, 1.8)),
  'gest.kasta-en-blick': all(bust(40, 60, 26, C.sky, { px: 1, py: -0.8, mc: 0.2, mw: 0.7 }), clock(98, 26, 13, [-60, -90]), eyeArrow(62, 50, 84, 34), line('M74 50 l6 -2 M76 56 l6 -1', HL, 1.4)),
  'gest.glo': all(bust(36, 54, 26, C.yellow, { b: 4, eo: 1.3, px: 1, mo: 0.4, mw: 0.45, mc: 0 }), ground, fig(94, '#c7b3e6', 'frown', { hairStyle: 'long' }), sweat(106, 26, 1), eyeLine(58, 50, 88, 46), eyeLine(58, 54, 86, 70)),
  'gest.slå-ner-blicken': all(ground, face(60, 50, 36, { tilt: 10, b: 1, ba: -3, eo: 0.8, lid: 0.4, py: 1, mc: 0.1, mw: 0.5, blush: true }), dash('M48 56 L40 110', HL, 1.6, '3 3'), dash('M72 58 L66 110', HL, 1.6, '3 3'), arrow(41, 105, 40, 110, HL, 1.6), arrow(66.6, 105, 66, 110, HL, 1.6)),
  'gest.titta-bort': all(ground, fig(18, C.green, 'smile'), arm(29, 40, 33, 22), circle(33, 21, 3, C.skin, C.ink, 1.2), path('M38 14 q4 6 0 12', 'none', HL, 1.4), bust(74, 56, 26, C.orange, { hs: 'long', px: 1.2, py: -0.2, mc: 0, mw: 0.6 }), arrow(98, 40, 116, 32, HL, 2.2)),
  'gest.undvikande': all(ground, fig(22, C.green, 'smile'), say(24, 18, 22, 18, 26, 38, qm(24, 18, 13)), bust(82, 56, 26, C.lilac, { px: 1.1, py: -1, b: 1, ba: -2, mc: -0.1, mw: 0.6, sweat: true }), dash('M100 46 C108 40 110 30 116 26', HL, 1.6, '3 3'), arrow(113, 28, 116, 26, HL, 1.6)),
  'gest.titta-snett-på': all(ground, F2({ x: 22, h: 0.62, top: C.yellow, mood: 'laugh' }), F2({ x: 44, h: 0.6, top: C.red, mood: 'laugh' }), shout(32, 24, 14, 10, 30, 44, line('M26 24 l4 -4 l4 4 l4 -4', C.ink, 1.4)), bust(88, 58, 24, C.navy, { hs: 'bun', px: -1.2, b: -1, ba: 4, lid: 0.3, mc: -0.4, mw: 0.6 }), eyeLine(70, 54, 50, 62)),
  'gest.spänna-ögonen-i': all(bust(36, 52, 26, C.dark, { b: -2, ba: 5, eo: 1.1, px: 1, mc: -0.2, mw: 0.6 }), ground, F2({ x: 98, h: 0.62, top: C.sky, mood: 'shock' }), line('M54 46 L92 62 M56 52 L92 66', HL, 2.2), sweat(108, 56, 0.9)),
  'gest.genomträngande': all(face(34, 58, 28, { b: -1, ba: 3, eo: 0.8, lid: 0.25, glint: true, mc: 0, mw: 0.6 }), rect(78, 18, 12, 84, '#c86a4a', 1, C.ink, 1.6), line('M78 32 L90 32 M78 46 L90 46 M78 60 L90 60 M78 74 L90 74 M78 88 L90 88 M84 18 L84 32 M84 46 L84 60 M84 74 L84 88', C.ink, 1), line('M46 54 L116 46 M46 56 L116 62', '#f2c14e', 2.6), circle(84, 50, 3.6, C.paper, C.ink, 1), circle(84, 59, 3.6, C.paper, C.ink, 1)),
  'gest.betrakta': all(ground, rect(70, 20, 42, 32, '#c8925a', 2, C.ink, 1.6), rect(74, 24, 34, 24, '#bfe3f5', 1, null), path('M74 48 L86 34 L94 42 L100 36 L108 48 Z', GOOD, C.ink, 1), circle(100, 30, 3, C.yellow, null), bench(10, 56, 86), pose({ side: 1, h: [30, 82], n: [32, 54], top: C.orange, long: true, mood: 'calm', look: [1, -1], arms: [[[40, 70], [40, 50]], [[40, 70], [40, 52]]], legs: [[[46, 84], [46, 110]], [[46, 84], [46, 110]]] }), dash('M44 40 L70 36', HL, 1.4, '2 3'), clock(18, 22, 9, [-30, 120])),
  'gest.blinka-åt': all(face(60, 60, 40, { wink: true, mc: 0.7, skew: 0.5, mw: 0.8, b2: -1 }), sparkle(100, 34, 6), sparkle(108, 50, 3.4)),
  'gest.ögonvrå': all(path('M8 62 C30 30 90 30 112 62 C90 90 30 90 8 62 Z', C.white, C.ink, 2.6), circle(84, 62, 15, '#7a5a3a', C.ink, 1.6), circle(84, 62, 7, C.ink, null), circle(88, 57, 2.6, C.white, null), path('M8 62 C30 30 90 30 112 62', 'none', C.ink, 4), path('M14 40 C40 18 84 16 108 34', 'none', '#3b2f2f', 4), circle(108, 62, 9, 'none', HL, 2.6), arrow(108, 96, 108, 74, HL, 2.4)),
  'gest.med-glimten-i-ögat': all(face(60, 60, 40, { b: 3, glint: true, eo: 1.05, lid: 0.12, mc: 0.6, skew: 0.6, mw: 0.8 }), sparkle(22, 50, 5), sparkle(98, 50, 5), sparkle(104, 24, 4)),
  // ── 1144 Tonfall och betoning ────────────────────────────────────
  'gest.röstläge': all(ground, F2({ x: 20, h: 0.6, top: C.yellow, mood: 'laugh' }), F2({ x: 100, top: C.navy, mood: 'smile' }), rect(54, 16, 12, 92, C.white, 4, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M56 ${26 + i * 12} L64 ${26 + i * 12}`, C.grey, 1.2)), noteI(60, 26, 1.1, HL), noteI(60, 98, 1.1, C.navy), dash('M26 66 C34 40 44 28 52 26', C.yellow, 1.8, '3 3'), dash('M88 34 C80 60 74 92 68 98', C.navy, 1.8, '3 3')),
  'gest.betona': all(bust(28, 66, 20, C.green, { mo: 0.7, mw: 0.6, mc: 0.2, b: 3 }), say(80, 40, 64, 46, 46, 62, all(rect(56, 46, 14, 10, C.grey2, 2, C.ink, 1.2), rect(76, 32, 26, 24, HL, 3, C.ink, 1.6), line('M86 28 L94 20', C.ink, 2.4), path('M64 26 C66 20 74 20 78 24 L76 26 C72 23 68 24 66 27 Z', '#f2d04a', C.ink, 1)))),
  'gest.betoning': all(...[[22, 6], [40, 6], [60, 22], [80, 6], [98, 6]].map(([x, h], i) => rect(x! - 7, 70 - h!, 14, h! * 2, i === 2 ? HL : C.grey2, 3, C.ink, 1.4)), line('M56 34 L66 22', C.ink, 3)),
  'gest.satsmelodi': all(bust(26, 70, 20, C.orange, { hs: 'long', mo: 0.5, mw: 0.6, mc: 0.3 }), say(80, 40, 64, 44, 46, 64, all(melody(80, 42, [-6, 4, 10, 2, -4, 6, -8], 8, HL), noteI(58, 30, 0.8), noteI(98, 26, 0.8))), flagSE(104, 100, 1.2)),
  'gest.sänka-rösten': all(ground, fig(28, C.orange, 'smile', { hairStyle: 'long' }), fig(70, C.green, 'smile'), say(48, 16, 34, 16, 34, 30, all(wave(44, 16, [6, 5, 4, 3, 2, 1], 4, C.navy), arrow(60, 10, 60, 22, HL, 1.6)))),
  'gest.lågmäld': all(ground, greyed(F2({ x: 24, top: C.red, mood: 'angry' }), shout(30, 22, 18, 12, 28, 36, wave(30, 22, [3, 7, 9, 7, 3], 3.6, C.ink))), fig(84, C.mint, 'calm'), say(92, 24, 22, 14, 88, 36, wave(92, 24, [1, 2, 1.5, 2, 1], 3, C.navy, 1.4))),
  'gest.gäll.2': all(ground, F2({ x: 30, h: 0.66, top: C.red, mood: 'shock' }), line('M42 48 l6 -4 l2 6 l6 -4 l2 6 l6 -4 M42 58 l6 -2 l2 6 l6 -2 l2 6 l6 -2 M40 38 l6 -6 l2 6 l6 -6', '#e8302c', 1.8), bust(92, 56, 22, C.sky, { eo: 0, b: -1, ba: 3, mc: -0.5, mw: 0.5 }), circle(70, 58, 6, C.skin, C.ink, 1.3), circle(114, 58, 6, C.skin, C.ink, 1.3)),
  'gest.monoton': all(ground, fig(26, C.navy, 'flat'), say(64, 20, 54, 18, 38, 30, line('M42 20 L86 20', C.navy, 2.4)), chair(94, 112, -1), pose({ side: -1, h: [96, 80], n: [98, 54], head: [100, 46], tilt: 20, top: C.orange, mood: 'closed', arms: [[[92, 66], [84, 76]], [[92, 66], [84, 76]]], legs: [[[82, 82], [82, 110]], [[82, 82], [82, 110]]] }), circle(110, 34, 2.4, C.white, C.ink, 1), circle(114, 26, 3.4, C.white, C.ink, 1)),
  'gest.frågande': all(face(54, 62, 38, { tilt: -12, b: 2, b2: 8, ba2: -1, px: 0.6, py: -0.4, mc: 0, mw: 0.45 }), qm(104, 34, 26, HL)),
  'gest.darra-på-rösten': all(ground, heart(100, 18, 1.1), F2({ x: 44, top: C.lilac, hairStyle: 'long', mood: 'frown' }), tear(40, 44, 0.8), line('M70 112 L70 46', C.dark, 2.4), rect(66, 40, 8, 10, C.dark, 3, C.ink, 1.2), path('M76 30 q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0 M76 38 q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0', 'none', HL, 1.8), rect(48, 60, 14, 18, C.white, 1, C.ink, 1.2), line('M36 62 l-4 0 M36 68 l-5 0 M66 70 l4 0', HL, 1.2)),
  'gest.konstpaus': all(rect(0, 92, 120, 28, '#c86a4a', 0, null), F2({ x: 60, h: 0.9, top: C.dark, mood: 'smile' }), rect(70, 52, 14, 10, C.white, 1, C.ink, 1.2), say(28, 22, 36, 22, 50, 30, all(rect(20, 15, 5, 14, C.navy, 1, null), rect(30, 15, 5, 14, C.navy, 1, null))), ...[14, 34, 86, 106].map((x) => all(circle(x, 108, 8, C.hair, C.ink, 1.4), circle(x, 104, 7, C.hair, null))), line('M98 30 l8 -4 M100 38 l8 0', HL, 1.6)),
  'gest.snäsa': all(ground, F2({ x: 30, top: C.orange, hairStyle: 'long', mood: 'angry' }), shout(66, 26, 16, 12, 44, 38, path('M60 20 L70 24 L62 28 L72 32', 'none', HL, 2.4), 10), F2({ x: 96, top: C.green, mood: 'shock' }), motion(108, 54, 1, 3, 5)),
  'gest.sarkasm': all(bust(30, 62, 22, C.lilac, { py: -1, px: 0.4, lid: 0.35, mc: 0.3, skew: 0.8, mw: 0.7 }), say(82, 30, 50, 30, 54, 56, all(path('M64 34 L64 26 L68 20 L70 22 L69 26 L76 26 L76 34 Z', C.skin, C.ink, 1.2), circle(92, 28, 7, C.yellow, C.ink, 1.1), circle(89.6, 26.4, 0.9, C.ink, null), circle(94.4, 26.4, 0.9, C.ink, null), path('M89 30 Q92 33 95 30', 'none', C.ink, 1))), clock(96, 84, 12, [-120, 60]), noC(110, 100, 6)),
  'gest.sarkastisk': all(ground, stand(30, { top: C.navy, mood: 'smirk', look: [1, 0], arms: [[[18, 66], [26, 58]], [[42, 66], [36, 58]]] }), path('M18 50 q-4 6 0 12 M42 50 q4 6 0 12', 'none', HL, 1.6), clock(30, 14, 7, [-90, 160]), F2({ x: 88, top: C.orange, hairStyle: 'long', mood: 'blush' }), path('M70 104 L82 96 L86 108 Z M90 108 L100 98 L106 110 Z M104 100 L114 96 L114 108 Z', C.white, C.ink, 1.4), path('M76 112 L80 104 M96 112 L98 106', 'none', C.ink, 1)),
  // ── 1145 Avstånd och närhet ──────────────────────────────────────
  'gest.personligt-utrymme': all(ground, ellipse(60, 110, 40, 7, 'rgba(228,87,46,0.12)', null), path('M20 110 C20 40 100 40 100 110', 'rgba(228,87,46,0.08)', null), dash('M20 110 C20 40 100 40 100 110', HL, 2, '4 4'), dash('M20 110 C30 118 90 118 100 110', HL, 2, '4 4'), fig(60, C.green, 'smile')),
  'gest.hålla-avstånd': all(ground, busSign(60), fig(18, C.orange, 'flat', { hairStyle: 'long' }), fig(102, C.green, 'flat'), line('M30 100 L90 100', HL, 2), arrow(44, 100, 30, 100, HL, 2), arrow(76, 100, 90, 100, HL, 2)),
  'gest.komma-för-nära': all(ground, dash('M8 110 C8 44 72 44 72 110', HL, 1.8, '4 4'), pose({ n: [38, 52], h: [36, 82], tilt: -12, head: [34, 40], top: C.orange, long: true, mood: 'worried', arms: [[[24, 66], [22, 80]], [[48, 66], [50, 80]]], legs: [[[32, 96], [30, 110]], [[42, 96], [44, 110]]] }), sweat(22, 30, 1), fig(62, C.green, 'smile'), arrow(92, 70, 76, 70, HL, 2.2)),
  'gest.tränga-sig-på': all(ground, fig(18, C.orange, 'frown', { hairStyle: 'long' }), fig(102, C.green, 'frown'), fig(60, C.yellow, 'laugh'), arrow(42, 86, 30, 86, HL, 2), arrow(78, 86, 90, 86, HL, 2), line('M48 30 l-6 -4 M72 30 l6 -4', HL, 1.6)),
  'gest.påträngande': all(ground, pose({ n: [46, 54], h: [40, 82], head: [52, 44], top: C.red, mood: 'laugh', arms: [[[56, 62], [72, 58]], [[56, 66], [70, 66]]], legs: [[[36, 96], [32, 110]], [[44, 96], [48, 110]]] }), rect(70, 50, 10, 16, C.dark, 2, C.ink, 1.2), say(28, 16, 26, 14, 44, 30, all(rect(20, 12, 6, 8, C.dark, 1, null), T(34, 20, '!', 11, HL))), pose({ n: [96, 54], h: [100, 82], head: [92, 42], top: C.sky, mood: 'worried', arms: [[[86, 60], [80, 48]], [[106, 66], [108, 80]]], legs: [[[96, 96], [94, 110]], [[104, 96], [108, 110]]] }), motion(112, 40, 1, 3, 5)),
  'gest.närgången': all(ground, fig(30, C.navy, 'laugh'), arm(41, 40, 66, 34), circle(66, 34, 3, C.skin, C.ink, 1.2), pose({ n: [90, 54], h: [94, 82], head: [92, 40], top: C.lilac, long: true, mood: 'angry', arms: [[[78, 52], [72, 46]], [[104, 66], [106, 80]]], legs: [[[90, 96], [88, 110]], [[98, 96], [102, 110]]] }), noC(56, 20, 7)),
  'gest.flytta-på-sig': all(ground, bench(14, 106, 86), pose({ n: [36, 58], h: [36, 84], top: C.orange, long: true, mood: 'smile', arms: [[[24, 70], [24, 84]], [[48, 70], [48, 84]]], legs: [[[30, 98], [28, 110]], [[42, 98], [44, 110]]] }), arrow(58, 72, 46, 72, HL, 2.4), fig(88, C.green, 'smile')),
  'gest.tätt-intill': all(ground, bench(6, 114, 86), ...[[26, C.orange, true], [48, C.green, false], [70, C.yellow, true], [92, C.lilac, false]].map(([x, c, l]) => pose({ n: [x as number, 58], h: [x as number, 84], sw: 10, hw: 9, top: c as string, long: l as boolean, mood: 'flat', arms: [[[(x as number) - 8, 72], [(x as number) - 4, 84]], [[(x as number) + 8, 72], [(x as number) + 4, 84]]], legs: [[[(x as number) - 4, 98], [(x as number) - 4, 110]], [[(x as number) + 4, 98], [(x as number) + 4, 110]]] })), arrow(4, 60, 12, 60, HL, 2), arrow(116, 60, 108, 60, HL, 2)),
  'gest.på-armlängds-avstånd': all(ground, stand(28, { top: C.navy, mood: 'flat', arms: [[[16, 66], [14, 80]], [[56, 46], [76, 46]]] }), fig(88, C.orange, 'smile', { hairStyle: 'long' }), line('M40 36 L76 36', HL, 1.6), arrow(50, 36, 40, 36, HL, 1.6), arrow(66, 36, 76, 36, HL, 1.6)),
  'gest.kroppskontakt': all(ground, fig(36, C.green, 'smile'), arm(47, 40, 72, 52), circle(72, 52, 3.4, C.skin, C.ink, 1.2), fig(84, C.orange, 'smile', { hairStyle: 'long' }), circle(72, 52, 9, 'none', HL, 2.4), sparkle(84, 18, 4)),
  'gest.kindpuss': all(face(40, 62, 24, { hs: 'long', pout: true, eo: 0, tilt: 10 }), face(82, 60, 24, { happy: true, mc: 0.7, mw: 0.7, blush: true, tilt: -8 }), heart(62, 24, 0.9), path('M62 64 q3 -3 6 0', 'none', HL, 1.6)),
  'gest.klapp': all(ground, fig(36, C.green, 'smile'), arm(47, 40, 70, 38), circle(70, 37, 3.4, C.skin, C.ink, 1.2), fig(84, C.orange, 'laugh'), path('M64 26 q6 -4 12 0 M62 20 q8 -6 16 0', 'none', HL, 1.6)),
  'gest.distanserad': all(ground, F2({ x: 14, h: 0.85, top: C.orange, mood: 'laugh', hairStyle: 'long' }), F2({ x: 34, h: 0.85, top: C.yellow, mood: 'laugh' }), F2({ x: 54, h: 0.85, top: C.red, mood: 'laugh', hairStyle: 'long' }), heart(34, 14, 0.8), stand(98, { top: '#7a9ab8', mood: 'flat', look: [1.2, 0], arms: crossA(98) }), dash('M74 30 L74 110', '#5aa7e8', 1.6, '4 4'), line('M110 22 l4 -2 M110 30 l5 0', '#5aa7e8', 1.4)),
  'gest.hålla-sig-på-sin-kant': all(ground, house2(26, '#f2d07a'), house2(94, '#9ad0e8'), F2({ x: 46, h: 0.62, top: C.orange, mood: 'smile' }), F2({ x: 74, h: 0.62, top: C.green, mood: 'smile' }), line('M60 112 L60 82 M54 86 L66 86 M54 96 L66 96 M54 106 L66 106', C.brown, 2.2), path('M52 64 q-3 4 0 8 M68 64 q3 4 0 8', 'none', HL, 1.2)),
  // ── 1146 Gester i olika kulturer ─────────────────────────────────
  'gest.kulturskillnad': all(ground, flagJP(30, 18, 1.4), flagSE(90, 18, 1.4), pose({ side: 1, h: [16, 80], n: [26, 60], head: [33, 64], top: C.orange, mood: 'calm', arms: [[[24, 72], [26, 82]], [[24, 72], [26, 82]]], legs: [[[16, 96], [16, 110]], [[16, 96], [16, 110]]] }), pose({ side: -1, h: [46, 80], n: [36, 60], head: [29, 64], top: C.green, mood: 'calm', arms: [[[38, 72], [36, 82]], [[38, 72], [36, 82]]], legs: [[[46, 96], [46, 110]], [[46, 96], [46, 110]]] }), T(60, 70, '≠', 20, HL), stand(78, { sw: 9, hw: 8, top: C.sky, mood: 'smile', arms: [[[70, 66], [70, 80]], [[88, 64], [90, 66]]] }), stand(104, { sw: 9, hw: 8, top: C.yellow, mood: 'smile', long: true, arms: [[[94, 64], [91, 66]], [[112, 66], [112, 80]]] })),
  'gest.kulturbunden': all(bigHand(60, 30, 0.9, 180, [false, true, true, true, true]), path('M42 46 q-4 -8 0 -16 M78 46 q4 -8 0 -16', 'none', HL, 1.6), flagJP(28, 84, 1.6), okC(28, 106, 7), flagSE(92, 84, 1.6), noC(92, 106, 7), arrow(50, 54, 34, 70, HL, 2), arrow(70, 54, 86, 70, HL, 2)),
  'gest.universell': all(globeS(60, 60, 26), ...[[60, 16], [100, 36], [104, 82], [60, 104], [16, 82], [20, 36]].map(([x, y], i) => smiley(x!, y!, 9, ['#f6c9a0', '#d9a57c', '#f1c7a1', '#b07a52', '#f7d8c0', '#7d5236'][i]!))),
  'gest.vinka-till-sig': all(bigHand(36, 66, 1.4, -10, [true, true, true, true, true]), path('M22 26 C26 16 40 14 46 22', 'none', HL, 2), arrow(44, 19, 47, 23, HL, 2), path('M50 40 C58 46 56 58 50 62', 'none', HL, 1.6), ground, F2({ x: 96, h: 0.86, top: C.white, mood: 'smile' }), rect(104, 62, 14, 3, C.silver, 1, C.ink, 1), arrow(84, 100, 66, 100, HL, 2.2)),
  'gest.peka-på-sig-själv': all(ground, stand(60, { top: C.green, mood: 'open', arms: [[[44, 66], [42, 80]], [[78, 70], [64, 62]]] }), line('M64 62 L58 60', C.ink, 4.4), line('M64 62 L58 60', C.skin, 2.6), circle(57, 60, 6, 'none', HL, 2), say(94, 22, 22, 18, 72, 36, qm(94, 22, 13))),
  'gest.V-tecken': all(g('rotate(-14 52 46)', rect(49, 8, 7, 40, C.skin, 3.5, C.ink, 1.4)), g('rotate(14 68 46)', rect(64, 8, 7, 40, C.skin, 3.5, C.ink, 1.4)), rect(40, 44, 38, 34, C.skin, 9, C.ink, 1.6), rect(46, 42, 8, 10, C.skin, 4, C.ink, 1.2), rect(68, 42, 8, 10, C.skin, 4, C.ink, 1.2), path('M40 64 C50 58 60 56 70 52', 'none', C.ink, 1.4), path('M40 66 C50 60 60 58 70 54 L68 58 C58 62 50 64 42 70 Z', C.skin, null), rect(44, 78, 30, 26, C.orange, 3, C.ink, 1.6), sparkle(96, 26, 5), sparkle(22, 30, 4)),
  'gest.tummen-ner': all(thumbFist(46, 54, 1.7, true, C.green), g('translate(92 92)', ellipse(0, 4, 20, 6, C.white, C.ink, 1.4), path('M-12 2 C-10 -6 10 -6 12 2 Z', '#a0a060', C.ink, 1.2)), smiley(92, 52, 12, C.yellow, true)),
  'gest.hyssja': all(face(60, 58, 38, { b: 2, eo: 0.9, press: true, mw: 0.6, px: 0.3 }), rect(57, 54, 7, 36, C.skin, 3.5, C.ink, 1.4), path('M44 120 L46 92 C46 86 74 86 74 92 L76 120 Z', C.skin, C.ink, 1.4), rect(42, 104, 36, 16, C.sky, 2, C.ink, 1.4), path('M96 66 q6 -2 10 2 M98 76 q8 0 12 4', 'none', HL, 1.6)),
  'gest.göra-tecken': all(ground, fig(22, C.orange, 'open', { hairStyle: 'long' }), arm(33, 40, 40, 22), bigHand(42, 16, 0.35, 0, [true, true, true, true, true]), path('M50 10 q4 6 0 12', 'none', HL, 1.4), fig(98, C.green, 'shock'), dash('M48 26 L88 30', HL, 1.6, '3 3'), exm(104, 12, 12)),
  'gest.niga': all(ground, F2({ x: 92, h: 0.95, top: C.lilac, mood: 'smile', hairStyle: 'long', hair: '#c9ced4' }), pose({ n: [40, 64], h: [40, 86], sw: 9, hw: 8, top: '#e85a7a', skirt: '#e85a7a', long: true, mood: 'calm', head: [42, 53], arms: [[[28, 76], [24, 92]], [[52, 76], [56, 92]]], legs: [[[32, 100], [36, 110]], [[46, 100], [50, 110]]] }), arrow(16, 50, 16, 70, HL, 2)),
  'gest.hytta-med-näven': all(ground, stand(36, { top: '#8a7a6a', hair: C.white, mood: 'angry', arms: [[[22, 66], [20, 80]], [[56, 40], [56, 22]]] }), rect(51, 14, 11, 10, C.skin, 3, C.ink, 1.3), path('M46 12 q-3 4 0 8 M66 12 q3 4 0 8', 'none', HL, 1.6), g('translate(96 96)', rect(-18, -8, 36, 12, C.red, 4, C.ink, 1.4), path('M-12 -8 L-8 -16 L8 -16 L12 -8 Z', '#bfe3f5', C.ink, 1.2), circle(-10, 6, 5, C.dark, C.ink, 1.2), circle(10, 6, 5, C.dark, C.ink, 1.2)), motion(120, 92, -1, 3, 5)),
  'gest.stötande': all(ground, fig(26, C.green, 'smile'), say(30, 18, 24, 18, 30, 32, path('M24 24 L24 14 L28 10 L30 12 L29 16 L36 16 L36 24 Z', C.skin, C.ink, 1.1)), F2({ x: 94, top: C.orange, hairStyle: 'long', mood: 'shock' }), bolt(62, 50, 1.3), bolt(112, 24, 0.8), arrow(46, 80, 76, 80, HL, 2)),
  // ── 1147 Tolka sociala signaler ──────────────────────────────────
  'gest.samspel': all(ground, fig(22, C.orange, 'smile', { hairStyle: 'long' }), fig(98, C.green, 'smile'), path('M44 40 C52 24 68 24 76 40', 'none', HL, 2.2), arrow(73, 35, 76, 40, HL, 2.2), path('M76 62 C68 78 52 78 44 62', 'none', C.navy, 2.2), arrow(47, 67, 44, 62, C.navy, 2.2), wave(60, 50, [2, 3, 2], 4, C.navy, 1.4), heart(60, 92, 0.6)),
  'gest.läsa-av': all(ground, fig(24, C.orange, 'open', { hairStyle: 'long' }), arm(35, 40, 56, 40), F2({ x: 92, top: C.green, mood: 'frown' }), mag(76, 24, 12, ''), smiley(104, 92, 0, C.white), line('M62 18 l-4 -4 M62 30 l-4 4', HL, 1.2)),
  'gest.känna-av': all(ground, rect(4, 34, 18, 78, '#c8925a', 1, C.ink, 1.6), fig(30, C.orange, 'worried', { hairStyle: 'long' }), path('M42 20 q4 4 0 8 M46 16 q6 8 0 16 M50 12 q8 12 0 24', 'none', HL, 1.6), F2({ x: 76, h: 0.85, top: C.navy, mood: 'angry' }), F2({ x: 104, h: 0.85, top: C.red, mood: 'angry' }), cloudS(90, 18, 0.9, '#5a606e'), bolt(90, 34, 0.7)),
  'gest.subtil': all(ground, ...[14, 36, 84, 106].map((x) => greyed(F2({ x, h: 0.75, mood: 'flat' }))), F2({ x: 60, h: 0.75, top: C.orange, mood: 'smile', hairStyle: 'long' }), mag(64, 50, 13, g('translate(64 50) scale(0.22)', bigHand(0, 0, 1, 0, [true, true, true, true, true]))), circle(66, 72, 1.6, C.skin, C.ink, 0.8)),
  'gest.blandade-signaler': all(ground, stand(54, { top: C.lilac, long: true, mood: 'smile', look: [1.4, 0], arms: crossA(54) }), say(96, 26, 30, 18, 70, 34, all(heart(88, 26, 0.55), noC(104, 26, 5))), qm(20, 26, 16)),
  'gest.förstå-vinken': all(ground, rect(4, 70, 34, 6, C.tan, 1, C.ink, 1.4), fig(22, C.orange, 'smile', { hairStyle: 'long' }), g('translate(16 66)', ellipse(0, 0, 8, 3, C.white, C.ink, 1.2)), clock(22, 14, 8, [0, -90]), fig(86, C.green, 'smile'), coat(104, 60, C.brown), circle(86, 10, 6, C.yellow, C.ink, 1.2), line('M80 4 l-2 -2 M92 4 l2 -2 M86 2 l0 -2', C.gold, 1.4), arrow(100, 100, 116, 100, HL, 2)),
  'gest.titta-på-klockan': all(ground, stand(60, { top: C.sky, mood: 'down', look: [0.8, 1], arms: [[[44, 66], [42, 80]], [[80, 58], [66, 52]]] }), rect(64, 48, 7, 7, C.white, 2, C.ink, 1.3), eyeLine(62, 44, 66, 49), clock(98, 24, 11, [-90, 30])),
  'gest.klia-sig-i-huvudet': all(ground, stand(56, { top: C.green, mood: 'worried', look: [0.6, -1], arms: [[[40, 66], [38, 80]], [[78, 46], [64, 30]]] }), line('M70 26 l3 -2 M72 32 l3 0', HL, 1.4), qm(94, 24, 16), qm(104, 44, 11)),
  'gest.uttråkad': all(bust(52, 52, 26, C.navy, { tilt: 14, lid: 0.6, mc: -0.2, mw: 0.6, b: -1, ba: -1 }), circle(66, 86, 6, C.skin, C.ink, 1.3), clock(100, 24, 12, [-60, 90]), path('M94 50 q4 4 8 0 q4 -4 8 0', 'none', C.grey, 1.6), rect(76, 92, 40, 6, C.tan, 1, C.ink, 1.4)),
  'gest.besvärad': all(bust(48, 52, 26, C.orange, { b: 2, ba: -2, mc: 0.3, skew: -0.6, mw: 0.7, blush: true, sweat: true, px: -0.8 }), circle(80, 74, 6, C.skin, C.ink, 1.3), say(98, 22, 30, 20, 96, 40, all(circle(92, 22, 5, C.gold, C.ink, 1), circle(104, 22, 5, C.gold, C.ink, 1)))),
  'gest.avvisande': all(ground, fig(26, C.green, 'smile'), arm(37, 40, 52, 52), cup(54, 48), pose({ n: [92, 52], h: [94, 82], head: [96, 40], top: C.lilac, long: true, mood: 'flat', look: [1.4, 0], arms: [[[80, 56], [72, 46]], [[106, 66], [108, 80]]], legs: [[[90, 96], [88, 110]], [[98, 96], [100, 110]]] }), g('translate(70 42)', rect(-4, -8, 8, 14, C.skin, 3, C.ink, 1.2))),
  'gest.inbjudande': all(ground, rect(76, 26, 34, 86, '#f6e6b8', 1, C.ink, 1.6), path('M76 26 L62 32 L62 112 L76 112 Z', '#c8925a', C.ink, 1.4), stand(40, { top: C.orange, long: true, mood: 'laugh', arms: [[[22, 56], [10, 44]], [[58, 56], [70, 44]]] }), heart(40, 14, 0.7), sparkle(96, 40, 4)),
  'gest.taktlös': all(ground, fig(24, C.navy, 'laugh'), say(48, 18, 30, 20, 34, 30, all(rect(40, 18, 16, 8, '#f6d8a8', 1, C.ink, 1), line('M44 18 L44 12 M48 18 L48 12 M52 18 L52 12', C.red, 1.6), qm(60, 14, 10))), F2({ x: 76, top: C.orange, hairStyle: 'long', mood: 'angry' }), F2({ x: 104, h: 0.85, top: C.green, mood: 'shock' })),
  'gest.trampa-i-klaveret': all(rect(6, 64, 108, 30, C.white, 2, C.ink, 1.8), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => line(`M${18 + i * 12} 64 L${18 + i * 12} 94`, C.ink, 1.2)), ...[0, 1, 3, 4, 5, 7].map((i) => rect(14 + i * 12, 64, 8, 18, C.ink, 1, null)), path('M56 26 L64 26 L64 58 L80 62 C84 64 82 70 78 70 L54 68 Z', C.black, C.ink, 1.4), rect(54, 10, 12, 18, C.navy, 1, C.ink, 1.4), line('M24 40 l4 -6 l3 6 l4 -6 M92 36 l4 -6 l3 6 l4 -6', '#e8302c', 2), noteI(30, 30, 0.9, '#e8302c'), noteI(98, 24, 0.9, '#e8302c'), bolt(84, 52, 0.7)),
  'gest.genomskåda': all(face(44, 60, 28, { b: -1, ba: 4, mc: -0.5, mw: 0.6 }), g('rotate(-12 60 60)', mask(62, 58, 22)), line('M70 92 L70 108', C.brown, 3), mag(90, 30, 14, all(path('M80 28 q4 -3 8 0 M92 28 q4 -3 8 0', 'none', C.ink, 1.6))), line('M30 40 l-6 -4', HL, 1.4)),
};
