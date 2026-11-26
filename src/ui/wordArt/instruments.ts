/**
 * Kultur & fritid → Musik & scenkonst → Musikinstrument, 4421–4427 (0.62): string instruments, woodwinds,
 * brass, percussion, keyboard instruments, guitar and bass, electronic instruments.
 * The instruments are drawn as concrete scenes: a whole instrument, or a player with it, so that the size and
 * the way it is held carry the meaning (violin under the chin, cello between the knees, double bass taller
 * than the player). A part of an instrument (reed, key, valve, pedal, fingerboard, tuning peg) is shown in a
 * close-up and outlined in orange; the rest of the instrument is grey. Size words (altfiol) are drawn next to a
 * grey reference. Notes and sound arcs may appear; no letters, no brands, no logos.
 * Verbs move (spela på, knäppa, blåsa, trumma, virvel, tangent, ackompanjera, slå an, sampla;
 * base state = poster frame, transform and opacity only).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WOOD = '#b5652b';
const WOOD2 = '#7a4320';
const WOODL = '#d9a066';
const BRASS = '#e0b23c';
const BRASS2 = '#b88a20';
const BLACK = '#2e2e36';
const SILVER = '#c9ced4';
const FLOOR = '#e9e0cf';
const STAGE = '#c79a5c';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, rot: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ...k);
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
/** A quaver (eighth note) at (x, y) = note head. */
const note8 = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 3.4, 2.5, col, null), line('M3 0 L3 -12 C6 -10 8 -8 7 -4', col, 1.6));
/** Sound arcs to the right (dir 1) or left (−1) of (x, y). */
const sound = (x: number, y: number, s = 1, col: string = HL, dir = 1) => all(...[1, 2, 3].map((i) => { const r = i * 5 * s; return line(`M${f1(x + dir * r * 0.5)} ${f1(y - r * 0.87)} A${f1(r)} ${f1(r)} 0 0 ${dir > 0 ? 1 : 0} ${f1(x + dir * r * 0.5)} ${f1(y + r * 0.87)}`, col, 2); }));
const chair = (x: number, y = 112, col: string = WOOD2) => all(rect(x - 10, y - 30, 20, 4, col, 1, C.ink, 1.4), line(`M${x - 8} ${y - 26} L${x - 8} ${y} M${x + 8} ${y - 26} L${x + 8} ${y}`, col, 2.4));
const stool = (x: number, y = 112, col: string = BLACK) => all(rect(x - 12, y - 30, 24, 6, col, 2, C.ink, 1.4), line(`M${x - 9} ${y - 24} L${x - 11} ${y} M${x + 9} ${y - 24} L${x + 11} ${y}`, C.dark, 2.4));

// ── People ───────────────────────────────────────────────────────────
type Who = { top?: string; bottom?: string; hair?: string; long?: boolean; skin?: string; grey?: boolean; mood?: 'smile' | 'calm' | 'o' };
const hairOf = (w: Who) => (w.grey ? C.grey : w.hair ?? C.hair);
const skinOf = (w: Who) => (w.grey ? C.grey2 : w.skin ?? C.skin);
const topOf = (w: Who) => (w.grey ? C.grey : w.top ?? C.sky);
const botOf = (w: Who) => (w.grey ? C.grey : w.bottom ?? C.navy);
/** A head seen from the front, centre (x, y), radius r. */
const head = (x: number, y: number, r: number, w: Who = {}) => all(
  w.long ? path(`M${x - r * 1.1} ${y} C${x - r * 1.3} ${y + r * 1.6} ${x + r * 1.3} ${y + r * 1.6} ${x + r * 1.1} ${y} Z`, hairOf(w), C.ink, 1.2) : '',
  circle(x, y, r, skinOf(w), C.ink, 1.6), path(`M${x - r} ${y - r * 0.2} C${x - r} ${y - r * 1.5} ${x + r} ${y - r * 1.5} ${x + r} ${y - r * 0.2} C${x + r * 0.5} ${y - r * 0.75} ${x - r * 0.5} ${y - r * 0.75} ${x - r} ${y - r * 0.2} Z`, hairOf(w), C.ink, 1.2),
  w.mood === 'calm' ? line(`M${f1(x - r * 0.55)} ${f1(y + r * 0.05)} q${f1(r * 0.2)} ${f1(-r * 0.25)} ${f1(r * 0.4)} 0 M${f1(x + r * 0.15)} ${f1(y + r * 0.05)} q${f1(r * 0.2)} ${f1(-r * 0.25)} ${f1(r * 0.4)} 0`, C.ink, 1.1)
    : all(circle(f1(x - r * 0.38), f1(y + r * 0.05), f1(r * 0.12), C.ink, null), circle(f1(x + r * 0.38), f1(y + r * 0.05), f1(r * 0.12), C.ink, null)),
  w.mood === 'o' ? circle(x, f1(y + r * 0.5), f1(r * 0.18), '#c84a4a', C.ink, 0.8) : line(`M${f1(x - r * 0.3)} ${f1(y + r * 0.45)} Q${x} ${f1(y + r * 0.65)} ${f1(x + r * 0.3)} ${f1(y + r * 0.45)}`, C.ink, 1.1));
/** Standing person, front view, feet on y = 112; head centre (x, 30). Arms are added with armTo(). */
const stander = (x: number, w: Who = {}) => all(
  path(`M${x - 10} 78 L${x - 9} 108 L${x - 2} 108 L${x} 84 L${x + 2} 108 L${x + 9} 108 L${x + 10} 78 Z`, botOf(w), C.ink, 1.6),
  rect(x - 10, 106, 8, 5, w.grey ? C.grey : BLACK, 2, C.ink, 1), rect(x + 2, 106, 8, 5, w.grey ? C.grey : BLACK, 2, C.ink, 1),
  path(`M${x - 11} 44 C${x - 13} 60 ${x - 12} 72 ${x - 11} 80 L${x + 11} 80 C${x + 12} 72 ${x + 13} 60 ${x + 11} 44 C${x + 6} 41 ${x - 6} 41 ${x - 11} 44 Z`, topOf(w), C.ink, 1.8),
  rect(x - 2.5, 37, 5, 6, skinOf(w), 1, C.ink, 1.2), head(x, 30, 9, w));
/** Person sitting on a chair, side view facing right; hip at (x, 82). Head centre (x + 2, 40). */
const sitter = (x: number, w: Who = {}) => all(
  path(`M${x - 4} 80 L${x + 20} 80 L${x + 20} 108 L${x + 14} 108 L${x + 14} 86 L${x - 4} 86 Z`, botOf(w), C.ink, 1.6), rect(x + 13, 106, 12, 5, w.grey ? C.grey : BLACK, 2, C.ink, 1),
  path(`M${x - 8} 52 C${x - 9} 64 ${x - 8} 76 ${x - 6} 84 L${x + 6} 84 C${x + 8} 76 ${x + 9} 64 ${x + 8} 52 C${x + 4} 49 ${x - 4} 49 ${x - 8} 52 Z`, topOf(w), C.ink, 1.8),
  rect(x - 2, 45, 5, 6, skinOf(w), 1, C.ink, 1.2), head(x + 2, 40, 8.5, w));
/** An arm (sleeve + hand) from a shoulder to a hand point. */
const armTo = (sx: number, sy: number, hx: number, hy: number, w: Who = {}, ex?: number, ey?: number) => {
  const d = ex === undefined ? `M${sx} ${sy} L${hx} ${hy}` : `M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}`;
  return all(line(d, C.ink, 7.4), line(d, topOf(w), 5.4), circle(hx, hy, 3.2, skinOf(w), C.ink, 1.2));
};
const SL = (x: number) => [x - 10, 46] as const; // left shoulder (picture-left) of a stander
const SR = (x: number) => [x + 10, 46] as const;

// ── String instruments ───────────────────────────────────────────────
const FIDDLE_BODY = 'M0 -22 C8 -22 13 -19 13 -12 C13 -7 8 -6 8 -2 C8 2 15 4 15 12 C15 20 8 22 0 22 C-8 22 -15 20 -15 12 C-15 4 -8 2 -8 -2 C-8 -6 -13 -7 -13 -12 C-13 -19 -8 -22 0 -22 Z';
/** Violin-family instrument, upright, body centre at origin, scroll at y = −52 (local units). */
const fiddleLocal = (col: string = WOOD, bridge: string = WOODL, hl = false) => all(
  path(FIDDLE_BODY, col, C.ink, 1.6), path('M-6 -1 c2 2 -2 5 0 8 M6 -1 c-2 2 2 5 0 8', 'none', C.ink, 1.1),
  rect(-2.6, -48, 5.2, 34, BLACK, 1.4, C.ink, 1), path('M-2 -48 C-5 -50 -5 -55 0 -56 C5 -55 5 -50 2 -48 Z', col, C.ink, 1.2), line('M-4 -45 L-7 -45 M4 -45 L7 -45 M-4 -41 L-7 -41 M4 -41 L7 -41', C.ink, 1.6),
  path('M-3 13 L3 13 L2.4 21 L-2.4 21 Z', BLACK, null), rect(-5, 4.5, 10, 2.4, bridge, 0.6, hl ? HL : C.ink, hl ? 1.6 : 0.9),
  line('M-1.5 -46 L-1.5 14 M-0.5 -46 L-0.5 14 M0.5 -46 L0.5 14 M1.5 -46 L1.5 14', '#efeae0', 0.45));
const fiddle = (x: number, y: number, s: number, rot = 0, col: string = WOOD) => at(x, y, s, rot, fiddleLocal(col));
/** Bow from the frog (x1, y1) to the tip (x2, y2). */
const bow = (x1: number, y1: number, x2: number, y2: number, hl = false) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * 2.4, ny = dx / L * 2.4;
  return all(line(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx * 0.5)} ${f1(y2 + ny * 0.5)}`, '#f3ede0', 1.3), line(`M${x1} ${y1} L${x2} ${y2}`, hl ? HL : WOOD2, hl ? 2.4 : 1.8),
    circle(x1, y1, 2.2, BLACK, null));
};
/** Harp: base (x, y) at the floor, height h. */
const harp = (x: number, y: number, s = 1, col: string = BRASS) => at(x, y, s, 0,
  path('M-14 0 L-20 -6 L-18 -88 C-10 -96 6 -84 18 -82 C24 -81 26 -86 24 -90', 'none', C.ink, 6), path('M-14 0 L-20 -6 L-18 -88 C-10 -96 6 -84 18 -82 C24 -81 26 -86 24 -90', 'none', col, 4),
  path('M-16 -4 L14 -78 L20 -80 L-8 0 Z', WOOD, C.ink, 1.6), ...range(9).map((i) => { const t = (i + 1) / 10; return line(`M${f1(-16 + 30 * t)} ${f1(-4 - 74 * t)} L${f1(-18 + 0.4 * t)} ${f1(-86 + 8 * t * 0 + 2)}`, '#efe4c8', 0.9); }),
  rect(-24, -4, 20, 6, WOOD2, 2, C.ink, 1.4));
/** Double bass, upright, body centre (x, y), local scale s (≈ 2× a cello). */
const bass = (x: number, y: number, s: number, rot = 0) => at(x, y, s, rot, fiddleLocal(WOOD2), line('M0 22 L0 30', C.dark, 2));

// ── Woodwinds ────────────────────────────────────────────────────────
/** Transverse flute, horizontal, mouth hole at (x, y), length L to the right. */
const flute = (x: number, y: number, L = 70, hlKey = -1) => all(rect(x - 6, y - 2.6, L + 6, 5.2, SILVER, 2.6, C.ink, 1.3), ellipse(x, y - 0.4, 1.6, 1, C.ink, null),
  ...range(7).map((i) => all(circle(x + 18 + i * 7, y, 2.4, i === hlKey ? '#fff4d6' : '#e8ebee', i === hlKey ? HL : C.ink, i === hlKey ? 1.8 : 0.8), line(`M${x + 18 + i * 7} ${y + 2.6} l2 2`, C.grey, 0.8))));
/** Vertical woodwind (recorder, clarinet, oboe), top of mouthpiece at (x, y), length L. */
const pipe = (x: number, y: number, L: number, o: { col?: string; w?: number; bell?: number; holes?: number; keys?: boolean; reed?: 'single' | 'double' | 'beak' } = {}) => {
  const w = o.w ?? 5, col = o.col ?? BLACK, b = o.bell ?? 5, n = o.holes ?? 6;
  return all(
    o.reed === 'double' ? path(`M${x - 1.2} ${y - 6} L${x + 1.2} ${y - 6} L${x + 0.8} ${y} L${x - 0.8} ${y} Z`, WOODL, C.ink, 0.8) : '',
    o.reed === 'beak' ? path(`M${x - w / 2} ${y + 6} L${x - w / 2 + 1} ${y} L${x + w / 2 - 1} ${y} L${x + w / 2} ${y + 6} Z`, col, C.ink, 1.2) : '',
    o.reed === 'single' ? path(`M${x - w / 2 + 0.6} ${y + 7} L${x - w / 2 + 1.4} ${y} L${x + w / 2 - 1.4} ${y} L${x + w / 2 - 0.6} ${y + 7} Z`, BLACK, C.ink, 1) : '',
    path(`M${x - w / 2} ${y + (o.reed === 'double' ? 0 : 6)} L${x + w / 2} ${y + (o.reed === 'double' ? 0 : 6)} L${x + w / 2} ${y + L - b} L${x + w / 2 + b * 0.8} ${y + L} L${x - w / 2 - b * 0.8} ${y + L} L${x - w / 2} ${y + L - b} Z`, col, C.ink, 1.3),
    ...range(n).map((i) => circle(x, f1(y + 12 + i * (L - b - 16) / Math.max(1, n - 1)), 1.1, o.keys ? SILVER : C.ink, o.keys ? C.ink : null, 0.5)),
    o.keys ? line(range(4).map((i) => `M${x + w / 2} ${f1(y + 16 + i * (L - 24) / 4)} l2.4 3`).join(' '), SILVER, 1.2) : '');
};
/** Saxophone: mouthpiece at (x, y), scale s. */
const sax = (x: number, y: number, s = 1) => at(x, y, s, 0,
  path('M0 0 C2 4 4 6 4 12 L6 44 C7 54 14 58 22 52 L26 40', 'none', C.ink, 9.4), path('M0 0 C2 4 4 6 4 12 L6 44 C7 54 14 58 22 52 L26 40', 'none', BRASS, 7.4),
  path('M21 42 L31 36 L33 42 Z', BRASS, C.ink, 1.4), ellipse(28, 38, 6, 3, BRASS2, C.ink, 1.2), path('M-2 -4 L2 -4 L1 2 L-1 2 Z', BLACK, null),
  ...range(5).map((i) => circle(9.4, 16 + i * 6, 1.6, '#fff4d6', C.ink, 0.6)));

// ── Brass ────────────────────────────────────────────────────────────
/** Trumpet, mouthpiece at (x, y) pointing left, bell to the right; scale s. */
const trumpet = (x: number, y: number, s = 1, hlValves = false) => at(x, y, s, 0,
  line('M0 0 L40 0 M10 0 C10 8 14 10 22 10 L36 10 C40 10 42 6 40 0', BRASS2, 4.4), line('M0 0 L40 0 M10 0 C10 8 14 10 22 10 L36 10 C40 10 42 6 40 0', BRASS, 2.8),
  path('M40 -3 L52 -9 C54 -10 54 10 52 9 L40 3 Z', BRASS, C.ink, 1.2), ellipse(52.5, 0, 2.4, 9.4, '#f4d47a', C.ink, 1.1), rect(-3, -1.6, 4, 3.2, SILVER, 1, C.ink, 0.8),
  ...[18, 23, 28].map((vx) => all(rect(vx - 2, -6, 4, 18, BRASS, 1, hlValves ? HL : C.ink, hlValves ? 1.4 : 1), rect(vx - 2.4, -9, 4.8, 3, SILVER, 1, hlValves ? HL : C.ink, hlValves ? 1.4 : 0.8))));
/** Trombone, mouthpiece at (x, y), slide extended by `ext` to the right; bell points left-up behind. */
const trombone = (x: number, y: number, s = 1, ext = 30) => at(x, y, s, 0,
  line(`M0 0 L${44 + ext} 0 L${44 + ext} 7 L14 7`, BRASS2, 3.8), line(`M0 0 L${44 + ext} 0 L${44 + ext} 7 L14 7`, BRASS, 2.4),
  line('M8 0 L8 -8 L30 -8 C38 -8 38 -16 30 -16 L6 -16', BRASS2, 3.8), line('M8 0 L8 -8 L30 -8 C38 -8 38 -16 30 -16 L6 -16', BRASS, 2.4),
  path('M6 -12 L-8 -20 C-10 -21 -10 -11 -8 -12 Z', BRASS, C.ink, 1.2), ellipse(-8.5, -16, 2, 7, '#f4d47a', C.ink, 1), rect(-3, -1.5, 4, 3, SILVER, 1, C.ink, 0.8));
/** French horn: coil centre (x, y), radius r; bell to the lower right. */
const horn = (x: number, y: number, r = 16) => all(circle(x, y, r, 'none', BRASS2, 4.6), circle(x, y, r, 'none', BRASS, 3), circle(x, y, r * 0.62, 'none', BRASS2, 3.6), circle(x, y, r * 0.62, 'none', BRASS, 2.2),
  path(`M${x + r * 0.5} ${y + r * 0.7} L${x + r * 1.5} ${y + r * 1.4} C${x + r * 1.9} ${y + r * 1.1} ${x + r * 1.6} ${y + r * 2.1} ${x + r * 1.2} ${y + r * 1.9} Z`, BRASS, C.ink, 1.2),
  ellipse(x + r * 1.55, y + r * 1.75, r * 0.5, r * 0.2, '#f4d47a', C.ink, 1), rect(x - 4, y - r - 3, 8, 6, BRASS, 1, C.ink, 1), line(`M${x - r} ${y - 2} L${x - r - 8} ${y - 8}`, BRASS, 2.4));
/** Tuba, base (x, y) on the floor, scale s; bell up. */
const tuba = (x: number, y: number, s = 1) => at(x, y, s, 0,
  path('M-12 0 C-16 -10 -14 -40 -10 -50 L-14 -64 L14 -64 L10 -50 C12 -40 14 -10 10 0 Z', BRASS, C.ink, 1.6), ellipse(0, -64, 15, 4, '#f4d47a', C.ink, 1.2),
  rect(10, -40, 8, 18, BRASS2, 2, C.ink, 1), ...[-4, 1, 6].map((vx) => rect(vx - 1.6, -36, 3.2, 10, SILVER, 1, C.ink, 0.7)), path('M-10 -30 C-22 -30 -24 -14 -12 -12', 'none', BRASS2, 3));

// ── Percussion ───────────────────────────────────────────────────────
/** Drum seen slightly from above: centre of the top skin (x, y), radius rx, height h. */
const drum = (x: number, y: number, rx: number, h: number, shell: string = C.red, skin: string = '#f6efe0') => all(
  path(`M${x - rx} ${y} L${x - rx} ${y + h} A${rx} ${rx * 0.3} 0 0 0 ${x + rx} ${y + h} L${x + rx} ${y} Z`, shell, C.ink, 1.6),
  line(range(5).map((i) => { const t = -0.8 + i * 0.4; return `M${f1(x + rx * t)} ${f1(y + rx * 0.3 * Math.sqrt(1 - t * t))} L${f1(x + rx * t * 0.95)} ${f1(y + h + rx * 0.3 * Math.sqrt(1 - t * t))}`; }).join(' '), SILVER, 0.9),
  ellipse(x, y, rx, rx * 0.3, skin, C.ink, 1.6));
const stick = (x1: number, y1: number, x2: number, y2: number, col: string = WOODL) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 3.4), line(`M${x1} ${y1} L${x2} ${y2}`, col, 2), circle(x2, y2, 1.8, col, C.ink, 0.8));
const cymbal = (x: number, y: number, r: number, tilt = 0) => g(`rotate(${tilt} ${x} ${y})`, ellipse(x, y, r, r * 0.22, BRASS, C.ink, 1.4), ellipse(x, y - 0.6, r * 0.18, r * 0.08, BRASS2, C.ink, 0.8));
const standLine = (x: number, y1: number, y2 = 112) => all(line(`M${x} ${y1} L${x} ${y2 - 6} M${x} ${y2 - 6} L${x - 7} ${y2} M${x} ${y2 - 6} L${x + 7} ${y2}`, C.dark, 1.6));
/** Drum kit: bass drum front, snare, toms, two cymbals; `hl` outlines one part. */
const drumkit = (o: { hl?: 'bass' | 'snare' | 'none' } = {}) => all(
  standLine(18, 34), cymbal(18, 34, 15, -8), standLine(104, 40), cymbal(104, 40, 13, 8),
  drum(36, 66, 10, 8, C.red), drum(84, 66, 10, 8, C.red), standLine(30, 78, 108),
  circle(60, 88, 22, C.red, C.ink, 1.8), circle(60, 88, 17, '#f6efe0', C.ink, 1.4), drum(30, 80, 12, 7, SILVER),
  drum(92, 84, 13, 20, C.red), o.hl === 'bass' ? ring(60, 88, 26) : '', o.hl === 'snare' ? ring(30, 84, 16) : '');
const xylo = (x: number, y: number, w: number, hlBar = -1) => all(line(`M${x} ${y + 4} L${x + w} ${y - 4} M${x} ${y + 22} L${x + w} ${y + 10}`, WOOD2, 3),
  ...range(8).map((i) => { const bx = x + 3 + i * (w - 6) / 8, len = 26 - i * 2; return rect(f1(bx), f1(y + 13 - i - len / 2 + 0), f1((w - 6) / 8 - 1.6), len, i === hlBar ? '#f4c9a0' : WOODL, 1, i === hlBar ? HL : C.ink, i === hlBar ? 1.6 : 1); }));
const triangleInst = (x: number, y: number, s = 1) => at(x, y, s, 0, line('M0 -22 L-16 10 L14 10 L1 -18', SILVER, 4), line('M0 -22 L-16 10 L14 10 L1 -18', C.ink, 0.8), line('M0 -22 L0 -34', C.ink, 1));
const tambourine = (x: number, y: number, r: number) => all(circle(x, y, r, '#f6efe0', C.ink, 1.6), circle(x, y, r, 'none', WOODL, 3.4), circle(x, y, r, 'none', C.ink, 0.6),
  ...range(5).map((i) => { const a = (i / 5) * Math.PI * 2 + 0.3; return ellipse(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r), 3.2, 1.6, SILVER, C.ink, 0.7); }));
const castanet = (x: number, y: number, s = 1, open = 6) => at(x, y, s, 0, path(`M-10 0 C-10 -8 10 -8 10 0 Z`, '#6b3a1f', C.ink, 1.2), path(`M-10 ${open} C-10 ${open + 8} 10 ${open + 8} 10 ${open} Z`, '#6b3a1f', C.ink, 1.2), line(`M-10 0 C-14 2 -14 ${open - 2} -10 ${open}`, C.red, 1.2));
const gong = (x: number, y: number, r: number) => all(line(`M${x - r - 8} 112 L${x - r - 8} ${y - r - 10} L${x + r + 8} ${y - r - 10} L${x + r + 8} 112`, WOOD2, 4), line(`M${x - 6} ${y - r - 10} L${x - 4} ${y - r} M${x + 6} ${y - r - 10} L${x + 4} ${y - r}`, C.ink, 1),
  circle(x, y, r, BRASS, C.ink, 1.8), circle(x, y, r * 0.35, BRASS2, C.ink, 1), circle(x, y, r * 0.75, 'none', BRASS2, 1));
const mallet = (x1: number, y1: number, x2: number, y2: number, headCol: string = '#f3ede0', hr = 3) => all(line(`M${x1} ${y1} L${x2} ${y2}`, WOOD2, 2), circle(x2, y2, hr, headCol, C.ink, 1));

// ── Keyboards ────────────────────────────────────────────────────────
/** A keyboard (white + black keys), top-left (x, y), width w, height h, n white keys. `natural`/`sharp` colours. */
const keys = (x: number, y: number, w: number, h: number, n: number, o: { natural?: string; sharp?: string; hl?: number; press?: number } = {}) => {
  const kw = w / n, nat = o.natural ?? C.white, sh = o.sharp ?? BLACK;
  return all(rect(x, y, w, h, nat, 1, C.ink, 1.2), ...range(n).map((i) => rect(f1(x + i * kw), y, f1(kw), h, i === o.hl ? '#ffe2c8' : nat, 0.6, i === o.hl ? HL : C.ink, i === o.hl ? 1.6 : 0.6)),
    ...range(n - 1).filter((i) => [0, 1, 3, 4, 5].includes(i % 7)).map((i) => rect(f1(x + (i + 1) * kw - kw * 0.3), y, f1(kw * 0.6), f1(h * 0.6), sh, 0.6, C.ink, 0.5)));
};
/** Upright piano, base centre (x, 112), scale s. */
const upright = (x: number, s = 1, o: { hlPedal?: boolean } = {}) => at(x, 112, s, 0,
  rect(-34, -70, 68, 50, '#3a2a24', 3, C.ink, 1.8), rect(-30, -66, 60, 14, '#4a362e', 2, null), rect(-12, -64, 24, 10, '#f3ede0', 1, C.ink, 0.8),
  rect(-36, -22, 72, 6, '#3a2a24', 2, C.ink, 1.4), keys(-32, -20, 64, 8, 14), rect(-34, -12, 68, 12, '#3a2a24', 2, C.ink, 1.4),
  line('M-30 0 L-30 -2 M30 0 L30 -2', C.ink, 2), ...[-6, 0, 6].map((px, i) => rect(px - 1.6, -4, 3.2, 3.4, BRASS, 1, o.hlPedal && i === 2 ? HL : C.ink, 0.8)));
/** Grand piano seen from the side, keyboard end at the left; base on y = 112; lid open. `nat`/`sharp` for a harpsichord. */
const grand = (x: number, s = 1, o: { col?: string; nat?: string; sharp?: string } = {}) => at(x, 112, s, 0,
  line('M-30 -34 L-30 0 M40 -34 L40 0', C.ink, 3.6), line('M-30 -34 L-30 0 M40 -34 L40 0', o.col ?? BLACK, 2.4),
  path('M-36 -48 L44 -48 C54 -48 54 -34 44 -34 L-36 -34 Z', o.col ?? BLACK, C.ink, 1.8), path('M-30 -48 L36 -82 L40 -78 L-24 -48 Z', o.col ?? BLACK, C.ink, 1.6), line('M10 -48 L14 -64', C.ink, 1.2),
  keys(-40, -42, 14, 6, 4, { natural: o.nat, sharp: o.sharp }));
/** Organ with pipes, centre (x), base 112; console in front. */
const organ = (x: number, s = 1, hlKeys = false) => at(x, 112, s, 0,
  rect(-44, -96, 88, 66, '#c6a476', 2, C.ink, 1.6), ...range(11).map((i) => { const px = -38 + i * 7.6, ph = 50 - Math.abs(i - 5) * 6; return all(rect(f1(px), f1(-34 - ph), 5.2, ph, SILVER, 2, C.ink, 1), path(`M${f1(px)} -38 L${f1(px + 2.6)} -34 L${f1(px + 5.2)} -38`, 'none', C.ink, 0.8)); }),
  rect(-30, -30, 60, 30, WOOD2, 2, C.ink, 1.6), keys(-24, -28, 48, 5, 12, { hl: hlKeys ? -2 : -1 }), keys(-24, -21, 48, 5, 12), rect(-26, -4, 52, 4, WOOD, 1, C.ink, 1));
const accordion = (x: number, y: number, s = 1, spread = 1) => at(x, y, s, 0,
  rect(-26, -20, 14, 40, C.red, 3, C.ink, 1.6), rect(-24, -18, 6, 36, C.white, 1, C.ink, 0.8), line(range(6).map((i) => `M-24 ${-14 + i * 6} L-18 ${-14 + i * 6}`).join(' '), C.ink, 0.6),
  g(`scale(${spread} 1)`, path('M-12 -18 L-8 -20 L-4 -18 L0 -20 L4 -18 L8 -20 L12 -18 L12 18 L8 20 L4 18 L0 20 L-4 18 L-8 20 L-12 18 Z', '#f3ede0', C.ink, 1.2), line('M-8 -20 L-8 20 M0 -20 L0 20 M8 -20 L8 20', C.ink, 0.8)),
  rect(12, -20, 14, 40, C.red, 3, C.ink, 1.6), ...range(9).map((i) => circle(17 + (i % 2) * 4, -14 + i * 3.6, 1.3, C.white, C.ink, 0.5)));

// ── Guitars ──────────────────────────────────────────────────────────
const GUITAR = 'M0 -20 C7 -20 11 -17 11 -11 C11 -7 8 -5 8 -2 C8 1 14 4 14 12 C14 21 7 24 0 24 C-7 24 -14 21 -14 12 C-14 4 -8 1 -8 -2 C-8 -5 -11 -7 -11 -11 C-11 -17 -7 -20 0 -20 Z';
/** Acoustic guitar, upright, body centre at origin (local); neck to y = −62. `n` strings. */
const guitarLocal = (o: { col?: string; strings?: number; hole?: boolean; neck?: number; hlBoard?: boolean; hlPegs?: boolean } = {}) => {
  const n = o.strings ?? 6, top = -(o.neck ?? 62);
  return all(path(GUITAR, o.col ?? WOODL, C.ink, 1.6), o.hole === false ? '' : circle(0, 2, 5, '#4a2a14', C.ink, 1),
    rect(-3, top + 6, 6, -top - 22, '#5a3a22', 1, o.hlBoard ? HL : C.ink, o.hlBoard ? 1.8 : 1), line(range(6).map((i) => `M-3 ${f1(top + 12 + i * (-top - 28) / 6)} L3 ${f1(top + 12 + i * (-top - 28) / 6)}`).join(' '), SILVER, 0.8),
    path(`M-4 ${top + 6} L-4.6 ${top - 4} L4.6 ${top - 4} L4 ${top + 6} Z`, '#5a3a22', C.ink, 1.2),
    ...range(n).map((i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); return circle(side * 6.6, top - 2 + k * 3.4 * (6 / n) * 1.2, 1.5, SILVER, o.hlPegs ? HL : C.ink, o.hlPegs ? 1 : 0.6); }),
    rect(-5, 12, 10, 2.4, BLACK, 0.6, null), line(range(n).map((i) => { const sx = f1(-2 + (4 * i) / Math.max(1, n - 1)); return `M${sx} ${top - 2} L${sx} 13`; }).join(' '), '#efeae0', 0.45));
};
const guitar = (x: number, y: number, s: number, rot = 0, o: Parameters<typeof guitarLocal>[0] = {}) => at(x, y, s, rot, guitarLocal(o));
const EGUITAR = 'M-4 -12 C-6 -20 -12 -20 -12 -12 C-12 -6 -10 -2 -13 6 C-16 16 -8 24 0 24 C8 24 15 18 13 8 C11 0 8 -2 8 -6 C9 -14 13 -18 9 -20 C6 -21 5 -16 4 -12 Z';
/** Electric guitar / bass (local, body centre at origin, neck to −top). */
const eguitarLocal = (o: { col?: string; strings?: number; neck?: number } = {}) => {
  const n = o.strings ?? 6, top = -(o.neck ?? 62);
  return all(path(EGUITAR, o.col ?? C.red, C.ink, 1.6), rect(-5, -4, 10, 4, BLACK, 1, null), rect(-5, 6, 10, 4, BLACK, 1, null), circle(8, 14, 1.8, SILVER, C.ink, 0.6), circle(4, 18, 1.8, SILVER, C.ink, 0.6),
    rect(-2.6, top + 6, 5.2, -top - 14, '#5a3a22', 1, C.ink, 1), path(`M-3 ${top + 6} L-5 ${top - 6} L4 ${top - 6} L3 ${top + 6} Z`, BLACK, C.ink, 1),
    line(range(n).map((i) => { const sx = f1(-1.6 + (3.2 * i) / Math.max(1, n - 1)); return `M${sx} ${top - 2} L${sx} 18`; }).join(' '), '#efeae0', n === 4 ? 0.7 : 0.45));
};
const eguitar = (x: number, y: number, s: number, rot = 0, o: Parameters<typeof eguitarLocal>[0] = {}) => at(x, y, s, rot, eguitarLocal(o));
const amp = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, BLACK, 3, C.ink, 1.6), rect(x + 4, y + 10, w - 8, h - 14, '#5a5a62', 2, null),
  line(range(Math.floor((h - 14) / 4)).map((i) => `M${x + 5} ${y + 12 + i * 4} L${x + w - 5} ${y + 12 + i * 4}`).join(' '), '#3e3e46', 1), ...range(4).map((i) => circle(x + 8 + i * 7, y + 5, 2, BRASS, C.ink, 0.6)));
const cable = (d: string) => all(line(d, C.ink, 3.4), line(d, '#3d3f4a', 2));

export const INSTR_MOTIFS: Record<string, Svg> = {
  // ── 4421 Stråkinstrument ─────────────────────────────────────────
  'instr.stråkinstrument': all(ground(), fiddle(14, 88, 0.42), fiddle(32, 84, 0.52, 0, '#a85a26'), fiddle(58, 76, 0.78), bass(94, 66, 1.06),
    bow(6, 70, 26, 52, true), bow(24, 64, 46, 44, true), bow(44, 56, 74, 36, true), bow(76, 46, 112, 22, true)),
  'instr.fiol': all(ground(), stander(46, { top: C.green, long: true, hair: '#7a4a2a' }), armTo(...SR(46), 76, 44, { top: C.green }), fiddle(60, 40, 0.5, 100),
    bow(30, 62, 70, 26), armTo(...SL(46), 30, 60, { top: C.green }, 32, 66), note8(96, 22, 1), note8(106, 34, 0.8)),
  'instr.altfiol': all(rect(4, 100, 112, 12, FLOOR, 0, null), greyed(fiddle(34, 64, 0.82)), fiddle(82, 60, 0.98), line('M22 108 L46 108 M66 108 L98 108', C.ink, 1.4),
    line('M22 104 L22 112 M46 104 L46 112 M66 104 L66 112 M98 104 L98 112', C.ink, 1.4), ring(82, 52, 34)),
  'instr.cello': all(ground(), chair(40), at(68, 80, 0.88, 6, fiddleLocal('#9a4e22')), line('M70 100 L72 112', C.dark, 1.8), sitter(40, { top: C.purple }),
    armTo(36, 56, 62, 46, { top: C.purple }, 50, 58), bow(52, 90, 96, 70), armTo(38, 58, 54, 88, { top: C.purple }, 44, 76)),
  'instr.kontrabas': all(ground(), bass(70, 70, 1.5, 4), line('M73 102 L74 112', C.dark, 2), stander(32, { top: C.orange }), armTo(...SR(32), 68, 28, { top: C.orange }), armTo(...SL(32), 62, 74, { top: C.orange }, 30, 70),
    line('M30 20 L30 112', C.grey2, 1, '3 3'), line('M98 0 L98 112', C.grey2, 1, '3 3')),
  'instr.harpa': all(rect(4, 104, 112, 8, STAGE, 0, null), harp(58, 106, 1.05), stander(96, { top: C.navy, long: true, hair: '#c4542a', grey: false }), armTo(86, 46, 66, 52, { top: C.navy }), armTo(88, 48, 62, 76, { top: C.navy }, 80, 66), note8(22, 24, 1), note8(14, 40, 0.8)),
  'instr.nyckelharpa': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), at(62, 62, 1, -14,
    path('M-50 -8 C-50 -16 -30 -18 -14 -14 L40 -6 C48 -5 52 0 52 4 C52 10 44 14 36 12 L-14 10 C-30 14 -50 12 -50 4 Z', WOOD, C.ink, 1.8), line('M-46 -2 L50 2 M-46 1 L50 4 M-46 4 L50 6', '#efeae0', 0.6),
    rect(-30, -14, 50, 7, WOODL, 1, C.ink, 1), ...range(12).map((i) => rect(-28 + i * 4, -20, 2.6, 8, WOODL, 0.6, C.ink, 0.6)), rect(26, -6, 3, 14, WOODL, 0.6, C.ink, 0.8), path('M-56 -6 L-50 -6 L-50 4 L-56 4 Z', WOOD2, C.ink, 1)),
    bow(40, 98, 78, 36), frame(30, 30, 64, 24)),
  'instr.stråke': all(greyed(fiddle(30, 70, 0.9, -30)), bow(14, 104, 108, 18, true), path('M14 100 L22 98 L24 106 L16 108 Z', BLACK, C.ink, 1), ring(98, 28, 12)),
  'instr.kolofonium': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(36, 70, 40, 18, '#e0a83a', 3, C.ink, 1.6), rect(40, 73, 32, 12, '#f2c86a', 2, null), rect(32, 86, 48, 6, WOOD2, 2, C.ink, 1.2),
    moving('instr-kolofonium-1', '0%,100%{transform:translate(-10px,2px)}50%{transform:translate(10px,-2px)}', { dur: 1.4 }, bow(22, 72, 116, 60), armTo(-6, 90, 20, 74, { top: C.sky })),
    ...[[50, 66], [58, 64], [66, 66]].map(([x, y]) => circle(x!, y!, 1.2, '#f2e2b0', null)), ring(56, 76, 24)),
  'instr.spela-på.2': all(ground(), upright(76, 1), stool(36), sitter(30, { top: C.orange, long: true, hair: '#7a4a2a' }), armTo(28, 56, 52, 92, { top: C.orange }, 40, 74),
    ...[[64, 30, 0], [80, 22, 0.6], [96, 30, 1.2]].map(([x, y, d], i) => moving(`instr-spela-pa-${i + 1}`, '0%{transform:translate(0,14px);opacity:0}40%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4, delay: d }, note8(x!, y!, 1.1)))),
  'instr.knäppa.2': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 40, 112, 40, '#5a3a22', 2, C.ink, 1.4), line('M4 48 L116 48 M4 56 L116 56 M4 72 L116 72', '#efeae0', 1.2),
    waShake('instr-knappa-1', line('M4 64 C40 64 52 70 60 72 C68 70 80 64 116 64', HL, 1.8), line('M4 64 C40 64 52 58 60 56 C68 58 80 64 116 64', HL, 1.2, '2 2')),
    path('M48 112 C46 96 52 84 58 76 C62 72 68 74 66 80 C64 86 62 92 64 112 Z', C.skin, C.ink, 1.6), path('M58 76 C60 72 64 72 66 76', 'none', C.ink, 1), sound(84, 26, 0.8, HL), sound(36, 26, 0.8, HL, -1)),
  'instr.stråkkvartett': all(rect(4, 100, 112, 12, STAGE, 0, null), ...[[16, C.navy, 0.42, 'v'], [42, C.green, 0.42, 'v'], [68, C.purple, 0.5, 'a'], [92, C.orange, 0.7, 'c']].map(([x, col, s, k]) => {
    const X = x as number, top = col as string;
    return k === 'c' ? all(chair(X + 4, 112), at(X + 14, 84, 0.6, 8, fiddleLocal('#9a4e22')), sitter(X, { top }), armTo(X - 2, 58, X + 12, 70, { top }))
      : all(chair(X + 4, 112), sitter(X, { top }), at(X + 12, 50, s as number, 100, fiddleLocal(k === 'a' ? '#a85a26' : WOOD)), armTo(X + 2, 56, X + 26, 52, { top }), bow(X - 6, 64, X + 18, 40));
  }), note8(54, 18, 1), note8(70, 12, 0.8)),
  // ── 4422 Träblåsinstrument ───────────────────────────────────────
  'instr.blåsinstrument': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), flute(18, 26, 74), trumpet(30, 62, 1.1), sax(22, 78, 0.6), pipe(98, 66, 40, { col: BLACK, reed: 'single', keys: true }),
    ...[[12, 22], [24, 58], [16, 74], [92, 58]].map(([x, y]) => path(`M${x! - 8} ${y! - 2} c2 -3 4 -3 6 0 c2 3 4 3 6 0`, 'none', C.sky, 1.8))),
  'instr.träblåsinstrument': all(ground(), pipe(16, 30, 74, { col: BLACK, reed: 'single', keys: true, bell: 7 }), pipe(36, 34, 70, { col: '#3a2418', w: 4, reed: 'double', keys: true, bell: 4 }),
    pipe(60, 10, 96, { col: '#8a4a26', w: 7, reed: 'double', bell: 2, holes: 5 }), line('M60 10 C60 4 66 2 70 6', SILVER, 1.6), at(90, 106, 1, -90, flute(0, 0, 76))),
  'instr.flöjt': all(ground(), stander(40, { top: C.lilac, long: true }), flute(30, 33, 80), armTo(...SL(40), 44, 34, { top: C.lilac }, 26, 56), armTo(...SR(40), 74, 34, { top: C.lilac }, 58, 58),
    note8(98, 14, 1), note8(108, 22, 0.8)),
  'instr.blockflöjt': all(ground(), stander(60, { top: C.yellow }), pipe(60, 34, 46, { col: '#f3ede0', w: 5.4, reed: 'beak', bell: 3, holes: 7 }),
    armTo(...SL(60), 58, 52, { top: C.yellow }, 46, 62), armTo(...SR(60), 62, 70, { top: C.yellow }, 74, 66), note8(86, 20, 1), note8(96, 30, 0.8)),
  'instr.klaff.4': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(rect(4, 54, 112, 14, SILVER, 6, C.ink, 1.4)), ...range(5).map((i) => i === 2 ? '' : greyed(circle(16 + i * 22, 61, 6, '#e8ebee', C.ink, 1))),
    circle(60, 61, 8, '#fff4d6', HL, 2), line('M60 69 L66 80 L90 80', SILVER, 2.4), ring(60, 61, 16), path('M54 112 C52 96 56 86 62 82 C66 80 70 84 68 90 C66 96 66 102 68 112 Z', C.skin, C.ink, 1.4)),
  'instr.munstycke.2': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(pipe(60, 56, 70, { col: BLACK, w: 16, bell: 10, holes: 3, keys: true })),
    path('M52 58 L68 58 L66 30 C66 24 54 24 54 30 Z', BLACK, C.ink, 1.8), rect(51, 48, 18, 5, SILVER, 1, C.ink, 1), path('M55 30 L65 30 L64 22 L56 22 Z', '#e0c48a', C.ink, 1.2), ring(60, 40, 22)),
  'instr.rörblad': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(path('M30 100 L50 100 L48 50 C48 42 32 42 32 50 Z', BLACK, C.ink, 1.6)), path('M34 48 L46 48 L45 26 L35 26 Z', '#e0c48a', C.ink, 1.4), ring(40, 38, 16),
    at(86, 64, 1.6, 0, path('M-6 26 L6 26 L5 -22 C4 -26 -4 -26 -5 -22 Z', '#e8cf8f', C.ink, 1.2), line('M-3 -16 L-3 20 M0 -18 L0 22 M3 -16 L3 20', '#c9a85f', 0.6)), ring(86, 64, 30)),
  'instr.klarinett': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), pipe(60, 10, 98, { col: BLACK, w: 10, reed: 'single', keys: true, bell: 12, holes: 7 }), rect(54, 24, 12, 4, SILVER, 1, C.ink, 1), rect(54, 50, 12, 3, SILVER, 1, C.ink, 0.8)),
  'instr.oboe': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), pipe(52, 18, 92, { col: '#3a2418', w: 7, reed: 'double', keys: true, bell: 5, holes: 7 }), circle(92, 30, 18, C.white, C.ink, 1.6), line('M68 26 L76 28', C.ink, 1.2),
    path('M88 44 L96 44 L95 30 L89 30 Z', '#3a2418', C.ink, 1), path('M89 30 L91.6 14 L91.6 30 Z M95 30 L92.4 14 L92.4 30 Z', '#e0c48a', C.ink, 1), ring(92, 30, 20)),
  'instr.fagott': all(ground(), stander(40, { top: C.green }), pipe(62, 4, 104, { col: '#8a4a26', w: 9, bell: 2, holes: 5 }), path('M62 4 C62 -2 50 -2 46 6 L42 24', 'none', SILVER, 1.8),
    armTo(...SR(40), 60, 40, { top: C.green }, 54, 52), armTo(...SL(40), 58, 70, { top: C.green }, 30, 66), note8(90, 70, 1.1), note8(100, 82, 0.9)),
  'instr.saxofon': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), sax(40, 14, 1.6), note8(98, 20, 1.1), note8(106, 32, 0.9)),
  'instr.blåsa.2': all(ground(), stander(30, { top: C.sky, mood: 'o' }), armTo(...SR(30), 74, 40, { top: C.sky }, 56, 52),
    line('M74 40 L74 80', WOOD2, 2.4), waSpin('instr-blasa-1', 1.2, all(...range(4).map((i) => g(`rotate(${i * 90} 74 32)`, path('M74 32 L74 14 L86 22 Z', [C.red, C.yellow, C.green, C.denim][i]!, C.ink, 1.2))))),
    ...[0, 0.5, 1].map((d, i) => moving(`instr-blasa-${i + 2}`, '0%{transform:translate(-10px,0);opacity:0}40%{opacity:1}100%{transform:translate(8px,0);opacity:0}', { dur: 1.6, delay: d }, path(`M44 ${26 + i * 5} c3 -2 5 -2 8 0 c3 2 5 2 8 0`, 'none', C.sky, 1.8)))),
  'instr.säckpipa': all(ground(), stander(46, { top: C.dark }), path('M38 52 C26 50 26 76 40 78 C56 80 66 70 62 58 C58 50 48 52 38 52 Z', '#2f6b4a', C.ink, 1.6),
    line('M30 56 L36 60 M34 52 L42 70 M44 52 L54 76 M54 54 L62 70', '#c43c3c', 1.6), line('M50 54 L58 6 M56 56 L72 14 M60 60 L82 26', BLACK, 3.6), ...[[58, 6], [72, 14], [82, 26]].map(([x, y]) => rect(x! - 2.4, y! - 3, 4.8, 5, C.white, 1, C.ink, 0.8)),
    line('M46 76 L46 100', BLACK, 3.6), line('M44 34 L42 52', BLACK, 2), armTo(...SL(46), 32, 64, { top: C.dark }), armTo(...SR(46), 48, 92, { top: C.dark }, 58, 76)),
  'instr.panflöjt': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), ...range(9).map((i) => rect(18 + i * 9.6, 30, 8, 70 - i * 6, '#d9b06a', 3, C.ink, 1.3)), line('M16 48 L108 48 M16 54 L108 54', '#7a4320', 2),
    ...range(9).map((i) => ellipse(22 + i * 9.6, 30, 3, 1.2, '#5a3a22', null)), note8(100, 70, 1.1), note8(90, 84, 0.9)),
  // ── 4423 Bleckblåsinstrument ─────────────────────────────────────
  'instr.bleckblåsinstrument': all(ground(), tuba(92, 112, 0.9), horn(30, 82, 13), trumpet(10, 28, 0.95), trombone(34, 60, 0.8, 10)),
  'instr.trumpet': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), trumpet(12, 64, 1.8), sound(112, 64, 0.7, C.grey)),
  'instr.trombon': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), trombone(18, 72, 1.3, 26), sound(4, 50, 0.7, C.grey, -1)),
  'instr.ventil.5': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(trumpet(-30, 70, 2.6)), moving('instr-ventil-1', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,6px)}', { dur: 1.4 }, at(-30, 70, 2.6, 0, ...[18, 23, 28].map((vx) => all(rect(vx - 2, -6, 4, 18, BRASS, 1, C.ink, 0.6), rect(vx - 2.4, -9, 4.8, 3, SILVER, 1, HL, 0.8)))), path('M16 22 C20 16 30 16 34 22 L34 40 L16 40 Z', C.skin, C.ink, 1.4)),
    frame(10, 38, 66, 66)),
  'instr.valthorn': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), horn(48, 52, 26), sound(104, 98, 0.6, C.grey)),
  'instr.tuba': all(ground(), tuba(60, 112, 1.45), sound(60, 6, 0.6, C.grey, 1)),
  'instr.trumpetare': all(ground(), stander(38, { top: C.red, mood: 'calm' }), trumpet(40, 37, 1.1), armTo(...SL(38), 56, 40, { top: C.red }, 34, 60), armTo(...SR(38), 62, 34, { top: C.red }),
    note8(100, 22, 1.1), note8(108, 34, 0.9)),
  'instr.sordin': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), trumpet(0, 64, 1.7), path('M86 52 L104 60 L104 68 L86 76 Z', '#9aa0a8', C.ink, 1.4), rect(102, 59, 6, 10, '#7a8088', 2, C.ink, 1), ring(96, 64, 20),
    line('M112 50 c2 4 2 24 0 28', C.grey2, 1.4)),
  'instr.fanfar': all(rect(4, 70, 112, 42, '#d8c8a8', 0, null), rect(36, 30, 48, 44, '#c9c1b2', 1, C.ink, 1.6), path('M50 74 L50 54 C50 44 70 44 70 54 L70 74 Z', '#5a4636', C.ink, 1.4),
    stander(20, { top: C.navy }), stander(100, { top: C.navy }),
    g('translate(22 35) rotate(-40)', trumpet(0, 0, 0.8), path('M12 4 L28 4 L28 18 L20 14 L12 18 Z', C.red, C.ink, 1)), g('translate(98 35) scale(-1 1) rotate(-40)', trumpet(0, 0, 0.8), path('M12 4 L28 4 L28 18 L20 14 L12 18 Z', C.red, C.ink, 1)),
    armTo(...SR(20), 36, 30, { top: C.navy }), armTo(...SL(100), 84, 30, { top: C.navy }), sound(50, 8, 0.6, HL), sound(70, 8, 0.6, HL, -1)),
  'instr.blåsorkester': all(rect(4, 100, 112, 12, STAGE, 0, null), ...[[18, C.navy, 't'], [46, C.green, 'c'], [74, C.purple, 'h'], [100, C.orange, 'u']].map(([x, col, k]) => {
    const X = x as number, top = col as string;
    return all(line(`M${X + 14} 112 L${X + 14} 74 M${X + 8} 70 L${X + 20} 66`, C.dark, 1.6), chair(X, 112), sitter(X - 2, { top }),
      k === 't' ? trumpet(X + 6, 40, 0.5) : k === 'c' ? pipe(X + 8, 40, 30, { col: BLACK, w: 3, reed: 'single', bell: 3, holes: 4 }) : k === 'h' ? horn(X + 10, 66, 7) : tuba(X + 10, 92, 0.42));
  })),
  'instr.musikkår': all(ground(), ...[[22, 'drum'], [60, 'tuba'], [96, 'tpt']].map(([x, k], i) => {
    const X = x as number;
    return moving(`instr-musikkar-${i + 1}`, '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-2px)}', { dur: 0.8, delay: i * 0.2 },
      stander(X, { top: '#2f4a7a' }), rect(X - 8, 14, 16, 8, '#2f4a7a', 2, C.ink, 1.2), rect(X - 9, 21, 18, 2.4, BLACK, 1, null), circle(X, 14, 2, BRASS, null), line(`M${X - 10} 50 L${X + 10} 50`, BRASS, 1.4),
      k === 'drum' ? all(drum(X, 70, 11, 10, C.white), stick(X - 10, 58, X - 4, 68), stick(X + 10, 58, X + 4, 68)) : k === 'tuba' ? tuba(X + 4, 86, 0.6) : trumpet(X + 2, 36, 0.7));
  })),
  'instr.näverlur': all(rect(4, 70, 112, 42, '#9fcb84', 0, null), ...[[14, 70], [26, 66], [104, 68], [112, 72]].map(([x, y]) => path(`M${x! - 8} ${y} L${x} ${y! - 30} L${x! + 8} ${y} Z`, '#3f7a4a', C.ink, 1)),
    stander(36, { top: C.red, long: true, hair: '#d9b45a' }), path('M44 30 L104 10 L106 16 L46 34 Z', '#e9e3d6', C.ink, 1.4), line('M56 27 L56 31 M68 23 L70 27 M80 19 L82 24 M92 15 L94 20', C.ink, 1.2),
    armTo(...SR(36), 56, 30, { top: C.red }), armTo(...SL(36), 70, 26, { top: C.red }, 40, 60), sound(110, 12, 0.6, HL)),
  // ── 4424 Slagverk ────────────────────────────────────────────────
  'instr.slagverk': all(ground(), drum(26, 70, 18, 30, C.red), standLine(92, 30), cymbal(92, 30, 16, 6), xylo(52, 74, 56), triangleInst(28, 34, 0.8), tambourine(96, 94, 11)),
  'instr.trumma': all(ground(), drum(60, 54, 30, 50, '#a0673d'), line('M34 62 L46 108 M86 62 L74 108', '#f3ede0', 1.2), armTo(-4, 76, 42, 52, { top: C.green }), armTo(124, 76, 78, 52, { top: C.green }),
    sound(98, 30, 0.7, HL), sound(22, 30, 0.7, HL, -1)),
  'instr.trumma-verb': all(rect(4, 70, 112, 42, C.tan, 0, null), line('M4 70 L116 70', C.ink, 1.6), path('M2 64 C20 52 40 50 56 54 L56 70 L2 70 Z', C.skin, C.ink, 1.6),
    ...range(4).map((i) => moving(`instr-trumma-verb-${i + 1}`, '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-7px)}', { dur: 0.6, delay: i * 0.12 }, path(`M${56 + i * 10} 56 C${60 + i * 10} 54 ${64 + i * 10} 56 ${64 + i * 10} 60 L${64 + i * 10} 70 L${57 + i * 10} 70 Z`, C.skin, C.ink, 1.3))),
    ...range(4).map((i) => line(`M${60 + i * 10} 78 l-2 4 M${60 + i * 10} 78 l2 4`, HL, 1.4))),
  'instr.trumstock': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(drum(60, 84, 34, 18, C.red)), stick(16, 30, 98, 86), stick(104, 26, 24, 88)),
  'instr.cymbal': all(ground(), standLine(56, 50), cymbal(56, 50, 34, -6), stick(108, 18, 84, 42), sound(96, 56, 0.8, HL), sound(16, 46, 0.8, HL, -1)),
  'instr.trumset': all(ground(), stool(60), drumkit()),
  'instr.virveltrumma': all(ground(), line('M44 112 L60 82 L76 112 M60 82 L60 76', C.dark, 2), drum(60, 54, 30, 16, SILVER), line('M34 74 L86 74 M36 77 L84 77', '#8a8f98', 1, '2 1.4'),
    stick(16, 22, 48, 50), stick(104, 22, 72, 50)),
  'instr.virvel.2': all(ground(), line('M44 112 L60 82 L76 112 M60 82 L60 76', C.dark, 2), drum(60, 62, 30, 14, SILVER),
    moving('instr-virvel-1', '0%,100%{transform:rotate(0deg)}50%{transform:rotate(-14deg)}', { dur: 0.24, spin: true }, stick(14, 30, 50, 58)),
    moving('instr-virvel-2', '0%,100%{transform:rotate(-14deg)}50%{transform:rotate(0deg)}', { dur: 0.24, spin: true }, stick(106, 30, 70, 58)),
    line('M30 34 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 q4 4 8 0 q4 -4 8 0', HL, 2)),
  'instr.visp.2': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(drum(60, 70, 46, 24, SILVER)), line('M100 20 L64 62', BLACK, 3.4), ...range(9).map((i) => line(`M64 62 L${40 + i * 4} ${78 - Math.abs(i - 4) * 1.2}`, SILVER, 1)),
    path('M36 66 C40 58 70 58 80 66', 'none', HL, 2), arrow(76, 63, 82, 68, HL, 2), ring(56, 72, 22)),
  'instr.puka': all(ground(), ...[[36, 26], [86, 22]].map(([x, r]) => all(path(`M${x! - r!} 64 C${x! - r!} 92 ${x! + r!} 92 ${x! + r!} 64 Z`, '#c87a3e', C.ink, 1.8), line(`M${x! - r! * 0.6} 86 L${x! - r! * 0.7} 112 M${x! + r! * 0.6} 86 L${x! + r! * 0.7} 112`, C.dark, 2.4), ellipse(x!, 64, r!, r! * 0.28, '#f3ede0', C.ink, 1.6))),
    mallet(20, 30, 38, 58, '#f3ede0', 4), mallet(100, 30, 84, 58, '#f3ede0', 4)),
  'instr.xylofon': all(ground(), line('M20 112 L28 90 M100 112 L92 92', C.dark, 2.4), xylo(14, 62, 92), mallet(30, 30, 46, 64, C.red, 3.4), mallet(92, 28, 74, 60, C.red, 3.4)),
  'instr.triangel.2': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), circle(58, 18, 4, C.skin, C.ink, 1.2), line('M58 22 L58 34', C.ink, 1), triangleInst(58, 68, 1.6), line('M96 98 L66 82', SILVER, 2.4), circle(98, 99, 4, C.skin, C.ink, 1.2),
    sound(100, 56, 0.7, HL), sound(18, 56, 0.7, HL, -1)),
  'instr.tamburin': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), g('rotate(-14 60 56)', tambourine(60, 56, 34)), path('M28 98 C28 84 40 80 46 84 L50 92 L38 112 L26 112 Z', C.skin, C.ink, 1.4), sound(102, 30, 0.7, HL)),
  'instr.kastanjett': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), castanet(60, 50, 2.2, 7), path('M30 112 C30 94 40 86 52 86 L72 86 C84 86 90 94 90 112 Z', C.skin, C.ink, 1.6), line('M50 70 L50 86 M70 70 L70 86', C.red, 1.6),
    line('M18 42 l-8 -4 M18 54 l-10 0 M102 42 l8 -4 M102 54 l10 0', HL, 2)),
  'instr.gonggong': all(ground(), gong(56, 58, 32), mallet(110, 100, 92, 70, '#c84a4a', 6), sound(100, 34, 0.7, HL)),
  'instr.slagverkare': all(ground(), stander(60, { top: BLACK }), path('M16 82 C16 104 48 104 48 82 Z', '#c87a3e', C.ink, 1.6), ellipse(32, 82, 16, 4.4, '#f3ede0', C.ink, 1.4), xylo(70, 82, 44),
    standLine(98, 32), cymbal(98, 32, 14, 6), armTo(...SL(60), 34, 76, { top: BLACK }), armTo(...SR(60), 86, 80, { top: BLACK }), mallet(34, 76, 30, 80, '#f3ede0', 2.6), mallet(86, 80, 90, 86, C.red, 2.6)),
  // ── 4425 Klaverinstrument ────────────────────────────────────────
  'instr.piano': all(ground(), upright(60, 1.35)),
  'instr.tangent.3': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(keys(4, 40, 112, 60, 7)), rect(52, 40, 16, 60, C.white, 0.6, C.ink, 0.6),
    moving('instr-tangent-1', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,4px)}', { dur: 1.2 }, rect(52, 40, 16, 60, '#ffe2c8', 0.6, HL, 2), path('M52 112 C50 98 54 86 60 82 C64 80 68 82 68 88 C68 96 66 104 68 112 Z', C.skin, C.ink, 1.4)),
    ...[40, 80].map((x) => rect(x - 5, 40, 10, 36, BLACK, 0.6, C.ink, 0.5)), sound(62, 20, 0.6, HL)),
  'instr.klaviatur': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 44, 112, 8, '#3a2a24', 1, C.ink, 1.2), keys(4, 52, 112, 34, 21), rect(4, 86, 112, 6, '#3a2a24', 1, C.ink, 1.2),
    line('M6 36 L6 30 L114 30 L114 36', HL, 2.4), line('M6 100 L6 106 L114 106 L114 100', HL, 2.4)),
  'instr.klaverinstrument': all(ground(), upright(28, 0.62), at(84, 112, 0.5, 0, rect(-44, -96, 88, 66, '#c6a476', 2, C.ink, 2), ...range(9).map((i) => rect(-38 + i * 9, -90 + Math.abs(i - 4) * 5, 6, 56 - Math.abs(i - 4) * 5, SILVER, 2, C.ink, 1.2)), rect(-30, -30, 60, 30, WOOD2, 2, C.ink, 1.6), keys(-24, -26, 48, 8, 10)),
    accordion(30, 30, 0.7), at(84, 34, 0.7, 0, keys(-26, -8, 52, 16, 9)), frame(6, 6, 108, 104, C.grey2)),
  'instr.flygel.2': all(rect(4, 104, 112, 8, STAGE, 0, null), grand(56, 1.15)),
  'instr.pianist': all(rect(4, 104, 112, 8, STAGE, 0, null), grand(76, 0.95), stool(18, 112), sitter(14, { top: BLACK }), armTo(12, 56, 38, 72, { top: BLACK }, 26, 72), note8(30, 18, 1), note8(44, 10, 0.8)),
  'instr.pedal.3': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(rect(4, 8, 112, 70, '#3a2a24', 2, C.ink, 1.4)), rect(4, 78, 112, 34, FLOOR, 0, null), ...[36, 60, 84].map((px, i) => path(`M${px - 6} 96 L${px + 6} 96 L${px + 5} 82 L${px - 5} 82 Z`, BRASS, i === 2 ? HL : C.ink, i === 2 ? 2 : 1.2)),
    path('M78 94 C80 80 92 74 108 76 L116 78 L116 96 Z', BLACK, C.ink, 1.4), ring(84, 89, 14)),
  'instr.pianopall': all(ground(), greyed(upright(60, 1.25)), stool(60, 112, BLACK), rect(46, 84, 28, 8, '#3a2a24', 3, C.ink, 1.6), circle(42, 92, 3, SILVER, C.ink, 1), circle(78, 92, 3, SILVER, C.ink, 1), ring(60, 96, 22)),
  'instr.orgel': all(rect(4, 8, 112, 104, '#e9dfcc', 4, null), organ(60, 1.15)),
  'instr.organist': all(rect(4, 8, 112, 104, '#e9dfcc', 4, null), greyed(at(70, 112, 0.95, 0, rect(-44, -96, 88, 66, '#c6a476', 2, C.ink, 1.6), ...range(9).map((i) => rect(-38 + i * 9, -90 + Math.abs(i - 4) * 5, 6, 56 - Math.abs(i - 4) * 5, SILVER, 2, C.ink, 1)))),
    at(70, 112, 0.95, 0, rect(-30, -30, 60, 30, WOOD2, 2, C.ink, 1.6), keys(-24, -28, 48, 5, 12), keys(-24, -21, 48, 5, 12)), stool(24, 112, WOOD2), sitter(20, { top: C.purple }), armTo(18, 56, 46, 84, { top: C.purple }, 32, 76)),
  'instr.cembalo': all(rect(4, 104, 112, 8, '#e9dfcc', 0, null), line('M26 64 L22 108 M86 64 L90 108 M56 64 L56 108', '#5a3a22', 2.4), path('M18 50 L96 50 C108 50 108 64 96 64 L18 64 Z', '#2f5a4a', C.ink, 1.8), path('M18 50 L84 16 L90 20 L26 50 Z', '#2f5a4a', C.ink, 1.6),
    path('M30 44 L80 20 L84 22 L36 46 Z', '#e8d8a8', null), circle(58, 33, 4, '#d6a04a', null), rect(8, 52, 30, 12, '#2f5a4a', 1, C.ink, 1.2), keys(10, 54, 26, 9, 6, { natural: BLACK, sharp: C.white }), ring(23, 58, 16)),
  'instr.dragspel': all(ground(), stander(60, { top: C.green, mood: 'calm' }), accordion(60, 64, 1.05, 1.3), armTo(...SL(60), 30, 64, { top: C.green }), armTo(...SR(60), 90, 60, { top: C.green }), note8(16, 24, 1), note8(104, 22, 1)),
  'instr.fyrhändigt': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 30, 112, 10, '#3a2a24', 1, C.ink, 1.2), keys(4, 40, 112, 40, 21),
    ...[[18, C.denim], [42, C.denim], [74, C.orange], [98, C.orange]].map(([x, col]) => all(line(`M${x} 112 L${x} 78`, C.ink, 9.4), line(`M${x} 112 L${x} 78`, col as string, 7.4), ellipse(x as number, 72, 7, 8, C.skin, C.ink, 1.2))),
    line('M58 34 L58 112', C.grey, 1, '3 3')),
  'instr.pianostämmare': all(ground(), at(48, 112, 1.25, 0, rect(-34, -70, 68, 50, '#3a2a24', 3, C.ink, 1.8), rect(-30, -66, 60, 40, '#c9a46a', 2, C.ink, 1), line(range(12).map((i) => `M${-26 + i * 4.6} -62 L${-24 + i * 4.6} -30`).join(' '), SILVER, 0.8),
    line(range(12).map((i) => `M${-26 + i * 4.6} -62 l0 0.1`).join(' '), C.ink, 2), rect(-36, -22, 72, 6, '#3a2a24', 2, C.ink, 1.4), keys(-32, -20, 64, 8, 14), rect(-34, -12, 68, 12, '#3a2a24', 2, C.ink, 1.4)),
    stander(100, { top: C.denim }), line('M60 34 L76 34', SILVER, 3), rect(74, 30, 10, 8, BLACK, 2, C.ink, 1), armTo(...SL(100), 82, 36, { top: C.denim }), sound(30, 18, 0.6, HL, -1)),
  'instr.ackompanjera': all(rect(4, 104, 112, 8, STAGE, 0, null), upright(86, 0.8), stool(56, 112), sitter(52, { top: C.navy }), armTo(50, 56, 70, 86, { top: C.navy }, 60, 74), stander(20, { top: C.red, long: true, mood: 'o' }),
    moving('instr-ackomp-1', '0%{transform:translate(0,10px);opacity:0}40%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, note8(24, 10, 1, C.red)),
    moving('instr-ackomp-2', '0%{transform:translate(0,10px);opacity:0}40%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4, delay: 0.6 }, note8(90, 14, 0.9), note8(100, 24, 0.7))),
  // ── 4426 Gitarr och bas ──────────────────────────────────────────
  'instr.gitarr': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), guitar(56, 72, 1.15, 30)),
  'instr.gitarrist': all(ground(), stander(46, { top: C.orange, mood: 'calm' }), guitar(52, 66, 0.72, 62), armTo(...SR(46), 82, 44, { top: C.orange }, 70, 62), armTo(...SL(46), 46, 70, { top: C.orange }, 30, 66), note8(96, 74, 1), note8(106, 86, 0.8)),
  'instr.akustisk': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(eguitar(26, 66, 0.8, 0), amp(6, 96, 30, 14), cable('M26 86 C26 94 20 96 20 96')), guitar(80, 70, 0.95, 14), sound(86, 70, 0.9, HL),
    path('M44 36 l6 -4 l4 6 l-6 4 Z M50 34 l2 -4 M54 38 l3 -2', 'none', C.grey, 1.4), cross(50, 36, 7)),
  'instr.elgitarr': all(ground(), eguitar(44, 66, 1.05, 18, { col: C.red }), amp(80, 74, 32, 38), cable('M50 90 C56 108 70 108 82 100')),
  'instr.elbas': all(ground(), greyed(eguitar(32, 88, 0.75, 0, { col: C.red })), eguitar(80, 88, 0.75, 0, { col: C.denim, strings: 4, neck: 100 }), frame(62, 6, 38, 104)),
  'instr.basist': all(ground(), stander(40, { top: C.green }), eguitar(52, 72, 0.7, 64, { col: C.denim, strings: 4, neck: 100 }), armTo(...SR(40), 104, 34, { top: C.green }, 80, 46), armTo(...SL(40), 46, 76, { top: C.green }, 26, 70),
    note8(18, 22, 1.3, C.navy), note8(30, 14, 1.1, C.navy)),
  'instr.greppbräda': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 48, 112, 26, '#5a3a22', 2, C.ink, 1.6), ...range(6).map((i) => line(`M${12 + i * 20} 48 L${12 + i * 20} 74`, SILVER, 2)),
    ...range(6).map((i) => line(`M4 ${52 + i * 3.6} L116 ${52 + i * 3.6}`, '#efeae0', 0.8)), circle(42, 62, 2, '#efe4c8', null), circle(82, 62, 2, '#efe4c8', null),
    path('M48 112 C46 92 50 74 58 66 C62 62 66 64 66 70 C66 80 62 92 64 112 Z', C.skin, C.ink, 1.4), frame(2, 44, 116, 34)),
  'instr.stämskruv': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(rect(48, 70, 24, 42, '#5a3a22', 2, C.ink, 1.4)), path('M44 72 L40 14 L80 14 L76 72 Z', '#5a3a22', C.ink, 1.6),
    ...[24, 40, 56].map((y) => all(line(`M44 ${y} L28 ${y}`, SILVER, 3), ellipse(22, y, 6, 4, '#f3ede0', C.ink, 1.2), line(`M76 ${y} L92 ${y}`, SILVER, 3), ellipse(98, y, 6, 4, '#f3ede0', C.ink, 1.2))),
    line('M52 18 L52 112 M57 18 L57 112 M62 18 L62 112 M67 18 L67 112', '#efeae0', 0.8), ring(98, 40, 11), path('M108 30 A12 12 0 0 1 108 50', 'none', HL, 2), arrow(110, 46, 107, 52, HL, 2)),
  'instr.stämapparat': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(path('M38 112 L36 60 L64 60 L62 112 Z', '#5a3a22', C.ink, 1.4)), line('M50 70 L50 50', C.dark, 3),
    rect(26, 14, 48, 38, BLACK, 6, C.ink, 1.6), rect(30, 18, 40, 30, '#cfe8c8', 3, null), path('M34 42 A16 16 0 0 1 66 42', 'none', C.dark, 1.2), line('M50 44 L50 24', C.green, 2.6), circle(50, 44, 2, C.dark, null),
    line('M36 34 l3 2 M64 34 l-3 2 M50 26 l0 0', C.dark, 1), circle(82, 30, 6, C.green, C.ink, 1.2), line('M79 30 L81 33 L86 27', C.white, 1.6)),
  'instr.plektrum': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), path('M40 30 C40 18 80 18 80 30 C80 46 66 62 60 70 C54 62 40 46 40 30 Z', C.red, C.ink, 2), path('M48 30 C48 24 72 24 72 30', 'none', '#f08a8a', 2),
    path('M8 112 C10 90 26 76 46 74 L54 82 C40 88 30 98 30 112 Z', C.skin, C.ink, 1.6), path('M112 112 C110 92 96 80 74 76 L66 84 C84 90 92 100 92 112 Z', C.skin, C.ink, 1.6)),
  'instr.slå-an': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), at(60, 74, 2.2, 0, path(GUITAR, WOODL, C.ink, 1)), circle(60, 74, 11, '#4a2a14', C.ink, 1.4), line('M53 8 L53 112 M56 8 L56 112 M59 8 L59 112 M62 8 L62 112 M65 8 L65 112 M68 8 L68 112', '#efeae0', 1),
    moving('instr-sla-an-1', '0%{transform:translate(0,-26px)}60%,100%{transform:translate(0,10px)}', { dur: 1 }, path('M76 52 C86 46 104 50 110 62 L96 70 C90 62 82 60 76 60 Z', C.skin, C.ink, 1.4), path('M70 58 L78 54 L80 62 L74 64 Z', C.red, C.ink, 1)),
    sound(96, 28, 0.7, HL), sound(24, 28, 0.7, HL, -1)),
  'instr.kapodaster': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 48, 112, 26, '#5a3a22', 2, C.ink, 1.6), ...range(6).map((i) => line(`M${12 + i * 20} 48 L${12 + i * 20} 74`, SILVER, 2)),
    ...range(6).map((i) => line(`M4 ${52 + i * 3.6} L116 ${52 + i * 3.6}`, '#efeae0', 0.8)), rect(44, 40, 10, 42, BLACK, 3, C.ink, 1.6), rect(46, 34, 6, 8, SILVER, 2, C.ink, 1), path('M54 40 C66 30 70 24 64 18', 'none', BLACK, 3.4), ring(49, 61, 26)),
  'instr.ukulele': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(guitar(36, 70, 1, 0)), guitar(84, 78, 0.62, 0, { col: '#e09a5a', strings: 4 }), frame(66, 22, 36, 82)),
  'instr.banjo': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), at(60, 64, 1.1, 30, rect(-3, -70, 6, 56, '#5a3a22', 1, C.ink, 1), path('M-4 -70 L-5 -80 L5 -80 L4 -70 Z', '#5a3a22', C.ink, 1), circle(0, 0, 24, SILVER, C.ink, 1.6), circle(0, 0, 20, '#f3ede0', C.ink, 1.2),
    ...range(12).map((i) => { const a = i * Math.PI / 6; return circle(f1(Math.cos(a) * 22), f1(Math.sin(a) * 22), 1.2, C.dark, null); }), line('M-1.5 -78 L-1.5 14 M-0.5 -78 L-0.5 14 M0.5 -78 L0.5 14 M1.5 -78 L1.5 14', '#efeae0', 0.5), rect(-5, 8, 10, 2, BLACK, 0.6, null))),
  // ── 4427 Elektroniska instrument ─────────────────────────────────
  'instr.elektronisk': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(fiddle(20, 64, 0.8)), rect(48, 70, 64, 26, '#3d3f4a', 3, C.ink, 1.6), keys(52, 82, 56, 12, 10), ...range(5).map((i) => circle(56 + i * 8, 76, 2, HL, C.ink, 0.6)),
    rect(66, 24, 26, 26, BLACK, 2, C.ink, 1.4), ...range(4).map((i) => line(`M${70 + i * 6} 24 L${70 + i * 6} 18 M${70 + i * 6} 50 L${70 + i * 6} 56 M66 ${28 + i * 6} L60 ${28 + i * 6} M92 ${28 + i * 6} L98 ${28 + i * 6}`, SILVER, 1.6)),
    path('M76 30 L82 30 L78 37 L84 37 L74 46 L77 38 L72 38 Z', C.yellow, C.ink, 0.8), line('M79 56 L79 70', HL, 1.6, '2 2'), frame(44, 14, 72, 86)),
  'instr.synt': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(6, 40, 108, 50, '#3d3f4a', 4, C.ink, 1.8), rect(12, 46, 30, 14, '#bfe3f5', 2, C.ink, 1), path('M14 53 Q18 46 22 53 T30 53 T38 53', 'none', C.denim, 1.4),
    ...range(6).map((i) => all(circle(52 + i * 10, 50, 3.6, '#5a5a62', C.ink, 1), line(`M${52 + i * 10} 50 L${52 + i * 10 + 2} 47`, C.white, 1))), ...range(5).map((i) => all(line(`M${52 + i * 10} 56 L${52 + i * 10} 62`, C.ink, 1.4), rect(50 + i * 10, 57 + (i % 3), 4, 2.4, HL, 0.6, null))),
    keys(10, 66, 100, 20, 17), cable('M96 46 C100 30 108 30 110 40')),
  'instr.keyboard': all(ground(), line('M30 112 L90 70 M90 112 L30 70', C.dark, 2.4), rect(8, 56, 104, 26, C.white, 4, C.ink, 1.6), rect(12, 59, 16, 8, '#5a5a62', 2, null), rect(92, 59, 16, 8, '#5a5a62', 2, null),
    line('M14 61 L26 61 M14 63 L26 63 M14 65 L26 65 M94 61 L106 61 M94 63 L106 63 M94 65 L106 65', '#3e3e46', 0.6), rect(48, 59, 24, 7, '#9fd0a0', 1, C.ink, 0.8), ...range(4).map((i) => circle(34 + i * 4, 63, 1.4, [C.red, C.yellow, C.green, C.denim][i]!, null)),
    keys(12, 68, 96, 12, 17)),
  'instr.trummaskin': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(18, 18, 84, 84, '#3d3f4a', 6, C.ink, 1.8), rect(26, 24, 40, 12, '#bfe3f5', 2, C.ink, 1),
    ...range(16).map((i) => rect(26 + (i % 4) * 18, 42 + Math.floor(i / 4) * 14, 14, 10, [0, 5, 10, 15, 2, 8].includes(i) ? HL : '#8a8f98', 2, C.ink, 1)), ...range(2).map((i) => circle(80 + i * 12, 30, 4, '#5a5a62', C.ink, 1)),
    waPulse('instr-trummaskin-1', rect(26, 42, 14, 10, C.yellow, 2, C.ink, 1))),
  'instr.ratt.2': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), rect(4, 30, 112, 60, BLACK, 4, C.ink, 1.6), ...[20, 100].map((x) => greyed(circle(x, 60, 10, '#5a5a62', C.ink, 1.2))),
    circle(60, 60, 18, '#5a5a62', C.ink, 1.8), line('M60 60 L72 48', C.white, 2.6), ...range(7).map((i) => { const a = Math.PI * (0.75 + i * 0.25); return line(`M${f1(60 + Math.cos(a) * 22)} ${f1(60 + Math.sin(a) * 22)} L${f1(60 + Math.cos(a) * 26)} ${f1(60 + Math.sin(a) * 26)}`, C.white, 1.4); }),
    path('M40 34 A28 28 0 0 1 84 36', 'none', HL, 2.4), arrow(80, 32, 86, 38, HL, 2.4), ring(60, 60, 30)),
  'instr.loop.3': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), ...range(3).map((i) => all(rect(8 + i * 36, 50, 32, 20, i === 0 ? '#ffe2c8' : '#eef1f4', 2, i === 0 ? HL : C.grey, 1.6),
    path(`M${10 + i * 36} 60 l4 -6 l4 10 l4 -8 l4 6 l4 -4 l4 2`, 'none', i === 0 ? C.ink : C.grey, 1.4))), path('M24 46 C24 20 96 20 96 46', 'none', HL, 2.4), arrow(92, 40, 96, 46, HL, 2.4),
    path('M96 74 C96 100 24 100 24 74', 'none', HL, 2.4), arrow(28, 80, 24, 74, HL, 2.4)),
  'instr.sampla': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), line('M18 40 L18 26', C.dark, 2), path('M14 26 C14 16 22 16 22 26 Z', '#5a5a62', C.ink, 1.2), path('M8 60 C8 52 18 50 22 56 L30 54 L24 60 C22 66 12 68 8 60 Z', '#7aa0c8', C.ink, 1.2),
    rect(56, 64, 56, 40, '#3d3f4a', 4, C.ink, 1.6), ...range(8).map((i) => rect(60 + (i % 4) * 13, 70 + Math.floor(i / 4) * 14, 10, 10, i === 0 ? HL : '#8a8f98', 2, C.ink, 1)),
    waIn('instr-sampla-1', -40, -20, rect(60, 30, 30, 16, '#ffe2c8', 2, HL, 1.6), path('M62 38 l3 -5 l3 10 l3 -8 l3 6 l3 -4 l3 3 l3 -2', 'none', C.ink, 1.2)), arrow(76, 48, 66, 68, HL, 2)),
  'instr.effektpedal': all(rect(4, 80, 112, 32, FLOOR, 0, null), greyed(eguitar(20, 50, 0.7, 10)), cable('M28 70 C30 92 34 96 40 96'), cable('M84 96 C96 96 98 84 98 76'), amp(84, 40, 30, 36),
    rect(40, 82, 44, 26, '#3f9a5a', 4, C.ink, 1.8), circle(50, 88, 3, '#5a5a62', C.ink, 0.8), circle(74, 88, 3, '#5a5a62', C.ink, 0.8), circle(62, 100, 5, SILVER, C.ink, 1.2), circle(62, 87, 1.6, C.red, null),
    path('M44 82 C46 70 56 64 70 64 L80 66 C84 68 84 74 80 76 L66 80 C58 82 52 84 44 84 Z', '#5a3a22', C.ink, 1.6), line('M44 84 L80 76', C.ink, 2), ring(62, 94, 24)),
  'instr.distorsion': all(rect(4, 8, 112, 104, '#fbf4e6', 4, null), greyed(path('M8 36 Q20 14 32 36 T56 36 T80 36 T104 36', 'none', C.ink, 2.4)), line('M4 52 L116 52', C.grey2, 1, '3 3'),
    line('M8 82 L14 66 L30 66 L36 98 L52 98 L58 66 L74 66 L80 98 L96 98 L102 66 L112 66', HL, 3), ...[[22, 62], [44, 102], [66, 62], [88, 102]].map(([x, y]) => line(`M${x! - 4} ${y} l3 -3 l2 3 l3 -3`, HL, 1.4))),
  'instr.theremin': all(ground(), line('M50 112 L50 76 M40 112 L50 100 L60 112', C.dark, 2.4), rect(26, 64, 48, 14, WOOD2, 3, C.ink, 1.6), line('M70 64 L70 14', SILVER, 2.4), path('M26 70 C14 70 10 60 18 56 C26 52 30 60 26 64', 'none', SILVER, 2.4),
    stander(96, { top: C.purple, long: true, mood: 'calm' }), armTo(...SL(96), 78, 34, { top: C.purple }, 84, 44), armTo(86, 48, 32, 52, { top: C.purple }, 60, 60),
    waBob('instr-theremin-1', 3, line('M76 26 q-2 4 0 8', HL, 1.6)), sound(60, 18, 0.5, HL, -1)),
};
