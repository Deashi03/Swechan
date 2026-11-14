/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Amerikas & Oceaniens historia, 2451–2457 (0.41):
 * Mesoamerica, the Inca empire, the Indigenous peoples of North America, European colonisation, the Latin American
 * independence movements, the seafaring cultures of Oceania and the history of Australia and New Zealand.
 * Recurring signs: jungle green and grey stone for Mesoamerica, Andean ochre and snow peaks, prairie gold, deep sea
 * blue for Oceania, red earth for Australia, and an orange highlight ring on the thing that the word names. People
 * wear plain everyday clothes (no feather headdresses or other clichés). Digits only; no words, no brands, no
 * pointing fingers. Abstract words are small symbolic scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const JUNGLE = '#3f8a4f';
const JUNGLE2 = '#2d6b3b';
const LEAF = '#6fb35a';
const STONE = '#c9c1ad';
const STONE2 = '#a59c86';
const SNOW = '#f7f8fa';
const ROCK = '#9a8a78';
const GRASS = '#9fcb6e';
const PRAIRIE = '#e2c66c';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const LAGOON = '#a8e0e4';
const SAND = '#f0dca0';
const RED_EARTH = '#c8643a';
const WOOD = '#a0673d';
const WOOD2 = '#7a4a26';
const GOLD = C.gold;
const SILVER = '#d4d8de';
const IRON = '#6c7078';
const PAPER = '#f3e6c4';
const DSKIN = '#8a5a3a';
const MSKIN = '#c58c5e';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const sea = (y: number, col: string = SEA) => all(rect(4, y, 112, 112 - y, col, 0, null), ...range(5).map((i) => line(`M${8 + i * 22} ${y + 6 + (i % 2) * 6} q4 -3 8 0 q4 3 8 0`, SEA2, 1.3)));
const sunD = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, GOLD, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const tree = (x: number, y = 112, s = 1, col: string = LEAF) => at(x, y, s, rect(-2.5, -18, 5, 18, C.brown, 1, C.ink, 1.2), circle(0, -26, 12, col, C.ink, 1.4), circle(-7, -20, 7, col, null), circle(7, -21, 7, col, null));
const jungleTree = (x: number, y: number, s = 1, col: string = JUNGLE) => at(x, y, s, rect(-2, -30, 4, 30, WOOD2, 1, C.ink, 1), circle(0, -36, 11, col, C.ink, 1.3), circle(-9, -30, 8, col, C.ink, 1.2), circle(9, -31, 8, col, C.ink, 1.2), circle(0, -30, 8, col, null));
const palmT = (x: number, y: number, s = 1) => at(x, y, s, path('M-1 0 C0 -10 2 -20 5 -28 L8 -27 C5 -19 3 -10 3 0 Z', WOOD, C.ink, 1), ...[-150, -110, -60, -25, 10].map((a) => g(`translate(6 -28) rotate(${a})`, path('M0 0 C6 -4 14 -3 18 2 C12 0 6 1 0 0 Z', LEAF, C.ink, 0.9))));
const crop = (x: number, y: number, s = 1, col: string = '#4f8a3a') => at(x, y, s, line('M0 0 L0 -10 M0 -4 L-4 -8 M0 -6 L4 -10 M0 -8 L-3 -12', col, 1.4));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const ban = (x: number, y: number, r = 10, w = 2.6) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const coin = (x: number, y: number, r = 3, col: string = GOLD) => all(circle(x, y, r, col, C.ink, 0.9), circle(x, y, r * 0.5, 'none', 'rgba(0,0,0,0.25)', 0.7));
const flagP = (x: number, y: number, col: string, col2: string, h = 30) => all(line(`M${x} ${y} L${x} ${y - h}`, C.dark, 1.6), rect(x, y - h, 18, 6, col, 0, C.ink, 0.8), rect(x, y - h + 6, 18, 6, col2, 0, C.ink, 0.8));
const chain = (x1: number, y1: number, x2: number, y2: number, n = 5, col: string = IRON) => all(...range(n).map((i) => { const t = (i + 0.5) / n; return ellipse(f1(x1 + (x2 - x1) * t), f1(y1 + (y2 - y1) * t), 2.6, 1.7, 'none', col, 1.4); }));
const brokenChain = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-8, 0, 3, 2, 'none', IRON, 1.6), ellipse(-3, 0, 3, 2, 'none', IRON, 1.6), path('M1 -2 l2 -2 M1 2 l2 2', 'none', IRON, 1.6), path('M5 -2 l-2 -2 M5 2 l-2 2', 'none', IRON, 1.6), ellipse(9, 0, 3, 2, 'none', IRON, 1.6), sparkle(3, -6, 2.4, C.yellow));
const waves = (x1: number, x2: number, y: number, col = SEA2) => line(range(Math.floor((x2 - x1) / 10)).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.1);
const tiny = (x: number, y: number, s = 1, col: string = C.denim, skin: string = C.skin) => at(x, y, s, circle(0, -11, 2.6, skin, C.ink, 0.7), path('M-3 -8 L3 -8 L3.5 -2 L2 -2 L2 0 L-2 0 L-2 -2 L-3.5 -2 Z', col, C.ink, 0.7));

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), skin, C.ink, 1.2)); };
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** A cotton cloak knotted at one shoulder (Mesoamerican tilma), local to the figure. */
const cloakL = (col: string = '#f4efe2') => all(path('M-14 -42 L12 -42 L15 6 L-15 6 Z', col, C.ink, 1.3), circle(9, -41, 2.2, col, C.ink, 1), line('M-12 -2 L12 -2', '#c9a24a', 1.4));
const ponchoL = (col: string, band: string) => all(path('M-16 -42 L16 -42 L19 -6 L-19 -6 Z', col, C.ink, 1.3), line('M-17 -18 L17 -18 M-18 -12 L18 -12', band, 1.6));
const helmetL = () => all(path('M-14 -60 C-12 -73 12 -73 14 -60 C8 -63 -8 -63 -14 -60 Z', SILVER, C.ink, 1.3), path('M-2 -72 C0 -78 4 -78 2 -72', 'none', C.ink, 1.2), line('M-16 -60 L16 -60', C.ink, 1.4));
const armourL = () => all(path('M-13 -41 L13 -41 L12 -6 L-12 -6 Z', SILVER, C.ink, 1.3), line('M0 -40 L0 -8', IRON, 1), line('M-11 -14 L11 -14', IRON, 1));
const hatL = (col: string = '#3a3a40') => all(ellipse(0, -63, 16, 3, col, C.ink, 1.2), path('M-8 -64 L-7 -74 L7 -74 L8 -64 Z', col, C.ink, 1.2));
const bicorneL = () => path('M-18 -64 C-10 -78 10 -78 18 -64 C8 -67 -8 -67 -18 -64 Z', '#22252e', C.ink, 1.2);
const sweat = (x: number, y: number) => path(`M${x} ${y} C${x + 2} ${y + 3} ${x + 2} ${y + 5} ${x} ${y + 5} C${x - 2} ${y + 5} ${x - 2} ${y + 3} ${x} ${y} Z`, '#8cc7e8', C.ink, 0.6);

// ── Objects ──────────────────────────────────────────────────────────
/** A stepped pyramid with a stair and a small temple on top; base centre (x, y). */
const stepPyr = (x: number, y: number, w: number, h: number, n = 4, col: string = STONE, temple = true) => {
  const step = h / n;
  return all(...range(n).map((i) => { const ww = w * (1 - i * 0.18); return rect(f1(x - ww / 2), f1(y - (i + 1) * step), f1(ww), f1(step), col, 0, C.ink, 1.2); }),
    rect(f1(x - w * 0.09), f1(y - h), f1(w * 0.18), h, STONE2, 0, C.ink, 1), line(range(n * 2).map((i) => `M${f1(x - w * 0.09)} ${f1(y - (i + 0.5) * step / 2)} L${f1(x + w * 0.09)} ${f1(y - (i + 0.5) * step / 2)}`).join(' '), C.ink, 0.6),
    temple ? all(rect(f1(x - w * 0.2), f1(y - h - w * 0.2), f1(w * 0.4), f1(w * 0.2), '#d9cdb0', 0, C.ink, 1.2), path(`M${f1(x - w * 0.24)} ${f1(y - h - w * 0.2)} L${x} ${f1(y - h - w * 0.34)} L${f1(x + w * 0.24)} ${f1(y - h - w * 0.2)} Z`, '#b65a3a', C.ink, 1.1), rect(f1(x - w * 0.05), f1(y - h - w * 0.13), f1(w * 0.1), f1(w * 0.13), C.dark, 0, null)) : '');
};
const canoe = (x: number, y: number, s = 1, col: string = WOOD) => at(x, y, s, path('M-24 -4 C-16 4 16 4 24 -4 L20 -1 C10 3 -10 3 -20 -1 Z', col, C.ink, 1.3), path('M-24 -4 C-14 1 14 1 24 -4', 'none', C.ink, 1));
const paddler = (x: number, y: number, s = 1, top: string = C.denim, skin: string = C.skin) => at(x, y, s, path('M-5 0 L5 0 L4 -12 L-4 -12 Z', top, C.ink, 1), circle(0, -16, 4, skin, C.ink, 1), path('M-4 -17 C-4 -22 4 -22 4 -17 Z', C.hair, null), line('M2 -9 L12 6', WOOD2, 1.6), ellipse(13, 8, 1.8, 3.4, WOOD2, C.ink, 0.6));
const ship = (x: number, y: number, s = 1, sail: string = C.white) => at(x, y, s, path('M-22 0 L22 0 L17 9 L-17 9 Z', WOOD2, C.ink, 1.3), line('M-6 0 L-6 -30 M8 0 L8 -26', C.ink, 1.4), path('M-16 -6 C-12 -16 -12 -24 -16 -28 L4 -28 C1 -24 1 -14 4 -6 Z', sail, C.ink, 1.1), path('M0 -6 C3 -14 3 -20 0 -24 L16 -24 C14 -20 14 -12 16 -6 Z', sail, C.ink, 1.1), rect(-6, -34, 6, 4, C.red, 0, C.ink, 0.6));
const llama = (x: number, y: number, s = 1, pack = true) => at(x, y, s, path('M-14 -10 C-16 -18 10 -20 12 -12 C12 -6 10 -4 8 -4 L-12 -4 C-14 -4 -15 -7 -14 -10 Z', '#f2e8d4', C.ink, 1.3), line('M-10 -5 L-10 8 M-5 -5 L-5 8 M4 -5 L4 8 M9 -5 L9 8', C.ink, 2.2),
  path('M8 -14 L10 -34 C10 -38 16 -38 17 -35 L20 -32 C21 -30 19 -29 16 -30 L15 -30 L13 -12 Z', '#f2e8d4', C.ink, 1.3), path('M11 -38 L10 -43 L13 -39 M14 -38 L14 -43 L16 -38', '#f2e8d4', C.ink, 1), circle(15, -34, 0.9, C.ink, null),
  pack ? all(rect(-10, -22, 16, 8, '#c8372d', 1.5, C.ink, 1), line('M-10 -18 L6 -18', GOLD, 1.2)) : '');
const bisonS = (x: number, y: number, s = 1) => at(x, y, s, path('M-20 -4 C-22 -14 -14 -18 -6 -17 C0 -26 14 -26 18 -16 C22 -12 22 -4 18 -2 L-16 -2 C-19 -2 -20 -3 -20 -4 Z', '#6b4a32', C.ink, 1.3),
  path('M6 -22 C14 -28 24 -22 24 -12 C24 -6 20 -4 16 -4 C10 -4 4 -12 6 -22 Z', '#4a3222', C.ink, 1.2), path('M19 -21 C22 -24 24 -24 24 -27', 'none', SNOW, 1.4), circle(19, -13, 1, C.ink, null), path('M16 -6 C18 -2 22 -2 22 -6', '#4a3222', C.ink, 1),
  line('M-14 -3 L-14 8 M-8 -3 L-8 8 M6 -3 L6 8 M12 -3 L12 8', C.ink, 2.6), path('M-20 -8 C-24 -6 -24 0 -22 2', 'none', C.ink, 1.2));
const sheep = (x: number, y: number, s = 1) => at(x, y, s, ...[-7, -2, 3, 8].map((d, i) => circle(d, -8 + (i % 2), 5, C.white, C.ink, 1)), ellipse(0, -7, 10, 5, C.white, null), ellipse(12, -10, 3.4, 2.6, C.dark, C.ink, 0.8), line('M-6 -3 L-6 2 M5 -3 L5 2', C.ink, 1.6));
const corn = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -24 C7 -22 8 6 0 12 C-8 6 -7 -22 0 -24 Z', C.yellow, C.ink, 1.3),
  line('M-5 -14 L5 -14 M-6 -8 L6 -8 M-6 -2 L6 -2 M-5 4 L5 4 M0 -22 L0 10 M-3.5 -20 L-3.5 8 M3.5 -20 L3.5 8', '#c99a2a', 0.7), path('M0 12 C-10 8 -14 -6 -12 -18 C-6 -8 -4 2 0 12 Z', '#7fbf5a', C.ink, 1.1), path('M0 12 C10 8 14 -6 12 -18 C6 -8 4 2 0 12 Z', '#7fbf5a', C.ink, 1.1));
const longhouse = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 0 L-22 -10 C-22 -22 22 -22 22 -10 L22 0 Z', '#b28a5a', C.ink, 1.3), line('M-16 -18 L-16 0 M-8 -20 L-8 0 M0 -21 L0 0 M8 -20 L8 0 M16 -18 L16 0', '#8a6a42', 0.8), path('M-4 0 L-4 -7 L4 -7 L4 0 Z', C.dark, null));
const moai = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 L-8 -30 C-8 -38 -6 -42 0 -42 C6 -42 8 -38 8 -30 L8 0 Z', '#7d7468', C.ink, 1.3), line('M-8 -34 L8 -34', C.ink, 1.6), path('M2 -33 L6 -24 L2 -22', 'none', C.ink, 1.2), line('M-3 -18 L4 -18', C.ink, 1.2), path('M-8 -12 C-4 -8 4 -8 8 -12', 'none', C.ink, 0.8));
const island = (x: number, y: number, w: number, h = 8, palms = 1) => all(ellipse(x, y, w, h, SAND, C.ink, 1.2), ellipse(x, f1(y - h * 0.3), f1(w * 0.7), f1(h * 0.55), '#8cc96a', null), ...range(palms).map((i) => palmT(f1(x - w * 0.3 + i * (w * 0.6 / Math.max(1, palms - 1))), f1(y - 1), 0.5)));
const kettle = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 -8 L7 -8 L6 2 C5 5 -5 5 -6 2 Z', '#b87333', C.ink, 1.2), path('M-6 -8 C-6 -15 6 -15 6 -8', 'none', C.ink, 1.1));
const fur = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 -5 C-12 -9 -6 -10 -4 -7 C0 -10 4 -10 6 -7 C10 -9 12 -6 10 -2 C12 2 10 6 6 5 C2 8 -4 8 -6 5 C-10 6 -12 2 -10 -2 Z', '#8a5a32', C.ink, 1.1), line('M-6 -2 L6 -2 M-4 2 L4 2', '#6a4222', 0.7));
const tent = (x: number, y: number, s = 1, col: string = '#efe6d0') => at(x, y, s, path('M-10 0 L0 -14 L10 0 Z', col, C.ink, 1.1), line('M0 -14 L0 0', C.ink, 0.8));
const pick = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 0 L0 -16', WOOD, 2), path('M-8 -14 C-4 -18 4 -18 8 -14 L0 -16 Z', IRON, C.ink, 1));
const nugget = (x: number, y: number, r = 2.4) => all(path(`M${x - r} ${y} L${f1(x - r * 0.4)} ${f1(y - r)} L${f1(x + r)} ${f1(y - r * 0.5)} L${f1(x + r * 0.6)} ${f1(y + r * 0.8)} Z`, GOLD, C.ink, 0.8));
const doc = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -12, 18, 24, PAPER, 1, C.ink, 1.2), line('M-6 -7 L6 -7 M-6 -3 L6 -3 M-6 1 L4 1', C.grey, 1), circle(3, 7, 3.4, C.red, C.ink, 0.8));
const globe = (x: number, y: number, r: number) => all(circle(x, y, r, '#9fd0ef', C.ink, 1.6));
const fence = (x1: number, x2: number, y: number, h = 7) => all(line(`M${x1} ${y - h * 0.6} L${x2} ${y - h * 0.6} M${x1} ${y - h * 0.2} L${x2} ${y - h * 0.2}`, WOOD2, 1), line(range(Math.floor((x2 - x1) / 6) + 1).map((i) => `M${x1 + i * 6} ${y} L${x1 + i * 6} ${y - h}`).join(' '), WOOD2, 1.2));
const mountains = (y: number, col: string = ROCK, snow = true) => all(path(`M4 ${y} L18 ${y - 34} L30 ${y - 18} L46 ${y - 46} L62 ${y - 22} L76 ${y - 40} L92 ${y - 16} L104 ${y - 36} L116 ${y - 20} L116 ${y} Z`, col, C.ink, 1.3),
  snow ? path(`M14 ${y - 26} L18 ${y - 34} L22 ${y - 28} Z M41 ${y - 36} L46 ${y - 46} L51 ${y - 37} Z M72 ${y - 33} L76 ${y - 40} L80 ${y - 33} Z M100 ${y - 29} L104 ${y - 36} L108 ${y - 30} Z`, SNOW, C.ink, 0.9) : '');
const spots = (pts: number[][]) => all(...pts.map(([x, y]) => circle(x!, y!, 1.3, '#c0392b', null)));

// ── Motifs ───────────────────────────────────────────────────────────
export const AMERICAS_OCEANIA_MOTIFS: Record<string, Svg> = {
  // 2451 Mesoamerikanska civilisationer
  'amoc.majs': all(bg('#f5efd8'), field(100, '#c9a874'), at(60, 100, 1, line('M0 0 L0 -86', '#5a9a3a', 3), path('M0 -60 C-14 -64 -26 -58 -32 -48 C-20 -54 -10 -56 0 -54 Z M0 -40 C14 -44 26 -38 32 -28 C20 -34 10 -36 0 -34 Z M0 -78 C10 -86 20 -86 26 -80 C16 -80 8 -78 0 -74 Z', '#6aa84f', C.ink, 1.1)),
    corn(38, 74, 1.2, -18), corn(84, 72, 1.15, 16), oval(60, 66, 46, 36)),
  'amoc.regnskog': all(bg('#cfe3d2'), rect(4, 4, 112, 108, '#cfe3d2', 3, null), ...[[14, 112, 1.2], [34, 104, 1.4], [58, 112, 1.6], [84, 104, 1.4], [106, 112, 1.2]].map(([x, y, s]) => jungleTree(x!, y!, s!, JUNGLE)),
    ...[[24, 112, 0.9], [72, 112, 1], [96, 112, 0.8]].map(([x, y, s]) => jungleTree(x!, y!, s!, JUNGLE2)), line('M20 8 l-3 8 M40 6 l-3 8 M60 10 l-3 8 M80 6 l-3 8 M100 8 l-3 8 M30 16 l-3 8 M90 16 l-3 8', '#3f86c4', 1.6),
    at(44, 58, 1, path('M-5 0 C-5 -6 5 -6 5 0 L8 6 L-2 4 Z', C.red, C.ink, 1), circle(3, -3, 3, C.red, C.ink, 1), path('M5 -3 L9 -2 L5 -1 Z', C.yellow, C.ink, 0.6)), path('M20 100 C30 92 26 84 34 80', 'none', '#4f8a3a', 2)),
  'amoc.pyramidtempel': all(bg(), field(98, '#7fbf5a'), jungleTree(14, 104, 1), jungleTree(106, 104, 1), stepPyr(60, 100, 76, 54, 5), tiny(60, 46, 0.7, '#f4efe2', MSKIN), tiny(22, 104, 0.9, '#f4efe2', MSKIN), ring(60, 34, 15)),
  'amoc.kakaoböna': all(bg('#f6eedf'), at(42, 58, 1, path('M-26 0 C-26 -18 -8 -26 6 -24 C22 -22 30 -8 26 6 C20 20 -20 20 -26 0 Z', '#c06a2a', C.ink, 1.5), line('M-20 -6 C-6 -14 12 -14 22 -4 M-22 4 C-6 -4 12 -4 24 6', '#9a4a1a', 1)),
    at(82, 60, 1, path('M-22 0 C-22 -16 -6 -22 6 -20 C18 -18 24 -6 20 6 C16 18 -16 18 -22 0 Z', '#c06a2a', C.ink, 1.5), ellipse(0, 0, 15, 10, '#f3ead7', C.ink, 1), ...[[-7, -3], [0, -4], [7, -3], [-4, 3], [4, 3]].map(([x, y]) => ellipse(x!, y!, 3, 2.2, '#6b3a1e', C.ink, 0.6))),
    ...[[30, 98], [40, 100], [50, 97], [60, 100], [70, 98], [80, 100], [90, 97]].map(([x, y]) => ellipse(x!, y!, 4.6, 3, '#6b3a1e', C.ink, 0.9)), oval(60, 98, 38, 9)),
  'amoc.bollspel': all(bg('#efe6d0'), rect(4, 70, 112, 42, '#e3d3a8', 0, null), path('M4 56 L30 56 L40 80 L4 80 Z', STONE, C.ink, 1.3), path('M116 56 L90 56 L80 80 L116 80 Z', STONE, C.ink, 1.3),
    ellipse(22, 50, 7, 7, 'none', C.ink, 3), ellipse(22, 50, 7, 7, 'none', STONE2, 1.8), rect(19, 56, 6, 4, STONE2, 0, C.ink, 0.8),
    stand(52, 108, 0.42, fig(60, '#f4efe2', 'smile', { skin: MSKIN, bottom: '#e8dcc0' }), reach(60, 1, 1, 80, 70, MSKIN), reach(60, 1, -1, 40, 70, MSKIN)), stand(88, 108, 0.42, fig(60, '#d9a85a', 'smile', { skin: MSKIN, bottom: '#e8dcc0' })),
    circle(70, 54, 6, '#2e2e36', C.ink, 1.2), path('M66 51 q3 -2 6 0', 'none', C.white, 0.8), ring(70, 54, 10)),
  'amoc.aztek': all(bg(), rect(4, 58, 112, 54, SEA, 0, null), waves(8, 108, 70), waves(10, 110, 100), ellipse(64, 60, 46, 12, '#d9cdb0', C.ink, 1.2),
    at(64, 58, 1, ...[0, 1, 2].map((i) => rect(-24 + i * 4, -10 - i * 8, 48 - i * 8, 8, STONE, 0, C.ink, 1.1)), rect(-12, -38, 9, 8, '#c8372d', 0, C.ink, 1), rect(3, -38, 9, 8, '#3f7ab8', 0, C.ink, 1)),
    rect(30, 50, 10, 8, '#e8dcc0', 0, C.ink, 0.9), rect(92, 50, 10, 8, '#e8dcc0', 0, C.ink, 0.9), canoe(96, 88, 0.6), paddler(96, 85, 0.5, '#f4efe2', MSKIN),
    stand(24, 112, 0.5, fig(60, '#f4efe2', 'smile', { skin: MSKIN, bottom: '#f4efe2' }), on(60, 1, cloakL())), oval(26, 86, 14, 26)),
  'amoc.konstgjord-ö': all(bg(), rect(4, 30, 112, 82, SEA, 0, null), waves(8, 108, 40), waves(8, 108, 106),
    ...[[12, 50], [64, 50], [12, 76], [64, 76]].map(([x, y]) => all(rect(x!, y!, 42, 18, '#8a6a3a', 2, C.ink, 1.2), rect(x! + 2, y! + 2, 38, 6, '#6aa84f', 1, null), ...range(5).map((i) => crop(x! + 6 + i * 8, y! + 14, 0.8)))),
    canoe(60, 102, 0.6), paddler(60, 99, 0.5, '#f4efe2', MSKIN), oval(33, 59, 25, 13)),
  'amoc.obsidian': all(bg('#efe9df'), at(42, 64, 1, path('M-24 14 L-18 -14 L0 -24 L20 -12 L24 10 L4 20 Z', '#1f1d24', C.ink, 1.6), path('M-14 -10 L-2 -18 L6 -10 Z', '#4a4856', null), line('M-10 4 L8 -6', '#6a6878', 1.2), sparkle(-6, -12, 3, C.white)),
    at(88, 66, 1, path('M-4 30 L4 30 L3 6 L-3 6 Z', WOOD, C.ink, 1.2), path('M-6 6 L6 6 L2 -26 L0 -30 L-2 -26 Z', '#2a2830', C.ink, 1.2), line('M-1 -22 L1 2', '#6a6878', 0.8)), ring(42, 64, 30)),
  // 2452 Inkariket
  'amoc.bergskedja': all(bg(), mountains(96), field(96, '#a9c98a'), line('M10 102 L110 102', HL, 2.2), path('M10 102 l6 -3 l0 6 Z M110 102 l-6 -3 l0 6 Z', HL, null), cloud(30, 22, 0.8), cloud(90, 16, 0.7)),
  'amoc.terrassodling': all(bg(), path('M4 112 L4 40 L60 18 L116 40 L116 112 Z', ROCK, C.ink, 1.3), path('M42 26 L60 18 L78 26 Z', SNOW, C.ink, 0.9),
    ...range(6).map((i) => all(rect(4, 46 + i * 11, 112, 11, i % 2 ? '#8cc96a' : '#7fbf5a', 0, null), line(`M4 ${57 + i * 11} L116 ${57 + i * 11}`, STONE2, 2.2), ...range(9).map((k) => crop(10 + k * 12, 55 + i * 11, 0.55)))),
    stand(92, 112, 0.36, fig(60, '#c8372d', 'smile', { skin: MSKIN, bottom: '#3a3a40' }), on(60, 1, ponchoL('#c8372d', GOLD))), oval(56, 79, 48, 30)),
  'amoc.lama': all(bg(), mountains(84, ROCK), field(84, '#bcd49a'), llama(58, 98, 1.6), ring(62, 66, 40)),
  'amoc.hängbro': all(bg(), path('M4 112 L4 46 L30 40 L36 112 Z', ROCK, C.ink, 1.3), path('M116 112 L116 46 L90 40 L84 112 Z', ROCK, C.ink, 1.3), rect(36, 98, 48, 14, SEA, 0, null), waves(38, 82, 104),
    path('M30 44 C50 66 70 66 90 44', 'none', '#b89a5a', 2.6), path('M30 36 C50 58 70 58 90 36', 'none', '#b89a5a', 1.6), line(range(8).map((i) => { const t = (i + 1) / 9, xx = 30 + 60 * t, yy = 44 + 4 * 22 * t * (1 - t), y2 = 36 + 4 * 22 * t * (1 - t); return `M${f1(xx)} ${f1(yy)} L${f1(xx)} ${f1(y2)}`; }).join(' '), '#b89a5a', 1),
    stand(54, 63, 0.26, fig(60, '#c8372d', 'smile', { skin: MSKIN, bottom: '#3a3a40' })), oval(60, 52, 34, 16)),
  'amoc.knutskrift': all(bg('#f3ede2'), line('M14 24 L106 24', '#8a6a3a', 4), ...range(8).map((i) => { const x = 20 + i * 12, len = 50 + (i % 3) * 12, col = ['#c8372d', '#e0b23c', '#3f7ab8', '#4f9d69'][i % 4]!; return all(line(`M${x} 24 C${x - 2} 50 ${x + 2} 70 ${x} ${24 + len}`, col, 2), ...range(1 + (i % 3)).map((k) => circle(x, 40 + k * 10, 2.8, col, C.ink, 0.8))); }),
    greyed(at(100, 98, 0.9, ellipse(-8, 0, 5, 4, '#c9a86a', C.ink, 0.8), ellipse(0, -1, 5, 4, '#c9a86a', C.ink, 0.8), ellipse(8, 0, 5, 4, '#c9a86a', C.ink, 0.8))), oval(60, 54, 50, 38)),
  'amoc.arbetsplikt': all(bg('#f3ede2'), field(100, '#d9c49a'), at(98, 100, 1, rect(-16, -26, 32, 26, STONE, 0, C.ink, 1.3), path('M-18 -26 L0 -36 L18 -26 Z', '#b65a3a', C.ink, 1.2), sunD(0, -16, 4)),
    stand(56, 108, 0.48, fig(60, '#c8372d', 'calm', { skin: MSKIN, bottom: '#3a3a40' }), reach(60, 1, -1, 46, 54, MSKIN), reach(60, 1, 1, 74, 54, MSKIN), rect(44, 34, 32, 20, STONE2, 2, C.ink, 1.4)), arrow(68, 70, 80, 80, HL, 2.4),
    greyed(at(20, 34, 1, coin(-6, 0, 5), coin(4, 3, 5), coin(-1, -6, 5))), ban(20, 32, 13), oval(56, 76, 18, 34)),
  'amoc.solgud': all(bg('#f6e7c4'), field(100, '#d9c49a'), at(60, 36, 1, ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return path(`M${f1(Math.cos(a) * 20)} ${f1(Math.sin(a) * 20)} L${f1(Math.cos(a + 0.12) * 30)} ${f1(Math.sin(a + 0.12) * 30)} L${f1(Math.cos(a - 0.12) * 30)} ${f1(Math.sin(a - 0.12) * 30)} Z`, GOLD, C.ink, 0.8); }), circle(0, 0, 18, C.yellow, C.ink, 1.6), circle(-6, -3, 1.8, C.ink, null), circle(6, -3, 1.8, C.ink, null), path('M-6 6 Q0 10 6 6', 'none', C.ink, 1.4)),
    rect(36, 80, 48, 20, STONE, 0, C.ink, 1.2), stand(18, 112, 0.34, fig(60, '#c8372d', 'calm', { skin: MSKIN }), reach(60, 1, -1, 40, 40, MSKIN), reach(60, 1, 1, 80, 40, MSKIN)), stand(102, 112, 0.34, fig(60, '#3f7ab8', 'calm', { skin: MSKIN, hairStyle: 'long' }), reach(60, 1, -1, 40, 40, MSKIN), reach(60, 1, 1, 80, 40, MSKIN)), ring(60, 36, 34)),
  'amoc.stenblock': all(bg(), field(104, '#a9c98a'), path('M8 104 L8 62 L36 60 L38 76 L64 74 L66 104 Z', 'none', null),
    path('M8 104 L8 84 L30 82 L32 104 Z M32 104 L30 82 L54 80 L60 86 L58 104 Z M58 104 L60 86 L92 86 L94 104 Z M8 84 L8 62 L24 60 L30 82 Z M30 82 L24 60 L50 58 L54 80 Z', STONE, C.ink, 1.4),
    at(82, 58, 1, path('M-14 10 L-12 -12 L12 -12 L14 10 Z', '#b8ae96', C.ink, 1.6), line('M-8 -4 L6 -6', STONE2, 1)), line('M82 46 L82 18', '#b89a5a', 1.6), ring(82, 58, 20)),
  'amoc.lösensumma': all(bg('#efe6d6'), rect(4, 4, 112, 108, '#e8dccb', 3, null), line('M8 50 L112 50', C.red, 1.4, '4 3'), path('M8 112 L8 70 C30 64 50 68 70 62 C90 58 104 62 112 60 L112 112 Z', GOLD, C.ink, 1.3), ...[[20, 76], [36, 72], [54, 70], [72, 66], [92, 66], [104, 70], [28, 90], [62, 86], [88, 88]].map(([x, y]) => coin(x!, y!, 3.4)),
    stand(34, 72, 0.46, fig(60, '#c8372d', 'frown', { skin: MSKIN, bottom: '#3a3a40' }), on(60, 1, chain(-10, -10, 10, -10, 4))), stand(92, 72, 0.44, fig(60, '#3a3a40', 'smile', { bottom: '#3a3a40' }), on(60, 1, helmetL()), reach(60, 1, -1, 30, 64)), oval(60, 80, 52, 24)),
  // 2453 Nordamerikas ursprungsfolk
  'amoc.prärie': all(bg(), rect(4, 58, 112, 54, PRAIRIE, 0, null), line('M4 58 L116 58', '#b89a3a', 1.4), ...range(14).map((i) => line(`M${8 + i * 8} ${70 + (i % 3) * 12} l-2 -6 M${8 + i * 8} ${70 + (i % 3) * 12} l0 -7 M${8 + i * 8} ${70 + (i % 3) * 12} l2 -6`, '#a8892a', 1)),
    bisonS(90, 60, 0.35), bisonS(100, 62, 0.3), sunD(30, 24, 7), cloud(84, 24, 0.8), line('M8 64 L112 64', HL, 2), path('M8 64 l5 -3 l0 6 Z M112 64 l-5 -3 l0 6 Z', HL, null)),
  'amoc.bison': all(bg(), field(92, PRAIRIE), bisonS(58, 90, 2), ring(62, 70, 46)),
  'amoc.förbund': all(bg('#efe9dc'), field(104, '#cbbd94'), ...range(5).map((i) => { const x = 20 + i * 20; return stand(x, 98, 0.34, fig(60, ['#c8372d', '#3f7ab8', '#4f9d69', '#d9a85a', '#8a6bbf'][i]!, 'smile', { skin: MSKIN, hairStyle: i % 2 ? 'long' : 'short' })); }),
    line('M24 84 L36 84 M44 84 L56 84 M64 84 L76 84 M84 84 L96 84', C.skin2, 3), ...[30, 50, 70, 90].map((x) => circle(x, 84, 2, MSKIN, C.ink, 0.8)),
    at(60, 22, 1, rect(-30, -6, 60, 12, '#f3ead7', 2, C.ink, 1.2), ...range(5).map((i) => rect(-26 + i * 11, -3, 8, 6, '#5a3d7a', 1, null))), ellipse(60, 82, 52, 22, 'none', HL, 2.4)),
  'amoc.kanot': all(bg(), rect(4, 70, 112, 42, SEA, 0, null), waves(8, 108, 96), tree(14, 70, 0.6, '#4f8a3a'), tree(104, 70, 0.6, '#4f8a3a'), canoe(60, 84, 1.8, '#d9c9a0'), line('M24 80 L96 80', '#8a7a5a', 0.8, '2 3'), paddler(54, 80, 1.2, '#4f9d69', MSKIN), ring(60, 80, 46)),
  'amoc.pälshandel': all(bg('#efe6d0'), field(100, '#bcd49a'), fur(52, 62, 1.1), fur(52, 72, 1.1), kettle(74, 66, 1), at(74, 82, 1, line('M-6 0 L6 0', IRON, 2.4), rect(-10, -1.6, 5, 3.2, WOOD, 1, C.ink, 0.6)),
    stand(24, 112, 0.6, fig(60, '#8a5a32', 'smile', { skin: MSKIN, hairStyle: 'long' }), reach(60, 1, 1, 82, 60, MSKIN)), stand(100, 112, 0.6, fig(60, '#3f7ab8', 'smile'), on(60, 1, hatL('#5a4a3a')), reach(60, 1, -1, 38, 60)),
    arrow(46, 50, 70, 50, HL, 2.2), arrow(70, 92, 46, 92, HL, 2.2)),
  'amoc.tvångsförflyttning': all(bg('#e8e4dc'), field(96, '#cbbd94'), greyed(at(14, 96, 0.7, longhouse(0, 0, 0.6), tree(16, 0, 0.5))), path('M4 104 C40 100 80 100 116 96', 'none', '#b8a888', 6),
    ...[34, 50, 66, 82].map((x, i) => stand(x, 102 - i, 0.34, fig(60, ['#8a5a32', '#c8372d', '#3f7ab8', '#6a6a72'][i]!, 'frown', { skin: MSKIN, hairStyle: i % 2 ? 'long' : 'short' }), rect(68, 44, 14, 16, '#d9c49a', 2, C.ink, 1.4))),
    stand(102, 96, 0.36, fig(60, '#2f4a7a', 'calm', { bottom: '#2f4a7a' }), on(60, 1, hatL('#2f4a7a'))), arrow(36, 48, 96, 48, HL, 2.6)),
  'amoc.reservat': all(bg('#eef3e6'), path('M10 20 L110 16 L112 104 L8 106 Z', '#d6e6b8', C.ink, 1.4), ...range(6).map((i) => rect(16 + (i % 3) * 30, 24 + Math.floor(i / 3) * 18, 22, 12, '#a9c98a', 1, '#6a8a4a', 0.8)),
    rect(18, 64, 46, 34, '#d9c49a', 2, null), `<rect x="18" y="64" width="46" height="34" rx="2" fill="none" stroke="${HL}" stroke-width="2.4" stroke-dasharray="4 3"/>`,
    tiny(30, 90, 0.9, '#8a5a32', MSKIN), tiny(42, 92, 0.9, '#c8372d', MSKIN), longhouse(52, 84, 0.4), greyed(at(92, 86, 1, tiny(0, 0, 0.9, C.denim), tiny(10, 2, 0.9, '#6a6a72'), rect(-6, -26, 20, 12, C.white, 1, C.ink, 0.8)))),
  // 2454 Europeisk kolonisation
  'amoc.den-nya-världen': all(bg('#eaf2f8'), globe(60, 60, 44), greyed(path('M72 24 C84 22 96 30 98 42 C96 52 92 60 96 70 C92 84 84 92 78 96 C74 86 76 74 72 66 C70 56 74 48 70 40 C68 32 68 28 72 24 Z', '#c9b98a', C.ink, 1.1)),
    path('M30 24 C40 20 50 26 48 36 C44 42 38 44 40 50 C46 56 50 64 46 74 C44 84 40 92 36 96 C32 88 30 78 28 70 C24 62 20 54 22 44 C22 36 24 28 30 24 Z', '#7fbf5a', C.ink, 1.4), ship(62, 54, 0.4), arrow(70, 50, 54, 50, HL, 2.2), oval(36, 60, 18, 40)),
  'amoc.konkistador': all(bg(), sea(86), ship(96, 80, 0.6), field(100, SAND), stand(48, 112, 0.92, fig(60, SILVER, 'calm', { bottom: '#7a2a2a' }), on(60, 1, armourL(), helmetL()), reach(60, 1, 1, 82, 66), line('M82 66 L104 30', IRON, 2.4), line('M77 62 L88 70', GOLD, 2.4)), ring(48, 34, 16)),
  'amoc.smittkoppor': all(bg('#f2ede6'), rect(10, 78, 100, 12, '#c9a86a', 2, C.ink, 1.4), rect(14, 66, 22, 14, C.white, 5, C.ink, 1.2), path('M40 72 C60 64 96 66 106 72 L106 80 L40 80 Z', '#e8dcc0', C.ink, 1.3),
    circle(34, 64, 10, MSKIN, C.ink, 1.4), path('M24 62 C24 50 44 50 44 62 C40 57 28 57 24 62 Z', C.hair, null), path('M29 63 q2 -1.6 4 0 M36 63 q2 -1.6 4 0', 'none', C.ink, 1), path('M31 69 q3 -2 6 0', 'none', C.ink, 1), spots([[30, 58], [38, 59], [28, 66], [40, 66], [34, 60], [33, 70], [37, 68]]), sweat(44, 54),
    at(74, 40, 1, rect(-2, -14, 4, 22, C.white, 2, C.ink, 1.1), circle(0, 10, 4, C.red, C.ink, 1.1), rect(-0.8, -6, 1.6, 14, C.red, 0, null)), stand(96, 112, 0.36, fig(60, '#8a5a32', 'sick', { skin: MSKIN }), on(60, 1, spots([[-4, -58], [4, -54], [0, -50]]))), ring(34, 64, 14)),
  'amoc.silvergruva': all(bg(), path('M4 112 L4 40 L40 14 L76 30 L116 22 L116 112 Z', ROCK, C.ink, 1.4), path('M30 112 L30 70 C30 58 60 58 60 70 L60 112 Z', '#3a3530', C.ink, 1.3), line('M70 50 L100 70 M76 82 L108 92 M84 40 L110 46', SILVER, 3), sparkle(96, 66, 3, C.white), sparkle(102, 90, 3, C.white),
    stand(44, 112, 0.4, fig(60, '#c8372d', 'calm', { skin: MSKIN, bottom: '#3a3a40' }), reach(60, 1, 1, 82, 50, MSKIN)), pick(52, 92, 0.7, 30), at(82, 106, 1, path('M-12 -10 L12 -10 L9 2 L-9 2 Z', WOOD2, C.ink, 1.2), circle(-6, 4, 3, C.dark, null), circle(6, 4, 3, C.dark, null), ...[-6, 0, 6].map((d) => circle(d, -12, 3.4, SILVER, C.ink, 0.8))), ring(82, 96, 16)),
  'amoc.omvända': all(bg('#f3ede2'), greyed(at(22, 34, 1, sunD(0, 0, 7))), arrow(34, 34, 56, 34, HL, 2.6), at(76, 40, 1, rect(-14, -6, 28, 26, C.white, 1, C.ink, 1.3), path('M-16 -6 L0 -18 L16 -6 Z', '#b65a3a', C.ink, 1.2), line('M0 -18 L0 -30 M-5 -25 L5 -25', C.ink, 2), rect(-4, 10, 8, 10, WOOD2, 1, null)),
    stand(34, 112, 0.5, fig(60, '#c8372d', 'calm', { skin: MSKIN, hairStyle: 'long' })), stand(92, 112, 0.5, fig(60, '#3a2a22', 'smile', { bottom: '#3a2a22' }), on(60, 1, path('M-13 -41 L13 -41 L16 46 L-16 46 Z', '#3a2a22', C.ink, 1.3), line('M-12 -20 L12 -20', C.white, 1.4))), oval(56, 34, 40, 16)),
  // 2455 Latinamerikanska självständighetsrörelser
  'amoc.kreol': all(bg('#eef3f6'), rect(48, 4, 22, 108, SEA, 0, null), waves(50, 68, 30), waves(50, 68, 70), greyed(at(24, 52, 1, stand(-8, 0, 0.34, fig(60, '#c8372d', 'smile')), stand(8, 0, 0.34, fig(60, '#e0b23c', 'smile', { hairStyle: 'long' })))), rect(10, 62, 28, 10, '#c8372d', 0, C.ink, 0.8), rect(10, 66, 28, 2, GOLD, 0, null),
    ship(58, 46, 0.3), arrow(40, 40, 78, 40, HL, 2.2), palmT(104, 100, 0.8), field(100, '#bcd49a'), stand(88, 100, 0.5, fig(60, '#f4efe2', 'smile', { bottom: '#3a3a40' }), on(60, 1, hatL('#3a3a40'))), ring(88, 76, 22)),
  'amoc.slavuppror': all(bg('#f4e2c8'), field(100, '#a9c98a'), greyed(at(98, 60, 1, rect(-14, -14, 28, 20, C.white, 0, C.ink, 1.1), path('M-16 -14 L0 -24 L16 -14 Z', C.red, C.ink, 1))),
    ...[[24, 0.5, '#f4efe2'], [44, 0.56, '#c8372d'], [64, 0.5, '#3f7ab8']].map(([x, s, c]) => stand(x as number, 112, s as number, fig(60, c as string, 'angry', { skin: DSKIN, bottom: '#e8dcc0' }), reach(60, 1, 1, 80, 20, DSKIN))), brokenChain(40, 30, 1.2), brokenChain(80, 22, 1), arrow(16, 46, 70, 46, HL, 2.6)),
  'amoc.slaveri': all(bg('#efe9df'), field(102, '#cbbd94'), stand(40, 112, 0.6, fig(60, '#a0673d', 'frown', { skin: DSKIN, bottom: '#6a5a4a' })), circle(36, 64, 4, IRON, C.ink, 1.1), chain(40, 64, 80, 58, 7), stand(92, 112, 0.6, fig(60, '#2f4a7a', 'angry', { bottom: '#3a3a40' }), on(60, 1, hatL('#3a3a40')), reach(60, 1, -1, 28, 60)),
    greyed(at(14, 52, 1, stand(0, 0, 0.3, fig(60, C.white, 'smile')))), okC(14, 18, 5), ring(38, 64, 10)),
  'amoc.självständighetsdag': all(bg('#2f3a5a'), ...[[24, 22, C.red], [60, 14, C.yellow], [96, 24, '#4fd08a']].map(([x, y, c]) => all(...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1((x as number) + Math.cos(a) * 3)} ${f1((y as number) + Math.sin(a) * 3)} L${f1((x as number) + Math.cos(a) * 10)} ${f1((y as number) + Math.sin(a) * 10)}`, c as string, 1.6); }))),
    at(60, 50, 1, rect(-12, -12, 24, 22, C.white, 2, C.ink, 1.2), rect(-12, -12, 24, 6, C.red, 1, C.ink, 1), num(0, 6, '16', 11)), ...[18, 34, 50, 70, 86, 102].map((x, i) => tiny(x, 112, 1.6, ['#c8372d', '#4f9d69', '#3f7ab8', '#e0b23c', '#8a6bbf', C.white][i]!, i % 2 ? MSKIN : C.skin)),
    flagP(30, 96, '#4f9d69', C.white), flagP(84, 96, '#4f9d69', '#c8372d'), ring(60, 48, 16)),
  'amoc.befriare': all(bg('#f4ead8'), field(100, '#bcd49a'), at(62, 100, 1, path('M-26 -26 C-26 -36 18 -36 20 -26 L20 -16 L-26 -16 Z', '#6a4a32', C.ink, 1.3), path('M18 -30 L28 -44 L34 -40 L26 -26 Z', '#6a4a32', C.ink, 1.2), line('M-20 -16 L-22 0 M-12 -16 L-12 0 M8 -16 L8 0 M16 -16 L18 0', C.ink, 3)),
    stand(56, 88, 0.44, fig(60, '#2f4a7a', 'smile', { bottom: C.white }), on(60, 1, bicorneL(), line('M-12 -38 L-6 -30 M12 -38 L6 -30', GOLD, 2)), reach(60, 1, 1, 82, 20)), at(62, 100, 1, path('M-26 -26 C-26 -34 18 -34 20 -26 L20 -16 L-26 -16 Z', '#6a4a32', C.ink, 1.3), path('M-8 -26 L0 -26 L-2 -12 L-8 -12 Z', '#2f4a7a', C.ink, 1), circle(28, -44, 4, '#6a4a32', C.ink, 1.1)), line('M92 66 L92 14', C.dark, 1.6), rect(92, 14, 18, 12, GOLD, 0, C.ink, 0.8), rect(92, 20, 18, 6, '#3f7ab8', 0, null),
    ...[14, 28].map((x, i) => stand(x, 112, 0.36, fig(60, i ? '#c8372d' : '#f4efe2', 'laugh', { skin: i ? DSKIN : MSKIN }), reach(60, 1, 1, 80, 20, i ? DSKIN : MSKIN))), brokenChain(22, 58, 0.9), ring(56, 58, 15)),
  // 2456 Oceaniens sjöfarande kulturer
  'amoc.ögrupp': all(bg(), sea(40), island(30, 60, 14, 6, 1), island(64, 52, 18, 7, 2), island(92, 72, 12, 5, 1), island(48, 90, 16, 6, 1), island(86, 98, 10, 4, 1), cloud(26, 22, 0.8), oval(60, 76, 50, 34)),
  'amoc.dubbelkanot': all(bg(), sea(78), at(60, 84, 1.4, canoe(0, 0, 1, WOOD), canoe(0, 8, 1, WOOD2), rect(-18, -4, 36, 6, '#d9c49a', 1, C.ink, 1), line('M0 -4 L0 -44', C.ink, 1.4), path('M0 -42 C14 -36 20 -18 14 -6 C8 -14 4 -28 0 -42 Z', '#f0e2c0', C.ink, 1.2), path('M0 -42 C-8 -30 -10 -16 -6 -6 L0 -6 Z', '#f0e2c0', C.ink, 1.1), tiny(-12, -4, 0.7, '#c8372d', MSKIN), tiny(10, -4, 0.7, '#4f9d69', MSKIN)), oval(60, 90, 40, 18)),
  'amoc.utriggare': all(bg(), sea(56), canoe(54, 72, 1.5, WOOD), paddler(48, 68, 1, '#c8372d', MSKIN), line('M50 70 L56 92 M66 70 L72 92', WOOD2, 2), ellipse(70, 92, 28, 3.6, '#c9a86a', C.ink, 1.3), oval(70, 92, 34, 9)),
  'amoc.dyning': all(bg('#eaf3f8'), rect(4, 40, 112, 72, SEA, 0, null), ...range(4).map((i) => path(`M4 ${56 + i * 16} C24 ${46 + i * 16} 36 ${46 + i * 16} 56 ${56 + i * 16} C76 ${66 + i * 16} 92 ${66 + i * 16} 116 ${56 + i * 16}`, 'none', C.white, 2.6)),
    canoe(56, 60, 0.6), paddler(54, 57, 0.5, '#c8372d', MSKIN), arrow(16, 30, 44, 30, SEA2, 2.6), greyed(at(98, 24, 1, path('M-14 0 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4', 'none', C.ink, 1.4))), oval(60, 72, 52, 22)),
  'amoc.havsström': all(bg(), sea(16), path('M14 90 C30 40 80 30 104 50', 'none', '#2b6aa0', 9), path('M14 90 C30 40 80 30 104 50', 'none', '#7fc0e8', 4), path('M100 40 L112 52 L96 56 Z', '#2b6aa0', C.ink, 1),
    canoe(60, 36, 0.5), arrow(66, 42, 80, 44, HL, 2), island(98, 96, 14, 6, 1)),
  'amoc.sjöfågel': all(bg(), sea(78), at(58, 50, 1.4, path('M-2 0 C-10 -14 -24 -16 -32 -10 C-22 -10 -12 -6 -4 4 Z', C.white, C.ink, 1.3), path('M2 0 C10 -14 24 -16 32 -10 C22 -10 12 -6 4 4 Z', C.white, C.ink, 1.3), ellipse(0, 2, 8, 4, C.white, C.ink, 1.3), circle(8, 0, 3.4, C.white, C.ink, 1.2), path('M10 0 L16 2 L10 2 Z', C.orange, C.ink, 0.8), circle(9, -1, 0.8, C.ink, null), path('M14 2 L20 6 L16 8 Z', '#8ab4d0', C.ink, 0.6)), ring(60, 50, 32)),
  'amoc.atoll': all(rect(4, 4, 112, 108, SEA2, 3, null), ellipse(60, 58, 46, 40, SAND, C.ink, 1.4), ellipse(60, 58, 38, 32, LAGOON, C.ink, 1.1), ...[[24, 50], [30, 82], [60, 22], [92, 40], [96, 74], [70, 94]].map(([x, y]) => palmT(x!, y!, 0.4)), line('M98 56 L106 60', SEA2, 4), ring(60, 58, 50)),
  'amoc.stenstaty': all(bg('#e6eef2'), field(98, '#9fcb6e'), rect(10, 90, 100, 8, STONE2, 1, C.ink, 1.2), moai(28, 90, 1), moai(52, 90, 1.2), moai(78, 90, 1.1), moai(100, 90, 0.9), cloud(30, 22, 0.7), ring(52, 60, 24)),
  // 2457 Australien och Nya Zeelands historia
  'amoc.aborigin': all(bg('#f6e3c8'), rect(4, 76, 112, 36, RED_EARTH, 0, null), path('M60 76 C62 62 70 56 86 56 C100 56 108 62 110 76 Z', '#b04a2a', C.ink, 1.3), sunD(24, 22, 7),
    at(96, 26, 0.5, path('M-26 -10 C-14 -24 6 -22 12 -18 C20 -24 30 -18 28 -6 C32 4 22 18 10 18 C0 22 -16 18 -22 10 C-30 4 -32 -4 -26 -10 Z', '#e8a060', C.ink, 1.6)), ring(96, 26, 16),
    stand(38, 112, 0.66, fig(60, '#e0b23c', 'smile', { skin: DSKIN, hair: '#2a2420', bottom: '#3a3a40' }))),
  'amoc.straffkoloni': all(bg(), sea(70), ship(30, 72, 0.7), field(84, '#d9c49a'), fence(66, 112, 84, 12), ...[72, 84, 96].map((x) => tent(x, 82, 1)),
    ...[44, 56].map((x) => stand(x, 104, 0.32, fig(60, '#e8dcc0', 'frown', { bottom: '#e8dcc0' }), on(60, 1, line('M-8 -30 L8 -30 M-10 -16 L10 -16', '#7a7a80', 2.4), chain(-10, 46, 10, 46, 4)))), stand(104, 108, 0.34, fig(60, '#c8372d', 'calm', { bottom: C.white }), on(60, 1, hatL('#22252e'))), oval(86, 76, 26, 14)),
  'amoc.deportera': all(bg(), sea(64), greyed(path('M4 64 L4 40 L22 36 L30 64 Z', '#a9c98a', C.ink, 1.2)), path('M116 64 L116 46 L98 44 L92 64 Z', RED_EARTH, C.ink, 1.2), ship(60, 72, 0.9), stand(54, 70, 0.26, fig(60, '#e8dcc0', 'frown')), stand(68, 70, 0.26, fig(60, '#c8372d', 'calm')), arrow(28, 92, 94, 92, HL, 2.8)),
  'amoc.fårfarm': all(bg(), field(66, '#b8d48a'), at(92, 66, 1, rect(-14, -14, 28, 14, C.white, 0, C.ink, 1.2), path('M-16 -14 L0 -24 L16 -14 Z', '#b65a3a', C.ink, 1.2)), at(20, 66, 1, line('M0 0 L0 -30', C.ink, 1.4), ...range(6).map((i) => g(`translate(0 -30) rotate(${i * 60})`, path('M0 0 L2 -8 L-2 -8 Z', SILVER, C.ink, 0.6)))),
    fence(6, 114, 108, 8), ...[[26, 86], [46, 80], [66, 88], [86, 84], [36, 100], [60, 102], [94, 100]].map(([x, y]) => sheep(x!, y!, 1)), oval(60, 92, 50, 20)),
  'amoc.guldrush': all(bg(), field(70, '#c9b07a'), rect(4, 92, 112, 20, SEA, 0, null), waves(8, 108, 100), ...[[20, 66], [34, 64], [90, 64], [104, 66]].map(([x, y]) => tent(x!, y!, 1.2)),
    ...[30, 54, 78].map((x, i) => stand(x, 94, 0.34, fig(60, ['#c8372d', '#3f7ab8', '#4f9d69'][i]!, 'laugh'), on(60, 1, hatL('#6a5a4a')), reach(60, 1, 1, 78, 40))), ...[[42, 96], [66, 98], [90, 96]].map(([x, y]) => ellipse(x!, y!, 7, 2.4, IRON, C.ink, 1)),
    nugget(42, 95), nugget(66, 97), nugget(90, 95), arrow(6, 44, 22, 52, HL, 2), arrow(114, 44, 98, 52, HL, 2), tiny(10, 40, 0.9, C.denim), tiny(110, 40, 0.9, '#8a6bbf'), sparkle(66, 86, 3)),
  'amoc.maori': all(bg(), path('M4 84 C24 64 44 70 60 60 C78 50 96 58 116 52 L116 112 L4 112 Z', '#7fbf5a', C.ink, 1.2),
    at(78, 96, 1, rect(-18, -20, 36, 20, '#8a3a2a', 0, C.ink, 1.3), path('M-24 -18 L0 -38 L24 -18 L18 -18 L0 -32 L-18 -18 Z', '#a8482e', C.ink, 1.2), path('M-3 0 L-3 -12 L3 -12 L3 0 Z', C.dark, null), line('M-14 -18 L-14 0 M14 -18 L14 0', '#e8dcc0', 1.4)),
    at(98, 24, 0.55, path('M0 -24 C6 -18 4 -10 8 -4 L2 0 C-2 -6 -6 -14 0 -24 Z M2 4 C8 8 6 16 0 22 C-6 24 -10 20 -6 14 C-2 10 -2 6 2 4 Z', '#7fbf5a', C.ink, 1.6)), ring(98, 24, 16),
    stand(34, 112, 0.62, fig(60, '#2f4a7a', 'smile', { skin: MSKIN, hairStyle: 'long', bottom: '#3a3a40' }))),
  'amoc.markrättighet': all(bg('#eef3e6'), path('M10 104 L30 70 L110 70 L96 104 Z', '#b8d48a', C.ink, 1.4), `<path d="M10 104 L30 70 L110 70 L96 104 Z" fill="none" stroke="${HL}" stroke-width="2.4" stroke-dasharray="4 3"/>`, tree(90, 86, 0.4, '#4f8a3a'),
    stand(54, 96, 0.5, fig(60, '#4f9d69', 'smile', { skin: DSKIN, bottom: '#3a3a40' }), reach(60, 1, 1, 84, 40, DSKIN)), doc(78, 36, 1.1), greyed(at(22, 34, 1, fence(-12, 12, 0, 10))), ban(22, 30, 12)),
  'amoc.omhänderta.2': all(bg('#efe9df'), field(102, '#cbbd94'), at(98, 96, 1, path('M-18 0 L-18 -12 L-10 -20 L14 -20 L18 -12 L18 0 Z', '#4a4e58', C.ink, 1.2), circle(-10, 2, 4, C.dark, null), circle(10, 2, 4, C.dark, null), rect(-8, -18, 8, 6, '#bfe3f5', 1, null)),
    stand(70, 104, 0.5, fig(60, '#2f4a7a', 'calm', { bottom: '#2f4a7a' }), on(60, 1, hatL('#2f4a7a')), reach(60, 1, -1, 36, 72)), stand(48, 104, 0.3, fig(60, '#e0b23c', 'frown', { skin: DSKIN })),
    stand(18, 108, 0.5, fig(60, '#c8372d', 'frown', { skin: DSKIN, hairStyle: 'long' }), reach(60, 1, 1, 90, 60, DSKIN)), sweat(20, 60), ring(48, 88, 14)),
};
