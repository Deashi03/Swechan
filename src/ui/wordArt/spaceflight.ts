/**
 * Matematik & naturvetenskap → Astronomi & rymd → Rymdfart, 3651–3657 (0.53): rockets and rocket engines, orbits,
 * satellites, space stations, space probes, moon landings and future space missions.
 * Recurring signs: space is dark blue with small white stars, the earth a blue disc with green land, the moon grey with
 * craters; a rocket is white with a red nose, a capsule a grey cone with a round window and a dark heat shield below,
 * a satellite a gold box with two blue solar panels, an astronaut a white suit with a gold visor. The part the word
 * names is ringed or framed in orange, and a grey copy beside it shows what the word is not.
 * Close words share one layout where only the marked part differs: obemannad/bemannad (the same capsule, the window
 * empty or with a face), värmesköld/återinträde (the shield ringed close up, or the whole capsule falling through the
 * atmosphere), rymddräkt/rymdpromenad (the empty suit on a stand, or the astronaut outside the station),
 * raketsteg/bränsletank (the lower stage falling away, or the tanks seen inside the rocket).
 * Digits and maths signs only; no words, no flags, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const SPACE = '#1b2442';
const PAPER = '#f6f2ea';
const SKY = '#cfe7f5';
const SEA = '#4f8fd6';
const SEA2 = '#2f6fb0';
const LAND = '#5aa469';
const MOON = '#c9c9c4';
const MOON2 = '#a9a9a3';
const MARS = '#cf6a40';
const MARS2 = '#a8472a';
const GOLD = '#e0b23c';
const PANEL = '#3d6fb8';
const PANEL2 = '#9cc0ef';
const SHIELD = '#6b3f26';
const HOT = '#ff8a2a';
const RED = '#d8343a';
const WHITE = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);
const bg = (col: string = SPACE) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, rx: number, ry = rx, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
/** Digits / maths signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const STARS: [number, number][] = [[12, 12], [30, 22], [52, 10], [78, 16], [104, 12], [96, 34], [16, 44], [110, 58], [10, 74], [66, 28], [42, 40], [86, 46]];
const stars = (pts: [number, number][] = STARS) => all(...pts.map(([x, y]) => circle(x, y, 1.1, WHITE, null)));
const space = () => all(bg(), stars());

// ── Bodies ───────────────────────────────────────────────────────────
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, SEA, C.ink, 1.4),
  path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.4)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.1)} ${f1(y - r * 0.1)} ${f1(x - r * 0.3)} ${f1(y + r * 0.2)} C${f1(x - r * 0.6)} ${f1(y + r * 0.3)} ${f1(x - r * 0.8)} ${f1(y)} ${f1(x - r * 0.6)} ${f1(y - r * 0.4)} Z`, LAND, null),
  path(`M${f1(x + r * 0.2)} ${f1(y + r * 0.1)} C${f1(x + r * 0.6)} ${f1(y - r * 0.1)} ${f1(x + r * 0.8)} ${f1(y + r * 0.4)} ${f1(x + r * 0.4)} ${f1(y + r * 0.7)} C${f1(x + r * 0.2)} ${f1(y + r * 0.6)} ${f1(x + r * 0.1)} ${f1(y + r * 0.3)} ${f1(x + r * 0.2)} ${f1(y + r * 0.1)} Z`, LAND, null));
/** The curved edge of the earth along the bottom of the picture. */
const earthArc = (top = 92, atmo = false) => all(atmo ? path(`M4 ${top - 12} Q60 ${top - 30} 116 ${top - 12} L116 112 L4 112 Z`, '#8fc7ef', null) : '',
  path(`M4 ${top} Q60 ${top - 18} 116 ${top} L116 112 L4 112 Z`, SEA, null), path(`M20 ${top - 4} C34 ${top - 12} 50 ${top - 10} 56 ${top - 4} C50 ${top + 4} 30 ${top + 6} 20 ${top - 4} Z`, LAND, null),
  path(`M76 ${top - 6} C86 ${top - 12} 100 ${top - 8} 104 ${top} C96 ${top + 6} 82 ${top + 4} 76 ${top - 6} Z`, LAND, null));
/** Grey moon ground from y to the bottom, with small craters. */
const moonGround = (y = 88) => all(path(`M4 ${y} C30 ${y - 4} 60 ${y + 3} 116 ${y - 2} L116 112 L4 112 Z`, MOON, null), ellipse(26, y + 12, 8, 2.4, MOON2, null), ellipse(96, y + 14, 6, 2, MOON2, null), ellipse(64, y + 18, 5, 1.6, MOON2, null));
const marsGround = (y = 88) => all(path(`M4 ${y} C30 ${y - 4} 60 ${y + 3} 116 ${y - 2} L116 112 L4 112 Z`, MARS, null), ellipse(24, y + 12, 6, 2.6, MARS2, null), ellipse(96, y + 14, 5, 2.2, MARS2, null));

// ── Craft ────────────────────────────────────────────────────────────
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 C-7 10 -3 18 0 26 C3 18 7 10 6 0 Z', HOT, null), path('M-3 0 C-3 7 -1 12 0 17 C1 12 3 7 3 0 Z', '#ffe27a', null));
type RocketO = { body?: string; nose?: string; flame?: boolean; grey?: boolean };
/** Upright rocket; (x, y) is the bottom of the body, s = 1 is about 60 px tall without the flame. */
const rocket = (x: number, y: number, s = 1, o: RocketO = {}) => {
  const b = o.grey ? C.grey2 : (o.body ?? WHITE), nz = o.grey ? C.grey : (o.nose ?? RED), fin = o.grey ? C.grey : RED;
  return at(x, y, s, o.flame ? flame(0, 4, 1) : '', path('M-6 0 L-4 5 L4 5 L6 0 Z', C.dark, C.ink, 1.2),
    path('M-8 -12 L-16 2 L-8 0 Z M8 -12 L16 2 L8 0 Z', fin, C.ink, 1.3), rect(-8, -46, 16, 46, b, 1, C.ink, 1.5),
    path('M-8 -46 C-8 -54 -3 -60 0 -62 C3 -60 8 -54 8 -46 Z', nz, C.ink, 1.5), circle(0, -34, 3.4, '#9fd2ee', C.ink, 1.2), line('M-8 -22 L8 -22', C.grey, 1));
};
const pad = (x: number, y = 112) => all(rect(x - 22, y - 6, 44, 6, C.grey, 1, C.ink, 1.3), rect(x + 16, y - 62, 6, 56, '#b0503a', 0, C.ink, 1.2), line(`M${x + 16} ${y - 52} L${x + 22} ${y - 44} M${x + 22} ${y - 52} L${x + 16} ${y - 44} M${x + 16} ${y - 36} L${x + 22} ${y - 28} M${x + 22} ${y - 36} L${x + 16} ${y - 28} M${x + 16} ${y - 20} L${x + 22} ${y - 12} M${x + 22} ${y - 20} L${x + 16} ${y - 12}`, C.ink, 0.8));
type SatO = { body?: string; panels?: boolean; dish?: boolean; grey?: boolean };
/** Satellite centred on (x, y); s = 1 is about 56 px wide. */
const satellite = (x: number, y: number, s = 1, o: SatO = {}) => {
  const b = o.grey ? C.grey2 : (o.body ?? GOLD), p = o.grey ? C.grey : PANEL;
  const pan = (dx: number) => all(rect(dx, -6, 18, 12, p, 1, C.ink, 1.2), line(`M${dx + 6} -6 L${dx + 6} 6 M${dx + 12} -6 L${dx + 12} 6 M${dx} 0 L${dx + 18} 0`, o.grey ? C.grey2 : PANEL2, 0.8));
  return at(x, y, s, line('M-28 0 L28 0', C.dark, 1.4), o.panels === false ? '' : all(pan(-28), pan(10)), rect(-8, -8, 16, 16, b, 2, C.ink, 1.4), line('M-4 -8 L-4 8 M4 -8 L4 8', o.grey ? C.grey : '#b8892a', 0.8),
    o.dish === false ? '' : all(line('M0 8 L0 12', C.ink, 1.2), path('M-6 12 Q0 20 6 12 Z', WHITE, C.ink, 1.1)));
};
type CapO = { window?: 'empty' | 'face' | 'plain'; grey?: boolean; shield?: string };
/** Capsule; (x, y) is the middle of the heat shield, s = 1 is about 36 px wide. */
const capsule = (x: number, y: number, s = 1, o: CapO = {}) => {
  const b = o.grey ? C.grey2 : '#d9dde2', sh = o.grey ? C.grey : (o.shield ?? SHIELD);
  const win = o.window ?? 'plain';
  return at(x, y, s, path('M-18 0 L-8 -30 L8 -30 L18 0 Z', b, C.ink, 1.5), rect(-6, -34, 12, 4, b, 1, C.ink, 1.2),
    path('M-19 0 Q0 7 19 0 Z', sh, C.ink, 1.4), circle(0, -14, 6.5, win === 'face' ? '#9fd2ee' : '#26324f', C.ink, 1.4),
    win === 'face' ? all(circle(0, -13.5, 3.6, C.skin, C.ink, 0.8), circle(-1.3, -14, 0.5, C.ink, null), circle(1.3, -14, 0.5, C.ink, null), path('M-3.6 -15 C-3.6 -19 3.6 -19 3.6 -15 Z', C.hair, null), rect(-3, -10, 6, 3, WHITE, 1, null)) : '',
    win === 'empty' ? all(rect(-2.5, -15, 5, 6, '#8a6a4a', 1, null), line('M-3 -9 L3 -9', '#8a6a4a', 1.4)) : '');
};
/** Astronaut in a white suit; (x, y) is the waist, s = 1 is about 40 px tall. */
const astronaut = (x: number, y: number, s = 1, a = 0, grey = false) => {
  const suit = grey ? C.grey2 : WHITE, visor = grey ? C.grey : GOLD;
  return rot(x, y, a, s, rect(-9, -18, 18, 16, C.grey, 3, C.ink, 1.2), line('M-7 -14 L-15 -4 M7 -14 L15 -6', C.ink, 7.5), line('M-7 -14 L-15 -4 M7 -14 L15 -6', suit, 5.5),
    circle(-15, -3, 2.6, C.grey, C.ink, 1), circle(15, -5, 2.6, C.grey, C.ink, 1), line('M-4 0 L-6 16 M4 0 L6 16', C.ink, 8), line('M-4 0 L-6 16 M4 0 L6 16', suit, 6),
    rect(-8, -16, 16, 18, suit, 4, C.ink, 1.4), rect(-4, -10, 8, 5, '#cfd6de', 1, C.ink, 0.8), circle(0, -23, 8, suit, C.ink, 1.4), path('M-6 -24 C-6 -29 6 -29 6 -24 C6 -20 -6 -20 -6 -24 Z', visor, C.ink, 1));
};
/** Space station centred on (x, y); s = 1 is about 100 px wide. */
const station = (x: number, y: number, s = 1) => {
  const pan = (dx: number, dy: number) => all(rect(dx, dy, 14, 26, PANEL, 1, C.ink, 1.1), line(`M${dx} ${dy + 9} L${dx + 14} ${dy + 9} M${dx} ${dy + 17} L${dx + 14} ${dy + 17} M${dx + 7} ${dy} L${dx + 7} ${dy + 26}`, PANEL2, 0.7));
  return at(x, y, s, rect(-46, -2, 92, 4, C.grey, 0, C.ink, 1), pan(-46, -30), pan(-46, 4), pan(-30, -30), pan(-30, 4), pan(16, -30), pan(16, 4), pan(32, -30), pan(32, 4),
    rect(-10, -8, 24, 16, '#e3e6ea', 4, C.ink, 1.3), rect(-6, 8, 10, 16, '#e3e6ea', 3, C.ink, 1.2), rect(14, -5, 10, 10, '#e3e6ea', 3, C.ink, 1.1), circle(2, 0, 2, '#9fd2ee', C.ink, 0.8));
};
/** Lander on four legs; (x, y) is the ground under it. */
const lander = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, line('M-10 -10 L-18 0 M10 -10 L18 0 M-5 -10 L-7 0 M5 -10 L7 0', C.ink, 1.6), line('M-21 0 L-15 0 M15 0 L21 0', C.ink, 2),
  path('M-14 -10 L14 -10 L11 -22 L-11 -22 Z', col, C.ink, 1.4), path('M-8 -22 L8 -22 L6 -32 L-6 -32 Z', '#d9dde2', C.ink, 1.3), circle(0, -27, 2.4, '#26324f', null), line('M8 -30 L14 -38', C.ink, 1.2), path('M10 -40 Q15 -34 19 -40 Z', WHITE, C.ink, 1));
/** Probe with a big dish antenna; centred on (x, y). */
const probe = (x: number, y: number, s = 1) => at(x, y, s, line('M6 0 L26 -10 M-6 4 L-18 14', C.dark, 1.4), circle(26, -10, 2.4, C.grey, C.ink, 1), rect(-20, 12, 6, 6, C.grey, 1, C.ink, 1),
  rect(-7, -5, 14, 12, GOLD, 2, C.ink, 1.3), path('M-14 -6 Q0 -22 14 -6 Z', WHITE, C.ink, 1.4), line('M0 -6 L0 -16', C.ink, 1.2));
const waves = (x: number, y: number, a: number, col = '#9fd2ee') => rot(x, y, a, 1, line('M0 -4 Q3 0 0 4 M5 -7 Q10 0 5 7 M10 -10 Q17 0 10 10', col, 1.6));
const dishGround = (x: number, y: number, s = 1) => at(x, y, s, rect(-4, -14, 8, 14, C.grey, 0, C.ink, 1.2), rot(0, -16, -30, 1, path('M-18 0 Q0 16 18 0 Z', WHITE, C.ink, 1.5), line('M0 6 L0 -10', C.ink, 1.3), circle(0, -10, 2, C.dark, null)));
const cloudSwirl = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C8 -2 10 -10 2 -12 C-10 -14 -16 -2 -10 8 C-4 16 12 14 16 4', 'none', WHITE, 4), path('M0 0 C-4 2 -6 -4 -2 -5', 'none', WHITE, 3), circle(0, 0, 1.6, SEA2, null));
const parachute = (x: number, y: number, s = 1, col: string = '#ef8a3c') => at(x, y, s, path('M-12 0 C-12 -14 12 -14 12 0 Q6 -3 0 0 Q-6 -3 -12 0 Z', col, C.ink, 1.2), line('M0 -11 L0 0', WHITE, 1.4));
const sea = (y = 96) => all(rect(4, y, 112, 112 - y, SEA, 0, null), line(`M10 ${y + 6} q4 -3 8 0 t8 0 M60 ${y + 10} q4 -3 8 0 t8 0 M88 ${y + 4} q4 -3 8 0 t8 0`, '#a9d2f2', 1.2));
const dome = (x: number, y: number, r: number, col = '#e3e6ea') => all(path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, col, C.ink, 1.4), line(`M${x - r * 0.7} ${f1(y - r * 0.7)} L${x + r * 0.7} ${f1(y - r * 0.7)} M${x} ${y - r} L${x} ${y}`, C.grey, 0.8), rect(x - 3, y - 6, 6, 6, C.dark, 1, null));
const boot = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -20 L6 -20 L6 -6 L14 -4 C17 -3 17 2 14 2 L-8 2 Z', WHITE, C.ink, 1.4), rect(-9, 0, 25, 4, C.grey, 1, C.ink, 1));

// ── Scenes ───────────────────────────────────────────────────────────
export const SPACEFL_MOTIFS: Record<string, Svg> = {
  // ── Raketer och raketmotorer ───────────────────────────────────────
  'rymdf.raketmotor': all(bg(SKY), rect(34, 4, 52, 48, WHITE, 1, C.ink, 1.6), line('M34 30 L86 30', C.grey, 1.2), path('M34 52 L20 66 L34 62 Z M86 52 L100 66 L86 62 Z', RED, C.ink, 1.4),
    path('M44 52 L76 52 L82 74 L38 74 Z', C.dark, C.ink, 1.6), path('M48 56 L72 56 L76 70 L44 70 Z', '#5a5d68', null),
    path('M40 75 C36 90 50 104 60 112 C70 104 84 90 80 75 Z', HOT, null), path('M48 75 C46 86 54 96 60 102 C66 96 74 86 72 75 Z', '#ffe27a', null), ring(60, 63, 30, 16)),
  'rymdf.dragkraft': all(bg(SKY), rect(4, 104, 112, 8, C.grey, 0, null), rocket(60, 90, 1.05, { flame: true }), arrow(90, 96, 90, 22, HL, 6), greyed(arrow(30, 44, 30, 70, C.dark, 3))),
  'rymdf.nedräkning': all(bg(SKY), pad(46), rocket(46, 101, 1.15), rect(76, 14, 34, 86, C.dark, 4, C.ink, 1.6), num('3', 93, 38, 20, '#7dffb0'), num('2', 93, 62, 17, '#7dffb0'), num('1', 93, 84, 14, '#7dffb0'), arrow(70, 22, 70, 92, HL, 3)),
  'rymdf.raketsteg': all(space(), at(78, 62, 0.85, rocket(0, 0, 1, { flame: true })), rot(40, 84, -25, 1.2, rect(-8, -26, 16, 26, WHITE, 1, C.ink, 1.5), line('M-8 -22 L8 -22', RED, 2), path('M-8 -12 L-16 2 L-8 0 Z M8 -12 L16 2 L8 0 Z', RED, C.ink, 1.3), path('M-6 0 L-4 5 L4 5 L6 0 Z', C.dark, C.ink, 1.2)),
    line('M62 66 L56 74 M70 70 L66 78', C.grey2, 1.4, '2 2'), arrow(30, 98, 22, 108, C.grey2, 2), ring(42, 80, 24, 26)),
  'rymdf.bränsletank': all(bg(SKY), path('M40 18 C40 8 52 2 60 0 C68 2 80 8 80 18 L80 98 L40 98 Z', 'none', C.grey, 1.6),
    rect(44, 24, 32, 30, WHITE, 6, C.ink, 1.5), rect(46, 34, 28, 18, '#9fd2ee', 4, null), rect(44, 58, 32, 36, WHITE, 6, C.ink, 1.5), rect(46, 66, 28, 26, '#f2c14e', 4, null),
    line('M60 54 L60 58', C.ink, 2), greyed(path('M40 84 L28 100 L40 98 Z M80 84 L92 100 L80 98 Z', RED, C.ink, 1.2)), frame(38, 20, 44, 78)),
  'rymdf.nyttolast': all(space(), rect(48, 60, 24, 50, WHITE, 1, C.ink, 1.5), rot(48, 60, -28, 1, path('M0 0 L0 -26 C0 -34 6 -40 12 -42 L12 0 Z', '#e6e8eb', C.ink, 1.4)), rot(72, 60, 28, 1, path('M0 0 L0 -26 C0 -34 -6 -40 -12 -42 L-12 0 Z', '#e6e8eb', C.ink, 1.4)),
    satellite(60, 40, 0.55), ring(60, 40, 22, 14)),

  // ── Omloppsbanor ───────────────────────────────────────────────────
  'rymdf.geostationär': all(space(), ...[[32, 0], [88, 75]].map(([cx, a]) => all(line(`M${cx! - 24} 62 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0`, C.grey2, 1, '3 3'), earth(cx!, 62, 12), rot(cx!, 62, a!, 1, line('M0 -12 L0 -24', HL, 1.6, '2 2'), rect(-2, -15, 4, 4, RED, 0, null), satellite(0, -27, 0.28)))),
    arrow(52, 96, 70, 96, C.grey2, 2), path('M24 84 A12 12 0 0 0 40 84', 'none', WHITE, 1.4), path('M80 84 A12 12 0 0 0 96 84', 'none', WHITE, 1.4)),
  'rymdf.rymdskrot': all(space(), earth(34, 84, 26), rot(76, 30, 30, 0.45, satellite(0, 0, 1)), ...[[60, 56, 20], [92, 60, -30], [100, 24, 50], [52, 22, 10], [80, 80, 70], [104, 88, -10], [40, 46, 40]].map(([x, y, a]) => rot(x!, y!, a!, 1, path('M-4 -2 L3 -4 L5 1 L-1 4 Z', C.grey, C.ink, 1))),
    rot(96, 44, 20, 1, rect(-6, -3, 12, 6, PANEL, 1, C.ink, 1)), rot(66, 92, -40, 1, rect(-4, -8, 8, 16, WHITE, 1, C.ink, 1)), ring(80, 54, 34, 40)),

  // ── Satelliter ─────────────────────────────────────────────────────
  'rymdf.vädersatellit': all(space(), earthArc(96), cloudSwirl(60, 96, 0.9), satellite(60, 28, 0.8), path('M54 40 L36 86 L84 86 L66 40 Z', 'rgba(255,240,170,0.25)', null), ring(60, 92, 26, 12)),
  'rymdf.satellitbild': all(bg(PAPER), satellite(94, 18, 0.35), line('M90 24 L74 36', C.grey, 1.2, '2 2'), rect(14, 34, 92, 68, C.dark, 4, C.ink, 1.6), rect(18, 38, 84, 60, '#7cbf6a', 1, null),
    path('M18 70 C40 64 50 80 70 74 C84 70 92 60 102 62 L102 98 L18 98 Z', SEA, null), line('M30 38 C36 52 44 58 54 72', '#6aa9e0', 3), line('M18 52 L102 46 M60 38 L64 98', '#e6d3b3', 1.6),
    ...[[26, 44], [34, 42], [72, 52], [80, 50], [72, 60], [88, 42]].map(([x, y]) => rect(x!, y!, 5, 4, '#c9534a', 0, null)), frame(12, 32, 96, 72)),
  'rymdf.markstation': all(bg(SKY), stars([[14, 14], [40, 10]]), rect(4, 100, 112, 12, '#8cc96a', 0, null), dishGround(46, 100, 1.5), rect(76, 82, 30, 18, '#e6e8eb', 1, C.ink, 1.3), rect(82, 88, 6, 6, '#9fd2ee', 0, C.ink, 0.8),
    satellite(94, 18, 0.4), waves(64, 54, -40, '#e4572e'), ring(44, 80, 26, 24)),

  // ── Rymdstationer ──────────────────────────────────────────────────
  'rymdf.rymdstation': all(space(), earthArc(100), station(60, 48, 1)),
  'rymdf.rymdkapsel': all(space(), earthArc(104), capsule(60, 74, 1.5), ring(60, 56, 34, 32)),
  'rymdf.docka': all(space(), at(98, 54, 1, rect(-14, -16, 24, 32, '#e3e6ea', 4, C.ink, 1.4), rect(-20, -6, 6, 12, C.grey, 1, C.ink, 1.2), rect(-14, -40, 10, 24, PANEL, 1, C.ink, 1), rect(-14, 16, 10, 24, PANEL, 1, C.ink, 1)),
    rot(46, 54, 90, 1, capsule(0, 18, 1, { window: 'plain' })), line('M66 54 L76 54', '#9fd2ee', 1.4, '2 2'), arrow(24, 82, 56, 82, HL, 3.4)),
  'rymdf.rymddräkt': all(bg(PAPER), rect(4, 106, 112, 6, '#d9cdb8', 0, null), line('M44 14 L44 106 M32 106 L56 106', C.dark, 2.4),
    at(44, 64, 1.9, line('M-7 -14 L-15 -4 M7 -14 L15 -6', C.ink, 7.5), line('M-7 -14 L-15 -4 M7 -14 L15 -6', WHITE, 5.5), circle(-15, -3, 2.6, C.grey, C.ink, 1), circle(15, -5, 2.6, C.grey, C.ink, 1),
      line('M-4 0 L-6 16 M4 0 L6 16', C.ink, 8), line('M-4 0 L-6 16 M4 0 L6 16', WHITE, 6), rect(-8, -16, 16, 18, WHITE, 4, C.ink, 1.4), rect(-4, -10, 8, 5, '#cfd6de', 1, C.ink, 0.8), ellipse(0, -17, 6, 2, C.grey, C.ink, 1)),
    at(94, 92, 1.5, circle(0, 0, 8, WHITE, C.ink, 1.4), path('M-6 -1 C-6 -6 6 -6 6 -1 C6 3 -6 3 -6 -1 Z', GOLD, C.ink, 1), rect(-6, 7, 12, 3, C.grey, 1, C.ink, 1)), ring(60, 66, 50, 44)),
  'rymdf.rymdpromenad': all(space(), earthArc(104), at(30, 40, 0.8, station(0, 0, 0.7)), path('M40 46 C56 56 60 70 74 66', 'none', '#f2c14e', 1.4), astronaut(82, 64, 1.1, 20), ring(82, 60, 18, 24)),
  'rymdf.luftsluss': all(bg(PAPER), rect(4, 20, 38, 80, '#e9f3fa', 0, null), rect(78, 20, 38, 80, SPACE, 0, null), stars([[90, 30], [108, 46], [96, 80], [110, 92]]),
    rect(40, 20, 40, 80, '#dfe4ea', 0, C.ink, 1.6), rect(38, 30, 5, 60, C.dark, 1, C.ink, 1.2), path('M78 30 L94 24 L94 84 L78 90 Z', C.grey, C.ink, 1.2),
    ...[[14, 40], [26, 60], [16, 80], [30, 34]].map(([x, y]) => circle(x!, y!, 2, '#9fd2ee', null)), astronaut(60, 66, 0.9), arrow(66, 100, 100, 100, HL, 3), frame(38, 18, 44, 84)),

  // ── Rymdsonder ─────────────────────────────────────────────────────
  'rymdf.rymdsond': all(space(), earth(16, 96, 7), at(96, 28, 1, path('M-22 0 A22 6 0 0 1 22 0', 'none', '#d9c48f', 3), circle(0, 0, 11, '#e7d39c', C.ink, 1.3), path('M-22 0 A22 6 0 0 0 22 0', 'none', '#d9c48f', 3)),
    probe(56, 62, 1.6), waves(34, 80, 140), ring(56, 58, 30, 28)),
  'rymdf.landare': all(bg('#e9b48f'), marsGround(84), lander(60, 96, 1.6), ...[[20, 102, 4], [100, 98, 3], [86, 106, 2.4]].map(([x, y, r]) => ellipse(x!, y!, r!, r! * 0.6, MARS2, C.ink, 1)), ring(60, 70, 36, 32)),
  'rymdf.förbiflygning': all(space(), circle(54, 66, 22, MARS, C.ink, 1.4), ellipse(48, 60, 6, 3, MARS2, null), line('M10 16 C40 30 86 34 96 58 C104 78 92 98 110 104', '#f2c14e', 1.6, '4 3'), arrow(104, 96, 112, 106, '#f2c14e', 2),
    probe(88, 42, 0.8), ring(88, 40, 16)),
  'rymdf.obemannad': all(space(), capsule(56, 92, 2.2, { window: 'empty' }), ring(56, 61, 18), greyed(capsule(100, 46, 0.7, { window: 'face' }))),

  // ── Månlandningar ──────────────────────────────────────────────────
  'rymdf.månlandning': all(space(), earth(96, 24, 10), moonGround(86), lander(48, 100, 1.4), astronaut(88, 84, 0.7), arrow(26, 20, 40, 52, HL, 3)),
  'rymdf.månbil': all(space(), earth(20, 22, 8), moonGround(84), line('M10 104 L40 104 M14 108 L44 108', MOON2, 1.2),
    at(68, 98, 1, rect(-30, -14, 60, 6, C.grey, 1, C.ink, 1.3), line('M-10 -14 L-12 -26 M14 -14 L22 -30', C.ink, 1.4), path('M18 -32 Q22 -26 28 -32 Z', WHITE, C.ink, 1),
      ...[-22, 22].map((x) => all(circle(x, -2, 8, '#5a5d68', C.ink, 1.4), circle(x, -2, 3, C.grey, C.ink, 1))), rect(-20, -20, 10, 6, C.dark, 1, C.ink, 1)), astronaut(64, 72, 0.7), ring(68, 84, 40, 26)),
  'rymdf.fotavtryck': all(bg(MOON), circle(20, 24, 4, MOON2, null), circle(96, 90, 6, MOON2, null), circle(100, 22, 3, MOON2, null),
    at(52, 64, 1, path('M-14 -30 C-14 -40 14 -40 14 -30 L12 28 C12 36 -12 36 -12 28 Z', '#a2a29c', C.ink, 1.4), ...range(8).map((i) => line(`M-11 ${-28 + i * 7} L11 ${-28 + i * 7}`, '#878780', 2.2))), ring(52, 64, 22, 38), greyed(boot(96, 60, 1))),
  'rymdf.värmesköld': all(bg(SKY), capsule(56, 70, 2), path('M18 70 Q56 86 94 70', 'none', HOT, 3), line('M30 96 L34 86 M56 100 L56 90 M82 96 L78 86', HOT, 2), ring(56, 74, 42, 12)),
  'rymdf.återinträde': all(space(), earthArc(102, true), line('M18 14 L54 52', C.grey2, 1.2, '3 3'), path('M50 46 C40 30 30 26 22 22 C34 38 40 48 56 60 Z', 'rgba(255,138,42,0.55)', null),
    rot(64, 66, -45, 0.8, capsule(0, 0, 1, { shield: HOT })), arrow(80, 74, 96, 92, HL, 3)),
  'rymdf.plaska-ner': all(bg(SKY), sea(92), parachute(40, 22, 1.2), parachute(60, 16, 1.2), parachute(80, 22, 1.2), line('M30 22 L56 76 M50 16 L58 76 M70 16 L62 76 M90 22 L64 76', C.ink, 0.8),
    capsule(60, 92, 1), path('M38 92 C36 82 42 80 44 88 M82 92 C84 82 78 80 76 88 M46 90 C44 80 50 78 50 86', 'none', WHITE, 2.2), ring(60, 84, 30, 16)),

  // ── Framtida rymdmissioner ─────────────────────────────────────────
  'rymdf.bemannad': all(space(), capsule(56, 92, 2.2, { window: 'face' }), ring(56, 61, 18), greyed(capsule(100, 46, 0.7, { window: 'empty' }))),
  'rymdf.rymdturist': all(bg('#e3e6ea'), rect(48, 14, 62, 62, SPACE, 30, C.ink, 2.2), stars([[60, 24], [96, 22], [102, 40]]), at(78, 58, 1, earth(0, 0, 14)),
    g('translate(26 4) rotate(-10)', figure({ x: 0, top: C.orange, bottom: C.denim, h: 0.8 })), rect(36, 46, 10, 7, C.dark, 1, C.ink, 1), circle(41, 49.5, 2, '#9fd2ee', null), ring(24, 64, 20, 42)),
  'rymdf.månbas': all(space(), earth(96, 22, 10), moonGround(80), dome(36, 92, 16), dome(66, 94, 12), rect(48, 88, 8, 6, '#e3e6ea', 1, C.ink, 1),
    ...[84, 100].map((x) => all(line(`M${x} 100 L${x} 88`, C.ink, 1.2), rect(x - 7, 78, 14, 10, PANEL, 1, C.ink, 1))), astronaut(20, 96, 0.4), frame(14, 68, 98, 36)),
  'rymdf.återanvändbar': all(bg(SKY), rect(4, 104, 112, 8, C.grey, 0, null), rocket(36, 72, 0.8, { flame: true }), arrow(36, 30, 36, 8, C.grey, 2), rocket(84, 98, 0.8, { flame: true }), arrow(84, 18, 84, 34, C.grey, 2),
    path('M48 14 C60 2 72 2 78 12', 'none', HL, 3), path('M74 104 C64 114 50 114 44 100', 'none', HL, 3), path('M78 12 L80 4 L72 8 Z M44 100 L40 108 L48 104 Z', HL, HL, 1)),
};
