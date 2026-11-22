/**
 * Teknik & digital värld → Byggnad & infrastruktur → Byggarbetsplatsen, 4121–4127 (0.59): trades on a building site,
 * scaffolds and ladders, site machines, site safety, stages of a build, deliveries of material and the final
 * inspection. Recurring signs: the part that the word names is orange or outlined in orange (ring, frame or arrow) and
 * grey parts show what the word is not. Workers wear a yellow helmet and a reflective vest; the site manager and the
 * inspectors wear a white helmet. Machines are yellow, the house being built is grey concrete and pale wood. Words
 * that are easy to mix up get clearly different scenes: ställning (the scaffold alone around a facade) and
 * ställningsbyggare (a worker carrying a tube, ringed); stege (leaning) and trappstege (standing alone on four legs);
 * skyddsräcke (rails on the deck edge), skyddsnät (a net that catches a falling brick) and fallskyddssele (straps on
 * the body and a rope to a hook); dumper (driving with a full bed) and tippa (a tilted bed, gravel pouring out);
 * vält (a big steel drum on a road) and markvibrator (a small shaking plate that a person walks behind); entreprenör
 * (customer → contract → building company) and underentreprenör (company → smaller companies below); tidsplan (bars on
 * a week grid), etapp (a house in three steps, step 2 framed) and byggtid (a long arrow from empty plot to house);
 * slutbesiktning (a new house, ribbon and checklist), garantibesiktning (a lived-in house, a calendar with 2 and a
 * crack under a magnifier) and besiktningsprotokoll (the paper itself). Digits and code signs only; no words, no
 * brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const MACHY = '#f2b632';
const VEST = '#ff9a3c';
const REFL = '#e8eef2';
const CONC = '#b9bec4';
const WOOD = '#d9b07a';
const BRICK = '#c4623f';
const SKY = '#e4f0f7';
const SOIL = '#a07850';
const GRAVEL = '#bfb5a3';
const TARP = '#3f7fc8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const sky = (col = SKY) => rect(0, 0, 120, 120, col, 0, null);
const earth = (y = 104, col = '#c9b79a') => rect(0, y, 120, 120 - y, col, 0, null);
const room = (col = '#efe8dc') => all(rect(0, 0, 120, 120, col, 0, null), rect(0, 100, 120, 20, '#d8d2c6', 0, null));
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.6);
const cross = (x: number, y: number, s = 5, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 2.6);
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.9);
const sparkle = (x: number, y: number, r = 5, col: string = C.gold) => path(`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`, col, null);
const helmetIcon = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 2 C-9 -10 9 -10 9 2 Z', col, C.ink, 1.4), rect(-11, 1, 22, 3, col, 1, C.ink, 1.2), line('M0 -8 L0 -2', C.ink, 1));
const paper = (x: number, y: number, w: number, h: number, col: string = C.white) => all(rect(x, y, w, h, col, 2, C.ink, 1.6), path(`M${x + w - 8} ${y} L${x + w} ${y + 8} L${x + w - 8} ${y + 8} Z`, '#e3e3dc', C.ink, 1));
const rows = (x: number, y: number, w: number, n: number, gap = 8, col: string = C.grey) => line(range(n).map((i) => `M${x} ${y + i * gap} L${x + w} ${y + i * gap}`).join(' '), col, 1.4);
const clipboard = (x: number, y: number, w = 22, h = 28) => all(rect(x, y, w, h, '#b88a5a', 2, C.ink, 1.4), rect(x + 3, y + 4, w - 6, h - 7, C.white, 1, null), rect(x + w / 2 - 5, y - 2, 10, 5, C.grey, 1, C.ink, 1));
const calendar = (x: number, y: number, w: number, big = '') => all(rect(x, y, w, w, C.white, 3, C.ink, 1.6), rect(x, y, w, w * 0.25, C.red, 3, C.ink, 1.6), line(`M${x + w * 0.3} ${y - 3} L${x + w * 0.3} ${y + 4} M${x + w * 0.7} ${y - 3} L${x + w * 0.7} ${y + 4}`, C.ink, 1.6),
  big ? T(x + w / 2, y + w * 0.88, big, w * 0.55, C.ink) : rows(x + 4, y + w * 0.42, w - 8, 3, w * 0.18));
const magnifier = (x: number, y: number, r = 9) => all(line(`M${x + r * 0.7} ${y + r * 0.7} L${x + r * 1.6} ${y + r * 1.6}`, C.dark, 4), circle(x, y, r, 'rgba(220,240,252,0.5)', C.ink, 2));
const crack = (x: number, y: number, s = 1) => line(`M${x} ${y} l${3 * s} ${5 * s} l${-2 * s} ${4 * s} l${4 * s} ${6 * s} l${-1 * s} ${5 * s}`, C.red, 1.8);
const key = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 5, C.gold, C.ink, 1.4), circle(0, 0, 1.6, '#f6f2ea', null), path('M5 -1.5 L18 -1.5 L18 4 L15 4 L15 1.5 L12 1.5 L12 4 L9 4 L9 1.5 L5 1.5 Z', C.gold, C.ink, 1.2));
const flag = (x: number, y: number, col: string = C.green, h = 26) => all(line(`M${x} ${y} L${x} ${y - h}`, C.dark, 2), path(`M${x} ${y - h} L${x + 14} ${y - h + 5} L${x} ${y - h + 10} Z`, col, C.ink, 1.2));
const phoneIcon = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -10, 12, 20, C.dark, 2.5, C.ink, 1.2), rect(-4.5, -7.5, 9, 14, '#bfe3f5', 1, null));
const hand = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-6, -5, 12, 11, C.skin, 4, C.ink, 1.2), rect(-9, -3, 5, 7, C.skin, 2.5, C.ink, 1.1));

/** Standing person, feet at (x, y=112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck.
 *  hat: helmet colour; vest: reflective stripes on the top. */
type PO = { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; legs?: string; vest?: boolean; kneel?: boolean };
const person = (x: number, top: string, o: PO = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  const legs = o.kneel ? all(line('M-5 -14 L-14 -14 L-14 0', o.legs ?? C.navy, 7), line('M5 -14 L5 -26', o.legs ?? C.navy, 7), line('M-5 -14 L-4 -26', o.legs ?? C.navy, 7), line('M5 -14 L14 -2 L22 -2', o.legs ?? C.navy, 7)) : line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7);
  const dy = o.kneel ? 12 : 0;
  return g(`translate(${x} ${(o.y ?? 112)}) scale(${s})`, legs, g(`translate(0 ${dy})`,
    rect(-11, -56, 22, 32, top, 6, C.ink, 1.6), o.vest ? line('M-10 -44 L10 -44 M-10 -36 L10 -36', REFL, 2.4) : '',
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2)));
};
/** A worker: yellow helmet, orange vest with reflective stripes. */
const worker = (x: number, o: PO = {}) => person(x, VEST, { hat: C.yellow, vest: true, ...o });
/** Site manager / inspector: white helmet. */
const boss = (x: number, top: string = C.navy, o: PO = {}) => person(x, top, { hat: C.white, ...o });

// ── Building parts ───────────────────────────────────────────────────
const brickWall = (x: number, y: number, cols: number, rowsN: number, w = 12, h = 6, last = cols) => all(...range(rowsN).flatMap((r) => range(r === rowsN - 1 ? last : cols).map((c) => rect(x + c * w + (r % 2 ? w / 2 : 0), y - (r + 1) * h, w - 1, h - 1, BRICK, 0.5, C.ink, 0.8))));
/** House shell being built: concrete walls up to height h with window holes. */
const shell = (x: number, w: number, h: number, roof = false) => all(rect(x, 112 - h, w, h, CONC, 1, C.ink, 1.6), ...range(Math.floor(w / 22)).map((i) => rect(x + 6 + i * 22, 112 - h + 8, 10, 12, '#5d636b', 1, C.ink, 1)),
  roof ? path(`M${x - 4} ${112 - h} L${x + w / 2} ${112 - h - 22} L${x + w + 4} ${112 - h} Z`, '#8c5a44', C.ink, 1.6) : '');
/** Finished house with door, windows and roof; ground at 112. */
const house = (x: number, w: number, h: number, col = '#f2e6cf', lived = false) => all(rect(x, 112 - h, w, h, col, 1, C.ink, 1.8), path(`M${x - 6} ${112 - h} L${x + w / 2} ${112 - h - w * 0.42} L${x + w + 6} ${112 - h} Z`, '#a3503c', C.ink, 1.8),
  rect(x + w / 2 - 6, 112 - 22, 12, 22, '#8c5a44', 1, C.ink, 1.4), rect(x + 6, 112 - h + 8, 12, 12, '#cfe8f6', 1, C.ink, 1.2), rect(x + w - 18, 112 - h + 8, 12, 12, '#cfe8f6', 1, C.ink, 1.2),
  lived ? all(path(`M${x + 6} ${112 - h + 8} L${x + 10} ${112 - h + 8} L${x + 7} ${112 - h + 20} L${x + 6} ${112 - h + 20} Z`, C.rose, null), path(`M${x + w - 18} ${112 - h + 8} L${x + w - 14} ${112 - h + 8} L${x + w - 17} ${112 - h + 20} L${x + w - 18} ${112 - h + 20} Z`, C.rose, null), circle(x + 12, 112 - h + 19, 2.6, C.green, null)) : '');
/** Scaffold of tubes and plank decks from x, width w, floors n (each 22 high), bottom at 112. */
const scaffold = (x: number, w: number, n: number, col: string = '#8d949b', rail = true) => {
  const top = 112 - n * 22;
  const posts = range(Math.floor(w / 24) + 1).map((i) => x + i * 24);
  return all(line(posts.map((px) => `M${px} 112 L${px} ${top - 10}`).join(' '), col, 2.6),
    ...range(n).map((i) => all(rect(x - 2, 112 - (i + 1) * 22, w + 4, 3, WOOD, 0.5, C.ink, 1), rail ? line(`M${x} ${112 - (i + 1) * 22 - 10} L${x + w} ${112 - (i + 1) * 22 - 10}`, col, 1.8) : '')),
    line(range(n).map((i) => `M${x} ${112 - i * 22} L${x + 24} ${112 - (i + 1) * 22}`).join(' '), col, 1.4), ...posts.map((px) => rect(px - 3, 110, 6, 3, C.dark, 0.5, null)));
};
/** Leaning ladder from (x1,y1) bottom to (x2,y2) top. */
const ladder = (x1: number, y1: number, x2: number, y2: number, col: string = '#c0c6cc') => {
  const n = 7, dx = 7;
  return all(line(`M${x1} ${y1} L${x2} ${y2} M${x1 + dx} ${y1} L${x2 + dx} ${y2}`, col, 2.6), line(range(n).map((i) => { const t = (i + 0.6) / n; const ax = x1 + (x2 - x1) * t, ay = y1 + (y2 - y1) * t; return `M${f1(ax)} ${f1(ay)} L${f1(ax + dx)} ${f1(ay)}`; }).join(' '), col, 2), line(`M${x1} ${y1} L${x2} ${y2} M${x1 + dx} ${y1} L${x2 + dx} ${y2}`, C.ink, 0.6));
};
/** Tower crane: mast at x, jib from x-20 to x+70 at height y. */
const towerCrane = (x: number, y: number, hookX: number, hookY: number, load: Svg = '', col: string = MACHY) => all(
  rect(x - 4, y, 8, 112 - y, 'none', 0, col, 2), line(range(Math.floor((112 - y) / 8)).map((i) => `M${x - 4} ${y + i * 8} L${x + 4} ${y + i * 8 + 8}`).join(' '), col, 1.4),
  rect(x - 22, y - 6, 92, 6, col, 1, C.ink, 1.2), line(`M${x} ${y - 16} L${x - 22} ${y - 6} M${x} ${y - 16} L${x + 70} ${y - 6}`, C.dark, 1.2), rect(x - 22, y - 2, 10, 10, C.dark, 1, C.ink, 1),
  rect(x + 4, y, 10, 9, C.white, 1, C.ink, 1.2), line(`M${hookX} ${y} L${hookX} ${hookY}`, C.dark, 1.2), path(`M${hookX - 2} ${hookY} C${hookX - 2} ${hookY + 5} ${hookX + 3} ${hookY + 5} ${hookX + 3} ${hookY + 2}`, 'none', C.dark, 1.6), load);
/** Truck chassis seen from the side, cab right; wheels on 112. */
const truck = (x: number, s = 1, cab: string = C.red, body: Svg = '') => g(`translate(${x} 112) scale(${s})`, rect(-44, -14, 70, 6, C.dark, 1, C.ink, 1.2), body,
  path('M26 -36 L40 -36 L48 -22 L48 -8 L26 -8 Z', cab, C.ink, 1.6), path('M30 -33 L38 -33 L43 -23 L30 -23 Z', '#dff1fb', C.ink, 1),
  circle(-32, -5, 6, C.dark, C.ink, 1.4), circle(-18, -5, 6, C.dark, C.ink, 1.4), circle(36, -5, 6, C.dark, C.ink, 1.4));
/** Pallet with planks; top at y. */
const planks = (x: number, y: number, w = 40, n = 3) => all(...range(n).map((i) => rect(x - w / 2, y - (i + 1) * 4, w, 4, WOOD, 0.5, C.ink, 0.9)));
const pallet = (x: number, y: number, w = 36) => all(rect(x - w / 2, y, w, 3, WOOD, 0.5, C.ink, 1.2), rect(x - w / 2, y + 3, 5, 4, WOOD, 0.5, C.ink, 1), rect(x - 2.5, y + 3, 5, 4, WOOD, 0.5, C.ink, 1), rect(x + w / 2 - 5, y + 3, 5, 4, WOOD, 0.5, C.ink, 1));
const box = (x: number, y: number, w = 16, h = 12, col: string = C.tan) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h + 4} L${x + w / 2} ${y - h + 4}`, '#a0673d', 1.1));
const wheel = (x: number, y: number, r: number) => all(circle(x, y, r, C.dark, C.ink, 1.4), circle(x, y, r * 0.45, C.grey, C.ink, 1));
const gravelPile = (x: number, y: number, w: number, h: number, col: string = GRAVEL) => all(path(`M${x - w / 2} ${y} C${x - w / 3} ${y - h} ${x + w / 3} ${y - h} ${x + w / 2} ${y} Z`, col, C.ink, 1.4), ...range(6).map((i) => circle(x - w / 3 + i * (w / 9), y - h * 0.3 - (i % 2) * 3, 1, C.dark, null)));
const fencePanel = (x: number, w = 30, h = 46) => all(rect(x, 112 - h - 4, w, h, 'rgba(255,255,255,0.12)', 0, C.grey, 2), line([...range(Math.floor(w / 5)).map((i) => `M${x + 5 + i * 5} ${112 - h - 4} L${x + 5 + i * 5} ${108}`), ...range(Math.floor(h / 5)).map((i) => `M${x} ${108 - (i + 1) * 5} L${x + w} ${108 - (i + 1) * 5}`)].join(' '), C.grey, 0.7), rect(x - 3, 106, 8, 6, C.dark, 1, null), rect(x + w - 5, 106, 8, 6, C.dark, 1, null));

export const CSITE_MOTIFS: Record<string, Svg> = {
  // ── 4121 Byggarbetets yrken ──
  'csite.bygge': all(sky(), earth(), fencePanel(2, 26, 30), shell(36, 66, 50), scaffold(32, 74, 2, '#8d949b', false), towerCrane(20, 18, 74, 46, rect(66, 46, 16, 6, WOOD, 0.5, C.ink, 1)), worker(110, { s: 0.42 }), gravelPile(100, 112, 18, 8, SOIL), frame(2, 4, 116, 110)),
  'csite.murare': all(sky('#eef1f4'), ground(), brickWall(48, 112, 5, 9, 12, 6, 3), rect(46, 112 - 9 * 6 - 3, 64, 3, '#d9d2c4', 0.5, null),
    worker(26, { l: [-14, 30], r: [22, 6] }), g('translate(48 52) rotate(-20)', path('M0 0 L14 -4 L12 6 Z', C.silver, C.ink, 1.2), line('M0 0 L-6 2', C.brown, 3)), rect(84, 52, 11, 5, BRICK, 0.5, C.ink, 1), path('M14 100 L30 100 L28 112 L16 112 Z', C.grey, C.ink, 1.4), ellipse(22, 100, 8, 2.5, '#d9d2c4', C.ink, 1), ring(82, 56, 14)),
  'csite.betongarbetare': all(sky('#eef1f4'), earth(100, '#c9b79a'), rect(8, 88, 104, 14, 'none', 0, WOOD, 3), rect(10, 92, 100, 10, '#9ea4ab', 0, null), path('M10 92 C30 89 50 94 70 91 C90 89 100 93 110 92', 'none', '#808790', 1.4),
    path('M92 10 L104 10 L100 62 L94 62 Z', C.grey, C.ink, 1.4), path('M96 62 C96 72 92 80 90 90', 'none', '#9ea4ab', 6), worker(46, { y: 96, l: [6, 28], r: [16, 30], legs: C.dark }), line('M56 70 L58 98', C.dark, 2.4), rect(55, 94, 5, 8, C.grey, 1, C.ink, 1), line('M38 96 L38 104 M54 96 L54 104', C.dark, 6), ring(52, 90, 14)),
  'csite.plattsättare': all(room('#eef3f6'), ...range(5).flatMap((r) => range(6).map((c) => (r < 3 || c < 3) ? rect(8 + c * 14, 86 - (r + 1) * 14, 13, 13, '#bfe0ef', 1, '#8fb3c4', 1) : '')),
    worker(90, { l: [-30, 8], r: [-20, 20] }), rect(46, 34, 13, 13, '#bfe0ef', 1, C.ink, 1.6), rect(62, 38, 10, 6, C.grey, 1, C.ink, 1), ring(52, 40, 12)),
  'csite.plåtslagare': all(sky(), path('M0 112 L0 92 L120 62 L120 112 Z', '#e9ddc7', C.ink, 1.4), path('M0 92 L120 62 L120 72 L0 102 Z', '#7f94a6', C.ink, 1.6),
    line(range(10).map((i) => `M${i * 13} ${f1(100 - i * 3.3)} L${i * 13 + 2} ${f1(90 - i * 3.3)}`).join(' '), '#5d7286', 1.2), rect(0, 102, 60, 5, '#93a6b8', 2, C.ink, 1.2),
    worker(70, { y: 75, s: 0.72, l: [-24, 14], r: [14, 14] }), path('M30 58 L56 52 L58 58 L32 64 Z', '#a9bccc', C.ink, 1.4), g('translate(86 62)', line('M0 0 L8 -8 M0 0 L8 4', C.red, 2.4)), ring(46, 58, 16)),
  'csite.golvläggare': all(room('#efe8dc'), rect(0, 100, 120, 20, '#d8d2c6', 0, null),
    ...range(4).map((i) => rect(4 + i * 3, 102 + i * 4, 110, 3.6, WOOD, 0.5, C.ink, 0.8)), person(46, C.green, { kneel: true, y: 106, l: [10, 34], r: [26, 30], legs: C.navy }),
    moving('csgolv', '0%{transform:translate(-14px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(64, 96, 50, 4, '#e6c08e', 0.5, C.ink, 1.2)), ring(84, 98, 16)),
  'csite.kranförare': all(sky(), towerCrane(30, 22, 92, 62, waBob('cskrb', 6, rect(84, 62, 18, 8, CONC, 1, C.ink, 1.2))), circle(39, 27, 3, C.skin, C.ink, 1), path('M36 25 C36 21 42 21 42 25 Z', C.yellow, null), ring(39, 27, 9), ground()),
  'csite.platschef': all(sky(), ground(), rect(70, 58, 46, 40, '#e9e4d6', 2, C.ink, 1.6), rect(78, 66, 12, 10, '#cfe8f6', 1, C.ink, 1), rect(100, 72, 10, 26, C.dark, 1, C.ink, 1), rect(70, 98, 46, 6, C.dark, 0, null),
    greyed(worker(10, { s: 0.45 }), worker(108, { s: 0.4, y: 56 })), boss(40, C.navy, { l: [-16, 18], r: [16, 20] }), clipboard(48, 70, 16, 20), phoneIcon(24, 76, 0.8), ring(40, 74, 30)),
  'csite.entreprenör.2': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), ground(), person(18, C.green, { s: 0.6, r: [16, 14] }), paper(46, 50, 26, 32), rows(50, 60, 16, 3, 6), line('M50 76 L62 74', C.navy, 1.4), line('M30 80 L44 68', C.grey, 1.6, '3 2'), arrow(74, 66, 86, 66, HL, 2.6),
    g('translate(102 70)', rect(-16, -20, 32, 22, '#dfe3e7', 1, C.ink, 1.6), path('M-18 -20 L0 -32 L18 -20 Z', HL, C.ink, 1.6), helmetIcon(0, -8, 0.9)), shell(84, 34, 26), ring(102, 64, 20)),
  'csite.underentreprenör': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), g('translate(60 30)', rect(-24, -16, 48, 26, '#dfe3e7', 2, C.ink, 1.6), path('M-26 -16 L0 -28 L26 -16 Z', C.grey, C.ink, 1.6), helmetIcon(0, -2, 1.1)),
    arrow(46, 46, 26, 66, HL, 2.6), arrow(74, 46, 94, 66, HL, 2.6),
    g('translate(24 86)', rect(-16, -12, 32, 22, '#fde3d4', 2, HL, 2.2), path('M2 -8 L-6 2 L0 2 L-3 8 L6 -2 L0 -2 Z', C.yellow, C.ink, 1)),
    g('translate(96 86)', rect(-16, -12, 32, 22, '#fde3d4', 2, HL, 2.2), ...range(3).map((i) => rect(-10 + i * 7, -6, 6, 6, '#bfe0ef', 0.5, C.ink, 0.8)), ...range(3).map((i) => rect(-10 + i * 7, 1, 6, 6, '#bfe0ef', 0.5, C.ink, 0.8)))),
  'csite.yrkesbevis': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(14, 26, 92, 64, C.white, 4, C.ink, 2), rect(14, 26, 92, 12, C.navy, 4, C.ink, 2), rect(22, 46, 24, 30, '#dfe9f2', 2, C.ink, 1.4), circle(34, 56, 6, C.skin, C.ink, 1.2), path('M27 76 C27 66 41 66 41 76 Z', VEST, C.ink, 1.2), path('M27 54 C27 46 41 46 41 54 Z', C.yellow, C.ink, 1.2),
    rows(54, 50, 40, 3, 8), circle(88, 76, 9, C.gold, C.ink, 1.4), tick(88, 76, 1, C.white), g('translate(66 76) rotate(-30)', rect(-2, -10, 4, 16, C.brown, 1, C.ink, 1), rect(-6, -14, 12, 6, C.silver, 1, C.ink, 1))),

  // ── 4122 Ställningar och stegar ──
  'csite.ställning.4': all(sky(), ground(), rect(16, 24, 92, 88, '#efe1c8', 1, C.ink, 1.6), ...range(3).flatMap((r) => range(3).map((c) => rect(26 + c * 30, 32 + r * 26, 12, 14, '#cfe8f6', 1, C.ink, 1))), scaffold(8, 96, 4, C.orange), frame(4, 16, 108, 97)),
  'csite.ställningsbyggare': all(sky(), ground(), greyed(rect(70, 24, 46, 88, '#efe1c8', 1, C.ink, 1.6), scaffold(70, 48, 3)), worker(40, { l: [-14, 4], r: [12, 4] }), g('translate(40 46) rotate(-12)', rect(-34, -3, 68, 5, '#8d949b', 2, C.ink, 1.2)), path('M58 98 L66 98 L66 104 L58 104 Z', C.dark, null), ring(40, 64, 34)),
  'csite.demontera': all(sky(), ground(), scaffold(18, 72, 3, '#8d949b'), ...range(3).map((i) => rect(96, 106 - i * 4, 20, 3, '#8d949b', 1, C.ink, 0.8)), ...range(2).map((i) => rect(96, 96 - i * 4, 20, 3, WOOD, 0.5, C.ink, 0.8)),
    moving('csdem', '0%{transform:translate(0,0);opacity:1}70%,100%{transform:translate(18px,-16px);opacity:0}', { dur: 2.8 }, rect(16, 112 - 66 - 3, 76, 3, WOOD, 0.5, C.ink, 1), line('M18 36 L90 36', '#8d949b', 2.6)), arrow(70, 26, 96, 14, HL, 2.6)),
  'csite.trappstege': all(room('#eef1f4'), line('M60 4 L60 14', C.dark, 1.6), path('M52 14 L68 14 L64 22 L56 22 Z', C.yellow, C.ink, 1.2),
    line('M34 104 L54 32 M44 104 L58 32', '#9aa3ad', 3.4), line('M86 104 L64 32', '#9aa3ad', 3.4), rect(50, 28, 18, 6, C.grey, 1, C.ink, 1.2),
    line([0, 1, 2, 3].map((i) => { const y = 88 - i * 15, t = (104 - y) / 72; return `M${f1(34 + 20 * t)} ${y} L${f1(44 + 14 * t)} ${y}`; }).join(' '), '#9aa3ad', 4), line('M47 72 L76 72', C.dark, 1.6),
    rect(30, 102, 8, 3, C.dark, 1, null), rect(40, 102, 8, 3, C.dark, 1, null), rect(82, 102, 8, 3, C.dark, 1, null), frame(24, 24, 72, 86)),
  'csite.klättra': all(sky(), ground(), rect(60, 10, 60, 102, '#efe1c8', 0, C.ink, 1.6), ladder(46, 112, 66, 14),
    moving('csklat', '0%{transform:translate(8px,30px)}100%{transform:translate(0,0)}', { dur: 3 }, worker(52, { s: 0.7, y: 88, l: [6, -6], r: [16, -14] })), arrow(30, 90, 38, 40, HL, 2.6)),
  'csite.skylift': all(sky(), ground(), rect(84, 8, 36, 104, '#efe1c8', 0, C.ink, 1.6), truck(42, 0.8, C.white, all(rect(-30, -20, 16, 8, MACHY, 1, C.ink, 1.2))),
    moving('cssky', '0%{transform:translate(0,40px)}60%,100%{transform:translate(0,0)}', { dur: 3.2 }, line('M22 92 L66 34', MACHY, 6), line('M22 92 L66 34', C.ink, 0.8), rect(58, 22, 22, 12, C.white, 1, C.ink, 1.6), worker(69, { s: 0.42, y: 26 })), ring(69, 22, 16)),
  'csite.skyddsräcke': all(sky(), earth(110, '#c9ced4'), rect(0, 54, 120, 6, WOOD, 0.5, C.ink, 1.4), line('M8 60 L8 112 M60 60 L60 112 M112 60 L112 112', '#8d949b', 2.6),
    worker(36, { s: 0.6, y: 54 }), line('M4 54 L4 24 M60 54 L60 24 M116 54 L116 24', HL, 3), line('M4 26 L116 26 M4 40 L116 40', HL, 3.4), rect(4, 48, 112, 6, HL, 0.5, C.ink, 1), arrow(80, 100, 80, 70, C.grey, 2)),
  'csite.skyddsnät.2': all(sky(), rect(0, 10, 40, 102, '#efe1c8', 0, C.ink, 1.6), rect(40, 10, 6, 16, C.dark, 0, null), line('M40 58 L112 58', C.dark, 2), path('M40 58 C60 78 90 78 112 58', 'none', C.dark, 2),
    line(range(8).map((i) => `M${44 + i * 9} 58 C${46 + i * 9} 66 ${48 + i * 9} 70 ${48 + i * 9} ${f1(72 - Math.abs(i - 3.5))}`).join(' '), C.green, 1), path('M40 62 C60 80 90 80 112 62 M40 66 C60 82 90 82 112 66', 'none', C.green, 1),
    waIn('csnet', 0, -30, rect(72, 64, 12, 6, BRICK, 0.5, C.ink, 1)), line('M78 30 L78 52', C.grey, 1.4, '3 2'), ring(76, 68, 14)),
  'csite.fallskyddssele': all(sky(), path('M0 112 L0 82 L120 52 L120 112 Z', '#8c5a44', C.ink, 1.6), circle(104, 50, 3, C.dark, C.ink, 1),
    g('translate(56 92) rotate(-14)', worker(0, { y: 0, s: 0.9, l: [-14, 12], r: [14, 12] }), path('M-9 -50 L9 -30 M9 -50 L-9 -30 M-10 -28 L10 -28 M-6 -26 L-5 -6 M6 -26 L5 -6', 'none', HL, 3)),
    waPulse('cssele', path('M58 46 C76 36 92 40 104 50', 'none', HL, 2.2)), ring(54, 62, 22)),

  // ── 4123 Maskiner på bygget ──
  'csite.mobilkran': all(sky(), ground(), truck(52, 1, MACHY, all(rect(-40, -24, 48, 10, MACHY, 2, C.ink, 1.4), line('M-40 -10 L-48 4 M6 -10 L14 4', C.dark, 3), rect(-52, 2, 8, 3, C.dark, 0.5, null), rect(10, 2, 8, 3, C.dark, 0.5, null))),
    line('M20 90 L92 16', MACHY, 8), line('M20 90 L92 16', C.ink, 0.8), line('M50 59 L92 16', '#d99a1e', 5), line('M92 16 L92 60', C.dark, 1.2), box(92, 72, 18, 12, '#dfe3e7')),
  'csite.hjullastare': all(sky(), earth(108), gravelPile(100, 108, 34, 16, '#e1c68f'), g('translate(46 108)', rect(-34, -26, 40, 18, MACHY, 3, C.ink, 1.6), rect(-24, -48, 22, 22, 'none', 2, C.dark, 2.4), rect(-22, -46, 18, 18, '#dff1fb', 1, null),
    wheel(-24, -8, 10), wheel(0, -8, 10),
    moving('cshjl', '0%,100%{transform:translate(0,10px)}50%{transform:translate(0,-8px)}', { dur: 3 }, line('M4 -24 L22 -30', MACHY, 6), path('M18 -42 L36 -42 L32 -24 L18 -26 Z', '#8d949b', C.ink, 1.6), path('M20 -42 C24 -50 32 -50 34 -42', '#e1c68f', C.ink, 1)))),
  'csite.tippa.2': all(sky(), earth(108), truck(46, 0.9, MACHY), g('translate(46 98)', path('M-40 -2 L4 -2 L4 -36 L-30 -8 Z', C.grey2, C.ink, 1.4)),
    g('translate(10 98) rotate(-32)', rect(0, -24, 44, 22, MACHY, 2, C.ink, 1.6)),
    waIn('cstipp', 10, -14, ...range(6).map((i) => circle(8 - i * 2, 84 + i * 4, 2, '#a99a80', C.ink, 0.6))), waGrow('cstipg', gravelPile(10, 108, 22, 10, '#bfae90')), arrow(56, 46, 40, 60, HL, 2.6)),
  'csite.dumper': all(sky(), earth(106, '#b8a07c'), g('translate(52 108)', path('M-48 -24 L-6 -24 L-2 -46 L-46 -46 Z', MACHY, C.ink, 1.6), path('M-44 -46 C-36 -54 -16 -54 -6 -46 Z', SOIL, C.ink, 1.2), rect(4, -40, 16, 18, MACHY, 2, C.ink, 1.4),
    rect(8, -52, 14, 12, '#dff1fb', 1, C.ink, 1.4), rect(20, -30, 22, 12, MACHY, 2, C.ink, 1.4), circle(0, -26, 3, C.dark, null), wheel(-34, -10, 11), wheel(-12, -10, 11), wheel(30, -10, 11)),
    line('M4 92 L-4 92 M2 98 L-8 98', C.grey, 1.6), arrow(96, 30, 114, 30, HL, 2.6)),
  'csite.betongbil': all(sky(), ground(), truck(54, 1, C.white, all(g('translate(-18 -26) rotate(-12)', ellipse(0, 0, 26, 13, C.orange, C.ink, 1.6), line('M-16 -10 C-10 0 -4 8 0 12 M-2 -13 C4 -2 10 6 14 10', C.ink, 1.2)), line('M-44 -18 L-44 -30 L-50 -24', C.dark, 2))),
    g('translate(16 86)', circle(0, 0, 9, '#e9b07a', C.ink, 1.4), waSpin('csbtb', 1.6, path('M0 -6 A6 6 0 1 1 -6 0', 'none', HL, 2.2), path('M-8 -2 L-6 2 L-3 -1 Z', HL, null))), ring(36, 82, 30)),
  'csite.betongpump': all(sky(), ground(), truck(34, 0.8, C.white, rect(-40, -24, 50, 10, C.grey, 2, C.ink, 1.2)), line('M18 86 L46 30 L84 20 L100 44', C.grey, 5), line('M18 86 L46 30 L84 20 L100 44', C.ink, 0.6),
    circle(46, 30, 3, C.dark, null), circle(84, 20, 3, C.dark, null), path('M100 44 C102 52 100 60 102 72', 'none', C.dark, 3), rect(86, 84, 30, 28, 'none', 0, WOOD, 3), rect(88, 92, 26, 20, '#9ea4ab', 0, null), path('M102 72 L101 90', 'none', '#9ea4ab', 4), ring(72, 30, 32)),
  'csite.markvibrator': all(sky(), earth(106, '#d7c7a8'), ...range(5).map((i) => rect(4 + i * 12, 102, 11, 4, '#c5b393', 0.5, C.ink, 0.6)),
    waShake('csmvb', rect(66, 94, 26, 12, C.yellow, 2, C.ink, 1.6), rect(62, 104, 34, 4, C.dark, 1, C.ink, 1.2), path('M80 94 L74 82', 'none', C.dark, 2)), line('M70 104 C66 108 62 108 58 104 M98 104 C102 108 106 108 110 104', HL, 1.6),
    worker(40, { s: 0.9, r: [24, 4], l: [24, 8] }), line('M60 64 L74 86', C.dark, 3), ring(80, 100, 18)),
  'csite.vält': all(sky(), rect(0, 96, 120, 24, '#6c7178', 0, null), path('M0 96 L40 96 L40 100 L0 100 Z', '#5a5e64', null), path('M70 96 C74 93 78 98 82 95 C86 93 90 98 94 95 C100 93 108 98 120 95 L120 100 L70 100 Z', '#8a8f96', null),
    moving('csvalt', '0%{transform:translate(-14px,0)}100%{transform:translate(6px,0)}', { dur: 3.2 }, rect(18, 60, 34, 22, MACHY, 3, C.ink, 1.6), rect(24, 42, 18, 18, 'none', 2, C.dark, 2.4), wheel(24, 86, 10), circle(70, 80, 17, '#aab1b8', C.ink, 1.8), circle(70, 80, 6, C.dark, null), rect(52, 66, 16, 6, MACHY, 1, C.ink, 1.2)), ring(70, 80, 21)),
  'csite.bilningshammare': all(sky('#eef1f4'), earth(100, '#9ea4ab'), path('M50 100 L58 106 L66 100 L74 106', 'none', C.ink, 1.4), worker(40, { l: [10, 28], r: [24, 28] }),
    rect(44, 70, 26, 7, C.dark, 2, C.ink, 1.2), rect(51, 77, 12, 16, C.red, 2, C.ink, 1.4), line('M57 93 L57 102', C.silver, 4), ...([[70, 92], [76, 86], [46, 90], [80, 96]] as const).map(([x, y]) => rect(x, y, 4, 4, '#9ea4ab', 0.5, C.ink, 0.8)), circle(66, 84, 6, 'rgba(200,200,200,0.6)', null), ring(57, 90, 14)),
  'csite.manövrera': all(rect(0, 0, 120, 120, '#3d3f4a', 0, null), rect(8, 8, 104, 58, '#cfe8f6', 3, C.ink, 1.6), g('translate(30 66)', waSway('csman', 10, line('M0 0 L20 -36 L50 -40', MACHY, 6), path('M46 -46 L60 -46 L56 -30 L46 -32 Z', '#8d949b', C.ink, 1.4))),
    rect(14, 78, 92, 34, '#5d636b', 4, C.ink, 1.6), g('translate(38 96)', waSway('csmanj', 14, line('M0 0 L0 -14', C.dark, 4), circle(0, -16, 5, C.red, C.ink, 1.2), hand(0, -14, 0.9))), g('translate(82 96)', line('M0 0 L0 -14', C.dark, 4), circle(0, -16, 5, C.red, C.ink, 1.2), hand(0, -14, 0.9, 0)),
    path('M24 76 A16 16 0 0 1 52 76', 'none', HL, 2), ring(38, 82, 14)),

  // ── 4124 Byggsäkerhet ──
  'csite.byggstängsel': all(sky(), earth(108), greyed(shell(54, 60, 60), towerCrane(96, 16, 40, 30)), fencePanel(4, 36), fencePanel(42, 36), fencePanel(80, 36), frame(2, 56, 116, 58)),
  'csite.personalliggare': all(sky(), ground(), fencePanel(80, 36, 50), line('M50 112 L50 60', C.dark, 4), rect(36, 30, 30, 34, C.dark, 3, C.ink, 1.6), rect(39, 33, 24, 26, '#dfe9d8', 1, null),
    ...range(3).map((i) => all(circle(44, 39 + i * 8, 2.4, C.navy, null), line(`M48 ${39 + i * 8} L56 ${39 + i * 8}`, C.grey, 1.4), tick(59, 39 + i * 8, 0.4))), worker(18, { s: 0.8, r: [24, 0] }), phoneIcon(36, 66, 0.7), path('M30 54 A8 8 0 0 1 30 42', 'none', HL, 1.6), ring(51, 46, 22)),
  'csite.säkerhetsintroduktion': all(sky('#eef1f4'), ground(), rect(52, 16, 64, 50, C.white, 3, C.ink, 1.8), helmetIcon(66, 34, 1), rect(80, 26, 10, 14, VEST, 2, C.ink, 1), line('M81 31 L89 31 M81 36 L89 36', REFL, 1.4), path('M98 40 L98 30 L104 30 L106 40 Z', C.dark, C.ink, 1), warn(66, 54, 0.8), line('M80 52 L108 52 M80 58 L100 58', C.grey, 1.6),
    boss(102, C.navy, { s: 0.5, l: [-14, 4], r: [12, 22] }), person(26, C.green, { s: 0.75, l: [-12, 20], r: [12, 18] }), helmetIcon(37, 86, 0.8), ring(84, 41, 30)),
  'csite.arbetsmiljöplan': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), paper(10, 8, 100, 104), rect(18, 18, 84, 62, '#eef3e8', 1, C.ink, 1.2), rect(42, 34, 30, 26, CONC, 1, C.ink, 1.2), circle(82, 30, 4, 'none', MACHY, 2), line('M82 30 L82 22 M82 30 L96 30', MACHY, 2),
    path('M76 18 L102 18 L102 44 L76 44 Z', 'rgba(214,69,69,0.25)', C.red, 1.4), line('M20 72 L40 72 L40 62', C.green, 2.4, '4 3'), arrow(36, 64, 40, 60, C.green, 2), warn(30, 96, 0.8), helmetIcon(56, 96, 0.8), rows(70, 92, 30, 3, 6), frame(16, 16, 88, 66)),
  'csite.fallande-föremål': all(sky(), earth(108), scaffold(10, 48, 4), rect(70, 92, 44, 16, 'rgba(214,69,69,0.25)', 0, C.red, 1.4), line('M70 108 L84 92 M80 108 L94 92 M90 108 L104 92 M100 108 L114 92', C.red, 1),
    waIn('csfall', 0, -50, g('translate(88 76) rotate(30)', rect(-2, -10, 4, 16, C.brown, 1, C.ink, 1), rect(-7, -14, 14, 6, C.silver, 1, C.ink, 1))), line('M84 30 L86 60 M92 32 L92 56', C.grey, 1.4, '3 3'), warn(100, 20, 1)),

  // ── 4125 Arbetsmoment och etapper ──
  'csite.etapp.2': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), ...[0, 1, 2].map((i) => T(20 + i * 40, 22, String(i + 1), 14, i === 1 ? HL : C.grey)),
    greyed(g('translate(4 0)', rect(2, 92, 30, 8, CONC, 1, C.ink, 1.2))), g('translate(44 0)', rect(2, 92, 30, 8, CONC, 1, C.ink, 1.2), rect(4, 66, 26, 26, CONC, 1, C.ink, 1.2), rect(10, 72, 8, 8, '#5d636b', 1, null)), greyed(g('translate(84 0)', rect(2, 92, 30, 8, CONC, 1, C.ink, 1.2), rect(4, 66, 26, 26, '#f2e6cf', 1, C.ink, 1.2), path('M0 66 L17 50 L34 66 Z', '#a3503c', C.ink, 1.2))),
    arrow(36, 80, 46, 80, C.grey, 2), arrow(78, 80, 88, 80, C.grey, 2), frame(42, 30, 38, 76)),
  'csite.tidsplan': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(6, 10, 108, 100, C.white, 3, C.ink, 1.8), line(range(6).map((i) => `M${30 + i * 14} 16 L${30 + i * 14} 104`).join(' '), C.grey2, 1),
    ...[[30, 28, C.brown], [44, 28, CONC], [58, 42, '#a3503c'], [86, 20, C.sky], [92, 18, C.green]].map(([x, w, c], i) => rect(x as number, 20 + i * 17, w as number, 9, c as string, 2, C.ink, 1.2)),
    gravelPile(18, 30, 12, 6, SOIL), rect(12, 40, 12, 9, CONC, 1, C.ink, 1), path('M12 66 L18 59 L24 66 Z', '#a3503c', C.ink, 1), line('M12 78 L24 78 M12 82 L22 82', C.sky, 2), key(12, 97, 0.55), line('M72 14 L72 106', HL, 2.4, '4 3')),
  'csite.byggstart': all(sky(), earth(100, '#b9a27f'), flag(60, 100, C.green, 40), calendar(78, 10, 32), ring(94, 28, 8), greyed(g('translate(14 100)', rect(0, -14, 26, 10, MACHY, 2, C.ink, 1.2), wheel(6, -3, 4), wheel(20, -3, 4))), line('M42 104 L84 104', C.dark, 1.4, '4 3'), arrow(68, 70, 84, 46, HL, 2.6)),
  'csite.markarbete': all(sky(), rect(0, 76, 120, 44, '#b9a27f', 0, null), greyed(line('M30 76 L30 40 L60 22 L90 40 L90 76', C.grey, 1.6, '4 3')), rect(24, 70, 72, 8, GRAVEL, 1, C.ink, 1.4),
    path('M8 84 L14 100 L104 100 L110 84 Z', '#8a6a48', C.ink, 1.2), line('M10 94 L108 94', '#3f7fc8', 4), gravelPile(108, 76, 20, 10, SOIL), gravelPile(12, 76, 18, 8, GRAVEL), ...range(5).map((i) => circle(34 + i * 13, 66, 1.2, C.dark, null)), frame(4, 60, 112, 46)),
  'csite.stomresning': all(sky(), ground(), rect(20, 92, 80, 20, CONC, 1, C.ink, 1.6), rect(20, 50, 8, 42, '#e8d3b0', 1, C.ink, 1.4), rect(28, 50, 30, 42, '#e8d3b0', 1, C.ink, 1.4),
    line('M86 2 L86 30', C.dark, 1.4), moving('csstom', '0%{transform:translate(0,-34px)}70%,100%{transform:translate(0,0)}', { dur: 3.2 }, line('M86 30 L72 50 M86 30 L100 50', C.dark, 1), rect(60, 50, 40, 42, '#e8d3b0', 1, HL, 2.6), rect(72, 60, 12, 14, '#cfe8f6', 1, C.ink, 1)), arrow(110, 26, 110, 50, HL, 2.6)),
  'csite.tätt-hus': all(sky('#d9e3ea'), ground(), house(22, 76, 50), ...range(8).map((i) => line(`M${10 + i * 14} ${8 + (i % 2) * 6} l-3 7`, '#5aa7d6', 1.8)), path('M18 50 C14 52 12 56 12 60 M102 50 C106 52 108 56 108 60', 'none', '#5aa7d6', 1.8),
    rect(30, 70, 14, 14, '#ffe9a8', 1, C.ink, 1.2), worker(37, { s: 0.22, y: 84 }), tick(80, 90, 1.6), ring(60, 66, 44)),
  'csite.taklagsfest': all(sky(), ground(), path('M14 112 L14 58 L60 30 L106 58 L106 112', 'none', '#c9a070', 3), path('M8 60 L60 26 L112 60 L106 64 L60 34 L14 64 Z', '#a3503c', C.ink, 1.6), line('M60 26 L60 6', C.brown, 2.4), circle(60, 10, 6, 'none', C.green, 3), circle(58, 6, 1.4, C.red, null), circle(63, 13, 1.4, C.red, null),
    rect(30, 92, 60, 5, C.tan, 1, C.ink, 1.2), line('M36 97 L36 112 M84 97 L84 112', C.brown, 2), rect(48, 84, 24, 8, C.white, 2, C.ink, 1.2), line('M50 86 L70 86', C.green, 1.6), worker(20, { s: 0.5 }), person(100, C.purple, { s: 0.5 }), worker(110, { s: 0.45 })),
  'csite.installation': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), rect(8, 10, 104, 96, '#e8d3b0', 1, C.ink, 1.6), line('M20 10 L20 106 M44 10 L44 106 M68 10 L68 106 M92 10 L92 106', '#c9a070', 4),
    line('M8 34 L100 34 L100 70', C.yellow, 3), rect(94, 70, 12, 14, C.white, 2, C.ink, 1.2), line('M8 86 L60 86 L60 60 L80 60', '#3f7fc8', 4), circle(80, 60, 3, C.silver, C.ink, 1),
    waIn('csinst', -60, 0, circle(60, 34, 2.4, C.orange, null), circle(80, 34, 2.4, C.orange, null)), waIn('csinsw', -40, 0, drop(40, 86, 0.8), drop(60, 72, 0.8)), ring(100, 74, 12)),
  'csite.ytskikt': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(12, 14, 26, 86, CONC, 0, C.ink, 1.2), rect(38, 14, 10, 86, '#e8d3b0', 0, C.ink, 1.2), rect(48, 14, 4, 86, '#ffffff', 0, C.ink, 1),
    rect(52, 14, 6, 44, '#7fb3d5', 0, C.ink, 1.4), ...range(4).map((i) => rect(52, 58 + i * 10.5, 6, 10, '#bfe0ef', 0, C.ink, 1)), rect(12, 100, 104, 8, WOOD, 0, C.ink, 1.4),
    g('translate(86 40)', rect(-2, -10, 4, 30, C.dark, 1, null), rect(-10, -18, 20, 10, '#7fb3d5', 4, C.ink, 1.2)), line('M64 36 L76 36', C.grey, 1.4, '3 2'), frame(50, 10, 12, 100)),
  'csite.byggtid': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), ground(96), flag(16, 96, C.green, 24), rect(6, 92, 26, 4, '#b9a27f', 0, null), house(84, 28, 20), line('M14 106 L106 106', HL, 2.6), path('M14 102 L8 106 L14 110 Z M106 102 L112 106 L106 110 Z', HL, null),
    calendar(46, 16, 28, '9'), circle(60, 60, 8, C.white, C.ink, 1.4), line('M60 60 L60 55 M60 60 L64 62', C.ink, 1.4)),
  'csite.färdigställa': all(sky(), ground(), house(26, 68, 46), moving('csfard', '0%{transform:translate(0,-24px);opacity:0}50%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, rect(54, 90, 12, 22, '#8c5a44', 1, HL, 2.2)),
    waGrow('csfardt', circle(96, 22, 12, C.green, C.ink, 1.6), tick(96, 22, 1.4, C.white)), sparkle(18, 40), sparkle(108, 60, 4)),

  // ── 4126 Materialleveranser ──
  'csite.kranbil': all(sky(), ground(), truck(60, 1, C.red, all(rect(-44, -20, 52, 6, '#dfe3e7', 1, C.ink, 1.2), pallet(-28, -23, 24), box(-28, -23, 18, 10))), g('translate(84 76)', rect(-4, -4, 8, 22, MACHY, 1, C.ink, 1.2)),
    line('M84 72 L60 40 L18 50', MACHY, 5), line('M84 72 L60 40 L18 50', C.ink, 0.6), line('M18 50 L18 70', C.dark, 1.2), line('M10 78 L18 70 L26 78', C.dark, 1), pallet(18, 88, 22), planks(18, 88, 20, 2), ring(60, 40, 8)),
  'csite.lyftband': all(sky(), line('M60 0 L60 18', C.dark, 1.6), path('M57 18 C57 26 64 26 64 21', 'none', C.dark, 2.4), line('M60 22 L30 66 M60 22 L90 66', C.purple, 4.4), planks(60, 84, 84, 4),
    rect(26, 66, 8, 18, C.purple, 1, C.ink, 1), rect(86, 66, 8, 18, C.purple, 1, C.ink, 1), ring(30, 74, 10), ring(90, 74, 10), ground()),
  'csite.följesedel': all(sky('#eef1f4'), ground(), pallet(32, 100, 44), box(22, 100, 18, 16), box(42, 100, 18, 16), box(32, 84, 18, 14), paper(62, 14, 50, 70),
    ...range(4).map((i) => all(box(72, 30 + i * 14, 10, 8), T(88, 30 + i * 14, String([3, 2, 1, 4][i]), 9, C.ink), i === 2 ? cross(102, 26 + i * 14, 3.4) : tick(102, 26 + i * 14, 0.6))), line('M66 78 L84 76', C.navy, 1.4), line('M44 82 L60 60', C.grey, 1.4, '3 2'), frame(58, 10, 58, 78)),
  'csite.upplag': all(sky(), earth(100, '#c9b79a'), rect(8, 70, 104, 36, 'none', 2, HL, 2.6), pallet(28, 96, 30), planks(28, 96, 30, 4), ...range(3).map((i) => circle(62 + i * 7, 92 - (i === 1 ? 0 : 0), 3.4, '#8d949b', C.ink, 1)), circle(65, 86, 3.4, '#8d949b', C.ink, 1), circle(72, 86, 3.4, '#8d949b', C.ink, 1),
    pallet(96, 96, 22), box(96, 96, 18, 16), box(96, 80, 18, 14), greyed(towerCrane(104, 14, 40, 40))),
  'csite.presenning': all(sky('#d9e3ea'), earth(104), ...range(9).map((i) => line(`M${8 + i * 13} ${6 + (i % 3) * 5} l-3 8`, '#5aa7d6', 1.8)),
    path('M14 104 L18 58 C40 50 80 50 102 58 L106 104 Z', TARP, C.ink, 1.8), line('M30 104 L36 56 M60 104 L60 52 M90 104 L84 56', C.ink, 1.2), path('M18 58 C40 50 80 50 102 58', 'none', '#7fb0e0', 2), drop(10, 96, 1), drop(110, 96, 1), ring(60, 76, 40)),
  'csite.byggavfall': all(sky(), ground(), path('M8 112 L16 70 L104 70 L112 112 Z', '#3f7f5a', C.ink, 1.8), g('translate(0 0)', rect(20, 58, 30, 6, WOOD, 0.5, C.ink, 1, ), path('M44 52 L66 62 L62 66 L40 56 Z', WOOD, C.ink, 1), rect(60, 56, 12, 7, BRICK, 0.5, C.ink, 1), rect(72, 60, 10, 6, BRICK, 0.5, C.ink, 1),
    path('M82 52 C90 48 96 56 92 62 L80 64 Z', '#f0f0f0', C.ink, 1), line('M30 50 L44 44', '#8d949b', 3), path('M50 60 L56 48 L60 60 Z', '#bcd8e6', C.ink, 1)), ring(60, 60, 34)),

  // ── 4127 Slutbesiktning ──
  'csite.slutbesiktning': all(sky(), ground(), house(10, 60, 46), path('M10 76 L70 76', 'none', C.red, 3), path('M38 72 L32 82 M42 72 L48 82', 'none', C.red, 2.4), circle(40, 74, 3, C.red, C.ink, 1),
    boss(94, C.navy, { s: 0.7, l: [-14, 14], r: [12, 18] }), clipboard(70, 30, 26, 34), tick(78, 42, 0.7), tick(78, 50, 0.7), tick(78, 58, 0.7), line('M84 42 L92 42 M84 50 L92 50 M84 58 L92 58', C.grey, 1.4), ring(83, 47, 22)),
  'csite.besiktningsman': all(room('#efe8dc'), rect(8, 10, 46, 90, '#f6efe1', 0, C.ink, 1.2), crack(34, 40, 1), boss(76, C.navy, { l: [-26, 2], r: [-10, 18] }), magnifier(42, 50, 8), clipboard(58, 64, 16, 20), ring(76, 64, 32)),
  'csite.besiktningsprotokoll': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), paper(18, 6, 84, 108), g('translate(36 22) scale(0.4)', house(-20, 40, 30)), rows(54, 18, 40, 2, 6),
    ...range(5).map((i) => all(line(`M28 ${44 + i * 12} L76 ${44 + i * 12}`, C.grey, 1.4), [1, 3].includes(i) ? cross(88, 42 + i * 12, 3.6) : tick(88, 42 + i * 12, 0.7))), line('M28 104 L60 100', C.navy, 1.6), frame(14, 2, 92, 116)),
  'csite.egenkontroll': all(room('#eef3f6'), ...range(4).flatMap((r) => range(3).map((c) => rect(6 + c * 14, 86 - (r + 1) * 14, 13, 13, '#bfe0ef', 1, '#8fb3c4', 1))), worker(72, { l: [-12, 20], r: [16, 14] }), clipboard(84, 56, 20, 26),
    waPulse('csegen', tick(94, 66, 0.8), tick(94, 74, 0.8)), path('M58 30 C46 14 24 16 22 30', 'none', HL, 2.4), arrow(24, 26, 22, 32, HL, 2.4), path('M30 38 C42 50 56 46 62 40', 'none', HL, 2.4), arrow(58, 42, 64, 38, HL, 2.4)),
  'csite.kontrollansvarig': all(sky(), ground(), g('translate(20 0)', rect(-16, 62, 32, 50, '#e8e4dc', 1, C.ink, 1.6), path('M-20 62 L0 48 L20 62 Z', C.grey, C.ink, 1.6), line('M-10 70 L-10 108 M0 70 L0 108 M10 70 L10 108', C.grey, 2)), shell(84, 32, 40),
    boss(60, C.navy, { s: 0.85, l: [-14, 16], r: [14, 18] }), rect(54, 50, 12, 9, C.white, 1, C.ink, 1.2), circle(60, 54, 2.2, C.gold, null), arrow(46, 98, 36, 98, HL, 2.2), arrow(74, 98, 84, 98, HL, 2.2), ring(60, 62, 26)),
  'csite.garantibesiktning': all(sky(), ground(), house(8, 64, 48, '#f2e6cf', true), crack(54, 70, 1.1), magnifier(58, 78, 9), calendar(84, 12, 30, '2'), arrow(94, 50, 76, 70, C.grey, 2), ring(58, 78, 14), boss(102, C.navy, { s: 0.48, l: [-14, 10] })),
  'csite.skötselanvisning': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), path('M60 18 L60 106 L8 100 L8 12 Z', C.white, C.ink, 1.8), path('M60 18 L60 106 L112 100 L112 12 Z', C.white, C.ink, 1.8),
    rect(16, 28, 34, 26, '#dfe3e7', 2, C.ink, 1.4), ...range(4).map((i) => line(`M20 ${34 + i * 5} L46 ${34 + i * 5}`, C.grey, 1.2)), rect(28, 62, 14, 18, '#f3e6a8', 1, C.ink, 1.2), line('M30 66 L40 66 M30 70 L40 70 M30 74 L40 74', '#c9b25a', 1), arrow(35, 60, 35, 50, HL, 2.2),
    calendar(70, 26, 26), rows(70, 66, 32, 3, 8), g('translate(88 92) rotate(-30)', rect(-2, -12, 4, 18, C.silver, 1, C.ink, 1), circle(0, -14, 4, 'none', C.silver, 3)), ring(35, 56, 24)),
};
