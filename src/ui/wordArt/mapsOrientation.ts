/**
 * Natur & geografi → Världsgeografi → Kartor & orientering, 3001–3007 (0.47): cardinal directions,
 * map symbols, scale and distance, latitude and longitude, coordinate systems, contour lines and
 * reading a world map. Compass letters follow the Swedish convention N, Ö, S, V. Maps are seen from
 * above with north up; globes are seen straight from the side (latitudes as straight lines) or from
 * above the North Pole (meridians as spokes). Numbers and units may appear; no text names a word.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { HL, T, arm } from './people';
import { P, greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const SKY = '#d6ecf8';
const NIGHT = '#24314f';
const SEA = '#9fd0ee';
const SEA2 = '#5fa3d0';
const LAND = '#9ccf7a';
const LAND2 = '#5f9e48';
const PAPER = '#fbf6e6';
const FOREST = '#b9dea6';
const OPEN = '#f6dc6e';
const CONT = '#b5713a';
const ROADC = '#e8a33c';
const COLD = '#3c7fb0';
const WARM = '#e0603a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 9, col: string = C.ink) => T(x, y, s, size, col);
const rad = (d: number) => (d * Math.PI) / 180;
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** Arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const dbl = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 2.4) => all(arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, col, sw), arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, col, sw));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.6, -6, 3.2, 6, C.brown, 0, null), path('M0 -24 L8 -6 L-8 -6 Z', '#3f7d4e', C.ink, 1));
const treeTop = (x: number, y: number, r = 4) => circle(x, y, r, '#6fb05a', C.ink, 0.8);
const house = (x: number, y: number, s = 1, wall: string = '#f2e2c4', roof: string = '#c84a3a') => at(x, y, s, rect(-10, -12, 20, 12, wall, 0, C.ink, 1.2), path('M-12 -12 L0 -21 L12 -12 Z', roof, C.ink, 1.2), rect(-2.5, -7, 5, 7, C.brown, 0, null));
const sunR = (x: number, y: number, r = 7, col: string = C.yellow) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, col, C.ink, 1.2));
const flake = (x: number, y: number, r = 3, col: string = COLD) => line(`M${x - r} ${y} L${x + r} ${y} M${f1(x - r / 2)} ${f1(y - r * 0.87)} L${f1(x + r / 2)} ${f1(y + r * 0.87)} M${f1(x - r / 2)} ${f1(y + r * 0.87)} L${f1(x + r / 2)} ${f1(y - r * 0.87)}`, col, 1.3);
/** A paper map sheet with two faint folds. */
const sheet = (x: number, y: number, w: number, h: number, fill: string = PAPER) => all(rect(x, y, w, h, fill, 2, C.ink, 1.6), line(`M${x + w / 3} ${y} L${x + w / 3} ${y + h} M${x + (2 * w) / 3} ${y} L${x + (2 * w) / 3} ${y + h}`, 'rgba(0,0,0,0.12)', 1));

// ── Compass rose, compass and needle ─────────────────────────────────
type Dir = 'N' | 'Ö' | 'S' | 'V';
const DIRS: Dir[] = ['N', 'Ö', 'S', 'V'];
/** 8-point compass rose; hl rings one letter. */
const rose = (cx: number, cy: number, r: number, o: { hl?: Dir; fancy?: boolean; letters?: boolean } = {}) => {
  const out: Svg[] = [circle(cx, cy, r * 0.7, 'none', o.fancy ? C.gold : C.grey, o.fancy ? 1.6 : 1)];
  for (let i = 7; i >= 0; i--) {
    const long = i % 2 === 0, L = long ? r * 0.92 : r * 0.55, w = long ? r * 0.17 : r * 0.12;
    const dark = o.fancy ? (long ? '#c0392b' : C.navy) : long ? C.dark : C.grey;
    const light = o.fancy ? (long ? C.gold : '#9ab4d8') : long ? C.white : C.grey2;
    out.push(g(`rotate(${i * 45} ${cx} ${cy})`, path(`M${cx} ${f1(cy - L)} L${f1(cx + w)} ${f1(cy - w)} L${cx} ${cy} Z`, dark, C.ink, 0.8), path(`M${cx} ${f1(cy - L)} L${f1(cx - w)} ${f1(cy - w)} L${cx} ${cy} Z`, light, C.ink, 0.8)));
  }
  out.push(circle(cx, cy, r * 0.08, o.fancy ? C.gold : C.white, C.ink, 0.8));
  if (o.letters !== false) DIRS.forEach((d, i) => {
    const a = rad(i * 90 - 90), d0 = r * 1.16, x = f1(cx + Math.cos(a) * d0), y = f1(cy + Math.sin(a) * d0), sz = f1(r * 0.3);
    if (o.hl === d) out.push(circle(x, y, f1(r * 0.24), '#fff3b0', HL, 2));
    out.push(num(x, f1(y + sz * 0.36), d, sz, o.hl === d ? HL : C.ink));
  });
  return all(...out);
};
const needle = (cx: number, cy: number, L: number, a = 0) => g(`rotate(${a} ${cx} ${cy})`, path(`M${cx} ${f1(cy - L)} L${f1(cx + L * 0.2)} ${cy} L${f1(cx - L * 0.2)} ${cy} Z`, '#e8302c', C.ink, 1), path(`M${cx} ${f1(cy + L)} L${f1(cx + L * 0.2)} ${cy} L${f1(cx - L * 0.2)} ${cy} Z`, C.white, C.ink, 1), circle(cx, cy, f1(L * 0.12), C.dark, null));
/** Orienteering compass (baseplate) centred on (x, y). */
const compass = (x: number, y: number, s = 1, a = 0) => at(x, y, s, rect(-20, -36, 40, 70, 'rgba(214,236,248,0.8)', 6, C.ink, 1.6), line('M0 -33 L0 -22', C.red, 2.4), circle(0, 8, 17, C.white, C.ink, 1.6), ...range(12).map((i) => line(`M${f1(Math.sin(rad(i * 30)) * 14)} ${f1(8 - Math.cos(rad(i * 30)) * 14)} L${f1(Math.sin(rad(i * 30)) * 17)} ${f1(8 - Math.cos(rad(i * 30)) * 17)}`, C.ink, 1)), num(0, -2, 'N', 6), needle(0, 8, 13, a));
/** Wind streaks blowing from direction d towards the rose centre. */
const windFrom = (cx: number, cy: number, r: number, d: Dir, col: string) => {
  const a = { N: -90, Ö: 0, S: 90, V: 180 }[d], out: Svg[] = [];
  for (const off of [-12, 0, 12]) {
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), px = -sa * off, py = ca * off;
    out.push(arrow(f1(cx + ca * (r + 40) + px), f1(cy + sa * (r + 40) + py), f1(cx + ca * (r * 1.5) + px), f1(cy + sa * (r * 1.5) + py), col, off === 0 ? 4 : 2.6));
  }
  return all(...out);
};
/** "nordlig" family: a grey rose with a wind coming from one side and a hint of its weather. */
const fromDir = (d: Dir) => {
  const cold = d === 'N' || d === 'Ö', col = cold ? COLD : WARM;
  const side = { N: [60, 14], Ö: [106, 30], S: [60, 106], V: [14, 30] }[d];
  return all(bg('#eef4f8'), windFrom(60, 60, 18, d, col), rose(60, 60, 18, { hl: d }),
    d === 'N' ? all(flake(26, 14, 4), flake(94, 14, 4)) : d === 'S' ? sunR(96, 102, 5) : d === 'Ö' ? all(flake(106, 30, 4), flake(106, 90, 4)) : all(path('M6 22 C6 16 14 14 16 18 C20 14 26 18 24 22 Z', C.white, C.ink, 1), line('M10 26 l-2 5 M16 26 l-2 5 M22 26 l-2 5', COLD, 1.3)),
    circle(side[0]!, side[1]!, 0.1, 'none', null));
};
const steps = (pts: number[][]) => all(...pts.map(([x, y], i) => ellipse(x!, y! + (i % 2 ? 3 : -3), 2.2, 1.4, C.brown, null)));
/** "österut" family: a path leads from a walker towards the sun on one horizon; the rose shows the side. */
const goTo = (east: boolean) => {
  const sx = east ? 104 : 16, skyCol = east ? '#fde7c4' : '#f6c39a';
  const pts = range(6).map((i) => [east ? 28 + i * 12 : 92 - i * 12, 106]);
  return all(rect(4, 4, 112, 64, skyCol, 3, null), rect(4, 68, 112, 44, '#cfe8b8', 0, null), line('M4 68 L116 68', C.ink, 1), path(`M${sx - 12} 68 A12 12 0 0 1 ${sx + 12} 68 Z`, east ? C.yellow : C.orange, C.ink, 1.2),
    ...range(5).map((i) => { const a = rad(200 + i * 35); return line(`M${f1(sx + Math.cos(a) * 15)} ${f1(68 + Math.sin(a) * 15)} L${f1(sx + Math.cos(a) * 20)} ${f1(68 + Math.sin(a) * 20)}`, C.gold, 1.6); }),
    steps(pts), P({ x: east ? 16 : 104, h: 0.42, top: C.orange, mood: 'smile' }), arrow(east ? 34 : 86, 88, east ? 92 : 28, 88, HL, 3.4), rose(60, 34, 14, { hl: east ? 'Ö' : 'V' }));
};

// ── Globes ───────────────────────────────────────────────────────────
const LANDS = ['M-0.3 -0.55 C-0.1 -0.75 0.4 -0.7 0.6 -0.45 C0.7 -0.3 0.5 -0.15 0.3 -0.2 C0.15 -0.1 0 -0.25 -0.1 -0.15 C-0.25 -0.2 -0.4 -0.35 -0.3 -0.55 Z',
  'M-0.15 -0.05 C0.05 -0.1 0.25 0 0.25 0.2 C0.25 0.4 0.1 0.6 0 0.7 C-0.1 0.55 -0.1 0.4 -0.2 0.3 C-0.3 0.15 -0.3 0 -0.15 -0.05 Z',
  'M0.45 0.25 C0.6 0.2 0.72 0.3 0.65 0.45 C0.55 0.5 0.42 0.42 0.45 0.25 Z',
  'M-0.75 -0.25 C-0.6 -0.35 -0.5 -0.2 -0.55 0 C-0.58 0.15 -0.7 0.2 -0.78 0.05 Z'];
const globe = (cx: number, cy: number, r: number, land = true) => all(circle(cx, cy, r, SEA, C.ink, 1.6), land ? at(cx, cy, r, ...LANDS.map((d) => path(d, LAND, C.ink, f1(1 / r)))) : '');
const ring = (cx: number, cy: number, r: number) => circle(cx, cy, r, 'none', C.ink, 1.6);
/** Latitude line (side view): straight, at latitude lat. */
const lat = (cx: number, cy: number, r: number, la: number, col: string = 'rgba(255,255,255,0.85)', sw = 1, dash?: string) => { const y = cy - r * Math.sin(rad(la)), w = r * Math.cos(rad(la)); return line(`M${f1(cx - w)} ${f1(y)} L${f1(cx + w)} ${f1(y)}`, col, sw, dash); };
/** Meridian (side view) at longitude lo relative to the centre of the view. */
const mer = (cx: number, cy: number, r: number, lo: number, col: string = 'rgba(255,255,255,0.85)', sw = 1, dash?: string) => { const rx = Math.abs(r * Math.sin(rad(lo))); return rx < 0.5 ? line(`M${cx} ${cy - r} L${cx} ${cy + r}`, col, sw, dash) : line(`M${cx} ${cy - r} A${f1(rx)} ${r} 0 0 ${lo > 0 ? 1 : 0} ${cx} ${cy + r}`, col, sw, dash); };
const grid = (cx: number, cy: number, r: number) => all(...[-60, -30, 0, 30, 60].map((l) => lat(cx, cy, r, l)), ...[-60, -30, 0, 30, 60].map((l) => mer(cx, cy, r, l)));
const pin = (x: number, y: number, col: string = HL, s = 1) => at(x, y, s, path('M0 0 C-7 -9 -7 -16 0 -16 C7 -16 7 -9 0 0 Z', col, C.ink, 1.2), circle(0, -11, 2.4, C.white, null));
const flag = (x: number, y: number, col: string = HL) => all(line(`M${x} ${y} L${x} ${y - 16}`, C.ink, 1.6), path(`M${x} ${y - 16} L${x + 11} ${y - 12.5} L${x} ${y - 9} Z`, col, C.ink, 1));
const cap = (cx: number, cy: number, r: number, north: boolean, la = 68) => { const y = cy + (north ? -1 : 1) * r * Math.sin(rad(la)), w = r * Math.cos(rad(la)); return path(`M${f1(cx - w)} ${f1(y)} A${r} ${r} 0 0 ${north ? 1 : 0} ${f1(cx + w)} ${f1(y)} Z`, C.white, C.ink, 1); };
/** Globe seen from above the North Pole with meridians as spokes. */
const polar = (cx: number, cy: number, r: number) => all(circle(cx, cy, r, SEA, C.ink, 1.6), path(`M${cx - r * 0.5} ${cy - r * 0.2} C${cx - r * 0.3} ${cy - r * 0.7} ${cx + r * 0.5} ${cy - r * 0.6} ${cx + r * 0.6} ${cy - r * 0.1} C${cx + r * 0.7} ${cy + r * 0.3} ${cx + r * 0.2} ${cy + r * 0.4} ${cx} ${cy + r * 0.6} C${cx - r * 0.4} ${cy + r * 0.6} ${cx - r * 0.7} ${cy + r * 0.2} ${cx - r * 0.5} ${cy - r * 0.2} Z`, LAND, C.ink, 1), circle(cx, cy, r * 0.22, C.white, C.ink, 0.8),
  ...range(12).map((i) => line(`M${cx} ${cy} L${f1(cx + Math.sin(rad(i * 30)) * r)} ${f1(cy + Math.cos(rad(i * 30)) * r)}`, 'rgba(255,255,255,0.8)', 0.9)), ...[0.35, 0.7].map((k) => circle(cx, cy, r * k, 'none', 'rgba(255,255,255,0.8)', 0.9)), circle(cx, cy, 1.6, C.ink, null));

// ── World map (equirectangular, frame x 8–112, equator at y 60) ──────
const X = (lo: number, x0 = 8, w = 104) => f1(x0 + ((lo + 180) / 360) * w);
const Y = (la: number, y0 = 60, k = 0.33) => f1(y0 - la * k);
const poly = (pts: number[][], fill: string, x0 = 8, w = 104, y0 = 60, k = 0.33, sw = 1) => path(`M${pts.map(([lo, la]) => `${X(lo!, x0, w)} ${Y(la!, y0, k)}`).join(' L')} Z`, fill, C.ink, sw);
const NAM = [[-165, 65], [-140, 70], [-95, 72], [-75, 62], [-60, 50], [-80, 30], [-97, 18], [-85, 12], [-105, 22], [-118, 33], [-125, 48], [-150, 60]];
const SAM = [[-80, 10], [-60, 8], [-35, -7], [-40, -22], [-58, -38], [-70, -55], [-75, -40], [-70, -18], [-80, -3]];
const EUR = [[-10, 36], [-9, 43], [0, 44], [-4, 48], [5, 52], [8, 57], [12, 56], [18, 60], [20, 70], [30, 70], [40, 66], [60, 70], [70, 73], [100, 77], [140, 72], [178, 68], [170, 60], [160, 58], [140, 55], [140, 45], [130, 42], [122, 30], [110, 20], [105, 10], [103, 2], [98, 16], [92, 22], [80, 8], [72, 20], [58, 25], [50, 30], [56, 17], [44, 13], [34, 28], [36, 36], [28, 37], [22, 40], [15, 40], [10, 44], [3, 43]];
const AFR = [[-17, 21], [-10, 32], [10, 37], [32, 31], [43, 12], [51, 12], [40, -15], [35, -25], [20, -35], [12, -18], [9, 4], [-8, 5], [-17, 14]];
const AUS = [[113, -22], [130, -12], [142, -11], [153, -25], [150, -37], [140, -38], [130, -32], [115, -34]];
const GRL = [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-40, 83], [-60, 78], [-55, 70]];
const JPN = [[130, 32], [135, 34], [141, 38], [141, 42], [145, 44], [142, 45], [140, 40], [136, 36], [131, 34]];
const world = (x0 = 8, w = 104, y0 = 60, k = 0.33, land: string = LAND) => all(...[NAM, SAM, EUR, AFR, AUS, GRL].map((p) => poly(p, land, x0, w, y0, k)), poly(JPN, land, x0, w, y0, k, 0.6));

// ── Land shapes for map scenes ───────────────────────────────────────
const REGION = 'M22 36 C34 26 58 30 74 28 C90 26 104 36 100 52 C98 64 106 74 96 86 C84 96 60 92 44 94 C28 96 16 84 20 70 C22 58 12 46 22 36 Z';
const longLand = (x: number, y: number, s = 1, col: string = LAND) => at(x, y, s, path('M4 -44 C12 -42 14 -34 10 -26 C6 -18 10 -10 6 -2 C2 8 4 18 0 28 C-4 38 -10 42 -14 40 C-16 32 -12 24 -14 16 C-16 6 -10 -4 -10 -14 C-10 -26 -6 -36 4 -44 Z', col, C.ink, 1.4));
const lake = (x: number, y: number, rx = 9, ry = 5) => ellipse(x, y, rx, ry, SEA, C.ink, 1);
const hill = (x: number, base: number, w: number, h: number, fill: string = '#a8c98a') => path(`M${x - w} ${base} C${x - w * 0.5} ${base} ${x - w * 0.35} ${base - h} ${x} ${base - h} C${x + w * 0.35} ${base - h} ${x + w * 0.5} ${base} ${x + w} ${base} Z`, fill, C.ink, 1.4);
const contours = (cx: number, cy: number, n: number, rx: number, ry: number, hl = -1, step = 0.8) => all(...range(n).map((i) => { const k = 1 - (i / n) * step; return ellipse(f1(cx + i * 1.2), cy - i, f1(rx * k), f1(ry * k), 'none', i === hl ? HL : CONT, i === hl ? 2.6 : 1.4); }));
const pylon = (x: number, base: number, h = 44) => all(line(`M${x - 8} ${base} L${x - 2} ${base - h} M${x + 8} ${base} L${x + 2} ${base - h} M${x - 6} ${base - 10} L${x + 6} ${base - 22} M${x + 6} ${base - 10} L${x - 6} ${base - 22} M${x - 4} ${base - 26} L${x + 4} ${base - 36} M${x + 4} ${base - 26} L${x - 4} ${base - 36}`, C.dark, 1.4), line(`M${x - 14} ${base - h + 6} L${x + 14} ${base - h + 6} M${x - 10} ${base - h + 12} L${x + 10} ${base - h + 12}`, C.dark, 1.8));
const satellite = (x: number, y: number, s = 1) => at(x, y, s, rect(-4, -4, 8, 8, C.silver, 1, C.ink, 1), rect(-17, -3, 11, 6, '#3a6ab0', 0.5, C.ink, 0.8), rect(6, -3, 11, 6, '#3a6ab0', 0.5, C.ink, 0.8), line('M-11 -3 L-11 3 M11 -3 L11 3', C.white, 0.6));
const ship = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L14 0 L10 7 L-10 7 Z', C.red, C.ink, 1.2), rect(-6, -7, 10, 7, C.white, 1, C.ink, 1), line('M0 -7 L0 -14', C.ink, 1.2));
const waves = (x: number, y: number, n = 3, col: string = SEA2) => all(...range(n).map((i) => path(`M${x + i * 12} ${y} q3 -3 6 0 q3 3 6 0`, 'none', col, 1.2)));
const mapFrame = (x: number, y: number, w: number, h: number, inner: Svg, fill: string = PAPER) => all(rect(x, y, w, h, fill, 2, C.ink, 1.6), inner);
const houses = (pts: number[][], s = 1) => all(...pts.map(([x, y]) => rect(x! - 2 * s, y! - 2 * s, 4 * s, 4 * s, C.dark, 0.4, null)));
const mini = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, path('M-8 14 C-8 4 8 4 8 14 Z', col, C.ink, 1.2), circle(0, -2, 6, C.skin, C.ink, 1.2), path('M-6 -4 C-6 -10 6 -10 6 -4 C3 -7 -3 -7 -6 -4 Z', C.hair, null));

export const MAPS_ORIENTATION_MOTIFS: Record<string, Svg> = {
  // ── 3001 Väderstreck ─────────────────────────────────────────────
  /** kompassnål: a grey compass; only its needle is in colour, enlarged beside it, swinging to north. */
  'kort.kompassnål': all(bg('#eef4f8'), greyed(compass(34, 62, 1.1, 0)), circle(84, 58, 30, C.white, C.ink, 1.4), needle(84, 58, 24, 0), circle(84, 58, 31, 'none', HL, 2.6), path('M70 28 Q84 22 98 28', 'none', HL, 1.6), num(84, 20, 'N', 9, C.red), line('M47 46 L58 36 M47 78 L58 84', C.grey, 1, '2 2')),
  /** kompassros: an old sea chart (waves, a sailing ship) with a large colourful eight-point rose in it. */
  'kort.kompassros': all(rect(4, 4, 112, 108, '#efe3c4', 3, C.ink, 1.4), waves(10, 18, 3, '#9ab4c8'), waves(80, 100, 3, '#9ab4c8'), path('M88 20 C96 18 106 22 108 30 C104 34 94 32 88 28 Z', '#d9c49a', C.ink, 1), ship(22, 100, 0.7), rose(58, 60, 32, { fancy: true }), circle(58, 60, 44, 'none', HL, 2)),
  /** nordlig: a cold wind comes from the N side of a compass rose; snowflakes on that side. */
  'kort.nordlig': fromDir('N'),
  /** sydlig: a warm wind comes from the S side of a compass rose; a sun on that side. */
  'kort.sydlig': fromDir('S'),
  /** österut: a walker leaves footprints towards the rising sun; the rose rings Ö. */
  'kort.österut': goTo(true),
  /** västerut: a walker leaves footprints towards the setting sun; the rose rings V. */
  'kort.västerut': goTo(false),
  /** Polstjärnan: night sky; the Big Dipper's two pointer stars lead (dashed) to one big bright star; a person on the ground looks up at it, N on the ground below. */
  'kort.Polstjärnan': all(bg(NIGHT), ...[[14, 80], [26, 76], [36, 80], [46, 84], [50, 96], [64, 96], [62, 84]].map(([x, y]) => star(x!, y!, 2.6, '#f4e7a1')), line('M14 80 L26 76 L36 80 L46 84 L62 84 L64 96 L50 96 L46 84', 'rgba(244,231,161,0.5)', 0.8), line('M62 84 L66 50 L72 28', '#f4e7a1', 1.2, '3 3'), circle(74, 22, 10, 'rgba(255,240,170,0.35)', null), star(74, 22, 7, C.yellow), sparkle(88, 14, 3, C.white), sparkle(96, 40, 2, C.white), sparkle(20, 20, 2, C.white), rect(4, 104, 112, 8, '#2f3b5a', 0, null), mini(98, 96, 0.9, C.orange), arrow(98, 84, 82, 34, 'rgba(255,255,255,0.6)', 1.4), num(74, 108, 'N', 8, C.yellow)),

  // ── 3002 Karttecken och symboler ─────────────────────────────────
  /** karttecken: a map with small symbols; one (a tent triangle) is ringed and linked to an inset of a real tent. */
  'kort.karttecken': all(mapFrame(6, 30, 64, 76, all(rect(6, 30, 64, 76, FOREST, 2, null), lake(22, 50, 10, 6), line('M6 88 C24 84 40 92 70 86', C.dark, 2), line('M40 30 C42 50 30 70 36 106', C.dark, 1.2, '3 2'), path('M50 64 L56 54 L62 64 Z', C.white, C.ink, 1.2), rect(18, 70, 5, 5, C.dark, 0, null), circle(56, 60, 10, 'none', HL, 2.4))), line('M64 54 L84 34', HL, 1.6, '3 2'), circle(92, 30, 22, '#eaf5ff', HL, 2.4), path('M80 40 L92 18 L104 40 Z', C.orange, C.ink, 1.4), path('M90 40 L92 30 L94 40 Z', C.dark, null), line('M74 41 L110 41', LAND2, 1.6), path('M56 74 l4 0', 'none', C.ink, 1)),
  /** vägkarta: an open map with thick yellow and red roads between city dots; a car beside it. */
  'kort.vägkarta': all(sheet(6, 10, 108, 72), line('M14 70 C30 60 40 40 60 36 C78 32 92 22 108 16', '#d64545', 4), line('M18 22 C40 30 56 50 70 60 C84 70 96 74 108 76', ROADC, 3.2), line('M40 74 L56 40', ROADC, 2.4), ...[[60, 36], [70, 60], [24, 64], [96, 22], [102, 74]].map(([x, y]) => circle(x!, y!, 3.6, C.white, C.ink, 1.4)), at(60, 104, 1, path('M-24 0 L-24 -10 L-14 -12 L-8 -20 L10 -20 L16 -12 L24 -10 L24 0 Z', '#3a6ab0', C.ink, 1.6), path('M-6 -18 L-10 -12 L14 -12 L8 -18 Z', '#d8eef8', C.ink, 1), circle(-14, 0, 5, C.dark, C.ink, 1.2), circle(14, 0, 5, C.dark, C.ink, 1.2)), ground),
  /** terrängkarta: an open map of nature – green forest, a lake, brown contour lines, a dashed path; a hiker's backpack beside it. */
  'kort.terrängkarta': all(sheet(6, 10, 108, 72, FOREST), rect(70, 46, 40, 32, OPEN, 0, null), lake(30, 60, 14, 8), contours(82, 30, 4, 22, 13), line('M10 22 C30 30 50 46 64 50 C80 54 96 66 110 74', C.dark, 1.4, '3 2'), ...[[20, 30], [50, 24], [40, 72], [16, 76]].map(([x, y]) => treeTop(x!, y!, 3)), at(60, 108, 1, rect(-10, -22, 20, 22, '#4f7d3a', 4, C.ink, 1.6), rect(-6, -14, 12, 8, '#3f6a2e', 2, C.ink, 1), path('M-6 -22 C-6 -30 6 -30 6 -22', 'none', C.ink, 1.6)), ground),
  /** kartläsning: a person in a forest holds an open map in both hands and studies it; a dashed line from the eyes to the map. */
  'kort.kartläsning': all(bg('#e6f2dc'), tree(14, 112, 1.2), tree(106, 112, 1.1), tree(96, 104, 0.8), P({ x: 60, h: 0.95, top: C.orange, mood: 'calm' }), reach(60, 0.95, -1, 48, 64), reach(60, 0.95, 1, 72, 64), at(60, 60, 1, path('M-22 -14 L0 -10 L22 -14 L22 10 L0 14 L-22 10 Z', PAPER, C.ink, 1.4), line('M0 -10 L0 14', C.grey, 1), lake(-12, -2, 5, 3), line('M-18 6 C-8 0 6 4 18 -6', HL, 1.6, '3 2'), contours(11, 2, 2, 7, 4)), line('M58 28 L56 46 M62 28 L64 46', HL, 1, '2 2'), ground),
  /** streckad: a big dashed line dominates; a grey solid line above as reference. */
  'kort.streckad': all(bg('#f4f6f8'), line('M14 36 L106 36', C.grey, 4), line('M14 72 L106 72', HL, 7, '12 9'), rect(8, 56, 104, 32, 'none', 6, HL, 1.4)),
  /** heldragen: a big solid line dominates; a grey dashed line above as reference. */
  'kort.heldragen': all(bg('#f4f6f8'), line('M14 36 L106 36', C.grey, 4, '12 9'), line('M14 72 L106 72', HL, 7), rect(8, 56, 104, 32, 'none', 6, HL, 1.4)),
  /** kraftledning: three steel pylons carry sagging cables through a forest clearing. */
  'kort.kraftledning': all(bg(), rect(4, 96, 112, 16, '#cfe8b8', 0, null), tree(8, 100, 0.8), tree(112, 100, 0.8), pylon(22, 104, 52), pylon(62, 104, 56), pylon(102, 104, 52), line('M8 58 Q15 64 22 58 Q42 72 62 54 Q82 72 102 58 Q109 64 116 58', C.dark, 1.2), line('M10 64 Q16 68 22 64 Q42 76 62 60 Q82 76 102 64 Q108 68 114 64', C.dark, 1.2), ground),
  /** öppen mark: a map from above – green forest with trees around a yellow open field with grass tufts, ringed. */
  'kort.öppen-mark': all(rect(4, 4, 112, 108, FOREST, 3, C.ink, 1.4), ...[[14, 14], [30, 12], [94, 14], [108, 26], [12, 96], [26, 104], [104, 100], [92, 106], [10, 50], [110, 70]].map(([x, y]) => treeTop(x!, y!, 5)), path('M28 30 C50 22 84 26 94 40 C104 56 98 84 80 90 C60 96 34 92 26 74 C20 60 18 40 28 30 Z', OPEN, C.ink, 1.2), ...[[44, 44], [66, 40], [80, 60], [50, 70], [70, 78], [38, 58]].map(([x, y]) => line(`M${x! - 3} ${y} l1.5 -4 M${x} ${y} l0 -5 M${x! + 3} ${y} l-1.5 -4`, LAND2, 1.2)), path('M28 30 C50 22 84 26 94 40 C104 56 98 84 80 90 C60 96 34 92 26 74 C20 60 18 40 28 30 Z', 'none', HL, 2.6)),

  // ── 3003 Skala och avstånd ───────────────────────────────────────
  /** i verkligheten: a small photo of a house in a grey frame; an arrow leads to the same house, big and real, with a person beside it. */
  'kort.i-verkligheten': all(bg(), rect(6, 18, 34, 28, C.white, 2, C.grey, 2), greyed(house(23, 40, 0.8)), arrow(42, 34, 54, 46, HL, 2.6), rect(4, 104, 112, 8, '#cfe8b8', 0, null), house(84, 104, 2.6), P({ x: 46, h: 0.62, top: C.orange, mood: 'smile' }), ground),
  /** skala: a map with 1 cm marked equals a 500 m stretch of real road in the landscape below. */
  'kort.skala-noun': all(bg(), sheet(8, 8, 104, 40), line('M14 30 C40 20 70 36 106 24', C.dark, 2), line('M30 40 L50 40', HL, 3), line('M30 36 L30 44 M50 36 L50 44', HL, 2), num(40, 18, '1 cm', 9, HL), num(60, 62, '=', 14), rect(4, 72, 112, 40, '#cfe8b8', 0, null), path('M4 98 C30 90 60 100 116 88', 'none', C.dark, 6), dbl(14, 82, 106, 82), num(60, 78, '500 m', 9, HL), tree(10, 112, 0.6), tree(110, 112, 0.6)),
  /** skalstock (på karta): a map corner with a black-and-white segmented bar 0–3 km, ringed; a ruler measures against it. */
  'kort.skalstock.2': all(sheet(6, 8, 108, 96), lake(30, 30, 12, 7), line('M10 50 C40 40 70 60 110 46', C.dark, 1.6), ...[0, 1, 2, 3].map((i) => rect(20 + i * 20, 78, 20, 7, i % 2 ? C.white : C.dark, 0, C.ink, 1.2)), ...[0, 1, 2, 3].map((i) => num(20 + i * 20, 96, String(i), 8)), num(97, 96, 'km', 7), rect(14, 70, 92, 32, 'none', 4, HL, 2.4), rect(20, 58, 60, 8, '#f2e3a0', 1, C.ink, 1), ...range(7).map((i) => line(`M${20 + i * 10} 58 l0 4`, C.ink, 0.8))),
  /** förminska: a big picture of a tree → arrow → the same picture small; corner arrows point inwards. */
  'kort.förminska': all(bg('#f4f6f8'), rect(6, 26, 56, 56, C.white, 2, C.ink, 1.6), tree(34, 74, 1.9), arrow(66, 54, 80, 54, HL, 3), rect(86, 44, 22, 22, C.white, 2, C.ink, 1.4), tree(97, 63, 0.7), arrow(80, 30, 88, 40, HL, 2), arrow(114, 30, 106, 40, HL, 2), arrow(80, 82, 88, 72, HL, 2), arrow(114, 82, 106, 72, HL, 2)),
  /** förstora: a small picture of a tree → arrow → the same picture big; corner arrows point outwards. */
  'kort.förstora': all(bg('#f4f6f8'), rect(8, 44, 22, 22, C.white, 2, C.ink, 1.4), tree(19, 63, 0.7), arrow(32, 54, 46, 54, HL, 3), rect(56, 26, 56, 56, C.white, 2, C.ink, 1.6), tree(84, 74, 1.9), arrow(62, 32, 52, 22, HL, 2), arrow(106, 32, 116, 22, HL, 2), arrow(62, 76, 52, 86, HL, 2), arrow(106, 76, 116, 86, HL, 2)),
  /** detaljerad: two maps of the same place – a grey one with only a lake and a road, and a coloured one full of houses, paths, trees and a bridge. */
  'kort.detaljerad': all(bg('#f4f6f8'), greyed(mapFrame(6, 30, 40, 52, all(lake(22, 50, 8, 5), line('M6 70 L46 62', C.dark, 2)))), mapFrame(54, 14, 60, 86, all(rect(54, 14, 60, 86, FOREST, 2, null), lake(78, 44, 13, 8), line('M54 82 L114 70', C.dark, 3), line('M60 14 C66 40 92 56 110 100', C.dark, 1.2, '3 2'), houses([[64, 70], [70, 74], [92, 66], [98, 64], [104, 80], [66, 26], [100, 30]], 1.1), ...[[60, 54], [104, 46], [86, 90], [62, 94], [96, 22]].map(([x, y]) => treeTop(x!, y!, 2.6)), rect(84, 70, 8, 4, C.brown, 0, C.ink, 0.6), contours(100, 40, 2, 8, 5))), rect(54, 14, 60, 86, 'none', 2, HL, 2.6)),
  /** översiktskarta: a whole long country with a few city dots and main roads, ringed; a small grey detailed sheet shows one part of it. */
  'kort.översiktskarta': all(bg(SEA), longLand(44, 60, 1.15), ...[[48, 18], [42, 50], [36, 74], [30, 94]].map(([x, y]) => circle(x!, y!, 2.6, C.white, C.ink, 1.2)), line('M48 18 L42 50 L36 74 L30 94', '#d64545', 1.8), rect(22, 6, 46, 108, 'none', 4, HL, 2.4), rect(34, 66, 10, 12, 'none', 1, C.grey, 1.2), line('M44 66 L80 56 M44 78 L80 96', C.grey, 1, '2 2'), greyed(mapFrame(80, 56, 32, 40, all(lake(92, 70, 5, 3), houses([[100, 82], [104, 86], [88, 88]]), line('M80 80 L112 74', C.dark, 1.4))))),

  // ── 3004 Latitud och longitud ────────────────────────────────────
  /** grad (vinkel): two rays from a point with an arc and 45°; a grey thermometer as the other meaning. */
  'kort.grad.2': all(bg('#f4f6f8'), line('M22 92 L104 92', C.ink, 3), line('M22 92 L80 34', C.ink, 3), circle(22, 92, 3, C.ink, null), path(`M58 92 A36 36 0 0 0 ${f1(22 + 36 * Math.cos(rad(45)))} ${f1(92 - 36 * Math.sin(rad(45)))}`, 'none', HL, 3.2), num(72, 76, '45°', 13, HL), greyed(rect(98, 14, 8, 40, C.white, 4, C.ink, 1.4), circle(102, 58, 6, C.red, C.ink, 1.4), rect(100.5, 30, 3, 26, C.red, 1, null))),
  /** nordpol: a globe with a white ice cap; a flag stands on the very top point, the axis dashed through it. */
  'kort.nordpol': all(bg(NIGHT), globe(60, 66, 40), cap(60, 66, 40, true, 60), cap(60, 66, 40, false, 60), line('M60 14 L60 112', 'rgba(255,255,255,0.6)', 1, '3 3'), circle(60, 26, 3, HL, C.ink, 1), flag(60, 26), circle(60, 26, 9, 'none', HL, 2), num(82, 20, 'N', 9, C.white)),
  /** sydpol: the same globe; the flag stands on the very bottom point, under the ice cap. */
  'kort.sydpol': all(bg(NIGHT), globe(60, 54, 40), cap(60, 54, 40, true, 60), cap(60, 54, 40, false, 60), line('M60 8 L60 106', 'rgba(255,255,255,0.6)', 1, '3 3'), circle(60, 94, 3, HL, C.ink, 1), all(line('M60 94 L60 110', C.ink, 1.6), path('M60 110 L71 106.5 L60 103 Z', HL, C.ink, 1)), circle(60, 94, 9, 'none', HL, 2), num(82, 104, 'S', 9, C.white)),
  /** jordglob: a desk globe on its stand, with the half ring and a spin arrow. */
  'kort.jordglob': all(bg(), globe(58, 52, 34), grid(58, 52, 34), path('M30 22 A40 40 0 0 0 30 82', 'none', C.dark, 3), line('M58 86 L58 100', C.dark, 3), path('M40 104 L76 104 L70 98 L46 98 Z', C.brown, C.ink, 1.4), path('M84 30 C96 40 96 64 84 74', 'none', HL, 2.4), arrow(88, 68, 84, 74, HL, 2.4), ground),
  /** meridian: a globe with faint grey meridians; one is drawn bold from the North Pole to the South Pole, with dots at both poles. */
  'kort.meridian': all(bg(NIGHT), globe(60, 60, 44), ...[-60, -30, 0, 60].map((l) => mer(60, 60, 44, l, 'rgba(255,255,255,0.5)')), mer(60, 60, 44, 32, HL, 3.2), circle(60, 16, 3, C.white, C.ink, 1), circle(60, 104, 3, C.white, C.ink, 1), ring(60, 60, 44)),
  /** nollmeridian: a globe; the straight middle meridian is bold and labelled 0°, the others thin with 30° steps. */
  'kort.nollmeridian': all(bg(NIGHT), globe(60, 62, 42), ...[-60, -30, 30, 60].map((l) => mer(60, 62, 42, l, 'rgba(255,255,255,0.55)')), mer(60, 62, 42, 0, HL, 3.4), lat(60, 62, 42, 0, 'rgba(255,255,255,0.55)'), ring(60, 62, 42), num(60, 15, '0°', 11, HL), num(26, 15, '30°', 8, C.grey2), num(94, 15, '30°', 8, C.grey2)),
  /** latitud: a cut through the globe – from the centre, one line to the equator and one up to a place; the arc between is 40° N. */
  'kort.latitud': all(bg('#eef4f8'), globe(54, 60, 44, false), lat(54, 60, 44, 0, C.white, 1.6, '4 3'), lat(54, 60, 44, 40, HL, 2.4), line(`M54 60 L98 60`, C.ink, 1.6), line(`M54 60 L${f1(54 + 44 * Math.cos(rad(40)))} ${f1(60 - 44 * Math.sin(rad(40)))}`, C.ink, 1.6), path(`M76 60 A22 22 0 0 0 ${f1(54 + 22 * Math.cos(rad(40)))} ${f1(60 - 22 * Math.sin(rad(40)))}`, 'none', HL, 3), circle(f1(54 + 44 * Math.cos(rad(40))), f1(60 - 44 * Math.sin(rad(40))), 3.4, HL, C.ink, 1), num(96, 50, '40°', 10, HL), num(100, 22, 'N', 9, C.ink), circle(54, 60, 2, C.ink, null)),
  /** longitud: the globe seen from above the North Pole; from 0° one spoke turns 60° east to a place; the arc is marked. */
  'kort.longitud': all(bg('#eef4f8'), polar(60, 60, 46), line('M60 60 L60 106', C.ink, 2.4), line(`M60 60 L${f1(60 + 46 * Math.sin(rad(60)))} ${f1(60 + 46 * Math.cos(rad(60)))}`, HL, 3), path(`M60 84 A24 24 0 0 0 ${f1(60 + 24 * Math.sin(rad(60)))} ${f1(60 + 24 * Math.cos(rad(60)))}`, 'none', HL, 3), circle(f1(60 + 46 * Math.sin(rad(60))), f1(60 + 46 * Math.cos(rad(60))), 3.4, HL, C.ink, 1), num(84, 92, '60°', 10, HL), num(48, 104, '0°', 9)),
  /** östlig: a grey compass rose; a cool wind comes from the Ö side. */
  'kort.östlig': fromDir('Ö'),
  /** västlig: a grey compass rose; a rainy wind comes from the V side. */
  'kort.västlig': fromDir('V'),

  // ── 3005 Geografiska koordinatsystem ─────────────────────────────
  /** kartlägga (göra karta): a landscape at the top; below, a pencil draws the same hills, lake and trees onto a half-finished map. */
  'kort.kartlägga.2': all(bg(), rect(4, 36, 112, 12, '#cfe8b8', 0, null), hill(30, 40, 24, 18), hill(60, 40, 18, 12), ellipse(92, 42, 14, 4, SEA, C.ink, 1), tree(76, 40, 0.6), tree(110, 40, 0.6), arrow(60, 50, 60, 60, HL, 2.4), sheet(8, 62, 104, 46), contours(30, 86, 3, 16, 10), contours(60, 86, 2, 12, 8), line('M80 86 C84 80 100 80 104 86', SEA2, 1.4, '2 2'), at(96, 82, 1, g('rotate(40)', rect(-2, -20, 4, 18, C.yellow, 1, C.ink, 1), path('M-2 -2 L2 -2 L0 3 Z', C.tan, C.ink, 0.8)))),
  /** koordinatsystem: a globe covered by a whole net of lines in both directions, with degree numbers along two edges. */
  'kort.koordinatsystem': all(bg(NIGHT), globe(62, 58, 40), ...[-60, -30, 0, 30, 60].map((l) => lat(62, 58, 40, l, HL, 1.8)), ...[-60, -30, 0, 30, 60].map((l) => mer(62, 58, 40, l, HL, 1.8)), ring(62, 58, 40), ...[-60, -30, 0, 30, 60].map((l) => num(14, f1(58 - 40 * Math.sin(rad(l)) + 3), `${Math.abs(l)}°`, 7, C.white)), ...[-60, 0, 60].map((l) => num(f1(62 + 40 * Math.sin(rad(l))), 112, `${Math.abs(l)}°`, 7, C.white))),
  /** breddgrad: a globe with only the parallel lines going round it; the 60° line is bold with its number. */
  'kort.breddgrad': all(bg(NIGHT), globe(56, 60, 42), ...[-60, -30, 0, 30].map((l) => lat(56, 60, 42, l, 'rgba(255,255,255,0.8)', 1.2)), lat(56, 60, 42, 60, HL, 3.2), ring(56, 60, 42), num(98, f1(60 - 42 * Math.sin(rad(60)) + 4), '60°', 10, HL), num(106, 63, '0°', 8, C.white)),
  /** längdgrad: a globe with only meridians; degree numbers along the equator, the 60° meridian bold. */
  'kort.längdgrad': all(bg(NIGHT), globe(60, 56, 42), ...[-60, -30, 0, 60].map((l) => mer(60, 56, 42, l, 'rgba(255,255,255,0.8)', 1.2)), mer(60, 56, 42, 30, HL, 3.2), ring(60, 56, 42), num(60, 110, '0°', 8, C.white), num(f1(60 + 42 * Math.sin(rad(30))), 110, '30°', 9, HL)),
  /** position: a ship at sea on a chart; two dashed lines from the edges cross exactly at the ship, inside a target ring. */
  'kort.position': all(rect(4, 4, 112, 108, SEA, 3, C.ink, 1.4), waves(14, 30), waves(70, 96), path('M84 4 C90 20 104 24 116 22 L116 4 Z', LAND, C.ink, 1), line('M4 62 L116 62', C.dark, 1.2, '4 3'), line('M54 4 L54 112', C.dark, 1.2, '4 3'), ship(54, 58, 0.9), circle(54, 60, 16, 'none', HL, 2.6), line('M54 40 L54 46 M54 74 L54 80 M34 60 L40 60 M68 60 L74 60', HL, 2.4)),
  /** ange: a person on the phone; the speech bubble holds a map pin and two coordinates. */
  'kort.ange': all(bg(), P({ x: 32, h: 0.95, top: C.green, mood: 'calm' }), reach(32, 0.95, 1, 40, 30), rect(38, 22, 6, 12, C.dark, 2, C.ink, 1), (() => { const cx = 82, cy = 34; return all(path(`M${cx - 30} ${cy + 8} L44 30 L${cx - 30} ${cy - 2} Z`, C.white, C.ink, 1.5), rect(cx - 32, cy - 22, 64, 44, C.white, 6, C.ink, 1.5), path(`M${cx - 30.6} ${cy + 6} L45 30 L${cx - 30.6} ${cy} Z`, C.white, null), pin(cx - 18, cy + 8, HL, 0.9), num(cx + 8, cy - 4, '59° N', 9, HL), num(cx + 8, cy + 10, '18° Ö', 9, HL)); })(), ground),
  /** GPS: a yellow handheld device whose screen shows a map arrow and a dot; two satellites above send dashed signals to it. */
  'kort.GPS': all(bg(), satellite(22, 18, 0.9), satellite(98, 14, 0.9), line('M24 24 L52 58 M96 20 L68 58', HL, 1.4, '3 3'), rect(42, 54, 36, 54, C.yellow, 6, C.ink, 1.8), rect(58, 44, 4, 10, C.dark, 1, C.ink, 1), rect(47, 60, 26, 28, '#e6f2dc', 2, C.ink, 1.2), line('M48 80 C56 76 62 70 72 64', C.dark, 1.2, '2 2'), path('M60 68 L64 78 L60 75 L56 78 Z', HL, C.ink, 0.8), ...[0, 1, 2].map((i) => circle(52 + i * 8, 98, 2.6, C.dark, null))),
  /** sjömil: two buoys on the sea with a small boat; a double arrow between them marked 1 852 m. */
  'kort.sjömil': all(bg(), rect(4, 70, 112, 42, SEA, 0, null), waves(10, 96), waves(60, 104), ...[18, 102].map((x) => all(path(`M${x - 5} 76 L${x + 5} 76 L${x + 3} 60 L${x - 3} 60 Z`, C.red, C.ink, 1.2), rect(x - 3, 66, 6, 3, C.white, 0, null), line(`M${x} 60 L${x} 54`, C.ink, 1.2))), dbl(20, 46, 100, 46), num(60, 40, '1 852 m', 10, HL), ship(60, 74, 0.7)),
  /** lantmätare: a person in a high-visibility vest stands by a measuring instrument on a tripod in a field, with a marker pole further away. */
  'kort.lantmätare': all(bg(), rect(4, 96, 112, 16, '#cfe8b8', 0, null), P({ x: 38, h: 0.95, top: C.reflex, mood: 'calm' }), line('M90 112 L80 72 M70 112 L80 72 M80 112 L80 72', C.dark, 2), rect(72, 58, 16, 14, C.yellow, 2, C.ink, 1.4), circle(88, 64, 4, C.dark, C.ink, 1), reach(38, 0.95, 1, 72, 66), ...range(4).map((i) => rect(108.5, 60 + i * 12, 3, 12, i % 2 ? C.white : '#d64545', 0, C.ink, 0.8)), ground),

  // ── 3006 Höjdkurvor ──────────────────────────────────────────────
  /** höjdkurva: above, a hill from the side cut by dashed level lines; below, the same hill from above as brown rings – one level and its ring highlighted. */
  'kort.höjdkurva': all(bg(), hill(60, 52, 46, 40), ...[1, 2, 3].map((i) => line(`M${f1(60 - 46 * (1 - i * 0.25) * 0.8)} ${52 - i * 10} L${f1(60 + 46 * (1 - i * 0.25) * 0.8)} ${52 - i * 10}`, i === 2 ? HL : C.dark, i === 2 ? 2.2 : 1, '3 2')), rect(8, 60, 104, 48, PAPER, 2, C.ink, 1.2), ...[0, 1, 2, 3].map((i) => ellipse(60, 84, 44 - i * 10, 20 - i * 4.6, 'none', i === 2 ? HL : CONT, i === 2 ? 2.6 : 1.4)), line('M42 32 L42 72 M78 32 L78 72', HL, 1, '2 2')),
  /** höjdskillnad: a person at a low lake and another on a high top; dashed levels and a big double arrow with 400 m between them. */
  'kort.höjdskillnad': all(bg(), path('M4 112 L4 96 C30 96 40 92 56 70 C66 54 76 30 90 26 C100 24 108 30 116 34 L116 112 Z', '#a8c98a', C.ink, 1.4), ellipse(20, 98, 14, 3, SEA, C.ink, 1), mini(34, 84, 0.7, C.orange), mini(92, 14, 0.7, C.sky), line('M8 96 L70 96', C.dark, 1, '3 3'), line('M70 26 L110 26', C.dark, 1, '3 3'), dbl(70, 92, 70, 30), num(52, 62, '400 m', 9, HL)),
  /** ekvidistans: brown contour rings with height numbers 20, 40, 60 from above; one gap between two neighbouring rings is marked 20 m. */
  'kort.ekvidistans': all(rect(4, 4, 112, 108, PAPER, 3, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => ellipse(56, 62, 48 - i * 12, 40 - i * 10, 'none', CONT, 1.6)), num(56, 66, '▲', 8, CONT), num(10, 66, '20', 7, CONT), num(22, 66, '40', 7, CONT), num(34, 66, '60', 7, CONT), dbl(92, 62, 104, 62, HL, 2), rect(86, 40, 26, 14, C.white, 3, HL, 1.6), num(99, 50, '20 m', 8, HL)),
  /** svacka: a side view of rolling ground with one hollow in the middle, ringed; water has gathered at its bottom. */
  'kort.svacka': all(bg(), path('M4 112 L4 62 C20 56 34 58 42 70 C48 82 58 88 66 84 C74 80 80 64 92 58 C104 54 112 58 116 60 L116 112 Z', '#a8c98a', C.ink, 1.4), path('M50 82 C56 88 62 88 68 82 Z', SEA, C.ink, 1), tree(14, 60, 0.8), tree(104, 58, 0.8), path('M36 64 C44 96 74 96 84 62', 'none', HL, 2.6), arrow(60, 40, 60, 72, HL, 2.4)),
  /** stigning: a road climbs steeply to the right; a yellow warning sign with a slope and 10 % stands beside it. */
  'kort.stigning': all(bg(), path('M4 112 L4 100 L116 46 L116 112 Z', '#a8c98a', C.ink, 1.4), path('M4 100 L116 46 L116 56 L4 108 Z', '#8a8f98', C.ink, 1.2), line('M10 101 L110 53', C.white, 1, '6 5'), arrow(30, 82, 96, 50, HL, 3), line('M28 112 L28 56', C.dark, 2), path('M28 22 L46 54 L10 54 Z', C.yellow, '#d64545', 3.4), path('M16 50 L40 50 L40 38 Z', C.ink, null), num(24, 46, '10%', 6)),
  /** höjdprofil: a chart with km along the bottom and metres up the side; the coloured profile line rises and falls. */
  'kort.höjdprofil': all(rect(4, 4, 112, 108, C.white, 3, C.ink, 1.4), line('M18 96 L110 96 M18 96 L18 14', C.ink, 1.6), path('M18 96 L18 80 C30 78 36 70 46 54 C54 42 60 30 68 32 C76 34 80 60 88 66 C96 70 104 58 110 52 L110 96 Z', '#d9c49a', null), line('M18 80 C30 78 36 70 46 54 C54 42 60 30 68 32 C76 34 80 60 88 66 C96 70 104 58 110 52', HL, 2.8), ...[0, 5, 10].map((k, i) => num(18 + i * 43, 106, String(k), 7)), num(110, 106, 'km', 6), num(11, 20, 'm', 7), num(10, 56, '500', 6)),

  // ── 3007 Läsa en världskarta ─────────────────────────────────────
  /** världskarta: a rectangular map of the whole world – all continents in green on blue. */
  'kort.världskarta': all(bg('#f4f6f8'), rect(8, 26, 104, 64, SEA, 2, C.ink, 1.6), world(), rect(8, 26, 104, 64, 'none', 2, C.ink, 1.6)),
  /** atlas: a thick book lies open, a map on each page; a closed atlas beside it. */
  'kort.atlas': all(bg(), path('M8 86 L58 92 L58 40 L8 34 Z', PAPER, C.ink, 1.6), path('M112 86 L62 92 L62 40 L112 34 Z', PAPER, C.ink, 1.6), path('M58 92 L62 92 L62 40 L58 40 Z', C.navy, C.ink, 1), at(33, 63, 1, path('M-16 -12 C-6 -18 10 -14 12 -4 C14 6 4 14 -6 12 C-16 10 -20 -4 -16 -12 Z', LAND, C.ink, 1)), at(87, 63, 1, path('M-14 -10 C-4 -16 14 -10 12 2 C10 12 -6 14 -12 6 Z', '#f2dc8a', C.ink, 1), line('M-6 -8 L2 8', '#d64545', 1)), path('M8 86 L58 92 L62 92 L112 86 L112 92 L62 98 L58 98 L8 92 Z', C.navy, C.ink, 1.2), ground),
  /** politisk karta: a landmass divided into countries of different colours, with border lines and a star for each capital. */
  'kort.politisk-karta': all(rect(4, 4, 112, 108, SEA, 3, C.ink, 1.4), path(REGION, '#f2c14e', C.ink, 1.4), path('M60 30 C62 48 56 60 60 93 L96 86 C106 74 98 64 100 52 C104 36 90 26 74 28 Z', '#ef9fb5', null), path('M20 70 C22 58 12 46 22 36 C34 26 50 30 60 30 C62 48 40 54 20 70 Z', '#a8dcc0', null), path('M60 62 C80 60 96 70 98 76 C100 82 96 86 96 86 C84 96 70 92 60 93 Z', '#c7b3e6', null), path(REGION, 'none', C.ink, 1.6), line('M60 30 C62 48 56 60 60 93 M20 70 C40 54 62 48 60 30 M60 62 C80 60 96 70 98 76', C.ink, 1.6, '4 2'), star(38, 44, 4, C.red), star(82, 44, 4, C.red), star(40, 78, 4, C.red), star(80, 80, 4, C.red)),
  /** fysisk karta: the same landmass coloured by height – green lowland, brown mountains with peaks, a blue river, no borders. */
  'kort.fysisk-karta': all(rect(4, 4, 112, 108, SEA, 3, C.ink, 1.4), path(REGION, '#9ccf7a', C.ink, 1.4), path('M44 40 C60 34 84 36 90 50 C94 62 80 66 68 60 C56 56 40 54 44 40 Z', '#d9b27a', null), path('M56 44 C64 40 76 42 80 50 C76 54 64 54 56 50 Z', '#a8743e', null), ...[[60, 48], [70, 46], [78, 50]].map(([x, y]) => path(`M${x! - 4} ${y! + 3} L${x} ${y! - 4} L${x! + 4} ${y! + 3} Z`, C.white, C.ink, 0.8)), line('M66 58 C62 70 50 74 40 82 C34 86 28 90 24 92', SEA2, 2.2), path(REGION, 'none', C.ink, 1.6)),
  /** kartprojektion: a globe with a grid at the left; an arrow leads to the same grid laid flat as a rectangle at the right. */
  'kort.kartprojektion': all(bg('#f4f6f8'), globe(28, 60, 22), grid(28, 60, 22), ring(28, 60, 22), arrow(54, 60, 66, 60, HL, 3), rect(70, 30, 44, 60, SEA, 2, C.ink, 1.4), at(70, 30, 1, ...[1, 2, 3].map((i) => line(`M0 ${i * 15} L44 ${i * 15}`, C.white, 0.9)), ...[1, 2, 3, 4].map((i) => line(`M${i * 8.8} 0 L${i * 8.8} 60`, C.white, 0.9))), poly(AFR, LAND, 70, 44, 60, 0.3), poly(EUR, LAND, 70, 44, 60, 0.3), poly(SAM, LAND, 70, 44, 60, 0.3), rect(70, 30, 44, 60, 'none', 2, HL, 2.4)),
  /** förvrängd: a grey reference grid with a round island, and beside it the same grid and island stretched tall and warped in colour. */
  'kort.förvrängd': all(bg('#f4f6f8'), greyed(rect(8, 40, 36, 36, SEA, 1, C.ink, 1.2), ...[1, 2].map((i) => line(`M8 ${40 + i * 12} L44 ${40 + i * 12} M${8 + i * 12} 40 L${8 + i * 12} 76`, C.white, 1)), circle(26, 58, 8, LAND, C.ink, 1)), arrow(48, 58, 58, 58, HL, 2.4), path('M62 14 C76 10 98 10 112 14 L106 104 C92 108 80 108 68 104 Z', SEA, C.ink, 1.4), path('M66 44 C80 38 96 38 110 44 M68 74 C80 70 94 70 108 74', 'none', C.white, 1), path('M80 13 C76 40 78 76 76 106 M94 12 C98 40 96 76 98 106', 'none', C.white, 1), path('M80 30 C92 20 104 30 100 50 C98 70 90 78 84 70 C76 60 72 40 80 30 Z', LAND, C.ink, 1.2), path('M62 14 C76 10 98 10 112 14 L106 104 C92 108 80 108 68 104 Z', 'none', HL, 2.4)),
  /** datumgräns: the Pacific with Asia's edge at the left and America's at the right; a zigzag line runs down the middle, with calendar sheets 16 on the left and 15 on the right, and a plane crossing it. */
  'kort.datumgräns': all(rect(4, 4, 112, 108, SEA, 3, C.ink, 1.4), path('M4 4 L22 4 C18 30 26 50 14 70 C10 86 16 100 12 112 L4 112 Z', LAND, C.ink, 1), path('M116 4 L100 4 C104 30 96 56 106 76 C110 92 104 104 108 112 L116 112 Z', LAND, C.ink, 1), line('M60 4 L60 34 L52 46 L52 70 L64 84 L64 112', HL, 3.4), ...[[34, 30, '16'], [86, 30, '15']].map(([x, y, d]) => all(rect((x as number) - 12, (y as number) - 12, 24, 26, C.white, 2, C.ink, 1.4), rect((x as number) - 12, (y as number) - 12, 24, 7, '#d64545', 2, C.ink, 1.4), num(x as number, (y as number) + 11, d as string, 12))), at(60, 96, 0.9, path('M-14 0 C-14 -2 10 -3 14 0 C10 3 -14 2 -14 0 Z', C.white, C.ink, 1.4), path('M-2 -1 L-8 -12 L-4 -12 L6 -1 Z M-2 1 L-8 12 L-4 12 L6 1 Z', C.sky, C.ink, 1.2)), line('M24 96 L44 96', C.white, 1.2, '3 3'), waves(72, 64), waves(22, 66)),
};
