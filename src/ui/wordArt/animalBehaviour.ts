/**
 * Natur & geografi → Djurvärlden → Djurens beteenden, 2761–2767 (0.44): hunting and foraging, camouflage and
 * defence, territory, courtship, social groups, migration and communication between animals.
 * Every word is a concrete scene with the behaviour itself in focus: the animal doing it, drawn side-on with
 * one dark outline in natural colours (the mammal, bird and fish builders follow mammals.ts, birds.ts and
 * aquatic.ts), and an orange highlight (ring, outline or dashed loop) on the act or body part that the word
 * names. Scent is a dashed purple wave, sound is grey or ink arcs, movement is an orange arrow or a dashed
 * path. Adjectives are scenes where the property dominates, with a small grey reference panel that lacks it.
 * Predators and prey are shown with restraint: no blood, no wounds. Digits only; no words, no letters, no
 * brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';

// ── Shared builders (copied from mammals.ts, birds.ts and aquatic.ts) ─
const SKY = '#d4e8f5';
const NIGHT = '#2f3b5c';
const GRASS = '#a6cf72';
const GRASS2 = '#7fb356';
const FOREST = '#3f8a4f';
const SNOW = '#f5f8fb';
const ROCK = '#9a9590';
const SOIL = '#8a6a4a';
const GREY = '#b9bec4';
const GREY2 = '#9ea4ab';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atf = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
type Part = [string, string];
/** Ellipse as a path. */
const E = (cx: number, cy: number, rx: number, ry: number) => `M${f1(cx - rx)} ${cy} a${rx} ${ry} 0 1 0 ${f1(2 * rx)} 0 a${rx} ${ry} 0 1 0 ${f1(-2 * rx)} 0 Z`;
/** A tapering leg from (x, top) to the ground at y = bottom. */
const LEG = (x: number, top: number, w: number, bottom = 0, wb = w * 0.7, dx = 0) => `M${f1(x - w / 2)} ${top} L${f1(x + dx - wb / 2)} ${f1(bottom - wb * 0.4)} Q${f1(x + dx - wb / 2)} ${bottom} ${f1(x + dx)} ${bottom} Q${f1(x + dx + wb / 2)} ${bottom} ${f1(x + dx + wb / 2)} ${f1(bottom - wb * 0.4)} L${f1(x + w / 2)} ${top} Z`;
/** One shape with a single outline: an outline pass under a fill pass, so overlapping parts merge. */
const sil = (parts: Part[], sw = 2.2): Svg => all(...parts.map(([d]) => path(d, C.ink, C.ink, sw)), ...parts.map(([d, f]) => path(d, f, null)));
const eye = (x: number, y: number, r = 1.4) => all(circle(x, y, r, C.ink, null), circle(x + r * 0.35, y - r * 0.35, r * 0.35, C.white, null));
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16), c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('');
};
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const snowField = (y = 96) => path(`M4 ${y} C40 ${y - 4} 80 ${y - 4} 116 ${y} L116 112 L4 112 Z`, SNOW, C.ink, 1);
const pine = (x: number, y: number, s = 1, col: string = FOREST) => at(x, y, s, rect(-1.5, -5, 3, 5, C.brown, 0, C.ink, 0.8), path('M0 -30 L9 -5 L-9 -5 Z', col, C.ink, 1.1), path('M0 -30 L6 -14 L-6 -14 Z', col, null));
const birch = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -26, 4, 26, C.white, 1, C.ink, 1), line('M-2 -20 l2 0 M0 -12 l2 0 M-2 -6 l2 0', C.ink, 1), circle(0, -32, 9, GRASS2, C.ink, 1.1), circle(-6, -27, 5, GRASS2, null), circle(6, -28, 5, GRASS2, null));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.75} ${r} 0 1 1 ${x} ${y - r} Z`, '#f6e7a8', C.ink, 1);
const starDot = (x: number, y: number) => circle(x, y, 0.9, '#fff6c8', null);
const rockShape = (x: number, y: number, w: number, h: number, col: string = ROCK) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h * 0.8} ${x - w / 4} ${y - h} ${x} ${y - h} C${x + w / 3} ${y - h} ${x + w / 2} ${y - h * 0.6} ${x + w / 2} ${y} Z`, col, C.ink, 1.2);
const panel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, C.white, 3, C.ink, 1.2), k.join(''));
const greyPanel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, '#eceef0', 3, GREY2, 1.2), k.join(''));
const cross = (x: number, y: number, r = 6) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, C.red, 2.6);
const bugIcon = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 4, 3, '#4a4a3a', C.ink, 0.8), circle(4, -1, 1.8, '#4a4a3a', null), line('M-2 2 l-2 3 M0 2 l0 3 M2 2 l2 3', C.ink, 0.8));
const nut = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 1, 3.4, 4, '#b07a45', C.ink, 0.9), path('M-3.6 -1 C-3 -5 3 -5 3.6 -1 Z', '#8a5a30', C.ink, 0.8));
type AO = { col?: string; grey?: boolean; antlers?: boolean };
const gc = (o: AO, col: string) => (o.grey ? GREY : o.col ?? col);
const gd = (o: AO, col: string) => (o.grey ? GREY2 : col);
/** Moose: high shoulder hump, long pale legs, overhanging muzzle, bell, shovel antlers. */
const moose = (o: AO = {}) => {
  const c = gc(o, '#4f3829'), legc = gd(o, '#c9bda8'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-22, -40, 6, 0, 4, -1), far], [LEG(20, -40, 6, 0, 4, 1), far]]),
    rect(-25.6, -18, 5, 16, shade(legc, 0.85), 2, null), rect(18.6, -18, 5, 16, shade(legc, 0.85), 2, null),
    sil([
      ['M-34 -40 C-37 -54 -24 -58 -10 -56 C0 -55 6 -66 18 -64 C28 -62 30 -52 30 -44 C28 -36 20 -32 10 -32 L-24 -32 C-30 -32 -33 -35 -34 -40 Z', c],
      [LEG(-28, -40, 7, 0, 4.4, 0), c], [LEG(14, -40, 7, 0, 4.4, 0), c],
      ['M20 -60 C26 -66 36 -64 42 -58 L54 -50 C60 -47 60 -40 54 -38 C49 -37 45 -40 42 -42 L30 -46 Z', c],
      ['M36 -46 C38 -40 40 -36 37 -32 C34 -35 33 -40 33 -46 Z', c],
      ['M32 -62 L35 -72 L39 -62 Z', c],
    ]),
    path('M-28 -16 L-28 -2 M14 -16 L14 -2', 'none', legc, 0),
    rect(-31.2, -18, 6.4, 16, legc, 2, null), rect(10.8, -18, 6.4, 16, legc, 2, null),
    eye(41, -55), path('M53 -45 C55 -44 56 -43 55 -42', 'none', C.ink, 1),
    o.antlers === false ? '' : sil([['M32 -64 C24 -66 18 -72 18 -80 L22 -76 L23 -83 L26 -77 L28 -84 L30 -77 L33 -82 L34 -74 C36 -70 36 -66 34 -63 Z', gd(o, '#e6d8b8')]], 1.6),
  );
};
/** Roe deer: small, red-brown, big ears, white rump patch, short spiky antlers. */
const roeDeer = (o: AO = {}) => {
  const c = gc(o, '#b8673a'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-15, -28, 4, 0, 2.6, 1), far], [LEG(12, -28, 4, 0, 2.6, 2), far]]),
    sil([
      ['M-22 -32 C-24 -42 -12 -44 0 -43 C10 -43 16 -46 20 -48 L24 -40 C22 -32 16 -28 8 -27 L-16 -27 C-20 -27 -22 -29 -22 -32 Z', c],
      [LEG(-19, -30, 4.6, 0, 2.6, -1), c], [LEG(8, -30, 4.6, 0, 2.6, 0), c],
      ['M14 -45 L20 -55 C22 -59 28 -59 30 -55 L36 -49 C37 -46 35 -44 32 -45 L26 -47 L25 -40 Z', c],
      ['M21 -55 C17 -61 19 -65 23 -61 Z', c], ['M26 -56 C28 -63 32 -63 30 -56 Z', c],
    ]),
    ellipse(-21, -36, 3.4, 5, C.white, C.ink, 0.8), circle(36, -48, 1.4, C.ink, null), eye(27, -53, 1.2),
    o.antlers === false ? '' : line('M23 -58 L22 -66 M22 -63 L20 -65 M25 -58 L26 -66 M26 -63 L28 -65', gd(o, '#e6d8b8'), 1.8),
  );
};
/** Red deer: large, reddish, darker neck, big many-pointed antlers. */
const redDeer = (o: AO = {}) => {
  const c = gc(o, '#9a5532'), nk = gd(o, '#6e3d25'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-20, -36, 5, 0, 3.2, 1), far], [LEG(16, -36, 5, 0, 3.2, 2), far]]),
    sil([
      ['M-30 -40 C-32 -52 -18 -54 -2 -53 C10 -53 18 -56 22 -58 L28 -48 C26 -38 18 -34 8 -34 L-22 -34 C-27 -34 -30 -36 -30 -40 Z', c],
      [LEG(-25, -38, 6, 0, 3.4, -1), c], [LEG(11, -38, 6, 0, 3.4, 0), c],
      ['M16 -56 L24 -72 C26 -76 32 -76 34 -72 L42 -66 C43 -63 41 -61 38 -62 L32 -64 L30 -50 Z', nk],
      ['M26 -72 C22 -78 24 -82 28 -77 Z', nk],
    ]),
    path('M-30 -44 C-34 -42 -34 -38 -30 -38', '#e9dcc4', C.ink, 0.9), eye(31, -70, 1.3), circle(42, -65, 1.2, C.ink, null),
    o.antlers === false ? '' : line('M29 -76 C26 -86 22 -94 26 -104 M28 -84 L20 -88 M27 -92 L20 -95 M26 -100 L22 -106 M26 -104 L31 -108 M31 -76 C36 -86 40 -94 37 -104 M33 -84 L40 -86 M36 -92 L43 -94 M38 -100 L43 -105', gd(o, '#e6d8b8'), 2.2),
  );
};
/** Reindeer: grey-brown with pale neck and belly, broad hooves, big curved antlers with a brow tine. */
const reindeer = (o: AO = {}) => {
  const c = gc(o, '#7d6a56'), pale = gd(o, '#e8e0d2'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-18, -30, 5.4, 0, 4.4, 1), far], [LEG(15, -30, 5.4, 0, 4.4, 2), far]]),
    sil([
      ['M-28 -34 C-30 -47 -16 -50 0 -49 C10 -49 16 -52 20 -54 L27 -44 C25 -35 18 -31 8 -30 L-20 -30 C-25 -30 -28 -31 -28 -34 Z', c],
      [LEG(-23, -32, 6, 0, 5, -1), c], [LEG(10, -32, 6, 0, 5, 0), c],
      ['M16 -52 L23 -64 C25 -68 31 -68 33 -64 L40 -58 C41 -54 39 -52 36 -53 L30 -55 L28 -44 Z', c],
      ['M24 -64 C20 -69 22 -72 26 -68 Z', c],
    ]),
    path('M17 -50 L23 -62 L29 -56 L27 -44 C24 -40 20 -42 17 -50 Z', pale, null), path('M-20 -31 C-10 -29 4 -29 10 -31', 'none', pale, 3),
    eye(29, -62, 1.2), circle(40, -56, 1.2, C.ink, null),
    o.antlers === false ? '' : line('M27 -67 C20 -76 18 -86 24 -96 M23 -78 L18 -84 M22 -88 L17 -92 M24 -96 L29 -100 M27 -67 C30 -63 34 -62 36 -64 M30 -68 C34 -78 36 -88 33 -96 M34 -84 L39 -88', gd(o, '#e6d8b8'), 2.2),
  );
};
/** Fox: orange, white throat and tail tip, black socks, pointed ears, bushy tail. */
const fox = (o: AO = {}) => {
  const c = gc(o, '#d9692a'), sock = gd(o, '#2e2e36'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-14, -14, 3.6, 0, 3, 1), far], [LEG(12, -14, 3.6, 0, 3, 2), far]]),
    sil([
      ['M-38 -20 C-46 -24 -48 -14 -40 -10 C-34 -8 -24 -14 -20 -18 Z', c],
      ['M-22 -16 C-24 -26 -12 -28 0 -27 C8 -27 12 -28 16 -30 L22 -22 C20 -16 14 -13 6 -13 L-16 -13 C-20 -13 -22 -14 -22 -16 Z', c],
      [LEG(-17, -16, 4, 0, 3, -1), c], [LEG(8, -16, 4, 0, 3, 0), c],
      ['M14 -28 C16 -36 24 -38 28 -34 L38 -28 C39 -26 37 -25 34 -25 L26 -24 L22 -20 Z', c],
      ['M18 -34 L19 -44 L24 -36 Z', c], ['M23 -35 L26 -44 L28 -34 Z', c],
    ]),
    path('M-46 -16 C-48 -12 -44 -9 -40 -10 C-42 -12 -44 -14 -46 -16 Z', C.white, null),
    path('M24 -26 L34 -25 C30 -22 26 -20 22 -20 Z', C.white, null),
    rect(-19, -6, 4, 6, sock, 1.6, null), rect(6, -6, 4, 6, sock, 1.6, null),
    eye(27, -31, 1.1), circle(38.4, -27.6, 1.1, C.ink, null),
  );
};
/** Wolf: grey, pale belly and muzzle, long legs, hanging bushy tail. */
const wolf = (o: AO = {}) => {
  const c = gc(o, '#8c8f94'), pale = gd(o, '#d9d6cf'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-16, -22, 4.4, 0, 3.4, 1), far], [LEG(14, -22, 4.4, 0, 3.4, 2), far]]),
    sil([
      ['M-26 -28 C-34 -24 -36 -14 -34 -8 C-30 -12 -26 -18 -24 -24 Z', c],
      ['M-26 -26 C-28 -36 -14 -38 0 -37 C8 -37 14 -39 18 -41 L24 -32 C22 -25 16 -22 8 -22 L-18 -22 C-23 -22 -26 -23 -26 -26 Z', c],
      [LEG(-20, -24, 5, 0, 3.6, -1), c], [LEG(9, -24, 5, 0, 3.6, 0), c],
      ['M15 -40 C17 -48 25 -50 29 -46 L40 -40 C41 -37 39 -36 36 -36 L28 -35 L23 -30 Z', c],
      ['M20 -46 L21 -55 L26 -47 Z', c], ['M24 -47 L27 -55 L29 -46 Z', c],
    ]),
    path('M26 -38 L36 -36 C32 -33 28 -32 23 -31 Z', pale, null), path('M-14 -23 C-6 -21 2 -21 8 -23', 'none', pale, 3),
    eye(28, -43, 1.1), circle(40.4, -39.6, 1.2, C.ink, null),
  );
};
/** Lynx: tawny with dark spots, short black-tipped tail, ear tufts, cheek ruff, big paws. */
const lynx = (o: AO = {}) => {
  const c = gc(o, '#c7a173'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-14, -20, 5, 0, 5, 1), far], [LEG(13, -20, 5, 0, 5, 2), far]]),
    sil([
      ['M-25 -30 C-30 -32 -32 -27 -28 -24 Z', c],
      ['M-24 -26 C-26 -36 -12 -38 0 -37 C8 -37 13 -37 17 -38 L22 -30 C20 -24 14 -21 6 -21 L-16 -21 C-21 -21 -24 -23 -24 -26 Z', c],
      [LEG(-18, -24, 5.6, 0, 5.4, -1), c], [LEG(8, -24, 5.6, 0, 5.4, 0), c],
      ['M13 -36 C13 -46 30 -48 32 -40 C34 -34 30 -30 24 -30 C18 -30 14 -32 13 -36 Z', c],
      ['M16 -44 L18 -53 L22 -46 Z', c], ['M24 -46 L28 -54 L29 -44 Z', c],
      ['M14 -34 C12 -28 18 -26 22 -30 Z', c],
    ]),
    line('M18 -53 L18 -58 M28 -54 L29 -59', C.ink, 1.4), path('M-30 -30 C-32 -28 -31 -25 -28 -24 C-29 -26 -29 -28 -28 -30 Z', C.ink, null),
    o.grey ? '' : all(...[[-16, -32], [-10, -34], [-4, -33], [3, -33], [-13, -27], [-6, -28], [1, -27], [8, -30], [-19, -28]].map(([x, y]) => circle(x!, y!, 1.2, '#6b4f33', null))),
    eye(28, -40, 1.2), circle(32.2, -36, 1.1, C.ink, null), line('M14 -33 L19 -31 M15 -30 L20 -29', '#e9dcc4', 1),
  );
};
/** Brown bear: big, brown, shoulder hump, small round ears. */
const bear = (o: AO = {}) => {
  const c = gc(o, '#7a4f2e'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-20, -18, 9, 0, 9, 1), far], [LEG(18, -18, 9, 0, 9, 2), far]]),
    sil([
      ['M-34 -22 C-38 -40 -22 -48 -4 -46 C4 -46 8 -52 16 -50 C26 -48 30 -40 30 -30 C30 -22 26 -18 18 -18 L-26 -18 C-31 -18 -34 -19 -34 -22 Z', c],
      [LEG(-26, -22, 10, 0, 10, -1), c], [LEG(12, -22, 10, 0, 10, 0), c],
      ['M22 -40 C24 -48 36 -50 40 -44 L48 -38 C50 -35 48 -32 44 -32 L34 -30 L26 -30 Z', c],
      [E(28, -46, 3.4, 3.4), c],
    ]),
    circle(28, -46, 1.6, shade(c, 0.7), null), eye(38, -42, 1.3), circle(48.4, -37, 1.6, C.ink, null),
    line('M-31 -1 l1.5 -2 M-27 -1 l0 -2.4 M-23 -1 l-1.5 -2 M7 -1 l1.5 -2 M11 -1 l0 -2.4 M15 -1 l-1.5 -2', shade(c, 0.6), 1),
  );
};
/** Wild boar: dark bristly, big wedge head, tusks, snout disc, mane ridge. */
const boar = (o: AO = {}) => {
  const c = gc(o, '#4d4038'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-16, -12, 4.4, 0, 3, 1), far], [LEG(12, -12, 4.4, 0, 3, 2), far]]),
    sil([
      ['M-26 -20 C-30 -22 -31 -18 -28 -16 Z', c],
      ['M-26 -18 C-28 -30 -12 -34 2 -34 C12 -34 18 -30 22 -26 L24 -16 C22 -12 14 -10 6 -10 L-18 -10 C-23 -10 -26 -13 -26 -18 Z', c],
      [LEG(-20, -14, 5, 0, 3.2, -1), c], [LEG(8, -14, 5, 0, 3.2, 0), c],
      ['M16 -30 C22 -32 28 -26 34 -20 L38 -18 L38 -12 L32 -12 C26 -12 20 -14 16 -18 Z', c],
      ['M20 -30 L22 -38 L26 -30 Z', c],
    ]),
    line('M-18 -34 l-1 -3 M-12 -35 l0 -3 M-6 -35 l0 -3.4 M0 -35 l1 -3.4 M6 -34 l1 -3 M12 -32 l1 -3', c, 1.6),
    rect(37, -18.6, 3, 6.6, gd(o, '#c98a8a'), 1, C.ink, 0.8), path('M32 -13 C34 -16 35 -19 33 -21', 'none', gd(o, '#f4ecd8'), 1.8),
    eye(25, -25, 1.1),
  );
};
/** Hare: brown-grey, very long black-tipped ears, long hind legs, sitting. white: winter mountain hare. */
const hare = (o: AO & { white?: boolean } = {}) => {
  const c = o.white ? '#f4f6f8' : gc(o, '#a88a68'), far = shade(c, 0.85);
  return all(
    sil([[LEG(12, -14, 2.4, 0, 2.2, 3), far], ['M10 -24 C6 -36 0 -46 -4 -50 C-6 -48 -2 -38 6 -24 Z', far]], 1.8),
    sil([
      ['M-20 -12 C-24 -22 -12 -28 0 -27 C8 -26 12 -24 15 -20 L13 -12 C8 -8 0 -8 -8 -9 Z', c],
      ['M-22 -12 C-24 -4 -16 -2 -8 -4 C-4 -6 -4 -12 -10 -16 Z', c],
      ['M-18 -4 L4 -2 C6 -1 6 0 4 0 L-18 0 C-20 -1 -20 -3 -18 -4 Z', c],
      [LEG(9, -14, 2.6, 0, 2.4, 2), c],
      ['M10 -22 C10 -30 18 -34 23 -30 C27 -27 26 -21 21 -20 C16 -19 11 -19 10 -22 Z', c],
      ['M13 -29 C9 -40 6 -50 8 -54 C12 -52 15 -42 17 -30 Z', c],
      ['M-24 -16 C-28 -17 -28 -11 -24 -11 Z', C.white],
    ], 1.8),
    path('M7.4 -51 C7.6 -54 9 -55 10.4 -52.4 L9 -49 Z', C.ink, null), path('M-25 -16 C-27 -16 -27 -14 -26 -13 Z', C.ink, null),
    eye(19, -27, 1.3), circle(25.6, -24, 0.9, C.ink, null),
  );
};
/** Red squirrel: red, big bushy tail curled up over the back, ear tufts, sitting with a nut. */
const squirrel = (o: AO = {}) => {
  const c = gc(o, '#c4572a');
  return all(
    sil([
      ['M-6 -6 C-22 -6 -26 -24 -18 -36 C-12 -44 -2 -42 0 -34 C-6 -34 -10 -28 -8 -20 C-6 -14 -2 -10 -2 -6 Z', c],
      ['M-6 0 C-12 -4 -10 -18 -2 -22 C4 -24 8 -18 8 -10 C8 -4 4 0 0 0 Z', c],
      ['M0 -20 C0 -28 10 -30 14 -24 C16 -20 14 -16 10 -16 C4 -15 0 -16 0 -20 Z', c],
      ['M4 -27 L5 -34 L8 -28 Z', c],
    ]),
    line('M5 -34 L4 -37 M5 -34 L6 -37', c, 1), path('M2 -14 C4 -10 4 -4 2 -2', 'none', gd(o, '#f3e2c8'), 2.6),
    eye(9, -23, 1.1), circle(14.4, -20, 0.8, C.ink, null), nut(10, -10, 0.8),
  );
};
/** Hedgehog: brown spiny dome, pointed snout, tiny legs. */
const hedgehog = (o: AO = {}) => {
  const c = gc(o, '#7a6450'), face = gd(o, '#d9b994');
  const spikes = range(13).map((i) => { const a = Math.PI * (1.02 + i * 0.075); return `L${f1(Math.cos(a) * 21)} ${f1(-4 + Math.sin(a) * 17)} L${f1(Math.cos(a + 0.038) * 15)} ${f1(-4 + Math.sin(a + 0.038) * 12)}`; }).join(' ');
  return all(
    sil([
      [LEG(-8, -4, 3, 0, 3, 0), face], [LEG(8, -4, 3, 0, 3, 0), face],
      ['M8 -10 C14 -12 20 -8 26 -4 C26 -2 24 -1 20 -2 L8 -2 Z', face],
      [`M-20 -2 ${spikes} L14 -10 L12 -2 Z`, c],
    ]),
    line('M-10 -8 l-2 -4 M-2 -12 l-1 -4 M6 -12 l1 -4 M-14 -4 l-3 -3', shade(c, 0.7), 1), eye(16, -7, 1.1), circle(26, -4, 1.1, C.ink, null),
  );
};
/** Mouse: small grey-brown, big round ears, long thin tail. */
const mouse = (o: AO = {}) => {
  const c = gc(o, '#9a8a7a');
  return all(
    line('M-12 -4 C-22 -2 -26 -10 -34 -8', gd(o, '#d6a9a0'), 1.4),
    sil([
      ['M-14 -2 C-16 -12 -4 -14 4 -12 C10 -10 12 -6 10 -2 L-12 0 Z', c],
      ['M6 -10 C10 -14 16 -10 20 -6 C20 -4 18 -3 16 -3 L8 -3 Z', c],
      [E(7, -13, 4, 4), c],
    ]),
    circle(7, -13, 2.4, gd(o, '#e7b8b0'), null), eye(13, -8, 1), circle(20, -5.6, 0.8, C.ink, null), line('M17 -5 l5 -2 M17 -4 l5 1', C.ink, 0.4),
  );
};
/** Vole: round, blunt face, ears hidden in fur, short tail. */
const vole = (o: AO = {}) => {
  const c = gc(o, '#7d5e44');
  return all(
    line('M-14 -4 L-20 -3', gd(o, '#a4846a'), 1.6),
    sil([['M-15 -2 C-17 -14 -2 -16 6 -13 C14 -10 16 -6 14 -2 L-13 0 Z', c]]),
    path('M4 -12 C6 -13 8 -13 9 -11', 'none', shade(c, 0.7), 1), eye(10, -8, 1), circle(15, -4, 0.8, C.ink, null),
  );
};
/** Bat: spread membrane wings, dark brown furry body, big ears. */
const bat = (o: AO = {}) => {
  const c = gc(o, '#4a3a32'), w = gd(o, '#6b5548');
  return all(
    sil([
      ['M0 -4 C-8 -8 -18 -14 -30 -10 C-28 -6 -26 -2 -24 2 C-20 -1 -16 0 -14 4 C-10 1 -6 2 -4 6 Z', w],
      ['M0 -4 C8 -8 18 -14 30 -10 C28 -6 26 -2 24 2 C20 -1 16 0 14 4 C10 1 6 2 4 6 Z', w],
      [E(0, 0, 4.4, 7), c],
      [E(0, -9, 4, 3.6), c],
      ['M-3 -11 L-5 -17 L-1 -12 Z', c], ['M3 -11 L5 -17 L1 -12 Z', c],
    ], 1.8),
    line('M-2 -5 L-30 -10 M-6 -2 L-24 2 M-8 0 L-14 4 M2 -5 L30 -10 M6 -2 L24 2 M8 0 L14 4', shade(w, 0.7), 0.7),
    circle(-1.6, -9.4, 0.7, C.white, null), circle(1.6, -9.4, 0.7, C.white, null),
  );
};
/** House cat (side). */
const cat = (o: AO = {}) => {
  const c = gc(o, '#e0a060');
  return all(
    sil([
      ['M-20 -14 C-28 -16 -30 -28 -24 -32 C-24 -26 -22 -20 -18 -18 Z', c],
      ['M-20 -14 C-22 -22 -10 -24 0 -23 C8 -23 12 -24 14 -24 L18 -18 C16 -12 12 -10 6 -10 L-14 -10 C-18 -10 -20 -11 -20 -14 Z', c],
      [LEG(-14, -12, 3.6, 0, 3.4, 0), c], [LEG(7, -12, 3.6, 0, 3.4, 0), c],
      [E(18, -26, 7, 6), c],
      ['M13 -30 L14 -37 L18 -31 Z', c], ['M19 -31 L23 -37 L24 -29 Z', c],
    ]),
    line('M-8 -22 l2 4 M-2 -23 l2 4 M4 -23 l2 4', shade(c, 0.75), 1.4), eye(21, -27, 1.1), circle(25, -24, 0.9, C.pink, null),
  );
};
const BARK = '#8a5a35';
const BLACK = '#26262c';
const LGREY = '#c9cfd5';
const WHITE = '#fbfbf8';
const YEL = '#f4cf3a';
const LBROWN = '#c49a6c';
const RED = '#d23b2e';
const ORANGE = '#ef8a3c';
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);
const jag = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M0 -6 L4 -3 L1 0 L5 3 L2 6 M7 -9 L12 -5 L8 -1 L13 3 L9 7 L13 10', col, 1.5));
type Song = {
  body?: string; back?: string; belly?: string; head?: string; cap?: string; cheek?: string; eyeStripe?: string; bib?: string; stripe?: string;
  face?: string; breast?: string; wing?: string; bar?: string; bar2?: string; tail?: string; tailLen?: number; tailUp?: number; beak?: string; beakLen?: number;
  beakW?: number; eyeRing?: string; spots?: string; streaks?: string; nape?: string; crest?: string; legs?: string; open?: boolean; bars?: string; noLegs?: boolean;
};
/** A perching songbird facing right, feet at (0, 0); about 30 × 25 units at scale 1. */
const song = (o: Song = {}): Svg => {
  const body = o.body ?? LBROWN, tl = o.tailLen ?? 10, tu = o.tailUp ?? 0, bl = o.beakLen ?? 4, bw = o.beakW ?? 1.4;
  const outline = 'M-8 -16 C-2 -21 8 -19 10 -14 C12 -9 8 -4 1 -4 C-5 -4 -9 -8 -10 -12 Z';
  return all(
    path(`M-7 -14.5 L${-8 - tl} ${-10 - tu} L${-7 - tl} ${-6.5 - tu} L-6 -9 Z`, o.tail ?? o.wing ?? body, C.ink, 1),
    o.noLegs ? '' : line('M-1 -5 L-2 0 M3 -5 L3.5 0 M-4 0 L1 0 M1 0 L6 0', o.legs ?? '#6b5b4f', 1.2),
    path(outline, body, null),
    o.back ? path('M-8 -16 C-2 -21 8 -19 10 -14 C5 -14.5 -2 -14.5 -10 -12 Z', o.back, null) : '',
    o.belly ? path('M-7 -7.5 C-3 -4.2 6 -3.5 9 -8 C10 -11 10.3 -13 10 -14.5 C6 -12 0 -9.5 -7 -7.5 Z', o.belly, null) : '',
    o.breast ? path('M3 -16 C8 -17 11 -15 10.6 -11 C10 -8 8 -6.5 5 -6.5 C3 -9 2 -13 3 -16 Z', o.breast, null) : '',
    o.streaks ? line('M3 -12 l-1 2 M6 -11 l-1 2 M8 -13 l-1 2 M4 -8 l-1 2 M7 -8 l-1 2 M0 -9 l-1 2 M-3 -8 l-1 2', o.streaks, 1) : '',
    o.bars ? line('M0 -10 l5 -1 M1 -7.5 l6 -1 M3 -12.5 l5 -1 M-3 -7 l4 -0.5', o.bars, 0.9) : '',
    o.stripe ? line('M9.5 -13 C8 -10 6 -7 3 -4.5', o.stripe, 2.2) : '',
    path('M-7 -15 C-2 -18.5 5 -16.5 6 -12 C2 -9 -4 -9 -9.5 -11 Z', o.wing ?? body, C.ink, 0.9),
    o.bar ? line('M-5.5 -12.8 C-2 -14.6 1.5 -14 4.5 -12.3', o.bar, 1.5) : '',
    o.bar2 ? line('M-7 -11 C-4 -12 -1 -11.8 2 -10.6', o.bar2, 1.3) : '',
    o.spots ? all(...[[-4, -13], [0, -15], [4, -13.5], [-1, -10], [3, -9], [7, -10], [6, -6.5], [1, -6], [-5, -9]].map(([x, y]) => circle(x!, y!, 0.75, o.spots!, null))) : '',
    path(outline, 'none', C.ink, 1.1),
    o.crest ? path('M6.5 -23 L3.5 -28 L9.5 -24 Z', o.crest, C.ink, 0.8) : '',
    circle(9, -19, 5.5, o.head ?? body, C.ink, 1.1),
    o.face ? path('M9.5 -24.4 A5.5 5.5 0 0 1 9.5 -13.6 C8 -15 7.5 -18 9.5 -24.4 Z', o.face, null) : '',
    o.nape ? path('M4.2 -21.5 C3.4 -19 3.6 -16.5 5 -14.6 L7 -17 Z', o.nape, null) : '',
    o.cap ? path('M3.6 -19.8 A5.5 5.5 0 0 1 14.4 -19.8 Z', o.cap, null) : '',
    o.cheek ? ellipse(8.4, -17.6, 3, 2, o.cheek, null) : '',
    o.eyeStripe ? line('M5 -19.5 L14 -19.5', o.eyeStripe, 1.2) : '',
    o.bib ? path('M13.6 -16 C12.6 -13 10.5 -11.5 8 -11.5 C8.5 -13.5 10 -15.5 12 -16.4 Z', o.bib, null) : '',
    circle(9, -19, 5.5, 'none', C.ink, 1.1),
    o.eyeRing ? circle(11, -20, 1.6, o.eyeRing, null) : '',
    circle(11, -20, 0.9, C.ink, null),
    o.open
      ? path(`M14 ${-19.4 - bw} L${14 + bl} ${-21 - bw} L14 -19.2 L${14 + bl} -16.4 L14 ${-18.6 + bw} Z`, o.beak ?? C.dark, C.ink, 0.7)
      : path(`M14 ${-19 - bw} L${14 + bl} -18.6 L14 ${-19 + bw} Z`, o.beak ?? C.dark, C.ink, 0.7),
  );
};
// Species presets (field marks).
const RODHAKE: Song = { body: '#9a8155', belly: '#f1ead8', breast: '#ec8a3a', head: '#9a8155', face: '#ec8a3a', wing: '#8a7048', tail: '#8a7048', beakLen: 3.6, beakW: 1 };
const BOFINK: Song = { body: '#b07a52', back: '#9b6440', belly: '#d9a08a', breast: '#d38a72', head: '#7f95b3', face: '#d38a72', wing: BLACK, bar: WHITE, bar2: WHITE, tail: '#4a4a50', beak: '#8f9aa4' };
const KOLTRAST: Song = { body: BLACK, wing: '#33333a', tail: BLACK, head: BLACK, beak: '#f0a530', eyeRing: '#f0a530', tailLen: 13, beakLen: 4.5 };
const KRAKA: Song = { body: '#9aa0a7', head: BLACK, bib: BLACK, wing: BLACK, tail: BLACK, beak: BLACK, beakLen: 6, beakW: 1.9, tailLen: 11 };
/** A woodpecker clinging to a trunk to its left; (x, y) is the foot point, facing up-right. */
const woodpecker = (x: number, y: number, s = 1, pecking = false) => rot(x, y, -62, s,
  path('M-7 -14.5 L-20 -9 L-19 -6 L-6 -9 Z', BLACK, C.ink, 1),
  song({ body: BLACK, belly: '#f0ece2', head: WHITE, cap: BLACK, nape: RED, cheek: WHITE, wing: BLACK, bar: WHITE, bar2: WHITE, tail: BLACK, beak: C.dark, beakLen: pecking ? 7 : 6, beakW: 1.3, noLegs: true }),
  path('M-6 -6 C-4 -4 -1 -3.6 1 -4 C0 -6 -3 -7 -6 -6 Z', RED, C.ink, 0.6), line('M-1 -4 L-3 0 M3 -5 L2 0', C.dark, 1.4));
type Swan = { neck?: 's' | 'up' | 'down'; bill?: string; knob?: boolean; wings?: boolean; col?: string; tip?: string; open?: boolean };
/** A swimming swan facing right, water line y = 0. */
const swan = (o: Swan = {}): Svg => {
  const col = o.col ?? WHITE;
  const neck = o.neck === 'up' ? 'M8 -10 C11 -18 12 -28 13 -38' : o.neck === 'down' ? 'M8 -10 C16 -16 20 -10 22 -4' : 'M8 -10 C17 -17 6 -29 11 -36 C12.6 -38.6 15.4 -38.6 17 -37';
  const hx = o.neck === 'up' ? 14 : o.neck === 'down' ? 23 : 17.5, hy = o.neck === 'up' ? -39 : o.neck === 'down' ? -3 : -36.5;
  const bill = o.neck === 'up'
    ? (o.open ? path(`M${hx + 3} ${hy - 1.6} L${hx + 11} ${hy - 4} L${hx + 4} ${hy} L${hx + 11} ${hy + 3} L${hx + 3} ${hy + 1.6} Z`, o.bill ?? YEL, C.ink, 0.8) : path(`M${hx + 3} ${hy - 1.8} L${hx + 11} ${hy - 0.4} L${hx + 11} ${hy + 1} L${hx + 3} ${hy + 1.8} Z`, o.bill ?? YEL, C.ink, 0.8))
    : path(`M${hx + 2.4} ${hy - 1} L${hx + 9} ${hy + 3.6} L${hx + 8} ${hy + 5} L${hx + 2} ${hy + 2} Z`, o.bill ?? ORANGE, C.ink, 0.8);
  return all(
    path('M-20 -4 L-28 -10 L-22 -1 Z', col, C.ink, 1),
    path('M-24 -2 C-26 -12 -14 -15 -2 -14 C8 -13 15 -10 14 -3 C12 1 2 2 -10 2 C-18 2 -23 1 -24 -2 Z', col, C.ink, 1.1),
    o.wings ? path('M-22 -10 C-22 -26 -6 -30 6 -15 C-2 -14 -12 -12 -22 -10 Z', col, C.ink, 1) : path('M-18 -8 C-10 -12 0 -12 6 -9 C0 -6 -10 -5.5 -18 -8 Z', col, C.ink, 0.8),
    o.wings ? line('M-18 -14 C-12 -20 -4 -21 2 -15 M-16 -11 C-10 -16 -4 -16 0 -13', LGREY, 1) : '',
    line(neck, C.ink, 7), line(neck, col, 5),
    circle(hx, hy, 4.2, col, C.ink, 1), bill,
    o.tip ? path(o.neck === 'up' ? `M${hx + 7.5} ${hy - 0.9} L${hx + 11} ${hy - 0.4} L${hx + 11} ${hy + 1} L${hx + 7.5} ${hy + 1.3} Z` : '', o.tip, null) : '',
    o.knob ? circle(hx + 3.2, hy - 0.6, 2.5, BLACK, C.ink, 0.6) : '',
    o.neck === 'up' || o.neck === undefined || o.neck === 's' ? path(`M${hx + 2.6} ${hy - 1.6} L${hx + 4.2} ${hy - 0.8} L${hx + 3} ${hy + 1.6} Z`, BLACK, null) : '',
    circle(hx + 1, hy - 1.2, 0.8, C.ink, null),
  );
};
/** A bird flying sideways, facing right; wings up or down. */
const flySide = (o: { body?: string; wing?: string; head?: string; cap?: string; bill?: string; fork?: boolean; streamers?: boolean; throat?: string; belly?: string; up?: boolean } = {}) => all(
  o.fork || o.streamers ? path(o.streamers ? 'M-8 -1 L-24 -6 L-12 0 L-24 4 L-8 1 Z' : 'M-8 -1 L-18 -5 L-12 0 L-18 4 L-8 1 Z', o.body ?? WHITE, C.ink, 0.9) : path('M-8 -1.5 L-16 -2 L-16 2 L-8 1.5 Z', o.body ?? WHITE, C.ink, 0.9),
  ellipse(0, 0, 9, 3.6, o.body ?? WHITE, C.ink, 1),
  o.belly ? path('M-6 1.6 C-2 3.6 4 3.6 8 1 C3 0.6 -2 0.8 -6 1.6 Z', o.belly, null) : '',
  path(o.up === false ? 'M-3 0 C0 6 4 14 2 18 C6 12 6 6 4 0 Z' : 'M-3 -1 C0 -8 6 -16 4 -20 C9 -14 8 -6 4 -1 Z', o.wing ?? o.body ?? WHITE, C.ink, 1),
  circle(9, -1.4, 3.2, o.head ?? o.body ?? WHITE, C.ink, 1),
  o.cap ? path('M5.8 -1.8 A3.2 3.2 0 0 1 12.2 -1.8 Z', o.cap, null) : '',
  o.throat ? path('M10.5 0 C11.6 1 11 2.6 9 2.6 C9 1.6 9.6 0.6 10.5 0 Z', o.throat, null) : '',
  path('M12 -2.4 L17 -1 L12 0 Z', o.bill ?? C.dark, C.ink, 0.6), circle(10.2, -2.2, 0.6, C.ink, null),
);
/** A tiny bird silhouette in flight. */
const flyer = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M-8 1 Q-4 -5 0 0 Q4 -5 8 1', col, 1.5));
const SILVER = '#c9d2da';
const flip = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
type Fin = [x1: number, x2: number, h: number, col?: string];
type FishO = {
  L?: number; H?: number; B?: number; col: string; belly?: string; tail?: 'fork' | 'round' | 'square' | 'moon' | 'none'; tailCol?: string; T?: number;
  dorsal?: Fin[]; anal?: Fin[]; pelvic?: boolean; pect?: string | false; finCol?: string; eye?: number; iris?: string; snout?: 'duck' | 'big' | 'small' | 'down';
  marks?: Svg; over?: Svg; gill?: boolean; spiny?: boolean;
};
function fishSide(o: FishO): Svg {
  const L = o.L ?? 30, H = o.H ?? 10, B = o.B ?? H * 0.85, tx = f1(L * 0.78), T = o.T ?? H * 0.95, fc = o.finCol ?? o.col, tc = o.tailCol ?? fc;
  const bodyD = `M${-L} 0 C${f1(-L * 0.75)} ${f1(-H * 1.05)} ${f1(L * 0.35)} ${f1(-H * 1.02)} ${tx} ${f1(-H * 0.22)} L${tx} ${f1(B * 0.22)} C${f1(L * 0.35)} ${f1(B * 1.02)} ${f1(-L * 0.75)} ${f1(B * 1.05)} ${-L} 0 Z`;
  const tails: Record<string, string> = {
    fork: `M${f1(tx - 2)} 0 L${f1(tx + T)} ${f1(-T)} L${f1(tx + T * 0.55)} 0 L${f1(tx + T)} ${f1(T)} Z`,
    moon: `M${f1(tx - 2)} 0 L${f1(tx + T * 0.7)} ${f1(-T * 1.3)} C${f1(tx + T * 0.5)} ${f1(-T * 0.4)} ${f1(tx + T * 0.5)} ${f1(T * 0.4)} ${f1(tx + T * 0.7)} ${f1(T * 1.3)} Z`,
    round: `M${f1(tx - 2)} ${f1(-H * 0.25)} C${f1(tx + T * 1.3)} ${f1(-T * 1.1)} ${f1(tx + T * 1.3)} ${f1(T * 1.1)} ${f1(tx - 2)} ${f1(B * 0.25)} Z`,
    square: `M${f1(tx - 2)} ${f1(-H * 0.25)} L${f1(tx + T)} ${f1(-T)} L${f1(tx + T * 0.92)} 0 L${f1(tx + T)} ${f1(T)} L${f1(tx - 2)} ${f1(B * 0.25)} Z`,
    none: '',
  };
  const fins = (o.dorsal ?? []).map(([a, b, h, col]) => path(`M${a} ${f1(-H * 0.55)} L${f1(a + (b - a) * (o.spiny ? 0.15 : 0.3))} ${f1(-H - h)} ${o.spiny ? `L${f1(a + (b - a) * 0.5)} ${f1(-H - h * 0.8)} ` : ''}L${b} ${f1(-H * 0.7)} Z`, col ?? fc, C.ink, 1));
  const anals = (o.anal ?? []).map(([a, b, h, col]) => path(`M${a} ${f1(B * 0.55)} L${f1(a + (b - a) * 0.35)} ${f1(B + h)} L${b} ${f1(B * 0.6)} Z`, col ?? fc, C.ink, 1));
  const pelvic = o.pelvic === false ? '' : path(`M${f1(-L * 0.35)} ${f1(B * 0.75)} L${f1(-L * 0.25)} ${f1(B + 5)} L${f1(-L * 0.1)} ${f1(B * 0.8)} Z`, fc, C.ink, 1);
  const eyeR = o.eye ?? Math.max(1.6, H * 0.2), ex = f1(-L * 0.72), ey = f1(-H * 0.28);
  const mouth = o.snout === 'big' ? path(`M${-L} 0 L${f1(-L * 0.7)} ${f1(B * 0.2)} L${-L} ${f1(B * 0.35)}`, '#7a3a3a', C.ink, 0.9)
    : o.snout === 'down' ? line(`M${f1(-L + 0.5)} ${f1(B * 0.2)} L${f1(-L * 0.88)} ${f1(B * 0.3)}`, C.ink, 1)
    : line(`M${-L} ${f1(B * 0.05)} L${f1(-L * 0.86)} ${f1(B * 0.1)}`, C.ink, 1);
  const belly = o.belly ? path(`M${f1(-L * 0.9)} ${f1(B * 0.22)} C${f1(-L * 0.5)} ${f1(B * 0.98)} ${f1(L * 0.4)} ${f1(B * 0.98)} ${f1(tx - 1)} ${f1(B * 0.2)} C${f1(L * 0.3)} ${f1(B * 0.42)} ${f1(-L * 0.4)} ${f1(B * 0.46)} ${f1(-L * 0.9)} ${f1(B * 0.22)} Z`, o.belly, null) : '';
  const pect = o.pect === false ? '' : path(`M${f1(-L * 0.5)} ${f1(B * 0.15)} C${f1(-L * 0.38)} ${f1(B * 0.05)} ${f1(-L * 0.22)} ${f1(B * 0.35)} ${f1(-L * 0.3)} ${f1(B * 0.62)} C${f1(-L * 0.4)} ${f1(B * 0.5)} ${f1(-L * 0.48)} ${f1(B * 0.35)} ${f1(-L * 0.5)} ${f1(B * 0.15)} Z`, o.pect ?? fc, C.ink, 0.9);
  return all(...fins, ...anals, pelvic, (o.tail ?? 'fork') === 'none' ? '' : path(tails[o.tail ?? 'fork']!, tc, C.ink, 1.1), path(bodyD, o.col, C.ink, 1.3), belly, o.marks ?? '',
    o.gill === false ? '' : path(`M${f1(-L * 0.56)} ${f1(-H * 0.7)} C${f1(-L * 0.48)} ${f1(-H * 0.2)} ${f1(-L * 0.48)} ${f1(B * 0.3)} ${f1(-L * 0.58)} ${f1(B * 0.75)}`, 'none', C.ink, 0.9),
    pect, circle(ex, ey, eyeR, o.iris ?? C.white, C.ink, 0.8), circle(f1(ex - eyeR * 0.15), ey, f1(eyeR * 0.5), C.ink, null), mouth, o.over ?? '');
}
const fishAt = (x: number, y: number, s: number, o: FishO, right = false) => (right ? flip(x, y, s, fishSide(o)) : at(x, y, s, fishSide(o)));
const spots = (pts: number[][], col: string, r = 1.2) => all(...pts.map(([x, y, rr]) => circle(x!, y!, rr ?? r, col, null)));
const PIKE: FishO = { L: 46, H: 7, B: 7, col: '#7f9a4a', belly: '#e8e2b8', tail: 'fork', T: 9, finCol: '#9a8a4a', dorsal: [[22, 33, 6]], anal: [[22, 32, 5]], snout: 'big',
  marks: spots([[-20, -2], [-10, -4], [0, -1], [10, -4], [20, -2], [-14, 3], [-4, 4], [6, 2], [16, 3], [26, -1]], '#e3e6a8', 1.5), over: path('M-46 0 L-36 -3 M-46 0 L-36 2', 'none', C.ink, 0.6) };
const SALMON: FishO = { L: 32, H: 8, B: 7, col: '#9aa8b8', belly: '#eef0f4', tail: 'square', T: 8, finCol: '#8a98a8', dorsal: [[-6, 6, 6], [16, 19, 2.5]], anal: [[10, 18, 4]], marks: spots([[-14, -5], [-6, -6], [2, -6], [10, -5], [-10, -2], [6, -3]], '#3a3a4a', 0.9) };

// ── Own helpers (T06) ────────────────────────────────────────────────
const SCENT = '#9b6bc4';
const DAWN = '#f4d9b8';
const BOG = '#b9b46a';
const WATER = '#7db7df';
/** Wavy scent line from (x, y) going in direction dx (±1), n waves. */
const scent = (x: number, y: number, n = 3, dx = 1, col: string = SCENT) => line(`M${x} ${y} ` + range(n).map((i) => `q${3 * dx} ${i % 2 ? 3 : -3} ${6 * dx} 0`).join(' '), col, 1.6, '2 1.6');
/** Sound arcs opening to the right (mirror with dx = -1). */
const arcs = (x: number, y: number, s = 1, dx = 1, col: string = C.ink) => g(`translate(${x} ${y}) scale(${s * dx} ${s})`, line('M0 -4 A5 5 0 0 1 0 4 M4 -8 A10 10 0 0 1 4 8 M8 -12 A15 15 0 0 1 8 12', col, 1.5));
const growl = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M0 -3 l3 2 l3 -2 l3 2 l3 -2 l3 2 M0 3 l3 2 l3 -2 l3 2 l3 -2 l3 2', col, 1.3));
const speedL = (x: number, y: number, n = 3, len = 10, col: string = C.grey) => line(range(n).map((i) => `M${x} ${y + i * 5} l${-len} 0`).join(' '), col, 1.4);
const dashLoop = (cx: number, cy: number, rx: number, ry: number, col: string = HL) => ellipse(cx, cy, rx, ry, 'none', col, 2.2).replace('/>', ' stroke-dasharray="5 3"/>');
const dashPath = (d: string, col: string = HL, sw = 2) => line(d, col, sw, '4 3');
const water = (y = 70, col: string = WATER) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.white, 1.2));
const tuft = (x: number, y: number, h = 10, col: string = GRASS2) => line(`M${x - 4} ${y} q1 ${-h * 0.7} -2 ${-h} M${x} ${y} l0 ${-h * 1.1} M${x + 4} ${y} q-1 ${-h * 0.7} 2 ${-h}`, col, 1.4);
const tallGrass = (y: number, x0: number, x1: number, h = 14) => all(...range(Math.floor((x1 - x0) / 7)).map((i) => tuft(x0 + i * 7, y, h + (i % 3) * 2)));
const dryBranch = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 6), line(`M${x1} ${y1} L${x2} ${y2}`, '#b8a184', 4));
const stump = (x: number, y: number, w = 14, h = 12) => all(rect(x - w / 2, y - h, w, h, '#8a5a35', 1, C.ink, 1.2), ellipse(x, y - h, w / 2, 2.6, '#d9b98a', C.ink, 1));
const bush = (x: number, y: number, s = 1) => at(x, y, s, path('M-18 0 C-22 -10 -14 -18 -6 -16 C-4 -24 8 -24 10 -16 C18 -18 22 -8 18 0 Z', GRASS2, C.ink, 1.2));
const mountains = (y = 70) => all(path(`M4 ${y} L28 ${y - 34} L44 ${y - 14} L66 ${y - 44} L90 ${y - 12} L104 ${y - 26} L116 ${y - 10} L116 ${y} Z`, '#9aa7b4', C.ink, 1), path(`M60 ${y - 36} L66 ${y - 44} L72 ${y - 35} Z M24 ${y - 29} L28 ${y - 34} L32 ${y - 29} Z`, C.white, null));
const egg2 = (x: number, y: number, col = '#f08a5a') => circle(x, y, 2, col, C.ink, 0.6);
const qmark = (x: number, y: number) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="12" text-anchor="middle" fill="${C.navy}">?</text>`;
/** Capercaillie cock in display: fanned tail, raised head, beard, red brow; feet at (0, 0), facing right. */
const tjader = (o: { grey?: boolean } = {}) => {
  const k = o.grey ? GREY2 : '#2b2d33', fan = o.grey ? GREY : '#33353c';
  return all(
    sil([
      ['M-10 -16 L-30 -38 L-27 -44 L-20 -48 L-12 -49 L-5 -46 L-2 -26 Z', fan],
      ['M-14 -14 C-16 -26 0 -32 10 -30 C16 -29 18 -24 16 -18 C14 -12 6 -10 -2 -10 C-8 -10 -12 -11 -14 -14 Z', k],
      ['M6 -26 C6 -36 10 -46 16 -49 C22 -51 25 -46 23 -42 C21 -38 18 -34 16 -24 Z', k],
      ['M18 -40 C17 -36 18 -33 21 -32 C21 -35 21 -38 20 -40 Z', k],
    ], 1.8),
    o.grey ? '' : all(...[[-24, -40], [-18, -44], [-11, -45], [-6, -40], [-20, -34], [-12, -36]].map(([x, y]) => circle(x!, y!, 1.1, C.white, null)), ellipse(10, -22, 5, 4, '#2f6b55', null)),
    path('M-8 -20 C-2 -26 8 -26 12 -20 C6 -16 -2 -16 -8 -20 Z', o.grey ? GREY : '#6b4a2b', C.ink, 0.8),
    path('M22.5 -46 L28.5 -44 L23 -41.5 Z', '#ece4c4', C.ink, 0.8), path('M17 -48.5 C18.5 -50.5 21 -50.5 22 -48.5 C20 -47.6 18.5 -47.6 17 -48.5 Z', o.grey ? GREY2 : C.red, null),
    circle(19.6, -46.4, 1, C.ink, null), line('M2 -10 L1 0 M7 -10 L7 0 M-1 0 L4 0 M5 0 L10 0', o.grey ? GREY2 : '#6b5b4f', 1.6),
  );
};
/** Black grouse cock: glossy blue-black, lyre tail, white undertail, red comb; feet at (0, 0). */
const orre = (o: { display?: boolean; s?: number } = {}) => all(
  o.display ? path('M-14 -12 C-24 -20 -26 -10 -20 -6 C-18 -12 -16 -12 -12 -10 Z', WHITE, C.ink, 0.9) : '',
  sil([
    o.display ? ['M-10 -10 C-16 -26 -26 -30 -32 -24 C-28 -26 -22 -24 -20 -16 Z', '#20253a'] : ['M-10 -10 C-20 -14 -26 -10 -30 -4 C-26 -6 -22 -6 -18 -6 C-22 -2 -24 2 -28 4 C-22 2 -16 -2 -12 -6 Z', '#20253a'],
    o.display ? ['M-10 -10 C-4 -26 4 -30 12 -26 C6 -24 2 -20 0 -12 Z', '#20253a'] : ['M-12 -8', '#20253a'],
    ['M-12 -10 C-14 -20 -2 -24 6 -22 C12 -21 14 -16 12 -11 C10 -6 2 -5 -4 -5 C-8 -5 -11 -7 -12 -10 Z', '#20253a'],
    ['M6 -20 C6 -28 10 -32 14 -32 C18 -32 19 -28 17 -25 C15 -23 12 -20 11 -14 Z', '#20253a'],
  ], 1.6),
  path('M-12 -8 C-14 -4 -10 -2 -6 -4 C-8 -6 -10 -6 -12 -8 Z', WHITE, null),
  line('M-6 -14 L4 -15', WHITE, 1.6), path('M12 -33 C14 -35 17 -35 18 -33 C16 -32 14 -32 12 -33 Z', C.red, null),
  path('M18 -30 L22 -29 L18 -27.5 Z', '#3a3a3a', C.ink, 0.6), circle(15.4, -30.6, 0.9, C.ink, null),
  line('M0 -5 L-1 0 M4 -5 L4 0', '#4a4a4a', 1.4),
);
/** Peacock: blue body and neck, crest; fan = raised tail of eye feathers, otherwise a long trailing train. */
const peacock = (fan = false) => all(
  fan
    ? all(path('M0 -14 L-44 -20 C-46 -50 -20 -72 0 -72 C20 -72 46 -50 44 -20 Z', '#3f8a4f', C.ink, 1.2),
      ...range(9).map((i) => { const a = Math.PI * (1.08 + i * 0.105); return line(`M0 -14 L${f1(Math.cos(a) * 40)} ${f1(-14 + Math.sin(a) * 52)}`, '#2f6b3c', 0.8); }),
      ...range(9).map((i) => { const a = Math.PI * (1.08 + i * 0.105); const x = f1(Math.cos(a) * 36), y = f1(-14 + Math.sin(a) * 47); return all(ellipse(x, y, 4, 4.6, '#2a5fb0', C.ink, 0.6), ellipse(x, y, 2, 2.4, '#1a2f6a', null), ellipse(x, y - 3.4, 3, 1.6, '#e3b23c', null)); }),
      ...range(6).map((i) => { const a = Math.PI * (1.14 + i * 0.145); const x = f1(Math.cos(a) * 22), y = f1(-14 + Math.sin(a) * 30); return all(ellipse(x, y, 3.4, 4, '#2a5fb0', C.ink, 0.6), ellipse(x, y, 1.6, 2, '#1a2f6a', null)); }))
    : all(path('M-6 -10 C-20 -8 -38 -4 -54 0 C-40 2 -20 2 -4 -2 Z', '#3f8a4f', C.ink, 1.1), ...[-44, -34, -24, -14].map((x) => ellipse(x, -2 + (x + 44) * -0.12, 2.6, 1.8, '#2a5fb0', C.ink, 0.5))),
  sil([
    ['M-8 -10 C-10 -20 0 -24 6 -22 C10 -21 12 -16 10 -11 C8 -7 2 -6 -2 -6 C-6 -6 -8 -8 -8 -10 Z', '#8a6a3c'],
    ['M3 -20 C2 -28 4 -36 8 -40 C11 -42 14 -40 13 -37 C11 -34 9 -30 9 -20 Z', '#2a5fb0'],
  ], 1.6),
  path('M3 -20 C6 -14 9 -12 10 -11 C8 -16 6 -18 3 -20 Z', '#2a5fb0', null),
  line('M10 -41 l-1 -5 M11.5 -41 l1 -5 M12.8 -40.5 l3 -4', '#2a5fb0', 1), circle(9, -46, 0.9, '#2a5fb0', null), circle(13, -45.5, 0.9, '#2a5fb0', null), circle(16, -44.5, 0.9, '#2a5fb0', null),
  path('M13 -38.5 L17 -37.5 L13 -36.5 Z', '#9a9a8a', C.ink, 0.5), circle(10.8, -38.4, 0.8, C.ink, null), line('M10.5 -37.6 L12 -37.6', C.white, 0.8),
  line('M0 -6 L-1 0 M4 -6 L4 0', '#7a7a7a', 1.4),
);
/** Peahen: brown, small crest, green neck. */
const peahen = () => all(sil([
  ['M-16 -8 L-24 -10 L-22 -5 Z', '#9a8060'],
  ['M-8 -10 C-10 -20 0 -24 6 -22 C10 -21 12 -16 10 -11 C8 -7 2 -6 -2 -6 C-6 -6 -8 -8 -8 -10 Z', '#9a8060'],
  ['M3 -20 C2 -26 4 -32 8 -34 C11 -35 13 -33 12 -31 C10 -28 9 -26 9 -18 Z', '#7a8a5a'],
], 1.5), line('M9.5 -35 l-1 -4 M11 -35 l1 -4', '#7a6a50', 1), path('M12 -32.5 L15.5 -31.6 L12 -30.8 Z', '#9a9a8a', C.ink, 0.5), circle(10, -32.4, 0.7, C.ink, null), line('M0 -6 L-1 0 M4 -6 L4 0', '#7a7a7a', 1.3));
/** Greylag goose, side; headUp = alert sentry, otherwise grazing. */
const goose = (headUp = false, hl = false) => all(
  sil([
    ['M-14 -10 L-22 -14 L-20 -8 Z', '#8d8f92'],
    ['M-16 -10 C-18 -20 -4 -24 6 -21 C12 -19 14 -14 12 -9 C10 -5 2 -4 -6 -4 C-12 -4 -15 -6 -16 -10 Z', '#a7a9ac'],
    headUp ? ['M6 -19 C6 -28 8 -36 12 -38 C15 -39 17 -37 16 -34 C14 -31 12 -27 12 -17 Z', '#a7a9ac'] : ['M8 -18 C14 -18 18 -12 20 -4 C21 -2 19 -1 17 -2 C15 -8 12 -12 8 -12 Z', '#a7a9ac'],
  ], 1.5),
  path('M-12 -16 C-4 -20 4 -19 8 -15 C2 -12 -6 -12 -12 -16 Z', '#7d8084', C.ink, 0.7), path('M-6 -6 C0 -4 6 -4 10 -7', 'none', WHITE, 1.4),
  headUp ? all(path('M15.5 -36.5 L21 -35 L15.6 -33.5 Z', ORANGE, C.ink, 0.6), circle(13.4, -35.6, 0.8, C.ink, null)) : all(path('M19 -3.5 L22 1 L18.5 0 Z', ORANGE, C.ink, 0.6), circle(17.5, -5, 0.7, C.ink, null)),
  line('M-2 -4 L-3 0 M3 -4 L3 0', ORANGE, 1.4),
  hl && headUp ? ring(13, -34, 7) : '',
);
/** A roe deer fawn lying curled, white spots; centre bottom (0, 0). */
const fawnLying = (o: { grey?: boolean } = {}) => {
  const c = o.grey ? GREY : '#b8673a';
  return all(
    sil([
      ['M-18 0 C-22 -10 -10 -14 2 -13 C12 -12 16 -6 14 0 Z', c],
      ['M8 -11 C8 -20 16 -24 22 -21 L28 -16 C29 -14 27 -12 24 -13 L18 -12 Z', c],
      ['M12 -21 C9 -27 12 -29 15 -24 Z', c], ['M16 -22 C18 -28 21 -27 19 -21 Z', c],
    ], 1.6),
    o.grey ? '' : all(...[[-12, -8], [-6, -10], [0, -10], [6, -9], [-9, -4], [-2, -5], [5, -4]].map(([x, y]) => circle(x!, y!, 1.1, '#f6efe0', null))),
    eye(20, -18, 1), circle(28, -15.4, 0.9, C.ink, null),
  );
};
/** A wasp seen from above, head up, centre (0, 0). */
const wasp = (s = 1) => at(0, 0, s,
  ellipse(-9, -6, 9, 4, 'rgba(220,235,245,0.85)', C.ink, 0.8), ellipse(9, -6, 9, 4, 'rgba(220,235,245,0.85)', C.ink, 0.8),
  line('M-3 -2 l-8 4 M-3 2 l-8 6 M3 -2 l8 4 M3 2 l8 6', C.ink, 1),
  ellipse(0, 12, 6, 10, YEL, C.ink, 1.1), line('M-5.6 8 L5.6 8 M-5 14 L5 14 M-3 19.5 L3 19.5', BLACK, 2.6), path('M-1 21.6 L0 25 L1 21.6 Z', BLACK, null),
  ellipse(0, 0, 4.4, 4, BLACK, C.ink, 1), circle(0, -7, 4, YEL, C.ink, 1), circle(-2.6, -8, 1.6, BLACK, null), circle(2.6, -8, 1.6, BLACK, null), line('M-1.6 -10.4 l-3 -5 M1.6 -10.4 l3 -5', C.ink, 1));
/** A dull brown beetle seen from above (grey reference); onBack = lying on its back, legs up. */
const beetle = (onBack = false, s = 1) => at(0, 0, s, onBack
  ? all(line('M-6 -2 l-4 -8 l-2 2 M-2 -3 l-1 -9 M2 -3 l1 -9 M6 -2 l4 -8 l2 2', C.ink, 1.3), ellipse(0, 2, 10, 6, '#c9a064', C.ink, 1.1), line('M-8 2 L8 2 M-6 5 L6 5', '#9a7444', 0.9), circle(11, 3, 3, '#5a4a3a', C.ink, 0.8), circle(11.6, 2.4, 0.8, C.white, null))
  : all(line('M-6 -4 l-6 -3 M-7 0 l-6 0 M-6 4 l-6 3 M6 -4 l6 -3 M7 0 l6 0 M6 4 l6 3', C.ink, 1.1), ellipse(0, 1, 7, 9, '#7a5a3a', C.ink, 1), line('M0 -6 L0 10', C.ink, 0.8), circle(0, -9, 3.4, '#5a4a3a', C.ink, 0.9)));
/** Pufferfish: puffed = round ball with spikes; else a slim fish. Head right. */
const puffer = (puffed: boolean, s = 1) => at(0, 0, s, puffed
  ? all(...range(18).map((i) => { const a = (i / 18) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 17)} ${f1(Math.sin(a) * 17)} L${f1(Math.cos(a) * 23)} ${f1(Math.sin(a) * 23)}`, C.ink, 1.4); }), path('M-18 0 L-28 -7 L-26 0 L-28 7 Z', '#c9b46a', C.ink, 1), circle(0, 0, 18, '#e2cf7a', C.ink, 1.3), path('M-14 6 C-6 16 8 16 14 6 C6 10 -6 10 -14 6 Z', '#f4ecd0', null), circle(9, -6, 3, C.white, C.ink, 0.8), circle(10, -6, 1.5, C.ink, null), line('M16 2 l3 0', C.ink, 1.2))
  : all(path('M-14 0 L-22 -5 L-20 0 L-22 5 Z', '#c9b46a', C.ink, 1), path('M-15 0 C-10 -7 8 -8 14 0 C8 6 -10 6 -15 0 Z', '#e2cf7a', C.ink, 1.1), circle(8, -2, 1.8, C.white, C.ink, 0.6), circle(8.6, -2, 0.9, C.ink, null)));
/** A tiny turtle hatchling seen from above, heading up. */
const hatchling = (x: number, y: number, a = 0) => rot(x, y, a, 1, ellipse(0, 0, 4, 5, '#5a6a3a', C.ink, 0.8), circle(0, -6.4, 2, '#6a7a4a', C.ink, 0.7), line('M-3.6 -3 l-3 -2 M3.6 -3 l3 -2 M-3 4 l-2 2 M3 4 l2 2', C.ink, 1.1));
/** A big head of a dog-like animal facing right (close-up); bared = lips drawn back showing teeth; ears back or up. */
const canineHead = (o: { col?: string; bared?: boolean; growl?: boolean; earsBack?: boolean } = {}) => {
  const c = o.col ?? '#8c8f94';
  return all(
    sil([
      o.earsBack ? ['M-16 -16 L-32 -22 L-20 -8 Z', c] : ['M-14 -18 L-20 -44 L-4 -24 Z', c],
      o.earsBack ? ['M-8 -20 L-22 -30 L-10 -14 Z', c] : ['M-2 -22 L4 -46 L10 -22 Z', c],
      ['M-30 20 C-34 0 -24 -22 -4 -24 C10 -25 20 -18 30 -10 L44 -4 C48 -2 48 4 44 6 L30 10 C22 18 10 24 -4 26 C-16 28 -26 26 -30 20 Z', c],
    ], 2),
    path('M18 4 C24 8 34 9 42 6 C36 12 26 14 18 10 Z', '#e6e1d8', null),
    circle(45, -1, 3.2, C.ink, null),
    o.bared
      ? all(path('M22 2 C30 4 38 4 44 4 L44 10 C38 12 30 12 22 9 Z', '#7a2e2e', C.ink, 1), line('M24 3.4 l1 3 M28 3.8 l1 3.4 M32 4 l0.8 3.6 M36 4 l0.6 3.4 M40 4 l0.4 3 M26 10 l1 -2.4 M31 10.6 l0.8 -2.6 M36 10.6 l0.6 -2.4', C.white, 2.2), line('M28 -4 C30 -6 34 -6 36 -4 M30 -1 C32 -3 35 -3 37 -1', shade(c, 0.6), 1.2))
      : line('M24 6 C30 8 38 8 44 5', C.ink, 1.3),
    o.growl ? line('M28 -4 C30 -6 34 -6 36 -4', shade(c, 0.6), 1.2) : '',
    eye(14, -10, 2.2), o.bared || o.growl ? line('M8 -15 L18 -12', C.ink, 1.6) : '',
  );
};
/** A wolf sitting with its head raised (howling); feet at (0, 0), facing right. */
const wolfHowl = () => all(
  sil([
    ['M-20 0 C-30 0 -36 -6 -34 -10 C-28 -6 -22 -6 -16 -6 Z', '#8c8f94'],
    ['M-20 0 C-24 -14 -16 -30 -4 -36 C4 -40 10 -36 10 -28 L8 -8 C8 -2 4 0 0 0 Z', '#8c8f94'],
    [LEG(2, -16, 5, 0, 4, 2), '#8c8f94'],
    ['M-2 -34 C0 -44 6 -52 12 -58 L20 -64 C22 -66 25 -64 24 -61 L18 -52 C14 -46 10 -40 8 -32 Z', '#8c8f94'],
    ['M2 -46 L-2 -54 L6 -50 Z', '#8c8f94'],
  ]),
  path('M10 -36 C12 -30 12 -20 9 -10 C6 -18 6 -28 8 -34 Z', '#d9d6cf', null), circle(10.4, -53, 1.1, C.ink, null),
  path('M20 -60 L24 -62 L22 -58 Z', '#7a2e2e', null),
);
/** A dog standing, facing right; raggs = raised hackles; tail: 'up' | 'down' | 'tucked' | 'wag'. */
const dog = (o: { col?: string; ragg?: boolean; tail?: 'up' | 'down' | 'tucked' | 'wag'; low?: boolean } = {}) => {
  const c = o.col ?? '#c49a5c', t = o.tail ?? 'up';
  const tailD = t === 'up' ? 'M-22 -22 C-30 -26 -32 -36 -28 -42 C-26 -34 -24 -30 -18 -26 Z' : t === 'down' ? 'M-22 -20 C-30 -18 -32 -10 -30 -4 C-26 -10 -24 -14 -20 -16 Z' : t === 'tucked' ? 'M-22 -18 C-18 -12 -12 -10 -8 -12 C-12 -14 -16 -16 -20 -20 Z' : 'M-22 -22 C-30 -28 -30 -38 -26 -44 C-24 -36 -22 -32 -18 -26 Z';
  return all(
    t === 'wag' ? all(path('M-22 -22 C-34 -24 -40 -32 -40 -40 C-34 -34 -28 -30 -20 -26 Z', 'none', C.grey, 1.2), path('M-22 -22 C-26 -30 -22 -40 -14 -44 C-16 -36 -18 -30 -16 -26 Z', 'none', C.grey, 1.2), line('M-36 -46 l-4 -2 M-30 -50 l-2 -4 M-20 -50 l1 -4', C.grey, 1.4)) : '',
    sil([
      [tailD, c],
      ['M-24 -20 C-26 -30 -12 -32 0 -31 C8 -31 12 -32 16 -34 L22 -26 C20 -20 14 -17 6 -17 L-16 -17 C-21 -17 -24 -18 -24 -20 Z', c],
      [LEG(-18, -19, 5, 0, 4, -1), c], [LEG(10, -19, 5, 0, 4, 1), c],
      o.low ? ['M14 -30 C16 -34 24 -34 28 -30 L38 -22 C39 -20 37 -19 34 -19 L24 -19 L18 -22 Z', c] : ['M14 -32 C16 -40 24 -42 28 -38 L38 -32 C39 -30 37 -29 34 -29 L26 -28 L22 -24 Z', c],
      o.low ? ['M18 -31 L12 -36 L22 -33 Z', shade(c, 0.75)] : ['M19 -38 L18 -48 L24 -40 Z', shade(c, 0.75)],
    ]),
    o.ragg ? line('M-18 -30 l-1 -5 M-14 -31 l0 -6 M-10 -31.5 l0 -6.4 M-6 -31.6 l0.4 -6.4 M-2 -31.4 l0.6 -6 M2 -31.2 l0.8 -5.4 M6 -31.4 l1 -5', shade(c, 0.6), 1.6) : '',
    o.low ? all(eye(27, -26, 1.1), circle(38.4, -21.4, 1.2, C.ink, null)) : all(eye(28, -35, 1.1), circle(38.4, -31.6, 1.2, C.ink, null)),
  );
};
/** A simple sheep from the side, facing right. */
const sheep = (grey = false) => all(sil([[LEG(-8, -8, 3, 0, 2.4, 0), C.dark], [LEG(8, -8, 3, 0, 2.4, 0), C.dark],
  ['M-14 -10 C-18 -20 -8 -24 0 -22 C8 -24 16 -20 14 -12 C14 -6 6 -5 0 -6 C-8 -5 -14 -6 -14 -10 Z', grey ? GREY : '#f2efe6'],
  ['M12 -20 C14 -24 22 -22 22 -16 C22 -12 18 -12 14 -14 Z', C.dark]], 1.4), circle(18, -18, 0.8, C.white, null));
/** A dam wall across a river seen from the side. */
const dam = (x: number, top: number, bottom = 112) => all(rect(x - 6, top, 12, bottom - top, '#b9b6ae', 1, C.ink, 1.3), line(`M${x - 6} ${top + 10} L${x + 6} ${top + 10} M${x - 6} ${top + 24} L${x + 6} ${top + 24}`, '#8d8a82', 1));
/** A simple barn. */
const barn = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -18, 28, 18, '#b5452e', 1, C.ink, 1.2), path('M-17 -18 L0 -30 L17 -18 Z', '#7a3a2a', C.ink, 1.2), rect(-5, -11, 10, 11, '#6a2a1e', 1, C.ink, 1));
/** A fan of short lines that shows a display ("look at me"). */
const burst = (x: number, y: number, r1: number, r2: number, n = 9, a0 = Math.PI, a1 = 2 * Math.PI, col: string = C.gold) => line(range(n).map((i) => { const a = a0 + ((a1 - a0) * i) / (n - 1); return `M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`; }).join(' '), col, 1.8);
const shieldIcon = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, path('M0 -10 L9 -7 C9 3 5 8 0 11 C-5 8 -9 3 -9 -7 Z', col, C.ink, 1.2));
const steps = (x: number, y: number) => all(rect(x, y - 30, 26, 30, '#d9c9a4', 1, C.ink, 1.2), rect(x + 26, y - 20, 26, 20, '#e6dabd', 1, C.ink, 1.2), rect(x + 52, y - 10, 26, 10, '#efe7d2', 1, C.ink, 1.2));

const SAND2 = '#ecd9a8';
const AUTUMN2 = '#e39a3b';
const leafIcon2 = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 4 C-6 -4 0 -8 7 -7 C8 0 4 6 -4 6 Z', AUTUMN2, C.ink, 1), line('M-5 5 L4 -3', C.ink, 0.8));
const snowflake = (x: number, y: number, r = 6) => line(range(3).map((i) => { const a = (i / 3) * Math.PI; return `M${f1(x - Math.cos(a) * r)} ${f1(y - Math.sin(a) * r)} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' '), '#6fa8d6', 2);
/** A round deciduous tree, trunk foot at (0, 0). */
const treeT = () => all(rect(-3, -36, 6, 36, BARK, 1, C.ink, 1.1), circle(0, -42, 14, GRASS2, C.ink, 1.2), circle(-9, -34, 8, GRASS2, null), circle(9, -35, 8, GRASS2, null));
const note2 = (x: number, y: number, col: string = C.navy) => at(x, y, 1, line('M0 6 L0 -6 L5 -8', col, 1.4), ellipse(-1.8, 6, 2.4, 1.8, col, null));
const pawStep = (x: number, y: number) => at(x, y, 0.8, ellipse(0, 2, 3.4, 2.8, C.dark, null), circle(-3.4, -2.4, 1.3, C.dark, null), circle(-1.2, -4, 1.3, C.dark, null), circle(1.2, -4, 1.3, C.dark, null), circle(3.4, -2.4, 1.3, C.dark, null));
/** Mirror an already drawn figure around its own origin. */
const atfS = (k: Svg) => g('scale(-1 1)', k);
/** Short bubbling marks (black grouse song). */
const rings2 = (x: number, y: number, dx = 1) => g(`translate(${x} ${y}) scale(${dx} 1)`, circle(0, 0, 2.2, 'none', C.ink, 1.2), circle(5, -5, 2.8, 'none', C.ink, 1.2), circle(11, -9, 3.4, 'none', C.ink, 1.2));
/** A brown grey-hen (female black grouse), small. */
const peahenGrouse = () => all(sil([
  ['M-12 -8 C-14 -18 -2 -22 6 -20 C12 -19 14 -14 12 -9 C10 -5 2 -4 -4 -4 C-8 -4 -11 -6 -12 -8 Z', '#a8845a'],
  ['M6 -18 C6 -26 10 -29 13 -29 C17 -29 18 -26 16 -23 C14 -21 12 -18 11 -12 Z', '#a8845a']], 1.4),
  line('M-8 -12 l3 -1 M-2 -14 l3 -1 M2 -10 l3 -1 M-6 -8 l3 -1', '#6b4a28', 1), path('M17 -27 L20.5 -26 L17 -25 Z', '#3a3a3a', null), circle(14.4, -26.6, 0.8, C.ink, null), line('M0 -4 L-1 0 M4 -4 L4 0', '#6b5b4f', 1.2));
const boltS = (x: number, y: number, s = 1) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const num2 = (x: number, y: number, n: string) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="10" text-anchor="middle" fill="${C.ink}">${n}</text>`;
/** A wolf standing tall: head and tail high. */
const wolfTall = () => all(path('M-26 -32 C-34 -38 -36 -48 -32 -54 C-30 -46 -26 -42 -22 -38 Z', '#8c8f94', C.ink, 1.6), g('translate(0 -4)', wolf()), line('M-4 -44 l0 -4 M2 -45 l0 -4 M8 -45 l0 -4', '#8c8f94', 1.6));
/** A wolf crouching low with head down, ears back and tail tucked (submission). */
const wolfLow = () => all(sil([
  ['M-24 -14 C-18 -8 -10 -6 -6 -8 C-10 -10 -16 -12 -20 -16 Z', '#a9acb0'],
  ['M-26 -12 C-28 -22 -14 -24 0 -23 C8 -23 14 -22 18 -20 L22 -12 C20 -8 14 -6 8 -6 L-18 -6 C-23 -6 -26 -8 -26 -12 Z', '#a9acb0'],
  [LEG(-20, -8, 5, 0, 3.6, -2), '#a9acb0'], [LEG(9, -8, 5, 0, 3.6, 2), '#a9acb0'],
  ['M16 -20 C18 -24 26 -22 30 -16 L38 -8 C39 -6 37 -5 34 -5 L26 -6 L20 -10 Z', '#a9acb0'],
  ['M20 -20 L12 -26 L22 -22 Z', '#a9acb0']]), eye(27, -15, 1.1), circle(38.4, -6.8, 1.2, C.ink, null));
/** A wolf with a raised hind leg (scent marking), facing right. */
const wolfLegUp = () => all(sil([[LEG(14, -22, 4.4, 0, 3.4, 2), shade('#8c8f94', 0.8)],
  ['M-26 -28 C-34 -24 -36 -14 -34 -8 C-30 -12 -26 -18 -24 -24 Z', '#8c8f94'],
  ['M-26 -26 C-28 -36 -14 -38 0 -37 C8 -37 14 -39 18 -41 L24 -32 C22 -25 16 -22 8 -22 L-18 -22 C-23 -22 -26 -23 -26 -26 Z', '#8c8f94'],
  ['M-22 -26 C-30 -30 -40 -32 -46 -30 L-46 -26 C-40 -26 -30 -24 -20 -22 Z', '#8c8f94'],
  [LEG(-16, -24, 5, 0, 3.6, 0), '#8c8f94'], [LEG(9, -24, 5, 0, 3.6, 0), '#8c8f94'],
  ['M15 -40 C17 -48 25 -50 29 -46 L40 -40 C41 -37 39 -36 36 -36 L28 -35 L23 -30 Z', '#8c8f94'],
  ['M20 -46 L21 -55 L26 -47 Z', '#8c8f94'], ['M24 -47 L27 -55 L29 -46 Z', '#8c8f94']]), eye(28, -43, 1.1), circle(40.4, -39.6, 1.2, C.ink, null));
/** Simplified map of Europe and Africa for migration. */
const mapEA2 = () => all(rect(4, 4, 112, 108, '#9cc9ea', 3, null),
  path('M40 8 C56 6 76 8 90 14 C96 22 90 30 80 32 C70 34 60 36 48 34 C38 32 32 22 40 8 Z', '#b8d48a', C.ink, 1),
  path('M38 50 C54 46 76 48 86 56 C92 70 84 88 72 104 C66 108 60 106 58 98 C54 84 40 76 34 64 C32 56 34 52 38 50 Z', '#d9c47a', C.ink, 1));
/** A roe deer running away to the left, showing its white rump (a signal). */
const roeDeerBack = () => atf(0, 0, 1, all(roeDeer({ antlers: false }), ellipse(-21, -36, 5, 7, C.white, C.ink, 1)));
/** A child standing, feet at (0, 0), arms open. */
const kid2 = () => all(line('M-2.5 0 L-2 -12 M2.5 0 L2 -12', C.ink, 2.2), path('M-5 -12 L5 -12 L4.4 -26 L-4.4 -26 Z', C.orange, C.ink, 1), circle(0, -31, 5, C.skin, C.ink, 1), path('M-5 -32 C-5 -38 5 -38 5 -32 C2.4 -34 -2.4 -34 -5 -32 Z', C.hair, null), line('M-4.4 -24 L-10 -16 M4.4 -24 L10 -16', C.ink, 1.8));
/** A sitting person's lap (legs from the side) on a sofa. */
const sofaLap = () => all(rect(10, 60, 100, 30, '#7a8fb0', 6, C.ink, 1.4), rect(10, 40, 18, 46, '#6a7fa0', 6, C.ink, 1.4), path('M34 70 L94 70 L94 80 L34 80 Z', C.denim, C.ink, 1.2), path('M94 70 L100 104 L92 104 L88 80 Z', C.denim, C.ink, 1.2), path('M26 40 L40 40 L42 72 L30 72 Z', C.orange, C.ink, 1.2), circle(34, 32, 7, C.skin, C.ink, 1.2), path('M27 31 C27 22 41 22 41 31 C37 28 31 28 27 31 Z', C.hair, null), line('M40 50 L58 64', C.skin, 4));
/** A cat lying curled up, eyes closed. */
const catCurled = () => all(sil([
  ['M-20 0 C-26 -2 -28 -10 -22 -14 C-14 -18 -2 -18 8 -14 C14 -12 16 -6 14 0 Z', '#e0a060'],
  ['M8 -10 C8 -18 18 -20 22 -14 C24 -10 22 -6 18 -5 C14 -4 10 -6 8 -10 Z', '#e0a060'],
  ['M11 -17 L12 -23 L15 -18 Z', '#e0a060'], ['M17 -18 L20 -23 L21 -16 Z', '#e0a060'],
  ['M-20 0 C-12 4 4 4 12 0 C4 2 -12 2 -20 0 Z', '#e0a060']]), line('M-12 -14 l2 4 M-6 -15 l2 4 M0 -15 l2 4', '#b07a40', 1.3), line('M14 -12 q1.6 1.2 3.2 0', C.ink, 1));
/** A child with a big ear (hearing) at the bottom right, looking up. */
const kidEar = (x: number, y: number) => at(x, y, 1, kid2(), ellipse(5.6, -31, 2, 3, C.skin2, C.ink, 0.8));

// ── Motifs ───────────────────────────────────────────────────────────
export const ANIMAL_BEHAVIOUR_MOTIFS: Record<string, Svg> = {
  // 2761 Jakt och födosök
  'beteende.födosöka': all(bg(), field(84), tallGrass(100, 8, 30, 8), tuft(96, 104, 8),
    dashPath('M14 106 C24 96 34 108 44 98 C52 92 58 104 66 96'), rot(78, 102, 28, 1.7, song(KOLTRAST)), at(96, 104, 1.3, bugIcon(0, 0)), ring(96, 103, 6),
    leafIcon2(28, 90), leafIcon2(52, 106)),
  'beteende.kasta-sig-över': all(bg('#dbe8f2'), rect(4, 76, 112, 36, SNOW, 0, null), line('M4 76 L116 76', '#9fb8cc', 1.2),
    dashPath('M10 70 C24 30 44 22 58 40'), rot(70, 58, 62, 0.85, fox()),
    rect(56, 88, 30, 16, '#e7eff6', 3, '#9fb8cc', 1), at(78, 102, 0.9, vole()), ring(70, 96, 11), line('M58 80 l-4 -5 M66 78 l0 -6 M74 80 l4 -5', '#9fb8cc', 1.4)),
  'beteende.vädra.2': all(bg(), field(92), pine(12, 94, 1.2), pine(108, 94, 0.9), at(36, 104, 0.95, wolf()), ring(73, 67, 8),
    at(96, 100, 0.55, roeDeer()), scent(82, 66, 3, 1), scent(82, 74, 3, 1), scent(84, 58, 2, 1)),
  'beteende.sluka': all(bg(WATER), rect(4, 4, 112, 12, SKY, 0, null), line('M4 16 L116 16', C.white, 1.4), tuft(14, 112, 18, '#5f8a4a'), tuft(104, 112, 22, '#5f8a4a'),
    fishAt(70, 62, 1.15, PIKE), at(10, 62, 1.1, path('M8 0 L14 -4 L13 0 L14 4 Z', SILVER, C.ink, 0.8), path('M2 -3 C5 -3 8 -1 8 0 C8 1 5 3 2 3 Z', SILVER, C.ink, 0.8)), ring(18, 62, 9)),
  'beteende.asätare': all(bg('#dbe8f2'), snowField(92), birch(14, 92, 0.9),
    g('translate(66 62) scale(0.62 -0.62)', roeDeer({ antlers: false, col: '#a07a5a' })), path('M42 92 C52 88 80 88 90 92', 'none', '#9fb8cc', 1.4),
    at(30, 100, 1.2, song({ ...KRAKA })), atf(100, 100, 1.2, song({ ...KRAKA })), at(70, 34, 1.3, flySide({ body: '#9aa0a7', wing: BLACK, head: BLACK, bill: BLACK })), ring(30, 86, 14)),
  'beteende.rota': all(bg(), field(92), path('M70 96 C74 90 90 88 106 94 L108 102 L70 102 Z', SOIL, C.ink, 1),
    rot(46, 100, 12, 1.1, boar()), circle(96, 86, 2, SOIL, C.ink, 0.8), circle(104, 82, 1.6, SOIL, C.ink, 0.8), circle(90, 82, 1.4, SOIL, C.ink, 0.8), ring(92, 92, 9)),
  'beteende.hamstra.2': all(bg(), field(96), rect(4, 4, 30, 108, BARK, 0, C.ink, 1.2), ellipse(22, 58, 8, 11, '#3a2a1e', C.ink, 1.2),
    nut(19, 60, 0.9), nut(24, 63, 0.9), nut(20, 66, 0.9), nut(25, 55, 0.8), oval(22, 58, 12, 15), at(72, 102, 1.5, squirrel()),
    arrow(58, 74, 38, 64), nut(92, 104, 1), nut(100, 106, 1)),

  // 2762 Kamouflage och försvar
  'beteende.skyddsfärg': all(bg('#e4eef6'), snowField(80), pine(18, 82, 1.2), pine(102, 82, 1.1), at(60, 100, 1.1, hare({ white: true })), dashLoop(60, 76, 26, 26)),
  'beteende.gömställe': all(bg(), field(90), rockShape(64, 100, 60, 28), path('M52 100 C52 92 66 92 66 100 Z', '#3a2a1e', null),
    at(66, 99, 1.1, mouse()), oval(62, 94, 18, 10), at(30, 26, 1.4, flyer(0, 0, 1.4)), bush(102, 100, 0.8)),
  'beteende.orörlig': all(bg(), field(88), tallGrass(104, 6, 116, 12), at(54, 102, 1.4, fawnLying()), ring(58, 90, 22),
    greyPanel(78, 8, 38, 30, at(98, 34, 0.4, roeDeer({ grey: true, antlers: false })), speedL(86, 22, 3, 6, GREY2))),
  'beteende.byta-färg': all(panel(6, 20, 44, 60, rect(7, 62, 42, 17, GRASS, 0, null), at(28, 72, 0.7, hare())), panel(70, 20, 44, 60, rect(71, 62, 42, 17, SNOW, 0, null), at(92, 72, 0.7, hare({ white: true }))),
    arrow(52, 50, 68, 50), leafIcon2(18, 30), snowflake(104, 30)),
  'beteende.varningsfärg': all(bg(), field(96), at(60, 52, 1.6, wasp()), oval(60, 64, 22, 30), atf(22, 100, 1.4, song(RODHAKE)),
    greyPanel(84, 76, 30, 30, at(99, 92, 0.9, beetle()))),
  'beteende.spela-död': all(bg(), field(84), at(46, 98, 1.6, beetle(true)), ring(48, 98, 20), atf(98, 96, 1.6, song(KOLTRAST)), qmark(86, 54)),
  'beteende.rulla-ihop-sig': all(bg(), field(92), at(24, 100, 0.8, hedgehog()), arrow(46, 82, 62, 82),
    at(88, 98, 1, all(...range(20).map((i) => { const a = (i / 20) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 15)} ${f1(-16 + Math.sin(a) * 15)} L${f1(Math.cos(a) * 21)} ${f1(-16 + Math.sin(a) * 21)}`, '#5a4636', 1.6); }), circle(0, -16, 16, '#7a6450', C.ink, 1.3))), ring(88, 82, 24)),
  'beteende.tagg': all(bg(), field(96), at(50, 104, 2.6, hedgehog()), ring(40, 56, 10)),
  'beteende.blåsa-upp-sig': all(bg(WATER), at(24, 60, 1, puffer(false)), arrow(40, 60, 56, 60), at(86, 60, 1, puffer(true)), ring(86, 60, 28)),
  'beteende.försvara-sig.2': all(bg(), field(96), at(24, 104, 0.8, dog({ tail: 'up' })), arrow(30, 70, 46, 76, C.grey, 2.4),
    atf(88, 104, 1.2, cat()), line('M60 82 L52 78 L56 84', C.ink, 2), shieldIcon(88, 46, 1.4)),

  // 2763 Revir och territorium
  'beteende.revir': all(bg(), field(76), dashLoop(54, 92, 46, 14), at(54, 86, 1.1, treeT()), at(56, 46, 1.2, song({ ...KOLTRAST, open: true })), note2(74, 36),
    at(106, 104, 0.9, song(KOLTRAST)), cross(106, 82, 5)),
  'beteende.hemområde': all(rect(4, 4, 112, 108, '#cfe3b4', 3, null), pine(20, 30, 0.7), pine(96, 96, 0.7), rockShape(94, 34, 14, 8), ellipse(30, 92, 10, 5, '#7db7df', C.ink, 0.8),
    dashPath('M60 60 C40 40 30 24 50 18 C74 12 100 22 98 46 C96 70 108 86 84 98 C62 108 34 104 30 84 C28 70 50 70 60 60', '#8a6a4a', 2),
    at(60, 66, 0.55, fox()), ellipse(60, 70, 6, 2.6, '#3a2a1e', null), pawStep(50, 18), pawStep(98, 46), pawStep(84, 98)),
  'beteende.markera-revir': all(bg(), field(84), dashLoop(60, 98, 50, 10), ...[[14, 98], [36, 89], [84, 89], [106, 98], [60, 108], [30, 106], [90, 106]].map(([x, y]) => circle(x!, y!, 2.6, SCENT, C.ink, 0.6)),
    at(56, 92, 0.8, wolf()), scent(30, 84, 2, -1), scent(90, 84, 2, 1), cross(108, 70, 5), at(110, 84, 0.3, wolf({ grey: true }))),
  'beteende.doftmärka': all(bg(), field(92), pine(14, 94, 1.1), stump(96, 102, 16, 16), scent(92, 82, 2, -1), scent(100, 80, 2, 1), scent(96, 72, 2, 1), ring(96, 92, 12),
    atf(70, 104, 0.95, wolfLegUp())),
  'beteende.klösa': all(bg(), field(96), rect(70, 4, 30, 100, BARK, 0, C.ink, 1.2), line('M76 38 l4 18 M82 36 l4 18 M88 36 l4 18', '#e8d2a8', 2.2), oval(84, 48, 14, 16),
    rot(40, 100, -62, 0.66, bear())),
  'beteende.trumning': all(bg(), dryBranch(4, 92, 70, 40), dryBranch(40, 66, 60, 90), woodpecker(56, 56, 1.6, true), speedL(78, 30, 3, 6, C.ink), arcs(36, 44, 1, -1), arcs(84, 62, 1, 1), ring(46, 50, 9)),
  'beteende.revirsång': all(bg(), field(90), at(58, 92, 1.4, treeT()), at(60, 38, 1.4, song({ ...BOFINK, open: true })), note2(82, 26), note2(94, 38), note2(78, 12),
    dashLoop(58, 100, 50, 8)),
  'beteende.revirhävdande': all(bg(), field(96), at(36, 98, 2.2, song({ ...RODHAKE, open: true })), jag(66, 54, 1.4), atf(98, 98, 1.6, song(RODHAKE)), arrow(62, 70, 80, 70), oval(42, 78, 24, 22),
    greyPanel(70, 8, 44, 30, line('M74 30 L110 30', GREY2, 2), at(84, 30, 0.55, song({ body: GREY, head: GREY, wing: GREY2, tail: GREY2 })), at(100, 30, 0.55, song({ body: GREY, head: GREY, wing: GREY2, tail: GREY2 })))),
  'beteende.inkräktare': all(bg(), field(80), dashLoop(46, 96, 40, 12), at(40, 86, 0.9, treeT()), at(40, 52, 1, song(KOLTRAST)), at(98, 96, 1.2, song(KOLTRAST)), arrow(110, 80, 92, 80, C.grey, 2.2), ring(98, 86, 14)),
  'beteende.hotfull': all(bg(WATER), rect(4, 4, 112, 50, SKY, 0, null), at(52, 90, 1.7, swan({ wings: true, neck: 'down', knob: true })), oval(54, 66, 40, 30),
    greyPanel(84, 8, 30, 30, at(98, 32, 0.45, swan({ col: GREY, bill: GREY2 })))),
  'beteende.jaga-bort': all(bg(), field(96), at(28, 100, 1.1, treeT()), at(64, 58, 1.5, flySide({ body: BLACK, wing: '#33333a', bill: '#f0a530' })), at(98, 40, 1.4, flySide({ body: BLACK, wing: '#33333a', bill: '#f0a530', up: false })),
    arrow(84, 50, 114, 32), speedL(46, 56, 3, 8)),

  // 2764 Parning och uppvaktning
  'beteende.uppvaktning.2': all(bg(), field(96), at(36, 100, 1.8, song({ ...BOFINK })), at(100, 100, 1.6, atfS(song({ body: '#b49a7a', belly: '#d8c8b0', head: '#9a8a70', wing: BLACK, bar: WHITE, tail: '#4a4a50' }))),
    at(70, 62, 1, bugIcon(0, 0)), dashPath('M66 50 C70 44 76 44 80 50'), sparkle(64, 36, 4), sparkle(80, 30, 3)),
  'beteende.påfågel': all(bg(), field(94), at(66, 102, 1.6, peacock(false))),
  'beteende.visa-upp-sig': all(bg(), field(96), at(46, 104, 1.1, peacock(true)), burst(46, 50, 50, 56, 9, Math.PI * 1.1, Math.PI * 1.9), atf(102, 104, 1, peahen())),
  'beteende.tjäder': all(bg(DAWN), field(96, '#9fb070'), pine(12, 98, 1.2), pine(108, 98, 1.1), at(62, 102, 1.6, tjader())),
  'beteende.spelplats': all(bg(DAWN), rect(4, 72, 112, 40, BOG, 0, null), pine(10, 74, 0.8), pine(22, 72, 0.6), pine(110, 74, 0.8), dashLoop(60, 92, 50, 16),
    at(30, 92, 0.7, orre({ display: true })), atf(56, 90, 0.7, orre({ display: true })), at(78, 102, 0.7, orre({ display: true })), atf(98, 94, 0.7, orre({ display: true })), at(44, 106, 0.6, orre({ display: true }))),
  'beteende.orre': all(bg(), field(94), at(60, 100, 2, orre())),
  'beteende.parningslek': all(bg(DAWN), rect(4, 80, 112, 32, BOG, 0, null), at(36, 100, 1.4, orre({ display: true })), atf(86, 100, 1.4, orre({ display: true })),
    rings2(56, 62), rings2(66, 62, -1), at(62, 40, 1, peahenGrouse())),
  'beteende.rival': all(bg(), field(96), pine(60, 98, 0.9), at(30, 104, 0.6, redDeer()), atf(92, 104, 0.6, redDeer()), ring(92, 66, 22), boltS(60, 50)),
  'beteende.bröla': all(bg(), field(96), pine(12, 98, 1), pine(106, 98, 0.8), rot(46, 104, -20, 0.62, redDeer()), arcs(80, 40, 1.2, 1)),
  'beteende.monogam': all(bg(WATER), rect(4, 4, 112, 40, SKY, 0, null), at(30, 84, 1.1, swan({ knob: true })), atf(90, 84, 1.1, swan({ knob: true })), dashLoop(60, 70, 50, 24),
    greyPanel(76, 6, 38, 28, at(84, 26, 0.3, swan({ col: GREY, bill: GREY2 })), at(96, 22, 0.25, swan({ col: GREY, bill: GREY2 })), at(104, 30, 0.25, swan({ col: GREY, bill: GREY2 })), at(92, 32, 0.25, swan({ col: GREY, bill: GREY2 })))),

  // 2765 Sociala flockar
  'beteende.flock': all(bg('#dbe8f2'), snowField(80), at(20, 92, 0.42, wolf()), at(44, 98, 0.42, wolf()), at(66, 92, 0.42, wolf()), at(88, 100, 0.42, wolf()), at(100, 88, 0.42, wolf())),
  'beteende.flockdjur': all(bg(), field(84), at(70, 96, 1, sheep()), at(92, 92, 1, sheep()), at(84, 104, 1, sheep()), at(104, 104, 1, sheep()), at(22, 100, 1, sheep()), arrow(36, 90, 58, 90), dashLoop(88, 94, 26, 16)),
  'beteende.ensamlevande': all(bg(), field(90), pine(14, 92, 1.1), pine(30, 92, 0.8), at(64, 102, 0.95, lynx()), ring(62, 82, 30),
    greyPanel(80, 6, 34, 26, at(88, 28, 0.2, wolf({ grey: true })), at(98, 26, 0.2, wolf({ grey: true })), at(108, 28, 0.2, wolf({ grey: true })))),
  'beteende.hjord': all(bg(), mountains(66), field(66, '#b8c98a'), at(22, 84, 0.3, reindeer()), at(46, 80, 0.3, reindeer()), at(72, 86, 0.3, reindeer()), at(96, 82, 0.3, reindeer()),
    at(34, 104, 0.3, reindeer()), at(60, 106, 0.3, reindeer()), at(86, 104, 0.3, reindeer())),
  'beteende.rangordning.2': all(bg(), steps(18, 104), at(30, 74, 0.34, wolf()), at(56, 84, 0.3, wolf()), at(82, 94, 0.26, wolf()), num2(31, 100, '1'), num2(57, 100, '2'), num2(83, 102, '3')),
  'beteende.ledare.3': all(bg('#dbe8f2'), snowField(86), at(96, 96, 0.4, reindeer()), at(70, 98, 0.36, reindeer()), at(46, 100, 0.36, reindeer()), at(22, 102, 0.36, reindeer()), ring(100, 76, 18), arrow(110, 104, 116, 104)),
  'beteende.dominant': all(bg(), field(96), at(40, 104, 0.9, wolfTall()), at(84, 106, 0.55, wolfLow()), ring(46, 72, 28),
    greyPanel(76, 6, 38, 28, at(88, 28, 0.28, wolf({ grey: true })), at(104, 28, 0.28, wolf({ grey: true })))),
  'beteende.flockjakt': all(bg('#dbe8f2'), snowField(88), at(52, 98, 0.55, moose()), at(14, 104, 0.32, wolf()), atf(108, 104, 0.32, wolf()), at(30, 82, 0.28, wolf()), atf(100, 80, 0.28, wolf()),
    arrow(26, 92, 36, 92), arrow(98, 92, 88, 92), arrow(40, 76, 46, 80), arrow(90, 74, 82, 78)),
  'beteende.hålla-vakt': all(bg(), field(84), at(56, 100, 1.3, goose(true, true)), at(22, 104, 0.9, goose()), at(86, 98, 0.9, goose()), at(96, 110, 0.9, goose()), line('M84 48 l7 -3 M85 54 l8 0', C.ink, 1.4)),

  // 2766 Migration och vandring
  'beteende.migration.2': all(mapEA2(), line('M60 24 C80 40 82 70 66 96', HL, 2.6), arrow(68, 92, 64, 100), line('M52 96 C36 76 38 44 52 26', C.navy, 2.6), arrow(50, 30, 54, 22),
    at(84, 56, 0.9, flySide({ body: '#a9b1b9', wing: '#a9b1b9', head: BLACK })), at(28, 64, 0.5, fishSide(SALMON)), at(96, 24, 0.18, reindeer())),
  'beteende.migrera': all(bg(), mountains(80), field(80, '#b8c98a'), at(30, 104, 0.3, reindeer()), at(52, 100, 0.3, reindeer()), at(74, 96, 0.3, reindeer()), at(96, 92, 0.3, reindeer()), arrow(20, 108, 108, 84)),
  'beteende.lekvandring': all(bg(), path('M4 40 L60 40 L60 112 L4 112 Z', WATER, null), path('M60 40 L60 112 L116 112 L116 84 L76 84 C70 84 64 70 60 40 Z', '#5c9fd0', null),
    line('M62 50 l2 30 M66 60 l2 20', C.white, 1.4), rect(4, 34, 56, 8, ROCK, 0, C.ink, 1), fishAt(64, 30, 0.9, SALMON, true), rot(96, 96, -10, 0.8, fishSide(SALMON)),
    egg2(20, 54), egg2(26, 56), egg2(32, 54), egg2(24, 58), arrow(108, 74, 70, 40), ring(26, 56, 10)),
  'beteende.återvända': all(bg(), field(92), barn(30, 92, 1.4), dashPath('M44 52 C60 20 100 16 108 40 C114 60 90 70 70 64'), arrow(74, 66, 56, 62), at(96, 26, 1, flySide({ body: '#2a3560', wing: '#2a3560', fork: true, streamers: true, throat: '#c0462e', belly: WHITE })), ring(30, 74, 22)),
  'beteende.vandringshinder': all(bg(), water(52), dam(70, 30), rot(54, 80, -30, 0.9, fishSide(SALMON)), arrow(28, 92, 50, 88, C.grey, 2.4), cross(70, 22, 7)),
  'beteende.instinkt': all(bg(), rect(4, 4, 112, 40, WATER, 0, null), line('M4 44 C30 40 60 48 116 42', C.white, 1.6), rect(4, 46, 112, 66, SAND2, 0, null), ellipse(60, 100, 20, 7, '#c9a868', C.ink, 1),
    hatchling(50, 92, -10), hatchling(62, 84, 0), hatchling(74, 90, 10), hatchling(40, 74, -12), hatchling(80, 66, 8), hatchling(58, 60, 0),
    arrow(30, 70, 30, 48), arrow(90, 70, 90, 48)),

  // 2767 Kommunikation mellan djur
  'beteende.kommunicera': all(bg(), field(96), at(24, 104, 0.55, wolf()), atf(96, 104, 0.55, wolf()), arcs(50, 70, 0.8, 1), arcs(70, 70, 0.8, -1), scent(46, 92, 2, 1), scent(74, 96, 2, -1), arrow(46, 54, 72, 54), arrow(74, 46, 48, 46)),
  'beteende.signalera': all(bg(), field(92), pine(108, 94, 1), at(68, 104, 1.05, roeDeerBack()), ring(90, 66, 9), burst(90, 66, 12, 18, 7, -Math.PI * 0.4, Math.PI * 0.4), at(20, 100, 0.4, roeDeer({ antlers: false }))),
  'beteende.yla': all(bg(NIGHT), snowField(96), moon(92, 22, 9), starDot(20, 18), starDot(40, 30), starDot(64, 14), at(46, 104, 1, wolfHowl()), arcs(74, 36, 1.1, 1, C.white)),
  'beteende.morra': all(bg(), at(54, 64, 1.2, canineHead({ col: '#c49a5c', growl: true })), growl(98, 72, 1)),
  'beteende.visa-tänderna': all(bg(), at(50, 64, 1.25, canineHead({ bared: true })), oval(90, 72, 18, 10)),
  'beteende.resa-ragg': all(bg(), field(96), at(58, 104, 1.5, dog({ ragg: true, tail: 'up' })), oval(50, 52, 26, 8)),
  'beteende.vifta-på-svansen': all(bg(), field(96), at(56, 104, 1.4, dog({ tail: 'wag' })), oval(20, 44, 14, 16), atf(104, 104, 1, kid2())),
  'beteende.underkastelse': all(bg(), field(96), at(30, 104, 0.85, wolf()), atf(88, 104, 0.6, wolfLow()), ring(86, 92, 18)),
  'beteende.spinna.2': all(bg('#efe6d6'), rect(4, 84, 112, 28, '#b98a58', 0, null), sofaLap(), at(62, 72, 1.1, catCurled()), line('M82 56 q3 -3 6 0 q3 3 6 0 M84 48 q3 -3 6 0 q3 3 6 0', C.navy, 1.3)),
  'beteende.ultraljud.2': all(bg(NIGHT), at(40, 36, 1.4, bat()), arcs(64, 38, 1.3, 1, C.white), kidEar(96, 108), cross(98, 54, 5)),
};
