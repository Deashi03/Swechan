/**
 * Historia & humaniora → Arkeologi & kulturarv → Byggnadshistoria, 2341–2347 (0.40): timber houses,
 * churches and cathedrals, castles and manors, industrial buildings, historical town plans, building
 * conservation and architectural periods.
 * Recurring signs: logs in warm brown with pale round ends, Falu red walls, grey stone, red brick, green
 * copper spires and blue sky. The part the word names is in full colour and often marked with an orange
 * ring or arrow; a grey copy is the contrast. No words or letters (only digits), no brands, no pointing
 * fingers, no religious symbols beyond the shape of the buildings.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#dff0fa';
const GRASS = '#a8d08a';
const GRASS2 = '#6fa45a';
const LOG = '#b07a48';
const LOG2 = '#8a5a34';
const LOGEND = '#e2b27a';
const WOOD = '#a0673d';
const PLANK = '#d9a86c';
const FALU = '#a8322a';
const STONE = '#cfc8ba';
const STONE2 = '#9e978a';
const BRICK = '#b5523b';
const BRICK2 = '#8a3a28';
const ROOF = '#5a4a44';
const TILE = '#c4583a';
const COPPER = '#5fb3a0';
const PLASTER = '#f3ede2';
const YELLOWW = '#f0d68a';
const GLASS = '#bfe3f5';
const GOLD = '#e0b23c';
const WALL = '#f3ede2';
const WATER = '#7fb8dc';
const FIRE = '#f08a2c';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);

// ── Backgrounds and marks ────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const sky = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const room = (col: string = WALL) => rect(4, 4, 112, 108, col, 3, null);
const grass = (y = 104) => rect(4, y, 112, 112 - y, GRASS, 0, null);
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.6);
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, '#3a9a5a', C.ink, 1.2), path('M-3.2 0 L-0.8 2.6 L3.6 -2.8', 'none', C.white, 1.8));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, C.red, C.ink, 1.2), line('M-3 -3 L3 3 M3 -3 L-3 3', C.white, 1.8));
const tree = (x: number, y = 112, s = 1, col: string = GRASS2) => at(x, y, s, rect(-2, -14, 4, 14, WOOD, 1, C.ink, 1), circle(0, -22, 10, col, C.ink, 1.3));
const pine = (x: number, y = 112, s = 1) => at(x, y, s, rect(-1.6, -6, 3.2, 6, WOOD, 0.5, C.ink, 0.8), path('M0 -34 L10 -6 L-10 -6 Z', '#3f7f52', C.ink, 1.2));
const cone = (x: number, y = 112, s = 1) => at(x, y, s, rect(-1.4, -4, 2.8, 4, WOOD, 0.5, null), path('M0 -22 C6 -14 7 -6 0 -4 C-7 -6 -6 -14 0 -22 Z', '#4f9d69', C.ink, 1.1));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 4, C.grey2, null), circle(5, -6, 5, C.grey2, null), circle(2, -14, 6, '#dfe3e7', null));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-8 -2 -8 -12 -2 -20 C-2 -14 2 -14 2 -18 C8 -12 8 -2 0 0 Z', FIRE, C.ink, 1), path('M0 -2 C-3 -3 -3 -8 0 -11 C3 -8 3 -3 0 -2 Z', C.yellow, null));
const drop = (x: number, y: number, s = 1, col = '#5aa0d0') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const sound = (x: number, y: number, dir = 1) => line(`M${x} ${y - 6} q${4 * dir} 6 0 12 M${x + 5 * dir} ${y - 10} q${6 * dir} 10 0 20`, C.ink, 1.4);

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const helmet = (x: number, h = 1, col: string = C.yellow) => on(x, h, path('M-11 -60 C-11 -72 11 -72 11 -60 Z', col, C.ink, 1.4), rect(-13, -61, 26, 3, col, 1, C.ink, 1));
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 L-8 -8 L-4 -4 L0 -10 L4 -4 L8 -8 L7 0 Z', GOLD, C.ink, 1.1));

// ── Building parts ───────────────────────────────────────────────────
/** A stack of n horizontal logs from (x, y) upward, w wide, each h high, with round pale ends. */
const logs = (x: number, y: number, w: number, n: number, h = 6, ends = true) => all(...Array.from({ length: n }, (_, i) => {
  const yy = y - (i + 1) * h;
  return all(rect(x, yy, w, h, LOG, h / 2, C.ink, 1), line(`M${x + 4} ${yy + h / 2} L${x + w - 4} ${yy + h / 2}`, LOG2, 0.6), ends ? all(circle(x, yy + h / 2, h / 2, LOGEND, C.ink, 0.9), circle(x + w, yy + h / 2, h / 2, LOGEND, C.ink, 0.9)) : '');
}));
const logEnd = (x: number, y: number, r = 5) => all(circle(x, y, r, LOGEND, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#c4925a', 0.7), circle(x, y, r * 0.2, '#c4925a', null));
/** A window with a frame, glass and (optional) glazing bars. */
const win = (x: number, y: number, w = 10, h = 12, frame: string = C.white, bars = true) => all(rect(x, y, w, h, frame, 1, C.ink, 1), rect(x + 1.6, y + 1.6, w - 3.2, h - 3.2, GLASS, 0.5, null), bars ? line(`M${x + w / 2} ${y + 1.6} L${x + w / 2} ${y + h - 1.6} M${x + 1.6} ${y + h / 2} L${x + w - 1.6} ${y + h / 2}`, frame, 1.4) : '');
/** A gable house: wall from x to x+w, height h, standing on y; roof peak rh above the wall. */
const house = (x: number, w: number, h: number, wall: string, roof: string = ROOF, rh = 16, y = 112, extra: Svg = '') => all(rect(x, y - h, w, h, wall, 0, C.ink, 1.4), extra, path(`M${x - 4} ${y - h} L${x + w / 2} ${y - h - rh} L${x + w + 4} ${y - h} Z`, roof, C.ink, 1.4));
const door = (x: number, y: number, w = 8, h = 14, col: string = '#6e4426') => all(rect(x, y - h, w, h, col, 1, C.ink, 1), circle(x + w - 2, y - h / 2, 0.8, C.ink, null));
/** Arch outline (round or pointed) with its foot at y, x = centre. */
const archPath = (x: number, y: number, w: number, h: number, pointed: boolean) => pointed
  ? `M${x - w / 2} ${y} L${x - w / 2} ${y - h + w * 0.7} Q${x - w / 2} ${y - h + w * 0.15} ${x} ${y - h} Q${x + w / 2} ${y - h + w * 0.15} ${x + w / 2} ${y - h + w * 0.7} L${x + w / 2} ${y} Z`
  : `M${x - w / 2} ${y} L${x - w / 2} ${y - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y - h + w / 2} L${x + w / 2} ${y} Z`;
const archWin = (x: number, y: number, w: number, h: number, pointed: boolean, fill: string = GLASS, stroke: string = C.ink) => path(archPath(x, y, w, h, pointed), fill, stroke, 1.2);
/** A plain medieval stone church: nave from x to x+w with a tower on the left. */
const church = (x: number, w = 56, s = 1, wall: string = C.white, spire = true, tw = 16) => at(x, 112, s,
  rect(tw, -34, w - tw, 34, wall, 0, C.ink, 1.4), path(`M${tw - 2} -34 L${tw + 4} -46 L${w + 2} -46 L${w + 4} -34 Z`, ROOF, C.ink, 1.3),
  archWin(tw + (w - tw) * 0.35, -12, 6, 14, false), archWin(tw + (w - tw) * 0.7, -12, 6, 14, false),
  rect(0, -60, tw, 60, wall, 0, C.ink, 1.4), archWin(tw / 2, -40, 4, 8, false, C.dark), spire ? path(`M-1 -60 L${tw / 2} -84 L${tw + 1} -60 Z`, COPPER, C.ink, 1.3) : '', door(tw / 2 - 4, 0, 8, 13));
const bell = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-8 6 C-8 -2 -6 -10 0 -10 C6 -10 8 -2 8 6 L10 8 L-10 8 Z', col, C.ink, 1.3), circle(0, 10, 2, C.dark, null), rect(-1.5, -13, 3, 3, C.dark, 0.5, null));
const cow = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -16, 26, 12, C.white, 5, C.ink, 1.2), ellipse(-6, -11, 4, 3, C.dark, null), ellipse(6, -13, 3, 2.4, C.dark, null), line('M-11 -4 L-11 4 M-4 -4 L-4 4 M4 -4 L4 4 M9 -4 L9 4', C.ink, 1.8),
  ellipse(16, -16, 6, 5, C.white, C.ink, 1.2), ellipse(19, -14, 3, 2.2, '#f2b6b6', C.ink, 0.8), line('M13 -21 l-2 -3 M18 -21 l2 -3', C.ink, 1.2), circle(15, -17, 0.8, C.ink, null));
const hay = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 C-12 -16 12 -16 12 0 Z', '#e6c860', C.ink, 1.2), line('M-6 -4 l2 -6 M0 -4 l0 -8 M6 -4 l-2 -6', '#b8962e', 1));
const pot = (x: number, y: number, s = 1, col: string = '#c4703e') => at(x, y, s, path('M-6 -10 L6 -10 L4 0 L-4 0 Z', col, C.ink, 1));
const orangeTree = (x: number, y: number, s = 1) => all(pot(x, y, s), at(x, y, s, rect(-1, -20, 2, 10, WOOD, 0.5, null), circle(0, -26, 8, '#4f9d69', C.ink, 1), circle(-3, -27, 1.8, C.orange, null), circle(3, -24, 1.8, C.orange, null), circle(1, -30, 1.8, C.orange, null)));

/** A symmetric two-storey manor with a hipped roof, centred on x and standing on y. */
const manor = (x: number, y: number, s = 1, wall: string = YELLOWW) => at(x, y, s, rect(-36, -44, 72, 44, wall, 0, C.ink, 1.6), path('M-40 -44 L-28 -62 L28 -62 L40 -44 Z', ROOF, C.ink, 1.4), rect(-4, -70, 8, 10, BRICK, 0, C.ink, 1),
  ...[-28, -16, 8, 20].map((c) => all(win(c, -40, 8, 11), win(c, -22, 8, 11))), door(-5, 0, 10, 16), path('M-8 -16 L0 -22 L8 -16 Z', C.white, C.ink, 1));
/** A palace with a central part and two wings, optionally with a dome. */
const palace = (x: number, y: number, s = 1, wall: string = '#f0e2c4', dome = false) => at(x, y, s, rect(-50, -30, 100, 30, wall, 0, C.ink, 1.6), rect(-18, -44, 36, 44, wall, 0, C.ink, 1.6),
  path('M-52 -30 L-46 -38 L-18 -38 L-18 -30 Z M52 -30 L46 -38 L18 -38 L18 -30 Z', ROOF, C.ink, 1.2), dome ? all(path('M-12 -44 C-12 -64 12 -64 12 -44 Z', COPPER, C.ink, 1.4), line('M0 -61 L0 -68', C.ink, 1.4), circle(0, -69, 2, GOLD, C.ink, 0.8)) : path('M-22 -44 L0 -56 L22 -44 Z', wall, C.ink, 1.4),
  ...[-44, -34, 26, 36].map((c) => win(c, -24, 7, 12)), ...[-12, 4].map((c) => win(c, -38, 8, 12)), door(-5, 0, 10, 16), dome ? all(line('M-50 -30 L50 -30', GOLD, 2), ...[-40, -26, 30, 44].map((c) => circle(c - 2, -27, 1.4, GOLD, null))) : '');
const shieldCrest = (x: number, y: number) => at(x, y, 1, path('M0 -9 L8 -6 C8 2 5 6 0 9 C-5 6 -8 2 -8 -6 Z', '#3f6fb5', C.ink, 1.2), path('M-3 -2 L0 -6 L3 -2 L0 2 Z', GOLD, null));
const cloud2 = (x: number, y: number) => at(x, y, 1, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', C.white, null));
const mini = (x: number, y: number, col: string) => all(circle(x, y - 2, 6, C.skin, C.ink, 1.2), path(`M${x - 6} ${y - 4} C${x - 6} ${y - 11} ${x + 6} ${y - 11} ${x + 6} ${y - 4} C${x + 3} ${y - 7} ${x - 3} ${y - 7} ${x - 6} ${y - 4} Z`, C.hair, null), path(`M${x - 8} ${y + 12} C${x - 8} ${y + 4} ${x + 8} ${y + 4} ${x + 8} ${y + 12} Z`, col, C.ink, 1.2));
/** A water wheel. */
const wheel = (x: number, y: number, r: number) => all(circle(x, y, r, 'none', LOG2, 3), circle(x, y, r * 0.3, LOG, C.ink, 1),
  ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return all(line(`M${x} ${y} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`, LOG2, 1.6), rect(f1(x + Math.cos(a) * r - 2.5), f1(y + Math.sin(a) * r - 2.5), 5, 5, LOG, 0.5, C.ink, 0.8)); }));
const bolt2 = (x: number, y: number) => at(x, y, 1, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.3));
/** A large villa with a tower, centred on x, standing on y. */
const villa = (x: number, y: number, s = 1) => at(x, y, s, rect(-24, -26, 48, 26, '#f6efe0', 0, C.ink, 1.4), path('M-28 -26 L0 -40 L28 -26 Z', '#5a7a8a', C.ink, 1.3), rect(14, -44, 12, 18, '#f6efe0', 0, C.ink, 1.3), path('M12 -44 L20 -54 L28 -44 Z', '#5a7a8a', C.ink, 1.2),
  ...[-18, -6, 6].map((c) => win(c, -20, 7, 10)), win(16, -40, 7, 8));
const dashLine = (x1: number, y1: number, x2: number, y2: number) => line(`M${x1} ${y1} L${x2} ${y2}`, HL, 2, '4 3');
const heartS = (x: number, y: number) => at(x, y, 1, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.3));
const padlock2 = (x: number, y: number) => at(x, y, 1, path('M-7 -4 L-7 -12 C-7 -21 7 -21 7 -12 L7 -4', 'none', C.ink, 3), rect(-11, -5, 22, 18, GOLD, 3, C.ink, 1.6), circle(0, 2, 2.2, C.ink, null), line('M0 2 L0 8', C.ink, 1.8));

// ── Motifs ───────────────────────────────────────────────────────────
export const BUILDING_HISTORY_MOTIFS: Record<string, Svg> = {
  // ── 2341 Trähus och timmerbyggnader ──
  'byhi.timmer': all(sky(), grass(100), pine(18, 100, 1.2), pine(36, 100, 1), pine(100, 100, 1.1),
    ...[[44, 96], [58, 96], [72, 96], [86, 96], [51, 84], [65, 84], [79, 84], [58, 72], [72, 72]].map(([x, y]) => logEnd(x!, y!, 7)), ring(65, 86, 30), ground),
  'byhi.virke': all(sky(), grass(100), ...[0, 1, 2, 3, 4].map((i) => all(rect(24, 96 - i * 8, 72, 7, PLANK, 0.5, C.ink, 1), line(`M28 ${99.5 - i * 8} L92 ${99.5 - i * 8}`, '#c4925a', 0.6))),
    ...[0, 1, 2, 3, 4].map((i) => rect(18, 96 - i * 8, 7, 7, '#e8c48c', 0.5, C.ink, 1)), line('M30 104 L30 100 M90 104 L90 100', WOOD, 3), greyed(logEnd(104, 94, 7)), cross(104, 76, 0.8), ground),
  'byhi.timra': all(sky(), grass(106), logs(50, 106, 60, 6, 7), path('M46 64 L114 64', 'none', C.ink, 0), fig(28, C.denim, 'smile', { h: 0.9 }), reach(28, 0.9, 1, 46, 50), reach(28, 0.9, -1, 12, 56),
    rot(30, 52, 0, 1, rect(14, -6, 50, 7, LOG, 3.5, C.ink, 1), circle(14, -2.5, 3.5, LOGEND, C.ink, 0.9), circle(64, -2.5, 3.5, LOGEND, C.ink, 0.9)), arrow(84, 40, 84, 54, HL, 2.6), ground),
  'byhi.knut.2': all(sky(), ...Array.from({ length: 6 }, (_, i) => all(rect(10, 98 - i * 14, 74, 12, LOG, 6, C.ink, 1.2), line(`M16 ${104 - i * 14} L78 ${104 - i * 14}`, LOG2, 0.6))),
    ...Array.from({ length: 6 }, (_, i) => all(rect(70, 91 - i * 14, 14, 12, LOG2, 2, C.ink, 1), logEnd(96, 97 - i * 14, 6.4))), rect(84, 22, 6, 90, 'none', 0, null), ring(88, 62, 22), ground),
  'byhi.timmerman': all(room('#eef3f6'), path('M64 112 L64 48 L110 48 L110 112 M64 48 L87 28 L110 48 M64 80 L110 80 M64 80 L87 48', 'none', PLANK, 5), path('M64 112 L64 48 L110 48 L110 112 M64 48 L87 28 L110 48 M64 80 L110 80 M64 80 L87 48', 'none', C.ink, 0.6),
    fig(36, '#e08a3c', 'smile', { bottom: C.navy }), helmet(36, 1), rect(24, 66, 24, 4, WOOD, 1, C.ink, 1), reach(36, 1, 1, 60, 72), at(62, 72, 1, rect(0, -2, 6, 4, WOOD, 1, C.ink, 0.8), rect(6, -5, 6, 10, C.grey, 1, C.ink, 0.8)), ground),
  'byhi.syll': all(sky(), grass(108), ...[22, 52, 82, 100].map((x) => ellipse(x, 106, 8, 5, STONE2, C.ink, 1.1)), logs(16, 96, 92, 6, 8, true),
    rect(14, 96, 96, 8, HL, 4, C.ink, 1.4), circle(14, 100, 4, LOGEND, C.ink, 0.9), circle(110, 100, 4, LOGEND, C.ink, 0.9), path('M10 48 L62 22 L114 48 Z', ROOF, C.ink, 1.4), arrow(30, 76, 30, 92, HL, 2.6), ground),
  'byhi.gavel': all(sky(), grass(106), rect(58, 60, 52, 46, FALU, 0, C.ink, 1.4), path('M50 60 L64 30 L116 30 L110 60 Z', ROOF, C.ink, 1.3),
    path('M14 106 L14 60 L36 30 L58 60 L58 106 Z', FALU, C.ink, 1.6), path('M14 60 L36 30 L58 60 Z', '#c8463a', HL, 2.6), win(30, 44, 12, 10), win(30, 74, 12, 14), win(70, 70, 10, 14), win(90, 70, 10, 14), path('M10 62 L36 26 L62 62', 'none', ROOF, 4), ground),
  'byhi.panel': all(sky(), ...Array.from({ length: 11 }, (_, i) => all(rect(12 + i * 9, 20, 9, 92, FALU, 0, C.ink, 1), rect(19 + i * 9, 20, 3, 92, '#8e2a22', 0, C.ink, 0.6))), win(48, 46, 22, 26),
    ring(30, 66, 16), ground),
  'byhi.rödfärg': all(sky(), rect(10, 24, 100, 88, '#d8cfc0', 0, C.ink, 1.2), ...Array.from({ length: 10 }, (_, i) => line(`M${20 + i * 10} 24 L${20 + i * 10} 112`, '#b8ae9c', 1)), rect(10, 24, 54, 88, FALU, 0, C.ink, 1.2),
    ...Array.from({ length: 5 }, (_, i) => line(`M${20 + i * 10} 24 L${20 + i * 10} 112`, '#8e2a22', 1)), at(84, 106, 1, path('M-12 -18 L12 -18 L10 0 L-10 0 Z', C.silver, C.ink, 1.3), ellipse(0, -18, 12, 3, FALU, C.ink, 1), line('M-12 -16 C-14 -28 14 -28 12 -16', C.ink, 1.2)),
    rot(66, 56, 30, 1, rect(-2, -6, 4, 22, WOOD, 1, C.ink, 1), rect(-4, -14, 8, 9, '#3d3f4a', 1, C.ink, 1), rect(-4, -18, 8, 5, FALU, 1, null)), ground),
  'byhi.torvtak': all(sky(), grass(106), logs(22, 106, 76, 6, 7), path('M12 64 L60 34 L108 64 Z', '#7fb05a', C.ink, 1.4), path('M12 64 L60 34 L108 64', 'none', '#5a3a20', 3),
    ...[[30, 54], [44, 46], [60, 40], [76, 46], [92, 54], [52, 52], [68, 52]].map(([x, y]) => line(`M${x} ${y! + 4} l-2 -6 M${x} ${y! + 4} l2 -6`, GRASS2, 1.4)), ...[[38, 52], [70, 44], [84, 54]].map(([x, y]) => circle(x!, y!, 2, C.yellow, null)), circle(56, 46, 2, '#e05a8a', null),
    door(54, 106, 12, 22, LOG2), ring(60, 50, 22), ground),
  'byhi.spåntak': all(sky(), path('M8 108 L60 24 L112 108 Z', '#3d3a38', C.ink, 1.4),
    ...Array.from({ length: 7 }, (_, r) => all(...Array.from({ length: 2 * r + 2 }, (_, i) => { const y = 36 + r * 11, x = 60 - (r + 1) * 6.4 + i * 6.4; return path(`M${f1(x - 3)} ${y} L${f1(x + 3)} ${y} L${f1(x + 3)} ${y + 9} Q${x} ${y + 12} ${f1(x - 3)} ${y + 9} Z`, '#5a4a40', C.ink, 0.8); }))),
    ring(60, 70, 20)),
  'byhi.korsvirke': all(sky(), grass(106), rect(14, 54, 92, 52, PLASTER, 0, C.ink, 1.4), path('M8 54 L60 22 L112 54 Z', TILE, C.ink, 1.4),
    line('M14 54 L106 54 M14 80 L106 80 M14 106 L106 106 M14 54 L14 106 M37 54 L37 106 M60 54 L60 106 M83 54 L83 106 M106 54 L106 106 M14 54 L37 80 M60 80 L83 54 M83 106 L106 80 M37 106 L60 80', LOG2, 4.4),
    win(42, 60, 12, 14, C.white), win(66, 86, 12, 14, C.white), door(20, 106, 10, 22, LOG2), ground),
  'byhi.lada': all(sky('#e6f2f8'), grass(98), path('M20 104 L20 58 L60 38 L100 58 L100 104 Z', '#8e8b84', C.ink, 1.4), ...Array.from({ length: 8 }, (_, i) => line(`M${25 + i * 10} 104 L${25 + i * 10} ${i < 4 ? 56 - i * 4 : 42 + (i - 4) * 4}`, '#6e6b64', 1)),
    rect(44, 70, 32, 34, '#3d3a38', 0, C.ink, 1.2), path('M44 104 C44 86 76 86 76 104 Z', '#e6c860', C.ink, 1), line('M52 96 l2 -6 M60 94 l0 -8 M68 96 l-2 -6', '#b8962e', 1), hay(108, 108, 0.6), hay(10, 108, 0.6), ground),
  'byhi.ladugård': all(sky('#e6f2f8'), grass(100), path('M14 106 L14 54 L60 30 L106 54 L106 106 Z', FALU, C.ink, 1.4), path('M10 56 L60 28 L110 56', 'none', ROOF, 4),
    rect(44, 70, 30, 36, '#5a2a22', 0, C.ink, 1.2), line('M44 70 L74 106 M74 70 L44 106', C.white, 2), win(22, 62, 12, 10), win(86, 62, 12, 10), cow(84, 112, 0.9), ground),
  'byhi.härbre': all(sky(), grass(106), ...[34, 86].map((x) => all(rect(x - 3, 74, 6, 26, LOG2, 1, C.ink, 1.1), ellipse(x, 104, 7, 4, STONE2, C.ink, 1))), rect(26, 70, 68, 5, LOG2, 1, C.ink, 1.1), logs(32, 70, 56, 4, 6),
    path('M22 46 L60 26 L98 46 Z', ROOF, C.ink, 1.4), door(54, 70, 12, 18, LOG2), line('M60 74 L74 104 M64 80 L70 80 M67 88 L73 88 M70 96 L76 96', WOOD, 2), ring(60, 56, 38), ground),

  // ── 2342 Kyrkor och katedraler ──
  'byhi.katedral': all(sky(), rect(20, 46, 80, 66, STONE, 0, C.ink, 1.4), ...[[20, 30], [72, 28]].map(([x, w]) => all(rect(x!, 22, w!, 90, STONE, 0, C.ink, 1.4), path(`M${x!} 22 L${x! + w! / 2} 6 L${x! + w!} 22 Z`, STONE2, C.ink, 1.2), archWin(x! + w! / 2, 50, 10, 18, true))),
    circle(60, 62, 10, '#7a5ab0', C.ink, 1.4), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M60 62 L${f1(60 + Math.cos(a) * 10)} ${f1(62 + Math.sin(a) * 10)}`, C.yellow, 1); }),
    archWin(60, 112, 18, 30, true, '#6e4426'), archWin(34, 112, 10, 22, true, '#6e4426'), archWin(86, 112, 10, 22, true, '#6e4426'), greyed(at(108, 112, 0.5, church(0, 20, 1, C.white, true, 8))), ground),
  'byhi.kyrktorn': all(sky(), grass(108), church(26, 76, 1, C.white, true, 20), rect(26, 52, 20, 60, 'none', 0, null), bell(36, 70, 0.6), sound(50, 70), ring(36, 60, 26), ground),
  'byhi.tornspira': all(sky(), rect(40, 76, 40, 36, C.white, 0, C.ink, 1.4), archWin(60, 104, 10, 18, false, C.dark), path('M38 76 L60 8 L82 76 Z', COPPER, C.ink, 1.6), line('M60 8 L60 2', C.ink, 1.4), line('M44 60 L76 60 M48 44 L72 44 M52 28 L68 28', '#3f8f7f', 1.2), ring(60, 44, 34), ground),
  'byhi.kyrkklocka': all(sky('#eef3f6'), rect(20, 20, 6, 92, WOOD, 1, C.ink, 1.2), rect(94, 20, 6, 92, WOOD, 1, C.ink, 1.2), rect(16, 16, 88, 8, WOOD, 1, C.ink, 1.2), rot(60, 26, 14, 1, line('M0 0 L0 14', C.ink, 2), bell(0, 34, 2.2)),
    sound(92, 62), g('translate(120 0) scale(-1 1)', sound(92, 62)), line('M60 104 L60 92', 'none', 0)),
  'byhi.klockstapel': all(sky(), grass(108), church(8, 52, 0.9, C.white, false, 14),
    path('M76 112 L82 40 L104 40 L110 112 Z', '#3d3a38', C.ink, 1.4), path('M78 40 L93 10 L108 40 Z', '#3d3a38', C.ink, 1.4), rect(84, 46, 18, 16, '#2a2826', 1, null), bell(93, 52, 0.55), line('M80 80 L106 80', '#5a5650', 1), ring(93, 50, 22), ground),
  'byhi.portal': all(sky(), rect(8, 8, 104, 104, STONE, 0, C.ink, 1.4), path(archPath(60, 112, 70, 98, false), '#e8e2d4', C.ink, 1.6), path(archPath(60, 112, 54, 82, false), STONE, C.ink, 1.2), path(archPath(60, 112, 38, 66, false), '#6e4426', C.ink, 1.4),
    ...[30, 90].map((x) => all(circle(x, 56, 3, '#e8e2d4', C.ink, 1), rect(x - 3, 59, 6, 14, '#e8e2d4', 2, C.ink, 1))), line('M60 112 L60 70', C.ink, 1), fig(60, C.green, 'smile', { h: 0.36 }), ring(60, 66, 44)),
  'byhi.vapenhus': all(sky(), grass(108), rect(46, 50, 66, 62, C.white, 0, C.ink, 1.4), path('M42 50 L50 36 L112 36 L116 50 Z', ROOF, C.ink, 1.3), archWin(70, 84, 7, 16, false), archWin(94, 84, 7, 16, false),
    rect(10, 74, 36, 38, '#fbf6ea', 0, C.ink, 1.6), path('M6 74 L28 58 L50 74 Z', ROOF, C.ink, 1.3), archWin(28, 112, 14, 26, false, '#6e4426'), ring(28, 86, 24), ground),
  'byhi.långhus.2': all(sky(), grass(108), greyed(rect(8, 30, 22, 82, C.white, 0, C.ink, 1.4), path('M7 30 L19 8 L31 30 Z', COPPER, C.ink, 1.2)), rect(30, 58, 82, 54, '#f6e2c8', 0, HL, 2.8), path('M28 58 L36 44 L110 44 L114 58 Z', ROOF, C.ink, 1.3),
    ...[44, 62, 80, 98].map((x) => archWin(x, 96, 7, 20, false)), arrow(34, 104, 108, 104, HL, 2.6), ground),
  'byhi.kryssvalv': all(room('#f6f1e6'), rect(14, 14, 92, 92, '#efe6d2', 2, C.ink, 1.6),
    path('M14 14 L60 60 L14 106 Z', '#e6dcc4', null), path('M106 14 L60 60 L106 106 Z', '#e6dcc4', null),
    path('M14 14 Q46 34 60 60 Q74 86 106 106 M106 14 Q74 34 60 60 Q46 86 14 106', 'none', HL, 3.4), line('M14 60 Q40 56 60 60 Q80 64 106 60 M60 14 Q56 40 60 60 Q64 80 60 106', C.ink, 0.8, '3 3'),
    circle(60, 60, 5, GOLD, C.ink, 1.2), ...[[14, 14], [106, 14], [14, 106], [106, 106]].map(([x, y]) => circle(x!, y!, 7, STONE2, C.ink, 1.4))),
  'byhi.strävpelare': all(sky(), rect(6, 30, 108, 82, STONE, 0, C.ink, 1.4), ...[24, 52, 80].map((x) => archWin(x + 14, 96, 12, 50, true)),
    ...[10, 38, 66, 94].map((x) => all(path(`M${x} 112 L${x} 40 L${x + 6} 32 L${x + 12} 40 L${x + 12} 112 Z`, '#e8a070', C.ink, 1.4), line(`M${x} 70 L${x + 12} 70 M${x} 90 L${x + 12} 90`, C.ink, 0.8))), ring(16, 70, 14), ground),
  'byhi.glasmålning': all(room('#efe9de'), path(archPath(60, 92, 44, 84, true), '#3d3f4a', C.ink, 2),
    ...[[42, 60, '#d64545'], [54, 60, '#3f6fb5'], [66, 60, C.yellow], [42, 72, '#4f9d69'], [54, 72, '#d64545'], [66, 72, '#3f6fb5'], [42, 84, '#3f6fb5'], [54, 84, C.yellow], [66, 84, '#4f9d69'], [48, 36, '#8a6bbf'], [60, 36, '#d64545'], [54, 24, C.yellow], [48, 48, '#3f6fb5'], [60, 48, '#4f9d69']].map(([x, y, c]) => rect(x as number, y as number, 12, 12, c as string, 0, C.ink, 0.8)),
    path('M38 92 L20 112 L100 112 L82 92 Z', 'rgba(242,193,78,0.35)', null), ellipse(46, 106, 8, 2.4, 'rgba(214,69,69,0.5)', null), ellipse(72, 106, 8, 2.4, 'rgba(63,111,181,0.5)', null)),
  'byhi.rosettfönster': all(sky(), rect(8, 8, 104, 104, STONE, 0, C.ink, 1.4), circle(60, 56, 42, STONE2, C.ink, 1.6), circle(60, 56, 38, '#3f6fb5', C.ink, 1.2),
    ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, cx = 60 + Math.cos(a) * 24, cy = 56 + Math.sin(a) * 24; return all(line(`M60 56 L${f1(60 + Math.cos(a) * 38)} ${f1(56 + Math.sin(a) * 38)}`, STONE2, 2.4), circle(f1(cx), f1(cy), 6, i % 3 === 0 ? '#d64545' : i % 3 === 1 ? C.yellow : '#4f9d69', C.ink, 0.8)); }),
    circle(60, 56, 10, '#d64545', C.ink, 1.2), circle(60, 56, 4, C.yellow, null)),
  'byhi.kalkmålning': all(room('#f8f4ea'), path('M4 50 Q60 0 116 50', 'none', C.ink, 1.6), path('M4 50 Q60 0 116 50 L116 112 L4 112 Z', '#fbf8f0', null),
    path('M4 50 Q60 0 116 50', 'none', C.ink, 1.6), at(30, 52, 1, path('M-8 6 C-6 -2 6 -2 8 6 Z M-4 6 L-4 12 M4 6 L4 12', '#c0583a', '#a04628', 1.2), circle(0, -4, 4, 'none', '#a04628', 1.2)),
    at(60, 36, 1, circle(0, -4, 4, 'none', '#a04628', 1.2), path('M-6 14 L0 2 L6 14 Z', 'none', '#a04628', 1.2)), at(90, 52, 1, path('M-10 4 C-6 -4 6 -4 10 4 L12 0 L12 8 L10 4 C6 10 -6 10 -10 4 Z', 'none', '#3f7f6a', 1.4)),
    path('M14 70 C30 64 40 76 56 70 C70 64 82 76 106 70', 'none', '#3f7f6a', 1.6), ...[24, 46, 70, 94].map((x) => all(circle(x, 82, 2.4, '#c0583a', null), line(`M${x} 84 L${x} 92`, '#3f7f6a', 1.2))), ring(60, 40, 22)),
  'byhi.predikstol': all(room('#efe9de'), rect(84, 4, 16, 108, STONE, 0, C.ink, 1.2), g('translate(0 -18)', fig(64, C.dark, 'calm', { h: 0.62 })), at(0, 0, 1, path('M48 66 L80 66 L76 86 L52 86 Z', '#8a5a34', C.ink, 1.6), path('M52 86 L76 86 L64 96 Z', '#8a5a34', C.ink, 1.4), line('M50 72 L78 72', GOLD, 2)), rect(80, 70, 4, 6, '#8a5a34', 0, C.ink, 1),
    sound(46, 56, -1), ...[16, 34].map((x) => all(rect(x - 8, 100, 16, 4, WOOD, 1, C.ink, 1), circle(x, 92, 4, C.hair, C.ink, 1))), ring(64, 72, 22)),
  'byhi.krypta': all(sky(), rect(4, 56, 112, 56, '#8a7a68', 0, null), g('translate(0 -56)', church(30, 76, 0.6, C.white, true, 18)), rect(14, 66, 92, 40, '#e8e0cc', 4, C.ink, 1.4),
    ...[34, 60, 86].map((x) => all(rect(x - 3, 74, 6, 32, STONE, 0, C.ink, 1), path(`M${x - 13} 74 Q${x} 64 ${x + 13} 74`, 'none', C.ink, 1.2))), rect(46, 96, 28, 10, STONE2, 1, C.ink, 1.1), line('M60 70 l0 0', C.ink), ring(60, 86, 28), line('M4 56 L116 56', C.ink, 1.4)),
  // ── 2343 Slott och herrgårdar ──
  'byhi.herrgård': all(sky(), grass(100), manor(60, 100, 1), ...[8, 112].map((x) => tree(x, 106, 0.9)), path('M48 112 L54 100 L66 100 L72 112 Z', '#e6d3b3', null), ground),
  'byhi.säteri': all(sky(), grass(100), manor(48, 100, 0.85), rect(96, 28, 2, 72, C.dark, 0, null), path('M98 30 L114 34 L98 40 Z', '#3f6fb5', C.ink, 1), shieldCrest(90, 70), at(100, 96, 1, circle(0, 0, 7, GOLD, C.ink, 1.2), circle(0, 0, 4, 'none', '#b88a20', 1)), cross(110, 86, 0.6), ground),
  'byhi.lustslott': all(sky('#2f3f6a'), rect(4, 80, 112, 32, WATER, 0, null), palace(60, 80, 0.9, YELLOWW), ...[[20, 20, C.yellow], [96, 16, '#ef9fb5'], [70, 12, C.mint]].map(([x, y, c]) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${x} ${y} L${f1((x as number) + Math.cos(a) * 8)} ${f1((y as number) + Math.sin(a) * 8)}`, c as string, 1.6); }))),
    at(30, 104, 0.6, path('M-14 0 L14 0 L10 6 L-10 6 Z', C.white, C.ink, 1.4)), ellipse(60, 96, 30, 2, 'rgba(255,255,255,0.4)', null)),
  'byhi.residens': all(sky(), grass(104), palace(60, 104, 1, '#f0e2c4'), rect(58, 6, 2, 22, C.dark, 0, null), path('M60 8 L76 12 L60 18 Z', '#3f6fb5', C.ink, 1), line('M60 12 L76 12', '#f2c14e', 2),
    rect(52, 72, 16, 16, GLASS, 1, C.ink, 1.2), circle(60, 80, 3.4, C.skin, C.ink, 0.9), crown(60, 76, 0.5), path('M54 88 C54 84 66 84 66 88 Z', '#7a3a6a', null), ground),
  'byhi.slottspark': all(sky(), rect(4, 50, 112, 62, GRASS, 0, null), palace(60, 50, 0.55, '#f0e2c4'), path('M56 50 L64 50 L80 112 L40 112 Z', '#e6d3b3', null), line('M4 78 L116 78', '#e6d3b3', 5),
    ...[[20, 66], [36, 66], [84, 66], [100, 66], [16, 100], [32, 100], [88, 100], [104, 100]].map(([x, y]) => cone(x!, y!, 0.8)), circle(60, 78, 7, WATER, C.ink, 1.2), line('M60 78 l0 -8 M60 70 q-4 2 -6 6 M60 70 q4 2 6 6', '#5aa0d0', 1.2)),
  'byhi.orangeri': all(sky(), grass(106), rect(10, 52, 100, 54, '#f0e2c4', 0, C.ink, 1.4), rect(10, 46, 100, 6, '#e6d3b3', 0, C.ink, 1.2),
    ...[20, 38, 56, 74, 92].map((x) => archWin(x + 4, 104, 14, 46, false, 'rgba(191,227,245,0.85)')), ...[24, 60, 96].map((x) => orangeTree(x, 102, 0.9)), ground),
  'byhi.paviljong': all(sky(), grass(98), rect(4, 98, 112, 14, WATER, 0, null), path('M30 54 L60 26 L90 54 Z', '#d64545', C.ink, 1.4), path('M26 54 L94 54 L90 58 L30 58 Z', GOLD, C.ink, 1.2), line('M60 26 L60 18', C.ink, 1.4), circle(60, 17, 2, GOLD, C.ink, 0.8),
    ...[34, 50, 70, 86].map((x) => rect(x - 2, 58, 4, 34, C.white, 0.5, C.ink, 1)), rect(28, 90, 64, 6, '#e6d3b3', 0.5, C.ink, 1.2), at(54, 90, 0.8, mini(0, -14, C.orange)), at(70, 90, 0.8, mini(0, -14, C.green)), ground),
  'byhi.festsal': all(room('#f4e8d6'), rect(4, 86, 112, 26, '#c9a06a', 0, null), ...[14, 94].map((x) => all(rect(x, 24, 12, 50, '#dfe9ef', 1, GOLD, 2), line(`M${x + 3} 30 L${x + 6} 40`, C.white, 1.2))),
    line('M60 4 L60 14', GOLD, 1.4), path('M44 20 Q60 32 76 20', 'none', GOLD, 2), ...[44, 52, 60, 68, 76].map((x) => all(line(`M${x} ${x === 60 ? 26 : 22} l0 4`, GOLD, 1), circle(x, x === 60 ? 31 : 27, 2, '#fff4c0', GOLD, 0.8))), sparkle(36, 18, 3), sparkle(84, 18, 3),
    fig(50, '#7a3a6a', 'love', { h: 0.62, hairStyle: 'long' }), fig(70, C.navy, 'love', { h: 0.66 })),
  'byhi.takmålning': all(room('#f4e8d6'), rect(8, 8, 104, 46, '#9fd0ee', 2, GOLD, 3), cloud2(36, 30), cloud2(80, 24), circle(60, 40, 5, C.skin, C.ink, 1), path('M50 52 C54 42 66 42 70 52', '#d64545', C.ink, 1), sparkle(96, 44, 3),
    rect(8, 54, 104, 6, GOLD, 0, C.ink, 1), g('translate(0 0)', fig(60, C.green, 'shock', { h: 0.5 })), arrow(66, 76, 70, 62, HL, 2.2)),
  'byhi.gobeläng': all(room(), rect(14, 4, 92, 4, WOOD, 1, C.ink, 1.2), rect(18, 8, 84, 92, '#8a3a3a', 1, C.ink, 1.6), rect(22, 12, 76, 84, '#c9b07a', 1, C.ink, 1), tree(40, 86, 1, '#4f7f4a'), tree(84, 80, 0.8, '#4f7f4a'),
    at(62, 82, 1, path('M-12 0 L-10 -10 L10 -10 L12 0 M-10 -10 C-8 -14 8 -14 12 -10 M12 -12 L16 -20 L18 -14', '#8a5a34', C.ink, 1.2), line('M14 -20 l-3 -6 M16 -20 l3 -6', C.ink, 1.2)), line('M22 96 L98 96', '#5a2a2a', 2),
    ...Array.from({ length: 14 }, (_, i) => line(`M${22 + i * 6} 100 L${22 + i * 6} 106`, '#c9a040', 1.4)), ground),
  'byhi.kakelugn': all(room('#e8eef2'), rect(4, 104, 112, 8, '#c9a06a', 0, null), path('M34 104 L34 28 Q34 16 60 14 Q86 16 86 28 L86 104 Z', C.white, C.ink, 1.6),
    ...[40, 56, 72].map((y) => line(`M34 ${y} L86 ${y}`, '#c9d3dc', 1)), ...[47, 60, 73].map((x) => line(`M${x} 28 L${x} 104`, '#c9d3dc', 1)), ...[[40, 34], [66, 34], [53, 50], [40, 64], [66, 64]].map(([x, y]) => circle(x! + 1, y!, 2.6, 'none', '#3f6fb5', 1)),
    rect(50, 80, 20, 14, '#c9c3b6', 1, C.ink, 1.2), rect(53, 83, 14, 8, FIRE, 1, null), line('M30 104 L90 104', C.ink, 2), line('M20 70 q4 -4 0 -8 M100 70 q-4 -4 0 -8', '#ef8a3c', 1.6)),

  // ── 2344 Industribyggnader ──
  'byhi.bruk': all(sky(), grass(100), rect(4, 96, 112, 16, WATER, 0, null), rect(44, 54, 50, 44, STONE, 0, C.ink, 1.4), path('M40 54 L69 38 L98 54 Z', ROOF, C.ink, 1.3), rect(76, 20, 10, 34, BRICK, 0, C.ink, 1.2), smoke(81, 16),
    wheel(36, 84, 12), house(98, 14, 12, FALU, ROOF, 6, 100), house(4, 14, 12, FALU, ROOF, 6, 100)),
  'byhi.bruksort': all(sky(), grass(96), rect(46, 50, 30, 30, STONE, 0, C.ink, 1.2), rect(66, 26, 6, 24, BRICK, 0, C.ink, 1), smoke(69, 22, 0.7),
    ...[[8, 96], [26, 96], [86, 96], [104, 96], [16, 110], [36, 110], [76, 110], [96, 110]].map(([x, y]) => house(x!, 12, 10, FALU, ROOF, 6, y!)), house(52, 18, 14, '#fbf6ea', ROOF, 8, 104), ring(60, 76, 36)),
  'byhi.masugn': all(sky('#3d3f4a'), rect(4, 100, 112, 12, '#5a4a40', 0, null), path('M36 100 L42 24 L78 24 L84 100 Z', STONE2, C.ink, 1.6), ...[40, 56, 72, 88].map((y) => line(`M${36 + (100 - y) * 0.08} ${y} L${84 - (100 - y) * 0.08} ${y}`, '#7a746a', 1)), flame(60, 22, 1),
    rect(52, 82, 16, 14, '#2e2e36', 2, C.ink, 1.2), path('M60 92 C66 96 80 98 104 100 L104 104 C80 102 66 100 58 96 Z', FIRE, null), path('M60 92 C66 96 80 98 104 100', 'none', C.yellow, 1.4), sparkle(96, 92, 3, C.yellow), ground),
  'byhi.vattenkvarn': all(sky(), grass(100), path('M4 98 C30 94 50 104 80 98 L116 100 L116 112 L4 112 Z', WATER, null), rect(50, 46, 60, 52, '#8e8b84', 0, C.ink, 1.4), path('M46 46 L80 26 L114 46 Z', ROOF, C.ink, 1.3), win(70, 58, 12, 12), wheel(34, 82, 20), drop(16, 70), drop(22, 62), ground),
  'byhi.väderkvarn': all(sky(), grass(102), path('M48 102 L52 52 L68 52 L72 102 Z', '#8a5a34', C.ink, 1.4), path('M46 52 L60 40 L74 52 Z', ROOF, C.ink, 1.3), rect(56, 90, 8, 12, '#5a3a20', 1, C.ink, 1),
    ...[0, 90, 180, 270].map((r) => rot(60, 48, r + 20, 1, rect(-3, -40, 6, 36, '#f0e6d2', 1, C.ink, 1.1), line('M-3 -32 L3 -32 M-3 -24 L3 -24 M-3 -16 L3 -16', C.ink, 0.6))), circle(60, 48, 3, C.dark, null), line('M60 102 L80 112', WOOD, 2), ground),
  'byhi.sågverk': all(sky(), grass(106), rect(36, 46, 52, 60, '#8e8b84', 0, C.ink, 1.4), path('M32 46 L62 28 L92 46 Z', ROOF, C.ink, 1.3), circle(62, 76, 14, C.silver, C.ink, 1.4), ...Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return path(`M${f1(62 + Math.cos(a) * 14)} ${f1(76 + Math.sin(a) * 14)} l${f1(Math.cos(a + 0.8) * 4)} ${f1(Math.sin(a + 0.8) * 4)}`, 'none', C.ink, 1); }), circle(62, 76, 3, C.dark, null),
    ...[0, 1, 2].map((i) => logEnd(16, 100 - i * 11, 5.4)), arrow(24, 90, 36, 90, HL, 2.4), ...[0, 1, 2, 3].map((i) => rect(92, 102 - i * 6, 22, 5, PLANK, 0.5, C.ink, 0.9)), arrow(88, 84, 100, 84, HL, 2.4), ground),
  'byhi.tegelbruk': all(sky(), grass(106), path('M10 106 L10 66 Q36 50 62 66 L62 106 Z', BRICK, C.ink, 1.4), rect(70, 20, 10, 86, BRICK2, 0, C.ink, 1.2), smoke(75, 16), path('M28 106 L28 88 Q36 80 44 88 L44 106 Z', '#2e2e36', C.ink, 1), rect(30, 92, 12, 10, FIRE, 1, null),
    ...[[88, 100], [100, 100], [94, 94], [88, 88], [100, 88], [94, 82]].map(([x, y]) => rect(x! - 5, y!, 10, 6, BRICK, 0.5, C.ink, 0.9)), ground),
  'byhi.gjuteri': all(room('#3d3f4a'), rect(4, 96, 112, 16, '#5a5650', 0, null), fig(34, '#6e6b64', 'calm', { h: 0.9 }), helmet(34, 0.9, C.grey), reach(34, 0.9, 1, 62, 60),
    rot(70, 60, 30, 1, path('M-10 -8 L10 -8 L8 8 L-8 8 Z', C.dark, C.ink, 1.4), rect(-24, -2, 14, 4, C.dark, 1, C.ink, 1)), path('M76 66 C78 74 80 80 82 86', 'none', FIRE, 4), path('M76 66 C78 74 80 80 82 86', 'none', C.yellow, 1.4),
    rect(66, 86, 34, 10, '#c9a888', 1, C.ink, 1.2), ellipse(82, 87, 8, 2, FIRE, null), sparkle(92, 76, 3, C.yellow), sparkle(70, 82, 2, C.yellow)),
  'byhi.väveri': all(room('#efe6d8'), ...[0, 1].map((i) => at(18 + i * 52, 104, 0.9, rect(0, -44, 4, 44, WOOD, 1, C.ink, 1), rect(40, -44, 4, 44, WOOD, 1, C.ink, 1), rect(0, -46, 44, 4, WOOD, 1, C.ink, 1), rect(4, -36, 36, 22, i ? '#3f6fb5' : '#d64545', 0, C.ink, 1),
    ...Array.from({ length: 6 }, (_, k) => line(`M${8 + k * 6} -36 L${8 + k * 6} -14`, C.white, 0.6)), rect(0, -14, 44, 4, WOOD, 1, C.ink, 1))), fig(60, C.yellow, 'calm', { h: 0.5, hairStyle: 'long' }), ...[30, 60, 90].map((x) => circle(x, 12, 3, '#fff4c0', C.ink, 0.8)), ground),
  'byhi.kraftverk': all(sky(), grass(100), path('M4 40 L30 40 L42 100 L4 100 Z', WATER, null), rect(30, 44, 52, 56, BRICK, 0, C.ink, 1.4), path('M26 44 L56 30 L86 44 Z', ROOF, C.ink, 1.3), ...[40, 56, 72].map((x) => archWin(x, 74, 8, 18, false)),
    path('M30 100 C40 104 60 102 82 100 L82 104 L30 104 Z', WATER, null), bolt2(98, 40), line('M92 100 L96 60 L100 100 M94 76 L98 76 M86 64 L106 64', C.dark, 1.6), line('M106 64 L116 70 M86 64 L80 58', C.dark, 1), ground),
  'byhi.gruvlave': all(sky(), rect(4, 80, 112, 32, '#8a6a50', 0, null), line('M4 80 L116 80', C.ink, 1.4), path('M38 80 L50 18 L70 18 L82 80', 'none', C.dark, 3), line('M42 60 L78 60 M46 40 L74 40 M42 60 L74 40 M46 40 L78 60', C.dark, 1.6),
    circle(60, 16, 8, 'none', C.dark, 2.4), circle(60, 16, 2, C.dark, null), line('M60 24 L60 98', C.ink, 1), rect(54, 82, 12, 26, '#5a4a40', 0, C.ink, 1), rect(55, 92, 10, 10, C.yellow, 1, C.ink, 1), ring(60, 40, 32)),
  'byhi.arbetarbostad': all(sky(), grass(106), rect(84, 30, 8, 46, BRICK, 0, C.ink, 1.1), rect(70, 54, 40, 24, BRICK, 0, C.ink, 1.2), smoke(88, 26, 0.8),
    rect(8, 82, 102, 24, '#d9c8a0', 0, C.ink, 1.4), path('M4 82 L114 82 L108 72 L10 72 Z', ROOF, C.ink, 1.3), ...[0, 1, 2, 3].map((i) => all(door(14 + i * 25, 106, 7, 14), win(24 + i * 25, 88, 8, 9))), ring(58, 90, 26), ground),
  'byhi.disponentvilla': all(sky(), path('M4 70 Q60 30 116 70 L116 112 L4 112 Z', GRASS, null), villa(60, 58, 1), tree(24, 64, 0.8), tree(96, 64, 0.8),
    rect(8, 92, 24, 14, '#8e8b84', 0, C.ink, 1), rect(20, 76, 5, 16, BRICK, 0, C.ink, 1), ...[60, 76, 92].map((x) => house(x, 12, 10, FALU, ROOF, 6, 108)), ring(60, 46, 24)),
  'byhi.industriminne': all(sky(), grass(104), rect(24, 46, 72, 58, BRICK, 0, C.ink, 1.4), path('M20 46 L60 28 L100 46 Z', ROOF, C.ink, 1.3), ...[36, 60, 84].map((x) => archWin(x, 92, 10, 26, false)), rect(86, 14, 8, 32, BRICK2, 0, C.ink, 1.1),
    fig(12, C.green, 'smile', { h: 0.42 }), fig(108, C.orange, 'smile', { h: 0.42 }), fig(24, C.sky, 'smile', { h: 0.4, hairStyle: 'long' }), sparkle(14, 28, 4, GOLD), sparkle(106, 32, 3, GOLD), ground),

  // ── 2345 Historiska stadsplaner ──
  'byhi.stadsplan': all(room(), rect(4, 80, 112, 32, C.tan, 0, C.ink, 1.2), rot(60, 50, -4, 1, rect(-40, -34, 80, 60, '#fbf8ee', 1, C.ink, 1.4), ...[-28, -12, 4, 20].map((x) => rect(x, -28, 12, 10, '#e6d3b3', 0.5, '#9e978a', 0.8)), ...[-28, -12, 4, 20].map((x) => rect(x, -12, 12, 10, '#e6d3b3', 0.5, '#9e978a', 0.8)), rect(-28, 4, 28, 14, GRASS, 0.5, '#9e978a', 0.8), rect(4, 4, 28, 14, '#e6d3b3', 0.5, '#9e978a', 0.8)),
    rot(86, 88, -30, 1, rect(-2, -16, 4, 20, C.yellow, 1, C.ink, 0.9), path('M-2 4 L0 9 L2 4 Z', C.tan, C.ink, 0.6)), rect(20, 92, 48, 5, '#dfe9ef', 0.5, C.ink, 1), ...[24, 30, 36, 42, 48, 54, 60].map((x) => line(`M${x} 92 L${x} 94`, C.ink, 0.6))),
  'byhi.rutnätsplan': all(room(), rect(8, 14, 62, 62, '#fbf8ee', 1, C.ink, 1.4), ...[0, 1, 2, 3].map((r) => all(...[0, 1, 2, 3].map((c) => rect(12 + c * 14.6, 18 + r * 14.6, 11, 11, '#e6b08a', 0.5, C.ink, 0.8)))), ring(39, 45, 36),
    greyed(rect(78, 66, 36, 40, '#fbf8ee', 1, C.ink, 1.2), path('M82 72 C92 76 96 70 110 74 M84 100 C90 86 100 92 98 70 M80 88 C94 84 100 100 112 96', 'none', C.ink, 1.4)), cross(96, 60, 0.6)),
  'byhi.medeltidsstad': all(sky(), grass(108), path('M10 108 C10 60 110 60 110 108 Z', '#e6d3b3', null), path('M10 108 C10 60 110 60 110 108', 'none', STONE2, 5),
    ...[[24, 96], [38, 88], [52, 84], [74, 86], [88, 92], [30, 104], [96, 104], [46, 100], [76, 100]].map(([x, y], i) => house(x! - 5, 10, 9, i % 2 ? '#e6c8a0' : PLASTER, TILE, 5, y!)), church(50, 24, 0.6, C.white, true, 10), ...[16, 104].map((x) => rect(x - 4, 80, 8, 28, STONE, 0, C.ink, 1)), ground),
  'byhi.stadsport': all(sky(), grass(108), rect(4, 58, 112, 50, STONE, 0, C.ink, 1.4), ...[8, 20, 32, 80, 92, 104].map((x) => rect(x, 52, 8, 6, STONE, 0, C.ink, 1)), rect(38, 20, 44, 88, STONE2, 0, C.ink, 1.6), path('M36 20 L60 6 L84 20 Z', TILE, C.ink, 1.3),
    path(archPath(60, 108, 24, 40, true), '#3d3a38', C.ink, 1.4), ...[44, 52, 60, 68, 76].map((x) => line(`M${x} 74 L${x} 80`, 'none', 0)), rect(54, 34, 12, 10, '#3d3a38', 1, null), fig(60, C.green, 'smile', { h: 0.3 }), ring(60, 88, 20), ground),
  'byhi.bastion': all(rect(4, 4, 112, 108, '#cfe6c0', 3, null), path('M60 14 L74 34 L98 30 L92 54 L110 70 L86 80 L84 104 L60 92 L36 104 L34 80 L10 70 L28 54 L22 30 L46 34 Z', '#c9b48a', C.ink, 1.6), path('M60 30 L70 42 L84 42 L80 56 L88 66 L76 72 L74 86 L60 80 L46 86 L44 72 L32 66 L40 56 L36 42 L50 42 Z', '#e6d3b3', null),
    path('M86 80 L110 70 L92 54 Z', HL, C.ink, 1.4), ...[[52, 54], [64, 52], [58, 64], [68, 66]].map(([x, y]) => rect(x! - 4, y! - 3, 8, 6, TILE, 0.5, C.ink, 0.8)), ring(96, 68, 16)),
  'byhi.förstad': all(sky(), grass(100), rect(4, 40, 60, 60, '#e6d3b3', 0, null), line('M64 40 L64 100', STONE2, 6), ...[[14, 62], [34, 62], [14, 86], [34, 86], [50, 74]].map(([x, y]) => house(x!, 12, 12, PLASTER, TILE, 6, y!)),
    ...[[74, 92], [92, 96], [80, 108], [100, 108]].map(([x, y]) => house(x!, 10, 9, '#c9a888', ROOF, 5, y!)), line('M116 100 L64 70', '#e6d3b3', 0), ring(92, 98, 20), ground),
  'byhi.esplanad': all(sky(), path('M4 112 L52 46 L68 46 L116 112 Z', '#e6d3b3', null), path('M34 112 L56 46 L64 46 L86 112 Z', '#cfe0b8', null), path('M44 112 L58 46 L62 46 L76 112 Z', '#e6d3b3', null),
    ...[[30, 112, 1.1], [42, 88, 0.8], [50, 70, 0.6], [55, 58, 0.4], [90, 112, 1.1], [78, 88, 0.8], [70, 70, 0.6], [65, 58, 0.4]].map(([x, y, s]) => tree(x!, y!, s!)), rect(4, 30, 20, 60, PLASTER, 0, C.ink, 1), rect(96, 30, 20, 60, PLASTER, 0, C.ink, 1), fig(60, C.orange, 'smile', { h: 0.18 })),
  'byhi.brandgata': all(sky(), grass(104), ...[0, 1, 2].map((i) => house(6 + i * 14, 12, 18, '#c9a888', ROOF, 8, 104 - i * 6)), ...[0, 1, 2].map((i) => house(76 + i * 14, 12, 18, '#c9a888', ROOF, 8, 104 - i * 6)), flame(14, 80), flame(30, 74, 0.9), flame(46, 70, 0.8),
    path('M52 104 L58 60 L72 60 L76 104 Z', '#e6d3b3', HL, 2.4), arrow(64, 96, 64, 66, HL, 0), tick(90, 50, 0.8), ground),
  'byhi.stadsbrand': all(sky('#f6d8b8'), ...[[6, 18, 98], [26, 16, 104], [44, 20, 96], [66, 16, 104], [84, 18, 98], [100, 14, 104]].map(([x, w, y]) => house(x!, w!, 16, '#8a6a50', ROOF, 8, y!)), ...[[14, 74], [34, 82], [54, 70], [74, 80], [92, 74], [108, 82]].map(([x, y]) => flame(x!, y!, 1.3)),
    smoke(30, 40, 1.6), smoke(80, 34, 1.8), rect(4, 104, 112, 8, '#8a6a50', 0, null), ground),
  'byhi.stadsprivilegium': all(sky(), grass(106), house(80, 12, 12, PLASTER, TILE, 6, 106), house(96, 12, 14, PLASTER, TILE, 6, 106), fig(24, '#7a3a6a', 'calm', { h: 0.9 }), crown(24, 48, 0.9), reach(24, 0.9, 1, 46, 72),
    rot(54, 70, 0, 1, rect(-8, -14, 18, 26, '#f3e6c4', 1, C.ink, 1.2), line('M-4 -8 L6 -8 M-4 -3 L6 -3 M-4 2 L4 2', '#9e978a', 1), circle(1, 14, 4, C.red, C.ink, 1)), fig(78, C.green, 'smile', { h: 0.72 }), reach(78, 0.72, -1, 62, 76), arrow(42, 30, 66, 30, HL, 2.4)),

  // ── 2346 Byggnadsvård ──
  'byhi.byggnadsvård': all(sky(), grass(106), house(14, 64, 50, '#e6c8a0', TILE, 18, 106, all(win(24, 64, 12, 16), win(52, 64, 12, 16))), fig(98, C.denim, 'calm', { h: 0.82 }), reach(98, 0.82, -1, 72, 66), rot(70, 68, -30, 1, rect(-1.4, -4, 2.8, 10, WOOD, 1, C.ink, 0.8), rect(-3, -9, 6, 6, '#3d3f4a', 1, C.ink, 0.8)), heartS(98, 24), sparkle(34, 30, 3)),
  'byhi.byggnadsminne': all(sky(), grass(106), manor(60, 106, 0.75), at(60, 66, 1.3, path('M0 -14 L12 -10 C12 2 8 8 0 13 C-8 8 -12 2 -12 -10 Z', 'rgba(63,111,181,0.25)', '#3f6fb5', 1.6)), line('M18 106 C18 30 102 30 102 106', '#3f6fb5', 2.6, '5 4'), ground),
  'byhi.kulturhistorisk': all(sky(), grass(106), house(38, 44, 36, '#e6c8a0', TILE, 14, 106, win(54, 80, 12, 14)), at(18, 40, 1, path('M-8 -12 L8 -12 L8 -10 L1 0 L8 10 L8 12 L-8 12 L-8 10 L-1 0 L-8 -10 Z', '#f3e6c4', C.ink, 1.2), path('M-5 9 L5 9 L0 3 Z', '#e0b23c', null)),
    at(100, 40, 1, rect(-10, -12, 20, 24, '#f3e6c4', 1, C.ink, 1.2), line('M-6 -6 L6 -6 M-6 -1 L6 -1 M-6 4 L2 4', '#9e978a', 1)), dashLine(26, 46, 44, 66), dashLine(92, 46, 76, 66), sparkle(60, 22, 5, GOLD)),
  'byhi.k-märkt': all(sky(), grass(106), house(26, 56, 40, '#e6c8a0', TILE, 16, 106, all(win(34, 74, 12, 16), win(60, 74, 12, 16))), padlock2(54, 46), greyed(at(100, 96, 1, rect(-8, -12, 16, 20, C.white, 1, C.ink, 1.2))), cross(100, 70, 0.7), ground),
  'byhi.byggnadsantikvarie': all(sky(), house(4, 60, 76, '#e6c8a0', TILE, 16, 112, win(22, 54, 22, 28)), fig(88, '#3f6fb5', 'calm', { hairStyle: 'long', h: 0.92 }), rect(94, 66, 14, 18, '#f3e6c4', 1, C.ink, 1.1), reach(88, 0.92, 1, 100, 76),
    reach(88, 0.92, -1, 54, 64), circle(48, 62, 8, 'rgba(191,227,245,0.5)', C.ink, 1.6), line('M54 68 L58 72', C.ink, 2.4), ground),
  'byhi.underhåll': all(sky(), grass(106), house(8, 64, 60, FALU, ROOF, 16, 106, win(30, 64, 16, 18)), line('M86 106 L74 32 M98 106 L86 32 M84 92 L96 92 M82 78 L94 78 M80 64 L92 64 M78 50 L90 50', WOOD, 2.2), at(90, 58, 0.55, fig(0, C.denim, 'smile')),
    rot(72, 40, 0, 1, rect(-1.4, -2, 2.8, 10, WOOD, 1, C.ink, 0.8), rect(-3, -6, 6, 5, FALU, 1, C.ink, 0.8)), at(100, 18, 1, circle(0, 0, 9, C.white, C.ink, 1.2), path('M-4 -6 A7 7 0 1 1 -6 3', 'none', HL, 1.8), path('M-8 2 L-6 4 L-4 1', 'none', HL, 1.8))),
  'byhi.röta': all(room('#eef0e6'), rect(8, 46, 104, 30, LOG, 3, C.ink, 1.6), line('M14 54 L60 54 M14 66 L50 66', LOG2, 0.8), path('M60 46 C66 52 64 60 72 62 C80 66 76 74 84 76 L112 76 L112 46 Z', '#4a3424', C.ink, 1.2),
    ...[[76, 48], [94, 52], [102, 70]].map(([x, y]) => all(path(`M${x! - 5} ${y} C${x! - 5} ${y! - 6} ${x! + 5} ${y! - 6} ${x! + 5} ${y} Z`, '#c9a060', C.ink, 0.9), rect(x! - 1.2, y!, 2.4, 3, '#efe6d2', 0.5, null))), rot(88, 66, 20, 1, rect(-2, -24, 4, 16, C.silver, 1, C.ink, 1), rect(-3, -38, 6, 14, '#3d3f4a', 1, C.ink, 1)), ring(90, 62, 22)),
  'byhi.fuktskada': all(room(), rect(4, 96, 112, 16, '#c9a06a', 0, null), path('M30 96 C24 80 34 66 30 50 C44 56 56 48 62 58 C72 52 80 64 78 76 C86 84 80 92 84 96 Z', '#c9b48a', '#a08860', 1.4),
    ...[[40, 70], [56, 66], [64, 82], [46, 86]].map(([x, y]) => circle(x!, y!, 2.4, '#4a5a3a', null)), drop(48, 30), drop(60, 38), drop(70, 26), line('M40 20 L74 20', '#5aa0d0', 3), ring(56, 74, 30)),
  'byhi.linoljefärg': all(room('#eef3f6'), win(56, 16, 52, 64, '#f0ead8'), rect(56, 16, 52, 6, C.white, 0, C.ink, 1), at(30, 104, 1, path('M-14 -26 L14 -26 L12 0 L-12 0 Z', C.silver, C.ink, 1.3), ellipse(0, -26, 14, 3, '#f0ead8', C.ink, 1), path('M-6 -16 C-6 -10 6 -10 6 -16 C6 -20 0 -24 0 -24 C0 -24 -6 -20 -6 -16 Z', '#e0b23c', C.ink, 0.8)),
    at(18, 50, 1, line('M0 20 L0 0', GRASS2, 1.4), circle(0, -2, 4, '#7a9ad8', C.ink, 0.8), circle(0, -2, 1.4, C.yellow, null), line('M0 10 l4 -4', GRASS2, 1.2)), rot(54, 50, 30, 1, rect(-2, -4, 4, 20, WOOD, 1, C.ink, 1), rect(-3.4, -12, 6.8, 9, '#3d3f4a', 1, C.ink, 1), rect(-3.4, -15, 6.8, 4, '#f0ead8', 1, null))),
  'byhi.kalkputs': all(sky(), ...Array.from({ length: 8 }, (_, r) => all(...Array.from({ length: 6 }, (_, c) => rect(8 + c * 18 + (r % 2) * 9, 12 + r * 12, 17, 11, BRICK, 0.5, C.ink, 0.8)))), rect(8, 12, 56, 100, '#f6f3ec', 0, C.ink, 1.2),
    rot(76, 60, -10, 1, path('M-12 0 L12 0 L8 6 L-8 6 Z', C.silver, C.ink, 1.2), rect(-2, -14, 4, 14, WOOD, 1, C.ink, 1)), path('M64 54 C68 56 70 64 64 66', '#f6f3ec', C.ink, 1), ring(36, 60, 26)),
  'byhi.fönsterbåge': all(room('#efe6d8'), rect(14, 14, 70, 90, '#fbf8ee', 1, C.ink, 1.6), rect(20, 20, 58, 78, GLASS, 0, null), rect(18, 18, 30, 82, 'none', 1, HL, 4), rect(50, 18, 30, 82, 'none', 1, HL, 4), line('M33 20 L33 98 M20 59 L48 59 M65 20 L65 98 M50 59 L78 59', C.white, 2.4),
    ellipse(100, 100, 10, 3, C.grey2, null), circle(49, 59, 1.6, GOLD, C.ink, 0.6)),
  'byhi.spröjs': all(room('#efe6d8'), rect(22, 12, 76, 96, C.white, 1, C.ink, 1.6), rect(28, 18, 64, 84, GLASS, 0, null), line('M49 18 L49 102 M71 18 L71 102 M28 46 L92 46 M28 74 L92 74', '#f0a070', 4), line('M49 18 L49 102 M71 18 L71 102 M28 46 L92 46 M28 74 L92 74', C.ink, 0.6), ring(60, 60, 20)),
  'byhi.kitt': all(room('#efe6d8'), rect(10, 10, 100, 100, '#fbf8ee', 1, C.ink, 1.6), rect(24, 24, 72, 72, GLASS, 0, C.ink, 1), path('M24 24 L96 24 L96 96 L24 96 Z', 'none', '#e6dcc0', 4),
    path('M24 96 L24 24 L96 24', 'none', '#d8cca8', 5), rot(84, 100, -40, 1, rect(-4, -2, 8, 22, WOOD, 1, C.ink, 1), path('M-6 -2 L6 -2 L4 -12 L-4 -12 Z', C.silver, C.ink, 1)), ring(30, 60, 14)),
  'byhi.takpanna': all(sky(), ...Array.from({ length: 5 }, (_, r) => all(...Array.from({ length: 6 }, (_, c) => path(`M${8 + c * 18} ${16 + r * 16} q9 -5 18 0 l0 14 q-9 -5 -18 0 Z`, TILE, C.ink, 1)))), path('M62 96 q9 -5 18 0 l0 14 q-9 -5 -18 0 Z', '#d8704a', HL, 2.4), ring(71, 98, 14)),

  // ── 2347 Arkitektoniska epoker ──
  'byhi.arkitekt': all(room(), rot(70, 70, -8, 1, rect(-30, -4, 60, 40, '#fbf8ee', 1, C.ink, 1.4), house(-18, 30, 14, 'none', 'none', 10, 26), line('M-22 30 L22 30', '#3f6fb5', 1)), line('M46 106 L56 80 M94 106 L84 80', WOOD, 3),
    fig(22, C.navy, 'calm', { h: 0.9 }), reach(22, 0.9, 1, 56, 70), rot(56, 70, 30, 1, rect(-1, -8, 2, 10, C.yellow, 0.5, C.ink, 0.6)), ground),
  'byhi.ornament': all(sky(), rect(8, 8, 104, 104, STONE, 0, C.ink, 1.4), rect(20, 30, 80, 60, '#e8e2d4', 2, C.ink, 1.4), path('M60 40 C50 40 40 46 40 56 C40 66 50 70 56 64 C60 60 56 54 52 56 M60 40 C70 40 80 46 80 56 C80 66 70 70 64 64 C60 60 64 54 68 56', 'none', C.ink, 2),
    path('M60 40 L60 80 M60 80 C52 76 44 80 40 84 M60 80 C68 76 76 80 80 84', 'none', C.ink, 1.6), ...[[30, 40], [90, 40], [30, 80], [90, 80]].map(([x, y]) => all(circle(x!, y!, 4, 'none', C.ink, 1.4), circle(x!, y!, 1.4, C.ink, null))), ring(60, 60, 36)),
  'byhi.romansk': all(sky(), grass(108), rect(40, 48, 70, 60, STONE, 0, C.ink, 1.6), path('M38 48 L44 38 L106 38 L112 48 Z', ROOF, C.ink, 1.3), rect(8, 30, 34, 78, STONE, 0, C.ink, 1.6), path('M6 30 L25 16 L44 30 Z', ROOF, C.ink, 1.3),
    ...[56, 76, 96].map((x) => archWin(x, 80, 7, 16, false)), archWin(25, 56, 8, 12, false, C.dark), archWin(25, 108, 14, 24, false, '#6e4426'), path('M95 108 C95 94 110 92 110 92', 'none', 'none'), ring(76, 74, 26), ground),
  'byhi.rundbåge': all(sky(), rect(8, 8, 104, 104, STONE, 0, C.ink, 1.4), path(archPath(44, 100, 40, 80, false), GLASS, HL, 3.4), greyed(path(archPath(94, 100, 20, 50, true), GLASS, C.ink, 1.4)), cross(94, 34, 0.6)),
  'byhi.gotisk': all(sky(), rect(26, 40, 68, 72, STONE, 0, C.ink, 1.4), ...[[16, 22], [82, 22]].map(([x, w]) => all(rect(x!, 30, w!, 82, STONE, 0, C.ink, 1.4), path(`M${x! - 1} 30 L${x! + w! / 2} 4 L${x! + w! + 1} 30 Z`, STONE2, C.ink, 1.2), archWin(x! + w! / 2, 70, 8, 24, true))),
    archWin(60, 84, 16, 40, true), archWin(60, 112, 14, 22, true, '#6e4426'), path('M44 40 L60 22 L76 40 Z', STONE2, C.ink, 1.2), ground),
  'byhi.spetsbåge': all(sky(), rect(8, 8, 104, 104, STONE, 0, C.ink, 1.4), path(archPath(44, 100, 40, 84, true), GLASS, HL, 3.4), greyed(path(archPath(94, 100, 20, 46, false), GLASS, C.ink, 1.4)), cross(94, 34, 0.6)),
  'byhi.kolonn.2': all(sky(), rect(30, 100, 60, 8, STONE, 0.5, C.ink, 1.4), rect(36, 94, 48, 6, STONE, 0.5, C.ink, 1.2), rect(42, 26, 36, 68, '#f4f0e6', 0, C.ink, 1.6), ...[48, 54, 60, 66, 72].map((x) => line(`M${x} 28 L${x} 92`, '#d8d0c0', 1.2)),
    path('M34 26 L86 26 L82 18 L38 18 Z', '#f4f0e6', C.ink, 1.4), circle(38, 20, 5, '#f4f0e6', C.ink, 1.2), circle(82, 20, 5, '#f4f0e6', C.ink, 1.2), rect(30, 10, 60, 8, STONE, 0.5, C.ink, 1.4), ring(60, 58, 40), ground),
  'byhi.barock': all(sky(), palace(60, 108, 1.15, '#f0d6a0', true), sparkle(20, 24, 4, GOLD), sparkle(100, 24, 4, GOLD), ground),
  'byhi.rokoko': all(room('#f6e6ee'), path('M30 22 C30 10 50 6 60 14 C70 6 90 10 90 22 C100 30 98 46 92 52 L92 86 C98 94 92 106 80 104 L40 104 C28 106 22 94 28 86 L28 52 C22 46 20 30 30 22 Z', GOLD, C.ink, 1.6),
    path('M38 30 C40 22 54 22 60 26 C66 22 80 22 82 30 L82 92 L38 92 Z', '#cfe6f2', C.ink, 1.2), path('M60 14 C56 6 64 2 66 8 M30 22 C22 18 22 10 28 10 M90 22 C98 18 98 10 92 10', 'none', C.ink, 1.4), path('M46 40 C52 46 60 40 58 34', 'none', C.white, 1.6), ...[[20, 70], [100, 70]].map(([x, y]) => circle(x!, y!, 4, '#ef9fb5', C.ink, 1)), sparkle(70, 60, 3, C.white)),
  'byhi.nyklassicism': all(sky(), grass(108), path('M14 44 L60 18 L106 44 Z', '#f4f0e6', C.ink, 1.6), path('M24 41 L60 22 L96 41 Z', 'none', C.ink, 0.8), rect(12, 44, 96, 8, '#f4f0e6', 0, C.ink, 1.4), ...[22, 38, 54, 70, 86, 98].map((x) => all(rect(x - 3, 52, 8, 48, '#fbf8f0', 0, C.ink, 1.2), line(`M${x + 1} 54 L${x + 1} 98`, '#d8d0c0', 1))),
    rect(10, 100, 100, 8, STONE, 0, C.ink, 1.4), rect(52, 72, 16, 28, '#6e4426', 0.5, C.ink, 1), ground),
  'byhi.gustaviansk': all(room('#eef0ec'), rect(4, 100, 112, 12, '#d8d0c0', 0, null), rect(38, 22, 44, 40, '#d8dce0', 8, C.ink, 1.6), rect(44, 28, 32, 28, '#eef3f6', 6, C.ink, 1), ...[39, 81].map((x) => line(`M${x} 22 L${x} 70`, C.ink, 0)),
    rect(34, 62, 52, 10, '#d8dce0', 3, C.ink, 1.6), rect(40, 64, 40, 5, '#cfe0ea', 2, null), ...[38, 80].map((x) => all(path(`M${x} 72 L${x + 2} 104 L${x + 5} 104 L${x + 4} 72 Z`, '#d8dce0', C.ink, 1.2), line(`M${x + 1} 78 L${x + 4} 78`, C.ink, 0.6))), circle(60, 26, 3, '#d8dce0', C.ink, 1)),
  'byhi.jugend': all(sky(), rect(8, 8, 104, 104, '#efe2c8', 0, C.ink, 1.4), path('M36 112 L36 54 C36 30 84 30 84 54 L84 112 Z', '#4f7f6a', C.ink, 1.6), path('M42 112 L42 58 C42 40 78 40 78 58 L78 112', 'none', '#e8d4a8', 1.6),
    path('M30 112 C24 90 34 74 26 56 C22 40 34 30 44 30 M90 112 C96 90 86 74 94 56 C98 40 86 30 76 30', 'none', '#6a9a5a', 2.4), ...[[26, 56], [94, 56], [44, 30], [76, 30], [30, 84], [90, 84]].map(([x, y]) => all(ellipse(x!, y!, 5, 3, '#8ab870', C.ink, 0.8))),
    path('M60 20 C54 12 56 6 60 8 C64 6 66 12 60 20 Z', '#e88aa0', C.ink, 1), path('M60 20 C50 16 48 22 54 24 Z M60 20 C70 16 72 22 66 24 Z', '#e88aa0', C.ink, 0.8), path('M46 70 C54 62 66 62 74 70', 'none', '#e8d4a8', 1.4)),
  'byhi.funktionalism': all(sky(), grass(106), rect(16, 40, 88, 66, C.white, 0, C.ink, 1.6), rect(14, 36, 92, 6, '#e8e8e8', 0, C.ink, 1.4), rect(22, 50, 76, 14, GLASS, 0, C.ink, 1.2), line('M41 50 L41 64 M60 50 L60 64 M79 50 L79 64', C.ink, 0.8),
    rect(22, 76, 40, 14, GLASS, 0, C.ink, 1.2), rect(70, 72, 34, 4, '#e8e8e8', 0, C.ink, 1.2), line('M72 76 L72 88 M102 76 L102 88 M72 88 L102 88', C.ink, 1.2), door(80, 106, 10, 16, '#3f6fb5'), ground),
  'byhi.stilepok': all(sky(), arrow(8, 104, 112, 104, HL, 3), ...[[18, false], [46, true]].map(([x, p]) => at(x as number, 96, 0.5, rect(-14, -40, 28, 40, STONE, 0, C.ink, 2), archWin(0, 0, 12, 24, p as boolean, '#6e4426'), path('M-16 -40 L0 -56 L16 -40 Z', STONE2, C.ink, 2))),
    at(76, 96, 0.5, path('M-18 -36 L0 -50 L18 -36 Z', '#f4f0e6', C.ink, 2), ...[-12, -4, 4, 12].map((c) => rect(c - 2, -36, 4, 36, '#fbf8f0', 0, C.ink, 1.6))), at(102, 96, 0.5, rect(-16, -36, 32, 36, C.white, 0, C.ink, 2), rect(-12, -28, 24, 8, GLASS, 0, C.ink, 1.6)),
    ...[18, 46, 76, 102].map((x) => line(`M${x} 100 L${x} 108`, C.ink, 1.4))),
};
