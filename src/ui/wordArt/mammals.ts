/**
 * Natur & geografi → Djurvärlden → Däggdjur, 2701–2707 (0.44): common Swedish mammals, predators and prey,
 * deer and other hoofed animals, rodents and small mammals, marine mammals, reproduction and adaptations.
 * Every animal is drawn side-on facing right with one unified dark outline (outline pass + fill pass), in
 * natural colours, with the features that tell close species apart made explicit: the moose's hump, bell and
 * shovel antlers, the roe deer's small spikes and white rump, the red deer's many-pointed crown, the fallow
 * deer's spots and flat antlers, the reindeer's pale neck and curved antlers; the mouse's big ears and long
 * tail, the vole's blunt face and short tail, the shrew's long pointed snout; the seal's round body and
 * flippers, the whale's blowhole spout, the porpoise's blunt head and the dolphin's beak. An orange highlight
 * (ring, outline or arrow) marks the part a word names. Concepts are small scenes with a grey reference panel
 * that lacks the property. Predators and prey are shown with restraint: no blood, no wounds. Digits only; no
 * words, no letters, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#d4e8f5';
const NIGHT = '#2f3b5c';
const GRASS = '#a6cf72';
const GRASS2 = '#7fb356';
const FOREST = '#3f8a4f';
const SNOW = '#f5f8fb';
const ICE = '#dceef8';
const SEA = '#5d9fd0';
const SEA2 = '#3f7fb4';
const ROCK = '#9a9590';
const SOIL = '#8a6a4a';
const GREY = '#b9bec4';
const GREY2 = '#9ea4ab';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atf = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Silhouette machinery ─────────────────────────────────────────────
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

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const snowField = (y = 96) => path(`M4 ${y} C40 ${y - 4} 80 ${y - 4} 116 ${y} L116 112 L4 112 Z`, SNOW, C.ink, 1);
const sea = (y = 60, col: string = SEA) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.white, 1.2));
const pine = (x: number, y: number, s = 1, col: string = FOREST) => at(x, y, s, rect(-1.5, -5, 3, 5, C.brown, 0, C.ink, 0.8), path('M0 -30 L9 -5 L-9 -5 Z', col, C.ink, 1.1), path('M0 -30 L6 -14 L-6 -14 Z', col, null));
const birch = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -26, 4, 26, C.white, 1, C.ink, 1), line('M-2 -20 l2 0 M0 -12 l2 0 M-2 -6 l2 0', C.ink, 1), circle(0, -32, 9, GRASS2, C.ink, 1.1), circle(-6, -27, 5, GRASS2, null), circle(6, -28, 5, GRASS2, null));
const grassTufts = (y: number, xs: number[], col: string = GRASS2) => line(xs.map((x) => `M${x} ${y} l-2 -5 M${x + 2} ${y} l0 -6 M${x + 4} ${y} l2 -5`).join(' '), col, 1.3);
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.75} ${r} 0 1 1 ${x} ${y - r} Z`, '#f6e7a8', C.ink, 1);
const starDot = (x: number, y: number) => circle(x, y, 0.9, '#fff6c8', null);
const rockShape = (x: number, y: number, w: number, h: number, col: string = ROCK) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h * 0.8} ${x - w / 4} ${y - h} ${x} ${y - h} C${x + w / 3} ${y - h} ${x + w / 2} ${y - h * 0.6} ${x + w / 2} ${y} Z`, col, C.ink, 1.2);
const panel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, C.white, 3, C.ink, 1.2), k.join(''));
const greyPanel = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, '#eceef0', 3, GREY2, 1.2), k.join(''));
const cross = (x: number, y: number, r = 6) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, C.red, 2.6);
const check = (x: number, y: number, s = 1) => at(x, y, s, line('M-5 0 L-1 4 L6 -5', C.green, 3));
const thermo = (x: number, y: number, level: number, col: string) => all(rect(x - 3, y - 26, 6, 26, C.white, 3, C.ink, 1.1), rect(x - 1.4, y - 2 - level, 2.8, level + 2, col, 1, null), circle(x, y + 2, 4.4, col, C.ink, 1.1));
const zzz = (x: number, y: number, col: string = C.navy) => all(num(x, y, 'z', 7, col), num(x + 6, y - 6, 'z', 9, col), num(x + 13, y - 13, 'z', 11, col));
const pawPrint = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, ellipse(0, 2, 3.4, 2.8, col, null), circle(-3.4, -2.4, 1.3, col, null), circle(-1.2, -4, 1.3, col, null), circle(1.2, -4, 1.3, col, null), circle(3.4, -2.4, 1.3, col, null));
const hoofPrint = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, path('M-0.6 -5 C-4 -4 -4 3 -1 4 Z M0.6 -5 C4 -4 4 3 1 4 Z', col, null));
const heartS = (x: number, y: number, s = 1, fill: string = C.red) => at(x, y, s, path('M0 6 C-9 0 -8 -7 -3 -7 C-1 -7 0 -6 0 -4 C0 -6 1 -7 3 -7 C8 -7 9 0 0 6 Z', fill, C.ink, 1.1));
const leafIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 4 C-6 -4 0 -8 7 -7 C8 0 4 6 -4 6 Z', GRASS2, C.ink, 1), line('M-5 5 L4 -3', C.ink, 0.8));
const meatIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 C-7 -6 0 -8 5 -5 C9 -2 8 5 2 6 C-3 7 -7 4 -7 0 Z', '#d8735c', C.ink, 1), ellipse(-1, -1, 3, 2, '#f3c9b8', null), line('M5 4 L10 9', '#f2ead8', 2.4), circle(10.5, 9.5, 1.6, '#f2ead8', C.ink, 0.6));
const berryIcon = (x: number, y: number, s = 1) => at(x, y, s, circle(-3, 1, 3, '#4f5fb3', C.ink, 0.8), circle(3, 1, 3, '#4f5fb3', C.ink, 0.8), circle(0, -4, 3, '#4f5fb3', C.ink, 0.8), line('M0 -7 l2 -3', C.green, 1));
const fishIcon = (x: number, y: number, s = 1, col = '#9fb3c4') => at(x, y, s, path('M-8 0 C-4 -5 4 -5 7 0 C4 5 -4 5 -8 0 Z M7 0 L11 -4 L11 4 Z', col, C.ink, 1), circle(-4, -1, 0.8, C.ink, null));
const bugIcon = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 4, 3, '#4a4a3a', C.ink, 0.8), circle(4, -1, 1.8, '#4a4a3a', null), line('M-2 2 l-2 3 M0 2 l0 3 M2 2 l2 3', C.ink, 0.8));
const worm = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 0 C-4 -3 -2 3 0 0 C2 -3 4 3 6 0', '#d98a8a', 2.4));
const nut = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 1, 3.4, 4, '#b07a45', C.ink, 0.9), path('M-3.6 -1 C-3 -5 3 -5 3.6 -1 Z', '#8a5a30', C.ink, 0.8));
const cone = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 3.2, 6, '#9a6a3c', C.ink, 0.9), line('M-3 -2 L3 -2 M-3 2 L3 2 M0 -6 L0 6', '#6f4a2a', 0.7));
const person = (x: number, y: number, s = 1, col: string = C.orange, grey = false) => at(x, y, s,
  rect(-3.5, -12, 3, 12, grey ? GREY2 : C.denim, 1, grey ? GREY2 : C.ink, 0.9), rect(0.5, -12, 3, 12, grey ? GREY2 : C.denim, 1, grey ? GREY2 : C.ink, 0.9),
  path('M-5 -12 L-5 -24 C-5 -27 5 -27 5 -24 L5 -12 Z', grey ? GREY : col, grey ? GREY2 : C.ink, 1), circle(0, -30, 4.4, grey ? GREY : C.skin, grey ? GREY2 : C.ink, 1),
  path('M-4.4 -31 C-4.4 -36 4.4 -36 4.4 -31 C2 -33 -2 -33 -4.4 -31 Z', grey ? GREY2 : C.hair, null));

// ── Animals (facing right, feet on y = 0) ────────────────────────────
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
/** Fallow deer: tan with white spots, palmate antlers, black-and-white rump. */
const fallowDeer = (o: AO = {}) => {
  const c = gc(o, '#c08a52'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-17, -30, 4.4, 0, 2.8, 1), far], [LEG(13, -30, 4.4, 0, 2.8, 2), far]]),
    sil([
      ['M-25 -34 C-27 -45 -14 -47 -1 -46 C9 -46 15 -49 19 -51 L24 -42 C22 -34 16 -30 8 -29 L-18 -29 C-22 -29 -25 -31 -25 -34 Z', c],
      [LEG(-21, -32, 5, 0, 3, -1), c], [LEG(8, -32, 5, 0, 3, 0), c],
      ['M15 -49 L22 -63 C24 -67 30 -67 32 -63 L39 -57 C40 -54 38 -52 35 -53 L29 -55 L26 -45 Z', c],
      ['M23 -63 C19 -69 21 -72 25 -68 Z', c],
      ['M-26 -40 C-31 -38 -31 -32 -27 -31 Z', C.ink],
    ]),
    o.grey ? '' : all(...[[-16, -40], [-9, -42], [-2, -42], [5, -41], [-13, -35], [-5, -36], [2, -36], [9, -37], [-19, -36]].map(([x, y]) => circle(x!, y!, 1.3, '#f6efe0', null))),
    path('M-25 -40 C-28 -36 -27 -32 -24 -31 L-22 -38 Z', C.white, null), eye(28, -61, 1.2), circle(39, -56, 1.2, C.ink, null),
    o.antlers === false ? '' : all(sil([['M28 -65 C26 -70 22 -74 14 -78 C12 -82 16 -84 18 -80 L19 -86 L22 -81 L24 -88 L26 -82 L29 -86 C31 -80 31 -72 30 -65 Z', gd(o, '#d9c9a4')]], 1.4), sil([['M27 -65 C26 -70 26 -74 30 -78 L31 -84 L33 -79 L36 -84 L37 -78 C36 -72 32 -68 29 -65 Z', gd(o, '#e6d8b8')]], 1.4)),
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
/** Wolverine: dark brown, low and heavy, pale side stripe, bushy tail, short legs. */
const wolverine = (o: AO = {}) => {
  const c = gc(o, '#4a3628'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-14, -12, 5, 0, 5, 1), far], [LEG(12, -12, 5, 0, 5, 2), far]]),
    sil([
      ['M-24 -20 C-34 -18 -34 -10 -28 -8 C-24 -10 -22 -14 -21 -18 Z', c],
      ['M-24 -16 C-26 -28 -12 -32 0 -30 C10 -30 16 -28 20 -26 L24 -18 C22 -12 16 -10 8 -10 L-16 -10 C-21 -10 -24 -12 -24 -16 Z', c],
      [LEG(-18, -14, 6, 0, 6, -1), c], [LEG(8, -14, 6, 0, 6, 0), c],
      ['M16 -26 C18 -32 28 -32 32 -26 L36 -20 C36 -17 33 -16 30 -17 L22 -18 Z', c],
      ['M20 -30 C20 -34 24 -34 24 -31 Z', c],
    ]),
    path('M-22 -22 C-12 -26 4 -26 16 -22', 'none', gd(o, '#d9a96a'), 3), eye(28, -26, 1.1), circle(35.6, -19.6, 1.1, C.ink, null),
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
/** Badger: grey, low wedge body, short legs, black-and-white striped head. */
const badger = (o: AO = {}) => {
  const c = gc(o, '#9a9792'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-14, -8, 5, 0, 5, 1), far], [LEG(12, -8, 5, 0, 5, 2), far]]),
    sil([
      ['M-26 -14 C-28 -18 -30 -14 -28 -11 Z', c],
      ['M-26 -12 C-28 -24 -12 -28 0 -26 C10 -26 16 -22 20 -20 L22 -12 C20 -8 14 -6 8 -6 L-18 -6 C-23 -6 -26 -8 -26 -12 Z', c],
      [LEG(-18, -9, 6, 0, 6, -1), gd(o, '#3a3a40')], [LEG(8, -9, 6, 0, 6, 0), gd(o, '#3a3a40')],
      ['M16 -22 C20 -26 28 -24 34 -18 L38 -14 C38 -12 36 -11 34 -12 L22 -12 Z', gd(o, C.white)],
    ]),
    path('M18 -23 C22 -24 28 -22 34 -16 L30 -15 C26 -19 22 -21 18 -21 Z', gd(o, '#2e2e36'), null),
    path('M18 -17 C22 -16 28 -15 34 -13 L33 -12 C28 -13 22 -13 18 -14 Z', gd(o, '#2e2e36'), null),
    circle(23, -22, 2.2, gd(o, '#f5f5f0'), C.ink, 0.8), circle(37.4, -13.2, 1.1, C.ink, null), circle(26, -18, 0.9, C.white, null),
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
/** Musk ox: shaggy dark coat to the ground, horns curling down from a boss, pale saddle and socks. */
const muskOx = (o: AO = {}) => {
  const c = gc(o, '#3e3026'), far = shade(c, 0.85);
  return all(
    sil([[LEG(-16, -14, 6, 0, 5.4, 0), far], [LEG(14, -14, 6, 0, 5.4, 0), far]]),
    sil([
      ['M-30 -24 C-34 -40 -18 -46 0 -46 C12 -46 20 -44 26 -38 L30 -24 L28 -10 L22 -6 L16 -10 L10 -6 L4 -10 L-2 -6 L-8 -10 L-14 -6 L-20 -10 L-26 -6 L-30 -12 Z', c],
      [LEG(-22, -12, 6, 0, 5.4, 0), c], [LEG(10, -12, 6, 0, 5.4, 0), c],
      ['M22 -38 C28 -42 36 -38 38 -30 L40 -20 C40 -16 36 -15 33 -17 L26 -20 Z', c],
    ]),
    path('M-8 -46 C-2 -50 8 -50 14 -46 C8 -44 -2 -44 -8 -46 Z', gd(o, '#b9a58a'), null),
    rect(-25.4, -4, 6.8, 4, gd(o, '#e6dccb'), 1.4, null), rect(6.6, -4, 6.8, 4, gd(o, '#e6dccb'), 1.4, null),
    sil([['M24 -40 C30 -44 36 -42 34 -36 C33 -30 28 -28 28 -24 C26 -26 26 -32 30 -36 C28 -38 26 -38 24 -40 Z', gd(o, '#d9ccb4')]], 1.4),
    eye(33, -31, 1.1),
  );
};
/** Domestic bull: big black-brown, short horns, heavy neck. */
const bull = (o: AO = {}) => {
  const c = gc(o, '#3b2a22'), far = shade(c, 0.8);
  return all(
    sil([[LEG(-18, -22, 6, 0, 5, 1), far], [LEG(16, -22, 6, 0, 5, 2), far]]),
    sil([
      ['M-36 -36 C-40 -32 -40 -24 -38 -20 L-35 -30 Z', c],
      ['M-34 -30 C-36 -44 -20 -46 0 -46 C14 -46 22 -48 28 -44 L30 -30 C28 -24 20 -22 10 -22 L-26 -22 C-31 -22 -34 -25 -34 -30 Z', c],
      [LEG(-24, -26, 7, 0, 6, 0), c], [LEG(10, -26, 7, 0, 6, 0), c],
      ['M22 -44 C28 -48 38 -46 40 -40 L42 -28 C42 -24 36 -23 32 -25 L26 -30 Z', c],
    ]),
    rect(36, -30, 7, 6, gd(o, '#c98a8a'), 2.4, C.ink, 0.8), eye(33, -38, 1.2),
    line('M30 -46 C32 -52 36 -54 40 -52 M34 -45 C38 -48 42 -48 44 -46', gd(o, '#efe6d0'), 2.4),
    path('M-4 -22 C-2 -18 2 -18 4 -22', gd(o, '#c98a8a'), C.ink, 0.8),
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
/** Rabbit: rounder and smaller than a hare, shorter ears, white tail. */
const rabbit = (o: AO & { col2?: string } = {}) => {
  const c = gc(o, '#8f8076');
  return all(
    sil([
      ['M-14 0 C-22 -2 -22 -16 -12 -20 C-4 -24 6 -22 8 -14 C10 -8 8 -2 2 0 Z', c],
      ['M4 -14 C4 -22 14 -24 18 -20 C22 -16 20 -10 14 -10 C8 -9 4 -10 4 -14 Z', c],
      ['M9 -21 C7 -28 9 -32 12 -31 C14 -29 13 -25 12 -21 Z', c], ['M12 -21 C14 -28 17 -30 18 -28 C18 -25 16 -22 14 -20 Z', c],
      [LEG(4, -6, 3, 0, 2.8, 1), c],
      [E(-20, -10, 3.4, 3.4), C.white],
    ]),
    eye(13, -17, 1.1), circle(19.4, -14, 0.8, C.pink, null),
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
/** Beaver: brown, round back, flat dark scaly tail, orange teeth. */
const beaver = (o: AO = {}) => {
  const c = gc(o, '#7a5232'), tail = gd(o, '#3d3530');
  return all(
    sil([
      ['M-20 -4 C-30 -2 -42 -2 -44 -6 C-42 -10 -30 -10 -20 -10 Z', tail],
      ['M-22 -6 C-26 -20 -10 -26 2 -24 C12 -22 16 -16 16 -10 C16 -4 10 0 2 0 L-16 0 C-20 0 -22 -2 -22 -6 Z', c],
      ['M10 -18 C14 -24 22 -22 26 -16 C28 -12 26 -9 22 -9 L12 -10 Z', c],
      ['M14 -20 C14 -23 17 -23 17 -20 Z', c],
      [LEG(6, -6, 4, 0, 4.4, 1), c],
    ]),
    line('M-40 -6 L-24 -6 M-36 -9 L-36 -3 M-31 -9 L-31 -3 M-26 -9 L-26 -3', shade(tail, 1.4), 0.8),
    rect(22, -9.6, 2.6, 3, gd(o, '#e08a2c'), 0.6, C.ink, 0.6), eye(19, -17, 1.1), circle(26.4, -14.4, 1, C.ink, null),
  );
};
/** Otter: long slender brown body, pale throat, thick tapering tail. */
const otter = (o: AO = {}) => {
  const c = gc(o, '#6b4a30');
  return all(
    sil([
      ['M-24 -8 C-34 -6 -44 -2 -48 0 C-44 -6 -34 -12 -24 -14 Z', c],
      ['M-26 -10 C-28 -18 -14 -20 0 -18 C10 -18 18 -20 22 -20 L26 -14 C24 -8 16 -6 8 -6 L-18 -6 C-23 -6 -26 -7 -26 -10 Z', c],
      [LEG(-18, -8, 4, 0, 4.6, -1), c], [LEG(10, -8, 4, 0, 4.6, 1), c],
      ['M18 -20 C22 -26 32 -26 36 -20 C38 -16 35 -14 30 -14 L22 -14 Z', c],
      [E(24, -24, 1.8, 1.8), c],
    ]),
    path('M22 -15 C26 -13 30 -13 34 -15 C30 -10 24 -10 20 -12 Z', gd(o, '#e2cfb0'), null), eye(30, -21, 1.1), circle(37, -18, 1, C.ink, null),
    line('M34 -16 l5 -1 M34 -15 l5 1', C.ink, 0.5),
  );
};
/** Pine marten: slender brown, bushy tail, creamy-yellow throat patch, rounded ears. */
const marten = (o: AO = {}) => {
  const c = gc(o, '#5e3d24');
  return all(
    sil([
      ['M-22 -12 C-32 -10 -40 -4 -42 0 C-36 -2 -28 -6 -20 -8 Z', c],
      ['M-24 -10 C-26 -18 -12 -20 0 -19 C8 -19 14 -20 18 -22 L22 -15 C20 -9 14 -7 6 -7 L-16 -7 C-21 -7 -24 -8 -24 -10 Z', c],
      [LEG(-17, -9, 3.6, 0, 3.6, -1), c], [LEG(9, -9, 3.6, 0, 3.6, 1), c],
      ['M15 -21 C18 -28 28 -28 32 -22 L36 -18 C36 -16 34 -15 31 -16 L22 -15 Z', c],
      [E(19, -27, 2.4, 2.4), c],
    ]),
    path('M16 -18 C20 -14 26 -14 30 -16 C28 -10 20 -8 14 -12 Z', gd(o, '#f0c75a'), null), eye(26, -23, 1.1), circle(35.6, -18.4, 1, C.ink, null),
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
/** Rat: bigger, grey-brown, pointed snout, small ears, long bare pink tail. */
const rat = (o: AO = {}) => {
  const c = gc(o, '#7c7066');
  return all(
    line('M-18 -4 C-30 -2 -36 -8 -46 -4', gd(o, '#d9a5a0'), 2.2),
    sil([
      ['M-20 -2 C-22 -16 -6 -20 4 -16 C12 -14 14 -8 12 -2 L-18 0 Z', c],
      ['M8 -14 C14 -18 22 -12 28 -6 C28 -4 26 -3 24 -3 L10 -3 Z', c],
      [E(11, -16, 3, 3), c],
      [LEG(2, -4, 3, 0, 3, 1), c],
    ]),
    circle(11, -16, 1.6, gd(o, '#e7b8b0'), null), eye(17, -11, 1.1), circle(28, -5.6, 1, C.pink, null), line('M24 -6 l6 -2 M24 -5 l6 1', C.ink, 0.4),
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
/** Shrew: tiny, dark, very long pointed snout, tiny eyes. */
const shrew = (o: AO = {}) => {
  const c = gc(o, '#5a4a40');
  return all(
    line('M-12 -3 C-18 -2 -20 -5 -24 -4', gd(o, '#6e5e52'), 1.4),
    sil([
      ['M-13 -2 C-14 -11 -2 -12 4 -10 C8 -9 10 -7 10 -5 L-11 0 Z', c],
      ['M6 -9 C12 -9 18 -7 24 -5 C22 -3 16 -3 8 -4 Z', c],
    ]),
    circle(9, -7, 0.7, C.ink, null), circle(24, -5, 0.8, C.pink, null),
  );
};
/** Mountain lemming: plump, black head and back stripe, yellow-brown sides, tiny tail. */
const lemming = (o: AO = {}) => {
  const c = gc(o, '#d8a858');
  return all(
    sil([['M-15 -2 C-18 -12 -8 -18 2 -17 C10 -16 15 -11 15 -6 C15 -3 13 -1 10 0 L-12 0 C-14 0 -15 -1 -15 -2 Z', c], [LEG(-8, -3, 3, 0, 3, 0), c], [LEG(6, -3, 3, 0, 3, 1), c]]),
    path('M-13 -9 C-10 -15 0 -18 6 -16 C11 -14 14 -10 15 -6 C11 -7 7 -9 3 -10 C-3 -11 -8 -10 -13 -9 Z', gd(o, '#2e2a26'), null),
    path('M3 -16 C4 -19 7 -19 7 -16 Z', gd(o, '#2e2a26'), C.ink, 0.8), eye(10, -9, 1.1), circle(15, -4.4, 0.8, C.ink, null),
  );
};
/** Mole: black velvet, big pink spade hands, pink snout, no visible eyes. */
const mole = (o: AO = {}) => {
  const c = gc(o, '#33303a'), pink = gd(o, '#e7a9a0');
  return all(
    sil([
      ['M-18 -2 C-20 -14 -4 -16 6 -14 C14 -12 18 -8 18 -4 L-16 0 Z', c],
      ['M14 -9 C18 -9 22 -7 24 -6 C22 -4 18 -4 14 -5 Z', pink],
      ['M6 -6 C10 -8 14 -4 12 0 L4 0 C2 -2 2 -4 6 -6 Z', pink],
    ]),
    line('M5 0 l1 -2 M8 0 l0 -2 M11 0 l-1 -2', C.ink, 0.6), line('M-20 -4 L-24 -6', c, 1.4),
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
/** Guinea pig: round, no tail, patched coat. */
const guineaPig = (o: AO = {}) => {
  const c = gc(o, '#f3ede2');
  return all(
    sil([['M-16 -2 C-20 -16 -2 -20 8 -16 C16 -13 20 -8 18 -2 L-14 0 Z', c], [E(10, -16, 3, 2.6), c]]),
    o.grey ? '' : all(path('M-14 -6 C-16 -14 -6 -18 0 -16 C-2 -10 -6 -4 -12 -2 Z', '#d98a3c', null), path('M6 -16 C10 -16 14 -12 14 -8 C10 -10 8 -12 6 -16 Z', '#5a4030', null)),
    eye(12, -10, 1.1), circle(18.4, -5.4, 0.8, C.pink, null),
  );
};
/** Weasel (least weasel): tiny, very slender, brown back, white belly, short tail without a black tip. */
const weasel = (o: AO = {}) => {
  const c = gc(o, '#8a5a32');
  return all(
    sil([
      ['M-20 -8 C-24 -8 -26 -6 -27 -4 C-24 -4 -22 -5 -19 -5 Z', c],
      ['M-22 -6 C-22 -11 -12 -12 0 -12 C8 -12 12 -13 14 -14 L17 -9 C16 -6 12 -5 6 -5 L-18 -5 C-21 -5 -22 -5 -22 -6 Z', c],
      [LEG(-17, -6, 2.6, 0, 2.6, -1), c], [LEG(8, -6, 2.6, 0, 2.6, 1), c],
      ['M12 -13 C14 -18 22 -18 25 -14 L28 -11 C28 -10 26 -9 24 -10 L16 -9 Z', c],
      [E(15, -17, 1.6, 1.6), c],
    ], 1.8),
    path('M-14 -5.4 C-4 -6.4 6 -6.4 14 -8.4 C18 -9 22 -9.4 26 -10 C22 -8.4 18 -7.6 14 -7 C6 -5 -4 -5 -14 -5.4 Z', gd(o, C.white), null),
    eye(20, -14.6, 0.9), circle(27.6, -11, 0.8, C.ink, null),
  );
};
/** Stoat: white in winter (brown in summer) with an always-black tail tip. */
const stoat = (o: AO & { summer?: boolean } = {}) => {
  const c = o.summer ? gc(o, '#8a5a32') : gc(o, '#f5f6f2');
  return all(
    sil([
      ['M-22 -9 C-28 -9 -32 -7 -34 -5 C-30 -4 -26 -5 -21 -6 Z', c],
      ['M-24 -7 C-24 -13 -12 -14 0 -14 C9 -14 13 -15 15 -16 L19 -10 C18 -7 13 -6 6 -6 L-20 -6 C-23 -6 -24 -6 -24 -7 Z', c],
      [LEG(-18, -7, 3, 0, 3, -1), c], [LEG(9, -7, 3, 0, 3, 1), c],
      ['M13 -15 C15 -21 24 -21 27 -16 L31 -12 C31 -11 29 -10 27 -11 L17 -10 Z', c],
      [E(16, -20, 1.8, 1.8), c],
      ['M-30 -8.6 C-34 -8 -36 -6 -37 -4 C-34 -4 -32 -4.4 -30 -5.4 Z', gd(o, '#2a2a2e')],
    ], 1.8),
    eye(22, -16.4, 1), circle(31, -12.2, 0.9, C.ink, null),
  );
};
/** Arctic fox in winter: white, small round ears, short muzzle, bushy tail. */
const arcticFox = (o: AO & { summer?: boolean } = {}) => {
  const c = o.summer ? gc(o, '#7a6656') : gc(o, '#f5f6f8');
  return all(
    sil([
      ['M-20 -18 C-34 -20 -40 -8 -32 -4 C-26 -2 -22 -10 -18 -14 Z', c],
      ['M-22 -14 C-24 -26 -10 -28 0 -27 C8 -27 12 -28 16 -29 L21 -20 C19 -14 13 -11 6 -11 L-16 -11 C-20 -11 -22 -12 -22 -14 Z', c],
      [LEG(-16, -14, 4, 0, 3.6, -1), c], [LEG(8, -14, 4, 0, 3.6, 0), c],
      ['M13 -27 C15 -34 25 -35 28 -30 L33 -25 C33 -23 31 -22 29 -22 L22 -21 Z', c],
      [E(17, -32, 2.6, 3), c], [E(22, -33, 2.6, 3), c],
    ]),
    eye(25, -28, 1.1), circle(33, -24.6, 1.1, C.ink, null),
  );
};
/** Dog puppy: round head, floppy ear, short legs. */
const puppy = (o: AO = {}) => {
  const c = gc(o, '#d9a35c');
  return all(
    sil([
      ['M-14 -14 C-18 -18 -20 -14 -18 -12 Z', c],
      ['M-15 -10 C-16 -18 -6 -20 2 -18 C8 -17 10 -14 10 -10 C10 -6 6 -5 2 -5 L-12 -5 C-14 -5 -15 -7 -15 -10 Z', c],
      [LEG(-11, -7, 4, 0, 4, 0), c], [LEG(5, -7, 4, 0, 4, 0), c],
      [E(12, -20, 8, 7), c],
      ['M14 -18 C18 -18 22 -16 22 -13 C20 -11 16 -11 14 -13 Z', c],
    ]),
    path('M8 -26 C4 -26 2 -20 4 -15 C6 -16 8 -20 10 -24 Z', shade(c, 0.7), C.ink, 0.9), eye(14, -21, 1.2), circle(21.6, -14.6, 1.2, C.ink, null),
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
/** Domestic goat (for a kid's mother). */
const goat = (o: AO = {}) => {
  const c = gc(o, '#e9e4da'), far = shade(c, 0.85);
  return all(
    sil([[LEG(-14, -22, 4, 0, 3, 1), far], [LEG(12, -22, 4, 0, 3, 2), far]]),
    sil([
      ['M-22 -28 C-26 -30 -26 -34 -22 -34 Z', c],
      ['M-22 -26 C-24 -36 -10 -38 0 -37 C8 -37 12 -38 16 -40 L20 -32 C18 -26 12 -23 6 -23 L-16 -23 C-20 -23 -22 -24 -22 -26 Z', c],
      [LEG(-18, -24, 4.4, 0, 3.2, -1), c], [LEG(8, -24, 4.4, 0, 3.2, 0), c],
      ['M14 -38 C16 -46 24 -48 28 -44 L32 -36 C33 -34 31 -33 28 -34 L22 -34 Z', c],
      ['M27 -35 C28 -31 27 -28 25 -27 C24 -30 24 -32 25 -35 Z', c],
    ]),
    line('M20 -46 C18 -52 14 -54 10 -54', '#b9a88a', 2), eye(24, -42, 1.1),
  );
};
/** Domestic cow (for udder/teats, grazing, chewing cud). */
const cow = (o: AO = {}) => {
  const c = gc(o, '#f2efe8'), far = shade(c, 0.85);
  return all(
    sil([[LEG(-18, -22, 5.4, 0, 5, 1), far], [LEG(16, -22, 5.4, 0, 5, 2), far]]),
    sil([
      ['M-36 -34 C-40 -30 -40 -22 -38 -18 L-35 -28 Z', c],
      ['M-34 -28 C-36 -44 -20 -44 0 -44 C14 -44 22 -44 28 -42 L30 -28 C28 -22 20 -20 10 -20 L-26 -20 C-31 -20 -34 -23 -34 -28 Z', c],
      [LEG(-24, -24, 6, 0, 5.4, 0), c], [LEG(10, -24, 6, 0, 5.4, 0), c],
      ['M22 -42 C28 -46 36 -44 38 -38 L40 -28 C40 -24 34 -23 30 -25 L26 -30 Z', c],
    ]),
    o.grey ? '' : all(path('M-20 -44 C-18 -36 -8 -34 -4 -44 Z', '#3d3f4a', null), path('M-30 -30 C-24 -30 -22 -24 -26 -20 L-32 -22 Z', '#3d3f4a', null), path('M4 -40 C10 -40 14 -34 10 -28 C6 -30 2 -34 4 -40 Z', '#3d3f4a', null)),
    rect(34, -30, 7, 6, gd(o, '#f0b9b0'), 2.4, C.ink, 0.8), eye(32, -37, 1.2), line('M28 -44 L28 -48 M33 -44 L35 -48', C.ink, 1.4),
    path('M-12 -20 C-12 -14 -2 -14 -2 -20 Z', gd(o, '#f0b9b0'), C.ink, 0.9),
  );
};
/** Pig (domestic, pink): for snout and teats. */
const pig = (o: AO = {}) => {
  const c = gc(o, '#f1b9b0'), far = shade(c, 0.85);
  return all(
    sil([[LEG(-14, -10, 4.4, 0, 3.4, 1), far], [LEG(12, -10, 4.4, 0, 3.4, 2), far]]),
    sil([
      ['M-24 -22 C-26 -32 -10 -34 2 -34 C14 -34 22 -30 24 -22 C24 -14 18 -10 8 -10 L-16 -10 C-22 -10 -24 -14 -24 -22 Z', c],
      [LEG(-18, -12, 5, 0, 3.6, -1), c], [LEG(8, -12, 5, 0, 3.6, 0), c],
      ['M18 -28 C24 -30 30 -26 32 -20 L34 -20 L34 -14 L30 -14 C24 -12 20 -14 18 -18 Z', c],
      ['M20 -28 L24 -34 L26 -27 Z', c],
    ]),
    rect(33, -20.4, 3, 6.6, shade(c, 0.85), 1, C.ink, 0.8), eye(26, -23, 1.1), line('M-24 -22 C-28 -22 -30 -18 -27 -16', 'none', 1.2),
  );
};
/** Sheep. */
const sheep = (o: AO = {}) => {
  const c = gc(o, '#f3f0e8');
  return all(
    line('M-10 -10 L-10 0 M-4 -10 L-4 0 M6 -10 L6 0 M12 -10 L12 0', gd(o, C.ink), 2.4),
    sil([[`M-18 -14 C-22 -18 -18 -26 -12 -26 C-10 -30 -2 -30 0 -27 C4 -30 12 -28 12 -24 C18 -24 20 -16 16 -12 C14 -8 -14 -8 -18 -14 Z`, c]]),
    sil([['M12 -24 C14 -28 22 -28 24 -22 L24 -16 C22 -14 16 -14 14 -18 Z', gd(o, '#3d3f4a')]]), eye(19, -21, 0.9, ),
  );
};

// ── Marine mammals (in water: y = 0 is the body's lowest point) ──────
/** Seal: round grey spotted body, flippers, whiskers; lying. grey: long-nosed grey seal; harbour: dog-like round head; ringed: dark with pale rings. */
const seal = (o: AO & { kind?: 'grey' | 'harbour' | 'ringed' | 'plain'; pup?: boolean } = {}) => {
  const k = o.kind ?? 'plain';
  const c = o.pup ? '#f4f2ec' : gc(o, k === 'grey' ? '#7d828a' : k === 'ringed' ? '#5d5a58' : k === 'harbour' ? '#a9a59c' : '#8f948f');
  const head = k === 'grey'
    ? 'M18 -16 C22 -22 30 -22 36 -18 L44 -14 C46 -12 44 -9 40 -9 L26 -8 Z'
    : 'M18 -16 C20 -24 32 -24 36 -18 C38 -14 36 -10 32 -9 L24 -8 Z';
  const spots = o.grey || o.pup ? '' : k === 'ringed'
    ? all(...[[-18, -12], [-10, -14], [-2, -14], [6, -13], [-14, -7], [-6, -8], [2, -8], [10, -9]].map(([x, y]) => circle(x!, y!, 2, 'none', '#cfc8bc', 0.9)))
    : all(...[[-18, -12], [-10, -15], [-3, -12], [5, -15], [-14, -7], [0, -8], [10, -11], [-22, -6]].map(([x, y]) => ellipse(x!, y!, k === 'grey' ? 2.4 : 1.4, k === 'grey' ? 1.6 : 1, shade(c, 0.7), null)));
  return all(
    sil([
      ['M-36 -6 C-42 -10 -44 -4 -40 -2 C-44 0 -40 4 -36 1 Z', c],
      ['M-34 -4 C-36 -16 -14 -20 4 -19 C14 -19 20 -18 24 -16 L28 -8 C24 -2 14 0 0 0 L-28 0 C-32 0 -34 -2 -34 -4 Z', c],
      [head, c],
      ['M6 -4 C4 0 8 4 14 2 C12 0 10 -2 10 -4 Z', c],
    ]),
    spots,
    o.pup ? all(eye(28, -16, 1.6), circle(35, -13, 1, C.ink, null)) : all(eye(k === 'grey' ? 30 : 28, -16, 1.4), circle(k === 'grey' ? 44 : 36, k === 'grey' ? -12 : -13, 1, C.ink, null)),
    line(k === 'grey' ? 'M40 -11 l6 -1 M40 -10 l6 1' : 'M33 -11 l6 -1 M33 -10 l6 1', C.ink, 0.5),
  );
};
/** Walrus: huge brown-pink, long white tusks, bristly whisker pad. */
const walrus = (o: AO = {}) => {
  const c = gc(o, '#b88a70');
  return all(
    sil([
      ['M-38 -4 C-44 -8 -46 -2 -42 0 C-46 2 -42 6 -38 2 Z', c],
      ['M-36 -2 C-40 -22 -10 -30 8 -28 C18 -27 24 -24 26 -18 L28 -8 C24 -2 12 0 0 0 L-30 0 C-34 0 -36 -1 -36 -2 Z', c],
      ['M18 -26 C24 -30 34 -26 36 -18 C38 -12 34 -8 28 -8 L22 -10 Z', c],
      ['M6 -4 C4 0 8 4 14 2 C12 0 10 -2 10 -4 Z', c],
    ]),
    sil([['M28 -10 C28 -2 30 6 32 10 C33 6 32 -2 31 -10 Z M33 -10 C34 -2 36 6 38 9 C38 4 37 -3 36 -10 Z', gd(o, '#f5efe0')]], 1.2),
    ellipse(32, -12, 5, 3.4, shade(c, 0.9), C.ink, 0.8), line('M29 -12 l0 1 M31 -13 l0 1 M33 -13 l0 1 M35 -12 l0 1', C.ink, 0.5),
    eye(27, -20, 1.1), path('M-20 -18 C-14 -20 -8 -20 -2 -18', 'none', shade(c, 0.8), 1),
  );
};
/** Generic large whale (side, swimming): blue-grey, pale throat grooves, small dorsal fin. */
const whale = (o: AO & { col?: string } = {}) => {
  const c = gc(o, '#5e7590');
  return all(
    sil([
      ['M-50 -11 C-56 -16 -62 -18 -68 -18 C-64 -14 -58 -12 -52 -10 Z', shade(c, 0.8)], ['M-50 -10 C-56 -9 -62 -8 -68 -6 C-62 -12 -56 -12 -50 -12 Z', c],
      ['M-52 -10 C-40 -18 -10 -22 20 -20 C34 -19 42 -14 44 -8 C44 -2 36 2 20 2 C-10 2 -40 -2 -52 -10 Z', c],
      ['M-26 -18 L-22 -24 L-18 -19 Z', c],
      ['M8 -2 C6 4 10 8 16 8 C14 4 14 0 14 -2 Z', c],
    ]),
    path('M20 -6 C30 -6 38 -6 43 -8 C40 -2 32 0 20 0 C8 0 0 -2 -6 -4 C2 -4 10 -5 20 -6 Z', gd(o, '#c9d5df'), null),
    line('M0 -2 C10 -1 24 -1 34 -3 M4 0 C14 1 24 1 32 -1', shade(c, 0.85), 0.8),
    eye(28, -10, 1.2),
  );
};
/** Blow spout from a blowhole at (x, y). */
const spout = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-2 -6 -8 -10 -12 -14 C-8 -14 -4 -12 -1 -8 C-2 -14 -2 -20 0 -24 C2 -20 2 -14 1 -8 C4 -12 8 -14 12 -14 C8 -10 2 -6 0 0 Z', '#e9f4fb', C.ink, 0.9));
/** Harbour porpoise: small, dark grey, blunt rounded head without a beak, small triangular fin. */
const porpoise = (o: AO = {}) => {
  const c = gc(o, '#4f5660');
  return all(
    sil([
      ['M-26 -7 C-30 -10 -34 -11 -38 -11 C-35 -8 -31 -7 -27 -6 Z', shade(c, 0.8)], ['M-26 -6 C-30 -6 -34 -5 -38 -3 C-34 -8 -30 -8 -26 -8 Z', c],
      ['M-28 -6 C-20 -12 -4 -14 8 -13 C16 -12 22 -8 22 -4 C22 0 16 2 8 2 C-4 2 -20 0 -28 -6 Z', c],
      ['M-6 -12 L-2 -19 L4 -13 Z', c],
      ['M6 -2 C5 2 7 5 11 5 C10 2 10 0 10 -2 Z', c],
    ]),
    path('M6 -3 C12 -3 18 -3 21 -4 C19 0 14 1 8 1 C2 1 -4 0 -8 -2 Z', gd(o, '#d5d9dd'), null), eye(14, -7, 1),
  );
};
/** Dolphin: grey with a distinct beak and curved fin. */
const dolphin = (o: AO = {}) => {
  const c = gc(o, '#8796a6');
  return all(
    sil([
      ['M-30 -7 C-34 -10 -38 -11 -43 -11 C-40 -8 -35 -7 -31 -6 Z', shade(c, 0.8)], ['M-30 -6 C-34 -6 -38 -5 -43 -3 C-38 -8 -34 -8 -30 -8 Z', c],
      ['M-32 -6 C-22 -13 -4 -16 8 -15 C16 -14 20 -12 22 -9 L32 -7 C32 -5 28 -4 22 -4 C16 0 8 2 0 2 C-12 2 -24 0 -32 -6 Z', c],
      ['M-8 -14 C-6 -20 -2 -24 2 -24 C0 -20 0 -16 2 -14 Z', c],
      ['M4 -1 C2 4 5 7 10 7 C8 3 9 1 9 -1 Z', c],
    ]),
    path('M4 -4 C12 -4 18 -4 22 -5 L30 -6 C26 -4 22 -3 18 -2 C12 1 4 1 -4 -1 Z', gd(o, '#dfe5ea'), null), eye(16, -10, 1.1),
  );
};
/** Orca: black, white eye patch and belly, very tall dorsal fin. */
const orca = (o: AO = {}) => {
  const c = gc(o, '#24252b');
  return all(
    sil([
      ['M-36 -9 C-41 -12 -46 -13 -52 -13 C-48 -10 -42 -9 -37 -8 Z', shade(c, 1.6)], ['M-36 -8 C-41 -8 -46 -7 -52 -5 C-46 -10 -41 -10 -36 -10 Z', c],
      ['M-38 -8 C-26 -18 -4 -20 12 -19 C24 -18 30 -12 30 -6 C30 0 22 3 10 3 C-8 3 -26 0 -38 -8 Z', c],
      ['M-8 -18 C-8 -28 -6 -36 -2 -42 C0 -34 2 -26 4 -19 Z', c],
      ['M6 -1 C4 5 8 9 14 9 C12 5 12 1 12 -1 Z', c],
    ]),
    o.grey ? '' : all(ellipse(18, -12, 4, 1.8, C.white, null), path('M0 2 C10 2 22 1 28 -4 C24 -1 14 0 4 0 Z M-18 -2 C-14 -6 -10 -6 -6 -2 C-10 0 -14 0 -18 -2 Z', C.white, null), path('M-14 -15 C-8 -17 0 -17 4 -15 C0 -13 -8 -13 -14 -15 Z', '#c9ccd2', null)),
    circle(14, -11, 0.9, C.white, null),
  );
};

const snowDots = () => all(...[[20, 30], [36, 18], [70, 26], [92, 50], [14, 60], [50, 44]].map(([x, y]) => circle(x!, y!, 1.4, C.white, '#9fb8cc', 0.6)));
const leafPile = (x: number, y: number) => at(x, y, 1, path('M-6 0 C-6 -4 0 -7 6 -4 C5 0 0 2 -6 0 Z', '#c98a3c', C.ink, 0.8));
/** Cross-section of the body: meat inside, an orange-ringed fat layer, fur or skin outside. */
const section = (x: number, y: number, skin: string) => at(x, y, 1, ellipse(0, 0, 24, 16, '#f2d36b', C.ink, 1.2), ellipse(0, 0, 14, 8, '#c96a5a', C.ink, 1), ellipse(0, 0, 27, 19, 'none', skin, 3.4));

// ── Composite helpers ────────────────────────────────────────────────
const forest = () => all(bg(), field(92), pine(14, 96, 1.1), pine(28, 94, 0.8), pine(104, 96, 1.2), birch(92, 94, 0.8));
const meadow = () => all(bg(), field(90), grassTufts(104, [12, 40, 70, 100]));
const winter = () => all(bg('#dbe8f2'), snowField(90));

export const MAMMAL_MOTIFS: Record<string, Svg> = {
  // 2701 Vanliga svenska däggdjur
  'dagg.älg': all(forest(), at(52, 108, 1.02, moose())),
  'dagg.rådjur': all(meadow(), at(58, 106, 1.2, roeDeer())),
  'dagg.räv': all(meadow(), at(64, 104, 1.2, fox())),
  'dagg.ekorre': all(bg(), rect(70, 4, 14, 108, '#8a6040', 0, C.ink, 1.2), path('M20 66 L76 62 L76 70 L20 72 Z', '#8a6040', C.ink, 1.2), cone(30, 78, 1), at(48, 66, 1.35, squirrel())),
  'dagg.hare': all(meadow(), at(54, 104, 1.8, hare())),
  'dagg.igelkott': all(bg('#e2ecd6'), field(84, GRASS), ...[[16, 94], [28, 100], [92, 98], [104, 92]].map(([x, y]) => at(x!, y!, 1, path('M-5 0 C-5 -4 0 -6 5 -4 C4 0 0 2 -5 0 Z', '#c98a3c', C.ink, 0.8))), at(56, 102, 1.8, hedgehog())),
  'dagg.grävling': all(bg('#cfd9c4'), field(88, GRASS2), path('M4 88 C6 70 34 68 42 88 Z', SOIL, C.ink, 1.2), ellipse(22, 86, 8, 5, '#3a2a1e', null), atf(72, 104, 1.2, badger())),
  'dagg.björn': all(forest(), at(52, 106, 1.2, bear())),
  'dagg.bäver': all(bg(), rect(4, 80, 112, 32, SEA, 0, null), path('M64 80 C72 62 104 60 116 68 L116 84 L64 84 Z', '#8a6040', C.ink, 1.2), line('M68 76 L110 64 M74 82 L114 72', '#6a4a2a', 1.4), at(58, 88, 1.15, beaver())),
  'dagg.utter': all(bg(), rect(4, 86, 112, 26, SEA, 0, null), path('M30 86 C50 76 90 76 116 82 L116 86 Z', '#9aa36e', C.ink, 1), at(62, 82, 1.2, otter()), fishIcon(20, 100, 1)),
  'dagg.mård': all(bg(), rect(100, 4, 14, 108, '#7a5034', 0, C.ink, 1.2), path('M10 70 L104 64 L104 72 L10 76 Z', '#7a5034', C.ink, 1.2), at(60, 68, 1.25, marten())),
  'dagg.däggdjur': all(bg('#f2ede2'), panel(8, 8, 50, 50, at(32, 52, 0.55, bear())), panel(62, 8, 50, 50, at(86, 54, 0.8, hare())), panel(8, 62, 50, 46, at(34, 100, 0.55, cow())), panel(62, 62, 50, 46, at(86, 98, 0.5, seal()))),
  'dagg.art': all(bg('#f2ede2'), panel(6, 14, 108, 40, at(34, 48, 0.5, fox()), at(86, 48, 0.5, fox({ col: '#c96a32' }))), num(60, 40, '=', 16, C.green),
    greyPanel(6, 62, 108, 44, at(34, 98, 0.5, fox({ grey: true })), at(86, 100, 0.7, hare({ grey: true }))), num(60, 90, '≠', 16, C.red)),
  'dagg.vilt': all(forest(), at(30, 106, 0.6, moose()), at(66, 106, 0.7, roeDeer()), at(94, 108, 0.5, boar()), at(84, 92, 0.6, hare())),
  'dagg.viltolycka': all(bg('#f2c58a'), circle(98, 22, 8, '#f8e0a0', null), rect(4, 82, 112, 30, '#6f6a66', 0, null), line('M4 98 L116 98', C.white, 1.4, '6 5'),
    at(72, 98, 0.7, moose()), at(24, 92, 1, rect(-18, -16, 36, 12, C.red, 4, C.ink, 1.2), path('M-12 -16 L-6 -24 L8 -24 L14 -16 Z', '#bfe3f5', C.ink, 1.1), circle(-10, -4, 4, C.dark, C.ink, 1), circle(10, -4, 4, C.dark, C.ink, 1), circle(18, -11, 2, C.yellow, null)),
    path('M50 72 L54 66 L56 72 L62 70 L58 76 L62 80 L56 80 L52 86 L50 80 L44 80 L48 76 L44 70 Z', C.yellow, HL, 1.6),
    at(22, 36, 1, path('M0 -16 L14 8 L-14 8 Z', C.white, C.red, 3), at(-4, 6, 0.26, moose({ col: C.ink, antlers: false })))),
  'dagg.viltstängsel': all(bg(), field(76, GRASS), rect(4, 86, 112, 26, '#6f6a66', 0, null), line('M4 99 L116 99', C.white, 1.4, '6 5'),
    pine(14, 74, 0.9), pine(104, 74, 1), at(58, 78, 0.62, moose()),
    rect(4, 52, 112, 30, 'none', 0, null), line(range(15).map((i) => `M${6 + i * 8} 52 L${6 + i * 8} 84`).join(' ') + ' M4 56 L116 56 M4 64 L116 64 M4 72 L116 72 M4 80 L116 80', '#7d8794', 0.8),
    line('M6 50 L6 86 M46 50 L46 86 M86 50 L86 86 M114 50 L114 86', '#5c6570', 2.4), oval(60, 68, 56, 20)),
  // 2702 Rovdjur och bytesdjur
  'dagg.rovdjur': all(forest(), at(38, 104, 1.1, lynx()), at(90, 104, 0.6, roeDeer({ antlers: false })), arrow(68, 82, 78, 82, HL, 2.6)),
  'dagg.byte.2': all(winter(), at(40, 100, 1.1, lynx()), at(90, 100, 0.9, hare()), ring(92, 84, 17)),
  'dagg.varg': all(winter(), pine(12, 92, 1.1), pine(108, 92, 1.2), at(58, 104, 1.35, wolf())),
  'dagg.lodjur': all(winter(), pine(106, 92, 1.2), at(56, 104, 1.55, lynx())),
  'dagg.järv': all(bg('#dbe8f2'), path('M4 70 L30 40 L52 66 L76 34 L116 74 L116 90 L4 90 Z', '#c6ced8', C.ink, 1), path('M24 47 L30 40 L36 47 Z M70 41 L76 34 L82 41 Z', SNOW, null), snowField(88), at(56, 104, 1.5, wolverine())),
  'dagg.köttätare': all(bg('#f2ede2'), field(100, '#d9cfb8'), at(46, 102, 1.15, wolf()), panel(80, 10, 32, 30, meatIcon(95, 24, 1.3)), check(96, 47, 1),
    greyPanel(8, 10, 32, 30, leafIcon(24, 25, 1.6)), cross(24, 47, 5)),
  'dagg.växtätare': all(meadow(), birch(102, 92, 1.2), at(50, 106, 0.82, moose()), panel(8, 8, 30, 28, leafIcon(23, 22, 1.6)), check(23, 42, 1),
    greyPanel(84, 8, 28, 24, meatIcon(98, 19, 1.1)), cross(98, 38, 4)),
  'dagg.allätare': all(forest(), at(52, 106, 1.05, bear()), panel(8, 8, 30, 26, berryIcon(23, 21, 1.4)), panel(82, 8, 30, 26, fishIcon(97, 21, 1.2)), check(23, 40, 0.9), check(97, 40, 0.9)),
  'dagg.huggtand': all(bg('#e6edf2'), at(52, 66, 1.6, path('M-28 -20 C-28 -34 -6 -40 10 -32 L34 -18 C38 -14 36 -10 30 -10 L6 -10 L4 4 L28 4 C34 4 34 10 28 12 L0 14 C-20 16 -30 8 -28 -20 Z', '#8c8f94', C.ink, 1.4),
    path('M-12 -35 L-8 -48 L0 -36 Z', '#8c8f94', C.ink, 1.2), path('M7 -10 L30 -10 L30 4 L7 4 Z', '#b45555', null),
    path('M9 -10 L11 -1 L13 -10 Z M26 -10 L27.5 -2 L29 -10 Z', C.white, C.ink, 0.7), path('M11 4 L12.5 -4 L14 4 Z M23 4 L24.5 -3 L26 4 Z', C.white, C.ink, 0.7),
    eye(2, -24, 2), circle(35, -15, 2, C.ink, null)), oval(70, 66, 12, 16)),
  'dagg.klo': all(bg('#efe6d8'), at(60, 76, 1.8, path('M-22 10 C-24 -10 -10 -20 6 -18 C18 -16 24 -6 22 10 Z', '#7a4f2e', C.ink, 1.4),
    ...[-14, -5, 4, 13].map((x) => path(`M${x - 3} -16 C${x - 3} -24 ${x + 5} -30 ${x + 9} -28 C${x + 4} -26 ${x + 2} -22 ${x + 3} -16 Z`, '#f2ead8', C.ink, 1)),
    ellipse(-1, 0, 10, 7, '#3d2a1e', null)), oval(62, 36, 34, 12)),
  'dagg.tass': all(bg('#dbe8f2'), snowField(88), at(48, 98, 1.3, lynx()), ...[[92, 104], [104, 96], [84, 96]].map(([x, y]) => pawPrint(x!, y!, 1.2)), ring(59, 96, 9)),
  'dagg.skygg': all(forest(), pine(66, 92, 1.4), atf(80, 104, 0.9, wolf()), arrow(92, 108, 112, 108, HL, 2), person(22, 108, 1.4),
    greyPanel(80, 8, 32, 30, atf(92, 34, 0.5, puppy({ grey: true })), person(104, 34, 0.55, C.orange, true))),
  'dagg.tamdjur': all(meadow(), rect(80, 42, 30, 30, '#b5372e', 0, C.ink, 1.2), path('M76 42 L95 28 L114 42 Z', C.dark, C.ink, 1.2),
    line('M4 84 L116 84 M4 92 L116 92', C.brown, 2), line(range(8).map((i) => `M${10 + i * 15} 80 L${10 + i * 15} 96`).join(' '), C.brown, 2.4),
    at(30, 108, 0.6, cow()), at(70, 108, 1, sheep()), at(98, 108, 0.7, puppy())),
  'dagg.fredad': all(bg('#e6efe2'), field(88, GRASS), path('M18 24 C40 14 80 14 102 24 C102 62 82 92 60 102 C38 92 18 62 18 24 Z', 'rgba(79,157,105,0.18)', C.green, 2.4), at(60, 90, 1.1, wolf()),
    greyPanel(82, 6, 32, 30, at(98, 32, 0.6, hare({ grey: true })), circle(98, 18, 9, 'none', C.ink, 1.2), line('M98 9 L98 27 M89 18 L107 18', C.ink, 1))),
  'dagg.licensjakt': all(forest(), person(28, 108, 1.6, C.orange), line('M34 70 L40 50', C.dark, 2), panel(56, 14, 54, 48, at(76, 48, 0.6, lynx()), num(100, 34, '3', 14, HL), line('M64 54 L102 54', C.grey, 1))),
  // 2703 Hjortdjur och klövdjur
  'dagg.klöv': all(bg('#efe6d8'), at(48, 104, 1.8, path('M-6 -50 L6 -50 L7 -14 L-7 -14 Z', '#4f3829', C.ink, 1.3), path('M-8 -14 L-1 -14 L-1 0 L-10 0 Z M1 -14 L8 -14 L10 0 L1 0 Z', '#2e2620', C.ink, 1.2)), ring(48, 96, 14), ...[[90, 100], [96, 82], [92, 64]].map(([x, y]) => hoofPrint(x!, y!, 1.4))),
  'dagg.klövdjur': all(meadow(), at(26, 104, 0.55, cow()), at(60, 104, 0.8, pig()), at(92, 104, 0.6, roeDeer()), ...[[13, 104], [32, 104], [46, 104], [66, 104], [81, 104], [97, 104]].map(([x, y]) => ring(x!, y!, 3.6))),
  'dagg.gevir': all(bg('#e9ecef'), field(100, GRASS), at(50, 106, 0.9, redDeer()), oval(78, 26, 16, 20)),
  'dagg.hjortdjur': all(forest(), at(26, 106, 0.5, moose()), at(66, 106, 0.62, roeDeer()), at(94, 106, 0.5, reindeer())),
  'dagg.kronhjort': all(meadow(), pine(106, 90, 1.2), at(50, 106, 0.88, redDeer())),
  'dagg.dovhjort': all(meadow(), birch(104, 90, 1.1), at(54, 106, 1.05, fallowDeer())),
  'dagg.ren-djur': all(winter(), path('M4 72 L36 46 L60 66 L92 40 L116 60 L116 90 L4 90 Z', '#c6ced8', C.ink, 1), at(54, 106, 0.95, reindeer())),
  'dagg.fälla.2': all(winter(), at(42, 104, 0.85, moose({ antlers: false })), at(104, 104, 0.9, path('M0 0 C-8 -2 -14 -8 -14 -16 L-10 -12 L-9 -19 L-6 -13 L-4 -20 L-2 -13 L1 -18 L2 -10 C4 -6 4 -2 2 0 Z', '#e6d8b8', C.ink, 1.3)), arrow(78, 42, 96, 84, HL, 2.6)),
  'dagg.idissla': all(meadow(), at(54, 106, 0.95, cow()), path('M50 84 C44 72 48 62 56 60 C62 58 70 62 74 68', 'none', HL, 2.4), path('M76 71 L68 67 L74 63 Z', HL, HL, 1),
    at(96, 34, 1, ellipse(0, 0, 9, 6, '#e9b8a8', C.ink, 1), ellipse(11, 2, 5, 5, '#e9b8a8', C.ink, 1), ellipse(-2, 10, 6, 4, '#e9b8a8', C.ink, 1), ellipse(10, 11, 5, 4, '#e9b8a8', C.ink, 1)), num(96, 58, '4', 10)),
  'dagg.beta': all(meadow(), at(36, 106, 0.6, g('rotate(8)', cow())), at(88, 104, 1.1, g('rotate(12)', sheep())), grassTufts(108, [16, 50, 62, 104], FOREST)),
  'dagg.tjur': all(meadow(), line('M4 84 L116 84', C.brown, 2), at(58, 106, 1.0, bull())),
  'dagg.vildsvin': all(forest(), at(58, 104, 1.4, boar())),
  'dagg.tryne': all(bg('#efe6d8'), field(92, '#b59a6a'), at(52, 106, 1.5, boar()), ring(110, 82, 8)),
  'dagg.myskoxe': all(winter(), path('M4 72 L40 44 L66 66 L96 46 L116 62 L116 90 L4 90 Z', '#c6ced8', C.ink, 1), at(56, 104, 1.2, muskOx())),
  'dagg.renskötsel': all(winter(), at(26, 104, 0.5, reindeer()), at(62, 100, 0.45, reindeer()), at(48, 110, 0.5, reindeer()), person(98, 108, 1.5, '#2f4a9a'), line('M91 82 L105 82', C.red, 1.6), line('M91 85 L105 85', C.yellow, 1.4),
    line('M102 72 C92 60 76 60 70 66', C.tan, 1.4), ellipse(70, 70, 6, 4, 'none', C.tan, 1.4)),
  // 2704 Gnagare och smådäggdjur
  'dagg.smådäggdjur': all(meadow(), at(30, 104, 0.75, mouse()), at(62, 104, 0.75, hedgehog()), at(96, 104, 0.75, shrew()), greyPanel(80, 8, 32, 34, at(96, 38, 0.3, moose({ grey: true })))),
  'dagg.gnaga': all(bg('#efe6d8'), rect(4, 96, 112, 16, '#c9a77a', 0, null), at(58, 98, 1.6, mouse()), at(98, 88, 3, nut(0, 0, 1)), ...[[86, 96], [92, 99], [80, 98]].map(([x, y]) => circle(x!, y!, 1.2, '#8a5a30', null)), ring(96, 88, 13)),
  'dagg.framtand': all(bg('#f3e5dc'), at(60, 60, 1, path('M-40 -10 C-30 -30 30 -30 40 -10 C30 20 -30 20 -40 -10 Z', '#c4525a', C.ink, 1.6), path('M-32 -12 C-20 -22 20 -22 32 -12 L32 -6 L-32 -6 Z', '#d97a80', null),
    ...[-30, -22, -14, -6, 2, 10, 18, 26].map((x) => rect(x - 4, -18, 8, x >= -10 && x <= 10 ? 14 : 10, C.white, 2, C.ink, 1))), oval(60, 49, 22, 12)),
  'dagg.gnagare': all(bg('#efe6d8'), at(32, 60, 1.1, squirrel()), at(86, 56, 0.9, beaver()), at(58, 104, 1.6, mouse()), ring(107, 48, 5)),
  'dagg.mus': all(bg('#efe6d8'), rect(4, 96, 112, 16, '#c9a77a', 0, null), at(66, 100, 1.75, mouse())),
  'dagg.råtta': all(bg('#c9ccd0'), rect(4, 96, 112, 16, '#8d939b', 0, null), at(66, 100, 1.35, rat())),
  'dagg.sork': all(meadow(), at(60, 104, 2.6, vole())),
  'dagg.lämmel': all(bg('#dfe8ee'), field(92, '#b8c09a'), rockShape(98, 96, 28, 14), at(52, 104, 2.8, lemming())),
  'dagg.lämmelår': all(bg('#dfe8ee'), path('M4 60 L36 34 L62 56 L90 30 L116 52 L116 70 L4 70 Z', '#c6ced8', C.ink, 1), field(68, '#b8c09a'),
    ...[[18, 80], [40, 76], [64, 82], [90, 78], [106, 88], [28, 94], [54, 98], [80, 96], [100, 104], [16, 108], [44, 110], [70, 108]].map(([x, y], k) => (k % 2 ? at(x!, y!, 0.9, lemming()) : atf(x!, y!, 0.9, lemming()))),
    greyPanel(80, 6, 32, 22, at(96, 24, 0.7, lemming({ grey: true })))),
  'dagg.marsvin': all(bg('#efe6d8'), rect(4, 94, 112, 18, '#e8d39a', 0, null), at(58, 100, 2.4, guineaPig())),
  'dagg.kanin': all(meadow(), at(58, 104, 2.2, rabbit())),
  'dagg.insektsätare': all(bg('#e2ecd6'), field(84, GRASS), at(48, 102, 1.8, hedgehog()), at(102, 96, 1, bugIcon(0, 0, 1.4)), worm(96, 106, 1.2), panel(8, 8, 32, 28, bugIcon(24, 22, 2)), check(24, 42, 1)),
  'dagg.näbbmus': all(bg('#e2ecd6'), field(86, '#9aa86e'), leafPile(18, 90), leafPile(30, 96), at(56, 102, 2, shrew()), ring(103, 92, 8)),
  'dagg.mullvad': all(bg(), field(60, '#9fcb6e'), rect(4, 66, 112, 46, SOIL, 0, null), path('M70 60 C74 46 96 46 100 60 Z', '#7a5a3a', C.ink, 1.2),
    path('M30 92 C46 92 60 88 70 78 L84 64', 'none', '#5e4630', 6), at(40, 98, 1.8, mole())),
  'dagg.fladdermus': all(bg(NIGHT), moon(96, 24, 9), starDot(20, 18), starDot(40, 30), starDot(70, 14), at(56, 64, 1.9, bat()), bugIcon(100, 88, 1)),
  'dagg.vessla': all(meadow(), at(58, 104, 1.8, weasel())),
  'dagg.hermelin': all(winter(), at(64, 104, 1.5, stoat()), ring(10, 96, 7)),
  // 2705 Havslevande däggdjur
  'dagg.säl': all(bg(), sea(76), rockShape(58, 92, 96, 22), at(58, 72, 1.2, seal())),
  'dagg.havslevande': all(bg(), sea(36), at(46, 68, 0.6, whale()), at(86, 98, 0.75, seal()), at(28, 102, 0.8, porpoise()), greyPanel(80, 6, 32, 26, rect(81, 26, 30, 5, GREY, 0, null), at(96, 26, 0.38, fox({ grey: true })))),
  'dagg.dyka': all(bg(), sea(34), at(58, 28, 0.75, seal()), at(72, 82, 0.9, g('rotate(40)', seal())), arrow(40, 44, 54, 74, HL, 2.6), circle(84, 56, 1.4, C.white, null), circle(88, 50, 1, C.white, null)),
  'dagg.simfot': all(bg(), sea(86), rockShape(60, 98, 104, 18), at(58, 86, 1.25, seal()), ring(9, 84, 8), ring(71, 86, 8)),
  'dagg.kut': all(bg('#dbe8f2'), rect(4, 84, 112, 28, SEA, 0, null), path('M4 76 L116 74 L116 88 L4 90 Z', ICE, C.ink, 1.1), at(58, 82, 1.2, seal({ pup: true }))),
  'dagg.gråsäl': all(bg(), sea(84), rockShape(58, 96, 104, 18), at(56, 82, 1.2, seal({ kind: 'grey' }))),
  'dagg.knubbsäl': all(bg(), sea(84), rockShape(58, 96, 104, 18), at(58, 82, 1.2, seal({ kind: 'harbour' }))),
  'dagg.vikare': all(bg('#dbe8f2'), rect(4, 84, 112, 28, SEA, 0, null), path('M4 76 L116 74 L116 88 L4 90 Z', ICE, C.ink, 1.1), path('M76 76 C80 68 96 68 100 76 Z', SNOW, C.ink, 1), at(56, 82, 1.2, seal({ kind: 'ringed' }))),
  'dagg.valross': all(bg('#dbe8f2'), rect(4, 86, 112, 26, SEA, 0, null), path('M4 72 L116 70 L116 88 L4 90 Z', ICE, C.ink, 1.1), at(62, 76, 1.2, walrus())),
  'dagg.val-djur': all(bg(), sea(40), at(66, 76, 0.92, whale()), spout(86, 58, 1)),
  'dagg.blåshål': all(bg(), sea(58), at(66, 80, 0.92, whale()), spout(86, 61, 1.2), ring(86, 62, 6)),
  'dagg.blåval': all(bg(), sea(32), at(64, 84, 0.95, whale({ col: '#6d8aa6' })), at(24, 32, 0.55, path('M-12 0 L12 0 L8 6 L-8 6 Z', C.red, C.ink, 1.2), rect(-1, -12, 2, 12, C.dark, 0, null), path('M1 -12 L9 -5 L1 -3 Z', C.white, C.ink, 0.8)), num(64, 104, '30', 9, C.white), line('M8 108 L112 108', C.white, 1.2)),
  'dagg.tumlare': all(bg(), sea(40), at(66, 82, 1.6, porpoise())),
  'dagg.delfin': all(bg(), sea(76), at(60, 60, 1.3, g('rotate(-18)', dolphin())), path('M18 78 C22 72 28 72 32 78', 'none', C.white, 1.4)),
  'dagg.späckhuggare': all(bg(), sea(54), at(68, 86, 1.25, orca())),
  'dagg.späck': all(bg('#e6edf2'), sea(98), at(58, 100, 1.2, seal()), section(60, 46, '#8f948f'), path('M60 66 L60 78', 'none', C.grey, 1.4), oval(60, 46, 19, 12)),
  'dagg.bifångst': all(bg(), sea(26, SEA2), line('M10 30 L30 108 M50 30 L50 108 M90 30 L70 108 M110 30 L110 108', '#d8d0b8', 0.9), line(range(8).map((i) => `M8 ${36 + i * 10} L112 ${36 + i * 10}`).join(' '), '#d8d0b8', 0.9),
    circle(30, 32, 3.4, C.orange, C.ink, 1), circle(100, 30, 3.4, C.orange, C.ink, 1), at(62, 76, 1.3, porpoise()), fishIcon(24, 98, 1), fishIcon(96, 100, 1), oval(58, 72, 34, 14)),
  // 2706 Däggdjurens fortplantning
  'dagg.hane': all(forest(), at(30, 106, 0.5, moose({ grey: true, antlers: false })), at(72, 106, 0.55, moose()), oval(80, 76, 30, 32)),
  'dagg.hona': all(forest(), at(28, 106, 0.5, moose({ grey: true })), at(70, 106, 0.55, moose({ antlers: false })), at(100, 108, 0.28, moose({ antlers: false, col: '#8a6040' })), oval(74, 78, 26, 30)),
  'dagg.unge': all(meadow(), at(46, 102, 0.8, fox({ grey: true })), at(94, 106, 0.45, fox()), ring(98, 96, 14)),
  'dagg.föröka-sig': all(bg('#f2ede2'), line('M38 14 L38 78 M78 14 L78 78', C.grey2, 1, '3 3'),
    at(22, 40, 0.42, mouse()), atf(22, 56, 0.42, mouse()),
    ...[[58, 26], [58, 40], [58, 54], [58, 68]].map(([x, y], k) => (k % 2 ? atf(x!, y!, 0.36, mouse()) : at(x!, y!, 0.36, mouse()))),
    ...range(12).map((k) => (k % 2 ? atf(88 + (k % 2) * 16, 20 + Math.floor(k / 2) * 10, 0.3, mouse()) : at(88 + (k % 2) * 16, 20 + Math.floor(k / 2) * 10, 0.3, mouse()))),
    arrow(30, 82, 46, 82, HL, 2.4), arrow(70, 82, 86, 82, HL, 2.4),
    line('M8 108 L112 108', C.ink, 1.4), rect(14, 100, 16, 8, HL, 1, C.ink, 1), rect(50, 92, 16, 16, HL, 1, C.ink, 1), rect(90, 86, 16, 22, HL, 1, C.ink, 1),
    num(22, 98, '2', 8), num(58, 90, '4', 8), num(98, 84, '12', 8)),
  'dagg.para-sig': all(forest(), at(38, 106, 0.55, redDeer()), atf(86, 106, 0.55, redDeer({ antlers: false, col: '#a8673e' })), heartS(62, 40, 1.4)),
  'dagg.parningstid': all(bg('#f2ede2'),
    ...range(12).map((i) => all(rect(6 + i * 9, 10, 8, 14, i === 8 || i === 9 ? '#f6c98a' : '#e4e6e9', 1.5, i === 8 || i === 9 ? C.ink : GREY2, 0.9), num(10 + i * 9, 20.5, String(i + 1), i < 9 ? 6 : 5, i === 8 || i === 9 ? C.ink : GREY2))),
    rect(77, 8, 20, 18, 'none', 2, HL, 2.4), path('M80 26 L40 40 M94 26 L110 40', 'none', HL, 1.6),
    rect(10, 40, 100, 70, '#f4d9b0', 3, HL, 2.4), rect(11, 92, 98, 17, '#c9a85a', 0, null), birch(98, 92, 0.9), leafPile(24, 52), leafPile(66, 48),
    at(34, 104, 0.5, moose()), atf(90, 104, 0.5, moose({ antlers: false })), heartS(62, 58, 0.9)),
  'dagg.brunst': all(bg('#f4d9b0'), field(92, '#c9a85a'), birch(104, 92, 1), at(44, 106, 0.85, redDeer()), line('M86 40 C90 44 90 50 86 54 M92 36 C98 42 98 52 92 58 M98 32 C106 40 106 54 98 62', HL, 2), leafPile(20, 30), leafPile(70, 20), leafPile(110, 70)),
  'dagg.dräktig': all(meadow(), at(54, 104, 1.3, roeDeer({ antlers: false })), ellipse(52, 60, 10, 7, 'rgba(255,255,255,0.6)', HL, 2), at(52, 64, 0.22, roeDeer({ antlers: false, col: '#d08a5a' })),
    greyPanel(8, 8, 32, 30, at(22, 34, 0.42, roeDeer({ grey: true, antlers: false })))),
  'dagg.kull': all(bg('#efe6d8'), rect(4, 90, 112, 22, '#d9c08a', 0, null), at(40, 100, 1.1, cat()), ...[[66, 104], [78, 106], [90, 103], [102, 106], [112, 103]].map(([x, y]) => at(x!, y!, 0.38, cat({ col: '#e8b070' }))), path('M60 86 L60 82 L116 82 L116 86', 'none', HL, 2.4)),
  'dagg.valp': all(meadow(), at(58, 104, 2.4, puppy())),
  'dagg.kid': all(meadow(), at(58, 104, 1.1, path('M-24 -2 C-26 -14 -10 -18 2 -16 C12 -15 16 -10 16 -6 L14 0 L-22 0 Z', '#c07a45', C.ink, 1.6), path('M10 -14 C12 -24 22 -28 28 -24 L34 -18 C35 -16 33 -14 30 -15 L22 -14 Z', '#c07a45', C.ink, 1.6), path('M16 -24 C12 -32 14 -34 18 -28 Z M22 -26 C24 -34 28 -34 26 -26 Z', '#c07a45', C.ink, 1.2),
    ...[[-16, -10], [-10, -12], [-4, -11], [2, -12], [-13, -6], [-6, -6], [1, -6], [8, -9]].map(([x, y]) => circle(x!, y!, 1.3, '#f6efe0', null)), eye(24, -22, 1.3), circle(34, -17, 1.2, C.ink, null)), grassTufts(104, [12, 26, 92, 104], FOREST)),
  'dagg.kalv.3': all(forest(), at(42, 106, 0.6, moose({ antlers: false })), at(94, 106, 0.38, moose({ antlers: false, col: '#8a6040' })), ring(96, 88, 18)),
  'dagg.dia': all(meadow(), at(46, 104, 1.05, goat()), atf(66, 104, 0.6, goat({ col: '#d9cdb8' })), oval(54, 82, 14, 10)),
  'dagg.spene': all(meadow(), at(56, 104, 1.4, pig()), ...[-12, -6, 0, 6].map((x) => circle(56 + x * 1.4, 90, 1.6, '#d77a7a', C.ink, 0.8)), oval(54, 90, 15, 5)),
  'dagg.lya': all(bg(), field(56, GRASS), path('M4 56 C30 40 80 36 116 50 L116 112 L4 112 Z', '#9a7a52', C.ink, 1.2), ellipse(64, 86, 20, 14, '#2e2219', C.ink, 1.2),
    at(46, 104, 0.55, fox({ col: '#d07a40' })), atf(82, 102, 0.5, fox({ col: '#d07a40' })), pine(20, 48, 1), oval(64, 86, 24, 17)),
  'dagg.könsmogen': all(bg('#f2ede2'), at(30, 60, 0.6, mouse()), arrow(44, 56, 58, 56, HL, 2.6), at(84, 60, 1, mouse()), heartS(100, 30, 1), line('M10 74 L110 74', C.grey2, 1), at(66, 100, 0.55, mouse()), at(96, 102, 0.55, mouse())),
  // 2707 Däggdjurens anpassningar
  'dagg.anpassning.2': all(bg('#f2ede2'),
    panel(4, 18, 36, 62, rect(5, 19, 34, 60, SKY, 2, null), rect(5, 64, 34, 15, '#9a7a52', 0, null), at(22, 72, 0.5, hare())),
    panel(42, 18, 36, 62, rect(43, 19, 34, 60, SKY, 2, null), rect(43, 64, 34, 15, '#9a7a52', 0, null), path('M43 64 C50 62 56 66 62 63 C68 61 72 64 77 63 L77 70 C70 72 60 68 52 71 C48 72 45 70 43 70 Z', SNOW, null),
      at(60, 72, 0.5, hare({ col: '#cdbfae' })), ...[[56, 62], [61, 60], [58, 66], [63, 64]].map(([x, y]) => circle(x!, y!, 1.6, C.white, null))),
    panel(80, 18, 36, 62, rect(81, 19, 34, 60, '#dbe8f2', 2, null), rect(81, 64, 34, 15, SNOW, 0, null), ...[[86, 28], [100, 24], [110, 38], [90, 44], [106, 52]].map(([x, y]) => circle(x!, y!, 1.4, C.white, '#9fb8cc', 0.6)), at(98, 72, 0.5, hare({ white: true }))),
    arrow(10, 92, 108, 92, HL, 3), at(60, 104, 1, circle(0, 0, 6, C.white, C.ink, 1.1), line('M0 0 L0 -4 M0 0 L3 1', C.ink, 1)), check(98, 10, 1.1)),
  'dagg.varmblodig': all(bg('#dbe8f2'), snowField(86), snowDots(), line('M60 10 L60 110', C.grey2, 1, '3 3'),
    ellipse(30, 92, 26, 16, 'rgba(240,138,60,0.28)', null), at(30, 100, 0.6, fox()), thermo(12, 50, 18, C.red), num(14, 18, '37', 9, C.red),
    at(92, 100, 1, path('M-18 -2 C-14 -6 -6 -7 0 -6 C6 -7 12 -6 16 -4 C18 -3 18 -1 16 0 C10 0 4 0 0 -1 C-8 0 -14 1 -22 2 C-26 3 -30 2 -32 0 C-28 0 -24 -1 -18 -2 Z', GREY, GREY2, 1.2), line('M-6 -2 l-3 4 M-12 -1 l-3 4 M6 -2 l3 4 M10 -2 l3 4', GREY2, 1.4), circle(12, -4, 0.8, GREY2, null)),
    thermo(108, 50, 3, GREY2), num(104, 18, '−5', 9, GREY2)),
  'dagg.fettlager': all(bg('#f2d9a6'), field(100, '#c9a85a'), at(54, 106, 1.15, bear()), section(52, 70, '#7a4f2e'), oval(52, 70, 19, 12)),
  'dagg.vinterpäls': all(winter(), snowDots(), at(52, 104, 0.95, fox(), line('M-20 -26 l-2 -3 M-12 -28 l-1 -3 M-4 -28 l0 -3 M4 -28 l1 -3 M10 -28 l2 -3 M-22 -18 l-3 -1 M-20 -12 l-3 1', '#d9692a', 2)),
    greyPanel(80, 8, 32, 28, rect(81, 30, 30, 5, '#d6dccf', 0, null), at(96, 31, 0.38, fox({ grey: true })))),
  'dagg.fjällräv': all(winter(), path('M4 72 L34 46 L58 66 L88 40 L116 62 L116 90 L4 90 Z', '#c6ced8', C.ink, 1), at(62, 104, 1.25, arcticFox())),
  'dagg.skogshare': all(winter(), pine(14, 92, 1.1), pine(106, 92, 1.2), at(58, 104, 1.6, hare({ white: true }))),
  'dagg.gå-i-ide': all(bg('#dbe8f2'), path('M4 112 L4 70 C30 34 90 30 116 66 L116 112 Z', SNOW, C.ink, 1.2), path('M24 112 C24 70 96 70 96 112 Z', '#6a4e36', C.ink, 1.2),
    at(60, 110, 0.85, path('M-34 0 C-38 -22 -14 -30 10 -28 C26 -26 32 -16 30 0 Z', '#7a4f2e', C.ink, 1.4), path('M20 -18 C26 -24 36 -20 38 -12 C38 -6 32 -2 24 -2 Z', '#7a4f2e', C.ink, 1.4), line('M28 -12 l4 0', C.ink, 1.4), circle(24, -22, 3, '#7a4f2e', C.ink, 1.2)), zzz(84, 60), pine(108, 66, 0.8)),
  'dagg.vinterdvala': all(bg('#d8dccb'), field(84, '#9a8a6a'), path('M20 104 C20 76 92 76 92 104 Z', '#b07a3a', C.ink, 1.2), leafPile(30, 82), leafPile(50, 76), leafPile(72, 78), leafPile(86, 90),
    at(56, 100, 1.2, circle(0, -10, 14, '#7a6450', C.ink, 1.4), line(range(10).map((i) => { const a = i * 0.63; return `M${f1(Math.cos(a) * 10)} ${f1(-10 + Math.sin(a) * 10)} l${f1(Math.cos(a) * 6)} ${f1(Math.sin(a) * 6)}`; }).join(' '), '#5a4636', 1.2), path('M6 -4 C10 -2 12 2 8 4 C4 2 2 0 6 -4 Z', '#d9b994', C.ink, 0.8)),
    thermo(104, 60, 3, C.sky), zzz(16, 40)),
  'dagg.nattaktiv': all(bg(NIGHT), moon(30, 24, 8), starDot(60, 16), starDot(80, 30), starDot(104, 18), field(90, '#3e5a3a'), at(58, 104, 1.4, badger()),
    greyPanel(78, 40, 34, 30, rect(80, 42, 30, 26, '#e6ebef', 2, null), circle(104, 50, 4, GREY, null), path('M84 64 C84 56 100 56 100 64 Z', GREY2, null), num(94, 54, 'z', 7, GREY2))),
  'dagg.morrhår': all(bg('#efe6d8'), at(60, 64, 2.4, circle(0, 0, 16, '#e0a060', C.ink, 1), path('M-14 -8 L-12 -22 L-4 -14 Z M14 -8 L12 -22 L4 -14 Z', '#e0a060', C.ink, 0.9), eye(-6, -3, 1.8), eye(6, -3, 1.8), path('M-2 3 L2 3 L0 5 Z', C.pink, C.ink, 0.5), line('M0 5 C-2 8 -4 8 -5 7 M0 5 C2 8 4 8 5 7', C.ink, 0.6)),
    line('M50 74 L14 66 M50 77 L12 78 M50 80 L16 90 M70 74 L106 66 M70 77 L108 78 M70 80 L104 90', C.ink, 1.2), oval(30, 78, 22, 16), oval(90, 78, 22, 16)),
  'dagg.ekolokalisering': all(bg(NIGHT), starDot(20, 20), starDot(100, 14), at(36, 60, 1.05, bat()), ...[0, 1, 2].map((i) => path(`M${56 + i * 9} ${46 - i * 4} C${62 + i * 11} 54 ${62 + i * 11} 66 ${56 + i * 9} ${74 + i * 4}`, 'none', HL, 2)),
    ...[0, 1].map((i) => path(`M${92 - i * 8} ${50 + i * 2} C${86 - i * 9} 56 ${86 - i * 9} 64 ${92 - i * 8} ${70 - i * 2}`, 'none', '#8fd1ff', 1.6)), at(102, 60, 1, ellipse(0, 0, 4, 2.6, '#c9b98a', C.ink, 0.8), path('M-2 -1 L-6 -6 L0 -2 Z M2 -1 L6 -6 L0 -2 Z', '#e6dcc0', C.ink, 0.6))),
};
