/**
 * Teknik & digital värld → Byggnad & infrastruktur → Järnväg & kollektivtrafikinfrastruktur, 4151–4157 (0.59):
 * railway track, switches and signals, overhead lines, stations and platforms, depots and maintenance, metro systems
 * and traffic control.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Rails are steel grey, sleepers concrete grey, ballast small grey-brown stones, trains blue, electricity
 * a yellow bolt, cold light blue and heat red-orange. Words that are easy to mix up get clearly different scenes:
 * räls (a steel rail profile with a wheel rolling on it), sliper (one sleeper ringed under the rails, seen from
 * above), makadam (a magnified heap of sharp stones under a sleeper) and banvall (a whole embankment in cross-section
 * with water running off); enkelspår (one track with two trains facing each other) and dubbelspår (two tracks with
 * trains in opposite directions); solkurva (a rail that bends sideways under the sun) and rälsbrott (a crack in a rail
 * with a snowflake); växel (the Y-shaped junction with orange tongues), sidospår (a long parallel side track with a
 * parked train), växelvärme (red heat waves in a switch) and frysa fast (ice that grows on a switch, arrow crossed
 * out); bom (a striped barrier arm close up) and plankorsning (a road crossing the track seen from above, with a cross
 * sign); kontaktledning (the orange wire over a train), stolpe (one pole close up) and strömavtagare (the arm on the
 * roof touching the wire); ellok (a locomotive under a wire with a bolt) and diesellok (a locomotive with smoke and no
 * wire); depå (a hall with a train inside) and bangård (many open tracks seen from above, no building); trafikledning
 * (a whole room with a wall screen) and trafikledare (one person with a headset, ringed).
 * Digits and code signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, g, line, moving, path, rect, sparkle, waGrow, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const STEEL = '#8d949b';
const STEEL2 = '#b8c0c8';
const CONC = '#cfcac0';
const STONE = '#b3aa9b';
const SOIL = '#b98b5e';
const GRASS = '#9fcf8a';
const TRAIN = '#3f7fc8';
const GLASS = '#dff1fb';
const ICE = '#bfe6f7';
const HEAT = '#e4572e';
const VEST = '#f28c28';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const sky = (col = '#e3f1f8') => rect(0, 0, 120, 120, col, 0, null);
const grass = (y = 100) => rect(0, y, 120, 120 - y, GRASS, 0, null);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.2);
};
const sun = (x: number, y: number, r = 9) => all(...range(8).map((i) => { const a = (i * Math.PI) / 4; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.orange, 2.2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const flake = (x: number, y: number, s = 1, col = '#5aa9d6') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', col, 2), line('M-2 -5 L0 -3 L2 -5 M-2 5 L0 3 L2 5', col, 1.4));
const smoke = (x: number, y: number, s = 1, col: string = C.grey) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.2));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const heatWave = (x: number, y: number, h = 14, col: string = HEAT) => line(`M${x} ${y} C${x - 4} ${y - h / 4} ${x + 4} ${y - h / 2} ${x} ${y - (3 * h) / 4} C${x - 3} ${y - h} ${x} ${y - h} ${x} ${y - h}`, col, 2);
const clock = (x: number, y: number, r = 10, deg = 60, face: string = C.white) => all(circle(x, y, r, face, C.ink, 1.8), ...range(4).map((i) => { const a = (i * Math.PI) / 2; return line(`M${f1(x + Math.cos(a) * (r - 2))} ${f1(y + Math.sin(a) * (r - 2))} L${f1(x + Math.cos(a) * (r - 4))} ${f1(y + Math.sin(a) * (r - 4))}`, C.ink, 1.2); }),
  line(`M${x} ${y} L${x} ${y - r * 0.6}`, C.ink, 1.8), g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L0 ${-r * 0.8}`, C.red, 1.4)), circle(x, y, 1.4, C.ink, null));
/** Standing person, feet at (x, y=112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; legs?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};

// ── Railway parts ────────────────────────────────────────────────────
/** Track seen from above between x1 and x2, centre line y; rails gap g from the centre. */
const trackTop = (x1: number, x2: number, y: number, o: { gap?: number; rail?: string; sl?: string; step?: number } = {}) => {
  const gp = o.gap ?? 5, st = o.step ?? 7;
  return all(...range(Math.floor((x2 - x1) / st) + 1).map((i) => rect(x1 + i * st - 1.5, y - gp - 4, 3, 2 * gp + 8, o.sl ?? CONC, 0.5, C.ink, 0.6)),
    line(`M${x1} ${y - gp} L${x2} ${y - gp} M${x1} ${y + gp} L${x2} ${y + gp}`, o.rail ?? STEEL, 2.4));
};
/** Track seen from the side, rail top at y: ballast, sleeper ends and rail. */
const trackSide = (x1: number, x2: number, y: number, rail: string = STEEL) => all(path(`M${x1} ${y + 9} L${x1 + 4} ${y + 3} L${x2 - 4} ${y + 3} L${x2} ${y + 9} Z`, STONE, C.ink, 1),
  ...range(Math.floor((x2 - x1 - 6) / 10) + 1).map((i) => rect(x1 + 4 + i * 10, y + 2, 6, 3, CONC, 0.5, C.ink, 0.6)), rect(x1, y - 1, x2 - x1, 3, rail, 0.5, C.ink, 0.8));
/** Train seen from the side, wheels on y, from x with width w; front to the right. */
const trainSide = (x: number, y: number, w: number, o: { col?: string; pant?: boolean; heads?: boolean; windows?: boolean; dark?: boolean } = {}) => {
  const col = o.col ?? TRAIN, n = Math.max(1, Math.floor((w - 14) / 11));
  return all(path(`M${x} ${y - 4} L${x} ${y - 28} L${x + w - 10} ${y - 28} C${x + w - 2} ${y - 28} ${x + w} ${y - 20} ${x + w} ${y - 12} L${x + w} ${y - 4} Z`, col, C.ink, 1.6),
    o.windows === false ? '' : all(...range(n).map((i) => rect(x + 4 + i * 11, y - 24, 8, 8, o.dark ? '#4a5160' : GLASS, 1.5, C.ink, 0.8)), path(`M${x + w - 9} ${y - 25} C${x + w - 4} ${y - 25} ${x + w - 2} ${y - 20} ${x + w - 2} ${y - 16} L${x + w - 9} ${y - 16} Z`, o.dark ? '#4a5160' : GLASS, C.ink, 0.8)),
    o.heads ? all(...range(n).map((i) => all(circle(x + 8 + i * 11, y - 18, 2.2, C.skin, null), rect(x + 5.5 + i * 11, y - 16, 5, 3, i % 2 ? C.red : C.green, 1, null)))) : '',
    line(`M${x} ${y - 11} L${x + w} ${y - 11}`, C.white, 1.6),
    ...[x + 8, x + 17, x + w - 17, x + w - 8].map((cx) => circle(cx, y - 2, 3, C.dark, C.ink, 1)),
    o.pant ? all(line(`M${x + w / 2 - 6} ${y - 28} L${x + w / 2} ${y - 36} L${x + w / 2 - 4} ${y - 42} M${x + w / 2 + 6} ${y - 28} L${x + w / 2} ${y - 36}`, C.dark, 1.6), line(`M${x + w / 2 - 9} ${y - 42} L${x + w / 2 + 5} ${y - 42}`, C.dark, 2)) : '');
};
/** Train seen from above, centre (x, y), length l; nose points right (dir 1) or left (dir -1). */
const trainTop = (x: number, y: number, l = 30, dir = 1, col: string = TRAIN) => g(`translate(${x} ${y}) scale(${dir} 1)`,
  path(`M${-l / 2} -5 L${l / 2 - 6} -5 C${l / 2 - 1} -5 ${l / 2} -2 ${l / 2} 0 C${l / 2} 2 ${l / 2 - 1} 5 ${l / 2 - 6} 5 L${-l / 2} 5 Z`, col, C.ink, 1.4), line(`M${-l / 2 + 3} 0 L${l / 2 - 8} 0`, C.white, 1.2));
/** Catenary pole at x (feet on y) with an arm out to the wire at height wy. */
const pole = (x: number, y: number, wy: number, col: string = STEEL, dir = 1) => all(rect(x - 2, wy - 6, 4, y - wy + 6, col, 1, C.ink, 1.1), line(`M${x} ${wy - 4} L${x + 16 * dir} ${wy - 4} M${x} ${wy + 6} L${x + 14 * dir} ${wy - 2}`, col, 2));
/** Railway signal mast at x, feet on y; lights from top: red, green. */
const signal = (x: number, y: number, lit: 'red' | 'green' | 'none' = 'red', s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.6, -50, 3.2, 50, C.dark, 1, null), rect(-7, -74, 14, 26, C.black, 4, C.ink, 1.4),
  circle(0, -67, 4.2, lit === 'red' ? C.red : '#5a3a3a', C.ink, 0.8), circle(0, -55, 4.2, lit === 'green' ? '#3cc46a' : '#2f4a3a', C.ink, 0.8));
/** Diamond pantograph on a roof at (x, y) reaching up to wire height wy. */
const pantograph = (x: number, y: number, wy: number, col: string = C.dark) => all(path(`M${x - 8} ${y} L${x} ${f1((y + wy) / 2)} L${x - 6} ${wy + 1} M${x + 8} ${y} L${x} ${f1((y + wy) / 2)}`, 'none', col, 1.8), line(`M${x - 11} ${wy + 1} L${x + 5} ${wy + 1}`, col, 2.4));
/** Station platform from x1 to x2, top at y. */
const platform = (x1: number, x2: number, y: number, col = '#d8d2c6') => all(rect(x1, y, x2 - x1, 120 - y, col, 0, C.ink, 1.2), line(`M${x1} ${y + 3} L${x2} ${y + 3}`, C.white, 2, '5 3'));
/** Railway crossing sign (red and white cross) on a post, feet on y. */
const crossSign = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.5, -40, 3, 40, C.grey, 1, C.ink, 0.8),
  g('translate(0 -44) rotate(35)', rect(-14, -2.5, 28, 5, C.white, 1, C.red, 1.4)), g('translate(0 -44) rotate(-35)', rect(-14, -2.5, 28, 5, C.white, 1, C.red, 1.4)));
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, '#14233f', 1.5, null), inner);
const desk = (x: number, y: number, w: number) => all(rect(x, y, w, 5, '#b98652', 1, C.ink, 1.2), line(`M${x + 4} ${y + 5} L${x + 4} 112 M${x + w - 4} ${y + 5} L${x + w - 4} 112`, C.dark, 2.4));

export const RAILI_MOTIFS: Record<string, Svg> = {
  // ── 4151 Järnvägsspår ──
  'raili.persontåg': all(sky(), grass(98), platform(0, 120, 98), trainSide(4, 94, 112, { heads: true }), frame(2, 62, 116, 36)),
  'raili.räls': all(sky('#eef3f6'), grass(90), trackSide(0, 120, 84, HL),
    g('translate(26 46)', path('M-10 -18 L10 -18 L10 -12 L3 -12 L3 6 L12 10 L12 16 L-12 16 L-12 10 L-3 6 L-3 -12 L-10 -12 Z', HL, C.ink, 1.6)),
    moving('railirals', '0%{transform:translate(-50px,0)}100%{transform:translate(0,0)}', { dur: 2.6 }, circle(84, 72, 11, C.dark, C.ink, 1.6), circle(84, 72, 4, STEEL2, C.ink, 1), line('M73 78 L95 78', C.dark, 2)),
    arrow(26, 66, 26, 80, C.grey, 2)),
  'raili.sliper': all(rect(0, 0, 120, 120, STONE, 0, null), ...range(30).map((i) => circle(4 + ((i * 37) % 112), 6 + ((i * 53) % 108), 2.4, '#9c9384', null)),
    ...[14, 38, 62, 86, 110].map((x) => rect(x - 7, 8, 14, 104, x === 62 ? HL : CONC, 2, C.ink, 1.4)), line('M0 34 L120 34 M0 86 L120 86', STEEL, 5), line('M0 34 L120 34 M0 86 L120 86', STEEL2, 1.6), ring(62, 60, 30)),
  'raili.makadam': all(sky('#eef3f6'), path('M0 112 L14 70 L106 70 L120 112 Z', STONE, C.ink, 1.4), ...range(36).map((i) => path(`M${f1(10 + (i % 12) * 9 + (Math.floor(i / 12) % 2) * 4)} ${f1(104 - Math.floor(i / 12) * 11)} l4 -3 l4 2 l-1 4 l-5 1 Z`, '#9c9384', C.ink, 0.7)),
    rect(16, 58, 88, 12, CONC, 2, C.ink, 1.4), rect(26, 52, 8, 6, STEEL, 1, C.ink, 1), rect(86, 52, 8, 6, STEEL, 1, C.ink, 1),
    circle(60, 26, 20, '#f3efe6', HL, 2.6), path('M48 26 l6 -6 l7 3 l-2 7 l-8 2 Z M62 18 l7 -2 l4 6 l-5 5 l-6 -3 Z M60 32 l6 0 l3 5 l-6 3 l-5 -4 Z', '#9c9384', C.ink, 1), line('M60 46 L60 76', HL, 1.6, '3 2')),
  'raili.banvall': all(sky(), rect(0, 96, 120, 24, GRASS, 0, null), path('M8 112 L36 64 L84 64 L112 112 Z', SOIL, C.ink, 1.6), path('M8 112 L36 64 L84 64 L112 112 Z', 'none', HL, 2.6),
    ...range(10).map((i) => circle(24 + i * 8, 100 - (i % 3) * 8, 1.8, '#8f6a45', null)), trackSide(36, 84, 58),
    moving('railibanv', '0%{transform:translate(0,-10px);opacity:0}70%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, drop(30, 86, 1.1), drop(22, 100, 1.1), drop(90, 86, 1.1), drop(98, 100, 1.1)),
    ...range(6).map((i) => line(`M${20 + i * 16} ${8 + (i % 2) * 6} l-3 8`, '#5aa9d6', 1.6))),
  'raili.spårvidd': all(sky('#eef3f6'), rect(6, 74, 108, 12, CONC, 2, C.ink, 1.4), path('M0 112 L4 86 L116 86 L120 112 Z', STONE, C.ink, 1.2),
    ...[24, 96].map((x) => path(`M${x - 6} 50 L${x + 6} 50 L${x + 6} 55 L${x + 2} 55 L${x + 2} 68 L${x + 8} 71 L${x + 8} 74 L${x - 8} 74 L${x - 8} 71 L${x - 2} 68 L${x - 2} 55 L${x - 6} 55 Z`, STEEL, C.ink, 1.4)),
    line('M30 40 L90 40', HL, 2.6), arrow(50, 40, 30, 40, HL, 2.6), arrow(70, 40, 90, 40, HL, 2.6), line('M30 34 L30 50 M90 34 L90 50', HL, 1.6, '2 2'), T(60, 30, '1435', 13, HL)),
  'raili.enkelspår': all(rect(0, 0, 120, 120, GRASS, 0, null), rect(0, 50, 120, 20, STONE, 0, null), trackTop(0, 120, 60), trainTop(26, 60, 34, 1), trainTop(94, 60, 34, -1, C.red),
    arrow(44, 34, 56, 34, C.ink, 2.4), arrow(76, 34, 64, 34, C.ink, 2.4), path('M2 46 L118 46 L118 74 L2 74 Z', 'none', HL, 2.6)),
  'raili.dubbelspår': all(rect(0, 0, 120, 120, GRASS, 0, null), rect(0, 34, 120, 52, STONE, 0, null), trackTop(0, 120, 46), trackTop(0, 120, 74), trainTop(34, 46, 34, 1), trainTop(86, 74, 34, -1, C.red),
    arrow(58, 24, 74, 24, C.ink, 2), arrow(62, 98, 46, 98, C.ink, 2), path('M2 32 L118 32 L118 88 L2 88 Z', 'none', HL, 2.6)),
  'raili.stambana': all(rect(0, 0, 120, 120, '#dceef8', 0, null), path('M44 6 C62 4 72 14 70 30 C68 44 82 52 80 68 C78 84 70 96 58 112 C46 112 34 104 36 90 C38 76 30 66 34 52 C38 38 30 22 44 6 Z', '#cfe6bf', C.ink, 1.6),
    line('M60 16 C56 34 58 48 56 62 C54 78 52 90 50 104', HL, 4), ...([[60, 16], [56, 62], [50, 104]] as const).map(([x, y]) => circle(x, y, 4.5, C.white, C.ink, 1.6)),
    line('M56 62 L72 70 M56 40 L44 34 M52 88 L40 82 M58 30 L68 26', C.grey, 1.6), ...([[72, 70], [44, 34], [40, 82], [68, 26]] as const).map(([x, y]) => circle(x, y, 2.4, C.grey, C.ink, 1))),
  'raili.solkurva': all(sky('#fff3dc'), rect(0, 40, 120, 80, STONE, 0, null), sun(100, 18, 8),
    greyed(trackTop(0, 120, 80)),
    moving('railisolk', '0%,25%{opacity:0}75%,100%{opacity:1}', { dur: 3 }, line('M0 75 L30 75 C48 75 50 58 62 58 C74 58 76 75 92 75 L120 75', HL, 3), line('M0 85 L30 85 C48 85 50 68 62 68 C74 68 76 85 92 85 L120 85', HL, 3)),
    heatWave(30, 64, 14), heatWave(46, 50, 14), heatWave(80, 50, 14), heatWave(96, 64, 14)),
  'raili.rälsbrott': all(sky('#e6f2fa'), rect(0, 76, 120, 44, '#f4f8fb', 0, null), trackSide(0, 120, 70),
    path('M54 66 L58 70 L56 72 L62 74 L60 69 L64 66 Z', C.white, C.ink, 1.4), rect(57, 66, 6, 7, '#f4f8fb', 0, null), line('M56 66 L59 69 L57 71 L61 74 M62 66 L64 69 L62 71 L65 74', C.ink, 1.2),
    ring(60, 70, 13), flake(22, 30, 1.3), flake(94, 24, 1.1), flake(70, 40, 0.9), rect(100, 40, 8, 26, C.white, 4, C.ink, 1.2), rect(102.5, 52, 3, 12, '#5aa9d6', 1.5, null), circle(104, 66, 4, '#5aa9d6', C.ink, 1)),
  'raili.spåra-ur': all(sky(), grass(96), trackSide(0, 120, 92),
    moving('railispur', '0%,20%{transform:translate(-30px,0) rotate(0deg)}70%,100%{transform:translate(0,0) rotate(0deg)}', { dur: 3 }, g('rotate(14 70 90)', trainSide(36, 84, 66))),
    burst(98, 92, 9), line('M86 98 L94 104 M90 94 L100 98', C.ink, 1.4), arrow(14, 70, 34, 70, C.grey, 2)),

  // ── 4152 Växlar och signaler ──
  'raili.växel.4': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 80), g('rotate(-22 52 80)', trackTop(52, 130, 80)),
    path('M46 75 L78 66 L78 69 L46 78 Z M46 85 L78 85 L78 88 L46 88 Z', HL, C.ink, 1), ring(60, 76, 20), trainTop(18, 80, 28, 1)),
  'raili.växelvärme': all(rect(0, 0, 120, 120, '#f4f8fb', 0, null), trackTop(0, 120, 84), g('rotate(-20 40 84)', trackTop(40, 130, 84)),
    line('M30 78 L80 78 M30 90 L80 90', C.red, 2.6, '4 2'), waPulse('railivxv', heatWave(40, 72, 16), heatWave(54, 70, 18), heatWave(68, 72, 16)),
    ...([[18, 22], [44, 14], [76, 26], [100, 14]] as const).map(([x, y]) => flake(x, y, 0.9)), drop(52, 46, 1.2), drop(64, 50, 1.2), ring(55, 80, 26)),
  'raili.frysa-fast': all(rect(0, 0, 120, 120, '#eef6fb', 0, null), trackTop(0, 120, 80), g('rotate(-20 40 80)', trackTop(40, 130, 80)),
    waGrow('railifrys', path('M38 72 L46 62 L54 70 L62 60 L70 70 L78 64 L84 74 L82 90 L36 90 Z', ICE, '#5aa9d6', 1.6), line('M46 70 L50 80 M62 66 L60 82 M74 72 L76 84', C.white, 1.4)),
    arrow(36, 40, 72, 40, C.grey, 2.6), cross(54, 40, 8), flake(20, 18, 1.2), flake(98, 20, 1.2), flake(104, 52, 0.9)),
  'raili.stoppsignal': all(sky(), grass(98), trackSide(0, 120, 98), signal(84, 98, 'red', 1.05), trainSide(-30, 98, 74), ring(84, 28, 11), waPulse('railistop', circle(84, 28, 7.5, 'none', C.red, 2))),
  'raili.ställverk': all(rect(0, 0, 120, 120, '#e9edf1', 0, null), screen(8, 10, 104, 58, all(line('M14 39 L106 39', '#7fd0ff', 2), line('M30 39 L50 25 L80 25 L96 39', '#7fd0ff', 2), line('M40 39 L56 53 L84 53', '#7fd0ff', 2),
    circle(30, 39, 2.8, C.yellow, null), circle(50, 25, 2.8, '#3cc46a', null), circle(96, 39, 2.8, C.red, null), circle(56, 53, 2.8, '#3cc46a', null), circle(80, 25, 2.8, C.red, null))),
    rect(14, 80, 92, 22, '#c7ccd2', 3, C.ink, 1.6), ...range(6).map((i) => all(line(`M${24 + i * 14} 90 L${24 + i * 14 + (i % 2 ? 4 : -4)} 74`, C.dark, 2.4), circle(24 + i * 14 + (i % 2 ? 4 : -4), 73, 3, i % 3 === 0 ? C.red : C.white, C.ink, 1))), frame(4, 6, 112, 100)),
  'raili.sidospår.2': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 36), path('M14 36 C30 36 34 76 50 76', 'none', STEEL, 2.4), trackTop(48, 120, 76, { rail: HL }),
    trainTop(90, 76, 40, 1, C.green), moving('railisido', '0%{transform:translate(-60px,0)}100%{transform:translate(40px,0)}', { dur: 3.4 }, trainTop(40, 36, 36, 1)),
    path('M44 62 L118 62 L118 90 L44 90 Z', 'none', HL, 2.4)),
  'raili.bom.1': all(sky(), rect(0, 92, 120, 28, '#9aa3ad', 0, null), line('M0 104 L120 104', C.white, 2, '8 6'), rect(10, 50, 8, 46, C.grey, 2, C.ink, 1.4), rect(6, 90, 16, 8, C.dark, 1, C.ink, 1),
    g('translate(14 58)', rect(0, -4, 100, 8, C.white, 3, C.ink, 1.4), ...range(5).map((i) => rect(8 + i * 20, -4, 10, 8, C.red, 0, null)), rect(0, -4, 100, 8, 'none', 3, C.ink, 1.4)),
    circle(14, 58, 4, C.dark, C.ink, 1), frame(6, 46, 112, 22), greyed(rect(70, 74, 34, 16, C.sky, 3, C.ink, 1.2), circle(76, 92, 4, C.dark, null), circle(98, 92, 4, C.dark, null))),
  'raili.plankorsning': all(rect(0, 0, 120, 120, GRASS, 0, null), rect(46, 0, 28, 120, '#9aa3ad', 0, null), line('M60 0 L60 120', C.white, 1.6, '6 5'), trackTop(0, 120, 60, { sl: '#6b6b6b' }),
    crossSign(34, 44, 0.7), g('rotate(90 60 96)', rect(48, 90, 22, 12, C.sky, 3, C.ink, 1.2)), ring(60, 60, 22)),

  // ── 4153 Kontaktledning ──
  'raili.kontaktledning': all(sky(), grass(100), trackSide(0, 120, 98), greyed(pole(14, 100, 30), pole(106, 100, 30, STEEL, -1)), trainSide(18, 98, 84, { pant: true }),
    path('M0 31 Q30 35 60 33 Q90 35 120 31', 'none', HL, 2.8), bolt(92, 18, 0.8)),
  'raili.stolpe.1': all(sky(), grass(100), greyed(trackSide(0, 120, 104)), rect(52, 14, 8, 92, STEEL, 1.5, C.ink, 1.6), line('M56 22 L96 22 M56 36 L92 24', STEEL, 3), line('M0 26 L120 26', C.dark, 1.4),
    frame(46, 8, 20, 100), greyed(rect(12, 40, 4, 62, STEEL, 1, C.ink, 1), rect(104, 40, 4, 62, STEEL, 1, C.ink, 1))),
  'raili.strömavtagare': all(sky(), line('M0 24 L120 24', C.dark, 2), greyed(trainSide(-10, 118, 140, {})), path('M30 90 L60 54 L42 25 M90 90 L60 54', 'none', HL, 3.2), line('M30 25 L74 25', HL, 3.6),
    rect(26, 88, 68, 4, C.dark, 1, null), sparkle(66, 22, 5), ring(60, 54, 32)),
  'raili.diesellok': all(sky(), grass(100), trackSide(0, 120, 98), path('M16 94 L16 62 L36 62 L36 52 L96 52 C104 52 106 60 106 70 L106 94 Z', C.red, C.ink, 1.6), rect(20, 66, 12, 10, GLASS, 1.5, C.ink, 0.8), rect(92, 58, 10, 12, GLASS, 1.5, C.ink, 0.8),
    rect(42, 60, 44, 8, C.yellow, 1, C.ink, 1), ...[26, 38, 84, 96].map((x) => circle(x, 96, 4, C.dark, C.ink, 1)), rect(48, 44, 6, 8, C.dark, 1, C.ink, 1),
    waIn('railidies', -6, 8, smoke(50, 34, 0.9), smoke(62, 20, 1.1), smoke(80, 10, 1.2))),
  'raili.ellok': all(sky(), grass(100), trackSide(0, 120, 98), line('M0 30 L120 30', C.dark, 1.8), path('M14 94 L14 58 L98 58 C104 58 108 64 108 72 L108 94 Z', TRAIN, C.ink, 1.6), rect(94, 63, 10, 12, GLASS, 1.5, C.ink, 0.8), rect(18, 63, 10, 12, GLASS, 1.5, C.ink, 0.8),
    line('M14 80 L108 80', C.white, 2), ...[24, 36, 84, 96].map((x) => circle(x, 96, 4, C.dark, C.ink, 1)), pantograph(60, 58, 30), waPulse('railiell', bolt(60, 44, 0.9))),
  'raili.strömlös': all(rect(0, 0, 120, 120, '#e8ebef', 0, null), line('M0 26 L120 26', C.grey, 2), greyed(trainSide(8, 104, 104, { pant: true, dark: true })), bolt(60, 52, 2.2, '#d9d9d9'), cross(60, 52, 22, C.red),
    g('translate(102 14) scale(0.5)', bolt(0, 0, 1, C.yellow))),
  'raili.riva-ner': all(sky(), grass(100), trackSide(0, 120, 100), pole(10, 100, 30), path('M10 26 L52 26 L58 70', 'none', C.dark, 1.8), path('M120 26 L84 26 L78 74', 'none', C.dark, 1.8),
    waIn('railiriva', 24, -40, g('translate(108 100) rotate(-48)', rect(-4, -76, 8, 76, '#8a5a3a', 2, C.ink, 1.4), circle(-2, -84, 16, C.green, C.ink, 1.4), circle(-16, -72, 11, C.green, C.ink, 1.4))),
    burst(60, 72, 8), burst(80, 74, 6), arrow(66, 30, 66, 56, HL, 2.6)),

  // ── 4154 Stationer och perronger ──
  'raili.insteg': all(rect(0, 0, 120, 120, '#e9eef2', 0, null), rect(40, 10, 80, 86, TRAIN, 3, C.ink, 1.6), rect(56, 22, 40, 74, '#b9d6ef', 2, C.ink, 1.6), line('M76 22 L76 96', C.ink, 1.4), platform(0, 120, 96),
    rect(54, 92, 44, 5, HL, 1, C.ink, 1.2), waIn('railiinst', -24, 0, g('translate(30 0)', circle(10, 84, 6, C.dark, C.ink, 1.2), rect(0, 58, 14, 24, C.green, 3, C.ink, 1.2), circle(8, 52, 6, C.skin, C.ink, 1.2), circle(2, 90, 3, C.dark, null))),
    ring(76, 95, 14)),
  'raili.ledstråk': all(rect(0, 0, 120, 120, '#d8d2c6', 0, null), rect(0, 104, 120, 16, '#7a7f88', 0, null), rect(0, 100, 120, 4, C.yellow, 0, null), path('M44 98 L58 6 L74 6 L84 98 Z', '#f3f3ef', C.ink, 1.2),
    ...range(10).map((i) => line(`M${f1(52 + i * 1.4)} ${12 + i * 9} L${f1(54 + i * 0.4)} ${18 + i * 9} M${f1(62 + i * 0.2)} ${12 + i * 9} L${f1(62 + i * 0.2)} ${18 + i * 9} M${f1(70 - i * 0.6)} ${12 + i * 9} L${f1(71 + i * 0.4)} ${18 + i * 9}`, C.grey, 1.6)),
    ...range(4).map((i) => circle(50 + i * 9, 92, 1.8, C.grey, null)), path('M44 98 L58 6 L74 6 L84 98 Z', 'none', HL, 2.6),
    person(24, C.navy, { s: 0.75, r: [16, 30] }), line('M38 89 L52 108', C.white, 2.2), line('M38 89 L52 108', C.ink, 0.6)),
  'raili.skärmtak': all(rect(0, 0, 120, 120, '#d9e3ea', 0, null), ...range(14).map((i) => line(`M${4 + i * 9} ${8 + (i % 3) * 6} l-3 9 M${2 + i * 9} ${40 + (i % 2) * 8} l-3 9`, '#5aa9d6', 1.4)),
    platform(0, 120, 96), rect(14, 40, 4, 56, C.grey, 1, C.ink, 1.2), rect(102, 40, 4, 56, C.grey, 1, C.ink, 1.2), path('M4 40 L116 40 L110 30 L10 30 Z', HL, C.ink, 1.6),
    rect(20, 40, 80, 56, '#eef2f5', 0, null), person(44, C.green, { s: 0.6, y: 96 }), person(76, C.red, { s: 0.6, y: 96, hair: C.brown })),
  'raili.bytespunkt': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), rect(38, 38, 44, 36, '#e6dccb', 3, C.ink, 1.6), path('M34 40 L60 24 L86 40 Z', C.brown, C.ink, 1.6), clock(60, 46, 6), rect(54, 58, 12, 16, C.dark, 1, C.ink, 1),
    g('translate(4 10) scale(0.55)', trainSide(0, 40, 50)), g('translate(76 4) scale(0.5)', rect(0, 14, 60, 28, C.yellow, 4, C.ink, 2.4), rect(6, 20, 12, 10, GLASS, 1, C.ink, 1), rect(24, 20, 12, 10, GLASS, 1, C.ink, 1), rect(42, 20, 12, 10, GLASS, 1, C.ink, 1), circle(14, 44, 5, C.dark, null), circle(46, 44, 5, C.dark, null)),
    g('translate(6 88)', circle(8, 12, 7, 'none', C.ink, 2), circle(30, 12, 7, 'none', C.ink, 2), line('M8 12 L16 2 L28 2 L30 12 M16 2 L20 12 L8 12', C.red, 2)), g('translate(80 86)', rect(0, 4, 30, 14, C.sky, 3, C.ink, 1.4), circle(7, 18, 4, C.dark, null), circle(23, 18, 4, C.dark, null)),
    arrow(36, 44, 26, 34, HL, 2.4), arrow(84, 44, 94, 34, HL, 2.4), arrow(38, 72, 28, 88, HL, 2.4), arrow(82, 72, 92, 86, HL, 2.4), frame(32, 20, 56, 58)),

  // ── 4155 Depåer och underhåll ──
  'raili.depå.2': all(sky(), rect(0, 100, 120, 20, STONE, 0, null), path('M6 100 L6 38 L60 18 L114 38 L114 100 Z', '#dfe3e7', C.ink, 1.8), rect(30, 52, 60, 48, '#3d3f4a', 2, C.ink, 1.6),
    g('translate(34 0)', trainSide(0, 100, 52)), trackSide(0, 120, 104), g('translate(96 50) rotate(30)', rect(-2, 0, 4, 18, C.grey, 1, C.ink, 1), circle(0, -2, 5, 'none', C.grey, 3)), frame(2, 14, 116, 90)),
  'raili.bangård': all(rect(0, 0, 120, 120, STONE, 0, null), ...[20, 40, 60, 80, 100].map((y, i) => all(path(`M0 60 C30 60 30 ${y} 56 ${y} L120 ${y}`, 'none', STEEL, 2), path(`M0 ${60 + 6} C30 66 30 ${y + 6} 56 ${y + 6} L120 ${y + 6}`, 'none', STEEL, 2),
    i % 2 === 0 ? all(rect(66, y - 2, 22, 10, [TRAIN, C.red, C.green][i / 2] as string, 1.5, C.ink, 1), rect(92, y - 2, 22, 10, [C.orange, TRAIN, C.brown][i / 2] as string, 1.5, C.ink, 1)) : '')), frame(2, 12, 116, 100)),
  'raili.boggi': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), greyed(rect(0, 10, 120, 40, TRAIN, 3, C.ink, 1.6)), trackSide(0, 120, 100), rect(18, 62, 84, 16, HL, 3, C.ink, 1.6),
    line('M40 62 L48 59 L40 56 L48 53 L40 50 M74 62 L82 59 L74 56 L82 53 L74 50', C.dark, 2.2), circle(34, 86, 13, C.dark, C.ink, 1.6), circle(86, 86, 13, C.dark, C.ink, 1.6), circle(34, 86, 4, STEEL2, C.ink, 1), circle(86, 86, 4, STEEL2, C.ink, 1), ring(60, 76, 46)),
  'raili.rangera': all(rect(0, 0, 120, 120, STONE, 0, null), trackTop(0, 120, 34), trackTop(0, 120, 86), path('M20 86 C44 86 50 34 76 34', 'none', STEEL, 2.4),
    moving('railirang', '0%{transform:translate(-36px,0)}70%,100%{transform:translate(0,0)}', { dur: 3 }, all(rect(54, 80, 20, 12, C.yellow, 2, C.ink, 1.2), rect(76, 80, 22, 12, C.brown, 1.5, C.ink, 1.2), rect(100, 80, 18, 12, TRAIN, 1.5, C.ink, 1.2), rect(56, 76, 8, 6, C.yellow, 1, C.ink, 1))),
    rect(84, 28, 22, 12, C.red, 1.5, C.ink, 1.2), path('M34 70 C46 56 56 46 66 42', 'none', HL, 2.6), arrow(60, 46, 70, 40, HL, 2.6)),
  'raili.underhållsskuld': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), greyed(trackSide(0, 120, 104)),
    waGrow('railiuhs', ...range(6).map((i) => all(rect(18 + (i % 2) * 3, 84 - i * 13, 44, 12, C.white, 1.5, C.ink, 1.2), line(`M${24 + (i % 2) * 3} ${90 - i * 13} L${50 + (i % 2) * 3} ${90 - i * 13}`, C.grey, 1.4), rect(52 + (i % 2) * 3, 86 - i * 13, 6, 6, 'none', 1, HL, 1.4)))),
    path('M74 70 L86 82 L80 96 L92 100', 'none', C.red, 2), g('translate(96 50)', path('M-14 -8 L14 -8 L12 14 L-12 14 Z', C.tan, C.ink, 1.4), line('M-6 -2 L6 -2', C.ink, 1.2)), T(96, 56, '0', 10, C.red), arrow(40, 14, 40, 4, HL, 2.6)),
  'raili.banarbetare': all(sky(), grass(104), trackSide(0, 120, 102), person(56, VEST, { hat: C.yellow, l: [-14, 30], r: [16, 26], legs: VEST }), line('M54 98 L76 60', C.dark, 3), rect(70, 54, 12, 6, C.dark, 1, C.ink, 1),
    line('M48 70 L64 70 M48 76 L64 76', C.white, 2), ring(56, 62, 34)),
  'raili.tvätthall': all(rect(0, 0, 120, 120, '#dfe6ec', 0, null), rect(0, 100, 120, 20, '#9aa3ad', 0, null), g('translate(20 0)', trainSide(0, 100, 80)),
    waSpin('railitvh', 1.4, g('translate(24 64)', ...range(8).map((i) => line(`M0 0 L${f1(Math.cos((i * Math.PI) / 4) * 14)} ${f1(Math.sin((i * Math.PI) / 4) * 14)}`, '#3f7fc8', 3)), circle(0, 0, 4, C.dark, null))),
    waSpin('railitvh2', 1.4, g('translate(96 64)', ...range(8).map((i) => line(`M0 0 L${f1(Math.cos((i * Math.PI) / 4) * 14)} ${f1(Math.sin((i * Math.PI) / 4) * 14)}`, '#3f7fc8', 3)), circle(0, 0, 4, C.dark, null))),
    ...range(6).map((i) => drop(30 + i * 12, 22 + (i % 2) * 8, 1.1)), path('M0 14 L120 14', 'none', C.dark, 3), frame(4, 8, 112, 96)),

  // ── 4156 Tunnelbanesystem ──
  'raili.strömskena': all(rect(0, 0, 120, 120, '#2f3340', 0, null), path('M4 120 L4 50 C4 10 116 10 116 50 L116 120 Z', '#5d6270', C.ink, 1.6), rect(4, 96, 112, 24, STONE, 0, null), rect(20, 92, 66, 6, CONC, 1, C.ink, 1),
    ...[30, 76].map((x) => rect(x - 4, 82, 8, 10, STEEL, 1, C.ink, 1)), rect(94, 80, 14, 12, HL, 1.5, C.ink, 1.4), rect(92, 76, 18, 4, '#f3d9a8', 1, C.ink, 1), waPulse('railistrs', bolt(101, 58, 1.1)), ring(101, 84, 15)),
  'raili.plattformsdörr': all(rect(0, 0, 120, 120, '#e9eef2', 0, null), rect(0, 24, 120, 62, TRAIN, 0, C.ink, 1.4), ...range(4).map((i) => rect(6 + i * 30, 36, 18, 14, GLASS, 1.5, C.ink, 0.8)), platform(0, 120, 86),
    rect(0, 30, 120, 56, '#cfe4f1', 0, null), line('M0 30 L120 30', C.grey, 3), ...[0, 40, 80].map((x) => rect(x, 30, 6, 56, C.grey, 0, C.ink, 1)),
    moving('railipfd', '0%,20%{transform:translate(10px,0)}70%,100%{transform:translate(0,0)}', { dur: 3 }, rect(46, 34, 14, 52, '#e8f3fa', 1, HL, 2)),
    moving('railipfd2', '0%,20%{transform:translate(-10px,0)}70%,100%{transform:translate(0,0)}', { dur: 3 }, rect(70, 34, 14, 52, '#e8f3fa', 1, HL, 2)), rect(60, 36, 10, 50, TRAIN, 0, C.ink, 1), frame(44, 28, 42, 60)),
  'raili.förarlös': all(rect(0, 0, 120, 120, '#e9eef2', 0, null), path('M10 112 L10 30 C10 16 22 8 36 8 L84 8 C98 8 110 16 110 30 L110 112 Z', TRAIN, C.ink, 1.8), path('M20 50 L20 26 C20 20 26 16 32 16 L88 16 C94 16 100 20 100 26 L100 50 Z', GLASS, C.ink, 1.4),
    greyed(circle(46, 32, 7, C.skin, C.ink, 1.2), path('M36 50 C36 40 56 40 56 50 Z', C.navy, C.ink, 1.2)), cross(46, 36, 11), rect(66, 26, 26, 18, '#14233f', 2, C.ink, 1.2), line('M70 38 L76 32 L82 36 L88 30', '#7fd0ff', 1.6),
    circle(32, 80, 6, C.yellow, C.ink, 1.2), circle(88, 80, 6, C.yellow, C.ink, 1.2), ring(60, 34, 30)),
  'raili.spårområde': all(rect(0, 0, 120, 120, '#d8d2c6', 0, null), rect(0, 30, 120, 60, STONE, 0, null), trackTop(0, 120, 46), trackTop(0, 120, 74), path('M2 30 L118 30 L118 90 L2 90 Z', 'none', HL, 3),
    ...range(8).map((i) => line(`M${i * 16} 90 L${i * 16 + 10} 30`, HL, 1, '2 3')), line('M0 96 L120 96 M0 108 L120 108', C.grey, 1.6), ...range(9).map((i) => line(`M${4 + i * 14} 94 L${4 + i * 14} 110`, C.grey, 2)), warn(100, 18, 0.9), greyed(person(28, C.green, { s: 0.3, y: 120 }))),

  // ── 4157 Trafikledning ──
  'raili.trafikledning': all(rect(0, 0, 120, 120, '#2a3140', 0, null), screen(6, 8, 108, 50, all(line('M12 34 L108 34', '#7fd0ff', 1.8), line('M20 34 L36 20 L84 20 L100 34 M44 34 L56 48 L92 48', '#7fd0ff', 1.8),
    waPulse('railitrl', rect(26, 31, 8, 6, C.yellow, 1, null), rect(70, 17, 8, 6, C.red, 1, null), rect(60, 45, 8, 6, '#3cc46a', 1, null)))),
    desk(4, 86, 52), desk(64, 86, 52), ...[18, 42, 78, 102].map((x) => rect(x - 9, 70, 18, 14, C.dark, 2, C.ink, 1)), ...[30, 90].map((x) => all(circle(x, 78, 6, C.skin, C.ink, 1), rect(x - 8, 84, 16, 10, C.sky, 3, C.ink, 1))), frame(2, 4, 116, 108)),
  'raili.trafikledare': all(rect(0, 0, 120, 120, '#2a3140', 0, null), screen(4, 14, 40, 30, line('M10 34 L38 34 M14 34 L24 24 L36 24', '#7fd0ff', 1.6)), screen(76, 14, 40, 30, line('M82 30 L110 30 M90 30 L100 40', '#7fd0ff', 1.6)), desk(8, 92, 104),
    person(60, C.sky, { s: 0.9, l: [-18, 34], r: [18, 34], y: 112 }), path('M49 50 C49 36 71 36 71 50', 'none', C.dark, 2.4), rect(46, 48, 5, 8, C.dark, 2, null), rect(69, 48, 5, 8, C.dark, 2, null), line('M50 56 L56 62', C.dark, 1.6), ring(60, 56, 22)),
  'raili.trafikera': all(rect(0, 0, 120, 120, '#eaf2f7', 0, null), line('M18 60 L102 60', TRAIN, 4), circle(18, 60, 7, C.white, C.ink, 2), circle(102, 60, 7, C.white, C.ink, 2),
    moving('railitrf', '0%,100%{transform:translate(0,0)}50%{transform:translate(64px,0)}', { dur: 3.6 }, trainTop(28, 60, 18, 1, HL)), clock(40, 92, 10, 180), clock(80, 92, 10, 0), arrow(40, 40, 80, 40, C.grey, 2.2), arrow(80, 30, 40, 30, C.grey, 2.2)),
  'raili.tågmöte': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 50), path('M24 50 C36 50 38 76 50 76 L74 76 C86 76 88 50 100 50', 'none', STEEL, 2.4), rect(46, 84, 32, 14, '#e6dccb', 2, C.ink, 1.2),
    trainTop(62, 76, 24, 1, C.red), moving('railitgm', '0%{transform:translate(70px,0)}100%{transform:translate(-80px,0)}', { dur: 3.4 }, trainTop(62, 50, 30, -1)), ring(62, 64, 26)),
  'raili.följdförsening': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), trackTop(0, 120, 86), trainTop(20, 86, 24, 1), trainTop(60, 86, 24, 1), trainTop(100, 86, 24, 1),
    clock(100, 50, 10, 120, '#ffd9d0'), burst(108, 38, 6, C.red), waIn('railifoe', 20, 0, clock(60, 50, 10, 90, '#ffd9d0'), clock(20, 50, 10, 60, '#ffd9d0')), arrow(88, 50, 74, 50, HL, 2.4), arrow(48, 50, 34, 50, HL, 2.4)),
  'raili.leda-om': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 80), path('M14 80 C30 80 34 30 60 30 C86 30 90 80 106 80', 'none', STEEL, 2.4), rect(52, 70, 16, 20, '#f3f3ef', 2, C.red, 2), cross(60, 80, 6),
    path('M20 70 C34 70 36 40 60 40 C84 40 86 70 100 70', 'none', HL, 2.6), arrow(96, 66, 102, 72, HL, 2.6), moving('raililedo', '0%{transform:translate(-40px,26px)}50%{transform:translate(0,0)}100%{transform:translate(40px,26px)}', { dur: 3.4 }, trainTop(60, 30, 22, 1))),
  'raili.punktlighet': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), clock(48, 50, 32, 0), tick(48, 98, 2.4), greyed(clock(100, 24, 10, 90, '#ffd9d0')), circle(100, 24, 14, 'none', C.grey, 1.4)),
};

