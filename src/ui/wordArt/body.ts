/**
 * Body parts (0.13 pilot: Kroppen & sinnena). A friendly head in front view and in
 * profile on the 120×120 canvas, in the same picture-book style as kit.ts. The part a
 * word names is filled with the accent colour and pointed out with an arrow, so the
 * picture shows *where* – the same drawing with different highlights keeps a family
 * look and makes the distinguishing feature the only difference.
 */
import { C, all, arrow, circle, ellipse, line, path, type Svg } from './kit';

const HL = C.accent;
/** Highlight fill: accent with a slightly heavier outline. */
const hlPath = (d: string, sw = 2.4): Svg => path(d, HL, C.ink, sw);

// ── Front view ──────────────────────────────────────────────────────────────
// Face oval centred at (60, 62), crown at y≈24, chin at y≈96.
export type FrontPart =
  | 'hjässa' | 'panna' | 'tinning' | 'ögonbryn' | 'ögonfrans' | 'ögonlock' | 'näsrygg' | 'näsborre'
  | 'mungipa' | 'smilgrop' | 'haka' | 'käke' | 'kind' | 'öra' | 'läpp' | 'öga' | 'näsa' | 'mun';

const FACE = 'M60 26 C82 26 92 42 92 62 C92 84 78 98 60 98 C42 98 28 84 28 62 C28 42 38 26 60 26 Z';

export function headFront(hl: FrontPart[] = [], opts: { smile?: boolean; eyesClosed?: boolean; arrowFrom?: [number, number]; skin?: string; hairColor?: string; frown?: boolean; skinMarks?: Svg } = {}): Svg {
  const has = (p: FrontPart) => hl.includes(p);
  const out: Svg[] = [];
  const SK = opts.skin ?? C.skin, HC = opts.hairColor ?? C.hair;
  // neck + shoulders
  out.push(path('M50 92 L50 106 C36 108 22 112 16 120 L104 120 C98 112 84 108 70 106 L70 92 Z', SK, C.ink, 2.2));
  out.push(path('M16 120 C22 112 36 108 50 106 C54 110 66 110 70 106 C84 108 98 112 104 120 Z', C.sky, C.ink, 2.2));
  // ears
  for (const [cx, side] of [[28, -1], [92, 1]] as const) {
    out.push(has('öra') ? hlPath(`M${cx} 56 C${cx + side * 9} 52 ${cx + side * 10} 72 ${cx} 72 Z`) : path(`M${cx} 56 C${cx + side * 9} 52 ${cx + side * 10} 72 ${cx} 72 Z`, SK, C.ink, 2.2));
  }
  // face
  out.push(path(FACE, SK, C.ink, 2.4));
  if (opts.skinMarks) out.push(opts.skinMarks);
  // cheeks, jaw, chin, temples, forehead highlights (drawn on the skin, under the features)
  if (has('kind')) out.push(ellipse(42, 72, 8, 6, HL, C.ink, 2), ellipse(78, 72, 8, 6, HL, C.ink, 2));
  if (has('käke')) out.push(line('M30 70 C34 86 46 96 60 98 C74 96 86 86 90 70', HL, 6));
  if (has('haka')) out.push(path('M48 90 C52 99 68 99 72 90 C66 94 54 94 48 90 Z', HL, C.ink, 2));
  if (has('tinning')) out.push(ellipse(33, 50, 4.5, 7, HL, C.ink, 2), ellipse(87, 50, 4.5, 7, HL, C.ink, 2));
  if (has('panna')) out.push(path('M40 38 C50 33 70 33 80 38 L80 46 C70 43 50 43 40 46 Z', HL, C.ink, 2));
  // hair (crown)
  out.push(path('M30 54 C26 30 44 18 60 18 C78 18 94 30 90 54 C86 40 76 34 60 34 C46 34 34 40 30 54 Z', HC, C.ink, 2.2));
  if (has('hjässa')) out.push(hlPath('M40 26 C48 15 72 15 80 26 C70 31 50 31 40 26 Z'));
  // brows
  const brow = (x: number, d: number) => `M${x - 8} ${48 + d} Q${x} ${44 + d} ${x + 8} ${48 + d}`;
  out.push(line(brow(47, 0), has('ögonbryn') ? HL : HC, has('ögonbryn') ? 5.5 : 3), line(brow(73, 0), has('ögonbryn') ? HL : HC, has('ögonbryn') ? 5.5 : 3));
  // eyes
  for (const x of [47, 73]) {
    if (opts.eyesClosed || has('ögonlock')) {
      out.push(has('ögonlock') ? hlPath(`M${x - 7} 58 Q${x} 50 ${x + 7} 58 Q${x} 56 ${x - 7} 58 Z`, 2) : '', line(`M${x - 7} 58 Q${x} 62 ${x + 7} 58`, C.ink, 2.2));
      if (has('ögonfrans')) out.push(line(`M${x - 5} 60 l-1 3 M${x} 61 l0 3.4 M${x + 5} 60 l1 3`, HL, 2.4));
    } else {
      out.push(ellipse(x, 58, 7, 5, C.white, C.ink, 2), circle(x, 58, has('öga') ? 3.6 : 3, has('öga') ? HL : C.ink, has('öga') ? C.ink : null, 1.6));
      if (has('ögonfrans')) out.push(line(`M${x - 6} 55 l-3 -4 M${x - 2} 53.4 l-1 -4.4 M${x + 2} 53.4 l1 -4.4 M${x + 6} 55 l3 -4`, HL, 3));
    }
  }
  // nose
  out.push(has('näsrygg') ? line('M60 52 L58 70', HL, 5.5) : '');
  out.push(line('M60 54 C59 62 57 68 56 71', C.ink, 2), has('näsa') ? hlPath('M60 52 C58 62 52 70 54 74 C58 76 62 76 66 74 C68 70 62 62 60 52 Z', 2) : '');
  out.push(has('näsborre') ? ellipse(56, 73, 2.6, 1.8, HL, C.ink, 1.6) + ellipse(64, 73, 2.6, 1.8, HL, C.ink, 1.6) : ellipse(56, 73, 1.4, 1, C.ink, null) + ellipse(64, 73, 1.4, 1, C.ink, null));
  out.push(line('M53 72 Q60 76 67 72', C.ink, 1.8));
  // mouth
  const smile = !opts.frown && (opts.smile ?? (has('smilgrop') || has('mungipa')));
  if (has('läpp') || has('mun')) out.push(hlPath(smile ? 'M50 81 Q60 90 70 81 Q60 84 50 81 Z' : 'M51 83 Q60 87 69 83 Q60 80 51 83 Z', 2));
  out.push(line(smile ? 'M50 81 Q60 90 70 81' : opts.frown ? 'M51 86 Q60 80 69 86' : 'M51 83 Q60 86 69 83', C.ink, 2.2));
  if (has('mungipa')) out.push(circle(50, 81, 3.2, HL, C.ink, 1.6), circle(70, 81, 3.2, HL, C.ink, 1.6));
  if (has('smilgrop')) out.push(ellipse(45, 83, 3.4, 2.6, HL, C.ink, 1.6), ellipse(75, 83, 3.4, 2.6, HL, C.ink, 1.6));
  if (opts.arrowFrom) out.push(pointer(hl, opts.arrowFrom));
  return all(...out);
}

/** Where the arrow points for a front-view part (one side is enough). */
const FRONT_TARGET: Record<FrontPart, [number, number]> = {
  hjässa: [60, 22], panna: [60, 40], tinning: [87, 50], ögonbryn: [73, 46], ögonfrans: [73, 53], ögonlock: [73, 56], näsrygg: [59, 60],
  näsborre: [64, 73], mungipa: [70, 81], smilgrop: [74, 82], haka: [60, 94], käke: [86, 82], kind: [78, 72], öra: [95, 64], läpp: [60, 84], öga: [73, 58], näsa: [60, 66], mun: [60, 84],
};
function pointer(hl: FrontPart[], from: [number, number]): Svg {
  const t = FRONT_TARGET[hl[0]!];
  if (!t) return '';
  const [fx, fy] = from; const dx = t[0] - fx, dy = t[1] - fy; const len = Math.hypot(dx, dy);
  const k = (len - 7) / len;
  return arrow(fx, fy, fx + dx * k, fy + dy * k, HL, 3.4);
}

// ── Profile (facing right) ───────────────────────────────────────────────────
export type ProfilePart = 'bakhuvud' | 'nacke' | 'tinning' | 'käke' | 'haka' | 'hjässa' | 'panna';
export function headProfile(hl: ProfilePart[] = [], opts: { arrowFrom?: [number, number] } = {}): Svg {
  const has = (p: ProfilePart) => hl.includes(p);
  const out: Svg[] = [];
  // neck + shoulder
  out.push(path('M46 86 L44 106 C34 108 24 112 18 120 L96 120 C92 112 82 108 72 106 L68 90 Z', C.skin, C.ink, 2.2));
  if (has('nacke')) out.push(hlPath('M46 84 C44 92 44 100 44 106 L52 106 C52 98 52 90 54 84 Z'));
  out.push(path('M18 120 C24 112 34 108 44 106 C52 110 66 110 72 106 C82 108 92 112 96 120 Z', C.sky, C.ink, 2.2));
  // head silhouette: back of head left, face right
  const head = 'M40 34 C46 20 64 16 76 22 C86 27 90 36 90 46 L96 58 L90 62 L92 68 L90 72 L91 78 C88 86 80 88 72 88 L68 92 C60 92 50 88 44 84 C34 76 30 52 40 34 Z';
  out.push(path(head, C.skin, C.ink, 2.4));
  if (has('käke')) out.push(line('M56 70 C60 82 66 88 72 88 C78 88 84 87 88 84', HL, 6));
  if (has('haka')) out.push(ellipse(86, 84, 6, 5, HL, C.ink, 2));
  if (has('tinning')) out.push(ellipse(70, 46, 5, 7, HL, C.ink, 2));
  if (has('panna')) out.push(path('M78 26 C86 30 90 38 90 46 L84 46 C84 38 82 32 76 28 Z', HL, C.ink, 2));
  // hair
  out.push(path('M38 40 C36 22 56 12 74 18 C84 22 88 30 88 36 C80 30 70 28 62 32 C56 42 50 50 44 70 C38 62 36 50 38 40 Z', C.hair, C.ink, 2.2));
  if (has('bakhuvud')) out.push(hlPath('M38 38 C34 50 36 62 44 72 C48 60 50 50 54 40 C48 40 42 38 38 38 Z'));
  if (has('hjässa')) out.push(hlPath('M46 20 C56 11 72 11 82 20 C72 25 56 25 46 20 Z'));
  // ear, eye, brow, mouth, nostril
  out.push(path('M56 52 C64 48 66 66 58 66 C54 62 54 56 56 52 Z', C.skin, C.ink, 2));
  out.push(ellipse(82, 50, 2.4, 2.8, C.ink, null), line('M77 44 Q82 41 87 44', C.hair, 2.6));
  out.push(line('M84 78 L90 77', C.ink, 2), ellipse(91, 66, 1.4, 1, C.ink, null));
  if (opts.arrowFrom) {
    const T: Record<ProfilePart, [number, number]> = { bakhuvud: [42, 54], nacke: [48, 96], tinning: [70, 46], käke: [76, 87], haka: [87, 84], hjässa: [64, 16], panna: [86, 36] };
    const t = T[hl[0]!]; const [fx, fy] = opts.arrowFrom; const dx = t[0] - fx, dy = t[1] - fy; const len = Math.hypot(dx, dy); const k = (len - 7) / len;
    out.push(arrow(fx, fy, fx + dx * k, fy + dy * k, HL, 3.4));
  }
  return all(...out);
}

// ── Skull ──────────────────────────────────────────────────────────────────────
export function skull(): Svg {
  return all(
    path('M60 18 C86 18 98 36 98 56 C98 70 92 78 86 82 L86 94 C86 100 80 104 74 104 L46 104 C40 104 34 100 34 94 L34 82 C28 78 22 70 22 56 C22 36 34 18 60 18 Z', C.beige, C.ink, 2.6),
    ellipse(46, 60, 10, 11, C.dark, C.ink, 2), ellipse(74, 60, 10, 11, C.dark, C.ink, 2),
    path('M60 70 L54 82 L66 82 Z', C.dark, C.ink, 2),
    line('M46 92 L46 104 M54 92 L54 104 M62 92 L62 104 M70 92 L70 104', C.ink, 1.8), line('M40 92 L80 92', C.ink, 2),
    line('M60 20 C58 30 62 36 60 44', C.ink, 1.4),
  );
}

/** "ansiktsdrag": the features as a set – eyes, nose and mouth ringed. */
export function faceFeatures(): Svg {
  return all(headFront([], { smile: true }),
    line('M36 58 C36 48 58 48 58 58 C58 66 36 66 36 58 Z M62 58 C62 48 84 48 84 58 C84 66 62 66 62 58 Z', HL, 2.4, '3 3'),
    line('M50 66 C50 60 70 60 70 66 L70 76 C70 80 50 80 50 76 Z', HL, 2.4, '3 3'),
    line('M46 84 C46 78 74 78 74 84 C74 90 46 90 46 84 Z', HL, 2.4, '3 3'));
}
