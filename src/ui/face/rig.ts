/**
 * Face rig (0.14): a big, detailed face that fills the 120×120 canvas, driven by numeric
 * parameters, for words where the face carries the meaning (miner, blickar, ansiktsuttryck).
 * The full-body character of the player is too small for this: its brows are as dark as the
 * hair and it has no nose. Here every feature has room and its own cue:
 * - brows are lighter than the hair and sit well below the hairline; raising them also draws
 *   forehead lines, knitting them draws a vertical crease,
 * - eyes have lids (open/squint) and pupils that can look in any direction, also up,
 * - the nose can wrinkle (creases on the bridge, lifted nostrils, raised upper lip) and flare,
 * - the mouth has smile/frown, opening, round (o), width, smirk and a lip bite,
 * - cheeks lift with a smile and can blush; skin can turn pale or yellow,
 * - the head can tilt, turn (yaw) and nod; a hand can come up to mouth, nose, ear, forehead,
 *   chin or the eyes; overlays (sun, smell, sound, bubble …) fade in and out.
 * `drawFace` is pure: parameters in, SVG markup out.
 */
import { C, circle, ellipse, g, line, path, rect, type Svg } from '../wordArt/kit';

export type FaceParams = {
  browRaise: number; // -1 (lowered) … 1 (raised)
  browTilt: number; // -1 angry (inner ends down) … 1 worried (inner ends up)
  browKnit: number; // 0 … 1 brows pulled together, crease between them
  browAsym: number; // -1 … 1 one brow (viewer's left / right) higher
  eyeOpen: number; // 0 closed … 1 normal … 1.4 wide
  squint: number; // 0 … 1 lower lids up (smile, suspicion, bright light)
  lookX: number; // -1 … 1 pupils left/right (viewer)
  lookY: number; // -1 up … 1 down
  noseWrinkle: number; // 0 … 1
  nostrilFlare: number; // 0 … 1
  smile: number; // -1 frown … 1 smile
  smirk: number; // -1 … 1 one corner up (viewer's left / right)
  mouthOpen: number; // 0 … 1
  mouthRound: number; // 0 … 1 (o)
  mouthWidth: number; // 0.6 … 1.4
  lipBite: number; // 0 … 1 upper teeth on the lower lip
  pout: number; // 0 … 1 lower lip pushed out (sulky)
  teeth: number; // 0 … 1 show clenched teeth in an open mouth (grimace)
  puff: number; // 0 … 1 cheeks blown up (holding the breath)
  cheeks: number; // 0 … 1 cheek lift
  blush: number; // 0 … 1
  pale: number; // 0 … 1
  yellow: number; // 0 … 1 (jaundice)
  tilt: number; // degrees, head roll
  yaw: number; // -1 … 1 head turned to viewer's left / right
  nod: number; // -1 chin up … 1 chin down
  jitter: number; // 0 … 1 shaking (giggle, hiccup, shiver)
  handX: number; handY: number; hand: number; // hand position and visibility 0 … 1
  handRot: number; // degrees
};
export const NEUTRAL: FaceParams = {
  browRaise: 0, browTilt: 0, browKnit: 0, browAsym: 0, eyeOpen: 1, squint: 0, lookX: 0, lookY: 0, noseWrinkle: 0, nostrilFlare: 0,
  smile: 0.15, smirk: 0, mouthOpen: 0, mouthRound: 0, mouthWidth: 1, lipBite: 0, pout: 0, teeth: 0, puff: 0, cheeks: 0, blush: 0, pale: 0, yellow: 0,
  tilt: 0, yaw: 0, nod: 0, jitter: 0, handX: 60, handY: 140, hand: 0, handRot: 0,
};
/** Where a hand goes (x, y, rotation) – use with `hand: 1`. */
export const HAND_AT = {
  mouth: { handX: 60, handY: 92, handRot: 0 }, nose: { handX: 60, handY: 74, handRot: 0 }, chin: { handX: 66, handY: 106, handRot: -20 },
  forehead: { handX: 66, handY: 30, handRot: -80 }, eyes: { handX: 64, handY: 38, handRot: -88 }, ear: { handX: 104, handY: 70, handRot: -10 },
  cheek: { handX: 88, handY: 84, handRot: -25 }, down: { handX: 60, handY: 140, handRot: 0 },
} as const;

export type OverlayKind = 'sun' | 'smell' | 'stink' | 'waves' | 'note' | 'bulb' | 'question' | 'exclaim' | 'zzz' | 'bubble' | 'heart' | 'tear' | 'sweat' | 'spray' | 'breath' | 'lamp' | 'bell' | 'star' | 'lightning' | 'bin' | 'plate' | 'cloud' | 'clock';
export type Overlay = { id: string; kind: OverlayKind; x: number; y: number; text?: string; s?: number; flip?: boolean };

const SKIN = '#f1c7a1', HAIR = '#2f2521', BROW = '#7a5236', LIP = '#c96b6b', MOUTH = '#5a2328', IRIS = '#6b4a2f';
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(v + (b[i]! - v) * clamp(k, 0, 1)).toString(16).padStart(2, '0')).join('');
};
const f1 = (n: number) => +n.toFixed(1);

function overlay(o: Overlay, op: number): Svg {
  if (op <= 0.01) return '';
  const s = o.s ?? 1, k = o.kind;
  let body = '';
  if (k === 'sun') body = circle(0, 0, 9, C.yellow, C.ink, 1.6) + line('M0 -13 l0 -4 M0 13 l0 4 M-13 0 l-4 0 M13 0 l4 0 M-9 -9 l-3 -3 M9 9 l3 3 M9 -9 l3 -3 M-9 9 l-3 3', C.gold, 2);
  else if (k === 'lamp') body = path('M-8 -4 C-8 -14 8 -14 8 -4 C8 2 4 4 4 8 L-4 8 C-4 4 -8 2 -8 -4 Z', '#fff4b0', C.ink, 1.6) + rect(-4, 8, 8, 4, C.grey, 1, C.ink, 1.2) + line('M-14 -6 l-5 -2 M14 -6 l5 -2 M0 -18 l0 -4', C.gold, 2);
  else if (k === 'smell' || k === 'stink') { const col = k === 'smell' ? C.orange : C.green; body = line('M0 -10 C-6 -6 6 -2 0 2 C-6 6 6 10 0 14 M10 -12 C4 -8 16 -4 10 0 C4 4 16 8 10 12', col, 2.4); }
  else if (k === 'waves') body = path('M0 -8 Q6 0 0 8 M6 -13 Q15 0 6 13 M12 -18 Q24 0 12 18', 'none', C.navy, 2.4);
  else if (k === 'note') body = path('M0 6 L0 -10 L10 -12 L10 4', 'none', C.navy, 2.4) + ellipse(-3, 6, 4, 3, C.navy, null) + ellipse(7, 4, 4, 3, C.navy, null);
  else if (k === 'bulb') body = path('M-7 -2 C-7 -12 7 -12 7 -2 C7 3 3 5 3 8 L-3 8 C-3 5 -7 3 -7 -2 Z', C.yellow, C.ink, 1.6) + rect(-3, 8, 6, 3, C.grey, 1, C.ink, 1) + line('M-12 -8 l-4 -2 M12 -8 l4 -2 M0 -16 l0 -4', C.gold, 1.8);
  else if (k === 'question' || k === 'exclaim' || k === 'bubble') {
    const w = o.text ? Math.max(22, o.text.length * 6.4 + 10) : 20;
    body = path(`M${-w / 2} -11 L${w / 2} -11 L${w / 2} 9 L4 9 L-2 15 L-1 9 L${-w / 2} 9 Z`, C.white, C.ink, 1.6)
      + `<text x="0" y="4" font-family="system-ui,sans-serif" font-weight="800" font-size="${o.text ? 11 : 15}" text-anchor="middle" fill="${k === 'exclaim' ? C.red : C.navy}">${o.text ?? (k === 'question' ? '?' : '!')}</text>`;
  } else if (k === 'zzz') body = `<text x="0" y="0" font-family="system-ui,sans-serif" font-weight="800" font-size="14" fill="${C.navy}">z</text><text x="9" y="-9" font-family="system-ui,sans-serif" font-weight="800" font-size="10" fill="${C.navy}">z</text>`;
  else if (k === 'heart') body = path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4);
  else if (k === 'tear' || k === 'sweat') body = path('M0 -6 C4 0 4 4 0 6 C-4 4 -4 0 0 -6 Z', '#9fd0f0', C.ink, 1.2);
  else if (k === 'spray') body = [[-2, -6], [4, -2], [-4, 2], [6, 5], [0, 8], [8, -7]].map(([x, y]) => circle(x!, y!, 1.6, '#cfe8f7', C.ink, 0.6)).join('');
  else if (k === 'breath') body = path('M0 0 C6 -6 12 -2 10 4 C16 2 20 8 14 12 C10 14 4 12 2 8 C-4 8 -6 2 0 0 Z', 'rgba(220,235,245,0.9)', C.grey, 1.2);
  else if (k === 'bell') body = path('M-8 6 C-8 -8 8 -8 8 6 L10 8 L-10 8 Z', C.yellow, C.ink, 1.6) + circle(0, 10, 2, C.ink, null) + line('M12 -4 q4 4 0 8 M16 -7 q6 7 0 14', C.navy, 1.6);
  else if (k === 'star') body = path('M0 -9 L2.6 -2.8 L9 -2.8 L4 1.2 L5.6 8 L0 4 L-5.6 8 L-4 1.2 L-9 -2.8 L-2.6 -2.8 Z', C.yellow, C.ink, 1.2);
  else if (k === 'lightning') body = path('M2 -11 L-6 2 L-1 2 L-4 12 L6 -2 L1 -2 Z', C.yellow, C.ink, 1.4);
  else if (k === 'bin') body = path('M-8 -6 L8 -6 L6 10 L-6 10 Z', C.grey, C.ink, 1.6) + rect(-10, -9, 20, 3, C.dark, 1, C.ink, 1.2);
  else if (k === 'plate') body = ellipse(0, 4, 13, 4, C.white, C.ink, 1.6) + path('M-7 3 C-7 -6 7 -6 7 3 Z', C.orange, C.ink, 1.4);
  else if (k === 'clock') body = circle(0, 0, 10, C.white, C.navy, 2) + line('M0 0 L0 -6 M0 0 L5 2', C.navy, 1.8);
  else if (k === 'cloud') body = path('M-10 4 C-16 4 -16 -4 -10 -4 C-10 -10 0 -12 2 -6 C6 -10 14 -8 12 -2 C18 -2 18 6 12 6 Z', C.grey2, C.ink, 1.4);
  return `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${o.flip ? -s : s} ${s})" opacity="${f1(op * 100) / 100}">${body}</g>`;
}

/**
 * Draw one face. `t` (ms) is only used for jitter. `id` makes clip-path ids unique when several
 * faces are on one page.
 */
export function drawFace(pIn: Partial<FaceParams>, overlays: { o: Overlay; op: number; x?: number; y?: number }[] = [], t = 0, id = 'f'): Svg {
  const p = { ...NEUTRAL, ...pIn };
  const skin = mix(mix(SKIN, '#f9ece4', p.pale), '#e8cf5a', p.yellow);
  const shade = mix(skin, '#b9805a', 0.35);
  const jx = p.jitter ? Math.sin(t / 37) * 1.6 * p.jitter : 0, jy = p.jitter ? Math.cos(t / 29) * 1.2 * p.jitter : 0;
  const fx = p.yaw * 7, fy = p.nod * 5; // feature offset for turn/nod
  const out: Svg[] = [];
  // shoulders + neck (do not turn with the head)
  out.push(path('M46 96 L46 112 C32 113 18 116 10 120 L110 120 C102 116 88 113 74 112 L74 96 Z', shade, C.ink, 2.2));
  out.push(path('M10 120 C18 116 32 113 46 112 C52 116 68 116 74 112 C88 113 102 116 110 120 Z', C.sky, C.ink, 2.2));
  const head: Svg[] = [];
  // ears (the far ear shrinks when the head turns)
  const earL = 1 - Math.max(0, p.yaw) * 0.7, earR = 1 + Math.min(0, p.yaw) * 0.7;
  head.push(path(`M${f1(25 + fx * 0.3)} 56 C${f1(25 - 10 * earL + fx * 0.3)} 52 ${f1(25 - 11 * earL + fx * 0.3)} 76 ${f1(25 + fx * 0.3)} 76 Z`, skin, C.ink, 2.2));
  head.push(path(`M${f1(95 + fx * 0.3)} 56 C${f1(95 + 10 * earR + fx * 0.3)} 52 ${f1(95 + 11 * earR + fx * 0.3)} 76 ${f1(95 + fx * 0.3)} 76 Z`, skin, C.ink, 2.2));
  // face
  head.push(path('M60 14 C86 14 97 34 97 60 C97 88 80 106 60 106 C40 106 23 88 23 60 C23 34 34 14 60 14 Z', skin, C.ink, 2.6));
  if (p.puff > 0.05) { const k = clamp(p.puff, 0, 1); for (const s of [-1, 1]) head.push(path(`M${60 + s * 30} 66 C${f1(60 + s * (40 + 6 * k))} 70 ${f1(60 + s * (40 + 6 * k))} 92 ${60 + s * 28} 96`, skin, C.ink, 2.4)); }
  // hair: a cap with a high hairline so the forehead (and the brows) stay free
  head.push(path(`M24 54 C20 22 40 6 60 6 C82 6 100 22 96 54 C93 40 90 32 ${f1(84 + fx * 0.5)} 28 C${f1(74 + fx * 0.5)} 24 ${f1(52 + fx * 0.5)} 22 ${f1(40 + fx * 0.5)} 26 C32 30 26 40 24 54 Z`, HAIR, C.ink, 2.2));
  const F: Svg[] = []; // features move with yaw/nod
  // forehead lines (raised brows) and the crease between knitted brows
  if (p.browRaise > 0.25) { const o = clamp((p.browRaise - 0.25) / 0.6, 0, 1); for (const [y, w] of [[30, 14], [35, 17]] as const) F.push(`<path d="M${60 - w} ${y} Q60 ${y - 2} ${60 + w} ${y}" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round" opacity="${f1(o)}"/>`); }
  if (p.browKnit > 0.2) F.push(`<path d="M57 40 L58 46 M63 40 L62 46" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round" opacity="${f1(clamp(p.browKnit, 0, 1))}"/>`);
  // brows
  for (const side of [-1, 1] as const) {
    const cx = 60 + side * 18;
    const asym = side === -1 ? Math.max(0, -p.browAsym) : Math.max(0, p.browAsym);
    const base = 43 - p.browRaise * 8 - asym * 7;
    const innerX = 60 + side * (7 - p.browKnit * 3), outerX = cx + side * 12;
    const innerY = base - p.browTilt * 4 + p.browKnit * 2, outerY = base + p.browTilt * 3 + 1;
    const midY = Math.min(innerY, outerY) - 3.5 + p.browTilt * 0.5;
    F.push(line(`M${f1(innerX)} ${f1(innerY)} Q${f1(cx)} ${f1(midY)} ${f1(outerX)} ${f1(outerY)}`, BROW, 5.4));
  }
  // eyes
  const open = clamp(p.eyeOpen, 0, 1.5), sq = clamp(p.squint, 0, 1);
  for (const side of [-1, 1] as const) {
    const cx = 60 + side * 17, cy = 57;
    const top = cy - 13 * open, bot = cy + 9 * open * (1 - sq * 0.6);
    if (open < 0.12) { // closed: a lash line, curved like a smile when squinting/happy
      F.push(line(`M${cx - 11} ${cy} Q${cx} ${f1(cy + 5 + sq * 2)} ${cx + 11} ${cy}`, C.ink, 2.6));
      continue;
    }
    const almond = `M${cx - 11} ${cy} Q${cx} ${f1(top)} ${cx + 11} ${cy} Q${cx} ${f1(bot)} ${cx - 11} ${cy} Z`;
    const cid = `${id}-eye${side}`;
    F.push(`<clipPath id="${cid}"><path d="${almond}"/></clipPath>`);
    F.push(path(almond, C.white, null));
    const px = cx + p.lookX * 5.5, py = cy + p.lookY * 4.6 + 0.3;
    F.push(`<g clip-path="url(#${cid})">${circle(f1(px), f1(py), 6, IRIS, C.ink, 1.2)}${circle(f1(px), f1(py), 3, C.ink, null)}${circle(f1(px + 1.8), f1(py - 2), 1.4, C.white, null)}</g>`);
    F.push(path(almond, 'none', C.ink, 2));
    F.push(line(`M${cx - 11} ${cy} Q${cx} ${f1(top)} ${cx + 11} ${cy}`, C.ink, 2.8)); // upper lash line
    if (sq > 0.3) F.push(`<path d="M${cx - 8} ${f1(cy + (bot - cy) / 2 + 3)} Q${cx} ${f1(cy + (bot - cy) / 2 + 5)} ${cx + 8} ${f1(cy + (bot - cy) / 2 + 3)}" fill="none" stroke="${shade}" stroke-width="1.6" stroke-linecap="round" opacity="${f1(sq)}"/>`);
  }
  // cheeks and blush
  if (p.cheeks > 0.05) F.push(`<g opacity="${f1(clamp(p.cheeks, 0, 1) * 0.7)}">${ellipse(38, 74, 7, 4.4, mix(skin, '#f08a8a', 0.35), null)}${ellipse(82, 74, 7, 4.4, mix(skin, '#f08a8a', 0.35), null)}</g>`);
  if (p.blush > 0.02) F.push(`<g opacity="${f1(clamp(p.blush, 0, 1))}">${ellipse(37, 73, 9, 5.5, '#f28b8b', null)}${ellipse(83, 73, 9, 5.5, '#f28b8b', null)}</g>`);
  // nose (big enough that wrinkles and flaring read at 120 px)
  const nw = clamp(p.noseWrinkle, 0, 1), fl = clamp(p.nostrilFlare, 0, 1);
  const ny = -nw * 3; // the whole lower nose lifts when it wrinkles
  F.push(line(`M60 48 C59 58 57 64 ${f1(54 - fl)} ${f1(70 + ny)}`, shade, 2.2));
  F.push(path(`M${f1(48 - fl * 2.5)} ${f1(74 + ny)} C${f1(47 - fl * 2.5)} ${f1(68 + ny)} 54 ${f1(64 + ny)} 60 ${f1(65 + ny)} C66 ${f1(64 + ny)} ${f1(73 + fl * 2.5)} ${f1(68 + ny)} ${f1(72 + fl * 2.5)} ${f1(74 + ny)} C${f1(72 + fl * 2.5)} ${f1(79 + ny)} 48 ${f1(79 + ny)} ${f1(48 - fl * 2.5)} ${f1(74 + ny)} Z`, mix(skin, '#e0a07c', 0.4), C.ink, 2));
  F.push(ellipse(f1(55 - fl), f1(76 + ny), f1(2.2 + fl * 1.4), f1(1.4 + fl * 0.9), C.ink, null), ellipse(f1(65 + fl), f1(76 + ny), f1(2.2 + fl * 1.4), f1(1.4 + fl * 0.9), C.ink, null));
  if (nw > 0.15) F.push(`<g opacity="${f1(nw)}">${line('M53 55 Q60 52 67 55 M52 59.5 Q60 56.5 68 59.5 M53 64 Q60 61 67 64', C.ink, 1.7)}${line('M45 66 Q47 71 48 77 M75 66 Q73 71 72 77', shade, 2)}</g>`);
  // mouth
  const w = 13 * clamp(p.mouthWidth * (1 - p.mouthRound * 0.45), 0.5, 1.5), mo = clamp(p.mouthOpen, 0, 1), sm = clamp(p.smile, -1, 1);
  const my = 88 - nw * 2.5;
  const lY = my - sm * 4 - Math.max(0, -p.smirk) * 5 + Math.min(0, p.smirk) * 0, rY = my - sm * 4 - Math.max(0, p.smirk) * 5;
  const lx = 60 - w, rx = 60 + w;
  if (p.lipBite > 0.2) {
    // the lower lip is pulled in and the two front teeth rest on it
    F.push(ellipse(60, f1(my + 4), f1(w * 0.8), 3.6, LIP, C.ink, 1.8));
    F.push(rect(54.5, f1(my - 1), 5.5, 5.5, C.white, 1.2, C.ink, 1.3), rect(60, f1(my - 1), 5.5, 5.5, C.white, 1.2, C.ink, 1.3));
    F.push(line(`M${lx} ${f1(lY + 1)} Q60 ${f1(my - 3)} ${rx} ${f1(rY + 1)}`, C.ink, 2.4));
  } else if (mo < 0.06 && p.mouthRound < 0.2) {
    const cy = my + sm * 6;
    F.push(line(`M${lx} ${f1(lY)} Q60 ${f1(cy)} ${rx} ${f1(rY)}`, C.ink, 2.4));
    if (p.pout > 0.1) F.push(`<path d="M${lx + 2} ${f1(lY + 0.5)} Q60 ${f1(cy + 2)} ${rx - 2} ${f1(rY + 0.5)} Q60 ${f1(cy + 8 + p.pout * 5)} ${lx + 2} ${f1(lY + 0.5)} Z" fill="${LIP}" stroke="${C.ink}" stroke-width="1.6" opacity="${f1(Math.min(1, p.pout * 1.5))}"/>`);
    if (sm > 0.45) F.push(line(`M${lx - 2} ${f1(lY - 1)} l-2 -1.5 M${rx + 2} ${f1(rY - 1)} l2 -1.5`, C.ink, 1.6)); // dimples of a big smile
  } else {
    const h = 3 + mo * 13 + p.mouthRound * 6;
    const upY = my - 1 - mo * 2 + Math.max(0, sm) * 2, loY = my + h + Math.max(0, sm) * 3 - Math.max(0, -sm) * 3;
    const shape = `M${lx} ${f1(lY)} Q60 ${f1(upY - (p.mouthRound * 3))} ${rx} ${f1(rY)} Q60 ${f1(loY)} ${lx} ${f1(lY)} Z`;
    const mid = `${id}-mouth`;
    F.push(`<clipPath id="${mid}"><path d="${shape}"/></clipPath>`);
    F.push(path(shape, MOUTH, null));
    F.push(`<g clip-path="url(#${mid})">`);
    if ((sm > 0.2 || p.teeth > 0.3) && p.mouthRound < 0.4) F.push(rect(lx, f1(upY - 6), 2 * w, f1(5 + mo * 3), C.white, 0, null)); // upper teeth
    if (p.teeth > 0.6) F.push(rect(lx, f1(loY - 4), 2 * w, 6, C.white, 0, null), line(`M${lx} ${f1(loY - 4)} L${rx} ${f1(loY - 4)}`, C.grey2, 1));
    F.push(ellipse(60, f1(loY - 1), f1(w * 0.6), f1(2 + mo * 3), '#e88c8c', null)); // tongue
    F.push('</g>');
    F.push(path(shape, 'none', C.ink, 2.2));
  }
  head.push(g(`translate(${f1(fx)} ${f1(fy)})`, ...F));
  out.push(g(`rotate(${f1(p.tilt)} 60 104) translate(${f1(jx)} ${f1(jy)})`, ...head));
  // overlays
  for (const { o, op, x, y } of overlays) out.push(overlay({ ...o, x: x ?? o.x, y: y ?? o.y }, op));
  // hand (mitten) with forearm from below
  if (p.hand > 0.02) {
    const hx = p.handX, hy = p.handY;
    out.push(`<g opacity="${f1(clamp(p.hand, 0, 1))}">`);
    const ax = hy < 60 ? 124 : hx + 14, ay = hy < 60 ? hy + 54 : 124; // high hands: the arm comes in from the side
    out.push(path(`M${f1(hx - 5)} ${f1(hy + 8)} L${f1(ax - 9)} ${f1(ay)} L${f1(ax + 9)} ${f1(ay)} L${f1(hx + 9)} ${f1(hy + 6)} Z`, C.sky, C.ink, 2));
    out.push(g(`translate(${f1(hx)} ${f1(hy)}) rotate(${f1(p.handRot)})`, path('M-10 10 L-10 -6 C-10 -14 -6 -15 -4 -10 L-4 -13 C-4 -18 2 -18 2 -13 L2 -12 C2 -17 8 -17 8 -11 L8 -8 C8 -12 13 -12 13 -7 L13 6 C13 12 8 14 2 14 L-4 14 C-8 14 -10 12 -10 10 Z', skin, C.ink, 2), path('M-10 2 C-16 -2 -18 -8 -14 -9 C-11 -10 -9 -4 -8 -2 Z', skin, C.ink, 1.8)));
    out.push('</g>');
  }
  return out.join('');
}

// ── Timeline ────────────────────────────────────────────────────────────────
export type FaceKey = { t: number; e?: 'linear' | 'in' | 'out' | 'inout' } & Partial<FaceParams> & { [overlayTrack: `o:${string}` | `x:${string}` | `y:${string}`]: number };
export type FaceScene = { durationMs: number; posterMs: number; overlays?: Overlay[]; keys: FaceKey[] };

const EASE = { linear: (u: number) => u, in: (u: number) => u * u, out: (u: number) => 1 - (1 - u) * (1 - u), inout: (u: number) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)) };
function track(keys: FaceKey[], name: string, t: number, dflt: number): number {
  let prev: FaceKey | undefined, next: FaceKey | undefined;
  for (const k of keys) {
    if ((k as Record<string, unknown>)[name] === undefined) continue;
    if (k.t <= t) prev = k; else { next = k; break; }
  }
  const val = (k: FaceKey) => (k as unknown as Record<string, number>)[name]!;
  if (!prev) return dflt; // before a parameter is first set it stays neutral – start scenes with a key at t = 0
  if (!next) return val(prev);
  const u = (t - prev.t) / (next.t - prev.t);
  return val(prev) + (val(next) - val(prev)) * EASE[next.e ?? 'inout'](u);
}
/** Parameters and overlay states at time t. Keys must be sorted by t; each parameter interpolates between the keys that set it. */
export function sampleFace(s: FaceScene, t: number) {
  const keys = s.keys;
  const params = {} as FaceParams;
  for (const k of Object.keys(NEUTRAL) as (keyof FaceParams)[]) params[k] = track(keys, k, t, NEUTRAL[k]);
  const overlays = (s.overlays ?? []).map((o) => ({ o, op: track(keys, `o:${o.id}`, t, 0), x: track(keys, `x:${o.id}`, t, o.x), y: track(keys, `y:${o.id}`, t, o.y) }));
  return { params, overlays };
}
/** Full SVG for a scene at time t (used for the poster, the player and contact sheets). */
export function faceSvg(s: FaceScene, t: number, id = 'f', bg: string = C.paper): string {
  const { params, overlays } = sampleFace(s, t);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-hidden="true" focusable="false"><rect width="120" height="120" rx="18" fill="${bg}"/>${drawFace(params, overlays, t, id)}</svg>`;
}
