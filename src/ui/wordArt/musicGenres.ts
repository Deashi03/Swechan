/**
 * Kultur & fritid → Musik & scenkonst → Musikgenrer, 4431–4437 (0.62): classical music, jazz and blues, rock and
 * pop, electronic dance music, hip-hop and rap, folk music, film and game music.
 * A genre is drawn as its typical scene (a symphony orchestra on a stage, a jazz cellar with candles, a rock
 * guitarist in front of an amplifier, a dj behind turntables, a fiddler in folk costume under birches, a cinema
 * screen with musicians below), never as a word. The part the word names is orange (orange ring, frame or
 * fill); grey figures and things are the reference. People have their own posable arms (no third arm).
 * Abstract words are small symbolic scenes: a copied note pattern
 * (coverlåt) and the same three-note motif over every film
 * frame (ledmotiv). Verbs move (jamma, slå igenom, mixa, rappa, scratcha,
 * tralla, spela på gehör; base state = poster frame, transform and opacity only).
 * Notes and digits only; no letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waGrow, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, heart, note } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
type Mood = 'smile' | 'sad' | 'laugh' | 'calm' | 'shout' | 'sing' | 'neutral' | 'shock';
type Fig = {
  x?: number; h?: number; y?: number; top?: string; bottom?: string; hair?: string; long?: boolean; grey?: boolean; mood?: Mood;
  l?: Pt[]; r?: Pt[]; skirt?: string; legs?: 'stand' | 'sit'; gown?: string; tie?: string; bow?: string; cap?: string; hat?: string;
  mohawk?: string; phones?: string; held?: Svg; front?: Svg; vest?: string; apron?: string; scarf?: string; crown?: boolean; skin?: string;
};

// ── Palette ──────────────────────────────────────────────────────────
const WHITE = '#fbfbf8';
const WOOD = '#b07a45';
const WOOD2 = '#8a5a2e';
const STAGE = '#2e2e3a';
const NIGHT = '#262a3d';
const CURTAIN = '#b8323c';
const GOLD = C.gold;
const BRASS = '#d9a93a';
const PURPLE = '#7b4fa8';
const NEON = '#5be0d0';
const FALU = '#a8382c';
const BIRCH = '#f1ede4';
const LEAF = '#7fbf6a';
const GRASS = '#a8d48c';
const LIGHT = 'rgba(255,236,150,0.45)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, a: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a})`, ...k);
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
const n2 = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M2.6 4 L2.6 -10', col, 1.8), ellipse(0, 4, 3.2, 2.4, col, null));
const notes = (pts: [number, number, number?][], col: string = C.navy) => all(...pts.map(([x, y, s], i) => (i % 2 ? n2(x, y, s ?? 1, col) : note(x, y, (s ?? 1) * 0.8, col))));
/** Five-line staff from (x, y), w wide. */
const staff = (x: number, y: number, w: number, gap = 3.4, col: string = C.grey) => line(range(5).map((i) => `M${x} ${f1(y + i * gap)} L${x + w} ${f1(y + i * gap)}`).join(' '), col, 0.9);
/** Note head on a staff. */
const head = (x: number, y: number, col: string = C.ink, s = 1) => all(ellipse(x, y, 2.4 * s, 1.8 * s, col, null), line(`M${f1(x + 2.2 * s)} ${y} L${f1(x + 2.2 * s)} ${f1(y - 9 * s)}`, col, 1.1 * s));
const spot = (x: number, top: number, w: number, y: number, col: string = LIGHT) => path(`M${x - 4} ${top} L${x + 4} ${top} L${x + w / 2} ${y} L${x - w / 2} ${y} Z`, col, null);
const lamp = (x: number, y: number) => all(rect(x - 4, y - 3, 8, 6, C.dark, 1.5, C.ink, 1), circle(x, y + 3, 2.2, C.yellow, null));
/** Grey audience heads in a row. */
const heads = (y: number, xs: number[], col: string = '#7c8290') => all(...xs.map((x, i) => all(path(`M${x - 7} ${y + 8} C${x - 7} ${y} ${x + 7} ${y} ${x + 7} ${y + 8} Z`, col, null), circle(x, y - 3, 4.4 + (i % 2) * 0.4, col, null))));
const dark = (fill: string = STAGE) => rect(4, 4, 112, 108, fill, 4, null);

// ── People ───────────────────────────────────────────────────────────
function face(m: Mood, sk: string): Svg {
  const ink = C.ink;
  const eyes = m === 'calm' ? path('M-5.5 -56 Q-3.6 -54.4 -1.8 -56 M1.8 -56 Q3.6 -54.4 5.5 -56', 'none', ink, 1.3)
    : m === 'laugh' || m === 'sing' ? path('M-5.5 -55 Q-3.6 -58 -1.8 -55 M1.8 -55 Q3.6 -58 5.5 -55', 'none', ink, 1.3)
    : m === 'shock' ? all(circle(-3.4, -56, 1.8, WHITE, ink, 0.9), circle(3.4, -56, 1.8, WHITE, ink, 0.9), circle(-3.4, -56, 0.8, ink, null), circle(3.4, -56, 0.8, ink, null))
    : all(circle(-3.4, -56, 1.2, ink, null), circle(3.4, -56, 1.2, ink, null));
  const brows = m === 'shout' ? line('M-6 -60.5 L-1.6 -58.6 M6 -60.5 L1.6 -58.6', ink, 1.4) : m === 'sad' ? line('M-6 -58.6 L-1.8 -59.8 M6 -58.6 L1.8 -59.8', ink, 1.1) : '';
  const mouth = m === 'sad' ? path('M-3 -50 Q0 -52.6 3 -50', 'none', ink, 1.3)
    : m === 'laugh' ? path('M-3.6 -52 Q0 -46 3.6 -52 Z', '#c84a4a', ink, 1)
    : m === 'shout' || m === 'sing' ? ellipse(0, -50.4, 2.4, 2.8, '#c84a4a', ink, 1)
    : m === 'shock' ? ellipse(0, -50.5, 1.6, 2, '#c84a4a', ink, 0.9)
    : m === 'neutral' ? line('M-2.6 -50.6 L2.6 -50.6', ink, 1.2)
    : path('M-3 -51.5 Q0 -48.6 3 -51.5', 'none', ink, 1.3);
  return all(circle(0, -55, 7.4, sk, null), eyes, brows, mouth);
}
function armOf(pts: Pt[], col: string, sk: string): Svg {
  const d = 'M' + pts.map(([a, b]) => `${a} ${b}`).join(' L');
  const [hx, hy] = pts[pts.length - 1]!;
  return all(line(d, C.ink, 8.4), line(d, col, 5.8), circle(hx, hy, 3.4, sk, C.ink, 1.4));
}
/**
 * Person, front view, with its own arms (l, r: points from the shoulder, figure coordinates: head (0, −56),
 * shoulders (±13, −38), hips y 0, feet y 49; sitting: feet y 35). `held` is drawn over the body and under arms
 * that end in front of the body; `front` over everything.
 */
function fig(o: Fig): Svg {
  const h = o.h ?? 1, s = 0.84 * h, grey = !!o.grey;
  const sk = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.sky), bot = grey ? C.grey : (o.bottom ?? C.navy), hair = grey ? '#b9bec5' : (o.hair ?? C.hair);
  const legs = o.legs ?? 'stand', base = legs === 'sit' ? 35 : 49;
  const out: Svg[] = [];
  if (o.long) out.push(path('M-11 -56 C-14 -40 -8 -38 0 -40 C8 -38 14 -40 11 -56 C10 -70 -10 -70 -11 -56 Z', hair, C.ink, 1.8));
  if (o.gown) out.push(path('M-12 -2 L12 -2 L26 49 L-26 49 Z', grey ? C.grey2 : o.gown, C.ink, 2));
  else if (legs === 'stand') {
    if (o.skirt) out.push(path('M-9 20 L-9 46 L-3 46 L-3 20 Z M3 20 L3 46 L9 46 L9 20 Z', sk, C.ink, 1.6), path('M-13 -4 L-19 30 L19 30 L13 -4 Z', grey ? C.grey : o.skirt, C.ink, 2));
    else out.push(path('M-12 0 L-11 46 L-3 46 L0 8 L3 46 L11 46 L12 0 Z', bot, C.ink, 2));
    out.push(path('M-11 44 L-3 44 L-2 49 L-13 49 Z M3 44 L11 44 L13 49 L2 49 Z', grey ? C.grey : C.black, C.ink, 1.6));
  } else {
    if (o.skirt) out.push(path('M-14 -2 L14 -2 L16 14 L-16 14 Z', grey ? C.grey : o.skirt, C.ink, 2), path('M-11 14 L-11 31 L-4 31 L-4 14 Z M4 14 L4 31 L11 31 L11 14 Z', sk, C.ink, 1.6));
    else out.push(path('M-13 -2 L13 -2 L13 9 L-13 9 Z', bot, C.ink, 2), path('M-12 8 L-12 31 L-3 31 L-3 8 Z M3 8 L3 31 L12 31 L12 8 Z', bot, C.ink, 2));
    out.push(path('M-13 30 L-2 30 L-2 35 L-14 35 Z M2 30 L13 30 L14 35 L2 35 Z', grey ? C.grey : C.black, C.ink, 1.6));
  }
  const L = o.l ?? [[-13, -38], [-19, -20], [-18, -3]], R = o.r ?? [[13, -38], [19, -20], [18, -3]];
  const inside = (p: Pt[]) => { const [hx, hy] = p[p.length - 1]!; return Math.abs(hx) < 13 && hy > -42; };
  for (const a of [L, R]) if (!inside(a)) out.push(armOf(a, top, sk));
  out.push(path('M-14 -42 L14 -42 C15 -30 12 -16 12 2 L-12 2 C-12 -16 -15 -30 -14 -42 Z', top, C.ink, 2.2));
  if (o.vest) out.push(path('M-6 -42 L0 -26 L6 -42 Z', o.vest, C.ink, 1));
  if (o.apron) out.push(path('M-9 -24 L9 -24 L11 2 L-11 2 Z', grey ? C.grey2 : o.apron, C.ink, 1.2));
  if (o.scarf) out.push(path('M-10 -42 L10 -42 L0 -30 Z', grey ? C.grey2 : o.scarf, C.ink, 1.2));
  if (o.tie) out.push(path('M-1.6 -41 L1.6 -41 L2.4 -28 L0 -25 L-2.4 -28 Z', o.tie, C.ink, 0.9));
  if (o.bow) out.push(path('M-5 -43 L0 -41 L5 -43 L5 -38.6 L0 -40.6 L-5 -38.6 Z', o.bow, C.ink, 0.9));
  if (o.held) out.push(o.held);
  for (const a of [L, R]) if (inside(a)) out.push(armOf(a, top, sk));
  out.push(rect(-3.5, -48, 7, 7, sk, 2, C.ink, 1.6), circle(0, -56, 10, sk, C.ink, 2));
  if (o.long) out.push(circle(0, -54, 8.6, sk, null));
  if (o.mohawk) out.push(path('M-3 -64 L-5 -84 L0 -76 L2 -88 L4 -76 L8 -82 L4 -64 Z', o.mohawk, C.ink, 1.4));
  else out.push(path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', hair, C.ink, 1.8));
  out.push(face(o.mood ?? 'smile', sk));
  if (o.cap) out.push(path('M-11 -60 C-11 -72 11 -72 11 -60 Z', o.cap, C.ink, 1.4), path('M-11 -61 L-22 -59 L-21 -57 L-10 -59 Z', o.cap, C.ink, 1.2));
  if (o.hat) out.push(path('M-16 -62 L16 -62 L12 -64 L9 -74 L-9 -74 L-12 -64 Z', o.hat, C.ink, 1.4), line('M-9 -66 L9 -66', '#c84a4a', 1.6));
  if (o.crown) out.push(path('M-9 -63 L-9 -73 L-5 -68 L0 -75 L5 -68 L9 -73 L9 -63 Z', GOLD, C.ink, 1.4));
  if (o.phones) out.push(path('M-12 -56 C-13 -74 13 -74 12 -56', 'none', o.phones, 2.6), rect(-15, -61, 5, 10, o.phones, 2, C.ink, 1), rect(10, -61, 5, 10, o.phones, 2, C.ink, 1));
  if (o.front) out.push(o.front);
  return g(`translate(${o.x ?? 60} ${f1((o.y ?? 112) - base * s)}) scale(${s.toFixed(3)})`, ...out);
}

// ── Instruments and things (local coordinates, drawn at (0, 0)) ───────
/** Guitar: body centred at (0, 0), neck towards −x. */
const guitar = (col: string = WOOD, electric = false) => all(
  electric ? all(path('M-9 -8 C-2 -13 4 -7 9 -12 C15 -15 18 -7 14 -2 C19 3 16 11 10 11 C4 11 0 13 -7 10 C-13 7 -13 -5 -9 -8 Z', col, C.ink, 1.4), path('M-4 -4 L6 -4 L4 6 L-6 6 Z', WHITE, C.ink, 0.8), rect(-1, -6, 2.4, 12, C.dark, 0.5, null))
    : all(ellipse(4, 0, 9, 8, col, C.ink, 1.4), ellipse(-5, 0, 6.5, 6, col, C.ink, 1.4), circle(-2, 0, 2.6, C.ink, null)),
  rect(-34, -1.6, 28, 3.2, WOOD2, 1, C.ink, 1), rect(-39, -2.6, 6, 5.2, C.dark, 1, C.ink, 0.8), line('M-33 0 L8 0', '#e9e2c9', 0.6));
const violin = (col: string = '#a8612a') => all(path('M-8 -4 C-8 -7 -3 -7 -2 -4 C-1 -6 3 -6 4 -4 C7 -7 10 -5 10 0 C10 5 7 7 4 4 C3 6 -1 6 -2 4 C-3 7 -8 7 -8 4 C-10 2 -10 -2 -8 -4 Z', col, C.ink, 1.2), rect(9, -1.2, 14, 2.4, C.dark, 1, null), circle(24, 0, 1.8, C.dark, null));
const bowStick = (x1: number, y1: number, x2: number, y2: number) => line(`M${x1} ${y1} L${x2} ${y2}`, '#6b4220', 1.4);
const cello = (col: string = '#9a5426') => all(path('M0 -18 C6 -18 7 -12 4 -9 C9 -6 10 4 6 10 C4 16 -4 16 -6 10 C-10 4 -9 -6 -4 -9 C-7 -12 -6 -18 0 -18 Z', col, C.ink, 1.3), rect(-1, -36, 2.4, 18, C.dark, 1, null), line('M0 16 L0 22', C.ink, 1.4));
const bass = (col: string = '#9a5426') => all(path('M0 -22 C8 -22 9 -14 5 -11 C11 -7 12 6 7 13 C4 20 -4 20 -7 13 C-12 6 -11 -7 -5 -11 C-9 -14 -8 -22 0 -22 Z', col, C.ink, 1.4), rect(-1.4, -50, 2.8, 28, C.dark, 1, null), path('M-2 -54 L2 -54 L2 -50 L-2 -50 Z', C.dark, null), line('M0 20 L0 27', C.ink, 1.6));
const trumpet = (col: string = BRASS) => all(rect(-14, -1.6, 20, 3.2, col, 1, C.ink, 0.9), path('M6 -2 L14 -6 L14 6 L6 2 Z', col, C.ink, 1), rect(-8, -6, 7, 4, 'none', 1.5, col, 1.6), line('M-6 -5 L-6 -2 M-3.5 -5 L-3.5 -2', C.ink, 1), rect(-17, -1, 3, 2, C.dark, 0.5, null));
const sax = (col: string = BRASS) => all(path('M0 -22 L2 -22 L3 4 C4 12 12 12 13 4 L12 -2 L17 -4 L17 0 C17 14 0 18 -1 4 Z', col, C.ink, 1.2), path('M0 -22 C-2 -26 -6 -27 -8 -25', 'none', C.ink, 1.6), ...[-14, -8, -2].map((y) => circle(1.6, y, 1.1, C.ink, null)));
const mic = (col: string = C.dark) => all(rect(-1.6, 0, 3.2, 10, col, 1, C.ink, 0.8), circle(0, -2, 3.4, C.silver, C.ink, 1));
/** Microphone on a stand, foot at (x, y), mic at height h. */
const micStand = (x: number, y: number, h = 50) => all(line(`M${x} ${y} L${x} ${y - h}`, C.dark, 2), line(`M${x - 8} ${y} L${x + 8} ${y}`, C.dark, 2.4), circle(x, y - h - 3, 3.2, C.silver, C.ink, 1));
/** Drum kit, bass drum centred at (x, y). */
const drums = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 13, col, C.ink, 1.6), circle(0, 0, 9, WHITE, C.ink, 1), rect(14, -12, 14, 7, col, 2, C.ink, 1.2), line('M21 -5 L21 12', C.dark, 1.6), line('M-18 -22 L-6 -20', GOLD, 2.4), line('M-12 -21 L-12 12', C.dark, 1.4), rect(-24, -12, 12, 6, col, 2, C.ink, 1.2));
/** Grand piano seen from the side, keyboard end at (x, y) (top of keys), facing left. */
const grand = (x: number, y: number, s = 1, col: string = C.black) => at(x, y, s, path('M0 0 L46 0 C52 0 54 -6 50 -10 L28 -12 L0 -10 Z', col, C.ink, 1.6), path('M2 -10 L40 -30 L44 -26 L8 -10 Z', col, C.ink, 1.4), rect(-4, -2, 6, 4, WHITE, 0.5, C.ink, 0.8), line('M4 0 L4 22 M42 0 L42 22', col, 2.6), line('M20 0 L20 18', col, 2));
const keys = (x: number, y: number, w: number, h = 8) => all(rect(x, y, w, h, WHITE, 1, C.ink, 1.2), line(range(Math.floor(w / 4)).map((i) => `M${x + 4 + i * 4} ${y} L${x + 4 + i * 4} ${y + h}`).join(' '), C.ink, 0.5), ...range(Math.floor(w / 4) - 1).filter((i) => i % 7 !== 2 && i % 7 !== 6).map((i) => rect(x + 3 + i * 4, y, 2.2, h * 0.6, C.ink, 0.3, null)));
const stand = (x: number, y: number, col: string = C.dark) => all(line(`M${x} ${y} L${x} ${y - 22}`, col, 1.6), rect(x - 7, y - 30, 14, 9, col, 1, C.ink, 0.8));
const speaker = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.black, 2, C.ink, 1.4), circle(x + w / 2, y + h * 0.66, Math.min(w, h) * 0.3, '#4a4a56', C.ink, 1), circle(x + w / 2, y + h * 0.25, Math.min(w, h) * 0.13, '#4a4a56', C.ink, 0.8));
const amp = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.black, 2, C.ink, 1.4), rect(x + 2, y + 2, w - 4, 5, GOLD, 1, null), rect(x + 3, y + 9, w - 6, h - 12, '#3d3d48', 1, null), line(range(Math.floor((h - 12) / 3)).map((i) => `M${x + 3} ${y + 10 + i * 3} L${x + w - 3} ${y + 10 + i * 3}`).join(' '), '#555564', 0.8));
/** Vinyl record centred at (x, y). */
const record = (x: number, y: number, r: number, label: string = C.red) => all(circle(x, y, r, C.black, C.ink, 1.2), circle(x, y, r * 0.7, 'none', '#4a4a56', 0.8), circle(x, y, r * 0.5, 'none', '#4a4a56', 0.8), circle(x, y, r * 0.3, label, null), circle(x, y, 1, C.ink, null));
const laptop = (x: number, y: number, s = 1, scr: Svg = '', bg: string = '#1f2533') => at(x, y, s, rect(-24, -34, 48, 30, C.dark, 3, C.ink, 1.6), rect(-21, -31, 42, 24, bg, 1, null), scr, path('M-30 0 L30 0 L26 -5 L-26 -5 Z', C.silver, C.ink, 1.4));
const mug = (x: number, y: number, col: string = C.white) => all(path(`M${x - 4} ${y - 8} L${x + 4} ${y - 8} L${x + 4} ${y} L${x - 4} ${y} Z`, col, C.ink, 1.1), path(`M${x + 4} ${y - 6} C${x + 7} ${y - 6} ${x + 7} ${y - 2} ${x + 4} ${y - 2}`, 'none', C.ink, 1));
const chair = (x: number, y: number, col: string = WOOD) => all(line(`M${x - 8} ${y} L${x - 8} ${y - 14} M${x + 8} ${y} L${x + 8} ${y - 14}`, col, 2), rect(x - 10, y - 16, 20, 3, col, 1, C.ink, 1));
const table = (x: number, y: number, w = 22) => all(ellipse(x, y, w / 2, 2.6, WOOD, C.ink, 1.2), line(`M${x} ${y} L${x} 112`, WOOD2, 2.4), line(`M${x - 6} 112 L${x + 6} 112`, WOOD2, 2));
const candle = (x: number, y: number) => all(rect(x - 1.4, y - 6, 2.8, 6, WHITE, 0.5, C.ink, 0.7), path(`M${x} ${y - 11} C${x + 2} ${y - 8} ${x + 1.4} ${y - 6} ${x} ${y - 6} C${x - 1.4} ${y - 6} ${x - 2} ${y - 8} ${x} ${y - 11} Z`, C.yellow, C.orange, 0.7));
const brick = (x: number, y: number, w: number, h: number, col = '#b5654a') => all(rect(x, y, w, h, col, 0, null), line(range(Math.floor(h / 6)).map((i) => `M${x} ${y + 6 + i * 6} L${x + w} ${y + 6 + i * 6}`).join(' ') + range(Math.floor(h / 6) + 1).flatMap((i) => range(Math.floor(w / 12) + 1).map((j) => `M${x + j * 12 + (i % 2) * 6} ${y + i * 6} L${x + j * 12 + (i % 2) * 6} ${y + i * 6 + 6}`)).join(' '), '#8e4a36', 0.7));
/** Sound waves (arcs) to the right of (x, y). */
const waves = (x: number, y: number, n = 3, col: string = HL, gap = 6, dir = 1) => all(...range(n).map((i) => { const r = (i + 1) * gap; return line(`M${f1(x + dir * r * 0.5)} ${f1(y - r * 0.87)} A${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${f1(x + dir * r * 0.5)} ${f1(y + r * 0.87)}`, col, 2); }));
/** Waveform bars from x, centre line y. */
const wave = (x: number, y: number, hs: number[], col: string = HL, w = 2.4, gap = 3.6) => all(...hs.map((h, i) => rect(f1(x + i * gap), f1(y - h / 2), w, h, col, 0.8, null)));
const birch = (x: number, y: number, h = 60) => all(rect(x - 2.4, y - h, 4.8, h, BIRCH, 1, C.ink, 1), line(range(5).map((i) => `M${x - 2.4} ${y - h * (0.15 + i * 0.18)} l3 1`).join(' '), C.ink, 1.2), circle(x, y - h - 4, 14, LEAF, C.ink, 1.2), circle(x - 9, y - h + 6, 9, LEAF, C.ink, 1.2), circle(x + 9, y - h + 6, 9, LEAF, C.ink, 1.2));
const cottage = (x: number, y: number, w: number, h: number, col: string = FALU) => all(rect(x, y - h, w, h, col, 0, C.ink, 1.4), path(`M${x - 3} ${y - h} L${x + w / 2} ${y - h - w * 0.35} L${x + w + 3} ${y - h} Z`, C.dark, C.ink, 1.4), rect(x + w * 0.2, y - h * 0.65, w * 0.22, h * 0.3, WHITE, 0.5, C.ink, 1), rect(x + w * 0.6, y - h * 0.62, w * 0.2, h * 0.62, WHITE, 0.5, C.ink, 1));
const cow = (x: number, y: number, s = 1, col: string = '#8b5a3c') => at(x, y, s, ellipse(0, -8, 12, 6, col, C.ink, 1.2), path('M10 -11 L17 -13 L18 -7 L11 -5 Z', col, C.ink, 1.1), line('M-8 -3 L-8 3 M-3 -3 L-3 3 M4 -3 L4 3 M8 -3 L8 3', C.ink, 1.6), path('M15 -13 L16 -16 M12 -12 L12 -15', 'none', C.ink, 1), ellipse(-2, -9, 3, 2, WHITE, null));
const goat = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -7, 8, 4.4, WHITE, C.ink, 1.1), path('M6 -9 L11 -13 L13 -9 L8 -6 Z', WHITE, C.ink, 1), line('M-5 -3 L-5 2 M-1 -3 L-1 2 M3 -3 L3 2 M6 -3 L6 2', C.ink, 1.3), path('M11 -13 L9 -17', 'none', C.ink, 1.2));
/** Folk costume pieces for fig(): black vest, white shirt, red/blue knee breeches. */
const FOLK = { top: WHITE, bottom: '#c33a2e', vest: C.black } as const;
/** Film screen. */
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '', bg: string = '#cfe8f7') => all(rect(x - 2, y - 2, w + 4, h + 4, C.dark, 1, C.ink, 1.4), rect(x, y, w, h, bg, 0, null), inner);
const hero = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-5 -14 L5 -14 L9 4 L-9 4 Z', col, C.ink, 1), rect(-3, -14, 6, 12, C.navy, 1, C.ink, 0.8), circle(0, -18, 4, C.skin, C.ink, 0.8), line('M-2 -2 L-3 6 M2 -2 L3 6', C.ink, 1.6));
const thoughtNotes = (x: number, y: number) => all(ellipse(x, y, 16, 11, WHITE, C.ink, 1.4), circle(x - 10, y + 14, 2.6, WHITE, C.ink, 1), circle(x - 14, y + 19, 1.6, WHITE, C.ink, 1), notes([[x - 6, y + 1, 0.8], [x + 6, y + 1, 0.8]], C.navy));

// ── Pieces of scenes ─────────────────────────────────────────────────
/** Seated string player (violin under the chin), feet on y. */
const fiddler = (x: number, y: number, h: number, top: string, more: Partial<Fig> = {}) => fig({ x, y, h, top, legs: 'sit', mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]],
  front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40)), ...more });
/** Orchestra seen from the hall: rows of small seated players with bows and music stands. */
const orchestra = (y: number, rows = 3, colA: string = C.black) => all(...range(rows).flatMap((r) => range(7 - r).map((i) => {
  const x = 16 + r * 7 + i * 15, yy = y - r * 13;
  return all(circle(x, yy - 9, 3.4, C.skin, C.ink, 0.8), path(`M${x - 5} ${yy} C${x - 5} ${yy - 7} ${x + 5} ${yy - 7} ${x + 5} ${yy} Z`, colA, null), line(`M${x - 6} ${yy - 8} L${x + 6} ${yy - 4}`, '#6b4220', 1), rect(x - 4, yy - 4, 8, 3, WHITE, 0.5, null));
})));
const conductor = (x: number, y: number) => all(fig({ x, y, h: 0.6, top: C.black, bottom: C.black, l: [[-13, -38], [-22, -50], [-26, -62]], r: [[13, -38], [22, -52], [28, -66]], front: line('M28 -66 L40 -78', WHITE, 1.6) }));
const curtains = (col: string = CURTAIN) => all(path('M4 4 L22 4 C18 30 20 60 14 112 L4 112 Z M116 4 L98 4 C102 30 100 60 106 112 L116 112 Z', col, C.ink, 1.4), rect(4, 4, 112, 7, '#9c2630', 1, C.ink, 1.2));
const stageFloor = (y: number) => rect(4, y, 112, 112 - y, WOOD, 0, C.ink, 1.2);
/** Stage with a few lamps above. */
const stageBox = (y = 90, bg: string = STAGE) => all(dark(bg), stageFloor(y), lamp(30, 10), lamp(60, 10), lamp(90, 10));

export const MUSG_MOTIFS: Record<string, Svg> = {
  // ── 4431 Klassisk musik ──────────────────────────────────────────
  'musg.klassisk-musik': all(rect(4, 4, 112, 108, '#f3e9d6', 4, null), rect(36, 10, 36, 30, GOLD, 2, C.ink, 1.4), rect(39, 13, 30, 24, '#e9e2cf', 1, null), staff(42, 18, 24, 3, C.ink), head(47, 24.8), head(53, 21.4), head(59, 28.2), head(64, 18),
    grand(36, 78, 1.2), at(72, 52, 1.1, rect(-7, -3, 14, 5, '#d8d0bf', 1, C.ink, 1), path('M-11 -3 C-11 -11 11 -11 11 -3 Z', '#efe9dc', C.ink, 1.2), rect(-2.4, -12, 4.8, 4, '#efe9dc', 1, C.ink, 0.8), circle(0, -17, 6, '#efe9dc', C.ink, 1.2), path('M-7 -16 C-8 -26 8 -26 7 -16', 'none', '#d8d0bf', 2.4), ...[-1, 1].flatMap((d) => [circle(d * 7.4, -15, 2.4, '#efe9dc', C.ink, 0.8), circle(d * 7.6, -10.6, 2.2, '#efe9dc', C.ink, 0.8)]), circle(-2.2, -17.4, 0.7, C.grey, null), circle(2.2, -17.4, 0.7, C.grey, null)),
    rot(100, 82, -75, violin()), bowStick(90, 106, 112, 60), ground(), notes([[16, 30, 0.9], [102, 26, 0.8], [20, 56, 0.7]], C.navy)),
  'musg.musiker': all(ground(), fig({ x: 24, h: 0.8, top: C.black, mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]], front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40)) }),
    fig({ x: 60, h: 0.8, top: C.green, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar()) }),
    fig({ x: 96, h: 0.8, top: C.navy, l: [[-13, -38], [-14, -44], [-6, -50]], r: [[13, -38], [12, -48], [4, -52]], front: rot(4, -52, -10, trumpet()) }), notes([[40, 18, 0.8], [80, 14, 0.8]], HL)),
  'musg.kompositör': all(rect(4, 4, 112, 108, '#f3ead9', 4, null), keys(70, 46, 40, 10), rect(68, 56, 44, 20, C.black, 1, C.ink, 1.4), line('M72 76 L72 110 M108 76 L108 110', C.black, 2.6),
    fig({ x: 40, h: 0.95, top: C.navy, legs: 'sit', y: 104, mood: 'calm', l: [[-13, -38], [-10, -22], [0, -12]], r: [[13, -38], [22, -24], [30, -16]], front: line('M30 -16 L36 -26', C.ink, 1.6) }),
    rect(8, 82, 60, 6, WOOD, 1, C.ink, 1.4), line('M14 88 L14 110 M62 88 L62 110', WOOD2, 2.6), rect(26, 74, 30, 9, WHITE, 1, C.ink, 1), staff(28, 76, 26, 1.4, C.ink), head(34, 78, C.ink, 0.6), head(40, 76.6, C.ink, 0.6), head(46, 79.4, C.ink, 0.6), thoughtNotes(26, 22), ground()),
  'musg.symfoni': all(dark('#3b2a2a'), stageFloor(96), orchestra(92, 3), conductor(60, 112), rect(18, 8, 84, 14, '#f3ead9', 2, C.ink, 1.2), ...range(4).map((i) => all(rect(22 + i * 20, 11, 16, 8, i === 0 ? HL : '#e3c58c', 1.5, C.ink, 0.8))), frame(16, 6, 88, 18)),
  'musg.opera': all(dark('#3a2230'), stageFloor(88), curtains(), rect(26, 30, 68, 58, '#5a6f8a', 0, null), path('M30 88 L40 52 L50 88 Z M70 88 L82 46 L94 88 Z', '#4b5d74', null),
    fig({ x: 48, y: 96, h: 0.82, gown: PURPLE, top: PURPLE, long: true, hair: '#c98b4a', crown: true, mood: 'sing', l: [[-13, -38], [-26, -50], [-34, -62]], r: [[13, -38], [26, -50], [34, -62]] }),
    fig({ x: 80, y: 96, h: 0.78, top: '#2f6b4a', bottom: C.black, mood: 'sing', l: [[-13, -38], [-20, -30], [-24, -20]], r: [[13, -38], [16, -22], [14, -6]], cap: '#7a2a2a' }), heads(104, [20, 36, 52, 68, 84, 100], '#1d1d26'), notes([[30, 30, 0.7], [64, 24, 0.7]], GOLD)),
  'musg.kammarmusik': all(rect(4, 4, 112, 108, '#efe3c8', 4, null), line(range(9).map((i) => `M${10 + i * 12} 4 L${10 + i * 12} 70`).join(' '), '#e2d2ad', 3), rect(46, 14, 28, 34, '#cfe8f7', 1, C.ink, 1.4), line('M60 14 L60 48 M46 31 L74 31', C.ink, 1.2), rect(4, 70, 112, 42, '#a3734a', 0, null),
    fiddler(18, 104, 0.62, C.black), fiddler(42, 104, 0.62, C.navy, { long: true }), fiddler(66, 104, 0.62, C.black),
    fig({ x: 92, y: 104, h: 0.62, legs: 'sit', top: '#7a2a2a', mood: 'calm', l: [[-13, -38], [-6, -30], [2, -36]], r: [[13, -38], [18, -14], [8, -8]], held: at(4, -12, 0.9, cello()) }), frame(8, 54, 104, 54)),
  'musg.kyrkomusik': all(rect(4, 4, 112, 108, '#ece7dd', 4, null), path('M44 60 L44 26 C44 8 76 8 76 26 L76 60 Z', '#b9d6ea', C.ink, 1.4), line('M60 12 L60 60 M44 34 L76 34', C.ink, 1),
    ...range(9).map((i) => rect(10 + i * 4, 24 + Math.abs(4 - i) * 3, 3, 46 - Math.abs(4 - i) * 3, C.silver, 1, C.ink, 0.7)), ...range(9).map((i) => rect(78 + i * 4, 24 + Math.abs(4 - i) * 3, 3, 46 - Math.abs(4 - i) * 3, C.silver, 1, C.ink, 0.7)),
    rect(8, 68, 104, 8, WOOD2, 1, C.ink, 1.2), ...[24, 48, 72, 96].map((x, i) => fig({ x, h: 0.6, gown: i % 2 ? '#7a2a2a' : '#2f4a7a', top: i % 2 ? '#7a2a2a' : '#2f4a7a', scarf: WHITE, long: i % 2 === 0, mood: 'sing', l: [[-13, -38], [-10, -24], [-4, -20]], r: [[13, -38], [10, -24], [4, -20]], front: rect(-8, -26, 16, 10, C.dark, 1, C.ink, 0.8) })),
    notes([[30, 50, 0.7], [90, 50, 0.7]], GOLD), ground()),
  'musg.solist': all(dark('#2b2b38'), stageFloor(94), greyed(orchestra(90, 2)), spot(60, 4, 60, 112),
    fig({ x: 60, h: 0.95, top: '#c8372d', gown: '#c8372d', long: true, mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]], front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40)) }), ring(60, 64, 34)),
  'musg.konserthus': all(rect(4, 4, 112, 108, '#dbeaf5', 4, null), rect(14, 30, 92, 70, '#3f6fb5', 0, C.ink, 1.6), rect(10, 24, 100, 8, '#335d99', 1, C.ink, 1.4), ...range(8).map((i) => all(rect(20 + i * 11, 38, 6, 56, '#e9eef5', 1, C.ink, 1), rect(18.5 + i * 11, 36, 9, 3, '#e9eef5', 0.5, C.ink, 0.8))),
    rect(10, 96, 100, 5, '#c9c4b8', 0, C.ink, 1), rect(6, 101, 108, 5, '#bdb7aa', 0, C.ink, 1), rect(2, 106, 116, 6, '#b0aa9c', 0, C.ink, 1), line('M30 24 L30 10 M90 24 L90 10', C.dark, 1.4), path('M30 10 L42 13 L30 16 Z M90 10 L102 13 L90 16 Z', HL, C.ink, 0.8), note(60, 14, 0.9, GOLD)),
  'musg.frack': all(rect(4, 4, 112, 108, '#f2efe8', 4, null), fig({ x: 60, h: 1.1, top: C.black, bottom: '#4a4a56', mood: 'smile',
    held: all(path('M-12 -2 L-26 40 L-17 43 L-5 4 Z M12 -2 L26 40 L17 43 L5 4 Z', C.black, C.ink, 1.6), path('M-7 -42 L0 -14 L7 -42 Z', WHITE, C.ink, 1), path('M-5 -18 L5 -18 L4 -10 L-4 -10 Z', WHITE, C.ink, 0.8), circle(0, -30, 0.9, C.ink, null), circle(0, -24, 0.9, C.ink, null), path('M-5 -43 L0 -41 L5 -43 L5 -38.6 L0 -40.6 L-5 -38.6 Z', WHITE, C.ink, 0.9)) }), ring(60, 70, 42), ground()),
  // ── 4432 Jazz och blues ──────────────────────────────────────────
  'musg.blues': all(dark('#1f2f4f'), rect(80, 14, 26, 30, '#2c4570', 1, C.ink, 1.2), circle(96, 24, 5, '#f2e6b4', null), line('M93 14 L93 44 M80 29 L106 29', C.ink, 1), spot(46, 4, 66, 112, 'rgba(140,199,232,0.25)'), chair(46, 112, WOOD2),
    fig({ x: 46, y: 106, h: 0.95, legs: 'sit', top: '#3a5a8c', bottom: C.dark, mood: 'sad', hat: C.dark, l: [[-13, -38], [-22, -24], [-24, -20]], r: [[13, -38], [10, -22], [4, -14]], held: rot(4, -12, -24, guitar()) }),
    notes([[78, 58, 0.8], [90, 70, 0.7], [102, 60, 0.7]], '#8cc7e8')),
  'musg.storband': all(dark('#3a2d22'), stageFloor(98), ...[18, 42, 66, 90].map((x) => all(fig({ x, y: 98, h: 0.42, top: '#c8372d', legs: 'sit', l: [[-13, -38], [-8, -24], [-2, -18]], r: [[13, -38], [10, -26], [4, -22]], front: at(2, -16, 0.9, sax()) }))),
    ...[30, 54, 78, 102].map((x) => fig({ x, y: 72, h: 0.38, top: C.black, l: [[-13, -38], [-14, -44], [-6, -50]], r: [[13, -38], [12, -48], [4, -52]], front: rot(4, -52, -22, trumpet()) })),
    ...[18, 42, 66, 90].map((x) => all(rect(x - 9, 84, 18, 12, '#c8372d', 1, C.ink, 1), note(x, 90, 0.4, GOLD))), notes([[20, 20, 0.7], [100, 18, 0.7]], GOLD)),
  'musg.trio': all(dark('#2f2a3a'), stageFloor(92), grand(10, 78, 0.6), fig({ x: 18, y: 100, h: 0.56, legs: 'sit', top: C.navy, mood: 'calm', l: [[-13, -38], [-4, -30], [10, -28]], r: [[13, -38], [18, -32], [22, -30]] }),
    at(62, 96, 1, bass()), fig({ x: 70, y: 104, h: 0.62, top: C.green, l: [[-13, -38], [-20, -28], [-16, -16]], r: [[13, -38], [16, -54], [6, -68]] }),
    drums(98, 98, 0.7), fig({ x: 104, y: 90, h: 0.48, legs: 'sit', top: '#7a2a2a', l: [[-13, -38], [-22, -30], [-30, -24]], r: [[13, -38], [16, -30], [10, -22]] }),
    ...[20, 62, 100].map((x) => ring(x, 70, 15))),
  'musg.jazzklubb': all(brick(4, 4, 112, 108), rect(4, 4, 112, 108, 'rgba(20,16,30,0.45)', 4, null), rect(70, 50, 46, 10, WOOD, 1, C.ink, 1.2), spot(92, 4, 34, 60),
    fig({ x: 92, y: 52, h: 0.52, top: C.dark, mood: 'calm', l: [[-13, -38], [-8, -24], [-2, -18]], r: [[13, -38], [10, -26], [4, -22]], front: at(2, -16, 0.9, sax()) }),
    table(26, 86), candle(26, 84), table(60, 92), candle(60, 90), heads(96, [16, 36], '#6a5c7a'), heads(102, [52, 70], '#6a5c7a'), rect(4, 4, 34, 40, '#2a1f2a', 2, null), ...range(4).map((i) => rect(8 + i * 7, 12, 4, 10, ['#3d8a5a', '#c8372d', GOLD, '#8cc7e8'][i]!, 1, null)), rect(6, 26, 30, 3, WOOD, 0.5, null)),
  'musg.jamma': all(rect(4, 4, 112, 108, '#f2e7d4', 4, null), rect(4, 80, 112, 32, '#c49a6c', 0, null), ellipse(60, 104, 50, 7, '#d65b4a', C.ink, 1), rect(6, 56, 30, 30, '#5a7fa8', 6, C.ink, 1.4),
    fig({ x: 22, y: 100, h: 0.62, legs: 'sit', top: C.green, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar()) }),
    fig({ x: 60, y: 108, h: 0.62, legs: 'sit', top: C.orange, long: true, mood: 'laugh', l: [[-13, -38], [-10, -22], [-6, -12]], r: [[13, -38], [10, -22], [6, -12]], front: all(rect(-12, -12, 10, 14, '#c49a6c', 2, C.ink, 1), rect(2, -12, 10, 14, '#c49a6c', 2, C.ink, 1), ellipse(-7, -12, 5, 1.6, '#f3e0c0', C.ink, 0.8), ellipse(7, -12, 5, 1.6, '#f3e0c0', C.ink, 0.8)) }),
    keys(80, 76, 32, 8), line('M84 84 L84 104 M108 84 L108 104', C.dark, 2), fig({ x: 96, y: 112, h: 0.62, top: PURPLE, mood: 'laugh', l: [[-13, -38], [-12, -22], [-8, -30]], r: [[13, -38], [12, -22], [8, -30]] }), mug(44, 104), mug(78, 108, '#e6c76a'),
    waSpin('musg-jamma', 6, notes([[40, 24, 0.9], [60, 14, 0.8], [80, 26, 0.9]], HL))),
  'musg.gospel': all(rect(4, 4, 112, 108, '#f4ead8', 4, null), path('M46 54 L46 24 C46 8 74 8 74 24 L74 54 Z', '#f2c14e', C.ink, 1.4), line('M60 10 L60 54 M46 30 L74 30', C.ink, 1), sparkle(30, 20, 5), sparkle(92, 22, 5),
    ...[18, 46, 74, 102].map((x, i) => fig({ x, h: 0.66, gown: PURPLE, top: PURPLE, scarf: GOLD, long: i % 2 === 1, mood: 'sing', skin: i % 2 ? C.skin2 : '#8d5a3b', l: [[-13, -38], [-20, -54], [-18, -68]], r: [[13, -38], [20, -54], [18, -68]] })),
    notes([[34, 38, 0.8], [60, 64, 0.8], [88, 40, 0.8]], HL), ground()),

  // ── 4433 Rock och pop ────────────────────────────────────────────
  'musg.band': all(stageBox(92), drums(60, 84, 0.8), fig({ x: 60, y: 76, h: 0.5, top: C.dark, legs: 'sit', l: [[-13, -38], [-22, -26], [-26, -18]], r: [[13, -38], [22, -26], [26, -18]] }),
    fig({ x: 22, h: 0.8, top: C.green, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar(C.red, true)) }),
    fig({ x: 98, h: 0.8, top: C.navy, long: true, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar(C.dark, true)) }),
    micStand(60, 112, 40), fig({ x: 60, h: 0.82, top: '#e9a23b', mood: 'sing', l: [[-13, -38], [-6, -40], [0, -44]], r: [[13, -38], [20, -30], [22, -22]] }), frame(8, 18, 104, 92)),
  'musg.sångare': all(dark('#2f2a3a'), stageFloor(96), greyed(fig({ x: 18, h: 0.66, top: C.green, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar(C.red, true)) }), drums(100, 96, 0.7)),
    spot(60, 4, 50, 112), fig({ x: 60, h: 0.95, top: '#e9a23b', mood: 'sing', l: [[-13, -38], [-6, -44], [-2, -50]], r: [[13, -38], [26, -46], [34, -58]], front: at(-2, -52, 1, mic()) }), notes([[84, 28, 1], [96, 40, 0.9]], HL), ring(60, 62, 30)),
  'musg.artist': all(dark('#1f1d33'), ...[-1, 1].map((d) => path(`M${60 + d * 48} 4 L${60 + d * 40} 4 L60 66 Z`, 'rgba(255,236,150,0.3)', null)), stageFloor(70), star(60, 76, 6, GOLD),
    fig({ x: 60, y: 72, h: 0.62, top: C.white, bottom: '#c8372d', mood: 'laugh', l: [[-13, -38], [-24, -54], [-28, -66]], r: [[13, -38], [22, -46], [28, -52]], front: at(28, -54, 1, mic()) }),
    heads(92, [12, 28, 44, 76, 92, 108], '#4a4a66'), heads(102, [20, 36, 52, 68, 84, 100], '#3a3a56'), ...[16, 40, 64, 88, 104].map((x, i) => rect(x, 82 - (i % 2) * 4, 3, 5, '#fff6b0', 0.5, null))),
  'musg.rock': all(dark('#2a1a1a'), amp(76, 34, 34, 30), amp(76, 64, 34, 30), stageFloor(94), ...[[20, 20], [100, 14], [30, 50]].map(([x, y]) => path(`M${x} ${y} L${x! + 5} ${y! + 8} L${x! + 1} ${y! + 8} L${x! + 6} ${y! + 18}`, 'none', C.yellow, 2)),
    fig({ x: 46, y: 104, h: 0.9, top: C.black, bottom: '#3d3f4a', long: true, hair: '#2a2020', mood: 'shout', l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [20, -50], [24, -60]], held: rot(0, -14, -24, guitar(C.red, true)) })),
  'musg.pop': all(rect(4, 4, 112, 108, '#ffd9ec', 4, null), ...range(6).map((i) => circle(14 + i * 18, 14 + (i % 2) * 8, 4, ['#ff7ab0', '#ffd23f', '#5bc0eb', '#9bdf6b'][i % 4]!, null)), heart(20, 40, 0.8, '#ff5c9a'), heart(100, 44, 0.8, '#ff5c9a'), star(30, 64, 5, '#ffd23f'), star(92, 70, 5, '#ffd23f'), stageFloor(96),
    greyed(fig({ x: 20, y: 104, h: 0.55, top: C.pink, l: [[-13, -38], [-24, -50], [-28, -60]], r: [[13, -38], [22, -30], [26, -36]] }), fig({ x: 100, y: 104, h: 0.55, top: C.pink, l: [[-13, -38], [-22, -30], [-26, -36]], r: [[13, -38], [24, -50], [28, -60]] })),
    fig({ x: 60, y: 104, h: 0.85, top: '#ff5c9a', skirt: '#5bc0eb', long: true, hair: '#f0cf6b', mood: 'sing', l: [[-13, -38], [-26, -50], [-32, -62]], r: [[13, -38], [24, -30], [30, -36]], front: path('M-10 -56 C-12 -48 -6 -46 -2 -48', 'none', C.dark, 1.4) })),
  'musg.album': all(rect(4, 4, 112, 108, '#efe9f5', 4, null), record(78, 54, 30), rect(10, 20, 64, 68, '#2f6b8a', 2, C.ink, 1.6), circle(42, 46, 14, '#f2c14e', C.ink, 1.2), path('M10 70 L30 56 L44 66 L58 52 L74 66 L74 88 L10 88 Z', '#e4572e', C.ink, 1.2),
    rect(10, 92, 100, 16, WHITE, 2, C.ink, 1.2), line(range(6).map((i) => `M${14 + (i % 3) * 32} ${97 + Math.floor(i / 3) * 6} L${36 + (i % 3) * 32} ${97 + Math.floor(i / 3) * 6}`).join(' '), C.grey, 1.4)),
  'musg.coverlåt': all(rect(4, 4, 112, 108, '#f5f2ec', 4, null), greyed(fig({ x: 22, h: 0.7, top: C.dark, mood: 'sing', l: [[-13, -38], [-6, -44], [-2, -50]], r: [[13, -38], [20, -28], [24, -20]], front: at(-2, -52, 1, mic()) }), record(22, 24, 12)),
    rect(6, 46, 34, 18, WHITE, 2, C.grey, 1), ...[[12, 58], [18, 54], [24, 50], [30, 56]].map(([x, y]) => head(x!, y!, C.grey, 0.9)), arrow(44, 56, 66, 56),
    fig({ x: 96, h: 0.78, top: '#e9a23b', long: true, mood: 'sing', l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar()) }), rect(70, 46, 34, 18, WHITE, 2, HL, 1.6), ...[[76, 58], [82, 54], [88, 50], [94, 56]].map(([x, y]) => head(x!, y!, HL, 0.9))),
  'musg.spelning': all(rect(4, 4, 112, 108, '#4a3426', 4, null), path('M4 14 C30 22 60 22 116 12', 'none', C.ink, 0.8), ...range(8).map((i) => circle(10 + i * 14, 16 + Math.sin(i) * 2, 2.2, '#ffe28a', null)), rect(4, 76, 56, 6, WOOD, 1, C.ink, 1.2),
    fig({ x: 18, y: 76, h: 0.5, top: C.green, l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: rot(0, -14, -20, guitar(C.red, true)) }), micStand(40, 76, 24), fig({ x: 40, y: 76, h: 0.52, top: '#e9a23b', mood: 'sing', l: [[-13, -38], [-6, -40], [0, -44]], r: [[13, -38], [20, -30], [22, -22]] }),
    rect(66, 70, 50, 8, WOOD2, 1, C.ink, 1.2), ...[74, 90, 106].map((x) => all(rect(x - 3, 62, 6, 8, '#f2c14e', 1, C.ink, 0.8), rect(x - 3, 62, 6, 2, WHITE, 0.5, null))), heads(96, [14, 32, 52], '#8a7a6a'), heads(104, [76, 96], '#8a7a6a'), ground(112, '#3a281e')),
  'musg.turné': all(rect(4, 4, 112, 108, '#dceaf3', 4, null), rect(10, 8, 100, 46, '#f3ead9', 2, C.ink, 1.2), path('M22 44 C34 22 52 40 62 24 C72 12 86 34 98 18', 'none', HL, 2, ), ...[[22, 44], [44, 32], [62, 24], [80, 26], [98, 18]].map(([x, y]) => all(circle(x!, y!, 3.4, HL, C.ink, 1), star(x!, y! - 7, 3, GOLD))),
    rect(4, 98, 112, 14, '#8d949c', 0, null), line('M8 105 L20 105 M32 105 L44 105 M56 105 L68 105 M80 105 L92 105 M104 105 L112 105', WHITE, 2), rect(14, 64, 86, 32, '#5a3f8a', 4, C.ink, 1.6), ...range(5).map((i) => rect(20 + i * 14, 70, 10, 10, '#cfe8f7', 1, C.ink, 1)), rect(90, 70, 8, 16, '#cfe8f7', 1, C.ink, 1), circle(32, 96, 6, C.dark, C.ink, 1.4), circle(84, 96, 6, C.dark, C.ink, 1.4), note(56, 88, 0.6, GOLD)),
  'musg.fan': all(rect(4, 4, 112, 108, '#fff0f4', 4, null), fig({ x: 54, h: 0.88, top: C.black, long: true, hair: '#c98b4a', mood: 'laugh', l: [[-13, -38], [-22, -56], [-24, -70]], r: [[13, -38], [22, -56], [24, -70]],
    front: all(rect(-30, -94, 60, 26, WHITE, 2, C.ink, 1.4), heart(0, -80, 1, '#ff3d7f'), star(-6, -26, 5, '#ff3d7f')) }), heart(96, 60, 0.9, '#ff3d7f'), heart(104, 80, 0.6, '#ff3d7f'), heart(14, 70, 0.7, '#ff3d7f'), ground()),
  'musg.punk': all(rect(4, 4, 112, 108, '#e9ede2', 4, null), brick(4, 4, 112, 60, '#9a9f95'), fig({ x: 56, h: 1, top: C.black, bottom: '#3d4a6a', mohawk: '#3fd06b', mood: 'shout', l: [[-13, -38], [-20, -26], [-14, -18]], r: [[13, -38], [24, -46], [30, -58]],
    front: all(...[-8, -4, 0, 4, 8].map((dx) => circle(dx, -40, 1.1, C.silver, C.ink, 0.5)), path('M-10 -30 L-6 -24', 'none', C.silver, 1.6), circle(-10, -30, 1.4, 'none', C.silver, 1), ...[-12, -8].map((dy) => circle(-10, dy, 1, C.silver, null))) }), ground()),
  'musg.schlager': all(rect(4, 4, 112, 108, '#2a1f4a', 4, null), line('M60 4 L60 14', C.silver, 1), circle(60, 22, 9, C.silver, C.ink, 1.2), line('M52 18 L68 18 M51 22 L69 22 M52 26 L68 26 M56 14 L56 30 M64 14 L64 30', '#8b93a0', 0.8), ...range(10).map((i) => rect(10 + i * 10, 40 + (i * 37) % 30, 3, 3, ['#ffd23f', '#ff7ab0', '#5bc0eb'][i % 3]!, 0.5, null)), stageFloor(98), path('M60 98 L112 98 L112 112 L60 112 Z', 'rgba(255,255,255,0.12)', null),
    rect(92, 84, 18, 14, C.dark, 2, C.ink, 1.2), circle(101, 91, 5, C.silver, C.ink, 1), line('M90 72 L76 70 M90 80 L74 80 M90 88 L76 90', C.white, 1.4, '3 3'),
    fig({ x: 54, y: 104, h: 0.85, gown: '#d8c2f0', top: '#d8c2f0', long: true, hair: '#f0cf6b', mood: 'sing', l: [[-13, -38], [-24, -54], [-28, -68]], r: [[13, -38], [24, -54], [28, -68]], front: all(...range(8).map((i) => circle(-8 + (i % 4) * 5, -30 + Math.floor(i / 4) * 12, 1.4, WHITE, null))) }),
    path('M66 46 C74 44 78 48 84 46', 'none', '#f0cf6b', 3)),
  'musg.dansband': all(rect(4, 4, 112, 108, '#cfe8f7', 4, null), rect(4, 76, 112, 36, GRASS, 0, null), path('M8 22 L60 6 L112 22 Z', C.white, C.ink, 1.4), rect(10, 22, 100, 34, '#fbfbf8', 0, C.ink, 1.2), rect(8, 54, 104, 6, WOOD, 1, C.ink, 1.2),
    ...[30, 60, 90].map((x, i) => fig({ x, y: 54, h: 0.44, top: '#3f6fb5', bottom: '#3f6fb5', bow: WHITE, mood: 'laugh', l: [[-13, -38], [-22, -28], [-26, -24]], r: [[13, -38], [14, -24], [6, -16]], held: i === 1 ? '' : rot(0, -14, -20, guitar(C.white, true)) })),
    fig({ x: 48, h: 0.62, top: C.navy, mood: 'laugh', l: [[-13, -38], [-20, -26], [-16, -18]], r: [[13, -38], [22, -48], [34, -56]] }), fig({ x: 76, h: 0.6, skirt: '#c8372d', top: '#c8372d', long: true, mood: 'laugh', l: [[-13, -38], [-22, -48], [-28, -60]], r: [[13, -38], [20, -26], [16, -16]] }),
    notes([[20, 66, 0.7], [100, 66, 0.7]], HL)),
  'musg.slå-igenom': all(rect(4, 4, 112, 108, '#f5f2ec', 4, null), greyed(rect(6, 92, 26, 4, WOOD, 1, C.ink, 1), fig({ x: 19, y: 92, h: 0.32, top: '#e9a23b', mood: 'sing' }), heads(104, [12, 26], '#9aa3ad')), arrow(36, 84, 52, 66),
    rect(54, 64, 60, 5, WOOD, 1, C.ink, 1), spot(84, 4, 30, 64), fig({ x: 84, y: 64, h: 0.5, top: '#e9a23b', mood: 'laugh', l: [[-13, -38], [-22, -54], [-26, -66]], r: [[13, -38], [22, -54], [26, -66]] }), star(84, 12, 7, GOLD),
    waGrow('musg-slaigenom', heads(86, [58, 70, 82, 94, 106], '#6a7280'), heads(98, [52, 64, 76, 88, 100, 112], '#5a6270'), heads(108, [58, 70, 82, 94, 106], '#4a5260'))),

  // ── 4434 Elektronisk dansmusik ───────────────────────────────────
  'musg.dansmusik': all(rect(4, 4, 112, 108, '#2b2550', 4, null), speaker(8, 44, 24, 68), speaker(88, 44, 24, 68), waPulse('musg-dansmusik', waves(32, 70, 3, NEON, 6), waves(88, 70, 3, NEON, 6, -1)),
    ...range(8).map((i) => rect(36 + i * 6, 30 - [4, 10, 6, 14, 4, 10, 6, 14][i]!, 4, [4, 10, 6, 14, 4, 10, 6, 14][i]!, i % 4 === 3 ? HL : NEON, 0.5, null)),
    fig({ x: 50, h: 0.62, top: '#ff7ab0', long: true, mood: 'laugh', l: [[-13, -38], [-20, -54], [-14, -68]], r: [[13, -38], [22, -30], [26, -40]] }), fig({ x: 72, h: 0.64, top: '#ffd23f', mood: 'laugh', l: [[-13, -38], [-22, -30], [-26, -40]], r: [[13, -38], [20, -54], [14, -68]] })),
  'musg.dj': all(rect(4, 4, 112, 108, '#241f3f', 4, null), ...[-1, 1].map((d) => path(`M60 4 L${60 + d * 50} 70 L${60 + d * 36} 70 Z`, d < 0 ? 'rgba(91,224,208,0.25)' : 'rgba(255,122,176,0.25)', null)),
    fig({ x: 60, y: 104, h: 0.9, top: C.black, mood: 'laugh', phones: C.red, l: [[-13, -38], [-14, -24], [-20, -10]], r: [[13, -38], [22, -54], [24, -70]] }),
    rect(10, 80, 100, 32, '#3d3d48', 2, C.ink, 1.6), record(32, 90, 10), record(88, 90, 10), rect(52, 84, 16, 14, '#55556a', 1, C.ink, 1), ...range(3).map((i) => line(`M${55 + i * 5} 86 L${55 + i * 5} 96`, C.silver, 1)), ...range(3).map((i) => circle(55 + i * 5, 90 + (i % 2) * 3, 1.4, NEON, null))),
  'musg.mixa.2': all(rect(4, 4, 112, 108, '#2a2a3a', 4, null), rect(8, 40, 104, 64, '#3d3d48', 4, C.ink, 1.6), record(32, 70, 20, '#5bc0eb'), record(88, 70, 20, '#ff7ab0'),
    wave(12, 20, [6, 12, 8, 14, 6, 10], '#5bc0eb'), wave(78, 20, [8, 14, 6, 12, 10, 6], '#ff7ab0'), path('M36 20 C46 20 50 28 58 28 M76 20 C68 20 64 28 60 28', 'none', HL, 1.6), wave(52, 34, [4, 8, 6], HL),
    rect(46, 94, 28, 6, '#1e1e28', 2, null), moving('musg-mixa', '0%,100%{transform:translate(-8px,0)}50%{transform:translate(8px,0)}', { dur: 2.4 }, rect(56, 91, 8, 12, HL, 2, C.ink, 1)),
    waSpin('musg-mixa-a', 3, record(32, 70, 20, '#5bc0eb')), waSpin('musg-mixa-b', 3, record(88, 70, 20, '#ff7ab0'))),
  'musg.remix': all(rect(4, 4, 112, 108, '#f2f0f7', 4, null), greyed(rect(8, 18, 44, 30, WHITE, 3, C.ink, 1.2), wave(12, 33, [6, 10, 16, 10, 6, 10, 16, 10, 6, 10], C.ink)),
    path('M54 34 C70 30 70 60 54 64', 'none', HL, 2.4), path('M54 64 L60 60 M54 64 L61 67', 'none', HL, 2.4), rect(52, 66, 60, 36, WHITE, 3, HL, 1.8), wave(56, 84, [20, 6, 20, 6, 20, 6, 20, 6, 20, 6, 20, 6, 20, 6], HL, 2.4, 3.8),
    ...range(4).map((i) => rect(58 + i * 14, 98, 6, 2, C.navy, 0.5, null)), fig({ x: 22, h: 0.6, top: C.black, phones: C.red, mood: 'laugh', l: [[-13, -38], [-14, -24], [-8, -12]], r: [[13, -38], [22, -40], [30, -46]] })),
  'musg.techno': all(rect(4, 4, 112, 108, '#18181f', 4, null), ...[14, 50, 86].map((x) => rect(x, 4, 18, 108, '#2c2c36', 0, null)), path('M60 4 L20 112 M60 4 L100 112 M60 4 L60 112', 'none', 'rgba(255,255,255,0.55)', 1.6), circle(60, 8, 5, WHITE, null),
    speaker(6, 56, 20, 56), speaker(94, 56, 20, 56), line('M30 40 L36 40 L36 30 L42 30 L42 40 L48 40 L48 30 L54 30 L54 40 L60 40 L60 30 L66 30 L66 40 L72 40 L72 30 L78 30 L78 40 L90 40', NEON, 2),
    ...[38, 60, 82].map((x, i) => all(circle(x, 74 + (i % 2) * 4, 5, '#3a3a48', null), path(`M${x - 8} 112 L${x - 6} ${84 + (i % 2) * 4} L${x + 6} ${84 + (i % 2) * 4} L${x + 8} 112 Z`, '#3a3a48', null), line(`M${x - 6} ${86 + (i % 2) * 4} L${x - 12} ${64 + i * 2} M${x + 6} ${86 + (i % 2) * 4} L${x + 12} ${66 - i * 2}`, '#3a3a48', 4)))),
  'musg.nattklubb': all(rect(4, 4, 112, 108, NIGHT, 4, null), circle(100, 16, 6, '#f2e6b4', null), ...[[20, 12], [40, 20], [76, 10]].map(([x, y]) => circle(x!, y!, 1, WHITE, null)), rect(20, 34, 80, 78, '#3a3550', 0, C.ink, 1.4), rect(34, 40, 52, 16, '#1d1a2c', 3, NEON, 2), note(50, 48, 0.7, NEON), path('M66 44 L76 44 L71 51 Z M71 51 L71 54 M68 54 L74 54', 'none', '#ff7ab0', 1.6),
    rect(50, 76, 20, 36, '#1d1a2c', 1, C.ink, 1.2), rect(50, 76, 20, 36, 'rgba(255,122,176,0.25)', 1, null), ...[28, 40, 84, 96].map((x, i) => fig({ x, h: 0.5, top: ['#ff7ab0', '#5bc0eb', '#ffd23f', '#9bdf6b'][i]!, long: i % 2 === 0 })), line('M76 100 L106 100', '#d9a93a', 1.6), ...[76, 106].map((x) => line(`M${x} 100 L${x} 112`, GOLD, 2))),
  'musg.dörrvakt': all(rect(4, 4, 112, 108, NIGHT, 4, null), rect(4, 20, 50, 92, '#3a3550', 0, C.ink, 1.2), rect(14, 46, 30, 66, '#1d1a2c', 1, C.ink, 1.2),
    fig({ x: 34, h: 1.05, top: C.black, bottom: C.black, mood: 'neutral', l: [[-13, -38], [-14, -22], [-6, -16]], r: [[13, -38], [22, -40], [30, -48]], front: all(path('M8 -56 C12 -54 12 -48 9 -44', 'none', C.ink, 1), rect(28, -56, 14, 9, WHITE, 1, C.ink, 1), rect(30, -54, 4, 5, C.skin2, 0.5, null), line('M36 -53 L40 -53 M36 -50 L40 -50', C.grey, 0.8)) }),
    fig({ x: 92, h: 0.82, top: '#ff7ab0', long: true, hair: '#c98b4a', mood: 'smile', l: [[-13, -38], [-24, -36], [-34, -40]], r: [[13, -38], [18, -22], [18, -4]] }), line('M54 96 L70 96', '#d9a93a', 1.6), line('M54 96 L54 112 M70 96 L70 112', GOLD, 2), ring(34, 60, 30)),
  'musg.dansgolv': all(rect(4, 4, 112, 108, '#1f1b33', 4, null), ...range(4).flatMap((r) => range(6).map((c) => path(`M${f1(14 + c * 15.3 - r * 3)} ${66 + r * 11.5} L${f1(29 + c * 15.3 - r * 3)} ${66 + r * 11.5} L${f1(26 + c * 15.3 - r * 3 - 0.2)} ${77.5 + r * 11.5} L${f1(11 + c * 15.3 - r * 3)} ${77.5 + r * 11.5} Z`, ['#ff7ab0', '#5bc0eb', '#ffd23f', '#9bdf6b'][(r + c) % 4]!, C.ink, 0.8))),
    frame(6, 62, 108, 50), ...[30, 60, 90].map((x, i) => fig({ x, y: 96, h: 0.6, top: ['#fbfbf8', C.orange, PURPLE][i]!, long: i === 1, mood: 'laugh', l: [[-13, -38], [-20, -54], [-14 - i * 4, -66]], r: [[13, -38], [22, -30], [26, -40]] })), circle(60, 14, 8, C.silver, C.ink, 1)),
  'musg.ljusshow': all(rect(4, 4, 112, 108, '#120f22', 4, null), waPulse('musg-ljusshow', ...[[10, '#5be0d0'], [30, '#ff7ab0'], [90, '#ffd23f'], [110, '#9bdf6b']].map(([x, col]) => path(`M${x} 6 L${(x as number) < 60 ? 70 : 50} 90 L${(x as number) < 60 ? 80 : 40} 90 Z`, `${col}66`, null))),
    ...[[16, 112, 70, 20], [104, 112, 50, 20], [60, 112, 20, 40]].map(([x1, y1, x2, y2], i) => line(`M${x1} ${y1} L${x2} ${y2}`, ['#ff3d3d', '#3dff7a', '#5bc0eb'][i]!, 1.6)), stageFloor(90), ...[10, 30, 90, 110].map((x) => lamp(x, 6)), heads(104, [14, 30, 46, 62, 78, 94, 110], '#2c2840')),
  'musg.festival': all(rect(4, 4, 112, 108, '#bfe3f5', 4, null), circle(102, 16, 7, C.yellow, C.orange, 1.2), rect(4, 70, 112, 42, GRASS, 0, null), path('M20 64 L60 30 L100 64 Z', C.dark, C.ink, 1.4), rect(24, 52, 72, 14, '#3d3d48', 0, C.ink, 1.2), rect(20, 64, 80, 6, C.black, 0, null),
    speaker(14, 40, 10, 26), speaker(96, 40, 10, 26), ...[[10, 80, '#e4572e'], [100, 78, '#f2c14e']].map(([x, y, col]) => path(`M${x} ${y} L${(x as number) + 10} ${(y as number) - 12} L${(x as number) + 20} ${y} Z`, col as string, C.ink, 1.2)),
    ...[[30, 16, HL], [90, 22, '#5bc0eb']].map(([x, y, col]) => all(line(`M${x} ${y} L${x} ${(y as number) + 18}`, C.dark, 1), path(`M${x} ${y} L${(x as number) + 9} ${(y as number) + 3} L${x} ${(y as number) + 6} Z`, col as string, null))),
    heads(94, [14, 28, 42, 56, 70, 84, 98], '#5a6270'), heads(104, [20, 34, 48, 62, 76, 90, 104], '#4a5260'), notes([[44, 42, 0.6], [72, 40, 0.6]], WHITE)),

  // ── 4435 Hip-hop och rap ─────────────────────────────────────────
  'musg.hiphop': all(brick(4, 4, 112, 108, '#9c8a7a'), path('M10 18 C20 6 40 6 46 18 C52 30 32 40 20 34 C10 30 6 24 10 18 Z', '#ff7ab0', C.ink, 1.4), path('M50 20 C60 8 84 10 88 22 C92 34 74 42 62 36 C54 32 46 30 50 20 Z', '#5bc0eb', C.ink, 1.4), path('M88 30 C96 20 112 24 110 36 C108 46 94 48 90 42 Z', '#ffd23f', C.ink, 1.4),
    rect(80, 82, 30, 18, C.dark, 3, C.ink, 1.4), circle(88, 91, 5, '#55556a', C.ink, 1), circle(102, 91, 5, '#55556a', C.ink, 1), line('M84 82 C84 74 106 74 106 82', C.ink, 1.6),
    fig({ x: 46, h: 0.95, top: '#3f6fb5', bottom: '#3d3f4a', cap: C.red, mood: 'shout', skin: C.skin2, l: [[-13, -38], [-6, -44], [-2, -50]], r: [[13, -38], [26, -40], [34, -48]], front: at(-2, -52, 1, mic()) }), ground()),
  'musg.rappa': all(rect(4, 4, 112, 108, '#f2efe9', 4, null), circle(30, 52, 22, C.skin2, C.ink, 2), path('M10 46 C8 26 30 22 46 34 C38 30 22 32 16 46 Z', C.hair, C.ink, 1.6), path('M8 42 C10 28 44 24 50 36 L58 36 L58 40 L10 44 Z', C.red, C.ink, 1.4), circle(40, 50, 1.6, C.ink, null), ellipse(48, 62, 3, 3.4, '#c84a4a', C.ink, 1),
    at(50, 76, 1.4, mic()), line(range(8).map((i) => `M${60 + i * 7} 104 L${60 + i * 7} 108`).join(' '), C.ink, 1.4),
    waIn('musg-rappa', -18, 0, ...range(4).map((i) => rect(58 + i * 14, 52 + (i % 2 ? -8 : 6), 11, 7, i % 2 ? '#fbd3bd' : HL, 2, C.ink, 1)), ...range(4).map((i) => rect(58 + i * 14, 72 + (i % 2 ? 6 : -6), 11, 7, i % 2 ? HL : '#fbd3bd', 2, C.ink, 1)))),
  'musg.beat': all(rect(4, 4, 112, 108, '#e9ecf2', 4, null), laptop(60, 92, 1.8, all(...range(4).flatMap((r) => range(8).map((c) => rect(-19 + c * 4.8, -29 + r * 5.6, 3.8, 4.4, [[0, 4], [2, 6], [1, 3, 5, 7], [0, 1, 2, 3, 4, 5, 6, 7]][r]!.includes(c) ? [HL, '#ffd23f', '#5bc0eb', '#9bdf6b'][r]! : '#3a4256', 0.6, null))))),
    waPulse('musg-beat', line('M24 26 L24 40 M60 18 L60 40 M96 26 L96 40', HL, 2)), path('M10 24 C10 6 30 6 30 24', 'none', C.dark, 3), rect(6, 22, 8, 12, C.dark, 3, C.ink, 1), rect(26, 22, 8, 12, C.dark, 3, C.ink, 1)),
  'musg.scratcha': all(rect(4, 4, 112, 108, '#2a2a3a', 4, null), rect(10, 24, 100, 84, '#4a4a56', 6, C.ink, 1.6), record(54, 66, 36), line('M98 30 L94 70 L80 76', C.silver, 3), circle(98, 30, 4, C.silver, C.ink, 1),
    moving('musg-scratcha', '0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}', { dur: 0.8 }, g('translate(54 66)', g('translate(-54 -66)', record(54, 66, 36), path('M30 44 C40 36 50 38 56 44 L64 48 C68 50 66 56 62 56 L44 56 C36 56 30 52 30 44 Z', C.skin2, C.ink, 1.4), rect(18, 38, 16, 12, '#3f6fb5', 3, C.ink, 1.2)))),
    path('M18 70 C14 64 14 58 18 52 M12 74 C6 64 6 54 12 46', 'none', HL, 2)),
  'musg.graffiti': all(brick(4, 4, 112, 108, '#b8a898'), path('M10 30 C10 16 26 14 30 26 C34 14 50 16 48 30 C56 22 70 24 66 38 C76 34 86 40 80 52 C74 62 56 60 50 54 C40 62 20 60 14 50 C6 44 6 36 10 30 Z', '#5bc0eb', C.ink, 2), path('M20 36 C26 30 34 32 36 40 C44 34 54 36 56 44', 'none', '#ff7ab0', 4), star(70, 28, 5, '#ffd23f'),
    path('M24 72 C34 64 50 66 56 76 C62 86 46 96 34 92 C22 88 16 80 24 72 Z', '#9bdf6b', C.ink, 1.6), rot(92, 84, 20, rect(-6, -14, 12, 26, '#e4572e', 3, C.ink, 1.4), rect(-3, -18, 6, 4, C.silver, 1, C.ink, 1)), path('M86 66 C80 60 76 60 72 64', 'none', 'rgba(228,87,46,0.6)', 6, ), ...[[74, 58], [70, 64], [78, 56]].map(([x, y]) => circle(x!, y!, 1.4, HL, null))),

  // ── 4436 Folkmusik ───────────────────────────────────────────────
  'musg.folkmusik': all(rect(4, 4, 112, 108, '#dcefe0', 4, null), rect(4, 80, 112, 32, GRASS, 0, null), cottage(70, 80, 40, 28), birch(16, 84, 54),
    fig({ x: 46, h: 0.9, ...FOLK, mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]], front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40)) }),
    fig({ x: 88, h: 0.66, top: WHITE, skirt: '#2f6b8a', apron: '#f2c14e', long: true, mood: 'laugh', l: [[-13, -38], [-20, -26], [-16, -18]], r: [[13, -38], [20, -26], [16, -18]] }), notes([[64, 30, 0.8], [76, 44, 0.7]], C.navy)),
  'musg.spelmanslag': all(rect(4, 4, 112, 108, '#dcefe0', 4, null), rect(4, 86, 112, 26, GRASS, 0, null), ...[18, 39, 60, 81, 102].map((x, i) => fig({ x, h: 0.64 + (i % 2) * 0.03, ...FOLK, long: i % 2 === 1, mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]], front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40)) })),
    notes([[30, 18, 0.7], [72, 14, 0.7], [100, 22, 0.6]], C.navy), frame(6, 26, 108, 84)),
  'musg.polska': all(rect(4, 4, 112, 108, '#e4f1e6', 4, null), rect(4, 84, 112, 28, GRASS, 0, null), fig({ x: 44, h: 0.92, ...FOLK, mood: 'laugh', l: [[-13, -38], [-18, -26], [-12, -16]], r: [[13, -38], [22, -46], [30, -52]] }),
    fig({ x: 76, h: 0.88, top: WHITE, skirt: '#2f6b8a', apron: '#f2c14e', long: true, mood: 'laugh', l: [[-13, -38], [-22, -46], [-30, -54]], r: [[13, -38], [20, -26], [14, -16]] }), path('M30 108 C44 116 76 116 90 108', 'none', HL, 2), path('M90 108 L84 104 M90 108 L84 112', 'none', HL, 2),
    ...[0, 1, 2].map((i) => circle(48 + i * 12, 14, i === 0 ? 5 : 3.4, i === 0 ? HL : C.grey, C.ink, 1))),
  'musg.folkvisa': all(rect(4, 4, 112, 108, '#efe3cc', 4, null), rect(78, 30, 34, 60, '#b9b0a0', 2, C.ink, 1.4), rect(84, 60, 22, 22, C.dark, 2, C.ink, 1), path('M88 82 C90 72 96 70 98 82 Z', C.orange, C.yellow, 1),
    chair(44, 112, WOOD2), fig({ x: 44, y: 104, h: 0.86, legs: 'sit', top: '#7a5236', skirt: '#2f4a7a', long: true, hair: '#c9ced4', scarf: '#c8372d', mood: 'sing', l: [[-13, -38], [-8, -24], [0, -18]], r: [[13, -38], [10, -24], [2, -18]], front: rect(-10, -22, 20, 8, '#a0673d', 1, C.ink, 1) }),
    fig({ x: 16, h: 0.46, top: C.green, mood: 'smile' }), fig({ x: 70, h: 0.44, top: C.pink, long: true, mood: 'smile' }), notes([[30, 30, 0.8], [56, 22, 0.8]], C.navy), ground()),
  'musg.tralla': all(rect(4, 4, 112, 108, '#f3f6ea', 4, null), rect(70, 70, 46, 42, '#d9d2c2', 0, C.ink, 1.2), rect(76, 64, 34, 8, C.silver, 1, C.ink, 1), fig({ x: 64, h: 1, top: '#e9a23b', apron: '#5bc0eb', mood: 'sing', l: [[-13, -38], [-18, -26], [-10, -18]], r: [[13, -38], [22, -30], [30, -34]], front: all(ellipse(30, -36, 7, 3, WHITE, C.ink, 1)) }),
    waBob('musg-tralla', 4, notes([[24, 30, 1], [36, 18, 0.9], [14, 50, 0.8]], HL)), line('M38 44 C42 40 44 36 48 34', HL, 1.6, '2 3')),
  'musg.spela-på-gehör': all(rect(4, 4, 112, 108, '#eef4ea', 4, null), fig({ x: 44, h: 0.98, ...FOLK, mood: 'calm', l: [[-13, -38], [-16, -46], [-6, -50]], r: [[13, -38], [22, -34], [28, -46]], front: all(rot(-6, -48, -20, violin()), bowStick(14, -54, 36, -40), path('M9 -58 C14 -60 15 -52 10 -51', C.skin, C.ink, 1.2)) }), ring(53, 44, 8),
    waIn('musg-gehor', 14, 0, waves(60, 44, 3, HL, 5, -1)), stand(96, 112), rect(88, 82, 16, 12, WHITE, 1, C.ink, 1), staff(89, 84, 14, 2, C.grey), cross(96, 88, 9)),
  'musg.folkdans': all(rect(4, 4, 112, 108, '#e4f1e6', 4, null), rect(4, 80, 112, 32, GRASS, 0, null), ellipse(60, 100, 46, 9, 'none', HL, 1.6, ),
    ...[[30, 0], [52, 1], [74, 2], [96, 3]].map(([x, i]) => fig({ x, h: 0.66, ...(i! % 2 ? { top: WHITE, skirt: '#2f6b8a', apron: '#f2c14e', long: true } : FOLK), mood: 'laugh', l: [[-13, -38], [-20, -30], [-11, -28]], r: [[13, -38], [20, -30], [11, -28]] })), birch(10, 80, 44)),
  'musg.midsommarstång': all(rect(4, 4, 112, 108, '#cfe8f7', 4, null), rect(4, 90, 112, 22, GRASS, 0, null), rect(57, 10, 6, 100, '#2f6b3a', 2, C.ink, 1.2), rect(26, 24, 68, 5, '#2f6b3a', 2, C.ink, 1.2), circle(32, 40, 10, 'none', '#2f6b3a', 4), circle(88, 40, 10, 'none', '#2f6b3a', 4),
    ...[[60, 8], [30, 26], [90, 26], [32, 50], [88, 50], [60, 50], [60, 76]].map(([x, y], i) => circle(x!, y!, 2.6, [C.yellow, C.red, '#5bc0eb', C.white][i % 4]!, C.ink, 0.6)), line('M60 30 L60 104', LEAF, 2), ...range(8).map((i) => circle(60 + (i % 2 ? 4 : -4), 34 + i * 9, 2.4, LEAF, null)),
    path('M30 24 L28 34 M44 24 L42 32 M76 24 L74 32 M90 24 L88 34', 'none', '#f2c14e', 2), frame(20, 4, 80, 108)),
  'musg.fäbod': all(rect(4, 4, 112, 108, '#d6ebf5', 4, null), path('M4 60 L30 28 L52 48 L76 20 L116 60 Z', '#9fb3a0', C.ink, 1.2), rect(4, 60, 112, 52, '#b9dca0', 0, null), ...[10, 104].map((x) => path(`M${x} 70 L${x - 8} 90 L${x + 8} 90 Z`, '#2f6b3a', C.ink, 1)),
    cottage(30, 86, 30, 20, '#8a6a4a'), cottage(66, 82, 22, 16, '#8a6a4a'), line('M20 92 L100 92 M24 92 L24 86 M40 92 L40 86 M56 92 L56 86 M72 92 L72 86 M88 92 L88 86', WOOD2, 1.4), cow(40, 108, 1), cow(84, 106, 0.9, '#d9c7a8'), goat(64, 110, 1)),
  'musg.kulning': all(rect(4, 4, 112, 108, '#d6ebf5', 4, null), path('M4 70 L24 48 L50 70 Z', '#9fb3a0', C.ink, 1), rect(4, 70, 112, 42, '#9fd0ea', 0, null), path('M4 78 C30 70 50 86 60 112 L4 112 Z', '#7fbf6a', C.ink, 1.2),
    fig({ x: 26, y: 104, h: 0.72, top: WHITE, skirt: '#c8372d', apron: '#f2c14e', long: true, mood: 'sing', l: [[-13, -38], [-8, -46], [-2, -50]], r: [[13, -38], [10, -46], [4, -50]] }), waves(34, 46, 4, HL, 8), line('M60 30 C76 26 92 26 108 30', HL, 1.6, '3 3'),
    path('M80 76 L112 76 L112 84 L80 84 Z', '#7fbf6a', null), cow(92, 80, 0.55), cow(104, 82, 0.5, '#d9c7a8')),

  // ── 4437 Filmmusik och spelmusik ─────────────────────────────────
  'musg.filmmusik': all(rect(4, 4, 112, 108, '#1d1d28', 4, null), screen(12, 10, 96, 50, all(path('M12 60 L36 30 L54 46 L76 22 L108 60 Z', '#7fa88a', null), circle(92, 22, 6, '#ffe28a', null), hero(52, 56, 1)), '#bfe3f5'),
    orchestra(108, 2, '#3a3a48'), notes([[22, 70, 0.7], [98, 70, 0.7]], GOLD)),
  'musg.bakgrundsmusik': all(rect(4, 4, 112, 108, '#f3ead9', 4, null), speaker(98, 10, 12, 18), greyed(notes([[88, 30, 0.5], [80, 22, 0.45], [72, 30, 0.4]], C.ink)), table(60, 84, 44), mug(50, 82), mug(70, 82),
    fig({ x: 28, y: 104, h: 0.8, legs: 'sit', top: C.green, mood: 'laugh', l: [[-13, -38], [-10, -22], [0, -18]], r: [[13, -38], [20, -26], [26, -24]] }), fig({ x: 92, y: 104, h: 0.8, legs: 'sit', top: C.pink, long: true, mood: 'smile', l: [[-13, -38], [-20, -26], [-26, -24]], r: [[13, -38], [10, -22], [0, -18]] }),
    rect(40, 30, 16, 10, WHITE, 3, C.ink, 1), rect(64, 34, 16, 10, WHITE, 3, C.ink, 1), ring(92, 24, 16)),
  'musg.ledmotiv': all(rect(4, 4, 112, 108, '#26232f', 4, null), rect(4, 40, 112, 50, C.black, 0, null), ...range(14).map((i) => all(rect(6 + i * 8, 42, 4, 3, '#cfcfd8', 0.5, null), rect(6 + i * 8, 85, 4, 3, '#cfcfd8', 0.5, null))),
    ...[22, 60, 98].map((x, i) => all(rect(x - 16, 48, 32, 34, ['#bfe3f5', '#b9dca0', '#f3d8a8'][i]!, 1, null), hero(x, 80, 1.2), rect(x - 14, 10, 28, 20, WHITE, 2, HL, 1.4), head(x - 7, 24, HL, 0.8), head(x, 20, HL, 0.8), head(x + 7, 16, HL, 0.8), line(`M${x} 32 L${x} 46`, HL, 1.2, '2 2')))),
  'musg.läskig': all(rect(4, 4, 112, 108, '#1d2230', 4, null), ...[10, 30, 92, 110].map((x, i) => all(rect(x - 3, 30 + i * 4, 6, 82, '#2c3240', 0, null), path(`M${x - 14} ${40 + i * 4} L${x} ${10 + i * 4} L${x + 14} ${40 + i * 4} Z`, '#2c3a34', null))), path('M60 34 C40 34 40 60 46 76 L74 76 C80 60 80 34 60 34 Z', '#111', null),
    ellipse(54, 50, 3, 2, '#ffe28a', null), ellipse(66, 50, 3, 2, '#ffe28a', null), fig({ x: 92, h: 0.62, top: '#e9a23b', mood: 'shock', l: [[-13, -38], [-14, -48], [-6, -54]], r: [[13, -38], [14, -48], [6, -54]] }), notes([[20, 84, 0.6], [30, 92, 0.5]], '#7c4fa8')),
  'musg.ljudeffekt': all(rect(4, 4, 112, 108, '#1d1d28', 4, null), screen(10, 10, 64, 44, all(path('M42 32 L46 22 L50 30 L58 20 L56 32 L66 34 L56 40 L60 50 L50 44 L44 52 L42 42 L32 40 Z', '#ffd23f', C.orange, 1.2), rect(12, 44, 60, 10, '#7a6a5a', 0, null)), '#bfe3f5'),
    speaker(86, 28, 24, 40), path('M78 80 L86 72 L90 82 L100 74 L98 86 L110 88 L98 94 L102 104 L90 98 L84 108 L82 96 L72 94 Z', HL, C.ink, 1.4), waves(110, 48, 2, HL, 5, -1), greyed(notes([[22, 80, 0.7], [40, 90, 0.6]], C.ink))),
  'musg.eftertext': all(rect(4, 4, 112, 108, '#141418', 4, null), screen(12, 8, 96, 56, moving('musg-eftertext', '0%{transform:translate(0,20px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3.4 }, line(range(7).map((i) => `M${40 + (i % 2) * 4} ${16 + i * 6.5} L${80 - (i % 3) * 4} ${16 + i * 6.5}`).join(' '), '#e9e9ee', 1.6)), '#08080c'),
    heads(84, [16, 34, 70, 88, 104], '#3a3a48'), fig({ x: 52, y: 112, h: 0.6, top: '#e9a23b', mood: 'calm', legs: 'sit' }), notes([[30, 72, 0.6], [96, 70, 0.6]], GOLD)),
  'musg.spelmusik': all(rect(4, 4, 112, 108, '#efeaf6', 4, null), screen(14, 10, 92, 54, all(rect(14, 54, 92, 10, '#7fbf6a', 0, null), rect(30, 40, 20, 6, '#b5654a', 0, C.ink, 0.8), rect(70, 34, 16, 6, '#b5654a', 0, C.ink, 0.8), circle(78, 26, 3, GOLD, C.ink, 0.8), rect(40, 46, 6, 8, '#e4572e', 0, null), rect(41, 42, 4, 4, C.skin, 0, null)), '#7fc8f0'),
    path('M30 82 C24 82 18 96 24 102 C28 106 34 100 38 96 L82 96 C86 100 92 106 96 102 C102 96 96 82 90 82 Z', C.dark, C.ink, 1.6), line('M34 88 L34 96 M30 92 L38 92', C.white, 2), circle(84, 88, 2.4, C.red, null), circle(90, 92, 2.4, C.green, null), notes([[100, 18, 0.7], [110, 30, 0.6]], HL)),
};
