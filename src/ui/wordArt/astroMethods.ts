/**
 * Matematik & naturvetenskap → Astronomi & rymd → Astronomins metoder, 3661–3667 (0.53): telescopes, observatories,
 * spectroscopy, radio telescopes, measuring distances, space telescopes, observation and hypothesis testing.
 * Recurring signs: space is a dark blue night with small white dots; light from a star is drawn as thin yellow rays;
 * the part the word names is ringed or framed in orange, and grey copies show what the word is not.
 * Close words share one layout where only the marked part differs: linsteleskop/spegelteleskop (the same telescope
 * tube on a tripod, cut open so the light inside shows: a lens at the front, or a curved mirror at the back);
 * kontrollrum/fjärrstyra (a room full of screens, or one person at home steering a far-away dome along a dashed signal);
 * radioteleskop/parabolantenn (a huge dish in a field with a tiny person, or a small dish on a house wall).
 * Digits and maths signs only; no words, no brands and no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm, globe } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';
import { handPalm } from './limbs';

// ── Palette and basics ───────────────────────────────────────────────
const NIGHT = '#1f2740';
const SOFT = '#f4f6f8';
const YEL = '#ffd34d';
const RAY = '#f2c14e';
const ORANGE = '#f29a3a';
const RED = '#e2553a';
const WHITE = '#fbfbf8';
const GLASS = '#bfe3f5';
const TUBE = 'rgba(150,170,200,0.28)';
const METAL = '#c0c6cc';
const GRASS = '#5f8f4e';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = NIGHT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
/** Arrowhead with its tip at (x, y), pointing along angle a (radians). */
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
/** Light ray as a polyline with an arrowhead at the end. */
const ray = (pts: [number, number][], col: string = RAY, sw = 1.6) => {
  const [a, b] = [pts[pts.length - 2]!, pts[pts.length - 1]!];
  return all(line(pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '), col, sw), head(b[0], b[1], Math.atan2(b[1] - a[1], b[0] - a[0]), col, 0.6));
};

/** Fixed field of small white dots (background stars), kept away from a free area. */
const DOTS: [number, number, number][] = [[12, 12, 1], [30, 9, 0.8], [52, 14, 1.1], [77, 8, 0.8], [98, 13, 1], [108, 30, 0.8], [9, 34, 0.9], [20, 52, 0.7], [106, 52, 1], [12, 78, 0.8], [104, 84, 0.9], [30, 102, 0.8], [58, 106, 1], [86, 103, 0.8], [110, 104, 0.7], [40, 30, 0.6], [86, 28, 0.7], [70, 96, 0.6], [16, 92, 0.6], [96, 66, 0.6]];
const dots = (keep: (x: number, y: number) => boolean = () => true) => all(...DOTS.filter(([x, y]) => keep(x, y)).map(([x, y, r]) => circle(x, y, r, WHITE, null)));
const sky = (keep?: (x: number, y: number) => boolean) => all(bg(), dots(keep));
/** A star or sun: a ball with a soft glow. */
const ball = (x: number, y: number, r: number, col: string, glow: string | null = col) => all(glow ? `<circle cx="${x}" cy="${y}" r="${f1(r + Math.min(r * 0.45, 7))}" fill="${glow}" opacity="0.25"/>` : '', circle(x, y, r, col, C.ink, 1.2));
const moon = (x: number, y: number, r = 9) => all(circle(x, y, r, '#f5e7b0', C.ink, 1.2), circle(x - r * 0.3, y - r * 0.2, r * 0.22, '#e2d290', null), circle(x + r * 0.35, y + r * 0.3, r * 0.16, '#e2d290', null));

/** Shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });

// ── Telescope tube on a tripod (linsteleskop / spegelteleskop) ───────
const tripod = (x: number, y: number, s = 1, col: string = C.dark) => line(`M${x} ${y} L${f1(x - 18 * s)} ${f1(y + 44 * s)} M${x} ${y} L${x} ${f1(y + 46 * s)} M${x} ${y} L${f1(x + 18 * s)} ${f1(y + 44 * s)}`, col, 2.4);
/** Side view of a telescope cut open: tube from x=22 to x=100 at y 40–64. */
const tubeBase = () => all(bg(SOFT), line('M4 112 L116 112', C.grey2, 2), tripod(62, 66), rect(56, 62, 12, 6, C.dark, 1, C.ink, 1.2), rect(22, 40, 78, 24, TUBE, 2, C.ink, 1.8), ball(6, 52, 0, YEL, null));
const linsTube = () => all(tubeBase(),
  // light from the left goes through the big front lens and meets at the eyepiece
  ...[44, 52, 60].map((y) => ray([[6, y], [24, y], [96, 52]])),
  ellipse(24, 52, 4.2, 14, GLASS, C.ink, 1.6),
  rect(100, 48, 9, 8, C.dark, 1.5, C.ink, 1.2), ellipse(109, 52, 1.6, 4, GLASS, C.ink, 1),
  oval(24, 52, 10, 20));
const spegelTube = () => all(tubeBase(),
  // light from the left goes to the curved mirror at the back, back to a small flat mirror and up to the eyepiece
  ...[45, 59].map((y) => ray([[6, y], [92, y], [42, 52], [42, 34]])),
  path('M94 41 Q88 52 94 63 L98 63 L98 41 Z', METAL, C.ink, 1.6),
  line('M38 48 L46 56', C.ink, 3), line('M38 48 L46 56', METAL, 1.6),
  rect(38, 30, 8, 10, C.dark, 1.5, C.ink, 1.2), ellipse(42, 29, 4, 1.4, GLASS, C.ink, 1),
  oval(94, 52, 10, 20));

// ── Screens and rooms ───────────────────────────────────────────────
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, '#1b2238', 2, C.ink, 1.6), inner, line(`M${f1(x + w / 2)} ${y + h} L${f1(x + w / 2)} ${y + h + 4}`, C.dark, 2));
const starScreen = (x: number, y: number, w: number, h: number) => screen(x, y, w, h, all(...range(5).map((i) => circle(f1(x + 3 + ((i * 7) % (w - 6))), f1(y + 3 + ((i * 5) % (h - 6))), 0.9, WHITE, null)), circle(f1(x + w * 0.6), f1(y + h * 0.45), 2.2, YEL, null)));
const graphScreen = (x: number, y: number, w: number, h: number) => screen(x, y, w, h, line(range(9).map((i) => `${i ? 'L' : 'M'}${f1(x + 2 + i * (w - 4) / 8)} ${f1(y + h - 4 - ((i * 3) % 5) * (h - 8) / 5)}`).join(' '), '#9fe0a0', 1.2));
/** Observatory dome on a small building. */
const dome = (x: number, y: number, s = 1, open = true) => at(x, y, s, rect(-14, 0, 28, 16, '#e6e9ee', 1, C.ink, 1.6), path('M-16 0 A16 16 0 0 1 16 0 Z', WHITE, C.ink, 1.6), open ? path('M-3 -15.6 L3 -15.6 L3 0 L-3 0 Z', '#1b2238', null) : '', open ? line('M0 -4 L6 -14', C.dark, 3) : '');
const laptop = (x: number, y: number, inner: Svg = '') => all(path(`M${x - 13} ${y} L${x + 13} ${y} L${x + 16} ${y + 4} L${x - 16} ${y + 4} Z`, C.grey, C.ink, 1.2), rect(x - 11, y - 16, 22, 15, '#1b2238', 1.5, C.ink, 1.2), inner);
/** Radio waves: a wavy line from (x1,y1) to (x2,y2). */
const wave = (x1: number, y1: number, x2: number, y2: number, col: string = '#9fd2ee', n = 6, amp = 3, sw = 1.8) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const pts = range(n * 8 + 1).map((i) => { const t = i / (n * 8), w = Math.sin(t * n * Math.PI * 2) * amp; return `${i ? 'L' : 'M'}${f1(x1 + dx * t - uy * w)} ${f1(y1 + dy * t + ux * w)}`; });
  return all(line(pts.join(' '), col, sw), head(x2, y2, Math.atan2(dy, dx), col, 0.7));
};
/** Big radio dish seen from the side, opening up and to the left; (x, y) = base on the ground, s = scale. */
const dish = (x: number, y: number, s = 1, col: string = WHITE) => at(x, y, s,
  path('M-6 0 L-3 -26 L3 -26 L6 0 Z', '#d9dde3', C.ink, 1.4),
  path('M-30 -58 Q-26 -24 14 -20 L10 -24 Q-22 -28 -26 -58 Z', '#b9c0c8', C.ink, 1.2),
  path('M-30 -58 Q-26 -24 14 -20 Q-4 -50 -30 -58 Z', col, C.ink, 1.6),
  line('M-28 -56 L-14 -48 M12 -22 L-14 -48', C.dark, 1.2), circle(-14, -48, 2.4, C.dark, null),
  line('M0 -26 L-2 -32', C.dark, 2));

// ── Faces (blunda) ──────────────────────────────────────────────────
const face = (x: number, y: number, closed: boolean, col: string = C.skin, hair: string = C.hair) => all(
  circle(x, y, 22, col, C.ink, 2), path(`M${x - 22} ${y - 4} C${x - 22} ${y - 30} ${x + 22} ${y - 30} ${x + 22} ${y - 4} C${x + 14} ${y - 16} ${x - 14} ${y - 16} ${x - 22} ${y - 4} Z`, hair, C.ink, 1.6),
  closed ? path(`M${x - 13} ${y + 1} Q${x - 8} ${y + 6} ${x - 3} ${y + 1} M${x + 3} ${y + 1} Q${x + 8} ${y + 6} ${x + 13} ${y + 1}`, 'none', C.ink, 1.8)
    : all(ellipse(x - 8, y + 1, 4, 3.2, WHITE, C.ink, 1.2), ellipse(x + 8, y + 1, 4, 3.2, WHITE, C.ink, 1.2), circle(x - 8, y + 1, 1.8, C.ink, null), circle(x + 8, y + 1, 1.8, C.ink, null)),
  path(`M${x - 5} ${y + 12} Q${x} ${y + 15} ${x + 5} ${y + 12}`, 'none', C.ink, 1.4));

// ── Space telescopes ────────────────────────────────────────────────
/** A Hubble-like space telescope: a silver tube with an open lid and two solar wings. */
const spaceScope = (x: number, y: number, s = 1, rot = -20) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-24, -18, 8, 36, '#3f5fa8', 1, C.ink, 1.2), line('M-24 -6 L-16 -6 M-24 6 L-16 6', '#8fb0e8', 0.8),
  rect(16, -18, 8, 36, '#3f5fa8', 1, C.ink, 1.2), line('M16 -6 L24 -6 M16 6 L24 6', '#8fb0e8', 0.8),
  line('M-16 0 L-10 0 M10 0 L16 0', C.dark, 1.6),
  rect(-10, -26, 20, 44, METAL, 3, C.ink, 1.6), rect(-10, -26, 20, 6, '#9aa3ad', 2, C.ink, 1.2),
  path('M-10 -26 L-18 -34 L-16 -36 L-8 -28 Z', '#d9dde3', C.ink, 1), rect(-10, 10, 20, 8, '#d9b45a', 1, C.ink, 1.2));
/** Hexagon (one mirror segment). */
const hex = (x: number, y: number, r: number, col: string) => path(range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' ') + ' Z', col, C.ink, 0.8);
const goldMirror = (x: number, y: number, r = 5) => all(hex(x, y, r, '#e8b84a'), ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return hex(f1(x + Math.cos(a) * r * 1.74), f1(y + Math.sin(a) * r * 1.74), r, '#e8b84a'); }));

export const ASTROMET_MOTIFS: Record<string, Svg> = {
  // ── 3661 Teleskop ────────────────────────────────────────────────────
  /** linsteleskop: a telescope tube on a tripod, drawn cut open: yellow light rays from the left pass through a big glass lens at the front and meet at the small eyepiece at the back; the front lens is ringed. */
  'astmet.linsteleskop': linsTube(),
  /** spegelteleskop: the same telescope tube, open at the front: the light rays go all the way to a curved silver mirror at the back, bounce to a small flat mirror and go up to an eyepiece on top; the back mirror is ringed. */
  'astmet.spegelteleskop': spegelTube(),
  /** rikta: at night a person turns a telescope on a tripod: a grey copy shows where it pointed before, a curved orange arrow shows the turn, and a dashed orange line goes from the telescope straight to the moon. */
  'astmet.rikta': all(sky((x, y) => y < 70 && Math.hypot(x - 96, y - 20) > 14), rect(4, 100, 112, 12, '#2c3a2c', 0, null), moon(96, 20, 9),
    tripod(62, 70, 0.68), greyed(g('rotate(-100 62 66)', rect(54, 62, 30, 8, METAL, 2, C.ink, 1.2))),
    g('rotate(-40 62 66)', rect(50, 61, 34, 10, METAL, 2, C.ink, 1.4), rect(84, 60, 3, 12, C.dark, 1, null), rect(46, 63, 4, 6, C.dark, 1, null)),
    line('M86 46 L91 30', HL, 2, '3 3'), path('M40 50 Q50 36 62 40', 'none', HL, 2.4), head(63, 40, 0.1, HL, 0.9),
    person(28, C.green, { h: 0.78 }), reach(28, 0.78, 1, 50, 72)),
  /** amatörastronom: at night in a garden next to a house with a lit window, a person in a cardigan bends to look into a small telescope on a tripod; a mug stands on a garden table; stars and the moon above. */
  'astmet.amatörastronom': all(sky((x, y) => y < 60 && !(x > 76 && y > 30)), moon(20, 20, 7), rect(4, 96, 112, 16, GRASS, 0, null),
    path('M80 96 L80 54 L98 40 L116 54 L116 96 Z', '#b8664a', C.ink, 1.4), path('M78 55 L98 38 L118 55', 'none', '#6e3b2c', 3), rect(88, 64, 14, 12, '#ffe08a', 1, C.ink, 1.2), line('M95 64 L95 76 M88 70 L102 70', C.ink, 1),
    tripod(54, 50, 1), g('rotate(-30 54 48)', rect(40, 44, 28, 8, WHITE, 2, C.ink, 1.3), rect(37, 45.5, 3, 5, C.dark, 1, null)),
    person(30, '#c0623a', { h: 0.72 }), reach(30, 0.72, 1, 48, 56),
    rect(60, 88, 14, 3, C.tan, 1, C.ink, 1), line('M62 91 L62 98 M72 91 L72 98', C.brown, 1.6), rect(64, 82, 5, 6, WHITE, 1, C.ink, 1)),

  // ── 3662 Observatorier ───────────────────────────────────────────────
  /** kontrollrum: a room seen from the side with a long desk and a wall of six dark screens with stars and graphs; two people sit at the desk in front of the screens; the wall of screens is framed. */
  'astmet.kontrollrum': all(bg('#dfe3e8'), rect(4, 96, 112, 16, '#b9c0c8', 0, null),
    starScreen(10, 20, 30, 20), graphScreen(45, 20, 30, 20), starScreen(80, 20, 30, 20), graphScreen(10, 48, 30, 20), starScreen(45, 48, 30, 20), graphScreen(80, 48, 30, 20),
    frame(7, 17, 106, 56),
    rect(8, 80, 104, 6, C.tan, 2, C.ink, 1.6), line('M14 86 L14 110 M106 86 L106 110', C.brown, 3),
    laptop(36, 76), laptop(86, 76),
    circle(36, 92, 7, C.skin, C.ink, 1.4), path('M29 90 C29 82 43 82 43 90 Z', C.hair, null), path('M26 112 L28 100 L44 100 L46 112 Z', C.denim, C.ink, 1.4),
    circle(86, 92, 7, C.skin, C.ink, 1.4), path('M79 92 C79 80 93 80 93 92 C90 86 82 86 79 92 Z', '#8a5a2e', null), path('M76 112 L78 100 L94 100 L96 112 Z', C.orange, C.ink, 1.4)),
  /** fjärrstyra: on the left a person at home at a small table with a laptop that shows a telescope; on the right, far away on a mountain under the stars, an observatory dome with its slit open; a long dashed orange line with an arrow goes from the laptop to the dome. */
  'astmet.fjärrstyra': all(bg('#2a3352'), dots((x, y) => x > 56 && y < 40), path('M56 112 L84 54 L94 64 L116 40 L116 112 Z', '#56607a', C.ink, 1.2), dome(96, 38, 0.8),
    rect(4, 56, 52, 56, '#f3ead6', 2, C.ink, 1.6), rect(10, 62, 16, 14, '#3a4a7a', 1, C.ink, 1), circle(20, 67, 1, WHITE, null),
    rect(14, 92, 38, 4, C.tan, 1, C.ink, 1.2), line('M18 96 L18 110 M48 96 L48 110', C.brown, 2),
    laptop(40, 88, g('rotate(-35 40 80)', rect(34, 78, 12, 4, METAL, 1, null))),
    circle(20, 78, 6, C.skin, C.ink, 1.2), path('M14 78 C14 70 26 70 26 78 C23 74 17 74 14 78 Z', C.hair, null), path('M12 110 L13 86 L27 86 L28 110 Z', C.green, C.ink, 1.2), line('M26 90 L32 91', C.skin, 3),
    path('M44 70 Q60 30 88 26', 'none', HL, 2.4, ), `<path d="M44 70 Q60 30 88 26" fill="none" stroke="#2a3352" stroke-width="2.6" stroke-dasharray="3 4"/>`, head(89, 26, -0.15, HL, 0.9)),

  // ── 3663 Spektroskopi ────────────────────────────────────────────────
  /** spektroskopi: starlight goes into a glass prism and comes out as a rainbow band with thin black lines; below, the same black-line pattern stands next to a small atom, with an equals sign between them; the band and the pattern are framed. */
  'astmet.spektroskopi': all(sky((x, y) => y > 70 || x < 30), ball(14, 32, 7, YEL, '#ffe08a'),
    line('M22 32 L36 32', RAY, 2.4), path('M36 46 L46 18 L56 46 Z', 'rgba(200,230,255,0.75)', C.ink, 1.4),
    ...['#e2553a', '#f29a3a', '#ffd34d', '#5fbf6a', '#4f8fe0', '#8a6bbf'].map((col, i) => all(line(`M50 ${30 + i * 1.2} L64 ${22 + i * 4.4}`, col, 1.4), rect(64 + i * 8, 22, 8, 26, col, 0, null))),
    ...[69, 78, 83, 99, 104].map((x) => line(`M${x} 22 L${x} 48`, '#111111', 1.4)), rect(64, 22, 48, 26, 'none', 0, C.ink, 1),
    rect(64, 70, 48, 14, WHITE, 0, C.ink, 1), ...[69, 78, 83, 99, 104].map((x) => line(`M${x} 70 L${x} 84`, '#111111', 1.4)),
    path('M44 74 L56 74 M44 80 L56 80', 'none', WHITE, 2.2),
    circle(22, 77, 3, RED, null), ellipse(22, 77, 14, 5, 'none', WHITE, 1.2), ellipse(22, 77, 5, 14, 'none', WHITE, 1.2), circle(36, 77, 1.6, '#9fd2ee', null), circle(22, 63, 1.6, '#9fd2ee', null),
    frame(61, 19, 54, 32), frame(61, 67, 54, 20)),

  // ── 3664 Radioteleskop ───────────────────────────────────────────────
  /** radioteleskop: in a field at dusk a huge white dish on a tall foot opens towards the sky; wavy radio waves come down to it from a star; a tiny person stands next to the foot for size. */
  'astmet.radioteleskop': all(sky((x, y) => y < 50 && x > 60), rect(4, 96, 112, 16, '#4f6b45', 0, null), ball(100, 16, 4, WHITE, '#cfe6ff'),
    dish(64, 98, 1.2), wave(96, 20, 54, 40, '#9fd2ee', 5, 2.6), wave(104, 30, 62, 50, '#9fd2ee', 5, 2.6),
    person(96, C.orange, { h: 0.16 }), ring(52, 54, 40)),
  /** parabolantenn: daytime: the wall of a block of flats with windows and a balcony; a small grey dish hangs on the balcony railing and points at the sky; the small dish is ringed. */
  'astmet.parabolantenn': all(bg('#cfe6f5'), rect(14, 14, 92, 98, '#e8d3b0', 0, C.ink, 1.6),
    ...[[24, 24], [64, 24], [24, 60]].map(([x, y]) => rect(x!, y!, 28, 22, '#9fc6e0', 1, C.ink, 1.4)), rect(64, 56, 28, 30, '#6f8fae', 1, C.ink, 1.4),
    rect(58, 84, 40, 4, C.grey, 0, C.ink, 1.2), ...range(7).map((i) => line(`M${60 + i * 6} 88 L${60 + i * 6} 100`, C.grey, 1.4)), rect(58, 100, 40, 3, C.grey, 0, C.ink, 1.2),
    at(78, 76, 0.42, path('M-30 -58 Q-26 -24 14 -20 Q-4 -50 -30 -58 Z', '#dfe3e8', C.ink, 3), line('M-28 -56 L-14 -48 M12 -22 L-14 -48', C.dark, 2.4), circle(-14, -48, 4, C.dark, null), line('M-6 -40 L0 0', C.dark, 4)),
    ring(74, 64, 15), line('M4 112 L116 112', C.grey2, 2)),
  /** utomjordisk: on a strange purple planet with a ringed planet and two moons in its sky, a small green creature with three eyes and two feelers waves next to a round flying saucer; far away a tiny grey Earth. */
  'astmet.utomjordisk': all(sky(), greyed(globe(16, 16, 7)), circle(90, 22, 9, '#e0b88a', C.ink, 1.1), ellipse(90, 22, 16, 4, 'none', '#f0d8a8', 1.6), circle(64, 14, 3, '#cfe6ff', null), circle(110, 46, 2.4, '#ffd0e0', null),
    path('M4 112 L4 88 C30 80 90 80 116 88 L116 112 Z', '#8a6bbf', C.ink, 1.4), circle(26, 96, 4, '#6f52a0', null), circle(100, 100, 5, '#6f52a0', null),
    ellipse(86, 74, 22, 6, METAL, C.ink, 1.4), path('M74 72 C74 60 98 60 98 72 Z', 'rgba(190,230,255,0.8)', C.ink, 1.2), line('M76 80 L72 88 M96 80 L100 88', C.dark, 1.6),
    path('M38 98 L36 78 C36 66 56 66 56 78 L54 98 Z', '#7ccf6a', C.ink, 1.4), circle(46, 62, 11, '#7ccf6a', C.ink, 1.4),
    ...[40, 46, 52].map((x) => all(circle(x, 60, 2.6, WHITE, C.ink, 0.8), circle(x, 60, 1.2, C.ink, null))), path('M42 67 Q46 70 50 67', 'none', C.ink, 1.2),
    line('M41 52 L36 42 M51 52 L56 42', C.ink, 1.4), circle(36, 41, 2, '#ffd34d', C.ink, 0.8), circle(56, 41, 2, '#ffd34d', C.ink, 0.8),
    line('M55 76 L64 66', '#7ccf6a', 4), circle(65, 65, 2.6, '#7ccf6a', C.ink, 1), line('M37 76 L30 86', '#7ccf6a', 4), oval(46, 72, 16, 34)),

  // ── 3665 Mätning av avstånd ──────────────────────────────────────────
  /** astronomisk enhet: the sun on the left, then a long ruler line with marks 1 to 5 to the right; the Earth sits at mark 1, a red planet at 1.5 and a big striped planet at 5; the stretch from the sun to the Earth is drawn as an orange bracket with the digit 1. */
  'astmet.astronomisk-enhet': all(sky((_x, y) => y < 40 || y > 90), ball(12, 64, 9, YEL, '#ffe08a'), line('M12 64 L114 64', 'rgba(255,255,255,0.6)', 1.2),
    ...range(6).map((i) => line(`M${12 + i * 20} 60 L${12 + i * 20} 68`, WHITE, 1.4)), circle(32, 64, 4, '#7fb8e0', C.ink, 1), circle(42, 64, 3, RED, C.ink, 1),
    circle(112, 64, 6, '#e0b88a', C.ink, 1), line('M107 62 L117 62 M107 66 L117 66', '#b98a5a', 1),
    path('M12 54 L12 48 L32 48 L32 54', 'none', HL, 2.6), `<text x="22" y="44" font-family="system-ui,sans-serif" font-weight="800" font-size="12" fill="${HL}" text-anchor="middle">1</text>`,
    ...[[52, 2], [72, 3], [92, 4], [112, 5]].map(([x, n]) => `<text x="${x}" y="82" font-family="system-ui,sans-serif" font-weight="700" font-size="9" fill="${WHITE}" text-anchor="middle">${n}</text>`)),
  /** tumme: an open hand seen from the palm side; the thumb is coloured orange and an orange arrow points at it. */
  'astmet.tumme': all(bg(SOFT), handPalm(['tumme'], [14, 34])),
  /** blunda: two faces side by side: on the left a grey face with open eyes, on the right a coloured, calm face with both eyes closed (curved lines); the closed eyes are ringed. */
  'astmet.blunda': all(bg(SOFT), greyed(face(32, 62, false)), face(88, 62, true), oval(88, 64, 19, 9)),
  /** parallax: the sun in the middle at the bottom with the Earth's orbit; the Earth at its left and right ends; lines from both Earths go up to a near star and make a tall thin triangle; behind, along the top, the near star is shown twice in grey against a row of far stars, with an orange double arrow between the two copies; the small angle at the star is marked. */
  'astmet.parallax': all(sky((_x, y) => y > 30 && y < 86), ...[[14, 10], [36, 14], [84, 12], [106, 9]].map(([x, y]) => circle(x!, y!, 1.3, WHITE, null)),
    ellipse(60, 98, 34, 8, 'none', 'rgba(255,255,255,0.55)', 1.2), ball(60, 98, 5, YEL, '#ffe08a'), circle(26, 98, 4, '#7fb8e0', C.ink, 1), circle(94, 98, 4, '#7fb8e0', C.ink, 1),
    line('M26 98 L60 46 L94 98', 'rgba(255,255,255,0.75)', 1.2, '3 2'), line('M60 46 L46 12 M60 46 L74 12', 'rgba(255,255,255,0.4)', 1, '2 3'),
    ball(60, 46, 3.5, '#cfe6ff', '#cfe6ff'), greyed(circle(46, 12, 3, WHITE, null), circle(74, 12, 3, WHITE, null)),
    line('M50 20 L70 20', HL, 2.2), head(48, 20, Math.PI, HL, 0.8), head(72, 20, 0, HL, 0.8),
    path('M55.4 53 A8 8 0 0 0 64.6 53', 'none', HL, 2.4)),

  // ── 3666 Rymdteleskop ────────────────────────────────────────────────
  /** rymdteleskop: the curved Earth at the bottom with a blue air layer and white clouds; high above, in black space among the stars, a silver telescope with two blue solar wings floats; a small grey telescope stands on the ground under the clouds; the space telescope is ringed. */
  'astmet.rymdteleskop': all(sky((_x, y) => y < 72), path('M4 112 L4 92 C30 76 90 76 116 92 L116 112 Z', '#4f7fb5', C.ink, 1.4), path('M4 92 C30 76 90 76 116 92 L116 84 C90 68 30 68 4 84 Z', 'rgba(140,200,255,0.4)', null),
    ...[[22, 84], [58, 76], [94, 82]].map(([x, y]) => all(ellipse(x!, y!, 10, 3.2, WHITE, null), ellipse(x! + 5, y! - 2, 6, 2.6, WHITE, null))),
    greyed(g('translate(70 100)', line('M0 0 L-4 10 M0 0 L4 10', C.dark, 1.4), g('rotate(-50)', rect(-2, -3, 12, 5, METAL, 1, C.ink, 1)))),
    spaceScope(58, 36, 0.9, -20), ring(58, 36, 30)),
  /** veckla ut: on the left a small folded bundle (a zigzag of folded paper), an orange arrow, and on the right the same paper opened out big and flat with dashed fold lines; the opened sheet is ringed. */
  'astmet.veckla-ut': all(bg(SOFT), path('M10 54 L28 50 L30 70 L12 74 Z', '#f3ead6', C.ink, 1.4), path('M12 74 L30 70 L32 76 L14 80 Z', '#e2d6bc', C.ink, 1.2), path('M14 80 L32 76 L34 82 L16 86 Z', '#f3ead6', C.ink, 1.2),
    arr(40, 68, 54, 68, HL, 3),
    path('M62 32 L108 29 L110 98 L64 101 Z', '#f3ead6', C.ink, 1.6), line('M85 31 L87 100 M63 55 L109 52 M64 77 L110 74', '#b8a888', 1.2, '3 3'),
    path('M70 44 C76 40 80 48 78 60 M92 66 C98 60 104 70 100 86', 'none', '#8fbf7a', 2.4), circle(98, 40, 4, '#9fc6e0', null), frame(58, 25, 56, 80)),
  /** solsköld: in space the sun on the left sends hot rays to a huge, flat, layered silver-and-pink sheet like a kite; behind the sheet, on the dark cold side, a gold mirror made of hexagons and a snowflake; the sheet is ringed. */
  'astmet.solsköld': all(sky(), ball(12, 60, 9, YEL, '#ffe08a'), ...[44, 56, 68, 80].map((y) => arr(24, y, 38, y, ORANGE, 1.8)),
    ...range(5).map((i) => path(`M${44 + i * 2.2} 60 L${60 + i * 2.2} ${22 + i * 1.5} L${70 + i * 2.2} 60 L${60 + i * 2.2} ${98 - i * 1.5} Z`, i % 2 ? '#e8c6d6' : '#d9dde3', C.ink, 0.9)),
    line('M64 60 L84 60', C.dark, 2), goldMirror(94, 52, 4.2), line('M94 62 L94 70', C.dark, 1.6),
    g('translate(100 92)', line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#cfe6ff', 1.6)), oval(58, 60, 18, 42)),
  /** exoplanet: a big orange-red star (not our sun) with a small dark planet passing in front of it; below, a white light graph that dips while the planet passes; in the corner a tiny grey sun and Earth; the planet is ringed. */
  'astmet.exoplanet': all(sky((x, y) => y > 76 || x < 30), ball(62, 40, 24, ORANGE, '#ffb36b'), line('M30 46 L96 34', 'rgba(255,255,255,0.35)', 1, '2 3'), circle(72, 38, 5, '#2b2a33', '#8a6bbf', 1.2), ring(72, 38, 9),
    line('M14 86 L44 86 L52 96 L72 96 L80 86 L110 86', WHITE, 1.8), line('M14 104 L110 104', 'rgba(255,255,255,0.4)', 1),
    greyed(ball(14, 18, 4, YEL, null), circle(24, 18, 1.8, '#7fb8e0', null), ellipse(14, 18, 10, 3, 'none', WHITE, 0.8))),
};
