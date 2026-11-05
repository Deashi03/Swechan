/**
 * Illustration motifs for catalog areas and modules (0.5 style exploration).
 * Each motif is geometry only, on a 64×64 grid; `render.ts` draws the same
 * geometry in different visual styles. Roles decide colour per style:
 *   main / accent / accent2 = filled shapes, light = pale filled detail,
 *   line = stroke-only detail (steam, cuts, code…).
 */
export type Role = 'main' | 'accent' | 'accent2' | 'light' | 'line';
/** `hue` (optional) fixes a natural colour for one part, e.g. green leaves, independent of the area colour. */
export type Part = ({ t: 'path'; d: string } | { t: 'circle'; cx: number; cy: number; rad: number } | { t: 'rect'; x: number; y: number; w: number; h: number; rx?: number }) & { r: Role; hue?: number };
export type Motif = { parts: Part[] };

const p = (d: string, r: Role, hue?: number): Part => ({ t: 'path', d, r, hue });
const c = (cx: number, cy: number, rad: number, r: Role, hue?: number): Part => ({ t: 'circle', cx, cy, rad, r, hue });
const q = (x: number, y: number, w: number, h: number, r: Role, rx = 1.5, hue?: number): Part => ({ t: 'rect', x, y, w, h, rx, r, hue });
/** Natural hues for food and nature motifs. */
export const H = { green: 115, leaf: 95, orange: 26, red: 6, yellow: 46, brown: 28, blue: 210, grey: 220, purple: 285 } as const;

export const MOTIFS: Record<string, Motif> = {
  // ── root areas ──────────────────────────────────────────────
  house: { parts: [
    q(40, 15, 6, 12, 'main', 1), q(16, 30, 32, 22, 'main', 2),
    p('M10 33 L32 13 L54 33 Z', 'accent'),
    q(28, 39, 9, 13, 'accent2', 1.5), q(19, 36, 6, 6, 'light', 1), q(40, 36, 5, 6, 'light', 1),
  ] },
  heart: { parts: [
    p('M32 52 C14 40 10 28 17 21 C23 15 30 18 32 24 C34 18 41 15 47 21 C54 28 50 40 32 52 Z', 'main'),
    c(23, 26, 3, 'light'),
    p('M8 36 H22 L26 28 L31 44 L35 33 L38 36 H56', 'line'),
  ] },
  institution: { parts: [
    p('M10 24 L32 12 L54 24 Z', 'accent'), q(12, 24, 40, 4, 'main', 1),
    q(16, 29, 5, 18, 'light', 1), q(25, 29, 5, 18, 'light', 1), q(34, 29, 5, 18, 'light', 1), q(43, 29, 5, 18, 'light', 1),
    q(10, 47, 44, 6, 'main', 1.5), c(32, 19, 2, 'accent2'),
  ] },
  book: { parts: [
    p('M32 20 C25 15 17 15 9 17 V47 C17 45 25 45 32 50 Z', 'main'),
    p('M32 20 C39 15 47 15 55 17 V47 C47 45 39 45 32 50 Z', 'accent'),
    p('M14 24 C19 23 24 23 28 25 M14 30 C19 29 24 29 28 31 M14 36 C19 35 24 35 28 37', 'line'),
    p('M44 8 L50 10 L40 34 L37 35 L37 32 Z', 'accent2'),
  ] },
  mountain: { parts: [
    c(46, 18, 7, 'accent2'),
    p('M6 52 L24 24 L33 37 L40 29 L58 52 Z', 'main'),
    p('M24 24 L19 32 L23 30 L26 33 L29 30 Z', 'light'),
    p('M6 52 C18 47 28 49 36 52 Z', 'accent'),
  ] },
  flask: { parts: [
    p('M26 10 H38 V23 L50 47 Q52 53 46 53 H18 Q12 53 14 47 L26 23 Z', 'light'),
    p('M18.5 39 H45.5 L49 47 Q50.5 51 46 51 H18 Q13.5 51 15 47 Z', 'main'),
    q(24, 8, 16, 4, 'accent', 1.5),
    c(27, 45, 2.2, 'accent2'), c(35, 42, 1.6, 'accent2'), c(31, 33, 1.8, 'accent'), c(36, 27, 1.3, 'accent'),
  ] },
  laptop: { parts: [
    q(13, 14, 38, 26, 'main', 3), q(17, 18, 30, 18, 'light', 1.5),
    p('M6 44 H58 L54 51 H10 Z', 'accent'),
    p('M28 23 L24 27 L28 31 M36 23 L40 27 L36 31', 'line'), c(32, 47.5, 1.3, 'accent2'),
  ] },
  palette: { parts: [
    p('M32 10 C47 10 56 20 56 31 C56 39 50 42 45 40 C40 38 36 41 38 46 C40 52 36 55 31 55 C18 55 8 45 8 32 C8 19 18 10 32 10 Z', 'main'),
    c(21, 24, 4, 'accent'), c(32, 19, 4, 'accent2'), c(43, 24, 4, 'light'), c(18, 36, 4, 'accent2'), c(26, 45, 3.5, 'accent'),
  ] },
  // ── modules: Matlagningens verb ──────────────────────────────
  knife: { parts: [
    q(8, 37, 48, 15, 'main', 4), c(50, 44.5, 2, 'light'),
    p('M12 31 L42 22 L45 27 L15 34 Z', 'light'),
    p('M42 22 L55 18 L57 23 L45 27 Z', 'accent2'),
    c(20, 44, 4, 'accent'), c(29, 44, 4, 'accent'), c(38, 44, 4, 'accent'),
  ] },
  pot: { parts: [
    p('M24 21 Q20 17 24 13 Q28 9 24 5 M32 21 Q28 17 32 13 Q36 9 32 5 M40 21 Q36 17 40 13 Q44 9 40 5', 'line'),
    p('M14 31 H50 V44 Q50 53 41 53 H23 Q14 53 14 44 Z', 'main'),
    p('M8 33 H14 V38 H8 Z M50 33 H56 V38 H50 Z', 'main'),
    p('M11 31 H53 Q52 25 32 24 Q12 25 11 31 Z', 'accent'), q(29, 20, 6, 4, 'accent2', 1.5),
  ] },
  pan: { parts: [
    p('M42 35 L58 29 L60 34 L44 40 Z', 'accent'),
    c(27, 37, 17, 'main'), c(27, 37, 13, 'accent'),
    p('M18 34 C18 28 25 26 29 29 C34 27 38 32 36 37 C38 42 31 46 26 44 C20 46 16 40 18 34 Z', 'light'),
    c(27, 36, 4.5, 'accent2'),
  ] },
  bread: { parts: [
    p('M8 47 C8 30 19 23 32 23 C45 23 56 30 56 47 Q56 52 51 52 H13 Q8 52 8 47 Z', 'main'),
    p('M14 44 C16 34 23 29 32 29 C41 29 48 34 50 44 Z', 'accent'),
    p('M21 37 L26 31 M30 37 L35 31 M39 37 L44 31', 'line'),
  ] },
  whisk: { parts: [
    p('M8 33 H56 Q54 53 32 53 Q10 53 8 33 Z', 'main'),
    p('M14 37 C24 40 40 40 50 37', 'line'),
    q(36, 4, 5, 14, 'accent', 2.5),
    p('M38 18 C27 22 26 34 33 34 C40 34 44 22 38 18 Z', 'light'),
    p('M38 18 C33 23 32 31 33 34 M38 18 C40 24 38 31 33 34', 'line'),
    c(18, 28, 2, 'accent2'), c(48, 27, 1.6, 'accent2'),
  ] },
  shaker: { parts: [
    p('M21 24 H39 L41 52 H19 Z', 'light'),
    p('M20.5 33 H39.5 L41 52 H19 Z', 'main'),
    p('M21 24 Q21 13 30 13 Q39 13 39 24 Z', 'accent'),
    c(27, 18, 1, 'light'), c(30, 16, 1, 'light'), c(33, 18, 1, 'light'),
    p('M44 45 C43 33 51 27 58 26 C59 36 53 44 44 45 Z', 'accent2'),
    p('M44 45 C48 39 52 34 56 29', 'line'),
  ] },
  cloche: { parts: [
    q(6, 47, 52, 5, 'accent', 2.5),
    p('M11 47 Q11 23 32 23 Q53 23 53 47 Z', 'main'),
    c(32, 19, 3.5, 'accent2'),
    p('M18 41 Q18 31 27 28', 'line'),
  ] },
  // ── published modules before 0.5 ─────────────────────────────
  carrot: { parts: [
    p('M30 20 L42 22 L26 54 Q24 57 23 53 Z', 'main', H.orange),
    p('M28 30 L33 31 M26 38 L30 39 M24 46 L27 47', 'line'),
    p('M36 21 C34 13 38 8 42 6 C42 12 40 17 37 21 Z', 'main', H.green),
    p('M38 22 C42 15 48 13 53 14 C50 19 45 22 39 23 Z', 'main', H.green),
    p('M35 21 C30 15 24 14 20 16 C24 20 29 22 34 22 Z', 'main', H.green),
  ] },
  bucket: { parts: [
    p('M14 26 H44 L40 52 Q40 54 38 54 H20 Q18 54 18 52 Z', 'main'),
    q(12, 23, 34, 5, 'accent', 2.5),
    p('M17 25 C17 10 41 10 41 25', 'line'),
    q(48, 8, 4, 34, 'accent2', 2), p('M44 40 H56 L58 54 H42 Z', 'accent'),
    p('M46 44 V52 M50 44 V52 M54 44 V52', 'line'),
    c(26, 18, 3, 'light'), c(33, 15, 2, 'light'),
  ] },
  cubes: { parts: [
    p('M10 36 L22 30 L34 36 L22 42 Z', 'light'), p('M10 36 V50 L22 56 V42 Z', 'main'), p('M34 36 V50 L22 56 V42 Z', 'accent'),
    p('M38 30 C38 22 46 14 46 14 C46 14 54 22 54 30 C54 35 50 38 46 38 C42 38 38 35 38 30 Z', 'accent2'),
    c(43, 29, 2, 'light'),
    p('M18 12 Q14 18 18 22 M26 10 Q22 16 26 22', 'line'),
  ] },
  atom: { parts: [
    p('M32 13 C46 13 56 22 56 32 C56 42 46 51 32 51 C18 51 8 42 8 32 C8 22 18 13 32 13 Z M32 18 C21 18 13 24 13 32 C13 40 21 46 32 46 C43 46 51 40 51 32 C51 24 43 18 32 18 Z', 'main'),
    p('M15 15 C25 8 46 30 49 49 C39 56 18 34 15 15 Z M18 18 C22 28 34 44 45 46 C42 36 30 20 18 18 Z', 'accent'),
    c(32, 32, 6, 'accent2'), c(56, 32, 3, 'light'), c(15, 15, 3, 'light'),
  ] },
  shield: { parts: [
    p('M32 8 L52 15 V30 C52 43 43 51 32 56 C21 51 12 43 12 30 V15 Z', 'main'),
    p('M32 8 L52 15 V30 C52 43 43 51 32 56 Z', 'accent'),
    p('M32 18 V46 M20 28 H44', 'line'),
    c(32, 28, 4, 'light'),
  ] },
  castle: { parts: [
    p('M8 54 V26 H13 V30 H17 V26 H22 V54 Z', 'main'), p('M42 54 V26 H47 V30 H51 V26 H56 V54 Z', 'main'),
    p('M20 54 V34 H44 V54 Z', 'accent'),
    p('M27 54 V46 Q32 40 37 46 V54 Z', 'line'), p('M27 54 V46 Q32 40 37 46 V54 Z', 'accent2'),
    p('M32 34 V14', 'line'), p('M32 14 L44 18 L32 22 Z', 'accent2'),
    q(13, 36, 4, 6, 'light', 1), q(47, 36, 4, 6, 'light', 1),
  ] },
  // ── Råvaror & skafferi ───────────────────────────────────────
  cherries: { parts: [
    p('M22 40 C24 28 30 18 40 12 M42 40 C42 28 41 20 40 12', 'line'),
    p('M40 12 C46 8 54 10 56 14 C50 17 44 16 40 12 Z', 'main', H.green),
    c(21, 44, 9, 'main', H.red), c(42, 44, 9, 'main', H.red), c(18, 41, 2.5, 'light'), c(39, 41, 2.5, 'light'),
  ] },
  wheat: { parts: [
    p('M32 56 V14', 'line'),
    p('M32 18 C26 16 24 10 26 6 C31 8 33 13 32 18 Z M32 18 C38 16 40 10 38 6 C33 8 31 13 32 18 Z', 'main', H.yellow),
    p('M32 28 C25 26 22 20 23 15 C29 17 32 22 32 28 Z M32 28 C39 26 42 20 41 15 C35 17 32 22 32 28 Z', 'main', H.yellow),
    p('M32 39 C25 37 21 31 22 26 C28 28 32 33 32 39 Z M32 39 C39 37 43 31 42 26 C36 28 32 33 32 39 Z', 'accent', H.yellow),
    p('M20 50 C26 46 30 48 32 52 M44 50 C38 46 34 48 32 52', 'line'),
  ] },
  beanpod: { parts: [
    p('M8 38 C14 22 40 14 56 20 C52 34 26 46 8 38 Z', 'main', H.green),
    p('M12 37 C20 28 38 22 52 23 C48 31 28 40 12 37 Z', 'light', H.green),
    c(20, 34, 4, 'accent', H.green), c(30, 30, 4.5, 'accent', H.green), c(41, 27, 4, 'accent', H.green),
    c(18, 50, 4, 'main', H.red), c(28, 52, 4, 'main', H.brown), c(38, 50, 4, 'accent2'),
  ] },
  acorn: { parts: [
    p('M18 30 C18 46 26 54 32 56 C38 54 46 46 46 30 Z', 'main', H.brown),
    p('M14 30 C14 20 22 15 32 15 C42 15 50 20 50 30 Z', 'accent', H.brown),
    p('M32 15 V8', 'line'),
    p('M20 25 H44 M18 21 H46', 'line'), c(24, 38, 3, 'light'),
  ] },
  herbpot: { parts: [
    p('M32 34 C30 24 24 18 16 18 C18 26 24 32 32 34 Z', 'main', H.green),
    p('M32 34 C34 22 42 14 50 14 C48 24 40 32 32 34 Z', 'main', H.leaf),
    p('M32 34 C30 22 32 12 36 8 C38 16 36 26 32 34 Z', 'accent', H.green),
    p('M18 34 H46 L42 54 Q42 56 40 56 H24 Q22 56 22 54 Z', 'main', H.orange),
    q(16, 33, 32, 6, 'accent', 2, H.orange),
  ] },
  jar: { parts: [
    p('M14 22 H34 V52 Q34 55 31 55 H17 Q14 55 14 52 Z', 'light'),
    p('M15 32 H33 V52 Q33 54 31 54 H17 Q15 54 15 52 Z', 'main', H.red),
    q(12, 15, 24, 8, 'accent', 2),
    q(17, 37, 14, 9, 'light', 1.5),
    p('M38 28 H56 V54 H38 Z', 'main'), p('M38 28 H56 V33 H38 Z M38 49 H56 V54 H38 Z', 'accent2'),
    q(41, 37, 12, 8, 'light', 1),
  ] },
  // ── Kött, fisk & vegetariskt ─────────────────────────────────
  steak: { parts: [
    p('M10 30 C10 18 24 12 36 14 C50 16 56 26 54 36 C52 48 38 54 24 52 C14 50 10 42 10 30 Z', 'main', H.red),
    p('M18 30 C18 23 26 19 34 20 C44 21 48 28 46 35 C44 42 34 46 26 44 C20 42 18 36 18 30 Z', 'accent', H.red),
    c(40, 28, 5, 'light'), c(40, 28, 2.5, 'line'),
  ] },
  eggs: { parts: [
    p('M6 50 H58 C58 54 54 57 50 57 H14 C10 57 6 54 6 50 Z', 'main', H.brown),
    p('M14 50 C14 38 18 28 23 28 C28 28 32 38 32 50 Z', 'light'),
    p('M30 50 C30 36 35 24 41 24 C47 24 52 36 52 50 Z', 'accent', H.yellow),
    c(20, 18, 6, 'main', H.yellow), p('M15 14 L12 12 M25 14 L28 12', 'line'), c(18, 17, 1, 'line'),
  ] },
  fish: { parts: [
    p('M8 32 C16 20 34 16 46 26 L58 18 L56 32 L58 46 L46 38 C34 48 16 44 8 32 Z', 'main', H.blue),
    p('M14 34 C22 40 34 42 44 36 C34 38 22 38 14 34 Z', 'light'),
    c(18, 29, 2.6, 'line'),
    p('M30 22 C34 28 34 36 30 42', 'line'),
  ] },
  tofu: { parts: [
    p('M10 30 L28 22 L48 30 L30 38 Z', 'light'), p('M10 30 V44 L30 52 V38 Z', 'light', H.yellow), p('M48 30 V44 L30 52 V38 Z', 'accent', H.yellow),
    p('M40 22 C40 12 48 8 56 8 C56 16 50 22 40 22 Z', 'main', H.green), p('M40 22 C44 17 48 13 53 11', 'line'),
  ] },
  milk: { parts: [
    p('M20 18 L32 8 L44 18 V56 H20 Z', 'light'), p('M20 18 L32 8 L44 18 Z', 'accent2'),
    q(20, 30, 24, 14, 'main', 0, H.blue), c(32, 37, 4, 'light'),
    p('M44 18 L50 14 V52 L44 56 Z', 'accent2'),
  ] },
  basket: { parts: [
    c(22, 26, 7, 'main', H.red), c(34, 22, 7, 'main', H.green), c(44, 28, 6, 'main', H.orange),
    p('M8 30 H56 L50 54 Q49 56 47 56 H17 Q15 56 14 54 Z', 'main', H.brown),
    p('M14 38 H50 M16 46 H48 M24 30 V56 M32 30 V56 M40 30 V56', 'line'),
  ] },
  fridge: { parts: [
    q(16, 6, 32, 52, 'light', 5), q(16, 6, 32, 52, 'main', 5, H.blue),
    q(19, 9, 26, 14, 'light', 3), q(19, 26, 26, 29, 'light', 3),
    p('M40 13 V19 M40 30 V40', 'line'), c(38, 48, 4, 'accent', H.orange),
  ] },
  // ── Smaker & konsistenser ────────────────────────────────────
  tongue: { parts: [
    p('M10 26 C10 16 20 10 32 10 C44 10 54 16 54 26 C54 32 50 36 44 36 H20 C14 36 10 32 10 26 Z', 'main', H.red),
    p('M20 34 C20 46 25 56 32 56 C39 56 44 46 44 34 Z', 'accent', H.red),
    p('M32 38 V50', 'line'), c(20, 22, 2.5, 'light'), c(44, 22, 2.5, 'light'), c(32, 18, 2.5, 'light'),
  ] },
  lollipop: { parts: [
    q(30, 34, 4, 24, 'light', 2),
    c(32, 24, 16, 'main', H.red), c(32, 24, 11, 'light'), c(32, 24, 6, 'accent', H.yellow),
    p('M46 44 L56 40 L54 50 Z M8 44 L18 40 L16 50 Z', 'accent2'),
  ] },
  chili: { parts: [
    p('M40 14 C30 20 22 34 14 50 C12 54 18 56 22 52 C32 42 42 30 46 20 Z', 'main', H.red),
    p('M38 16 C34 22 30 28 26 36', 'line'),
    p('M40 14 C42 8 48 6 52 8 C50 12 46 14 44 18 Z', 'main', H.green),
    p('M50 30 C54 34 54 40 50 44 M56 26 C60 32 60 42 56 48', 'line'),
  ] },
  chips: { parts: [
    p('M14 22 H50 L46 58 H18 Z', 'main', H.red), q(18, 30, 28, 14, 'light', 3),
    p('M18 22 C20 12 26 8 30 14 C33 8 40 8 42 16 C46 10 52 14 50 22 Z', 'accent', 30),
    c(32, 37, 4, 'main', H.yellow),
  ] },
  jelly: { parts: [
    p('M16 48 C16 30 20 18 32 18 C44 18 48 30 48 48 Z', 'main', H.red),
    p('M22 44 C22 32 25 24 31 22', 'line'),
    q(10, 47, 44, 6, 'light', 3), c(32, 14, 4, 'accent', H.red),
  ] },
  banana: { parts: [
    p('M12 22 C14 44 34 54 54 44 C50 42 46 42 42 42 C28 42 20 34 18 22 Z', 'main', H.yellow),
    p('M18 22 C20 34 28 42 42 42 C34 38 26 32 22 22 Z', 'accent', H.yellow),
    p('M12 22 L14 16 L19 18 L18 22 Z', 'main', H.brown), c(30, 44, 1.8, 'main', H.brown), c(38, 46, 1.5, 'main', H.brown),
  ] },
  dish: { parts: [
    p('M6 40 H58 C58 50 46 56 32 56 C18 56 6 50 6 40 Z', 'light'),
    p('M14 40 C14 30 22 24 32 24 C42 24 50 30 50 40 Z', 'main'),
    p('M20 18 L22 13 L24 18 L29 18 L25 21 L27 26 L22 23 L17 26 L19 21 L15 18 Z', 'accent', H.yellow),
    p('M40 14 L41.5 10 L43 14 L47 14 L44 16.5 L45 20 L41.5 18 L38 20 L39 16.5 L36 14 Z', 'accent', H.yellow),
  ] },
  // ── Måltider & servering ─────────────────────────────────────
  toast: { parts: [
    p('M8 30 C8 22 14 18 20 18 H34 C40 18 46 22 46 30 V52 H8 Z', 'main', H.brown),
    p('M12 30 C12 25 16 22 20 22 H34 C38 22 42 25 42 30 V48 H12 Z', 'light', H.yellow),
    p('M40 32 H56 V48 C56 52 53 55 48 55 C43 55 40 52 40 48 Z', 'accent2'), p('M56 36 C60 36 60 44 56 44', 'line'),
    p('M44 26 Q42 22 44 18 M50 26 Q48 22 50 18', 'line'),
  ] },
  lunchbox: { parts: [
    q(8, 22, 48, 32, 'main', 5), q(12, 26, 18, 24, 'light', 3), q(34, 26, 18, 11, 'light', 3), q(34, 39, 18, 11, 'light', 3),
    c(21, 38, 5, 'accent', H.orange), c(40, 31, 3, 'main', H.green), c(46, 31, 3, 'main', H.green), q(37, 42, 12, 5, 'accent', 2, H.red),
  ] },
  bun: { parts: [
    c(32, 34, 20, 'main', H.brown),
    p('M32 34 C32 26 42 26 42 34 C42 44 26 44 24 34 C22 22 40 18 46 28', 'line'),
    c(24, 22, 1.6, 'light'), c(38, 20, 1.6, 'light'), c(46, 40, 1.6, 'light'), c(20, 44, 1.6, 'light'),
  ] },
  plate: { parts: [
    c(32, 34, 20, 'light'), c(32, 34, 14, 'accent2'),
    c(28, 32, 6, 'main', H.brown), c(37, 38, 4, 'main', H.green), c(36, 28, 3.5, 'main', H.orange),
    q(5, 18, 3, 32, 'main', 1.5, H.grey), q(56, 18, 3, 32, 'main', 1.5, H.grey),
  ] },
  menu: { parts: [
    q(16, 8, 32, 48, 'light', 4), q(16, 8, 32, 10, 'main', 4),
    p('M22 26 H42 M22 33 H38 M22 40 H42 M22 47 H34', 'line'),
    c(44, 33, 2, 'accent'), c(44, 47, 2, 'accent'),
  ] },
  receipt: { parts: [
    p('M16 8 H48 V56 L44 52 L40 56 L36 52 L32 56 L28 52 L24 56 L20 52 L16 56 Z', 'light'),
    p('M22 18 H42 M22 26 H36 M22 34 H40', 'line'),
    q(22, 41, 20, 6, 'main', 2), c(48, 48, 9, 'accent', H.yellow), p('M45 48 H51 M48 45 V51', 'line'),
  ] },
  chat: { parts: [
    p('M6 14 H38 C41 14 42 16 42 18 V32 C42 35 40 36 38 36 H18 L10 42 V36 H10 C7 36 6 34 6 32 Z', 'main'),
    p('M24 28 H54 C57 28 58 30 58 32 V46 C58 49 56 50 54 50 H50 V56 L42 50 H28 C25 50 24 48 24 46 Z', 'accent'),
    c(16, 25, 2, 'light'), c(24, 25, 2, 'light'), c(32, 25, 2, 'light'),
  ] },
  // ── Kost & matkultur ────────────────────────────────────────
  meatballs: { parts: [
    p('M8 34 H56 C56 46 46 54 32 54 C18 54 8 46 8 34 Z', 'light'),
    c(22, 30, 7, 'main', H.brown), c(34, 27, 7, 'main', H.brown), c(44, 32, 6, 'main', H.brown),
    c(28, 36, 5, 'accent', H.red), c(39, 38, 3.5, 'accent', H.red),
    p('M8 34 H56', 'line'),
  ] },
  sushi: { parts: [
    q(6, 40, 52, 8, 'main', 3, H.brown),
    q(10, 28, 20, 12, 'light', 4), p('M10 30 C14 24 26 24 30 30 V34 H10 Z', 'main', H.orange),
    c(44, 32, 9, 'main', H.grey), c(44, 32, 6, 'light'), c(44, 32, 3, 'accent', H.red),
    p('M14 12 L38 26 M20 10 L42 24', 'line'),
  ] },
  globe: { parts: [
    c(32, 32, 22, 'main', H.blue),
    p('M18 18 C24 20 26 26 22 30 C18 34 20 40 16 42 C12 36 12 24 18 18 Z', 'main', H.green),
    p('M36 14 C42 16 46 22 44 28 C40 26 36 30 38 36 C34 40 30 36 32 30 C34 24 30 18 36 14 Z', 'main', H.green),
    p('M40 44 C44 42 48 44 46 48 C42 50 38 48 40 44 Z', 'main', H.green),
    c(26, 22, 2, 'light'),
  ] },
  warning: { parts: [
    p('M32 6 L58 52 H6 Z', 'main', H.yellow), p('M32 14 L51 48 H13 Z', 'light'),
    p('M26 34 C26 28 30 26 32 28 C34 26 38 28 38 34 C38 40 34 42 32 40 C30 42 26 40 26 34 Z', 'main', H.brown),
    p('M29 33 H35 M29 37 H35', 'line'),
  ] },
  apple: { parts: [
    p('M32 20 C24 14 10 18 12 34 C14 48 24 56 32 52 C40 56 50 48 52 34 C54 18 40 14 32 20 Z', 'main', H.red),
    p('M32 20 C32 14 34 10 38 8', 'line'),
    p('M34 16 C36 8 46 8 48 10 C46 16 40 18 34 16 Z', 'main', H.green),
    c(22, 30, 3, 'light'),
  ] },
  compost: { parts: [
    p('M14 22 H50 L46 56 H18 Z', 'main', H.green), q(10, 16, 44, 7, 'accent', 3, H.green),
    p('M26 2 L34 8 M34 2 L28 10', 'line'),
    p('M24 32 C28 28 36 28 40 32 C36 36 28 36 24 32 Z', 'light'),
    p('M32 34 L28 44 H36 Z', 'light'), p('M26 46 C28 40 36 40 38 46', 'line'),
  ] },
  candles: { parts: [
    q(14, 30, 10, 26, 'light', 2), q(27, 22, 10, 34, 'light', 2), q(40, 30, 10, 26, 'light', 2),
    p('M19 22 C16 26 22 28 19 22 Z M19 18 C14 24 16 30 19 30 C22 30 24 24 19 18 Z', 'accent', H.yellow),
    p('M32 10 C27 16 29 22 32 22 C35 22 37 16 32 10 Z', 'accent', H.yellow),
    p('M45 18 C40 24 42 30 45 30 C48 30 50 24 45 18 Z', 'accent', H.yellow),
    q(8, 54, 48, 4, 'main', 2, H.red),
  ] },
  // ── Hem & boende: Bostadstyper & rum ────────────────────────
  apartment: { parts: [
    q(14, 10, 36, 46, 'main', 2),
    q(19, 16, 7, 7, 'light', 1), q(29, 16, 7, 7, 'light', 1), q(39, 16, 7, 7, 'light', 1),
    q(19, 27, 7, 7, 'light', 1), q(29, 27, 7, 7, 'accent', 1), q(39, 27, 7, 7, 'light', 1),
    q(19, 38, 7, 7, 'accent', 1), q(39, 38, 7, 7, 'light', 1), q(28, 42, 8, 14, 'accent2', 1),
  ] },
  door: { parts: [
    q(16, 8, 32, 48, 'main', 2), p('M20 12 L38 16 V56 L20 52 Z', 'accent2'), c(34, 34, 2, 'light'),
    p('M8 56 H56', 'line'),
  ] },
  elevator: { parts: [
    q(12, 8, 40, 48, 'main', 3), q(16, 16, 15, 38, 'light', 1), q(33, 16, 15, 38, 'light', 1),
    p('M30 11 L32 9 L34 11 Z', 'accent'), p('M24 32 L20 36 M24 32 L28 36 M40 36 L36 32 M40 36 L44 32', 'line'),
  ] },
  househeart: { parts: [
    p('M10 30 L32 12 L54 30 V54 H10 Z', 'main'), p('M6 32 L32 10 L58 32', 'line'),
    p('M32 48 C22 42 20 36 23 32 C26 28 30 30 32 33 C34 30 38 28 41 32 C44 36 42 42 32 48 Z', 'accent', H.red),
  ] },
  blueprint: { parts: [
    q(8, 10, 48, 44, 'main', 2, H.blue),
    p('M14 16 H50 V48 H14 Z M30 16 V34 M14 34 H40 M40 34 V48', 'line'),
    q(32, 18, 6, 4, 'light', 1), q(18, 38, 8, 4, 'light', 1),
  ] },
  boxes: { parts: [
    q(8, 32, 26, 22, 'main', 2, H.brown), q(30, 18, 26, 36, 'accent', 2, H.brown), q(16, 14, 18, 18, 'main', 2, H.brown),
    p('M8 38 H34 M30 26 H56 M16 20 H34', 'line'), q(37, 32, 12, 6, 'light', 1),
  ] },
  cabin: { parts: [
    p('M12 30 H52 V54 H12 Z', 'main', H.red), p('M8 32 L32 14 L56 32 Z', 'main', H.grey),
    q(18, 36, 10, 9, 'light', 1), q(36, 38, 10, 16, 'light', 1), p('M23 36 V45 M18 40.5 H28', 'line'),
    q(42, 16, 5, 9, 'main', 1, H.grey),
  ] },
  // ── Hem & boende: Möbler & inredning ────────────────────────
  sofa: { parts: [
    q(10, 22, 44, 18, 'main', 6), q(6, 30, 10, 20, 'accent', 4), q(48, 30, 10, 20, 'accent', 4),
    q(14, 34, 36, 12, 'main', 3), q(16, 26, 12, 8, 'light', 3), q(10, 50, 4, 6, 'line', 1), q(50, 50, 4, 6, 'line', 1),
  ] },
  chair: { parts: [
    q(18, 8, 28, 26, 'main', 3, H.brown), p('M23 12 V30 M30 12 V30 M37 12 V30 M42 12 V30', 'line'),
    q(14, 32, 36, 6, 'accent', 2, H.brown), q(17, 38, 4, 18, 'main', 1, H.brown), q(43, 38, 4, 18, 'main', 1, H.brown),
  ] },
  bed: { parts: [
    q(6, 18, 8, 38, 'main', 2, H.brown), q(10, 34, 46, 14, 'light', 2), q(12, 28, 14, 8, 'light', 3),
    q(24, 30, 32, 18, 'main', 3), q(6, 46, 52, 4, 'accent', 1, H.brown), q(54, 40, 4, 16, 'main', 2, H.brown),
  ] },
  shelf: { parts: [
    q(10, 8, 44, 48, 'main', 2, H.brown), q(14, 12, 36, 12, 'light', 1), q(14, 28, 36, 12, 'light', 1), q(14, 44, 36, 8, 'light', 1),
    q(16, 14, 4, 10, 'accent'), q(21, 15, 4, 9, 'accent2'), q(26, 13, 3, 11, 'main'), c(42, 36, 4, 'main', H.green), q(18, 30, 10, 10, 'accent', 1),
  ] },
  lamp: { parts: [
    p('M20 26 L26 8 H38 L44 26 Z', 'accent', H.yellow), q(30, 26, 4, 24, 'main', 1), q(20, 50, 24, 6, 'main', 3),
    p('M14 32 L10 36 M50 32 L54 36 M32 32 V36', 'line'),
  ] },
  swatch: { parts: [
    q(10, 10, 14, 34, 'main', 3, H.blue), q(25, 10, 14, 34, 'main', 3, H.yellow), q(40, 10, 14, 34, 'main', 3, H.green),
    q(8, 44, 48, 12, 'light', 3), p('M14 50 H50', 'line'),
  ] },
  roomset: { parts: [
    q(6, 44, 52, 4, 'main', 1, H.brown),
    q(8, 32, 22, 12, 'main', 3), q(8, 26, 6, 18, 'accent', 3),
    q(40, 20, 4, 24, 'line', 1), p('M34 20 L38 10 H46 L50 20 Z', 'accent', H.yellow),
    p('M50 44 V34 M50 34 C46 28 46 24 50 20 C54 24 54 28 50 34', 'main', H.green), q(46, 38, 8, 6, 'main', 1, H.orange),
  ] },
  // ── Hem & boende: Kök & hushållsredskap ─────────────────────
  stove: { parts: [
    q(10, 18, 44, 38, 'main', 3, H.grey), q(10, 12, 44, 8, 'accent', 2, H.grey),
    c(22, 16, 2, 'line'), c(32, 16, 2, 'line'), c(42, 16, 2, 'line'),
    q(16, 26, 32, 22, 'light', 2), q(20, 30, 24, 14, 'main', 2, H.orange), q(22, 22, 20, 2, 'line', 1),
  ] },
  utensils: { parts: [
    q(14, 30, 4, 26, 'main', 2, H.brown), p('M10 10 H22 V30 H10 Z', 'light'), p('M13 12 V26 M16 12 V26 M19 12 V26', 'line'),
    q(30, 30, 4, 26, 'main', 2, H.brown), c(32, 18, 9, 'accent'),
    q(46, 28, 4, 28, 'main', 2, H.brown), p('M42 8 C42 20 54 20 54 8 Z', 'light'), p('M48 8 V22', 'line'),
  ] },
  cups: { parts: [
    q(8, 26, 20, 22, 'light', 3), p('M28 30 C34 30 34 40 28 40', 'line'), q(6, 48, 26, 4, 'accent2', 2),
    p('M36 16 H56 L52 52 H40 Z', 'main', H.blue), q(38, 22, 16, 4, 'light', 1), c(46, 38, 4, 'light'),
  ] },
  containers: { parts: [
    q(8, 28, 22, 26, 'light', 3), q(6, 22, 26, 7, 'main', 2), q(12, 36, 14, 12, 'accent', 2, H.yellow),
    q(34, 18, 22, 36, 'light', 3), q(32, 12, 26, 7, 'accent', 2), q(38, 28, 14, 20, 'main', 2, H.brown),
  ] },
  counter: { parts: [
    q(6, 28, 52, 8, 'main', 2, H.grey), q(8, 36, 48, 20, 'accent', 2, H.brown), p('M32 38 V54 M24 44 V48 M40 44 V48', 'line'),
    q(36, 16, 16, 12, 'light', 2), p('M14 28 V20 Q14 14 20 14 H24', 'line'), c(26, 16, 2, 'accent2'),
  ] },
  setting: { parts: [
    c(32, 32, 16, 'light'), c(32, 32, 11, 'accent2'),
    q(8, 16, 3, 32, 'main', 1.5, H.grey), p('M6 16 V24 M9.5 16 V24 M13 16 V24', 'line'),
    q(52, 16, 4, 32, 'main', 1.5, H.grey), p('M42 10 L48 16 L46 18 L40 12 Z', 'accent', H.blue),
  ] },
  fireext: { parts: [
    q(22, 18, 20, 38, 'main', 6, H.red), q(26, 10, 12, 10, 'main', 2, H.grey),
    p('M38 12 H50 L54 18', 'line'), q(26, 30, 12, 12, 'light', 2), p('M29 36 H35', 'line'),
  ] },
  // ── Hem & boende: Badrum & hygienutrymmen ───────────────────
  toilet: { parts: [
    q(30, 8, 20, 18, 'light', 3), q(30, 8, 20, 5, 'accent2', 2),
    p('M12 28 H50 C50 40 42 46 34 46 H26 C18 46 12 40 12 28 Z', 'light'), q(10, 26, 42, 5, 'accent2', 2.5),
    p('M24 46 L22 56 H40 L38 46 Z', 'light'), q(18, 56, 26, 3, 'line', 1.5),
  ] },
  shower: { parts: [
    p('M14 56 V14 Q14 8 20 8 H38', 'line'), q(32, 10, 14, 6, 'main', 3, H.grey),
    p('M34 22 L32 30 M39 22 L39 32 M44 22 L46 30 M36 34 L34 42 M42 34 L44 42', 'line'),
    c(39, 50, 5, 'accent2'), q(8, 54, 48, 4, 'accent', 2),
  ] },
  towel: { parts: [
    q(10, 10, 44, 6, 'main', 3, H.brown), q(14, 16, 18, 34, 'main', 2), q(32, 16, 18, 28, 'accent', 2),
    p('M14 44 H32 M32 38 H50', 'line'),
  ] },
  toothbrush: { parts: [
    q(10, 36, 18, 22, 'light', 4), q(10, 36, 18, 22, 'accent2', 4),
    p('M16 38 L22 8 L26 9 L20 38 Z', 'main'), q(20, 6, 8, 8, 'light', 2),
    p('M34 30 H52 C55 30 56 33 54 35 L40 52 Q38 54 36 52 Z', 'accent'), q(42, 22, 6, 9, 'main', 1.5),
  ] },
  washer: { parts: [
    q(12, 8, 40, 48, 'light', 4), q(12, 8, 40, 10, 'accent2', 4),
    c(32, 38, 14, 'main', H.grey), c(32, 38, 10, 'main', H.blue), p('M24 40 C28 36 36 44 40 38', 'line'), c(44, 13, 2, 'light'),
  ] },
  faucet: { parts: [
    q(26, 8, 12, 5, 'accent', 2), q(30, 12, 4, 10, 'main', 1, H.grey),
    p('M14 22 H44 Q50 22 50 28 V34 H42 V30 H14 Z', 'main', H.grey),
    p('M46 38 C42 44 44 48 46 48 C48 48 50 44 46 38 Z', 'accent2'), p('M46 52 C44 55 45 57 46 57 C47 57 48 55 46 52 Z', 'accent2'),
  ] },
  wrench: { parts: [
    p('M44 8 C36 8 32 16 34 22 L12 44 C9 47 9 51 12 54 C15 57 19 57 22 54 L44 32 C50 34 58 30 58 22 L50 28 L42 24 L40 16 Z', 'main', H.grey),
    c(16, 50, 3, 'light'), p('M48 44 L56 52 M44 48 L52 56', 'line'),
  ] },
  // ── Hem & boende: Städning & underhåll ──────────────────────
  spray: { parts: [
    p('M22 24 H42 V52 Q42 56 38 56 H26 Q22 56 22 52 Z', 'main'), q(26, 14, 12, 10, 'accent', 2),
    p('M38 16 H48 L46 20 H38 Z', 'accent'), q(26, 34, 12, 12, 'light', 2),
    c(54, 14, 1.5, 'accent2'), c(56, 19, 1.5, 'accent2'), c(53, 23, 1.5, 'accent2'),
  ] },
  mop: { parts: [
    p('M40 6 L28 40', 'line'), q(16, 40, 24, 6, 'main', 2, H.grey),
    p('M16 46 L12 58 M21 46 L19 58 M26 46 L26 58 M31 46 L33 58 M36 46 L40 58', 'line'),
    c(48, 50, 4, 'accent2'), c(54, 44, 2.5, 'accent2'),
  ] },
  shirt: { parts: [
    p('M22 10 L12 16 L6 28 L14 32 L18 26 V56 H46 V26 L50 32 L58 28 L52 16 L42 10 C40 16 24 16 22 10 Z', 'main'),
    c(14, 46, 4, 'light'), c(52, 50, 5, 'light'), c(48, 40, 2.5, 'light'),
  ] },
  recycle: { parts: [
    q(6, 26, 16, 30, 'main', 2, H.green), q(24, 26, 16, 30, 'main', 2, H.blue), q(42, 26, 16, 30, 'main', 2, H.yellow),
    q(4, 22, 20, 5, 'accent', 2, H.green), q(22, 22, 20, 5, 'accent', 2, H.blue), q(40, 22, 20, 5, 'accent', 2, H.yellow),
    p('M32 6 L38 14 H26 Z', 'accent2'),
  ] },
  hammer: { parts: [
    p('M14 54 L36 28 L42 33 L20 58 Z', 'main', H.brown),
    p('M30 14 L46 10 L58 22 L52 28 L46 24 L40 30 L30 20 Z', 'main', H.grey),
    c(12, 20, 3, 'accent2'), p('M8 12 L16 16 M18 8 L20 14', 'line'),
  ] },
  crackwall: { parts: [
    q(8, 8, 48, 48, 'light', 3), q(8, 8, 48, 48, 'accent', 3),
    p('M30 8 L26 20 L34 26 L28 38 L36 46 L32 56', 'line'),
    q(36, 16, 14, 8, 'main', 2, H.yellow),
  ] },
  checklist: { parts: [
    q(14, 8, 36, 48, 'light', 3), q(24, 4, 16, 8, 'main', 2),
    p('M20 22 L23 25 L28 19 M20 34 L23 37 L28 31', 'line'), q(20, 44, 8, 6, 'accent', 1),
    p('M32 22 H44 M32 34 H44 M32 47 H44', 'line'),
  ] },
  // ── Hem & boende: Bostadsmarknad & hyra ────────────────────
  forsale: { parts: [
    p('M14 6 V58', 'line'), q(14, 12, 40, 26, 'main', 3),
    q(20, 18, 28, 6, 'light', 1), q(20, 28, 18, 4, 'light', 1),
    p('M44 44 L52 36 L60 44 V58 H44 Z', 'accent2'), q(50, 50, 4, 8, 'light', 0.5),
  ] },
  contract: { parts: [
    q(12, 6, 34, 50, 'light', 3), p('M18 16 H40 M18 24 H40 M18 32 H34', 'line'),
    p('M18 46 C22 40 26 50 30 44', 'line'),
    p('M52 18 L58 24 L36 50 L28 54 L30 46 Z', 'main'), p('M28 54 L30 46 L36 50 Z', 'accent'),
  ] },
  coins: { parts: [
    c(24, 40, 14, 'main', H.yellow), c(24, 40, 9, 'accent', H.yellow),
    c(42, 26, 14, 'main', H.yellow), c(42, 26, 9, 'light', H.yellow),
    p('M38 20 V32 M38 26 L46 20 M38 26 L46 32', 'line'),
  ] },
  coop: { parts: [
    q(10, 18, 44, 40, 'main', 2), p('M6 20 L32 6 L58 20 Z', 'accent'),
    q(16, 26, 8, 8, 'light', 1), q(28, 26, 8, 8, 'light', 1), q(40, 26, 8, 8, 'light', 1),
    q(16, 40, 8, 8, 'light', 1), q(40, 40, 8, 8, 'light', 1), q(28, 42, 8, 16, 'accent2', 1),
  ] },
  noise: { parts: [
    q(8, 10, 22, 44, 'main', 2), q(32, 10, 22, 44, 'light', 2),
    p('M36 24 C40 28 40 36 36 40 M42 18 C50 26 50 38 42 46', 'line'),
    c(19, 30, 4, 'accent2'), p('M16 40 H22', 'line'),
  ] },
  service: { parts: [
    q(16, 6, 32, 52, 'main', 4), q(20, 12, 24, 36, 'light', 2),
    c(32, 53, 2.5, 'light'), p('M26 24 L30 28 L38 20', 'line'), q(24, 34, 16, 4, 'accent', 1),
  ] },
  movingtruck: { parts: [
    q(4, 18, 34, 28, 'main', 2), p('M38 26 H50 L58 36 V46 H38 Z', 'accent'),
    q(42, 29, 8, 7, 'light', 1), c(16, 48, 6, 'main', H.grey), c(48, 48, 6, 'main', H.grey),
    c(16, 48, 2.5, 'light'), c(48, 48, 2.5, 'light'), q(12, 24, 12, 10, 'accent2', 1, H.brown),
  ] },
};

/** Motif per root area (R01…R08). */
export const ROOT_MOTIF: Record<string, string> = {
  R01: 'house', R02: 'heart', R03: 'institution', R04: 'book', R05: 'mountain', R06: 'flask', R07: 'laptop', R08: 'palette',
};
/** Base hue per root area – every module and sub-area inherits it. */
export const ROOT_HUE: Record<string, number> = {
  R01: 24, R02: 352, R03: 214, R04: 40, R05: 140, R06: 186, R07: 248, R08: 290,
};
/** Motif per planned/published catalog module (filled in as modules get art). */
export const MODULE_MOTIF: Record<string, string> = {
  // published m.* modules without a 1:1 catalog link
  'm.hemmet-vardag': 'bucket', 'm.material-amnen': 'cubes', 'm.atomer-molekyler': 'atom', 'm.krig-forsvar': 'shield', 'm.medeltida-borgar': 'castle',
  // catalog entries
  'SWC-VAR-02-01-01': 'carrot', 'SWC-VAR-02-01-02': 'cherries', 'SWC-VAR-02-01-03': 'wheat', 'SWC-VAR-02-01-04': 'beanpod',
  'SWC-VAR-02-01-05': 'acorn', 'SWC-VAR-02-01-06': 'herbpot', 'SWC-VAR-02-01-07': 'jar',
  'SWC-VAR-02-02-01': 'steak', 'SWC-VAR-02-02-02': 'eggs', 'SWC-VAR-02-02-03': 'fish', 'SWC-VAR-02-02-04': 'tofu',
  'SWC-VAR-02-02-05': 'milk', 'SWC-VAR-02-02-06': 'basket', 'SWC-VAR-02-02-07': 'fridge',
  'SWC-VAR-02-04-01': 'tongue', 'SWC-VAR-02-04-02': 'lollipop', 'SWC-VAR-02-04-03': 'chili', 'SWC-VAR-02-04-04': 'chips',
  'SWC-VAR-02-04-05': 'jelly', 'SWC-VAR-02-04-06': 'banana', 'SWC-VAR-02-04-07': 'dish',
  'SWC-VAR-02-05-01': 'toast', 'SWC-VAR-02-05-02': 'lunchbox', 'SWC-VAR-02-05-03': 'bun', 'SWC-VAR-02-05-04': 'plate',
  'SWC-VAR-02-05-05': 'menu', 'SWC-VAR-02-05-06': 'receipt', 'SWC-VAR-02-05-07': 'chat',
  'SWC-VAR-02-06-01': 'meatballs', 'SWC-VAR-02-06-02': 'sushi', 'SWC-VAR-02-06-03': 'globe', 'SWC-VAR-02-06-04': 'warning',
  'SWC-VAR-02-06-05': 'apple', 'SWC-VAR-02-06-06': 'compost', 'SWC-VAR-02-06-07': 'candles',
  'SWC-VAR-01-01-01': 'apartment', 'SWC-VAR-01-01-02': 'door', 'SWC-VAR-01-01-03': 'elevator', 'SWC-VAR-01-01-04': 'househeart',
  'SWC-VAR-01-01-05': 'blueprint', 'SWC-VAR-01-01-06': 'boxes', 'SWC-VAR-01-01-07': 'cabin',
  'SWC-VAR-01-02-01': 'sofa', 'SWC-VAR-01-02-02': 'chair', 'SWC-VAR-01-02-03': 'bed', 'SWC-VAR-01-02-04': 'shelf',
  'SWC-VAR-01-02-05': 'lamp', 'SWC-VAR-01-02-06': 'swatch', 'SWC-VAR-01-02-07': 'roomset',
  'SWC-VAR-01-03-01': 'stove', 'SWC-VAR-01-03-02': 'utensils', 'SWC-VAR-01-03-03': 'cups', 'SWC-VAR-01-03-04': 'containers',
  'SWC-VAR-01-03-05': 'counter', 'SWC-VAR-01-03-06': 'setting', 'SWC-VAR-01-03-07': 'fireext',
  'SWC-VAR-01-04-01': 'toilet', 'SWC-VAR-01-04-02': 'shower', 'SWC-VAR-01-04-03': 'towel', 'SWC-VAR-01-04-04': 'toothbrush',
  'SWC-VAR-01-04-05': 'washer', 'SWC-VAR-01-04-06': 'faucet', 'SWC-VAR-01-04-07': 'wrench',
  'SWC-VAR-01-05-01': 'spray', 'SWC-VAR-01-05-02': 'mop', 'SWC-VAR-01-05-03': 'shirt', 'SWC-VAR-01-05-04': 'recycle',
  'SWC-VAR-01-05-05': 'hammer', 'SWC-VAR-01-05-06': 'crackwall', 'SWC-VAR-01-05-07': 'checklist',
  'SWC-VAR-01-06-01': 'forsale', 'SWC-VAR-01-06-02': 'contract', 'SWC-VAR-01-06-03': 'coins', 'SWC-VAR-01-06-04': 'coop',
  'SWC-VAR-01-06-05': 'noise', 'SWC-VAR-01-06-06': 'service', 'SWC-VAR-01-06-07': 'movingtruck',
  'SWC-VAR-02-03-01': 'knife', 'SWC-VAR-02-03-02': 'pot', 'SWC-VAR-02-03-03': 'pan', 'SWC-VAR-02-03-04': 'bread',
  'SWC-VAR-02-03-05': 'whisk', 'SWC-VAR-02-03-06': 'shaker', 'SWC-VAR-02-03-07': 'cloche',
};
