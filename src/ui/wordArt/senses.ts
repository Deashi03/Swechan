/**
 * The senses (0.13 pilot: Kroppen & sinnena): the eye and the ear as diagrams, sight and
 * hearing aids, and small scenes for touch, smell and taste. Same highlight rule as body.ts.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { headFront, headProfile } from './body';
import { pointAt } from './limbs';

const HL = C.accent;
type Pt = [number, number];

// ── Eye ─────────────────────────────────────────────────────────────────────
export type EyePart = 'pupill' | 'iris' | 'ögonvita' | 'ögonfärg' | 'tårkanal' | 'ögonglob' | 'hornhinna' | 'lins' | 'näthinna' | 'synnerv' | 'ögonhåla';
/** One big eye from the front: white, iris, pupil, lids, tear duct. */
export function eyeFront(hl: EyePart[] = [], arrowFrom?: Pt, o: { iris?: string; squint?: boolean; drop?: boolean; cloudy?: boolean } = {}): Svg {
  const has = (p: EyePart) => hl.includes(p);
  const open = o.squint ? 10 : 26;
  const out: Svg[] = [rect(0, 0, 120, 120, C.skin, 18, null)];
  out.push(path(`M10 60 C30 ${60 - open * 1.6} 90 ${60 - open * 1.6} 110 60 C90 ${60 + open * 1.4} 30 ${60 + open * 1.4} 10 60 Z`, has('ögonvita') ? HL : C.white, C.ink, 2.6));
  const irisFill = has('iris') || has('ögonfärg') ? (o.iris ?? HL) : (o.iris ?? '#5b8fc7');
  out.push(g(`translate(0 0)`, circle(60, 60, Math.min(22, open + 2), irisFill, C.ink, 2.2)));
  if (has('ögonfärg')) out.push(circle(60, 60, Math.min(22, open + 2), 'none', HL, 4));
  out.push(circle(60, 60, Math.min(9, open / 2 + 2), has('pupill') ? HL : C.ink, has('pupill') ? C.ink : null, 2), circle(66, 54, 3, C.white, null));
  if (o.cloudy) out.push(circle(60, 60, 20, 'rgba(235,235,240,0.85)', null));
  out.push(path(`M10 60 C30 ${60 - open * 1.6} 90 ${60 - open * 1.6} 110 60 C90 ${60 - open * 2.2} 30 ${60 - open * 2.2} 10 60 Z`, C.skin, C.ink, 2.6));
  out.push(line(`M30 ${60 - open * 1.2} l-4 -8 M46 ${60 - open * 1.45} l-2 -9 M60 ${60 - open * 1.5} l0 -9 M74 ${60 - open * 1.45} l2 -9 M90 ${60 - open * 1.2} l4 -8`, C.hair, 2.6));
  out.push(path('M8 58 C10 54 16 56 16 60 C16 64 10 66 8 62 Z', has('tårkanal') ? HL : '#f2a7b8', C.ink, 1.6));
  if (o.drop) out.push(path('M52 2 L68 2 L66 14 L54 14 Z', C.white, C.ink, 1.8), path('M60 18 C64 24 64 28 60 30 C56 28 56 24 60 18 Z', C.sky, C.ink, 1.4));
  if (arrowFrom) out.push(pointAt(EYE_T[hl[0]!], arrowFrom));
  return all(...out);
}
const EYE_T: Record<EyePart, Pt> = { pupill: [62, 62], iris: [76, 66], ögonvita: [94, 62], ögonfärg: [78, 70], tårkanal: [12, 60], ögonglob: [60, 60], hornhinna: [30, 60], lins: [40, 60], näthinna: [96, 74], synnerv: [108, 64], ögonhåla: [46, 60] };

/** The eye in section (light comes from the left): cornea, lens, retina, optic nerve. */
export function eyeSection(hl: EyePart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: EyePart) => hl.includes(p);
  return all(
    path('M96 54 L118 50 L118 70 L96 66 Z', has('synnerv') ? HL : C.yellow, C.ink, 2),
    circle(64, 60, 36, has('ögonglob') ? HL : C.white, C.ink, 2.6),
    path('M76 28 A36 36 0 0 1 76 92', 'none', has('näthinna') ? HL : '#e57373', 5),
    path('M30 44 C22 52 22 68 30 76', 'none', has('hornhinna') ? HL : '#9ccbe8', 5),
    path('M34 46 L36 46 L36 54 L34 54 Z M34 66 L36 66 L36 74 L34 74 Z', '#5b8fc7', C.ink, 1.2),
    ellipse(42, 60, 6, 13, has('lins') ? HL : '#cfe6f5', C.ink, 1.8),
    line('M2 50 L42 56 L98 72 M2 70 L42 64 L98 48', C.gold, 1.4, '3 3'),
    arrowFrom ? pointAt(EYE_T[hl[0]!], arrowFrom) : '');
}

// ── Sight ───────────────────────────────────────────────────────────────────
const lens = (cx: number, cy: number, r: number, frame: string, fill = 'rgba(200,230,250,0.55)') => circle(cx, cy, r, fill, frame, 3);
export function glasses(kind: 'glasögon' | 'läsglasögon' | 'båge' | 'kontaktlins'): Svg {
  if (kind === 'kontaktlins') return all(circle(60, 66, 30, C.skin, C.ink, 2), path('M30 60 C50 40 70 40 90 60', 'none', C.ink, 2),
    path('M42 30 C50 22 70 22 78 30 C70 34 50 34 42 30 Z', 'rgba(156,203,232,0.8)', C.navy, 2), g('translate(60 30)', circle(0, -14, 8, C.skin, C.ink, 1.8)), circle(60, 66, 12, '#5b8fc7', C.ink, 1.8), circle(60, 66, 5, C.ink, null));
  const frame = kind === 'båge' ? HL : C.ink;
  const fill = kind === 'båge' ? 'none' : undefined;
  const out: Svg[] = [line('M14 52 L4 44 M106 52 L116 44', frame, 3), lens(34, 60, 20, frame, fill), lens(86, 60, 20, frame, fill), line('M54 56 Q60 50 66 56', frame, 3)];
  if (kind === 'läsglasögon') out.splice(0, 4, line('M16 70 L6 62 M104 70 L114 62', C.ink, 3), path('M16 64 L52 64 L50 82 L18 82 Z M68 64 L104 64 L102 82 L70 82 Z', 'rgba(200,230,250,0.55)', C.ink, 3), line('M52 68 Q60 62 68 68', C.ink, 3), rect(20, 92, 80, 22, C.white, 3, C.ink, 2), line('M28 100 L92 100 M28 107 L80 107', C.grey, 2));
  return all(...out);
}

/** synundersökning: a letter chart. */
export function eyeChart(blur = false): Svg {
  const rows: [number, number, number][] = [[24, 14, 1], [46, 10, 2], [64, 7, 3], [80, 5, 4], [94, 4, 5]];
  const out: Svg[] = [rect(26, 8, 68, 104, C.white, 4, C.ink, 2.4)];
  for (const [y, s, n] of rows) for (let i = 0; i < n; i++) { const x = 60 + (i - (n - 1) / 2) * s * 2; out.push(rect(x - s / 2, y - s / 2, s, s, C.ink, 1, null)); }
  if (blur) return all(...out.slice(0, 1), `<g opacity="0.45">${out.slice(1).map((e) => e.replace('rx="1"', 'rx="4"')).join('')}</g>`, circle(96, 96, 16, 'rgba(255,255,255,0.4)', C.navy, 3), line('M106 106 L116 116', C.navy, 4));
  return all(...out);
}

// ── Ear ─────────────────────────────────────────────────────────────────────
export type EarPart = 'ytteröra' | 'örsnibb' | 'öronvax' | 'hörselgång' | 'trumhinna' | 'mellanöra' | 'hörselben' | 'inneröra' | 'snäcka' | 'balansorgan' | 'öroninflammation';
/** Ear in section: outer ear left, canal, eardrum, middle ear with ossicles, cochlea and balance organ. */
export function earSection(hl: EarPart[] = [], arrowFrom?: Pt, o: { wax?: boolean; plug?: boolean } = {}): Svg {
  const has = (p: EarPart) => hl.includes(p);
  const out: Svg[] = [rect(0, 0, 120, 120, '#f6e3d3', 18, null)];
  out.push(path('M30 10 C6 14 4 44 14 60 C20 72 16 84 22 96 C26 104 36 104 38 94 L40 64 C40 40 44 20 30 10 Z', has('ytteröra') ? HL : C.skin, C.ink, 2.4));
  out.push(path('M22 92 C22 104 34 106 38 96 C34 98 26 98 22 92 Z', has('örsnibb') ? HL : C.skin, C.ink, 2));
  if (has('mellanöra') || has('öroninflammation')) out.push(path('M66 44 L84 44 L84 76 L66 76 Z', has('öroninflammation') ? '#f08a8a' : HL, C.ink, 1.6));
  out.push(path('M38 54 L66 52 L66 66 L38 66 Z', has('hörselgång') ? HL : '#f3d2bd', C.ink, 1.8));
  if (o.wax || has('öronvax')) out.push(ellipse(52, 60, 5, 4, has('öronvax') ? HL : '#c9a227', C.ink, 1.2));
  if (o.plug) out.push(path('M34 54 L48 54 L48 66 L34 66 C30 62 30 58 34 54 Z', C.yellow, C.ink, 1.8));
  out.push(line('M66 50 L66 68', has('trumhinna') ? HL : C.ink, has('trumhinna') ? 5 : 2.4));
  out.push(line('M68 58 L74 54 L78 60 L82 56', has('hörselben') ? HL : C.beige, has('hörselben') ? 4 : 3));
  out.push(path('M92 66 C86 66 84 74 88 80 C92 86 104 84 104 74 C104 64 94 60 88 66', has('snäcka') || has('inneröra') ? HL : '#c7b3e6', C.ink, 2.2));
  out.push(path('M86 52 C84 40 96 36 100 44 C104 52 96 58 90 56', 'none', has('balansorgan') || has('inneröra') ? HL : '#c7b3e6', 4));
  out.push(line('M104 74 L118 82', C.yellow, 3));
  if (arrowFrom) out.push(pointAt(EAR_T[hl[0]!], arrowFrom));
  return all(...out);
}
const EAR_T: Record<EarPart, Pt> = { ytteröra: [26, 40], örsnibb: [30, 98], öronvax: [52, 62], hörselgång: [54, 60], trumhinna: [66, 60], mellanöra: [76, 72], hörselben: [76, 57], inneröra: [96, 72], snäcka: [96, 76], balansorgan: [96, 44], öroninflammation: [76, 72] };

/** Sound waves next to an ear in profile – hörsel, viska, skrika, buller … */
export const waves = (x: number, y: number, n = 3, color: string = C.navy, size = 1): Svg =>
  all(...Array.from({ length: n }, (_, i) => path(`M${x + i * 7 * size} ${y - (8 + i * 5) * size} Q${x + (6 + i * 9) * size} ${y} ${x + i * 7 * size} ${y + (8 + i * 5) * size}`, 'none', color, 2.4)));
export function hearing(kind: 'hörsel' | 'hörapparat' | 'hörselskydd' | 'öronpropp' | 'tinnitus' | 'lomhörd'): Svg {
  const head = headProfile([]);
  const ear: Pt = [58, 58];
  const out: Svg[] = [g('translate(120 0) scale(-1 1)', head)];
  const ex = 120 - ear[0];
  if (kind === 'hörsel') out.push(g(`translate(${ex - 46} ${ear[1]}) scale(-1 1)`, waves(-40, 0, 3, HL)));
  if (kind === 'hörapparat') out.push(path(`M${ex - 2} 46 C${ex + 8} 44 ${ex + 10} 56 ${ex + 4} 60 L${ex} 62 Z`, HL, C.ink, 2), circle(ex - 1, 60, 3, HL, C.ink, 1.4));
  if (kind === 'hörselskydd') out.push(path('M58 18 C60 4 80 4 82 18', 'none', C.ink, 5), path('M50 46 C50 38 70 38 70 46 L70 70 C70 78 50 78 50 70 Z', HL, C.ink, 2.4));
  if (kind === 'öronpropp') out.push(ellipse(ex, 60, 4.4, 3.4, HL, C.ink, 1.6), pointAt([ex, 60], [ex - 40, 100]));
  if (kind === 'tinnitus') out.push(path(`M14 40 l6 6 l-6 6 l6 6 l-6 6`, 'none', HL, 2.6), path(`M24 30 l4 4 l-4 4 l4 4`, 'none', HL, 2.2));
  if (kind === 'lomhörd') out.push(g(`translate(${ex - 46} ${ear[1]}) scale(-1 1)`, waves(-40, 0, 3, C.grey2)), line(`M14 40 L34 76`, HL, 3));
  return all(...out);
}

/** Level meter (ljudnivå / decibel): bars from green to red. */
export function levelMeter(peak = 6, unit = false): Svg {
  const out: Svg[] = [];
  for (let i = 0; i < 8; i++) { const h = 12 + i * 10; const col = i < 3 ? C.green : i < 6 ? C.yellow : C.red; out.push(rect(14 + i * 12, 108 - h, 9, h, i < peak ? col : C.grey2, 2, C.ink, 1.4)); }
  if (unit) out.push(`<text x="20" y="28" font-family="system-ui,sans-serif" font-weight="800" font-size="20" fill="${C.navy}">dB</text>`);
  return all(...out);
}

// ── Touch, smell, taste ─────────────────────────────────────────────────────
/** A nose in profile with smell lines coming in – luktsinne, sniffa, lukta … */
export function smell(kind: 'luktsinne' | 'stank' | 'matlukt' | 'luktfri' | 'täppt' | 'illaluktande'): Svg {
  const out: Svg[] = [headProfile([])];
  const lines = (color: string, dash?: string) => line('M118 40 C108 46 116 52 104 58 M118 56 C110 60 116 66 102 66 M116 72 C108 74 112 80 100 74', color, 2.6, dash);
  if (kind === 'luktsinne') out.push(lines(HL), path('M90 60 L98 60 L92 70 Z', HL, C.ink, 1.6));
  if (kind === 'matlukt') out.push(lines(C.orange), rect(100, 92, 18, 10, C.white, 3, C.ink, 1.6), path('M98 92 C98 84 120 84 120 92 Z', C.white, C.ink, 1.6));
  if (kind === 'stank' || kind === 'illaluktande') out.push(lines(C.green), path('M100 96 L118 96 L116 118 L102 118 Z', C.grey, C.ink, 2), line('M106 100 l0 14 M112 100 l0 14', C.dark, 1.4), path('M104 84 l3 -6 l3 6', 'none', C.green, 2));
  if (kind === 'luktfri') out.push(lines(C.grey2, '2 4'));
  if (kind === 'täppt') out.push(path('M90 60 L98 60 L92 70 Z', '#d0d6dd', C.ink, 1.6), line('M100 52 L114 66 M114 52 L100 66', C.red, 3));
  return all(...out);
}

/** A tongue / mouth for taste words. */
export function taste(kind: 'smaksinne' | 'bismak' | 'vattnas'): Svg {
  const out: Svg[] = [path('M20 40 C30 20 90 20 100 40 C104 60 94 90 60 100 C26 90 16 60 20 40 Z', '#c0392b', C.ink, 2.4), path('M34 50 C40 40 80 40 86 50 C90 70 80 90 60 94 C40 90 30 70 34 50 Z', '#f08a8a', C.ink, 2)];
  if (kind === 'smaksinne') for (const [x, y] of [[50, 58], [60, 54], [70, 58], [54, 68], [66, 68], [60, 78], [46, 70], [74, 70]] as const) out.push(circle(x, y, 2.6, HL, C.ink, 0.8));
  if (kind === 'bismak') out.push(line('M60 50 L60 86', C.ink, 1.4), circle(72, 76, 6, C.green, C.ink, 1.4), path('M96 14 l4 6 l-8 0 Z', C.green, C.ink, 1.2));
  if (kind === 'vattnas') out.push(path('M30 92 C34 100 34 106 30 108 C26 106 26 100 30 92 Z M90 92 C94 100 94 106 90 108 C86 106 86 100 90 92 Z', C.sky, C.ink, 1.4));
  return all(...out);
}

/** A fingertip touching a surface – känsel, beröring, fingertoppskänsla … */
export function touch(kind: 'känsel' | 'beröring' | 'fingertoppskänsla' | 'stickig' | 'hetta' | 'kittlig'): Svg {
  const finger = path('M40 0 L60 0 L62 66 C62 76 40 76 38 66 Z', C.skin, C.ink, 2.4);
  const nail = path('M42 56 C42 50 58 50 58 56 L58 64 L42 64 Z', C.rose, C.ink, 1.2);
  const out: Svg[] = [];
  const surface = kind === 'stickig' ? all(path('M0 86 L120 86 L120 120 L0 120 Z', C.grey2, C.ink, 2), line('M4 86 l3 -8 l3 8 M16 86 l3 -8 l3 8 M28 86 l3 -8 l3 8 M64 86 l3 -8 l3 8 M76 86 l3 -8 l3 8 M88 86 l3 -8 l3 8 M100 86 l3 -8 l3 8', C.ink, 1.6))
    : kind === 'hetta' ? all(path('M0 86 L120 86 L120 120 L0 120 Z', C.red, C.ink, 2), line('M80 76 C84 70 78 64 82 56 M94 76 C98 70 92 64 96 56', C.orange, 2.4))
    : kind === 'kittlig' ? '' : path('M0 86 L120 86 L120 120 L0 120 Z', C.beige, C.ink, 2);
  out.push(surface);
  if (kind === 'kittlig') return all(headFront([], { smile: true, eyesClosed: true }), path('M100 70 C88 74 80 84 84 96 C90 92 94 84 100 70 Z', C.white, C.ink, 1.8), line('M84 96 L76 110', C.ink, 2), line('M14 50 l-6 -4 M14 60 l-8 0 M106 50 l6 -4', HL, 2.4));
  out.push(g('translate(10 12)', finger, nail));
  if (kind === 'känsel' || kind === 'fingertoppskänsla') out.push(path('M50 80 a14 6 0 1 0 0.1 0', 'none', HL, 2.4), path('M50 80 a24 10 0 1 0 0.1 0', 'none', HL, 1.6));
  if (kind === 'fingertoppskänsla') out.push(circle(86, 30, 14, 'rgba(255,255,255,0.4)', C.navy, 3), line('M96 40 L108 52', C.navy, 4));
  if (kind === 'beröring') out.push(path('M90 30 L104 16 M96 40 L114 34 M84 22 L86 6', 'none', HL, 2.6));
  return all(...out);
}
