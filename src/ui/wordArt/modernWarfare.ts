/**
 * Historia & humaniora → Krig & militärhistoria → Modern krigföring, 2051–2057 (0.37): combined arms,
 * intelligence and reconnaissance, guerrilla and asymmetric warfare, cyber and information operations,
 * air defence and missiles, peacekeeping, and the laws of war and civil protection.
 * Recurring signs: our soldiers wear olive-green with a round helmet, the enemy wears dark red; missiles
 * and robots are grey bodies with an orange nose flame; screens and computers are dark rectangles with a
 * green or blue glow; UN peace soldiers wear a blue helmet; a red cross on white is the protection sign;
 * radar is a dish with thin arcs; maps are seen from above with blue dots for our side and red for the
 * enemy. The thing the word names is ringed or outlined in orange (HL); a grey copy stands beside it
 * where a contrast carries the meaning. Digits only; no words in the pictures, no brands, no national
 * symbols (no swastika), no wounds, no dead bodies, no torture shown, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours and geometry ─────────────────────────────────────────────
const OLIVE = '#6f7a46';
const OLIVE2 = '#515a33';
const FOE = '#b23b34';
const STEEL = '#c0c6cc';
const IRON = '#3d3f4a';
const BODY = '#9aa0a8';
const UNBLUE = '#3f79c8';
const SCREEN = '#28303f';
const GLOW = '#5ad0a0';
const NET = '#4f9d9a';
const SKY = '#cfe3f2';
const SAND = '#d9c79a';
const GRASS = '#d7e3bd';
const SMOKE = '#eceae4';
const FLAME = C.orange;
const f1 = (n: number) => +n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const dashBox = (x: number, y: number, w: number, h: number, col: string = HL) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="${col}" stroke-width="2.2" stroke-dasharray="5 3"/>`;
const dash = (d: string, col: string = C.grey, w = 1.4, da = '4 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${da}"/>`;
const noSign = (x: number, y: number, r: number, col: string = FOE) => all(circle(x, y, r, 'none', col, 3), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, col, 3));

// ── Figures (olive/blue/red) ─────────────────────────────────────────
const fig = (x: number, top: string, mood: Mood = 'calm', more: Partial<Build> = {}) => F({ x, top, mood, bottom: more.bottom ?? OLIVE2, ...more });
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const helmet = (col: string = OLIVE2) => all(path('M-10 -58 C-10 -72 10 -72 10 -58 Z', col, C.ink, 1.4), path('M-12 -57 C-6 -60 6 -60 12 -57 C8 -55 -8 -55 -12 -57 Z', col, C.ink, 1.2));
const soldier = (x: number, h = 1, coat: string = OLIVE, head: Svg = helmet(), mood: Mood = 'calm', extra: Svg = '') => all(fig(x, coat, mood, { h, bottom: OLIVE2 }), on(x, h, head, extra));
/** Small side-view head-and-shoulders soldier (x,y = head centre), facing right. */
const bust = (x: number, y: number, col: string = OLIVE, s = 1, o: { grey?: boolean; skin?: string; hat?: string; vest?: boolean } = {}) => {
  const c = o.grey ? C.grey : col, sk = o.grey ? C.grey2 : (o.skin ?? C.skin), ht = o.grey ? C.grey : (o.hat ?? OLIVE2);
  return g(`translate(${x} ${y}) scale(${s})`, path('M-10 17 C-10 5 10 5 10 17 Z', c, C.ink, 1.3), o.vest ? rect(-7, 5, 14, 11, o.grey ? C.grey2 : IRON, 2, C.ink, 1.1) : '', circle(0, -2, 6.4, sk, C.ink, 1.3), path('M-9 -6 C-9 -14 9 -14 9 -6 C5 -9 -5 -9 -9 -6 Z', ht, C.ink, 1.2));
};
const bustRow = (x: number, y: number, n: number, gap: number, col: string, s = 1, o: Parameters<typeof bust>[4] = {}) => all(...Array.from({ length: n }, (_, i) => bust(x + i * gap, y, col, s, o)));

// ── Weapons, vehicles, tech ──────────────────────────────────────────
const rifle = (x1: number, y1: number, x2: number, y2: number, grey = false) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 4), line(`M${x1} ${y1} L${x2} ${y2}`, grey ? C.grey : IRON, 2.2));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-10 2 -14 -2 -20 0 C-14 -4 -10 -4 0 -4 Z', FLAME, C.ink, 0.8), path('M0 -1 C-7 0 -11 -2 -15 -1 C-11 -3 -7 -3 0 -3 Z', C.yellow, null));
/** A missile body pointing right, nose at (x,y), length L, with a tail flame unless off. */
const missileAt = (x: number, y: number, L = 34, s = 1, o: { grey?: boolean; fin?: boolean; up?: boolean; flame?: boolean } = {}) => {
  const col = o.grey ? C.grey : BODY, fin = o.grey ? C.grey2 : OLIVE2;
  const body = all(path(`M0 0 L-10 -5 L-${L} -5 L-${L} 5 L-10 5 Z`, col, C.ink, 1.3), path('M0 0 L-10 -5 L-10 5 Z', o.grey ? C.grey2 : FOE, C.ink, 1), o.fin ? path(`M-${L} -5 L-${L + 7} -11 L-${L - 3} -5 Z M-${L} 5 L-${L + 7} 11 L-${L - 3} 5 Z`, fin, C.ink, 1) : '', o.flame !== false ? at(-L - 2, 0, s, path('M0 -4 C-9 -2 -13 -6 -18 -4 C-13 -8 -9 -8 0 -8 Z', FLAME, C.ink, 0.7)) : '');
  return g(`translate(${x} ${y}) rotate(${o.up ? -60 : 0}) scale(${s})`, body);
};
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '', glow: string = GLOW) => all(rect(x, y, w, h, SCREEN, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, '#11161f', 1, glow, 1), inner);
const monitor = (x: number, y: number, s = 1, inner: Svg = '', glow: string = GLOW) => at(x, y, s, screen(-22, -18, 44, 32, inner, glow), rect(-5, 14, 10, 6, SCREEN, 1, C.ink, 1.2), rect(-16, 20, 32, 4, IRON, 2, C.ink, 1.2));
const lock = (x: number, y: number, s = 1, col: string = C.gold, open = false) => at(x, y, s, path(open ? 'M-6 0 C-6 -12 8 -12 8 -3' : 'M-6 0 C-6 -12 6 -12 6 0', 'none', C.ink, 3), path(open ? 'M-6 0 C-6 -12 8 -12 8 -3' : 'M-6 0 C-6 -12 6 -12 6 0', 'none', STEEL, 1.8), rect(-9, 0, 18, 14, col, 2, C.ink, 1.4), circle(0, 6, 1.8, C.ink, null), line('M0 7 L0 11', C.ink, 1.6));
const key = (x: number, y: number, s = 1) => at(x, y, s, circle(-8, 0, 4, 'none', C.gold, 2.4), line('M-4 0 L10 0', C.gold, 2.4), line('M6 0 L6 5 M10 0 L10 4', C.gold, 2.2));
const drone = (x: number, y: number, s = 1, grey = false) => at(x, y, s, line('M-16 -6 L16 -6', grey ? C.grey : IRON, 2.4), rect(-7, -6, 14, 9, grey ? C.grey2 : BODY, 2, C.ink, 1.3), ...[-16, 16].map((xx) => all(ellipse(xx, -6, 7, 2, 'none', grey ? C.grey : C.ink, 1.4), line(`M${xx} -6 L${xx} -11`, C.ink, 1.6))), circle(0, 3, 2, grey ? C.grey : GLOW, C.ink, 0.8), line('M-4 7 L-7 11 M4 7 L7 11', grey ? C.grey : IRON, 1.4));
const dish = (x: number, y: number, s = 1, grey = false) => at(x, y, s, line('M0 14 L0 2', C.ink, 2.4), path('M-10 2 C-10 -8 10 -8 10 2 Z', grey ? C.grey2 : STEEL, C.ink, 1.4), line('M0 2 L0 -6', C.ink, 1.6), circle(0, -6, 1.8, grey ? C.grey : IRON, C.ink, 0.8), rect(-11, 13, 22, 4, grey ? C.grey2 : IRON, 1, C.ink, 1.2));
const arcs = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M0 -6 C4 -3 4 3 0 6', 'none', col, 1.6), path('M5 -10 C11 -4 11 4 5 10', 'none', col, 1.6), path('M10 -14 C18 -5 18 5 10 14', 'none', col, 1.4));
const redCross = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -9, 18, 18, C.white, 2, C.ink, 1.4), path('M-2 -7 L2 -7 L2 -2 L7 -2 L7 2 L2 2 L2 7 L-2 7 L-2 2 L-7 2 L-7 -2 L-2 -2 Z', FOE, C.ink, 0.8));
const shieldSh = (x: number, y: number, s = 1, col: string = UNBLUE, grey = false) => at(x, y, s, path('M0 -16 L14 -10 C14 6 8 14 0 18 C-8 14 -14 6 -14 -10 Z', grey ? C.grey2 : col, C.ink, 1.6));
const vest = (x: number, y: number, s = 1, grey = false) => at(x, y, s, path('M-12 -14 L-5 -14 L0 -10 L5 -14 L12 -14 L12 16 L-12 16 Z', grey ? C.grey2 : IRON, C.ink, 1.6), line('M0 -9 L0 16', C.ink, 1.2), ...[-6, 0, 6].map((yy) => rect(-9, yy + 2, 18, 3, grey ? C.grey : OLIVE2, 1, C.ink, 0.8)));
const tank = (x: number, y: number, s = 1, col: string = OLIVE, grey = false) => at(x, y, s, rect(-22, -4, 44, 12, grey ? C.grey2 : IRON, 3, C.ink, 1.4), ...[-16, -8, 0, 8, 16].map((xx) => circle(xx, 8, 4, grey ? C.grey : OLIVE2, C.ink, 1)), rect(-14, -14, 24, 11, grey ? C.grey : col, 3, C.ink, 1.4), line('M10 -9 L30 -9', grey ? C.grey2 : IRON, 2.6), line('M10 -9 L30 -9', C.ink, 1));
const chopper = (x: number, y: number, s = 1, grey = false) => at(x, y, s, line('M-22 -14 L22 -14', grey ? C.grey : IRON, 2.6), line('M0 -14 L0 -8', C.ink, 2), path('M-18 -8 C-18 -2 18 -2 20 -8 C22 -4 16 4 -2 4 C-14 4 -18 0 -18 -8 Z', grey ? C.grey2 : OLIVE, C.ink, 1.4), path('M18 -6 L34 -4 L34 0 L18 2 Z', grey ? C.grey2 : OLIVE, C.ink, 1.3), line('M34 -8 L34 4', grey ? C.grey : IRON, 2), circle(-8, -3, 2.4, grey ? C.grey : SKY, C.ink, 0.8));
const mortarTube = (x: number, y: number, s = 1, grey = false) => at(x, y, s, g('rotate(-52)', rect(-5, -26, 10, 30, grey ? C.grey2 : IRON, 2, C.ink, 1.4)), line('M-14 4 L14 4', C.ink, 3), line('M-10 4 L0 -12 M10 4 L0 -12', grey ? C.grey : IRON, 2.4));
const house = (x: number, y: number, s = 1, col: string = SAND, grey = false) => at(x, y, s, rect(-12, -16, 24, 16, grey ? C.grey2 : col, 0, C.ink, 1.3), path('M-15 -16 L0 -26 L15 -16 Z', grey ? C.grey : '#9a6a40', C.ink, 1.3), rect(-3, -9, 6, 9, '#6b4220', 0, null));
const factory = (x: number, y: number, s = 1, grey = false) => at(x, y, s, rect(-18, -20, 36, 20, grey ? C.grey2 : '#b7b2a6', 0, C.ink, 1.4), path('M-18 -20 L-10 -28 L-10 -20 M-10 -20 L-2 -28 L-2 -20 M-2 -20 L6 -28 L6 -20', 'none', C.ink, 1.2), rect(10, -34, 6, 14, grey ? C.grey : '#8a857a', 0, C.ink, 1.2));
const flag = (x: number, y: number, col: string = UNBLUE, s = 1) => at(x, y, s, line('M0 0 L0 -32', C.ink, 2.4), path('M0 -32 L18 -28 L0 -22 Z', col, C.ink, 1.2));
const mine = (x: number, y: number, s = 1, grey = false) => at(x, y, s, ellipse(0, 0, 8, 5, grey ? C.grey2 : IRON, C.ink, 1.3), ...[-5, 0, 5].map((xx) => line(`M${xx} -4 L${xx} -8`, grey ? C.grey : IRON, 1.4)), circle(0, -9, 1.6, grey ? C.grey : FOE, C.ink, 0.6));
const flake = (x: number, y: number, s = 1, col: string = C.grey) => at(x, y, s, line('M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2', col, 1.2));
const bubble = (x: number, y: number, w: number, h: number, inner: Svg = '', tail = 1) => all(rect(x - w / 2, y - h / 2, w, h, C.white, 5, C.ink, 1.4), path(`M${f1(x + tail * 4)} ${f1(y + h / 2 - 3)} L${f1(x + tail * 9)} ${f1(y + h / 2 + 6)} L${f1(x + tail * 12)} ${f1(y + h / 2 - 3)} Z`, C.white, C.ink, 1.2), inner);
const map = (x: number, y: number, w: number, h: number, bg: string = GRASS) => rect(x, y, w, h, bg, 3, C.ink, 1.4);

// ── Motifs ───────────────────────────────────────────────────────────
export const MODERN_WARFARE_MOTIFS: Record<string, Svg> = {
  // T06-1 Kombinerade vapensystem ------------------------------------
  'mkrig.vapenslag': all(map(8, 70, 104, 42), bust(26, 80, OLIVE, 0.8), tank(58, 86, 0.6), mortarTube(92, 92, 0.6), ring(26, 78, 12), ground),
  'mkrig.pluton': all(bustRow(16, 70, 5, 16, OLIVE, 0.78), bustRow(16, 92, 4, 16, OLIVE, 0.78), bust(96, 70, OLIVE, 0.9, { hat: '#4a5230' }), ring(96, 66, 14), ground),
  'mkrig.stab': all(rect(14, 40, 92, 54, '#efe7d6', 3, C.ink, 1.4), map(24, 50, 50, 34, '#dCe6c2'), dash('M30 62 L64 74', FOE, 1.6, '3 2'), bust(86, 60, OLIVE, 0.8, { hat: '#4a5230' }), bust(96, 72, OLIVE, 0.7), arrow(80, 56, 70, 64, HL, 2), ground),
  'mkrig.skyddsväst': all(vest(60, 56, 2.1), ring(60, 56, 30), greyed(at(100, 70, 1, path('M-7 -8 L-3 -8 L0 -5 L3 -8 L7 -8 L7 10 L-7 10 Z', C.grey2, C.ink, 1.2))), ground),
  'mkrig.stridsfordon': all(tank(56, 86, 1.3), bust(40, 66, OLIVE, 0.6), bust(72, 66, OLIVE, 0.6), ring(56, 74, 26), ground),
  'mkrig.granatkastare': all(mortarTube(52, 92, 1.5), at(84, 30, 1, path('M0 0 L-4 -7 L4 -7 Z', IRON, C.ink, 1), ellipse(0, -9, 4, 3, IRON, C.ink, 1)), dash('M44 78 C64 20 78 24 84 34', C.grey, 1.6, '4 3'), ring(52, 86, 18), ground),
  'mkrig.haubits': all(at(58, 92, 1.4, rect(-20, -4, 20, 10, OLIVE, 2, C.ink, 1.4), circle(-16, 8, 5, OLIVE2, C.ink, 1.2), circle(-4, 8, 5, OLIVE2, C.ink, 1.2), g('translate(-2 -2) rotate(-24)', rect(-2, -3.4, 30, 6.8, IRON, 2, C.ink, 1.4))), flame(96, 76, 1.1), ring(58, 84, 22), ground),
  'mkrig.attackhelikopter': all(chopper(56, 40, 1.5), missileAt(44, 58, 10, 0.8, { grey: true, flame: false }), missileAt(68, 58, 10, 0.8, { grey: true, flame: false }), ring(56, 44, 30), ground),
  'mkrig.eldunderstöd': all(at(26, 92, 1, rect(-14, -4, 14, 9, OLIVE, 2, C.ink, 1.3), g('translate(-2 -2) rotate(-20)', rect(-2, -3, 22, 6, IRON, 2, C.ink, 1.3))), flame(54, 72, 1), arrow(58, 70, 92, 56, HL, 3), bustRow(92, 72, 2, 12, OLIVE, 0.7), ground),
  'mkrig.samordna': all(circle(60, 56, 6, HL, C.ink, 1.4), ...[[24, 40], [96, 40], [24, 86], [96, 86]].map(([x, y], i) => all(bust(x!, y!, [OLIVE, UNBLUE, '#b07a3a', OLIVE2][i]!, 0.66), arrow(x! + (x! < 60 ? 10 : -10), y! + (y! < 60 ? 6 : -6), 54 + (x! < 60 ? 0 : 12), 56 + (y! < 60 ? 0 : 0), HL, 2))), ground),
  'mkrig.manöver': all(map(8, 60, 104, 52), bustRow(22, 74, 2, 12, UNBLUE, 0.6), arrow(30, 80, 70, 70, UNBLUE, 3), arrow(70, 70, 92, 88, UNBLUE, 3), bustRow(90, 96, 2, 10, FOE, 0.6), dash('M30 80 C64 60 80 78 92 90', C.grey, 1.4), ground),

  // T06-2 Underrättelse och spaning ----------------------------------
  'mkrig.underrättelse': all(at(16, 26, 1, rect(-9, -7, 18, 14, SKY, 2, C.ink, 1.2), path('M-7 5 L-2 -2 L2 2 L5 -1 L8 5 Z', '#6a9a4a', null)), dish(16, 50, 0.6), at(16, 76, 1, rect(-4, -4, 8, 8, BODY, 1, C.ink, 1.1), rect(-13, -2, 8, 4, UNBLUE, 0, C.ink, 0.8), rect(5, -2, 8, 4, UNBLUE, 0, C.ink, 0.8)), at(16, 100, 1, rect(-7, -9, 14, 18, C.white, 1, C.ink, 1.2), line('M-4 -4 L4 -4 M-4 0 L4 0 M-4 4 L2 4', C.grey, 1)), ...([[28, 28], [28, 52], [30, 76], [26, 98]] as const).map(([x, y]) => arrow(x, y, 46, 50, C.grey, 1.6)), path('M44 38 L72 38 L62 58 L62 70 L54 70 L54 58 Z', '#e6d6a6', C.ink, 1.6), arrow(58, 72, 70, 84, HL, 2.4), at(82, 88, 1, rect(-11, -8, 22, 16, '#d9a35a', 2, C.ink, 1.4), path('M-11 -8 L-11 -11 L-3 -11 L-1 -8 Z', '#d9a35a', C.ink, 1.2)), ring(82, 88, 14), bust(104, 74, OLIVE, 0.8, { hat: '#4a5230' }), star(104, 64, 3, C.gold), ground),
  'mkrig.underrättelsetjänst': all(rect(20, 30, 80, 60, '#d9d2c2', 2, C.ink, 1.4), ...[40, 60, 80].map((y) => line(`M24 ${y} L96 ${y}`, C.grey2, 1)), at(60, 52, 1, circle(0, 0, 12, 'none', IRON, 2.4), line('M9 9 L18 18', IRON, 3)), rect(30, 68, 60, 18, SCREEN, 2, C.ink, 1.3), circle(42, 77, 3, GLOW, null), ground),
  'mkrig.spaning': all(at(60, 56, 1.4, circle(0, 0, 16, 'none', IRON, 3), circle(0, 0, 11, SKY, IRON, 1.4), line('M11 11 L22 22', IRON, 4), line('M-5 0 L5 0 M0 -5 L0 5', FOE, 1.2)), greyed(bust(100, 84, C.grey, 0.7)), ring(54, 50, 20), ground),
  'mkrig.rekognosera': all(map(8, 64, 104, 48), dash('M20 100 C40 70 70 96 96 72', FOE, 1.8, '5 3'), bust(20, 96, OLIVE, 0.7), at(30, 84, 1, line('M0 0 L10 -8', IRON, 2.4)), house(78, 84, 0.7, SAND, true), ground),
  'mkrig.drönare': all(drone(58, 44, 1.6), dash('M58 58 L58 86', C.grey, 1.4), at(58, 90, 0.8, rect(-10, -2, 20, 4, C.grey2, 1, C.ink, 1)), ring(58, 44, 28), ground),
  'mkrig.spionera': all(house(40, 92, 1, SAND), at(84, 66, 1.2, circle(0, 0, 10, SKY, IRON, 2), circle(0, 0, 4, C.ink, null)), dash('M58 78 L74 70', C.grey, 1.4), greyed(bust(100, 86, C.grey, 0.7)), ground),
  'mkrig.signalspaning': all(dish(40, 70, 1.4), arcs(60, 56, 1.2, HL), at(94, 44, 0.9, rect(-7, -10, 14, 24, SCREEN, 2, C.ink, 1.3), path('M-4 2 L-1 -4 L2 4 L5 -2', 'none', GLOW, 1.4)), ground),
  'mkrig.avlyssna': all(at(44, 60, 1, rect(-7, -12, 14, 24, SCREEN, 3, C.ink, 1.4), circle(0, 7, 2, GLOW, null)), at(78, 44, 1.2, path('M0 0 C-7 -4 -7 -14 0 -18', 'none', IRON, 3), circle(2, -9, 4, IRON, C.ink, 1)), arcs(90, 70, 1, HL), ground),
  'mkrig.kamouflage': all(at(60, 70, 1, ...[[-20, -14], [0, -18], [20, -12], [-14, 2], [8, 0], [24, 6], [-24, 10]].map(([x, y], i) => path(`M${x} ${y} q8 -4 14 2 q-4 8 -12 6 q-6 -4 -2 -8 Z`, [OLIVE, OLIVE2, '#8a8a52', '#6f7a46'][i % 4]!, C.ink, 0.8))), ring(60, 66, 30), ground),
  'mkrig.kamouflera': all(mortarTube(48, 94, 1, true), ...[[40, 70], [56, 66], [48, 80]].map(([x, y]) => path(`M${x} ${y} q9 -3 15 3 q-4 9 -13 7 q-7 -5 -2 -10 Z`, OLIVE, C.ink, 0.9)), at(36, 74, 1, line('M0 0 L-6 -10 M4 2 L10 -8', '#4f7f3a', 2)), ring(50, 80, 22), ground),
  'mkrig.agent': all(fig(60, '#2f3340', 'calm', { h: 0.95, bottom: '#2f3340' }), on(60, 0.95, all(path('M-10 -58 C-10 -66 10 -66 10 -58 Z', '#2f3340', C.ink, 1.3), path('M-12 -58 L12 -58 L12 -55 L-12 -55 Z', '#2f3340', C.ink, 1))), at(60, 54, 1, rect(-10, -2, 20, 5, SCREEN, 2, C.ink, 1.1)), ground),
  'mkrig.lägesbild': all(monitor(56, 50, 1.1, all(rect(-16, -11, 32, 22, '#17202b', 0, null), circle(-6, -2, 2, UNBLUE, null), circle(4, 3, 2, UNBLUE, null), circle(8, -5, 2, FOE, null), line('M-14 6 L14 6', NET, 0.8)), UNBLUE), ring(56, 44, 28), ground),
  'mkrig.kikare': all(at(58, 58, 1.7, rect(-13, -8, 11, 20, IRON, 3, C.ink, 1.4), rect(2, -8, 11, 20, IRON, 3, C.ink, 1.4), rect(-13, -10, 11, 5, SKY, 1, C.ink, 1.1), rect(2, -10, 11, 5, SKY, 1, C.ink, 1.1), line('M-2 -4 L2 -4', IRON, 2)), ring(58, 56, 26), ground),

  // T06-3 Gerilla och asymmetrisk krigföring -------------------------
  'mkrig.gerilla': all(at(34, 70, 1, path('M-16 10 L0 -10 L16 10 Z', '#4f7f3a', C.ink, 1.2), path('M-16 30 L0 10 L16 30 Z', '#4f7f3a', C.ink, 1.2)), bust(44, 84, OLIVE, 0.7, { hat: '#4f7f3a' }), bust(70, 90, OLIVE, 0.66), rifle(60, 84, 78, 80), ring(44, 80, 14), ground),
  'mkrig.gerillakrig': all(map(8, 56, 104, 56), ...([[20, 76], [36, 70], [92, 96]] as const).map(([x, y]) => path(`M${x - 8} ${y} L${x} ${y - 10} L${x + 8} ${y} Z`, '#4f7f3a', C.ink, 1)), bust(28, 88, OLIVE, 0.6), arrow(40, 84, 70, 92, FOE, 2.4), bustRow(84, 96, 2, 10, FOE, 0.58), dash('M40 84 C56 74 72 88 84 94', C.grey, 1.3), ground),
  'mkrig.asymmetrisk': all(ground, at(32, 92, 1, rect(-18, -8, 36, 8, OLIVE, 2, C.ink, 1.3), circle(-10, 4, 4, OLIVE2, C.ink, 1), circle(8, 4, 4, OLIVE2, C.ink, 1), rect(-10, -16, 18, 9, OLIVE, 2, C.ink, 1.3)), bust(92, 92, FOE, 0.7, { hat: '#4f7f3a' }), line('M60 30 L60 104', C.grey2, 2, '4 3'), at(46, 22, 1, path('M-6 6 L0 -6 L6 6 Z', HL, C.ink, 1))),
  'mkrig.partisan': all(bust(44, 82, OLIVE, 0.9, { hat: '#4f7f3a' }), rifle(52, 80, 72, 86, false), at(90, 70, 1, rect(-8, -2, 16, 5, IRON, 1, C.ink, 1.1), line('M0 -2 L0 -12', IRON, 2)), dash('M30 60 L30 100', '#4f7f3a', 2, '3 4'), ground),
  'mkrig.sabotage': all(at(40, 84, 1.1, rect(-20, -4, 40, 8, '#8a6a3a', 2, C.ink, 1.3), line('M-20 0 L-6 -14 M6 -14 L20 0', '#8a6a3a', 3)), at(10, 70, 0, ''), g('translate(2 2)', line('M34 86 L46 98 M46 86 L34 98', FOE, 3)), at(70, 60, 1, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', FLAME, C.ink, 1)), ring(44, 90, 16), ground),
  'mkrig.sabotera': all(factory(44, 94, 1, false), at(70, 60, 1.1, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', FLAME, C.ink, 1)), line('M58 70 L70 60', HL, 2.4), greyed(bust(100, 86, C.grey, 0.66)), ground),
  'mkrig.ockupationsmakt': all(house(34, 92, 1, SAND, true), house(60, 92, 1, SAND, true), bust(92, 84, FOE, 0.9, { vest: true }), flag(92, 72, FOE, 0.8), ring(92, 80, 16), ground),
  'mkrig.milis': all(bustRow(20, 84, 4, 18, '#8a7a4a', 0.74), ...[26, 44, 62, 80].map((x, i) => rifle(x + 4, 80, x + 16, 74 + (i % 2) * 3)), greyed(bust(104, 72, C.grey, 0.8, { hat: OLIVE2 })), ground),
  'mkrig.krypskytt': all(rect(14, 36, 92, 8, '#9a6a40', 2, C.ink, 1.3), at(30, 32, 1, path('M-10 0 C-10 -8 10 -8 10 0 Z', '#4f7f3a', C.ink, 1.2), circle(0, -2, 5, C.skin, C.ink, 1.1)), rifle(38, 32, 86, 28), at(88, 26, 0.8, flame(0, 0, 0.7)), ring(30, 30, 14), ground),
  'mkrig.underlägsen': all(line('M28 72 L92 72', '#b08a5a', 2.6), fig(22, C.denim, 'frown', { h: 0.6, bottom: C.navy }), ring(22, 74, 16), greyed(fig(64, C.grey, 'calm', { h: 0.88 }), fig(80, C.grey, 'calm', { h: 0.92 }), fig(96, C.grey, 'calm', { h: 0.88 })), arrow(36, 56, 52, 56, HL, 2.6), ground),
  'mkrig.lokalbefolkning': all(house(30, 90, 1, SAND), house(94, 90, 1, SAND), bustRow(44, 92, 3, 15, '#7a6a8a', 0.74, { hat: '#6b5a4a' }), ring(58, 86, 24), ground),
  'mkrig.terrorism': all(house(14, 96, 0.9, SAND), house(106, 96, 0.9, SAND), rect(4, 96, 112, 16, '#d8d4cc', 0, null), at(26, 44, 1, circle(0, 0, 11, C.black, C.ink, 1.4), line('M6 -9 L11 -15', C.ink, 2), path('M11 -15 L14 -20 L12 -14 L17 -17 Z', FLAME, C.ink, 0.6)), fig(54, C.denim, 'shock', { h: 0.62, bottom: C.navy }), fig(76, C.pink, 'shock', { h: 0.58, hairStyle: 'long', bottom: C.navy }), fig(96, '#e8c23a', 'shock', { h: 0.48, bottom: C.navy }), arrow(60, 52, 76, 52, C.grey, 2), arrow(82, 58, 98, 58, C.grey, 2), ...([[54, 30], [78, 34], [100, 44]] as const).map(([x, y]) => all(rect(x - 1.6, y - 9, 3.2, 9, FOE, 1, null), circle(x, y + 3, 1.8, FOE, null))), ground),
  'mkrig.attentat': all(bust(40, 70, '#2f3340', 1.3, { hat: '#2f3340', skin: C.skin }), star(40, 56, 4, C.gold), at(86, 50, 1.2, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', FLAME, C.ink, 1)), dash('M60 70 L78 56', C.grey, 1.4), ground),

  // T06-4 Cyber- och informationsoperationer -------------------------
  'mkrig.cyberattack': all(monitor(56, 52, 1.2, all(line('M-10 -8 L10 8 M10 -8 L-10 8', FOE, 2.4), circle(0, 0, 9, 'none', FOE, 1.4)), '#e88'), at(90, 30, 0.8, path('M0 -6 L2 -1 L7 0 L3 2 L4 7 L0 4 L-4 7 L-3 2 L-7 0 L-2 -1 Z', FLAME, C.ink, 0.8)), ground),
  'mkrig.cyberangrepp': all(monitor(44, 52, 1.1, all(line('M-12 -6 L12 -6 M-12 2 L8 2', NET, 1.2), line('M-6 8 L6 8', FOE, 2)), '#e88'), arrow(70, 48, 90, 60, FOE, 3), factory(96, 86, 0.6, true), ground),
  'mkrig.cyberförsvar': all(shieldSh(56, 52, 2, UNBLUE), at(56, 52, 1, rect(-8, -3, 16, 12, C.gold, 2, C.ink, 1.3), path('M-5 -3 C-5 -11 5 -11 5 -3', 'none', STEEL, 1.8), circle(0, 3, 1.6, C.ink, null)), greyed(at(100, 70, 1, path('M-8 -10 L8 -6 C8 6 4 10 0 12 C-4 10 -8 6 -8 -6 Z', C.grey2, C.ink, 1.2))), ground),
  'mkrig.hackare': all(fig(58, '#2f3340', 'calm', { h: 0.95, bottom: '#2f3340', hairStyle: 'short' }), on(58, 0.95, path('M-11 -58 C-11 -66 11 -66 11 -58 Z', '#2f3340', C.ink, 1.3)), monitor(58, 86, 0.6, path('M-10 -6 L-4 0 L-10 6 M-2 6 L8 6', 'none', GLOW, 1.4)), ground),
  'mkrig.skadeprogram': all(monitor(56, 52, 1.15, all(ellipse(0, 0, 9, 7, '#6a9a4a', C.ink, 1.2), circle(-3, -1, 1.4, C.ink, null), circle(3, -1, 1.4, C.ink, null), ...[-9, -4, 4, 9].map((x) => line(`M${x} -6 L${x * 1.3} -11`, '#6a9a4a', 1.2)), ...[-9, 9].map((x) => line(`M${x} 4 L${x * 1.3} 9`, '#6a9a4a', 1.2))), '#e88'), ground),
  'mkrig.dataintrång': all(monitor(50, 52, 1.1, all(rect(-6, -2, 12, 9, C.gold, 1, C.ink, 1.1), path('M-4 -2 C-4 -9 4 -9 4 -2', 'none', STEEL, 1.6), line('M-10 8 L10 8', FOE, 2)), '#cfe'), key(84, 44, 1.2), dash('M70 52 L80 46', C.grey, 1.4), ground),
  'mkrig.lösenord': all(rect(24, 48, 72, 30, '#eef1f4', 3, C.ink, 1.6), ...[38, 50, 62, 74, 86].map((x) => circle(x, 63, 4, SCREEN, C.ink, 1.2)), lock(60, 34, 1, C.gold), ring(60, 63, 24), ground),
  'mkrig.sårbarhet': all(shieldSh(56, 52, 2, UNBLUE), path('M50 38 L62 52 L55 56 L66 72', 'none', C.ink, 2.4), path('M50 38 L62 52 L55 56 L66 72', 'none', FOE, 1.4), greyed(shieldSh(100, 72, 1, C.grey)), ground),
  'mkrig.brandvägg': all(...Array.from({ length: 3 }, (_, r) => all(...Array.from({ length: 5 }, (_, c) => rect(28 + c * 13 + (r % 2 ? 6 : 0), 46 + r * 11, 12, 10, FOE, 1, C.ink, 1.1)))), at(94, 30, 0.9, path('M0 -6 L2 -1 L7 0 L3 2 L4 7 L0 4 L-4 7 L-3 2 L-7 0 L-2 -1 Z', FLAME, C.ink, 0.8)), line('M86 36 L74 48', C.ink, 1.4), ring(60, 62, 30), ground),
  'mkrig.säkerhetskopia': all(rect(34, 44, 24, 30, '#eef1f4', 2, C.ink, 1.4), rect(62, 44, 24, 30, '#eef1f4', 2, C.ink, 1.4), ...[52, 84].map((x) => all(line(`M${x - 14} 54 L${x - 2} 54 M${x - 14} 62 L${x - 2} 62`, C.grey, 1.2))), arrow(56, 59, 64, 59, HL, 2.4), ring(74, 58, 18), ground),
  'mkrig.informationskrig': all(bust(30, 70, UNBLUE, 1, { hat: UNBLUE }), bust(92, 70, FOE, 1, { hat: FOE }), bubble(38, 40, 22, 14, path('M31 40 L45 40', 'none', C.ink, 1.4), 1), bubble(84, 40, 22, 14, path('M77 40 L91 40', 'none', C.ink, 1.4), -1), at(60, 52, 1, line('M-7 -7 L7 7 M7 -7 L-7 7', FOE, 2.4)), ground),
  'mkrig.trollfabrik': all(factory(40, 90, 1, false), ...[[70, 42], [88, 54], [96, 36], [78, 62]].map(([x, y]) => bubble(x!, y!, 16, 11, line(`M${x! - 5} ${y!} L${x! + 5} ${y!}`, FOE, 1.4), 1)), dash('M52 74 L70 50', C.grey, 1.3), ground),
  'mkrig.nätverk.2': all(...([[60, 36], [28, 66], [92, 66], [40, 96], [80, 96]] as const).map(([x, y]) => rect(x - 9, y - 7, 18, 14, SCREEN, 2, C.ink, 1.3)), ...([[60, 36, 28, 66], [60, 36, 92, 66], [28, 66, 40, 96], [92, 66, 80, 96], [28, 66, 92, 66]] as const).map(([a, b, c, d]) => line(`M${a} ${b} L${c} ${d}`, NET, 1.8)), ...([[60, 36], [28, 66], [92, 66], [40, 96], [80, 96]] as const).map(([x, y]) => circle(x, y, 2, GLOW, null))),

  // T06-5 Luftförsvar och robotar ------------------------------------
  'mkrig.luftförsvar': all(rect(8, 96, 104, 16, GRASS, 0, null), at(40, 86, 1, rect(-10, -4, 10, 10, IRON, 2, C.ink, 1.3), g('translate(-5 -2) rotate(-62)', rect(-3, -22, 6, 22, OLIVE2, 2, C.ink, 1.3))), missileAt(78, 48, 22, 0.9, { up: true, fin: true }), arcs(26, 60, 1, HL), greyed(missileAt(102, 26, 14, 0.7, { grey: true, flame: false })), noSign(96, 24, 10), ground),
  'mkrig.robot': all(missileAt(96, 58, 56, 1.3, { fin: true }), ring(70, 58, 18), greyed(at(100, 92, 1, rect(-7, -8, 14, 14, C.grey2, 2, C.ink, 1.1), circle(0, 0, 2, C.grey, null))), ground),
  'mkrig.luftvärnsrobot': all(rect(8, 98, 104, 14, GRASS, 0, null), at(40, 98, 1, rect(-12, -6, 24, 8, IRON, 2, C.ink, 1.3), ...[-8, 0, 8].map((x) => circle(x, 2, 3, OLIVE2, C.ink, 0.8))), missileAt(80, 44, 24, 1, { up: true, fin: true }), ring(66, 58, 18), ground),
  'mkrig.kryssningsrobot': all(rect(8, 98, 104, 14, SKY, 0, null), at(66, 56, 1.3, path('M-26 0 L8 -4 L14 0 L8 4 Z', BODY, C.ink, 1.3), path('M8 -4 L14 0 L8 4 Z', FOE, C.ink, 0.8), path('M-10 -4 L-2 -12 L2 -4 Z', OLIVE2, C.ink, 1), path('M-26 0 L-32 -3 L-24 0 Z', OLIVE2, C.ink, 1), flame(-26, 0, 0.8)), dash('M20 70 C40 58 60 60 92 56', C.grey, 1.4), ground),
  'mkrig.ballistisk': all(dash('M14 108 C30 20 90 20 106 108', FOE, 2, '5 4'), missileAt(24, 86, 16, 0.7, { up: true, fin: true }), at(100, 92, 0.9, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', FLAME, C.ink, 0.8)), circle(60, 24, 2, C.ink, null), ground),
  'mkrig.missil': all(missileAt(92, 56, 50, 1.25, { fin: true }), ring(68, 56, 18), arcs(16, 72, 0.8, C.grey), ground),
  'mkrig.stridsspets': all(at(60, 56, 1.8, path('M-30 -5 L18 -5 L18 5 L-30 5 Z', BODY, C.ink, 1.4), path('M18 -5 L30 0 L18 5 Z', FOE, C.ink, 1.3), line('M-12 -5 L-12 5 M-2 -5 L-2 5', C.grey, 1)), ring(80, 56, 14), ground),
  'mkrig.målsökande': all(missileAt(50, 40, 24, 1, { fin: true, flame: false }), circle(52, 40, 3, FOE, C.ink, 0.8), dash('M50 40 C66 46 80 70 92 86', FOE, 1.6, '4 3'), at(92, 88, 0.8, line('M-6 0 L6 0 M0 -6 L0 6', FOE, 1.6), circle(0, 0, 6, 'none', FOE, 1.4)), ground),
  'mkrig.luftrum': all(rect(10, 20, 100, 72, SKY, 3, C.ink, 1.4, ), ...[28, 60, 92].map((x) => flake(x, 40, 1, C.white)), at(60, 60, 1, path('M-14 0 L8 -3 L8 3 Z', C.white, C.ink, 1.2), path('M-2 -2 L-8 -8 M-2 2 L-8 8', C.white, C.ink, 1)), line('M10 92 L110 92', C.ink, 2), ring(60, 56, 40)),
  'mkrig.uppskjutning': all(rect(8, 98, 104, 14, GRASS, 0, null), at(50, 98, 1, rect(-10, -4, 20, 6, IRON, 2, C.ink, 1.3)), missileAt(66, 36, 26, 1.1, { up: true, fin: true }), at(44, 92, 1.3, path('M0 -4 C-9 -2 -13 -6 -18 -4 C-13 -8 -9 -8 0 -8 Z', FLAME, C.ink, 0.8)), ...[[40, 100], [52, 104]].map(([x, y]) => circle(x!, y!, 5, SMOKE, C.grey, 1)), ring(60, 56, 22)),
  'mkrig.förvarning': all(dish(28, 72, 1.1), arcs(46, 58, 1, C.grey), greyed(missileAt(108, 30, 16, 0.7, { grey: true, flame: false })), at(80, 44, 1.4, path('M0 -12 L11 8 L-11 8 Z', C.yellow, C.ink, 1.6), line('M0 -3 L0 2', C.ink, 2), circle(0, 5, 1.2, C.ink, null)), ground),
  'mkrig.raket': all(at(60, 70, 1.5, path('M0 -34 C6 -26 6 -10 0 2 C-6 -10 -6 -26 0 -34 Z', STEEL, C.ink, 1.4), path('M0 -8 L-6 4 L-2 2 Z', OLIVE2, C.ink, 1), path('M0 -8 L6 4 L2 2 Z', OLIVE2, C.ink, 1), circle(0, -22, 3, SKY, C.ink, 1), flame(0, 4, 0.9)), ring(60, 56, 26), ground),

  // T06-6 Fredsbevarande insatser ------------------------------------
  'mkrig.eldupphör': all(rifle(26, 92, 48, 74, false), rifle(94, 92, 72, 74, false), at(60, 50, 1.1, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', 'none', C.ink, 0)), noSign(60, 58, 14), ground),
  'mkrig.buffertzon': all(bust(22, 88, OLIVE, 0.8, { hat: OLIVE2 }), bust(98, 88, FOE, 0.8), rect(50, 40, 20, 68, '#eef1f4', 0, HL, 1.6), bust(60, 88, UNBLUE, 0.8, { hat: UNBLUE }), ...[46, 72].map((x) => line(`M${x} 40 L${x} 108`, C.grey2, 1.4, '4 3')), ground),
  'mkrig.observatör': all(fig(60, '#eef1f4', 'calm', { h: 1, bottom: '#dfe4ea' }), on(60, 1, all(path('M-10 -58 C-10 -70 10 -70 10 -58 Z', UNBLUE, C.ink, 1.3))), at(60, 54, 1, rect(-11, -3, 22, 7, IRON, 2, C.ink, 1.2), rect(-7, -3, 6, 7, SKY, 1, C.ink, 0.8), rect(1, -3, 6, 7, SKY, 1, C.ink, 0.8)), ground),
  'mkrig.övervaka': all(at(40, 44, 1.2, circle(0, 0, 10, SCREEN, C.ink, 1.6), circle(0, 0, 5, GLOW, C.ink, 1), circle(0, 0, 2, C.ink, null)), rect(34, 54, 12, 8, IRON, 1, C.ink, 1.2), map(66, 70, 40, 36), bust(78, 86, FOE, 0.5), dash('M48 48 L72 70', C.grey, 1.4), ground),
  'mkrig.fredsstyrka': all(bustRow(22, 80, 4, 20, UNBLUE, 0.84, { hat: UNBLUE }), flag(100, 70, UNBLUE, 0.9), ring(22, 76, 14), ground),
  'mkrig.nedrustning': all(missileAt(50, 54, 30, 1.1, { grey: true, flame: false }), line('M20 40 L80 70', FOE, 3), arrow(60, 88, 60, 102, HL, 3), greyed(missileAt(100, 86, 14, 0.7, { grey: true, flame: false })), ground),
  'mkrig.avväpna': all(bust(44, 86, FOE, 1, { hat: '#8a4a44' }), rifle(58, 86, 82, 94, false), arrow(70, 70, 86, 82, HL, 2.6), noSign(74, 72, 10), bust(104, 86, OLIVE, 0.7, { hat: OLIVE2 }), ground),
  'mkrig.konfliktområde': all(map(8, 56, 104, 52, '#e2d4b2'), ...[[26, 76], [44, 70], [86, 90]].map(([x, y]) => at(x!, y!, 0.8, path('M0 -8 L3 -2 L9 -2 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-9 -2 L-3 -2 Z', FLAME, C.ink, 0.7))), house(66, 84, 0.7, SAND, true), dashBox(14, 60, 92, 44, FOE), ground),
  'mkrig.minröjning': all(mine(36, 86, 1.3), at(80, 60, 1.1, circle(0, 0, 9, 'none', IRON, 2.4), line('M7 7 L16 16', IRON, 3)), dash('M70 68 L52 80', C.grey, 1.4), arrow(44, 72, 36, 80, HL, 2), ground),
  'mkrig.kontrollpost': all(rect(8, 98, 104, 14, '#c9c1b2', 0, null), rect(20, 40, 6, 58, '#b7b2a6', 1, C.ink, 1.3), path('M26 46 L96 46 L96 54 L26 54 Z', FOE, C.ink, 1.3), ...[34, 50, 66, 82].map((x) => line(`M${x} 46 L${x} 54`, C.white, 1.4)), bust(100, 86, UNBLUE, 0.8, { hat: UNBLUE }), ground),

  // T06-7 Krigets lagar och civilt skydd -----------------------------
  'mkrig.krigets-lagar': all(...([[88, 40, 7], [100, 46, 6], [94, 50, 5]] as const).map(([x, y, r]) => circle(x, y, r, SMOKE, C.grey, 1)), house(84, 112, 0.6, SAND, true), soldier(26, 0.82, OLIVE, helmet(), 'calm'), rifle(34, 86, 50, 106), fig(66, C.white, 'calm', { h: 0.82, bottom: '#dfe4ea' }), on(66, 0.82, rect(-14, -36, 6, 7, C.white, 1, C.ink, 0.8), path('M-12.5 -35 L-9.5 -35 L-9.5 -33.5 L-8 -33.5 L-8 -31.5 L-9.5 -31.5 L-9.5 -30 L-12.5 -30 L-12.5 -31.5 L-14 -31.5 L-14 -33.5 L-12.5 -33.5 Z', FOE, null), path('M-10 -66 C-10 -76 10 -76 10 -66 Z', C.white, C.ink, 1.2), path('M-2 -74 L2 -74 L2 -71 L5 -71 L5 -68 L2 -68 L2 -66 L-2 -66 L-2 -68 L-5 -68 L-5 -71 L-2 -71 Z', FOE, null)), arrow(82, 80, 100, 80, C.grey, 2), path('M40 40 L46 46 L56 32', 'none', '#4f9d69', 3), at(14, 22, 0.7, rect(-11, -9, 22, 18, '#eef1f4', 1, C.ink, 1.2), line('M0 -9 L0 9', C.grey, 1)), ground),
  'mkrig.civil': all(at(36, 52, 1.1, path('M-26 0 C-26 -6 -18 -7 -10 -7 L18 -7 C26 -7 28 0 28 0 C28 3 24 4 18 4 L-20 4 C-24 4 -26 2 -26 0 Z', C.white, C.ink, 1.4), path('M-4 -2 L8 -2 L-2 14 L-8 14 Z', '#9ec2e8', C.ink, 1.1), path('M-22 -6 L-26 -16 L-20 -16 L-14 -7 Z', UNBLUE, C.ink, 1.1), ...[-12, -6, 0, 6, 12, 18].map((x) => circle(x, -2, 1.4, UNBLUE, null)), line('M-24 1 L26 1', UNBLUE, 1.2)), ring(38, 52, 34), greyed(at(84, 92, 1.05, path('M-24 0 L16 -4 L28 0 L16 4 Z', C.grey, C.ink, 1.4), path('M-2 -3 L10 -3 L-8 14 L-14 14 Z', C.grey, C.ink, 1.1), path('M-20 -2 L-26 -12 L-18 -2 Z', C.grey, C.ink, 1.1), path('M-6 -3 L-8 -12 L-2 -3 Z', C.grey2, null))), ground),
  'mkrig.krigsförbrytare': all(bust(40, 70, FOE, 1.2, { vest: true }), at(40, 70, 1.2, line('M-8 6 L8 6 M-4 6 L-4 16 M4 6 L4 16', C.grey, 1.6)), at(86, 54, 1.1, path('M0 -10 L10 -6 L10 4 C10 11 0 15 0 15 C0 15 -10 11 -10 4 L-10 -6 Z', UNBLUE, C.ink, 1.3)), noSign(40, 44, 11), ground),
  'mkrig.tortyr': all(bust(56, 70, C.grey2, 1.2, { grey: true }), at(56, 70, 1.2, ...[-9, 0, 9].map((x) => line(`M${x} -14 L${x} 18`, IRON, 2.4))), noSign(56, 44, 13), ground),
  'mkrig.skyddsmärke': all(redCross(60, 56, 2.2), greyed(at(100, 84, 1, rect(-7, -5, 14, 10, C.grey2, 2, C.ink, 1.2))), ground),
  'mkrig.civilförsvar': all(path('M60 30 L92 48 L92 96 L28 96 L28 48 Z', '#d9c79a', C.ink, 1.6), path('M24 50 L60 28 L96 50', 'none', C.ink, 1.6), redCross(60, 72, 1.3), bustRow(40, 92, 3, 14, '#7a6a8a', 0.5), ground),
  'mkrig.totalförsvar': all(at(60, 60, 1, path('M0 -28 L26 -16 C26 8 16 22 0 30 C-16 22 -26 8 -26 -16 Z', '#e7edf3', C.ink, 1.8)), soldier(46, 0.46), bust(72, 58, '#7a6a8a', 0.6, { hat: '#6b5a4a' }), line('M60 32 L60 88', C.grey2, 1.4), ground),
  'mkrig.värnplikt': all(fig(60, OLIVE, 'calm', { h: 0.95 }), on(60, 0.95, helmet()), at(60, 54, 1, rect(-11, -3, 22, 6, '#eef1f4', 2, C.ink, 1.2), line('M-7 0 L7 0', C.grey, 1)), ground),
  'mkrig.nödförråd': all(rect(28, 50, 64, 44, '#c9a46a', 2, C.ink, 1.4), line('M28 64 L92 64', '#8a6a3a', 1.4), at(44, 58, 1, rect(-5, -4, 10, 8, FOE, 1, C.ink, 1)), at(60, 58, 1, path('M-4 -5 L4 -5 L3 5 L-3 5 Z', SKY, C.ink, 1)), at(76, 58, 1, circle(0, 0, 4, '#6a9a4a', C.ink, 1)), at(44, 80, 1, rect(-4, -4, 8, 8, '#eef1f4', 1, C.ink, 1)), at(62, 80, 0.9, rect(-2, -5, 4, 10, C.gold, 1, C.ink, 1)), ring(60, 72, 30), ground),
};
