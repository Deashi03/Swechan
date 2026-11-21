/**
 * Teknik & digital värld → Programmering & AI → Generativ AI, 3861–3867 (0.56): language models, tokens and context
 * windows, prompts, image generation, speech recognition, hallucinations and fact-checking, AI safety and limits.
 * Recurring signs: AI is a purple chip or round avatar with a white four-point sparkle; a chat is a window with bubbles
 * (the person's bubble blue on the right, the AI's lilac on the left); text is grey lines; a token is a coloured block;
 * sound is curved waves. The part the word names is ringed or framed in orange, and a grey copy shows what the word is not.
 * Close words get one clear contrast each: generativ (one chip, three kinds of new things fanning out; grey chip that only
 * sorts) / generera (a laptop pushing out one page); AI-assistent (a chat on a phone with a person) / AI-verktyg (a tool
 * in a toolbox); token (a text bar cut into numbered blocks) / kontextfönster (a window over the end of a long text, the
 * start greyed); korta ner (a page shrinking) / överskrida (a bar running past a red line); omformulera (blocks
 * changing order) / finjustera (a dial turned a little); fotorealistisk (a shaded apple in a camera frame) / tecknad
 * (comic panels and a pencil) / illustration (a picture on a book page) / stil (one tree drawn three ways);
 * taligenkänning (wave → microphone → chip → text, no person) / diktera (a person talking a letter into being) /
 * läsa upp (a phone sending waves to a listener) / röstkommando (a short call that lights a lamp); hallucination (an AI
 * bubble with a ghost book that the shelf does not have) / hitta på (a person whose bubble builds a dashed story);
 * spärr (a striped barrier between a dangerous question and the AI) / kringgå (a figure going round a rule paper).
 * Digits and code signs only; no words, no letters, no brands, no logos and no pointing fingers.
 * Verbs and process words move (genai-* classes; base state = the poster frame, transform and opacity only).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waIn, waPulse, waSway, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const AI = '#7b5cd6';
const AI2 = '#c9b8f2';
const UB = '#bfe0f7';
const GREEN = '#3a9a5a';
const RED = '#d8343a';
const BLUE = '#3a6ab0';
const STEEL = '#8c96a3';
const PAPER = '#fbfbf8';
const SCREEN = '#eaf4fb';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Digits and code signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.24));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.24));
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey, sw = 1.3) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * gap} L${f1(x + w - (i % 3) * w * 0.18)} ${y + i * gap}`, col, sw)));
const squiggle = (x: number, y: number, w: number, col: string = C.grey, sw = 1.3) => line(`M${x} ${y} q${f1(w / 8)} -2 ${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0`, col, sw);
const dashed = (d: string, col: string = C.grey) => line(d, col, 1.4, '3 3');

// ── AI signs ─────────────────────────────────────────────────────────
/** Four-point sparkle centred on (x, y). */
const spark = (x: number, y: number, r: number, col: string = AI) => path(`M${x} ${f1(y - r)} Q${x} ${y} ${f1(x + r)} ${y} Q${x} ${y} ${x} ${f1(y + r)} Q${x} ${y} ${f1(x - r)} ${y} Q${x} ${y} ${x} ${f1(y - r)} Z`, col, null);
/** AI chip: purple rounded square with pins and a white sparkle; s = 1 is 20 wide. */
const chip = (x: number, y: number, s = 1, grey = false) => {
  const k = at(x, y, s, ...[-6, 0, 6].map((d) => line(`M${d} -10 L${d} -13 M${d} 10 L${d} 13 M-10 ${d} L-13 ${d} M10 ${d} L13 ${d}`, C.ink, 1.4)), rect(-10, -10, 20, 20, AI, 5, C.ink, 1.4), spark(0, 0, 7, C.white));
  return grey ? greyed(k) : k;
};
const avatar = (x: number, y: number, r = 7) => all(circle(x, y, r, AI, C.ink, 1.2), spark(x, y, r * 0.7, C.white));
/** Chat bubble: tail 'l', 'r' or none. */
const bub = (x: number, y: number, w: number, h: number, fill: string, tail: 'l' | 'r' | '' = '', inner: Svg = '') => all(
  tail === 'l' ? path(`M${x + 4} ${y + h - 2} L${x - 2} ${y + h + 4} L${x + 10} ${y + h - 1} Z`, fill, C.ink, 1.1) : '',
  tail === 'r' ? path(`M${x + w - 4} ${y + h - 2} L${x + w + 2} ${y + h + 4} L${x + w - 10} ${y + h - 1} Z`, fill, C.ink, 1.1) : '',
  rect(x, y, w, h, fill, Math.min(6, h / 2), C.ink, 1.2), inner);
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCREEN, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', C.grey, C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-16, -28, 32, 56, C.dark, 5, C.ink, 1.6), rect(-13.4, -23, 26.8, 45, SCREEN, 1.6, null), inner);
/** Head and shoulders; (x, y) = head centre. */
const bust = (x: number, y: number, col: string, s = 1, mood: 'smile' | 'talk' | 'calm' | 'frown' | 'sly' = 'smile', o: { grey?: boolean; long?: boolean; hood?: boolean } = {}) => {
  const sk = o.grey ? C.grey2 : C.skin, hair = o.grey ? C.grey : C.hair, top = o.grey ? C.grey : col;
  return at(x, y, s, path('M-12 20 C-12 9 12 9 12 20 Z', top, C.ink, 1.2),
    o.long ? path('M-8 -2 C-10 6 -9 10 -6 12 L6 12 C9 10 10 6 8 -2 Z', hair, null) : '',
    o.hood ? path('M-10 4 C-12 -14 12 -14 10 4 L10 10 L-10 10 Z', '#3d3f4a', C.ink, 1.2) : '',
    circle(0, 0, 7.5, sk, C.ink, 1.2), o.hood ? '' : path('M-7.5 -1.5 C-7.5 -10 7.5 -10 7.5 -1.5 C4 -5 -4 -5 -7.5 -1.5 Z', hair, null),
    mood === 'talk' ? all(circle(-2.6, -0.5, 1.1, C.ink, null), circle(2.6, -0.5, 1.1, C.ink, null), ellipse(0, 3.8, 1.8, 1.6, '#c84a4a', C.ink, 0.8))
      : mood === 'calm' ? all(line('M-4 0 L-1.4 0 M1.4 0 L4 0', C.ink, 1.1), path('M-2.4 3 Q0 4.8 2.4 3', 'none', C.ink, 1))
        : mood === 'frown' ? all(line('M-4.4 -3.4 L-1.4 -2.2 M4.4 -3.4 L1.4 -2.2', C.ink, 1), circle(-2.6, 0, 1.1, C.ink, null), circle(2.6, 0, 1.1, C.ink, null), path('M-2.6 4.6 Q0 2.6 2.6 4.6', 'none', C.ink, 1))
          : mood === 'sly' ? all(line('M-4 0 L-1.4 0.4 M1.4 0.4 L4 0', C.ink, 1.2), path('M-2.8 3 Q1 5.6 3.2 2.2', 'none', C.ink, 1.1))
            : all(circle(-2.6, 0, 1.1, C.ink, null), circle(2.6, 0, 1.1, C.ink, null), path('M-2.6 3 Q0 5.4 2.6 3', 'none', C.ink, 1)));
};
const waves = (x: number, y: number, n = 3, col: string = BLUE, gap = 5, dir = 1) => all(...Array.from({ length: n }, (_, i) => path(`M${x + dir * i * gap} ${y - 5 - i * 3} Q${x + dir * (i * gap + 4)} ${y} ${x + dir * i * gap} ${y + 5 + i * 3}`, 'none', col, 1.8)));
const wave = (x: number, y: number, w: number, col: string = BLUE, amp = 6, sw = 2) => line(`M${x} ${y} ${Array.from({ length: 8 }, (_, i) => `L${f1(x + (i + 0.5) * w / 8)} ${f1(y + (i % 2 ? amp : -amp) * (0.4 + ((i * 7) % 5) / 6))}`).join(' ')} L${x + w} ${y}`, col, sw);
const page = (x: number, y: number, w: number, h: number, n: number, fill: string = PAPER) => all(rect(x, y, w, h, fill, 2, C.ink, 1.3), lines(x + 5, y + 7, w - 10, n, Math.min(6, (h - 10) / Math.max(1, n))));
const magnifier = (x: number, y: number, s = 1) => at(x, y, s, line('M7 7 L16 16', C.dark, 4), circle(0, 0, 9, 'rgba(220,240,252,0.55)', C.ink, 2));
const coin = (x: number, y: number, r = 6) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.6, 'none', C.ink, 0.7));
const thumb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), path('M-5 7 L-5 22 L6 22 L6 7', C.skin, C.ink, 1.1));
const warn = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M0 -10 L10 8 L-10 8 Z', col, C.ink, 1.4), line('M0 -4 L0 2', C.ink, 2), circle(0, 5, 1.1, C.ink, null));
const block = (x: number, y: number, w: number, col: string, h = 14) => all(rect(x, y, w, h, col, 3, C.ink, 1.2), squiggle(x + 3, y + h / 2, w - 6, 'rgba(255,255,255,0.9)', 1.4));
/** A small tree: 'geo' triangles, 'soft' blobs, 'line' outline only. */
const tree = (x: number, y: number, kind: 'geo' | 'soft' | 'line') => kind === 'geo'
  ? all(rect(x - 2, y + 6, 4, 10, '#8a5a3a', 0, C.ink, 1), path(`M${x} ${y - 18} L${x + 11} ${y - 2} L${x - 11} ${y - 2} Z`, '#3f9a5a', C.ink, 1.2), path(`M${x} ${y - 10} L${x + 13} ${y + 8} L${x - 13} ${y + 8} Z`, '#2f8a4a', C.ink, 1.2))
  : kind === 'soft'
    ? all(rect(x - 2, y + 4, 4, 12, '#b08a6a', 2, null), circle(x - 6, y - 2, 8, 'rgba(110,190,120,0.75)', null), circle(x + 6, y - 4, 8, 'rgba(150,210,130,0.75)', null), circle(x, y - 11, 8, 'rgba(90,170,110,0.7)', null))
    : all(line(`M${x} ${y + 16} L${x} ${y + 2} M${x} ${y + 8} L${x - 5} ${y + 3}`, C.ink, 1.4), path(`M${x - 11} ${y + 2} C${x - 16} ${y - 6} ${x - 8} ${y - 18} ${x} ${y - 16} C${x + 8} ${y - 18} ${x + 16} ${y - 6} ${x + 11} ${y + 2} Z`, 'none', C.ink, 1.4));
const flagSE = (x: number, y: number, w = 26) => all(rect(x, y, w, w * 0.62, '#2f6fb5', 1, C.ink, 1), rect(x + w * 0.3, y, w * 0.13, w * 0.62, C.yellow, 0, null), rect(x, y + w * 0.245, w, w * 0.13, C.yellow, 0, null), rect(x, y, w, w * 0.62, 'none', 1, C.ink, 1));
const robotArm = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, 30, 20, 8, STEEL, 2, C.ink, 1.3), path('M0 32 L-6 4', 'none', '#f0a030', 7), path('M0 32 L-6 4', 'none', C.ink, 1), circle(0, 32, 4, STEEL, C.ink, 1.2), path('M-6 4 L14 -6', 'none', '#f0a030', 6), circle(-6, 4, 3.4, STEEL, C.ink, 1.2), path('M14 -6 L20 -2 M14 -6 L18 -12', 'none', C.ink, 2));
const miniFig = (x: number, y: number, col: string, s = 1) => at(x, y, s, path('M-6 14 C-6 5 6 5 6 14 Z', col, C.ink, 1), circle(0, 0, 4.6, C.skin, C.ink, 1), path('M-4.6 -1 C-4.6 -6.5 4.6 -6.5 4.6 -1 C2.4 -3 -2.4 -3 -4.6 -1 Z', C.hair, null));
const book = (x: number, y: number, col: string, s = 1) => at(x, y, s, rect(-8, -11, 16, 22, col, 1.5, C.ink, 1.2), line('M-5 -11 L-5 11', 'rgba(0,0,0,0.25)', 1.4), lines(-2, -5, 7, 2, 4, 'rgba(255,255,255,0.85)', 1.2));
const bus = (x: number, y: number, s = 1, dash = false) => at(x, y, s, rect(-16, -9, 32, 16, dash ? 'none' : C.yellow, 3, C.ink, 1.3), ...(dash ? [] : [rect(-13, -6, 7, 6, SCREEN, 1, C.ink, 0.8), rect(-4, -6, 7, 6, SCREEN, 1, C.ink, 0.8), rect(5, -6, 7, 6, SCREEN, 1, C.ink, 0.8)]), circle(-9, 8, 3, dash ? 'none' : C.dark, C.ink, 1.1), circle(9, 8, 3, dash ? 'none' : C.dark, C.ink, 1.1));
const clock = (x: number, y: number, r: number, mins: number, dash = false) => { const a = (mins / 60) * Math.PI * 2 - Math.PI / 2; return all(circle(x, y, r, dash ? 'none' : C.white, C.ink, 1.3), line(`M${x} ${y} L${x} ${f1(y - r * 0.55)}`, C.ink, 1.4), line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.8)} ${f1(y + Math.sin(a) * r * 0.8)}`, RED, 1.3)); };
const DASH = (...k: Svg[]) => `<g stroke-dasharray="3 2">${k.join('')}</g>`;
/** The part appears after `delay` seconds and stays: lines written one by one. */
const appear = (name: string, delay: number, ...k: Svg[]) => moving(name, '0%,15%{opacity:0}35%,100%{opacity:1}', { dur: 3.2, delay }, ...k);

export const GENAI_MOTIFS: Record<string, Svg> = {
  // ── 3861 Språkmodeller ───────────────────────────────────────────
  /** generativ: one chip in the middle with three different new things fanning out; a grey chip that only sorts. */
  'genai.generativ': all(ground,
    line('M60 48 L30 28 M60 48 L92 26 M60 48 L94 78', AI2, 3),
    rect(10, 12, 32, 24, PAPER, 2, C.ink, 1.3), path('M12 34 L22 22 L30 30 L34 26 L40 34 Z', '#5aa86a', C.ink, 1), circle(34, 18, 3, C.yellow, C.ink, 0.8), spark(42, 12, 4, C.yellow),
    circle(94, 22, 13, '#fde6c8', C.ink, 1.3), path('M90 28 L90 15 L99 13 L99 25', 'none', C.ink, 1.8), ellipse(88, 28, 2.6, 2, C.ink, null), ellipse(97, 25, 2.6, 2, C.ink, null), spark(108, 12, 4, C.yellow),
    page(84, 66, 24, 30, 4), spark(110, 64, 4, C.yellow),
    chip(60, 48, 1.4), ring(62, 50, 54, 46),
    greyed(chip(18, 90, 0.7), line('M24 96 L32 104 M24 96 L32 90', C.ink, 1.4), rect(33, 86, 8, 8, C.white, 1, C.ink, 1), rect(33, 100, 8, 8, C.white, 1, C.ink, 1))),
  /** generera: a laptop with the AI sparkle pushes a new page up out of the screen. */
  'genai.generera.2': all(ground,
    laptop(60, 104, 1.1, all(chip(0, -20, 0.8), lines(-20, -8, 14, 1, 4, C.grey, 1.3))),
    waIn('genai-generera-1', 0, 30, page(42, 8, 36, 44, 5), spark(80, 10, 5, C.yellow)),
    arrow(60, 66, 60, 56, HL, 2.4), frame(38, 4, 44, 52)),
  /** AI-assistent: a person asks on a phone; the AI avatar answers in a lilac bubble. */
  'genai.AI-assistent': all(ground,
    bust(26, 74, BLUE, 1.5, 'smile', { long: true }),
    phone(84, 62, 1.5, all(bub(-3, -20, 14, 9, UB, 'r'), num('?', 4, -13, 8, BLUE),
      avatar(-8, -2, 4), bub(-3, -6, 15, 18, AI2, 'l', lines(0, -1, 10, 3, 4, C.ink, 1)), bub(-1, 15, 13, 5, UB, 'r'))),
    ring(80, 66, 20, 16)),
  /** AI-verktyg: a toolbox with ordinary grey tools and one purple tool with an AI chip for a head, lifted out. */
  'genai.AI-verktyg': all(ground,
    greyed(line('M34 76 L28 50', STEEL, 5), path('M24 48 C22 42 30 40 32 46 L30 52 Z', STEEL, C.ink, 1.2), rect(42, 52, 6, 24, '#d09040', 2, C.ink, 1), line('M45 52 L45 40', C.ink, 2.4)),
    rect(16, 72, 88, 36, '#c84a3a', 3, C.ink, 1.6), rect(16, 72, 88, 8, '#a83a2c', 2, C.ink, 1.2), path('M46 72 L46 64 L74 64 L74 72', 'none', C.ink, 3),
    waBob('genai-verktyg-1', 3, rect(76, 30, 7, 30, AI, 3, C.ink, 1.2), chip(79.5, 20, 0.9), spark(96, 12, 4, C.yellow)),
    ring(80, 34, 16, 28)),
  /** ordförslag: a phone keyboard with three suggestion chips above it; the middle one is picked. */
  'genai.ordförslag': all(ground,
    phone(60, 60, 1.8, all(rect(-11, -20, 22, 9, PAPER, 2, C.ink, 0.7), squiggle(-9, -15.5, 11, C.ink, 1), line('M4 -18 L4 -13', BLUE, 1.2),
      ...[-9, 0, 9].map((d, i) => all(rect(d - 4, -6, 8, 6, i === 1 ? '#ffe0c2' : C.white, 1.5, C.ink, 0.6), squiggle(d - 3, -3, 6, C.grey, 0.8))),
      rect(-12, 3, 24, 17, '#d7dde4', 1, null), ...Array.from({ length: 12 }, (_, i) => rect(-11 + (i % 6) * 3.8, 4.5 + Math.floor(i / 6) * 5, 3, 4, C.white, 0.6, null)), rect(-6, 15, 12, 3.4, C.white, 0.6, null))),
    thumb(66, 66, 1), ring(60, 55, 11, 9)),
  /** människoliknande: a robot with a human face, hair and smile next to a person; a grey boxy robot as contrast. */
  'genai.människoliknande': all(ground,
    rect(34, 66, 34, 40, STEEL, 6, C.ink, 1.5), circle(44, 78, 2, C.white, C.ink, 0.8), circle(58, 78, 2, C.white, C.ink, 0.8), line('M40 92 L62 92', C.ink, 1.2), rect(30, 72, 6, 24, STEEL, 3, C.ink, 1.2), rect(66, 72, 6, 24, STEEL, 3, C.ink, 1.2),
    rect(46, 58, 10, 9, STEEL, 1, C.ink, 1.2), ellipse(51, 42, 15, 17, C.skin, C.ink, 1.5), path('M36 40 C34 22 68 22 66 40 C60 30 42 30 36 40 Z', C.hair, null),
    circle(45, 43, 1.6, C.ink, null), circle(57, 43, 1.6, C.ink, null), path('M45 50 Q51 55 57 50', 'none', C.ink, 1.3), ellipse(41, 49, 2.4, 1.4, '#f08aa0', null), ellipse(61, 49, 2.4, 1.4, '#f08aa0', null),
    ring(51, 42, 20, 22), num('=', 82, 52, 14, HL), bust(100, 50, C.green, 1.2),
    greyed(rect(92, 84, 18, 16, STEEL, 2, C.ink, 1.2), rect(95, 89, 4, 3, C.ink, 0, null), rect(103, 89, 4, 3, C.ink, 0, null), line('M96 96 L106 96', C.ink, 1.2), rect(94, 100, 14, 10, STEEL, 2, C.ink, 1))),

  // ── 3862 Token och kontextfönster ─────────────────────────────────
  /** token: a grey text bar is cut into coloured, numbered blocks; one block is ringed. */
  'genai.token': all(ground,
    rect(10, 18, 100, 14, '#e8ebef', 3, C.ink, 1.2), squiggle(14, 25, 92, C.grey, 1.6),
    ...[30, 52, 70, 92].map((x) => line(`M${x} 14 L${x} 36`, RED, 1.2, '2 2')),
    arrow(60, 40, 60, 54, C.grey, 2.2),
    block(8, 62, 20, BLUE), block(31, 62, 19, C.orange), block(53, 62, 15, GREEN), block(71, 62, 19, AI), block(93, 62, 19, '#d0507a'),
    num('1', 18, 90, 9), num('2', 40, 90, 9), num('3', 60, 90, 9), num('4', 80, 90, 9), num('5', 102, 90, 9),
    ring(41, 72, 14, 16)),
  /** kontextfönster: a window frame over the last part of a long text; the start above is greyed, the AI reads the window. */
  'genai.kontextfönster': all(ground,
    rect(22, 4, 56, 104, PAPER, 2, C.ink, 1.3),
    greyed(lines(28, 10, 44, 7, 5, C.ink, 1.4)),
    lines(28, 52, 44, 9, 5.4, C.ink, 1.4),
    rect(18, 44, 64, 64, 'rgba(255,224,194,0.25)', 3, HL, 3), line('M50 44 L50 108 M18 76 L82 76', HL, 1.6),
    chip(100, 76, 0.9), arrow(88, 76, 84, 76, AI, 2)),
  /** överskrida: a bar grows past a red limit line; the part beyond is red and a warning sign lights up. */
  'genai.överskrida': all(ground,
    rect(8, 50, 84, 22, '#eef1f4', 3, C.ink, 1.3),
    g('translate(10 53)', moving('genai-overskrida-1', '0%{transform:scaleX(.35)}60%,100%{transform:scaleX(1)}', { dur: 3 }, rect(0, 0, 72, 16, GREEN, 2, null), rect(72, 0, 30, 16, RED, 2, C.ink, 1.2))),
    line('M82 36 L82 86', RED, 2.4, '4 3'), arrow(96, 92, 108, 92, RED, 2.4),
    waPulse('genai-overskrida-2', warn(100, 30, 1.3)), ring(98, 61, 16, 18)),
  /** korta ner: a page shrinks to half its height; the old length is a dashed outline. */
  'genai.korta-ner': all(ground,
    dashed('M30 8 L82 8 L82 106 L30 106 Z', C.grey), greyed(lines(36, 66, 40, 6, 6, C.ink, 1.3)),
    g('translate(30 8)', moving('genai-korta-1', '0%{transform:scaleY(2)}55%,100%{transform:scaleY(1)}', { dur: 3 }, rect(0, 0, 52, 50, PAPER, 2, C.ink, 1.5), lines(6, 9, 40, 6, 6, C.ink, 1.4))),
    arrow(96, 100, 96, 62, HL, 2.6), frame(26, 4, 60, 58)),
  /** chatthistorik: a chat window with a long list of earlier bubbles, a scroll bar and a clock with a back arrow. */
  'genai.chatthistorik': all(ground,
    rect(12, 8, 96, 100, PAPER, 4, C.ink, 1.5), rect(12, 8, 96, 14, '#dfe6ee', 4, C.ink, 1.2),
    clock(24, 15, 5, 45), path('M15 10 C14 14 15 18 18 20', 'none', BLUE, 1.4), path('M15 10 L13 13 L17 13 Z', BLUE, null),
    ...[0, 1, 2, 3, 4, 5].map((i) => i % 2 ? bub(54, 28 + i * 13, 36, 9, UB, 'r') : all(avatar(22, 32 + i * 13, 3.6), bub(28, 28 + i * 13, 36, 9, AI2, 'l'))),
    rect(98, 26, 5, 78, '#e8ebef', 2, null), rect(98, 88, 5, 14, C.grey, 2, null),
    frame(16, 24, 80, 82)),
  /** gratisversion: a bright card with a 0 coin and few ticks; a grey card with coins and many ticks. */
  'genai.gratisversion': all(ground,
    rect(8, 18, 50, 88, PAPER, 4, C.ink, 1.5), circle(33, 34, 10, C.gold, C.ink, 1.3), num('0', 33, 38.5, 12),
    ok(18, 58, 5), lines(26, 58, 26, 1), ok(18, 72, 5), lines(26, 72, 26, 1), greyed(no(18, 86, 5), lines(26, 86, 26, 1), no(18, 98, 5)),
    greyed(rect(64, 18, 50, 88, PAPER, 4, C.ink, 1.5), coin(82, 36, 6), coin(90, 32, 6), coin(98, 36, 6), ...[58, 70, 82, 94].map((y) => all(ok(74, y, 5), lines(82, y, 24, 1)))),
    frame(4, 14, 58, 96)),

  // ── 3863 Promptar och instruktioner ──────────────────────────────
  /** prompt: the input field at the bottom of a chat on a laptop, with text and a send button. */
  'genai.prompt': all(ground,
    laptop(60, 100, 1.3, all(avatar(-20, -29, 3.5), bub(-15, -33, 22, 7, AI2, 'l'),
      rect(-24, -16, 40, 10, C.white, 3, C.ink, 0.9), lines(-21, -12.5, 28, 1, 3, C.ink, 1), line('M10 -14 L10 -8', BLUE, 1), circle(20, -11, 4.5, BLUE, C.ink, 0.8), path('M18 -11 L22 -11 M20 -13 L22 -11 L20 -9', 'none', C.white, 1.1))),
    ring(58, 85, 32, 11)),
  /** bakgrundsinformation: behind a question bubble, a panel with who, when and where; the AI reads both. */
  'genai.bakgrundsinformation': all(ground,
    rect(8, 14, 66, 52, '#fdf0c8', 4, C.ink, 1.4), bust(22, 32, C.green, 0.9), clock(42, 32, 7, 40), path('M35 26 C33 30 34 35 37 38', 'none', BLUE, 1.2),
    path('M56 38 L64 30 L72 38 L72 46 L56 46 Z', '#e0a070', C.ink, 1.1), rect(62, 40, 4, 6, C.dark, 0, null), lines(16, 54, 50, 2, 5, C.grey, 1.3),
    frame(4, 10, 74, 60),
    bub(48, 64, 58, 30, C.white, 'r', num('?', 77, 85, 18, BLUE)), chip(100, 28, 0.9), arrow(96, 42, 82, 56, AI, 2)),
  /** ton: the same message as a soft, warm bubble with a smile and as a spiky grey bubble with a frown. */
  'genai.ton.3': all(ground,
    bust(60, 92, C.orange, 1.1, 'talk'),
    path('M8 14 C8 6 54 6 54 14 L54 40 C54 48 8 48 8 40 Z', '#ffd6dc', C.ink, 1.5), path('M40 46 L48 58 L30 47 Z', '#ffd6dc', C.ink, 1.2), lines(14, 20, 30, 3, 6, C.ink, 1.3), circle(46, 20, 4, C.yellow, C.ink, 0.8), path('M44 21 Q46 23 48 21', 'none', C.ink, 0.8),
    ring(31, 28, 28, 24),
    greyed(path('M66 12 L72 6 L78 12 L86 4 L92 12 L100 6 L104 14 L112 16 L106 24 L112 32 L104 36 L106 46 L96 42 L88 50 L82 42 L72 48 L70 40 L62 38 L66 30 L60 22 L68 20 Z', '#e8ebef', C.ink, 1.4), lines(74, 20, 24, 3, 6, C.ink, 1.3), line('M80 54 L72 60', C.ink, 1))),
  /** omformulera: three blocks in a row get a new order; the old order is grey above. */
  'genai.omformulera': all(ground,
    greyed(block(12, 20, 28, BLUE), block(44, 20, 28, C.yellow), block(76, 20, 28, GREEN)),
    dashed('M26 38 C30 56 50 60 58 74', C.grey), dashed('M58 38 C62 56 82 60 90 74', C.grey), dashed('M90 38 C80 60 40 56 26 74', C.grey),
    waIn('genai-omform-1', -32, -56, block(44, 76, 28, BLUE)), waIn('genai-omform-2', -32, -56, block(76, 76, 28, C.yellow)), waIn('genai-omform-3', 64, -56, block(12, 76, 28, GREEN)),
    frame(8, 70, 100, 26)),
  /** finjustera: a dial with fine marks; the needle is turned a little into the green zone; a magnifier on the marks. */
  'genai.finjustera': all(ground,
    circle(60, 62, 36, PAPER, C.ink, 1.8), path('M72 29 A34 34 0 0 1 86 38 L80 43 A26 26 0 0 0 70 37 Z', '#9be08a', null),
    ...Array.from({ length: 25 }, (_, i) => { const a = Math.PI * (0.75 + i * 1.5 / 24); const r1 = i % 4 ? 30 : 27; return line(`M${f1(60 + Math.cos(a) * r1)} ${f1(62 + Math.sin(a) * r1)} L${f1(60 + Math.cos(a) * 34)} ${f1(62 + Math.sin(a) * 34)}`, C.ink, i % 4 ? 0.9 : 1.6); }),
    waSway('genai-finjust-1', 5, line('M60 62 L77 37', RED, 2.6), line('M60 62 L43 87', 'rgba(0,0,0,0)', 2.6)),
    circle(60, 62, 5, C.dark, C.ink, 1.2),
    path('M30 98 A34 34 0 0 0 44 104', 'none', HL, 2), path('M90 98 A34 34 0 0 1 76 104', 'none', HL, 2), path('M44 104 L40 100 M44 104 L39 106', 'none', HL, 2), path('M76 104 L80 100 M76 104 L81 106', 'none', HL, 2),
    magnifier(88, 24, 1.1)),

  // ── 3864 Bildgenerering ──────────────────────────────────────────
  /** bildgenerator: a short text line on a laptop becomes a new picture above it. */
  'genai.bildgenerator': all(ground,
    laptop(60, 106, 1.05, all(chip(-16, -22, 0.6), rect(-8, -24, 30, 6, C.white, 2, C.ink, 0.7), squiggle(-6, -21, 24, C.ink, 1), arrow(0, -12, 0, -8, C.grey, 1.4))),
    rect(20, 6, 80, 54, '#cfe8f7', 3, C.ink, 1.5), circle(84, 18, 6, C.yellow, C.ink, 1), path('M20 46 L44 24 L60 40 L70 32 L100 52 L100 60 L20 60 Z', '#5aa86a', C.ink, 1.2),
    path('M30 44 L40 36 L50 44 L50 54 L30 54 Z', RED, C.ink, 1.1), rect(37, 47, 6, 7, C.dark, 0, null), spark(18, 6, 5, C.yellow), spark(102, 58, 5, C.yellow),
    arrow(60, 70, 60, 62, AI, 2.4), frame(16, 2, 88, 62)),
  /** stil: the same little scene (house, tree and sun) painted twice – on the left in soft watercolour blobs with a round brush below, on the right as thin black line drawing with a pencil below; a two-way arrow between them; both pictures are framed, so the way of drawing is what differs. */
  'genai.stil': all(ground,
    rect(4, 14, 52, 60, PAPER, 2, C.ink, 1.3), rect(64, 14, 52, 60, PAPER, 2, C.ink, 1.3),
    circle(44, 26, 7, 'rgba(250,200,70,0.85)', null), path('M10 66 L10 48 L22 38 L34 48 L34 66 Z', 'rgba(230,120,100,0.8)', null), rect(19, 54, 6, 12, 'rgba(120,80,60,0.75)', 2, null), tree(44, 54, 'soft'),
    circle(104, 26, 7, 'none', C.ink, 1.4), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(104 + Math.cos(a) * 9)} ${f1(26 + Math.sin(a) * 9)} L${f1(104 + Math.cos(a) * 12)} ${f1(26 + Math.sin(a) * 12)}`, C.ink, 1.1); }),
    path('M70 66 L70 48 L82 38 L94 48 L94 66 Z', 'none', C.ink, 1.4), rect(79, 54, 6, 12, 'none', 0, C.ink, 1.2), tree(104, 54, 'line'),
    line('M50 92 L20 102', '#b08a5a', 4), path('M20 102 C14 104 12 106 10 108 C16 108 20 106 22 104 Z', '#5a8ad0', C.ink, 0.9),
    line('M96 90 L76 104', '#f2c14e', 5), path('M76 104 L72 108 L78 106 Z', C.ink, null),
    arrow(54, 44, 66, 44, HL, 2.2), arrow(66, 44, 54, 44, HL, 2.2),
    frame(2, 12, 56, 64), frame(62, 12, 56, 64)),
  /** fotorealistisk: a shaded, shiny apple in a camera frame; a flat grey cartoon apple as contrast. */
  'genai.fotorealistisk': all(ground,
    `<defs><radialGradient id="genai-apple" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#ff8a7a"/><stop offset="0.45" stop-color="#d62f2a"/><stop offset="1" stop-color="#7a1414"/></radialGradient></defs>`,
    ellipse(58, 94, 26, 5, 'rgba(0,0,0,0.25)', null),
    path('M58 46 C44 34 22 42 26 68 C29 86 44 96 58 90 C72 96 88 86 90 68 C94 42 72 34 58 46 Z', 'url(#genai-apple)', '#5a1010', 1),
    ellipse(42, 58, 5, 9, 'rgba(255,255,255,0.55)', null), path('M58 46 C58 38 60 32 64 28', 'none', '#5a3a1a', 2.4), path('M62 36 C70 26 84 28 86 32 C80 40 68 40 62 36 Z', '#4a9a3a', '#2a5a2a', 1), line('M64 35 L82 32', '#2a6a2a', 0.8),
    ...[[18, 20, 1], [98, 20, -1]].map(([x, y, d]) => line(`M${x} ${y! + 10} L${x} ${y} L${x! + d! * 10} ${y}`, HL, 3)), ...[[18, 102, 1], [98, 102, -1]].map(([x, y, d]) => line(`M${x} ${y! - 10} L${x} ${y} L${x! + d! * 10} ${y}`, HL, 3)),
    rect(96, 4, 18, 12, C.dark, 2, C.ink, 1), circle(105, 10, 3.6, '#8cc7e8', C.ink, 0.8),
    greyed(path('M10 8 C6 4 2 8 3 13 C4 17 8 18 10 17 C12 18 16 17 17 13 C18 8 14 4 10 8 Z', RED, C.ink, 1.6))),
  /** tecknad: two comic panels with a cartoon cat and a speech bubble; a pencil drawing the outline. */
  'genai.tecknad': all(ground,
    rect(6, 12, 52, 60, PAPER, 1, C.ink, 2.2), rect(62, 12, 52, 60, PAPER, 1, C.ink, 2.2),
    ...[[30, 52, 0], [88, 52, 1]].map(([x, y, k]) => all(path(`M${x! - 14} ${y! + 16} C${x! - 16} ${y} ${x! + 16} ${y} ${x! + 14} ${y! + 16} Z`, C.orange, C.ink, 2.2),
      circle(x!, y! - 4, 12, C.orange, C.ink, 2.2), path(`M${x! - 11} ${y! - 10} L${x! - 9} ${y! - 21} L${x! - 3} ${y! - 15} Z M${x! + 11} ${y! - 10} L${x! + 9} ${y! - 21} L${x! + 3} ${y! - 15} Z`, C.orange, C.ink, 2.2),
      circle(x! - 4, y! - 5, k ? 1.2 : 3, C.white, C.ink, 1.4), circle(x! + 4, y! - 5, k ? 1.2 : 3, C.white, C.ink, 1.4), circle(x! - 4, y! - 5, 1.2, C.ink, null), circle(x! + 4, y! - 5, 1.2, C.ink, null), path(`M${x! - 3} ${y! + 1} Q${x} ${y! + 4} ${x! + 3} ${y! + 1}`, 'none', C.ink, 1.4))),
    bub(14, 16, 26, 12, C.white, 'r', squiggle(17, 22, 20, C.ink, 1.2)),
    g('translate(96 90) rotate(-40)', rect(-3, -22, 6, 30, C.yellow, 1, C.ink, 1.2), path('M-3 8 L0 15 L3 8 Z', C.skin2, C.ink, 1), circle(0, 14, 1, C.ink, null)), path('M66 102 C74 96 82 104 90 98', 'none', C.ink, 2),
    frame(3, 9, 114, 66)),
  /** illustration: an open book with text on the left page and a picture on the right page. */
  'genai.illustration': all(ground,
    path('M60 30 C46 24 22 24 8 28 L8 98 C22 94 46 94 60 100 Z', PAPER, C.ink, 1.5), path('M60 30 C74 24 98 24 112 28 L112 98 C98 94 74 94 60 100 Z', PAPER, C.ink, 1.5),
    lines(16, 40, 36, 8, 6.5, C.grey, 1.4),
    rect(68, 38, 38, 46, '#dff0fb', 2, C.ink, 1.2), path('M72 76 C80 68 94 70 102 76', 'none', '#8a5a3a', 2.4), ellipse(86, 62, 9, 7, C.yellow, C.ink, 1.1), circle(93, 57, 5, C.yellow, C.ink, 1.1), path('M97 57 L102 58 L97 60 Z', C.orange, C.ink, 0.8), circle(94, 56, 0.9, C.ink, null), path('M80 62 L72 66 L80 66 Z', '#e0a020', C.ink, 0.8),
    frame(64, 34, 46, 54)),
  /** vattenmärke: a photo with a large see-through emblem and small repeated marks over it. */
  'genai.vattenmärke': all(ground,
    rect(8, 14, 104, 80, '#bfe0f7', 3, C.ink, 1.5), path('M8 70 L34 44 L50 60 L66 40 L112 78 L112 94 L8 94 Z', '#5aa86a', C.ink, 1.2), ellipse(40, 86, 18, 4, '#7ab8e0', null), circle(92, 30, 7, C.yellow, C.ink, 1),
    `<g opacity="0.55">${all(circle(60, 54, 20, 'rgba(255,255,255,0.5)', C.white, 2.4), spark(60, 54, 12, C.white), ...[[22, 28], [98, 82], [24, 82], [100, 50]].map(([x, y]) => all(circle(x!, y!, 6, 'none', C.white, 1.4), spark(x!, y!, 4, C.white))))}</g>`,
    ring(60, 54, 25)),
  /** konstnär: a person paints a picture on an easel, holding a palette. */
  'genai.konstnär': all(ground,
    line('M74 108 L84 30 L94 108 M84 30 L84 108', '#a0673d', 3), rect(62, 26, 44, 44, PAPER, 1, C.ink, 1.5), circle(94, 36, 5, C.yellow, C.ink, 0.8), path('M62 62 L76 46 L86 56 L94 50 L106 62 L106 70 L62 70 Z', '#5aa86a', C.ink, 1), rect(60, 70, 48, 4, '#a0673d', 1, C.ink, 1),
    bust(28, 56, C.purple, 1.7, 'calm'),
    line('M44 80 L66 58', C.skin, 6), line('M44 80 L66 58', C.ink, 0.7), line('M64 60 L74 50', '#a0673d', 2.4), circle(75, 49, 2, BLUE, null),
    path('M8 92 C6 82 26 78 34 86 C38 90 32 94 28 92 C24 98 10 100 8 92 Z', '#e6c391', C.ink, 1.2), circle(14, 88, 2, RED, null), circle(20, 85, 2, BLUE, null), circle(26, 87, 2, C.yellow, null),
    ring(30, 64, 26, 34)),

  // ── 3865 Taligenkänning ──────────────────────────────────────────
  /** taligenkänning: sound waves go into a microphone, through an AI chip, and come out as text lines – no person. */
  'genai.taligenkänning': all(ground,
    waves(6, 40, 3, BLUE, 5), rect(22, 28, 12, 22, C.dark, 6, C.ink, 1.3), line('M22 40 C22 52 34 52 34 40 M28 50 L28 62 M20 62 L36 62', C.ink, 1.6),
    arrow(38, 40, 50, 40, C.grey, 2), chip(62, 40, 1), arrow(76, 40, 86, 40, C.grey, 2),
    rect(88, 22, 26, 38, PAPER, 2, C.ink, 1.3), lines(92, 30, 18, 5, 6, C.ink, 1.4),
    ring(42, 40, 38, 20),
    rect(12, 74, 96, 30, '#eef1f4', 4, C.ink, 1.2), wave(18, 89, 40, BLUE, 7), arrow(62, 89, 70, 89, C.grey, 1.8), lines(74, 84, 28, 2, 8, C.ink, 1.6)),
  /** röstkommando: a person calls out a short command and a lamp switches on. */
  'genai.röstkommando': all(ground,
    bust(24, 70, C.green, 1.6, 'talk'),
    bub(36, 24, 30, 22, C.white, 'l', all(waves(42, 35, 2, BLUE, 5), num('!', 58, 40, 13, HL))),
    arrow(68, 34, 80, 40, HL, 2.4),
    line('M92 20 L92 36', C.ink, 1.4), path('M82 50 C82 36 102 36 102 50 C102 56 98 58 98 62 L86 62 C86 58 82 56 82 50 Z', C.yellow, C.ink, 1.4), rect(87, 62, 10, 6, C.grey, 1, C.ink, 1),
    ...[0, 1, 2, 3, 4].map((i) => { const a = Math.PI * (0.9 + i * 0.3); return line(`M${f1(92 + Math.cos(a) * 16)} ${f1(50 + Math.sin(a) * 16)} L${f1(92 + Math.cos(a) * 22)} ${f1(50 + Math.sin(a) * 22)}`, C.gold, 2); }),
    rect(80, 100, 24, 8, '#a0673d', 2, C.ink, 1), line('M92 68 L92 100', C.ink, 1.6),
    ring(51, 36, 20, 16)),
  /** diktera: a person talks into a phone and a letter on the right is written line by line. */
  'genai.diktera': all(ground,
    bust(24, 66, BLUE, 1.6, 'talk', { long: true }),
    line('M34 92 L44 74', C.skin, 6), line('M34 92 L44 74', C.ink, 0.7), rect(40, 58, 10, 18, C.dark, 2, C.ink, 1.2), rect(41.5, 60, 7, 13, SCREEN, 1, null),
    waves(36, 52, 2, BLUE, 4),
    rect(66, 14, 46, 84, PAPER, 2, C.ink, 1.4), path('M72 20 L84 20 L84 28 L72 28 Z M72 20 L78 25 L84 20', 'none', C.ink, 1),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => appear(`genai-diktera-${i}`, i * 0.35, line(`M72 ${38 + i * 8} L${[104, 100, 106, 96, 104, 90, 98][i]} ${38 + i * 8}`, C.ink, 1.6))),
    arrow(54, 60, 64, 54, HL, 2.2), ring(40, 58, 16, 20)),
  /** läsa upp: a phone with text sends sound waves to a listening person. */
  'genai.läsa-upp': all(ground,
    phone(34, 62, 1.5, lines(-9, -14, 18, 6, 5, C.ink, 1.2)),
    waIn('genai-lasaupp-1', -14, 0, waves(64, 56, 3, BLUE, 7)),
    bust(98, 64, C.orange, 1.5, 'smile'), ellipse(87, 64, 2.4, 4, C.skin, C.ink, 1),
    ring(72, 56, 16, 20)),
  /** ljudfil: a file icon with a sound wave and a note, and a play button. */
  'genai.ljudfil': all(ground,
    at(54, 56, 3, path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', PAPER, C.ink, 0.6), path('M4 -13 L4 -7 L10 -7', '#dde3ea', C.ink, 0.5), rect(-10, 9, 20, 4, AI, 0, null), path('M-10 -13 L4 -13 L10 -7 L10 13 L-10 13 Z', 'none', C.ink, 0.6)),
    wave(32, 54, 44, BLUE, 9, 2.2), path('M44 32 L44 22 L54 20 L54 30', 'none', C.ink, 1.8), ellipse(42, 32, 2.6, 2, C.ink, null), ellipse(52, 30, 2.6, 2, C.ink, null),
    circle(96, 94, 11, GREEN, C.ink, 1.4), path('M92 88 L102 94 L92 100 Z', C.white, null),
    ring(54, 56, 36, 44)),
  /** brytning: a person speaks Swedish (flag in the bubble) with a touch of another language (a red sun on it). */
  'genai.brytning.2': all(ground,
    bust(26, 78, C.purple, 1.6, 'talk'),
    bub(40, 14, 72, 48, C.white, 'l', all(flagSE(50, 22, 40), circle(84, 40, 8, '#d62f2a', null), wave(50, 52, 54, BLUE, 4, 1.8), circle(66, 52, 2.4, '#d62f2a', null), circle(90, 52, 2.4, '#d62f2a', null))),
    ring(76, 38, 40, 28)),

  // ── 3866 Hallucinationer och faktakontroll ───────────────────────
  /** hallucination: the AI answers confidently with a book that flickers like a ghost; the shelf has an empty place. */
  'genai.hallucination.2': all(ground,
    avatar(14, 30, 8), bub(24, 12, 50, 40, AI2, 'l', all(ok(66, 18, 6))),
    waPulse('genai-halluc-1', DASH(rect(40, 18, 18, 26, 'rgba(255,255,255,0.7)', 2, C.ink, 1.4)), lines(45, 24, 9, 3, 5, C.grey, 1.2)),
    ring(49, 31, 16, 18),
    rect(40, 72, 74, 32, '#a0673d', 2, C.ink, 1.4), rect(44, 76, 66, 24, '#7d4f2c', 1, null),
    book(52, 88, BLUE), book(68, 88, GREEN), DASH(rect(77, 77, 16, 22, 'none', 1, C.white, 1.2)), book(102, 88, C.orange),
    magnifier(84, 60, 1), no(26, 92, 8)),
  /** hitta på: a person says something and the bubble fills with a dashed, made-up story (a bus, a clock) from nothing. */
  'genai.hitta-på.2': all(ground,
    bust(26, 80, C.orange, 1.6, 'sly'),
    path('M44 10 L112 10 C116 10 116 14 116 16 L116 56 C116 60 112 62 108 62 L60 62 L46 74 L50 62 C44 62 40 60 40 56 L40 16 C40 12 42 10 44 10 Z', C.white, C.ink, 1.5),
    waIn('genai-hittapa-1', -30, 30, DASH(bus(66, 38, 1.3, true))), waIn('genai-hittapa-2', -40, 40, DASH(clock(100, 32, 9, 40, true))),
    moving('genai-hittapa-3', '0%,30%{opacity:0}60%,100%{opacity:1}', { dur: 2.6 }, spark(50, 18, 4, C.yellow), spark(108, 54, 4, C.yellow)),
    frame(36, 6, 82, 60)),
  /** faktakontroll: a magnifier goes over a text; each line gets a tick against a book, one line gets a cross. */
  'genai.faktakontroll': all(ground,
    rect(8, 12, 56, 92, PAPER, 2, C.ink, 1.4),
    ...[0, 1, 2, 3, 4].map((i) => all(lines(14, 26 + i * 16, 34, 1, 4, C.ink, 1.6), i === 2 ? no(56, 26 + i * 16, 5) : ok(56, 26 + i * 16, 5))),
    magnifier(48, 56, 1.6), ring(50, 58, 22),
    book(94, 50, BLUE, 1.8), arrow(78, 50, 70, 54, C.grey, 2), arrow(70, 66, 78, 62, C.grey, 2)),
  /** originalkälla: copies of copies point back to the first document, which has a seal and is ringed. */
  'genai.originalkälla': all(ground,
    rect(8, 28, 34, 46, PAPER, 2, C.ink, 1.6), lines(13, 38, 24, 4, 6, C.ink, 1.5), circle(32, 66, 6, C.gold, C.ink, 1.2), spark(32, 66, 4, C.white),
    ring(25, 51, 22, 30),
    arrow(58, 51, 46, 51, HL, 2.4), `<g opacity="0.7">${all(rect(60, 32, 26, 38, PAPER, 2, C.ink, 1.2), lines(64, 40, 18, 4, 6, C.grey, 1.3))}</g>`,
    arrow(98, 51, 90, 51, C.grey, 2), greyed(rect(98, 36, 18, 30, PAPER, 2, C.ink, 1), lines(101, 42, 12, 4, 5, C.grey, 1)),
    rect(8, 86, 104, 18, '#eef1f4', 3, null), num('1', 25, 99, 10, HL), num('2', 73, 99, 10, C.grey), num('3', 107, 99, 10, C.grey)),

  // ── 3867 AI-säkerhet och begränsningar ───────────────────────────
  /** missbruka: a hooded person uses an AI phone to send red fake messages to two people. */
  'genai.missbruka': all(ground,
    bust(24, 64, '#3d3f4a', 1.7, 'sly', { hood: true }),
    phone(46, 86, 0.8, chip(0, -4, 0.7)),
    ...[[0, 78, 30], [1, 88, 64]].map(([i, x, y]) => waIn(`genai-missbruka-${i}`, -30, 20, all(rect(x! - 9, y! - 6, 18, 12, '#ffd6d6', 1, RED, 1.4), path(`M${x! - 9} ${y! - 6} L${x} ${y! + 1} L${x! + 9} ${y! - 6}`, 'none', RED, 1.2)))),
    greyed(bust(104, 26, C.green, 1), bust(104, 74, C.orange, 1)),
    ring(32, 70, 28, 34), warn(62, 18, 1)),
  /** spärr: a question with a warning sign is stopped by a striped barrier before it reaches the AI. */
  'genai.spärr.3': all(ground,
    bub(6, 22, 40, 24, UB, 'r', warn(26, 33, 1, '#f08a3a')),
    arrow(48, 34, 60, 34, C.grey, 2.4),
    rect(66, 18, 6, 90, STEEL, 2, C.ink, 1.3), rect(60, 104, 18, 6, STEEL, 1, C.ink, 1),
    g('translate(69 30)', rect(-16, -5, 32, 10, C.white, 2, C.ink, 1.3), rect(-10, -5, 6, 10, RED, 0, null), rect(2, -5, 6, 10, RED, 0, null), rect(-16, -5, 32, 10, 'none', 2, C.ink, 1.3)),
    avatar(100, 34, 10), ring(69, 34, 22, 14)),
  /** kringgå: a figure goes round a rule paper along a curved path; the straight way into it is grey with a cross. */
  'genai.kringgå.2': all(ground,
    rect(48, 46, 26, 50, PAPER, 2, C.ink, 1.5), lines(53, 56, 16, 5, 6, C.ink, 1.3), circle(61, 88, 5, RED, C.ink, 1), spark(61, 88, 3, C.white),
    greyed(arrow(12, 80, 42, 80, C.ink, 2.4)), no(40, 66, 6),
    line('M14 96 C14 24 104 18 104 90', HL, 2.4, '4 3'),
    moving('genai-kringga-1', '0%{transform:translate(-90px,4px)}25%{transform:translate(-80px,-50px)}50%{transform:translate(-45px,-68px)}75%{transform:translate(-12px,-50px)}100%{transform:translate(0,0)}', { dur: 3.4 }, miniFig(104, 92, C.green, 1.1)),
    frame(8, 30, 104, 78)),
  /** känslig: a folder with health, money and key signs and a warning triangle – to be handled with care. */
  'genai.känslig.3': all(ground,
    path('M14 30 L44 30 L50 38 L106 38 L106 100 L14 100 Z', '#f2c14e', C.ink, 1.5), rect(14, 44, 92, 56, '#f7d77a', 2, C.ink, 1.3),
    circle(34, 70, 11, C.white, C.ink, 1), path('M25 70 L30 70 L32 64 L36 76 L38 70 L43 70', 'none', RED, 1.5),
    coin(60, 70, 9), g('translate(84 70) rotate(-30)', circle(-6, 0, 5, C.gold, C.ink, 1.2), rect(-1, -1.6, 14, 3.2, C.gold, 1, C.ink, 1), rect(8, 1, 2, 3, C.gold, 0, C.ink, 0.8)),
    warn(94, 22, 1.5, '#f08a3a'), frame(10, 26, 100, 78)),
  /** transparens: a glass box shows its gears and data inside; a closed dark box with a question mark is grey. */
  'genai.transparens': all(ground,
    rect(12, 30, 60, 60, 'rgba(190,225,250,0.45)', 4, C.ink, 1.6), line('M18 36 L30 36 M18 40 L24 40', C.white, 2),
    ...[[32, 52, 9, C.grey], [50, 66, 7, C.orange]].map(([x, y, r, col]) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(Number(x) + Math.cos(a) * Number(r) * 0.7)} ${f1(Number(y) + Math.sin(a) * Number(r) * 0.7)} L${f1(Number(x) + Math.cos(a) * Number(r) * 1.15)} ${f1(Number(y) + Math.sin(a) * Number(r) * 1.15)}`, String(col), Number(r) * 0.45); }), circle(Number(x), Number(y), Number(r) * 0.8, String(col), C.ink, 1))),
    ...[0, 1, 2, 3].map((i) => circle(24 + i * 12, 80, 2.4, [BLUE, GREEN, AI, RED][i]!, null)),
    ellipse(42, 14, 12, 7, C.white, C.ink, 1.4), circle(42, 14, 4, BLUE, null), circle(42, 14, 1.6, C.ink, null), line('M42 22 L42 28', C.grey, 1.4, '2 2'),
    frame(8, 26, 68, 68),
    greyed(rect(84, 54, 30, 36, C.dark, 3, C.ink, 1.4), num('?', 99, 78, 16, C.white))),
  /** mänsklig kontroll: a robot arm works while a person keeps a hand on a big stop button wired to it. */
  'genai.mänsklig-kontroll': all(ground,
    robotArm(28, 66, 1.1), chip(12, 26, 0.7),
    dashed('M44 104 C60 112 70 100 76 92', C.grey),
    rect(72, 80, 34, 24, '#eef1f4', 3, C.ink, 1.3), circle(84, 88, 6, RED, C.ink, 1.3), circle(98, 90, 4, GREEN, C.ink, 1.1),
    bust(96, 46, BLUE, 1.6, 'calm'),
    line('M86 70 L84 84', C.skin, 6), line('M86 70 L84 84', C.ink, 0.7),
    ring(92, 70, 24, 38)),
};
