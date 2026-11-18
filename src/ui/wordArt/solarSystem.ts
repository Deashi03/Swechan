/**
 * Matematik & naturvetenskap → Astronomi & rymd → Solens system, 3611–3617 (0.53): the Sun, Mercury and Venus,
 * the Earth and the Moon, Mars, the gas giants, dwarf planets, asteroids and comets.
 * Recurring signs: the part that the word names is orange (ring, outline, arrow, bracket or tint) and a grey
 * reference shows what the word is not. Close words share one layout where only the marked part differs:
 * inre planet / yttre planet (the same row of eight planets next to the Sun, inner four or outer four marked),
 * gasjätte / isjätte (a big planet beside a small grey Earth: orange bands or blue ice), morgonstjärna /
 * aftonstjärna (the same horizon: the Sun rising in the east with 06:00, or setting in the west with 18:00),
 * beboelig / livlös (a living planet with water and green against a grey dead one), meteorit / nedslag (the stone
 * lying on the ground, or the moment it hits) and jordnära / kollisionskurs (the same Earth and orbit: the dashed
 * path of an asteroid passes close by, or ends in the Earth).
 * Digits, maths signs, °, ✓/✗ and ! only; no words that name the word, no brands, no agency logos.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { figure } from './figures';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SPACE = '#17203a';
const NIGHT = '#22305a';
const SUN = '#ffcf4a';
const SUN2 = '#f39a2c';
const SEA = '#4f8fd6';
const LAND = '#5aa469';
const MOON = '#c9c9c4';
const MOON2 = '#a9a9a3';
const MARS = '#d0603a';
const MARS2 = '#a8472a';
const OK = '#3f9a5a';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = SPACE) => rect(4, 4, 112, 108, col, 3, null);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6, dash?: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const check = (x: number, y: number, col: string = OK, s = 1) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, col: string = C.red, s = 1) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
/** A few fixed small stars. */
const STARS: [number, number][] = [[12, 12], [30, 24], [52, 10], [78, 18], [104, 12], [96, 34], [16, 44], [110, 56], [8, 80], [66, 30], [40, 40], [88, 48]];
const stars = (pts: [number, number][] = STARS, r = 1.1) => all(...pts.map(([x, y]) => circle(x, y, r, C.white, null)));

// ── Bodies ───────────────────────────────────────────────────────────
const sunB = (x: number, y: number, r: number) => all(circle(x, y, r + 4, 'rgba(255,207,74,0.25)', null), circle(x, y, r, SUN, SUN2, 1.6));
/** The Earth: blue with two green continents. */
const earthB = (x: number, y: number, r: number) => all(circle(x, y, r, SEA, C.ink, 1.4), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.4)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.1)} ${f1(y - r * 0.1)} ${f1(x - r * 0.3)} ${f1(y + r * 0.2)} C${f1(x - r * 0.6)} ${f1(y + r * 0.3)} ${f1(x - r * 0.8)} ${f1(y)} ${f1(x - r * 0.6)} ${f1(y - r * 0.4)} Z`, LAND, null), path(`M${f1(x + r * 0.2)} ${f1(y + r * 0.1)} C${f1(x + r * 0.6)} ${f1(y - r * 0.1)} ${f1(x + r * 0.8)} ${f1(y + r * 0.4)} ${f1(x + r * 0.4)} ${f1(y + r * 0.7)} C${f1(x + r * 0.2)} ${f1(y + r * 0.6)} ${f1(x + r * 0.1)} ${f1(y + r * 0.3)} ${f1(x + r * 0.2)} ${f1(y + r * 0.1)} Z`, LAND, null));
/** The Moon: grey with craters. */
const moonB = (x: number, y: number, r: number) => all(circle(x, y, r, MOON, C.ink, 1.4), circle(f1(x - r * 0.35), f1(y - r * 0.3), f1(r * 0.22), MOON2, null), circle(f1(x + r * 0.35), f1(y + r * 0.1), f1(r * 0.16), MOON2, null), circle(f1(x - r * 0.1), f1(y + r * 0.45), f1(r * 0.12), MOON2, null));
const ball = (x: number, y: number, r: number, col: string, sw = 1.2) => circle(x, y, r, col, C.ink, sw);
/** Banded gas planet. */
const banded = (x: number, y: number, r: number, base: string, band: string) => all(circle(x, y, r, base, C.ink, 1.4), ...[-0.5, -0.15, 0.25, 0.55].map((k, i) => { const yy = y + r * k, hw = Math.sqrt(Math.max(0, 1 - k * k)) * r; return line(`M${f1(x - hw + 1)} ${f1(yy)} L${f1(x + hw - 1)} ${f1(yy)}`, band, i % 2 ? 2 : 3); }));
const marsB = (x: number, y: number, r: number) => all(circle(x, y, r, MARS, C.ink, 1.4), path(`M${f1(x - r * 0.7)} ${f1(y + r * 0.1)} C${f1(x - r * 0.3)} ${f1(y - r * 0.2)} ${f1(x + r * 0.1)} ${f1(y + r * 0.3)} ${f1(x + r * 0.6)} ${f1(y)}`, 'none', MARS2, f1(r * 0.18)), circle(f1(x + r * 0.3), f1(y - r * 0.45), f1(r * 0.12), MARS2, null));
const saturnB = (x: number, y: number, r: number, ringCol = '#d9c48f', body = '#e7d39c') => all(path(`M${x - r * 2} ${y} A${r * 2} ${r * 0.55} 0 0 1 ${x + r * 2} ${y}`, 'none', ringCol, f1(r * 0.35)), ball(x, y, r, body, 1.4), path(`M${x - r * 2} ${y} A${r * 2} ${r * 0.55} 0 0 0 ${x + r * 2} ${y}`, 'none', ringCol, f1(r * 0.35)));
/** Irregular rock (asteroid / meteorite). */
const rock = (x: number, y: number, s: number, col = '#8a7a68') => at(x, y, s, path('M-10 -4 C-9 -10 -2 -11 3 -9 C9 -8 11 -3 10 2 C9 8 3 10 -3 9 C-9 8 -11 2 -10 -4 Z', col, C.ink, 1.4), circle(-3, -3, 2.2, 'rgba(0,0,0,0.22)', null), circle(4, 3, 1.6, 'rgba(0,0,0,0.22)', null));
/** Meteor streak from (x1,y1) to the head at (x2,y2). */
const streak = (x1: number, y1: number, x2: number, y2: number, col = '#fff3c8', head = 2.4) => all(line(`M${x1} ${y1} L${x2} ${y2}`, 'rgba(255,230,160,0.45)', 4), line(`M${x1} ${y1} L${x2} ${y2}`, col, 1.4), circle(x2, y2, head, '#ffe08a', null));
/** Comet: nucleus at (x,y), tail pointing to angle a (degrees, 0 = right). */
const comet = (x: number, y: number, len: number, a: number) => { const dx = Math.cos(rad(a)), dy = Math.sin(rad(a)), px = -dy, py = dx; const w = len * 0.22; return all(path(`M${x} ${y} L${f1(x + dx * len + px * w)} ${f1(y + dy * len + py * w)} Q${f1(x + dx * len * 1.05)} ${f1(y + dy * len * 1.05)} ${f1(x + dx * len - px * w)} ${f1(y + dy * len - py * w)} Z`, 'rgba(190,225,255,0.55)', null), line(`M${x} ${y} L${f1(x + dx * len * 0.9)} ${f1(y + dy * len * 0.9)}`, 'rgba(255,255,255,0.8)', 1.6), circle(x, y, 4.2, '#eaf6ff', C.ink, 1.2)); };
/** Hill silhouette for night scenes. */
const hill = (col = '#1c2a22') => path('M4 112 L4 92 C30 84 50 88 70 90 C90 92 104 86 116 88 L116 112 Z', col, null);
const fir = (x: number, y: number, s = 1, col = '#1f3b2a') => at(x, y, s, path('M0 -24 L9 -6 L4 -6 L11 6 L-11 6 L-4 -6 L-9 -6 Z', col, null), rect(-1.5, 6, 3, 4, '#3a2a1a', 0, null));
const house = (x: number, y: number, s = 1, lit = false) => at(x, y, s, rect(-10, -12, 20, 12, '#3a3f55', 0, null), path('M-12 -12 L0 -21 L12 -12 Z', '#2c3046', null), rect(-4, -9, 6, 5, lit ? '#ffd86a' : '#4c5470', 0, null));
/** Digital clock face. */
const clock = (x: number, y: number, s: string) => all(rect(x - 17, y - 9, 34, 16, C.dark, 3, C.ink, 1.2), T(x, y + 4, s, 10, '#7dffb0'));
/** Telescope on a tripod, pointing up to the right. */
const scope = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, line('M0 0 L-8 22 M0 0 L8 22 M0 0 L0 22', C.dark, 2), g('rotate(-35)', rect(-14, -5, 30, 10, col, 2, C.ink, 1.4), rect(16, -6, 5, 12, C.dark, 1, C.ink, 1)));
/** Binoculars. */
const binos = (x: number, y: number, s = 1) => at(x, y, s, rect(-11, -6, 9, 14, C.dark, 3, C.ink, 1.2), rect(2, -6, 9, 14, C.dark, 3, C.ink, 1.2), rect(-3, -3, 6, 5, C.grey, 1, C.ink, 1));
/** Eight planets in a row next to the Sun (left edge); `mark` = 'inner' | 'outer'. */
const INNER: [number, number, number, string][] = [[27, 60, 3, '#b2a493'], [37, 60, 4, '#e6cf96'], [48, 60, 4.2, SEA], [58, 60, 3.4, MARS]];
const planetRow = (mark: 'inner' | 'outer') => {
  const inner = INNER.map(([x, y, r, c]) => ball(x, y, r, c));
  const outer = [banded(78, 60, 11, '#d9a66b', '#b9814a'), saturnB(98, 40, 6.5), ball(96, 80, 5.5, '#8fd6e0'), ball(110, 62, 5, '#4a6fd8')];
  const sun = circle(-8, 60, 30, SUN, SUN2, 1.6);
  const box = mark === 'inner' ? rect(21, 51, 43, 18, 'none', 6, HL, 2.6) : rect(64, 28, 52, 62, 'none', 6, HL, 2.6);
  return all(bg(), stars([[12, 14], [40, 20], [70, 12], [20, 100], [60, 96], [100, 104]]), `<clipPath id="ps"><rect x="4" y="4" width="112" height="108"/></clipPath>`, `<g clip-path="url(#ps)">${sun}</g>`, mark === 'inner' ? all(...inner, greyed(...outer)) : all(greyed(...inner), ...outer), box, mark === 'inner' ? arrow(42, 92, 42, 74, HL, 2.6) : arrow(90, 108, 90, 94, HL, 2.6));
};
/** Horizon scene for morgonstjärna / aftonstjärna. east = sun on the right, rising. */
const twilight = (east: boolean) => {
  const sx = east ? 92 : 28, vx = east ? 70 : 50;
  return all(bg('#2b3a6b'), path('M4 60 L116 60 L116 92 L4 92 Z', east ? 'rgba(255,190,120,0.55)' : 'rgba(255,160,110,0.55)', null), stars([[14, 14], [40, 26], [64, 12], [96, 20], [108, 40], [24, 44]]),
    circle(sx, 92, 13, SUN, SUN2, 1.6), path('M4 92 L116 92 L116 112 L4 112 Z', '#1f2a24', null), house(east ? 30 : 90, 104, 1, !east), fir(east ? 50 : 70, 104, 0.8), fir(east ? 12 : 108, 104, 0.9),
    east ? arrow(sx, 74, sx, 60, C.white, 2.4) : arrow(sx, 64, sx, 78, C.white, 2.4),
    sparkle(vx, 36, 8, '#fffbe0'), circle(vx, 36, 2.6, C.white, null), ring(vx, 36, 12), clock(east ? 30 : 90, 16, east ? '06:00' : '18:00'));
};
/** Earth with a dashed orbit; the asteroid path for jordnära / kollisionskurs. */
const nearEarth = (hit = false) => all(bg(), stars([[12, 14], [100, 12], [20, 100], [108, 96], [60, 104]]), line('M4 86 C40 64 80 64 116 86', C.grey, 1.4, '3 3'), earthB(60, 66, 11),
  hit ? all(line('M14 14 L52 58', HL, 2.4, '4 3'), rock(14, 14, 0.8), path('M52 52 L56 48 L56 54 L62 52 L58 58', 'none', C.red, 2), cross(60, 46, C.red, 0.9))
    : all(line('M14 14 C40 30 70 40 84 50 C96 58 104 76 110 100', HL, 2.4, '4 3'), rock(14, 14, 0.8), dblMark(76, 44, 66, 56)));
const dblMark = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.white, 1.4), circle(x1, y1, 1.6, C.white, null), circle(x2, y2, 1.6, C.white, null));
/** A small planet with a grey or a living surface (beboelig / livlös). */
const livingPlanet = (x: number, y: number, r: number) => all(earthB(x, y, r), path(`M${x - r * 0.5} ${y - r * 0.72} C${x - r * 0.3} ${y - r * 0.95} ${x + r * 0.1} ${y - r * 0.95} ${x + r * 0.3} ${y - r * 0.75}`, 'none', C.white, 3), at(x - 2, y - r - 6, 0.7, rect(-1.5, -2, 3, 8, '#7a4a2a', 0, null), circle(0, -6, 6, LAND, C.ink, 1)), at(x + 8, y - r - 2, 0.6, rect(-6, -8, 12, 8, '#f2e6c8', 0, C.ink, 1), path('M-8 -8 L0 -14 L8 -8 Z', C.red, C.ink, 1)));
const deadPlanet = (x: number, y: number, r: number, col = MOON) => all(circle(x, y, r, col, C.ink, 1.4), circle(x - r * 0.3, y - r * 0.2, r * 0.2, 'rgba(0,0,0,0.15)', null), circle(x + r * 0.35, y + r * 0.3, r * 0.15, 'rgba(0,0,0,0.15)', null), circle(x - r * 0.1, y + r * 0.5, r * 0.1, 'rgba(0,0,0,0.15)', null));
/** Plate with a cookie (hjärtformad). */
const cookie = (x: number, y: number, heart: boolean, col: string) => heart
  ? path(`M${x} ${y + 12} C${x - 22} ${y - 2} ${x - 12} ${y - 20} ${x} ${y - 8} C${x + 12} ${y - 20} ${x + 22} ${y - 2} ${x} ${y + 12} Z`, col, C.ink, 1.6)
  : circle(x, y - 2, 13, col, C.ink, 1.6);
/** Step podium with three levels for nedgradera. */
const podium = () => all(rect(14, 84, 30, 28, C.grey2, 1, C.ink, 1.4), rect(44, 64, 32, 48, C.grey2, 1, C.ink, 1.4), rect(76, 96, 30, 16, C.grey2, 1, C.ink, 1.4), T(60, 96, '1', 14, C.dark), T(29, 104, '2', 14, C.dark), T(91, 108, '3', 12, C.dark));

export const SOLSYS_MOTIFS: Record<string, Svg> = {
  // ── 3611 Solen ───────────────────────────────────────────────────────
  /** stjärna: a person stands on a dark hill under a night sky full of twinkling stars; one big star is ringed in orange. */
  'solsys.stjärna': all(bg(NIGHT), stars([[10, 50], [26, 62], [46, 56], [70, 46], [94, 60], [108, 40], [16, 20], [84, 14]], 1.2), ...[[24, 30, 5], [58, 16, 4], [96, 30, 5], [40, 68, 3.5], [80, 66, 3.5]].map(([x, y, r]) => sparkle(x!, y!, r!, '#fff6c8')), sparkle(66, 36, 9, '#fff3a0'), circle(66, 36, 3, C.white, null), ring(66, 36, 14), hill(), at(88, 0, 1, figure({ x: 0, h: 0.5, top: C.orange }))),
  /** himlakropp: four separate dark boxes with orange frames, each holding one single thing in space — a shining star, a ringed planet, a moon with craters and a comet with its tail; no orbits and nothing in the middle. */
  'solsys.himlakropp': all(rect(4, 4, 112, 108, '#e9edf2', 3, null), rect(7, 7, 50, 50, SPACE, 4, HL, 2.4), sparkle(32, 32, 14, '#fff3a0'), circle(32, 32, 4, C.white, null), rect(63, 7, 50, 50, SPACE, 4, HL, 2.4), saturnB(88, 32, 8), rect(7, 59, 50, 50, SPACE, 4, HL, 2.4), moonB(32, 84, 15), rect(63, 59, 50, 50, SPACE, 4, HL, 2.4), comet(98, 96, 26, -135)),
  /** planet: a big blue-green round body, lit on the side that faces a small Sun at the left; an orange curved arrow shows that it goes round the Sun. Small grey stars far away. */
  'solsys.planet': all(bg(), stars(), sunB(16, 60, 9), line('M16 30 C70 22 110 44 110 60 C110 80 70 98 16 90', C.grey, 1.2, '3 3'), circle(76, 60, 24, '#4c9a8f', C.ink, 1.6), path('M76 36 A24 24 0 0 1 76 84 A12 24 0 0 0 76 36 Z', 'rgba(10,20,40,0.45)', null), path('M60 50 C66 46 72 52 70 58 C66 62 60 58 60 50 Z M80 66 C86 62 92 68 88 74 C84 78 78 72 80 66 Z', '#6fbf7a', null), arrow(44, 96, 22, 92, HL, 2.6), path('M100 84 C88 94 64 98 46 96', 'none', HL, 2.6)),
  /** solfläck: a big glowing Sun fills the picture; a group of dark spots is ringed in orange, and two smaller spots are elsewhere. */
  'solsys.solfläck': all(bg(), circle(60, 60, 50, 'rgba(255,207,74,0.25)', null), circle(60, 60, 46, SUN, SUN2, 2), circle(60, 60, 40, '#ffd960', null), ellipse(72, 48, 7, 5, '#5a3a1a', null), circle(80, 54, 3.4, '#5a3a1a', null), circle(66, 56, 2.6, '#5a3a1a', null), ring(74, 51, 16), circle(38, 74, 3, '#5a3a1a', null), circle(48, 82, 2, '#5a3a1a', null)),
  /** solstorm: the Sun at the left throws out a big orange loop and a cloud of particles towards a small Earth at the right; the Earth glows green at the top, and a satellite beside it has jagged red lines for a broken signal. */
  'solsys.solstorm': all(bg(), stars([[60, 14], [100, 16], [70, 100], [110, 104]]), circle(-6, 60, 36, SUN, SUN2, 1.6), path('M28 48 C44 22 62 28 54 46', 'none', HL, 5), path('M28 48 C44 22 62 28 54 46', 'none', '#ffd28a', 2), ...range(16).map((i) => circle(f1(40 + ((i * 17) % 50)), f1(52 + ((i * 23) % 26) - 6), 1.8, HL, null)), arrow(66, 62, 82, 62, HL, 2.6), earthB(98, 64, 10), path('M88 56 C92 46 104 46 108 56', 'none', '#6dff9a', 3.4), at(98, 26, 1, rect(-4, -3, 8, 6, C.silver, 1, C.ink, 1), rect(-14, -2, 9, 4, '#3c6fd6', 0, C.ink, 0.8), rect(5, -2, 9, 4, '#3c6fd6', 0, C.ink, 0.8)), line('M84 34 L88 38 L84 40 L88 44', C.red, 1.8), line('M110 34 L106 38 L110 40 L106 44', C.red, 1.8)),

  // ── 3612 Merkurius och Venus ─────────────────────────────────────────
  /** inre planet: the Sun at the left edge and the eight planets in a row; the four small ones nearest the Sun are coloured and framed in orange, the four big outer ones are grey. */
  'solsys.inre-planet': planetRow('inner'),
  /** stenplanet: a planet cut open like a cake, showing layers of brown and grey stone and a metal core, with mountains and craters on the surface; a small grey gas ball beside it has no hard surface. */
  'solsys.stenplanet': all(bg(), stars([[12, 14], [104, 14], [16, 104], [108, 104]]), circle(56, 62, 38, '#9a8470', C.ink, 1.6), path('M56 62 L56 24 A38 38 0 0 1 94 62 Z', '#c9a27a', C.ink, 1.4), path('M56 62 L56 34 A28 28 0 0 1 84 62 Z', '#8a6a4e', null), path('M56 62 L56 46 A16 16 0 0 1 72 62 Z', '#c8c8cc', C.ink, 1), path('M56 24 A38 38 0 0 1 94 62', 'none', HL, 3), circle(40, 60, 5, 'rgba(0,0,0,0.18)', null), circle(48, 82, 4, 'rgba(0,0,0,0.18)', null), path('M26 46 L32 38 L38 46 Z', '#7a6656', C.ink, 1), greyed(banded(102, 26, 10, '#d9a66b', '#b9814a'))),
  /** krater (på planet och måne): a grey ground under a black sky with a big round bowl-shaped hole with a raised rim, outlined in orange; a small grey rock with motion lines comes down from the sky. */
  'solsys.krater.2': all(bg('#10162a'), stars([[14, 14], [40, 22], [100, 12], [80, 30]]), path('M4 112 L4 66 C30 62 90 62 116 66 L116 112 Z', MOON, null), ellipse(60, 80, 40, 14, MOON2, C.ink, 1.4), ellipse(60, 82, 32, 9, '#8d8d87', null), path('M20 80 C24 72 36 68 60 66 C84 68 96 72 100 80', 'none', '#dcdcd6', 2), ellipse(60, 80, 44, 17, 'none', HL, 2.6), ellipse(22, 100, 6, 2, MOON2, null), ellipse(98, 98, 8, 2.5, MOON2, null), greyed(rock(90, 26, 0.7), line('M72 12 L84 22 M66 18 L80 28', C.grey, 1.6))),
  /** yttemperatur: the glowing orange-brown surface of a planet with a big thermometer stuck into it; the red column is high and the number 460° stands beside it. Under the surface is grey rock. */
  'solsys.yttemperatur': all(bg('#f0b27a'), path('M4 74 C30 70 90 70 116 74 L116 112 L4 112 Z', '#b0603a', C.ink, 1.4), path('M4 90 L116 90 L116 112 L4 112 Z', C.grey, null), line('M10 80 L22 78 M40 84 L56 82 M80 80 L96 82', '#f6d06a', 2), rect(52, 14, 14, 70, C.white, 7, C.ink, 1.8), circle(59, 84, 10, C.red, C.ink, 1.8), rect(56, 22, 6, 62, C.red, 3, null), ...range(6).map((i) => line(`M66 ${24 + i * 10} L70 ${24 + i * 10}`, C.ink, 1.2)), rect(70, 16, 42, 20, C.white, 4, HL, 2.4), T(91, 31, '460°', 13, C.red)),
  /** omloppstid: the Sun in the middle and a planet on a dashed orbit; an orange arrow goes all the way round the orbit from the planet back to it, and a stopwatch sits next to the planet. */
  'solsys.omloppstid': all(bg(), stars([[12, 14], [108, 14], [12, 104], [108, 104]]), sunB(56, 62, 10), ellipse(56, 62, 40, 30, 'none', C.grey, 1.2), path('M96 62 A40 30 0 1 1 95.2 56', 'none', HL, 3), arrow(95.6, 58, 96, 54, HL, 0), path('M96 50 L92 58 L100 58 Z', HL, null), ball(96, 66, 6, '#b2a493', 1.4), at(100, 92, 1, rect(-2.5, -15, 5, 4, C.grey, 1, C.ink, 1), circle(0, 0, 11, C.white, C.ink, 1.6), line('M0 0 L0 -8', HL, 1.8), line('M0 0 L6 3', C.ink, 1.4), circle(0, 0, 1.4, C.ink, null))),
  /** morgonstjärna: dark blue sky over a dark forest; at the right the Sun is just coming up with an arrow pointing up, a clock shows 06:00, and a very bright point above the horizon is ringed in orange. */
  'solsys.morgonstjärna': twilight(true),
  /** aftonstjärna: the same horizon, but the Sun is going down at the left with an arrow pointing down, a clock shows 18:00, windows are lit, and a very bright point above the horizon is ringed in orange. */
  'solsys.aftonstjärna': twilight(false),
  /** med blotta ögat: a person looks up at the stars and the Moon with nothing in the hands; the eyes are marked with an orange ring, and a grey telescope and grey binoculars beside them are crossed out. */
  'solsys.med-blotta-ögat': all(bg(NIGHT), stars(), moonB(92, 22, 9), sparkle(60, 18, 4, '#fff6c8'), sparkle(30, 28, 3, '#fff6c8'), hill('#1c2a3a'), figure({ x: 46, h: 0.92, top: C.orange }), ring(46, 31, 10), greyed(scope(94, 72, 0.7), binos(94, 100, 0.9)), cross(98, 80, C.red, 1.2), cross(106, 100, C.red, 0.9)),

  // ── 3613 Jorden och månen ────────────────────────────────────────────
  /** måne: a big grey Moon with craters in a black sky full of stars, ringed in orange; a small blue Earth is low in the corner. */
  'solsys.måne': all(bg(), stars(), moonB(56, 52, 30), ring(56, 52, 36), earthB(102, 98, 8)),
  /** beboelig: two planets side by side; the grey dead one with craters is crossed out, the other has blue sea, green land, clouds, a tree and a small house, and gets an orange ring and a green tick. */
  'solsys.beboelig': all(bg(), stars(), greyed(deadPlanet(28, 64, 18)), cross(28, 96, C.red, 1), livingPlanet(80, 64, 22), ring(80, 64, 32), check(80, 104, OK, 1)),
  /** månsken: a dark night landscape with snow; a small Moon at the top left sends a pale yellow light down onto a path where two people walk; their shadows fall on the snow, and the path is lit up. */
  'solsys.månsken': all(bg('#1a2448'), stars([[60, 12], [90, 20], [108, 40], [74, 34]]), moonB(22, 20, 9), path('M26 26 L60 112 L104 112 L30 22 Z', 'rgba(255,240,170,0.38)', null), path('M4 84 C40 78 80 80 116 84 L116 112 L4 112 Z', '#d8dfee', null), fir(10, 82, 1), fir(108, 82, 1.1), fir(94, 80, 0.8), path('M50 112 L64 86 L74 86 L96 112 Z', '#fff2b8', null), at(64, 0, 1, figure({ x: 0, h: 0.55, top: C.navy })), at(82, 4, 1, figure({ x: 0, h: 0.55, top: C.red, hairStyle: 'long' })), path('M70 112 L58 108 M88 112 L76 110', 'none', 'rgba(40,50,90,0.4)', 4)),
  /** månlandskap: a wide grey landscape of dust, stones and many round craters under a black sky; the small blue Earth hangs in the sky. */
  'solsys.månlandskap': all(bg('#0e1426'), stars([[12, 14], [40, 30], [70, 12], [100, 26], [20, 46]]), earthB(86, 30, 11), path('M4 112 L4 62 C20 58 34 64 50 60 C70 56 90 62 116 58 L116 112 Z', MOON, C.ink, 1.2), ellipse(30, 78, 16, 5, MOON2, C.ink, 1), ellipse(80, 72, 10, 3.5, MOON2, C.ink, 1), ellipse(66, 96, 22, 7, MOON2, C.ink, 1), ellipse(104, 92, 7, 2.5, MOON2, null), ellipse(14, 100, 6, 2, MOON2, null), path('M44 86 L50 82 L54 86 Z M92 104 L96 100 L100 104 Z', '#8d8d87', C.ink, 0.8)),

  // ── 3614 Mars ────────────────────────────────────────────────────────
  /** den röda planeten: a night sky with stars; a big red-orange planet with dark markings is ringed in orange, and two tiny moons sit beside it. */
  'solsys.den-röda-planeten': all(bg(), stars(), marsB(58, 60, 30), ring(58, 60, 36), rock(104, 30, 0.35, '#9a8a78'), rock(16, 92, 0.3, '#9a8a78')),
  /** dammstorm: an orange-brown sky over a red desert; a huge brown cloud of dust rolls in from the left and is already swallowing a small six-wheeled robot car; small dust dots fly to the right. */
  'solsys.dammstorm': all(bg('#e2a46a'), path('M4 92 L116 92 L116 112 L4 112 Z', '#b8582f', null), at(84, 88, 1, rect(-12, -10, 24, 8, C.silver, 2, C.ink, 1.2), line('M-6 -10 L-6 -18 M-6 -18 L0 -18', C.ink, 1.4), rect(0, -21, 6, 5, C.dark, 1, null), ...[-9, 0, 9].map((x) => circle(x, 0, 3, C.dark, C.ink, 1))), path('M4 30 C20 20 34 30 40 40 C52 34 64 44 62 56 C74 58 78 74 70 84 C76 90 72 100 60 100 L4 100 Z', '#8a4a26', C.ink, 1.2), path('M14 44 C24 38 32 46 30 54 M30 70 C40 64 50 72 46 80', 'none', '#b06a3c', 2.4), ...range(14).map((i) => circle(f1(68 + ((i * 13) % 44)), f1(30 + ((i * 19) % 50)), 1.6, '#8a4a26', null)), arrow(72, 20, 100, 20, HL, 2.6)),
  /** iskalott: a red planet seen from above with a white cap of ice at the top, outlined in orange; the rest of the surface is red with dark markings. */
  'solsys.iskalott': all(bg(), stars(), marsB(60, 64, 40), path('M36 34 C44 22 76 22 84 34 C76 40 66 36 60 40 C52 36 44 40 36 34 Z', C.white, C.ink, 1.4), path('M36 34 C44 22 76 22 84 34 C76 40 66 36 60 40 C52 36 44 40 36 34 Z', 'none', HL, 2.6), ellipse(60, 102, 8, 2.4, '#f2f2f2', null)),
  /** livlös: two identical brown planets side by side. The left one has green land, water, a tree, a flower and a bird, and is crossed out in red; the right one is exactly the same planet with nothing living on it at all, and it is ringed in orange. */
  'solsys.livlös': all(bg(), stars(), circle(30, 62, 22, '#b08a6a', C.ink, 1.4), path('M10 66 C16 58 44 58 50 66 C46 82 14 82 10 66 Z', LAND, null), ellipse(26, 72, 8, 4, SEA, null), at(24, 42, 1, rect(-1.5, -2, 3, 10, '#7a4a2a', 0, null), circle(0, -6, 7, LAND, C.ink, 1)), at(40, 44, 0.9, circle(0, -2, 4, C.pink, C.ink, 1), line('M0 2 L0 8', LAND, 2)), path('M14 26 C17 22 20 22 22 26 C24 22 27 22 30 26', 'none', C.ink, 1.6), cross(30, 98, C.red, 1.2), circle(88, 62, 22, '#b08a6a', C.ink, 1.4), circle(80, 56, 4, 'rgba(0,0,0,0.15)', null), circle(96, 70, 3, 'rgba(0,0,0,0.15)', null), ring(88, 62, 28), line('M60 30 L60 96', C.grey, 1.2, '3 3')),

  // ── 3615 Gasjättarna ─────────────────────────────────────────────────
  /** yttre planet: the same row of eight planets next to the Sun, but now the four big ones far from the Sun are coloured and framed in orange, and the four small ones near the Sun are grey. */
  'solsys.yttre-planet': planetRow('outer'),
  /** gasjätte: a huge planet with orange and brown bands of cloud and a red oval storm, ringed in orange; a small grey Earth beside it shows the size. */
  'solsys.gasjätte': all(bg(), stars(), banded(56, 62, 40, '#e0b27a', '#b9784a'), ellipse(72, 78, 8, 4.5, '#c8503a', C.ink, 1), ring(56, 62, 46), greyed(earthB(108, 104, 5))),
  /** isjätte: the same layout with a big pale blue planet with soft bands and a thin faint ring, and snowflake marks beside it; a small grey Earth shows the size. */
  'solsys.isjätte': all(bg(), stars(), path('M8 70 A50 10 0 0 1 104 54', 'none', 'rgba(200,230,255,0.5)', 1.6), circle(56, 62, 34, '#8fd0e8', C.ink, 1.4), line('M28 50 L84 50 M24 66 L88 66 M30 80 L82 80', '#b8e6f4', 3), ring(56, 62, 40), ...[[14, 24], [104, 30], [100, 84]].map(([x, y]) => at(x!, y!, 0.8, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', '#e8f8ff', 1.8))), greyed(earthB(108, 104, 5))),
  /** ring (runt planet): a pale planet in grey tones with a broad flat ring around it; the ring is coloured and outlined in orange. */
  'solsys.ring.3': all(bg(), stars(), path('M14 62 A46 13 0 0 1 106 62', 'none', HL, 9), path('M14 62 A46 13 0 0 1 106 62', 'none', '#f4c27a', 5), circle(60, 60, 24, '#d8d4c8', C.ink, 1.4), line('M40 52 L80 52 M37 64 L83 64', '#bdb8aa', 2.4), path('M14 62 A46 13 0 0 0 106 62', 'none', HL, 9), path('M14 62 A46 13 0 0 0 106 62', 'none', '#f4c27a', 5)),

  // ── 3616 Dvärgplaneter ───────────────────────────────────────────────
  /** dvärgplanet: three bodies in a row on a dashed orbit line — a big grey planet, a small round beige body ringed in orange, and a grey lumpy rock that is not round. */
  'solsys.dvärgplanet': all(bg(), stars([[12, 14], [60, 12], [108, 14], [30, 104], [96, 104]]), line('M4 60 L116 60', C.grey, 1.2, '3 3'), greyed(earthB(28, 60, 20)), circle(70, 60, 8, '#d8c0a0', C.ink, 1.4), circle(67, 57, 2.4, '#b89a7a', null), ring(70, 60, 13), greyed(rock(102, 60, 0.9)), cross(102, 80, C.red, 0.7), check(70, 82, OK, 0.8)),
  /** hjärtformad: two cookies on plates on a table; the left one is round and grey, the right one has the shape of a heart and is outlined in orange. */
  'solsys.hjärtformad': all(bg('#f6f0e6'), rect(4, 80, 112, 32, '#d4a373', 0, null), greyed(ellipse(32, 78, 24, 7, C.white, C.ink, 1.4), cookie(32, 72, false, '#e0b070')), ellipse(84, 78, 26, 8, C.white, C.ink, 1.4), cookie(84, 70, true, '#e0b070'), path('M84 86 C58 68 70 46 84 60 C98 46 110 68 84 86 Z', 'none', HL, 2.6)),
  /** upptäckt: a person at a telescope at night; in the sky among grey stars one new small point is ringed in orange, and a big orange ! stands next to the person. */
  'solsys.upptäckt': all(bg(NIGHT), stars([[10, 14], [30, 30], [50, 12], [20, 50], [100, 14], [108, 50]], 1.3), circle(84, 30, 2.6, '#fff3a0', null), ring(84, 30, 9), hill('#1c2a3a'), scope(58, 82, 0.9), figure({ x: 34, h: 0.7, top: C.green }), T(14, 72, '!', 24, HL)),
  /** nedgradera: a podium with steps 1, 2 and 3; a small round body that stood on the top step (grey ghost) is moved down to a lower step, with an orange curved arrow going down. */
  'solsys.nedgradera': all(bg('#eef2f6'), podium(), greyed(circle(60, 52, 9, '#d8c0a0', C.ink, 1.4)), circle(91, 86, 9, '#d8c0a0', C.ink, 1.4), ring(91, 86, 13), path('M66 40 C84 30 98 50 92 70', 'none', HL, 3), path('M86 66 L92 76 L98 66 Z', HL, null)),

  // ── 3617 Asteroider och kometer ──────────────────────────────────────
  /** asteroid: a big lumpy brown-grey rock with craters floating in space, outlined in orange; stars behind it. */
  'solsys.asteroid': all(bg(), stars(), rock(60, 60, 3.6), path('M24 46 C27 24 52 20 71 28 C93 31 100 50 96 67 C93 89 71 97 49 93 C27 90 20 68 24 46 Z', 'none', HL, 2.6)),
  /** asteroidbälte: the Sun at the left, a small red planet and a big banded planet on orbits; between them a broad band of many small rocks is tinted orange. */
  'solsys.asteroidbälte': all(bg(), `<clipPath id="ab"><rect x="4" y="4" width="112" height="108"/></clipPath>`, `<g clip-path="url(#ab)">${all(circle(-10, 60, 22, SUN, SUN2, 1.6), path('M-10 2 A58 58 0 0 1 -10 118', 'none', 'rgba(228,87,46,0.28)', 22), ...range(60).map((i) => { const a = rad(-80 + (i * 160) / 60), r = 50 + ((i * 7) % 16); return circle(f1(-10 + Math.cos(a) * r), f1(60 + Math.sin(a) * r), 1 + (i % 3) * 0.5, '#9a8a78', null); }), line('M-10 26 A34 34 0 0 1 -10 94', C.grey, 1, '3 3'), line('M-10 -30 A90 90 0 0 1 -10 150', C.grey, 1, '3 3'))}</g>`, marsB(22, 30, 5), banded(80, 60, 12, '#e0b27a', '#b9784a')),
  /** komet: a small icy nucleus in the black sky with a long pale blue-white tail stretching up to the left; small stars behind. */
  'solsys.komet': all(bg(), stars(), comet(84, 82, 80, -140), ring(84, 82, 9)),
  /** stjärnfall: two people lie on the grass at night and look up; one bright streak of light crosses the starry sky. */
  'solsys.stjärnfall': all(bg(NIGHT), stars([[10, 20], [30, 40], [60, 16], [80, 40], [104, 22], [96, 60], [20, 66], [50, 54]], 1.2), streak(30, 14, 76, 44), path('M4 88 C40 84 80 84 116 88 L116 112 L4 112 Z', '#1f3a2a', null), at(40, 92, 1, rect(-16, -4, 26, 8, C.navy, 4, C.ink, 1.2), circle(14, -1, 5, C.skin, C.ink, 1.2), path('M12 -6 C16 -8 20 -4 18 0', 'none', C.hair, 3)), at(80, 96, 1, rect(-16, -4, 26, 8, C.red, 4, C.ink, 1.2), circle(14, -1, 5, C.skin, C.ink, 1.2), path('M10 -5 C14 -10 22 -6 19 2', 'none', C.hair, 3.4))),
  /** meteorsvärm: many bright streaks of light in the night sky, all coming from the same point; a person on a dock looks up. */
  'solsys.meteorsvärm': all(bg(NIGHT), stars([[10, 50], [110, 16], [100, 60], [16, 14]], 1.2), ...[[24, 40], [44, 56], [70, 58], [96, 44], [36, 20], [92, 20], [60, 64]].map(([x, y]) => streak(f1(60 + (x! - 60) * 0.3), f1(22 + (y! - 22) * 0.3), x!, y!, '#fff3c8', 2)), circle(60, 22, 3, 'rgba(255,240,180,0.5)', null), rect(4, 92, 112, 20, '#20365a', 0, null), rect(10, 90, 44, 5, '#7a5a3a', 1, C.ink, 1), at(30, -12, 1, figure({ x: 0, h: 0.42, top: C.orange }))),
  /** meteorit: a dark heavy stone lies in a small hole in the grass, outlined in orange; a faded grey streak in the sky shows where it came from. */
  'solsys.meteorit': all(bg('#cfe4f3'), greyed(line('M16 12 L64 74', C.grey, 4)), path('M4 80 L116 80 L116 112 L4 112 Z', LAND, null), ellipse(70, 86, 22, 6, '#6a4a2a', null), rock(70, 80, 1.5, '#3d3a38'), path('M51 74 C54 64 66 62 74 64 C84 65 87 72 86 78 C85 87 76 90 68 89 C58 88 50 84 51 74 Z', 'none', HL, 2.6), line('M30 98 L36 94 M100 100 L106 96 M90 92 L94 90', '#3e7a4e', 2)),
  /** nedslag: a big rock from the sky crashes into the ground; a huge orange burst of fire and a ring of dust and stones fly up where it hits. */
  'solsys.nedslag': all(bg('#2a2a3c'), path('M4 84 L116 84 L116 112 L4 112 Z', '#7a6a5a', null), line('M10 8 L48 66', 'rgba(255,200,120,0.6)', 6), path('M60 84 L44 52 L56 62 L58 34 L66 60 L80 40 L74 66 L96 56 L78 80 Z', HL, '#ffd28a', 1.6), path('M60 80 L52 62 L60 66 L64 50 L68 66 L78 60 L70 78 Z', '#ffd28a', null), ...[[24, 70], [34, 56], [96, 70], [88, 48], [104, 60]].map(([x, y]) => rock(x!, y!, 0.35, '#5a4a3a')), path('M20 84 C30 74 44 72 50 80 M70 80 C80 72 96 74 102 84', 'none', '#b8a898', 4)),
  /** jordnära (i rymden): the Earth with its dashed orbit; the dashed orange path of a small asteroid comes from the top left, passes close by the Earth and goes on; a short white line shows how close. */
  'solsys.jordnära.2': nearEarth(),
  /** kollisionskurs: the same Earth and orbit as jordnära. The asteroid is still far away; behind it a grey trail, in front of it an orange arrow and a dashed orange line that goes straight to the Earth, which is ringed in orange as the target. Nothing has hit yet. */
  'solsys.kollisionskurs': all(bg(), stars([[12, 14], [100, 12], [20, 100], [108, 96], [60, 104]]), line('M4 86 C40 64 80 64 116 86', C.grey, 1.4, '3 3'), earthB(60, 66, 11), greyed(line('M4 4 L14 13', C.grey, 2.4)), rock(18, 17, 0.8), arrow(24, 24, 32, 33, HL, 2.6), line('M35 37 L53 59', HL, 2.6, '4 3'), ring(60, 66, 15, HL, 2.4)),
};
