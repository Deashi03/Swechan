/**
 * Teknik & digital värld → Datorer & internet → Digitala vardagsverktyg, 3761–3767 (0.54): e-mail and inbox, cloud
 * storage, documents and spreadsheets, digital calendars, video-call programs, photo handling, collaboration tools.
 * Recurring signs: text on screens is grey bars, never letters; a mail is a white envelope; a video meeting is a grid
 * of face tiles; a calendar is a week grid with coloured blocks; the part the word names is ringed or framed in orange
 * and grey copies show what the word is not.
 * Close words share one layout where only the marked part differs: kalkylblad/cell (the same grid; all of it, or one
 * cell); gå med/lämna mötet (the same face grid; a person moving into an empty tile, or out of a tile with a red
 * button); typsnitt/fetstil (three different letter shapes, or the same shape thin and thick); inkorg/oläst/skräppost
 * (the tray where mail arrives, one bold unread row, or junk mail turned aside into a grey folder).
 * Digits, the signs @ # = + − ! ? % and ✓ ✗, and the sample glyphs Aa for fonts only; no words, no brands, no logos and
 * no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const BG = '#eef3f7';
const SCR = '#fbfbf8';
const BLUE = '#3a6ab0';
const LINK = '#2f6fd6';
const GREEN = '#3a9a5a';
const RED = '#e2553a';
const YEL = '#f2c14e';
const BAR = '#c3cad2';
const PURPLE = '#6a4a8a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = BG) => rect(4, 4, 112, 108, col, 4, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, r = 5) => rect(x, y, w, h, 'none', r, HL, 2.6);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
const txt = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800, family = 'system-ui,sans-serif', style = 'normal') =>
  `<text x="${x}" y="${y}" font-family="${family}" font-weight="${w}" font-style="${style}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
/** Text drawn as grey bars. */
const bars = (x: number, y: number, w: number, n: number, gap = 5, col: string = BAR, sw = 1.8) => all(...range(n).map((i) => line(`M${x} ${y + i * gap} L${f1(x + w - ((i * 7) % 4) * w * 0.08 - (i === n - 1 ? w * 0.3 : 0))} ${y + i * gap}`, col, sw)));
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };

// ── Icons ────────────────────────────────────────────────────────────
const cursor = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L0 16 L4 12 L7 19 L10 18 L7 11 L12 11 Z', C.white, C.ink, 1.4));
const ibeam = (x: number, y: number, h = 10, col: string = C.ink) => line(`M${x} ${y} L${x} ${y + h} M${x - 2} ${y} L${x + 2} ${y} M${x - 2} ${y + h} L${x + 2} ${y + h}`, col, 1.3);
const pic = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#bfe3f5', 1, C.ink, 0.9), path(`M${x} ${y + h} L${f1(x + w * 0.35)} ${f1(y + h * 0.4)} L${f1(x + w * 0.55)} ${f1(y + h * 0.7)} L${f1(x + w * 0.75)} ${f1(y + h * 0.5)} L${x + w} ${y + h} Z`, '#6fae5a', null), circle(f1(x + w * 0.78), f1(y + h * 0.28), f1(Math.min(w, h) * 0.12), YEL, null), rect(x, y, w, h, 'none', 1, C.ink, 0.9));
const cloud = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M-16 8 C-24 8 -24 -4 -15 -4 C-14 -14 -2 -16 2 -9 C7 -16 19 -12 17 -3 C24 -3 24 8 16 8 Z', fill, C.ink, 1.5));
const docIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-8 -10 L4 -10 L8 -6 L8 10 L-8 10 Z', col, C.ink, 1.3), path('M4 -10 L4 -6 L8 -6', 'none', C.ink, 1), bars(-5, -4, 10, 3, 4, BAR, 1.4));
const noteIcon = (x: number, y: number, s = 1, col: string = PURPLE) => at(x, y, s, path('M0 6 L0 -8 L8 -10 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3, 2.2, col, null), ellipse(5.5, 4, 3, 2.2, col, null));
const avatar = (x: number, y: number, r: number, col = '#7ab0e8') => all(circle(x, y, r, col, C.ink, 1.2), circle(x, f1(y - r * 0.25), f1(r * 0.36), C.white, null), path(`M${f1(x - r * 0.62)} ${f1(y + r * 0.72)} C${f1(x - r * 0.62)} ${f1(y + r * 0.05)} ${f1(x + r * 0.62)} ${f1(y + r * 0.05)} ${f1(x + r * 0.62)} ${f1(y + r * 0.72)}`, C.white, null));
const trash = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 -8 L9 -8 L7 12 L-7 12 Z', '#9aa3ad', C.ink, 1.4), rect(-11, -12, 22, 4, '#7a8590', 1, C.ink, 1.2), line('M-4 -4 L-3 9 M0 -4 L0 9 M4 -4 L3 9', '#5a636e', 1));
const clockIcon = (x: number, y: number, r: number, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${x} ${y} L${x} ${f1(y - r * 0.6)} M${x} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.2)}`, C.ink, 1.2));
const envelope = (x: number, y: number, s = 1, col: string = C.white, open = false) => at(x, y, s, rect(-12, -8, 24, 16, col, 1.5, C.ink, 1.4),
  open ? path('M-12 -8 L0 -16 L12 -8', col, C.ink, 1.2) : '', path('M-12 -8 L0 2 L12 -8', 'none', C.ink, 1.2));
const folder = (x: number, y: number, s = 1, col = '#e0b23c') => at(x, y, s, path('M-16 -12 L-6 -12 L-3 -8 L16 -8 L16 12 L-16 12 Z', col, C.ink, 1.5), path('M-16 -4 L16 -4', 'none', 'rgba(0,0,0,0.15)', 1));
const wifi = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, path('M-14 -4 C-6 -12 6 -12 14 -4', 'none', col, 2.6), path('M-9 1 C-4 -4 4 -4 9 1', 'none', col, 2.6), circle(0, 6, 2.2, col, null));
const camIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, rect(-10, -6, 14, 12, col, 2, C.ink, 1.4), path('M4 -2 L10 -6 L10 6 L4 2 Z', col, C.ink, 1.4));
const slash = (x: number, y: number, r: number) => line(`M${x - r} ${y - r} L${x + r} ${y + r}`, RED, 3);
const chain = (x: number, y: number, s = 1, col: string = LINK) => at(x, y, s, ellipse(-5, 0, 6, 3.6, 'none', col, 1.8), ellipse(5, 0, 6, 3.6, 'none', col, 1.8));
const hangup = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), path(`M${f1(x - r * 0.6)} ${f1(y + r * 0.15)} C${f1(x - r * 0.3)} ${f1(y - r * 0.35)} ${f1(x + r * 0.3)} ${f1(y - r * 0.35)} ${f1(x + r * 0.6)} ${f1(y + r * 0.15)}`, 'none', C.white, r * 0.3));

// ── Devices ──────────────────────────────────────────────────────────
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCR, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', '#9aa3ad', C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '', col: string = C.dark) => at(x, y, s, rect(-14, -24, 28, 48, col, 4, C.ink, 1.6), rect(-11.5, -19, 23, 37, SCR, 1.4, null), inner);
const monitor = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, SCR, 1, null), inner, path(`M${f1(x + w / 2 - 5)} ${y + h} L${f1(x + w / 2 + 5)} ${y + h} L${f1(x + w / 2 + 8)} ${y + h + 7} L${f1(x + w / 2 - 8)} ${y + h + 7} Z`, '#9aa3ad', C.ink, 1.4), rect(f1(x + w / 2 - 14), y + h + 7, 28, 3, '#9aa3ad', 1, C.ink, 1.2));
const desk = (y = 86) => all(rect(4, y, 112, 6, '#c8a070', 1, C.ink, 1.4), line(`M12 ${y + 6} L12 112 M108 ${y + 6} L108 112`, '#a0673d', 3));

// ── Mail parts ───────────────────────────────────────────────────────
/** One row in a mail list: an envelope and grey bars; unread rows are bold with a blue dot. */
const mailRow = (x: number, y: number, w: number, unread = false) => all(rect(x, y, w, 14, unread ? '#eaf2fc' : C.white, 2, C.grey2, 0.8),
  unread ? circle(x + 5, y + 7, 2.2, LINK, null) : '', envelope(x + 16, y + 7, 0.42, C.white, !unread),
  line(`M${x + 25} ${y + 5} L${f1(x + w * 0.55)} ${y + 5}`, unread ? C.ink : BAR, unread ? 2.6 : 1.6), line(`M${x + 25} ${y + 10} L${f1(x + w - 8)} ${y + 10}`, unread ? '#7a8590' : BAR, unread ? 1.8 : 1.3));
/** A new-mail window: blue top, a recipient row, a subject row, a body, a send button. */
const mailWin = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, SCR, 3, C.ink, 1.6), rect(x, y, w, 9, BLUE, 3, null),
  line(`M${x + 6} ${y + 4.5} L${x + 22} ${y + 4.5}`, C.white, 1.6), line(`M${x} ${y + 21} L${x + w} ${y + 21} M${x} ${y + 33} L${x + w} ${y + 33}`, C.grey2, 1),
  avatar(x + 9, y + 15, 3.6), line(`M${x + 16} ${y + 15} L${x + 46} ${y + 15}`, '#7a8590', 1.8));

// ── Spreadsheet grid ─────────────────────────────────────────────────
const GRID = { x: 12, y: 30, cw: 16, ch: 11, cols: 6, rows: 6 };
const VALS = [[12, 40, 7, 25, 18], [30, 15, 22, 9, 41], [8, 27, 35, 14, 6], [19, 42, 11, 28, 33], [24, 5, 16, 37, 20]];
const grid = (marked: [number, number] | null = null) => {
  const { x, y, cw, ch, cols, rows } = GRID, W = cw * cols, H = ch * rows;
  return all(rect(x, y - 12, W, 10, GREEN, 2, C.ink, 1), rect(x + 4, y - 9, 18, 4, '#e8f4ec', 1, null),
    rect(x, y, W, H, C.white, 1, C.ink, 1.4), rect(x, y, W, ch, '#e3e7eb', 0, null), rect(x, y, cw, H, '#e3e7eb', 0, null),
    ...range(cols - 1).map((i) => line(`M${x + cw * (i + 1)} ${y} L${x + cw * (i + 1)} ${y + H}`, C.grey2, 0.8)),
    ...range(rows - 1).map((j) => line(`M${x} ${y + ch * (j + 1)} L${x + W} ${y + ch * (j + 1)}`, C.grey2, 0.8)),
    ...range(rows - 1).map((j) => txt(x + cw / 2, y + ch * (j + 1) + 8, String(j + 1), 6.5, '#7a8590', 700)),
    ...range(rows - 1).flatMap((j) => range(cols - 1).map((i) => (marked && marked[0] === i && marked[1] === j) ? '' : txt(x + cw * (i + 1) + cw / 2, y + ch * (j + 1) + 8, String(VALS[j]![i]), 6.5, C.dark, 600))),
    rect(x, y, W, H, 'none', 1, C.ink, 1.4));
};

// ── Calendar week grid ───────────────────────────────────────────────
const CAL = { x: 10, y: 30, w: 100, h: 72, cols: 5, rows: 6 };
const cw = CAL.w / CAL.cols, chh = (CAL.h - 10) / CAL.rows;
const week = () => all(rect(CAL.x, CAL.y, CAL.w, CAL.h, C.white, 3, C.ink, 1.5), rect(CAL.x, CAL.y, CAL.w, 10, '#d9534f', 3, null), rect(CAL.x, CAL.y + 6, CAL.w, 4, '#d9534f', 0, null),
  ...range(CAL.cols).map((i) => txt(f1(CAL.x + cw * i + cw / 2), CAL.y + 8, String(i + 7), 7, C.white, 800)),
  ...range(CAL.cols - 1).map((i) => line(`M${f1(CAL.x + cw * (i + 1))} ${CAL.y + 10} L${f1(CAL.x + cw * (i + 1))} ${CAL.y + CAL.h}`, C.grey2, 0.8)),
  ...range(CAL.rows - 1).map((j) => line(`M${CAL.x} ${f1(CAL.y + 10 + chh * (j + 1))} L${CAL.x + CAL.w} ${f1(CAL.y + 10 + chh * (j + 1))}`, '#e6e9ec', 0.8)));
const block = (col: number, row: number, len: number, fill: string, stroke: string | null = C.ink, dash = false) =>
  `<rect x="${f1(CAL.x + cw * col + 2)}" y="${f1(CAL.y + 10 + chh * row + 1)}" width="${f1(cw - 4)}" height="${f1(chh * len - 2)}" rx="2" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.2"${dash ? ' stroke-dasharray="3 2"' : ''}` : ''}/>`;
const blockC = (col: number, row: number, len: number): [number, number] => [f1(CAL.x + cw * col + cw / 2), f1(CAL.y + 10 + chh * row + (chh * len) / 2)];

// ── Video-meeting grid ───────────────────────────────────────────────
const face = (x: number, y: number, s: number, hair: string, skin = '#f1c7a5', shirt = BLUE) => at(x, y, s, path('M-12 14 C-12 4 12 4 12 14 Z', shirt, null), circle(0, -2, 7, skin, C.ink, 0.9), path('M-7 -4 C-7 -12 7 -12 7 -4 C4 -8 -4 -8 -7 -4 Z', hair, null));
const tile = (x: number, y: number, w: number, h: number, inner: Svg = '', bgc = '#3d4250') => all(rect(x, y, w, h, bgc, 2, '#1f232b', 1), g(`translate(${f1(x + w / 2)} ${f1(y + h * 0.58)})`, inner));
const FACES: [string, string, string][] = [['#2f2521', '#f1c7a5', BLUE], ['#c4542a', '#f6d2b8', GREEN], ['#f0cf6b', '#e8b890', '#e07a3a'], ['#2f2521', '#c98d68', PURPLE]];
/** 2×2 grid of faces in a dark meeting window; `empty` leaves one tile dashed and empty. */
const meet = (x: number, y: number, w: number, h: number, empty = -1, skip = -1) => {
  const tw = (w - 9) / 2, th = (h - 18) / 2;
  return all(rect(x, y, w, h, '#1f232b', 3, C.ink, 1.6),
    ...range(4).map((i) => { const tx = x + 3 + (i % 2) * (tw + 3), ty = y + 3 + Math.floor(i / 2) * (th + 3); const [hc, sk, sh] = FACES[i]!;
      return i === empty ? rect(tx, ty, tw, th, 'none', 2, '#8a93a0', 1.2) + `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="2" fill="none" stroke="#c9d0d8" stroke-width="1.2" stroke-dasharray="3 2"/>`
        : i === skip ? '' : tile(tx, ty, tw, th, face(0, 0, th / 30, hc, sk, sh)); }),
    rect(x + w / 2 - 22, y + h - 11, 44, 8, '#2b2f38', 4, null), circle(x + w / 2 - 12, y + h - 7, 2.4, '#c9d0d8', null), circle(x + w / 2, y + h - 7, 2.4, '#c9d0d8', null), circle(x + w / 2 + 12, y + h - 7, 2.6, RED, null));
};

// ── Pages ────────────────────────────────────────────────────────────
const sheet = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.white, 2, C.ink, 1.5), inner);
const tinted = (x: number, y: number, w: number, h: number, tint: string, op = 0.35) => all(pic(x, y, w, h), `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tint}" opacity="${op}"/>`);
const gray = (...k: Svg[]) => `<g style="filter:grayscale(1)">${k.join('')}</g>`;
const elephant = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 16, 11, '#9aa3ad', C.ink, 1.4), ...[-10, -4, 5, 11].map((lx) => rect(lx - 2.5, 7, 5, 10, '#9aa3ad', 1, C.ink, 1.2)),
  circle(16, -8, 9, '#9aa3ad', C.ink, 1.4), ellipse(11, -8, 5, 7, '#b7bec6', C.ink, 1.2), circle(19, -10, 1.2, C.ink, null),
  path('M23 -4 C30 0 30 12 24 13 C19 14 18 8 22 7', 'none', C.ink, 4.4), path('M23 -4 C30 0 30 12 24 13 C19 14 18 8 22 7', 'none', '#9aa3ad', 2.6));
const sunBig = (x: number, y: number, r: number) => all(...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 10))} ${f1(y + Math.sin(a) * (r + 10))}`, '#f5b83a', 2.4); }), circle(x, y, r, YEL, '#e0a020', 1.6));
const burst = (x: number, y: number, r: number, col: string = '#fff4b0') => { const p: string[] = []; for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; const rr = i % 2 ? r * 0.45 : r; p.push(`${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`); } return path(`M${p.join(' L')} Z`, col, '#e0b23c', 1.2); };
const house = (x: number, y: number, s = 1, col = '#e8d3b0', roof = '#c84a3a') => at(x, y, s, rect(-12, -10, 24, 20, col, 1, C.ink, 1.3), path('M-15 -10 L0 -22 L15 -10 Z', roof, C.ink, 1.3), rect(-3, 0, 6, 10, '#a0673d', 1, C.ink, 1), rect(-10, -6, 5, 5, '#bfe3f5', 0.5, C.ink, 0.8));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.5, 0, 3, 8, '#7a5030', 0.5, null), path('M0 -16 L8 2 L-8 2 Z', '#3f8a4f', C.ink, 1));
const mini = (x: number, y: number, s = 1, top: string = C.orange, long = true) => g(`translate(${x} ${y}) scale(${s})`, all(rect(-6, -2, 12, 12, top, 3, C.ink, 1), circle(0, -7, 5, C.skin, C.ink, 1), long ? path('M-5 -8 C-5 -14 5 -14 5 -8 C3 -11 -3 -11 -5 -8 Z', C.hair, null) : path('M-5 -8 C-5 -13 5 -13 5 -8 Z', C.hair, null)));

export const DIGTOOLS_MOTIFS: Record<string, Svg> = {
  // ── 3761 E-post och inkorg ───────────────────────────────────────────
  /** e-post: a laptop on the left and a phone on the right; a white envelope flies from the laptop to the phone along an orange arc, and a second envelope flies back below; the upper envelope is ringed. */
  'digverk.e-post': all(bg(), ground, laptop(28, 92, 0.62, all(envelope(0, -20, 0.8))), phone(96, 84, 0.8, envelope(0, 0, 0.6)),
    carr(36, 58, 60, 18, 88, 50, HL, 2.6), envelope(60, 32, 1.1), carr(84, 98, 62, 110, 44, 98, C.grey, 1.6, '3 2'), envelope(62, 100, 0.55, C.white), ring(60, 32, 17)),
  /** e-postadress: a contact card with a round profile picture and a white strip below it: grey bars, the sign @, grey bars, a dot and a short bar; the whole strip is ringed. */
  'digverk.e-postadress': all(bg(), rect(10, 22, 100, 72, C.white, 5, C.ink, 1.8), avatar(32, 46, 14), line('M54 40 L96 40', '#7a8590', 3), line('M54 50 L84 50', BAR, 2.2),
    rect(16, 70, 88, 14, '#f4f6f8', 7, C.grey, 1.2), line('M22 77 L46 77', C.dark, 3.4), txt(54, 81.5, '@', 12, C.ink, 800), line('M62 77 L84 77', C.dark, 3.4), circle(88, 80, 1.3, C.ink, null), line('M92 77 L98 77', C.dark, 3.4),
    oval(60, 77, 50, 12)),
  /** snabel-a: a big orange @ sign on the right, ringed; on the left a small grey elephant whose long nose curls the same way as the tail of the @. */
  'digverk.snabel-a': all(bg(), ground, elephant(30, 92, 1), carr(58, 82, 62, 70, 58, 62, C.grey, 1.4, '2 2'), txt(82, 78, '@', 52, HL, 800), ring(82, 62, 27)),
  /** inkorg: a big blue tray, open at the top; three envelopes fall down into it along an orange arrow; a red round badge with the digit 3 sits on its corner; the tray is framed. */
  'digverk.inkorg': all(bg(), envelope(46, 16, 0.6), envelope(66, 24, 0.6), envelope(54, 38, 0.6), arr(80, 14, 80, 48, HL, 3),
    path('M16 60 L36 60 L42 72 L78 72 L84 60 L104 60 L104 100 L16 100 Z', '#cfe0f4', C.ink, 1.8), path('M16 60 L28 50 L92 50 L104 60', 'none', C.ink, 1.4),
    envelope(60, 64, 0.55), circle(102, 58, 7, RED, C.ink, 1.2), txt(102, 61.5, '3', 9, C.white, 900), frame(12, 46, 96, 58, 6)),
  /** mejla: a woman sits at a desk with a laptop; an envelope flies out of the laptop screen up to the right along a dashed orange arrow, with small motion lines; the flying envelope is ringed. */
  'digverk.mejla': all(bg(), ground, person(26, C.orange, { hairStyle: 'long', h: 0.78 }), reach(26, 0.78, 1, 48, 82), desk(86), laptop(62, 86, 0.6, bars(-20, -28, 40, 4, 5)),
    carr(70, 58, 80, 34, 92, 30, HL, 2.2, '3 2'), envelope(98, 26, 0.8), line('M80 20 L86 20 M78 26 L84 26 M80 32 L85 32', C.grey, 1.4), ring(98, 26, 13)),
  /** ämnesrad: a new-mail window with a blue top, a row with a small person icon, then a row with short thick dark bars, then many grey text bars and a send button; the second row (short and thick) is ringed. */
  'digverk.ämnesrad': all(bg(), mailWin(10, 12, 100, 96), line('M18 39 L58 39', C.ink, 3.6), greyed(bars(18, 52, 84, 7, 6)), rect(80, 96, 24, 8, BLUE, 3, null), path('M88 98 L98 100 L88 102 Z', C.white, null), oval(60, 39, 48, 9)),
  /** oläst (om mejl): a list of four mails; three rows are grey with open envelopes and thin bars; one row is pale blue with a blue dot, a closed envelope and thick dark bars, and it is ringed. */
  'digverk.oläst': all(bg(), rect(8, 16, 104, 86, SCR, 3, C.ink, 1.6), rect(8, 16, 104, 9, BLUE, 3, null),
    greyed(mailRow(12, 30, 96), mailRow(12, 66, 96), mailRow(12, 84, 96)), mailRow(12, 48, 96, true), oval(60, 55, 54, 12)),
  /** svara alla: a woman in the middle answers a mail; from her, four envelopes fly at the same time to four people around her (two on each side) along orange arrows; all four arrows are coloured. */
  'digverk.svara-alla': all(bg(), ground, person(60, C.orange, { hairStyle: 'long', h: 0.62 }),
    ...[[16, 30], [40, 14], [80, 14], [104, 30]].map(([x, y]) => all(avatar(x!, y!, 7), arr(60, 58, f1(x! + (60 - x!) * 0.3), f1(y! + 12), HL, 2), envelope(f1(x! + (60 - x!) * 0.55), f1(y! + (58 - y!) * 0.55 + 4), 0.38))),
    carr(28, 70, 22, 90, 40, 96, C.grey, 1.6, '3 2'), envelope(22, 64, 0.5)),
  /** skräppost: at the top a white tray takes two normal envelopes with a green tick; below, envelopes with red ! and % signs are turned aside along an orange arrow into a grey folder with a red cross; the grey folder is ringed. */
  'digverk.skräppost': all(bg(), path('M10 30 L22 30 L26 38 L50 38 L54 30 L66 30 L66 50 L10 50 Z', '#cfe0f4', C.ink, 1.4), envelope(30, 24, 0.5), envelope(46, 20, 0.5), ok(60, 18, 6),
    envelope(86, 28, 0.7, '#fde8e2'), txt(86, 33, '!!!', 8, RED, 900), envelope(96, 50, 0.7, '#fde8e2'), txt(96, 55, '%', 9, RED, 900),
    carr(90, 62, 88, 80, 72, 86, HL, 2.6), greyed(folder(46, 88, 1.5)), no(66, 100, 7), envelope(40, 86, 0.5, '#fde8e2'), ring(48, 88, 26)),
  /** signatur (i ett mejl): an open mail with grey text bars; at the bottom, under a thin line, a block with a round profile picture, a dark name bar, a small phone and a row of digits; this block is framed. */
  'digverk.signatur': all(bg(), rect(10, 10, 100, 100, SCR, 3, C.ink, 1.6), rect(10, 10, 100, 9, BLUE, 3, null), greyed(bars(18, 28, 84, 7, 6)), line('M18 72 L60 72', C.grey, 1),
    avatar(28, 86, 8), line('M42 81 L80 81', C.ink, 3), rect(42, 88, 6, 10, C.dark, 1.5, null), txt(70, 96, '070 123', 8, '#5a636e', 700), frame(14, 74, 92, 30, 4)),
  /** frånvaromeddelande: a laptop on a desk in front of an empty chair; an envelope comes in from the left; at once another envelope with a small sun and a calendar with crossed-out days goes back along an orange arrow; the returning envelope is ringed. */
  'digverk.frånvaromeddelande': all(bg(), ground, rect(76, 60, 22, 26, '#7a8590', 3, C.ink, 1.4), rect(78, 86, 3, 26, '#5a636e', 1, null), rect(93, 86, 3, 26, '#5a636e', 1, null), desk(88), laptop(60, 88, 0.55, envelope(0, -20, 0.7)),
    arr(6, 74, 34, 74, C.grey, 1.8), envelope(14, 66, 0.5), carr(48, 50, 30, 56, 20, 46, HL, 2.4), envelope(36, 30, 1.1),
    at(30, 20, 1, circle(0, 0, 4, YEL, '#e0a020', 1), ...range(6).map((i) => line(`M${f1(Math.cos(i) * 6)} ${f1(Math.sin(i) * 6)} L${f1(Math.cos(i) * 8)} ${f1(Math.sin(i) * 8)}`, '#e0a020', 1))),
    rect(44, 14, 14, 12, C.white, 1, C.ink, 1), rect(44, 14, 14, 3, '#d9534f', 1, null), line('M46 19 L56 25 M56 19 L46 25', RED, 1.2), ring(38, 28, 20)),

  // ── 3762 Molnlagring ─────────────────────────────────────────────────
  /** moln (på internet): a big white cloud at the top holding a document, a photo and a music note; dashed lines go down from it to a laptop, a phone and a tablet; the cloud is framed. */
  'digverk.moln.2': all(bg('#e4eef8'), cloud(60, 32, 2.6), docIcon(40, 34, 0.8), pic(52, 26, 16, 12), noteIcon(80, 34, 0.9),
    ...[[22, 78], [60, 82], [98, 78]].map(([x, y]) => line(`M60 52 L${x} ${y}`, BLUE, 1.4, '3 2')), laptop(22, 104, 0.4, pic(-16, -32, 32, 22)), phone(60, 96, 0.52, pic(-9, -14, 18, 14)), rect(84, 80, 28, 22, C.dark, 2, C.ink, 1.2), rect(86, 82, 24, 18, SCR, 1, null), pic(88, 84, 20, 14), frame(14, 8, 92, 50, 10)),
  /** komma åt: a woman on a train holds a phone that shows a document; a dashed line goes from a cloud above to the phone with a green tick; far away a grey home computer shows the same document; the phone is ringed. */
  'digverk.komma-åt': all(bg(), rect(4, 94, 112, 18, '#d8dde2', 0, null), line('M4 94 L116 94', C.grey, 1.4), rect(8, 14, 24, 20, '#bfe3f5', 3, C.ink, 1.2), rect(36, 14, 24, 20, '#bfe3f5', 3, C.ink, 1.2),
    person(30, C.orange, { hairStyle: 'long', h: 0.8 }), reach(30, 0.8, 1, 52, 64), phone(58, 62, 0.62, all(docIcon(0, -2, 1.1))), cloud(96, 22, 1.1), line('M90 32 L64 50', BLUE, 1.6, '3 2'), ok(80, 44, 5),
    greyed(monitor(84, 58, 28, 22, docIcon(98, 69, 0.7))), ring(58, 62, 18)),
  /** delad mapp: a big yellow folder in the middle with three small profile pictures on its front; lines go from it to three people around it; the folder is ringed. */
  'digverk.delad-mapp': all(bg(), ground, folder(60, 50, 2.2), avatar(46, 56, 5, '#e07a3a'), avatar(60, 56, 5, '#3a9a5a'), avatar(74, 56, 5, '#7ab0e8'),
    person(16, C.orange, { hairStyle: 'long', h: 0.5 }), person(104, BLUE, { h: 0.5 }), person(60, C.green, { h: 0.34 }), line('M24 76 L38 66 M96 76 L82 66 M60 88 L60 78', C.dark, 1.6, '3 2'), ring(60, 50, 38)),
  /** offline: a laptop shows a document being written (a text cursor); above it a big wifi sign with a red slash across it, ringed; a small green tick next to the document shows that the work goes on. */
  'digverk.offline': all(bg(), ground, desk(90), laptop(60, 90, 1.1, all(rect(-20, -32, 40, 26, C.white, 1, C.grey2, 0.8), bars(-16, -27, 30, 4, 5, '#7a8590', 1.6), ibeam(8, -15, 6))), ok(96, 62, 6),
    wifi(60, 26, 1.7), line('M40 8 L80 44', RED, 4), ring(60, 26, 22)),
  /** gigabyte: a phone shows a storage bar filled with blue, red and green parts and the digit 64 at its end; small photo, film and app icons float into it; the bar is ringed. */
  'digverk.gigabyte': all(bg(), phone(60, 60, 1.9, all(rect(-9, -10, 18, 6, '#e6e9ec', 2, C.ink, 0.6), rect(-9, -10, 7, 6, BLUE, 2, null), rect(-2, -10, 4, 6, RED, 0, null), rect(2, -10, 3, 6, GREEN, 0, null), rect(-9, -10, 18, 6, 'none', 2, C.ink, 0.6))),
    txt(60, 92, '64', 14, C.dark, 900), pic(14, 16, 14, 10), rect(94, 14, 14, 12, '#3d3f4a', 1, C.ink, 1), path('M99 17 L104 20 L99 23 Z', C.white, null), rect(14, 94, 10, 10, GREEN, 2, C.ink, 1),
    carr(28, 24, 40, 36, 44, 42, C.grey, 1.4, '2 2'), carr(94, 24, 82, 34, 78, 42, C.grey, 1.4, '2 2'), oval(60, 47, 22, 10)),

  // ── 3763 Dokument och kalkylblad ─────────────────────────────────────
  /** ordbehandlingsprogram: a big laptop screen with a toolbar of small buttons (a thick stroke, a slanted stroke, an underline, a list), and a white page with lines of grey text and a text cursor; the screen is framed. */
  'digverk.ordbehandlingsprogram': all(bg(), laptop(60, 100, 1.55, all(rect(-26, -36, 52, 7, '#dde7f3', 0, null), line('M-22 -32.5 L-19 -32.5', C.ink, 2.4), line('M-15 -31 L-13 -34', C.ink, 1.2), line('M-9 -31 L-6 -31', C.ink, 1), line('M-9 -34 L-6 -34', C.ink, 1), ...[0, 1, 2].map((i) => line(`M0 ${-34.5 + i * 1.6} L6 ${-34.5 + i * 1.6}`, C.ink, 0.8)),
    rect(-18, -27, 36, 23, C.white, 0.5, C.grey2, 0.6), line('M-14 -24 L2 -24', C.dark, 1.6), bars(-14, -20, 28, 4, 3.4, BAR, 1.1), ibeam(6, -12, 4))), frame(10, 40, 100, 62, 5)),
  /** typsnitt: a list of three rows, each with the glyphs Aa drawn in a different letter shape (with small feet, plain, and like a typewriter) and a grey bar; the middle row is selected in pale blue; the whole list is framed. */
  'digverk.typsnitt': all(bg(), rect(14, 14, 92, 92, C.white, 4, C.ink, 1.6), rect(18, 46, 84, 26, '#eaf2fc', 3, null),
    txt(38, 40, 'Aa', 22, C.ink, 400, 'Georgia,Times New Roman,serif'), txt(38, 68, 'Aa', 22, C.ink, 400, 'DejaVu Sans,Verdana,Arial,sans-serif'), txt(38, 98, 'Aa', 21, C.ink, 400, 'DejaVu Sans Mono,Menlo,Consolas,monospace'),
    line('M60 33 L94 33', BAR, 2), line('M60 61 L90 61', BAR, 2), line('M60 91 L96 91', BAR, 2), frame(10, 10, 100, 100, 6)),
  /** fetstil: on the left a thin grey Aa, an orange arrow, and on the right the same Aa very thick and black; under them a line of thin grey text bars where one piece is thick and black, and it is ringed. */
  'digverk.fetstil': all(bg(), txt(32, 54, 'Aa', 28, '#8a93a0', 200, 'Verdana,Arial,sans-serif'), arr(52, 44, 64, 44, HL, 3), txt(88, 54, 'Aa', 28, C.ink, 900, 'Verdana,Arial,sans-serif'),
    rect(10, 72, 100, 30, C.white, 3, C.ink, 1.4), line('M16 82 L36 82', BAR, 1.8), line('M40 82 L70 82', C.ink, 4.4), line('M74 82 L104 82', BAR, 1.8), line('M16 92 L96 92', BAR, 1.8), oval(55, 82, 19, 7)),
  /** stavningskontroll: a page of grey text bars; one bar has a red wavy line under it and is ringed; a small box below it offers two other dark bars, one with a green tick. */
  'digverk.stavningskontroll': all(bg(), rect(10, 10, 100, 98, C.white, 3, C.ink, 1.6), bars(18, 22, 84, 3, 8), line('M18 46 L36 46', BAR, 2), line('M40 46 L68 46', C.dark, 2.2),
    path('M40 50 q1.75 -2.5 3.5 0 t3.5 0 t3.5 0 t3.5 0 t3.5 0 t3.5 0 t3.5 0 t3.5 0', 'none', RED, 1.4), line('M72 46 L100 46', BAR, 2),
    rect(36, 56, 50, 30, '#f6f8fa', 3, C.ink, 1.2), line('M44 65 L68 65', C.dark, 2.2), ok(78, 65, 4), line('M44 77 L66 77', '#7a8590', 2), greyed(bars(18, 96, 84, 2, 6)), oval(54, 48, 19, 8)),
  /** infoga: a page with grey text bars above and below an empty dashed box; a picture from the right slides into the box along an orange arrow with a plus sign; the box is ringed. */
  'digverk.infoga': all(bg(), rect(8, 10, 70, 98, C.white, 3, C.ink, 1.6), bars(14, 20, 58, 3, 7), `<rect x="16" y="44" width="54" height="30" rx="2" fill="#f4f8fc" stroke="${HL}" stroke-width="1.6" stroke-dasharray="4 3"/>`, bars(14, 84, 58, 3, 7),
    pic(86, 46, 26, 20), carr(96, 70, 92, 84, 66, 66, HL, 2.4), circle(104, 32, 7, GREEN, C.ink, 1.2), line('M100 32 L108 32 M104 28 L104 36', C.white, 2), ring(43, 59, 32)),
  /** mall: on the left an empty page with only dashed boxes (a box for a heading, a box for a picture, dashed lines for text), ringed; orange arrows go to two smaller filled-in pages on the right with the same layout but real pictures and text. */
  'digverk.mall': all(bg(), sheet(8, 16, 50, 76, all(...[[14, 22, 38, 7], [14, 34, 20, 18]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="none" stroke="#7a8590" stroke-width="1.2" stroke-dasharray="3 2"/>`),
    ...range(4).map((i) => line(`M14 ${60 + i * 7} L52 ${60 + i * 7}`, '#9aa3ad', 1.2, '3 2')), line('M38 38 L52 38 M38 45 L50 45', '#9aa3ad', 1.2, '3 2'))),
    ...[[76, 12], [76, 64]].map(([x, y]) => all(sheet(x!, y!, 34, 44, all(rect(x! + 4, y! + 4, 26, 5, BLUE, 1, null), pic(x! + 4, y! + 12, 13, 12), bars(x! + 20, y! + 14, 10, 2, 4, BAR, 1.2), bars(x! + 4, y! + 30, 26, 3, 4, BAR, 1.2))))),
    arr(60, 40, 72, 32, HL, 2.2), arr(60, 68, 72, 80, HL, 2.2), ring(33, 54, 34)),
  /** kalkylblad: a whole spreadsheet: a green strip at the top, a grid of cells with digits, grey headings with row numbers on the left; the whole grid is framed. */
  'digverk.kalkylblad': all(bg(), grid(), frame(8, 14, 104, 86, 4)),
  /** cell (i ett kalkylblad): the same spreadsheet grid, but grey; only one single cell is white with a thick orange border and the digit 42 in it. */
  'digverk.cell.2': all(bg(), greyed(grid([2, 2])), rect(GRID.x + GRID.cw * 3, GRID.y + GRID.ch * 3, GRID.cw, GRID.ch, C.white, 0, HL, 2.6), txt(GRID.x + GRID.cw * 3.5, GRID.y + GRID.ch * 3 + 8, '42', 7.5, C.ink, 900)),
  /** formel (i ett kalkylblad): a bar at the top shows = 120+80+50 and is ringed; below, a column of cells with 120, 80 and 50, and the last cell shows the answer 250, joined to the bar by an orange arrow. */
  'digverk.formel.2': all(bg(), rect(10, 12, 100, 16, C.white, 3, C.ink, 1.4), txt(60, 24, '=120+80+50', 11, C.ink, 700, 'Menlo,Consolas,monospace'), oval(60, 20, 48, 11),
    ...['120', '80', '50'].map((v, i) => all(rect(36, 40 + i * 14, 48, 14, C.white, 0, C.grey, 1), txt(72, 50 + i * 14, v, 9, C.dark, 600))),
    rect(36, 82, 48, 16, '#fff3e6', 0, HL, 2.4), txt(72, 94, '250', 11, C.ink, 900), line('M36 81 L84 81', C.ink, 1.4), carr(100, 30, 108, 70, 88, 88, HL, 2)),

  // ── 3764 Digitala kalenderverktyg ────────────────────────────────────
  /** kalenderinbjudan: an opened envelope at the bottom; a card comes up out of it with a small calendar page (one day orange), a clock, three small profile pictures and two buttons, a green tick and a red cross; the card is ringed. */
  'digverk.kalenderinbjudan': all(bg(), rect(26, 14, 68, 70, C.white, 4, C.ink, 1.6), rect(34, 22, 24, 22, C.white, 2, C.ink, 1.2), rect(34, 22, 24, 6, '#d9534f', 2, null),
    ...range(6).map((i) => rect(37 + (i % 3) * 7, 31 + Math.floor(i / 3) * 6, 5, 4, i === 4 ? HL : '#e3e7eb', 0.5, null)), clockIcon(76, 33, 9), avatar(42, 56, 5), avatar(54, 56, 5, '#e07a3a'), avatar(66, 56, 5, '#3a9a5a'),
    ok(48, 72, 6), no(72, 72, 6), path('M14 70 L60 98 L106 70 L106 108 L14 108 Z', '#e8eef4', C.ink, 1.6), path('M14 108 L52 84 M106 108 L68 84', 'none', C.ink, 1), oval(60, 48, 40, 40)),
  /** delad kalender: three small profile pictures in blue, green and orange above a week calendar; the calendar is full of blocks in the same three colours; the whole calendar is framed. */
  'digverk.delad-kalender': all(bg(), avatar(36, 16, 8, '#7ab0e8'), avatar(60, 16, 8, '#7ac08a'), avatar(84, 16, 8, '#f0a060'), week(),
    block(0, 0, 2, '#7ab0e8'), block(1, 1, 1, '#7ac08a'), block(1, 3, 2, '#f0a060'), block(2, 0, 1, '#f0a060'), block(2, 2, 2, '#7ab0e8'), block(3, 1, 2, '#7ac08a'), block(4, 0, 1, '#7ab0e8'), block(4, 3, 2, '#f0a060'), block(0, 4, 2, '#7ac08a'),
    frame(6, 26, 108, 80, 5)),
  /** föreslå en ny tid: a week calendar; one grey block has a red cross; a curved orange arrow goes from it to a new orange block on another day, and a small speech bubble with a question mark is next to the new block; the new block is ringed. */
  'digverk.föreslå-en-ny-tid': all(bg(), week(), block(1, 1, 2, '#c9ced4'), no(...blockC(1, 1, 2), 6), block(3, 3, 2, '#f7c79a', HL), carr(blockC(1, 1, 2)[0] + 8, blockC(1, 1, 2)[1] + 8, 60, 96, blockC(3, 3, 2)[0] - 10, blockC(3, 3, 2)[1] + 4, HL, 2.4),
    path('M92 6 L114 6 L114 22 L100 22 L95 27 L96 22 L92 22 Z', C.white, C.ink, 1.2), txt(103, 19, '?', 12, HL, 900), ring(...blockC(3, 3, 2), 16)),
  /** arrangör: a woman with a clipboard stands on the left; dashed orange arrows carry invitation cards from her to three small people on the right, and their answers come back as a tick, a tick and a cross; the woman is ringed. */
  'digverk.arrangör': all(bg(), ground, person(28, C.orange, { hairStyle: 'long', h: 0.86 }), reach(28, 0.86, 1, 44, 66), rect(42, 56, 14, 18, '#c8a070', 1, C.ink, 1.2), rect(44, 60, 10, 12, C.white, 0.5, null), bars(45, 63, 8, 3, 3, BAR, 1),
    ...[[100, 26], [104, 60], [96, 92]].map(([x, y], i) => all(mini(x!, y!, 1, [BLUE, GREEN, PURPLE][i]!, i === 1), carr(52, 50, 74, y! - 16, x! - 10, y!, HL, 1.6, '3 2'), i === 2 ? no(x! + 10, y! - 10, 4.5) : ok(x! + 10, y! - 10, 4.5))),
    oval(28, 74, 20, 40)),

  // ── 3765 Videosamtalsprogram ─────────────────────────────────────────
  /** möteslänk: a mail with grey text and one blue underlined line with a chain sign and a cursor on it, ringed; an orange arrow goes from it to a small video meeting with four faces. */
  'digverk.möteslänk': all(bg(), rect(6, 14, 64, 88, C.white, 3, C.ink, 1.6), rect(6, 14, 64, 9, BLUE, 3, null), bars(12, 32, 50, 3, 7), chain(18, 62, 0.8), line('M26 62 L60 62', LINK, 2.4), line('M26 65.5 L60 65.5', LINK, 1), cursor(48, 62, 0.8),
    bars(12, 80, 50, 2, 7), oval(38, 63, 30, 9), carr(62, 52, 80, 34, 84, 46, HL, 2.4), meet(72, 50, 44, 40)),
  /** gå med (i ett möte): a dark video meeting with three faces and one empty dashed tile; a woman next to it moves into the empty tile along a green arrow; a green button with a camera is below; the empty tile is ringed. */
  'digverk.gå-med': all(bg(), ground, meet(30, 12, 84, 66, 3), person(14, C.orange, { hairStyle: 'long', h: 0.56 }), carr(22, 64, 50, 104, 84, 62, GREEN, 3), rect(56, 88, 34, 14, GREEN, 7, C.ink, 1.2), camIcon(73, 95, 0.6), ring(93, 49, 18)),
  /** lämna mötet: the same dark video meeting; one face leaves its tile along a red arrow out to the right side, and the red round hang-up button is big below; the button and the leaving face are ringed. */
  'digverk.lämna-mötet': all(bg(), meet(6, 12, 84, 66, -1, 3), at(104, 50, 1, face(0, 0, 0.9, FACES[3]![0], FACES[3]![1], FACES[3]![2])), arr(70, 50, 92, 50, RED, 3), hangup(60, 96, 11), ring(60, 96, 16), ring(104, 52, 14)),
  /** väntrum (i ett videomöte): on the left a screen with one person alone in a tile, a clock and three dots, ringed; on the right a second screen where the host sees a small card with that person and a green tick button. */
  'digverk.väntrum.2': all(bg(), monitor(6, 14, 58, 52, all(tile(12, 20, 46, 40, face(0, 0, 1, FACES[1]![0], FACES[1]![1], FACES[1]![2]), '#5a6070'), clockIcon(51, 27, 5), ...[0, 1, 2].map((i) => circle(28 + i * 7, 54, 1.8, C.white, null)))),
    monitor(70, 40, 44, 40, all(rect(76, 50, 32, 20, C.white, 2, C.ink, 1), avatar(84, 60, 5, '#7ac08a'), ok(100, 60, 5))), line('M64 38 L76 50', C.grey, 1.4, '3 2'), ring(35, 40, 30)),
  /** stänga av kameran: a video meeting with four tiles; one big tile is dark with only a grey round silhouette, and a big camera sign with a red slash across it is ringed. */
  'digverk.stänga-av-kameran': all(bg(), rect(6, 10, 108, 82, '#1f232b', 3, C.ink, 1.6), tile(9, 13, 102, 52, all(circle(0, -6, 12, '#6a7180', null), path('M-20 18 C-20 4 20 4 20 18 Z', '#6a7180', null)), '#2b2f38'),
    ...range(3).map((i) => tile(9 + i * 34.5, 68, 32, 21, face(0, 0, 0.7, FACES[i]![0], FACES[i]![1], FACES[i]![2]))), camIcon(60, 104, 1), slash(60, 104, 10), ring(60, 104, 14)),
  /** textning: a video tile with a speaking man (open mouth, sound waves); under him a dark strip with white text bars across the bottom of the picture; the strip is framed. */
  'digverk.textning': all(bg(), rect(8, 12, 104, 86, '#5a6a80', 3, C.ink, 1.6), at(52, 54, 1.8, face(0, 0, 1, '#2f2521', '#f1c7a5', GREEN)), ellipse(52, 52, 3, 2, '#7a2a2a', null),
    path('M80 40 C86 46 86 54 80 60 M86 34 C96 44 96 56 86 66', 'none', C.white, 1.8), rect(14, 78, 92, 16, 'rgba(0,0,0,0.75)', 2, null), line('M22 83 L98 83', C.white, 2.2), line('M30 89 L84 89', C.white, 2.2), frame(11, 75, 98, 22, 4)),

  // ── 3766 Fotohantering ───────────────────────────────────────────────
  /** blixt (på en kamera): a dark room; a hand holds up a phone, and a bright yellow star of light bursts from its top corner; the light falls on two people, who are lit up; the burst is ringed. */
  'digverk.blixt.2': all(bg('#2b2f3d'), `<path d="M88 30 L10 70 L10 112 L60 112 Z" fill="#fff7c8" opacity="0.35"/>`, person(24, C.orange, { hairStyle: 'long', h: 0.62 }), person(48, BLUE, { h: 0.66 }),
    line('M98 74 L110 112', C.ink, 7.4), line('M98 74 L110 112', C.skin, 5.6), phone(96, 56, 0.8), burst(90, 34, 14), ring(90, 34, 17)),
  /** filter (på ett foto): at the top a normal photo of a landscape; an orange arrow leads down to three copies with different colours (brownish, bluish and black-and-white); the brownish one is ringed. */
  'digverk.filter.2': all(bg(), pic(34, 10, 52, 36), arr(60, 50, 60, 62, HL, 3), tinted(8, 68, 32, 24, '#b07030', 0.45), tinted(44, 68, 32, 24, '#2050c0', 0.35), gray(pic(80, 68, 32, 24)), ring(24, 80, 20)),
  /** självutlösare: on the left a phone on a small three-legged stand shows a big orange 3 and a ticking clock; on the right a family poses, and a woman runs into the picture along a dashed arrow; the phone screen is ringed. */
  'digverk.självutlösare': all(bg(), ground, line('M22 112 L28 84 L34 112 M28 84 L28 112', C.dark, 2), phone(28, 62, 0.85, all(txt(0, 8, '3', 22, HL, 900), clockIcon(7, -12, 4))),
    person(78, C.green, { h: 0.7 }), person(98, BLUE, { h: 0.6 }), person(58, C.orange, { hairStyle: 'long', h: 0.66 }), carr(46, 104, 50, 94, 52, 86, C.grey, 1.4, '2 2'), ring(28, 62, 24)),
  /** panoramabild: a very wide, low photo of a whole mountain valley with a lake; under it a phone moves sideways along a long double orange arrow; the wide photo is framed. */
  'digverk.panoramabild': all(bg(), rect(6, 30, 108, 32, '#bfe3f5', 2, C.ink, 1.4), path('M6 62 L20 42 L32 54 L48 36 L62 52 L76 40 L92 54 L104 44 L114 52 L114 62 Z', '#6fae5a', C.ink, 1), path('M42 42 L48 36 L54 42 Z M72 44 L76 40 L80 44 Z', C.white, null),
    ellipse(60, 58, 20, 3, '#5aa7d6', null), circle(96, 38, 4, YEL, null), phone(60, 92, 0.55, pic(-9, -12, 18, 10)), arr(44, 92, 16, 92, HL, 2.6), arr(76, 92, 104, 92, HL, 2.6), frame(3, 27, 114, 38, 4)),
  /** motljus: a big yellow sun stands behind a person, who is only a black shape against it; in front, a phone screen shows the same black shape on a bright background; the sun behind the person is ringed. */
  'digverk.motljus': all(bg('#f7f0d8'), ground, sunBig(46, 46, 22), person(46, '#1d1f24', { h: 0.85, skin: '#1d1f24', hair: '#1d1f24', bottom: '#1d1f24' }),
    phone(98, 82, 0.7, all(rect(-11.5, -19, 23, 37, '#fff3c0', 1.4, null), circle(0, -6, 6, '#1d1f24', null), path('M-8 18 L-8 4 C-8 0 8 0 8 4 L8 18 Z', '#1d1f24', null))), ring(46, 46, 34)),
  /** dubblett: two photos that are exactly the same stand side by side with an = sign between them; the second photo is ringed, and a small trash can is under it. */
  'digverk.dubblett': all(bg(), rect(8, 30, 44, 36, C.white, 2, C.ink, 1.4), pic(11, 33, 38, 30), txt(60, 54, '=', 20, C.ink, 900), rect(68, 30, 44, 36, C.white, 2, C.ink, 1.4), pic(71, 33, 38, 30), trash(90, 92, 1), ring(90, 48, 28)),

  // ── 3767 Digitala samarbetsverktyg ───────────────────────────────────
  /** samarbetsverktyg: a screen shows one app with three parts: a dark side bar, a chat column with speech bubbles and a column of task cards with ticks; three small profile pictures sit on top of the screen, joined by lines; the screen is framed. */
  'digverk.samarbetsverktyg': all(bg(), avatar(36, 14, 7, '#7ab0e8'), avatar(60, 12, 7, '#f0a060'), avatar(84, 14, 7, '#7ac08a'), line('M43 14 L53 12 M67 12 L77 14', C.dark, 1.2),
    monitor(8, 26, 104, 68, all(rect(11, 29, 12, 62, PURPLE, 1, null), ...range(4).map((i) => rect(14, 34 + i * 10, 6, 6, '#a888c8', 1, null)),
      ...range(3).map((i) => all(avatar(30, 38 + i * 16, 3.6, ['#7ab0e8', '#f0a060', '#7ac08a'][i]!), rect(36, 34 + i * 16, 30, 9, '#eef1f4', 3, null), line(`M39 ${38.5 + i * 16} L60 ${38.5 + i * 16}`, BAR, 1.4))),
      line('M72 30 L72 90', C.grey2, 0.8), ...range(3).map((i) => all(rect(76, 34 + i * 18, 32, 14, C.white, 2, C.grey, 1), line(`M80 ${41 + i * 18} L96 ${41 + i * 18}`, BAR, 1.6), i < 2 ? ok(102, 41 + i * 18, 3.5) : '')))), frame(5, 23, 110, 74, 5)),
  /** kanal (i en chattapp): a chat app; on the left a dark list of rows, each starting with a # sign and a bar; the second row is lit, and it is ringed; the right side shows the messages in that row's group. */
  'digverk.kanal.3': all(bg(), rect(6, 12, 108, 92, SCR, 3, C.ink, 1.6), rect(6, 12, 40, 92, '#3d2d50', 3, null),
    ...range(5).map((i) => all(i === 1 ? rect(9, 22 + i * 15, 34, 12, '#7a5aa8', 2, null) : '', txt(16, 31 + i * 15, '#', 10, i === 1 ? C.white : '#a898b8', 800), line(`M23 ${28 + i * 15} L${36 + (i % 2) * 4} ${28 + i * 15}`, i === 1 ? C.white : '#8a7a9a', 2))),
    ...range(3).map((i) => all(avatar(56, 28 + i * 24, 5, ['#7ab0e8', '#f0a060', '#7ac08a'][i]!), line(`M64 ${25 + i * 24} L84 ${25 + i * 24}`, '#7a8590', 1.8), bars(64, 31 + i * 24, 42, 2, 5, BAR, 1.4))), oval(26, 43, 22, 10)),
  /** delat dokument: one document in the middle with three text cursors in blue, orange and green, each with a small flag; three people at laptops around it are joined to it by lines; the document is ringed. */
  'digverk.delat-dokument': all(bg(), ...[[18, 30], [102, 30], [60, 100]].map(([x, y], i) => all(mini(x!, y! - 20, 0.9, [BLUE, C.orange, GREEN][i]!, i === 1), laptop(x!, y!, 0.3))), line('M28 26 L42 36 M92 26 L78 36 M60 94 L60 84', C.dark, 1.4, '3 2'),
    sheet(40, 26, 40, 56, all(bars(45, 34, 30, 8, 6))), ...[[52, 40, '#3a6ab0'], [66, 58, '#e07a3a'], [48, 70, '#3a9a5a']].map(([x, y, c]) => all(line(`M${x} ${f1((y as number) - 5)} L${x} ${f1((y as number) + 5)}`, c as string, 1.8), rect(x as number, f1((y as number) - 9), 7, 4, c as string, 1, null))),
    ring(60, 54, 32)),
  /** ändringsförslag: a page of grey text bars; one dark bar is crossed out with a red line and a new green bar with a green underline stands after it; a small comment box in the margin has a tick and a cross button; the crossed and new bars are ringed. */
  'digverk.ändringsförslag': all(bg(), rect(8, 10, 74, 98, C.white, 3, C.ink, 1.6), bars(14, 22, 60, 3, 8), line('M14 54 L34 54', C.dark, 2.4), line('M12 54 L36 54', RED, 1.6), line('M40 54 L70 54', GREEN, 2.4), line('M40 57.5 L70 57.5', GREEN, 1),
    bars(14, 70, 60, 4, 8), line('M76 54 L88 54', '#e07a3a', 1, '2 2'), rect(88, 40, 26, 30, '#fff6e0', 3, C.ink, 1.2), avatar(95, 48, 3.5, '#f0a060'), line('M101 48 L110 48', BAR, 1.6), ok(95, 62, 4), no(107, 62, 4), oval(42, 55, 34, 9)),
  /** versionshistorik: three copies of the same document stand in a row with the digits 1, 2 and 3 and a small clock on each; a curved orange arrow goes from the newest (3) back to number 2; the row of versions is framed. */
  'digverk.versionshistorik': all(bg(), ...[0, 1, 2].map((i) => all(sheet(10 + i * 34, 34, 30, 42, all(rect(14 + i * 34, 38, 22, 4, BLUE, 1, null), bars(14 + i * 34, 48, 22, 3 + i, 5, BAR, 1.4))), circle(25 + i * 34, 86, 7, i === 1 ? HL : '#7a8590', C.ink, 1), txt(25 + i * 34, 89.5, String(i + 1), 9, C.white, 900), clockIcon(36 + i * 34, 32, 4))),
    carr(93, 28, 76, 6, 60, 26, HL, 2.6), frame(6, 22, 108, 74, 5)),
  /** distansarbete: three small places far apart (a house in town, a red cottage among fir trees and a flat), each with a tiny person at a laptop; dashed lines join them to one chat bubble in the middle; the whole network is framed. */
  'digverk.distansarbete': all(bg(), house(22, 34, 1.1), mini(22, 52, 0.8, BLUE, false), laptop(30, 62, 0.16), house(96, 34, 1.1, '#b8322a', '#5a3a2a'), tree(80, 30, 0.8), tree(112, 30, 0.7), mini(96, 52, 0.8, C.orange), laptop(104, 62, 0.16),
    rect(46, 78, 28, 30, '#d8dde2', 1, C.ink, 1.2), ...range(4).map((i) => rect(50 + (i % 2) * 12, 82 + Math.floor(i / 2) * 10, 8, 6, '#bfe3f5', 0.5, C.ink, 0.6)), mini(30, 96, 0.8, GREEN), laptop(38, 106, 0.16),
    path('M50 40 C50 30 70 30 70 40 C70 48 64 48 60 48 L56 54 L56 48 C52 48 50 46 50 40 Z', C.white, C.ink, 1.4), line('M55 38 L65 38 M55 42 L62 42', BAR, 1.4), line('M34 46 L50 42 M86 46 L70 42 M38 92 L54 52', C.dark, 1.4, '3 2'), frame(6, 10, 108, 100, 6)),
  /** hybridmöte: a meeting room with a table; two people are at it, and on the wall a big screen shows two more faces in video tiles; the whole room with the screen is framed. */
  'digverk.hybridmöte': all(bg('#f2ede4'), rect(28, 12, 64, 38, C.dark, 3, C.ink, 1.6), tile(31, 15, 28, 32, face(0, 0, 0.95, FACES[1]![0], FACES[1]![1], FACES[1]![2])), tile(61, 15, 28, 32, face(0, 0, 0.95, FACES[3]![0], FACES[3]![1], FACES[3]![2])),
    person(32, C.orange, { hairStyle: 'long', h: 0.7 }), person(88, BLUE, { h: 0.72 }), rect(10, 84, 100, 8, '#c8a070', 2, C.ink, 1.4), line('M18 92 L18 112 M102 92 L102 112', '#a0673d', 3), laptop(60, 84, 0.3), frame(6, 8, 108, 104, 6)),
};
