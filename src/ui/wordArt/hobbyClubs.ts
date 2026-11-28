/**
 * Kultur & fritid → Spel & hobbyer → Föreningar & evenemang, 4761–4767 (0.65): hobby clubs, courses, workshops,
 * fairs and festivals, book circles, volunteer organisers and planning a hobby event.
 * No letters that give away the word (digits, "?", "!" and simple signs are fine), no brands, no recognisable titles.
 * Movement: `moving()`/`waIn()` move things with transform/opacity only; the base state is the poster frame.
 * The named part is orange (HL); grey is the reference.
 * Easily confused pairs get different kinds of picture: a club round a table under its pennant (hobbyklubb) against
 * an evening door under the moon (klubbkväll) and an empty room seen from inside (klubblokal); a beaming collector
 * among his trains (entusiast) against a painter whose coin is crossed out (amatör) and someone stepping in at the
 * door (nykomling); a tangled first try with a helping hand (nybörjarkurs) against a finished scarf and the next,
 * harder piece (fortsättningskurs); a laptop click that adds a row (anmäla sig) against a paper form dropped in a box
 * (anmälan); one big calendar page with a start flag (kursstart) against a strip of eight evenings (kurstillfälle).
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, star, waIn, waPulse, type Svg } from './kit';
import { HL } from './people';

type Pt = [number, number];
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const turn = (x: number, y: number, deg: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg})`, ...k);
const faded = (...k: Svg[]): Svg => `<g opacity="0.45" style="filter:grayscale(1)">${k.join('')}</g>`;
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, line('M-6 -6 L6 6 M6 -6 L-6 6', col, 3.2));
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Hidden at first, appears at `delay` % of the loop and stays (poster frame: visible). */
const appear = (name: string, delay: number, ...k: Svg[]) => moving(name, `0%,${delay}%{opacity:0}${delay + 12}%,100%{opacity:1}`, { dur: 3.2 }, ...k);
/** Slides in from (dx, dy) and rests (poster frame: at rest). */
const slide = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) => moving(name, `0%,12%{transform:translate(${dx}px,${dy}px)}60%,100%{transform:translate(0,0)}`, { dur }, ...k);

// ── People (head and shoulders; (x, y) = centre of the head, the bust ends at y + 30·s) ──
type Face = 'smile' | 'flat' | 'sad' | 'open' | 'grin' | 'o' | 'think';
type Look = { top?: string; hair?: string; hs?: 'short' | 'long' | 'bun' | 'bald'; face?: Face; grey?: boolean; skin?: string; look?: number; beard?: boolean };
function bust(x: number, y: number, s: number, o: Look = {}): Svg {
  const skin = o.grey ? C.grey2 : (o.skin ?? C.skin), top = o.grey ? C.grey : (o.top ?? C.sky), hair = o.grey ? '#8b9199' : (o.hair ?? C.hair), lk = o.look ?? 0, f = o.face ?? 'smile';
  const mouth = f === 'smile' ? line('M-3.5 4 Q0 7 3.5 4', C.ink, 1.4) : f === 'flat' ? line('M-3 5 L3 5', C.ink, 1.4) : f === 'sad' ? line('M-3.5 6 Q0 3 3.5 6', C.ink, 1.4) : f === 'open' ? ellipse(0, 5, 2.8, 3.2, C.ink, null)
    : f === 'grin' ? path('M-4.5 3 Q0 9.5 4.5 3 Z', C.white, C.ink, 1.2) : f === 'o' ? circle(0, 5, 1.8, C.ink, null) : line('M-2.4 5.2 L3 4.4', C.ink, 1.4);
  const brows = f === 'think' ? line('M-6 -4.6 L-2.5 -4.6 M2.5 -5.6 L6 -4.6', C.ink, 1.2) : f === 'sad' ? line('M-6 -3.4 L-2.5 -5 M6 -3.4 L2.5 -5', C.ink, 1.2) : '';
  return at(x, y, s,
    o.hs === 'long' ? path('M-10 -4 C-13 14 -8 16 0 15 C8 16 13 14 10 -4 Z', hair, C.ink, 1.2) : '',
    path('M-15 30 C-15 16 -9 12 0 12 C9 12 15 16 15 30 Z', top, C.ink, 1.8),
    rect(-3, 7, 6, 7, skin, 2, null), circle(0, 0, 10, skin, C.ink, 1.6),
    o.hs === 'bun' ? circle(0, -11.5, 4, hair, C.ink, 1.2) : '',
    o.hs === 'bald' ? path('M-10 -1 C-11 -5 -9 -6 -8 -4 M10 -1 C11 -5 9 -6 8 -4', hair, C.ink, 1.2) : path('M-10 -1 C-11 -14 11 -14 10 -1 C6 -7 -6 -7 -10 -1 Z', hair, C.ink, 1.2),
    o.beard ? path('M-8 3 C-7 12 7 12 8 3 C5 8 -5 8 -8 3 Z', hair, C.ink, 1) : '',
    circle(-3.6 + lk, -0.5, 1.3, C.ink, null), circle(3.6 + lk, -0.5, 1.3, C.ink, null), brows, o.beard ? '' : mouth);
}
/** Sleeve with a round hand at the end; `mid` bends the arm at the elbow. */
const arm = (a: Pt, b: Pt, col: string = C.sky, mid?: Pt, skin: string = C.skin): Svg => {
  const d = `M${a[0]} ${a[1]} ${mid ? `L${mid[0]} ${mid[1]} ` : ''}L${b[0]} ${b[1]}`;
  return all(line(d, C.ink, 7.6), line(d, col, 5.2), circle(b[0], b[1], 3.8, skin, C.ink, 1.3));
};
const bubble = (x: number, y: number, w: number, h: number, tail: Pt, ...k: Svg[]) => all(path(`M${x + w * 0.3} ${y + h} L${tail[0]} ${tail[1]} L${x + w * 0.55} ${y + h} Z`, C.white, C.ink, 1.6), rect(x, y, w, h, C.white, 8, C.ink, 1.8), rect(x + w * 0.3 + 1, y + h - 2.4, w * 0.25 - 2, 3.4, C.white, 0, null), ...k);
/** A small seated person seen from above-front (head + shoulders), for crowds. */
const head = (x: number, y: number, col: string, hair: string = C.hair, s = 1): Svg => at(x, y, s, path('M-8 12 C-8 5 -4 3 0 3 C4 3 8 5 8 12 Z', col, C.ink, 1.3), circle(0, -2, 5.4, C.skin, C.ink, 1.2), path('M-5.4 -3 C-5.6 -9 5.6 -9 5.4 -3 C3 -6 -3 -6 -5.4 -3 Z', hair, C.ink, 1));

// ── Things ──
const book = (x: number, y: number, w: number, h: number, col: string, deg = 0): Svg => turn(x, y, deg, rect(-w / 2, -h / 2, w, h, col, 2, C.ink, 1.6), line(`M${-w / 2 + 3} ${-h / 2} L${-w / 2 + 3} ${h / 2}`, C.ink, 1), line(`M${-w / 4} ${-h / 5} L${w / 3} ${-h / 5}`, C.white, 1.4));
const openBook = (x: number, y: number, s = 1, col: string = C.white): Svg => at(x, y, s, path('M-24 -12 C-14 -16 -6 -15 0 -11 L0 13 C-6 9 -14 8 -24 12 Z', col, C.ink, 1.6), path('M24 -12 C14 -16 6 -15 0 -11 L0 13 C6 9 14 8 24 12 Z', col, C.ink, 1.6), line('M-19 -7 L-5 -7 M-19 -2 L-5 -2 M-19 3 L-8 3 M5 -7 L19 -7 M5 -2 L19 -2 M5 3 L16 3', C.grey, 1.2));
const table = (x: number, y: number, w: number): Svg => all(rect(x - w / 2, y, w, 6, C.tan, 2, C.ink, 1.8), line(`M${x - w / 2 + 6} ${y + 6} L${x - w / 2 + 6} 112 M${x + w / 2 - 6} ${y + 6} L${x + w / 2 - 6} 112`, C.brown, 3));
const chair = (x: number, y: number, col: string = C.brown): Svg => all(rect(x - 7, y, 14, 4, col, 1, C.ink, 1.4), line(`M${x - 6} ${y + 4} L${x - 6} ${y + 16} M${x + 6} ${y + 4} L${x + 6} ${y + 16} M${x + 6} ${y} L${x + 6} ${y - 14}`, C.ink, 2), rect(x + 3, y - 16, 6, 12, col, 1, C.ink, 1.2));
const coin = (x: number, y: number, r = 6): Svg => all(circle(x, y, r, C.gold, C.ink, 1.4), circle(x, y, r * 0.6, 'none', '#b88a1e', 1));
const note = (x: number, y: number, deg = 0): Svg => turn(x, y, deg, rect(-12, -7, 24, 14, '#9fd3a8', 2, C.ink, 1.4), circle(0, 0, 3.6, 'none', C.green, 1.2));
const yarn = (x: number, y: number, r: number, col: string = C.red): Svg => all(circle(x, y, r, col, C.ink, 1.6), line(`M${x - r * 0.8} ${y - r * 0.3} C${x - r * 0.2} ${y - r * 0.9} ${x + r * 0.4} ${y - r * 0.6} ${x + r * 0.8} ${y + r * 0.1} M${x - r * 0.7} ${y + r * 0.4} C${x - r * 0.1} ${y - r * 0.1} ${x + r * 0.4} ${y + r * 0.2} ${x + r * 0.5} ${y + r * 0.7}`, C.ink, 1));
const needles = (x: number, y: number, deg = 0): Svg => turn(x, y, deg, line('M-14 4 L12 -8 M-12 9 L14 -3', C.grey, 2.2), circle(-14, 4, 2.2, C.dark, null), circle(-12, 9, 2.2, C.dark, null), rect(-2, -2, 10, 9, C.red, 1, C.ink, 1), line('M0 2 L6 2 M0 5 L6 5', '#a33', 0.8));
const pen = (x: number, y: number, deg: number): Svg => turn(x, y, deg, rect(-2.4, -18, 4.8, 18, C.navy, 1, C.ink, 1.2), path('M-2.4 0 L2.4 0 L0 5 Z', C.beige, C.ink, 1));
const laptop = (x: number, y: number, s: number, screen: Svg = ''): Svg => at(x, y, s, rect(-24, -32, 48, 32, C.dark, 3, C.ink, 1.8), rect(-21, -29, 42, 26, '#dff0fa', 1, null), screen, path('M-30 0 L30 0 L26 5 L-26 5 Z', C.grey, C.ink, 1.6));
const form = (x: number, y: number, w: number, h: number, filled = true): Svg => all(rect(x, y, w, h, C.white, 2, C.ink, 1.6),
  ...[0, 1, 2].map((i) => all(rect(x + 4, y + 5 + i * (h - 8) / 3, 5, 5, C.white, 1, C.ink, 1), filled ? line(`M${x + 5} ${y + 7.5 + i * (h - 8) / 3} L${x + 6.5} ${y + 9 + i * (h - 8) / 3} L${x + 9} ${y + 6 + i * (h - 8) / 3}`, C.green, 1.4) : '', line(`M${x + 12} ${y + 7.5 + i * (h - 8) / 3} L${x + w - 4} ${y + 7.5 + i * (h - 8) / 3}`, filled ? C.navy : C.grey2, 1.4))));
/** A wall calendar page: `cells` cols × rows, highlighted index → colour. */
function calendar(x: number, y: number, w: number, h: number, cols: number, rows: number, marks: Record<number, string> = {}, top: string = C.red): Svg {
  const cw = w / cols, ch = (h - 10) / rows, out: Svg[] = [rect(x, y, w, h, C.white, 3, C.ink, 1.8), rect(x, y, w, 10, top, 3, C.ink, 1.8), circle(x + w * 0.25, y, 2, C.ink, null), circle(x + w * 0.75, y, 2, C.ink, null)];
  for (let i = 0; i < cols * rows; i++) {
    const cx = x + (i % cols) * cw, cy = y + 10 + Math.floor(i / cols) * ch;
    out.push(rect(cx + 1.2, cy + 1.2, cw - 2.4, ch - 2.4, marks[i] ?? '#eef0f2', 1, null));
  }
  return all(...out);
}
const clock = (x: number, y: number, r: number, hDeg: number, mDeg = 0, face: string = C.white): Svg => all(circle(x, y, r, face, C.ink, 1.8),
  line(`M${x} ${y} L${(x + Math.sin((hDeg * Math.PI) / 180) * r * 0.5).toFixed(1)} ${(y - Math.cos((hDeg * Math.PI) / 180) * r * 0.5).toFixed(1)} M${x} ${y} L${(x + Math.sin((mDeg * Math.PI) / 180) * r * 0.8).toFixed(1)} ${(y - Math.cos((mDeg * Math.PI) / 180) * r * 0.8).toFixed(1)}`, C.ink, 2), circle(x, y, 1.6, C.ink, null));
const moon = (x: number, y: number, r = 8) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.5} A${r * 0.8} ${r * 0.8} 0 1 1 ${x} ${y - r} Z`, C.yellow, C.ink, 1.2);
const sunDisk = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${(x + Math.cos(a) * (r + 2)).toFixed(1)} ${(y + Math.sin(a) * (r + 2)).toFixed(1)} L${(x + Math.cos(a) * (r + 5)).toFixed(1)} ${(y + Math.sin(a) * (r + 5)).toFixed(1)}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.4));
/** A small toy locomotive (side view), wheels on y = 0. */
const loco = (x: number, y: number, s: number, col: string = C.green): Svg => at(x, y, s, rect(-16, -14, 22, 10, col, 2, C.ink, 1.4), rect(2, -22, 12, 18, col, 2, C.ink, 1.4), rect(4, -20, 8, 6, '#dff0fa', 1, C.ink, 1), rect(-12, -22, 5, 8, C.dark, 1, C.ink, 1), path('M-18 -4 L16 -4 L16 -2 L-18 -2 Z', C.dark, null), circle(-10, 0, 3.4, C.dark, C.ink, 1), circle(-1, 0, 3.4, C.dark, C.ink, 1), circle(9, 0, 3.4, C.dark, C.ink, 1));
const camera = (x: number, y: number, s: number): Svg => at(x, y, s, rect(-12, -8, 24, 16, C.dark, 3, C.ink, 1.4), rect(-6, -11, 8, 4, C.dark, 1, C.ink, 1.2), circle(1, 0, 5.4, C.grey2, C.ink, 1.4), circle(1, 0, 2.6, C.navy, null));
/** Pennant on the wall with a picture sign on it (no letters). */
const pennant = (x: number, y: number, col: string, sign: Svg) => all(line(`M${x} ${y} L${x} ${y + 26}`, C.brown, 2), path(`M${x} ${y} L${x + 30} ${y + 8} L${x} ${y + 16} Z`, col, C.ink, 1.6), sign);
const doorFrame = (x: number, y: number, w: number, h: number, fill: string = C.brown) => all(rect(x, y, w, h, fill, 2, C.ink, 2), circle(x + w - 5, y + h / 2, 1.6, C.gold, null));
const ticket = (x: number, y: number, w: number, h: number, col: string, deg = 0, ...k: Svg[]): Svg => turn(x, y, deg, path(`M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2} ${-h / 6} A${h / 6} ${h / 6} 0 0 0 ${w / 2} ${h / 6} L${w / 2} ${h / 2} L${-w / 2} ${h / 2} L${-w / 2} ${h / 6} A${h / 6} ${h / 6} 0 0 0 ${-w / 2} ${-h / 6} Z`, col, C.ink, 1.6), line(`M${w / 4} ${-h / 2 + 2} L${w / 4} ${h / 2 - 2}`, C.ink, 1, '2 2'), ...k);
const poster = (x: number, y: number, w: number, h: number, col: string, ...k: Svg[]) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h * 0.45, col, 2, null), ...k);
const pin = (x: number, y: number, col: string = C.red) => all(circle(x, y, 2.4, col, C.ink, 1));
const box = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.tan, 2, C.ink, 1.8), line(`M${x} ${y + 6} L${x + w} ${y + 6}`, C.brown, 1.2));
const dice = (x: number, y: number, s: number) => at(x, y, 1, rect(-s / 2, -s / 2, s, s, C.white, s * 0.2, C.ink, 1.4), circle(-s * 0.25, -s * 0.25, s * 0.1, C.ink, null), circle(0, 0, s * 0.1, C.ink, null), circle(s * 0.25, s * 0.25, s * 0.1, C.ink, null));
const lectern = (x: number) => all(path(`M${x - 10} 112 L${x - 7} 78 L${x + 7} 78 L${x + 10} 112 Z`, C.brown, C.ink, 1.8), path(`M${x - 13} 78 L${x + 13} 78 L${x + 10} 72 L${x - 10} 72 Z`, C.tan, C.ink, 1.6));

// ── 4761 Hobbyklubbar ──
const M1: Record<string, Svg> = {
  // hobbyklubb: four people with the same hobby (cameras) round a table under the club's pennant
  'hclub.hobbyklubb': all(rect(4, 6, 112, 70, '#f1ebdf', 4, null), pennant(12, 10, HL, camera(22, 18, 0.45)), pennant(94, 10, HL, camera(104, 18, 0.45)),
    bust(30, 44, 0.85, { top: C.green, hs: 'long', face: 'grin' }), bust(60, 38, 0.85, { top: C.red, beard: true, hair: '#9a9a9a' }), bust(90, 44, 0.85, { top: C.purple, hs: 'bun' }),
    table(60, 76, 100), camera(30, 72, 0.8), camera(60, 72, 0.8), camera(90, 72, 0.8), ground),
  // klubbkväll: evening – moon and clock at seven, the club door is lit and members go in
  'hclub.klubbkväll': all(rect(0, 0, 120, 112, '#2f3a5c', 0, null), moon(18, 18, 9), star(40, 12, 2.4, C.white), star(104, 30, 2.2, C.white), star(70, 8, 2, C.white),
    rect(56, 26, 58, 86, '#c9b48f', 2, C.ink, 2), rect(70, 52, 30, 60, C.yellow, 2, C.ink, 2), pennant(66, 30, HL, loco(80, 42, 0.35, C.white)), clock(98, 38, 8, 210, 0),
    bust(84, 84, 0.8, { top: C.green, hs: 'long' }), bust(36, 86, 0.85, { top: C.red, beard: true, hair: '#9a9a9a', look: 2 }), line('M4 112 L116 112', '#8a93a8', 2)),
  // klubblokal: the club's own room, empty – shelves with models, a long table, chairs, the pennant on the wall
  'hclub.klubblokal': all(rect(4, 6, 112, 106, '#efe6d3', 3, C.ink, 2), rect(8, 10, 22, 10, '#bfe3f5', 1, C.ink, 1.4), line('M4 84 L116 84', C.grey2, 1.4),
    rect(80, 20, 32, 52, C.tan, 2, C.ink, 1.8), line('M80 37 L112 37 M80 54 L112 54', C.brown, 2), loco(96, 36, 0.5, C.green), loco(96, 53, 0.5, C.red), camera(96, 68, 0.5),
    pennant(40, 14, HL, loco(48, 25, 0.25, C.white)), table(44, 74, 60), chair(18, 84), chair(70, 84), rect(28, 68, 30, 6, '#7ab07a', 1, C.ink, 1.2), ground),
  // hålla till: the club is always in the basement – a house in cross-section, the pin pulses on the lit basement room
  'hclub.hålla-till': all(path('M14 50 L60 18 L106 50 Z', C.red, C.ink, 2), rect(20, 50, 80, 40, '#f3e7cf', 2, C.ink, 2), rect(30, 58, 16, 14, '#bfe3f5', 1, C.ink, 1.4), rect(74, 58, 16, 14, '#bfe3f5', 1, C.ink, 1.4), rect(52, 66, 16, 24, C.brown, 1, C.ink, 1.6),
    rect(0, 90, 120, 30, '#a3896b', 0, null), rect(20, 92, 80, 20, '#ffe9a8', 2, C.ink, 2), head(40, 102, C.green, C.hair, 0.8), head(56, 102, C.red, '#9a9a9a', 0.8), head(72, 102, C.purple, C.hair, 0.8), rect(84, 100, 12, 6, C.tan, 1, C.ink, 1), line('M0 90 L120 90', C.ink, 2),
    moving('hc-halla', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-6px)}', { dur: 1.6 }, path('M104 82 C104 72 116 72 116 82 C116 88 110 92 110 98 C110 92 104 88 104 82 Z', HL, C.ink, 1.6), circle(110, 81, 2.4, C.white, null))),
  // entusiast: a man beaming among all his trains, holding one up, hearts round him
  'hclub.entusiast': all(bust(60, 44, 1.2, { top: C.denim, face: 'grin', hs: 'short' }), arm([46, 72], [30, 40], C.denim, [34, 62]), arm([74, 72], [92, 40], C.denim, [88, 62]), loco(30, 34, 0.6, HL), loco(92, 34, 0.6, C.green),
    path('M54 16 C49 10 43 16 54 24 C65 16 59 10 54 16 Z', C.red, C.ink, 1), path('M72 12 C68 8 63 12 72 19 C81 12 76 8 72 12 Z', C.red, C.ink, 1), path('M20 14 C16 10 11 14 20 21 C29 14 24 10 20 14 Z', C.red, C.ink, 1),
    rect(4, 90, 112, 6, C.tan, 1, C.ink, 1.4), loco(18, 90, 0.5, C.red), loco(42, 90, 0.5, C.sky), loco(66, 90, 0.5, C.yellow), loco(90, 90, 0.5, C.purple), loco(108, 108, 0.4, C.green), loco(16, 108, 0.4, C.orange), ground),
  // amatör: she paints at home for the joy of it – the coin is crossed out (no pay), the heart is there
  'hclub.amatör': all(rect(66, 20, 40, 34, C.white, 2, C.ink, 2), path('M70 46 L80 32 L88 42 L94 34 L102 46 Z', C.green, null), sunDisk(96, 28, 3), line('M70 54 L64 108 M102 54 L108 108 M86 54 L86 100', C.brown, 2.6),
    bust(34, 50, 1.05, { top: HL, hs: 'long', face: 'smile', look: 2 }), arm([46, 76], [70, 44], HL, [58, 70]), turn(72, 42, 40, rect(-1.4, -14, 2.8, 16, C.brown, 1, null), circle(0, -14, 2.4, C.red, null)),
    path('M20 16 C15 10 9 16 20 24 C31 16 25 10 20 16 Z', C.red, C.ink, 1), coin(44, 98, 9), cross(44, 98, 1.5), ground),
  // nykomling: someone new steps in at the door; the group at the table turns and waves
  'hclub.nykomling': all(rect(4, 6, 112, 106, '#efe6d3', 3, null), doorFrame(8, 34, 30, 78, '#f8f4ea'), rect(10, 36, 26, 74, '#bfe3f5', 1, null),
    moving('hc-ny', '0%,15%{transform:translate(-22px,0);opacity:.3}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, bust(24, 62, 0.95, { top: HL, hs: 'long', face: 'o' }), star(38, 46, 4, C.yellow)),
    table(84, 86, 56), bust(70, 62, 0.8, { top: C.green, face: 'grin', look: -2.4 }), bust(98, 62, 0.8, { top: C.purple, hs: 'bun', look: -2.4 }), arm([62, 80], [52, 56], C.green, [52, 72]), line('M46 50 L42 46 M50 47 L50 42', HL, 2), ground),
  // fördjupa sig: the reader goes deeper and deeper – a magnifier sinks through the layers of a thick book
  'hclub.fördjupa-sig': all(bust(26, 36, 0.95, { top: C.navy, face: 'think', look: 2.4 }), arm([36, 60], [58, 52], C.navy, [44, 64]),
    ...[0, 1, 2, 3, 4].map((i) => rect(52, 30 + i * 15, 60, 13, ['#fde9d8', '#f9d4b8', '#f3b98f', '#ec9b66', HL][i]!, 2, C.ink, 1.4)), line('M60 36 L104 36 M60 51 L98 51 M60 66 L102 66 M60 81 L96 81', C.white, 1.6),
    moving('hc-djup', '0%,10%{transform:translate(0,-60px)}70%,100%{transform:translate(0,0)}', { dur: 3.4 }, circle(82, 96, 9, 'rgba(255,255,255,0.5)', C.ink, 2.4), line('M88 103 L96 110', C.ink, 3.4)), line('M116 30 L116 100', C.grey, 1.6), path('M112 96 L116 104 L120 96 Z', C.grey, null)),
};

// ── 4762 Kursverksamhet ──
const M2: Record<string, Svg> = {
  // kurs: a teacher shows the group – everyone with yarn and needles at the course table, a row of evenings on the wall
  'hclub.kurs': all(rect(6, 8, 52, 30, '#3e5b4a', 3, C.ink, 2), yarn(20, 22, 7, C.white), needles(42, 22, 0, ), bust(90, 40, 1.05, { top: C.purple, hs: 'bun', face: 'open' }), arm([80, 66], [60, 34], C.purple, [70, 60]),
    table(60, 88, 100), bust(24, 70, 0.75, { top: C.green, look: 2 }), bust(48, 72, 0.75, { top: C.red, hs: 'long', look: 2 }), yarn(24, 86, 4, C.sky), yarn(48, 86, 4, C.yellow), ...[0, 1, 2, 3].map((i) => rect(66 + i * 12, 10, 9, 9, i === 0 ? HL : C.grey2, 1, C.ink, 1)), ground),
  // kursverksamhet: one house, many courses – every window shows another subject
  'hclub.kursverksamhet': all(path('M10 34 L60 8 L110 34 Z', C.navy, C.ink, 2), rect(14, 34, 92, 78, '#f3e7cf', 2, C.ink, 2),
    ...[[30, 50], [60, 50], [90, 50], [30, 80], [90, 80]].map(([x, y]) => rect(x! - 12, y! - 11, 24, 22, HL, 2, C.ink, 1.6)),
    turn(30, 50, -30, rect(-1.4, -8, 2.8, 14, C.brown, 1, null), circle(0, -9, 2.6, C.white, null)), yarn(60, 50, 6, C.white), at(90, 54, 0.5, path('M-6 -16 L-6 4 M-6 -16 L8 -20 L8 0', 'none', C.white, 3), circle(-10, 4, 4.4, C.white, null), circle(4, 0, 4.4, C.white, null)),
    at(30, 80, 1, path('M-7 -6 L7 -6 L6 6 L-6 6 Z', C.white, null), line('M-5 -9 C-3 -12 -1 -6 1 -9', C.white, 1.4)), at(90, 80, 1, rect(-8, -6, 16, 10, C.white, 2, null), path('M-3 4 L-6 8 L1 4 Z', C.white, null)), rect(50, 84, 20, 28, C.brown, 1, C.ink, 1.6), ground),
  // nybörjarkurs: the first try – tangled yarn, a puzzled learner, the teacher's hand guides the needles, step 1
  'hclub.nybörjarkurs': all(bust(36, 40, 1.05, { top: C.green, face: 'think', look: 2.4 }), circle(18, 14, 7.4, C.white, C.ink, 1.4), num(18, 18.5, '?', 11, C.navy),
    arm([24, 66], [52, 80], C.green, [30, 82]), arm([110, 44], [66, 74], C.purple, [92, 46]), needles(60, 78, 10), path('M46 92 C30 84 58 76 52 92 C48 102 68 98 60 88 C54 80 76 84 70 96 C66 104 50 104 46 92 Z', 'none', C.red, 2.2), yarn(84, 100, 8, C.red),
    rect(88, 8, 26, 22, HL, 3, C.ink, 1.6), num(101, 25, '1', 18, C.white), ground),
  // fortsättningskurs: course 1 done (the finished scarf, ticked) – on to course 2 with a harder pattern
  'hclub.fortsättningskurs': all(rect(6, 14, 46, 60, '#eef0f2', 4, C.grey, 1.6), num(29, 32, '1', 16, C.grey), path('M16 42 L42 42 L42 68 L36 68 L36 48 L16 48 Z', C.red, C.ink, 1.4), line('M18 45 L40 45 M38 50 L38 66', '#a33', 1), check(46, 18, 0.9),
    line('M54 44 L66 44', C.ink, 2.6), path('M64 38 L72 44 L64 50 Z', C.ink, null),
    rect(72, 8, 44, 70, '#fde9d8', 4, HL, 2.6), num(94, 28, '2', 18, HL), path('M80 36 L108 36 L112 46 L104 48 L104 70 L84 70 L84 48 L76 46 Z', C.sky, C.ink, 1.6), line('M86 52 L102 52 M86 58 L102 58 M86 64 L102 64', C.white, 1.6, '3 2'),
    bust(40, 92, 0.6, { top: C.green, face: 'grin' }), ground),
  // anmäla sig: she clicks on the laptop and her row appears in the list of participants
  'hclub.anmäla-sig': all(bust(26, 50, 1, { top: HL, hs: 'long', face: 'smile', look: 2.4 }), arm([36, 76], [62, 92], HL, [44, 92]),
    laptop(80, 96, 1.1, all(...[0, 1].map((i) => all(circle(-14, -28 + i * 8, 2.4, C.green, null), line(`M-9 ${-28 + i * 8} L14 ${-28 + i * 8}`, C.navy, 2))),
      appear('hc-anm', 20, circle(-14, -12, 2.4, HL, null), line('M-9 -12 L14 -12', HL, 2.4)))),
    moving('hc-anm2', '0%,10%{transform:translate(10px,8px)}20%,100%{transform:translate(0,0)}', { dur: 3.2 }, path('M86 84 L86 96 L89 93 L92 99 L94 98 L91 92 L95 92 Z', C.white, C.ink, 1.2)), ground),
  // anmälan: the filled-in form is dropped into the course box
  'hclub.anmälan': all(rect(54, 62, 56, 50, HL, 3, C.ink, 2), rect(62, 66, 40, 6, C.ink, 2, null), yarn(70, 92, 7, C.white), needles(92, 92, 0),
    moving('hc-anmalan', '0%,10%{transform:translate(-40px,-30px) rotate(-12deg);opacity:1}55%{transform:translate(0,0);opacity:1}80%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, form(66, 18, 32, 44, true)),
    bust(22, 60, 0.9, { top: C.green, look: 2 }), arm([30, 84], [60, 58], C.green, [42, 80]), ground),
  // kursavgift: the money goes over the course desk – a price tag on the yarn and needles
  'hclub.kursavgift': all(table(60, 80, 108), yarn(80, 70, 9, C.sky), needles(98, 68, 0), turn(70, 52, 0, path('M-10 -8 L12 -8 L18 0 L12 8 L-10 8 Z', HL, C.ink, 1.6), circle(-5, 0, 2, C.white, C.ink, 1)),
    bust(24, 44, 0.95, { top: C.green, look: 2 }), arm([34, 70], [48, 66], C.green, [40, 74]), waIn('hc-avg', -10, 0, note(52, 72, -6), coin(42, 64, 5)), bust(98, 30, 0.7, { top: C.purple, hs: 'bun', look: -2 }), ground),
  // kursstart: one big calendar page – the flag on the day the course begins
  'hclub.kursstart': all(calendar(8, 10, 104, 80, 7, 4, { 9: HL }, C.navy), line('M40 44 L40 16', C.ink, 2), path('M40 17 L55 21 L40 26 Z', C.green, C.ink, 1.2), num(47, 42, '9', 9, C.white),
    yarn(26, 100, 7, C.red), needles(46, 100, 0), line('M60 100 L100 100', HL, 3), path('M98 94 L108 100 L98 106 Z', HL, null)),
  // kurstillfälle: the eight evenings of the course in a row – this is one of them
  'hclub.kurstillfälle': all(...Array.from({ length: 8 }, (_, i) => { const x = 6 + (i % 4) * 28, y = i < 4 ? 14 : 62, on = i === 2;
    return all(rect(x, y, 24, 40, on ? '#fde9d8' : '#eef0f2', 3, on ? HL : C.grey, on ? 2.6 : 1.4), num(x + 12, y + 14, String(i + 1), 12, on ? HL : C.grey), moon(x + 18, y + 6, 3), on ? all(head(x + 7, y + 28, C.green, C.hair, 0.6), head(x + 17, y + 28, C.red, C.hair, 0.6)) : rect(x + 6, y + 24, 12, 8, C.grey2, 1, null)); })),
};

// ── 4763 Workshops ──
const M3: Record<string, Svg> = {
  // smågrupp: the room is split into small groups – four at each table, one group ringed
  'hclub.smågrupp': all(rect(4, 6, 112, 106, '#f3eee4', 4, null),
    ...[[30, 34], [90, 34], [60, 84]].map(([x, y], j) => all(circle(x!, y!, 10, C.tan, C.ink, 1.6), head(x!, y! - 15, [C.red, C.green, C.purple][j]!, C.hair, 0.8), head(x! - 15, y!, C.sky, '#8a5a2b', 0.8), head(x! + 15, y!, C.yellow, C.hair, 0.8), head(x!, y! + 15, C.orange, '#c9a227', 0.8))),
    `<circle cx="60" cy="84" r="27" fill="none" stroke="${HL}" stroke-width="2.6" stroke-dasharray="5 4"/>`),
  // halvdag: half the day – from sunrise to midday the bar is orange, the afternoon and evening are grey
  'hclub.halvdag': all(sunDisk(16, 32, 6), sunDisk(60, 16, 6), moon(104, 30, 7), rect(8, 54, 104, 18, '#eef0f2', 4, C.ink, 1.8), rect(8, 54, 52, 18, HL, 4, C.ink, 1.8), line('M60 50 L60 76', C.ink, 2, '3 2'),
    clock(34, 94, 13, 270, 0), clock(86, 94, 13, 0, 0, '#eef0f2'), line('M50 94 L68 94', HL, 2.6), path('M66 89 L72 94 L66 99 Z', HL, null)),
  // helgkurs: the week – only Saturday and Sunday have the course
  'hclub.helgkurs': all(...Array.from({ length: 7 }, (_, i) => { const on = i >= 5, x = 4 + i * 16;
    return all(rect(x, 24, 14, 64, on ? '#fde9d8' : '#eef0f2', 2, on ? HL : C.grey, on ? 2.2 : 1.2), rect(x, 24, 14, 10, on ? HL : C.grey2, 2, null), on ? all(yarn(x + 7, 52, 4.4, C.red), turn(x + 7, 72, -20, rect(-1.2, -8, 2.4, 12, C.brown, 1, null), circle(0, -9, 2, C.sky, null))) : ''); }),
    sunDisk(92, 102, 4), sunDisk(108, 102, 4), ground),
  // föranmälan: the form goes in first (before the day); at the workshop door only the one with the ticked form gets in
  'hclub.föranmälan': all(form(6, 14, 28, 36, true), check(30, 16, 0.75), line('M38 32 L56 32', HL, 3), path('M54 26 L62 32 L54 38 Z', HL, null), calendar(66, 10, 48, 40, 4, 2, { 5: HL }, C.navy),
    doorFrame(46, 58, 28, 54, '#f8f4ea'), bust(28, 76, 0.85, { top: HL, hs: 'long', face: 'smile', look: 2.4 }), faded(bust(96, 76, 0.85, { top: C.grey })), cross(96, 60, 1), ground),
};

// ── 4764 Mässor och festivaler ──
const M4: Record<string, Svg> = {
  // spelkonvent: a school hall full of people playing at long tables, sleeping bags along the wall (several days)
  'hclub.spelkonvent': all(rect(4, 6, 112, 106, '#efe6d3', 3, null), rect(8, 10, 104, 14, '#bfe3f5', 1, C.ink, 1.4), line('M34 10 L34 24 M60 10 L60 24 M86 10 L86 24', C.ink, 1.4),
    ...[40, 74].map((y, j) => all(rect(10, y, 100, 10, C.tan, 2, C.ink, 1.6), rect(20 + j * 10, y + 2, 24, 6, '#7ab07a', 1, C.ink, 1), dice(60, y + 5, 6), rect(74, y + 1, 10, 7, C.white, 1, C.ink, 1),
      head(22, y - 7, C.red, C.hair, 0.75), head(46, y - 7, C.green, '#8a5a2b', 0.75), head(72, y - 7, C.purple, C.hair, 0.75), head(98, y - 7, C.sky, '#c9a227', 0.75))),
    ...[0, 1, 2].map((i) => all(rect(10 + i * 36, 96, 30, 12, [C.navy, C.green, C.red][i]!, 6, C.ink, 1.4), circle(16 + i * 36, 102, 4, C.white, C.ink, 1))), ground),
  // arrangera: the organiser with the clipboard puts it all in place – stage, chairs and the banner glide into position
  'hclub.arrangera': all(slide('hc-arr1', 0, -30, 3, path('M40 14 L116 14 L110 24 L46 24 Z', HL, C.ink, 1.6), line('M48 18 L56 18 M64 18 L72 18 M80 18 L88 18 M96 18 L104 18', C.white, 2)),
    rect(56, 56, 56, 12, C.brown, 2, C.ink, 1.8), slide('hc-arr2', 30, 0, 3.4, chair(66, 92), chair(84, 92), chair(102, 92)),
    bust(22, 50, 1, { top: C.navy, hs: 'short', face: 'smile', look: 2.4 }), rect(30, 70, 16, 22, '#c9a36b', 2, C.ink, 1.6), rect(33, 66, 10, 5, C.grey, 1, C.ink, 1), line('M33 76 L43 76 M33 81 L43 81 M33 86 L40 86', C.ink, 1.2), arm([12, 76], [32, 84], C.navy, [14, 90]), ground),
  // dagsbiljett: a ticket with the sun on it – one day, the calendar shows one day ringed
  'hclub.dagsbiljett': all(ticket(56, 50, 90, 46, HL, -8, sunDisk(-14, -2, 9), num(30, 8, '1', 22, C.white)), calendar(70, 78, 44, 32, 7, 2, { 3: C.yellow }, C.navy),
    `<circle cx="91" cy="92" r="6" fill="none" stroke="${HL}" stroke-width="2"/>`, bust(22, 92, 0.6, { top: C.green, face: 'grin' })),
  // föredrag: a speaker at the lectern with a picture behind her, the audience listens
  'hclub.föredrag': all(rect(46, 8, 66, 40, C.white, 2, C.ink, 2), path('M52 42 C62 22 76 22 84 34 C90 28 100 30 106 42 Z', C.green, null), sunDisk(98, 18, 4),
    bust(30, 40, 0.95, { top: HL, hs: 'bun', face: 'open', look: -2 }), arm([38, 64], [54, 40], HL, [48, 60]), lectern(30),
    waPulse('hc-fdr', line('M12 26 L6 22 M12 34 L4 34 M12 42 L6 46', C.navy, 2)),
    head(60, 96, C.green, C.hair, 1), head(80, 96, C.red, '#8a5a2b', 1), head(100, 96, C.purple, C.hair, 1), head(70, 108, C.sky, '#c9a227', 0.9), head(90, 108, C.yellow, C.hair, 0.9)),
  // signera: the author writes her name in the open book – the pen draws the line
  'hclub.signera': all(bust(60, 26, 0.9, { top: C.purple, hs: 'long', face: 'smile', look: 0 }), table(60, 62, 110), book(16, 54, 14, 18, C.red, -6), book(104, 54, 14, 18, C.red, 6),
    openBook(58, 84, 1.3), moving('hc-sign', '0%,15%{transform:translate(-18px,0)}70%,100%{transform:translate(0,0)}', { dur: 2.6 }, pen(80, 84, 30)),
    moving('hc-sign2', '0%,15%{opacity:0}70%,100%{opacity:1}', { dur: 2.6 }, line('M40 90 C44 80 48 96 52 86 C55 80 58 94 62 88 C66 82 70 92 76 88', HL, 2.4)), arm([72, 44], [80, 78], C.purple, [84, 60]), ground),
  // utklädd: dressed up as someone else – robe, tall hat and staff; the grey person beside her is in ordinary clothes
  'hclub.utklädd': all(faded(bust(26, 54, 0.95, { top: C.grey, face: 'flat' }), rect(12, 84, 28, 28, C.grey, 2, null)),
    path('M64 112 L72 66 L104 66 L112 112 Z', C.purple, C.ink, 2), star(80, 90, 3, C.yellow), star(98, 100, 2.6, C.yellow), bust(88, 56, 1, { top: C.purple, hs: 'long', face: 'grin', hair: '#c9a227' }),
    path('M74 50 L88 12 L102 50 Z', HL, C.ink, 2), ellipse(88, 50, 18, 4, HL, C.ink, 1.6), star(88, 32, 3, C.yellow), line('M114 30 L110 108', C.brown, 3), circle(114, 28, 5, C.sky, C.ink, 1.4), ground),
  // program: the sheet that says what happens when – times with small pictures (lectern, stage, dice)
  'hclub.program.4': all(rect(18, 6, 84, 106, C.white, 3, C.ink, 2), rect(18, 6, 84, 16, HL, 3, C.ink, 2), star(60, 14, 4, C.white),
    ...[['10', 0], ['11', 1], ['13', 2], ['15', 3]].map(([t, i]) => all(num(36, 40 + (i as number) * 20, t as string, 11, C.navy), line(`M48 ${36 + (i as number) * 20} L84 ${36 + (i as number) * 20}`, C.grey2, 2))),
    at(92, 36, 0.4, lectern(0), circle(0, 58, 6, C.skin, C.ink, 1.4)), at(92, 56, 1, rect(-7, -2, 14, 5, C.brown, 1, C.ink, 1)), dice(92, 74, 9), at(92, 94, 0.9, yarn(0, 0, 5, C.red)), line('M24 102 L96 102', C.grey2, 1.4)),
  // monter: the club's stand at the fair – a back wall with a banner, the table with games, a person behind it
  'hclub.monter.2': all(rect(14, 14, 92, 70, '#dfe9f3', 2, C.ink, 2), rect(14, 6, 92, 14, HL, 2, C.ink, 2), dice(30, 13, 8), dice(90, 13, 8),
    bust(60, 50, 0.95, { top: HL, hs: 'bun', face: 'grin' }), rect(14, 76, 92, 36, C.white, 2, C.ink, 2), rect(14, 76, 92, 8, C.navy, 2, C.ink, 1.8),
    rect(24, 64, 22, 12, C.red, 2, C.ink, 1.4), rect(52, 66, 18, 10, C.green, 2, C.ink, 1.4), rect(76, 62, 22, 14, C.yellow, 2, C.ink, 1.4), faded(head(6, 102, C.grey, C.grey, 0.9), head(114, 102, C.grey, C.grey, 0.9)), ground),
};

// ── 4765 Bokcirklar ──
const M5: Record<string, Svg> = {
  // läsa ut: the last page turns, the book closes – done
  'hclub.läsa-ut': all(path('M8 40 C26 34 44 34 60 40 L60 100 C44 94 26 94 8 100 Z', C.white, C.ink, 2), line('M14 50 L54 50 M14 58 L54 58 M14 66 L44 66', C.grey, 1.4), rect(56, 40, 6, 60, C.red, 1, C.ink, 1.6),
    moving('hc-ut', '0%,20%{transform:translate(60px,0) scale(-1,1) translate(-60px,0)}60%,100%{transform:translate(60px,0) scale(1,1) translate(-60px,0)}', { dur: 2.8 }, path('M60 40 C76 34 94 34 112 40 L112 100 C94 94 76 94 60 100 Z', '#fbe9d8', C.ink, 2)),
    appear('hc-ut2', 55, check(98, 26, 1.2, HL)), line('M72 50 L104 50 M72 58 L100 58', C.grey2, 1.4)),
  // diskutera: three people round the book; first one speaks, then the next, then the next
  'hclub.diskutera': all(table(60, 86, 104), openBook(60, 82, 0.8),
    bust(22, 60, 0.9, { top: C.green, hs: 'long', face: 'open', look: 2 }), bust(60, 50, 0.9, { top: C.red, face: 'think' }), bust(98, 60, 0.9, { top: C.purple, hs: 'bun', face: 'open', look: -2 }),
    moving('hc-disk1', '0%,33%{opacity:1}34%,100%{opacity:.15}', { dur: 3.6 }, bubble(4, 14, 30, 22, [18, 46], num(19, 31, '!', 14, HL))),
    moving('hc-disk2', '0%,33%{opacity:.15}34%,66%{opacity:1}67%,100%{opacity:.15}', { dur: 3.6 }, bubble(45, 2, 30, 22, [60, 32], num(60, 19, '?', 14, C.navy))),
    moving('hc-disk3', '0%,66%{opacity:.15}67%,100%{opacity:1}', { dur: 3.6 }, bubble(86, 14, 30, 22, [100, 46], num(101, 31, '!', 14, HL)))),
  // författarkväll: evening in the library – the author on a chair reads from her book, people listen
  'hclub.författarkväll': all(rect(0, 0, 120, 112, '#3a4566', 0, null), rect(6, 8, 30, 30, '#22293f', 2, C.ink, 1.6), moon(22, 22, 7),
    rect(80, 6, 36, 70, C.brown, 2, C.ink, 1.6), ...[0, 1, 2].map((r) => all(...[0, 1, 2, 3, 4].map((i) => rect(83 + i * 6.4, 10 + r * 22, 5, 18, [C.red, C.sky, C.yellow, C.green, C.purple][(i + r) % 5]!, 1, C.ink, 0.8)))),
    path('M50 4 L50 18 M42 28 L58 28 L54 18 L46 18 Z', '#ffe9a8', C.ink, 1.4), path('M30 60 L70 60 L84 110 L16 110 Z', 'rgba(255,233,168,0.25)', null),
    bust(50, 50, 0.95, { top: HL, hs: 'long', face: 'open', look: 2 }), book(62, 76, 14, 18, C.red, 0), chair(50, 82, C.tan),
    head(16, 100, C.green, C.hair, 1), head(84, 100, C.sky, '#c9a227', 1), head(104, 100, C.purple, C.hair, 1), line('M4 112 L116 112', '#8a93a8', 2)),
  // tipsa om: “read this!” – she hands the book on to her friend with a thumbs-up
  'hclub.tipsa-om': all(bust(26, 46, 1, { top: HL, hs: 'long', face: 'grin', look: 2.4 }), bust(94, 46, 1, { top: C.green, face: 'o', look: -2.4 }),
    bubble(2, 4, 34, 22, [20, 34], star(13, 15, 4, C.yellow), star(25, 15, 4, C.yellow)), arm([36, 72], [52, 80], HL, [42, 84]),
    moving('hc-tips', '0%,15%{transform:translate(-22px,4px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, book(64, 78, 18, 24, C.sky, 6), star(64, 74, 3.4, C.yellow)),
    arm([84, 72], [74, 80], C.green, [80, 84]), ground),
  // låna: the librarian hands the book over the desk – it goes home with you, and the dashed arrow says it comes back
  'hclub.låna': all(rect(80, 6, 36, 60, C.brown, 2, C.ink, 1.6), ...[0, 1].map((r) => all(...[0, 1, 2, 3, 4].map((i) => rect(83 + i * 6.4, 10 + r * 28, 5, 24, [C.red, C.sky, C.yellow, C.green, C.purple][(i + r) % 5]!, 1, C.ink, 0.8)))),
    bust(64, 44, 0.9, { top: C.navy, hs: 'bun', face: 'smile', look: -2 }), rect(42, 70, 76, 42, C.tan, 2, C.ink, 2),
    moving('hc-lana', '0%,15%{transform:translate(28px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, book(30, 64, 16, 22, HL, -6)),
    bust(18, 64, 0.95, { top: C.green, look: 2 }), `<path d="M44 30 C34 16 18 20 18 34" fill="none" stroke="${C.grey}" stroke-width="2" stroke-dasharray="4 3"/>`, path('M40 28 L46 34 L48 25 Z', C.grey, null), ground),
};

// ── 4766 Frivilliga arrangörer ──
const M6: Record<string, Svg> = {
  // arbetsgrupp: a few people in the same coloured vests take one job – the coffee table – while other groups do other things
  'hclub.arbetsgrupp': all(`<rect x="6" y="20" width="76" height="92" rx="8" fill="#fde9d8" stroke="${HL}" stroke-width="2.4" stroke-dasharray="5 4"/>`,
    table(44, 84, 70), path('M22 84 L22 66 L34 66 L34 84 Z', C.grey, C.ink, 1.6), rect(24, 62, 8, 4, C.dark, 1, null), ...[46, 58].map((x) => path(`M${x - 4} 84 L${x - 3} 76 L${x + 3} 76 L${x + 4} 84 Z`, C.white, C.ink, 1.2)),
    bust(26, 40, 0.8, { top: HL }), bust(48, 36, 0.8, { top: HL, hs: 'long' }), bust(70, 40, 0.8, { top: HL, hs: 'bun' }),
    faded(bust(100, 40, 0.7, { top: C.grey }), bust(100, 80, 0.7, { top: C.grey })), ground),
  // bemanna: the empty kiosk gets its person – the volunteer slides in behind the counter
  'hclub.bemanna': all(path('M20 30 L100 30 L108 18 L12 18 Z', HL, C.ink, 2), line('M28 18 L28 30 M44 18 L44 30 M60 18 L60 30 M76 18 L76 30 M92 18 L92 30', C.white, 2), rect(20, 30, 80, 82, '#f3e7cf', 1, C.ink, 2), rect(26, 36, 68, 34, '#dff0fa', 1, C.ink, 1.6),
    moving('hc-bem', '0%,15%{transform:translate(-60px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, bust(60, 50, 0.9, { top: C.green, hs: 'long', face: 'grin' })),
    rect(16, 70, 88, 10, C.brown, 2, C.ink, 1.8), ...[36, 52].map((x) => path(`M${x - 4} 70 L${x - 3} 62 L${x + 3} 62 L${x + 4} 70 Z`, C.white, C.ink, 1.2)), rect(72, 62, 14, 8, C.dark, 1, C.ink, 1), ground),
  // ställa i ordning: before the event – the chairs slide into straight rows in front of the little stage
  'hclub.ställa-i-ordning': all(rect(10, 10, 100, 24, C.brown, 2, C.ink, 1.8), rect(30, 14, 60, 16, '#dff0fa', 1, null),
    moving('hc-ord1', '0%,10%{transform:translate(-14px,10px) rotate(-20deg)}60%,100%{transform:translate(0,0)}', { dur: 3 }, chair(28, 52), chair(50, 52)),
    moving('hc-ord2', '0%,10%{transform:translate(16px,-8px) rotate(18deg)}60%,100%{transform:translate(0,0)}', { dur: 3.2 }, chair(72, 52), chair(94, 52)),
    moving('hc-ord3', '0%,10%{transform:translate(10px,12px)}60%,100%{transform:translate(0,0)}', { dur: 3.4 }, chair(28, 84), chair(50, 84), chair(72, 84), chair(94, 84)), ground),
  // packa ihop: it's over – the games go down into the box and the table is empty
  'hclub.packa-ihop': all(table(40, 62, 70), rect(16, 54, 20, 8, '#eef0f2', 1, C.grey, 1), box(70, 76, 44, 36), line('M70 76 L60 64 M114 76 L120 64', C.brown, 2),
    moving('hc-pack1', '0%,10%{transform:translate(-44px,-20px)}55%,100%{transform:translate(0,0)}', { dur: 3 }, rect(78, 70, 28, 10, C.red, 2, C.ink, 1.4)),
    moving('hc-pack2', '0%,30%{transform:translate(-50px,-26px)}75%,100%{transform:translate(0,0)}', { dur: 3 }, rect(82, 62, 22, 8, C.green, 2, C.ink, 1.4)),
    bust(30, 24, 0.75, { top: C.navy, look: 2.4 }), arm([38, 44], [60, 52], C.navy, [44, 52]), ground),
};

// ── 4767 Att planera ett hobbyevenemang ──
const M7: Record<string, Svg> = {
  // anmälningslista: the list on the door – names one under the other, one more is written in
  'hclub.anmälningslista': all(doorFrame(20, 8, 80, 104, '#e2c79e'), rect(34, 18, 52, 76, '#c9a36b', 3, C.ink, 1.8), rect(38, 26, 44, 64, C.white, 1, C.ink, 1.4), rect(52, 14, 16, 8, C.grey, 2, C.ink, 1.2),
    ...[0, 1, 2, 3, 4].map((i) => all(num(43, 36 + i * 11, String(i + 1), 7, C.grey), line(`M48 ${33 + i * 11} C52 ${30 + i * 11} 56 ${36 + i * 11} 60 ${32 + i * 11} C64 ${30 + i * 11} 68 ${35 + i * 11} 74 ${32 + i * 11}`, C.navy, 1.4))),
    num(43, 91, '6', 7, HL), moving('hc-lista', '0%,15%{opacity:0}70%,100%{opacity:1}', { dur: 2.6 }, line('M48 88 C52 85 56 91 60 87 C64 84 68 90 74 87', HL, 1.8)), pen(80, 88, 30)),
  // sista anmälningsdag: the calendar – one day ringed red with the clock; the days after it are crossed out
  'hclub.sista-anmälningsdag': all(calendar(6, 8, 108, 86, 7, 4, { 17: HL }), num(60, 70, '!', 12, C.white),
    ...[18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map((i) => { const cx = 6 + (i % 7) * (108 / 7) + 108 / 14, cy = 18 + Math.floor(i / 7) * 19 + 9.5; return line(`M${cx - 4} ${cy - 4} L${cx + 4} ${cy + 4} M${cx + 4} ${cy - 4} L${cx - 4} ${cy + 4}`, C.grey, 1.6); }),
    clock(26, 102, 9, 330, 0), form(84, 96, 20, 16, false)),
  // arrangemang: the event itself – garlands, a small stage with a musician, people at tables with fika
  'hclub.arrangemang': all(rect(4, 6, 112, 106, '#efe6d3', 3, null), ...[0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${6 + i * 16} 10 L${14 + i * 16} 22 L${22 + i * 16} 10 Z`, [C.red, C.yellow, C.green, C.sky, C.purple, C.orange, C.red][i]!, C.ink, 1)), line('M6 10 L118 10', C.ink, 1.2),
    rect(70, 50, 44, 10, C.brown, 2, C.ink, 1.6), bust(92, 34, 0.7, { top: HL, hs: 'long', face: 'open' }), turn(100, 44, -20, ellipse(0, 0, 4, 6, C.tan, C.ink, 1), line('M0 -6 L0 -16', C.ink, 1.4)),
    table(32, 86, 52), head(16, 74, C.green, C.hair, 0.9), head(32, 72, C.red, '#8a5a2b', 0.9), head(48, 74, C.sky, C.hair, 0.9), ...[22, 42].map((x) => path(`M${x - 3} 86 L${x - 2} 80 L${x + 2} 80 L${x + 3} 86 Z`, C.white, C.ink, 1)),
    head(80, 100, C.purple, C.hair, 0.9), head(100, 100, C.yellow, '#c9a227', 0.9), ground),
  // tema: one idea for the whole evening – the same flower is on the poster, the cake, the lantern and the name card
  'hclub.tema': all(circle(60, 58, 16, '#fde9d8', HL, 2.6), ...[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return circle(+(60 + Math.cos(a) * 7).toFixed(1), +(58 + Math.sin(a) * 7).toFixed(1), 5, C.pink, C.ink, 1); }), circle(60, 58, 3, C.yellow, null),
    ...[[20, 20], [100, 20], [20, 96], [100, 96]].map(([x, y]) => line(`M${60 + (x! - 60) * 0.3} ${58 + (y! - 58) * 0.3} L${60 + (x! - 60) * 0.72} ${58 + (y! - 58) * 0.72}`, C.grey, 1.6, '3 3')),
    poster(6, 4, 28, 32, C.sky, circle(20, 12, 4, C.pink, C.ink, 0.8)), at(100, 22, 1, ellipse(0, 0, 10, 13, C.red, C.ink, 1.4), line('M0 -13 L0 -18 M0 13 L0 17', C.ink, 1.6), circle(0, 0, 4, C.pink, C.ink, 0.8)),
    at(20, 98, 1, path('M-14 6 L14 6 L12 -6 L-12 -6 Z', C.white, C.ink, 1.4), circle(0, -9, 4, C.pink, C.ink, 0.8)), at(100, 98, 1, rect(-14, -8, 28, 14, C.white, 2, C.ink, 1.4), circle(-7, -1, 3.6, C.pink, C.ink, 0.8), line('M-1 -1 L9 -1', C.grey, 1.4))),
  // sätta upp: up on the wall it goes – she stands on a stool by the wall, the poster moves up and the pins go in
  'hclub.sätta-upp': all(rect(4, 6, 112, 106, '#e9e1d2', 2, null), line('M4 96 L116 96', C.grey2, 1.4),
    moving('hc-satt', '0%,10%{transform:translate(0,34px) rotate(-8deg)}60%,100%{transform:translate(0,0)}', { dur: 3 }, poster(52, 14, 40, 52, HL, star(72, 26, 5, C.white), line('M58 50 L86 50 M58 57 L80 57', C.grey, 1.6))),
    appear('hc-satt2', 60, pin(55, 17), pin(89, 17)), rect(22, 94, 32, 5, C.brown, 1, C.ink, 1.6), line('M26 99 L24 112 M50 99 L52 112', C.brown, 3), path('M30 66 L46 66 L45 93 L39 93 L38 76 L37 93 L31 93 Z', C.navy, C.ink, 1.6), bust(38, 40, 0.9, { top: C.green, face: 'smile', look: 2.4 }), arm([46, 56], [56, 22], C.green, [55, 40]), arm([31, 58], [53, 52], C.green, [38, 70]), ground),
};

export const HCLUB_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
