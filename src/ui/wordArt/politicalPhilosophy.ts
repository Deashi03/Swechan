/**
 * Historia & humaniora → Filosofi & etik → Politisk filosofi, 2231–2237 (0.39): freedom and coercion, the state and
 * legitimacy, power and authority, individual and collective, rights, the social contract, democracy and justice.
 * Abstract words are symbolic mini-scenes: the coloured idea dominates and a grey copy stands beside it as contrast.
 * The state is a neutral pillared building, the law a closed book, rights a shield, power a raised seat. Flags are
 * plain colour fields, crowns plain gold bands. Digits, ? and ! only; no words, no letters and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { T, arm, cloud } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const DUSK = '#f3d9c8';
const PARCH = '#f3e6c4';
const STONE = '#d8cfb8';
const GRASS = '#7fbf6a';
const GREY = '#8d949c';
const OK = '#3f9a5a';
const NAVY = C.navy;
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** A standing figure; feet at y0 (default the ground). */
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${y0 - 112})`, F({ x, top, mood, ...more }));
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
/** Both arms up (cheering, voting). */
const armsUp = (x: number, h = 1, y0 = 112) => { const q = geo(x, h, y0); return all(reach(x, h, -1, q.sl - 6 * q.s, q.hy - 14 * q.s, y0), reach(x, h, 1, q.sr + 6 * q.s, q.hy - 14 * q.s, y0)); };
/** One arm raised (a vote). */
const handUp = (x: number, h = 1, y0 = 112) => { const q = geo(x, h, y0); return reach(x, h, 1, q.sr + 2 * q.s, q.hy - 18 * q.s, y0); };
/** A small crowd of figures (xs), same height. */
const crowd = (xs: number[], h: number, cols: string[], mood: Mood = 'smile', y0 = 112) => all(...xs.map((x, i) => fig(x, cols[i % cols.length]!, mood, { h, hairStyle: i % 2 ? 'long' : 'short' }, y0)));
const PALETTE = [C.orange, C.green, C.denim, C.purple, C.red, '#3f9a9a'];
const robe = (x: number, h: number, col: string, y0 = 112) => { const s = 0.84 * h; return g(`translate(${x} ${f1(y0 - 49 * s)}) scale(${s.toFixed(3)})`, path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4), line('M-12 -36 L12 -36', GOLD, 2)); };
/** A crown (plain gold band) centred at (x, y). */
const crown = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-9 4 L-9 -4 L-5 0 L0 -7 L5 0 L9 -4 L9 4 Z', col, C.ink, 1.2));
const crowned = (x: number, h: number, col: string, mood: Mood = 'smile', y0 = 112) => { const q = geo(x, h, y0); return all(fig(x, col, mood, { h }, y0), robe(x, h, col, y0), crown(x, q.hy - 10 * q.s, 0.9 * h)); };
const sweat = (x: number, y: number) => path(`M${x} ${y - 4} C${x + 3} ${y} ${x + 2} ${y + 3} ${x} ${y + 3} C${x - 2} ${y + 3} ${x - 3} ${y} ${x} ${y - 4} Z`, '#8cc7e8', C.ink, 0.8);
const motion = (x: number, y: number, dir = -1) => line(`M${x} ${y} l${dir * 8} 0 M${x} ${y + 6} l${dir * 12} 0 M${x} ${y + 12} l${dir * 8} 0`, GREY, 1.6);

// ── Things ───────────────────────────────────────────────────────────
const qm = (x: number, y: number, size = 14, col: string = C.accent) => T(x, y, '?', size, col);
const ex = (x: number, y: number, size = 14, col: string = C.red) => T(x, y, '!', size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));
const bigX = (x: number, y: number, r = 10) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, C.red, 3.4);
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
/** The state: a pillared building. */
const govB = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s,
  rect(-22, -6, 44, 6, col, 0.5, C.ink, 1.3), ...[-16, -8, 0, 8, 16].map((d) => rect(d - 2.5, -30, 5, 24, col, 0.5, C.ink, 1.1)),
  rect(-22, -34, 44, 4, col, 0.5, C.ink, 1.2), path('M-24 -34 L0 -46 L24 -34 Z', col, C.ink, 1.3));
/** A closed law book. */
const lawBook = (x: number, y: number, s = 1, col: string = '#7a3b3b') => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.3), line('M-7 -13 L-7 13', 'rgba(0,0,0,0.25)', 1.4), rect(-3, -6, 10, 7, GOLD, 1, null));
/** A document with text lines and optional signatures and seal. */
const doc = (x: number, y: number, w: number, h: number, sig = 0, seal = false) => all(rect(x - w / 2, y - h / 2, w, h, PARCH, 2, C.ink, 1.4),
  line(Array.from({ length: Math.floor(h / 7) - 1 }, (_, i) => `M${x - w / 2 + 4} ${y - h / 2 + 6 + i * 5} L${x + w / 2 - 4} ${y - h / 2 + 6 + i * 5}`).join(' '), '#b5a47c', 1.1),
  ...Array.from({ length: sig }, (_, i) => path(`M${x - w / 2 + 4 + i * 9} ${y + h / 2 - 5} q2 -4 4 0 q2 4 4 -1`, 'none', C.navy, 1.2)),
  seal ? all(circle(x + w / 2 - 6, y + h / 2 - 6, 4.6, C.red, C.ink, 1), line(`M${x + w / 2 - 8} ${y + h / 2 - 2} l-2 6 M${x + w / 2 - 4} ${y + h / 2 - 2} l2 6`, C.red, 1.6)) : '');
const shieldS = (x: number, y: number, s = 1, col: string = NAVY, inner: Svg = '') => at(x, y, s, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const coin = (x: number, y: number, r = 4.4) => all(circle(x, y, r, GOLD, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.9));
const bag = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -6 C-12 0 -12 10 0 10 C12 10 12 0 8 -6 Z', GOLD, C.ink, 1.3), path('M-5 -6 L-7 -12 L7 -12 L5 -6 Z', '#c99a2a', C.ink, 1.1), T(0, 6, '$', 9, '#7a5a10'));
const heartS = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', col, C.ink, 1.2));
const bookIcon = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, rect(-8, -10, 16, 20, col, 2, C.ink, 1.2), line('M-5 -10 L-5 10', 'rgba(0,0,0,0.25)', 1.2));
const houseS = (x: number, y: number, s = 1, col: string = '#f2ece0', roof: string = '#c0563d') => at(x, y, s, rect(-12, -16, 24, 16, col, 1, C.ink, 1.3), path('M-15 -16 L0 -28 L15 -16 Z', roof, C.ink, 1.3), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.9));
const flag = (x: number, y: number, col: string = C.red, h = 22) => all(line(`M${x} ${y} L${x} ${y - h}`, C.ink, 1.8), path(`M${x} ${y - h} L${x + 13} ${y - h + 4} L${x} ${y - h + 8} Z`, col, C.ink, 1));
const ballotBox = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -8, 24, 20, '#e8eef5', 2, C.ink, 1.4), rect(-6, -9.5, 12, 3, C.ink, 1, null), rect(-4, -20, 8, 11, C.white, 1, C.ink, 1.1), line('M-2 -16 L2 -12 M2 -16 L-2 -12', C.navy, 1.2));
const scroll = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, PARCH, 1, C.ink, 1.3), rect(x - 3, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), rect(x + w - 1, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), inner);
const chainH = (x1: number, x2: number, y: number, col: string = GREY) => all(...Array.from({ length: Math.max(1, Math.round((x2 - x1) / 6)) }, (_, i) => ellipse(x1 + 3 + i * 6, y, 3.6, 2.2, 'none', col, 1.6)));
const cuff = (x: number, y: number, col: string = GREY) => circle(x, y, 3.6, 'none', col, 2.2);
const palm = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1));
const dice = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-7, -7, 14, 14, C.white, 2.5, C.ink, 1.3), circle(-3.5, -3.5, 1.4, C.ink, null), circle(0, 0, 1.4, C.ink, null), circle(3.5, 3.5, 1.4, C.ink, null));
const megaphone = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -3 L4 -9 L4 9 L-8 3 Z', C.red, C.ink, 1.2), rect(-12, -3, 4, 6, C.dark, 1, C.ink, 1));
const think = (x: number, y: number, rx: number, ry: number, inner: Svg, tx: number, ty: number) => { const ex2 = x - tx, ey = y + ry * 0.6 - ty; return all(
  circle(+f1(tx + ex2 * 0.2), +f1(ty + ey * 0.2), 2, C.white, C.ink, 1.1), circle(+f1(tx + ex2 * 0.42), +f1(ty + ey * 0.42), 3, C.white, C.ink, 1.2), ellipse(x, y, rx, ry, C.white, C.ink, 1.5), inner); };
const say = (x: number, y: number, w: number, h: number, inner: Svg, tx: number, ty: number) => all(
  path(`M${f1(x - 4)} ${f1(y + h / 2 - 1)} L${tx} ${ty} L${f1(x + 4)} ${f1(y + h / 2 - 1)} Z`, C.white, C.ink, 1.4), rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.6), line(`M${f1(x - 3.4)} ${f1(y + h / 2)} L${f1(x + 3.4)} ${f1(y + h / 2)}`, C.white, 2.4), inner);
/** A seesaw; tilt > 0 = right side down. Items are drawn by the caller on the ends returned. */
const seesaw = (x: number, y: number, half: number, tilt: number, col: string = C.brown) => { const dy = Math.sin(tilt) * half, dx = Math.cos(tilt) * half; return { svg: all(path(`M${x - 8} ${y + 14} L${x} ${y} L${x + 8} ${y + 14} Z`, GREY, C.ink, 1.3), line(`M${f1(x - dx)} ${f1(y - dy)} L${f1(x + dx)} ${f1(y + dy)}`, col, 4)), l: [x - dx, y - dy] as const, r: [x + dx, y + dy] as const }; };
const fire = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -8 10 -2 8 4 C6 10 -6 10 -8 4 C-10 -2 -6 -6 -4 -10 C-2 -6 0 -6 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -6 C4 -2 4 4 0 6 C-4 4 -4 0 0 -6 Z', C.yellow, null));
const club = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, path('M-1.5 0 L1.5 0 L3 -16 C3 -20 -3 -20 -3 -16 Z', C.brown, C.ink, 1.1));
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2.5, -16, 5, 16, C.brown, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2), circle(-7, -19, 7, col, C.ink, 1.2), circle(7, -19, 7, col, C.ink, 1.2));
const pie = (x: number, y: number, r: number, parts: [number, string][]) => { let a0 = -Math.PI / 2; return all(...parts.map(([fr, col]) => { const a1 = a0 + fr * Math.PI * 2, large = fr > 0.5 ? 1 : 0; const d = `M${x} ${y} L${f1(x + Math.cos(a0) * r)} ${f1(y + Math.sin(a0) * r)} A${r} ${r} 0 ${large} 1 ${f1(x + Math.cos(a1) * r)} ${f1(y + Math.sin(a1) * r)} Z`; a0 = a1; return path(d, col, C.ink, 1.2); })); };
const strings = (x: number, y: number, h: number) => all(rect(x - 14, y - 4, 28, 4, C.brown, 1, C.ink, 1.1), line(`M${x - 10} ${y} L${x - 10} ${y + h} M${x + 10} ${y} L${x + 10} ${y + h} M${x} ${y} L${x} ${y + h * 0.4}`, GREY, 0.9));
const stamp = (x: number, y: number, s = 1) => at(x, y, s, rect(-3, -16, 6, 10, C.brown, 2, C.ink, 1.1), circle(0, -18, 4, C.brown, C.ink, 1.1), rect(-8, -6, 16, 5, C.dark, 1, C.ink, 1.1));
const battery = (x: number, y: number, lvl: number, col: string = OK) => all(rect(x - 10, y - 5, 20, 10, C.white, 2, C.ink, 1.3), rect(x + 10, y - 2, 2.5, 4, C.ink, 0.5, null), lvl > 0 ? rect(x - 8.5, y - 3.5, 17 * lvl, 7, col, 1, null) : '');
const stairs = (x: number, y: number, n: number, w: number, h: number, col: string = STONE) => all(...Array.from({ length: n }, (_, i) => rect(x + i * w, y - (i + 1) * h, (n - i) * w, h, col, 0.5, C.ink, 1.1)));
const dome = (x: number, y: number, r: number, col = 'rgba(140,199,232,0.35)') => path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, col, '#5aa7d6', 1.8);
const bounce = (x: number, y: number, dir: 1 | -1) => all(arrow(x + dir * 14, y - 6, x + dir * 4, y, GREY, 2.2), line(`M${x + dir * 2} ${y + 3} l${dir * 6} 6`, GREY, 1.6));

export const POLITICAL_PHILOSOPHY_MOTIFS: Record<string, Svg> = {
  // ── 2231 Frihet och tvång ──
  /** tvång: a big figure pushes a small, unwilling one forward with both hands; a grey figure walks freely by itself. */
  'polf.tvång': all(bg(), fig(34, C.red, 'angry', { h: 1 }), reach(34, 1, 1, 58, 62), reach(34, 1, 1, 60, 76),
    fig(70, C.denim, 'frown', { h: 0.72 }), sweat(80, 46), ex(92, 40, 16), arrow(74, 30, 100, 30, C.red, 2.6),
    greyed(fig(104, C.grey, 'smile', { h: 0.46 })), ground),
  /** tvinga: a big figure drags a smaller one by the wrist; the smaller one leans back with heels dug in. */
  'polf.tvinga': all(bg(), fig(84, C.red, 'angry', { h: 1 }), g('rotate(-12 38 112)', fig(38, C.denim, 'frown', { h: 0.76 })), reach(84, 1, -1, 60, 70), line('M50 72 L60 70', C.skin, 5), circle(57, 71, 2.6, C.skin, C.ink, 1),
    sweat(26, 42), line('M14 112 l6 -3 M20 112 l6 -3', C.brown, 1.6), motion(28, 96, -1), ground),
  /** negativ frihet: nobody stops her – the barrier is raised and the blocking hand is crossed out; grey: stopped at a closed barrier. */
  'polf.negativ-frihet': all(bg(SKY), path('M4 112 L116 112 L116 100 L4 100 Z', '#e9e2cf', null),
    rect(28, 58, 5, 54, GREY, 1, C.ink, 1.2), g('rotate(-62 30 62)', rect(30, 58, 46, 6, C.red, 1, C.ink, 1.1), rect(44, 58, 8, 6, C.white, 0, null), rect(60, 58, 8, 6, C.white, 0, null)),
    fig(58, C.orange, 'laugh', { h: 0.84, hairStyle: 'long' }), arrow(72, 92, 94, 92, OK, 2.6),
    at(92, 30, 1, palm(0, 0, 1.3)), bigX(92, 28, 10),
    greyed(rect(100, 86, 3, 26, GREY, 1, null), rect(102, 86, 14, 3, GREY, 0.5, null), fig(110, C.grey, 'frown', { h: 0.34 }))),
  /** positiv frihet: with a book, a coin and a heart she climbs the steps up to her star; grey: without them, stuck at the bottom. */
  'polf.positiv-frihet': all(bg(), stairs(40, 112, 4, 16, 14), star(100, 22, 9, C.yellow), glow(100, 22, 14),
    fig(76, C.green, 'laugh', { h: 0.62 }, 70), bookIcon(56, 26, 0.7), coin(66, 18), heartS(76, 24, 0.6),
    greyed(fig(18, C.grey, 'frown', { h: 0.56 }), qm(28, 48, 12, GREY)), ground),
  /** handlingsfrihet: at a crossroads she may choose any of three ways; grey: a narrow corridor with one way only. */
  'polf.handlingsfrihet': all(bg(), fig(36, C.purple, 'smile', { h: 0.8, hairStyle: 'long' }),
    arrow(54, 60, 84, 30, OK, 3), arrow(56, 70, 92, 70, C.denim, 3), arrow(54, 80, 84, 104, C.orange, 3),
    greyed(rect(94, 16, 18, 34, 'none', 0, GREY, 2), arrow(103, 46, 103, 22, GREY, 2.2)), ground),
  /** begränsa: a speed-limit sign with 50 and a car that must slow down. */
  'polf.begränsa': all(bg(SKY), rect(4, 92, 112, 20, '#9aa0a8', 0, null), line('M10 102 L26 102 M40 102 L56 102 M70 102 L86 102 M100 102 L112 102', C.white, 2),
    line('M92 92 L92 50', C.ink, 2.4), circle(92, 38, 14, C.white, C.red, 4), T(92, 43, '50', 13, C.ink),
    at(42, 92, 1, path('M-22 0 L-22 -10 L-12 -12 L-6 -20 L10 -20 L16 -12 L24 -10 L24 0 Z', C.denim, C.ink, 1.4), rect(-4, -18, 10, 6, '#cfe6f3', 1, C.ink, 0.9), circle(-12, 0, 5, C.dark, C.ink, 1.2), circle(14, 0, 5, C.dark, C.ink, 1.2)),
    ground),
  /** påtvinga: a big figure presses his own red idea-box down onto a smaller person's head; her own green idea is crossed out. */
  'polf.påtvinga': all(bg(), fig(36, C.red, 'angry', { h: 1 }), reach(36, 1, 1, 68, 28), reach(36, 1, 1, 82, 26),
    rect(66, 18, 20, 14, C.red, 2, C.ink, 1.3), T(76, 30, '!', 11, C.white), arrow(76, 6, 76, 16, C.red, 2.4),
    fig(76, C.green, 'frown', { h: 0.62 }), think(104, 52, 10, 8, all(circle(104, 52, 4, C.green, C.ink, 1), line('M99 47 L109 57 M109 47 L99 57', C.red, 2)), 86, 62), ground),
  /** skadeprincip: smoking alone is allowed (check); smoking beside a child is not (cross). */
  'polf.skadeprincip': all(bg(), line('M60 10 L60 110', C.grey2, 1.6, '4 3'),
    fig(28, C.denim, 'calm', { h: 0.74 }), reach(28, 0.74, 1, 40, 64), line('M40 64 L48 62', C.white, 2.4), path('M50 58 C54 52 48 46 54 40', 'none', GREY, 1.6), check(30, 20, 1.2),
    fig(80, C.denim, 'calm', { h: 0.74 }), reach(80, 0.74, 1, 92, 64), line('M92 64 L100 62', C.white, 2.4), path('M101 58 C105 54 101 50 105 46', 'none', GREY, 1.6),
    fig(106, C.yellow, 'frown', { h: 0.36 }), cross(84, 20, 1.2), ground),
  /** autonomi: she writes her own rule and follows it (check); grey: a puppet moved by strings from above. */
  'polf.autonomi': all(bg(), fig(38, C.orange, 'smile', { h: 0.88, hairStyle: 'long' }), reach(38, 0.88, 1, 62, 70), reach(38, 0.88, -1, 18, 70),
    scroll(56, 58, 22, 26, all(line('M60 64 L74 64 M60 69 L74 69 M60 74 L70 74', '#b5a47c', 1.1), path('M62 78 l3 3 l6 -6', 'none', OK, 1.8))),
    arrow(46, 24, 62, 52, C.orange, 2), think(56, 16, 10, 7, circle(56, 16, 3, C.orange, null), 46, 26),
    greyed(strings(100, 40, 30), fig(100, C.grey, 'sleepy', { h: 0.5 })), ground),

  // ── 2232 Staten och legitimitet ──
  /** stat: the pillared building of the state with its police (shield), school (book) and care (heart) around it. */
  'polf.stat': all(bg(SKY), govB(60, 82, 1.3), flag(60, 22, C.denim, 14),
    line('M30 90 L46 84 M90 90 L74 84 M60 92 L60 98', GREY, 1.4, '3 2'), shieldS(20, 98, 0.7, NAVY), bookIcon(60, 104, 0.6), heartS(100, 98, 0.9), ground),
  /** laglig: a demonstrator with a blank sign beside the law book with a check; grey: spraying a wall, beside a cross. */
  'polf.laglig': all(bg(), fig(36, C.green, 'smile', { h: 0.84 }), reach(36, 0.84, 1, 50, 44), line('M50 44 L50 18', C.brown, 2.4), rect(40, 8, 24, 14, C.white, 2, C.ink, 1.3),
    lawBook(70, 70, 1), check(80, 52, 1.1),
    greyed(rect(92, 60, 22, 30, '#ddd', 0, null), path('M96 72 c4 -6 8 6 12 -2 c3 -4 4 2 4 2', 'none', GREY, 2), fig(102, C.grey, 'smile', { h: 0.4 }), cross(104, 52, 0.8, GREY)), ground),
  /** legitimitet: the leader stands on the raised hands of the people, who carry him gladly; grey: a ruler on a pile of weapons. */
  'polf.legitimitet': all(bg(), fig(48, NAVY, 'smile', { h: 0.56 }, 66),
    crowd([18, 34, 50, 66, 82], 0.58, PALETTE, 'laugh'), ...[18, 34, 50, 66, 82].map((x) => { return reach(x, 0.58, x < 48 ? 1 : -1, x < 48 ? x + 10 : x - 10, 68); }),
    rect(28, 64, 42, 4, C.tan, 1, C.ink, 1), heartS(20, 18, 0.6), heartS(78, 16, 0.6),
    greyed(path('M96 112 L104 96 L112 112 Z', GREY, C.ink, 1), line('M98 104 L110 96 M100 98 L112 104', C.ink, 1.4), fig(104, C.grey, 'angry', { h: 0.4 }, 98)), ground),
  /** legitim: votes go into the ballot box and up to the leader, who gets a check; grey: a man climbs in through a window to grab the crown. */
  'polf.legitim': all(bg(), ballotBox(24, 92, 1), crowd([12, 36], 0.42, [C.orange, C.green]), arrow(30, 70, 52, 48, OK, 2.4),
    fig(64, NAVY, 'smile', { h: 0.8 }), check(64, 18, 1.2),
    greyed(rect(92, 30, 20, 26, '#e0e0e0', 1, C.ink, 1.2), line('M102 30 L102 56 M92 43 L112 43', C.ink, 1.2), crown(102, 22, 0.8, GREY), fig(104, C.grey, 'angry', { h: 0.38 }), cross(102, 72, 0.8, GREY)), ground),
  /** våldsmonopol: only the police officer in front of the state building holds a baton; the citizens' sticks are crossed out. */
  'polf.våldsmonopol': all(bg(SKY), govB(30, 70, 0.9),
    fig(36, NAVY, 'calm', { h: 0.8 }), rect(27, 34, 18, 4, NAVY, 1, C.ink, 1), reach(36, 0.8, 1, 52, 74), line('M52 74 L60 56', C.dark, 4), shieldS(20, 84, 0.6, NAVY),
    fig(86, C.orange, 'frown', { h: 0.62 }), reach(86, 0.62, 1, 100, 74), line('M100 74 L108 58', C.brown, 3), bigX(104, 66, 9), ground),
  /** suveränitet: a country with its own building and flag; a big grey hand from outside is stopped at the border. */
  'polf.suveränitet': all(bg(SKY), path('M8 108 C10 70 24 40 54 34 C76 30 82 50 80 70 C78 92 70 108 60 108 Z', GRASS, C.ink, 1.6), line('M84 30 L84 108', C.red, 3, '6 4'),
    govB(44, 92, 0.8), flag(44, 52, C.green, 16), fig(66, C.orange, 'smile', { h: 0.44 }),
    greyed(path('M114 60 L98 60 C94 60 94 66 98 66 L104 66 M98 66 C94 66 94 72 98 72 L104 72 M98 72 C94 72 94 78 98 78 L114 78 Z', C.grey2, C.ink, 1.2)), cross(92, 50, 0.9)),
  /** anarki: no state – the building lies in ruins and people fight over a box. */
  'polf.anarki': all(bg(DUSK), rect(8, 104, 40, 6, STONE, 0.5, C.ink, 1.2), g('rotate(-80 20 104)', rect(14, 80, 6, 24, STONE, 0.5, C.ink, 1)), g('rotate(70 40 104)', rect(36, 84, 6, 20, STONE, 0.5, C.ink, 1)), path('M10 100 L22 92 L34 100 Z', STONE, C.ink, 1.1),
    fig(66, C.red, 'angry', { h: 0.7 }), fig(102, C.denim, 'angry', { h: 0.7 }), reach(66, 0.7, 1, 80, 62), reach(102, 0.7, -1, 88, 62),
    rect(78, 56, 12, 10, C.tan, 1, C.ink, 1.2), ex(84, 34, 14), ex(30, 40, 12), cloud(96, 18, 0.8, GREY), ground),
  /** godtycklig: the ruler decides by throwing dice – one subject gets a check, the other a cross; grey: the rule book lies unused. */
  'polf.godtycklig': all(bg(), crowned(28, 0.84, C.purple, 'laugh'), reach(28, 0.84, 1, 50, 50), dice(58, 46, 1.1, 15), dice(70, 58, 1, -20),
    fig(84, C.orange, 'smile', { h: 0.5 }), check(84, 52, 0.9), fig(106, C.green, 'frown', { h: 0.5 }), cross(106, 52, 0.9),
    greyed(lawBook(60, 100, 0.6)), qm(70, 20, 14), ground),
  /** tyranni: a huge angry ruler on a throne; small chained people bow below him. */
  'polf.tyranni': all(bg('#f0d6d6'), rect(30, 40, 40, 50, '#7a3b3b', 3, C.ink, 1.4), crowned(50, 0.96, '#9a2a2a', 'angry', 96), rect(26, 90, 48, 8, '#5a2a2a', 1, C.ink, 1.2),
    reach(50, 0.96, 1, 78, 60, 96), path('M78 60 C90 54 96 70 106 66', 'none', C.dark, 1.6),
    ...[18, 86, 104].map((x) => all(g(`rotate(20 ${x} 112)`, fig(x, C.grey2, 'frown', { h: 0.36 })), cuff(x + 2, 108))), chainH(20, 104, 110), ground),

  // ── 2233 Makt och auktoritet ──
  /** härska: the ruler with sceptre and crown stands high above his land and its many small subjects. */
  'polf.härska': all(bg(SKY), stairs(36, 112, 3, 16, 10), crowned(76, 0.7, C.purple, 'smile', 82), reach(76, 0.7, 1, 94, 44, 82), line('M94 44 L96 26', GOLD, 2.4), circle(96, 24, 3, GOLD, C.ink, 1),
    crowd([10, 22, 104], 0.36, PALETTE), houseS(16, 80, 0.6), houseS(108, 76, 0.5), ground),
  /** maktutövning: the official brings down a stamp on the citizen's paper; the citizen waits in front of the desk. */
  'polf.maktutövning': all(bg(), fig(34, NAVY, 'calm', { h: 0.9 }), rect(18, 76, 70, 8, C.brown, 1, C.ink, 1.4), line('M24 84 L24 112 M82 84 L82 112', C.brown, 3),
    doc(64, 72, 20, 8), stamp(64, 50, 1.1), reach(34, 0.9, 1, 64, 32), arrow(78, 40, 70, 58, C.red, 2.2),
    fig(102, C.orange, 'frown', { h: 0.62 }), ground),
  /** underordnad: she stands on the lower step and receives the orders; grey: the boss on the higher step. */
  'polf.underordnad': all(bg(), rect(10, 70, 46, 42, STONE, 1, C.ink, 1.3), rect(56, 96, 56, 16, STONE, 1, C.ink, 1.3),
    greyed(fig(32, C.grey, 'calm', { h: 0.7 }, 70)), arrow(48, 34, 72, 50, C.red, 2.6),
    fig(84, C.orange, 'frown', { h: 0.74, hairStyle: 'long' }, 96)),
  /** lydnad: a row of figures march in step behind the leader, all alike; a grey one at the back stands still. */
  'polf.lydnad': all(bg(), fig(100, NAVY, 'calm', { h: 0.82 }), palm(110, 56, 0.9),
    crowd([30, 50, 70], 0.64, [C.green, C.green, C.green], 'calm'), arrow(22, 40, 84, 40, C.green, 2.6),
    greyed(fig(10, C.grey, 'angry', { h: 0.5 })), ground),
  /** karismatisk: a speaker shines and everyone looks at her with hearts; grey: a speaker with a sleeping audience. */
  'polf.karismatisk': all(bg(), glow(36, 40, 30), rays(36, 34, 22, 30, 14), fig(36, C.red, 'laugh', { h: 0.84, hairStyle: 'long' }), armsUp(36, 0.84),
    crowd([72, 88], 0.5, [C.green, C.denim], 'love'), heartS(72, 50, 0.5), heartS(88, 50, 0.5),
    greyed(fig(104, C.grey, 'calm', { h: 0.36 }), T(110, 66, 'z', 9, GREY), fig(114, C.grey, 'sleepy', { h: 0.26 })), ground),
  /** maktlös: a tiny figure sits with empty hands in front of a huge machine; her battery is empty. */
  'polf.maktlös': all(bg(), rect(56, 20, 56, 90, '#b9bec6', 3, C.ink, 1.6), ...[[70, 40], [90, 40], [70, 64], [90, 64]].map(([x, y]) => circle(x!, y!, 7, '#e1e4e8', C.ink, 1.2)), rect(64, 84, 40, 6, C.dark, 1, null),
    fig(28, C.denim, 'frown', { h: 0.52 }), battery(28, 38, 0, C.red), ex(44, 32, 12, C.red), ground),
  /** maktposition: the golden seat at the top of the stairs, with a woman sitting in it; grey people at the bottom. */
  'polf.maktposition': all(bg(), stairs(20, 112, 5, 14, 12), rect(80, 30, 22, 30, GOLD, 3, C.ink, 1.4), rect(78, 52, 26, 6, '#c99a2a', 1, C.ink, 1.2), glow(90, 40, 24),
    fig(90, C.purple, 'smile', { h: 0.5, hairStyle: 'long' }, 54), crown(90, 6, 0.6),
    greyed(crowd([8, 18], 0.4, [C.grey, C.grey]))),
  /** maktbalans: a level seesaw with two equal groups (check); grey: a small tilted seesaw. */
  'polf.maktbalans': (() => { const s = seesaw(52, 84, 40, 0); const t = seesaw(100, 100, 12, 0.5, GREY); return all(bg(), s.svg,
    crowd([18, 30], 0.36, [C.red, C.red], 'smile', 84), crowd([74, 86], 0.36, [C.denim, C.denim], 'smile', 84), check(52, 26, 1.3),
    greyed(t.svg, circle(t.r[0], t.r[1] - 4, 4, GREY, null)), ground); })(),

  // ── 2234 Individ och kollektiv ──
  /** kollektiv (grupp): many people inside one big circle as one whole; a grey single person outside. */
  'polf.kollektiv.2': all(bg(), ellipse(52, 82, 46, 30, 'rgba(79,157,105,0.18)', C.green, 2.2), crowd([24, 40, 56, 72], 0.5, PALETTE), crowd([32, 48, 64], 0.42, PALETTE.slice(3), 'laugh', 104),
    greyed(fig(108, C.grey, 'smile', { h: 0.5 })), ground),
  /** individuell: three people each get their own plan card with a different symbol; grey: identical cards for everybody. */
  'polf.individuell': all(bg(), ...[[22, C.orange, star(22, 26, 6, C.yellow)], [60, C.green, heartS(60, 26, 0.6)], [98, C.denim, circle(98, 26, 5, C.denim, C.ink, 1)]].map(([x, col, ic]) => all(
    fig(x as number, col as string, 'smile', { h: 0.64 }), rect((x as number) - 10, 14, 20, 24, C.white, 2, C.ink, 1.3), ic as string)), ground),
  /** individualism: on the seesaw the single person weighs more than the grey group. */
  'polf.individualism': (() => { const s = seesaw(60, 86, 46, -0.28); return all(bg(), s.svg,
    fig(s.l[0] + 4, C.orange, 'laugh', { h: 0.62, hairStyle: 'long' }, s.l[1]), glow(s.l[0] + 4, s.l[1] - 40, 16),
    greyed(crowd([s.r[0] - 18, s.r[0] - 8, s.r[0] + 2], 0.3, [C.grey], 'smile', s.r[1])), ground); })(),
  /** kollektivism: on the seesaw the group weighs more than the grey single person. */
  'polf.kollektivism': (() => { const s = seesaw(60, 86, 46, 0.28); return all(bg(), s.svg,
    greyed(fig(s.l[0] + 6, C.grey, 'smile', { h: 0.34 }, s.l[1])),
    crowd([s.r[0] - 30, s.r[0] - 18, s.r[0] - 6], 0.52, [C.green, C.denim, C.purple], 'laugh', s.r[1]), ground); })(),
  /** det gemensamma bästa: one big sun shines on everyone in the town alike; grey: a man hugging his own coins in a corner. */
  'polf.det-gemensamma-bästa': all(bg(SKY), circle(60, 26, 12, C.yellow, C.ink, 1.3), rays(60, 26, 15, 22, 12),
    ...[[20, 66], [44, 58], [76, 58], [100, 66]].map(([x, y]) => line(`M60 40 L${x} ${y}`, 'rgba(224,178,60,0.55)', 2)),
    crowd([20, 44, 76, 100], 0.5, PALETTE, 'laugh'), crowd([60], 0.62, [C.red], 'laugh'),
    greyed(fig(112, C.grey, 'smile', { h: 0.28 }), coin(110, 104, 2.4)), ground),
  /** särintresse: a small group pulls the money bag towards themselves, away from the larger grey crowd. */
  'polf.särintresse': all(bg(), crowd([16, 30], 0.62, [C.purple, C.purple], 'laugh'), reach(30, 0.62, 1, 46, 78), line('M46 78 L58 82', C.brown, 2.4), bag(64, 86, 1.4), arrow(56, 24, 20, 24, C.purple, 2.6),
    greyed(crowd([86, 98, 110], 0.5, [C.grey], 'frown')), ground),
  /** samhällsnytta: a new bridge links the houses, and many people use it gladly. */
  'polf.samhällsnytta': all(bg(SKY), path('M4 112 L4 92 L36 92 C44 106 76 106 84 92 L116 92 L116 112 Z', GRASS, C.ink, 1.4), path('M40 98 C48 110 72 110 80 98 Z', '#5aa7d6', null),
    path('M22 82 C40 62 80 62 98 82', 'none', C.brown, 3.4), line('M30 74 L30 84 M42 68 L42 82 M60 65 L60 80 M78 68 L78 82 M90 74 L90 84', C.brown, 1.4), rect(14, 80, 92, 4, C.brown, 1, C.ink, 1.2),
    houseS(12, 92, 0.7), houseS(108, 92, 0.7), crowd([46, 60, 74], 0.3, PALETTE, 'laugh', 72), check(60, 22, 1.2)),
  /** konformitet: a row of people who all look exactly alike; grey: a different person pushed outside. */
  'polf.konformitet': all(bg(), crowd([18, 38, 58, 78], 0.62, [C.denim], 'calm'), ...[18, 38, 58, 78].map((x) => { const q = geo(x, 0.62); return rect(x - 7, q.hy - 10, 14, 4, C.dark, 1, C.ink, 1); }),
    greyed(g('rotate(14 104 112)', fig(104, C.grey, 'frown', { h: 0.5, hairStyle: 'long' }))), ground),

  // ── 2235 Rättigheter ──
  /** okränkbar: a person inside a protective dome; grey arrows bounce off it. */
  'polf.okränkbar': all(bg(), dome(60, 112, 40), fig(60, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), heartS(60, 40, 0.7),
    bounce(18, 70, -1), bounce(102, 70, 1), arrow(60, 4, 60, 14, GREY, 2.2), line('M54 16 l-4 4 M66 16 l4 4', GREY, 1.6), ground),
  /** oförytterlig: the heart is chained to the person; a grey buyer offers coins and is refused. */
  'polf.oförytterlig': all(bg(), fig(32, C.green, 'smile', { h: 0.84 }), heartS(58, 60, 1.1, C.red), ...[40, 45, 50].map((x, i) => ellipse(x, 68 - i * 2, 3, 2, 'none', GOLD, 1.6)),
    greyed(fig(96, C.grey, 'smile', { h: 0.62 }), reach(96, 0.62, -1, 80, 76), coin(76, 74, 3.6), coin(80, 70, 3.6)), cross(82, 44, 1.1), ground),
  /** frihetsrättighet: a woman speaks freely through a megaphone under a shield; the grey state's stopping hand is crossed out. */
  'polf.frihetsrättighet': all(bg(), shieldS(40, 54, 2.6, 'rgba(47,74,122,0.18)'), fig(40, C.orange, 'laugh', { h: 0.8, hairStyle: 'long' }), reach(40, 0.8, 1, 56, 46), megaphone(62, 44, 1), ex(78, 36, 14, C.red),
    greyed(govB(98, 80, 0.6), palm(98, 34, 1.2)), bigX(98, 32, 8), ground),
  /** social rättighet: the state hands out school, care and a home to the person. */
  'polf.social-rättighet': all(bg(), govB(28, 72, 0.9), arrow(52, 50, 74, 30, OK, 2), arrow(52, 60, 76, 60, OK, 2), arrow(52, 70, 74, 90, OK, 2),
    bookIcon(84, 26, 0.8), heartS(86, 60, 0.8), houseS(84, 100, 0.6), fig(106, C.green, 'smile', { h: 0.62 }), ground),
  /** anspråk: two people each plant their flag on the same small island. */
  'polf.anspråk': all(bg(SKY), rect(4, 90, 112, 22, '#5aa7d6', 0, null), path('M20 92 C30 72 90 72 100 92 Z', '#e6d3a3', C.ink, 1.4),
    fig(38, C.red, 'angry', { h: 0.5 }, 86), flag(50, 80, C.red, 26), fig(82, C.denim, 'angry', { h: 0.5 }, 86), flag(70, 80, C.denim, 26), ex(60, 30, 14)),
  /** åtnjuta: he relaxes happily under the shelter of a big shield, in the sun. */
  'polf.åtnjuta': all(bg(SKY), circle(98, 22, 9, C.yellow, C.ink, 1.2), rays(98, 22, 12, 17, 10),
    shieldS(52, 52, 2.4, 'rgba(47,74,122,0.2)', path('M-6 0 l4 4 l8 -8', 'none', OK, 2.4)), rect(28, 94, 48, 6, C.brown, 1, C.ink, 1.2),
    fig(52, C.green, 'laugh', { h: 0.62 }), armsUp(52, 0.62), ground),
  /** åberopa: in court she holds up the law book to the judge. */
  'polf.åberopa': all(bg(), fig(92, C.dark, 'calm', { h: 0.62 }, 92), rect(70, 62, 42, 50, C.brown, 2, C.ink, 1.4),
    fig(34, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), reach(34, 0.84, 1, 54, 40), lawBook(58, 34, 0.9), say(58, 10, 22, 12, ex(58, 15, 10, C.red), 52, 22), ground),
  /** garantera: a guarantee – a certificate with a gold seal and a check, held firmly. */
  'polf.garantera': all(bg(), fig(28, NAVY, 'smile', { h: 0.84 }), reach(28, 0.84, 1, 54, 70), doc(74, 62, 40, 44, 2, true), check(74, 50, 1.4), shieldS(100, 98, 0.6, OK), ground),

  // ── 2236 Socialt kontrakt ──
  /** socialt kontrakt: many people sign one big shared document; the state building rises above it. */
  'polf.socialt-kontrakt': all(bg(), govB(60, 30, 0.6), arrow(60, 34, 60, 42, GREY, 2), doc(60, 66, 44, 32, 4),
    ...[[18, C.orange], [102, C.green]].map(([x, col]) => all(fig(x as number, col as string, 'smile', { h: 0.62 }), reach(x as number, 0.62, (x as number) < 60 ? 1 : -1, (x as number) < 60 ? 40 : 80, 76))),
    crowd([44, 76], 0.36, [C.denim, C.purple]), ground),
  /** naturtillstånd: wild land without houses or laws; two men fight with clubs over a fruit. */
  'polf.naturtillstånd': all(bg(DUSK), tree(16, 112, 1.1), path('M70 112 L84 80 L98 112 Z', '#9a8a70', C.ink, 1.2),
    fig(44, C.brown, 'angry', { h: 0.7 }), fig(92, '#6a7a40', 'angry', { h: 0.7 }), reach(44, 0.7, 1, 58, 50), club(58, 50, 30), reach(92, 0.7, -1, 78, 50), club(78, 50, -30), circle(68, 70, 4, C.red, C.ink, 1), ex(68, 30, 14), ground),
  /** laglöshet: the law book is torn and a thief runs off with a bag while nobody stops him. */
  'polf.laglöshet': all(bg(DUSK), g('rotate(-14 30 50)', rect(18, 36, 12, 28, '#7a3b3b', 1, C.ink, 1.2)), g('rotate(16 40 50)', rect(32, 36, 12, 28, '#7a3b3b', 1, C.ink, 1.2)), line('M30 38 L33 46 L29 52 L33 60', C.ink, 1.4),
    g('rotate(10 80 112)', fig(80, C.dark, 'laugh', { h: 0.74 })), reach(80, 0.74, 1, 98, 70), bag(102, 78, 1), motion(60, 70, -1), ex(30, 90, 14), ground),
  /** självbevarelsedrift: he runs away from the fire with his heart beating. */
  'polf.självbevarelsedrift': all(bg(), fire(24, 106, 1.6), fire(40, 108, 1.1), g('rotate(14 70 112)', fig(70, C.denim, 'shock', { h: 0.8 })), motion(52, 60, -1), arrow(84, 30, 108, 30, C.red, 2.6), heartS(86, 56, 0.6), sweat(80, 26), ground),
  /** överhet: the rulers stand on a high balcony above the people, who look up at them. */
  'polf.överhet': all(bg(SKY), rect(26, 46, 68, 66, STONE, 1, C.ink, 1.4), rect(22, 42, 76, 6, '#bfb59c', 1, C.ink, 1.2), line('M30 112 L30 50 M90 112 L90 50', 'rgba(0,0,0,0.15)', 1.4),
    crowned(48, 0.42, C.purple, 'calm', 42), fig(72, NAVY, 'calm', { h: 0.42 }, 42),
    crowd([10, 110], 0.3, [C.orange, C.green]), crowd([40, 60, 80], 0.3, [C.denim, C.red, C.orange])),
  /** allmänvilja: the thoughts of many people flow together into one big shared thought with a heart; grey: one man thinking only of coins. */
  'polf.allmänvilja': all(bg(), ellipse(56, 26, 28, 18, C.white, C.ink, 1.6), heartS(56, 26, 1.1), crowd([20, 42, 64, 86], 0.52, PALETTE),
    ...[20, 42, 64, 86].map((x) => line(`M${x} 64 L${f1(56 + (x - 56) * 0.4)} 44`, '#c9a0a0', 1.4, '2 3')),
    greyed(fig(108, C.grey, 'smile', { h: 0.4 }), ellipse(108, 48, 7, 5, C.white, C.ink, 1), coin(108, 48, 2.6)), ground),

  // ── 2237 Demokrati och rättvisa ──
  /** folksuveränitet: the people hold the crown up above themselves; grey: a lone king with his crown. */
  'polf.folksuveränitet': all(bg(SKY), crown(48, 22, 2.2), glow(48, 22, 22), crowd([20, 36, 52, 68], 0.62, PALETTE, 'laugh'), ...[20, 36, 52, 68].map((x) => reach(x, 0.62, x < 44 ? 1 : -1, x < 44 ? 40 : 56, 36)),
    greyed(crowned(102, 0.5, C.grey, 'calm')), ground),
  /** deltagande: a meeting where everybody raises a hand and one drops a vote into the box. */
  'polf.deltagande': all(bg(), crowd([16, 34, 52], 0.62, PALETTE), ...[16, 34, 52].map((x) => handUp(x, 0.62)), ballotBox(90, 96, 1.1), fig(104, C.purple, 'smile', { h: 0.62, hairStyle: 'long' }), reach(104, 0.62, -1, 92, 72), ground),
  /** majoritetsstyre: six hands up against three; the bigger side gets the check. */
  'polf.majoritetsstyre': all(bg(), crowd([12, 26, 40, 54], 0.5, [C.green], 'laugh'), ...[12, 26, 40, 54].map((x) => handUp(x, 0.5)), T(34, 26, '4', 16, OK), check(52, 22, 1.1),
    line('M70 30 L70 110', C.grey2, 1.6, '3 3'), greyed(crowd([86, 104], 0.5, [C.grey], 'frown'), ...[86, 104].map((x) => handUp(x, 0.5)), T(96, 26, '2', 16, GREY)), ground),
  /** majoritetens tyranni: a big crowd shouts at and pushes two people into the corner. */
  'polf.majoritetens-tyranni': all(bg(), crowd([20, 36, 52, 68], 0.72, [C.red], 'angry'), say(44, 18, 26, 14, all(ex(38, 23, 11, C.red), ex(48, 23, 11, C.red)), 40, 28), arrow(76, 70, 90, 70, C.red, 3),
    crowd([100, 112], 0.42, [C.denim, C.denim], 'shock'), ground),
  /** minoritetsskydd: two people stand safe under a shield-dome; the big crowd outside is stopped. */
  'polf.minoritetsskydd': all(bg(), dome(86, 112, 28), crowd([78, 94], 0.46, [C.denim, C.denim], 'smile'), shieldS(86, 28, 1, NAVY, path('M-5 0 l4 4 l7 -7', 'none', C.white, 2.2)),
    crowd([12, 26, 40], 0.66, [C.red], 'angry'), bounce(62, 80, -1), ground),
  /** fördelningsrättvisa: the cake is divided so that each person gets a fair piece; grey: one person takes almost all. */
  'polf.fördelningsrättvisa': all(bg(), pie(42, 40, 24, [[0.34, C.orange], [0.33, C.green], [0.33, C.denim]]), check(76, 22, 1.1),
    crowd([18, 42, 66], 0.5, [C.orange, C.green, C.denim], 'laugh'),
    greyed(pie(100, 70, 11, [[0.85, GREY], [0.15, C.grey2]]), fig(100, C.grey, 'laugh', { h: 0.34 }))),
  /** skillnadsprincip: she earns more, but the arrow from her lifts up the poorest too; both bars rise. */
  'polf.skillnadsprincip': all(bg(), rect(16, 40, 20, 72, GOLD, 1, C.ink, 1.2), rect(70, 70, 20, 42, OK, 1, C.ink, 1.2), rect(70, 86, 20, 26, 'rgba(0,0,0,0.12)', 0, null),
    fig(26, NAVY, 'smile', { h: 0.4 }, 40), fig(80, C.orange, 'laugh', { h: 0.4 }, 70), arrow(80, 92, 80, 74, C.white, 2.4),
    path('M40 34 C56 20 70 30 76 50', 'none', OK, 2.4), path('M76 50 L71 44 L79 44 Z', OK, OK, 1), greyed(rect(100, 100, 10, 12, GREY, 1, null)), ground),
};
