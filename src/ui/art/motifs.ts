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
  'SWC-VAR-02-01-01': 'carrot',
  'SWC-VAR-02-03-01': 'knife', 'SWC-VAR-02-03-02': 'pot', 'SWC-VAR-02-03-03': 'pan', 'SWC-VAR-02-03-04': 'bread',
  'SWC-VAR-02-03-05': 'whisk', 'SWC-VAR-02-03-06': 'shaker', 'SWC-VAR-02-03-07': 'cloche',
};
