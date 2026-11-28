/**
 * Kultur & fritid → Spel & hobbyer → Mat & dryck som hobby, 4751–4757 (0.65): brewing coffee by hand, tea and kinds
 * of tea, baking sourdough bread, photographing food, fermenting, baking desserts, tasting and aromas.
 * No brands and no letters that give away the word (digits and "?" are fine). The named part is orange (HL) or the
 * only thing in colour; grey is the reference.
 * Movement: `moving()`/`waIn()` move things with transform/opacity only; the base state is the poster frame.
 * Easily confused pairs get different kinds of picture: a hand-poured filter cone (brygga) against the pot from the
 * machine with a mug (bryggkaffe); a fresh twig (teblad) against a tin with a scoop (löste) and three tins in a row
 * (tesort); crust flaking off a half loaf (skorpa) against fingers pinching the soft middle of a slice (inkråm) and
 * two slices, airy and dense (luftig); a hand salting and pressing cabbage (fermentera) against two dated jars
 * (fermentering), a magnifier with bacteria and a crossed-out vinegar bottle (mjölksyrad) and brine poured over
 * cucumbers (lägga in); a row of numbered cups (provsmakning) against a taster with a blindfold (blindprovning).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL } from './people';

const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const turn = (x: number, y: number, deg: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg})`, ...k);
const faded = (...k: Svg[]): Svg => `<g opacity="0.45" style="filter:grayscale(1)">${k.join('')}</g>`;
const blurred = (px: number, ...k: Svg[]): Svg => `<g style="filter:blur(${px}px)">${k.join('')}</g>`;
const num = (x: number, y: number, s: string, size: number, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const cross = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 -6 L6 6 M6 -6 L-6 6', C.red, 3.4));
const table = (y = 98): Svg => all(rect(0, y, 120, 120 - y, C.tan, 0, C.ink, 2), line(`M8 ${y + 8} L44 ${y + 8} M66 ${y + 14} L110 ${y + 14}`, C.brown, 1));
const COFFEE = '#4a2f1c', BEAN = '#7a4a2a', DARK = '#33221a', CREMA = '#c99a5e', GLASS = '#e4f1f4', CRUST = '#b8742f', CRUMB = '#f5e3bd', DOUGH = '#f1dfbc', FLOUR = '#fdfaf2';
const TEA_B = '#8a3d1c', TEA_G = '#b9d06a', LEAF_G = '#4f9d50', LEAF_B = '#3a2a22', CABB = '#dfeab8', AMBER = '#d9963a';

/** Rising steam (two wavy lines); bobs gently. */
const steam = (name: string, x: number, y: number, s = 1): Svg => waBob(name, 3, at(x, y, s, line('M-5 0 C-9 -5 -1 -9 -5 -15 M5 0 C1 -5 9 -9 5 -15', C.grey, 2)));
/** Cup with a handle to the right; (x, y) = centre of the rim, the cup is 24·s high. */
const cup = (x: number, y: number, s: number, liq: string, col: string = C.white): Svg => at(x, y, s, line('M12 5 C22 5 22 17 10 17', C.ink, 5), line('M12 5 C22 5 22 17 10 17', col, 2.2), path('M-14 0 L14 0 L11 21 C10 25 -10 25 -11 21 Z', col, C.ink, 2), ellipse(0, 0, 14, 4, liq, C.ink, 1.8));
const saucer = (x: number, y: number, w: number): Svg => ellipse(x, y, w, w * 0.2, C.white, C.ink, 1.8);
const bean = (x: number, y: number, deg: number, s = 1, col: string = BEAN): Svg => turn(x, y, deg, g(`scale(${s})`, ellipse(0, 0, 7, 5, col, C.ink, 1.4), line('M-5.5 0 C-2 -3 2 3 5.5 0', C.ink, 1.1)));
/** Tea leaf, pointing up. */
const tleaf = (x: number, y: number, deg: number, s: number, col: string): Svg => turn(x, y, deg, g(`scale(${s})`, path('M0 -11 C7 -5 7 5 0 11 C-7 5 -7 -5 0 -11 Z', col, C.ink, 1.3), line('M0 -8 L0 8', C.ink, 0.8)));
/** A heap of small dry leaves / grounds / powder. */
const heap = (x: number, y: number, w: number, h: number, col: string, speck: string | null = C.ink): Svg => all(path(`M${x - w / 2} ${y} C${x - w / 4} ${y - h * 1.3} ${x + w / 4} ${y - h * 1.3} ${x + w / 2} ${y} Z`, col, C.ink, 1.6),
  speck ? line(`M${x - w * 0.2} ${y - h * 0.35} l3 -2 M${x + w * 0.05} ${y - h * 0.6} l3 1 M${x + w * 0.18} ${y - h * 0.25} l-3 -2`, speck, 1.1) : '');
/** Glass jar: body (x ± w/2, y − h … y), contents drawn by the caller between `jarBody` and `jarLid`. */
const jarBody = (x: number, y: number, w: number, h: number): Svg => rect(x - w / 2, y - h, w, h, GLASS, 7, C.ink, 2);
const jarFill = (x: number, y: number, w: number, h: number, col: string): Svg => path(`M${x - w / 2 + 2} ${y - h} L${x + w / 2 - 2} ${y - h} L${x + w / 2 - 2} ${y - 6} C${x + w / 2 - 2} ${y - 2} ${x - w / 2 + 2} ${y - 2} ${x - w / 2 + 2} ${y - 6} Z`, col, null);
const jarLid = (x: number, y: number, w: number, col: string = C.grey): Svg => rect(x - w / 2 - 2, y - 7, w + 4, 8, col, 2, C.ink, 1.8);
const bubbles = (pts: [number, number, number][], col: string = C.white): Svg => all(...pts.map(([a, b, r]) => circle(a, b, r, col, C.ink, 0.9)));
/** Round sourdough loaf; base centre at (0, 0), 52 wide and 30 high before scaling. */
const boule = (x: number, y: number, s: number, col: string = CRUST): Svg => at(x, y, s, path('M-26 0 C-29 -22 -12 -30 0 -30 C12 -30 29 -22 26 0 Z', col, C.ink, 2), path('M-12 -23 C-3 -22 6 -17 13 -9 C5 -13 -4 -18 -12 -23 Z', CRUMB, C.ink, 1.2), line('M-19 -8 C-17 -14 -14 -17 -10 -19 M17 -4 C19 -8 19 -12 17 -15', FLOUR, 1.6));
/** Slice of bread seen from the front, centre (0, 0), 44 wide and 40 high: crust colour and crumb colour. */
const slice = (x: number, y: number, s: number, crust: string, crumb: string, holes: [number, number, number][] = []): Svg => at(x, y, s, path('M-22 20 L-22 -6 C-24 -22 -8 -24 0 -22 C8 -24 24 -22 22 -6 L22 20 Z', crust, C.ink, 2), path('M-17 16 L-17 -5 C-18 -17 -7 -19 0 -17 C7 -19 18 -17 17 -5 L17 16 Z', crumb, null),
  ...holes.map(([a, b, r]) => ellipse(a, b, r, r * 0.8, '#d9bf8c', C.ink, 0.7)));
/** Mixing bowl, rim centre (x, y), width w. */
const bowl = (x: number, y: number, w: number, col: string, inside: string): Svg => all(path(`M${x - w / 2} ${y} C${x - w / 2} ${y + w * 0.55} ${x + w / 2} ${y + w * 0.55} ${x + w / 2} ${y} Z`, col, C.ink, 2), ellipse(x, y, w / 2, w * 0.13, inside, C.ink, 1.8));
const plate = (x: number, y: number, r: number): Svg => all(circle(x, y, r, C.white, C.ink, 2), circle(x, y, r * 0.72, 'none', C.grey2, 1.2));
const clockPie = (x: number, y: number, r: number, f: number, col: string): Svg => all(circle(x, y, r, C.white, C.ink, 2),
  path(`M${x} ${y} L${x} ${y - r + 2} A${r - 2} ${r - 2} 0 ${f > 0.5 ? 1 : 0} 1 ${(x + (r - 2) * Math.sin(f * 2 * Math.PI)).toFixed(1)} ${(y - (r - 2) * Math.cos(f * 2 * Math.PI)).toFixed(1)} Z`, col, null), circle(x, y, r, 'none', C.ink, 2), circle(x, y, 1.6, C.ink, null));
const phone = (x: number, y: number, w: number, h: number, ...screen: Svg[]): Svg => all(rect(x - w / 2, y - h / 2, w, h, C.dark, 5, C.ink, 2), rect(x - w / 2 + 3, y - h / 2 + 5, w - 6, h - 12, C.white, 2, null), ...screen);
const camera = (x: number, y: number, deg: number, s = 1, col: string = C.dark): Svg => turn(x, y, deg, g(`scale(${s})`, rect(-10, -7, 20, 14, col, 3, C.ink, 1.6), rect(-5, -10, 8, 4, col, 1, C.ink, 1.4), rect(-4, 7, 8, 5, C.grey, 1, C.ink, 1.4), circle(0, 0, 3.4, C.sky, C.ink, 1.2)));
const cucumber = (x: number, y: number, deg: number, len = 26): Svg => turn(x, y, deg, rect(-len / 2, -4.5, len, 9, '#6fa84f', 4.5, C.ink, 1.4), line(`M${-len / 2 + 5} -1 l2 0 M0 1 l2 0 M${len / 2 - 8} -1 l2 0`, '#3f7a34', 1.1));
const strawberry = (x: number, y: number, s = 1): Svg => at(x, y, s, path('M-6 -3 C-7 4 -2 9 0 10 C2 9 7 4 6 -3 C3 -6 -3 -6 -6 -3 Z', C.red, C.ink, 1.3), path('M-5 -4 L0 -8 L5 -4 L0 -2 Z', C.green, C.ink, 1));
const raspberry = (x: number, y: number, s = 1): Svg => at(x, y, s, circle(-3, 0, 3.2, '#c8325a', C.ink, 0.9), circle(3, 0, 3.2, '#c8325a', C.ink, 0.9), circle(0, -3.4, 3.2, '#c8325a', C.ink, 0.9), circle(0, 2.6, 3.2, '#c8325a', C.ink, 0.9));
const lemon = (x: number, y: number, r: number): Svg => all(circle(x, y, r, '#f6dc5a', C.ink, 1.5), circle(x, y, r * 0.72, '#fbf0a8', null), line(`M${x - r * 0.6} ${y} L${x + r * 0.6} ${y} M${x} ${y - r * 0.6} L${x} ${y + r * 0.6}`, '#e6c53a', 1));
const flame = (x: number, y: number, s = 1): Svg => at(x, y, s, path('M0 -14 C8 -6 9 2 5 7 C3 10 -3 10 -5 7 C-9 2 -6 -4 -3 -7 C-2 -3 0 -3 0 -14 Z', C.orange, C.ink, 1.4), path('M0 -3 C3 0 3 5 0 7 C-3 5 -3 0 0 -3 Z', C.yellow, null));
type Look = { top?: string; hair?: string; long?: boolean; face?: 'smile' | 'flat' | 'yuck' | 'o'; blind?: boolean; apron?: string };
/** Head and shoulders; (x, y) = centre of the head, the bust ends at y + 32·s. */
function bust(x: number, y: number, s: number, o: Look = {}): Svg {
  const hair = o.hair ?? C.hair;
  const mouth = o.face === 'flat' ? line('M-4 6 L4 6', C.ink, 1.6) : o.face === 'yuck' ? all(line('M-6 7 L-3 5 L0 7 L3 5 L6 7', C.ink, 1.7), path('M-2.4 7 L2.4 7 L2 11 C1 13 -1 13 -2 11 Z', C.pink, C.ink, 1)) : o.face === 'o' ? ellipse(0, 6.5, 2.4, 3, C.ink, null) : line('M-4.5 5 C-2 8.4 2 8.4 4.5 5', C.ink, 1.6);
  const eyes = o.blind ? all(rect(-13.6, -5.5, 27.2, 8, C.navy, 2, C.ink, 1.3), line('M13 -3 L19 -7 M13 0 L19 3', C.navy, 2.4)) : o.face === 'yuck' ? line('M-7.5 -3 L-3 -1 M7.5 -3 L3 -1', C.ink, 1.8) : all(circle(-4.6, -1.6, 1.5, C.ink, null), circle(4.6, -1.6, 1.5, C.ink, null));
  return at(x, y, s, o.long ? path('M-14 -2 C-17 12 -15 20 -12 24 L12 24 C15 20 17 12 14 -2 Z', hair, C.ink, 1.5) : '', path('M-22 32 C-22 18 -12 14 0 14 C12 14 22 18 22 32 Z', o.top ?? C.denim, C.ink, 2),
    o.apron ? path('M-9 32 L-9 19 L9 19 L9 32 Z', o.apron, C.ink, 1.5) : '', rect(-3.6, 9, 7.2, 7, C.skin, 0, null), circle(0, 0, 13, C.skin, C.ink, 2), path('M-13 -2 C-15 -18 15 -18 13 -2 C8 -9 -8 -9 -13 -2 Z', hair, C.ink, 1.5), eyes, mouth);
}
const arm = (a: [number, number], b: [number, number], col: string, mid?: [number, number]): Svg => {
  const d = mid ? `M${a[0]} ${a[1]} Q${mid[0]} ${mid[1]} ${b[0]} ${b[1]}` : `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
  return all(line(d, C.ink, 9), line(d, col, 6), circle(b[0], b[1], 4.6, C.skin, C.ink, 1.5));
};

// ── 4751 Kaffebryggning ──
const kettle = (x: number, y: number, deg: number): Svg => turn(x, y, deg, line('M12 2 C24 0 26 -10 34 -12', C.ink, 6), line('M12 2 C24 0 26 -10 34 -12', C.silver, 3.2), path('M-14 10 L-11 -10 L11 -10 L14 10 Z', C.silver, C.ink, 2), rect(-9, -14, 18, 5, C.dark, 2, C.ink, 1.4), line('M-12 -6 C-24 -6 -24 8 -14 8', C.ink, 3.4));
const dripper = (x: number, y: number): Svg => all(path(`M${x - 26} ${y - 4} L${x + 26} ${y - 4} L${x + 9} ${y + 22} L${x - 9} ${y + 22} Z`, '#fff6e6', C.ink, 1.6), path(`M${x - 23} ${y} L${x + 23} ${y} L${x + 8} ${y + 24} L${x - 8} ${y + 24} Z`, C.white, C.ink, 2), ellipse(x, y, 23, 5, COFFEE, C.ink, 1.6), rect(x - 16, y + 24, 32, 4, C.white, 2, C.ink, 1.6));
const carafe = (x: number, y: number, liq: number): Svg => all(path(`M${x - 13} ${y - 34} L${x + 13} ${y - 34} L${x + 20} ${y} L${x - 20} ${y} Z`, GLASS, C.ink, 2), path(`M${x - 13 - 7 * (1 - liq)} ${y - 34 * liq} L${x + 13 + 7 * (1 - liq)} ${y - 34 * liq} L${x + 19} ${y - 1} L${x - 19} ${y - 1} Z`, COFFEE, null));
const M1: Record<string, Svg> = {
  // brygga: pour hot water by hand over the coffee in the filter – the coffee drips down into the pot
  'foodh.brygga-verb': all(table(104), carafe(60, 104, 0.45), dripper(60, 44), kettle(22, 22, 14), waPulse('fh-bryg1', line('M56 14 C62 16 61 28 60 40', C.sky, 3.4)),
    moving('fh-bryg2', '0%{transform:translate(0,-10px);opacity:0}30%{opacity:1}100%{transform:translate(0,8px);opacity:1}', { dur: 1.3 }, ellipse(60, 78, 2.4, 3.4, COFFEE, null)), steam('fh-bryg3', 94, 40)),
  // kaffeböna: roasted coffee beans, big
  'foodh.kaffeböna': all(bean(46, 50, -24, 4.6), bean(90, 84, 30, 2.6), bean(26, 96, 70, 2), bean(100, 34, -60, 1.8, '#8a5a34')),
  // mörkrostad: the darkest end of the roast scale – three heaps of beans from light to dark, the dark one marked
  'foodh.mörkrostad': all(...['#dcb682', '#8a5a34', DARK].map((c, i) => all(rect(8 + i * 35, 92, 34, 14, c, 2, C.ink, 1.6), bean(18 + i * 35, 78, -20, 1.5, c), bean(33 + i * 35, 80, 30, 1.5, c), bean(25 + i * 35, 66, 10, 1.5, c))),
    bean(95, 38, -24, 2.6, DARK), sparkle(112, 22, 4, C.white), waPulse('fh-mork', rect(76, 16, 40, 92, 'none', 8, HL, 3.4)), path('M95 4 L88 13 L102 13 Z', HL, C.ink, 1.3), line('M12 112 L60 112', C.grey, 2.4), path('M70 112 L60 107 L60 117 Z', C.grey, C.grey, 1)),
  // kaffekvarn: hand grinder with a crank, beans on top and a drawer for the ground coffee
  'foodh.kaffekvarn': all(table(104), rect(30, 58, 60, 46, C.brown, 4, C.ink, 2.2), rect(42, 78, 36, 18, C.tan, 2, C.ink, 1.8), circle(60, 87, 2.6, C.gold, C.ink, 1.2), path('M34 58 C34 40 86 40 86 58 Z', C.silver, C.ink, 2),
    bean(50, 50, 20, 0.9), bean(62, 47, -30, 0.9), bean(72, 52, 60, 0.9), line('M60 40 L60 26 L96 20', C.ink, 4.4), line('M60 40 L60 26 L96 20', C.silver, 2), circle(98, 19, 6, HL, C.ink, 1.8), rect(55, 36, 10, 6, C.dark, 2, C.ink, 1.4)),
  // kaffefilter: the paper bag for the ground coffee – one open, a pack behind
  'foodh.kaffefilter': all(turn(88, 58, 10, path('M-22 -30 L22 -30 L10 30 L-10 30 Z', '#efe3ca', C.ink, 1.6)),
    path('M12 30 L84 30 L62 100 L34 100 Z', '#f6ecd6', C.ink, 2.2), ellipse(48, 30, 36, 8, '#fffaf0', C.ink, 2), line('M34 100 L62 100 M79 44 L60 100', '#b79d6d', 2.6, '3 3'), line('M20 38 L36 92', '#e2d3b0', 1.4)),
  // bryggkaffe: plain filter coffee – the pot from the coffee machine and a full mug
  'foodh.bryggkaffe': all(table(100), rect(8, 92, 60, 8, C.dark, 3, C.ink, 1.8), path('M18 46 L58 46 L62 92 L14 92 Z', GLASS, C.ink, 2.2), path('M16.4 64 L59.6 64 L61.5 91 L14.5 91 Z', COFFEE, null), rect(16, 40, 44, 7, C.dark, 3, C.ink, 1.8),
    line('M60 52 C76 52 76 82 62 82', C.ink, 5.4), line('M60 52 C76 52 76 82 62 82', C.dark, 2.6), cup(94, 74, 1.05, COFFEE, C.sky), steam('fh-bk', 94, 66)),
  // pressobryggare: glass pot where you press the metal filter down through the coffee
  'foodh.pressobryggare': all(table(104), rect(38, 38, 44, 66, GLASS, 4, C.ink, 2.2), rect(40, 62, 40, 40, COFFEE, 2, null), line('M82 50 C100 50 100 92 82 92', C.ink, 5.4), line('M82 50 C100 50 100 92 82 92', C.dark, 2.6),
    rect(36, 34, 48, 7, C.dark, 3, C.ink, 1.8), moving('fh-press', '0%,15%{transform:translate(0,-26px)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, line('M60 12 L60 78', C.ink, 4.4), line('M60 12 L60 78', C.silver, 2), circle(60, 10, 6, HL, C.ink, 1.8), rect(41, 76, 38, 5, C.silver, 2, C.ink, 1.5)),
    line('M36 100 L84 100', C.dark, 3)),
  // espresso: a small strong coffee straight from the machine
  'foodh.espresso': all(rect(10, 6, 100, 30, C.silver, 5, C.ink, 2.2), circle(26, 20, 5, C.dark, C.ink, 1.4), circle(94, 20, 5, C.red, C.ink, 1.4), rect(40, 36, 40, 10, C.dark, 2, C.ink, 1.8), line('M80 41 L108 46', C.ink, 6), line('M80 41 L108 46', C.dark, 3.4),
    path('M52 46 L50 54 M68 46 L70 54', 'none', C.ink, 3), waPulse('fh-esp', line('M51 56 L55 78 M69 56 L65 78', COFFEE, 2.4)), table(100), saucer(60, 100, 26), at(60, 80, 0.9, line('M12 5 C22 5 22 15 10 15', C.ink, 4.4), path('M-14 0 L14 0 L10 16 C9 20 -9 20 -10 16 Z', C.white, C.ink, 2), ellipse(0, 0, 14, 4, CREMA, C.ink, 1.8))),
  // malningsgrad: how fine the coffee is ground – from coarse to fine on the dial
  'foodh.malningsgrad': all(...[0, 1, 2].map((i) => all(circle(22 + i * 38, 42, 17, C.white, i === 1 ? HL : C.ink, i === 1 ? 3 : 2),
    ...[[-7, -5], [5, -7], [-2, 3], [8, 4], [-9, 6], [2, -2], [0, 10], [-5, -11], [10, -2]].slice(0, [4, 7, 9][i]).map(([a, b]) => circle(22 + i * 38 + a! * [1, 1, 1.05][i]!, 42 + b! * [1, 1, 1.05][i]!, [4.6, 2.6, 1.2][i]!, COFFEE, null)))),
    line('M14 82 L106 82', C.ink, 5), line('M14 82 L106 82', C.grey2, 2.6), line('M22 76 L22 88 M60 76 L60 88 M98 76 L98 88', C.ink, 1.8), moving('fh-mal', '0%,10%{transform:translate(-38px,0)}45%,55%{transform:translate(0,0)}90%,100%{transform:translate(38px,0)}', { dur: 4 }, circle(60, 82, 7.5, HL, C.ink, 2)),
    bean(22, 104, 0, 1.3), heap(98, 110, 22, 9, COFFEE, null), arrow(40, 104, 78, 104, C.grey, 2.6)),
  // mjölkskum: whipped warm milk – the thick white foam on top of the coffee
  'foodh.mjölkskum': all(table(102), path('M30 44 L78 44 L72 102 L36 102 Z', GLASS, C.ink, 2.2), path('M32.4 62 L75.8 62 L71.6 100 L36.4 100 Z', '#a8744a', null), path('M30 62 C28 34 44 30 54 34 C64 28 82 36 78 62 Z', C.white, C.ink, 2.2),
    bubbles([[42, 48, 3], [52, 42, 2.2], [62, 50, 3.2], [70, 44, 2], [48, 56, 2], [58, 58, 1.8]]), sparkle(86, 30, 6, HL), line('M90 52 L80 50', HL, 3), path('M80 50 L86 46 L86 55 Z', HL, HL, 1),
    path('M92 74 L112 74 L109 102 L95 102 Z', C.silver, C.ink, 2), path('M92 74 L86 70 L94 78 Z', C.silver, C.ink, 1.6), ellipse(102, 74, 10, 2.6, C.white, C.ink, 1.4)),
  // barista: the person who makes the coffee at the café
  'foodh.barista': all(rect(4, 30, 40, 56, C.silver, 5, C.ink, 2.2), circle(16, 44, 4, C.red, C.ink, 1.3), circle(30, 44, 4, C.dark, C.ink, 1.3), rect(12, 60, 24, 7, C.dark, 2, C.ink, 1.6), line('M24 67 L24 74', COFFEE, 2.4),
    bust(76, 34, 1.5, { top: C.white, apron: '#5a3d2b', hair: '#3b2f2f', long: true, face: 'smile' }), rect(0, 86, 120, 34, C.brown, 0, C.ink, 2.2), line('M0 92 L120 92', '#7a4a2a', 1.4),
    arm([54, 70], [44, 80], C.white, [46, 68]), at(36, 74, 0.6, line('M-12 5 C-22 5 -22 15 -10 15', C.ink, 4.4), path('M-14 0 L14 0 L10 16 C9 20 -9 20 -10 16 Z', C.white, C.ink, 2), ellipse(0, 0, 14, 4, CREMA, C.ink, 1.8)), cup(100, 70, 0.6, CREMA), saucer(100, 86, 13)),
};

// ── 4752 Te och tesorter ──
const tin = (x: number, y: number, w: number, h: number, col: string, leaf: string): Svg => all(rect(x - w / 2, y - h, w, h, col, 3, C.ink, 2), ellipse(x, y - h, w / 2, 5, leaf, C.ink, 1.8), line(`M${x - w / 2 + 4} ${y - h * 0.45} L${x + w / 2 - 4} ${y - h * 0.45}`, C.white, 1.6));
const yunomi = (x: number, y: number, s: number, liq: string, col = '#7f9aa8'): Svg => at(x, y, s, path('M-13 0 L13 0 L10 22 C9 25 -9 25 -10 22 Z', col, C.ink, 2), ellipse(0, 0, 13, 4, liq, C.ink, 1.8), line('M-9 12 C-3 9 3 15 9 12', C.white, 1.4));
const teapot = (x: number, y: number, s: number, col: string): Svg => at(x, y, s, line('M-24 -4 C-42 -8 -42 18 -24 14', C.ink, 6), line('M-24 -4 C-42 -8 -42 18 -24 14', col, 3), path('M22 4 C32 2 34 -10 44 -12 L46 -6 C38 -2 38 12 26 14 Z', col, C.ink, 2), path('M-26 6 C-26 -16 26 -16 26 6 C26 24 -26 24 -26 6 Z', col, C.ink, 2.2),
  path('M-13 -11 C-8 -17 8 -17 13 -11 Z', col, C.ink, 1.8), circle(0, -18, 3.4, col, C.ink, 1.6), line('M-16 12 C-6 17 6 17 16 12', C.white, 1.6));
const strainer = (x: number, y: number, s: number, deg = 0): Svg => turn(x, y, deg, g(`scale(${s})`, line('M12 0 L40 0', C.ink, 5), line('M12 0 L40 0', C.silver, 2.6), path('M-13 0 C-12 14 12 14 13 0 Z', C.grey2, C.ink, 1.8), line('M-8 4 L8 4 M-5 8 L5 8 M-6 0 L-3 11 M0 0 L0 12 M6 0 L3 11', C.ink, 0.8), ellipse(0, 0, 13, 3.4, C.silver, C.ink, 1.8)));
const M2: Record<string, Svg> = {
  // tesort: a kind of tea – three tins with three different teas
  'foodh.tesort': all(table(100), tin(22, 100, 30, 40, C.navy, LEAF_B), tin(60, 100, 30, 40, C.green, '#6fb04a'), tin(98, 100, 30, 40, '#b0473a', '#c9824a'),
    waPulse('fh-sort', path('M10 44 L10 36 L110 36 L110 44', 'none', HL, 3), line('M60 36 L60 28', HL, 3)), at(22, 20, 0.45, cup(0, 0, 1, TEA_B)), at(60, 12, 0.45, cup(0, 0, 1, TEA_G)), at(98, 20, 0.45, cup(0, 0, 1, '#e9a43c')),
    tleaf(22, 78, 30, 0.7, LEAF_B), tleaf(60, 78, -20, 0.7, '#6fb04a'), circle(98, 78, 4.4, C.yellow, C.ink, 1.1), circle(98, 78, 1.6, C.orange, null)),
  // svart te: the dark leaves and the reddish-brown drink
  'foodh.svart-te': all(table(96), path('M20 40 L76 40 L70 96 L26 96 Z', GLASS, C.ink, 2.2), path('M22 48 L74 48 L69 94 L27 94 Z', TEA_B, null), line('M76 52 C94 52 94 84 72 84', C.ink, 5), line('M76 52 C94 52 94 84 72 84', GLASS, 2.4), steam('fh-svart', 48, 34),
    heap(98, 112, 34, 12, LEAF_B, '#6b5248'), line('M88 108 l5 -3 M100 106 l5 2 M94 102 l4 -2', '#1e1512', 2)),
  // grönt te: green leaves and a pale green drink in a cup without a handle
  'foodh.grönt-te': all(table(96), yunomi(46, 44, 2.1, TEA_G), steam('fh-gron', 46, 36), tleaf(94, 100, 60, 1, LEAF_G), tleaf(104, 86, 20, 0.85, '#6fb04a'), tleaf(86, 84, -40, 0.8, LEAF_G)),
  // matcha: the bright green powder, whisked in a bowl with a bamboo whisk
  'foodh.matcha-noun': all(table(100), path('M12 60 L76 60 C76 86 66 100 44 100 C22 100 12 86 12 60 Z', '#3d3a44', C.ink, 2.2), ellipse(44, 60, 32, 9, '#7fb23a', C.ink, 2), bubbles([[34, 59, 2.4], [44, 62, 2], [54, 58, 2.6], [40, 56, 1.6]], '#b5d977'),
    turn(84, 40, 20, rect(-4, -34, 8, 22, '#e6d3a0', 2, C.ink, 1.6), path('M-4 -12 L4 -12 L11 22 C6 26 -6 26 -11 22 Z', '#eedfae', C.ink, 1.6), line('M-6 -6 L-8 22 M-2 -8 L-3 24 M2 -8 L3 24 M6 -6 L8 22', C.ink, 0.9)),
    heap(100, 112, 26, 10, '#7fb23a', null), line('M70 110 L92 104', '#c9b071', 4)),
  // teblad: fresh leaves on a twig of the tea bush
  'foodh.teblad': all(line('M20 106 C40 86 60 66 74 30', C.brown, 4), tleaf(50, 60, -62, 2.2, LEAF_G), tleaf(82, 66, 58, 2.2, '#5fae54'), tleaf(40, 34, -30, 1.7, '#6fb04a'), tleaf(92, 32, 40, 1.6, LEAF_G), tleaf(74, 16, 8, 1.1, '#9ccf6a')),
  // löste: loose leaves in a tin, taken with a scoop – no bags
  'foodh.löste': all(table(98), rect(12, 46, 56, 52, C.navy, 4, C.ink, 2.2), ellipse(40, 46, 28, 8, LEAF_B, C.ink, 2), line('M26 44 l5 -3 M40 46 l5 2 M50 42 l4 -2 M34 49 l4 1', '#7a6156', 2), turn(92, 42, -24, ellipse(0, 0, 20, 6, C.navy, C.ink, 2), ellipse(0, -2, 15, 3.6, '#4a66a0', null)),
    turn(84, 80, -18, line('M10 0 L34 0', C.ink, 6), line('M10 0 L34 0', '#c9a36a', 3.2), path('M-16 -6 L10 -6 L10 6 L-16 6 C-20 3 -20 -3 -16 -6 Z', '#c9a36a', C.ink, 1.8), path('M-14 -6 C-8 -14 2 -14 8 -6 Z', LEAF_B, C.ink, 1.4)),
    line('M66 108 l5 -2 M78 104 l4 3 M88 110 l5 -1', LEAF_B, 2.4)),
  // tepåse: the little bag of tea with a string and a tag
  'foodh.tepåse': all(table(100), cup(48, 62, 1.6, TEA_B), line('M52 62 C54 40 70 30 86 24', C.ink, 1.6), rect(82, 14, 20, 18, C.yellow, 2, C.ink, 1.8), circle(92, 23, 4, HL, null),
    moving('fh-pase', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-9px)}', { dur: 2.4 }, path('M40 44 L56 44 L59 64 L37 64 Z', '#f3ead2', C.ink, 1.8), path('M40 44 L48 38 L56 44 Z', '#f3ead2', C.ink, 1.6), line('M42 54 l3 -2 M50 58 l3 1 M46 50 l3 1', '#8a6a4a', 1.4))),
  // tekanna: the pot you brew and serve tea in
  'foodh.tekanna': all(table(98), teapot(58, 68, 1.15, '#3f8fa8'), steam('fh-kanna', 108, 44, 0.8)),
  // tesil: the small strainer that catches the leaves when you pour
  'foodh.tesil': all(table(102), cup(44, 70, 1.3, TEA_B), strainer(44, 54, 1.4), tleaf(40, 55, 80, 0.5, LEAF_B), tleaf(48, 56, 100, 0.5, LEAF_B), sparkle(98, 46, 5, HL),
    at(66, 18, 0.62, teapot(0, 0, 1, C.grey2)), turn(0, 0, 0, waPulse('fh-sil', line('M40 22 C40 32 43 40 44 50', TEA_B, 3), line('M44 62 L44 68', TEA_B, 2.4)))),
  // bryggtid: how long the tea stays in the water – the clock decides
  'foodh.bryggtid': all(table(100), path('M10 52 L52 52 L48 100 L14 100 Z', GLASS, C.ink, 2.2), path('M11.6 62 L50.6 62 L47.6 98 L14.4 98 Z', TEA_G, null), tleaf(26, 86, 40, 0.6, LEAF_G), tleaf(36, 78, -30, 0.6, LEAF_G), tleaf(30, 92, 100, 0.5, LEAF_G),
    clockPie(84, 44, 30, 0.25, HL), line('M84 44 L84 20', C.ink, 2.6), moving('fh-tid', '0%{transform:rotate(-90deg)}80%,100%{transform:rotate(0deg)}', { dur: 3.2 }, `<g style="transform-origin:84px 44px">${line('M84 44 L106 44', C.ink, 2.6)}</g>`),
    rect(78, 8, 12, 6, C.dark, 2, C.ink, 1.4), num(84, 100, '3', 22, HL), line('M56 70 C62 66 62 60 66 58', C.grey, 2.2, '3 3')),
  // smaksätta: give the tea a taste – lemon peel, flowers and berries go into the leaves
  'foodh.smaksätta': all(table(100), path('M22 64 L98 64 C98 88 86 100 60 100 C34 100 22 88 22 64 Z', C.sky, C.ink, 2.2), ellipse(60, 64, 38, 10, LEAF_B, C.ink, 2), line('M44 62 l5 -3 M62 66 l5 2 M76 60 l4 -2', '#7a6156', 2),
    waIn('fh-sm1', -6, -34, lemon(42, 46, 9)), waIn('fh-sm2', 0, -40, at(64, 40, 1, circle(0, -5, 3.6, C.pink, C.ink, 1), circle(5, 0, 3.6, C.pink, C.ink, 1), circle(-5, 0, 3.6, C.pink, C.ink, 1), circle(0, 5, 3.6, C.pink, C.ink, 1), circle(0, 0, 2.4, C.yellow, C.ink, 0.9))),
    waIn('fh-sm3', 6, -34, raspberry(84, 48, 1.3)), num(104, 26, '+', 22, HL)),
  // tekopp: a cup for tea, with a saucer
  'foodh.tekopp': all(table(100), saucer(56, 98, 40), at(56, 54, 1, line('M30 10 C52 10 50 36 26 34', C.ink, 6), line('M30 10 C52 10 50 36 26 34', C.white, 2.8), path('M-34 0 L34 0 C34 26 20 42 0 42 C-20 42 -34 26 -34 0 Z', C.white, C.ink, 2.2), ellipse(0, 0, 34, 8, '#d98a4a', C.ink, 2),
    ...[-16, 2, 18].map((dx) => all(circle(dx, 22, 4, C.pink, C.ink, 1), circle(dx, 22, 1.5, C.yellow, null), line(`M${dx - 7} 28 l4 -3 M${dx + 7} 28 l-4 -3`, C.green, 1.6))), line('M-26 9 C-10 15 10 15 26 9', C.gold, 1.4))),
};

// ── 4753 Brödbakning ──
const flourBag = (x: number, y: number, col: string, band: string, ear: Svg): Svg => all(path(`M${x - 20} ${y - 50} L${x + 20} ${y - 50} L${x + 22} ${y} L${x - 22} ${y} Z`, col, C.ink, 2.2), path(`M${x - 20} ${y - 50} L${x - 14} ${y - 60} L${x + 14} ${y - 60} L${x + 20} ${y - 50} Z`, col, C.ink, 2), rect(x - 21, y - 34, 42, 22, band, 0, C.ink, 1.4), ear);
/** Ear of grain, pointing up from (x, y); `awn` = long bristles (rye). */
const ear = (x: number, y: number, s: number, col: string, awn = false): Svg => at(x, y, s, line('M0 14 L0 -12', col, 1.8), ...[-10, -5, 0, 5].map((d) => all(ellipse(-3.4, d, 2.6, 3.6, col, C.ink, 0.9), ellipse(3.4, d, 2.6, 3.6, col, C.ink, 0.9))), ellipse(0, -14, 2.6, 3.8, col, C.ink, 0.9),
  awn ? line('M-4 -10 L-9 -24 M4 -10 L9 -24 M0 -16 L0 -30 M-4 -4 L-11 -16 M4 -4 L11 -16', C.ink, 0.9) : '');
const fridge = (...inside: Svg[]): Svg => all(rect(14, 6, 70, 104, C.white, 6, C.ink, 2.2), rect(20, 12, 58, 92, '#d6ecf5', 3, C.ink, 1.6), line('M20 44 L78 44 M20 76 L78 76', C.ink, 1.6), ...inside, path('M84 8 L104 2 L104 106 L84 108 Z', C.white, C.ink, 2.2), line('M99 44 L99 66', C.grey, 3));
const snow = (x: number, y: number, r: number, col: string = '#3f8fd0'): Svg => line([0, 60, 120].map((a) => `M${(x - r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(y - r * Math.sin((a * Math.PI) / 180)).toFixed(1)} L${(x + r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(y + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' '), col, 2);
const moon = (x: number, y: number, r: number): Svg => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r} ${y + r * 0.4} A${r * 0.8} ${r * 0.8} 0 0 1 ${x + r * 0.3} ${y - r} Z`, C.yellow, C.ink, 1.5);
const HOLES: [number, number, number][] = [[-8, -8, 4.4], [6, -10, 3.4], [9, 2, 4.8], [-4, 4, 3], [-10, 11, 2.6], [2, 12, 3.6], [0, -3, 2]];
const M3: Record<string, Svg> = {
  // mata (surdegen): give the starter in the jar new flour and water
  'foodh.mata.3': all(table(104), jarBody(44, 104, 48, 60), jarFill(44, 104, 48, 34, '#e9d9b0'), bubbles([[32, 84, 3.4], [44, 78, 2.6], [54, 88, 3.8], [38, 94, 2.2], [50, 96, 2.6]], '#f6ecd0'), line('M20 70 L68 70', C.red, 2),
    waIn('fh-mata1', 0, -22, heap(44, 70, 22, 8, FLOUR, null)), turn(78, 26, -28, line('M8 0 L34 0', C.ink, 5.4), line('M8 0 L34 0', '#c9a36a', 2.8), ellipse(-4, 0, 13, 7, '#c9a36a', C.ink, 1.8), ellipse(-4, -2, 9, 4, FLOUR, C.ink, 1)),
    moving('fh-mata2', '0%{transform:translate(0,-12px);opacity:0}40%,100%{transform:translate(0,6px);opacity:1}', { dur: 1.6 }, circle(56, 44, 1.6, FLOUR, C.ink, 0.6), circle(50, 52, 1.6, FLOUR, C.ink, 0.6), circle(60, 54, 1.4, FLOUR, C.ink, 0.6)),
    at(98, 86, 1, path('M-10 -16 L10 -16 L8 18 L-8 18 Z', GLASS, C.ink, 1.8), path('M-9.4 -4 L9.4 -4 L8 17 L-8 17 Z', C.sky, null)), num(100, 56, '+', 20, HL)),
  // vetemjöl: white flour from wheat
  'foodh.vetemjöl': all(table(102), flourBag(40, 102, C.white, '#f2d98a', ear(40, 79, 0.62, C.gold)), heap(92, 110, 44, 16, FLOUR, null), ear(84, 62, 1.5, C.gold), ear(102, 68, 1.2, C.gold), line('M84 84 L88 100 M102 86 L98 100', C.gold, 2)),
  // rågmjöl: dark flour from rye – the ear with long bristles and the dark bread
  'foodh.rågmjöl': all(table(102), flourBag(34, 102, '#b9a58c', '#8a6a4a', ear(34, 79, 0.62, '#e9dcc2', true)), heap(76, 110, 34, 14, '#a8927a', '#6b5a48'), ear(74, 56, 1.4, '#9c8a5a', true), line('M74 76 L76 98', '#9c8a5a', 2),
    at(100, 92, 0.62, slice(0, 0, 1, '#4a3323', '#6f4f38'))),
  // degskrapa: the flat scraper that divides and lifts the dough
  'foodh.degskrapa': all(table(88), ellipse(60, 92, 50, 9, FLOUR, null), path('M12 92 C12 70 40 66 56 70 L56 92 Z', DOUGH, C.ink, 2), path('M66 92 L66 72 C82 66 108 72 108 92 Z', DOUGH, C.ink, 2),
    moving('fh-skrapa', '0%,15%{transform:translate(0,-22px)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(52, 26, 18, 66, C.silver, 2, C.ink, 2), rect(46, 14, 30, 14, HL, 5, C.ink, 2), line('M56 40 L56 84', C.white, 1.6))),
  // jäskorg: the cane basket where the loaf rises
  'foodh.jäskorg': all(table(100), path('M10 52 L110 52 C108 82 92 100 60 100 C28 100 12 82 10 52 Z', '#d9b47a', C.ink, 2.2), line('M13 62 C40 70 80 70 107 62 M17 73 C42 81 78 81 103 73 M24 84 C46 91 74 91 96 84 M36 94 C50 98 70 98 84 94', '#9a7240', 2),
    path('M16 52 C18 30 102 30 104 52 Z', DOUGH, C.ink, 2.2), ellipse(60, 52, 50, 8, '#c9a36a', C.ink, 2), path('M17 52 C20 34 100 34 103 52 C90 46 30 46 17 52 Z', DOUGH, null), line('M40 42 C52 38 68 38 80 42', FLOUR, 2.4)),
  // kalljäsa: rise slowly in the fridge overnight
  'foodh.kalljäsa': all(fridge(snow(30, 24, 6), snow(68, 28, 5), bowl(49, 60, 40, C.sky, C.sky), moving('fh-kall', '0%{transform:scale(1,.45)}70%,100%{transform:scale(1,1)}', { dur: 3.4 }, `<g style="transform-origin:49px 60px">${path('M30 60 C32 42 66 42 68 60 Z', DOUGH, C.ink, 2)}</g>`), rect(28, 86, 20, 14, C.yellow, 2, C.ink, 1.4), circle(64, 92, 7, C.green, C.ink, 1.4)),
    moon(104, 20, 9), waPulse('fh-kall2', sparkle(92, 36, 3.4, C.gold), sparkle(112, 40, 2.6, C.gold))),
  // snitta: cut the top of the loaf with a blade before baking
  'foodh.snitta': all(table(92), ellipse(60, 94, 54, 8, FLOUR, null), path('M10 92 C8 56 40 44 60 44 C80 44 112 56 110 92 Z', DOUGH, C.ink, 2.2), line('M30 78 C44 62 62 56 86 60', HL, 4), line('M30 78 C44 62 62 56 86 60', '#fff3d6', 1.4),
    moving('fh-snitt', '0%,10%{transform:translate(-50px,16px)}70%,100%{transform:translate(0,0)}', { dur: 2.6 }, turn(92, 50, -38, line('M0 -4 L0 -34', C.ink, 6), line('M0 -4 L0 -34', '#c9a36a', 3.2), rect(-5, -6, 10, 18, C.silver, 1, C.ink, 1.6), line('M0 -2 L0 8', C.ink, 1)))),
  // surdegsbröd: the baked round loaf with its cut and a slice full of holes
  'foodh.surdegsbröd': all(table(98), boule(48, 98, 1.75), at(98, 80, 0.85, slice(0, 0, 1, CRUST, CRUMB, HOLES))),
  // skorpa (på bröd): the hard outside – it cracks and flakes
  'foodh.skorpa.2': all(table(100), faded(path('M22 100 L22 58 C22 36 98 36 98 58 L98 100 Z', CRUMB, null)), path('M12 100 L12 56 C12 22 108 22 108 56 L108 100 L98 100 L98 58 C98 36 22 36 22 58 L22 100 Z', '#a8621f', C.ink, 2.4),
    line('M30 34 L36 40 L32 46 M60 26 L58 33 L64 37 M88 32 L84 40 L90 44 M14 70 L20 74 M106 76 L100 80', C.ink, 1.6), waShake('fh-skorpa', path('M56 8 L66 6 L70 14 L60 16 Z', '#a8621f', C.ink, 1.6), path('M86 10 L94 14 L90 20 L82 16 Z', '#a8621f', C.ink, 1.6), path('M30 12 L38 10 L38 18 L32 20 Z', '#a8621f', C.ink, 1.6)),
    arrow(60, 76, 60, 44, HL, 3.4)),
  // inkråm: the soft inside of the bread – fingers pinch a piece from the middle of the slice
  'foodh.inkråm': all(slice(52, 66, 2.1, '#b9b3aa', CRUMB, HOLES), circle(52, 62, 15, 'none', HL, 3), line('M52 62 C60 50 72 40 82 34', '#f5e3bd', 9), path('M76 24 C82 18 94 22 92 32 C90 40 80 42 76 36 Z', CRUMB, C.ink, 1.6),
    path('M84 14 C96 8 112 14 114 26 L100 30 C98 24 92 22 86 24 Z', C.skin, C.ink, 1.8), path('M94 36 C102 34 112 36 116 44 L104 50 C100 44 96 42 90 42 Z', C.skin, C.ink, 1.8)),
  // luftig (om bröd): big holes full of air, so the slice is light – the dense grey slice with tiny holes is heavy and sinks on the scales
  'foodh.luftig.3': all(rect(56, 40, 8, 66, C.grey, 2, C.ink, 1.8), rect(40, 104, 40, 8, C.grey, 3, C.ink, 1.8), line('M18 62 L102 30', C.ink, 5), line('M18 62 L102 30', C.grey2, 2.4), circle(60, 46, 4, C.dark, C.ink, 1.4),
    line('M18 62 L8 96 M18 62 L38 96 M102 30 L86 64 M102 30 L116 64', C.ink, 1.4), path('M4 96 L42 96 C40 104 6 104 4 96 Z', C.grey2, C.ink, 1.6), path('M82 64 L120 64 C118 72 84 72 82 64 Z', C.grey2, C.ink, 1.6),
    at(23, 80, 0.62, slice(0, 0, 1, '#8d8a86', '#c9c5be', [[-8, -6, 1.4], [5, -8, 1.2], [8, 4, 1.4], [-3, 6, 1.2], [0, -1, 1]])),
    waBob('fh-luft', 3, at(92, 40, 0.95, slice(0, 0, 1, CRUST, CRUMB, [[-8, -8, 5.6], [7, -9, 4.6], [8, 5, 5.8], [-6, 6, 4.4], [1, -1, 2.4]])), circle(92, 38, 25, 'none', HL, 3)), line('M52 22 L48 12 M44 28 L36 22', HL, 2.4)),
  // bageri: the shop that bakes and sells bread – with the golden pretzel sign
  'foodh.bageri': all(rect(6, 26, 108, 86, '#f1e2c4', 3, C.ink, 2.2), path('M2 26 L118 26 L112 44 L8 44 Z', C.red, C.ink, 2), line('M30 26 L28 44 M56 26 L56 44 M84 26 L88 44', C.white, 3), rect(14, 52, 58, 40, '#d6ecf5', 3, C.ink, 2), rect(82, 52, 24, 60, C.brown, 2, C.ink, 2), circle(87, 84, 1.8, C.gold, null),
    at(28, 84, 0.42, boule(0, 0, 1)), at(52, 84, 0.42, boule(0, 0, 1, '#8a5a2b')), rect(18, 60, 22, 7, CRUST, 3.5, C.ink, 1.4), rect(44, 60, 22, 7, '#d9a05a', 3.5, C.ink, 1.4), rect(14, 84, 58, 8, C.tan, 0, C.ink, 1.6),
    at(60, 13, 1, path('M0 9 C-16 9 -16 -9 -4 -9 C4 -9 6 0 10 9 M0 9 C16 9 16 -9 4 -9 C-4 -9 -6 0 -10 9', 'none', C.ink, 6.4), path('M0 9 C-16 9 -16 -9 -4 -9 C4 -9 6 0 10 9 M0 9 C16 9 16 -9 4 -9 C-4 -9 -6 0 -10 9', 'none', C.gold, 3.6))),
};

// ── 4754 Matfotografering ──
const pasta = (x: number, y: number, r: number): Svg => all(plate(x, y, r), circle(x, y, r * 0.5, '#f2d98a', C.ink, 1.4), line(`M${x - r * 0.3} ${y - r * 0.1} c4 -6 10 4 14 -2 M${x - r * 0.3} ${y + r * 0.15} c5 5 9 -5 14 0`, '#c9a23a', 1.4), circle(x - r * 0.12, y - r * 0.12, r * 0.13, C.red, C.ink, 1), tleaf(x + r * 0.15, y + r * 0.05, 50, r * 0.03, C.green));
const cupcake = (x: number, y: number, s: number): Svg => at(x, y, s, path('M-12 0 L12 0 L9 16 L-9 16 Z', '#c98ad0', C.ink, 1.8), line('M-6 1 L-5 15 M0 1 L0 15 M6 1 L5 15', C.ink, 0.9), path('M-14 0 C-16 -10 -8 -12 -6 -16 C-2 -24 8 -22 8 -14 C16 -12 16 -2 14 0 Z', C.rose, C.ink, 1.8), circle(1, -22, 3.6, C.red, C.ink, 1.2));
const fork = (x: number, y: number, deg: number, s = 1): Svg => turn(x, y, deg, g(`scale(${s})`, line('M0 -6 L0 24', C.ink, 4.4), line('M0 -6 L0 24', C.silver, 2.2), line('M-4 -20 L-4 -8 L4 -8 L4 -20 M0 -20 L0 -8', C.ink, 1.6)));
const M4: Record<string, Svg> = {
  // matbild: a photo of food – the dish on the phone screen
  'foodh.matbild': all(table(0), faded(pasta(26, 92, 22)), turn(66, 56, 8, phone(0, 0, 62, 100, rect(-28, -45, 56, 76, C.tan, 0, null), pasta(0, -8, 22), fork(-24, -8, 0, 0.7), circle(0, 40, 6, C.white, C.ink, 1.6))), sparkle(104, 14, 5, HL)),
  // mjukt ljus: the same cake twice – hard light with sharp black shadows (grey, crossed out) and soft light through a white screen with pale, soft shadows (marked)
  'foodh.mjukt-ljus': all(faded(circle(14, 14, 7, C.yellow, C.ink, 1.6), line('M22 20 L34 40 M24 14 L44 34 M16 24 L22 44', C.ink, 1.8), rect(4, 46, 52, 62, C.white, 3, C.ink, 2), path('M30 98 L54 106 L54 96 L40 84 Z', C.black, null), path('M24 80 L34 66 L46 80 Z', C.black, null), at(26, 82, 0.95, cupcake(0, 0, 1))), cross(30, 34, 1.2),
    circle(74, 12, 7, C.yellow, C.ink, 1.6), turn(92, 22, 28, rect(-3, -18, 6, 36, C.white, 2, C.ink, 1.8)), waPulse('fh-mjukt', path('M98 14 L116 44 L72 44 L92 30 Z', '#fff3b8', null).replace('/>', ' opacity="0.8"/>')),
    rect(64, 46, 52, 62, '#fffdf4', 3, HL, 3.4), blurred(2.2, ellipse(96, 100, 16, 4.6, '#d6cfbf', null)), at(88, 82, 0.95, cupcake(0, 0, 1))),
  // kameravinkel: the direction the camera sees the dish from – from above, at an angle, from the side
  'foodh.kameravinkel': all(table(100), saucer(60, 100, 22), at(60, 84, 1, cupcake(0, 0, 1)), `<path d="M12 84 A48 48 0 0 1 60 22" fill="none" stroke="${C.grey}" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"/>`,
    faded(camera(60, 14, 90, 1.1), line('M60 28 L60 52', C.ink, 1.6, '3 3')), faded(camera(12, 84, 0, 1.1), line('M26 84 L42 84', C.ink, 1.6, '3 3')), camera(24, 40, 45, 1.3, HL), waPulse('fh-vinkel', line('M36 52 L50 66', HL, 2.6, '4 3'))),
  // oskärpa: the things behind are blurred – only the cake in front is sharp
  'foodh.oskärpa': all(blurred(2.6, rect(0, 0, 120, 78, '#dfe9ee', 0, null), rect(10, 20, 22, 56, C.green, 5, C.ink, 2), rect(16, 10, 10, 12, C.green, 2, C.ink, 2), cup(60, 46, 1.2, COFFEE, C.yellow), circle(100, 52, 20, C.orange, C.ink, 2), rect(0, 76, 120, 44, C.tan, 0, null)),
    waPulse('fh-oskarpa', `<rect x="4" y="4" width="112" height="70" rx="6" fill="none" stroke="${HL}" stroke-width="2.6" stroke-dasharray="6 5"/>`), saucer(60, 108, 24), at(60, 92, 1.15, cupcake(0, 0, 1))),
  // uppläggning: how the food is arranged on the plate
  'foodh.uppläggning': all(rect(0, 0, 120, 120, '#e9e2d4', 0, null), plate(60, 60, 50), path('M34 78 C44 92 70 94 88 80', 'none', '#b0473a', 5), circle(30, 52, 3, '#b0473a', null), circle(36, 42, 2.4, '#b0473a', null), circle(44, 34, 1.8, '#b0473a', null),
    rect(46, 46, 30, 18, '#f0a078', 6, C.ink, 1.8), line('M52 50 L70 50 M52 56 L70 56', '#d9764a', 1.4), circle(84, 52, 7, C.white, C.ink, 1.4), circle(84, 42, 5, C.white, C.ink, 1.4), tleaf(62, 40, 60, 0.8, C.green), tleaf(56, 68, -40, 0.6, C.green), lemon(74, 74, 6)),
  // styla: arrange the dish so that it looks good in the photo – the last leaf goes on with tweezers
  'foodh.styla': all(table(92), faded(camera(100, 30, 20, 1.5), line('M100 44 L92 90 M100 44 L112 90', C.ink, 2.4)), saucer(46, 92, 34), path('M22 88 C24 70 68 70 70 88 Z', '#f2d98a', C.ink, 2), circle(38, 78, 4, C.red, C.ink, 1), fork(82, 100, 78, 0.8), circle(14, 104, 1.4, C.brown, null), circle(22, 108, 1.2, C.brown, null), circle(92, 108, 1.4, C.brown, null),
    moving('fh-styla', '0%,12%{transform:translate(6px,-22px)}65%,100%{transform:translate(0,0)}', { dur: 2.6 }, tleaf(50, 68, 70, 0.8, C.green), line('M54 64 L74 34 M56 68 L80 40', C.ink, 3.4), line('M54 64 L74 34 M56 68 L80 40', C.silver, 1.6), path('M70 26 C78 16 96 20 96 32 C96 42 84 46 76 42 Z', C.skin, C.ink, 1.8)), sparkle(18, 62, 5, HL)),
  // matblogg: a blog about food – pictures of dishes, recipes and comments on the screen
  'foodh.matblogg': all(rect(12, 14, 96, 68, C.dark, 5, C.ink, 2.2), rect(17, 19, 86, 58, C.white, 2, null), rect(17, 19, 86, 10, HL, 2, null), at(25, 24, 0.22, fork(0, 0, 0)), line('M34 24 L60 24', C.white, 2.4), rect(21, 33, 38, 30, C.tan, 2, C.ink, 1.2), pasta(40, 48, 12),
    line('M64 36 L98 36 M64 43 L98 43 M64 50 L90 50 M64 57 L96 57', C.grey, 2), at(26, 70, 0.4, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, null)), rect(34, 66, 14, 8, C.grey2, 3, null), path('M2 96 L118 96 L108 82 L12 82 Z', C.silver, C.ink, 2.2), line('M28 89 L92 89', C.grey, 2)),
  // kokbok: a book of recipes
  'foodh.kokbok': all(table(104), path('M26 14 L92 14 L92 104 L26 104 Z', '#b0473a', C.ink, 2.4), rect(20, 14, 10, 90, '#7a2f27', 2, C.ink, 2), line('M92 20 L98 20 L98 104 L92 104', C.white, 3), path('M70 14 L70 34 L76 28 L82 34 L82 14 Z', C.yellow, C.ink, 1.4),
    at(60, 50, 1, path('M-14 6 C-22 4 -20 -10 -10 -8 C-8 -18 8 -18 10 -8 C20 -10 22 4 14 6 L14 14 L-14 14 Z', C.white, C.ink, 1.8), line('M-14 10 L14 10', C.ink, 1.2)), fork(48, 80, -30, 0.7), turn(72, 80, 30, line('M0 -4 L0 18', C.ink, 4.4), line('M0 -4 L0 18', C.silver, 2.2), ellipse(0, -9, 4.6, 6.4, C.silver, C.ink, 1.5))),
};

// ── 4755 Fermentering ──
const shreds = (x: number, y: number, w: number, h: number, col: string = CABB): Svg => all(rect(x - w / 2, y - h, w, h, col, 3, null), line(Array.from({ length: Math.floor(h / 6) }, (_, i) => `M${x - w / 2 + 3} ${y - 3 - i * 6} c${w * 0.2} -4 ${w * 0.3} 4 ${w * 0.5} 0 s${w * 0.2} -4 ${w * 0.4} 0`).join(' '), '#9fb86a', 1.3));
const rod = (x: number, y: number, deg: number, len = 12, col: string = HL): Svg => turn(x, y, deg, rect(-len / 2, -3, len, 6, col, 3, C.ink, 1.2));
const calendar = (x: number, y: number, label: string): Svg => all(rect(x - 13, y - 12, 26, 26, C.white, 3, C.ink, 1.8), rect(x - 13, y - 12, 26, 8, C.red, 3, C.ink, 1.8), num(x, y + 11, label, 13));
const cabbage = (x: number, y: number, r: number): Svg => all(circle(x, y, r, '#d7e6a8', C.ink, 2.2), path(`M${x - r * 0.9} ${y + r * 0.2} C${x - r * 0.5} ${y - r * 0.9} ${x + r * 0.3} ${y - r * 0.9} ${x + r * 0.2} ${y + r * 0.9}`, 'none', '#8fae5a', 1.8), path(`M${x + r * 0.9} ${y - r * 0.1} C${x + r * 0.3} ${y - r * 0.7} ${x - r * 0.4} ${y - r * 0.2} ${x - r * 0.5} ${y + r * 0.8}`, 'none', '#8fae5a', 1.8),
  line(`M${x - r * 0.2} ${y + r * 0.9} C${x - r * 0.1} ${y + r * 0.2} ${x + r * 0.1} ${y - r * 0.3} ${x + r * 0.6} ${y - r * 0.6}`, '#f4f8e2', 2.2));
const chili = (x: number, y: number, deg: number, s = 1): Svg => turn(x, y, deg, g(`scale(${s})`, path('M-12 -3 C-4 -8 8 -6 14 4 C6 2 -4 4 -12 3 Z', C.red, C.ink, 1.4), line('M-12 0 L-17 -3', C.green, 2.6)));
const bottle = (x: number, y: number, col: string): Svg => all(rect(x - 9, y - 34, 18, 34, col, 4, C.ink, 1.8), rect(x - 4, y - 46, 8, 13, col, 2, C.ink, 1.8), rect(x - 5, y - 50, 10, 5, C.dark, 1, C.ink, 1.4), rect(x - 9, y - 24, 18, 12, C.white, 0, C.ink, 1.2));
const M5: Record<string, Svg> = {
  // fermentera: salt the shredded cabbage and press it down into the jar – then the bacteria do the work
  'foodh.fermentera': all(table(104), jarBody(46, 104, 56, 62), shreds(46, 102, 50, 34), moving('fh-ferm1', '0%,15%{transform:translate(0,-18px)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(38, 22, 16, 44, '#c9a36a', 4, C.ink, 2), rect(30, 62, 32, 8, '#c9a36a', 3, C.ink, 2), path('M30 14 C34 4 58 4 62 14 C64 24 56 30 46 30 C36 30 28 24 30 14 Z', C.skin, C.ink, 1.8)),
    turn(96, 34, -30, rect(-9, -14, 18, 28, C.white, 4, C.ink, 1.8), rect(-9, -18, 18, 7, C.silver, 2, C.ink, 1.6), circle(-3, -15, 0.9, C.ink, null), circle(3, -15, 0.9, C.ink, null)),
    moving('fh-ferm2', '0%{transform:translate(4px,-10px);opacity:0}50%,100%{transform:translate(0,0);opacity:1}', { dur: 1.4 }, circle(84, 54, 1.4, C.white, C.ink, 0.6), circle(80, 62, 1.4, C.white, C.ink, 0.6), circle(86, 68, 1.4, C.white, C.ink, 0.6), circle(78, 74, 1.4, C.white, C.ink, 0.6)), cabbage(100, 92, 12)),
  // fermentering: the slow change over time – the same jar on day 1, day 7 and day 14, the whole row is the thing
  'foodh.fermentering': all(...([['1', '#8fc45a', '#5f9a3a'], ['7', '#c4cf78', '#93a04a'], ['14', '#e8dfa0', '#b9ab62']] as const).map(([d, c, l], i) => all(calendar(24 + i * 36, 28, d), jarBody(24 + i * 36, 100, 28, 44), rect(12 + i * 36, 62, 24, 36, c, 4, null),
    line(`M15 ${70} l6 -3 l6 3 l6 -3 M15 ${80} l6 -3 l6 3 l6 -3 M15 ${90} l6 -3 l6 3 l6 -3`.replace(/M15/g, `M${15 + i * 36}`), l, 1.3), jarLid(24 + i * 36, 56, 28))), arrow(41, 78, 45, 78, C.grey, 2.2), arrow(77, 78, 81, 78, C.grey, 2.2),
    waPulse('fh-fering', rect(4, 6, 112, 104, 'none', 18, HL, 3.4))),
  // mjölksyrad: sour thanks to lactic acid bacteria (magnifier, tick) – not thanks to vinegar from a bottle (grey, crossed out)
  'foodh.mjölksyrad': all(line('M4 106 L116 106', C.grey2, 2), faded(jarBody(22, 104, 32, 48), jarFill(22, 104, 32, 40, '#e9f0c0'), cucumber(16, 82, 88, 34), cucumber(28, 82, 92, 34), jarLid(22, 56, 32), bottle(50, 104, C.yellow)), cross(34, 36, 1.4),
    jarBody(84, 104, 36, 50), jarFill(84, 104, 36, 42, '#f1ecc0'), cucumber(77, 81, 88, 36), cucumber(90, 81, 92, 36), jarLid(84, 54, 36, HL), line('M96 52 L102 62', C.ink, 4), circle(90, 28, 22, C.white, C.ink, 2.6),
    waShake('fh-syrad', rod(82, 22, 30, 11), rod(98, 20, -20, 11), rod(88, 34, 70, 11), rod(100, 36, 10, 10), rod(78, 36, -40, 9)), circle(90, 28, 22, 'none', HL, 2), circle(66, 70, 8, C.green, C.ink, 1.4), line('M62 70 L65 73.6 L70.4 66.4', C.white, 2.4)),
  // vitkål: the round, hard, pale green cabbage – whole and cut in half
  'foodh.vitkål': all(table(100), cabbage(42, 62, 36), path('M72 100 C72 68 116 68 116 100 Z', '#f4f8e2', C.ink, 2.2), line('M78 98 C80 80 108 80 110 98 M84 98 C86 86 102 86 104 98 M90 98 C91 92 97 92 98 98', '#8fae5a', 1.6), line('M94 100 L94 92', '#c9d79a', 4)),
  // strimla: cut into long thin strips
  'foodh.strimla-verb': all(rect(6, 78, 108, 14, '#d9b47a', 4, C.ink, 2.2), table(92), path('M8 78 C8 48 44 44 56 50 L56 78 Z', '#d7e6a8', C.ink, 2.2), line('M16 76 C18 60 40 54 52 56 M26 76 C28 64 42 60 52 62', '#8fae5a', 1.5),
    line('M64 78 c3 -8 -3 -12 0 -20 M71 78 c3 -8 -3 -12 0 -18 M78 78 c3 -7 -3 -11 0 -17 M85 78 c3 -7 -3 -10 0 -15 M92 78 c3 -6 -3 -9 0 -13 M99 78 c2 -5 -2 -8 0 -11', C.ink, 4.6), line('M64 78 c3 -8 -3 -12 0 -20 M71 78 c3 -8 -3 -12 0 -18 M78 78 c3 -7 -3 -11 0 -17 M85 78 c3 -7 -3 -10 0 -15 M92 78 c3 -6 -3 -9 0 -13 M99 78 c2 -5 -2 -8 0 -11', '#e6f0c2', 2.6),
    moving('fh-strimla', '0%,100%{transform:translate(0,-14px)}45%,60%{transform:translate(0,0)}', { dur: 0.9 }, path('M56 18 L62 18 L62 76 L56 76 C50 60 50 34 56 18 Z', C.silver, C.ink, 1.8), rect(54, 2, 10, 18, C.dark, 3, C.ink, 1.8))),
  // saltlake: water with a lot of salt in – the vegetables lie under it
  'foodh.saltlake': all(table(104), path('M10 44 L78 44 L72 104 L16 104 Z', GLASS, C.ink, 2.2), path('M12 54 L76 54 L71 102 L17 102 Z', '#bfe0ee', null), waPulse('fh-lake', line('M12 54 L76 54', HL, 3.4)), cucumber(40, 78, 12, 30), cucumber(48, 92, -8, 30), rect(24, 62, 6, 6, C.white, 1, C.ink, 1), rect(54, 66, 5, 5, C.white, 1, C.ink, 1), rect(60, 84, 5, 5, C.white, 1, C.ink, 1),
    turn(94, 34, -34, rect(-10, -16, 20, 32, C.white, 4, C.ink, 1.8), rect(-10, -20, 20, 7, C.silver, 2, C.ink, 1.6), circle(-4, -17, 0.9, C.ink, null), circle(0, -17, 0.9, C.ink, null), circle(4, -17, 0.9, C.ink, null)),
    moving('fh-lake2', '0%{transform:translate(6px,-10px);opacity:0}50%,100%{transform:translate(0,0);opacity:1}', { dur: 1.4 }, rect(78, 36, 3, 3, C.white, 0, C.ink, 0.7), rect(72, 42, 3, 3, C.white, 0, C.ink, 0.7), rect(66, 36, 3, 3, C.white, 0, C.ink, 0.7), rect(60, 46, 3, 3, C.white, 0, C.ink, 0.7))),
  // kimchi: Korean fermented cabbage, red with chilli
  'foodh.kimchi': all(table(100), bowl(48, 62, 76, '#3d3a44', '#c8442e'), path('M14 62 C20 46 34 52 40 44 C48 36 60 50 66 44 C74 40 82 52 82 62 Z', '#d9502e', C.ink, 2), line('M26 58 C30 50 38 54 42 48 M50 58 C54 48 62 54 68 48', '#f4e2b8', 3), circle(34, 56, 1.4, '#7a1f12', null), circle(58, 54, 1.4, '#7a1f12', null), circle(72, 58, 1.4, '#7a1f12', null), tleaf(46, 52, 60, 0.5, C.green),
    chili(98, 88, 20, 1.1), chili(100, 104, -10, 0.9), line('M70 20 L106 44 M78 14 L112 38', C.ink, 4), line('M70 20 L106 44 M78 14 L112 38', '#c9a36a', 2)),
  // kombucha: fermented sweet tea with bubbles – the jar with the pale disc on top and a cloth over it
  'foodh.kombucha': all(table(104), jarBody(40, 104, 58, 70), jarFill(40, 104, 58, 54, AMBER), ellipse(40, 51, 26, 5.4, '#f1e2c4', C.ink, 1.6), bubbles([[26, 72, 2.4], [44, 66, 2], [54, 82, 2.8], [34, 90, 2]], '#f3c98a'), path('M8 38 L72 38 L76 28 L4 28 Z', C.white, C.ink, 1.8), line('M9 36 L71 36', C.red, 2.4),
    path('M84 60 L112 60 L108 104 L88 104 Z', GLASS, C.ink, 2), path('M85.4 70 L110.6 70 L107.6 102 L88.4 102 Z', AMBER, null), moving('fh-komb', '0%{transform:translate(0,12px);opacity:0}30%{opacity:1}100%{transform:translate(0,-8px);opacity:1}', { dur: 1.8 }, bubbles([[94, 90, 1.8], [102, 82, 2.2], [98, 76, 1.6]], '#f9e2b8')),
    tleaf(98, 40, 30, 0.9, LEAF_G)),
  // lägga in: put cucumbers in a jar and pour the sweet-and-sour liquid over them
  'foodh.lägga-in.2': all(table(104), jarBody(42, 104, 54, 62), jarFill(42, 104, 54, 40, '#e9f0c0'), cucumber(30, 76, 84, 44), cucumber(42, 74, 92, 46), cucumber(54, 76, 88, 44), line('M22 56 C26 48 30 52 34 46 M48 54 C52 46 56 52 60 46', C.green, 1.6), circle(36, 66, 1.6, C.yellow, C.ink, 0.6), circle(50, 68, 1.6, C.yellow, C.ink, 0.6),
    turn(84, 26, -38, path('M-16 -10 L16 -10 L12 12 L-12 12 Z', C.silver, C.ink, 2), line('M16 -6 L30 -8', C.ink, 5), line('M16 -6 L30 -8', C.dark, 2.4)), waPulse('fh-lagg', line('M68 28 C60 30 56 38 56 46', '#e3d67a', 4)),
    faded(bottle(104, 104, C.yellow)), rect(84, 94, 8, 8, C.white, 1, C.ink, 1.2), rect(90, 88, 8, 8, C.white, 1, C.ink, 1.2)),
};

// ── 4756 Dessertbakning ──
/** A small cake in a paper cup; (x, y) = centre of the base. */
const pastry = (x: number, y: number, top: string, paper: string): Svg => all(path(`M${x - 9} ${y} L${x - 11} ${y - 9} L${x + 11} ${y - 9} L${x + 9} ${y} Z`, paper, C.ink, 1.5), line(`M${x - 5} ${y - 1} L${x - 6} ${y - 8} M${x} ${y - 1} L${x} ${y - 8} M${x + 5} ${y - 1} L${x + 6} ${y - 8}`, C.ink, 0.8), path(`M${x - 11} ${y - 9} C${x - 11} ${y - 22} ${x + 11} ${y - 22} ${x + 11} ${y - 9} Z`, top, C.ink, 1.6), circle(x, y - 20, 2.6, C.red, C.ink, 1));
const cream = (x: number, y: number, s: number, col: string = C.white): Svg => at(x, y, s, path('M-8 0 C-11 -5 -6 -8 -5 -9 C-6 -13 -1 -14 0 -18 C1 -14 6 -13 5 -9 C6 -8 11 -5 8 0 Z', col, C.ink, 1.4), line('M-4 -3 C-1 -5 2 -5 4 -3', C.grey2, 1));
const spatula = (x: number, y: number, deg: number): Svg => turn(x, y, deg, line('M0 -40 L0 -8', C.ink, 5.4), line('M0 -40 L0 -8', '#c9a36a', 2.8), path('M-7 -10 L7 -10 L8 12 C4 18 -4 18 -8 12 Z', HL, C.ink, 1.8));
const M6: Record<string, Svg> = {
  // bakelse: one of the small cakes for one person in the glass counter at the café – tongs lift it out
  'foodh.bakelse': all(rect(4, 46, 112, 54, '#e6f3f6', 5, C.ink, 2.2), rect(4, 96, 112, 16, C.brown, 2, C.ink, 2.2), rect(8, 88, 104, 6, C.white, 1, C.ink, 1.4), line('M14 52 L30 52 M14 58 L22 58', C.white, 2.4),
    pastry(20, 88, C.pink, '#f6e2a8'), pastry(46, 88, '#9fcf8a', '#f6e2a8'), `<ellipse cx="72" cy="88" rx="11" ry="2.6" fill="none" stroke="${C.grey}" stroke-width="1.4" stroke-dasharray="3 3"/>`, pastry(98, 88, '#8a5636', '#f6e2a8'),
    moving('fh-bakelse', '0%,12%{transform:translate(0,44px)}65%,100%{transform:translate(0,0)}', { dur: 2.8 }, line('M60 6 L62 30 M84 6 L82 30', C.ink, 5), line('M60 6 L62 30 M84 6 L82 30', C.silver, 2.6), pastry(72, 42, C.white, '#f6e2a8'), circle(72, 30, 22, 'none', HL, 3))),
  // tårtbotten: the plain baked sponge, cut into layers – no cream yet
  'foodh.tårtbotten': all(table(100), ...[0, 1, 2].map((i) => all(path(`M18 ${88 - i * 20} L18 ${98 - i * 20} C18 ${108 - i * 20} 92 ${108 - i * 20} 92 ${98 - i * 20} L92 ${88 - i * 20} Z`, '#e9c37a', C.ink, 2), ellipse(55, 88 - i * 20, 37, 9, i === 2 ? '#c9954a' : '#f6e2a8', C.ink, 2))),
    turn(106, 60, 0, line('M0 20 L0 40', C.ink, 6), line('M0 20 L0 40', C.dark, 3.4), path('M-3 20 L3 20 L3 -24 C0 -30 -3 -20 -3 20 Z', C.silver, C.ink, 1.5))),
  // springform: the round tin with a ring that opens
  'foodh.springform': all(table(104), ellipse(60, 96, 46, 11, C.grey, C.ink, 2.2), path('M16 44 L16 74 C16 88 104 88 104 74 L104 44 Z', C.silver, C.ink, 2.2), ellipse(60, 44, 44, 11, '#8a8f98', C.ink, 2.2), ellipse(60, 46, 38, 8, '#6f747d', null),
    rect(54, 60, 6, 22, C.dark, 1, C.ink, 1.4), waPulse('fh-spring', path('M58 62 L78 58 L80 66 L60 72 Z', HL, C.ink, 1.8), circle(60, 66, 2.4, C.white, C.ink, 1)), line('M56 84 L56 92', C.ink, 2)),
  // sikta (mjöl): shake the flour through a sieve
  'foodh.sikta.2': all(table(104), bowl(56, 80, 70, C.sky, FLOUR), heap(56, 82, 34, 9, FLOUR, null), waShake('fh-sikta', path('M28 28 L84 28 C82 46 30 46 28 28 Z', C.grey2, C.ink, 2), line('M36 34 L76 34 M42 40 L70 40 M44 28 L48 43 M56 28 L56 44 M68 28 L64 43', C.ink, 0.8), ellipse(56, 28, 28, 6, FLOUR, C.ink, 2), line('M84 28 L112 22', C.ink, 6), line('M84 28 L112 22', C.dark, 3.2)),
    moving('fh-sikta2', '0%{transform:translate(0,-12px);opacity:0}40%{opacity:1}100%{transform:translate(0,10px);opacity:1}', { dur: 1.2 }, ...[[40, 54], [50, 60], [60, 52], [70, 58], [46, 66], [64, 66], [56, 58]].map(([a, b]) => circle(a!, b!, 1.5, FLOUR, C.ink, 0.6)))),
  // florsocker: sugar as a fine white powder
  'foodh.florsocker': all(table(100), heap(40, 100, 60, 34, C.white, null), circle(30, 86, 1, C.grey2, null), circle(46, 80, 1, C.grey2, null), circle(52, 92, 1, C.grey2, null), turn(64, 62, -36, line('M8 0 L36 0', C.ink, 5), line('M8 0 L36 0', C.silver, 2.6), ellipse(-2, 0, 11, 6, C.silver, C.ink, 1.6), ellipse(-2, -2, 8, 3.4, C.white, C.ink, 0.9)),
    faded(rect(86, 26, 9, 9, C.white, 1, C.ink, 1.2), rect(96, 30, 9, 9, C.white, 1, C.ink, 1.2), rect(90, 38, 9, 9, C.white, 1, C.ink, 1.2)), arrow(92, 52, 78, 70, C.grey, 2.6),
    at(96, 98, 1, ellipse(0, 0, 18, 9, '#d9a05a', C.ink, 1.8), ellipse(0, -2, 5, 2.4, C.tan, C.ink, 1.2), path('M-16 -3 C-10 -11 10 -11 16 -3 C8 -7 -8 -7 -16 -3 Z', C.white, null)), sparkle(16, 60, 4, HL)),
  // vända ner: fold the flour gently into the airy batter – lift from the bottom and turn over
  'foodh.vända-ner': all(table(104), path('M10 54 C10 96 110 96 110 54 Z', C.sky, C.ink, 2.2), ellipse(60, 54, 50, 13, '#f8eec2', C.ink, 2.2), bubbles([[36, 54, 2.6], [50, 60, 2], [78, 52, 2.4], [88, 58, 1.8]], '#fffbe6'), path('M40 50 C46 44 58 44 62 50 C56 54 46 54 40 50 Z', FLOUR, C.ink, 1.2),
    moving('fh-vanda', '0%,100%{transform:rotate(-16deg)}50%{transform:rotate(14deg)}', { dur: 2.8 }, `<g style="transform-origin:66px 56px">${spatula(72, 50, 24)}</g>`), `<path d="M30 42 C34 22 62 18 76 30" fill="none" stroke="${HL}" stroke-width="3.2" stroke-linecap="round"/>`, path('M78 32 L68 32 L74 23 Z', HL, HL, 1.2)),
  // mousse: a soft, airy dessert in a glass
  'foodh.mousse': all(table(104), path('M26 40 L94 40 C94 62 80 76 60 76 C40 76 26 62 26 40 Z', GLASS, C.ink, 2.2), line('M60 76 L60 98', C.ink, 3), ellipse(60, 100, 20, 4.4, GLASS, C.ink, 2), path('M28.4 44 L91.6 44 C90 62 78 74 60 74 C42 74 30 62 28.4 44 Z', '#7a4a2f', null), path('M26 44 C28 26 50 30 60 24 C72 28 92 28 94 44 Z', '#8a5636', C.ink, 2),
    bubbles([[40, 52, 2.2], [54, 60, 1.8], [68, 54, 2.4], [78, 48, 1.6], [48, 44, 1.6]], '#a87352'), raspberry(60, 26, 1.2), tleaf(72, 24, 60, 0.5, C.green), turn(104, 70, 24, line('M0 -4 L0 26', C.ink, 4.4), line('M0 -4 L0 26', C.silver, 2.2), ellipse(0, -10, 5, 7, C.silver, C.ink, 1.5))),
  // gelatin: the thin clear sheets that make a liquid set – and the wobbly jelly
  'foodh.gelatin': all(table(100), ...[-14, 0, 14].map((d, i) => turn(34, 60, d, `<rect x="-14" y="-40" width="28" height="64" rx="2" fill="#fbe9a8" fill-opacity="${0.5 + i * 0.12}" stroke="${C.ink}" stroke-width="1.8"/>`, line('M-14 -24 L14 -8 M-14 -8 L14 8 M-14 8 L14 24 M14 -24 L-14 -8 M14 -8 L-14 8 M14 8 L-14 24', '#e0c070', 0.9))),
    saucer(90, 98, 24), waShake('fh-gel', path('M72 96 C72 70 80 62 90 62 C100 62 108 70 108 96 Z', '#e8546a', C.ink, 2).replace('/>', ' fill-opacity="0.8"/>'), line('M80 74 C82 68 86 66 90 66', C.white, 2.2))),
  // vattenbad: a bowl over a pan of hot water – the chocolate melts gently
  'foodh.vattenbad': all(rect(8, 104, 104, 8, C.dark, 2, C.ink, 1.8), flame(40, 104, 0.6), flame(60, 104, 0.6), flame(80, 104, 0.6), path('M22 56 L98 56 L94 94 L26 94 Z', C.silver, C.ink, 2.2), path('M24.6 70 L95.4 70 L93 92 L27 92 Z', C.sky, null), line('M98 62 L114 60', C.ink, 6), line('M98 62 L114 60', C.dark, 3.2),
    bubbles([[36, 84, 2.4], [84, 82, 2.6], [30, 76, 1.8], [90, 74, 1.8]], '#d6f0fa'), path('M14 50 L106 50 C104 70 88 78 60 78 C32 78 16 70 14 50 Z', C.white, C.ink, 2.2), ellipse(60, 50, 46, 9, '#6b3f25', C.ink, 2), rect(46, 44, 12, 8, '#4a2a18', 1, C.ink, 1.2), rect(64, 46, 10, 7, '#4a2a18', 1, C.ink, 1.2),
    steam('fh-bad', 14, 40, 0.8), steam('fh-bad2', 106, 40, 0.8), waPulse('fh-bad3', line('M24.6 70 L32 70 M88 70 L95.4 70', HL, 3))),
  // spritsa: squeeze cream out of a piping bag into small tops
  'foodh.spritsa': all(table(104), path('M6 84 L6 104 L114 104 L114 84 Z', '#f6e2a8', C.ink, 2), ellipse(60, 84, 54, 10, C.white, C.ink, 2), cream(20, 84, 1), cream(38, 86, 1), cream(56, 87, 1), waGrow('fh-sprits1', cream(74, 86, 1)),
    moving('fh-sprits2', '0%,100%{transform:translate(0,-6px)}50%{transform:translate(0,0)}', { dur: 1.6 }, turn(86, 40, 24, path('M-16 -30 L16 -30 L4 26 L-4 26 Z', '#fdf6e0', C.ink, 2), path('M-4 26 L4 26 L3 34 L0 31 L-3 34 Z', C.silver, C.ink, 1.4), path('M-18 -30 C-14 -40 14 -40 18 -30 Z', '#fdf6e0', C.ink, 2)), path('M88 2 C100 -2 116 8 112 22 C108 32 96 30 92 22 Z', C.skin, C.ink, 1.8))),
  // glasyr (på kakor): the sweet, shiny layer of sugar on top
  'foodh.glasyr.2': all(table(102), at(40, 86, 1, ellipse(0, 4, 32, 12, '#d9a05a', C.ink, 2), path('M-30 2 C-28 -14 28 -14 30 2 C30 8 24 6 22 12 C20 6 12 8 10 14 C6 6 -6 8 -10 12 C-14 6 -24 10 -30 2 Z', C.pink, C.ink, 2), line('M-18 -4 C-10 -9 0 -10 8 -8', C.white, 2.6)),
    sparkle(18, 62, 5, C.white), turn(88, 30, 40, line('M0 -30 L0 0', C.ink, 4.4), line('M0 -30 L0 0', C.silver, 2.2), ellipse(0, 6, 6, 8, C.silver, C.ink, 1.5)), waPulse('fh-glasyr', path('M88 42 C84 52 88 60 86 70 C92 62 92 50 92 42 Z', C.pink, C.ink, 1.3)),
    bowl(92, 84, 40, C.white, C.pink)),
};

// ── 4757 Provsmakning och aromer ──
const smallCup = (x: number, y: number, label: string, liq: string = COFFEE): Svg => all(path(`M${x - 9} ${y} L${x + 9} ${y} L${x + 7} ${y + 16} L${x - 7} ${y + 16} Z`, C.white, C.ink, 1.8), ellipse(x, y, 9, 2.8, liq, C.ink, 1.5), num(x, y + 13, label, 9));
const choc = (x: number, y: number, s: number, deg = 0, col = '#5a341f'): Svg => turn(x, y, deg, g(`scale(${s})`, rect(-14, -10, 28, 20, col, 2, C.ink, 1.8), line('M-5 -10 L-5 10 M5 -10 L5 10 M-14 0 L14 0', '#3a2012', 1.4)));
const cloud = (x: number, y: number, s: number, col: string): Svg => at(x, y, s, path('M-22 10 C-32 10 -32 -6 -22 -6 C-22 -20 -2 -24 4 -14 C10 -24 30 -16 26 -4 C34 -2 32 10 24 10 Z', col, C.ink, 1.8));
const nut = (x: number, y: number, s: number): Svg => at(x, y, s, path('M-7 -1 C-7 8 7 8 7 -1 C5 -9 -5 -9 -7 -1 Z', '#b9793d', C.ink, 1.4), path('M-7 -1 C-5 -8 5 -8 7 -1 C3 -4 -3 -4 -7 -1 Z', '#7a4a2a', C.ink, 1.2));
const M7: Record<string, Svg> = {
  // provsmakning: several kinds in a row to taste and compare
  'foodh.provsmakning': all(bust(30, 22, 0.95, { top: C.green, long: true, face: 'smile' }), bust(88, 22, 0.95, { top: C.denim, hair: '#8a5a2b', face: 'o' }), table(74), smallCup(18, 80, '1'), smallCup(46, 80, '2', '#7a4a2a'), smallCup(74, 80, '3', '#a8744a'), smallCup(102, 80, '4', DARK),
    arm([72, 50], [80, 34], C.denim, [72, 38]), turn(86, 32, -60, line('M0 0 L0 16', C.ink, 3.4), line('M0 0 L0 16', C.silver, 1.6), ellipse(0, -4, 3.4, 5, C.silver, C.ink, 1.2)), waPulse('fh-prov', line('M18 108 L102 108', HL, 3), path('M106 108 L98 103 L98 113 Z', HL, HL, 1))),
  // blindprovning: taste without knowing what it is – the eyes are covered and the bottles are hidden
  'foodh.blindprovning': all(bust(40, 34, 1.5, { top: C.purple, hair: '#8a5a2b', blind: true, face: 'o' }), table(88), arm([66, 70], [70, 50], C.purple, [76, 62]), turn(66, 44, -70, line('M0 0 L0 16', C.ink, 3.4), line('M0 0 L0 16', C.silver, 1.6), ellipse(0, -4, 3.4, 5, C.silver, C.ink, 1.2)),
    ...[0, 1].map((i) => all(path(`M${82 + i * 20} 60 L${96 + i * 20} 60 L${98 + i * 20} 100 L${80 + i * 20} 100 Z`, '#c9a36a', C.ink, 1.8), rect(86 + i * 20, 50, 6, 11, C.dark, 1, C.ink, 1.4), num(89 + i * 20, 88, '?', 15, C.white))), smallCup(60, 92, '1'), smallCup(22, 92, '2')),
  // beska: the bitter one of the four tastes – grapefruit and dark chocolate; sweet, salt and sour are grey
  'foodh.beska': all(faded(rect(6, 6, 50, 50, C.white, 6, C.ink, 2), rect(22, 22, 9, 9, C.white, 1, C.ink, 1.4), rect(33, 26, 9, 9, C.white, 1, C.ink, 1.4), rect(27, 34, 9, 9, C.white, 1, C.ink, 1.4), strawberry(18, 40, 1), rect(64, 6, 50, 50, C.white, 6, C.ink, 2), rect(80, 20, 18, 26, C.white, 4, C.ink, 1.6), rect(80, 14, 18, 8, C.silver, 2, C.ink, 1.6), circle(86, 18, 1, C.ink, null), circle(92, 18, 1, C.ink, null),
    rect(6, 64, 50, 50, C.white, 6, C.ink, 2), lemon(31, 89, 15)), rect(64, 64, 50, 50, '#fff3e0', 6, HL, 3.6),
    waPulse('fh-beska', line('M60 60 L64 64', HL, 3)), circle(82, 84, 14, '#f2b450', C.ink, 1.8), circle(82, 84, 11, '#f08a7a', null), line('M82 73 L82 95 M71 84 L93 84 M74 76 L90 92 M90 76 L74 92', '#fbd3c6', 1.3), choc(100, 102, 0.62, -12, '#2e1a10')),
  // fruktig: it smells and tastes of fruit, though there is no fruit in the cup
  'foodh.fruktig': all(table(98), cup(46, 72, 1.15, '#a85a2a'), line('M46 62 C40 54 52 50 48 42', C.grey, 2.2, '3 3'), waBob('fh-frukt', 3, cloud(62, 26, 1.6, '#fff3e0'), raspberry(40, 22, 1.5), lemon(64, 18, 9), strawberry(86, 22, 1.4), circle(54, 34, 5, '#8a4fb0', C.ink, 1.2), circle(74, 34, 5, C.green, C.ink, 1.2)), sparkle(104, 60, 5, HL)),
  // fyllig (om smak): rich, with a lot of taste that fills the mouth – against thin and watery (grey)
  'foodh.fyllig.2': all(line('M4 108 L116 108', C.grey2, 2), faded(path('M82 60 L106 60 L103 106 L85 106 Z', GLASS, C.ink, 1.8), path('M83 70 L105 70 L102.6 105 L85.4 105 Z', '#e9d2b0', null), circle(94, 34, 12, 'none', C.ink, 1.6), line('M88 34 L100 34', C.ink, 1.4)),
    path('M16 44 L64 44 L59 106 L21 106 Z', GLASS, C.ink, 2.2), path('M17.6 52 L62.4 52 L58.4 104 L21.6 104 Z', '#4a2416', null), path('M17.6 52 C28 46 36 58 46 52 C54 47 58 54 62.4 52 L61 70 L19 70 Z', '#6b3420', null), waGrow('fh-fyllig', circle(40, 22, 17, HL, C.ink, 2), circle(40, 22, 10, '#4a2416', null), circle(40, 22, 4, HL, null))),
  // rökig (om smak): it tastes of smoke – as if it had been dried over a fire
  'foodh.rökig.2': all(table(98), cup(34, 74, 1.1, '#6b3420'), line('M34 64 C28 56 40 52 36 44', C.grey, 2.2, '3 3'), cloud(62, 28, 1.5, C.white), line('M50 34 L70 30 M52 28 L68 36', C.brown, 4.4), flame(60, 28, 0.8),
    waBob('fh-rok', 4, path('M72 20 C66 12 80 10 74 4 M84 24 C78 14 92 12 86 6', 'none', '#7d838c', 3.4)), turn(92, 92, 0, path('M-14 0 C-6 -8 6 -8 14 0 C6 8 -6 8 -14 0 Z', '#c9a36a', C.ink, 1.6), path('M14 0 L20 -6 L20 6 Z', '#c9a36a', C.ink, 1.4), circle(-8, -1, 1.2, C.ink, null), line('M-2 -5 L2 5 M4 -5 L8 4', '#8a6a3a', 1.2))),
  // inslag: a small part that you notice in the whole – a little nut in the taste of the chocolate
  'foodh.inslag': all(choc(26, 92, 1.3, -8), line('M40 74 C46 66 48 62 52 58', C.grey, 2.2, '3 3'), circle(72, 44, 34, '#5a341f', C.ink, 2.4), waPulse('fh-inslag', path('M72 44 L72 10 A34 34 0 0 1 95.5 19.4 Z', HL, C.ink, 2)), circle(72, 44, 34, 'none', C.ink, 2.4),
    line('M90 14 L98 10', HL, 2.4), nut(105, 12, 1.1), nut(100, 96, 0.9), nut(110, 104, 0.7)),
  // munkänsla: how it feels in the mouth – smooth, creamy or rough on the tongue
  'foodh.munkänsla': all(path('M10 44 C10 10 110 10 110 44 C110 96 84 110 60 110 C36 110 10 96 10 44 Z', '#b0473a', C.ink, 2.4), path('M20 46 C24 24 96 24 100 46 C100 84 82 98 60 98 C38 98 20 84 20 46 Z', '#5a1f24', C.ink, 1.8),
    path('M30 36 L38 36 L38 44 L46 44 L46 36 L54 36 L54 44 L66 44 L66 36 L74 36 L74 44 L82 44 L82 36 L90 36 L90 30 C80 24 40 24 30 30 Z', C.white, C.ink, 1.4), path('M28 70 C30 56 90 56 92 70 C92 90 76 96 60 96 C44 96 28 90 28 70 Z', '#ef8a9a', C.ink, 1.8), line('M60 62 L60 90', '#c95a70', 1.6),
    choc(60, 58, 0.55), waPulse('fh-mun', line('M36 74 c4 -4 8 4 12 0 M72 74 l4 -5 l4 5 l4 -5 l4 5', HL, 3), circle(60, 80, 4, HL, null))),
  // smakanteckning: what you write down about the taste when you taste something
  'foodh.smakanteckning': all(table(104), turn(50, 58, -4, rect(-34, -46, 68, 92, C.white, 4, C.ink, 2.2), ...[0, 1, 2].map((i) => all(circle(-22, -28 + i * 26, 7, [COFFEE, '#a8744a', '#7a4a2a'][i]!, C.ink, 1.4), num(-22, -25 + i * 26, String(i + 1), 8, C.white), line(`M-10 ${-32 + i * 26} L26 ${-32 + i * 26} M-10 ${-24 + i * 26} L${[18, 8, 22][i]} ${-24 + i * 26}`, C.grey, 2),
    ...[0, 1, 2, 3, 4].map((k) => circle(-8 + k * 7, -16 + i * 26, 2.4, k < [4, 2, 5][i]! ? HL : C.white, C.ink, 0.9))))), turn(96, 44, 24, rect(-4, -30, 8, 44, C.yellow, 1, C.ink, 1.6), path('M-4 14 L4 14 L0 24 Z', '#f1dfbc', C.ink, 1.4), rect(-4, -36, 8, 7, C.pink, 1, C.ink, 1.4)), cup(98, 82, 0.7, COFFEE)),
};

export const FOODH_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
