/**
 * Teknik & digital värld → Transportteknik → Fartyg & sjöfart, 4251–4257 (0.60): hull and deck, ship engines,
 * propellers and rudders, navigation at sea, ports and quays, cargo ships and safety at sea.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Hulls are navy with a dark red bottom under the waterline, superstructures white, water blue, the
 * direction of travel a short white arrow at the bow. Port (babord) is red and starboard (styrbord) green, as on the
 * lanterns. Words that are easy to mix up get clearly different scenes: för (the bow ringed, arrow forward) and akter
 * (the stern ringed, flag); skrov (the bare orange hull on blocks) and köl (only the bar under it); huvudmotor (the big
 * engine and the shaft to the propeller) and hjälpmotor (a small engine, a generator and a lamp); propelleraxel (the shaft between engine and propeller) and roder (the plate behind it); rorsman (a whole person at a ship's wheel) and styrman (an officer with binoculars);
 * gira (a curved course seen from above), väja (a small boat swerving away from a big one) and kölvatten (the white V
 * of foam); grund (a sandbank under the surface, no ship on it) and gå på grund (a ship stuck on rocks); tross (a coil
 * of rope), pollare (the bollard with a gull) and förtöja (a person putting the rope over the bollard); ankare (the
 * anchor itself) and ankra (a ship letting it down); bogserbåt (the tug alone) and bogsera (a tug pulling a ship);
 * livbåt (the hard orange boat in davits) and räddningsflotte (the round raft with a canopy); sjöräddning (a rescue
 * boat lifting a person out of the water) and kustbevakning (a patrol ship and plane finding an oil spill).
 * Digits and code signs only; no letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SKY = '#e3f1f8';
const SEA = '#4f8fc0';
const SEA2 = '#9fcbe6';
const DEEP = '#2f5f8f';
const HULL = '#2f4a7a';
const BOTTOM = '#7e3f42';
const WHITE = '#fbfbf8';
const WIN = '#9fd0ea';
const STEEL = '#b8c0c8';
const STEEL2 = '#8d949b';
const DARKM = '#5a5d68';
const WOOD = '#c9a26b';
const QUAY = '#a9adb3';
const SAND = '#e3cf98';
const ROCK = '#8a8178';
const NIGHT = '#1f2a44';
const PORT = '#d6403a';
const STAR = '#2f9d57';
const OIL = '#2b2b30';
const BRASS = '#d9a441';
const ROPE = '#d8b26a';
const BOLTC = C.yellow;
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = SKY) => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const bolt = (x: number, y: number, s = 1, col: string = BOLTC) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const puff = (x: number, y: number, s = 1, col: string = C.grey2) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.1));
const drop = (x: number, y: number, s = 1, col: string = SEA) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C3 -2 4 1 4 3 C4 6 -4 6 -4 3 C-4 1 -3 -2 0 -6 Z', col, C.ink, 0.9));
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.2);
};
/** A wavy water surface line from x0 to x1 at height y. */
const wave = (y: number, col: string = '#d8ecf7', x0 = 0, x1 = 120, sw = 1.6) => line(`M${x0} ${y} ${range(Math.ceil((x1 - x0) / 10)).map(() => 'q2.5 -2.4 5 0 t5 0').join(' ')}`, col, sw);
const sea = (y = 86, col: string = SEA) => all(rect(0, y, 120, 120 - y, col, 0, null), wave(y), wave(y + 12, '#7fb2d6', 4, 116, 1.2));
/** Transparent water drawn on top of a hull, so the part under the waterline still shows. */
const water = (y = 86) => all(rect(0, y, 120, 120 - y, 'rgba(79,143,192,0.45)', 0, null), wave(y, '#ffffff', 0, 120, 1.6));
const quay = (x0: number, x1: number, y = 86) => all(rect(x0, y - 8, x1 - x0, 120 - y + 8, QUAY, 0, C.ink, 1.4), line(`M${x0} ${y - 8} L${x1} ${y - 8}`, C.ink, 2));
const gull = (x: number, y: number, s = 1) => line(`M${x - 5 * s} ${y} Q${x - 2.5 * s} ${y - 3 * s} ${x} ${y} Q${x + 2.5 * s} ${y - 3 * s} ${x + 5 * s} ${y}`, C.ink, 1.3);
const fwd = (x: number, y: number, len = 12) => arrow(x, y, x + len, y, WHITE, 2.6);

// ── People ───────────────────────────────────────────────────────────
type Hand = [number, number];
type CrewOpts = { shirt?: string; legs?: string; hat?: 'cap' | 'helmet' | 'officer' | 'beanie' | 'none'; hatCol?: string; l?: Hand; r?: Hand; vest?: string; stripes?: boolean; mouth?: 'o' | 'smile'; flip?: boolean };
/** Standing person, feet at (x, y), ~60 px tall at s = 1. Hands l/r are offsets from the shoulders (default: hanging). */
const crew = (x: number, y: number, s = 1, o: CrewOpts = {}) => {
  const sh = o.shirt ?? '#3f6fb5', lg = o.legs ?? '#2f3a55';
  const l = o.l ?? [-4, 20], r = o.r ?? [4, 20];
  const arm = (sx: number, h: Hand) => all(line(`M${sx} -40 L${sx + h[0]} ${-40 + h[1]}`, C.ink, 6.4), line(`M${sx} -40 L${sx + h[0]} ${-40 + h[1]}`, sh, 4.6), circle(sx + h[0], -40 + h[1], 2.6, C.skin, C.ink, 1));
  const hat = o.hat === 'cap' ? path('M-7 -55 C-7 -63 7 -63 7 -55 L11 -54 L-7 -54 Z', o.hatCol ?? HULL, C.ink, 1.2)
    : o.hat === 'helmet' ? path('M-8 -54 C-8 -64 8 -64 8 -54 L10 -53 L-10 -53 Z', o.hatCol ?? C.yellow, C.ink, 1.2)
    : o.hat === 'officer' ? all(path('M-8 -56 L-9 -62 L9 -62 L8 -56 Z', WHITE, C.ink, 1.2), rect(-8, -57, 16, 3, o.hatCol ?? HULL, 1, C.ink, 0.8), circle(0, -59, 1.4, BRASS, null))
    : o.hat === 'beanie' ? path('M-7 -55 C-7 -64 7 -64 7 -55 Z', o.hatCol ?? C.red, C.ink, 1.2)
    : path('M-7 -55 C-7 -62 7 -62 7 -55 C4 -58 -4 -58 -7 -55 Z', C.hair, null);
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`,
    path('M-7 -22 L-6 0 L-1 0 L0 -12 L1 0 L6 0 L7 -22 Z', lg, C.ink, 1.2), rect(-7, -1.5, 6, 2.5, C.black, 1, null), rect(1, -1.5, 6, 2.5, C.black, 1, null),
    arm(-7, l), rect(-8, -43, 16, 23, sh, 4, C.ink, 1.4),
    o.vest ? all(path('M-8 -41 L-3 -41 L-3 -21 L-8 -21 Z M3 -41 L8 -41 L8 -21 L3 -21 Z', o.vest, null), line('M-8 -30 L-3 -30 M3 -30 L8 -30', '#d8dde2', 1.6)) : '',
    o.stripes ? all(line('M-8 -41 l4 0 M-8 -39 l4 0 M8 -41 l-4 0 M8 -39 l-4 0', BRASS, 1.2)) : '',
    arm(7, r), rect(-2.5, -47, 5, 5, C.skin, 1, null), circle(0, -52, 6.4, C.skin, C.ink, 1.3), hat,
    circle(-2.2, -52, 0.9, C.ink, null), circle(2.6, -52, 0.9, C.ink, null),
    o.mouth === 'o' ? ellipse(0.4, -48.6, 1.4, 1.2, C.ink, null) : line('M-1.6 -49 Q0.4 -47.6 2.4 -49', C.ink, 1));
};

// ── Ships ────────────────────────────────────────────────────────────
type HullOpts = { col?: string; bottom?: string; line?: string; deck?: string };
/** Hull seen from the side, bow to the right; waterline at y = 0, deck at -16, keel at +10 (local units). */
const HULL_D = 'M-48 -16 L46 -16 L53 -21 L44 4 Q41 10 34 10 L-40 10 Q-47 10 -48 2 Z';
const BOT_D = 'M-48 0 L45.5 0 L44 4 Q41 10 34 10 L-40 10 Q-47 10 -48 2 Z';
const hull = (o: HullOpts = {}) => all(path(HULL_D, o.col ?? HULL, C.ink, 1.6), path(BOT_D, o.bottom ?? BOTTOM, C.ink, 1.2), o.deck ? line('M-48 -16 L46 -16 L53 -21', o.deck, 3) : '');
const winRow = (x: number, y: number, n: number, gap = 6, w = 3.4, h = 3) => all(...range(n).map((i) => rect(x + i * gap, y, w, h, WIN, 0.8, C.ink, 0.6)));
type FerryOpts = HullOpts & { hlBridge?: boolean; hlSuper?: boolean; ghostSuper?: boolean; mast?: string; flag?: boolean; noFunnel?: boolean; smoke?: boolean };
/** Passenger ferry, bow right, waterline at local y = 0. */
const ferry = (x: number, y: number, s = 1, o: FerryOpts = {}) => {
  const sup = all(path('M-42 -16 L-42 -32 L34 -32 L40 -16 Z', o.hlSuper ? HL : WHITE, C.ink, 1.4), winRow(-38, -28, 12), path('M-32 -32 L-32 -42 L26 -42 L30 -32 Z', o.hlSuper ? HL : WHITE, C.ink, 1.4), winRow(-28, -39, 9),
    o.noFunnel ? '' : all(rect(-24, -54, 10, 12, '#e8e2d4', 1, C.ink, 1.2), rect(-24, -54, 10, 3, OIL, 0.5, null)));
  return g(`translate(${x} ${y}) scale(${s})`, hull(o),
    o.ghostSuper ? g('', `<g opacity="0.5">`, line('M-42 -16 L-42 -32 L34 -32 L40 -16 M-32 -32 L-32 -42 L26 -42 L30 -32', C.grey, 1.2, '3 2'), '</g>') : sup,
    o.ghostSuper ? '' : all(path('M4 -42 L4 -50 L28 -50 L32 -42 Z', o.hlBridge ? HL : WHITE, C.ink, 1.4), rect(8, -48, 20, 4, NIGHT, 0.6, null),
      line('M16 -50 L16 -62', o.mast ?? DARKM, 2), line('M12 -58 L20 -58', o.mast ?? DARKM, 1.6), o.flag ? path('M-48 -16 L-48 -28 L-40 -25 L-48 -22', C.red, C.ink, 0.8) : ''),
    o.smoke ? puff(-19, -60, 0.6) : '');
};
/** Container ship, bow right: bridge aft, coloured container stacks. hlBox colours one stack orange. */
const CONT = ['#c8553d', '#3f7f6a', '#d9a441', '#3a6ab0', '#8a5aa0'];
const boxes = (x: number, y: number, cols: number, rows: number, w = 9, h = 6, seed = 0) => all(...range(cols).flatMap((c) => range(rows).map((r) => rect(x + c * w, y - (r + 1) * h, w, h, CONT[(c * 3 + r + seed) % CONT.length]!, 0.5, C.ink, 0.8))));
const cargoShip = (x: number, y: number, s = 1, o: HullOpts & { cargo?: Svg; hl?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`, hull({ col: o.hl ? HL : o.col ?? HULL, bottom: o.bottom }),
  rect(-46, -42, 14, 26, WHITE, 1, C.ink, 1.3), winRow(-44, -38, 3, 4, 2.6, 2.4), rect(-48, -46, 18, 5, WHITE, 1, C.ink, 1.2), rect(-44, -52, 6, 6, '#e8e2d4', 1, C.ink, 1), rect(-44, -52, 6, 2, OIL, 0.5, null),
  o.cargo ?? boxes(-28, -16, 8, 3));
const tanker = (x: number, y: number, s = 1, o: HullOpts & { hl?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`, hull({ col: o.hl ? HL : o.col ?? '#8c2f2f', bottom: o.bottom ?? '#4a2f33' }),
  rect(-46, -40, 14, 24, WHITE, 1, C.ink, 1.3), winRow(-44, -36, 3, 4, 2.6, 2.4), rect(-44, -46, 6, 6, '#e8e2d4', 1, C.ink, 1),
  line('M-30 -20 L46 -20', STEEL2, 2), line('M-30 -23 L46 -23', STEEL2, 1.6), ...range(5).map((i) => all(ellipse(-20 + i * 14, -17, 5, 2.6, STEEL, C.ink, 0.8), line(`M${-20 + i * 14} -23 L${-20 + i * 14} -17`, STEEL2, 1.2))),
  line('M8 -23 L8 -32 L14 -32', STEEL2, 1.6));
const bulker = (x: number, y: number, s = 1, o: HullOpts & { hl?: boolean; open?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`, hull({ col: o.hl ? HL : o.col ?? '#3f6a5a', bottom: o.bottom }),
  rect(-46, -42, 14, 26, WHITE, 1, C.ink, 1.3), winRow(-44, -38, 3, 4, 2.6, 2.4), rect(-44, -48, 6, 6, '#e8e2d4', 1, C.ink, 1),
  ...range(5).map((i) => o.open ? all(rect(-28 + i * 14, -19, 11, 3, STEEL2, 0.5, C.ink, 0.8), path(`M${-28 + i * 14} -19 Q${-22.5 + i * 14} -27 ${-17 + i * 14} -19 Z`, SAND, C.ink, 0.8)) : rect(-28 + i * 14, -20, 11, 4, STEEL2, 0.5, C.ink, 0.8)),
  ...range(4).map((i) => all(line(`M${-17 + i * 14} -16 L${-17 + i * 14} -34`, C.yellow, 1.8), line(`M${-17 + i * 14} -34 L${-10 + i * 14} -24`, C.yellow, 1.2))));
/** Tug boat, bow right, waterline at 0: high wheelhouse, black tyres on the bow. */
const tug = (x: number, y: number, s = 1, o: { col?: string; line?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-26 -8 L20 -8 L28 -13 L22 4 Q19 9 12 9 L-20 9 Q-26 9 -26 2 Z', o.col ?? '#c8553d', C.ink, 1.5), path('M-26 0 L24.4 0 L22 4 Q19 9 12 9 L-20 9 Q-26 9 -26 2 Z', OIL, C.ink, 1),
  rect(-12, -20, 22, 12, WHITE, 1.5, C.ink, 1.3), rect(-6, -30, 16, 10, WHITE, 1.5, C.ink, 1.3), rect(-4, -28, 12, 4, NIGHT, 0.6, null), rect(-12, -26, 5, 6, '#e8e2d4', 0.5, C.ink, 0.9),
  ...range(4).map((i) => circle(-18 + i * 12, -4, 3, OIL, C.ink, 0.8)), circle(25, -8, 3.2, OIL, C.ink, 0.8), o.line === false ? '' : rect(-24, -12, 4, 4, DARKM, 1, C.ink, 0.8));
/** Small open motor boat, bow right, waterline at 0. */
const boat = (x: number, y: number, s = 1, col: string = WHITE, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-16 -6 L14 -6 L19 -9 L12 3 L-14 3 Q-16 3 -16 0 Z', col, C.ink, 1.4), rect(-4, -12, 8, 6, WIN, 1, C.ink, 1));
/** Sailboat, bow right, waterline at 0. */
const sailboat = (x: number, y: number, s = 1, o: { mast?: string; sail?: string } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-20 -5 L18 -5 L24 -9 L16 2 L-16 2 Q-20 2 -20 -1 Z', WHITE, C.ink, 1.4), path('M-2 -8 L-2 -52 L-22 -10 Z', o.sail ?? WHITE, C.ink, 1.2), path('M2 -14 L2 -46 L18 -14 Z', o.sail ?? WHITE, C.ink, 1.2),
  line('M0 -5 L0 -56', C.ink, 4), line('M0 -5 L0 -56', o.mast ?? STEEL2, 2.4), path('M-2 2 L2 2 L1 12 L-1 12 Z', DARKM, C.ink, 0.8));
/** Ship seen from above, bow up, centred at (x, y). */
const topShip = (x: number, y: number, s = 1, rot = 0, o: { col?: string; deck?: string; hl?: 'port' | 'star' | null; lights?: boolean } = {}) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M0 -34 C10 -24 12 -12 12 0 L12 26 Q12 30 8 30 L-8 30 Q-12 30 -12 26 L-12 0 C-12 -12 -10 -24 0 -34 Z', o.col ?? HULL, C.ink, 1.6),
  o.hl === 'port' ? path('M0 -34 C-10 -24 -12 -12 -12 0 L-12 26 Q-12 30 -8 30 L0 30 Z', HL, C.ink, 1.2) : '', o.hl === 'star' ? path('M0 -34 C10 -24 12 -12 12 0 L12 26 Q12 30 8 30 L0 30 Z', HL, C.ink, 1.2) : '',
  rect(-8, 4, 16, 20, o.deck ?? WHITE, 2, C.ink, 1.2), rect(-6, 6, 12, 4, NIGHT, 0.6, null), circle(0, 18, 2.6, '#e8e2d4', C.ink, 0.8),
  o.lights ? all(circle(-12, -2, 3, PORT, C.ink, 0.8), circle(12, -2, 3, STAR, C.ink, 0.8)) : '');
/** Ship's wheel with handles. */
const wheel = (x: number, y: number, r = 14, col: string = WOOD) => all(circle(x, y, r, 'none', C.ink, 4.4), circle(x, y, r, 'none', col, 2.8),
  ...range(8).map((i) => { const a = (i * Math.PI) / 4; return all(line(`M${x} ${y} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.ink, 3.2), line(`M${x} ${y} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, col, 1.8)); }),
  circle(x, y, r * 0.25, col, C.ink, 1.2));
/** Ship propeller with three blades, seen from behind. */
const prop = (x: number, y: number, r = 12, col: string = BRASS) => all(...range(3).map((i) => g(`translate(${x} ${y}) rotate(${i * 120})`, path(`M0 0 C${r * 0.5} ${-r * 0.3} ${r * 0.55} ${-r} 0 ${-r} C${-r * 0.45} ${-r} ${-r * 0.35} ${-r * 0.3} 0 0 Z`, col, C.ink, 1.2))), circle(x, y, r * 0.22, col, C.ink, 1.2));
/** Propeller seen from the side (on a shaft). */
const propSide = (x: number, y: number, h = 12, col: string = BRASS) => all(path(`M${x - 2} ${y} C${x - 5} ${y - h * 0.6} ${x - 1} ${y - h} ${x + 2} ${y - h} C${x + 4} ${y - h * 0.6} ${x + 2} ${y - 2} ${x + 1} ${y} Z`, col, C.ink, 1.1),
  path(`M${x - 2} ${y} C${x - 5} ${y + h * 0.6} ${x - 1} ${y + h} ${x + 2} ${y + h} C${x + 4} ${y + h * 0.6} ${x + 2} ${y + 2} ${x + 1} ${y} Z`, col, C.ink, 1.1), ellipse(x, y, 3, 2.4, col, C.ink, 1));
const bollard = (x: number, y: number, s = 1, col: string = DARKM) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -12, 12, 12, col, 1.5, C.ink, 1.3), ellipse(0, -13, 9, 3.4, col, C.ink, 1.3), ellipse(0, -14, 6, 2, '#7a7f88', null));
const anchorShape = (x: number, y: number, s = 1, col: string = DARKM) => g(`translate(${x} ${y}) scale(${s})`, circle(0, -24, 4, 'none', C.ink, 4), circle(0, -24, 4, 'none', col, 2.4),
  line('M0 -20 L0 14 M-10 -12 L10 -12', C.ink, 5.4), line('M0 -20 L0 14 M-10 -12 L10 -12', col, 3.4),
  path('M-18 2 C-16 14 -6 18 0 18 C6 18 16 14 18 2 L22 6 L18 -4 L10 0 L14 2 C12 8 6 11 0 11 C-6 11 -12 8 -14 2 L-10 0 L-18 -4 L-22 6 Z', col, C.ink, 1.4));
const chain = (x1: number, y1: number, x2: number, y2: number, col: string = DARKM) => line(`M${x1} ${y1} L${x2} ${y2}`, col, 2.6, '3 1.6');
const ladderV = (x: number, y1: number, y2: number) => all(line(`M${x - 3} ${y1} L${x - 3} ${y2} M${x + 3} ${y1} L${x + 3} ${y2}`, ROPE, 1.4), ...range(Math.floor((y2 - y1) / 5)).map((i) => line(`M${x - 3} ${y1 + 3 + i * 5} L${x + 3} ${y1 + 3 + i * 5}`, WOOD, 1.6)));
const lifebuoy = (x: number, y: number, r = 7) => all(circle(x, y, r, 'none', C.ink, r * 0.62), circle(x, y, r, 'none', WHITE, r * 0.5), ...range(4).map((i) => g(`translate(${x} ${y}) rotate(${i * 90 + 45})`, line(`M0 ${-r} m-2 0 l4 0`, PORT, r * 0.5))));
const vest = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -12 L-3 -12 L-1 -6 L1 -6 L3 -12 L9 -12 L10 10 L-10 10 Z', C.orange, C.ink, 1.3), line('M-10 4 L10 4', '#e8e8e8', 1.6));

// ── Motifs ───────────────────────────────────────────────────────────
export const SHIPG_MOTIFS: Record<string, Svg> = {
  // ── 4251 Skrov och däck ──
  'shipg.fartyg': all(bg(), sea(84), ferry(60, 84, 1, { flag: true, smoke: true }), fwd(100, 96), greyed(boat(16, 100, 0.5)), gull(96, 18), gull(84, 24, 0.8)),
  'shipg.skrov': all(bg('#eef1f4'), rect(0, 104, 120, 16, '#b9bcc2', 0, null), ...[22, 46, 70, 94].map((x) => rect(x - 4, 92, 8, 12, WOOD, 1, C.ink, 1)),
    g('translate(60 82) scale(1.05)', path(HULL_D, HL, C.ink, 2), path(BOT_D, '#b8543a', C.ink, 1.2),
      `<g opacity="0.55">`, line('M-42 -16 L-42 -32 L34 -32 L40 -16 M-32 -32 L-32 -42 L26 -42 L30 -32 M4 -42 L4 -50 L28 -50 L32 -42', C.grey, 1.2, '3 2'), '</g>'),
    ...range(6).map((i) => line(`M${24 + i * 14} 66 L${24 + i * 14} 90`, '#c24a2a', 0.8))),
  'shipg.köl': all(bg('#eef1f4'), rect(0, 104, 120, 16, '#b9bcc2', 0, null), ...[24, 60, 96].map((x) => rect(x - 4, 96, 8, 8, WOOD, 1, C.ink, 1)),
    greyed(g('translate(60 86) scale(1.05)', path(HULL_D, STEEL, C.ink, 1.4), ...range(8).map((i) => line(`M${-40 + i * 11} -16 L${-40 + i * 11} 8`, STEEL2, 1.2)))),
    line('M15 96.5 L98 96.5', C.ink, 7), waPulse('shipgkol', line('M15 96.5 L98 96.5', HL, 4.6)), ring(26, 96, 9)),
  'shipg.för-noun': all(bg(), sea(86), ferry(54, 86, 0.95), fwd(102, 100, 14), ring(98, 72, 16)),
  'shipg.akter': all(bg(), sea(86), ferry(64, 86, 0.95, { flag: true }), fwd(100, 100, 14), ring(22, 72, 16)),
  'shipg.babord': all(bg(SEA), wave(20, '#d8ecf7', 0, 120), wave(98, '#d8ecf7', 0, 120), topShip(60, 64, 1.25, 0, { hl: 'port', lights: true }), arrow(60, 14, 60, 4, WHITE, 3),
    waPulse('shipgbab', circle(45, 61, 5, PORT, C.ink, 1.2)), arrow(38, 64, 14, 64, PORT, 3.4)),
  'shipg.styrbord': all(bg(SEA), wave(20, '#d8ecf7', 0, 120), wave(98, '#d8ecf7', 0, 120), topShip(60, 64, 1.25, 0, { hl: 'star', lights: true }), arrow(60, 14, 60, 4, WHITE, 3),
    waPulse('shipgsty', circle(75, 61, 5, STAR, C.ink, 1.2)), arrow(82, 64, 106, 64, STAR, 3.4)),
  'shipg.vattenlinje': all(bg(), rect(0, 76, 120, 44, SEA2, 0, null), g('translate(60 76) scale(1.05)', hull(), path('M-40 -16 L-40 -32 L32 -32 L38 -16 Z', WHITE, C.ink, 1.3), winRow(-36, -28, 11), rect(-30, -42, 10, 10, '#e8e2d4', 1, C.ink, 1)), water(76), line('M10 76 L106 76', C.ink, 4.6), line('M10 76 L106 76', HL, 3), ring(98, 76, 8)),
  'shipg.däck.2': all(bg(), sea(90), g('translate(60 90) scale(1.05)', hull(), path('M-34 -16 L-34 -30 L-6 -30 L-6 -16 Z', WHITE, C.ink, 1.3), winRow(-30, -26, 4), rect(-24, -38, 10, 8, '#e8e2d4', 1, C.ink, 1)),
    line('M10 73.2 L108 73.2', C.ink, 5), line('M10 73.2 L108 73.2', HL, 3.4), crew(66, 72, 0.42, { shirt: C.green }), crew(84, 72, 0.42, { shirt: C.orange, r: [10, 6] }), crew(96, 72, 0.42, { shirt: C.purple })),
  'shipg.reling': all(bg(), rect(0, 0, 120, 70, SKY, 0, null), sea(58), rect(0, 92, 120, 28, WOOD, 0, C.ink, 1.4), ...range(8).map((i) => line(`M${4 + i * 8} 92 L${0 + i * 8} 120`, '#a8834f', 1)),
    crew(44, 112, 0.95, { shirt: C.orange, l: [10, 14], r: [16, 10] }),
    line('M0 62 L120 62', C.ink, 5), waPulse('shipgrel', line('M0 62 L120 62', HL, 3.4)), line('M0 77 L120 77', C.ink, 3), line('M0 77 L120 77', HL, 1.8), ...range(7).map((i) => all(line(`M${8 + i * 18} 62 L${8 + i * 18} 92`, C.ink, 3.4), line(`M${8 + i * 18} 62 L${8 + i * 18} 92`, HL, 2)))),
  'shipg.brygga.2': all(bg(), sea(92), ferry(56, 92, 1, { hlBridge: true }), crew(78, 52, 0.22, { hat: 'officer', shirt: HULL }), ring(74, 47, 15)),
  'shipg.mast': all(bg(), sea(94), sailboat(52, 96, 1.3, { mast: HL }), ring(52, 40, 6), gull(98, 22)),
  'shipg.landgång': all(bg(), quay(0, 44, 92), rect(0, 92, 120, 28, SEA, 0, null), wave(92), g('translate(80 92) scale(1)', path('M-20 -16 L40 -16 L44 4 L-22 4 Z', HULL, C.ink, 1.6), path('M-22 0 L44 0 L44 4 L-22 4 Z', BOTTOM, null), rect(-20 , -40, 40, 24, WHITE, 1, C.ink, 1.3), winRow(-16, -34, 6), rect(-14, -26, 7, 10, '#e8e2d4', 1, C.ink, 1)),
    path('M30 84 L66 66 L68 70 L32 88 Z', HL, C.ink, 1.4), line('M30 78 L66 60', C.ink, 1.2), line('M36 81 L36 75 M48 75 L48 69 M60 69 L60 63', C.ink, 1), crew(46, 79, 0.36, { shirt: C.green, r: [8, 4] })),
  'shipg.ombord': all(bg(), sea(92), g('translate(62 92) scale(1.05)', hull(), path('M-42 -16 L-42 -46 L34 -46 L40 -16 Z', WHITE, C.ink, 1.4), rect(-36, -42, 66, 24, '#f6e9c8', 2, C.ink, 1.2)),
    ...[34, 52, 70, 88].map((x, i) => crew(x, 72, 0.36, { shirt: [C.green, C.orange, C.purple, C.red][i]!, hat: 'none' })), frame(22, 46, 74, 28),
    waIn('shipgomb', -10, 0, arrow(2, 60, 20, 60, HL, 3))),
  'shipg.varv.2': all(bg('#eef1f4'), rect(0, 100, 120, 20, '#b9bcc2', 0, null), rect(4, 84, 112, 16, '#8f949b', 0, C.ink, 1.2),
    g('translate(62 84) scale(0.9)', path(HULL_D, '#9aa3ad', C.ink, 1.6), path(BOT_D, '#b8543a', C.ink, 1.2)), ...range(5).map((i) => rect(22 + i * 18, 84, 6, 8, WOOD, 1, C.ink, 0.8)),
    line('M8 104 L8 18 M112 104 L112 18', C.ink, 4), line('M8 104 L8 18 M112 104 L112 18', C.yellow, 2.4), rect(4, 14, 112, 8, C.yellow, 1, C.ink, 1.4), rect(52, 22, 12, 8, '#5a5d68', 1, C.ink, 1),
    line('M58 30 L58 50', C.ink, 1.2), rect(50, 50, 16, 6, STEEL2, 1, C.ink, 1), waPulse('shipgvarv', burst(86, 74, 6)), crew(92, 68, 0.3, { hat: 'helmet', shirt: C.orange, l: [-6, 8] })),
  'shipg.sjösätta': all(bg(), rect(0, 0, 120, 120, SKY, 0, null), path('M0 70 L56 96 L0 96 Z', '#b9bcc2', C.ink, 1.2), rect(0, 96, 120, 24, SEA, 0, null), wave(96),
    moving('shipgsjo', '0%{transform:translate(-44px,-22px)}60%,100%{transform:translate(0,0)}', { dur: 3 }, g('translate(70 96) rotate(6) scale(0.7)', hull(), rect(-30, -26, 40, 10, WHITE, 1, C.ink, 1.2), rect(-22, -34, 10, 8, '#e8e2d4', 1, C.ink, 1))),
    waGrow('shipgsjo2', drop(88, 92, 1.4, SEA2), drop(96, 88, 1.1, SEA2), drop(80, 86, 1.1, SEA2)), ...range(3).map((i) => path(`M${10 + i * 6} 22 L${12 + i * 6} 16 L${14 + i * 6} 22`, C.red, C.ink, 0.6)), line('M8 22 L40 22', C.ink, 0.8)),

  // ── 4252 Fartygsmotorer ──
  'shipg.maskinrum': all(bg(), sea(64, DEEP), greyed(g('translate(60 64) scale(1.1)', hull({ col: STEEL, bottom: STEEL2 }), rect(-36, -40, 60, 24, WHITE, 1, C.ink, 1.2))),
    rect(14, 66, 62, 26, '#f0ebe0', 2, C.ink, 1.4), rect(20, 72, 22, 18, '#7a838d', 2, C.ink, 1.2), rect(48, 72, 22, 18, '#7a838d', 2, C.ink, 1.2), ...range(3).map((i) => circle(25 + i * 6, 76, 1.8, DARKM, null)), ...range(3).map((i) => circle(53 + i * 6, 76, 1.8, DARKM, null)),
    line('M16 69 L74 69', STEEL2, 2), frame(12, 64, 66, 30)),
  'shipg.maskinist': all(bg('#f0ebe0'), rect(0, 100, 120, 20, '#9aa3ad', 0, null), rect(70, 36, 44, 64, '#7a838d', 3, C.ink, 1.4), ...range(4).map((i) => circle(80 + (i % 2) * 22, 50 + Math.floor(i / 2) * 24, 6, '#dfe3e7', C.ink, 1.2)),
    line('M70 30 L118 30 M70 30 L70 36', STEEL2, 4), circle(92, 22, 6, WHITE, C.ink, 1.2), line('M92 22 L95 18', C.red, 1.2),
    crew(44, 108, 1.2, { shirt: '#2f5fa0', legs: '#2f5fa0', hat: 'none', r: [16, -6] }), path('M37 39 C37 33 51 33 51 39', 'none', C.red, 2.6), rect(35, 38, 4, 7, C.red, 2, C.ink, 0.8), rect(49, 38, 4, 7, C.red, 2, C.ink, 0.8),
    g('translate(65 54) rotate(-30)', rect(-1.6, -12, 3.2, 14, STEEL, 1, C.ink, 0.8), path('M-4 -12 L-4 -17 L-1 -15 L1 -15 L4 -17 L4 -12 Z', STEEL, C.ink, 0.8))),
  'shipg.huvudmotor': all(bg(), sea(36, DEEP), greyed(g('translate(60 66) scale(1.12)', path(HULL_D, STEEL, C.ink, 1.2))), rect(40, 50, 40, 36, HL, 3, C.ink, 1.6), rect(36, 46, 48, 8, '#c24a2a', 2, C.ink, 1.4), ...range(4).map((i) => circle(46 + i * 9.5, 50, 2.4, DARKM, null)),
    line('M40 76 L10 76', C.ink, 4.4), line('M40 76 L10 76', STEEL, 2.6), greyed(propSide(8, 76, 9, BRASS)), waSpin('shipghuv', 1.6, path('M24 70 A6 6 0 1 1 18 76', 'none', HL, 1.8)), rect(20, 60, 14, 10, 'none', 2, null)),
  'shipg.hjälpmotor': all(bg(), sea(36, DEEP), greyed(g('translate(60 66) scale(1.12)', path(HULL_D, STEEL, C.ink, 1.2), rect(-30, 0, 30, 20, '#7a838d', 2, C.ink, 1))),
    rect(64, 66, 22, 18, HL, 2, C.ink, 1.5), rect(62, 63, 26, 5, '#c24a2a', 1, C.ink, 1.2), line('M86 75 L92 75', STEEL2, 3), circle(98, 75, 7, '#9aa3ad', C.ink, 1.4), bolt(98, 75, 0.45),
    line('M104 75 L110 75 L110 44', C.ink, 1.4), waPulse('shipghjm', circle(110, 38, 6, C.yellow, C.ink, 1.3), ...range(3).map((i) => line(`M${102 + i * 8} 28 l${(i - 1) * 2} -4`, C.gold, 1.6))), rect(107, 43, 6, 4, C.grey, 1, C.ink, 0.8)),
  'shipg.tjockolja': all(bg('#efe9df'), rect(0, 104, 120, 16, '#b9bcc2', 0, null), g('translate(34 48)', rect(-18, -26, 36, 52, '#5a5d68', 3, C.ink, 1.6), line('M-18 -10 L18 -10 M-18 10 L18 10', C.ink, 1.4), rect(12, 14, 14, 6, '#7a7f88', 1, C.ink, 1.2)),
    path('M58 62 L64 62 C66 72 64 86 66 98', 'none', OIL, 6), moving('shipgtjo', '0%{transform:translate(0,-10px) scale(1,.6)}70%,100%{transform:translate(0,0) scale(1,1)}', { dur: 4 }, path('M62 92 C68 92 70 100 70 104 L56 104 C56 98 58 92 62 92 Z', OIL, null)),
    ellipse(66, 106, 18, 4, OIL, null), path('M82 80 C86 76 92 76 96 80 C100 76 106 78 106 84 C102 86 86 86 82 80 Z', '#3a3a40', C.ink, 0.8), ring(66, 98, 14)),
  'shipg.bunkra': all(bg(), sea(78), cargoShip(64, 78, 0.95), tug(26, 96, 0.7, { col: '#5a6a7a', line: false }), rect(14, 80, 16, 8, OIL, 1, C.ink, 1),
    path('M24 82 C32 70 40 64 48 62', 'none', C.ink, 4.4), path('M24 82 C32 70 40 64 48 62', 'none', '#3a3a40', 2.8), ...[0, 1, 2].map((i) => waIn(`shipgbun${i}`, -8, 10, drop(30 + i * 7, 74 - i * 5, 0.6, OIL))), circle(48, 62, 2.4, HL, C.ink, 0.8), ring(36, 70, 12)),
  'shipg.skrubber': all(bg(), g('translate(60 60)', rect(-22, -40, 44, 82, '#e8e2d4', 3, C.ink, 1.6), rect(-22, -40, 44, 8, OIL, 1, null), rect(-16, -24, 32, 46, '#dfe7ee', 2, C.ink, 1.2), line('M-14 -18 L14 -18', STEEL2, 2), ...range(5).map((i) => circle(-12 + i * 6, -15, 1.4, STEEL2, null))),
    puff(48, 72, 0.9, '#5a5d68'), puff(62, 74, 0.9, '#5a5d68'), ...range(4).map((i) => waIn(`shipgskr${i}`, 0, -6, line(`M${48 + i * 8} 48 L${46 + i * 8} 56 M${50 + i * 8} 54 L${48 + i * 8} 62`, '#5aa9d6', 1.6))),
    waIn('shipgskr4', 0, 8, puff(60, 14, 0.9, WHITE)), path('M50 102 L70 102 L68 112 L52 112 Z', '#7a8a96', C.ink, 1), ring(60, 56, 22)),
  'shipg.landström': all(bg(), quay(0, 40, 90), rect(0, 90, 120, 30, SEA, 0, null), wave(90), g('translate(84 90) scale(0.75)', hull(), rect(-36, -36, 56, 20, WHITE, 1, C.ink, 1.3), winRow(-32, -30, 8), rect(-28, -46, 10, 10, '#e8e2d4', 1, C.ink, 1)),
    rect(10, 60, 16, 22, '#dfe3e7', 2, C.ink, 1.3), bolt(18, 70, 0.6), path('M26 74 C40 74 44 64 56 66', 'none', C.ink, 4.4), path('M26 74 C40 74 44 64 56 66', 'none', OIL, 2.8), waPulse('shipglan', bolt(42, 58, 0.55)), cross(64, 48, 4, C.grey)),

  // ── 4253 Propellrar och roder ──
  'shipg.propelleraxel': all(bg(), sea(26, DEEP), path('M0 26 L120 26 L120 92 L36 92 C24 92 18 86 14 76 L0 76 Z', '#dfe3e7', C.ink, 1.4), rect(78, 46, 34, 34, '#9aa3ad', 2, C.ink, 1.4), rect(74, 42, 42, 7, '#7a838d', 1, C.ink, 1.2),
    line('M78 64 L10 64', C.ink, 6.4), line('M78 64 L10 64', HL, 4.4), greyed(propSide(8, 64, 12)), waSpin('shipgaxl', 1.4, path('M44 56 A8 8 0 1 1 36 64', 'none', HL, 1.8)), ring(44, 64, 12)),
  'shipg.roder': all(bg(DEEP), path('M30 0 L120 0 L120 40 C100 40 90 44 80 50 L44 50 Z', HULL, C.ink, 1.4), line('M118 62 L74 62', STEEL2, 4), greyed(propSide(72, 62, 13)),
    path('M50 48 L58 48 L60 96 L40 96 L40 70 Z', HL, C.ink, 1.6), line('M54 40 L54 50', C.ink, 3), waSway('shipgrod', 8, path('M50 48 L58 48 L60 96 L40 96 L40 70 Z', 'rgba(228,87,46,0.25)', null))),
  'shipg.rorsman': all(bg('#d8e8f0'), rect(0, 0, 120, 58, SKY, 0, null), rect(0, 40, 120, 18, SEA, 0, null), line('M0 58 L120 58', C.ink, 2), ...[30, 60, 90].map((x) => line(`M${x} 0 L${x} 58`, C.ink, 2)),
    rect(0, 92, 120, 28, '#9aa3ad', 0, null), crew(46, 110, 1, { shirt: '#2f5fa0', l: [14, 4], r: [20, 6] }), rect(62, 82, 14, 28, DARKM, 2, C.ink, 1.2), wheel(70, 70, 12)),
  'shipg.gira': all(bg(SEA), wave(14), wave(104), path('M30 108 C30 70 50 44 90 34', 'none', WHITE, 3, ), line('M30 108 C30 70 50 44 90 34', HL, 2.2, '5 4'),
    waIn('shipggir', -14, 16, topShip(92, 34, 0.6, 72)), path('M20 70 C18 52 30 38 44 32', 'none', HL, 2.6), path('M38 28 L45 32 L40 38', 'none', HL, 2.6)),
  'shipg.bogpropeller': all(bg(DEEP), g('translate(56 60)', path('M-56 -40 L20 -40 C42 -40 56 -20 56 0 C56 20 42 40 20 40 L-56 40 Z', HULL, C.ink, 1.6), ellipse(18, 0, 12, 14, '#1f2430', C.ink, 1.4),
    waSpin('shipgbog', 1, prop(18, 0, 10, HL))), ...range(3).map((i) => waIn(`shipgbog${i}`, -10, 0, line(`M${92 + i * 6} ${50 + i * 5} l10 0`, WHITE, 2))), arrow(74, 22, 104, 22, HL, 3), greyed(arrow(30, 104, 60, 104, C.grey, 3)), cross(46, 104, 5, C.grey)),
  'shipg.kölvatten': all(bg(SEA), path('M86 30 L2 74 L4 96 L80 42 Z', '#d8ecf7', null), path('M86 30 L2 74 L4 96 L80 42 Z', 'none', WHITE, 1.4), ...range(10).map((i) => circle(70 - i * 7 + (i % 2) * 3, 44 + i * 4.4 + (i % 3) * 3, 1.6 + (i % 2), WHITE, null)),
    topShip(92, 30, 0.6, 62), gull(28, 40), gull(44, 28, 0.8), ring(36, 74, 22)),
  'shipg.väja': all(bg(SEA), wave(12), wave(108), topShip(50, 70, 0.95, 180, { col: '#5a6a7a' }), line('M50 34 L50 4', WHITE, 1.4, '3 3'),
    path('M90 112 C90 86 86 62 74 44', 'none', '#d8ecf7', 1.4, ), cross(50, 30, 6, C.red), path('M90 112 C92 80 104 56 104 30', 'none', HL, 2.4, ), waIn('shipgvaj', -10, 18, topShip(104, 30, 0.42, 6, { col: HL })), path('M84 76 C88 66 94 60 100 56', 'none', HL, 2.6), path('M95 53 L101 55 L99 61', 'none', HL, 2.6)),
  'shipg.bogserbåt': all(bg(), sea(84), tug(60, 84, 1.7, { col: HL }), line('M18 66 L34 66', C.ink, 1.4), gull(96, 22)),
  'shipg.bogsera': all(bg(), sea(80), moving('shipgbgs', '0%{transform:translate(-8px,0)}100%{transform:translate(0,0)}', { dur: 2.6 }, g('', greyed(cargoShip(38, 80, 0.62)), line('M68 74 L86 78', C.ink, 3), line('M68 74 L86 78', ROPE, 1.8), tug(98, 80, 0.7, { col: HL }))), arrow(88, 102, 112, 102, HL, 3)),

  // ── 4254 Navigering till sjöss ──
  'shipg.ekolod': all(bg(), rect(0, 34, 120, 86, SEA, 0, null), wave(34), path('M0 104 C20 98 36 108 60 102 C84 96 100 104 120 100 L120 120 L0 120 Z', SAND, C.ink, 1.2), boat(46, 34, 1.3),
    ...range(3).map((i) => moving(`shipgeko${i}`, `0%{transform:translate(0,-26px);opacity:0}30%{opacity:1}100%{transform:translate(0,0);opacity:.2}`, { dur: 2.4, delay: i * 0.8 }, path(`M${34 - i * 2} ${66 + i * 12} Q46 ${72 + i * 12} ${58 + i * 2} ${66 + i * 12}`, 'none', C.yellow, 2))),
    ...range(3).map((i) => path(`M${34 - i * 2} ${66 + i * 12} Q46 ${72 + i * 12} ${58 + i * 2} ${66 + i * 12}`, 'none', C.yellow, 1.4)), line('M46 42 L46 100', C.yellow, 1, '2 3'),
    g('translate(94 18)', rect(-16, -12, 32, 26, '#1f2430', 3, C.ink, 1.4), path('M-12 6 C-6 4 -2 8 4 5 C8 3 10 6 12 5', 'none', SAND, 1.6), T(0, 0, '5', 10, C.yellow)), ring(46, 96, 10)),
  'shipg.boj': all(bg(), sea(70), path('M0 108 C30 104 60 112 120 106 L120 120 L0 120 Z', SAND, C.ink, 1), waBob('shipgboj', 3, path('M50 72 L70 72 L66 44 L54 44 Z', PORT, C.ink, 1.6), rect(52, 56, 16, 5, WHITE, 0.5, null), line('M60 44 L60 34', C.ink, 2), path('M54 34 L66 34 L60 24 Z', PORT, C.ink, 1.2), ellipse(60, 72, 12, 3, C.white, C.ink, 1.2)),
    chain(60, 76, 52, 108), rect(46, 106, 12, 6, DARKM, 1, C.ink, 1), wave(70)),
  'shipg.farled': all(bg(SEA), path('M0 0 L34 0 C30 20 18 30 0 34 Z', '#9fcf8a', C.ink, 1.3), path('M120 40 C96 44 86 60 90 76 C94 90 110 92 120 90 Z', '#9fcf8a', C.ink, 1.3), path('M0 70 C14 66 26 76 24 92 C22 106 10 110 0 108 Z', '#9fcf8a', C.ink, 1.3),
    ellipse(66, 18, 10, 6, ROCK, C.ink, 1), ellipse(54, 98, 8, 5, ROCK, C.ink, 1), path('M40 120 C44 90 50 70 58 54 C66 38 76 24 100 0', 'none', HL, 12), line('M40 120 C44 90 50 70 58 54 C66 38 76 24 100 0', WHITE, 1.4, '5 4'),
    ...[[34, 96, PORT], [56, 104, STAR], [42, 68, PORT], [66, 72, STAR], [56, 40, PORT], [78, 46, STAR], [74, 16, PORT], [96, 22, STAR]].map(([x, y, c]) => all(circle(x as number, y as number, 3.4, c as string, C.ink, 1))),
    topShip(50, 80, 0.3, 18)),
  'shipg.lanterna': all(bg(NIGHT), ...range(8).map((i) => circle(8 + i * 15, 10 + (i % 3) * 7, 0.9, '#f4f4ff', null)), rect(0, 86, 120, 34, '#1a2a4a', 0, null), wave(86, '#4a6a9a'),
    g('translate(60 86)', path('M-26 0 L26 0 L20 -14 L-20 -14 Z', '#34405a', C.ink, 1.4), path('M0 -14 L0 -50', 'none', '#5a6070', 2), rect(-8, -24, 16, 10, '#34405a', 1, C.ink, 1)),
    waPulse('shipglan2', circle(42, 66, 8, 'rgba(214,64,58,0.35)', null), circle(78, 66, 8, 'rgba(47,157,87,0.35)', null)), circle(42, 66, 4, PORT, C.ink, 1), circle(78, 66, 4, STAR, C.ink, 1), circle(60, 34, 3, '#fff5c0', C.ink, 0.8), ring(42, 66, 10), ring(78, 66, 10)),
  'shipg.lots': all(bg(), sea(96), path('M30 0 L120 0 L120 96 L30 96 Z', HULL, C.ink, 1.6), line('M30 82 L120 82', BOTTOM, 0), ladderV(56, 18, 92), crew(56, 66, 0.62, { shirt: C.orange, vest: C.yellow, l: [-4, -10], r: [4, -14] }),
    boat(30, 102, 1, '#2f2f38'), rect(16, 92, 14, 3, C.yellow, 0.5, null), ring(56, 46, 18)),
  'shipg.styrman': all(bg('#d8e8f0'), rect(0, 0, 120, 60, SKY, 0, null), rect(0, 42, 120, 18, SEA, 0, null), line('M0 60 L120 60', C.ink, 2), ...[40, 80].map((x) => line(`M${x} 0 L${x} 60`, C.ink, 2)), boat(96, 46, 0.5, '#5a6a7a'),
    rect(0, 92, 120, 28, '#9aa3ad', 0, null), rect(74, 70, 34, 26, '#1f2430', 2, C.ink, 1.3), circle(91, 83, 9, '#1f4a2a', null), line('M91 83 L98 77', '#7ef0a0', 1.4),
    crew(46, 112, 1.05, { shirt: WHITE, legs: HULL, hat: 'officer', stripes: true, l: [8, -14], r: [16, -14] }), rect(40, 52, 20, 7, OIL, 2, C.ink, 1), circle(44, 59, 3, OIL, C.ink, 0.8), circle(56, 59, 3, OIL, C.ink, 0.8)),
  'shipg.grund-noun.3': all(bg(), rect(0, 40, 120, 80, SEA, 0, null), wave(40), path('M0 112 C20 110 30 100 46 72 C54 56 70 54 78 70 C88 92 100 106 120 108 L120 120 L0 120 Z', HL, C.ink, 1.6),
    ...range(4).map((i) => ellipse(54 + i * 7, 62 + (i % 2) * 4, 4, 2.4, ROCK, C.ink, 0.8)), line('M62 42 L62 54', WHITE, 1.4, '2 2'), greyed(boat(14, 40, 0.8)), line('M14 46 L14 106', WHITE, 1.2, '3 3')),
  'shipg.gå-på-grund': all(bg(), rect(0, 70, 120, 50, SEA, 0, null), wave(70), path('M30 120 C34 92 50 76 64 74 C80 72 92 88 98 120 Z', ROCK, C.ink, 1.4), path('M60 74 C66 70 76 72 80 78', 'none', '#6a625a', 2),
    waShake('shipggpg', g('translate(62 66) rotate(-14) scale(0.62)', hull({ col: HL }), rect(-30, -28, 40, 12, WHITE, 1, C.ink, 1.2), rect(-22, -38, 10, 10, '#e8e2d4', 1, C.ink, 1))), burst(84, 72, 9)),

  // ── 4255 Hamnar och kajer ──
  'shipg.färjeläge': all(bg(), rect(0, 0, 120, 120, SKY, 0, null), rect(0, 74, 54, 46, QUAY, 0, C.ink, 1.2), line('M6 98 L50 98 M6 110 L50 110', WHITE, 1.4, '6 4'), rect(54, 74, 66, 46, SEA, 0, null), wave(74, '#d8ecf7', 54, 120),
    g('translate(110 74) scale(1)', path('M-50 -26 L10 -26 L10 4 L-40 4 Z', HULL, C.ink, 1.6), rect(-46, -44, 52, 18, WHITE, 1, C.ink, 1.3), winRow(-42, -38, 8), rect(-50, -24, 4, 24, '#1f2430', 0, null)),
    path('M40 76 L60 64 L62 68 L42 80 Z', HL, C.ink, 1.4), g('translate(20 70) scale(0.5)', path('M-24 -6 L-24 -16 L-14 -18 L-6 -26 L12 -26 L20 -18 L26 -16 L26 -6 Z', '#3a6ab0', C.ink, 1.8), circle(-12, -4, 6, OIL, C.ink, 1), circle(14, -4, 6, OIL, C.ink, 1)),
    g('translate(28 90) scale(0.5)', path('M-24 -6 L-24 -16 L-14 -18 L-6 -26 L12 -26 L20 -18 L26 -16 L26 -6 Z', C.red, C.ink, 1.8), circle(-12, -4, 6, OIL, C.ink, 1), circle(14, -4, 6, OIL, C.ink, 1)), arrow(32, 66, 50, 58, HL, 2.6)),
  'shipg.förtöja': all(bg(), quay(0, 120, 92), rect(0, 100, 120, 20, SEA, 0, null), wave(100), path('M40 0 L120 0 L120 70 L40 70 Z', HULL, C.ink, 1.6), rect(40, 64, 80, 6, BOTTOM, 0, null), bollard(30, 84, 1.2),
    crew(16, 84, 0.7, { hat: 'helmet', vest: C.yellow, shirt: C.orange, r: [12, 6], l: [10, 8] }), path('M70 40 C56 54 42 66 34 70', 'none', C.ink, 3.6), path('M70 40 C56 54 42 66 34 70', 'none', ROPE, 2.2),
    waIn('shipgfor', -6, -8, ellipse(30, 72, 9, 3.4, 'none', C.ink, 3.2), ellipse(30, 72, 9, 3.4, 'none', ROPE, 2)), arrow(52, 34, 36, 54, HL, 2.6)),
  'shipg.tross.2': all(bg(QUAY), ...range(5).map((i) => ellipse(56, 76 - i * 0.5, 40 - i * 7, 20 - i * 3.6, 'none', C.ink, 6.4)), ...range(5).map((i) => ellipse(56, 76 - i * 0.5, 40 - i * 7, 20 - i * 3.6, 'none', HL, 4.6)),
    path('M96 76 C104 60 108 40 116 20', 'none', C.ink, 6.4), path('M96 76 C104 60 108 40 116 20', 'none', HL, 4.6), ...range(6).map((i) => line(`M${98 + i * 3} ${70 - i * 9} l3 -2`, '#a83a1e', 1))),
  'shipg.pollare': all(bg(), rect(0, 0, 120, 70, SKY, 0, null), sea(70), quay(0, 120, 94), bollard(56, 94, 2.6, HL), g('translate(56 54)', ellipse(0, 0, 9, 6, WHITE, C.ink, 1.3), circle(7, -6, 4.4, WHITE, C.ink, 1.3), path('M11 -6 L15 -5 L11 -4 Z', C.yellow, C.ink, 0.8), circle(8, -7, 0.8, C.ink, null), path('M-9 0 L-14 -2 L-9 3 Z', '#9aa3ad', C.ink, 0.8), line('M-2 6 L-2 10 M2 6 L2 10', C.yellow, 1.2)),
    greyed(path('M0 84 C20 86 36 88 44 86', 'none', ROPE, 3))),
  'shipg.fender': all(bg(SEA), wave(14), wave(30), rect(0, 86, 120, 34, QUAY, 0, C.ink, 1.4), line('M0 86 L120 86', C.ink, 2.4), bollard(14, 104, 0.8), bollard(106, 104, 0.8),
    g('translate(60 60)', path('M-52 -14 L34 -14 C46 -14 54 -6 56 0 C54 6 46 14 34 14 L-52 14 Q-54 14 -54 10 L-54 -10 Q-54 -14 -52 -14 Z', WHITE, C.ink, 1.6), rect(-30, -8, 30, 16, '#e8e2d4', 2, C.ink, 1.2), rect(-28, -6, 10, 12, WIN, 1, C.ink, 0.8)),
    ...[28, 60, 92].map((x) => all(line(`M${x} 70 L${x} 76`, C.ink, 1), rect(x - 7, 75, 14, 9, HL, 4.5, C.ink, 1.4))), waShake('shipgfen', rect(53, 75, 14, 9, HL, 4.5, C.ink, 1.4)), frame(18, 72, 84, 15)),
  'shipg.ankare': all(bg('#e9eef2'), chain(60, 4, 60, 34), anchorShape(60, 64, 1.9, HL)),
  'shipg.ankra': all(bg(), rect(0, 40, 120, 80, SEA, 0, null), wave(40), path('M0 108 C30 104 60 112 120 106 L120 120 L0 120 Z', SAND, C.ink, 1), cargoShip(52, 40, 0.6), chain(80, 40, 88, 92),
    moving('shipgank', '0%{transform:translate(0,-40px)}70%,100%{transform:translate(0,0)}', { dur: 3 }, anchorShape(90, 98, 0.5, DARKM)), arrow(108, 60, 108, 86, HL, 2.6)),
  'shipg.hamnarbetare': all(bg(), rect(0, 100, 120, 20, QUAY, 0, null), boxes(66, 100, 5, 4, 10, 10, 1), crew(40, 110, 1.15, { hat: 'helmet', shirt: '#2f3a55', vest: '#d7f23a', r: [14, -18] }), rect(61, 33, 6, 11, OIL, 1, C.ink, 0.8), line('M63 33 L63 27', C.ink, 1.2)),
  'shipg.lägga-ut.3': all(bg(), quay(0, 30, 88), rect(30, 80, 90, 40, SEA, 0, null), wave(80, '#d8ecf7', 30, 120), bollard(20, 80, 0.9), greyed(path('M22 72 C30 80 34 84 40 86', 'none', ROPE, 2)),
    moving('shipglut', '0%{transform:translate(-10px,0)}100%{transform:translate(0,0)}', { dur: 2.6 }, ferry(84, 80, 0.62), path('M48 84 L36 88 L48 92', 'none', WHITE, 1.6)), arrow(80, 102, 108, 102, HL, 3)),

  // ── 4256 Lastfartyg ──
  'shipg.lastfartyg': all(bg(), sea(88), cargoShip(62, 88, 1.05, { hl: true, cargo: all(rect(-28, -26, 14, 10, C.tan, 1, C.ink, 1), rect(-12, -24, 10, 8, C.tan, 1, C.ink, 1), rect(2, -28, 16, 12, CONT[1]!, 1, C.ink, 1), path('M22 -16 L22 -24 L34 -24 L38 -16 Z', '#3a6ab0', C.ink, 1), ellipse(28, -26, 6, 3, C.beige, C.ink, 0.8)) }),
    greyed(ferry(26, 44, 0.42))),
  'shipg.tankfartyg': all(bg(), sea(86), tanker(60, 86, 1.05, { hl: true }), drop(98, 30, 2, OIL), ring(98, 30, 12)),
  'shipg.bulkfartyg': all(bg(), sea(88), bulker(58, 88, 1.05, { hl: true, open: true }), line('M110 20 L74 54', C.ink, 4), line('M110 20 L74 54', DARKM, 2.4), ...range(4).map((i) => waIn(`shipgbul${i}`, 4, -4, circle(76 - i * 1.5 + (i % 2), 58 + i * 4, 1.6, SAND, C.ink, 0.5)))),
  'shipg.containerkran': all(bg(), sea(96), quay(76, 120, 96), cargoShip(40, 96, 0.72), g('', line('M84 96 L84 10 M110 96 L110 10', C.ink, 5), line('M84 96 L84 10 M110 96 L110 10', HL, 3.4), rect(10, 6, 108, 8, HL, 1, C.ink, 1.6), line('M84 30 L110 30', HL, 2.4), rect(88, 14, 12, 8, WHITE, 1, C.ink, 1)),
    moving('shipgcon', '0%{transform:translate(30px,0)}60%,100%{transform:translate(0,0)}', { dur: 3 }, line('M44 14 L44 40', C.ink, 1.2), rect(38, 40, 13, 8, CONT[3]!, 0.6, C.ink, 1.2))),
  'shipg.rederi': all(bg('#eef2f5'), rect(36, 44, 48, 64, '#c9ced4', 2, C.ink, 1.6), ...range(4).flatMap((r) => range(3).map((c) => rect(42 + c * 14, 52 + r * 13, 8, 8, WIN, 1, C.ink, 0.8))), rect(54, 94, 12, 14, '#7a838d', 1, C.ink, 1), rect(0, 108, 120, 12, '#b9bcc2', 0, null),
    g('translate(60 30)', rect(-18, -12, 36, 22, HL, 3, C.ink, 1.4), path('M-12 2 L12 2 L9 7 L-9 7 Z', WHITE, C.ink, 1), rect(-5, -6, 8, 8, WHITE, 1, C.ink, 0.8)),
    ...[[14, 24], [106, 24], [14, 74], [106, 74]].map(([x, y]) => all(line(`M${x} ${y} L${x! < 60 ? 36 : 84} ${y! < 50 ? 34 : 70}`, HL, 1.4, '3 2'), g(`translate(${x} ${y}) scale(0.24)`, hull())))),
  'shipg.sjöman': all(bg(), rect(0, 0, 120, 64, SKY, 0, null), sea(64), rect(0, 96, 120, 24, '#7a838d', 0, C.ink, 1.4), line('M0 80 L120 80', C.ink, 2), ...range(7).map((i) => line(`M${i * 20} 80 L${i * 20} 96`, C.ink, 1.6)),
    crew(54, 110, 1.1, { shirt: '#2f5fa0', hat: 'beanie', hatCol: '#2f4a7a', vest: C.orange, l: [6, 12], r: [-2, 14] }), ...range(3).map((i) => ellipse(86, 104 - i * 2.6, 14 - i * 3, 5 - i, 'none', ROPE, 2.4)), gull(98, 26)),
  'shipg.stuva.2': all(bg('#e8e2d4'), path('M14 20 L14 110 L106 110 L106 20', 'none', C.ink, 3), rect(14, 106, 92, 4, DARKM, 0, null), boxes(16, 106, 6, 3, 15, 14, 2), rect(16, 50, 30, 14, CONT[0]!, 0.5, C.ink, 0.8), rect(46, 50, 30, 14, CONT[2]!, 0.5, C.ink, 0.8),
    moving('shipgstu', '0%{transform:translate(0,-36px)}65%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(76, 50, 30, 14, HL, 0.5, C.ink, 1.4), line('M91 50 L91 20', C.ink, 1.2)), frame(74, 48, 34, 18)),
  'shipg.surra.2': all(bg('#d6dade'), rect(0, 96, 120, 24, '#7a838d', 0, C.ink, 1.4), rect(24, 46, 72, 50, CONT[3]!, 1, C.ink, 1.6), ...range(9).map((i) => line(`M${30 + i * 8} 50 L${30 + i * 8} 92`, '#2f5590', 1.4)),
    waShake('shipgsur', line('M24 50 L8 96 M96 50 L112 96 M24 92 L8 96 M96 92 L112 96', C.ink, 4), line('M24 50 L8 96 M96 50 L112 96', HL, 2.6), line('M24 92 L8 96 M96 92 L112 96', HL, 2.6)),
    ...[[8, 96], [112, 96]].map(([x, y]) => rect(x! - 4, y! - 3, 8, 6, DARKM, 1, C.ink, 1)), rect(12, 76, 6, 8, DARKM, 1, C.ink, 1), rect(102, 76, 6, 8, DARKM, 1, C.ink, 1)),

  // ── 4257 Sjösäkerhet ──
  'shipg.livbåt': all(bg(), sea(100), path('M66 0 L120 0 L120 100 L66 100 Z', WHITE, C.ink, 1.6), line('M66 90 L120 90', HULL, 6), line('M70 20 L46 20 L46 30 M70 40 L50 40', C.ink, 3),
    line('M30 30 L30 46 M62 30 L62 46', C.ink, 1.2), g('translate(46 58)', path('M-30 -6 L30 -6 C30 6 22 12 0 12 C-22 12 -30 6 -30 -6 Z', HL, C.ink, 1.6), path('M-24 -6 C-24 -18 24 -18 24 -6 Z', HL, C.ink, 1.6), winRow(-16, -12, 5, 7, 4, 3), rect(-4, -20, 8, 4, WHITE, 1, C.ink, 0.8))),
  'shipg.räddningsflotte': all(bg(), sea(70), waBob('shipgrfl', 2, ellipse(60, 84, 42, 12, OIL, C.ink, 1.6), ellipse(60, 80, 42, 11, '#3a3a40', C.ink, 1.4), path('M24 80 C24 46 96 46 96 80 Z', HL, C.ink, 1.6), path('M50 80 C50 66 70 66 70 80 Z', '#2b2b30', C.ink, 1),
    circle(60, 72, 4, C.skin, C.ink, 1), line('M30 70 L90 70', '#e8e8e8', 1.4)), greyed(path('M8 50 L28 50 L30 60 L6 60 Z', WHITE, C.ink, 1))),
  'shipg.man-överbord': all(bg(), sea(70), path('M0 0 L44 0 L44 66 L0 66 Z', WHITE, C.ink, 1.6), line('M0 58 L44 58', HULL, 4), line('M0 34 L50 34', C.ink, 2), crew(30, 34, 0.5, { shirt: '#2f5fa0', mouth: 'o', r: [16, -8] }),
    path('M40 6 L62 6 L62 22 L48 22 L44 28 L45 22 L40 22 Z', WHITE, C.ink, 1.2), T(51, 19, '!', 13, C.red), waIn('shipgmob', -26, -14, lifebuoy(90, 74, 6)),
    circle(96, 92, 5, C.skin, C.ink, 1.2), path('M91 90 C91 84 101 84 101 90', 'none', C.hair, 2), line('M100 92 L108 82', C.ink, 5), line('M100 92 L108 82', C.skin, 3.4), wave(96, '#ffffff', 84, 112)),
  'shipg.nödsignal': all(bg(NIGHT), ...range(7).map((i) => circle(10 + i * 17, 12 + (i % 3) * 6, 0.9, '#f4f4ff', null)), rect(0, 90, 120, 30, '#1a2a4a', 0, null), wave(90, '#4a6a9a'), sailboat(40, 92, 0.75, { sail: '#9aa3ad' }),
    line('M60 88 C70 60 82 40 92 28', '#ffb0a0', 1.4, '2 3'), waPulse('shipgnod', circle(92, 26, 9, 'rgba(240,80,60,0.4)', null), burst(92, 26, 7, PORT)), ...range(3).map((i) => waPulse(`shipgnod${i}`, path(`M${48 + i * 6} ${46 - i * 6} a${6 + i * 6} ${6 + i * 6} 0 0 1 ${6 + i * 6} ${6 + i * 6}`, 'none', C.yellow, 1.6)))),
  'shipg.sjöräddning': all(bg(), sea(76), g('translate(66 76)', path('M-34 -10 L28 -10 L38 -16 L30 2 L-30 2 Q-34 2 -34 -2 Z', HL, C.ink, 1.6), line('M-34 -2 L34 -2', OIL, 4), rect(-8, -26, 18, 16, WHITE, 1.5, C.ink, 1.3), rect(-6, -24, 14, 5, NIGHT, 0.6, null), line('M2 -26 L2 -34', C.ink, 1.4), rect(-1, -36, 6, 3, '#4a8ad6', 1, null)),
    crew(40, 66, 0.5, { shirt: C.orange, vest: C.yellow, hat: 'helmet', hatCol: WHITE, l: [-10, 16], r: [-14, 14] }), circle(24, 86, 5, C.skin, C.ink, 1.2), path('M19 84 C19 78 29 78 29 84', 'none', C.hair, 2), vest(24, 94, 0.7), line('M28 84 L32 76', C.skin, 3)),
  'shipg.kustbevakning': all(bg(), sea(84), g('translate(56 84) scale(0.9)', hull({ col: '#e8e8ea', bottom: '#5a5d68' }), path('M10 -16 L22 -16 L8 0 L-4 0 Z', C.yellow, null), path('M24 -16 L30 -16 L16 0 L10 0 Z', '#2f5fa0', null), rect(-30, -34, 40, 18, '#e8e8ea', 1, C.ink, 1.3), rect(-6, -42, 16, 8, '#e8e8ea', 1, C.ink, 1.2), rect(-4, -40, 12, 3, NIGHT, 0.6, null), line('M2 -42 L2 -52', DARKM, 1.6)),
    path('M78 96 C88 92 104 94 112 100 C104 106 86 106 78 96 Z', OIL, null), g('translate(78 22) scale(0.9)', path('M-14 0 C-14 -2 10 -3 14 0 C10 3 -14 2 -14 0 Z', '#e8e8ea', C.ink, 1.2), path('M-2 -1 L-8 -10 L-4 -10 L6 -1 Z M-2 1 L-8 10 L-4 10 L6 1 Z', '#e8e8ea', C.ink, 1)),
    waPulse('shipgkbv', path('M80 26 L72 92 L104 92 Z', 'rgba(242,193,78,0.3)', null)), ring(94, 99, 18)),
  'shipg.slagsida.2': all(bg(), sea(86), greyed(g('translate(60 86) scale(0.8)', path(HULL_D, 'none', C.grey, 1.2, ), line('M-36 -16 L-36 -40 L30 -40 L30 -16', C.grey, 1.2))), g('translate(60 86) rotate(16) scale(0.8)', hull({ col: HL }), path('M-36 -16 L-36 -36 L30 -36 L34 -16 Z', WHITE, C.ink, 1.3), winRow(-32, -30, 10), rect(-26, -48, 10, 12, '#e8e2d4', 1, C.ink, 1)),
    water(86), path('M30 30 A40 40 0 0 1 58 22', 'none', HL, 2.4), path('M53 18 L59 22 L54 27', 'none', HL, 2.4)),
  'shipg.kantra': all(bg(), sea(78), moving('shipgkan', '0%{transform:rotate(-180deg)}60%,100%{transform:rotate(0)}', { dur: 3.2, spin: true }, g('translate(60 82) scale(1.2)', path('M-26 0 L26 0 C24 -8 16 -12 0 -12 C-16 -12 -24 -8 -26 0 Z', HL, C.ink, 1.6), path('M-2 -12 L-2 -18 L4 -18 L4 -12', DARKM, C.ink, 1.2), line('M-26 0 L26 0', WHITE, 2.4))),
    circle(26, 92, 5, C.skin, C.ink, 1.2), vest(26, 100, 0.6), circle(96, 94, 5, C.skin, C.ink, 1.2), vest(96, 102, 0.6), water(80), path('M40 40 A26 26 0 1 1 80 40', 'none', HL, 2.6), path('M74 34 L80 40 L86 34', 'none', HL, 2.6)),
};
