/**
 * Kultur & fritid → Musik & scenkonst → Musikens byggstenar, 4411–4417 (0.62): melody and rhythm, beat and tempo,
 * pitch and key, harmony and chords, dynamics and timbre, notes and rests, musical expression.
 * Recurring signs: music is drawn as notes on five lines, sound as blue waves, the part that the word names is
 * orange or ringed in orange, and grey shows what the word is not. Pitch is height (on the lines or on a piano
 * keyboard), loudness is the size of the waves, time runs from left to right.
 * Words that are easy to mix up share one layout where only the marked part differs: vers/refräng (a song as a row
 * of blocks: one verse block or the three repeated refrain blocks), falsk/ren (notes off or on the dashed target
 * line), sopran/alt/tenor (four singers in a row: the high woman, the low woman or the high man), flerstämmig/unisont
 * (three singers with three different melody lines or one shared line), crescendo/diminuendo (waves growing or
 * shrinking), legato/staccato (one smooth ribbon or short bouncing dots), notblad/notställ (the sheet or the stand),
 * dur/moll (a sun and bright rising notes or a rain cloud and dark falling notes).
 * Digits, time signatures, sharps and the dynamic letters p and f appear only where the word is not their name;
 * no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waGrow, waIn, waPulse, waShake, waSway, type Svg } from './kit';
import { HL, T, heart } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WAVE = '#3a7bd5';
const NOTE = C.ink;
const STAGE = '#2d2a3e';
const WOOD = '#c98a4b';
const RED = '#e8302c';
const GREEN = '#3fa45b';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const tick = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const cross = (x: number, y: number, s = 5, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 2.8);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Music notation ───────────────────────────────────────────────────
/** Five lines from x to x+w, top line at y, gap between lines. */
const staff = (x: number, y: number, w: number, gap = 6, col: string = C.ink, sw = 1.1) => line(range(5).map((i) => `M${x} ${y + i * gap} L${x + w} ${y + i * gap}`).join(' '), col, sw);
/** A note head at (x, y); kind: q quarter, e eighth, h half, w whole. Stem up. */
const note = (x: number, y: number, kind: 'q' | 'e' | 'h' | 'w' = 'q', col: string = NOTE, s = 1) => at(x, y, s,
  `<ellipse cx="0" cy="0" rx="4" ry="2.9" transform="rotate(-20)" fill="${kind === 'h' || kind === 'w' ? C.white : col}" stroke="${col}" stroke-width="1.5"/>`,
  kind === 'w' ? '' : line('M3.6 -1 L3.6 -17', col, 1.5),
  kind === 'e' ? path('M3.6 -17 C8 -14 10 -11 8 -6 C8 -10 6 -12 3.6 -13 Z', col, col, 0.8) : '');
/** Floating musical note sign (for sound and singing), centre about (x, y). */
const mnote = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const mnote1 = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M2.6 5 L2.6 -10 C6 -8 8 -6 8 -2', col, 2), ellipse(0, 5.6, 3.4, 2.6, col, null));
/** G clef, centre of the curl at (x, y), height ≈ 40·s. */
const gclef = (x: number, y: number, s = 1, col: string = C.ink, sw = 2.2) => at(x, y, s,
  line('M2 18 C-2 21 -6 18 -4 14 C-2 11 3 13 2 17 M2 18 L2 -22 C2 -28 8 -30 8 -24 C8 -16 -10 -10 -10 2 C-10 10 -2 12 4 10 C10 8 10 0 4 -2 C-2 -3 -5 2 -2 6', col, sw));
/** Quarter rest, centre (x, y). */
const qrest = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, path('M-2 -10 L3 -4 C0 -1 0 1 3 4 L1 5 C-3 4 -3 8 0 10 C-5 8 -5 3 -1 2 L-3 -1 C0 -3 1 -6 -2 -10 Z', col, col, 0.8));
const sharp = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, line('M-2 -7 L-2 7 M2 -8 L2 6', col, 1.2), line('M-4.5 -2 L4.5 -4 M-4.5 3 L4.5 1', col, 2.2));
/** Time signature: two digits stacked at x on a staff whose top line is y. */
const timeSig = (x: number, y: number, top: string, bot: string, col: string = C.ink, gap = 6) => all(T(x, y + gap * 2 - 1, top, gap * 2.3, col, 900), T(x, y + gap * 4 - 1, bot, gap * 2.3, col, 900));
const bar = (x: number, y: number, gap = 6, col: string = C.ink, sw = 1.4) => line(`M${x} ${y} L${x} ${y + 4 * gap}`, col, sw);
/** Repeat sign at the end of a passage: thin + thick bar and two dots. */
const repeatEnd = (x: number, y: number, gap = 6, col: string = C.ink) => all(circle(x - 6, y + gap * 1.5, 1.6, col, null), circle(x - 6, y + gap * 2.5, 1.6, col, null), line(`M${x - 2} ${y} L${x - 2} ${y + 4 * gap}`, col, 1.2), line(`M${x + 2} ${y} L${x + 2} ${y + 4 * gap}`, col, 3.4));

// ── Sound ────────────────────────────────────────────────────────────
/** Sound arcs opening to the right (dir 1) or left (dir −1). */
const waves = (x: number, y: number, n = 3, dir = 1, col: string = WAVE, sw = 2.2, step = 5) => all(...range(n).map((i) => {
  const r = 5 + i * step, h = r * 0.8;
  return line(`M${f1(x + dir * r * 0.5)} ${f1(y - h)} Q${f1(x + dir * r)} ${y} ${f1(x + dir * r * 0.5)} ${f1(y + h)}`, col, sw);
}));
/** A sine-like wave from x over w px, amplitude a, n periods. */
const sine = (x: number, y: number, w: number, a: number, n: number, col: string = WAVE, sw = 2.2) => {
  const p = w / n; let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` q${f1(p / 4)} ${-a} ${f1(p / 2)} 0 q${f1(p / 4)} ${a} ${f1(p / 2)} 0`;
  return line(d, col, sw);
};
/** Wave whose amplitude follows amps[] (one value per half period). */
const envWave = (x: number, y: number, w: number, amps: number[], col: string = WAVE, sw = 2.2) => {
  const p = w / amps.length; let d = `M${x} ${y}`;
  amps.forEach((a, i) => { d += ` q${f1(p / 2)} ${f1(i % 2 ? a * 2 : -a * 2)} ${f1(p)} 0`; });
  return line(d, col, sw);
};
const speaker = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, rect(-12, -18, 24, 36, col, 3, C.ink, 1.6), circle(0, -8, 5, '#55586a', C.ink, 1.2), circle(0, 8, 8, '#55586a', C.ink, 1.2), circle(0, 8, 3, C.grey, null));
const headphones = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 2 C-12 -14 12 -14 12 2', 'none', C.dark, 2.6), rect(-15, -2, 6, 10, col, 2.5, C.ink, 1.2), rect(9, -2, 6, 10, col, 2.5, C.ink, 1.2));
const ear = (x: number, y: number, s = 1, col: string = C.skin) => at(x, y, s,
  path('M-6 -16 C8 -20 16 -8 12 2 C10 8 4 8 4 14 C4 20 -4 22 -8 16', col, C.ink, 2), path('M-2 -8 C6 -10 8 -2 4 2 C2 4 0 2 0 6', 'none', C.ink, 1.6));
const bell = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M-12 8 C-12 -4 -9 -14 0 -14 C9 -14 12 -4 12 8 L15 12 L-15 12 Z', col, C.ink, 1.6), circle(0, 14.5, 2.6, C.dark, C.ink, 1), rect(-2, -18, 4, 4, C.dark, 1, null));
const phone = (x: number, y: number, s = 1, scr: Svg = '') => at(x, y, s, rect(-11, -20, 22, 40, C.dark, 3.4, C.ink, 1.4), rect(-9, -16, 18, 31, '#bfe3f5', 1, null), scr, circle(0, 17.5, 1.3, C.grey, null));

// ── Instruments ──────────────────────────────────────────────────────
/** Acoustic guitar, body centre (x, y), neck pointing up-right at angle rot (deg). */
const guitar = (x: number, y: number, s = 1, rot = -35, col: string = WOOD) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-3, -48, 6, 34, '#7a4a28', 1, C.ink, 1.2), rect(-4.5, -56, 9, 9, '#5a3a20', 2, C.ink, 1.2),
  path('M0 -16 C10 -16 12 -8 9 -3 C14 2 15 14 0 16 C-15 14 -14 2 -9 -3 C-12 -8 -10 -16 0 -16 Z', col, C.ink, 1.6), circle(0, -1, 4, '#3d2614', null),
  rect(-5, 7, 10, 2.6, '#5a3a20', 1, null), line('M-1.2 -54 L-1.2 8 M1.2 -54 L1.2 8', '#e8e2d0', 0.6));
/** Piano keyboard: n white keys from x, white key width kw, height h; `hl` = white key indices in colour, `hlb` black. */
const keys = (x: number, y: number, n: number, kw = 12, h = 40, hl: number[] = [], hlb: number[] = [], col: string = HL) => {
  const blackAfter = [0, 1, 3, 4, 5];
  const whites = range(n).map((i) => rect(x + i * kw, y, kw, h, hl.includes(i) ? col : C.white, 1.5, C.ink, 1.2));
  const blacks = range(n - 1).filter((i) => blackAfter.includes(i % 7)).map((i) => rect(f1(x + (i + 1) * kw - kw * 0.3), y, f1(kw * 0.6), h * 0.6, hlb.includes(i) ? col : C.black, 1, C.ink, 1));
  return all(...whites, ...blacks);
};
const drum = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, rect(-14, -8, 28, 18, col, 2, C.ink, 1.6), ellipse(0, -8, 14, 4.5, '#f4efe2', C.ink, 1.6), line('M-14 -4 L-6 10 L2 -4 L10 10 L14 2', '#f4efe2', 1.2));
const trumpet = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-18, -2, 24, 4, C.gold, 1.5, C.ink, 1.1), path('M6 -2 L16 -7 L16 7 L6 2 Z', C.gold, C.ink, 1.2), rect(-10, -6, 3, 4, C.gold, 0.6, C.ink, 0.8), rect(-5, -6, 3, 4, C.gold, 0.6, C.ink, 0.8), rect(-22, -1.5, 5, 3, C.dark, 1, null));

// ── People ───────────────────────────────────────────────────────────
type Pt = [number, number];
type Fig = {
  top?: string; bottom?: string; hair?: 'short' | 'long' | 'bun'; hairCol?: string; skin?: string; grey?: boolean;
  mouth?: 'smile' | 'open' | 'closed' | 'o' | 'flat' | 'frown' | 'wide'; eyes?: 'open' | 'closed' | 'wide';
  armL?: Pt[]; armR?: Pt[]; skirt?: boolean; extra?: Svg; front?: Svg; tilt?: number;
};
const HANG_L: Pt[] = [[-14, -48], [-15, -34]];
const HANG_R: Pt[] = [[14, -48], [15, -34]];
/** Standing person, feet at (x, 112), local units: head centre (0, −80), shoulders (±10, −64). Height ≈ 92·s. */
const fig = (x: number, s: number, o: Fig = {}, y = 112) => {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : (o.skin ?? C.skin), top = grey ? C.grey : (o.top ?? C.sky), bot = grey ? C.grey : (o.bottom ?? C.navy), hair = grey ? C.grey : (o.hairCol ?? C.hair);
  const armPath = (side: number, pts: Pt[]) => { const d = `M${side * 9} -62 ` + pts.map(([a, b]) => `L${a} ${b}`).join(' '); const [hx, hy] = pts[pts.length - 1]!; return all(line(d, ink, 7.4), line(d, top, 5), circle(hx, hy, 3.2, skin, ink, 1.2)); };
  const eyes = o.eyes === 'closed' ? line('M-5.5 -80 Q-3.5 -78 -1.5 -80 M1.5 -80 Q3.5 -78 5.5 -80', ink, 1.2)
    : o.eyes === 'wide' ? all(circle(-3.6, -81, 1.9, C.white, ink, 0.9), circle(3.6, -81, 1.9, C.white, ink, 0.9), circle(-3.6, -81, 0.9, ink, null), circle(3.6, -81, 0.9, ink, null))
    : all(circle(-3.6, -81, 1.2, ink, null), circle(3.6, -81, 1.2, ink, null));
  const m = o.mouth ?? 'smile';
  const mouth = m === 'open' ? ellipse(0, -74.5, 2.6, 3, '#c84a4a', ink, 1)
    : m === 'wide' ? path('M-4 -76 Q0 -69 4 -76 Z', '#c84a4a', ink, 1)
    : m === 'o' ? circle(0, -74.5, 1.5, '#c84a4a', ink, 1)
    : m === 'closed' ? line('M-3 -75 L3 -75', ink, 1.4)
    : m === 'flat' ? line('M-3 -74.5 L3 -74.5', ink, 1.2)
    : m === 'frown' ? path('M-3 -73.5 Q0 -76.5 3 -73.5', 'none', ink, 1.3)
    : path('M-3.4 -75.5 Q0 -72.5 3.4 -75.5', 'none', ink, 1.3);
  const legs = o.skirt ? all(path('M-11 -36 L11 -36 L15 -12 L-15 -12 Z', bot, ink, 1.8), line('M-5 -12 L-5 -1 M5 -12 L5 -1', skin, 4.4))
    : all(line('M-5 -36 L-6 -2', ink, 7.6), line('M-5 -36 L-6 -2', bot, 5.6), line('M5 -36 L6 -2', ink, 7.6), line('M5 -36 L6 -2', bot, 5.6));
  const shoes = all(ellipse(-7, -1, 5, 2.4, grey ? C.grey : C.black, null), ellipse(7, -1, 5, 2.4, grey ? C.grey : C.black, null));
  const hairBack = o.hair === 'long' ? path('M-11 -82 C-14 -64 -8 -62 0 -64 C8 -62 14 -64 11 -82 C10 -96 -10 -96 -11 -82 Z', hair, ink, 1.6) : '';
  const hairTop = o.hair === 'bun' ? all(circle(0, -93, 4.5, hair, ink, 1.4), path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6))
    : path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6);
  return g(`translate(${x} ${y}) scale(${s})${o.tilt ? ` rotate(${o.tilt} 0 -40)` : ''}`,
    legs, shoes, hairBack,
    path('M-11 -66 L11 -66 L10 -34 L-10 -34 Z', top, ink, 1.8),
    armPath(-1, o.armL ?? HANG_L), armPath(1, o.armR ?? HANG_R),
    rect(-3, -71, 6, 6, skin, 2, ink, 1.2), circle(0, -80, 10, skin, ink, 1.8), hairTop, eyes, mouth, o.extra ?? '', o.front ?? '');
};
const W = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { hair: 'long', top: C.orange, skirt: true, bottom: C.purple, ...o }, y);
const M = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { top: C.green, ...o }, y);
/** Arms raised for singing: hands near the chest. */
const SING_L: Pt[] = [[-15, -50], [-6, -54]];
const SING_R: Pt[] = [[15, -50], [6, -56]];
const holdSheet = (col: string = C.white, scr: Svg = '') => ({ armL: [[-12, -50], [-6, -52]] as Pt[], armR: [[12, -50], [6, -52]] as Pt[], front: all(rect(-12, -64, 24, 16, col, 1.5, C.ink, 1.2), staff(-10, -61, 20, 2.4, C.grey, 0.6), scr) });
const choirRow = (xs: number[], s: number, grey = true) => all(...xs.map((x, i) => fig(x, s, { grey, hair: i % 2 ? 'short' : 'long', top: [C.navy, C.purple, C.green, C.denim][i % 4], mouth: 'open', ...holdSheet() })));
/** A stage floor with curtains. */
const stage = () => all(rect(0, 0, 120, 120, STAGE, 0, null), path('M0 0 L18 0 C14 30 18 60 10 92 L0 92 Z', '#8c2b3a', null), path('M120 0 L102 0 C106 30 102 60 110 92 L120 92 Z', '#8c2b3a', null), rect(0, 92, 120, 28, '#6b4a33', 0, null), line('M0 92 L120 92', C.ink, 1.6));
const audience = (n: number, y = 112, col: string = '#1c1a28') => all(...range(n).map((i) => all(circle(8 + i * (104 / (n - 1)), y - 10, 7, col, null), rect(f1(8 + i * (104 / (n - 1)) - 9), y - 4, 18, 10, col, 4, null))));
const spot = (x: number, w = 40) => path(`M${x - 6} 0 L${x + 6} 0 L${x + w / 2} 104 L${x - w / 2} 104 Z`, 'rgba(255,240,180,0.35)', null);

// ── Shared layouts ───────────────────────────────────────────────────
/** vers/refräng: a song as a row of blocks V R V R R; `which` marks the verse or the three refrain blocks. */
const songBlocks = (which: 'vers' | 'refräng') => {
  const kind = ['v', 'r', 'v', 'r', 'r'];
  const lines = (x: number, y: number, w: number, v: boolean) => all(...range(3).map((i) => line(`M${x + 4} ${y + 8 + i * 7} L${x + w - 4 - (v ? (i * 5) % 9 : 0)} ${y + 8 + i * 7}`, v ? C.ink : C.ink, 1.6)));
  const blocks = kind.map((k, i) => {
    const x = 6 + (i % 3) * 37, y = i < 3 ? 24 : 68, w = 33, mark = (which === 'vers' ? k === 'v' && i === 0 : k === 'r');
    const body = all(rect(x, y, w, 30, k === 'r' ? '#fde3c8' : '#d8e8f7', 4, C.ink, 1.4), k === 'r' ? all(mnote1(x + w - 7, y + 22, 0.55, C.ink)) : '', lines(x, y, w, k === 'v'));
    return mark ? all(body, frame(x - 2, y - 2, w + 4, 34)) : greyed(body);
  });
  return all(...blocks, line('M41 39 L43 39 M78 39 L80 39 M41 83 L43 83', C.grey, 1.4),
    which === 'refräng' ? all(path('M57 64 C57 58 22 58 22 64', 'none', HL, 2), arrow(24, 60, 22, 66, HL, 2), path('M95 64 C95 58 62 58 60 64', 'none', HL, 2)) : '');
};
/** falsk/ren: a singer and notes on (ren) or off (falsk) the dashed target line. */
const pitch = (good: boolean) => {
  const ys = good ? [46, 40, 34, 40] : [52, 32, 44, 26];
  return all(ground(), W(26, 0.82, { mouth: 'open', armL: SING_L, armR: SING_R }),
    line('M46 46 L56 40 L68 34 L80 40', C.grey, 1.6, '3 3'),
    line('M50 46 L62 40 M62 34 L74 34 M74 40 L86 40', 'none', 1),
    ...[0, 1, 2, 3].map((i) => mnote1(52 + i * 14, ys[i]!, 0.9, good ? GREEN : RED)),
    good ? tick(100, 26, 1.6) : all(path('M48 60 q4 -4 8 0 t8 0 t8 0 t8 0', 'none', RED, 1.6), cross(102, 26, 5)),
    fig(98, 0.62, { top: C.grey, mouth: good ? 'smile' : 'frown', eyes: good ? 'closed' : 'open', armL: good ? HANG_L : [[-14, -72], [-10, -82]], armR: good ? HANG_R : [[14, -72], [10, -82]] }));
};
/** sopran/alt/tenor: four singers (woman, woman, man, man) with their notes at four heights; one is marked. */
const voices = (who: number) => {
  const ys = [16, 34, 26, 46];
  const ppl = [0, 1, 2, 3].map((i) => {
    const x = 16 + i * 29, female = i < 2;
    const body = female ? W(x, 0.62, { top: [C.orange, C.purple][i]!, mouth: 'open', armL: SING_L, armR: SING_R }) : M(x, 0.66, { top: [C.green, C.denim][i - 2]!, mouth: 'open', armL: SING_L, armR: SING_R });
    const n = mnote1(x + 2, ys[i]!, 1.1, i === who ? HL : C.navy);
    return i === who ? all(body, n, ring(x + 4, ys[i]! - 2, 11)) : greyed(body, n);
  });
  return all(ground(), line('M6 10 L6 56', C.grey2, 1.4), arrow(6, 20, 6, 10, C.grey, 1.6), ...ppl);
};
/** flerstämmig/unisont: three singers and their melody lines. */
const parts = (many: boolean) => {
  const cols = many ? [C.red, GREEN, WAVE] : [HL, HL, HL];
  const curves = many ? ['M8 30 C30 18 50 18 70 26 C88 32 100 22 114 18', 'M8 46 C30 40 50 48 70 42 C88 36 100 44 114 40', 'M8 62 C30 66 50 58 70 62 C88 66 100 58 114 60'] : ['M8 40 C30 28 50 28 70 36 C88 42 100 32 114 28'];
  return all(ground(), ...curves.map((d, i) => line(d, many ? cols[i]! : HL, many ? 3 : 5)),
    ...[24, 60, 96].map((x, i) => fig(x, 0.5, { top: many ? cols[i]! : C.orange, hair: i === 1 ? 'long' : 'short', skirt: i === 1, mouth: 'open', ...holdSheet() })));
};
/** crescendo/diminuendo: a speaker and waves that grow (true) or shrink. */
const swell = (grow: boolean) => {
  const sizes = grow ? [0.5, 0.75, 1, 1.25, 1.5] : [1.5, 1.25, 1, 0.75, 0.5];
  return all(speaker(16, 60, 0.9), ...sizes.map((sz, i) => {
    const x = 34 + i * 17;
    return all(line(`M${x} ${f1(60 - 18 * sz)} Q${f1(x + 8 * sz)} 60 ${x} ${f1(60 + 18 * sz)}`, i === (grow ? 4 : 0) ? HL : WAVE, f1(1.4 + sz * 1.4)), mnote1(x + 2, f1(96 - (grow ? 0 : 0)), f1(0.35 + sz * 0.4), C.navy));
  }), arrow(36, 112, 108, 112, C.grey, 2));
};
/** legato/staccato: notes connected by one ribbon or bouncing apart. */
const articulation = (smooth: boolean) => {
  const ys = [60, 50, 42, 50, 58, 46];
  return all(staff(6, 34, 108, 7, C.grey, 0.9), ...ys.map((y, i) => note(16 + i * 17, y, 'q', NOTE, 1.1)),
    smooth ? line('M14 68 C30 76 48 72 66 70 C84 68 96 72 108 64', HL, 3.4)
      : all(...ys.map((y, i) => circle(16 + i * 17, y + 9, 2, HL, null)), ...ys.map((y, i) => path(`M${12 + i * 17} ${y + 22} q4 -8 8 0`, 'none', HL, 2))));
};
/** notblad/notställ: a music stand with a sheet on it; the sheet or the stand is the word. */
const standLayout = (isSheet: boolean) => {
  const sheet = all(rect(32, 14, 56, 40, C.white, 2, C.ink, 1.6), staff(36, 20, 48, 3.2, C.ink, 0.7), staff(36, 37, 48, 3.2, C.ink, 0.7), note(46, 26, 'q', NOTE, 0.55), note(58, 23, 'q', NOTE, 0.55), note(70, 43, 'q', NOTE, 0.55), note(80, 40, 'q', NOTE, 0.55));
  const stand = all(rect(28, 52, 64, 5, C.dark, 1, C.ink, 1.2), line('M60 57 L60 104', C.dark, 3.4), line('M60 102 L44 112 M60 102 L76 112 M60 102 L60 112', C.dark, 2.6), path('M30 52 L30 22 L36 22', 'none', C.dark, 2));
  return isSheet ? all(ground(), greyed(stand), sheet, frame(29, 11, 62, 46)) : all(ground(), stand, greyed(sheet), frame(24, 48, 72, 66));
};

export const MUSB_MOTIFS: Record<string, Svg> = {
  // ── 4411 Melodi och rytm ─────────────────────────────────────────
  'musb.musik': all(ground(), speaker(20, 82, 1.1), waves(34, 72, 3, 1, WAVE, 2.2),
    moving('musb-musik', '0%{transform:translate(-18px,14px);opacity:0}30%{opacity:1}100%{transform:translate(0,0);opacity:1}', { dur: 3 },
      mnote(60, 36, 1.1, C.red), mnote1(80, 24, 1.1, C.purple), mnote(98, 44, 1, GREEN), mnote1(70, 58, 0.9, C.denim)),
    fig(96, 0.6, { top: C.yellow, mouth: 'smile', eyes: 'closed', armL: [[-16, -74], [-12, -90]], armR: [[16, -74], [12, -90]], extra: headphones(0, -82, 0.95) })),
  'musb.instrument': all(ground(), keys(6, 82, 6, 9, 26), guitar(66, 76, 0.85, -20), drum(98, 96, 0.95, C.red), trumpet(30, 52, 1.1, -10),
    g('translate(96 40) rotate(-30)', rect(-3, -24, 6, 48, C.silver, 2, C.ink, 1.2), ...range(4).map((i) => circle(0, -12 + i * 8, 1.4, C.dark, null)))),
  'musb.låt': all(phone(38, 62, 2.1, all(rect(-8, -14, 16, 12, '#f6c9d4', 1, null), mnote1(-1, -7, 0.5, C.navy), rect(-8, 0, 16, 1.6, C.grey2, 0.5, null), rect(-8, 0, 9, 1.6, HL, 0.5, null),
    path('M-2 5 L-2 11 L3 8 Z', C.ink, null), line('M-7 5.5 L-7 10.5 M7 5.5 L7 10.5', C.ink, 1))), frame(12, 30, 52, 24),
    headphones(92, 52, 1.6), path('M80 66 C80 90 60 100 52 102', 'none', C.ink, 1.6), waPulse('musb-låt', mnote1(96, 82, 0.9, C.navy), mnote1(106, 92, 0.7, C.navy))),
  'musb.sjunga': all(ground(), W(44, 0.98, { mouth: 'open', armL: [[-14, -50], [-4, -56]], armR: [[18, -66], [28, -78]] }),
    waIn('musb-sjunga', -16, 10, mnote(76, 30, 1, C.red), mnote1(92, 18, 0.9, C.purple), mnote1(88, 44, 0.8, C.navy))),
  'musb.lyssna': all(ground(), speaker(20, 82, 1.1), fig(84, 0.98, { top: C.green, mouth: 'smile', eyes: 'closed', armL: [[-16, -66], [-12, -80]] }),
    waIn('musb-lyssna', -26, 0, waves(34, 66, 3, 1, WAVE, 2.4, 6)), ring(72, 34, 9)),
  'musb.spela': all(ground(), fig(50, 0.98, { top: C.denim, mouth: 'smile', armL: [[-18, -50], [-24, -60]],
    front: guitar(2, -44, 1, -62) }),
    waSway('musb-spela', 18, g('translate(0 0)', line('M62 70 L68 74', C.ink, 6), circle(68, 74, 3.2, C.skin, C.ink, 1.2))),
    waIn('musb-spela-n', -12, 8, mnote(86, 36, 1, C.red), mnote1(102, 24, 0.9, C.purple))),
  'musb.melodi': all(staff(6, 40, 108, 8, C.ink, 1.1), line('M12 72 C24 60 34 50 44 48 C56 46 62 36 72 34 C84 32 92 52 104 56', HL, 3.2),
    ...[[14, 72], [30, 56], [44, 48], [58, 44], [72, 36], [88, 44], [104, 56]].map(([x, y]) => note(x!, y!, 'q', NOTE, 1.15))),
  'musb.rytm': all(drum(60, 34, 1.5, C.red), path('M42 6 L50 20 M78 6 L70 20', 'none', '#a0673d', 2.6),
    ...[[12, 18], [32, 8], [44, 8], [56, 18], [76, 18], [96, 8], [108, 8]].map(([x, w]) => rect(x! - 6, 76 - w!, 12, w! * 2, w === 18 ? HL : '#f7c6a6', 2, C.ink, 1.2)),
    line('M4 76 L116 76', C.grey, 1.2), ...[[12, 'q'], [32, 'e'], [44, 'e'], [56, 'q'], [76, 'q'], [96, 'e'], [108, 'e']].map(([x, k]) => note(x as number - 3, 108, k as 'q' | 'e', NOTE, 0.85))),
  // rytmisk (manual track): the same song twice. Grey above: a slow piece without a beat, the audience stands still.
  // Below: music with a clear beat, the audience bobs and claps on the same pulse and a wave of movement runs through it.
  'musb.rytmisk': all(
    greyed(speaker(12, 30, 0.6), path('M24 22 C34 18 44 26 54 22', 'none', C.grey, 1.6),
      ...[44, 64, 84, 104].map((x, i) => fig(x, 0.36, { hair: i % 2 ? 'long' : 'short', mouth: 'flat' }, 54))),
    line('M4 60 L116 60', C.grey2, 1.2, '3 3'), ground(),
    speaker(12, 90, 0.7), waves(22, 84, 3, 1, WAVE, 2.4, 4),
    ...[44, 64, 84, 104].map((x, i) => moving(`musb-rytmisk-${i}`, '0%,100%{transform:translate(0,0)}25%{transform:translate(0,-6px)}50%{transform:translate(0,0)}', { dur: 1, delay: i * 0.18 },
      fig(x, 0.42, { top: [C.red, C.yellow, C.green, C.purple][i]!, hair: i % 2 ? 'long' : 'short', mouth: 'wide', eyes: 'closed', armL: [[-14, -74], [-6, -92]], armR: [[14, -74], [6, -92]] }), line(`M${x - 7} 70 l-3 -3 M${x} 67 l0 -4 M${x + 7} 70 l3 -3`, HL, 1.6))),
    path('M36 64 C52 58 72 70 88 62 C98 58 106 62 114 60', 'none', HL, 2.6), arrow(106, 61, 114, 60, HL, 2.6)),
  'musb.vers.2': songBlocks('vers'),
  'musb.refräng': songBlocks('refräng'),
  'musb.låttext': all(rect(16, 8, 88, 54, C.dark, 3, C.ink, 1.8), rect(20, 12, 80, 46, '#1f3550', 1, null),
    ...range(4).map((i) => line(`M26 ${20 + i * 10} L${92 - (i * 13) % 26} ${20 + i * 10}`, i === 1 ? C.yellow : C.white, 2.4)), frame(18, 10, 84, 50),
    ground(), fig(36, 0.5, { top: C.red, mouth: 'open', armR: [[12, -52], [6, -70]], extra: all(line('M6 -70 L4 -80', C.dark, 2), circle(4, -82, 3, C.dark, null)) }),
    fig(84, 0.5, { top: C.green, mouth: 'open', hair: 'long', armL: [[-14, -50], [-4, -56]], armR: [[14, -50], [4, -56]] })),
  'musb.nynna': all(ground(), rect(64, 74, 50, 38, C.white, 2, C.ink, 1.6), rect(70, 64, 30, 8, C.dark, 2, C.ink, 1.4), line('M100 68 L112 66', C.dark, 3),
    fig(42, 0.98, { top: C.yellow, hair: 'long', mouth: 'closed', eyes: 'closed', armR: [[18, -48], [30, -44]] }),
    waIn('musb-nynna', -8, 8, mnote1(56, 14, 0.7, C.navy), mnote1(66, 4, 0.6, C.navy)), ring(42, 38, 13)),
  'musb.vissla': all(ground(), fig(40, 0.98, { top: C.denim, mouth: 'o', armL: [[-12, -46], [-8, -36]], armR: [[12, -46], [8, -36]] }),
    path('M44 37 C46 37 48 38 48 39', 'none', C.ink, 1),
    waIn('musb-vissla', -20, 4, line('M50 38 L58 36', WAVE, 1.6), mnote1(66, 30, 0.9, C.navy), mnote1(82, 22, 0.9, C.navy), mnote1(98, 30, 0.8, C.navy)), ring(40, 38, 8)),
  'musb.örhänge.2': all(at(46, 62, 1.3, circle(0, 0, 30, C.skin, C.ink, 2), path('M-30 -6 C-32 -40 30 -40 30 -6 C20 -22 -20 -22 -30 -6 Z', C.hair, C.ink, 1.6), circle(-10, 2, 2, C.ink, null), circle(10, 2, 2, C.ink, null), path('M-6 14 Q0 18 6 14', 'none', C.ink, 1.4)),
    ear(86, 66, 0.9), line('M88 84 L88 92', C.gold, 1.6), mnote1(90, 102, 1.1, HL),
    path('M76 26 C86 8 112 12 112 30 C112 44 92 44 88 34', 'none', C.grey, 1.4), arrow(90, 38, 88, 34, C.grey, 1.4), mnote1(96, 24, 0.8, C.navy),
    waPulse('musb-örhänge', mnote1(90, 102, 1.1, HL))),
  // ── 4412 Takt och tempo ──────────────────────────────────────────
  // takt (round 2): five lines split by bar lines into equal groups of four beats; a hand beats 1-2-3-4 while the mark moves along the first group
  'musb.takt': all(staff(6, 14, 108, 6, C.ink, 1.1), ...[6, 42, 78, 114].map((x) => bar(x, 14, 6, x === 6 || x === 114 ? C.ink : HL, x === 6 || x === 114 ? 1.4 : 3)),
    ...range(12).map((i) => note(12 + Math.floor(i / 4) * 36 + (i % 4) * 8.4, 32 - (i % 3) * 3, 'q', NOTE, 0.75)),
    frame(5, 6, 38, 36),
    ...['1', '2', '3', '4'].map((d, i) => T(14 + i * 8.4, 56, d, 8, HL, 900)),
    moving('musb-takt-mark', '0%,24%{transform:translate(0,0)}25%,49%{transform:translate(8.4px,0)}50%,74%{transform:translate(16.8px,0)}75%,100%{transform:translate(25.2px,0)}', { dur: 3.2 }, ring(14, 53, 5.5)),
    moving('musb-takt-hand', '0%,100%{transform:translate(0,0)}12%{transform:translate(0,8px)}25%{transform:translate(0,0)}37%{transform:translate(0,8px)}50%{transform:translate(0,0)}62%{transform:translate(0,8px)}75%{transform:translate(0,0)}87%{transform:translate(0,8px)}', { dur: 3.2 },
      rect(68, 66, 16, 24, C.sky, 3, C.ink, 1.4), path('M64 92 C62 82 70 78 76 78 C84 78 90 82 88 92 L86 100 C84 106 68 106 66 100 Z', C.skin, C.ink, 1.4)),
    line('M50 110 L110 110', C.grey2, 2), waPulse('musb-takt-slag', line('M62 106 l-6 3 M90 106 l6 3', HL, 2))),
  'musb.hålla-takten': all(ground(), ...[22, 60, 98].map((x, i) => fig(x, 0.62, { top: [C.red, C.green, C.denim][i]!, mouth: 'smile', armL: [[-12, -54], [-2, -62]], armR: [[12, -54], [2, -62]] })),
    ...[22, 60, 98].map((x) => waPulse(`musb-hålla-${x}`, line(`M${x - 8} 44 l-4 -4 M${x + 8} 44 l4 -4 M${x} 40 l0 -6`, HL, 1.8))),
    line('M8 14 L112 14', C.grey, 1), ...range(4).map((i) => circle(20 + i * 26, 14, 3.4, HL, null)), tick(108, 28, 1.4)),
  'musb.i-otakt': all(ground(), greyed(fig(20, 0.6, { armL: [[-12, -54], [-2, -62]], armR: [[12, -54], [2, -62]] }), fig(52, 0.6, { hair: 'long', armL: [[-12, -54], [-2, -62]], armR: [[12, -54], [2, -62]] })),
    waShake('musb-otakt', fig(92, 0.64, { top: C.orange, mouth: 'wide', eyes: 'wide', armL: [[-18, -56], [-24, -66]], armR: [[18, -56], [24, -66]] })),
    line('M8 14 L112 14', C.grey, 1), ...range(4).map((i) => circle(20 + i * 26, 14, 3, C.grey, null)), ...[33, 63, 99].map((x) => circle(x, 24, 3.4, RED, null)), cross(108, 36, 4)),
  'musb.taktart': all(staff(8, 40, 104, 8, C.ink, 1.1), gclef(18, 62, 0.9), timeSig(38, 40, '3', '4', HL, 8), ring(38, 56, 13),
    note(58, 64, 'q', NOTE, 1.1), note(70, 60, 'q', NOTE, 1.1), note(82, 60, 'q', NOTE, 1.1), bar(92, 40, 8), note(100, 56, 'h', NOTE, 1.1),
    ...[58, 70, 82].map((x, i) => circle(x, 96, i === 0 ? 5 : 3.4, i === 0 ? HL : C.grey, null)), line('M52 90 L52 102 M90 90 L90 102', C.grey, 1.4)),
  'musb.betoning.3': all(ground(), drum(56, 92, 1.6, C.red), line('M40 64 L50 80', '#a0673d', 3), waPulse('musb-betoning', all(line('M40 72 l-8 -6 M56 66 l0 -10 M72 72 l8 -6', HL, 2.4), circle(56, 30, 10, HL, C.ink, 1.4))),
    ...[78, 96, 112].map((x) => circle(x, 30, 5, C.grey, null)), circle(14, 30, 4.4, C.grey2, null), line('M6 44 L116 44', C.grey, 1)),
  'musb.räkna-in': all(ground(), greyed(drum(96, 96, 1.1, C.red), guitar(78, 84, 0.6, -30)), fig(38, 0.96, { top: C.purple, hair: 'long', skirt: true, mouth: 'open', armR: [[18, -74], [22, -88]] }),
    moving('musb-rakna-1', '0%,20%{opacity:0}25%,100%{opacity:1}', { dur: 4 }, T(64, 22, '1', 12, HL, 900)),
    moving('musb-rakna-2', '0%,40%{opacity:0}45%,100%{opacity:1}', { dur: 4 }, T(78, 22, '2', 12, HL, 900)),
    moving('musb-rakna-3', '0%,60%{opacity:0}65%,100%{opacity:1}', { dur: 4 }, T(92, 22, '3', 12, HL, 900)),
    moving('musb-rakna-4', '0%,80%{opacity:0}85%,100%{opacity:1}', { dur: 4 }, T(106, 22, '4', 12, HL, 900))),
  'musb.stampa': all(ground(), fig(46, 0.98, { top: C.green, mouth: 'smile' }),
    moving('musb-stampa', '0%,100%{transform:translate(0,0)}20%{transform:translate(0,-10px)}30%{transform:translate(0,0)}', { dur: 1 },
      rect(48, 96, 8, 14, C.navy, 1, null), ellipse(56, 110, 7, 3, C.black, null)),
    waPulse('musb-stampa-p', line('M66 104 L74 100 M66 110 L76 110 M44 104 L38 100', HL, 2.4)), mnote1(86, 40, 1, C.navy), mnote1(100, 52, 0.8, C.navy)),
  'musb.klappa.2': all(audience(5, 120, '#5a5560'), at(60, 54, 1.4,
    moving('musb-klappa-l', '0%,100%{transform:translate(0,0)}50%{transform:translate(-8px,0)}', { dur: 0.6 }, path('M-2 -14 C-10 -14 -12 -4 -10 6 L-2 12 Z', C.skin, C.ink, 1.4), rect(-14, 8, 10, 14, C.sky, 2, C.ink, 1.2)),
    moving('musb-klappa-r', '0%,100%{transform:translate(0,0)}50%{transform:translate(8px,0)}', { dur: 0.6 }, path('M2 -14 C10 -14 12 -4 10 6 L2 12 Z', C.skin, C.ink, 1.4), rect(4, 8, 10, 14, C.sky, 2, C.ink, 1.2))),
    line('M42 22 l-6 -6 M60 18 l0 -8 M78 22 l6 -6', HL, 2.4)),
  'musb.svänga.4': all(ground(), greyed(rect(0, 0, 120, 30, '#e8e0f0', 0, null)), mnote(18, 14, 0.9, C.purple), mnote1(102, 12, 0.9, C.red), mnote1(60, 10, 0.8, C.navy),
    waSway('musb-svanga-a', 10, W(36, 0.8, { top: C.red, mouth: 'wide', armL: [[-16, -70], [-20, -86]], armR: [[16, -58], [26, -54]] })),
    waSway('musb-svanga-b', 10, M(82, 0.82, { top: C.yellow, mouth: 'wide', armL: [[-16, -58], [-26, -54]], armR: [[16, -70], [20, -86]] }))),
  'musb.marsch.2': all(ground(), ...[24, 62, 100].map((x, i) => waBob(`musb-marsch-${i}`, 2.5, fig(x, 0.7, { top: C.red, bottom: C.navy, mouth: 'closed', extra: rect(-9, -98, 18, 10, C.navy, 1, C.ink, 1),
    armL: i === 1 ? [[-12, -56], [0, -58]] : HANG_L, armR: i === 1 ? [[12, -56], [2, -60]] : [[14, -60], [20, -66]], front: i === 1 ? drum(0, -46, 0.9, C.white) : trumpet(26, -68, 0.8) }))),
    mnote1(42, 14, 0.8, C.navy), mnote1(82, 10, 0.8, C.navy)),
  // ── 4413 Tonhöjd och tonart ──────────────────────────────────────
  'musb.tonart': all(staff(6, 34, 108, 8, C.ink, 1.1), gclef(16, 58, 0.95), sharp(32, 34, 1.2), sharp(40, 46, 1.2), frame(26, 24, 22, 40),
    note(60, 66, 'q', NOTE, 1.1), note(74, 58, 'q', NOTE, 1.1), note(88, 50, 'q', NOTE, 1.1), note(102, 66, 'h', HL, 1.1),
    path('M94 96 L102 88 L110 96 L110 106 L94 106 Z', C.white, C.ink, 1.4), line('M102 70 L102 86', HL, 1.6, '2 2')),
  'musb.dur': all(at(28, 28, 1, ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 17)} ${f1(Math.sin(a) * 17)} L${f1(Math.cos(a) * 23)} ${f1(Math.sin(a) * 23)}`, C.gold, 2.4); }), circle(0, 0, 13, C.yellow, C.ink, 1.6),
    circle(-4, -2, 1.4, C.ink, null), circle(4, -2, 1.4, C.ink, null), path('M-5 3 Q0 8 5 3', 'none', C.ink, 1.4)),
    staff(44, 54, 70, 7, C.grey, 0.9), ...[[52, 82], [64, 75], [76, 68], [88, 61], [100, 54]].map(([x, y]) => note(x!, y!, 'q', C.orange, 1.1)), arrow(54, 100, 106, 70, HL, 2.4)),
  'musb.moll': all(at(28, 26, 1, path('M-18 6 C-24 6 -24 -4 -16 -4 C-14 -14 -2 -16 2 -8 C6 -14 18 -10 16 -2 C22 -2 22 6 16 6 Z', '#8a93a8', C.ink, 1.4), line('M-12 12 l-2 6 M-2 12 l-2 6 M8 12 l-2 6', '#4a78b0', 2)),
    staff(44, 54, 70, 7, C.grey, 0.9), ...[[52, 54], [64, 61], [76, 68], [88, 75], [100, 82]].map(([x, y]) => note(x!, y!, 'q', C.navy, 1.1)), arrow(54, 66, 106, 98, '#4a78b0', 2.4),
    fig(22, 0.5, { top: '#6a7a9a', mouth: 'frown', eyes: 'closed' })),
  'musb.skala-noun.3': all(keys(6, 76, 9, 12, 36, [0, 1, 2, 3, 4, 5, 6, 7], [], '#f7c6a6'),
    ...range(8).map((i) => note(12 + i * 12, 66 - i * 6, 'q', i === 7 ? HL : NOTE, 0.9)),
    line('M10 72 L22 72 L22 66 L34 66 L34 60 L46 60 L46 54 L58 54 L58 48 L70 48 L70 42 L82 42 L82 36 L94 36', C.grey, 1.4, '3 3'),
    waIn('musb-skala', -84, 42, circle(100, 20, 5, HL, C.ink, 1.2))),
  'musb.oktav': all(keys(4, 64, 9, 12.4, 44, [0, 7]), path('M10 58 C10 28 98 28 98 58', 'none', HL, 3), arrow(92, 46, 98, 58, HL, 3), arrow(16, 46, 10, 58, HL, 3), T(54, 30, '8', 14, HL, 900),
    note(12, 104, 'w', NOTE, 1), note(98, 104, 'w', NOTE, 1)),
  'musb.halvton': all(keys(4, 34, 9, 12.4, 70, [2], [2]), path('M40 26 C40 18 48 18 48 26', 'none', HL, 2.4), arrow(45, 22, 48, 28, HL, 2.4),
    ring(44, 52, 16), greyed(path('M16 20 C16 8 58 8 58 20', 'none', C.grey, 1.6))),
  'musb.falsk.4': pitch(false),
  'musb.ren.4': pitch(true),
  'musb.gehör': all(ground(), greyed(rect(70, 10, 30, 36, C.white, 2, C.ink, 1.4), staff(73, 16, 24, 3, C.ink, 0.7), staff(73, 30, 24, 3, C.ink, 0.7)), cross(85, 28, 14),
    speaker(104, 92, 0.7), waves(94, 86, 2, -1, WAVE, 2), mnote1(80, 66, 0.8, C.navy),
    fig(40, 0.96, { top: C.denim, mouth: 'smile', eyes: 'closed', armL: [[-18, -50], [-24, -60]], armR: [[12, -48], [10, -40]], front: guitar(2, -44, 1, -62) }), ring(49, 41, 8), ear(49, 41, 0.42)),
  'musb.röst': all(at(42, 62, 1.4, circle(0, -14, 20, C.skin, C.ink, 2), path('M-20 -18 C-22 -42 22 -42 20 -18 C12 -30 -12 -30 -20 -18 Z', C.hair, C.ink, 1.6), circle(-7, -16, 1.6, C.ink, null), circle(7, -16, 1.6, C.ink, null), ellipse(0, -4, 4, 5, '#c84a4a', C.ink, 1.2),
    rect(-7, 4, 14, 14, C.skin, 3, C.ink, 1.6), path('M-24 18 L24 18 L30 40 L-30 40 Z', C.green, C.ink, 1.8), line('M-3 9 L-1 15 M3 9 L1 15', HL, 1.6), ring(0, 12, 6)),
    waIn('musb-rost', -14, 0, waves(56, 58, 4, 1, WAVE, 2.4, 6))),
  'musb.transponera.2': all(staff(6, 22, 108, 6, C.grey, 0.9), ...[[18, 34], [32, 28], [46, 22], [60, 28]].map(([x, y]) => note(x!, y!, 'q', C.grey, 1)),
    staff(6, 70, 108, 6, C.ink, 1.1), waIn('musb-transp', 0, -48, ...[[18, 82], [32, 76], [46, 70], [60, 76]].map(([x, y]) => note(x!, y!, 'q', HL, 1))),
    arrow(84, 30, 84, 78, HL, 3), arrow(100, 30, 100, 78, HL, 3)),
  // ── 4414 Harmonier och ackord ────────────────────────────────────
  'musb.harmoni.2': all(ground(), ...[24, 60, 96].map((x, i) => fig(x, 0.55, { top: [C.red, GREEN, WAVE][i]!, hair: i === 1 ? 'long' : 'short', skirt: i === 1, mouth: 'open', armL: SING_L, armR: SING_R })),
    line('M28 52 C36 36 50 30 58 24 M60 52 L60 24 M92 52 C84 36 70 30 62 24', C.grey, 1.2, '3 3'),
    note(54, 26, 'q', C.red, 1.1), note(60, 20, 'q', GREEN, 1.1), note(66, 14, 'q', WAVE, 1.1), waPulse('musb-harmoni', sparkle(80, 12, 5, C.gold), sparkle(40, 14, 4, C.gold)), ring(62, 18, 15)),
  'musb.ackord': all(keys(6, 66, 9, 12, 42, [0, 2, 4]), staff(30, 12, 60, 6, C.ink, 1), gclef(38, 26, 0.6),
    ...[[60, 36], [60, 30], [60, 24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.9" transform="rotate(-20 ${x} ${y})" fill="${HL}" stroke="${C.ink}" stroke-width="1"/>`), line('M63.6 36 L63.6 6', C.ink, 1.5),
    ...[12, 36, 60].map((x) => line(`M${x} 50 L${x} 62`, HL, 2)), path('M12 50 L60 50', 'none', HL, 2)),
  'musb.grepp.3': all(rect(0, 34, 120, 40, '#6b4426', 2, C.ink, 1.6), ...[20, 46, 70, 92, 112].map((x) => line(`M${x} 34 L${x} 74`, C.silver, 2.2)), ...range(6).map((i) => line(`M0 ${38 + i * 6.4} L120 ${38 + i * 6.4}`, '#e8e2d0', 1)),
    ...[[33, 44.8], [58, 51.2], [58, 57.6]].map(([x, y]) => all(circle(x!, y!, 6, C.skin, C.ink, 1.4), ring(x!, y!, 9))),
    path('M33 39 C30 18 40 6 52 2 M58 45 C60 26 64 14 74 4 M58 64 C66 84 70 96 80 112', 'none', C.ink, 7.4), path('M33 39 C30 18 40 6 52 2 M58 45 C60 26 64 14 74 4 M58 64 C66 84 70 96 80 112', 'none', C.skin, 5.6)),
  'musb.kompa': all(ground(), greyed(W(30, 0.86, { mouth: 'open', armL: SING_L, armR: SING_R })), mnote1(18, 14, 0.8, C.grey),
    fig(80, 0.9, { top: C.denim, mouth: 'smile', armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }),
    waSway('musb-kompa', 18, line('M92 68 L98 72', C.ink, 6), circle(98, 72, 3.2, C.skin, C.ink, 1.2)), frame(58, 18, 58, 94)),
  'musb.körledare': all(ground(), choirRow([18, 42, 66, 90], 0.5),
    fig(60, 0.9, { top: C.dark, hair: 'bun', mouth: 'smile', armL: [[-18, -76], [-28, -88]], armR: [[18, -76], [28, -88]] }, 118),
    moving('musb-korledare', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-5px)}', { dur: 1.4 }, ring(60, 30, 14))),
  'musb.stämma-noun.1': all(...[0, 1, 2, 3].map((i) => line(`M30 ${18 + i * 14} C50 ${10 + i * 14} 70 ${26 + i * 14} 114 ${16 + i * 14}`, i === 1 ? HL : C.grey2, i === 1 ? 4 : 2.4)),
    ...[0, 1, 2, 3].map((i) => i === 1 ? fig(14, 0.28, { top: C.purple, hair: 'long', mouth: 'open' }, 38 + i * 14) : greyed(fig(14, 0.28, { mouth: 'open', hair: i < 2 ? 'long' : 'short' }, 38 + i * 14))),
    frame(4, 22, 112, 22), ground(), choirRow([30, 54, 78, 102], 0.34)),
  'musb.flerstämmig': parts(true),
  'musb.unisont': parts(false),
  'musb.skära-sig.2': all(staff(10, 30, 100, 8, C.grey, 0.9), note(52, 58, 'q', C.navy, 1.4), note(64, 54, 'q', RED, 1.4),
    path('M58 40 L52 28 L60 30 L56 16', 'none', RED, 2.4), path('M66 40 L74 30 L68 30 L74 18', 'none', RED, 2.4), waShake('musb-skara', ring(58, 52, 16, RED)),
    fig(98, 0.5, { top: C.green, mouth: 'frown', eyes: 'closed', armL: [[-14, -72], [-10, -82]], armR: [[14, -72], [10, -82]] }), fig(22, 0.5, { top: C.yellow, hair: 'long', mouth: 'frown', eyes: 'closed', armL: [[-14, -72], [-10, -82]], armR: [[14, -72], [10, -82]] })),
  'musb.grundton': all(keys(6, 60, 9, 12, 44, [0]), rect(30, 60, 12, 44, '#f7c6a6', 1.5, C.ink, 1.2), rect(54, 60, 12, 44, '#f7c6a6', 1.5, C.ink, 1.2),
    path('M4 44 L12 36 L20 44 L20 54 L4 54 Z', HL, C.ink, 1.4), rect(10, 47, 4, 7, C.white, 0.5, null), arrow(12, 30, 12, 34, HL, 1),
    staff(40, 10, 74, 6, C.grey, 0.9), note(98, 28, 'w', HL, 1.2), note(60, 22, 'q', NOTE, 0.9), note(74, 16, 'q', NOTE, 0.9), arrow(80, 20, 92, 26, C.grey, 1.6)),
  'musb.provsjunga': all(ground(), rect(62, 82, 54, 6, C.tan, 2, C.ink, 1.6), line('M68 88 L68 112 M110 88 L110 112', C.brown, 3), greyed(fig(76, 0.6, { mouth: 'flat', armR: [[12, -52], [4, -42]] }, 104), fig(100, 0.6, { hair: 'long', mouth: 'flat' }, 104)),
    rect(70, 76, 12, 6, C.white, 1, C.ink, 1),
    fig(30, 0.96, { top: C.orange, hair: 'long', skirt: true, mouth: 'open', armL: SING_L, armR: [[18, -66], [28, -78]] }), waIn('musb-prov', -12, 8, mnote1(56, 26, 0.9, C.navy), mnote1(66, 14, 0.8, C.navy))),
  'musb.sopran': voices(0),
  'musb.alt': voices(1),
  'musb.tenor': voices(2),
  // ── 4415 Dynamik och klang ───────────────────────────────────────
  'musb.dynamik': all(envWave(6, 56, 108, [3, 3, 6, 10, 16, 20, 20, 14, 8, 4, 3, 3, 8, 16]), T(14, 98, 'p', 16, C.navy, 900), T(56, 98, 'f', 18, HL, 900), T(88, 98, 'p', 16, C.navy, 900),
    line('M6 84 L114 84', C.grey, 1), frame(4, 28, 112, 56)),
  'musb.crescendo': swell(true),
  'musb.diminuendo': swell(false),
  'musb.klang': all(staff(6, 8, 108, 4, C.grey, 0.8), note(30, 20, 'q', NOTE, 0.9), note(90, 20, 'q', NOTE, 0.9),
    g('translate(30 76) rotate(-20)', path('M0 -24 C8 -24 9 -16 7 -12 C11 -8 11 6 0 8 C-11 6 -11 -8 -7 -12 C-9 -16 -8 -24 0 -24 Z', '#a0522d', C.ink, 1.4), rect(-2, -44, 4, 22, C.dark, 1, null), line('M-6 -2 L6 -2', C.ink, 1)),
    g('translate(90 74) rotate(-30)', rect(-3, -30, 6, 56, C.silver, 2, C.ink, 1.2), ...range(4).map((i) => circle(0, -16 + i * 10, 1.6, C.dark, null))),
    line('M10 40 L16 32 L22 40 L28 32 L34 40 L40 32 L46 40', HL, 2.4), sine(70, 36, 42, 6, 3, WAVE, 2.4), line('M60 28 L60 104', C.grey2, 1.2, '3 3')),
  // klar (round 2): one sharp, clean wave with a clear outline (orange) reaches the ear; below, a blurred muddy grey wave; no bell
  'musb.klar.5': all(ear(104, 56, 1.1),
    sine(8, 34, 84, 10, 4, C.ink, 4.6), sine(8, 34, 84, 10, 4, HL, 2.6), tick(26, 12, 1.4),
    greyed(...[-3, 0, 3].map((dy) => `<g opacity="0.55">${path(`M8 ${84 + dy} C16 72 22 98 32 ${84 + dy} C40 72 48 96 58 ${84 + dy} C66 74 72 96 82 ${84 + dy} C86 78 90 88 92 ${84 + dy}`, 'none', C.grey, 7)}</g>`)),
    line('M4 60 L92 60', C.grey2, 1, '3 3'), waIn('musb-klar', -20, 0, arrow(84, 40, 96, 48, HL, 2.4))),
  'musb.dov': all(ground(), rect(42, 6, 14, 104, '#b9a48a', 1, C.ink, 1.6), line('M42 30 L56 30 M42 58 L56 58 M42 86 L56 86', '#9a8468', 1.4),
    at(22, 80, 1, ellipse(0, 0, 14, 22, C.red, C.ink, 1.6), ellipse(0, 0, 9, 16, '#f4efe2', C.ink, 1.2)),
    path('M64 60 C70 40 76 80 84 60 C90 42 96 78 104 60 C108 50 112 66 116 60', 'none', C.navy, 6), fig(96, 0.5, { top: C.green, mouth: 'flat', armL: [[-14, -72], [-10, -82]] }, 112), ring(84, 60, 26)),
  'musb.klinga-verb': all(rect(54, 8, 12, 10, C.dark, 1, C.ink, 1), line('M60 18 L60 26', C.dark, 2),
    waSway('musb-klinga', 14, bell(60, 50, 2)), path('M20 40 C14 52 14 64 20 74 M28 44 C24 52 24 62 28 70 M100 40 C106 52 106 64 100 74 M92 44 C96 52 96 62 92 70', 'none', HL, 2.4), sparkle(24, 24, 4, C.gold), sparkle(98, 22, 4, C.gold)),
  'musb.tona-bort': all(speaker(18, 60, 1), ...range(6).map((i) => `<g opacity="${f1(1 - i * 0.16)}">${mnote1(38 + i * 14, f1(56 - (i % 2) * 8), 1 - i * 0.08, C.navy)}</g>`),
    envWave(32, 92, 84, [12, 10, 8, 6, 4, 2.4, 1.4, 0.6]), moving('musb-tona', '0%{opacity:1}80%,100%{opacity:.15}', { dur: 3.6 }, mnote1(38, 56, 1, HL))),
  'musb.tystna': all(rect(0, 0, 120, 120, '#3a3550', 0, null), rect(10, 6, 100, 30, '#5a5470', 2, null), audience(5, 120, '#1c1a28'),
    moving('musb-tystna', '0%,30%{opacity:1}70%,100%{opacity:0}', { dur: 3.4 }, ...[22, 60, 98].map((x, i) => all(path(`M${x - 10} ${62 - i % 2 * 6} L${x + 10} ${62 - i % 2 * 6} L${x + 10} ${76 - i % 2 * 6} L${x - 2} ${76 - i % 2 * 6} L${x - 6} ${81 - i % 2 * 6} L${x - 5} ${76 - i % 2 * 6} L${x - 10} ${76 - i % 2 * 6} Z`, C.white, C.ink, 1), line(`M${x - 6} ${69 - i % 2 * 6} L${x + 6} ${69 - i % 2 * 6}`, C.grey, 1.4, '2 2')))),
    rect(36, 40, 48, 3, C.yellow, 1, null), line('M60 43 L60 56', '#fff4b8', 1, '2 2')),
  'musb.skrälla': all(ground(), waShake('musb-skralla', speaker(28, 72, 1.6), line('M50 40 L60 34 L56 46 L68 40 L64 54 L76 48 M52 72 L66 66 L62 78 L78 72 M50 100 L62 98 L58 108 L72 104', RED, 2.6)),
    fig(98, 0.7, { top: C.yellow, mouth: 'wide', eyes: 'closed', armL: [[-14, -74], [-10, -82]], armR: [[14, -74], [10, -82]] })),
  // ── 4416 Noter och pauser ────────────────────────────────────────
  'musb.not.1': all(staff(6, 34, 108, 9, C.grey, 1), gclef(16, 60, 1), note(44, 70, 'q', C.grey, 1.1), note(94, 52, 'q', C.grey, 1.1), note(68, 56, 'q', HL, 1.8), ring(70, 46, 20)),
  'musb.läsa-noter': all(ground(), fig(40, 0.98, { top: C.green, mouth: 'open', eyes: 'open', armL: [[-12, -54], [4, -60]], armR: [[22, -56], [32, -60]],
    front: all(rect(14, -78, 30, 22, C.white, 1.5, C.ink, 1.4), staff(17, -74, 24, 3, C.ink, 0.7), note(24, -68, 'q', HL, 0.5), note(31, -71, 'q', HL, 0.5), note(37, -66, 'q', HL, 0.5)) }),
    waIn('musb-lasa', -18, 8, mnote1(86, 22, 0.9, C.navy), mnote1(100, 12, 0.8, C.navy)), line('M44 32 L62 34', C.grey, 1, '2 2')),
  'musb.notblad': standLayout(true),
  'musb.notställ': standLayout(false),
  'musb.notlinje': all(staff(6, 30, 108, 12, HL, 2.6), greyed(gclef(18, 66, 1.1), note(50, 54, 'q', NOTE, 1.1), note(74, 66, 'q', NOTE, 1.1), note(98, 42, 'q', NOTE, 1.1))),
  'musb.klav': all(staff(4, 34, 112, 9, C.grey, 1.1), gclef(26, 62, 1.25, HL, 3), ring(26, 56, 26), greyed(note(60, 70, 'q', NOTE, 1.1), note(78, 61, 'q', NOTE, 1.1), note(96, 52, 'q', NOTE, 1.1))),
  'musb.taktstreck': all(staff(4, 34, 112, 9, C.grey, 1), greyed(note(14, 70, 'q', NOTE, 1), note(26, 61, 'q', NOTE, 1), note(52, 52, 'h', NOTE, 1), note(72, 61, 'q', NOTE, 1), note(84, 70, 'q', NOTE, 1), note(104, 52, 'h', NOTE, 1)),
    bar(40, 34, 9, HL, 3), bar(94, 34, 9, HL, 3), ring(40, 52, 22), ring(94, 52, 22)),
  'musb.paus.3': all(staff(4, 20, 112, 8, C.grey, 1), note(16, 44, 'q', NOTE, 1.1), note(32, 40, 'q', NOTE, 1.1), qrest(60, 36, 1.3, HL), note(88, 44, 'q', NOTE, 1.1), note(104, 48, 'q', NOTE, 1.1), ring(60, 36, 15),
    ground(), fig(60, 0.5, { top: C.denim, mouth: 'closed', armL: [[-16, -56], [-22, -50]], armR: [[16, -56], [22, -50]] }), greyed(mnote1(86, 70, 0.8, C.grey))),
  'musb.repris.2': all(staff(4, 40, 112, 8, C.grey, 1), note(18, 64, 'q', NOTE, 1), note(34, 56, 'q', NOTE, 1), note(50, 60, 'q', NOTE, 1), note(66, 52, 'q', NOTE, 1),
    repeatEnd(90, 40, 8, HL), ring(88, 56, 20), path('M86 30 C80 10 24 10 16 32', 'none', HL, 2.6), arrow(20, 24, 16, 34, HL, 2.6)),
  'musb.kryss.2': all(staff(4, 32, 112, 10, C.grey, 1), greyed(gclef(16, 62, 1.1)), sharp(58, 57, 1.8, HL), note(78, 57, 'q', NOTE, 1.5), ring(58, 57, 16),
    keys(30, 92, 6, 12, 26, [], [1], HL), arrow(46, 112, 51, 100, HL, 2)),
  'musb.sångbok': all(ground(), path('M18 40 L60 46 L102 40 L102 96 L60 102 L18 96 Z', C.white, C.ink, 1.8), line('M60 46 L60 102', C.ink, 1.4), path('M18 96 L60 102 L102 96 L102 100 L60 106 L18 100 Z', C.red, C.ink, 1.4),
    ...range(5).map((i) => line(`M24 ${54 + i * 8} L${54 - (i % 2) * 6} ${55 + i * 8}`, C.grey, 1.6)), staff(66, 52, 30, 2.6, C.ink, 0.6), note(72, 60, 'q', NOTE, 0.5), note(80, 57, 'q', NOTE, 0.5), note(88, 62, 'q', NOTE, 0.5),
    ...range(3).map((i) => line(`M66 ${72 + i * 8} L${94 - i * 4} ${73 + i * 8}`, C.grey, 1.6)), mnote(60, 24, 1, C.navy), frame(14, 36, 92, 72)),
  'musb.andas': all(ground(), fig(44, 0.98, { top: C.sky, mouth: 'o', eyes: 'closed', ...holdSheet() }),
    moving('musb-andas', '0%,100%{transform:scale(1)}50%{transform:scale(1.12)}', { dur: 2.6, spin: true }, ellipse(44, 62, 9, 7, 'rgba(140,199,232,0.55)', WAVE, 1.4)),
    waIn('musb-andas-luft', 22, 0, path('M80 32 C70 30 66 34 56 34', 'none', WAVE, 2.2), arrow(62, 34, 52, 34, WAVE, 2.2), path('M84 42 C74 40 70 44 60 42', 'none', WAVE, 1.6)),
    greyed(qrest(96, 70, 1.2, C.ink))),
  // ── 4417 Musikaliska uttryck ─────────────────────────────────────
  // uttryck (round 2): the same melody twice: flat, grey and with a neutral face above; below, a singer with feeling, strong colours, and the line follows the feeling
  'musb.uttryck.2': all(greyed(fig(16, 0.48, { mouth: 'flat' }, 54), line('M34 30 L114 30', C.grey, 2.4), ...range(5).map((i) => note(42 + i * 16, 30, 'q', C.grey, 0.9))),
    line('M4 60 L116 60', C.grey2, 1.2, '3 3'), ground(),
    fig(18, 0.56, { top: C.red, hair: 'long', skirt: true, mouth: 'wide', eyes: 'closed', armL: [[-14, -54], [-4, -60]], armR: [[16, -72], [24, -86]] }),
    line('M34 96 C46 70 54 66 62 84 C70 102 78 72 88 70 C98 68 104 92 114 80', C.orange, 4),
    ...[[42, 84, C.red], [58, 74, C.orange], [74, 90, C.purple], [90, 70, C.red], [106, 86, C.purple]].map(([x, y, c]) => note(x as number, y as number, 'q', c as string, 1)),
    waGrow('musb-uttryck', heart(96, 104, 0.6, C.red), sparkle(70, 64, 4, C.gold))),
  'musb.framföra.2': all(stage(), spot(60, 50), audience(6, 120),
    W(60, 0.66, { top: C.yellow, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 92),
    waIn('musb-framfora', -10, 8, mnote1(84, 30, 0.9, C.white), mnote1(96, 20, 0.8, C.white))),
  'musb.inlevelse': all(ground(), W(40, 0.96, { top: C.purple, mouth: 'open', eyes: 'closed', armL: [[-12, -54], [2, -60]], armR: [[18, -66], [24, -60]] }),
    heart(40, 58, 0.6, HL), path('M64 30 C60 10 112 6 112 26 C112 44 76 46 70 38 L62 46 L66 34 Z', C.white, C.ink, 1.4),
    path('M78 32 L84 22 L90 32 Z', C.white, C.ink, 1), rect(80, 32, 8, 6, C.white, 0, C.ink, 1), circle(100, 22, 4, RED, null), waPulse('musb-inlevelse', heart(40, 58, 0.6, HL))),
  'musb.solo': all(stage(), spot(60, 46), choirRow([22, 98], 0.5),
    W(60, 0.72, { top: C.red, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 96), ring(60, 40, 16)),
  'musb.vibrato': all(ground(), W(22, 0.8, { mouth: 'open', armL: SING_L, armR: SING_R }), note(44, 32, 'h', NOTE, 1.1),
    moving('musb-vibrato', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,3px)}', { dur: 0.35 }, sine(50, 40, 64, 5, 6, HL, 3)),
    greyed(line('M50 76 L114 76', C.grey, 3)), mnote1(104, 64, 0.7, C.grey)),
  'musb.legato': articulation(true),
  'musb.staccato': articulation(false),
  'musb.medryckande': all(ground(), rect(0, 0, 120, 30, '#f0e6d8', 0, null), greyed(drum(20, 22, 0.7, C.red), guitar(46, 22, 0.45, -40)), mnote1(80, 14, 0.8, C.navy), mnote(100, 18, 0.8, C.red),
    ...[18, 46, 74, 102].map((x, i) => waBob(`musb-medr-${i}`, 4, fig(x, 0.6, { top: [C.red, C.yellow, C.green, C.purple][i]!, hair: i % 2 ? 'long' : 'short', mouth: 'wide', armL: [[-14, -74], [-18, -90]], armR: [[14, -74], [18, -90]] })))),
  'musb.pampig': all(path('M10 60 L10 34 L22 34 L22 26 L34 26 L34 34 L46 34 L46 18 L60 6 L74 18 L74 34 L86 34 L86 26 L98 26 L98 34 L110 34 L110 60 Z', '#e6d3b3', C.ink, 1.6),
    line('M60 6 L60 -2', C.ink, 1.4), path('M60 -2 L70 2 L60 5 Z', C.red, null), ground(),
    ...[16, 40, 64, 88].map((x, i) => fig(x + 8, 0.52, { top: C.red, mouth: 'closed', extra: rect(-9, -98, 18, 10, C.navy, 1, C.ink, 1), front: trumpet(24, -70, 0.85, -14 - i) })),
    waPulse('musb-pampig', line('M108 50 L116 44 M108 60 L118 60 M108 70 L116 76', C.gold, 2.4)), sparkle(30, 14, 4, C.gold), sparkle(92, 12, 4, C.gold)),
  'musb.melankolisk': all(rect(10, 8, 64, 72, '#9fb3c8', 2, C.ink, 1.8), line('M42 8 L42 80 M10 44 L74 44', C.ink, 1.6), ...range(8).map((i) => line(`M${16 + (i * 9) % 54} ${14 + (i * 17) % 60} l-3 7`, '#5a7aa0', 1.4)),
    rect(4, 80, 112, 6, C.tan, 1, C.ink, 1.4), fig(92, 0.7, { top: '#6a7a9a', mouth: 'flat', eyes: 'closed', armL: [[-12, -50], [-4, -66]], armR: [[12, -50], [6, -60]], tilt: -6 }),
    mnote1(64, 96, 0.8, '#5a7aa0'), mnote1(48, 104, 0.7, '#5a7aa0')),
};
