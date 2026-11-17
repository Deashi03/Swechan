/**
 * Natur & geografi → Världsgeografi → Oceanien & polarområden, 3051–3057 (0.47): Australia, New Zealand, the
 * Pacific islands, Micronesia and Polynesia, the Arctic, Antarctica and the world's oceans. Recurring signs:
 * maps drawn from one set of coarse coastlines (lon/lat) in three projections – a regional/world map, a north
 * polar and a south polar map. Sea blue, land pale green, the place the word names in orange with an orange
 * outline, other land grey. Landscape and animal scenes otherwise. Digits only; no words, no flags, no brands, no pointing.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { P, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#d6ecf8';
const SEA = '#8cc4e6';
const SEA2 = '#5fa3d0';
const DEEP = '#2f6f9f';
const LAND = '#d7e6c0';
const LAND2 = '#8cc96a';
const GREEN = '#4f9d4a';
const GREEN2 = '#3a7d3a';
const OTHER = '#d9d6d0';
const HLF = '#f6b48e';
const HLT = 'rgba(239,138,60,0.42)';
const RED = '#c2553a';
const ROCK = '#9a8a78';
const ICE = '#f4f8fb';
const ICE2 = '#cfe3ef';
const SNOW = '#f7f8fa';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND2) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.ink, 1));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5.5))} ${f1(y + Math.sin(a) * (r + 5.5))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a1', C.ink, 1.1);
const waves = (x1: number, x2: number, y: number, col: string = C.white, sw = 1.1) => line(range(Math.floor((x2 - x1) / 10)).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, sw);
const tuft = (x: number, y: number, col: string = GREEN) => line(`M${x - 3} ${y} l-1 -5 M${x} ${y} l0 -7 M${x + 3} ${y} l1 -5`, col, 1.4);
const palm = (x: number, y: number, s = 1) => at(x, y, s, path('M-1.2 0 C-1.6 -8 0 -16 2.4 -22 L4.4 -21.4 C2.4 -16 1.6 -8 1.8 0 Z', C.brown, C.ink, 0.8), path('M3 -22 C-4 -26 -11 -24 -14 -18 C-8 -22 -2 -22 3 -22 Z M3 -22 C10 -28 17 -25 18 -20 C12 -24 7 -23 3 -22 Z M3 -22 C0 -30 6 -34 10 -33 C6 -30 4 -26 3 -22 Z', GREEN, C.ink, 0.8));
let uid = 0;
/** Clip children to a shape (unique id per call). */
const clip = (shape: Svg, ...k: Svg[]) => { const id = `gop${++uid}`; return `<defs><clipPath id="${id}">${shape}</clipPath></defs><g clip-path="url(#${id})">${k.join('')}</g>`; };

// ── Coastlines (lon, lat), coarse ────────────────────────────────────
type LL = [number, number];
type Ring = LL[];
const LANDS: Record<string, Ring> = {
  NA: [[-168, 65], [-165, 69], [-156, 71], [-141, 70], [-128, 70], [-110, 68], [-95, 70], [-85, 69], [-82, 64], [-90, 60], [-94, 58], [-88, 55], [-80, 55], [-78, 62], [-72, 61], [-65, 60], [-60, 55], [-56, 52], [-60, 47], [-66, 45], [-70, 42], [-74, 40], [-76, 35], [-81, 31], [-80, 25], [-82, 27], [-84, 30], [-90, 29.5], [-97, 28], [-97, 22], [-94, 18.5], [-90, 21], [-87, 21], [-88, 16], [-84, 15], [-83, 10], [-79, 9], [-77, 8], [-80, 7.5], [-84, 9.5], [-86, 11], [-92, 14], [-96, 16], [-105, 20], [-110, 23], [-112, 26], [-114, 30], [-117, 32], [-121, 35], [-124, 40], [-124, 46], [-124, 48], [-127, 51], [-131, 55], [-136, 58], [-142, 60], [-148, 61], [-152, 59], [-158, 57], [-164, 55], [-158, 58], [-162, 60], [-165, 62]],
  GL: [[-73, 78], [-60, 82], [-30, 83.5], [-20, 82], [-18, 77], [-22, 70], [-32, 68], [-40, 65], [-43, 60], [-48, 61], [-52, 65], [-54, 69], [-58, 75], [-66, 76]],
  BAF: [[-90, 70], [-80, 73], [-68, 70], [-62, 66], [-68, 62], [-78, 64]],
  ELL: [[-120, 75], [-100, 79], [-85, 80], [-70, 82.5], [-62, 82], [-75, 78], [-80, 76], [-95, 74], [-110, 72]],
  SA: [[-80, 9], [-77, 8], [-72, 12], [-62, 10.5], [-58, 7], [-52, 5], [-50, 0], [-44, -2], [-35, -5], [-35, -9], [-39, -14], [-40, -21], [-45, -23.5], [-48, -28], [-53, -34], [-58, -38], [-62, -39], [-65, -42], [-65, -47], [-68, -51], [-68, -55], [-72, -54], [-75, -48], [-74, -42], [-73, -37], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -2], [-78, 2], [-77, 7]],
  EUAS: [[-5.5, 36], [-9, 37], [-9, 43], [-2, 43.5], [-4.5, 48], [2, 51], [5, 53], [8, 57], [10, 54], [14, 54], [20, 55], [22, 59], [30, 60], [23, 60], [22, 63], [25, 65.5], [21, 65], [17, 61], [19, 60], [16, 56], [12, 56], [10, 59], [5, 58], [5, 62], [14, 67], [20, 70], [28, 71], [33, 69.5], [41, 67], [44, 68], [54, 68.5], [60, 69], [68, 72.5], [73, 72], [80, 73], [87, 75], [100, 77], [105, 78], [113, 74], [130, 71], [140, 72], [150, 71], [160, 70], [170, 70], [180, 69], [180, 65], [178, 64], [172, 62], [163, 60], [163, 56], [157, 51], [156, 57], [160, 61], [155, 59], [142, 59], [137, 54], [141, 52], [140, 48], [135, 43], [130, 42], [129, 35], [126, 34.5], [126, 38], [125, 40], [122, 40], [119, 38], [121, 37], [120, 34], [122, 30], [120, 25], [117, 23], [110, 21], [108, 22], [106, 20], [108, 15], [109, 11.5], [105, 8.5], [103, 10], [100, 13], [99, 9], [101, 6.5], [103.5, 1.5], [101, 3], [98, 8], [98, 13], [97, 17], [94, 16], [94, 20], [91, 22.5], [87, 21.5], [86, 20], [80, 15], [80, 10], [77, 8], [73, 16], [73, 21], [70, 21], [66, 25], [57, 25.5], [56, 27], [52, 27.5], [48, 30], [50, 26], [52, 24], [56, 24.5], [59, 22.5], [57, 19], [52, 16], [43, 12.7], [39, 21], [35, 28], [32.5, 30], [34, 31.5], [36, 36], [30, 36.5], [26.5, 38], [26, 40.5], [23, 40], [24, 38], [22, 37], [21, 39.5], [19.5, 41.5], [13.5, 45.5], [12.5, 44], [16, 41.5], [18.5, 40], [16, 38], [12, 42], [9, 44.3], [6, 43.1], [3, 43.3], [3, 41.8], [0, 39.5], [-0.5, 38], [-2, 36.7]],
  AF: [[-5.8, 35.8], [-1, 35.2], [5, 36.8], [10, 37.2], [11, 35], [10, 33.5], [15, 32.3], [20, 30.5], [20, 32.5], [25, 32], [32.5, 31.2], [34.5, 28], [37, 21], [39, 15.5], [43, 12.5], [51, 11.8], [51, 10], [48, 5], [42, -1], [40, -5], [40, -11], [41, -15], [35, -23], [33, -26], [32, -29], [27.5, -33.7], [20, -34.8], [18, -32], [15, -27], [12, -18], [13.5, -12], [12, -6], [9, -1], [9.5, 3.5], [6, 4.3], [2, 6.3], [-3, 5], [-8, 4.5], [-13, 8], [-17, 14.5], [-16.5, 19.5], [-17, 21], [-13, 27.5], [-10, 29.5], [-9.6, 31], [-6.5, 34]],
  MAD: [[49.3, -12], [50.4, -15.5], [47.2, -25], [44, -24.5], [43.5, -21], [44.3, -16.2]],
  UK: [[-5.5, 50], [1.5, 51], [1.7, 52.7], [-0.3, 53.5], [-2, 55.8], [-1.8, 57.6], [-3, 58.6], [-5, 58.6], [-6.2, 56.5], [-4.8, 55], [-3, 54], [-4.7, 52.8]],
  IRL: [[-6, 52], [-6, 54], [-7.5, 55.3], [-10, 54], [-10, 51.6]],
  ISL: [[-24, 65.5], [-22, 66.4], [-14, 66.2], [-13.6, 65], [-18, 63.4], [-22.5, 63.8]],
  SVA: [[11, 78.5], [16, 76.6], [22, 77.5], [27, 79.5], [20, 80.5], [11, 79.7]],
  NZE: [[52, 71], [57, 70.6], [60, 73], [68, 76.8], [60, 76.5], [54, 74]],
  JPN: [[130, 31], [131.5, 31.5], [132, 34], [135, 34], [136.8, 34.5], [139, 35], [140.8, 35.7], [141, 38], [142, 40], [141.3, 41.3], [140, 40.5], [139.8, 38.5], [136.8, 37.3], [136, 36], [133, 35.5], [131, 34.4], [130, 33.5]],
  HOK: [[140, 41.5], [141, 43.2], [141.8, 45.4], [145.5, 43.3], [143.3, 42], [141, 41.8]],
  TWN: [[120.2, 23], [121, 25.2], [122, 25], [121, 22]],
  LUZ: [[120, 18.5], [122, 18.5], [122, 14], [124, 13], [121, 13.5], [120, 15]],
  MIN: [[122, 8], [125, 9.5], [126.5, 7], [125.5, 5.8], [122, 7]],
  BOR: [[109, 1.5], [111, 2.8], [113, 3.2], [116, 6.8], [117.5, 5], [119, 5], [118, 1], [117, -1], [116, -4], [111, -3.2], [110, -1.5]],
  SUM: [[95.3, 5.6], [98, 4], [104, -2], [105.8, -5.8], [104.5, -5.9], [101, -2.5], [98.6, 1]],
  JAV: [[105.2, -6.8], [106, -6], [111, -6.5], [114.5, -7.8], [114.4, -8.7], [108, -7.8]],
  SUL: [[119.5, -5.5], [119, -3], [120, 0.5], [121, 1.3], [125, 1.5], [123, 0.4], [121, -1], [123, -1], [121, -2.5], [122, -4.5], [120.5, -5.5]],
  SRI: [[79.8, 6.5], [80, 9.6], [81.8, 7.5], [80.5, 6]],
  CUB: [[-85, 21.8], [-80, 23], [-76, 21], [-74.2, 20.2], [-77.5, 19.9], [-80, 21.7], [-84, 21.6]],
  NGW: [[131, -1], [134, -1], [136, -2.3], [138, -1.6], [141, -2.6], [141, -9.2], [138, -8.3], [137.8, -5], [134.5, -4], [132, -2.8]],
  NGE: [[141, -2.6], [145, -4], [146, -6], [148, -8.2], [150.5, -10.5], [147, -10], [144, -7.8], [143, -9], [141, -9.2]],
  NBR: [[148.3, -5.5], [150, -5.2], [151.5, -4.3], [152.3, -4.5], [151.5, -5.6], [150, -6.3], [148.3, -5.8]],
  NIR: [[150.5, -2.6], [152, -3.3], [153, -4.6], [152.7, -4.8], [151.3, -3.6]],
  BOU: [[154.6, -5.1], [155.9, -6.4], [155.6, -6.9], [154.7, -5.6]],
  AUS: [[113.5, -22], [114, -26], [115, -33.6], [117.5, -35], [123, -33.8], [126, -32.3], [131, -31.5], [134.2, -32.8], [135.5, -34.8], [137.8, -33], [138, -35.6], [140, -38], [144, -38.3], [146.5, -39], [150, -37.5], [150.8, -34.5], [153, -31], [153.5, -28], [153, -25.5], [150.8, -22.5], [146, -18.5], [145.3, -15], [143.5, -14], [142.5, -10.7], [141.5, -13], [141.6, -17], [139.5, -17.5], [136, -15], [136.8, -12.2], [132.5, -11.4], [130, -13], [129, -15], [126.5, -14], [122.3, -17], [121, -19.5], [117, -20.7], [114, -21.8]],
  TAS: [[144.6, -40.7], [148.3, -40.9], [148, -43.2], [146.7, -43.6], [145.2, -42.2]],
  NZN: [[172.7, -34.4], [174.5, -35.6], [175.5, -36.8], [176, -37.6], [178.5, -37.7], [177.9, -39.2], [176.9, -39.5], [176, -41.2], [175.2, -41.6], [174.6, -41.3], [175, -40], [174, -39.3], [174.6, -38], [174.4, -36.5], [173, -35.3]],
  NZS: [[172.7, -40.5], [174.3, -41.3], [173.9, -42.3], [172.8, -43.4], [171.2, -44.4], [170.7, -45.9], [169, -46.6], [166.5, -46], [166.6, -45.3], [168.2, -44.2], [170.5, -43], [171.6, -41.7], [172.1, -40.8]],
  NCL: [[164, -20.2], [165, -20.6], [167, -22.2], [166.4, -22.4], [164.2, -20.8]],
  ANT: [[0, -70], [20, -70], [40, -69], [60, -67], [80, -67], [100, -66], [120, -66.5], [140, -66.5], [160, -70], [170, -72], [180, -78], [-160, -78], [-150, -77], [-140, -75], [-120, -73.5], [-100, -73], [-80, -73], [-70, -68], [-57, -63.3], [-60, -66], [-62, -70], [-60, -75], [-45, -78], [-30, -77], [-20, -73], [-10, -71]],
};
const NORTHK = Object.keys(LANDS).filter((k) => k !== 'ANT');
const OCEANIA = ['AUS', 'TAS', 'NZN', 'NZS', 'NGW', 'NGE', 'NBR', 'NIR', 'BOU', 'NCL'];
// Island groups as dots (lon, lat)
const MEL: LL[] = [[157, -8], [159.5, -9.5], [161, -9.8], [167, -15.5], [168, -17.5], [178, -17.8], [179.5, -16.5]];
const MIC: LL[] = [[134.5, 7.5], [138, 9.5], [144.8, 13.4], [145.7, 15.2], [151.8, 7.4], [158.2, 6.9], [163, 5.3], [168, 9], [171, 7], [171.5, 10], [166.9, -0.5], [173, 1.4], [174, -1], [176, -2.5]];
const POL: LL[] = [[-155.5, 19.5], [-157, 21], [-159.5, 22], [-172, -13.7], [-175, -21], [-174, -19], [179, -8], [-159.8, -21.2], [-149.4, -17.6], [-140, -9], [-145, -16], [-142, -18], [-109.4, -27.1], [-157.4, 1.9], [-171.7, -3.7], [-130, -25], [-149, -23]];

// ── Projections ──────────────────────────────────────────────────────
type Proj = (p: LL) => [number, number];
/** Equirectangular around (lon, lat) at k px per degree (ky vertically), centre at (cx, cy). */
const eq = (lon0: number, lat0: number, k: number, ky = k, cx = 60, cy = 58): Proj => (p) => [cx + (p[0] - lon0) * k, cy - (p[1] - lat0) * ky];
/** North polar (azimuthal equidistant): longitude `rot` points down; (ox, oy) shifts the pole. */
const north = (k: number, rot = 0, ox = 60, oy = 58): Proj => (p) => { const r = (90 - p[1]) * k, a = ((p[0] - rot) * Math.PI) / 180; return [ox + r * Math.sin(a), oy + r * Math.cos(a)]; };
/** South polar: longitude `rot` points up. */
const south = (k: number, rot = 0, ox = 60, oy = 58): Proj => (p) => { const r = (90 + p[1]) * k, a = ((p[0] - rot) * Math.PI) / 180; return [ox + r * Math.sin(a), oy - r * Math.cos(a)]; };
const shift = (r: Ring, d: number): Ring => r.map(([a, b]) => [a + d, b] as LL);
const ringD = (r: Ring, f: Proj) => 'M' + r.map((p) => { const [x, y] = f(p); return `${f1(x)} ${f1(y)}`; }).join(' L') + ' Z';
const lineD = (r: Ring, f: Proj) => 'M' + r.map((p) => { const [x, y] = f(p); return `${f1(x)} ${f1(y)}`; }).join(' L');

type MapOpts = { hl?: string[]; dim?: string[]; only?: string[]; wrap?: boolean; under?: Svg; over?: Svg; sea?: string; landCol?: string; dimAll?: boolean; outline?: boolean };
/** Land polygons in a projection: `hl` orange, `dim` (or all when dimAll) grey. */
const lands = (f: Proj, o: MapOpts = {}) => {
  const keys = o.only ?? Object.keys(LANDS);
  const shifts = o.wrap ? [-360, 0, 360] : [0];
  const fill = (k: string) => (o.hl?.includes(k) ? HLF : o.dim?.includes(k) || (o.dimAll && !o.hl?.includes(k)) ? OTHER : (o.landCol ?? LAND));
  return all(...keys.flatMap((k) => shifts.map((d) => path(ringD(shift(LANDS[k]!, d), f), fill(k), C.ink, 0.8))),
    ...(o.outline === false ? [] : (o.hl ?? []).flatMap((k) => shifts.map((d) => path(ringD(shift(LANDS[k]!, d), f), 'none', HL, 1.8)))));
};
const dots = (ps: LL[], f: Proj, col: string = LAND, r = 1.5, sw = 0.7) => all(...ps.map((p) => { const [x, y] = f(p); return circle(f1(x), f1(y), r, col, C.ink, sw); }));
/** A rectangular map tile. */
const tile = (f: Proj, o: MapOpts = {}, box: [number, number, number, number] = [4, 4, 112, 108]) => {
  const [x, y, w, h] = box;
  return all(clip(rect(x, y, w, h, '#000', 3, null), rect(x, y, w, h, o.sea ?? SEA, 3, null), o.under ?? '', lands(f, o), o.over ?? ''), rect(x, y, w, h, 'none', 3, C.ink, 1.2));
};
/** A round polar map (radius R around cx, cy). */
const disc = (f: Proj, R: number, o: MapOpts = {}, cx = 60, cy = 58) => all(clip(circle(cx, cy, R, '#000', null), circle(cx, cy, R, o.sea ?? SEA, null), o.under ?? '', lands(f, o), o.over ?? ''), circle(cx, cy, R, 'none', C.ink, 1.4));
const polarBg = () => rect(4, 4, 112, 108, '#e9eef3', 3, null);

// World maps (equirectangular, wraps)
const W = (lon0: number) => eq(lon0, 4, 112 / 360, 0.5);
const OCEAN: Record<string, Ring> = {
  PAC: [[100, 60], [192, 66], [260, 66], [280, 9], [293, -56], [293, -62], [147, -62], [147, -40], [130, -10], [105, -6], [100, 20]],
  ATL: [[-80, 66], [-30, 70], [-5, 62], [-6, 36], [10, 0], [20, -35], [20, -62], [-67, -62], [-67, -56], [-80, 9], [-98, 22]],
  IND: [[20, -62], [20, -35], [40, 15], [32, 30], [48, 31], [60, 28], [90, 25], [100, 18], [105, -6], [130, -10], [147, -40], [147, -62]],
};
const world = (lon0: number, ocean: string) => { const f = W(lon0); return tile(f, { wrap: true, sea: SEA, under: all(...[-360, 0, 360].map((d) => path(ringD(shift(OCEAN[ocean]!, d), f), HLF, null))), over: all(...[-360, 0, 360].map((d) => path(ringD(shift(OCEAN[ocean]!, d), f), 'none', HL, 1.6, ))) }); };

// Pacific frame (Oceania)
const PF = eq(186, -12, 0.8);
const pacific = (o: MapOpts, extra: Svg = '') => tile(PF, { wrap: true, ...o, over: all(o.over ?? '', extra) });
const regionOutline = (ps: LL[], f: Proj) => path(ringD(ps, f), HLT, HL, 1.6);

// North polar views
const NP = north(1.6, 0);
const npBase = (o: MapOpts) => all(polarBg(), disc(NP, 52, { only: NORTHK, ...o }));
const circleLat = (f: Proj, lat: number, col: string, sw = 1.4, dash = '3 2') => line(lineD(range(73).map((i) => [i * 5 - 180, lat] as LL), f), col, sw, dash);
// South polar views
const SP = south(1.15, 0);

// ── Small drawings ───────────────────────────────────────────────────
const hood = (x: number, h: number, col: string) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${f1(s)})`, circle(0, -54, 9.5, 'none', col, 3.2), circle(0, -54, 11, 'none', '#e8e0d0', 1.6)); };
const goggles = (x: number, h: number) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${f1(s)})`, rect(-6.5, -58.5, 13, 5, '#3d5a80', 2, C.ink, 1)); };
const demonym = (map: Svg, top: string, more: Svg = '') => all(bg('#f2efe8'), map, line('M30 50 L44 44', C.grey, 1.2, '3 2'), P({ x: 24, h: 0.72, top, bottom: C.navy, mood: 'smile' }), more);
const kangaroo = (x: number, y: number, s = 1, joey = true) => at(x, y, s,
  path('M-34 0 C-24 -1 -14 -4 -8 -10 C-12 -22 -8 -36 2 -44 C6 -48 9 -52 11 -56 L9 -66 L14 -60 L16 -68 L18 -58 C24 -56 29 -53 27 -49 C23 -49 19 -48 16 -45 C17 -39 16 -31 13 -24 C15 -16 18 -7 23 -2 L27 0 L9 0 C5 -4 1 -6 -5 -6 C-14 -3 -24 0 -34 0 Z', '#c98a54', C.ink, 1.3),
  line('M10 -38 L18 -32 M11 -35 L17 -28', '#a86a3a', 2), circle(19, -55, 1.2, C.ink, null),
  joey ? all(path('M2 -22 C8 -20 12 -24 13 -28', 'none', C.ink, 1), circle(9, -27, 3.6, '#d8a06a', C.ink, 1), path('M8 -30 L7 -34 L10 -31 Z', '#d8a06a', C.ink, 0.8), circle(10.6, -27.6, 0.7, C.ink, null)) : '');
const koala = (x: number, y: number, s = 1) => at(x, y, s,
  ellipse(0, 10, 14, 18, '#9aa0a8', C.ink, 1.3), ellipse(0, 14, 8, 11, '#c9ced4', null),
  circle(-12, -16, 8, '#9aa0a8', C.ink, 1.3), circle(12, -16, 8, '#9aa0a8', C.ink, 1.3), circle(-12, -16, 4.6, '#f1eeea', null), circle(12, -16, 4.6, '#f1eeea', null),
  circle(0, -8, 12, '#9aa0a8', C.ink, 1.3), ellipse(0, -5, 3.6, 5, C.black, null), circle(-5, -11, 1.4, C.ink, null), circle(5, -11, 1.4, C.ink, null));
const euLeaf = (x: number, y: number, a: number, s = 1) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, path('M0 0 C3 6 4 14 1 22 C-2 14 -2 6 0 0 Z', '#7fae8a', C.ink, 0.6));
const kiwiBird = (x: number, y: number, s = 1) => at(x, y, s, line('M-2 0 L-4 8 L-8 8 M4 0 L4 8 L8 8', '#c9a060', 1.8), ellipse(0, -8, 18, 12, '#8a6a46', C.ink, 1.3), line('M-12 -12 l3 2 M-6 -16 l3 2 M2 -16 l3 2 M8 -12 l3 2 M-8 -6 l3 2 M0 -8 l3 2', '#6a4e30', 0.9), circle(15, -14, 6, '#8a6a46', C.ink, 1.2), circle(17, -16, 1, C.ink, null), path('M20 -13 C28 -10 32 -2 34 6', 'none', '#e6d29a', 2.2));
const penguin = (x: number, y: number, s = 1, dir = 1) => at(x, y, s, g(`scale(${dir} 1)`, path('M-7 0 C-10 -10 -9 -24 -4 -30 C-2 -34 4 -34 5 -30 C9 -24 10 -10 7 0 Z', C.black, C.ink, 1.1), path('M-3 -2 C-6 -10 -5 -22 -1 -26 C2 -24 5 -14 4 -2 Z', C.white, null), path('M5 -29 L10 -28 L5 -27 Z', C.orange, C.ink, 0.6), circle(2, -30, 0.9, C.white, null), path('M-6 -20 C-11 -14 -11 -8 -9 -4', 'none', C.black, 3), ellipse(-3, 0.5, 3, 1.2, C.orange, null), ellipse(3, 0.5, 3, 1.2, C.orange, null)));
const iceShip = (x: number, y: number, s = 1, hull: string = '#c8352a') => at(x, y, s, path('M-26 0 L22 0 L30 -10 L-28 -10 Z', hull, C.ink, 1.3), rect(-18, -20, 22, 10, C.white, 1, C.ink, 1.1), rect(-14, -28, 12, 8, C.white, 1, C.ink, 1), rect(-12, -26, 8, 3, '#7fb4d8', 0, null), rect(8, -18, 4, 8, C.dark, 0.5, null), line('M-24 -5 L26 -5', C.white, 1));
const floe = (x: number, y: number, w: number, h = 3) => path(`M${x - w / 2} ${y} L${x - w / 2 + 2} ${y - h} L${x + w / 2 - 1} ${y - h} L${x + w / 2} ${y} Z`, ICE, C.ink, 0.8);
const moaiIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M-2 0 L-2.4 -8 C-2.6 -11 2.6 -11 2.4 -8 L2 0 Z', '#7a6e62', C.ink, 0.6));
const snowStreaks = (n: number, seed = 1) => all(...range(n).map((i) => { const x = 6 + ((i * 37 + seed * 11) % 104), y = 8 + ((i * 23 + seed * 7) % 96); return line(`M${x} ${y} l${8 + (i % 3) * 3} 1.6`, 'rgba(255,255,255,0.9)', 1.4); }));
const flakes = (n: number, seed = 1) => all(...range(n).map((i) => circle(6 + ((i * 29 + seed * 13) % 106), 8 + ((i * 41 + seed * 5) % 98), 1.2, C.white, null)));

// ── Regional views ───────────────────────────────────────────────────
const AU = eq(134, -26, 2.2);
const NZ = eq(172.5, -41, 6.5);
const nzMap = (hl: string[], over: Svg = '') => tile(NZ, { hl, only: ['NZN', 'NZS', 'AUS', 'TAS'], over });
const GBR = eq(147, -18, 5);
const reefLine: LL[] = [[144.2, -10.5], [144.6, -12.5], [146, -14.6], [147.3, -16.6], [148.6, -18], [150.2, -19.2], [151.8, -20.4], [153, -22], [153.8, -23.6]];
const PNG = eq(146, -6, 5);
const KIR = eq(189, -1, 2.4);
const KIRI: LL[] = [[173, 1.4], [172.9, 3], [173.4, -0.2], [174, -1], [175, -1.8], [176, -2.5], [-171.7, -3.7], [-171.2, -4.5], [-172.2, -4.6], [-157.4, 1.9], [-159.3, 3.9], [-160.4, 4.7], [-155, -4], [-155.9, -5.6], [-152, -11.4]];
const HAW = eq(202.7, 20.6, 17);
const HAWI: Record<string, Ring> = {
  big: [[-155.9, 20.3], [-155.0, 20.0], [-154.8, 19.5], [-155.6, 18.9], [-155.9, 19.1], [-156.1, 19.7]],
  maui: [[-156.7, 21.0], [-156.0, 20.9], [-155.98, 20.7], [-156.4, 20.6], [-156.7, 20.8]],
  molo: [[-157.3, 21.2], [-156.7, 21.2], [-156.7, 21.05], [-157.3, 21.1]],
  lanai: [[-157.05, 20.9], [-156.8, 20.9], [-156.85, 20.75], [-157.0, 20.75]],
  oahu: [[-158.3, 21.6], [-157.9, 21.7], [-157.65, 21.3], [-158.1, 21.3]],
  kauai: [[-159.8, 22.2], [-159.3, 22.2], [-159.3, 21.9], [-159.7, 21.9]],
  niihau: [[-160.25, 22.0], [-160.05, 22.0], [-160.1, 21.8]],
};
const RAPA: Ring = [[-109.44, -27.18], [-109.42, -27.08], [-109.33, -27.05], [-109.23, -27.08], [-109.24, -27.13], [-109.38, -27.2]];
const GS = eq(-40, 40, 1.1);
const gulfStream: LL[] = [[-90, 25], [-82, 24.5], [-79.5, 28], [-76, 34], [-70, 38.5], [-60, 41], [-45, 45], [-32, 50], [-18, 56], [-6, 61], [5, 66], [12, 69.5]];
const NWP: LL[] = [[-168, 65.8], [-162, 70.5], [-150, 71.6], [-130, 71.2], [-115, 71], [-100, 72.2], [-90, 74.1], [-80, 74.3], [-70, 72.5], [-62, 68], [-58, 63]];

// ── Motifs ───────────────────────────────────────────────────────────
export const OCEANIA_POLAR_MOTIFS: Record<string, Svg> = {
  // 3051 Australiska landskap
  'gop.Australien': tile(AU, { hl: ['AUS', 'TAS'], dimAll: true, only: ['AUS', 'TAS', 'NGW', 'NGE', 'NBR', 'SUL', 'JAV', 'BOR', 'NZN', 'NZS', 'NCL'] }),
  'gop.Uluru': all(bg('#f6e3c6'), sun(98, 20, 7), path('M4 84 L116 82 L116 112 L4 112 Z', '#d9773e', null), line('M4 84 L116 82', C.ink, 1), path('M14 84 C16 66 24 56 40 52 C54 48 74 48 88 54 C100 58 106 70 108 83 Z', RED, C.ink, 1.6), path('M30 60 C34 70 34 78 32 84 M52 52 C55 64 56 74 54 84 M74 52 C76 62 78 74 76 84 M94 60 C96 70 98 76 98 83', 'none', '#9a3e2a', 1.2), path('M18 76 C40 72 80 72 104 76', 'none', '#e08a5a', 1.2), ...[[10, 96], [26, 104], [44, 94], [66, 102], [86, 96], [104, 106], [56, 108]].map(([x, y]) => tuft(x!, y!, '#a8a040')), path('M8 84 L8 78 L10 80 L12 76 L14 84 Z', '#7a8a40', null)),
  'gop.eukalyptus': all(bg('#e4f0f4'), field(100, '#c9b77a'), path('M54 100 C56 80 52 60 46 44 M58 100 C60 82 62 62 70 40 M56 76 C66 66 80 60 90 50 M55 70 C46 60 34 54 24 50', 'none', C.ink, 5.2), path('M54 100 C56 80 52 60 46 44 M58 100 C60 82 62 62 70 40 M56 76 C66 66 80 60 90 50 M55 70 C46 60 34 54 24 50', 'none', '#e8e2d4', 3.6), path('M54 92 C55 86 54 82 56 78 M57 64 C58 60 60 56 62 52', 'none', '#b8a88a', 1), ...[[24, 46], [34, 40], [46, 38], [60, 30], [70, 34], [82, 42], [92, 46], [40, 50], [76, 50], [52, 26], [64, 22], [28, 56], [88, 54]].flatMap(([x, y], i) => [euLeaf(x!, y!, -30 + (i % 5) * 15, 0.9), euLeaf(x! + 4, y! - 2, 10 + (i % 4) * 12, 0.8)]), rect(80, 66, 34, 32, C.white, 3, C.ink, 1.2), euLeaf(92, 70, -20, 1.1), euLeaf(100, 70, 20, 1.1), ...[[90, 92], [97, 93], [104, 92]].map(([x, y]) => all(circle(x!, y!, 2.6, '#8a6a46', C.ink, 0.7), circle(x!, y! - 0.6, 0.9, C.ink, null)))),
  'gop.känguru': all(bg('#f6e3c6'), sun(22, 20, 6), field(96, '#d9773e'), ...[[10, 104], [96, 106], [110, 100]].map(([x, y]) => tuft(x!, y!, '#a8a040')), path('M80 96 C84 80 92 78 98 70 C96 82 102 88 106 96 Z', '#9aa060', C.ink, 0.8), kangaroo(52, 96, 1.25)),
  'gop.koala': all(bg('#e4f0f4'), path('M70 4 L70 112 L86 112 L86 4 Z', '#e8e2d4', C.ink, 1.3), line('M74 20 C76 30 74 40 76 50 M82 60 C80 70 82 80 80 90', '#b8a88a', 1), path('M86 30 C96 26 104 20 112 14', 'none', '#b8a88a', 3), ...[[100, 18, 30], [108, 12, 10], [94, 24, 50], [112, 20, 60]].map(([x, y, a]) => euLeaf(x!, y!, a!, 1)), koala(62, 64, 1.25), path('M74 46 C80 40 84 44 86 46 M74 76 C80 72 84 74 86 78', 'none', '#9aa0a8', 5), path('M58 52 C56 48 60 44 64 46', 'none', C.ink, 0.8), euLeaf(48, 52, -60, 1), field(106, '#9ab86a')),
  'gop.Stora-barriärrevet': tile(GBR, { only: ['AUS', 'NGE', 'NGW'], dim: ['NGE', 'NGW'], over: all(line(lineD(reefLine, GBR), '#f2f0e0', 7), line(lineD(reefLine, GBR), '#e88aa0', 4.4, '2 1.6'), line(lineD(reefLine, GBR), HL, 1.6), ...reefLine.slice(1, -1).map((p, i) => { const [x, y] = GBR(p); return circle(f1(x + 4 + (i % 2) * 2), f1(y + 2), 1.2, C.yellow, C.ink, 0.5); }), at(26, 92, 1, rect(-20, -14, 40, 24, '#9fd6e8', 3, C.ink, 1), path('M-14 8 C-14 -2 -8 -4 -8 4 M-6 8 C-6 -6 2 -6 0 8 M4 8 C2 -2 10 -4 10 8', 'none', '#e86a8a', 2.4), circle(12, -6, 2.4, C.orange, C.ink, 0.6))) }),
  // 3052 Nya Zeelands geografi
  'gop.Nya-Zeeland': tile(eq(160, -36, 2.4), { hl: ['NZN', 'NZS'], dimAll: true, only: ['AUS', 'TAS', 'NZN', 'NZS', 'NCL', 'NGE'] }),
  'gop.Nordön': nzMap(['NZN'], all(...[[175.6, -39.2], [175.6, -39.3]].map((p) => { const [x, y] = NZ(p as LL); return path(`M${f1(x - 3)} ${f1(y + 2)} L${f1(x)} ${f1(y - 3)} L${f1(x + 3)} ${f1(y + 2)} Z`, ROCK, C.ink, 0.6); }))),
  'gop.Sydön': nzMap(['NZS']),
  'gop.Sydalperna': all(bg('#d6ecf8'), path('M4 88 L18 50 L28 64 L40 30 L52 56 L62 38 L74 60 L86 26 L98 52 L110 40 L116 50 L116 98 L4 98 Z', ROCK, C.ink, 1.3), path('M14 61 L18 50 L22 56 Z M34 46 L40 30 L45 42 L41 40 Z M58 47 L62 38 L66 46 L62 44 Z M80 42 L86 26 L91 40 L86 37 Z M106 47 L110 40 L114 46 Z', SNOW, C.ink, 0.9), path('M86 37 C84 50 80 62 78 74 L84 74 C86 62 88 50 86 37 Z', ICE2, C.ink, 0.8), field(96, LAND2), ...range(5).map((i) => ellipse(20 + i * 9, 104 - (i % 2) * 3, 3, 2, C.white, C.ink, 0.6)), at(0, 0, 1, rect(72, 74, 42, 34, SEA, 2, C.ink, 1), clip(rect(72, 74, 42, 34, '#000', 2, null), lands(eq(172.5, -41, 2.3, 2.3, 93, 91), { only: ['NZN', 'NZS'], landCol: LAND }), line(lineD([[168, -45], [169.5, -44], [170.8, -43.2], [172, -42.4], [173, -41.8]], eq(172.5, -41, 2.3, 2.3, 93, 91)), HL, 2.4)))),
  'gop.kiwi': all(bg('#2e3b5c'), moon(96, 20, 7), ...[[20, 14], [44, 24], [70, 12], [30, 34]].map(([x, y]) => circle(x!, y!, 0.9, C.white, null)), path('M4 84 C30 80 80 82 116 78 L116 112 L4 112 Z', '#4a6a3a', C.ink, 1), path('M8 84 C10 70 16 62 26 60 C20 70 18 78 20 84 Z M100 80 C102 66 108 60 114 58 C112 68 110 74 112 80 Z', '#3a5a2a', C.ink, 0.8), kiwiBird(54, 96, 1.5), ...[[18, 100], [100, 98], [82, 106]].map(([x, y]) => tuft(x!, y!, '#6a8a4a'))),
  'gop.trädormbunke': all(bg('#dfeee2'), field(102, '#7aa65a'), path('M58 102 C59 80 59 60 60 40 L65 40 C64 60 64 80 65 102 Z', '#5a4030', C.ink, 1.2), line('M59 92 l5 0 M59 84 l5 0 M60 76 l4 0 M60 68 l4 0 M60 60 l4 0 M60 52 l4 0', '#3e2a1e', 1), ...[-150, -120, -90, -60, -30, -165, -15].map((a) => { const r = (a * Math.PI) / 180, x2 = 62 + Math.cos(r) * 42, y2 = 40 + Math.sin(r) * 22 + 14; return all(path(`M62 40 Q${f1(62 + Math.cos(r) * 22)} ${f1(40 + Math.sin(r) * 24)} ${f1(x2)} ${f1(y2)}`, 'none', GREEN2, 2), ...range(7).map((i) => { const t = (i + 1) / 8, px = 62 + (x2 - 62) * t, py = 40 + (y2 - 40) * t - Math.sin(t * Math.PI) * 8; return line(`M${f1(px)} ${f1(py)} l${f1(-3 + Math.cos(r) * 2)} 4 M${f1(px)} ${f1(py)} l${f1(3 + Math.cos(r) * 2)} 4`, GREEN, 1.6); })); }), greyed(at(18, 102, 1, line('M0 0 C-4 -8 -10 -12 -14 -12 M0 0 C2 -10 0 -16 -2 -20 M0 0 C4 -8 10 -12 12 -12', GREEN, 1.6))), P({ x: 96, h: 0.4, top: C.orange })),
  // 3053 Stilla havets övärld
  'gop.Stilla-havet': world(200, 'PAC'),
  'gop.Oceanien': pacific({ hl: OCEANIA, dimAll: true }, all(dots(MEL, PF, HLF, 1.5), dots(MIC, PF, HLF, 1.3), dots([...POL, ...POL.map(([a, b]) => [a + 360, b] as LL)], PF, HLF, 1.3))),
  'gop.Melanesien': pacific({ hl: ['NGW', 'NGE', 'NBR', 'NIR', 'BOU', 'NCL'], dim: ['EUAS', 'LUZ', 'MIN', 'BOR', 'SUL', 'JAV', 'SUM', 'TWN', 'JPN', 'HOK'] }, all(regionOutline([[129, 0], [160, -2], [182, -12], [182, -22], [160, -24], [140, -12], [129, -6]], PF), dots(MEL, PF, HLF, 1.7), dots(MIC, PF, LAND, 1.2), dots([...POL.map(([a, b]) => [a + 360, b] as LL)], PF, LAND, 1.2))),
  'gop.Papua-Nya-Guinea': tile(PNG, { hl: ['NGE', 'NBR', 'NIR', 'BOU'], only: ['NGW', 'NGE', 'NBR', 'NIR', 'BOU', 'AUS', 'SUL'], dim: ['AUS', 'SUL'], over: all(...[[147.2, -6.5], [145, -5.6], [143.5, -5.8]].map((p) => { const [x, y] = PNG(p as LL); return path(`M${f1(x - 3)} ${f1(y + 2)} L${f1(x)} ${f1(y - 3)} L${f1(x + 3)} ${f1(y + 2)} Z`, ROCK, C.ink, 0.6); }), line(`M${f1(PNG([141, -2.6])[0])} ${f1(PNG([141, -2.6])[1])} L${f1(PNG([141, -9.2])[0])} ${f1(PNG([141, -9.2])[1])}`, C.ink, 1.2, '2 1.5')) }),
  'gop.korallö': all(bg(), greyed(path('M8 70 L24 34 L32 44 L44 70 Z', ROCK, C.ink, 1.2), path('M18 47 L24 34 L28 42 Z', '#7a9a5a', null)), rect(4, 70, 112, 42, SEA2, 0, null), line('M4 70 L116 70', C.ink, 1), path('M44 70 C44 66 50 63 60 63 L96 63 C106 63 112 66 112 70 Z', '#f6ecc8', C.ink, 1.3), ...[[62, 63], [74, 63], [88, 63], [100, 64]].map(([x, y], i) => palm(x!, y!, 0.75 + (i % 2) * 0.15)), path('M36 70 C36 76 40 80 46 80 L108 80 C114 80 116 76 116 72', 'none', '#7fd6d0', 3), line('M44 82 L112 82', '#e8a0b0', 2.4, '3 2'), waves(8, 40, 86), waves(10, 110, 100), line('M114 70 L114 63', HL, 1.6), line('M111 63 L116 63 M111 70 L116 70', HL, 1.6)),
  'gop.cyklon': all(rect(4, 4, 112, 108, DEEP, 3, null), path('M60 58 m-4 0 C-4 -16 30 -26 46 -10 C40 -20 18 -22 6 -8 Z M60 58 m4 0 C64 74 30 84 14 68 C20 78 42 80 54 66 Z', C.white, null), ...range(4).map((i) => path(`M60 58 m0 0 c${-10 - i * 9} ${-6 - i * 4} ${-6 - i * 10} ${-26 - i * 6} ${14 + i * 4} ${-28 - i * 7}`, 'none', 'rgba(255,255,255,0.85)', 5 - i)), ...range(4).map((i) => path(`M60 58 c${10 + i * 9} ${6 + i * 4} ${6 + i * 10} ${26 + i * 6} ${-14 - i * 4} ${28 + i * 7}`, 'none', 'rgba(255,255,255,0.85)', 5 - i)), ...range(4).map((i) => path(`M60 58 c${-6 - i * 4} ${10 + i * 9} ${-26 - i * 6} ${6 + i * 10} ${-28 - i * 7} ${-14 - i * 4}`, 'none', 'rgba(255,255,255,0.7)', 4 - i * 0.8)), ...range(4).map((i) => path(`M60 58 c${6 + i * 4} ${-10 - i * 9} ${26 + i * 6} ${-6 - i * 10} ${28 + i * 7} ${14 + i * 4}`, 'none', 'rgba(255,255,255,0.7)', 4 - i * 0.8)), circle(60, 58, 4.4, DEEP, C.ink, 1), ellipse(96, 96, 8, 4, LAND2, C.ink, 1), arrow(84, 18, 104, 30, C.white, 2)),
  // 3054 Mikronesien och Polynesien
  'gop.Mikronesien': pacific({ dimAll: true }, all(regionOutline([[128, 4], [130, 16], [146, 22], [175, 14], [178, 2], [177, -5], [163, -3], [140, 2]], PF), line(lineD([[110, 0], [260, 0]], PF), C.white, 1.2, '3 2'), dots(MIC, PF, HLF, 1.8), dots(MEL, PF, LAND, 1.2), dots([...POL.map(([a, b]) => [a + 360, b] as LL)], PF, LAND, 1.2))),
  'gop.Kiribati': tile(KIR, { only: [], over: all(line(lineD([[160, 0], [215, 0]], KIR), C.white, 1.6, '4 3'), line(lineD([[180, 24], [180, 5], [210, 5], [210, -11], [180, -11], [180, -24]], KIR), C.dark, 1.4, '2 2'), dots(KIRI.map(([a, b]) => [a < 0 ? a + 360 : a, b] as LL), KIR, HLF, 2.2, 0.8), dots([[179, -8], [179.2, -9], [166.9, -0.5]], KIR, LAND, 1.8)) }),
  'gop.Hawaii': all(tile(HAW, { only: [], over: all(...Object.values(HAWI).map((r) => path(ringD(shift(r, 360), HAW), HLF, HL, 1.6)), ...[[-155.6, 19.5], [-155.3, 19.8]].map((p) => { const [x, y] = HAW([p[0]! + 360, p[1]!]); return path(`M${f1(x - 4)} ${f1(y + 2)} L${f1(x)} ${f1(y - 2)} L${f1(x + 4)} ${f1(y + 2)} Z`, '#b9ab98', C.ink, 0.7); })) }), rect(6, 72, 40, 38, SEA, 2, C.ink, 1), clip(rect(6, 72, 40, 38, '#000', 2, null), lands(eq(200, 15, 0.32, 0.32, 26, 91), { wrap: true, only: ['NA', 'EUAS', 'AUS', 'JPN', 'SA'], landCol: OTHER }), circle(f1(eq(200, 15, 0.32, 0.32, 26, 91)([202.5, 20.5])[0]), f1(eq(200, 15, 0.32, 0.32, 26, 91)([202.5, 20.5])[1]), 2.6, HLF, HL, 1.4))),
  'gop.ökedja': all(rect(4, 4, 112, 108, SEA, 3, null), waves(8, 40, 16), waves(60, 110, 104), ...[[18, 92, 6, 4], [34, 80, 5, 3], [48, 70, 7, 4], [62, 60, 5, 3], [76, 48, 8, 5], [92, 36, 6, 4], [104, 26, 4, 3]].map(([x, y, rx, ry]) => all(ellipse(x!, y!, rx!, ry!, LAND2, C.ink, 1), ellipse(x! - 1, y! - 0.5, rx! * 0.4, ry! * 0.4, GREEN, null))), line('M10 100 L112 18', HL, 1.8, '4 3'), arrow(100, 28, 112, 18, HL, 2), arrow(22, 90, 10, 100, HL, 2)),
  'gop.sköldvulkan': all(bg(), greyed(path('M76 58 L88 30 L92 30 L104 58 Z', ROCK, C.ink, 1.1)), field(84, LAND2), path('M4 84 C30 76 44 54 58 50 L66 50 C80 54 94 76 116 84 Z', '#8a7a68', C.ink, 1.6), path('M58 50 L60 47 L64 47 L66 50 Z', C.orange, C.ink, 0.8), path('M61 50 C58 60 52 70 44 80 M64 50 C70 62 80 72 92 80', 'none', C.orange, 2.4), path('M61 50 C58 60 52 70 44 80 M64 50 C70 62 80 72 92 80', 'none', '#f2c14e', 1), line('M6 92 L114 92', HL, 1.8), line('M6 88 L6 96 M114 88 L114 96', HL, 1.8), path('M58 46 C56 40 60 36 58 30 M66 46 C68 40 64 36 66 30', 'none', C.grey2, 2)),
  'gop.surfa': all(bg('#cfe8f6'), sun(98, 20, 6), path('M4 112 L4 70 C20 62 40 40 66 38 C82 37 96 46 100 58 C92 50 82 50 76 56 C88 62 100 72 116 74 L116 112 Z', SEA2, C.ink, 1.4), path('M66 38 C82 37 96 46 100 58 C92 50 82 50 76 56', '#e6f4fb', C.ink, 1), waves(10, 110, 96), waves(20, 100, 106), g('rotate(-14 50 80)', ellipse(50, 80, 22, 3.4, C.yellow, C.ink, 1.2), line('M30 80 L70 80', C.orange, 1), g('translate(-10 -32)', P({ x: 60, h: 0.48, top: C.red, bottom: C.navy, mood: 'smile' })))),
  'gop.Påskön': all(rect(4, 4, 112, 108, SEA, 3, null), waves(10, 40, 100), path(ringD(RAPA, eq(-109.34, -27.12, 360, 360, 70, 40)), HLF, HL, 2.4), ...[[-109.43, -27.17], [-109.39, -27.08], [-109.24, -27.1]].map((p) => { const [x, y] = eq(-109.34, -27.12, 360, 360, 70, 40)(p as LL); return path(`M${f1(x - 5)} ${f1(y + 3)} L${f1(x)} ${f1(y - 3)} L${f1(x + 5)} ${f1(y + 3)} Z`, '#9a8a78', C.ink, 0.7); }), moaiIcon(62, 54, 1), moaiIcon(68, 55, 1), moaiIcon(74, 55, 1), moaiIcon(46, 32, 0.9), rect(6, 70, 52, 40, SEA, 2, C.ink, 1), clip(rect(6, 70, 52, 40, '#000', 2, null), lands(eq(-90, -25, 0.55, 0.55, 32, 90), { only: ['SA'], landCol: OTHER }), line(`M${f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-109.4, -27.1])[0])} ${f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-109.4, -27.1])[1])} L${f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-71.5, -33])[0])} ${f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-71.5, -33])[1])}`, C.dark, 1, '2 1.5'), circle(f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-109.4, -27.1])[0]), f1(eq(-90, -25, 0.55, 0.55, 32, 90)([-109.4, -27.1])[1]), 2.4, HLF, HL, 1.3))),
  'gop.Polynesien': pacific({ hl: ['NZN', 'NZS'], dimAll: true }, all(path(ringD([[-155.5 + 360, 19.5], [174, -41], [-109.4 + 360, -27.1]], PF), HLT, HL, 1.8), dots(POL.map(([a, b]) => [a + 360, b] as LL), PF, HLF, 1.8), dots(MEL, PF, LAND, 1.2), dots(MIC, PF, LAND, 1.2))),
  'gop.polynesier': demonym(all(rect(40, 8, 74, 74, SEA, 3, C.ink, 1.2), clip(rect(40, 8, 74, 74, '#000', 3, null), path(ringD([[-155.5 + 360, 19.5], [174, -41], [-109.4 + 360, -27.1]], eq(200, -10, 0.95, 0.95, 77, 45)), HLT, HL, 1.6), lands(eq(200, -10, 0.95, 0.95, 77, 45), { hl: ['NZN', 'NZS'], dimAll: true, only: ['NZN', 'NZS', 'AUS', 'NGE'] }), dots(POL.map(([a, b]) => [a + 360, b] as LL), eq(200, -10, 0.95, 0.95, 77, 45), HLF, 1.7))), '#3a9a8a'),
  // 3055 Arktis
  'gop.Arktis': all(npBase({ landCol: LAND, under: circle(60, 58, (90 - 66.5) * 1.6, '#fbd9c2', null), over: all(clip(circle(60, 58, (90 - 66.5) * 1.6, '#000', null), lands(NP, { only: NORTHK, landCol: '#f2a77a' })), circleLat(NP, 66.5, HL, 2, '4 2.5')) }), circle(60, 58, 1.8, C.white, C.ink, 1)),
  'gop.Norra-ishavet': all(polarBg(), disc(NP, 52, { only: NORTHK, landCol: OTHER, under: circle(60, 58, (90 - 68) * 1.6, HLF, null), over: all(...[[-150, 80], [30, 84], [150, 78], [-30, 86]].map((p) => { const [x, y] = NP(p as LL); return ellipse(f1(x), f1(y), 4, 2, ICE, C.ink, 0.6); })) })),
  'gop.Nordvästpassagen': tile(north(3.0, -100, 60, -2), { only: ['NA', 'GL', 'BAF', 'ELL', 'EUAS'], landCol: LAND, under: '', over: all(line(lineD(NWP, north(3.0, -100, 60, -2)), HL, 2.4, '4 2.5'), ...[[0, 1], [6, 7]].map(([a]) => { const p = north(3.0, -100, 60, -2)(NWP[a!]!); return circle(f1(p[0]), f1(p[1]), 2, C.white, HL, 1.2); }), (() => { const p = north(3.0, -100, 60, -2)([-95, 73.2]); return iceShip(f1(p[0]), f1(p[1]), 0.32, '#3a6ab0'); })(), ...[[-120, 76], [-85, 77], [-140, 74]].map((p) => { const [x, y] = north(3.0, -100, 60, -2)(p as LL); return ellipse(f1(x), f1(y), 4, 1.6, ICE, C.ink, 0.5); })) }),
  'gop.Grönland': tile(north(2.6, -40, 60, 11), { hl: ['GL'], dimAll: true, only: ['GL', 'NA', 'BAF', 'ELL', 'ISL', 'EUAS', 'UK', 'SVA'] }),
  'gop.inuit': demonym(all(rect(40, 8, 74, 74, SEA, 3, C.ink, 1.2), clip(rect(40, 8, 74, 74, '#000', 3, null), lands(north(1.25, -70, 77, 4), { hl: ['GL', 'BAF', 'ELL'], dimAll: true, only: ['GL', 'BAF', 'ELL', 'NA', 'ISL', 'EUAS'] }))), '#3a6ab0', hood(24, 0.72, '#3a6ab0')),
  'gop.Svalbard': all(tile(north(4.2, 20, 60, 2), { hl: ['SVA'], dimAll: true, only: ['SVA', 'EUAS', 'GL', 'NZE'], over: all(...[[30, 82], [5, 81.5], [40, 80.5]].map((p) => { const [x, y] = north(4.2, 20, 60, 2)(p as LL); return ellipse(f1(x), f1(y), 5, 2, ICE, C.ink, 0.6); })) })),
  'gop.isbrytare.2': all(bg('#dbe8f2'), rect(4, 66, 112, 46, ICE, 0, null), line('M4 66 L116 66', C.ink, 1), path('M4 74 L66 74 L70 112 L4 112 Z', '#4f8cbf', null), ...[[14, 80, 10], [30, 88, 12], [46, 78, 9], [20, 100, 14], [52, 96, 10], [36, 106, 8]].map(([x, y, w]) => floe(x!, y!, w!, 3)), line('M78 68 L90 74 L84 82 M96 70 L104 80 L112 76 M80 90 L94 96 L104 92', '#9fb8c8', 1.2), iceShip(72, 76, 1.05), greyed(iceShip(18, 70, 0.5, '#3a6ab0')), arrow(102, 60, 114, 60, HL, 2)),
  // 3056 Antarktis
  'gop.Antarktis': all(polarBg(), disc(SP, 52, { hl: ['ANT'], dimAll: true, only: ['ANT', 'SA', 'AF', 'AUS', 'NZS', 'NZN', 'TAS', 'MAD'] }), circle(60, 58, 1.8, C.white, C.ink, 1)),
  'gop.Södra-ishavet': all(polarBg(), disc(SP, 52, { only: ['ANT', 'SA', 'AF', 'AUS', 'NZS', 'NZN', 'TAS', 'MAD'], dimAll: true, under: circle(60, 58, (90 - 58) * 1.15, HLF, null), over: path(ringD(LANDS.ANT!, SP), ICE, C.ink, 1) })),
  'gop.shelfis': all(bg('#dbe8f2'), rect(4, 66, 112, 46, '#5f9fcf', 0, null), path('M4 112 L4 70 L40 74 L58 84 L70 98 L90 112 Z', '#8a7a68', C.ink, 1.2), path('M4 70 L4 34 C24 32 40 36 54 46 L104 54 L104 76 L60 74 L40 66 Z', ICE, C.ink, 1.3), line('M10 44 C26 42 40 46 52 54', ICE2, 1), path('M106 56 L114 58 L114 78 L106 77 Z', ICE, C.ink, 1.1), line('M105 55 L104 77', C.ink, 1, '2 2'), arrow(30, 50, 46, 56, '#7fa4c0', 2), rect(54, 50, 52, 30, 'none', 3, HL, 2.2), waves(60, 110, 92, '#cfe6f4')),
  'gop.snöstorm': all(rect(4, 4, 112, 108, '#b8c4ce', 3, null), field(96, SNOW), path('M4 96 C30 92 50 98 80 92 C96 90 108 94 116 92 L116 112 L4 112 Z', SNOW, null), g('rotate(10 60 112)', P({ x: 58, h: 0.66, top: '#c8352a', bottom: C.navy, mood: 'frown' }), hood(58, 0.66, '#c8352a')), snowStreaks(26, 1), flakes(30, 2), ...range(5).map((i) => line(`M${6 + i * 6} ${20 + i * 16} l30 3`, 'rgba(255,255,255,0.95)', 2)), arrow(86, 30, 112, 33, C.white, 2.4)),
  'gop.pingvin': all(bg('#dbe8f2'), path('M4 92 C30 88 70 90 116 86 L116 112 L4 112 Z', ICE, C.ink, 1), rect(4, 96, 112, 16, '#5f9fcf', 0, null), line('M4 96 L116 96', C.ink, 1), waves(10, 110, 104, '#cfe6f4'), penguin(34, 92, 1.5), penguin(62, 90, 1.8, -1), penguin(88, 88, 1.3)),
  'gop.polarforskare': all(bg('#dbe8f2'), field(98, SNOW), path('M76 98 L90 72 L104 98 Z', C.orange, C.ink, 1.2), line('M90 72 L90 98', C.ink, 0.8), P({ x: 46, h: 0.82, top: '#c8352a', bottom: C.navy, mood: 'smile' }), hood(46, 0.82, '#c8352a'), goggles(46, 0.82), line('M68 98 L68 60 M62 60 L74 60', C.dark, 2.2), rect(64, 98, 8, 8, '#cfe3ef', 1, C.ink, 0.8), rect(14, 78, 14, 20, ICE2, 2, C.ink, 1), line('M18 82 l6 0 M18 86 l6 0 M18 90 l6 0', C.ink, 0.8), line('M21 78 L21 70', C.dark, 1.2), circle(21, 68, 2.2, C.grey2, C.ink, 0.8)),
  'gop.Antarktisfördraget': all(bg('#efe9dc'), rect(24, 8, 72, 96, '#fbf8ef', 2, C.ink, 1.4), clip(circle(60, 36, 20, '#000', null), circle(60, 36, 20, SEA, null), lands(south(0.62, 0, 60, 36), { only: ['ANT', 'SA', 'AF', 'AUS'], hl: ['ANT'], dimAll: true, outline: false })), circle(60, 36, 20, 'none', C.ink, 1), line('M32 62 L88 62 M32 68 L88 68 M32 74 L80 74', C.grey2, 1.6), ...range(12).map((i) => path(`M${30 + (i % 4) * 15} ${83 + Math.floor(i / 4) * 7} c2 -3 4 3 6 0 s3 -2 5 0`, 'none', ['#2f4a7a', '#c8352a', '#3a9a5a', C.dark][i % 4]!, 1.1)), g('rotate(35 100 92)', rect(96, 70, 5, 30, C.dark, 1, C.ink, 0.8), path('M96 100 L98.5 106 L101 100 Z', C.gold, C.ink, 0.6))),
  // 3057 Världshavens geografi
  'gop.Atlanten': world(-30, 'ATL'),
  'gop.Indiska-oceanen': world(80, 'IND'),
  'gop.Golfströmmen': tile(GS, { only: ['NA', 'GL', 'EUAS', 'AF', 'UK', 'IRL', 'ISL', 'SA', 'CUB', 'SVA', 'BAF'], over: all(line(lineD(gulfStream, GS), '#f6c9a0', 8), line(lineD(gulfStream, GS), RED, 3.2), (() => { const a = GS(gulfStream[gulfStream.length - 2]!), b = GS(gulfStream[gulfStream.length - 1]!); return arrow(f1(a[0]), f1(a[1]), f1(b[0]), f1(b[1]), RED, 3.2); })(), greyed(line(lineD([[-50, 66], [-56, 58], [-52, 50], [-62, 44]], GS), '#3a6ab0', 2.4, '3 2'))) }),
  'gop.Marianergraven': all(bg('#d6ecf8'), rect(4, 24, 112, 88, '#5f9fcf', 0, null), path('M4 46 L44 48 L54 54 L58 106 L64 106 L68 52 L80 46 L116 44 L116 112 L4 112 Z', '#7a6a5a', C.ink, 1.3), path('M4 24 L116 24 L116 46 L80 46 L68 52 L64 106 L58 106 L54 54 L44 48 L4 46 Z', '#2f5f8f', null), line('M4 24 L116 24', C.ink, 1), waves(8, 112, 20, '#5f9fcf'), greyed(path('M52 106 L57 80 L59 84 L61 64 L64 76 L66 72 L70 106 Z', C.grey2, C.ink, 1)), line('M84 24 L84 106', HL, 1.8), line('M80 24 L88 24 M80 106 L88 106', HL, 1.8), num(98, 70, '11 000', 8, C.white), rect(6, 82, 40, 28, SEA, 2, C.ink, 1), clip(rect(6, 82, 40, 28, '#000', 2, null), lands(eq(140, 15, 0.55, 0.55, 26, 96), { only: ['EUAS', 'JPN', 'LUZ', 'MIN', 'BOR', 'TWN', 'NGW', 'NGE', 'AUS'], landCol: OTHER }), circle(f1(eq(140, 15, 0.55, 0.55, 26, 96)([142.2, 11.3])[0]), f1(eq(140, 15, 0.55, 0.55, 26, 96)([142.2, 11.3])[1]), 2.2, HLF, HL, 1.2))),
};
