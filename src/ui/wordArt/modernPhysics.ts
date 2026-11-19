/**
 * Matematik & naturvetenskap → Fysik → Modern fysik, 3361–3367 (0.50): atoms and subatomic particles,
 * electrons and quantum numbers, photons and quanta, radioactivity and nuclear reactions, relativity,
 * the basic ideas of quantum mechanics and particle accelerators.
 * Recurring signs: protons are red balls with +, neutrons grey balls, electrons small blue balls with −;
 * light is a yellow wavy arrow. The part the word names is orange (ring, frame, arrow or bar) and a grey
 * reference shows what the word is not. Close words share one layout where only the marked part differs:
 * atomnummer/masstal (the same nucleus and tile: protons and 6 marked, or every ball and 12 marked);
 * elektronskal/valenselektron/kvanttal (the same shell atom: one shell, the outer electron, or the shell
 * numbers marked); energinivå/grundtillstånd/kvantsprång (the same level ladder: the levels, the electron
 * on the lowest level, or the jump marked); alfa-/beta-/gammastrålning (one source and three shields:
 * paper, metal plate, lead; only the named ray is coloured); tidsdilatation/längdkontraktion (the same
 * fast rocket: its slow clock or its shortened body marked); kärnklyvning/kärnfusion (one nucleus split
 * in two versus two small nuclei joined); positron/elektron (same ball, + instead of −).
 * Digits and maths signs only; no words, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, sparkle, star, waGrow, waIn, waPulse, type Svg } from './kit';
import { HL, T, globe, sun } from './people';
import { P, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const NIGHT = '#232a3d';
const PRO = '#e85a5a';
const NEU = '#a9b1ba';
const ELE = '#3a8ae8';
const LIGHT = '#f2b705';
const EARTH = '#c9a77a';
const EARTH2 = '#a8865a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.4) => circle(x, y, r, 'none', col, sw);

/** Arrowhead with its tip at (x, y), pointing along angle a (radians). */
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
/** Wavy arrow (light) from (x1, y1) to (x2, y2). */
const wavy = (x1: number, y1: number, x2: number, y2: number, col: string = LIGHT, sw = 2.6, amp = 3.5, n = 4) => {
  const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a), Lw = L - 7;
  const pts = range(41).map((i) => { const t = (Lw * i) / 40, o = amp * Math.sin((t / Lw) * n * Math.PI * 2); return `${i ? 'L' : 'M'}${f1(x1 + t * c - o * s)} ${f1(y1 + t * s + o * c)}`; }).join(' ');
  return all(line(pts, col, sw), head(x2, y2, a, col, sw / 3 + 0.4));
};
/** Wave packet: a short wave with an envelope, travelling to the right. */
const packet = (x: number, y: number, w: number, col: string = LIGHT, amp = 8, sw = 2.6) => {
  const pts = range(61).map((i) => { const t = i / 60, env = Math.exp(-Math.pow((t - 0.5) / 0.22, 2)); return `${i ? 'L' : 'M'}${f1(x + t * w)} ${f1(y - amp * env * Math.sin(t * Math.PI * 10))}`; }).join(' ');
  return all(line(pts, col, sw), head(x + w + 6, y, 0, col, 1.1));
};

// ── Particles ────────────────────────────────────────────────────────
const proton = (x: number, y: number, r = 5) => all(circle(x, y, r, PRO, C.ink, 1), r >= 4 ? T(x, y + r * 0.45, '+', r * 1.3, C.white) : '');
const neutron = (x: number, y: number, r = 5) => circle(x, y, r, NEU, C.ink, 1);
const electron = (x: number, y: number, r = 3.4, col: string = ELE) => all(circle(x, y, r, col, C.ink, 1), r >= 3 ? line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, 1.1) : '');
/** A round cluster of p protons and n neutrons. */
const nucleus = (x: number, y: number, p: number, n: number, r = 5, greyP = false, greyN = false) => {
  const kinds: boolean[] = []; let pp = p, nn = n;
  while (pp + nn > 0) { if (pp > 0 && (pp >= nn || kinds.length % 2 === 0)) { kinds.push(true); pp--; } else { kinds.push(false); nn--; } }
  return all(...kinds.map((isP, i) => {
    const k = i === 0 ? 0 : Math.sqrt(i) * r * 0.95, a = i * 2.4;
    const px = f1(x + k * Math.cos(a)), py = f1(y + k * Math.sin(a));
    return isP ? (greyP ? greyed(proton(px, py, r)) : proton(px, py, r)) : (greyN ? greyed(neutron(px, py, r)) : neutron(px, py, r));
  }));
};
/** Shell atom: nucleus and rings with electrons. */
const SHELLS = [16, 29, 42];
const shellAtom = (x: number, y: number, counts: number[], o: { ring?: number; outer?: boolean; nums?: boolean } = {}) => all(
  ...counts.map((_, i) => circle(x, y, SHELLS[i]!, 'none', o.ring === i ? HL : C.grey, o.ring === i ? 4 : 1.4)),
  nucleus(x, y, 6, 5, 3.4),
  ...counts.flatMap((c, i) => range(c).map((j) => { const a = (j / c) * Math.PI * 2 - Math.PI / 2 + i * 0.4; const ex = f1(x + SHELLS[i]! * Math.cos(a)), ey = f1(y + SHELLS[i]! * Math.sin(a)); const outer = o.outer && i === counts.length - 1; return all(outer ? all(circle(ex, ey, 8, MARK, null), ring(ex, ey, 8)) : '', electron(ex, ey, 3.2)); })),
  ...(o.nums ? counts.map((_, i) => all(rect(x + SHELLS[i]! - 5.5, y - 5.5, 11, 11, MARK, 2, HL, 1.8), T(x + SHELLS[i]!, y + 3.5, String(i + 1), 9))) : []),
);
/** Energy level ladder: levels at these y values between x = 30 and 90. */
const LV = [98, 70, 50, 38];
const ladder = (marked = false) => all(bg(), ...LV.map((y) => line(`M30 ${y} L90 ${y}`, marked ? HL : C.grey, marked ? 3.4 : 2)), line('M20 104 L20 28', C.grey, 1.6), head(20, 26, -Math.PI / 2, C.grey, 0.9));
const trefoil = (x: number, y: number, s = 1) => {
  const blade = (rot: number) => g(`rotate(${rot})`, path('M0 -3 L-6.9 -15 A16 16 0 0 1 6.9 -15 Z', C.black, null));
  return at(x, y, s, circle(0, 0, 18, C.yellow, C.ink, 1.6), blade(0), blade(120), blade(240), circle(0, 0, 2.6, C.black, null));
};
const clockFace = (x: number, y: number, r: number, hour: number, col: string = C.white, stroke: string = C.ink) => {
  const a = (hour / 12) * Math.PI * 2 - Math.PI / 2;
  return all(circle(x, y, r, col, stroke, 1.8), ...range(12).map((i) => { const b = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.cos(b) * r * 0.82)} ${f1(y + Math.sin(b) * r * 0.82)} L${f1(x + Math.cos(b) * r * 0.95)} ${f1(y + Math.sin(b) * r * 0.95)}`, stroke, 1); }),
    line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.5)} ${f1(y + Math.sin(a) * r * 0.5)}`, stroke, 2.2), line(`M${x} ${y} L${x} ${f1(y - r * 0.75)}`, stroke, 1.4), circle(x, y, 1.6, stroke, null));
};
const rocket = (x: number, y: number, s = 1, len = 1, col: string = C.white) => at(x, y, s,
  path(`M${-20 * len} -7 L${14 * len} -7 C${22 * len} -5 ${26 * len} -2 ${28 * len} 0 C${26 * len} 2 ${22 * len} 5 ${14 * len} 7 L${-20 * len} 7 Z`, col, C.ink, 1.6),
  path(`M${-20 * len} -7 L${-26 * len} -14 L${-14 * len} -7 Z M${-20 * len} 7 L${-26 * len} 14 L${-14 * len} 7 Z`, C.red, C.ink, 1.2),
  circle(6 * len, 0, 3.4, '#9fd3f0', C.ink, 1.2), path(`M${-20 * len} -4 L${-30 * len} 0 L${-20 * len} 4 Z`, C.orange, null));
const speed = (x: number, y: number, n = 3, len = 16) => all(...range(n).map((i) => line(`M${x} ${y - 8 + i * 8} l${-len} 0`, C.grey, 1.6)));
const stars = (pts: [number, number][]) => all(...pts.map(([x, y]) => circle(x, y, 1, C.white, null)));
const STARS: [number, number][] = [[12, 14], [30, 22], [48, 10], [70, 18], [96, 12], [108, 30], [16, 46], [104, 60], [12, 84], [36, 96], [88, 100], [108, 92], [60, 104], [80, 40]];
const burst = (x: number, y: number, r: number, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.5 : r; return `${i ? 'L' : 'M'}${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`; }).join(' ') + ' Z';
  return path(pts, col, C.orange, 1.4);
};
const barrel = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -26, 20, 26, C.yellow, 2, C.ink, 1.6), line('M-10 -18 L10 -18 M-10 -8 L10 -8', C.ink, 1.2), trefoil(0, -13, 0.28));
const metalPlate = (x: number, y: number, h: number, w = 6, col: string = '#b8c2cc') => rect(x - w / 2, y - h / 2, w, h, col, 1, C.ink, 1.4);

export const MODERNPHYS_MOTIFS: Record<string, Svg> = {
  // ── 3361 Atomer och subatomära partiklar ─────────────────────────────
  /** subatomär: a small grey atom on the left; zoom lines lead to a big magnified circle with a proton, a neutron and an electron, each ringed in orange — the parts that are smaller than the atom. */
  'mfys.subatomär': all(bg(), greyed(circle(22, 60, 14, 'none', C.ink, 1.4), nucleus(22, 60, 2, 2, 2.4), electron(36, 60, 2)), line('M30 50 L56 22 M30 70 L56 98', C.grey, 1.2, '3 3'), circle(82, 60, 32, C.white, C.ink, 2), proton(70, 48, 8), ring(70, 48, 11), neutron(94, 52, 8), ring(94, 52, 11), electron(82, 78, 5), ring(82, 78, 8)),
  /** kvark: a big proton (red circle with +) opened up; inside it three small balls (red, green, blue) ringed in orange; a grey electron beside it has nothing inside. */
  'mfys.kvark': all(bg(), circle(56, 58, 36, '#f6c3c3', PRO, 2.6), T(30, 34, '+', 16, PRO), circle(46, 50, 8, '#e04848', C.ink, 1.2), circle(68, 52, 8, '#4f9d69', C.ink, 1.2), circle(56, 72, 8, '#3a6fd8', C.ink, 1.2), ring(46, 50, 11), ring(68, 52, 11), ring(56, 72, 11), greyed(electron(104, 92, 6))),
  /** periodiska systemet: a classroom wall with the periodic table: a tall first column, a short second, a low middle block and a stepped right block, cells in four soft colours; a pupil looks up at it. */
  'mfys.periodiska-systemet': (() => {
    const cells: Svg[] = []; const cw = 5.6, ch = 6.2, x0 = 10, y0 = 18;
    const cols = (c: number) => (c === 0 ? [0, 1, 2, 3, 4, 5, 6] : c === 1 ? [1, 2, 3, 4, 5, 6] : c < 12 ? [3, 4, 5, 6] : c === 17 ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6]);
    const col = (c: number) => (c < 2 ? '#f6b8a8' : c < 12 ? '#b8d8f0' : c < 17 ? '#bfe3b0' : '#e6c8f0');
    range(18).forEach((c) => cols(c).forEach((r) => cells.push(rect(x0 + c * cw, y0 + r * ch, cw - 0.8, ch - 0.8, col(c), 0.6, C.ink, 0.5))));
    return all(rect(4, 4, 112, 108, '#eef0e8', 3, null), rect(7, 14, 106, 50, C.white, 2, C.brown, 2), ...cells, ground, g('translate(60 0)', P({ x: 0, h: 0.5, top: C.green })));
  })(),
  /** atomnummer: a nucleus of 6 protons and 6 neutrons where only the protons are bright and the neutrons grey; beside it a tile whose big top number 6 is framed in orange (the 12 below is grey). */
  'mfys.atomnummer': all(bg(), nucleus(40, 60, 6, 6, 7, false, true), circle(40, 60, 30, 'none', HL, 2.4), rect(78, 30, 32, 60, C.white, 3, C.ink, 1.8), rect(81, 34, 26, 24, MARK, 3, HL, 2.4), T(94, 53, '6', 20), greyed(T(94, 82, '12', 13))),
  /** masstal: the same nucleus and tile, but every ball (protons and neutrons) is bright and the bottom number 12 is framed in orange; the 6 above is grey. */
  'mfys.masstal': all(bg(), nucleus(40, 60, 6, 6, 7), circle(40, 60, 30, 'none', HL, 2.4), rect(78, 30, 32, 60, C.white, 3, C.ink, 1.8), greyed(T(94, 52, '6', 18)), rect(81, 64, 26, 24, MARK, 3, HL, 2.4), T(94, 82, '12', 15)),
  /** elektronmoln: a tiny nucleus in the middle of a soft blue cloud of dots that is dense near the centre and thin at the edge, framed in orange; no orbits. */
  'mfys.elektronmoln': all(bg(), circle(60, 58, 44, 'rgba(58,138,232,0.10)', HL, 2.4), circle(60, 58, 30, 'rgba(58,138,232,0.12)', null), circle(60, 58, 16, 'rgba(58,138,232,0.15)', null),
    ...range(90).map((i) => { const r = 44 * Math.sqrt((i * 0.61803) % 1) * ((i % 3) / 3 + 0.5) * 0.85, a = i * 2.39996; return circle(f1(60 + r * Math.cos(a)), f1(58 + r * Math.sin(a)), 1.4, ELE, null); }), nucleus(60, 58, 3, 3, 2.6)),
  /** atommodell: a school model on a table: a cluster of red and grey balls on a stand, with two wire rings carrying blue balls; a pupil stands beside it. */
  'mfys.atommodell': all(bg('#f3efe6'), rect(8, 86, 80, 6, C.tan, 2, C.ink, 1.6), line('M14 92 L14 112 M82 92 L82 112', C.brown, 3), line('M48 86 L48 66', C.dark, 2.4), rect(40, 84, 16, 3, C.dark, 1, null),
    ellipse(48, 52, 34, 12, 'none', '#8a8f96', 1.8), g('rotate(60 48 52)', ellipse(48, 52, 34, 12, 'none', '#8a8f96', 1.8)), nucleus(48, 52, 3, 3, 4.4), electron(82, 52, 4.4), electron(14, 52, 4.4), electron(65, 81, 4.4), electron(31, 23, 4.4), ground, g('translate(100 0)', P({ x: 0, h: 0.62, top: C.orange, mood: 'smile' }))),

  // ── 3362 Elektroner och kvanttal ──────────────────────────────────────
  /** elektronskal: an atom with three rings of electrons; the middle ring (shell) is drawn thick orange, the others thin grey. */
  'mfys.elektronskal': all(bg(), shellAtom(60, 58, [2, 8, 1], { ring: 1 })),
  /** valenselektron: the same atom; only the single electron on the outermost ring is ringed and highlighted. */
  'mfys.valenselektron': all(bg(), shellAtom(60, 58, [2, 8, 1], { outer: true })),
  /** kvanttal: the same atom with small orange tags 1, 2 and 3 on the three rings. */
  'mfys.kvanttal': all(bg(), shellAtom(56, 62, [2, 8, 1], { nums: true })),
  /** energinivå (i atomen): an energy ladder of four horizontal levels (closer together higher up), all drawn in orange; a blue electron sits on the second level. */
  'mfys.energinivå.2': all(ladder(true), electron(60, LV[1]! - 4, 4)),
  /** grundtillstånd: the same ladder in grey; the bottom level is marked in yellow and orange and the electron sits on it; the upper levels are empty. */
  'mfys.grundtillstånd': all(ladder(), waPulse('b4-mfys-grundtillstand-1', rect(26, LV[0]! - 6, 68, 12, MARK, 3, HL, 2)), line(`M30 ${LV[0]} L90 ${LV[0]}`, C.ink, 2.4), electron(60, LV[0]! - 4, 4.4)),
  /** kvantsprång: the same grey ladder; a faded electron on the bottom level, a bright electron on the top level, and a big orange arc arrow jumping straight from one to the other. */
  'mfys.kvantsprång': all(ladder(), greyed(electron(46, LV[0]! - 4, 4.4)), path(`M48 ${LV[0]! - 10} C40 60 60 30 70 ${LV[3]! - 6}`, 'none', HL, 3.4), head(71, LV[3]! - 6, -0.5, HL, 1.3), waIn('b4-mfys-kvantsprang-1', -32, 50, electron(78, LV[3]! - 4, 4.4)), sparkle(88, 30, 4, C.gold)),
  /** sända ut: a glowing ball (like a lamp or a hot atom) in the middle sends orange wavy arrows outward in all directions. */
  'mfys.sända-ut': all(bg(NIGHT), circle(60, 60, 14, C.yellow, C.ink, 1.6), circle(60, 60, 20, 'none', 'rgba(242,193,78,0.5)', 4), waGrow('b4-mfys-sanda-ut-1', ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return wavy(f1(60 + Math.cos(a) * 24), f1(60 + Math.sin(a) * 24), f1(60 + Math.cos(a) * 50), f1(60 + Math.sin(a) * 50), HL, 2.4, 2.4, 2); }))),
  /** spinn: a big blue electron with an orange arrow curling round it and an orange arrow pointing up through it; beside it a small grey electron with an arrow pointing down. */
  'mfys.spinn': all(bg(), ellipse(48, 60, 34, 10, 'none', HL, 3), head(20, 64, Math.PI * 0.9, HL, 1.3), electron(48, 60, 18), line('M48 98 L48 22', HL, 3.4), head(48, 16, -Math.PI / 2, HL, 1.4), greyed(electron(98, 64, 9), line('M98 44 L98 84', C.ink, 2.4), head(98, 90, Math.PI / 2, C.ink, 1))),
  /** jon: left a grey neutral atom (3 protons, 3 electrons); right the same atom with one electron flying away (dashed empty place) and a big orange + tag. */
  'mfys.jon': all(bg(), greyed(circle(30, 60, 20, 'none', C.ink, 1.2), nucleus(30, 60, 3, 3, 3.4), electron(30, 40, 3.2), electron(47, 70, 3.2), electron(13, 70, 3.2)), circle(84, 60, 20, 'none', C.grey, 1.4), nucleus(84, 60, 3, 3, 3.4), electron(101, 70, 3.2), electron(67, 70, 3.2), circle(84, 40, 3.2, 'none', C.grey, 1.2), arr(86, 36, 104, 14, C.grey, 1.6, '3 2'), electron(108, 12, 3.2), circle(84, 94, 10, MARK, HL, 2.6), T(84, 99.5, '+', 16, HL)),
  /** fyrverkeri: fireworks — three big coloured bursts in a night sky over a dark city skyline. */
  'mfys.fyrverkeri': all(bg(NIGHT), ...[[34, 34, '#ef5a5a'], [80, 26, '#7fd36a'], [62, 58, '#f2c14e']].map(([x, y, c]) => all(...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return all(line(`M${f1((x as number) + Math.cos(a) * 5)} ${f1((y as number) + Math.sin(a) * 5)} L${f1((x as number) + Math.cos(a) * 18)} ${f1((y as number) + Math.sin(a) * 18)}`, c as string, 2), circle(f1((x as number) + Math.cos(a) * 20), f1((y as number) + Math.sin(a) * 20), 1.6, c as string, null)); }))),
    path('M4 112 L4 92 L16 92 L16 84 L28 84 L28 96 L40 96 L40 80 L50 80 L50 90 L64 90 L64 86 L78 86 L78 94 L90 94 L90 82 L104 82 L104 98 L116 98 L116 112 Z', '#11151f', null), line('M40 96 L46 70', 'rgba(242,193,78,0.6)', 1.4, '2 3')),

  // ── 3363 Fotoner och kvanta ───────────────────────────────────────────
  /** foton: a lamp on the left sends out one single tiny ball of light — a glowing yellow dot with a little wave drawn inside it, ringed in orange — that flies along a faint wavy trail and hits a big eye on the right. */
  'mfys.foton': all(bg(NIGHT), circle(16, 40, 8, C.yellow, C.ink, 1.4), rect(12, 28, 8, 5, C.grey, 1, null), line(range(31).map((i) => `${i ? 'L' : 'M'}${f1(26 + i * 1.3)} ${f1(46 + i * 0.4 - 2.5 * Math.sin(i * 0.9))}`).join(' '), 'rgba(242,193,78,0.45)', 1.6, '2 2'),
    circle(66, 60, 14, '#fff3b0', null), circle(66, 60, 10, '#ffe066', C.ink, 1.2), line(range(17).map((i) => `${i ? 'L' : 'M'}${f1(58 + i)} ${f1(60 - 3.4 * Math.sin(i * 0.8))}`).join(' '), C.orange, 1.6), ring(66, 60, 17), arr(83, 61, 88, 62, LIGHT, 2.2),
    path('M90 62 C96 52 108 52 112 62 C108 72 96 72 90 62 Z', C.white, C.ink, 1.6), circle(99, 62, 5, C.navy, null), circle(98, 62, 2.2, C.ink, null), line('M92 52 C98 46 106 46 111 52', C.ink, 1.4)),
  /** kvantum: left a grey tap with a smooth unbroken stream (reference); right identical yellow energy cubes with a lightning mark fall one at a time, the front cube ringed in orange. */
  'mfys.kvantum': all(bg(), greyed(rect(14, 20, 22, 8, C.grey, 2, C.ink, 1.2), rect(30, 26, 6, 8, C.grey, 1, C.ink, 1), path('M31 34 L35 34 L35 104 L31 104 Z', '#8cc7e8', null), rect(20, 100, 26, 8, C.grey2, 2, C.ink, 1)), line('M58 10 L58 110', C.grey2, 1.4, '3 3'),
    ...[24, 46, 68, 90].map((y, i) => all(rect(76, y - 8, 16, 16, C.yellow, 2, C.ink, 1.4), path(`M${84 + 1} ${y - 6} L${84 - 3} ${y + 1} L${84} ${y + 1} L${84 - 1} ${y + 6} L${84 + 3} ${y - 1} L${84} ${y - 1} Z`, C.orange, null), i === 3 ? ring(84, y, 13) : '')), arr(100, 30, 100, 80, C.grey, 1.6)),
  /** fotoelektrisk effekt: a yellow-violet wavy light ray hits a grey metal plate from the upper left, and blue electrons fly off the plate up to the right with orange arrows. */
  'mfys.fotoelektrisk-effekt': all(bg(), rect(10, 82, 100, 14, '#b8c2cc', 2, C.ink, 1.8), line('M14 92 L106 92', '#9aa3ad', 1), wavy(14, 16, 50, 80, '#8a5bd6', 2.8, 3, 5), wavy(30, 12, 62, 78, '#8a5bd6', 2.8, 3, 5), waIn('b4-mfys-fotoelektrisk-effekt-1', -9, 11, arr(66, 80, 92, 46, HL, 2.4)), electron(98, 40, 5), waIn('b4-mfys-fotoelektrisk-effekt-2', -5, 13, arr(58, 80, 74, 34, HL, 2.4)), electron(77, 28, 5), sparkle(60, 82, 5, C.gold)),
  /** fotocell: a pair of glass sliding doors opening; a small box on each side shoots a thin red dashed beam across the doorway, and a walking person breaks the beam; the box is ringed in orange. */
  'mfys.fotocell': all(bg('#eef2f5'), rect(8, 14, 104, 10, C.dark, 1, null), rect(10, 24, 30, 88, 'rgba(191,227,245,0.7)', 1, C.ink, 1.6), rect(80, 24, 30, 88, 'rgba(191,227,245,0.7)', 1, C.ink, 1.6), arr(36, 50, 28, 50, C.grey, 1.4), arr(84, 50, 92, 50, C.grey, 1.4), rect(40, 84, 6, 8, C.dark, 1, C.ink, 1), rect(74, 84, 6, 8, C.dark, 1, C.ink, 1), line('M46 88 L52 88 M68 88 L74 88', C.red, 1.8, '3 2'), ring(43, 88, 7), ground, g('translate(60 0)', P({ x: 0, h: 0.86, top: C.orange }))),
  /** glöda: a dark stove top seen from the front: one hotplate glows bright red-orange with heat shimmer above it; the other plate is black and cold. */
  'mfys.glöda': all(bg('#f3efe6'), rect(8, 70, 104, 16, C.white, 2, C.ink, 1.8), rect(8, 86, 104, 26, C.white, 2, C.ink, 1.8), ellipse(36, 70, 22, 6, '#2e2e36', C.ink, 1.4), waPulse('b4-mfys-gloda-1', ellipse(84, 70, 22, 6, '#ff5a1f', '#b0300a', 1.6)), ellipse(84, 70, 15, 4, '#ffb347', null), ellipse(84, 70, 7, 2, '#fff1a8', null), ...[72, 84, 96].map((x) => line(`M${x} 58 C${x - 4} 52 ${x + 4} 46 ${x} 40`, 'rgba(239,90,31,0.6)', 1.8)), circle(30, 98, 4, C.grey2, C.ink, 1), circle(90, 98, 4, C.red, C.ink, 1)),
  /** spektrallinje: on top a grey full rainbow band (reference); below a dark strip with only four thin bright lines (red, turquoise, blue, violet), framed in orange. */
  'mfys.spektrallinje': all(bg(), greyed(...range(30).map((i) => rect(12 + i * 3.2, 20, 3.4, 22, `hsl(${f1(i * 9)},80%,55%)`, 0, null))), rect(10, 60, 100, 26, '#141824', 2, HL, 2.6), ...[[26, '#e23b3b'], [64, '#3ad6d6'], [82, '#3a6fe8'], [92, '#8a4fe0']].map(([x, c]) => rect(x as number, 62, 2.6, 22, c as string, 0, null))),

  // ── 3364 Radioaktivitet och kärnreaktioner ────────────────────────────
  /** radioaktivitet: a grey stone on the ground sends out small dots and wavy arrows in every direction (rays it gives off by itself); a yellow radiation warning sign on a post stands beside it. */
  'mfys.radioaktivitet': all(bg(), ground, path('M24 108 C20 92 34 80 50 82 C66 78 78 92 74 108 Z', '#8f969e', C.ink, 1.8), line('M34 94 L42 90 M54 96 L60 92', C.dark, 1.2), waGrow('b4-mfys-radioaktivitet-1', ...range(7).map((i) => { const a = Math.PI + (i / 6) * Math.PI; return wavy(f1(49 + Math.cos(a) * 30), f1(92 + Math.sin(a) * 18), f1(49 + Math.cos(a) * 46), f1(92 + Math.sin(a) * 40), HL, 2.2, 2, 2); })), circle(22, 60, 2.4, HL, null), circle(78, 56, 2.4, HL, null), line('M100 112 L100 64', C.dark, 2.4), trefoil(100, 50, 0.7)),
  /** sönderfall: a big nucleus on the left, an arrow, and on the right a slightly smaller nucleus with a small 2+2 cluster shooting away from a star-shaped flash (the moment it breaks). */
  'mfys.sönderfall': all(bg(), nucleus(24, 60, 9, 10, 3.8), arr(44, 60, 58, 60, C.grey, 2), nucleus(78, 66, 8, 9, 3.8), burst(92, 50, 8, '#ffe58a'), nucleus(104, 34, 2, 2, 3.8), ring(104, 34, 10), arr(96, 44, 100, 40, HL, 2)),
  /** alfastrålning: a source box with a warning sign; three rays go right towards a sheet of paper, a metal plate and a thick lead block. Only the top ray (big balls) is coloured and stops at the paper; the other two are grey. */
  'mfys.alfastrålning': rays(0),
  /** betastrålning: the same layout; only the middle ray (small dots) is coloured and stops at the metal plate. */
  'mfys.betastrålning': rays(1),
  /** gammastrålning: the same layout; only the bottom wavy ray is coloured; it goes through the paper and the metal plate and is stopped only by the thick lead block. */
  'mfys.gammastrålning': rays(2),
  /** geigermätare: a hand-held box with a dial and a wand on a cable held over a stone; jagged click marks jump out of the box. */
  'mfys.geigermätare': all(bg(), ground, path('M64 108 C60 98 70 92 82 94 C94 92 102 100 98 108 Z', '#8f969e', C.ink, 1.6), rect(10, 50, 40, 30, C.yellow, 4, C.ink, 1.8), path('M18 62 A12 12 0 0 1 42 62', '#fffbe0', C.ink, 1.4), line('M30 64 L38 54', C.red, 1.8), circle(30, 64, 1.6, C.ink, null), rect(16, 68, 6, 6, C.dark, 1, null), path('M48 78 C60 90 66 74 70 82', 'none', C.ink, 1.6), rect(66, 76, 22, 7, C.dark, 3, C.ink, 1.2), line('M20 40 L24 30 L28 40 L32 30 M40 40 L44 32 L48 40', HL, 2), line('M6 46 L10 40', HL, 2)),
  /** stråldos: a person stands while small orange arrows rain down from the sky; next to the person a measuring glass is half filled with orange (how much the person has received). */
  'mfys.stråldos': all(bg('#e9f2f8'), ground, ...[[20, 10], [40, 18], [56, 8], [72, 16], [30, 30], [66, 34]].map(([x, y]) => arr(x!, y!, x! + 4, y! + 14, HL, 1.8)), g('translate(46 0)', P({ x: 0, h: 0.84, top: C.denim })), rect(84, 52, 20, 56, C.white, 3, C.ink, 1.8), rect(86, 82, 16, 24, HL, 2, null), ...[62, 72, 82, 92].map((y) => line(`M84 ${y} L90 ${y}`, C.ink, 1))),
  /** radon: a house cut open: purple dots rise from the ground through the floor into the basement; a small measuring canister stands on the basement floor, ringed in orange. */
  'mfys.radon': all(bg('#e9f2f8'), rect(4, 64, 112, 48, EARTH, 0, null), path('M24 64 L24 34 L60 12 L96 34 L96 64 Z', '#f3e6d0', C.ink, 1.8), rect(52, 44, 14, 20, C.brown, 1, C.ink, 1.4), rect(28, 64, 64, 30, '#ddd5c4', 0, C.ink, 1.8), line('M28 94 L92 94', C.ink, 2.4), ...range(18).map((i) => circle(f1(32 + ((i * 37) % 58)), f1(108 - ((i * 23) % 40)), 1.8, C.purple, null)), rect(72, 84, 8, 10, C.white, 2, C.ink, 1.2), ring(76, 89, 9)),
  /** kärnklyvning: a small grey neutron hits a big nucleus from the left; on the right the nucleus has split into two medium nuclei that fly apart from a flash, with three neutrons flying out. */
  'mfys.kärnklyvning': all(bg(), neutron(10, 60, 4), arr(16, 60, 26, 60, C.grey, 2), nucleus(40, 60, 10, 12, 3.4), arr(56, 60, 66, 60, C.grey, 2), burst(80, 60, 12, '#ffe58a'), nucleus(96, 34, 5, 6, 3.4), nucleus(96, 88, 5, 6, 3.4), waIn('b4-mfys-karnklyvning-1', -4, 5, arr(84, 50, 90, 42, HL, 2.4)), waIn('b4-mfys-karnklyvning-2', -4, -5, arr(84, 70, 90, 78, HL, 2.4)), neutron(108, 60, 3.4), neutron(70, 26, 3.4), neutron(66, 96, 3.4), circle(80, 60, 34, 'none', HL, 2.2)),
  /** kärnfusion: two small nuclei come in from left and right and join in the middle into one bigger nucleus with a bright flash; a sun in the corner. */
  'mfys.kärnfusion': all(bg(NIGHT), sun(102, 18, 8), circle(102, 18, 8, C.yellow, null), nucleus(16, 70, 1, 1, 4), waIn('b4-mfys-karnfusion-1', -8, -0, arr(26, 70, 40, 70, HL, 2.4)), nucleus(104, 70, 1, 2, 4), waIn('b4-mfys-karnfusion-2', 8, -0, arr(94, 70, 80, 70, HL, 2.4)), burst(60, 70, 18, '#ffe58a'), nucleus(60, 70, 2, 2, 4.4), circle(60, 70, 26, 'none', HL, 2.2)),
  /** kärnreaktor: a reactor cut open behind thick concrete walls: a steel tank of glowing blue water with yellow fuel rods standing in it and dark control rods coming down from above. */
  'mfys.kärnreaktor': all(bg(), rect(12, 30, 96, 82, '#c9ced4', 2, C.ink, 1.8), rect(24, 40, 72, 66, '#9aa3ad', 3, C.ink, 1.8), rect(30, 46, 60, 56, 'rgba(70,170,255,0.55)', 2, null), rect(30, 46, 60, 56, 'none', 2, '#7fd6ff', 2), ...[38, 50, 62, 74].map((x) => rect(x, 64, 7, 36, C.yellow, 1, C.ink, 1.2)), ...[44, 56, 68, 80].map((x) => rect(x + 0.5, 22, 4, 48, C.dark, 1, C.ink, 1)), rect(20, 18, 80, 6, C.grey, 1, C.ink, 1.4), ring(60, 80, 30, HL, 2.4)),
  /** kärnavfall: yellow barrels with radiation warning signs stacked in a grey storage hall. */
  'mfys.kärnavfall': all(bg('#e4e7ea'), ground, rect(4, 40, 112, 4, C.grey, 0, null), barrel(24, 112, 1.2), barrel(50, 112, 1.2), barrel(76, 112, 1.2), barrel(37, 80, 1.2), barrel(63, 80, 1.2), barrel(100, 112, 1.2)),
  /** slutförvar: a cut through the ground: a small building on the surface, a long shaft straight down through the rock, and at the bottom a tunnel with copper canisters standing in holes; a depth arrow shows 500. */
  'mfys.slutförvar': all(bg('#e9f2f8'), rect(4, 26, 112, 86, '#b0a89a', 0, null), ...range(8).map((i) => line(`M${4 + i * 16} ${40 + (i % 3) * 18} l10 4`, '#8f877a', 1.2)), rect(30, 14, 22, 12, C.white, 1, C.ink, 1.4), rect(38, 26, 6, 70, '#e8e4dc', 0, C.ink, 1.2), rect(20, 94, 90, 12, '#e8e4dc', 2, C.ink, 1.4), ...[54, 68, 82, 96].map((x) => all(rect(x - 4, 98, 8, 14, '#d07a3a', 2, C.ink, 1.2))), line('M14 26 L14 98', HL, 2), head(14, 100, Math.PI / 2, HL, 1), head(14, 24, -Math.PI / 2, HL, 1), T(90, 62, '500', 13, C.ink)),

  // ── 3365 Relativitetsteori ────────────────────────────────────────────
  /** rymdskepp: a spaceship with windows flying through space among stars, a flame behind it. */
  'mfys.rymdskepp': all(bg(NIGHT), stars(STARS), rocket(62, 60, 1.5), circle(86, 96, 10, '#d9a46b', null)),
  /** astronaut: an astronaut in a white suit with a gold visor floating in space above the blue Earth. */
  'mfys.astronaut': all(bg(NIGHT), stars(STARS), path('M4 112 C30 88 90 88 116 112 Z', '#4a8fd6', null), path('M30 104 C40 98 50 100 56 106', 'none', '#6fbf73', 4),
    g('rotate(-15 60 52)', rect(48, 46, 24, 30, C.white, 8, C.ink, 1.8), rect(52, 52, 16, 10, C.grey2, 2, C.ink, 1), circle(60, 36, 13, C.white, C.ink, 1.8), ellipse(60, 37, 9, 7, '#e0b23c', C.ink, 1.4), rect(36, 48, 12, 8, C.white, 4, C.ink, 1.6), rect(72, 48, 12, 8, C.white, 4, C.ink, 1.6), rect(50, 76, 8, 14, C.white, 3, C.ink, 1.6), rect(62, 76, 8, 14, C.white, 3, C.ink, 1.6))),
  /** tidsdilatation: above, a fast rocket (speed lines) carrying a clock that shows 1 o'clock, ringed in orange; below, a grey person on the ground with a clock that shows 4 o'clock. */
  'mfys.tidsdilatation': all(bg(NIGHT), stars(STARS.slice(0, 6)), speed(30, 30, 3, 20), rocket(66, 30, 1.1), clockFace(66, 58, 11, 1), ring(66, 58, 14), rect(4, 82, 112, 30, '#6b7a94', 0, null), greyed(g('translate(26 0)', P({ x: 0, h: 0.5, top: C.green })), clockFace(70, 96, 11, 4))),
  /** längdkontraktion: above, a dashed grey outline of the rocket at rest (full length); below, the same rocket flying fast with speed lines, clearly shorter, with an orange length bracket under it. */
  'mfys.längdkontraktion': all(bg(NIGHT), stars(STARS.slice(6)), greyed(rocket(62, 34, 1.3, 1)), line('M28 52 L28 56 L98 56 L98 52', C.grey, 1.4), speed(44, 82, 3, 22), rocket(70, 82, 1.3, 0.55), line('M55 100 L55 104 L91 104 L91 100', HL, 2.4)),
  /** tvillingparadox: twins side by side: one old with grey hair and a stick, one young in a space suit holding a helmet; a rocket stands behind them. */
  'mfys.tvillingparadox': all(bg('#e9f2f8'), ground, g('rotate(-90 94 60)', rocket(94, 60, 1.3)), g('translate(30 0)', P({ x: 0, h: 0.86, top: C.purple, hair: C.grey2, mood: 'calm' })), line('M14 78 L12 112', C.brown, 2.4), g('translate(66 0)', P({ x: 0, h: 0.86, top: C.white, mood: 'smile' })), circle(80, 84, 6, C.white, C.ink, 1.4), ellipse(80, 84, 4, 3, '#e0b23c', null)),
  /** atomur: a big precise clock whose dial has a small atom (nucleus and orbits) in the middle; tiny tick marks all round and a ring of orange around the atom. */
  'mfys.atomur': all(bg(), rect(16, 14, 88, 92, C.dark, 8, C.ink, 2), circle(60, 60, 36, C.white, C.ink, 1.8), ...range(60).map((i) => { const b = (i / 60) * Math.PI * 2, r1 = i % 5 ? 32 : 28; return line(`M${f1(60 + Math.cos(b) * r1)} ${f1(60 + Math.sin(b) * r1)} L${f1(60 + Math.cos(b) * 35)} ${f1(60 + Math.sin(b) * 35)}`, C.ink, i % 5 ? 0.6 : 1.4); }), ellipse(60, 60, 14, 5, 'none', ELE, 1.2), g('rotate(60 60 60)', ellipse(60, 60, 14, 5, 'none', ELE, 1.2)), g('rotate(120 60 60)', ellipse(60, 60, 14, 5, 'none', ELE, 1.2)), circle(60, 60, 3, PRO, null), ring(60, 60, 18), line('M60 60 L60 30', C.red, 1.2)),
  /** svart hål: a black disk in space with a bright orange swirling ring of matter around it; a yellow light ray bends and falls into it. */
  'mfys.svart-hål': all(bg(NIGHT), stars(STARS), ellipse(60, 62, 46, 14, 'none', '#ff9a3c', 6), ellipse(60, 62, 38, 10, 'none', '#ffd27a', 2.4), circle(60, 60, 20, '#000000', '#ff9a3c', 1.6), path('M60 52 A20 20 0 0 1 80 62', 'none', 'rgba(255,210,122,0.9)', 2), path('M8 24 C40 26 52 34 56 46', 'none', LIGHT, 2.2), head(57, 48, 1.3, LIGHT, 1)),

  // ── 3366 Kvantmekanikens grundidéer ──────────────────────────────────
  /** kvantmekanik: a big magnifying glass held over a tiny dot; inside the lens a blurry blue electron cloud, a small wave and a die — the strange rules of the very smallest things. */
  'mfys.kvantmekanik': all(bg(), circle(56, 52, 36, C.white, C.ink, 3), line('M82 78 L106 104', C.brown, 8), circle(56, 52, 30, 'rgba(58,138,232,0.10)', null), ...range(40).map((i) => { const r = 22 * Math.sqrt((i * 0.618) % 1), a = i * 2.4; return circle(f1(48 + r * 0.7 * Math.cos(a)), f1(46 + r * 0.7 * Math.sin(a)), 1.2, ELE, null); }), circle(48, 46, 3, PRO, null), packet(30, 74, 30, ELE, 5, 2), rect(66, 54, 14, 14, C.white, 3, C.ink, 1.4), circle(70, 58, 1.4, C.ink, null), circle(76, 64, 1.4, C.ink, null), circle(73, 61, 1.4, C.ink, null), ring(56, 52, 39, HL, 2.2), circle(14, 104, 1.6, C.ink, null)),
  /** våg-partikeldualitet: the same blue electron drawn twice side by side, as a ball and as a wave, with a + between them and one orange frame around both. */
  'mfys.våg-partikeldualitet': all(bg(), rect(8, 36, 104, 48, MARK, 6, HL, 2.6), electron(28, 60, 12), T(52, 66, '+', 18), line(range(41).map((i) => `${i ? 'L' : 'M'}${f1(64 + i * 1.1)} ${f1(60 - 12 * Math.sin((i / 40) * Math.PI * 4))}`).join(' '), ELE, 3)),
  /** dubbelspalt: a lamp on the left, a dark plate in the middle with two narrow openings (ringed in orange), and on the wall to the right a row of bright and dark stripes. */
  'mfys.dubbelspalt': all(bg(), circle(14, 60, 7, C.yellow, C.ink, 1.4), ...[28, 36].map((x) => path(`M${x} 44 A18 18 0 0 1 ${x} 76`, 'none', LIGHT, 1.8)), rect(48, 18, 6, 34, C.dark, 1, null), rect(48, 56, 6, 8, C.dark, 1, null), rect(48, 68, 6, 34, C.dark, 1, null), ring(51, 54, 5, HL, 2), ring(51, 66, 5, HL, 2), ...[58, 66, 74].map((x) => all(path(`M${x} 46 A12 12 0 0 1 ${x} 62`, 'none', LIGHT, 1.4), path(`M${x} 58 A12 12 0 0 1 ${x} 74`, 'none', LIGHT, 1.4))), rect(96, 16, 14, 88, '#141824', 1, C.ink, 1.4), ...range(7).map((i) => rect(98, 22 + i * 12, 10, 5, `rgba(255,230,120,${f1(1 - Math.abs(i - 3) * 0.22)})`, 1, null))),
  /** osäkerhetsprincip: two panels. Top: a sharp dot (place known) with a blurred fan of grey arrows (direction unknown). Bottom: a blurred smear (place unknown) with one clear orange arrow (direction known). */
  'mfys.osäkerhetsprincip': all(bg(), rect(8, 8, 104, 50, C.white, 3, C.ink, 1.4), rect(8, 62, 104, 46, C.white, 3, C.ink, 1.4), circle(30, 33, 4.4, ELE, C.ink, 1), ring(30, 33, 8), ...range(7).map((i) => { const a = -0.9 + i * 0.3; return arr(38, 33, f1(38 + Math.cos(a) * 54), f1(33 + Math.sin(a) * 22), 'rgba(154,163,173,0.7)', 1.6); }),
    ellipse(34, 85, 22, 12, 'rgba(58,138,232,0.25)', null), ellipse(34, 85, 14, 8, 'rgba(58,138,232,0.35)', null), ellipse(34, 85, 6, 4, 'rgba(58,138,232,0.45)', null), arr(58, 85, 104, 85, HL, 3)),
  /** superposition: a coin spinning on a table, blurred, half gold and half silver at once, with orange motion arcs around it. */
  'mfys.superposition': all(bg(), rect(8, 86, 104, 6, C.tan, 2, C.ink, 1.6), line('M16 92 L16 112 M104 92 L104 112', C.brown, 3), moving('b4-mfys-superposition-1', '0%,100%{transform:scaleX(1)}50%{transform:scaleX(-1)}', { dur: 1.6, spin: true }, path('M60 30 A10 26 0 0 0 60 82 Z', C.gold, C.ink, 1.4)), path('M60 30 A10 26 0 0 1 60 82 Z', C.silver, C.ink, 1.4), ellipse(60, 56, 20, 27, 'none', 'rgba(224,178,60,0.35)', 2), path('M30 46 A32 12 0 0 0 30 66', 'none', HL, 2.4), head(31, 68, 1.4, HL, 1), path('M90 66 A32 12 0 0 0 90 46', 'none', HL, 2.4), head(89, 44, -1.7, HL, 1), circle(60, 84, 1.6, C.ink, null)),
  /** Schrödingers katt: a closed cardboard box; through it a dashed outline of a sitting cat, half drawn sharp and half faded, and a big orange question mark above. */
  'mfys.Schrödingers-katt': all(bg(), ground, path('M14 54 L94 54 L106 44 L26 44 Z', '#e0b880', C.ink, 1.6), rect(14, 54, 80, 58, C.tan, 2, C.ink, 1.8), path('M94 54 L106 44 L106 102 L94 112 Z', '#b98a52', C.ink, 1.6), path('M40 106 C34 84 44 72 54 72 L50 62 L56 68 L64 68 L70 62 L66 72 C76 72 82 86 74 106 Z', 'rgba(255,255,255,0.35)', C.ink, 1.6), circle(54, 80, 1.6, C.ink, null), line('M63 78 L68 82 M68 78 L63 82', C.grey, 1.4), T(60, 38, '?', 30, HL)),
  /** tunneleffekt: a tall grey wall; on the left a grey ball rolls up and bounces back (arrow back); an orange dashed path goes straight through the wall and a blue ball comes out on the other side. */
  'mfys.tunneleffekt': all(bg(), ground, rect(54, 28, 14, 84, '#9aa3ad', 2, C.ink, 1.8), greyed(circle(30, 98, 8, ELE, C.ink, 1.2), arr(40, 86, 48, 80, C.ink, 1.6), arr(46, 72, 36, 78, C.ink, 1.6)), waPulse('b4-mfys-tunneleffekt-1', line('M18 70 L100 70', HL, 2.6, '5 4')), head(104, 70, 0, HL, 1.2), circle(92, 98, 8, ELE, C.ink, 1.4), ring(92, 98, 12)),
  /** sammanflätning: two blue particles far apart, one with an arrow up and one with an arrow down, joined by an orange wavy dashed band across the whole picture. */
  'mfys.sammanflätning': all(bg(NIGHT), stars(STARS.slice(0, 8)), waPulse('b4-mfys-sammanflatning-1', line(range(41).map((i) => `${i ? 'L' : 'M'}${f1(22 + i * 1.9)} ${f1(60 - 6 * Math.sin((i / 40) * Math.PI * 6))}`).join(' '), HL, 2.6, '4 3')), electron(18, 60, 10), electron(102, 60, 10), arr(18, 46, 18, 22, C.white, 2.4), arr(102, 74, 102, 98, C.white, 2.4)),
  /** kvantdator: a golden chandelier-like machine hanging from the ceiling: stacked gold discs getting smaller downwards, joined by coiled silver tubes. */
  'mfys.kvantdator': all(bg('#eef0f4'), rect(4, 4, 112, 8, C.dark, 0, null), line('M60 12 L60 22', C.dark, 3), ...[[22, 40], [44, 32], [64, 24], [82, 16]].map(([y, w]) => ellipse(60, y!, w!, 5, C.gold, C.ink, 1.4)), ...[-24, -10, 10, 24].map((dx) => path(`M${60 + dx} 24 C${60 + dx * 0.9 - 4} 30 ${60 + dx * 0.9 + 4} 36 ${60 + dx * 0.8} 44`, 'none', C.silver, 2)), ...[-18, 0, 18].map((dx) => path(`M${60 + dx} 46 C${60 + dx - 4} 52 ${60 + dx + 4} 58 ${60 + dx * 0.7} 64`, 'none', C.silver, 2)), ...[-10, 10].map((dx) => line(`M${60 + dx} 86 L${60 + dx * 0.6} 104`, C.silver, 2)), rect(52, 102, 16, 6, C.gold, 2, C.ink, 1.2)),
  /** elektronmikroskop: a tall grey column instrument on a desk; next to it a screen shows a spiky round virus enlarged. */
  'mfys.elektronmikroskop': all(bg(), rect(6, 88, 108, 6, C.tan, 2, C.ink, 1.6), line('M12 94 L12 112 M108 94 L108 112', C.brown, 3), rect(16, 20, 24, 56, '#cfd5db', 4, C.ink, 1.8), rect(12, 76, 32, 12, '#9aa3ad', 2, C.ink, 1.6), ...[32, 44, 56].map((y) => rect(14, y, 28, 4, '#9aa3ad', 1, C.ink, 1)), rect(56, 30, 52, 40, C.dark, 3, C.ink, 1.8), rect(60, 34, 44, 32, '#1e2a3a', 1, null), circle(82, 50, 9, '#7fc3a0', C.ink, 1), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return all(line(`M${f1(82 + Math.cos(a) * 9)} ${f1(50 + Math.sin(a) * 9)} L${f1(82 + Math.cos(a) * 13)} ${f1(50 + Math.sin(a) * 13)}`, '#7fc3a0', 1.4), circle(f1(82 + Math.cos(a) * 13.5), f1(50 + Math.sin(a) * 13.5), 1.2, '#e86a6a', null)); }), rect(78, 70, 8, 18, C.dark, 1, null)),

  // ── 3367 Partikelacceleratorer ────────────────────────────────────────
  /** partikelaccelerator: a cut through the landscape: fields and a mountain on top, and deep underground a huge ring-shaped tunnel seen at an angle, with a glowing beam running round it, ringed in orange. */
  'mfys.partikelaccelerator': all(bg('#e4f1fa'), path('M4 40 L30 22 L46 34 L60 26 L80 40 Z', '#9aa3ad', C.ink, 1.2), rect(4, 40, 112, 72, EARTH, 0, null), line('M4 40 L116 40', '#6fae5a', 4), ellipse(60, 78, 48, 18, 'none', C.ink, 9), ellipse(60, 78, 48, 18, 'none', '#d8d2c6', 7), ellipse(60, 78, 48, 18, 'none', '#4fc3ff', 1.8), line('M36 40 L36 64 M90 40 L90 66', '#d8d2c6', 4), ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return circle(f1(60 + 48 * Math.cos(a)), f1(78 + 18 * Math.sin(a)), 1.6, C.white, null); }), ellipse(60, 78, 56, 25, 'none', HL, 2.2), line('M10 100 L22 104 M98 54 L110 58', EARTH2, 1.4)),
  /** partikelstråle: a long metal pipe cut open, with blue magnets around it; inside the pipe a thin bright line of dots races to the right, ringed in orange. */
  'mfys.partikelstråle': all(bg(), rect(6, 48, 108, 24, '#dfe4e9', 12, C.ink, 1.8), rect(10, 52, 100, 16, '#f7f9fb', 8, null), ...[24, 60, 96].map((x) => all(rect(x - 8, 36, 16, 12, '#3a6fd8', 2, C.ink, 1.4), rect(x - 8, 72, 16, 12, '#3a6fd8', 2, C.ink, 1.4))), line('M12 60 L104 60', '#4fc3ff', 2), ...range(14).map((i) => circle(14 + i * 6.6, 60, 1.6, '#ff6a3c', null)), head(110, 60, 0, '#ff6a3c', 0.9), ellipse(60, 60, 54, 9, 'none', HL, 2.2)),
  /** detektor: a huge round many-layered machine seen from the front, as tall as a house, with coloured rings around a centre; two tiny people stand at its foot for scale. */
  'mfys.detektor': all(bg('#eef0f4'), ground, circle(60, 56, 46, '#b04a4a', C.ink, 1.8), circle(60, 56, 36, '#d9a520', C.ink, 1.4), circle(60, 56, 26, '#3a6fd8', C.ink, 1.4), circle(60, 56, 16, '#9aa3ad', C.ink, 1.4), circle(60, 56, 6, C.white, C.ink, 1.2), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(60 + Math.cos(a) * 16)} ${f1(56 + Math.sin(a) * 16)} L${f1(60 + Math.cos(a) * 46)} ${f1(56 + Math.sin(a) * 46)}`, C.ink, 1); }), ...range(6).map((i) => { const a = i * 1.05 + 0.3; return line(`M60 56 Q${f1(60 + Math.cos(a) * 20 + 6)} ${f1(56 + Math.sin(a) * 20)} ${f1(60 + Math.cos(a) * 44)} ${f1(56 + Math.sin(a) * 44)}`, '#ffe58a', 1.4); }), g('translate(14 0)', P({ x: 0, h: 0.26, top: C.orange })), g('translate(106 0)', P({ x: 0, h: 0.26, top: C.green }))),
  /** forskningsanläggning: a big research site: a round ring-shaped building, a long hall, office blocks and a car park, with a crane and people. */
  'mfys.forskningsanläggning': all(bg('#e4f1fa'), rect(4, 80, 112, 32, '#a8d08d', 0, null), ellipse(42, 82, 34, 12, '#cfd5db', C.ink, 1.6), ellipse(42, 82, 22, 7, '#a8d08d', C.ink, 1.2), rect(8, 72, 6, 10, '#cfd5db', 0, null), path('M8 82 A34 12 0 0 1 76 82 L76 74 A34 12 0 0 0 8 74 Z', '#e6eaee', C.ink, 1.4), rect(78, 60, 34, 26, C.white, 1, C.ink, 1.6), ...range(3).map((r) => range(4).map((c) => rect(81 + c * 8, 63 + r * 7, 5, 4, '#9fd3f0', 0.5, null))).flat(), rect(30, 96, 80, 8, '#cfd5db', 1, C.ink, 1.2), line('M100 60 L100 20 L72 20 M100 26 L90 20', C.orange, 2), line('M76 20 L76 34', C.ink, 1), rect(73, 34, 6, 4, C.dark, 1, null)),
  /** antimateria: an ordinary atom on the left and a mirror-image atom with swapped colours on the right (blue centre, red outer balls) meet in the middle in a big bright flash. */
  'mfys.antimateria': all(bg(NIGHT), circle(24, 60, 16, 'none', C.grey, 1.2), proton(24, 60, 5), electron(40, 60, 3.4), circle(96, 60, 16, 'none', C.grey, 1.2), circle(96, 60, 5, ELE, C.ink, 1), T(96, 62.5, '−', 7, C.white), circle(80, 60, 3.4, PRO, C.ink, 1), T(80, 62, '+', 5, C.white), arr(44, 60, 52, 60, C.white, 1.8), arr(76, 60, 68, 60, C.white, 1.8), burst(60, 60, 12, '#fff3b0'), ring(96, 60, 20)),
  /** positron: two balls of the same size side by side: a grey electron with − (reference) and an orange-ringed ball with + (positive electron). */
  'mfys.positron': all(bg(), greyed(electron(32, 60, 18)), circle(88, 60, 18, '#f39a5a', C.ink, 1.4), T(88, 68, '+', 24, C.white), ring(88, 60, 23), T(60, 66, '≠', 18, C.grey)),
  /** neutrino: the Sun on the left; a tiny particle goes in a straight orange dotted line right through the whole Earth and out on the other side. */
  'mfys.neutrino': all(bg(NIGHT), stars(STARS), circle(10, 60, 14, C.yellow, null), sun(10, 60, 14), globe(66, 60, 28), line('M28 60 L112 60', HL, 2.4, '2 4'), circle(112, 60, 3, HL, null), head(116, 60, 0, HL, 0.8)),
  /** big bang: a white-hot point in the middle with expanding rings and small galaxies (swirls and dots) flying outward in every direction. */
  'mfys.big-bang': all(bg(NIGHT), circle(60, 60, 44, 'none', 'rgba(255,200,120,0.25)', 2), circle(60, 60, 30, 'none', 'rgba(255,200,120,0.4)', 2), circle(60, 60, 16, 'rgba(255,230,160,0.5)', null), burst(60, 60, 10, '#fffbe0'), ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2 + 0.3, r = 36 + (i % 3) * 6; return all(arr(f1(60 + Math.cos(a) * 16), f1(60 + Math.sin(a) * 16), f1(60 + Math.cos(a) * (r - 6)), f1(60 + Math.sin(a) * (r - 6)), 'rgba(255,255,255,0.5)', 1.2), star(f1(60 + Math.cos(a) * r), f1(60 + Math.sin(a) * r), 3, i % 2 ? '#c7b3e6' : '#bfe3f5')); })),
  /** strålbehandling: a patient lies on a hospital couch under the round head of a large treatment machine; a narrow orange beam goes from the machine to one spot on the body. */
  'mfys.strålbehandling': all(bg('#eef4f6'), ground, rect(72, 20, 30, 92, '#dfe4e9', 4, C.ink, 1.8), path('M72 22 L40 22 L40 40 L72 40 Z', '#dfe4e9', C.ink, 1.8), circle(46, 36, 10, '#cfd5db', C.ink, 1.6), path('M46 46 L44 70 L48 70 Z', 'rgba(239,138,60,0.8)', HL, 1), rect(10, 80, 76, 8, C.white, 2, C.ink, 1.6), line('M20 88 L20 112 M70 88 L70 112', C.grey, 3), path('M18 80 C18 72 26 70 34 72 L70 72 C76 72 78 80 78 80 Z', '#9fd3f0', C.ink, 1.4), circle(16, 74, 6, C.skin, C.ink, 1.4), ring(46, 72, 6)),
};

/** Shared layout for alfa-, beta- and gammastrålning: source box with a warning sign, three rays and three shields. */
function rays(which: 0 | 1 | 2): Svg {
  const ys = [32, 60, 88], stops = [44, 70, 100];
  const out: Svg[] = [bg(), rect(6, 22, 20, 76, C.dark, 3, C.ink, 1.6), trefoil(16, 60, 0.42),
    rect(42, 18, 4, 84, C.white, 0.5, C.ink, 1.2), metalPlate(70, 60, 84, 5), rect(96, 18, 14, 84, '#5c6670', 1, C.ink, 1.6)];
  ys.forEach((y, i) => {
    const on = i === which, col = on ? HL : C.grey2, end = stops[i]! - (i === 2 ? 4 : 3);
    if (i === 0) out.push(...range(4).map((k) => circle(32 + k * 3, y, on ? 3 : 2.4, col, on ? C.ink : null, 0.8)));
    if (i === 1) out.push(...range(10).map((k) => circle(30 + k * 4, y, on ? 1.8 : 1.4, col, null)));
    if (i === 2) out.push(line(range(41).map((k) => `${k ? 'L' : 'M'}${f1(28 + (k / 40) * (end - 28))} ${f1(y - 3 * Math.sin((k / 40) * Math.PI * 14))}`).join(' '), col, on ? 2.6 : 1.6));
    out.push(head(end + 2, y, 0, col, on ? 1 : 0.7));
    if (on) out.push(rect(stops[i]! - 6, y - 10, i === 2 ? 20 : 10, 20, 'none', 0, null), circle(stops[i]! - 1, y, 9, 'none', HL, 2.2));
  });
  return all(...out);
}
