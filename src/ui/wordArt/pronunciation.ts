/**
 * Kultur & fritid → Språk & litteratur → Svenskt uttal & prosodi, 4321–4327 (0.61): vowels, long and short sounds,
 * consonants, stress patterns, word accents, sentence melody and pronunciation in connected speech.
 * Recurring signs: a head in profile cut open (lips, teeth, tongue, palate, nasal cavity, vocal cords) shows where a
 * sound is made; the part the word names is orange or ringed in orange; grey shows what the word is not. A sound is
 * a wave, its length an orange bar, pitch a curve, stress a big block next to small grey blocks, and a word a row of
 * blocks. Example letters appear only where the word is the term for them (vowel, consonant, silent letter).
 * Words that are easy to mix up get clearly different scenes: lång vokal (a glass of water and a long bar) and kort
 * vokal (an ice cream and a short bar); sje-ljud (round lips, a long wavy stream, seven and a lake) and tje-ljud (the
 * tongue pressed to the front of the palate, twenty and a church); tonande (vocal cords buzzing under the hand) and
 * tonlös (still cords, only a puff of air); betonad (one big loud block) and obetonad (a small whispered block);
 * flyta ihop (two blocks sliding into one), svälja (the last block disappears into the mouth), sluddra (a tired face
 * and a smeared bubble), artikulera (a wide mouth and crisp separate blocks), staka sig (reading aloud and a broken
 * bubble).
 * Digits, single letters and code signs only; no words that give the answer away, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, waShake, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { figure } from './figures';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const CAV = '#f6d3cd';
const NASAL = '#efc2bb';
const TONGUE = '#e07c7c';
const BONE = '#dccbb0';
const RED = '#e8302c';
const GREEN = '#3fa45b';
const WAVE = '#3a7bd5';
const bg = (col: string = '#f3f1ec') => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
/** A letter tile. */
const tile = (x: number, y: number, ch: string, fill: string = C.white, s = 1, ink: string = C.ink) =>
  g(`translate(${x} ${y}) scale(${s})`, rect(-8, -9, 16, 18, fill, 3, C.ink, 1.6), T(0, 5, ch, 13, ink, 800));
/** A word as a block (no letters): w wide. */
const block = (x: number, y: number, w: number, h: number, fill: string = '#bcd3ef', stroke: string = C.ink) => rect(x, y, w, h, fill, 4, stroke, 1.6);
/** n arcs (syllables) under a row starting at x. */
const arcs = (x: number, y: number, n: number, w: number, col: string = HL) => all(...range(n).map((i) => line(`M${x + i * w + 2} ${y} Q${x + i * w + w / 2} ${y + 9} ${x + i * w + w - 2} ${y}`, col, 2.4)));
/** Sound waves opening to the right (dir 1) or left (dir -1). */
const waves = (x: number, y: number, n = 3, dir = 1, col: string = WAVE, sw = 2.2) => all(...range(n).map((i) => {
  const r = 5 + i * 5, h = r * 0.8;
  return line(`M${x + dir * r * 0.5} ${y - h} Q${x + dir * r} ${y} ${x + dir * r * 0.5} ${y + h}`, col, sw);
}));
const ear = (x: number, y: number, s = 1, col: string = C.skin) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-6 -16 C8 -20 16 -8 12 2 C10 8 4 8 4 14 C4 20 -4 22 -8 16', col, C.ink, 2), path('M-2 -8 C6 -10 8 -2 4 2 C2 4 0 2 0 6', 'none', C.ink, 1.6));
const speaker = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -5 L-2 -5 L6 -12 L6 12 L-2 5 L-8 5 Z', C.dark, C.ink, 1.4));
const clockF = (x: number, y: number, r: number, deg: number, col: string = HL) => all(circle(x, y, r, C.white, C.ink, 1.6),
  path(`M${x} ${y} L${x} ${y - r + 2} A${r - 2} ${r - 2} 0 ${deg > 180 ? 1 : 0} 1 ${(x + Math.sin((deg * Math.PI) / 180) * (r - 2)).toFixed(1)} ${(y - Math.cos((deg * Math.PI) / 180) * (r - 2)).toFixed(1)} Z`, col, null),
  circle(x, y, 1.2, C.ink, null));
const glassW = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -16 L10 -16 L8 16 L-8 16 Z', 'rgba(210,235,250,0.7)', C.ink, 1.8), path('M-9 -6 L9 -6 L8 15 L-8 15 Z', '#8cc7e8', null), path('M-10 -16 L10 -16 L8 16 L-8 16 Z', 'none', C.ink, 1.8));
const iceCream = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 0 L9 0 L0 22 Z', '#e8b860', C.ink, 1.4), line('M-5 4 L3 14 M5 4 L-3 14', '#b88a30', 1), circle(0, -5, 9, '#f2a0c0', C.ink, 1.4), circle(-3, -13, 6.5, '#fbf4e4', C.ink, 1.4));
const house = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -14, 24, 16, '#e8d6b8', 1, C.ink, 1.4), path('M-15 -14 L0 -26 L15 -14 Z', '#c4543a', C.ink, 1.4), rect(-4, -7, 8, 9, '#8a5a32', 1, C.ink, 1));
const tomato = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 10, '#e2483d', C.ink, 1.6), path('M-6 -8 L0 -5 L6 -8 L3 -10 L0 -13 L-3 -10 Z', GREEN, C.ink, 1));
const banana = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -6 C-10 10 12 12 18 -4 C10 4 -6 4 -16 -6 Z', '#f2d04e', C.ink, 1.6), line('M-16 -6 L-18 -9', '#6b4a20', 2.4));
const cat = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 12, 8, '#9aa3ad', C.ink, 1.4), circle(-11, -8, 7, '#9aa3ad', C.ink, 1.4), path('M-16 -12 L-15 -19 L-11 -14 Z M-8 -14 L-5 -19 L-5 -11 Z', '#9aa3ad', C.ink, 1.1), circle(-13, -9, 1, C.ink, null), circle(-9, -9, 1, C.ink, null), path('M11 -2 C18 -6 18 -14 14 -16', 'none', C.ink, 2.4));
const hat = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 6, 18, 4, C.dark, C.ink, 1.4), rect(-10, -12, 20, 18, C.dark, 3, C.ink, 1.4), rect(-10, 0, 20, 4, HL, 0, null));
/** Small speech bubble with free content, tail down-left. */
const sb = (x: number, y: number, w: number, h: number, inner: Svg = '', fill: string = C.white) => all(path(`M${x} ${y} h${w} v${h} h${-w + 16} l-8 7 l1 -7 h${-9} Z`, fill, C.ink, 1.6), inner);
/** Burst (spiky) bubble centred at (x, y). */
const burst = (x: number, y: number, r: number, fill: string = '#fff3c4') => path(range(16).map((i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.72 : r; return `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`; }).join(' ') + ' Z', fill, C.ink, 1.6);
/** A pitch curve through points. */
const smooth = (d: string, col: string = HL, sw = 3) => line(d, col, sw);

// ── Front face (large) ───────────────────────────────────────────────
const face = (o: { mouth?: Svg; eyes?: 'open' | 'sleepy' | 'wide'; hair?: string; skin?: string } = {}) => all(circle(60, 60, 40, o.skin ?? C.skin, C.ink, 2.2), path('M20 50 C18 14 102 14 100 50 C90 30 30 30 20 50 Z', o.hair ?? C.hair, C.ink, 2),
  o.eyes === 'sleepy' ? line('M38 56 L52 57 M68 57 L82 56', C.ink, 2.4) : o.eyes === 'wide' ? all(circle(45, 56, 5, C.white, C.ink, 1.6), circle(75, 56, 5, C.white, C.ink, 1.6), circle(45, 56, 2, C.ink, null), circle(75, 56, 2, C.ink, null)) : all(circle(45, 56, 3, C.ink, null), circle(75, 56, 3, C.ink, null)),
  o.mouth ?? path('M48 80 Q60 86 72 80', 'none', C.ink, 2.2));
/** Lips seen from the front; round = protruded o-lips, spread = smiling i-lips. */
const lipsRound = (x: number, y: number, s = 1, col: string = C.rose) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 11, 12, col, C.ink, 1.8), ellipse(0, 0, 4.5, 5.5, '#5a2a2a', C.ink, 1.2));
const lipsSpread = (x: number, y: number, s = 1, col: string = C.rose) => g(`translate(${x} ${y}) scale(${s})`, path('M-20 0 C-10 -7 10 -7 20 0 C10 7 -10 7 -20 0 Z', col, C.ink, 1.8), path('M-15 0 C-6 -3 6 -3 15 0 C6 3 -6 3 -15 0 Z', '#5a2a2a', null));

// ── Head in profile, cut open (faces right) ─────────────────────────
type Prof = { hl?: string[]; lips?: 'round' | 'neutral' | 'closed' | 'open'; tongue?: 'rest' | 'tipUp' | 'front' | 'back' | 'between'; air?: 'mouth' | 'nose' | 'puff'; cords?: 'buzz' | 'still'; uvula?: (u: Svg) => Svg; extra?: Svg };
const TONGUES: Record<string, string> = {
  rest: 'M80 67 C77 61 64 58 57 63 C53 68 54 79 57 87 L64 85 C68 77 74 71 80 69 Z',
  tipUp: 'M82 57.5 C78 57 66 59 58 63 C53 68 54 79 57 87 L64 85 C70 75 76 66 82 60.5 Z',
  front: 'M80 65 C76 55 66 52.5 58 58 C53 66 54 79 57 87 L64 85 C68 77 74 71 80 67 Z',
  back: 'M80 67 C76 63 64 59 55.5 56 C52 62 54 79 57 87 L64 85 C68 77 74 71 80 69 Z',
  between: 'M90 61 C84 58.5 70 58.5 58 63 C53 68 54 79 57 87 L64 85 C70 75 78 66 90 64 Z',
};
function prof(o: Prof = {}): Svg {
  const hl = new Set(o.hl ?? []);
  const lipCol = hl.has('lips') ? HL : C.rose;
  const lips = o.lips ?? 'neutral';
  const lipsSvg = lips === 'round'
    ? all(path('M86 51 C93 51 96 55 94 59 L86 59 Z', lipCol, C.ink, 1.6), path('M86 63 L94 63 C96 67 93 71 86 71 Z', lipCol, C.ink, 1.6), ellipse(92, 61, 1.6, 2.4, '#5a2a2a', null))
    : lips === 'open'
      ? all(path('M86 52 L91 56 L85 58 Z', lipCol, C.ink, 1.4), path('M85 66 L90 70 L84 72 Z', lipCol, C.ink, 1.4), rect(84, 58, 4, 8, '#5a2a2a', 1, null))
      : all(path('M86 52 L91 57 L85 60 Z', lipCol, C.ink, 1.4), path('M85 60 L90 66 L85 69 Z', lipCol, C.ink, 1.4));
  const tongue = TONGUES[o.tongue ?? 'rest']!;
  const cordsY = 97;
  const cords = o.cords === 'buzz'
    ? waShake('pron-cords', line(`M51 ${cordsY} L52.5 ${cordsY - 2.5} L54.5 ${cordsY + 2.5} L56.5 ${cordsY - 2.5} L58 ${cordsY}`, hl.has('cords') ? HL : C.ink, 2))
    : line(`M51 ${cordsY} L58 ${cordsY}`, hl.has('cords') ? HL : '#8a6a6a', 2);
  const uv = all(line('M56 53 C52 55 50.5 58 51 61.5', hl.has('uvula') ? HL : BONE, 2.6), ellipse(51.2, 63, 1.8, 2.4, hl.has('uvula') ? HL : '#e9a8a0', C.ink, 0.8));
  return all(
    path('M30 112 L30 94 C14 86 8 62 12 42 C16 18 38 6 60 8 C74 9 82 18 83 30 L84 38 L97 48 L87 52 L91 57 C89 60 87 61 86 62 C88 64 90 66 90 68 L85 71 C86 77 84 81 79 83 C71 87 64 86 60 89 L60 112 Z', C.skin, C.ink, 2),
    path('M30 30 C30 10 66 4 78 22 C66 16 44 16 30 30 Z', C.hair, C.ink, 1.4),
    ellipse(34, 50, 5, 8, C.skin2, C.ink, 1.4), circle(70, 30, 2.4, C.ink, null), line('M64 24 L75 24', C.hair, 2),
    path('M87 50 C80 42 66 40 52 44 L50 52 C62 49 76 49 85 53 Z', hl.has('nose') ? '#ffd2b8' : NASAL, hl.has('nose') ? HL : null, 1.8),
    path('M86 58 C80 52 66 50 54 54 C49 58 48 66 50 76 L51 106 L58 106 L58 88 C62 86 70 84 74 76 C78 72 82 70 86 67 Z', CAV, null),
    line('M84 55 C78 50 66 49 56 53', hl.has('palate') ? HL : BONE, hl.has('palate') ? 4 : 3),
    o.uvula ? o.uvula(uv) : uv,
    path(tongue, hl.has('tongue') ? HL : TONGUE, C.ink, 1.4),
    rect(81, 54.5, 4, 5, C.white, 1, C.ink, 0.8), rect(81, 63.5, 4, 5, C.white, 1, C.ink, 0.8),
    lipsSvg, ellipse(89, 50, 1.4, 1, C.ink, null),
    cords,
    o.air === 'mouth' ? all(line('M54 100 C53 80 60 64 98 62', WAVE, 1.8, '3 3'), path('M98 58 L106 62 L98 66 Z', WAVE, null)) : '',
    o.air === 'nose' ? all(line('M54 100 C52 72 56 48 98 47', HL, 2, '3 3'), path('M98 43 L107 47 L98 51 Z', HL, null)) : '',
    o.extra ?? '');
}

/** The profile scaled down into the left two thirds (lips at about (64, 75)), nothing cut at the edge. */
const profS = (o: Prof = {}) => g('translate(-4 31) scale(0.72)', prof(o));

export const PRON_MOTIFS: Record<string, Svg> = {
  // ── 4321 Svenska vokalljud ──
  // vokal: an open mouth (air flows freely) and the nine vowel letters in orange around it
  'pron.vokal': all(bg(), face({ mouth: all(ellipse(60, 82, 13, 10, '#5a2a2a', C.ink, 2), path('M50 86 C56 90 64 90 70 86 L70 90 C64 92 56 92 50 90 Z', TONGUE, null)) }),
    ...['a', 'e', 'i', 'o', 'u', 'y', 'å', 'ä', 'ö'].map((ch, i) => { const a = Math.PI * (0.95 + (i / 8) * 1.1); return tile(Math.round(60 + Math.cos(a) * 50), Math.round(64 + Math.sin(a) * 50) + 8, ch, '#ffe0cc', 0.78); })),
  // läpp: a big face, both lips filled orange
  'pron.läpp': all(bg(), face({ mouth: all(path('M42 80 C50 72 56 76 60 77 C64 76 70 72 78 80 C70 82 50 82 42 80 Z', HL, C.ink, 2), path('M42 80 C50 82 70 82 78 80 C72 92 48 92 42 80 Z', HL, C.ink, 2)) }), ring(60, 82, 24)),
  // tungspets: the head cut open, the tip of the tongue (orange) touches the back of the upper teeth
  'pron.tungspets': all(bg(), prof({ tongue: 'tipUp', extra: all(path('M82 57.5 C80 57.3 77 57.6 75 58.4 L76 62.5 C78 61.6 80.5 61 82 60.5 Z', HL, C.ink, 1.2), ring(80, 59.5, 7)) })),
  // gom: the roof of the mouth glows orange, an arrow from the tongue points up to it
  'pron.gom': all(bg(), prof({ hl: ['palate'], extra: all(ring(70, 51, 13), line('M70 64 L70 56', HL, 1.8), path('M67 57 L70 52 L73 57 Z', HL, null)) })),
  // runda: spread grey lips become round orange lips
  'pron.runda': all(bg(), greyed(lipsSpread(28, 60, 0.9)), line('M48 60 L64 60', C.ink, 2.4), path('M62 55 L70 60 L62 65 Z', C.ink, null),
    moving('pronrunda', '0%{transform:scale(1.8,.45)}55%,100%{transform:scale(1,1)}', { dur: 2.6, spin: true }, lipsRound(90, 60, 1.5, HL)), ring(90, 60, 24)),
  // låta (verka när man hör det): an ear hears a sound; above, two wave cards with ≈ between them
  'pron.låta.2': all(bg(), speaker(18, 84, 1.2), waIn('pronlata', -10, 0, waves(28, 84, 3, 1)), ear(84, 84, 1.3),
    rect(10, 14, 40, 30, C.white, 4, C.ink, 1.6), smooth('M14 29 Q19 19 24 29 T34 29 T44 29', WAVE, 2.4), rect(70, 14, 40, 30, C.white, 4, HL, 2.4), smooth('M74 29 Q79 20 84 29 T94 29 T104 29', HL, 2.4), T(60, 35, '≈', 20, C.ink, 900)),
  // öva: a person practises in front of a phone; the bubbles go from wrong (red cross) to right (green tick)
  'pron.öva': all(bg(), figure({ x: 28, h: 0.82, top: C.green }), rect(48, 70, 12, 20, C.dark, 3, C.ink, 1.4), rect(50, 73, 8, 13, '#bfe3f5', 1, null),
    moving('pronova1', '0%{opacity:0}10%,100%{opacity:1}', { dur: 4 }, sb(64, 12, 44, 18, cross(86, 21, 5))),
    moving('pronova2', '0%,30%{opacity:0}40%,100%{opacity:1}', { dur: 4 }, sb(64, 40, 44, 18, T(86, 54, '~', 18, C.grey, 900))),
    moving('pronova3', '0%,60%{opacity:0}70%,100%{opacity:1}', { dur: 4 }, sb(64, 68, 44, 18, tick(86, 77, 1.3)))),
  // ljudskrift: a dictionary entry; a house, then the pronunciation in square brackets (orange)
  'pron.ljudskrift': all(bg(), path('M8 28 L60 22 L112 28 L112 102 L60 96 L8 102 Z', C.white, C.ink, 2), line('M60 22 L60 96', C.ink, 1.6),
    ...range(4).map((i) => line(`M16 ${44 + i * 14} L52 ${42 + i * 14}`, C.grey2, 2.4)), ...range(3).map((i) => line(`M68 ${70 + i * 10} L104 ${72 + i * 10}`, C.grey2, 2.4)),
    house(78, 52, 0.7), rect(86, 34, 26, 22, '#ffe0cc', 3, HL, 2), T(99, 49, '[ʉː]', 10, C.ink, 700)),
  // svåruttalad: a person struggles; the speech bubble holds a knotted line, a drop of sweat; a grey easy word beside
  'pron.svåruttalad': all(bg(), figure({ x: 30, h: 0.82, top: C.sky, face: 'neutral' }), path('M40 34 C38 30 42 28 42 32 C42 34 41 35 40 34 Z', '#8cc7e8', C.ink, 1),
    sb(52, 10, 62, 34, smooth('M58 30 C64 14 72 40 76 22 C80 8 92 40 86 24 C82 14 104 18 96 30 C92 36 106 36 108 26', HL, 2.6)), greyed(sb(70, 70, 38, 20, tick(89, 80, 1.2)))),

  // ── 4322 Långa och korta ljud ──
  // stavelse: a banana, below it two blocks with an orange arc under each (ba-nan)
  'pron.stavelse': all(bg(), banana(60, 36, 1.6), block(26, 66, 32, 22, '#ffe0cc', HL), block(62, 66, 32, 22, '#ffe0cc', HL), circle(42, 77, 3, C.ink, null), circle(78, 77, 3, C.ink, null), arcs(26, 94, 2, 36)),
  // lång vokal: a glass of water; the vowel tile and a long orange bar; a short grey bar for contrast
  'pron.lång-vokal': all(bg(), glassW(22, 40, 1.3), tile(54, 40, 'a', '#ffe0cc'), rect(66, 36, 48, 8, HL, 4, C.ink, 1.4), clockF(96, 72, 12, 300), greyed(tile(24, 94, 'a'), rect(36, 90, 10, 8, C.grey, 4, C.ink, 1.4))),
  // kort vokal: an ice cream; the vowel tile and a short orange bar; a long grey bar for contrast
  'pron.kort-vokal': all(bg(), iceCream(22, 40, 1.3), tile(54, 40, 'a', '#ffe0cc'), rect(66, 36, 12, 8, HL, 4, C.ink, 1.4), clockF(96, 72, 12, 60), greyed(tile(24, 94, 'a'), rect(36, 90, 50, 8, C.grey, 4, C.ink, 1.4))),
  // vokallängd: a ruler measures how long the sound bar from the mouth is
  'pron.vokallängd': all(bg(), profS({ lips: 'open' }), rect(66, 70, 46, 10, HL, 5, C.ink, 1.4),
    rect(64, 88, 50, 12, '#f2d04e', 1, C.ink, 1.4), ...range(11).map((i) => line(`M${66 + i * 4.6} 88 L${66 + i * 4.6} ${i % 5 === 0 ? 96 : 93}`, C.ink, 1)), line('M66 60 L66 106 M112 60 L112 106', HL, 1.6, '3 3'), clockF(98, 34, 12, 220)),
  // minimalt par: two picture cards (a plate of food, a tired face) that are almost the same; one orange dot marks the one difference
  'pron.minimalt-par': all(bg(), rect(6, 22, 48, 60, C.white, 5, C.ink, 2), rect(66, 22, 48, 60, C.white, 5, C.ink, 2),
    ellipse(30, 50, 16, 7, C.white, C.ink, 1.6), path('M20 48 C22 38 38 38 40 48 Z', '#c47a3a', C.ink, 1.2), circle(90, 50, 14, C.skin, C.ink, 1.6), line('M83 48 L88 49 M92 49 L97 48 M85 57 Q90 55 95 57', C.ink, 1.6),
    ...range(3).map((i) => rect(12 + i * 13, 88, 10, 12, C.white, 2, C.ink, 1.2)), ...range(3).map((i) => rect(72 + i * 13, 88, 10, 12, C.white, 2, C.ink, 1.2)), rect(111, 88, 6, 12, '#ffe0cc', 2, HL, 1.6), ring(114, 94, 8),
    T(60, 58, '↔', 16, C.ink, 900)),
  // stava: a person on the phone; letter tiles appear one by one in the bubble
  'pron.stava': all(bg(), figure({ x: 26, h: 0.8, top: C.purple, hairStyle: 'long' }), rect(30, 40, 6, 12, C.dark, 2, C.ink, 1),
    sb(44, 16, 72, 30), ...['K', 'A', 'T', 'T'].map((ch, i) => moving(`pronstava${i}`, `0%,${i * 18}%{opacity:0}${i * 18 + 8}%,100%{opacity:1}`, { dur: 4 }, tile(56 + i * 16, 31, ch, '#ffe0cc', 0.8))), cat(84, 80, 1.1)),
  // dubbelteckning: a hat and the tiles h a t t; the two same letters are orange and bracketed, the short a has a short bar
  'pron.dubbelteckning': all(bg(), hat(60, 32, 1.2), tile(24, 76, 'h'), tile(44, 76, 'a'), tile(68, 76, 't', '#ffe0cc'), tile(88, 76, 't', '#ffe0cc'),
    line('M58 92 L58 98 L98 98 L98 92', HL, 2.6), T(78, 112, '×2', 11, HL, 900), rect(38, 92, 12, 5, C.grey, 2, null)),
  // hörbar: waves from a speaker reach a big ear (tick); a grey faint wave far from another ear does not
  'pron.hörbar': all(bg(), speaker(18, 40, 1.2), waves(28, 40, 3, 1, HL), ear(84, 40, 1.4), tick(108, 22, 1.2),
    greyed(speaker(18, 92, 0.8), line('M28 90 Q31 92 28 94', C.grey, 1.4), ear(84, 92, 1), cross(106, 80, 5, C.grey))),

  // ── 4323 Svenska konsonantljud ──
  // konsonant: the lips close and stop the air (orange bar); consonant tiles in orange, vowel tiles grey
  'pron.konsonant': all(bg(), profS({ lips: 'closed', extra: all(line('M54 100 C53 82 58 66 76 62', WAVE, 1.8, '3 3'), rect(66, 52, 4, 20, HL, 1, null)) }),
    tile(84, 22, 'p', '#ffe0cc'), tile(104, 22, 't', '#ffe0cc'), tile(84, 44, 's', '#ffe0cc'), tile(104, 44, 'm', '#ffe0cc'), greyed(tile(88, 80, 'a'), tile(106, 80, 'o'))),
  // tungvrickare: a face with the tongue tied in a knot; a bubble of many repeated wave shapes
  'pron.tungvrickare': all(bg(), g('translate(0 10) scale(0.85) translate(10 0)', face({ eyes: 'wide', mouth: all(ellipse(60, 82, 10, 7, '#5a2a2a', C.ink, 2), path('M54 84 C54 98 66 98 66 84 Z', TONGUE, C.ink, 1.6), smooth('M56 92 C60 86 64 98 60 94 C56 90 62 88 64 92', HL, 2)) })),
    sb(62, 4, 54, 24, all(...range(5).map((i) => smooth(`M${66 + i * 9} 18 q2 -6 4 0 q2 6 4 0`, HL, 2))))),
  // sje-ljud: round lips, the back of the tongue raised, a long wavy stream; the digit 7, a lake and a spoon
  'pron.sje-ljud': all(bg(), profS({ lips: 'round', tongue: 'back', hl: ['lips'] }), smooth('M68 75 q4 -5 8 0 t8 0 t8 0 t8 0', HL, 2.6),
    T(98, 26, '7', 22, C.ink, 900), g('translate(94 102)', ellipse(0, 0, 18, 7, '#8cc7e8', C.ink, 1.6), line('M-8 -1 L-2 -1 M4 2 L10 2', C.white, 1.4)), g('translate(110 54) rotate(30)', ellipse(0, -8, 4, 6, '#c0c6cc', C.ink, 1.2), line('M0 -2 L0 12', '#c0c6cc', 2.6))),
  // tje-ljud: the front of the tongue pressed up to the palate (orange), spread lips, a short sharp hiss; 20 and a church
  'pron.tje-ljud': all(bg(), profS({ tongue: 'front', hl: ['tongue'], extra: ring(70, 57, 9) }), line('M66 72 L74 70 M66 77 L76 77', HL, 2.2),
    T(100, 28, '20', 20, C.ink, 900), g('translate(98 98)', rect(-12, -16, 24, 18, C.white, 1, C.ink, 1.4), path('M-14 -16 L0 -30 L14 -16 Z', '#c4543a', C.ink, 1.4), rect(-3, -44, 6, 14, C.white, 1, C.ink, 1.2), line('M0 -52 L0 -44 M-3 -48 L3 -48', C.ink, 1.6), rect(-3, -8, 6, 10, '#8a5a32', 1, C.ink, 1))),
  // hård vokal: a o u å on hard orange stone blocks; the other vowels small, grey and soft
  'pron.hård-vokal': all(bg(), ...['a', 'o', 'u', 'å'].map((ch, i) => g(`translate(${18 + i * 28} 46)`, rect(-12, -14, 24, 28, '#ffcfae', 0, C.ink, 2.4), line('M-12 -14 L-6 -18 L18 -18 L12 -14 M12 -14 L12 14 L18 10 L18 -18', C.ink, 1.6), T(0, 6, ch, 18, C.ink, 900))),
    greyed(...['e', 'i', 'y', 'ä', 'ö'].map((ch, i) => g(`translate(${16 + i * 22} 96)`, circle(0, 0, 9, C.white, C.ink, 1.4), T(0, 4.5, ch, 12, C.ink, 800))))),
  // mjuk vokal: e i y ä ö on soft orange cushions; the other vowels small, grey and square
  'pron.mjuk-vokal': all(bg(), ...['e', 'i', 'y', 'ä', 'ö'].map((ch, i) => g(`translate(${14 + i * 23} 46)`, ellipse(0, 0, 12, 14, '#ffcfae', C.ink, 1.6), path('M-8 -9 C-4 -12 4 -12 8 -9', 'none', C.white, 1.6), T(0, 6, ch, 16, C.ink, 900))),
    greyed(...['a', 'o', 'u', 'å'].map((ch, i) => g(`translate(${24 + i * 24} 96)`, rect(-8, -9, 16, 18, C.white, 0, C.ink, 1.4), T(0, 5, ch, 12, C.ink, 800))))),
  // tonande: a hand on the throat; the vocal cords buzz (orange zigzag); the tile v
  'pron.tonande': all(bg(), prof({ cords: 'buzz', hl: ['cords'], extra: ring(54.5, 97, 7) }),
    waShake('pronton', line('M64 92 L70 89 M64 97 L72 97 M64 102 L70 105', HL, 2.2)), tile(104, 86, 'v', '#ffe0cc')),
  // tonlös: a hand on the throat; the cords lie still (grey line), only a puff of air leaves the mouth; the tile f
  'pron.tonlös.2': all(bg(), prof({ cords: 'still', lips: 'open', extra: ring(54.5, 97, 7, C.grey) }),
    waIn('pronlos', -12, 0, g('translate(104 60)', path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', '#e6f3fb', HL, 1.6))), tile(104, 86, 'f', '#ffe0cc')),
  // nasal: the mouth is closed and the air goes out through the nose (orange arrow); the tiles m and n
  'pron.nasal.2': all(bg(), profS({ lips: 'closed', air: 'nose', hl: ['nose'] }), tile(98, 84, 'm', '#ffe0cc'), tile(110, 104, 'n', '#ffe0cc')),
  // läspa: the tip of the tongue between the teeth; the s comes out as a wobbly, wrong puff
  'pron.läspa': all(bg(), profS({ tongue: 'between', lips: 'open', hl: ['tongue'], extra: ring(86, 62, 6) }),
    waSway('pronlas', 6, g('translate(92 50)', sb(-18, -26, 40, 26, all(T(2, -6, 's', 18, C.ink, 900), smooth('M-12 -12 q4 -4 8 0 t8 0 t8 0 t8 0', RED, 1.6))))), cross(108, 18, 4)),
  // stum (bokstav): a heart; the tiles h j ä r t a, the orange h has a crossed-out speaker above it, the others sound
  'pron.stum.3': all(bg(), g('translate(60 26) scale(1.3)', path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', RED, C.ink, 1.4)),
    ...['h', 'j', 'ä', 'r', 't', 'a'].map((ch, i) => tile(12 + i * 19, 76, ch, i === 0 ? '#ffe0cc' : C.white, 0.95)), ring(12, 76, 12),
    speaker(10, 52, 0.8), cross(14, 52, 6), ...range(5).map((i) => waves(29 + i * 19, 54, 1, 1, WAVE, 1.6))),
  // skorra: the back of the mouth (orange, ringed) vibrates; the tip of the tongue rests; the tile r
  'pron.skorra': all(bg(), prof({ hl: ['uvula'], uvula: (u) => waShake('pronsko', u), extra: all(ring(52, 62, 8), line('M44 58 L40 56 M44 63 L39 63 M44 68 L40 70', HL, 1.8)) }), tile(104, 92, 'r', '#ffe0cc')),

  // ── 4324 Betoningsmönster ──
  // betonad: one big orange block with a stress mark and loud waves; two small grey blocks
  'pron.betonad': all(bg(), block(10, 46, 44, 40, '#ffcfae', HL), line('M32 30 L32 40', C.ink, 3.4), greyed(block(60, 62, 24, 24), block(88, 62, 24, 24)),
    speaker(18, 14, 1), waves(26, 14, 3, 1, HL, 2), ring(32, 66, 30)),
  // obetonad: a small faded block ringed in orange, a quiet speaker with one tiny wave; the big block grey
  'pron.obetonad': all(bg(), greyed(block(10, 46, 44, 40), line('M32 30 L32 40', C.ink, 3.4)), block(62, 66, 22, 20, '#fff3ea', HL), block(90, 66, 22, 20, '#fff3ea', '#e9b9a0'),
    speaker(66, 34, 0.7), line('M73 32 Q75 34 73 36', HL, 1.4), ring(73, 76, 17)),
  // rytm (i tal): a speech bubble with strong and weak beats, big and small dots in a regular pattern
  'pron.rytm.2': all(bg(), figure({ x: 22, h: 0.8, top: C.orange, hairStyle: 'long' }), sb(40, 18, 76, 40, all(...range(6).map((i) => circle(50 + i * 12, 38, i % 2 ? 3 : 6, i % 2 ? C.grey : HL, C.ink, 1.2)))),
    ...range(6).map((i) => line(`M${50 + i * 12} ${i % 2 ? 76 : 70} L${50 + i * 12} 84`, i % 2 ? C.grey : HL, i % 2 ? 2 : 3.4))),
  // knacka: a fist knocks on a door; knock marks
  'pron.knacka': all(bg(), rect(56, 8, 50, 104, '#b07a4a', 2, C.ink, 2), rect(62, 16, 38, 36, '#c48a58', 2, C.ink, 1.2), rect(62, 60, 38, 44, '#c48a58', 2, C.ink, 1.2), circle(64, 66, 3, C.gold, C.ink, 1),
    moving('pronknack', '0%,100%{transform:translate(0,0)}15%{transform:translate(-8px,0)}30%{transform:translate(0,0)}45%{transform:translate(-8px,0)}60%{transform:translate(0,0)}', { dur: 1.6 },
      path('M10 60 L32 54 L40 50 C46 48 52 52 52 58 L52 66 C52 72 46 74 40 72 L32 70 L10 74 Z', C.skin, C.ink, 2), line('M42 52 L42 72 M47 53 L47 71', C.skin2, 1.4)),
    waPulse('pronknackb', line('M48 42 L44 36 M54 40 L54 32 M48 80 L44 86', HL, 2.4))),
  // partikelverb: a verb block and a small orange particle block (with a stress mark) chained together; a heart (tycka om)
  'pron.partikelverb': all(bg(), block(10, 50, 52, 28, '#bcd3ef'), block(74, 50, 34, 28, '#ffcfae', HL), line('M91 34 L91 44', C.ink, 3.4),
    ellipse(66, 64, 7, 4, 'none', C.ink, 2), ellipse(72, 64, 7, 4, 'none', C.ink, 2), T(36, 69, 'tycka', 11, C.ink, 700), T(91, 69, 'om', 12, C.ink, 800),
    g('translate(60 98) scale(1.1)', path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', RED, C.ink, 1.4))),

  // ── 4325 Ordaccenter ──
  // ordaccent: one word block twice with different pitch curves above it, marked 1 (one fall) and 2 (two peaks)
  'pron.ordaccent': all(bg(), T(10, 26, '1', 14, C.ink, 900), smooth('M22 26 C34 14 50 22 64 34', HL, 3), block(22, 38, 46, 16), T(10, 80, '2', 14, C.ink, 900),
    smooth('M22 78 C30 62 38 64 44 76 C50 60 58 60 66 82', HL, 3), block(22, 88, 46, 16), ear(100, 60, 1.2), waves(82, 60, 2, 1, WAVE, 1.8)),
  // accent (uttal): a person speaks; the listener thinks of a place on a map, a pin in the south
  'pron.accent': all(bg(), figure({ x: 24, h: 0.8, top: C.orange, hairStyle: 'long' }), figure({ x: 96, h: 0.8, top: C.green }), sb(34, 18, 40, 20, smooth('M40 28 q4 -6 8 0 t8 0 t8 0 t8 0', HL, 2.2)),
    path('M76 30 C70 22 76 8 88 10 C94 2 110 4 112 14 C120 18 118 32 108 34 C102 40 86 40 80 34 Z', C.white, C.ink, 1.6), circle(90, 44, 2.6, C.white, C.ink, 1.2),
    path('M100 9 C104 10 104 14 102 18 C100 22 98 26 96 30 L93 31 C92 27 93 22 94 17 C95 13 97 9 100 9 Z', '#dff0d8', C.ink, 1.2), path('M94 24 C91 24 90 27 94 31 C98 27 97 24 94 24 Z', HL, C.ink, 1)),
  // ton (ljud): a tuning fork rings; a single note sits on one height line
  'pron.ton.2': all(bg(), g('translate(30 70)', path('M-8 -40 L-8 0 C-8 8 8 8 8 0 L8 -40', 'none', C.silver, 5), line('M-8 -40 L-8 0 C-8 8 8 8 8 0 L8 -40', C.ink, 1), line('M0 6 L0 34', C.silver, 5)), waves(42, 40, 3, 1, WAVE),
    line('M66 40 L114 40', C.grey2, 1.4), line('M66 60 L114 60', C.grey2, 1.4), line('M66 80 L114 80', C.grey2, 1.4), g('translate(90 60)', ellipse(0, 0, 7, 5, HL, C.ink, 1.4), line('M6.5 0 L6.5 -26', C.ink, 2))),
  // enstavig: a house; one block, one orange arc, the digit 1; three grey blocks for contrast
  'pron.enstavig': all(bg(), house(30, 42, 1.4), block(64, 26, 34, 24, '#ffcfae', HL), arcs(64, 54, 1, 34), T(81, 82, '1', 18, HL, 900), greyed(block(14, 90, 26, 16), block(44, 90, 26, 16), block(74, 90, 26, 16))),
  // flerstavig: tomatoes; three blocks, three orange arcs, the digit 3; one grey block for contrast
  'pron.flerstavig': all(bg(), tomato(20, 28, 1.1), tomato(40, 30, 1), tomato(30, 16, 0.9), ...range(3).map((i) => block(52 + i * 21, 18, 19, 22, '#ffcfae', HL)), arcs(52, 44, 3, 21), T(84, 74, '3', 18, HL, 900), greyed(block(16, 88, 30, 18))),
  // melodi (i tal): a person speaks; the bubble holds a flowing line that goes up and down like a song
  'pron.melodi.2': all(bg(), figure({ x: 22, h: 0.8, top: C.sky }), sb(40, 14, 76, 46, smooth('M46 44 C54 22 62 22 68 36 C74 50 82 50 88 32 C92 22 100 24 108 40', HL, 3)),
    g('translate(68 34) scale(0.5)', path('M0 6 L0 -10 L8 -12', 'none', C.ink, 2.4), ellipse(-2.5, 6, 3.4, 2.6, C.ink, null)), g('translate(98 30) scale(0.5)', path('M0 6 L0 -10 L8 -12', 'none', C.ink, 2.4), ellipse(-2.5, 6, 3.4, 2.6, C.ink, null))),
  // betydelseskillnad: one grey word block, two arrows to two different pictures (a fuel can, a thought bubble) and ≠ between them
  'pron.betydelseskillnad': all(bg(), block(38, 10, 44, 20, '#d7dde4'), line('M50 32 L28 54 M70 32 L92 54', C.ink, 2), path('M24 50 L26 58 L33 55 Z M96 50 L94 58 L87 55 Z', C.ink, null),
    g('translate(26 84)', path('M-14 -18 L10 -18 L14 -12 L14 18 L-14 18 Z', '#c43a32', C.ink, 2), rect(4, -24, 8, 6, '#c43a32', 1, C.ink, 1.6), line('M-8 -8 L8 8 M8 -8 L-8 8', '#9a2a24', 1.6)),
    g('translate(94 82)', path('M-16 0 C-20 -12 -8 -20 0 -16 C8 -22 20 -14 16 -4 C22 4 10 12 2 8 C-6 12 -18 10 -16 0 Z', C.white, C.ink, 1.6), circle(0, -4, 4, C.yellow, C.ink, 1), circle(-10, 14, 2.6, C.white, C.ink, 1), circle(-14, 20, 1.6, C.white, C.ink, 1)),
    T(60, 92, '≠', 26, HL, 900)),
  // höras (om ljud): waves from a bell travel to an ear
  'pron.höras.2': all(bg(), g('translate(22 54)', path('M-12 10 C-12 -4 -8 -14 0 -14 C8 -14 12 -4 12 10 L16 14 L-16 14 Z', C.gold, C.ink, 1.8), circle(0, 17, 3, C.gold, C.ink, 1.4), line('M0 -14 L0 -20', C.ink, 2)),
    waIn('pronhor', -24, 0, waves(44, 58, 3, 1, HL)), ear(90, 58, 1.6), ring(92, 58, 24)),

  // ── 4326 Satsmelodi ──
  // uppmaning: a person shows with an open hand towards a chair; the bubble holds an arrow to it; the other person sits down
  'pron.uppmaning': all(bg(), figure({ x: 24, h: 0.82, top: C.orange, hairStyle: 'long' }), line('M36 66 L50 62', C.orange, 5), path('M50 58 C56 56 58 60 56 64 L50 66 Z', C.skin, C.ink, 1.4),
    sb(30, 8, 50, 24, all(line('M38 20 L66 20', HL, 3), path('M64 15 L72 20 L64 25 Z', HL, null), T(76, 26, '!', 16, C.ink, 900))),
    g('translate(92 0)', rect(-14, 82, 28, 6, '#8a5a32', 1, C.ink, 1.4), line('M-12 88 L-12 112 M12 88 L12 112 M12 82 L12 60', '#8a5a32', 3)), waIn('pronupp', 0, -12, g('translate(90 0)', figure({ x: 0, h: 0.62, top: C.green })))),
  // utrop: a surprised face (wide eyes, round mouth, hands up) and a big spiky bubble with !
  'pron.utrop.2': all(bg(), g('translate(0 22) scale(0.8)', face({ eyes: 'wide', mouth: ellipse(60, 84, 8, 10, '#5a2a2a', C.ink, 2) })), burst(88, 22, 20), T(88, 32, '!', 26, HL, 900)),
  // fras: a sentence as a row of blocks; orange brackets group them into three phrases
  'pron.fras': all(bg(), ...[[8, 14], [24, 22], [50, 18], [70, 14], [88, 24]].map(([x, w]) => block(x!, 50, w!, 18)),
    line('M8 76 L8 82 L44 82 L44 76', HL, 2.8), line('M50 76 L50 82 L82 82 L82 76', HL, 2.8), line('M88 76 L88 82 L112 82 L112 76', HL, 2.8),
    sb(4, 18, 70, 20, smooth('M10 28 q4 -4 8 0 t8 0 t8 0 M44 28 q4 -4 8 0 t8 0', C.grey, 1.6))),
  // paus (i tal): two bubbles with an empty gap between them; in the gap an orange pause sign and a small clock
  'pron.paus.2': all(bg(), figure({ x: 16, h: 0.78, top: C.purple }), sb(30, 14, 30, 22, smooth('M34 25 q3 -4 6 0 t6 0 t6 0 t6 0', C.ink, 1.6)), sb(86, 14, 30, 22, smooth('M90 25 q3 -4 6 0 t6 0 t6 0 t6 0', C.ink, 1.6)),
    rect(64, 14, 6, 22, HL, 1.5, null), rect(74, 14, 6, 22, HL, 1.5, null), clockF(72, 64, 11, 45), line('M60 50 L60 88 M84 50 L84 88', HL, 1.4, '3 3')),

  // ── 4327 Uttal i sammanhängande tal ──
  // hänga med (förstå): a fast stream of bubbles from one person goes straight into the other person's head (tick)
  'pron.hänga-med.2': all(bg(), figure({ x: 18, h: 0.78, top: C.orange, hairStyle: 'long' }), figure({ x: 102, h: 0.78, top: C.green }),
    ...range(3).map((i) => moving(`pronhang${i}`, `0%{transform:translate(-30px,0);opacity:0}${20 + i * 15}%{opacity:1}100%{transform:translate(0,0);opacity:1}`, { dur: 2.4 }, sb(30 + i * 20, 20 + (i % 2) * 6, 18, 12, ''))),
    line('M30 50 L90 50', C.grey2, 1.4, '2 3'), tick(102, 18, 1.4)),
  // flyta ihop (om ljud): two word blocks slide together and melt into one; the overlap is orange
  'pron.flyta-ihop.2': all(bg(), figure({ x: 18, h: 0.74, top: C.sky }), waIn('pronfly1', -14, 0, block(34, 30, 42, 26, '#bcd3ef')), waIn('pronfly2', 14, 0, block(66, 30, 46, 26, '#bcd3ef')),
    rect(66, 30, 10, 26, HL, 0, null), line('M34 64 L112 64', HL, 2.4), greyed(block(34, 84, 34, 20), block(78, 84, 34, 20))),
  // svälja (uttala otydligt): a bubble of word blocks where the last one is only a dashed outline; it slides back into the mouth
  'pron.svälja.3': all(bg(), profS({ lips: 'open' }), sb(56, 14, 60, 26, all(block(60, 20, 16, 14), block(80, 20, 14, 14), rect(98, 20, 14, 14, 'none', 3, C.grey, 1.4))),
    moving('pronsval', '0%{transform:translate(47px,-47px);opacity:1}60%,100%{transform:translate(0,0);opacity:.35}', { dur: 2.8 }, rect(54, 70, 8, 8, HL, 2, C.ink, 1.2)), ring(105, 27, 11)),
  // staka sig: a person reads aloud from a book; the bubble breaks off with repeated short pieces and jumps
  'pron.staka-sig': all(bg(), figure({ x: 26, h: 0.82, top: C.sky }), path('M14 72 L26 66 L38 72 L38 88 L26 82 L14 88 Z', C.white, C.ink, 1.6), line('M26 66 L26 82', C.ink, 1.2),
    waShake('pronstaka', sb(44, 14, 72, 30, all(block(50, 22, 18, 14), rect(72, 22, 6, 14, '#ffcfae', 2, HL, 1.4), rect(81, 22, 6, 14, '#ffcfae', 2, HL, 1.4), rect(90, 22, 6, 14, '#ffcfae', 2, HL, 1.4), line('M100 22 L104 36', RED, 2.4)))),
    T(104, 70, '…', 22, HL, 900)),
  // uttalsfel: the speaker's bubble shows an ice cream (red cross) while what she wants is a glass of water (green tick)
  'pron.uttalsfel': all(bg(), figure({ x: 22, h: 0.82, top: C.orange, hairStyle: 'long' }), sb(36, 10, 40, 40, iceCream(56, 26, 0.8)), cross(72, 14, 5),
    glassW(98, 90, 1), tick(110, 66, 1.2), line('M80 58 L92 70', C.grey, 1.6, '3 3')),
  // artikulera: a wide, clear mouth; crisp separate blocks leave it one by one
  'pron.artikulera': all(bg(), g('translate(2 24) scale(0.6)', face({ mouth: moving('pronart', '0%,100%{transform:scale(1,1)}50%{transform:scale(1.2,.6)}', { dur: 1.6, spin: true }, ellipse(60, 82, 14, 11, '#5a2a2a', C.ink, 2.2), path('M48 78 C54 74 66 74 72 78', 'none', C.rose, 3)) })),
    ...range(3).map((i) => moving(`pronartb${i}`, `0%,${i * 20}%{opacity:0;transform:translate(-10px,0)}${i * 20 + 15}%,100%{opacity:1;transform:translate(0,0)}`, { dur: 3 }, rect(70 + i * 16, 54, 12, 14, '#ffcfae', 2, HL, 1.8))), tick(92, 88, 1.4)),
  // sluddra: a tired face with half-closed eyes; the bubble is smeared, the blocks run into each other
  'pron.sluddra': all(bg(), g('translate(2 30) scale(0.6)', face({ eyes: 'sleepy', mouth: path('M48 84 Q56 80 62 86 Q68 90 74 82', 'none', C.ink, 2.4) })),
    waSway('pronslud', 4, sb(56, 12, 60, 30, all(ellipse(70, 26, 10, 7, 'rgba(228,87,46,0.45)', null), ellipse(84, 28, 11, 6, 'rgba(228,87,46,0.45)', null), ellipse(98, 25, 10, 7, 'rgba(228,87,46,0.45)', null), smooth('M62 30 C70 22 76 34 84 26 C92 20 98 34 108 26', C.ink, 1.2)))),
    T(90, 70, 'z', 14, C.grey, 800), T(100, 62, 'z', 10, C.grey, 800)),
  // flytande (om språk): a person speaks in one smooth, unbroken orange ribbon; a grey broken stream for contrast
  'pron.flytande.2': all(bg(), figure({ x: 18, h: 0.8, top: C.green, hairStyle: 'long' }), smooth('M30 40 C46 26 58 50 74 36 C88 24 98 44 114 32', HL, 6), greyed(line('M30 82 L42 82 M50 82 L58 82 M68 82 L74 82 M84 82 L96 82', C.grey, 5))),
};
