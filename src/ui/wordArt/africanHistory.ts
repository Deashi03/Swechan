/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Afrikas historia, 2441–2447 (0.41): the Nile and
 * Nubia, the old West African kingdoms, the trade routes across the Sahara, the Swahili coast, the colonial era, the
 * struggle for independence and modern African societies. Recurring signs: people with brown skin in bright robes,
 * wraps and head cloths (and in ordinary modern clothes in the modern scenes), warm sand and clay colours, a blue
 * river, simple maps of Africa with a highlighted part, grey-suited colonial officials with pith helmets, and an
 * orange highlight ring on the thing that the word names. Scripts are loose strokes that spell nothing; flags and
 * banners are plain colour fields. Digits only; no words, no brands, no pointing fingers. Abstract words are small
 * symbolic scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, bubble, note } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e4f1fa';
const SAND = '#ecd49a';
const SAND2 = '#d9b56e';
const DUNE = '#e8c27a';
const DUNE2 = '#c99a4e';
const GRASS = '#8cc96a';
const GRASS2 = '#5f9a46';
const RIVER = '#7dbbe3';
const RIVER2 = '#4a90c4';
const SEA = '#8fc6e6';
const CLAY = '#b9824f';
const CLAY2 = '#8f5f34';
const MUD = '#5a3e28';
const STONE = '#b8b0a2';
const STONE2 = '#8f887c';
const CORAL = '#efe4cf';
const WOOD = '#a0673d';
const IVORY = '#f7efd8';
const EBONY = '#2b2420';
const IRON = '#5b6270';
const GOLD = C.gold;
const RED = '#c8372d';
const INDIGO = '#3f4f9a';
const KHAKI = '#c9b98a';
const LAND = '#a8c98a';
const LAND2 = '#d9c48a';
const SK1 = '#8a5a3c';
const SK2 = '#6b4430';
const SK3 = '#a8744e';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const sunD = (x: number, y: number, r = 7) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, GOLD, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const waves = (x1: number, x2: number, y: number, col = RIVER2) => line(Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.1);
const palm = (x: number, y = 112, s = 1) => at(x, y, s, path('M-1.5 0 C-2 -10 0 -18 2 -26 L4 -26 C2 -18 1 -10 1.5 0 Z', WOOD, C.ink, 1), ...[-60, -25, 10, 45, 80].map((a) => g(`translate(3 -26) rotate(${a})`, path('M0 0 C-4 -4 -12 -4 -16 0 C-12 -2 -4 -1 0 0 Z', GRASS2, C.ink, 0.9))));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const ban = (x: number, y: number, r = 10, w = 2.6) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const scribble = (x: number, y: number, w: number, n: number, gap = 4, col: string = C.ink) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} q2 -2 4 0 t4 0 t4 0${w > 16 ? ' t4 0 t4 0' : ''}`).join(' '), col, 0.9);
const coin = (x: number, y: number, r = 3.4) => all(circle(x, y, r, GOLD, C.ink, 0.9), circle(x, y, f1(r * 0.5), 'none', '#b88a20', 0.7));

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const armS = (x1: number, y1: number, x2: number, y2: number, sk: string, w = 5) => line(`M${x1} ${y1} L${x2} ${y2}`, sk, w) + line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 0.6);
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, sk: string = SK1) => { const q = geo(x, h); return all(armS(side < 0 ? q.sl : q.sr, q.sy, tx, ty, sk, f1(5 * Math.max(0.6, h))), circle(tx, ty, f1(3 * Math.max(0.6, h)), sk, C.ink, 1.1)); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; torso −42…2; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, skin: SK1, ...more });
/** A long robe (boubou) with wide sleeves (figure coordinates); hands at (±22, −5). */
const robe = (col: string, trim: string = GOLD, sk: string = SK1) => all(
  path('M-14 -42 L14 -42 C17 -10 19 20 20 46 L-20 46 C-19 20 -17 -10 -14 -42 Z', col, C.ink, 2),
  path('M-14 -41 L-28 -14 L-26 -2 L-15 -8 Z M14 -41 L28 -14 L26 -2 L15 -8 Z', col, C.ink, 1.8),
  path('M-6 -42 L0 -30 L6 -42', 'none', trim, 2), line('M-8 -24 L8 -24 M-6 -18 L6 -18', trim, 1.2),
  circle(-23, -4, 3.2, sk, C.ink, 1.2), circle(23, -4, 3.2, sk, C.ink, 1.2));
/** A person in a robe. */
const robed = (x: number, col: string, mood: Mood = 'calm', more: Partial<Build> = {}, ...extra: Svg[]) => { const h = more.h ?? 1; return all(fig(x, col, mood, { bottom: col, ...more }), on(x, h, robe(col, more.grey ? C.grey2 : GOLD, more.grey ? C.grey2 : (more.skin ?? SK1)), ...extra)); };
/** Head wear (figure coordinates). */
const headwrap = (col: string) => all(path('M-11 -60 C-12 -74 12 -74 11 -60 C6 -64 -6 -64 -11 -60 Z', col, C.ink, 1.3), path('M-11 -66 C-4 -70 4 -70 11 -66', 'none', C.ink, 0.8));
const turban = (col: string = INDIGO) => all(path('M-12 -58 C-13 -72 13 -72 12 -58 Z', col, C.ink, 1.3), path('M-12 -62 C-4 -66 4 -66 12 -62 M-11 -66 C-4 -69 4 -69 11 -66', 'none', C.ink, 0.7));
const crownK = all(path('M-9 -64 L-9 -76 C-9 -82 9 -82 9 -76 L9 -64 Z', GOLD, C.ink, 1.2), circle(0, -73, 2, RED, C.ink, 0.7), line('M-9 -66 L9 -66', '#b88a20', 1.2));
const crownS = all(path('M-10 -63 L-10 -72 L-5 -68 L0 -75 L5 -68 L10 -72 L10 -63 Z', GOLD, C.ink, 1.1), circle(0, -71, 1.3, RED, null));
const helmet = (col: string = KHAKI) => all(path('M-12 -60 C-12 -74 12 -74 12 -60 Z', col, C.ink, 1.2), path('M-16 -60 L16 -60 L13 -57 L-13 -57 Z', col, C.ink, 1));
const tophat = all(rect(-8, -78, 16, 16, C.black, 1, C.ink, 1), rect(-13, -63, 26, 3, C.black, 1, C.ink, 1));
/** A grey-suited colonial official with a pith helmet (light skin). */
const official = (x: number, mood: Mood = 'calm', h = 1) => all(F({ x, top: '#d8d2bc', bottom: '#d8d2bc', mood, h }), on(x, h, helmet()));
const kora = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -40', WOOD, 2.4), circle(0, 4, 10, '#c98a4a', C.ink, 1.3), circle(0, 4, 5, '#7a4a24', null), line('M-3 -36 L-3 6 M0 -38 L0 6 M3 -36 L3 6', '#f4ead0', 0.6));
const pickaxe = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 0 L0 -22', WOOD, 2.4), path('M-10 -20 C-4 -25 4 -25 10 -20 L8 -22 C3 -26 -3 -26 -8 -22 Z', IRON, C.ink, 1));
/** Simple map of Africa (in a 120 box). */
const AFRICA = 'M34 18 C46 12 66 12 78 18 L86 26 C90 30 98 32 108 36 C104 46 98 52 92 58 C90 68 88 78 82 88 C76 98 70 106 62 110 C58 102 56 92 54 82 C52 74 48 66 42 62 C32 62 20 58 14 50 C10 42 12 32 18 26 C24 20 28 20 34 18 Z';
const africa = (fill: string = LAND, sw = 1.4) => path(AFRICA, fill, C.ink, sw);
const camel = (x: number, y: number, s = 1, flip = false, col = '#c9a36a') => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...[-12, -6, 8, 12].map((d) => line(`M${d} -10 L${d} 4`, '#b8925a', 2.6)), path('M-16 -10 C-16 -18 -12 -22 -6 -22 C-2 -30 6 -30 8 -22 C14 -20 16 -14 14 -10 Z', col, C.ink, 1.2),
  path('M14 -14 L20 -26 L26 -26 L27 -23 L22 -22 L18 -12 Z', col, C.ink, 1.1), circle(23, -25, 0.8, C.ink, null));
const saltSlab = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -5, 20, 10, '#f2f2ee', 1, C.ink, 1.1), line('M-8 -2 L-2 1 M2 -3 L7 0', '#c9ced4', 0.8));
const goldBag = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 C-9 -8 -4 -12 -3 -14 L3 -14 C4 -12 9 -8 7 0 Z', '#b07a46', C.ink, 1.1), line('M-3 -12 L3 -12', C.ink, 1), sparkle(6, -16, 2, C.yellow));
const cowrie = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ellipse(0, 0, 4, 6, '#f7f1e2', C.ink, 0.9), line('M0 -5 L0 5', C.ink, 0.9), line('M-1 -3 L1 -3 M-1 -1 L1 -1 M-1 1 L1 1 M-1 3 L1 3', C.ink, 0.5));
const ballotPaper = (x: number, y: number, cols: string[], tick = -1, crossOthers = false) => all(rect(x - 14, y - 4, 28, 8 + cols.length * 8, C.white, 1, C.ink, 1.2), ...cols.map((c, i) => all(circle(x - 8, y + 4 + i * 8, 2.6, c, C.ink, 0.7), line(`M${x - 3} ${y + 4 + i * 8} L${x + 6} ${y + 4 + i * 8}`, C.grey, 1.2), rect(x + 8, y + 1.5 + i * 8, 4, 5, 'none', 0, C.ink, 0.7),
  i === tick ? line(`M${x + 8} ${y + 4 + i * 8} l2 2 l3 -5`, '#3a9a5a', 1.6) : crossOthers ? line(`M${x - 12} ${y + 4 + i * 8} L${x + 12} ${y + 4 + i * 8}`, C.red, 1.4) : '')));
const bars = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, 3, IRON, 0, C.ink, 0.8), rect(x, y + h - 3, w, 3, IRON, 0, C.ink, 0.8), ...Array.from({ length: Math.floor(w / 7) + 1 }, (_, i) => line(`M${x + i * 7} ${y} L${x + i * 7} ${y + h}`, IRON, 2.2)));
const building = (x: number, y: number, w: number, h: number, col: string) => all(rect(x - w / 2, y - h, w, h, col, 0.5, C.ink, 1), ...Array.from({ length: Math.floor((h - 4) / 6) }, (_, r) => all(...Array.from({ length: Math.max(1, Math.floor((w - 2) / 5)) }, (_, c) => rect(x - w / 2 + 2 + c * 5, y - h + 3 + r * 6, 2.6, 3, '#e8f2fa', 0, null)))));

/** A seated member of parliament seen from the front (small), centred at (x, y). */
const mp = (x: number, y: number, col: string, sk: string = SK1) => all(path(`M${x - 4} ${y + 6} C${x - 4} ${y + 1} ${x + 4} ${y + 1} ${x + 4} ${y + 6} Z`, col, C.ink, 0.7), circle(x, y - 1, 2.4, sk, C.ink, 0.6));
/** Seats in a half circle around (cx, cy): one colour per sector. */
const chamber = (cx: number, cy: number, r0: number, rows: number, cols: string[], sk: string[] = [SK1, SK2, SK3]) => all(...Array.from({ length: rows }, (_, r) => { const rr = r0 + r * 9, n = 7 + r * 2; return all(...Array.from({ length: n }, (_, i) => { const a = Math.PI + (i / (n - 1)) * Math.PI, x = f1(cx + Math.cos(a) * rr), y = f1(cy + Math.sin(a) * rr); return mp(x, y, cols[Math.min(cols.length - 1, Math.floor((i / n) * cols.length))]!, sk[(i + r) % sk.length]!); })); }));

// ── Motifs ───────────────────────────────────────────────────────────
export const AFRICAN_HISTORY_MOTIFS: Record<string, Svg> = {
  // 2441 Nilen och Nubien
  'afr.Nubien': all(rect(4, 4, 112, 108, SEA, 3, null), africa(LAND2), path('M66 16 C70 30 64 40 70 50 C74 58 70 64 72 70', 'none', RIVER2, 2.4), path('M64 32 C74 30 78 36 76 44 C76 52 70 56 64 54 C60 46 58 38 64 32 Z', HL, C.ink, 1.2),
    path('M66 16 C70 30 64 40 70 50', 'none', RIVER2, 2.4), line('M62 30 L72 30 M60 56 L72 56', C.ink, 1.4), ring(68, 43, 18), at(98, 96, 1, line('M-6 0 L6 0 M0 -6 L0 6', C.ink, 1.2), path('M0 -12 L-3 -6 L3 -6 Z', C.ink, null))),
  'afr.floddal': all(bg('#f6e9c6'), path('M4 40 L116 40 L116 112 L4 112 Z', SAND, null), path('M4 40 C20 36 30 44 44 40 L76 40 C90 44 100 36 116 40', 'none', SAND2, 1.4), path('M54 40 L66 40 L104 112 L16 112 Z', GRASS, C.ink, 1.2), path('M58 40 L62 40 L72 112 L46 112 Z', RIVER, C.ink, 1.2),
    palm(36, 96, 0.8), palm(86, 100, 0.8), palm(28, 110, 0.6), ...[[40, 86], [74, 78], [82, 96]].map(([x, y]) => rect(x! - 3, y! - 2, 6, 3, GRASS2, 0, null)), sunD(98, 20, 6), oval(60, 84, 34, 30)),
  'afr.katarakt': all(bg('#f6e9c6'), path('M4 30 L116 30 L116 112 L4 112 Z', SAND, null), path('M4 46 C40 40 80 40 116 46 L116 92 C80 98 40 98 4 92 Z', RIVER, C.ink, 1.2), ...[[24, 68, 9], [44, 60, 7], [52, 78, 10], [72, 66, 8], [92, 74, 9], [34, 84, 6], [84, 56, 6]].map(([x, y, r]) => ellipse(x!, y!, r!, f1(r! * 0.6), STONE, C.ink, 1.2)),
    ...[[30, 62], [60, 70], [82, 64], [40, 76], [70, 84], [96, 82], [16, 80]].map(([x, y]) => path(`M${x! - 6} ${y} q3 -4 6 0 t6 0`, 'none', C.white, 2)), at(98, 52, 0.7, path('M-12 0 C-6 4 6 4 12 0 L10 -4 L-10 -4 Z', WOOD, C.ink, 1.2)), arrow(10, 54, 28, 56, RIVER2, 2), oval(58, 70, 50, 22)),
  'afr.slam': all(bg(), path('M4 54 L40 54 C34 70 30 90 26 112 L4 112 Z', RIVER, C.ink, 1.2), waves(6, 30, 66), arrow(44, 62, 22, 62, RIVER2, 2.4), path('M40 54 L116 54 L116 112 L26 112 C30 90 34 70 40 54 Z', '#c9a36a', C.ink, 1.2),
    path('M38 60 L116 60 L116 92 L32 92 C34 80 36 70 38 60 Z', MUD, C.ink, 1), ...[[52, 72], [66, 80], [80, 70], [94, 82], [106, 72], [60, 64], [88, 62]].map(([x, y]) => all(line(`M${x} ${y} l0 -6 M${x} ${y! - 3} l-3 -3 M${x} ${y! - 4} l3 -3`, '#7ed36a', 1.6))), oval(74, 76, 42, 18), sunD(96, 22, 6)),
  'afr.elfenben': all(bg('#f3ece2'), field(100, '#d8c28a'), at(38, 58, 1, ellipse(14, 10, 26, 18, '#9aa3ad', C.ink, 1.4), ...[0, 10, 22, 32].map((d) => rect(d - 6, 20, 8, 22, '#9aa3ad', 2, C.ink, 1.2)), circle(-12, -2, 14, '#9aa3ad', C.ink, 1.4), path('M-6 -12 C6 -18 10 0 0 8 C-4 4 -6 -4 -6 -12 Z', '#8a929c', C.ink, 1.1),
    path('M-22 4 C-28 14 -28 30 -22 38 L-18 36 C-22 28 -22 16 -16 8 Z', '#9aa3ad', C.ink, 1.2), path('M-18 6 C-30 10 -36 0 -34 -8 C-30 -2 -24 0 -16 2 Z', IVORY, C.ink, 1.3), circle(-14, -6, 1.4, C.ink, null)), ring(14, 52, 12),
    rect(62, 92, 50, 8, '#c8372d', 2, C.ink, 1.2), path('M66 90 C74 76 92 70 108 74 C94 76 80 82 72 92 Z', IVORY, C.ink, 1.4), at(100, 90, 0.9, path('M-4 0 L-4 -12 C-4 -18 4 -18 4 -12 L4 0 Z', IVORY, C.ink, 1.1), circle(0, -18, 4, IVORY, C.ink, 1.1)), arrow(30, 50, 66, 78, HL, 2.2), ring(88, 84, 20)),
  'afr.ebenholts': all(bg('#f3ece2'), at(36, 76, 1, rect(-22, -14, 44, 28, '#3a2a22', 3, C.ink, 1.4), ellipse(22, 0, 7, 14, EBONY, C.ink, 1.4), ellipse(22, 0, 4.4, 9, '#4a3a30', C.ink, 0.6), ellipse(22, 0, 2, 4, EBONY, null), line('M-18 -6 L14 -6 M-18 4 L14 4', '#4a3a30', 0.8)),
    at(86, 104, 1, rect(-14, -6, 28, 6, EBONY, 1, C.ink, 1.2), path('M-10 -6 L-12 -20 L12 -20 L10 -6 Z', EBONY, C.ink, 1.2), line('M-12 0 L-12 6 M12 0 L12 6', EBONY, 3), sparkle(14, -26, 2.4)),
    greyed(at(84, 34, 1, rect(-16, -6, 32, 12, '#e8d4a8', 2, C.ink, 1.2), line('M-12 -2 L12 -2 M-12 2 L10 2', '#c9a36a', 0.8))), ring(42, 76, 30)),
  'afr.kandake': all(bg('#f6eedc'), rect(4, 98, 112, 14, '#c9a36a', 0, null), at(60, 100, 1.5, rect(-16, -30, 32, 30, GOLD, 3, C.ink, 1.3), rect(-20, -8, 40, 8, RED, 2, C.ink, 1.2)),
    robed(60, '#2f7a6a', 'calm', { h: 0.84, hairStyle: 'long', skin: SK2 }, crownK, path('M-12 -40 C-6 -34 6 -34 12 -40', 'none', GOLD, 2.4)), on(60, 0.84, line('M23 -4 L23 -70', GOLD, 2), path('M20 -74 L23 -82 L26 -74 Z', GOLD, C.ink, 0.8)),
    stand(18, 112, 0.42, robed(60, '#c87a3a', 'calm', { skin: SK3 }, headwrap('#e8d4a8'))), stand(102, 112, 0.42, robed(60, '#c87a3a', 'calm', { skin: SK1 }, headwrap('#e8d4a8'))), ring(60, 30, 14)),
  'afr.järnframställning': all(bg('#f3ece2'), field(98, '#c9b088'), at(54, 100, 1, path('M-16 0 L-12 -40 C-10 -48 10 -48 12 -40 L16 0 Z', CLAY, C.ink, 1.6), path('M-6 -46 C-4 -60 4 -60 6 -46', 'none', '#e4572e', 3), path('M-3 -48 C-2 -56 2 -56 3 -48', 'none', C.yellow, 2.4),
    path('M-6 0 C-6 -10 6 -10 6 0 Z', '#f08a2a', C.ink, 1), circle(0, -3, 3, '#ffd24a', null)), at(30, 96, 1, path('M-10 0 C-14 -8 -6 -14 0 -12 L8 -6 L6 0 Z', '#8a5a34', C.ink, 1.1), line('M8 -6 L20 -4', IRON, 2)),
    stand(18, 112, 0.5, fig(60, '#e2a13a', 'calm', { skin: SK2 })), reach(18, 0.5, 1, 28, 84, SK2), at(86, 104, 1, path('M-12 0 L-6 -10 L4 -12 L12 -4 L14 0 Z', '#4a4a50', C.ink, 1), ellipse(2, -16, 5, 3.4, '#ff8a3a', C.ink, 1.1), sparkle(10, -22, 2.4, C.yellow)), arrow(68, 92, 80, 84, HL, 2.2), ring(88, 92, 14)),
  'afr.kungagrav': all(bg('#f6e9c6'), rect(4, 70, 112, 42, SAND, 0, null), line('M4 70 L116 70', SAND2, 1.4), ...[[24, 70, 10, 34], [52, 70, 14, 48], [90, 70, 11, 38]].map(([x, y, w, h]) => all(path(`M${x! - w!} ${y} L${x} ${y! - h!} L${x! + w!} ${y} Z`, '#c9a06a', C.ink, 1.3), path(`M${x! - 1.5} ${y! - h! + 4} L${x} ${y! - h!} L${x! + 1.5} ${y! - h! + 4} Z`, '#a8804a', null))),
    rect(46, 60, 12, 10, '#d4b07a', 0, C.ink, 1), rect(34, 84, 40, 22, '#7a5a3a', 2, C.ink, 1.3), rect(40, 92, 28, 8, GOLD, 2, C.ink, 1), at(54, 148, 0.8, crownS), line('M52 70 L52 84', '#7a5a3a', 2), goldBag(80, 104, 0.7), oval(54, 76, 30, 34)),
  // 2442 Forntida västafrikanska riken
  'afr.guldfyndighet': all(bg(), path('M4 54 C30 40 50 50 70 42 C90 36 104 44 116 40 L116 112 L4 112 Z', '#b08a5a', C.ink, 1.3), path('M4 54 C30 40 50 50 70 42 C90 36 104 44 116 40', 'none', GRASS2, 3),
    path('M20 70 C40 66 50 80 70 76 C86 72 96 84 108 82', 'none', GOLD, 3), ...[[30, 70], [48, 74], [66, 76], [84, 76], [100, 82], [40, 92], [76, 96], [58, 88]].map(([x, y], i) => all(circle(x!, y!, i % 2 ? 2.4 : 3.2, C.yellow, C.ink, 0.8), sparkle(x! + 4, y! - 4, 1.6, C.yellow))), path('M10 104 C30 98 50 106 70 100 C90 96 104 104 116 100 L116 112 L4 112 Z', RIVER, C.ink, 1), ...[24, 52, 88].map((x) => circle(x, 106, 1.2, C.yellow, null)),
    stand(96, 46, 0.4, fig(60, '#e2a13a', 'smile', { skin: SK2 })), pickaxe(104, 40, 30, 0.6), oval(62, 82, 50, 18)),
  'afr.griot': all(bg('#f6e9c6'), field(98, '#d8c28a'), robed(40, '#2f6fb0', 'laugh', { h: 0.9 }, path('M-10 -66 L10 -66 L8 -72 L-8 -72 Z', '#f2f2ee', C.ink, 1)), kora(62, 72, 1), note(80, 30, 1, C.navy), note(92, 42, 0.8, C.navy),
    bubble(80, 18, 30, at(80, 18, 0.22, robed(60, GOLD, 'calm', {}, crownK)), true), ...[[76, 0.36, SK3, '#c84a7a'], [94, 0.4, SK2, '#4f9d69'], [108, 0.34, SK1, '#ef8a3c']].map(([x, h, sk, c]) => stand(x as number, 112, h as number, fig(60, c as string, 'smile', { skin: sk as string, hairStyle: (x as number) === 76 ? 'long' : 'short' })))),
  'afr.lermoské': all(bg(), field(100, '#d8c28a'), at(56, 100, 1, path('M-40 0 L-40 -40 L40 -40 L40 0 Z', CLAY, C.ink, 1.5), ...[-34, 0, 34].map((d) => all(path(`M${d - 7} -40 L${d - 6} -62 C${d - 4} -70 ${d + 4} -70 ${d + 6} -62 L${d + 7} -40 Z`, CLAY, C.ink, 1.4), circle(d, -70, 2, '#f2e6c8', C.ink, 0.8))),
    ...Array.from({ length: 8 }, (_, i) => line(`M${-38 + i * 11} -30 l0 -3 M${-36 + i * 11} -18 l0 -3`, CLAY2, 1.8)), ...[-28, -14, 14, 28].map((d) => line(`M${d} -40 l0 -6 M${d} -52 l-3 0`, WOOD, 2)), rect(-6, -18, 12, 18, '#5a3a24', 6, C.ink, 1.1)),
    line('M100 100 L94 56 M108 100 L102 56 M95 64 L103 64 M96 76 L104 76 M98 88 L106 88', WOOD, 1.6), stand(98, 76, 0.34, fig(60, '#ef8a3c', 'smile', { skin: SK2 })), ring(56, 46, 20)),
  'afr.lärdomsstad': all(bg(), field(90, '#d8c28a'), at(30, 90, 0.6, path('M-30 0 L-30 -30 L30 -30 L30 0 Z', CLAY, C.ink, 1.6), path('M-8 -30 L-7 -54 C-5 -60 5 -60 7 -54 L8 -30 Z', CLAY, C.ink, 1.4), ...[-22, 22].map((d) => path(`M${d - 4} -30 L${d} -40 L${d + 4} -30 Z`, CLAY, C.ink, 1.1))), at(84, 90, 0.5, path('M-26 0 L-26 -24 L26 -24 L26 0 Z', '#c9a06a', C.ink, 1.6)),
    ...[[30, 108, '#2f6fb0', SK2], [60, 110, '#f2f2ee', SK1], [90, 108, '#4f9d69', SK3]].map(([x, y, c, sk]) => all(stand(x as number, y as number, 0.34, robed(60, c as string, 'calm', { skin: sk as string }, turban('#f2f2ee'))), rect((x as number) - 7, (y as number) - 22, 14, 9, '#f3e6c4', 1, C.ink, 0.9), line(`M${x} ${(y as number) - 22} L${x} ${(y as number) - 13}`, C.ink, 0.8))),
    arrow(8, 30, 22, 46, HL, 2), arrow(112, 30, 96, 46, HL, 2), arrow(60, 10, 60, 28, HL, 2), sparkle(60, 40, 3)),
  // 2443 Handelsvägar över Sahara
  'afr.sanddyn': all(bg('#fdf3d2'), path('M4 70 C20 50 40 46 56 62 C70 40 92 34 116 56 L116 112 L4 112 Z', DUNE, C.ink, 1.4), path('M56 62 C70 40 92 34 116 56 L116 70 C96 56 80 56 64 70 Z', DUNE2, null), path('M4 92 C30 80 60 84 116 96 L116 112 L4 112 Z', '#f0d08e', C.ink, 1.2),
    line('M14 78 q6 -3 12 0 M70 80 q6 -3 12 0 M30 100 q6 -3 12 0', DUNE2, 1), camel(26, 64, 0.3), sunD(30, 22, 6), oval(84, 54, 32, 18)),
  'afr.sandstorm': all(rect(4, 4, 112, 108, '#d9b47a', 3, null), field(96, '#c9a060'), ...Array.from({ length: 7 }, (_, i) => path(`M${4 + (i % 2) * 8} ${18 + i * 11} C30 ${12 + i * 11} 60 ${24 + i * 11} 116 ${14 + i * 11}`, 'none', 'rgba(255,240,210,0.85)', 2)),
    path('M70 40 m-18 0 a18 12 0 1 1 36 0 a13 8 0 1 1 -26 1', 'none', '#a8803a', 2.6), camel(90, 104, 0.8, true, '#b8925a'), stand(36, 112, 0.6, robed(60, INDIGO, 'frown', { skin: SK1 }, turban(INDIGO))), reach(36, 0.6, 1, 40, 72, SK1), ...Array.from({ length: 30 }, (_, i) => circle(8 + ((i * 37) % 104), 10 + ((i * 53) % 90), 0.9, '#8a6a3a', null))),
  'afr.handelsvara': all(bg('#fdf3d2'), rect(4, 82, 112, 30, '#c8372d', 0, null), line('M4 82 L116 82', C.ink, 1.2), ...[[22, 92], [34, 96]].map(([x, y]) => saltSlab(x!, y!, 0.9)), goldBag(56, 100, 1.1), at(78, 100, 1, rect(-8, -8, 16, 8, '#3f6fb5', 1, C.ink, 1), line('M-8 -4 L8 -4', '#e2a13a', 1.2)),
    at(98, 100, 1, path('M-7 0 C-9 -8 9 -8 7 0 Z', '#d0784a', C.ink, 1.1), rect(-5, -10, 10, 3, '#d0784a', 1, C.ink, 0.8)), ...[44, 66, 88].map((x) => cowrie(x, 106, 0.5)), stand(20, 76, 0.5, robed(60, INDIGO, 'smile', {}, turban(INDIGO))), stand(100, 76, 0.5, robed(60, '#e2a13a', 'smile', { skin: SK2 }, headwrap('#4f9d69'))),
    arrow(40, 40, 78, 40, HL, 2.2), arrow(80, 50, 42, 50, HL, 2.2), oval(60, 98, 50, 14)),
  'afr.saltgruva': all(bg('#fdf3d2'), path('M4 36 L116 36 L116 112 L4 112 Z', '#e9e6dc', null), line('M4 36 L116 36', C.ink, 1.4), path('M30 36 L30 60 L90 60 L90 36', 'none', C.ink, 1), rect(30, 60, 60, 52, '#d9d6cc', 0, C.ink, 1.2),
    ...Array.from({ length: 4 }, (_, r) => line(`M30 ${68 + r * 11} L90 ${68 + r * 11}`, '#b9b6ac', 1)), stand(50, 112, 0.5, fig(60, '#e2a13a', 'calm', { skin: SK2, bottom: '#7a5a3a' })), reach(50, 0.5, 1, 66, 72, SK2), pickaxe(70, 76, 50, 0.7),
    ...[[78, 108], [78, 98], [78, 88]].map(([x, y]) => saltSlab(x!, y!, 0.8)), camel(96, 34, 0.55, true), saltSlab(100, 16, 0.5), saltSlab(100, 21, 0.5), oval(60, 86, 32, 26)),
  'afr.guldstoft': all(bg('#f3ece2'), rect(4, 90, 112, 22, RIVER, 0, null), waves(8, 112, 98), at(44, 74, 1, path('M-28 0 C-24 16 24 16 28 0 Z', '#8a6a4a', C.ink, 1.5), ellipse(0, 0, 28, 5, '#6a5a4a', C.ink, 1.2),
    ...Array.from({ length: 22 }, (_, i) => circle(-20 + ((i * 7) % 40), -1 + ((i * 3) % 5) - 2, 0.9, C.yellow, null))), at(96, 66, 1, path('M-8 0 C-11 -10 -5 -14 -4 -16 L4 -16 C5 -14 11 -10 8 0 Z', '#b07a46', C.ink, 1.2), line('M-4 -14 L4 -14', C.ink, 1)),
    ...Array.from({ length: 10 }, (_, i) => circle(92 + (i % 3) * 2, 70 + i * 2, 0.9, C.yellow, null)), ellipse(94, 92, 10, 2.6, C.yellow, C.ink, 0.8), greyed(at(98, 26, 1, path('M-8 4 L-6 -4 L2 -8 L8 -2 L6 6 Z', C.grey, C.ink, 1.2))), ring(44, 74, 18)),
  'afr.kaurisnäcka': all(bg('#f3ece2'), at(40, 52, 3, ellipse(0, 0, 9, 13, '#f7f1e2', C.ink, 0.6), path('M0 -11 C2 -4 2 4 0 11 C-2 4 -2 -4 0 -11 Z', '#c9b48a', C.ink, 0.5), line('M-1.6 -7 L1.6 -7 M-2 -3.5 L2 -3.5 M-2 0 L2 0 M-2 3.5 L2 3.5 M-1.6 7 L1.6 7', C.ink, 0.4), ellipse(-5, -4, 2, 3, 'rgba(255,255,255,0.8)', null)),
    path('M76 70 C82 66 94 66 100 70 L98 82 C92 86 84 86 78 82 Z', '#d0784a', C.ink, 1.2), ellipse(88, 70, 12, 3, '#f2e0a0', C.ink, 1), ...[[76, 100], [84, 102], [92, 100], [100, 102]].map(([x, y], i) => cowrie(x!, y!, 0.8, i * 20)), arrow(84, 92, 86, 86, HL, 2), arrow(70, 76, 60, 90, HL, 2), ring(40, 52, 40)),
  // 2444 Swahilikusten
  'afr.swahili': all(rect(4, 4, 112, 108, SEA, 3, null), africa(LAND), path('M86 30 C92 34 100 34 106 38 C100 48 94 54 90 60 C88 66 86 72 84 76 L76 74 C78 62 80 50 84 40 Z', HL, C.ink, 1.2),
    bubble(96, 86, 36, scribble(84, 82, 22, 2, 5, C.navy), false), ...[[60, 108, SK2, '#ef8a3c'], [72, 108, SK1, '#4f9d69']].map(([x, y, sk, c]) => stand(x as number, y as number, 0.28, fig(60, c as string, 'laugh', { skin: sk as string })))),
  'afr.kulturmöte': all(bg('#f3ece2'), circle(44, 40, 20, 'rgba(242,193,78,0.55)', C.ink, 1), circle(76, 40, 20, 'rgba(63,111,181,0.45)', C.ink, 1), circle(60, 62, 20, 'rgba(79,157,105,0.45)', C.ink, 1), sparkle(60, 48, 4, C.white), star(60, 48, 4, '#ef8a3c'),
    stand(24, 112, 0.5, robed(60, '#e2a13a', 'smile', { skin: SK2 }, headwrap('#c8372d'))), stand(60, 112, 0.5, robed(60, C.white, 'smile', { skin: SK3 }, path('M-11 -60 C-11 -70 11 -70 11 -60 Z', C.white, C.ink, 1.1))), stand(96, 112, 0.5, robed(60, '#4f9d69', 'smile', { skin: '#c99068' }, turban('#ef8a3c'))),
    reach(24, 0.5, 1, 40, 82, SK2), reach(60, 0.5, -1, 44, 82, SK3), reach(60, 0.5, 1, 76, 82, SK3), reach(96, 0.5, -1, 78, 82, '#c99068'),
    greyed(at(104, 22, 0.5, circle(-8, 0, 7, C.grey, C.ink, 1), circle(10, 0, 7, C.grey, C.ink, 1), line('M1 -10 L1 10', C.ink, 2)))),
  'afr.dhow': all(bg(), rect(4, 76, 112, 36, SEA, 0, null), waves(8, 112, 84), waves(12, 112, 96), waves(6, 112, 106), at(58, 84, 1.2, path('M-36 -6 C-26 6 22 6 34 -10 L28 -10 L-30 -8 Z', WOOD, C.ink, 1.5), line('M-30 -8 L28 -10', '#7a4a24', 1.2),
    line('M-2 -8 L-2 -52', '#7a4a24', 1.8), line('M-28 -14 L22 -58', '#7a4a24', 1.6), path('M-26 -16 L20 -56 C16 -36 10 -20 -2 -10 Z', '#f6efdc', C.ink, 1.3), path('M22 -10 L30 -24 L34 -10 Z', '#f6efdc', C.ink, 1)), sunD(100, 20, 6)),
  'afr.Stora-Zimbabwe': all(bg(), field(94), path('M8 104 C8 64 112 64 112 104 L102 104 C100 76 20 76 18 104 Z', STONE, C.ink, 1.4), line('M14 84 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4', STONE2, 1.2),
    ...Array.from({ length: 4 }, (_, r) => line(`M${12 + r * 2} ${92 + r * 3} L${108 - r * 2} ${92 + r * 3}`, STONE2, 0.6)), at(66, 92, 1, path('M-10 0 L-7 -42 C-5 -48 5 -48 7 -42 L10 0 Z', '#a8a092', C.ink, 1.5), ...Array.from({ length: 7 }, (_, i) => line(`M${-9 + i * 0.4} ${-5 - i * 6} L${9 - i * 0.4} ${-5 - i * 6}`, STONE2, 0.6))),
    palm(30, 94, 0.7), sunD(22, 20, 6), ring(66, 66, 26)),
  'afr.korallsten': all(bg('#e9f4f8'), rect(4, 80, 112, 32, '#7fc3df', 0, null), ...[[20, 104], [40, 108], [96, 104]].map(([x, y]) => at(x!, y!, 1, path('M0 0 L-2 -10 L-6 -14 M-2 -10 L2 -16 M0 0 L4 -8 L8 -12', 'none', '#ef8a7a', 2.4))), arrow(40, 90, 50, 66, HL, 2),
    at(64, 60, 1, path('M-20 -14 L20 -14 L22 14 L-18 14 Z', CORAL, C.ink, 1.6), ...[[-12, -6], [-4, 2], [6, -8], [12, 6], [-10, 8], [2, 10], [14, -2]].map(([x, y]) => ellipse(x!, y!, 2, 1.4, '#c9b89a', C.ink, 0.5))),
    at(100, 60, 0.7, rect(-14, -20, 28, 20, CORAL, 0, C.ink, 1.3), rect(-4, -12, 8, 12, '#5a3a24', 4, C.ink, 1), rect(-15, -22, 30, 3, '#d9cdb5', 0, C.ink, 1)), ring(64, 60, 28)),
  'afr.kryddnejlika': all(bg('#f3ece2'), rect(8, 88, 104, 16, '#d8c28a', 2, C.ink, 1.2), ...Array.from({ length: 6 }, (_, i) => g(`translate(${22 + i * 15} ${70 - (i % 2) * 8}) rotate(${-20 + i * 9}) scale(1.4)`, line('M0 0 L0 -16', '#6a3a1e', 2.4), circle(0, -18, 3, '#8a4a24', C.ink, 0.8), path('M-3 -16 L-4 -13 M3 -16 L4 -13', 'none', '#6a3a1e', 1.2))),
    ...Array.from({ length: 14 }, (_, i) => g(`translate(${14 + i * 7} ${96 + (i % 2) * 3}) rotate(${(i * 47) % 180})`, line('M0 3 L0 -3', '#6a3a1e', 1.6), circle(0, -3.4, 1.2, '#8a4a24', null))), at(96, 24, 1, line('M-14 6 L10 -6', '#5a7a3a', 1.6), ...[[-6, 2], [0, -1], [6, -4]].map(([x, y]) => circle(x!, y! - 3, 2, '#e88aa0', C.ink, 0.6))), ring(52, 56, 34)),
  // 2445 Kolonialtiden
  'afr.kapplöpningen-om-Afrika': all(rect(4, 4, 112, 108, SEA, 3, null), g('translate(10 22) scale(0.82)', africa(LAND2), line('M44 20 L48 60 M48 60 L90 58 M60 60 L62 104 M30 40 L80 30 M86 30 L84 80', C.ink, 1.4)), path('M18 26 L44 26 L48 60 L30 64 C20 56 14 46 18 26 Z', 'rgba(214,69,69,0.5)', null), path('M80 30 L96 40 L90 62 L62 64 L60 50 Z', 'rgba(63,111,181,0.5)', null),
    ...[[20, 6, 30, 20, '#d64545'], [60, 4, 60, 18, '#3f6fb5'], [100, 6, 90, 20, '#4f9d69']].map(([x1, y1, x2, y2, c]) => all(arrow(x1 as number, y1 as number, x2 as number, y2 as number, c as string, 2.6))), ...[[30, 20], [60, 18], [90, 20]].map(([x, y]) => circle(x!, y!, 3, '#f1c7a1', C.ink, 1)), line('M6 14 L14 14 M104 14 L112 14 M50 10 L56 10', C.grey, 1.4)),
  'afr.Berlinkonferensen': all(bg('#efe6d2'), rect(4, 4, 112, 30, '#d8c9a8', 0, null), ...[[18, 0.62], [42, 0.6], [78, 0.6], [102, 0.62]].map(([x, h]) => all(g('translate(0 -16)', F({ x: x!, top: C.black, bottom: C.black, mood: 'calm', h: h! }), on(x!, h!, tophat)))),
    path('M6 74 L114 74 L106 92 L14 92 Z', WOOD, C.ink, 1.3), line('M20 92 L20 112 M100 92 L100 112', WOOD, 3), g('translate(34 72) scale(0.44 0.16)', africa(LAND2, 4)), path('M32 78 L88 78 L84 90 L36 90 Z', 'none', C.ink, 0.6), line('M50 76 L64 90 M44 84 L84 82', C.red, 1.4),
    at(76, 84, 1, rect(-12, -1.4, 22, 2.8, '#e8d4a8', 0.5, C.ink, 0.7)), T(60, 24, '1884', 13, C.ink), ring(60, 84, 22)),
  'afr.protektorat': all(rect(4, 4, 112, 108, SEA, 3, null), path('M58 4 L116 4 L116 64 C100 68 82 60 70 54 C60 44 56 22 58 4 Z', '#9ab0d8', C.ink, 1.4), path('M36 62 C50 58 60 66 58 80 C56 94 46 102 34 100 C22 98 16 86 20 74 C22 66 28 62 36 62 Z', LAND, C.ink, 1.4),
    path('M38 50 L66 58 C66 84 56 102 38 110 C20 102 10 84 10 58 Z', 'none', '#2f4a9a', 3.2), line('M48 92 L48 70', C.ink, 1.4), rect(48, 70, 12, 8, '#e2a13a', 0.5, C.ink, 0.9), rect(48, 74, 12, 4, '#3a9a5a', 0, null), stand(34, 96, 0.3, robed(60, '#2f7a6a', 'calm', { skin: SK2 }, crownK)),
    at(92, 30, 1, path('M-10 -12 L10 -12 L10 0 C10 9 0 14 0 14 C0 14 -10 9 -10 0 Z', '#2f4a9a', C.ink, 1.3), line('M0 -9 L0 10 M-7 -2 L7 -2', C.white, 1.4)), arrow(84, 44, 66, 60, '#2f4a9a', 2.6),
    at(100, 96, 0.7, path('M-12 0 C-6 4 6 4 12 0 L10 -4 L-10 -4 Z', WOOD, C.ink, 1.2), line('M0 -4 L0 -16', WOOD, 1.4), path('M0 -16 L8 -8 L0 -8 Z', C.white, C.ink, 0.8)), `<path d="M54 74 C70 70 82 60 86 50" fill="none" stroke="${C.grey}" stroke-width="1.6" stroke-dasharray="3 3"/>`, `<path d="M96 60 C100 70 102 78 100 86" fill="none" stroke="${C.grey}" stroke-width="1.6" stroke-dasharray="3 3"/>`,
    ring(38, 82, 26)),
  'afr.indirekt-styre': all(bg('#f3ece2'), field(100, '#d8c28a'), rect(80, 24, 6, 88, WOOD, 1, C.ink, 1.3), rect(86, 24, 30, 88, '#e6dcc6', 0, null), line('M86 24 L116 24', C.ink, 1),
    g('translate(0 -14)', official(102, 'calm', 0.48)), at(84, 46, 1, rect(-6, -4, 12, 8, '#f3e6c4', 1, C.ink, 0.9), line('M-3 -1 L3 -1 M-3 2 L2 2', C.grey, 0.7)), `<path d="M96 46 L74 54" fill="none" stroke="${C.grey}" stroke-width="1.6" stroke-dasharray="3 3"/>`,
    rect(48, 92, 30, 8, '#b08a5a', 1, C.ink, 1.2), stand(62, 92, 0.56, robed(60, '#2f7a6a', 'calm', { skin: SK2 }, crownK)), arrow(48, 62, 34, 70, HL, 2.6),
    ...[[10, SK1, '#ef8a3c'], [22, SK3, '#4f9d69'], [34, SK2, '#c84a7a']].map(([x, sk, c]) => stand(x as number, 112, 0.36, fig(60, c as string, 'calm', { skin: sk as string }))), ring(62, 52, 16),
    greyed(at(20, 20, 1, stand(0, 8, 0.2, official(60, 'calm')), arrow(0, 10, 0, 16, C.grey, 1.4), ...[-8, 0, 8].map((d) => stand(d, 34, 0.14, fig(60, C.grey, 'calm')))))),
  'afr.naturtillgång': all(bg(), path('M4 48 L116 48 L116 112 L4 112 Z', '#b08a5a', null), field(40, GRASS), rect(4, 48, 112, 2, C.ink, 0, null), ...[16, 30, 44].map((x) => all(rect(x - 1.5, 24, 3, 16, WOOD, 0, C.ink, 0.8), circle(x, 22, 8, GRASS2, C.ink, 1.1))), path('M66 40 C76 38 92 42 104 40 L104 46 L66 46 Z', RIVER, C.ink, 1), at(84, 43, 0.5, path('M-8 0 C-4 -4 4 -4 8 0 C4 4 -4 4 -8 0 Z M8 0 L12 -3 L12 3 Z', '#f2a13a', C.ink, 0.8)),
    at(30, 76, 1, path('M-10 6 L-6 -6 L4 -8 L10 0 L6 8 Z', '#c87a4a', C.ink, 1.2), path('M-4 -2 L2 -4 L4 2', 'none', '#e8a87a', 1.4)), at(62, 92, 1, path('M0 -12 C6 -4 8 0 8 4 C8 9 -8 9 -8 4 C-8 0 -6 -4 0 -12 Z', C.black, C.ink, 1.1)), ...[[90, 72], [98, 80], [86, 84]].map(([x, y]) => all(circle(x!, y!, 2.6, C.yellow, C.ink, 0.7), sparkle(x! + 4, y! - 3, 1.6, C.yellow))), oval(60, 80, 52, 26)),
  'afr.tvångsarbete': all(bg('#f3ece2'), field(98, '#9ccc7a'), ...[[24, SK1, '#c9b088'], [52, SK2, '#b0a080']].map(([x, sk, c]) => all(stand(x as number, 112, 0.6, fig(60, c as string, 'frown', { skin: sk as string, bottom: '#7a6a5a' })), at(x as number, 50, 1, path('M-12 0 L12 0 L9 14 L-9 14 Z', '#a0784a', C.ink, 1.2), line('M-12 4 L12 4', '#7a5a3a', 0.8)), reach(x as number, 0.6, -1, (x as number) - 10, 56, sk as string), reach(x as number, 0.6, 1, (x as number) + 10, 56, sk as string))),
    official(92, 'angry', 0.72), reach(92, 0.72, -1, 78, 52, C.skin), line('M78 52 L66 40', '#5a3a24', 2), greyed(at(98, 22, 1, coin(0, 0, 6))), ban(98, 22, 9, 2.2)),
  // 2446 Självständighetskamp
  'afr.panafrikanism': all(bg('#f3ece2'), g('translate(30 26) scale(0.5)', africa('#4f9d69', 2.6)), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 - Math.PI / 2, x = f1(60 + Math.cos(a) * 46), y = f1(56 + Math.sin(a) * 42); return all(line(`M60 56 L${x} ${y}`, GOLD, 1.4), circle(x, y, 6, [SK1, SK2, SK3][i % 3]!, C.ink, 1.1), path(`M${x - 6} ${y + 12} C${x - 6} ${y + 5} ${x + 6} ${y + 5} ${x + 6} ${y + 12} Z`, ['#c8372d', '#e2a13a', '#3f6fb5', '#8a6bbf'][i % 4]!, C.ink, 1)); }),
    circle(60, 56, 40, 'none', HL, 2), greyed(at(104, 104, 0.6, circle(-8, -6, 4, C.grey, C.ink, 0.8), circle(8, -6, 4, C.grey, C.ink, 0.8), line('M-2 -6 L2 -6', C.red, 1.4)))),
  'afr.generalstrejk': all(bg(), at(96, 74, 1, rect(-18, -26, 36, 26, '#b9b0a2', 0, C.ink, 1.3), rect(6, -46, 6, 20, '#8f887c', 0, C.ink, 1.2), path('M-18 -26 L-10 -34 L-2 -26 L6 -34 L6 -26', 'none', C.ink, 1.2)), at(30, 70, 0.9, rect(-22, -16, 44, 16, '#ef8a3c', 3, C.ink, 1.3), circle(-12, 0, 4, C.dark, C.ink, 1), circle(12, 0, 4, C.dark, C.ink, 1), ...[-16, -6, 4, 14].map((d) => rect(d, -13, 7, 6, '#bfe3f5', 1, null))),
    field(96, '#cfcac0'), ...[[16, '#ef8a3c', 'helm', SK1], [36, C.white, '', SK2], [56, '#3f6fb5', '', SK3], [76, '#4f9d69', 'helm', SK2], [100, '#8a6bbf', '', SK1]].map(([x, c, hat, sk]) => all(stand(x as number, 112, 0.44, fig(60, c as string, 'angry', { skin: sk as string })), hat ? stand(x as number, 112, 0.44, on(60, 1, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', C.yellow, C.ink, 1.2))) : '', line(`M${(x as number) - 6} 92 L${(x as number) + 6} 92`, sk as string, 3.6))), ban(96, 22, 8, 2), oval(58, 92, 54, 18)),
  'afr.politisk-fånge': all(rect(4, 4, 112, 108, '#9aa3ad', 3, null), rect(4, 96, 112, 16, '#7d8794', 0, null), stand(46, 112, 0.72, fig(60, '#ef8a3c', 'calm', { skin: SK2, bottom: '#ef8a3c' })), bars(14, 18, 66, 90),
    bubble(96, 36, 34, at(96, 38, 0.6, rect(-12, -10, 24, 18, C.white, 2, C.ink, 1.2), rect(-7, -12, 14, 3, C.dark, 1, null), path('M-3 -20 L5 -18 L4 -11 L-4 -13 Z', '#f3e6c4', C.ink, 0.9)), true), ring(46, 50, 22)),
  'afr.befrielserörelse': all(bg(), field(96, '#cfe0a8'), rect(18, 26, 76, 22, '#3a9a5a', 1, C.ink, 1.3), rect(18, 33, 76, 8, GOLD, 0, null), line('M18 26 L18 70 M94 26 L94 70', WOOD, 2),
    ...[[18, SK1, '#c8372d'], [38, SK2, '#e2a13a'], [58, SK3, '#3f6fb5'], [78, SK2, '#c8372d'], [98, SK1, '#4f9d69']].map(([x, sk, c], i) => all(stand(x as number, 112, 0.5, fig(60, c as string, 'smile', { skin: sk as string, hairStyle: i % 2 ? 'long' : 'short' })), stand(x as number, 112, 0.5, on(60, 1, path('M-10 -42 L10 -42 L4 -32 L-4 -32 Z', '#3a9a5a', C.ink, 0.9))))),
    at(104, 24, 0.8, path('M-10 -4 C-14 -4 -14 4 -10 4 L-4 4 C0 4 0 -4 -4 -4 Z', 'none', IRON, 2.4), path('M6 -4 C2 -4 2 4 6 4 L12 4 C16 4 16 -4 12 -4 Z', 'none', IRON, 2.4), line('M0 -6 L2 6', C.red, 1.6)), arrow(30, 62, 70, 62, HL, 2.4)),
  'afr.sanningskommission': all(bg('#efe6d2'), rect(10, 50, 74, 10, WOOD, 1, C.ink, 1.3), ...[[22, SK2, C.dark], [46, SK1, '#8a6bbf'], [70, SK3, C.dark]].map(([x, sk, c]) => stand(x as number, 62, 0.4, fig(60, c as string, 'calm', { skin: sk as string }))), rect(10, 50, 74, 10, WOOD, 1, C.ink, 1.3), ...[22, 46, 70].map((x) => rect(x - 5, 46, 10, 4, C.white, 0.5, C.ink, 0.6)),
    stand(94, 112, 0.56, fig(60, '#4f9d69', 'frown', { skin: SK2 })), line('M86 62 L86 84', C.dark, 1.6), circle(86, 60, 2.6, C.dark, null), bubble(100, 30, 28, all(scribble(90, 26, 14, 2, 4, C.navy)), false), stand(40, 112, 0.5, fig(60, '#c9c0a8', 'frown', { skin: '#f1c7a1' })), at(28, 88, 0.9, path('M-6 0 L6 0 L4 10 L-4 10 Z', '#f3e6c4', C.ink, 1), line('M-3 3 L3 3 M-3 6 L3 6', C.grey, 0.8)), ring(46, 50, 30)),
  // 2447 Moderna afrikanska samhällen
  'afr.megastad': all(bg('#dfeef8'), ...[[10, 30], [18, 52], [26, 40], [34, 70], [42, 58], [50, 84], [58, 64], [66, 92], [74, 60], [82, 76], [90, 50], [98, 66], [106, 44], [113, 36]].map(([x, h], i) => building(x!, 96, 9, h!, ['#9aa8b8', '#b8c4d0', '#c9a87a', '#8fa0b4'][i % 4]!)),
    rect(4, 96, 112, 16, '#8a8f98', 0, null), line('M4 104 L116 104', C.white, 1.4, '6 4'), ...[[14, '#d64545'], [34, '#f2c14e'], [62, '#3f6fb5'], [88, '#4f9d69'], [104, C.white]].map(([x, c]) => rect((x as number) - 4, 98, 8, 4, c as string, 1, C.ink, 0.6)), ...[20, 46, 74, 96].map((x, i) => rect(x - 4, 106, 8, 4, ['#ef8a3c', C.white, '#d64545', '#3f6fb5'][i]!, 1, C.ink, 0.6)),
    greyed(at(100, 18, 0.5, rect(-10, -8, 8, 8, C.grey, 0, C.ink, 1), rect(2, -6, 8, 6, C.grey, 0, C.ink, 1)))),
  'afr.medelklass': all(bg('#f3ece2'), greyed(path('M46 10 L74 10 L84 30 L36 30 Z', C.grey, C.ink, 1.2), stand(60, 28, 0.16, fig(60, C.grey, 'calm')), at(74, 28, 0.5, rect(-10, -14, 20, 14, C.grey, 0, C.ink, 1), path('M-12 -14 L0 -22 L12 -14 Z', C.grey, C.ink, 1))),
    path('M30 34 L90 34 L114 72 L6 72 Z', '#f2d58a', C.ink, 1.4), ...[[20, '#3f6fb5', SK1], [34, '#c8372d', SK2], [48, '#4f9d69', SK3], [62, '#8a6bbf', SK1], [76, '#ef8a3c', SK2], [90, '#2f7a6a', SK3], [102, '#3f6fb5', SK2]].map(([x, c, sk], i) => stand(x as number, 70, 0.26, fig(60, c as string, 'smile', { skin: sk as string, hairStyle: i % 2 ? 'long' : 'short' }))),
    at(42, 50, 0.6, rect(-8, -6, 16, 6, '#5a3a24', 1, C.ink, 1), line('M-4 -6 L-4 -8 L4 -8 L4 -6', C.ink, 1)), at(70, 46, 0.6, rect(-7, -5, 14, 10, '#f3e6c4', 1, C.ink, 1), line('M0 -5 L0 5', C.ink, 0.8)), at(96, 50, 0.5, rect(-8, -8, 16, 8, '#f2e6c8', 0, C.ink, 1), path('M-10 -8 L0 -15 L10 -8 Z', '#c8372d', C.ink, 1)),
    arrow(14, 54, 6, 54, HL, 2), arrow(106, 54, 114, 54, HL, 2), greyed(path('M14 76 L106 76 L94 108 L26 108 Z', C.grey, C.ink, 1.2), ...[44, 60, 76].map((x) => stand(x, 106, 0.2, fig(60, C.grey, 'frown')))), oval(60, 54, 56, 22)),
  'afr.enpartistat': all(bg('#f3ece2'), ballotPaper(36, 34, ['#3a9a5a', '#c9ced4', '#c9ced4', '#c9ced4'], 0, false), ...[1, 2, 3].map((i) => line(`M24 ${38 + i * 8} L48 ${38 + i * 8}`, C.red, 1.6)),
    rect(70, 70, 36, 30, '#3a9a5a', 2, C.ink, 1.3), circle(88, 85, 7, GOLD, C.ink, 1), stand(88, 70, 0.42, fig(60, '#3a9a5a', 'calm', { skin: SK1 })), ...[66, 78, 98, 110].map((x) => stand(x, 112, 0.22, fig(60, '#3a9a5a', 'calm', { skin: SK2 }))), ring(28, 40, 10)),
  'afr.flerpartisystem': all(bg('#f3ece2'), rect(4, 92, 112, 20, '#c9a36a', 0, null), chamber(60, 92, 26, 3, ['#3a9a5a', '#c8372d', '#3f6fb5', '#e2a13a', '#8a6bbf']), rect(52, 82, 16, 10, WOOD, 1, C.ink, 1.1), stand(60, 84, 0.22, fig(60, C.dark, 'calm', { skin: SK2 })),
    ...[['#3a9a5a', 10], ['#c8372d', 22], ['#3f6fb5', 34], ['#e2a13a', 46], ['#8a6bbf', 58]].map(([c, x]) => all(line(`M${x} 30 L${x} 14`, C.ink, 1), rect(x as number, 14, 9, 6, c as string, 0.5, C.ink, 0.7))), oval(60, 70, 52, 30),
    greyed(at(104, 20, 0.36, chamber(0, 20, 26, 2, ['#3a9a5a'])))),
  'afr.frihandelsområde': all(rect(4, 4, 112, 108, SEA, 3, null), path('M8 20 L112 20 L112 100 L8 100 Z', LAND, C.ink, 1.4), line('M44 20 L40 100 M80 20 L84 100', C.ink, 1.2, '4 3'), path('M8 64 L112 60', 'none', '#8a8f98', 6), line('M8 64 L112 60', C.white, 1, '4 3'),
    ...[42, 82].map((x) => all(line(`M${x} 56 L${x - 2} 40`, '#d64545', 2.4), circle(x, 56, 2, C.dark, null))), at(26, 60, 0.8, rect(-10, -10, 14, 10, '#ef8a3c', 1, C.ink, 1), rect(4, -7, 6, 7, '#3f6fb5', 1, C.ink, 1), circle(-6, 1, 2.4, C.dark, null), circle(6, 1, 2.4, C.dark, null)), at(98, 58, 0.8, g('scale(-1 1)', rect(-10, -10, 14, 10, '#4f9d69', 1, C.ink, 1), rect(4, -7, 6, 7, '#3f6fb5', 1, C.ink, 1), circle(-6, 1, 2.4, C.dark, null), circle(6, 1, 2.4, C.dark, null))),
    arrow(36, 74, 58, 72, HL, 2), arrow(86, 48, 64, 48, HL, 2), greyed(at(62, 86, 1, coin(0, 0, 5))), ban(62, 86, 8, 2), oval(60, 60, 50, 34)),
  'afr.flerspråkig': all(bg('#f3ece2'), stand(40, 112, 0.66, fig(60, '#ef8a3c', 'laugh', { skin: SK2, hairStyle: 'long' })), bubble(20, 24, 26, scribble(10, 20, 14, 2, 4, '#c8372d'), false), bubble(52, 14, 26, line('M42 10 l3 4 l3 -4 l3 4 l3 -4 l3 4 M42 16 l3 4 l3 -4 l3 4', '#3f6fb5', 1), true),
    bubble(70, 38, 26, all(circle(62, 34, 1.6, '#3a9a5a', null), circle(68, 36, 1.6, '#3a9a5a', null), circle(74, 34, 1.6, '#3a9a5a', null), line('M60 40 L78 40', '#3a9a5a', 1.4)), true), greyed(stand(96, 112, 0.5, fig(60, C.grey, 'calm')), bubble(104, 50, 18, scribble(97, 47, 10, 1, 4, C.grey), true))),
  'afr.filmindustri': all(bg('#2f3340'), rect(4, 90, 112, 22, '#4a4f5c', 0, null), at(24, 74, 1, rect(-10, -8, 20, 14, C.dark, 2, C.ink, 1.2), circle(-4, -14, 6, C.dark, C.ink, 1.2), circle(8, -14, 6, C.dark, C.ink, 1.2), rect(10, -4, 8, 6, C.dark, 1, C.ink, 1), line('M0 6 L-8 30 M0 6 L8 30 M0 6 L0 30', C.grey, 1.6)),
    path('M50 30 L110 90 L50 90 Z', 'rgba(255,240,180,0.25)', null), at(104, 24, 1, rect(-6, -6, 12, 10, C.grey, 2, C.ink, 1), line('M0 4 L0 20', C.grey, 1.6)), stand(68, 112, 0.6, fig(60, '#c8372d', 'laugh', { skin: SK2, hairStyle: 'long' })), stand(92, 112, 0.6, fig(60, '#e2a13a', 'shock', { skin: SK1 })),
    at(36, 104, 1, rect(-8, -6, 16, 10, C.black, 1, C.ink, 1), path('M-8 -6 L8 -10 L8 -6 Z', C.white, C.ink, 0.8), line('M-4 -7 L-2 -9 M2 -8 L4 -10', C.black, 1.4)), ...[[100, 104], [110, 98]].map(([x, y]) => all(circle(x!, y!, 5, C.grey, C.ink, 1), circle(x!, y!, 1.4, C.dark, null)))),
};
