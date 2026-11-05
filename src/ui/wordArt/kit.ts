/**
 * Building blocks for word illustrations (0.6). Picture-book style on a
 * 120×120 canvas: natural colours, one dark outline colour, a warm paper
 * background. Garment generators keep a family look while making the
 * distinguishing features (collar, sleeves, hood, zip, length …) explicit.
 * Everything is plain SVG strings – no images, no network.
 */
export type Svg = string;

export const C = {
  ink: '#2b2a33', paper: '#f6f2ea', white: '#fbfbf8', skin: '#f1c7a1', skin2: '#d9a57c', hair: '#3b2f2f',
  navy: '#2f4a7a', denim: '#3f6fb5', denim2: '#2e5590', sky: '#8cc7e8', red: '#d64545', pink: '#ef9fb5', rose: '#f6c9d4',
  green: '#4f9d69', mint: '#a8dcc0', yellow: '#f2c14e', orange: '#ef8a3c', brown: '#a0673d', tan: '#d4a373', beige: '#e6d3b3',
  grey: '#9aa3ad', grey2: '#c9ced4', dark: '#3d3f4a', black: '#2e2e36', purple: '#8a6bbf', lilac: '#c7b3e6', reflex: '#d7f23a',
  accent: '#e4572e', gold: '#e0b23c', silver: '#c0c6cc',
} as const;

const st = (stroke: string | null | undefined, sw: number) => (stroke === null ? '' : ` stroke="${stroke ?? C.ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`);
export const path = (d: string, fill: string, stroke?: string | null, sw = 2.2): Svg => `<path d="${d}" fill="${fill}"${st(stroke, sw)}/>`;
export const circle = (cx: number, cy: number, r: number, fill: string, stroke?: string | null, sw = 2.2): Svg => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${st(stroke, sw)}/>`;
export const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, stroke?: string | null, sw = 2.2): Svg => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${st(stroke, sw)}/>`;
export const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 3, stroke?: string | null, sw = 2.2): Svg => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${st(stroke, sw)}/>`;
/** Stroke-only line(s). */
export const line = (d: string, color: string = C.ink, sw = 2.2, dash?: string): Svg => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
export const g = (transform: string, ...children: Svg[]): Svg => `<g transform="${transform}">${children.join('')}</g>`;
export const all = (...children: Svg[]): Svg => children.join('');
/** Place a full 120×120 drawing scaled into a box. */
export const place = (x: number, y: number, scale: number, ...children: Svg[]): Svg => g(`translate(${x} ${y}) scale(${scale})`, ...children);
export const mirror = (...children: Svg[]): Svg => g('translate(120 0) scale(-1 1)', ...children);

/** Accent arrow (for actions). */
export function arrow(x1: number, y1: number, x2: number, y2: number, color: string = C.accent, sw = 3.4): Svg {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
  const p1 = [x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)], p2 = [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)];
  return line(`M${x1} ${y1} L${x2} ${y2}`, color, sw) + path(`M${x2} ${y2} L${p1[0]!.toFixed(1)} ${p1[1]!.toFixed(1)} L${p2[0]!.toFixed(1)} ${p2[1]!.toFixed(1)} Z`, color, color, 1.5);
}
export const heart = (cx: number, cy: number, s: number, fill: string = C.red): Svg =>
  path(`M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.9} ${cy - s * 1.2} ${cx} ${cy - s * 0.4} C${cx + s * 0.9} ${cy - s * 1.2} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`, fill, C.ink, 1.8);
export const star = (cx: number, cy: number, r: number, fill: string = C.yellow): Svg => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.45 : r; pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`); }
  return path(`M${pts.join(' L')} Z`, fill, C.ink, 1.6);
};
export const sparkle = (cx: number, cy: number, r: number, color: string = C.gold): Svg =>
  path(`M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`, color, null);
export const button = (cx: number, cy: number, r = 2.2, fill: string = C.white): Svg => circle(cx, cy, r, fill, C.ink, 1.4);
/** Hand seen from the side (mitten shape), pointing right; mirror for left. */
export const hand = (x: number, y: number, s = 1, rot = 0): Svg =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 -6 C-4 -9 6 -9 10 -6 C14 -4 14 2 10 3 L2 4 C0 8 -6 8 -8 5 C-12 3 -13 -3 -10 -6 Z', C.skin), line('M4 -6 L10 -4', C.skin2, 1.4));

// ── Garments ────────────────────────────────────────────────────────────────
export type TopOpts = {
  color: string; sleeves?: 'long' | 'short' | 'none'; collar?: 'shirt' | 'round' | 'crew' | 'polo' | 'v' | 'none';
  opening?: 'buttons' | 'zip' | 'none'; hood?: boolean; pocket?: 'kangaroo' | 'chest' | 'none'; cuffs?: boolean; ribHem?: boolean;
  trim?: string; pattern?: Svg; rolled?: boolean; straps?: boolean;
};
/** Upper-body garment, front view, centred. */
export function top(o: TopOpts): Svg {
  const s = o.sleeves ?? 'long', col = o.color, trim = o.trim ?? col;
  const out: Svg[] = [];
  if (o.hood) out.push(path('M42 30 C36 4 84 4 78 30 Z', col));
  if (o.straps) {
    out.push(path('M44 18 L52 18 Q60 38 68 18 L76 18 L80 40 L84 102 L36 102 L40 40 Z', col));
  } else {
    if (s === 'long') { out.push(path('M38 28 L16 88 L30 92 L44 52 Z', col), path('M82 28 L104 88 L90 92 L76 52 Z', col)); if (o.cuffs) out.push(path('M17 85 L30 89 L28 95 L15 91 Z', trim), path('M103 85 L90 89 L92 95 L105 91 Z', trim)); }
    if (s === 'long' && o.rolled) out.push(path('M24 66 L38 70 L35 78 L21 74 Z', trim), path('M96 66 L82 70 L85 78 L99 74 Z', trim));
    if (s === 'short') out.push(path('M38 28 L20 52 L34 60 L42 46 Z', col), path('M82 28 L100 52 L86 60 L78 46 Z', col));
    out.push(path('M46 22 Q60 32 74 22 L86 30 L86 102 L34 102 L34 30 Z', col));
  }
  if (o.pattern) out.push(o.pattern);
  if (o.ribHem) out.push(path('M34 94 L86 94 L86 102 L34 102 Z', trim), line('M40 95 L40 101 M46 95 L46 101 M52 95 L52 101 M58 95 L58 101 M64 95 L64 101 M70 95 L70 101 M76 95 L76 101 M82 95 L82 101', C.ink, 1));
  const c = o.collar ?? 'crew';
  if (c === 'shirt') out.push(path('M46 22 L60 36 L50 44 L42 26 Z', trim), path('M74 22 L60 36 L70 44 L78 26 Z', trim));
  if (c === 'round') out.push(path('M47 23 C46 34 58 36 60 31 C62 36 74 34 73 23 Q60 31 47 23 Z', trim));
  if (c === 'polo') out.push(path('M48 8 L72 8 L74 26 Q60 30 46 26 Z', col), line('M50 12 L70 12 M50 17 L70 17 M50 22 L70 22', C.ink, 1));
  if (c === 'v') out.push(line('M47 23 L60 42 L73 23', C.ink, 2));
  if (o.hood) out.push(path('M48 24 C50 14 70 14 72 24', 'none'), line('M54 28 L53 44 M66 28 L67 44', C.ink, 1.6), circle(53, 45, 1.6, C.white, C.ink, 1), circle(67, 45, 1.6, C.white, C.ink, 1));
  const op = o.opening ?? 'none';
  if (op === 'buttons') { out.push(line('M60 34 L60 102', C.ink, 1.6)); for (const y of [46, 60, 74, 88]) out.push(button(63.5, y)); }
  if (op === 'zip') out.push(line('M60 26 L60 102', C.dark, 3), line('M58 30 L62 30 M58 38 L62 38 M58 46 L62 46 M58 54 L62 54 M58 62 L62 62 M58 70 L62 70 M58 78 L62 78 M58 86 L62 86 M58 94 L62 94', C.white, 1), rect(56.5, 34, 7, 10, C.silver, 2, C.ink, 1.4));
  const pk = o.pocket ?? 'none';
  if (pk === 'kangaroo') out.push(path(op === 'zip' ? 'M42 74 L56 74 L56 92 L40 92 Z M78 74 L64 74 L64 92 L80 92 Z' : 'M42 74 L78 74 L82 92 L38 92 Z', 'none'));
  if (pk === 'chest') out.push(path('M66 44 L78 44 L78 56 L66 56 Z', 'none', C.ink, 1.6));
  return out.join('');
}

export type BottomOpts = { color: string; length?: 'long' | 'short'; fit?: 'straight' | 'tight' | 'wide'; fly?: boolean; pockets?: boolean; stitch?: string; elastic?: boolean; stripe?: string; cuffs?: string; backPockets?: boolean };
/** Trousers, front view. */
export function trousers(o: BottomOpts): Svg {
  const len = o.length ?? 'long', fit = o.fit ?? 'straight';
  const d = len === 'short' ? 'M36 18 L84 18 L90 62 L64 64 L60 38 L56 64 L30 62 Z'
    : fit === 'tight' ? 'M39 14 L81 14 L76 108 L64 108 L60 40 L56 108 L44 108 Z'
    : fit === 'wide' ? 'M38 14 L82 14 L92 108 L64 108 L60 42 L56 108 L28 108 Z'
    : 'M38 14 L82 14 L86 108 L64 108 L60 42 L56 108 L34 108 Z';
  const out: Svg[] = [path(d, o.color)];
  out.push(o.elastic ? all(path(len === 'short' ? 'M36 18 L84 18 L84.6 26 L35.4 26 Z' : 'M38 14 L82 14 L82.5 22 L37.5 22 Z', o.color), line(len === 'short' ? 'M38 21 L82 21 M38 24 L82 24' : 'M40 17 L80 17 M40 20 L80 20', C.ink, 1), line(len === 'short' ? 'M56 26 L54 36 M64 26 L66 36' : 'M56 22 L54 32 M64 22 L66 32', C.white, 1.6))
    : line(len === 'short' ? 'M36 25 L84 25' : 'M38 21 L82 21', C.ink, 1.8));
  if (o.fly) out.push(line(len === 'short' ? 'M60 25 L60 38 M60 38 Q65 36 65 28' : 'M60 21 L60 40 M60 40 Q66 38 66 27', C.ink, 1.6), button(60, len === 'short' ? 22 : 18, 1.8, C.silver));
  if (o.pockets) out.push(line(len === 'short' ? 'M38 26 Q46 30 48 25 M82 26 Q74 30 72 25' : 'M40 22 Q48 30 50 22 M80 22 Q72 30 70 22', C.ink, 1.6));
  if (o.stitch) out.push(line(len === 'short' ? 'M38 27 Q46 31 48 26 M82 27 Q74 31 72 26' : 'M41 24 Q48 31 51 23 M79 24 Q72 31 69 23', o.stitch, 1.2, '2 2'));
  if (o.stripe && len === 'long') out.push(line(fit === 'tight' ? 'M40 24 L45 106 M80 24 L75 106' : 'M38.5 24 L35 106 M81.5 24 L85 106', o.stripe, 3));
  if (o.cuffs && len === 'long') out.push(path(fit === 'tight' ? 'M44 102 L56 102 L56 108 L44 108 Z M64 102 L76 102 L76 108 L64 108 Z' : 'M34.4 100 L56 100 L56 108 L34 108 Z M64 100 L85.6 100 L86 108 L64 108 Z', o.cuffs));
  return out.join('');
}
/** Skirt; legs drawn below when not long. */
export function skirt(o: { color: string; length: 'mini' | 'knee' | 'long'; pleats?: boolean; pattern?: Svg; legs?: boolean }): Svg {
  const bottom = o.length === 'mini' ? 52 : o.length === 'knee' ? 78 : 108;
  const spread = o.length === 'mini' ? 14 : o.length === 'knee' ? 20 : 26;
  const out: Svg[] = [];
  if (o.legs !== false && o.length !== 'long') out.push(path(`M48 ${bottom - 4} L46 112 L56 112 L57 ${bottom - 4} Z M63 ${bottom - 4} L64 112 L74 112 L72 ${bottom - 4} Z`, C.skin), o.length === 'knee' ? line(`M47 ${bottom + 8} Q51 ${bottom + 10} 56 ${bottom + 8} M64 ${bottom + 8} Q69 ${bottom + 10} 73 ${bottom + 8}`, C.skin2, 1.4) : '');
  out.push(path(`M42 16 L78 16 L${78 + spread} ${bottom} Q60 ${bottom + 5} ${42 - spread} ${bottom} Z`, o.color));
  if (o.pattern) out.push(o.pattern);
  out.push(path('M42 16 L78 16 L78.5 24 L41.5 24 Z', o.color));
  if (o.pleats) out.push(line(`M50 24 L${50 - spread * 0.55} ${bottom} M60 24 L60 ${bottom + 3} M70 24 L${70 + spread * 0.55} ${bottom}`, C.ink, 1.3));
  return out.join('');
}
/** Dress: bodice + skirt. */
export function dress(o: { color: string; length: 'knee' | 'long'; sleeves?: 'short' | 'none' | 'long'; pattern?: Svg; belt?: string; veil?: boolean; neck?: 'round' | 'v' }): Svg {
  const bottom = o.length === 'long' ? 110 : 84, spread = o.length === 'long' ? 34 : 24;
  const out: Svg[] = [];
  if (o.length !== 'long') out.push(path(`M50 ${bottom - 4} L49 114 L57 114 L57 ${bottom - 4} Z M63 ${bottom - 4} L63 114 L71 114 L70 ${bottom - 4} Z`, C.skin));
  if (o.sleeves === 'short') out.push(path('M44 16 L32 34 L42 40 L46 30 Z', o.color), path('M76 16 L88 34 L78 40 L74 30 Z', o.color));
  if (o.sleeves === 'long') out.push(path('M44 16 L28 70 L38 72 L48 34 Z', o.color), path('M76 16 L92 70 L82 72 L72 34 Z', o.color));
  out.push(path(`M48 10 Q60 18 72 10 L78 16 L74 44 L${60 + spread} ${bottom} Q60 ${bottom + 6} ${60 - spread} ${bottom} L46 44 L42 16 Z`, o.color));
  if (o.pattern) out.push(o.pattern);
  if (o.belt) out.push(path('M46 42 L74 42 L74.6 48 L45.4 48 Z', o.belt));
  if (o.neck === 'v') out.push(line('M48 10 L60 24 L72 10', C.ink, 1.8));
  return out.join('');
}
export type JacketOpts = { color: string; length?: 'hip' | 'long'; style?: 'plain' | 'puffer' | 'down' | 'rain' | 'blazer' | 'coat'; hood?: boolean; closing?: 'zip' | 'buttons' | 'none'; lapels?: string; collar?: string; pockets?: boolean; trim?: string };
/** Jacket or coat. */
export function jacket(o: JacketOpts): Svg {
  const bottom = o.length === 'long' ? 110 : 96, col = o.color;
  const out: Svg[] = [];
  if (o.hood) out.push(path('M40 30 C34 2 86 2 80 30 Z', col));
  out.push(path(`M38 26 L14 ${bottom - 12} L28 ${bottom - 8} L42 50 Z`, col), path(`M82 26 L106 ${bottom - 12} L92 ${bottom - 8} L78 50 Z`, col));
  out.push(path(`M46 20 Q60 28 74 20 L86 28 L${o.length === 'long' ? 90 : 86} ${bottom} L${o.length === 'long' ? 30 : 34} ${bottom} L34 28 Z`, col));
  if (o.style === 'puffer' || o.style === 'down') {
    const ys = o.style === 'down' ? [38, 52, 66, 80] : [42, 62, 82];
    for (const y of ys) if (y < bottom - 4) out.push(line(`M35 ${y} Q47 ${y + 4} 60 ${y} Q73 ${y + 4} 85 ${y}`, C.ink, 1.4));
  }
  if (o.style === 'rain') out.push(path(`M34 ${bottom - 6} L${o.length === 'long' ? 90 : 86} ${bottom - 6}`, 'none', C.ink, 1.2), circle(28, 18, 2, C.sky, null), circle(96, 14, 2, C.sky, null), path('M28 10 Q26 16 28 18 Q30 16 28 10 Z M96 6 Q94 12 96 14 Q98 12 96 6 Z M106 30 Q104 36 106 38 Q108 36 106 30 Z', C.sky, C.ink, 1));
  if (o.lapels) out.push(path('M46 20 L56 44 L60 56 L52 40 L44 30 Z', o.lapels), path('M74 20 L64 44 L60 56 L68 40 L76 30 Z', o.lapels));
  if (o.collar) out.push(path('M44 18 Q60 10 76 18 L74 26 Q60 20 46 26 Z', o.collar));
  const cl = o.closing ?? 'zip';
  if (cl === 'zip') out.push(line(`M60 24 L60 ${bottom}`, C.dark, 3), rect(56.5, 30, 7, 10, C.silver, 2, C.ink, 1.4));
  if (cl === 'buttons') { out.push(line(`M60 ${o.lapels ? 56 : 26} L60 ${bottom}`, C.ink, 1.4)); for (let y = o.lapels ? 64 : 40; y < bottom - 6; y += 14) out.push(button(55, y, 2.4, o.trim ?? C.dark), button(65, y, 2.4, o.trim ?? C.dark)); }
  if (o.pockets) out.push(line(`M38 ${bottom - 28} L50 ${bottom - 28} M70 ${bottom - 28} L82 ${bottom - 28}`, C.ink, 1.8));
  return out.join('');
}
export function sock(o: { color: string; length: 'ankle' | 'knee'; thick?: boolean; stripe?: string; heel?: string; x?: number; y?: number; s?: number; rot?: number }): Svg {
  const top = o.length === 'knee' ? 4 : 40;
  const body = path(`M44 ${top} L68 ${top} L68 76 L92 90 C102 96 98 112 86 110 L50 100 C42 98 42 92 44 84 Z`, o.color);
  const out: Svg[] = [body];
  out.push(path(`M44 ${top} L68 ${top} L68 ${top + 10} L44 ${top + 10} Z`, o.stripe ?? o.color));
  out.push(line(`M48 ${top + 2} L48 ${top + 8} M52 ${top + 2} L52 ${top + 8} M56 ${top + 2} L56 ${top + 8} M60 ${top + 2} L60 ${top + 8} M64 ${top + 2} L64 ${top + 8}`, C.ink, 1));
  if (o.thick) out.push(line(`M50 ${top + 16} L50 78 M56 ${top + 16} L56 80 M62 ${top + 16} L62 78`, C.ink, 1, '3 3'), path('M44 84 C44 92 46 98 52 100 L58 96 C52 94 50 90 50 82 Z', C.white, C.ink, 1.4));
  if (o.heel) out.push(path('M86 110 C98 112 102 96 92 90 L86 96 C90 100 90 106 86 110 Z', o.heel, C.ink, 1.4));
  if (o.length === 'knee' && o.stripe) out.push(path('M44 18 L68 18 L68 23 L44 23 Z', o.stripe, C.ink, 1.2));
  return g(`translate(${o.x ?? 0} ${o.y ?? 0}) rotate(${o.rot ?? 0} 60 60) scale(${o.s ?? 1})`, ...out);
}
/** Simple person (front). Clothes are coloured shapes on the body. */
export type PersonOpts = { x?: number; s?: number; topColor?: string; bottomColor?: string; skirt?: boolean; dress?: string; hair?: 'short' | 'long' | 'bun' | 'none'; hairColor?: string; extra?: Svg; armsUp?: boolean; shoes?: string; tie?: string; jacket?: string; lapels?: string };
export function person(o: PersonOpts): Svg {
  const hc = o.hairColor ?? C.hair, top = o.topColor ?? C.sky, bot = o.bottomColor ?? C.navy;
  const out: Svg[] = [];
  if (o.hair === 'long') out.push(path('M44 22 C40 50 46 58 60 58 C74 58 80 50 76 22 Z', hc));
  // legs
  if (o.dress) out.push(path('M52 86 L51 110 L57 110 L58 86 Z M62 86 L63 110 L69 110 L68 86 Z', C.skin));
  else if (o.skirt) out.push(path('M52 84 L51 110 L57 110 L58 84 Z M62 84 L63 110 L69 110 L68 84 Z', C.skin), path('M46 66 L74 66 L80 88 L40 88 Z', bot));
  else out.push(path('M47 66 L73 66 L72 110 L62 110 L60 80 L58 110 L48 110 Z', bot));
  out.push(path('M48 108 L58 108 L58 114 L46 114 Z M62 108 L72 108 L74 114 L62 114 Z', o.shoes ?? C.black));
  // arms
  out.push(o.armsUp ? path('M46 40 L32 14 L40 10 L52 36 Z M74 40 L88 14 L80 10 L68 36 Z', o.jacket ?? top) : path('M46 38 L36 72 L43 74 L52 46 Z M74 38 L84 72 L77 74 L68 46 Z', o.jacket ?? top));
  out.push(o.armsUp ? circle(36, 10, 4, C.skin) + circle(84, 10, 4, C.skin) : circle(39, 76, 4, C.skin) + circle(81, 76, 4, C.skin));
  // torso
  if (o.dress) out.push(path('M48 34 L72 34 L74 50 L84 90 L36 90 L46 50 Z', o.dress));
  else out.push(path('M46 34 L74 34 L74 68 L46 68 Z', top));
  if (o.jacket) out.push(path('M46 34 L57 34 L57 70 L46 70 Z M63 34 L74 34 L74 70 L63 70 Z', o.jacket));
  if (o.lapels) out.push(path('M55 34 L60 46 L56 52 L52 36 Z M65 34 L60 46 L64 52 L68 36 Z', o.lapels, C.ink, 1.4));
  if (o.tie) out.push(path('M58 35 L62 35 L63 54 L60 58 L57 54 Z', o.tie, C.ink, 1.4));
  // head
  out.push(rect(56, 26, 8, 10, C.skin, 2, null), circle(60, 22, 11, C.skin));
  if (o.hair === 'short' || o.hair === undefined) out.push(path('M49 20 C49 6 71 6 71 20 C68 14 52 14 49 20 Z', hc));
  if (o.hair === 'long') out.push(path('M49 22 C47 6 73 6 71 22 C66 14 54 14 49 22 Z', hc));
  if (o.hair === 'bun') out.push(path('M49 20 C49 6 71 6 71 20 C68 14 52 14 49 20 Z', hc), circle(60, 7, 5, hc));
  out.push(circle(56, 23, 1.3, C.ink, null), circle(64, 23, 1.3, C.ink, null), line('M57 28 Q60 30 63 28', C.ink, 1.4));
  if (o.extra) out.push(o.extra);
  return g(`translate(${o.x ?? 0} 0) scale(${o.s ?? 1})`, ...out);
}

/** Wrap a drawing into a complete SVG with the paper background. */
export function scene(body: Svg, bg: string = C.paper): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-hidden="true" focusable="false"><rect width="120" height="120" rx="18" fill="${bg}"/>${body}</svg>`;
}
