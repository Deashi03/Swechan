/**
 * Arms, hands, legs, feet and the trunk (0.13 pilot: Kroppen & sinnena). Same rule as
 * body.ts: one drawing per view, the named part filled with the accent colour and
 * pointed out with an arrow, so related words differ only in the highlight.
 */
import { C, all, arrow, circle, ellipse, g, line, path, type Svg } from './kit';

const HL = C.accent;
const fillOf = (on: boolean, base: string = C.skin) => (on ? HL : base);
type Pt = [number, number];

/** Arrow from `from` that stops just short of `to`. */
export function pointAt(to: Pt, from: Pt): Svg {
  const dx = to[0] - from[0], dy = to[1] - from[1]; const len = Math.hypot(dx, dy); const k = (len - 6) / len;
  return arrow(from[0], from[1], +(from[0] + dx * k).toFixed(1), +(from[1] + dy * k).toFixed(1), HL, 3.4);
}

/** A finger as a capsule standing on (x, base), rotated about its base. */
function finger(x: number, base: number, w: number, h: number, rot: number, fill: string, tip = false, joints = false, nail = false): Svg {
  const r = w / 2, top = base - h;
  const body = path(`M${x - r} ${base} L${x - r} ${top + r} A${r} ${r} 0 0 1 ${x + r} ${top + r} L${x + r} ${base} Z`, fill, C.ink, 2.2);
  const extra: Svg[] = [];
  if (tip) extra.push(path(`M${x - r} ${top + r + 3} L${x - r} ${top + r} A${r} ${r} 0 0 1 ${x + r} ${top + r} L${x + r} ${top + r + 3} Z`, HL, C.ink, 2));
  if (joints) extra.push(line(`M${x - r + 1.5} ${top + h * 0.36} l${w - 3} 0 M${x - r + 1.5} ${top + h * 0.66} l${w - 3} 0`, C.skin2, 1.6));
  if (nail) extra.push(path(`M${x - r + 2} ${top + r + 4} L${x - r + 2} ${top + r} A${r - 2} ${r - 2} 0 0 1 ${x + r - 2} ${top + r} L${x + r - 2} ${top + r + 4} Z`, C.rose, C.ink, 1.2));
  return g(`rotate(${rot} ${x} ${base})`, body, ...extra);
}

// ── Hand, palm side ─────────────────────────────────────────────────────────
export type HandPart = 'handflata' | 'handled' | 'fingertopp' | 'pekfinger' | 'långfinger' | 'ringfinger' | 'lillfinger' | 'tumme' | 'fingerled' | 'handrygg' | 'knoge';
const FINGERS: { id: HandPart; x: number; h: number; rot: number }[] = [
  { id: 'pekfinger', x: 46, h: 34, rot: -8 }, { id: 'långfinger', x: 58, h: 38, rot: -1 },
  { id: 'ringfinger', x: 70, h: 35, rot: 6 }, { id: 'lillfinger', x: 81, h: 27, rot: 14 },
];
const PALM = 'M40 62 C40 56 86 56 86 62 L84 86 C82 96 74 100 62 100 C50 100 42 94 40 84 Z';

export function handPalm(hl: HandPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: HandPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M50 96 L48 120 L76 120 L74 96 Z', fillOf(false), C.ink, 2.2)); // forearm
  if (has('handled')) out.push(path('M49 98 L48.6 106 L75.4 106 L75 98 Z', HL, C.ink, 2));
  for (const f of FINGERS) out.push(finger(f.x, 64, 11, f.h, f.rot, fillOf(has(f.id)), has('fingertopp'), true));
  out.push(finger(38, 88, 12, 28, -52, fillOf(has('tumme')), has('fingertopp'), false)); // thumb
  out.push(path(PALM, fillOf(has('handflata')), C.ink, 2.4));
  out.push(line('M46 72 C56 76 70 74 82 68 M46 82 C54 78 62 80 70 88', has('handflata') ? C.ink : C.skin2, 1.6)); // palm lines
  if (has('fingerled')) out.push(circle(58, 39, 3, HL, C.ink, 1.4), circle(58, 51, 3, HL, C.ink, 1.4), circle(46.6, 43, 3, HL, C.ink, 1.4), circle(70.4, 42, 3, HL, C.ink, 1.4));
  if (arrowFrom) out.push(pointAt(HAND_T[hl[0]!] ?? [60, 80], arrowFrom));
  return all(...out);
}
const HAND_T: Partial<Record<HandPart, Pt>> = {
  handflata: [64, 82], handled: [62, 102], fingertopp: [59, 30], pekfinger: [48, 42], långfinger: [58, 34], ringfinger: [72, 40], lillfinger: [84, 46],
  tumme: [30, 72], fingerled: [58, 51], handrygg: [64, 80], knoge: [70, 60],
};

// ── Hand, back side (nails and knuckles) ────────────────────────────────────
export function handBack(hl: HandPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: HandPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M50 96 L48 120 L76 120 L74 96 Z', C.skin, C.ink, 2.2));
  if (has('handled')) out.push(path('M49 98 L48.6 106 L75.4 106 L75 98 Z', HL, C.ink, 2));
  for (const f of FINGERS) out.push(finger(f.x, 64, 11, f.h, f.rot, fillOf(has(f.id)), false, false, true));
  out.push(finger(38, 88, 12, 28, -52, fillOf(has('tumme')), false, false, true));
  out.push(path(PALM, fillOf(has('handrygg')), C.ink, 2.4));
  out.push(line('M52 70 L54 88 M60 70 L60 90 M68 70 L66 88', has('handrygg') ? C.ink : C.skin2, 1.4)); // tendons
  for (const f of FINGERS) out.push(ellipse(f.x + f.rot * 0.2, 63, 4.4, 3, has('knoge') ? HL : C.skin2, has('knoge') ? C.ink : null, 1.4));
  if (arrowFrom) out.push(pointAt(HAND_T[hl[0]!] ?? [60, 80], arrowFrom));
  return all(...out);
}

/** knytnäve: a clenched fist seen from the front, knuckles on top. */
export function fist(hl: ('knytnäve' | 'knoge')[] = [], arrowFrom?: Pt): Svg {
  const whole = hl.includes('knytnäve'), kn = hl.includes('knoge');
  const out: Svg[] = [];
  out.push(path('M48 92 L46 120 L76 120 L74 92 Z', C.skin, C.ink, 2.2));
  out.push(path('M34 52 C34 42 86 40 88 50 L90 82 C90 94 78 98 62 98 C46 98 34 94 34 82 Z', fillOf(whole), C.ink, 2.6));
  for (const x of [42, 54, 66, 78]) out.push(path(`M${x - 6} 50 C${x - 6} 42 ${x + 6} 42 ${x + 6} 50 L${x + 6} 66 C${x + 6} 70 ${x - 6} 70 ${x - 6} 66 Z`, fillOf(whole), C.ink, 2));
  for (const x of [42, 54, 66, 78]) out.push(ellipse(x, 47, 4, 2.8, kn ? HL : C.skin2, kn ? C.ink : null, 1.4));
  out.push(path('M34 70 C40 64 56 66 66 72 C64 78 52 80 38 80 Z', fillOf(whole), C.ink, 2.2)); // thumb across
  if (arrowFrom) out.push(pointAt(kn ? [66, 46] : [60, 84], arrowFrom));
  return all(...out);
}

// ── Arm (flexed, side view) ─────────────────────────────────────────────────
export type ArmPart = 'överarm' | 'underarm' | 'armhåla' | 'armbåge' | 'axel' | 'biceps' | 'triceps' | 'axelled' | 'musarm' | 'tennisarmbåge';
export function armFlex(hl: ArmPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: ArmPart) => hl.includes(p);
  const out: Svg[] = [];
  // trunk edge + shoulder
  out.push(path('M0 40 C14 34 26 34 34 42 L38 120 L0 120 Z', C.sky, C.ink, 2.2));
  out.push(path('M18 38 C30 30 42 34 44 46 C44 56 36 60 28 58 Z', fillOf(has('axel')), C.ink, 2.2));
  if (has('armhåla')) out.push(path('M30 56 C34 62 34 70 30 74 C26 70 26 62 30 56 Z', HL, C.ink, 2));
  // upper arm (shoulder → elbow at 84,64), biceps bulge on top
  const up = 'M30 46 C46 36 66 40 82 52 C90 58 90 72 82 74 C66 76 48 74 32 68 Z';
  out.push(path(up, fillOf(has('överarm')), C.ink, 2.4));
  if (has('biceps')) out.push(path('M42 46 C52 34 70 38 78 50 C66 54 52 54 42 46 Z', HL, C.ink, 2));
  if (has('triceps')) out.push(path('M38 66 C52 74 70 76 80 72 C70 68 52 66 38 66 Z', HL, C.ink, 2));
  // forearm (elbow → wrist at 82,18) and fist
  const fore = 'M76 54 C74 40 74 28 76 18 L92 18 C94 30 94 46 92 64 Z';
  out.push(path(fore, fillOf(has('underarm') || has('musarm')), C.ink, 2.4));
  out.push(path('M72 2 C72 -2 98 -2 98 6 L98 18 C98 24 72 24 72 18 Z', C.skin, C.ink, 2.2));
  out.push(line('M76 8 l18 0 M76 13 l18 0', C.skin2, 1.4));
  const elbowOn = has('armbåge') || has('tennisarmbåge');
  out.push(circle(88, 68, elbowOn ? 6 : 0.1, elbowOn ? HL : C.skin, elbowOn ? C.ink : null, 2));
  if (has('axelled')) out.push(circle(32, 46, 6, HL, C.ink, 2));
  if (arrowFrom) out.push(pointAt(ARM_T[hl[0]!], arrowFrom));
  return g('translate(0 12)', ...out);
}
const ARM_T: Record<ArmPart, Pt> = {
  överarm: [58, 60], underarm: [84, 36], armhåla: [30, 66], armbåge: [88, 68], axel: [32, 40], biceps: [60, 44], triceps: [60, 72], axelled: [32, 46], musarm: [84, 36], tennisarmbåge: [88, 68],
};

// ── Leg (side view, facing right) ───────────────────────────────────────────
export type LegPart = 'lår' | 'knä' | 'knäskål' | 'knäveck' | 'smalben' | 'vad' | 'vrist' | 'fotled' | 'häl' | 'fot' | 'knäled' | 'lårmuskel' | 'vadmuskel' | 'hälsena';
export function legSide(hl: LegPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: LegPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M34 0 L76 0 L74 22 L36 22 Z', C.denim, C.ink, 2.2)); // shorts
  out.push(path('M38 22 L74 22 C74 36 70 46 68 52 L44 52 C40 42 38 32 38 22 Z', fillOf(has('lår')), C.ink, 2.4));
  if (has('lårmuskel')) out.push(path('M56 24 C70 26 72 40 66 50 C60 44 56 34 56 24 Z', HL, C.ink, 2));
  // lower leg: shin (front, right) straight; calf (back, left) bulges
  out.push(path('M44 52 L68 52 C68 66 64 80 62 92 L52 92 C48 82 40 70 44 52 Z', fillOf(has('smalben')), C.ink, 2.4));
  if (has('vad') || has('vadmuskel')) out.push(path('M44 54 C38 66 44 78 52 86 C52 74 52 62 50 54 Z', HL, C.ink, 2));
  if (has('hälsena')) out.push(path('M50 82 L54 82 L54 98 L49 98 Z', HL, C.ink, 1.8));
  if (has('vrist')) out.push(path('M52 84 L62.8 84 L62.3 92 L52 92 Z', HL, C.ink, 1.8));
  // foot
  out.push(path('M50 92 L64 92 C70 96 90 98 96 104 C98 108 96 110 92 110 L52 110 C46 110 46 100 50 92 Z', fillOf(has('fot')), C.ink, 2.4));
  if (has('häl')) out.push(path('M47 100 C46 108 50 110 56 110 L58 110 C58 104 54 100 47 100 Z', HL, C.ink, 2));
  if (has('fotled')) out.push(circle(57, 95, 4.5, HL, C.ink, 1.8));
  if (has('knäskål')) out.push(ellipse(69, 51, 5, 6.5, HL, C.ink, 2));
  else out.push(line('M66 46 C70 48 70 54 66 56', C.skin2, 1.6));
  if (has('knäveck')) out.push(path('M42 46 C46 50 46 54 42 58 C40 54 40 50 42 46 Z', HL, C.ink, 2));
  if (has('knä') || has('knäled')) out.push(circle(57, 52, 9, has('knäled') ? HL : 'none', HL, has('knäled') ? 2 : 3.4));
  if (arrowFrom) out.push(pointAt(LEG_T[hl[0]!], arrowFrom));
  return all(...out);
}
const LEG_T: Record<LegPart, Pt> = {
  lår: [56, 36], knä: [57, 52], knäskål: [70, 51], knäveck: [42, 52], smalben: [62, 72], vad: [44, 68], vrist: [58, 88], fotled: [57, 95], häl: [50, 106], fot: [80, 104],
  knäled: [57, 52], lårmuskel: [64, 36], vadmuskel: [44, 68], hälsena: [52, 92],
};

// ── Foot close-up (side) and toes (top) ─────────────────────────────────────
export type FootPart = 'häl' | 'fotsula' | 'fotvalv' | 'tå' | 'stortå' | 'lilltå' | 'plattfot' | 'tånagel';
export function footSide(hl: FootPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: FootPart) => hl.includes(p);
  const out: Svg[] = [line('M4 100 L116 100', C.grey, 2)];
  out.push(path('M22 10 L44 10 L46 58 L22 58 Z', C.skin, C.ink, 2.4)); // ankle
  // foot with arch: sole touches at heel and ball, rises in between
  out.push(path('M20 56 L48 56 C60 62 88 70 104 80 C112 86 110 98 102 98 L82 98 C72 98 64 90 50 90 C42 90 38 98 30 98 C18 98 14 86 16 74 Z', C.skin, C.ink, 2.6));
  if (has('fotsula')) out.push(line('M24 98 C36 98 42 90 50 90 C64 90 72 98 82 98 L102 98', HL, 6));
  if (has('fotvalv')) out.push(path('M38 96 C42 90 48 88 54 88 C64 88 70 94 76 96 C66 92 50 92 38 96 Z', HL, C.ink, 2.4), line('M40 99 C48 92 62 92 74 99', HL, 4));
  if (has('häl')) out.push(path('M16 74 C14 88 20 98 30 98 C36 98 38 94 40 90 C32 88 24 82 16 74 Z', HL, C.ink, 2.2));
  if (has('tå')) out.push(path('M96 76 C108 80 112 90 108 96 L96 98 C98 90 98 82 96 76 Z', HL, C.ink, 2.2));
  out.push(line('M98 92 l6 0', C.ink, 1.4), ellipse(26, 40, 4, 4, C.skin2, null));
  if (arrowFrom) out.push(pointAt(FOOT_T[hl[0]!], arrowFrom));
  return all(...out);
}
const FOOT_T: Record<FootPart, Pt> = { häl: [24, 90], fotsula: [90, 98], fotvalv: [56, 90], tå: [104, 88], stortå: [44, 34], lilltå: [86, 50], plattfot: [86, 70], tånagel: [44, 30] };

/** Toes seen from above (right foot): stortå, the toes, lilltå. */
export function toesTop(hl: FootPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: FootPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M30 48 C30 40 90 40 92 52 C96 72 92 100 84 120 L38 120 C32 100 28 70 30 48 Z', C.skin, C.ink, 2.6));
  const toes: [number, number, number, number, FootPart | null][] = [[44, 40, 9, 11, 'stortå'], [60, 40, 6, 8, null], [71, 43, 5.4, 7, null], [80, 48, 5, 6.4, null], [87, 55, 4.4, 5.6, 'lilltå']];
  for (const [x, y, rx, ry, id] of toes) {
    const on = has('tå') || (id !== null && has(id));
    out.push(ellipse(x, y, rx, ry, on ? HL : C.skin, C.ink, 2.2));
    out.push(ellipse(x, y - ry * 0.35, rx * 0.55, ry * 0.4, has('tånagel') ? HL : C.rose, C.ink, 1.1));
  }
  if (arrowFrom) out.push(pointAt(has('tå') ? [60, 34] : FOOT_T[hl[0]!], arrowFrom));
  return all(...out);
}

/** plattfot vs a normal foot: two footprints, the flat one (no gap at the arch) highlighted. */
export function footprints(flatHighlighted = true): Svg {
  const normal = 'M34 18 C46 16 52 26 50 40 C48 54 42 58 44 70 C46 82 50 92 42 102 C34 108 24 104 24 92 C24 78 30 66 28 52 C26 38 22 20 34 18 Z';
  const flat = 'M86 18 C98 16 104 26 104 40 C104 56 100 66 100 78 C100 90 102 96 94 104 C86 108 74 104 74 92 C74 78 76 66 74 52 C72 38 74 20 86 18 Z';
  return all(
    path(normal, C.grey2, C.ink, 2.2), path(flat, flatHighlighted ? HL : C.grey2, C.ink, 2.4),
    ...[[30, 10], [38, 8], [45, 10], [50, 14]].map(([x, y]) => circle(x!, y!, 3, C.grey2, C.ink, 1.4)),
    ...[[80, 10], [88, 8], [95, 10], [100, 14]].map(([x, y]) => circle(x!, y!, 3, flatHighlighted ? HL : C.grey2, C.ink, 1.4)),
  );
}

// ── Whole body: front, back, side ───────────────────────────────────────────
export type TrunkPart = 'bröst' | 'höft' | 'midja' | 'överkropp' | 'underkropp' | 'bål' | 'navel' | 'buk' | 'ljumske' | 'skulderblad' | 'korsrygg' | 'ländrygg' | 'rumpa' | 'svank' | 'axlar';
const HEAD = (cx: number) => all(circle(cx, 14, 10, C.skin, C.ink, 2.2), path(`M${cx - 10} 12 C${cx - 10} 0 ${cx + 10} 0 ${cx + 10} 12 C${cx + 6} 7 ${cx - 6} 7 ${cx - 10} 12 Z`, C.hair, C.ink, 1.8));
const TORSO = 'M42 30 L78 30 C84 32 86 36 84 44 L80 62 C80 68 82 72 82 76 L38 76 C38 72 40 68 40 62 L36 44 C34 36 36 32 42 30 Z';

export function bodyFront(hl: TrunkPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: TrunkPart) => hl.includes(p);
  const out: Svg[] = [];
  // arms
  out.push(path('M36 34 C30 36 28 46 26 60 L24 80 L31 80 L34 62 L38 46 Z', fillOf(false), C.ink, 2.2), path('M84 34 C90 36 92 46 94 60 L96 80 L89 80 L86 62 L82 46 Z', fillOf(false), C.ink, 2.2));
  // legs
  out.push(path('M40 88 L58 88 L56 120 L42 120 Z', C.skin, C.ink, 2.2), path('M62 88 L80 88 L78 120 L64 120 Z', C.skin, C.ink, 2.2));
  out.push(path('M58 25 L62 25 L63 31 L57 31 Z', C.skin, C.ink, 1.8));
  // trunk with region highlights
  const upper = has('överkropp') || has('bål');
  out.push(path(TORSO, fillOf(upper), C.ink, 2.4));
  if (has('bröst')) out.push(path('M42 36 C50 34 70 34 78 36 L77 50 C70 53 50 53 43 50 Z', HL, C.ink, 2));
  if (has('buk')) out.push(path('M43 54 C52 56 68 56 77 54 L78 72 L42 72 Z', HL, C.ink, 2));
  if (has('midja')) out.push(path('M40 60 L80 60 L80 66 L40 66 Z', HL, C.ink, 2));
  out.push(line('M50 44 Q54 47 58 44 M62 44 Q66 47 70 44', C.skin2, 1.4));
  out.push(circle(60, 62, has('navel') ? 3.4 : 1.6, has('navel') ? HL : C.skin2, has('navel') ? C.ink : null, 1.6));
  // swim shorts (underkropp: shorts + legs)
  out.push(path('M38 74 L82 74 L82 92 L62 92 L60 86 L58 92 L38 92 Z', has('underkropp') ? HL : C.denim, C.ink, 2.2));
  if (has('underkropp')) out.push(path('M40 92 L58 92 L56 120 L42 120 Z M62 92 L80 92 L78 120 L64 120 Z', HL, C.ink, 2));
  if (has('höft')) out.push(ellipse(38, 76, 5, 8, HL, C.ink, 2), ellipse(82, 76, 5, 8, HL, C.ink, 2));
  if (has('ljumske')) out.push(line('M46 78 L58 88 M74 78 L62 88', HL, 4.4));
  if (has('axlar')) out.push(ellipse(38, 33, 6, 4, HL, C.ink, 2), ellipse(82, 33, 6, 4, HL, C.ink, 2));
  out.push(HEAD(60));
  if (arrowFrom) out.push(pointAt(TRUNK_T[hl[0]!], arrowFrom));
  return all(...out);
}

export function bodyBack(hl: TrunkPart[] = [], arrowFrom?: Pt): Svg {
  const has = (p: TrunkPart) => hl.includes(p);
  const out: Svg[] = [];
  out.push(path('M36 34 C30 36 28 46 26 60 L24 80 L31 80 L34 62 L38 46 Z', C.skin, C.ink, 2.2), path('M84 34 C90 36 92 46 94 60 L96 80 L89 80 L86 62 L82 46 Z', C.skin, C.ink, 2.2));
  out.push(path('M40 88 L58 88 L56 120 L42 120 Z', C.skin, C.ink, 2.2), path('M62 88 L80 88 L78 120 L64 120 Z', C.skin, C.ink, 2.2));
  out.push(path('M58 25 L62 25 L63 31 L57 31 Z', C.skin, C.ink, 1.8));
  out.push(path(TORSO, fillOf(has('bål')), C.ink, 2.4));
  if (has('skulderblad')) out.push(path('M44 36 L56 38 L52 54 Z', HL, C.ink, 2), path('M76 36 L64 38 L68 54 Z', HL, C.ink, 2));
  else out.push(line('M46 38 L54 40 L51 52 M74 38 L66 40 L69 52', C.skin2, 1.4));
  if (has('ländrygg')) out.push(path('M48 56 L72 56 L72 68 L48 68 Z', HL, C.ink, 2));
  if (has('korsrygg')) out.push(path('M50 66 L70 66 L60 80 Z', HL, C.ink, 2));
  out.push(line('M60 32 L60 70', C.skin2, 1.6)); // spine
  // shorts with seat
  const seat = has('rumpa');
  out.push(path('M38 74 L82 74 L82 92 L62 92 L60 86 L58 92 L38 92 Z', seat ? HL : C.denim, C.ink, 2.2), line('M60 76 L60 88', C.ink, 1.6));
  out.push(circle(60, 14, 10, C.skin, C.ink, 2.2), path('M50 14 C48 2 72 2 70 14 C70 20 50 20 50 14 Z', C.hair, C.ink, 1.8));
  if (arrowFrom) out.push(pointAt(TRUNK_T[hl[0]!], arrowFrom));
  return all(...out);
}

/** Side view (facing right) – for svank (the hollow of the lower back) and posture words. */
export function bodySide(hl: TrunkPart[] = [], arrowFrom?: Pt): Svg {
  const out: Svg[] = [];
  out.push(path('M52 90 L67 90 L66 120 L54 120 Z', C.skin, C.ink, 2.2));
  out.push(path('M56 28 C48 34 47 48 51 57 C54 64 51 70 46 78 C44 86 48 92 54 92 L68 92 C70 80 72 70 70 60 C74 50 74 38 66 28 Z', C.sky, C.ink, 2.4));
  out.push(path('M47 76 C44 84 47 92 54 92 L68 92 C69 86 70 80 70 76 Z', C.denim, C.ink, 2.2));
  if (hl.includes('svank')) out.push(line('M51 56 C54 63 52 69 48 74', HL, 5.5));
  out.push(path('M58 32 C64 34 66 50 66 68 L60 68 C60 52 58 42 56 36 Z', C.skin, C.ink, 2)); // arm
  out.push(path('M57 22 L65 22 L66 30 L56 30 Z', C.skin, C.ink, 1.8));
  out.push(circle(62, 15, 10, C.skin, C.ink, 2.2), path('M52 16 C50 4 68 2 72 12 C66 10 58 12 56 22 Z', C.hair, C.ink, 1.8));
  if (arrowFrom) out.push(pointAt([50, 64], arrowFrom));
  return all(...out);
}
const TRUNK_T: Record<TrunkPart, Pt> = {
  bröst: [60, 42], höft: [84, 76], midja: [80, 63], överkropp: [70, 46], underkropp: [72, 98], bål: [66, 50], navel: [60, 62], buk: [66, 64], ljumske: [70, 82],
  skulderblad: [70, 44], korsrygg: [60, 72], ländrygg: [68, 62], rumpa: [70, 84], svank: [50, 64], axlar: [82, 33],
};

// ── Small scenes for symbol words ───────────────────────────────────────────
/** högerhänt / vänsterhänt: two hands on a sheet, the writing hand (with the pen) highlighted. */
export function writingHand(side: 'right' | 'left'): Svg {
  const writer = all(
    path('M70 120 L78 84 L96 84 L100 120 Z', C.sky, C.ink, 2.2),
    path('M74 86 C70 74 74 64 84 62 C94 60 100 68 98 80 L96 86 Z', HL, C.ink, 2.4),
    path('M76 66 L58 46 L62 42 L80 62 Z', C.yellow, C.ink, 2), path('M58 46 L54 40 L62 42 Z', C.ink, C.ink, 1.2),
  );
  const rest = all(path('M10 120 L20 92 L38 92 L40 120 Z', C.sky, C.ink, 2.2), path('M18 94 C16 84 22 78 30 78 C38 78 42 84 40 94 Z', C.skin, C.ink, 2.2));
  const sheet = all(path('M24 22 L96 16 L100 70 L28 76 Z', C.white, C.ink, 2.2), line('M34 32 L88 28 M35 42 L76 39 M36 52 L60 50', C.grey, 2), line('M44 46 C48 40 52 50 56 44', C.navy, 2));
  const both = all(sheet, rest, writer);
  return side === 'right' ? both : g('translate(120 0) scale(-1 1)', both);
}

/** barfota: bare feet on the grass, the shoes left beside them. */
export function barefoot(): Svg {
  const foot = (x: number) => all(path(`M${x} 40 C${x + 16} 36 ${x + 20} 56 ${x + 17} 78 C${x + 15} 98 ${x + 1} 102 ${x - 3} 88 C${x - 7} 72 ${x - 9} 44 ${x} 40 Z`, C.skin, C.ink, 2.4),
    ...[0, 8, 14, 19, 23].map((d, i) => circle(x - 3 + d, 32 + i * 2, 5 - i * 0.6, C.skin, C.ink, 1.6)));
  const shoe = (y: number) => all(path(`M80 ${y} C80 ${y - 10} 92 ${y - 12} 98 ${y - 4} C104 ${y - 2} 114 ${y} 114 ${y + 6} L114 ${y + 10} L80 ${y + 10} Z`, C.red, C.ink, 2.2), line(`M80 ${y + 7} L114 ${y + 7}`, C.white, 2.4), line(`M88 ${y - 6} l4 3 M92 ${y - 8} l4 3`, C.white, 1.6));
  return all(path('M0 104 L120 104 L120 120 L0 120 Z', C.mint, null), line('M6 104 l2 -6 M18 104 l-1 -5 M60 104 l2 -6 M72 104 l-1 -5', C.green, 2),
    foot(22), foot(50), shoe(70), shoe(92));
}

/** på tå: standing on the toes, heel lifted, a small up-arrow under the heel. */
export function tiptoe(): Svg {
  return all(line('M4 108 L116 108', C.grey, 2),
    path('M40 0 L62 0 L64 56 C66 64 70 70 74 74 L60 78 C52 70 46 62 42 56 Z', C.skin, C.ink, 2.4),
    path('M42 54 C52 66 66 76 84 92 C92 98 98 104 94 108 L80 108 C70 100 56 88 44 74 C38 66 38 60 42 54 Z', C.skin, C.ink, 2.6),
    path('M80 96 C88 98 96 102 96 108 L80 108 Z', HL, C.ink, 2.2),
    arrow(36, 100, 36, 72, HL, 3.4));
}
