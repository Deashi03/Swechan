/**
 * Inner organs (0.13 pilot: Kroppen & sinnena): a trunk "organ map", the heart, vessels,
 * airways, the urinary tract, the brain and nerves, and the reproductive organs as
 * simple textbook diagrams. As in body.ts the named part is accent-coloured, the rest
 * stays muted, and an arrow points it out.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { pointAt } from './limbs';

const HL = C.accent;
type Pt = [number, number];
const MUTE = { lung: '#f4b6b6', heart: '#d65b5b', liver: '#b5654a', stomach: '#f2a7a0', gut: '#f3c09a', colon: '#e8a77c', yellow: '#f2d27a', green: '#86b86a', kidney: '#b9625a', bladder: '#f2d27a', brain: '#f2b8c6', nerve: '#f2c14e', artery: '#d64545', vein: '#4a78c2' } as const;
const TRUNK = 'M48 0 L72 0 L72 12 C84 16 104 18 110 26 L104 70 C102 84 100 98 98 120 L22 120 C20 98 18 84 16 70 L10 26 C16 18 36 16 48 12 Z';
const trunk = (): Svg => path(TRUNK, '#f6e3d3', C.ink, 2.2);

// ── Organ map of the trunk ──────────────────────────────────────────────────
export type Organ =
  | 'luftstrupe' | 'matstrupe' | 'lunga' | 'hjärta' | 'mellangärde' | 'lever' | 'gallblåsa' | 'gallgång' | 'magsäck' | 'mjälte' | 'bukspottkörtel'
  | 'tarm' | 'tunntarm' | 'tjocktarm' | 'ändtarm' | 'blindtarm' | 'bukhåla' | 'luftrör';
export function organs(hl: Organ[] = [], arrowFrom?: Pt, o: { stones?: boolean; fat?: boolean; shrunk?: boolean; ulcer?: boolean; acid?: boolean; flora?: boolean } = {}): Svg {
  const has = (p: Organ) => hl.includes(p);
  const f = (on: boolean, base: string) => (on ? HL : base);
  const out: Svg[] = [trunk()];
  if (has('bukhåla')) out.push(path('M20 66 C40 60 80 60 100 66 L98 118 L22 118 Z', 'none', HL, 3.4));
  // airways + gullet
  out.push(path('M62 0 L67 0 L67 60 L62 60 Z', f(has('matstrupe'), '#e7b3a3'), C.ink, 1.6));
  out.push(path('M54 0 L60 0 L60 28 L54 28 Z', f(has('luftstrupe'), '#cfd8e6'), C.ink, 1.6));
  out.push(line('M57 28 L46 38 M57 28 L68 38', has('luftrör') ? HL : '#cfd8e6', has('luftrör') ? 5 : 4));
  // lungs
  out.push(path('M48 26 C36 22 24 34 22 58 C30 62 42 62 50 58 L50 34 Z', f(has('lunga'), MUTE.lung), C.ink, 2));
  out.push(path('M72 26 C84 22 96 34 98 58 C90 62 78 62 70 58 L70 34 Z', f(has('lunga'), MUTE.lung), C.ink, 2));
  // heart
  out.push(path('M52 40 C52 34 62 34 62 40 C62 34 72 34 72 40 C72 48 62 54 62 58 C62 54 52 48 52 40 Z', f(has('hjärta'), MUTE.heart), C.ink, 2));
  if (has('luftrör')) out.push(line('M57 28 L46 38 M57 28 L68 38', C.ink, 7), line('M57 28 L46 38 M57 28 L68 38', HL, 4.6));
  out.push(line('M20 62 C40 54 80 54 100 62', has('mellangärde') ? HL : C.ink, has('mellangärde') ? 4.4 : 1.6));
  // liver + gall bladder (viewer's left = body's right)
  const liverFill = f(has('lever'), MUTE.liver);
  out.push(path(o.shrunk ? 'M28 66 C40 62 54 62 60 66 C58 72 48 76 32 76 C28 74 26 70 28 66 Z' : 'M22 64 C40 58 60 60 68 64 C64 72 52 80 34 82 C26 80 20 72 22 64 Z', liverFill, C.ink, 2));
  if (o.fat) for (const [x, y, r] of [[32, 70, 2.6], [40, 74, 2], [46, 68, 3], [54, 70, 2.2], [36, 77, 1.8]] as const) out.push(circle(x, y, r, '#fff3b0', C.ink, 0.8));
  if (o.shrunk) for (const [x, y] of [[34, 70], [42, 68], [50, 70], [38, 73]] as const) out.push(circle(x, y, 1.6, '#7d3f2c', null));
  out.push(path('M44 78 C46 74 54 74 54 80 C54 86 46 86 44 82 Z', f(has('gallblåsa'), MUTE.green), C.ink, 1.6));
  if (o.stones) out.push(circle(48, 80, 1.6, C.yellow, C.ink, 0.8), circle(51, 81, 1.3, C.yellow, C.ink, 0.8));
  if (has('gallgång')) out.push(line('M50 76 C54 72 58 76 60 82', HL, 3));
  // stomach, spleen, pancreas
  out.push(path('M64 62 C70 58 80 60 86 66 C90 74 84 84 74 84 C68 84 64 80 62 76 C66 74 68 70 64 62 Z', f(has('magsäck'), MUTE.stomach), C.ink, 2));
  if (o.acid) for (const [x, y] of [[72, 74], [78, 72], [76, 78]] as const) out.push(path(`M${x} ${y - 3} q2 3 0 4 q-2 -1 0 -4 Z`, '#9fd356', C.ink, 0.8));
  if (o.ulcer) out.push(circle(76, 76, 3.2, '#8c1c13', C.ink, 1));
  out.push(path('M88 62 C96 62 100 68 98 76 C94 78 88 74 88 62 Z', f(has('mjälte'), '#9a5fa8'), C.ink, 1.6));
  out.push(path('M52 86 C62 82 78 82 92 80 C92 84 86 88 78 88 C66 90 58 90 52 86 Z', f(has('bukspottkörtel'), MUTE.yellow), C.ink, 1.6));
  // intestines
  const colon = has('tjocktarm') || has('tarm');
  out.push(line('M32 112 L32 92 L88 92 L88 112 L64 112 L64 120', C.ink, 9), line('M32 112 L32 92 L88 92 L88 112 L64 112 L64 120', f(colon, MUTE.colon), 6.4));
  if (has('ändtarm')) out.push(line('M64 112 L64 120', HL, 6.4));
  const smallOn = has('tunntarm') || has('tarm');
  out.push(path('M40 98 C40 96 80 96 80 98 L80 108 C80 110 40 110 40 108 Z', f(smallOn, MUTE.gut), C.ink, 1.6));
  out.push(line('M44 101 C50 98 54 104 60 101 C66 98 70 104 76 101 M44 106 C50 103 54 109 60 106 C66 103 70 109 76 106', C.ink, 1.1));
  out.push(path('M30 112 C30 118 34 120 36 116 L34 112 Z', f(has('blindtarm'), MUTE.colon), C.ink, 1.4));
  if (o.flora) for (const [x, y] of [[46, 100], [56, 104], [66, 100], [74, 105], [50, 107]] as const) out.push(ellipse(x, y, 2.2, 1.2, C.green, C.ink, 0.6));
  if (arrowFrom) out.push(pointAt(ORG_T[hl[0]!], arrowFrom));
  return all(...out);
}
const ORG_T: Record<Organ, Pt> = {
  luftstrupe: [57, 14], matstrupe: [64.5, 30], lunga: [92, 46], hjärta: [66, 46], mellangärde: [94, 60], lever: [34, 72], gallblåsa: [50, 82], gallgång: [58, 80], magsäck: [82, 72], mjälte: [96, 70],
  bukspottkörtel: [84, 85], tarm: [86, 104], tunntarm: [72, 104], tjocktarm: [88, 104], ändtarm: [64, 118], blindtarm: [33, 116], bukhåla: [98, 96], luftrör: [68, 38],
};

// ── Heart ───────────────────────────────────────────────────────────────────
export type HeartPart = 'kammare' | 'förmak' | 'hjärtklaff' | 'aorta' | 'kranskärl';
/** The heart cut open: two atria on top, two ventricles below, valves between, aorta arching up. */
export function heartDiagram(hl: HeartPart[] = [], arrowFrom?: Pt, o: { clot?: boolean; pacemaker?: boolean; beat?: boolean } = {}): Svg {
  const has = (p: HeartPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M50 30 C50 14 64 8 70 20 L70 32', 'none', has('aorta') ? HL : MUTE.artery, 9), line('M70 30 L70 34', C.ink, 0.1));
  out.push(path('M58 32 C58 22 42 20 40 34', 'none', MUTE.vein, 7));
  out.push(path('M60 34 C40 24 18 40 24 62 C30 84 52 96 60 108 C68 96 90 84 96 62 C102 40 80 24 60 34 Z', MUTE.heart, C.ink, 2.6));
  out.push(path('M32 46 C34 38 46 36 56 42 L56 58 L30 58 C29 54 30 50 32 46 Z', has('förmak') ? HL : '#ef9a9a', C.ink, 1.6), path('M88 46 C86 38 74 36 64 42 L64 58 L90 58 C91 54 90 50 88 46 Z', has('förmak') ? HL : '#ef9a9a', C.ink, 1.6));
  out.push(path('M30 62 L56 62 L56 92 C46 84 34 76 30 62 Z', has('kammare') ? HL : '#e57373', C.ink, 1.6), path('M90 62 L64 62 L64 92 C74 84 86 76 90 62 Z', has('kammare') ? HL : '#e57373', C.ink, 1.6));
  out.push(path('M34 58 L42 62 L50 58 Z M70 58 L78 62 L86 58 Z', has('hjärtklaff') ? HL : C.white, C.ink, 1.4));
  out.push(line('M60 36 L60 104', C.ink, 2));
  if (has('kranskärl') || o.clot) out.push(line('M82 40 C92 52 90 70 80 84 M82 52 C76 60 74 70 76 76', has('kranskärl') ? HL : MUTE.artery, 3));
  if (o.clot) out.push(circle(87, 62, 4.6, '#6d1414', C.ink, 1.4));
  if (o.pacemaker) out.push(rect(88, 4, 22, 16, C.silver, 5, C.ink, 2), line('M94 20 C90 34 80 50 74 70', C.ink, 1.8), circle(74, 70, 2.4, C.ink, null));
  if (o.beat) out.push(line('M2 112 L30 112 L36 100 L42 118 L48 106 L52 112 L118 112', HL, 3));
  if (arrowFrom) out.push(pointAt(HEART_T[hl[0]!], arrowFrom));
  return all(...out);
}
const HEART_T: Record<HeartPart, Pt> = { kammare: [74, 76], förmak: [76, 48], hjärtklaff: [78, 60], aorta: [56, 14], kranskärl: [88, 58] };

/** Vessels in a figure: arteries red, veins blue; 'blodkärl' lights both, 'pulsåder' the red, 'ven'/'åder' the blue. */
export function vessels(which: 'blodkärl' | 'pulsåder' | 'ven' | 'blodomlopp'): Svg {
  const a = which === 'blodkärl' || which === 'pulsåder' || which === 'blodomlopp', v = which === 'blodkärl' || which === 'ven' || which === 'blodomlopp';
  const fig = 'M60 4 C68 4 70 12 68 20 L66 24 C76 26 84 28 86 34 L94 62 L88 64 L80 42 L78 70 L80 82 L78 118 L64 118 L60 86 L56 118 L42 118 L40 82 L42 70 L40 42 L32 64 L26 62 L34 34 C36 28 44 26 54 24 L52 20 C50 12 52 4 60 4 Z';
  const art = 'M58 40 L58 80 L52 116 M58 80 L52 80 M58 34 L46 34 L36 60 M58 34 L60 20';
  const vein = 'M62 40 L62 80 L68 116 M62 34 L74 34 L84 60 M62 34 L60 22';
  const out: Svg[] = [path(fig, '#f6e3d3', C.ink, 2.2)];
  out.push(line(art, a ? MUTE.artery : C.grey2, a ? 3 : 2), line(vein, v ? MUTE.vein : C.grey2, v ? 3 : 2));
  out.push(path('M56 38 C56 34 60 34 60 37 C60 34 64 34 64 38 C64 42 60 44 60 46 C60 44 56 42 56 38 Z', MUTE.heart, C.ink, 1.4));
  if (which === 'blodomlopp') out.push(path('M100 40 A16 16 0 1 1 99 39', 'none', HL, 3), path('M99 39 l-1 -7 l6 4 Z', HL, HL, 1));
  return all(...out);
}

/** A vessel in section, with a clot (blodpropp) or plaque (åderförkalkning). */
export function vesselSection(kind: 'propp' | 'förkalkning'): Svg {
  const out: Svg[] = [path('M0 34 L120 34 L120 86 L0 86 Z', '#f6c4c4', C.ink, 2.4), path('M0 42 L120 42 L120 78 L0 78 Z', '#e86b6b', null)];
  for (const x of [12, 30, 92, 108]) out.push(ellipse(x, 60, 5, 3.4, MUTE.artery, C.ink, 1));
  if (kind === 'propp') out.push(path('M50 42 C58 46 70 46 76 42 L76 78 C70 74 58 74 50 78 Z', '#6d1414', C.ink, 1.6));
  else out.push(path('M30 42 C44 54 76 54 90 42 Z', MUTE.yellow, C.ink, 1.6), path('M30 78 C44 68 76 68 90 78 Z', MUTE.yellow, C.ink, 1.6));
  out.push(line('M2 26 l12 0 l-4 -3 M14 26 l-4 3', C.navy, 2));
  return all(...out, pointAt(kind === 'propp' ? [64, 60] : [60, 50], [64, 112]));
}

// ── Head & throat (side) ────────────────────────────────────────────────────
export type ThroatPart = 'svalg' | 'stämband' | 'struphuvud' | 'luftväg' | 'bihåla' | 'hjärna' | 'storhjärna' | 'lillhjärna' | 'hjärnstam' | 'hjärnhalva' | 'ryggmärg' | 'sköldkörtel';
/** Head in profile with airway, voice box, sinuses and brain parts. */
export function headInside(hl: ThroatPart[] = [], arrowFrom?: Pt, o: { bleed?: boolean; hit?: boolean; flash?: boolean; stroke?: boolean } = {}): Svg {
  const has = (p: ThroatPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M30 30 C36 10 70 4 88 18 C98 26 100 40 98 48 L104 60 L98 64 L100 72 L96 76 C94 84 86 86 78 86 L76 120 L40 120 L42 96 C30 86 24 54 30 30 Z', '#f6e3d3', C.ink, 2.4));
  // brain
  out.push(path('M34 34 C40 16 70 10 86 22 C92 30 92 40 86 46 C70 50 46 50 36 46 Z', has('storhjärna') || has('hjärna') || has('hjärnhalva') ? HL : MUTE.brain, C.ink, 1.8));
  out.push(line('M44 24 C48 30 44 36 50 40 M58 18 C60 26 56 32 62 38 M72 18 C70 26 76 32 72 40', C.ink, 1.1));
  out.push(path('M38 48 C42 44 52 46 52 52 C50 58 40 58 38 52 Z', has('lillhjärna') || has('hjärna') ? HL : '#e79bb0', C.ink, 1.6));
  out.push(path('M54 46 L60 46 L58 62 L52 62 Z', has('hjärnstam') || has('hjärna') ? HL : '#e79bb0', C.ink, 1.4));
  out.push(path('M52 62 L58 62 L56 120 L50 120 Z', has('ryggmärg') ? HL : MUTE.nerve, C.ink, 1.4));
  if (o.bleed) out.push(path('M70 28 C78 26 82 34 76 38 C70 40 64 34 70 28 Z', '#8c1c13', C.ink, 1.2));
  if (o.stroke) out.push(path('M62 22 L74 32 L66 34 L78 46', 'none', C.ink, 6), path('M62 22 L74 32 L66 34 L78 46', 'none', C.yellow, 3.6));
  if (o.hit) out.push(line('M100 6 l-8 8 M110 16 l-10 4 M96 0 l-2 10', HL, 3), ...[[78, 30], [70, 24]].map(([x, y]) => path(`M${x} ${y} l2 -4 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 Z`, C.yellow, C.ink, 0.8)));
  // sinus, nose cavity, airway
  out.push(path('M82 50 C86 48 92 50 92 56 C88 58 84 56 82 50 Z', has('bihåla') ? HL : '#d8e6f2', C.ink, 1.2), path('M78 40 C82 38 86 40 86 44 C84 46 80 46 78 40 Z', has('bihåla') ? HL : '#d8e6f2', C.ink, 1.2));
  const airOn = has('luftväg');
  out.push(path('M96 60 C88 58 78 60 72 66 L70 90 L64 120 L72 120 L76 92 L78 70 C84 66 90 66 98 66 Z', airOn ? HL : '#cfd8e6', C.ink, 1.4));
  out.push(path('M68 64 L76 64 L76 80 L68 80 Z', has('svalg') ? HL : '#e7b3a3', C.ink, 1.4));
  out.push(path('M68 88 L80 88 L80 100 L68 100 Z', has('struphuvud') ? HL : '#d9c7e8', C.ink, 1.6));
  out.push(line('M70 94 L78 94', has('stämband') ? HL : C.ink, has('stämband') ? 3 : 1.4));
  if (has('sköldkörtel')) out.push(path('M66 102 C70 100 74 104 78 102 C82 104 82 110 78 110 C74 108 70 110 66 110 C62 110 62 104 66 102 Z', HL, C.ink, 1.6));
  out.push(ellipse(88, 44, 2.4, 2.8, C.ink, null));
  if (arrowFrom) out.push(pointAt(THROAT_T[hl[0]!], arrowFrom));
  return all(...out);
}
const THROAT_T: Record<ThroatPart, Pt> = {
  svalg: [76, 72], stämband: [78, 94], struphuvud: [80, 96], luftväg: [74, 100], bihåla: [90, 54], hjärna: [70, 30], storhjärna: [70, 28], lillhjärna: [44, 54], hjärnstam: [58, 56],
  hjärnhalva: [70, 28], ryggmärg: [54, 100], sköldkörtel: [80, 106],
};

/** Brain seen from above: two halves, one highlighted (hjärnhalva). */
export function brainTop(): Svg {
  return all(path('M58 14 C30 12 18 40 20 64 C22 92 40 108 58 106 Z', HL, C.ink, 2.4), path('M62 14 C90 12 102 40 100 64 C98 92 80 108 62 106 Z', MUTE.brain, C.ink, 2.4),
    line('M30 40 C38 44 34 52 44 54 M28 70 C38 66 40 76 50 74 M42 26 C46 32 52 30 52 38 M90 40 C82 44 86 52 76 54 M92 70 C82 66 80 76 70 74 M78 26 C74 32 68 30 68 38', C.ink, 1.3));
}

// ── Nerves ──────────────────────────────────────────────────────────────────
/** nervsystem / nerv: figure with brain, spinal cord and nerve branches. */
export function nerveFigure(which: 'nervsystem' | 'nerv'): Svg {
  const fig = 'M60 4 C68 4 70 12 68 20 L66 24 C76 26 84 28 86 34 L94 62 L88 64 L80 42 L78 70 L80 82 L78 118 L64 118 L60 86 L56 118 L42 118 L40 82 L42 70 L40 42 L32 64 L26 62 L34 34 C36 28 44 26 54 24 L52 20 C50 12 52 4 60 4 Z';
  const all_ = which === 'nervsystem';
  const nerves = 'M60 30 L46 34 L36 60 M60 30 L74 34 L84 60 M60 74 L50 84 L48 116 M60 74 L70 84 L72 116 M60 44 L48 50 M60 44 L72 50 M60 58 L50 64 M60 58 L70 64';
  return all(path(fig, '#f6e3d3', C.ink, 2.2), ellipse(60, 12, 7, 6, all_ ? HL : MUTE.brain, C.ink, 1.4), line('M60 18 L60 76', all_ ? HL : MUTE.nerve, 3),
    line(nerves, all_ ? HL : MUTE.nerve, 1.8), which === 'nerv' ? line('M74 34 L84 60', HL, 3.4) + pointAt([82, 52], [108, 40]) : '');
}

/** nervcell: a neuron – cell body with dendrites and a long axon. */
export function neuron(): Svg {
  return all(line('M48 52 L104 98', C.ink, 6), line('M48 52 L104 98', MUTE.nerve, 3.6),
    ...[[64, 65], [74, 73], [84, 81], [94, 90]].map(([x, y]) => ellipse(x!, y!, 5, 3, C.white, C.ink, 1.2)),
    line('M40 44 L22 30 M30 37 L24 44 M44 38 L40 14 M42 26 L34 22 M36 50 L14 52 M24 51 L18 60 M50 44 L66 24 M58 34 L66 36', C.ink, 2.4),
    circle(42, 46, 11, HL, C.ink, 2.2), circle(42, 46, 4, '#8c1c13', null),
    line('M104 98 l8 -2 M104 98 l6 6 M104 98 l0 10', C.ink, 2));
}

// ── Urinary tract ───────────────────────────────────────────────────────────
export type UrinaryPart = 'njure' | 'urinledare' | 'urinblåsa' | 'urinrör' | 'binjure';
export function urinary(hl: UrinaryPart[] = [], arrowFrom?: Pt, o: { stone?: boolean; failing?: boolean } = {}): Svg {
  const has = (p: UrinaryPart) => hl.includes(p);
  const out: Svg[] = [trunk()];
  for (const s of [-1, 1]) {
    const x = 60 + s * 24;
    out.push(path(`M${x} 40 C${x + s * 14} 40 ${x + s * 14} 70 ${x} 70 C${x - s * 6} 64 ${x - s * 2} 58 ${x - s * 6} 54 C${x - s * 2} 50 ${x - s * 6} 44 ${x} 40 Z`, has('njure') ? HL : MUTE.kidney, C.ink, 2));
    out.push(path(`M${x - s * 2} 40 C${x} 32 ${x + s * 8} 32 ${x + s * 10} 40 Z`, has('binjure') ? HL : MUTE.yellow, C.ink, 1.4));
    out.push(line(`M${x - s * 5} 56 C${x - s * 10} 70 ${60 + s * 8} 84 ${60 + s * 8} 94`, has('urinledare') ? HL : MUTE.yellow, has('urinledare') ? 4 : 2.6));
  }
  if (o.stone) out.push(circle(84, 58, 3.6, C.yellow, C.ink, 1.2), circle(36, 52, 2.4, C.yellow, C.ink, 1));
  if (o.failing) out.push(line('M74 46 L94 66 M94 46 L74 66', C.ink, 3.4));
  out.push(path('M46 96 C46 86 74 86 74 96 C74 106 66 108 60 108 C54 108 46 106 46 96 Z', has('urinblåsa') ? HL : MUTE.bladder, C.ink, 2));
  out.push(path('M57.5 107 L62.5 107 L62 120 L58 120 Z', has('urinrör') ? HL : MUTE.bladder, C.ink, 1.4));
  if (arrowFrom) out.push(pointAt(URI_T[hl[0]!], arrowFrom));
  return all(...out);
}
const URI_T: Record<UrinaryPart, Pt> = { njure: [92, 56], urinledare: [74, 80], urinblåsa: [70, 98], urinrör: [62, 116], binjure: [92, 36] };

// ── Reproduction ────────────────────────────────────────────────────────────
export type ReproPart = 'livmoder' | 'äggstock' | 'slida' | 'äggledare';
/** Female reproductive organs in front view (textbook diagram). */
export function uterus(hl: ReproPart[] = [], arrowFrom?: Pt, o: { egg?: boolean } = {}): Svg {
  const has = (p: ReproPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(line('M44 40 C34 30 24 34 20 46 M76 40 C86 30 96 34 100 46', has('äggledare') ? HL : '#f2a7b8', 4.4));
  out.push(ellipse(22, 54, 9, 6, has('äggstock') ? HL : '#f6c9d4', C.ink, 1.8), ellipse(98, 54, 9, 6, has('äggstock') ? HL : '#f6c9d4', C.ink, 1.8));
  out.push(path('M42 36 C42 30 78 30 78 36 C78 54 70 70 64 76 L56 76 C50 70 42 54 42 36 Z', has('livmoder') ? HL : '#f2a7b8', C.ink, 2.2));
  out.push(path('M50 40 C50 38 70 38 70 40 C68 52 64 62 60 66 C56 62 52 52 50 40 Z', '#fbe1e7', null));
  out.push(path('M55 76 L65 76 L66 108 L54 108 Z', has('slida') ? HL : '#f2a7b8', C.ink, 2));
  if (o.egg) out.push(circle(98, 54, 3.4, C.white, C.ink, 1.2), path('M100 50 l6 -6', 'none', HL, 2));
  if (arrowFrom) out.push(pointAt(REP_T[hl[0]!], arrowFrom));
  return all(...out);
}
const REP_T: Record<ReproPart, Pt> = { livmoder: [70, 50], äggstock: [98, 60], slida: [64, 96], äggledare: [88, 36] };

/** Male reproductive organs in front view (textbook diagram): penis and testicles. */
export function maleOrgans(hl: ('penis' | 'testikel')[] = [], arrowFrom?: Pt): Svg {
  const p = hl.includes('penis'), t = hl.includes('testikel');
  return all(path('M20 20 C40 30 80 30 100 20 L96 40 C80 46 40 46 24 40 Z', '#f6e3d3', C.ink, 1.8),
    ellipse(48, 82, 11, 14, t ? HL : '#f3c3a8', C.ink, 2), ellipse(72, 82, 11, 14, t ? HL : '#f3c3a8', C.ink, 2),
    path('M53 40 L67 40 L67 84 C67 92 53 92 53 84 Z', p ? HL : '#f1c7a1', C.ink, 2.2),
    arrowFrom ? pointAt(t ? [80, 84] : [66, 70], arrowFrom) : '');
}

/** äggcell / spermie / befruktning. */
export function cells(kind: 'ägg' | 'spermie' | 'befruktning'): Svg {
  const egg = (on: boolean) => all(circle(60, 60, 30, on ? HL : '#f6c9d4', C.ink, 2.4), circle(60, 60, 34, 'none', '#f2a7b8', 2, ), circle(66, 54, 8, '#fbe1e7', C.ink, 1.4));
  const sperm = (x: number, y: number, rot: number, on: boolean) => g(`translate(${x} ${y}) rotate(${rot})`, ellipse(0, 0, 5, 3.6, on ? HL : C.white, C.ink, 1.4), line('M-5 0 C-12 -4 -16 4 -24 0 C-30 -3 -34 2 -38 0', C.ink, 1.4));
  if (kind === 'ägg') return egg(true);
  if (kind === 'spermie') return all(sperm(80, 50, 0, true), sperm(70, 80, 10, false), sperm(96, 96, -20, false));
  return all(egg(false), sperm(34, 50, 30, true), sperm(14, 90, -10, false), sperm(104, 100, 200, false), path('M26 40 l6 2 l-2 5 M94 36 l-6 2 l2 5', 'none', C.gold, 2));
}

/** menscykel / ägglossning: a 28-day ring. */
export function cycle(mark: 'mens' | 'ägglossning' | 'cykel'): Svg {
  const out: Svg[] = [];
  for (let d = 0; d < 28; d++) {
    const a = (d / 28) * Math.PI * 2 - Math.PI / 2, x = 60 + Math.cos(a) * 40, y = 60 + Math.sin(a) * 40;
    const on = (mark === 'mens' && d < 5) || (mark === 'ägglossning' && d === 13) || mark === 'cykel';
    const base = d < 5 ? '#e57373' : d === 13 ? '#f6c9d4' : C.white;
    out.push(circle(+x.toFixed(1), +y.toFixed(1), on && mark !== 'cykel' ? 5.6 : 4, on && mark !== 'cykel' ? HL : base, C.ink, 1.2));
  }
  if (mark === 'cykel') out.push(path('M60 26 A34 34 0 1 1 46 29', 'none', HL, 3), path('M46 29 l2 -6 l4 6 Z', HL, HL, 1));
  if (mark === 'ägglossning') out.push(circle(60, 60, 8, C.white, C.ink, 1.4), circle(60, 60, 3, '#f2a7b8', null));
  if (mark === 'mens') out.push(path('M60 46 C66 56 68 62 60 70 C52 62 54 56 60 46 Z', '#d64545', C.ink, 1.6));
  return all(...out);
}
