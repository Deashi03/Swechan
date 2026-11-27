/**
 * Kultur & fritid → Bildkonst & design → Fotografi, 4541–4547 (0.63): camera parts, aperture and shutter speed,
 * depth of field, framing, lighting, photo editing, photographic genres. (stilleben and posera are drawn by T02.)
 * Recurring signs: a camera is a dark body with a round blue lens; a photo is a white-bordered frame; the part or
 * the property that the word names is orange or ringed in orange, and grey shows what the word is not.
 * Blur is drawn as faint, shifted copies of a shape (no filters). Abstract photo terms are contrast pairs:
 * sharp/blurred (skärpa), deep/shallow sharp zone (skärpedjup), too light/too dark (över-/underexponerad),
 * pale/strong colours (mättnad). The three shot sizes share one person in a frame: only the face (närbild),
 * head to feet (helbild) or tiny in a wide square (översiktsbild).
 * No letters, no brands; a dial carries only tick marks.
 */
import { C, all, arrow, circle, ellipse, g, hand, line, moving, path, rect, sparkle, waGrow, waIn, waPulse, type Svg } from './kit';
import { HL } from './people';

// ── Basics ───────────────────────────────────────────────────────────
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (deg: number, x: number, y: number, ...k: Svg[]) => g(`rotate(${deg} ${x} ${y})`, ...k);
const op = (o: number, ...k: Svg[]) => `<g opacity="${o}">${k.join('')}</g>`;
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const box = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 3, col, sw);
const tick = (x: number, y: number, s = 1) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, '#3fa45b', 2.8);
const cross = (x: number, y: number, s = 4) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, '#e8302c', 2.6);
let clipN = 0;
/** Clip the children to a rectangle (unique id per call). */
const clip = (x: number, y: number, w: number, h: number, ...k: Svg[]) => { const id = `pho${++clipN}`; return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${k.join('')}</g>`; };
/** Blurred look: faint copies of the drawing shifted around it. */
const blur = (r: number, ...k: Svg[]) => all(...[[-r, 0], [r, 0], [0, -r], [0, r], [-r * 0.7, -r * 0.7], [r * 0.7, r * 0.7]].map(([dx, dy]) => op(0.22, g(`translate(${f1(dx!)} ${f1(dy!)})`, ...k))));
/** A photo: white border, inner picture clipped to (x+3, y+3, w−6, h−6). */
const photo = (x: number, y: number, w: number, h: number, inner: Svg, border: string = C.white, edge: string = C.ink) => all(rect(x, y, w, h, border, 1.5, edge, 1.4), clip(x + 3, y + 3, w - 6, h - 6, inner), rect(x + 3, y + 3, w - 6, h - 6, 'none', 0, edge, 0.8));
const SKY = '#cfe8f5';
const GRASS = '#8cc58a';
const LENS = '#4f79a8';
const GLASS = '#22344a';
const RED = '#e8302c';
const GREEN = '#3fa45b';

// ── Things ───────────────────────────────────────────────────────────
const tree = (x: number, y: number, s = 1, col: string = '#4f9d69', trunk: string = C.brown) => at(x, y, s, rect(-2.5, -6, 5, 6, trunk, 1, C.ink, 1.1), circle(0, -14, 10, col, C.ink, 1.3), circle(-6, -9, 6, col, C.ink, 1.1), circle(6, -9, 6, col, C.ink, 1.1));
const pine = (x: number, y: number, s = 1, col: string = '#3d7a55') => at(x, y, s, rect(-2, -5, 4, 5, C.brown, 0.5, C.ink, 1), path('M0 -30 L9 -14 L5 -14 L11 -5 L-11 -5 L-5 -14 L-9 -14 Z', col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col: string = '#f2d7a6', roof: string = '#c0563f') => at(x, y, s, rect(-14, -20, 28, 20, col, 1, C.ink, 1.3), path('M-17 -20 L0 -34 L17 -20 Z', roof, C.ink, 1.3), rect(-4, -11, 8, 11, C.brown, 1, C.ink, 1), rect(-11, -16, 6, 5, '#bfe3f5', 1, C.ink, 0.9), rect(5, -16, 6, 5, '#bfe3f5', 1, C.ink, 0.9));
const sunC = (x: number, y: number, r = 7, col: string = C.yellow) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, col, C.ink, 1.4));
const bird = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, path('M-6 0 Q-3 -4 0 0 Q3 -4 6 0', 'none', col, 1.6));
const flower = (x: number, y: number, s = 1, col: string = '#e8457a') => at(x, y, s, line('M0 0 L0 16', GREEN, 2), path('M0 12 Q-6 8 -8 12 Q-4 14 0 12 Z', GREEN, C.ink, 0.8), ...range(6).map((i) => circle(f1(Math.sin(i * 1.047) * 4.4), f1(-Math.cos(i * 1.047) * 4.4), 3.4, col, C.ink, 0.8)), circle(0, 0, 2.6, C.yellow, C.ink, 0.6));
const ladybug = (x: number, y: number, s = 1) => at(x, y, s, circle(-7, 0, 3.4, C.black, null), ellipse(0, 0, 7, 6, RED, C.ink, 1), line('M0 -6 L0 6', C.ink, 0.9), circle(-3, -2, 1.2, C.ink, null), circle(3, 2, 1.2, C.ink, null), circle(3, -3, 1, C.ink, null), circle(-3, 3, 1, C.ink, null));
const leaf = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, path('M-16 0 Q0 -10 16 0 Q0 10 -16 0 Z', '#6fb36a', C.ink, 1.2), line('M-14 0 L14 0', '#3f7a3c', 1));
const boat = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, path('M-12 0 L12 0 L8 6 L-8 6 Z', col, C.ink, 1.2), line('M0 0 L0 -16', C.ink, 1.2), path('M1 -15 L10 -2 L1 -2 Z', C.white, C.ink, 1));
const lighthouse = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-3 -26 L3 -26 L5 0 Z', C.white, C.ink, 1.2), path('M-4.5 -8 L4.5 -8 L4 -13 L-4 -13 Z M-3.6 -18 L3.6 -18 L3.3 -22 L-3.3 -22 Z', RED, null), rect(-4, -32, 8, 6, C.yellow, 1, C.ink, 1), path('M-5 -32 L0 -36 L5 -32 Z', RED, C.ink, 1));
const fox = (x: number, y: number, s = 1) => at(x, y, s, path('M8 -4 C18 -6 22 2 16 6 C12 4 10 2 8 0 Z', C.orange, C.ink, 1.1), circle(16, 5, 1.6, C.white, null), ellipse(0, -4, 10, 6, C.orange, C.ink, 1.2), line('M-6 1 L-6 7 M-2 1 L-2 7 M3 1 L3 7 M6 1 L6 7', C.ink, 1.6), path('M-8 -6 L-16 -8 L-12 -2 L-8 -2 Z', C.orange, C.ink, 1.1), path('M-14 -8 L-14 -13 L-11 -9 Z M-11 -9 L-10 -13 L-8 -8 Z', C.orange, C.ink, 0.9), circle(-16, -7, 1, C.ink, null), circle(-12, -8, 0.8, C.ink, null));
const tripod = (x: number, top: number, foot = 112, col: string = C.dark) => all(line(`M${x} ${top} L${x - 10} ${foot} M${x} ${top} L${x + 10} ${foot} M${x} ${top} L${x} ${foot - 2}`, col, 2), rect(x - 4, top - 2, 8, 4, col, 1, C.ink, 0.8));
const lampStand = (x: number, top: number, foot = 112) => all(line(`M${x} ${top} L${x} ${foot - 6} M${x} ${foot - 6} L${x - 8} ${foot} M${x} ${foot - 6} L${x + 8} ${foot}`, C.dark, 2));
/** Softbox seen from the front-side, centre (x, y), facing right if dir = 1. */
const softbox = (x: number, y: number, s = 1, dir = 1) => at(x, y, s, g(`scale(${dir} 1)`, path('M-6 -4 L6 -12 L6 12 L-6 4 Z', C.dark, C.ink, 1.2), rect(6, -12, 3, 24, '#fffbe6', 1, C.ink, 1.2)));
/** Studio lamp head pointing right by `deg`. */
const spot = (x: number, y: number, s = 1, deg = 0) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, path('M-6 -5 L4 -7 L4 7 L-6 5 Z', C.dark, C.ink, 1.2), ellipse(4, 0, 2.4, 7, '#fff3b0', C.ink, 1));

// ── Cameras ──────────────────────────────────────────────────────────
/** System camera, front view, centre of the lens at (x, y). */
const cam = (x: number, y: number, s = 1, body: string = C.dark, lensRing: string = '#555a66') => at(x, y, s,
  rect(-18, -11, 36, 22, body, 4, C.ink, 1.4), path('M-7 -11 L-5 -17 L5 -17 L7 -11 Z', body, C.ink, 1.3), rect(-18, -6, 7, 17, '#3b3d46', 3, C.ink, 1), rect(10, -15, 6, 4, '#555a66', 1, C.ink, 1),
  circle(0, 0, 9.5, lensRing, C.ink, 1.4), circle(0, 0, 6.5, LENS, C.ink, 1), circle(0, 0, 3.4, GLASS, null), circle(-2, -2, 1.3, C.white, null));
/** Side view camera looking right; lens of length `len`; (x, y) = centre of the body. */
const sideCam = (x: number, y: number, s = 1, len = 10, wide = 7) => at(x, y, s,
  rect(-10, -8, 16, 16, C.dark, 3, C.ink, 1.3), path('M-6 -8 L-4 -12 L2 -12 L4 -8 Z', C.dark, C.ink, 1.1), rect(-12, -5, 4, 3, '#555a66', 1, C.ink, 0.8),
  path(`M6 -5 L${6 + len} ${-wide} L${6 + len} ${wide} L6 5 Z`, '#555a66', C.ink, 1.2), ellipse(6 + len, 0, 1.6, wide, LENS, C.ink, 1));
/** Phone, front (screen) view; returns body + screen (content clipped). */
const phone = (x: number, y: number, w: number, h: number, inner: Svg = '', body: string = C.dark) => all(rect(x, y, w, h, body, 5, C.ink, 1.6), clip(x + 3, y + 5, w - 6, h - 10, rect(x + 3, y + 5, w - 6, h - 10, '#bfe3f5', 0, null), inner), rect(x + 3, y + 5, w - 6, h - 10, 'none', 1, C.ink, 0.8));
/** A tiny landscape that fills (0..w, 0..h) at (x, y): sky, hill, sun, tree and house. */
const scenery = (x: number, y: number, w: number, h: number, o: { sky?: string; hill?: string; sun?: boolean } = {}) => g(`translate(${x} ${y})`,
  rect(0, 0, w, h, o.sky ?? SKY, 0, null), path(`M0 ${f1(h * 0.62)} Q${f1(w * 0.3)} ${f1(h * 0.45)} ${f1(w * 0.6)} ${f1(h * 0.6)} T${w} ${f1(h * 0.55)} L${w} ${h} L0 ${h} Z`, o.hill ?? GRASS, C.ink, 0.9),
  o.sun === false ? '' : circle(f1(w * 0.8), f1(h * 0.22), f1(h * 0.1), C.yellow, C.ink, 0.8), tree(f1(w * 0.25), f1(h * 0.7), f1(h / 70)), house(f1(w * 0.62), f1(h * 0.74), f1(h / 70)));

// ── People ───────────────────────────────────────────────────────────
type Pt = [number, number];
type Fig = {
  top?: string; bottom?: string; hair?: 'short' | 'long' | 'bun'; hairCol?: string; skin?: string; black?: boolean; grey?: boolean;
  mouth?: 'smile' | 'open' | 'flat'; armL?: Pt[]; armR?: Pt[]; skirt?: boolean; dress?: string; extra?: Svg; front?: Svg; tilt?: number; eyes?: boolean;
};
const HANG_L: Pt[] = [[-14, -48], [-15, -34]];
const HANG_R: Pt[] = [[14, -48], [15, -34]];
/** Standing person, feet at (x, y). Local units: head centre (0, −80), shoulders (±10, −64). Height ≈ 92·s. */
const fig = (x: number, s: number, o: Fig = {}, y = 112) => {
  const ink = o.black ? C.black : C.ink;
  const g0 = o.grey ? C.grey : null;
  const skin = o.black ? C.black : (g0 ? C.grey2 : (o.skin ?? C.skin));
  const top = o.black ? C.black : (g0 ?? o.top ?? C.sky);
  const bot = o.black ? C.black : (g0 ?? o.bottom ?? C.navy);
  const hair = o.black ? C.black : (g0 ?? o.hairCol ?? C.hair);
  const armPath = (side: number, pts: Pt[]) => { const d = `M${side * 9} -62 ` + pts.map(([a, b]) => `L${a} ${b}`).join(' '); const [hx, hy] = pts[pts.length - 1]!; return all(line(d, ink, 7.4), line(d, top, 5), circle(hx, hy, 3.2, skin, ink, 1.2)); };
  const face = o.black || o.eyes === false ? '' : all(circle(-3.6, -81, 1.2, C.ink, null), circle(3.6, -81, 1.2, C.ink, null),
    o.mouth === 'open' ? ellipse(0, -74.5, 2.4, 2.8, '#c84a4a', C.ink, 1) : o.mouth === 'flat' ? line('M-3 -74.5 L3 -74.5', C.ink, 1.2) : path('M-3.4 -75.5 Q0 -72.5 3.4 -75.5', 'none', C.ink, 1.3));
  const legs = o.dress ? all(path('M-11 -64 L11 -64 L20 -4 L-20 -4 Z', o.dress, ink, 1.6))
    : o.skirt ? all(path('M-11 -36 L11 -36 L15 -12 L-15 -12 Z', bot, ink, 1.8), line('M-5 -12 L-5 -1 M5 -12 L5 -1', skin, 4.4))
    : all(line('M-5 -36 L-6 -2', ink, 7.6), line('M-5 -36 L-6 -2', bot, 5.6), line('M5 -36 L6 -2', ink, 7.6), line('M5 -36 L6 -2', bot, 5.6));
  const shoes = all(ellipse(-7, -1, 5, 2.4, o.black ? C.black : C.black, null), ellipse(7, -1, 5, 2.4, C.black, null));
  const hairBack = o.hair === 'long' ? path('M-11 -82 C-14 -64 -8 -62 0 -64 C8 -62 14 -64 11 -82 C10 -96 -10 -96 -11 -82 Z', hair, ink, 1.6) : '';
  const hairTop = o.hair === 'bun' ? all(circle(0, -93, 4.5, hair, ink, 1.4), path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6))
    : path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6);
  return g(`translate(${x} ${y}) scale(${s})${o.tilt ? ` rotate(${o.tilt} 0 -40)` : ''}`,
    legs, shoes, hairBack,
    o.dress ? path('M-11 -66 L11 -66 L10 -40 L-10 -40 Z', o.dress, ink, 1.6) : path('M-11 -66 L11 -66 L10 -34 L-10 -34 Z', top, ink, 1.8),
    armPath(-1, o.armL ?? HANG_L), armPath(1, o.armR ?? HANG_R),
    rect(-3, -71, 6, 6, skin, 2, ink, 1.2), circle(0, -80, 10, skin, ink, 1.8), hairTop, face, o.extra ?? '', o.front ?? '');
};
/** A person seen from the side holding a camera to the eye, looking right. Feet at (x, y). */
const shooterSide = (x: number, s: number, top: string = C.green, y = 112, lens = 8, hairLong = false) => at(x, y, s,
  line('M-2 -36 L-4 -2 M2 -36 L5 -2', C.ink, 7.6), line('M-2 -36 L-4 -2 M2 -36 L5 -2', C.navy, 5.6), ellipse(-2, -1, 6, 2.4, C.black, null), ellipse(7, -1, 6, 2.4, C.black, null),
  hairLong ? path('M-10 -84 C-14 -66 -8 -64 -2 -66 L-2 -84 Z', C.hair, C.ink, 1.4) : '',
  path('M-8 -66 L8 -66 L7 -34 L-7 -34 Z', top, C.ink, 1.8), rect(-3, -71, 6, 6, C.skin, 2, C.ink, 1.2), circle(0, -80, 10, C.skin, C.ink, 1.8),
  path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', C.hair, C.ink, 1.6),
  line('M0 -62 L10 -70 L14 -78', C.ink, 7.4), line('M0 -62 L10 -70 L14 -78', top, 5), sideCam(18, -80, 0.6, lens), circle(13, -76, 3, C.skin, C.ink, 1));

// ── Motifs ───────────────────────────────────────────────────────────
export const PHOTO_MOTIFS: Record<string, Svg> = {
  // ── Kamerans delar ──
  /** systemkamera: a big camera on a table; a second lens lies beside it and an orange arrow shows that the lenses can be swapped. */
  'photo.systemkamera': all(rect(0, 92, 120, 28, '#c9a07a', 0, null), line('M0 92 L120 92', C.ink, 1.4), cam(46, 66, 2), circle(46, 66, 20, 'none', HL, 2.6),
    at(100, 80, 1, rect(-9, -12, 18, 24, '#555a66', 3, C.ink, 1.3), ellipse(0, -12, 9, 3, LENS, C.ink, 1), line('M-9 -4 L9 -4 M-9 2 L9 2', '#3b3d46', 1.2)),
    path('M96 60 C92 42 76 38 68 46', 'none', HL, 2.6), path('M66 40 L67 50 L74 45 Z', HL, HL, 1)),
  /** mobilkamera: the back of a phone held in a hand; the round camera lenses in the corner are ringed. */
  'photo.mobilkamera': all(rect(34, 10, 52, 98, '#4a6b8f', 9, C.ink, 2), rect(40, 16, 24, 30, '#3a5574', 7, C.ink, 1.4),
    circle(52, 24, 5.4, '#2b2b30', C.ink, 1.2), circle(52, 24, 3, LENS, null), circle(52, 38, 5.4, '#2b2b30', C.ink, 1.2), circle(52, 38, 3, LENS, null), circle(61, 31, 1.8, C.yellow, C.ink, 0.6),
    ring(52, 31, 17), path('M30 70 C24 74 24 98 34 104 L46 108 L46 70 Z', C.skin, C.ink, 1.4), path('M86 66 C96 70 96 90 88 96 L80 96 L80 66 Z', C.skin, C.ink, 1.4)),
  /** linsskydd: a camera from the front; the black cap comes off the lens along an orange arrow and is ringed. */
  'photo.linsskydd': all(cam(42, 64, 2.1), at(96, 46, 1, circle(0, 0, 15, '#2e2e36', C.ink, 1.6), circle(0, 0, 11, 'none', '#55586a', 1.2), line('M-6 0 L6 0', '#55586a', 1.6), rect(-14, -2, 3, 4, '#55586a', 1, null), rect(11, -2, 3, 4, '#55586a', 1, null)), ring(96, 46, 19),
    arrow(58, 50, 78, 44, HL, 2.6)),
  /** sökare: the back of a camera; a big eye looks into the small window at the top, and in the window a tiny tree is seen; the window is ringed. */
  'photo.sökare': all(rect(14, 46, 92, 56, C.dark, 7, C.ink, 2), path('M44 46 L50 30 L74 30 L80 46 Z', C.dark, C.ink, 1.8), rect(16, 56, 52, 38, '#3b3d46', 3, C.ink, 1.2),
    rect(52, 32, 20, 13, '#9ad0f0', 2, C.ink, 1.2), tree(62, 44, 0.5), ring(62, 38, 14), rect(80, 54, 18, 10, '#555a66', 3, C.ink, 1), circle(90, 80, 7, '#555a66', C.ink, 1.2),
    at(62, 14, 1, path('M-16 0 Q0 -12 16 0 Q0 12 -16 0 Z', C.white, C.ink, 1.6), circle(0, 0, 5.6, '#5a7f4a', C.ink, 1), circle(0, 0, 2.6, C.ink, null), circle(-1.6, -1.6, 1, C.white, null))),
  /** avtryckare (på kamera): a camera seen from the front; a hand comes down and presses the orange button on top along a down arrow. */
  'photo.avtryckare.2': all(cam(56, 74, 2.4), rect(78, 30, 14, 9, HL, 2, C.ink, 1.4), ring(85, 34, 12), moving('pho-tryck', '0%,30%{transform:translate(0,-8px)}55%,100%{transform:translate(0,0)}', { dur: 1.8 }, hand(85, 16, 1.5, 90)), arrow(106, 8, 106, 28, HL, 2.4)),
  /** slutare: a camera cut open; inside, two dark curtains in front of the sensor slide apart for a moment and let in a beam of light from the lens. */
  'photo.slutare': all(rect(10, 30, 100, 64, '#e9e4dc', 6, C.ink, 2), rect(10, 30, 100, 64, 'none', 6, C.ink, 2), path('M10 52 L-2 46 L-2 78 L10 72 Z', '#555a66', C.ink, 1.4), ellipse(-1, 62, 3, 16, LENS, C.ink, 1.2),
    path('M10 56 L76 48 L76 76 L10 68 Z', 'rgba(255,230,120,0.65)', null),
    rect(78, 40, 10, 44, '#5aa36a', 1, C.ink, 1.3), line('M80 44 L86 44 M80 50 L86 50 M80 56 L86 56 M80 62 L86 62 M80 68 L86 68 M80 74 L86 74 M80 80 L86 80', '#2f6b3d', 0.8),
    moving('pho-slutU', '0%,20%{transform:translate(0,0)}35%,65%{transform:translate(0,-18px)}80%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(70, 34, 6, 28, C.black, 1, C.ink, 1)),
    moving('pho-slutD', '0%,20%{transform:translate(0,0)}35%,65%{transform:translate(0,18px)}80%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(70, 62, 6, 28, C.black, 1, C.ink, 1)),
    box(66, 32, 14, 60)),
  /** fota: a woman holds up a phone and takes a picture of her dog; the flash blinks and a small photo of the dog pops up. */
  'photo.fota': all(ground(), fig(34, 0.9, { hair: 'long', top: C.orange, skirt: true, bottom: C.purple, armR: [[16, -66], [22, -76]], armL: [[-6, -56], [12, -70]] }),
    at(57, 46, 1, rect(-5, -9, 10, 18, C.dark, 2, C.ink, 1.2), rect(-3.5, -7, 7, 14, '#bfe3f5', 1, null)), waPulse('pho-fotaF', sparkle(66, 38, 7, C.yellow), sparkle(66, 38, 3, C.white)),
    at(92, 110, 1, path('M10 -6 C18 -10 20 -18 16 -22', 'none', C.ink, 4), path('M10 -6 C18 -10 20 -18 16 -22', 'none', C.tan, 2.4), path('M-10 0 L-8 -18 C-6 -24 8 -22 10 -14 L12 0 Z', C.tan, C.ink, 1.6), circle(-10, -24, 8, C.tan, C.ink, 1.6), path('M-18 -28 C-22 -22 -20 -16 -16 -18 Z M-4 -28 C0 -22 -2 -16 -6 -18 Z', '#a0673d', C.ink, 1.2), circle(-12, -25, 1.1, C.ink, null), circle(-8, -25, 1.1, C.ink, null), circle(-10, -21, 1.6, C.ink, null)),
    waGrow('pho-fotaP', photo(78, 12, 30, 24, all(rect(0, 0, 200, 200, '#f3e7c9', 0, null), circle(93, 26, 5, C.tan, C.ink, 1), ellipse(93, 34, 6, 4, C.tan, C.ink, 1))))),

  // ── Bländare och slutartid ──
  /** slutartid (symbol): left a camera whose shutter window is open (light comes in), right the same camera with the window closed; between them an orange span and a stopwatch with a small orange slice: the time it is open. */
  'photo.slutartid': all(
    at(26, 78, 1, rect(-18, -14, 36, 28, C.dark, 4, C.ink, 1.4), rect(-10, -9, 20, 18, '#fff2a8', 2, C.ink, 1.2), path('M-34 -8 L-10 -4 L-10 4 L-34 8 Z', 'rgba(255,220,90,0.6)', null)),
    at(94, 78, 1, rect(-18, -14, 36, 28, C.dark, 4, C.ink, 1.4), rect(-10, -9, 20, 18, C.black, 2, C.ink, 1.2)),
    line('M26 102 L94 102', HL, 2.6), line('M26 96 L26 108 M94 96 L94 108', HL, 2.6),
    at(60, 34, 1, rect(-3, -24, 6, 5, '#555a66', 1, C.ink, 1), circle(0, 0, 19, C.white, C.ink, 2), path('M0 0 L0 -17 A17 17 0 0 1 12 -12 Z', HL, null), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(Math.sin(a) * 14)} ${f1(-Math.cos(a) * 14)} L${f1(Math.sin(a) * 17)} ${f1(-Math.cos(a) * 17)}`, C.ink, 1); }), line('M0 0 L12 -12', C.ink, 2), circle(0, 0, 1.6, C.ink, null))),
  /** ljuskänslighet (symbol): the same dim moonlit house photographed twice; above, a grey camera sensor with its dial turned low gives a dark picture; below, the orange dial is turned high and the picture is bright, with small grains. */
  'photo.ljuskänslighet': all(rect(0, 0, 120, 120, '#e9eef3', 0, null),
    op(0.55, at(16, 30, 1, rect(-10, -10, 20, 20, '#7d8590', 2, C.ink, 1.2), line('M-6 -10 L-6 -14 M0 -10 L0 -14 M6 -10 L6 -14 M-6 10 L-6 14 M0 10 L0 14 M6 10 L6 14', C.ink, 1)), at(46, 30, 1, circle(0, 0, 11, C.white, C.ink, 1.4), line('M0 0 L-8 6', C.ink, 2), path('M-9 7 A11 11 0 0 1 -11 0', 'none', C.grey, 3))),
    photo(64, 12, 46, 36, all(rect(64, 12, 46, 36, '#1d2333', 0, null), circle(100, 22, 3, '#6b6f7a', null), house(84, 44, 0.6, '#3a3e4a', '#3a3e4a'))),
    arrow(58, 30, 62, 30, C.grey, 2),
    at(16, 86, 1, rect(-10, -10, 20, 20, '#5aa36a', 2, C.ink, 1.4), line('M-6 -10 L-6 -14 M0 -10 L0 -14 M6 -10 L6 -14 M-6 10 L-6 14 M0 10 L0 14 M6 10 L6 14', C.ink, 1), rect(-5, -5, 10, 10, '#fff2a8', 1, C.ink, 0.8)),
    at(46, 86, 1, circle(0, 0, 11, C.white, C.ink, 1.6), path('M-9 7 A11 11 0 1 1 9 7', 'none', HL, 3), line('M0 0 L8 6', C.ink, 2)),
    photo(64, 68, 46, 36, all(rect(64, 68, 46, 36, '#9fb4d0', 0, null), circle(100, 78, 3.4, C.white, null), house(84, 100, 0.6, '#f2d7a6'), ...range(26).map((i) => circle(66 + ((i * 37) % 42), 70 + ((i * 23) % 32), 0.6, C.white, null)))),
    arrow(58, 86, 62, 86, HL, 2), box(62, 66, 50, 40)),
  /** överexponerad (symbol): a big photo of a house and a tree that is almost all white – the sky and colours are gone; a big sun shines into it. Small grey reference: the same photo as it should be. */
  'photo.överexponerad': all(photo(14, 24, 80, 66, all(rect(0, 0, 200, 200, '#fbfbf6', 0, null), path('M17 74 Q40 64 60 72 T91 70 L91 87 L17 87 Z', '#eef3e4', '#e3e3d8', 0.8), at(36, 80, 1, op(0.25, tree(0, 0, 1.2))), at(68, 82, 1, op(0.25, house(0, 0, 1.1))))),
    box(12, 22, 84, 70), sunC(100, 18, 9), path('M90 26 L70 40 M96 32 L84 50 M86 20 L62 30', 'none', C.gold, 2),
    op(0.65, photo(80, 82, 32, 26, scenery(83, 85, 26, 20)))),
  /** underexponerad (symbol): a big photo of the same house and tree that is almost black – only faint shapes show. Small grey reference: the same photo as it should be. */
  'photo.underexponerad': all(photo(14, 24, 80, 66, all(rect(0, 0, 200, 200, '#15171f', 0, null), path('M17 74 Q40 64 60 72 T91 70 L91 87 L17 87 Z', '#1f2a22', '#2a2e36', 0.8), op(0.35, at(36, 80, 1, tree(0, 0, 1.2, '#2c3a30', '#2a2420'))), op(0.35, at(68, 82, 1, house(0, 0, 1.1, '#2e2a26', '#30201c'))))),
    box(12, 22, 84, 70), circle(104, 16, 6, '#c9ced4', C.ink, 1.2), path('M100 12 A6 6 0 0 0 104 22 A7 7 0 0 1 100 12 Z', '#9aa3ad', null),
    op(0.65, photo(80, 82, 32, 26, scenery(83, 85, 26, 20)))),
  /** exponering (foto, symbol): sunlight streams into a camera lens; next to it a tall gauge fills with yellow light up to the middle mark, which has a green tick (not too much, not too little). */
  'photo.exponering.2': all(sunC(18, 22, 9), path('M24 30 L40 52 M30 26 L48 46 M18 34 L32 58', 'none', C.gold, 2.2), cam(48, 70, 1.6),
    rect(86, 14, 18, 92, C.white, 4, C.ink, 1.8), rect(88, 60, 14, 44, '#ffe27a', 2, null), line('M80 36 L86 36 M80 60 L86 60 M80 84 L86 84', C.ink, 1.6), line('M86 60 L104 60', HL, 2.6), tick(112, 58, 1),
    path('M72 74 C78 80 82 80 86 76', 'none', C.gold, 2), box(84, 12, 22, 96)),
  /** exponera (foto): a camera cut open; beams of light travel in through the lens and land on the film inside, which lights up. */
  'photo.exponera.2': all(rect(30, 30, 76, 60, '#e9e4dc', 6, C.ink, 2), path('M30 50 L16 44 L16 76 L30 70 Z', '#555a66', C.ink, 1.4), ellipse(16, 60, 3, 16, LENS, C.ink, 1.2),
    rect(86, 40, 12, 40, '#c87a3a', 1, C.ink, 1.3), line('M86 44 L98 44 M86 76 L98 76', '#7a4520', 1.2), sunC(10, 14, 6),
    waIn('pho-expo', -60, 0, path('M30 56 L86 48 L86 72 L30 64 Z', 'rgba(255,220,90,0.7)', null), line('M36 58 L80 52 M36 62 L80 66', C.gold, 1.6)),
    waPulse('pho-expoF', rect(86, 48, 12, 24, '#fff2a8', 1, C.ink, 1)), box(84, 38, 16, 44)),
  /** ljusmätare: a hand holds a small grey light meter with a white dome and a dial with a needle up towards the sun. */
  'photo.ljusmätare': all(rect(0, 0, 120, 120, SKY, 0, null), sunC(96, 22, 10), rot(-14, 56, 66, rect(40, 36, 32, 52, '#9aa3ad', 6, C.ink, 1.8), ellipse(56, 34, 9, 6, C.white, C.ink, 1.4),
    rect(45, 46, 22, 16, C.white, 2, C.ink, 1.2), path('M47 60 A10 10 0 0 1 65 60', 'none', C.ink, 1), line('M56 60 L62 50', RED, 1.6), rect(48, 68, 16, 6, '#555a66', 2, C.ink, 1), circle(52, 80, 2.4, '#555a66', C.ink, 0.8), circle(60, 80, 2.4, '#555a66', C.ink, 0.8)),
    path('M38 94 C30 100 32 116 44 118 L70 118 L72 92 C64 86 50 86 38 94 Z', C.skin, C.ink, 1.6), ring(56, 54, 30), line('M70 38 L86 28', C.gold, 2)),
  /** rörelseoskärpa: a cyclist rushes past a house; the cyclist is smeared into faint copies with speed lines, while the house behind is sharp. */
  'photo.rörelseoskärpa': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 92, 120, 28, '#c9ced4', 0, null), line('M0 92 L120 92', C.ink, 1.2), house(86, 92, 1.4),
    moving('pho-ros', '0%{transform:translate(-40px,0)}60%,100%{transform:translate(0,0)}', { dur: 1.8 },
      ...[18, 12, 6].map((dx, i) => op(0.18 + i * 0.12, g(`translate(${-dx} 0)`, at(46, 104, 1, circle(-12, 0, 9, 'none', C.ink, 2), circle(12, 0, 9, 'none', C.ink, 2), line('M-12 0 L-2 -12 L10 -12 L12 0 M-2 -12 L-4 -18 M10 -12 L12 -20', C.ink, 2), fig(0, 0.42, { top: C.orange, armR: [[12, -54], [20, -46]] }, -10))))),
      at(46, 104, 1, circle(-12, 0, 9, 'none', C.ink, 2), circle(12, 0, 9, 'none', C.ink, 2), line('M-12 0 L-2 -12 L10 -12 L12 0 M-2 -12 L-4 -18 M10 -12 L12 -20', C.ink, 2), fig(0, 0.42, { top: C.orange, armR: [[12, -54], [20, -46]] }, -10)),
      line('M8 70 L26 70 M4 80 L22 80 M10 90 L24 90', HL, 2))),

  // ── Skärpedjup ──
  /** skärpa (symbol): the same flower photographed twice; left (grey border) it is blurred, right (orange border) every petal and edge is crisp. */
  'photo.skärpa': all(op(0.8, photo(6, 26, 50, 66, all(rect(0, 0, 200, 200, '#e8f0e0', 0, null), blur(2.6, flower(31, 50, 1.6, '#c98aa0'))), C.white, C.grey)),
    photo(64, 26, 50, 66, all(rect(0, 0, 200, 200, '#e8f0e0', 0, null), flower(89, 50, 1.6))), box(62, 24, 54, 70), tick(108, 104, 1.2), cross(31, 104, 4)),
  /** autofokus: the back screen of a camera shows a face; green focus brackets jump in and lock onto the face by themselves, and an orange circular arrow turns on the lens ring. */
  'photo.autofokus': all(rect(10, 30, 100, 70, C.dark, 7, C.ink, 2), rect(18, 38, 64, 54, '#cfe8f5', 2, C.ink, 1.2), at(50, 84, 1, path('M-16 8 C-16 -6 16 -6 16 8 Z', C.orange, C.ink, 1.2), circle(0, -16, 10, C.skin, C.ink, 1.4), path('M-10 -18 C-10 -30 10 -30 10 -18 C6 -23 -6 -23 -10 -18 Z', C.hair, null), circle(-3.4, -16, 1.1, C.ink, null), circle(3.4, -16, 1.1, C.ink, null)),
    moving('pho-af', '0%{transform:scale(1.8);opacity:.3}45%,100%{transform:scale(1);opacity:1}', { dur: 2.2, spin: true }, path('M38 58 L38 54 L42 54 M58 54 L62 54 L62 58 M62 74 L62 78 L58 78 M42 78 L38 78 L38 74', 'none', GREEN, 2.4)),
    circle(96, 52, 9, '#555a66', C.ink, 1.4), circle(96, 52, 5, LENS, null), path('M96 36 A16 16 0 1 1 82 46', 'none', HL, 2.4), path('M80 41 L82 49 L88 44 Z', HL, HL, 1), rect(88, 76, 14, 10, '#555a66', 3, C.ink, 1)),
  /** fokuspunkt: a phone screen shows a flower in front and a house behind; a hand taps the flower and a small orange square marks the point the camera sets sharp on, while the house is blurred. */
  'photo.fokuspunkt': all(phone(26, 6, 64, 108, all(rect(29, 11, 58, 98, '#dbeed8', 0, null), blur(2.4, house(70, 50, 1, '#d7c7a6', '#b48a7a')), flower(48, 70, 1.6))), box(37, 59, 22, 22), hand(72, 94, 1.4, 225)),
  /** skärpedjup (symbol): two photos of three posts at different distances. Above (grey bracket), all three posts are sharp. Below, only the nearest post is sharp, the far ones are blurred, and a short orange bracket marks the sharp zone. */
  'photo.skärpedjup': all(
    op(0.85, photo(8, 6, 104, 50, all(rect(0, 0, 200, 200, '#e3efe0', 0, null), path('M11 40 L109 40 L109 53 L11 53 Z', '#c8d8b8', null), at(26, 50, 1, rect(-4, -30, 8, 30, '#a0673d', 1, C.ink, 1.2)), at(60, 44, 1, rect(-3, -20, 6, 20, '#a0673d', 1, C.ink, 1)), at(90, 41, 1, rect(-2, -12, 4, 12, '#a0673d', 1, C.ink, 0.9))), C.white, C.grey)),
    line('M20 60 L96 60', C.grey, 2.4), line('M20 57 L20 63 M96 57 L96 63', C.grey, 2.4),
    photo(8, 64, 104, 50, all(rect(0, 0, 200, 200, '#e3efe0', 0, null), path('M11 98 L109 98 L109 111 L11 111 Z', '#c8d8b8', null), at(26, 108, 1, rect(-4, -30, 8, 30, '#a0673d', 1, C.ink, 1.2)), blur(2, at(60, 102, 1, rect(-3, -20, 6, 20, '#a0673d', 1, null))), blur(2.4, at(90, 99, 1, rect(-2, -12, 4, 12, '#a0673d', 1, null))))),
    box(6, 62, 108, 54), line('M18 118 L36 118', HL, 3)),
  /** vidvinkelobjektiv: a camera with a short, wide lens at the bottom; a very wide orange fan of view covers a whole row of houses and trees. */
  'photo.vidvinkelobjektiv': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 44, 120, 76, GRASS, 0, null), line('M0 44 L120 44', C.ink, 1),
    tree(10, 44, 0.8), house(30, 44, 0.8), tree(50, 44, 0.8), house(70, 44, 0.8, '#d9e4f0'), tree(90, 44, 0.8), house(110, 44, 0.8),
    path('M60 92 L2 36 L118 36 Z', 'rgba(228,87,46,0.18)', null), line('M60 92 L2 36 M60 92 L118 36', HL, 2.4),
    rot(-90, 60, 100, sideCam(60, 100, 1.3, 4, 9))),
  /** teleobjektiv: a camera with a very long lens at bottom left; a narrow orange cone reaches a tiny bird on a far tree, and a round inset shows the bird big. */
  'photo.teleobjektiv': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 70, 120, 50, GRASS, 0, null), line('M0 70 L120 70', C.ink, 1), tree(104, 70, 0.55), bird(104, 56, 0.5),
    path('M34 96 L102 52 L106 60 Z', 'rgba(228,87,46,0.2)', null), line('M34 96 L102 52 M34 96 L106 60', HL, 2), rot(-33, 22, 100, sideCam(22, 100, 1, 22, 6)),
    circle(40, 30, 22, C.white, C.ink, 1.8), at(40, 34, 1, path('M-14 0 Q-6 -10 0 0 Q6 -10 14 0', 'none', C.ink, 3), ellipse(0, 2, 6, 4, '#6b5a4a', C.ink, 1.2), circle(5, -1, 3, '#6b5a4a', C.ink, 1), path('M8 -1 L12 0 L8 1 Z', C.orange, null)), line('M58 40 L100 56', C.grey, 1.2, '3 3')),
  /** makroobjektiv: a camera's lens almost touches a ladybird on a leaf; a big round inset shows the ladybird huge, with every spot. */
  'photo.makroobjektiv': all(ground(), leaf(84, 98, 1.6, -10), ladybug(84, 92, 0.6), sideCam(40, 92, 1.4, 14, 9), ring(84, 92, 9),
    circle(70, 36, 28, C.white, C.ink, 1.8), clip(42, 8, 56, 56, leaf(70, 50, 3.4, -10), ladybug(70, 36, 2)), circle(70, 36, 28, 'none', C.ink, 1.8), line('M80 62 L84 84', C.grey, 1.2, '3 3')),
  /** porträttläge: a phone screen shows a smiling woman, sharp, in front of a background of soft blurred blobs; a small round button with a person icon at the bottom is orange. */
  'photo.porträttläge': all(phone(28, 4, 64, 112, all(rect(31, 9, 58, 102, '#c9dfc8', 0, null), blur(3, circle(42, 28, 8, '#7fb27a', null), circle(78, 24, 10, '#e8c07a', null), circle(60, 40, 7, '#9ac0e0', null), circle(80, 56, 9, '#7fb27a', null)),
    at(60, 106, 1, path('M-22 0 C-22 -18 22 -18 22 0 Z', C.orange, C.ink, 1.4), path('M-12 -46 C-14 -24 -8 -22 0 -24 C8 -22 14 -24 12 -46 Z', C.hair, C.ink, 1.2), circle(0, -36, 12, C.skin, C.ink, 1.6), path('M-12 -38 C-12 -52 12 -52 12 -38 C6 -43 -6 -43 -12 -38 Z', C.hair, null), circle(-4, -36, 1.3, C.ink, null), circle(4, -36, 1.3, C.ink, null), path('M-4 -30 Q0 -27 4 -30', 'none', C.ink, 1.2)))),
    circle(60, 104, 7, HL, C.ink, 1.4), circle(60, 101, 2.4, C.white, null), path('M55 108 C55 104 65 104 65 108 Z', C.white, null)),

  // ── Bildutsnitt ──
  /** bildutsnitt (symbol): a wide coast with a lighthouse, a boat, a house and trees is grey; only the part inside the orange viewfinder frame (the boat and the lighthouse) is in colour. */
  'photo.bildutsnitt': all(op(0.45, rect(0, 0, 120, 120, '#dfe3e6', 0, null), rect(0, 66, 120, 54, '#b8c2cc', 0, null), tree(10, 70, 0.8, C.grey, C.grey), house(102, 70, 0.8, C.grey2, C.grey), boat(60, 76, 1.2, C.grey), lighthouse(78, 70, 1, ), tree(26, 70, 0.6, C.grey, C.grey)),
    clip(38, 30, 54, 58, rect(0, 0, 120, 66, SKY, 0, null), rect(0, 66, 120, 54, '#6aa8d8', 0, null), path('M70 66 L96 66 L100 72 L66 72 Z', '#c8b088', null), boat(56, 78, 1.2), lighthouse(82, 68, 1), bird(52, 42, 0.6)),
    box(38, 30, 54, 58), line('M34 26 L44 26 M34 26 L34 36 M96 26 L86 26 M96 26 L96 36 M34 92 L44 92 M34 92 L34 82 M96 92 L86 92 M96 92 L96 82', HL, 2.4)),
  /** närbild: a photo frame filled by one big face, eyes and smile seen up close. */
  'photo.närbild': all(photo(12, 12, 96, 96, all(rect(0, 0, 200, 200, '#e6eef3', 0, null), path('M20 108 C20 88 100 88 100 108 Z', C.orange, C.ink, 1.6), path('M28 54 C26 20 94 20 92 54 C84 34 36 34 28 54 Z', C.hair, C.ink, 1.6), circle(60, 60, 30, C.skin, C.ink, 2), path('M30 52 C30 22 90 22 90 52 C80 38 40 38 30 52 Z', C.hair, C.ink, 1.6), circle(48, 60, 3.4, C.ink, null), circle(72, 60, 3.4, C.ink, null), path('M50 74 Q60 82 70 74', 'none', C.ink, 2), path('M58 62 Q56 68 60 68', 'none', C.skin2, 1.6))), box(10, 10, 100, 100)),
  /** helbild: a photo frame with one whole person in it, from the head down to the feet. */
  'photo.helbild': all(photo(24, 8, 72, 104, all(rect(0, 0, 200, 200, '#e6eef3', 0, null), rect(0, 100, 200, 20, '#d4dccf', 0, null), fig(60, 1, { top: C.orange, hair: 'long', skirt: true, bottom: C.purple }, 104))), box(22, 6, 76, 108)),
  /** översiktsbild: a photo frame with a wide town square seen from far: houses, a church, trees and many tiny people. */
  'photo.översiktsbild': all(photo(6, 18, 108, 84, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 70, 200, 40, '#d8cdb8', 0, null), house(20, 70, 0.7), house(42, 70, 0.6, '#d9e4f0', '#5a7fa8'), at(66, 70, 1, rect(-8, -22, 16, 22, '#efe6d6', 1, C.ink, 1), path('M-10 -22 L0 -34 L10 -22 Z', '#7a8a9a', C.ink, 1), rect(-3, -46, 6, 14, '#efe6d6', 1, C.ink, 1), path('M-4 -46 L0 -54 L4 -46 Z', '#7a8a9a', C.ink, 1)), house(90, 70, 0.65, '#f0c9a8'), tree(104, 70, 0.6),
      ...range(9).map((i) => fig(16 + i * 10.5, 0.11 + (i % 3) * 0.01, { top: [C.orange, C.green, C.sky, RED, C.purple][i % 5]!, eyes: false }, 80 + (i % 3) * 7)))), box(4, 16, 112, 88)),
  /** tredjedelsregel (symbol): a photo of a meadow with a lone tree is divided by two vertical and two horizontal dashed lines into nine squares; the tree stands where two lines cross, and the horizon lies on the lower line; orange dots mark the four crossings. */
  'photo.tredjedelsregel': all(photo(8, 16, 104, 84, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 70, 200, 40, GRASS, 0, null), line('M0 70 L200 70', C.ink, 1), tree(42, 70, 1.2), sunC(80, 38, 5)),
    ), line('M43 19 L43 97 M77 19 L77 97 M11 44.7 L109 44.7 M11 71.3 L109 71.3', C.white, 1.8, '4 3'), ...[[43, 44.7], [77, 44.7], [43, 71.3], [77, 71.3]].map(([x, y]) => circle(x!, y!, 3.4, HL, C.ink, 1))),
  /** inramning (i en bild): a church by a lake seen through a dark stone archway; the arch is a frame around the motif and is outlined in orange. */
  'photo.inramning.2': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 74, 120, 46, '#6aa8d8', 0, null), line('M0 74 L120 74', C.ink, 1), at(60, 74, 1, rect(-10, -22, 20, 22, '#efe6d6', 1, C.ink, 1.2), path('M-12 -22 L0 -34 L12 -22 Z', '#c0563f', C.ink, 1.2), rect(-3, -48, 6, 16, '#efe6d6', 1, C.ink, 1), path('M-4 -48 L0 -56 L4 -48 Z', '#c0563f', C.ink, 1)), tree(30, 74, 0.6), tree(92, 74, 0.6),
    `<path d="M0 0 L120 0 L120 120 L0 120 Z M24 112 L24 48 C24 12 96 12 96 48 L96 112 Z" fill="#6b5d52" fill-rule="evenodd" stroke="${C.ink}" stroke-width="1.8"/>`,
    line('M10 20 L18 22 M8 60 L18 60 M104 30 L112 32 M102 80 L112 80 M6 96 L16 98', '#55493f', 1.4), path('M24 112 L24 48 C24 12 96 12 96 48 L96 112', 'none', HL, 2.8)),
  /** kvadratisk (form, symbol): a square photo with an orange border and equal marks on all four sides; behind it a wide and a tall photo in grey. */
  'photo.kvadratisk.3': all(op(0.55, rect(6, 14, 64, 40, C.white, 2, C.grey, 1.6), rect(10, 18, 56, 32, '#c9ced4', 0, null), rect(80, 6, 34, 56, C.white, 2, C.grey, 1.6), rect(84, 10, 26, 48, '#c9ced4', 0, null)),
    photo(30, 40, 64, 64, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 80, 200, 40, GRASS, 0, null), flower(62, 76, 1.8))), box(28, 38, 68, 68),
    line('M62 33 L62 43 M62 101 L62 111 M23 72 L33 72 M91 72 L101 72', HL, 3)),
  /** på höjden (symbol): two hands hold a phone upright to photograph a tall tower; the screen shows the whole tower, and an orange double arrow runs up and down beside it. */
  'photo.på-höjden': all(rect(0, 0, 120, 120, SKY, 0, null), op(0.5, at(100, 112, 1, rect(-6, -90, 12, 90, '#d9cbb4', 1, C.ink, 1), path('M-8 -90 L0 -104 L8 -90 Z', '#c0563f', C.ink, 1))),
    phone(38, 10, 40, 82, all(rect(41, 15, 34, 72, SKY, 0, null), at(58, 87, 1, rect(-5, -52, 10, 52, '#d9cbb4', 1, C.ink, 1), path('M-7 -52 L0 -64 L7 -52 Z', '#c0563f', C.ink, 1), rect(-2, -40, 4, 6, '#9ad0f0', 1, null), rect(-2, -24, 4, 6, '#9ad0f0', 1, null)))),
    path('M30 70 C22 76 24 100 36 104 L46 92 L44 72 Z', C.skin, C.ink, 1.4), path('M86 70 C94 76 92 100 80 104 L70 92 L72 72 Z', C.skin, C.ink, 1.4),
    arrow(26, 50, 26, 12, HL, 2.6), arrow(26, 50, 26, 90, HL, 2.6)),
  /** på bredden (symbol): two hands hold a phone on its side to photograph the sea with boats; the screen shows the wide sea, and an orange double arrow runs from side to side under it. */
  'photo.på-bredden': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 70, 120, 50, '#6aa8d8', 0, null),
    phone(14, 26, 92, 44, all(rect(17, 31, 86, 34, SKY, 0, null), rect(17, 50, 86, 15, '#4f8fc8', 0, null), boat(36, 50, 0.6), boat(70, 50, 0.5, C.yellow), boat(92, 50, 0.4, C.white), sunC(84, 38, 3))),
    path('M10 52 C2 56 4 76 14 80 L24 70 L22 54 Z', C.skin, C.ink, 1.4), path('M110 52 C118 56 116 76 106 80 L96 70 L98 54 Z', C.skin, C.ink, 1.4),
    arrow(60, 96, 12, 96, HL, 2.6), arrow(60, 96, 108, 96, HL, 2.6)),
  /** underifrån (symbol): a photographer lies on the ground at the bottom left and points the camera up at a standing man, who towers above; an orange arrow goes up from the camera. */
  'photo.underifrån': all(ground(), fig(78, 1.15, { top: C.green, mouth: 'smile' }), at(24, 106, 1, rect(-18, -4, 30, 8, C.orange, 3, C.ink, 1.3), circle(16, -2, 6, C.skin, C.ink, 1.3), path('M10 -4 C10 -12 22 -12 22 -4 Z', C.hair, null), rot(-55, 4, -8, sideCam(4, -8, 0.8, 6))),
    arrow(30, 88, 56, 34, HL, 2.6), line('M34 98 L70 22 M36 98 L96 26', C.grey, 1, '3 3')),
  /** zooma ut: a phone screen shows a face up close that shrinks until the whole person, a house and a tree are seen; orange arrows point out from the corners. */
  'photo.zooma-ut': all(phone(26, 8, 68, 104, moving('pho-zoom', '0%,15%{transform:scale(2.6)}70%,100%{transform:scale(1)}', { dur: 3, spin: true },
      g('translate(0 0)', rect(-20, -20, 160, 160, SKY, 0, null), rect(-20, 84, 160, 60, GRASS, 0, null), tree(40, 86, 0.8), house(78, 86, 0.8), fig(60, 0.42, { top: C.orange, hair: 'long', skirt: true, bottom: C.purple }, 94)))),
    arrow(46, 34, 32, 18, HL, 2.4), arrow(74, 34, 88, 18, HL, 2.4), arrow(46, 86, 32, 102, HL, 2.4), arrow(74, 86, 88, 102, HL, 2.4)),

  // ── Ljussättning ──
  /** ljussättning: a lighting plan seen from above – a person on a stool in the middle, a camera at the bottom, a big lamp at the left and a small one behind at the right, each with its beam; orange arrows show the photographer moving the lamps into place. */
  'photo.ljussättning': all(rect(0, 0, 120, 120, '#ece7df', 0, null), path('M12 6 L108 6 L108 22 L12 22 Z', '#c9ced4', C.ink, 1.2),
    path('M22 54 L56 50 L56 70 L22 70 Z', 'rgba(255,230,120,0.55)', null), path('M96 30 L66 52 L74 60 Z', 'rgba(255,230,120,0.55)', null),
    ellipse(60, 62, 17, 9, C.orange, C.ink, 1.4), circle(60, 60, 8, C.hair, C.ink, 1.2), ellipse(60, 67, 3, 1.6, C.skin, null),
    at(16, 60, 1, rect(-8, -14, 10, 28, C.dark, 2, C.ink, 1.2), rect(2, -14, 4, 28, '#fffbe6', 1, C.ink, 1)), rot(40, 100, 26, at(100, 26, 1, rect(-6, -5, 10, 10, C.dark, 2, C.ink, 1.1), rect(4, -5, 3, 10, '#fff3b0', 1, C.ink, 1))),
    at(60, 104, 1, rect(-10, -6, 20, 12, C.dark, 2, C.ink, 1.2), rect(-4, -12, 8, 6, '#555a66', 1, C.ink, 1)),
    path('M12 92 C4 80 4 70 10 62', 'none', HL, 2.4, ), path('M7 64 L11 58 L14 65 Z', HL, HL, 1), path('M110 50 C116 42 114 34 106 30', 'none', HL, 2.4), path('M108 26 L104 31 L110 33 Z', HL, HL, 1)),
  /** sidoljus: a big face lit by a lamp from the left: the left half is warm and bright, the right half is in dark shadow. */
  'photo.sidoljus': all(rect(0, 0, 120, 120, '#3a3d4a', 0, null), spot(12, 52, 1.6, 0), path('M18 40 L44 34 L44 92 L18 66 Z', 'rgba(255,230,120,0.4)', null),
    path('M40 112 C40 92 104 92 104 112 Z', C.orange, C.ink, 1.6), circle(72, 62, 28, C.skin, C.ink, 2), clip(72, 20, 40, 100, circle(72, 62, 28, '#7a5a48', null), path('M72 112 L72 90 C88 90 104 96 104 112 Z', '#7a3a1a', null)),
    path('M44 56 C44 26 100 26 100 56 C92 42 52 42 44 56 Z', C.hair, C.ink, 1.6), circle(62, 62, 2.6, C.ink, null), circle(82, 62, 2.6, '#2a2a2a', null), path('M64 76 Q72 80 80 76', 'none', C.ink, 1.6), line('M72 34 L72 90', HL, 1.4, '3 3')),
  /** silhuett: a man stands in front of a big bright window; against the light he is only a black shape without any details. */
  'photo.silhuett': all(rect(0, 0, 120, 120, '#5a5450', 0, null), rect(14, 8, 92, 104, '#fff8d8', 2, C.ink, 2), line('M60 8 L60 112 M14 60 L106 60', '#d9cfa8', 2), rect(0, 108, 120, 12, '#3a3430', 0, null),
    fig(60, 1.05, { black: true, armR: [[14, -48], [16, -36]] }, 112)),
  /** reflexskärm: a woman is lit from the left by the sun; at the right a man holds up a big round white screen that sends the light back onto the shadow side of her face (orange arrows); the screen is ringed. */
  'photo.reflexskärm': all(rect(0, 0, 120, 120, SKY, 0, null), ground(), sunC(14, 16, 8), fig(44, 0.95, { top: C.orange, hair: 'long', skirt: true, bottom: C.purple }),
    fig(98, 0.85, { top: C.green, armL: [[-14, -66], [-16, -80]], armR: [[12, -66], [8, -82]] }), at(88, 40, 1, ellipse(0, 0, 13, 20, '#f2f4f6', C.ink, 1.8), ellipse(0, 0, 9, 15, 'none', '#c0c6cc', 1.4)), ring(88, 40, 23),
    arrow(22, 24, 80, 36, C.gold, 2), arrow(78, 46, 54, 38, HL, 2.6)),
  /** fotostudio: a room with a grey paper roll hanging down as a background, two lamps with softboxes on stands, a stool and a camera on a tripod. */
  'photo.fotostudio': all(rect(0, 0, 120, 120, '#e8e3da', 0, null), rect(0, 96, 120, 24, '#b9a68f', 0, null), rect(30, 8, 60, 6, '#555a66', 3, C.ink, 1.2), path('M32 14 L88 14 L88 84 Q88 100 104 100 L16 100 Q32 100 32 84 Z', '#c9ced4', C.ink, 1.2),
    at(60, 100, 1, rect(-8, -18, 16, 4, C.brown, 1, C.ink, 1.1), line('M-6 -14 L-8 0 M6 -14 L8 0', C.brown, 2)),
    lampStand(14, 40), softbox(14, 36, 1.3, 1), lampStand(106, 40), softbox(106, 36, 1.3, -1), tripod(78, 76, 112), sideCam(76, 70, 0.9, 6)),
  /** gyllene timmen (symbol): a landscape at the low evening sun: the sky glows orange and yellow, a tree and a woman throw very long shadows, and everything is warmly lit. */
  'photo.gyllene-timmen': all(rect(0, 0, 120, 40, '#f7c46a', 0, null), rect(0, 40, 120, 30, '#f9d98a', 0, null), circle(16, 72, 12, '#ffe7a0', C.ink, 1.4), rect(0, 72, 120, 48, '#c8b05a', 0, null), line('M0 72 L120 72', C.ink, 1.2),
    path('M70 104 L118 112 L118 116 L70 108 Z', 'rgba(60,40,20,0.35)', null), tree(64, 104, 0.9, '#9aa03a'), path('M44 112 L100 120 L60 120 Z', 'rgba(60,40,20,0.3)', null),
    fig(40, 0.55, { top: C.orange, hair: 'long', skirt: true, bottom: C.purple }, 112), line('M18 60 L40 30 M22 66 L64 40', 'rgba(255,240,180,0.9)', 2)),
  /** belysa (lysa på): a spotlight on a stand at the left throws a beam onto a white vase on a stand at the right; the beam glows and the lit side of the vase is bright. */
  'photo.belysa': all(rect(0, 0, 120, 120, '#4a4d5a', 0, null), rect(0, 104, 120, 16, '#6a5a4a', 0, null), lampStand(18, 34, 108), spot(20, 30, 1.6, 22),
    waPulse('pho-bely', path('M28 26 L96 48 L98 86 L30 42 Z', 'rgba(255,236,150,0.55)', null)),
    rect(80, 84, 30, 20, '#d9d2c4', 1, C.ink, 1.3), path('M88 84 C82 70 84 58 90 52 L90 46 L100 46 L100 52 C106 58 108 70 102 84 Z', '#fbfbf6', C.ink, 1.6), path('M98 52 C104 60 104 74 100 84 L102 84 C108 70 106 58 100 52 Z', '#c9ced4', null)),

  // ── Bildredigering ──
  /** bildredigering: a laptop shows a landscape photo with a row of sliders beside it; one slider knob is orange. */
  'photo.bildredigering': all(rect(0, 96, 120, 24, '#c9a07a', 0, null), line('M0 96 L120 96', C.ink, 1.2), rect(10, 18, 100, 70, C.dark, 4, C.ink, 1.8), rect(14, 22, 92, 62, '#f2f2f0', 1, null),
    clip(17, 26, 56, 54, scenery(17, 26, 56, 54)), rect(17, 26, 56, 54, 'none', 0, C.ink, 0.8),
    ...[34, 46, 58, 70].map((y, i) => all(line(`M78 ${y} L102 ${y}`, C.grey, 2), circle([86, 96, 82, 92][i]!, y, 3.2, i === 1 ? HL : C.white, C.ink, 1.1))),
    path('M2 88 L118 88 L112 98 L8 98 Z', '#9aa3ad', C.ink, 1.6)),
  /** räta upp: a photo on a screen with a crooked horizon turns until the sea is level with a straight orange line. */
  'photo.räta-upp': all(rect(4, 10, 112, 86, C.dark, 5, C.ink, 1.8), rect(8, 14, 104, 78, '#f2f2f0', 1, null), line('M12 53 L108 53', HL, 2, '5 3'),
    moving('pho-rata', '0%,20%{transform:rotate(-12deg)}65%,100%{transform:rotate(0)}', { dur: 3, spin: true },
      photo(24, 26, 72, 54, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 53, 200, 40, '#6aa8d8', 0, null), boat(52, 53, 0.8), sunC(80, 38, 4)))),
    rect(46, 96, 28, 8, '#9aa3ad', 1, C.ink, 1.2), rect(36, 104, 48, 6, '#9aa3ad', 2, C.ink, 1.2)),
  /** mättnad (färg, symbol): the same flowers twice; left, in a grey frame, the colours are pale and greyish; right, in an orange frame, the colours are strong and clear; below, a slider is pushed to the right. */
  'photo.mättnad.2': all(op(0.85, photo(6, 14, 50, 62, all(rect(0, 0, 200, 200, '#e2e2dc', 0, null), flower(20, 40, 1.1, '#c8b0b8'), flower(34, 48, 1.1, '#c0bca0'), flower(44, 38, 1.1, '#a8b4c4')), C.white, C.grey)),
    photo(64, 14, 50, 62, all(rect(0, 0, 200, 200, '#b8e6a8', 0, null), flower(78, 40, 1.1, '#ff2a6a'), flower(92, 48, 1.1, '#ffd000'), flower(102, 38, 1.1, '#2a7fff'))), box(62, 12, 54, 66),
    rect(14, 92, 92, 8, '#d0d0d0', 4, C.ink, 1), rect(14, 92, 92, 8, 'none', 4, C.ink, 1), line('M18 96 L102 96', HL, 3), circle(98, 96, 6, HL, C.ink, 1.4), circle(22, 96, 3, C.grey, null)),
  /** svartvit (utan färg, symbol): a small colour photo at the left becomes, along an arrow, a big photo with only black, white and grey. */
  'photo.svartvit.2': all(photo(4, 40, 36, 30, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 58, 200, 20, GRASS, 0, null), house(22, 62, 0.5), tree(12, 62, 0.4))), arrow(42, 55, 52, 55, HL, 2.6),
    photo(54, 14, 62, 82, all(rect(0, 0, 200, 200, '#d6d6d6', 0, null), rect(0, 70, 200, 40, '#8a8a8a', 0, null), line('M0 70 L200 70', '#2e2e2e', 1), at(92, 72, 1.2, rect(-14, -20, 28, 20, '#f4f4f4', 1, '#2e2e2e', 1.3), path('M-17 -20 L0 -34 L17 -20 Z', '#4a4a4a', '#2e2e2e', 1.3), rect(-4, -11, 8, 11, '#2e2e2e', 1, null), rect(-11, -16, 6, 5, '#b0b0b0', 1, null), rect(5, -16, 6, 5, '#b0b0b0', 1, null)), at(66, 72, 1, rect(-2, -6, 4, 6, '#3a3a3a', 0, null), circle(0, -14, 8, '#5a5a5a', '#2e2e2e', 1), circle(-5, -9, 5, '#5a5a5a', '#2e2e2e', 1))), C.white), box(52, 12, 66, 86)),
  /** framkalla (foto): under a red lamp, a hand with tongs holds a sheet of paper in a tray of liquid, and a picture of a house slowly appears on the paper. */
  'photo.framkalla.2': all(rect(0, 0, 120, 120, '#3a1c1c', 0, null), line('M60 0 L60 10', C.ink, 1.6), path('M50 10 L70 10 L66 20 L54 20 Z', '#555', C.ink, 1.2), waPulse('pho-red', circle(60, 22, 6, '#ff3a2a', null)), path('M44 24 L76 24 L100 70 L20 70 Z', 'rgba(255,60,40,0.12)', null),
    path('M10 82 L110 82 L104 108 L16 108 Z', '#d8d8d8', C.ink, 1.8), path('M16 86 L104 86 L100 102 L20 102 Z', '#c86a5a', null), rect(32, 84, 56, 20, C.white, 1, C.ink, 1),
    moving('pho-fram', '0%,15%{opacity:0}75%,100%{opacity:1}', { dur: 3.4 }, clip(34, 86, 52, 16, rect(34, 86, 52, 16, '#d4d4d4', 0, null), house(60, 102, 0.6, '#9a9a9a', '#5a5a5a'), tree(44, 102, 0.4, '#7a7a7a', '#5a5a5a'))),
    line('M86 52 L76 86 M92 54 L80 86', '#9aa3ad', 2.2), path('M88 40 C98 40 104 50 98 58 L90 56 Z', C.skin, C.ink, 1.3)),
  /** mörkrum: a dark room lit by a red lamp; prints hang on a line with clothes pegs, and a table holds three trays and an enlarger. */
  'photo.mörkrum': all(rect(0, 0, 120, 120, '#2e1818', 0, null), circle(100, 14, 6, '#ff3a2a', C.ink, 1.2), circle(100, 14, 14, 'rgba(255,58,42,0.2)', null), path('M0 20 L120 60 L120 0 Z', 'rgba(255,58,42,0.06)', null),
    line('M4 26 Q60 34 116 26', '#8a7a6a', 1.4), ...[18, 40, 62, 84].map((x, i) => all(rect(x, 29 + (i % 2), 16, 20, '#e8e0d8', 1, C.ink, 1), rect(x + 2, 31 + (i % 2), 12, 14, ['#b4a8a0', '#9a8e86', '#a8a098', '#8c8078'][i]!, 0, null), rect(x + 6, 26 + (i % 2), 4, 6, '#c9a07a', 1, C.ink, 0.8))),
    rect(0, 86, 120, 34, '#4a3a30', 0, null), line('M0 86 L120 86', C.ink, 1.4), ...[14, 46, 78].map((x, i) => all(path(`M${x} 84 L${x + 26} 84 L${x + 24} 92 L${x + 2} 92 Z`, '#d8d8d8', C.ink, 1.2), path(`M${x + 3} 85 L${x + 23} 85 L${x + 22} 89 L${x + 4} 89 Z`, ['#c86a5a', '#a85a4a', '#c8785a'][i]!, null))),
    at(106, 84, 1, rect(-4, -40, 4, 40, '#555', 1, C.ink, 1), rect(-12, -40, 14, 10, '#555', 2, C.ink, 1), rect(-14, -2, 18, 4, '#555', 1, C.ink, 1))),

  // ── Fotografiska genrer ──
  /** naturfotografi: in a forest a photographer kneels behind a bush with a long lens on a tripod; at the right a fox stands in the grass. */
  'photo.naturfotografi': all(rect(0, 0, 120, 120, '#dcefd8', 0, null), rect(0, 92, 120, 28, '#7fb27a', 0, null), pine(10, 92, 1.2), pine(100, 92, 1.4), pine(78, 92, 0.9), fox(88, 104, 1.1),
    at(30, 112, 1, line('M-2 -30 L-6 0 M4 -30 L8 -2', C.ink, 7), line('M-2 -30 L-6 0 M4 -30 L8 -2', '#5a6a3a', 5), path('M-8 -58 L8 -58 L7 -30 L-7 -30 Z', '#6a7a4a', C.ink, 1.6), circle(0, -68, 9, C.skin, C.ink, 1.6), path('M-10 -70 C-10 -82 10 -82 10 -70 Z', '#6a7a4a', C.ink, 1.4)),
    tripod(46, 74, 112), sideCam(44, 70, 1, 20, 6), ellipse(40, 106, 18, 10, '#4f8a4a', C.ink, 1.2)),
  /** gatufotografi: a city street with houses; people walk past, one with an umbrella and one with a dog, and a photographer on the pavement takes a picture of them. */
  'photo.gatufotografi': all(rect(0, 0, 120, 120, '#e3e6ea', 0, null), rect(0, 12, 34, 82, '#d9b48a', 0, C.ink, 1.2), rect(34, 22, 30, 72, '#b8c4d0', 0, C.ink, 1.2), rect(64, 8, 30, 86, '#e0c9b0', 0, C.ink, 1.2), rect(94, 26, 26, 68, '#c4b0c8', 0, C.ink, 1.2),
    ...range(10).map((i) => rect(6 + (i % 5) * 22 + (i % 5 > 1 ? 4 : 0), 30 + Math.floor(i / 5) * 22, 8, 10, '#9ad0f0', 1, C.ink, 0.8)), rect(0, 94, 120, 26, '#a8a8a8', 0, null), line('M0 94 L120 94', C.ink, 1.2),
    fig(70, 0.5, { top: RED, armR: [[12, -60], [8, -80]] }, 110), path('M60 66 Q70 52 80 66 Z', '#2f4a7a', C.ink, 1.2), line('M74 66 L74 70', C.ink, 1.2),
    fig(96, 0.5, { top: C.yellow, hair: 'long', armR: [[12, -50], [20, -40]] }, 110), at(108, 110, 0.35, ellipse(0, -6, 10, 6, C.tan, C.ink, 2), circle(-10, -12, 6, C.tan, C.ink, 2)),
    shooterSide(26, 0.62, C.green, 114, 6)),
  /** sportfotografi: a football player kicks a ball towards a goal; behind the goal line a photographer kneels with a long lens. */
  'photo.sportfotografi': all(rect(0, 0, 120, 120, SKY, 0, null), rect(0, 70, 120, 50, '#5fa85a', 0, null), line('M0 96 L120 96', C.white, 1.6),
    rect(70, 46, 46, 30, 'none', 0, C.white, 2.6), line('M74 50 L112 50 M74 56 L112 56 M74 62 L112 62 M74 68 L112 68', C.white, 0.6),
    fig(36, 0.62, { top: RED, bottom: C.white, armL: [[-14, -60], [-22, -54]], armR: [[14, -58], [22, -66]], tilt: -8 }, 92), circle(58, 86, 4.4, C.white, C.ink, 1.2), path('M56 84 L60 86 L58 89', 'none', C.ink, 0.8),
    at(96, 112, 1, line('M-2 -18 L-8 0 M2 -18 L6 -4 L10 0', C.ink, 6), path('M-6 -40 L6 -40 L6 -18 L-6 -18 Z', C.navy, C.ink, 1.4), circle(0, -48, 7, C.skin, C.ink, 1.4), path('M-7 -50 C-7 -58 7 -58 7 -50 Z', C.hair, null)), at(92, 66, 1, g('scale(-1 1)', sideCam(0, 0, 0.8, 22, 5)))),
  /** dokumentärfotografi (symbol-like scene): three photos in a row on a wall tell one story about a fishing family over many years – the boy grows up – and an orange time arrow runs under them. */
  'photo.dokumentärfotografi': all(rect(0, 0, 120, 120, '#eee8dc', 0, null),
    ...[0, 1, 2].map((i) => photo(4 + i * 39, 26, 34, 48, all(rect(0, 0, 200, 200, '#b8d8ee', 0, null), rect(0, 58, 200, 20, '#5a8fc0', 0, null), boat(21 + i * 39, 58, 1.1, '#c0563f'), fig(15 + i * 39, 0.13, { top: C.yellow, eyes: false }, 58), fig(27 + i * 39, 0.12 + i * 0.03, { top: C.orange, eyes: false }, 58)), C.white)),
    arrow(8, 88, 112, 88, HL, 2.6), circle(21, 88, 2.6, C.white, C.ink, 1), circle(60, 88, 2.6, C.white, C.ink, 1), circle(99, 88, 2.6, C.white, C.ink, 1)),
  /** pressfotograf: three photographers crowd with cameras around a man who comes out of a door; the flashes go off, and the front photographer is ringed. */
  'photo.pressfotograf': all(rect(0, 0, 120, 120, '#e3e0da', 0, null), rect(70, 16, 40, 96, '#9a8a78', 2, C.ink, 1.4), rect(78, 30, 24, 82, '#5a4a3a', 1, C.ink, 1.2), rect(66, 8, 48, 10, '#c9bfae', 1, C.ink, 1.2), ground(),
    fig(90, 0.85, { top: C.navy, bottom: C.navy, mouth: 'flat', armL: [[-14, -60], [-16, -76]] }), path('M70 28 L76 34', 'none', null),
    shooterSide(20, 0.7, C.sky, 112, 10), shooterSide(40, 0.82, C.green, 112, 10), shooterSide(10, 0.6, C.purple, 112, 10), ring(42, 46, 14),
    sparkle(58, 44, 7, C.yellow), sparkle(36, 52, 5, C.yellow), sparkle(28, 62, 4, C.yellow)),
  /** bröllopsfotograf: a bride in white with a veil and a groom in a dark suit stand under an arch of flowers; a photographer in front of them takes a picture; the photographer is ringed. */
  'photo.bröllopsfotograf': all(rect(0, 0, 120, 120, '#f3ece4', 0, null), ground(), path('M60 12 C90 12 104 40 104 112 L98 112 C98 44 86 20 60 20 C34 20 22 44 22 112 L16 112 C16 40 30 12 60 12 Z', '#9ac090', C.ink, 1.2),
    ...range(7).map((i) => flower(f1(60 + Math.cos(Math.PI * (0.1 + i * 0.13)) * 40), f1(52 - Math.sin(Math.PI * (0.1 + i * 0.13)) * 36), 0.5, i % 2 ? '#ffffff' : C.pink)),
    fig(50, 0.72, { dress: '#fbfbf8', hair: 'bun', extra: path('M-10 -92 C-20 -80 -20 -40 -16 -20 L-8 -60 Z', 'rgba(255,255,255,0.85)', C.ink, 0.8) }, 100), fig(72, 0.75, { top: C.black, bottom: C.black, front: path('M-2 -64 L2 -64 L1 -52 L-1 -52 Z', C.white, null) }, 100),
    shooterSide(96, 0.55, C.orange, 116, 6, true), g('translate(0 0)', ring(96, 70, 14))),
  /** fotobok: an open book on a table; both pages are full of photos – a beach, a house, a family and a mountain. */
  'photo.fotobok': all(rect(0, 0, 120, 120, '#efe9df', 0, null), rect(0, 96, 120, 24, '#c9a07a', 0, null), path('M60 28 C44 22 22 22 8 26 L8 92 C22 88 44 88 60 94 C76 88 98 88 112 92 L112 26 C98 22 76 22 60 28 Z', '#fbfbf6', C.ink, 1.8), line('M60 28 L60 94', C.grey, 1.2),
    photo(14, 32, 20, 18, all(rect(0, 0, 200, 200, SKY, 0, null), rect(0, 42, 200, 10, '#f0d8a0', 0, null), sunC(28, 38, 2))), photo(36, 34, 20, 26, scenery(39, 37, 14, 20)),
    photo(14, 56, 40, 28, all(rect(0, 0, 200, 200, '#d8ecd0', 0, null), fig(26, 0.18, { top: C.orange, hair: 'long', eyes: false }, 80), fig(34, 0.2, { top: C.green, eyes: false }, 80), fig(42, 0.13, { top: RED, eyes: false }, 80))),
    photo(64, 32, 42, 30, all(rect(0, 0, 200, 200, SKY, 0, null), path('M67 59 L80 40 L88 50 L94 42 L103 59 Z', '#8a9aaa', C.ink, 1), path('M80 40 L84 46 L76 46 Z M94 42 L97 46 L91 46 Z', C.white, null))), photo(66, 66, 38, 20, all(rect(0, 0, 200, 200, '#6aa8d8', 0, null), boat(85, 80, 0.6)))),
};
