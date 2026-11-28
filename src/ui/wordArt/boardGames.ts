/**
 * Kultur & fritid → Spel & hobbyer → Sällskapsspel, 4711–4717 (0.65): the parts of a board game, dice games, card
 * games, rules and turn order, co-operative and competitive games, strategy and tactics, explaining a game.
 * Boards, cards and pieces are generic: no brands, no recognisable game titles or characters, no letters that give
 * away the word (digits, pips, suit signs, "?", "!", "§" and "=" are fine).
 * Movement: `moving()`/`waIn()` move things with transform/opacity only; the base state is the poster frame.
 * The named part is orange (HL); grey is the reference.
 * Easily confused pairs get different kinds of picture: an empty board (spelbräde) against a whole game in play
 * (brädspel); coloured pawns (spelpjäs) against chess pieces (pjäs); a single big die with six pips (sexa) against a
 * cheering player (tur); cards flying out from the dealer (dela ut) against a strip deal–play–count (giv) and four
 * cards swept in by one hand (stick); one player in the spotlight (tur) against a numbered row (turordning) and a
 * lap round the table (omgång); two players shoulder to shoulder (medspelare) against two players across a board
 * (motspelare) and two pawns with colliding arrows (mot varandra).
 */
import { C, all, arrow, circle, ellipse, g, hand, line, moving, path, rect, sparkle, star, waGrow, waPulse, type Svg } from './kit';
import { HL } from './people';

type Pt = [number, number];
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const turn = (x: number, y: number, deg: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg})`, ...k);
const faded = (...k: Svg[]): Svg => `<g opacity="0.4" style="filter:grayscale(1)">${k.join('')}</g>`;
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), line('M-4.5 0 L-1 4 L5 -4', C.white, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, line('M-5 -5 L5 5 M5 -5 L-5 5', C.red, 3));
const felt = (y = 16, h = 96) => rect(6, y, 108, h, '#dcebdc', 12, C.ink, 2);
const wood = (y = 84) => all(rect(2, y, 116, 28, C.tan, 4, C.ink, 2), line(`M10 ${y + 9} L48 ${y + 9} M64 ${y + 18} L108 ${y + 18}`, C.brown, 1));
const bubble = (x: number, y: number, w: number, h: number, tail: Pt, ...k: Svg[]) => all(path(`M${x + w * 0.3} ${y + h} L${tail[0]} ${tail[1]} L${x + w * 0.55} ${y + h} Z`, C.white, C.ink, 1.6), rect(x, y, w, h, C.white, 9, C.ink, 1.8), rect(x + w * 0.3 + 1, y + h - 2.4, w * 0.25 - 2, 3.4, C.white, 0, null), ...k);
/** Hidden at first, appears at `delay` % of the loop and stays (poster frame: visible). */
const appear = (name: string, delay: number, ...k: Svg[]) => moving(name, `0%,${delay}%{opacity:0}${delay + 10}%,100%{opacity:1}`, { dur: 3.2 }, ...k);
/** Slides in from (dx, dy) and rests (poster frame: at rest). */
const slide = (name: string, dx: number, dy: number, dur: number, ...k: Svg[]) => moving(name, `0%,12%{transform:translate(${dx}px,${dy}px)}60%,100%{transform:translate(0,0)}`, { dur }, ...k);

// ── Dice ──
const PIPS: Record<number, Pt[]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
const die = (x: number, y: number, s: number, n: number, deg = 0, fill: string = C.white, pip: string = C.ink): Svg =>
  turn(x, y, deg, rect(-s / 2, -s / 2, s, s, fill, s * 0.2, C.ink, 1.8), ...PIPS[n]!.map(([a, b]) => circle(a * s * 0.27, b * s * 0.27, s * 0.09, pip, null)));

// ── Cards ──
type Suit = 'h' | 's' | 'd' | 'c';
const RED = '#cf3b3b';
const suit = (k: Suit, x: number, y: number, r: number): Svg => {
  const f = (n: number) => +n.toFixed(1);
  if (k === 'h') return path(`M${x} ${f(y + r)} C${f(x - r * 1.5)} ${f(y - r * 0.1)} ${f(x - r * 0.8)} ${f(y - r * 1.3)} ${x} ${f(y - r * 0.45)} C${f(x + r * 0.8)} ${f(y - r * 1.3)} ${f(x + r * 1.5)} ${f(y - r * 0.1)} ${x} ${f(y + r)} Z`, RED, null);
  if (k === 'd') return path(`M${x} ${f(y - r)} L${f(x + r * 0.78)} ${y} L${x} ${f(y + r)} L${f(x - r * 0.78)} ${y} Z`, RED, null);
  const stem = path(`M${x} ${f(y + r * 0.1)} L${f(x + r * 0.42)} ${f(y + r)} L${f(x - r * 0.42)} ${f(y + r)} Z`, C.ink, null);
  if (k === 's') return all(path(`M${x} ${f(y - r)} C${f(x + r * 1.5)} ${f(y + r * 0.1)} ${f(x + r * 0.9)} ${f(y + r * 1.05)} ${x} ${f(y + r * 0.3)} C${f(x - r * 0.9)} ${f(y + r * 1.05)} ${f(x - r * 1.5)} ${f(y + r * 0.1)} ${x} ${f(y - r)} Z`, C.ink, null), stem);
  return all(circle(x, f(y - r * 0.5), r * 0.44, C.ink, null), circle(f(x - r * 0.5), f(y + r * 0.2), r * 0.44, C.ink, null), circle(f(x + r * 0.5), f(y + r * 0.2), r * 0.44, C.ink, null), stem);
};
const inkOf = (k: Suit) => (k === 'h' || k === 'd' ? RED : C.ink);
/** Playing card, centre (x, y): index digit in the corner and one suit sign in the middle. */
const pc = (x: number, y: number, deg: number, k: Suit, label = '', w = 24, h = 34, edge: string = C.ink): Svg =>
  turn(x, y, deg, rect(-w / 2, -h / 2, w, h, C.white, Math.min(w, h) * 0.14, edge, edge === C.ink ? 1.6 : 2.6), label ? num(-w / 2 + w * 0.2, -h / 2 + h * 0.28, label, h * 0.24, inkOf(k)) : '', suit(k, 0, label ? h * 0.1 : 0, h * 0.2));
/** Card back. */
const cb = (x: number, y: number, deg: number, w = 24, h = 34, col = '#3c6db0'): Svg =>
  turn(x, y, deg, rect(-w / 2, -h / 2, w, h, col, Math.min(w, h) * 0.14, C.ink, 1.6), rect(-w / 2 + 2.6, -h / 2 + 2.6, w - 5.2, h - 5.2, 'none', 2, C.white, 1.1), line(`M${-w / 2 + 3} 0 L0 ${-h / 2 + 3} L${w / 2 - 3} 0 L0 ${h / 2 - 3} Z`, C.white, 0.9));

// ── Pieces and boards ── (pieces: base at y = 0)
const pawn = (col: string): Svg => all(path('M-9 0 L9 0 C9 -5 4 -8 3.4 -17 L-3.4 -17 C-4 -8 -9 -5 -9 0 Z', col, C.ink, 1.6), circle(0, -21, 6.4, col, C.ink, 1.6));
const WH = '#fbf6ea', BK = '#4a4652';
const cPawn = (col: string): Svg => all(path('M-7 0 L7 0 L5 -4 L3 -5 C2 -9 2 -11 4 -13 L-4 -13 C-2 -11 -2 -9 -3 -5 L-5 -4 Z', col, C.ink, 1.4), circle(0, -17, 4.6, col, C.ink, 1.4));
const cKing = (col: string): Svg => all(path('M-8 0 L8 0 L6 -4 L4 -5 C3 -12 4 -18 6 -22 L-6 -22 C-4 -18 -3 -12 -4 -5 L-6 -4 Z', col, C.ink, 1.4), path('M-6 -22 L6 -22 L4 -27 L-4 -27 Z', col, C.ink, 1.4), line('M0 -27 L0 -35 M-3.5 -31.5 L3.5 -31.5', C.ink, 2.2));
const cRook = (col: string): Svg => all(path('M-8 0 L8 0 L6 -4 L5 -5 L5 -18 L-5 -18 L-5 -5 L-6 -4 Z', col, C.ink, 1.4), path('M-7 -18 L7 -18 L7 -25 L4 -25 L4 -22 L1.5 -22 L1.5 -25 L-1.5 -25 L-1.5 -22 L-4 -22 L-4 -25 L-7 -25 Z', col, C.ink, 1.4));
const cKnight = (col: string): Svg => all(path('M-8 0 L8 0 L6 -4 L5 -5 C6 -12 6 -18 2 -24 L-1 -27 L-2 -23 C-7 -21 -10 -16 -10 -13 L-7 -11 L-3 -14 C-3 -10 -5 -8 -5 -5 L-6 -4 Z', col, C.ink, 1.4), circle(-3, -19, 0.9, C.ink, null));
const cQueen = (col: string): Svg => all(path('M-8 0 L8 0 L6 -4 L4 -5 C3 -12 4 -17 6 -21 L-6 -21 C-4 -17 -3 -12 -4 -5 L-6 -4 Z', col, C.ink, 1.4), path('M-7 -21 L-8 -28 L-4 -24 L0 -30 L4 -24 L8 -28 L7 -21 Z', col, C.ink, 1.4), circle(0, -31, 1.6, col, C.ink, 1.1));
const COLS = [C.red, C.yellow, C.green, C.sky, C.purple, C.orange];
/** A board seen from above with a track of coloured squares round the edge. */
function trackBoard(x: number, y: number, w: number, h: number, c = 10): Svg {
  const out: Svg[] = [rect(x, y, w, h, C.beige, 3, null)];
  const nx = Math.round(w / c), ny = Math.round(h / c), cw = w / nx, ch = h / ny;
  let i = 0;
  for (let a = 0; a < nx; a++) out.push(rect(x + a * cw, y, cw, ch, COLS[i++ % 6]!, 0, C.ink, 0.8), rect(x + a * cw, y + h - ch, cw, ch, COLS[i++ % 6]!, 0, C.ink, 0.8));
  for (let b = 1; b < ny - 1; b++) out.push(rect(x, y + b * ch, cw, ch, COLS[i++ % 6]!, 0, C.ink, 0.8), rect(x + w - cw, y + b * ch, cw, ch, COLS[i++ % 6]!, 0, C.ink, 0.8));
  return all(...out, rect(x, y, w, h, 'none', 3, C.ink, 2));
}
/** A straight row of track squares. */
const trackRow = (x: number, y: number, n: number, c: number, special = -1): Svg => all(...Array.from({ length: n }, (_, i) => rect(x + i * c, y, c, c, i === special ? C.red : [C.beige, '#f3e7cf'][i % 2]!, 2, C.ink, 1.4)));
const checker = (x: number, y: number, n: number, cell: number, m = n): Svg => all(...Array.from({ length: n * m }, (_, i) => rect(x + (i % n) * cell, y + Math.floor(i / n) * cell, cell, cell, ((i % n) + Math.floor(i / n)) % 2 ? '#a9805a' : '#f2e4c9', 0, null)), rect(x, y, n * cell, m * cell, 'none', 1, C.ink, 2));

// ── People (head and shoulders; (x, y) = centre of the head, the bust ends at y + 30·s) ──
type Face = 'smile' | 'flat' | 'sad' | 'open' | 'grin' | 'angry' | 'o' | 'think';
type Look = { top?: string; hair?: string; hs?: 'short' | 'long' | 'bun'; face?: Face; grey?: boolean; skin?: string; look?: number };
function bust(x: number, y: number, s: number, o: Look = {}): Svg {
  const skin = o.grey ? C.grey2 : (o.skin ?? C.skin), top = o.grey ? C.grey : (o.top ?? C.sky), hair = o.grey ? '#8b9199' : (o.hair ?? C.hair), lk = o.look ?? 0, f = o.face ?? 'smile';
  const mouth = f === 'smile' ? line('M-3.5 4 Q0 7 3.5 4', C.ink, 1.4) : f === 'flat' ? line('M-3 5 L3 5', C.ink, 1.4) : f === 'sad' ? line('M-3.5 6 Q0 3 3.5 6', C.ink, 1.4) : f === 'open' ? ellipse(0, 5, 2.8, 3.2, C.ink, null)
    : f === 'grin' ? path('M-4.5 3 Q0 9.5 4.5 3 Z', C.white, C.ink, 1.2) : f === 'angry' ? line('M-3.5 6.4 Q0 3.6 3.5 6.4', C.ink, 1.6) : f === 'o' ? circle(0, 5, 1.8, C.ink, null) : line('M-2.4 5.2 L3 4.4', C.ink, 1.4);
  const brows = f === 'angry' ? line('M-6.4 -5.4 L-2 -3 M6.4 -5.4 L2 -3', C.ink, 1.6) : f === 'sad' ? line('M-6 -3.4 L-2.5 -5 M6 -3.4 L2.5 -5', C.ink, 1.2) : f === 'think' ? line('M-6 -4.6 L-2.5 -4.6 M2.5 -5.6 L6 -4.6', C.ink, 1.2) : '';
  return at(x, y, s,
    o.hs === 'long' ? path('M-10 -4 C-13 14 -8 16 0 15 C8 16 13 14 10 -4 Z', hair, C.ink, 1.2) : '',
    path('M-15 30 C-15 16 -9 12 0 12 C9 12 15 16 15 30 Z', top, C.ink, 1.8),
    rect(-3, 7, 6, 7, skin, 2, null), circle(0, 0, 10, skin, C.ink, 1.6),
    o.hs === 'bun' ? circle(0, -11.5, 4, hair, C.ink, 1.2) : '',
    path('M-10 -1 C-11 -14 11 -14 10 -1 C6 -7 -6 -7 -10 -1 Z', hair, C.ink, 1.2),
    circle(-3.6 + lk, -0.5, 1.3, C.ink, null), circle(3.6 + lk, -0.5, 1.3, C.ink, null), brows, mouth);
}
/** Sleeve with a round hand at the end; `mid` bends the arm at the elbow. */
const arm = (a: Pt, b: Pt, col: string = C.sky, mid?: Pt, skin: string = C.skin): Svg => {
  const d = `M${a[0]} ${a[1]} ${mid ? `L${mid[0]} ${mid[1]} ` : ''}L${b[0]} ${b[1]}`;
  return all(line(d, C.ink, 7.6), line(d, col, 5.2), circle(b[0], b[1], 3.8, skin, C.ink, 1.3));
};
const bulb = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 C-10 -6 -6 -14 0 -14 C6 -14 10 -6 6 0 L4 4 L-4 4 Z', C.yellow, C.ink, 1.5), rect(-3.4, 4, 6.8, 4, C.grey, 1, C.ink, 1.2), line('M-12 -12 L-15 -15 M12 -12 L15 -15 M0 -18 L0 -22', C.gold, 1.6));
const trophy = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 -12 L7 -12 C7 -3 4 1 0 2 C-4 1 -7 -3 -7 -12 Z', C.gold, C.ink, 1.5), line('M-7 -10 C-13 -10 -12 -3 -6 -3 M7 -10 C13 -10 12 -3 6 -3', C.ink, 1.5), rect(-1.6, 2, 3.2, 5, C.gold, 0, C.ink, 1.2), rect(-6, 7, 12, 3.4, C.brown, 1, C.ink, 1.2));
const hourglass = (x: number, y: number, s = 1) => at(x, y, s,
  path('M-13 -22 L13 -22 C13 -8 3 -3 3 0 C3 3 13 8 13 22 L-13 22 C-13 8 -3 3 -3 0 C-3 -3 -13 -8 -13 -22 Z', '#e9f4f8', C.ink, 1.8),
  path('M-9 -12 L9 -12 C6 -6 2 -3 0 -1 C-2 -3 -6 -6 -9 -12 Z', C.gold, null), path('M-11 21 C-9 13 -4 10 0 9 C4 10 9 13 11 21 Z', C.gold, null), line('M0 -1 L0 9', C.gold, 1.4),
  rect(-17, -27, 34, 6, C.brown, 2, C.ink, 1.6), rect(-17, 21, 34, 6, C.brown, 2, C.ink, 1.6), line('M-15 -21 L-15 21 M15 -21 L15 21', C.brown, 2.2));
const pencil = (x: number, y: number, deg: number, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, rect(-3, -22, 6, 30, C.yellow, 1, C.ink, 1.3), path('M-3 8 L3 8 L0 15 Z', C.beige, C.ink, 1.3), rect(-3, -26, 6, 4.4, C.pink, 1, C.ink, 1.3));
/** Score pad with a table. */
const pad = (x: number, y: number, w: number, h: number, rows = 5): Svg => all(rect(x, y, w, h, C.white, 3, C.ink, 1.8), rect(x, y, w, 8, C.dark, 3, C.ink, 1.8),
  ...Array.from({ length: rows - 1 }, (_, i) => line(`M${x + 3} ${y + 8 + ((h - 8) / rows) * (i + 1)} L${x + w - 3} ${y + 8 + ((h - 8) / rows) * (i + 1)}`, C.grey2, 1)), line(`M${x + w * 0.4} ${y + 10} L${x + w * 0.4} ${y + h - 3} M${x + w * 0.7} ${y + 10} L${x + w * 0.7} ${y + h - 3}`, C.grey2, 1));
const paper = (x: number, y: number, w: number, h: number, lines = 4, sign = true): Svg => all(rect(x, y, w, h, C.white, 3, C.ink, 1.8), sign ? num(x + w / 2, y + h * 0.3, '§', h * 0.26, C.navy) : '',
  ...Array.from({ length: lines }, (_, i) => line(`M${x + w * 0.16} ${y + h * (sign ? 0.44 : 0.2) + i * ((h * (sign ? 0.48 : 0.7)) / lines)} L${x + w * 0.84} ${y + h * (sign ? 0.44 : 0.2) + i * ((h * (sign ? 0.48 : 0.7)) / lines)}`, C.grey, 1.4)));
const gamepad = (x: number, y: number, s: number) => at(x, y, s, path('M-22 -8 C-22 -14 -16 -14 -12 -14 L12 -14 C16 -14 22 -14 22 -8 L24 8 C25 16 16 16 12 8 L-12 8 C-16 16 -25 16 -24 8 Z', C.dark, C.ink, 2), line('M-14 -6 L-14 2 M-18 -2 L-10 -2', C.white, 2.4), circle(11, -5, 2.6, C.red, null), circle(16, 0, 2.6, C.yellow, null));
const domino = (x: number, y: number, deg: number, a: number, b: number): Svg => turn(x, y, deg, rect(-22, -11, 44, 22, C.white, 3, C.ink, 1.8), line('M0 -9 L0 9', C.ink, 1.4),
  ...PIPS[a]!.map(([p, q]) => circle(-11 + p * 5.4, q * 5.4, 1.9, C.ink, null)), ...PIPS[b]!.map(([p, q]) => circle(11 + p * 5.4, q * 5.4, 1.9, C.ink, null)));
const disc = (x: number, y: number, col: string): Svg => all(path(`M${x - 11} ${y} L${x - 11} ${y + 4} A11 5 0 0 0 ${x + 11} ${y + 4} L${x + 11} ${y} Z`, col, C.ink, 1.6), ellipse(x, y, 11, 5, col, C.ink, 1.6), ellipse(x, y, 6.4, 2.6, 'none', C.ink, 0.9));
const note = (x: number, y: number, deg: number, col: string, label: string): Svg => turn(x, y, deg, rect(-30, -15, 60, 30, col, 3, C.ink, 1.6), rect(-26, -11, 52, 22, 'none', 2, C.ink, 0.9), circle(0, 0, 8, C.white, C.ink, 1.1), at(0, 5, 0.42, pawn(C.grey)), num(-18, 4, label, 9), num(18, 4, label, 9));
const seat = (x: number, y: number, col: string, hair: string = C.hair): Svg => all(ellipse(x, y, 11, 8, col, C.ink, 1.5), circle(x, y, 6.2, hair, C.ink, 1.3));
const roundTable = (x: number, y: number, r: number) => all(circle(x, y, r, C.tan, C.ink, 2), circle(x, y, r - 5, 'none', C.brown, 1));
const suitMotif = (k: Suit, labels: [string, string, string]): Svg => all(
  pc(84, 84, 16, k, labels[2], 24, 34), pc(64, 90, 2, k, labels[1], 24, 34), pc(44, 86, -14, k, labels[0], 24, 34),
  circle(46, 40, 31, C.white, HL, 2.8), suit(k, 46, k === 's' || k === 'c' ? 38 : 41, 21));

// ── Round 2 (0.65): helpers used only by redrawn motifs ──
const clover4 = (x: number, y: number, s: number): Svg => at(x, y, s, line('M0 4 C2 16 8 22 12 26', '#2f7d4a', 3.4),
  ...[0, 90, 180, 270].map((d) => g(`rotate(${d + 45})`, path('M0 -2 C-13 -8 -11 -24 0 -17 C11 -24 13 -8 0 -2 Z', C.green, C.ink, 1.5), line('M0 -4 L0 -14', '#2f7d4a', 1.2))));
const clockPie = (x: number, y: number, r: number, f: number, col: string): Svg => all(circle(x, y, r, C.white, C.ink, 1.8),
  path(`M${x} ${y} L${x} ${y - r + 2} A${r - 2} ${r - 2} 0 ${f > 0.5 ? 1 : 0} 1 ${+(x + (r - 2) * Math.sin(2 * Math.PI * f)).toFixed(1)} ${+(y - (r - 2) * Math.cos(2 * Math.PI * f)).toFixed(1)} Z`, col, null), circle(x, y, r, 'none', C.ink, 1.8), circle(x, y, 1.6, C.ink, null));
const flag = (x: number, y: number, s = 1, col: string = HL): Svg => at(x, y, s, line('M0 0 L0 -24', C.ink, 2.2), path('M0 -24 L15 -19 L0 -13 Z', col, C.ink, 1.4));

const M1: Record<string, Svg> = {
  // spel: the things one plays with – a board with a pawn, a die, cards and a game pad
  'boardg.spel': all(gamepad(34, 30, 1), pc(82, 32, -12, 'h', '7', 22, 32), pc(98, 36, 10, 's', '3', 22, 32), trackBoard(10, 60, 54, 42, 10.6), at(37, 92, 0.85, pawn(C.red)), die(88, 82, 26, 5, 12)),
  // spelbräde: only the board, empty, with the fold in the middle
  'boardg.spelbräde': all(trackBoard(10, 20, 100, 80, 12.5), line('M60 21 L60 99', C.grey, 1.6, '4 3'), circle(60, 60, 15, C.white, C.ink, 1.6), star(60, 60, 10), rect(7, 17, 106, 86, 'none', 5, HL, 2.6)),
  // brädspel: the whole game in play – box lid, board with pawns, die
  'boardg.brädspel': all(turn(28, 26, -10, rect(-22, -14, 44, 28, C.red, 3, C.ink, 1.8), rect(-22, 10, 44, 6, '#a33', 0, C.ink, 1.2), at(-8, 6, 0.5, pawn(C.yellow)), die(8, -2, 10, 3, 0)),
    trackBoard(30, 42, 82, 62, 10.3), at(48, 60, 0.7, pawn(C.red)), at(76, 96, 0.7, pawn(C.denim)), at(100, 72, 0.7, pawn(C.yellow)), die(66, 74, 16, 4, -14), at(14, 96, 0.7, pawn(C.green))),
  // spelpjäs: one big pawn in front, three small ones in other colours behind
  'boardg.spelpjäs': all(trackRow(6, 92, 6, 18), at(22, 92, 1, pawn(C.denim)), at(98, 92, 1, pawn(C.green)), at(80, 90, 0.8, pawn(C.yellow)), ellipse(56, 104, 24, 5, C.grey2, null), at(56, 104, 2.9, pawn(C.red)), line('M38 16 L32 10 M56 10 L56 3 M74 16 L80 10', HL, 2.4)),
  // pjäs (i spel): chess pieces; the pawn moves one square
  'boardg.pjäs.2': all(...Array.from({ length: 4 }, (_, i) => rect(12 + i * 24, 86, 24, 22, i % 2 ? '#a9805a' : '#f2e4c9', 0, C.ink, 1.4)), at(24, 100, 1.7, cKing(WH)), at(48, 100, 1.6, cRook(BK)), at(72, 100, 1.6, cKnight(WH)),
    slide('bg-pjas', -8, -22, 2.6, at(98, 100, 1.5, cPawn(BK)))),
  // bricka (i spel): flat things – domino tiles and round discs
  'boardg.bricka.4': all(felt(14, 96), domino(42, 40, -14, 3, 5), domino(80, 62, 22, 6, 2), disc(28, 78, C.red), disc(28, 72, C.red), disc(56, 92, C.white), disc(94, 94, '#5a5560'), disc(94, 88, '#5a5560'), disc(94, 82, '#5a5560')),
  'boardg.timglas': all(ellipse(60, 108, 34, 4, C.grey2, null), hourglass(60, 60, 1.72)),
  // spelpengar: play money – notes with a pawn mark instead of a portrait, next to a die and a pawn
  'boardg.spelpengar': all(note(52, 40, -14, C.rose, '50'), note(60, 54, 0, C.mint, '100'), note(66, 70, 12, '#f7e3a1', '20'), die(26, 96, 18, 2, -12), at(98, 106, 0.8, pawn(C.red))),
  // regelhäfte: a thin stapled booklet with numbered steps and a die and pawn on the cover
  'boardg.regelhäfte': all(turn(60, 60, -6, rect(-30, -44, 66, 88, C.grey2, 3, C.ink, 1.4), rect(-34, -46, 66, 90, C.white, 3, C.ink, 2), line('M-34 -24 L-31 -24 M-34 26 L-31 26', C.ink, 2.4),
    rect(-34, -46, 66, 24, C.sky, 3, C.ink, 2), die(-16, -34, 13, 5, 0), at(2, -26, 0.55, pawn(C.red)), num(20, -28, '§', 18, C.navy),
    ...[0, 1, 2].map((i) => all(circle(-22, -8 + i * 17, 5.4, HL, C.ink, 1.2), num(-22, -5 + i * 17, String(i + 1), 8, C.white), line(`M-12 ${-10 + i * 17} L22 ${-10 + i * 17} M-12 ${-4 + i * 17} L12 ${-4 + i * 17}`, C.grey, 1.6))))),
  // schack: the chequered board with kings, a rook and pawns
  'boardg.schack': all(checker(16, 18, 8, 11), at(27, 37, 0.55, cRook(BK)), at(60, 39, 0.6, cKing(BK)), at(38, 49, 0.5, cPawn(BK)), at(71, 49, 0.5, cPawn(BK)), at(93, 38, 0.55, cKnight(BK)),
    at(49, 83, 0.5, cPawn(WH)), at(82, 83, 0.5, cPawn(WH)), at(60, 104, 0.6, cKing(WH)), at(93, 104, 0.55, cRook(WH)), at(38, 94, 0.55, cQueen(WH))),
  // ingå: the opened box and what comes with it – a tick at each thing
  'boardg.ingå': all(turn(60, 18, -5, rect(-42, -12, 84, 24, C.red, 3, C.ink, 1.8), rect(-42, 6, 84, 6, '#a33', 0, C.ink, 1.2), star(0, -3, 7)), rect(6, 40, 108, 68, '#b9483f', 5, C.ink, 2), rect(12, 46, 96, 56, C.beige, 3, C.ink, 1.4),
    trackBoard(18, 52, 40, 30, 10), die(76, 60, 15, 5, -8), die(94, 64, 15, 2, 10), at(72, 98, 0.7, pawn(C.red)), at(86, 98, 0.7, pawn(C.denim)), at(100, 98, 0.7, pawn(C.green)),
    appear('bg-inga1', 10, check(38, 90, 0.8)), appear('bg-inga2', 35, check(62, 68, 0.8)), appear('bg-inga3', 60, check(58, 96, 0.8))),
  // sakna (inte ha): four places in the box, the fourth is empty
  'boardg.sakna.2': all(rect(8, 44, 104, 58, '#b9483f', 6, C.ink, 2), rect(14, 50, 92, 46, C.beige, 4, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => ellipse(27 + i * 22, 88, 9, 3.4, '#d9c7a4', null)),
    at(27, 88, 1.15, pawn(C.red)), at(49, 88, 1.15, pawn(C.denim)), at(71, 88, 1.15, pawn(C.green)),
    waPulse('bg-sakna', at(93, 88, 1.15, `<path d="M-9 0 L9 0 C9 -5 4 -8 3.4 -17 L-3.4 -17 C-4 -8 -9 -5 -9 0 Z" fill="none" stroke="${HL}" stroke-width="1.8" stroke-dasharray="3 2.4"/><circle cx="0" cy="-21" r="6.4" fill="none" stroke="${HL}" stroke-width="1.8" stroke-dasharray="3 2.4"/>`), num(93, 34, '?', 26, HL)), line('M93 38 L93 46', HL, 2.4)),
};

const M2: Record<string, Svg> = {
  // tärningsspel: five dice on the table (the cup and the pad are only hinted at)
  'boardg.tärningsspel': all(felt(), die(30, 46, 24, 6, -10), die(62, 38, 24, 3, 8), die(92, 54, 24, 5, -6), die(42, 82, 24, 2, 14), die(78, 88, 24, 4, -12)),
  // slå (tärning): the hand lets go and the dice tumble out
  'boardg.slå.2': all(wood(92), arm([0, 6], [30, 36], C.sky), hand(36, 42, 1.5, 42), line('M44 52 Q58 54 66 70 M52 44 Q74 44 88 58', C.grey, 1.6, '3 4'),
    moving('bg-sla1', '0%{transform:translate(-30px,-34px) rotate(-220deg);opacity:.3}60%,100%{transform:translate(0,0) rotate(0);opacity:1}', { dur: 2.2, spin: true }, die(64, 82, 22, 4, 12)),
    moving('bg-sla2', '0%,10%{transform:translate(-44px,-30px) rotate(-260deg);opacity:.3}70%,100%{transform:translate(0,0) rotate(0);opacity:1}', { dur: 2.2, spin: true }, die(94, 76, 22, 6, -16)),
    line('M76 100 L84 100 M104 96 L112 96', C.grey, 1.6)),
  // prick: one of the dots on a die
  'boardg.prick': all(rect(16, 22, 78, 78, C.white, 14, C.ink, 2.2), ...[[36, 42], [74, 42], [36, 80], [74, 80]].map(([x, y]) => circle(x!, y!, 7, C.grey, null)), circle(55, 61, 8.4, HL, C.ink, 1.6), circle(55, 61, 15, 'none', HL, 2.4), arrow(106, 16, 70, 48, HL, 3)),
  // sexa: the face with six pips
  'boardg.sexa': all(faded(die(20, 96, 20, 1, -10), die(100, 96, 20, 3, 12)), die(56, 58, 60, 6, 0, C.white, HL), rect(22, 24, 68, 68, 'none', 14, HL, 2.6), circle(100, 22, 12, C.white, C.ink, 1.6), num(100, 28, '6', 17, HL)),
  // tärningsbägare: the cup with dice in it
  'boardg.tärningsbägare': all(ellipse(60, 106, 36, 4.4, C.grey2, null), die(47, 30, 17, 4, -16), die(70, 27, 17, 2, 14), path('M34 36 L86 36 L78 102 C70 106 50 106 42 102 Z', C.brown, C.ink, 2.2), ellipse(60, 36, 26, 7, '#6e4526', C.ink, 2),
    line('M38 48 L82 48 M41 92 L79 92', C.tan, 1.6, '3 3'), die(100, 98, 16, 5, 18)),
  // slå om: three dice are kept, two are thrown again
  'boardg.slå-om.2': all(die(26, 30, 22, 6, 0), die(52, 30, 22, 6, 0), die(78, 30, 22, 6, 0), line('M12 46 L92 46', C.grey, 2), at(102, 34, 1, rect(-6, -2, 12, 10, C.grey, 2, C.ink, 1.3), line('M-3.4 -2 L-3.4 -6 C-3.4 -11 3.4 -11 3.4 -6 L3.4 -2', C.ink, 1.6)),
    moving('bg-om1', '0%{transform:rotate(-180deg)}55%,100%{transform:rotate(0)}', { dur: 2.2, spin: true }, die(42, 84, 24, 2, 12)), moving('bg-om2', '0%{transform:rotate(200deg)}60%,100%{transform:rotate(0)}', { dur: 2.2, spin: true }, die(78, 86, 24, 4, -14)),
    line('M20 98 A42 26 0 1 1 98 104', HL, 3), path('M98 104 L100 94 L107 101 Z', HL, HL, 1.4)),
  // tur (lycka): a four-leaf clover, and the die lands on the six that was needed
  'boardg.tur': all(clover4(36, 42, 1.5), line('M70 30 Q84 34 86 50', C.grey, 1.8, '3 4'), die(84, 78, 36, 6, -8, C.white, HL), sparkle(108, 54, 6), sparkle(62, 96, 5), sparkle(110, 100, 4), sparkle(64, 62, 4)),
  // flytta (sak): the hand moves the pawn to a new square
  'boardg.flytta.3': all(trackRow(8, 84, 5, 21), faded(at(18, 100, 1, pawn(C.red))), line('M22 62 Q52 30 84 58', HL, 3), path('M84 58 L74 56 L80 49 Z', HL, HL, 1.4),
    slide('bg-flytta', -62, 0, 2.6, at(92, 100, 1, pawn(C.red)), arm([118, 30], [96, 68], C.sky))),
  // steg: one step – the front foot moves forward
  'boardg.steg': all(line('M4 104 L116 104', C.grey2, 2), line('M52 2 L40 92', C.ink, 13), line('M52 2 L40 92', C.navy, 10), path('M30 92 L50 92 L54 102 L30 102 Z', C.white, C.ink, 1.8),
    slide('bg-steg', -34, 0, 2.4, line('M60 2 L82 92', C.ink, 13), line('M60 2 L82 92', C.navy, 10), path('M72 92 L92 92 L98 102 L72 102 Z', C.white, C.ink, 1.8)),
    line('M42 112 L86 112 M42 108 L42 116 M86 108 L86 116', HL, 2.8)),
  // hamna: the pawn ends up on the red square
  'boardg.hamna': all(die(22, 26, 22, 4, -8), trackRow(8, 84, 5, 21, 3), line('M18 78 Q29 62 40 78 M40 78 Q50 62 61 78 M61 78 Q71 62 82 78', C.grey, 1.8, '3 3'),
    moving('bg-hamna', '0%,10%{transform:translate(-63px,0)}30%{transform:translate(-42px,0)}50%{transform:translate(-21px,0)}75%,100%{transform:translate(0,0)}', { dur: 3 }, at(81.5, 100, 1, pawn(C.denim))),
    line('M70 54 L64 46 M82 50 L82 40 M94 54 L100 46', HL, 2.6), num(104, 34, '!', 24, HL)),
  // poängblock: the pad where the points are written
  'boardg.poängblock': all(pad(22, 10, 62, 98, 6), ...[1, 2, 3, 4, 5, 6].map((n, i) => die(34, 25.5 + i * 15, 9, n, 0)), num(57, 29, '3', 9, C.navy), num(57, 44, '6', 9, C.navy), num(57, 74, '12', 9, C.navy), num(75, 44, '4', 9, C.navy), num(75, 59, '9', 9, C.navy), pencil(98, 60, 24, 1.3)),
  // räkna ihop: the numbers are added and the total appears
  'boardg.räkna-ihop': all(rect(20, 8, 66, 100, C.white, 4, C.ink, 2), num(62, 30, '12', 16), num(62, 50, '8', 16), num(62, 70, '15', 16), num(34, 50, '+', 15, C.grey), num(34, 70, '+', 15, C.grey), line('M28 78 L78 78', C.ink, 2.4),
    waGrow('bg-ihop', num(56, 100, '= 35', 18, HL)), pencil(102, 56, 20, 1.3)),
};


const M3: Record<string, Svg> = {
  // kort (i kortspel): playing cards, one in front
  'boardg.kort.2': all(pc(34, 64, -18, 'c', '5', 36, 52), pc(86, 64, 18, 's', '9', 36, 52), pc(60, 56, 0, 'h', '7', 38, 56, HL)),
  // kortspel: four players round a table with their cards, a pile in the middle
  'boardg.kortspel': all(felt(10, 100), seat(60, 12, C.red), seat(10, 60, C.green, '#8a5a2b'), seat(110, 60, C.denim, '#c9a227'),
    cb(50, 26, -8, 12, 17), cb(60, 25, 0, 12, 17), cb(70, 26, 8, 12, 17), cb(24, 50, 82, 12, 17), cb(23, 60, 90, 12, 17), cb(24, 70, 98, 12, 17), cb(96, 50, -82, 12, 17), cb(97, 60, -90, 12, 17), cb(96, 70, -98, 12, 17),
    cb(48, 58, 0, 16, 23), pc(64, 56, -10, 'd', '4', 16, 23), pc(72, 60, 12, 'c', '8', 16, 23),
    pc(40, 96, -22, 'h', '2', 20, 28), pc(54, 91, -8, 's', '6', 20, 28), pc(68, 91, 8, 'd', '9', 20, 28), pc(82, 96, 22, 'c', '3', 20, 28), circle(34, 108, 5, C.skin, C.ink, 1.3), circle(88, 108, 5, C.skin, C.ink, 1.3)),
  // blanda (kort): two halves of the deck are pushed into each other
  'boardg.blanda.2': all(
    moving('bg-bl1', '0%,100%{transform:translate(-9px,0)}50%{transform:translate(0,0)}', { dur: 1.4 }, turn(40, 56, 16, ...[0, 1, 2, 3, 4].map((i) => rect(-22, -22 + i * 5, 44, 30, C.white, 3, C.ink, 1.3)), cb(0, 6, 90, 30, 44)), arm([2, 104], [26, 76], C.sky)),
    moving('bg-bl2', '0%,100%{transform:translate(9px,0)}50%{transform:translate(0,0)}', { dur: 1.4 }, turn(80, 56, -16, ...[0, 1, 2, 3, 4].map((i) => rect(-22, -22 + i * 5, 44, 30, C.white, 3, C.ink, 1.3)), cb(0, 6, 90, 30, 44)), arm([118, 104], [94, 76], C.sky)),
    line('M60 16 L60 26 M50 18 L53 27 M70 18 L67 27', HL, 2.4), line('M40 100 L52 100 M68 100 L80 100', C.grey, 1.8), path('M52 100 L46 96 L46 104 Z M68 100 L74 96 L74 104 Z', C.grey, C.grey, 1)),
  // dela ut: the cards fly from the dealer to each player
  'boardg.dela-ut': all(felt(8, 104), arm([60, 0], [60, 18], C.sky), ...[0, 1, 2].map((i) => rect(46 - i, 20 - i * 1.6, 28, 20, '#3c6db0', 3, C.ink, 1.3)),
    line('M52 42 L28 76 M60 44 L60 80 M68 42 L92 76', C.grey, 1.6, '3 4'),
    cb(20, 92, -14, 18, 25), cb(60, 96, 0, 18, 25), cb(100, 92, 14, 18, 25),
    slide('bg-dela1', 30, -52, 2.6, cb(26, 88, -4, 18, 25)), moving('bg-dela2', '0%,25%{transform:translate(0,-56px)}70%,100%{transform:translate(0,0)}', { dur: 2.6 }, cb(66, 92, 8, 18, 25)), moving('bg-dela3', '0%,40%{transform:translate(-30px,-52px)}85%,100%{transform:translate(0,0)}', { dur: 2.6 }, cb(106, 88, 22, 18, 25)),
    path('M30 70 L24 80 L36 78 Z M60 74 L55 84 L65 84 Z M90 70 L84 78 L96 80 Z', HL, HL, 1.2)),
  // giv: the cards one player has been given for this round – a fan of cards in one hand
  'boardg.giv': all(...[0, 1, 2, 3, 4].map((i) => { const a = -36 + i * 18, r = (a * Math.PI) / 180; return pc(+(60 + 50 * Math.sin(r)).toFixed(1), +(100 - 50 * Math.cos(r)).toFixed(1), a, (['c', 'h', 's', 'd', 'c'] as Suit[])[i]!, ['3', '8', '5', '2', '9'][i]!, 28, 42); }),
    path('M40 14 A62 62 0 0 1 80 14', 'none', HL, 3), line('M14 34 L10 26 M106 34 L110 26', HL, 3), rect(48, 106, 24, 14, C.sky, 2, C.ink, 2), path('M44 92 C44 84 52 82 60 84 C70 82 78 86 78 94 L76 104 C74 110 48 110 46 104 Z', C.skin, C.ink, 2), line('M54 88 L54 98 M62 87 L62 98 M70 89 L70 98', C.skin2, 1.5)),
  // färg (i kortspel): the four groups of cards
  'boardg.färg.4': all(...(['h', 's', 'd', 'c'] as Suit[]).map((k, i) => all(pc(21 + i * 26, 32, 0, k, '2', 20, 28), pc(21 + i * 26, 46, 0, k, '5', 20, 28), pc(21 + i * 26, 60, 0, k, '9', 20, 28),
    line(`M${11 + i * 26} 82 L${31 + i * 26} 82 M${11 + i * 26} 78 L${11 + i * 26} 82 M${31 + i * 26} 78 L${31 + i * 26} 82`, HL, 2.6), suit(k, 21 + i * 26, 98, 8)))),
  'boardg.hjärter': suitMotif('h', ['2', '5', '9']),
  'boardg.spader': suitMotif('s', ['3', '6', '8']),
  'boardg.ruter': suitMotif('d', ['4', '7', '9']),
  'boardg.klöver.2': suitMotif('c', ['2', '6', '8']),
  // ess: the cards with one single sign, one of each suit
  'boardg.ess': all(pc(26, 66, -24, 'c', '', 34, 50), pc(48, 58, -8, 'd', '', 34, 50), pc(72, 58, 8, 's', '', 34, 50), pc(94, 66, 24, 'h', '', 34, 50), circle(60, 16, 9, C.white, HL, 2.2), num(60, 21, '1', 13, HL)),
  // joker: the extra card with the jester
  'boardg.joker': all(rect(26, 8, 68, 104, C.white, 8, C.ink, 2.2), star(36, 20, 5), star(84, 100, 5),
    path('M40 52 C30 40 30 26 38 22 C44 32 50 36 56 38 C54 28 56 18 60 14 C64 18 66 28 64 38 C70 36 76 32 82 22 C90 26 90 40 80 52 Z', C.red, C.ink, 1.8), path('M56 38 C54 28 56 18 60 14 C64 18 66 28 64 38 Z', C.green, C.ink, 1.8),
    circle(38, 21, 3.4, C.gold, C.ink, 1.2), circle(60, 13, 3.4, C.gold, C.ink, 1.2), circle(82, 21, 3.4, C.gold, C.ink, 1.2),
    circle(60, 62, 15, C.skin, C.ink, 1.8), circle(54, 60, 1.8, C.ink, null), circle(66, 60, 1.8, C.ink, null), path('M51 66 Q60 77 69 66 Z', C.white, C.ink, 1.4), circle(60, 65, 2.4, C.red, C.ink, 1),
    path('M40 82 L46 76 L53 84 L60 76 L67 84 L74 76 L80 82 L76 96 L44 96 Z', C.yellow, C.ink, 1.8), circle(46, 96, 2.4, C.gold, C.ink, 1), circle(60, 97, 2.4, C.gold, C.ink, 1), circle(74, 96, 2.4, C.gold, C.ink, 1)),
  // baksida: the same card from the front (grey) and from the back
  'boardg.baksida': all(faded(pc(30, 62, -6, 'h', '7', 36, 52)), cb(86, 62, 6, 38, 54), turn(86, 62, 6, rect(-22, -30, 44, 60, 'none', 6, HL, 2.8)), line('M36 22 Q58 4 80 22', HL, 3), path('M80 22 L70 21 L76 13 Z', HL, HL, 1.4)),
  // stick: one card from each player lies in the middle, and a hand pulls the four together to its own pile
  'boardg.stick.2': all(felt(8, 104), seat(60, 10, C.red), seat(8, 52, C.green, '#8a5a2b'), seat(112, 52, C.denim, '#c9a227'), line('M60 20 L60 26 M20 52 L28 52 M100 52 L92 52', C.grey, 1.8, '2 3'),
    pc(60, 40, 0, 'c', '4', 20, 28), pc(42, 54, -78, 'd', '7', 20, 28), pc(78, 54, 78, 'c', '2', 20, 28), pc(60, 66, 8, 'h', '9', 20, 28), ellipse(60, 54, 36, 30, 'none', HL, 2.6),
    arm([92, 118], [70, 76], C.purple, [88, 96]), line('M48 84 L40 96', HL, 3.4), path('M38 100 L37 90 L46 95 Z', HL, HL, 1.4), cb(34, 106, 84, 13, 19), cb(31, 103, 88, 13, 19)),
  // patiens: one person alone with the cards laid out in rows
  'boardg.patiens': all(felt(30, 82), bust(60, 14, 0.85, { top: C.purple, hs: 'bun', hair: C.grey, face: 'smile' }), cb(18, 46, 0, 13, 18), pc(100, 46, 0, 's', '', 13, 18),
    ...[0, 1, 2, 3, 4].flatMap((c) => Array.from({ length: c + 1 }, (_, r) => (r === c ? pc(24 + c * 18, 66 + r * 6, 0, (['h', 'c', 'd', 's', 'h'] as Suit[])[c]!, '', 14, 19) : cb(24 + c * 18, 66 + r * 6, 0, 14, 19))))),
  // tjuvkika: he leans over and looks at her cards
  'boardg.tjuvkika': all(wood(96), bust(88, 44, 1.3, { top: C.red, hs: 'long', hair: '#8a5a2b', face: 'flat', look: 1.4 }), pc(78, 84, -16, 'h', '7', 18, 26), pc(90, 80, 0, 's', '3', 18, 26), pc(102, 84, 16, 'd', '9', 18, 26),
    moving('bg-kika', '0%,100%{transform:translate(-8px,2px) rotate(-6deg)}45%,70%{transform:translate(0,0) rotate(0)}', { dur: 2.6, spin: true }, turn(34, 50, 14, bust(0, 0, 1.3, { top: C.green, face: 'o', look: 2.4 })), cb(18, 88, -12, 16, 23), cb(30, 86, 0, 16, 23)),
    line('M50 52 L76 74', HL, 2.6, '4 4'), path('M76 74 L67 72 L72 65 Z', HL, HL, 1.2)),
};

const M4: Record<string, Svg> = {
  // tur (i en ordning): one player is in the spotlight with the die, the others wait
  'boardg.tur.2': all(bust(18, 66, 0.9, { grey: true, face: 'flat' }), bust(102, 66, 0.9, { grey: true, face: 'flat' }), at(18, 40, 0.34, hourglass(0, 0, 1)), at(102, 40, 0.34, hourglass(0, 0, 1)),
    path('M38 112 L48 26 L72 26 L82 112 Z', '#fbe9a8', null), arm([74, 78], [86, 62], C.denim, [84, 78]), die(88, 52, 15, 5, 10), bust(60, 58, 1.5, { top: C.denim, face: 'smile' }), path('M50 10 L70 10 L60 24 Z', HL, C.ink, 1.6)),
  // turordning: who is first, second, third and fourth
  'boardg.turordning.2': all(bust(18, 34, 0.8, { top: C.red, hs: 'long' }), bust(46, 34, 0.8, { top: C.green, hair: '#8a5a2b' }), bust(74, 34, 0.8, { top: C.denim, hs: 'bun', hair: '#c9a227' }), bust(102, 34, 0.8, { top: C.purple }),
    ...[0, 1, 2, 3].map((i) => all(circle(18 + i * 28, 84, 10, HL, C.ink, 1.6), num(18 + i * 28, 89.5, String(i + 1), 14, C.white))), ...[0, 1, 2].map((i) => all(line(`M${30 + i * 28} 84 L${33 + i * 28} 84`, C.ink, 2.2), path(`M${36 + i * 28} 84 L${32 + i * 28} 80.5 L${32 + i * 28} 87.5 Z`, C.ink, C.ink, 1)))),
  // omgång: once round the table – everybody has done the same thing one time
  'boardg.omgång': all(roundTable(60, 64, 22), seat(60, 28, C.red), seat(96, 64, C.green, '#8a5a2b'), seat(60, 100, C.denim, '#c9a227'), seat(24, 64, C.purple),
    path('M52 12 A50 50 0 1 0 60 10', 'none', HL, 3.2), path('M62 10 L52 5 L53 16 Z', HL, HL, 1.4), ...[[60, 44], [80, 64], [60, 84], [40, 64]].map(([x, y]) => check(x!, y!, 0.55)),
    rect(4, 4, 12, 12, HL, 2, C.ink, 1.4), rect(4, 19, 12, 12, C.white, 2, C.grey, 1.4), rect(4, 34, 12, 12, C.white, 2, C.grey, 1.4)),
  // drag: one move – the piece goes from one square to another
  'boardg.drag': all(checker(14, 14, 4, 23), faded(at(48.5, 100, 1.1, cRook(WH))), at(48.5, 52, 1.1, cRook(WH)), arrow(48.5, 84, 48.5, 60, HL, 4), circle(96, 96, 10, C.white, HL, 2.2), num(96, 101.5, '1', 14, HL)),
  // stå över: the one in the middle sits out while the die goes past
  'boardg.stå-över': all(bust(18, 62, 0.95, { top: C.red, hs: 'long' }), bust(102, 62, 0.95, { top: C.denim, hair: '#8a5a2b' }), bust(60, 62, 1.15, { grey: true, face: 'flat' }), line('M46 88 L74 96 M74 88 L46 96', C.ink, 6.6), line('M46 88 L74 96 M74 88 L46 96', C.grey, 4.4),
    waPulse('bg-over', circle(60, 28, 11, HL, C.ink, 1.6), line('M56 22 L56 34 M64 22 L64 34', C.white, 3.4)),
    line('M20 40 Q60 -14 98 38', C.ink, 2, '4 4'), path('M100 40 L90 38 L96 30 Z', C.ink, C.ink, 1.2), die(24, 38, 12, 3, -10)),
  // gälla (regler): the same rule holds for every player
  'boardg.gälla': all(appear('bg-galla', 15, line('M60 34 L18 70 M60 34 L46 70 M60 34 L74 70 M60 34 L102 70', HL, 2.8)), circle(60, 22, 17, '#fde9d8', HL, 3), num(60, 31, '§', 24, C.navy),
    bust(18, 82, 0.75, { top: C.red, hs: 'long' }), bust(46, 82, 0.75, { top: C.green }), bust(74, 82, 0.75, { top: C.denim, hs: 'bun', hair: '#c9a227' }), bust(102, 82, 0.75, { top: C.purple, hair: '#8a5a2b' }),
    ...[18, 46, 74, 102].map((x) => num(x, 68, '§', 9, HL))),
  // husregel: the family's own rule, under their own roof
  'boardg.husregel': all(path('M12 54 L60 10 L108 54 Z', HL, C.ink, 2.2), rect(20, 54, 80, 54, '#f7efdc', 2, C.ink, 2.2), rect(84, 16, 9, 18, HL, 1, C.ink, 1.8), paper(40, 60, 40, 44, 2), die(28, 96, 12, 4, -10), at(92, 104, 0.6, pawn(C.denim))),
  // dra lott: one stick is drawn from the hand; chance decides
  'boardg.dra-lott': all(...[38, 50, 72].map((x) => rect(x - 2.4, 30, 4.8, 50, C.tan, 2, C.ink, 1.3)),
    moving('bg-lott', '0%,15%{transform:translate(0,22px)}65%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(58.6, 2, 4.8, 52, C.tan, 2, C.ink, 1.3), rect(58.6, 36, 4.8, 18, C.red, 2, C.ink, 1.3), arm([104, 0], [66, 10], C.green, [92, 4])),
    path('M26 66 C26 58 34 56 40 58 L80 58 C90 58 92 66 92 74 L92 92 C92 102 84 104 74 104 L40 104 C30 104 26 96 26 88 Z', C.skin, C.ink, 2), line('M42 62 L42 76 M54 62 L54 78 M66 62 L66 78 M78 62 L78 76', C.skin2, 1.6), path('M26 104 L26 120 L80 120 L80 104 Z', C.sky, C.ink, 2),
    num(22, 34, '?', 22, HL)),
  // minuspoäng: points that are taken away
  'boardg.minuspoäng': all(pad(12, 12, 62, 92, 4), num(48, 38, '+10', 13, C.grey), num(48, 59, '+4', 13, C.grey), rect(15, 66, 56, 19, '#fde3dc', 2, C.red, 2.2), num(48, 81, '−5', 15, C.red), arrow(94, 30, 94, 66, C.red, 4.4), bust(94, 86, 0.75, { top: C.grey, face: 'sad' })),
};

const M5: Record<string, Svg> = {
  // samarbetsspel: everybody's hands meet over one board
  'boardg.samarbetsspel': all(trackBoard(22, 30, 76, 60, 10.8), at(46, 54, 0.55, pawn(C.red)), at(56, 54, 0.55, pawn(C.denim)), at(66, 54, 0.55, pawn(C.green)), at(76, 54, 0.55, pawn(C.yellow)),
    arm([2, 6], [53, 66], C.red), arm([118, 6], [67, 66], C.denim), arm([2, 114], [55, 74], C.green), arm([118, 114], [65, 74], C.yellow), sparkle(60, 60, 6, HL), line('M50 82 L46 88 M60 84 L60 91 M70 82 L74 88', HL, 2.4)),
  // medspelare: the one on your own side – shoulder to shoulder, same colour
  'boardg.medspelare': all(arm([56, 62], [60, 40], C.green, [50, 50]), arm([64, 62], [61, 39], C.green, [70, 50]), bust(34, 58, 1.35, { top: C.green, hs: 'long', face: 'grin' }), bust(86, 58, 1.35, { top: C.green, hair: '#8a5a2b', face: 'grin' }),
    circle(86, 58, 19, 'none', HL, 2.8), line('M52 30 L48 24 M60 28 L60 20 M68 30 L72 24', HL, 2.4), path('M26 84 L34 80 L42 84 L40 94 L34 98 L28 94 Z', C.yellow, C.ink, 1.3), path('M78 84 L86 80 L94 84 L92 94 L86 98 L80 94 Z', C.yellow, C.ink, 1.3)),
  // motspelare: the one on the other side of the board
  'boardg.motspelare': all(bust(22, 30, 1.1, { top: C.denim, face: 'think', look: 1.6 }), bust(98, 30, 1.1, { top: C.red, hs: 'bun', hair: '#8a5a2b', face: 'think', look: -1.6 }), circle(98, 30, 16, 'none', HL, 2.8),
    checker(30, 72, 6, 10, 3), at(40, 90, 0.6, cKing(WH)), at(50, 100, 0.55, cPawn(WH)), at(80, 82, 0.6, cKing(BK)), at(70, 92, 0.55, cPawn(BK)), path('M62 26 L54 44 L60 44 L56 60 L68 40 L61 40 L66 26 Z', C.yellow, C.ink, 1.5)),
  // mot varandra: two teams on each side of the table, playing against each other
  'boardg.mot-varandra': all(bust(34, 14, 0.8, { top: C.red, hs: 'long', face: 'think' }), bust(86, 14, 0.8, { top: C.red, hair: '#8a5a2b', face: 'think' }), rect(8, 44, 104, 30, C.tan, 5, C.ink, 2),
    bust(34, 86, 0.8, { top: C.denim, hs: 'bun', hair: '#c9a227', face: 'think' }), bust(86, 86, 0.8, { top: C.denim, face: 'think' }),
    arrow(26, 47, 26, 70, C.red, 4.4), arrow(78, 47, 78, 70, C.red, 4.4), arrow(42, 71, 42, 48, C.denim, 4.4), arrow(94, 71, 94, 48, C.denim, 4.4), die(60, 59, 13, 3, 10)),
  // slå (vinna över): the game is over – the loser's king falls
  'boardg.slå.3': all(arm([40, 62], [52, 30], C.red), bust(26, 48, 1.3, { top: C.red, hs: 'long', face: 'grin' }), bust(96, 52, 1.2, { grey: true, face: 'sad' }), checker(28, 88, 8, 8, 3), at(44, 102, 0.75, cKing(WH)),
    moving('bg-sla3', '0%,25%{transform:rotate(-78deg)}70%,100%{transform:rotate(0)}', { dur: 2.6, spin: true }, turn(80, 102, 80, at(0, 8, 0.75, cKing(BK)))), star(58, 22, 8), sparkle(70, 34, 4)),
  // leda: one pawn is ahead of the others
  'boardg.leda.2': all(rect(8, 12, 46, 24, C.dark, 4, C.ink, 1.8), num(22, 30, '12', 15, HL), num(31.5, 29, '–', 12, C.white), num(42, 30, '8', 15, C.grey2),
    trackRow(6, 54, 6, 18), trackRow(6, 86, 6, 18), at(33, 68, 0.75, pawn(C.grey)), slide('bg-leda', -18, 0, 2.2, at(87, 100, 0.95, pawn(HL))), line('M33 80 L33 112 M87 46 L87 78', C.grey, 1.4, '3 3'), line('M37 110 L83 110', HL, 2.6), path('M83 110 L76 106 L76 114 Z', HL, HL, 1.2), star(104, 24, 9)),
  // revansch: he lost (small, grey) and now they play again
  'boardg.revansch': all(faded(rect(6, 6, 46, 40, C.white, 5, C.ink, 1.6), bust(18, 20, 0.6, { face: 'sad' }), bust(40, 20, 0.6, { top: C.red, face: 'grin' }), star(40, 9, 4)),
    line('M56 26 Q84 22 86 42', HL, 3.2), path('M86 44 L80 35 L91 36 Z', HL, HL, 1.4), circle(100, 20, 10, C.white, HL, 2.2), num(100, 25.5, '2', 14, HL),
    arm([42, 96], [58, 78], C.sky, [54, 96]), bust(28, 76, 1.2, { face: 'angry' }), bust(96, 78, 1.1, { top: C.red, face: 'smile' }), die(62, 68, 13, 6, 8)),
  // partyspel: a party – hats, confetti, laughter and a drawing to guess
  'boardg.partyspel': all(...[[12, 14, C.red], [30, 8, C.yellow], [52, 14, C.green], [74, 8, C.sky], [96, 14, C.purple], [108, 30, C.orange], [8, 40, C.green], [64, 24, C.pink]].map(([x, y, c]) => rect(x as number, y as number, 4, 4, c as string, 1, null)),
    bust(24, 62, 1.05, { top: C.red, hs: 'long', face: 'grin' }), bust(96, 62, 1.05, { top: C.denim, face: 'open' }), bust(60, 56, 1.2, { top: C.green, hair: '#8a5a2b', face: 'grin' }),
    path('M17 52 L24 32 L31 52 Z', C.yellow, C.ink, 1.4), path('M53 44 L60 22 L67 44 Z', C.pink, C.ink, 1.4), path('M89 52 L96 32 L103 52 Z', C.mint, C.ink, 1.4), circle(24, 31, 2.4, C.red, null), circle(60, 21, 2.4, C.sky, null), circle(96, 31, 2.4, C.orange, null),
    rect(44, 88, 32, 22, C.white, 3, C.ink, 1.8), line('M50 104 C52 92 58 92 60 98 C62 104 68 104 70 94', C.navy, 1.8), at(102, 104, 0.3, hourglass(0, 0, 1))),
  // frågespel: question cards – right or wrong
  'boardg.frågespel': all(turn(54, 56, -8, rect(-24, -32, 52, 68, C.grey2, 5, C.ink, 1.4), rect(-28, -36, 52, 68, C.white, 5, C.ink, 2), rect(-28, -36, 52, 14, C.sky, 5, C.ink, 2), num(-2, 14, '?', 46, HL)),
    check(98, 34, 1.2), circle(98, 64, 10.8, C.red, C.ink, 1.4), line('M93 59 L103 69 M103 59 L93 69', C.white, 2.8), bulb(98, 102, 0.8)),
  // tävlingsmänniska: she always wants to win
  'boardg.tävlingsmänniska': all(bubble(66, 4, 48, 40, [62, 52], trophy(90, 24, 1.3), num(90, 20.5, '1', 9, C.ink)), arm([36, 84], [22, 56], C.red, [16, 76]), arm([72, 84], [88, 58], C.red, [92, 78]),
    bust(54, 60, 1.6, { top: C.red, hs: 'bun', face: 'angry' }), path('M38 49 L70 49 L70 54 L38 54 Z', C.white, C.ink, 1.3), circle(54, 51.5, 2, C.red, null), path('M30 44 C28 48 32 50 32 46 Z M78 42 C76 46 80 48 80 44 Z', C.sky, C.ink, 0.9)),
  // dålig förlorare: he loses and throws the board in the air
  'boardg.dålig-förlorare': all(turn(40, 34, -28, trackBoard(-26, -18, 52, 36, 9)), at(20, 66, 0.6, pawn(C.red)), turn(78, 22, 40, at(0, 0, 0.6, pawn(C.denim))), die(94, 40, 12, 3, 30), die(12, 22, 11, 5, -20),
    arm([60, 84], [48, 56], C.grey, [44, 78]), arm([92, 84], [106, 58], C.grey, [110, 78]), bust(76, 62, 1.5, { top: C.grey, face: 'angry', skin: '#ee9a86' }), line('M62 30 C58 26 64 24 60 20 M90 30 C94 26 88 24 92 20', C.ink, 2)),
};

const M6: Record<string, Svg> = {
  // strategispel: a game where one plans – the player thinks out the way ahead
  'boardg.strategispel': all(bubble(44, 4, 70, 46, [36, 56], circle(56, 28, 4, C.grey, null), line('M60 28 L74 28 M74 28 L88 16 M74 28 L88 40', C.ink, 2), path('M88 16 L82 16 L86 21 Z M88 40 L86 35 L82 40 Z', C.ink, C.ink, 1), circle(96, 14, 5, C.white, C.grey, 1.4), cross(96, 14, 0.55), circle(98, 40, 6.4, HL, C.ink, 1.3), star(98, 40, 4, C.white)),
    bust(22, 64, 1.1, { top: C.purple, face: 'think' }), arm([34, 90], [28, 78], C.purple, [40, 86]), checker(46, 72, 6, 11, 3), at(57, 92, 0.6, cRook(WH)), at(79, 81, 0.6, cKnight(BK)), at(101, 103, 0.6, cKing(WH))),
  // motdrag: the opponent's move (grey, 1) threatens the king; the answer (orange, 2) blocks it
  'boardg.motdrag': all(checker(14, 14, 4, 23), faded(at(25.5, 35, 0.8, cRook(BK))), arrow(25.5, 34, 25.5, 46, C.grey, 4.4), at(25.5, 81, 0.8, cRook(BK)), line('M36 71 L60 71', C.grey, 2.4, '4 4'),
    circle(42, 28, 8, C.white, C.grey, 1.8), num(42, 32.5, '1', 11, C.grey), at(94.5, 81, 0.8, cKing(WH)),
    faded(at(71.5, 104, 0.8, cRook(WH))), at(71.5, 81, 0.8, cRook(WH)), arrow(84, 104, 76, 86, HL, 4.4), line('M62 60 L62 82', HL, 4.4), circle(98, 100, 9, HL, C.ink, 1.6), num(98, 105, '2', 13, C.white)),
  // ligga steget före: always one step ahead – she already knows where he will go
  'boardg.ligga-steget-före': all(...[0, 1, 2, 3, 4].map((i) => ellipse(14 + i * 23, 100, 10, 4, C.grey2, C.ink, 1.2)), bubble(58, 6, 56, 34, [80, 52], faded(at(74, 34, 0.55, pawn(C.grey))), line('M82 26 L96 26', C.ink, 2, '3 2'), path('M100 26 L94 22 L94 30 Z', C.ink, C.ink, 1), ellipse(104, 34, 6, 2.4, C.grey2, C.ink, 1)),
    moving('bg-fore', '0%,15%{transform:translate(-23px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.8 }, at(37, 98, 1, pawn(C.grey)), at(83, 98, 1.25, pawn(HL))),
    line('M37 112 L83 112 M37 108 L37 116 M83 108 L83 116', HL, 2.6), num(60, 90, '+1', 13, HL)),
  // fälla (för att lura): the tempting piece sits in a trap
  'boardg.fälla-noun.2': all(rect(14, 82, 92, 20, C.tan, 3, C.ink, 2), line('M24 92 L96 92', C.brown, 1), path('M30 82 C30 40 90 40 90 82', 'none', C.grey, 4), path('M30 82 C30 40 90 40 90 82', 'none', C.ink, 1.2), rect(54, 76, 12, 8, C.grey, 2, C.ink, 1.4), line('M22 82 L22 70 L60 78', C.ink, 2),
    at(60, 76, 1.05, cQueen(WH)), sparkle(44, 52, 5, HL), sparkle(78, 48, 4, HL), arm([118, 20], [92, 44], C.grey, [108, 24]), num(18, 34, '!', 26, HL)),
  // överlista: he follows the arrow the wrong way, towards a hole he does not see; she smiles
  'boardg.överlista': all(bust(26, 34, 1.1, { top: HL, hs: 'long', face: 'grin', look: 1.6 }), bulb(52, 16, 0.6), bust(84, 34, 1.1, { grey: true, face: 'smile', look: 1.8 }),
    trackRow(6, 88, 6, 18), flag(15, 100, 0.9, C.green), ellipse(105, 99, 8, 5, C.black, C.ink, 1.4), rect(40, 68, 44, 13, C.white, 3, C.ink, 1.6), path('M84 66 L98 74.5 L84 83 Z', C.white, C.ink, 1.6), line('M48 74.5 L86 74.5', HL, 3.4),
    line('M62 81 L62 88', C.ink, 2), slide('bg-list2', -36, 0, 2.8, at(87, 102, 0.75, pawn(C.grey)))),
  // bluffa: he says he has the best cards, but his hand is poor
  'boardg.bluffa': all(waPulse('bg-bluff', bubble(56, 4, 58, 44, [48, 54], pc(72, 26, -8, 's', '', 20, 28), pc(96, 26, 8, 'h', '', 20, 28), star(84, 10, 5))), bust(34, 50, 1.4, { top: C.dark, face: 'grin' }),
    rect(22, 44, 24, 7, C.black, 3, C.ink, 1.2), pc(46, 92, -18, 'c', '2', 22, 31), pc(62, 88, 0, 'd', '3', 22, 31), pc(78, 92, 18, 'c', '4', 22, 31), circle(40, 106, 5, C.skin, C.ink, 1.3)),
  // avvakta: she could move (dashed arrow) but keeps her arms folded and watches the other one make a move
  'boardg.avvakta': all(bust(30, 30, 1.25, { top: C.purple, hs: 'long', face: 'flat', look: 2.2 }), line('M14 60 L44 68 M46 60 L16 68', C.ink, 7.4), line('M14 60 L44 68 M46 60 L16 68', C.purple, 5), circle(44, 68, 3.6, C.skin, C.ink, 1.2), circle(16, 68, 3.6, C.skin, C.ink, 1.2),
    bust(96, 30, 1, { top: C.red, hair: '#8a5a2b', face: 'think', look: -1.6 }), checker(10, 84, 10, 10, 2), at(25, 100, 0.7, cPawn(WH)), `<path d="M30 80 L44 80" fill="none" stroke="${C.grey}" stroke-width="2.4" stroke-dasharray="3 3" stroke-linecap="round"/>`, path('M48 80 L42 76.5 L42 83.5 Z', C.grey, C.grey, 1),
    line('M100 76 L86 76', HL, 3.4), path('M82 76 L89 72 L89 80 Z', HL, HL, 1.2), slide('bg-avv', 20, 0, 2.6, arm([110, 58], [86, 84], C.red, [104, 72]), at(85, 100, 0.7, cPawn(BK)))),
  // schackmatt: the white king in the corner is in check from the queen, which the black king protects; both flight squares are covered
  'boardg.schackmatt': all(checker(12, 12, 4, 24), at(96, 34, 0.9, cKing(WH)), at(72, 58, 0.9, cQueen(BK)), at(48, 82, 0.9, cKing(BK)),
    line('M80 40 L89 31', C.red, 3), path('M92 28 L83 30 L90 37 Z', C.red, C.red, 1.2), line('M56 66 L64 58', C.ink, 2, '3 3'),
    cross(72, 24, 1.1), cross(96, 48, 1.1), circle(96, 24, 17, 'none', HL, 2.8)),
};

const M7: Record<string, Svg> = {
  // gå ut på: what the game is about – every pawn is on its way to the flag in the middle
  'boardg.gå-ut-på': all(rect(8, 10, 104, 100, C.beige, 6, C.ink, 2), circle(60, 60, 40, 'none', '#d9c7a4', 5), circle(60, 60, 17, '#fde9d8', HL, 3), flag(57, 72, 1),
    line('M30 34 L42 44 M90 34 L78 44 M30 90 L42 80 M90 90 L78 80', HL, 3.4), path('M46 47 L37 45 L42 38 Z M74 47 L83 45 L78 38 Z M46 77 L42 86 L37 79 Z M74 77 L78 86 L83 79 Z', HL, HL, 1.2),
    slide('bg-utpa1', -8, -8, 2.6, at(22, 34, 0.7, pawn(C.red))), slide('bg-utpa2', 8, -8, 2.6, at(98, 34, 0.7, pawn(C.denim))), slide('bg-utpa3', -8, 8, 2.6, at(22, 104, 0.7, pawn(C.green))), slide('bg-utpa4', 8, 8, 2.6, at(98, 104, 0.7, pawn(C.yellow)))),
  // gälla (det gäller att): the last throw – she needs a six, and everybody is watching
  'boardg.gälla.2': all(waPulse('bg-galla2', bubble(8, 2, 50, 32, [50, 42], die(24, 18, 18, 6, 0, C.white, HL), line('M37 18 L41 18', C.ink, 1.8), flag(48, 28, 0.75))),
    bust(16, 82, 0.85, { top: C.green, hair: '#8a5a2b', face: 'o', look: 2.4 }), bust(104, 82, 0.85, { top: C.purple, hs: 'bun', face: 'o', look: -2.4 }),
    arm([74, 82], [86, 46], C.denim, [88, 70]), die(88, 36, 16, 3, 14), line('M78 26 L74 20 M98 26 L102 20 M88 22 L88 15', HL, 2.4), bust(60, 62, 1.25, { top: C.denim, hs: 'long', face: 'think' })),
  // gå till: how the game is played – the open rule book with picture steps 1, 2, 3
  'boardg.gå-till': all(path('M6 22 C24 14 44 14 60 22 L60 106 C44 98 24 98 6 106 Z', C.white, C.ink, 2), path('M114 22 C96 14 76 14 60 22 L60 106 C76 98 96 98 114 106 Z', C.white, C.ink, 2), line('M60 22 L60 106', C.ink, 2.4),
    cb(38, 38, -8, 12, 17), cb(44, 39, 8, 12, 17), die(40, 76, 17, 5, 8), trackRow(72, 62, 2, 14), at(79, 74, 0.6, pawn(C.red)), flag(95, 74, 0.7), line('M72 40 L104 40 M72 90 L100 90', C.grey2, 2),
    appear('bg-till1', 8, circle(18, 38, 7.4, HL, C.ink, 1.4), num(18, 42, '1', 10, C.white)), appear('bg-till2', 35, circle(18, 76, 7.4, HL, C.ink, 1.4), num(18, 80, '2', 10, C.white)), appear('bg-till3', 62, circle(100, 52, 7.4, HL, C.ink, 1.4), num(100, 56, '3', 10, C.white))),
  // grundregel: the rule at the bottom that the others rest on
  'boardg.grundregel': all(rect(46, 14, 28, 22, C.white, 3, C.grey, 1.8), num(60, 30, '§', 14, C.grey), rect(28, 40, 30, 22, C.white, 3, C.grey, 1.8), num(43, 56, '§', 14, C.grey), rect(62, 40, 30, 22, C.white, 3, C.grey, 1.8), num(77, 56, '§', 14, C.grey),
    rect(8, 66, 104, 34, HL, 4, C.ink, 2.2), num(34, 91, '§', 26, C.white), line('M52 78 L100 78 M52 88 L88 88', C.white, 2.6), line('M4 104 L116 104', C.grey2, 2)),
  // provomgång: a round only to learn – nobody writes down the points
  'boardg.provomgång': all(roundTable(50, 66, 20), seat(50, 34, C.red), seat(82, 66, C.green, '#8a5a2b'), seat(50, 98, C.denim, '#c9a227'), seat(18, 66, C.purple), `<path d="M44 20 A46 46 0 1 0 52 18" fill="none" stroke="${HL}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>`, path('M54 18 L44 13 L45 24 Z', HL, HL, 1.4),
    die(50, 66, 13, 3, 10), pad(92, 6, 24, 34, 3), line('M90 4 L118 42 M118 4 L90 42', C.red, 3.4), turn(104, 60, 90, pencil(0, 0, 0, 0.8))),
  // lättlärd: one short rule, one minute, and she can play – against a thick rule book and many hours (grey)
  'boardg.lättlärd': all(line('M62 8 L62 108', C.grey2, 1.8, '4 4'), faded(bust(92, 22, 0.8, { face: 'sad' }), rect(70, 52, 34, 9, C.white, 2, C.ink, 1.4), rect(68, 61, 38, 9, C.white, 2, C.ink, 1.4), rect(70, 70, 34, 9, C.white, 2, C.ink, 1.4), rect(68, 79, 38, 9, C.white, 2, C.ink, 1.4), clockPie(98, 98, 12, 0.9, C.grey), num(76, 104, '3', 15)),
    bust(28, 22, 0.95, { top: C.green, hs: 'long', face: 'grin' }), rect(6, 54, 32, 22, C.white, 3, C.ink, 2), circle(13, 65, 4.4, HL, C.ink, 1.1), line('M21 65 L33 65', C.ink, 2.2), check(46, 62, 0.95),
    clockPie(22, 96, 13, 0.08, HL), num(46, 102, '1', 15, HL)),
  // vara med: the others wave her in and she joins the game
  'boardg.vara-med': all(wood(92), bust(66, 46, 0.95, { top: C.red, hs: 'bun', face: 'grin' }), bust(98, 50, 0.95, { top: C.denim, hair: '#8a5a2b', face: 'smile' }), arm([56, 66], [46, 44], C.red, [46, 62]), line('M42 36 L38 32 M48 34 L48 28', HL, 2.2),
    die(74, 100, 12, 4, 8), at(92, 108, 0.5, pawn(C.yellow)), `<ellipse cx="24" cy="100" rx="13" ry="4.4" fill="none" stroke="${HL}" stroke-width="2" stroke-dasharray="4 3"/>`,
    moving('bg-med', '0%,15%{transform:translate(-30px,0);opacity:.3}65%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, bust(24, 54, 1.1, { top: C.green, hs: 'long', face: 'smile' })), num(40, 20, '+1', 15, HL)),
  // ta det från början: back to number one
  'boardg.ta-det-från-början': all(...[0, 1, 2].map((i) => all(rect(8 + i * 37, 62, 30, 34, i === 0 ? '#fde9d8' : C.white, 5, i === 0 ? HL : C.ink, i === 0 ? 2.8 : 1.8), num(23 + i * 37, 86, String(i + 1), 20, i === 0 ? HL : C.grey))),
    line('M97 56 C92 12 30 12 24 46', HL, 3.6), path('M23 56 L17 44 L30 46 Z', HL, HL, 1.4), moving('bg-borjan', '0%,20%{transform:translate(74px,0)}65%,100%{transform:translate(0,0)}', { dur: 2.8 }, path('M16 100 L30 100 L23 110 Z', HL, C.ink, 1.4)), line('M42 79 L44 79 M79 79 L81 79', C.grey, 1.8)),
  // speltid (för ett spel): how long the game takes – written on the box
  'boardg.speltid.3': all(rect(6, 40, 68, 58, C.red, 5, C.ink, 2), rect(6, 86, 68, 12, '#a33', 3, C.ink, 1.6), die(26, 62, 18, 5, -8), at(52, 76, 0.75, pawn(C.yellow)),
    circle(86, 44, 27, C.white, C.ink, 2.2), path('M86 44 L86 20 A24 24 0 0 1 86 68 Z', HL, null), circle(86, 44, 27, 'none', C.ink, 2.2), line('M86 44 L86 24 M86 44 L86 62', C.ink, 2.6), circle(86, 44, 2.4, C.ink, null), num(88, 100, '30', 20, HL), line('M104 86 L104 92', HL, 2.4)),
};

export const BOARDG_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
