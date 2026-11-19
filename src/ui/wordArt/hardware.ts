/**
 * Teknik & digital värld → Datorer & internet → Datorns delar, 3711–3717 (0.54): processor and memory,
 * hard disks and storage, motherboard and ports, screens and resolution, keyboard and mouse, graphics cards
 * and troubleshooting hardware.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show
 * what the word is not. Words in a contrast pair share one layout where only the marked part differs:
 * stationär/bärbar dator (one desk with a desktop computer and a laptop), hårdvara/programvara (one computer:
 * the parts you can touch or the apps on the screen), hårddisk/SSD (big disk, small grey other disk),
 * mörkt läge (light grey phone beside a dark one), spelkonsol/handkontroll (one TV corner: the box or the
 * controller) and spelutvecklare/grafisk formgivare (one desk: game and code or a poster layout on the screen).
 * Digits, maths signs and key labels (Ctrl, C) only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, g, line, moving, path, rect, star, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SCR = '#bfe3f5';
const PCB = '#3c8a55';
const PCB2 = '#2f6f44';
const TRACE = '#7fc49a';
const NIGHT = '#26303d';
const SHROUD = '#4a4d58';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const desk = (y = 84, x1 = 6, x2 = 114) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

/** Laptop, base centre at (x, y). `scr` is drawn in local coordinates inside the screen (x −23…23, y −37…−9). */
const laptop = (x: number, y: number, s = 1, scr: Svg = '', body: string = C.silver) => at(x, y, s,
  rect(-26, -40, 52, 34, C.dark, 3, C.ink, 1.8), rect(-23, -37, 46, 28, SCR, 1, null), scr,
  path('M-32 0 L32 0 L28 -6 L-28 -6 Z', body, C.ink, 1.6), line('M-6 -3 L6 -3', C.ink, 1));
/** Three coloured app windows for a laptop screen (local coordinates). */
const apps = (cols: string[] = [C.red, C.yellow, C.green]) => all(...cols.map((c, i) => all(rect(-20 + i * 14, -34 + (i % 2) * 6, 12, 14, C.white, 1.5, C.ink, 0.8), rect(-20 + i * 14, -34 + (i % 2) * 6, 12, 3, c, 1, null))));
/** Monitor: screen with its top-left corner at (x, y), stand down to `foot`. */
const monitor = (x: number, y: number, w: number, h: number, scr: Svg = '', foot = y + h + 10, bg: string = SCR) => all(
  rect(x + w / 2 - 3, y + h, 6, foot - y - h - 2, C.grey, 1, C.ink, 1.2), rect(x + w / 2 - 12, foot - 3, 24, 3, C.grey, 1, C.ink, 1.2),
  rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, bg, 1, null), scr);
/** Desktop tower standing on y, left edge x. */
const tower = (x: number, y: number, w = 20, h = 42) => all(rect(x, y - h, w, h, '#5a5d68', 3, C.ink, 1.8), rect(x + 3, y - h + 5, w - 6, 4, C.dark, 1, null),
  circle(x + w / 2, y - h + 15, 2.4, C.green, C.ink, 0.8), line(range(4).map((i) => `M${x + 4} ${y - 16 + i * 4} L${x + w - 4} ${y - 16 + i * 4}`).join(' '), C.dark, 1.2));
/** Processor: silver lid on a green base with gold pins. */
const cpu = (x: number, y: number, s = 1) => at(x, y, s, line(range(6).map((i) => { const d = -12.5 + i * 5; return `M${d} -19 L${d} -16 M${d} 16 L${d} 19 M-19 ${d} L-16 ${d} M16 ${d} L19 ${d}`; }).join(' '), C.gold, 1.8),
  rect(-16, -16, 32, 32, PCB2, 2, C.ink, 1.4), rect(-12, -12, 24, 24, C.silver, 2, C.ink, 1.2), rect(-8, -8, 16, 16, '#dde1e5', 1, null), path('M-12 9 L-9 12 L-12 12 Z', C.gold, null));
/** Memory module (RAM stick), centre (x, y), horizontal. */
const ram = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-30, -8, 60, 16, PCB, 1.5, C.ink, 1.4),
  ...range(4).map((i) => rect(-26 + i * 14, -5, 10, 7, C.black, 1, null)), line(range(14).map((i) => `M${-27 + i * 4.1} 6 L${-27 + i * 4.1} 8`).join(' '), C.gold, 2.2), rect(-3, 5, 3, 3.5, C.paper, 0, null));
/** A piece of motherboard as background. */
const boardBg = (x: number, y: number, w: number, h: number, col = PCB) => all(rect(x, y, w, h, col, 3, C.ink, 1.6),
  line(`M${x + 6} ${y + h * 0.3} L${x + w * 0.3} ${y + h * 0.3} L${x + w * 0.4} ${y + h * 0.15} M${x + 6} ${y + h * 0.75} L${x + w * 0.25} ${y + h * 0.75} L${x + w * 0.35} ${y + h * 0.9} M${x + w - 6} ${y + h * 0.5} L${x + w * 0.75} ${y + h * 0.5} L${x + w * 0.68} ${y + h * 0.62}`, TRACE, 1.2));
/** Hard disk opened: platter, spindle and read arm. */
const hdd = (x: number, y: number, s = 1) => at(x, y, s, rect(-22, -28, 44, 56, C.silver, 4, C.ink, 1.6), circle(0, -6, 17, '#e4e8ec', C.ink, 1.2), circle(0, -6, 11, 'none', '#c4cad0', 1),
  circle(0, -6, 3.4, C.grey, C.ink, 1), path('M14 20 L4 -2 L7 -3 L17 18 Z', C.dark, C.ink, 1), circle(15, 20, 3.4, C.dark, C.ink, 1),
  ...[[-18, -24], [18, -24], [-18, 24]].map(([a, b]) => circle(a!, b!, 1.4, C.grey, null)));
/** SSD seen open: circuit board with square memory chips and no moving parts. */
const ssd = (x: number, y: number, s = 1) => at(x, y, s, rect(-26, -15, 52, 30, PCB, 2, C.ink, 1.6), ...range(3).map((i) => rect(-20 + i * 14, -9, 11, 11, C.black, 1, C.ink, 0.6)),
  rect(-20, 5, 9, 5, C.black, 1, null), line(range(7).map((i) => `M26 ${-11 + i * 3.6} L29 ${-11 + i * 3.6}`).join(' '), C.gold, 2));
const usbStick = (x: number, y: number, s = 1, rot = 0, col: string = C.denim) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-17, 0, 4, 'none', C.grey, 1.6),
  rect(-14, -6.5, 24, 13, col, 3, C.ink, 1.4), rect(10, -5, 11, 10, C.silver, 1, C.ink, 1.2), rect(13, -3, 2.6, 2.4, C.dark, 0, null), rect(17, -3, 2.6, 2.4, C.dark, 0, null));
const sdCard = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 -14 L6 -14 L10 -10 L10 14 L-10 14 Z', C.denim, C.ink, 1.4),
  line('M-7 -13 L-7 -8 M-4 -13 L-4 -8 M-1 -13 L-1 -8 M2 -13 L2 -8', C.gold, 1.8), rect(-7, -2, 14, 10, C.white, 1, null));
const cd = (x: number, y: number, r: number) => all(circle(x, y, r, '#dfe4ea', C.ink, 1.8), path(`M${x - r * 0.85} ${y - r * 0.2} A${r * 0.87} ${r * 0.87} 0 0 1 ${x + r * 0.2} ${y - r * 0.85}`, 'none', '#f2a3c2', r * 0.12),
  path(`M${x - r * 0.65} ${y - r * 0.15} A${r * 0.67} ${r * 0.67} 0 0 1 ${x + r * 0.15} ${y - r * 0.65}`, 'none', '#9fd3ee', r * 0.12), path(`M${x + r * 0.8} ${y + r * 0.3} A${r * 0.85} ${r * 0.85} 0 0 1 ${x - r * 0.3} ${y + r * 0.8}`, 'none', '#f6e08a', r * 0.1),
  circle(x, y, r * 0.3, C.silver, C.ink, 1.2), circle(x, y, r * 0.12, C.paper, C.ink, 1.2));
/** Phone, centre (x, y); `scr` in local coordinates (x −8.5…8.5, y −15…13). */
const phone = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR) => at(x, y, s, rect(-10, -18, 20, 36, C.dark, 3.4, C.ink, 1.4), rect(-8.5, -15, 17, 28, bg, 1, null), scr, circle(0, 15.5, 1.2, C.grey, null));
const fanWheel = (x: number, y: number, r: number, col: string = C.dark) => all(circle(x, y, r, '#2e3038', C.ink, 1.2), ...range(5).map((i) => g(`rotate(${i * 72} ${x} ${y})`, path(`M${x} ${y} C${f1(x + r * 0.3)} ${f1(y - r * 0.5)} ${f1(x + r * 0.9)} ${f1(y - r * 0.4)} ${f1(x + r * 0.85)} ${f1(y - r * 0.05)} Z`, col === C.dark ? '#6c707c' : col, null))), circle(x, y, r * 0.25, C.grey, C.ink, 0.8));
/** Graphics card: dark shroud with two fans, green board edge with gold contacts, silver bracket. */
const gpu = (x: number, y: number, s = 1) => at(x, y, s, rect(-44, -18, 4, 40, C.silver, 1, C.ink, 1.2), rect(-40, 8, 82, 10, PCB, 1, C.ink, 1.2), line(range(16).map((i) => `M${-26 + i * 3.2} 18 L${-26 + i * 3.2} 21`).join(' '), C.gold, 2),
  rect(-40, -18, 84, 28, SHROUD, 4, C.ink, 1.6), fanWheel(-18, -4, 11.5), fanWheel(18, -4, 11.5), line('M-44 -10 L-48 -10 M-44 0 L-48 0', C.dark, 2.4));
const gamepad = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, path('M-18 -8 C-22 -8 -26 0 -26 8 C-26 14 -20 16 -16 10 L-10 4 L10 4 L16 10 C20 16 26 14 26 8 C26 0 22 -8 18 -8 Z', col, C.ink, 1.6),
  line('M-16 -2 L-16 4 M-19 1 L-13 1', C.white, 2.2), circle(15, -2, 1.9, C.red, null), circle(19, 1.4, 1.9, C.green, null), circle(11, 1.4, 1.9, C.sky, null), circle(15, 4.6, 1.9, C.yellow, null), circle(-5, 6, 2.4, C.grey, null), circle(5, 6, 2.4, C.grey, null));
const consoleBox = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -7, 40, 14, C.white, 3, C.ink, 1.6), rect(-20, -7, 40, 4, C.dark, 2, null), line('M-14 2 L4 2', C.grey, 1.4), circle(14, 2, 1.6, C.sky, null));
/** Keyboard seen from above, centre (x, y), width w; `space` colours the space bar. */
const keyboard = (x: number, y: number, w = 100, space: string = '#e8ebee', keyCol = '#e8ebee') => {
  const kw = (w - 8) / 11;
  return at(x, y, 1, rect(-w / 2, -20, w, 40, '#5a5d68', 4, C.ink, 1.8), ...[0, 1, 2].flatMap((r) => range(11).map((i) => rect(f1(-w / 2 + 4 + i * kw + (r % 2) * 1.5), -16 + r * 9, f1(kw - 1.6), 7.5, keyCol, 1.2, C.ink, 0.5))),
    rect(f1(-w / 2 + 4), 11, f1(kw * 2.5), 6.5, keyCol, 1.2, C.ink, 0.5), rect(f1(-w / 2 + 4 + kw * 2.7), 11, f1(kw * 5.6), 6.5, space, 1.2, C.ink, 0.6), rect(f1(-w / 2 + 4 + kw * 8.5), 11, f1(kw * 2.3), 6.5, keyCol, 1.2, C.ink, 0.5));
};
/** Computer mouse from above, centre (x, y). */
const mouse = (x: number, y: number, s = 1, left: string = C.white, right: string = C.white, cable = true) => at(x, y, s,
  cable ? path('M0 -14 C0 -24 8 -26 10 -34', 'none', C.ink, 1.6) : '', path('M-9 -2 L-9 6 C-9 16 9 16 9 6 L9 -2 Z', C.white, C.ink, 1.4),
  path('M-9 -2 C-9 -12 -5 -14 0 -14 L0 -2 Z', left, C.ink, 1.4), path('M9 -2 C9 -12 5 -14 0 -14 L0 -2 Z', right, C.ink, 1.4), rect(-1.4, -10, 2.8, 5, C.dark, 1.2, null));
const cursor = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M0 0 L0 17 L4.5 13 L7.5 20 L10.5 18.6 L7.5 12 L13 12 Z', col, C.ink, 1.3));
/** A thumb pressing down; the tip is at (x, y). */
const thumbDown = (x: number, y: number, s = 1, sleeve: string = C.sky) => at(x, y, s, rect(-9, -40, 18, 10, sleeve, 2, C.ink, 1.2), rect(-11, -32, 22, 18, C.skin, 6, C.ink, 1.3),
  line('M-6 -26 L-6 -20 M0 -27 L0 -20 M6 -26 L6 -20', C.ink, 0.8), path('M-4 -16 L-5 -3 C-5 1 5 1 5 -3 L4 -16 Z', C.skin, C.ink, 1.3), path('M-2.6 -2.5 C-2.6 -0.5 2.6 -0.5 2.6 -2.5', 'none', C.ink, 0.6));
/** Person sitting at a desk whose top is at deskY, facing right (f = 1) or left (f = −1). */
const sitter = (x: number, deskY: number, top: string, f: 1 | -1 = 1, long = false, extra: Svg = '') => all(
  rect(x - 10 * f - (f < 0 ? 4 : 0), deskY - 22, 4, 30, C.dark, 1, C.ink, 1), line(`M${x} ${deskY + 6} L${x + 14 * f} ${deskY + 7} L${x + 14 * f} 112`, C.navy, 6),
  path(`M${x - 8} ${deskY + 6} L${x - 9} ${deskY - 22} C${x - 9} ${deskY - 30} ${x + 9} ${deskY - 30} ${x + 9} ${deskY - 22} L${x + 8} ${deskY + 6} Z`, top, C.ink, 1.6),
  line(`M${x + 3 * f} ${deskY - 22} L${x + 12 * f} ${deskY - 6} L${x + 24 * f} ${deskY - 3}`, C.ink, 6.2), line(`M${x + 3 * f} ${deskY - 22} L${x + 12 * f} ${deskY - 6} L${x + 24 * f} ${deskY - 3}`, top, 4.2),
  circle(x + 25 * f, deskY - 3, 2.6, C.skin, C.ink, 1), rect(x - 3, deskY - 34, 6, 6, C.skin, 2, C.ink, 1.2),
  long ? path(`M${x - 10} ${deskY - 40} C${x - 12} ${deskY - 26} ${x + 12} ${deskY - 26} ${x + 10} ${deskY - 40} Z`, C.hair, C.ink, 1.2) : '',
  circle(x, deskY - 41, 8.5, C.skin, C.ink, 1.6), path(`M${x - 8.5} ${deskY - 42} C${x - 8.5} ${deskY - 54} ${x + 8.5} ${deskY - 54} ${x + 8.5} ${deskY - 42} C${x + 4} ${deskY - 47} ${x - 4} ${deskY - 47} ${x - 8.5} ${deskY - 42} Z`, C.hair, C.ink, 1.2),
  circle(x + 4 * f, deskY - 41, 1.1, C.ink, null), extra);
const headsetOn = (x: number, y: number) => all(path(`M${x - 9} ${y} C${x - 9} ${y - 14} ${x + 9} ${y - 14} ${x + 9} ${y}`, 'none', C.dark, 2.4), rect(x - 11, y - 3, 4, 8, C.dark, 2, null), rect(x + 7, y - 3, 4, 8, C.dark, 2, null));
const codeLines = (x: number, y: number, n: number, w: number) => all(...range(n).map((i) => rect(x + (i % 3) * 4, y + i * 5, w - (i * 7) % 13, 2.6, [C.purple, C.green, HL, C.denim][i % 4]!, 1, null)));
/** A little game scene for a screen: platform, jumping figure, star and coin. */
const game = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#8fd0f2', 1, null), rect(x, y + h * 0.78, w, h * 0.22, C.green, 0, null), rect(x + w * 0.55, y + h * 0.5, w * 0.25, h * 0.08, C.brown, 1, null),
  star(x + w * 0.67, y + h * 0.32, h * 0.1, C.yellow), circle(x + w * 0.85, y + h * 0.66, h * 0.06, C.gold, C.ink, 0.6),
  circle(x + w * 0.25, y + h * 0.42, h * 0.08, C.skin, C.ink, 0.7), rect(x + w * 0.21, y + h * 0.49, w * 0.08, h * 0.17, C.red, 1, C.ink, 0.7), path(`M${x + w * 0.4} ${y + h * 0.78} L${x + w * 0.44} ${y + h * 0.68} L${x + w * 0.48} ${y + h * 0.78} Z`, C.purple, null));
const flake = (x: number, y: number, s = 1, col = '#5aa7d6') => at(x, y, s, line('M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4 M-2 -6 L0 -4 L2 -6 M-2 6 L0 4 L2 6', col, 1.8));
const puff = (x: number, y: number, r: number) => path(`M${x - r} ${y} C${x - r} ${y - r} ${x} ${y - r * 1.2} ${x + r * 0.3} ${y - r * 0.6} C${x + r} ${y - r} ${x + r * 1.4} ${y} ${x + r} ${y + r * 0.4} Z`, '#b9b2a6', C.ink, 0.8);

// ── Manual track (0.55): prestanda and lagringsutrymme, drawn by hand ─
/** A snail crawling right, body on y, shell centre (x, y − 11). */
const snail = (x: number, y: number) => all(path(`M${x - 16} ${y} C${x - 14} ${y - 6} ${x + 12} ${y - 6} ${x + 18} ${y - 3} L${x + 20} ${y - 10} M${x + 18} ${y - 3} L${x + 15} ${y - 11} M${x + 18} ${y - 3} C${x + 12} ${y + 1} ${x - 12} ${y + 1} ${x - 16} ${y} Z`, '#cdbfa8', C.ink, 1.3),
  circle(x - 2, y - 11, 10, '#b98a5e', C.ink, 1.4), path(`M${x - 2} ${y - 11} C${x + 2} ${y - 11} ${x + 2} ${y - 16} ${x - 2} ${y - 16} C${x - 8} ${y - 16} ${x - 8} ${y - 7} ${x - 1} ${y - 6} C${x + 6} ${y - 6} ${x + 8} ${y - 13} ${x + 6} ${y - 17}`, 'none', C.ink, 1.1));
/** Small picture tile: coloured sky with a hill (photos and apps on a phone). */
const tile = (x: number, y: number, w: number, h: number, col: string) => all(rect(x, y, w, h, col, 0.6, null), path(`M${x} ${y + h} L${x + w * 0.4} ${y + h * 0.5} L${x + w} ${y + h} Z`, C.green, null));
const tiles = (rows: number) => all(...range(rows * 3).map((i) => tile(-7.5 + (i % 3) * 5.2, -13 + Math.floor(i / 3) * 4.6, 4.4, 3.8, [C.sky, '#f6c9d4', C.yellow, '#c9b3e6'][i % 4]!)));
// ── Shared layouts ───────────────────────────────────────────────────
/** stationär/bärbar dator: one desk with a desktop computer (monitor + tower) and a laptop. */
const computers = (desktop: boolean) => {
  const dt = all(monitor(8, 34, 48, 34, g('translate(32 72)', apps()), 84), rect(14, 79, 34, 4, '#e8ebee', 1, C.ink, 1), tower(62, 84, 18, 44));
  const lt = laptop(98, 84, 0.58, apps());
  return all(ground(), desk(84), desktop ? all(dt, greyed(lt), frame(4, 30, 80, 58)) : all(greyed(dt), lt, frame(78, 56, 40, 32)));
};
/** hårdvara/programvara: one laptop, the touchable parts or the programs on the screen. */
const hardSoft = (hard: boolean) => {
  const physical = all(monitor(24, 8, 72, 52, '', 72), keyboard(60, 92, 76), cpu(13, 36, 0.5), ram(105, 36, 0.38, 90));
  const content = all(rect(29, 13, 30, 22, C.white, 1.5, C.ink, 0.8), rect(29, 13, 30, 4, C.red, 1, null), rect(62, 13, 29, 22, C.white, 1.5, C.ink, 0.8), rect(62, 13, 29, 4, C.green, 1, null),
    codeLines(64, 20, 3, 18), circle(44, 26, 4, C.yellow, null), ...[C.denim, C.orange, C.purple, C.green].map((c, i) => rect(32 + i * 15, 40, 10, 10, c, 2.5, null)), rect(29, 53, 62, 3, '#9fc3dc', 1, null));
  return hard ? all(physical, greyed(content), rect(24, 8, 72, 52, 'none', 3, HL, 2.6), ring(13, 36, 11), ring(105, 36, 13.5), frame(19, 69, 82, 46))
    : all(greyed(physical), content, frame(27, 11, 66, 48));
};
/** hårddisk/SSD: the big disk is the word, the small grey disk the other kind. */
const disks = (isHdd: boolean) => all(
  isHdd ? all(hdd(54, 54, 1.55), path('M30 24 A36 36 0 0 1 82 26', 'none', HL, 2.6), arrow(78, 22, 84, 28, HL, 2.6), greyed(ssd(100, 100, 0.55)))
    : all(ssd(54, 56, 1.65), frame(8, 28, 96, 56), greyed(hdd(104, 96, 0.4))));
/** spelkonsol/handkontroll: one TV corner; the console box or the controller is marked. */
const tvCorner = (box: boolean) => {
  const tv = all(rect(14, 12, 92, 54, C.dark, 3, C.ink, 1.8), game(17, 15, 86, 48), rect(56, 66, 8, 6, C.grey, 1, C.ink, 1));
  const shelf = all(rect(8, 82, 104, 30, C.tan, 2, C.ink, 1.6), line('M60 86 L60 108', C.brown, 1.4));
  const cons = consoleBox(36, 75, 1);
  const pad = gamepad(86, 94, 1.15, C.dark);
  return all(shelf, box ? all(greyed(tv), cons, greyed(pad), frame(12, 64, 48, 20)) : all(greyed(tv), greyed(cons), pad, frame(54, 80, 64, 30)));
};
/** spelutvecklare/grafisk formgivare: one person at a desk; the screen shows game + code or a poster layout. */
const maker = (dev: boolean) => {
  const scr = dev ? all(codeLines(58, 30, 6, 22), game(84, 28, 24, 30)) : all(rect(58, 28, 28, 34, C.white, 1, C.ink, 0.8), rect(61, 31, 22, 14, '#f6c9d4', 1, null), circle(72, 38, 4, C.yellow, null),
    rect(61, 48, 22, 3, C.navy, 1, null), rect(61, 54, 16, 2, C.grey, 1, null), ...[C.red, C.yellow, C.green, C.denim].map((c, i) => rect(90, 30 + i * 8, 14, 6, c, 1.5, C.ink, 0.6)));
  return all(ground(), monitor(54, 24, 56, 42, scr, 82), desk(82), sitter(28, 82, dev ? C.green : C.orange, 1, !dev),
    dev ? gamepad(98, 78, 0.35, C.dark) : all(...[C.red, C.yellow, C.denim].map((c, i) => circle(78 + i * 7, 79, 2.6, c, C.ink, 0.6))));
};

export const HARDWARE_MOTIFS: Record<string, Svg> = {
  // ── 3711 Processor och minne ─────────────────────────────────────
  'hardw.stationär-dator': computers(true),
  'hardw.bärbar-dator': computers(false),
  'hardw.smartklocka': all(path('M0 54 L84 50 C92 50 100 54 104 60 C108 66 104 74 96 74 L84 76 L0 80 Z', C.skin, C.ink, 1.8), path('M0 54 L20 53 L20 79 L0 80 Z', C.sky, C.ink, 1.4),
    line('M98 58 C104 60 104 70 98 72', C.ink, 1), rect(50, 36, 16, 56, C.dark, 4, C.ink, 1.6), rect(44, 46, 28, 34, C.black, 7, C.ink, 1.8), rect(47, 49, 22, 28, NIGHT, 5, null),
    path('M58 55 C56 52 52 53 52 56 C52 59 58 62 58 62 C58 62 64 59 64 56 C64 53 60 52 58 55 Z', C.red, null), T(58, 73, '8432', 7.5, C.white), ring(58, 63, 24)),
  'hardw.hårdvara': hardSoft(true),
  'hardw.programvara': hardSoft(false),
  'hardw.processor': all(boardBg(4, 10, 112, 96), greyed(ram(92, 30, 0.5, 90), ram(104, 30, 0.5, 90)), rect(18, 84, 60, 8, C.black, 1, C.ink, 1), cpu(48, 50, 1.45), ring(48, 50, 33)),
  'hardw.kärna.4': all(at(60, 60, 1, line(range(9).map((i) => { const d = -40 + i * 10; return `M${d} -44 L${d} -40 M${d} 40 L${d} 44 M-48 ${d * 0.8} L-44 ${d * 0.8} M44 ${d * 0.8} L48 ${d * 0.8}`; }).join(' '), C.gold, 2),
    rect(-44, -40, 88, 80, PCB2, 3, C.ink, 1.6), rect(-38, -34, 76, 68, C.silver, 2, C.ink, 1.2),
    ...range(8).map((i) => { const cx = -34 + (i % 4) * 17.5, cy = -30 + Math.floor(i / 4) * 31; return i === 1 ? rect(cx, cy, 15, 28, '#f6b48a', 2, HL, 2.6) : rect(cx, cy, 15, 28, '#d3d8dd', 2, C.grey, 1); }),
    ...range(8).map((i) => { const cx = -34 + (i % 4) * 17.5, cy = -30 + Math.floor(i / 4) * 31; return line(`M${cx + 3} ${cy + 6} L${cx + 12} ${cy + 6} M${cx + 3} ${cy + 12} L${cx + 12} ${cy + 12} M${cx + 3} ${cy + 18} L${cx + 9} ${cy + 18}`, i === 1 ? HL : C.grey, 1.2); }))),
  'hardw.minne.2': all(boardBg(4, 74, 112, 34), rect(14, 84, 92, 6, C.black, 1, C.ink, 1), rect(14, 96, 92, 6, C.black, 1, C.ink, 1), greyed(ram(60, 92, 1.45)),
    ram(60, 40, 1.5), arrow(60, 58, 60, 74, HL, 3), frame(10, 24, 100, 32)),
  // prestanda (manual track): how fast and well the machine works – the marked laptop runs, the grey one rides a snail
  'hardw.prestanda': all(ground(), line('M4 100 L116 100', C.grey2, 1, '4 4'),
    greyed(snail(24, 110), laptop(22, 93, 0.42, apps())),
    waPulse('hw-prestanda-fart', line('M40 50 L54 50 M34 60 L52 60 M40 70 L54 70', HL, 2.6)),
    waBob('hw-prestanda', 3, laptop(84, 74, 0.82, apps()), line('M76 74 L70 88 L62 92 M92 74 L98 88 L106 86', C.ink, 3), frame(56, 34, 58, 64))),
  'hardw.uppgradera': all(boardBg(4, 82, 112, 26), rect(14, 92, 92, 6, C.black, 1, C.ink, 1), greyed(ram(32, 36, 0.75, -18)), arrow(42, 54, 30, 46, C.grey, 2.4),
    waIn('hw-uppgradera', 0, -34, ram(62, 66, 1.05), arrow(62, 76, 62, 88, HL, 2.6), frame(26, 54, 72, 24)), arrow(108, 100, 108, 18, HL, 4), line('M101 34 L115 34 M108 27 L108 41', HL, 2.6)),
  // ── 3712 Hårddisk och lagring ────────────────────────────────────
  'hardw.hårddisk': disks(true),
  'hardw.SSD': disks(false),
  // lagringsutrymme (manual track): the free room inside the phone where a new photo fits; the grey phone is full
  'hardw.lagringsutrymme': all(phone(46, 60, 2.6, all(tiles(3), line('M-7.5 0.8 L7.5 0.8 L7.5 12 L-7.5 12 Z', HL, 0.9, '1.6 1'))),
    waIn('hw-lagringsutrymme', 44, -30, rect(38, 72, 16, 12, C.white, 1.5, C.ink, 1.2), tile(39.5, 73.5, 13, 9, C.sky), circle(49, 76, 1.6, C.yellow, null)),
    greyed(phone(98, 80, 1.3, tiles(6))), line('M88 52 L108 72 M108 52 L88 72', C.grey, 2)),
  'hardw.USB-minne': all(ground(), desk(92), laptop(40, 92, 1, apps()), rect(68, 86, 4, 4, C.dark, 0, null), usbStick(92, 88, 1.4, 180), arrow(110, 74, 86, 74, HL, 2.6), ring(92, 88, 22)),
  'hardw.minneskort': all(rect(10, 40, 66, 46, C.dark, 6, C.ink, 1.8), rect(18, 32, 20, 10, C.dark, 3, C.ink, 1.6), circle(44, 63, 17, C.black, C.ink, 1.8), circle(44, 63, 11, '#4a6a8a', C.ink, 1.2), circle(40, 59, 3, C.white, null),
    rect(76, 50, 4, 26, C.black, 1, C.ink, 1), sdCard(96, 58, 1.5, 0), arrow(102, 96, 86, 80, HL, 2.6), ring(96, 58, 21)),
  'hardw.cd-skiva': all(greyed(rect(18, 18, 76, 76, '#e8ebee', 3, C.ink, 1.6)), cd(64, 62, 40)),
  // ── 3713 Moderkort och portar ────────────────────────────────────
  'hardw.moderkort': all(rect(10, 12, 100, 94, PCB, 3, C.ink, 1.8), line('M20 60 L44 60 L52 52 M20 76 L60 76 L66 70 M70 30 L86 30 L92 36 M30 96 L80 96', TRACE, 1.4),
    rect(30, 26, 30, 30, '#d9dde1', 2, C.ink, 1.4), rect(35, 31, 20, 20, 'none', 1, C.grey, 1), rect(70, 20, 5, 46, C.black, 1, null), rect(79, 20, 5, 46, C.black, 1, null),
    rect(20, 84, 70, 6, C.black, 1, null), ...[[96, 22], [98, 34], [96, 46]].map(([x, y]) => all(rect(x! - 2, y! - 4, 14, 8, C.silver, 1, C.ink, 1))), ...[[24, 66], [32, 66], [64, 74]].map(([x, y]) => circle(x!, y!, 3, C.dark, C.ink, 0.8)),
    rect(92, 66, 12, 12, C.black, 1, null), frame(6, 8, 108, 102)),
  'hardw.port.2': all(greyed(laptop(60, 46, 0.8, apps())), line('M30 52 L14 64 M90 52 L106 64', C.grey2, 1.6), rect(6, 64, 108, 34, C.silver, 6, C.ink, 1.8), line('M6 70 L114 70', '#dde1e5', 2),
    rect(16, 76, 18, 9, C.dark, 1.5, C.ink, 1.2), rect(19, 78, 12, 3, C.silver, 0, null), rect(44, 76, 18, 9, C.dark, 4.5, C.ink, 1.2), path('M72 76 L90 76 L88 85 L74 85 Z', C.dark, C.ink, 1.2), circle(102, 80, 4, C.dark, C.ink, 1.2), ring(53, 80.5, 13)),
  'hardw.USB-kabel': all(path('M30 40 C10 50 14 84 40 86 C70 88 70 54 50 56 C30 58 36 92 66 96 C88 98 96 80 92 66', 'none', C.ink, 4.6), path('M30 40 C10 50 14 84 40 86 C70 88 70 54 50 56 C30 58 36 92 66 96 C88 98 96 80 92 66', 'none', C.dark, 3),
    g('rotate(-30 34 34)', rect(28, 18, 12, 18, C.dark, 2, C.ink, 1.4), rect(29, 8, 10, 11, C.silver, 1, C.ink, 1.2), rect(31, 10, 6, 3, C.dark, 0, null)), g('rotate(10 92 56)', rect(87, 50, 10, 16, C.dark, 2, C.ink, 1.4), rect(88.5, 42, 7, 9, C.silver, 3, C.ink, 1.2)),
    ring(34, 26, 15), ring(92, 50, 13)),
  'hardw.nätaggregat': all(ground(), greyed(rect(4, 74, 14, 22, C.white, 2, C.ink, 1.4), circle(9, 82, 1.4, C.ink, null), circle(13, 82, 1.4, C.ink, null)), path('M14 88 C24 100 26 76 30 70', 'none', C.ink, 2.4),
    rect(28, 34, 62, 48, C.dark, 3, C.ink, 1.8), circle(59, 58, 17, '#2e3038', C.ink, 1.2), line('M44 58 L74 58 M59 43 L59 73 M48 47 L70 69 M70 47 L48 69', C.grey, 1.2), circle(59, 58, 5, C.grey, C.ink, 1), rect(31, 66, 8, 10, C.black, 1, C.ink, 1),
    ...[C.yellow, C.red, C.black, C.yellow].map((c, i) => path(`M90 ${44 + i * 5} C104 ${44 + i * 5} 100 ${80 + i * 6} 112 ${86 + i * 5}`, 'none', c, 2.2)), frame(24, 30, 70, 56)),
  'hardw.ansluta': all(ground(), desk(84), laptop(32, 84, 0.85, apps()), monitor(66, 26, 46, 34, all(rect(70, 30, 38, 26, '#bfe3f5', 1, null)), 84),
    path('M89 80 C89 92 66 92 64 82', 'none', C.ink, 2.4), waIn('hw-ansluta', 10, -8, rect(60, 76, 8, 6, C.dark, 1.5, C.ink, 1), arrow(66, 70, 59, 77, HL, 2.6)), ring(60, 78, 11)),
  'hardw.adapter': all(greyed(rect(4, 52, 18, 16, C.dark, 2, C.ink, 1.4), rect(22, 55, 10, 10, C.silver, 1, C.ink, 1.2)), arrow(28, 76, 42, 76, HL, 2.6),
    rect(42, 50, 34, 20, C.white, 4, C.ink, 1.6), rect(42, 55, 6, 10, C.dark, 1, null), path('M76 60 C86 60 84 60 92 60', 'none', C.ink, 2.6), rect(92, 55, 10, 10, C.white, 2, C.ink, 1.4), rect(102, 56.5, 7, 7, C.silver, 3, C.ink, 1.2), ring(70, 60, 30)),
  'hardw.dockningsstation': all(ground(), desk(86), greyed(laptop(26, 86, 0.62, apps()), monitor(78, 30, 34, 26, '', 86)), path('M44 82 C48 78 50 80 52 80', 'none', C.ink, 2), path('M74 80 C80 82 92 82 95 82', 'none', C.ink, 2),
    rect(50, 74, 26, 12, C.dark, 3, C.ink, 1.6), ...range(4).map((i) => rect(54 + i * 5, 78, 3, 3, C.silver, 0.5, null)), circle(72, 80, 1.4, C.green, null), frame(46, 70, 34, 20)),
  // ── 3714 Skärmar och upplösning ──────────────────────────────────
  'hardw.upplösning.2': all(greyed(rect(4, 26, 52, 52, C.dark, 3, C.ink, 1.6), ...range(36).map((i) => { const cx = i % 6, cy = Math.floor(i / 6); const inSun = (cx - 1.5) ** 2 + (cy - 1.5) ** 2 < 2.2; const hill = cy >= 4 || (cy === 3 && cx >= 3); return rect(7 + cx * 7.7, 29 + cy * 7.7, 7.7, 7.7, inSun ? C.yellow : hill ? C.green : SCR, 0, null); }), T(30, 92, '6 × 6', 8, C.ink)),
    rect(64, 26, 52, 52, C.dark, 3, C.ink, 1.6), rect(67, 29, 46, 46, SCR, 0, null), circle(80, 42, 8, C.yellow, null), path('M67 75 L67 64 C80 54 90 66 113 52 L113 75 Z', C.green, null), frame(61, 23, 58, 58), T(90, 92, '1920 × 1080', 8, HL)),
  'hardw.pekpenna': all(rect(10, 24, 96, 72, C.dark, 6, C.ink, 1.8), rect(16, 30, 84, 60, C.white, 2, null), path('M24 76 C32 54 42 80 52 60 C58 48 62 66 70 58', 'none', C.denim, 2.4),
    g('rotate(38 82 40)', rect(78, 6, 8, 52, '#5a5d68', 3, C.ink, 1.4), path('M78 58 L86 58 L82 68 Z', C.silver, C.ink, 1.2)), frame(56, 6, 52, 64)),
  'hardw.mörkt-läge': all(greyed(phone(32, 60, 2.3, all(circle(5, -11, 2.4, C.yellow, null), ...range(5).map((i) => rect(-6.5, -6 + i * 3.6, 13 - (i % 2) * 4, 1.6, C.dark, 0.6, null))), C.white)),
    phone(88, 60, 2.3, all(path('M5 -13 C2 -13 1 -9 3 -7.5 C5 -6 8 -7 8.4 -9 C7 -8 5 -9 5 -11 C5 -12 5 -12.6 5 -13 Z', C.yellow, null), ...range(5).map((i) => rect(-6.5, -6 + i * 3.6, 13 - (i % 2) * 4, 1.6, '#e8ebee', 0.6, null))), NIGHT), frame(62, 14, 52, 92)),
  'hardw.flimra': all(monitor(14, 20, 92, 60, moving('hw-flimra', '0%,100%{opacity:1}8%{opacity:.25}16%{opacity:1}30%{opacity:.5}36%{opacity:1}60%{opacity:.3}66%{opacity:1}', { dur: 1.4 }, ...range(6).map((i) => rect(17, 23 + i * 9, 86, 9, i % 2 ? '#e9f6fd' : '#5d7d96', 0, null))), 100),
    ...[[8, 30], [8, 60], [112, 40], [112, 70], [36, 12], [84, 12]].map(([x, y], i) => line(i < 4 ? `M${x} ${y! - 6} L${x! + (x! < 60 ? 3 : -3)} ${y! - 2} L${x} ${y! + 2} L${x! + (x! < 60 ? 3 : -3)} ${y! + 6}` : `M${x! - 6} ${y} L${x! - 2} ${y! + 3} L${x! + 2} ${y} L${x! + 6} ${y! + 3}`, HL, 2.2)), ground(104)),
  'hardw.skärmskydd': all(greyed(phone(50, 62, 2.6, all(...range(4).map((i) => rect(-6.5, -10 + i * 5, 13, 3, C.grey, 0.6, null))))),
    g('rotate(12 64 52)', rect(34, 8, 50, 90, 'rgba(230,244,252,0.75)', 8, HL, 2.6), line('M44 20 L58 12 M44 34 L72 18 M44 48 L80 26', C.white, 2.4)), arrow(100, 20, 86, 34, HL, 2.6)),
  // ── 3715 Tangentbord och mus ─────────────────────────────────────
  'hardw.tangent.2': all(greyed(keyboard(60, 92, 104)), line('M44 76 L36 82 M76 76 L84 82', C.grey, 1.2, '2 2'), path('M40 56 L80 56 L84 76 L36 76 Z', '#c9ced4', C.ink, 1.6), rect(40, 30, 40, 28, '#f1f3f5', 4, C.ink, 1.8),
    thumbDown(60, 32, 0.9), frame(32, 26, 56, 54)),
  'hardw.mellanslag': all(rect(8, 12, 104, 30, C.white, 4, C.ink, 1.6), rect(16, 22, 30, 8, C.dark, 2, null), rect(66, 22, 36, 8, C.dark, 2, null), line('M48 34 L48 38 L64 38 L64 34', HL, 2.4), line('M64 18 L64 34', C.denim, 1.6),
    keyboard(60, 82, 108, '#f6b48a'), frame(31, 89, 59, 12), thumbDown(60, 92, 0.7)),
  'hardw.kortkommando': all(greyed(keyboard(60, 100, 108)), moving('hw-kortkommando', '0%,25%,100%{transform:translate(0,0)}40%,75%{transform:translate(0,4px)}', { dur: 2.4 }, ...[[12, 'Ctrl'], [70, 'C']].map(([x, l]) => all(path(`M${x} 70 L${+x! + 38} 70 L${+x! + 41} 80 L${+x! - 3} 80 Z`, '#c9ced4', C.ink, 1.4), rect(+x!, 36, 38, 34, '#f1f3f5', 4, HL, 2.6), T(+x! + 19, 58, l as string, l === 'C' ? 16 : 12, C.ink)))),
    line('M56 56 L64 56 M60 52 L60 60', C.ink, 2.8)),
  'hardw.musmatta': all(rect(4, 6, 112, 104, C.tan, 6, C.ink, 1.6), greyed(at(46, 24, 0.8, keyboard(0, 0, 96))), rect(30, 40, 82, 64, C.denim, 10, C.ink, 1.8), rect(30, 40, 82, 64, 'none', 10, HL, 2.6), greyed(mouse(72, 76, 1.5, C.white, C.white, true))),
  'hardw.muspekare': all(monitor(6, 12, 80, 58, all(...range(3).map((i) => rect(14, 20 + i * 14, 10, 10, [C.yellow, C.green, C.red][i]!, 1.5, C.ink, 0.6)), waIn('hw-muspekare', -26, 16, cursor(46, 30, 1.7, C.white))), 82), ring(54, 46, 20), ground(),
    waIn('hw-muspekare-mus', -10, 0, greyed(mouse(100, 96, 1.3))), arrow(84, 98, 76, 98, C.grey, 2), arrow(116, 98, 118, 98, C.grey, 2)),
  'hardw.högerklicka': all(mouse(42, 66, 2.6, C.white, '#f6b48a', true), waPulse('hw-hogerklicka', line('M70 30 L76 24 M74 38 L82 36 M66 24 L68 16', HL, 2.4)), waGrow('hw-hogerklicka-meny', rect(78, 44, 34, 40, C.white, 2, C.ink, 1.4), ...range(4).map((i) => rect(82, 50 + i * 8, 24 - (i % 2) * 6, 3, C.grey, 1, null))),
    at(42, 66, 2.6, path('M9 -2 C9 -12 5 -14 0 -14 L0 -2 Z', 'none', HL, 1.1))),
  'hardw.dra-och-släppa': all(rect(4, 10, 112, 88, C.dark, 4, C.ink, 1.8), rect(8, 14, 104, 80, SCR, 1, null), rect(14, 22, 26, 22, 'none', 2, C.grey, 1.6, ), path('M88 74 L88 60 L96 60 L99 64 L110 64 L110 88 L88 88 Z', C.yellow, C.ink, 1.4),
    line('M30 50 C40 80 64 84 82 70', C.grey, 2, '4 3'), waIn('hw-dra-och-slappa', -48, -24, rect(62, 46, 26, 22, C.white, 2, C.ink, 1.4), path('M64 66 L72 56 L78 62 L82 58 L86 66 Z', C.green, null), circle(80, 52, 2.6, C.yellow, null), frame(58, 42, 34, 30), cursor(76, 58, 1.2, C.white))),
  'hardw.styrplatta': all(rect(8, 8, 104, 30, C.dark, 4, C.ink, 1.8), rect(12, 11, 96, 24, SCR, 1, null), rect(8, 38, 104, 70, C.silver, 4, C.ink, 1.8), greyed(...range(3).flatMap((r) => range(11).map((i) => rect(14 + i * 8.6, 44 + r * 8, 7, 6, '#e8ebee', 1, C.ink, 0.5)))),
    rect(38, 74, 44, 28, '#d9dde1', 3, C.ink, 1.2), frame(35, 71, 50, 34), arrow(50, 88, 70, 88, HL, 2.2), arrow(70, 88, 50, 88, HL, 2.2)),
  'hardw.hålla-in': all(greyed(rect(18, 84, 84, 20, '#5a5d68', 4, C.ink, 1.4)), circle(60, 78, 18, '#d9dde1', C.ink, 1.8), circle(60, 78, 13, C.white, C.ink, 1.2),
    circle(60, 54, 44, 'none', C.grey2, 3), waPulse('hw-halla-in-tid', path(`M60 10 A44 44 0 1 1 ${f1(60 + Math.cos(rad(-90 - 60)) * 44)} ${f1(54 + Math.sin(rad(-90 - 60)) * 44)}`, 'none', HL, 4.4), T(98, 22, '5', 14, HL)),
    moving('hw-halla-in', '0%{transform:translate(0,-10px)}20%,85%{transform:translate(0,0)}100%{transform:translate(0,-10px)}', { dur: 3.2 }, thumbDown(60, 70, 0.95))),
  'hardw.mus.2': all(moving('hw-mus', '0%,100%{transform:translate(0,0)}30%{transform:translate(-8px,-4px)}70%{transform:translate(8px,3px)}', { dur: 3 }, mouse(60, 70, 3, C.white, C.white, true)), ring(60, 70, 44)),
  // ── 3716 Grafikkort ──────────────────────────────────────────────
  'hardw.grafikkort': all(gpu(62, 58, 1.2), frame(4, 30, 112, 60)),
  'hardw.datorspel': all(ground(), desk(88), monitor(10, 12, 100, 62, game(13, 15, 94, 56), 88), frame(6, 8, 108, 70)),
  'hardw.spelkonsol': tvCorner(true),
  'hardw.handkontroll': tvCorner(false),
  'hardw.e-sport': all(rect(20, 6, 80, 40, C.dark, 3, C.ink, 1.8), game(23, 9, 74, 34), waBob('hw-e-sport', 3, path('M52 54 L68 54 L66 64 C66 70 54 70 54 64 Z', C.gold, C.ink, 1.4), path('M52 56 C46 56 46 62 54 63 M68 56 C74 56 74 62 66 63', 'none', C.gold, 2), rect(56, 70, 8, 6, C.gold, 1, C.ink, 1)),
    desk(84, 4, 46), desk(84, 74, 116), sitter(14, 84, C.red, 1, false, headsetOn(14, 43)), sitter(106, 84, C.denim, -1, true, headsetOn(106, 43)), greyed(...range(7).map((i) => circle(14 + i * 15.3, 112, 7, C.grey, C.ink, 1))), ring(60, 64, 16)),
  'hardw.VR-glasögon': all(ground(), ...[[16, 30, 6, C.yellow], [100, 26, 7, C.sky], [104, 70, 5, C.pink], [14, 72, 5, C.green]].map(([x, y, r, c]) => all(rect(+x! - +r!, +y! - +r!, 2 * +r!, 2 * +r!, c as string, 2, C.ink, 1))),
    g('translate(60 70.8) scale(0.84)', rect(-3.5, -48, 7, 7, C.skin, 2, C.ink, 1.6), circle(0, -56, 10, C.skin, C.ink, 2), path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', C.hair, C.ink, 1.8),
      path('M-14 -42 L14 -42 L12 2 L-12 2 Z', C.green, C.ink, 2.2), path('M-12 -40 C-26 -30 -32 -26 -40 -30', 'none', C.ink, 7.4), path('M-12 -40 C-26 -30 -32 -26 -40 -30', 'none', C.green, 5.4), path('M12 -40 C26 -30 32 -26 40 -30', 'none', C.ink, 7.4), path('M12 -40 C26 -30 32 -26 40 -30', 'none', C.green, 5.4),
      circle(-41, -30, 3.6, C.skin, C.ink, 1.2), circle(41, -30, 3.6, C.skin, C.ink, 1.2), path('M-12 0 L-11 46 L-3 46 L0 8 L3 46 L11 46 L12 0 Z', C.navy, C.ink, 2), line('M-11 -60 L11 -60', C.dark, 3), rect(-13, -62, 26, 12, C.dark, 4, C.ink, 1.6), rect(-10, -59, 20, 3, '#6c707c', 1, null)),
    ring(60, 22, 17)),
  'hardw.spelutvecklare': maker(true),
  'hardw.grafisk-formgivare': maker(false),
  'hardw.ritplatta': all(ground(), desk(86), greyed(monitor(60, 14, 52, 40, path('M70 44 C74 30 80 46 86 34 C90 26 94 40 100 32', 'none', C.denim, 2), 86)),
    rect(10, 72, 60, 14, C.black, 3, C.ink, 1.6), rect(18, 74, 44, 9, '#3a3c46', 1, null), path('M24 80 C28 76 32 82 38 77', 'none', C.denim, 1.4), g('rotate(35 44 62)', rect(41, 44, 6, 32, '#5a5d68', 3, C.ink, 1.2), path('M41 76 L47 76 L44 82 Z', C.silver, C.ink, 1)), frame(6, 68, 68, 22)),
  'hardw.videoredigering': all(rect(4, 8, 112, 88, C.dark, 4, C.ink, 1.8), rect(8, 12, 104, 80, '#e9eef2', 1, null), rect(12, 16, 54, 34, '#8fd0f2', 1, null), path('M12 50 L28 36 L40 46 L52 34 L66 50 Z', C.green, null), circle(56, 24, 4, C.yellow, null),
    rect(12, 60, 96, 12, C.dark, 1, null), ...range(8).map((i) => rect(14 + i * 12, 62, 10, 8, i === 3 || i === 4 ? '#8fd0f2' : '#c9d7e3', 0.5, null)), path('M12 78 ' + range(24).map((i) => `L${14 + i * 4} ${i % 2 ? 74 : 86}`).join(' '), 'none', C.green, 1.6),
    line('M62 56 L62 90', C.red, 2), line('M74 54 L82 46 M74 46 L82 54', C.ink, 1.6), circle(73, 45, 2.4, 'none', C.ink, 1.2), circle(73, 55, 2.4, 'none', C.ink, 1.2), frame(9, 57, 102, 34), ground(104)),
  // ── 3717 Felsöka hårdvara ────────────────────────────────────────
  'hardw.frysa.3': all(ground(), laptop(60, 108, 1.55, all(rect(-20, -34, 40, 22, C.white, 1.5, C.ink, 0.8), rect(-20, -34, 40, 3, C.denim, 1, null),
    path('M-4 -29 L4 -29 L0 -23 L4 -17 L-4 -17 L0 -23 Z', C.gold, C.ink, 0.6), waShake('hw-frysa', cursor(6, -22, 0.4)))), path('M24 50 L28 58 L32 50 L36 60 L40 50 L46 56 L52 50 L58 62 L64 50 L72 58 L80 50 L86 56 L96 50', 'none', '#5aa7d6', 2.2),
    waPulse('hw-frysa-frost', flake(20, 20, 1.2), flake(100, 22, 1.4), flake(108, 92, 1), flake(12, 90, 1))),
  'hardw.tryckluft': all(greyed(keyboard(66, 96, 96)), rect(14, 30, 22, 46, C.red, 4, C.ink, 1.8), rect(14, 40, 22, 14, C.white, 0, null), rect(18, 22, 14, 9, C.dark, 2, C.ink, 1.4), line('M30 25 L62 70', C.ink, 2.2),
    ...[0, 1, 2].map((i) => line(`M${62 + i * 6} ${70 - i * 3} l10 6`, '#5aa7d6', 1.8)), puff(80, 56, 6), puff(94, 44, 7), puff(104, 62, 5), puff(72, 40, 4), frame(10, 18, 30, 62)),
  'hardw.glappkontakt': all(ground(), desk(92), laptop(38, 92, 1.05, all(rect(-8, -28, 16, 9, 'none', 1.5, C.ink, 1.4), rect(8, -25.5, 2, 4, C.ink, 0, null), path('M1 -28 L-3 -23 L0 -23 L-2 -19', 'none', C.gold, 1.6, ),
    line('M-14 -14 L-10 -14 M-6 -14 L-2 -14 M2 -14 L6 -14 M10 -14 L14 -14', C.grey, 1.6))), rect(72, 82, 3, 6, C.dark, 0, null), waShake('hw-glappkontakt', g('rotate(-14 84 84)', rect(80, 80, 12, 8, C.dark, 2, C.ink, 1.2), rect(76, 82, 5, 4, C.silver, 1, C.ink, 0.8))),
    path('M92 82 C102 78 104 92 114 88', 'none', C.ink, 2.2), waPulse('hw-glappkontakt-gnista', line('M74 70 L78 76 L72 76 L76 82', HL, 2.2), line('M86 66 L84 72 M94 70 L90 74', HL, 1.8)), ring(80, 82, 14)),
};
