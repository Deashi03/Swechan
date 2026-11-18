/**
 * Matematik & naturvetenskap → Astronomi & rymd → Himlens rörelser, 3621–3627 (0.53): day and seasons, the phases of
 * the moon, solar and lunar eclipses, constellations, planetary orbits, the ecliptic and timekeeping by the sky.
 * Recurring signs: the sun is a yellow disc with rays, the earth a blue disc with green land, the moon a pale disc whose
 * lit part is drawn exactly for its phase; the night sky is dark blue with small white stars. The part the word names is
 * ringed or framed in orange, and a grey copy shows what the word is not.
 * Close words share one layout where only the marked part differs: dagsida/nattsida (the lit or the dark half of the
 * same earth), sommarhalvår/vinterhalvår (the same year wheel), tilltagande/avtagande (three moons growing or shrinking),
 * total/partiell/ringformig (the same eclipse, with a strip of all three below), kärnskugga/halvskugga (the same shadow
 * diagram), ljusstark/ljussvag (the same two stars), perihelium/aphelium (the same ellipse), motsols/medsols (the same orbit, arrow reversed),
 * himmelsekvator/ekliptika/vårpunkt (the same sphere with two circles).
 * Digits and maths signs only; no words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const PAPER = '#f6f2ea';
const DAY = '#d6ecf7';
const NIGHT = '#1f2a4a';
const DUSK = '#f3c98b';
const MOON = '#f3ecc8';
const MOON_D = '#4a5170';
const SUN = '#f6c445';
const SEA = '#3f7fc4';
const LAND = '#5fae5a';
const GRASS = '#7fb85e';
const HILL = '#2c3a5c';
const RED = '#d8343a';
const BLOOD = '#a5402a';
const WHITE = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const night = () => bg(NIGHT);
const ring = (x: number, y: number, rx: number, ry = rx, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const cross = (x: number, y: number, r = 5, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const panel = (x: number, y: number, w: number, h: number, col: string = WHITE) => rect(x, y, w, h, col, 3, C.ink, 1.4);
/** Digits / maths signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const pol = (x: number, y: number, r: number, a: number) => [f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r)] as const;

// ── Sky objects ──────────────────────────────────────────────────────
const dot = (x: number, y: number, r = 1.1, col: string = WHITE) => circle(x, y, r, col, null);
/** Small four-pointed star. */
const twinkle = (x: number, y: number, r = 3, col: string = WHITE) => path(`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`, col, null);
const STARS: Array<[number, number]> = [[12, 12], [26, 22], [40, 10], [58, 18], [74, 8], [90, 20], [106, 12], [18, 36], [50, 32], [84, 38], [104, 32], [32, 46], [66, 44], [12, 56], [96, 54]];
const stars = (n = STARS.length, dy = 0) => all(...STARS.slice(0, n).map(([x, y], i) => dot(x, y + dy, i % 3 === 0 ? 1.4 : 0.9)));
const sun = (x: number, y: number, r = 9, rays = true) => all(
  ...(rays ? range(12).map((i) => { const a = (i / 12) * Math.PI * 2; const [x1, y1] = pol(x, y, r + 3, a); const [x2, y2] = pol(x, y, r + 7, a); return line(`M${x1} ${y1} L${x2} ${y2}`, C.gold, 2); }) : []),
  circle(x, y, r, SUN, C.ink, 1.4));
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, SEA, C.ink, 1.6),
  path(`M${f1(x - r * 0.5)} ${f1(y - r * 0.6)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.2)} ${f1(y - r * 0.4)} ${f1(x - r * 0.05)} ${f1(y - r * 0.1)} C${f1(x - r * 0.3)} ${f1(y + r * 0.2)} ${f1(x - r * 0.1)} ${f1(y + r * 0.6)} ${f1(x - r * 0.35)} ${f1(y + r * 0.7)} C${f1(x - r * 0.7)} ${f1(y + r * 0.3)} ${f1(x - r * 0.8)} ${f1(y - r * 0.2)} ${f1(x - r * 0.5)} ${f1(y - r * 0.6)} Z`, LAND, null),
  path(`M${f1(x + r * 0.3)} ${f1(y - r * 0.2)} C${f1(x + r * 0.7)} ${f1(y - r * 0.4)} ${f1(x + r * 0.8)} ${f1(y + r * 0.1)} ${f1(x + r * 0.55)} ${f1(y + r * 0.45)} C${f1(x + r * 0.35)} ${f1(y + r * 0.3)} ${f1(x + r * 0.2)} ${f1(y + r * 0.05)} ${f1(x + r * 0.3)} ${f1(y - r * 0.2)} Z`, LAND, null),
  circle(x, y, r, 'none', C.ink, 1.6));
const craters = (x: number, y: number, r: number) => all(circle(f1(x - r * 0.3), f1(y - r * 0.25), f1(r * 0.18), 'rgba(0,0,0,0.08)', null), circle(f1(x + r * 0.25), f1(y + r * 0.3), f1(r * 0.22), 'rgba(0,0,0,0.08)', null), circle(f1(x + r * 0.35), f1(y - r * 0.35), f1(r * 0.1), 'rgba(0,0,0,0.08)', null));
/**
 * The moon in phase p (0 new, 0.25 first quarter lit on the right, 0.5 full, 0.75 last quarter lit on the left),
 * as seen from the northern hemisphere.
 */
const moon = (x: number, y: number, r: number, p: number, dark: string = MOON_D, lit: string = MOON) => {
  const q = ((p % 1) + 1) % 1;
  const base = circle(x, y, r, dark, C.ink, 1.2);
  if (q < 0.02 || q > 0.98) return base;
  if (Math.abs(q - 0.5) < 0.02) return all(circle(x, y, r, lit, C.ink, 1.2), craters(x, y, r));
  const t = f1(Math.abs(Math.cos(2 * Math.PI * q)) * r);
  const waxing = q < 0.5, gibbous = q > 0.25 && q < 0.75;
  const outer = waxing ? 1 : 0;
  const term = waxing ? (gibbous ? 1 : 0) : (gibbous ? 0 : 1);
  return all(base, path(`M${x} ${y - r} A${r} ${r} 0 0 ${outer} ${x} ${y + r} A${t} ${r} 0 0 ${term} ${x} ${y - r} Z`, lit, null), circle(x, y, r, 'none', C.ink, 1.2));
};
/** A ball lit from the left (or right): the lit half white, the other half dark. */
const halfLit = (x: number, y: number, r: number, side: 'left' | 'right', lit: string, dark: string) => all(circle(x, y, r, dark, null),
  path(side === 'left' ? `M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z` : `M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`, lit, null), circle(x, y, r, 'none', C.ink, 1.6));
const halfRing = (x: number, y: number, r: number, side: 'left' | 'right') => path(side === 'left' ? `M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z` : `M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`, 'none', HL, 2.8);
const hills = (y = 96, col: string = HILL) => path(`M4 ${y} C20 ${y - 8} 34 ${y - 8} 50 ${y - 2} C66 ${y + 3} 84 ${y - 10} 116 ${y - 4} L116 112 L4 112 Z`, col, null);
const sea = (y = 88) => all(rect(4, y, 112, 112 - y, '#26365e', 0, null), line(`M14 ${y + 6} l10 0 M40 ${y + 12} l12 0 M76 ${y + 8} l10 0 M92 ${y + 16} l8 0`, '#5d6f9e', 1.2));
const house = (x: number, y: number, s = 1, win: string = '#f6d36b') => at(x, y, s, rect(-10, -14, 20, 14, '#6b5a4a', 0, C.ink, 1), path('M-12 -14 L0 -24 L12 -14 Z', '#8a3b30', C.ink, 1), rect(-5, -10, 5, 5, win, 0, C.ink, 0.6));
/** Clock face with hands; h in hours (0–12), m minutes. */
const clock = (x: number, y: number, r: number, h: number, m: number, col: string = WHITE) => {
  const ah = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2, am = (m / 60) * Math.PI * 2 - Math.PI / 2;
  const [hx, hy] = pol(x, y, r * 0.5, ah), [mx, my] = pol(x, y, r * 0.78, am);
  return all(circle(x, y, r, col, C.ink, 1.4), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; const [x1, y1] = pol(x, y, r * 0.82, a), [x2, y2] = pol(x, y, r * 0.95, a); return line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 0.9); }),
    line(`M${x} ${y} L${hx} ${hy}`, C.ink, 1.8), line(`M${x} ${y} L${mx} ${my}`, C.ink, 1.2), circle(x, y, 1.2, C.ink, null));
};
const digital = (x: number, y: number, w: number, s: string, size = 11, hl?: { from: number; w: number }) => all(rect(x, y, w, size + 8, '#26303f', 3, C.ink, 1.4),
  hl ? rect(x + hl.from, y + 2, hl.w, size + 4, 'none', 2, HL, 2.4) : '', num(s, x + w / 2, y + size + 3, size, '#7cf0a0'));

// ── Shared layouts ───────────────────────────────────────────────────
/** Sun on the left, earth with a lit and a dark half. */
const dayNight = (side: 'left' | 'right') => all(bg(NIGHT), sun(16, 60, 10), ...[40, 52, 64, 76, 88].map((y) => line(`M30 ${y} L38 ${y}`, SUN, 1.6)),
  earth(78, 60, 32), path('M78 28 A32 32 0 0 1 78 92 Z', 'rgba(15,20,45,0.68)', null), circle(78, 60, 32, 'none', C.ink, 1.6),
  ...[[88, 50], [96, 66], [86, 76], [102, 56]].map(([x, y]) => dot(x!, y!, 1.1, '#ffd77a')), halfRing(78, 60, 35, side));
/** Year wheel: 12 sectors with digits, months a..b highlighted. */
const yearWheel = (months: number[], col: string, centre: Svg) => all(bg(), ...range(12).map((i) => {
  const a0 = ((i / 12) - 0.25) * Math.PI * 2, a1 = (((i + 1) / 12) - 0.25) * Math.PI * 2;
  const [x0, y0] = pol(60, 60, 46, a0), [x1, y1] = pol(60, 60, 46, a1), [tx, ty] = pol(60, 60, 37, (a0 + a1) / 2);
  const on = months.includes(i + 1);
  return all(path(`M60 60 L${x0} ${y0} A46 46 0 0 1 ${x1} ${y1} Z`, on ? col : C.grey2, C.ink, 1.1), num(String(i + 1), tx, ty + 3.5, 9, on ? C.ink : '#7d858e'));
}), circle(60, 60, 20, WHITE, C.ink, 1.4), centre);
const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => { const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1); return `M${x0} ${y0} A${r} ${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} 1 ${x1} ${y1}`; };
/** Arc with an arrowhead at the end; a1 > a0 runs clockwise on screen, a1 < a0 counter-clockwise. */
const arcArrow = (cx: number, cy: number, r: number, a0: number, a1: number, col: string = HL, sw = 3) => {
  const cw = a1 > a0, [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1);
  const big = Math.abs(a1 - a0) > Math.PI ? 1 : 0, t = a1 + (cw ? Math.PI / 2 : -Math.PI / 2), h = 8;
  const [bx, by] = [x1 - Math.cos(t) * h, y1 - Math.sin(t) * h];
  const p1 = pol(bx, by, 4.5, t + Math.PI / 2), p2 = pol(bx, by, 4.5, t - Math.PI / 2);
  return all(line(`M${x0} ${y0} A${r} ${r} 0 ${big} ${cw ? 1 : 0} ${f1(bx)} ${f1(by)}`, col, sw), path(`M${x1} ${y1} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} Z`, col, null));
};
const snowflake = (x: number, y: number, r: number, col = '#3f6fb5') => all(...range(3).map((i) => { const a = (i / 3) * Math.PI; const [x1, y1] = pol(x, y, r, a), [x2, y2] = pol(x, y, r, a + Math.PI); return line(`M${x1} ${y1} L${x2} ${y2}`, col, 2); }));
/** Three moons in a row. */
const phaseRow = (ps: number[], y = 48) => all(...ps.map((p, i) => moon(24 + i * 36, y, 13, p)));
const bars = (hs: number[]) => all(line('M10 104 L110 104', C.grey, 1.2), ...hs.map((h, i) => rect(17 + i * 36, 104 - h, 14, h, MOON, 1, C.ink, 1)));
/** Eclipse as seen: sun disc and moon disc; kind decides the overlap. */
const eclipseView = (x: number, y: number, r: number, kind: 'total' | 'partiell' | 'ringformig', glow = true) => {
  if (kind === 'total') return all(glow ? circle(x, y, r * 1.35, 'rgba(255,255,255,0.35)', null) : '', glow ? circle(x, y, r * 1.15, 'rgba(255,255,255,0.55)', null) : '', circle(x, y, r, '#15151c', C.ink, 1.2));
  if (kind === 'partiell') return all(circle(x, y, r, SUN, C.ink, 1.2), circle(f1(x + r * 0.55), f1(y - r * 0.35), r, '#15151c', null), circle(x, y, r, 'none', C.ink, 1.2));
  return all(circle(x, y, r, SUN, C.ink, 1.2), circle(x, y, f1(r * 0.82), '#15151c', null));
};
const eclipseStrip = (kind: 'total' | 'partiell' | 'ringformig') => all(panel(8, 86, 104, 24, '#c9d6e6'),
  ...(['total', 'partiell', 'ringformig'] as const).map((k, i) => (k === kind ? all(eclipseView(30 + i * 30, 98, 8, k, false), ring(30 + i * 30, 98, 11)) : greyed(eclipseView(30 + i * 30, 98, 8, k, false)))));
const eclipseBig = (kind: 'total' | 'partiell' | 'ringformig') => all(bg('#6f86a8'), eclipseView(60, 42, 26, kind), eclipseStrip(kind));
/** Shadow diagram: big sun left, small moon in the middle, umbra and penumbra to the right. */
const shadowDiagram = (mark: 'kärn' | 'halv') => all(bg('#e9eef4'), sun(10, 60, 24, false),
  path('M50 52 L112 26 L112 94 L50 68 Z', '#b4bcc8', null), path('M50 52 L96 60 L50 68 Z', '#3b4152', null),
  line('M10 36 L112 94 M10 84 L112 26', C.grey, 0.8, '3 2'), line('M10 36 L96 60 M10 84 L96 60', C.grey, 0.8, '3 2'),
  circle(50, 60, 8, MOON_D, C.ink, 1.3), path('M112 18 C100 40 100 80 112 102', 'none', C.ink, 0),
  path('M106 18 C96 40 96 80 106 102 L116 102 L116 18 Z', '#6aa8d8', C.ink, 1.2),
  mark === 'kärn' ? path('M58 54 L94 60 L58 66 Z', 'none', HL, 2.6) : all(path('M60 51 L110 30 L110 50 L84 56 Z', 'none', HL, 2.6), path('M60 69 L110 90 L110 70 L84 64 Z', 'none', HL, 2.6)));
const twoStars = (mark: 'stark' | 'svag') => all(night(), stars(9), sun(36, 58, 10, true).replace(/#f6c445/g, '#fffbe6').replace(new RegExp(C.gold, 'g'), '#fff3b0'), circle(36, 58, 16, 'rgba(255,250,220,0.25)', null),
  circle(86, 60, 2.6, '#d9dcef', null), mark === 'stark' ? ring(36, 58, 24) : ring(86, 60, 9),
  rect(14, 92, 44, 8, '#4a5684', 2, null), rect(14, 92, 40, 8, '#fff3b0', 2, null), rect(64, 92, 44, 8, '#4a5684', 2, null), rect(64, 92, 8, 8, '#d9dcef', 2, null));
/** Elliptic orbit with the sun at the left focus. */
const ellipseOrbit = () => all(night(), stars(6), ellipse(60, 60, 50, 32, 'none', '#8a93b5', 1.4), sun(30, 60, 8, false));
/** The celestial sphere with the earth inside; both circles drawn, one marked. */
const sphere = (mark: 'ekvator' | 'ekliptika' | 'vårpunkt') => {
  const eq = ellipse(60, 60, 46, 12, 'none', mark === 'ekvator' ? HL : '#8a93b5', mark === 'ekvator' ? 3 : 1.4);
  const ec = g('rotate(-23 60 60)', ellipse(60, 60, 46, 12, 'none', mark === 'ekliptika' ? HL : '#8a93b5', mark === 'ekliptika' ? 3 : 1.4, ));
  const [vx, vy] = [14.6, 62];
  return all(night(), circle(60, 60, 48, '#2a3860', '#8a93b5', 1.4), stars(15), earth(60, 60, 9), line('M60 46 L60 74', C.grey2, 1.2), eq, ec,
    mark === 'ekliptika' ? sun(102.3, 42, 5, false) : '',
    mark === 'vårpunkt' ? all(sun(vx, vy, 5, false), ring(vx, vy, 9)) : '');
};

export const SKYMOT_MOTIFS: Record<string, Svg> = {
  // ── Dygn och årstider ──────────────────────────────────────────────
  'himrel.dagsida': dayNight('left'),
  'himrel.nattsida': dayNight('right'),
  'himrel.gryning': all(bg('#2b3a66'), rect(4, 52, 112, 30, '#7d86b4', 0, null), rect(4, 66, 112, 16, '#e6a98a', 0, null), rect(4, 74, 112, 8, DUSK, 0, null),
    dot(20, 14, 1.2), dot(52, 22, 0.9), dot(92, 12, 1.2), dot(104, 30, 0.8), circle(30, 28, 6, MOON, null), circle(33, 26, 6, '#2b3a66', null),
    path('M60 82 m-16 0 a16 16 0 0 1 32 0 Z', 'rgba(246,196,69,0.45)', null), hills(84, '#24304f'), line('M60 98 L60 88', '#f6d36b', 2, '2 2'), arrow(60, 100, 60 , 90, '#f6d36b', 2),
    house(26, 104, 1, '#f6d36b'), digital(78, 92, 34, '5:00', 10)),
  'himrel.dagsljus': all(bg('#efe6d6'), rect(4, 96, 112, 16, '#c9a77a', 0, null), panel(14, 18, 40, 46, DAY), sun(34, 32, 6), line('M34 18 L34 64 M14 41 L54 41', '#8a6a4a', 2.2),
    path('M14 64 L54 64 L104 100 L42 100 Z', 'rgba(255,236,150,0.6)', null), rect(56, 82, 48, 6, '#a0673d', 1, C.ink, 1.2), line('M62 88 L62 100 M98 88 L98 100', '#7a5232', 2.4), rect(70, 76, 16, 6, WHITE, 1, C.ink, 1),
    greyed(line('M90 4 L90 18', C.ink, 1.2), path('M82 18 L98 18 L94 26 L86 26 Z', '#f2d05a', C.ink, 1.2)), cross(90, 30, 4), frame(10, 14, 48, 54)),
  'himrel.sommarhalvår': all(yearWheel([4, 5, 6, 7, 8, 9], SUN, sun(60, 60, 8)), path(arcPath(60, 60, 50, -Math.PI / 2 + Math.PI / 2, Math.PI / 2 + Math.PI / 2 - 0.0001), 'none', HL, 3)),
  'himrel.vinterhalvår': all(yearWheel([10, 11, 12, 1, 2, 3], '#7fa7d8', snowflake(60, 60, 10)), path(arcPath(60, 60, 50, Math.PI / 2, Math.PI * 1.5 - 0.0001), 'none', HL, 3)),
  // ── Månens faser ───────────────────────────────────────────────────
  'himrel.månfas': all(night(), ...[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875].map((p, i) => moon(18 + (i % 4) * 28, i < 4 ? 42 : 82, 11, p)),
    ...[0, 1, 2].map((i) => arrow(31 + i * 28, 42, 35 + i * 28, 42, '#8a93b5', 1.4)), ...[0, 1, 2].map((i) => arrow(31 + i * 28, 82, 35 + i * 28, 82, '#8a93b5', 1.4)), frame(4, 24, 112, 76)),
  'himrel.månskära': all(night(), stars(12), moon(70, 40, 18, 0.1, '#2b3762'), sea(84), line('M68 92 l6 0 M64 100 l12 0', MOON, 1.2)),
  'himrel.halvmåne': all(night(), stars(12), moon(60, 46, 24, 0.25, '#2b3762'), hills(96)),
  'himrel.fullmåne': all(night(), stars(12), circle(60, 46, 32, 'rgba(243,236,200,0.12)', null), moon(60, 46, 24, 0.5), hills(96)),
  'himrel.tilltagande': all(bg(NIGHT), phaseRow([0.08, 0.2, 0.36]), arrow(16, 72, 104, 72, HL, 2.6), bars([8, 18, 30]), frame(6, 28, 108, 82)),
  'himrel.avtagande': all(bg(NIGHT), phaseRow([0.64, 0.8, 0.92]), arrow(16, 72, 104, 72, HL, 2.6), bars([30, 18, 8]), frame(6, 28, 108, 82)),
  'himrel.belyst': all(bg('#3b3f52'), at(18, 60, 1, rect(-12, -6, 18, 12, '#c9ced4', 2, C.ink, 1.3), path('M6 -9 L12 -12 L12 12 L6 9 Z', '#9aa3ad', C.ink, 1.2)),
    path('M30 48 L76 34 L76 86 L30 72 Z', 'rgba(255,240,170,0.35)', null), halfLit(80, 60, 22, 'left', '#fff6c8', '#4a4f66'), halfRing(80, 60, 25, 'left')),
  'himrel.månens-baksida': all(night(), stars(10), earth(20, 60, 12), at(20, 56, 1, ellipse(0, 0, 4, 2.6, WHITE, C.ink, 0.8), circle(0, 0, 1.4, C.ink, null)), line('M30 56 L66 58', '#e8e8f8', 1.2, '3 3'),
    circle(84, 60, 18, MOON, C.ink, 1.4), craters(84, 60, 18), path('M84 42 A18 18 0 0 1 84 78 Z', '#8a90a8', null), circle(84, 60, 18, 'none', C.ink, 1.4), halfRing(84, 60, 21, 'right'), num('?', 108, 64, 12, HL)),
  'himrel.månuppgång': all(bg('#3a4a7a'), rect(4, 56, 112, 30, '#55669a', 0, null), dot(18, 14, 1.2), dot(50, 22, 0.9), dot(96, 16, 1.1),
    moon(60, 80, 20, 0.5, MOON_D, '#f5dfae'), hills(80, '#1f2a4a'), arrow(60, 52, 60, 34, HL, 2.6), sea(96)),
  // ── Sol- och månförmörkelse ────────────────────────────────────────
  'himrel.solförmörkelse': all(night(), sun(14, 30, 9, false), line('M24 30 L50 30', C.grey, 1, '2 2'), circle(56, 30, 4, MOON_D, '#8a93b5', 1), path('M58 27 L94 29 L94 31 L58 33 Z', 'rgba(0,0,0,0.55)', null),
    earth(100, 30, 10), circle(91.5, 30, 3, '#0d1020', null), ring(91.5, 30, 6), panel(24, 54, 72, 52, '#7d93b8'), eclipseView(60, 80, 16, 'partiell'), ring(60, 80, 22)),
  'himrel.månförmörkelse': all(night(), stars(8), sun(14, 60, 11, false), line('M27 60 L44 60', C.grey, 1, '2 2'), earth(56, 60, 12),
    path('M64 51 L112 56 L112 64 L64 69 Z', 'rgba(0,0,0,0.6)', null), circle(98, 60, 7, '#5a5d6a', '#8a93b5', 1.2), ring(98, 60, 11),
    greyed(circle(98, 96, 7, MOON, C.ink, 1), circle(98, 24, 7, MOON, C.ink, 1)), line('M98 32 L98 50 M98 70 L98 88', '#8a93b5', 1, '2 2')),
  'himrel.total': all(bg(), greyed(circle(30, 58, 20, WHITE, C.ink, 1.4), path('M30 58 L30 38 A20 20 0 1 1 11 64.2 Z', '#e8a050', C.ink, 1.2), num('60 %', 30, 96, 10)),
    circle(80, 58, 28, '#e8a050', C.ink, 1.6), num('100 %', 80, 62, 11, WHITE), ring(80, 58, 33)),
  'himrel.partiell': eclipseBig('partiell'),
  'himrel.ringformig': all(eclipseBig('ringformig'), ring(60, 42, 30)),
  'himrel.kärnskugga': shadowDiagram('kärn'),
  'himrel.halvskugga': shadowDiagram('halv'),
  'himrel.blodmåne': all(night(), stars(12), circle(60, 44, 30, 'rgba(165,64,42,0.18)', null), circle(60, 44, 22, BLOOD, C.ink, 1.3), circle(52, 38, 4, 'rgba(0,0,0,0.15)', null), circle(67, 52, 5, 'rgba(0,0,0,0.15)', null),
    hills(98), figure({ x: 34, h: 0.34, top: '#5a6a9a', bottom: '#2f3a5a' }), figure({ x: 88, h: 0.32, top: '#9a5a6a', bottom: '#2f3a5a', hairStyle: 'long' })),
  'himrel.korona': all(bg('#24304f'), ...range(16).map((i) => { const a = (i / 16) * Math.PI * 2; const len = i % 2 ? 30 : 44; const [x1, y1] = pol(60, 58, 20, a), [x2, y2] = pol(60, 58, len, a + 0.08); return path(`M${x1} ${y1} Q${pol(60, 58, len * 0.7, a - 0.12).join(' ')} ${x2} ${y2}`, 'none', 'rgba(255,255,255,0.7)', 2.4); }),
    circle(60, 58, 26, 'rgba(255,255,255,0.45)', null), circle(60, 58, 20, '#101016', C.ink, 1.2), ellipse(60, 58, 50, 46, 'none', HL, 2.6), circle(60, 58, 23, 'none', HL, 1.2, )),
  'himrel.solskiva': all(bg(DAY), rect(4, 92, 112, 20, GRASS, 0, null), circle(60, 50, 26, SUN, C.ink, 1.6), circle(60, 50, 30, 'none', HL, 2.6), line('M34 50 L86 50', C.gold, 1.4, '3 2'),
    line('M60 50 L60 24', C.gold, 1.4, '3 2')),
  'himrel.förmörkelseglasögon': all(bg('#8aa3c8'), eclipseView(92, 22, 10, 'partiell'), circle(50, 66, 28, C.skin, C.ink, 1.8), path('M22 60 C20 30 80 30 78 60 C70 46 30 46 22 60 Z', C.hair, C.ink, 1.6),
    rect(22, 58, 56, 16, WHITE, 3, C.ink, 1.4), rect(27, 60, 19, 12, '#141418', 3, null), rect(54, 60, 19, 12, '#141418', 3, null), line('M36 86 Q50 90 64 86', C.ink, 1.4),
    line('M50 34 L84 24', '#fff3b0', 1, '3 3'), ring(50, 66, 34, 14)),
  'himrel.mörkna': all(bg(), ...[DAY, '#7d93b8', '#2b3a66'].map((col, i) => all(rect(8 + i * 36, 24, 32, 60, col, 3, C.ink, 1.2), rect(8 + i * 36, 72, 32, 12, i === 2 ? '#30402e' : GRASS, 0, null),
    circle(24 + i * 36, 64, 7, i === 2 ? '#2a3a2a' : '#4f9d4a', null), line(`M${24 + i * 36} 70 L${24 + i * 36} 78`, '#5a3a22', 2))), arrow(12, 96, 108, 96, HL, 2.6)),
  // ── Stjärnbilder ───────────────────────────────────────────────────
  'himrel.stjärnbild': all(night(), stars(15),
    line('M30 40 L48 30 L66 38 L84 28 M48 30 L52 58 L44 86 M52 58 L70 84 M52 58 L72 60', '#9fb4e6', 1.4),
    ...[[30, 40], [48, 30], [66, 38], [84, 28], [52, 58], [44, 86], [70, 84], [72, 60]].map(([x, y]) => twinkle(x!, y!, 3.4)), frame(20, 20, 74, 76)),
  'himrel.fixstjärna': all(bg(), ...[0, 1].map((k) => all(rect(8 + k * 54, 18, 50, 70, NIGHT, 3, C.ink, 1.2), ...[[18, 32], [34, 28], [44, 46], [24, 58], [40, 74]].map(([x, y]) => twinkle(8 + k * 54 + x!, y!, 2.8)),
    circle(8 + k * 54 + (k ? 38 : 14), k ? 60 : 74, 2.6, '#e8a060', null), ring(8 + k * 54 + 34, 28, 6), num(String(k + 1), 33 + k * 54, 102, 11))), line('M22 82 C40 76 46 66 54 60', '#e8a060', 1, '2 2')),
  'himrel.ljusstark': twoStars('stark'),
  'himrel.ljussvag': twoStars('svag'),
  'himrel.Karlavagnen': all(night(), stars(10), line('M14 46 L32 50 L48 56 L62 66 L66 88 L94 92 L98 70 L62 66', '#9fb4e6', 1.4), ...[[14, 46], [32, 50], [48, 56], [62, 66], [66, 88], [94, 92], [98, 70]].map(([x, y]) => twinkle(x!, y!, 4.2)), hills(104)),
  'himrel.stjärnklar': all(bg(), rect(8, 14, 50, 82, NIGHT, 3, C.ink, 1.2), ...STARS.slice(0, 12).map(([x, y]) => dot(8 + x * 0.42, 16 + y * 1.1, 1)), twinkle(24, 30, 3), twinkle(44, 22, 3), house(33, 96, 1), frame(5, 11, 56, 88),
    greyed(rect(62, 14, 50, 82, '#3d4560', 3, C.ink, 1.2), ellipse(80, 34, 16, 8, '#7a8090', null), ellipse(96, 44, 16, 9, '#7a8090', null), ellipse(82, 54, 18, 8, '#7a8090', null), house(87, 96, 1))),
  'himrel.tindra': all(night(), ...[9, 3.5, 9].map((r, i) => all(rect(8 + i * 36, 34, 32, 52, '#26335a', 3, '#5d6f9e', 1), twinkle(24 + i * 36, 60, r * 1.4, '#fffbe6'), circle(24 + i * 36, 60, r * 0.45, '#fffbe6', null))),
    arrow(14, 98, 106, 98, HL, 2.4), frame(5, 30, 110, 60)),
  'himrel.ljusförorening': all(night(), ...STARS.slice(0, 15).filter(([x]) => x > 60).map(([x, y]) => dot(x, y, 1.2)), path('M4 112 L4 50 C20 30 50 30 66 50 L66 112 Z', 'rgba(240,160,70,0.45)', null),
    ...[[6, 76, 10, 36], [18, 66, 12, 46], [32, 80, 10, 32], [44, 70, 14, 42]].map(([x, y, w, h]) => all(rect(x!, y!, w!, h!, '#3a3f55', 0, C.ink, 1), ...range(3).map((j) => rect(x! + 3, y! + 5 + j * 9, 3, 3, '#f6d36b', 0, null)))),
    hills(104, '#1a2340'), path('M2 112 L2 46 C20 22 52 22 68 46', 'none', HL, 2.6)),
  'himrel.stjärnskådning': all(night(), stars(15), rect(4, 90, 112, 22, '#2f4a33', 0, null), path('M18 96 L100 96 L106 108 L12 108 Z', '#b04a4a', C.ink, 1.2),
    at(46, 98, 1.5, ellipse(0, 0, 18, 5, '#5a6a9a', C.ink, 1.2), circle(-20, -2, 6, C.skin, C.ink, 1.2), path('M-26 -4 C-26 -10 -16 -10 -15 -4 Z', C.hair, null), rect(-24, -13, 4, 6, C.dark, 1, C.ink, 0.8), rect(-19, -13, 4, 6, C.dark, 1, C.ink, 0.8), line('M-12 -2 L-18 -8', '#5a6a9a', 3)),
    at(82, 102, 1.3, ellipse(0, 0, 16, 5, '#c07a4a', C.ink, 1.2), circle(18, -2, 6, C.skin, C.ink, 1.2), path('M24 -4 C24 -10 14 -10 13 -4 Z', '#6a4a2c', null)),
    line('M17 80 L26 50 M106 94 L96 56', '#d6dcf2', 0.8, '2 3')),
  'himrel.stjärnkarta': all(bg('#2a3150'), rect(18, 20, 84, 70, '#1f3a6a', 3, C.ink, 1.6), circle(60, 55, 30, 'none', '#9fb4e6', 0.8), line('M30 55 L90 55 M60 25 L60 85', '#9fb4e6', 0.6, '2 2'),
    line('M40 40 L50 46 L58 44 L62 54 L76 56 L80 66 M66 70 L74 76 L84 72', WHITE, 1), ...[[40, 40], [50, 46], [58, 44], [62, 54], [76, 56], [80, 66], [66, 70], [74, 76], [84, 72]].map(([x, y]) => circle(x!, y!, 1.8, WHITE, null)),
    at(14, 92, 1, path('M0 -8 C6 -10 12 -8 12 0 C12 6 4 8 0 6 Z', C.skin, C.ink, 1.2)), at(106, 92, 1, path('M0 -8 C-6 -10 -12 -8 -12 0 C-12 6 -4 8 0 6 Z', C.skin, C.ink, 1.2)),
    rect(86, 98, 22, 8, C.dark, 2, C.ink, 1), path('M86 98 L70 88 L70 112 L86 106 Z', 'rgba(220,60,60,0.35)', null)),
  'himrel.planetarium': all(bg('#141a30'), path('M8 74 A52 52 0 0 1 112 74 Z', '#1f2a4a', C.ink, 1.6), ...STARS.slice(0, 13).map(([x, y]) => dot(14 + x * 0.8, 70 - (60 - y) * 0.7 - 2, 1)),
    line('M36 40 L48 34 L58 42 M70 30 L80 36 L88 30', '#9fb4e6', 1), rect(54, 74, 12, 10, C.dark, 2, C.ink, 1.2), circle(60, 72, 5, '#3d3f4a', C.ink, 1.2),
    ...range(2).map((r) => all(...range(6).map((i) => all(circle(14 + i * 18 + (r ? 9 : 0), 92 + r * 12, 5, '#2b2a33', null), rect(8 + i * 18 + (r ? 9 : 0), 96 + r * 12, 12, 8, '#7a3a3a', 2, null))))), line('M8 74 L112 74', C.ink, 1.6)),
  // ── Planeternas banor ──────────────────────────────────────────────
  'himrel.motsols': all(night(), stars(6), circle(60, 56, 34, 'none', '#8a93b5', 1.2), sun(60, 56, 8, false), earth(94, 56, 5),
    arcArrow(60, 56, 40, 0.3, -1.6), greyed(clock(100, 98, 10, 2, 0), path(arcPath(100, 98, 13, -1.2, 0.4), 'none', C.ink, 1.4))),
  'himrel.medsols': all(night(), stars(6), circle(60, 56, 34, 'none', '#8a93b5', 1.2), sun(60, 56, 8, false), earth(94, 56, 5),
    arcArrow(60, 56, 40, -0.3, 1.6), greyed(clock(100, 98, 10, 2, 0), path(arcPath(100, 98, 13, -1.2, 0.4), 'none', C.ink, 1.4))),
  'himrel.elliptisk': all(ellipseOrbit(), greyed(circle(60, 60, 38, 'none', C.grey2, 1.4, )), ellipse(60, 60, 50, 32, 'none', HL, 3), circle(110, 60, 4, '#d0603a', C.ink, 0.9)),
  'himrel.perihelium': all(ellipseOrbit(), circle(10, 60, 4.4, '#7fb3e6', C.ink, 0.9), line('M14 60 L22 60', HL, 1.6), ring(10, 60, 8), greyed(circle(110, 60, 4.4, '#7fb3e6', C.ink, 0.9))),
  'himrel.aphelium': all(ellipseOrbit(), circle(110, 60, 4.4, '#7fb3e6', C.ink, 0.9), line('M38 60 L104 60', HL, 1.6, '4 2'), ring(110, 60, 8), greyed(circle(10, 60, 4.4, '#7fb3e6', C.ink, 0.9))),
  'himrel.banhastighet': all(ellipseOrbit(), circle(16, 42, 4.4, '#7fb3e6', C.ink, 0.9), arrow(18, 38, 40, 24, HL, 3), circle(104, 76, 4.4, '#7fb3e6', C.ink, 0.9), arrow(102, 80, 94, 86, HL, 3),
    at(60, 100, 1, path('M-14 0 A14 14 0 0 1 14 0', 'none', WHITE, 2), line('M0 0 L9 -8', HL, 2), circle(0, 0, 1.8, WHITE, null))),
  'himrel.retrograd-rörelse': all(night(), stars(15), path('M8 82 C30 74 44 66 56 58 C70 48 76 60 66 66 C56 72 52 56 66 48 C80 40 96 36 112 30', 'none', '#9fb4e6', 1.4, ),
    ...[[8, 82], [30, 74], [56, 58], [70, 56], [62, 62], [66, 48], [96, 36]].map(([x, y]) => circle(x!, y!, 2.6, '#e07a4a', null)), path('M72 56 C70 62 64 66 60 62', 'none', HL, 3), path('M57 58 L60 66 L64 59 Z', HL, null), frame(48, 40, 34, 34)),
  // ── Ekliptikan ─────────────────────────────────────────────────────
  'himrel.himmelssfär': all(night(), circle(60, 60, 48, '#2a3860', null), stars(15), ellipse(60, 60, 48, 13, 'none', '#5d6f9e', 1), ellipse(60, 60, 13, 48, 'none', '#5d6f9e', 1), earth(60, 60, 8), circle(60, 60, 48, 'none', HL, 3)),
  'himrel.zenit': all(bg('#2a3860'), path('M4 96 A56 82 0 0 1 116 96 Z', '#1f2a4a', null), stars(12), rect(4, 96, 112, 16, '#2f4a33', 0, null), figure({ x: 60, h: 0.42, top: '#5a6a9a', bottom: '#2f3a5a' }),
    line('M60 74 L60 20', WHITE, 1.2, '3 3'), twinkle(60, 16, 5, '#fffbe6'), ring(60, 16, 9), greyed(line('M8 96 L112 96', WHITE, 1.2))),
  'himrel.himmelspol': all(night(), circle(60, 64, 46, '#2a3860', '#8a93b5', 1.4), ellipse(60, 64, 46, 12, 'none', '#5d6f9e', 1), earth(60, 64, 9), line('M60 98 L60 18', C.grey2, 1.4, '3 2'),
    ...[7, 13, 19].map((r) => ellipse(60, 22, r, r * 0.45, 'none', '#9fb4e6', 1.1)), ...[[67, 22], [47, 23], [72, 26], [41, 21]].map(([x, y]) => dot(x!, y!, 1.3)), circle(60, 18, 2.6, '#fffbe6', null), ring(60, 18, 6)),
  'himrel.himmelsekvator': sphere('ekvator'),
  'himrel.ekliptika': sphere('ekliptika'),
  'himrel.vårpunkt': all(night(), circle(60, 60, 48, '#2a3860', '#8a93b5', 1.4), stars(15), earth(60, 60, 9), ellipse(60, 60, 46, 12, 'none', '#7fb3e6', 1.8), g('rotate(-23 60 60)', ellipse(60, 60, 46, 12, 'none', '#e8c37a', 1.8)),
    circle(14.6, 62, 3.2, WHITE, C.ink, 1), ring(14.6, 62, 9)),
  'himrel.djurkrets': all(night(), ellipse(60, 60, 50, 28, 'none', HL, 12), ellipse(60, 60, 50, 28, 'none', '#2a3860', 9),
    ...range(12).map((i) => { const [x, y] = [60 + Math.cos((i / 12) * Math.PI * 2) * 50, 60 + Math.sin((i / 12) * Math.PI * 2) * 28]; return all(twinkle(f1(x - 2), f1(y - 1.5), 2.2), twinkle(f1(x + 2.4), f1(y + 1.6), 1.8)); }),
    sun(60, 60, 6, false), circle(60, 60, 18, 'none', '#7fb3e6', 1), earth(78, 60, 3.4)),
  'himrel.stjärntecken': all(bg(), ...range(12).map((i) => { const [x, y] = pol(60, 52, 38, (i / 12) * Math.PI * 2 - Math.PI / 2); return i === 0 ? '' : greyed(circle(x, y, 7, NIGHT, null), twinkle(x - 2, y - 1, 2), twinkle(x + 2, y + 2, 1.6)); }),
    circle(60, 14, 9, NIGHT, C.ink, 1.2), twinkle(57, 12, 2.8), twinkle(62, 17, 2.2), twinkle(64, 10, 1.8), ring(60, 14, 12),
    at(60, 66, 1, rect(-14, -6, 28, 14, '#f3c0cf', 2, C.ink, 1.2), rect(-14, -6, 28, 4, WHITE, 2, null), line('M-6 -6 L-6 -14 M0 -6 L0 -14 M6 -6 L6 -14', C.ink, 1.4), path('M-6 -18 l1 3 l-2 0 Z M0 -18 l1 3 l-2 0 Z M6 -18 l1 3 l-2 0 Z', C.orange, null)),
    arrow(60, 46, 60, 28, HL, 2)),
  // ── Tidmätning med himlakroppar ────────────────────────────────────
  'himrel.solur': all(bg(DAY), sun(20, 18, 7), rect(4, 96, 112, 16, GRASS, 0, null), rect(50, 76, 20, 22, '#b9b2a4', 1, C.ink, 1.3), ellipse(60, 74, 40, 12, '#d8d1c2', C.ink, 1.5),
    ...range(7).map((i) => { const a = Math.PI + (i / 6) * Math.PI; const [x, y] = [60 + Math.cos(a) * 34, 74 + Math.sin(a) * 10]; return line(`M${f1(60 + Math.cos(a) * 26)} ${f1(74 + Math.sin(a) * 7.6)} L${f1(x)} ${f1(y)}`, C.ink, 1); }),
    path('M60 74 L60 56 L72 74 Z', '#7a7a80', C.ink, 1.2), path('M60 74 L92 80 L94 77 Z', 'rgba(40,40,50,0.55)', null)),
  'himrel.soltid': all(bg(DAY), rect(4, 96, 112, 16, GRASS, 0, null), line('M10 96 C30 30 90 30 110 96', C.grey, 1.2, '3 3'), sun(60, 44, 8), line('M60 56 L60 96', C.gold, 1, '2 2'),
    clock(28, 22, 14, 12, 0), ring(28, 22, 18), arrow(48, 40, 40, 32, HL, 2), greyed(clock(92, 22, 14, 12, 25))),
  'himrel.solår': all(bg(), circle(60, 60, 36, 'none', C.grey, 1.2), sun(60, 60, 9), earth(96, 60, 6), arcArrow(60, 60, 44, 0.2, Math.PI * 2 - 0.2),
    at(60, 18, 1, circle(0, 0, 4, '#ef9fb5', C.ink, 0.8), circle(0, 0, 1.6, SUN, null)), sun(24, 60, 4, false), at(60, 102, 1, path('M0 -5 C5 -5 6 2 0 6 C-6 2 -5 -5 0 -5 Z', '#e07a2c', C.ink, 0.8)), snowflake(96, 92, 5), num('365', 60, 64, 8)),
  'himrel.gregoriansk-kalender': all(bg(), rect(16, 22, 60, 74, WHITE, 3, C.ink, 1.6), rect(16, 22, 60, 16, RED, 3, C.ink, 1.6), num('1582', 46, 34, 11, WHITE), line('M30 18 L30 26 M62 18 L62 26', C.ink, 2.2),
    ...range(5).map((r) => all(...range(7).map((c) => rect(20 + c * 8, 44 + r * 10, 6, 7, r === 4 && c > 2 ? 'none' : '#e6e2d8', 1, null)))), earth(94, 70, 16), arrow(78, 58, 86, 62, HL, 2), frame(12, 18, 68, 82)),
  'himrel.sextant': all(bg(DAY), sun(98, 18, 7), rect(4, 70, 112, 42, SEA, 0, null), line('M4 70 L116 70', '#2e5590', 1.6),
    path('M10 112 L18 92 L78 92 L72 112 Z', '#a0673d', C.ink, 1.4), figure({ x: 46, h: 0.56, top: '#2f4a7a', bottom: '#2b2a33' }),
    at(56, 72, 1, path('M0 0 L22 -10 A24 24 0 0 1 24 4 Z', '#d4a373', C.ink, 1.2), line('M0 0 L20 -2', C.ink, 1.4), rect(-6, -3, 8, 5, C.dark, 1, C.ink, 0.8)),
    line('M58 70 L96 20', '#f6d36b', 1, '3 3'), line('M58 72 L112 70', WHITE, 1, '3 3'), ring(68, 68, 16, 12)),
  'himrel.skottsekund': all(bg(), digital(10, 40, 100, '23:59:60', 18, { from: 70, w: 26 }), num('+1', 84, 32, 14, HL), clock(30, 92, 12, 11, 59), greyed(digital(52, 86, 58, '23:59:59', 10))),
};
