/**
 * Kultur & fritid → Spel & hobbyer → Datorspel, 4721–4727 (0.65): game genres, game controllers, game worlds and
 * quests, role-playing systems, multiplayer modes, game strategies and game communities.
 * Games are shown on a generic TV (`tv`) with a small orange hero (`hero`) and a purple monster: no brands, no
 * recognisable titles or characters, no letters that give away the word (digits, "+", "!" and "?" are fine).
 * The named part is orange (HL); grey is the reference.
 * Easily confused pairs get different kinds of picture: every genre has its own typical screen (a number puzzle for
 * pusselspel, ledges for plattformsspel, a crosshair for skjutspel …); the same map with the wide road to the
 * castle marked (huvuduppdrag) or the thin path to a hut marked (sidouppdrag, round 2); a disk that takes the game in (spara.3)
 * against a glowing place in the world (sparpunkt) and a potion that goes into the bag (spara.2); one sofa and
 * one TV cut in two (delad skärm) against players in four corners (flerspelarläge) and two heroes who pull each
 * other up (samarbetsläge); signal waves to many devices (streama.2) against a face with a headset (streamare)
 * and the backs of heads in front of a screen (tittare).
 * Movement: `moving()`/`waIn()`/`waPulse()`/`waSpin()` with transform and opacity only; the base state is the
 * poster frame.
 */
import { C, all, arrow, circle, ellipse, g, heart, line, moving, path, rect, sparkle, star, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, mini } from './people';

const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (deg: number, cx: number, cy: number, ...k: Svg[]) => g(`rotate(${deg} ${cx} ${cy})`, ...k);
const faded = (o: number, ...k: Svg[]) => `<g opacity="${o}">${k.join('')}</g>`;
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const NIGHT = '#27324d', SKYB = '#bfe3f5', GRASS = '#9fd08a', GRASS2 = '#5fa35a', STONE = '#b9b2a6', EARTH = '#8a6a45', BRONZE = '#c98b5a';
const ground = line('M4 112 L116 112', C.grey2, 2);
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, C.green, C.ink, 1.4), line('M-4 0 L-1 3.5 L4.5 -3.5', C.white, 2.4));

/** A generic TV: the game picture is drawn in x 11–109, y 15–85. */
const tv = (bg: string, ...inner: Svg[]) => all(rect(6, 10, 108, 80, C.dark, 7, C.ink, 2), rect(11, 15, 98, 70, bg, 3, null), ...inner,
  rect(6, 10, 108, 80, 'none', 7, C.ink, 2), path('M50 90 L70 90 L74 102 L46 102 Z', C.dark, C.ink, 1.8), line('M34 103 L86 103', C.ink, 3));
const gnd = (y = 74, col: string = GRASS) => rect(11, y, 98, 85 - y, col, 0, null);
/** A small screen anywhere (x, y = top left). */
const screen = (x: number, y: number, w: number, h: number, bg: string, ...inner: Svg[]) => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, bg, 1.5, null), ...inner);

type Hero = { col?: string; arms?: 'down' | 'up' | 'fwd' | 'swing'; face?: 'smile' | 'o' | 'sad' | 'flat'; hat?: boolean; grey?: boolean; flip?: boolean; beard?: boolean };
/** The game character: feet at (x, y), about 36 high at scale 1. */
function hero(x: number, y: number, s = 1, o: Hero = {}): Svg {
  const col = o.grey ? C.grey : (o.col ?? HL), skin = o.grey ? C.grey2 : C.skin, hair = o.grey ? C.grey : C.hair;
  const arms = o.arms === 'up' ? 'M-6 -17 L-12 -28 M6 -17 L12 -28' : o.arms === 'fwd' ? 'M-5 -16 L4 -15 M6 -17 L15 -19' : o.arms === 'swing' ? 'M-6 -17 L-12 -11 M6 -17 L14 -29' : 'M-6 -17 L-10 -9 M6 -17 L10 -9';
  const mouth = o.face === 'o' ? circle(0, -24, 1.5, C.ink, null) : line(o.face === 'sad' ? 'M-2.5 -23.5 Q0 -25.5 2.5 -23.5' : o.face === 'flat' ? 'M-2.5 -24 L2.5 -24' : 'M-2.5 -24.6 Q0 -22.6 2.5 -24.6', C.ink, 1);
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`,
    line('M-3 -8 L-3 -1 M3 -8 L3 -1', C.ink, 4.6), line('M-3 -8 L-3 -1 M3 -8 L3 -1', o.grey ? C.grey : C.navy, 2.8),
    line(arms, C.ink, 4.4), line(arms, col, 2.6), rect(-6.5, -21, 13, 14, col, 4, C.ink, 1.4),
    circle(0, -28, 7.5, skin, C.ink, 1.4), path('M-7.5 -29 C-7.5 -38 7.5 -38 7.5 -29 C3 -33 -3 -33 -7.5 -29 Z', hair, null),
    o.beard ? path('M-5.5 -25 C-5 -17 5 -17 5.5 -25 C3 -22 -3 -22 -5.5 -25 Z', C.white, C.ink, 1) : '',
    o.hat ? path('M-9 -33 L0 -50 L9 -33 Z', col, C.ink, 1.4) : '',
    circle(-2.6, -28, 1, C.ink, null), circle(2.6, -28, 1, C.ink, null), o.beard ? '' : mouth);
}
type Mon = { dead?: boolean; crown?: boolean };
/** The enemy: feet at (x, y), about 30 high at scale 1. */
const monster = (x: number, y: number, s = 1, col: string = C.purple, o: Mon = {}) => at(x, y, s,
  path('M-13 0 C-16 -14 -10 -26 0 -26 C10 -26 16 -14 13 0 C9 -3 5 3 0 0 C-5 3 -9 -3 -13 0 Z', col, C.ink, 1.6),
  path('M-9 -23 L-12 -32 L-4 -26 Z M9 -23 L12 -32 L4 -26 Z', C.white, C.ink, 1.2),
  o.crown ? path('M-7 -27 L-7 -35 L-3 -31 L0 -37 L3 -31 L7 -35 L7 -27 Z', C.gold, C.ink, 1.2) : '',
  o.dead ? line('M-7 -18 L-3 -14 M-3 -18 L-7 -14 M3 -18 L7 -14 M7 -18 L3 -14', C.ink, 1.4) : all(circle(-5, -16, 3, C.white, C.ink, 1), circle(5, -16, 3, C.white, C.ink, 1), circle(-4.4, -15.6, 1.2, C.ink, null), circle(5.6, -15.6, 1.2, C.ink, null), line('M-8 -21 L-3 -19 M8 -21 L3 -19', C.ink, 1.4)),
  path('M-6 -8 L-3 -6 L0 -8 L3 -6 L6 -8', 'none', C.ink, 1.4));
const sword = (x: number, y: number, deg = 0, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, path('M-1.8 -22 L0 -27 L1.8 -22 L1.8 -4 L-1.8 -4 Z', C.silver, C.ink, 1), rect(-5, -4.6, 10, 2.6, C.gold, 1, C.ink, 1), rect(-1.5, -2, 3, 7, C.brown, 1, C.ink, 1));
const shieldS = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, path('M0 -9 L8 -6 C8 2 5 7 0 10 C-5 7 -8 2 -8 -6 Z', col, C.ink, 1.3), line('M0 -6 L0 6 M-5 -2 L5 -2', C.white, 1.4));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, C.gold, C.ink, 1.1), line(`M${x} ${y - r * 0.5} L${x} ${y + r * 0.5}`, '#a8801f', 1.2));
const keyI = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, circle(-5, 0, 4, col, C.ink, 1.2), circle(-5, 0, 1.4, C.white, C.ink, 0.8), path('M-1 -1.2 L9 -1.2 L9 3.4 L7 3.4 L7 1.2 L5 1.2 L5 3.4 L3 3.4 L3 1.2 L-1 1.2 Z', col, C.ink, 1));
const castle = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, path('M-16 0 L-16 -18 L-12 -18 L-12 -22 L-8 -22 L-8 -18 L-4 -18 L-4 -28 L-2 -28 L-2 -32 L2 -32 L2 -28 L4 -28 L4 -18 L8 -18 L8 -22 L12 -22 L12 -18 L16 -18 L16 0 Z', col, C.ink, 1.4), path('M-3 0 L-3 -8 C-3 -12 3 -12 3 -8 L3 0 Z', C.dark, null));
const tree = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0.5, C.ink, 0.8), path('M0 -22 L8 -5 L-8 -5 Z', col, C.ink, 1.2));
const hill = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, path('M-16 0 L-4 -20 L2 -12 L7 -18 L18 0 Z', col, C.ink, 1.3), path('M-7 -15 L-4 -20 L-1 -15 L-4 -13 Z', C.white, null));
const hut = (x: number, y: number, s = 1, col: string = C.beige, roof: string = C.red) => at(x, y, s, rect(-8, -10, 16, 10, col, 1, C.ink, 1.2), path('M-11 -10 L0 -19 L11 -10 Z', roof, C.ink, 1.2), rect(-2, -6, 4, 6, C.brown, 0.5, null));
/** Game controller seen from above, about 54 wide at scale 1. */
function pad(x: number, y: number, s = 1, hl?: 'stick' | 'cross' | 'shoulder' | 'body', body: string = C.white): Svg {
  const hi = (k: string, base: string) => (hl === k ? HL : base);
  return at(x, y, s,
    rect(-20, -17, 13, 7, hi('shoulder', C.grey), 3, C.ink, 1.4), rect(7, -17, 13, 7, hi('shoulder', C.grey), 3, C.ink, 1.4),
    path('M-18 -13 L18 -13 C24 -13 26 -8 27 -2 L29 10 C30 17 22 19 18 13 L14 6 L-14 6 L-18 13 C-22 19 -30 17 -29 10 L-27 -2 C-26 -8 -24 -13 -18 -13 Z', hi('body', body), C.ink, 1.6),
    path('M-18 -8 L-14 -8 L-14 -5 L-11 -5 L-11 -1 L-14 -1 L-14 2 L-18 2 L-18 -1 L-21 -1 L-21 -5 L-18 -5 Z', hi('cross', C.dark), C.ink, 1),
    circle(16, -7, 2, C.red, C.ink, 0.8), circle(20, -3, 2, C.yellow, C.ink, 0.8), circle(12, -3, 2, C.sky, C.ink, 0.8), circle(16, 1, 2, C.green, C.ink, 0.8),
    circle(-6, 2, 4, C.grey2, C.ink, 1), circle(-6, 2, 2.4, hi('stick', C.dark), null), circle(6, 2, 4, C.grey2, C.ink, 1), circle(6, 2, 2.4, hi('stick', C.dark), null));
}
/** Headset on a `mini` head drawn with at(x, y, s, mini(0, 0, …)). */
const headset = (x: number, y: number, s: number) => at(x, y, s, path('M-7.4 -2 C-7.4 -12.5 7.4 -12.5 7.4 -2', 'none', C.ink, 2), rect(-9.4, -4, 3.6, 6, C.dark, 1.5, C.ink, 0.8), rect(5.8, -4, 3.6, 6, C.dark, 1.5, C.ink, 0.8), line('M-7.6 1 C-7.6 5 -4 5.6 -1.6 4.6', C.ink, 1), circle(-1.2, 4.6, 1.3, C.dark, null));
/** Head and shoulders with a face (people.ts `mini` has none). */
const bust = (x: number, y: number, s: number, col: string, long = false) => at(x, y, s, mini(0, 0, col, long), circle(-2.3, -2.4, 0.75, C.ink, null), circle(2.3, -2.4, 0.75, C.ink, null), line('M-2 0.8 Q0 2.4 2 0.8', C.ink, 0.7));
const disk = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, path('M-10 -10 L7 -10 L10 -7 L10 10 L-10 10 Z', col, C.ink, 1.4), rect(-5, -10, 9, 6, C.silver, 0.5, C.ink, 0.9), rect(1, -9, 2, 4, C.dark, 0, null), rect(-6, 0, 12, 8, C.white, 1, C.ink, 0.9));
const potion = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-3 -14 L3 -14 L3 -7 C9 -4 11 3 8 8 C5 13 -5 13 -8 8 C-11 3 -9 -4 -3 -7 Z', '#eef7fb', C.ink, 1.4), path('M-8.6 1 C-5 -2 5 -2 8.6 1 C10 6 6 11 0 11 C-6 11 -10 6 -8.6 1 Z', col, null), rect(-3.6, -18, 7.2, 5, C.brown, 1, C.ink, 1), circle(-3, 4, 1.4, C.white, null));
const chest = (x: number, y: number, s = 1, open = true) => at(x, y, s,
  open ? path('M-14 -12 L-12 -24 L12 -24 L14 -12 Z', C.brown, C.ink, 1.4) : path('M-14 -12 C-14 -22 14 -22 14 -12 Z', C.brown, C.ink, 1.4),
  open ? all(path('M-12 -12 C-8 -18 8 -18 12 -12 Z', C.gold, C.ink, 1), circle(-5, -15, 2.4, C.yellow, C.ink, 0.8), circle(4, -16, 2.6, C.yellow, C.ink, 0.8), path('M-1 -19 L2 -16 L-1 -13 L-4 -16 Z', C.sky, C.ink, 0.8)) : '',
  rect(-14, -12, 28, 12, C.brown, 1.5, C.ink, 1.4), line('M-14 -6 L14 -6', C.gold, 1.6), rect(-2.4, -9, 4.8, 6, C.gold, 1, C.ink, 0.9));
const car = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, rect(-8, -14, 16, 8, col, 3, C.ink, 1.3), rect(-6, -12.6, 12, 4.4, SKYB, 1.5, C.ink, 0.8), rect(-12, -8, 24, 9, col, 3, C.ink, 1.4), rect(-13, -1, 5, 4, C.black, 1, null), rect(8, -1, 5, 4, C.black, 1, null), circle(-8, -4, 1.4, C.yellow, null), circle(8, -4, 1.4, C.yellow, null));
const bulls = (x: number, y: number, r: number) => all(line(`M${x} ${y} L${x} ${y + r + 12}`, C.brown, 2.4), circle(x, y, r, C.white, C.ink, 1.3), circle(x, y, r * 0.62, C.red, null), circle(x, y, r * 0.28, C.white, null));
const cloudS = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 4 C-15 4 -15 -3 -9 -3 C-8 -9 0 -10 2 -5 C6 -9 12 -6 10 -1 C15 -1 15 4 10 4 Z', C.white, null));
const thumbDown = (x: number, y: number) => all(rect(x - 30, -8, 60, 34, C.skin, 12, C.ink, 1.8), line(`M${x - 16} 26 L${x - 16} 16 M${x + 16} 26 L${x + 16} 16`, C.skin2, 1.6), rect(x - 8, 20, 16, 8, C.skin, 0, null), path(`M${x - 11} 24 L${x - 11} ${y - 9} C${x - 11} ${y + 4} ${x + 11} ${y + 4} ${x + 11} ${y - 9} L${x + 11} 24`, C.skin, C.ink, 1.8), path(`M${x - 7} ${y - 6} C${x - 7} ${y - 16} ${x + 7} ${y - 16} ${x + 7} ${y - 6}`, 'none', C.skin2, 1.6));
const phoneS = (x: number, y: number, s: number, ...inner: Svg[]) => at(x, y, s, rect(-8, -14, 16, 28, C.dark, 3, C.ink, 1.4), rect(-6, -11, 12, 21, SKYB, 1, null), ...inner);
const back = (x: number, y: number, hair: string, top: string) => all(path(`M${x - 15} ${y + 24} C${x - 15} ${y + 8} ${x + 15} ${y + 8} ${x + 15} ${y + 24} Z`, top, C.ink, 1.6), circle(x, y, 11, hair, C.ink, 1.6));
const playT = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M-5 -7 L7 0 L-5 7 Z', col, C.ink, 1.2));
const tinyGame = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, 2, 14, 3, GRASS2, 0, null), hero(0, 2, 0.28), star(4, -6, 2.4));

/** One map for the main quest (wide road to the castle) and the side quest (thin path to a hut): the named one is orange. */
const questMap = (main: boolean) => all(rect(6, 6, 108, 108, GRASS, 12, C.ink, 2), line('M56 112 C40 88 76 70 58 42', C.white, 14), line('M56 112 C40 88 76 70 58 42', main ? HL : C.grey2, 9),
  line('M62 76 C76 80 84 86 92 92', C.white, main ? 6 : 10), line('M62 76 C76 80 84 86 92 92', main ? C.grey2 : HL, main ? 3.4 : 6), line('M50 92 C38 90 28 86 20 80', C.grey2, 3.4), hut(16, 80, 0.7, C.grey2, C.grey), tree(100, 40, 0.8), tree(20, 40, 0.8),
  main ? all(castle(58, 42, 1.15), star(58, 14, 7), hut(96, 96, 0.9, C.grey2, C.grey), hero(52, 106, 0.75)) : all(castle(58, 42, 1.15, C.grey2), hut(96, 98, 1.1), star(96, 70, 6), hero(54, 86, 0.75)));

export const VGAME_MOTIFS: Record<string, string> = {
  // ── 4721 Spelgenrer ──
  'vgame.spelgenre': all(
    ...[0, 1, 2].map((i) => { const x = 10 + i * 35, col = [HL, C.green, C.denim][i]!; return all(rect(x + 8, 22, 22, 30, col, 2, C.ink, 1.6), rect(x + 4, 27, 22, 30, col, 2, C.ink, 1.6), rect(x, 32, 22, 30, col, 2, C.ink, 1.6), rect(x + 3, 36, 16, 22, C.white, 1, C.ink, 1), line(`M${x - 3} 68 L${x + 31} 68`, C.ink, 2.6), circle(x + 14, 84, 9, col, C.ink, 1.6)); }),
    sword(21, 56, 0, 0.62), path('M40 42 L46 42 C45 39 51 39 50 42 L56 42 L56 54 L40 54 Z', C.green, C.ink, 1), car(91, 52, 0.55, C.denim),
    sword(24, 91, 0, 0.5), path('M54 80 L57 80 C56.5 78 60.5 78 60 80 L64 80 L64 89 L54 89 Z', C.white, C.ink, 0.9), car(94, 87, 0.42, C.white),
    line('M24 93 L24 104 M59 93 L59 104 M94 93 L94 104 M24 104 L94 104', C.grey, 1.6)),
  'vgame.actionspel': tv(SKYB, gnd(), rect(15, 19, 40, 9, NIGHT, 4, C.ink, 1.2), heart(21, 23.5, 2.6), rect(26, 21.5, 26, 4, '#0d1326', 2, null), rect(26, 21.5, 17, 4, C.green, 2, null), line('M40 46 L50 46 M38 54 L48 54 M72 44 L82 44', C.white, 2.4),
    star(80, 58, 11, C.yellow), star(80, 58, 5, HL), star(34, 60, 8, C.yellow), rot(80, 26, 70, monster(26, 76, 0.6, C.purple, { dead: true })), monster(94, 76, 0.8), monster(106, 74, 0.5, '#7fa6d6'), rot(10, 60, 70, hero(60, 78, 1.05, { arms: 'fwd' })), sword(76, 60, 70, 0.8), sparkle(98, 34, 4, C.white), sparkle(66, 30, 3, C.white)),
  'vgame.äventyrsspel': tv(SKYB, cloudS(92, 26, 0.6), gnd(70), path('M70 70 C76 56 96 56 104 70 Z', GRASS2, null), castle(88, 60, 0.5), line('M88 60 C84 66 92 70 80 74 C70 78 76 80 64 82', '#e2d5b0', 3.4), hero(28, 80, 1), hero(52, 80, 1, { col: C.green, beard: true, flip: true }),
    path('M26 18 L62 18 L62 40 L50 40 L48 46 L44 40 L26 40 Z', C.white, C.ink, 1.5), rect(32, 21, 24, 16, C.beige, 1, C.ink, 1), line('M35 33 C39 27 43 34 47 28 L50 26', C.red, 1.1, '2 1.5'), castle(52, 27, 0.16), circle(35, 33, 1.3, C.red, null)),
  'vgame.rollspel.2': tv(NIGHT, rect(15, 20, 36, 60, '#18203a', 3, C.white, 1.2), circle(25, 31, 6, C.skin, C.white, 1), path('M19 30 C19 23 31 23 31 30 C28 27 22 27 19 30 Z', C.hair, null), rect(34, 26, 13, 3, C.white, 1.5, null), rect(34, 32, 9, 3, C.grey, 1.5, null),
    heart(22, 46, 2.6), rect(28, 43, 19, 5, '#0d1326', 2, null), rect(28, 43, 14, 5, C.green, 2, null), star(22, 57, 3.2, C.sky), rect(28, 54, 19, 5, '#0d1326', 2, null), rect(28, 54, 9, 5, C.sky, 2, null), star(23, 70, 4.4), num(37, 74, '12', 10, C.white),
    hero(70, 78, 1.1), sword(84, 62, 14, 0.9), shieldS(60, 62, 0.95), hero(96, 78, 0.9, { col: C.purple, hat: true }), sparkle(102, 34, 3.4), sparkle(62, 26, 2.6, C.white)),
  'vgame.pusselspel': tv('#2d2a4a', rect(34, 20, 52, 60, '#1c1a33', 3, C.white, 1.2),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const cx = 37 + (i % 3) * 16, cy = 23 + Math.floor(i / 3) * 18; return all(rect(cx, cy, 14, 16, [C.sky, C.mint, C.yellow, C.pink, C.lilac, C.orange, C.sky][i]!, 2, C.ink, 1.1), num(cx + 7, cy + 12, String(i + 1), 10)); }),
    rect(53, 59, 14, 16, 'none', 2, C.grey, 1, ), rect(72, 59, 14, 16, HL, 2, C.ink, 1.1), num(79, 71, '8', 10), arrow(72, 86, 60, 86, HL, 2.4), line('M90 67 L98 67', C.white, 1.6), sparkle(22, 30, 3, C.white), sparkle(100, 40, 3, C.white)),
  'vgame.plattformsspel': tv(SKYB, cloudS(30, 28, 0.9), cloudS(90, 22, 0.7), ...[[13, 68, 26], [48, 56, 22], [82, 42, 25]].map(([x, y, w]) => all(rect(x!, y!, w!, 8, EARTH, 1.5, C.ink, 1.3), rect(x!, y!, w!, 3, GRASS2, 1.5, null))), rect(11, 81, 98, 4, '#6fb1d8', 0, null),
    coin(59, 44), coin(90, 30), coin(98, 30), hero(24, 68, 0.8, { grey: true }), line('M30 56 Q42 32 56 48', HL, 2, '3 3'), hero(46, 50, 0.9, { arms: 'up' }), line('M70 50 Q78 30 88 38', C.grey, 1.6, '3 3')),
  'vgame.skjutspel': tv(SKYB, gnd(64, '#d8c595'), bulls(30, 46, 9), bulls(88, 50, 8), bulls(60, 40, 10), circle(60, 40, 14, 'none', HL, 2.4), line('M60 20 L60 30 M60 50 L60 60 M40 40 L50 40 M70 40 L80 40', HL, 2.4), path('M50 85 L54 68 L66 68 L70 85 Z', C.grey, C.ink, 1.6), rect(56.5, 60, 7, 10, C.dark, 1.5, C.ink, 1.2), line('M60 68 L60 80', C.grey2, 1.4)),
  'vgame.racingspel': tv(SKYB, rect(11, 46, 98, 39, GRASS, 0, null), path('M52 46 L68 46 L106 85 L14 85 Z', '#6b6f78', null), line('M60 48 L60 54 M60 60 L60 68 M60 74 L60 84', C.white, 2), rect(40, 38, 40, 6, C.white, 1, C.ink, 1), ...[0, 1, 2, 3, 4].map((i) => rect(40 + i * 8, 38, 4, 3, C.ink, 0, null) + rect(44 + i * 8, 41, 4, 3, C.ink, 0, null)), line('M40 44 L40 52 M80 44 L80 52', C.ink, 1.6),
    car(66, 58, 0.5, C.denim), car(54, 82, 1.15, C.red), path('M88 80 A12 12 0 0 1 106 72', 'none', C.white, 2.4), line('M96 82 L102 74', HL, 2)),
  'vgame.sportspel': tv(GRASS2, rect(15, 28, 90, 54, 'none', 1, C.white, 1.6), line('M60 28 L60 82', C.white, 1.6), circle(60, 55, 10, 'none', C.white, 1.6), rect(15, 43, 10, 24, 'none', 0, C.white, 1.4), rect(95, 43, 10, 24, 'none', 0, C.white, 1.4), rect(42, 16, 36, 11, C.dark, 2, C.white, 1), num(60, 25, '2–1', 9, C.white),
    ...[[36, 46, C.denim], [50, 68, C.denim], [78, 44, C.red], [86, 66, C.red]].map(([x, y, c]) => all(rect((x as number) - 3.5, (y as number) - 2, 7, 9, c as string, 2.5, C.ink, 1), circle(x as number, (y as number) - 5, 3.6, C.skin, C.ink, 1))), circle(64, 58, 3, C.white, C.ink, 1.1)),
  'vgame.skräckspel': tv('#15151f', path('M11 85 L40 62 L80 62 L109 85 Z', '#24243a', null), line('M40 62 L40 22 M80 62 L80 22', '#3a3a55', 1.6), rect(52, 30, 18, 32, '#0b0b12', 1, '#3a3a55', 1.4), `<path d="M30 80 L60 34 L92 56 Z" fill="#f6e58d" opacity=".3"/>`,
    path('M68 30 C68 16 90 16 90 30 L90 56 L86 52 L82 57 L79 52 L75 57 L72 52 L68 56 Z', C.white, C.ink, 1.4), ellipse(75, 32, 2.4, 3.4, C.ink, null), ellipse(83, 32, 2.4, 3.4, C.ink, null), ellipse(79, 41, 2.6, 3.6, C.ink, null),
    line('M11 15 L26 30 M11 24 L19 22 L20 15', '#5a5a78', 1), hero(26, 82, 0.9, { face: 'o' }), line('M16 50 l-2 4 M36 50 l2 4', C.sky, 1.6), rect(32, 66, 7, 3.6, C.yellow, 1, C.ink, 1)),
  'vgame.mobilspel': all(path('M28 116 L30 66 C31 58 40 58 41 66 L41 116 Z', C.skin, C.ink, 1.8), rect(38, 10, 46, 94, C.dark, 8, C.ink, 2), rect(42, 18, 38, 76, SKYB, 3, null), cloudS(54, 30, 0.5), rect(42, 78, 38, 16, GRASS, 0, null), rect(48, 58, 14, 5, EARTH, 1, C.ink, 1), coin(55, 50, 3), coin(72, 62, 3), hero(68, 78, 0.7, { arms: 'up' }), star(48, 26, 3), num(70, 30, '120', 7),
    path('M96 116 L94 86 C93 78 86 70 78 76 C74 79 76 84 80 86 L78 116 Z', C.skin, C.ink, 1.8), path('M80 79 C82 77 85 78 86 80', 'none', C.skin2, 1.4), ground),
  'vgame.indiespel': all(rect(70, 14, 40, 98, C.grey2, 2, C.grey, 1.6), ...[0, 1, 2, 3, 4, 5].flatMap((r) => [0, 1, 2].map((c) => rect(76 + c * 10, 20 + r * 13, 6, 8, C.white, 1, null))), ground,
    bust(22, 78, 1.5, HL), bust(60, 80, 1.5, C.green, true), rect(8, 96, 70, 6, C.brown, 2, C.ink, 1.6), line('M14 102 L14 112 M72 102 L72 112', C.brown, 3.4),
    screen(28, 70, 28, 22, SKYB, tinyGame(42, 82, 1.1)), path('M24 96 L26 92 L58 92 L60 96 Z', C.grey, C.ink, 1.2), sparkle(42, 58, 5), heart(16, 54, 3.4), heart(68, 56, 3.4)),
  'vgame.gamer': all(`<circle cx="60" cy="44" r="40" fill="#bfe3f5" opacity=".55"/>`, bust(60, 62, 2.7, HL), headset(60, 62, 2.7), pad(60, 100, 0.95), ellipse(40, 100, 7, 8, C.skin, C.ink, 1.4), ellipse(80, 100, 7, 8, C.skin, C.ink, 1.4), sparkle(14, 30, 4, C.white), sparkle(106, 26, 4, C.white), star(104, 60, 5), star(16, 66, 4)),

  // ── 4722 Spelkontroller ──
  'vgame.konsol': all(screen(26, 8, 68, 46, SKYB, tinyGame(60, 34, 1.6)), rect(54, 54, 12, 8, C.dark, 1, C.ink, 1.4), rect(8, 62, 104, 46, C.tan, 3, C.ink, 2), rect(14, 70, 92, 30, EARTH, 2, C.ink, 1.4),
    line('M80 84 C96 84 100 70 86 62 C80 58 74 60 70 54', C.ink, 1.6), rect(26, 80, 52, 16, C.white, 4, C.ink, 2), line('M32 88 L56 88', C.ink, 1.6), circle(68, 88, 2.4, C.green, C.ink, 0.9), rect(22, 76, 60, 24, 'none', 5, HL, 2.8), pad(94, 94, 0.36)),
  'vgame.spelkontroll': all(at(98, 100, 1, circle(0, 0, 11, 'none', C.grey, 4), line('M-11 0 L11 0 M0 0 L0 11', C.grey, 2.6)), at(20, 98, 1, rect(-10, 4, 20, 7, C.grey2, 2, C.grey, 1.4), line('M0 4 L3 -10', C.grey, 3), circle(3, -11, 4, C.grey2, C.grey, 1.4)), pad(60, 54, 1.75, 'body')),
  'vgame.knapp.2': all(rect(14, 78, 92, 30, C.grey2, 6, C.ink, 2), ellipse(60, 80, 30, 10, C.dark, C.ink, 1.8), path('M36 78 L36 70 C36 56 84 56 84 70 L84 78 C84 88 36 88 36 78 Z', C.red, C.ink, 2), ellipse(60, 69, 24, 8, '#e96a6a', null), line('M22 58 L14 52 M98 58 L106 52 M20 70 L10 70 M100 70 L110 70', HL, 2.6),
    moving('vg-knapp', '0%,100%{transform:translate(0,-16px)}40%,75%{transform:translate(0,0)}', { dur: 1.8 }, thumbDown(60, 70))),
  'vgame.spak': all(rect(10, 76, 100, 34, C.grey2, 10, C.ink, 2), ellipse(60, 84, 30, 11, C.dark, C.ink, 1.8), ellipse(60, 82, 15, 5.5, '#191a22', null), faded(0.3, rot(-20, 60, 84, rect(55.5, 46, 9, 38, C.grey, 3, null), ellipse(60, 44, 17, 8, C.grey, null))),
    rot(18, 60, 84, rect(55.5, 46, 9, 38, C.dark, 3, C.ink, 1.6), path('M43 44 C43 32 77 32 77 44 C77 52 43 52 43 44 Z', HL, C.ink, 1.8), ellipse(60, 41, 11, 4, '#f08a5c', null)),
    arrow(26, 30, 12, 30, C.grey, 2.6), arrow(96, 30, 110, 30, C.grey, 2.6), arrow(60, 22, 60, 8, C.grey, 2.6)),
  'vgame.styrkors': all(rect(10, 12, 100, 96, C.grey2, 18, C.ink, 2), circle(60, 60, 42, '#b3b9c0', null), path('M51 24 L69 24 L69 51 L96 51 L96 69 L69 69 L69 96 L51 96 L51 69 L24 69 L24 51 L51 51 Z', HL, C.ink, 2.2), circle(60, 60, 5, '#c44a26', null),
    path('M60 29 L66 39 L54 39 Z M60 91 L66 81 L54 81 Z M29 60 L39 54 L39 66 Z M91 60 L81 54 L81 66 Z', C.ink, null)),
  'vgame.axelknapp': all(pad(60, 70, 1.9, 'shoulder'), arrow(22, 14, 30, 34, C.ink, 2.4), arrow(98, 14, 90, 34, C.ink, 2.4)),
  'vgame.bärbar': all(rect(8, 8, 104, 44, SKYB, 6, C.ink, 2), path('M8 44 C24 30 40 40 54 34 C72 26 92 40 112 32 L112 46 C112 49 109 52 106 52 L14 52 C11 52 8 49 8 46 Z', GRASS, null), tree(30, 44, 0.7), tree(86, 40, 0.7), line('M60 8 L60 52', C.ink, 2), line('M96 20 L108 20 M92 26 L108 26', C.white, 2),
    ellipse(16, 86, 11, 15, C.skin, C.ink, 1.8), ellipse(104, 86, 11, 15, C.skin, C.ink, 1.8), rect(18, 64, 84, 40, HL, 9, C.ink, 2.2), rect(38, 69, 44, 30, NIGHT, 2, C.ink, 1.4), tinyGame(60, 86, 1.5),
    path('M26 74 L30 74 L30 78 L34 78 L34 82 L30 82 L30 86 L26 86 L26 82 L22 82 L22 78 L26 78 Z', C.dark, C.ink, 0.9), circle(92, 76, 3, C.white, C.ink, 1), circle(92, 88, 3, C.white, C.ink, 1), ellipse(27, 93, 6, 7, C.skin, C.ink, 1.4), ellipse(93, 96, 6, 6, C.skin, C.ink, 1.4)),
  'vgame.rörelsekontroll': all(ground, screen(6, 30, 46, 36, SKYB, rect(9, 58, 40, 5, GRASS, 0, null), hero(28, 58, 0.62, { arms: 'swing', col: C.denim }), circle(42, 40, 2.4, C.yellow, C.ink, 0.8)), rect(26, 66, 6, 6, C.dark, 0, C.ink, 1.2), line('M18 73 L40 73', C.ink, 2.6),
    hero(84, 110, 2, { arms: 'swing' }), rot(24, 111, 50, rect(107, 36, 8, 22, C.white, 3, C.ink, 1.6), circle(111, 42, 2, HL, null)), line('M96 22 C86 26 80 34 78 44', HL, 2.6), line('M90 14 C76 20 68 32 66 46', HL, 2.2, '4 3'), line('M70 60 C64 58 60 54 56 50', C.grey, 1.8, '3 3')),

  // ── 4723 Spelvärldar och uppdrag ──
  'vgame.spelvärld': tv(SKYB, cloudS(26, 26, 0.8), cloudS(96, 30, 0.7), path('M18 58 C30 86 90 86 102 58 Z', EARTH, C.ink, 1.6), ellipse(60, 58, 42, 13, GRASS, C.ink, 1.6), ellipse(82, 62, 12, 4, '#6fb1d8', C.ink, 1), hill(38, 54, 0.9), castle(66, 54, 0.6), tree(52, 60, 0.6), tree(24, 60, 0.55), hut(92, 56, 0.6), hut(80, 54, 0.5), sparkle(60, 22, 3.4, C.white)),
  'vgame.öppen-värld': all(rect(4, 4, 112, 112, GRASS, 14, null), line('M60 60 L60 0 M60 60 L60 120 M60 60 L0 60 M60 60 L120 60', '#e2d5b0', 9), hill(8, 34, 1.3), hill(30, 12, 0.9), castle(116, 30, 0.9), ellipse(112, 104, 22, 14, '#6fb1d8', C.ink, 1.2), tree(4, 100, 1.1), tree(16, 112, 1), tree(26, 98, 0.8), hut(96, 6, 0.9), tree(6, 60, 0.7),
    arrow(60, 38, 60, 22, HL, 3.4), arrow(60, 84, 60, 100, HL, 3.4), arrow(40, 60, 24, 60, HL, 3.4), arrow(80, 60, 96, 60, HL, 3.4), arrow(46, 46, 36, 36, HL, 2.6), arrow(74, 46, 84, 36, HL, 2.6), arrow(46, 76, 36, 86, HL, 2.6), arrow(74, 76, 84, 86, HL, 2.6), circle(60, 60, 15, GRASS, C.white, 1.8), hero(60, 73, 0.9)),
  'vgame.spelfigur': all(tv(SKYB, gnd(), hero(28, 76, 0.9, { grey: true }), hero(94, 76, 0.9, { grey: true }), ellipse(60, 77, 14, 4, 'none', HL, 2.4), hero(60, 76, 1.25), path('M54 20 L66 20 L60 29 Z', HL, C.ink, 1.4)), line('M60 80 C60 92 76 96 86 100', HL, 2, '3 3'), pad(96, 104, 0.5)),
  'vgame.uppdrag.2': all(ground, hero(28, 108, 1.6, { col: C.green, beard: true, arms: 'fwd' }), circle(28, 36, 10, C.yellow, C.ink, 1.8), num(28, 42, '!', 16), rot(-6, 62, 62, rect(48, 44, 28, 34, C.beige, 2, C.ink, 1.8), path('M48 44 C52 40 72 40 76 44 Z', '#d1bc94', C.ink, 1.2), keyI(63, 56, 0.9), rect(53, 66, 6, 6, C.white, 1, C.ink, 1.1), line('M62 69 L71 69', C.ink, 1.4)), hero(94, 108, 1.6, { arms: 'fwd', flip: true })),
  'vgame.huvuduppdrag': questMap(true),
  'vgame.sidouppdrag': questMap(false),
  'vgame.bana.3': tv(NIGHT, line('M24 62 L48 44 L72 62 L96 44', C.white, 2, '3 3'), circle(24, 62, 9, C.green, C.ink, 1.4), line('M20 62 L23 65.5 L28.5 58.5', C.white, 2.2), circle(48, 44, 10, HL, C.white, 2), num(48, 48.5, '2', 12, C.white), circle(72, 62, 9, C.grey, C.ink, 1.4), num(72, 66, '3', 10, C.dark), circle(96, 44, 9, C.grey, C.ink, 1.4), num(96, 48, '4', 10, C.dark),
    hero(48, 34, 0.5), line('M104 20 L104 34', C.white, 1.6), path('M104 20 L96 23 L104 26 Z', C.grey2, null), star(24, 78, 3), star(31, 78, 3), star(17, 78, 3)),
  'vgame.boss.2': all(ground, rect(14, 8, 92, 11, C.dark, 4, C.ink, 1.8), rect(17, 11, 62, 5, C.red, 2.5, null), monster(72, 112, 2.35, C.purple, { crown: true }), hero(18, 112, 0.95, { face: 'o', arms: 'fwd' }), sword(31, 96, 30, 0.6), line('M10 76 l-2 4 M26 74 l2 4', C.sky, 1.6)),
  'vgame.skatt.2': all(ground, path('M14 112 C24 96 38 100 44 112 Z M78 112 C86 98 100 98 108 112 Z', EARTH, C.ink, 1.6), chest(60, 108, 2.3, true), sparkle(38, 44, 5), sparkle(84, 40, 6), sparkle(60, 30, 4), coin(40, 106, 4), coin(84, 108, 4), coin(50, 110, 3),
    rot(28, 100, 70, line('M100 44 L100 84', C.brown, 3.4), path('M94 84 L106 84 L104 98 C102 102 98 102 96 98 Z', C.silver, C.ink, 1.4))),
  'vgame.spara.3': all(screen(8, 30, 46, 36, SKYB, rect(11, 56, 40, 7, GRASS, 0, null), hero(24, 56, 0.6), line('M40 42 L40 56', C.ink, 1.4), path('M40 42 L48 45 L40 48 Z', C.red, C.ink, 0.9)), disk(88, 48, 2.1), waIn('vg-spara3', -22, 0, arrow(56, 48, 68, 48, HL, 4)),
    moving('vg-spara3b', '0%,55%{opacity:0}70%,100%{opacity:1}', { dur: 2.6 }, check(88, 92, 1.3)), line('M20 84 L40 84', C.grey2, 3), circle(14, 84, 2, C.grey2, null)),
  'vgame.sparpunkt': all(rect(4, 4, 112, 112, NIGHT, 14, null), path('M4 96 C30 88 90 88 116 96 L116 104 C116 110 110 116 104 116 L16 116 C10 116 4 110 4 104 Z', '#3d5a45', null), circle(72, 50, 26, 'none', C.gold, 1.6, ), `<circle cx="72" cy="50" r="19" fill="#f2c14e" opacity=".3"/>`,
    rect(64, 74, 16, 26, STONE, 2, C.ink, 1.6), rect(60, 70, 24, 6, STONE, 2, C.ink, 1.6), path('M72 34 L82 52 L72 70 L62 52 Z', C.sky, C.ink, 1.6), line('M72 34 L72 70 M62 52 L82 52', C.white, 1.2), disk(72, 18, 0.8, HL), sparkle(96, 36, 4), sparkle(48, 34, 3.4), hero(28, 102, 1.1, { arms: 'fwd' }), tree(104, 98, 0.9, '#2f6b45')),

  // ── 4724 Rollspelssystem ──
  'vgame.bordsrollspel': all(bust(26, 30, 1.5, HL), bust(60, 24, 1.5, C.green, true), bust(94, 30, 1.5, C.denim), ellipse(60, 80, 52, 28, C.tan, C.ink, 2),
    rot(-8, 36, 76, rect(22, 64, 26, 30, C.white, 1.5, C.ink, 1.3), circle(30, 72, 4, C.grey2, C.ink, 0.9), line('M37 70 L44 70 M26 80 L44 80 M26 85 L44 85 M26 90 L38 90', C.grey, 1.3)), rot(40, 52, 96, rect(50, 86, 3.4, 18, C.yellow, 1, C.ink, 0.9)),
    rect(56, 60, 34, 24, '#cfe4c4', 1.5, C.ink, 1.3), line('M67 60 L67 84 M78 60 L78 84 M56 72 L90 72', '#9cc08c', 1), path('M61 70 C61 64 65 64 65 70 Z', HL, C.ink, 0.9), circle(63, 63, 2, HL, C.ink, 0.8), path('M82 82 C82 76 86 76 86 82 Z', C.purple, C.ink, 0.9), circle(84, 75, 2, C.purple, C.ink, 0.8),
    path('M74 90 L82 86 L90 90 L90 99 L82 103 L74 99 Z', C.red, C.ink, 1.3), line('M74 90 L82 94 L90 90 M82 94 L82 103', C.ink, 1), rect(60, 92, 9, 9, C.white, 2, C.ink, 1.2), circle(62.6, 94.6, 0.9, C.ink, null), circle(66.4, 98.4, 0.9, C.ink, null)),
  'vgame.spelledare': all(bust(60, 44, 2.2, C.navy), path('M22 62 L46 54 L74 54 L98 62 L98 96 L74 88 L46 88 L22 96 Z', HL, C.ink, 2.2), line('M46 54 L46 88 M74 54 L74 88', C.ink, 1.8), star(60, 71, 7), sparkle(34, 76, 4, C.white), sparkle(86, 76, 4, C.white),
    path('M84 6 L114 6 L114 30 L96 30 L88 37 L90 30 L84 30 Z', C.white, C.ink, 1.6), monster(99, 27, 0.55), circle(18, 112, 9, C.grey2, C.grey, 1.6), circle(60, 114, 9, C.grey2, C.grey, 1.6), circle(102, 112, 9, C.grey2, C.grey, 1.6)),
  'vgame.magiker': all(ground, path('M44 62 L72 62 L84 112 L34 112 Z', C.purple, C.ink, 2), line('M46 82 L78 82', C.gold, 2), circle(58, 50, 11, C.skin, C.ink, 1.8), path('M48 52 C50 72 66 72 68 52 C64 58 52 58 48 52 Z', C.white, C.ink, 1.4), circle(54, 48, 1.3, C.ink, null), circle(62, 48, 1.3, C.ink, null),
    ellipse(58, 41, 21, 5, C.purple, C.ink, 1.8), path('M44 40 L60 6 L72 40 Z', C.purple, C.ink, 1.8), star(59, 28, 4.4), line('M70 70 L90 74', C.ink, 6), line('M70 70 L90 74', C.purple, 4), circle(91, 74, 4, C.skin, C.ink, 1.3), line('M92 30 L92 112', C.brown, 3.6), circle(92, 24, 8, C.sky, C.ink, 1.8), sparkle(106, 14, 5), sparkle(80, 12, 4), sparkle(108, 36, 3.4)),
  'vgame.trollformel': all(path('M14 100 L60 90 L106 100 L106 70 L60 60 L14 70 Z', C.white, C.ink, 2), line('M60 60 L60 90', C.ink, 1.8), line('M22 76 l8 -3 l5 4 l7 -5 l8 2 M22 84 l10 -2 l6 3 l12 -3 M22 92 l14 -3 l14 1', C.purple, 1.5), line('M68 72 l8 3 l6 -3 l8 5 l8 0 M68 80 l12 3 l8 -2 l10 4 M68 88 l10 2 l18 3', C.purple, 1.5), circle(40, 79, 2, 'none', C.purple, 1.2), circle(84, 77, 2, 'none', C.purple, 1.2),
    line('M60 58 C40 46 82 40 62 26 C52 18 70 12 66 6', C.gold, 3), sparkle(42, 44, 5), sparkle(82, 36, 6), sparkle(50, 22, 4), star(78, 18, 5), star(36, 28, 3.6, C.sky), circle(90, 52, 2, C.gold, null), circle(30, 54, 2, C.gold, null)),
  'vgame.utrustning': all(...[0, 1, 2].flatMap((c) => [0, 1].map((r) => rect(8 + c * 36, 14 + r * 48, 32, 42, '#efe2c6', 4, C.ink, 1.8))),
    path('M14 38 C14 18 34 18 34 38 L34 44 L28 44 L28 38 L20 38 L20 44 L14 44 Z', C.silver, C.ink, 1.5), line('M24 22 L24 34', C.ink, 1.2), sword(60, 48, 0, 1.1), shieldS(96, 36, 1.5),
    path('M14 74 L24 74 L24 90 L34 92 C38 94 38 100 32 100 L14 100 Z', C.brown, C.ink, 1.5), line('M14 94 L36 94', C.ink, 1.2), path('M50 78 C50 68 70 68 70 78 L72 98 L48 98 Z', GRASS2, C.ink, 1.5), rect(54, 84, 12, 9, '#4d8a4a', 2, C.ink, 1), path('M54 72 C54 62 66 62 66 72', 'none', C.ink, 1.5),
    path('M86 70 L92 66 L100 66 L106 70 L104 78 L102 76 L102 98 L90 98 L90 76 L88 78 Z', '#c9d3dc', C.ink, 1.5), line('M92 66 C94 72 98 72 100 66', C.ink, 1.1)),
  'vgame.erfarenhetspoäng': all(ground, hero(26, 92, 1.4, { arms: 'up' }), rot(90, 96, 80, monster(96, 92, 0.9, C.grey, { dead: true })), star(74, 62, 5), star(60, 48, 6), star(46, 42, 5), line('M82 70 C70 50 54 42 40 46', HL, 1.8, '3 3'), num(82, 34, '+50', 17, HL),
    rect(10, 96, 100, 12, C.white, 5, C.ink, 1.8), rect(12.5, 98.5, 58, 7, HL, 3, null), line('M40 97 L40 107 M70 97 L70 107', C.ink, 0.9)),
  'vgame.gå-upp-i-nivå': all(ground, ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI + (i * Math.PI) / 6, x1 = 60 + Math.cos(a) * 30, y1 = 74 + Math.sin(a) * 30, x2 = 60 + Math.cos(a) * 42, y2 = 74 + Math.sin(a) * 42; return line(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`, C.gold, 2.6); }),
    hero(60, 110, 1.7, { arms: 'up' }), circle(22, 30, 10, C.grey2, C.grey, 1.6), num(22, 35, '4', 13, C.grey), arrow(34, 26, 46, 22, C.grey, 2.2), moving('vg-niva', '0%{transform:scale(.4);opacity:.2}45%,100%{transform:scale(1);opacity:1}', { dur: 2.4, spin: true }, circle(60, 20, 14, C.gold, C.ink, 2), num(60, 27, '5', 19)),
    waIn('vg-niva2', 0, 26, arrow(100, 96, 100, 40, C.green, 5))),
  'vgame.livmätare': all(ground, rect(6, 10, 108, 30, NIGHT, 8, C.ink, 2), heart(22, 25, 6.4), rect(36, 17, 70, 16, '#0d1326', 6, C.white, 1.6), rect(39, 20, 18, 10, C.red, 4, null), line('M59 20 L59 30 M82 20 L82 30', '#3a4566', 1.2), line('M48 40 L56 62', HL, 1.8, '3 3'),
    hero(60, 110, 1.5, { face: 'sad' }), line('M44 70 l-3 5 M76 70 l3 5', C.sky, 2), line('M74 86 L84 92 M76 82 L86 88', C.red, 1.8), monster(102, 110, 0.7, C.grey)),
  'vgame.trolldryck': all(ground, potion(56, 76, 3.2, C.red), circle(48, 80, 2.6, '#f7b0b0', null), circle(62, 92, 2, '#f7b0b0', null), circle(58, 70, 1.6, '#f7b0b0', null), sparkle(92, 60, 6), sparkle(20, 50, 5), sparkle(88, 96, 4), heart(96, 26, 6), line('M106 12 L106 22 M101 17 L111 17', C.green, 3)),

  // ── 4725 Flerspelarlägen ──
  'vgame.enspelarläge': all(screen(30, 6, 60, 40, SKYB, rect(33, 36, 54, 7, GRASS, 0, null), hero(60, 36, 0.7)), rect(56, 46, 8, 5, C.dark, 0, C.ink, 1.2), ground, rect(8, 78, 104, 30, '#7fa6d6', 9, C.ink, 2), rect(4, 70, 14, 40, '#6a93c6', 6, C.ink, 2), rect(102, 70, 14, 40, '#6a93c6', 6, C.ink, 2), line('M43 80 L43 106 M77 80 L77 106', '#5f86b8', 1.6),
    bust(60, 72, 1.9, HL), pad(60, 98, 0.6), ellipse(48, 98, 5, 5.6, C.skin, C.ink, 1.2), ellipse(72, 98, 5, 5.6, C.skin, C.ink, 1.2)),
  'vgame.flerspelarläge': all(line('M22 30 L40 46 M98 30 L80 46 M22 92 L40 76 M98 92 L80 76', C.ink, 1.6, '3 3'), screen(34, 40, 52, 40, SKYB, rect(37, 68, 46, 9, GRASS, 0, null), hero(45, 70, 0.5), hero(55, 72, 0.5, { col: C.green }), hero(65, 70, 0.5, { col: C.denim }), hero(75, 72, 0.5, { col: C.purple })),
    bust(18, 20, 1.4, HL), bust(102, 20, 1.4, C.green, true), bust(18, 94, 1.4, C.denim, true), bust(102, 94, 1.4, C.purple), pad(18, 42, 0.3), pad(102, 42, 0.3), pad(18, 114, 0.3), pad(102, 114, 0.3)),
  'vgame.samarbetsläge': tv(SKYB, cloudS(30, 26, 0.7), rect(62, 46, 47, 39, EARTH, 0, null), rect(62, 46, 47, 5, GRASS2, 0, null), line('M62 46 L62 85', C.ink, 1.4), rect(11, 78, 51, 7, GRASS2, 0, null),
    hero(76, 46, 0.95, { col: C.denim, flip: true }), line('M70 31 L59 50', C.ink, 4.4), line('M70 31 L59 50', C.denim, 2.6), hero(49, 78, 0.95, { arms: 'up' }), circle(59.5, 50.5, 3, C.skin, C.ink, 1), heart(46, 28, 4), sparkle(92, 24, 3.4, C.white), monster(26, 78, 0.5, C.grey)),
  'vgame.delad-skärm': all(rect(6, 10, 108, 80, C.dark, 7, C.ink, 2), rect(11, 15, 48, 70, SKYB, 3, null), rect(61, 15, 48, 70, '#ffe2b8', 3, null), rect(11, 60, 48, 25, '#6b6f78', 0, null), rect(61, 60, 48, 25, '#6b6f78', 0, null), line('M11 72 L59 72 M61 72 L109 72', C.white, 1.4, '5 4'),
    car(34, 76, 0.9, C.red), car(86, 76, 0.9, C.denim), cloudS(28, 30, 0.6), circle(92, 30, 6, C.yellow, null), line('M60 12 L60 88', HL, 4.4), path('M50 90 L70 90 L72 98 L48 98 Z', C.dark, C.ink, 1.6),
    at(32, 100, 0.9, back(0, 0, C.hair, C.red)), at(88, 100, 0.9, back(0, 0, '#8a5a34', C.denim))),
  'vgame.duell': all(ground, hero(30, 110, 1.7, { arms: 'fwd' }), hero(90, 110, 1.7, { col: C.denim, arms: 'fwd', flip: true }), sword(56, 78, 38, 1.5), sword(64, 78, -38, 1.5), star(60, 46, 9), path('M58 8 L52 22 L58 22 L54 34 L68 18 L61 18 L64 8 Z', C.yellow, C.ink, 1.4)),
  'vgame.lobby.3': tv(NIGHT, circle(60, 30, 11, C.white, C.ink, 1.6), line('M60 30 L60 23 M60 30 L65 33', C.ink, 1.8), rect(16, 76, 68, 4, C.brown, 1, C.ink, 1), hero(26, 76, 0.75), hero(42, 76, 0.75, { col: C.green }), hero(58, 76, 0.75, { col: C.denim }),
    circle(74, 55, 5.6, 'none', C.white, 1.3, ), rect(69, 61, 10, 11, 'none', 3, C.white, 1.3), line('M72 72 L72 76 M76 72 L76 76', C.white, 1.3), num(74, 48, '?', 9, C.white), rect(92, 42, 14, 38, C.grey, 2, C.ink, 1.4), line('M96 42 L96 80 M99 42 L99 80 M102 42 L102 80', C.ink, 1), circle(99, 36, 3, C.red, C.ink, 1)),
  'vgame.röstchatt': all(bust(28, 52, 2.3, HL), headset(28, 52, 2.3), bust(92, 52, 2.3, C.denim, true), headset(92, 52, 2.3), line('M50 44 C55 50 55 58 50 64', HL, 2.6), line('M56 38 C64 48 64 60 56 70', HL, 2.2), line('M70 44 C65 50 65 58 70 64', C.denim, 2.6), line('M64 38 C56 48 56 60 64 70', C.denim, 2.2),
    pad(28, 100, 0.5), pad(92, 100, 0.5), path('M46 6 L74 6 L74 24 L64 24 L60 30 L56 24 L46 24 Z', C.white, C.ink, 1.6), line('M51 15 l3 -5 l3 9 l3 -7 l3 5 l3 -3', HL, 1.6)),
  'vgame.lagga': tv(SKYB, gnd(), faded(0.28, hero(30, 76, 1, { grey: true })), faded(0.5, hero(46, 76, 1, { grey: true })), line('M34 60 L40 60 M50 60 L56 60', C.grey, 1.6),
    moving('vg-lagg', '0%,32%{transform:translate(-40px,0)}33%,62%{transform:translate(-24px,0)}63%,100%{transform:translate(0,0)}', { dur: 2.4 }, hero(70, 76, 1, { face: 'flat' })),
    rect(16, 30, 4, 6, C.red, 1, C.ink, 0.9), rect(22, 26, 4, 10, C.grey, 1, C.ink, 0.9), rect(28, 22, 4, 14, C.grey, 1, C.ink, 0.9), line('M14 20 L34 38', C.red, 2.2),
    waSpin('vg-lagg2', 1.4, circle(94, 32, 8, 'none', C.white, 3, ), path('M94 24 A8 8 0 0 1 102 32', 'none', HL, 3))),
  'vgame.rankad': all(ground, hero(18, 110, 1.15, { arms: 'up' }), path('M12 62 L12 70 L15 67 L18 72 L21 67 L24 70 L24 62 Z', C.gold, C.ink, 1), hero(52, 110, 1.15, { col: C.denim, face: 'sad', flip: true }), sword(31, 86, 35, 0.8), sword(39, 86, -35, 0.8), star(35, 62, 5),
    line('M84 14 L84 110 M108 14 L108 110', C.brown, 3.4), line('M84 40 L108 40 M84 70 L108 70 M84 100 L108 100', C.brown, 3), at(96, 26, 1.5, path('M0 -9 L8 -6 C8 2 5 7 0 10 C-5 7 -8 2 -8 -6 Z', C.grey2, C.grey, 1.2)), faded(0.6, at(96, 86, 1.5, path('M0 -9 L8 -6 C8 2 5 7 0 10 C-5 7 -8 2 -8 -6 Z', BRONZE, C.grey, 1.2))),
    at(96, 56, 1.6, path('M0 -9 L8 -6 C8 2 5 7 0 10 C-5 7 -8 2 -8 -6 Z', HL, C.ink, 1.3)), star(96, 56, 6, C.white), arrow(72, 92, 72, 54, C.green, 4), line('M24 96 C40 104 60 100 68 78', HL, 1.8, '3 3')),
  'vgame.poängtavla': all(rect(10, 8, 100, 104, NIGHT, 7, C.ink, 2), rect(14, 12, 92, 22, HL, 4, null), path('M17 28 L17 18 L21 23 L24 16 L27 23 L31 18 L31 28 Z', C.gold, C.ink, 1.1),
    ...[0, 1, 2, 3].map((i) => all(circle(42, 23 + i * 24, 6, [C.white, C.green, C.sky, C.pink][i]!, C.ink, 1.1), rect(52, 20 + i * 24, [30, 24, 18, 12][i]!, 6, C.white, 3, null), num(96, 28 + i * 24, ['250', '180', '120', '60'][i]!, 10, C.white), i ? num(24, 28 + i * 24, String(i + 1), 11, C.grey2) : '', i ? line(`M16 ${36 + (i - 1) * 24} L104 ${36 + (i - 1) * 24}`, '#3a4566', 1) : ''))),

  // ── 4726 Spelstrategier ──
  'vgame.spelstrategi': all(line('M30 74 L24 92 M90 74 L96 92', C.ink, 2.4), rect(10, 8, 100, 68, C.white, 4, C.ink, 2), monster(88, 50, 0.6, C.grey), line('M24 26 L30 32 M30 26 L24 32 M24 56 L30 62 M30 56 L24 62', C.denim, 2.6), circle(27, 44, 4, 'none', C.denim, 2.4),
    line('M34 28 C54 16 78 16 86 26', HL, 2.4, '4 3'), arrow(84, 23, 88, 29, HL, 2.4), line('M34 60 C54 70 76 68 84 58', HL, 2.4, '4 3'), arrow(82, 61, 87, 55, HL, 2.4), line('M34 44 L58 44', HL, 2.4, '4 3'), arrow(56, 44, 64, 44, HL, 2.4),
    bust(34, 98, 1.5, HL), bust(84, 98, 1.5, C.green, true)),
  'vgame.svårighetsgrad': all(rect(12, 8, 96, 104, NIGHT, 8, C.ink, 2), ...[0, 1, 2].map((i) => rect(22, 16 + i * 31, 78, 26, i === 1 ? '#3a4a78' : '#1b2438', 5, i === 1 ? HL : '#3a4566', i === 1 ? 3 : 1.2)),
    star(40, 29, 6, C.grey2), star(34, 60, 6), star(48, 60, 6), star(28, 91, 6, C.grey2), star(41, 91, 6, C.grey2), star(54, 91, 6, C.grey2), path('M10 52 L20 60 L10 68 Z', HL, C.ink, 1.4),
    circle(84, 29, 8, C.grey2, C.ink, 1.2), line('M80 30 Q84 34 88 30', C.ink, 1.3), circle(84, 60, 8, C.yellow, C.ink, 1.2), line('M80 62 L88 62', C.ink, 1.3), circle(81, 58, 1, C.ink, null), circle(87, 58, 1, C.ink, null), circle(84, 91, 8, C.grey2, C.ink, 1.2), line('M80 94 Q84 90 88 94', C.ink, 1.3), line('M92 84 l2 4', C.sky, 1.6)),
  'vgame.spelstil': all(rect(4, 10, 86, 46, NIGHT, 9, C.ink, 1.6), rect(4, 64, 86, 46, '#ffe9c4', 9, C.ink, 1.6), line('M90 33 C100 33 104 44 104 52 M90 87 C100 87 104 76 104 68', '#cdbb8e', 6), circle(104, 60, 11, C.white, C.ink, 1.8), star(104, 60, 7),
    path('M14 52 C12 40 22 36 28 42 C32 34 44 38 42 52 Z', '#2f6b45', C.ink, 1.4), rot(28, 30, 40, hero(30, 50, 0.85, { col: C.denim })), circle(44, 51, 1.2, C.grey, null), circle(50, 49, 1.2, C.grey, null), circle(56, 51, 1.2, C.grey, null), monster(72, 52, 0.7, C.grey), line('M66 40 L69 40 M75 40 L78 40', C.ink, 1.4), path('M10 16 A7 7 0 1 0 18 26 A6 6 0 1 1 10 16 Z', C.yellow, null),
    line('M8 84 L18 84 M10 92 L20 92', C.grey, 2.2), rot(12, 32, 96, hero(32, 106, 0.95, { arms: 'fwd' })), sword(46, 88, 65, 0.8), star(58, 86, 8, C.yellow), rot(70, 74, 100, monster(74, 106, 0.6, C.purple, { dead: true }))),
  'vgame.dela-upp-sig': all(rect(6, 6, 108, 108, GRASS, 12, C.ink, 2), line('M60 110 L60 70 L24 30 M60 70 L96 30', C.white, 13), line('M60 110 L60 70 L24 30 M60 70 L96 30', '#e2d5b0', 9), tree(60, 44, 1.1), tree(50, 36, 0.8), tree(70, 36, 0.8),
    waIn('vg-dela', 22, 24, hero(34, 52, 0.75), hero(22, 38, 0.75, { col: C.green }), arrow(40, 62, 30, 50, HL, 3)), waIn('vg-dela2', -22, 24, hero(86, 52, 0.75, { col: C.denim, flip: true }), hero(98, 38, 0.75, { col: C.purple, flip: true }), arrow(80, 62, 90, 50, HL, 3))),
  'vgame.spara.2': all(ground, hero(26, 110, 1.5, { arms: 'fwd' }), path('M68 112 L66 82 C66 70 104 70 104 82 L102 112 Z', C.brown, C.ink, 2), path('M66 82 C72 92 98 92 104 82', 'none', C.ink, 1.8), rect(78, 96, 14, 10, '#8a5a34', 2, C.ink, 1.2), path('M74 72 C74 58 96 58 96 72', 'none', C.ink, 2.4),
    waIn('vg-spara2', -28, -6, potion(84, 76, 1.1)), circle(92, 28, 13, C.white, C.ink, 1.8), line('M92 28 L92 19 M92 28 L99 31', C.ink, 2), path('M64 30 C66 16 82 10 92 10', 'none', HL, 2.4), arrow(70, 22, 64, 32, HL, 2.4), monster(52, 40, 0.5, C.grey)),
  'vgame.guide.2': all(rect(14, 6, 92, 108, C.white, 7, C.ink, 2), rect(22, 14, 76, 34, NIGHT, 3, C.ink, 1.4), hero(44, 44, 0.55), monster(80, 44, 0.5), circle(60, 31, 9, C.white, C.ink, 1.4), playT(61, 31, 0.9),
    ...[0, 1, 2].map((i) => all(circle(30, 62 + i * 17, 6.4, HL, C.ink, 1.3), num(30, 66 + i * 17, String(i + 1), 10, C.white), line(`M42 ${59 + i * 17} L${[90, 82, 86][i]} ${59 + i * 17} M42 ${65 + i * 17} L${[74, 88, 66][i]} ${65 + i * 17}`, C.grey, 2.4))), line('M30 69 L30 72 M30 86 L30 89', C.ink, 1.4)),
  'vgame.fuskkod': tv(NIGHT, rect(18, 22, 84, 20, C.white, 4, C.ink, 1.6), path('M28 27 L33 36 L23 36 Z M42 37 L47 28 L37 28 Z M51 32 L60 27 L60 37 Z M74 32 L65 27 L65 37 Z', C.ink, null), circle(82, 32, 3.4, C.ink, null), line('M92 26 L92 38', HL, 2.4),
    arrow(60, 44, 60, 54, HL, 3), heart(38, 68, 8), num(70, 77, '×99', 22, C.yellow), sparkle(22, 56, 3.4), sparkle(100, 58, 4)),

  // ── 4727 Spelgemenskaper ──
  'vgame.streama.2': all(screen(8, 44, 40, 30, SKYB, rect(11, 62, 34, 9, GRASS, 0, null), hero(28, 64, 0.55)), rect(22, 36, 12, 8, C.dark, 2, C.ink, 1.3), circle(28, 40, 2.2, C.sky, C.ink, 0.8), waPulse('vg-stream', circle(14, 30, 4.4, C.red, C.ink, 1.2)), pad(28, 92, 0.6), ellipse(17, 92, 5, 5.6, C.skin, C.ink, 1.2), ellipse(39, 92, 5, 5.6, C.skin, C.ink, 1.2),
    waPulse('vg-stream2', line('M54 46 C60 54 60 64 54 72', HL, 3), line('M62 38 C72 50 72 68 62 80', HL, 2.6), line('M70 30 C84 46 84 72 70 88', HL, 2.2)),
    phoneS(100, 22, 0.85, at(0, 0, 0.9, hero(0, 6, 0.3))), screen(84, 46, 30, 22, SKYB, hero(99, 62, 0.34)), path('M82 68 L116 68 L118 72 L80 72 Z', C.grey, C.ink, 1.1), at(100, 96, 1, rect(-13, -10, 26, 20, C.dark, 3, C.ink, 1.4), rect(-10.5, -7.5, 21, 15, SKYB, 1, null), hero(0, 5, 0.3))),
  'vgame.streamare': all(circle(60, 56, 44, 'none', C.gold, 4), circle(60, 56, 44, 'none', C.white, 1.4), bust(60, 76, 3, HL), headset(60, 76, 3), line('M112 112 L100 88 L84 92', C.ink, 2.6), rect(74, 86, 13, 9, C.dark, 4, C.ink, 1.4), line('M77 88 L77 93 M80.5 88 L80.5 93 M84 88 L84 93', C.grey, 1),
    rect(6, 6, 30, 16, C.white, 5, C.ink, 1.6), circle(15, 14, 4.4, C.red, null), line('M23 11 L31 11 M23 17 L29 17', C.grey, 2), heart(102, 30, 4.4), heart(110, 48, 3.4), heart(98, 14, 3)),
  'vgame.tittare': all(screen(18, 6, 84, 48, SKYB, rect(21, 40, 78, 11, GRASS, 0, null), hero(44, 42, 0.6), monster(74, 42, 0.55), star(59, 24, 5)), path('M72 12 C78 6 90 6 96 12 C90 18 78 18 72 12 Z', C.white, C.ink, 1.1), circle(84, 12, 2.6, C.ink, null), ground,
    back(26, 84, C.hair, HL), back(60, 90, '#8a5a34', HL), back(94, 84, '#d9b064', HL), line('M26 70 L34 56 M60 76 L60 58 M94 70 L86 56', C.grey, 1.6, '3 3')),
  'vgame.spelförening': all(ground, rect(20, 50, 80, 62, C.beige, 2, C.ink, 2), path('M12 52 L60 18 L108 52 Z', C.red, C.ink, 2), rect(50, 80, 20, 32, C.brown, 2, C.ink, 1.6), circle(66, 97, 1.6, C.gold, null), path('M60 30 L74 35 C74 46 68 53 60 57 C52 53 46 46 46 35 Z', HL, C.ink, 1.8), pad(60, 43, 0.38),
    rect(26, 62, 18, 16, SKYB, 1.5, C.ink, 1.4), bust(35, 72, 0.8, C.green), rect(76, 62, 18, 16, SKYB, 1.5, C.ink, 1.4), bust(85, 72, 0.8, C.denim, true), hero(12, 112, 0.85, { col: C.green, arms: 'fwd' }), hero(108, 112, 0.85, { col: C.purple, arms: 'fwd', flip: true }), rect(16, 92, 9, 7, C.yellow, 1, C.ink, 1), rect(95, 92, 9, 7, C.sky, 1, C.ink, 1)),
  'vgame.lan': all(rect(4, 4, 112, 112, '#3a3f58', 14, null), rect(10, 10, 24, 20, NIGHT, 2, C.ink, 1.4), path('M26 14 A6 6 0 1 0 30 24 A5 5 0 1 1 26 14 Z', C.yellow, null), sparkle(15, 15, 2, C.white),
    ...[0, 1].flatMap((r) => [0, 1, 2].map((c) => { const x = 24 + c * 36, y = 56 + r * 40, col = [HL, C.green, C.denim, C.purple, C.red, C.sky][r * 3 + c]!; return all(bust(x, y - 24, 1.05, col, (r + c) % 2 === 1), screen(x - 12, y - 16, 24, 17, SKYB), `<circle cx="${x}" cy="${y - 8}" r="16" fill="#bfe3f5" opacity=".18"/>`, line(`M${x} ${y + 2} L${x} ${y + 8}`, C.ink, 1.4)); })),
    rect(6, 57, 108, 6, C.brown, 2, C.ink, 1.4), rect(6, 97, 108, 6, C.brown, 2, C.ink, 1.4), line('M24 64 C24 74 50 70 56 108 M60 64 L60 74 M96 64 C96 74 70 70 64 108 M24 104 C30 110 44 110 54 110 M96 104 C90 110 76 110 66 110', C.ink, 1.3), rect(52, 105, 16, 8, C.dark, 2, C.ink, 1.2), circle(56, 109, 1.2, C.green, null), circle(60, 109, 1.2, C.green, null), circle(64, 109, 1.2, C.green, null)),
  'vgame.forum': all(rect(10, 6, 100, 108, C.white, 6, C.ink, 2), rect(10, 6, 100, 12, C.grey2, 6, C.ink, 2), circle(18, 12, 2, C.red, null), circle(25, 12, 2, C.yellow, null), circle(32, 12, 2, C.green, null),
    rect(16, 24, 88, 26, '#fff3e6', 3, HL, 1.8), circle(27, 37, 7, HL, C.ink, 1.2), line('M40 32 L84 32 M40 38 L74 38 M40 44 L80 44', C.grey, 2.2), circle(94, 37, 7, C.white, HL, 1.6), num(94, 41.5, '?', 12, HL),
    line('M22 50 L22 66 L30 66 M22 66 L22 92 L30 92', C.grey, 1.6), rect(30, 56, 74, 22, '#eef4fb', 3, C.grey, 1.2), circle(40, 67, 6, C.green, C.ink, 1.1), line('M51 63 L90 63 M51 70 L80 70', C.grey, 2.2), rect(30, 82, 74, 22, '#eef4fb', 3, C.grey, 1.2), circle(40, 93, 6, C.denim, C.ink, 1.1), line('M51 89 L86 89 M51 96 L72 96', C.grey, 2.2), check(96, 93, 0.75)),
  'vgame.avatar': all(ground, bust(24, 78, 2.3, C.green), arrow(46, 62, 58, 62, C.ink, 2.6), rect(60, 16, 54, 88, C.white, 6, C.ink, 2), circle(87, 48, 22, '#fff3e6', HL, 4),
    path('M72 40 L72 26 L82 34 Z M102 40 L102 26 L92 34 Z', C.orange, C.ink, 1.4), circle(87, 50, 16, C.orange, C.ink, 1.6), circle(80, 48, 5, C.white, C.ink, 1.6), circle(94, 48, 5, C.white, C.ink, 1.6), line('M85 48 L89 48', C.ink, 1.6), circle(80, 48, 1.6, C.ink, null), circle(94, 48, 1.6, C.ink, null), path('M85 56 L89 56 L87 58.4 Z', C.pink, C.ink, 0.8), line('M87 58.4 L87 61 M83 62 Q87 64 91 62', C.ink, 1),
    rect(68, 80, 38, 7, C.grey2, 3.5, null), rect(74, 91, 26, 5, C.grey2, 2.5, null)),
  'vgame.prispengar': all(ground, path('M22 30 L54 30 L52 54 C50 66 26 66 24 54 Z', C.gold, C.ink, 2), path('M22 34 C10 34 10 52 24 52 M54 34 C66 34 66 52 52 52', 'none', C.ink, 2.2), rect(34, 64, 8, 14, C.gold, 1, C.ink, 1.6), rect(24, 78, 28, 9, C.gold, 2, C.ink, 1.8), rect(18, 87, 40, 25, C.brown, 2, C.ink, 1.8), num(38, 106, '1', 16, C.white), star(38, 44, 7, C.white),
    ...[0, 1, 2].map((i) => rot(-8 + i * 8, 86, 96, rect(64, 76 - i * 7, 44, 22, ['#7fbf8a', '#93cc9b', '#a8dcb0'][i]!, 2, C.ink, 1.5), circle(86, 87 - i * 7, 6, 'none', C.ink, 1.2), line(`M70 ${80 - i * 7} L70 ${94 - i * 7} M102 ${80 - i * 7} L102 ${94 - i * 7}`, C.ink, 1))), coin(72, 108, 5), coin(84, 108, 5), coin(96, 108, 5), coin(78, 100, 5), coin(90, 100, 5), sparkle(100, 46, 5), sparkle(66, 40, 4)),
};
