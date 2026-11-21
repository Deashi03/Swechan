/**
 * Teknik & digital värld → Programmering & AI → Mjukvaruarkitektur, 3831–3837 (0.56): modules and dependencies, APIs and
 * interfaces, databases, authentication and authorisation, version control, automated testing, deployment.
 * Recurring signs: code is a dark editor window with coloured lines and the code signs { } ( ) = ; a module is a coloured
 * block with white code lines; a package is a cardboard box with { } on the front; a server is a grey rack with green lights;
 * a database is a blue cylinder; the cloud is a pale grey cloud; a version is a small file with a digit; a commit is a dot on
 * a line. The part the word names is ringed or framed in orange, and a grey copy shows what the word is not.
 * Close words get one clear contrast each: modul (a block lifted out of a whole) / integrera (a piece from outside slotting
 * in); bibliotek (a shelf of code books) / paket (one box) / pakethanterare (a
 * conveyor from the cloud with a version list) / importera (a box landing on line 1 of the file); källkod (editor → 0 1) /
 * öppen källkod (open padlock, many people); API (a service hatch in a server wall) / gränssnitt (plug and socket) /
 * användargränssnitt (a thumb on screen buttons); autentisering (face = ID card) / auktorisering (one door open, two locked);
 * versionshantering (a row of numbered files with faces) / commit (a camera snapping the code into one dot) / återställa (a
 * broken file turned back into a whole one); manuell (a hand with a pencil) / automatiserad (a robot arm);
 * testmiljö (grey dummies in a sandbox) / produktionsmiljö (a crowd of real people); driftsättning (laptop → server) /
 * distribution (one box → many phones).
 * Digits and code signs only; no words, no letters, no brands, no logos and no pointing fingers.
 * Verbs and process words move (swark-* classes; base state = the poster frame, transform and opacity only).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL } from './people';
import { P, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const CODE = '#263040';
const CY = '#f2c14e';
const CB = '#7ec8f0';
const CG = '#9be08a';
const CP = '#f0a0c8';
const BOX = '#d4a373';
const BOX2 = '#b8864f';
const BOX3 = '#e6c391';
const RACK = '#5a6472';
const DB = '#4a7fc0';
const DB2 = '#7fa9dc';
const GREEN = '#3a9a5a';
const RED = '#d8343a';
const BLUE = '#3a6ab0';
const STEEL = '#8c96a3';
const PAPER = '#fbfbf8';
const SCREEN = '#eaf4fb';
const BP = '#3b6db3';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Digits and code signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.24));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.24));
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey, sw = 1.3) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * gap} L${f1(x + w - (i % 3) * w * 0.18)} ${y + i * gap}`, col, sw)));

// ── Code things ──────────────────────────────────────────────────────
const CC = [CB, CY, CG, CP];
/** Coloured code lines: n lines from (x, y), w wide, with indents. */
const code = (x: number, y: number, w: number, n: number, gap = 5, sw = 1.8) => all(...Array.from({ length: n }, (_, i) => {
  const ind = [0, 5, 5, 10, 5, 0][i % 6]!, a = f1(w * (0.25 + (i % 2) * 0.1)), b = f1(w * (0.55 - (i % 3) * 0.12));
  return all(line(`M${x + ind} ${y + i * gap} L${f1(x + ind + a)} ${y + i * gap}`, CC[i % 4]!, sw), line(`M${f1(x + ind + a + 3)} ${y + i * gap} L${f1(x + ind + a + 3 + b - ind)} ${y + i * gap}`, CC[(i + 2) % 4]!, sw));
}));
/** Dark editor window with three dots and code lines. */
const editor = (x: number, y: number, w: number, h: number, n = 0, o: { grey?: boolean } = {}) => {
  const k = all(rect(x, y, w, h, CODE, 3, C.ink, 1.4), rect(x, y, w, 7, '#3a465a', 3, null), circle(x + 5, y + 3.5, 1.4, RED, null), circle(x + 9.5, y + 3.5, 1.4, CY, null), circle(x + 14, y + 3.5, 1.4, CG, null),
    n ? code(x + 6, y + 13, w - 12, n, Math.min(6, (h - 16) / Math.max(1, n - 1))) : '');
  return o.grey ? greyed(k) : k;
};
/** A module block: coloured rounded rectangle with white code lines and an optional icon. */
const block = (x: number, y: number, w: number, h: number, col: string, icon: Svg = '') => all(rect(x, y, w, h, col, 4, C.ink, 1.4), lines(x + 4, y + h - 9, w - 8, 2, 4, 'rgba(255,255,255,0.85)', 1.4), icon);
/** Cardboard box with { } on the front; (x, y) = centre of the front, s = 1 is 28 wide. */
const pkg = (x: number, y: number, s = 1, o: { open?: boolean; grey?: boolean } = {}) => {
  const k = at(x, y, s, path('M-14 -8 L-6 -14 L20 -14 L14 -8 Z', BOX3, C.ink, 1.2), path('M14 -8 L20 -14 L20 8 L14 14 Z', BOX2, C.ink, 1.2), rect(-14, -8, 28, 22, BOX, 1, C.ink, 1.3),
    num('{ }', 0, 7, 9, C.ink),
    o.open ? all(path('M-14 -8 L-20 -16 L-6 -20 L-6 -14 Z', BOX3, C.ink, 1.1), path('M14 -8 L22 -20 L26 -18 L20 -14 Z', BOX3, C.ink, 1.1)) : line('M-10 -11 L16 -11', BOX2, 1));
  return o.grey ? greyed(k) : k;
};
/** Server rack; (x, y) = top-left, 26 × 36 at s = 1. */
const rack = (x: number, y: number, s = 1, lit: string = GREEN) => at(x, y, s, rect(0, 0, 26, 36, RACK, 2, C.ink, 1.4), ...[0, 1, 2].map((i) => all(rect(3, 4 + i * 11, 20, 8, '#3d4450', 1, null), circle(19, 8 + i * 11, 1.5, lit, null), line(`M6 ${8 + i * 11} L13 ${8 + i * 11}`, '#8a93a0', 1.2))));
/** Database cylinder; (x, y) = centre of the top. */
const db = (x: number, y: number, s = 1, col: string = DB) => at(x, y, s, path('M-16 0 L-16 26 C-16 32 16 32 16 26 L16 0', col, C.ink, 1.4), path('M-16 9 C-16 15 16 15 16 9 M-16 18 C-16 24 16 24 16 18', 'none', DB2, 1.4), ellipse(0, 0, 16, 5, DB2, C.ink, 1.4));
const cloudShape = (x: number, y: number, s = 1, fill: string = '#e6ebf0') => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', fill, C.ink, 1.4));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCREEN, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', C.grey, C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '', scr: string = SCREEN) => at(x, y, s, rect(-16, -28, 32, 56, C.dark, 5, C.ink, 1.6), rect(-13.4, -23, 26.8, 45, scr, 1.6, null), inner);
/** Head and shoulders; (x, y) = head centre. */
const bust = (x: number, y: number, col: string, s = 1, mood: 'smile' | 'shock' | 'calm' | 'frown' = 'smile', grey = false) => {
  const sk = grey ? C.grey2 : C.skin, hair = grey ? C.grey : C.hair, top = grey ? C.grey : col;
  return at(x, y, s, path('M-12 20 C-12 9 12 9 12 20 Z', top, C.ink, 1.2), circle(0, 0, 7.5, sk, C.ink, 1.2), path('M-7.5 -1.5 C-7.5 -10 7.5 -10 7.5 -1.5 C4 -5 -4 -5 -7.5 -1.5 Z', hair, null),
    mood === 'shock' ? all(circle(-2.6, 0, 1.2, C.ink, null), circle(2.6, 0, 1.2, C.ink, null), ellipse(0, 4, 1.3, 1.7, C.ink, null))
      : mood === 'calm' ? all(line('M-4 0 L-1.4 0 M1.4 0 L4 0', C.ink, 1.1), line('M-2 4 L2 4', C.ink, 1))
        : mood === 'frown' ? all(circle(-2.6, 0, 1.1, C.ink, null), circle(2.6, 0, 1.1, C.ink, null), path('M-2.6 4.6 Q0 2.6 2.6 4.6', 'none', C.ink, 1))
          : all(circle(-2.6, 0, 1.1, C.ink, null), circle(2.6, 0, 1.1, C.ink, null), path('M-2.6 3 Q0 5.4 2.6 3', 'none', C.ink, 1)));
};
const key = (x: number, y: number, s = 1, col: string = C.gold, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-12, 0, 8, col, C.ink, 1.4), circle(-12, 0, 3, PAPER, C.ink, 1), rect(-5, -2.6, 24, 5.2, col, 1, C.ink, 1.3), rect(10, 2, 3, 5, col, 0.5, C.ink, 1), rect(15, 2, 3, 7, col, 0.5, C.ink, 1));
const lock = (x: number, y: number, s = 1, open = false, col: string = C.gold) => at(x, y, s, path(open ? 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -14' : 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -12 L6 -4', 'none', C.ink, 3), rect(-10, -5, 20, 16, col, 3, C.ink, 1.6), circle(0, 2, 2, C.ink, null), line('M0 2 L0 7', C.ink, 1.6));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r * 0.7)} ${f1(y + Math.sin(a) * r * 0.7)} L${f1(x + Math.cos(a) * r * 1.15)} ${f1(y + Math.sin(a) * r * 1.15)}`, col, r * 0.45); }), circle(x, y, r * 0.8, col, C.ink, 1), circle(x, y, r * 0.32, C.white, C.ink, 0.8));
/** File icon centred on (x, y); s = 1 is 20 × 26. */
const file = (x: number, y: number, s = 1, o: { col?: string; grey?: boolean; inner?: Svg; broken?: boolean } = {}) => at(x, y, s,
  path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', o.grey ? C.grey2 : PAPER, C.ink, 1.4), path('M4 -13 L4 -7 L10 -7', '#dde3ea', C.ink, 1.1), rect(-10, 9, 20, 4, o.col ?? BLUE, 0, null),
  path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', 'none', C.ink, 1.4), o.inner ?? lines(-6, -5, 12, 3, 4, C.grey, 1.2), o.broken ? path('M-2 -13 L2 -4 L-3 1 L3 7 L0 13', 'none', RED, 1.8) : '');
/** A small form/table grid: cols × rows cells of cw × rh. */
const grid = (x: number, y: number, cols: number, rows: number, cw: number, rh: number, o: { head?: string; hlRow?: number; hlCol?: number; fill?: string } = {}) => all(
  rect(x, y, cols * cw, rows * rh, o.fill ?? PAPER, 1, C.ink, 1.2),
  o.head ? rect(x, y, cols * cw, rh, o.head, 1, null) : '',
  o.hlRow !== undefined ? rect(x, y + o.hlRow * rh, cols * cw, rh, '#ffe0c2', 0, null) : '',
  o.hlCol !== undefined ? rect(x + o.hlCol * cw, y, cw, rows * rh, '#ffe0c2', 0, null) : '',
  ...Array.from({ length: rows - 1 }, (_, i) => line(`M${x} ${y + (i + 1) * rh} L${x + cols * cw} ${y + (i + 1) * rh}`, C.ink, 0.8)),
  ...Array.from({ length: cols - 1 }, (_, i) => line(`M${x + (i + 1) * cw} ${y} L${x + (i + 1) * cw} ${y + rows * rh}`, C.ink, 0.8)),
  rect(x, y, cols * cw, rows * rh, 'none', 1, C.ink, 1.2));
const dots = (x: number, y: number, n: number, gap = 5, r = 1.6, col: string = C.ink) => all(...Array.from({ length: n }, (_, i) => circle(x + i * gap, y, r, col, null)));
const avatar = (x: number, y: number, r = 10, col = '#7ab0e8') => all(circle(x, y, r, col, C.ink, 1.4), circle(x, y - r * 0.25, r * 0.36, C.white, null), path(`M${f1(x - r * 0.6)} ${f1(y + r * 0.7)} C${f1(x - r * 0.6)} ${f1(y + r * 0.1)} ${f1(x + r * 0.6)} ${f1(y + r * 0.1)} ${f1(x + r * 0.6)} ${f1(y + r * 0.7)}`, C.white, null));
const clock = (x: number, y: number, r: number, mins: number) => { const a = (mins / 60) * Math.PI * 2 - Math.PI / 2; return all(circle(x, y, r, C.white, C.ink, 1.4), line(`M${x} ${y} L${x} ${f1(y - r * 0.55)}`, C.ink, 1.6), line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.8)} ${f1(y + Math.sin(a) * r * 0.8)}`, RED, 1.4)); };
const coin = (x: number, y: number, r = 6) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.6, 'none', C.ink, 0.7));
const thumb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), path('M-5 7 L-5 22 L6 22 L6 7', C.skin, C.ink, 1.1));
const magnifier = (x: number, y: number, s = 1) => at(x, y, s, line('M7 7 L16 16', C.dark, 4), circle(0, 0, 9, 'rgba(220,240,252,0.55)', C.ink, 2));
const door = (x: number, y: number, open: boolean, col = '#a0673d') => all(rect(x, y, 22, 40, open ? '#2b2a33' : col, 1, C.ink, 1.4), open ? path(`M${x} ${y} L${x - 8} ${y + 4} L${x - 8} ${y + 44} L${x} ${y + 40} Z`, col, C.ink, 1.2) : circle(x + 17, y + 22, 1.6, C.gold, null));
const dashed = (d: string, col: string = C.grey) => line(d, col, 1.4, '3 3');
const robotArm = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, 30, 20, 8, STEEL, 2, C.ink, 1.3), path('M0 32 L-6 4', 'none', '#f0a030', 7), path('M0 32 L-6 4', 'none', C.ink, 1), circle(0, 32, 4, STEEL, C.ink, 1.2), path('M-6 4 L14 -6', 'none', '#f0a030', 6), circle(-6, 4, 3.4, STEEL, C.ink, 1.2), path('M14 -6 L20 -2 M14 -6 L18 -12', 'none', C.ink, 2));
const miniFig = (x: number, y: number, col: string, s = 1, grey = false) => at(x, y, s, path('M-6 14 C-6 5 6 5 6 14 Z', grey ? C.grey : col, C.ink, 1), circle(0, 0, 4.6, grey ? C.grey2 : C.skin, C.ink, 1), grey ? '' : path('M-4.6 -1 C-4.6 -6.5 4.6 -6.5 4.6 -1 C2.4 -3 -2.4 -3 -4.6 -1 Z', C.hair, null));
/** A git line: dots at xs on y, joined. */
const commitLine = (xs: number[], y: number, col: string, r = 4) => all(line(`M${xs[0]} ${y} L${xs[xs.length - 1]} ${y}`, col, 2.6), ...xs.map((x) => circle(x, y, r, PAPER, col, 2.2)));

export const SWARCH_MOTIFS: Record<string, Svg> = {
  // ── 3831 Moduler och beroenden ───────────────────────────────────
  'swark.modul.2': all(ground, rect(14, 40, 92, 66, '#eef1f4', 6, C.ink, 1.6),
    block(20, 46, 38, 26, BLUE, coin(39, 56, 5)), block(62, 76, 38, 24, C.purple, all(rect(74, 80, 14, 10, PAPER, 1, C.ink, 0.8), line('M74 83 L88 83', RED, 2))), block(20, 76, 38, 24, GREEN, all(circle(39, 84, 4, PAPER, C.ink, 0.9), path('M36 86 L42 86', 'none', C.ink, 1))),
    dashed('M62 46 L100 46 L100 72 L62 72 Z', C.grey),
    waBob('swark-modul-1', 4, block(64, 14, 38, 26, C.orange, all(path('M83 18 C78 18 78 25 83 30 C88 25 88 18 83 18 Z', RED, C.ink, 0.9), circle(83, 22, 1.6, PAPER, null)))), arrow(83, 42, 83, 50, HL, 2), frame(61, 11, 44, 32)),
  'swark.källkod': all(editor(6, 18, 70, 66, 0), num('{', 13, 34, 10, CY), code(20, 32, 46, 1), num('=', 22, 46, 9, CP), code(30, 44, 36, 1), num('( )', 28, 58, 9, CB), code(40, 56, 26, 1), num('}', 13, 72, 10, CY), code(20, 70, 40, 1),
    frame(3, 15, 76, 72), arrow(80, 50, 92, 50, C.grey, 2), greyed(rect(94, 26, 22, 48, C.white, 2, C.ink, 1.2), num('0 1', 105, 40, 7), num('1 0', 105, 52, 7), num('1 1', 105, 64, 7)), ground),
  'swark.arkitektur.2': all(rect(8, 12, 104, 86, BP, 2, C.ink, 1.6), ...Array.from({ length: 9 }, (_, i) => line(`M${8 + (i + 1) * 10.4} 12 L${8 + (i + 1) * 10.4} 98`, '#5a89c8', 0.6)), ...Array.from({ length: 7 }, (_, i) => line(`M8 ${12 + (i + 1) * 10.8} L112 ${12 + (i + 1) * 10.8}`, '#5a89c8', 0.6)),
    rect(16, 24, 22, 32, 'none', 3, C.white, 1.6), circle(27, 51, 1.6, C.white, null), rect(50, 22, 24, 16, 'none', 2, C.white, 1.6), rect(50, 46, 24, 16, 'none', 2, C.white, 1.6), path('M86 30 L86 52 C86 56 104 56 104 52 L104 30', 'none', C.white, 1.6), ellipse(95, 30, 9, 3, 'none', C.white, 1.6),
    line('M38 40 L50 30 M38 40 L50 54 M74 30 L86 38 M74 54 L86 46', C.white, 1.4), rect(50, 72, 54, 16, 'none', 2, C.white, 1.4), line('M62 62 L62 72 M92 56 L92 72', C.white, 1.4),
    g('translate(28 86) rotate(-35)', rect(-3, -20, 6, 34, C.yellow, 1, C.ink, 1.2), path('M-3 14 L0 20 L3 14 Z', C.skin2, C.ink, 1)), frame(5, 9, 110, 92), ground),
  'swark.bibliotek.2': all(ground, rect(8, 18, 62, 88, '#a0673d', 2, C.ink, 1.6), rect(12, 22, 54, 38, '#7d4f2c', 1, null), rect(12, 64, 54, 38, '#7d4f2c', 1, null),
    ...[0, 1, 2, 3, 4].map((i) => all(rect(14 + i * 10.4, 26, 9, 33, [BLUE, GREEN, C.purple, RED, C.orange][i]!, 1, C.ink, 1), num('{}', 18.5 + i * 10.4, 46, 5, C.white))),
    ...[0, 1, 2, 3].map((i) => all(rect(14 + i * 10.4, 68, 9, 33, [C.orange, BLUE, C.purple, GREEN][i]!, 1, C.ink, 1), num('{}', 18.5 + i * 10.4, 88, 5, C.white))),
    dashed('M56 68 L65 68 L65 101 L56 101'), editor(76, 52, 40, 40, 5), waIn('swark-bibliotek-1', -24, 0, g('translate(84 30) rotate(15)', rect(-4.5, -16, 9, 33, GREEN, 1, C.ink, 1), num('{}', 0, 3, 5, C.white))), arrow(70, 62, 84, 70, HL, 2), ring(84, 32, 10, 20)),
  'swark.paket.2': all(ground, pkg(54, 76, 2.1, { open: true }), waBob('swark-paket-1', 3, code(36, 24, 34, 3, 6, 2.4)), rect(88, 94, 24, 12, C.white, 2, C.ink, 1.2), num('1.2', 100, 103, 8, C.ink), line('M88 100 L82 96', C.ink, 1), ring(58, 70, 38, 36)),
  'swark.pakethanterare': all(ground, cloudShape(24, 22, 1.4), path('M30 34 C40 60 60 64 74 70', 'none', C.grey2, 7), dashed('M30 34 C40 60 60 64 74 70', C.grey),
    waIn('swark-pakethanterare-1', -30, -30, pkg(38, 50, 0.55), pkg(52, 60, 0.55)), pkg(66, 66, 0.55),
    laptop(86, 104, 0.7, all(rect(-20, -32, 16, 12, C.yellow, 1, C.ink, 0.8), ...[0, 1, 2].map((i) => all(ok(4, -29 + i * 8, 2.6), num(['1.2', '3.0', '2.4'][i]!, 14, -27 + i * 8, 4.5))))),
    frame(60, 70, 52, 42)),
  'swark.importera.2': all(editor(30, 22, 84, 80, 0), num('1', 37, 39, 6, C.grey), num('2', 37, 52, 6, C.grey), num('3', 37, 63, 6, C.grey), num('4', 37, 74, 6, C.grey), num('5', 37, 85, 6, C.grey),
    rect(42, 31, 66, 11, '#3d5a3d', 2, null), code(46, 50, 56, 4, 11), waIn('swark-importera-1', -40, 0, pkg(70, 37, 0.42), line('M48 36 L60 36', CG, 2)), frame(40, 29, 70, 15),
    pkg(14, 70, 0.7, { grey: true }), arrow(14, 58, 30, 42, HL, 2.2), ground),
  'swark.beroende.3': all(ground, pkg(30, 26, 1.1), line('M30 41 L30 56', C.ink, 2.4), dashed('M26 41 L26 56 M34 41 L34 56', C.ink), block(14, 56, 32, 26, BLUE, num('{ }', 30, 68, 8, C.white)), ok(30, 96, 6),
    greyed(dashed('M74 12 L102 12 L102 38 L74 38 Z', C.ink), line('M88 41 L88 50', C.ink, 2.4), g('translate(88 92) rotate(18)', block(-16, -13, 32, 26, BLUE)), path('M80 104 L84 98 L88 104 L92 98', 'none', C.ink, 1.4)), no(108, 76, 6), arrow(48, 70, 66, 86, C.grey, 1.4), ring(30, 46, 22, 42)),
  'swark.öppen-källkod': all(editor(32, 46, 56, 44, 4), lock(60, 32, 1, true, CG), ring(60, 28, 14),
    ...[[12, 30, C.orange], [12, 70, C.purple], [108, 30, GREEN], [108, 70, BLUE], [24, 100, RED], [96, 100, C.orange]].map(([x, y, c]) => miniFig(x as number, y as number, c as string, 1.1)),
    line('M20 38 L32 52 M20 78 L32 72 M100 38 L88 52 M100 78 L88 72 M30 100 L42 90 M90 100 L78 90', HL, 1.6, '2 2'), ground),
  'swark.teknisk-skuld': all(ground, g('translate(40 0) rotate(-6 0 112)', ...[0, 1, 2, 3, 4].map((i) => block(-16 + (i % 2) * 5, 90 - i * 18, 32, 16, [BLUE, GREEN, C.purple, C.orange, BLUE][i]!)),
    rect(-14, 70, 24, 5, '#e8e0c8', 1, C.ink, 0.8), rect(-6, 34, 24, 5, '#e8e0c8', 1, C.ink, 0.8), path('M-12 58 L14 50', 'none', '#e8e0c8', 4)),
    waShake('swark-teknisk-skuld-1', path('M20 18 L24 10 M28 22 L34 16', 'none', RED, 1.6)), waGrow('swark-teknisk-skuld-2', ...[0, 1, 2, 3, 4].map((i) => all(ellipse(92, 104 - i * 6, 12, 4, C.gold, C.ink, 1), ellipse(92, 104 - i * 6, 6, 2, 'none', '#b88a20', 0.8)))),
    num('+%', 92, 68, 11, RED), arrow(62, 90, 76, 90, C.grey, 1.6), frame(18, 6, 50, 106)),
  // ── 3832 API:er och gränssnitt ───────────────────────────────────
  'swark.API': all(ground, phone(22, 70, 1, all(circle(0, -8, 6, C.yellow, null), cloudShape(4, 2, 0.5, C.white))), rect(56, 14, 60, 98, '#c9ced4', 2, C.ink, 1.6), rect(60, 20, 52, 26, '#b7bdc4', 1, null), rack(64, 66, 0.9), rack(88, 66, 0.9),
    rect(66, 30, 40, 22, '#3d4450', 2, C.ink, 1.4), num('( )', 86, 45, 10, CY), frame(62, 26, 48, 30),
    waIn('swark-api-1', -14, 0, arrow(40, 36, 58, 36, HL, 2.6)), arrow(60, 50, 42, 60, BLUE, 2.2), circle(48, 58, 4, C.yellow, C.ink, 0.8)),
  'swark.gränssnitt': all(rect(6, 26, 44, 34, BLUE, 4, C.ink, 1.6), path('M50 34 L62 34 L62 38 L58 38 L58 48 L62 48 L62 52 L50 52 Z', '#c0c6cc', C.ink, 1.4), rect(64, 26, 50, 34, GREEN, 4, C.ink, 1.6), path('M64 34 L62 34 M64 52 L62 52', 'none', C.ink, 1.4), rect(64, 37, 6, 12, '#2a3a2a', 1, null),
    frame(46, 22, 28, 42), lines(12, 36, 26, 3, 6, 'rgba(255,255,255,0.8)'), gear(94, 43, 7, '#cfe8d4'),
    greyed(rect(6, 76, 44, 30, BLUE, 4, C.ink, 1.4), path('M50 84 L62 84 L64 90 L62 98 L50 98 Z', '#c0c6cc', C.ink, 1.2), rect(70, 76, 44, 30, GREEN, 4, C.ink, 1.4), rect(70, 82, 6, 4, '#2a3a2a', 1, null), rect(70, 94, 6, 4, '#2a3a2a', 1, null)), no(66, 108, 5)),
  'swark.användargränssnitt': all(phone(56, 58, 1.8, all(rect(-11, -20, 22, 5, BLUE, 1, null), rect(-11, -12, 10, 8, C.orange, 2, C.ink, 0.6), rect(1, -12, 10, 8, GREEN, 2, C.ink, 0.6), rect(-11, -1, 22, 4, C.white, 2, C.ink, 0.5), circle(-4, 1, 2, BLUE, null), rect(-8, 7, 16, 7, C.purple, 3, C.ink, 0.6), dots(-6, 18, 3, 6, 1.2, C.grey))),
    frame(30, 15, 52, 86), waBob('swark-anvandargranssnitt-1', 5, thumb(66, 82, 1.6)), ring(56, 79, 18, 9)),
  'swark.protokoll.3': all(ground, laptop(20, 34, 0.45, lines(-20, -30, 40, 3, 6)), laptop(100, 34, 0.45, lines(-20, -30, 40, 3, 6)), line('M20 40 L20 106 M100 40 L100 106', C.grey, 1.6, '4 3'),
    ...[0, 1, 2, 3].map((i) => all(i % 2 ? arrow(96, 50 + i * 15, 24, 56 + i * 15, BLUE, 2) : arrow(24, 50 + i * 15, 96, 56 + i * 15, HL, 2), num(String(i + 1), 60, 50 + i * 15, 8, C.ink))),
    rect(46, 8, 28, 22, PAPER, 2, C.ink, 1.2), ...[0, 1, 2].map((i) => all(ok(52, 14 + i * 6, 2.2), line(`M57 ${14 + i * 6} L69 ${14 + i * 6}`, C.grey, 1.2))), frame(14, 44, 92, 64)),
  'swark.format.2': all(ground, file(40, 58, 3, { inner: all(num('{', -6, -4, 6, C.ink), rect(-4, -1.5, 6, 3, BLUE, 0.5, null), num(':', 3.5, 1.4, 4, C.ink), num('5', 7, 1.4, 4, RED), rect(-4, 3.5, 6, 3, GREEN, 0.5, null), num(':', 3.5, 6.4, 4, C.ink), num('8', 7, 6.4, 4, RED), num('}', -6, 11.5, 6, C.ink)) }), frame(8, 16, 64, 84),
    gear(94, 36, 9, BLUE), ok(106, 24, 6), arrow(74, 44, 84, 40, C.grey, 1.6), greyed(file(96, 84, 1.1, { inner: all(dots(-6, -4, 3, 4), dots(-4, 2, 2, 6), dots(-7, 7, 4, 3)) })), no(108, 74, 5)),
  'swark.begäran': all(ground, rect(52, 72, 66, 8, C.tan, 2, C.ink, 1.4), rect(56, 80, 58, 32, '#c9a46e', 1, C.ink, 1.2), P({ x: 26, top: C.orange, mood: 'smile', h: 0.9 }), P({ x: 98, top: BLUE, mood: 'calm', h: 0.75 }),
    g('translate(58 60) rotate(-8)', rect(-11, -14, 22, 28, PAPER, 1, C.ink, 1.2), num('?', 0, -3, 10, BLUE), lines(-7, 3, 14, 2, 4), line('M-6 11 q3 -3 6 0 t6 0', C.ink, 1)), path('M36 70 L48 62', 'none', C.skin, 5), circle(48, 62, 3, C.skin, C.ink, 1), ring(58, 60, 16, 18)),
  'swark.utbyta': all(ground, laptop(26, 100, 0.65, file(0, -20, 0.6, { col: GREEN })), laptop(94, 100, 0.65, file(0, -20, 0.6, { col: C.purple })),
    waIn('swark-utbyta-1', -20, 0, arrow(36, 44, 84, 44, HL, 2.6), file(60, 34, 0.5, { col: GREEN })), waIn('swark-utbyta-2', 20, 0, arrow(84, 62, 36, 62, BLUE, 2.6), file(60, 72, 0.5, { col: C.purple })), ring(60, 53, 30, 28)),
  'swark.integrera.2': all(ground, phone(48, 62, 1.7, all(rect(-11, -20, 22, 5, BLUE, 1, null), rect(-11, -12, 22, 7, C.white, 1, C.ink, 0.5), rect(-11, 14, 22, 5, C.white, 1, C.ink, 0.5))), dashed('M30 63 L66 63 L66 79 L30 79 Z', HL),
    waIn('swark-integrera-1', 40, -6, rect(32, 64, 33, 14, '#d8ecd0', 1, C.ink, 1), line('M32 70 L65 74 M48 64 L46 78', C.white, 2), path('M54 72 C50 66 50 62 54 62 C58 62 58 66 54 72 Z', RED, C.ink, 0.6)), arrow(108, 50, 90, 62, HL, 2.2), frame(26, 59, 44, 24)),
  'swark.API-nyckel': all(ground, key(60, 50, 2.6, C.gold, -10), num('{ }', 29, 59, 9, C.ink), rect(28, 82, 66, 14, PAPER, 3, C.ink, 1.2), num('8305 2741', 61, 92, 9, C.ink), line('M34 70 L40 82', C.ink, 1), ring(58, 50, 50, 26)),
  // ── 3833 Databaser ───────────────────────────────────────────────
  'swark.relationsdatabas': all(ground, grid(6, 14, 3, 4, 10, 8, { head: '#cfe0f5', hlRow: 2 }), grid(78, 14, 3, 4, 12, 8, { head: '#d8ecd0', hlRow: 1 }), grid(40, 62, 3, 4, 13, 8, { head: '#eddcf5', hlRow: 3 }),
    path('M36 34 C56 34 60 26 78 26', 'none', HL, 2.2), path('M20 46 C20 70 30 90 40 90', 'none', HL, 2.2), path('M96 46 C96 70 90 90 79 90', 'none', HL, 2.2), circle(36, 34, 2, HL, null), circle(78, 26, 2, HL, null), circle(40, 90, 2, HL, null), circle(79, 90, 2, HL, null)),
  'swark.primärnyckel': all(ground, grid(14, 30, 4, 5, 22, 13, { head: '#cfe0f5', hlCol: 0 }), key(25, 18, 0.55, C.gold, 0), ...[1, 2, 3, 4].map((i) => num(String(i), 25, 30 + i * 13 + 9, 9, C.ink)),
    ...[1, 2, 3, 4].map((i) => all(avatar(47, 36.5 + i * 13, 5, i === 2 || i === 4 ? C.orange : ['#7ab0e8', C.orange, GREEN, C.orange][i - 1]!), line(`M58 ${36.5 + i * 13} L76 ${36.5 + i * 13}`, C.grey, 1.4), line(`M80 ${36.5 + i * 13} L96 ${36.5 + i * 13}`, C.grey, 1.4))), frame(12, 28, 26, 69), ring(47, 62.5, 8, 22)),
  'swark.lagring': all(ground, db(60, 64, 1.6), waIn('swark-lagring-1', 0, -30, file(40, 40, 0.6, { col: GREEN }), file(60, 32, 0.6), file(80, 40, 0.6, { col: C.purple })), arrow(60, 46, 60, 58, HL, 2.4), ring(60, 82, 30, 32)),
  'swark.databasfråga': all(ground, db(90, 26, 1), rect(6, 18, 52, 26, CODE, 3, C.ink, 1.4), num('?', 16, 37, 14, CY), code(26, 26, 26, 3, 6), frame(4, 16, 56, 30), waIn('swark-databasfraga-1', -16, 0, arrow(60, 30, 72, 34, HL, 2.4)),
    grid(30, 70, 3, 4, 18, 9, { head: '#cfe0f5', hlRow: 2 }), rect(30, 88, 54, 9, '#ffe0c2', 0, null), grid(30, 70, 3, 4, 18, 9, { head: '#cfe0f5' }), rect(30, 79, 54, 9, '#ffe0c2', 0, null), rect(30, 97, 54, 9, '#ffe0c2', 0, null), grid(30, 70, 3, 4, 18, 9, { fill: 'none', head: '#cfe0f5' }),
    path('M90 58 C92 74 90 82 86 86', 'none', BLUE, 2.2), path('M83 82 L86 88 L90 83 Z', BLUE, null)),
  // ── 3834 Autentisering och auktorisering ─────────────────────────
  'swark.autentisering': all(ground, P({ x: 22, top: C.orange, mood: 'smile', h: 0.95 }), rect(46, 16, 34, 46, C.dark, 3, C.ink, 1.4), rect(49, 19, 28, 34, SCREEN, 1, null), circle(63, 32, 7, C.skin, C.ink, 1),
    path('M51 22 L51 26 M51 22 L55 22 M75 22 L75 26 M75 22 L71 22 M51 50 L51 46 M51 50 L55 50 M75 50 L75 46 M75 50 L71 50', 'none', HL, 1.6), circle(60.5, 31, 0.9, C.ink, null), circle(65.5, 31, 0.9, C.ink, null), path('M60.5 35 Q63 37 65.5 35', 'none', C.ink, 0.8),
    rect(86, 26, 30, 20, PAPER, 2, C.ink, 1.2), circle(95, 34, 4.5, C.skin, C.ink, 0.9), lines(102, 31, 11, 3, 4), num('=', 83, 41, 10, HL), ok(100, 60, 7), frame(44, 14, 74, 54)),
  'swark.auktorisering': all(ground, rect(4, 18, 112, 74, '#eef1f4', 1, null), door(10, 52, false), door(48, 52, true), door(86, 52, false), lock(21, 46, 0.55, false, C.grey), lock(97, 46, 0.55, false, C.grey), no(21, 36, 5), no(97, 36, 5), ok(59, 36, 6),
    P({ x: 60, top: BLUE, mood: 'smile', h: 0.55 }), rect(56, 86, 8, 6, C.yellow, 1, C.ink, 0.8), frame(44, 28, 32, 66)),
  'swark.session.3': all(ground, path('M8 30 L8 76 M30 30 L30 76', 'none', C.grey, 1.4), rect(10, 32, 18, 42, '#a0673d', 1, C.ink, 1.2), arrow(2, 54, 18, 54, GREEN, 3), rect(36, 44, 50, 22, '#ffe0c2', 4, null), laptop(61, 66, 0.55, avatar(0, -20, 8)), clock(61, 92, 9, 30),
    path('M92 30 L92 76 M114 30 L114 76', 'none', C.grey, 1.4), rect(94, 32, 18, 42, '#a0673d', 1, C.ink, 1.2), greyed(arrow(100, 54, 116, 54, C.grey, 3)), frame(34, 26, 54, 80)),
  'swark.kapa.2': all(ground, bust(94, 58, C.dark, 1.6, 'calm'), path('M78 50 C82 40 106 40 110 50 L110 56 C104 48 84 48 78 56 Z', C.dark, null),
    waIn('swark-kapa-1', -16, 0, rect(22, 20, 48, 62, PAPER, 4, C.ink, 1.6), avatar(46, 40, 12), lines(30, 60, 32, 3, 6, C.ink), lock(64, 22, 0.55, true, C.grey), path('M70 54 L84 74', 'none', C.dark, 6), circle(70, 54, 4, C.skin, C.ink, 1.1)),
    greyed(bust(16, 92, C.orange, 0.9, 'shock')), arrow(70, 98, 90, 98, RED, 2.2), ring(46, 50, 30, 36)),
  'swark.intrång.2': all(ground, rect(10, 30, 76, 82, '#d8cfc0', 1, C.ink, 1.6), path('M6 32 L48 8 L90 32 Z', '#a05040', C.ink, 1.6), rect(20, 46, 26, 22, '#2b3544', 1, C.ink, 1.4), rack(23, 50, 0.5), rack(36, 50, 0.5),
    rect(56, 46, 22, 22, '#2b3544', 1, C.ink, 1.4), path('M56 46 L64 54 L60 60 L70 58 L78 68 M64 54 L74 48', 'none', C.white, 1.2), waPulse('swark-intrang-1', circle(80, 18, 6, RED, C.ink, 1.2), line('M72 12 L68 8 M88 12 L92 8 M80 8 L80 4', RED, 1.4)),
    P({ x: 98, top: C.dark, mood: 'calm', h: 0.75 }), path('M90 66 L78 58', 'none', C.dark, 5), ring(67, 57, 15)),
  // ── 3835 Versionshantering med Git ───────────────────────────────
  'swark.versionshantering': all(ground, line('M10 60 L110 60', BLUE, 2.4), ...[0, 1, 2, 3].map((i) => all(file(20 + i * 27, 38, 0.9, { inner: num(String(i + 1), 0, 2, 9, BLUE) }), circle(20 + i * 27, 60, 4, PAPER, BLUE, 2), avatar(20 + i * 27, 78, 6, [C.orange, GREEN, C.purple, C.orange][i]), clock(20 + i * 27, 98, 5, i * 15))),
    path('M100 18 C80 6 40 6 22 20', 'none', HL, 2), path('M18 16 L22 24 L26 16 Z', HL, null), frame(6, 22, 108, 86)),
  'swark.kodförråd': all(ground, rect(36, 18, 48, 72, '#8a93a0', 3, C.ink, 1.6), ...[0, 1, 2].map((i) => all(rect(40, 22 + i * 22, 40, 18, '#c9ced4', 2, C.ink, 1.2), rect(54, 29 + i * 22, 12, 3, C.dark, 1, null), g(`translate(${48 + i * 6} ${30 + i * 22}) scale(0.4)`, path('M-14 -10 L-4 -10 L-1 -7 L14 -7 L14 10 L-14 10 Z', C.yellow, C.ink, 2)))), num('{ }', 60, 102, 10, C.ink),
    laptop(14, 70, 0.32), laptop(106, 70, 0.32), laptop(14, 40, 0.32), laptop(106, 40, 0.32), line('M26 34 L36 40 M26 64 L36 60 M94 34 L84 40 M94 64 L84 60', BLUE, 1.6, '3 2'), frame(32, 14, 56, 80)),
  'swark.klona.2': all(ground, rect(6, 26, 40, 56, '#8a93a0', 3, C.ink, 1.6), g('translate(26 46) scale(0.8)', path('M-14 -10 L-4 -10 L-1 -7 L14 -7 L14 10 L-14 10 Z', C.yellow, C.ink, 1.6)), clock(26, 68, 7, 40), num('=', 60, 60, 16, HL),
    laptop(94, 100, 0.7, ''), waGrow('swark-klona-1', g('translate(94 66) scale(0.55)', rect(-20, -28, 40, 56, '#8a93a0', 3, C.ink, 2), g('translate(0 -8) scale(0.8)', path('M-14 -10 L-4 -10 L-1 -7 L14 -7 L14 10 L-14 10 Z', C.yellow, C.ink, 2)), clock(0, 14, 7, 40))), ring(94, 66, 18, 22)),
  'swark.gren.4': all(ground, commitLine([12, 34, 56, 78, 100], 80, BLUE, 4.5), path('M34 80 C44 80 44 44 56 44 L100 44', 'none', HL, 3.2), ...[56, 78, 100].map((x) => circle(x, 44, 4.5, PAPER, HL, 2.4)), ring(76, 44, 34, 13)),
  'swark.commit': all(ground, editor(8, 14, 54, 44, 5), at(84, 36, 1, rect(-18, -12, 36, 24, C.dark, 4, C.ink, 1.4), circle(0, 0, 8, '#5a6a80', C.ink, 1.4), circle(0, 0, 4, '#9ab0cc', null), rect(8, -16, 8, 5, C.dark, 1, C.ink, 1)), waPulse('swark-commit-1', path('M60 10 L64 4 M66 14 L72 10 M58 20 L64 20', 'none', C.yellow, 2)),
    commitLine([14, 40, 66, 92], 88, BLUE, 4), circle(92, 88, 6.5, C.yellow, C.ink, 1.6), rect(78, 96, 32, 12, PAPER, 2, C.ink, 1), lines(82, 102, 24, 1, 4), ring(92, 88, 11), dashed('M84 50 L92 78', HL)),
  'swark.parallellt': all(ground, line('M8 30 L112 30 M8 58 L112 58', C.grey2, 8), waIn('swark-parallellt-1', -36, 0, miniFig(84, 22, C.orange, 1.2)), waIn('swark-parallellt-2', -36, 0, miniFig(84, 50, BLUE, 1.2)), arrow(20, 44, 70, 44, HL, 2), clock(104, 44, 7, 0), frame(4, 14, 112, 52),
    greyed(line('M8 92 L112 92', C.grey2, 8), miniFig(30, 84, C.grey, 1, true), num('→', 52, 96, 12), miniFig(76, 84, C.grey, 1, true), clock(104, 92, 6, 30))),
  'swark.konflikt.2': all(ground, file(60, 74, 2.2, { inner: all(lines(-6, -6, 12, 1, 4), rect(-7, -2, 14, 4, '#f6c6c6', 1, null), lines(-6, 6, 12, 1, 4)) }),
    waIn('swark-konflikt-1', -16, -10, rect(6, 22, 34, 16, PAPER, 2, C.orange, 2), line('M10 30 L34 30', C.orange, 2.4)), waIn('swark-konflikt-2', 16, -10, rect(80, 22, 34, 16, PAPER, 2, BLUE, 2), line('M84 30 L108 30', BLUE, 2.4)), arrow(30, 40, 50, 66, C.orange, 2), arrow(90, 40, 70, 66, BLUE, 2),
    waShake('swark-konflikt-3', path('M60 46 L54 56 L60 56 L54 66', 'none', RED, 2.6)), frame(42, 64, 36, 14)),
  'swark.återställa.2': all(ground, file(28, 60, 1.6, { broken: true, col: RED }), no(40, 34, 6), file(92, 60, 1.6, { col: GREEN }), ok(104, 34, 6), arrow(46, 60, 72, 60, C.grey, 1.6),
    waSway('swark-aterstalla-1', 25, path('M60 92 A16 16 0 1 1 76 76', 'none', HL, 3.2), path('M54 88 L60 98 L66 88 Z', HL, HL, 1)), ring(92, 60, 22, 26)),
  // ── 3836 Automatiserad testning ──────────────────────────────────
  'swark.manuell': all(ground, rect(10, 20, 62, 84, PAPER, 2, C.ink, 1.4), ...[0, 1, 2, 3, 4].map((i) => all(rect(16, 28 + i * 15, 9, 9, C.white, 1, C.ink, 1), i < 3 ? path(`M17 ${32 + i * 15} L20 ${35 + i * 15} L26 ${27 + i * 15}`, 'none', GREEN, 2) : '', line(`M30 ${33 + i * 15} L62 ${33 + i * 15}`, C.grey, 1.4))),
    g('translate(30 80) rotate(-35)', rect(-3, -22, 6, 30, C.yellow, 1, C.ink, 1.2), path('M-3 -22 L0 -28 L3 -22 Z', C.skin2, C.ink, 1)),
    g('translate(40 92) rotate(-35)', rect(-8, 6, 16, 30, C.orange, 3, C.ink, 1.4), ellipse(0, 2, 9, 8, C.skin, C.ink, 1.3), path('M-6 -4 C-8 -9 -4 -10 -2 -6', C.skin, C.ink, 1.1)), ring(36, 82, 20),
    greyed(robotArm(96, 56, 0.9))),
  'swark.automatiserad': all(ground, laptop(42, 104, 0.9, all(rect(-23, -32, 46, 26, CODE, 1, null), code(-19, -27, 34, 4, 5))), robotArm(92, 62, 1.5), waSpin('swark-automatiserad-1', 4, gear(98, 24, 8, STEEL)), waSpin('swark-automatiserad-2', 3, gear(112, 38, 5, STEEL)), ring(96, 66, 22, 40)),
  'swark.enhetstest': all(ground, greyed(block(4, 20, 26, 18, BLUE), block(4, 44, 26, 18, C.purple), block(90, 20, 26, 18, C.orange), block(90, 44, 26, 18, BLUE)), rect(36, 92, 48, 8, STEEL, 2, C.ink, 1.3), line('M60 92 L60 80', C.ink, 2),
    block(40, 56, 40, 24, GREEN, num('f( )', 60, 70, 8, C.white)), magnifier(60, 40, 1.1), ok(84, 56, 7), frame(36, 52, 48, 32)),
  'swark.testfall': all(ground, rect(10, 14, 100, 92, PAPER, 3, C.ink, 1.4), ...[0, 1, 2].map((i) => all(rect(18, 24 + i * 26, 18, 16, '#cfe0f5', 2, C.ink, 1), num(['2', '0', '9'][i]!, 27, 36 + i * 26, 10), arrow(40, 32 + i * 26, 54, 32 + i * 26, C.grey, 1.6), rect(58, 24 + i * 26, 18, 16, '#d8ecd0', 2, C.ink, 1), num(['4', '0', '18'][i]!, 67, 36 + i * 26, 10), i === 2 ? no(92, 32 + i * 26, 6) : ok(92, 32 + i * 26, 6))),
    frame(14, 20, 92, 24)),
  'swark.förväntad': all(ground, P({ x: 26, top: C.orange, mood: 'calm', h: 0.8 }), all(ellipse(40, 22, 26, 15, C.white, C.ink, 1.6), circle(30, 42, 3, C.white, C.ink, 1.2), circle(27, 49, 2, C.white, C.ink, 1), num('20', 40, 28, 15, BLUE)), ring(40, 22, 30, 19),
    rect(72, 54, 42, 32, C.dark, 3, C.ink, 1.4), rect(75, 57, 36, 24, SCREEN, 1, null), num('20', 93, 75, 13, BLUE), rect(89, 86, 8, 6, C.dark, 0, null), num('=', 62, 46, 14, C.grey), ok(110, 50, 6)),
  'swark.fallera': all(ground, rect(14, 12, 92, 92, C.dark, 3, C.ink, 1.6), rect(18, 16, 84, 84, CODE, 1, null), ...[0, 1, 2, 3].map((i) => all(i === 2 ? '' : ok(30, 30 + i * 19, 6), line(`M42 ${30 + i * 19} L88 ${30 + i * 19}`, i === 2 ? '#f08a8a' : CG, 2.4))),
    waPulse('swark-fallera-1', rect(20, 59, 80, 18, 'rgba(216,52,58,0.35)', 2, null), no(30, 68, 7)), frame(18, 57, 84, 22)),
  'swark.testtäckning': all(ground, editor(6, 14, 62, 90, 0), ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => line(`M14 ${28 + i * 7.4} L${[56, 48, 60, 44, 52, 58, 40, 54, 50, 46][i]} ${28 + i * 7.4}`, i === 3 || i === 7 ? '#6a7484' : CG, 2.6)),
    circle(94, 54, 18, 'none', '#c9ced4', 8), path('M94 36 A18 18 0 1 1 76.9 48.4', 'none', GREEN, 8), num('80%', 94, 58, 9, C.ink), frame(72, 32, 44, 44)),
  // ── 3837 Distribution och driftsättning ──────────────────────────
  'swark.testmiljö': all(ground, rect(8, 50, 104, 58, '#f2e2b8', 6, C.ink, 1.6), rect(8, 50, 104, 58, 'none', 6, '#c9a46e', 4), rack(20, 62, 0.8, CY), phone(60, 82, 0.6, lines(-8, -10, 16, 3, 5)), ...[86, 102].map((x) => greyed(miniFig(x, 72, C.grey, 1.2, true))),
    at(30, 26, 1, path('M-6 -14 L6 -14 M-4 -14 L-4 -4 L-12 12 L12 12 L4 -4 L4 -14', '#e8f4fb', C.ink, 1.4), path('M-9 6 L9 6 L12 12 L-12 12 Z', CG, null)), frame(4, 46, 112, 64)),
  'swark.produktionsmiljö': all(ground, rack(10, 38, 1), rack(10, 76, 0.9), ...[[52, 20, C.orange], [76, 20, BLUE], [100, 20, GREEN], [52, 50, C.purple], [76, 50, RED], [100, 50, C.orange], [52, 80, GREEN], [76, 80, BLUE], [100, 80, C.purple]].map(([x, y, c]) => all(miniFig(x as number, y as number, c as string, 1.25), rect((x as number) + 4, (y as number) + 6, 5, 8, C.dark, 1, null))),
    line('M38 50 L44 34 M38 56 L44 62 M38 86 L44 92', HL, 1.6, '3 2'), waPulse('swark-produktionsmiljo-1', circle(30, 30, 3.4, RED, null)), frame(42, 8, 74, 104)),
  'swark.driftsättning': all(ground, laptop(26, 104, 0.6, code(-18, -28, 34, 3, 6)), rack(80, 30, 1.2), rack(80, 72, 1.1), waIn('swark-driftsattning-1', -44, 30, pkg(58, 40, 0.6), num('2.0', 58, 30, 8, C.ink)), arrow(36, 74, 72, 50, HL, 2.6), waPulse('swark-driftsattning-2', circle(103, 40, 2.4, GREEN, null), circle(103, 53, 2.4, GREEN, null)), frame(76, 26, 40, 50)),
  'swark.drift': all(ground, rack(8, 40, 1.4), rack(46, 40, 1.4), waPulse('swark-drift-1', circle(34.6, 51.2, 2, GREEN, null), circle(72.6, 66.6, 2, GREEN, null)), rect(84, 20, 32, 24, C.dark, 2, C.ink, 1.2), rect(86, 22, 28, 18, '#10131a', 1, null), line('M88 32 L94 32 L96 28 L98 36 L100 32 L112 32', CG, 1.4),
    P({ x: 100, top: C.orange, mood: 'calm', h: 0.6 }), path('M92 72 C92 62 108 62 108 72', 'none', C.dark, 1.6), circle(30, 22, 10, C.white, C.ink, 1.4), path('M24 18 A7 7 0 1 1 26 28', 'none', GREEN, 2), path('M22 14 L24 19 L28 16 Z', GREEN, null), frame(4, 36, 82, 72)),
  'swark.logg.2': all(ground, rect(22, 8, 76, 100, PAPER, 2, C.ink, 1.4), path('M22 8 C14 8 14 20 22 20 M98 108 C106 108 106 96 98 96', 'none', C.ink, 1.2), ...[0, 1, 2, 3].map((i) => all(clock(32, 20 + i * 18, 5, i * 13), [key(48, 20, 0.28, C.gold, 0), no(46, 38, 4), coin(46, 56, 4), key(48, 74, 0.28, C.gold, 0)][i]!, line(`M56 ${20 + i * 18} L88 ${20 + i * 18}`, C.grey, 1.4))),
    waIn('swark-logg-1', 0, 10, clock(32, 92, 5, 55), no(46, 92, 4), line('M56 92 L88 92', C.grey, 1.4)), frame(24, 84, 70, 16)),
  'swark.skala-upp': all(ground, greyed(rack(6, 74, 0.8)), arrow(30, 90, 42, 90, HL, 2.4), waGrow('swark-skala-upp-1', rack(48, 30, 0.9), rack(74, 30, 0.9), rack(48, 72, 0.9), rack(74, 72, 0.9)), ...[[106, 30], [112, 50], [106, 70], [112, 90]].map(([x, y]) => miniFig(x!, y!, BLUE, 0.8)), frame(44, 26, 54, 82)),
  'swark.distribution': all(ground, pkg(60, 60, 1.1), ...[[16, 18], [104, 18], [12, 96], [108, 96], [60, 12]].map(([x, y], i) => all(phone(x!, y!, 0.38, pkg(0, 0, 0.32)), waIn(`swark-distribution-${i + 1}`, f1((60 - x!) * 0.6), f1((60 - y!) * 0.6), arrow(f1(60 + (x! - 60) * 0.32), f1(60 + (y! - 60) * 0.32), f1(60 + (x! - 60) * 0.72), f1(60 + (y! - 60) * 0.72), HL, 2)))), ring(60, 60, 22)),
};
