/**
 * Kultur & fritid → Musik & scenkonst → Teater & drama, 4451–4457 (0.62): stage and set, roles, script and lines,
 * direction and rehearsal, costume and make-up, premiere and performance, theatre criticism.
 * Recurring signs: the stage is a dark box with red curtains and a wooden floor, the audience is a row of dark
 * heads at the bottom, speech is a white bubble with grey lines (never words), the part that the word names is
 * orange or ringed in orange, and grey shows what the word is not.
 * Words that are easy to mix up share one layout where only the marked part differs: scenografi/kuliss (the whole
 * built set or only the painted flat at the side), huvudroll/biroll (four actors: the one in the spotlight or a
 * small one at the side), akt/scen (a play as a bar of three big blocks split into small ones: one big block or one
 * small block), entré/sorti (an actor walking in from the wing or out into it), premiär/derniär (a row of
 * performance days: the first or the last one), parkett/balkong (a cut through the auditorium: the floor seats or
 * the upper tier), succé/flopp (a full, cheering house or empty seats).
 * Digits (a cloakroom tag, a clock) appear only where the word is not their name; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waGrow, waIn, waPulse, waShake, waSway, type Svg } from './kit';
import { HL, T, heart } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const STAGE = '#2d2a3e';
const CURT = '#8c2b3a';
const CURT2 = '#a8344a';
const BOARD = '#8a5a3a';
const SEAT = '#b03a48';
const WALL = '#e9dcc6';
const RED = '#e8302c';
const GREEN = '#3fa45b';
const BEAM = 'rgba(255,240,180,0.45)';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const tick = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const cross = (x: number, y: number, s = 5, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 2.8);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── People ───────────────────────────────────────────────────────────
type Pt = [number, number];
type Fig = {
  top?: string; bottom?: string; hair?: 'short' | 'long' | 'bun' | 'grey'; hairCol?: string; skin?: string; grey?: boolean;
  mouth?: 'smile' | 'open' | 'closed' | 'o' | 'flat' | 'frown' | 'wide'; eyes?: 'open' | 'closed' | 'wide';
  armL?: Pt[]; armR?: Pt[]; skirt?: boolean; extra?: Svg; front?: Svg; tilt?: number; black?: boolean;
};
const HANG_L: Pt[] = [[-14, -48], [-15, -34]];
const HANG_R: Pt[] = [[14, -48], [15, -34]];
/** Standing person, feet at (x, y), local units: head centre (0, −80), shoulders (±10, −64). Height ≈ 92·s. */
const fig = (x: number, s: number, o: Fig = {}, y = 112) => {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin);
  const top = grey ? C.grey : o.black ? C.black : (o.top ?? C.sky);
  const bot = grey ? C.grey : o.black ? C.black : (o.bottom ?? C.navy);
  const hair = grey ? C.grey : o.hair === 'grey' ? '#d9d9d9' : (o.hairCol ?? C.hair);
  const armPath = (side: number, pts: Pt[]) => { const d = `M${side * 9} -62 ` + pts.map(([a, b]) => `L${a} ${b}`).join(' '); const [hx, hy] = pts[pts.length - 1]!; return all(line(d, ink, 7.4), line(d, top, 5), circle(hx, hy, 3.2, skin, ink, 1.2)); };
  const eyes = o.eyes === 'closed' ? line('M-5.5 -80 Q-3.5 -78 -1.5 -80 M1.5 -80 Q3.5 -78 5.5 -80', ink, 1.2)
    : o.eyes === 'wide' ? all(circle(-3.6, -81, 1.9, C.white, ink, 0.9), circle(3.6, -81, 1.9, C.white, ink, 0.9), circle(-3.6, -81, 0.9, ink, null), circle(3.6, -81, 0.9, ink, null))
    : all(circle(-3.6, -81, 1.2, ink, null), circle(3.6, -81, 1.2, ink, null));
  const m = o.mouth ?? 'smile';
  const mouth = m === 'open' ? ellipse(0, -74.5, 2.6, 3, '#c84a4a', ink, 1)
    : m === 'wide' ? path('M-4 -76 Q0 -69 4 -76 Z', '#c84a4a', ink, 1)
    : m === 'o' ? circle(0, -74.5, 1.5, '#c84a4a', ink, 1)
    : m === 'closed' ? line('M-3 -75 L3 -75', ink, 1.4)
    : m === 'flat' ? line('M-3 -74.5 L3 -74.5', ink, 1.2)
    : m === 'frown' ? path('M-3 -73.5 Q0 -76.5 3 -73.5', 'none', ink, 1.3)
    : path('M-3.4 -75.5 Q0 -72.5 3.4 -75.5', 'none', ink, 1.3);
  const legs = o.skirt ? all(path('M-11 -36 L11 -36 L15 -12 L-15 -12 Z', bot, ink, 1.8), line('M-5 -12 L-5 -1 M5 -12 L5 -1', skin, 4.4))
    : all(line('M-5 -36 L-6 -2', ink, 7.6), line('M-5 -36 L-6 -2', bot, 5.6), line('M5 -36 L6 -2', ink, 7.6), line('M5 -36 L6 -2', bot, 5.6));
  const shoes = all(ellipse(-7, -1, 5, 2.4, grey ? C.grey : C.black, null), ellipse(7, -1, 5, 2.4, grey ? C.grey : C.black, null));
  const hairBack = o.hair === 'long' ? path('M-11 -82 C-14 -64 -8 -62 0 -64 C8 -62 14 -64 11 -82 C10 -96 -10 -96 -11 -82 Z', hair, ink, 1.6) : '';
  const hairTop = o.hair === 'bun' ? all(circle(0, -93, 4.5, hair, ink, 1.4), path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6))
    : path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6);
  return g(`translate(${x} ${y}) scale(${s})${o.tilt ? ` rotate(${o.tilt} 0 -40)` : ''}`,
    legs, shoes, hairBack,
    path('M-11 -66 L11 -66 L10 -34 L-10 -34 Z', top, ink, 1.8),
    armPath(-1, o.armL ?? HANG_L), armPath(1, o.armR ?? HANG_R),
    rect(-3, -71, 6, 6, skin, 2, ink, 1.2), circle(0, -80, 10, skin, ink, 1.8), hairTop, eyes, mouth, o.extra ?? '', o.front ?? '');
};
const W = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { hair: 'long', top: C.orange, skirt: true, bottom: C.purple, ...o }, y);
const M = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { top: C.green, ...o }, y);
/** Seated person (side-agnostic, front view), seat at y. */
const sitter = (x: number, y: number, s: number, o: Fig = {}) => g(`translate(${x} ${y}) scale(${s})`,
  line('M-5 0 L-7 14 M5 0 L7 14', C.ink, 7.6), line('M-5 0 L-7 14 M5 0 L7 14', o.grey ? C.grey : o.black ? C.black : (o.bottom ?? C.navy), 5.6),
  fig(0, 1, { ...o, skirt: false, armL: o.armL ?? [[-13, -46], [-8, -38]], armR: o.armR ?? [[13, -46], [8, -38]] }, 36).replace(/<path d="M-?5 -36 L-?6 -2"[^>]*\/>/g, '').replace(/<ellipse cx="-?7" cy="-1"[^>]*\/>/g, ''));
const ARMS_UP_L: Pt[] = [[-16, -74], [-12, -90]];
const ARMS_UP_R: Pt[] = [[16, -74], [12, -90]];
const GESTURE_R: Pt[] = [[18, -66], [30, -74]];
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 4 L-9 -6 L-4 -1 L0 -8 L4 -1 L9 -6 L8 4 Z', C.gold, C.ink, 1.2), circle(0, -1, 1.2, RED, null));
const cape = (col: string = RED) => path('M-11 -66 L11 -66 L18 -2 L-18 -2 Z', col, C.ink, 1.6);
const scriptIn = (col: string = C.white) => ({ armL: [[-12, -50], [-6, -52]] as Pt[], armR: [[12, -50], [6, -52]] as Pt[], front: all(rect(-9, -62, 18, 13, col, 1.5, C.ink, 1.1), line('M-6 -58 L6 -58 M-6 -55 L4 -55 M-6 -52 L5 -52', C.grey, 0.8)) });

// ── Stage pieces ─────────────────────────────────────────────────────
const planks = (y: number) => line(range(6).map((i) => `M${i * 22 + 6} ${y} L${i * 26 - 10} 120`).join(' '), '#6e4529', 0.9);
/** Dark stage box with a wooden floor from floorY. */
const stageBox = (floorY = 88) => all(rect(0, 0, 120, 120, STAGE, 0, null), rect(0, floorY, 120, 120 - floorY, BOARD, 0, null), planks(floorY), line(`M0 ${floorY} L120 ${floorY}`, C.ink, 1.6));
/** Side curtains and a top valance. */
const curtains = (w = 16, h = 96) => all(
  path(`M0 0 L${w + 4} 0 C${w} ${h * 0.35} ${w + 4} ${h * 0.7} ${w - 4} ${h} L0 ${h} Z`, CURT, C.ink, 1.2), line(`M${w * 0.4} 6 C${w * 0.3} ${h * 0.4} ${w * 0.5} ${h * 0.7} ${w * 0.3} ${h}`, '#6e1f2c', 1.2),
  path(`M120 0 L${116 - w} 0 C${120 - w} ${h * 0.35} ${116 - w} ${h * 0.7} ${124 - w} ${h} L120 ${h} Z`, CURT, C.ink, 1.2), line(`M${120 - w * 0.4} 6 C${120 - w * 0.3} ${h * 0.4} ${120 - w * 0.5} ${h * 0.7} ${120 - w * 0.3} ${h}`, '#6e1f2c', 1.2),
  path('M0 0 L120 0 L120 9 ' + range(8).map((i) => `Q${f1(112.5 - i * 15)} 15 ${f1(105 - i * 15)} 9`).join(' ') + ' Z', CURT2, C.ink, 1.2));
/** A row of dark audience heads seen from behind. */
const heads = (n: number, y = 112, col = '#1c1a28', x0 = 8, x1 = 112) => all(...range(n).map((i) => { const x = f1(x0 + i * ((x1 - x0) / Math.max(1, n - 1))); return all(circle(x, y - 10, 6.5, col, null), rect(f1(x - 9), y - 4, 18, 10, col, 4, null)); }));
const beam = (x: number, top = 0, w = 36, bottom = 100) => path(`M${x - 5} ${top} L${x + 5} ${top} L${x + w / 2} ${bottom} L${x - w / 2} ${bottom} Z`, BEAM, null);
/** Speech bubble with grey lines; tail towards (tx, ty). */
const say = (x: number, y: number, w: number, h: number, tx: number, ty: number, n = 2, col: string = C.white, lc: string = C.grey) => all(
  path(`M${x + 4} ${y} L${x + w - 4} ${y} Q${x + w} ${y} ${x + w} ${y + 4} L${x + w} ${y + h - 4} Q${x + w} ${y + h} ${x + w - 4} ${y + h} L${f1(x + w / 2 + 4)} ${y + h} L${tx} ${ty} L${f1(x + w / 2 - 3)} ${y + h} L${x + 4} ${y + h} Q${x} ${y + h} ${x} ${y + h - 4} L${x} ${y + 4} Q${x} ${y} ${x + 4} ${y} Z`, col, C.ink, 1.3),
  ...range(n).map((i) => line(`M${x + 4} ${f1(y + (h / (n + 1)) * (i + 1))} L${f1(x + w - 4 - (i % 2) * 5)} ${f1(y + (h / (n + 1)) * (i + 1))}`, lc, 1.5)));
/** A script booklet, top-left (x, y), size w×h; `hl` = index of a highlighted line. */
const script = (x: number, y: number, w: number, h: number, n = 6, hl = -1, hlCol: string = HL) => all(
  rect(x, y, w, h, C.white, 2, C.ink, 1.5), line(`M${x + 3} ${y + 2} L${x + 3} ${y + h - 2}`, C.grey2, 1),
  ...range(n).map((i) => { const yy = f1(y + 5 + i * ((h - 8) / Math.max(1, n - 1))); return line(`M${x + 6} ${yy} L${f1(x + w - 4 - (i % 3) * 4)} ${yy}`, i === hl ? hlCol : C.grey, i === hl ? 2.2 : 1.3); }));
/** Spotlight lamp on a bar, pointing down to the lower right by rot degrees. */
const lamp = (x: number, y: number, s = 1, rot = 20, col: string = C.dark) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  line('M0 -10 L0 -4', C.ink, 2), path('M-7 -4 L7 -4 L9 12 L-9 12 Z', col, C.ink, 1.4), ellipse(0, 12, 9, 3, '#fff3b0', C.ink, 1.2), line('M-7 0 L7 0', '#55586a', 1));
const seat = (x: number, y: number, col: string = SEAT, s = 1) => at(x, y, s, rect(-5, -9, 10, 9, col, 2.5, C.ink, 1), rect(-6, -2, 12, 4, col, 1.5, C.ink, 1));
const head = (x: number, y: number, col: string, s = 1) => at(x, y, s, circle(0, -6, 4.2, C.skin, C.ink, 1), path('M-4.2 -7 C-4 -12 4 -12 4.2 -7 C2 -9 -2 -9 -4.2 -7 Z', col, C.ink, 0.8), rect(-5, -2, 10, 6, col, 2.5, C.ink, 0.9));
const door = (x: number, y: number, w = 16, h = 30, col: string = '#b98a5c', open = false) => all(rect(x, y, w, h, open ? '#3d2f2a' : col, 1.5, C.ink, 1.4), open ? path(`M${x} ${y} L${x - 7} ${y + 4} L${x - 7} ${y + h + 3} L${x} ${y + h} Z`, col, C.ink, 1.2) : circle(x + w - 3.5, y + h / 2, 1.3, C.gold, null));
const tree = (x: number, y: number, s = 1, col: string = '#4f9d69') => at(x, y, s, rect(-2.5, -4, 5, 18, C.brown, 1, C.ink, 1.2), circle(0, -12, 11, col, C.ink, 1.4), circle(-7, -6, 7, col, C.ink, 1.2), circle(7, -6, 7, col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col: string = '#f2d7a6') => at(x, y, s, rect(-16, -24, 32, 24, col, 1, C.ink, 1.4), path('M-19 -24 L0 -40 L19 -24 Z', '#c0563f', C.ink, 1.4), rect(-5, -14, 10, 14, C.brown, 1, C.ink, 1), rect(-13, -20, 7, 6, '#bfe3f5', 1, C.ink, 1), rect(6, -20, 7, 6, '#bfe3f5', 1, C.ink, 1));
const clock = (x: number, y: number, r: number, h: number, m: number, face: string = C.white) => all(circle(x, y, r, face, C.ink, 1.8),
  ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.sin(a) * r * 0.82)} ${f1(y - Math.cos(a) * r * 0.82)} L${f1(x + Math.sin(a) * r * 0.92)} ${f1(y - Math.cos(a) * r * 0.92)}`, C.ink, 1); }),
  line(`M${x} ${y} L${f1(x + Math.sin(((h % 12) + m / 60) / 12 * Math.PI * 2) * r * 0.5)} ${f1(y - Math.cos(((h % 12) + m / 60) / 12 * Math.PI * 2) * r * 0.5)}`, C.ink, 2.2),
  line(`M${x} ${y} L${f1(x + Math.sin(m / 60 * Math.PI * 2) * r * 0.75)} ${f1(y - Math.cos(m / 60 * Math.PI * 2) * r * 0.75)}`, C.ink, 1.5), circle(x, y, 1.4, C.ink, null));
const thumbUp = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -2, 5, 10, C.skin, 1.5, C.ink, 1.1), path('M-1 -1 C1 -4 2 -8 3 -10 C5 -12 7 -10 6 -7 L5 -3 L9 -3 C11 -3 11 0 10 1 C11 2 10 4 9 4 C10 5 9 7 8 7 L-1 8 Z', C.skin, C.ink, 1.1));
const flower = (x: number, y: number, s = 1, col: string = C.pink) => at(x, y, s, line('M0 0 L0 12', GREEN, 1.6), ...range(5).map((i) => circle(f1(Math.sin(i * 1.256) * 3.4), f1(-Math.cos(i * 1.256) * 3.4), 2.6, col, C.ink, 0.6)), circle(0, 0, 1.8, C.yellow, null));
const sweat = (x: number, y: number) => all(path(`M${x} ${y} C${x + 2} ${y + 3} ${x + 2} ${y + 5} ${x} ${y + 5} C${x - 2} ${y + 5} ${x - 2} ${y + 3} ${x} ${y} Z`, '#8cc7e8', C.ink, 0.6));
const mirror = (x: number, y: number, w: number, h: number, bulbs = false) => all(rect(x, y, w, h, '#d8ecf5', 2, C.ink, 1.6), line(`M${x + 4} ${y + h - 6} L${x + 12} ${y + 4}`, C.white, 1.6),
  bulbs ? all(...range(5).map((i) => circle(f1(x + 2 + i * ((w - 4) / 4)), y - 3, 2.6, C.yellow, C.ink, 0.8)), ...range(3).map((i) => circle(x - 3, f1(y + 6 + i * ((h - 12) / 2)), 2.6, C.yellow, C.ink, 0.8)), ...range(3).map((i) => circle(x + w + 3, f1(y + 6 + i * ((h - 12) / 2)), 2.6, C.yellow, C.ink, 0.8))) : '');
const hanger = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -6 C0 -9 3 -9 3 -7', 'none', C.ink, 1.2), path('M0 -6 L-12 2 L12 2 Z', 'none', C.ink, 1.4));
/** A dress form (mannequin) with a period gown; pole foot at y=112. */
const gown = (x: number, s = 1, col: string = '#3f8f6a', trim: string = C.gold) => at(x, 112, s,
  line('M0 -2 L0 -16 M-10 -1 L10 -1', C.dark, 2.4), path('M-8 -88 C-8 -96 8 -96 8 -88 L6 -82 L-6 -82 Z', C.beige, C.ink, 1.2),
  path('M-10 -82 L10 -82 L8 -58 L-8 -58 Z', col, C.ink, 1.6), path('M-10 -82 C-18 -80 -20 -72 -16 -68 L-9 -72 Z M10 -82 C18 -80 20 -72 16 -68 L9 -72 Z', col, C.ink, 1.4),
  path('M-8 -58 L8 -58 C18 -40 26 -24 28 -16 L-28 -16 C-26 -24 -18 -40 -8 -58 Z', col, C.ink, 1.6), line('M-27 -20 L27 -20 M-6 -70 L6 -70', trim, 1.6), line('M0 -82 L0 -58', trim, 1.2));
const corset = (x: number, y: number, s = 1, col: string = '#c94f6d') => at(x, y, s,
  path('M-14 -20 C-6 -24 6 -24 14 -20 L10 0 C12 8 14 14 16 20 L-16 20 C-14 14 -12 8 -10 0 Z', col, C.ink, 1.8),
  line('M-8 -20 L-6 20 M8 -20 L6 20 M0 -22 L0 20', '#8f2f48', 1), line(range(6).map((i) => `M-3 ${-16 + i * 6} L3 ${-13 + i * 6} M3 ${-16 + i * 6} L-3 ${-13 + i * 6}`).join(' '), C.white, 1.2),
  line('M-3 20 C-6 26 -2 30 -6 34 M3 20 C6 26 2 30 6 34', C.white, 1.2));
const beard = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 -6 C-14 6 -8 20 0 24 C8 20 14 6 14 -6 C10 -2 6 0 0 0 C-6 0 -10 -2 -14 -6 Z', col, C.ink, 1.4),
  path('M-9 -8 C-5 -12 -1 -10 0 -7 C1 -10 5 -12 9 -8 C6 -6 3 -5 0 -5 C-3 -5 -6 -6 -9 -8 Z', col, C.ink, 1.2), line('M-6 4 C-5 10 -3 14 -1 18 M5 4 C4 10 3 14 1 18', C.grey2, 1));
const curtainIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -7 L6 -7 L6 7 L2 7 C2 2 -2 2 -2 7 L-6 7 Z', CURT, C.ink, 0.9));
/** A play as a bar: three acts (big blocks), each split into scenes; mark one act or one scene. */
const playBar = (markAct: number, markScene: number) => {
  const acts = [[8, 4], [44, 3], [80, 4]] as const;
  const blocks = acts.map(([x, n], ai) => {
    const w = 32, sw = w / n;
    const scenes = range(n).map((si) => {
      const on = ai === markAct && (markScene < 0 || si === markScene);
      const sx = f1(x + si * sw);
      return rect(sx, 50, f1(sw), 26, on ? (markScene < 0 ? '#fde3c8' : HL) : '#d8e8f7', 1, C.ink, 1);
    });
    return all(...scenes, ...range(n).map((si) => fig(f1(x + si * sw + sw / 2), 0.13, { top: [C.red, C.green, C.purple, C.denim][(si + ai) % 4]! }, 72)));
  });
  return all(...blocks, curtainIcon(41, 63, 0.7), curtainIcon(77, 63, 0.7), line('M8 86 L112 86', C.grey, 1.4), arrow(100, 86, 112, 86, C.grey, 1.6),
    markScene < 0 ? frame(acts[markAct]![0] - 3, 46, 38, 34) : frame(f1(acts[markAct]![0] + markScene * (32 / acts[markAct]![1]) - 2.5), 45, f1(32 / acts[markAct]![1] + 5), 36),
    script(46, 92, 28, 20, 4));
};
/** huvudroll/biroll: four actors on a stage; `who` 0 = the king in the spotlight, 3 = the servant at the side. */
const castLine = (who: number) => {
  const actors = [
    M(60, 0.62, { top: C.purple, extra: crown(0, -96, 1.1), front: cape(RED), armR: GESTURE_R }, 104),
    W(36, 0.5, { top: C.orange, mouth: 'open' }, 104),
    M(84, 0.5, { top: C.denim }, 104),
    M(104, 0.42, { top: C.grey2, bottom: C.dark, mouth: 'flat', armR: [[14, -54], [20, -58]], extra: rect(14, -64, 14, 3, C.silver, 1, C.ink, 1) }, 104),
  ];
  return all(stageBox(84), curtains(10, 84), beam(60, 0, 44, 104),
    ...actors.map((a, i) => (i === who ? a : greyed(a))),
    who === 0 ? ring(60, 52, 18) : ring(108, 66, 13), heads(6, 120));
};
/** entré/sorti: the left wing of a stage; an actor comes out of it towards the middle (in) or walks into it (out). */
const wingWalk = (inward: boolean, name: string) => {
  const wing = path('M0 16 L26 20 L26 92 L0 96 Z', '#3b2a3a', C.ink, 1.2);
  const actor = inward
    ? W(44, 0.66, { top: C.orange, mouth: 'wide', armR: GESTURE_R }, 100)
    : W(24, 0.66, { top: C.orange, mouth: 'smile', armL: [[-16, -58], [-22, -48]], armR: [[16, -66], [24, -80]] }, 100);
  return all(stageBox(86), curtains(14, 86), inward ? wing : '',
    fig(88, 0.56, { top: C.green, grey: true }, 100), heads(6, 120),
    moving(name, inward ? '0%{transform:translate(-34px,0);opacity:.4}60%,100%{transform:translate(0,0);opacity:1}' : '0%,20%{transform:translate(34px,0)}80%,100%{transform:translate(0,0)}', { dur: 2.6 }, actor),
    inward ? '' : wing,
    inward ? arrow(14, 30, 40, 30, HL, 3.4) : arrow(62, 30, 20, 30, HL, 3.4), inward ? ring(44, 60, 18) : frame(2, 16, 40, 82));
};
/** premiär/derniär: a row of performance days; `last` marks the final one, otherwise the first. */
const runDays = (last: boolean) => {
  const days = range(8).map((i) => {
    const x = 6 + (i % 4) * 28, y = i < 4 ? 8 : 40, on = last ? i === 7 : i === 0;
    const box = all(rect(x, y, 24, 26, on ? '#fde3c8' : C.white, 2, C.ink, 1.3), rect(x, y, 24, 6, on ? HL : C.grey2, 1, null), rect(x + 5, y + 9, 14, 12, STAGE, 1, null), path(`M${x + 5} ${y + 9} L${x + 9} ${y + 9} L${x + 7} ${y + 21} L${x + 5} ${y + 21} Z M${x + 19} ${y + 9} L${x + 15} ${y + 9} L${x + 17} ${y + 21} L${x + 19} ${y + 21} Z`, CURT, null));
    return on ? all(box, frame(x - 2, y - 2, 28, 30)) : greyed(box);
  });
  return all(...days, last ? arrow(60, 22, 96, 54, C.grey, 1.6) : arrow(60, 54, 26, 22, C.grey, 1.6),
    rect(0, 70, 120, 50, STAGE, 0, null), rect(0, 96, 120, 24, BOARD, 0, null),
    ...[30, 52, 74, 94].map((x, i) => fig(x, 0.3, { top: [C.orange, C.green, C.purple, C.denim][i]!, mouth: 'wide', armL: ARMS_UP_L, armR: ARMS_UP_R }, 104)),
    flower(16, 102, 1.1, C.pink), flower(106, 102, 1.1, C.yellow), sparkle(20, 80, 4, C.gold), sparkle(100, 80, 4, C.gold),
    last ? path('M0 70 L60 70 L60 74 C40 84 20 96 0 100 Z M120 70 L60 70 L60 74 C80 84 100 96 120 100 Z', CURT, C.ink, 1) : '');
};
/** parkett/balkong: a cut through the auditorium, stage at the left. */
const house2 = (upper: boolean) => {
  const floorSeats = all(...range(5).map((i) => all(seat(48 + i * 14, 104 - i * 2, SEAT), head(48 + i * 14, 96 - i * 2, [C.navy, C.red, C.green, C.purple, C.denim][i]!))));
  const balcSeats = all(...range(3).map((i) => all(seat(84 + i * 12, 54 - i * 3, SEAT), head(84 + i * 12, 46 - i * 3, [C.orange, C.denim, C.green][i]!))));
  return all(rect(0, 0, 120, 120, '#f1e6d6', 0, null), rect(0, 60, 30, 52, STAGE, 0, null), rect(0, 86, 34, 26, BOARD, 1, C.ink, 1.2), path('M0 60 L6 60 C4 70 6 80 2 86 L0 86 Z', CURT, null),
    fig(16, 0.3, { top: C.orange }, 86), beam(16, 60, 20, 86),
    path('M76 58 L120 50 L120 62 L78 70 Z', '#d6c3a5', C.ink, 1.4), line('M80 70 L80 112', '#a88f6d', 3),
    path('M38 110 L120 100 L120 120 L38 120 Z', '#d6c3a5', C.ink, 1.2),
    upper ? greyed(floorSeats) : floorSeats, upper ? balcSeats : greyed(balcSeats),
    upper ? frame(74, 30, 44, 34) : frame(38, 80, 80, 30));
};
/** succé/flopp: the auditorium seen from the stage. */
const houseView = (full: boolean) => {
  const cols = [C.red, C.navy, C.green, C.purple, C.orange, C.denim, C.yellow];
  const rows = [52, 74, 96].map((y, r) => all(...range(6).map((i) => {
    const x = 14 + i * 18 + (r % 2) * 4;
    const filled = full || (r === 1 && i === 2);
    return all(seat(x, y + 14, filled ? SEAT : '#c9a2a8'), filled ? (full ? fig(x, 0.24, { top: cols[(i + r) % 7]!, mouth: 'wide', armL: ARMS_UP_L, armR: ARMS_UP_R }, y + 12) : fig(x, 0.24, { top: C.grey, eyes: 'closed', mouth: 'flat' }, y + 12)) : '');
  })));
  return all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), rect(0, 34, 120, 86, '#4a3c4f', 0, null), ...rows,
    full ? all(...range(5).map((i) => star(26 + i * 17, 14, 6, C.yellow)), flower(10, 30, 1, C.pink), flower(110, 30, 1, C.yellow))
      : all(...range(5).map((i) => star(26 + i * 17, 14, 6, i === 0 ? C.yellow : '#55586a')), path('M98 20 C102 26 104 30 100 34', 'none', GREEN, 1.6), circle(100, 36, 3, '#8a7a5a', C.ink, 0.8)));
};
/** A timeline of scene blocks (for ta om / dra igenom). */
const sceneStrip = (y: number, n = 6, hl: number[] = []) => all(...range(n).map((i) => all(rect(8 + i * 18, y, 16, 20, hl.includes(i) ? '#fde3c8' : '#d8e8f7', 2, C.ink, 1.2), fig(16 + i * 18, 0.12, { top: [C.red, C.green, C.purple, C.denim][i % 4]! }, y + 17))));

export const THEA_MOTIFS: Record<string, Svg> = {
  // ── 4451 Scen och scenografi ─────────────────────────────────────
  'thea.teater': all(stageBox(84), curtains(16, 84), beam(46, 0, 34, 98), beam(80, 0, 34, 98),
    W(46, 0.6, { top: C.orange, mouth: 'open', armR: GESTURE_R }, 98), M(80, 0.62, { top: C.purple, extra: crown(0, -96, 1), front: cape(RED), armL: [[-16, -60], [-26, -66]] }, 98),
    say(12, 22, 26, 14, 40, 44, 2), heads(7, 120)),
  'thea.scenkonst': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M8 84 L112 84 L104 98 L16 98 Z', BOARD, C.ink, 1.6), rect(8, 76, 104, 8, '#a8744c', 1, C.ink, 1.4),
    M(28, 0.5, { top: C.purple, extra: crown(0, -96, 0.9), armR: GESTURE_R, mouth: 'open' }, 76),
    W(60, 0.5, { top: C.pink, bottom: C.pink, armL: ARMS_UP_L, armR: [[16, -70], [26, -80]], tilt: 8, mouth: 'smile' }, 76),
    W(92, 0.5, { top: C.yellow, mouth: 'open', armL: [[-14, -50], [-4, -56]], armR: [[14, -50], [4, -56]] }, 76),
    path('M100 24 L100 12 L106 11 L106 22', 'none', C.navy, 1.6), ellipse(98.5, 24, 2.4, 1.8, C.navy, null), ellipse(104.5, 22.5, 2.4, 1.8, C.navy, null),
    line('M52 30 C56 24 64 24 68 30', C.grey, 1.4), frame(6, 8, 108, 94), heads(6, 120, '#55586a')),
  'thea.salong.2': all(rect(0, 0, 120, 120, '#3b2a33', 0, null), path('M0 0 L120 0 L120 20 L0 20 Z', '#5b4250', null),
    ...[[30, 6], [48, 7], [66, 7], [84, 7]].map(([y, n], r) => all(...range(n!).map((i) => { const x = f1(10 + i * (100 / (n! - 1)) + (r % 2) * 4 - 2); return all(seat(x, y! + 12, SEAT, 1.1), head(x, y! + 2, [C.navy, C.red, C.green, C.purple, C.orange, C.denim, C.yellow][(i + r) % 7]!, 1.05)); }))),
    frame(4, 22, 112, 82), rect(0, 104, 120, 16, BOARD, 0, null), line('M0 104 L120 104', C.ink, 1.6), path('M0 104 L10 104 L8 120 L0 120 Z M120 104 L110 104 L112 120 L120 120 Z', CURT, null)),
  'thea.ridå': all(rect(0, 0, 120, 120, STAGE, 0, null), rect(0, 100, 120, 20, BOARD, 0, null), line('M0 100 L120 100', C.ink, 1.6),
    path('M6 12 L114 12 L114 100 L6 100 Z', CURT, C.ink, 1.6), line(range(9).map((i) => `M${18 + i * 12} 14 C${15 + i * 12} 40 ${20 + i * 12} 70 ${16 + i * 12} 100`).join(' '), '#6e1f2c', 1.6),
    line(range(9).map((i) => `M${12 + i * 12} 14 C${10 + i * 12} 40 ${14 + i * 12} 70 ${11 + i * 12} 100`).join(' '), CURT2, 1.2),
    path('M2 4 L118 4 L118 16 ' + range(8).map((i) => `Q${f1(110.75 - i * 14.5)} 24 ${f1(103.5 - i * 14.5)} 16`).join(' ') + ' Z', CURT2, C.ink, 1.4), line('M2 16 L118 16', C.gold, 1.4),
    line(range(14).map((i) => `M${8 + i * 8} 98 L${8 + i * 8} 102`).join(' '), C.gold, 1.6), frame(4, 2, 112, 102)),
  'thea.scenografi': all(stageBox(84), curtains(10, 84),
    rect(14, 14, 92, 70, '#9cc8e6', 0, null), circle(92, 26, 6, '#fff6c8', null), path('M20 30 C26 24 34 26 36 30 C40 28 46 30 44 34 L20 34 Z', C.white, null),
    house(48, 84, 1.25), tree(90, 70, 1.2), rect(66, 74, 12, 10, C.tan, 1, C.ink, 1.2), line('M68 84 L68 88 M76 84 L76 88', C.brown, 1.6),
    frame(12, 12, 96, 76)),
  'thea.kuliss': all(stageBox(84), curtains(8, 84),
    greyed(rect(28, 14, 64, 70, '#9cc8e6', 0, null), house(60, 84, 1.2)),
    path('M10 20 L34 26 L34 86 L10 92 Z', '#5f9e62', C.ink, 1.6), tree(22, 58, 0.9, '#3f7f4d'), tree(26, 82, 0.6, '#3f7f4d'),
    line('M34 30 L46 86 M34 60 L46 86', '#a8744c', 2.2), line('M42 86 L50 86', '#a8744c', 2.6),
    M(54, 0.4, { black: true, mouth: 'flat' }, 92), frame(6, 16, 46, 80)),
  'thea.rampljus.2': all(rect(0, 0, 120, 120, '#26232f', 0, null), beam(60, 0, 54, 106), ellipse(60, 106, 30, 5, 'rgba(255,240,180,0.55)', null),
    W(60, 0.72, { top: C.red, mouth: 'smile', armL: [[-16, -60], [-24, -70]], armR: [[16, -60], [24, -70]] }, 106),
    ...[[14, 40], [104, 36], [20, 80], [100, 78]].map(([x, y]) => all(rect(x! - 8, y! - 6, 16, 11, C.dark, 2, C.ink, 1), circle(x!, y!, 3.4, '#55586a', C.ink, 1), sparkle(x! + (x! < 60 ? 8 : -8), y! - 8, 4, C.yellow))),
    greyed(fig(10, 0.4, {}, 120), fig(110, 0.4, { hair: 'long' }, 120)), ring(60, 56, 26)),
  'thea.vridscen': all(stageBox(70), curtains(8, 70), ellipse(60, 92, 50, 18, '#a8744c', C.ink, 1.6), ellipse(60, 92, 4, 1.6, C.ink, null),
    moving('thea-vrid-a', '0%,30%{transform:translate(30px,-6px) scale(.8);opacity:.4}70%,100%{transform:translate(0,0) scale(1);opacity:1}', { dur: 3.6 }, tree(48, 80, 1), tree(66, 84, 0.8), W(56, 0.36, { top: C.orange }, 96)),
    moving('thea-vrid-b', '0%,30%{transform:translate(0,0);opacity:1}70%,100%{transform:translate(-30px,-6px) scale(.8);opacity:.35}', { dur: 3.6 }, greyed(house(94, 88, 0.6))),
    path('M18 104 C30 116 90 116 102 104', 'none', HL, 2.6), arrow(96, 108, 104, 102, HL, 2.6)),
  'thea.scenarbetare': all(stageBox(84), curtains(8, 84),
    moving('thea-arbetare', '0%{transform:translate(-14px,0)}100%{transform:translate(0,0)}', { dur: 2.8 },
      path('M50 22 L96 22 L96 96 L50 96 Z', WALL, C.ink, 1.6), rect(58, 34, 14, 14, '#bfe3f5', 1, C.ink, 1.2), line('M65 34 L65 48 M58 41 L72 41', C.ink, 1), door(76, 56, 14, 40, '#b98a5c'), line('M50 96 L96 96', '#a8744c', 3), circle(56, 100, 3.4, C.dark, null), circle(90, 100, 3.4, C.dark, null),
      M(32, 0.66, { black: true, mouth: 'closed', armR: [[18, -58], [22, -50]], armL: [[10, -58], [20, -48]] }, 104)),
    ring(30, 50, 15)),
  'thea.dockteater': all(ground(), rect(22, 46, 76, 66, '#e8c35a', 2, C.ink, 1.8), ...range(4).map((i) => rect(28 + i * 18, 46, 8, 66, '#d8513f', 0, null)),
    path('M18 36 L102 36 L98 46 L22 46 Z', C.red, C.ink, 1.6), rect(32, 18, 56, 28, STAGE, 2, C.ink, 1.6),
    path('M32 18 L40 18 C38 28 40 38 36 46 L32 46 Z M88 18 L80 18 C82 28 80 38 84 46 L88 46 Z', CURT, null),
    at(50, 38, 1, path('M-7 8 L-7 -2 C-7 -6 7 -6 7 -2 L7 8 Z', C.purple, C.ink, 1.2), circle(0, -8, 6, C.skin, C.ink, 1.2), crown(0, -15, 0.7), circle(-2, -9, 0.8, C.ink, null), circle(2, -9, 0.8, C.ink, null)),
    at(70, 38, 1, path('M-7 8 L-7 -2 C-7 -6 7 -6 7 -2 L7 8 Z', C.green, C.ink, 1.2), circle(0, -8, 6, '#c9a27a', C.ink, 1.2), path('M-6 -10 L-4 -16 L-1 -11 M6 -10 L4 -16 L1 -11', '#c9a27a', C.ink, 1), circle(-2, -9, 0.8, C.ink, null), circle(2, -9, 0.8, C.ink, null)),
    ...[10, 110].map((x) => fig(x, 0.36, { top: x < 60 ? C.yellow : C.sky, mouth: 'wide', armL: ARMS_UP_L }, 112)), ring(60, 30, 22)),
  'thea.friluftsteater': all(rect(0, 0, 120, 120, '#cfe8f7', 0, null), circle(100, 18, 8, C.yellow, null), rect(0, 84, 120, 36, '#8fc77a', 0, null),
    tree(16, 62, 1.6), tree(104, 66, 1.4), path('M30 64 L90 64 L94 76 L26 76 Z', BOARD, C.ink, 1.6), rect(26, 76, 68, 6, '#6e4529', 1, C.ink, 1.2),
    M(48, 0.4, { top: C.purple, extra: crown(0, -96, 0.9), armR: GESTURE_R }, 64), W(72, 0.4, { top: C.orange, mouth: 'open' }, 64),
    ...[20, 40, 60, 80, 100].map((x, i) => all(head(x, 106, [C.red, C.navy, C.yellow, C.green, C.denim][i]!, 1.6))), line('M30 112 L90 112', C.white, 2), rect(86, 100, 18, 8, '#e6d3b3', 2, C.ink, 1)),
  'thea.fjärde-väggen': all(rect(0, 0, 120, 120, C.paper, 0, null),
    path('M20 20 L100 20 L86 34 L34 34 Z', '#d9cbb2', C.ink, 1.4), path('M20 20 L34 34 L34 84 L20 98 Z', WALL, C.ink, 1.4), path('M100 20 L86 34 L86 84 L100 98 Z', WALL, C.ink, 1.4),
    rect(34, 34, 52, 50, '#efe6d6', 0, C.ink, 1.2), path('M20 98 L34 84 L86 84 L100 98 Z', BOARD, C.ink, 1.4), rect(52, 44, 14, 12, '#bfe3f5', 1, C.ink, 1),
    W(48, 0.36, { top: C.orange, mouth: 'open' }, 90), M(72, 0.38, { top: C.denim, mouth: 'smile' }, 90),
    rect(20, 20, 80, 78, 'rgba(140,199,232,0.25)', 0, null), line('M20 20 L100 20 L100 98 L20 98 Z', HL, 2.6, '5 4'),
    heads(5, 120, '#55586a', 16, 104)),

  // ── 4452 Roller och rolltolkning ─────────────────────────────────
  'thea.skådespelare': all(stageBox(88), curtains(14, 88), beam(60, 0, 48, 106),
    M(60, 0.9, { top: C.purple, bottom: C.dark, mouth: 'open', extra: crown(0, -96, 1.1), front: cape(RED), armL: [[-14, -56], [-4, -58]], armR: [[18, -68], [28, -80]] }, 106),
    ring(60, 60, 30), heads(5, 122, '#1c1a28', 10, 110)),
  // roll (theatre sense), redrawn after match test round 1: the same actor (same face, red hair, a mole) three times in
  // three roles – king, farmer, detective – each with a script sheet of their own. Same size, same light, no spotlight,
  // nobody marked, so no main role and no cast list; the dashed lines tie the three faces to one person.
  'thea.roll.2': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    ...[
      { x: 20, top: C.purple, bot: C.dark, hat: crown(0, -96, 1.2), front: cape(RED), prop: '' },
      { x: 60, top: '#5f8f4a', bot: '#7a5a3a', hat: all(ellipse(0, -90, 15, 3.4, '#e3c16f', C.ink, 1.2), path('M-8 -90 C-8 -100 8 -100 8 -90 Z', '#e3c16f', C.ink, 1.2), line('M-8 -92 L8 -92', RED, 1.6)), front: '', prop: all(line('M17 -30 L17 -2', '#a0673d', 2), line('M13 -34 L13 -28 M17 -36 L17 -28 M21 -34 L21 -28 M13 -28 L21 -28', C.grey, 1.4)) },
      { x: 100, top: '#a0673d', bot: '#5a4636', hat: all(ellipse(0, -89, 13, 3, '#6b5136', C.ink, 1.2), path('M-9 -89 C-9 -100 9 -100 9 -89 Z', '#6b5136', C.ink, 1.2)), front: line('M-10 -64 L0 -48 L10 -64', '#7a5a3a', 1.6), prop: all(line('M17 -38 L22 -46', C.dark, 2), circle(25, -50, 5, 'rgba(191,227,245,0.7)', C.ink, 1.4)) },
    ].map((r) => all(
      fig(r.x, 0.72, { top: r.top, bottom: r.bot, hairCol: '#b8562e', mouth: 'smile', armL: [[-14, -50], [-18, -40]], armR: [[14, -50], [17, -36]], extra: all(circle(5, -76, 0.9, C.ink, null), r.hat), front: all(r.front, g('translate(-20 -48)', rect(-6, -4, 12, 15, C.white, 1, C.ink, 1), line('M-4 0 L4 0 M-4 3 L3 3 M-4 6 L4 6', C.grey, 0.8)), r.prop) }))),
    line('M28 30 Q40 22 52 30 M68 30 Q80 22 92 30', C.grey, 1.4, '3 3')),
  'thea.spela.3': all(stageBox(86), curtains(10, 86),
    rect(70, 70, 26, 30, C.purple, 3, C.ink, 1.4), rect(66, 62, 34, 10, C.gold, 2, C.ink, 1.2),
    M(82, 0.5, { top: C.purple, extra: crown(0, -96, 1), front: cape(RED), mouth: 'frown' }, 92),
    waSway('thea-spela', 10, W(40, 0.66, { top: C.orange, mouth: 'open', armL: [[-16, -60], [-24, -72]], armR: GESTURE_R }, 104)),
    say(4, 16, 30, 16, 32, 44, 2), heads(6, 122)),
  'thea.huvudroll': castLine(0),
  'thea.biroll': castLine(3),
  'thea.rollbesättning': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(8, 8, 104, 76, '#c9a27a', 3, C.ink, 1.8), rect(12, 12, 96, 68, '#e9d9bf', 2, null),
    ...[[28, 'crown'], [60, 'apron'], [92, 'hat']].map(([x, k], i) => {
      const xx = x as number;
      const icon = k === 'crown' ? crown(xx, 24, 1.4) : k === 'apron' ? path(`M${xx - 6} 18 L${xx + 6} 18 L${xx + 8} 32 L${xx - 8} 32 Z`, C.white, C.ink, 1.2) : path(`M${xx - 10} 30 L${xx + 10} 30 L${xx + 6} 26 L${xx + 6} 18 L${xx - 6} 18 L${xx - 6} 26 Z`, C.dark, C.ink, 1.2);
      const photo = all(rect(xx - 10, 46, 20, 24, C.white, 1.5, C.ink, 1.2), circle(xx, 55, 5, C.skin, C.ink, 1), path(`M${xx - 5} 54 C${xx - 5} 48 ${xx + 5} 48 ${xx + 5} 54`, [C.hair, '#c08a3e', C.hair][i]!, C.ink, 0.8), rect(xx - 7, 61, 14, 7, [C.orange, C.green, C.denim][i]!, 2, null));
      return all(icon, line(`M${xx} 34 L${xx} 44`, C.ink, 1.4, '2 2'), i === 2 ? '' : photo);
    }),
    moving('thea-rollbes', '0%{transform:translate(10px,30px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 },
      rect(82, 46, 20, 24, C.white, 1.5, C.ink, 1.2), circle(92, 55, 5, C.skin, C.ink, 1), path('M87 54 C87 48 97 48 97 54', C.hair, C.ink, 0.8), rect(85, 61, 14, 7, C.denim, 2, null),
      g('translate(100 82)', rect(-6, -2, 14, 26, C.skin, 4, C.ink, 1.4), rect(-8, 0, 6, 12, C.skin, 3, C.ink, 1.2))),
    frame(80, 44, 24, 28), M(22, 0.36, { top: C.dark, ...scriptIn() }, 120)),
  'thea.provspela.2': all(rect(0, 0, 120, 120, STAGE, 0, null), rect(0, 74, 120, 46, BOARD, 0, null), planks(74),
    waSway('thea-prov', 8, W(36, 0.72, { top: C.orange, mouth: 'open', armL: [[-16, -60], [-26, -70]], armR: GESTURE_R, extra: all(rect(-6, -60, 12, 9, C.white, 1, C.ink, 0.8), T(0, -53, '7', 7, C.ink, 900)) }, 100)),
    rect(68, 92, 52, 8, '#5a4a3a', 1, C.ink, 1.2),
    ...[78, 94, 110].map((x, i) => all(circle(x, 82, 5, C.skin, C.ink, 1.1), path(`M${x - 5} 81 C${x - 5} 75 ${x + 5} 75 ${x + 5} 81`, [C.hair, C.grey, '#c08a3e'][i]!, C.ink, 0.8), rect(x - 6, 87, 12, 6, [C.navy, C.green, C.purple][i]!, 2, C.ink, 0.8))),
    rect(84, 89, 10, 3, C.white, 0.5, C.ink, 0.6), thumbUp(108, 70, 0.9), ring(36, 62, 22)),
  'thea.inhoppare': all(stageBox(86), curtains(10, 86),
    greyed(M(16, 0.5, { top: C.purple, mouth: 'frown', eyes: 'closed', extra: line('M6 -74 L14 -70', C.white, 2) }, 102)), line('M24 50 L28 46', RED, 1.6),
    moving('thea-inhopp', '0%{transform:translate(40px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 },
      M(66, 0.68, { top: C.purple, bottom: C.dark, mouth: 'smile', extra: crown(0, -96, 1.1), front: cape(RED), armR: GESTURE_R }, 104)),
    arrow(108, 30, 84, 30, HL, 3), ring(66, 56, 22), heads(5, 122)),
  'thea.leva-sig-in-i': all(rect(0, 0, 120, 120, STAGE, 0, null), rect(0, 96, 120, 24, BOARD, 0, null),
    W(44, 0.84, { top: C.orange, mouth: 'flat', eyes: 'closed', armL: [[-12, -52], [-2, -58]], armR: [[12, -52], [2, -58]] }, 112),
    ellipse(90, 30, 26, 22, C.white, C.ink, 1.4), circle(70, 58, 4, C.white, C.ink, 1.2), circle(62, 66, 2.6, C.white, C.ink, 1),
    W(90, 0.36, { top: C.grey, bottom: C.dark, hair: 'grey', mouth: 'frown', armL: [[-12, -48], [-4, -40]] }, 48),
    path('M84 24 C84 26 86 26 86 24', 'none', '#8cc7e8', 1),
    moving('thea-inlev', '0%,20%{opacity:0;transform:translate(46px,-60px) scale(.4)}80%,100%{opacity:.55;transform:translate(0,0) scale(1)}', { dur: 3.4 },
      path('M28 40 C24 26 64 26 60 40 C60 32 28 32 28 40 Z', '#d9d9d9', C.ink, 1)),
    ring(44, 42, 15)),
  'thea.rolltolkning': all(rect(0, 0, 120, 120, C.paper, 0, null),
    line('M60 4 L60 10', C.ink, 1.4), hanger(60, 16, 1.4), path('M46 18 L74 18 L80 46 L40 46 Z', RED, C.ink, 1.4), crown(60, 30, 1.2),
    arrow(50, 50, 30, 62, C.grey, 2.2), arrow(70, 50, 90, 62, C.grey, 2.2), ground(),
    M(28, 0.5, { top: C.purple, extra: all(crown(0, -96, 1.1), line('M-7 -86 L-2 -83 M7 -86 L2 -83', C.ink, 1.6)), front: cape(RED), mouth: 'frown', armR: [[16, -64], [22, -76]], armL: [[-14, -56], [-20, -48]] }),
    line('M40 66 L44 62 M42 70 L47 68', RED, 1.6),
    M(92, 0.5, { top: C.purple, extra: crown(0, -96, 1.1), front: cape(RED), mouth: 'frown', eyes: 'wide', armL: [[-12, -54], [-4, -60]], armR: [[12, -54], [4, -60]] }),
    path('M86 70 C86 72 88 72 88 70', 'none', '#8cc7e8', 1.4), sweat(86, 68), sweat(98, 68),
    frame(10, 56, 36, 58, HL), frame(74, 56, 36, 58, HL)),
  'thea.överspela': all(stageBox(88),
    greyed(M(96, 0.5, { top: C.green, mouth: 'flat' }, 104)),
    waSway('thea-over', 14, W(44, 0.86, { top: C.orange, mouth: 'wide', eyes: 'wide', armL: [[-20, -74], [-30, -92]], armR: [[20, -74], [30, -92]] }, 106)),
    ...[[18, 22], [70, 22], [16, 50], [72, 52]].map(([x, y]) => line(`M${x} ${y} l${x! < 44 ? -6 : 6} -4 M${x} ${y! + 6} l${x! < 44 ? -7 : 7} 0`, HL, 2)),
    sweat(36, 40), sweat(52, 38), path('M38 36 C36 42 38 46 36 50', 'none', '#8cc7e8', 2), heads(5, 122)),

  // ── 4453 Manus och repliker ──────────────────────────────────────
  'thea.pjäs': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    rect(64, 22, 46, 74, C.white, 2, C.ink, 1.4), ...[30, 42, 54, 66, 78].map((y, i) => all(rect(68, y, 8, 4, i % 2 ? C.denim : C.orange, 1, null), line(`M80 ${y + 2} L${104 - (i % 2) * 8} ${y + 2}`, C.grey, 1.4))),
    rect(14, 12, 52, 86, '#7a2e3a', 3, C.ink, 1.8), rect(14, 12, 7, 86, '#5a1f2a', 2, C.ink, 1.2),
    rect(27, 24, 32, 30, STAGE, 1, C.ink, 1.2), path('M27 24 L32 24 C30 34 32 44 29 54 L27 54 Z M59 24 L54 24 C56 34 54 44 57 54 L59 54 Z', CURT, null), rect(27, 48, 32, 6, BOARD, 0, null),
    fig(38, 0.18, { top: C.orange, armR: GESTURE_R }, 50), fig(49, 0.18, { top: C.green }, 50),
    line('M29 68 L57 68 M32 77 L54 77', C.gold, 2.4), frame(10, 8, 60, 94)),
  'thea.dramatiker': all(ground(), rect(54, 70, 62, 6, C.tan, 1, C.ink, 1.6), line('M60 76 L60 112 M110 76 L110 112', C.brown, 3),
    sitter(74, 96, 0.82, { top: C.denim, mouth: 'closed', armR: [[14, -46], [22, -36]], armL: [[-12, -46], [-2, -38]] }),
    script(88, 54, 22, 16, 4), line('M92 66 L98 58', C.ink, 1.8), rect(58, 60, 16, 10, C.white, 1, C.ink, 1.1), rect(60, 56, 16, 10, C.white, 1, C.ink, 1.1),
    path('M8 10 L48 10 L48 44 L8 44 Z', STAGE, C.ink, 1.4), path('M8 10 L14 10 C12 22 14 34 11 44 L8 44 Z M48 10 L42 10 C44 22 42 34 45 44 L48 44 Z', CURT, null),
    fig(22, 0.2, { top: C.orange, armR: GESTURE_R }, 42), fig(34, 0.2, { top: C.green }, 42),
    circle(54, 46, 2.6, C.white, C.ink, 1), circle(60, 38, 1.8, C.white, C.ink, 0.9), ring(74, 60, 13)),
  'thea.akt.2': playBar(0, -1),
  'thea.scen.2': playBar(1, 1),
  'thea.scenanvisning': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(10, 6, 70, 106, C.white, 2, C.ink, 1.6),
    ...[14, 30, 64, 82].map((y, i) => all(rect(16, y, 10, 4, [C.orange, C.denim, C.orange, C.denim][i]!, 1, null), line(`M30 ${y + 2} L${70 - (i % 2) * 8} ${y + 2} M16 ${y + 9} L${66 - i * 3} ${y + 9}`, C.grey, 1.4))),
    T(18, 52, '(', 12, HL, 700), T(70, 52, ')', 12, HL, 700), line('M24 46 L66 46 M24 52 L56 52', HL, 2, '0'), frame(12, 38, 66, 20),
    rect(86, 40, 30, 46, '#efe6d6', 2, C.ink, 1.2), rect(98, 48, 12, 14, '#bfe3f5', 1, C.ink, 1), fig(94, 0.32, { top: C.orange, armR: [[16, -62], [24, -66]] }, 84), arrow(80, 48, 86, 52, HL, 1.8)),
  'thea.sufflör': all(stageBox(70), curtains(10, 70),
    W(64, 0.62, { top: C.orange, mouth: 'flat', eyes: 'wide', armL: [[-14, -58], [-10, -70]] }, 84), path('M80 26 C84 22 88 26 84 30', 'none', C.white, 1.6), circle(84, 33, 1, C.white, null),
    path('M30 84 L60 84 L60 92 C60 80 30 80 30 92 Z', CURT2, C.ink, 1.4), path('M26 92 C26 74 64 74 64 92 Z', CURT, C.ink, 1.4), rect(24, 92, 42, 28, '#3b2a3a', 1, C.ink, 1.4),
    circle(45, 98, 6, C.skin, C.ink, 1.2), path('M39 97 C39 90 51 90 51 97', C.hair, C.ink, 1), rect(36, 104, 18, 10, C.white, 1, C.ink, 1), line('M39 107 L51 107 M39 110 L49 110', C.grey, 0.8),
    line('M52 90 C58 84 60 80 58 76', C.white, 1.4, '2 2'), arrow(56, 80, 60, 74, C.white, 1.6), circle(30, 100, 2.4, C.yellow, null),
    ring(45, 100, 14)),
  'thea.stickreplik': all(stageBox(92), curtains(8, 92),
    W(30, 0.6, { top: C.orange, mouth: 'open', armR: GESTURE_R }, 104), M(90, 0.62, { top: C.denim, mouth: 'open', eyes: 'wide' }, 104),
    path('M8 14 L58 14 Q62 14 62 18 L62 36 Q62 40 58 40 L36 40 L30 48 L30 40 L12 40 Q8 40 8 36 L8 18 Q8 14 12 14 Z', C.white, C.ink, 1.3), line('M14 22 L56 22 M14 30 L40 30', C.grey, 1.6), line('M42 30 L56 30', HL, 3.2),
    path('M58 32 L68 34 L64 38 L76 42', 'none', HL, 2.4), arrow(70, 40, 78, 44, HL, 2.4),
    say(72, 50, 40, 16, 88, 72, 1), ring(49, 30, 9)),
  'thea.komma-av-sig': all(stageBox(88), curtains(10, 88), beam(54, 0, 40, 104),
    waShake('thea-avsig', W(54, 0.8, { top: C.orange, mouth: 'o', eyes: 'wide', armL: [[-14, -58], [-8, -72]] }, 104)), sweat(46, 30), sweat(66, 28),
    path('M70 10 L112 10 Q116 10 116 14 L116 30 Q116 34 112 34 L84 34 L76 42 L78 34 L74 34 Q70 34 70 30 L70 14 Q70 10 74 10 Z', C.white, C.ink, 1.3),
    line('M76 18 L96 18', C.grey, 1.8), line('M98 18 L110 18', C.grey2, 1.6, '2 3'), T(92, 31, '?', 11, RED, 900), heads(6, 122)),
  'thea.entré.3': wingWalk(true, 'thea-entre'),
  'thea.sorti': wingWalk(false, 'thea-sorti'),
  'thea.dramatisera': all(rect(0, 0, 120, 120, C.paper, 0, null),
    at(24, 62, 1, rect(-16, -22, 32, 44, '#3f6fb5', 2, C.ink, 1.6), rect(-16, 16, 32, 6, C.white, 1, C.ink, 1.2), line('M-10 -12 L10 -12 M-10 -6 L6 -6', C.white, 1.6), tree(0, 8, 0.6), line('M-12 -22 L-12 16', '#2e5590', 1.4)),
    waIn('thea-dram', -16, 0, arrow(44, 62, 66, 62, HL, 3.4)),
    waGrow('thea-dram-st', path('M68 30 L116 30 L116 92 L68 92 Z', STAGE, C.ink, 1.4), path('M68 30 L74 30 C72 50 74 70 70 92 L68 92 Z M116 30 L110 30 C112 50 110 70 114 92 L116 92 Z', CURT, null),
      rect(68, 82, 48, 10, BOARD, 0, null), tree(84, 72, 0.6), fig(94, 0.26, { top: C.orange, armR: GESTURE_R }, 86), fig(104, 0.26, { top: C.green }, 86)),
    ground()),

  // ── 4454 Regi och repetition ─────────────────────────────────────
  'thea.regissör': all(rect(0, 0, 120, 120, '#3b2a33', 0, null), rect(0, 0, 120, 58, STAGE, 0, null), rect(0, 46, 120, 12, BOARD, 0, null), line('M0 58 L120 58', C.ink, 1.6),
    fig(40, 0.36, { top: C.orange, mouth: 'open' }, 54), fig(80, 0.36, { top: C.denim, armR: GESTURE_R }, 54), line('M48 40 L70 40', C.grey2, 1.2, '2 2'),
    ...range(5).map((i) => seat(14 + i * 23, 112, '#7a2e3a', 1.1)),
    sitter(60, 104, 0.72, { top: C.dark, bottom: C.navy, mouth: 'open', armR: [[14, -60], [20, -74]], armL: [[-12, -46], [-4, -38]], front: rect(-10, -42, 18, 8, C.white, 1, C.ink, 1) }),
    path('M71 50 C74 46 78 46 79 50 L79 56 L71 56 Z', C.skin, C.ink, 1.1), ring(60, 70, 16)),
  'thea.sätta-upp.2': all(rect(0, 0, 120, 120, C.paper, 0, null),
    moving('thea-satt1', '0%{opacity:0}10%,100%{opacity:1}', { dur: 4.2 }, script(6, 40, 22, 30, 5)),
    moving('thea-satt2', '0%,30%{opacity:0}40%,100%{opacity:1}', { dur: 4.2 }, arrow(30, 55, 38, 55, C.grey, 2), rect(40, 34, 34, 42, '#e9dcc6', 2, C.ink, 1.2), fig(50, 0.28, { top: C.orange, ...scriptIn() }, 72), fig(64, 0.28, { top: C.green, ...scriptIn() }, 72)),
    moving('thea-satt3', '0%,60%{opacity:0}70%,100%{opacity:1}', { dur: 4.2 }, arrow(76, 55, 82, 55, C.grey, 2),
      rect(84, 26, 32, 50, STAGE, 2, C.ink, 1.2), path('M84 26 L89 26 C87 40 89 60 86 76 L84 76 Z M116 26 L111 26 C113 40 111 60 114 76 L116 76 Z', CURT, null), rect(84, 68, 32, 8, BOARD, 0, null),
      fig(96, 0.24, { top: C.purple, extra: crown(0, -96, 1.2) }, 72), fig(106, 0.24, { top: C.orange }, 72), heads(4, 98, '#1c1a28', 86, 114)),
    frame(82, 22, 36, 80)),
  'thea.teatergrupp': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 96, 120, 24, '#c9a27a', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    ...[[18, 'w', C.yellow], [38, 'm', C.green], [60, 'w', C.purple], [82, 'm', C.denim], [102, 'w', C.red]].map(([x, k, c], i) => (k === 'w' ? W : M)(x as number, 0.56, { top: c as string, bottom: i % 2 ? C.navy : C.denim, skirt: false, mouth: 'wide', armL: [[-14, -56], [-22, -60]], armR: [[14, -56], [22, -60]], hairCol: i === 3 ? C.grey : C.hair }, 108)),
    rect(4, 10, 30, 22, C.white, 2, C.ink, 1.2), fig(12, 0.12, { top: C.orange }, 28), fig(20, 0.12, { top: C.green }, 28), fig(28, 0.12, { top: C.purple }, 28),
    frame(4, 44, 112, 70)),
  'thea.genomläsning.2': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), ellipse(60, 84, 50, 14, C.tan, C.ink, 1.8),
    ...[[22, C.orange, 'w'], [46, C.green, 'm'], [74, C.purple, 'w'], [98, C.denim, 'm']].map(([x, c, k], i) => sitter(x as number, 76, 0.5, { top: c as string, hair: k === 'w' ? 'long' : 'short', mouth: i === 1 ? 'open' : 'closed', ...scriptIn() })),
    ...[28, 52, 72, 92].map((x) => all(rect(x - 6, 82, 12, 8, C.white, 1, C.ink, 0.9), line(`M${x - 4} 85 L${x + 4} 85 M${x - 4} 87.5 L${x + 2} 87.5`, C.grey, 0.7))),
    say(52, 8, 30, 14, 48, 34, 2), line('M30 100 L30 112 M90 100 L90 112', C.brown, 3)),
  'thea.studera-in': all(rect(0, 0, 120, 120, '#f3ead9', 0, null), ground(), rect(84, 60, 30, 40, '#b0c4de', 2, C.ink, 1.4), line('M99 60 L99 100 M84 80 L114 80', C.white, 1.6),
    moving('thea-studera', '0%,100%{transform:translate(0,0)}50%{transform:translate(18px,0)}', { dur: 3 },
      M(38, 0.84, { top: C.green, mouth: 'open', armL: [[-12, -50], [-4, -54]], armR: [[16, -64], [24, -74]], front: all(rect(-14, -60, 14, 12, C.white, 1.2, C.ink, 1), line('M-12 -56 L-3 -56 M-12 -53 L-5 -53', C.grey, 0.8)) })),
    ellipse(80, 22, 24, 14, C.white, C.ink, 1.4), circle(62, 38, 3, C.white, C.ink, 1), rect(64, 14, 32, 16, STAGE, 1, null), fig(76, 0.16, { top: C.green, armR: GESTURE_R }, 28), rect(64, 26, 32, 4, BOARD, 0, null),
    path('M50 30 C52 26 56 26 58 30', 'none', C.grey, 1.2)),
  'thea.repetitionssal': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(8, 14, 104, 50, '#d8ecf5', 1, C.ink, 1.6), line('M34 14 L34 64 M60 14 L60 64 M86 14 L86 64', C.ink, 1.2), line('M14 56 L26 22 M64 58 L76 24', C.white, 2),
    line('M4 70 L116 70', '#8a6a4a', 3), rect(0, 72, 120, 48, '#c9a27a', 0, null),
    line('M20 90 L28 98 M28 90 L20 98 M86 84 L94 92 M94 84 L86 92 M50 104 L70 104 M60 96 L60 112', '#f2c14e', 2.6),
    rect(96, 96, 14, 3, C.dark, 1, C.ink, 1), line('M98 99 L98 110 M108 99 L108 110 M98 88 L98 96', C.dark, 1.6),
    fig(44, 0.4, { top: C.orange, ...scriptIn() }, 100)),
  'thea.stryka.3': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(20, 8, 72, 104, C.white, 2, C.ink, 1.6),
    ...range(8).map((i) => line(`M28 ${22 + i * 11} L${84 - (i % 3) * 8} ${22 + i * 11}`, C.grey, 1.8)),
    moving('thea-stryk', '0%,20%{transform:scale(0,1)}70%,100%{transform:scale(1,1)}', { dur: 2.6, spin: true }, line('M24 55 L86 55 M24 66 L82 66', RED, 3)),
    g('translate(92 70) rotate(40)', rect(-3, -30, 6, 30, C.red, 1, C.ink, 1.2), path('M-3 0 L3 0 L0 6 Z', C.beige, C.ink, 1)), frame(22, 48, 68, 24)),
  'thea.uppvärmning.3': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 96, 120, 24, '#c9a27a', 0, null),
    waBob('thea-uppv1', 6, W(26, 0.56, { top: C.orange, skirt: false, bottom: C.navy, mouth: 'wide', armL: ARMS_UP_L, armR: ARMS_UP_R }, 104)),
    waSway('thea-uppv2', 12, M(62, 0.56, { top: C.green, mouth: 'smile', armL: [[-18, -60], [-30, -60]], armR: [[18, -60], [30, -60]], tilt: -10 }, 104)),
    waBob('thea-uppv3', 4, W(96, 0.56, { top: C.purple, skirt: false, bottom: C.dark, mouth: 'o', armL: [[-12, -52], [-6, -70]], armR: [[12, -52], [6, -70]] }, 104)),
    path('M100 26 C104 22 108 26 104 30', 'none', C.grey, 1.4), path('M106 20 C112 14 118 22 112 28', 'none', C.grey, 1.4)),
  'thea.improvisation': all(stageBox(88),
    at(60, 18, 1, script(-12, -12, 24, 22, 4), cross(0, -1, 9, RED)),
    W(32, 0.66, { top: C.orange, mouth: 'wide', armR: GESTURE_R }, 106), M(88, 0.66, { top: C.denim, mouth: 'open', armL: [[-18, -64], [-28, -72]] }, 106),
    ...[[18, 34], [102, 34]].map(([x, y]) => all(circle(x!, y!, 8, C.yellow, C.ink, 1.2), rect(x! - 3, y! + 7, 6, 4, C.grey, 1, C.ink, 1), sparkle(x! + 10, y! - 6, 3, C.gold), sparkle(x! - 10, y! - 6, 3, C.gold)))),
  'thea.timing': all(rect(0, 0, 120, 120, C.paper, 0, null),
    circle(34, 54, 26, C.white, C.ink, 2), rect(30, 22, 8, 6, C.dark, 1, C.ink, 1), path('M34 54 L34 28 A26 26 0 0 1 49 33 Z', 'rgba(63,164,91,0.35)', null),
    line('M34 54 L41 30', HL, 2.6), circle(34, 54, 2.4, C.ink, null), path('M34 28 A26 26 0 0 1 49 33', 'none', GREEN, 4),
    say(64, 14, 36, 16, 70, 38, 1), arrow(52, 30, 62, 26, HL, 2),
    ...[70, 86, 102].map((x, i) => all(fig(x, 0.36, { top: [C.red, C.yellow, C.purple][i]!, mouth: 'wide', eyes: 'closed', armL: ARMS_UP_L }, 112), path(`M${x + 4} 66 q3 -3 6 0 M${x + 4} 72 q3 -3 6 0`, 'none', C.orange, 1.4))), ground()),
  'thea.dra-igenom': all(rect(0, 0, 120, 120, C.paper, 0, null), sceneStrip(56, 6, [0, 1, 2, 3, 4, 5]),
    line('M8 86 L114 86', HL, 4), arrow(104, 86, 116, 86, HL, 4),
    moving('thea-drai', '0%{transform:translate(0,0)}100%{transform:translate(96px,0)}', { dur: 3 }, M(10, 0.24, { top: C.orange, armL: [[-14, -56], [-20, -66]], armR: [[14, -56], [20, -46]], mouth: 'wide' }, 84)),
    ...range(5).map((i) => line(`M${25 + i * 18} 50 L${25 + i * 18} 80`, C.grey2, 1, '2 2')), tick(60, 22, 2)),
  'thea.genrep': all(rect(0, 0, 120, 120, '#3b2a33', 0, null), rect(0, 0, 120, 60, STAGE, 0, null), rect(0, 48, 120, 12, BOARD, 0, null), curtains(8, 60), beam(40, 0, 30, 56), beam(80, 0, 30, 56),
    M(40, 0.4, { top: C.purple, extra: crown(0, -96, 1.1), front: cape(RED), armR: GESTURE_R }, 56), W(80, 0.4, { top: '#3f8f6a', mouth: 'open' }, 56),
    ...[74, 94, 114].map((y) => all(...range(6).map((i) => seat(12 + i * 19, y, '#c9a2a8')))),
    sitter(50, 108, 0.5, { top: C.dark, mouth: 'closed', front: rect(-10, -44, 14, 10, C.white, 1, C.ink, 1) }), ring(50, 92, 11), frame(4, 4, 112, 56)),
  'thea.inspicient': all(rect(0, 0, 120, 120, '#3b2a3a', 0, null), rect(60, 0, 60, 120, STAGE, 0, null), rect(60, 92, 60, 28, BOARD, 0, null), path('M60 0 L68 0 C66 30 68 60 64 92 L60 92 Z', CURT, null),
    fig(96, 0.4, { top: C.orange }, 100), beam(96, 0, 30, 100),
    rect(6, 70, 52, 8, '#5a4a3a', 1, C.ink, 1.2), line('M12 78 L12 112 M52 78 L52 112', '#5a4a3a', 2.6), ...range(4).map((i) => circle(30 + i * 6, 74, 1.8, [RED, GREEN, C.yellow, C.sky][i]!, null)),
    sitter(24, 92, 0.62, { top: C.black, bottom: C.black, mouth: 'open', extra: all(path('M-11 -84 C-11 -96 11 -96 11 -84', 'none', C.dark, 2), rect(-13, -86, 5, 8, C.dark, 2, null), rect(8, -86, 5, 8, C.dark, 2, null), line('M-9 -80 L-4 -73', C.dark, 1.4)), armR: [[14, -46], [20, -40]] }),
    rect(10, 62, 14, 8, C.white, 1, C.ink, 1), lamp(84, 8, 0.9, 10), waPulse('thea-insp', line('M40 54 C54 36 66 22 78 14', C.yellow, 1.6, '3 3'), circle(84, 14, 9, 'rgba(255,240,150,0.5)', null)),
    ring(24, 64, 12)),

  // ── 4455 Kostym och mask ─────────────────────────────────────────
  'thea.kostym.2': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), ground(), gown(44, 1.05, '#7a3fa0', C.gold),
    path('M30 24 L58 24 L64 86 L24 86 Z', 'none', null), crown(44, 10, 1.2),
    rect(78, 30, 34, 4, C.dark, 1, C.ink, 1), hanger(94, 38, 1), path('M84 40 L104 40 L110 80 L78 80 Z', RED, C.ink, 1.4), line('M80 74 L108 74', C.gold, 1.6),
    frame(14, 2, 62, 112)),
  'thea.kostymör': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), ground(), gown(78, 0.9, '#3f8f6a', C.gold),
    W(32, 0.86, { top: C.denim, bottom: C.navy, skirt: false, mouth: 'closed', armR: [[18, -58], [36, -60]], armL: [[-12, -50], [-2, -56]], extra: path('M-10 -66 C-6 -50 6 -50 10 -66', 'none', C.yellow, 1.8) }),
    line('M62 52 L66 50 M64 58 L68 56', C.silver, 1.4), circle(66, 50, 1.2, RED, null), circle(68, 56, 1.2, RED, null),
    at(18, 100, 1, rect(-10, -4, 20, 8, '#d9a066', 2, C.ink, 1), line('M-6 -2 L6 2 M-6 2 L6 -2', C.silver, 1.4)), ring(32, 36, 14)),
  'thea.kostymskiss': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(10, 6, 70, 106, C.white, 2, C.ink, 1.6),
    at(45, 60, 0.9, line('M0 -40 L0 -36', C.ink, 1), circle(0, -42, 6, C.skin, C.ink, 1.2), path('M-6 -44 C-6 -52 6 -52 6 -44', C.hair, C.ink, 1),
      path('M-7 -34 L7 -34 L5 -16 L-5 -16 Z', '#7a3fa0', C.ink, 1.2), path('M-5 -16 L5 -16 C12 0 18 20 20 30 L-20 30 C-18 20 -12 0 -5 -16 Z', '#7a3fa0', C.ink, 1.2), line('M-19 26 L19 26', C.gold, 1.4), crown(0, -52, 0.6)),
    line('M16 100 L74 100', C.grey2, 1, '2 2'),
    ...[[96, 22, '#7a3fa0'], [96, 46, C.gold], [96, 70, '#e8e2d0']].map(([x, y, c]) => all(rect(x as number - 10, y as number - 8, 20, 16, c as string, 1, C.ink, 1.2), circle(x as number, y as number - 8, 1.6, RED, C.ink, 0.6))),
    g('translate(78 96) rotate(-35)', rect(-2.5, -24, 5, 24, C.yellow, 1, C.ink, 1), path('M-2.5 0 L2.5 0 L0 5 Z', C.beige, C.ink, 0.8)), frame(12, 8, 66, 102)),
  'thea.sy': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M6 60 L114 52 L114 104 L6 112 Z', '#7a3fa0', C.ink, 1.6), line('M6 76 L114 68', '#5a2f78', 1.2),
    line('M14 79 L60 75', C.gold, 2, '5 4'),
    moving('thea-sy', '0%,100%{transform:translate(0,0)}50%{transform:translate(4px,12px)}', { dur: 1.1 },
      g('translate(66 52) rotate(20)', rect(-1.2, -30, 2.4, 34, C.silver, 1, C.ink, 0.8), ellipse(0, -26, 0.8, 2.2, C.paper, null)),
      path('M64 26 C80 10 100 20 104 40', 'none', C.gold, 1.6),
      g('translate(74 40)', rect(-8, -6, 16, 12, C.skin, 5, C.ink, 1.2), circle(-6, 0, 4, C.skin, C.ink, 1))),
    path('M60 75 C62 70 64 64 66 56', 'none', C.gold, 2)),
  'thea.prova.2': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), ground(), mirror(68, 10, 44, 100),
    waSway('thea-prova', 6, W(38, 0.94, { top: '#3f8f6a', bottom: '#3f8f6a', mouth: 'smile', armL: [[-14, -56], [-18, -42]], armR: [[14, -56], [18, -42]], extra: line('M-12 -40 L12 -40', C.gold, 1.4) })),
    greyed(W(90, 0.8, { top: '#3f8f6a', bottom: '#3f8f6a', mouth: 'smile' }, 108)), hanger(14, 30, 1), line('M14 24 L14 14', C.ink, 1.2)),
  'thea.korsett': all(rect(0, 0, 120, 120, C.paper, 0, null), corset(60, 54, 1.8), frame(26, 8, 68, 104)),
  'thea.mask.3': all(rect(0, 0, 120, 120, '#efe6d6', 0, null),
    greyed(at(28, 60, 1, circle(0, 0, 18, C.skin, C.ink, 1.6), path('M-18 -2 C-18 -26 18 -26 18 -2 C12 -14 -12 -14 -18 -2 Z', C.hair, C.ink, 1.4), circle(-6, 0, 1.6, C.ink, null), circle(6, 0, 1.6, C.ink, null), path('M-5 9 Q0 12 5 9', 'none', C.ink, 1.2))),
    arrow(50, 60, 62, 60, C.grey, 2.4),
    at(88, 60, 1.25, circle(0, 0, 18, '#e7b993', C.ink, 1.6), path('M-20 4 C-24 -26 24 -26 20 4 C18 -12 -18 -12 -20 4 Z', '#e6e6e6', C.ink, 1.4), path('M-20 4 C-22 14 -18 20 -16 20 M20 4 C22 14 18 20 16 20', '#e6e6e6', C.ink, 1.2),
      circle(-6, 0, 1.6, C.ink, null), circle(6, 0, 1.6, C.ink, null), line('M-10 -6 L-3 -7 M3 -7 L10 -6', '#8a6a4a', 1.4),
      line('M-12 -10 Q-6 -12 0 -10 Q6 -12 12 -10 M-11 4 Q-9 7 -7 5 M7 5 Q9 7 11 4 M-4 6 Q0 4 4 6', '#a8744c', 1), path('M-5 11 Q0 9 5 11', 'none', C.ink, 1.2), line('M8 -2 L12 6', '#b0473f', 1.4)),
    g('translate(108 96) rotate(-30)', rect(-2, -16, 4, 16, C.dark, 1, C.ink, 0.8), path('M-3 -16 L3 -16 L2 -22 L-2 -22 Z', '#e7b993', C.ink, 0.8)), ring(88, 58, 28)),
  'thea.maskör': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), ground(), mirror(80, 14, 34, 48, true), rect(76, 64, 42, 6, C.tan, 1, C.ink, 1.4),
    ...[84, 92, 100, 108].map((x, i) => circle(x, 62, 2.6, [RED, C.skin2, C.purple, C.grey][i]!, C.ink, 0.8)),
    sitter(42, 96, 0.82, { top: C.white, bottom: C.navy, mouth: 'closed', eyes: 'closed', skin: '#e7b993', hair: 'grey' }),
    W(16, 0.74, { top: C.dark, bottom: C.dark, skirt: false, mouth: 'closed', armR: [[16, -62], [26, -70]] }),
    moving('thea-maskor', '0%,100%{transform:translate(0,0)}50%{transform:translate(3px,4px)}', { dur: 1 }, g('translate(36 46) rotate(-40)', rect(-1.5, -12, 3, 12, C.dark, 1, null), path('M-2.5 -12 L2.5 -12 L1.5 -17 L-1.5 -17 Z', '#b0473f', null))),
    ring(16, 40, 13)),
  'thea.lösskägg': all(rect(0, 0, 120, 120, C.paper, 0, null), beard(52, 54, 2.2, C.white),
    g('translate(98 86) rotate(-20)', rect(-6, -14, 12, 26, C.white, 3, C.ink, 1.4), rect(-6, -2, 12, 8, C.sky, 1, null), rect(-3, -20, 6, 6, C.dark, 1, C.ink, 1)),
    path('M90 70 C86 66 80 66 78 70', 'none', C.grey, 1.4, ), frame(14, 20, 78, 76)),
  'thea.loge': all(rect(0, 0, 120, 120, '#e8dbc6', 0, null), ground(), mirror(14, 14, 50, 40, true), rect(8, 60, 64, 8, C.tan, 1, C.ink, 1.4), line('M14 68 L14 112 M66 68 L66 112', C.brown, 2.6),
    ...[22, 32, 42].map((x, i) => rect(x - 3, 52, 6, 8, [RED, C.pink, C.sky][i]!, 1, C.ink, 0.8)), flower(56, 50, 1.1, C.pink), flower(60, 48, 0.9, C.yellow),
    line('M80 20 L116 20', C.dark, 2.4), line('M84 20 L84 108 M112 20 L112 108', C.dark, 1.6),
    hanger(90, 26, 0.9), path('M82 28 L98 28 L102 66 L78 66 Z', '#3f8f6a', C.ink, 1.2), hanger(106, 26, 0.9), path('M98 28 L114 28 L116 60 L96 60 Z', RED, C.ink, 1.2),
    rect(26, 88, 20, 4, C.dark, 1, C.ink, 1), line('M28 92 L28 112 M44 92 L44 112', C.dark, 1.6)),

  // ── 4456 Premiär och föreställning ───────────────────────────────
  'thea.premiär': runDays(false),
  'thea.derniär': runDays(true),
  'thea.matiné': all(rect(0, 0, 120, 120, '#d6ecf8', 0, null), circle(20, 20, 9, C.yellow, null), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(20 + Math.cos(a) * 12)} ${f1(20 + Math.sin(a) * 12)} L${f1(20 + Math.cos(a) * 16)} ${f1(20 + Math.sin(a) * 16)}`, C.yellow, 2); }),
    clock(98, 22, 14, 2, 0), rect(30, 40, 80, 50, STAGE, 2, C.ink, 1.4), path('M30 40 L38 40 C36 56 38 72 34 90 L30 90 Z M110 40 L102 40 C104 56 102 72 106 90 L110 90 Z', CURT, null), rect(30, 82, 80, 8, BOARD, 0, null),
    fig(60, 0.3, { top: C.orange, armR: GESTURE_R }, 86), fig(80, 0.3, { top: C.green }, 86),
    W(18, 0.5, { top: C.red, mouth: 'smile' }), fig(36, 0.3, { top: C.yellow, mouth: 'wide' }), M(96, 0.5, { top: C.denim, hair: 'grey' }), fig(110, 0.28, { top: C.pink, hair: 'long', mouth: 'wide' }),
    ring(98, 22, 17)),
  'thea.speltid': all(rect(0, 0, 120, 120, C.paper, 0, null), clock(60, 58, 42, 9, 30),
    path(`M60 58 L${f1(60 + Math.sin(7 / 12 * Math.PI * 2) * 40)} ${f1(58 - Math.cos(7 / 12 * Math.PI * 2) * 40)} A40 40 0 0 1 ${f1(60 + Math.sin(9.5 / 12 * Math.PI * 2) * 40)} ${f1(58 - Math.cos(9.5 / 12 * Math.PI * 2) * 40)} Z`, 'rgba(228,87,46,0.35)', null),
    path(`M${f1(60 + Math.sin(7 / 12 * Math.PI * 2) * 46)} ${f1(58 - Math.cos(7 / 12 * Math.PI * 2) * 46)} A46 46 0 0 1 ${f1(60 + Math.sin(9.5 / 12 * Math.PI * 2) * 46)} ${f1(58 - Math.cos(9.5 / 12 * Math.PI * 2) * 46)}`, 'none', HL, 3.4),
    rect(50, 66, 20, 16, STAGE, 1, C.ink, 1), path('M50 66 L54 66 L52 82 L50 82 Z M70 66 L66 66 L68 82 L70 82 Z', CURT, null), fig(60, 0.13, { top: C.orange }, 80)),
  'thea.gästspel': all(rect(0, 0, 120, 120, '#d6ecf8', 0, null), rect(0, 100, 120, 20, '#9aa3ad', 0, null), line('M0 100 L120 100', C.ink, 1.2),
    path('M74 100 L74 48 L96 34 L118 48 L118 100 Z', '#e9dcc6', C.ink, 1.6), ...range(4).map((i) => rect(78 + i * 10, 56, 4, 30, C.white, 1, C.ink, 0.8)), rect(88, 88, 16, 12, C.brown, 1, C.ink, 1),
    moving('thea-gast', '0%{transform:translate(-50px,0)}70%,100%{transform:translate(0,0)}', { dur: 3 },
      rect(10, 72, 56, 24, C.red, 4, C.ink, 1.6), rect(52, 76, 12, 10, '#bfe3f5', 2, C.ink, 1), ...range(3).map((i) => rect(16 + i * 12, 76, 9, 8, '#bfe3f5', 1, C.ink, 0.9)),
      circle(22, 98, 5, C.dark, C.ink, 1), circle(54, 98, 5, C.dark, C.ink, 1), crown(30, 90, 1), path('M38 86 L46 86 L44 94 L40 94 Z', C.white, C.ink, 0.8)),
    path('M8 30 C20 14 40 14 56 26', 'none', C.grey, 1.6, ), path('M8 40 L3 30 C0 24 4 18 8 18 C12 18 16 24 13 30 Z', RED, C.ink, 1.2), circle(8, 25, 2.4, C.white, null), arrow(52, 23, 60, 30, C.grey, 1.6)),
  'thea.foajé': all(rect(0, 0, 120, 120, '#f1e2c8', 0, null), rect(0, 94, 120, 26, '#b03a48', 0, null), line('M0 94 L120 94', C.ink, 1.4),
    line('M60 0 L60 10', C.gold, 1.4), path('M44 10 L76 10 L70 20 L50 20 Z', C.gold, C.ink, 1.2), ...range(5).map((i) => circle(48 + i * 6, 22, 1.8, '#fff6c8', C.ink, 0.6)),
    door(10, 40, 18, 54, '#8a5a3a'), door(92, 40, 18, 54, '#8a5a3a'),
    ...[[34, 'w', C.purple], [50, 'm', C.navy], [72, 'w', C.red], [88, 'm', C.green]].map(([x, k, c], i) => (k === 'w' ? W : M)(x as number, 0.52, { top: c as string, mouth: i % 2 ? 'open' : 'smile', armR: [[14, -52], [10, -60]], extra: path('M8 -66 L12 -66 L11 -60 L9 -60 Z', 'rgba(220,240,252,0.8)', C.ink, 0.6) }, 104))),
  'thea.garderob.2': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), line('M4 22 L116 22', C.dark, 2.4),
    ...range(6).map((i) => all(hanger(14 + i * 18, 28, 0.7), path(`M${6 + i * 18} 30 L${22 + i * 18} 30 L${24 + i * 18} 60 L${4 + i * 18} 60 Z`, [C.navy, C.red, C.dark, C.green, '#c08a3e', C.purple][i]!, C.ink, 1.2), rect(10 + i * 18, 32, 8, 6, C.white, 1, C.ink, 0.6))),
    W(40, 0.6, { top: C.dark, bottom: C.dark, mouth: 'smile', armR: [[16, -58], [30, -60]] }, 96),
    rect(4, 76, 112, 10, '#8a5a3a', 2, C.ink, 1.6), rect(4, 86, 112, 26, '#a8744c', 0, C.ink, 1.2),
    fig(96, 0.62, { top: C.yellow, mouth: 'smile', armL: [[-16, -58], [-28, -62]] }, 120),
    rect(62, 52, 12, 10, C.white, 1, C.ink, 1.2), T(68, 60, '12', 7, C.ink, 900), frame(58, 48, 20, 18)),
  'thea.programblad': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M14 18 L60 24 L60 108 L14 102 Z', C.white, C.ink, 1.6), path('M60 24 L106 18 L106 102 L60 108 Z', C.white, C.ink, 1.6),
    ...range(4).map((i) => all(rect(20 + (i % 2) * 18, 32 + Math.floor(i / 2) * 26, 14, 16, '#e9e2d6', 1, C.ink, 0.8), circle(27 + (i % 2) * 18, 38 + Math.floor(i / 2) * 26, 3.4, C.skin, C.ink, 0.6), rect(23 + (i % 2) * 18, 42 + Math.floor(i / 2) * 26, 8, 5, [C.orange, C.green, C.purple, C.denim][i]!, 1, null), line(`M${20 + (i % 2) * 18} ${51 + Math.floor(i / 2) * 26} L${33 + (i % 2) * 18} ${51 + Math.floor(i / 2) * 26}`, C.grey, 1))),
    line('M20 90 L54 92 M20 96 L50 98', C.grey, 1.2),
    rect(68, 30, 32, 28, STAGE, 1, C.ink, 1), path('M68 30 L73 30 C71 40 73 50 70 58 L68 58 Z M100 30 L95 30 C97 40 95 50 98 58 L100 58 Z', CURT, null), fig(84, 0.2, { top: C.orange, armR: GESTURE_R }, 56),
    ...range(5).map((i) => line(`M68 ${68 + i * 7} L${98 - (i % 2) * 8} ${68 + i * 7}`, C.grey, 1.2))),
  'thea.parkett.2': house2(false),
  'thea.balkong.2': house2(true),
  'thea.fullsatt': all(rect(0, 0, 120, 120, '#3b2a33', 0, null),
    ...range(4).map((r) => all(...range(7).map((i) => { const x = 12 + i * 16, y = 22 + r * 18; return all(seat(x, y + 8, SEAT, 1), head(x, y + 2, [C.red, C.navy, C.green, C.purple, C.orange, C.denim, C.yellow][(i + r * 2) % 7]!)); }))),
    frame(3, 6, 114, 76),
    greyed(...range(2).map((r) => all(...range(5).map((i) => { const x = 36 + i * 12, y = 96 + r * 12; const on = (i + r) % 3 === 0; return all(seat(x, y + 6, C.grey, 0.8), on ? head(x, y + 1, C.grey, 0.8) : ''); }))))),
  'thea.nervös': all(rect(0, 0, 120, 120, STAGE, 0, null), path('M60 0 L120 0 L120 120 L60 120 Z', '#4a3c4f', null), path('M60 0 L72 0 C68 40 72 80 66 120 L60 120 Z', CURT, C.ink, 1),
    waShake('thea-nerv', W(34, 0.92, { top: C.orange, mouth: 'frown', eyes: 'wide', armL: [[-12, -52], [-2, -56]], armR: [[12, -52], [4, -62]] })),
    sweat(22, 26), sweat(48, 22), waPulse('thea-nerv-h', heart(36, 52, 0.5, RED)), line('M14 92 l-4 2 M14 98 l-5 0 M54 92 l4 2 M54 98 l5 0', C.white, 1.4),
    greyed(M(96, 0.5, { top: C.green, mouth: 'smile' }, 100)), ring(34, 38, 14)),

  // ── 4457 Teaterkritik ────────────────────────────────────────────
  'thea.regi': all(stageBox(70), curtains(8, 70),
    W(36, 0.42, { top: C.orange, armR: GESTURE_R }, 92), M(84, 0.42, { top: C.denim }, 92),
    line('M40 96 C50 104 64 104 74 98', HL, 2, '3 3'), arrow(70, 99, 78, 96, HL, 2), line('M86 54 C92 46 100 46 104 54', HL, 2, '3 3'), arrow(102, 50, 105, 56, HL, 2),
    ...[[30, 80], [96, 80]].map(([x, y]) => line(`M${x! - 4} ${y! - 4} L${x! + 4} ${y! + 4} M${x! + 4} ${y! - 4} L${x! - 4} ${y! + 4}`, C.yellow, 2)),
    g('translate(16 100)', rect(-12, -4, 24, 4, '#a8744c', 1, C.ink, 1), line('M-10 0 L10 16 M10 0 L-10 16', '#a8744c', 2.2), rect(-12, -18, 24, 8, C.dark, 1, C.ink, 1)),
    script(92, 92, 24, 24, 4, 1), frame(4, 16, 112, 92)),
  'thea.uppsättning.2': all(rect(0, 0, 120, 120, C.paper, 0, null), script(48, 4, 24, 28, 5),
    ...[[6, 'house'], [44, 'forest'], [82, 'cube']].map(([x, k], i) => {
      const xx = x as number;
      const box = all(rect(xx, 54, 32, 40, STAGE, 2, C.ink, 1.2), path(`M${xx} 54 L${xx + 5} 54 C${xx + 3} 66 ${xx + 5} 80 ${xx + 2} 94 L${xx} 94 Z M${xx + 32} 54 L${xx + 27} 54 C${xx + 29} 66 ${xx + 27} 80 ${xx + 30} 94 L${xx + 32} 94 Z`, CURT, null), rect(xx, 86, 32, 8, BOARD, 0, null),
        k === 'house' ? house(xx + 16, 86, 0.5) : k === 'forest' ? all(tree(xx + 11, 80, 0.5), tree(xx + 21, 82, 0.45)) : all(rect(xx + 9, 72, 14, 14, HL, 1, C.ink, 1), circle(xx + 16, 66, 4, C.yellow, C.ink, 0.8)),
        fig(xx + 16, 0.16, { top: [C.orange, C.green, C.purple][i]!, extra: crown(0, -96, 1.4) }, 92));
      return i === 1 ? all(box, frame(xx - 3, 51, 38, 46)) : greyed(box);
    }),
    waIn('thea-upps', 0, -10, arrow(54, 34, 26, 50, C.grey, 2), arrow(60, 34, 60, 48, HL, 2.6), arrow(66, 34, 94, 50, C.grey, 2))),
  'thea.succé': houseView(true),
  'thea.flopp': houseView(false),
  'thea.fars': all(rect(0, 0, 120, 120, '#efe6d6', 0, null), rect(0, 96, 120, 24, BOARD, 0, null), line('M0 96 L120 96', C.ink, 1.4),
    door(8, 44, 22, 52, '#c0563f', true), door(50, 44, 22, 52, '#3f6fb5'), door(92, 44, 22, 52, '#3f8f6a', true),
    M(30, 0.5, { top: C.yellow, mouth: 'wide', eyes: 'wide', armL: [[-16, -60], [-26, -70]], armR: [[16, -60], [26, -70]], tilt: -12 }, 104),
    W(86, 0.5, { top: C.pink, mouth: 'o', eyes: 'wide', armL: [[-16, -66], [-24, -78]], armR: [[16, -60], [24, -50]], tilt: 10 }, 104),
    circle(61, 64, 5, C.skin, C.ink, 1), path('M56 63 C56 57 66 57 66 63', C.hair, C.ink, 0.8), circle(59, 63, 0.8, C.ink, null),
    line('M42 58 l6 -2 M42 64 l7 0 M74 58 l-6 -2 M74 64 l-7 0', HL, 1.8), line('M4 30 l6 6 M114 30 l-6 6', C.grey, 1.4)),
  'thea.spelglädje': all(stageBox(78), curtains(8, 78), beam(40, 0, 34, 98), beam(80, 0, 34, 98),
    waBob('thea-gladje1', 5, W(40, 0.56, { top: C.orange, mouth: 'wide', eyes: 'closed', armL: ARMS_UP_L, armR: ARMS_UP_R }, 96)),
    waBob('thea-gladje2', 4, M(80, 0.56, { top: C.green, mouth: 'wide', eyes: 'closed', armL: ARMS_UP_L, armR: [[18, -66], [30, -74]] }, 96)),
    sparkle(20, 30, 5, C.yellow), sparkle(100, 30, 5, C.yellow), sparkle(60, 20, 4, C.gold),
    heads(5, 122, '#1c1a28', 14, 106), heart(30, 102, 0.4, C.pink), heart(90, 102, 0.4, C.pink)),
};
