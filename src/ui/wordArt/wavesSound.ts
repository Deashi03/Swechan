/**
 * Matematik & naturvetenskap → Fysik → Vågor & ljud, 3321–3327 (0.50): oscillations, frequency and period,
 * wavelength and amplitude, propagation of sound, resonance, the Doppler effect, interference and diffraction.
 * Recurring signs: the part that the word names is orange (arrow, bracket, ring, curve or object) and a grey
 * reference shows what the word is not. Close words share one layout where only the marked part differs:
 * pendel / jämviktsläge / utslag (the same pendulum stand), frekvens / periodtid (the same wave under a
 * one-second bar: count the crests or bracket one cycle), vågtopp / vågdal (a boat on the same sea wave),
 * våglängd / amplitud (the same wave, horizontal or vertical arrow), transversell / longitudinell våg (hand,
 * rope or spring, arrow across or along), ljudkälla / ljudvåg (drum, arcs, ear), förtätning / förtunning
 * (the same row of air dots), stående våg / nod / buk (the same string between two clamps) and konstruktiv /
 * destruktiv interferens (wave + wave = result).
 * Digits, maths signs (+ = ×), the unit m/s and ✓/✗ marks only; no words that name the word, no brands,
 * no protected emblems (the ambulance has stripes and a blue lamp, no cross).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { figure } from './figures';
import { HL, T, note } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const SKY = '#e4f1fa';
const SEA = '#7fb7dd';
const SEA2 = '#5b9bd5';
const DEEP = '#2f6f9f';
const MARK = '#fff3b0';
const TINT = 'rgba(228,87,46,0.18)';
const OK = '#3f9a5a';
const WOOD = '#b07a45';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const poly = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join(' ');
const curve = (fn: (x: number) => number, x0: number, x1: number, n = 80) => poly(range(n + 1).map((i) => { const x = x0 + ((x1 - x0) * i) / n; return [x, fn(x)] as [number, number]; }));
/** Sine wave from x0 to x1 around y0; crest at x0 + wl/4 when ph = 0. */
const sin = (x0: number, y0: number, amp: number, wl: number, ph = 0) => (x: number) => y0 - amp * Math.sin((2 * Math.PI * (x - x0)) / wl + ph);
const dbl = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 2.6) => all(arrow(x1, y1, x2, y2, col, sw), arrow(x2, y2, x1, y1, col, sw));
const hbr = (x1: number, x2: number, y: number, col: string = HL, sw = 2.4) => all(line(`M${x1} ${y} L${x2} ${y}`, col, sw), line(`M${x1} ${y - 5} L${x1} ${y + 5} M${x2} ${y - 5} L${x2} ${y + 5}`, col, sw));
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const dot = (x: number, y: number, col: string = HL, r = 3.2) => circle(x, y, r, col, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
const check = (x: number, y: number, col: string = OK) => line(`M${x - 6} ${y} L${x - 2} ${y + 5} L${x + 7} ${y - 6}`, col, 3);
const cross = (x: number, y: number, col: string = C.red, s = 1) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Small objects ────────────────────────────────────────────────────
/** Stopwatch with the hand at angle a (degrees from 12 o'clock). */
const watch = (x: number, y: number, r: number, a = 60, col: string = C.ink) => all(rect(x - 2.5, y - r - 5, 5, 4, C.grey, 1, C.ink, 1), circle(x, y, r, C.white, col, 1.8), line(`M${x} ${y} L${f1(x + Math.sin(rad(a)) * r * 0.75)} ${f1(y - Math.cos(rad(a)) * r * 0.75)}`, HL, 1.8), circle(x, y, 1.4, C.ink, null));
/** Pendulum stand with the pivot at (64, 14); length 74. */
const PX = 64, PY = 14, PL = 74;
const bobAt = (a: number): [number, number] => [f1(PX + Math.sin(rad(a)) * PL), f1(PY + Math.cos(rad(a)) * PL)];
const stand = () => all(ground, rect(14, 104, 92, 8, C.grey, 2, C.ink, 1.6), rect(18, 10, 6, 96, WOOD, 1, C.ink, 1.4), rect(18, 8, 56, 6, WOOD, 1, C.ink, 1.4), circle(PX, PY, 2.6, C.ink, null));
const bob = (a: number, col: string = HL, r = 8) => { const [x, y] = bobAt(a); return all(line(`M${PX} ${PY} L${x} ${y}`, C.ink, 1.6), circle(x, y, r, col, C.ink, 1.6)); };
const ghostBob = (a: number) => greyed(bob(a, C.grey));
/** Vertical coil spring from y0 to y1 at x. */
const coil = (x: number, y0: number, y1: number, turns: number, w: number, col: string = C.dark, sw = 2) => line(`M${x} ${y0} ` + range(turns * 2).map((i) => `L${x + (i % 2 ? -w : w)} ${f1(y0 + ((i + 0.5) * (y1 - y0)) / (turns * 2))}`).join(' ') + ` L${x} ${y1}`, col, sw);
const drum = (x: number, y: number, col: string = C.red) => all(rect(x - 14, y - 10, 28, 22, col, 2, C.ink, 1.6), ellipse(x, y - 10, 14, 4.5, C.white, C.ink, 1.6), ellipse(x, y + 12, 14, 4.5, col, C.ink, 1.6), line(`M${x - 14} ${y - 4} L${x + 14} ${y + 6} M${x + 14} ${y - 4} L${x - 14} ${y + 6}`, C.gold, 1.4), line(`M${x - 4} ${y - 30} L${x + 2} ${y - 13} M${x + 12} ${y - 28} L${x + 6} ${y - 13}`, WOOD, 2.6));
/** Head seen from the side, looking left, with the ear on the left cheek. */
const head = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 13, C.skin, C.ink, 1.6), path('M-13 -2 C-12 -14 8 -18 13 -4 C10 -12 -4 -14 -13 -2 Z', C.hair, C.ink, 1.2), path('M-4 -4 C-9 -4 -9 6 -4 6', 'none', C.ink, 1.6), circle(-9, -1, 1.4, C.ink, null));
/** Sound arcs opening to the right, centred on (x, y). */
const arcs = (x: number, y: number, rs: number[], col: string = HL, sw = 2.6, spread = 38) => all(...rs.map((r) => { const a = rad(spread); return path(`M${f1(x + r * Math.cos(a))} ${f1(y - r * Math.sin(a))} A${r} ${r} 0 0 1 ${f1(x + r * Math.cos(a))} ${f1(y + r * Math.sin(a))}`, 'none', col, sw); }));
const speaker = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, rect(-10, -16, 14, 32, col, 2, C.ink, 1.4), path('M4 -10 L14 -18 L14 18 L4 10 Z', C.grey, C.ink, 1.4));
const boat = (x: number, y: number, s = 1, col: string = C.red, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-14 -4 L14 -4 L9 5 L-9 5 Z', col, C.ink, 1.4), rect(-6, -12, 10, 8, C.white, 1, C.ink, 1.2), line('M2 -12 L2 -20', C.ink, 1.4));
const duck = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, ellipse(0, 0, 11, 6, col, C.ink, 1.4), circle(8, -8, 5, col, C.ink, 1.4), path('M12 -8 L18 -7 L12 -5 Z', C.orange, C.ink, 1), circle(9, -9, 1, C.ink, null), path('M-11 -2 L-15 -6 L-9 -4', col, C.ink, 1.2));
const fork = (x: number, y: number, s = 1, col: string = C.silver) => at(x, y, s, path('M-8 -40 L-8 -14 C-8 -4 8 -4 8 -14 L8 -40', 'none', C.ink, 7), path('M-8 -40 L-8 -14 C-8 -4 8 -4 8 -14 L8 -40', 'none', col, 4.6), rect(-2.5, -6, 5, 26, col, 1.5, C.ink, 1.2));
const ambulance = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 0 L-22 -20 L8 -20 L8 -14 L16 -14 L22 -6 L22 0 Z', C.white, C.ink, 1.6), rect(-22, -9, 44, 4, C.orange, 0, null), rect(10, -12, 7, 5, '#bfe3f5', 1, C.ink, 0.8), rect(-4, -25, 8, 5, '#3c7fd6', 1.5, C.ink, 1), circle(-12, 1, 4, C.dark, C.ink, 1), circle(12, 1, 4, C.dark, C.ink, 1));
const jet = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-26 -2 L18 -4 C26 -3 28 0 30 1 C26 3 22 4 18 4 L-26 3 Z', C.silver, C.ink, 1.4), path('M-4 -2 L-14 -16 L-8 -16 L8 -2 Z', C.grey, C.ink, 1.2), path('M-4 3 L-12 14 L-6 14 L8 3 Z', C.grey, C.ink, 1.2), path('M-26 -2 L-30 -12 L-22 -12 L-18 -2 Z', C.grey, C.ink, 1.2), path('M14 -3 C18 -6 22 -4 22 -2 Z', '#bfe3f5', C.ink, 0.8));
const whale = (x: number, y: number, s = 1, col: string = DEEP) => at(x, y, s, path('M-20 0 C-20 -12 10 -14 18 -4 C22 0 20 6 14 8 C0 12 -14 10 -20 0 Z', col, C.ink, 1.4), path('M-20 0 L-30 -8 L-28 2 L-30 10 Z', col, C.ink, 1.4), circle(10, -2, 1.4, C.white, null), line('M2 6 C6 8 12 7 16 5', C.white, 1));
const plates = (gapX: number, gapW: number) => all(rect(14, 18, gapX - 14, 84, C.dark, 2, C.ink, 1.4), rect(gapX + gapW, 18, 106 - gapX - gapW, 84, C.dark, 2, C.ink, 1.4));

// ── Layout W: one second of a wave (frekvens / periodtid) ───────────
const WX0 = 12, WX1 = 108, WY = 66, WA = 17, WL = 24;
const wfn = sin(WX0, WY, WA, WL);
const secondBar = () => all(line(`M${WX0} 36 L${WX1} 36`, C.grey, 2), line(`M${WX0} 31 L${WX0} 41 M${WX1} 31 L${WX1} 41`, C.grey, 2), watch(60, 18, 9, 360 * 0.999), line('M60 27 L60 36', C.grey, 1.4, '2 2'));

// ── Layout B: a boat on the sea wave (vågtopp / vågdal) ──────────────
const bfn = sin(15, 66, 16, 60);
const sea = () => all(bg(SKY), path(curve(bfn, 4, 116) + ' L116 112 L4 112 Z', SEA, DEEP, 2));

// ── Layout V: wave with midline (våglängd / amplitud) ────────────────
const vfn = sin(15, 66, 22, 60);
const vwave = () => all(bg(), line('M8 66 L112 66', C.grey, 1.6, '4 3'), line(curve(vfn, 8, 112), DEEP, 3), dot(30, 44, DEEP, 2.6), dot(90, 44, DEEP, 2.6));

// ── Layout R: hand + rope or spring (transversell / longitudinell) ──
const fist = (x: number, y: number) => all(rect(x - 6, y - 6, 12, 12, C.skin, 4, C.ink, 1.4), line(`M${x + 6} ${y - 2} L${x + 2} ${y - 2} M${x + 6} ${y + 2} L${x + 2} ${y + 2}`, C.ink, 0.8), path(`M${x - 6} ${y + 5} L${x - 14} ${y + 22} L${x - 4} ${y + 24} L${x + 2} ${y + 7}`, C.sky, C.ink, 1.4));
const travel = () => arrow(40, 20, 104, 20, C.grey, 2.6);
const rfn = sin(22, 60, 14, 36, Math.PI);
const slinkyX = range(20).map((i) => f1(26 + 4.5 * i - 5 * Math.sin((2 * Math.PI * i) / 10)));

// ── Layout L: drum → arcs → ear (ljudkälla / ljudvåg) ────────────────
const listener = () => all(head(102, 66, 1.1), path('M88 112 C88 90 116 90 116 112', C.sky, C.ink, 1.6));

// ── Layout D: air dots in front of a speaker (förtätning / förtunning)
const AIRX = [34, 38, 41, 44, 47, 50, 54, 60, 66, 72, 76, 79, 82, 85, 88, 92, 98, 104, 110];
const airDots = () => all(...AIRX.flatMap((x, i) => range(6).map((j) => circle(x, 40 + j * 9 + ((i * 7 + j * 3) % 4) - 1.5, 1.9, C.navy, null))));
const airField = (box: Svg) => all(bg(), box, speaker(16, 62, 1.1), airDots(), arrow(36, 102, 104, 102, C.grey, 2));

// ── Layout S: string between two clamps (stående våg / nod / buk) ────
const sUp = (x: number) => 60 - 22 * Math.abs(Math.sin((Math.PI * (x - 12)) / 32));
const sDn = (x: number) => 60 + 22 * Math.abs(Math.sin((Math.PI * (x - 12)) / 32));
const clamps = () => all(rect(4, 44, 8, 32, C.dark, 1, C.ink, 1.4), rect(108, 44, 8, 32, C.dark, 1, C.ink, 1.4));
const loops = (col: string, sw: number) => all(line(curve(sUp, 12, 108, 96), col, sw), line(curve(sDn, 12, 108, 96), col, sw));

// ── Layout I: wave + wave = result (konstruktiv / destruktiv) ───────
const row = (y: number, amp: number, ph: number, col: string, sw = 2.6) => line(curve(sin(20, y, amp, 32, ph), 20, 112), col, sw);
const sums = () => all(num(10, 50, '+', 16, C.dark), line('M6 70 L14 70 M6 75 L14 75', C.dark, 2.2), line('M20 72 L112 72', C.grey2, 1.4));

export const WAVES_MOTIFS: Record<string, Svg> = {
  // ── 3321 Svängningar ──────────────────────────────────────────────────
  /** pendel: a wooden stand with a string and an orange ball swinging out to the right; a dashed arc shows the swing and a grey ghost ball hangs at the other side. */
  'vag.pendel': all(stand(), path(`M${bobAt(-28)[0]} ${bobAt(-28)[1]} A${PL} ${PL} 0 0 0 ${bobAt(28)[0]} ${bobAt(28)[1]}`, 'none', C.grey, 1.6, ), ghostBob(-28), bob(28)),
  /** svängning: a weight hangs in a spring from a ceiling bar; grey dashed outlines show it higher and lower, an orange double arrow shows the up-and-down movement, and to the right a small orange trace repeats the same movement over time. */
  'vag.svängning': all(bg(), rect(16, 8, 50, 6, WOOD, 1, C.ink, 1.4), coil(40, 14, 54, 6, 7), rect(28, 54, 24, 16, HL, 2, C.ink, 1.6), rect(28, 36, 24, 16, 'none', 2, C.grey, 1.4), rect(28, 72, 24, 16, 'none', 2, C.grey, 1.4), dbl(62, 40, 62, 86), line('M74 62 L114 62', C.grey2, 1.4), line(curve(sin(74, 62, 20, 20, Math.PI / 2), 74, 114), HL, 2.6)),
  /** jämviktsläge: the same pendulum stand; the orange ball hangs straight down on an orange dashed vertical line; grey ghost balls out to both sides. */
  'vag.jämviktsläge': all(stand(), ghostBob(-30), ghostBob(30), line(`M${PX} ${PY} L${PX} 104`, HL, 2, '4 3'), bob(0), ring(PX, 88, 13)),
  /** utslag: the same pendulum stand; a grey dashed line hangs straight down and a grey ghost ball sits in the middle; the orange ball is swung out to the right and the angle between the middle line and the string is filled orange. */
  'vag.utslag.2': all(stand(), line(`M${PX} ${PY} L${PX} 100`, C.grey, 1.6, '4 3'), ghostBob(0), path(`M${PX} ${PY} L${PX} ${PY + 40} A40 40 0 0 0 ${f1(PX + Math.sin(rad(32)) * 40)} ${f1(PY + Math.cos(rad(32)) * 40)} Z`, TINT, HL, 2.2), bob(32), dbl(PX + 2, 92, bobAt(32)[0] - 6, bobAt(32)[1] + 6, HL, 2.2)),
  /** vibration: a road drill held by two gloved hands; orange zigzag lines shake around the drill and the asphalt cracks under the bit. */
  'vag.vibration': all(ground, rect(4, 104, 112, 8, C.grey, 0, null), line('M52 106 L46 112 M68 106 L76 112 M60 106 L60 112', C.dark, 1.4), rect(32, 28, 56, 8, C.dark, 3, C.ink, 1.4), circle(36, 32, 6, C.orange, C.ink, 1.4), circle(84, 32, 6, C.orange, C.ink, 1.4), rect(49, 36, 22, 46, C.yellow, 3, C.ink, 1.6), rect(56, 82, 8, 22, C.grey, 1, C.ink, 1.4), ...[[38, 50], [82, 50], [38, 72], [82, 72]].map(([x, y]) => line(`M${x} ${y! - 8} l-5 4 l5 4 l-5 4 l5 4`, HL, 2)), line('M44 100 l-6 -3 M76 100 l6 -3 M48 96 l-8 -6 M72 96 l8 -6', HL, 2), circle(40, 106, 2, C.dark, null), circle(80, 105, 2, C.dark, null)),
  /** dämpning: a graph where an orange wave shrinks from tall to almost flat; grey dashed lines show the shrinking edges, and a grey wave behind keeps the same height all the time. */
  'vag.dämpning': all(bg(), line('M12 60 L112 60', C.grey2, 1.4), line('M12 16 L12 104', C.grey, 1.6), greyed(line(curve(sin(14, 60, 36, 18, 0), 14, 112), C.grey, 1.6)), line(curve((x) => 60 - 36 * Math.exp(-(x - 14) / 32), 14, 112), C.grey, 1.4, '3 3'), line(curve((x) => 60 + 36 * Math.exp(-(x - 14) / 32), 14, 112), C.grey, 1.4, '3 3'), line(curve((x) => 60 - 36 * Math.exp(-(x - 14) / 32) * Math.sin((2 * Math.PI * (x - 14)) / 18), 14, 112, 160), HL, 3)),
  /** dallra: a caramel pudding on a plate, wobbling: grey tilted outlines on both sides and orange wobble marks. */
  'vag.dallra': all(bg(), greyed(g('rotate(-9 60 94)', path('M40 94 L46 58 L74 58 L80 94 Z', 'none', C.grey, 1.6)), g('rotate(9 60 94)', path('M40 94 L46 58 L74 58 L80 94 Z', 'none', C.grey, 1.6))), ellipse(60, 96, 44, 8, C.white, C.ink, 1.6), path('M40 94 L46 58 L74 58 L80 94 Z', '#f5d76e', C.ink, 1.6), path('M46 58 L74 58 L75 66 C66 70 54 70 45 66 Z', '#8a4b1f', C.ink, 1.4), line('M28 64 C24 70 24 78 28 84 M22 66 C18 72 18 78 22 84 M92 64 C96 70 96 78 92 84 M98 66 C102 72 102 78 98 84', HL, 2.2)),
  /** svaja: a tall thin tree bends in the wind; grey outlines show it bent the other way and straight; wind lines blow from the left. */
  'vag.svaja': all(bg(SKY), ground, rect(4, 106, 112, 6, '#a8d18d', 0, null), greyed(path('M60 108 C58 80 52 50 44 26', 'none', C.brown, 5), ellipse(44, 24, 12, 16, C.green, null), path('M60 108 L60 30', 'none', C.brown, 5), ellipse(60, 26, 12, 16, C.green, null)), path('M60 108 C62 80 70 50 80 28', 'none', C.brown, 5.5), ellipse(82, 26, 13, 17, C.green, C.ink, 1.4), line('M8 30 C18 26 26 34 36 30 M10 48 C20 44 28 52 38 48 M8 66 C16 62 24 70 32 66', HL, 2.2), arrow(84, 50, 100, 46, HL, 2), arrow(42, 58, 30, 54, C.grey, 2)),

  // ── 3322 Frekvens och period ─────────────────────────────────────────
  /** frekvens: a wave under a grey one-second bar with a stopwatch; the four crests inside the second are numbered 1–4 with orange dots, and an orange 4 stands below. */
  'vag.frekvens.2': all(bg(), secondBar(), line(curve(wfn, WX0, WX1), DEEP, 2.8), ...range(4).map((i) => dot(WX0 + WL / 4 + i * WL, WY - WA, HL, 3.6) + num(WX0 + WL / 4 + i * WL, WY - WA - 7, String(i + 1), 9, HL)), num(60, 106, '= 4', 18, HL)),
  /** periodtid: the same wave under the same one-second bar; only the first full cycle is orange with an orange bracket under it and a small stopwatch; the rest of the wave is grey. */
  'vag.periodtid': all(bg(), secondBar(), line(curve(wfn, WX0, WX1), C.grey, 2.4), line(curve(wfn, WX0, WX0 + WL), HL, 3.6), hbr(WX0, WX0 + WL, 92), watch(WX0 + WL / 2, 104, 6, 90), num(80, 104, '0,25', 14, HL)),
  /** hertz: a wall socket with a cable leading to an orange sine wave; a big orange 50 and a smaller grey 60 below. */
  'vag.hertz': all(bg(), rect(8, 30, 40, 40, C.white, 6, C.ink, 1.8), circle(28, 50, 13, '#eef1f4', C.ink, 1.4), circle(23, 50, 2.2, C.ink, null), circle(33, 50, 2.2, C.ink, null), line(curve(sin(54, 50, 12, 20), 54, 112), HL, 3), num(54, 100, '50', 24, HL), num(96, 100, '60', 15, C.grey), line('M82 96 L76 104', C.grey, 1.6)),
  /** metronom: a wooden metronome; the rod with its sliding weight swings to the right, a grey ghost rod to the left and an orange arc at the top. */
  'vag.metronom': all(bg(), ground, path('M34 108 L50 18 L70 18 L86 108 Z', WOOD, C.ink, 1.8), path('M44 100 L54 30 L66 30 L76 100 Z', '#f3e3c8', C.ink, 1.2), ...range(7).map((i) => line(`M58 ${36 + i * 8} L62 ${36 + i * 8}`, C.dark, 1)), greyed(line(`M60 96 L${f1(60 - Math.sin(rad(20)) * 64)} ${f1(96 - Math.cos(rad(20)) * 64)}`, C.dark, 2.4)), line(`M60 96 L${f1(60 + Math.sin(rad(20)) * 64)} ${f1(96 - Math.cos(rad(20)) * 64)}`, C.dark, 2.6), g(`rotate(20 60 96)`, rect(55, 50, 10, 8, C.gold, 1, C.ink, 1.2)), circle(60, 96, 3, C.ink, null), path(`M${f1(60 - Math.sin(rad(22)) * 70)} ${f1(96 - Math.cos(rad(22)) * 70)} A70 70 0 0 1 ${f1(60 + Math.sin(rad(22)) * 70)} ${f1(96 - Math.cos(rad(22)) * 70)}`, 'none', HL, 2.4)),
  /** slag per minut: a smart watch on a wrist shows a red heart, the number 72 and an orange pulse line. */
  'vag.slag-per-minut': all(bg(), rect(4, 48, 112, 28, C.skin, 10, C.ink, 1.6), rect(46, 20, 28, 84, C.dark, 6, C.ink, 1.4), rect(34, 32, 52, 60, C.black, 10, C.ink, 2), rect(39, 37, 42, 50, '#1f2430', 6, null), path('M60 52 C52 46 52 40 56 40 C58 40 60 42 60 44 C60 42 62 40 64 40 C68 40 68 46 60 52 Z', C.red, null), num(60, 70, '72', 15, C.white), line('M41 80 L50 80 L53 74 L57 86 L61 76 L64 80 L79 80', HL, 2)),
  /** periodisk: on top, an orange pattern of identical pulses repeats with equal orange brackets under each and a tick; below, a grey line with uneven bumps and a cross. */
  'vag.periodisk': all(bg(), ...range(3).map((i) => line(`M${12 + i * 30} 40 L${20 + i * 30} 40 L${24 + i * 30} 22 L${30 + i * 30} 52 L${34 + i * 30} 40 L${42 + i * 30} 40`, HL, 3) + hbr(12 + i * 30, 40 + i * 30, 62, HL, 1.8)), check(108, 36), greyed(line('M12 92 L18 92 L21 82 L25 96 L34 92 L36 76 L42 100 L55 92 L58 86 L62 94 L80 92 L84 80 L88 98 L100 92', C.dark, 2.4)), cross(108, 92)),
  /** vingslag: a small bird flying to the right with its wing up; a grey ghost wing points down, and an orange curved double arrow at the wing tip shows the beat up and down. */
  'vag.vingslag': all(bg(SKY), greyed(path('M56 64 C50 80 44 92 34 98 C46 96 58 84 64 68 Z', C.grey, C.ink, 1.2)), ellipse(62, 62, 18, 8, C.navy, C.ink, 1.4), circle(80, 56, 7, C.navy, C.ink, 1.4), path('M86 55 L94 57 L86 59 Z', C.gold, C.ink, 1), circle(82, 54, 1.2, C.white, null), path('M44 62 L32 54 L34 64 L30 70 Z', C.navy, C.ink, 1.2), path('M56 58 C50 42 42 28 30 22 C44 24 58 38 66 56 Z', C.navy, C.ink, 1.4), path('M22 30 C10 50 12 76 26 94', 'none', HL, 2.6), arrow(17, 40, 22, 30, HL, 2.6), arrow(20, 86, 26, 95, HL, 2.6)),

  // ── 3323 Våglängd och amplitud ───────────────────────────────────────
  /** våg: the sea with rolling waves with white foam on the crests, a sun and a seagull. */
  'vag.våg.2': all(bg(SKY), circle(96, 24, 10, C.yellow, C.ink, 1.4), path('M30 22 q4 -4 8 0 q4 -4 8 0', 'none', C.ink, 1.4), ...[0, 1, 2].map((k) => { const y = 54 + k * 20; return path(curve(sin(4 + k * 10, y, 6, 36), 4, 116) + ' L116 112 L4 112 Z', [SEA, SEA2, DEEP][k]!, C.ink, 1.4) + all(...range(4).map((i) => path(`M${4 + k * 10 + 9 + i * 36 - 6} ${y - 4} q6 -6 12 0`, 'none', C.white, 2.4))); })),
  /** vågtopp: a small boat rides on the top of a big sea wave; an orange ring marks the top. */
  'vag.vågtopp': all(sea(), boat(30, 46, 1), ring(30, 50, 15)),
  /** vågdal: the same sea wave; the small boat sits down in the low part between two tops; an orange ring marks the low part. */
  'vag.vågdal': all(sea(), boat(60, 78, 1), ring(60, 82, 15)),
  /** våglängd: a wave over a dashed middle line; an orange double arrow runs from one crest to the next at the top, with orange dashed guides down to the crests; a thin grey bracket shows the height. */
  'vag.våglängd': all(vwave(), line('M30 26 L30 42 M90 26 L90 42', HL, 1.6, '3 2'), dbl(30, 26, 90, 26, HL, 3), line('M18 66 L18 44', C.grey, 1.4)),
  /** amplitud: the same wave and middle line; an orange double arrow runs straight up from the middle line to the crest; a thin grey line shows the distance between the crests. */
  'vag.amplitud': all(vwave(), line('M30 26 L90 26', C.grey, 1.4), dbl(30, 64, 30, 46, HL, 3), line('M24 44 L40 44', HL, 1.6, '3 2')),
  /** transversell våg: a hand shakes a long rope up and down (orange double arrow at the hand); a red ribbon on the rope also moves up and down (orange arrow), while a grey arrow at the top shows the wave travelling to the right. */
  'vag.transversell-våg': all(bg(), travel(), line(curve(rfn, 22, 114), C.brown, 3), fist(18, rfn(22)), dbl(6, 40, 6, 84), rect(74, rfn(76) - 4, 4, 9, C.red, 1, C.ink, 1), dbl(90, rfn(76) - 18, 90, rfn(76) + 18, HL, 2.2)),
  /** longitudinell våg: a hand pushes a long soft spring back and forth (orange double arrow along it); the coils bunch up and spread out, a red ribbon on one coil moves back and forth (orange arrow), and a grey arrow at the top shows the wave travelling to the right. */
  'vag.longitudinell-våg': all(bg(), travel(), ...slinkyX.map((x) => ellipse(x, 60, 2.6, 14, 'none', C.dark, 1.6)), line(`M${slinkyX[0]} 46 L${slinkyX[19]} 46 M${slinkyX[0]} 74 L${slinkyX[19]} 74`, C.grey2, 1), fist(18, 60), dbl(4, 94, 34, 94), rect(slinkyX[12]! - 2, 44, 4, 9, C.red, 1, C.ink, 1), dbl(slinkyX[12]! - 12, 88, slinkyX[12]! + 12, 88, HL, 2.2)),
  /** krusning: a pond seen from above; a stone has just fallen in and orange rings of small waves spread out from the splash. */
  'vag.krusning': all(bg('#cfe6b8'), ellipse(60, 66, 54, 38, SEA, C.ink, 1.6), ...[[8, 5], [18, 11], [29, 18], [41, 26]].map(([rx, ry]) => ellipse(60, 66, rx!, ry!, 'none', HL, 2.2)), circle(60, 66, 3.4, C.grey, C.ink, 1), ...[[54, 54], [66, 52], [60, 50]].map(([x, y]) => circle(x!, y!, 1.8, '#eaf6ff', C.ink, 0.6))),
  /** svallvåg: water seen from above; a motorboat speeds to the right at the top and orange V-shaped waves spread behind it down to a jetty on the shore, where they splash. */
  'vag.svallvåg': all(bg(SEA), rect(4, 94, 112, 18, C.beige, 0, null), rect(18, 80, 26, 14, WOOD, 1, C.ink, 1.4), line('M22 94 L22 98 M40 94 L40 98', C.ink, 1.4), path('M78 20 L98 20 L106 26 L98 32 L78 32 Z', C.white, C.ink, 1.4), rect(84, 22, 8, 8, C.navy, 1, null), ...[0, 1, 2].map((i) => line(`M${76 - i * 12} ${22 - i * 2} L${30 - i * 10} ${60 + i * 12} M${76 - i * 12} ${30 + i * 2} L${54 - i * 10} ${78 + i * 8}`, HL, 2.4)), line('M18 78 l-3 -4 M30 76 l0 -5 M44 78 l3 -4', C.white, 2)),
  /** vågbrytare: a harbour seen from above; rough sea with white waves outside a long orange-outlined stone wall, and calm water with moored boats inside. */
  'vag.vågbrytare': all(bg(SEA2), path('M4 60 L80 60 L80 112 L4 112 Z', '#a9d1ec', null), path('M80 112 L80 56 L4 56 L4 64 L74 64 L74 112 Z', C.grey, HL, 2.4), ...range(9).map((i) => circle(10 + i * 8, 60, 2, C.dark, null)), ...range(4).map((i) => circle(77, 70 + i * 10, 2, C.dark, null)), ...range(5).map((i) => path(`M${10 + i * 20} 34 q5 -6 10 0`, 'none', C.white, 2.2)), ...range(3).map((i) => path(`M${88} ${40 + i * 24} q5 -6 10 0`, 'none', C.white, 2.2)), line('M20 54 l-3 -6 M44 54 l0 -7 M66 54 l3 -6 M84 80 l6 -3', C.white, 2.2), boat(24, 86, 0.8, C.red), boat(52, 98, 0.8, C.yellow), rect(4, 104, 70, 8, C.beige, 0, null)),
  /** guppa: a rubber duck on a wavy water line; grey ghost ducks above and below it at the same place, an orange double arrow up and down, and a grey arrow at the top shows the waves moving to the right. */
  'vag.guppa': all(bg(SKY), path(curve(sin(10, 74, 7, 44), 4, 116) + ' L116 112 L4 112 Z', SEA, DEEP, 1.6), travel(), greyed(duck(60, 54, 0.9), duck(60, 86, 0.9)), duck(60, sin(10, 74, 7, 44)(60) - 4, 1), dbl(88, 46, 88, 92)),
  /** skvalpa: a small rowing boat at a wooden jetty; little waves splash against its side with orange splash marks. */
  'vag.skvalpa': all(bg(SKY), rect(4, 52, 34, 8, WOOD, 1, C.ink, 1.4), line('M10 60 L10 104 M32 60 L32 104', WOOD, 4), path('M44 70 L104 70 L96 86 L52 86 Z', C.white, C.ink, 1.6), line('M50 74 L98 74', C.red, 2), path(curve(sin(4, 88, 3, 14), 4, 116) + ' L116 112 L4 112 Z', SEA, DEEP, 1.6), ...[[46, 90], [102, 90]].map(([x, y]) => line(`M${x! - 5} ${y! - 2} l-3 -5 M${x} ${y! - 4} l0 -6 M${x! + 5} ${y! - 2} l3 -5`, HL, 2)), path('M40 96 q4 -4 8 0 M64 100 q4 -4 8 0 M90 98 q4 -4 8 0', 'none', C.white, 1.8)),

  // ── 3324 Ljudets utbredning ──────────────────────────────────────────
  /** ljudkälla: a drum is hit by two sticks and is marked with an orange ring and sparks; grey sound arcs go from it to a listener's ear. */
  'vag.ljudkälla': all(bg(), drum(26, 70), ring(26, 70, 24, HL, 3), sparkle(10, 44, 4, HL), sparkle(44, 42, 4, HL), arcs(30, 70, [24, 34, 44, 54], C.grey, 2), listener()),
  /** ljudvåg: the same drum, ear and arcs; the drum is grey and the sound arcs travelling through the air are thick and orange. */
  'vag.ljudvåg': all(bg(), greyed(drum(26, 70)), arcs(30, 70, [24, 34, 44, 54], HL, 3.2), listener()),
  /** förtätning: a speaker in front of a row of air dots that are close together in some places and far apart in others; a yellow box marks a place where the dots are crowded together. */
  'vag.förtätning.2': airField(rect(37, 32, 16, 64, MARK, 3, HL, 2.2)),
  /** förtunning: the same speaker and row of air dots; the yellow box marks a place where the dots are far apart. */
  'vag.förtunning': airField(rect(53, 32, 20, 64, MARK, 3, HL, 2.2)),
  /** ljudhastighet: a thundercloud with lightning far to the left and a person to the right with a stopwatch; dashed orange arcs travel between them over an orange arrow marked 340 m/s. */
  'vag.ljudhastighet': all(bg(SKY), path('M10 30 C6 30 6 20 14 20 C16 10 30 10 32 18 C40 14 46 22 42 30 Z', C.grey, C.ink, 1.4), path('M24 30 L18 44 L24 44 L20 56 L32 40 L26 40 L30 30 Z', C.yellow, C.ink, 1.2), ground, g('translate(96 0)', figure({ x: 0, h: 0.62, top: C.green })), watch(80, 88, 6, 90), ...[0, 1, 2].map((i) => path(`M${44 + i * 10} 34 q4 6 0 12`, 'none', HL, 2)), arrow(40, 80, 74, 80, HL, 3), num(56, 70, '340', 13, HL), num(56, 96, 'm/s', 9, C.dark)),
  /** akustik: a concert hall in cross-section: a singer on a stage at the left, curved panels under the ceiling and rows of heads at the right; orange sound paths go up from the singer, bounce off the panels and come down to the audience. */
  'vag.akustik': all(bg('#f3ece2'), rect(4, 92, 40, 20, WOOD, 0, C.ink, 1.2), g('translate(24 -20)', figure({ x: 0, h: 0.7, top: C.purple })), ...[[40, 20], [66, 16], [92, 20]].map(([x, y]) => path(`M${x! - 12} ${y} Q${x} ${y! + 8} ${x! + 12} ${y}`, C.white, C.ink, 1.6)), ...range(3).flatMap((r) => range(3).map((c) => circle(66 + c * 16 + r * 4, 70 + r * 14, 5.4, C.hair, C.ink, 1))), line('M28 50 L40 26 L70 66', HL, 2.2), line('M30 48 L66 22 L86 66', HL, 2.2), line('M32 50 L92 26 L104 80', HL, 2.2), arrow(62, 54, 70, 66, HL, 2.2), arrow(82, 56, 86, 66, HL, 2.2)),
  /** tonhöjd: a piano keyboard at the bottom; above it music notes climb step by step from left to right, and an orange arrow points up at the right, with a slow wave at the bottom and a fast wave at the top. */
  'vag.tonhöjd': all(bg(), rect(8, 86, 104, 24, C.white, 2, C.ink, 1.6), ...range(12).map((i) => line(`M${f1(8 + (i + 1) * 104 / 13)} 86 L${f1(8 + (i + 1) * 104 / 13)} 110`, C.ink, 1)), ...[0, 1, 3, 4, 5, 7, 8, 10, 11].map((i) => rect(f1(8 + (i + 1) * 104 / 13 - 2.6), 86, 5.2, 14, C.ink, 0.5, null)), ...range(5).map((i) => note(16 + i * 16, 74 - i * 11, 0.9, C.navy)), arrow(104, 78, 104, 14, HL, 3.4)),
  /** infraljud: a whale under water sends long, slow orange waves to another whale far away; at the top a grey human head with an orange-red cross cannot hear them. */
  'vag.infraljud': all(bg('#cde4f3'), line('M4 34 L116 34', SEA2, 2), whale(30, 72, 1), whale(100, 92, 0.6), line(curve(sin(48, 72, 7, 40), 48, 112), HL, 3), greyed(head(88, 18, 0.8)), cross(104, 18, C.red, 0.8)),
  /** ljudisolering: a house wall in cross-section, filled with orange-outlined yellow insulation; in the left room a speaker sends music notes that stop at the wall, and in the right room a person sleeps in peace. */
  'vag.ljudisolering': all(bg(), ground, rect(52, 8, 16, 104, '#f7e08a', 0, HL, 2.4), ...range(10).map((i) => path(`M54 ${14 + i * 10} q3 -4 6 0 q3 4 6 0`, 'none', '#d6a93a', 1.4)), speaker(16, 76, 1), ...[[30, 56], [38, 42], [44, 64]].map(([x, y]) => note(x!, y!, 0.9, C.navy)), greyed(note(76, 46, 0.6, C.navy)), rect(74, 90, 40, 10, C.white, 2, C.ink, 1.4), rect(74, 84, 12, 8, C.white, 3, C.ink, 1.2), circle(86, 82, 6, C.skin, C.ink, 1.2), path('M84 81 l3 0 M88 81 l3 0', 'none', C.ink, 1), rect(90, 84, 24, 8, C.sky, 2, C.ink, 1.2), num(102, 70, 'z z', 9, C.grey)),

  // ── 3325 Resonans ────────────────────────────────────────────────────
  /** stämgaffel: a metal tuning fork with orange vibration lines beside its two prongs and a small rubber mallet next to it. */
  'vag.stämgaffel': all(bg(), fork(54, 76, 1.5), line('M32 22 C28 30 28 40 32 48 M26 26 C22 32 22 40 26 46 M76 22 C80 30 80 40 76 48 M82 26 C86 32 86 40 82 46', HL, 2.2), g('rotate(-30 96 86)', rect(94, 70, 4, 30, WOOD, 1, C.ink, 1.2), rect(88, 62, 16, 10, C.red, 4, C.ink, 1.2))),
  /** resonanslåda: a tuning fork stands on a wooden box with an opening; big orange sound arcs come out of the box; at the top right a grey fork alone gives only tiny grey arcs. */
  'vag.resonanslåda': all(bg(), ground, rect(10, 74, 62, 32, WOOD, 3, C.ink, 1.8), rect(58, 82, 10, 16, C.dark, 2, null), fork(40, 74, 0.9), arcs(66, 90, [14, 24, 34, 44], HL, 3, 32), greyed(fork(96, 40, 0.6), arcs(104, 24, [6, 10], C.grey, 1.6, 30))),
  /** sträng: the neck of a string instrument with four strings; one string is orange and blurred as it vibrates, the others are still. */
  'vag.sträng-noun': all(bg(), rect(4, 34, 112, 52, '#5a3a22', 3, C.ink, 1.8), ...range(6).map((i) => line(`M${16 + i * 18} 34 L${16 + i * 18} 86`, C.silver, 2)), line('M4 44 L116 44 M4 54 L116 54 M4 76 L116 76', '#dfe3e6', 1.8), line(curve((x) => 65 - 4 * Math.sin((Math.PI * (x - 4)) / 112), 4, 116), HL, 2.4), line(curve((x) => 65 + 4 * Math.sin((Math.PI * (x - 4)) / 112), 4, 116), HL, 2.4), line('M4 65 L116 65', HL, 1, '2 2'), ...[[56, 22], [64, 18], [72, 22], [56, 100], [64, 104], [72, 100]].map(([x, y]) => line(`M${x} ${y} l0 ${y! < 50 ? 6 : -6}`, HL, 1.8))),
  /** stämma (instrument): a hand turns a tuning peg on the head of a string instrument (orange turning arrow); a tuning fork rings beside it and a small display shows the needle right in the middle with a green tick. */
  'vag.stämma.2': all(bg(), path('M40 112 L44 30 C44 22 66 22 66 30 L70 112 Z', '#7a4a2a', C.ink, 1.8), ...[40, 56, 72].map((y) => circle(38, y, 4, C.silver, C.ink, 1.2) + circle(72, y, 4, C.silver, C.ink, 1.2)), line('M50 30 L50 112 M55 30 L55 112 M60 30 L60 112', '#dfe3e6', 1.4), circle(80, 56, 7, C.skin, C.ink, 1.4), path('M84 44 A16 16 0 0 1 90 66', 'none', HL, 2.6), arrow(88, 62, 90, 67, HL, 2.6), fork(18, 100, 0.6), line('M8 66 C6 70 6 74 8 78 M28 66 C30 70 30 74 28 78', HL, 1.6), rect(86, 10, 28, 22, C.dark, 3, C.ink, 1.4), path('M90 26 A10 10 0 0 1 110 26', 'none', C.white, 1.2), line('M100 28 L100 15', HL, 2), check(108, 36)),
  /** stående våg: a string fixed between two clamps vibrates in three orange loops; the still points between the loops are small grey dots. */
  'vag.stående-våg': all(bg(), clamps(), loops(HL, 3), line('M12 60 L108 60', C.grey2, 1.2, '3 3'), ...[44, 76].map((x) => dot(x, 60, C.grey, 2.6))),
  /** nod: the same vibrating string in grey; the four points where it does not move at all (the ends and between the loops) are marked with orange dots and rings. */
  'vag.nod.2': all(bg(), clamps(), loops(C.grey, 2.2), ...[12, 44, 76, 108].map((x) => dot(x, 60, HL, 3.4) + ring(x, 60, 8))),
  /** buk: the same vibrating string in grey; the middle of each loop, where it moves the most, is marked with an orange double arrow. */
  'vag.buk.2': all(bg(), clamps(), loops(C.grey, 2.2), ...[28, 60, 92].map((x) => dbl(x, 40, x, 80, HL, 2.6))),

  // ── 3326 Dopplereffekten ─────────────────────────────────────────────
  /** dopplereffekt: an ambulance drives to the right inside circles of sound waves that are squeezed together in front of it (orange) and stretched out behind it (grey); a listener stands in front. */
  'vag.dopplereffekt': all(bg(), ground, ...[1, 2, 3, 4].map((k) => { const cx = 50 - k * 7, r = k * 13; return path(`M${cx} ${66 - r} A${r} ${r} 0 0 0 ${cx} ${66 + r}`, 'none', C.grey, 1.8) + path(`M${cx} ${66 - r} A${r} ${r} 0 0 1 ${cx} ${66 + r}`, 'none', HL, 2.4); }), ambulance(50, 74, 0.8), arrow(46, 92, 70, 92, C.dark, 2.4), head(108, 66, 0.8)),
  /** utryckningsfordon: an ambulance, a red fire engine and a police car, all with flashing blue lamps. */
  'vag.utryckningsfordon': all(bg(), ground, ambulance(30, 56, 0.9), at(88, 56, 1, path('M-24 0 L-24 -18 L6 -18 L6 -14 L16 -14 L24 -6 L24 0 Z', C.red, C.ink, 1.6), line('M-22 -22 L4 -22', C.silver, 3), rect(10, -12, 8, 5, '#bfe3f5', 1, C.ink, 0.8), rect(-4, -26, 8, 4, '#3c7fd6', 1.5, C.ink, 1), circle(-14, 1, 4, C.dark, C.ink, 1), circle(14, 1, 4, C.dark, C.ink, 1)), at(60, 104, 1, path('M-24 0 L-24 -9 L-14 -10 L-8 -18 L10 -18 L16 -10 L24 -9 L24 0 Z', C.white, C.ink, 1.6), rect(-24, -7, 48, 3, '#2f5fb5', 0, null), rect(-4, -22, 8, 4, '#3c7fd6', 1.5, C.ink, 1), circle(-13, 1, 4, C.dark, C.ink, 1), circle(13, 1, 4, C.dark, C.ink, 1)), ...[[30, 26], [88, 26], [60, 80]].map(([x, y]) => line(`M${x! - 10} ${y! - 4} l-5 -3 M${x! + 10} ${y! - 4} l5 -3 M${x} ${y! - 8} l0 -5`, '#3c7fd6', 2))),
  /** avlägsna sig: a road going into the distance; a car drives away from a person standing at the roadside, shown big and grey close by, then smaller, and small and orange far away, with an orange arrow along the road. */
  'vag.avlägsna-sig': all(bg(SKY), path('M4 112 L52 30 L68 30 L116 112 Z', C.grey2, C.ink, 1.2), line('M60 108 L60 96 M60 84 L60 72 M60 62 L60 54 M60 46 L60 40', C.white, 2), greyed(at(60, 100, 1, rect(-18, -16, 36, 16, C.red, 3, C.ink, 1.4), circle(-11, 0, 4, C.dark, null), circle(11, 0, 4, C.dark, null)), at(60, 72, 0.6, rect(-18, -16, 36, 16, C.red, 3, C.ink, 1.4), circle(-11, 0, 4, C.dark, null), circle(11, 0, 4, C.dark, null))), at(60, 46, 0.35, rect(-18, -16, 36, 16, HL, 3, C.ink, 2), circle(-11, 0, 4, C.dark, null), circle(11, 0, 4, C.dark, null)), arrow(76, 96, 66, 46, HL, 3), g('translate(-2 0)', figure({ x: 16, h: 0.5, top: C.green }))),
  /** fartkontroll: a police officer at the roadside points a radar gun at an approaching car; the gun shows an orange 62 and a round speed sign shows 50. */
  'vag.fartkontroll': all(bg(SKY), rect(4, 96, 112, 16, C.grey, 0, null), line('M8 104 L24 104 M36 104 L52 104 M64 104 L80 104', C.white, 2), at(34, 100, 0.9, path('M-24 0 L-24 -9 L-14 -10 L-8 -18 L10 -18 L16 -10 L24 -9 L24 0 Z', C.sky, C.ink, 1.6), circle(-13, 1, 4, C.dark, C.ink, 1), circle(13, 1, 4, C.dark, C.ink, 1)), line('M14 84 l-8 0 M14 90 l-6 0', C.grey, 1.6), line('M104 96 L104 40', C.grey, 2.4), circle(104, 30, 11, C.white, C.red, 3.4), num(104, 34, '50', 10), g('translate(86 0)', figure({ x: 0, h: 0.62, top: C.navy, bottom: C.navy })), rect(62, 64, 18, 9, C.dark, 2, C.ink, 1.2), rect(56, 52, 22, 12, C.white, 2, HL, 1.8), num(67, 61, '62', 9, HL), line('M60 68 L46 74', HL, 1.4, '2 2')),
  /** rödförskjutning: a star moves away (arrow); below, a grey reference rainbow bar with three dark lines, and under it an orange-framed rainbow bar where the same lines are moved towards the red end, with an orange arrow. */
  'vag.rödförskjutning': all(bg('#1f2a44'), sparkle(20, 22, 7, C.yellow), arrow(30, 22, 52, 22, C.white, 2), sparkle(60, 22, 4, C.yellow), ...[0, 1].map((r) => all(...['#7b4fc4', '#3c6fd6', '#3fb0d6', '#4fbf6a', '#f2d24e', '#f39a3c', '#e2463a'].map((c, i) => rect(14 + i * 13, 40 + r * 36, 13, 18, c, 0, null)))), greyed(rect(14, 40, 91, 18, 'none', 0, C.white, 1.4)), ...[32, 50, 74].map((x) => line(`M${x} 40 L${x} 58`, C.black, 2.4)), rect(12, 74, 95, 22, 'none', 2, HL, 2.6), ...[42, 60, 84].map((x) => line(`M${x} 76 L${x} 94`, C.black, 2.4)), arrow(40, 104, 80, 104, HL, 2.6)),
  /** ljudvall: a jet flies to the right through a white cone of vapour that forms around its middle; orange curved shock lines stand in front of the cone. */
  'vag.ljudvall': all(bg(SKY), path('M44 60 C60 30 76 30 78 60 C76 90 60 90 44 60 Z', 'rgba(255,255,255,0.9)', C.grey2, 1.4), jet(60, 60, 1.3), path('M84 26 C92 44 92 76 84 94 M94 22 C104 42 104 78 94 98', 'none', HL, 2.6), line('M10 56 L30 56 M14 64 L30 64', C.grey, 2)),
  /** överljudsknall: a jet high in the sky drags an orange V-shaped shock wave down to the ground, where a person covers both ears and orange burst lines shake the window of a house. */
  'vag.överljudsknall': all(bg(SKY), ground, jet(40, 22, 0.8), line('M58 22 L18 112 M58 22 L110 112', HL, 2.4, '5 3'), rect(76, 74, 32, 38, C.beige, 1, C.ink, 1.4), path('M72 76 L92 58 L112 76 Z', C.red, C.ink, 1.4), rect(84, 84, 14, 12, '#bfe3f5', 1, C.ink, 1.2), line('M80 86 l-5 -2 M102 86 l5 -2 M91 80 l0 -6', HL, 2), g('translate(40 0)', figure({ x: 0, h: 0.6, top: C.green })), circle(32, 76, 3.4, C.skin, C.ink, 1), circle(48, 76, 3.4, C.skin, C.ink, 1), line('M24 70 l-5 -3 M56 70 l5 -3', HL, 2)),

  // ── 3327 Interferens och diffraktion ─────────────────────────────────
  /** interferens: water seen from above with two sources sending out rings; where two crests meet the crossing points are orange, forming curved lines of strong waves. */
  'vag.interferens': all(bg('#cfe4f3'), ...[40, 80].flatMap((cx) => range(8).map((i) => circle(cx, 18, 12 * (i + 1), 'none', SEA2, 1.4))), ...(() => { const out: Svg[] = []; for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) { const r1 = 12 * i, r2 = 12 * j, d = 40; const x = (r1 * r1 - r2 * r2 + d * d) / (2 * d); const h2 = r1 * r1 - x * x; if (h2 <= 0) continue; const y = 18 + Math.sqrt(h2); if (y < 108) out.push(dot(f1(40 + x), f1(y), HL, 2.6)); } return out; })(), dot(40, 18, C.dark, 3.4), dot(80, 18, C.dark, 3.4)),
  /** konstruktiv interferens: two equal blue waves with crests at the same places, + and =, and below them one orange wave twice as tall. */
  'vag.konstruktiv-interferens': all(bg(), row(22, 9, 0, SEA2), row(50, 9, 0, SEA2), sums(), row(94, 15, 0, HL, 3.4)),
  /** destruktiv interferens: two equal blue waves where one has a crest where the other has a trough, + and =, and below them a flat orange line. */
  'vag.destruktiv-interferens': all(bg(), row(22, 9, 0, SEA2), row(50, 9, Math.PI, SEA2), sums(), line('M20 94 L112 94', HL, 3.4)),
  /** brusreducering: at the top, grey noise + an orange opposite wave = a flat line; below, a commuter in a train seat wears headphones with orange-outlined ear cups and looks calm. */
  'vag.brusreducering': all(bg(), line('M8 24 L12 16 L16 30 L20 18 L24 28 L28 14 L32 26 L36 20 L40 24', C.grey, 2), num(47, 28, '+', 12, C.dark), line('M54 24 L58 32 L62 18 L66 30 L70 20 L74 34 L78 22 L82 28 L86 24', HL, 2.4), line('M92 22 L100 22 M92 27 L100 27', C.dark, 2), line('M104 24 L114 24', C.dark, 2.4), rect(20, 48, 22, 64, C.navy, 4, C.ink, 1.4), path('M40 112 C40 88 82 88 82 112', C.sky, C.ink, 1.6), circle(60, 72, 15, C.skin, C.ink, 1.6), path('M45 70 C46 56 74 56 75 70 C70 62 50 62 45 70 Z', C.hair, C.ink, 1.2), path('M44 72 C44 50 76 50 76 72', 'none', C.dark, 3), rect(40, 66, 8, 14, C.dark, 3, HL, 2), rect(72, 66, 8, 14, C.dark, 3, HL, 2), path('M55 74 Q57 72 59 74 M61 74 Q63 72 65 74', 'none', C.ink, 1.2), path('M56 80 Q60 83 64 80', 'none', C.ink, 1.2)),
  /** svävning: two tuning forks marked 440 and 442; below, a fast wave that swells and fades again and again inside an orange dashed outline. */
  'vag.svävning': all(bg(), fork(22, 52, 0.8), fork(66, 52, 0.8), num(42, 40, '440', 10, C.dark), num(86, 40, '442', 10, C.dark), line(curve((x) => 86 - 16 * Math.cos((2 * Math.PI * (x - 8)) / 52) * Math.sin((2 * Math.PI * (x - 8)) / 4.6), 8, 112, 300), DEEP, 1.4), line(curve((x) => 86 - 16 * Math.abs(Math.cos((2 * Math.PI * (x - 8)) / 52)), 8, 112), HL, 2, '3 2'), line(curve((x) => 86 + 16 * Math.abs(Math.cos((2 * Math.PI * (x - 8)) / 52)), 8, 112), HL, 2, '3 2')),
  /** vågfront: the sea seen from above with straight parallel wave lines coming in towards a beach; one line is orange with an orange arrow pointing straight ahead from it towards the beach. */
  'vag.vågfront': all(bg(SEA), rect(4, 94, 112, 18, C.beige, 0, null), ...[16, 32, 64, 80].map((y) => line(`M8 ${y} L112 ${y}`, '#e8f4fc', 2.4)), line('M8 48 L112 48', HL, 3.4), arrow(60, 50, 60, 74, HL, 3)),
  /** hamninlopp: a harbour seen from above; two stone piers leave an opening marked with an orange bracket, a boat sails in through the opening, and inside the waves spread out in half circles towards the quay. */
  'vag.hamninlopp': all(bg(SEA2), ...[16, 30].map((y) => line(`M8 ${y} L112 ${y}`, '#e8f4fc', 2)), path('M4 52 L4 112 L116 112 L116 52 Z', '#a9d1ec', null), rect(4, 46, 44, 10, C.grey, 2, C.ink, 1.6), rect(72, 46, 44, 10, C.grey, 2, C.ink, 1.6), ...[16, 28, 40].map((r) => path(`M${60 - r} 56 A${r} ${r} 0 0 0 ${60 + r} 56`, 'none', '#e8f4fc', 2)), hbr(48, 72, 40, HL, 2.6), boat(60, 70, 0.8, C.red), rect(4, 102, 112, 10, C.beige, 0, C.ink, 1), boat(24, 94, 0.6, C.yellow), boat(96, 94, 0.6, C.green)),
  /** diffraktion: straight waves come from the left towards a wall with a narrow gap; after the gap they spread out in orange half circles. */
  'vag.diffraktion': all(bg(), ...[10, 20, 30, 40].map((x) => line(`M${x} 14 L${x} 106`, SEA2, 2.4)), rect(48, 8, 6, 46, C.dark, 1, null), rect(48, 66, 6, 46, C.dark, 1, null), ...[12, 24, 36, 48, 60].map((r) => path(`M54 ${60 - r} A${r} ${r} 0 0 1 54 ${60 + r}`, 'none', HL, 2.4)), arrow(14, 110, 40, 110, C.grey, 2)),
  /** spalt (smal öppning): two dark plates with a very narrow glowing gap between them; an orange double arrow and the number 0,1 show how narrow the gap is. */
  'vag.spalt.2': all(bg(), plates(57, 6), rect(57, 18, 6, 84, '#fff3b0', 0, null), line('M60 18 L60 102', C.yellow, 2), arrow(40, 10, 56, 10, HL, 2.2), arrow(80, 10, 64, 10, HL, 2.2), num(60, 114, '0,1', 9, HL)),
};
