/**
 * Samhälle & institutioner → Politik & demokrati → Val & folkomröstningar, 1321–1327 (0.30): election
 * campaigns, polling stations and voting, counting the votes, districts and seats, thresholds and
 * electoral systems, referendums, and results and changes of government. Parties are never real:
 * they are plain colours with a dot as their mark. Ballots are yellow, blue or white (riksdag,
 * region, kommun) as in Sweden; a seat in a semicircle stands for a mandate. No text names a word.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock, heart } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon } from './labelIcons';
import { cal, clock } from './time';
import { win, door, tree } from './homeKit';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Small head-and-shoulders person (for crowds). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1, long = false) => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', C.hair, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[], a2: number[], b2: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, inw = tx < L ? 1.6 : -1.6, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; a2 = [e + inw, by - 3.6]; b2 = [e + inw, by + 3.6]; }
  else { const e = ty > cy ? B : Tp, inw = ty > cy ? -1.6 : 1.6, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; a2 = [bx - 4, e + inw]; b2 = [bx + 4, e + inw]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, C.ink, 1.5), rect(L, Tp, w, h, fill, 6, C.ink, 1.5), path(`M${a2[0]} ${a2[1]} L${tx} ${ty} L${b2[0]} ${b2[1]} Z`, fill, null), inner);
};
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2) + dx, cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };
/** Thought cloud beside a head (side as in sb). */
const tb = (x: number, h: number, side: 1 | -1, w: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2) + dx, cy = k.hy - 6 + dy; return all(ellipse(cx, cy, w / 2, 12, C.white, C.ink, 1.6), circle(x + side * (k.hr + 5), k.hy - 4, 2.4, C.white, C.ink, 1.1), circle(x + side * (k.hr + 2), k.hy + 1, 1.6, C.white, C.ink, 1), f(cx, cy)); };

// ── Marks ────────────────────────────────────────────────────────────
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const upA = (x: number, y: number, col: string = C.green, l = 14) => arrow(x, y + l / 2, x, y - l / 2, col, 2.6);
const downA = (x: number, y: number, col: string = RED, l = 14) => arrow(x, y - l / 2, x, y + l / 2, col, 2.6);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const moon = (x: number, y: number, r = 7) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const night = (x = 4, y = 4, w = 112, h = 50) => all(rect(x, y, w, h, '#2f3e66', 10, null), moon(x + w - 16, y + 14, 7), star(x + 14, y + 12, 2.6, '#f6e08a'), star(x + 40, y + 22, 2, '#f6e08a'), star(x + w - 40, y + 30, 2.2, '#f6e08a'));
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -26', C.ink, 1.6), rect(0, -26, 18, 11, '#3a6ab0', 0, C.ink, 1), rect(5.5, -26, 3.4, 11, C.yellow, 0, null), rect(0, -22.2, 18, 3.4, C.yellow, 0, null));
const flag = (x: number, y: number, col: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -26', C.ink, 1.6), path('M0 -26 L18 -22 L0 -16 Z', col, C.ink, 1.2), circle(5, -21, 2, C.white, null));
const megaphone = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M0 -3 L12 -9 L12 9 L0 3 Z', C.white, C.ink, 1.4), rect(-4, -3, 5, 6, C.grey, 1, C.ink, 1.2), path('M15 -6 q3 6 0 12 M18 -9 q4 9 0 18', 'none', HL, 1.3));

// ── Election things ──────────────────────────────────────────────────
/** Party colours (no real parties). */
const PC = ['#e85a5a', '#5aa7e8', '#7ac06a', '#f2c14e', '#a585d0', '#f28a2e'];
const YEL = '#f7e38a', BLU = '#a9cdf2', ENV = '#e9d6ad', HUT = '#b5392f';
/** Ballot paper: party mark (coloured dot and band) and name lines; kryss = boxes before the names, one crossed. */
const ballot = (x: number, y: number, s = 1, o: { paper?: string; col?: string; kryss?: number; blank?: boolean; rot?: number; heads?: boolean } = {}) => {
  const out: Svg[] = [rect(-9, -12, 18, 24, o.paper ?? YEL, 1.5, C.ink, 1.2)];
  if (!o.blank) {
    out.push(circle(-4.5, -7.5, 2.6, o.col ?? PC[0]!, C.ink, 0.8), rect(-0.5, -9, 7.5, 3, o.col ?? PC[0]!, 1, null));
    for (let i = 0; i < 3; i++) {
      const yy = -1 + i * 4.4;
      if (o.heads) out.push(circle(-1.6, yy, 1.6, C.skin, C.ink, 0.6));
      out.push(line(`M${o.heads ? 1 : -1} ${yy} L6.5 ${yy}`, C.grey, 1.2));
      if (o.kryss !== undefined) { out.push(rect(-7.4, yy - 1.6, 3.2, 3.2, C.white, 0.4, C.ink, 0.6)); if (o.kryss === i) out.push(line(`M-7 ${f1(yy - 1.2)} L-4.6 ${f1(yy + 1.2)} M-4.6 ${f1(yy - 1.2)} L-7 ${f1(yy + 1.2)}`, C.ink, 0.9)); }
    }
  }
  return g(`translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})`, ...out);
};
/** Election envelope, optionally with a ballot sticking out. */
const env = (x: number, y: number, s = 1, o: { ballotCol?: string; paper?: string; open?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  o.open || o.ballotCol || o.paper ? path('M-12 -8 L0 -17 L12 -8 Z', '#dcc69a', C.ink, 1.2) : '',
  o.ballotCol || o.paper ? ballot(0, -8, 0.8, { col: o.ballotCol, paper: o.paper, blank: !o.ballotCol }) : '',
  rect(-12, -8, 24, 16, ENV, 1.5, C.ink, 1.3), o.open || o.ballotCol || o.paper ? all(line('M-12 -8 L12 -8', C.ink, 1.3), line('M-12 8 L-1 0 M12 8 L1 0', C.ink, 0.9)) : path('M-12 -8 L0 1 L12 -8', 'none', C.ink, 1.2));
/** Ballot box with a slot; `inEnv` draws an envelope going in. */
const urn = (x: number, y: number, s = 1, inEnv = false, col = '#6f93c9') => g(`translate(${x} ${y}) scale(${s})`,
  rect(-16, -12, 32, 26, col, 2, C.ink, 1.6), path('M-18 -16 L18 -16 L16 -11 L-16 -11 Z', '#90b0dc', C.ink, 1.4), rect(-7, -15.2, 14, 2.6, C.ink, 1, null),
  rect(-5, 0, 10, 6, C.white, 1, C.ink, 0.9), line('M-3 3 L3 3', RED, 1.2),
  inEnv ? g('translate(0 -22)', rect(-7, -5, 14, 10, ENV, 1, C.ink, 1.1), arrow(12, -6, 12, 6, HL, 1.8)) : '');
/** Polling-booth screen (three panels) seen from the front. */
const booth = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -52 L-14 -46 L-14 0 L-22 -4 Z', '#cfd8e2', C.ink, 1.4), path('M22 -52 L14 -46 L14 0 L22 -4 Z', '#cfd8e2', C.ink, 1.4), rect(-14, -46, 28, 46, '#e3e9ef', 1, C.ink, 1.4), line('M-22 0 L-22 4 M22 0 L22 4', C.ink, 1.6));
/** Ballot rack: shelves with stacks of ballots in party colours. */
const rack = (x: number, y: number, s = 1, paper = YEL) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -30, 40, 30, C.tan, 2, C.ink, 1.4), line('M-20 -15 L20 -15', C.ink, 1.2), ...[0, 1, 2, 3].map((i) => ballot(-14 + i * 9.4, -22, 0.36, { col: PC[i], paper })), ...[0, 1, 2, 3].map((i) => ballot(-14 + i * 9.4, -7, 0.36, { col: PC[i + 2] ?? PC[0], paper })), line('M-18 0 L-18 10 M18 0 L18 10', C.brown, 2.4));
/** Election hut (valstuga): small red wooden hut with a counter and a party flag. */
const hut = (x: number, y: number, s = 1, col: string = PC[1]!) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -34, 44, 34, HUT, 1, C.ink, 1.6), path('M-26 -32 L0 -48 L26 -32 Z', C.dark, C.ink, 1.6), rect(-22, -34, 3, 34, C.white, 0, null), rect(19, -34, 3, 34, C.white, 0, null), rect(-14, -28, 28, 14, '#f6efe2', 1, C.ink, 1.2), rect(-16, -15, 32, 4, C.white, 1, C.ink, 1.2), path('M-16 -28 L16 -28 L14 -24 L-14 -24 Z', col, C.ink, 1), flag(0, -48, col, 0.8));
/** Election poster on a stand with a candidate portrait. */
const poster = (x: number, y: number, s = 1, col: string = PC[1]!) => g(`translate(${x} ${y}) scale(${s})`, line('M-10 0 L-6 -20 M10 0 L6 -20', C.brown, 2.4), rect(-15, -62, 30, 42, C.white, 2, C.ink, 1.6), rect(-15, -62, 30, 10, col, 2, C.ink, 1.4), circle(-9, -57, 2.6, C.white, null), circle(0, -40, 7, C.skin, C.ink, 1.2), path('M-7 -42 C-7 -50 7 -50 7 -42 C4 -45 -4 -45 -7 -42 Z', C.hair, null), path('M-11 -21 C-11 -30 11 -30 11 -21 Z', col, C.ink, 1.2), path('M-2.6 -37.6 Q0 -35.6 2.6 -37.6', 'none', C.ink, 1));
/** Leaflet with a party mark. */
const leaflet = (x: number, y: number, s = 1, col: string = PC[1]!, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-8, -11, 16, 22, C.white, 1, C.ink, 1.2), rect(-8, -11, 16, 6, col, 1, C.ink, 1), circle(-3, -8, 1.6, C.white, null), line('M-5 -1 L5 -1 M-5 3 L5 3 M-5 7 L2 7', C.grey, 1.2));
/** TV screen. */
const tv = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6, C.dark, 4, C.ink, 1.6), rect(x - w / 2, y - h / 2, w, h, '#eaf4fb', 2, null), inner, line(`M${x - 8} ${y + h / 2 + 3} L${x - 12} ${y + h / 2 + 9} M${x + 8} ${y + h / 2 + 3} L${x + 12} ${y + h / 2 + 9}`, C.ink, 1.6));
const podium = (x: number, y: number, col: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-11 0 L-9 -22 L9 -22 L11 0 Z', C.tan, C.ink, 1.4), rect(-12, -26, 24, 5, C.brown, 1, C.ink, 1.2), circle(0, -14, 3.6, col, C.ink, 1));
/** Bars standing on y. */
const bars = (x: number, y: number, vals: number[], cols: string[], bw = 10, gap = 4, o: { dashed?: number[]; base?: boolean } = {}) => all(o.base === false ? '' : line(`M${x - 3} ${y} L${x + vals.length * (bw + gap)} ${y}`, C.ink, 1.4), ...vals.map((v, i) => (o.dashed?.includes(i) ? all(`<rect x="${x + i * (bw + gap)}" y="${y - v}" width="${bw}" height="${v}" fill="${cols[i]}" fill-opacity="0.35" stroke="${C.ink}" stroke-width="1.2" stroke-dasharray="3 2"/>`) : rect(x + i * (bw + gap), y - v, bw, v, cols[i]!, 1, C.ink, 1.2))));
/** Seats of a parliament as dots in a semicircle; cols = one colour per seat (left to right). */
function hemi(cx: number, cy: number, R: number, cols: string[], dot = 2.6, r0 = 0.45): Svg {
  const n = cols.length, rows = n > 40 ? 4 : n > 16 ? 3 : 2;
  const rr = Array.from({ length: rows }, (_, i) => R * (r0 + ((1 - r0) * i) / Math.max(1, rows - 1)));
  const tot = rr.reduce((a, b) => a + b, 0);
  const cnt = rr.map((r) => Math.max(2, Math.round((n * r) / tot)));
  cnt[rows - 1]! += n - cnt.reduce((a, b) => a + b, 0);
  const pts: { a: number; x: number; y: number }[] = [];
  rr.forEach((r, i) => { const c = cnt[i]!; for (let j = 0; j < c; j++) { const a = Math.PI * (1 - j / (c - 1)); pts.push({ a, x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }); } });
  pts.sort((p, q2) => q2.a - p.a);
  return all(...pts.map((p, i) => circle(+f1(p.x), +f1(p.y), dot, cols[i] ?? C.grey2, C.ink, 0.6)));
}
const seats = (...parts: [string, number][]) => parts.flatMap(([c, k]) => Array<string>(k).fill(c));
/** A simple country map of six regions (origin top-left, about 64 × 82). */
const REG = ['M0 0 L30 0 L34 26 L4 30 Z', 'M30 0 L62 4 L60 28 L34 26 Z', 'M4 30 L34 26 L36 54 L8 58 Z', 'M34 26 L60 28 L64 52 L36 54 Z', 'M8 58 L36 54 L38 80 L14 82 Z', 'M36 54 L64 52 L60 78 L38 80 Z'];
const mapR = (x: number, y: number, s = 1, fill: (i: number) => string = () => '#dfeccf', extra: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, ...REG.map((d, i) => path(d, fill(i), C.ink, 1.4 / s)), extra);
/** A small building used as a polling station: a sign with a ballot box over the door, and a flag. */
const station = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-26, -40, 52, 40, '#e6d3b3', 1, C.ink, 1.8), path('M-30 -38 L0 -56 L30 -38 Z', '#b0533c', C.ink, 1.8), win(-16, -26, 10, 10), win(16, -26, 10, 10), door(0, 0, 14, 22, C.brown), rect(-10, -38, 20, 12, C.white, 2, C.ink, 1.2), urn(0, -30, 0.28), flagSE(28, -40, 0.7));
/** Chair seen from the side (seat at y). */
const chair = (x: number, y: number, col: string = C.navy, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -4, 20, 5, col, 1.5, C.ink, 1.3), rect(6, -26, 5, 23, col, 1.5, C.ink, 1.3), line('M-8 1 L-8 14 M8 1 L8 14', C.ink, 2));
/** Card with a portrait (ID). */
const idCard = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, '#eaf2fb', 2, C.ink, 1.3), rect(-11, -6, 9, 12, C.skin, 1, C.ink, 0.9), circle(-6.5, -2, 2.4, C.white, null), line('M1 -4 L11 -4 M1 0 L11 0 M1 4 L8 4', C.grey, 1.2));
/** Voting card: white card with a small polling station and a pin. */
const voteCard = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -12, 36, 24, C.white, 2, C.ink, 1.4), rect(-18, -12, 36, 6, YEL, 2, C.ink, 1.2), station(-7, 9, 0.24), path('M9 2 C9 -4 17 -4 17 2 C17 6 13 9 13 9 C13 9 9 6 9 2 Z', HL, C.ink, 0.9), circle(13, 1.6, 1.4, C.white, null));
/** Clipboard with name rows (heads) and ticks for the first `ticked` rows. */
const roll = (x: number, y: number, s = 1, ticked = 2, hl = -1) => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -22, 32, 44, C.tan, 3, C.ink, 1.5), rect(-13, -18, 26, 38, C.white, 1, C.ink, 1), rect(-6, -25, 12, 6, C.grey, 2, C.ink, 1.1),
  ...[0, 1, 2, 3, 4].map((i) => all(i === hl ? rect(-12, -14 + i * 7, 24, 6, '#fde7c7', 1, null) : '', circle(-8, -11 + i * 7, 2, C.skin, C.ink, 0.6), line(`M-4 ${-11 + i * 7} L5 ${-11 + i * 7}`, C.grey, 1.3), i < ticked ? check(9, -11 + i * 7, 0.42) : '')));
/** Pen (writing at the tip at x, y). */
const pen = (x: number, y: number, s = 1, rot = -40) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 L-2 -5 L2 -5 Z', C.ink, null), rect(-2.2, -26, 4.4, 21, C.navy, 1, C.ink, 1));
/** Pile of ballots (count table). */
const pile = (x: number, y: number, col: string, n = 4, paper = YEL) => all(...Array.from({ length: n }, (_, i) => g(`translate(${x + (i % 2) * 1.5} ${y - i * 2.6})`, rect(-9, -3, 18, 5, paper, 1, C.ink, 0.9), circle(-5, -0.5, 1.5, col, null))));
const tally = (x: number, y: number, n = 5, col: string = C.ink) => all(...Array.from({ length: Math.min(n, 4) }, (_, i) => line(`M${x + i * 3} ${y - 5} L${x + i * 3} ${y + 5}`, col, 1.3)), n >= 5 ? line(`M${x - 1.5} ${y + 4} L${x + 10.5} ${y - 4}`, col, 1.3) : '');
/** Balance (scale) with the beam tilted by `tilt` degrees; pans drawn by l and r. */
const scaleB = (x: number, y: number, tilt: number, l: Svg = '', r: Svg = '', s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 40 L14 40 L4 34 L-4 34 Z', C.brown, C.ink, 1.4), line('M0 34 L0 -2', C.ink, 2.6),
  g(`rotate(${tilt})`, line('M-34 0 L34 0', C.ink, 2.6), line('M-32 0 L-40 18 M-32 0 L-24 18 M32 0 L24 18 M32 0 L40 18', C.ink, 1), path('M-44 18 L-20 18 Q-32 26 -44 18 Z', C.gold, C.ink, 1.2), path('M20 18 L44 18 Q32 26 20 18 Z', C.gold, C.ink, 1.2), g('translate(-32 16)', g(`rotate(${-tilt})`, l)), g('translate(32 16)', g(`rotate(${-tilt})`, r))), circle(0, 0, 3, C.gold, C.ink, 1.2));
const cube = (col: string, w = 10, h = 10, dy = 0) => rect(-w / 2, -h - dy, w, h, col, 1.5, C.ink, 1.1);
/** Small icons for topics: school, hospital, tree, bridge, coin. */
const schoolI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, '#e6d3b3', 1, C.ink, 1.1), path('M-11 -5 L0 -12 L11 -5 Z', '#b0533c', C.ink, 1.1), rect(-2, 0, 4, 6, C.brown, 0.5, C.ink, 0.8), circle(0, -6.5, 1.6, C.white, C.ink, 0.6));
const hospI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -9, 18, 16, C.white, 2, C.ink, 1.1), path('M-2 -6 L2 -6 L2 -3 L5 -3 L5 1 L2 1 L2 4 L-2 4 L-2 1 L-5 1 L-5 -3 L-2 -3 Z', RED, null));
const treeI = (x: number, y: number, s = 1) => tree(x, y + 9 * s, 0.38 * s);
const bridgeI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 4 L14 4 L14 1 Q0 -10 -14 1 Z', C.grey2, C.ink, 1.1), line('M-8 4 L-8 -1 M0 4 L0 -4 M8 4 L8 -1', C.ink, 0.9), path('M-16 6 q4 -2 8 0 q4 2 8 0 q4 -2 8 0 q4 2 8 0', 'none', BLU, 1.4));
const plantI = (x: number, y: number, s = 1, steam = true) => g(`translate(${x} ${y}) scale(${s})`, path('M-26 0 C-22 -10 -22 -24 -26 -34 L-8 -34 C-12 -24 -12 -10 -8 0 Z', '#d9dde3', C.ink, 1.6), path('M4 0 C8 -10 8 -24 4 -34 L22 -34 C18 -24 18 -10 22 0 Z', '#d9dde3', C.ink, 1.6), rect(24, -16, 16, 16, '#c2c9d2', 1, C.ink, 1.4), path('M26 -16 C26 -24 38 -24 38 -16 Z', '#c2c9d2', C.ink, 1.4),
  steam ? all(ellipse(-17, -40, 9, 5, C.white, C.grey2, 1.2), ellipse(-14, -48, 7, 4, C.white, C.grey2, 1.2), ellipse(13, -40, 9, 5, C.white, C.grey2, 1.2), ellipse(16, -48, 7, 4, C.white, C.grey2, 1.2)) : '');
const pylon = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 0 L0 -30 L6 0 M-4 -10 L4 -10 M-8 -22 L8 -22 M-3 -18 L3 -6 M3 -18 L-3 -6', 'none', C.dark, 1.4));
const sumBar = (x: number, y: number) => bars(x, y, [18, 12, 22, 8], PC, 6, 2);
const bulb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -9 l-3 -3 M0 -12 l0 -4 M9 -9 l3 -3', 'none', C.gold, 1.6), circle(0, -2, 6, C.yellow, C.ink, 1.2), rect(-3, 3.5, 6, 4.5, C.grey, 1, C.ink, 1));
const box = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -10, 24, 16, C.tan, 1, C.ink, 1.4), path('M-12 -10 L-8 -15 L8 -15 L12 -10', 'none', C.ink, 1.3), rect(-6, -18, 6, 8, C.white, 1, C.ink, 0.9), circle(5, -15, 3, '#7ac06a', C.ink, 0.9));
const key = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-8, 0, 5, C.gold, C.ink, 1.4), circle(-8, 0, 1.8, C.paper, C.ink, 0.8), rect(-3, -1.6, 14, 3.2, C.gold, 1, C.ink, 1.1), rect(7, 1, 2.4, 4, C.gold, 0.5, C.ink, 0.9), rect(3, 1, 2.4, 3, C.gold, 0.5, C.ink, 0.9));
const confetti = (pts: number[][]) => all(...pts.map(([x, y], i) => g(`translate(${x} ${y}) rotate(${(i * 47) % 180})`, rect(-2, -1.2, 4, 2.4, PC[i % PC.length]!, 0.6, null))));
/** Almost full circle with an arrow head: again, once more. */
const ring = (x: number, y: number, r: number, col: string = HL) => { const ex = +f1(x + r * Math.cos(-0.7)), ey = +f1(y + r * Math.sin(-0.7)); return all(path(`M${x + r} ${y} A${r} ${r} 0 1 1 ${ex} ${ey}`, 'none', col, 2), path(`M${ex} ${ey} l-1 -7 l7 3 Z`, col, col, 1)); };
const pie = (x: number, y: number, r: number, parts: [string, number][]) => { let a = -Math.PI / 2; const tot = parts.reduce((s, p) => s + p[1], 0); return all(...parts.map(([c, v]) => { const b = a + (v / tot) * 2 * Math.PI, la = b - a > Math.PI ? 1 : 0, d = `M${x} ${y} L${f1(x + r * Math.cos(a))} ${f1(y + r * Math.sin(a))} A${r} ${r} 0 ${la} 1 ${f1(x + r * Math.cos(b))} ${f1(y + r * Math.sin(b))} Z`; a = b; return path(d, c, C.ink, 1.2); })); };

export const ELECTION_MOTIFS: Record<string, Svg> = {
  // ── Valkampanjer ─────────────────────────────────────────────────
  // kandidat: the ballot shows three faces; the woman beside it is one of them (highlighted row and arrow).
  'valet.kandidat': all(ground, g('translate(36 50) scale(2.4)', rect(-9, -12, 18, 24, YEL, 1.5, C.ink, 0.6), circle(-4.5, -7.5, 2.6, PC[1]!, C.ink, 0.4), rect(-0.5, -9, 7.5, 3, PC[1]!, 1, null), rect(-8, 2.2, 16, 4.4, '#fde0b8', 0.8, null), ...[0, 1, 2].map((i) => all(circle(-4.5, -0.4 + i * 4.4, 1.6, C.skin, C.ink, 0.4), line(`M-2 ${-0.4 + i * 4.4} L6 ${-0.4 + i * 4.4}`, C.grey, 0.9)))), arrow(58, 72, 76, 62, HL, 2.4), fig(90, PC[1]!, 'laugh', { hairStyle: 'long' }), reach(90, 1, 1, 106, 20), palm(106, 15, 0.9)),
  // kandidera: she puts her own portrait into the empty place on the party's list.
  'valet.kandidera': all(ground, rect(10, 16, 46, 62, C.white, 3, C.ink, 1.6), rect(10, 16, 46, 10, PC[2]!, 3, C.ink, 1.4), ...[0, 1].map((i) => all(circle(20, 36 + i * 13, 4, C.skin, C.ink, 1), line(`M28 ${36 + i * 13} L50 ${36 + i * 13}`, C.grey, 2))), dash('M14 56 L52 56 L52 70 L14 70 Z', HL, 1.4), fig(92, PC[2]!, 'smile'), reach(92, 1, -1, 54, 62), g('translate(44 62)', rect(-8, -7, 16, 14, '#fde0b8', 2, C.ink, 1.2), circle(0, -1, 3.4, C.skin, C.ink, 0.9), path('M-5 7 C-5 2 5 2 5 7', PC[2]!, C.ink, 0.9)), arrow(70, 50, 58, 58, HL, 2)),
  // väljare: a citizen with her envelope on the way to the ballot box (the voter, not the act).
  'valet.väljare': all(ground, fig(40, C.orange, 'smile', { hairStyle: 'long' }), reach(40, 1, 1, 60, 62), env(64, 60, 0.8), urn(96, 98, 1, false), arrow(74, 66, 86, 76, HL, 2), idCard(22, 18, 0.8)),
  // valrörelse: the weeks before election day (filled calendar days leading up to the ballot box), and the streets full of posters and flags.
  'valet.valrörelse': all(ground, cal(6, 6, 76, 3, (i) => (i >= 6 && i < 20 ? '#fde0b8' : null), { mark: (i) => (i === 20 ? urn(0, 1, 0.22) : '') }), arrow(14, 62, 74, 62, HL, 2.4), poster(98, 112, 0.7, PC[0]), flag(14, 108, PC[2]!, 1), flag(34, 108, PC[3]!, 1), flag(54, 108, PC[4]!, 1), poster(76, 112, 0.62, PC[1])),
  // valkampanj: one party's whole effort in one colour: poster, flag, megaphone and leaflets, all aimed at the ballot box.
  'valet.valkampanj': all(ground, poster(20, 112, 0.9, PC[1]), fig(60, PC[1]!, 'laugh'), reach(60, 1, 1, 78, 38), megaphone(80, 38, 1), flag(102, 112, PC[1]!, 1.1), leaflet(42, 102, 0.6, PC[1]), leaflet(50, 106, 0.6, PC[1], 15), say(98, 22, 26, 22, 92, 36, urn(98, 26, 0.38, true))),
  // kampanja: she hands out leaflets and talks to a passer-by in the street.
  'valet.kampanja': all(ground, fig(34, PC[0]!, 'laugh', { hairStyle: 'long' }), reach(34, 1, 1, 58, 62), leaflet(62, 60, 0.7, PC[0]), reach(34, 1, -1, 18, 64), leaflet(14, 64, 0.7, PC[0], -10), leaflet(16, 60, 0.7, PC[0], -4), fig(90, C.sky, 'smile'), reach(90, 1, -1, 68, 62), sb(34, 1, 1, 26, 20, (x, y) => urn(x, y + 4, 0.36, true))),
  // budskap: one short message (a star) goes from the speaker to everybody, who all get the same thing.
  'valet.budskap': all(ground, fig(26, PC[2]!, 'laugh'), reach(26, 1, 1, 44, 40), sb(26, 1, 1, 26, 22, (x, y) => star(x, y + 1, 8, C.gold), -2, -4), ...[0, 1, 2].map((i) => all(mini(66 + i * 20, 96, [C.sky, C.orange, C.purple][i]!, 'smile', 1.1), say(66 + i * 20, 66, 16, 15, 66 + i * 20, 78, star(66 + i * 20, 66, 4.4, C.gold)))), arrow(56, 40, 92, 52, HL, 2.2)),
  // vallöfte: before the ballot box she promises (raised palm) a new school; after it the school stands there.
  'valet.vallöfte': all(ground, fig(22, PC[3]!, 'smile', { hairStyle: 'long' }), reach(22, 1, -1, 8, 14), palm(8, 9, 0.9), sb(22, 1, 1, 28, 20, (x, y) => schoolI(x, y + 2, 1)), urn(62, 98, 0.7), arrow(46, 84, 54, 84, HL, 1.8), arrow(74, 84, 82, 84, HL, 1.8), schoolI(98, 96, 1.8), check(110, 72, 1.2)),
  // valfråga: everybody thinks about the same issue (the hospital) on the way to the ballot box; other topics are grey.
  'valet.valfråga': all(ground, ...[0, 1, 2].map((i) => all(mini(22 + i * 26, 98, [C.sky, C.orange, C.green][i]!, 'flat', 1.1), say(22 + i * 26, 64, 18, 18, 22 + i * 26, 80, hospI(22 + i * 26, 65, 0.8)))), urn(100, 100, 0.8), arrow(84, 96, 88, 96, HL, 2), greyed(schoolI(84, 22, 1.1), treeI(104, 22, 1.4)), hospI(60, 22, 1.5), circle(60, 22, 15, 'none', HL, 2)),
  // valaffisch: a poster with a smiling candidate on a stand in the street.
  'valet.valaffisch': all(ground, poster(60, 112, 1.6, PC[4]), tree(16, 112, 0.7), line('M100 112 L100 20', C.dark, 3), path('M100 20 Q108 14 112 22', 'none', C.dark, 3), ellipse(112, 24, 5, 3, C.yellow, C.ink, 1)),
  // flygblad: a hand gives a small printed leaflet; a stack of the same leaflets in the other hand.
  'valet.flygblad': all(ground, fig(28, PC[1]!, 'smile'), reach(28, 1, 1, 62, 54), leaflet(68, 52, 1.2, PC[1], 8), reach(28, 1, -1, 12, 70), leaflet(12, 66, 0.8, PC[1]), leaflet(13, 63, 0.8, PC[1]), fig(96, C.orange, 'smile', { hairStyle: 'long', h: 0.92 }), reach(96, 0.92, -1, 80, 58)),
  // valstuga: the little red election hut on the square, with a party flag and a person behind the counter.
  'valet.valstuga': all(ground, mini(60, 79, PC[1]!, 'smile', 1), hut(60, 112, 1.5, PC[1]), mini(16, 100, C.orange, 'smile', 1.1), mini(104, 100, C.green, 'smile', 1.1)),
  // dörrknackning: a campaigner with leaflets rings at a front door; the resident opens.
  'valet.dörrknackning': all(ground, rect(60, 20, 56, 92, '#e6d3b3', 1, C.ink, 1.8), rect(72, 50, 26, 62, '#7a5236', 1, C.ink, 1.6), path('M98 50 L106 46 L106 112 L98 112 Z', '#5e3d27', C.ink, 1.2), circle(102, 64, 9, C.skin, C.ink, 1.2), path('M93 62 C93 52 111 52 111 62 C107 58 97 58 93 62 Z', C.hair, null), circle(66, 66, 2, C.gold, C.ink, 1), fig(32, PC[0]!, 'smile'), reach(32, 1, 1, 64, 64), reach(32, 1, -1, 16, 70), leaflet(14, 66, 0.7, PC[0]), path('M68 56 q3 -4 6 0 M68 50 q4 -6 8 0', 'none', HL, 1.3)),
  // valdebatt: two politicians at podiums on a TV screen, each saying the opposite.
  'valet.valdebatt': all(tv(60, 56, 100, 76, all(podium(32, 92, PC[0]!, 1), podium(88, 92, PC[1]!, 1), mini(32, 58, PC[0]!, 'flat', 1.1), mini(88, 58, PC[1]!, 'flat', 1.1, true), say(46, 30, 18, 16, 38, 44, thumb(46, 32, 0.6)), say(74, 30, 18, 16, 82, 44, thumb(74, 28, 0.6, true)))), line('M48 106 L72 106', C.ink, 2)),

  // ── Vallokaler och röstning ───────────────────────────────────────
  // valdag: the Sunday in the calendar with the ballot box; people walk to the polling station.
  'valet.valdag': all(ground, cal(6, 6, 84, 2, (i) => (i === 13 ? '#fde0b8' : null), { mark: (i) => (i === 13 ? urn(0, 1, 0.24) : '') }), station(92, 112, 0.7), mini(34, 98, C.orange, 'smile', 1), mini(54, 98, C.sky, 'smile', 1, true), arrow(66, 100, 74, 100, HL, 2)),
  // vallokal: the school with the ballot-box sign and the flag; people go in.
  'valet.vallokal': all(ground, station(60, 112, 1.5), mini(18, 98, C.orange, 'smile', 1), arrow(28, 104, 44, 104, HL, 2), mini(100, 98, C.green, 'smile', 1)),
  // röstkort: the card that came in the post shows which polling station to go to (pin on the station).
  'valet.röstkort': all(ground, rect(78, 66, 26, 34, C.grey, 3, C.ink, 1.6), rect(82, 72, 18, 4, C.dark, 1, null), line('M91 100 L91 112', C.ink, 3), arrow(76, 72, 64, 66, HL, 2), fig(18, C.orange, 'smile', { hairStyle: 'long', h: 0.8 }), reach(18, 0.8, 1, 30, 64), voteCard(44, 56, 1.3)),
  // valsedel: a hand takes one ballot from the rack of party ballots.
  'valet.valsedel': all(ground, rack(52, 100, 1.6), ballot(96, 40, 2, { col: PC[1] }), arrow(84, 64, 90, 58, HL, 2)),
  // valskärm: the screen in the polling station; behind it a voter takes his ballots, nobody sees which.
  'valet.valskärm': all(ground, booth(60, 108, 1.6), mini(60, 54, C.green, 'flat', 1.2), rack(60, 108, 0.9)),
  // valkuvert: the ballot goes into the envelope.
  'valet.valkuvert': all(ground, env(60, 72, 2.6, { ballotCol: PC[2] }), arrow(96, 22, 96, 44, HL, 2.4)),
  // valhemlighet: she votes behind the screen; a curious onlooker is stopped (cross, padlock).
  'valet.valhemlighet': all(ground, booth(42, 108, 1.4), mini(42, 58, C.orange, 'smile', 1.1, true), padlock(42, 96, 0.9), greyed(fig(96, C.sky, 'shock', { h: 0.9 })), arrow(84, 30, 66, 40, C.grey, 1.6), noB(74, 22, 7)),
  // valurna: the ballot box with its slot; an envelope goes in.
  'valet.valurna': all(ground, rect(26, 82, 68, 30, C.tan, 2, C.ink, 1.6), urn(60, 66, 2, true)),
  // röstmottagare: the official with a badge at the table takes the envelope and puts it in the box.
  'valet.röstmottagare': all(ground, fig(70, C.navy, 'smile'), rect(66, 52, 8, 10, C.white, 1, C.ink, 1), line('M70 40 L70 52', HL, 1.2), rect(8, 82, 104, 6, C.tan, 2, C.ink, 1.6), line('M16 88 L16 112 M104 88 L104 112', C.brown, 3), urn(98, 68, 0.8), reach(70, 1, 1, 92, 50), env(94, 46, 0.5), roll(28, 66, 0.5, 2), arrow(98, 36, 98, 46, HL, 1.6)),
  // kryssa: the pen puts a cross in the box in front of one candidate's name.
  'valet.kryssa': all(g('translate(54 62) scale(3.6)', rect(-11, -14, 22, 28, YEL, 1.5, C.ink, 0.5), circle(-5, -9.5, 2.6, PC[1]!, C.ink, 0.4), rect(-1, -11, 9, 3, PC[1]!, 0.6, null), ...[0, 1, 2].map((i) => all(rect(-9, -4 + i * 5.6, 3.4, 3.4, C.white, 0.3, C.ink, 0.4), line(`M-3 ${-2.3 + i * 5.6} L8 ${-2.3 + i * 5.6}`, C.grey, 0.8))), line('M-8.6 7.6 L-6 10.6 M-6 7.6 L-8.6 10.6', HL, 0.8)), pen(28, 92, 1.4, -30)),
  // rösta blankt: a ballot without any party goes into the envelope; the party ballots stay unused (grey).
  'valet.rösta-blankt': all(ground, greyed(ballot(18, 36, 1.4, { col: PC[0] }), ballot(40, 30, 1.4, { col: PC[1] }), ballot(62, 36, 1.4, { col: PC[2] })), cross(40, 52, 1.2), env(84, 84, 1.8, { paper: C.white }), ballot(84, 40, 1.6, { paper: C.white, blank: true }), arrow(84, 60, 84, 66, HL, 2)),
  // förtidsrösta: weeks before election day (the ballot box day) she already votes, at the library.
  'valet.förtidsrösta': all(ground, cal(4, 4, 60, 2, (i) => (i === 3 ? '#fde0b8' : null), { mark: (i) => (i === 13 ? greyed(urn(0, 1, 0.18)) : i === 3 ? check(0, 0, 0.5) : '') }), arrow(54, 40, 30, 40, HL, 2), rect(72, 8, 42, 50, C.tan, 2, C.ink, 1.6), ...[0, 1, 2].map((r) => all(...[0, 1, 2, 3, 4].map((i) => rect(75 + i * 7.6, 12 + r * 15, 6, 12, PC[(i + r) % 6]!, 1, C.ink, 0.8)))), urn(86, 98, 0.9), fig(44, C.orange, 'smile', { hairStyle: 'long', h: 0.7 }), reach(44, 0.7, 1, 74, 76), env(76, 74, 0.5)),
  // budröst: grandpa is sick in bed and gives his envelope to his daughter, who takes it to the ballot box.
  'valet.budröst': all(ground, rect(6, 76, 52, 14, C.white, 3, C.ink, 1.6), rect(6, 72, 12, 18, C.tan, 2, C.ink, 1.4), line('M10 90 L10 112 M54 90 L54 112', C.brown, 3), circle(20, 70, 7, C.skin, C.ink, 1.2), path('M14 66 C16 60 24 60 26 66', 'none', C.grey, 2), path('M26 74 L56 74 L56 80 L26 80 Z', C.sky, C.ink, 1.2), rect(26, 58, 2, 8, C.white, 1, C.ink, 0.6), env(42, 64, 0.5), fig(76, C.orange, 'smile', { hairStyle: 'long', h: 0.9 }), reach(76, 0.9, -1, 50, 64), urn(104, 100, 0.6), arrow(88, 92, 96, 92, HL, 1.8)),
  // röstlängd: the official ticks off a voter's name on the list of all who may vote here.
  'valet.röstlängd': all(ground, roll(44, 62, 1.7, 2, 2), pen(70, 66, 1.1, 30), mini(98, 96, C.orange, 'smile', 1.2, true), path('M88 70 L76 64', 'none', HL, 1.6)),

  // ── Rösträkning ──────────────────────────────────────────────────
  // rösträkning: the box is open; the ballots are sorted in piles per party and counted (tally marks).
  'valet.rösträkning': all(ground, rect(4, 78, 112, 6, C.tan, 2, C.ink, 1.6), line('M12 84 L12 112 M108 84 L108 112', C.brown, 3), pile(20, 74, PC[0]!, 5), pile(42, 74, PC[1]!, 3), pile(64, 74, PC[2]!, 4), pile(86, 74, PC[3]!, 2), tally(14, 44), tally(36, 44, 3), tally(58, 44, 4), tally(80, 44, 2), g('translate(100 26) rotate(-20)', urn(0, 0, 0.6)), sparkle(108, 46, 3)),
  // valnatt: night sky; the TV shows the first bars; the clock says late.
  'valet.valnatt': all(night(4, 4, 112, 52), tv(54, 82, 64, 36, bars(30, 96, [16, 10, 22, 8], PC, 9, 3)), clock(102, 86, 10, 11, 30)),
  // slutlig: final bars, solid and sealed with a stamp and a padlock; a dashed grey draft as reference.
  'valet.slutlig': all(ground, greyed(bars(8, 104, [20, 14, 26], [C.grey, C.grey, C.grey], 9, 3, { dashed: [0, 1, 2] })), bars(56, 104, [34, 22, 46], [PC[0]!, PC[1]!, PC[2]!], 14, 4), padlock(104, 34, 1.2), okB(102, 72, 10)),
  // preliminär: the bars are still dashed and drawn with a pencil; a clock and a question mark: they may change.
  'valet.preliminär': all(ground, bars(18, 104, [34, 22, 46], [PC[0]!, PC[1]!, PC[2]!], 14, 4, { dashed: [0, 1, 2] }), pen(70, 56, 1.2, 30), q(94, 30, 20, HL), arrow(30, 62, 30, 54, C.grey, 1.6), arrow(48, 74, 48, 86, C.grey, 1.6), greyed(okB(100, 80, 9))),
  // sammanräkning: the results of many polling stations all flow together into one total.
  'valet.sammanräkning': all(ground, ...[0, 1, 2].map((i) => all(station(18, 30 + i * 34, 0.36), arrow(32, 24 + i * 34, 58, 58, HL, 1.6))), rect(62, 34, 50, 50, C.white, 3, C.ink, 1.6), sumBar(68, 78), T(87, 100, 'Σ', 16, C.ink)),
  // valnämnd: the local election board at a table plans the polling stations on a map.
  'valet.valnämnd': all(ground, mapR(34, 6, 0.7, (i) => (i === 3 ? '#fde0b8' : '#dfeccf'), all(urn(48, 40, 0.3), urn(18, 16, 0.3), urn(22, 66, 0.3))), rect(6, 86, 108, 6, C.tan, 2, C.ink, 1.6), line('M14 92 L14 112 M106 92 L106 112', C.brown, 3), mini(30, 74, C.navy, 'flat', 1.1), mini(60, 74, C.navy, 'smile', 1.1, true), mini(90, 74, C.navy, 'flat', 1.1), roll(98, 30, 0.5, 3)),
  // blankröst: at the count the blank ballots get their own small pile.
  'valet.blankröst': all(ground, rect(4, 82, 112, 6, C.tan, 2, C.ink, 1.6), line('M12 88 L12 112 M108 88 L108 112', C.brown, 3), greyed(pile(22, 78, PC[0]!, 5), pile(46, 78, PC[1]!, 4), pile(70, 78, PC[2]!, 4)), g('translate(98 78)', ...Array.from({ length: 3 }, (_, i) => rect(-9 + (i % 2) * 1.5, -3 - i * 2.6, 18, 5, C.white, 1, C.ink, 0.9))), circle(98, 74, 14, 'none', HL, 2), ballot(98, 36, 1.8, { paper: C.white, blank: true }), arrow(98, 58, 98, 64, HL, 1.8)),
  // jämn (nästan lika): two bars side by side, only a hair apart; two nervous supporters. Grey reference: a clear difference.
  'valet.jämn.2': all(ground, greyed(bars(8, 52, [36, 14], [C.grey, C.grey], 10, 4)), bars(54, 104, [62, 60], [PC[0]!, PC[1]!], 20, 6), dash('M50 42 L108 42', HL, 1.4), mini(64, 30, PC[0]!, 'flat', 0.8), mini(90, 30, PC[1]!, 'flat', 0.8, true)),
  // omräkning: the same pile is counted once more (round arrow and magnifying glass).
  'valet.omräkning': all(ground, rect(10, 84, 100, 6, C.tan, 2, C.ink, 1.6), pile(46, 80, PC[1]!, 6), pile(74, 80, PC[0]!, 6), ring(60, 56, 30, HL), g('translate(96 26)', circle(0, 0, 9, 'rgba(220,240,252,0.7)', C.ink, 2), line('M6.4 6.4 L13 13', C.ink, 3)), tally(16, 30, 5), tally(16, 46, 5)),
  // valdeltagande: eight of ten go and vote; two (grey) stay at home. The pie shows the share.
  'valet.valdeltagande': all(ground, station(86, 112, 0.7), ...Array.from({ length: 8 }, (_, i) => mini(10 + (i % 4) * 14, 66 + Math.floor(i / 4) * 24, PC[i % 6]!, 'smile', 0.7)), greyed(mini(30, 108 - 4, C.grey, 'flat', 0.7), mini(46, 108 - 4, C.grey, 'flat', 0.7)), arrow(64, 76, 72, 86, HL, 2), pie(90, 24, 16, [[C.green, 8], [C.grey2, 2]])),
  // vallokalundersökning: outside the polling station a reporter asks a voter which party she chose.
  'valet.vallokalundersökning': all(ground, station(26, 112, 0.8), fig(56, C.orange, 'smile', { hairStyle: 'long', h: 0.9 }), sb(56, 0.9, -1, 18, 16, (x, y) => circle(x, y, 4.4, PC[1]!, C.ink, 1)), fig(96, C.dark, 'smile'), reach(96, 1, -1, 72, 46), rect(68, 40, 6, 10, C.dark, 1.5, C.ink, 1), circle(71, 38, 4, C.grey, C.ink, 1.1), roll(108, 74, 0.34, 1), tv(102, 18, 22, 14, bars(94, 23, [6, 4, 8], PC, 4, 1, { base: false }))),
  // överklaga: he holds up the result paper and takes it up the stairs to a higher authority.
  'valet.överklaga': all(ground, path('M44 112 L44 102 L60 102 L60 92 L76 92 L76 82 L92 82 L92 112 Z', C.grey2, C.ink, 1.4), rect(70, 26, 44, 56, '#e6e2d8', 1, C.ink, 1.6), path('M66 28 L92 12 L118 28 Z', '#c9c2b4', C.ink, 1.6), ...[76, 88, 100, 110].map((x) => rect(x - 2, 40, 4, 40, C.white, 1, C.ink, 1)), fig(24, C.green, 'frown'), reach(24, 1, 1, 40, 26), g('translate(42 18)', rect(-8, -10, 16, 20, C.white, 1, C.ink, 1.2), bars(-5, 6, [8, 12, 6], PC, 3, 1, { base: false })), arrow(52, 30, 66, 24, HL, 2.2)),
  // omval: the same election once more: a second ballot-box day in the calendar, with a round arrow.
  'valet.omval': all(ground, cal(10, 8, 64, 3, () => null, { mark: (i) => (i === 3 ? greyed(urn(0, 1, 0.16)) : i === 17 ? urn(0, 1, 0.16) : '') }), path('M30 30 C30 60 50 64 62 58', 'none', HL, 2), arrow(58, 60, 64, 56, HL, 2), urn(94, 98, 1, true), ring(94, 88, 20, HL)),
  // ogiltig (om en röst): two ballots of different parties in one envelope: the vote does not count.
  'valet.ogiltig.2': all(ground, ballot(48, 40, 1.8, { col: PC[0], rot: -10 }), ballot(70, 40, 1.8, { col: PC[1], rot: 10 }), env(60, 74, 2.4, { open: true }), noB(96, 26, 11)),

  // ── Valdistrikt och mandat ───────────────────────────────────────
  // riksdagsval: the yellow ballot and the national assembly (all seats of the whole country, the flag).
  'valet.riksdagsval': all(ground, ballot(22, 40, 2.2, { col: PC[1] }), hemi(76, 98, 36, seats([PC[0]!, 12], [PC[1]!, 10], [PC[2]!, 6], [PC[3]!, 8], [PC[4]!, 9], [PC[5]!, 9]), 2.4), flagSE(110, 50, 0.8), arrow(44, 54, 52, 66, HL, 2)),
  // regionval: the blue ballot decides about the hospital (health care) of the region.
  'valet.regionval': all(ground, ballot(24, 44, 2.2, { paper: BLU, col: PC[2] }), arrow(48, 56, 58, 62, HL, 2), rect(62, 40, 50, 72, C.white, 2, C.ink, 1.8), path('M82 50 L92 50 L92 58 L100 58 L100 68 L92 68 L92 76 L82 76 L82 68 L74 68 L74 58 L82 58 Z', RED, C.ink, 1), win(72, 92, 10, 10), win(102, 92, 10, 10), door(87, 112, 12, 18, C.sky)),
  // kommunval: the white ballot decides about the school and the preschool where you live.
  'valet.kommunval': all(ground, ballot(24, 44, 2.2, { paper: C.white, col: PC[3] }), arrow(48, 56, 58, 62, HL, 2), schoolI(86, 88, 2.6), mini(104, 104, C.orange, 'smile', 0.6), mini(70, 104, C.sky, 'smile', 0.6)),
  // valdistrikt: one small piece of a region (highlighted) whose people all vote at the same polling station.
  'valet.valdistrikt': all(ground, mapR(6, 8, 1, (i) => (i === 3 ? '#cfe3b8' : '#e9f1df'), all(line('M34 40 L62 40 M48 27 L50 54', C.ink, 0.8), path('M34 26 L48 27 L48 40 L34 40 Z', '#fde0b8', HL, 1.4))), station(98, 104, 0.6), mini(42, 98, C.orange, 'smile', 0.7), mini(58, 102, C.sky, 'smile', 0.7), arrow(56, 34, 86, 64, HL, 2)),
  // valkrets: a bigger part of the country (outlined) with its own seats.
  'valet.valkrets': all(ground, mapR(6, 14, 1.1, (i) => (i === 2 ? '#fde0b8' : '#e9f1df'), all(line('M4 44 L35 40 M18 28 L22 57', C.ink, 0.6), path('M4 30 L34 26 L36 54 L8 58 Z', 'none', HL, 2))), hemi(94, 62, 18, seats([PC[0]!, 3], [PC[1]!, 4], [PC[2]!, 2], [PC[3]!, 3]), 2.6), arrow(48, 60, 72, 56, HL, 2)),
  // mandat: one seat in the semicircle is highlighted; the winner sits down in her chair.
  'valet.mandat': all(ground, hemi(46, 66, 38, seats([PC[0]!, 9], [PC[1]!, 8], [PC[2]!, 6], [PC[3]!, 7]), 2.8), circle(46 + 38 * Math.cos(Math.PI * 0.18), 66 - 38 * Math.sin(Math.PI * 0.18), 6, 'none', HL, 2), chair(96, 92, PC[3]!), fig(98, PC[3]!, 'laugh', { h: 0.62, hairStyle: 'long' }), arrow(84, 40, 74, 50, HL, 2)),
  // mandatperiod: from one ballot box to the next there are four years; meanwhile she has her seat.
  'valet.mandatperiod': all(ground, urn(16, 98, 0.7), urn(104, 98, 0.7), line('M30 70 L90 70', C.ink, 2), ...[0, 1, 2, 3].map((i) => all(rect(32 + i * 15, 58, 12, 10, C.white, 1.5, C.ink, 1.1), rect(32 + i * 15, 58, 12, 3, '#e85a5a', 1, null))), arrow(30, 80, 90, 80, HL, 2), chair(60, 104, PC[1]!, 0.8), mini(58, 92, PC[1]!, 'smile', 0.8)),
  // valbar: she is grown up and may stand (ID card, check); the child may not yet (grey, cross).
  'valet.valbar': all(ground, fig(36, PC[2]!, 'laugh', { hairStyle: 'long' }), reach(36, 1, 1, 52, 48), idCard(58, 46, 0.9), okB(36, 8, 7), greyed(fig(88, C.sky, 'smile', { h: 0.55 })), noB(88, 50, 6), g('translate(96 78)', rect(-8, -10, 16, 20, C.white, 1, C.ink, 1.2), dash('M-5 -6 L5 -6 L5 2 L-5 2 Z', C.grey, 1))),
  // folkvald: the people vote, and their votes lift her into her seat.
  'valet.folkvald': all(chair(60, 46, PC[0]!, 1), mini(58, 34, PC[0]!, 'smile', 1.1, true), ...Array.from({ length: 5 }, (_, i) => all(mini(14 + i * 23, 100, PC[(i + 1) % 6]!, 'smile', 0.9), arrow(14 + i * 23, 84, 52 + i * 4, 66, HL, 1.4))), ground),
  // invald: her name on the list has a check and she walks in to the seats, with confetti.
  'valet.invald': all(ground, roll(22, 46, 0.9, 1, 0), hemi(84, 66, 30, seats([PC[0]!, 8], [PC[1]!, 8], [PC[2]!, 8]), 2.4), fig(62, PC[2]!, 'laugh', { hairStyle: 'long', h: 0.62 }), arrow(48, 92, 70, 76, HL, 2), confetti([[56, 30], [70, 24], [100, 22], [110, 34], [80, 18]])),
  // ersättare: the elected man is ill and leaves his seat; the substitute sits down in it.
  'valet.ersättare': all(ground, chair(60, 92, PC[1]!), greyed(fig(22, PC[1]!, 'sick', { h: 0.8 })), g('translate(14 30)', rect(-2, -10, 4, 14, C.white, 2, C.ink, 1), circle(0, 5, 3, RED, C.ink, 1)), arrow(36, 58, 26, 58, C.grey, 1.6), fig(94, PC[1]!, 'smile', { h: 0.8, hairStyle: 'long' }), arrow(82, 60, 68, 72, HL, 2.4)),
  // mandatfördelning: the semicircle and the bars: how the seats are divided between the parties.
  'valet.mandatfördelning': all(ground, hemi(60, 70, 46, seats([PC[0]!, 14], [PC[1]!, 10], [PC[2]!, 7], [PC[3]!, 12], [PC[4]!, 5]), 3), bars(30, 106, [14, 10, 7, 12, 5], PC, 9, 3)),
  // valkretsmandat: a region of the map has its own little group of seats, drawn inside it.
  'valet.valkretsmandat': all(ground, mapR(10, 14, 1.3, (i) => (i === 1 ? '#fde0b8' : '#e9f1df'), hemi(47, 22, 9, seats([PC[0]!, 3], [PC[1]!, 2], [PC[2]!, 2]), 1.8)), hemi(96, 104, 16, seats([PC[0]!, 3], [PC[1]!, 2], [PC[2]!, 2]), 2.8), arrow(82, 44, 92, 80, HL, 2)),
  // utjämningsmandat: the small party got too few seats in the districts; extra seats (plus) even it out.
  'valet.utjämningsmandat': all(ground, hemi(46, 80, 38, seats([PC[0]!, 12], [PC[1]!, 12], [PC[2]!, 3], ['#ffffff', 3]), 3), ...[0, 1, 2].map((i) => all(circle(92 + i * 0, 30 + i * 16, 5, PC[2]!, C.ink, 1), T(102, 34 + i * 16, '+', 12, C.green))), arrow(86, 46, 78, 64, HL, 2)),

  // ── Spärrar och valsystem ─────────────────────────────────────────
  // valsystem: ballots go in at the top of a machine (gears) and come out as seats: the rules for turning votes into seats.
  'valet.valsystem': all(ground, ...[0, 1, 2].map((i) => ballot(22 + i * 14, 18, 0.9, { col: PC[i] })), arrow(36, 32, 36, 40, HL, 2), rect(12, 42, 48, 34, C.grey2, 4, C.ink, 1.6), ...[[26, 59], [44, 59]].map(([x, y]) => all(circle(x!, y!, 8, C.silver, C.ink, 1.4), ...[0, 1, 2, 3, 4, 5].map((k) => { const a = (k * Math.PI) / 3; return rect(+f1(x! + 9 * Math.cos(a) - 2), +f1(y! + 9 * Math.sin(a) - 2), 4, 4, C.silver, 0.5, C.ink, 0.8); }), circle(x!, y!, 2.4, C.dark, null))), arrow(62, 60, 72, 60, HL, 2.2), hemi(96, 80, 20, seats([PC[0]!, 6], [PC[1]!, 4], [PC[2]!, 4]), 2.6)),
  // proportionell: the votes (pie) and the seats (semicircle) are divided in the same proportions.
  'valet.proportionell': all(ground, pie(28, 60, 20, [[PC[0]!, 5], [PC[1]!, 3], [PC[2]!, 2]]), T(60, 66, '=', 18, C.ink), hemi(94, 76, 22, seats([PC[0]!, 10], [PC[1]!, 6], [PC[2]!, 4]), 2.6)),
  // enmansvalkrets: every district of the map sends exactly one person.
  'valet.enmansvalkrets': all(ground, mapR(8, 14, 1.2, (i) => ['#e9f1df', '#dfeccf'][i % 2]!), ...[[26, 30], [62, 34], [30, 64], [66, 64], [36, 96], [70, 94]].map(([x, y], i) => mini(x!, y!, PC[i % 3]!, 'smile', 0.62)), circle(102, 40, 9, 'none', HL, 2), T(102, 45, '1', 12, HL)),
  // majoritetsval: in one district the candidate with most votes takes the only seat; the others get nothing (grey).
  'valet.majoritetsval': all(ground, bars(14, 100, [44, 30, 20], [PC[0]!, C.grey2, C.grey2], 16, 6), check(22, 46, 1.2), chair(96, 98, PC[0]!), mini(96, 84, PC[0]!, 'smile', 0.9), arrow(72, 60, 86, 72, HL, 2), cross(44, 62, 0.9), cross(66, 72, 0.9)),
  // spärr (i val): a barrier in front of the seats: the big party passes, the small one is stopped.
  'valet.spärr.2': all(ground, hemi(92, 70, 22, seats([PC[0]!, 8], [PC[1]!, 8]), 2.4), rect(58, 82, 6, 30, C.dark, 1, C.ink, 1.2), rect(60, 84, 56, 6, C.white, 2, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => rect(66 + i * 12, 84, 6, 6, RED, 0, null)), fig(26, PC[0]!, 'smile', { h: 0.9 }), arrow(40, 30, 74, 44, C.green, 2), fig(48, PC[4]!, 'frown', { h: 0.45 }), noB(48, 68, 6)),
  // fyraprocentsspärr: a dashed line at 4 % on the bar chart; bars below it are grey and crossed out.
  'valet.fyraprocentsspärr': all(ground, bars(10, 104, [60, 42, 14, 9, 5], [PC[0]!, PC[1]!, PC[2]!, C.grey2, C.grey2], 14, 6), dash('M6 92 L112 92', RED, 1.8, '4 3'), T(96, 86, '4%', 12, RED), cross(87, 98, 0.6), cross(107, 100, 0.6)),
  // klara spärren: the little bar just gets over the dashed line, and its supporter cheers.
  'valet.klara-spärren': all(ground, bars(14, 104, [24, 16, 26], [C.grey2, C.grey2, PC[4]!], 16, 8), dash('M8 84 L84 84', RED, 1.8, '4 3'), upA(62, 64, C.green, 14), check(62, 50, 1.2), fig(100, PC[4]!, 'laugh'), reach(100, 1, -1, 86, 12), reach(100, 1, 1, 114, 12)),
  // procentenhet: from 4 to 6 the bar rises two steps; the bracket marks the difference between the two numbers.
  'valet.procentenhet': all(ground, ...Array.from({ length: 7 }, (_, i) => line(`M8 ${104 - i * 12} L112 ${104 - i * 12}`, C.grey2, 0.8)), bars(24, 104, [48, 72], [C.grey, PC[1]!], 24, 24), T(36, 50, '4', 12, C.ink), T(84, 26, '6', 12, C.ink), path('M104 56 L108 56 L108 32 L104 32', 'none', HL, 2), T(112, 48, '2', 11, HL), arrow(52, 54, 70, 34, HL, 2)),
  // småparti: one tiny party (small flag, few supporters) beside two big ones.
  'valet.småparti': all(ground, flag(20, 112, PC[0]!, 2.4), ...[0, 1, 2, 3].map((i) => mini(14 + i * 9, 104, PC[0]!, 'smile', 0.6)), flag(56, 112, PC[1]!, 2.2), ...[0, 1, 2].map((i) => mini(52 + i * 9, 104, PC[1]!, 'smile', 0.6)), flag(96, 112, PC[4]!, 0.9), mini(100, 104, PC[4]!, 'smile', 0.6), circle(100, 96, 14, 'none', HL, 2)),
  // taktikrösta: her heart is for the red party, but she puts a ballot of another party in the box, thinking of the result.
  'valet.taktikrösta': all(ground, fig(30, C.orange, 'calm', { hairStyle: 'long' }), tb(30, 1, 1, 46, (x, y) => all(heart(x - 12, y + 1, 0.55, PC[0]!), arrow(x - 4, y, x + 6, y, HL, 1.6), ballot(x + 14, y, 0.6, { col: PC[1] }))), reach(30, 1, 1, 62, 70), env(66, 68, 0.6, { ballotCol: PC[1] }), urn(96, 100, 0.8)),
  // stödröst: a voter of the blue party gives her vote to the small party so that it gets over the dashed line.
  'valet.stödröst': all(ground, bars(52, 104, [50, 22], [PC[1]!, PC[4]!], 18, 10), dash('M46 86 L112 86', RED, 1.8, '4 3'), arrow(94, 92, 94, 76, C.green, 2.2), fig(22, PC[1]!, 'smile'), reach(22, 1, 1, 46, 52), ballot(52, 48, 0.8, { col: PC[4] }), arrow(62, 50, 86, 70, HL, 2), sb(22, 1, 1, 18, 16, (x, y) => heart(x, y + 1, 0.5, PC[1]!), -4)),
  // personval: the voter does not only choose the party (colour) but one of the people on its list.
  'valet.personval': all(ground, rect(12, 12, 44, 72, YEL, 3, C.ink, 1.6), rect(12, 12, 44, 12, PC[1]!, 3, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => all(circle(26, 34 + i * 13, 5, C.skin, C.ink, 1), line(`M34 ${34 + i * 13} L50 ${34 + i * 13}`, C.grey, 2))), circle(26, 47, 8, 'none', HL, 2.2), fig(92, C.orange, 'smile', { hairStyle: 'long' }), tb(92, 1, -1, 24, (x, y) => circle(x, y, 6, C.skin, C.ink, 1.1))),
  // personröst: a cross by one candidate's name gives her one more personal vote (counter goes up).
  'valet.personröst': all(ground, ballot(30, 54, 3, { col: PC[1], kryss: 1, heads: true }), fig(92, PC[1]!, 'laugh', { hairStyle: 'long', h: 0.85 }), T(92, 16, '+1', 13, C.green), arrow(54, 60, 74, 60, HL, 2)),
  // gynna: a step up for the big one only; the small one has to stand on the ground (grey reference).
  'valet.gynna': all(ground, rect(52, 84, 40, 28, C.tan, 2, C.ink, 1.6), fig(72, PC[0]!, 'laugh', { h: 0.72 }), greyed(fig(24, C.grey, 'frown', { h: 0.72 })), upA(104, 70, C.green, 18), star(72, 10, 6, C.gold)),
  // utjämna: an uneven pair of piles becomes an even pair.
  'valet.utjämna': all(ground, greyed(rect(10, 52, 14, 60, C.grey, 1, C.ink, 1.2), rect(28, 88, 14, 24, C.grey, 1, C.ink, 1.2)), arrow(48, 80, 66, 80, HL, 2.4), rect(74, 70, 14, 42, PC[1]!, 1, C.ink, 1.2), rect(92, 70, 14, 42, PC[0]!, 1, C.ink, 1.2), dash('M70 70 L110 70', C.green, 1.6)),

  // ── Folkomröstningar ──────────────────────────────────────────────
  // folkomröstning: a ballot with only yes and no, and the whole people in line to vote on it.
  'valet.folkomröstning': all(ground, g('translate(30 40) scale(2)', rect(-10, -14, 20, 28, C.white, 1.5, C.ink, 0.7), rect(-7, -9, 6, 6, C.white, 0.6, C.ink, 0.6), check(4, -6, 0.5), rect(-7, 3, 6, 6, C.white, 0.6, C.ink, 0.6), cross(4, 6, 0.4)), ...Array.from({ length: 4 }, (_, i) => mini(64 + i * 12, 100, PC[i]!, 'smile', 0.8)), urn(104, 72, 0.6), mini(56, 70, C.grey, 'smile', 0.7)),
  // rådgivande: the people give advice (bulb with check); the decision-maker still chooses himself (two ways).
  'valet.rådgivande': all(ground, ...[0, 1, 2].map((i) => mini(14 + i * 18, 100, PC[i]!, 'smile', 0.8)), say(32, 64, 26, 18, 32, 82, all(bulb(26, 66, 0.6), check(38, 64, 0.6))), arrow(48, 66, 66, 58, HL, 2), fig(84, C.navy, 'calm'), tb(84, 1, 1, 20, (x, y) => q(x, y, 12)), arrow(100, 76, 112, 68, C.grey, 1.6), arrow(100, 82, 112, 90, C.grey, 1.6)),
  // bindande: a signed paper is chained and locked: it must be followed.
  'valet.bindande': all(ground, rect(30, 14, 46, 60, C.white, 2, C.ink, 1.6), line('M38 26 L68 26 M38 34 L68 34 M38 42 L60 42', C.grey, 2), path('M40 60 q6 -8 10 0 q4 6 10 -2', 'none', C.navy, 1.6), ...[0, 1, 2, 3, 4].map((i) => ellipse(20 + i * 16, 84, 8, 5, 'none', C.dark, 2.6)), padlock(60, 92, 1.4), pen(92, 60, 1.2, 30)),
  // sakfråga: in the box goes a question about a thing (the bridge), not a face or a party (grey, crossed).
  'valet.sakfråga': all(ground, urn(60, 98, 1.1), bridgeI(60, 44, 2.2), circle(60, 44, 24, 'none', HL, 2), greyed(mini(16, 30, PC[0]!, 'smile', 0.9), mini(104, 30, PC[1]!, 'smile', 0.9)), cross(16, 30, 1), cross(104, 30, 1)),
  // motståndare: a woman holds up a sign with a cross against the new bridge (thumb down).
  'valet.motståndare': all(ground, bridgeI(90, 92, 1.6), fig(36, C.green, 'angry', { hairStyle: 'long' }), reach(36, 1, 1, 52, 30), line('M52 34 L52 8', C.brown, 2.4), rect(40, -2 + 6, 24, 18, C.white, 2, C.ink, 1.4), cross(52, 13, 1), reach(36, 1, -1, 18, 44), thumb(16, 40, 0.8, true)),
  // förespråkare: a man holds up a sign with a check for the new bridge (thumb up).
  'valet.förespråkare': all(ground, bridgeI(90, 92, 1.6), fig(36, C.orange, 'laugh'), reach(36, 1, 1, 52, 30), line('M52 34 L52 8', C.brown, 2.4), rect(40, 4, 24, 18, C.white, 2, C.ink, 1.4), check(52, 13, 1), reach(36, 1, -1, 18, 44), thumb(16, 40, 0.8)),
  // splittrad: one group split down the middle by a crack: half says yes, half says no.
  'valet.splittrad': all(ground, path('M60 6 L54 30 L64 50 L56 74 L64 96 L60 112', 'none', C.ink, 2.4), ...[0, 1].map((i) => mini(18 + i * 22, 90, C.sky, 'frown', 1)), ...[0, 1].map((i) => mini(80 + i * 22, 90, C.orange, 'frown', 1)), okB(30, 40, 12), noB(90, 40, 12)),
  // utfall: the box is opened and the outcome comes out: a paper where the yes side has won.
  'valet.utfall': all(ground, urn(28, 96, 1), arrow(48, 80, 62, 64, HL, 2.4), rect(64, 16, 46, 56, C.white, 2, C.ink, 1.6), bars(72, 62, [36, 20], [C.green, RED], 12, 8), check(78, 20, 0.9), cross(98, 36, 0.7)),
  // folkvilja: everybody thinks the same thing (check) and together it becomes one big arrow to the decision-makers' building.
  'valet.folkvilja': all(ground, ...Array.from({ length: 6 }, (_, i) => all(mini(12 + (i % 3) * 18, 98 - Math.floor(i / 3) * 22, PC[i]!, 'smile', 0.7), check(12 + (i % 3) * 18, 82 - Math.floor(i / 3) * 22, 0.5))), arrow(56, 72, 76, 72, HL, 4.4), rect(80, 54, 34, 58, '#e6e2d8', 1, C.ink, 1.6), path('M76 56 L97 40 L118 56 Z', '#c9c2b4', C.ink, 1.6), ...[86, 97, 108].map((x) => rect(x - 2, 64, 4, 44, C.white, 1, C.ink, 1))),
  // folkinitiativ: people sign a long list with a pen; enough names lead to a local vote.
  'valet.folkinitiativ': all(ground, rect(10, 10, 46, 92, C.white, 2, C.ink, 1.6), ...Array.from({ length: 7 }, (_, i) => path(`M16 ${22 + i * 11} q4 -6 8 0 q4 6 8 -2 q4 -4 8 2`, 'none', C.navy, 1.4)), pen(48, 92, 1, -30), ...[0, 1].map((i) => mini(72 + i * 20, 98, PC[i + 2]!, 'smile', 0.9)), arrow(70, 60, 90, 60, HL, 2), urn(102, 42, 0.6)),
  // kärnkraft: a nuclear power plant with cooling towers and steam, and a power line.
  'valet.kärnkraft': all(ground, plantI(44, 112, 1.25), pylon(106, 112, 1.3), line('M94 86 L84 90 M118 86 L120 87', C.dark, 1)),
  // avveckla: the plant step by step: full, half taken down, gone (grass), along the years.
  'valet.avveckla': all(ground, g('translate(22 100) scale(1.5)', path('M-9 0 C-5 -10 -5 -24 -9 -34 L9 -34 C5 -24 5 -10 9 0 Z', '#d9dde3', C.ink, 1.2), ellipse(0, -40, 9, 5, C.white, C.grey2, 1), ellipse(3, -48, 7, 4, C.white, C.grey2, 1)), g('translate(62 100) scale(1.5)', path('M-9 0 C-5 -10 -5 -14 -6 -17 L-2 -14 L1 -18 L4 -15 L6 -17 C5 -12 5 -8 9 0 Z', '#d9dde3', C.ink, 1.2)), arrow(38, 60, 48, 60, HL, 2.4), arrow(78, 60, 88, 60, HL, 2.4), g('translate(102 100)', path('M-14 0 q2 -7 4 0 q2 -9 4 0 q2 -7 4 0 q2 -9 4 0 q2 -7 4 0 q2 -9 4 0 q2 -7 4 0', 'none', C.green, 1.8)), tree(104, 100, 0.6), arrow(10, 107, 112, 107, C.grey, 1.6), clock(62, 18, 10, 2, 0, { shade: [0, 300] })),
  // högertrafik: a road seen from above: the cars drive on the right-hand side in both directions.
  'valet.högertrafik': all(rect(30, 4, 60, 112, '#8a8f99', 2, null), dash('M60 6 L60 114', C.white, 2.4, '8 6'), g('translate(76 84) rotate(0)', rect(-8, -14, 16, 28, PC[0]!, 4, C.ink, 1.4), rect(-6, -10, 12, 7, '#d8eef8', 1, C.ink, 0.8)), arrow(76, 66, 76, 46, C.white, 2.4), g('translate(44 34) rotate(180)', rect(-8, -14, 16, 28, PC[1]!, 4, C.ink, 1.4), rect(-6, -10, 12, 7, '#d8eef8', 1, C.ink, 0.8)), arrow(44, 52, 44, 72, C.white, 2.4), tree(14, 60, 0.6), tree(106, 100, 0.6)),

  // ── Valresultat och regeringsskifte ───────────────────────────────
  // valresultat: on the big board the votes (bars) and the seats (semicircle) of every party.
  'valet.valresultat': all(ground, rect(6, 8, 108, 70, C.white, 4, C.ink, 1.8), bars(14, 66, [40, 26, 48, 16], PC, 10, 4), hemi(90, 60, 18, seats([PC[0]!, 6], [PC[1]!, 4], [PC[2]!, 7], [PC[3]!, 3]), 2.2), mini(30, 100, C.orange, 'smile', 0.9), mini(60, 100, C.sky, 'smile', 0.9, true), mini(90, 100, C.green, 'smile', 0.9)),
  // röstandel: the slice of all the votes that one party got.
  'valet.röstandel': all(ground, pie(50, 58, 34, [[C.white, 3], [C.grey2, 9]]), g('translate(7 -6)', path(`M50 58 L50 24 A34 34 0 0 1 84 58 Z`, PC[1]!, C.ink, 1.4)), flag(92, 112, PC[1]!, 1.2), mini(106, 102, PC[1]!, 'smile', 0.8)),
  // valseger: the party's bar shoots up; supporters cheer with confetti.
  'valet.valseger': all(ground, greyed(rect(14, 82, 14, 30, C.grey, 1, C.ink, 1.2)), rect(32, 40, 14, 72, PC[2]!, 1, C.ink, 1.2), upA(39, 26, C.green, 18), ...[0, 1].map((i) => mini(72 + i * 26, 98, PC[2]!, 'smile', 1.1)), confetti([[60, 30], [76, 18], [96, 26], [108, 42], [86, 46], [66, 52]]), star(88, 66, 7, C.gold)),
  // valförlust: the party's bar falls; the supporters are sad.
  'valet.valförlust': all(ground, greyed(rect(14, 40, 14, 72, C.grey, 1, C.ink, 1.2)), rect(32, 86, 14, 26, PC[4]!, 1, C.ink, 1.2), downA(39, 64, RED, 22), ...[0, 1].map((i) => mini(76 + i * 24, 98, PC[4]!, 'frown', 1.1)), path('M82 66 C80 70 81 72 83 72 C85 72 86 70 84 66 Z', '#9ad0f0', C.ink, 0.6)),
  // valvaka: at night (window) the party's people stand before a big screen with the results, with balloons and drinks.
  'valet.valvaka': all(rect(4, 4, 112, 108, '#f6efe2', 4, C.ink, 1.6), rect(10, 10, 30, 22, '#2f3e66', 2, C.ink, 1.2), moon(32, 20, 5), tv(74, 30, 60, 34, bars(54, 44, [14, 22, 10, 18], PC, 8, 3, { base: false })), ...[0, 1, 2].map((i) => mini(22 + i * 34, 96, PC[2]!, 'smile', 1.1, i === 1)), ellipse(10, 60, 5, 6, PC[2]!, C.ink, 1), line('M10 66 L12 90', C.ink, 0.8), ellipse(110, 60, 5, 6, PC[3]!, C.ink, 1), line('M110 66 L108 90', C.ink, 0.8), ground),
  // jubla: arms up, mouth open, cheering.
  'valet.jubla': all(ground, fig(60, PC[2]!, 'laugh'), reach(60, 1, -1, 34, 12), reach(60, 1, 1, 86, 12), path('M28 8 l-4 -4 M24 14 l-6 0 M92 8 l4 -4 M96 14 l6 0', 'none', HL, 1.8), sparkle(20, 34, 4), sparkle(100, 34, 4), confetti([[40, 30], [80, 30], [30, 54], [92, 56]])),
  // erkänna sig besegrad: the loser (small falling bar) congratulates the winner with a handshake.
  'valet.erkänna-sig-besegrad': all(ground, fig(30, PC[4]!, 'calm', { h: 0.95 }), fig(90, PC[2]!, 'smile', { h: 0.95 }), reach(30, 0.95, 1, 58, 62), reach(90, 0.95, -1, 62, 62), downA(8, 26, RED, 14), upA(112, 26, C.green, 14), sb(30, 0.95, 1, 18, 16, (x, y) => thumb(x, y + 2, 0.6), -2, -8)),
  // block: two groups of parties, each inside its own ring: left and right.
  'valet.block': all(ground, ellipse(32, 58, 26, 34, '#fbe9e4', HL, 2), ellipse(88, 58, 26, 34, '#e4eefb', C.navy, 2), ...[[32, 40, 0], [22, 64, 5], [42, 74, 3]].map(([x, y, c]) => mini(x!, y!, PC[c!]!, 'smile', 0.9)), ...[[88, 40, 1], [78, 66, 2], [98, 72, 4]].map(([x, y, c]) => mini(x!, y!, PC[c!]!, 'smile', 0.9))),
  // vågmästare: two blocks almost equal on a balance; the small party decides which side goes down.
  'valet.vågmästare': all(ground, scaleB(60, 52, 10, all(cube(PC[0]!, 14, 14), cube(PC[3]!, 10, 10, 14)), all(cube(PC[1]!, 14, 14), cube(PC[2]!, 10, 10, 14))), mini(98, 24, PC[4]!, 'smile', 0.8), arrow(98, 36, 96, 52, HL, 1.8), g('translate(94 72)', cube(PC[4]!, 6, 6))),
  // sittande: the one who has the post now sits in the big chair; the challenger stands and waits (grey).
  'valet.sittande': all(ground, rect(50, 30, 30, 50, PC[1]!, 6, C.ink, 1.8), rect(46, 72, 38, 12, PC[1]!, 3, C.ink, 1.6), line('M50 84 L50 112 M80 84 L80 112', C.ink, 2.4), mini(65, 64, PC[1]!, 'smile', 1.2), star(65, 22, 6, C.gold), greyed(fig(102, PC[0]!, 'calm', { h: 0.8 }))),
  // regeringsskifte: at the building of power one colour goes out and another comes in.
  'valet.regeringsskifte': all(ground, rect(34, 30, 52, 82, '#e6e2d8', 1, C.ink, 1.6), path('M28 32 L60 12 L92 32 Z', '#c9c2b4', C.ink, 1.6), ...[42, 54, 66, 78].map((x) => rect(x - 2, 40, 4, 44, C.white, 1, C.ink, 1)), door(60, 112, 16, 26, C.brown), flagSE(60, 12, 0.6), ...[0, 1].map((i) => mini(16, 72 + i * 26, PC[0]!, 'flat', 0.8)), arrow(28, 92, 8, 92, PC[0]!, 2), ...[0, 1].map((i) => mini(104, 72 + i * 26, PC[2]!, 'smile', 0.8)), arrow(96, 80, 74, 92, PC[2]!, 2)),
  // maktskifte: the key of power goes from one person's hand to another's.
  'valet.maktskifte': all(ground, fig(26, PC[0]!, 'calm'), fig(94, PC[2]!, 'smile', { hairStyle: 'long' }), reach(26, 1, 1, 52, 56), reach(94, 1, -1, 68, 56), key(60, 54, 1.2), arrow(46, 40, 74, 40, HL, 2.2)),
  // tillträda: on the first day (calendar) she walks in through the door to her new desk and chair.
  'valet.tillträda': all(ground, rect(70, 20, 44, 92, '#f6efe2', 2, C.ink, 1.6), rect(78, 76, 30, 5, C.brown, 1, C.ink, 1.2), line('M80 81 L80 112 M106 81 L106 112', C.brown, 2.4), chair(96, 96, PC[2]!, 0.8), door(62, 112, 16, 60, '#7a5236'), fig(32, PC[2]!, 'laugh', { hairStyle: 'long' }), arrow(46, 70, 58, 70, HL, 2.2), cal(82, 30, 24, 1, (i) => (i === 0 ? '#fde0b8' : null))),
  // efterträda: the old leader (grey hair) leaves the chair and the new one takes his place in the same chair.
  'valet.efterträda': all(ground, chair(60, 90, C.navy), fig(98, C.navy, 'smile', { h: 0.85, hair: '#c9ced4' }), arrow(98, 106, 116, 106, C.grey, 1.8), fig(22, PC[1]!, 'smile', { h: 0.85, hairStyle: 'long' }), arrow(34, 60, 52, 74, HL, 2.4), star(60, 40, 6, C.gold)),
  // avgå (lämna ett uppdrag): he leaves the office with his things in a box and closes the door behind him.
  'valet.avgå.2': all(ground, rect(6, 20, 46, 92, '#f6efe2', 2, C.ink, 1.6), chair(26, 96, C.navy, 0.8), rect(14, 76, 30, 5, C.brown, 1, C.ink, 1.2), door(60, 112, 16, 60, '#7a5236'), fig(92, C.navy, 'calm'), reach(92, 1, -1, 80, 66), reach(92, 1, 1, 104, 66), box(92, 72, 1.1), arrow(104, 96, 116, 96, HL, 2)),
};
