/**
 * Föräldraskap & barn (0.29, R02-A04-T04): pregnancy and birth, baby care, small children's
 * development, upbringing, preschool, parental leave and sharing the work at home. People are
 * drawn with their own arms (so a pose never shows a third arm), pregnant women in profile, and
 * abstract words as small symbolic scenes with a grey reference where it helps.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { HL, bubble, cloud, cup, heart, padlock, shield, sun, thought } from './people';
import { coin, drop, greyed, plate, sepia, table } from './blindFix';
import { childIcon, wheatIcon } from './labelIcons';

type Pt = [number, number];
type Mood = 'smile' | 'frown' | 'angry' | 'sleepy' | 'shock' | 'laugh' | 'calm' | 'cry' | 'strain' | 'neutral' | 'tired' | 'shout';
type Fig = {
  x?: number; h?: number; y?: number; top?: string; bottom?: string; hair?: string; long?: boolean; grey?: boolean; mood?: Mood;
  l?: Pt[]; r?: Pt[]; belly?: number; skirt?: string; apron?: string; legs?: 'stand' | 'sit' | 'kneel'; bare?: boolean; cap?: string; mask?: string;
};

const ground = line('M4 112 L116 112', C.grey2, 2);
const RED = '#e8302c';
const PINK = '#f6c9d4';
const MILK = '#fbfbf8';
const WATER = '#bfe3f5';

/** Face on a head centred at (0, -56), radius 10 (figure coordinates). */
function face(m: Mood, sk: string): Svg {
  const ink = C.ink;
  const eyes = m === 'sleepy' || m === 'tired' ? line('M-5.5 -56 L-1.8 -55.6 M1.8 -55.6 L5.5 -56', ink, 1.3)
    : m === 'laugh' || m === 'calm' ? path('M-5.5 -55 Q-3.6 -58 -1.8 -55 M1.8 -55 Q3.6 -58 5.5 -55', 'none', ink, 1.3)
    : m === 'cry' ? path('M-5.5 -57 Q-3.6 -54 -1.8 -57 M1.8 -57 Q3.6 -54 5.5 -57', 'none', ink, 1.3)
    : m === 'strain' ? line('M-5.6 -58 L-2 -56 L-5.6 -54 M5.6 -58 L2 -56 L5.6 -54', ink, 1.3)
    : m === 'shock' ? all(circle(-3.4, -56, 1.8, C.white, ink, 0.9), circle(3.4, -56, 1.8, C.white, ink, 0.9), circle(-3.4, -56, 0.8, ink, null), circle(3.4, -56, 0.8, ink, null))
    : all(circle(-3.4, -56, 1.2, ink, null), circle(3.4, -56, 1.2, ink, null));
  const brows = m === 'angry' || m === 'shout' ? line('M-6 -60.5 L-1.6 -58.6 M6 -60.5 L1.6 -58.6', ink, 1.4)
    : m === 'frown' || m === 'cry' || m === 'tired' ? line('M-6 -58.6 L-1.8 -59.8 M6 -58.6 L1.8 -59.8', ink, 1.1) : '';
  const mouth = m === 'frown' || m === 'angry' ? path('M-3 -50 Q0 -52.6 3 -50', 'none', ink, 1.3)
    : m === 'laugh' ? path('M-3.6 -52 Q0 -46 3.6 -52 Z', '#c84a4a', ink, 1)
    : m === 'shout' || m === 'cry' ? ellipse(0, -50.4, 2.6, 2.4, '#c84a4a', ink, 1)
    : m === 'shock' ? ellipse(0, -50.5, 1.6, 2, '#c84a4a', ink, 0.9)
    : m === 'strain' ? all(rect(-3.4, -52, 6.8, 2.8, C.white, 0.6, ink, 0.9), line('M-1 -52 L-1 -49.2 M1.2 -52 L1.2 -49.2', ink, 0.6))
    : m === 'neutral' || m === 'tired' || m === 'sleepy' ? line('M-2.6 -50.6 L2.6 -50.6', ink, 1.2)
    : path('M-3 -51.5 Q0 -48.6 3 -51.5', 'none', ink, 1.3);
  const extra = m === 'cry' ? all(drop(-6, -51, 0.5, '#8cc7e8'), drop(6, -51, 0.5, '#8cc7e8'))
    : m === 'strain' ? all(ellipse(-6, -52, 2.2, 1.3, '#f08a8a', null), ellipse(6, -52, 2.2, 1.3, '#f08a8a', null))
    : m === 'tired' ? path('M-5.4 -54 Q-3.6 -52.6 -1.8 -54 M1.8 -54 Q3.6 -52.6 5.4 -54', 'none', '#b08a9a', 0.9) : '';
  return all(circle(0, -55, 7.4, sk, null), eyes, brows, mouth, extra);
}

/** One arm as a sleeve from the shoulder through the given points, with a hand at the end. */
function armOf(pts: Pt[], col: string, sk: string, bare = false): Svg {
  const d = 'M' + pts.map(([a, b]) => `${a} ${b}`).join(' L');
  const [hx, hy] = pts[pts.length - 1]!;
  return all(line(d, C.ink, 8.4), line(d, bare ? sk : col, 5.8), circle(hx, hy, 3.4, sk, C.ink, 1.4));
}

/** Standing (or sitting/kneeling) person, front view, with its own arms and a mood face. */
function fig(o: Fig): Svg {
  const h = o.h ?? 1, s = 0.84 * h, grey = !!o.grey;
  const sk = grey ? C.grey2 : C.skin, top = grey ? C.grey : (o.top ?? C.sky), bot = grey ? C.grey : (o.bottom ?? C.navy), hair = grey ? C.grey : (o.hair ?? C.hair);
  const legs = o.legs ?? 'stand', base = legs === 'sit' ? 35 : legs === 'kneel' ? 27 : 49;
  const out: Svg[] = [];
  if (o.long) out.push(path('M-11 -56 C-14 -40 -8 -38 0 -40 C8 -38 14 -40 11 -56 C10 -70 -10 -70 -11 -56 Z', hair, C.ink, 1.8));
  if (legs === 'stand') {
    if (o.skirt) out.push(path('M-9 20 L-9 46 L-3 46 L-3 20 Z M3 20 L3 46 L9 46 L9 20 Z', sk, C.ink, 1.6), path('M-13 -4 L-19 30 L19 30 L13 -4 Z', grey ? C.grey : o.skirt, C.ink, 2));
    else out.push(path('M-12 0 L-11 46 L-3 46 L0 8 L3 46 L11 46 L12 0 Z', bot, C.ink, 2));
    out.push(path('M-11 44 L-3 44 L-2 49 L-13 49 Z M3 44 L11 44 L13 49 L2 49 Z', grey ? C.grey : C.black, C.ink, 1.6));
  } else if (legs === 'sit') {
    out.push(path('M-13 -2 L13 -2 L13 9 L-13 9 Z', bot, C.ink, 2), path('M-12 8 L-12 31 L-3 31 L-3 8 Z M3 8 L3 31 L12 31 L12 8 Z', bot, C.ink, 2));
    out.push(path('M-13 30 L-2 30 L-2 35 L-14 35 Z M2 30 L13 30 L14 35 L2 35 Z', grey ? C.grey : C.black, C.ink, 1.6));
  } else {
    out.push(path('M-12 0 L-12 26 L-2 26 L0 10 L2 26 L12 26 L12 0 Z', bot, C.ink, 2));
  }
  const L = o.l ?? [[-13, -38], [-19, -20], [-18, -3]], R = o.r ?? [[13, -38], [19, -20], [18, -3]];
  const inside = (p: Pt[]) => { const [hx, hy] = p[p.length - 1]!; return Math.abs(hx) < 12 && hy > -40; };
  const arms = [L, R];
  for (const a of arms) if (!inside(a)) out.push(armOf(a, top, sk, o.bare));
  const bx = 12 + (o.belly ?? 0) * 9;
  out.push(path(`M-14 -42 L14 -42 C15 -30 ${bx} -16 12 2 L-12 2 C${-bx} -16 -15 -30 -14 -42 Z`, o.bare ? sk : top, C.ink, 2.2));
  if (o.apron) out.push(path('M-9 -32 L9 -32 L11 4 L-11 4 Z', grey ? C.grey2 : o.apron, C.ink, 1.6), line('M-9 -32 L-13 -42 M9 -32 L13 -42', C.ink, 1));
  for (const a of arms) if (inside(a)) out.push(armOf(a, top, sk, o.bare));
  out.push(rect(-3.5, -48, 7, 7, sk, 2, C.ink, 1.6), circle(0, -56, 10, sk, C.ink, 2));
  if (o.long) out.push(circle(0, -54, 8.6, sk, null));
  if (o.cap) out.push(path('M-10.5 -57 C-11 -70 11 -70 10.5 -57 Z', o.cap, C.ink, 1.6));
  else out.push(path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', hair, C.ink, 1.8));
  out.push(face(o.mood ?? 'smile', sk));
  if (o.mask) out.push(path('M-7 -54 L7 -54 L6 -47 C2 -45 -2 -45 -6 -47 Z', o.mask, C.ink, 1.2));
  return g(`translate(${o.x ?? 60} ${((o.y ?? 112) - base * s).toFixed(1)}) scale(${s.toFixed(3)})`, ...out);
}

/** Pregnant woman in profile, facing right; feet on y. b = belly size 0–1. */
function preg(x: number, o: { b?: number; s?: number; y?: number; mood?: Mood; top?: string; grey?: boolean; hand?: boolean; flip?: boolean } = {}): Svg {
  const b = o.b ?? 1, bx = 8 + 18 * b, grey = !!o.grey;
  const sk = grey ? C.grey2 : C.skin, top = grey ? C.grey : (o.top ?? '#c99ae0'), hair = grey ? C.grey : C.hair, bot = grey ? C.grey : C.navy;
  const m = o.mood ?? 'smile', ink = C.ink;
  const eye = m === 'strain' ? line('M5.5 -100 L8.5 -98 L5.5 -96', ink, 1.2) : m === 'calm' || m === 'laugh' ? path('M5.6 -98 Q7.2 -100 8.8 -98', 'none', ink, 1.2) : m === 'shock' ? all(circle(7.2, -98, 1.8, C.white, ink, 0.8), circle(7.6, -98, 0.8, ink, null)) : circle(7.2, -98, 1.2, ink, null);
  const mouth = m === 'strain' ? line('M7.5 -92.5 L11 -92.5', ink, 1.4) : m === 'shock' ? ellipse(9.6, -92.6, 1.4, 1.8, '#c84a4a', ink, 0.8) : m === 'frown' ? path('M7.6 -92 Q9.4 -93.6 11 -92', 'none', ink, 1.2) : path('M7.6 -93.4 Q9.4 -91.6 11 -93.4', 'none', ink, 1.2);
  const hand: Pt = [12 + bx * 0.62, -60];
  const out: Svg[] = [
    path('M-9 -98 C-16 -84 -12 -72 -3 -72 L2 -86 Z', hair, ink, 1.6),
    path('M-7 -46 L-8 0 L0 0 L1 -26 L3 0 L11 0 L9 -46 Z', bot, ink, 2),
    path('M-9 -2 L1 -2 L4 1.5 L-9 1.5 Z M2 -2 L12 -2 L15 1.5 L2 1.5 Z', grey ? C.grey : C.black, ink, 1.4),
    path(`M-8 -84 L8 -84 C10 -78 9 -74 10 -72 C${(10 + bx * 1.3).toFixed(1)} -70 ${(10 + bx * 1.3).toFixed(1)} -46 8 -44 L-8 -44 C-11 -60 -10 -72 -8 -84 Z`, top, ink, 2.2),
    rect(-2, -91, 7, 9, sk, 2, ink, 1.4), circle(2, -98, 9.5, sk, ink, 2),
    path('M11.2 -99 L13.6 -96 L11.2 -95', sk, ink, 1.2),
    path('M-8 -99 C-8 -112 13 -112 12 -100 C8 -104 -2 -105 -8 -99 Z', hair, ink, 1.6),
    eye, mouth, m === 'strain' ? ellipse(6, -93.6, 2.2, 1.3, '#f08a8a', null) : '',
    o.hand === false ? armOf([[1, -80], [-2, -62], [0, -48]], top, sk) : armOf([[1, -80], [2, -64], hand], top, sk),
  ];
  const t = `translate(${x} ${o.y ?? 112}) scale(${o.flip ? -(o.s ?? 0.9) : (o.s ?? 0.9)} ${o.s ?? 0.9})`;
  return g(t, ...out);
}

/** Baby lying on its back, head to the left. */
function babyL(x: number, y: number, s = 1, o: { mood?: 'smile' | 'cry' | 'sleep'; col?: string; naked?: boolean; red?: boolean } = {}): Svg {
  const col = o.naked ? C.skin : (o.col ?? '#f6e0a0'), sk = o.red ? '#f2a08a' : C.skin, m = o.mood ?? 'smile';
  const eyes = m === 'sleep' ? path('M-15 -5 Q-13.6 -3.6 -12.2 -5 M-9.8 -5 Q-8.4 -3.6 -7 -5', 'none', C.ink, 1) : m === 'cry' ? path('M-15 -4 Q-13.6 -6 -12.2 -4 M-9.8 -4 Q-8.4 -6 -7 -4', 'none', C.ink, 1.1) : all(circle(-13.6, -4.6, 0.9, C.ink, null), circle(-8.4, -4.6, 0.9, C.ink, null));
  const mouth = m === 'cry' ? ellipse(-11, 0.4, 2.2, 2, '#c84a4a', C.ink, 0.8) : path('M-12.6 -0.6 Q-11 1 -9.4 -0.6', 'none', C.ink, 1);
  const limb = (d: string, c: string) => all(line(d, C.ink, 7.8), line(d, c, 5.4));
  return g(`translate(${x} ${y}) scale(${s})`,
    limb('M12 -2 L17 -9 L21 -8', col), limb('M14 2 L20 -3 L24 -1', col), circle(21.6, -8, 2.4, C.skin, C.ink, 1), circle(24.6, -1, 2.4, C.skin, C.ink, 1),
    limb('M1 -4 L3 -11', col), circle(3.4, -12, 2.2, C.skin, C.ink, 1),
    ellipse(4, 0, 12, 7, col, C.ink, 1.4), o.naked ? '' : line('M-2 -5 L-2 6', C.ink, 0.6),
    circle(-11, -3, 7.4, sk, C.ink, 1.4), path('M-15 -9 C-13 -12 -10 -12 -8 -10', 'none', C.hair, 1.6), eyes, mouth);
}
/** Swaddled baby held upright (head on top). */
const bundle = (x: number, y: number, s = 1, col: string = PINK, awake = false): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 -5 C-13 7 -7 16 0 16 C7 16 13 7 8 -5 Z', col, C.ink, 1.4), path('M-8 -5 C-4 0 4 0 8 -5', 'none', C.ink, 1),
  circle(0, -8, 6.2, C.skin, C.ink, 1.4), path('M-3 -13 C-1 -15 1 -15 3 -13', 'none', C.hair, 1.4),
  awake ? all(circle(-2.2, -8.4, 0.8, C.ink, null), circle(2.2, -8.4, 0.8, C.ink, null)) : path('M-3.4 -8.4 Q-2.2 -7.2 -1 -8.4 M1 -8.4 Q2.2 -7.2 3.4 -8.4', 'none', C.ink, 0.9),
  path('M-1.4 -5.2 Q0 -4.2 1.4 -5.2', 'none', C.ink, 0.8));

// ── objects ────────────────────────────────────────────────────────────────
const bottle = (x: number, y: number, s = 1, fill: string = MILK): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M-3 -30 C-3 -36 3 -36 3 -30 L5 -24 L-5 -24 Z', '#f2b46a', C.ink, 1.4), rect(-8, -25, 16, 6, C.sky, 2, C.ink, 1.4),
  rect(-9, -19, 18, 34, 'rgba(220,240,252,0.7)', 5, C.ink, 1.6), rect(-8.2, -8, 16.4, 22.2, fill, 4, null), line('M5 -14 L8 -14 M5 -8 L8 -8 M5 -2 L8 -2 M5 4 L8 4', C.grey, 1));
const pacifier = (x: number, y: number, s = 1, col: string = '#5aa7e8'): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M8 0 C14 -2 22 -2 24 0 C22 2 14 2 8 0 Z', '#f2d49a', C.ink, 1.2), ellipse(10, 0, 5, 3, '#f2d49a', null),
  path('M6 -14 C-2 -14 -4 -6 -4 0 C-4 6 -2 14 6 14 C10 14 10 6 8 0 C10 -6 10 -14 6 -14 Z', col, C.ink, 1.6),
  circle(-14, 0, 10, 'none', C.ink, 4.4), circle(-14, 0, 10, 'none', col, 2.6), circle(2, 0, 2, C.white, C.ink, 1));
const diaper = (x: number, y: number, s = 1, dirty = false): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M-14 -8 L14 -8 L12 -2 C6 0 4 6 3 10 L-3 10 C-4 6 -6 0 -12 -2 Z', dirty ? '#e8e0c0' : C.white, C.ink, 1.4),
  rect(-14, -9, 6, 3, C.yellow, 1, C.ink, 0.8), rect(8, -9, 6, 3, C.yellow, 1, C.ink, 0.8),
  dirty ? line('M-6 -14 c-2 -3 2 -5 0 -8 M0 -15 c-2 -3 2 -5 0 -8 M6 -14 c-2 -3 2 -5 0 -8', '#7aa04a', 1.4) : path('M-6 0 Q0 3 6 0', 'none', '#8cc7e8', 1));
/** Calendar page, centred at (x, y). */
const page = (x: number, y: number, w: number, h: number, inner: Svg = '', top: string = RED): Svg => all(
  rect(x - w / 2, y - h / 2, w, h, C.white, 3, C.ink, 1.6), rect(x - w / 2, y - h / 2, w, Math.min(8, h / 4), top, 3, C.ink, 1.6),
  line(`M${x - w / 4} ${y - h / 2 - 3} L${x - w / 4} ${y - h / 2 + 3} M${x + w / 4} ${y - h / 2 - 3} L${x + w / 4} ${y - h / 2 + 3}`, C.ink, 1.6), inner);
const clock = (x: number, y: number, r: number, hh: number, mm = 0): Svg => {
  const ah = ((hh % 12) + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = mm / 60 * Math.PI * 2 - Math.PI / 2;
  return all(circle(x, y, r, C.white, C.ink, 1.6), line(`M${x} ${y} L${(x + Math.cos(ah) * r * 0.5).toFixed(1)} ${(y + Math.sin(ah) * r * 0.5).toFixed(1)} M${x} ${y} L${(x + Math.cos(am) * r * 0.8).toFixed(1)} ${(y + Math.sin(am) * r * 0.8).toFixed(1)}`, C.ink, 1.4));
};
const moon = (x: number, y: number, r = 6): Svg => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.5} A${r * 0.8} ${r * 0.8} 0 0 1 ${x} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const briefcase = (x: number, y: number, s = 1, col: string = C.brown): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 13, col, 2, C.ink, 1.4), path('M-3 -6 L-3 -9 L3 -9 L3 -6', 'none', C.ink, 1.4), line('M-9 -1 L9 -1', C.ink, 0.8));
const stroller = (x: number, y: number, s = 1, col: string = '#4f7fc0'): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M-18 -10 C-18 -26 2 -28 4 -14 L4 -10 Z', col, C.ink, 1.6), path('M-20 -10 L14 -10 C14 0 -20 0 -20 -10 Z', col, C.ink, 1.6),
  line('M12 -8 L20 -26 L26 -26', C.ink, 2), circle(-14, 4, 4.4, C.dark, C.ink, 1.4), circle(8, 4, 4.4, C.dark, C.ink, 1.4));
const xMark = (x: number, y: number, r = 8, col: string = RED): Svg => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3.2);
const check = (x: number, y: number, s = 1, col: string = C.green): Svg => line(`M${x - 7 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 8 * s} ${y - 6 * s}`, col, 3.4 * s);
const noSign = (x: number, y: number, r: number): Svg => all(circle(x, y, r, 'none', RED, 4), line(`M${x - r * 0.7} ${y - r * 0.7} L${x + r * 0.7} ${y + r * 0.7}`, RED, 4));
const flagSe = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6.5, 20, 13, '#3a6ab0', 0.6, C.ink, 1), rect(-5, -6.5, 3, 13, '#f2c14e', 0, null), rect(-10, -1.5, 20, 3, '#f2c14e', 0, null));
const flagJp = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6.5, 20, 13, C.white, 0.6, C.ink, 1), circle(0, 0, 3.6, '#d83a3a', null));
const candy = (x: number, y: number, s = 1, col: string = '#e85a7a'): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -4 L-5 0 L-10 4 Z M10 -4 L5 0 L10 4 Z', col, C.ink, 1), ellipse(0, 0, 6, 4.4, col, C.ink, 1.2), line('M-2 -3 L2 3', C.white, 1));
const iceCream = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-5 0 L5 0 L0 14 Z', '#d4a373', C.ink, 1.2), circle(0, -3, 5.4, '#f6c9d4', C.ink, 1.2));
const preschool = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`,
  rect(-26, -26, 52, 26, '#f6d48a', 1, C.ink, 1.8), path('M-30 -26 L0 -44 L30 -26 Z', RED, C.ink, 1.8), rect(-6, -16, 12, 16, '#4f9d69', 1, C.ink, 1.4),
  rect(-21, -20, 10, 8, WATER, 1, C.ink, 1.2), rect(11, -20, 10, 8, WATER, 1, C.ink, 1.2), childIcon(0, -33, 0.9));
const office = (x: number, y: number, s = 1, col: string = '#b8c4d4'): Svg => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -40, 28, 40, col, 1, C.ink, 1.6),
  ...[-30, -20, -10].flatMap((yy) => [rect(-9, yy, 6, 6, WATER, 0.5, C.ink, 0.8), rect(3, yy, 6, 6, WATER, 0.5, C.ink, 0.8)]));
const sofa = (x: number, y: number, w = 60, col: string = '#7a9ad0'): Svg => all(rect(x - w / 2, y - 22, w, 14, col, 5, C.ink, 1.8), rect(x - w / 2 - 4, y - 12, w + 8, 12, col, 4, C.ink, 1.8), line(`M${x - w / 2} ${y} L${x - w / 2} ${y + 4} M${x + w / 2} ${y} L${x + w / 2} ${y + 4}`, C.ink, 2.4));
const bin = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -16 L9 -16 L7 0 L-7 0 Z', C.grey, C.ink, 1.6), rect(-11, -20, 22, 4, C.dark, 1, C.ink, 1.4));
const bag = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -4 C-12 6 -8 12 0 12 C8 12 12 6 8 -4 Z', '#3d3f4a', C.ink, 1.4), path('M-4 -4 L-2 -10 L2 -10 L4 -4 Z', '#3d3f4a', C.ink, 1.2));
const piggy = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 16, 12, '#f2a0b8', C.ink, 1.6), circle(15, -2, 5, '#f2a0b8', C.ink, 1.4), circle(16, -2, 1, C.ink, null),
  path('M-6 -11 L-2 -16 L1 -11 Z', '#f2a0b8', C.ink, 1.2), rect(-10, 10, 5, 6, '#f2a0b8', 1, C.ink, 1.2), rect(5, 10, 5, 6, '#f2a0b8', 1, C.ink, 1.2), rect(-5, -12.5, 10, 2.4, C.dark, 1, null), circle(8, -4, 1.1, C.ink, null));
const puzzle = (x: number, y: number, s: number, col: string, inner: Svg): Svg => g(`translate(${x} ${y}) scale(${s})`,
  path('M-14 -14 L-4 -14 C-4 -20 4 -20 4 -14 L14 -14 L14 -4 C20 -4 20 4 14 4 L14 14 L-14 14 Z', col, C.ink, 1.6), inner);
const pot = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -6 L10 -6 L9 6 C9 9 -9 9 -9 6 Z', C.silver, C.ink, 1.4), line('M-14 -4 L-10 -4 M10 -4 L14 -4', C.ink, 2), line('M-4 -10 c-2 -2 2 -4 0 -6 M4 -10 c-2 -2 2 -4 0 -6', C.grey2, 1.2));
const broom = (x: number, y: number, s = 1, rot = 0): Svg => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 -24 L0 4', C.brown, 2.6), path('M-7 4 L7 4 L9 14 L-9 14 Z', '#e8c860', C.ink, 1.2));
const book = (x: number, y: number, s = 1, col: string = C.red): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C-5 -9 -11 -9 -14 -7 L-14 7 C-11 5 -5 5 0 8 C5 5 11 5 14 7 L14 -7 C11 -9 5 -9 0 -6 Z', C.white, C.ink, 1.4), line('M0 -6 L0 8', C.ink, 1), path('M-14 7 C-11 5 -5 5 0 8 C5 5 11 5 14 7 L14 9 L-14 9 Z', col, C.ink, 1));
const ball = (x: number, y: number, r = 5): Svg => all(circle(x, y, r, C.white, C.ink, 1.4), path(`M${x - r * 0.4} ${y - r * 0.3} L${x + r * 0.4} ${y - r * 0.3} L${x + r * 0.5} ${y + r * 0.3} L${x} ${y + r * 0.6} L${x - r * 0.5} ${y + r * 0.3} Z`, C.ink, null));
const shirt = (x: number, y: number, s = 1, col: string = C.yellow): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -8 L-12 -4 L-9 1 L-6 -1 L-6 8 L6 8 L6 -1 L9 1 L12 -4 L6 -8 C3 -5 -3 -5 -6 -8 Z', col, C.ink, 1.2));
const pants = (x: number, y: number, s = 1, col: string = C.denim): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-7 -8 L7 -8 L8 9 L2 9 L0 -2 L-2 9 L-8 9 Z', col, C.ink, 1.2));
const sock = (x: number, y: number, s = 1, col: string = C.red): Svg => g(`translate(${x} ${y}) scale(${s})`, path('M-3 -8 L3 -8 L3 2 L8 4 C10 6 9 9 6 9 L-2 7 C-4 6 -3 4 -3 2 Z', col, C.ink, 1.1));
const mom = (o: Fig): Svg => fig({ long: true, top: C.orange, ...o });
const dad = (o: Fig): Svg => fig({ top: C.green, ...o });
const kid = (o: Fig): Svg => fig({ h: 0.5, top: C.yellow, bottom: C.denim, ...o });
const tot = (o: Fig): Svg => fig({ h: 0.42, top: '#f2a0b8', bottom: '#f2a0b8', ...o });
const mini = (x: number, y: number, col: string, long = false, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-6.4 -1 C-7 6 7 6 6.4 -1 Z', C.hair, null) : '', circle(0, -2, 5.6, C.skin, C.ink, 1.2), path('M-5.6 -3.4 C-5.6 -10 5.6 -10 5.6 -3.4 C3 -6.4 -3 -6.4 -5.6 -3.4 Z', C.hair, null), path('M-8 12 C-8 4 8 4 8 12 Z', col, C.ink, 1.2));
const bed = (x1: number, x2: number, y: number, col: string = '#c8a070'): Svg => all(rect(x1, y, x2 - x1, 10, col, 2, C.ink, 1.8), line(`M${x1 + 4} ${y + 10} L${x1 + 4} 112 M${x2 - 4} ${y + 10} L${x2 - 4} 112`, C.brown, 3));
const wave = (x: number, y: number, w: number, amp: number, col: string = HL): Svg => line(`M${x} ${y} C${x + w * 0.1} ${y} ${x + w * 0.12} ${y - amp} ${x + w * 0.2} ${y - amp} C${x + w * 0.28} ${y - amp} ${x + w * 0.3} ${y} ${x + w * 0.4} ${y} C${x + w * 0.5} ${y} ${x + w * 0.52} ${y - amp} ${x + w * 0.6} ${y - amp} C${x + w * 0.68} ${y - amp} ${x + w * 0.7} ${y} ${x + w * 0.8} ${y} C${x + w * 0.88} ${y} ${x + w * 0.9} ${y - amp} ${x + w} ${y - amp}`, col, 2.6);
const zz = (x: number, y: number): Svg => line(`M${x} ${y} l5 0 l-5 5 l5 0 M${x + 7} ${y - 7} l4 0 l-4 4 l4 0`, '#5a7ac0', 1.6);
const pain = (x: number, y: number, s = 1): Svg => g(`translate(${x} ${y}) scale(${s})`, line('M-12 -10 l4 4 M12 -10 l-4 4 M-14 2 l5 0 M14 2 l-5 0 M-10 12 l4 -3 M10 12 l-4 -3', RED, 2));
const steam = (x: number, y: number): Svg => line(`M${x - 3} ${y} c-2 -3 2 -5 0 -8 M${x + 3} ${y} c-2 -3 2 -5 0 -8`, C.grey2, 1.3);

export const PARENTING_MOTIFS: Record<string, Svg> = {
  // ── Graviditet och födsel ──────────────────────────────────────────────
  'barn.graviditet': all(ground, preg(22, { b: 0.15, s: 0.7 }), preg(58, { b: 0.55, s: 0.7 }), preg(94, { b: 1, s: 0.7 }), arrow(10, 14, 104, 14, HL, 2.4), ...[22, 58, 94].map((x) => circle(x, 14, 3, C.white, C.ink, 1.2))),
  'barn.vänta-barn': all(ground, preg(46, { b: 0.9, s: 0.92 }), dad({ x: 92, top: C.green, r: [[13, -38], [19, -20], [18, -3]], l: [[-13, -38], [-26, -28], [-40, -26]] }), thought(70, 18, 40, all(bundle(64, 20, 0.8), heart(80, 16, 0.6)))),
  'barn.graviditetstest': all(path('M2 122 L16 70 L42 72 L30 122 Z', C.skin, C.ink, 2), rect(30, 52, 80, 20, C.white, 9, C.ink, 2.2), path('M92 52 L101 52 C106 52 110 56 110 62 C110 68 106 72 101 72 L92 72 Z', '#a07ad8', C.ink, 2.2), rect(60, 56, 24, 12, '#eef2f6', 2, C.ink, 1.4), line('M68 58 L68 66 M76 58 L76 66', '#e0457a', 2.6), rect(14, 46, 32, 32, C.skin, 12, C.ink, 2), line('M18 56 L40 56 M18 63 L40 63 M18 70 L38 70', C.skin2, 1.6), path('M38 48 C46 42 56 46 54 54 L44 57 Z', C.skin, C.ink, 1.8), sparkle(72, 36, 6), sparkle(94, 40, 4), sparkle(54, 38, 3.6)),
  'barn.mödravårdscentral': all(ground, rect(52, 46, 62, 66, '#f6eef6', 1, C.ink, 2), path('M48 46 L83 26 L118 46 Z', '#d86a9a', C.ink, 2), rect(74, 84, 18, 28, '#a0673d', 1, C.ink, 1.6), circle(83, 64, 11, C.white, C.ink, 1.8), preg(83, { b: 1, s: 0.17, y: 72, top: '#d86a9a', hand: false }), rect(58, 54, 12, 12, WATER, 1, C.ink, 1.2), rect(98, 54, 12, 12, WATER, 1, C.ink, 1.2), preg(26, { b: 0.95, s: 0.82 })),
  'barn.foster': all(ellipse(60, 62, 48, 46, '#f8d6dc', C.ink, 2.2), ellipse(60, 62, 40, 38, '#fbe6ea', null), ellipse(96, 82, 9, 13, '#d86a7a', C.ink, 1.6),
    path('M58 80 C66 92 78 76 88 84', 'none', C.ink, 4.4), path('M58 80 C66 92 78 76 88 84', 'none', '#f0a8b8', 2.8),
    path('M44 48 C34 62 38 84 54 88 C66 92 76 84 74 72 C72 64 66 66 62 70 C66 60 62 52 56 50 Z', C.skin, C.ink, 2),
    circle(52, 40, 15, C.skin, C.ink, 2), path('M47 41 Q50 43 53 41', 'none', C.ink, 1.2), path('M60 52 C64 50 66 46 64 42', 'none', C.ink, 1.6), circle(64, 42, 3, C.skin, C.ink, 1.2), path('M62 84 C70 86 74 82 72 78', 'none', C.ink, 1.4)),
  'barn.förlossning': all(ground, bed(6, 80, 82), rect(8, 60, 22, 20, C.white, 6, C.ink, 1.6), circle(20, 62, 9, C.skin, C.ink, 1.8), path('M11 62 C9 50 30 48 29 60 C24 54 16 54 11 62 Z', C.hair, C.ink, 1.4), path('M15 63 Q17 65 19 63 M21 63 Q23 65 25 63', 'none', C.ink, 1.1), path('M17 67.6 Q20 69.6 23 67.6', 'none', C.ink, 1.1), path('M28 82 C28 70 50 66 78 72 L80 82 Z', '#a8dcc0', C.ink, 1.6), armOf([[30, 74], [40, 64], [50, 58]], '#c99ae0', C.skin),
    fig({ x: 98, h: 0.95, top: '#7ac0b0', bottom: '#7ac0b0', cap: '#7ac0b0', mood: 'laugh', l: [[-13, -38], [-26, -40], [-38, -46]], r: [[13, -38], [0, -40], [-30, -40]] }), babyL(66, 50, 1.1, { mood: 'cry', naked: true }), line('M52 36 l-4 -5 M62 32 l0 -7 M74 34 l4 -5', HL, 1.8), clock(48, 18, 9, 6), heart(36, 44, 0.5)),
  'barn.värk.2': all(ground, preg(46, { b: 1, s: 0.92, mood: 'strain' }), pain(66, 62, 1), wave(70, 30, 44, 18, RED), line('M70 30 L114 30', C.grey2, 1, '2 2'), clock(92, 92, 9, 3)),
  'barn.vattnet-går': all(preg(50, { b: 1, s: 0.86, mood: 'shock', y: 104 }), ellipse(56, 108, 30, 6, WATER, C.ink, 1.4), drop(52, 96, 1, '#8cc7e8'), drop(58, 100, 0.8, '#8cc7e8'), drop(62, 94, 0.7, '#8cc7e8'), line('M84 30 l6 -4 M86 38 l7 0', HL, 1.8)),
  'barn.krysta': all(ground, bed(4, 84, 84), rect(6, 40, 20, 44, C.white, 6, C.ink, 1.6), fig({ x: 38, y: 98, h: 0.86, long: true, top: '#c99ae0', bottom: '#a8dcc0', legs: 'sit', mood: 'strain', l: [[-13, -38], [-26, -24], [-20, -40]], r: [[13, -38], [26, -24], [20, -40]] }), path('M24 84 C26 74 60 70 84 76 L84 84 Z', '#a8dcc0', C.ink, 1.6), line('M14 22 l-6 -4 M14 32 l-8 0 M60 22 l6 -4 M62 32 l8 0 M38 6 l0 -5', RED, 2.2), fig({ x: 100, h: 0.9, top: '#7ac0b0', bottom: '#7ac0b0', cap: '#7ac0b0', mood: 'laugh', l: [[-13, -38], [-20, -50], [-18, -66]], r: [[13, -38], [20, -50], [18, -66]] })),
  'barn.smärtlindring': all(ground, greyed(preg(26, { b: 1, s: 0.78, mood: 'strain' }), pain(42, 62, 0.8)), arrow(48, 54, 66, 54, HL, 2.6), g('translate(57 40)', rect(-7, -3.5, 14, 7, C.white, 3.5, C.ink, 1.2), rect(0, -3.5, 7, 7, '#e85a7a', 0, null), rect(-7, -3.5, 14, 7, 'none', 3.5, C.ink, 1.2)), preg(84, { b: 1, s: 0.78, mood: 'calm' }), sparkle(108, 40, 5), heart(106, 58, 0.6)),
  'barn.lustgas': all(ground, rect(92, 40, 18, 72, '#5a8ae0', 6, C.ink, 2), rect(96, 30, 10, 12, C.silver, 2, C.ink, 1.6), circle(101, 28, 4, C.dark, C.ink, 1.2), path('M96 36 C80 40 76 60 60 50', 'none', C.ink, 4.4), path('M96 36 C80 40 76 60 60 50', 'none', '#c8d8e8', 2.6),
    fig({ x: 46, long: true, top: '#c99ae0', mood: 'calm', r: [[13, -38], [16, -26], [6, -50]], mask: '#d8e8f0' }), path('M70 26 c4 -4 8 -4 12 0', 'none', '#8cc7e8', 1.6), path('M72 18 c4 -4 8 -4 12 0', 'none', '#8cc7e8', 1.6)),
  'barn.kejsarsnitt': all(ground, rect(6, 76, 108, 10, C.silver, 2, C.ink, 1.8), line('M20 86 L20 112 M100 86 L100 112', C.dark, 3), rect(8, 66, 16, 10, C.white, 4, C.ink, 1.4), circle(18, 64, 7, C.skin, C.ink, 1.6), path('M12 61 C12 54 24 54 24 61 Z', C.hair, null), path('M14 64 Q16 65.4 18 64', 'none', C.ink, 1), path('M24 70 C40 64 70 64 96 70 L96 76 L24 76 Z', '#8ac8b0', C.ink, 1.4),
    path('M30 76 L30 40 L46 40 L46 76 Z', '#5aa88a', C.ink, 1.6), line('M34 44 L34 72 M38 44 L38 72 M42 44 L42 72', '#4a9070', 1), fig({ x: 88, h: 0.9, top: '#5aa88a', bottom: '#5aa88a', cap: '#5aa88a', mask: '#bfe3d5', y: 78, l: [[-13, -38], [-24, -46], [-28, -58]], r: [[13, -38], [0, -48], [-12, -60]] }), babyL(62, 30, 0.95, { mood: 'cry', naked: true }), line('M8 8 L28 8', C.ink, 1.6), path('M10 8 L26 8 L22 16 L14 16 Z', '#f6e08a', C.ink, 1.4)),
  'barn.navelsträng': all(ground, rect(6, 82, 108, 8, '#c8e0f0', 3, C.ink, 1.6), babyL(38, 72, 1.6, { naked: true }), path('M44 76 C54 90 66 66 78 78 C86 86 92 74 102 76', 'none', C.ink, 5.4), path('M44 76 C54 90 66 66 78 78 C86 86 92 74 102 76', 'none', '#e0b0c8', 3.6), rect(70, 72, 4, 10, '#5aa7e8', 1, C.ink, 1),
    g('translate(82 58) rotate(30)', ellipse(-6, -14, 5, 4, 'none', C.ink, 2), ellipse(6, -14, 5, 4, 'none', C.ink, 2), line('M-4 -10 L4 12 M4 -10 L-4 12', C.silver, 3), line('M-4 -10 L4 12 M4 -10 L-4 12', C.ink, 0.8)), circle(78, 79, 9, 'none', HL, 2)),
  'barn.hud-mot-hud': all(ground, bed(6, 114, 84), rect(8, 56, 26, 26, C.white, 6, C.ink, 1.6), path('M12 62 C12 46 34 46 34 60 L34 72 L12 72 Z', C.hair, C.ink, 1.4), circle(23, 62, 9, C.skin, C.ink, 1.8), path('M18 62 Q20 64 22 62 M24 62 Q26 64 28 62', 'none', C.ink, 1.1), path('M20 67 Q23 69 26 67', 'none', C.ink, 1.1),
    path('M30 84 C30 68 44 66 60 68 C70 69 78 72 80 84 Z', C.skin, C.ink, 1.8), babyL(54, 64, 1.15, { naked: true, mood: 'sleep' }), armOf([[34, 78], [46, 74], [60, 68]], C.skin, C.skin, true), path('M62 84 C62 74 74 72 88 74 C102 76 110 78 112 84 Z', '#f6c9d4', C.ink, 1.6), heart(80, 34, 0.9), heart(92, 26, 0.5)),
  // ── Spädbarnets vardag ─────────────────────────────────────────────────
  'barn.spädbarn': all(ellipse(60, 92, 50, 14, '#c8e0f0', C.ink, 1.8), babyL(60, 80, 2.4, { col: '#f6e0a0' }), g('translate(100 60) rotate(30)', circle(0, -8, 6, '#f2a0b8', C.ink, 1.4), line('M0 -2 L0 12', C.ink, 2.4)), line('M36 22 L84 22', C.ink, 1.2), ...[44, 60, 76].map((x, i) => all(line(`M${x} 22 L${x} 30`, C.ink, 1), star(x, 34, 4, [C.yellow, '#f2a0b8', '#8cc7e8'][i]!)))),
  'barn.amning': all(rect(14, 46, 92, 56, '#c99a6a', 10, C.ink, 2), rect(22, 84, 76, 20, '#b88a5a', 6, C.ink, 1.8), fig({ x: 60, long: true, top: '#c99ae0', mood: 'calm', legs: 'sit', y: 104, l: [[-13, -38], [-14, -22], [4, -20]], r: [[13, -38], [14, -24], [-2, -30]] }), g('translate(58 70) rotate(-20)', path('M-12 0 C-12 -8 12 -8 12 0 C12 8 -12 8 -12 0 Z', PINK, C.ink, 1.4), circle(-10, -2, 5.4, C.skin, C.ink, 1.2), path('M-12 -3 Q-10.6 -1.6 -9.2 -3', 'none', C.ink, 0.9)), heart(92, 26, 0.9), drop(84, 40, 1, MILK)),
  'barn.nappflaska': all(bottle(60, 70, 2.2), sparkle(96, 30, 5)),
  'barn.välling': all(rect(0, 0, 120, 52, '#3a4a7a', 0, null), moon(98, 18, 9), star(22, 16, 3), star(46, 28, 2.4), rect(0, 52, 120, 68, '#f6efe2', 0, null), table(92, 6, 114), bottle(38, 76, 1.2, '#e8d0a0'), g('translate(78 76)', rect(-12, -20, 24, 30, '#f2e2b0', 2, C.ink, 1.6), wheatIcon(0, -5, 1.4)), rect(98, 70, 12, 22, C.white, 1, C.ink, 1.4), path('M98 70 L104 64 L110 70 Z', C.white, C.ink, 1.2), rect(98, 78, 12, 6, '#5a8ae0', 0, null)),
  'barn.byta-blöja': all(rect(10, 72, 100, 8, '#c8e0f0', 4, C.ink, 1.6), rect(10, 80, 100, 32, C.white, 2, C.ink, 1.8), line('M10 96 L110 96', C.ink, 1.4), babyL(54, 64, 1.6, { col: C.skin, mood: 'smile' }), g('translate(84 38)', diaper(0, 0, 1.2)), armOf([[110, 4], [92, 22], [74, 36]], C.green, C.skin), armOf([[116, 20], [104, 32], [96, 36]], C.green, C.skin), bin(22, 112, 1), diaper(22, 86, 0.6, true)),
  'barn.skötbord': all(ground, rect(14, 54, 92, 8, '#f6efe2', 2, C.ink, 1.8), path('M16 54 C16 44 104 44 104 54 Z', '#a8dcc0', C.ink, 1.8), line('M16 54 L16 46 M104 54 L104 46', C.ink, 2), rect(16, 62, 88, 50, '#f6efe2', 2, C.ink, 1.8), line('M16 86 L104 86', C.ink, 1.6), ...[30, 42, 54].map((x) => rect(x - 5, 66, 10, 18, C.white, 2, C.ink, 1)), rect(70, 70, 26, 14, '#8cc7e8', 2, C.ink, 1.2), ...[26, 46, 66].map((x) => rect(x, 92, 14, 16, '#f2c14e', 2, C.ink, 1)), line('M90 20 L90 40', C.ink, 1), star(90, 42, 4)),
  'barn.napp': all(pacifier(64, 60, 2.2), sparkle(26, 26, 5)),
  'barn.snuttefilt': all(ground, tot({ x: 46, h: 0.58, mood: 'calm', l: [[-13, -38], [-8, -46], [-4, -50]], r: [[13, -38], [12, -46], [6, -50]] }), path('M48 66 C60 64 70 72 76 84 C82 96 86 104 88 110 L68 112 C66 100 62 88 54 76 Z', '#f6c9d4', C.ink, 1.6), path('M48 66 C60 64 70 72 76 84 C82 96 86 104 88 110', 'none', '#f2e2b0', 2.4), circle(70, 104, 2.4, '#f2a0b8', C.ink, 1), zz(66, 30)),
  'barn.vagga': all(ground, fig({ x: 60, top: C.green, mood: 'calm', l: [[-13, -38], [-16, -22], [2, -18]], r: [[13, -38], [16, -22], [-2, -24]] }), g('translate(60 52) rotate(-12)', bundle(0, 0, 1.4)), path('M30 40 C24 50 24 60 30 70', 'none', HL, 2.2), path('M90 40 C96 50 96 60 90 70', 'none', HL, 2.2), arrow(30, 66, 31, 72, HL, 2), arrow(90, 44, 89, 38, HL, 2), zz(78, 26)),
  'barn.bärsele': all(ground, fig({ x: 56, top: C.green, mood: 'smile', r: [[13, -38], [20, -30], [26, -40]], l: [[-13, -38], [-20, -24], [-20, -10]] }), path('M46 40 C42 52 46 66 56 68 C66 66 70 52 66 40 Z', C.navy, C.ink, 1.8), circle(56, 38, 7, C.skin, C.ink, 1.4), path('M50 36 C52 30 60 30 62 36', 'none', C.hair, 1.6), line('M47 40 L50 30 M65 40 L62 30', C.navy, 3), cup(80, 26, C.white)),
  'barn.kolik': all(rect(0, 0, 120, 120, '#3a4a7a', 0, null), moon(100, 18, 9), clock(22, 20, 10, 9), rect(6, 84, 108, 28, '#5a6a9a', 2, C.ink, 1.6), fig({ x: 92, h: 0.92, top: '#9ab0e8', bottom: '#5a6a8a', mood: 'tired', y: 116, l: [[-13, -38], [-20, -30], [-30, -34]], r: [[13, -38], [18, -22], [16, -6]] }), babyL(50, 64, 2, { mood: 'cry', red: true }), line('M18 46 l-6 -4 M16 56 l-8 0 M20 66 l-6 4 M44 34 l-2 -7 M54 34 l2 -7', '#f2d04a', 2.2)),

  // ── Små barns utveckling ───────────────────────────────────────────────
  'barn.tillväxtkurva': all(rect(10, 8, 102, 100, C.white, 4, C.ink, 2), line('M22 96 L104 96 M22 96 L22 16', C.ink, 1.8), path('M22 92 C40 60 70 44 104 34 L104 20 C70 30 40 44 22 80 Z', '#d8ecf8', null), line('M22 86 C40 54 70 38 104 27', '#8cc7e8', 1.2, '3 3'), line('M22 92 C40 62 70 46 104 36', HL, 2.6), ...[[30, 76], [42, 62], [56, 54], [72, 46], [90, 40]].map(([x, y]) => circle(x!, y!, 2.6, HL, C.ink, 1)), mini(102, 54, C.yellow, false, 0.7), g('translate(30 30) scale(0.6)', bundle(0, 0, 1))),
  'barn.milstolpe': all(ground, ...[[18, 104], [40, 92], [62, 80], [84, 68], [104, 56]].map(([x, y]) => ellipse(x!, y!, 10, 4, '#c8ced4', C.ink, 1.4)), g('translate(18 98)', babyL(0, 0, 0.7, {})), line('M104 52 L104 20', C.ink, 1.8), path('M104 20 L120 26 L104 32 Z', HL, C.ink, 1.2), fig({ x: 84, h: 0.42, y: 68, top: '#f2a0b8', bottom: '#f2a0b8', mood: 'laugh', l: [[-13, -38], [-24, -46], [-30, -54]], r: [[13, -38], [24, -46], [30, -54]] }), star(62, 70, 5), star(40, 82, 4)),
  'barn.språkutveckling': all(ground, g('translate(18 0)', babyL(0, 104, 0.8, {})), bubble(16, 80, 14, circle(16, 79, 2, C.ink, null)), tot({ x: 52, mood: 'smile' }), bubble(56, 58, 22, ball(56, 57, 5)), kid({ x: 92, mood: 'laugh', h: 0.62 }), bubble(94, 22, 40, all(ball(80, 21, 4.4), arrow(86, 21, 92, 21, C.ink, 1.4), path('M96 24 L100 16 L104 24 Z M100 24 L100 27', C.green, C.ink, 1), circle(108, 20, 3, '#f2c14e', C.ink, 1)))),
  'barn.jollra': all(ellipse(56, 96, 50, 12, '#c8e0f0', C.ink, 1.8), babyL(56, 86, 2.2, { mood: 'smile' }), bubble(84, 34, 46, all(...[70, 82, 94].map((x, i) => path(`M${x - 4} ${36 - (i % 2) * 4} q2 -6 4 0 q2 6 4 0`, 'none', HL, 2))), true)),
  'barn.härma': all(ground, dad({ x: 34, mood: 'laugh', l: [[-13, -38], [-24, -56], [-28, -72]], r: [[13, -38], [24, -56], [28, -72]] }), kid({ x: 88, h: 0.56, mood: 'laugh', l: [[-13, -38], [-24, -56], [-28, -72]], r: [[13, -38], [24, -56], [28, -72]] }), path('M52 26 C62 14 76 16 84 30', 'none', HL, 2.2), arrow(82, 26, 85, 32, HL, 2.2)),
  'barn.ordförråd': all(ground, kid({ x: 22, h: 0.62, mood: 'smile' }), thought(74, 44, 80, all(ball(46, 36, 5), circle(62, 32, 4.4, C.red, C.ink, 1.2), line('M62 28 L63 25', C.brown, 1.4), g('translate(80 34)', rect(-8, -4, 16, 7, '#5a8ae0', 2, C.ink, 1.2), circle(-4, 4, 2.4, C.dark, null), circle(4, 4, 2.4, C.dark, null)), g('translate(98 36)', ellipse(0, 0, 6, 4, C.orange, C.ink, 1.2), path('M5 0 L9 -3 L9 3 Z', C.orange, C.ink, 1)), sun(52, 52, 3.6), g('translate(70 54)', path('M-6 0 L0 -6 L6 0 Z', RED, C.ink, 1), rect(-4.6, 0, 9.2, 6, '#f6d48a', 0, C.ink, 1)), g('translate(88 54)', ellipse(0, 0, 6, 4, '#a0673d', C.ink, 1.2), circle(-5, -3, 2.4, '#a0673d', C.ink, 1)), heart(104, 50, 0.4)))),
  'barn.tvåspråkig': all(ground, kid({ x: 60, h: 0.66, mood: 'laugh' }), bubble(28, 32, 34, flagSe(28, 31, 1.2)), bubble(92, 32, 34, flagJp(92, 31, 1.2), false), heart(60, 18, 0.6)),
  'barn.ta-sina-första-steg': all(ground, ...[[14, 108], [24, 104]].map(([x, y]) => ellipse(x!, y!, 3, 5, '#d8d0c0', null)), tot({ x: 46, h: 0.52, mood: 'laugh', l: [[-13, -38], [-28, -42], [-34, -48]], r: [[13, -38], [28, -42], [34, -48]] }), fig({ x: 96, long: true, top: C.orange, legs: 'kneel', mood: 'laugh', l: [[-13, -38], [-26, -40], [-36, -46]], r: [[13, -38], [22, -50], [28, -62]] }), sparkle(46, 46, 5), sparkle(28, 60, 3.6)),
  'barn.få-tänder': all(circle(60, 60, 44, C.skin, C.ink, 2.4), path('M24 40 C30 16 90 16 96 40 C84 28 36 28 24 40 Z', C.hair, C.ink, 1.6), path('M40 50 Q46 46 52 50 M68 50 Q74 46 80 50', 'none', C.ink, 2), ellipse(36, 68, 6, 4, '#f6a0a0', null), ellipse(84, 68, 6, 4, '#f6a0a0', null), ellipse(60, 78, 16, 13, '#c84a4a', C.ink, 2), path('M53 90 L54 85 L58 85 L59 90 Z M61 90 L62 85 L66 85 L67 90 Z', C.white, C.ink, 1.2), circle(60, 87, 9, 'none', HL, 2), drop(76, 96, 1.2, '#bfe3f5'), g('translate(100 98)', circle(0, 0, 10, 'none', C.ink, 6), circle(0, 0, 10, 'none', '#f2c14e', 4))),
  'barn.självständig': all(ground, rect(64, 88, 50, 6, C.tan, 2, C.ink, 1.6), line('M70 94 L70 112 M108 94 L108 112', C.brown, 3), kid({ x: 42, h: 0.62, mood: 'laugh', l: [[-13, -38], [-22, -24], [-20, -10]], r: [[13, -38], [26, -48], [36, -48]] }), g('translate(68 64) rotate(40)', path('M-6 -10 L6 -10 L8 10 L-8 10 Z', '#f6e08a', C.ink, 1.6), path('M6 -6 C12 -6 12 4 7 4', 'none', C.ink, 1.6), path('M-6 -10 L-10 -14', 'none', C.ink, 1.6)), line('M78 70 C82 76 84 80 84 86', '#f2b632', 2.4), path('M78 72 L90 72 L89 88 L79 88 Z', 'rgba(220,240,252,0.6)', C.ink, 1.4), rect(79.6, 80, 9, 7.4, '#f2b632', 0, null),
    greyed(armOf([[120, 22], [108, 32], [98, 34]], C.green, C.skin)), arrow(96, 22, 108, 14, C.grey, 1.6), star(24, 24, 6), check(40, 16, 1)),
  'barn.trotsålder': all(ground, g('translate(98 40)', rect(-14, -6, 28, 14, '#f6c9d4', 2, C.ink, 1.6), rect(-14, -10, 28, 5, C.white, 2, C.ink, 1.4), ...[-4, 4].map((x) => all(rect(x - 1.4, -20, 2.8, 10, '#8cc7e8', 0.6, C.ink, 0.8), path(`M${x} -24 C${x + 2} -21 ${x + 1} -20 ${x} -20 C${x - 1} -20 ${x - 2} -21 ${x} -24 Z`, C.orange, null)))), tot({ x: 50, h: 0.62, mood: 'angry', l: [[-13, -38], [8, -30], [8, -30]], r: [[13, -38], [-8, -26], [-8, -26]] }), bubble(22, 30, 26, xMark(22, 29, 6)), line('M20 112 l-6 -6 M80 112 l6 -6', HL, 2), line('M34 46 l-5 -3 M66 46 l5 -3', HL, 1.6)),
  'barn.bli-torr': all(ground, path('M30 112 C24 112 22 96 30 90 L64 90 C72 96 70 112 64 112 Z', '#f6a0b8', C.ink, 1.8), tot({ x: 47, h: 0.6, y: 96, legs: 'sit', mood: 'laugh', l: [[-13, -38], [-24, -48], [-28, -60]], r: [[13, -38], [24, -48], [28, -60]] }), diaper(96, 76, 1.3), xMark(96, 76, 14), star(18, 24, 5), star(84, 24, 4)),
  // ── Uppfostran och gränser ─────────────────────────────────────────────
  'barn.uppfostra': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), dad({ x: 34, legs: 'sit', y: 104, mood: 'smile', l: [[-13, -38], [-24, -24], [-22, -30]], r: [[13, -38], [24, -24], [22, -30]] }), kid({ x: 88, h: 0.7, legs: 'sit', y: 104, mood: 'smile', l: [[-13, -38], [-24, -24], [-22, -30]], r: [[13, -38], [24, -24], [22, -30]] }),
    ...[[15.5, 49.4, 0.84], [75.1, 66.4, 0.588]].map(([x, y, k]) => g(`translate(${x} ${y}) scale(${k! / 0.84})`, line('M0 0 L0 -15', C.silver, 3), line('M0 0 L0 -15', C.ink, 0.6), line('M-3 -15 L-3 -21 M0 -15 L0 -21 M3 -15 L3 -21 M-3 -15 L3 -15', C.ink, 1.4))),
    ...[[52.5, 49.4, 0.84], [100.9, 66.4, 0.588]].map(([x, y, k]) => g(`translate(${x} ${y}) scale(${k! / 0.84})`, path('M-1.6 0 L-1.6 -22 C2 -20 3 -14 1.6 -8 L1.6 0 Z', C.silver, C.ink, 1.2))),
    table(84, 4, 116), plate(34, 83, ellipse(34, 81, 6, 2.2, '#e8a040', null)), plate(88, 83, ellipse(88, 81, 6, 2.2, '#e8a040', null)), line('M58 24 C66 16 74 20 80 34', HL, 2.2, '4 3'), arrow(78, 30, 81, 37, HL, 2.2)),
  'barn.uppfostran': all(rect(0, 0, 44, 120, '#e8f0f6', 0, null), rect(44, 0, 76, 120, '#f6efe2', 0, null), ground, mom({ x: 14, h: 0.62, mood: 'smile', r: [[13, -38], [18, -16], [16, 6]] }), tot({ x: 30, h: 0.34, top: C.yellow, bottom: C.denim, mood: 'smile', l: [[-13, -38], [-20, -36], [-24, -32]] }),
    arrow(18, 20, 70, 20, HL, 5), mom({ x: 56, h: 0.5, y: 96, hair: '#7a6a6a', mood: 'laugh', l: [[-13, -38], [-8, -24], [-2, -26]], r: [[13, -38], [8, -24], [2, -26]] }), heart(56, 42, 0.6),
    rect(106, 22, 12, 90, '#a0673d', 1, C.ink, 1.6), path('M118 24 L108 30 L108 108 L118 112 Z', '#c98a5a', C.ink, 1.6), circle(110, 70, 1.4, C.gold, C.ink, 0.8),
    fig({ x: 74, h: 0.7, hair: '#d3d6db', top: C.lilac, mood: 'smile' }), line('M84.6 80 L86 112', C.brown, 2.6),
    fig({ x: 97, h: 0.84, top: C.yellow, bottom: C.denim, mood: 'smile', l: [[-13, -38], [-22, -30], [-26, -26]], r: [[13, -38], [20, -30], [16, -18]] })),
  'barn.tillsägelse': all(ground, rect(6, 30, 50, 76, '#f6efe2', 1, C.grey2, 1.4), path('M16 70 C20 60 28 76 34 64 C38 56 44 66 46 60', 'none', '#e85a5a', 2.6), kid({ x: 34, h: 0.52, mood: 'shock', r: [[13, -38], [6, -54], [4, -70]] }), dad({ x: 90, mood: 'neutral', l: [[-13, -38], [-20, -50], [-20, -66]] }), bubble(98, 14, 18, line('M98 8 L98 13 M98 16.5 L98 17', HL, 2.6))),
  'barn.skälla-på': all(ground, dad({ x: 40, mood: 'shout', top: C.red, l: [[-13, -38], [-20, -24], [-18, -8]], r: [[13, -38], [26, -46], [36, -52]] }), kid({ x: 92, h: 0.5, mood: 'cry' }), path('M54 10 L60 18 L66 8 L70 20 L78 12 L76 24 L86 26 L76 30', 'none', RED, 2.4), line('M64 34 l6 2 M62 42 l8 0', RED, 2)),
  'barn.lyda': all(ground, mom({ x: 28, mood: 'smile', r: [[13, -38], [24, -44], [36, -46]] }), rect(84, 86, 30, 26, '#c8a070', 2, C.ink, 1.8), ball(92, 84, 4), kid({ x: 66, h: 0.5, mood: 'smile', r: [[13, -38], [18, -32], [22, -30]] }), g('translate(86 70)', rect(-5, -5, 10, 10, '#5a8ae0', 1, C.ink, 1.2)), arrow(86, 76, 92, 84, C.grey, 1.6), check(100, 40, 1)),
  'barn.olydig': all(ground, rect(96, 104, 24, 8, C.grey, 0, null), line('M100 108 L106 108 M112 108 L118 108', C.white, 1.4), mom({ x: 26, mood: 'frown', r: [[13, -38], [26, -46], [32, -54]] }), g('translate(56 38)', circle(0, 0, 9, RED, C.ink, 1.4), rect(-5, -1.6, 10, 3.2, C.white, 1, null)), g('rotate(14 84 112)', kid({ x: 84, h: 0.56, mood: 'laugh', l: [[-13, -38], [-26, -30], [-32, -22]], r: [[13, -38], [24, -50], [30, -58]] })), line('M58 84 l-12 0 M60 94 l-14 0 M58 104 l-10 0', C.grey, 1.8)),
  'barn.trotsig': all(ground, mom({ x: 30, mood: 'smile', r: [[13, -38], [24, -40], [34, -40]] }), g('translate(60 46)', path('M-6 0 L-6 -8 L0 -8 L2 -2 L8 0 L8 4 L-6 4 Z', C.red, C.ink, 1.2), path('M3 6 L3 -2 L9 -2 L11 4 L17 6 L17 10 L3 10 Z', C.red, C.ink, 1.2)), kid({ x: 90, h: 0.58, mood: 'angry', l: [[-13, -38], [8, -30], [8, -30]], r: [[13, -38], [-8, -26], [-8, -26]] }), line('M100 38 l6 -4 M102 46 l7 0 M78 38 l-6 -4', HL, 1.8), xMark(76, 20, 5)),
  'barn.raseriutbrott': all(rect(4, 20, 30, 92, '#f6efe2', 1, C.ink, 1.6), ...[40, 60, 80].map((y) => all(line(`M4 ${y} L34 ${y}`, C.ink, 1.4), candy(12, y - 6, 0.6, '#e85a7a'), candy(26, y - 6, 0.6, '#5aa7e8'))), ground,
    armOf([[52, 96], [46, 84], [42, 76]], C.yellow, C.skin), armOf([[60, 96], [66, 84], [72, 80]], C.yellow, C.skin), line('M70 99 L82 84 L86 78', C.ink, 9), line('M70 99 L82 84 L86 78', C.denim, 6.6), line('M70 104 L84 98 L92 94', C.ink, 9), line('M70 104 L84 98 L92 94', C.denim, 6.6), rect(84, 72, 6, 8, C.black, 2, C.ink, 1.2), rect(90, 89, 8, 6, C.black, 2, C.ink, 1.2),
    path('M48 92 L72 92 L72 108 L48 108 Z', C.yellow, C.ink, 2), circle(40, 100, 10, '#f2a08a', C.ink, 2), path('M31 96 C32 88 48 88 49 96 C44 92 36 92 31 96 Z', C.hair, C.ink, 1.4), path('M34 99 Q36 97 38 99 M42 99 Q44 97 46 99', 'none', C.ink, 1.2), ellipse(40, 105, 3, 2.6, '#c84a4a', C.ink, 1), drop(33, 103, 0.6, '#8cc7e8'), drop(47, 103, 0.6, '#8cc7e8'),
    line('M30 82 l-6 -6 M40 80 l0 -8 M54 80 l4 -7', RED, 2.2), fig({ x: 100, h: 0.86, top: C.green, mood: 'frown', l: [[-13, -38], [-20, -50], [-12, -62]], r: [[13, -38], [20, -50], [12, -62]] })),
  'barn.konsekvent': all(...[22, 60, 98].map((x) => page(x, 50, 30, 38, all(candy(x, 52, 0.9), xMark(x, 52, 8)))), line('M38 48 L44 48 M38 54 L44 54 M76 48 L82 48 M76 54 L82 54', C.ink, 2), ground, mom({ x: 60, h: 0.42, mood: 'neutral', r: [[13, -38], [22, -50], [24, -64]] })),
  'barn.muta': all(ground, mom({ x: 32, mood: 'smile', r: [[13, -38], [24, -46], [38, -50]] }), iceCream(66, 34, 1.4), rect(76, 86, 34, 6, C.tan, 2, C.ink, 1.6), rect(104, 54, 6, 34, C.tan, 2, C.ink, 1.6), line('M80 92 L80 112 M106 92 L106 112', C.brown, 3), kid({ x: 92, h: 0.54, y: 100, legs: 'sit', mood: 'laugh' }), line('M74 30 C82 26 88 30 92 40', HL, 1.8, '3 3'), arrow(91, 38, 92, 42, HL, 1.8)),
  'barn.curlingförälder': all(ground, ...[[104, 108], [114, 104], [110, 98]].map(([x, y]) => ellipse(x!, y!, 4.4, 3, '#9aa3ad', C.ink, 1.2)), line('M96 112 l-6 0 M100 104 l-6 0', C.grey, 1.4), line('M72 52 L94 100', C.brown, 3), g('translate(94 100) rotate(-24)', path('M-8 0 L8 0 L10 10 L-10 10 Z', '#e8c860', C.ink, 1.2)),
    dad({ x: 62, mood: 'smile', top: C.green, l: [[-13, -38], [-2, -26], [12, -16]], r: [[13, -38], [22, -26], [26, -10]] }), path('M46 46 L58 46 L58 66 L46 66 Z', '#e85a5a', C.ink, 1.4), line('M48 46 L44 38', C.ink, 1.4), kid({ x: 22, h: 0.52, mood: 'laugh' }), line('M34 112 L90 112', '#bfe3f5', 3)),
  'barn.aga': all(ground, kid({ x: 30, h: 0.54, mood: 'cry', l: [[-13, -38], [-10, -54], [-2, -58]], r: [[13, -38], [10, -54], [2, -58]] }), g('translate(82 52)', path('M-12 16 L-12 -6 C-12 -10 -6 -10 -6 -6 L-6 -14 C-6 -18 0 -18 0 -14 L0 -16 C0 -20 6 -20 6 -16 L6 -12 C6 -16 12 -16 12 -12 L12 10 C12 18 6 22 0 22 L-6 22 Z', C.skin, C.ink, 1.6)), noSign(82, 56, 26)),

  // ── Förskola och familjeliv ────────────────────────────────────────────
  'barn.barnomsorg': all(ground, preschool(40, 82, 1.1), fig({ x: 18, h: 0.66, top: '#7ac0b0', bottom: '#7ac0b0', long: true, mood: 'smile' }), mini(38, 100, C.yellow, false, 0.8), mini(54, 102, '#f2a0b8', true, 0.8), mini(70, 100, '#5aa7e8', false, 0.8), shield(40, 14, 0.7, C.navy), childIcon(40, 14, 0.7, C.white),
    office(102, 82, 0.9), mini(94, 104, C.orange, true, 0.8), mini(110, 104, C.green, false, 0.8), briefcase(102, 112, 0.5), clock(102, 22, 9, 9), line('M80 14 L80 110', C.grey2, 1.4, '3 3')),
  'barn.förskoleplats': all(rect(6, 20, 108, 70, '#f6efe2', 3, C.ink, 1.8), line('M6 90 L114 90', C.ink, 1.8), ...[22, 46, 70, 94].map((x, i) => all(line(`M${x} 34 L${x} 40`, C.ink, 2), i === 3 ? '' : path(`M${x - 9} 40 L${x + 9} 40 L${x + 10} 70 L${x - 10} 70 Z`, [C.red, '#5aa7e8', C.yellow][i]!, C.ink, 1.4), rect(x - 8, 74, 16, 12, C.white, 2, C.ink, 1.2), i === 3 ? childIcon(x, 80, 0.8) : mini(x, 80, '#c8ced4', i === 1, 0.45))), rect(84, 28, 20, 60, 'none', 3, HL, 2.4), arrow(94, 112, 94, 94, HL, 2.4)),
  'barn.maxtaxa': all(ground, ...[[18, 2], [38, 4], [58, 6], [78, 8], [98, 8]].map(([x, n]) => all(...Array.from({ length: Math.min(n!, 7) }, (_, i) => ellipse(x!, 106 - i * 7, 8, 3.4, C.gold, C.ink, 1.2)))), line('M6 60 L114 60', RED, 3), childIcon(60, 28, 2), ...[78, 98].map((x) => arrow(x, 50, x, 58, RED, 1.8))),
  'barn.inskolning': all(ground, rect(8, 20, 104, 92, '#f6efe2', 0, null), ground, rect(8, 92, 24, 6, '#c8a070', 1, C.ink, 1.4), line('M10 98 L10 112 M30 98 L30 112', C.brown, 2.4), dad({ x: 20, h: 0.72, legs: 'sit', y: 104, top: C.green, mood: 'smile' }), tot({ x: 62, mood: 'laugh', r: [[13, -38], [20, -30], [26, -32]] }), g('translate(72 98)', rect(-4, -4, 8, 8, C.red, 1, C.ink, 1), rect(4, -4, 8, 8, C.yellow, 1, C.ink, 1)), fig({ x: 96, h: 0.8, top: C.purple, long: true, mood: 'smile', l: [[-13, -38], [-20, -28], [-26, -30]] }), ...[0, 1, 2].map((i) => all(rect(36 + i * 14, 30, 12, 12, C.white, 2, C.ink, 1.2), check(42 + i * 14, 36, 0.4)))),
  'barn.förskollärare': all(ground, fig({ x: 70, h: 0.84, long: true, top: C.purple, legs: 'sit', y: 100, mood: 'laugh', l: [[-13, -38], [-20, -26], [-16, -36]], r: [[13, -38], [20, -26], [16, -36]] }), g('translate(70 58)', book(0, 0, 1.3, C.green)), mini(22, 106, C.yellow, false, 0.8), mini(40, 108, '#f2a0b8', true, 0.8), mini(102, 106, '#5aa7e8', false, 0.8), g('translate(96 26)', path('M-14 -2 L0 -8 L14 -2 L0 4 Z', C.navy, C.ink, 1.2), path('M-8 1 L-8 7 C-4 10 4 10 8 7 L8 1', C.navy, C.ink, 1.2))),
  'barn.barnskötare': all(rect(6, 20, 108, 92, '#f6efe2', 0, null), ground, ...[20, 40].map((x) => line(`M${x} 30 L${x} 36`, C.ink, 2)), path('M14 36 L26 36 L28 62 L12 62 Z', '#5aa7e8', C.ink, 1.4), path('M34 36 L46 36 L48 62 L32 62 Z', RED, C.ink, 1.4),
    kid({ x: 46, h: 0.6, top: C.yellow, bottom: '#e8b030', mood: 'smile', l: [[-13, -38], [-20, -24], [-18, -8]], r: [[13, -38], [22, -40], [28, -46]] }), path('M33 104 L41 104 L42 112 L31 112 Z', C.green, C.ink, 1.2),
    fig({ x: 88, h: 0.92, top: '#7ac0b0', legs: 'kneel', mood: 'smile', l: [[-13, -38], [-24, -14], [-30, 12]], r: [[13, -38], [2, -10], [-22, 14]] }), path('M58 96 L66 96 L67 106 L56 106 Z', C.green, C.ink, 1.4)),
  'barn.utevistelse': all(rect(0, 0, 120, 120, '#e6eef4', 0, null), cloud(30, 16, 1, '#9aa3ad'), cloud(82, 12, 0.9, '#9aa3ad'), line('M24 28 l-3 6 M36 30 l-3 6 M76 24 l-3 6 M90 26 l-3 6', '#5aa7e8', 1.6), rect(0, 100, 120, 20, '#a8c890', 0, null), ellipse(80, 108, 22, 5, '#8cb8d8', C.ink, 1.2), tot({ x: 30, top: C.yellow, bottom: C.yellow, mood: 'laugh', y: 110, r: [[13, -38], [22, -46], [26, -56]] }), tot({ x: 80, top: RED, bottom: RED, mood: 'laugh', y: 106, l: [[-13, -38], [-22, -46], [-26, -56]], r: [[13, -38], [22, -46], [26, -56]] }), line('M66 98 l-4 -6 M96 98 l4 -6 M72 92 l-2 -6', '#5aa7e8', 1.6), ...[4, 20, 100, 116].map((x) => line(`M${x} 76 L${x} 100`, C.brown, 2.4)), line('M4 82 L22 82 M100 82 L116 82', C.brown, 2)),
  'barn.ombyte': all(path('M18 50 L70 50 L74 104 L14 104 Z', '#5aa7e8', C.ink, 2), path('M30 50 C30 36 58 36 58 50', 'none', C.ink, 3), shirt(36, 66, 1.3, C.yellow), pants(56, 70, 1.3, C.denim), sock(32, 90, 1, C.red), sock(46, 92, 1, C.red), greyed(shirt(94, 66, 1.3, C.yellow), pants(96, 92, 1.2, C.denim)), ellipse(94, 70, 6, 3, '#8a6a4a', null), drop(104, 56, 1, '#8cc7e8'), drop(86, 84, 0.8, '#8cc7e8'), arrow(84, 30, 64, 30, HL, 2.4)),
  'barn.vabba': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), sofa(56, 104, 76, '#7a9ad0'), dad({ x: 34, h: 0.86, legs: 'sit', y: 104, top: C.green, mood: 'neutral', r: [[13, -38], [22, -28], [30, -30]] }), g('translate(72 82)', path('M-14 -2 C-14 -10 16 -12 18 -2 L18 8 L-14 8 Z', '#f6c9d4', C.ink, 1.4), circle(-14, -8, 7, '#f6b0a0', C.ink, 1.4), path('M-19 -10 Q-17 -12 -15 -10 M-13 -10 Q-11 -12 -9 -10', 'none', C.ink, 0.9), line('M-8 -6 L0 -14', C.white, 2.4), line('M-8 -6 L0 -14', C.ink, 0.6), circle(0, -14, 1.4, RED, null)), thought(96, 22, 36, all(office(96, 32, 0.5), xMark(96, 22, 8)), false)),
  'barn.småbarnsförälder': all(ground, mom({ x: 58, mood: 'tired', top: C.orange, l: [[-13, -38], [-22, -26], [-12, -16]], r: [[13, -38], [22, -24], [26, -10]] }), path('M48 40 C44 50 48 62 58 64 C68 62 72 50 68 40 Z', C.navy, C.ink, 1.6), circle(58, 38, 6, C.skin, C.ink, 1.4), tot({ x: 24, h: 0.36, mood: 'cry', r: [[13, -38], [22, -36], [28, -34]] }), bag(88, 92, 1.2), ball(104, 106, 5), g('translate(14 106)', rect(-5, -5, 10, 10, C.red, 1, C.ink, 1.2)), drop(74, 10, 1, '#8cc7e8'), line('M40 12 l-4 -4 M44 6 l-2 -5', C.grey, 1.4)),
  'barn.livspussel': all(puzzle(38, 38, 1.3, '#f6d48a', briefcase(38, 40, 0.9)), puzzle(82, 38, 1.3, '#a8dcc0', g('translate(82 40)', path('M-8 0 L0 -7 L8 0 Z', RED, C.ink, 1), rect(-6, 0, 12, 8, C.white, 0, C.ink, 1))), puzzle(38, 82, 1.3, '#c8e0f8', childIcon(38, 84, 1.3)), g('translate(84 92) rotate(18)', puzzle(0, 0, 1.3, '#f6c9d4', pot(0, 2, 0.8))), rect(65, 63, 36, 36, 'none', 3, C.grey, 1.4), armOf([[118, 120], [110, 108], [98, 100]], C.green, C.skin)),

  // ── Föräldraledighet ───────────────────────────────────────────────────
  'barn.föräldraledighet': all(page(36, 40, 56, 52, all(...Array.from({ length: 12 }, (_, i) => childIcon(18 + (i % 4) * 12, 32 + Math.floor(i / 4) * 12, 0.7)))), ground, dad({ x: 88, top: C.green, mood: 'laugh', l: [[-13, -38], [-16, -22], [2, -20]], r: [[13, -38], [16, -22], [-2, -26]] }), g('translate(88 54)', bundle(0, 0, 1.2, PINK, true)), greyed(briefcase(36, 100, 1.4)), xMark(36, 100, 10, C.grey)),
  'barn.föräldraledig': all(ground, rect(6, 104, 74, 8, '#a8dcc0', 3, C.ink, 1.4), mom({ x: 36, legs: 'kneel', y: 108, mood: 'laugh', r: [[13, -38], [24, -30], [30, -26]] }), babyL(62, 98, 1.2, {}), line('M100 30 L100 40', C.ink, 1.6), greyed(briefcase(100, 50, 1.3)), zz(108, 36), page(100, 86, 22, 22, childIcon(100, 90, 0.9))),
  'barn.mammaledig': all(ground, mom({ x: 30, mood: 'laugh', r: [[13, -38], [22, -36], [32, -40]] }), stroller(62, 102, 1.2), greyed(dad({ x: 102, h: 0.86, mood: 'neutral', r: [[13, -38], [18, -20], [18, -6]] }), briefcase(108, 100, 0.8))),
  'barn.pappaledig': all(ground, dad({ x: 30, mood: 'laugh', r: [[13, -38], [22, -36], [32, -40]] }), stroller(62, 102, 1.2), greyed(mom({ x: 102, h: 0.84, mood: 'neutral', r: [[13, -38], [18, -20], [18, -6]] }), briefcase(108, 100, 0.8))),
  'barn.ta-ut': all(page(44, 64, 60, 64, all(...Array.from({ length: 9 }, (_, i) => rect(22 + (i % 3) * 16, 46 + Math.floor(i / 3) * 14, 12, 10, '#eef2f6', 1, C.grey2, 0.8)))), g('translate(88 40) rotate(16)', rect(-14, -16, 28, 32, C.white, 2, C.ink, 1.8), rect(-14, -16, 28, 8, RED, 2, C.ink, 1.6), childIcon(0, 4, 1.1)), armOf([[120, 6], [108, 16], [100, 28]], C.orange, C.skin), arrow(70, 50, 82, 38, HL, 2.2)),
  'barn.föräldradag': all(page(54, 58, 64, 70, all(childIcon(54, 58, 2.4))), coin(96, 92, 10), coin(104, 80, 8), sparkle(98, 24, 5)),
  'barn.föräldrapenning': all(ground, dad({ x: 34, top: C.green, mood: 'laugh', l: [[-13, -38], [-16, -22], [2, -20]], r: [[13, -38], [24, -40], [34, -44]] }), g('translate(34 54)', bundle(0, 0, 1.2)), shield(96, 30, 1.2, C.navy), path('M92 26 l4 4 l6 -8', 'none', C.white, 2), ...[[82, 56], [74, 64], [66, 70]].map(([x, y]) => coin(x!, y!, 5.4)), arrow(92, 48, 80, 54, HL, 1.8)),
  'barn.pappamånad': all(...[22, 60, 98].map((x) => page(x, 42, 30, 36, all(mini(x, 44, C.green, false, 0.9)), RED)), padlock(60, 82, 1.1), mini(30, 98, C.orange, true, 1), xMark(30, 100, 9), arrow(46, 98, 52, 92, C.grey, 1.4), ground),
  'barn.dubbeldag': all(page(60, 30, 40, 40, all(mini(52, 32, C.orange, true, 0.7), mini(68, 32, C.green, false, 0.7))), sofa(60, 104, 92, '#7a9ad0'), mom({ x: 34, h: 0.78, legs: 'sit', y: 104, mood: 'laugh', r: [[13, -38], [20, -24], [26, -20]] }), dad({ x: 86, h: 0.82, legs: 'sit', y: 104, mood: 'laugh', l: [[-13, -38], [-20, -24], [-26, -20]] }), g('translate(60 84)', bundle(0, 0, 1.1, PINK, true))),
  'barn.överlåta': all(armOf([[0, 70], [20, 64], [40, 60]], C.orange, C.skin), armOf([[120, 74], [100, 70], [82, 66]], C.green, C.skin), g('translate(60 50) rotate(-6)', page(0, 0, 26, 28, childIcon(0, 3, 0.9)), page(4, 4, 26, 28, childIcon(4, 7, 0.9))), arrow(34, 30, 86, 30, HL, 2.6), mini(18, 104, C.orange, true, 1), mini(102, 104, C.green, false, 1)),
  'barn.gå-ner-i-tid': all(ground, greyed(rect(12, 22, 88, 14, C.grey, 3, C.ink, 1.6)), rect(12, 46, 64, 14, '#5a8ae0', 3, C.ink, 1.6), clock(108, 53, 9, 3), rect(76, 46, 24, 14, 'none', 3, HL, 1.6), fig({ x: 40, h: 0.6, top: C.orange, long: true, mood: 'laugh', r: [[13, -38], [22, -28], [28, -26]] }), tot({ x: 66, h: 0.36, mood: 'laugh', l: [[-13, -38], [-22, -40], [-28, -40]] }), preschool(98, 112, 0.6)),
  'barn.barnbidrag': all(piggy(70, 86, 1.6), ...[[64, 40], [72, 26], [62, 12]].map(([x, y]) => coin(x!, y!, 5.6)), arrow(70, 50, 70, 62, HL, 1.8), page(22, 40, 28, 32, all(...Array.from({ length: 4 }, (_, i) => check(16 + (i % 2) * 12, 38 + Math.floor(i / 2) * 10, 0.4)))), shield(104, 30, 1, C.navy), mini(30, 104, C.yellow, false, 0.9)),
  'barn.föräldragrupp': all(ellipse(60, 100, 54, 14, '#e6d3b3', C.ink, 1.4), ...[[24, C.orange, true], [60, C.green, false], [96, C.purple, true]].map(([x, col, long]) => fig({ x: x as number, h: 0.6, legs: 'sit', y: 98, top: col as string, long: long as boolean, mood: 'laugh', l: [[-13, -38], [-16, -22], [2, -20]], r: [[13, -38], [16, -22], [-2, -26]] })), ...[24, 60, 96].map((x) => bundle(x, 76, 0.9, PINK, true)), bubble(42, 20, 18, heart(42, 20, 0.5)), bubble(80, 18, 18, cup(80, 22, C.white), false)),
  'barn.babysim': all(rect(0, 58, 120, 62, '#8cc7e8', 0, null), dad({ x: 86, y: 132, top: '#5aa7e8', bare: true, mood: 'laugh', l: [[-13, -38], [-30, -36], [-42, -32]], r: [[13, -38], [-4, -26], [-34, -26]] }), path('M0 64 C12 58 24 70 36 64 C48 58 60 70 72 64 C84 58 96 70 108 64 C112 62 116 62 120 64 L120 120 L0 120 Z', 'rgba(140,199,232,0.8)', null), babyL(44, 62, 1.5, { col: '#f2c14e', mood: 'smile' }), line('M20 52 l-4 -6 M70 50 l4 -6 M26 46 l-2 -6', C.white, 1.8), drop(14, 44, 1, C.white), drop(76, 40, 1, C.white)),
  'barn.lattepappa': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), rect(10, 10, 40, 30, '#bfe3f5', 2, C.ink, 1.6), line('M30 10 L30 40', C.ink, 1.2), ground, dad({ x: 36, h: 0.86, legs: 'sit', y: 104, top: C.green, mood: 'laugh', r: [[13, -38], [22, -28], [30, -32]] }), rect(50, 72, 34, 5, '#a0673d', 1, C.ink, 1.4), line('M67 77 L67 112', C.brown, 3), path('M60 72 L60 60 L70 60 L70 72 Z', C.white, C.ink, 1.4), ellipse(65, 60, 5, 1.6, '#d4a373', C.ink, 1), heart(65, 60, 0.18), steam(65, 54), stroller(100, 104, 1.1)),

  // ── Familjens ansvarsfördelning ────────────────────────────────────────
  'barn.ansvarsfördelning': all(rect(8, 10, 104, 100, C.white, 4, C.ink, 2), line('M60 26 L60 104', C.ink, 1.4), mini(34, 22, C.orange, true, 0.9), mini(86, 22, C.green, false, 0.9), line('M8 38 L112 38', C.ink, 1.4), pot(34, 54, 0.9), broom(86, 60, 0.6, 0), shirt(34, 80, 1, C.sky), g('translate(86 84)', rect(-10, -5, 20, 8, '#5a8ae0', 3, C.ink, 1.2), circle(-6, 4, 2.4, C.dark, null), circle(6, 4, 2.4, C.dark, null)), check(48, 54, 0.4), check(100, 54, 0.4), check(48, 82, 0.4), check(100, 82, 0.4)),
  'barn.huvudansvar': all(ground, greyed(mom({ x: 26, h: 0.7, mood: 'smile' }), kid({ x: 96, h: 0.46, mood: 'smile' })), dad({ x: 62, mood: 'laugh', top: C.green, l: [[-13, -38], [-18, -28], [-8, -30]], r: [[13, -38], [18, -28], [8, -30]] }), pot(62, 64, 1.3), star(62, 10, 8, C.yellow)),
  'barn.hålla-koll-på': all(ground, mom({ x: 28, mood: 'smile', r: [[13, -38], [22, -50], [26, -62]] }), rect(54, 14, 60, 72, C.white, 3, C.ink, 1.8), clock(66, 30, 7, 3), check(88, 30, 0.6), g('translate(66 50)', rect(-7, -6, 14, 12, C.white, 1, C.ink, 1.2), rect(-7, -6, 14, 4, RED, 1, C.ink, 1)), check(88, 50, 0.6), g('translate(66 70)', rect(-7, -5, 14, 10, '#e85a7a', 1, C.ink, 1.2), rect(-1.4, -5, 2.8, 10, C.yellow, 0, null)), check(88, 70, 0.6)),
  'barn.mental-belastning': all(ground, g('translate(40 0)', g('rotate(8 0 112)', mom({ x: 0, mood: 'tired', h: 0.92 }))), cloud(44, 22, 1.6, '#e8e4ee'), clock(32, 22, 5, 2), g('translate(46 16)', rect(-5, -4, 10, 8, C.white, 1, C.ink, 1), rect(-5, -4, 10, 3, RED, 1, C.ink, 0.8)), shirt(58, 24, 0.6, C.sky), g('translate(40 30) scale(0.5)', path('M-8 0 L8 0 L8 8 L-8 8 Z', '#e85a7a', C.ink, 1.4)), arrow(44, 38, 44, 46, C.dark, 2.4), drop(56, 46, 1, '#8cc7e8'), greyed(sofa(96, 112, 34, '#9aa3ad'), dad({ x: 96, h: 0.62, legs: 'sit', y: 104, mood: 'calm' })), thought(100, 40, 18, '', false)),
  'barn.familjeråd': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), mom({ x: 22, h: 0.78, y: 90, mood: 'smile' }), dad({ x: 98, h: 0.8, y: 90, mood: 'laugh', l: [[-13, -38], [-22, -54], [-24, -70]] }), kid({ x: 46, h: 0.42, y: 90, mood: 'smile' }), kid({ x: 74, h: 0.46, y: 90, top: C.sky, mood: 'laugh' }), table(84, 4, 116), rect(48, 76, 24, 8, C.white, 1, C.ink, 1.2), bubble(40, 18, 18, heart(40, 18, 0.45)), bubble(78, 16, 18, check(78, 16, 0.5), false)),
  'barn.ta-ut-soporna': all(rect(0, 0, 66, 120, '#f6efe2', 0, null), rect(66, 0, 54, 120, '#dbeed0', 0, null), rect(52, 22, 20, 90, '#a0673d', 1, C.ink, 1.6), ground, kid({ x: 74, h: 0.56, mood: 'smile', r: [[13, -38], [22, -30], [24, -24]] }), bag(98, 76, 1.2), bin(106, 112, 1.2), arrow(84, 40, 104, 40, HL, 2)),
  'barn.veckopeng': all(ground, dad({ x: 34, mood: 'smile', r: [[13, -38], [24, -40], [40, -44]] }), kid({ x: 86, h: 0.54, mood: 'laugh', l: [[-13, -38], [-22, -40], [-30, -44]] }), coin(60, 46, 5), coin(66, 40, 5), ...[0, 1, 2, 3, 4, 5, 6].map((i) => rect(16 + i * 13, 8, 11, 10, i === 6 ? HL : C.white, 2, C.ink, 1))),
  'barn.läxhjälp': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), dad({ x: 30, h: 0.9, y: 108, mood: 'smile', r: [[13, -38], [26, -36], [42, -36]] }), kid({ x: 88, h: 0.52, y: 104, mood: 'neutral', l: [[-13, -38], [-22, -24], [-30, -30]] }), table(80, 4, 116), book(62, 74, 1.4, C.green), line('M74 70 L84 62', C.yellow, 2.4), thought(98, 22, 22, path('M94 24 q0 -6 4 -6 q4 0 4 4 q0 3 -4 4 L98 28 M98 30.5 L98 31', 'none', C.navy, 1.6), false)),
  'barn.fritidsaktivitet': all(ground, kid({ x: 40, h: 0.66, top: RED, bottom: C.white, mood: 'laugh', l: [[-13, -38], [-24, -32], [-28, -26]], r: [[13, -38], [24, -32], [28, -26]] }), ball(70, 104, 7), bubble(86, 22, 30, g('translate(86 21)', rect(-12, -6, 24, 12, C.dark, 2, C.ink, 1.2), ...[-8, -4, 0, 4, 8].map((x) => rect(x - 1.6, -5, 3.2, 8, C.white, 0.4, null)))), bubble(96, 60, 26, all(...[0, 1].map((i) => path(`M${86 + i * 6} ${62} q3 -4 6 0`, 'none', '#5aa7e8', 1.8)), circle(96, 56, 3, C.skin, C.ink, 1)), false)),
  'barn.könsroll': all(sepia(rect(6, 8, 108, 62, '#f2e2c4', 4, C.ink, 1.8), fig({ x: 34, h: 0.56, y: 66, long: true, skirt: '#c86a6a', top: '#c86a6a', apron: C.white, mood: 'smile' }), pot(52, 52, 0.7), fig({ x: 84, h: 0.58, y: 66, top: '#4a5a7a', bottom: '#4a5a7a', mood: 'smile' }), briefcase(98, 58, 0.7)), mini(34, 98, C.orange, true, 1.1), mini(84, 98, C.green, false, 1.1), path('M44 92 C54 82 64 82 74 92', 'none', HL, 2.2), arrow(72, 90, 75, 94, HL, 2.2), path('M74 106 C64 116 54 116 44 106', 'none', HL, 2.2), arrow(46, 108, 43, 104, HL, 2.2)),
  'barn.hemmafru': all(sepia(rect(0, 0, 120, 120, '#f2e2c4', 0, null), ground, fig({ x: 40, long: true, skirt: '#d86a6a', top: '#d86a6a', apron: C.white, mood: 'smile', r: [[13, -38], [22, -30], [28, -34]] }), pot(76, 62, 1.1), rect(66, 68, 22, 44, '#a0a8b0', 1, C.ink, 1.4), circle(72, 72, 1.6, C.dark, null), circle(80, 72, 1.6, C.dark, null)), greyed(fig({ x: 104, h: 0.86, top: '#4a5a7a', bottom: '#4a5a7a', cap: '#3a3a40', mood: 'smile' }), briefcase(110, 102, 0.8))),
  'barn.hemmapappa': all(rect(0, 0, 120, 120, '#f6efe2', 0, null), ground, dad({ x: 38, apron: '#f2c14e', mood: 'laugh', l: [[-13, -38], [-16, -22], [2, -20]], r: [[13, -38], [22, -30], [30, -38]] }), g('translate(38 54)', bundle(0, 0, 1.1, PINK, true)), rect(64, 70, 26, 42, '#c8ced4', 1, C.ink, 1.4), pot(74, 62, 1.1), line('M70 46 L76 58', C.brown, 2), greyed(mom({ x: 104, h: 0.84, mood: 'smile' }), briefcase(110, 102, 0.8))),
  'barn.dubbelarbete': all(rect(0, 0, 60, 120, '#e8f2fa', 0, null), rect(60, 0, 60, 120, '#3a4a7a', 0, null), sun(16, 16, 6), moon(104, 16, 7), rect(10, 76, 40, 6, '#a0673d', 1, C.ink, 1.4), rect(18, 58, 22, 16, C.dark, 2, C.ink, 1.4), mom({ x: 30, h: 0.66, y: 112, mood: 'neutral' }), mom({ x: 86, h: 0.66, y: 112, mood: 'tired', r: [[13, -38], [16, -26], [10, -30]] }), rect(70, 78, 34, 34, '#c8ced4', 1, C.ink, 1.4), ellipse(96, 72, 8, 3, C.white, C.ink, 1.2), drop(100, 44, 1, '#8cc7e8'), line('M60 0 L60 120', C.ink, 1.4)),
};

