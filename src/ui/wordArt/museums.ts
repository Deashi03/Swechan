/**
 * Historia & humaniora → Arkeologi & kulturarv → Museer & samlingar, 2331–2337 (0.40): museum exhibitions,
 * curators and conservators, collection objects, provenance and ownership, conservation and restoration,
 * digital museum collections, and telling visitors about history.
 * Recurring signs: a warm beige museum wall over a wooden floor, white plinths, glass cases on legs, gold
 * picture frames, a clay vase as "the museum object", a museum worker in a blue top, a conservator in a
 * white coat, a guard in navy with a cap, and an orange highlight ring on the thing that the word names.
 * Digits only; no words or letters, no brands, no pointing fingers. Abstract words are small symbolic
 * scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, glassOf, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const WALL = '#efe6d6';
const FLOOR = '#c9a77c';
const FLOOR2 = '#ad8a5e';
const GLASS = 'rgba(190,225,245,0.35)';
const CLAY = '#c4703e';
const CLAY2 = '#9a5228';
const WOOD = '#a0673d';
const PAPER = '#f6f0e0';
const SCREEN = '#cfe8f5';
const COAT = '#f4f4f0';
const STAFF = C.denim;
const GOOD = '#3a9a5a';
const RUST = '#a4532a';
const WOOL = '#c0504d';
const SKY = '#e4f1fa';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);

// ── Rooms and furniture ──────────────────────────────────────────────
const room = (floorY = 96, wall: string = WALL) => all(rect(4, 4, 112, 108, wall, 3, null), rect(4, floorY, 112, 112 - floorY, FLOOR, 0, null), line(`M4 ${floorY} L116 ${floorY}`, C.ink, 1.2), line(`M4 ${floorY + 8} L116 ${floorY + 8}`, FLOOR2, 0.8));
const sky = () => rect(4, 4, 112, 108, SKY, 3, null);
const ground = (y = 100, col = '#9fd27e') => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.ink, 1.2));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const box = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 3, col, 2.4);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, GOOD, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const noC = (x: number, y: number, r = 7) => all(circle(x, y, r, C.red, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, f1(r * 0.26)));
/** A small landscape painting inside a frame centred at (x, y). */
const painting = (x: number, y: number, w = 30, h = 22, col: string = C.gold) => all(rect(x - w / 2, y - h / 2, w, h, col, 1, C.ink, 1.4), rect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, '#cfe6f4', 0, null),
  path(`M${x - w / 2 + 3} ${y + h / 2 - 3} L${x - w / 2 + 3} ${f1(y + h * 0.1)} C${f1(x - w * 0.2)} ${f1(y - h * 0.15)} ${f1(x + w * 0.05)} ${f1(y + h * 0.2)} ${f1(x + w * 0.2)} ${f1(y)} C${f1(x + w * 0.3)} ${f1(y - h * 0.08)} ${x + w / 2 - 3} ${f1(y + h * 0.05)} ${x + w / 2 - 3} ${f1(y + h * 0.1)} L${x + w / 2 - 3} ${y + h / 2 - 3} Z`, '#7cbf62', null),
  circle(f1(x + w * 0.22), f1(y - h * 0.22), f1(Math.min(w, h) * 0.1), C.yellow, null));
/** A clay vase standing on (x, y). */
const vase = (x: number, y: number, s = 1, col: string = CLAY, deco = true) => at(x, y, s, path('M-5 -26 L5 -26 L4 -22 C14 -16 14 -4 7 0 L-7 0 C-14 -4 -14 -16 -4 -22 Z', col, C.ink, 1.4), ellipse(0, -26, 5, 1.6, CLAY2, C.ink, 1),
  deco ? line('M-10 -12 L-6 -8 L-2 -12 L2 -8 L6 -12 L10 -8', '#f3e2c4', 1.4) : '');
/** A white marble bust standing on (x, y). */
const bust = (x: number, y: number, s = 1, col = '#f1efe8') => at(x, y, s, rect(-7, -6, 14, 6, col, 1, C.ink, 1.2), path('M-12 -6 C-12 -16 -6 -18 0 -18 C6 -18 12 -16 12 -6 Z', col, C.ink, 1.3), rect(-3, -22, 6, 5, col, 1, C.ink, 1.1), ellipse(0, -29, 7, 8.5, col, C.ink, 1.3),
  path('M-7 -32 C-6 -40 6 -40 7 -32 C4 -35 -4 -35 -7 -32 Z', '#dcd8cc', C.ink, 1), line('M-3 -29 l1.6 0 M1.4 -29 l1.6 0 M0 -28 l0 3', '#9a968a', 0.9));
/** A white plinth with its foot on y and its top at y − h. */
const plinth = (x: number, y: number, w = 20, h = 26, col: string = C.white) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), rect(x - w / 2 - 2, y - h - 2, w + 4, 3, col, 1, C.ink, 1.2), line(`M${x + w / 2 - 4} ${y - h + 4} L${x + w / 2 - 4} ${y - 2}`, '#dedad0', 1.6));
/** A glass case on legs: legs from the floor y up, glass box of w × h above. inner is drawn in page coordinates. */
const vitrine = (x: number, y: number, w: number, h: number, legs = 26, inner: Svg = '') => all(line(`M${x - w / 2 + 3} ${y} L${x - w / 2 + 3} ${y - legs} M${x + w / 2 - 3} ${y} L${x + w / 2 - 3} ${y - legs}`, C.dark, 2.2), rect(x - w / 2, y - legs - 4, w, 4, WOOD, 1, C.ink, 1.2),
  inner, rect(x - w / 2, y - legs - 4 - h, w, h, GLASS, 1, C.ink, 1.4), line(`M${x - w / 2 + 4} ${y - legs - h} L${x - w / 2 + 10} ${y - legs - h + 8}`, C.white, 1.6));
/** A small label plate with grey "text" lines. */
const label = (x: number, y: number, w = 14, h = 10, col = C.white) => all(rect(x - w / 2, y - h / 2, w, h, col, 1, C.ink, 1), line(Array.from({ length: Math.max(1, Math.floor((h - 3) / 2.6)) }, (_, i) => `M${f1(x - w / 2 + 2)} ${f1(y - h / 2 + 2.6 + i * 2.6)} L${f1(x + w / 2 - 2 - (i % 2) * 3)} ${f1(y - h / 2 + 2.6 + i * 2.6)}`).join(' '), C.grey, 0.9));
const rope = (x1: number, x2: number, y: number) => all(line(`M${x1} 112 L${x1} ${y} M${x2} 112 L${x2} ${y}`, C.gold, 2.2), circle(x1, y, 2, C.gold, C.ink, 0.8), circle(x2, y, 2, C.gold, C.ink, 0.8), path(`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y}`, 'none', C.red, 2.2));
const crate = (x: number, y: number, w = 18, h = 14) => all(rect(x - w / 2, y - h, w, h, '#d4a373', 1, C.ink, 1.3), line(`M${x - w / 2} ${y - h} L${x + w / 2} ${y} M${x + w / 2} ${y - h} L${x - w / 2} ${y}`, '#a0673d', 1));
const museum = (x: number, y: number, s = 1) => at(x, y, s, rect(-26, -4, 52, 4, '#e8e4da', 0, C.ink, 1.2), path('M-28 -34 L0 -48 L28 -34 Z', '#e8e4da', C.ink, 1.4), rect(-26, -34, 52, 3, '#e8e4da', 0, C.ink, 1),
  ...[-20, -10, 0, 10, 20].map((d) => rect(d - 2.5, -31, 5, 27, '#f4f1ea', 0.5, C.ink, 1)));
const monitor = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x - w / 2, y - h / 2, w, h, C.dark, 2, C.ink, 1.4), rect(x - w / 2 + 2.5, y - h / 2 + 2.5, w - 5, h - 5, SCREEN, 1, null), inner, rect(x - 3, y + h / 2, 6, 5, C.dark, 0, null), rect(x - 9, y + h / 2 + 5, 18, 2.5, C.dark, 1, null));
const thumbV = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 -9 L3 -9 L2.4 -7 C7 -5 7 -1 3.4 0 L-3.4 0 C-7 -1 -7 -5 -2.4 -7 Z', CLAY, C.ink, 0.8));
const table = (y = 84, x1 = 8, x2 = 112, col = '#d4a373') => all(rect(x1, y, x2 - x1, 5, col, 1.5, C.ink, 1.4), line(`M${x1 + 6} ${y + 5} L${x1 + 6} 112 M${x2 - 6} ${y + 5} L${x2 - 6} 112`, C.brown, 2.6));
const cupM = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-6 -10 L6 -10 L5 0 L-5 0 Z', col, C.ink, 1.2), path('M6 -8 C10 -8 10 -3 5 -3', 'none', C.ink, 1.2), line('M-5 -7 L5 -7', '#4f86c6', 1.2));
const book = (x: number, y: number, s = 1, col = '#7a3b3b') => at(x, y, s, rect(-9, -12, 18, 24, col, 1.5, C.ink, 1.2), line('M-6 -12 L-6 12', 'rgba(0,0,0,0.25)', 1.2), rect(-2, -6, 8, 5, '#e6d3a0', 0.5, null));
const sword = (x: number, y: number, s = 1, r = 0, blade: string = C.silver) => rot(x, y, r, s, path('M-2 -24 L2 -24 L1.6 8 L0 11 L-1.6 8 Z', blade, C.ink, 1), rect(-7, 8, 14, 3, C.gold, 1, C.ink, 0.9), rect(-1.6, 11, 3.2, 7, WOOD, 1, C.ink, 0.8), circle(0, 19, 2, C.gold, C.ink, 0.8));
const cloth = (x: number, y: number, w: number, h: number, col: string = WOOL) => all(rect(x, y, w, h, col, 1, C.ink, 1.3), line(Array.from({ length: Math.floor(w / 6) }, (_, i) => `M${x + 3 + i * 6} ${y + 2} L${x + 3 + i * 6} ${y + h - 2}`).join(' '), 'rgba(255,255,255,0.35)', 1.2),
  line(`M${x + 2} ${f1(y + h / 2)} L${x + w - 2} ${f1(y + h / 2)}`, '#f2c14e', 1.6));
const chair = (x: number, y: number, s = 1, col: string = WOOD) => at(x, y, s, rect(-10, -16, 20, 4, col, 1, C.ink, 1.2), line('M-8 -12 L-8 0 M8 -12 L8 0', col, 2.6), line('M-8 -16 L-8 -36 M8 -16 L8 -36', col, 2.6), rect(-9, -36, 18, 5, col, 1, C.ink, 1.1), rect(-9, -26, 18, 3, col, 1, C.ink, 1));
const brush = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, rect(-1.6, -22, 3.2, 16, WOOD, 1, C.ink, 0.9), rect(-2.4, -6, 4.8, 4, C.silver, 0.5, C.ink, 0.8), path('M-2.6 -2 L2.6 -2 L2 6 L0 8 L-2 6 Z', '#e8c27a', C.ink, 0.8));
const bug = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, line('M-3 -2 l-3 -2 M-3 0 l-3.5 0 M-3 2 l-3 2 M3 -2 l3 -2 M3 0 l3.5 0 M3 2 l3 2 M-1 -5 l-2 -3 M1 -5 l2 -3', C.ink, 0.9), ellipse(0, 1, 3.2, 4.4, '#5a3a24', C.ink, 0.8), circle(0, -4, 2, '#3a2416', null));
const moth = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 -12 -2 -10 3 C-8 6 -3 4 0 0 Z M0 0 C6 -6 12 -2 10 3 C8 6 3 4 0 0 Z', '#c8b89a', C.ink, 0.8), ellipse(0, 1, 1.2, 4, '#8a7656', null), line('M0 -3 l-2 -3 M0 -3 l2 -3', C.ink, 0.6));
const headphones = (x: number, h = 1) => on(x, h, path('M-11 -56 C-12 -72 12 -72 11 -56', 'none', C.dark, 2.4), rect(-14, -60, 5, 9, C.dark, 2, C.ink, 1), rect(9, -60, 5, 9, C.dark, 2, C.ink, 1));
const cap = (x: number, h = 1, col: string = C.navy) => on(x, h, path('M-11 -63 C-11 -72 11 -72 11 -63 Z', col, C.ink, 1.4), rect(-12, -64, 24, 3, col, 1, C.ink, 1), path('M-2 -64 L13 -64 L15 -61 L-2 -61 Z', C.dark, null), circle(0, -67, 1.6, C.gold, null));
const coat = (x: number, h = 1) => on(x, h, path('M-15 -42 L15 -42 L17 20 L-17 20 Z', COAT, C.ink, 1.6), line('M0 -42 L0 20 M-6 -40 L0 -32 L6 -40', C.ink, 1), rect(6, -24, 6, 5, COAT, 1, C.ink, 0.8));
const loupeBand = (x: number, h = 1) => on(x, h, line('M-10 -62 C-6 -66 6 -66 10 -62', C.dark, 2), circle(4, -58, 4, 'rgba(190,225,245,0.7)', C.ink, 1.4));
const glasses = (x: number, h = 1) => on(x, h, circle(-3.6, -56, 2.8, 'none', C.ink, 1), circle(3.6, -56, 2.8, 'none', C.ink, 1), line('M-0.8 -56 L0.8 -56', C.ink, 1));
const bubble = (x: number, y: number, w: number, h: number, inner: Svg, tail: -1 | 1 = -1) => all(rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.3), path(`M${x + tail * (w / 2 - 8)} ${y + h / 2 - 0.6} L${x + tail * (w / 2 - 2)} ${y + h / 2 + 7} L${x + tail * (w / 2 - 14)} ${y + h / 2 - 0.6} Z`, C.white, null), line(`M${x + tail * (w / 2 - 8)} ${y + h / 2} L${x + tail * (w / 2 - 2)} ${y + h / 2 + 7} L${x + tail * (w / 2 - 14)} ${y + h / 2}`, C.ink, 1.3), inner);
const qm = (x: number, y: number, size = 12, col: string = C.navy) => T(x, y, '?', size, col);

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const staff = (x: number, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, STAFF, mood, more);
const conservator = (x: number, mood: Mood = 'calm', more: Partial<Build> = {}) => all(fig(x, COAT, mood, { bottom: C.dark, ...more }), coat(x, more.h ?? 1));
const guard = (x: number, mood: Mood = 'calm', h = 1) => all(fig(x, C.navy, mood, { h, bottom: C.navy, hairStyle: 'short' }), cap(x, h), on(x, h, rect(5, -36, 5, 4, C.gold, 0.5, C.ink, 0.6)));
/** A small child (h ≈ 0.55). */
const kid = (x: number, top: string, mood: Mood = 'smile', long = false, h = 0.55) => fig(x, top, mood, { h, hairStyle: long ? 'long' : 'short' });
/** An 18th-century costume: long dress, apron and a white cap. */
const costume = (x: number, h = 1, col = '#7a4a8a') => on(x, h, path('M-14 -42 L14 -42 L22 49 L-22 49 Z', col, C.ink, 1.6), path('M-9 -20 L9 -20 L12 40 L-12 40 Z', C.white, C.ink, 1.1), path('M-11 -60 C-12 -72 12 -72 11 -60 C8 -64 -8 -64 -11 -60 Z', C.white, C.ink, 1.2), line('M-14 -42 L14 -42', C.ink, 1.2));

// ── Motifs ───────────────────────────────────────────────────────────
export const MUSEUM_MOTIFS: Record<string, Svg> = {
  // 2331 Museets utställningar
  'mus.ställa-ut': all(room(), painting(24, 36, 26, 20), plinth(76, 112, 22, 30), staff(42, 'smile', { hairStyle: 'long' }), reach(42, 1, 1, 70, 52), reach(42, 1, 1, 82, 52), vase(76, 56, 1.2),
    arrow(98, 40, 98, 72, HL, 2.6), ring(76, 42, 18)),
  'mus.basutställning': all(sky(), ground(104), path('M6 30 L60 10 L114 30 Z', '#e8e4da', C.ink, 1.4), rect(8, 30, 104, 74, '#e8e4da', 1, C.ink, 1.4),
    greyed(rect(12, 50, 22, 50, WALL, 1, C.ink, 1), painting(23, 64, 12, 9), rect(86, 50, 22, 50, WALL, 1, C.ink, 1), vase(97, 96, 0.4)),
    rect(36, 36, 48, 64, WALL, 1, C.ink, 1.2), rect(36, 90, 48, 10, FLOOR, 0, null), painting(48, 50, 16, 12), painting(72, 50, 16, 12), plinth(60, 98, 12, 18), bust(60, 80, 0.5), vitrine(44, 98, 12, 9, 10, vase(44, 87, 0.3)), vitrine(76, 98, 12, 9, 10, cupM(76, 87, 0.5)),
    stand(52, 100, 0.2, fig(60, C.orange, 'smile')), stand(68, 100, 0.2, fig(60, C.green, 'smile')), box(34, 34, 52, 68)),
  'mus.vandringsutställning': all(sky(), ground(92), museum(18, 92, 0.5), museum(102, 92, 0.5), at(58, 106, 1.3, rect(-24, -24, 32, 20, C.white, 2, C.ink, 1.3), rect(8, -16, 14, 12, C.orange, 2, C.ink, 1.3), rect(11, -14, 7, 5, SCREEN, 1, C.ink, 0.8), circle(-14, -2, 4, C.dark, C.ink, 1), circle(14, -2, 4, C.dark, C.ink, 1)),
    crate(40, 74, 14, 12), crate(56, 74, 14, 12), painting(48, 84, 14, 10), vase(60, 96, 0.4), dash('M26 50 C44 32 76 32 94 50', HL, 1.8, '4 3'), arrow(88, 44, 96, 52, HL, 2.4), ring(60, 84, 30)),
  'mus.sockel': all(room(), painting(22, 34, 22, 18), painting(98, 34, 22, 18), plinth(60, 108, 34, 52), bust(60, 54, 1.1), rect(41, 54, 38, 56, 'none', 3, HL, 2.6), line('M40 108 L80 108', C.ink, 1)),
  'mus.informationsskylt': all(room(), vitrine(44, 112, 40, 34, 34, vase(44, 72, 1)), plinth(92, 112, 4, 40, C.dark), label(92, 62, 26, 20, C.white), rect(82, 54, 8, 7, CLAY, 1, null), box(76, 50, 32, 24),
    stand(90, 112, 0.5, fig(60, C.green, 'calm', { hairStyle: 'short' }))),
  'mus.ljudguide': all(room(), painting(84, 38, 40, 30), fig(36, C.orange, 'smile', { hairStyle: 'long' }), headphones(36), line('M28 36 C24 48 26 58 28 66', C.dark, 1.2), reach(36, 1, 1, 54, 62),
    at(56, 62, 1, rect(-5, -10, 10, 18, C.dark, 2, C.ink, 1.2), rect(-3.5, -8, 7, 5, SCREEN, 0.5, null), ...[0, 1, 2].map((r) => all(circle(-2, -1 + r * 3, 0.9, C.white, null), circle(2, -1 + r * 3, 0.9, C.white, null)))),
    line('M18 22 q-3 3 0 6 M14 20 q-5 5 0 10', HL, 1.4), ring(56, 62, 13)),
  'mus.museivakt': all(room(), painting(84, 40, 34, 26), rope(66, 104, 84), stand(92, 112, 0.42, fig(60, C.green, 'smile', { hairStyle: 'long' })), guard(38, 'calm'), on(38, 1, line('M-14 -24 L14 -24', C.dark, 2.4))),
  'mus.vernissage': all(room(), painting(30, 32, 30, 22), painting(88, 30, 26, 20, C.white), fig(26, C.red, 'laugh', { hairStyle: 'long', h: 0.86 }), reach(26, 0.86, 1, 38, 70), glassOf(38, 72, '#e8b4b8', 10),
    fig(62, C.navy, 'smile', { h: 0.9 }), reach(62, 0.9, -1, 52, 70), glassOf(52, 72, '#e8b4b8', 10), fig(96, C.green, 'laugh', { h: 0.82 }), reach(96, 0.82, -1, 84, 72), glassOf(84, 74, '#f4e3a0', 10),
    sparkle(48, 14, 4), sparkle(70, 10, 3), sparkle(60, 22, 3), line('M10 8 L110 8', C.gold, 1), ...[16, 30, 44, 58, 72, 86, 100].map((x, i) => path(`M${x} 8 L${x + 5} 8 L${x + 2.5} 14 Z`, [C.red, C.yellow, C.denim][i % 3]!, C.ink, 0.6))),
  // 2332 Kuratorer och konservatorer
  'mus.kurator.2': all(room(), rect(52, 12, 60, 44, C.white, 2, C.ink, 1.4), line('M82 12 L82 56 M52 34 L112 34', C.grey2, 1.2), thumbV(62, 28, 1), painting(98, 23, 14, 10), thumbV(66, 50, 0.8), at(98, 52, 0.4, bust(0, 0, 1)),
    rect(56, 40, 8, 6, PAPER, 0.5, C.ink, 0.6), dash('M64 30 C72 38 86 40 96 46', HL, 1.2), staff(30, 'smile', { hairStyle: 'long' }), glasses(30), reach(30, 1, 1, 56, 44), rect(54, 40, 10, 8, PAPER, 1, C.ink, 0.9),
    reach(30, 1, -1, 12, 72), rect(6, 64, 12, 16, '#d4a373', 1, C.ink, 1), line('M8 68 L16 68 M8 71 L16 71 M8 74 L14 74', C.ink, 0.6)),
  'mus.konservator': all(room(), line('M98 112 L90 40 M78 112 L90 40 M90 40 L90 112', WOOD, 2.4), painting(90, 52, 34, 28), line('M80 58 L86 46', '#7a5a3a', 1.2), conservator(40, 'calm', { hairStyle: 'short' }), loupeBand(40),
    reach(40, 1, 1, 80, 54), brush(80, 54, 0.6, 45), line('M30 10 L52 22', C.dark, 2), path('M50 18 L60 26 L54 30 Z', C.yellow, C.ink, 1), path('M58 28 L84 56', 'rgba(242,193,78,0.35)', null)),
  'mus.museipedagog': all(room(), vitrine(96, 112, 26, 22, 30, vase(96, 82, 0.7)), staff(66, 'laugh', { hairStyle: 'long' }), reach(66, 1, 1, 84, 44), circle(84, 44, 3, C.skin, C.ink, 1.2),
    bubble(30, 20, 32, 20, all(vase(30, 28, 0.42), qm(42, 26, 9))), ...[[14, C.red], [30, C.yellow], [46, C.green]].map(([x, c]) => all(circle(x as number, 94, 6, C.skin, C.ink, 1.2), path(`M${(x as number) - 8} 112 C${(x as number) - 8} 100 ${(x as number) + 8} 100 ${(x as number) + 8} 112 Z`, c as string, C.ink, 1.2), path(`M${(x as number) - 6} 92 C${(x as number) - 6} 85 ${(x as number) + 6} 85 ${(x as number) + 6} 92 C${(x as number) + 3} 89 ${(x as number) - 3} 89 ${(x as number) - 6} 92 Z`, C.hair, null))),
    reach(66, 1, -1, 52, 68)),
  'mus.välja-ut': all(room(), table(76), greyed(...[16, 28, 40, 52].map((x, i) => (i % 2 ? cupM(x, 76, 0.8) : vase(x, 76, 0.45))), book(22, 64, 0.5), cupM(46, 62, 0.7)),
    rect(70, 54, 36, 22, '#d4a373', 1, C.ink, 1.4), vase(80, 72, 0.5), at(94, 72, 0.5, bust(0, 0, 1)), okC(80, 46, 4), okC(94, 46, 4), arrow(52, 52, 72, 52, HL, 2.4),
    staff(60, 'smile', { h: 0.7 }), box(68, 40, 40, 38)),
  'mus.bomullshandske': all(room(), table(90), at(40, 60, 1.6, path('M-10 18 L-10 0 L-12 -10 C-12 -13 -8 -13 -8 -10 L-7 -4 L-7 -16 C-7 -19 -3 -19 -3 -16 L-3 -6 L-2 -18 C-2 -21 2 -21 2 -18 L2 -6 L3 -15 C3 -18 7 -18 7 -15 L7 4 C7 12 4 16 4 18 Z', C.white, C.ink, 1.2), line('M-10 14 L4 14', C.grey2, 1)),
    at(84, 72, 1.6, path('M-10 18 L-10 0 L-12 -10 C-12 -13 -8 -13 -8 -10 L-7 -4 L-7 -16 C-7 -19 -3 -19 -3 -16 L-3 -6 L-2 -18 C-2 -21 2 -21 2 -18 L2 -6 L3 -15 C3 -18 7 -18 7 -15 L7 4 C7 12 4 16 4 18 Z', C.white, C.ink, 1.2), line('M-10 14 L4 14', C.grey2, 1)), vase(60, 90, 0.7), ring(40, 60, 30), ring(84, 72, 30)),
  'mus.lupp': all(room(), table(92), rect(10, 70, 44, 22, PAPER, 1, C.ink, 1.2), line('M14 76 L48 76 M14 82 L44 82 M14 88 L40 88', C.grey, 1), line('M58 66 L72 80', C.dark, 6), circle(42, 50, 22, 'rgba(190,225,245,0.55)', C.ink, 3),
    line('M30 44 L56 44 M30 52 L52 52', C.ink, 2.4), path('M34 58 L40 52 L46 58', 'none', C.red, 1.8), ring(42, 50, 26)),
  'mus.pincett': all(room(), table(90), cloth(14, 76, 60, 14, '#4f86c6'), rot(70, 52, 35, 1, path('M-2 -34 L2 -34 L1 10 L-1 10 Z', C.silver, C.ink, 1), path('M-2 -34 L-6 -34 L-2 12 L0 12 Z', C.silver, C.ink, 1)), circle(62, 64, 2.6, C.gold, C.ink, 0.8),
    line('M62 66 C60 72 56 74 54 78', C.yellow, 1), ring(62, 64, 9), conservator(100, 'calm', { h: 0.8, hairStyle: 'long' }), reach(100, 0.8, -1, 86, 40)),
  'mus.ateljé': all(rect(4, 4, 112, 108, '#f7f3ea', 3, null), rect(10, 10, 40, 46, '#bfe3f5', 1, C.ink, 1.6), line('M30 10 L30 56 M10 33 L50 33', C.ink, 1.4), rect(64, 10, 40, 46, '#bfe3f5', 1, C.ink, 1.6), line('M84 10 L84 56 M64 33 L104 33', C.ink, 1.4),
    rect(4, 96, 112, 16, FLOOR, 0, null), table(78, 52, 112), brush(66, 76, 0.6, -10), brush(72, 76, 0.6, 8), rect(80, 70, 8, 8, C.silver, 1, C.ink, 1), cupM(100, 78, 0.8),
    chair(28, 108, 1.1, WOOD), line('M20 82 L24 86', C.ink, 1), line('M12 112 L18 70 M24 112 L18 70', WOOD, 2.2), painting(18, 72, 16, 12), conservator(62, 'smile', { h: 0.72, hairStyle: 'short' })),
  // 2333 Samlingsföremål
  'mus.samlare.2': all(room(), ...[24, 46, 68].map((y) => all(rect(54, y, 56, 3, WOOD, 1, C.ink, 1), ...[0, 1, 2, 3, 4].map((i) => cupM(60 + i * 11, y, 0.7, [C.white, C.yellow, C.rose, C.mint, C.lilac][(i + y / 22) % 5 | 0]!)))),
    rect(54, 70, 56, 3, WOOD, 1, C.ink, 1), fig(28, C.orange, 'laugh', { hairStyle: 'short' }), reach(28, 1, 1, 46, 56), cupM(46, 58, 0.8, C.pink), sparkle(46, 42, 3.4), box(52, 12, 60, 64)),
  'mus.samlingsföremål': all(room(), rect(8, 18, 104, 3, WOOD, 1, C.ink, 1), greyed(cupM(18, 18, 0.7), book(32, 11, 0.3), vase(46, 18, 0.35), cupM(76, 18, 0.7), at(90, 18, 0.3, bust(0, 0, 1)), vase(104, 18, 0.35)), dash('M61 14 L61 30', HL, 1.4, '2 2'),
    rect(54, 6, 14, 12, 'none', 1, C.grey, 1, ), vase(60, 104, 2.6), at(84, 70, 1, line('M-12 4 L0 0', C.ink, 0.8), rect(0, -4, 12, 8, C.white, 1, C.ink, 0.9), T(6, 2, '27', 5, C.ink)), ring(60, 70, 38)),
  'mus.deponera': all(sky(), ground(100), greyed(at(96, 18, 1, rect(-10, -8, 20, 16, C.pink, 1, C.ink, 1.2), line('M0 -8 L0 8 M-10 0 L10 0', C.red, 2), path('M0 -8 C-6 -16 -8 -10 0 -8 C8 -16 6 -10 0 -8 Z', C.red, C.ink, 0.8)), arrow(80, 18, 70, 18, C.grey, 2)),
    museum(86, 100, 0.9), painting(86, 84, 20, 14), at(97, 90, 1, line('M-3 -4 L0 0', C.ink, 0.6), rect(0, -2, 8, 6, C.gold, 1, C.ink, 0.8), T(4, 2.6, '1', 4.4, C.ink)),
    fig(24, C.orange, 'smile', { hairStyle: 'long' }), reach(24, 1, 1, 40, 64), at(44, 64, 1, rect(-4, -3, 10, 7, C.gold, 1, C.ink, 0.9), T(1, 2.4, '1', 4.6, C.ink)),
    path('M42 50 C54 36 70 40 78 62', 'none', HL, 2.4), arrow(74, 56, 78, 64, HL, 2.4), dash('M80 98 C70 110 50 108 42 80', HL, 2, '4 3'), arrow(46, 88, 42, 78, HL, 2.2), ring(44, 64, 9)),
  'mus.magasin': all(rect(4, 4, 112, 108, '#cfd3d8', 3, null), rect(4, 100, 112, 12, '#9aa3ad', 0, null), ...[14, 50, 86].map((x) => all(rect(x, 14, 24, 86, 'none', 0, C.dark, 1.4), ...[34, 56, 78, 98].map((y) => line(`M${x} ${y} L${x + 24} ${y}`, C.dark, 1.6)),
    crate(x + 7, 34, 10, 10), crate(x + 18, 34, 8, 8), crate(x + 12, 56, 18, 12), vase(x + 7, 78, 0.4), crate(x + 17, 78, 10, 10), crate(x + 12, 98, 18, 14))), circle(60, 8, 3, C.yellow, C.ink, 1), path('M50 10 L70 10 L84 40 L36 40 Z', 'rgba(242,193,78,0.25)', null)),
  'mus.inventarienummer': all(room(), table(92), cupM(44, 92, 3.2), at(80, 62, 1, line('M-24 10 L-8 2', C.ink, 0.8), rect(-8, -8, 36, 16, C.white, 2, C.ink, 1.3), circle(-4, 0, 1.6, 'none', C.ink, 0.8), T(12, 3.4, '1987:12', 7.4, C.ink)), T(44, 84, '12', 6, C.ink), ring(90, 62, 21), ring(44, 82, 7)),
  'mus.katalogisera': all(room(), table(80), monitor(78, 56, 40, 30, all(...[0, 1, 2, 3].map((r) => all(rect(61, 45 + r * 6, 5, 4, CLAY, 0.5, null), line(`M68 ${47 + r * 6} L94 ${47 + r * 6}`, C.grey, 1.2))), rect(60, 63, 36, 5, 'rgba(228,87,46,0.25)', 0.5, null))),
    vase(30, 80, 0.8), at(36, 66, 1, rect(0, -3, 10, 6, C.white, 1, C.ink, 0.7), T(5, 1.6, '7', 4.4, C.ink)), rect(62, 78, 30, 4, C.grey2, 1, C.ink, 0.8), staff(104, 'calm', { h: 0.7, hairStyle: 'long' }), reach(104, 0.7, -1, 90, 78)),
  'mus.gallra': all(room(), rect(8, 40, 70, 3, WOOD, 1, C.ink, 1), ...[0, 1, 2, 3, 4].map((i) => (i === 2 ? cupM(18 + i * 13, 40, 1) : greyed(cupM(18 + i * 13, 40, 1)))), okC(44, 22, 5), ring(44, 34, 11),
    crate(92, 100, 30, 22), cupM(86, 84, 0.8, C.grey2), cupM(98, 82, 0.8, C.grey2), arrow(74, 50, 90, 74, HL, 2.6), staff(40, 'calm', { h: 0.62 })),
  // 2334 Proveniens och ägande
  'mus.ägarhistorik': all(room(112, PAPER), painting(60, 22, 34, 24), line('M10 70 L110 70', C.ink, 1.6), ...[[18, '1820', C.red], [42, '1880', C.green], [94, '1960', C.denim]].map(([x, y, c]) => all(circle(x as number, 54, 7, C.skin, C.ink, 1.2), path(`M${(x as number) - 7} 52 C${(x as number) - 7} 44 ${(x as number) + 7} 44 ${(x as number) + 7} 52 C${(x as number) + 3} 49 ${(x as number) - 3} 49 ${(x as number) - 7} 52 Z`, C.hair, null), path(`M${(x as number) - 9} 66 C${(x as number) - 9} 60 ${(x as number) + 9} 60 ${(x as number) + 9} 66 Z`, c as string, C.ink, 1), circle(x as number, 70, 2.4, C.ink, null), T(x as number, 84, y as string, 7, C.ink))),
    dash('M54 70 L80 70', C.white, 3, '0'), dash('M54 70 L80 70', HL, 1.8, '2 3'), qm(67, 60, 12, HL), arrow(24, 96, 98, 96, C.grey, 2), line('M60 34 L60 40', C.grey, 1)),
  'mus.auktion': all(room(), staff(96, 'laugh', { h: 0.9, hairStyle: 'short' }), reach(96, 0.9, -1, 80, 44), rect(82, 64, 28, 32, WOOD, 1, C.ink, 1.4), rect(80, 60, 32, 5, '#c89060', 1, C.ink, 1.2), rot(78, 42, -30, 1, rect(-2, -2, 4, 14, WOOD, 1, C.ink, 0.8), rect(-6, -6, 12, 6, C.brown, 2, C.ink, 1)),
    line('M50 96 L56 56 M62 96 L56 56', WOOD, 2.2), painting(56, 50, 28, 20), ...[[14, C.red], [32, C.green]].map(([x, c]) => all(fig(x as number, c as string, 'smile', { h: 0.62 }), reach(x as number, 0.62, 1, (x as number) + 8, 66), rect((x as number) + 4, 56, 10, 8, C.white, 1, C.ink, 1), T((x as number) + 9, 62.4, x === 14 ? '7' : '23', 5.4, C.ink))), ring(78, 40, 10)),
  'mus.antikhandlare': all(room(), rect(8, 14, 50, 4, WOOD, 1, C.ink, 1), vase(18, 14, 0.5), cupM(34, 14, 0.6), book(48, 6, 0.3), at(30, 60, 1, circle(0, -10, 9, '#f4eedc', C.ink, 1.4), line('M0 -10 L0 -16 M0 -10 L4 -8', C.ink, 1.2), rect(-6, 0, 12, 22, WOOD, 1, C.ink, 1.2)), chair(14, 96, 0.9),
    fig(86, C.purple, 'smile', { h: 0.9, hairStyle: 'short' }), glasses(86, 0.9), rect(60, 70, 52, 26, WOOD, 1, C.ink, 1.4), rect(60, 66, 52, 6, '#c89060', 1, C.ink, 1.2), vase(70, 66, 0.6), at(78, 56, 1, line('M-4 2 L0 -2', C.ink, 0.6), rect(0, -6, 10, 6, C.white, 1, C.ink, 0.7), T(5, -1.6, '900', 4, C.ink))),
  'mus.omstridd': all(room(), fig(22, C.red, 'angry', { hairStyle: 'short' }), fig(98, C.denim, 'angry', { hairStyle: 'long' }), reach(22, 1, 1, 50, 58), reach(98, 1, -1, 70, 58), vase(60, 72, 1.3), arrow(44, 46, 30, 46, HL, 2.2), arrow(76, 46, 90, 46, HL, 2.2),
    line('M54 22 l-3 -6 M60 20 l0 -7 M66 22 l3 -6', C.red, 2), ring(60, 56, 22)),
  'mus.rättmätig': all(room(), vase(60, 96, 1.2), greyed(fig(22, C.grey, 'frown', { h: 0.82 }), at(22, 70, 1, rect(-8, -10, 16, 20, PAPER, 1, C.ink, 1))), noC(22, 20, 6),
    fig(96, C.green, 'smile', { hairStyle: 'long' }), reach(96, 1, -1, 84, 60), at(80, 58, 1.2, rect(-11, -14, 22, 28, PAPER, 1, C.ink, 1.2), vase(0, 2, 0.45), line('M-7 6 L7 6 M-7 9 L4 9', C.grey, 0.9), circle(5, 10, 3.6, C.red, C.ink, 0.8)), okC(96, 14, 7),
    dash('M70 66 L74 66', HL, 1.4), box(64, 36, 46, 70)),
  'mus.repatriering': all(rect(4, 4, 112, 108, '#9fd0ec', 3, null), path('M4 30 L38 22 L46 40 L40 70 L4 76 Z', '#c9d8b0', C.ink, 1.4), museum(22, 54, 0.45), path('M80 40 L116 34 L116 96 L74 92 L70 64 Z', '#b7d68a', C.ink, 1.4),
    ...[84, 96, 106].map((x) => path(`M${x - 5} 64 L${x} 56 L${x + 5} 64 Z`, C.tan, C.ink, 1)), fig(96, C.orange, 'laugh', { h: 0.36 }), fig(106, C.green, 'smile', { h: 0.32 }), crate(56, 60, 14, 10), vase(56, 50, 0.3),
    dash('M30 48 C44 30 66 30 86 52', HL, 1.8, '4 3'), arrow(80, 46, 88, 54, HL, 2.4), path('M10 96 Q20 92 30 96 T50 96', 'none', C.white, 1.2)),
  // 2335 Konservering och restaurering
  'mus.ljuskänslig.2': all(rect(4, 4, 112, 108, WALL, 3, null), rect(10, 10, 30, 30, '#bfe3f5', 1, C.ink, 1.4), circle(25, 25, 7, C.yellow, C.ink, 1), path('M38 26 L96 64 L96 92 L50 96 Z', 'rgba(242,193,78,0.3)', null),
    at(0, 0, 1, rect(56, 56, 40, 32, '#e7b6a8', 1, C.ink, 1.4), rect(56, 56, 14, 32, '#d97a64', 1, null), rect(70, 56, 12, 32, '#e09a88', 0, null), rect(56, 56, 40, 32, 'none', 1, C.ink, 1.4), line('M58 72 L94 72', '#f2e1a0', 1.6)), ring(76, 72, 26),
    greyed(vase(24, 104, 0.8, '#9aa3ad', false))),
  'mus.luftfuktighet': all(room(), at(60, 54, 1, circle(0, 0, 30, C.white, C.ink, 2), path('M-24 10 A26 26 0 0 1 24 10', 'none', C.grey2, 5), path('M-8 -24 A26 26 0 0 1 8 -24', 'none', GOOD, 5), line('M0 0 L0 -22', C.red, 2.2), circle(0, 0, 3, C.ink, null),
    T(-20, 4, '0', 7, C.ink), T(0, 14, '50', 7, C.ink), T(20, 4, '100', 7, C.ink)), ...[[18, 30], [24, 46], [96, 28], [102, 46], [16, 62], [104, 64]].map(([x, y]) => path(`M${x} ${y! - 5} C${x! + 4} ${y} ${x! + 3} ${y! + 4} ${x} ${y! + 4} C${x! - 3} ${y! + 4} ${x! - 4} ${y} ${x} ${y! - 5} Z`, '#8cc7e8', C.ink, 1)), ring(60, 54, 34)),
  'mus.skadedjur': all(room(), table(92), cloth(14, 56, 70, 36, WOOL), ...[[30, 66, 3], [52, 80, 4], [70, 64, 2.6], [40, 84, 2.4]].map(([x, y, r]) => circle(x!, y!, r!, WALL, C.ink, 0.8)), bug(36, 72, 1.6, 30), bug(62, 74, 1.6, -40), bug(76, 82, 1.3, 10), moth(92, 34, 1.8), moth(70, 26, 1.3),
    ring(50, 74, 22)),
  'mus.nedbrytning': all(room(), table(84), book(18, 72, 0.9, '#7a3b3b'), arrow(30, 70, 40, 70, HL, 2), at(52, 72, 0.9, path('M-9 -12 L9 -12 L8 12 L-8 12 Z', '#8a5050', C.ink, 1.2), path('M2 -12 L9 -6 L9 -12 Z', WALL, null), circle(-3, 4, 2, WALL, C.ink, 0.6)), arrow(64, 70, 74, 70, HL, 2),
    at(90, 76, 1, path('M-10 8 L-6 -4 L-1 0 L3 -8 L8 2 L10 8 Z', '#9a6a5a', C.ink, 1.2), ...[[-12, 10], [12, 9], [4, 11], [-4, 11]].map(([x, y]) => circle(x!, y!, 1.2, '#9a6a5a', null))), T(18, 50, '1', 8, C.grey), T(52, 50, '50', 8, C.grey), T(90, 50, '200', 8, C.grey)),
  'mus.konservering': all(room(), table(84), greyed(sword(28, 54, 1.1, 90, RUST), ...[[20, 62], [30, 66], [38, 64], [26, 74], [36, 80]].map(([x, y]) => circle(x!, y!, 1.8, RUST, null)), arrow(28, 64, 28, 80, C.grey, 2)),
    rect(64, 36, 50, 44, 'rgba(190,225,245,0.35)', 4, GOOD, 2), sword(89, 58, 1.1, 90, RUST), ...[[78, 56], [96, 60], [104, 56]].map(([x, y]) => circle(x!, y!, 1.6, '#7a3a1a', null)), line('M68 52 L110 52', 'rgba(255,255,255,0.8)', 1.4),
    at(89, 74, 1, line('M0 -6 L0 4', RUST, 2), circle(0, 0, 7, 'none', C.red, 2), line('M-5 5 L5 -5', C.red, 2)), at(104, 24, 1, rect(-7, -10, 14, 18, C.white, 2, C.ink, 1), T(0, 2, '50', 5.6, GOOD)), okC(72, 24, 6)),
  'mus.restaurera': all(room(), greyed(painting(26, 44, 34, 28), line('M14 34 L22 46 L18 54 M30 36 L36 50', C.ink, 1.4), rect(26, 50, 10, 6, WALL, 0, null)), arrow(48, 44, 70, 44, HL, 2.8), painting(92, 44, 34, 28), sparkle(108, 26, 4), sparkle(78, 26, 3),
    conservator(64, 'smile', { h: 0.48, hairStyle: 'short' }), brush(76, 80, 0.6, 30)),
  // 2336 Digitala museisamlingar
  'mus.digital.2': all(room(), greyed(rect(8, 30, 30, 4, WOOD, 1, C.ink, 1), book(16, 18, 0.5), book(28, 18, 0.5, '#3b5a7a'), rect(8, 70, 30, 4, WOOD, 1, C.ink, 1), book(16, 58, 0.5, '#4a7a3b')),
    at(84, 22, 1.1, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', C.white, C.ink, 1.3)), dash('M74 32 L66 50 M94 32 L104 66', C.denim, 1.4, '2 3'),
    monitor(64, 68, 40, 30, all(rect(48, 57, 10, 14, '#7a3b3b', 1, null), rect(60, 57, 10, 14, '#3b5a7a', 1, null), rect(72, 57, 8, 14, '#4a7a3b', 1, null), line('M48 76 L80 76', C.grey, 1))),
    at(104, 80, 1, rect(-8, -14, 16, 28, C.dark, 3, C.ink, 1.2), rect(-6, -11, 12, 20, SCREEN, 1, null), rect(-4, -8, 8, 12, '#7a3b3b', 1, null)), box(42, 10, 74, 98)),
  'mus.skanna.2': all(room(), table(84), at(36, 78, 1, rect(-28, -6, 56, 12, C.grey2, 2, C.ink, 1.4), rect(-24, -9, 48, 4, 'rgba(255,255,255,0.7)', 1, C.ink, 1), rect(-14, -13, 24, 4, '#f4eedc', 0.5, C.ink, 0.8), line('M-26 -2 L26 -2', '#9be27a', 2.4)), line('M10 -2', C.ink, 1),
    monitor(90, 50, 36, 28, all(rect(78, 42, 24, 16, '#f4eedc', 1, C.ink, 0.6), circle(86, 48, 2, C.skin, null), path('M82 56 C84 50 88 50 90 56 Z', C.orange, null))), arrow(60, 66, 74, 58, HL, 2.2), rect(23, 61, 26, 10, 'none', 2, HL, 2)),
  'mus.digitalisera': all(room(), table(90), vase(20, 90, 1.1), at(48, 66, 1, rect(-8, -6, 16, 12, C.dark, 2, C.ink, 1.2), circle(0, 0, 4, SCREEN, C.ink, 1), rect(-4, -9, 6, 3, C.dark, 1, null)), line('M48 72 L44 90 M48 72 L52 90', C.dark, 1.6),
    arrow(58, 60, 70, 60, HL, 2.4), monitor(92, 56, 38, 30, all(thumbV(92, 66, 1.4), ...[0, 1, 2].map((i) => rect(77, 46 + i * 5, 6, 3, C.grey, 0, null))))),
  'mus.högupplöst': all(room(), greyed(at(28, 54, 1, rect(-20, -20, 40, 40, SCREEN, 1, C.ink, 1.4), ...[[-12, -4, 8], [-4, -12, 8], [-4, -4, 8], [-4, 4, 8], [4, -4, 8], [-12, 4, 8], [4, 4, 8], [4, -12, 8]].map(([x, y, s]) => rect(x!, y!, s!, s!, '#c4703e', 0, null)))),
    at(88, 54, 1, rect(-22, -22, 44, 44, SCREEN, 1, C.ink, 1.4), vase(0, 16, 1.1)), line('M78 46 L86 46 M90 46 L98 46', '#f3e2c4', 0.8), sparkle(108, 32, 3), box(64, 30, 48, 48)),
  'mus.sökbar': all(room(), greyed(...[[14, 104], [24, 100], [34, 104], [20, 94], [30, 92], [26, 86]].map(([x, y], i) => (i % 2 ? cupM(x!, y!, 0.6) : vase(x!, y!, 0.3))), qm(30, 72, 12, C.ink)),
    ...[0, 1, 2].map((r) => all(...[0, 1, 2, 3].map((c) => { const x = 52 + c * 17, y = 30 + r * 26; return all(r % 2 ? cupM(x, y, 0.7) : vase(x, y, 0.32), line(`M${x + 4} ${y - 6} L${x + 8} ${y - 9}`, C.ink, 0.6), rect(x + 7, y - 12, 7, 5, [C.yellow, C.mint, C.rose, C.lilac][(r + c) % 4]!, 1, C.ink, 0.7)); }))),
    at(98, 66, 1, circle(0, 0, 9, 'rgba(190,225,245,0.5)', C.ink, 2), line('M6 6 L13 13', C.dark, 3.4)), ring(94, 62, 6), sparkle(110, 50, 3)),
  'mus.ladda-ner': all(room(), monitor(36, 40, 50, 36, all(painting(36, 38, 30, 20))), arrow(70, 30, 88, 54, HL, 2.6), at(92, 78, 1, rect(-14, -22, 28, 44, C.dark, 3, C.ink, 1.4), rect(-12, -18, 24, 32, SCREEN, 1, null), painting(0, -6, 18, 14), rect(-10, 10, 20, 3, C.white, 1, C.ink, 0.6), rect(-10, 10, 14, 3, GOOD, 1, null)),
    line('M84 92 L100 92', C.ink, 1), ring(92, 72, 24)),
  'mus.virtuell': all(rect(4, 4, 112, 108, '#e6ecf2', 3, null), dash('M10 20 L50 12 L50 60 L10 66 Z', C.purple, 1.4), dash('M70 12 L110 20 L110 66 L70 60 Z', C.purple, 1.4), at(30, 40, 1, painting(0, 0, 22, 16)), at(90, 40, 1, painting(0, 0, 22, 16)), dash('M52 100 L56 74 L64 74 L68 100', C.purple, 1.4), bust(60, 74, 0.6, '#e6e0f4'),
    fig(60, C.green, 'laugh', { hairStyle: 'short', h: 0.62 }), on(60, 0.62, rect(-12, -62, 24, 10, C.dark, 3, C.ink, 1.4), line('M-12 -57 L-14 -56 M12 -57 L14 -56', C.dark, 2)), ring(60, 57, 11)),
  // 2337 Förmedla historia till besökare
  'mus.dräkt.2': all(room(), painting(96, 30, 24, 20, C.gold), fig(46, '#7a4a8a', 'smile', { hairStyle: 'long' }), costume(46, 1), greyed(fig(96, C.denim, 'calm', { h: 0.7 })), ring(46, 70, 32)),
  'mus.skolklass': all(sky(), ground(100), museum(60, 64, 0.9), fig(18, C.purple, 'smile', { h: 0.8, hairStyle: 'long' }), ...[[38, C.red, true], [52, C.yellow, false], [66, C.green, true], [80, C.orange, false], [94, C.denim, true], [108, C.pink, false]].map(([x, c, l]) => all(kid(x as number, c as string, 'smile', l as boolean, 0.42), on(x as number, 0.42, rect(-16, -36, 6, 22, C.navy, 2, C.ink, 1))))),
  'mus.levandegöra': all(room(), greyed(rect(8, 14, 44, 36, PAPER, 1, C.ink, 1.4), rect(14, 26, 14, 14, C.brown, 0.5, C.ink, 0.8), path('M12 26 L21 18 L30 26 Z', C.brown, C.ink, 0.8), stand(38, 44, 0.16, fig(60, C.grey, 'calm')), stand(44, 44, 0.14, fig(60, C.grey, 'calm'))), arrow(56, 32, 66, 32, HL, 2.6),
    rect(68, 8, 46, 48, '#cfe6f4', 1, C.ink, 1.4), rect(68, 44, 46, 12, '#9fd27e', 0, null), rect(74, 30, 16, 16, C.red, 0.5, C.ink, 0.9), path('M72 30 L82 20 L92 30 Z', '#8a5a34', C.ink, 0.9), path('M86 22 C84 16 90 14 88 8', 'none', C.grey, 1.4), circle(106, 16, 5, C.yellow, C.ink, 1),
    stand(98, 54, 0.22, fig(60, C.orange, 'laugh', { hairStyle: 'long' })), stand(106, 54, 0.2, fig(60, C.denim, 'laugh')), line('M95 36 l-3 -3 M109 36 l3 -3', C.gold, 1.2), sparkle(72, 12, 3),
    ...[[30, C.red], [52, C.yellow], [74, C.green], [96, C.purple]].map(([x, c]) => all(circle(x as number, 90, 7, C.skin, C.ink, 1.2), path(`M${(x as number) - 7} 88 C${(x as number) - 7} 80 ${(x as number) + 7} 80 ${(x as number) + 7} 88 C${(x as number) + 3} 85 ${(x as number) - 3} 85 ${(x as number) - 7} 88 Z`, C.hair, null), path(`M${(x as number) - 10} 112 C${(x as number) - 10} 98 ${(x as number) + 10} 98 ${(x as number) + 10} 112 Z`, c as string, C.ink, 1.2))), box(66, 6, 50, 52)),
  'mus.rollspel': all(sky(), ground(100, '#c9d8a0'), rect(84, 46, 30, 54, WOOD, 1, C.ink, 1.4), path('M80 48 L99 30 L118 48 Z', '#8a5a34', C.ink, 1.4), rect(94, 74, 10, 26, '#6e4426', 1, C.ink, 1),
    kid(26, '#8a6a4a', 'laugh', false, 0.58), on(26, 0.58, path('M-14 -64 L14 -64 L10 -70 L-10 -70 Z', '#c9a46a', C.ink, 1.4)), reach(26, 0.58, 1, 40, 84), at(42, 92, 1, path('M-5 -8 L5 -8 L4 2 L-4 2 Z', WOOD, C.ink, 1)),
    kid(58, '#a05a5a', 'smile', true, 0.58), costume(58, 0.58, '#a05a5a'), reach(58, 0.58, -1, 44, 82), greyed(stand(108, 112, 0.36, fig(60, C.purple, 'smile'))), path('M60 10 C66 4 76 4 80 12', 'none', C.gold, 1.4)),
  'mus.workshop': all(room(), table(80), fig(22, C.red, 'smile', { h: 0.76, hairStyle: 'long' }), reach(22, 0.76, 1, 36, 74), fig(98, C.green, 'smile', { h: 0.76 }), reach(98, 0.76, -1, 84, 74), staff(60, 'laugh', { h: 0.82, hairStyle: 'short' }), reach(60, 0.82, 1, 70, 72),
    at(38, 80, 1, path('M-6 -10 L6 -10 L7 0 L-7 0 Z', CLAY, C.ink, 1.1)), at(82, 80, 1, path('M-5 -8 C-8 -4 -6 0 0 0 C6 0 8 -4 5 -8 Z', CLAY, C.ink, 1.1)), ellipse(60, 79, 9, 2.4, '#b06040', C.ink, 0.8), path('M54 78 C54 70 66 70 66 78', CLAY2, C.ink, 1)),
  'mus.interaktiv': all(room(), greyed(vitrine(22, 112, 26, 22, 30, vase(22, 82, 0.6))), rect(48, 50, 64, 46, C.dark, 3, C.ink, 1.4), rect(52, 54, 56, 26, SCREEN, 1, null), thumbV(80, 74, 1.6), sparkle(66, 60, 3), sparkle(96, 62, 3),
    circle(66, 88, 5, C.red, C.ink, 1.2), circle(80, 88, 5, C.yellow, C.ink, 1.2), circle(94, 88, 5, C.green, C.ink, 1.2), kid(40, C.orange, 'laugh', true, 0.62), reach(40, 0.62, 1, 64, 86), line('M100 54 q4 4 0 8 M104 50 q7 8 0 16', HL, 1.4), ring(66, 88, 9)),
  'mus.engagera': all(room(), greyed(...[14, 30, 46].map((x) => fig(x, C.grey, 'sleepy', { h: 0.55 }))), circle(36, 40, 2, 'none', C.grey, 1), circle(40, 33, 3, 'none', C.grey, 1), circle(46, 24, 4, 'none', C.grey, 1), arrow(54, 72, 64, 72, HL, 2.6),
    ...[[76, C.red], [92, C.green], [108, C.yellow]].map(([x, c]) => all(fig(x as number, c as string, 'laugh', { h: 0.55 }), reach(x as number, 0.55, -1, (x as number) - 4, 40), circle((x as number) - 4, 40, 2, C.skin, C.ink, 1))), sparkle(84, 30, 3), sparkle(100, 28, 3), heart(92, 22, 0.35), box(64, 18, 52, 94)),
};

/** A small heart (kept local so the file has no extra imports). */
function heart(x: number, y: number, s = 1): Svg {
  return g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4));
}
