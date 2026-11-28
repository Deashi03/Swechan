/**
 * Kultur & fritid → Spel & hobbyer → Samlande & fördjupning, 4741–4747 (0.65): stamps and coins, trading cards,
 * antiques, collector's value and condition, cataloguing, swapping and buying, collectors' fairs.
 * Stamps, cards, coins and toys are generic: no brands, no recognisable characters, no letters that give away the
 * word (digits on price tags, year plaques and postmarks, "?", "=", "×" and the letters A–Ö on book spines are fine).
 * Movement: `moving()`/`waIn()`/`waPulse()` move things with transform/opacity only; the base state is the poster
 * frame. The named part is orange (HL); grey is the reference.
 * Easily confused pairs get different kinds of picture: a postmark on a letter (poststämpel) against a used stamp
 * beside a clean grey one (stämplad); a cheering collector with a full page (komplett); three numbered editions of one book (utgåva) against a single numbered figure 7/500
 * (begränsad upplaga); a price that jumps from an old tag to a new one (samlarvärde) against a hugged teddy with a
 * heart (affektionsvärde) and a growing staircase of tags (stiga i värde); the gap between two coin stacks
 * (mellanskillnad) against a buyer's bubble (prisförslag) and the first step of a bid staircase (utropspris).
 */
import { C, all, arrow, circle, ellipse, g, hand, heart, line, moving, path, rect, sparkle, star, waBob, waIn, waPulse, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

type Pt = [number, number];
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const turn = (x: number, y: number, deg: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg})`, ...k);
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const glass = (x: number, y: number, w: number, h: number, rx = 2, op = 0.45) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#bfe3f5" fill-opacity="${op}" stroke="${C.ink}" stroke-width="1.6"/>`;
const ground = line('M4 112 L116 112', C.grey2, 2);
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, C.green, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
/** Hidden at first, appears at `delay` % of the loop and stays (poster frame: visible). */
const appear = (name: string, delay: number, ...k: Svg[]) => moving(name, `0%,${delay}%{opacity:0}${delay + 10}%,100%{opacity:1}`, { dur: 3.2 }, ...k);
/** Slides in from (dx, dy) and rests (poster frame: at rest). */
const slide = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) => moving(name, `0%,12%{transform:translate(${dx}px,${dy}px)}60%,100%{transform:translate(0,0)}`, { dur }, ...k);

// ── People ── (feet at y = 0, height ≈ 66; hands are placed with aL/aR)
type Who = { top?: string; leg?: string; hair?: string; long?: boolean; aL?: Pt; aR?: Pt; mouth?: 'smile' | 'o' | 'flat' };
const pers = (x: number, y: number, s: number, o: Who = {}): Svg => {
  const top = o.top ?? C.sky, leg = o.leg ?? C.navy, hair = o.hair ?? C.hair;
  const aL = o.aL ?? [-12, -26], aR = o.aR ?? [12, -26];
  const arm = (sx: number, p: Pt) => all(line(`M${sx} -43 L${p[0]} ${p[1]}`, C.ink, 6.4), line(`M${sx} -43 L${p[0]} ${p[1]}`, top, 4.2), circle(p[0], p[1], 2.8, C.skin, C.ink, 1));
  return at(x, y, s,
    o.long ? path('M-9 -58 C-11 -44 -6 -42 0 -43 C6 -42 11 -44 9 -58 Z', hair, C.ink, 1.2) : '',
    line('M-4 -22 L-5 -2 M4 -22 L5 -2', C.ink, 7.4), line('M-4 -22 L-5 -2 M4 -22 L5 -2', leg, 5.2),
    ellipse(-6, -1, 4, 2.2, C.dark, null), ellipse(6, -1, 4, 2.2, C.dark, null),
    rect(-8, -47, 16, 27, top, 5, C.ink, 1.6), arm(-7, aL), arm(7, aR),
    circle(0, -56, 8.5, C.skin, C.ink, 1.6), path('M-8.5 -57 C-8.5 -68 8.5 -68 8.5 -57 C5 -62 -5 -62 -8.5 -57 Z', hair, C.ink, 1.2),
    circle(-3, -55.5, 1, C.ink, null), circle(3, -55.5, 1, C.ink, null),
    o.mouth === 'o' ? circle(0, -51.5, 1.4, '#c84a4a', C.ink, 0.8) : o.mouth === 'flat' ? line('M-2.4 -51.5 L2.4 -51.5', C.ink, 1) : path('M-2.8 -52.5 Q0 -49.8 2.8 -52.5', 'none', C.ink, 1));
};
/** Head and shoulders, centre of the head at (x, y). */
const bust = (x: number, y: number, s: number, col: string, hair: string = C.hair, long = false): Svg => at(x, y, s,
  long ? path('M-8 -1 C-10 12 10 12 8 -1 Z', hair, C.ink, 1.1) : '',
  path('M-11 17 C-11 7 11 7 11 17 Z', col, C.ink, 1.4), circle(0, 0, 7.5, C.skin, C.ink, 1.4),
  path('M-7.5 -1 C-7.5 -11 7.5 -11 7.5 -1 C4 -5 -4 -5 -7.5 -1 Z', hair, C.ink, 1.1),
  circle(-2.6, 1, 0.9, C.ink, null), circle(2.6, 1, 0.9, C.ink, null), path('M-2.4 3.6 Q0 5.6 2.4 3.6', 'none', C.ink, 0.9));
const GREYHAIR = '#b9bcc4';

// ── Stamps, coins, cards, tags ──
const bird = (x: number, y: number, s: number, col: string): Svg => at(x, y, s, path('M-4.5 0 L-9 -2.5 L-8 2.2 Z', col, C.ink, 0.8), ellipse(0, 1, 5, 3.4, col, C.ink, 0.9), circle(4, -2.4, 2.5, col, C.ink, 0.9), path('M6.2 -3 L9.4 -2.2 L6.2 -1.2 Z', C.orange, C.ink, 0.5), circle(4.6, -2.8, 0.5, C.ink, null));
/** Postage stamp with perforated edge, centre (x, y). `bg` is the colour behind the stamp. */
const stamp = (x: number, y: number, w: number, h: number, deg: number, col: string, pic: Svg = '', bg: string = C.paper): Svg =>
  turn(x, y, deg, rect(-w / 2, -h / 2, w, h, C.white, 0.5, C.ink, 1.2), line(`M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2} ${h / 2} L${-w / 2} ${h / 2} Z`, bg, 2.2, '0.1 3.4'),
    rect(-w / 2 + 2.6, -h / 2 + 2.6, w - 5.2, h - 5.2, col, 1, C.ink, 0.8), pic);
const postmark = (x: number, y: number, r: number, date: string, col: string = C.dark): Svg => all(
  circle(x, y, r, 'none', col, 1.6), circle(x, y, r * 0.62, 'none', col, 1), num(x, y + r * 0.16, date, r * 0.46, col),
  line(`M${x + r + 1} ${y - 5} q3 -3 6 0 t6 0 t6 0 M${x + r + 1} ${y} q3 -3 6 0 t6 0 t6 0 M${x + r + 1} ${y + 5} q3 -3 6 0 t6 0 t6 0`, col, 1.4));
const crown = (x: number, y: number, s: number, col: string = C.gold): Svg => at(x, y, s, path('M-6 3 L-6 -3 L-3 0 L0 -5 L3 0 L6 -3 L6 3 Z', col, C.ink, 0.9));
const coin = (x: number, y: number, r: number, col: string = C.gold, inner: Svg = ''): Svg => all(circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.78, 'none', 'rgba(60,50,30,.45)', 0.9), inner);
/** Trading card, centre (x, y): picture field with a star and two text lines. */
const card = (x: number, y: number, w: number, h: number, deg: number, col: string, edge: string = C.ink): Svg =>
  turn(x, y, deg, rect(-w / 2, -h / 2, w, h, C.white, w * 0.12, edge, edge === C.ink ? 1.4 : 2.6), rect(-w / 2 + w * 0.12, -h / 2 + w * 0.12, w * 0.76, h * 0.52, col, 1.5, C.ink, 0.8),
    star(0, -h * 0.13, Math.min(w, h) * 0.18, C.yellow), line(`M${-w * 0.3} ${h * 0.24} L${w * 0.3} ${h * 0.24} M${-w * 0.3} ${h * 0.36} L${w * 0.12} ${h * 0.36}`, C.grey, 1));
/** Price tag with a string hole; the text is centred. */
const tag = (x: number, y: number, s: number, txt: string, col: string = C.white, ink: string = C.ink): Svg => {
  const w = 9 + txt.length * 5.4;
  return at(x, y, s, path(`M${-w / 2 - 6} 0 L${-w / 2} -7 L${w / 2} -7 L${w / 2} 7 L${-w / 2} 7 Z`, col, C.ink, 1.4), circle(-w / 2 - 1, 0, 1.5, C.paper, C.ink, 0.8), num(1.5, 3.6, txt, 9.5, ink));
};
const magnifier = (x: number, y: number, r: number, deg: number): Svg => turn(x, y, deg, line(`M0 ${r} L0 ${r + 16}`, C.ink, 6), line(`M0 ${r + 2} L0 ${r + 15}`, C.brown, 3.4),
  `<circle cx="0" cy="0" r="${r}" fill="#dff1fb" fill-opacity="0.4" stroke="${C.ink}" stroke-width="2.6"/>`, line(`M${-r * 0.55} ${-r * 0.2} Q${-r * 0.4} ${-r * 0.6} 0 ${-r * 0.62}`, C.white, 1.6));
const book = (x: number, y: number, w: number, h: number, col: string, mark: Svg = ''): Svg => all(rect(x, y - h, w, h, col, 1.5, C.ink, 1.4), line(`M${x + 2} ${y - h + 5} L${x + w - 2} ${y - h + 5} M${x + 2} ${y - 5} L${x + w - 2} ${y - 5}`, 'rgba(255,255,255,.6)', 1), mark);

// ── Toys and furniture ──
/** Toy robot, feet at (0, 0), height ≈ 34. */
const robot = (x: number, y: number, s: number, col: string = C.red): Svg => at(x, y, s,
  line('M0 -30 L0 -35', C.ink, 1.6), circle(0, -36, 2, C.yellow, C.ink, 1), rect(-7, -30, 14, 11, C.silver, 2, C.ink, 1.4), circle(-3, -25, 1.6, C.ink, null), circle(3, -25, 1.6, C.ink, null), line('M-3 -21.5 L3 -21.5', C.ink, 1),
  rect(-9, -19, 18, 13, col, 2, C.ink, 1.4), circle(0, -12.5, 3, C.yellow, C.ink, 1), line('M-9 -16 L-13 -9 M9 -16 L13 -9', C.ink, 4.4), line('M-9 -16 L-13 -9 M9 -16 L13 -9', C.silver, 2.4),
  rect(-7.5, -6, 6, 6, C.silver, 1, C.ink, 1.2), rect(1.5, -6, 6, 6, C.silver, 1, C.ink, 1.2));
/** Toy car, wheels on y = 0, length ≈ 36. */
const toyCar = (x: number, y: number, s: number, col: string, worn = false): Svg => at(x, y, s,
  path('M-18 -4 L-18 -11 L-10 -12 L-6 -20 L8 -20 L13 -12 L18 -10 L18 -4 Z', col, C.ink, 1.5), path('M-5 -18 L0 -18 L0 -12 L-8 -12 Z M2 -18 L7 -18 L10 -12 L2 -12 Z', '#cfe6f3', C.ink, 0.9),
  circle(-10, -3, 4.6, C.dark, C.ink, 1.2), circle(-10, -3, 1.6, C.silver, null), worn ? '' : all(circle(10, -3, 4.6, C.dark, C.ink, 1.2), circle(10, -3, 1.6, C.silver, null)),
  worn ? all(line('M-14 -8 L-9 -10 L-11 -6 M4 -10 L9 -7 L6 -5 M12 -9 L15 -6', C.ink, 1), path('M-2 -16 L1 -14 L-1 -13', 'none', C.ink, 0.9), ellipse(11, -1, 5, 1.6, C.brown, null)) : '');
const teddy = (x: number, y: number, s: number): Svg => at(x, y, s, circle(-6, -21, 3.4, C.brown, C.ink, 1.2), circle(6, -21, 3.4, C.brown, C.ink, 1.2), ellipse(0, -5, 9, 10, C.brown, C.ink, 1.4), circle(0, -17, 7.6, C.brown, C.ink, 1.4),
  ellipse(0, -15, 3.4, 2.6, C.tan, C.ink, 0.8), circle(-2.8, -19, 0.9, C.ink, null), circle(2.8, -19, 0.9, C.ink, null), rect(-5, -6, 6, 6, C.tan, 1, C.ink, 0.8, ), line('M-5 -3 L1 -3 M-2 -6 L-2 0', C.ink, 0.6));
/** Chest of drawers, standing on y = 0, width 40. */
const byra = (x: number, y: number, s: number, col: string = C.brown): Svg => at(x, y, s, line('M-17 0 L-17 -4 M17 0 L17 -4', C.ink, 3.4), rect(-20, -34, 40, 31, col, 2, C.ink, 1.6), line('M-20 -24 L20 -24 M-20 -14 L20 -14', C.ink, 1.2),
  ...[-29, -19, -9].flatMap((yy) => [circle(-8, yy, 1.5, C.gold, C.ink, 0.7), circle(8, yy, 1.5, C.gold, C.ink, 0.7)]));
const vase = (x: number, y: number, s: number, col = '#3f6fb5'): Svg => at(x, y, s, path('M-6 -40 C-8 -36 -4 -33 -4 -29 C-17 -23 -17 -6 -7 0 L7 0 C17 -6 17 -23 4 -29 C4 -33 8 -36 6 -40 Z', col, C.ink, 1.6),
  line('M-12 -16 C-6 -20 6 -20 12 -16 M-11 -9 C-5 -5 5 -5 11 -9', C.white, 1.4), circle(0, -13, 2.2, C.white, null), line('M-6 -40 L6 -40', C.gold, 2.4));
const candlestick = (x: number, y: number, s: number, col: string = C.gold): Svg => at(x, y, s, path('M-7 0 L7 0 L4 -4 L2 -5 C1 -10 3 -14 1.5 -20 L4 -22 L-4 -22 L-1.5 -20 C-3 -14 -1 -10 -2 -5 L-4 -4 Z', col, C.ink, 1.3), rect(-1.8, -34, 3.6, 12, C.white, 0.6, C.ink, 1), path('M0 -40 C3 -37 2 -34.5 0 -34 C-2 -34.5 -3 -37 0 -40 Z', C.orange, C.ink, 0.7));
const gavel = (x: number, y: number, deg: number, s = 1): Svg => turn(x, y, deg, g(`scale(${s})`, line('M0 0 L22 0', C.ink, 4.6), line('M0 0 L21 0', C.tan, 2.6), rect(-6, -9, 12, 18, C.brown, 2.5, C.ink, 1.5), line('M-6 -5 L6 -5 M-6 5 L6 5', C.gold, 1.2)));
const cardboard = (x: number, y: number, w: number, h: number): Svg => all(rect(x, y, w, h, C.tan, 1.5, C.ink, 1.5), line(`M${x} ${y + h * 0.3} L${x + w} ${y + h * 0.3} M${x + w / 2} ${y} L${x + w / 2} ${y + h * 0.3}`, C.brown, 1.1));
/** Shop front: wall, striped awning, window, door. */
const shop = (wall: string, aw: string, win: Svg, sign: Svg): Svg => all(ground, rect(10, 28, 100, 84, wall, 2, C.ink, 2),
  path('M6 28 L114 28 L110 46 L10 46 Z', aw, C.ink, 1.8), ...[0, 1, 2, 3, 4].map((i) => path(`M${17 + i * 21.6} 28 L${27.8 + i * 21.6} 28 L${27 + i * 20.4} 46 L${16.8 + i * 20.4} 46 Z`, C.white, null)), line('M6 28 L114 28 L110 46 L10 46 Z', C.ink, 1.8),
  rect(16, 54, 58, 42, '#cfe6f3', 2, C.ink, 1.8), win, rect(82, 56, 22, 56, C.brown, 2, C.ink, 1.8), rect(86, 61, 14, 20, '#cfe6f3', 1, C.ink, 1), circle(87, 88, 1.6, C.gold, C.ink, 0.7), sign);

// ── Small shared drawings ──
const album9 = (x: number, y: number, w: number, h: number, missing: number[] = []): Svg => {
  const cw = (w - 8) / 3, chh = (h - 8) / 3, cols = [C.red, C.green, C.denim, C.yellow, C.purple, C.orange, C.sky, C.pink, C.mint];
  return all(rect(x, y, w, h, C.white, 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => {
    const cx = x + 4 + (i % 3) * cw + 1, cy = y + 4 + Math.floor(i / 3) * chh + 1;
    return missing.includes(i) ? rect(cx, cy, cw - 2, chh - 2, C.paper, 1, C.grey, 0.9) : all(rect(cx, cy, cw - 2, chh - 2, C.white, 1, C.ink, 0.9), rect(cx + 1.4, cy + 1.4, cw - 4.8, (chh - 2) * 0.55, cols[i]!, 0.6, null));
  }));
};
const painting = (x: number, y: number, w: number, h: number, frame: string = C.gold): Svg => all(rect(x, y, w, h, frame, 1.5, C.ink, 1.6), rect(x + 4, y + 4, w - 8, h - 8, '#cfe6f3', 0.5, C.ink, 0.9),
  circle(x + w * 0.7, y + h * 0.32, Math.min(w, h) * 0.1, C.yellow, null), path(`M${x + 4} ${y + h - 4} L${x + 4} ${y + h * 0.66} Q${x + w * 0.35} ${y + h * 0.4} ${x + w * 0.6} ${y + h * 0.66} T${x + w - 4} ${y + h * 0.6} L${x + w - 4} ${y + h - 4} Z`, C.green, null));
const bubble = (x: number, y: number, r: number, tail: Pt, ...k: Svg[]): Svg => all(circle((x * 2 + tail[0]) / 3, (y * 2 + tail[1]) / 3 + r * 0.25, 2.6, C.white, C.ink, 1.1), circle((x + tail[0] * 2) / 3, (y + tail[1] * 2) / 3 + r * 0.2, 1.7, C.white, C.ink, 1), circle(x, y, r, C.white, C.ink, 1.6), ...k);
const sleeveArm = (x1: number, y1: number, x2: number, y2: number, col: string): Svg => {
  const rot = Math.round((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI);
  return all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 9.4), line(`M${x1} ${y1} L${x2} ${y2}`, col, 7), hand(x2, y2, 0.72, rot));
};

export const COLLECT_MOTIFS: Record<string, Svg> = {
  // ── 4741 Frimärken och mynt ──
  'collect.frimärksalbum': all(rect(6, 30, 108, 72, '#7a4b34', 5, C.ink, 2), rect(11, 26, 48, 70, C.white, 2, C.ink, 1.6), rect(61, 26, 48, 70, C.white, 2, C.ink, 1.6), line('M60 26 L60 98', C.ink, 2.4),
    ...[0, 1, 2].flatMap((r) => [rect(15, 47 + r * 22, 40, 3.4, C.dark, 0.5, null), rect(65, 47 + r * 22, 40, 3.4, C.dark, 0.5, null),
      ...[0, 1, 2].map((c) => stamp(23 + c * 12.5, 40 + r * 22, 10, 13, 0, [C.red, C.green, C.denim, C.yellow, C.purple, C.orange, C.sky, C.pink, C.mint][(r * 3 + c) % 9]!, '', C.white)),
      ...[0, 1, 2].filter((c) => !(r === 2 && c === 2)).map((c) => stamp(73 + c * 12.5, 40 + r * 22, 10, 13, 0, [C.sky, C.orange, C.green, C.pink, C.denim, C.red, C.yellow, C.purple][(r * 3 + c) % 8]!, '', C.white))])),
  'collect.poststämpel': all(rect(8, 30, 104, 66, C.white, 3, C.ink, 2), line('M8 30 L60 64 L112 30', C.grey2, 1.4), stamp(94, 48, 22, 27, 0, C.sky, bird(0, 1, 0.95, C.red), C.white),
    line('M18 76 L52 76 M18 84 L44 84', C.grey2, 2), circle(60, 54, 19, 'none', HL, 5), postmark(60, 54, 14, '12.3')),
  'collect.stämplad': all(greyed(stamp(26, 72, 28, 36, -4, C.sky, bird(0, 1, 1.2, C.red))), stamp(78, 58, 48, 62, 4, C.sky, bird(0, 2, 2.1, C.red)), turn(64, 44, -14, postmark(0, 0, 17, '12.3')), circle(63, 44, 23, 'none', HL, 3)),
  'collect.tandning': all(rect(14, 22, 70, 84, C.white, 0.5, C.ink, 1.6), ...Array.from({ length: 9 }, (_, i) => circle(14, 26 + i * 9.5, 3.2, C.paper, C.ink, 1.1)), ...Array.from({ length: 8 }, (_, i) => circle(18 + i * 9, 106, 3.2, C.paper, C.ink, 1.1)),
    ...Array.from({ length: 8 }, (_, i) => circle(18 + i * 9, 22, 3.2, C.paper, HL, 2.2)), ...Array.from({ length: 9 }, (_, i) => circle(84, 26 + i * 9.5, 3.2, C.paper, HL, 2.2)),
    rect(23, 31, 52, 66, C.mint, 1, C.ink, 1), bird(49, 66, 3.2, C.yellow), magnifier(88, 30, 21, -40)),
  'collect.valör': all(...[0, 1, 2].map((i) => all(stamp(22 + i * 38, 84, 30, 40, 0, C.sky, bird(-1, 5, 1.25, C.red)), circle(30 + i * 38, 72, 7.4, C.white, HL, 2.6), num(30 + i * 38, 75.6, ['5', '10', '20'][i]!, i === 0 ? 10 : 8.4))),
    line('M62 66 L50 50 M74 68 L82 50', HL, 1.8, '4 3'), line('M84 44 L100 58', C.ink, 6), line('M85 45 L99 57', C.brown, 3.4), circle(66, 30, 23, C.white, C.ink, 2.6), circle(66, 30, 17.5, 'none', HL, 2.6), num(66, 38, '10', 22),
    line('M51 22 Q54 12 64 10', C.grey2, 1.8)),
  'collect.minnesmynt': all(path('M16 58 L24 18 L96 18 L104 58 Z', C.navy, C.ink, 2), path('M24 54 L30 24 L90 24 L96 54 Z', '#3c5a94', null), rect(16, 58, 88, 46, C.navy, 5, C.ink, 2), rect(22, 63, 76, 36, '#7a2f45', 3, C.ink, 1.2),
    coin(60, 81, 16, C.silver, all(crown(60, 75, 1.1), line('M49 84 Q52 92 60 93 Q68 92 71 84', C.ink, 1), num(60, 89, '2000', 6.4))), star(60, 39, 9, C.gold), sparkle(84, 68, 5), sparkle(36, 92, 4)),
  'collect.serie.2': all(...[0, 1, 2, 3].map((i) => all(stamp(18 + i * 28, 50, 23, 30, 0, [C.sky, C.mint, C.rose, C.beige][i]!, bird(0, 0, 1, [C.red, C.denim, C.yellow, C.green][i]!)), circle(18 + i * 28, 79, 6, C.white, C.ink, 1.2), num(18 + i * 28, 82.6, String(i + 1), 9))),
    line('M6 28 L6 22 L114 22 L114 28', HL, 3), line('M6 90 L6 96 L114 96 L114 90', HL, 3)),
  'collect.förstadagsbrev': all(rect(6, 28, 108, 66, C.white, 3, C.ink, 2), rect(12, 36, 44, 50, '#e3f1e4', 2, C.ink, 1), line('M16 78 Q30 70 52 74', C.brown, 2.2), bird(34, 62, 2.5, C.red),
    stamp(96, 46, 22, 27, 0, '#e3f1e4', bird(0, 1, 0.95, C.red), C.white), postmark(66, 50, 11, '1.6'), rect(78, 68, 24, 22, C.white, 2, HL, 2.4), rect(78, 68, 24, 7, C.red, 2, null), num(90, 88, '1', 12), line('M74 60 L80 68', HL, 2.4)),

  // ── 4742 Samlarkort ──
  'collect.boosterpaket': all(card(44, 36, 24, 32, -20, C.sky), card(60, 30, 24, 32, 0, C.pink), card(76, 36, 24, 32, 20, C.mint),
    path('M34 52 L39 45 L44 52 L49 45 L54 52 L59 45 L64 52 L69 45 L74 52 L79 45 L84 52 L86 52 L86 106 L34 106 Z', C.purple, C.ink, 2), line('M34 99 L86 99', C.lilac, 2), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(`M${38 + i * 6.4} 101 L${38 + i * 6.4} 105`, C.lilac, 1.2)),
    star(60, 70, 12, C.yellow), num(60, 94, '?', 13, C.white), line('M40 60 L46 54', C.lilac, 2.4), sparkle(96, 26, 6), sparkle(22, 40, 5)),
  'collect.plastficka': all(turn(30, 64, -10, glass(-17, -26, 34, 52, 2, 0.5), line('M-11 -18 L-4 -22', C.white, 1.6)), card(68, 62, 34, 48, 0, C.denim), glass(46, 32, 44, 70, 3), line('M46 32 L90 32', C.paper, 2.4), line('M52 46 L62 38 M52 56 L70 40', C.white, 2), line('M80 96 L86 90', C.white, 2),
    arrow(68, 8, 68, 26, HL, 3)),
  'collect.pärm': all(rect(4, 28, 56, 70, C.denim, 4, C.ink, 2), rect(60, 28, 56, 70, C.denim, 4, C.ink, 2), album9(9, 33, 44, 60, [2]), album9(67, 33, 44, 60),
    rect(56, 28, 8, 70, C.denim2, 1, C.ink, 1.6), ...[42, 63, 84].map((y) => all(path(`M54 ${y + 3} C54 ${y - 7} 66 ${y - 7} 66 ${y + 3}`, 'none', C.ink, 3.4), path(`M54 ${y + 3} C54 ${y - 7} 66 ${y - 7} 66 ${y + 3}`, 'none', C.silver, 1.6)))),
  'collect.komplett': all(ground, pers(26, 111, 0.95, { top: C.orange, long: true, aL: [-15, -62], aR: [15, -62], mouth: 'o' }), rect(50, 22, 64, 84, C.denim, 4, C.ink, 2), album9(55, 27, 54, 74), check(104, 22, 1.5), sparkle(58, 14, 6), sparkle(44, 44, 5)),
  'collect.utgåva': all(ground, ...[0, 1, 2].map((i) => all(i === 0 ? rect(7, 39, 32, 76, 'none', 4, HL, 3) : '', book(11 + i * 36, 110, 24, 66, [C.red, C.green, C.denim][i]!, all(star(23 + i * 36, 70, 7, C.yellow), circle(23 + i * 36, 94, 6.4, C.white, C.ink, 1.2), num(23 + i * 36, 97.6, String(i + 1), 9))),
    num(23 + i * 36, 30, ['1999', '2006', '2014'][i]!, 9.5, i === 0 ? HL : C.grey))), line('M41 26 L47 26 M77 26 L83 26', C.grey, 2), sparkle(40, 44, 5)),
  'collect.begränsad-upplaga': all(ground, rect(34, 96, 52, 16, C.dark, 3, C.ink, 1.8), robot(60, 96, 1.7, C.denim), rect(40, 99, 40, 11, C.white, 2, HL, 2), num(60, 108, '7/500', 9),
    star(98, 30, 13, HL), num(98, 34, '500', 8, C.white), greyed(robot(14, 110, 0.7), robot(106, 110, 0.7))),
  'collect.autograf': all(turn(52, 60, -5, rect(-32, -44, 64, 88, C.white, 3, C.ink, 1.8), rect(-27, -39, 54, 50, C.sky, 2, C.ink, 1), bust(0, -20, 1.9, C.red), path('M-24 30 C-20 14 -16 38 -11 24 C-7 14 -5 36 1 24 C5 16 9 30 16 22 L24 19', 'none', C.navy, 2.4), line('M-22 37 Q0 31 22 35', C.navy, 1.6)),
    turn(90, 64, 35, rect(-3.2, -30, 6.4, 34, C.dark, 2, C.ink, 1.2), path('M-3.2 4 L3.2 4 L0 13 Z', C.silver, C.ink, 1)), circle(60, 90, 31, 'none', HL, 2.6)),
  'collect.få-tag-på': all(ground, pers(38, 111, 1, { top: C.green, long: true, aR: [17, -64], mouth: 'o' }), slide('collect-fatag', 34, -22, 2.8, card(62, 34, 26, 36, 8, C.purple, HL), sparkle(84, 20, 7), sparkle(44, 14, 5), sparkle(88, 50, 5)),
    greyed(card(98, 94, 18, 25, 0, C.red), card(84, 98, 18, 25, -8, C.denim))),
  'collect.spelbutik': shop(C.beige, C.red, all(rect(24, 78, 14, 14, C.white, 3, C.ink, 1.4), circle(28, 82, 1.3, C.ink, null), circle(34, 82, 1.3, C.ink, null), circle(31, 85, 1.3, C.ink, null), circle(28, 88, 1.3, C.ink, null), circle(34, 88, 1.3, C.ink, null),
    card(50, 76, 13, 18, -14, C.purple), card(58, 76, 13, 18, 10, C.denim), path('M61 92 L71 92 C71 88 68 87 67.6 81 L64.4 81 C64 87 61 88 61 92 Z', C.red, C.ink, 1.2), circle(66, 78, 3.6, C.red, C.ink, 1.2), rect(20, 60, 30, 10, C.green, 1, C.ink, 1), line('M30 60 L30 70 M40 60 L40 70', C.white, 1)),
    all(rect(38, 8, 44, 16, C.white, 3, C.ink, 1.6), rect(44, 11, 10, 10, C.red, 2, C.ink, 1), circle(49, 16, 1.4, C.white, null), card(62, 16, 8, 11, -8, C.purple), star(74, 16, 5, C.yellow))),

  // ── 4743 Antikviteter ──
  'collect.antikvitet': all(rect(8, 92, 104, 14, C.brown, 2, C.ink, 1.8), path('M14 92 L106 92 L100 84 L20 84 Z', '#8c2f39', C.ink, 1.4), vase(56, 84, 1.45), candlestick(24, 84, 1), at(96, 84, 0.8, coin(0, -12, 12, C.gold, crown(0, -12, 1.2))),
    line('M66 46 L84 36', C.ink, 1), tag(98, 32, 1.05, '1780', C.white, HL), sparkle(30, 30, 5)),
  'collect.antik.2': all(ground, greyed(rect(18, 44, 22, 26, C.grey, 2, C.ink, 1.6), rect(16, 70, 26, 6, C.grey, 1, C.ink, 1.6), line('M19 76 L19 111 M39 76 L39 111', C.ink, 3), num(29, 36, '2024', 9)),
    line('M66 80 C60 92 68 100 63 111 M100 80 C106 92 98 100 103 111', C.ink, 5.4), line('M66 80 C60 92 68 100 63 111 M100 80 C106 92 98 100 103 111', C.brown, 3), circle(63, 108, 3, C.gold, C.ink, 1), circle(103, 108, 3, C.gold, C.ink, 1),
    ellipse(83, 50, 18, 21, C.gold, C.ink, 1.8), ellipse(83, 50, 13, 16, '#a8324a', C.ink, 1), line('M76 44 Q83 38 90 44 M76 56 Q83 62 90 56', C.gold, 1.2),
    path('M73 31 C75 22 80 26 83 20 C86 26 91 22 93 31 C88 27 78 27 73 31 Z', C.gold, C.ink, 1.2), circle(83, 25.5, 1.8, '#a8324a', C.ink, 0.7), line('M76 29 q2 -3 4 0 M86 29 q2 -3 4 0', C.ink, 0.8),
    line('M64 62 Q60 70 66 76 M102 62 Q106 70 100 76', C.ink, 4.6), line('M64 62 Q60 70 66 76 M102 62 Q106 70 100 76', C.gold, 2.6), rect(63, 72, 40, 11, '#a8324a', 5, C.ink, 1.6), line('M66 81 L100 81', C.gold, 1.6),
    circle(83, 25, 12.5, 'none', HL, 2.6), circle(63, 100, 10, 'none', HL, 2.6), sparkle(108, 40, 6), sparkle(58, 46, 5), sparkle(104, 14, 4), num(83, 8.5, '1790', 9)),
  'collect.antikaffär': shop('#3f5f4a', '#7a2f45', all(rect(24, 62, 9, 30, C.brown, 1, C.ink, 1.2), circle(28.5, 68, 3.2, C.white, C.ink, 0.9), line('M28.5 74 L28.5 86', C.gold, 1.2), circle(28.5, 87, 1.8, C.gold, C.ink, 0.6),
    vase(48, 93, 0.62), candlestick(63, 93, 0.6), line('M56 54 L56 60 M48 64 Q56 58 64 64', C.gold, 1.6), circle(48, 66, 1.6, '#bfe3f5', C.ink, 0.6), circle(56, 68, 1.6, '#bfe3f5', C.ink, 0.6), circle(64, 66, 1.6, '#bfe3f5', C.ink, 0.6)),
    all(line('M20 8 L20 22 M20 10 L44 10', C.ink, 2), rect(26, 12, 18, 16, C.gold, 3, C.ink, 1.4), vase(35, 26, 0.3, C.navy))),
  'collect.golvur': all(ground, rect(42, 94, 36, 18, C.brown, 2, C.ink, 1.8), rect(47, 46, 26, 50, C.brown, 1, C.ink, 1.8), rect(52, 52, 16, 36, '#e9d9b8', 1, C.ink, 1.2), line('M60 52 L60 76', C.gold, 1.6), circle(60, 79, 4.6, C.gold, C.ink, 1.1),
    rect(41, 14, 38, 34, C.brown, 2, C.ink, 1.8), path('M41 14 Q60 -2 79 14 Z', C.brown, C.ink, 1.8), circle(60, 31, 13, C.white, C.ink, 1.6), ...[0, 1, 2, 3].map((i) => line(`M${60 + Math.round(Math.cos((i * Math.PI) / 2) * 10)} ${31 + Math.round(Math.sin((i * Math.PI) / 2) * 10)} L${60 + Math.round(Math.cos((i * Math.PI) / 2) * 12)} ${31 + Math.round(Math.sin((i * Math.PI) / 2) * 12)}`, C.ink, 1.4)),
    line('M60 31 L60 23 M60 31 L66 34', C.ink, 1.8), circle(60, 31, 1.4, C.ink, null), circle(60, 6, 2.4, C.gold, C.ink, 0.9)),
  'collect.fickur': all(line('M52 22 C40 8 70 4 84 12 C98 20 104 10 112 14', C.ink, 4.4), line('M52 22 C40 8 70 4 84 12 C98 20 104 10 112 14', C.gold, 2.2, '3 2.4'), circle(52, 27, 6, 'none', C.ink, 4.4), circle(52, 27, 6, 'none', C.gold, 2.2), rect(47, 30, 10, 8, C.gold, 2, C.ink, 1.4),
    circle(52, 72, 36, C.gold, C.ink, 2), circle(52, 72, 29, C.white, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return line(`M${(52 + Math.cos(a) * 24).toFixed(1)} ${(72 + Math.sin(a) * 24).toFixed(1)} L${(52 + Math.cos(a) * 27).toFixed(1)} ${(72 + Math.sin(a) * 27).toFixed(1)}`, C.ink, i % 3 === 0 ? 2 : 1); }),
    line('M52 72 L52 54 M52 72 L64 80', C.ink, 2.4), circle(52, 72, 2.2, C.ink, null), circle(52, 88, 6, 'none', C.ink, 0.9), line('M52 88 L52 84', C.ink, 0.9)),
  'collect.kristallkrona': all(line('M30 6 L90 6', C.ink, 2.4), line('M60 6 L60 30', C.gold, 2.6, '3 2'), path('M54 30 L66 30 L70 44 L64 58 L56 58 L50 44 Z', C.gold, C.ink, 1.6),
    ...[-1, 1].flatMap((d) => [line(`M${60 + d * 6} 52 C${60 + d * 22} 66 ${60 + d * 30} 60 ${60 + d * 34} 46`, C.ink, 4.2), line(`M${60 + d * 6} 52 C${60 + d * 22} 66 ${60 + d * 30} 60 ${60 + d * 34} 46`, C.gold, 2.2), line(`M${60 + d * 4} 54 C${60 + d * 12} 70 ${60 + d * 18} 66 ${60 + d * 19} 54`, C.ink, 4.2), line(`M${60 + d * 4} 54 C${60 + d * 12} 70 ${60 + d * 18} 66 ${60 + d * 19} 54`, C.gold, 2.2)]),
    ...[-34, -19, 19, 34].map((dx) => all(ellipse(60 + dx, dx * dx > 500 ? 46 : 54, 5, 1.8, C.gold, C.ink, 1), rect(58.4 + dx, (dx * dx > 500 ? 46 : 54) - 13, 3.2, 12, C.white, 0.6, C.ink, 1), path(`M${60 + dx} ${(dx * dx > 500 ? 46 : 54) - 19} c2.6 2.6 1.8 4.8 0 5.4 c-1.8 -0.6 -2.6 -2.8 0 -5.4 Z`, C.orange, C.ink, 0.6))),
    ...[-34, -26, -19, -10, 0, 10, 19, 26, 34].map((dx, i) => all(line(`M${60 + dx} ${i % 2 ? 62 : 58} L${60 + dx} ${i % 2 ? 76 : 70}`, C.grey, 0.9), path(`M${60 + dx} ${i % 2 ? 76 : 70} l3.4 5 l-3.4 7 l-3.4 -7 Z`, '#cdeaf7', C.ink, 0.9))),
    line('M60 58 L60 86', C.grey, 0.9), path('M60 86 l5 7 l-5 11 l-5 -11 Z', '#cdeaf7', C.ink, 1), sparkle(22, 84, 5), sparkle(98, 88, 5), sparkle(86, 24, 4)),
  'collect.silverstämpel': all(ellipse(22, 22, 13, 9, C.silver, C.ink, 1.6), path('M33 19 L102 17 C110 17 110 27 102 27 L33 25 Z', C.silver, C.ink, 1.6), rect(66, 15, 26, 14, 'none', 2, HL, 2.2), line('M66 29 L12 50 M92 29 L108 50', HL, 1.6, '4 3'),
    rect(8, 50, 104, 54, C.silver, 8, C.ink, 2), line('M16 58 L50 58', C.white, 2),
    circle(30, 70, 8.5, '#aab1b8', C.ink, 1.3), circle(22.5, 82, 8.5, '#aab1b8', C.ink, 1.3), circle(37.5, 82, 8.5, '#aab1b8', C.ink, 1.3), circle(30, 78, 6, '#aab1b8', null), crown(30, 70, 0.85, C.silver), crown(23, 83, 0.85, C.silver), crown(37, 83, 0.85, C.silver),
    rect(52, 66, 22, 24, '#aab1b8', 4, C.ink, 1.3), path('M56 84 L56 74 L60 79 L63 71 L66 79 L70 74 L70 84 Z', C.silver, C.ink, 0.9), path('M82 66 L104 66 L104 84 L93 91 L82 84 Z', '#aab1b8', C.ink, 1.3), num(93, 83, '8', 13, C.silver)),
  'collect.arvegods': all(bust(20, 22, 1.25, C.purple, GREYHAIR, true), bust(60, 22, 1.25, C.green, C.hair, true), bust(100, 24, 1.05, C.orange, '#8a5a2b', true), arrow(34, 30, 46, 30, HL, 3), arrow(74, 30, 87, 30, HL, 3),
    ground, byra(60, 110, 1.45), rect(27, 56, 66, 58, 'none', 5, HL, 2.6), line('M20 46 L20 52 L100 52 L100 46', C.grey, 1.6), line('M60 52 L60 56', C.grey, 1.6)),
  'collect.dödsbo': all(ground, rect(10, 10, 30, 36, C.gold, 2, C.ink, 1.6), rect(14, 14, 22, 28, C.white, 1, C.ink, 0.9), greyed(bust(25, 26, 1, C.grey, C.grey)), path('M24 8 L42 26 L42 34 L16 8 Z', C.black, null),
    byra(34, 110, 1), cardboard(58, 88, 24, 22), cardboard(62, 70, 20, 18), painting(86, 78, 26, 32), line('M100 44 L100 76', C.ink, 2.2), path('M90 44 L110 44 L105 30 L95 30 Z', C.yellow, C.ink, 1.4), rect(94, 74, 12, 4, C.dark, 1, null),
    candlestick(26, 76, 0.7, C.silver), vase(42, 76, 0.45), tag(70, 62, 0.8, '1', C.white, C.ink), tag(48, 100, 0.8, '2', C.white, C.ink)),

  // ── 4744 Samlarvärde och skick ──
  'collect.samlarvärde': all(rect(6, 78, 38, 5, C.brown, 1, C.ink, 1.4), line('M10 83 L10 111 M40 83 L40 111', C.ink, 2.6), card(25, 62, 22, 31, -6, C.purple), tag(27, 98, 0.9, '1'), line('M50 10 L50 110', C.grey2, 1.8, '4 4'),
    rect(56, 86, 42, 8, C.brown, 2, C.ink, 1.6), ellipse(77, 84, 15, 4, '#a8324a', C.ink, 1.2), card(77, 64, 22, 31, 0, C.purple), `<path d="M59 86 L59 54 C59 28 95 28 95 54 L95 86 Z" fill="#bfe3f5" fill-opacity="0.35" stroke="${C.ink}" stroke-width="2"/>`, line('M65 52 C66 42 70 38 75 36', C.white, 2),
    star(78, 18, 11, HL), bust(107, 62, 0.8, C.green), sparkle(100, 36, 5), sparkle(56, 40, 4), tag(82, 104, 1.35, '500', HL, C.white)),
  'collect.värdera': all(ground, rect(62, 88, 50, 6, C.brown, 2, C.ink, 1.6), line('M68 94 L68 111 M106 94 L106 111', C.ink, 3.4), vase(88, 88, 1), pers(30, 111, 1, { top: C.navy, leg: C.dark, hair: GREYHAIR, aR: [22, -50], mouth: 'flat' }), magnifier(58, 56, 9, -50),
    appear('collect-vardera', 35, line('M92 44 L98 34', C.ink, 1), tag(92, 24, 1.3, '5000', HL, C.white), sparkle(110, 40, 5))),
  'collect.samlarobjekt': all(path('M60 4 L22 84 L98 84 Z', 'rgba(242,193,78,.28)', null), rect(10, 84, 100, 8, C.brown, 2, C.ink, 1.8), line('M18 92 L18 111 M102 92 L102 111', C.ink, 3.4), ground,
    rect(42, 34, 36, 50, C.red, 3, C.ink, 1.8), rect(47, 39, 26, 34, '#cfe6f3', 2, C.ink, 1.2), robot(60, 72, 0.9, C.denim), star(60, 79, 4, C.yellow),
    line('M24 84 L24 76', C.ink, 2), coin(24, 66, 10, C.gold, crown(24, 66, 1)), line('M96 84 L96 78', C.ink, 2), card(96, 62, 20, 28, 0, C.purple), star(60, 16, 9, HL), sparkle(30, 44, 5), sparkle(92, 36, 5)),
  'collect.original': all(painting(8, 30, 56, 46), star(58, 30, 12, HL), num(58, 34.5, '1', 12, C.white), arrow(68, 54, 80, 54, C.grey, 3), greyed(turn(98, 44, 6, painting(-15, -12, 30, 24, C.white)), turn(96, 76, -5, painting(-15, -12, 30, 24, C.white))),
    rect(20, 84, 32, 10, C.white, 2, HL, 2), num(36, 92.5, '1/1', 8.5)),
  'collect.äkthetsintyg': all(rect(10, 12, 62, 86, C.white, 3, C.ink, 1.8), rect(14, 16, 54, 78, 'none', 2, C.gold, 1.4), line('M22 28 L60 28 M22 38 L60 38 M22 48 L48 48', C.grey, 2), check(30, 66, 1.2), path('M48 84 L44 100 L52 95 L60 100 L56 84 Z', C.red, C.ink, 1.2), star(52, 76, 12, C.red), circle(52, 76, 4.6, C.gold, C.ink, 0.9),
    line('M72 56 L84 56', HL, 2.4, '3 3'), turn(98, 56, 6, rect(-13, -19, 26, 38, C.white, 2, C.ink, 1.4), rect(-10, -16, 20, 19, C.sky, 1, C.ink, 0.8), bust(0, -9, 0.7, C.red), path('M-9 11 C-6 4 -4 15 -1 9 C1 4 3 13 9 7', 'none', C.navy, 1.6))),
  'collect.välbevarad': all(ground, greyed(toyCar(28, 104, 1.1, C.red, true), rect(13, 54, 30, 13, C.white, 2, C.ink, 1.2), num(28, 64.5, '1950', 9)), rect(56, 26, 52, 80, 'none', 6, HL, 2.6),
    toyCar(82, 100, 1.25, C.red), rect(66, 34, 32, 14, C.white, 2, C.ink, 1.2), num(82, 45, '1950', 9.5), sparkle(100, 60, 7), sparkle(64, 64, 5), sparkle(90, 54, 4)),
  'collect.eftertraktad': all(circle(60, 58, 26, 'rgba(242,193,78,.35)', null), sleeveArm(4, 62, 30, 60, C.sky), sleeveArm(116, 66, 90, 60, C.green), sleeveArm(14, 8, 36, 30, C.purple), sleeveArm(106, 8, 84, 30, C.red), sleeveArm(40, 116, 50, 92, C.denim), sleeveArm(84, 116, 72, 92, C.orange),
    card(60, 58, 28, 40, 0, C.purple, HL), sparkle(60, 22, 5)),
  'collect.stiga-i-värde': all(ground, rect(8, 88, 28, 24, C.mint, 2, C.ink, 1.6), tag(24, 78, 0.95, '100'), card(22, 100, 12, 17, 0, C.purple),
    appear('collect-stiga-b', 20, rect(46, 64, 28, 48, C.mint, 2, C.ink, 1.6), tag(62, 54, 0.95, '300'), card(60, 96, 12, 17, 0, C.purple)),
    appear('collect-stiga-c', 45, rect(84, 36, 28, 76, C.mint, 2, C.ink, 1.6), tag(99, 26, 1.05, '900', HL, C.white), card(98, 92, 12, 17, 0, C.purple), sparkle(108, 10, 5)),
    waIn('collect-stiga-a', -30, 22, arrow(10, 62, 66, 14, HL, 4))),
  'collect.affektionsvärde': all(ground, pers(40, 111, 1.05, { top: C.sky, long: true, aL: [4, -36], aR: [-4, -36] }), teddy(40, 82, 0.95), line('M30 70 L50 70', C.ink, 6.4), line('M30 70 L50 70', C.sky, 4.2),
    heart(66, 40, 9), bubble(92, 30, 17, [58, 46], bust(92, 28, 1, C.purple, GREYHAIR, true)), greyed(tag(92, 96, 1.1, '0'), line('M76 104 L106 88', C.ink, 2.4))),

  // ── 4745 Katalogisering ──
  'collect.katalog': all(path('M6 98 L60 104 L114 98 L114 34 L60 40 L6 34 Z', '#7a4b34', C.ink, 2), path('M10 92 L60 98 L60 32 L10 26 Z', C.white, C.ink, 1.6), path('M110 92 L60 98 L60 32 L110 26 Z', C.white, C.ink, 1.6), line('M10 95 L60 101 L110 95', C.grey, 1),
    ...[0, 1, 2, 3].flatMap((r) => [turn(18, 37 + r * 15, 7, stamp(0, 0, 9, 11, 0, [C.red, C.green, C.denim, C.yellow][r]!, '', C.white)), turn(34, 41 + r * 15, 7, num(-6, 0, String(r + 1), 7, HL), line('M0 -2 L12 -2', C.grey, 1.4), num(19, 0, ['5', '8', '12', '40'][r]!, 7)),
      at(102, 37 + r * 15, 1, coin(0, 0, 5, [C.gold, C.silver, C.tan, C.gold][r]!)), turn(72, 44 + r * 15, -7, num(0, 0, String(r + 5), 7, HL), line('M5 -2 L17 -2', C.grey, 1.4))])),
  'collect.i-bokstavsordning': all(rect(4, 92, 112, 6, C.brown, 2, C.ink, 1.6), ...['A', 'B', 'C', 'D'].map((ch, i) => book(8 + i * 17, 92, 15, [56, 62, 52, 58][i]!, [C.red, C.green, C.denim, C.yellow][i]!, num(15.5 + i * 17, 62, ch, 12, C.white))),
    num(84, 80, '…', 14, C.grey), book(96, 92, 15, 58, C.purple, num(103.5, 62, 'Ö', 12, C.white)), arrow(8, 108, 110, 108, HL, 3.4), circle(15.5, 22, 7, HL, C.ink, 1.2), num(15.5, 26, '1', 10, C.white)),
  // Manual track (0.65): a way of working, not a result. Grey: picking at random, cards everywhere. Colour: one pile worked through in three steps (sort, count, write down).
  'collect.systematisk': (() => {
    const mc = (x: number, y: number, deg: number, col: string): Svg => turn(x, y, deg, rect(-4.5, -6.5, 9, 13, col, 1.8, C.ink, 1.1), circle(0, -1, 1.8, C.white, null));
    const pile = (x: number, y: number, col: string, n: number): Svg => all(...Array.from({ length: n }, (_, i) => rect(x - 5.5, y - 3 - i * 3, 11, 3, col, 1, C.ink, 0.9)));
    const step = (x: number, n: string, done: boolean): Svg => all(circle(x, 15, 7.5, done ? C.green : HL, C.ink, 1.4), num(x, 19, n, 10.5, C.white));
    return all(ground,
      greyed(pers(25, 111, 0.9, { top: C.grey, aL: [-17, -54], aR: [16, -22], mouth: 'flat' }), mc(8, 46, -30, C.red), mc(42, 60, 24, C.denim), mc(10, 84, 14, C.green), mc(43, 92, -40, C.red), mc(38, 34, 60, C.green), mc(12, 104, 80, C.denim), mc(44, 106, 8, C.green),
        num(11, 26, '?', 20), num(40, 20, '?', 14), line('M30 30 C36 26 34 20 28 22', C.ink, 1.6)),
      line('M53 6 L53 110', C.grey2, 1.8, '4 4'),
      rect(57, 4, 59, 46, C.white, 4, C.ink, 1.6), step(67, '1', true), step(86.5, '2', true), step(106, '3', false), line('M75.5 15 L78 15 M95 15 L97.5 15', C.ink, 1.8), path('M78 12 L81.5 15 L78 18 Z M97.5 12 L101 15 L97.5 18 Z', C.ink, null),
      pile(62.5, 44, C.red, 3), pile(71.5, 44, C.denim, 2), pile(82, 44, C.red, 3), line('M89 32 L89 43 M91.6 32 L91.6 43 M94.2 32 L94.2 43', C.ink, 1.5), rect(100, 30, 12, 15, C.white, 1.5, C.ink, 1.1), line('M102.5 35 L109.5 35 M102.5 39 L109.5 39', C.grey, 1.2), line('M112 28 L106 37', C.ink, 3), line('M111.6 28.6 L106.8 35.8', C.yellow, 1.6),
      line('M62 25.5 l2 2.4 l4.4 -5.4 M81.5 25.5 l2 2.4 l4.4 -5.4', C.green, 2.2), rect(98, 24, 17, 24, 'none', 4, HL, 2.2),
      pers(68, 111, 0.92, { top: HL, long: true, aL: [-10, -30], aR: [22, -34] }),
      rect(80, 84, 36, 5, C.brown, 1, C.ink, 1.4), line('M84 89 L84 111 M112 89 L112 111', C.ink, 2.6), pile(86, 84, C.red, 3), pile(87, 75, C.red, 0), rect(96, 70, 18, 14, C.white, 1.5, C.ink, 1.2), line('M99 74 L111 74 M99 78 L111 78', C.grey, 1.2), line('M99 81.4 L104 81.4', HL, 1.6),
      line('M95 68 L90 78', C.ink, 3.2), line('M94.6 68.8 L90.6 76.8', C.yellow, 1.8), pile(72, 111, C.denim, 2), sparkle(110, 60, 5));
  })(),
  'collect.inköpspris': all(path('M12 14 L54 14 L54 96 L48 91 L42 96 L36 91 L30 96 L24 91 L18 96 L12 91 Z', C.white, C.ink, 1.8), line('M18 26 L48 26 M18 36 L40 36 M18 46 L44 46', C.grey, 2), line('M18 60 L48 60', C.ink, 1.4), rect(17, 65, 32, 17, 'none', 8, HL, 2.6), num(33, 78, '150', 11),
    path('M70 52 L106 52 L110 104 L66 104 Z', C.tan, C.ink, 1.8), path('M78 52 C78 36 98 36 98 52', 'none', C.ink, 2.2), coin(88, 80, 13, C.silver, crown(88, 80, 1.2)), arrow(56, 73, 70, 73, HL, 3), coin(82, 22, 7, C.gold), coin(94, 26, 7, C.gold), arrow(88, 34, 88, 44, C.grey, 2.4)),
  'collect.lucka-dörr.2': all(rect(4, 94, 112, 6, C.brown, 2, C.ink, 1.6), rect(4, 22, 112, 6, C.brown, 2, C.ink, 1.6), ...[0, 1, 2].map((i) => book(8 + i * 16, 94, 14, [58, 62, 54][i]!, [C.red, C.green, C.denim][i]!, num(15 + i * 16, 70, String(i + 1), 10, C.white))),
    ...[0, 1, 2].map((i) => book(66 + i * 16, 94, 14, [60, 54, 62][i]!, [C.yellow, C.purple, C.orange][i]!, num(73 + i * 16, 70, String(i + 5), 10, i === 0 ? C.ink : C.white))),
    `<rect x="55" y="34" width="10" height="58" rx="3" fill="${C.white}" stroke="${HL}" stroke-width="2.6" stroke-dasharray="5 4"/>`, arrow(60, 4, 60, 30, HL, 3)),
  'collect.vitrinskåp': all(ground, line('M32 104 L32 111 M88 104 L88 111', C.ink, 4), rect(24, 6, 72, 100, C.brown, 3, C.ink, 2), rect(29, 11, 62, 90, '#f3ead6', 1, C.ink, 1.2), line('M29 40 L91 40 M29 70 L91 70', C.brown, 2.4),
    robot(42, 39, 0.72), vase(60, 39, 0.5), robot(78, 39, 0.72, C.denim), coin(40, 60, 7, C.gold), card(60, 57, 14, 20, 0, C.purple), coin(80, 60, 7, C.silver), toyCar(46, 100, 0.7, C.red), teddy(76, 100, 0.8),
    glass(29, 11, 31, 90, 1, 0.3), glass(60, 11, 31, 90, 1, 0.3), line('M34 30 L46 16 M66 30 L78 16 M36 96 L44 86', C.white, 2), circle(57, 56, 1.8, C.gold, C.ink, 0.8), circle(63, 56, 1.8, C.gold, C.ink, 0.8)),

  // ── 4746 Byteshandel ──
  'collect.byta.2': all(ground, pers(22, 111, 1, { top: C.sky, aR: [18, -40] }), pers(98, 111, 1, { top: C.green, long: true, aL: [-18, -40] }),
    path('M40 44 C52 26 68 26 80 40', 'none', HL, 3), path('M80 40 L72 39 L77 32 Z', HL, HL, 1.5), path('M80 96 C68 108 52 108 40 98', 'none', HL, 3), path('M40 98 L48 98 L44 105 Z', HL, HL, 1.5),
    slide('collect-byta-a', 36, 0, 3, robot(44, 82, 0.8)), slide('collect-byta-b', -36, 0, 3, card(77, 70, 18, 25, 0, C.purple))),
  'collect.mellanskillnad': all(ground, ...[0, 1, 2, 3, 4].map((i) => ellipse(34, 104 - i * 12, 17, 6.5, i > 2 ? HL : C.gold, C.ink, 1.6)), ...[0, 1, 2].map((i) => ellipse(86, 104 - i * 12, 17, 6.5, C.gold, C.ink, 1.6)),
    line('M12 74 L112 74', C.grey, 1.6, '4 3'), line('M56 72 L62 72 L62 48 L56 48', HL, 3), robot(34, 40, 0.75), card(86, 50, 15, 21, 0, C.purple)),
  'collect.prisförslag': all(rect(6, 34, 46, 62, C.white, 3, C.ink, 1.8), rect(10, 38, 38, 28, '#cfe6f3', 2, C.ink, 1), toyCar(29, 62, 0.8, C.red), greyed(tag(31, 80, 1, '900')),
    path('M70 62 L62 74 L80 62 Z', C.white, C.ink, 1.6), rect(54, 14, 60, 50, C.white, 10, C.ink, 1.8), rect(68, 60, 12, 5, C.white, 0, null), tag(80, 34, 1.3, '700', HL, C.white), num(104, 44, '?', 20, HL), arrow(70, 52, 54, 62, HL, 2.6),
    bust(86, 88, 1.3, C.green)),
  'collect.utropspris': all(ground, greyed(rect(48, 76, 30, 36, C.grey2, 1, C.ink, 1.4), rect(78, 52, 34, 60, C.grey2, 1, C.ink, 1.4), tag(64, 66, 0.9, '800'), tag(96, 42, 0.9, '1200')),
    rect(10, 96, 38, 16, C.mint, 1, C.ink, 1.6), rect(6, 92, 44, 22, 'none', 4, HL, 2.6), tag(31, 82, 1.25, '500', HL, C.white), line('M10 96 L10 52', C.ink, 2.2), path('M10 52 L28 58 L10 64 Z', HL, C.ink, 1.2),
    gavel(84, 20, 150, 0.9), rect(60, 26, 20, 5, C.brown, 2, C.ink, 1.2)),
  'collect.ropa-in': all(ground, pers(26, 111, 1, { top: C.green, long: true, aR: [15, -64], mouth: 'o' }), line('M41 47 L41 34', C.ink, 2.6), circle(41, 24, 11, C.white, C.ink, 1.8), num(41, 29, '7', 14, HL),
    rect(70, 84, 44, 28, C.brown, 2, C.ink, 1.8), rect(84, 78, 16, 6, C.tan, 2, C.ink, 1.2), moving('collect-ropa-g', '0%,20%{transform:rotate(-38deg)}45%,100%{transform:rotate(0)}', { dur: 2.4, spin: true }, gavel(92, 71, 0, 0.95)), line('M78 70 L74 66 M80 62 L78 57 M106 64 L110 60', C.ink, 1.6),
    at(92, 40, 0.5, coin(0, 0, 22, C.gold), circle(0, 0, 16, C.white, C.ink, 1.6), line('M0 0 L0 -11 M0 0 L8 5', C.ink, 2.6)), waIn('collect-ropa-a', 24, 0, arrow(78, 40, 58, 40, HL, 3.4))),
  'collect.göra-en-bra-affär': all(ground, pers(28, 111, 1, { top: C.sky, aR: [30, -38], aL: [-12, -28] }), pers(92, 111, 1, { top: C.green, long: true, aL: [-30, -38], aR: [12, -28] }),
    waBob('collect-affar-h', 3, ellipse(60, 73, 6.4, 4.6, C.skin, C.ink, 1.2)), card(40, 28, 16, 22, -8, C.purple), coin(80, 28, 9, C.gold), path('M52 22 C58 16 64 16 70 22', 'none', HL, 2.6), path('M70 22 L63 21 L68 15 Z', HL, HL, 1.2), path('M68 36 C62 42 58 42 52 36', 'none', HL, 2.6), path('M52 36 L59 37 L54 43 Z', HL, HL, 1.2),
    waPulse('collect-affar-s', sparkle(60, 54, 6), sparkle(14, 36, 5), sparkle(106, 36, 5))),

  // ── 4747 Samlarmässor ──
  'collect.samlarmässa': all(rect(4, 4, 112, 108, '#efe6d2', 12, null), line('M6 14 Q60 30 114 14', C.ink, 1.2), ...[0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${12 + i * 15} ${16 + (3 - Math.abs(3 - i)) * 2.2} l8 1 l-4 9 Z`, [C.red, C.yellow, C.green, C.denim, C.orange, C.purple, C.red][i]!, C.ink, 0.9)),
    bust(22, 44, 0.9, C.green), bust(60, 42, 0.9, C.purple, C.hair, true), bust(98, 44, 0.9, C.orange, GREYHAIR),
    ...[0, 1, 2].map((i) => all(rect(6 + i * 38, 58, 32, 6, C.brown, 1, C.ink, 1.4), rect(8 + i * 38, 64, 28, 16, [C.red, C.denim, C.green][i]!, 1, C.ink, 1.4))),
    stamp(14, 54, 8, 10, -8, C.sky, '', '#efe6d2'), stamp(24, 54, 8, 10, 6, C.pink, '', '#efe6d2'), stamp(33, 54, 8, 10, -4, C.mint, '', '#efe6d2'), coin(50, 54, 4.6, C.gold), coin(60, 54, 4.6, C.silver), coin(70, 54, 4.6, C.gold), robot(88, 58, 0.5), card(100, 51, 9, 12, 6, C.purple), card(110, 52, 9, 12, -6, C.yellow),
    at(34, 112, 0.9, path('M-11 0 C-11 -12 11 -12 11 0 Z', C.sky, C.ink, 1.4), circle(0, -18, 8, C.hair, C.ink, 1.4)), at(78, 112, 0.9, path('M-11 0 C-11 -12 11 -12 11 0 Z', C.yellow, C.ink, 1.4), circle(0, -18, 8, '#8a5a2b', C.ink, 1.4), path('M-8 -18 C-10 -6 10 -6 8 -18 Z', '#8a5a2b', C.ink, 1.1))),
  'collect.mässhall': all(ground, path('M6 52 Q60 8 114 52 Z', C.silver, C.ink, 2), line('M30 36 L30 52 M60 30 L60 52 M90 36 L90 52', C.grey, 1.2), rect(6, 52, 108, 60, C.grey2, 1, C.ink, 2), ...[0, 1, 2, 3].map((i) => rect(12 + i * 13, 60, 9, 16, '#cfe6f3', 1, C.ink, 1)), ...[0, 1, 2, 3].map((i) => rect(60 + 9 + i * 13 - 10, 60, 9, 16, '#cfe6f3', 1, C.ink, 1)).slice(1),
    rect(44, 82, 32, 30, C.dark, 1, C.ink, 1.8), line('M60 82 L60 112', C.grey, 1.4), rect(40, 76, 40, 7, HL, 2, C.ink, 1.4),
    ...[18, 102].map((x, i) => all(line(`M${x} 52 L${x} 20`, C.ink, 1.8), path(`M${x} 20 l12 4 l-12 5 Z`, [C.red, C.denim][i]!, C.ink, 1))),
    ...[22, 32, 88, 98].map((x, i) => at(x, 112, 0.42, path('M-9 0 L-7 -24 L7 -24 L9 0 Z', [C.red, C.green, C.denim, C.yellow][i]!, C.ink, 2), circle(0, -32, 8, C.skin, C.ink, 2)))),
  'collect.utställare': all(ground, greyed(at(16, 112, 0.9, path('M-11 0 C-11 -12 11 -12 11 0 Z', C.grey, C.ink, 1.4), circle(0, -18, 8, C.grey, C.ink, 1.4))), pers(62, 112, 1.1, { top: HL, aL: [-20, -30], aR: [20, -30] }), line('M57 59 L62 72 L67 59', C.navy, 1.6), rect(57, 70, 10, 8, C.white, 1.5, C.ink, 1.2), line('M59 74 L65 74', C.grey, 1.2),
    rect(24, 80, 80, 6, C.brown, 1, C.ink, 1.6), rect(27, 86, 74, 26, C.denim, 1, C.ink, 1.6), stamp(36, 75, 9, 11, -6, C.sky), stamp(47, 75, 9, 11, 5, C.pink), coin(84, 75, 5, C.gold), coin(94, 75, 5, C.silver),
    line('M108 112 L108 30', C.ink, 2.2), rect(96, 26, 22, 44, C.white, 2, C.ink, 1.4), star(107, 40, 6, C.yellow), line('M100 54 L114 54 M100 60 L110 60', C.grey, 1.4)),
  'collect.entré.2': all(ground, rect(6, 22, 66, 90, '#b6453f', 3, C.ink, 2), rect(14, 40, 50, 34, '#cfe6f3', 2, C.ink, 1.6), bust(39, 54, 1.25, C.navy, C.hair, true), rect(10, 74, 58, 6, C.tan, 1, C.ink, 1.4), rect(30, 68, 18, 6, C.dark, 1, null),
    rect(22, 8, 34, 18, C.white, 3, HL, 2.4), num(39, 22, '80', 13), coin(86, 62, 7, C.gold), arrow(84, 72, 70, 76, C.grey, 2.4),
    turn(92, 92, -12, path('M-15 -8 L15 -8 L15 -3 C12 -3 12 3 15 3 L15 8 L-15 8 L-15 3 C-12 3 -12 -3 -15 -3 Z', C.yellow, HL, 2.4), star(-3, 0, 4.6, HL), line('M6 -8 L6 8', C.ink, 0.9, '2 2')), arrow(68, 88, 76, 90, HL, 2.6),
    path('M90 40 L112 40 L112 22 C112 12 90 12 90 22 Z', C.dark, C.ink, 1.6), arrow(101, 44, 101, 28, C.white, 2.4)),
  'collect.rota.2': all(ground, pers(60, 96, 1, { top: C.green, long: true, aL: [-9, -24], aR: [9, -24], mouth: 'o' }), path('M28 66 L92 66 L88 111 L32 111 Z', C.tan, C.ink, 2), path('M28 66 L16 58 L24 52 L36 60 Z M92 66 L104 58 L96 52 L84 60 Z', C.tan, C.ink, 1.6), line('M40 80 L80 80', C.brown, 1.4),
    waBob('collect-rota-a', 6, card(22, 32, 15, 21, -24, C.purple), stamp(100, 36, 13, 16, 20, C.sky)), moving('collect-rota-b', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,5px)}', { dur: 1.6 }, coin(34, 14, 6, C.gold), toyCar(92, 16, 0.55, C.red)),
    line('M40 54 L36 48 M80 54 L84 48 M60 14 L60 8', C.ink, 1.6)),
  'collect.raritet': all(greyed(stamp(12, 96, 12, 15, -12, C.sky), stamp(22, 100, 12, 15, 8, C.pink), stamp(16, 86, 12, 15, 4, C.mint), stamp(28, 90, 12, 15, -6, C.yellow), num(20, 76, '×999', 9)),
    rect(42, 94, 64, 12, C.brown, 3, C.ink, 1.8), ellipse(74, 90, 20, 6, '#a8324a', C.ink, 1.4), stamp(74, 70, 22, 28, -4, C.red, star(0, 0, 6, C.yellow), '#e7f3fa'),
    `<path d="M48 94 L48 52 C48 16 100 16 100 52 L100 94 Z" fill="#bfe3f5" fill-opacity="0.35" stroke="${C.ink}" stroke-width="2"/>`, circle(74, 22, 4, C.gold, C.ink, 1.2), line('M56 50 C58 36 64 30 70 28', C.white, 2.2),
    sparkle(108, 40, 6), sparkle(40, 36, 5), circle(26, 30, 12, HL, C.ink, 1.4), num(26, 34.5, '×1', 11, C.white)),
  'collect.likasinnad': all(bust(30, 84, 1.5, C.sky), bust(90, 84, 1.5, C.green, C.hair, true), bubble(30, 34, 19, [30, 66], stamp(30, 34, 17, 21, 0, C.red, bird(0, 0, 0.8, C.yellow), C.white)), bubble(90, 34, 19, [90, 66], stamp(90, 34, 17, 21, 0, C.red, bird(0, 0, 0.8, C.yellow), C.white)),
    num(60, 41, '=', 22, HL), heart(60, 84, 6, HL), line('M44 90 L52 88 M76 90 L68 88', HL, 2)),
  'collect.bakluckeloppis': all(ground, path('M4 98 L4 78 L14 74 L24 58 L52 58 L58 74 L62 76 L62 98 Z', C.red, C.ink, 2), path('M27 62 L36 62 L36 74 L20 74 Z M40 62 L50 62 L54 74 L40 74 Z', '#cfe6f3', C.ink, 1), circle(18, 100, 8.5, C.dark, C.ink, 1.6), circle(18, 100, 3, C.silver, null), circle(50, 100, 8.5, C.dark, C.ink, 1.6), circle(50, 100, 3, C.silver, null),
    path('M54 58 L76 34 L80 38 L60 62 Z', C.red, C.ink, 1.8), cardboard(60, 64, 14, 12), at(70, 64, 0.34, vase(0, 0, 1)), line('M57 76 L78 76', C.ink, 2),
    rect(70, 86, 46, 5, C.brown, 1, C.ink, 1.4), line('M74 91 L74 111 M112 91 L112 111', C.ink, 2.6), vase(80, 86, 0.42), teddy(94, 86, 0.6), book(102, 86, 10, 14, C.denim), tag(88, 100, 0.8, '10', HL, C.white), tag(106, 100, 0.8, '5', HL, C.white), bust(100, 58, 0.9, C.green, C.hair, true)),
};
