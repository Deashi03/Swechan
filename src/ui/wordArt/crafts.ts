/**
 * Kultur & fritid → Spel & hobbyer → Skapande hobbyer, 4731–4737 (0.65): knitting and crochet, sewing,
 * scrapbooking, jewellery making, model building, calligraphy, origami and paper craft.
 * Tools, materials and results are plain scenes. Verbs move: `appear()` shows parts one after another (the last
 * state is the poster frame), `moving()`/`waIn()` move a tool or a piece with transform only. The named part is
 * orange (HL) where the picture shows more than one thing; grey is the reference.
 * Near words get different kinds of picture: bare needles (sticka) against work in progress on the needles
 * (stickning) and loops only (lägga upp maskor); a straight seam in the middle of the cloth (raksöm) against a
 * zigzag along a fraying edge (sicksack); the stamp and its ink pad (stämpel) against a hand that stamps a row of
 * prints (stämpla); a half-built aeroplane with loose parts (modellbygge) against the finished one on its stand
 * (modellflygplan); a railway on a table (modelljärnväg) against a landscape in a glass case (diorama).
 * No brands and no letters that give away the word (single letters, digits and characters of other scripts only).
 */
import { C, all, arrow, circle, ellipse, g, hand, heart, line, moving, path, rect, sparkle, star, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, deg: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const tableTop = (y = 96, col: string = C.beige) => rect(2, y, 116, 22, col, 4, C.ink, 1.6);
/** Hidden at first, appears at `p` % and stays (poster frame: visible). */
const appear = (name: string, p: number, ...k: Svg[]) => moving(name, `0%,${p}%{opacity:0}${p + 8}%,100%{opacity:1}`, { dur: 3.2 }, ...k);
/** A line with a dark outline (cord, wire, yarn). */
const cord = (d: string, col: string, w = 3) => line(d, C.ink, w + 2) + line(d, col, w);
const soft = (d: string, fill: string, op: number, stroke: string = C.ink) => `<path d="${d}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>`;

// ── Yarn, needles, hooks ─────────────────────────────────────────────
const ball = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 1.8),
  line(`M${f1(x - r * 0.8)} ${f1(y - r * 0.3)} Q${x} ${f1(y - r * 0.95)} ${f1(x + r * 0.8)} ${f1(y - r * 0.2)} M${f1(x - r * 0.9)} ${f1(y + r * 0.25)} Q${x} ${f1(y - r * 0.4)} ${f1(x + r * 0.9)} ${f1(y + r * 0.3)} M${f1(x - r * 0.6)} ${f1(y + r * 0.7)} Q${x} ${f1(y + r * 0.1)} ${f1(x + r * 0.7)} ${f1(y + r * 0.6)}`, C.ink, 1));
/** Knitting needle from the tip (x1, y1) to the knob (x2, y2). */
const ndl = (x1: number, y1: number, x2: number, y2: number, col: string = C.tan) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 5), line(`M${x1} ${y1} L${x2} ${y2}`, col, 2.8), circle(x2, y2, 3.4, col, C.ink, 1.4));
const loop = (x: number, y: number, col: string, rx = 3.8, ry = 6) => all(ellipse(x, y, rx, ry, 'none', C.ink, 4.2), ellipse(x, y, rx, ry, 'none', col, 2.2));
/** Knitted cloth: rows of V-shaped stitches. */
function knit(x: number, y: number, w: number, h: number, col: string, dark: string, step = 8): Svg {
  let d = '';
  for (let yy = y + step * 0.6; yy < y + h - 2; yy += step) for (let xx = x + step * 0.6; xx < x + w - 2; xx += step) d += `M${f1(xx - step * 0.32)} ${f1(yy - step * 0.3)} L${f1(xx)} ${f1(yy + step * 0.28)} L${f1(xx + step * 0.32)} ${f1(yy - step * 0.3)} `;
  return rect(x, y, w, h, col, 2, C.ink, 1.6) + line(d, dark, 1.2);
}
/** Crochet hook; the hooked tip is at the origin and the handle points down. */
const hook = (x: number, y: number, deg: number, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, line('M0 3 L0 46', C.ink, 5), line('M0 3 L0 46', C.silver, 3), rect(-3.4, 22, 6.8, 26, C.purple, 3, C.ink, 1.2), path('M0 3 C-1 -2 -6 -1 -4 3.5', 'none', C.ink, 2));
const scissors = (x: number, y: number, s: number, deg: number, col: string = C.red) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
  path('M0 0 L27 -6 L28 -3 L2 3 Z', C.silver, C.ink, 1.2), path('M0 0 L27 6 L28 3 L2 -3 Z', C.silver, C.ink, 1.2),
  circle(-9, -6, 5.4, 'none', C.ink, 5), circle(-9, -6, 5.4, 'none', col, 2.8), circle(-9, 6, 5.4, 'none', C.ink, 5), circle(-9, 6, 5.4, 'none', col, 2.8),
  line('M-4 -3 L2 0 M-4 3 L2 0', C.ink, 2.4), circle(3, 0, 1.3, C.ink, null));
/** Sewing pin with a round head at the origin, the point `len` further down. */
const pin = (x: number, y: number, deg: number, col: string = C.yellow, len = 20) => rot(x, y, deg, line(`M0 0 L0 ${len}`, C.ink, 1.8), circle(0, 0, 3, col, C.ink, 1.2));
/** Sewing needle: the eye end at the origin, the point `len` further down. */
const sewNeedle = (x: number, y: number, deg: number, len = 34) => rot(x, y, deg, path(`M-1.8 2 Q0 -3 1.8 2 L0.6 ${len} L-0.6 ${len} Z`, C.silver, C.ink, 1.1), line('M0 1.5 L0 6', C.ink, 1.2));
/** The needle and presser foot of a sewing machine; the needle point is at (x, y). */
const machine = (x: number, y: number) => all(rect(x - 6, y - 50, 12, 30, C.grey2, 3, C.ink, 1.4), line(`M${x} ${y - 20} L${x} ${y}`, C.ink, 1.8), path(`M${x - 9} ${y - 2} L${x + 9} ${y - 2} L${x + 11} ${y + 3} L${x - 11} ${y + 3} Z`, C.silver, C.ink, 1.2), line(`M${x + 4} ${y - 20} L${x + 4} ${y - 2}`, C.ink, 1.6));
const bow = (x: number, y: number, s: number, col: string) => at(x, y, s,
  path('M0 0 C-10 -14 -26 -12 -24 0 C-26 12 -10 14 0 0 Z', col, C.ink, 1.6), path('M0 0 C10 -14 26 -12 24 0 C26 12 10 14 0 0 Z', col, C.ink, 1.6),
  path('M-3 2 L-14 26 L-7 24 L-4 30 L3 4 Z', col, C.ink, 1.6), path('M3 2 L14 26 L7 24 L4 30 L-3 4 Z', col, C.ink, 1.6), rect(-4.5, -5, 9, 10, col, 3, C.ink, 1.6));

// ── Paper, photos, pens ──────────────────────────────────────────────
const sheet = (x: number, y: number, w: number, h: number, col: string = C.white, stroke: string = C.ink) => rect(x, y, w, h, col, 1.5, stroke, 1.6);
const textLines = (x: number, y: number, w: number, n: number, gap = 6, col: string = C.grey) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + (i % 3 === 2 ? w * 0.7 : w)} ${y + i * gap}`).join(' '), col, 1.6);
const photo = (x: number, y: number, w: number, h: number, deg: number, sky: string = C.sky) => rot(x, y, deg, rect(-w / 2, -h / 2, w, h, C.white, 1, C.ink, 1.3),
  rect(-w / 2 + 2.5, -h / 2 + 2.5, w - 5, h - 9, sky, 0, null), path(`M${-w / 2 + 2.5} ${h / 2 - 6.5} L${-w / 6} ${-h / 8} L${w / 8} ${h / 2 - 10} L${w / 4} ${-1} L${w / 2 - 2.5} ${h / 2 - 6.5} Z`, C.green, null), circle(w / 4, -h / 4, 2.6, C.yellow, null));
/** Looping handwriting from (x, y), n loops. */
const cursive = (x: number, y: number, n: number, col: string, a = 7, sw = 1.6) => line(`M${x} ${y}` + Array.from({ length: n }, (_, i) => `c1.5 ${-a * (i % 3 === 1 ? 1.5 : 1)} 5 ${-a * (i % 3 === 1 ? 1.5 : 1)} 3.4 0 c-0.8 3 2.6 3 3.4 0`).join(''), col, sw);
/** Dip pen; the nib point is at the origin and the holder points up to the right. */
const dipPen = (x: number, y: number, deg: number, s = 1, grey = false) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
  path('M3 -16 L7 -19 L26 -62 L21 -64 Z', grey ? C.grey : C.brown, C.ink, 1.3), path('M2 -13 L8 -17 L7 -20 L3 -17 Z', grey ? C.grey2 : C.gold, C.ink, 1.1),
  path('M0 0 C-3 -6 -1 -12 2 -15 L7 -18 C8 -12 6 -6 0 0 Z', grey ? C.grey2 : C.silver, C.ink, 1.2), line('M0 0 L3.6 -10', C.ink, 1), circle(4, -11.5, 1.1, C.ink, null));
/** Pointed round brush; the tip is at the origin and the handle points up to the right. */
const brush = (x: number, y: number, deg: number, s = 1, tip: string = C.ink) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
  path('M2 -14 L7 -16 L22 -60 L17 -62 Z', C.tan, C.ink, 1.3), path('M1 -10 L8 -13 L7 -17 L2 -15 Z', C.grey2, C.ink, 1.1), path('M0 0 C-3 -5 -2 -9 1 -11 L8 -13 C7 -8 5 -3 0 0 Z', tip, C.ink, 1.1));
/** Flat paint brush; the bristle edge is centred at the origin and the handle points up. */
const flatBrush = (x: number, y: number, deg: number, col: string, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
  rect(-3, -44, 6, 26, C.tan, 3, C.ink, 1.3), rect(-8, -22, 16, 8, C.grey2, 1, C.ink, 1.3), path('M-8 -14 L8 -14 L9 0 L-9 0 Z', col, C.ink, 1.3));
const pencil = (x: number, y: number, deg: number, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, path('M0 0 L-3 -8 L3 -8 Z', C.beige, C.ink, 1.1), path('M0 0 L-1.2 -3 L1.2 -3 Z', C.ink, null), rect(-3, -44, 6, 36, C.yellow, 1, C.ink, 1.2), rect(-3, -48, 6, 5, C.pink, 1.5, C.ink, 1.1));

// ── Models ───────────────────────────────────────────────────────────
/** Small aeroplane seen from above, nose to the right. */
const plane = (x: number, y: number, s: number, deg: number, col: string, o: { nearWing?: boolean; marks?: boolean } = {}) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`,
  path('M-6 -4 L2 -34 L12 -34 L10 -4 Z', col, C.ink, 1.5), o.nearWing === false ? '' : path('M-6 4 L2 34 L12 34 L10 4 Z', col, C.ink, 1.5),
  path('M-30 -3 L-36 -14 L-29 -14 L-24 -3 Z M-30 3 L-36 14 L-29 14 L-24 3 Z', col, C.ink, 1.3),
  path('M-34 0 C-34 -5 -20 -6 12 -6 C26 -6 36 -3 38 0 C36 3 26 6 12 6 C-20 6 -34 5 -34 0 Z', col, C.ink, 1.6), ellipse(18, 0, 7, 3.4, C.sky, C.ink, 1.1), line('M38 -9 L38 9', C.ink, 2.2),
  o.marks ? star(6, -20, 4, C.white) + star(6, 20, 4, C.white) : '');
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, C.ink, 0.9), path('M0 -24 L-8 -5 L8 -5 Z', C.green, C.ink, 1.1));
const house = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, rect(-8, -11, 16, 11, col, 0, C.ink, 1.1), path('M-10 -11 L0 -20 L10 -11 Z', C.dark, C.ink, 1.1), rect(-2, -7, 4, 7, C.white, 0, C.ink, 0.8));
const sheep = (x: number, y: number, s: number) => at(x, y, s, line('M-8 8 L-8 18 M-2 9 L-2 18 M6 9 L6 18 M11 7 L11 18', C.ink, 2.4),
  path('M-14 0 C-18 -8 -10 -14 -5 -11 C-2 -17 8 -16 9 -10 C16 -11 19 -3 14 2 C17 8 9 12 4 9 C0 13 -8 12 -9 8 C-15 9 -18 4 -14 0 Z', C.white, C.ink, 1.6), ellipse(17, -5, 5, 6.4, C.dark, C.ink, 1.2), circle(18.5, -6.5, 1, C.white, null));
const fleece = (x: number, y: number, s: number, stroke: string) => at(x, y, s, path('M-14 0 C-18 -8 -10 -14 -5 -11 C-2 -17 8 -16 9 -10 C16 -11 19 -3 14 2 C17 8 9 12 4 9 C0 13 -8 12 -9 8 C-15 9 -18 4 -14 0 Z', C.white, stroke, 1.4),
  line('M-8 -3 c2 -4 6 -2 4 1 M2 -6 c2 -4 6 -2 4 1 M-3 4 c2 -4 6 -2 4 1 M7 2 c2 -3 5 -1 3 1', C.grey, 0.8));
const gem = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 1.3), circle(x, y, r * 0.3, C.ink, null), circle(x - r * 0.35, y - r * 0.4, r * 0.2, C.white, null));
/** A star polygon as a path (for stencils and cut-outs). */
const starPath = (cx: number, cy: number, r: number, inner = 0.45, n = 5) => 'M' + Array.from({ length: n * 2 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / n, rr = i % 2 ? r * inner : r; return `${f1(cx + rr * Math.cos(a))} ${f1(cy + rr * Math.sin(a))}`; }).join(' L') + ' Z';

function pappersklipp(): Svg {
  const out: Svg[] = [rect(10, 8, 100, 100, C.navy, 6, C.ink, 1.8), path(starPath(60, 58, 44, 0.62, 8), C.white, C.ink, 1.6)];
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, b = a + Math.PI / 8;
    const p = (r: number, ang: number) => `${f1(60 + r * Math.cos(ang))} ${f1(58 + r * Math.sin(ang))}`;
    out.push(path(`M${p(34, a)} L${p(27, a - 0.12)} L${p(21, a)} L${p(27, a + 0.12)} Z`, C.navy, null));
    out.push(path(`M${p(20, b)} L${p(14, b - 0.2)} L${p(9, b)} L${p(14, b + 0.2)} Z`, C.navy, null));
  }
  out.push(circle(60, 58, 4, C.navy, null), scissors(92, 100, 0.62, -150, C.red), path('M16 100 l5 -3 l1 5 Z M28 104 l4 -4 l2 5 Z', C.white, C.ink, 0.8));
  return all(...out);
}

export const CRAFT_MOTIFS: Record<string, Svg> = {
  // ── 4731 Stickning och virkning ─────────────────────────────────────
  // ull: the fleece itself (orange outline), shorn from the grey sheep
  'craft.ull': all(ground, greyed(sheep(26, 36, 1.15)), arrow(46, 50, 58, 62, C.grey, 2.4), fleece(68, 86, 2.5, HL), fleece(92, 70, 1.3, HL), fleece(40, 96, 1.1, HL)),
  // sticka (att sticka med): a pair of bare needles
  'craft.sticka-noun.2': all(tableTop(100), greyed(ball(98, 92, 11, C.sky)), ndl(26, 100, 80, 16), ndl(92, 100, 40, 16)),
  // rundsticka: two short needle tips joined by a cable
  'craft.rundsticka': all(cord('M44 46 C6 62 18 106 60 106 C102 106 114 62 76 46', C.sky, 2.2), line('M44 46 L74 16', C.ink, 5.4), line('M44 46 L74 16', C.silver, 3.2), line('M76 46 L46 16', C.ink, 5.4), line('M76 46 L46 16', C.silver, 3.2),
    circle(44, 46, 2.6, C.dark, null), circle(76, 46, 2.6, C.dark, null)),
  // ögla: a cord with one loop (orange)
  'craft.ögla': all(cord('M8 94 C34 94 54 88 62 72', C.grey2, 4), cord('M62 80 C76 90 96 90 112 86', C.grey2, 4), cord('M62 72 C80 34 38 22 42 52 C44 64 52 74 62 80', HL, 4)),
  // maska: one stitch (orange) on the needle, the knitted cloth below
  'craft.maska-noun': all(line('M22 62 L22 108 M38 62 L38 108 M54 62 L54 108 M70 62 L70 108 M86 62 L86 108', C.sky, 9), line(Array.from({ length: 15 }, (_, i) => { const x = 22 + (i % 5) * 16, y = 66 + Math.floor(i / 5) * 15; return `M${x - 6} ${y - 5} L${x} ${y + 5} L${x + 6} ${y - 5}`; }).join(' '), C.denim2, 2.6),
    loop(22, 44, C.sky, 6, 11), loop(38, 44, C.sky, 6, 11), loop(54, 44, HL, 6, 11), loop(70, 44, C.sky, 6, 11), loop(86, 44, C.sky, 6, 11), ndl(6, 36, 112, 36)),
  // lägga upp maskor: the first loops come onto the empty needle one by one
  'craft.lägga-upp-maskor': all(ball(92, 94, 14, C.pink), line('M78 60 C84 70 80 78 86 82', C.pink, 2.4), ndl(8, 50, 112, 50),
    appear('lum1', 4, loop(30, 53, C.pink, 4.4, 8)), appear('lum2', 20, loop(42, 53, C.pink, 4.4, 8)), appear('lum3', 36, loop(54, 53, C.pink, 4.4, 8)), appear('lum4', 52, loop(66, 53, C.pink, 4.4, 8)), appear('lum5', 68, loop(78, 53, C.pink, 4.4, 8)),
    arrow(20, 28, 34, 40, HL, 2.6)),
  // stickning: work in progress – a half-made piece on the needles, the yarn runs to the ball
  'craft.stickning': all(line('M84 70 C100 74 92 86 98 92', C.yellow, 2.4), ball(98, 98, 11, C.yellow), knit(32, 46, 54, 46, C.yellow, C.orange), ...[38, 46, 54, 62, 70, 78].map((x) => loop(x, 44, C.yellow, 3.4, 5.4)), ndl(16, 42, 106, 42), ndl(52, 70, 102, 14)),
  // repa upp: the yarn is pulled and the top rows are gone
  'craft.repa-upp': all(rect(14, 34, 56, 22, 'none', 2, C.grey, 1.4), line('M14 41 L70 41 M14 48 L70 48', C.grey2, 1, '2 3'), knit(14, 56, 56, 48, C.green, C.dark),
    line('M18 56 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0', C.green, 2.2),
    moving('repa', '0%{transform:translate(-14px,14px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, line('M68 54 q3 -7 7 -2 q4 4 6 -5 q3 -8 7 -3 q4 4 6 -6 q2 -6 6 -6', C.green, 2.4), hand(104, 26, 1.1, -30)), arrow(80, 78, 100, 56, HL, 2.8)),
  // maska av: the finished edge closes link by link; the last loops leave the needle
  'craft.maska-av': all(knit(14, 56, 66, 48, C.lilac, C.purple), ...[20, 31, 42, 53, 64].map((x, i) => appear(`mav${i}`, 4 + i * 16, ellipse(x + 3, 54, 6.4, 3.4, HL, C.ink, 1.4))),
    loop(76, 50, C.lilac, 3.6, 6), ndl(68, 48, 114, 40), line('M80 104 C90 100 96 104 104 98', C.lilac, 2.2), scissors(98, 86, 0.6, 60, C.red)),
  // luftmaska: the chain of loops that hangs from the crochet hook
  'craft.luftmaska': all(greyed(ball(20, 98, 12, C.sky)), line('M22 88 C24 80 22 76 26 72', C.grey, 2),
    ...Array.from({ length: 7 }, (_, i) => rot(28 + i * 8.6, 70 - i * 4.4, -27, ellipse(0, 0, 6.4, 3.6, 'none', C.ink, 4.4), ellipse(0, 0, 6.4, 3.6, 'none', HL, 2.4))), hook(86, 36, 38, 1.15)),
  // mormorsruta: a crocheted square in rings of different colours with small holes
  'craft.mormorsruta': all(...([[76, C.green], [58, C.yellow], [40, C.pink], [22, C.sky]] as [number, string][]).map(([w, col]) => all(rect(60 - w / 2, 60 - w / 2, w, w, col, 5, C.ink, 1.6),
    line(Array.from({ length: Math.floor(w / 9) }, (_, i) => { const p = 60 - w / 2 + 5 + i * 9; return `M${p} ${60 - w / 2 + 2} l0 5 M${p + 2.5} ${60 - w / 2 + 2} l0 5 M${p} ${60 + w / 2 - 7} l0 5 M${p + 2.5} ${60 + w / 2 - 7} l0 5 M${60 - w / 2 + 2} ${p} l5 0 M${60 - w / 2 + 2} ${p + 2.5} l5 0 M${60 + w / 2 - 7} ${p} l5 0 M${60 + w / 2 - 7} ${p + 2.5} l5 0`; }).join(' '), C.ink, 0.7),
    ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => circle(60 + a! * (w / 2 - 4.5), 60 + b! * (w / 2 - 4.5), 1.8, C.paper, C.ink, 0.8)))), circle(60, 60, 3, C.paper, C.ink, 1)),
  // handarbete: a basket with knitting, crochet and embroidery
  'craft.handarbete': all(ground, ndl(40, 76, 22, 26), ndl(52, 76, 62, 22), hook(36, 34, -8, 0.9), ball(34, 72, 12, C.red), ball(56, 70, 12, C.sky), ball(46, 80, 11, C.yellow),
    path('M16 78 L76 78 L70 110 L22 110 Z', C.tan, C.ink, 1.8), line('M19 88 L73 88 M21 98 L71 98 M30 78 L32 110 M46 78 L46 110 M62 78 L60 110', C.brown, 1.2),
    circle(92, 76, 21, C.white, C.ink, 1.6), circle(92, 76, 21, 'none', C.brown, 4), rect(88, 51, 8, 6, C.gold, 1.5, C.ink, 1.1), circle(90, 76, 4, C.red, C.ink, 0.9), line('M90 80 L90 90 M90 85 q-5 -1 -6 -5 M90 86 q5 -1 6 -5', C.green, 1.8), sewNeedle(104, 62, 30, 22), line('M94 74 C100 70 100 66 104 62', C.red, 1.2)),

  // ── 4732 Sömnad ─────────────────────────────────────────────────────
  // sömnad (symbol): the whole hobby in three frames – cloth with pattern and scissors, needle and thread that join
  // two pieces, the finished garment on a hanger
  'craft.sömnad': all(rect(4, 6, 52, 48, C.white, 5, C.ink, 1.6), rect(64, 6, 52, 48, C.white, 5, C.ink, 1.6), rect(26, 62, 68, 54, C.white, 5, C.ink, 1.6),
    rect(8, 12, 44, 36, C.denim, 2, C.ink, 1.3), path('M13 17 L24 15 C27 19 31 19 34 15 L38 18 L35 26 L35 43 L13 43 Z', '#f3e6c8', C.ink, 1.2), line('M16 20 L24 18 C27 22 31 22 34 19 M32 27 L32 40 L16 40 L16 20', C.grey, 0.9, '2 2'), scissors(40, 38, 0.5, -120, C.red),
    arrow(57, 30, 63, 30, C.grey, 2),
    path('M68 20 L90 20 L90 46 L68 46 Z', C.denim, C.ink, 1.3), path('M90 24 L112 24 L112 50 L90 50 Z', C.denim2, C.ink, 1.3), line('M90 26 L90 42', HL, 2.4, '3 2.5'), line('M109 13 C104 6 94 10 91 24', HL, 1.3), sewNeedle(109, 12, 42, 26),
    arrow(88, 55, 76, 61, C.grey, 2),
    path('M60 72 C60 67 66 67 66 71 C66 74 60 74 60 78', 'none', C.ink, 1.8), path('M60 78 L38 88 L82 88 Z', 'none', C.brown, 2.6),
    path('M48 84 Q60 92 72 84 L86 92 L82 102 L74 98 L74 112 L46 112 L46 98 L38 102 L34 92 Z', C.denim, C.ink, 1.6), line('M60 90 L60 112', C.denim2, 1.2), circle(60, 96, 1.4, C.white, C.ink, 0.7), circle(60, 103, 1.4, C.white, C.ink, 0.7), sparkle(88, 70, 4)),
  // tyg: bolts of cloth with different patterns, one length hanging down
  'craft.tyg': all(rect(18, 12, 84, 20, C.red, 9, C.ink, 1.8), ...[30, 44, 58, 72, 86].map((x) => circle(x, 22, 2.4, C.white, null)), ellipse(98, 22, 4, 8, C.rose, C.ink, 1.2),
    rect(14, 36, 84, 20, C.denim, 9, C.ink, 1.8), line('M26 37 L26 55 M38 37 L38 55 M50 37 L50 55 M62 37 L62 55 M74 37 L74 55', C.white, 1.8), ellipse(94, 46, 4, 8, C.sky, C.ink, 1.2),
    path('M22 74 C22 92 36 96 38 110 L96 110 C92 98 102 90 98 74 Z', C.green, C.ink, 1.8), line('M40 80 C42 92 52 98 54 108 M64 80 C62 92 72 96 74 108', C.dark, 1.2), rect(18, 60, 84, 20, C.green, 9, C.ink, 1.8), ellipse(98, 70, 4, 8, C.mint, C.ink, 1.2)),
  // mönster (för att sy): paper pattern pieces with dashed seam lines and arrows, laid out on the cloth
  'craft.mönster.3': all(rect(6, 12, 108, 98, C.sky, 6, C.ink, 1.6), ...[[18, 24], [100, 22], [60, 100], [104, 96], [16, 98]].map(([x, y]) => circle(x!, y!, 2.2, C.white, null)),
    path('M18 26 L36 22 C40 30 50 30 54 22 L66 28 L60 44 C54 48 54 56 58 62 L58 98 L20 98 Z', '#f3e6c8', C.ink, 1.6), path('M22 30 L34 27 C40 35 50 35 55 27 L61 30 L56 42 C50 48 50 58 54 64 L54 94 L24 94 Z', 'none', C.grey, 1.1), line('M38 50 L38 84 M35 54 L38 50 L41 54 M35 80 L38 84 L41 80', C.ink, 1.3), path('M20 60 l-4 3 l4 3 Z', C.ink, null),
    path('M70 40 C78 30 96 30 104 40 L100 86 L74 86 Z', '#f3e6c8', C.ink, 1.6), path('M74 42 C80 35 94 35 100 42 L96.5 82 L77.5 82 Z', 'none', C.grey, 1.1), line('M87 50 L87 74 M84 54 L87 50 L90 54 M84 70 L87 74 L90 70', C.ink, 1.3), pin(30, 38, -70, C.red, 12), pin(92, 46, 70, C.yellow, 12)),
  // klippa till: the scissors cut the cloth along the pinned pattern piece
  'craft.klippa-till': all(rect(6, 14, 108, 96, C.pink, 6, C.ink, 1.6), path('M20 30 L60 30 L60 96 L20 96 Z', '#f3e6c8', C.ink, 1.4), line('M26 36 L54 36 L54 90 L26 90 Z', C.grey, 1, '3 3'), pin(30, 44, -70, C.yellow, 12), pin(30, 80, -70, C.yellow, 12),
    line('M64 60 L64 22', C.ink, 1.6, '4 3'), path('M62 110 L62 76 L66 76 L66 110 Z', C.paper, null), line('M62 110 L62 76 M66 110 L66 76', C.ink, 1.2),
    moving('klt', '0%{transform:translate(0,26px)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, scissors(64, 82, 1.05, -90, C.denim)), arrow(92, 84, 92, 50, HL, 2.6)),
  // nåla: pins hold two layers of cloth together; one more pin goes in
  'craft.nåla': all(rect(10, 44, 96, 62, C.sky, 4, C.ink, 1.6), rect(18, 36, 96, 62, C.yellow, 4, C.ink, 1.6), line('M18 46 L114 46', C.orange, 1.2, '3 3'), pin(34, 40, -20, C.red, 16), pin(52, 40, -20, C.red, 16), pin(70, 40, -20, C.red, 16),
    moving('nala', '0%{transform:translate(8px,-20px)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, pin(88, 40, -20, HL, 16), hand(96, 26, 1.1, 150))),
  // trä (en nål): the thread goes through the eye of the needle
  'craft.trä-verb': all(path('M50 14 Q60 2 70 14 L64 112 L56 112 Z', C.silver, C.ink, 1.8), ellipse(60, 34, 3.6, 13, C.paper, C.ink, 1.4), line('M6 78 C28 66 44 40 60 34', HL, 2.6),
    moving('tra', '0%{transform:translate(-48px,12px);opacity:0}15%{opacity:1}70%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, line('M60 34 C76 30 92 36 112 26', HL, 2.6)), line('M63.2 26 L63.4 42', C.ink, 1.4), hand(14, 82, 1.1, -30)),
  // trådrulle: a spool of sewing thread with a loose end
  'craft.trådrulle': all(tableTop(100), greyed(rect(82, 62, 20, 30, C.green, 2, C.ink, 1.4), ellipse(92, 62, 13, 4, C.tan, C.ink, 1.3), ellipse(92, 92, 13, 4, C.tan, C.ink, 1.3)),
    rect(30, 34, 36, 54, C.red, 2, C.ink, 1.8), line(Array.from({ length: 9 }, (_, i) => `M30 ${39 + i * 6} L66 ${39 + i * 6}`).join(' '), '#a83232', 1.1), ellipse(48, 88, 24, 7, C.tan, C.ink, 1.8), ellipse(48, 34, 24, 7, C.tan, C.ink, 1.8), ellipse(48, 34, 6, 2.2, C.dark, null),
    line('M66 60 C80 56 76 76 90 72 C102 68 98 50 108 48', C.red, 1.8)),
  // nåldyna: a small cushion full of pins and needles
  'craft.nåldyna': all(tableTop(100), ellipse(60, 80, 40, 24, C.red, C.ink, 1.8), line('M60 56 C52 70 52 90 60 104 M60 56 C68 70 68 90 60 104 M22 78 C40 70 80 70 98 78', '#a83232', 1.4), path('M52 58 L60 50 L68 58 L60 56 Z', C.green, C.ink, 1.2),
    pin(36, 44, -24, C.yellow, 22), pin(50, 34, -8, C.white, 24), pin(84, 44, 26, C.sky, 22), pin(72, 36, 12, C.green, 22), sewNeedle(62, 22, 2, 38), line('M62 24 C70 14 80 18 78 28', C.denim, 1.3)),
  // raksöm: a straight row of stitches across the middle of the cloth
  'craft.raksöm': all(rect(8, 44, 104, 60, C.mint, 4, C.ink, 1.6), line('M14 74 L86 74', HL, 3, '7 4'), machine(90, 74)),
  // sicksack (söm): a zigzag row of stitches along the fraying edge
  'craft.sicksack.2': all(rect(8, 56, 104, 50, C.lilac, 2, C.ink, 1.6), line('M12 56 l-1 -6 M22 56 l1 -7 M34 56 l-2 -5 M46 56 l1 -7 M58 56 l-1 -6 M70 56 l2 -6 M100 56 l1 -6 M108 56 l-1 -5', C.purple, 1.2),
    line('M12 70 ' + Array.from({ length: 9 }, (_, i) => `L${17 + i * 8} ${i % 2 ? 70 : 59}`).join(' '), HL, 2.6), machine(86, 64)),

  // ── 4733 Scrapbooking ───────────────────────────────────────────────
  // scrapbooking: an album spread with mounted photos, a ticket, tape and stickers
  'craft.scrapbooking': all(rect(4, 12, 112, 84, C.brown, 4, C.ink, 1.8), rect(8, 16, 51, 76, '#f3e6c8', 2, C.ink, 1.3), rect(61, 16, 51, 76, '#f3e6c8', 2, C.ink, 1.3), rect(8, 70, 51, 12, C.mint, 0, null), ...[14, 24, 34, 44, 54].map((x) => circle(x, 76, 2, C.white, null)),
    photo(33, 42, 36, 30, -6), rect(14, 28, 10, 4, C.pink, 0, C.ink, 0.7), rect(44, 52, 10, 4, C.pink, 0, C.ink, 0.7), heart(50, 26, 4),
    photo(80, 34, 26, 22, 8, C.yellow), photo(96, 66, 24, 22, -8, C.rose), rect(66, 60, 20, 11, C.yellow, 1, C.ink, 1), line('M72 60 L72 71', C.ink, 0.8, '1.5 1.5'), star(74, 84, 5), cursive(84, 86, 3, C.ink, 4, 1),
    scissors(26, 106, 0.55, 0, C.red), rect(70, 100, 26, 9, C.red, 2, C.ink, 1.2), rect(92, 100, 9, 9, C.white, 2, C.ink, 1.2)),
  // klippa ut (med sax): the shape is cut out of the paper and comes away
  'craft.klippa-ut.2': all(sheet(10, 22, 70, 84, C.yellow), heart(44, 62, 15, C.paper), moving('kut', '0%{transform:translate(-48px,28px)}65%,100%{transform:translate(0,0)}', { dur: 2.8 }, rot(92, 34, 14, heart(0, 0, 14, C.yellow))),
    scissors(66, 98, 0.9, -140, C.denim), arrow(62, 54, 80, 42, HL, 2.6)),
  // urklipp: the article that has been cut out of the newspaper
  'craft.urklipp': all(greyed(sheet(6, 14, 64, 92), rect(12, 20, 40, 6, C.dark, 1, null), textLines(12, 34, 22, 10), textLines(40, 76, 24, 4), scissors(22, 108, 0.5, -10, C.red)), rect(38, 30, 28, 40, C.paper, 0, C.ink, 1.1), line('M38 30 L66 30 L66 70 L38 70 Z', C.ink, 1, '3 2'),
    rot(84, 66, 9, rect(-25, -34, 50, 68, C.white, 1, HL, 2.4), rect(-20, -29, 40, 7, C.dark, 1, null), rect(-20, -17, 18, 16, C.sky, 0, C.ink, 0.9), path('M-20 -1 L-12 -10 L-7 -5 L-2 -1 Z', C.green, null), textLines(3, -15, 16, 3, 5), textLines(-20, 6, 40, 5, 5))),
  // kartong (material): thick sheets of coloured card – the edge shows how thick they are
  'craft.kartong.2': all(tableTop(100), ...([[C.tan, 0], [C.red, 1], [C.denim, 2]] as [string, number][]).map(([col, i]) => g(`translate(${10 + i * 6} ${72 - i * 22})`, path('M0 0 L70 -14 L92 4 L22 18 Z', col, C.ink, 1.6), path('M0 0 L22 18 L22 23 L0 5 Z', C.dark, C.ink, 1.2), path('M22 18 L92 4 L92 9 L22 23 Z', C.grey2, C.ink, 1.2))),
    g('translate(86 84)', circle(0, 0, 17, C.white, C.ink, 1.6), path('M-13 -5 L13 -5 L13 5 L-13 5 Z', C.tan, C.ink, 1.3), line('M-13 -1.5 L13 -1.5 M-13 2 L13 2', C.brown, 0.8), line('M12 13 L20 22', C.ink, 3))),
  // limstift: glue in the shape of a stick, with the cap off
  'craft.limstift': all(sheet(8, 70, 104, 40, C.sky), line('M22 96 C40 84 54 98 70 88', C.white, 6), rot(74, 84, 28, rect(-11, -54, 22, 42, C.red, 2, C.ink, 1.8), rect(-11, -50, 22, 8, C.yellow, 0, C.ink, 1.1), rect(-12, -14, 24, 6, C.dark, 1, C.ink, 1.2), rect(-9, -8, 18, 9, C.white, 2, C.ink, 1.4)),
    rot(24, 50, -20, rect(-12, -12, 24, 22, C.red, 3, C.ink, 1.6), ellipse(0, 10, 12, 3.6, C.dark, C.ink, 1.2))),
  // klistermärke: a sheet of stickers, one is being peeled off
  'craft.klistermärke': all(sheet(10, 14, 66, 94), star(28, 32, 10), heart(56, 32, 8), circle(28, 62, 9, C.green, C.ink, 1.4), circle(25, 60, 1.2, C.ink, null), circle(31, 60, 1.2, C.ink, null), line('M24 65 Q28 68 32 65', C.ink, 1.2),
    line(starPath(56, 62, 10), C.grey, 1.2, '2 2'), circle(28, 90, 8, C.pink, C.ink, 1.4), ...[0, 72, 144, 216, 288].map((a) => rot(56, 90, a, ellipse(0, -6, 3, 4, C.sky, C.ink, 0.9))), circle(56, 90, 2.6, C.yellow, C.ink, 0.8),
    rot(94, 44, 16, path(starPath(0, 0, 15), C.yellow, HL, 2.2), path('M-8.8 12.1 L0 6.8 L-3 14 Z', C.white, C.ink, 1)), hand(102, 66, 1.1, -110)),
  // washitejp: rolls of patterned paper tape, a strip holds the corner of a photo
  'craft.washitejp': all(photo(40, 36, 44, 36, -8), rot(22, 22, -40, rect(-12, -4.5, 24, 9, C.pink, 0, C.ink, 1), circle(-6, 0, 1.6, C.white, null), circle(0, 0, 1.6, C.white, null), circle(6, 0, 1.6, C.white, null)),
    circle(34, 86, 19, C.pink, C.ink, 1.8), ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => rot(34, 86, a, circle(0, -14, 1.8, C.white, null))), circle(34, 86, 9, C.paper, C.ink, 1.6),
    circle(78, 82, 21, C.mint, C.ink, 1.8), ...[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => rot(78, 82, a, line('M0 -11 L0 -20', C.green, 2))), circle(78, 82, 10, C.paper, C.ink, 1.6),
    path('M92 66 L112 50 L116 56 L113 58 L115 61 L98 74 Z', C.mint, C.ink, 1.3), line('M99 64 L103 70 M105 59 L109 65', C.green, 2)),
  // stämpel (redskap): the stamp with its ink pad
  'craft.stämpel': all(tableTop(98), rect(60, 80, 52, 16, C.dark, 3, C.ink, 1.6), rect(64, 82, 44, 9, C.denim, 2, C.ink, 1.1), path('M60 80 L66 58 L118 58 L112 80 Z', C.grey2, C.ink, 1.4),
    circle(34, 30, 13, C.brown, C.ink, 1.8), path('M27 40 L41 40 L44 62 L24 62 Z', C.brown, C.ink, 1.8), rect(14, 62, 40, 16, C.tan, 3, C.ink, 1.8), rect(16, 78, 36, 7, C.dark, 1, C.ink, 1.3), greyed(star(34, 104, 6, C.denim))),
  // stämpla: a hand presses the stamp onto the paper, print after print
  'craft.stämpla': all(sheet(6, 84, 108, 26), star(22, 97, 7, C.denim), star(46, 97, 7, C.denim), star(70, 97, 7, C.denim),
    moving('stmp', '0%,100%{transform:translate(0,-22px)}45%,65%{transform:translate(0,0)}', { dur: 2 }, circle(94, 42, 10, C.brown, C.ink, 1.6), path('M89 50 L99 50 L101 70 L87 70 Z', C.brown, C.ink, 1.6), rect(80, 70, 28, 13, C.tan, 3, C.ink, 1.6), rect(82, 83, 24, 5, C.dark, 1, C.ink, 1.1), hand(96, 52, 1.5, 180)),
    arrow(66, 44, 66, 70, HL, 2.8)),
  // band (remsa): a ribbon tied in a bow, from a reel
  'craft.band.2': all(tableTop(100), circle(26, 78, 18, C.grey2, C.ink, 1.6), circle(26, 78, 13, C.red, C.ink, 1.3), circle(26, 78, 5, C.paper, C.ink, 1.3), path('M38 88 C52 98 62 78 74 88 C86 98 96 84 110 92 L110 99 C96 91 86 105 74 95 C62 85 52 105 36 94 Z', C.red, C.ink, 1.5), bow(70, 40, 1.4, C.red)),
  // pyssel: children's craft – a paper chain, a figure made of a cardboard tube, scissors, glue and paper bits
  'craft.pyssel': all(tableTop(98), ...[C.red, C.yellow, C.green, C.sky, C.pink, C.orange].map((col, i) => all(ellipse(16 + i * 17.6, 18 + (i % 2) * 3, 11, 6.5, 'none', C.ink, 5), ellipse(16 + i * 17.6, 18 + (i % 2) * 3, 11, 6.5, 'none', col, 3))),
    rect(22, 46, 28, 50, C.tan, 4, C.ink, 1.8), path('M22 50 L28 38 L34 48 L38 48 L44 38 L50 50 Z', C.tan, C.ink, 1.6), circle(30, 60, 6, C.white, C.ink, 1.3), circle(42, 60, 6, C.white, C.ink, 1.3), circle(31, 61, 2.2, C.ink, null), circle(41, 61, 2.2, C.ink, null), path('M33 68 L39 68 L36 74 Z', C.orange, C.ink, 1.1),
    path('M22 72 C12 76 14 90 22 90 Z', C.sky, C.ink, 1.3), path('M50 72 C60 76 58 90 50 90 Z', C.sky, C.ink, 1.3),
    path('M70 96 L72 62 L84 62 L86 96 Z', C.white, C.ink, 1.6), path('M73 62 L78 46 L83 62 Z', C.orange, C.ink, 1.4), scissors(102, 78, 0.55, 80, C.green),
    path('M58 104 l5 -3 l1 5 Z', C.red, C.ink, 0.8), rect(94, 102, 6, 5, C.yellow, 0, C.ink, 0.8), circle(12, 106, 3, C.green, C.ink, 0.8)),

  // ── 4734 Smyckestillverkning ────────────────────────────────────────
  // pärla (kula): beads with a hole, loose in a tray and on a thread
  'craft.pärla.2': all(line('M8 30 L112 22', C.ink, 1.4), gem(30, 28, 8, C.red), gem(48, 27, 8, C.yellow), gem(66, 25, 8, C.sky), gem(84, 24, 8, C.green), ellipse(60, 82, 52, 26, C.beige, C.ink, 1.8), ellipse(60, 80, 44, 20, C.white, C.ink, 1.2),
    gem(34, 78, 8, C.purple), gem(52, 70, 8, C.orange), gem(70, 76, 8, C.pink), gem(86, 82, 8, C.denim), gem(48, 88, 8, C.green), gem(66, 92, 8, C.red), gem(30, 92, 5, C.yellow), gem(84, 68, 5, C.sky)),
  // berlock: the small charms (gold) that hang from the grey bracelet
  'craft.berlock': all(line('M10 30 Q60 96 110 30', C.ink, 6), line('M10 30 Q60 96 110 30', C.grey2, 3.4), line('M10 30 Q60 96 110 30', C.ink, 1, '2 5'),
    line('M32 53 L32 62 M60 64 L60 74 M88 53 L88 62', C.ink, 1.6), circle(32, 63, 2.4, 'none', C.ink, 1.4), circle(60, 75, 2.4, 'none', C.ink, 1.4), circle(88, 63, 2.4, 'none', C.ink, 1.4),
    heart(32, 76, 9, C.gold), star(60, 90, 11, C.gold), g('translate(88 66)', circle(0, 6, 5.6, C.gold, C.ink, 1.5), circle(0, 6, 2, C.paper, C.ink, 1), path('M-1.6 11 L1.6 11 L1.6 28 L6 28 L6 31 L1.6 31 L1.6 34 L-1.6 34 Z', C.gold, C.ink, 1.3)), sparkle(104, 82, 5), sparkle(16, 84, 4)),
  // silvertråd: a coil of thin silver wire with a free end
  'craft.silvertråd': all(tableTop(100), ...[0, 1, 2, 3, 4].map((i) => all(ellipse(52, 86 - i * 6, 30, 10, 'none', C.ink, 4.4), ellipse(52, 86 - i * 6, 30, 10, 'none', C.silver, 2.4))),
    cord('M82 62 C96 54 84 34 98 26 C106 22 110 30 104 34', C.silver, 2.4), sparkle(28, 46, 6, C.white), sparkle(96, 52, 5, C.white), sparkle(66, 40, 4, C.white)),
  // silversmide: making things of silver – a flame on a ring, a hammer and a file on the bench
  'craft.silversmide': all(tableTop(92, C.tan), rect(34, 74, 44, 18, C.dark, 2, C.ink, 1.6), ellipse(56, 68, 13, 7, 'none', C.ink, 6), ellipse(56, 68, 13, 7, 'none', C.silver, 3.6), sparkle(70, 58, 4, C.white),
    rect(88, 20, 16, 34, C.denim, 4, C.ink, 1.6), path('M88 30 L76 40 L80 46 L90 40 Z', C.grey2, C.ink, 1.3), waPulse('ssfl', path('M78 44 C70 48 62 54 58 62 C66 60 72 56 82 48 Z', C.orange, C.ink, 1.1), path('M77 46 C72 49 68 53 65 57 C70 55 74 52 79 48 Z', C.yellow, null)),
    rot(20, 60, -24, rect(-2.5, -8, 5, 44, C.brown, 2, C.ink, 1.3), rect(-10, -18, 20, 11, C.grey, 2, C.ink, 1.4)), rect(8, 100, 44, 5, C.grey, 1, C.ink, 1.1), rect(52, 99, 16, 7, C.brown, 2, C.ink, 1.1),
    rect(84, 98, 26, 8, C.silver, 1, C.ink, 1.2)),
  // hamra: the hammer comes down again and again on the silver band
  'craft.hamra': all(ground, path('M22 84 L98 84 L90 96 L76 96 L80 112 L40 112 L44 96 L30 96 Z', C.dark, C.ink, 1.8), rect(30, 78, 60, 6, C.silver, 2, C.ink, 1.4),
    moving('hamr', '0%,100%{transform:translate(10px,-20px)}40%,55%{transform:translate(0,0)}', { dur: 1.5 }, rot(62, 62, 30, rect(-3, -6, 6, 56, C.brown, 3, C.ink, 1.5), rect(-13, -18, 26, 14, C.grey, 3, C.ink, 1.6)), hand(92, 34, 1.3, 150)),
    waPulse('hamrs', line('M40 70 L34 62 M48 66 L46 56 M30 76 L20 72', HL, 2.4))),
  // gravera: a sharp tool cuts a pattern into the metal
  'craft.gravera': all(rect(6, 46, 108, 58, C.silver, 8, C.ink, 1.8), line('M14 54 L60 54', C.white, 2), path('M30 84 C22 74 28 66 36 72 C44 66 50 74 42 84 L36 90 Z', 'none', C.dark, 2.2), line('M48 80 C56 70 62 88 70 78 C74 73 78 74 80 76', C.dark, 2.2),
    moving('grav', '0%{transform:translate(-30px,6px)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, rot(80, 76, 52, path('M0 0 L-2.4 -8 L-2.4 -34 L2.4 -34 L2.4 -8 Z', C.grey, C.ink, 1.3), path('M-9 -34 C-9 -46 9 -46 9 -34 Z', C.brown, C.ink, 1.5)), hand(104, 44, 1.2, 140)),
    line('M82 80 q3 2 2 5 M86 76 q4 0 5 3', C.dark, 1.2)),

  // ── 4735 Modellbygge ────────────────────────────────────────────────
  // modellbygge: an aeroplane half built – one wing still loose, parts on their frame, glue and tweezers
  'craft.modellbygge': all(rect(2, 6, 116, 108, C.beige, 6, C.ink, 1.6), rect(8, 12, 46, 36, 'none', 1, C.grey, 2.4), line('M20 12 L20 22 M36 48 L36 38 M8 30 L18 30 M54 28 L44 28', C.grey, 2), path('M14 20 L26 20 L24 26 L16 26 Z', C.grey2, C.ink, 1), circle(40, 22, 4, C.grey2, C.ink, 1), rect(24, 34, 16, 5, C.grey2, 1, C.ink, 1), rect(42, 30, 6, 10, C.grey2, 1, C.ink, 1),
    plane(52, 72, 1.1, -8, C.grey2, { nearWing: false }), rot(86, 98, -14, path('M-4 -14 L6 -14 L4 14 L-10 14 Z', C.grey2, C.ink, 1.5)), arrow(84, 92, 70, 84, HL, 2.4),
    rot(92, 30, 30, rect(-6, -16, 12, 30, C.yellow, 3, C.ink, 1.5), path('M-3 -16 L3 -16 L1 -26 L-1 -26 Z', C.white, C.ink, 1.2), rect(-6, 10, 12, 5, C.red, 1, C.ink, 1)), line('M20 100 L44 108 M20 104 L44 108', C.ink, 2)),
  // modellflygplan: the finished little aeroplane on its stand, as small as a hand
  'craft.modellflygplan': all(rect(4, 96, 112, 8, C.brown, 2, C.ink, 1.6), ellipse(52, 94, 22, 5, C.dark, C.ink, 1.4), line('M52 92 L52 62', C.ink, 3.4), plane(52, 50, 1.05, -14, C.green, { marks: true }), greyed(rect(86, 62, 8, 34, C.red, 1, C.ink, 1.2), rect(95, 56, 9, 40, C.denim, 1, C.ink, 1.2), rect(105, 66, 7, 30, C.yellow, 1, C.ink, 1.2))),
  // skärmatta: a green mat with a grid that protects the table when you cut
  'craft.skärmatta': all(rect(2, 14, 116, 100, C.tan, 6, C.ink, 1.6), rect(10, 26, 100, 76, '#3e8f6a', 5, C.ink, 1.8), line(Array.from({ length: 9 }, (_, i) => `M${20 + i * 10} 30 L${20 + i * 10} 98`).join(' ') + Array.from({ length: 6 }, (_, i) => `M14 ${38 + i * 10} L106 ${38 + i * 10}`).join(' '), '#8fd0ae', 0.9),
    rot(54, 62, -12, rect(-22, -16, 44, 32, C.white, 1, C.ink, 1.3), line('M-6 -16 L-6 16', C.ink, 1, '3 2')), greyed(rot(88, 80, 28, rect(-3, -30, 6, 34, C.grey, 2, C.ink, 1.2), path('M-3 4 L3 4 L0 14 Z', C.silver, C.ink, 1)))),
  // hobbykniv: a small knife like a pen, with a narrow pointed blade
  'craft.hobbykniv': all(sheet(8, 78, 104, 30, C.yellow), line('M20 96 L62 88', C.ink, 1.6), path('M20 96 L62 88 L60 84 Z', C.paper, C.ink, 1),
    g('translate(62 88) rotate(42) scale(0.7)', path('M0 0 L-4.5 -16 L4.5 -22 Z', C.silver, C.ink, 1.4), line('M0 0 L3.4 -18', C.ink, 0.9), rect(-4.6, -34, 9.2, 14, C.dark, 1, C.ink, 1.3), line('M-4.6 -30 L4.6 -30 M-4.6 -26 L4.6 -26', C.grey, 1), rect(-4.2, -86, 8.4, 52, C.grey2, 3, C.ink, 1.5))),
  // måla (stryka färg): a brush puts red paint on the boards
  'craft.måla.1': all(ground, ...[10, 34, 58, 82].map((x, i) => rect(x, 14, 22, 96, i < 2 ? C.red : C.tan, 2, C.ink, 1.6)), rect(58, 14, 22, 50, C.red, 2, C.ink, 1.6), line('M88 30 L88 100 M96 22 L96 90 M66 70 L66 104 M72 68 L72 100', C.brown, 0.9),
    moving('mala', '0%,100%{transform:translate(0,-34px)}50%{transform:translate(0,0)}', { dur: 2.4 }, flatBrush(69, 64, 152, C.red, 1.1), hand(92, 26, 1.2, 150)),
    rect(90, 92, 24, 20, C.grey2, 2, C.ink, 1.5), ellipse(102, 92, 12, 3.6, C.red, C.ink, 1.3)),
  // grundfärg (första lager): the grey first coat between the bare wood and the red top coat
  'craft.grundfärg.2': all(rect(6, 48, 108, 34, C.tan, 2, C.ink, 1.6), line('M10 56 L34 56 M10 66 L30 66 M12 74 L36 74', C.brown, 0.9), rect(40, 46, 74, 34, C.grey2, 2, HL, 2.6), rect(80, 44, 34, 34, C.red, 2, C.ink, 1.6),
    T(60, 68, '1', 16, C.ink), T(97, 66, '2', 16, C.white), rect(14, 88, 24, 22, C.grey2, 2, C.ink, 1.5), ellipse(26, 88, 12, 3.6, C.grey, C.ink, 1.3), flatBrush(60, 46, 20, C.grey, 0.9), line('M38 100 L112 100', C.grey2, 2)),
  // dekal: small marks and digits on a sheet; one of them is moved onto the wing with tweezers
  'craft.dekal': all(sheet(6, 10, 60, 56, '#cfe6f3'), star(20, 24, 7, C.red), T(42, 30, '7', 15, C.ink), circle(22, 48, 7, C.denim, C.ink, 1.2), circle(22, 48, 3, C.white, null), rect(36, 42, 22, 4, C.red, 0, C.ink, 0.8), rect(36, 50, 22, 4, C.ink, 0, null), line(starPath(48, 60, 5), C.grey, 1, '2 2'),
    path('M30 112 L52 74 L112 74 L112 112 Z', C.grey2, C.ink, 1.6), star(84, 92, 9, C.red), line('M84 78 L98 54 M90 80 L100 56', C.ink, 2.4), arrow(64, 56, 76, 76, HL, 2.4),
    ellipse(20, 96, 16, 8, C.sky, C.ink, 1.5), ellipse(20, 94, 11, 4.4, '#cfe6f3', C.ink, 0.9)),
  // modelljärnväg: a small railway on a table – track, train, house and trees
  'craft.modelljärnväg': all(line('M16 84 L16 112 M104 84 L104 112', C.brown, 4), rect(4, 22, 112, 64, C.green, 6, C.ink, 1.8), ellipse(60, 54, 46, 24, 'none', C.ink, 6), ellipse(60, 54, 46, 24, 'none', C.grey2, 4), line('M14 54 A46 24 0 1 0 106 54 A46 24 0 1 0 14 54', C.ink, 1, '1.5 4'),
    house(52, 60, 1), tree(72, 60, 0.8), tree(40, 54, 0.6), g('translate(46 80)', rect(-16, -10, 14, 9, C.red, 1.5, C.ink, 1.2), rect(0, -12, 18, 11, C.dark, 2, C.ink, 1.2), rect(11, -18, 7, 7, C.dark, 1, C.ink, 1.2), rect(2, -17, 4, 6, C.dark, 0, C.ink, 1), circle(-12, 0, 2.4, C.ink, null), circle(-5, 0, 2.4, C.ink, null), circle(5, 0, 2.4, C.ink, null), circle(14, 0, 2.4, C.ink, null)),
    rect(88, 92, 22, 14, C.dark, 3, C.ink, 1.3), circle(99, 99, 4, C.red, C.ink, 1), line('M88 96 C80 96 80 86 72 84', C.ink, 1.2)),
  // diorama: a whole small landscape with figures in a glass case
  'craft.diorama': all(rect(6, 96, 108, 12, C.brown, 3, C.ink, 1.8), rect(12, 16, 96, 80, '#cfe6f3', 2, C.ink, 1.6), path('M12 70 L34 36 L50 60 L70 30 L108 72 L108 96 L12 96 Z', C.grey2, C.ink, 1.2), path('M34 36 L28 46 L40 46 Z M70 30 L62 42 L78 42 Z', C.white, null),
    path('M12 80 C40 70 80 86 108 76 L108 96 L12 96 Z', C.green, C.ink, 1.2), house(40, 86, 1.1, C.red), tree(64, 88, 0.9), tree(76, 84, 0.7), tree(22, 88, 0.7),
    ...[88, 97].map((x, i) => all(circle(x, 80, 2.4, C.skin, C.ink, 0.8), line(`M${x} 82.5 L${x} 90 M${x} 90 L${x - 2} 94 M${x} 90 L${x + 2} 94 M${x - 3} 85 L${x + 3} 85`, i ? C.red : C.denim, 1.6))),
    line('M20 22 L34 22 M20 22 L20 40', C.white, 2.2), rect(12, 16, 96, 80, 'none', 2, C.ink, 2.4)),

  // ── 4736 Kalligrafi ─────────────────────────────────────────────────
  // handstil: the way a person writes by hand – two notes, two different hands
  'craft.handstil': all(rot(32, 56, -5, sheet(-24, -38, 48, 76), cursive(-19, -20, 5, C.navy), cursive(-19, -4, 5, C.navy), cursive(-19, 12, 5, C.navy), cursive(-19, 28, 3, C.navy)),
    rot(88, 60, 5, sheet(-24, -38, 48, 76, '#fdf3c4'), line('M-19 -22 l3 -8 l2 9 l4 -7 l1 7 l5 -9 l2 9 l4 -6 l3 6 l4 -8 M-19 -6 l2 -7 l4 8 l2 -9 l5 8 l1 -6 l4 7 l5 -9 l3 8 M-19 10 l4 -8 l1 9 l5 -8 l3 7 l2 -6 l5 7 l4 -8 M-19 26 l3 -7 l3 7 l4 -8 l2 8', C.red, 1.6)),
    pencil(60, 110, 20, 0.8)),
  // stålpenna: a pen with a split metal nib that is dipped in ink
  'craft.stålpenna': all(sheet(6, 82, 108, 28), path('M14 100 C24 88 30 104 40 94 C44 90 46 92 48 96', 'none', C.navy, 1.4), path('M40 94 C43 88 47 90 48 96 C46 93 43 92 40 94 Z', C.navy, null),
    g('translate(50 94) rotate(8) scale(1.3)', path('M3 -16 L7 -19 L26 -62 L21 -64 Z', C.brown, C.ink, 1), path('M2 -13 L8 -17 L7 -20 L3 -17 Z', C.gold, C.ink, 0.9), path('M0 0 C-4 -6 -2 -12 2 -15 L7 -18 C9 -12 6 -6 0 0 Z', C.silver, C.ink, 1), line('M0 0 L3.6 -10', C.ink, 0.8), circle(4, -11.5, 1.2, C.ink, null)),
    path('M50 96 c-2 3 -2 5 0 5 c2 0 2 -2 0 -5 Z', C.navy, null)),
  // bläckhorn: a small pot of ink on the desk
  'craft.bläckhorn': all(tableTop(98, C.tan), path('M34 98 C24 86 28 62 44 58 L44 48 L76 48 L76 58 C92 62 96 86 86 98 Z', '#dfeaf2', C.ink, 1.8), path('M32 92 C28 82 30 72 36 68 L84 68 C90 72 92 82 88 92 C86 96 84 98 84 98 L36 98 Z', C.navy, null), rect(40, 42, 40, 8, C.grey2, 2, C.ink, 1.5), ellipse(60, 44, 14, 2.6, C.navy, null),
    line('M40 76 C38 82 38 86 40 90', C.white, 1.6), greyed(dipPen(62, 60, 14, 0.85, true)), rect(92, 90, 18, 8, C.brown, 2, C.ink, 1.3)),
  // rispapper (att skriva på): the thin sheet (orange outline) under the brush, on a dark felt mat
  'craft.rispapper.2': all(rect(4, 10, 112, 102, C.navy, 4, C.ink, 1.6), rect(16, 22, 74, 84, '#fbf7ea', 1, HL, 2.6), line('M24 34 l5 2 M70 40 l6 -2 M30 92 l6 2 M66 96 l5 -2 M78 70 l4 3 M22 62 l4 -2', '#d8cfb6', 1), rect(20, 14, 66, 7, C.dark, 2, C.ink, 1.2),
    path('M66 50 C62 34 36 32 32 52 C28 74 50 90 68 78 C76 72 76 62 72 58', 'none', C.ink, 6), path('M90 96 L78 104 L80 96 Z', '#fbf7ea', HL, 1.6), brush(88, 62, -10, 0.75), rect(96, 86, 16, 18, C.dark, 3, C.ink, 1.2), ellipse(104, 92, 5, 3, C.ink, null)),
  // skrivtecken: characters from different writing systems
  'craft.skrivtecken': all(...[0, 1, 2, 3, 4, 5].map((i) => rect(8 + (i % 3) * 36, 14 + Math.floor(i / 3) * 48, 32, 44, i % 2 ? '#fdf3c4' : C.white, 4, C.ink, 1.6)),
    T(24, 46, 'A', 26), T(60, 46, 'Ж', 24), T(96, 46, 'Ω', 24),
    line('M24 70 L24 96 M14 80 L14 96 L34 96 L34 80', C.ink, 3.4), line('M60 68 L60 98 M49 78 L71 78 M59 80 L49 94 M61 80 L71 94', C.ink, 3.2), line('M92 70 C90 82 90 92 94 96 C98 98 102 94 104 88', C.ink, 3.4)),
  // streckordning: the strokes of a character are numbered in the order they are written
  'craft.streckordning': all(line('M20 48 L100 48', C.ink, 8), line('M60 16 C60 56 46 86 22 104', C.ink, 8), line('M62 52 C70 76 84 94 102 104', C.ink, 8),
    ...([[12, 36, '1'], [72, 14, '2'], [78, 62, '3']] as [number, number, string][]).map(([x, y, n]) => all(circle(x, y, 9, HL, C.ink, 1.4), T(x, y + 4.5, n, 12, C.white))),
    arrow(24, 36, 40, 36, HL, 2.2), arrow(72, 26, 70, 40, HL, 2.2), arrow(88, 68, 96, 80, HL, 2.2)),
  // hjälplinje: thin ruled lines (orange) that keep the letters equally high
  'craft.hjälplinje': all(sheet(6, 12, 108, 84), line('M10 34 L110 34 M10 50 L110 50 M10 70 L110 70 M10 84 L110 84', HL, 1.6), `<text x="52" y="70" font-family="Georgia,serif" font-style="italic" font-size="44" text-anchor="middle" fill="${C.grey}">hag</text>`,
    rect(6, 98, 108, 14, C.yellow, 2, C.ink, 1.4), line(Array.from({ length: 13 }, (_, i) => `M${12 + i * 8} 98 L${12 + i * 8} ${i % 2 ? 103 : 106}`).join(' '), C.ink, 1), pencil(110, 34, -62, 0.9)),
  // snirkel: the curling lines (orange) that decorate a letter
  'craft.snirkel': all(`<text x="50" y="86" font-family="Georgia,serif" font-size="72" text-anchor="middle" fill="${C.grey}">R</text>`,
    line('M70 84 C92 98 112 84 106 68 C100 54 82 60 88 72 C92 80 100 76 98 70', HL, 3), line('M30 36 C14 24 8 44 20 50 C30 54 34 42 26 40 M30 36 C40 18 70 10 96 22 C108 28 106 40 98 38', HL, 3), line('M22 92 C10 100 14 110 26 106 C40 102 60 104 80 108', HL, 3)),
  // bläckplump: a blot of ink that has landed on the paper by mistake
  'craft.bläckplump': all(sheet(6, 30, 108, 80), cursive(14, 48, 8, C.navy, 6, 1.4), cursive(14, 66, 3, C.navy, 6, 1.4), cursive(14, 100, 7, C.navy, 6, 1.4),
    path('M56 62 C64 54 76 58 80 64 C90 62 96 72 90 80 C96 90 84 98 76 92 C68 100 54 94 56 84 C46 80 48 66 56 62 Z', C.navy, C.ink, 1.4), circle(98, 62, 3, C.navy, null), circle(46, 92, 2.4, C.navy, null), circle(100, 92, 2, C.navy, null), circle(70, 70, 3, '#5570a8', null),
    dipPen(74, 46, 12, 0.62, false), path('M74 49 c-2.4 4 -2.4 6.4 0 6.4 c2.4 0 2.4 -2.4 0 -6.4 Z', C.navy, null)),

  // ── 4737 Origami och papperskonst ───────────────────────────────────
  // origami: a square of paper is folded into figures – a boat and a fox – without scissors or glue
  'craft.origami': all(path('M8 62 L44 62 L44 26 Z', C.pink, C.ink, 1.6), path('M8 62 L44 62 L44 98 L8 98 Z', C.rose, C.ink, 1.6), line('M8 62 L44 98', C.ink, 1, '3 3'), path('M22 30 C30 22 38 24 40 30', 'none', HL, 2.2), path('M40 30 L34 28 L38 24 Z', HL, null),
    path('M56 38 L112 38 L100 54 L68 54 Z', C.denim, C.ink, 1.6), path('M84 10 L70 38 L98 38 Z', C.sky, C.ink, 1.6), line('M84 10 L84 38', C.ink, 1),
    path('M58 68 L110 68 L84 106 Z', C.orange, C.ink, 1.6), path('M58 68 L70 60 L76 68 Z M110 68 L98 60 L92 68 Z', C.orange, C.ink, 1.6), path('M76 94 L92 94 L84 106 Z', C.white, C.ink, 1.2), circle(76, 78, 1.8, C.ink, null), circle(92, 78, 1.8, C.ink, null), circle(84, 104, 1.6, C.ink, null)),
  // ark: one single sheet (orange outline) taken from the pile
  'craft.ark': all(tableTop(100), greyed(...[0, 1, 2, 3, 4, 5].map((i) => path(`M12 ${92 - i * 3} L70 ${98 - i * 3} L108 ${84 - i * 3} L50 ${78 - i * 3} Z`, C.white, C.ink, 1.1))),
    path('M22 54 C40 50 60 60 80 60 L106 26 C86 26 68 16 48 20 Z', C.white, HL, 2.6), path('M80 60 L86 52 L92 60 Z', C.grey2, C.ink, 1)),
  // veck (i papper): the line where the paper has been folded
  'craft.veck.2': all(path('M10 100 L90 100 L106 66 L26 66 Z', C.white, C.ink, 1.6), path('M26 66 L106 66 L98 22 L18 22 Z', C.grey2, C.ink, 1.6), line('M26 66 L106 66', HL, 4), path('M54 44 C60 52 64 54 70 56', 'none', C.grey, 1.6)),
  // papperstrana: a crane folded of paper
  'craft.papperstrana': all(ground, path('M52 78 L74 24 L88 78 Z', '#b93a3a', C.ink, 1.6), path('M70 82 L100 26 L82 84 Z', C.red, C.ink, 1.6), path('M46 82 L26 28 L36 34 L58 82 Z', C.red, C.ink, 1.6), path('M26 28 L12 40 L32 37 Z', '#b93a3a', C.ink, 1.4),
    path('M38 80 L62 22 L78 80 Z', C.red, C.ink, 1.6), line('M62 22 L58 80', '#b93a3a', 1.1), path('M38 80 L82 80 L60 104 Z', '#b93a3a', C.ink, 1.6), line('M60 80 L60 104', C.ink, 0.9)),
  // pappersflygplan: an aeroplane folded of paper, in flight
  'craft.pappersflygplan': all(line('M8 96 C24 104 40 96 50 84', C.grey, 1.6, '4 4'), path('M12 62 L108 30 L56 78 Z', C.white, C.ink, 1.8), path('M56 78 L108 30 L66 100 Z', C.grey2, C.ink, 1.8), path('M56 78 L108 30 L72 74 Z', C.white, C.ink, 1.4), line('M14 44 L26 40 M10 78 L24 74', C.grey, 1.6)),
  // pappersklipp: a pattern cut out of folded paper, in the window
  'craft.pappersklipp': pappersklipp(),
  // mall (förebild): a card shape (orange outline) that you draw around
  'craft.mall.2': all(sheet(4, 14, 112, 94), line(starPath(86, 44, 20), C.ink, 1.4), path(starPath(42, 66, 30), C.tan, HL, 2.6), line('M42 50 L42 82 M28 66 L56 66', C.brown, 0.8), pencil(70, 82, -38, 1), line(starPath(84, 92, 9), C.grey, 1.2, '2 2')),
  // silkespapper: very thin coloured paper – you can see through the sheets; it lies round a present
  'craft.silkespapper': all(soft('M8 20 L62 12 L70 60 L16 68 Z', C.pink, 0.6), soft('M34 30 L92 22 L98 70 L42 80 Z', C.sky, 0.6), soft('M58 14 L112 24 L104 74 L52 62 Z', C.yellow, 0.6), line('M20 30 l10 6 l-6 10 M60 36 l12 4 l-4 12 M84 34 l8 8 l-8 10', C.grey, 0.9),
    rect(30, 84, 60, 26, C.tan, 2, C.ink, 1.6), soft('M30 84 C36 70 46 78 52 68 C58 78 68 66 74 76 C80 68 88 76 90 84 Z', C.pink, 0.75), soft('M38 84 C42 76 50 82 56 74 C64 82 72 74 82 84 Z', C.white, 0.7), line('M60 96 L60 110', C.brown, 1)),
  // papier-maché: strips of newspaper are pasted on a balloon and harden
  'craft.papier-maché': all(tableTop(100), path('M58 92 l-4 6 l8 0 Z', C.red, C.ink, 1.2), ellipse(58, 54, 30, 38, C.red, C.ink, 1.8),
    ...([[40, 40, -30], [62, 30, 10], [76, 50, 60], [44, 66, 20], [66, 74, -20], [56, 52, -50]] as [number, number, number][]).map(([x, y, d]) => rot(x, y, d, rect(-13, -5, 26, 10, C.white, 1, C.ink, 1), line('M-10 -2 L10 -2 M-10 1.5 L6 1.5', C.grey, 0.9))),
    ellipse(100, 96, 16, 6, C.grey2, C.ink, 1.5), path('M84 96 C86 108 114 108 116 96 Z', C.sky, C.ink, 1.5), ellipse(100, 96, 12, 3.6, C.white, C.ink, 0.9), flatBrush(98, 96, 30, C.white, 0.7),
    rot(18, 100, -10, rect(-12, -4, 24, 8, C.white, 1, C.ink, 1), line('M-9 -1 L9 -1 M-9 2 L5 2', C.grey, 0.9))),
};
