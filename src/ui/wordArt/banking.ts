/**
 * Samhälle & institutioner → Ekonomi & arbetsliv → Banker & investeringar, 1551–1557 (0.32): bank
 * accounts and transfers, interest and bonds, shares and funds, risk and return, diversification, the
 * actors of the stock exchange and pension saving. Recurring signs: gold coins (money), a bank (columns
 * and a coin on the gable), an account card (navy card with a coin and a row of digits), a share
 * certificate (cream sheet with a small factory and a slice), a bond certificate (blue sheet with %), a
 * fund (a glass bowl holding several small papers), a price chart (green up, red down), the stock
 * exchange (a building with a board of arrows), the state (parliament with flag) and an older figure
 * for pension. Amounts and ages are digits only; a grey version is the contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, globe } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q0 = geo(x, h); return all(arm(side < 0 ? q0.sl : q0.sr, q0.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** An older figure: grey hair, a cane. */
const elder = (x: number, mood: Mood = 'smile', h = 0.8, top: string = C.purple) => { const k = geo(x, h); return all(fig(x, top, mood, { h, hair: '#d8d8d8' }), line(`M${f1(k.sr + 3)} ${f1(k.sy + 22 * h)} L${f1(k.sr + 5)} 112`, C.brown, 2.4)); };
/** A figure in a dark suit with a tie (professional). */
const suit = (x: number, mood: Mood = 'calm', h = 0.82) => { const k = geo(x, h); return all(fig(x, C.dark, mood, { h, bottom: C.dark }), path(`M${x} ${f1(k.sy - 2)} L${f1(x - 2)} ${f1(k.sy + 4)} L${x} ${f1(k.sy + 16 * h)} L${f1(x + 2)} ${f1(k.sy + 4)} Z`, RED, C.ink, 0.8)); };
const child = (x: number, top: string = C.yellow, mood: Mood = 'smile') => fig(x, top, mood, { h: 0.55 });
/** Speech/thought bubble beside the head of the figure at x. */
const think = (x: number, h: number, side: 1 | -1, w: number, hh: number, inner: (cx: number, cy: number) => Svg, dy = 0) => {
  const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2), cy = k.hy - 10 + dy;
  return all(ellipse(cx, cy, w / 2, hh / 2, C.white, C.ink, 1.5), circle(x + side * (k.hr + 3), k.hy - 2, 1.8, C.white, C.ink, 1), circle(x + side * (k.hr + 6), k.hy - 6, 2.6, C.white, C.ink, 1.1), inner(cx, cy));
};

// ── Marks ────────────────────────────────────────────────────────────
const pct = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '%', sz, col);
const plusB = (x: number, y: number, r = 8, col: string = C.green) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y} M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.5)}`, C.white, r * 0.28));
const minusB = (x: number, y: number, r = 8, col: string = RED) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, r * 0.28));
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 6 * s} ${y - 6 * s} L${x + 6 * s} ${y + 6 * s} M${x + 6 * s} ${y - 6 * s} L${x - 6 * s} ${y + 6 * s}`, col, 2.6 * s);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const ex = (x: number, y: number, sz = 14, col: string = RED) => T(x, y + sz * 0.36, '!', sz, col);
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));

// ── Money ────────────────────────────────────────────────────────────
const coin = (x: number, y: number, r = 6, col: string = C.gold) => all(circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.6, 'none', '#b88a20', 1));
const stack = (x: number, y: number, n = 4, r = 8, col: string = C.gold) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - 3 - i * 3.4, r, r * 0.42, col, C.ink, 1.1)));
const bill = (x: number, y: number, s = 1, col = '#8fc79a', rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-16, -9, 32, 18, col, 2, C.ink, 1.3), circle(0, 0, 5, 'rgba(255,255,255,0.55)', C.ink, 0.8), rect(-13, -6, 26, 12, 'none', 1, 'rgba(255,255,255,0.6)', 0.8));
const jar = (x: number, y: number, s = 1, fill = 0.5) => { const h = 34 * fill; return g(`translate(${x} ${y}) scale(${s})`, rect(-14, -20, 28, 38, 'rgba(220,240,252,0.55)', 5, C.ink, 1.6), fill > 0 ? rect(-12, 16 - h, 24, h, C.gold, 3, '#b88a20', 1) : '', ...Array.from({ length: Math.floor(h / 6) }, (_, i) => line(`M-10 ${f1(14 - i * 6)} L10 ${f1(14 - i * 6)}`, '#b88a20', 0.9)), rect(-12, -25, 24, 6, C.brown, 2, C.ink, 1.3)); };
/** A column of coins of height h standing on base. */
const column = (x: number, base: number, h: number, w = 16, col: string = C.gold) => { const n = Math.max(1, Math.round(h / 4)); return all(...Array.from({ length: n }, (_, i) => ellipse(x, base - 2 - i * (h / n), w / 2, 3, col, C.ink, 1))); };

// ── Institutions ─────────────────────────────────────────────────────
const bank = (x: number, y: number, s = 1, col = '#e8e2d4') => g(`translate(${x} ${y}) scale(${s})`, rect(-26, 14, 52, 6, C.grey2, 1, C.ink, 1.2), rect(-22, -6, 44, 20, col, 1, C.ink, 1.4), path('M-26 -6 L0 -22 L26 -6 Z', col, C.ink, 1.4), ...[-15, -5, 5, 15].map((cx) => rect(cx - 2.2, -4, 4.4, 18, C.white, 1, C.ink, 0.9)), coin(0, -11, 4.2));
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const parliament = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 10, 60, 5, C.grey2, 1, C.ink, 1.2), rect(-27, -10, 54, 20, '#efe6d2', 1, C.ink, 1.4), path('M-30 -10 L0 -24 L30 -10 Z', '#e2d6bc', C.ink, 1.4), ...[-20, -10, 0, 10, 20].map((cx) => rect(cx - 2, -8, 4, 18, C.white, 1, C.ink, 0.8)), line('M0 -24 L0 -36', C.ink, 1.4), flagSE(0, -36, 0.55));
/** A company: warm block with a sawtooth roof. */
const company = (x: number, y: number, s = 1, col = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1));
/** A tiny company icon (for charts, funds). */
const mini = (x: number, y: number, s = 1, col = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-8 6 L-8 -4 L-4 -1 L-4 -4 L0 -1 L0 -4 L4 -1 L8 -1 L8 6 Z', col, C.ink, 1));
const office = (x: number, y: number, s = 1, col = '#cfd8e2') => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -26, 36, 46, col, 1.5, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-13 + (i % 3) * 10, -21 + Math.floor(i / 3) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 8, 10, 12, C.brown, 0.5, C.ink, 1));
/** The stock exchange: a wide building with a board of up/down arrows. */
const exchange = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-34, 18, 68, 6, C.grey2, 1, C.ink, 1.2), rect(-30, -14, 60, 32, '#e6dccb', 1, C.ink, 1.4), path('M-34 -14 L0 -30 L34 -14 Z', '#d9ccb4', C.ink, 1.4), rect(-24, -10, 48, 16, C.dark, 2, C.ink, 1.2), path('M-18 2 L-14 -6 L-10 2 Z', C.green, null), path('M-4 -6 L0 2 L4 -6 Z', RED, null), path('M10 2 L14 -6 L18 2 Z', C.green, null), ...[-22, -10, 10, 22].map((cx) => rect(cx - 2, 7, 4, 11, C.white, 1, C.ink, 0.8)));

// ── Bank things ──────────────────────────────────────────────────────
/** An account: a card with a coin and a digit row; `inner` sits on the right. */
const acct = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -14, 44, 28, col, 4, C.ink, 1.6), coin(-12, -4, 5), rect(-18, 6, 22, 3, 'rgba(255,255,255,0.75)', 1, null), inner);
const screenL = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -28, 44, 28, C.dark, 2, C.ink, 1.4), rect(-19, -25, 38, 22, '#dff0fa', 1, null), inner, path('M-26 0 L26 0 L28 5 L-28 5 Z', C.grey, C.ink, 1.3));
const phoneB = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-11, -19, 22, 38, C.dark, 3, C.ink, 1.4), rect(-9, -15, 18, 28, '#dff0fa', 1, null), inner);
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
const page = (x: number, y: number, s = 1, inner: Svg = '', head: string = RED) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -14, 24, 28, C.white, 2, C.ink, 1.3), rect(-12, -14, 24, 6, head, 2, C.ink, 1.3), inner);
const idCard = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 16, '#f2cf6b', 2, C.ink, 1.2), circle(-6, -1, 3.4, C.skin, C.ink, 0.8), line('M1 -3 L9 -3 M1 1 L9 1 M-9 5 L9 5', C.grey, 1.4));
const shield = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const counter = (y = 80) => all(rect(30, y, 60, 32, '#c99a5b', 2, C.ink, 1.6), line(`M30 ${y + 6} L90 ${y + 6}`, C.ink, 1.2));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -14, 18, 3, C.brown, 1, C.ink, 1), rect(-9, 11, 18, 3, C.brown, 1, C.ink, 1), path('M-7 -11 L7 -11 L1 0 L7 11 L-7 11 L-1 0 Z', 'rgba(220,240,252,0.6)', C.ink, 1.2), path('M-4 8 L4 8 L6 11 L-6 11 Z M-1 -1 L1 -1 L0 4 Z', C.gold, null));

// ── Papers and funds ─────────────────────────────────────────────────
/** A share certificate: cream sheet with a company and a seal. */
const share = (x: number, y: number, s = 1, rot = 0, col = '#fbf1d2') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-14, -18, 28, 36, col, 2, C.ink, 1.6), rect(-11, -15, 22, 30, 'none', 1, '#c9a94a', 1), mini(0, -5, 0.9), line('M-7 7 L7 7', C.grey2, 1.6), circle(7, 12, 3.4, RED, C.ink, 0.8));
/** A bond certificate: blue sheet with % and a seal; `mark` replaces the default issuer sign. */
const bond = (x: number, y: number, s = 1, rot = 0, mark: Svg = '') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-14, -18, 28, 36, '#dbe8f7', 2, C.ink, 1.6), rect(-11, -15, 22, 30, 'none', 1, '#6c8fc0', 1), mark || '', pct(0, mark ? 4 : -4, 12, C.navy), line('M-7 9 L7 9', C.grey2, 1.6), circle(7, 13, 3, C.gold, C.ink, 0.8));
/** A fund: glass bowl with contents; `inner` is drawn in the bowl's own coordinates (centre 0,0). */
const fund = (x: number, y: number, s = 1, inner: Svg = '', col = 'rgba(220,240,252,0.6)') => g(`translate(${x} ${y}) scale(${s})`, path('M-24 -12 L24 -12 C24 10 14 20 0 20 C-14 20 -24 10 -24 -12 Z', col, C.ink, 1.8), ellipse(0, -12, 24, 4, 'rgba(255,255,255,0.7)', C.ink, 1.4), inner);
const fundShares = (n = 4) => all(...[[-12, 2], [0, 6], [12, 2], [-6, -4], [6, -5]].slice(0, n).map(([a, b]) => share(a!, b!, 0.36)));
const fundBonds = (n = 4) => all(...[[-12, 2], [0, 6], [12, 2], [-6, -4], [6, -5]].slice(0, n).map(([a, b]) => bond(a!, b!, 0.36)));
/** A price chart: frame with a polyline (points in frame coordinates 0…w, 0…h, y down). */
const chart = (x: number, y: number, w: number, h: number, pts: number[][], col: string = C.green, frame = true, sw = 2.6) => g(`translate(${x} ${y})`, frame ? rect(0, 0, w, h, C.white, 3, C.ink, 1.4) : '', frame ? line(`M6 ${h - 5} L${w - 4} ${h - 5}`, C.grey2, 1) : '', line('M' + pts.map(([a, b]) => `${a} ${b}`).join(' L'), col, sw));
const upLine = (w: number, h: number) => [[6, h - 8], [w * 0.3, h * 0.62], [w * 0.45, h * 0.7], [w * 0.65, h * 0.4], [w * 0.8, h * 0.45], [w - 6, 8]];
const zig = (w: number, h: number, a: number) => Array.from({ length: 9 }, (_, i) => [6 + i * (w - 12) / 8, h / 2 + (i % 2 ? -a : a) * (i === 0 || i === 8 ? 0.4 : 1)]);
/** A pie chart; parts are fractions with colours. */
const pie = (x: number, y: number, r: number, parts: [number, string][], pull = -1) => { let a0 = -Math.PI / 2; return all(...parts.map(([f, col], i) => { const a1 = a0 + f * Math.PI * 2, m = (a0 + a1) / 2, dx = i === pull ? Math.cos(m) * 5 : 0, dy = i === pull ? Math.sin(m) * 5 : 0; const p = `M${f1(x + dx)} ${f1(y + dy)} L${f1(x + dx + r * Math.cos(a0))} ${f1(y + dy + r * Math.sin(a0))} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${f1(x + dx + r * Math.cos(a1))} ${f1(y + dy + r * Math.sin(a1))} Z`; a0 = a1; return path(p, col, C.ink, 1.4); })); };
/** A risk scale 1–7 with the marked box. */
const riskScale = (x: number, y: number, w: number, mark: number) => { const cols = ['#4f9d69', '#7fb35a', '#b6c64a', '#f2c14e', '#ef9a3c', '#e8672c', '#d64545'], bw = w / 7; return all(...cols.map((c, i) => rect(x + i * bw, y, bw - 2, 14, i + 1 === mark ? c : 'rgba(200,200,200,0.5)', 2, C.ink, 1.1)), ...cols.map((_, i) => T(x + i * bw + bw / 2 - 1, y + 10.5, String(i + 1), 9, i + 1 === mark ? C.white : C.grey)), ring(x + (mark - 1) * bw + bw / 2 - 1, y + 7, bw * 0.7)); };
const basket = (x: number, y: number, s = 1, eggs = 0) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -8 C-10 -24 10 -24 10 -8', 'none', '#8a5a2a', 2.4), ...Array.from({ length: eggs }, (_, i) => ellipse(-9 + (i % 4) * 6, -9 - Math.floor(i / 4) * 5, 3.4, 4.2, '#fbf4e6', C.ink, 1)), path('M-15 -8 L15 -8 L11 8 L-11 8 Z', '#c99a5b', C.ink, 1.5), line('M-13 -3 L13 -3 M-12 2 L12 2', '#8a5a2a', 1));
const goldBar = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 4 L-7 -4 L7 -4 L10 4 Z', C.gold, C.ink, 1.3), line('M-6 -2 L6 -2', '#fff3b0', 1));
const house = (x: number, y: number, s = 1, col = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
const car = (x: number, y: number, s = 1, col: string = '#3a7bd5') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 4 L-20 -4 L-12 -6 L-6 -14 L10 -14 L16 -6 L22 -4 L22 4 Z', col, C.ink, 1.5), path('M-4 -12 L8 -12 L12 -6 L-8 -6 Z', '#bfe3f5', C.ink, 1), circle(-12, 5, 5, C.dark, C.ink, 1.2), circle(12, 5, 5, C.dark, C.ink, 1.2));
const briefcase = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -10 L-4 -13 L4 -13 L4 -10', 'none', C.ink, 1.6), rect(-12, -10, 24, 18, C.brown, 2, C.ink, 1.4), line('M-12 -3 L12 -3', C.ink, 1));
const padlock = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -4 L-6 -10 C-6 -18 6 -18 6 -10 L6 -4', 'none', C.ink, 2.4), rect(-9, -4, 18, 14, col, 2, C.ink, 1.5), circle(0, 3, 2, C.ink, null));
const crack = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -14 L-4 -6 L3 0 L-3 6 L1 14', C.ink, 1.8));
const scaleTilt = (x: number, y: number, s = 1, tilt = 0, l: Svg = '', r: Svg = '') => { const a = (tilt * Math.PI) / 180, dx = 22 * Math.cos(a), dy = 22 * Math.sin(a); const pan = (px: number, py: number, k: Svg) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 9)} ${f1(py + 12)} M${f1(px)} ${f1(py)} L${f1(px + 9)} ${f1(py + 12)}`, C.ink, 0.9), path(`M${f1(px - 12)} ${f1(py + 12)} C${f1(px - 9)} ${f1(py + 18)} ${f1(px + 9)} ${f1(py + 18)} ${f1(px + 12)} ${f1(py + 12)} Z`, C.gold, C.ink, 1.2), g(`translate(${f1(px)} ${f1(py + 6)})`, k)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 26 M-10 26 L10 26', C.ink, 2.4), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2.2), circle(0, -13, 2.6, C.gold, C.ink, 1), pan(-dx, -12 - dy, l), pan(dx, -12 + dy, r)); };

// ── Helpers for the pictures redrawn after blind test 1 (0.32) ──────
/** A bond with tear-off interest coupons along the bottom (each coupon with %). */
const couponBond = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -26, 40, 40, '#dbe8f7', 2, C.ink, 1.6), rect(-17, -23, 34, 34, 'none', 1, '#6c8fc0', 1), pct(0, -10, 14, C.navy), line('M-10 2 L10 2', C.grey2, 1.6), circle(12, 6, 3.4, C.gold, C.ink, 0.8), ...[-15, -5, 5, 15].map((cx) => all(rect(cx - 5, 14, 10, 10, '#eef4fb', 1, C.ink, 1), pct(cx, 19, 6, C.navy))), line('M-20 14 L20 14', C.ink, 1, '2 1.5'));
/** A lightning bolt (sudden loss). */
const strike = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const stormCloud = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', '#7d8590', C.ink, 1.4));
const warnTri = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -11 L11 8 L-11 8 Z', C.yellow, C.ink, 1.6), line('M0 -4 L0 2', C.ink, 2), circle(0, 5, 1.1, C.ink, null));
/** A flat map sheet with coloured regions, pins and a compass rose. */
const regionMap = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-40 -30 L-14 -34 L14 -30 L40 -34 L40 30 L14 34 L-14 30 L-40 34 Z', '#e8f2f8', C.ink, 1.6), path('M-32 -20 C-24 -26 -12 -24 -10 -14 C-8 -4 -20 2 -30 -4 C-36 -8 -36 -16 -32 -20 Z', '#a8dcc0', C.ink, 1.2), path('M-4 -22 C6 -28 22 -24 26 -14 C28 -6 18 0 8 -2 C0 -4 -8 -14 -4 -22 Z', '#f2d68a', C.ink, 1.2), path('M-20 8 C-12 2 2 4 4 14 C6 24 -10 28 -20 22 C-26 18 -26 12 -20 8 Z', '#f3b9a5', C.ink, 1.2), path('M14 8 C22 4 34 8 34 16 C34 24 22 26 16 20 C12 16 10 12 14 8 Z', '#c7b3e6', C.ink, 1.2), line('M-14 -34 L-14 30 M14 -30 L14 34', 'rgba(43,42,51,0.18)', 1));
const pin = (x: number, y: number, col: string = HL) => all(path(`M${x} ${y} C${x - 5} ${y - 7} ${x - 5} ${y - 12} ${x} ${y - 12} C${x + 5} ${y - 12} ${x + 5} ${y - 7} ${x} ${y} Z`, col, C.ink, 1), circle(x, y - 8, 1.6, C.white, null));
const compass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 10, C.white, C.ink, 1.4), path('M0 -9 L3 0 L0 9 L-3 0 Z', C.navy, null), path('M0 -9 L3 0 L-3 0 Z', RED, null), path('M-9 0 L0 -2 L9 0 L0 2 Z', C.grey, null));
const moneyBag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -12 L4 -12 L2 -8 L-2 -8 Z', '#b88a50', C.ink, 1.1), path('M-2 -8 C-14 -4 -14 12 0 12 C14 12 14 -4 2 -8 Z', '#c99a5b', C.ink, 1.4), coin(0, 3, 4));
/** A barrier gate with a coin box (a fee on every passage). */
const tollGate = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -8, 12, 30, C.grey2, 2, C.ink, 1.4), rect(-4, -4, 8, 6, C.dark, 1, null), line('M6 -2 L40 -2', RED, 4), line('M14 -2 L18 -2 M26 -2 L30 -2', C.white, 4));
const noSign = (x: number, y: number, r: number) => all(circle(x, y, r, 'none', RED, 4), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 4));
export const BANKING_MOTIFS: Record<string, Svg> = {
  // ── Bankkonton och överföringar ──
  'bank.bankkonto': all(bank(32, 82, 1.1), curveArrow('M56 66 C66 56 72 52 80 52', 80, 52, 0, C.green, 2.2), acct(92, 52, 0.9), stack(92, 98, 4, 9), coin(70, 44, 4), ground),
  'bank.öppna-ett-konto': all(counter(82), suit(88, 'smile', 0.8), fig(28, C.orange, 'smile', { h: 0.82 }), reach(28, 0.82, 1, 48, 74), idCard(52, 70, 0.8), reach(88, 0.8, -1, 70, 66), acct(64, 56, 0.55, C.navy, ''), plusB(64, 38, 7), sparkle(78, 44, 4)),
  'bank.lönekonto': all(company(24, 82, 0.8), page(24, 26, 0.8, T(0, 8, '25', 9)), curveArrow('M44 62 C56 50 70 48 78 52', 78, 52, 10, C.green, 2.4), bill(58, 44, 0.5), acct(92, 64, 0.95, C.green, briefcase(10, -1, 0.5)), ring(92, 64, 26), ground),
  'bank.sparkonto': all(acct(36, 40, 1, '#c79a2a', jar(10, -1, 0.32, 0.6)), column(30, 106, 16, 14), column(54, 106, 26, 14), column(78, 106, 38, 14), curveArrow('M24 80 C48 76 70 68 90 54', 90, 54, -35, C.green, 2), pct(100, 40, 14, C.green), ground),
  'bank.kontonummer': all(acct(60, 34, 1.4), rect(10, 70, 100, 22, C.white, 3, C.ink, 1.4), T(60, 86, '1234 567 890', 12, C.navy), ring(60, 81, 0, HL), rect(12, 72, 96, 18, 'none', 3, HL, 2.2), line('M60 54 L60 68', C.grey, 1.6, '3 2')),
  'bank.clearingnummer': all(bank(30, 38, 0.8), rect(8, 72, 104, 22, C.white, 3, C.ink, 1.4), T(78, 88, '567 890', 12, C.grey), T(29, 88, '1234', 12, C.navy), rect(10, 74, 38, 18, 'none', 3, HL, 2.4), arrow(30, 58, 30, 70, HL, 2.2), acct(90, 40, 0.7, C.grey)),
  'bank.internetbank': all(screenL(56, 78, 1.5, all(bank(0, -14, 0.34), coin(12, -10, 2.4), line('M-14 -6 L-4 -6', C.navy, 1.4))), fig(104, C.orange, 'smile', { h: 0.62 }), phoneB(18, 92, 0.7, bank(0, -2, 0.22)), ground),
  'bank.saldo': all(phoneB(44, 60, 2, all(acct(0, -6, 0.32), T(0, 8, '5 200', 6, C.navy))), mag(80, 64, 1.2), fig(102, C.orange, 'calm', { h: 0.62 }), ground),
  'bank.sätta-in': all(fig(24, C.orange, 'smile', { h: 0.82 }), reach(24, 0.82, 1, 50, 46), bill(56, 44, 0.6), arrow(70, 44, 80, 58, C.green, 2.4), acct(90, 74, 1, C.navy, plusB(10, -2, 5)), ground),
  'bank.insättning': all(rect(16, 14, 88, 92, C.white, 3, C.ink, 1.6), acct(34, 30, 0.5), ...[0, 1, 2, 3].map((i) => line(`M24 ${54 + i * 13} L70 ${54 + i * 13}`, C.grey2, 2)), plusB(88, 67, 6), T(88, 59, '', 1), minusB(88, 80, 5, C.grey2), minusB(88, 93, 5, C.grey2), greyed(plusB(88, 54, 5)), rect(20, 61, 80, 12, 'none', 2, HL, 2), arrow(116, 67, 100, 67, C.green, 2)),
  'bank.uttag.2': all(acct(30, 50, 1.1), stack(30, 96, 2, 9), greyed(stack(30, 84, 2, 9)), curveArrow('M56 50 C66 44 72 50 76 58', 76, 58, 60, RED, 2.4), bill(78, 74, 0.7), minusB(56, 30, 8), fig(106, C.orange, 'smile', { h: 0.5 }), ground),
  'bank.föra-över': all(acct(28, 56, 0.9), acct(92, 56, 0.9, C.green), curveArrow('M30 36 C50 18 70 18 90 36', 90, 36, 40, C.green, 2.6), coin(52, 24, 4.5), coin(64, 22, 4.5), phoneB(60, 92, 0.6, arrow(-5, 0, 5, 0, C.green, 1.6)), ground),
  'bank.stående-överföring': all(...[0, 1, 2].map((i) => all(page(22 + i * 38, 24, 0.75, T(0, 8, '26', 8)), curveArrow(`M${12 + i * 38} 64 C${18 + i * 38} 50 ${26 + i * 38} 50 ${32 + i * 38} 60`, 32 + i * 38, 60, 60, C.green, 1.8), coin(22 + i * 38, 50, 3.4))), acct(30, 86, 0.6), jar(94, 88, 0.6, 0.7), line('M44 86 L80 86', C.green, 1.6, '3 2'), ground),
  'bank.kontoutdrag': all(rect(18, 8, 84, 100, C.white, 3, C.ink, 1.6), acct(34, 22, 0.42), line('M50 18 L90 18 M50 26 L80 26', C.grey2, 2), ...[0, 1, 2, 3, 4, 5].map((i) => all(line(`M26 ${44 + i * 10} L40 ${44 + i * 10}`, C.grey, 1.6), line(`M46 ${44 + i * 10} L72 ${44 + i * 10}`, C.grey2, 1.6), i % 3 === 0 ? plusB(88, 44 + i * 10, 3.6) : minusB(88, 44 + i * 10, 3.6))), line('M26 102 L94 102', C.ink, 1.4)),
  'bank.insättningsgaranti': all(g('translate(28 70) rotate(-8)', bank(0, 0, 0.9)), crack(28, 70, 1.2), ex(10, 30, 16), shield(84, 60, 2.2, 'rgba(47,74,122,0.18)'), acct(84, 62, 0.6), flagSE(74, 18, 0.9), stack(84, 100, 2, 8), ground),

  // ── Räntor och obligationer ──
  'bank.obligation': all(fig(24, C.orange, 'smile', { h: 0.84 }), reach(24, 0.84, 1, 42, 66), couponBond(66, 60, 1.35), ...[0, 1, 2].map((i) => coin(98 + (i % 2) * 8, 92 - i * 10, 4)), curveArrow('M88 92 C80 104 60 106 44 100', 44, 100, 190, C.green, 1.8), ground),
  'bank.statsobligation': all(parliament(64, 44, 1), bond(36, 86, 0.9, -6, flagSE(-6, -14, 0.6)), bond(90, 86, 0.9, 6, flagSE(-6, -14, 0.6)), ground),
  'bank.företagsobligation': all(company(64, 40, 0.9), bond(36, 88, 0.9, -6, mini(0, -9, 0.8)), bond(90, 88, 0.9, 6, mini(0, -9, 0.8)), ground),
  'bank.låna-upp': all(parliament(60, 40, 0.95), ...[16, 40, 80, 104].map((x, i) => all(fig(x, [C.orange, C.green, C.sky, C.purple][i]!, 'smile', { h: 0.42 }), arrow(x, 76, x + (60 - x) * 0.45, 62, C.green, 1.8))), stack(60, 104, 5, 10), ground),
  'bank.löptid': all(coin(14, 50, 6), arrow(22, 50, 32, 50, C.green, 1.8), line('M30 64 L100 64', C.ink, 2), ...[0, 1, 2, 3, 4, 5].map((i) => all(line(`M${30 + i * 14} 60 L${30 + i * 14} 68`, C.ink, 1.6), i ? T(30 + i * 14, 80, String(i), 9, C.navy) : '')), line('M30 40 L100 40', HL, 2.4), arrow(64, 40, 100, 40, HL, 2.4), arrow(64, 40, 30, 40, HL, 2.4), coin(108, 50, 6), bond(64, 98, 0.6), hourglass(18, 94, 0.8)),
  'bank.förfalla': all(page(30, 36, 1.6, ring(4, 6, 7)), bond(30, 88, 0.8), curveArrow('M48 82 C64 76 76 72 84 66', 84, 66, -30, C.green, 2.4), stack(96, 74, 5, 10), ground),
  'bank.ränteintäkt': all(bond(26, 50, 1), acct(84, 74, 1, C.navy), ...[0, 1, 2].map((i) => coin(46 + i * 10, 46 + i * 7, 4.2)), curveArrow('M40 40 C56 36 70 46 76 58', 76, 58, 60, C.green, 2.2), pct(60, 24, 14, C.green), plusB(102, 52, 7), ground),
  'bank.placera.2': all(fig(22, C.orange, 'calm', { h: 0.8 }), reach(22, 0.8, 1, 44, 52), stack(44, 50, 2, 6), curveArrow('M50 42 C62 26 78 24 88 30', 88, 30, 20, HL, 2), curveArrow('M52 56 C66 60 76 70 82 78', 82, 78, 60, HL, 2), bond(98, 32, 0.6), jar(96, 86, 0.6, 0.4), ground),
  'bank.placering': all(bond(34, 54, 1.4), stack(34, 104, 3, 10), ring(34, 54, 30), greyed(jar(92, 84, 0.7, 0.4), coin(92, 36, 8)), ground),
  'bank.räntepapper': all(bond(40, 66, 1, -12), bond(60, 62, 1, 0), bond(80, 66, 1, 12), ground),
  'bank.räntebärande': all(greyed(doc(28, 60, 1.2)), bond(86, 60, 1.2), coin(108, 30, 4), coin(112, 44, 4), sparkle(100, 22, 4), arrow(98, 36, 106, 30, C.green, 1.4), ground),
  'bank.kreditvärdighet': all(parliament(30, 44, 0.65), okB(30, 76, 9), company(90, 50, 0.6, '#d9c39a'), crack(90, 50, 0.8), noB(90, 80, 9), line('M60 20 L60 104', C.grey2, 1.4, '3 3'), pct(18, 98, 11, C.green), pct(102, 98, 16, RED)),
  'bank.nominell-ränta': all(rect(18, 50, 84, 20, HL, 2, C.ink, 1.6), T(60, 40, '3 %', 20, C.navy), line('M74 50 L74 70', C.white, 1.4, '3 2'), ring(60, 34, 22, C.green), ground),
  'bank.realränta': all(rect(18, 50, 84, 20, C.white, 2, C.ink, 1.6), rect(18, 50, 28, 20, C.green, 2, C.ink, 1.6), greyed(rect(46, 50, 56, 20, C.grey, 2, C.ink, 1.2)), line('M50 50 L98 70 M98 50 L50 70', RED, 2), T(32, 40, '1 %', 14, C.green), T(74, 40, '−2 %', 12, RED), T(60, 96, '3 % − 2 % = 1 %', 11, C.navy)),

  // ── Aktier och fonder ──
  'bank.aktie': all(company(42, 66, 1.3), line('M42 32 L42 94 M14 64 L70 64', C.white, 2.4, '4 3'), share(92, 60, 1.2, 8), arrow(62, 50, 76, 50, HL, 2), ground),
  'bank.aktieägare': all(company(92, 76, 0.9), fig(36, C.orange, 'laugh', { h: 0.86 }), reach(36, 0.86, 1, 60, 60), share(64, 56, 0.8, 8), ring(36, 50, 24), ground),
  'bank.aktiekurs': all(share(24, 76, 0.9), chart(48, 26, 64, 52, upLine(64, 52), C.green), T(80, 96, '128', 14, C.navy), rect(60, 84, 40, 16, 'none', 3, HL, 2), ground),
  'bank.utdelning': all(company(60, 40, 0.8), ...[20, 60, 100].map((x) => all(fig(x, C.orange, 'smile', { h: 0.48 }), share(x + 9, 96, 0.3))), curveArrow('M46 52 C34 58 26 64 22 72', 22, 72, 110, C.green, 2), curveArrow('M60 64 L60 76', 60, 76, 90, C.green, 2), curveArrow('M74 52 C86 58 94 64 98 72', 98, 72, 70, C.green, 2), coin(30, 60, 3.6), coin(66, 70, 3.6), coin(90, 60, 3.6), ground),
  'bank.fond': all(fund(60, 66, 1.5, fundShares(5)), ...[14, 106].map((x) => fig(x, x < 60 ? C.orange : C.green, 'smile', { h: 0.5 })), coin(30, 34, 4), coin(90, 34, 4), arrow(24, 54, 34, 46, C.green, 1.6), arrow(96, 54, 86, 46, C.green, 1.6), ground),
  'bank.fondandel': all(fund(40, 52, 1.3, pie(0, 2, 13, [[0.2, HL], [0.8, '#cfd8e2']], 0)), curveArrow('M58 44 C68 40 74 46 76 56', 76, 56, 70, HL, 2), path('M72 80 L72 66 A14 14 0 0 1 85 74 Z', HL, C.ink, 1.4), fig(102, C.orange, 'smile', { h: 0.6 }), ground),
  'bank.värdepapper': all(share(36, 60, 1.3, -14), bond(62, 56, 1.3, 0), share(88, 60, 1.3, 14, '#e6f2d8'), ground),
  'bank.aktiefond': all(fund(60, 64, 1.7, fundShares(5)), greyed(bond(104, 30, 0.5)), cross(104, 30, 1.2), ground),
  'bank.räntefond': all(fund(60, 64, 1.7, fundBonds(5)), greyed(share(104, 30, 0.5)), cross(104, 30, 1.2), ground),
  'bank.blandfond': all(fund(60, 64, 1.7, all(share(-12, 2, 0.36), bond(0, 6, 0.36), share(12, 2, 0.36), bond(-6, -4, 0.36), share(6, -5, 0.36))), ground),
  'bank.index': all(chart(16, 14, 88, 52, [[6, 40], [20, 34], [34, 38], [48, 26], [62, 30], [76, 16], [82, 12]], C.navy), ...[22, 42, 62, 82, 102, 32, 52, 72, 92].map((x, i) => mini(x - 4, i < 5 ? 86 : 100, 0.9)), line('M14 74 L106 74', C.grey, 1.4, '3 2'), arrow(60, 74, 60, 68, C.grey, 1.4)),
  'bank.indexfond': all(chart(10, 12, 48, 34, [[4, 28], [14, 22], [24, 24], [34, 14], [44, 8]], C.navy), ...[16, 30, 44].map((x) => mini(x, 56, 0.7)), T(64, 50, '=', 18, HL), fund(90, 70, 1.1, all(mini(-8, 0, 0.7), mini(6, 0, 0.7), mini(-1, -7, 0.7))), T(90, 104, '0,2 %', 10, C.green), ground),
  'bank.förvaltningsavgift': all(fund(46, 62, 1.6, fundShares(4)), suit(100, 'calm', 0.62), curveArrow('M70 76 C80 78 86 80 90 84', 90, 84, 20, RED, 1.8), coin(80, 74, 3.4), pct(82, 52, 12, RED), page(100, 26, 0.6), ground),
  'bank.fondspara': all(fig(22, C.orange, 'smile', { h: 0.82 }), reach(22, 0.82, 1, 44, 52), coin(48, 50, 5), curveArrow('M54 46 C62 38 70 40 74 48', 74, 48, 60, C.green, 2), fund(84, 74, 1.1, fundShares(4)), ground),
  'bank.månadsspara': all(...[0, 1, 2].map((i) => all(page(22 + i * 38, 24, 0.75, T(0, 8, String(i + 1), 9)), coin(22 + i * 38, 48, 4), arrow(22 + i * 38, 54, 22 + i * 38 + (60 - (22 + i * 38)) * 0.35, 66, C.green, 1.6))), fund(60, 90, 1, fundShares(4)), ground),
  'bank.investeringssparkonto': all(rect(10, 24, 72, 62, C.navy, 5, C.ink, 1.8), coin(22, 36, 5), fund(46, 62, 0.8, fundShares(3)), share(70, 56, 0.45), office(102, 82, 0.5), curveArrow('M82 40 C92 38 98 44 100 52', 100, 52, 80, C.grey, 1.6), coin(92, 36, 3), ground),

  // ── Risk och avkastning ──
  'bank.risk': all(path('M4 112 L4 70 L60 70 L60 112 Z', '#b9a38a', C.ink, 1.6), line('M60 70 L60 112', C.ink, 1.6), stack(52, 70, 5, 8), g('translate(0 -42)', fig(26, C.orange, 'shock', { h: 0.42 })), arrow(68, 70, 80, 100, RED, 2), coin(86, 104, 4), ex(96, 40, 22), line('M64 112 L116 112', C.grey2, 2)),
  'bank.avkastning': all(greyed(column(30, 104, 40, 22)), column(80, 104, 40, 22), column(80, 64, 18, 22, '#9fd48a'), plusB(80, 30, 9), pct(102, 50, 14, C.green), arrow(46, 70, 62, 70, HL, 2.2), ground),
  'bank.riskfylld': all(path('M4 72 L4 44 L28 44 L28 72 Z', '#b9a38a', C.ink, 1.4), path('M92 72 L92 44 L116 44 L116 72 Z', '#b9a38a', C.ink, 1.4), path('M28 44 L50 45 L54 48 L58 44 L92 44', 'none', '#8a5a2a', 2.4), crack(60, 48, 0.4), stack(60, 44, 4, 8), warnTri(60, 18, 1.1), line('M44 50 L40 66 M74 50 L80 66', C.grey, 1.2, '2 2'), greyed(rect(4, 92, 112, 18, '#b9a38a', 1, C.ink, 1.2), stack(60, 92, 4, 8)), ground),
  'bank.riskfri': all(acct(40, 40, 1.1), shield(40, 40, 2.4, 'rgba(47,74,122,0.18)'), chart(72, 20, 42, 34, [[4, 18], [38, 18]], C.green), greyed(chart(72, 62, 42, 34, zig(42, 34, 9), RED)), okB(40, 90, 9), ground),
  'bank.risknivå': all(fund(60, 44, 1.2, fundShares(3)), riskScale(12, 82, 98, 4), ground),
  'bank.svänga.2': all(chart(10, 24, 100, 64, zig(100, 64, 18), C.navy), arrow(30, 22, 30, 8, C.green, 2), arrow(60, 22, 60, 8, C.green, 2), arrow(45, 92, 45, 106, RED, 2), arrow(75, 92, 75, 106, RED, 2)),
  'bank.volatil': all(chart(10, 10, 100, 46, [[6, 24], [14, 6], [22, 40], [30, 10], [38, 38], [46, 4], [54, 36], [62, 8], [70, 40], [78, 12], [86, 34], [94, 18]], RED), greyed(chart(10, 64, 100, 42, [[6, 22], [94, 18]], C.ink)), ex(104, 18, 12)),
  'bank.kursuppgång': all(chart(30, 18, 84, 70, upLine(84, 70), C.green), arrow(96, 64, 110, 30, C.green, 3.4), fig(14, C.orange, 'laugh', { h: 0.5 }), ground),
  'bank.kursfall': all(chart(6, 12, 84, 70, [[6, 14], [26, 18], [42, 12], [50, 46], [58, 56], [78, 62]], RED), arrow(48, 18, 64, 60, RED, 3.4), fig(104, C.orange, 'shock', { h: 0.5 }), ground),
  'bank.värdeökning': all(house(26, 46, 1.3), greyed(column(26, 104, 18, 18)), house(86, 46, 1.3), column(86, 104, 42, 18), arrow(46, 82, 66, 82, HL, 2.2), arrow(108, 96, 108, 60, C.green, 2.6), ground),
  'bank.värdeminskning': all(car(28, 46, 1), column(28, 104, 42, 18), g('translate(88 46)', car(0, 0, 1, '#7a9cc8')), column(88, 104, 16, 18), arrow(48, 82, 68, 82, HL, 2.2), arrow(110, 60, 110, 96, RED, 2.6), ground),
  'bank.sparhorisont': all(fig(16, C.orange, 'smile', { h: 0.55 }), line('M28 104 C50 96 70 70 108 40', C.grey, 3, '5 4'), ...[0, 1, 2, 3].map((i) => page(40 + i * 20, 100 - i * 18 - 14, 0.5)), line('M108 40 L108 14', C.ink, 1.6), path('M108 14 L122 19 L108 24 Z', HL, C.ink, 1), jar(106, 70, 0.55, 0.9), ground),
  'bank.på-kort-sikt': all(chart(8, 30, 104, 56, [[6, 44], [20, 30], [30, 38], [40, 22], [50, 34], [58, 18], [66, 40], [76, 28], [86, 30], [98, 12]], C.navy), rect(54, 32, 22, 52, 'rgba(228,87,46,0.18)', 2, HL, 2), hourglass(65, 18, 0.7)),
  'bank.på-lång-sikt': all(chart(8, 30, 104, 56, [[6, 44], [20, 30], [30, 38], [40, 22], [50, 34], [58, 18], [66, 40], [76, 28], [86, 30], [98, 12]], C.navy), line('M14 76 L106 40', C.green, 2.4, '5 3'), rect(10, 32, 100, 52, 'none', 2, HL, 2), page(20, 16, 0.5), page(100, 16, 0.5), arrow(34, 14, 86, 14, HL, 1.8)),
  'bank.garanterad': all(doc(44, 56, 1.8, all(circle(6, 10, 6, RED, C.ink, 0.8), pct(-2, -6, 10)), 3), shield(92, 46, 1.2, C.navy, okB(0, 0, 6)), stack(92, 100, 3, 9), ground),

  // ── Diversifiering ──
  'bank.diversifiera': all(stack(60, 30, 4, 10), arrow(52, 34, 20, 66, HL, 2), arrow(56, 36, 46, 66, HL, 2), arrow(64, 36, 74, 66, HL, 2), arrow(68, 34, 100, 66, HL, 2), share(18, 88, 0.7), bond(44, 88, 0.7), house(74, 92, 0.9), globe(100, 90, 11), ground),
  'bank.diversifiering': all(pie(36, 56, 26, [[0.25, '#e9c27a'], [0.2, '#8cc7e8'], [0.15, '#a8dcc0'], [0.2, C.gold], [0.2, '#c7b3e6']]), greyed(circle(96, 56, 16, '#e9c27a', C.ink, 1.4)), T(66, 62, '≠', 16, C.grey), ground),
  'bank.riskspridning': all(greyed(column(26, 52, 26, 22)), stormCloud(26, 14, 0.8), strike(26, 26, 0.8), cross(26, 40, 1.6), line('M4 56 L116 56', C.grey2, 1.4, '3 3'), ...[0, 1, 2, 3].map((i) => all(i === 0 ? '' : column(52 + i * 20, 102, 14, 14), i === 0 ? cross(52, 92, 1) : okB(52 + i * 20, 74, 5))), stormCloud(52, 64, 0.6), strike(52, 76, 0.6), ground),
  'bank.sprida-riskerna': all(fig(20, C.orange, 'calm', { h: 0.8 }), reach(20, 0.8, 1, 40, 66), coin(44, 64, 4.5), arrow(50, 60, 62, 48, HL, 1.8), arrow(50, 66, 66, 72, HL, 1.8), arrow(48, 72, 58, 96, HL, 1.8), jar(76, 44, 0.45, 0.4), jar(80, 76, 0.45, 0.4), jar(70, 100, 0.4, 0.4), stormCloud(102, 18, 0.8), strike(102, 32, 0.7), jar(104, 56, 0.45, 0), crack(104, 56, 0.6), okB(80, 60, 4), okB(70, 84, 4), ground),
  'bank.lägga-alla-ägg-i-samma-korg': all(fig(60, C.orange, 'calm', { h: 0.82 }), reach(60, 0.82, 1, 86, 72), basket(90, 76, 1.3, 11), greyed(basket(22, 104, 0.8), basket(36, 104, 0.8)), ground),
  'bank.portfölj': all(share(40, 46, 0.8, -10), bond(62, 40, 0.8, 0), pie(84, 48, 11, [[0.5, '#e9c27a'], [0.3, '#8cc7e8'], [0.2, '#a8dcc0']]), rect(18, 58, 84, 46, C.brown, 6, C.ink, 1.8), path('M48 58 L48 50 C48 46 72 46 72 50 L72 58', 'none', C.ink, 2.4), rect(18, 70, 84, 4, '#7a4a2a', 0, null), rect(55, 66, 10, 10, C.gold, 2, C.ink, 1.2), ground),
  'bank.tillgångsslag': all(...[[30, 34], [90, 34], [30, 84], [90, 84]].map(([x, y]) => rect(x! - 24, y! - 22, 48, 44, C.white, 4, C.ink, 1.4)), share(30, 34, 0.8), bond(90, 34, 0.8), house(30, 86, 1.4), goldBar(84, 82, 1.2), goldBar(98, 82, 1.2), goldBar(91, 74, 1.2)),
  'bank.fördelning': all(pie(44, 58, 34, [[0.6, '#e9c27a'], [0.4, '#8cc7e8']]), share(98, 34, 0.6), T(98, 58, '60 %', 11, C.navy), bond(98, 80, 0.6), T(98, 104, '40 %', 11, C.navy)),
  'bank.geografisk': all(regionMap(58, 58, 1.3), pin(22, 36), pin(66, 30), pin(36, 82), pin(94, 76), compass(100, 22, 1.1), mag(40, 52, 0.9)),
  'bank.motverka': all(chart(10, 16, 70, 60, [[6, 12], [24, 18], [40, 44], [64, 50]], RED), arrow(38, 24, 52, 52, RED, 2.6), arrow(106, 92, 70, 60, C.green, 3.4), fund(100, 96, 0.5, fundBonds(3)), ground),
  'bank.jämna-ut': all(chart(10, 10, 100, 34, zig(100, 34, 10), C.navy, false, 2), chart(10, 10, 100, 34, zig(100, 34, -10), C.orange, false, 2), arrow(60, 50, 60, 64, HL, 2.4), chart(10, 70, 100, 34, [[6, 17], [94, 17]], C.green)),
  'bank.ombalansera': all(pie(24, 46, 18, [[0.8, '#e9c27a'], [0.2, '#8cc7e8']]), arrow(46, 46, 70, 46, HL, 2.4), pie(94, 46, 18, [[0.6, '#e9c27a'], [0.4, '#8cc7e8']]), curveArrow('M30 74 C46 90 74 90 90 74', 90, 74, -40, HL, 1.8), scaleTilt(60, 96, 0.5, 0), ground),

  // ── Börsens aktörer ──
  'bank.börs': all(exchange(60, 72, 1.5), ground),
  'bank.börsnoterad': all(company(24, 84, 0.7, '#7fc4a0'), rect(46, 10, 68, 70, C.dark, 3, C.ink, 1.6), ...[0, 1, 2, 3].map((i) => all(mini(58, 22 + i * 16, 0.8, i === 2 ? '#7fc4a0' : '#e9c27a'), T(80, 26 + i * 16, ['84', '112', '57', '230'][i]!, 9, C.white), i % 2 ? path(`M98 ${26 + i * 16} L102 ${20 + i * 16} L106 ${26 + i * 16} Z`, C.green, null) : path(`M98 ${20 + i * 16} L102 ${26 + i * 16} L106 ${20 + i * 16} Z`, RED, null))), rect(48, 46, 64, 16, 'none', 2, HL, 2.4), line('M40 74 C46 66 46 60 48 56', HL, 1.8, '3 2'), ground),
  'bank.aktiemarknad': all(chart(14, 8, 92, 34, [[6, 26], [30, 18], [50, 22], [70, 10], [86, 6]], C.green, false), ...[14, 42, 78, 106].map((x, i) => fig(x, [C.orange, C.green, C.sky, C.purple][i]!, 'smile', { h: 0.44 })), share(28, 70, 0.5, -10), share(60, 64, 0.5), share(92, 70, 0.5, 10), arrow(34, 60, 52, 58, HL, 1.4), arrow(70, 58, 86, 62, HL, 1.4), ground),
  'bank.finansmarknad': all(globe(60, 60, 30), coin(18, 30, 6), share(102, 30, 0.6), bond(18, 92, 0.6), pct(102, 92, 16), curveArrow('M26 34 C40 24 50 26 56 30', 56, 30, 20, HL, 1.6), curveArrow('M94 36 C86 30 78 30 72 32', 72, 32, 170, HL, 1.6), curveArrow('M26 88 C34 92 40 92 46 88', 46, 88, -20, HL, 1.6), curveArrow('M96 86 C88 92 80 92 74 88', 74, 88, 200, HL, 1.6)),
  'bank.mäklare.2': all(fig(16, C.orange, 'smile', { h: 0.62 }), phoneB(32, 80, 0.45), arrow(40, 70, 50, 70, HL, 1.8), suit(62, 'calm', 0.72), arrow(74, 70, 84, 70, HL, 1.8), exchange(100, 84, 0.45), share(62, 22, 0.5), ground),
  'bank.courtage': all(fig(14, C.orange, 'calm', { h: 0.7 }), share(34, 70, 0.5), arrow(42, 70, 52, 70, HL, 1.6), tollGate(60, 72, 1), arrow(104, 66, 112, 66, HL, 1.6), exchange(100, 100, 0.32), coin(60, 50, 4.5), arrow(60, 56, 60, 62, C.gold, 1.6), ring(60, 50, 9), ...[0, 1, 2].map((i) => coin(52 + i * 8, 102, 3.4)), ground),
  'bank.köpkurs': all(rect(10, 16, 100, 40, C.dark, 3, C.ink, 1.4), T(34, 42, '102', 16, C.green), greyed(T(86, 42, '103', 16, C.white)), rect(14, 20, 42, 32, 'none', 3, HL, 2.4), fig(34, C.orange, 'smile', { h: 0.52 }), coin(52, 86, 5), greyed(fig(86, C.green, 'smile', { h: 0.52 })), ground),
  'bank.säljkurs': all(rect(10, 16, 100, 40, C.dark, 3, C.ink, 1.4), greyed(T(34, 42, '102', 16, C.white)), T(86, 42, '103', 16, RED), rect(64, 20, 42, 32, 'none', 3, HL, 2.4), greyed(fig(34, C.orange, 'smile', { h: 0.52 })), fig(86, C.green, 'smile', { h: 0.52 }), share(104, 90, 0.4), ground),
  'bank.investerare': all(fig(28, C.green, 'laugh', { h: 0.84 }), moneyBag(46, 92, 1.1), ring(30, 64, 24), arrow(46, 50, 74, 30, HL, 1.8), arrow(48, 60, 76, 64, HL, 1.8), arrow(46, 74, 74, 96, HL, 1.8), company(96, 30, 0.45), share(96, 64, 0.6), house(96, 98, 0.9), ground),
  'bank.småsparare': all(fig(30, C.orange, 'smile', { h: 0.6 }), stack(52, 104, 2, 6), ring(36, 82, 26), greyed(office(88, 82, 1)), ground),
  'bank.institutionell-investerare': all(office(36, 74, 1.2), shield(36, 32, 0.6), column(84, 104, 60, 28), share(102, 44, 0.5), greyed(fig(108, C.orange, 'smile', { h: 0.34 })), ground),
  'bank.fondförvaltare': all(suit(26, 'calm', 0.8), reach(26, 0.8, 1, 48, 60), share(52, 56, 0.5), arrow(60, 60, 70, 66, HL, 1.8), fund(90, 82, 1, fundShares(3)), ...[70, 90, 110].map((x) => mini(x, 24, 0.9)), mag(96, 38, 0.6), ground),
  'bank.analytiker': all(suit(28, 'calm', 0.8), think(28, 0.8, 1, 40, 24, (cx, cy) => all(chart(cx - 14, cy - 9, 28, 18, upLine(28, 18), C.green, false, 1.6))), company(90, 82, 0.6), mag(70, 80, 1.1), doc(104, 46, 0.5, okB(0, 8, 4), 3), ground),
  'bank.börsintroduktion': all(exchange(84, 72, 1), company(22, 86, 0.6), arrow(38, 74, 58, 66, HL, 2.6), sparkle(84, 36, 6), sparkle(100, 30, 4), mini(84, 70, 1), ring(84, 70, 9), ground),
  'bank.insiderhandel': all(suit(22, 'calm', 0.8), think(22, 0.8, 1, 36, 24, (cx, cy) => all(padlock(cx - 8, cy + 4, 0.55), path(`M${cx + 2} ${cy - 6} L${cx + 8} ${cy} L${cx + 14} ${cy + 6}`, 'none', RED, 2), path(`M${cx + 14} ${cy + 6} l-5 0 l5 -5 Z`, RED, null))), share(46, 80, 0.55), arrow(56, 80, 74, 80, HL, 1.8), exchange(96, 92, 0.42), greyed(fig(98, C.green, 'smile', { h: 0.5 })), noSign(60, 80, 22), ground),

  // ── Pensionssparande ──
  'bank.pensionssystem': all(rect(14, 60, 28, 48, '#dbe8f7', 2, C.ink, 1.4), flagSE(18, 66, 1), rect(46, 60, 28, 48, '#f3e2c0', 2, C.ink, 1.4), mini(60, 78, 1.1), rect(78, 60, 28, 48, '#e2f2dc', 2, C.ink, 1.4), jar(92, 84, 0.5, 0.5), rect(10, 52, 100, 8, C.grey, 2, C.ink, 1.4), g('translate(0 -60)', elder(60, 'smile', 0.42)), ground),
  'bank.pensionsavgift': all(bill(40, 50, 2.2), path('M66 30 L76 30 L76 70 L66 70 Z', HL, C.ink, 1.4), arrow(80, 50, 92, 62, HL, 2.2), T(70, 88, '18,5 %', 11, C.navy), elder(104, 'smile', 0.5), ground),
  'bank.inkomstpension': all(flagSE(4, 4, 0.8), briefcase(18, 34, 0.8), bill(44, 34, 0.7), bill(44, 26, 0.7), bill(44, 18, 0.7), arrow(62, 26, 76, 26, C.green, 2), g('translate(0 -54)', elder(102, 'laugh', 0.42)), column(84, 58, 26, 12), line('M4 62 L116 62', C.grey2, 1.4, '3 3'), greyed(briefcase(18, 86, 0.8), bill(44, 86, 0.7), arrow(62, 86, 76, 86, C.green, 2), column(84, 108, 8, 12), elder(102, 'smile', 0.36))),
  'bank.premiepension': all(bill(24, 30, 1.4), path('M42 21 L48 21 L48 39 L42 39 Z', HL, C.ink, 1.2), curveArrow('M46 44 C50 56 52 60 54 64', 54, 64, 80, HL, 2), fund(56, 82, 0.9, fundShares(3)), arrow(80, 84, 90, 84, C.green, 2), elder(104, 'smile', 0.6), ground),
  'bank.privat-pensionssparande': all(...[0, 1, 2].map((i) => rect(10 + i * 34, 58, 30, 50, i === 2 ? '#e2f2dc' : 'rgba(200,200,200,0.4)', 2, C.ink, 1.3)), greyed(flagSE(15, 66, 1), mini(59, 80, 1)), jar(93, 84, 0.6, 0.6), ring(93, 82, 20), rect(6, 50, 104, 8, C.grey, 2, C.ink, 1.4), g('translate(0 -62)', elder(56, 'smile', 0.42))),
  'bank.pensionsspara': all(fig(20, C.orange, 'smile', { h: 0.82 }), reach(20, 0.82, 1, 42, 60), coin(46, 58, 5), jar(62, 86, 0.8, 0.5), line('M76 86 L90 86', C.grey, 1.6, '3 2'), elder(104, 'smile', 0.82, C.orange), arrow(30, 16, 90, 16, C.grey, 1.6), ground),
  'bank.pensionskapital': all(jar(46, 74, 1.6, 0.9), elder(98, 'laugh', 0.76), sparkle(26, 22, 5), ground),
  'bank.pensionsprognos': all(screenL(46, 82, 1.5, all(line('M-16 -6 L-2 -12', C.navy, 1.6), line('M-2 -12 L14 -20', C.navy, 1.6, '2 2'), q(14, -10, 8))), think(96, 0.6, -1, 26, 18, (cx, cy) => all(stack(cx - 4, cy + 6, 3, 5), q(cx + 7, cy, 9))), fig(100, C.orange, 'calm', { h: 0.6 }), ground),
  'bank.riktålder': all(line('M8 30 L112 30', C.ink, 2), ...[20, 40, 60, 80, 100].map((x, i) => all(line(`M${x} 26 L${x} 34`, C.ink, 1.6), i < 4 ? T(x, 48, String([27, 37, 47, 57][i]), 9, C.grey) : '')), rect(86, 18, 28, 36, 'none', 3, HL, 2.4), T(100, 48, '67', 12, HL), fig(30, C.orange, 'calm', { h: 0.4 }), briefcase(40, 102, 0.5), elder(100, 'laugh', 0.4), arrow(52, 96, 84, 96, HL, 2)),
  'bank.livsvarig': all(elder(18, 'smile', 0.62), ...[0, 1, 2, 3, 4].map((i) => all(page(42 + i * 15, 32, 0.4), coin(42 + i * 15, 48, 3.4))), line('M36 62 L104 62', C.green, 2, '4 3'), T(110, 68, '∞', 16, C.green), ground),
  'bank.efterlevandeskydd': all(rect(10, 18, 28, 34, C.white, 2, C.ink, 1.6), greyed(circle(24, 30, 6, C.skin, C.ink, 1), path('M14 48 C14 38 34 38 34 48 Z', C.grey, C.ink, 1)), curveArrow('M38 40 C50 32 60 34 66 40', 66, 40, 50, C.green, 2), coin(52, 30, 4), shield(84, 74, 2.6, 'rgba(47,74,122,0.15)'), fig(76, C.orange, 'calm', { h: 0.72 }), child(98, C.yellow), ground),
};
