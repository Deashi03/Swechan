/**
 * Politeness and social norms (0.29, Kommunikation & samspel → Artighet & sociala normer, modules 1121–1127):
 * addressing people, thanking, asking a favour, declining, small talk, hospitality and social misunderstandings.
 * Most words are phrases or attitudes, so the pictures are small scenes with speech bubbles that hold icons
 * (never the words themselves), faces that carry the attitude and a grey reference where a contrast helps.
 * Swedish customs are drawn as they are done in Sweden: shoes off in the hall, indoor shoes brought to a party,
 * flowers for the hosts, seven kinds of biscuits for coffee, du and first names even to the boss.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, cloud, cup, envelope, heart, note, sun } from './people';
import { P as F, type Mood, drop, greyed, table } from './blindFix';
import { capIcon, checkIcon, childIcon, houseIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number) => circle(x, y, 3, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const GREYH = '#d9d6d0';
/** Older person with grey hair. */
const old = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, top, mood, { hair: GREYH, ...more });
/** Tie on the figure at x (boss, formal). */
const tieOn = (x: number, h = 1, col: string = C.red) => { const q = geo(x, h), s = q.s, y = q.ty - 42 * s; return path(`M${x - 2.2 * s} ${y} L${x + 2.2 * s} ${y} L${x + 3.4 * s} ${y + 16 * s} L${x} ${y + 21 * s} L${x - 3.4 * s} ${y + 16 * s} Z`, col, C.ink, 1); };
const bowOn = (x: number, h = 1) => { const q = geo(x, h), y = q.ty - 41 * q.s; return all(path(`M${x} ${y} L${x - 6} ${y - 3} L${x - 6} ${y + 3} Z M${x} ${y} L${x + 6} ${y - 3} L${x + 6} ${y + 3} Z`, C.black, C.ink, 1), circle(x, y, 1.4, C.black, null)); };
/** Baseball cap (young, casual). */
const cap = (x: number, h = 1, col: string = C.red) => { const q = geo(x, h); const k = q.s; return all(path(`M${x - 10 * k} ${q.hy - 2 * k} C${x - 10 * k} ${q.hy - 15 * k} ${x + 10 * k} ${q.hy - 15 * k} ${x + 10 * k} ${q.hy - 2 * k} Z`, col, C.ink, 1.4), path(`M${x + 6 * k} ${q.hy - 3 * k} L${x + 19 * k} ${q.hy - 1 * k} L${x + 9 * k} ${q.hy - 6 * k} Z`, col, C.ink, 1.2)); };
const crown = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 6 L-13 -7 L-6 -1 L0 -10 L6 -1 L13 -7 L12 6 Z', C.gold, C.ink, 1.5), ...[-6, 0, 6].map((d) => circle(d, 2, 1.6, C.red, null)));
const crownOn = (x: number, h = 1) => { const q = geo(x, h); return crown(x, q.hy - q.hr - 3, 0.75 * h); };
/** A figure bowing slightly (rotated about the feet). */
const bowing = (x: number, top: string, deg = 14, more: Partial<Build> = {}) => g(`rotate(${deg} ${x} 112)`, fig(x, top, 'calm', more));
/** Up-and-down marks beside a head: the person nods. */
const nodM = (x: number, h = 1) => { const q = geo(x, h); return path(`M${x - q.hr - 4} ${q.hy - 6} q-2.6 6 0 12 M${x + q.hr + 4} ${q.hy - 6} q2.6 6 0 12`, 'none', HL, 1.5); };
const waveM = (x: number, y: number) => path(`M${x - 7} ${y - 6} q-3 6 0 12 M${x + 7} ${y - 6} q3 6 0 12`, 'none', HL, 1.4);
const sweat = (x: number, h = 1) => { const q = geo(x, h); return drop(x + q.hr + 2, q.hy - 4, 0.9); };
const redFace = (x: number, h = 1) => { const q = geo(x, h); return all(ellipse(x, q.hy + 2, q.hr * 0.8, q.hr * 0.45, 'rgba(232,90,90,0.45)', null), line(`M${x - q.hr - 3} ${q.hy - 2} l-3 -2 M${x + q.hr + 3} ${q.hy - 2} l3 -2`, C.red, 1.2)); };

// ── Speech ───────────────────────────────────────────────────────────
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white, stroke: string = C.ink) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[], a2: number[], b2: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, inw = tx < L ? 1.6 : -1.6, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; a2 = [e + inw, by - 3.6]; b2 = [e + inw, by + 3.6]; }
  else { const e = ty > cy ? B : Tp, inw = ty > cy ? -1.6 : 1.6, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; a2 = [bx - 4, e + inw]; b2 = [bx + 4, e + inw]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, stroke, 1.5), rect(L, Tp, w, h, fill, 6, stroke, 1.5), path(`M${a2[0]} ${a2[1]} L${tx} ${ty} L${b2[0]} ${b2[1]} Z`, fill, null), inner);
};
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2) + dx, cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };
/** Thought bubble at (cx, cy) with small circles leading to (tx, ty). */
const thinkB = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => all(ellipse(cx, cy, w / 2, h / 2, C.white, C.ink, 1.5), circle(cx + (tx - cx) * 0.55, cy + (ty - cy) * 0.6, 2.6, C.white, C.ink, 1.1), circle(cx + (tx - cx) * 0.82, cy + (ty - cy) * 0.85, 1.7, C.white, C.ink, 1), inner);
const tb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2) + dx, cy = k.hy - 12 + dy; return thinkB(cx, cy, w, hh, x + side * k.hr * 0.6, k.hy - k.hr * 0.6, f(cx, cy)); };

// ── Icons (about 12 units) ───────────────────────────────────────────
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const ex = (x: number, y: number, sz = 13, col: string = HL) => T(x, y + sz * 0.36, '!', sz, col);
const dots = (x: number, y: number, col: string = C.grey) => all(circle(x - 5, y, 1.5, col, null), circle(x, y, 1.5, col, null), circle(x + 5, y, 1.5, col, null));
const face = (x: number, y: number, r: number, m: 'smile' | 'sad' | 'flat' | 'grin' = 'smile', col: string = C.yellow) => all(circle(x, y, r, col, C.ink, 1.1), circle(x - r * 0.36, y - r * 0.22, r * 0.13, C.ink, null), circle(x + r * 0.36, y - r * 0.22, r * 0.13, C.ink, null),
  m === 'flat' ? line(`M${x - r * 0.4} ${y + r * 0.38} L${x + r * 0.4} ${y + r * 0.38}`, C.ink, 1.1)
    : m === 'sad' ? path(`M${x - r * 0.42} ${y + r * 0.55} Q${x} ${y + r * 0.15} ${x + r * 0.42} ${y + r * 0.55}`, 'none', C.ink, 1.1)
      : path(`M${x - r * 0.46} ${y + r * 0.2} Q${x} ${y + r * (m === 'grin' ? 0.85 : 0.68)} ${x + r * 0.46} ${y + r * 0.2}${m === 'grin' ? ' Z' : ''}`, m === 'grin' ? '#c84a4a' : 'none', C.ink, 1.1));
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const palm = (x: number, y: number, s = 1, marks = true) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1), marks ? path('M-12 -8 q-3 5 0 10 M12 -8 q3 5 0 10', 'none', HL, 1.2) : '');
const hrt = (x: number, y: number, s = 0.5, col: string = C.red) => heart(x, y, s, col);
/** A tiny standing person icon. */
const mini = (x: number, y: number, s = 1, col: string = C.sky, hair: string = C.hair) => g(`translate(${x} ${y}) scale(${s})`, circle(0, -5, 3.4, C.skin, C.ink, 0.9), path('M-3.4 -7 C-3.4 -10.4 3.4 -10.4 3.4 -7 C2 -8.4 -2 -8.4 -3.4 -7 Z', hair, null), path('M-5 6 C-5 0 5 0 5 6 Z', col, C.ink, 0.9));
const nameTag = (x: number, y: number, s = 1, col: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-11, -7, 22, 14, C.white, 2, C.ink, 1.1), rect(-11, -7, 22, 4, col, 2, null), line('M-7 1 L7 1 M-7 4 L3 4', C.grey, 1.3));
const cal = (x: number, y: number, s = 1, marks: number[] = [], cols = 4, markCol: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -9, 20, 18, C.white, 2, C.ink, 1.2), rect(-10, -9, 20, 5, C.red, 2, C.ink, 1.2), ...Array.from({ length: cols * 2 }, (_, i) => { const cx = -7 + (i % cols) * (14 / (cols - 1)), cy = 0 + Math.floor(i / cols) * 5; return marks.includes(i) ? circle(cx, cy, 2.2, markCol, null) : circle(cx, cy, 1, C.grey, null); }));
const clock = (x: number, y: number, r = 8, hAng = 300, mAng = 0, fill: string = C.white) => { const p = (a: number, l: number) => `${(x + Math.sin((a * Math.PI) / 180) * l).toFixed(1)} ${(y - Math.cos((a * Math.PI) / 180) * l).toFixed(1)}`; return all(circle(x, y, r, fill, C.ink, 1.4), line(`M${x} ${y} L${p(hAng, r * 0.5)} M${x} ${y} L${p(mAng, r * 0.78)}`, C.ink, 1.3)); };
const lines = (x: number, y: number, w: number, n = 3, col: string = C.grey) => all(...Array.from({ length: n }, (_, i) => line(`M${x - w / 2} ${y + i * 4.4} L${x + w / 2 - (i === n - 1 ? w * 0.35 : 0)} ${y + i * 4.4}`, col, 1.6)));
const gift = (x: number, y: number, s = 1, col: string = C.red, rib: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -7, 20, 15, col, 2, C.ink, 1.3), rect(-11, -10, 22, 5, col, 1.5, C.ink, 1.3), rect(-2, -10, 4, 18, rib, 0, null), path('M0 -10 C-6 -16 -9 -11 0 -10 C9 -11 6 -16 0 -10 Z', rib, C.ink, 1));
const flower = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, ...[0, 72, 144, 216, 288].map((a) => circle(Math.cos((a * Math.PI) / 180) * 3.2, Math.sin((a * Math.PI) / 180) * 3.2, 2.6, col, C.ink, 0.7)), circle(0, 0, 1.8, C.yellow, null));
const bouquet = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 18 L-5 2 M0 18 L0 0 M0 18 L5 2', C.green, 1.6), flower(-6, 0, 0.9, C.red), flower(0, -4, 0.9, C.pink), flower(6, 0, 0.9, C.yellow), path('M-6 8 L6 8 L3 18 L-3 18 Z', C.white, C.ink, 1));
const door = (x: number, y: number, w = 26, h = 62, open = false) => all(rect(x - w / 2, y - h, w, h, open ? '#fff2b8' : '#c8925a', 1, C.ink, 1.6), open ? path(`M${x - w / 2} ${y - h} L${x - w / 2 - 10} ${y - h + 6} L${x - w / 2 - 10} ${y + 4} L${x - w / 2} ${y} Z`, '#c8925a', C.ink, 1.4) : circle(x + w / 2 - 4, y - h / 2, 1.6, C.gold, C.ink, 0.8));
const windowI = (x: number, y: number, s = 1, open = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -8, 16, 16, '#bfe3f5', 1, C.ink, 1.2), line('M0 -8 L0 8 M-8 0 L8 0', C.ink, 1), open ? path('M8 -8 L13 -5 L13 11 L8 8', '#e8f4fb', C.ink, 1) : '');
const doorI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -9, 12, 18, '#c8925a', 1, C.ink, 1.1), circle(3, 0, 1, C.gold, null));
const phoneI = (x: number, y: number, s = 1, ring = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-4.5, -8, 9, 16, C.dark, 2, C.ink, 1), rect(-3.4, -6, 6.8, 10, '#bfe3f5', 0.6, null), ring ? path('M-8 -6 q-3 6 0 12 M8 -6 q3 6 0 12', 'none', HL, 1.2) : '');
const laptop = (x: number, y: number, s = 1, screen: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 18, C.dark, 2, C.ink, 1.3), rect(-12, -16, 24, 14, '#e8f4fb', 1, null), path('M-17 0 L17 0 L15 3 L-15 3 Z', C.grey, C.ink, 1.1), screen);
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -9 L9 7 L-9 7 Z', C.yellow, C.ink, 1.3), line('M0 -3 L0 2', C.ink, 1.8), circle(0, 4.6, 1, C.ink, null));
const umbrella = (x: number, y: number, s = 1, col: string = C.purple) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 0 C-12 -12 12 -12 12 0 C9 -2 7 -2 4 0 C1 -2 -1 -2 -4 0 C-7 -2 -9 -2 -12 0 Z', col, C.ink, 1.2), line('M0 0 L0 12 C0 15 -4 15 -4 12', C.ink, 1.4));
const rainD = (x: number, y: number, w: number, n = 6) => all(...Array.from({ length: n }, (_, i) => line(`M${x + i * (w / n)} ${y + (i % 2) * 5} l-2 6`, '#5aa7d6', 1.6)));
const glassW = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -8 L4 -8 C4 -2 2 -1 0 -1 C-2 -1 -4 -2 -4 -8 Z', 'rgba(220,60,80,0.7)', C.ink, 1), line('M0 -1 L0 6 M-3 6 L3 6', C.ink, 1.1));
const mic = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.6, 0, 3.2, 12, C.dark, 1.4, C.ink, 1), circle(0, -2, 4, C.grey, C.ink, 1.1));
const bike = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, circle(-11, 6, 7, 'none', C.ink, 1.8), circle(11, 6, 7, 'none', C.ink, 1.8), path('M-11 6 L-3 -6 L8 -6 L11 6 M-3 -6 L1 6 L8 -6 M-5 -10 L-1 -10 M8 -6 L6 -11 L10 -11', 'none', col, 2));
const shoe = (x: number, y: number, s = 1, col: string = '#5a3a2a', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M-9 3 L-9 -5 C-7 -7 -4 -7 -3 -5 C0 -3 6 -2 9 0 C10 1 10 3 9 3 Z', col, C.ink, 1.1), line('M-9 3 L9 3', C.ink, 1.4));
const slipper = (x: number, y: number, s = 1, col: string = C.pink) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 3 C-10 -1 -8 -3 -5 -3 L6 -3 C9 -3 10 0 9 3 Z', col, C.ink, 1.1), path('M-2 -3 C-2 -7 6 -7 6 -3', col, C.ink, 1.1), circle(2, -5, 1.2, C.white, null));
const cookie = (x: number, y: number, kind: number) => {
  switch (kind) {
    case 0: return all(circle(x, y, 4.4, '#d9a35a', C.ink, 0.9), circle(x - 1.5, y - 1, 0.8, '#5a3a2a', null), circle(x + 1.6, y + 1, 0.8, '#5a3a2a', null));
    case 1: return all(rect(x - 4.4, y - 3, 8.8, 6, '#e8c07a', 1, C.ink, 0.9), line(`M${x - 3} ${y} L${x + 3} ${y}`, '#b07a3a', 0.9));
    case 2: return all(circle(x, y, 4.2, '#f4e2b8', C.ink, 0.9), circle(x, y, 1.6, C.red, null));
    case 3: return all(path(`M${x - 4.6} ${y + 2} C${x - 4.6} ${y - 4} ${x + 4.6} ${y - 4} ${x + 4.6} ${y + 2} Z`, '#6b4426', C.ink, 0.9), line(`M${x - 3} ${y - 1} L${x + 3} ${y - 1}`, C.white, 0.8));
    case 4: return all(ellipse(x, y, 5, 3, '#e8c07a', C.ink, 0.9), path(`M${x - 3} ${y} q1.5 -2 3 0 q1.5 2 3 0`, 'none', '#b07a3a', 0.8));
    case 5: return all(path(`M${x} ${y - 4.4} L${x + 4.4} ${y} L${x} ${y + 4.4} L${x - 4.4} ${y} Z`, '#f2d08a', C.ink, 0.9), circle(x, y, 1, C.white, null));
    default: return all(circle(x, y, 4.2, '#f7f0e0', C.ink, 0.9), circle(x - 1.4, y - 0.6, 0.7, C.green, null), circle(x + 1.4, y + 0.8, 0.7, C.green, null));
  }
};
const tray = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 6, 24, 5, C.white, C.ink, 1.3), ...[[-15, 2], [-5, 3], [5, 3], [15, 2], [-10, -4], [0, -4], [10, -4]].map(([cx, cy], i) => cookie(cx!, cy!, i)));
const coatHook = (x: number, y: number) => all(rect(x - 16, y - 3, 32, 5, C.brown, 1, C.ink, 1.2), ...[-10, 0, 10].map((d) => path(`M${x + d} ${y + 2} l0 4 q0 3 3 2`, 'none', C.ink, 1.4)));
const jacketI = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -10 L6 -10 L12 -6 L12 14 L-12 14 L-12 -6 Z', col, C.ink, 1.3), line('M0 -9 L0 14', C.ink, 1), path('M-12 -6 L-16 10 L-12 10 M12 -6 L16 10 L12 10', col, C.ink, 1.1));
const mask = (x: number, y: number, s = 1, col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -12 C-12 -2 -10 10 0 14 C10 10 12 -2 10 -12 C4 -15 -4 -15 -10 -12 Z', col, C.ink, 1.4), ellipse(-4.4, -3, 2.6, 1.8, C.ink, null), ellipse(4.4, -3, 2.6, 1.8, C.ink, null), path('M-4 6 Q0 9 4 6', 'none', C.ink, 1.2));
const ring = (x: number, y: number, r = 9) => all(circle(x, y, r, '#f6f2ea', C.ink, 1.4), circle(x, y, r * 0.5, 'none', C.ink, 1.2), ...[0, 90, 180, 270].map((a) => { const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); return line(`M${x + c * r * 0.52} ${y + s * r * 0.52} L${x + c * r} ${y + s * r}`, C.red, 4.4); }));
const feather = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s}) rotate(-35)`, path('M0 -10 C6 -6 6 6 0 10 C-6 6 -6 -6 0 -10 Z', C.white, C.ink, 1), line('M0 -9 L0 13', C.ink, 0.9), path('M0 -4 l3 -2 M0 0 l3 -2 M0 4 l3 -2 M0 -4 l-3 -2 M0 0 l-3 -2 M0 4 l-3 -2', 'none', C.grey, 0.7));
const weight = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 8 L-6 -4 L6 -4 L8 8 Z', C.dark, C.ink, 1.2), path('M-3 -4 C-3 -9 3 -9 3 -4', 'none', C.ink, 1.6));
const ice = (x: number, y: number, w: number, h: number, cracked = false) => all(rect(x - w / 2, y - h, w, h, '#d6eefa', 2, '#5aa7d6', 1.6), path(`M${x - w / 2 + 3} ${y - h + 4} l6 6 M${x + w / 2 - 6} ${y - 6} l3 -3`, 'none', C.white, 1.6), cracked ? path(`M${x} ${y - h} L${x - 3} ${y - h * 0.65} L${x + 3} ${y - h * 0.4} L${x - 2} ${y}`, 'none', C.navy, 1.8) : '');
const people3 = (x: number, y: number, s = 1) => all(mini(x - 7 * s, y, s, C.green), mini(x, y - 2 * s, s, C.orange), mini(x + 7 * s, y, s, C.purple));
const pyramidRow = (y: number, n: number, col: string) => all(...Array.from({ length: n }, (_, i) => mini(60 + (i - (n - 1) / 2) * 15, y, 1.2, col)));
const level = (x: number, y: number, w: number) => all(path(`M${x} ${y} l-6 10 l12 0 Z`, C.grey, C.ink, 1.2), rect(x - w / 2, y - 4, w, 4, C.tan, 1, C.ink, 1.3));
const hat = (x: number, h = 1) => { const q = geo(x, h); return all(rect(x - 6 * q.s, q.hy - q.hr - 12 * q.s, 12 * q.s, 12 * q.s, C.black, 1, C.ink, 1.1), rect(x - 11 * q.s, q.hy - q.hr - 1.5 * q.s, 22 * q.s, 3 * q.s, C.black, 1, C.ink, 1.1)); };
const coffeePot = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -8 L6 -8 L8 8 L-8 8 Z', C.red, C.ink, 1.2), path('M8 -4 C14 -4 14 4 8 4', 'none', C.ink, 1.4), path('M-6 -8 L-11 -12', 'none', C.ink, 1.8), rect(-3, -11, 6, 3, C.dark, 1, null));
const bed = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -2, 24, 6, C.sky, 1, C.ink, 1), rect(-12, -7, 7, 5, C.white, 2, C.ink, 1), line('M-12 4 L-12 7 M12 4 L12 7', C.ink, 1.4));
const thermo = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s}) rotate(20)`, rect(-1.6, -8, 3.2, 12, C.white, 1.6, C.ink, 1), circle(0, 5, 2.6, C.red, C.ink, 1), line('M0 -2 L0 4', C.red, 1.6));
const sofaI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -6, 24, 8, C.green, 2, C.ink, 1.1), rect(-14, -2, 4, 8, C.green, 1, C.ink, 1.1), rect(10, -2, 4, 8, C.green, 1, C.ink, 1.1), rect(-10, 2, 20, 4, C.mint, 1, C.ink, 1));
const box = (x: number, y: number, w = 20, h = 14) => all(rect(x - w / 2, y - h / 2, w, h, C.tan, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h / 2 + 4} L${x + w / 2} ${y - h / 2 + 4}`, '#a0673d', 1));
const plant = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 0 L5 0 L4 8 L-4 8 Z', '#c8723a', C.ink, 1), path('M0 0 C-6 -4 -6 -10 0 -12 C6 -10 6 -4 0 0 Z M0 0 C-10 -2 -12 -6 -9 -9', C.green, C.ink, 1));
const catI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 3, 7, 5, C.orange, C.ink, 1), circle(-6, -3, 4, C.orange, C.ink, 1), path('M-9 -6 L-8 -10 L-6 -7 M-4 -7 L-3 -10 L-2 -6', C.orange, C.ink, 0.9), path('M7 3 C11 1 11 -4 9 -6', 'none', C.ink, 1.4));
const suitcaseS = (x: number, y: number, s = 1, col: string = C.red) => all(rect(x - 9 * s, y - 8 * s, 18 * s, 16 * s, col, 3, C.ink, 1.4), path(`M${x - 4 * s} ${y - 8 * s} L${x - 4 * s} ${y - 12 * s} L${x + 4 * s} ${y - 12 * s} L${x + 4 * s} ${y - 8 * s}`, 'none', C.ink, 1.4));
const flagJPs = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, C.white, 1, C.ink, 1), circle(0, 0, 3.4, '#d6302c', null));
const flagSEs = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, '#2f6ab8', 1, C.ink, 1), rect(-4.5, -6, 3, 12, '#f2c94e', 0, null), rect(-9, -1.5, 18, 3, '#f2c94e', 0, null));
/** Shopping bag hanging from a hand at (x, y). */
const bagS = (x: number, y: number) => all(path(`M${x - 4} ${y + 6} C${x - 4} ${y - 2} ${x + 4} ${y - 2} ${x + 4} ${y + 6}`, 'none', C.ink, 1.3), rect(x - 8, y + 5, 16, 18, C.white, 2, C.ink, 1.3), line(`M${x - 8} ${y + 9} L${x + 8} ${y + 9}`, C.sky, 2));
const sea = (y: number) => all(rect(4, y, 112, 112 - y, '#3d78b8', 0, null), path(`M4 ${y} C14 ${y - 3} 24 ${y + 3} 34 ${y} C44 ${y - 3} 54 ${y + 3} 64 ${y} C74 ${y - 3} 84 ${y + 3} 94 ${y} C104 ${y - 3} 112 ${y + 2} 116 ${y}`, 'none', '#bfe3f5', 2));

export const POLITENESS_MOTIFS: Record<string, Svg> = {
  // ── Tilltala personer ────────────────────────────────────────────
  // artighet: a woman holds the door for a man with full bags – both smile, a small sparkle of good manners.
  'artig.artighet': all(ground, door(30, 112, 28, 74, true), fig(46, C.orange, 'smile', { hairStyle: 'long' }), reach(46, 1, -1, 26, 70), fig(92, C.green, 'smile'), bagS(76, 74), bagS(108, 74), sb(92, 1, -1, 22, 18, (x, y) => hrt(x, y + 1, 0.6)), sparkle(64, 52, 4), sparkle(70, 44, 2.6)),
  // titel: a door sign – a big graduation-cap icon (the title, ringed) before the grey name lines.
  'artig.titel': all(rect(12, 30, 96, 52, '#f3ead8', 4, C.ink, 2.2), circle(36, 56, 15, 'none', HL, 2.4), capIcon(36, 56, 2, C.navy), lines(74, 50, 40, 2, C.grey), circle(16, 34, 1.6, C.grey, null), circle(104, 34, 1.6, C.grey, null), arrow(36, 102, 36, 76, HL, 2.6)),
  // herr: a letter addressed to a man – the envelope shows a top-hat man icon (ringed) before the name lines.
  'artig.herr': all(rect(12, 30, 96, 60, C.white, 3, C.ink, 2.2), rect(88, 36, 14, 16, C.red, 1, C.ink, 1.2), circle(95, 44, 4, 'none', C.white, 1), circle(36, 66, 13, 'none', HL, 2.2), mini(36, 70, 1.7, C.navy), rect(31, 52.6, 10, 4.4, C.black, 0.8, null), rect(28, 56.4, 16, 1.8, C.black, 0.6, null), lines(76, 62, 42, 3, C.grey)),
  // tilltal: how should I address you? – three choices in the bubble (first name tag, title cap, smiley), one picked.
  'artig.tilltal': all(ground, fig(24, C.orange, 'calm', { hairStyle: 'long' }), fig(100, C.navy, 'smile', { h: 0.94 }), tieOn(100, 0.94), say(60, 22, 64, 26, 30, 30, all(nameTag(44, 22, 0.75), capIcon(62, 22, 1.2, C.navy), face(80, 22, 6), circle(44, 22, 11, 'none', HL, 2))), q(60, 48, 12, HL)),
  // dua: a young employee chats with the boss (tie) as an equal – bubble with ONE small person and a smile; both laugh.
  'artig.dua': all(ground, fig(28, C.green, 'laugh', { h: 0.92 }), fig(92, C.navy, 'laugh'), tieOn(92), sb(28, 0.92, 1, 30, 22, (x, y) => all(mini(x - 6, y + 2, 1.2, C.navy), face(x + 7, y, 5))), arrow(48, 70, 72, 70, HL, 2), arrow(72, 70, 48, 70, HL, 2)),
  // nia: a young cashier speaks to an older lady with a plural "you" – bubble with THREE small people for one person; she looks surprised.
  'artig.nia': all(ground, fig(26, C.red, 'calm', { h: 0.9 }), rect(4, 76, 58, 36, C.tan, 2, C.ink, 1.6), rect(8, 70, 22, 8, C.dark, 1, C.ink, 1.2), rect(36, 72, 22, 4, C.grey, 1, C.ink, 1), rect(46, 66, 8, 6, C.yellow, 1, C.ink, 1), old(94, C.purple, 'shock', { hairStyle: 'long', h: 0.88 }), sb(26, 0.9, 1, 36, 22, (x, y) => people3(x, y + 2, 1.05)), q(108, 14, 13, HL)),
  // du-reformen: before (grey): a small person bows to a big man in top hat; after: everyone stands equal and shakes hands; an arrow between.
  'artig.du-reformen': all(ground, greyed(fig(14, C.sky, 'calm', { h: 0.7 }), fig(38, C.dark, 'smile', { h: 1 }), hat(38, 1)), arrow(50, 62, 62, 62, HL, 2.6), fig(76, C.orange, 'laugh', { hairStyle: 'long', h: 0.9 }), fig(104, C.green, 'laugh', { h: 0.9 }), reach(76, 0.9, 1, 89, 68), reach(104, 0.9, -1, 91, 68)),
  // hierarki: a pyramid of people – one boss on top, two in the middle, four at the bottom; arrows point down.
  'artig.hierarki': all(path('M60 8 L112 104 L8 104 Z', '#f3ead8', C.ink, 1.6), line('M37 50 L83 50 M22 78 L98 78', C.ink, 1.2), mini(60, 40, 1.5, C.navy), path('M57 30 L60 34 L63 30 Z', C.gold, null), pyramidRow(70, 2, C.sky), pyramidRow(98, 4, C.grey), arrow(86, 30, 98, 52, HL, 2), arrow(100, 62, 108, 84, HL, 2)),
  // jämlik: two people stand on a perfectly level seesaw – same height, same weight, an equals sign between them.
  'artig.jämlik': all(ground, level(60, 100, 104), fig(26, C.orange, 'smile', { hairStyle: 'long', h: 0.78 }), fig(94, C.green, 'smile', { h: 0.78 }), T(60, 56, '=', 22, HL)),
  // informell: grey formal reference (suit, tie, stiff) next to a relaxed person in a T-shirt and cap with coffee, laughing.
  'artig.informell': all(ground, greyed(fig(30, C.dark, 'calm'), tieOn(30, 1)), fig(88, C.yellow, 'laugh', { bottom: C.denim }), cap(88, 1, C.green), reach(88, 1, 1, 108, 60), cup(110, 56), sparkle(70, 30, 3)),
  // titulera: a patient greets the doctor (white coat) with the title – the bubble holds a stethoscope-cap icon, not a name.
  'artig.titulera': all(ground, bowing(30, C.orange, 10, { hairStyle: 'long' }), fig(92, C.white, 'smile'), line('M86 46 C84 60 96 60 96 50', C.ink, 1.4), circle(96, 50, 2, C.grey, C.ink, 1), sb(30, 1, 1, 26, 20, (x, y) => capIcon(x, y, 1.3, C.navy), 12, -4)),
  // hej allihop: someone comes in and waves to the whole group – bubble with a palm and three small heads.
  'artig.hej-allihop': all(ground, fig(22, C.orange, 'laugh', { hairStyle: 'long' }), reach(22, 1, 1, 34, 14), waveM(34, 14), fig(70, C.sky, 'smile', { h: 0.82 }), fig(88, C.green, 'smile', { h: 0.86 }), fig(106, C.purple, 'smile', { hairStyle: 'long', h: 0.82 }), say(72, 18, 34, 20, 40, 18, all(palm(62, 21, 0.7, false), people3(80, 20, 0.8)))),
  // mina damer och herrar: a speaker in a bow tie at a podium with a microphone, a rows of seated guests in front.
  'artig.mina-damer-och-herrar': all(rect(4, 4, 112, 108, '#2f3550', 4, null), path('M30 4 L10 80 L60 80 Z', 'rgba(255,240,180,0.35)', null), fig(36, C.black, 'smile', { h: 0.8 }), bowOn(36, 0.8), rect(20, 66, 32, 30, '#8a5a3a', 2, C.ink, 1.6), mic(48, 52, 0.9), ...[0, 1, 2, 3].map((i) => all(circle(72 + i * 11, 84, 5, C.skin, C.ink, 1), path(`M${66 + i * 11} 96 C${66 + i * 11} 88 ${78 + i * 11} 88 ${78 + i * 11} 96 Z`, [C.red, C.navy, C.purple, C.green][i]!, C.ink, 1))), ...[0, 1, 2].map((i) => all(circle(77 + i * 12, 100, 5, C.skin, C.ink, 1), path(`M${71 + i * 12} 112 C${71 + i * 12} 104 ${83 + i * 12} 104 ${83 + i * 12} 112 Z`, [C.orange, C.sky, C.pink][i]!, C.ink, 1)))),
  // ers majestät: a person bows to the king with a crown – the bubble holds a crown.
  'artig.ers-majestät': all(ground, rect(70, 104, 46, 8, C.red, 1, null), bowing(28, C.green, 10), fig(92, C.purple, 'smile'), crownOn(92), sb(28, 1, 1, 24, 20, (x, y) => crown(x, y + 1, 0.7), 6, -6)),

  // ── Tacka och svara på tack ──────────────────────────────────────
  // tack så mycket: a colleague brings a coffee – the thanks is one big heart.
  'artig.tack-så-mycket': all(ground, fig(30, C.green, 'smile'), reach(30, 1, 1, 52, 64), cup(58, 62), fig(92, C.orange, 'laugh', { hairStyle: 'long' }), sb(92, 1, -1, 28, 24, (x, y) => hrt(x, y + 1, 0.95))),
  // tusen tack: a big present and flowers – the thanks overflows with many hearts, arms up in joy.
  'artig.tusen-tack': all(ground, fig(34, C.green, 'smile'), gift(58, 92, 1.1), fig(90, C.orange, 'laugh', { hairStyle: 'long' }), reach(90, 1, -1, 76, 20), reach(90, 1, 1, 108, 22), ...[[60, 14], [72, 8], [84, 4], [98, 6], [110, 12], [66, 28], [104, 30], [54, 40], [78, 30]].map(([x, y], i) => hrt(x!, y!, 0.38 + (i % 3) * 0.08, i % 2 ? C.pink : C.red))),
  // tack ska du ha: a friend in a cap brings back the repaired bike – a warm, casual thanks with a heart and a thumb.
  'artig.tack-ska-du-ha': all(ground, bike(38, 100, 1.1), fig(20, C.navy, 'smile', { h: 0.9 }), cap(20, 0.9, C.yellow), fig(92, C.orange, 'laugh', { hairStyle: 'long' }), sb(92, 1, -1, 30, 22, (x, y) => all(hrt(x - 6, y + 1, 0.55), thumb(x + 7, y + 3, 0.75)))),
  // otacksam: she gets a gift, turns away with her nose up, the gift dropped – the giver is sad.
  'artig.otacksam': all(ground, fig(28, C.green, 'frown'), reach(28, 1, 1, 46, 70), fig(90, C.purple, 'angry', { hairStyle: 'long' }), gift(66, 104, 0.8), path('M60 92 l-4 -4 M66 90 l0 -5 M72 92 l4 -4', 'none', C.grey, 1.2), cross(110, 40, 0.8, C.red)),
  // vad snällt av dig: a colleague puts a coffee on her desk – she touches her heart, the bubble shows a star above a small person (you are kind).
  'artig.vad-snällt-av-dig': all(table(80, 6, 70), laptop(28, 80, 0.9), fig(36, C.orange, 'blush', { hairStyle: 'long', h: 0.82 }), reach(36, 0.82, 1, 38, 50), fig(92, C.green, 'smile'), reach(92, 1, -1, 62, 74), cup(60, 72), sb(36, 0.82, 1, 26, 24, (x, y) => all(mini(x, y + 4, 1.3, C.green), star(x, y - 7, 3.4, C.yellow)), 4, -4), arrow(70, 30, 82, 34, HL, 1.8)),
  // det hade du inte behövt: flowers arrive – she blushes, laughs and lifts a hand: oh, no need! (bubble: gift + stop palm)
  'artig.det-hade-du-inte-behövt': all(ground, fig(30, C.green, 'smile'), reach(30, 1, 1, 52, 60), bouquet(56, 52, 1.1), fig(92, C.orange, 'blush', { hairStyle: 'long' }), reach(92, 1, -1, 76, 54), palm(76, 52, 0.8), sb(92, 1, -1, 32, 22, (x, y) => all(gift(x - 6, y + 2, 0.55), palm(x + 8, y + 2, 0.6, false)), 0, -6)),
  // tack på förhand: an e-mail – the heart (thanks) comes first, the help (a box) only later on the arrow of time.
  'artig.tack-på-förhand': all(laptop(60, 70, 2.6), hrt(42, 46, 0.8), lines(72, 38, 30, 4, C.grey), line('M14 98 L106 98', C.ink, 1.6), arrow(96, 98, 108, 98, C.ink, 1.6), circle(34, 98, 4, HL, null), hrt(34, 88, 0.45), circle(84, 98, 4, C.grey, null), box(84, 86, 12, 9), T(34, 110, '1', 9, HL), T(84, 110, '2', 9, C.grey)),
  // tacka av: the colleague leaves with her box – the others give flowers and cake and clap.
  'artig.tacka-av': all(ground, door(108, 112, 18, 70, true), fig(84, C.orange, 'laugh', { hairStyle: 'long' }), box(84, 82, 18, 12), fig(46, C.green, 'smile', { h: 0.92 }), reach(46, 0.92, 1, 64, 56), bouquet(66, 48, 0.9), fig(18, C.purple, 'laugh', { hairStyle: 'long', h: 0.88 }), path('M8 36 l-4 -3 M10 30 l-2 -4 M28 30 l2 -4', 'none', HL, 1.4), rect(4, 96, 26, 16, C.white, 1, C.ink, 1.2), rect(8, 90, 18, 6, '#f6c0d0', 1, C.ink, 1)),
  // tacktal: a woman stands at a festive table with a paper and a raised glass – the thanks (heart) goes to the seated guests.
  'artig.tacktal': all(fig(60, C.purple, 'smile', { hairStyle: 'long' }), reach(60, 1, 1, 80, 30), glassW(80, 26, 1.1), reach(60, 1, -1, 42, 50), rect(34, 40, 12, 16, C.white, 1, C.ink, 1), table(84, 4, 116), ...[14, 30, 92, 108].map((x, i) => all(circle(x, 76, 6, C.skin, C.ink, 1.1), path(`M${x - 7} 84 C${x - 7} 76 ${x + 7} 76 ${x + 7} 84 Z`, [C.red, C.green, C.sky, C.orange][i]!, C.ink, 1))), say(98, 16, 24, 18, 72, 20, hrt(98, 17, 0.6))),
  // tacksamhetsskuld: after big help he thinks of a scale – a heavy heart on one side, the side for giving back still empty.
  'artig.tacksamhetsskuld': all(ground, fig(26, C.green, 'calm'), tb(26, 1, 1, 62, 50, (x, y) => all(line(`M${x} ${y - 14} L${x} ${y + 14} M${x - 8} ${y + 14} L${x + 8} ${y + 14}`, C.ink, 1.6), g(`rotate(-14 ${x} ${y - 10})`, line(`M${x - 22} ${y - 10} L${x + 22} ${y - 10}`, C.ink, 1.8), line(`M${x - 18} ${y - 10} L${x - 18} ${y - 2} M${x + 18} ${y - 10} L${x + 18} ${y - 2}`, C.ink, 1), path(`M${x + 11} ${y - 2} L${x + 25} ${y - 2} L${x + 22} ${y + 2} L${x + 14} ${y + 2} Z`, C.grey2, C.ink, 1)), path(`M${x - 25} ${y + 8} L${x - 11} ${y + 8} L${x - 14} ${y + 12} L${x - 22} ${y + 12} Z`, C.grey2, C.ink, 1), hrt(x - 18, y + 2, 0.6)), 0, 20), fig(104, C.orange, 'smile', { hairStyle: 'long', h: 0.62 }), box(80, 106, 16, 11)),
  // tack själv: after a nice evening both thank each other – two hearts that cross on their way.
  'artig.tack-själv': all(ground, fig(22, C.orange, 'laugh', { hairStyle: 'long' }), fig(98, C.green, 'laugh'), sb(22, 1, 1, 22, 18, (x, y) => hrt(x, y + 1, 0.55)), sb(98, 1, -1, 22, 18, (x, y) => hrt(x, y + 1, 0.55)), path('M36 50 C50 40 70 60 84 50', 'none', HL, 1.6), arrow(80, 52, 85, 49, HL, 1.6), path('M84 62 C70 72 50 52 36 62', 'none', HL, 1.6), arrow(40, 60, 35, 63, HL, 1.6)),
  // för all del: he holds the door wide with an inviting sweep of the hand – of course, go ahead; her thanks in grey.
  'artig.för-all-del': all(ground, door(92, 112, 26, 74, true), fig(72, C.green, 'smile'), reach(72, 1, -1, 50, 66), palm(50, 66, 0.8, false), arrow(56, 80, 40, 84, HL, 2), fig(22, C.orange, 'smile', { hairStyle: 'long', h: 0.92 }), greyed(sb(22, 0.92, 1, 20, 16, (x, y) => hrt(x, y + 1, 0.5))), sb(72, 1, 1, 22, 18, (x, y) => face(x, y, 5.6), -2, -4)),
  // inget att tacka för: her thanks (grey heart) – he answers with a feather: it weighed nothing.
  'artig.inget-att-tacka-för': all(ground, fig(24, C.orange, 'smile', { hairStyle: 'long' }), greyed(sb(24, 1, 1, 20, 16, (x, y) => hrt(x, y + 1, 0.5))), fig(96, C.green, 'smile'), sb(96, 1, -1, 28, 24, (x, y) => feather(x, y, 0.9), 0, 14), box(46, 104, 18, 12)),

  // ── Be om en tjänst ──────────────────────────────────────────────
  // snälla: a child presses its hands together and pleads with big eyes – a heart and a question in the bubble.
  'artig.snälla': all(ground, fig(32, C.yellow, 'frown', { h: 0.7 }), reach(32, 0.7, -1, 31, 68), reach(32, 0.7, 1, 33, 68), path('M29.4 70 L32 60 L34.6 70 Z', C.skin, C.ink, 1), sb(32, 0.7, 1, 26, 18, (x, y) => all(hrt(x - 5, y + 1, 0.45), q(x + 6, y, 11, HL)), 0, -6), old(92, C.sky, 'smile', { h: 1, hairStyle: 'long', hair: C.hair })),
  // skulle du kunna: a polite question – the bubble shows a window and a question; the other stands by the window.
  'artig.skulle-du-kunna': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), sb(26, 1, 1, 30, 22, (x, y) => all(windowI(x - 5, y, 0.8), q(x + 9, y, 12))), rect(80, 30, 30, 30, '#bfe3f5', 1, C.ink, 1.6), line('M95 30 L95 60 M80 45 L110 45', C.ink, 1.2), fig(92, C.green, 'smile', { h: 0.9 })),
  // vara snäll och: a teacher points firmly at the open door – the bubble: door and a closing arrow.
  'artig.vara-snäll-och': all(ground, door(104, 112, 22, 66, true), fig(30, C.purple, 'calm', { hairStyle: 'long' }), reach(30, 1, 1, 56, 46), sb(30, 1, 1, 28, 22, (x, y) => all(doorI(x - 5, y, 0.9), path(`M${x + 4} ${y - 4} C${x + 10} ${y - 2} ${x + 10} ${y + 4} ${x + 6} ${y + 6}`, 'none', HL, 1.4), arrow(x + 7, y + 4, x + 5, y + 7, HL, 1.4)), 0, -8), fig(76, C.yellow, 'calm', { h: 0.7 })),
  // förlåt att jag stör: she peeks in at a busy colleague's door and lifts a hand – a small apologetic bubble.
  'artig.förlåt-att-jag-stör': all(ground, door(30, 112, 26, 80, true), fig(30, C.orange, 'calm', { hairStyle: 'long' }), reach(30, 1, 1, 46, 30), sb(30, 1, 1, 22, 16, (x, y) => all(palm(x - 4, y + 2, 0.55, false), q(x + 6, y, 10)), 6, -4), table(84, 60, 116), laptop(96, 84, 1), fig(96, C.green, 'shock', { h: 0.86 }), ex(110, 30, 12)),
  // jag undrar om: hand on chin, a soft question – thought dots and a gentle question mark.
  'artig.jag-undrar-om': all(ground, fig(28, C.orange, 'calm', { hairStyle: 'long' }), reach(28, 1, 1, 30, 30), tb(28, 1, 1, 22, 16, (x, y) => q(x, y, 11, C.grey), -8, -6), sb(28, 1, 1, 26, 18, (x, y) => all(dots(x - 4, y, C.navy), q(x + 8, y, 11)), 6, 22), fig(96, C.green, 'smile')),
  // har du möjlighet: she shows a calendar day and asks – the other checks his phone for time.
  'artig.har-du-möjlighet': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), sb(26, 1, 1, 30, 24, (x, y) => all(cal(x - 5, y, 0.8, [6]), q(x + 10, y, 12))), fig(92, C.green, 'calm'), reach(92, 1, -1, 80, 56), phoneI(80, 52, 1), cal(104, 20, 0.9, [6], 4, C.green)),
  // kan du tänka dig: would you consider…? – the bubble shows a child and a question; the other thinks it over.
  'artig.kan-du-tänka-dig': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), sb(26, 1, 1, 28, 22, (x, y) => all(childIcon(x - 5, y, 1.3), q(x + 9, y, 12))), fig(94, C.green, 'calm'), reach(94, 1, -1, 92, 32), tb(94, 1, -1, 26, 18, (x, y) => all(childIcon(x - 4, y, 0.9), q(x + 6, y, 9, C.grey)), 6, -2)),
  // det vore snällt: it would be kind if you called – bubble with a ringing phone and a heart.
  'artig.det-vore-snällt': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), sb(26, 1, 1, 32, 24, (x, y) => all(phoneI(x - 6, y, 1, true), hrt(x + 9, y + 1, 0.5))), fig(94, C.green, 'smile'), reach(94, 1, -1, 82, 58), phoneI(82, 54, 1)),
  // självklart: the answer – a big nod, a thumb up and a large green check.
  'artig.självklart': all(ground, fig(24, C.orange, 'calm', { hairStyle: 'long', h: 0.92 }), greyed(sb(24, 0.92, 1, 18, 16, (x, y) => q(x, y, 11))), fig(92, C.green, 'laugh'), nodM(92), reach(92, 1, -1, 74, 56), thumb(74, 56, 1), sb(92, 1, -1, 28, 24, (x, y) => check(x, y, 1.6), 0, 18)),
  // inga problem: no problem – he lifts the heavy box with one hand, relaxed, a thumb up.
  'artig.inga-problem': all(ground, fig(26, C.orange, 'calm', { hairStyle: 'long', h: 0.92 }), fig(88, C.yellow, 'laugh', { bottom: C.denim }), reach(88, 1, 1, 106, 28), box(106, 20, 22, 16), reach(88, 1, -1, 70, 54), thumb(70, 54, 0.9), sb(88, 1, -1, 22, 18, (x, y) => face(x, y, 6, 'grin'), -4, -6)),
  // med nöje: with pleasure – hand on heart, a small bow, sparkles and a heart with a check.
  'artig.med-nöje': all(ground, fig(28, C.orange, 'calm', { hairStyle: 'long', h: 0.92 }), fig(90, C.navy, 'calm'), bowOn(90), nodM(90), reach(90, 1, -1, 86, 52), sb(90, 1, -1, 30, 22, (x, y) => all(hrt(x - 6, y + 1, 0.55), check(x + 7, y, 1)), -6, 6), sparkle(110, 20, 4), sparkle(70, 16, 3)),
  // om det inte är för mycket begärt: a big request (a car and a plane) – she asks, apologetic, sweating, fingers showing "just a little".
  'artig.om-det-inte-är-för-mycket-begärt': all(ground, fig(28, C.orange, 'frown', { hairStyle: 'long' }), sweat(28), reach(28, 1, 1, 50, 54), path('M48 50 L48 46 M52 50 L52 47', 'none', C.ink, 1.4), sb(28, 1, 1, 40, 24, (x, y) => all(g(`translate(${x - 8} ${y + 2}) scale(0.7)`, rect(-12, -6, 24, 9, C.red, 3, C.ink, 1.1), circle(-6, 4, 3, C.dark, null), circle(6, 4, 3, C.dark, null)), weight(x + 11, y, 0.8)), 0, -6), fig(94, C.green, 'calm')),
  // gentjänst: a favour in return – she waters his plants, he feeds her cat; arrows go round between them.
  'artig.gentjänst': all(ground, fig(24, C.orange, 'smile', { hairStyle: 'long', h: 0.92 }), plant(42, 104, 1), fig(96, C.green, 'smile', { h: 0.92 }), catI(78, 104, 1), path('M38 26 C50 10 70 10 82 26', 'none', HL, 2), arrow(78, 22, 83, 28, HL, 2), path('M82 46 C70 60 50 60 38 46', 'none', C.navy, 2), arrow(42, 50, 37, 44, C.navy, 2), hrt(60, 30, 0.5), hrt(60, 46, 0.5, C.sky)),
  // återgälda: he gives a present back to the woman who helped him (the earlier help remembered in grey).
  'artig.återgälda': all(ground, fig(26, C.orange, 'laugh', { hairStyle: 'long' }), fig(94, C.green, 'smile'), reach(94, 1, -1, 64, 64), gift(58, 64, 0.9), greyed(tb(94, 1, -1, 28, 20, (x, y) => all(box(x - 5, y, 12, 9), hrt(x + 7, y, 0.4)), 0, -2)), path('M82 82 C66 94 48 92 40 84', 'none', HL, 1.8), arrow(44, 87, 38, 82, HL, 1.8)),

  // ── Avböja vänligt ───────────────────────────────────────────────
  // avböja: she gently pushes back the invitation card with an open hand, smiling politely.
  'artig.avböja': all(ground, fig(26, C.green, 'smile'), reach(26, 1, 1, 50, 58), envelope(56, 56, 0.6), fig(94, C.orange, 'smile', { hairStyle: 'long' }), reach(94, 1, -1, 70, 54), palm(70, 52, 0.85), arrow(62, 70, 46, 70, HL, 2), star(56, 48, 2.4, C.gold)),
  // upptagen: a busy man at a desk full of papers, the phone ringing, a full calendar – he lifts a hand to the friend.
  'artig.upptagen.2': all(table(84, 30, 116), ...[0, 1, 2, 3].map((i) => rect(36 + i * 2, 72 - i * 4, 20, 4, C.white, 1, C.ink, 1)), laptop(96, 84, 1), fig(80, C.navy, 'frown', { h: 0.86 }), sweat(80, 0.86), phoneI(108, 76, 0.9, true), cal(104, 14, 1, [0, 1, 2, 3, 4, 5, 6, 7], 4, C.red), fig(20, C.orange, 'smile', { hairStyle: 'long', h: 0.92 }), greyed(sb(20, 0.92, 1, 18, 16, (x, y) => q(x, y, 10))), reach(80, 0.86, -1, 60, 40), palm(60, 38, 0.7)),
  // dessvärre: a formal letter on letterhead – a sad face and a cross, a polite regretful "no" in writing.
  'artig.dessvärre': all(rect(22, 8, 76, 100, C.white, 3, C.ink, 2), rect(22, 8, 76, 14, C.navy, 3, C.ink, 2), circle(32, 15, 3, C.gold, null), face(46, 44, 10, 'sad'), cross(74, 44, 1.4), lines(60, 68, 52, 4, C.grey), path('M66 96 C70 90 76 98 82 92 C86 88 90 96 94 92', 'none', C.navy, 1.4)),
  // ha förhinder: the invitation arrives on a Friday that already holds another appointment – a barrier blocks it.
  'artig.ha-förhinder': all(ground, cal(88, 42, 2.6, [4], 4, C.navy), suitcaseS(70, 57, 0.7), envelope(20, 40, 0.75), arrow(33, 40, 44, 40, HL, 2.4), rect(46, 18, 6, 50, C.red, 1, C.ink, 1.4), line('M46 28 L52 24 M46 40 L52 36 M46 52 L52 48 M46 64 L52 60', C.white, 1.6), fig(22, C.orange, 'frown', { hairStyle: 'long', h: 0.5 })),
  // kanske en annan gång: not tonight (today crossed) – but maybe another day (a later day with a question).
  'artig.kanske-en-annan-gång': all(ground, fig(24, C.green, 'smile'), sb(24, 1, 1, 22, 18, (x, y) => all(rect(x - 7, y - 6, 14, 12, C.dark, 1, C.ink, 1), circle(x, y, 3, C.yellow, null)), 0, -4), fig(96, C.orange, 'smile', { hairStyle: 'long' }), sb(96, 1, -1, 44, 22, (x, y) => all(cal(x - 10, y, 0.8, [1]), cross(x - 10, y + 1, 0.7), arrow(x - 1, y, x + 4, y, HL, 1.4), cal(x + 13, y, 0.8, [6], 4, C.green), q(x + 13, y + 2, 8, C.navy)), 0, 26)),
  // tackar som frågar: the host offers more coffee – the guest lifts a palm over the cup but smiles: a heart for the offer.
  'artig.tackar-som-frågar': all(table(84), fig(30, C.green, 'smile', { h: 0.86 }), reach(30, 0.86, 1, 52, 62), coffeePot(56, 60, 0.9), fig(90, C.orange, 'smile', { hairStyle: 'long', h: 0.86 }), cup(76, 78), reach(90, 0.86, -1, 76, 64), palm(76, 62, 0.7, false), sb(90, 0.86, -1, 28, 20, (x, y) => all(hrt(x - 6, y + 1, 0.5), cross(x + 7, y, 0.6)), 0, -6)),
  // inte min grej: others dance (grey) – she shrugs: music in her bubble is crossed out, not her thing.
  'artig.inte-min-grej': all(ground, greyed(fig(84, C.pink, 'laugh', { hairStyle: 'long', h: 0.86 }), fig(106, C.sky, 'laugh', { h: 0.88 }), note(96, 20, 1)), fig(32, C.orange, 'calm', { hairStyle: 'long' }), reach(32, 1, -1, 12, 34), reach(32, 1, 1, 52, 34), sb(32, 1, 1, 24, 20, (x, y) => all(note(x - 2, y + 2, 0.8), cross(x, y, 0.9)), 8, 0)),
  // hitta på en ursäkt: on the phone she claims to be sick (thermometer) – her thought shows the truth: the sofa.
  'artig.hitta-på-en-ursäkt': all(ground, fig(40, C.orange, 'smile', { hairStyle: 'long' }), reach(40, 1, 1, 52, 26), phoneI(52, 24, 0.9), sb(40, 1, 1, 30, 22, (x, y) => all(face(x - 5, y, 6, 'sad'), thermo(x + 8, y, 0.9)), 8, 18), tb(40, 1, -1, 30, 22, (x, y) => sofaI(x, y + 2, 0.9), 12, 6), sofaI(96, 106, 1.4)),
  // nödlögn: a friend shows a self-knitted ugly sweater – she says thumbs up, but her thought makes a face.
  'artig.nödlögn': all(ground, fig(30, C.green, 'laugh'), path('M18 46 L42 46 L54 58 L48 64 L44 60 L44 84 L16 84 L16 60 L12 64 L6 58 Z', '#a8c84a', C.ink, 1.4), path('M18 62 l5 6 l5 -6 l5 6 l5 -6 l4 5', 'none', C.purple, 1.8), circle(24, 76, 2.4, C.red, null), circle(36, 74, 2.4, C.yellow, null), fig(92, C.orange, 'smile', { hairStyle: 'long' }), sb(92, 1, -1, 22, 18, (x, y) => thumb(x, y + 3, 0.8), 0, 16), tb(92, 1, -1, 22, 18, (x, y) => face(x, y, 6, 'sad', C.mint), 2, 2), sweat(92)),
  // känna sig tvungen: she says yes (check) to the party, while her thought shows bed – a weight hangs on her.
  'artig.känna-sig-tvungen': all(ground, fig(40, C.orange, 'frown', { hairStyle: 'long' }), sb(40, 1, 1, 22, 18, (x, y) => check(x, y, 1.1), 2, 16), tb(40, 1, -1, 26, 18, (x, y) => bed(x, y, 0.8), 8, 4), line('M50 70 L72 90', C.ink, 1.4), weight(76, 100, 1.2), fig(100, C.green, 'smile', { h: 0.9 })),
  // vänligt men bestämt: a kind smile, straight back and a firm stop palm – the bubble: a heart and a solid cross.
  'artig.vänligt-men-bestämt': all(ground, fig(30, C.green, 'smile', { h: 0.92 }), greyed(sb(30, 0.92, 1, 18, 16, (x, y) => q(x, y, 10))), fig(88, C.orange, 'smile', { hairStyle: 'long' }), reach(88, 1, -1, 62, 52), palm(62, 50, 1.1, false), sb(88, 1, -1, 28, 20, (x, y) => all(hrt(x - 6, y + 1, 0.5), cross(x + 6, y, 0.75)), 0, -2)),
  // dra sig ur: three planned a trip (suitcase in the middle) – one walks out of the circle, leaving a dotted empty place.
  'artig.dra-sig-ur': all(ground, ellipse(46, 104, 42, 8, 'none', C.grey, 1.4), fig(18, C.orange, 'frown', { hairStyle: 'long', h: 0.86 }), fig(46, C.green, 'frown', { h: 0.86 }), suitcaseS(32, 100), circle(74, 60, 12, 'none', C.grey, 1.4), line('M66 60 L82 60', C.grey, 1.2, '3 3'), fig(104, C.purple, 'calm', { h: 0.86 }), arrow(82, 92, 100, 92, HL, 2)),

  // ── Småprata ─────────────────────────────────────────────────────
  // småprat: at the bus stop two strangers exchange small, light bubbles (sun, cloud, coffee) – nothing deep.
  'artig.småprat': all(ground, line('M12 112 L12 40', C.ink, 2), rect(4, 30, 16, 12, C.yellow, 2, C.ink, 1.2), fig(40, C.orange, 'smile', { hairStyle: 'long' }), fig(92, C.green, 'smile'), say(56, 12, 22, 14, 46, 22, sun(56, 12, 3)), say(82, 30, 22, 14, 88, 22, cloud(82, 31, 0.45, C.white)), say(66, 46, 20, 14, 50, 38, g('translate(66 48) scale(0.6)', cup(0, 0)))),
  // prata om vädret: neighbours over the fence – one points at the clouds, the bubbles hold sun and rain.
  'artig.prata-om-vädret': all(ground, cloud(60, 14, 1.2), rainD(48, 22, 24, 4), line('M8 92 L112 92 M8 100 L112 100', '#a0673d', 2), ...[16, 32, 48, 64, 80, 96, 112].map((x) => line(`M${x} 86 L${x} 112`, '#a0673d', 2)), fig(28, C.orange, 'smile', { hairStyle: 'long' }), reach(28, 1, 1, 50, 30), fig(94, C.green, 'smile'), sb(94, 1, -1, 22, 18, (x, y) => sun(x, y, 3.4), 0, 16)),
  // vilket väder: under a broken umbrella in pouring rain – she exclaims at the sky.
  'artig.vilket-väder': all(ground, cloud(40, 14, 1.3, C.grey), cloud(80, 12, 1.1, C.grey), rainD(14, 26, 92, 12), rainD(18, 40, 92, 12), fig(44, C.orange, 'shock', { hairStyle: 'long' }), umbrella(56, 20, 1.3), path('M44 112 C40 108 54 108 52 112', 'none', '#5aa7d6', 1.6), say(94, 52, 26, 22, 56, 26, all(cloud(90, 52, 0.4, C.grey), ex(102, 52, 13)))),
  // hur var helgen: Monday morning at work – the question shows a weekend calendar (the last two days marked).
  'artig.hur-var-helgen': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), reach(26, 1, 1, 44, 64), cup(48, 62), sb(26, 1, 1, 34, 24, (x, y) => all(g(`translate(${x - 6} ${y}) scale(0.9)`, rect(-12, -8, 24, 16, C.white, 2, C.ink, 1.1), ...[0, 1, 2, 3, 4, 5, 6].map((i) => rect(-10.6 + i * 3.1, -2, 2.4, 6, i > 4 ? HL : C.grey2, 0.6, null))), q(x + 12, y, 12))), fig(94, C.green, 'smile'), sun(104, 14, 4)),
  // sommarplan: two colleagues plan the summer – the thought holds sun, a tent and a lake.
  'artig.sommarplan': all(ground, fig(24, C.green, 'smile', { h: 0.92 }), fig(96, C.orange, 'laugh', { hairStyle: 'long' }), thinkB(60, 28, 56, 36, 88, 18, all(sun(44, 20, 4), path('M54 34 L62 20 L70 34 Z', C.red, C.ink, 1.1), line('M62 20 L62 34', C.ink, 0.8), ellipse(76, 38, 10, 3, '#5aa7d6', null))), sb(24, 0.92, 1, 18, 14, (x, y) => q(x, y, 10), 0, 26)),
  // artighetsfras: she says a big friendly bubble (smile, heart) – but her thought is empty dots: said, not really meant.
  'artig.artighetsfras': all(ground, fig(30, C.orange, 'smile', { hairStyle: 'long' }), sb(30, 1, 1, 34, 22, (x, y) => all(face(x - 7, y, 6, 'grin'), hrt(x + 8, y + 1, 0.5)), 4, 16), tb(30, 1, -1, 22, 14, (x, y) => dots(x, y, C.grey), 12, 2), fig(94, C.green, 'smile', { h: 0.94 }), greyed(sb(94, 0.94, -1, 16, 14, (x, y) => face(x, y, 4.6, 'flat'), 0, -2))),
  // bryta isen: two strangers stand on each side of a block of ice; one tells a joke and the ice cracks – both laugh.
  'artig.bryta-isen': all(ground, ice(60, 112, 30, 56, true), fig(22, C.orange, 'laugh', { hairStyle: 'long' }), fig(98, C.green, 'laugh'), sb(22, 1, 1, 22, 18, (x, y) => face(x, y, 6, 'grin'), 2, -10), path('M52 52 l-4 -4 M60 50 l0 -6 M68 52 l4 -4', 'none', HL, 1.6)),
  // hålla igång samtalet: she juggles three speech bubbles so that none falls – the talk keeps going.
  'artig.hålla-igång-samtalet': all(ground, fig(60, C.orange, 'laugh', { hairStyle: 'long' }), reach(60, 1, -1, 38, 46), reach(60, 1, 1, 82, 46), say(32, 26, 20, 14, 36, 40, dots(32, 26, C.navy)), say(60, 8, 20, 12, 60, 18, q(60, 8, 9)), say(88, 26, 20, 14, 84, 40, face(88, 26, 4)), path('M40 18 C46 8 52 6 56 6 M64 6 C68 6 74 8 80 18', 'none', HL, 1.3), fig(104, C.green, 'smile', { h: 0.8 })),
  // prata på: one talks on and on – a long chain of bubbles; the listener's eyes are heavy.
  'artig.prata-på': all(ground, fig(22, C.green, 'laugh', { h: 0.94 }), ...[0, 1, 2, 3].map((i) => say(42 + i * 18, 14 + i * 10, 18, 12, i === 0 ? 30 : 34 + i * 18, i === 0 ? 22 : 10 + i * 10, dots(42 + i * 18, 14 + i * 10, C.navy))), fig(100, C.orange, 'sleepy', { hairStyle: 'long' }), T(114, 14, 'z', 9, C.navy)),
  // pinsam tystnad: two people side by side look away from each other, sweating – only an empty bubble with dots.
  'artig.pinsam-tystnad': all(ground, fig(36, C.orange, 'calm', { hairStyle: 'long' }), fig(84, C.green, 'calm'), sweat(36), sweat(84), path('M24 22 l-4 0 M96 22 l4 0', 'none', C.ink, 1.6), say(60, 14, 26, 16, 48, 26, dots(60, 14, C.grey)), line('M60 40 L60 104', C.grey2, 1.4, '3 3')),
  // känsligt ämne: a question about money (coins) with a warning sign – the listener pulls back, uncomfortable.
  'artig.känsligt-ämne': all(ground, fig(26, C.orange, 'smile', { hairStyle: 'long' }), sb(26, 1, 1, 34, 24, (x, y) => all(coin(x - 9, y + 3, 4.4), coin(x - 3, y - 1, 4.4), warn(x + 9, y, 0.95))), fig(96, C.green, 'shock'), sweat(96), path('M108 54 l6 0 M108 60 l6 0', 'none', C.ink, 1.2)),
  // ytlig: their bubbles float on the surface of the sea – the heart deep down is never reached.
  'artig.ytlig.2': all(sea(52), ellipse(30, 52, 12, 3, C.white, null), say(32, 40, 22, 14, 32, 52, sun(32, 40, 3)), say(64, 36, 22, 14, 64, 52, cloud(64, 37, 0.4, C.white)), say(94, 40, 22, 14, 94, 52, g('translate(94 42) scale(0.55)', cup(0, 0))), hrt(60, 94, 1, C.red), path('M60 60 L60 82', 'none', '#bfe3f5', 1.4, ), line('M50 70 L70 70', C.white, 1, '2 3')),
  // konversera: an elegant reception – two guests with wine glasses talk politely, a chandelier above.
  'artig.konversera': all(ground, line('M60 4 L60 12', C.ink, 1.2), path('M46 12 L74 12 L70 20 L50 20 Z', C.gold, C.ink, 1.2), ...[48, 56, 64, 72].map((x) => circle(x, 22, 1.6, C.yellow, null)), fig(32, C.purple, 'smile', { hairStyle: 'long' }), fig(88, C.black, 'smile'), bowOn(88), reach(32, 1, 1, 48, 60), glassW(48, 56, 1), reach(88, 1, -1, 72, 60), glassW(72, 56, 1), say(60, 36, 22, 14, 44, 30, dots(60, 36, C.navy))),

  // ── Gästfrihet och värdskap ──────────────────────────────────────
  // gästfri: the host opens the door with wide arms – inside a table full of food waits for the guests.
  'artig.gästfri': all(ground, rect(52, 20, 64, 92, '#fff2b8', 1, C.ink, 1.6), table(84, 64, 112), ellipse(78, 82, 9, 3, C.white, C.ink, 1.1), ellipse(98, 82, 9, 3, C.white, C.ink, 1.1), path('M72 80 C74 74 82 74 84 80 Z', C.orange, C.ink, 1), fig(64, C.green, 'laugh'), reach(64, 1, -1, 42, 44), reach(64, 1, 1, 86, 44), fig(20, C.orange, 'smile', { hairStyle: 'long', h: 0.9 }), hrt(64, 10, 0.55)),
  // gästfrihet: a warm house with an open door and light – a heart over the roof, guests welcomed in.
  'artig.gästfrihet': all(ground, path('M30 50 L60 22 L90 50 Z', C.red, C.ink, 1.8), rect(34, 50, 52, 62, '#f3ead8', 1, C.ink, 1.8), rect(52, 76, 16, 36, '#fff2b8', 1, C.ink, 1.4), path('M52 76 L44 80 L44 112 L52 112 Z', '#c8925a', C.ink, 1.2), rect(70, 60, 10, 10, '#ffd36b', 1, C.ink, 1.2), hrt(60, 12, 0.8), mini(100, 106, 1.6, C.orange), mini(16, 106, 1.6, C.green), arrow(24, 96, 40, 96, HL, 2), arrow(96, 96, 80, 96, HL, 2)),
  // värdskap: the host goes round with a bottle and fills every guest's glass – each glass gets a check.
  'artig.värdskap': all(table(84), fig(60, C.navy, 'smile'), reach(60, 1, 1, 82, 54), path('M80 40 L86 40 L88 60 L78 60 Z', C.green, C.ink, 1.2), ...[18, 38, 84, 104].map((x) => all(glassW(x, 78, 1.1), check(x, 62, 0.8)))),
  // välkommen in: the door is open, the host waves the guest in with a sweep of the arm; the guest on the mat.
  'artig.välkommen-in': all(ground, rect(66, 22, 46, 90, '#fff2b8', 1, C.ink, 1.6), path('M66 22 L56 28 L56 112 L66 112 Z', '#c8925a', C.ink, 1.4), fig(92, C.green, 'laugh'), reach(92, 1, -1, 70, 60), arrow(60, 74, 80, 74, HL, 2.4), rect(18, 108, 40, 4, '#a0673d', 1, null), fig(36, C.orange, 'smile', { hairStyle: 'long' }), bouquet(48, 66, 0.7)),
  // ta av sig skorna: in the hall he takes off a shoe on one leg; other shoes stand in a row on the mat.
  'artig.ta-av-sig-skorna': all(ground, rect(4, 104, 112, 8, '#c9b48a', 1, null), shoe(70, 104, 1), shoe(88, 104, 1, C.red), shoe(104, 104, 1, C.navy), g('rotate(-8 34 112)', fig(34, C.green, 'calm')), reach(34, 1, 1, 50, 88), shoe(54, 90, 1.1, '#5a3a2a'), arrow(58, 80, 70, 70, HL, 2)),
  // innesko: a pair of light indoor shoes stand ready on the hall floor next to a pair of outdoor boots (grey).
  'artig.innesko': all(rect(4, 84, 112, 28, '#e8dcc4', 1, null), greyed(g('translate(26 78) scale(1.6)', shoe(0, 0, 1, '#5a3a2a')), g('translate(26 98) scale(1.6)', shoe(0, 0, 1, '#5a3a2a'))), slipper(76, 72, 2.4, C.pink), slipper(84, 96, 2.4, C.pink), sparkle(104, 58, 4)),
  // hänga av sig: in the hall she hangs her jacket on a hook.
  'artig.hänga-av-sig': all(ground, coatHook(76, 26), jacketI(66, 44, 1, C.navy), fig(38, C.orange, 'smile', { hairStyle: 'long' }), reach(38, 1, 1, 84, 30), jacketI(86, 44, 1, C.red), arrow(96, 20, 88, 28, HL, 1.6)),
  // känn dig som hemma: the guest sinks into the sofa with a cup – the host's bubble shows a house with a heart.
  'artig.känn-dig-som-hemma': all(ground, rect(10, 76, 66, 22, C.green, 4, C.ink, 1.6), rect(6, 70, 10, 32, C.green, 3, C.ink, 1.4), rect(70, 70, 10, 32, C.green, 3, C.ink, 1.4), line('M14 102 L14 112 M72 102 L72 112', C.ink, 2), circle(40, 52, 8, C.skin, C.ink, 1.4), path('M32 50 C32 40 48 40 48 50 C44 46 36 46 32 50 Z', C.hair, C.ink, 1), path('M30 80 C30 62 50 62 50 80 Z', C.orange, C.ink, 1.4), path('M37 54 Q40 57 43 54', 'none', C.ink, 1.1), cup(56, 70), fig(100, C.navy, 'laugh'), sb(100, 1, -1, 26, 22, (x, y) => all(houseIcon(x, y + 1, 1.5, C.navy), hrt(x, y - 1, 0.32)), 0, -4)),
  // värdinnepresent: at the door the guest hands flowers to the host.
  'artig.värdinnepresent': all(ground, door(96, 112, 30, 80, true), fig(90, C.purple, 'laugh', { hairStyle: 'long' }), fig(34, C.green, 'smile'), reach(34, 1, 1, 60, 60), bouquet(62, 50, 1.3), reach(90, 1, -1, 70, 64)),
  // sju sorters kakor: a cake tray with seven different biscuits, coffee cups beside it.
  'artig.sju-sorters-kakor': all(rect(4, 86, 112, 26, '#f1e4cc', 0, null), line('M4 86 L116 86', C.ink, 1.4), tray(60, 62, 2), cup(16, 84), cup(104, 84)),
  // dröja sig kvar: late at night (clock) the host yawns and washes up; one guest still sits on with his cup.
  'artig.dröja-sig-kvar': all(rect(4, 4, 112, 34, '#2f3550', 2, null), star(20, 14, 2.4, C.yellow), star(40, 24, 2, C.yellow), clock(98, 20, 10, 30, 0), table(84, 4, 60), fig(30, C.green, 'smile', { h: 0.84 }), cup(46, 78), rect(70, 70, 46, 42, C.grey2, 1, C.ink, 1.4), fig(92, C.orange, 'sleepy', { hairStyle: 'long', h: 0.92 }), T(108, 48, 'z', 9, C.navy)),
  // bryta upp: the guests get up and put on their coats at the door, waving goodbye; the clock shows late.
  'artig.bryta-upp': all(ground, clock(18, 18, 10, 0, 0), door(102, 112, 24, 76, true), fig(48, C.green, 'smile'), jacketI(48, 66, 1.1, C.navy), fig(78, C.orange, 'smile', { hairStyle: 'long' }), reach(78, 1, 1, 96, 26), waveM(96, 26), arrow(60, 104, 86, 104, HL, 2)),

  // ── Sociala missförstånd ─────────────────────────────────────────
  // kulturkrock: one bows, the other comes in with open arms for a hug – a crash star where they meet.
  'artig.kulturkrock': all(ground, bowing(34, C.orange, 14, { hairStyle: 'long' }), flagJPs(18, 14), fig(90, C.green, 'laugh'), reach(90, 1, -1, 66, 40), reach(90, 1, 1, 112, 40), flagSEs(104, 14), star(60, 36, 8, C.yellow), path('M50 24 l-4 -4 M60 22 l0 -6 M70 24 l4 -4', 'none', HL, 1.6)),
  // indirekt: her message goes to him by a long winding path; the straight way (grey) is not taken.
  'artig.indirekt': all(ground, fig(18, C.orange, 'smile', { hairStyle: 'long' }), fig(102, C.green, 'calm'), line('M32 44 L88 44', C.grey2, 2, '4 4'), path('M32 30 C40 4 50 70 60 30 C68 0 78 60 88 30', 'none', HL, 2.2), arrow(84, 36, 89, 28, HL, 2.2), q(102, 6, 11, C.navy)),
  // frispråkig: she says it straight out – a bold bubble with an exclamation and a straight arrow; the others jump.
  'artig.frispråkig': all(ground, fig(26, C.orange, 'calm', { hairStyle: 'long' }), sb(26, 1, 1, 22, 20, (x, y) => ex(x, y, 15)), arrow(38, 50, 80, 50, HL, 3), fig(84, C.green, 'shock', { h: 0.9 }), fig(104, C.navy, 'shock', { h: 0.84 }), path('M78 18 l-3 -4 M90 18 l3 -4', 'none', HL, 1.4)),
  // oavsiktlig: his elbow knocks a glass over – he did not mean it: wide eyes, both hands up.
  'artig.oavsiktlig': all(table(84), fig(34, C.green, 'shock'), reach(34, 1, -1, 16, 40), reach(34, 1, 1, 52, 74), g('rotate(80 64 80)', glassW(64, 80, 1.2)), path('M66 84 C76 84 86 86 92 84', 'none', 'rgba(220,60,80,0.7)', 3), fig(96, C.orange, 'shock', { hairStyle: 'long', h: 0.84 }), ex(14, 26, 12)),
  // klavertramp: he asks a woman when the baby comes (bubble: child?) – she is not pregnant and is offended; he goes pale.
  'artig.klavertramp': all(ground, fig(28, C.green, 'shock'), sweat(28), sb(28, 1, 1, 26, 20, (x, y) => all(childIcon(x - 5, y, 1.2), q(x + 7, y, 11))), fig(92, C.purple, 'angry', { hairStyle: 'long' }), cross(110, 18, 0.8)),
  // fadäs: everybody is dressed up with ties and long dresses – one guest came in jeans and T-shirt; the others stare.
  'artig.fadäs': all(ground, fig(18, C.black, 'shock', { h: 0.92 }), bowOn(18, 0.92), fig(42, C.purple, 'shock', { hairStyle: 'long', h: 0.9, bottom: C.purple }), fig(66, C.black, 'shock', { h: 0.94 }), tieOn(66, 0.94), fig(98, C.yellow, 'blush', { bottom: C.denim }), sweat(98), path('M30 30 L84 30', 'none', HL, 1, ), arrow(78, 30, 86, 30, HL, 1.6)),
  // genant: she forgot his name – red face behind her hand, a name tag with a question mark.
  'artig.genant': all(ground, fig(92, C.green, 'smile'), sb(92, 1, -1, 24, 18, (x, y) => face(x, y, 5.6)), fig(30, C.orange, 'blush', { hairStyle: 'long' }), redFace(30), reach(30, 1, 1, 34, 26), tb(30, 1, 1, 30, 20, (x, y) => all(nameTag(x - 4, y, 0.7), q(x + 10, y, 10, HL)), 4, 30)),
  // tappa ansiktet: in front of the group his proud mask falls to the floor and cracks; he hangs his head.
  'artig.tappa-ansiktet': all(ground, fig(40, C.navy, 'frown'), tieOn(40), mask(66, 98, 0.9), path('M62 88 L66 96 L64 104', 'none', C.ink, 1.2), arrow(52, 40, 62, 80, HL, 2), ...[84, 97, 110].map((x, i) => all(circle(x, 70, 5, C.skin, C.ink, 1), path(`M${x - 6} 82 C${x - 6} 74 ${x + 6} 74 ${x + 6} 82 Z`, [C.green, C.orange, C.sky][i]!, C.ink, 1))), ex(97, 54, 11)),
  // rädda situationen: a sweating man in an awkward moment – a third person steps in with a joke, everyone laughs (a lifebuoy).
  'artig.rädda-situationen': all(ground, fig(24, C.green, 'frown', { h: 0.9 }), sweat(24, 0.9), fig(56, C.purple, 'laugh', { hairStyle: 'long', h: 0.9 }), fig(94, C.orange, 'laugh', { hairStyle: 'long' }), sb(94, 1, -1, 22, 18, (x, y) => face(x, y, 6, 'grin'), 0, -4), ring(30, 16, 10), path('M44 16 C56 6 66 8 72 14', 'none', HL, 1.6)),
  // skratta bort: coffee spilled on her shirt – she laughs it off with a wave of the hand.
  'artig.skratta-bort': all(ground, fig(40, C.white, 'laugh', { hairStyle: 'long' }), path('M36 52 C40 50 44 56 40 60 C36 62 32 56 36 52 Z', '#8a5a2a', null), cup(60, 86), reach(40, 1, 1, 62, 30), waveM(62, 30), path('M22 24 l-4 -3 M22 32 l-5 0 M24 40 l-4 3', 'none', HL, 1.4), fig(96, C.green, 'laugh', { h: 0.92 })),
  // släta över: two hands smooth out a crumpled paper with a big red cross, so that the mistake looks small.
  'artig.släta-över': all(rect(18, 30, 84, 60, C.white, 2, C.ink, 1.8), path('M18 50 L40 46 L54 58 L74 44 L102 52 M30 30 L36 90 M84 30 L76 90', 'none', C.grey2, 1.2), cross(60, 60, 1.4, 'rgba(214,69,69,0.45)'), ellipse(30, 66, 12, 8, C.skin, C.ink, 1.4), ellipse(90, 66, 12, 8, C.skin, C.ink, 1.4), arm(4, 96, 22, 70), arm(116, 96, 98, 70), arrow(40, 76, 22, 76, HL, 1.6), arrow(80, 76, 98, 76, HL, 1.6)),
  // ingen skada skedd: he sat on her chair by mistake and jumps up – she smiles and lifts a calm hand: it's fine (check).
  'artig.ingen-skada-skedd': all(ground, rect(40, 80, 22, 6, C.brown, 1, C.ink, 1.2), line('M42 86 L42 112 M60 86 L60 112 M60 80 L60 54', C.brown, 3), rect(56, 54, 8, 16, C.brown, 1, C.ink, 1), fig(20, C.green, 'shock', { h: 0.88 }), path('M36 66 l5 -4 M36 74 l6 0', 'none', HL, 1.4), fig(92, C.orange, 'smile', { hairStyle: 'long' }), reach(92, 1, -1, 74, 56), palm(74, 54, 0.8, false), sb(92, 1, -1, 22, 18, (x, y) => check(x, y, 1.2), 0, -8)),
};
