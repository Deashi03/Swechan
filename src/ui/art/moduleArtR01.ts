/**
 * Motifs for catalog modules in R01 Vardag & hem that had no picture yet (0.27):
 * SWC-VAR-03-04 … SWC-VAR-06-06. Same geometry format as motifs.ts.
 */
import type { Motif, Part, Role } from './motifs';

const p = (d: string, r: Role, hue?: number): Part => ({ t: 'path', d, r, hue });
const c = (cx: number, cy: number, rad: number, r: Role, hue?: number): Part => ({ t: 'circle', cx, cy, rad, r, hue });
const q = (x: number, y: number, w: number, h: number, r: Role, rx = 1.5, hue?: number): Part => ({ t: 'rect', x, y, w, h, rx, r, hue });
const G = { green: 115, leaf: 95, orange: 26, red: 6, yellow: 46, brown: 28, blue: 210, grey: 220 } as const;
const f = (n: number) => n.toFixed(1);
const clockFace = (cx: number, cy: number, r: number, h: number, m: number): Part[] => [c(cx, cy, r, 'main'), c(cx, cy, r * 0.78, 'light'), p(`M${cx} ${cy} L${f(cx + Math.sin((h / 12) * Math.PI * 2) * r * 0.42)} ${f(cy - Math.cos((h / 12) * Math.PI * 2) * r * 0.42)} M${cx} ${cy} L${f(cx + Math.sin((m / 60) * Math.PI * 2) * r * 0.62)} ${f(cy - Math.cos((m / 60) * Math.PI * 2) * r * 0.62)}`, 'line')];
const calendar = (extra: Part[] = []): Part[] => [q(10, 12, 44, 42, 'light', 4), q(10, 12, 44, 11, 'main', 4), q(18, 7, 4, 9, 'accent', 2), q(42, 7, 4, 9, 'accent', 2), ...extra];
const box = (x: number, y: number, w: number, h: number, r: Role = 'main', hue?: number): Part[] => [q(x, y, w, h, r, 2, hue), p(`M${x + w / 2} ${y} V${y + h}`, 'line'), q(x, y, w, h * 0.2, 'accent', 1)];
const arrowR = (x1: number, y: number, x2: number): Part => p(`M${x1} ${y} H${x2} M${x2 - 6} ${y - 5} L${x2} ${y} L${x2 - 6} ${y + 5}`, 'line');
const coin = (x: number, y: number, r: number): Part[] => [c(x, y, r, 'main', G.yellow), c(x, y, r * 0.6, 'light')];
const person = (x: number, y: number, s: number, r: Role): Part[] => [c(x, y - 10 * s, 5 * s, r), p(`M${x - 8 * s} ${y + 10 * s} V${y + 2 * s} C${x - 8 * s} ${y - 4 * s} ${x + 8 * s} ${y - 4 * s} ${x + 8 * s} ${y + 2 * s} V${y + 10 * s} Z`, r)];
const all2 = (r: number): Part => ({ t: 'rect', x: 10, y: 12 + r * 9, w: 44 - (r % 2) * 10, h: 5, rx: 1, r: r === 0 ? 'accent' : 'light' });
const ticket = (x: number, y: number, w: number, h: number, r: Role): Part => p(`M${x} ${y} H${x + w} V${y + h / 2 - 4} C${x + w - 4} ${y + h / 2 - 4} ${x + w - 4} ${y + h / 2 + 4} ${x + w} ${y + h / 2 + 4} V${y + h} H${x} V${y + h / 2 + 4} C${x + 4} ${y + h / 2 + 4} ${x + 4} ${y + h / 2 - 4} ${x} ${y + h / 2 - 4} Z`, r);

export const R01_MODULE_MOTIFS: Record<string, Motif> = {
  // VAR-03-04 Storlek & passform
  m1_sizetag: { parts: [p('M10 22 L22 10 H52 V38 H22 Z', 'main'), c(18, 24, 3, 'light'), q(28, 30, 6, 4, 'light', 1), q(36, 26, 6, 8, 'light', 1), q(44, 20, 6, 14, 'light', 1), p('M18 24 C10 30 10 44 18 52', 'line')] },
  m1_loosetight: { parts: [p('M4 18 L12 14 C14 18 20 18 22 14 L30 18 L28 26 L26 26 V52 H8 V26 H6 Z', 'main'), p('M36 18 L42 14 C44 18 48 18 50 14 L56 18 L56 24 L54 24 V52 H38 V24 H36 Z', 'accent'), p('M30 34 H36', 'line')] },
  m1_fittingroom: { parts: [q(8, 6, 48, 4, 'main', 2), p('M10 10 C14 22 12 40 16 56 H10 Z M54 10 C50 22 52 40 48 56 H54 Z', 'main'), q(16, 10, 32, 46, 'light', 0), p('M32 16 L22 26 H42 Z', 'line'), p('M24 26 H40 L38 46 H26 Z', 'accent')] },
  m1_stitches: { parts: [q(8, 14, 48, 36, 'main', 3), p('M12 24 H52 M12 40 H52', 'line'), c(32, 32, 6, 'accent'), c(30, 30, 1, 'light'), c(34, 30, 1, 'light'), c(30, 34, 1, 'light'), c(34, 34, 1, 'light')] },
  m1_sewingmachine: { parts: [p('M10 52 V34 C10 16 22 12 34 12 H52 V30 H40 V52 Z', 'main'), q(6, 50, 52, 6, 'accent', 2), q(40, 30, 8, 6, 'accent2', 1), p('M44 36 V48', 'line'), c(22, 26, 5, 'light')] },
  m1_colormatch: { parts: [c(24, 26, 13, 'main', G.red), c(40, 26, 13, 'main', G.blue), c(32, 40, 13, 'main', G.yellow), c(32, 31, 4, 'light')] },
  m1_bowtie: { parts: [p('M8 20 L28 30 L8 44 Z', 'main'), p('M56 20 L36 30 L56 44 Z', 'main'), q(26, 26, 12, 10, 'accent', 3), p('M14 28 L22 31 M50 28 L42 31', 'line')] },
  // VAR-03-05 Tvätt & klädvård
  m1_washsymbol: { parts: [p('M10 18 H54 L48 50 H16 Z', 'light'), p('M10 18 H54 L48 50 H16 Z', 'line'), p('M14 28 C20 24 26 32 32 28 C38 24 44 32 50 28', 'line'), c(32, 40, 3, 'main'), c(40, 40, 3, 'main')] },
  m1_sortlaundry: { parts: [p('M6 34 H28 L26 54 H8 Z', 'light'), p('M36 34 H58 L56 54 H38 Z', 'main', G.grey), c(14, 30, 6, 'light'), c(22, 28, 5, 'light'), c(44, 30, 6, 'main', G.grey), c(52, 28, 5, 'main', G.grey), p('M6 34 H28 L26 54 H8 Z', 'line')] },
  m1_detergent: { parts: [p('M16 22 H44 V52 Q44 56 40 56 H20 Q16 56 16 52 Z', 'main'), q(22, 12, 14, 10, 'accent', 2), p('M44 26 C52 26 52 40 44 40', 'line'), c(28, 40, 6, 'light'), c(48, 10, 3, 'accent2'), c(54, 16, 2, 'accent2')] },
  m1_iron: { parts: [p('M6 46 C6 30 20 22 40 22 H56 V46 Z', 'main'), p('M20 22 C22 12 48 12 50 22', 'line'), c(28, 36, 3, 'light'), c(38, 36, 3, 'light'), q(4, 46, 54, 4, 'accent', 2), p('M20 58 C18 54 22 54 20 50', 'line')] },
  m1_stain: { parts: [q(8, 10, 48, 44, 'light', 4), p('M24 26 C20 18 34 14 38 22 C46 20 48 32 40 36 C42 44 30 46 28 40 C20 42 16 32 24 26 Z', 'main', G.brown), p('M48 12 L52 18 L58 20 L52 22 L48 28 L46 22 L40 20 L46 18 Z', 'main', G.yellow)] },
  m1_sheep: { parts: [c(20, 30, 9, 'light'), c(32, 26, 10, 'light'), c(44, 30, 9, 'light'), c(30, 38, 10, 'light'), c(42, 38, 8, 'light'), p('M10 30 C4 30 4 40 12 40 C16 40 18 34 16 30 Z', 'main', G.grey), p('M24 46 V54 M38 46 V54', 'line'), c(9, 33, 1.4, 'line')] },
  m1_buttonneedle: { parts: [c(28, 36, 16, 'main'), c(28, 36, 12, 'accent'), c(24, 32, 2, 'light'), c(32, 32, 2, 'light'), c(24, 40, 2, 'light'), c(32, 40, 2, 'light'), p('M44 8 L56 20 M50 14 C38 20 30 26 28 36', 'line')] },
  // VAR-03-06 Skönhet & grooming
  m1_hairstyle: { parts: [c(32, 34, 14, 'light'), p('M14 34 C12 14 52 14 50 34 C50 46 48 54 44 58 C46 46 46 34 40 26 C32 30 22 28 18 26 C16 34 18 46 20 58 C16 52 14 44 14 34 Z', 'main', G.brown), c(26, 36, 1.6, 'line'), c(38, 36, 1.6, 'line')] },
  m1_shampoo: { parts: [p('M20 24 H44 V52 Q44 56 40 56 H24 Q20 56 20 52 Z', 'main'), q(26, 14, 12, 10, 'accent', 2), p('M32 14 V8 H42', 'line'), c(32, 38, 6, 'light'), c(14, 30, 3, 'light'), c(10, 22, 2, 'light')] },
  m1_creamjar: { parts: [q(12, 30, 40, 24, 'main', 6), q(10, 22, 44, 10, 'accent', 4), p('M20 40 C24 36 28 44 32 40 C36 36 40 44 44 40', 'line'), c(46, 12, 3, 'accent2'), c(52, 18, 2, 'accent2')] },
  m1_lipstick: { parts: [q(22, 34, 20, 22, 'main', 3), q(24, 26, 16, 8, 'accent', 1), p('M26 26 V14 L38 8 V26 Z', 'main', G.red), p('M14 40 C16 36 20 36 22 40', 'line')] },
  m1_perfume: { parts: [q(14, 26, 36, 30, 'main', 8), q(26, 16, 12, 10, 'accent', 2), q(28, 8, 8, 8, 'accent2', 3), c(32, 40, 7, 'light'), p('M44 12 C48 10 52 12 54 8 M46 18 C50 18 54 20 58 16', 'line')] },
  m1_razor: { parts: [q(12, 10, 40, 14, 'main', 3), q(14, 24, 36, 4, 'light', 1), q(28, 28, 8, 28, 'accent', 3), p('M18 17 H46', 'line')] },
  m1_scissorscomb: { parts: [q(36, 6, 10, 52, 'accent', 2), p('M36 12 H30 M36 18 H30 M36 24 H30 M36 30 H30 M36 36 H30 M36 42 H30 M36 48 H30', 'line'), c(12, 48, 6, 'line'), c(26, 50, 6, 'line'), p('M15 43 L30 10 M23 45 L10 12', 'line')] },
  // VAR-04-01 Tid & kalender
  m1_clock3: { parts: [...clockFace(32, 32, 24, 3, 0), c(32, 32, 2.4, 'accent')] },
  m1_weekstrip: { parts: [...Array.from({ length: 7 }, (_, i) => q(4 + i * 8, 24, 7, 16, i > 4 ? 'accent' : 'main', 2)), q(4, 44, 56, 4, 'accent2', 2), q(4, 16, 56, 5, 'light', 2)] },
  m1_seasons: { parts: [p('M32 32 L32 8 A24 24 0 0 1 56 32 Z', 'main', G.green), p('M32 32 L56 32 A24 24 0 0 1 32 56 Z', 'main', G.yellow), p('M32 32 L32 56 A24 24 0 0 1 8 32 Z', 'main', G.orange), p('M32 32 L8 32 A24 24 0 0 1 32 8 Z', 'main', G.blue), c(44, 44, 4, 'light'), p('M16 20 L24 20 M20 16 V24 M17 17 L23 23 M23 17 L17 23', 'line')] },
  m1_beforeafter: { parts: [p('M6 32 H58', 'line'), c(32, 32, 6, 'main'), p('M12 26 L6 32 L12 38', 'line'), p('M52 26 L58 32 L52 38', 'line'), c(16, 32, 3, 'accent'), c(48, 32, 3, 'accent2')] },
  m1_timespan: { parts: [p('M6 40 H58', 'line'), p('M16 34 V46 M48 34 V46', 'line'), q(16, 22, 32, 8, 'main', 4), p('M16 26 L22 22 M16 26 L22 30 M48 26 L42 22 M48 26 L42 30', 'line'), c(32, 14, 4, 'accent')] },
  m1_deadline: { parts: [...calendar([q(18, 30, 8, 7, 'main', 1), q(30, 30, 8, 7, 'main', 1)]), p('M42 26 V50', 'line'), p('M42 26 H54 L50 31 L54 36 H42', 'main', G.red)] },
  m1_bookslot: { parts: [...calendar([q(18, 30, 8, 7, 'main', 1), q(30, 30, 8, 7, 'accent2', 1), q(18, 42, 8, 7, 'main', 1)]), p('M36 54 L52 38 L58 44 L42 60 L34 60 Z', 'accent')] },
  // VAR-04-02 Morgon & kväll
  m1_wakeup: { parts: [q(6, 40, 52, 12, 'main', 3), q(6, 34, 18, 8, 'light', 3), q(24, 34, 34, 8, 'accent', 3), ...clockFace(44, 18, 10, 7, 0), p('M30 10 L26 6 M58 10 L62 6', 'line')] },
  m1_getready: { parts: [q(16, 6, 30, 40, 'main', 14), q(20, 10, 22, 32, 'light', 11), q(26, 46, 10, 6, 'main', 1), q(16, 52, 30, 4, 'accent2', 2), p('M48 30 H58 M50 26 V34 M53 26 V34 M56 26 V34', 'line')] },
  m1_breakfast: { parts: [p('M18 40 H46 L42 54 H22 Z', 'main'), p('M20 40 C20 22 44 22 44 40 Z', 'light'), p('M28 30 C28 26 36 26 36 30 C36 34 28 34 28 30 Z', 'main', G.yellow), c(50, 14, 6, 'main', G.yellow), p('M50 4 V6 M58 14 H60', 'line')] },
  m1_commute: { parts: [p('M4 34 L12 26 L20 34 V48 H4 Z', 'main'), q(42, 18, 16, 30, 'accent', 1), q(46, 22, 4, 4, 'light', 0), q(52, 22, 4, 4, 'light', 0), q(46, 30, 4, 4, 'light', 0), q(52, 30, 4, 4, 'light', 0), arrowR(22, 40, 40), p('M2 50 H62', 'line')] },
  m1_eveningmeal: { parts: [c(26, 40, 16, 'light'), c(26, 40, 11, 'main'), q(46, 26, 6, 26, 'accent', 1), p('M49 26 C46 22 47 18 49 16 C51 18 52 22 49 26 Z', 'main', G.orange), p('M44 6 A6 6 0 1 0 50 14 A5 5 0 1 1 44 6 Z', 'main', G.yellow)] },
  m1_pillowmoon: { parts: [p('M8 40 C8 28 56 28 56 40 C56 52 8 52 8 40 Z', 'light'), p('M8 40 C8 28 56 28 56 40 C56 52 8 52 8 40 Z', 'line'), p('M40 8 A12 12 0 1 0 50 24 A10 10 0 1 1 40 8 Z', 'main', G.yellow), c(18, 14, 1.6, 'accent2'), c(26, 8, 1.6, 'accent2')] },
  m1_dailyloop: { parts: [p('M32 8 A24 24 0 0 1 56 32', 'line'), p('M32 56 A24 24 0 0 1 8 32', 'line'), c(16, 16, 7, 'main', G.yellow), p('M48 40 A8 8 0 1 0 52 52 A6 6 0 1 1 48 40 Z', 'main'), p('M50 26 L56 32 L60 26 M14 38 L8 32 L4 38', 'line')] },
  // VAR-04-03 Planering & ärenden
  m1_todolist: { parts: [q(12, 6, 40, 52, 'light', 3), p('M12 6 H52 V58 H12 Z', 'line'), ...[0, 1, 2, 3].map((i) => q(17, 14 + i * 11, 7, 7, i < 2 ? 'main' : 'light', 1)), p('M28 17 H46 M28 28 H46 M28 39 H44 M28 50 H42', 'line'), p('M18 17 L20 20 L24 15 M18 28 L20 31 L24 26', 'line')] },
  m1_priority: { parts: [q(8, 36, 14, 20, 'accent2', 2), q(25, 20, 14, 36, 'main', 2), q(42, 44, 14, 12, 'accent', 2), p('M32 10 L36 16 H28 Z', 'main', G.yellow)] },
  m1_reminder: { parts: [p('M14 42 C14 26 20 18 30 18 C40 18 46 26 46 42 Z', 'main'), q(10, 42, 40, 5, 'accent', 2), c(30, 50, 4, 'accent'), ...clockFace(48, 18, 10, 9, 0)] },
  m1_meetingbook: { parts: [...calendar([...person(24, 40, 0.8, 'main'), ...person(40, 40, 0.8, 'accent')])] },
  m1_postpone: { parts: [...calendar([q(16, 30, 8, 7, 'accent2', 1), q(40, 42, 8, 7, 'main', 1)]), p('M20 37 C22 48 32 50 40 46', 'line'), p('M36 42 L40 46 L35 49', 'line')] },
  m1_hurry: { parts: [...clockFace(38, 32, 18, 8, 55), p('M4 24 H14 M2 32 H16 M4 40 H14', 'line'), c(38, 32, 2, 'accent')] },
  m1_dayoff: { parts: [...calendar([c(32, 38, 9, 'main', G.yellow)]), p('M32 24 V26 M32 50 V52 M18 38 H20 M44 38 H46', 'line')] },
  // VAR-04-04 Vanliga vardagsverb
  m1_fetchleave: { parts: [...box(20, 24, 24, 20, 'main'), p('M6 18 H18 M12 12 L18 18 L12 24', 'line'), p('M46 50 H58 M52 44 L58 50 L52 56', 'line')] },
  m1_drawer: { parts: [q(8, 10, 48, 44, 'main', 3), q(12, 14, 40, 16, 'light', 2), q(4, 32, 56, 18, 'accent', 3), q(26, 38, 12, 4, 'light', 2), c(30, 22, 2, 'main')] },
  m1_powerbtn: { parts: [c(32, 32, 22, 'main'), c(32, 32, 16, 'light'), p('M24 22 A13 13 0 1 0 40 22', 'line'), p('M32 16 V30', 'line')] },
  m1_gohome: { parts: [p('M38 28 L48 18 L58 28 V44 H38 Z', 'main'), q(45, 34, 6, 10, 'light', 1), ...[[8, 50], [16, 44], [22, 52], [30, 46]].map(([x, y], i) => p(`M${x} ${y! - 3} C${x! - 3} ${y} ${x! - 2} ${y! + 3} ${x} ${y! + 3} C${x! + 2} ${y! + 3} ${x! + 3} ${y} ${x} ${y! - 3} Z`, i % 2 ? 'accent' : 'accent2'))] },
  m1_remember: { parts: [q(12, 12, 36, 36, 'main', 2, G.yellow), p('M18 22 H42 M18 30 H38 M18 38 H34', 'line'), c(30, 12, 4, 'main', G.red), p('M44 40 L54 50 L58 46 L48 36 Z', 'accent2')] },
  m1_startstop: { parts: [c(20, 32, 14, 'main'), p('M16 24 L28 32 L16 40 Z', 'light'), c(46, 32, 14, 'accent'), q(40, 26, 12, 12, 'light', 1)] },
  m1_needwant: { parts: [p('M10 12 H30 V40 Q30 46 24 46 H16 Q10 46 10 40 Z', 'light'), p('M10 26 H30 V40 Q30 46 24 46 H16 Q10 46 10 40 Z', 'main', G.blue), p('M38 30 H58 V52 H38 Z', 'accent'), q(46, 30, 4, 22, 'accent2', 0), p('M48 30 C44 22 38 24 40 28 M48 30 C52 22 58 24 56 28', 'line')] },
  // VAR-04-05 Mått & mängder
  m1_counting: { parts: [c(12, 44, 5, 'main'), c(26, 44, 5, 'main'), c(26, 32, 5, 'main'), c(40, 44, 5, 'accent'), c(40, 32, 5, 'accent'), c(40, 20, 5, 'accent'), c(54, 44, 5, 'accent2'), c(54, 32, 5, 'accent2'), c(54, 20, 5, 'accent2'), c(54, 8, 5, 'accent2'), p('M4 54 H62', 'line')] },
  m1_weightvolume: { parts: [p('M10 54 C6 40 12 30 22 30 C32 30 38 40 34 54 Z', 'main', G.grey), p('M16 30 C14 22 30 22 28 30', 'line'), p('M40 20 H56 L54 54 H42 Z', 'light'), p('M41 36 H55 L54 54 H42 Z', 'accent', G.blue), p('M44 26 H48 M44 32 H50 M44 38 H48', 'line'), p('M40 20 H56 L54 54 H42 Z', 'line')] },
  m1_ruler: { parts: [p('M6 40 L40 6 L58 24 L24 58 Z', 'main', G.yellow), p('M14 36 L19 41 M20 30 L23 33 M26 24 L31 29 M32 18 L35 21 M38 12 L43 17', 'line')] },
  m1_speedometer: { parts: [p('M6 44 A26 26 0 0 1 58 44', 'line'), p('M10 44 A22 22 0 0 1 54 44 Z', 'main'), p('M32 44 L46 26', 'line'), c(32, 44, 4, 'accent'), p('M14 40 L18 38 M18 26 L22 28 M32 20 V24 M46 26 L42 28', 'line'), q(6, 46, 52, 6, 'accent2', 3)] },
  m1_approx: { parts: [p('M18 18 H46 V52 Q46 56 42 56 H22 Q18 56 18 52 Z', 'light'), p('M19 34 H45 V52 Q45 55 42 55 H22 Q19 55 19 52 Z', 'main', G.brown), q(16, 12, 32, 7, 'accent', 2), p('M24 26 C28 22 32 30 36 26 C38 24 40 24 42 26', 'line')] },
  m1_chocolate: { parts: [q(10, 12, 44, 40, 'main', 3, G.brown), p('M24 12 V52 M38 12 V52 M10 25 H54 M10 38 H54', 'line'), p('M38 38 H54 V52 H38 Z', 'light')] },
  m1_sizes: { parts: [c(12, 44, 6, 'main'), c(28, 40, 10, 'accent'), c(48, 34, 14, 'accent2'), p('M4 54 H62', 'line')] },
  // VAR-04-06 Problem i vardagen
  m1_lostkeys: { parts: [c(20, 24, 9, 'main'), c(20, 24, 4, 'light'), p('M28 28 L44 44 M38 38 L42 34 M42 42 L46 38', 'line'), p('M44 10 C44 4 54 4 54 10 C54 14 49 15 49 19', 'line'), c(49, 24, 1.6, 'line'), p('M30 50 C34 46 44 52 48 50', 'line')] },
  m1_brokenplate: { parts: [p('M8 34 C8 20 30 14 30 14 L26 30 L32 36 L24 52 C14 50 8 42 8 34 Z', 'light'), p('M34 14 C46 16 56 24 56 34 C56 46 44 54 30 54 L36 38 L30 32 Z', 'light'), p('M8 34 C8 20 30 14 30 14 L26 30 L32 36 L24 52 C14 50 8 42 8 34 Z M34 14 C46 16 56 24 56 34 C56 46 44 54 30 54 L36 38 L30 32 Z', 'line'), c(18, 34, 6, 'main'), c(44, 36, 6, 'main')] },
  m1_misunderstand: { parts: [p('M6 10 H30 Q34 10 34 14 V28 Q34 32 30 32 H16 L10 38 V32 H6 Q2 32 2 28 V14 Q2 10 6 10 Z', 'main'), p('M34 30 H58 Q62 30 62 34 V48 Q62 52 58 52 H56 V58 L50 52 H34 Q30 52 30 48 V34 Q30 30 34 30 Z', 'accent'), p('M14 17 C14 13 22 13 22 17 C22 20 18 20 18 23', 'line'), c(18, 27, 1.2, 'line'), p('M46 36 V44', 'line'), c(46, 48, 1.2, 'line')] },
  m1_late: { parts: [q(16, 8, 32, 5, 'main', 2), q(16, 51, 32, 5, 'main', 2), p('M20 13 H44 C44 24 36 28 34 32 C36 36 44 40 44 51 H20 C20 40 28 36 30 32 C28 28 20 24 20 13 Z', 'light'), p('M24 46 C26 42 30 40 32 38 C34 40 38 42 40 46 Z', 'main', G.red), p('M48 20 L56 14 M50 28 H58', 'line')] },
  m1_askhelp: { parts: [p('M14 58 V36 L10 24 C9 20 14 19 15 23 L18 32 V14 C18 10 24 10 24 14 V30 L26 58 Z', 'main'), p('M34 10 H58 Q62 10 62 14 V30 Q62 34 58 34 H44 L36 40 V34 H34 Q30 34 30 30 V14 Q30 10 34 10 Z', 'accent'), p('M42 17 C42 13 50 13 50 17 C50 20 46 20 46 24', 'line'), c(46, 28, 1.2, 'line')] },
  m1_lendreturn: { parts: [q(20, 18, 24, 30, 'main', 2), q(24, 18, 3, 30, 'accent', 0), p('M8 14 C14 6 26 6 32 12', 'line'), p('M28 8 L32 12 L27 15', 'line'), p('M56 52 C50 60 38 60 32 54', 'line'), p('M36 58 L32 54 L37 51', 'line')] },
  m1_dove: { parts: [p('M8 34 C14 22 30 22 36 28 L52 18 L46 30 C50 36 46 46 36 46 C24 46 12 42 8 34 Z', 'light'), p('M8 34 C14 22 30 22 36 28 L52 18 L46 30 C50 36 46 46 36 46 C24 46 12 42 8 34 Z', 'line'), p('M20 32 C26 28 32 32 34 38 C28 40 22 38 20 32 Z', 'main'), p('M52 18 L60 20 L54 24', 'accent', G.leaf), c(40, 30, 1.4, 'line')] },

  // VAR-05-01 Livsmedelsbutiken
  m1_aisles: { parts: [q(4, 14, 16, 42, 'main', 1), q(24, 14, 16, 42, 'accent', 1), q(44, 14, 16, 42, 'main', 1), ...[0, 1, 2].flatMap((k) => [22, 34, 46].map((y) => q(6 + k * 20, y, 12, 6, 'light', 1))), q(4, 6, 56, 6, 'accent2', 2)] },
  m1_pricetag: { parts: [p('M8 30 L30 8 H54 V32 L32 54 Z', 'main'), c(44, 18, 4, 'light'), p('M20 32 L30 42 M26 28 L36 38', 'line'), p('M44 18 C50 10 58 12 60 6', 'line')] },
  m1_pearsgrapes: { parts: [p('M20 20 C14 20 14 28 16 32 C10 38 12 54 22 54 C32 54 34 38 28 32 C30 28 28 20 20 20 Z', 'main', G.green), p('M20 20 V12 L24 10', 'line'), ...[[42, 24], [50, 24], [38, 32], [46, 32], [54, 32], [42, 40], [50, 40], [46, 48]].map(([x, y]) => c(x!, y!, 4, 'accent', 285)), p('M46 20 V12', 'line')] },
  m1_findproduct: { parts: [q(4, 10, 36, 46, 'main', 2), ...[18, 30, 42].map((y) => q(8, y, 28, 6, 'light', 1)), c(44, 34, 12, 'light'), c(44, 34, 12, 'line'), p('M52 42 L60 50', 'line'), q(38, 30, 10, 8, 'accent', 1)] },
  m1_register: { parts: [p('M8 34 H56 V54 H8 Z', 'main'), p('M14 34 L18 14 H46 L50 34', 'accent'), q(22, 18, 20, 8, 'light', 1), ...[0, 1, 2].map((k) => q(18 + k * 10, 38, 7, 4, 'light', 1)), q(18, 46, 28, 4, 'accent2', 1)] },
  m1_discount: { parts: [p('M32 4 L38 12 L48 10 L48 20 L58 24 L52 32 L58 40 L48 44 L48 54 L38 52 L32 60 L26 52 L16 54 L16 44 L6 40 L12 32 L6 24 L16 20 L16 10 L26 12 Z', 'main', G.red), c(24, 24, 4, 'light'), c(40, 40, 4, 'light'), p('M40 20 L24 44', 'line')] },
  m1_returnfood: { parts: [p('M18 16 L26 8 H38 L46 16 V56 H18 Z', 'light'), p('M18 16 L26 8 H38 L46 16 V56 H18 Z', 'line'), q(18, 26, 28, 14, 'main', 0), p('M58 44 C58 54 46 58 40 52', 'line'), p('M44 50 L40 52 L42 46', 'line'), p('M24 30 L30 36 M30 30 L24 36', 'line')] },
  // VAR-05-02 Pengar & betalning
  m1_notescoins: { parts: [q(6, 14, 38, 22, 'main', 3, G.green), c(25, 25, 6, 'light'), q(10, 18, 4, 14, 'light', 1), ...coin(46, 44, 10), ...coin(30, 48, 7)] },
  m1_cardcash: { parts: [q(6, 14, 40, 26, 'main', 4), q(6, 20, 40, 5, 'accent2', 0), q(12, 30, 10, 5, 'accent', 1), q(26, 32, 32, 22, 'accent', 3, G.green), c(42, 43, 5, 'light')] },
  m1_invoice: { parts: [p('M12 6 H52 V58 L46 54 L40 58 L34 54 L28 58 L22 54 L16 58 L12 54 Z', 'light'), p('M12 6 H52 V58 L46 54 L40 58 L34 54 L28 58 L22 54 L16 58 L12 54 Z', 'line'), p('M18 16 H36 M18 24 H46 M18 30 H46 M18 36 H40', 'line'), q(30, 42, 18, 6, 'main', 1)] },
  m1_phonepay: { parts: [q(4, 12, 22, 40, 'main', 4), q(38, 12, 22, 40, 'main', 4), q(7, 17, 16, 28, 'light', 1), q(41, 17, 16, 28, 'light', 1), p('M26 28 H38 M33 23 L38 28 L33 33', 'line'), ...coin(15, 31, 5)] },
  m1_change: { parts: [...coin(20, 40, 10), ...coin(36, 46, 8), ...coin(46, 32, 7), p('M44 12 C54 12 58 20 56 28', 'line'), p('M52 26 L56 28 L58 22', 'line'), p('M16 14 H36', 'line')] },
  m1_subscription: { parts: [...calendar([]), p('M32 30 A10 10 0 1 1 22 40', 'line'), p('M22 34 L22 40 L28 40', 'line')] },
  m1_comparetags: { parts: [p('M32 12 V54 M20 54 H44', 'line'), p('M8 20 H56', 'line'), p('M4 28 L12 20 L20 28 Z', 'main'), p('M44 28 L52 20 L60 28 Z', 'accent'), p('M2 28 H22 V36 H2 Z', 'main'), p('M42 28 H62 V36 H42 Z', 'accent'), c(32, 12, 3, 'accent2')] },
  // VAR-05-03 Butiker & köpcentrum
  m1_clothesrack: { parts: [p('M8 12 H56 M10 12 V58 M54 12 V58', 'line'), ...[0, 1, 2].map((k) => p(`M${16 + k * 14} 12 V16 L${10 + k * 14} 22 V48 H${22 + k * 14} V22 L${16 + k * 14} 16`, k === 1 ? 'accent' : 'main'))] },
  m1_electronics: { parts: [q(6, 10, 34, 24, 'main', 3), q(9, 13, 28, 18, 'light', 1), q(18, 34, 10, 4, 'main', 1), q(42, 22, 16, 30, 'accent', 3), q(44, 26, 12, 20, 'light', 1), p('M8 52 C16 44 24 48 28 40', 'line')] },
  m1_pharmacy: { parts: [p('M18 20 H46 V52 Q46 56 42 56 H22 Q18 56 18 52 Z', 'main'), q(22, 10, 20, 10, 'accent', 2), q(29, 30, 6, 16, 'light', 1), q(24, 35, 16, 6, 'light', 1)] },
  m1_bookgift: { parts: [q(6, 26, 26, 30, 'main', 2), q(10, 26, 3, 30, 'accent', 0), q(36, 34, 22, 22, 'accent', 2), q(45, 34, 4, 22, 'accent2', 0), p('M47 34 C40 26 36 32 47 34 C58 26 62 32 47 34', 'line')] },
  m1_opening: { parts: [p('M10 58 V10 H46 V58', 'line'), q(14, 14, 28, 44, 'main', 1), ...clockFace(28, 32, 10, 9, 0), c(40, 46, 2, 'light'), q(48, 26, 12, 8, 'accent', 2)] },
  m1_queue: { parts: [...person(12, 38, 0.8, 'main'), ...person(28, 38, 0.8, 'accent'), ...person(44, 38, 0.8, 'main'), q(52, 22, 10, 34, 'accent2', 2), p('M4 54 H50', 'line')] },
  m1_askstaff: { parts: [...person(22, 38, 1.2, 'main'), q(18, 40, 8, 6, 'light', 1), p('M36 10 H58 Q62 10 62 14 V28 Q62 32 58 32 H46 L40 38 V32 H36 Q32 32 32 28 V14 Q32 10 36 10 Z', 'accent'), p('M43 17 C43 13 51 13 51 17 C51 20 47 20 47 24', 'line'), c(47, 28, 1.2, 'line')] },
  // VAR-05-04 Köp på internet
  m1_searchbar: { parts: [q(4, 20, 56, 20, 'light', 10), p('M14 20 H50 A10 10 0 0 1 50 40 H14 A10 10 0 0 1 14 20 Z', 'line'), c(46, 29, 5, 'line'), p('M50 33 L54 37', 'line'), q(12, 28, 24, 4, 'main', 2)] },
  m1_reviews: { parts: [...[0, 1, 2, 3, 4].map((i) => p(`M${8 + i * 12} 18 L${10 + i * 12} 23 H${15 + i * 12} L${11 + i * 12} 26 L${13 + i * 12} 31 L${8 + i * 12} 28 L${3 + i * 12} 31 L${5 + i * 12} 26 L${1 + i * 12} 23 H${6 + i * 12} Z`, i < 4 ? 'accent' : 'light', i < 4 ? G.yellow : undefined)), q(6, 38, 52, 18, 'main', 3), p('M12 44 H44 M12 50 H36', 'line')] },
  m1_webcart: { parts: [q(4, 8, 56, 46, 'light', 4), q(4, 8, 56, 8, 'main', 4), p('M14 24 H20 L26 40 H46 L50 28 H23', 'line'), c(28, 46, 3, 'accent'), c(44, 46, 3, 'accent')] },
  m1_truck: { parts: [q(4, 18, 34, 26, 'main', 2), p('M38 26 H50 L58 36 V44 H38 Z', 'accent'), q(42, 29, 8, 7, 'light', 1), c(16, 46, 6, 'accent2'), c(48, 46, 6, 'accent2'), c(16, 46, 2.4, 'light'), c(48, 46, 2.4, 'light')] },
  m1_tracking: { parts: [...box(6, 30, 22, 20, 'main'), p('M28 44 C38 44 38 26 46 22', 'line'), p('M46 6 C40 6 39 14 46 22 C53 14 52 6 46 6 Z', 'accent'), c(46, 11, 2, 'light')] },
  m1_returnbox: { parts: [...box(18, 24, 28, 24, 'main'), p('M14 14 C6 18 4 28 8 34', 'line'), p('M4 30 L8 34 L12 30', 'line'), p('M52 52 L58 46 M52 40 L58 46', 'line')] },
  m1_fraudhook: { parts: [p('M36 6 V36 C36 48 20 48 20 38 V34', 'line'), p('M20 34 L16 40 M20 34 L24 40', 'line'), q(8, 44, 30, 16, 'main', 3), q(8, 48, 30, 3, 'accent2', 0), p('M44 30 L52 18 L60 30 Z', 'main', G.yellow), p('M52 22 V26', 'line')] },
  // VAR-05-05 Post & paket
  m1_postcard: { parts: [q(6, 12, 52, 38, 'light', 2), p('M6 12 H58 V50 H6 Z', 'line'), p('M32 16 V46', 'line'), q(42, 16, 12, 12, 'accent', 1), p('M10 40 L16 30 L22 36 L26 32 L30 40 Z', 'main', G.green), p('M36 34 H54 M36 40 H50', 'line')] },
  m1_envelopestamp: { parts: [q(6, 16, 52, 34, 'main', 3), p('M6 16 L32 36 L58 16', 'line'), q(44, 20, 10, 10, 'accent', 1), q(46, 22, 6, 6, 'light', 0)] },
  m1_parcelsizes: { parts: [...box(4, 40, 14, 14, 'main'), ...box(22, 30, 18, 24, 'accent'), ...box(44, 18, 16, 36, 'main')] },
  m1_pickuppoint: { parts: [p('M4 26 H44 L42 20 H6 Z', 'accent'), q(6, 26, 36, 30, 'light', 1), q(10, 32, 12, 24, 'main', 1), ...box(28, 38, 14, 12, 'main'), ...box(46, 38, 14, 18, 'accent')] },
  m1_abroad: { parts: [q(4, 30, 34, 24, 'main', 3), p('M4 30 L21 44 L38 30', 'line'), p('M30 18 C30 14 52 12 58 16 C52 20 30 20 30 18 Z', 'accent'), p('M42 16 L36 6 H40 L48 16 Z M42 18 L36 28 H40 L48 18 Z', 'accent2')] },
  m1_mailbox: { parts: [p('M14 22 C14 12 40 12 40 22 V40 H14 Z', 'main'), p('M40 22 H52 V40 H40', 'accent'), p('M40 22 C40 14 50 14 52 22', 'line'), q(24, 40, 6, 18, 'accent2', 1), p('M50 24 V10 H58 V16 H50', 'main', G.red)] },
  m1_lostparcel: { parts: [...box(8, 26, 30, 26, 'main'), p('M46 10 C46 4 56 4 56 10 C56 14 51 15 51 19', 'line'), c(51, 24, 1.6, 'line'), ...clockFace(50, 44, 9, 10, 10)] },
  // VAR-05-06 Vardagliga tjänster
  m1_toolbox: { parts: [q(6, 26, 52, 28, 'main', 3), p('M22 26 V18 H42 V26', 'line'), q(6, 34, 52, 4, 'accent', 0), q(28, 32, 8, 8, 'accent2', 1), p('M12 24 L22 12 M18 10 L24 16', 'line')] },
  m1_drycleaning: { parts: [p('M32 6 C36 6 36 12 32 12 L18 20 V56 H46 V20 L32 12', 'light'), p('M32 6 C36 6 36 12 32 12 L18 20 V56 H46 V20 L32 12', 'line'), p('M24 20 L32 30 L40 20 L36 56 H28 Z', 'main'), p('M30 30 L32 40 L34 30', 'accent')] },
  m1_support: { parts: [c(32, 30, 14, 'light'), p('M14 32 C14 12 50 12 50 32', 'line'), q(10, 28, 8, 14, 'main', 3), q(46, 28, 8, 14, 'main', 3), p('M48 42 C48 50 40 52 34 52', 'line'), c(32, 52, 3, 'accent'), c(27, 30, 1.6, 'line'), c(37, 30, 1.6, 'line')] },
  m1_libraryshelf: { parts: [q(6, 8, 52, 48, 'main', 2), q(10, 12, 44, 18, 'light', 1), q(10, 34, 44, 18, 'light', 1), ...[[12, 'accent'], [17, 'accent2'], [22, 'main'], [28, 'accent'], [34, 'accent2'], [42, 'main']].map(([x, r]) => q(x as number, 14, 4, 16, r as Role, 1)), ...[[12, 'main'], [18, 'accent'], [26, 'accent2'], [33, 'accent'], [40, 'main'], [46, 'accent2']].map(([x, r]) => q(x as number, 36, 5, 16, r as Role, 1))] },
  m1_bookingticket: { parts: [ticket(6, 16, 52, 32, 'main'), p('M20 16 V48', 'line'), p('M30 32 L36 38 L48 26', 'line')] },
  m1_membercard: { parts: [q(6, 14, 52, 34, 'main', 5), c(20, 30, 7, 'light'), p('M32 26 H50 M32 34 H46', 'line'), p('M46 40 L48 44 L52 44 L49 47 L50 51 L46 49 L42 51 L43 47 L40 44 L44 44 Z', 'main', G.yellow)] },
  m1_complain: { parts: [p('M8 10 H40 Q44 10 44 14 V32 Q44 36 40 36 H22 L14 44 V36 H8 Q4 36 4 32 V14 Q4 10 8 10 Z', 'main'), p('M24 14 L18 24 H24 L20 32 L30 20 H24 Z', 'light'), ...coin(48, 46, 10), p('M48 30 V36', 'line')] },
  // VAR-06-01 Kollektivtrafik
  m1_busstop: { parts: [p('M18 58 V14', 'line'), c(18, 12, 10, 'main'), q(12, 9, 12, 6, 'light', 1), q(28, 26, 30, 22, 'accent', 3), q(31, 30, 24, 8, 'light', 1), c(34, 50, 3, 'accent2'), c(52, 50, 3, 'accent2'), p('M8 58 H28', 'line')] },
  m1_metro: { parts: [p('M4 58 V32 C4 14 60 14 60 32 V58', 'main'), p('M12 58 V34 C12 22 52 22 52 34 V58 Z', 'light'), q(18, 32, 28, 22, 'accent', 5), q(22, 36, 20, 8, 'light', 2), c(26, 50, 2, 'light'), c(38, 50, 2, 'light')] },
  m1_ferry: { parts: [p('M4 38 H60 L52 52 H12 Z', 'main'), q(14, 26, 34, 12, 'light', 2), q(22, 16, 18, 10, 'accent', 2), q(36, 8, 4, 10, 'accent2', 1), p('M18 30 H22 M28 30 H32 M38 30 H42', 'line'), p('M2 58 C10 54 18 62 26 58 C34 54 42 62 50 58 C56 55 60 58 62 58', 'line')] },
  m1_periodcard: { parts: [ticket(4, 12, 40, 24, 'accent'), q(18, 26, 42, 26, 'main', 4), c(30, 39, 5, 'light'), p('M40 36 H54 M40 42 H50', 'line')] },
  m1_timetable: { parts: [q(6, 8, 52, 48, 'main', 3), ...[0, 1, 2, 3, 4].map((r) => all2(r))] },
  m1_disruption: { parts: [q(6, 22, 32, 26, 'main', 6), q(10, 26, 24, 10, 'light', 2), c(14, 44, 2.4, 'light'), c(30, 44, 2.4, 'light'), p('M4 54 H40', 'line'), p('M38 50 L50 26 L62 50 Z', 'main', G.yellow), p('M50 34 V42', 'line'), c(50, 46, 1.4, 'line')] },
  m1_linemap: { parts: [p('M6 20 H30 L42 32 H58 M6 44 H24 L34 34', 'line'), ...[[6, 20], [18, 20], [30, 20], [42, 32], [58, 32], [6, 44], [24, 44]].map(([x, y], i) => c(x!, y!, 4, i < 5 ? 'main' : 'accent')), c(34, 34, 5, 'accent2'), p('M48 46 C48 42 56 42 56 46 C56 49 52 49 52 52', 'line'), c(52, 56, 1.2, 'line')] },
  // VAR-06-02 Vägbeskrivningar
  m1_leftright: { parts: [p('M28 18 H10 M18 10 L10 18 L18 26', 'line'), q(30, 10, 4, 44, 'main', 2), p('M36 46 H54 M46 38 L54 46 L46 54', 'line'), c(32, 8, 3, 'accent')] },
  m1_roundabout: { parts: [c(32, 32, 24, 'main', G.grey), c(32, 32, 10, 'accent', G.green), p('M32 6 V16 M32 48 V58 M6 32 H16 M48 32 H58', 'line'), p('M44 20 A16 16 0 0 1 48 32', 'line')] },
  m1_zebra: { parts: [q(4, 8, 56, 48, 'main', 2, G.grey), ...[0, 1, 2, 3, 4].map((i) => q(10 + i * 10, 16, 6, 32, 'light', 1))] },
  m1_foldedmap: { parts: [p('M6 14 L22 8 L42 14 L58 8 V50 L42 56 L22 50 L6 56 Z', 'light'), p('M6 14 L22 8 V50 L6 56 Z', 'main'), p('M42 14 L58 8 V50 L42 56 Z', 'main'), p('M14 40 C22 36 30 30 36 22 C40 18 48 20 52 16', 'line')] },
  m1_distance: { parts: [p('M6 40 H58', 'line'), p('M6 34 V46 M58 34 V46 M19 37 V43 M32 37 V43 M45 37 V43', 'line'), c(6, 24, 5, 'main'), p('M58 14 C52 14 51 22 58 30 C65 22 64 14 58 14 Z', 'accent'), p('M14 24 H46 M40 18 L46 24 L40 30', 'line')] },
  m1_findaddress: { parts: [p('M8 34 L24 20 L40 34 V54 H8 Z', 'main'), q(20, 40, 8, 14, 'light', 1), q(28, 26, 8, 5, 'accent', 1), p('M50 8 C42 8 41 18 50 28 C59 18 58 8 50 8 Z', 'accent'), c(50, 14, 3, 'light')] },
  m1_route: { parts: [c(10, 50, 5, 'main'), c(54, 12, 5, 'accent'), p('M10 50 C10 30 30 46 32 30 C34 14 54 28 54 12', 'line'), ...[[20, 40], [32, 30], [44, 20]].map(([x, y]) => c(x!, y!, 2, 'accent2'))] },
  // VAR-06-03 Bil & vardagskörning
  m1_steeringwheel: { parts: [c(32, 32, 24, 'main'), c(32, 32, 18, 'light'), c(32, 32, 6, 'accent'), p('M14 32 H26 M38 32 H50 M32 38 V50', 'line')] },
  m1_carkey: { parts: [q(10, 18, 22, 30, 'main', 8), c(21, 28, 3, 'light'), c(21, 38, 3, 'light'), p('M32 30 H56 M48 30 V38 M54 30 V36', 'line'), c(10, 14, 4, 'accent')] },
  m1_parkingmeter: { parts: [q(20, 8, 24, 28, 'main', 6), q(24, 12, 16, 10, 'light', 2), q(28, 26, 8, 4, 'accent', 1), p('M32 36 V56 M22 56 H42', 'line'), ...coin(50, 20, 5)] },
  m1_fuelpump: { parts: [q(12, 10, 26, 46, 'main', 3), q(16, 14, 18, 12, 'light', 1), q(8, 54, 34, 4, 'accent2', 1), p('M38 20 H44 L50 26 V44 C50 48 56 48 56 44 V28', 'line'), q(52, 22, 6, 8, 'accent', 2)] },
  m1_wintertire: { parts: [c(28, 32, 22, 'main', G.grey), c(28, 32, 10, 'light'), p('M28 10 V18 M28 46 V54 M6 32 H14 M42 32 H50', 'line'), p('M52 10 V22 M46 16 H58 M48 12 L56 20 M56 12 L48 20', 'line')] },
  m1_triangleSign: { parts: [p('M32 6 L60 54 H4 Z', 'main', G.red), p('M32 16 L51 49 H13 Z', 'light'), p('M20 44 V39 L24 38 L27 33 H37 L40 38 L44 39 V44 Z', 'main'), c(25, 45, 2.4, 'line'), c(39, 45, 2.4, 'line')] },
  m1_hoodopen: { parts: [p('M6 46 V36 L14 34 L20 24 H40 L50 34 L58 36 V46 Z', 'main'), p('M40 24 L54 8 L58 12 L50 34', 'accent'), c(18, 48, 5, 'accent2'), c(48, 48, 5, 'accent2'), p('M54 4 C56 2 60 4 58 8', 'line'), p('M24 28 H36', 'line')] },
  // VAR-06-04 Cykel & gång
  m1_chaingear: { parts: [c(20, 34, 12, 'main'), c(20, 34, 4, 'light'), c(48, 38, 7, 'accent'), c(48, 38, 2, 'light'), p('M20 22 L48 31 M20 46 L48 45', 'line'), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return c(20 + Math.cos(a) * 13, 34 + Math.sin(a) * 13, 2, 'main'); })] },
  m1_bikelane: { parts: [p('M18 58 L26 6 H38 L46 58 Z', 'main', G.red), c(26, 36, 5, 'line'), c(38, 36, 5, 'line'), p('M26 36 L30 28 H36 L38 36 M30 28 L32 36', 'line'), p('M30 12 V18 M34 46 V54', 'line')] },
  m1_bikesign: { parts: [c(32, 32, 24, 'accent', G.blue), c(32, 32, 20, 'main', G.blue), c(22, 38, 6, 'line'), c(42, 38, 6, 'line'), p('M22 38 L28 28 H38 L42 38 M28 28 L32 38 L38 28 M26 24 H30', 'line')] },
  m1_hikingboot: { parts: [p('M14 10 H34 V34 L54 40 C58 42 58 48 54 50 H10 Z', 'main', G.brown), q(8, 50, 50, 6, 'accent', 2), p('M18 16 H30 M18 22 H30 M18 28 H30', 'line')] },
  m1_helmet: { parts: [p('M8 40 C8 20 22 12 34 12 C48 12 58 22 58 36 L40 40 Z', 'main'), p('M20 18 L26 30 M32 14 L36 30 M44 16 L46 30', 'line'), q(6, 40, 38, 5, 'accent', 2), p('M14 46 C18 54 30 54 34 46', 'line'), c(52, 40, 4, 'main', G.yellow)] },
  m1_pump: { parts: [q(24, 18, 10, 38, 'main', 3), q(14, 54, 30, 4, 'accent', 1), p('M26 18 V8 M18 8 H36', 'line'), p('M34 48 C44 48 50 40 56 34', 'line'), q(52, 28, 8, 8, 'accent2', 2)] },
  m1_slipperyroad: { parts: [p('M32 6 L60 54 H4 Z', 'main', G.red), p('M32 16 L51 49 H13 Z', 'light'), q(24, 28, 16, 8, 'main', 2), p('M22 42 C26 38 28 46 32 42 M34 46 C38 42 40 50 44 46', 'line')] },
  // VAR-06-05 Tåg & långresor
  m1_platform: { parts: [q(4, 44, 56, 8, 'main', 1), q(4, 14, 56, 5, 'accent', 1), p('M14 19 V44 M50 19 V44', 'line'), ...clockFace(32, 28, 7, 10, 10), p('M4 56 H60 M4 60 H60', 'line')] },
  m1_trainseat: { parts: [p('M18 8 H40 Q44 8 44 12 V38 H18 Z', 'main'), q(14, 38, 34, 10, 'accent', 3), p('M18 48 V56 M44 48 V56', 'line'), q(22, 12, 18, 6, 'light', 2)] },
  m1_luggagerack: { parts: [p('M6 16 H58', 'line'), p('M6 24 H58', 'line'), q(14, 8, 18, 16, 'main', 3), q(36, 10, 14, 14, 'accent', 3), p('M10 24 V30 M54 24 V30', 'line'), q(10, 36, 44, 18, 'light', 3)] },
  m1_connection: { parts: [p('M4 20 H28 C36 20 36 44 44 44 H60', 'line'), p('M4 44 H20 C28 44 28 20 36 20 H60', 'line'), c(32, 32, 5, 'main'), p('M54 16 L60 20 L54 24 M54 40 L60 44 L54 48', 'line')] },
  m1_nighttrain: { parts: [q(4, 28, 50, 20, 'main', 6), q(8, 32, 10, 8, 'light', 1), q(22, 32, 10, 8, 'light', 1), q(36, 32, 10, 8, 'light', 1), p('M2 52 H62', 'line'), p('M46 6 A10 10 0 1 0 56 20 A8 8 0 1 1 46 6 Z', 'main', G.yellow), c(24, 12, 1.6, 'accent2'), c(34, 18, 1.4, 'accent2')] },
  m1_rebook: { parts: [ticket(4, 14, 38, 24, 'main'), ticket(22, 30, 38, 24, 'accent'), p('M14 44 C10 40 10 34 14 30', 'line'), p('M12 34 L14 30 L18 32', 'line')] },
  m1_citytocity: { parts: [q(4, 30, 8, 22, 'main', 1), q(12, 22, 8, 30, 'accent', 1), q(44, 26, 8, 26, 'accent', 1), q(52, 32, 8, 20, 'main', 1), p('M20 40 C28 30 36 30 44 40', 'line'), c(32, 32, 3, 'accent2'), p('M2 52 H62', 'line')] },
  // VAR-06-06 Flyg & hotell
  m1_controltower: { parts: [q(26, 26, 12, 32, 'main', 1), p('M16 14 H48 L44 26 H20 Z', 'accent'), q(20, 16, 24, 6, 'light', 1), p('M32 6 V14', 'line'), c(32, 5, 2, 'accent2'), q(16, 56, 32, 3, 'accent2', 1)] },
  m1_securitygate: { parts: [p('M10 58 V10 H54 V58 H46 V18 H18 V58 Z', 'main'), ...person(32, 42, 0.9, 'accent'), p('M8 6 L4 2 M56 6 L60 2', 'line')] },
  m1_boardingpass: { parts: [ticket(4, 16, 56, 32, 'light'), p('M44 16 V48', 'line'), q(8, 22, 32, 6, 'main', 1), p('M10 36 H24 M10 42 H30', 'line'), p('M30 34 C30 32 38 32 40 34 C38 36 30 36 30 34 Z', 'accent'), p('M50 22 V42 M53 22 V42', 'line')] },
  m1_carryon: { parts: [q(16, 22, 32, 32, 'main', 5), p('M26 22 V8 H38 V22', 'line'), p('M24 22 V54 M40 22 V54', 'line'), c(20, 56, 3, 'accent2'), c(44, 56, 3, 'accent2')] },
  m1_planeseat: { parts: [q(30, 6, 28, 30, 'light', 12), c(44, 20, 8, 'accent', G.blue), p('M8 12 H24 Q28 12 28 16 V42 H8 Z', 'main'), q(4, 42, 30, 8, 'accent', 3), p('M8 50 V58 M30 50 V58', 'line')] },
  m1_keycard: { parts: [q(8, 14, 34, 22, 'main', 4), q(12, 18, 10, 6, 'light', 1), q(8, 28, 34, 3, 'accent2', 0), q(36, 24, 20, 32, 'accent', 3), c(46, 34, 3, 'light'), q(44, 42, 4, 8, 'light', 1)] },
  m1_checkinout: { parts: [p('M8 58 V8 H36 V58', 'main'), q(12, 12, 20, 46, 'light', 1), c(28, 34, 2, 'main'), q(38, 26, 14, 10, 'accent', 2), p('M44 46 H60 M54 40 L60 46 L54 52', 'line')] },
};

/** Catalog module → motif for R01 modules added in 0.27. */
export const R01_MODULE_MOTIF: Record<string, string> = {
  'SWC-VAR-03-04-01': 'm1_sizetag', 'SWC-VAR-03-04-02': 'm1_loosetight', 'SWC-VAR-03-04-03': 'm1_fittingroom', 'SWC-VAR-03-04-04': 'm1_stitches', 'SWC-VAR-03-04-05': 'm1_sewingmachine', 'SWC-VAR-03-04-06': 'm1_colormatch',
  'SWC-VAR-03-04-07': 'm1_bowtie', 'SWC-VAR-03-05-01': 'm1_washsymbol', 'SWC-VAR-03-05-02': 'm1_sortlaundry', 'SWC-VAR-03-05-03': 'm1_detergent', 'SWC-VAR-03-05-04': 'm1_iron', 'SWC-VAR-03-05-05': 'm1_stain',
  'SWC-VAR-03-05-06': 'm1_sheep', 'SWC-VAR-03-05-07': 'm1_buttonneedle', 'SWC-VAR-03-06-01': 'm1_hairstyle', 'SWC-VAR-03-06-02': 'm1_shampoo', 'SWC-VAR-03-06-03': 'm1_creamjar', 'SWC-VAR-03-06-04': 'm1_lipstick',
  'SWC-VAR-03-06-05': 'm1_perfume', 'SWC-VAR-03-06-06': 'm1_razor', 'SWC-VAR-03-06-07': 'm1_scissorscomb', 'SWC-VAR-04-01-01': 'm1_clock3', 'SWC-VAR-04-01-02': 'm1_weekstrip', 'SWC-VAR-04-01-03': 'm1_seasons',
  'SWC-VAR-04-01-04': 'm1_beforeafter', 'SWC-VAR-04-01-05': 'm1_timespan', 'SWC-VAR-04-01-06': 'm1_deadline', 'SWC-VAR-04-01-07': 'm1_bookslot', 'SWC-VAR-04-02-01': 'm1_wakeup', 'SWC-VAR-04-02-02': 'm1_getready',
  'SWC-VAR-04-02-03': 'm1_breakfast', 'SWC-VAR-04-02-04': 'm1_commute', 'SWC-VAR-04-02-05': 'm1_eveningmeal', 'SWC-VAR-04-02-06': 'm1_pillowmoon', 'SWC-VAR-04-02-07': 'm1_dailyloop', 'SWC-VAR-04-03-01': 'm1_todolist',
  'SWC-VAR-04-03-02': 'm1_priority', 'SWC-VAR-04-03-03': 'm1_reminder', 'SWC-VAR-04-03-04': 'm1_meetingbook', 'SWC-VAR-04-03-05': 'm1_postpone', 'SWC-VAR-04-03-06': 'm1_hurry', 'SWC-VAR-04-03-07': 'm1_dayoff',
  'SWC-VAR-04-04-01': 'm1_fetchleave', 'SWC-VAR-04-04-02': 'm1_drawer', 'SWC-VAR-04-04-03': 'm1_powerbtn', 'SWC-VAR-04-04-04': 'm1_gohome', 'SWC-VAR-04-04-05': 'm1_remember', 'SWC-VAR-04-04-06': 'm1_startstop',
  'SWC-VAR-04-04-07': 'm1_needwant', 'SWC-VAR-04-05-01': 'm1_counting', 'SWC-VAR-04-05-02': 'm1_weightvolume', 'SWC-VAR-04-05-03': 'm1_ruler', 'SWC-VAR-04-05-04': 'm1_speedometer', 'SWC-VAR-04-05-05': 'm1_approx',
  'SWC-VAR-04-05-06': 'm1_chocolate', 'SWC-VAR-04-05-07': 'm1_sizes', 'SWC-VAR-04-06-01': 'm1_lostkeys', 'SWC-VAR-04-06-02': 'm1_brokenplate', 'SWC-VAR-04-06-03': 'm1_misunderstand', 'SWC-VAR-04-06-04': 'm1_late',
  'SWC-VAR-04-06-05': 'm1_askhelp', 'SWC-VAR-04-06-06': 'm1_lendreturn', 'SWC-VAR-04-06-07': 'm1_dove', 'SWC-VAR-05-01-01': 'm1_aisles', 'SWC-VAR-05-01-02': 'm1_pricetag', 'SWC-VAR-05-01-03': 'm1_pearsgrapes',
  'SWC-VAR-05-01-04': 'm1_findproduct', 'SWC-VAR-05-01-05': 'm1_register', 'SWC-VAR-05-01-06': 'm1_discount', 'SWC-VAR-05-01-07': 'm1_returnfood', 'SWC-VAR-05-02-01': 'm1_notescoins', 'SWC-VAR-05-02-02': 'm1_cardcash',
  'SWC-VAR-05-02-03': 'm1_invoice', 'SWC-VAR-05-02-04': 'm1_phonepay', 'SWC-VAR-05-02-05': 'm1_change', 'SWC-VAR-05-02-06': 'm1_subscription', 'SWC-VAR-05-02-07': 'm1_comparetags', 'SWC-VAR-05-03-01': 'm1_clothesrack',
  'SWC-VAR-05-03-02': 'm1_electronics', 'SWC-VAR-05-03-03': 'm1_pharmacy', 'SWC-VAR-05-03-04': 'm1_bookgift', 'SWC-VAR-05-03-05': 'm1_opening', 'SWC-VAR-05-03-06': 'm1_queue', 'SWC-VAR-05-03-07': 'm1_askstaff',
  'SWC-VAR-05-04-01': 'm1_searchbar', 'SWC-VAR-05-04-02': 'm1_reviews', 'SWC-VAR-05-04-03': 'm1_webcart', 'SWC-VAR-05-04-04': 'm1_truck', 'SWC-VAR-05-04-05': 'm1_tracking', 'SWC-VAR-05-04-06': 'm1_returnbox',
  'SWC-VAR-05-04-07': 'm1_fraudhook', 'SWC-VAR-05-05-01': 'm1_postcard', 'SWC-VAR-05-05-02': 'm1_envelopestamp', 'SWC-VAR-05-05-03': 'm1_parcelsizes', 'SWC-VAR-05-05-04': 'm1_pickuppoint', 'SWC-VAR-05-05-05': 'm1_abroad',
  'SWC-VAR-05-05-06': 'm1_mailbox', 'SWC-VAR-05-05-07': 'm1_lostparcel', 'SWC-VAR-05-06-01': 'm1_toolbox', 'SWC-VAR-05-06-02': 'm1_drycleaning', 'SWC-VAR-05-06-03': 'm1_support', 'SWC-VAR-05-06-04': 'm1_libraryshelf',
  'SWC-VAR-05-06-05': 'm1_bookingticket', 'SWC-VAR-05-06-06': 'm1_membercard', 'SWC-VAR-05-06-07': 'm1_complain', 'SWC-VAR-06-01-01': 'm1_busstop', 'SWC-VAR-06-01-02': 'm1_metro', 'SWC-VAR-06-01-03': 'm1_ferry',
  'SWC-VAR-06-01-04': 'm1_periodcard', 'SWC-VAR-06-01-05': 'm1_timetable', 'SWC-VAR-06-01-06': 'm1_disruption', 'SWC-VAR-06-01-07': 'm1_linemap', 'SWC-VAR-06-02-01': 'm1_leftright', 'SWC-VAR-06-02-02': 'm1_roundabout',
  'SWC-VAR-06-02-03': 'm1_zebra', 'SWC-VAR-06-02-04': 'm1_foldedmap', 'SWC-VAR-06-02-05': 'm1_distance', 'SWC-VAR-06-02-06': 'm1_findaddress', 'SWC-VAR-06-02-07': 'm1_route', 'SWC-VAR-06-03-01': 'm1_steeringwheel',
  'SWC-VAR-06-03-02': 'm1_carkey', 'SWC-VAR-06-03-03': 'm1_parkingmeter', 'SWC-VAR-06-03-04': 'm1_fuelpump', 'SWC-VAR-06-03-05': 'm1_wintertire', 'SWC-VAR-06-03-06': 'm1_triangleSign', 'SWC-VAR-06-03-07': 'm1_hoodopen',
  'SWC-VAR-06-04-01': 'm1_chaingear', 'SWC-VAR-06-04-02': 'm1_bikelane', 'SWC-VAR-06-04-03': 'm1_bikesign', 'SWC-VAR-06-04-04': 'm1_hikingboot', 'SWC-VAR-06-04-05': 'm1_helmet', 'SWC-VAR-06-04-06': 'm1_pump',
  'SWC-VAR-06-04-07': 'm1_slipperyroad', 'SWC-VAR-06-05-01': 'm1_platform', 'SWC-VAR-06-05-02': 'm1_trainseat', 'SWC-VAR-06-05-03': 'm1_luggagerack', 'SWC-VAR-06-05-04': 'm1_connection', 'SWC-VAR-06-05-05': 'm1_nighttrain',
  'SWC-VAR-06-05-06': 'm1_rebook', 'SWC-VAR-06-05-07': 'm1_citytocity', 'SWC-VAR-06-06-01': 'm1_controltower', 'SWC-VAR-06-06-02': 'm1_securitygate', 'SWC-VAR-06-06-03': 'm1_boardingpass', 'SWC-VAR-06-06-04': 'm1_carryon',
  'SWC-VAR-06-06-05': 'm1_planeseat', 'SWC-VAR-06-06-06': 'm1_keycard', 'SWC-VAR-06-06-07': 'm1_checkinout',
};
