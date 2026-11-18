/**
 * Teknik & digital värld → Datorer & internet → Operativsystem & filer, 3721–3727 (0.54): the desktop and windows,
 * folders and file types, installing programs, settings and permissions, backups, compressed files, updates and drivers.
 * Recurring signs: a monitor has a dark frame, a blue desktop and a dark taskbar along the bottom; a window is white
 * with a grey title bar and three small buttons (a dash, a square and a cross); a file is a white sheet with a folded
 * corner, a folder is yellow, a zip file has a zipper down the middle, the cloud is a pale grey cloud. The part the word
 * names is ringed or framed in orange, and a grey copy beside it shows what the word is not.
 * Close words share one layout where only the marked part differs: dubbelklicka (the left mouse button pressed twice,
 * marked with a 2, a grey idle mouse beside), minimera/maximera (the same window shrinking into the
 * taskbar or growing to fill the screen), klippa ut/klistra in (the same text block leaving with scissors or arriving
 * from a clipboard), installera/avinstallera (a program going into the laptop or out of it into a bin), logga in/logga ut
 * (an arrow going into or out of the same door), krascha/hänga sig (a black screen with a flash, or a frozen screen with
 * a waiting circle while the clock moves on), komprimera/packa upp (a big file pressed small, or a zip file opened).
 * Digits and maths signs only; no words, no letters, no brands, no logos and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { P, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WALL = '#5b8fd0';
const BAR = '#2d3b55';
const TITLE = '#d9dee4';
const SCREEN = '#eaf4fb';
const FOLD = '#f2c14e';
const FOLD2 = '#d9a62c';
const BLUE = '#3a6ab0';
const GREEN = '#3a9a5a';
const RED = '#d8343a';
const SEL = '#9cc8f2';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Digits / maths signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const squig = (x: number, y: number, w: number, col: string = C.grey, sw = 1.6) => line(`M${x} ${y} q${f1(w / 8)} -3 ${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0`, col, sw);
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * gap} L${x + w - (i % 3) * 4} ${y + i * gap}`, col, 1.3)));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.24));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.24));

// ── Screen things ────────────────────────────────────────────────────
/** Monitor: screen x 14–106, y 18–78; taskbar optional. */
const monitor = (inner: Svg = '', o: { wall?: string; bar?: boolean } = {}) => all(
  rect(40, 96, 40, 5, C.dark, 2, C.ink, 1.4), rect(55, 84, 10, 13, C.dark, 0, C.ink, 1.2),
  rect(10, 14, 100, 70, C.dark, 4, C.ink, 1.8), rect(14, 18, 92, 60, o.wall ?? WALL, 1, null),
  inner, o.bar === false ? '' : taskbar());
const taskbar = (hl = false) => all(rect(14, 72, 92, 6, BAR, 0, null), startBtn(19, 75), rect(28, 73.5, 5, 3, C.grey2, 0.6, null), rect(36, 73.5, 5, 3, FOLD, 0.6, null), num('12:30', 97, 77, 4.2, C.white), hl ? frame(13, 70, 94, 10) : '');
const startBtn = (x: number, y: number, s = 1) => at(x, y, s, rect(-2.4, -2.4, 2.2, 2.2, C.white, 0.3, null), rect(0.2, -2.4, 2.2, 2.2, C.white, 0.3, null), rect(-2.4, 0.2, 2.2, 2.2, C.white, 0.3, null), rect(0.2, 0.2, 2.2, 2.2, C.white, 0.3, null));
/** Window with title bar and dash / square / cross buttons. */
const win = (x: number, y: number, w: number, h: number, inner: Svg = '', o: { grey?: boolean } = {}) => {
  const b = o.grey ? C.grey2 : C.white, t = o.grey ? C.grey : TITLE;
  return all(rect(x, y, w, h, b, 1.5, C.ink, 1.3), rect(x, y, w, 6, t, 1.5, C.ink, 1.1),
    line(`M${x + w - 15} ${y + 3} L${x + w - 12.5} ${y + 3}`, C.ink, 0.9), rect(x + w - 10, y + 1.8, 2.6, 2.4, 'none', 0.3, C.ink, 0.7),
    line(`M${x + w - 5} ${y + 1.8} L${x + w - 2.6} ${y + 4.2} M${x + w - 2.6} ${y + 1.8} L${x + w - 5} ${y + 4.2}`, C.ink, 0.8), inner);
};
const cursor = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L0 16 L4 12 L7 19 L10 18 L7 11 L12 11 Z', C.white, C.ink, 1.4));
const textCursor = (x: number, y: number, h = 10) => line(`M${x} ${y} L${x} ${y + h} M${x - 2} ${y} L${x + 2} ${y} M${x - 2} ${y + h} L${x + 2} ${y + h}`, C.ink, 1.2);
/** File icon: (x, y) is the centre; s = 1 is 20 × 26. mark: what is drawn on the sheet. */
type FileO = { col?: string; mark?: 'lines' | 'photo' | 'note' | 'zip' | 'none' | 'gear'; grey?: boolean };
const file = (x: number, y: number, s = 1, o: FileO = {}) => {
  const fill = o.grey ? C.grey2 : C.white, edge = o.col ?? (o.grey ? C.grey : BLUE), m = o.mark ?? 'none';
  const markSvg = m === 'lines' ? lines(-6, -3, 12, 4, 3.6) : m === 'photo' ? all(rect(-6.5, -4, 13, 11, '#bfe3f5', 1, C.ink, 0.8), path('M-6.5 7 L-2 1 L1 4 L3.5 2 L6.5 7 Z', GREEN, null), circle(3, -1.5, 1.6, C.yellow, null))
    : m === 'note' ? all(path('M-1 6 L-1 -4 L5 -6 L5 4', 'none', C.ink, 1.4), ellipse(-2.6, 6, 2.2, 1.6, C.ink, null), ellipse(3.4, 4, 2.2, 1.6, C.ink, null))
      : m === 'zip' ? all(rect(-2, -13, 4, 22, '#9aa3ad', 0.5, null), ...Array.from({ length: 6 }, (_, i) => line(`M-2 ${-11 + i * 3.4} L2 ${-11 + i * 3.4}`, C.ink, 0.8)), rect(-3.2, 7, 6.4, 5, C.gold, 1, C.ink, 0.8))
        : m === 'gear' ? gear(0, 1, 6, C.grey) : '';
  return at(x, y, s, path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', fill, C.ink, 1.4), path('M4 -13 L4 -7 L10 -7', o.grey ? C.grey : '#dde3ea', C.ink, 1.1), rect(-10, 9, 20, 4, edge, 0, null), path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', 'none', C.ink, 1.4), markSvg);
};
/** Folder icon centred on (x, y); s = 1 is 28 × 20. */
const folder = (x: number, y: number, s = 1, col: string = FOLD, open = false) => at(x, y, s,
  path('M-14 -10 L-4 -10 L-1 -7 L14 -7 L14 10 L-14 10 Z', col === FOLD ? FOLD2 : col, C.ink, 1.3),
  open ? path('M-14 10 L-10 -2 L16 -2 L14 10 Z', col, C.ink, 1.3) : rect(-14, -4, 28, 14, col, 1, C.ink, 1.3));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r * 0.7)} ${f1(y + Math.sin(a) * r * 0.7)} L${f1(x + Math.cos(a) * r * 1.15)} ${f1(y + Math.sin(a) * r * 1.15)}`, col, r * 0.45); }), circle(x, y, r * 0.8, col, C.ink, 1), circle(x, y, r * 0.32, C.white, C.ink, 0.8));
/** Computer mouse seen from above; (x, y) centre; which button is pressed. */
const mouse = (x: number, y: number, s = 1, o: { left?: boolean; right?: boolean } = {}) => at(x, y, s,
  path('M0 -22 C-14 -22 -16 -10 -16 0 C-16 14 -10 22 0 22 C10 22 16 14 16 0 C16 -10 14 -22 0 -22 Z', C.grey2, C.ink, 1.8),
  path('M0 -22 C-14 -22 -16 -10 -16 -4 L0 -4 Z', o.left ? HL : C.white, C.ink, 1.4), path('M0 -22 C14 -22 16 -10 16 -4 L0 -4 Z', o.right ? HL : C.white, C.ink, 1.4),
  rect(-2, -16, 4, 8, C.dark, 2, null), path('M0 -22 C0 -30 6 -34 10 -40', 'none', C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '', scr: string = SCREEN) => at(x, y, s, rect(-16, -28, 32, 56, C.dark, 5, C.ink, 1.6), rect(-13.4, -23, 26.8, 45, scr, 1.6, null), inner);
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCREEN, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', C.grey, C.ink, 1.6));
const cloudShape = (x: number, y: number, s = 1, fill: string = '#e6ebf0') => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', fill, C.ink, 1.4));
const bin = (x: number, y: number, s = 1, col: string = '#8fa3b8') => at(x, y, s, path('M-9 -8 L9 -8 L7 12 L-7 12 Z', col, C.ink, 1.4), rect(-11, -12, 22, 4, col, 1, C.ink, 1.3), rect(-3, -15, 6, 3, col, 1, C.ink, 1.1), line('M-4 -4 L-3.4 8 M0 -4 L0 8 M4 -4 L3.4 8', C.ink, 0.9));
const lock = (x: number, y: number, s = 1, open = false, col: string = C.gold) => at(x, y, s, path(open ? 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -14' : 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -12 L6 -4', 'none', C.ink, 3), rect(-10, -5, 20, 16, col, 3, C.ink, 1.6), circle(0, 2, 2, C.ink, null), line('M0 2 L0 7', C.ink, 1.6));
const dots = (x: number, y: number, n: number, gap = 5, r = 1.6) => all(...Array.from({ length: n }, (_, i) => circle(x + i * gap, y, r, C.ink, null)));
const avatar = (x: number, y: number, r = 10, col = '#7ab0e8') => all(circle(x, y, r, col, C.ink, 1.4), circle(x, y - r * 0.25, r * 0.36, C.white, null), path(`M${f1(x - r * 0.6)} ${f1(y + r * 0.7)} C${f1(x - r * 0.6)} ${f1(y + r * 0.1)} ${f1(x + r * 0.6)} ${f1(y + r * 0.1)} ${f1(x + r * 0.6)} ${f1(y + r * 0.7)}`, C.white, null));
const progress = (x: number, y: number, w: number, part: number, col: string = GREEN) => all(rect(x, y, w, 5, C.white, 2.5, C.ink, 1), rect(x + 0.8, y + 0.8, f1((w - 1.6) * part), 3.4, col, 1.7, null));
const box = (x: number, y: number, s = 1, col = '#c8a070') => at(x, y, s, path('M-14 -6 L0 -12 L14 -6 L0 0 Z', '#e0c08e', C.ink, 1.3), path('M-14 -6 L0 0 L0 16 L-14 10 Z', col, C.ink, 1.3), path('M14 -6 L0 0 L0 16 L14 10 Z', '#b08850', C.ink, 1.3));
const appTile = (x: number, y: number, s: number, col: string, inner: Svg = '') => at(x, y, s, rect(-6, -6, 12, 12, col, 3, C.ink, 1), inner);
const roundArrows = (x: number, y: number, r: number, col: string = GREEN, sw = 2.6) => all(
  path(`M${f1(x - r)} ${y} A${r} ${r} 0 0 1 ${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, 'none', col, sw), path(`M${f1(x + r * 0.7 + 4)} ${f1(y - r * 0.7 - 3)} L${f1(x + r * 0.7 + 1)} ${f1(y - r * 0.7 + 4)} L${f1(x + r * 0.7 - 5)} ${f1(y - r * 0.7 - 1)} Z`, col, col, 1),
  path(`M${f1(x + r)} ${y} A${r} ${r} 0 0 1 ${f1(x - r * 0.7)} ${f1(y + r * 0.7)}`, 'none', col, sw), path(`M${f1(x - r * 0.7 - 4)} ${f1(y + r * 0.7 + 3)} L${f1(x - r * 0.7 - 1)} ${f1(y + r * 0.7 - 4)} L${f1(x - r * 0.7 + 5)} ${f1(y + r * 0.7 + 1)} Z`, col, col, 1));
const deskIcons = (o: { skip?: number } = {}) => all(...[[22, 26, 'f'], [22, 42, 'd'], [22, 58, 'b'], [38, 26, 'p']].map(([x, y, k], i) => i === o.skip ? '' :
  k === 'f' ? folder(x as number, y as number, 0.42) : k === 'd' ? file(x as number, y as number, 0.42, { mark: 'lines' }) : k === 'b' ? bin(x as number, y as number, 0.42) : file(x as number, y as number, 0.42, { mark: 'photo', col: GREEN })));
const hill = () => all(path('M14 62 C34 50 52 56 70 48 C86 42 98 50 106 46 L106 72 L14 72 Z', '#6aa874', null), circle(90, 30, 6, '#f6d46b', null));
const clipboard = (x: number, y: number, s = 1) => at(x, y, s, rect(-11, -14, 22, 28, '#c8a070', 2, C.ink, 1.4), rect(-8, -10, 16, 22, C.white, 1, null), rect(-5, -17, 10, 6, C.grey, 1.5, C.ink, 1.1));
const scissors = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-2 -2 L14 -10 M-2 2 L14 10', C.grey, 2.6), line('M-2 -2 L14 -10 M-2 2 L14 10', C.ink, 0.7), circle(-6, -5, 4, 'none', RED, 2.6), circle(-6, 5, 4, 'none', RED, 2.6), circle(0, 0, 1.2, C.ink, null));
const plane = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, path('M0 -12 C1.5 -12 2 -10 2 -8 L2 -3 L12 3 L12 6 L2 3 L2 9 L5 11 L5 13 L0 12 L-5 13 L-5 11 L-2 9 L-2 3 L-12 6 L-12 3 L-2 -3 L-2 -8 C-2 -10 -1.5 -12 0 -12 Z', col, null));
const bars = (x: number, y: number, col: string = C.ink) => all(...[0, 1, 2, 3].map((i) => rect(x + i * 4, y - 3 - i * 2.5, 2.6, 3 + i * 2.5, col, 0.5, null)));
const toggle = (x: number, y: number, on: boolean, s = 1) => at(x, y, s, rect(-14, -7, 28, 14, on ? GREEN : C.grey2, 7, C.ink, 1.4), circle(on ? 7 : -7, 0, 5.4, C.white, C.ink, 1.2));
const pin = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, path('M0 0 C-8 -10 -8 -18 0 -18 C8 -18 8 -10 0 0 Z', col, C.ink, 1.2), circle(0, -12, 2.6, C.white, null));
const spinner = (x: number, y: number, r: number) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r), 1.3 + i * 0.22, i > 5 ? '#e8eef5' : BLUE, null); }));
const clock = (x: number, y: number, r: number, mins: number) => { const a = (mins / 60) * Math.PI * 2 - Math.PI / 2; return all(circle(x, y, r, C.white, C.ink, 1.4), line(`M${x} ${y} L${x} ${f1(y - r * 0.55)}`, C.ink, 1.6), line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.8)} ${f1(y + Math.sin(a) * r * 0.8)}`, RED, 1.4)); };
const bug = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 -4 L-11 -8 M-7 0 L-12 0 M-6 4 L-11 8 M6 -4 L11 -8 M7 0 L12 0 M6 4 L11 8 M-2 -8 L-5 -13 M2 -8 L5 -13', C.ink, 1.3), ellipse(0, 1, 7, 9, '#4a8a3a', C.ink, 1.3), circle(0, -7, 3.6, C.dark, C.ink, 1), line('M0 -6 L0 10', C.ink, 1), circle(-3, 0, 1.4, C.dark, null), circle(3, 4, 1.4, C.dark, null));
const printer = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -20, 20, 10, C.white, 1, C.ink, 1.3), rect(-18, -12, 36, 18, C.grey2, 3, C.ink, 1.5), rect(-12, 2, 24, 4, C.dark, 1, null), rect(-9, 4, 18, 12, C.white, 0.5, C.ink, 1.1), lines(-6, 8, 12, 2, 3.4), circle(12, -6, 1.6, GREEN, null));

export const OSFILES_MOTIFS: Record<string, Svg> = {
  // ── 3721 Skrivbord och fönster ───────────────────────────────────
  'osfil.ikon.2': all(monitor(all(hill(), deskIcons({ skip: 3 }))), circle(76, 40, 18, C.white, C.ink, 1.6), file(76, 40, 1, { mark: 'photo', col: GREEN }), line('M38 26 L60 34', HL, 1.4, '3 2'), file(38, 26, 0.42, { mark: 'photo', col: GREEN }), ring(38, 26, 8), ring(76, 40, 20), cursor(80, 46, 0.7)),
  'osfil.skrivbord.2': all(monitor(all(hill(), deskIcons(), file(38, 42, 0.42, { mark: 'note', col: C.purple }), folder(38, 58, 0.42))), frame(12, 16, 96, 64)),
  'osfil.fönster.2': all(monitor(all(hill(), deskIcons(), win(44, 24, 56, 40, lines(50, 38, 42, 4, 6)))), frame(41.5, 21.5, 61, 45)),
  'osfil.dubbelklicka': all(monitor(all(hill(), folder(30, 34, 0.6), cursor(32, 36, 0.7), win(52, 26, 48, 38, lines(58, 40, 34, 3, 6)), arrow(40, 34, 50, 34, HL, 2))), mouse(24, 104, 0.4, { left: true }), num('2', 12, 98, 11, HL), line('M14 88 l-3 -3 M20 86 l0 -4 M26 88 l3 -3', HL, 1.6), greyed(mouse(100, 104, 0.4))),
  'osfil.meny.2': all(monitor(all(hill(), win(20, 22, 80, 46, all(rect(20, 28, 80, 6, '#eef1f4', 0, null), squig(24, 31, 10, C.ink, 1.2), squig(38, 31, 10, C.grey, 1.2), squig(52, 31, 10, C.grey, 1.2), rect(22, 34, 26, 30, C.white, 1, C.ink, 1.2), rect(23, 35, 24, 6, SEL, 0, null), lines(25, 38, 18, 5, 5.6, C.ink))), cursor(40, 44, 0.6)), { bar: true }), frame(20, 32, 30, 34)),
  'osfil.startmeny': all(monitor(all(hill(), rect(14, 30, 40, 42, '#e8edf3', 1, C.ink, 1.2), ...[0, 1, 2].map((r) => all(...[0, 1, 2].map((c) => appTile(22 + c * 12, 38 + r * 11, 0.7, [BLUE, GREEN, C.orange, C.purple, RED, FOLD, '#4ab0c0', C.pink, C.navy][r * 3 + c]!))))), { bar: true }), ring(19, 75, 5), frame(12, 28, 44, 46), arrow(19, 68, 19, 60, HL, 1.6)),
  'osfil.aktivitetsfält': all(monitor(all(hill(), deskIcons(), win(46, 24, 50, 36, lines(52, 38, 36, 3, 6)))), taskbar(true), ring(60, 75, 48, 8)),
  'osfil.markera.3': all(monitor(win(18, 22, 84, 46, all(lines(24, 34, 70, 1, 6, C.ink), rect(23, 38.5, 54, 7, SEL, 1, null), lines(24, 42, 70, 1, 6, C.ink), lines(24, 50, 70, 3, 6, C.ink), cursor(76, 42, 0.6))), { bar: false }), frame(20, 36, 60, 11), mouse(100, 104, 0.36, { left: true })),
  'osfil.minimera.2': all(monitor(all(hill(), deskIcons(), win(50, 24, 50, 34, lines(56, 38, 36, 3, 6)), greyed(win(50, 24, 50, 34)), rect(64, 40, 22, 14, C.white, 1, C.ink, 1), arrow(75, 56, 75, 70, HL, 2.2)), {}), rect(71, 73, 8, 4, C.white, 0.6, C.ink, 0.8), ring(75, 75, 8, 5), ring(86, 27, 5)),
  'osfil.maximera.2': all(monitor(all(hill(), win(15, 19, 90, 52, lines(22, 34, 76, 5, 6)), greyed(rect(44, 34, 32, 22, C.white, 1, C.ink, 1)), arrow(44, 34, 24, 26, HL, 2), arrow(76, 34, 96, 26, HL, 2), arrow(44, 56, 24, 64, HL, 2), arrow(76, 56, 96, 64, HL, 2))), ring(95, 22, 5)),
  // ── 3722 Mappar och filtyper ─────────────────────────────────────
  'osfil.undermapp': all(ground, folder(60, 62, 2.6, FOLD, true), at(0, 0, 1, folder(60, 52, 0.9, '#f6d98a'), file(38, 48, 0.7, { mark: 'lines' }), file(82, 48, 0.7, { mark: 'photo', col: GREEN })), ring(60, 52, 16, 13)),
  'osfil.fil.2': all(monitor(all(hill(), folder(84, 54, 0.9), line('M44 40 C60 30 76 38 82 48', C.white, 1.6, '3 3'), file(40, 44, 1.2), cursor(44, 48, 0.7))), ring(40, 44, 18)),
  'osfil.dokument': all(ground, rect(54, 96, 60, 6, C.tan, 1, C.ink, 1.2), laptop(36, 96, 0.9, all(rect(-20, -32, 40, 25, C.white, 0, null), rect(-17, -30, 18, 3, C.ink, 0.5, null), lines(-17, -24, 34, 4, 4.4))), at(88, 70, 1, rect(-14, -20, 28, 36, C.white, 1, C.ink, 1.4), rect(-10, -16, 12, 3, C.ink, 0.5, null), lines(-10, -9, 20, 5, 4.4), squig(-10, 12, 10, BLUE, 1.4)), frame(72, 48, 32, 40)),
  'osfil.filtyp': all(file(22, 52, 1.3, { mark: 'photo', col: GREEN }), file(60, 52, 1.3, { mark: 'note', col: C.purple }), file(98, 52, 1.3, { mark: 'lines', col: BLUE }), num('≠', 41, 57, 13, HL), num('≠', 79, 57, 13, HL), frame(6, 30, 108, 46), ground),
  'osfil.döpa-om': all(file(60, 40, 1.6, { mark: 'lines' }), rect(28, 70, 64, 12, C.white, 2, C.ink, 1.2), greyed(squig(32, 76, 24, C.ink, 1.6)), line('M30 76 L58 76', RED, 1.4), arrow(60, 76, 66, 76, HL, 1.6), squig(68, 76, 18, BLUE, 1.8), textCursor(89, 71, 10), frame(26, 68, 68, 16), at(98, 96, 1, path('M-14 8 L8 -14 L14 -8 L-8 14 L-16 16 Z', C.yellow, C.ink, 1.3), path('M-16 16 L-14 8 L-8 14 Z', C.skin2, null))),
  'osfil.sökväg': all(rect(4, 44, 112, 32, C.white, 4, C.ink, 1.3), folder(16, 60, 0.6), arrow(26, 60, 34, 60, HL, 1.8), folder(44, 60, 0.6), arrow(54, 60, 62, 60, HL, 1.8), folder(72, 60, 0.6, '#f6d98a'), arrow(82, 60, 90, 60, HL, 1.8), file(102, 60, 0.7, { mark: 'lines' }), greyed(folder(30, 94, 0.5), folder(60, 94, 0.5), file(90, 94, 0.5)), frame(6, 46, 108, 28)),
  'osfil.klippa-ut': all(rect(8, 16, 64, 88, C.white, 2, C.ink, 1.4), lines(14, 26, 52, 3, 6, C.ink), rect(13, 44, 54, 18, 'none', 1, C.grey, 1.2), line('M13 44 L67 44 L67 62 L13 62 Z', C.grey, 1.2, '3 2'), lines(14, 70, 52, 4, 6, C.ink), rect(76, 30, 38, 18, C.white, 1, C.ink, 1.2), lines(80, 36, 30, 2, 5, C.ink), frame(74, 28, 42, 22), scissors(92, 70, 1.2, -30), arrow(64, 50, 74, 42, HL, 2)),
  'osfil.klistra-in': all(rect(14, 16, 64, 88, C.white, 2, C.ink, 1.4), lines(20, 26, 52, 3, 6, C.ink), rect(19, 44, 54, 18, SEL, 1, BLUE, 1.2, ), lines(23, 50, 46, 2, 5, C.ink), lines(20, 70, 52, 4, 6, C.ink), clipboard(98, 38, 1.1), arrow(86, 46, 76, 52, HL, 2), frame(17, 42, 58, 22)),
  'osfil.papperskorg.2': all(monitor(all(hill(), folder(24, 28, 0.42), file(24, 44, 0.42, { mark: 'lines' }), bin(76, 50, 1.1), line('M40 34 C52 22 66 28 74 36', C.white, 1.6, '3 3'), file(66, 32, 0.6, { mark: 'lines' }), cursor(68, 34, 0.6))), ring(76, 50, 16)),
  'osfil.tömma': all(ground, greyed(at(28, 74, 1, path('M-14 -20 L14 -20 L12 20 L-12 20 Z', C.white, C.ink, 1.4), ...[[-6, 10], [3, 12], [-2, 2], [6, 4], [-7, -6], [2, -7], [7, -14], [-4, -14]].map(([x, y]) => circle(x!, y!, 3.4, C.orange, C.ink, 0.8)))),
    g('translate(84 60) rotate(150)', path('M-14 -20 L14 -20 L12 20 L-12 20 Z', C.white, C.ink, 1.4)), ...[[72, 86], [80, 94], [92, 100], [100, 92], [86, 104], [76, 104], [96, 106], [66, 98]].map(([x, y]) => circle(x!, y!, 3.4, C.orange, C.ink, 0.8)), arrow(84, 80, 84, 92, HL, 2), ring(84, 58, 22, 26)),
  'osfil.ångra.2': all(rect(10, 30, 70, 62, C.white, 2, C.ink, 1.4), lines(16, 40, 56, 2, 7, C.ink), squig(16, 56, 22, C.ink, 1.4), squig(42, 56, 20, RED, 1.8), line('M42 59 L62 59', RED, 1.2), lines(16, 70, 56, 2, 7, C.ink), rect(80, 16, 32, 32, C.white, 6, C.ink, 1.6), path('M104 40 C108 26 96 20 88 26', 'none', BLUE, 3.2), path('M84 20 L88 30 L94 24 Z', BLUE, BLUE, 1), ring(96, 32, 20), arrow(82, 46, 64, 56, HL, 1.8)),
  // ── 3723 Installera program ──────────────────────────────────────
  'osfil.app': all(phone(60, 62, 1.5, all(...[0, 1, 2, 3].map((r) => all(...[0, 1, 2].map((c) => appTile(-7.5 + c * 7.5, -16 + r * 9, 0.5, [BLUE, GREEN, C.orange, C.purple, RED, FOLD, '#4ab0c0', C.pink, C.navy, GREEN, BLUE, C.orange][r * 3 + c]!)))))), ring(60, 62 - 16 * 1.5 + 9 * 1.5, 8)),
  'osfil.appbutik': all(phone(44, 62, 1.5, all(path('M-12 -20 L12 -20 L10 -14 L-10 -14 Z', BLUE, C.ink, 0.8), ...[0, 1, 2].map((r) => all(appTile(-7, -8 + r * 10, 0.55, [GREEN, C.orange, C.purple][r]!), rect(-2, -10 + r * 10, 12, 4, C.white, 1, C.ink, 0.6), arrow(4, -12 + r * 10, 4, -7 + r * 10, BLUE, 1))))), frame(22, 22, 44, 82), appTile(94, 40, 1.4, C.orange, circle(0, 0, 2.6, C.white, null)), arrow(94, 54, 94, 76, HL, 2.4), phone(94, 96, 0.5)),
  'osfil.installera': all(ground, box(22, 70, 1.3), file(22, 54, 0.7, { mark: 'gear' }), arrow(40, 66, 56, 66, HL, 3), laptop(86, 96, 0.8, all(gear(0, -24, 6, BLUE), rect(-18, -14, 36, 6, 'none', 0, null), progress(-20, -14, 40, 0.6))), ring(86, 78, 26, 20)),
  'osfil.systemkrav': all(rect(56, 14, 56, 84, C.white, 2, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => all(ok(66, 28 + i * 18, 5), i === 0 ? at(86, 28, 1, rect(-6, -6, 12, 12, C.dark, 1, C.ink, 0.8), line('M-8 -3 L-6 -3 M-8 3 L-6 3 M6 -3 L8 -3 M6 3 L8 3 M-3 -8 L-3 -6 M3 -8 L3 -6 M-3 6 L-3 8 M3 6 L3 8', C.ink, 1)) : i === 1 ? rect(78, 41, 18, 6, GREEN, 1, C.ink, 0.8) : i === 2 ? all(ellipse(87, 64, 9, 4, C.grey2, C.ink, 1), circle(87, 64, 1.5, C.ink, null)) : gear(87, 82, 5), squig(98, 28 + i * 18, 10, C.grey, 1.2))), frame(54, 12, 60, 88), laptop(28, 96, 0.6), file(28, 56, 0.9, { mark: 'gear' }), arrow(40, 56, 52, 56, C.grey, 1.6)),
  'osfil.kompatibel': all(ground, laptop(32, 96, 0.6, rect(-8, -26, 16, 10, '#d6e8f6', 1, C.ink, 0.8)), path('M18 54 L26 54 C26 48 34 48 34 54 L42 54 L42 70 L18 70 Z', GREEN, C.ink, 1.3), ok(30, 40, 7), laptop(88, 96, 0.6), greyed(path('M74 54 L82 54 L82 48 L88 48 L88 54 L98 54 L98 70 L74 70 Z', C.grey, C.ink, 1.3)), no(86, 40, 7), ring(32, 62, 22, 26)),
  'osfil.testversion': all(win(10, 22, 68, 56, all(gear(44, 46, 10, BLUE), progress(18, 64, 52, 0.8, C.orange))), at(96, 44, 1, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.2), num('30', 0, 9, 12)), at(96, 88, 1, path('M-8 -12 L8 -12 L0 0 L8 12 L-8 12 L0 0 Z', '#f6e3b0', C.ink, 1.4), path('M-4 8 L4 8 L0 3 Z', C.tan, null)), frame(80, 28, 32, 32)),
  'osfil.genväg.2': all(monitor(all(hill(), deskIcons(), file(70, 34, 0.9, { mark: 'note', col: C.purple }), rect(73, 40, 8, 8, C.white, 1, C.ink, 0.8), path('M75 46 C75 42 77 42 79 42', 'none', BLUE, 1.4), path('M78 40 L80 42 L78 44 Z', BLUE, null), line('M70 46 C70 60 88 62 92 52', C.white, 1.2, '2 2'), folder(92, 48, 0.42))), ring(72, 37, 14)),
  'osfil.avinstallera': all(ground, laptop(30, 96, 0.8, all(gear(0, -24, 6, C.grey), progress(-20, -14, 40, 0.6, RED))), file(56, 50, 0.7, { mark: 'gear' }), arrow(58, 66, 76, 80, HL, 3), bin(94, 92, 1.5), ring(94, 90, 20)),
  // ── 3724 Inställningar och behörighet ────────────────────────────
  'osfil.administratör.2': all(ground, P({ x: 30, top: BLUE, mood: 'smile' }), at(56, 44, 1, path('M0 -6 L12 -6 L12 -2 L16 -2 M12 -6 L18 -6', 'none', C.gold, 3), circle(-4, -6, 5, 'none', C.gold, 3)), gear(48, 20, 7, C.orange), line('M72 30 L72 46 M72 46 L86 46 M72 46 L100 46 M86 46 L86 56 M100 46 L100 56 M72 46 L72 56', C.ink, 1.4), rect(60, 16, 24, 14, '#d6e8f6', 2, C.ink, 1.2), avatar(72, 23, 5, BLUE), greyed(avatar(72, 66, 8), avatar(86, 66, 8), avatar(100, 66, 8)), ring(30, 72, 22, 42)),
  'osfil.användarkonto': all(monitor(all(rect(20, 22, 80, 48, '#e8edf3', 2, null), ...[0, 1, 2].map((i) => all(rect(24 + i * 26, 28, 22, 36, C.white, 2, C.ink, 1), avatar(35 + i * 26, 40, 7, [BLUE, C.orange, GREEN][i]), squig(28 + i * 26, 54, 14, C.ink, 1.2), dots(29 + i * 26, 59, 4, 3.4, 1)))), { bar: false }), frame(48, 26, 26, 40)),
  'osfil.logga-in': all(path('M64 18 L100 18 L100 102 L64 102', 'none', C.ink, 3), rect(66, 20, 32, 80, '#a0673d', 1, null), circle(72, 62, 2, C.gold, null), arrow(14, 60, 58, 60, HL, 5), avatar(30, 34, 12), phone(30, 96, 0.4, dots(-8, 0, 4, 5.4, 1.4)), ok(98, 22, 7)),
  'osfil.logga-ut': all(path('M56 18 L20 18 L20 102 L56 102', 'none', C.ink, 3), rect(22, 20, 32, 80, '#a0673d', 1, null), circle(48, 62, 2, C.gold, null), arrow(62, 60, 106, 60, HL, 5), avatar(90, 34, 12, C.grey2), greyed(phone(90, 96, 0.4))),
  'osfil.låsskärm': all(phone(60, 62, 1.6, all(rect(-13.4, -23, 26.8, 45, WALL, 1.6, null), path('M-13.4 10 C-6 4 4 8 13.4 2 L13.4 22 L-13.4 22 Z', '#6aa874', null), num('7:30', 0, -6, 7, C.white), lock(0, -16, 0.32, false, C.white))), ring(60, 36, 8), greyed(phone(104, 92, 0.5, lines(-8, -10, 16, 5, 4)))),
  'osfil.flygplansläge': all(phone(44, 62, 1.5, all(circle(0, -6, 10, HL, C.ink, 1.2), plane(0, -6, 0.6, C.white), bars(-8, 16, C.grey), line('M-10 16 L8 6', RED, 1.6))), ring(44, 53, 18), plane(96, 30, 1.4, '#9aa3ad'), path('M76 96 C86 92 104 92 114 96', 'none', C.grey2, 2)),
  'osfil.platstjänst': all(phone(60, 62, 1.6, all(rect(-13.4, -23, 26.8, 45, '#d8ecd0', 1.6, null), line('M-13 -8 L13 0 M-4 -23 L2 22 M-13 12 L13 8', C.white, 3), pin(0, 2, 0.7))), circle(60, 62, 10, 'none', BLUE, 1.2), circle(60, 62, 18, 'none', BLUE, 1, ), ring(60, 56, 12, 14)),
  'osfil.aktivera': all(rect(16, 24, 88, 72, C.white, 4, C.ink, 1.4), gear(30, 40, 6, C.grey), squig(42, 40, 20, C.ink, 1.4), toggle(86, 40, false, 0.8), squig(28, 64, 30, C.ink, 1.4), toggle(82, 64, true, 1.3), arrow(66, 76, 82, 76, HL, 1.8), ring(82, 64, 22, 14)),
  // ── 3725 Säkerhetskopiering ──────────────────────────────────────
  'osfil.krascha': all(ground, rect(52, 92, 30, 4, C.dark, 1, C.ink, 1.2), rect(40, 30, 54, 40, C.dark, 3, C.ink, 1.6), rect(43, 33, 48, 34, '#10131a', 1, null), path('M70 34 L62 48 L70 50 L60 66', 'none', C.white, 1.8), path('M60 18 L52 30 L58 30 L52 40', 'none', C.yellow, 2.2), path('M96 22 L90 32 L96 32 L90 42', 'none', C.yellow, 2.2), rect(64, 70, 6, 22, C.dark, 0, C.ink, 1), P({ x: 22, top: C.orange, mood: 'shock' }), frame(38, 28, 58, 44)),
  'osfil.skriva-över': all(greyed(file(40, 58, 1.8, { mark: 'lines' })), file(74, 52, 1.8, { mark: 'photo', col: GREEN }), arrow(96, 22, 84, 32, HL, 2.2), squig(26, 92, 24, C.ink, 1.6), squig(62, 92, 24, C.ink, 1.6), num('=', 56, 96, 12, HL), line('M24 48 L56 70 M56 48 L24 70', RED, 2), frame(50, 24, 48, 56)),
  'osfil.synkronisera': all(ground, laptop(30, 96, 0.8, file(0, -20, 0.6, { mark: 'photo', col: GREEN })), phone(94, 86, 0.8, file(0, -2, 0.6, { mark: 'photo', col: GREEN })), roundArrows(62, 38, 14, HL, 3), cloudShape(62, 38, 0.6)),
  'osfil.hämta-tillbaka': all(ground, laptop(30, 96, 0.8, file(0, -20, 0.6, { mark: 'photo', col: GREEN })), cloudShape(88, 34, 1.4), file(88, 34, 0.6, { mark: 'photo', col: GREEN }), path('M76 52 C70 66 60 70 50 66', 'none', HL, 3), path('M46 60 L50 68 L56 62 Z', HL, HL, 1), ring(30, 76, 26, 22)),
  // ── 3726 Komprimerade filer ──────────────────────────────────────
  'osfil.packa-upp.2': all(file(36, 74, 1.6, { mark: 'zip', col: C.gold }), path('M33 54 L28 46 M39 54 L44 46', 'none', C.ink, 1.4), arrow(46, 50, 64, 30, HL, 2), arrow(48, 60, 76, 58, HL, 2), file(76, 24, 0.8, { mark: 'lines' }), file(96, 44, 0.8, { mark: 'photo', col: GREEN }), file(92, 76, 0.8, { mark: 'note', col: C.purple }), ring(36, 52, 10)),
  'osfil.komprimera': all(ground, rect(8, 18, 6, 80, C.grey, 1, C.ink, 1.2), rect(106, 18, 6, 80, C.grey, 1, C.ink, 1.2), greyed(file(36, 58, 1.8, { mark: 'lines' })), arrow(16, 58, 28, 58, HL, 2.6), arrow(104, 58, 92, 58, HL, 2.6), file(76, 62, 1.0, { mark: 'zip', col: C.gold }), arrow(52, 58, 64, 60, C.grey, 1.6), ring(76, 62, 16)),
  'osfil.zip-fil': all(file(60, 58, 2.6, { mark: 'zip', col: C.gold }), greyed(file(16, 92, 0.6, { mark: 'lines' }), file(104, 92, 0.6, { mark: 'photo' })), ring(60, 58, 34, 40)),
  'osfil.filstorlek': all(ground, file(22, 90, 0.6, { mark: 'lines' }), file(54, 84, 1.0, { mark: 'lines' }), file(92, 72, 1.6, { mark: 'photo', col: GREEN }), line('M8 104 L112 104', C.ink, 1.2), ...[22, 54, 92].map((x) => line(`M${x} 102 L${x} 106`, C.ink, 1.2)), path('M10 40 L104 22', 'none', HL, 2), ring(92, 72, 24)),
  'osfil.storleksgräns': all(ground, line('M66 14 L66 108', RED, 3), file(30, 76, 0.8, { mark: 'lines' }), arrow(42, 76, 80, 76, GREEN, 2), ok(92, 76, 7), file(30, 36, 1.4, { mark: 'photo', col: GREEN }), arrow(46, 36, 62, 36, C.grey, 2), no(80, 36, 9), frame(14, 14, 50, 44)),
  'osfil.utrymme': all(rect(30, 14, 60, 92, C.white, 3, C.ink, 1.6), rect(34, 74, 52, 28, '#bfd6ee', 1, null), file(46, 88, 0.6, { mark: 'photo', col: GREEN }), file(60, 88, 0.6, { mark: 'lines' }), file(74, 88, 0.6, { mark: 'note', col: C.purple }), rect(35, 19, 50, 50, 'none', 2, HL, 2.4), arrow(102, 64, 102, 24, HL, 2), arrow(102, 24, 102, 64, HL, 2)),
  'osfil.ladda-upp': all(ground, laptop(60, 104, 0.8, file(0, -20, 0.6, { mark: 'photo', col: GREEN })), arrow(60, 66, 60, 40, HL, 4), cloudShape(60, 24, 1.8), greyed(arrow(96, 40, 96, 64, C.grey, 2)), ring(60, 52, 10, 16)),
  'osfil.lösenordsskydda': all(file(48, 52, 2.2, { mark: 'lines' }), lock(78, 72, 1.4), rect(18, 92, 84, 14, C.white, 3, C.ink, 1.3), dots(30, 99, 8, 8, 2.2), ring(78, 72, 18)),
  // ── 3727 Uppdateringar och drivrutiner ───────────────────────────
  'osfil.uppdatering.2': all(phone(60, 62, 1.6, all(appTile(0, -10, 1.4, BLUE, roundArrows(0, 0, 3.2, C.white, 1.4)), progress(-10, 6, 20, 0.7), circle(8, -17, 3.6, RED, C.ink, 0.6))), ring(60, 46, 14), greyed(phone(14, 96, 0.4))),
  'osfil.version': all(ground, ...[0, 1, 2].map((i) => all(box(26 + i * 34, 86 - i * 6, 1.1 + i * 0.15, i === 2 ? '#e0b23c' : '#c8a070'), num(String(i + 1), 26 + i * 34, 62 - i * 9, 12, i === 2 ? HL : C.ink))), arrow(34, 40, 92, 30, C.grey, 1.6), ring(94, 72, 20, 30)),
  'osfil.operativsystem': all(laptop(60, 92, 1.4, all(gear(0, -20, 9, BLUE))), file(16, 30, 0.7, { mark: 'lines' }), folder(104, 30, 0.6), printer(16, 76, 0.55), mouse(104, 76, 0.38), line('M24 36 L50 52 M96 34 L70 52 M28 74 L44 68 M96 72 L78 66', HL, 1.6, '3 2'), ring(60, 64, 18)),
  'osfil.bugg': all(monitor(win(18, 22, 84, 46, all(lines(24, 34, 60, 5, 6, C.ink), rect(22, 45, 76, 7, '#f6c6c6', 1, null), lines(24, 48, 40, 1, 6, RED), bug(80, 48, 0.7))), { bar: false }), ring(80, 48, 12)),
  'osfil.hänga-sig': all(monitor(all(win(20, 22, 80, 46, all(lines(26, 34, 40, 3, 6, C.ink), rect(20, 28, 80, 40, 'rgba(255,255,255,0.5)', 0, null), spinner(60, 48, 7))), cursor(66, 54, 0.6)), { bar: false }), clock(14, 100, 8, 10), arrow(26, 100, 36, 100, C.grey, 1.4), clock(46, 100, 8, 25), frame(18, 20, 84, 50)),
  'osfil.drivrutin': all(ground, laptop(26, 96, 0.6), printer(96, 92, 0.8), line('M44 96 L80 96', C.ink, 1.4), file(60, 60, 1.2, { mark: 'gear', col: BLUE }), arrow(48, 64, 34, 74, HL, 2), arrow(72, 64, 86, 74, HL, 2), ring(60, 60, 18)),
};
