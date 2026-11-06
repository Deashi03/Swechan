/**
 * Skeleton, joints and muscles (0.13 pilot: Kroppen & sinnena) – simple picture-book
 * diagrams on the 120×120 canvas. Same rule as body.ts and limbs.ts: one drawing per
 * view, the named part in the accent colour plus an arrow.
 */
import { C, all, circle, ellipse, g, line, path, type Svg } from './kit';
import { pointAt } from './limbs';

const HL = C.accent;
type Pt = [number, number];
const BONE = '#f3ead6';
/** A bone along a path: ink outline under a light core. */
const bone = (d: string, on = false, w = 5): Svg => line(d, C.ink, w + 2.6) + line(d, on ? HL : BONE, w);

// ── Skeleton (front) ────────────────────────────────────────────────────────
export type SkeletonPart =
  | 'skelett' | 'kranium' | 'ryggrad' | 'kota' | 'svanskota' | 'bröstkorg' | 'revben' | 'bröstben' | 'nyckelben'
  | 'bäcken' | 'höftben' | 'lårben' | 'skenben' | 'led' | 'axelled' | 'höftled' | 'knäled' | 'armbågsled';

export function skeleton(hl: SkeletonPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: SkeletonPart) => hl.includes(p) || hl.includes('skelett');
  const out: Svg[] = [];
  // ribs
  const ribOn = has('revben') || has('bröstkorg');
  for (let i = 0; i < 5; i++) { const y = 31 + i * 5; const w = 17 + Math.sin((i + 1) * 0.6) * 3; out.push(bone(`M58 ${y} C${58 - w} ${y - 2} ${58 - w - 2} ${y + 6} ${58 - w + 4} ${y + 8}`, ribOn, 2.6), bone(`M62 ${y} C${62 + w} ${y - 2} ${62 + w + 2} ${y + 6} ${62 + w - 4} ${y + 8}`, ribOn, 2.6)); }
  out.push(path('M58 29 L62 29 L61.4 50 L58.6 50 Z', has('bröstben') || has('bröstkorg') ? HL : BONE, C.ink, 1.6));
  const spineFront = hl.includes('ryggrad') || hl.includes('kota') || hl.includes('svanskota');
  const spineSvg: Svg[] = [];
  // spine – vertebrae as small blocks (in front of the ribs when it is the word)
  for (let y = 24; y <= 70; y += 4.6) {
    const on = has('ryggrad') || (hl.includes('kota') && Math.abs(y - 61.6) < 1);
    const k = hl.includes('kota') && on ? 2.5 : 0;
    spineSvg.push(path(`M${56.5 - k} ${y - k / 2} L${63.5 + k} ${y - k / 2} L${63.5 + k} ${y + 3.6 + k / 2} L${56.5 - k} ${y + 3.6 + k / 2} Z`, on ? HL : BONE, C.ink, 1.4));
  }
  spineSvg.push(path('M57.5 74 L62.5 74 L60 81 Z', has('svanskota') ? HL : BONE, C.ink, 1.4));
  if (spineFront) out.push(...spineSvg); else out.splice(0, 0, ...spineSvg);
  out.push(bone('M58 27 C52 24 46 25 40 27', has('nyckelben'), 3), bone('M62 27 C68 24 74 25 80 27', has('nyckelben'), 3));
  // pelvis
  const pel = has('bäcken'), hip = has('höftben') || pel;
  out.push(path('M42 64 C40 72 46 80 54 82 L60 78 L66 82 C74 80 80 72 78 64 C72 68 66 70 60 70 C54 70 48 68 42 64 Z', hip ? HL : BONE, C.ink, 2));
  if (!pel && hl.includes('höftben')) out.push(line('M60 70 L60 78', C.ink, 1.6));
  // arms
  for (const s of [-1, 1]) {
    const x = 60 + s * 20;
    out.push(bone(`M${x} 29 L${x + s * 6} 52`, false, 3.6), bone(`M${x + s * 6} 54 L${x + s * 9} 74`, false, 3), bone(`M${x + s * 7} 54 L${x + s * 11} 73`, false, 2));
    out.push(ellipse(x + s * 10, 79, 3.4, 4.4, BONE, C.ink, 1.6));
  }
  // legs
  for (const s of [-1, 1]) {
    out.push(bone(`M${60 + s * 11} 80 L${60 + s * 12} 100`, has('lårben'), 4.4));
    out.push(bone(`M${60 + s * 12} 104 L${60 + s * 12} 117`, has('skenben'), 3.8));
    out.push(bone(`M${60 + s * 12} 118 L${60 + s * 18} 119`, false, 3));
  }
  out.push(ellipse(60, 13, 10, 11, has('kranium') ? HL : BONE, C.ink, 2.2), ellipse(56, 13, 2.6, 3, C.dark, null), ellipse(64, 13, 2.6, 3, C.dark, null), path('M57 20 L63 20 L62 23 L58 23 Z', C.dark, null));
  // joints
  const J: [SkeletonPart, Pt[]][] = [['axelled', [[40, 29], [80, 29]]], ['armbågsled', [[34, 53], [86, 53]]], ['höftled', [[49, 77], [71, 77]]], ['knäled', [[48, 102], [72, 102]]]];
  for (const [id, pts] of J) for (const [x, y] of pts) out.push(circle(x, y, hl.includes(id) || hl.includes('led') ? 4.4 : 2.6, hl.includes(id) || hl.includes('led') ? HL : BONE, C.ink, 1.6));
  if (arrowFrom && hl[0] !== 'skelett') out.push(pointAt(SK_T[hl[0]!], arrowFrom));
  return all(...out);
}
const SK_T: Record<SkeletonPart, Pt> = {
  skelett: [60, 60], kranium: [66, 8], ryggrad: [63, 60], kota: [63.5, 63], svanskota: [61, 79], bröstkorg: [74, 40], revben: [76, 44], bröstben: [61.4, 40], nyckelben: [72, 25],
  bäcken: [70, 72], höftben: [74, 70], lårben: [72, 92], skenben: [72, 112], led: [72, 102], axelled: [80, 29], höftled: [71, 77], knäled: [72, 102], armbågsled: [86, 53],
};

/** benmärg / benskörhet: a long bone cut open – marrow inside, or a porous (osteoporotic) inside. */
export function boneSection(kind: 'märg' | 'skör'): Svg {
  const out: Svg[] = [];
  const outline = 'M30 22 C22 14 34 4 42 12 C46 8 56 10 54 20 L74 92 C82 92 90 104 82 110 C78 118 66 116 66 108 C60 112 52 106 56 98 L36 28 Z';
  out.push(path(outline, BONE, C.ink, 2.6));
  out.push(path('M42 26 L68 98 C66 102 62 102 60 98 L38 30 Z', kind === 'märg' ? HL : '#efe2c4', C.ink, 1.6));
  if (kind === 'skör') for (const [x, y, r] of [[44, 40, 3], [50, 56, 4], [56, 72, 3.4], [62, 86, 3], [46, 50, 2], [58, 64, 2.2], [52, 80, 2.4], [40, 30, 2]] as const) out.push(circle(x, y, r, HL, C.ink, 1.2));
  return all(...out, kind === 'märg' ? pointAt([54, 64], [96, 50]) : '');
}

// ── Knee joint diagram and joint types ──────────────────────────────────────
export type KneePart = 'ledband' | 'brosk' | 'menisk' | 'korsband' | 'ledvätska' | 'ledkapsel' | 'artros' | 'knäskål';
/** Knee in front view: thigh bone above, shin bone below, cartilage, menisci, ligaments, capsule. */
export function kneeJoint(hl: KneePart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: KneePart) => hl.includes(p);
  const out: Svg[] = [];
  if (has('ledkapsel') || has('ledvätska')) out.push(path('M30 40 C26 56 26 72 32 86 L88 86 C94 72 94 56 90 40 Z', has('ledvätska') ? C.sky : 'none', has('ledkapsel') ? HL : C.sky, has('ledkapsel') ? 4 : 2));
  else out.push(path('M30 40 C26 56 26 72 32 86 L88 86 C94 72 94 56 90 40 Z', 'none', C.grey2, 2, ));
  // femur
  out.push(path('M46 0 L74 0 L76 34 C84 38 88 48 84 58 C78 64 68 60 60 62 C52 60 42 64 36 58 C32 48 36 38 44 34 Z', BONE, C.ink, 2.4));
  // shin bone (tibia) + fibula
  out.push(path('M34 74 C34 70 86 70 86 74 L84 82 C78 86 74 88 72 94 L70 120 L50 120 L48 94 C46 88 42 86 36 82 Z', BONE, C.ink, 2.4), path('M88 86 L94 86 L92 120 L86 120 Z', BONE, C.ink, 2));
  // cartilage caps
  const worn = has('artros');
  out.push(line(worn ? 'M38 59 C44 63 50 62 54 62 M68 62 C74 62 78 61 82 59' : 'M37 58 C46 64 74 64 83 58', has('brosk') || worn ? HL : C.mint, 3.6));
  out.push(line(worn ? 'M38 72 L52 72 M70 72 L82 72' : 'M36 72 C50 70 70 70 84 72', has('brosk') || worn ? HL : C.mint, 3.6));
  if (worn) out.push(line('M56 66 l4 -3 l4 3', C.ink, 1.6), circle(60, 67, 0.1, C.ink));
  // menisci (wedges at the sides)
  out.push(path('M34 66 L50 68 L34 70 Z M86 66 L70 68 L86 70 Z', has('menisk') ? HL : C.lilac, C.ink, 1.4));
  // cruciate ligaments (X in the middle)
  out.push(line('M54 60 L66 74 M66 60 L54 74', has('korsband') ? HL : C.pink, has('korsband') ? 3.6 : 2.4));
  // collateral ligaments (sides)
  out.push(line('M36 50 L34 84 M84 50 L88 84', has('ledband') ? HL : C.pink, has('ledband') ? 4 : 2.6));
  if (arrowFrom) out.push(pointAt(KNEE_T[hl[0]!], arrowFrom));
  return all(...out);
}
const KNEE_T: Record<KneePart, Pt> = { ledband: [86, 68], brosk: [72, 72], menisk: [80, 67], korsband: [62, 67], ledvätska: [88, 78], ledkapsel: [92, 54], artros: [56, 66], knäskål: [60, 50] };

/** gångjärnsled vs kulled: a hinge (bends one way) or a ball-and-socket (turns all ways). */
export function jointType(kind: 'gångjärn' | 'kula'): Svg {
  if (kind === 'gångjärn') return all(
    path('M20 50 L58 50 L58 70 L20 70 Z', BONE, C.ink, 2.4), circle(60, 60, 12, HL, C.ink, 2.4), circle(60, 60, 3, C.ink, null),
    g('rotate(-35 60 60)', path('M62 50 L100 50 L100 70 L62 70 Z', BONE, C.ink, 2.4)),
    path('M96 92 A40 40 0 0 0 100 40', 'none', C.navy, 2.4), path('M100 40 l-6 2 l5 4 Z', C.navy, C.navy, 1.6), path('M96 92 l0 -6 l-5 4 Z', C.navy, C.navy, 1));
  return all(
    path('M30 28 C44 18 76 18 90 28 L84 50 C76 42 44 42 36 50 Z', BONE, C.ink, 2.4),
    circle(60, 58, 16, HL, C.ink, 2.4), path('M54 72 L66 72 L68 112 L52 112 Z', BONE, C.ink, 2.4),
    path('M24 70 A40 30 0 0 0 96 70', 'none', C.navy, 2.2, ), path('M96 70 l-2 -6 l-4 5 Z M24 70 l2 -6 l4 5 Z', C.navy, C.navy, 1.2),
    path('M60 96 m-16 8 a20 8 0 1 0 32 0', 'none', C.navy, 2));
}

// ── Muscles ─────────────────────────────────────────────────────────────────
export type MusclePart = 'muskelgrupp' | 'magmuskel' | 'bröstmuskel' | 'ryggmuskel' | 'sätesmuskel' | 'lårmuskel' | 'vadmuskel' | 'biceps' | 'axelmuskel' | 'muskelmassa';
const FIG_OUT = 'M60 4 C68 4 70 12 68 20 L66 24 C76 26 84 28 86 34 L94 62 L88 64 L80 42 L78 70 L80 82 L78 118 L64 118 L60 86 L56 118 L42 118 L40 82 L42 70 L40 42 L32 64 L26 62 L34 34 C36 28 44 26 54 24 L52 20 C50 12 52 4 60 4 Z';
/** A body in front (back = false) or back view with the muscle groups drawn as soft shapes. */
export function muscles(hl: MusclePart[] = [], view: 'front' | 'back' = 'front', arrowFrom?: Pt): Svg {
  const has = (p: MusclePart) => hl.includes(p) || hl.includes('muskelmassa');
  const m = (d: string, on: boolean) => path(d, on ? HL : '#e9a98b', C.ink, 1.6);
  const out: Svg[] = [path(FIG_OUT, C.skin, C.ink, 2.4)];
  if (view === 'front') {
    out.push(m('M45 30 C52 28 58 30 59 34 L58 42 C52 44 46 42 43 38 Z M75 30 C68 28 62 30 61 34 L62 42 C68 44 74 42 77 38 Z', has('bröstmuskel')));
    for (let r = 0; r < 3; r++) out.push(m(`M52.5 ${46 + r * 7.5} L59 ${46 + r * 7.5} L59 ${52 + r * 7.5} L52.5 ${52 + r * 7.5} Z M61 ${46 + r * 7.5} L67.5 ${46 + r * 7.5} L67.5 ${52 + r * 7.5} L61 ${52 + r * 7.5} Z`, has('magmuskel')));
    out.push(m('M36 32 C40 30 44 32 44 38 L40 48 C36 46 34 40 36 32 Z M84 32 C80 30 76 32 76 38 L80 48 C84 46 86 40 84 32 Z', has('axelmuskel') || has('biceps')));
    out.push(m('M44 84 C50 82 56 84 58 90 L56 104 L46 104 C42 96 42 90 44 84 Z M76 84 C70 82 64 84 62 90 L64 104 L74 104 C78 96 78 90 76 84 Z', has('lårmuskel')));
  } else {
    out.push(m('M44 30 C50 26 58 28 59 36 L58 66 C52 64 46 56 42 46 Z M76 30 C70 26 62 28 61 36 L62 66 C68 64 74 56 78 46 Z', has('ryggmuskel')));
    out.push(m('M42 72 C48 68 58 70 59 76 L58 86 C52 88 44 86 42 80 Z M78 72 C72 68 62 70 61 76 L62 86 C68 88 76 86 78 80 Z', has('sätesmuskel')));
    out.push(m('M44 104 C48 102 54 104 55 108 L54 116 L46 116 C44 112 43 108 44 104 Z M76 104 C72 102 66 104 65 108 L66 116 L74 116 C76 112 77 108 76 104 Z', has('vadmuskel')));
    out.push(m('M44 88 L56 88 L55 100 L45 100 Z M64 88 L76 88 L75 100 L65 100 Z', has('lårmuskel')));
  }
  if (hl.includes('muskelgrupp')) out.push(line('M54 45 C48 50 48 66 54 72 L68 72 C74 66 74 50 68 45 Z', HL, 2.6, '3 3'));
  if (arrowFrom) out.push(pointAt(MUS_T[hl[0]!], arrowFrom));
  return all(...out);
}
const MUS_T: Record<MusclePart, Pt> = { muskelgrupp: [70, 56], magmuskel: [64, 56], bröstmuskel: [72, 36], ryggmuskel: [72, 44], sätesmuskel: [72, 80], lårmuskel: [72, 94], vadmuskel: [72, 110], biceps: [80, 40], axelmuskel: [80, 40], muskelmassa: [72, 40] };

/** sena / muskelfäste / senskida: a muscle that narrows into a tendon fastened to a bone. */
export function tendon(hl: ('sena' | 'muskelfäste' | 'senskida')[] = [], arrowFrom?: Pt): Svg {
  const has = (p: 'sena' | 'muskelfäste' | 'senskida') => hl.includes(p);
  const out: Svg[] = [];
  out.push(bone('M16 96 L104 96', false, 12));
  out.push(path('M10 20 C30 10 60 14 76 30 C82 36 82 44 76 48 C60 50 30 54 10 46 Z', '#e9a98b', C.ink, 2.4), line('M20 26 C40 22 60 26 72 34 M20 38 C40 36 60 38 72 42', C.ink, 1, ));
  if (has('senskida')) out.push(path('M74 40 C80 44 84 56 86 70 L92 70 C90 56 86 42 80 36 Z', 'none', HL, 3.4));
  out.push(path('M76 38 C82 46 86 60 88 84 L92 84 C90 60 86 44 80 34 Z', has('sena') ? HL : '#f6e7d4', C.ink, 2));
  out.push(ellipse(90, 88, 6, 4, has('muskelfäste') ? HL : '#f6e7d4', C.ink, 2));
  if (arrowFrom) out.push(pointAt(hl[0] === 'muskelfäste' ? [90, 88] : hl[0] === 'senskida' ? [84, 54] : [86, 64], arrowFrom));
  return all(...out);
}
