/**
 * Kultur & fritid → Musik & scenkonst → Konserter & musikskapande, 4441–4447 (0.62): rehearsal and soundcheck, stage and
 * audience, conductor and orchestra, music production, recording and mixing, songwriting, music criticism.
 * Recurring signs (shared with musicBasics.ts): music is notes on five lines, sound is blue waves, the part that the word
 * names is orange or ringed in orange, and grey shows what the word is not. A stage is a dark room with red curtains and a
 * row of dark heads in front; a recording is a row of lanes with waveforms; a review is a white card with stars.
 * Words that are easy to mix up get different kinds of pictures: dirigent (the person, ringed), dirigera (the baton arm
 * moves), taktpinne (close-up of the baton in a hand), podium (the empty platform); studio (the whole room with the glass
 * window) and sångbås (the small padded booth); mixerbord (the desk alone) and mixning (three waves become one);
 * låtskrivare (guitar and notebook), textförfattare (only words, music greyed) and komponera (notes appear on a staff).
 * Digits appear only where the word is not their name (calendar days, chart places, a take number); no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T, box, cloud, drops, envelope, heart, suitcase } from './people';
import { drop, glassOf, greyed } from './blindFix';

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
const bar = (x: number, y: number, gap = 6, col: string = C.ink, sw = 1.4) => line(`M${x} ${y} L${x} ${y + 4 * gap}`, col, sw);

// ── Sound ────────────────────────────────────────────────────────────
/** Sound arcs opening to the right (dir 1) or left (dir −1). */
const waves = (x: number, y: number, n = 3, dir = 1, col: string = WAVE, sw = 2.2, step = 5) => all(...range(n).map((i) => {
  const r = 5 + i * step, h = r * 0.8;
  return line(`M${f1(x + dir * r * 0.5)} ${f1(y - h)} Q${f1(x + dir * r)} ${y} ${f1(x + dir * r * 0.5)} ${f1(y + h)}`, col, sw);
}));
/** Wave whose amplitude follows amps[] (one value per half period). */
const envWave = (x: number, y: number, w: number, amps: number[], col: string = WAVE, sw = 2.2) => {
  const p = w / amps.length; let d = `M${x} ${y}`;
  amps.forEach((a, i) => { d += ` q${f1(p / 2)} ${f1(i % 2 ? a * 2 : -a * 2)} ${f1(p)} 0`; });
  return line(d, col, sw);
};
const speaker = (x: number, y: number, s = 1, col: string = C.dark) => at(x, y, s, rect(-12, -18, 24, 36, col, 3, C.ink, 1.6), circle(0, -8, 5, '#55586a', C.ink, 1.2), circle(0, 8, 8, '#55586a', C.ink, 1.2), circle(0, 8, 3, C.grey, null));
const headphones = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 2 C-12 -14 12 -14 12 2', 'none', C.dark, 2.6), rect(-15, -2, 6, 10, col, 2.5, C.ink, 1.2), rect(9, -2, 6, 10, col, 2.5, C.ink, 1.2));
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
/** Arms raised for singing: hands near the chest. */
const SING_L: Pt[] = [[-15, -50], [-6, -54]];
const SING_R: Pt[] = [[15, -50], [6, -56]];
/** A stage floor with curtains. */
const stage = () => all(rect(0, 0, 120, 120, STAGE, 0, null), path('M0 0 L18 0 C14 30 18 60 10 92 L0 92 Z', '#8c2b3a', null), path('M120 0 L102 0 C106 30 102 60 110 92 L120 92 Z', '#8c2b3a', null), rect(0, 92, 120, 28, '#6b4a33', 0, null), line('M0 92 L120 92', C.ink, 1.6));
const audience = (n: number, y = 112, col: string = '#1c1a28') => all(...range(n).map((i) => all(circle(8 + i * (104 / (n - 1)), y - 10, 7, col, null), rect(f1(8 + i * (104 / (n - 1)) - 9), y - 4, 18, 10, col, 4, null))));
const spot = (x: number, w = 40) => path(`M${x - 6} 0 L${x + 6} 0 L${x + w / 2} 104 L${x - w / 2} 104 Z`, 'rgba(255,240,180,0.35)', null);

// ── Concert gear and rooms ───────────────────────────────────────────
const BLACKTIE = '#23232b';
/** Microphone on a stand, foot at (x, 112), mic head at about y = 112 − 62·s. */
const micStand = (x: number, s = 1, y = 112, col: string = C.dark) => at(x, y, s, line('M0 0 L0 -56', col, 2.4), line('M-9 0 L0 -6 L9 0', col, 2.4), rect(-3, -66, 6, 11, C.dark, 3, C.ink, 1.2), circle(0, -66, 4, C.silver, C.ink, 1.2));
/** Floor monitor (wedge) facing up-left at (x, y). */
const wedge = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L14 0 L14 -6 L-8 -16 L-14 -16 Z', C.dark, C.ink, 1.4), path('M-12 -14 L-7 -14 L11 -6 L11 -3 L-12 -3 Z', '#55586a', null), circle(-4, -9, 3, C.grey, null));
/** Guitar amplifier, bottom centre (x, y). */
const amp = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -24, 28, 24, C.dark, 2, C.ink, 1.4), rect(-12, -18, 24, 16, '#55586a', 1, null), line('M-12 -14 L12 -14 M-12 -10 L12 -10 M-12 -6 L12 -6', '#3d3f4a', 0.8), rect(-12, -23, 24, 4, C.black, 1, null), circle(-8, -21, 1, C.gold, null), circle(-3, -21, 1, C.gold, null), circle(2, -21, 1, C.gold, null));
/** Violin with bow, body centre (x, y). */
const violin = (x: number, y: number, s = 1, rot = 0, bow = true) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M0 -12 C6 -12 7 -8 5 -5 C8 -2 9 6 0 12 C-9 6 -8 -2 -5 -5 C-7 -8 -6 -12 0 -12 Z', '#b5652b', C.ink, 1.2), rect(-1.2, -24, 2.4, 13, C.dark, 0.6, null), circle(0, -25, 1.8, C.dark, null),
  line('M-1 -22 L-1 9 M1 -22 L1 9', '#e8e2d0', 0.4), bow ? line('M-14 6 L14 -2', '#7a4a28', 1.2) : '');
/** A chair seen from the side, legs on y = 112. */
const chair = (x: number, col: string = C.dark) => all(line(`M${x - 6} 112 L${x - 6} 96 L${x + 6} 96 L${x + 6} 112 M${x + 6} 96 L${x + 6} 82`, col, 2.2));
/** Mixing desk with n channel strips seen from the front; `hl` channel in orange. */
const desk = (x: number, y: number, w: number, h: number, n = 8, ups: number[] = [], hl = -1) => {
  const cw = w / n;
  return all(rect(x, y, w, h, '#4a4d5a', 3, C.ink, 1.6), ...range(n).map((i) => {
    const cx = f1(x + cw * (i + 0.5)), up = ups[i] ?? 0.5, col = i === hl ? HL : C.silver;
    return all(circle(cx, y + 6, f1(cw * 0.22), '#7a7e8c', C.ink, 0.8), circle(cx, y + 13, f1(cw * 0.22), '#7a7e8c', C.ink, 0.8), line(`M${cx} ${y + 20} L${cx} ${y + h - 4}`, C.black, 1.6), rect(f1(cx - cw * 0.3), f1(y + 20 + (h - 26) * (1 - up) - 2), f1(cw * 0.6), 5, col, 1, C.ink, 0.8));
  }));
};
/** A record (vinyl) at (x, y), radius r. */
const disc = (x: number, y: number, r: number, label: string = C.red) => all(circle(x, y, r, C.black, C.ink, 1.4), circle(x, y, f1(r * 0.75), 'none', '#4a4a55', 0.8), circle(x, y, f1(r * 0.55), 'none', '#4a4a55', 0.8), circle(x, y, f1(r * 0.32), label, null), circle(x, y, f1(r * 0.06 + 0.6), C.white, null));
/** A CD at (x, y). */
const cd = (x: number, y: number, r: number) => all(circle(x, y, r, '#dfe6ee', C.ink, 1.4), path(`M${x} ${y - r} A${r} ${r} 0 0 1 ${x + r} ${y}`, 'none', '#b9a6e8', 2), path(`M${x - r * 0.7} ${y + r * 0.7} A${r} ${r} 0 0 1 ${x - r} ${y}`, 'none', '#9fe0d0', 2), circle(x, y, f1(r * 0.25), C.white, C.ink, 1));
/** Sheet of paper with n text lines. */
const paper = (x: number, y: number, w: number, h: number, n = 4, col: string = C.white) => all(rect(x, y, w, h, col, 2, C.ink, 1.4), ...range(n).map((i) => line(`M${x + 4} ${f1(y + 7 + i * ((h - 10) / Math.max(n, 1)))} L${f1(x + w - 4 - (i % 3) * 4)} ${f1(y + 7 + i * ((h - 10) / Math.max(n, 1)))}`, C.grey, 1.4)));
/** A row of recorded tracks (lanes) with waveforms; `hl` lane orange. */
const lanes = (x: number, y: number, w: number, n: number, hl = -1, h = 12) => all(...range(n).map((i) => {
  const yy = y + i * (h + 4), col = i === hl ? HL : WAVE;
  return all(rect(x, yy, w, h, i === hl ? '#fde3c8' : '#e3ecf7', 2, C.ink, 1), envWave(x + 3, yy + h / 2, w - 6, range(14).map((k) => 1 + ((k * 7 + i * 3) % 5) * 0.6), col, 1.4));
}));
/** Thumbs-up hand (not a pointing finger), centre (x, y). */
const thumbUp = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -2 L0 -2 C1 -8 2 -12 4 -14 C7 -15 8 -12 7 -9 L6 -4 L11 -4 C14 -4 14 0 12 1 C14 2 13 5 11 5 C13 6 12 9 10 9 L-6 9 Z', C.skin, C.ink, 1.3), rect(-10, -3, 5, 13, C.sky, 1.5, C.ink, 1.2));
const clock = (x: number, y: number, r: number, h = 0, m = 0) => {
  const ha = ((h % 12) / 12) * Math.PI * 2 + (m / 60) * (Math.PI / 6), ma = (m / 60) * Math.PI * 2;
  return all(circle(x, y, r, C.white, C.ink, 1.6), line(`M${x} ${y} L${f1(x + Math.sin(ha) * r * 0.5)} ${f1(y - Math.cos(ha) * r * 0.5)} M${x} ${y} L${f1(x + Math.sin(ma) * r * 0.8)} ${f1(y - Math.cos(ma) * r * 0.8)}`, C.ink, 1.6));
};
const starShape = (x: number, y: number, r: number, col: string = C.gold) => path(range(10).map((i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; }).join(' ') + ' Z', col, C.ink, 1.2);
/** Conductor in tails on a podium, feet at (x, y); `arms` up or down. */
const conductor = (x: number, s: number, y = 112, armR: Pt[] = [[16, -70], [26, -86]], armL: Pt[] = [[-16, -66], [-24, -76]]) => fig(x, s, { top: BLACKTIE, bottom: BLACKTIE, hairCol: '#d8d8d8', mouth: 'closed', armL, armR,
  extra: all(path('M-4 -66 L0 -58 L4 -66 Z', C.white, null), path('M-2 -64 L2 -64 L0 -61 Z', C.black, null)) }, y);
const baton = (x1: number, y1: number, x2: number, y2: number) => line(`M${x1} ${y1} L${x2} ${y2}`, C.white, 1.8);
/** A seated orchestra musician (head + body + instrument hint) at (x, y). */
const player = (x: number, y: number, s: number, top: string, inst: 'violin' | 'cello' | 'horn' | 'none' = 'violin', grey = false) => {
  const body = at(x, y, s, rect(-7, -4, 14, 16, top, 4, C.ink, 1.2), circle(0, -10, 6, C.skin, C.ink, 1.2), path('M-6 -12 C-6 -19 6 -19 6 -12 C3 -15 -3 -15 -6 -12 Z', C.hair, null),
    inst === 'violin' ? violin(9, 5, 0.55, -50, false) : inst === 'cello' ? g('translate(10 4)', path('M0 -10 C5 -10 6 -4 4 -1 C7 2 7 9 0 12 C-7 9 -7 2 -4 -1 C-6 -4 -5 -10 0 -10 Z', '#b5652b', C.ink, 1), line('M0 -18 L0 -10', C.dark, 1.6)) : inst === 'horn' ? trumpet(8, 2, 0.45, -20) : '');
  return grey ? greyed(body) : body;
};
const screenBox = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 8, '#eef4fa', 1, null), inner, rect(f1(x + w / 2 - 8), y + h, 16, 4, C.dark, 1, C.ink, 1));
const scissors = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-8, -5, 4, 'none', C.red, 2), circle(-8, 5, 4, 'none', C.red, 2), line('M-5 -3 L10 4 M-5 3 L10 -4', C.silver, 2.4));
const studioWall = () => all(rect(0, 0, 120, 112, '#d9d2c4', 0, null), ...range(6).flatMap((i) => range(4).map((j) => rect(4 + i * 19, 6 + j * 18, 16, 15, '#c4b9a5', 2, null))));

export const CONC_MOTIFS: Record<string, Svg> = {
  // ── 4441 Repetition och soundcheck ───────────────────────────────
  'conc.repetition.2': all(
    // manual track (0.62): a strip of three panels – two rehearsals (numbered, orange frames) lead to the concert night
    ...[0, 1].map((k) => {
      const x = 4 + k * 58, good = k === 1;
      const ys = good ? [20, 17, 14, 17] : [12, 21, 10, 19];
      return all(rect(x, 4, 54, 54, '#efe6d8', 3, null), line(`M${x + 4} 54 L${x + 50} 54`, C.grey2, 1.4),
        fig(x + 14, 0.3, { top: C.denim, mouth: good ? 'smile' : 'frown', armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }, 54),
        fig(x + 30, 0.3, { hair: 'long', top: C.orange, mouth: good ? 'open' : 'frown', armL: SING_L, armR: SING_R }, 54), drum(x + 44, 50, 0.38, C.red),
        ...ys.map((y, i) => mnote1(x + 17 + i * 6.5, y, 0.45, good ? C.navy : RED)), good ? tick(x + 47, 12, 1) : cross(x + 47, 12, 4),
        frame(x, 4, 54, 54), circle(x + 6, 10, 6, HL, C.ink, 1.2), T(x + 6, 13.5, String(k + 1), 9, C.white, 900));
    }),
    arrow(58, 31, 62, 31, HL, 2), path('M90 58 L90 62', 'none', HL, 2), arrow(90, 58, 90, 66, HL, 2.4),
    // the concert night: stage, spotlight, audience – everything works
    rect(4, 66, 112, 50, STAGE, 3, null), path('M4 66 L14 66 C12 80 14 92 10 104 L4 104 Z', '#8c2b3a', null), path('M116 66 L106 66 C108 80 106 92 110 104 L116 104 Z', '#8c2b3a', null),
    rect(4, 100, 112, 4, '#6b4a33', 0, null), path('M54 66 L66 66 L80 100 L40 100 Z', 'rgba(255,240,180,0.4)', null),
    fig(48, 0.3, { top: C.denim, mouth: 'smile', armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }, 100),
    fig(66, 0.3, { hair: 'long', top: C.orange, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 100), drum(82, 96, 0.38, C.red),
    mnote1(30, 80, 0.55, C.white), mnote1(92, 76, 0.55, C.white), starShape(104, 74, 4.5, C.gold), starShape(16, 74, 4.5, C.gold),
    ...range(8).map((i) => circle(12 + i * 13.7, 112, 5, '#1c1a28', null)), rect(4, 66, 112, 50, 'none', 3, C.ink, 1.6)),
  'conc.repetera.2': all(ground(), amp(18, 112, 0.9), fig(46, 0.7, { top: C.denim, mouth: 'smile', armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }),
    W(82, 0.7, { top: C.orange, mouth: 'open', armL: SING_L, armR: SING_R }), micStand(96, 0.62),
    waSpin('conc-repetera', 3, g('translate(64 22)', path('M-14 0 A14 14 0 1 1 0 14', 'none', HL, 3.4), path('M-6 12 L2 15 L-3 21 Z', HL, null))),
    mnote1(30, 30, 0.8, C.navy), mnote1(100, 24, 0.7, C.navy)),
  'conc.replokal': all(studioWall(), rect(0, 96, 120, 24, '#8a8f99', 0, null), line('M0 96 L120 96', C.ink, 1.6), rect(84, 8, 28, 12, '#bfe3f5', 1, C.ink, 1.6), line('M98 8 L98 20', C.ink, 1.2),
    rect(6, 30, 16, 66, C.brown, 2, C.ink, 1.6), circle(18, 64, 1.6, C.gold, null),
    drum(80, 96, 1.1, C.red), drum(102, 92, 0.6, C.red), line('M92 78 L104 74', C.gold, 2.2), amp(42, 108, 1.1), guitar(64, 84, 0.7, 10), micStand(30, 0.7, 108),
    path('M42 108 C50 114 60 104 70 112', 'none', C.black, 1.4), line('M2 96 L2 120', C.grey2, 0)),
  'conc.spela-igenom': all(staff(8, 30, 104, 6, C.grey, 0.9), ...[16, 28, 40, 52, 64, 76, 88, 100].map((x, i) => note(x, 48 - (i * 7 % 18), 'q', NOTE, 0.9)),
    bar(8, 30, 6, C.ink, 2.6), bar(112, 30, 6, C.ink, 2.6), circle(10, 74, 5, GREEN, C.ink, 1.2), path('M8 71 L13 74 L8 77 Z', C.white, null), tick(108, 74, 1.6),
    line('M16 74 L100 74', HL, 3), arrow(92, 74, 102, 74, HL, 3),
    moving('conc-igenom', '0%{transform:translate(0,0)}90%,100%{transform:translate(96px,0)}', { dur: 3.4 }, line('M10 22 L10 60', HL, 2.6), path('M6 18 L14 18 L10 24 Z', HL, null)),
    ground(), greyed(fig(30, 0.32, { top: C.denim, armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }), fig(60, 0.32, { hair: 'long', top: C.orange, mouth: 'open', armL: SING_L, armR: SING_R }), drum(90, 104, 0.6))),
  'conc.rigga': all(ground(), rect(0, 92, 120, 20, '#6b4a33', 0, null), line('M0 92 L120 92', C.ink, 1.4), speaker(98, 74, 0.9), micStand(64, 0.6, 92),
    path('M64 92 C70 100 86 98 96 92', 'none', C.black, 1.6), path('M36 100 C50 104 54 96 64 98', 'none', C.black, 1.6),
    waIn('conc-rigga', -24, 0, fig(30, 0.72, { top: '#3d3f4a', mouth: 'closed', armL: [[-14, -56], [-2, -62]], armR: [[14, -56], [22, -60]], front: speaker(14, -66, 0.75) }, 112)),
    rect(20, 4, 96, 4, C.silver, 1, C.ink, 1), line('M44 8 L44 16 M86 8 L86 16', C.ink, 1.2), rect(39, 14, 10, 8, C.dark, 2, C.ink, 1), rect(81, 14, 10, 8, C.dark, 2, C.ink, 1)),
  'conc.soundcheck': all(ground(), W(26, 0.7, { top: C.orange, mouth: 'open', armL: SING_L, armR: [[14, -56], [8, -66]] }), micStand(40, 0.55),
    waves(46, 70, 3, 1, WAVE, 2.2, 5), speaker(100, 100, 0.55),
    fig(90, 0.4, { top: C.green, mouth: 'smile', armL: [[-14, -56], [-20, -46]], armR: [[14, -56], [20, -46]], extra: headphones(0, -82, 0.95) }, 66), desk(62, 50, 54, 30, 6, [0.3, 0.6, 0.8, 0.4, 0.5, 0.7], 2),
    waPulse('conc-soundcheck', tick(104, 16, 1.4), circle(70, 26, 3, GREEN, null))),
  'conc.medhörning': all(rect(0, 100, 120, 20, '#6b4a33', 0, null), ground(100), greyed(audience(5, 120, '#5a5560')),
    W(48, 0.72, { top: C.orange, mouth: 'open', armL: SING_L, armR: [[14, -56], [8, -66]] }, 100), micStand(62, 0.55, 100),
    wedge(90, 100, 1.4), waIn('conc-medhorning', 16, 10, path('M76 78 Q64 64 56 50', 'none', HL, 2.6), path('M80 72 Q70 58 60 44', 'none', HL, 2.6)), ring(55, 47, 8)),
  'conc.låtlista': all(rect(0, 0, 120, 120, '#8a6b52', 0, null), line('M0 40 L120 40 M0 80 L120 80', '#7a5b42', 1),
    rect(22, 14, 62, 92, C.white, 2, C.ink, 1.8), rect(46, 10, 14, 8, '#e8e2c8', 1, null),
    ...range(6).map((i) => all(T(32, 32 + i * 13, String(i + 1), 9, C.ink, 800), line(`M40 ${29 + i * 13} L${74 - (i % 3) * 6} ${29 + i * 13}`, C.ink, 2))),
    at(98, 98, 1, line('M-10 4 L0 0 L10 4', C.dark, 2.4), line('M0 0 L0 -6', C.dark, 2.4)), frame(18, 10, 70, 100)),

  // ── 4442 Scen och publik ─────────────────────────────────────────
  'conc.insläpp': all(rect(0, 0, 120, 112, '#e8dfd0', 0, null), ground(), rect(26, 20, 68, 92, '#3d3f4a', 2, C.ink, 1.8),
    waIn('conc-inslapp-l', 12, 0, rect(28, 22, 16, 90, C.red, 1, C.ink, 1.4)), waIn('conc-inslapp-r', -12, 0, rect(76, 22, 16, 90, C.red, 1, C.ink, 1.4)), rect(44, 22, 32, 90, '#f6e7b8', 0, null),
    clock(60, 10, 8, 7, 0), fig(60, 0.42, { top: C.green, armR: [[16, -60], [24, -66]] }), fig(76, 0.4, { hair: 'long', top: C.purple }), fig(92, 0.42, { top: C.denim }), fig(106, 0.4, { hair: 'long', top: C.yellow }), arrow(100, 56, 70, 56, HL, 2.8)),
  'conc.utsåld': all(ground(), rect(14, 16, 92, 64, '#d8c7a8', 3, C.ink, 1.8), rect(22, 26, 76, 40, '#fff8e6', 2, C.ink, 1.4),
    ...range(5).map((i) => rect(26 + i * 14, 30, 10, 30, 'none', 1, C.grey2, 1, )), greyed(rect(28, 64, 64, 2, C.grey, 0, null)),
    at(60, 46, 1, rect(-20, -9, 40, 18, C.gold, 2, C.ink, 1.4), line('M8 -9 L8 9', C.ink, 1, ), circle(-20, 0, 3, '#fff8e6', null), circle(20, 0, 3, '#fff8e6', null)), cross(60, 46, 16, RED),
    fig(30, 0.34, { top: C.denim, mouth: 'frown' }), fig(50, 0.34, { hair: 'long', top: C.orange, mouth: 'frown' }), fig(70, 0.34, { top: C.green, mouth: 'frown' })),
  'conc.förband.3': all(stage(), spot(42, 40), audience(6, 120),
    fig(30, 0.5, { top: C.green, armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }, 92), W(52, 0.5, { top: C.orange, mouth: 'open', armL: SING_L, armR: SING_R }, 92), frame(16, 40, 50, 54),
    greyed(rect(86, 26, 20, 66, '#5a1d26', 0, null), fig(98, 0.56, { top: C.yellow, mouth: 'smile', extra: starShape(0, -100, 8, C.gold) }, 92)), clock(96, 14, 8, 8, 0)),
  'conc.paus': all(rect(0, 0, 120, 112, '#e8dfd0', 0, null), ground(), rect(6, 10, 46, 40, STAGE, 2, C.ink, 1.6), rect(6, 40, 46, 10, '#6b4a33', 0, null), greyed(micStand(30, 0.36, 40), amp(18, 40, 0.5)),
    clock(86, 20, 10, 8, 45), rect(60, 78, 56, 8, C.tan, 2, C.ink, 1.6), line('M66 86 L66 112 M110 86 L110 112', C.brown, 3),
    fig(22, 0.62, { top: C.green, mouth: 'open', armR: [[14, -56], [20, -64]], front: glassOf(20, -62, '#f6e7b8', 10) }), fig(46, 0.6, { hair: 'long', top: C.purple, mouth: 'smile', armL: [[-14, -56], [-20, -64]], front: glassOf(-20, -62, '#e86a6a', 10) }),
    fig(88, 0.5, { top: C.denim, mouth: 'smile' }, 112), waPulse('conc-paus', ring(86, 20, 13))),
  'conc.strålkastare.2': all(rect(0, 0, 120, 120, STAGE, 0, null), rect(0, 96, 120, 24, '#6b4a33', 0, null), rect(0, 6, 120, 5, C.silver, 1, C.ink, 1),
    path('M28 18 L44 18 L106 108 L58 108 Z', 'rgba(255,240,180,0.45)', null),
    g('translate(36 18) rotate(-34)', rect(-8, -4, 16, 18, C.dark, 3, C.ink, 1.6), ellipse(0, 14, 9, 3, '#fff2b0', C.ink, 1.2)), line('M36 11 L36 16', C.ink, 2), ring(36, 22, 14),
    W(82, 0.62, { top: C.purple, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 104)),
  'conc.uppträda.1': all(stage(), spot(60, 50), audience(6, 120),
    waBob('conc-upptrada', 4, W(60, 0.66, { top: C.red, mouth: 'open', armL: [[-16, -68], [-26, -80]], armR: [[16, -68], [26, -80]] }, 92)),
    waIn('conc-upptrada-n', -10, 8, mnote1(86, 30, 0.9, C.white), mnote1(98, 20, 0.8, C.white))),
  'conc.rampfeber': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), path('M78 0 L120 0 L120 112 L84 112 C88 70 76 40 78 0 Z', '#8c2b3a', C.ink, 1.4), path('M90 0 C88 40 96 80 92 112', 'none', '#6e1f2c', 2), ground(),
    waShake('conc-rampfeber', fig(42, 0.92, { top: C.denim, mouth: 'frown', eyes: 'wide', armL: [[-12, -54], [-2, -58]], armR: [[12, -54], [2, -58]] })),
    drop(28, 30, 1.4, '#8cc7e8'), drop(58, 26, 1.2, '#8cc7e8'), path('M14 44 q4 -4 0 -8 M70 44 q4 -4 0 -8', 'none', C.ink, 1.6), heart(42, 66, 0.5, HL), line('M30 62 L34 66 M50 62 L54 66', HL, 1.6)),
  'conc.bocka.1': all(stage(), audience(6, 120),
    line('M57 70 L56 91 M63 70 L64 91', C.ink, 6.4), line('M57 70 L56 91 M63 70 L64 91', BLACKTIE, 4.6), ellipse(58, 92, 4, 2, C.black, null), ellipse(67, 92, 4, 2, C.black, null),
    g('translate(60 70)', moving('conc-bocka', '0%,15%{transform:rotate(-40deg)}45%,85%{transform:rotate(0)}100%{transform:rotate(-40deg)}', { dur: 2.8 }, g('rotate(40)',
      path('M-8 -26 L8 -26 L7 0 L-7 0 Z', BLACKTIE, C.ink, 1.4), path('M-3 -26 L0 -20 L3 -26 Z', C.white, null), line('M5 -24 L9 -6', C.ink, 5.6), line('M5 -24 L9 -6', BLACKTIE, 3.8), circle(9, -5, 2.4, C.skin, C.ink, 1),
      rect(-2, -31, 4, 5, C.skin, 1, C.ink, 1), circle(0, -38, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -39 C-7.5 -49 7.5 -49 7.5 -39 C4 -43 -4 -43 -7.5 -39 Z', C.hair, C.ink, 1.2), path('M2 -38 Q4 -37 6 -38', 'none', C.ink, 1))))),
  'conc.stående-ovationer': all(rect(0, 0, 120, 52, STAGE, 0, null), rect(0, 40, 120, 12, '#6b4a33', 0, null), W(60, 0.36, { top: C.yellow, mouth: 'smile', armL: [[-12, -50], [-6, -38]], armR: [[12, -50], [6, -38]] }, 40),
    ground(), ...range(4).map((i) => moving(`conc-ovation-${i}`, '0%{transform:translate(0,14px)}40%,100%{transform:translate(0,0)}', { dur: 2.6, delay: i * 0.15 },
      fig(18 + i * 28, 0.58, { top: [C.green, C.orange, C.denim, C.purple][i]!, hair: i % 2 ? 'long' : 'short', mouth: 'wide', armL: [[-18, -76], [-12, -100]], armR: [[18, -76], [12, -100]] }))),
    line('M10 50 l-4 -6 M38 46 l0 -6 M66 46 l0 -6 M94 46 l0 -6 M110 50 l4 -6', HL, 2)),
  'conc.extranummer': all(stage(), audience(6, 120), fig(44, 0.5, { top: C.green, armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }, 92), W(72, 0.5, { top: C.orange, mouth: 'open', armL: SING_L, armR: SING_R }, 92),
    rect(78, 6, 34, 22, C.white, 3, C.ink, 1.4), ...range(3).map((i) => line(`M82 ${11 + i * 5} L100 ${11 + i * 5}`, C.grey, 1.2)), tick(104, 16, 0.9),
    at(96, 38, 1, circle(0, 0, 9, HL, C.ink, 1.4), line('M-5 0 L5 0 M0 -5 L0 5', C.white, 2.6)), mnote1(30, 22, 1, C.white),
    line('M14 104 l-4 -6 M106 104 l4 -6', HL, 2)),

  // ── 4443 Dirigent och orkester ───────────────────────────────────
  'conc.orkester': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ground(),
    ...range(6).map((i) => player(12 + i * 19, 58, 0.8, BLACKTIE, i % 3 === 2 ? 'horn' : 'violin')),
    ...range(5).map((i) => player(20 + i * 20, 84, 0.9, BLACKTIE, i === 4 ? 'cello' : 'violin')),
    rect(52, 100, 16, 12, C.brown, 1, C.ink, 1.2), conductor(60, 0.34, 100), drum(104, 40, 0.5, C.red), drum(16, 40, 0.5, C.red)),
  'conc.dirigent': all(ground(), rect(30, 98, 60, 14, C.brown, 2, C.ink, 1.6), conductor(60, 0.92, 98), baton(85, 22, 98, 8), ring(60, 22, 14),
    greyed(player(12, 90, 0.8, BLACKTIE, 'violin'), player(108, 90, 0.8, BLACKTIE, 'cello'))),
  'conc.taktpinne': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), at(60, 60, 1, path('M-40 30 C-30 10 -16 6 -6 8 L6 4 C12 2 14 10 8 12 L-2 16 C4 18 6 24 0 26 L-30 40 Z', C.skin, C.ink, 2), rect(-56, 26, 22, 22, BLACKTIE, 4, C.ink, 1.8), rect(-38, 30, 6, 14, C.white, 2, C.ink, 1)),
    line('M66 68 L112 12', C.white, 3.4), line('M66 68 L112 12', C.ink, 0.6), ellipse(68, 66, 5, 4, '#c9a46a', C.ink, 1.2), ring(92, 36, 14)),
  'conc.dirigera.1': all(ground(), greyed(...range(4).map((i) => player(20 + i * 26, 106, 0.8, BLACKTIE, i === 3 ? 'cello' : 'violin'))),
    rect(42, 82, 36, 10, C.brown, 2, C.ink, 1.4), fig(60, 0.62, { top: BLACKTIE, bottom: BLACKTIE, hairCol: '#d8d8d8', mouth: 'closed', armL: [[-16, -66], [-24, -76]], armR: [[16, -66], [20, -66]] }, 82),
    waSway('conc-dirigera', 26, g('translate(0 0)', line('M72 42 L80 42', C.ink, 4), circle(80, 42, 2.2, C.skin, C.ink, 1), baton(80, 42, 96, 28))),
    mnote1(100, 56, 0.7, C.navy), mnote1(22, 52, 0.7, C.navy)),
  'conc.podium': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ground(), rect(26, 82, 68, 30, C.brown, 3, C.ink, 2), rect(26, 82, 68, 6, '#b37b4a', 2, C.ink, 1.4), path('M30 82 L30 50 L90 50 L90 82', 'none', C.dark, 2.4),
    rect(50, 34, 20, 4, C.dark, 1, C.ink, 1), line('M60 38 L60 50', C.dark, 2), frame(22, 78, 76, 38), greyed(player(10, 104, 0.7, BLACKTIE, 'violin'), player(110, 104, 0.7, BLACKTIE, 'violin'))),
  'conc.partitur': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), path('M10 24 L58 20 L58 106 L10 110 Z', C.white, C.ink, 1.6), path('M62 20 L110 24 L110 110 L62 106 Z', C.white, C.ink, 1.6), line('M58 20 L62 20 M58 106 L62 106', C.ink, 1.4),
    ...range(8).map((i) => all(line(range(3).map((k) => `M14 ${30 + i * 10 + k * 2} L55 ${30 + i * 10 + k * 2}`).join(' '), C.grey, 0.6), line(range(3).map((k) => `M65 ${30 + i * 10 + k * 2} L106 ${30 + i * 10 + k * 2}`).join(' '), C.grey, 0.6),
      ...[20, 32, 44].map((x) => circle(x + (i % 2) * 4, 32 + i * 10, 1.4, C.ink, null)), ...[72, 86, 98].map((x) => circle(x - (i % 3) * 3, 32 + i * 10, 1.4, C.ink, null)))),
    line('M12 28 L12 106 M108 28 L108 106', HL, 2.2), path('M60 12 L60 22', 'none', C.ink, 1)),
  'conc.insats.3': all(staff(8, 14, 104, 6, C.grey, 0.9), rect(14, 20, 50, 4, C.ink, 0, null), line('M14 18 L14 26 M64 18 L64 26', C.ink, 1.2), T(39, 12, '8', 9, C.ink, 800),
    note(76, 32, 'q', HL, 1.1), note(90, 26, 'q', NOTE, 1.1), note(104, 20, 'q', NOTE, 1.1), line('M70 6 L70 44', HL, 2.4, '3 3'),
    ground(), fig(30, 0.56, { top: BLACKTIE, bottom: BLACKTIE, hairCol: '#d8d8d8', mouth: 'closed', armL: [[-14, -64], [-14, -54]], armR: [[16, -66], [26, -72]] }),
    baton(43, 72, 56, 68), player(92, 104, 1.1, C.purple, 'violin'), waPulse('conc-insats', arrow(60, 66, 80, 76, HL, 2.6))),
  'conc.konsertmästare': all(ground(), rect(6, 96, 30, 16, C.brown, 2, C.ink, 1.2), greyed(conductor(20, 0.5, 96), player(78, 82, 0.9, BLACKTIE, 'violin'), player(100, 82, 0.9, BLACKTIE, 'violin'), player(100, 106, 0.9, BLACKTIE, 'violin'), player(78, 106, 0.9, BLACKTIE, 'violin')),
    fig(52, 0.62, { top: BLACKTIE, bottom: BLACKTIE, mouth: 'smile', armL: [[-12, -62], [-4, -66]], armR: [[14, -58], [24, -60]], front: violin(-4, -66, 0.9, -60) }), ring(52, 54, 16),
    waves(66, 40, 2, 1, WAVE, 2, 5)),
  'conc.ensemble': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ground(), ...[[16, 'violin'], [38, 'violin'], [60, 'horn'], [82, 'cello'], [104, 'violin']].map(([x, k], i) => all(chair(x as number), player(x as number, 90, 0.95, [C.purple, C.green, C.denim, C.orange, C.red][i]!, k as 'violin'))),
    frame(4, 66, 112, 44), greyed(at(102, 26, 0.5, rect(-22, -14, 44, 28, 'none', 2, C.grey, 2), ...range(3).flatMap((i) => range(5).map((j) => circle(-16 + j * 8, -8 + i * 8, 2.4, C.grey, null)))), cross(102, 26, 9, C.grey))),
  'conc.provspela': all(ground(), rect(52, 20, 6, 92, '#d9d2c4', 1, C.ink, 1.6), ...range(5).map((i) => line(`M52 ${30 + i * 16} L58 ${30 + i * 16}`, C.grey, 1)),
    fig(26, 0.78, { top: C.purple, hair: 'long', mouth: 'closed', eyes: 'closed', armL: [[-12, -62], [-4, -66]], armR: [[12, -56], [22, -58]] }),
    waSway('conc-provspela', 14, violin(36, 66, 1.2, -60)), waves(40, 46, 2, 1, WAVE, 2, 5),
    rect(66, 80, 50, 6, C.tan, 2, C.ink, 1.4), line('M70 86 L70 112 M112 86 L112 112', C.brown, 3), fig(80, 0.46, { top: C.navy, mouth: 'flat' }, 104), fig(100, 0.46, { top: C.green, hair: 'long', mouth: 'flat' }, 104), paper(86, 70, 14, 10, 2)),
  'conc.gästspela': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ground(), path('M66 112 L66 40 L90 26 L114 40 L114 112 Z', '#f0e0c0', C.ink, 1.6), rect(82, 80, 16, 32, C.brown, 1, C.ink, 1.4), path('M72 46 L108 46', 'none', C.ink, 1),
    greyed(player(76, 66, 0.6, BLACKTIE, 'violin'), player(90, 66, 0.6, BLACKTIE, 'violin'), player(104, 66, 0.6, BLACKTIE, 'cello')),
    waIn('conc-gastspela', -26, 0, fig(46, 0.72, { top: C.red, hair: 'long', mouth: 'smile', armR: [[14, -48], [18, -36]], front: suitcase(18, -24, C.navy) }), violin(30, 66, 0.9, -20, false)),
    path('M6 30 C20 10 36 12 44 26', 'none', HL, 2.4, ), arrow(38, 18, 46, 28, HL, 2.4), circle(8, 32, 4, HL, null)),
  'conc.orkesterdike': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), rect(30, 60, 90, 8, '#6b4a33', 0, null), rect(30, 68, 4, 44, '#4a3626', 0, null), W(80, 0.46, { top: C.yellow, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 60),
    rect(0, 70, 34, 42, '#3a3550', 0, null), rect(34, 86, 86, 26, '#433d5c', 0, null), frame(34, 84, 84, 28),
    ...range(4).map((i) => player(46 + i * 20, 104, 0.8, BLACKTIE, i === 3 ? 'cello' : 'violin')), conductor(16, 0.3, 112),
    audience(3, 120, '#141320'), spot(80, 30)),
  'conc.uruppförande': all(stage(), spot(60, 54), audience(6, 120), rect(40, 54, 40, 30, C.white, 2, C.ink, 1.4), staff(44, 60, 32, 3, C.grey, 0.6), staff(44, 72, 32, 3, C.grey, 0.6), note(54, 66, 'q', NOTE, 0.5), note(66, 78, 'q', NOTE, 0.5),
    line('M60 84 L60 92 M50 92 L70 92', C.dark, 2), waPulse('conc-urupp', sparkle(32, 46, 6, C.gold), sparkle(88, 44, 7, C.gold), sparkle(80, 30, 4, C.gold)), at(60, 34, 1, circle(0, 0, 10, HL, C.ink, 1.4), T(0, 4.5, '1', 13, C.white, 900))),

  // ── 4444 Musikproduktion ─────────────────────────────────────────
  'conc.producent.3': all(studioWall(), rect(0, 86, 120, 34, '#8a8f99', 0, null), desk(6, 70, 66, 26, 6, [0.4, 0.7, 0.5, 0.8, 0.3, 0.6]),
    fig(40, 0.62, { top: C.purple, hair: 'long', mouth: 'smile', armL: [[-14, -56], [-22, -50]], armR: [[16, -64], [24, -74]], extra: headphones(0, -82, 0.95) }, 112), thumbUp(57, 61, 1.1),
    rect(80, 14, 36, 56, '#bfe3f5', 2, C.ink, 1.8), W(98, 0.4, { top: C.orange, mouth: 'open', armL: SING_L, armR: SING_R }, 66), ring(40, 52, 15)),
  'conc.producera.2': all(ground(), disc(86, 60, 26, HL),
    waIn('conc-producera', -40, 0, at(24, 30, 0.8, rect(-3, -8, 6, 12, C.dark, 3, C.ink, 1), circle(0, -8, 4, C.silver, C.ink, 1)), drum(22, 62, 0.6), guitar(26, 96, 0.4, -40), mnote(44, 46, 0.8, C.navy)),
    arrow(36, 60, 56, 60, HL, 2.6), arrow(36, 32, 60, 46, HL, 2), arrow(36, 90, 60, 76, HL, 2)),
  'conc.skiva.2': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), rect(8, 22, 56, 56, '#3f6fb5', 2, C.ink, 1.6), circle(36, 50, 14, C.yellow, null), disc(70, 50, 28, C.red), cd(88, 92, 16), frame(4, 18, 98, 64)),
  'conc.demo': all(ground(), phone(30, 66, 1.6, all(circle(0, 2, 6, RED, null), envWave(-8, -10, 16, [1, 2, 1, 3, 1, 2], C.navy, 1))),
    rect(56, 40, 56, 36, C.white, 2, C.ink, 1.4), line('M60 58 C70 46 76 70 84 56 C92 44 100 64 108 54', C.grey, 2, '3 3'), mnote1(70, 66, 0.6, C.grey), T(84, 52, '?', 10, C.grey, 800),
    rect(60, 86, 44, 22, C.dark, 3, C.ink, 1.4), circle(72, 97, 5, C.white, C.ink, 1), circle(92, 97, 5, C.white, C.ink, 1), rect(70, 88, 24, 4, '#e8e2c8', 1, null)),
  'conc.skivbolag': all(rect(0, 0, 120, 112, '#cfe3ef', 0, null), ground(), rect(22, 22, 76, 90, '#e6d3b3', 2, C.ink, 1.8), disc(60, 40, 14, HL), ...range(2).flatMap((r) => range(4).map((c) => rect(28 + c * 18, 62 + r * 16, 10, 10, '#bfe3f5', 1, C.ink, 1))),
    rect(52, 94, 16, 18, C.brown, 1, C.ink, 1.4), box(10, 104, 16, 14), box(110, 104, 16, 14), disc(10, 92, 5), disc(110, 92, 5)),
  'conc.skivkontrakt': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), rect(26, 10, 60, 80, C.white, 2, C.ink, 1.6), disc(56, 26, 9, HL), ...range(4).map((i) => line(`M32 ${44 + i * 8} L80 ${44 + i * 8}`, C.grey, 1.6)),
    path('M34 82 C40 74 44 86 50 78 C54 72 58 84 64 78', 'none', C.navy, 1.8), line('M30 86 L82 86', C.ink, 1), g('translate(84 72) rotate(40)', rect(-2, -20, 4, 26, C.navy, 1, C.ink, 1), path('M-2 6 L2 6 L0 11 Z', C.ink, null)),
    at(60, 104, 1, path('M-30 0 C-20 -6 -10 -6 0 0 C10 -6 20 -6 30 0', 'none', C.ink, 0), rect(-34, -4, 22, 10, C.sky, 3, C.ink, 1.2), rect(12, -4, 22, 10, C.green, 3, C.ink, 1.2), ellipse(-6, 1, 9, 5, C.skin, C.ink, 1.2), ellipse(6, 1, 9, 5, C.skin2, C.ink, 1.2))),
  'conc.arrangemang.2': all(staff(6, 10, 108, 4, C.grey, 0.8), line('M10 18 C30 10 50 22 70 14 C90 8 100 18 112 14', HL, 2.6),
    ...[[keys(8, 40, 3, 7, 20), 46], [violin(16, 82, 0.8, -40, true), 82], [drum(16, 106, 0.6), 106]].map(([ic, y]) => all(ic as Svg, line(range(3).map((k) => `M34 ${(y as number) - 6 + k * 4} L112 ${(y as number) - 6 + k * 4}`).join(' '), C.grey2, 0.7))),
    ...[44, 66, 88].map((x) => note(x, 52 - (x % 3) * 2, 'q', C.purple, 0.6)), ...[40, 60, 80, 100].map((x) => note(x, 84 - (x % 4), 'h', C.red, 0.6)), ...[40, 52, 64, 76, 88, 100].map((x) => rect(x - 2, 102, 4, 4, C.dark, 1, null)),
    arrow(60, 22, 60, 32, HL, 2), frame(4, 34, 112, 80)),
  'conc.släppa.3': all(ground(), box(26, 92, 34, 26), disc(26, 70, 12, HL),
    waIn('conc-slappa', -34, 0, phone(70, 40, 0.9, mnote1(0, 0, 0.6, C.navy)), phone(100, 40, 0.9, mnote1(0, 0, 0.6, C.navy)), at(86, 92, 1, rect(-16, -14, 32, 28, '#f0e0c0', 2, C.ink, 1.4), disc(-6, 2, 6), disc(8, 2, 6))),
    arrow(40, 64, 60, 46, HL, 2.6), arrow(42, 82, 66, 88, HL, 2.6), sparkle(26, 48, 6, C.gold)),
  'conc.singel.2': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), at(36, 56, 1, rect(-24, -24, 48, 48, '#fde3c8', 2, C.ink, 1.6), disc(6, 0, 18, HL), mnote1(-12, -10, 0.6, C.ink)), frame(8, 28, 56, 56),
    greyed(rect(74, 30, 40, 52, '#d8e8f7', 2, C.ink, 1.4), ...range(8).map((i) => mnote1(80 + (i % 4) * 9, 44 + Math.floor(i / 4) * 20, 0.45, C.ink)))),
  'conc.lyssnare': all(ground(), rect(10, 70, 26, 18, C.red, 3, C.ink, 1.4), circle(18, 79, 5, C.dark, null), line('M30 70 L36 58', C.ink, 1.4), waves(38, 66, 3, 1, WAVE, 2, 5),
    fig(78, 0.92, { top: C.green, mouth: 'smile', eyes: 'closed', armL: [[-16, -60], [-12, -76]], armR: [[16, -60], [12, -76]], extra: headphones(0, -82, 0.95) }), mnote1(100, 20, 0.8, C.navy), mnote1(56, 16, 0.7, C.navy)),
  'conc.spellista': all(phone(60, 60, 2.4, all(...range(5).map((i) => all(rect(-8, -14 + i * 5.4, 4, 4, ['#f6c9d4', '#bfe3f5', '#c7b3e6', '#a8dcc0', '#f2c14e'][i]!, 0.6, null), line(`M-2.5 ${-12 + i * 5.4} L7 ${-12 + i * 5.4}`, C.ink, 0.9))), path('M-1 12 L-1 15 L1.5 13.5 Z', C.ink, null))),
    mnote1(98, 30, 1, C.navy), mnote1(20, 40, 0.9, C.navy)),
  'conc.topplista': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), rect(14, 8, 92, 104, C.white, 3, C.ink, 1.6),
    ...range(5).map((i) => all(rect(18, 14 + i * 19, 84, 16, i === 0 ? '#fde3c8' : '#f4f4f0', 2, C.grey2, 1), T(28, 26 + i * 19, String(i + 1), 11, C.ink, 900), mnote1(40, 22 + i * 19, 0.5, C.navy), line(`M48 ${22 + i * 19} L${80 - i * 4} ${22 + i * 19}`, C.grey, 2),
      i === 1 || i === 3 ? path(`M92 ${28 + i * 19} L98 ${20 + i * 19} L86 ${20 + i * 19} Z`, RED, null) : path(`M92 ${18 + i * 19} L98 ${26 + i * 19} L86 ${26 + i * 19} Z`, GREEN, null))),
    starShape(28, 12, 6, C.gold)),
  'conc.hitlåt': all(ground(), at(60, 46, 1, circle(0, 0, 22, '#fde3c8', C.ink, 1.6), mnote(-2, 0, 1.6, HL)), sparkle(30, 18, 5, C.gold), sparkle(92, 20, 6, C.gold),
    ...range(5).map((i) => all(fig(12 + i * 24, 0.36, { top: [C.green, C.orange, C.denim, C.purple, C.red][i]!, hair: i % 2 ? 'long' : 'short', mouth: 'wide', extra: headphones(0, -82, 0.95) }), heart(12 + i * 24, 66, 0.4, C.red))),
    waPulse('conc-hitlat', waves(84, 46, 2, 1, HL, 2, 5), waves(36, 46, 2, -1, HL, 2, 5))),

  // ── 4445 Inspelning och mixning ──────────────────────────────────
  'conc.studio': all(studioWall(), rect(0, 90, 120, 30, '#8a8f99', 0, null), line('M0 90 L120 90', C.ink, 1.4),
    rect(62, 12, 52, 40, '#bfe3f5', 2, C.ink, 2), desk(66, 38, 44, 12, 5), fig(88, 0.26, { top: C.green, extra: headphones(0, -82, 0.95) }, 40),
    drum(22, 100, 1, C.red), drum(42, 96, 0.6, C.red), line('M12 80 L24 76', C.gold, 2.2), amp(90, 108, 1), micStand(64, 0.62, 108), path('M64 108 C70 114 80 110 90 112', 'none', C.black, 1.2)),
  'conc.sångbås': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), rect(20, 8, 80, 104, '#d9d2c4', 3, C.ink, 2), ...range(4).flatMap((i) => range(3).map((j) => rect(24 + j * 25, 12 + i * 24, 22, 20, '#c4b9a5', 2, null))),
    rect(70, 18, 26, 18, '#bfe3f5', 1, C.ink, 1.4), W(46, 0.78, { top: C.orange, mouth: 'open', armL: SING_L, armR: [[14, -56], [8, -64]], extra: headphones(0, -82, 0.95) }), micStand(72, 0.7),
    circle(72, 60, 6, 'rgba(255,255,255,0.6)', C.ink, 1), frame(18, 6, 84, 108)),
  'conc.tagning': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), at(60, 34, 1, rect(-40, -18, 80, 36, C.dark, 4, C.ink, 1.6), circle(-26, 0, 6, RED, null), T(12, 9, '3', 26, C.white, 900)),
    ...range(3).map((i) => all(rect(14 + i * 34, 70, 28, 22, i === 2 ? '#fde3c8' : C.white, 2, i === 2 ? HL : C.ink, i === 2 ? 2.4 : 1.2), envWave(17 + i * 34, 81, 22, [1, 2, 1, 3, 2, 1], i === 2 ? HL : C.grey, 1.2))),
    cross(28, 100, 4), cross(62, 100, 4), tick(96, 100, 1.2)),
  'conc.ta-om.2': all(rect(14, 50, 92, 30, '#e3ecf7', 3, C.ink, 1.4), envWave(18, 65, 84, [1, 2, 3, 2, 1, 2, 3, 1, 2, 1], WAVE, 1.6), line('M86 46 L86 84', RED, 2),
    waSpin('conc-taom', 2.6, g('translate(60 26)', path('M14 0 A14 14 0 1 0 0 14', 'none', HL, 3.4), path('M-6 10 L4 14 L-2 22 Z', HL, null))),
    circle(24, 100, 6, RED, C.ink, 1.2), arrow(84, 96, 30, 96, HL, 2.6)),
  'conc.spår.4': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), drum(14, 20, 0.5), at(14, 40, 0.5, guitar(0, 0, 0.6, -60)), at(14, 56, 1, rect(-3, -6, 6, 10, C.dark, 3, C.ink, 1), circle(0, -6, 3, C.silver, C.ink, 1)), keys(5, 68, 3, 6, 10),
    lanes(28, 12, 86, 4, 0), frame(26, 10, 90, 16), drum(14, 20, 0.5, HL)),
  'conc.pålägg.3': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), lanes(10, 62, 100, 2), waIn('conc-palagg', 0, -24, all(rect(10, 40, 100, 14, '#fde3c8', 2, HL, 1.8), envWave(14, 47, 92, range(14).map((k) => 1 + (k % 4) * 0.7), HL, 1.4))),
    arrow(60, 22, 60, 36, HL, 2.6), at(60, 14, 1, guitar(0, 4, 0.3, -70)), circle(100, 14, 5, RED, null), greyed(drum(110, 100, 0.5))),
  'conc.mixerbord': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), path('M6 50 L114 50 L118 104 L2 104 Z', '#4a4d5a', C.ink, 1.8), desk(10, 54, 100, 46, 8, [0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.2, 0.7]), rect(40, 36, 40, 14, C.dark, 2, C.ink, 1.4), ...range(8).map((i) => rect(44 + i * 4, 46 - (i * 3 % 9), 2, 2 + (i * 3 % 9), GREEN, 0, null)), line('M10 104 L10 112 M110 104 L110 112', C.dark, 3)),
  'conc.mixning': all(...[[16, C.red], [34, GREEN], [52, C.purple]].map(([y, col]) => envWave(6, y as number, 40, [1, 2, 1, 3, 1, 2, 1], col as string, 1.6)),
    desk(48, 8, 30, 54, 3, [0.4, 0.8, 0.6]), moving('conc-mixning', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-10px)}', { dur: 2 }, rect(65.5, 36, 6, 5, HL, 1, C.ink, 0.8)),
    arrow(80, 34, 92, 34, HL, 2.4), envWave(94, 34, 22, [2, 3, 2, 3, 2], HL, 2.4), ground(), fig(60, 0.4, { top: C.green, armL: [[-14, -64], [-10, -76]], armR: [[14, -64], [10, -76]], extra: headphones(0, -82, 0.95) })),
  'conc.ljudbild': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), path('M10 100 A50 50 0 0 1 110 100', 'none', C.grey2, 2, ), path('M24 100 A36 36 0 0 1 96 100', 'none', C.grey2, 1.4),
    circle(60, 98, 12, C.skin, C.ink, 1.6), headphones(60, 96, 1.1), drum(20, 70, 0.5), at(36, 40, 0.5, guitar(0, 0, 0.6, -30)), at(60, 30, 1, rect(-3, -6, 6, 10, C.dark, 3, C.ink, 1), circle(0, -6, 3, C.silver, C.ink, 1)), keys(76, 34, 3, 6, 10), violin(100, 68, 0.6, 30),
    line('M10 100 A50 50 0 0 1 110 100', HL, 2.6, '5 4'), arrow(16, 108, 4, 108, HL, 2), arrow(104, 108, 116, 108, HL, 2)),
  'conc.klippa-verb.2': all(screenBox(10, 20, 100, 66, all(envWave(16, 52, 88, [1, 2, 3, 1, 2, 3, 2, 1, 2, 1, 3, 2], WAVE, 1.6), line('M40 30 L40 76 M60 30 L60 76', RED, 1.4, '3 2'))),
    moving('conc-klippa', '0%{transform:translate(0,0)}60%,100%{transform:translate(0,30px);opacity:.3}', { dur: 2.8 }, rect(40, 32, 20, 42, 'rgba(232,48,44,0.18)', 0, null)),
    scissors(50, 98, 1.3, -90)),

  // ── 4446 Låtskrivande ────────────────────────────────────────────
  'conc.låtskrivare': all(ground(), rect(54, 76, 60, 6, C.tan, 2, C.ink, 1.6), line('M60 82 L60 112 M108 82 L108 112', C.brown, 3),
    fig(32, 0.86, { top: C.denim, mouth: 'smile', armL: [[-18, -50], [-24, -60]], front: guitar(2, -44, 1, -62) }),
    rect(66, 64, 34, 12, C.white, 1, C.ink, 1.2), staff(68, 66, 14, 1.6, C.grey, 0.5), line('M86 67 L97 67 M86 71 L95 71', C.ink, 1), mnote1(76, 54, 0.7, C.navy), line('M98 60 L104 48', C.navy, 2)),
  'conc.komponera.1': all(ground(), keys(10, 74, 8, 12, 30), rect(30, 20, 60, 44, C.white, 2, C.ink, 1.4), staff(34, 30, 52, 5, C.grey, 0.8),
    ...[[42, 46], [54, 40], [66, 36], [78, 42]].map(([x, y], i) => moving(`conc-komp-${i}`, '0%,20%{opacity:0}45%,100%{opacity:1}', { dur: 3, delay: i * 0.4 }, note(x!, y!, 'q', NOTE, 0.8))),
    g('translate(94 46) rotate(30)', rect(-2, -16, 4, 22, C.yellow, 1, C.ink, 1), path('M-2 6 L2 6 L0 10 Z', C.ink, null))),
  'conc.textförfattare': all(ground(), rect(14, 76, 92, 6, C.tan, 2, C.ink, 1.6), line('M20 82 L20 112 M100 82 L100 112', C.brown, 3),
    fig(40, 0.78, { top: C.purple, hair: 'long', mouth: 'closed', armR: [[12, -54], [24, -50]] }), paper(58, 36, 40, 40, 5), ring(78, 56, 24),
    g('translate(86 64) rotate(30)', rect(-2, -16, 4, 22, C.navy, 1, C.ink, 1)), greyed(mnote1(102, 18, 0.7, C.grey), mnote1(110, 30, 0.6, C.grey))),
  'conc.intro': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ...['i', 'v', 'r', 'v', 'r'].map((k, i) => rect(6 + i * 22, 52, 20, 26, k === 'i' ? '#fde3c8' : k === 'r' ? '#f6d7c0' : '#d8e8f7', 3, C.ink, 1.2)),
    keys(8, 58, 2, 8, 14), ...[1, 2, 3, 4].map((i) => greyed(circle(16 + i * 22, 46, 4, C.skin, C.ink, 1), ellipse(16 + i * 22, 47, 1.6, 1.2, '#c84a4a', null))), frame(4, 50, 24, 30),
    arrow(6, 92, 112, 92, C.grey, 2), arrow(16, 30, 16, 46, HL, 2.4)),
  'conc.ackordföljd': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ...range(4).map((i) => {
    const x = 8 + i * 28;
    return all(rect(x, 40, 22, 30, C.white, 2, C.ink, 1.4), line(range(4).map((k) => `M${x + 3 + k * 5.3} 44 L${x + 3 + k * 5.3} 66`).join(' '), C.grey, 0.7), line(range(4).map((k) => `M${x + 3} ${44 + k * 7} L${x + 19} ${44 + k * 7}`).join(' '), C.grey, 0.7),
      ...[[1, 1], [2, 2], [3, 0]].map(([s, f]) => circle(x + 3 + ((s! + i) % 4) * 5.3, 47.5 + ((f! + i) % 3) * 7, 2, C.ink, null)), i < 3 ? arrow(x + 23, 55, x + 27, 55, HL, 2) : '');
  }), path('M110 76 C110 96 14 96 14 76', 'none', HL, 2), arrow(18, 82, 14, 74, HL, 2), guitar(60, 22, 0.3, -90)),
  'conc.skrivkramp': all(ground(), rect(36, 76, 76, 6, C.tan, 2, C.ink, 1.6), line('M42 82 L42 112 M106 82 L106 112', C.brown, 3), rect(62, 56, 30, 20, C.white, 1, C.ink, 1.2),
    fig(34, 0.82, { top: C.denim, mouth: 'frown', armL: [[-12, -62], [-6, -78]], armR: [[12, -62], [6, -78]] }), cloud(34, 12, 0.9, '#9aa3ad'), drops(34, 22),
    ...[[18, 108], [100, 108], [112, 70]].map(([x, y]) => circle(x!, y!, 4, C.white, C.ink, 1.2))),
  'conc.slinga.2': all(staff(8, 36, 104, 6, C.grey, 0.9), ...[[22, 54], [34, 48], [46, 42], [58, 48]].map(([x, y]) => note(x!, y!, 'q', HL, 1)), ...[[74, 54], [86, 48], [98, 42], [110, 48]].map(([x, y]) => note(x!, y!, 'q', C.navy, 1)),
    path('M18 70 C30 84 58 84 64 70', 'none', HL, 2.4), arrow(60, 76, 66, 68, HL, 2.4), waSpin('conc-slinga', 2.4, g('translate(60 100)', path('M-10 0 A10 10 0 1 1 0 10', 'none', HL, 2.8), path('M-5 8 L2 10 L-2 15 Z', HL, null)))),
  'conc.bidrag.3': all(ground(), envelope(30, 60, 1.1), mnote1(28, 56, 0.7, C.navy), arrow(50, 60, 66, 60, HL, 2.6), rect(68, 50, 44, 36, C.navy, 3, C.ink, 1.6), rect(78, 50, 24, 4, C.dark, 1, null),
    at(90, 30, 1, path('M-10 -12 L10 -12 L8 0 C6 6 -6 6 -8 0 Z', C.gold, C.ink, 1.4), path('M-10 -10 C-16 -10 -16 -2 -8 -1 M10 -10 C16 -10 16 -2 8 -1', 'none', C.ink, 1.2), rect(-2, 5, 4, 6, C.gold, 0, C.ink, 1), rect(-7, 11, 14, 3, C.dark, 1, null)),
    ...range(3).map((i) => rect(72 + i * 13, 60, 10, 8, C.white, 1, C.ink, 0.8)), starShape(90, 76, 5, C.gold)),

  // ── 4447 Musikkritik ─────────────────────────────────────────────
  'conc.debut': all(stage(), spot(60, 46), audience(6, 120), W(60, 0.6, { top: C.red, mouth: 'open', armL: SING_L, armR: [[16, -68], [26, -80]] }, 92),
    at(96, 30, 1, disc(0, 0, 12, HL), circle(0, 0, 14, 'none', C.gold, 1.4)), at(24, 26, 1, circle(0, 0, 10, C.gold, C.ink, 1.4), T(0, 4.5, '1', 13, C.white, 900)), sparkle(80, 14, 5, C.gold)),
  'conc.comeback': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ground(), rect(64, 70, 56, 42, '#6b4a33', 0, null), line('M64 70 L120 70', C.ink, 1.4),
    greyed(rect(6, 14, 36, 26, C.white, 2, C.ink, 1), ...range(3).flatMap((i) => range(4).map((j) => cross(12 + j * 8, 22 + i * 7, 2, C.grey)))),
    waIn('conc-comeback', -30, 0, fig(92, 0.6, { top: C.denim, hairCol: '#d8d8d8', mouth: 'wide', armL: [[-14, -70], [-20, -84]], front: guitar(2, -44, 1, -62) }, 70)),
    line('M26 48 C26 70 50 80 70 76', HL, 2.4, '4 3'), arrow(62, 78, 72, 76, HL, 2.4), mnote1(110, 20, 0.8, C.navy)),
  'conc.höjdpunkt': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), line('M8 104 L112 104 M8 104 L8 14', C.ink, 1.6),
    path('M8 96 C20 90 26 80 36 82 C46 84 50 70 60 66 C70 62 74 26 82 24 C90 22 94 70 112 80', 'none', WAVE, 3), starShape(82, 18, 9, C.gold), ring(82, 22, 14),
    greyed(audience(5, 120, '#5a5560'))),
  'conc.leverera.2': all(stage(), audience(6, 120), spot(52, 50),
    moving('conc-leverera', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-4px)}', { dur: 0.8 }, W(52, 0.7, { top: C.red, mouth: 'wide', armL: [[-16, -56], [-8, -66]], armR: [[16, -70], [28, -86]] }, 92), micStand(64, 0.5, 92)),
    rect(80, 8, 36, 22, C.white, 2, C.ink, 1.2), ...range(5).map((i) => starShape(85 + i * 6.5, 19, 3, i < 5 ? C.gold : C.grey2)), thumbUp(98, 46, 1.2)),
  'conc.lysande.2': all(rect(0, 0, 120, 120, '#2d2a3e', 0, null), ...range(5).map((i) => starShape(16 + i * 22, 60, 10, C.gold)),
    waPulse('conc-lysande', ...range(5).map((i) => circle(16 + i * 22, 60, 15, 'rgba(255,230,150,0.35)', null)), sparkle(30, 30, 6, C.gold), sparkle(90, 28, 7, C.gold), sparkle(60, 92, 6, C.gold)),
    greyed(rect(10, 98, 100, 12, '#5a5560', 3, null))),
  'conc.nyskapande': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), ...range(3).flatMap((r) => range(4).map((c) => (r === 1 && c === 2) ? '' : greyed(at(18 + c * 28, 24 + r * 36, 1, circle(0, 0, 11, C.grey2, C.ink, 1.2), mnote1(-1, 0, 0.6, C.grey))))),
    at(74, 60, 1, path('M0 -16 L5 -5 L16 -6 L8 2 L12 14 L0 7 L-12 14 L-8 2 L-16 -6 L-5 -5 Z', HL, C.ink, 1.4), mnote1(-1, 0, 0.6, C.white)), sparkle(94, 42, 5, C.gold), sparkle(58, 40, 4, C.gold)),
  'conc.slätstruken': all(rect(0, 0, 120, 120, '#efe6d8', 0, null), speaker(16, 40, 0.8), line('M30 40 L114 40', C.grey, 3), greyed(envWave(30, 40, 84, [3, 4, 2, 5, 3, 4, 2, 5], C.grey, 1.2)),
    ground(), fig(60, 0.62, { top: C.grey2, mouth: 'flat', eyes: 'closed', armL: [[-12, -58], [-4, -72]] }), T(86, 70, 'z', 11, C.grey, 800), T(96, 60, 'z', 9, C.grey, 800)),
  'conc.pretentiös': all(ground(), W(40, 0.86, { top: C.purple, mouth: 'closed', eyes: 'closed', tilt: -8, armL: [[-14, -60], [-24, -54]], armR: [[16, -64], [26, -76]],
    extra: all(path('M-12 -90 C-10 -102 12 -102 14 -92 Z', C.black, C.ink, 1.2), circle(10, -98, 1.6, C.black, null)) }), path('M64 22 L112 22 L112 54 L64 54 Z', '#fff6dc', C.ink, 1.4), path('M64 22 C58 26 58 50 64 54 M112 22 C118 26 118 50 112 54', 'none', C.ink, 1.4),
    line('M70 30 C78 26 84 34 92 30 C100 26 104 34 108 30 M70 38 C76 42 86 34 96 38 M70 46 C80 42 90 50 106 46', C.grey, 1.4), sparkle(58, 70, 4, C.gold),
    fig(98, 0.5, { top: C.green, mouth: 'flat', eyes: 'closed' }), path('M90 60 C94 56 102 56 106 60', 'none', C.ink, 1.2)),
};
