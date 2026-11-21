/**
 * Teknik & digital värld → Programmering & artificiell intelligens → Webbutveckling, 3821–3827 (0.56): HTML elements,
 * CSS and layout, JavaScript in the browser, responsive design, forms and validation, web accessibility, frontend and
 * backend. The words are the Swedish vocabulary of a web course and an IT workplace, not programming itself.
 * Recurring signs: code is a dark editor window with three dots on top and coloured bars as code; HTML is drawn with the
 * signs < / > (orange), scripts with { } ( ) (purple); a web page is a white browser window with a grey strip on top,
 * a blue header band and grey text bars; the part the word names is ringed or framed in orange, and grey copies show
 * what the word is not.
 * Close words share one layout where only the marked part differs: tagg/element/attribut (the same code line; one tag,
 * the whole line with its page block, or the name="value" part); sidhuvud/sidfot (the same page; the top band or the
 * bottom band); statisk/dynamisk (three copies of a page over a day; = and the same content, or ≠ and new content);
 * stående läge/liggande läge (the phone upright or on its side, the other way grey); kryssruta/alternativknapp
 * (square boxes with ticks, several chosen, or round buttons with one dot); frontend/backend (the same browser–server
 * diagram; the browser side or the server side ringed).
 * Code signs (< / > { } ( ) = * #), digits and ✓ ✗ only; no words, no brands, no logos and no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, waGrow, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, arm } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const BG = '#eef3f7';
const SCR = '#fbfbf8';
const BLUE = '#3a6ab0';
const LINK = '#2f6fd6';
const GREEN = '#3a9a5a';
const RED = '#e2553a';
const YEL = '#f2c14e';
const BAR = '#c3cad2';
const CODEBG = '#2f3440';
const TAGC = '#f39a4a';
const PURP = '#b48ae8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = BG) => rect(4, 4, 112, 108, col, 4, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, r = 5) => rect(x, y, w, h, 'none', r, HL, 2.6);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
/** Code signs and digits as text (escape < as &lt;). */
const T = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800) => `<text x="${x}" y="${y}" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
/** Text drawn as grey bars. */
const bars = (x: number, y: number, w: number, n: number, gap = 5, col: string = BAR, sw = 1.8) => all(...range(n).map((i) => line(`M${x} ${y + i * gap} L${f1(x + w - ((i * 7) % 4) * w * 0.08 - (i === n - 1 ? w * 0.3 : 0))} ${y + i * gap}`, col, sw)));
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const desk = (y = 84, x1 = 8, x2 = 112) => all(rect(x1, y, x2 - x1, 5, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 5} L${x1 + 8} 112 M${x2 - 8} ${y + 5} L${x2 - 8} 112`, C.brown, 3));

// ── Icons ────────────────────────────────────────────────────────────
const cursor = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L0 16 L4 12 L7 19 L10 18 L7 11 L12 11 Z', C.white, C.ink, 1.4));
const ibeam = (x: number, y: number, h = 10, col: string = C.ink) => line(`M${x} ${y} L${x} ${y + h} M${x - 2} ${y} L${x + 2} ${y} M${x - 2} ${y + h} L${x + 2} ${y + h}`, col, 1.3);
const pic = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#bfe3f5', 1, C.ink, 0.9), path(`M${x} ${y + h} L${f1(x + w * 0.35)} ${f1(y + h * 0.4)} L${f1(x + w * 0.55)} ${f1(y + h * 0.7)} L${f1(x + w * 0.75)} ${f1(y + h * 0.5)} L${x + w} ${y + h} Z`, '#6fae5a', null), circle(f1(x + w * 0.78), f1(y + h * 0.28), f1(Math.min(w, h) * 0.12), YEL, null), rect(x, y, w, h, 'none', 1, C.ink, 0.9));
const play = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.dark, 2, C.ink, 1.2), circle(f1(x + w / 2), f1(y + h / 2), f1(h * 0.28), 'rgba(255,255,255,0.25)', null), path(`M${f1(x + w / 2 - h * 0.1)} ${f1(y + h / 2 - h * 0.15)} L${f1(x + w / 2 + h * 0.16)} ${f1(y + h / 2)} L${f1(x + w / 2 - h * 0.1)} ${f1(y + h / 2 + h * 0.15)} Z`, C.white, null));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...range(8).map((i) => { const a = (i * Math.PI) / 4; return line(`M${f1(x + r * 0.8 * Math.cos(a))} ${f1(y + r * 0.8 * Math.sin(a))} L${f1(x + r * 1.25 * Math.cos(a))} ${f1(y + r * 1.25 * Math.sin(a))}`, col, r * 0.45); }), circle(x, y, r, col, C.ink, 1), circle(x, y, f1(r * 0.4), C.white, C.ink, 0.8));
const clock = (x: number, y: number, r: number, hr: number) => { const a = (hr / 12) * Math.PI * 2 - Math.PI / 2; return all(circle(x, y, r, C.white, C.ink, 1.2), line(`M${x} ${y} L${f1(x + r * 0.55 * Math.cos(a))} ${f1(y + r * 0.55 * Math.sin(a))} M${x} ${y} L${x} ${f1(y - r * 0.75)}`, C.ink, 1.2)); };
const puzzle = (x: number, y: number, s: number, col: string = '#7a8cf0') => at(x, y, s, path('M-8 -8 L-2 -8 C-3 -13 3 -13 2 -8 L8 -8 L8 -2 C13 -3 13 3 8 2 L8 8 L-8 8 Z', col, C.ink, 1.3));
const speaker = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -3 L-2 -3 L3 -8 L3 8 L-2 3 L-6 3 Z', C.dark, C.ink, 1), line('M6 -5 C9 -2 9 2 6 5 M9 -8 C14 -3 14 3 9 8', C.dark, 1.4));
const access = (x: number, y: number, r: number, col: string = BLUE) => all(circle(x, y, r, col, C.ink, 1.2), circle(x, f1(y - r * 0.5), f1(r * 0.16), C.white, null), line(`M${f1(x - r * 0.55)} ${f1(y - r * 0.2)} L${f1(x + r * 0.55)} ${f1(y - r * 0.2)} M${x} ${f1(y - r * 0.2)} L${x} ${f1(y + r * 0.2)} L${f1(x - r * 0.3)} ${f1(y + r * 0.62)} M${x} ${f1(y + r * 0.2)} L${f1(x + r * 0.3)} ${f1(y + r * 0.62)}`, C.white, f1(r * 0.14)));
const stars = (x: number, y: number, n: number, r = 3.2, fill: string = YEL) => all(...range(n).map((i) => { const cx = x + i * r * 2.4, p: string[] = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; p.push(`${f1(cx + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`); } return path(`M${p.join(' L')} Z`, fill, C.ink, 0.7); }));

// ── Devices and windows ──────────────────────────────────────────────
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCR, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', '#9aa3ad', C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '', col: string = C.dark) => at(x, y, s, rect(-14, -24, 28, 48, col, 4, C.ink, 1.6), rect(-11.5, -19, 23, 37, SCR, 1.4, null), inner);
/** Phone on its side (landscape), centred at (x, y). */
const phoneL = (x: number, y: number, s = 1, inner: Svg = '', col: string = C.dark) => at(x, y, s, rect(-24, -14, 48, 28, col, 4, C.ink, 1.6), rect(-19, -11.5, 37, 23, SCR, 1.4, null), inner);
const tablet = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-20, -27, 40, 54, C.dark, 4, C.ink, 1.6), rect(-17, -23, 34, 46, SCR, 1.4, null), inner);
/** Browser window: grey strip with three dots, white page. */
const win = (x: number, y: number, w: number, h: number, inner: Svg = '', strip = '#dde2e8') => all(rect(x, y, w, h, SCR, 3, C.ink, 1.5), path(`M${x + 1} ${y + 8} L${x + 1} ${y + 3} Q${x + 1} ${y + 1} ${x + 3} ${y + 1} L${x + w - 3} ${y + 1} Q${x + w - 1} ${y + 1} ${x + w - 1} ${y + 3} L${x + w - 1} ${y + 8} Z`, strip, null), line(`M${x} ${y + 8} L${x + w} ${y + 8}`, C.grey2, 0.9), circle(x + 5, y + 4.5, 1.4, '#e8776a', null), circle(x + 9.5, y + 4.5, 1.4, YEL, null), circle(x + 14, y + 4.5, 1.4, '#6cc07a', null), inner, rect(x, y, w, h, 'none', 3, C.ink, 1.5));
/** Dark code editor: three dots on top and code rows below. */
const code = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, CODEBG, 3, C.ink, 1.5), circle(x + 5, y + 5, 1.4, '#e8776a', null), circle(x + 9.5, y + 5, 1.4, YEL, null), circle(x + 14, y + 5, 1.4, '#6cc07a', null), inner);
const cbar = (x: number, y: number, w: number, col: string = '#8fa0b4', sw = 2) => line(`M${x} ${y} L${x + w} ${y}`, col, sw);
/** HTML tag chip "<▪>" or "</▪>" with its left edge at x and baseline y. Returns [svg, width]. */
const tag = (x: number, y: number, size = 9, col: string = TAGC, close = false): Svg => {
  const cw = size * 0.6;
  const out: Svg[] = [T(f1(x + cw / 2), y, '&lt;', size, col)];
  let cx = x + cw;
  if (close) { out.push(T(f1(cx + cw / 2), y, '/', size, col)); cx += cw; }
  out.push(rect(f1(cx + 0.6), f1(y - size * 0.62), f1(cw * 0.9), f1(size * 0.55), col, 0.8, null));
  cx += cw * 1.1;
  out.push(T(f1(cx + cw / 2), y, '&gt;', size, col));
  return all(...out);
};
const tagW = (size = 9, close = false) => size * 0.6 * (close ? 3.1 : 2.1);
/** One code line: <▪> grey bars </▪>, left at x, baseline y. */
const codeLine = (x: number, y: number, w: number, size = 9, col: string = TAGC) => all(tag(x, y, size, col), cbar(f1(x + tagW(size) + 2), f1(y - size * 0.32), f1(w - tagW(size) - tagW(size, true) - 4), '#d7dde4', size * 0.22), tag(f1(x + w - tagW(size, true)), y, size, col, true));

/** A web page body: blue header band, picture, text bars, grey footer band. */
const pageBody = (x: number, y: number, w: number, h: number, o: { head?: string; foot?: string; content?: Svg } = {}) => all(
  rect(x, y, w, f1(h * 0.16), o.head ?? BLUE, 1, null), line(`M${x + 4} ${f1(y + h * 0.08)} L${f1(x + w * 0.3)} ${f1(y + h * 0.08)}`, C.white, 1.6),
  ...range(3).map((i) => rect(f1(x + w - 6 - i * 7), f1(y + h * 0.07), 5, 1.6, C.white, 0.8, null)),
  o.content ?? all(pic(x + 4, f1(y + h * 0.22), f1(w * 0.36), f1(h * 0.3)), bars(f1(x + 8 + w * 0.36), f1(y + h * 0.26), f1(w * 0.55 - 10), 3, 5), bars(x + 4, f1(y + h * 0.6), w - 8, 2, 5)),
  rect(x, f1(y + h * 0.84), w, f1(h * 0.16), o.foot ?? '#8e99a6', 1, null), line(`M${x + 4} ${f1(y + h * 0.92)} L${f1(x + w * 0.35)} ${f1(y + h * 0.92)}`, C.white, 1.3));
/** Server rack. */
const rack = (x: number, y: number, s = 1, col: string = '#4a5260') => at(x, y, s, rect(-12, -26, 24, 52, col, 2, C.ink, 1.6), ...range(4).map((i) => all(rect(-9, -22 + i * 12, 18, 9, '#6a7384', 1, C.ink, 0.8), circle(-5, -17.5 + i * 12, 1.2, '#7ee07e', null), line(`M0 ${-17.5 + i * 12} L6 ${-17.5 + i * 12}`, '#9aa3ad', 1))));
const dbase = (x: number, y: number, s = 1, col: string = '#d9b45a') => at(x, y, s, path('M-10 -10 L-10 10 C-10 15 10 15 10 10 L10 -10', col, C.ink, 1.4), ellipse(0, -10, 10, 4, col, C.ink, 1.4), path('M-10 0 C-10 5 10 5 10 0', 'none', C.ink, 1));
/** A form field (white box). */
const field = (x: number, y: number, w: number, h = 9, stroke: string = C.grey2, sw = 1) => rect(x, y, w, h, C.white, 2, stroke, sw);
const checkbox = (x: number, y: number, s: number, on: boolean, col: string = BLUE) => all(rect(x, y, s, s, on ? col : C.white, 1.5, C.ink, 1.2), on ? path(`M${f1(x + s * 0.2)} ${f1(y + s * 0.52)} L${f1(x + s * 0.42)} ${f1(y + s * 0.75)} L${f1(x + s * 0.82)} ${f1(y + s * 0.25)}`, 'none', C.white, s * 0.16) : '');
const radio = (x: number, y: number, r: number, on: boolean, col: string = BLUE) => all(circle(x, y, r, C.white, C.ink, 1.2), on ? circle(x, y, f1(r * 0.55), col, null) : '');
/** Hand holding a device from below (palm + thumb). */
const holdHand = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 C-14 10 -8 18 0 18 C8 18 14 10 12 0 Z', C.skin, C.ink, 1.4), path('M10 2 C14 -2 16 -8 13 -10 C10 -10 8 -4 6 0', C.skin, C.ink, 1.3));
/** Three-day strip of pages for statisk / dynamisk. */
const dayPage = (x: number, y: number, inner: Svg) => all(win(x, y, 30, 40, all(rect(x + 2, y + 10, 26, 5, BLUE, 1, null), inner)));

export const WEBDEV_MOTIFS: Record<string, Svg> = {
  // ── 3821 HTML-element ──────────────────────────────────────────────
  /** webbutvecklare: a person at a desk with a laptop showing code signs </> and a monitor beside it showing a web page; the person is ringed. */
  'webdev.webbutvecklare': all(bg(), ground, person(34, C.orange, { h: 0.9 }), desk(80, 8, 112),
    laptop(54, 78, 0.55, all(rect(-26, -36, 52, 32, CODEBG, 1, null), T(-6, -14, '&lt;/&gt;', 12, TAGC), cbar(-20, -8, 22, '#8fa0b4', 2), cbar(-20, -26, 14, PURP, 2))),
    reach(34, 0.9, 1, 46, 76), rect(78, 38, 34, 28, C.dark, 2, C.ink, 1.6), rect(80, 40, 30, 24, SCR, 1, null), pageBody(80, 40, 30, 24), rect(92, 66, 6, 8, '#9aa3ad', 1, C.ink, 1), rect(86, 74, 18, 3, '#9aa3ad', 1, C.ink, 1),
    oval(34, 70, 17, 40)),
  /** märkspråk: a code window where every grey line is wrapped in orange tags, an arrow, and the page that the browser shows from it (a big heading, a bullet list and a blue link); the code is ringed. */
  'webdev.märkspråk': all(bg(), code(8, 18, 54, 70, all(codeLine(12, 34, 46, 8), codeLine(12, 47, 40, 8), codeLine(16, 60, 38, 8), codeLine(16, 73, 34, 8))),
    arr(64, 54, 74, 54, C.dark, 2.4),
    win(76, 26, 38, 58, all(line('M80 40 L104 40', C.ink, 3.2), ...range(3).map((i) => all(circle(82, 50 + i * 7, 1.4, C.ink, null), line(`M86 ${50 + i * 7} L${104 - i * 3} ${50 + i * 7}`, BAR, 1.8))), line('M80 76 L100 76', LINK, 1.8), line('M80 78 L100 78', LINK, 0.8))),
    frame(4, 14, 62, 78, 6)),
  /** tagg (i kod): one big code line: an orange opening tag < ▪ >, grey text, and an orange closing tag with a slash; only the opening tag is ringed. */
  'webdev.tagg.2': all(bg(), code(8, 34, 104, 52, all(tag(14, 66, 16), cbar(48, 61, 26, '#d7dde4', 3.4), tag(78, 66, 16, TAGC, true))),
    oval(29, 61, 19, 14)),
  /** element (på en webbsida): a small code line <▪> text </▪> above, with the whole line from the first < to the last > framed; a dashed line leads to the heading block on the page below, which is framed too. */
  'webdev.element.5': all(bg(), code(8, 10, 104, 34, all(codeLine(14, 34, 92, 11))),
    frame(11, 20, 98, 20, 5),
    win(28, 56, 64, 52, all(rect(34, 70, 52, 9, '#fff1e4', 1, null), line('M38 74.5 L74 74.5', C.ink, 3), bars(34, 86, 52, 3, 5))),
    line('M60 42 L60 68', HL, 1.8, '3 3'), frame(32, 68, 56, 13, 3)),
  /** attribut (i kod): a tag with an extra part inside: < ▪ name = "value" >, where the name="value" part is ringed; beside it the picture that the value points to. */
  'webdev.attribut.3': all(bg(), code(6, 30, 108, 44, all(T(14, 58, '&lt;', 14, TAGC), rect(20, 48, 7, 7, TAGC, 1, null), cbar(33, 53, 16, '#8fd0f0', 3), T(55, 58, '=', 13, C.white), T(64, 58, '"', 13, '#9fe39f'), cbar(68, 53, 18, '#9fe39f', 3), T(90, 58, '"', 13, '#9fe39f'), T(102, 58, '&gt;', 14, TAGC))),
    oval(62, 52, 34, 12), carr(62, 76, 62, 86, 74, 92, C.dark, 1.6, '3 3'), pic(76, 82, 26, 20)),
  /** sidhuvud: a web page in a browser; the band at the very top with a name and three menu marks is coloured and framed; the rest of the page is grey. */
  'webdev.sidhuvud': all(bg(), win(10, 12, 100, 96, all(greyed(pageBody(14, 24, 92, 80)), rect(14, 24, 92, 14, '#2f7a5a', 1, null), line('M19 31 L44 31', C.white, 2.4), ...range(3).map((i) => rect(86 - i * 12, 30, 9, 2, C.white, 1, null)))),
    frame(11, 21, 98, 20, 4)),
  /** sidfot: the same page; now the band at the very bottom with grey address lines, a telephone and a map pin is coloured and framed; the rest is grey. */
  'webdev.sidfot': all(bg(), win(10, 12, 100, 96, all(greyed(pageBody(14, 24, 92, 80)), rect(14, 88, 92, 16, '#2f7a5a', 1, null), line('M19 94 L46 94 M19 99 L40 99', C.white, 1.6),
    path('M72 92 C72 90 74 90 75 92 L76 94 L74 95 C75 97 76 98 78 99 L79 97 L81 98 C83 99 83 101 81 101 C76 101 72 97 72 92 Z', C.white, null), path('M94 101 C90 96 90 93 94 92 C98 93 98 96 94 101 Z', C.white, null), circle(94, 94.5, 1.2, '#2f7a5a', null))),
    frame(11, 85, 98, 22, 4)),
  /** bädda in (på en webbsida): a small grey window of another site holds a film; the film moves along a dashed arrow into an empty frame on our own page, where it plays (the film is ringed). */
  'webdev.bädda-in.2': all(bg(), greyed(win(72, 8, 42, 34, play(78, 18, 30, 20))),
    win(8, 30, 82, 80, all(rect(12, 40, 74, 8, BLUE, 1, null), bars(14, 54, 68, 2, 5), rect(18, 66, 50, 32, 'none', 2, C.grey, 1))),
    carr(92, 42, 92, 62, 72, 76, HL, 2, '4 3'),
    waIn('webdev-baddain', 36, -40, play(18, 66, 50, 32)), oval(43, 82, 32, 22)),
  /** förhandsgranska: on the left the code window, on the right a browser window with an eye above it; the page in the browser builds up from the code (the page parts slide in). */
  'webdev.förhandsgranska': all(bg(), code(6, 30, 46, 64, all(codeLine(10, 46, 38, 7), codeLine(10, 58, 34, 7), codeLine(14, 70, 30, 7), codeLine(10, 82, 36, 7))),
    win(58, 30, 56, 64, waIn('webdev-forhand', -24, 0, pageBody(61, 40, 50, 50))),
    at(86, 18, 1, ellipse(0, 0, 13, 7, C.white, C.ink, 1.6), circle(0, 0, 4.4, '#5a8fd6', C.ink, 1), circle(0, 0, 1.8, C.ink, null)),
    line('M86 25 L86 30', HL, 1.6, '2 2'), frame(55, 8, 62, 90, 6)),

  // ── 3822 CSS och layout ────────────────────────────────────────────
  /** stilmall: one sheet with colour swatches (green, orange) and a short and a long bar; three arrows go from it to three small pages that all get the same green header and orange button; the sheet is ringed. */
  'webdev.stilmall': all(bg(), at(60, 32, 1, path('M-16 -22 L10 -22 L16 -16 L16 22 L-16 22 Z', C.white, C.ink, 1.6), path('M10 -22 L10 -16 L16 -16', 'none', C.ink, 1.2), rect(-11, -14, 9, 9, '#2f7a5a', 1.5, C.ink, 0.8), rect(2, -14, 9, 9, C.orange, 1.5, C.ink, 0.8), T(-6, 12, '{', 13, PURP), cbar(-1, 6, 10, '#8fa0b4', 2.2), T(10, 19, '}', 13, PURP)),
    ...[22, 60, 98].map((x) => all(arr(60, 56, x, 72, C.dark, 1.6), win(x - 15, 74, 30, 34, all(rect(x - 13, 83, 26, 5, '#2f7a5a', 1, null), bars(x - 11, 92, 22, 2, 4, BAR, 1.4), rect(x - 6, 100, 12, 4, C.orange, 2, null))))),
    oval(60, 32, 24, 28)),
  /** layout: a page drawn as a plan of grey boxes – a band on top, three columns, a band at the bottom – with dashed guide lines; a hand moves the middle column into place; the arrangement is framed. */
  'webdev.layout': all(bg(), rect(14, 12, 92, 96, C.white, 3, C.ink, 1.6), rect(20, 18, 80, 12, '#b9d3f0', 2, C.ink, 1),
    rect(20, 36, 24, 50, '#d6e6c6', 2, C.ink, 1), rect(76, 36, 24, 50, '#f3dcc0', 2, C.ink, 1),
    waIn('webdev-layout', 0, -18, rect(48, 36, 24, 50, '#e7d6f3', 2, C.ink, 1)),
    rect(20, 92, 80, 10, '#c9ced4', 2, C.ink, 1), line('M46 14 L46 106 M74 14 L74 106', HL, 1, '3 3'), frame(10, 8, 100, 104, 6)),
  /** färgkod (på datorn): a box with the code #339966 in it, a large green colour circle beside it and a pipette taking up that green; the code is ringed. */
  'webdev.färgkod.2': all(bg(), rect(10, 36, 70, 22, C.white, 4, C.ink, 1.6), T(45, 52, '#339966', 13, C.ink),
    circle(96, 47, 13, '#339966', C.ink, 1.6), at(92, 82, 1, g('rotate(40)', rect(-3, -18, 6, 22, '#dfe6ee', 2, C.ink, 1.2), rect(-4.5, -24, 9, 7, C.dark, 2, C.ink, 1), path('M-3 4 L0 12 L3 4 Z', '#339966', C.ink, 1))),
    line('M45 60 L45 72', C.grey, 1.2, '2 2'), rect(22, 74, 46, 18, '#339966', 3, C.ink, 1.2), oval(45, 47, 40, 16)),
  /** bakgrundsfärg: a paint bucket pours yellow over a page; the whole area behind the text and the picture turns yellow while the text bars stay; a grey white page beside it for comparison. */
  'webdev.bakgrundsfärg': all(bg(), greyed(win(8, 40, 34, 46, pageBody(10, 50, 30, 34, { head: '#bbb', foot: '#bbb' }))),
    win(48, 34, 64, 74, all(waIn('webdev-bakgrund', 0, -10, rect(49, 43, 62, 64, '#ffe08a', 1, null)), line('M54 52 L80 52', C.ink, 3), pic(54, 60, 22, 18), bars(80, 62, 26, 3, 5, '#8a8f96'), bars(54, 86, 50, 3, 5, '#8a8f96'))),
    at(92, 18, 1, g('rotate(30)', path('M-9 -8 L9 -8 L7 10 L-7 10 Z', '#e0b23c', C.ink, 1.4), path('M-8 -8 C-8 -16 8 -16 8 -8', 'none', C.ink, 1.4))), path('M86 28 C84 32 86 36 84 40', 'none', '#ffd24a', 3),
    frame(46, 41, 68, 69, 4)),
  /** teckenstorlek: three letters A of growing size on one line with a ruler showing their height, and an up/down arrow next to the biggest; the arrow and the big letter are ringed. */
  'webdev.teckenstorlek': all(bg(), line('M12 92 L108 92', C.grey2, 1.4), T(24, 92, 'A', 14, C.grey), T(48, 92, 'A', 28, C.grey), T(82, 92, 'A', 52, C.ink),
    arr(111, 70, 111, 46, HL, 2.2), arr(111, 70, 111, 90, HL, 2.2), line('M64 92 L64 50', C.grey2, 1, '2 2'), oval(88, 72, 26, 28)),
  /** centrera: a page with a dashed middle line; a heading block slides from the left edge to the middle, with two equal arrows on each side of it. */
  'webdev.centrera': all(bg(), win(10, 14, 100, 94, all(line('M60 24 L60 104', HL, 1.4, '4 3'), bars(18, 70, 84, 5, 6))),
    waIn('webdev-centrera', -34, 0, rect(36, 36, 48, 14, BLUE, 2, C.ink, 1.2), line('M42 43 L78 43', C.white, 2)),
    arr(26, 58, 14, 58, C.dark, 1.4), arr(26, 58, 36, 58, C.dark, 1.4), arr(94, 58, 84, 58, C.dark, 1.4), arr(94, 58, 106, 58, C.dark, 1.4), frame(32, 32, 56, 22, 4)),
  /** enhetlig: on top four buttons that are exactly alike (same green, same shape, same size) with a tick; below, a grey row of mixed buttons in different shapes and sizes with a cross; the top row is framed. */
  'webdev.enhetlig': all(bg(), ...range(4).map((i) => all(rect(12 + i * 24, 30, 20, 12, '#2f7a5a', 4, C.ink, 1.2), line(`M${16 + i * 24} 36 L${28 + i * 24} 36`, C.white, 1.6))), ok(104, 20, 6),
    greyed(rect(12, 74, 16, 12, '#2f7a5a', 1, C.ink, 1.2), circle(44, 80, 8, C.orange, C.ink, 1.2), rect(58, 70, 22, 20, LINK, 6, C.ink, 1.2), rect(86, 76, 22, 8, '#d64545', 2, C.ink, 1.2)), no(104, 64, 6),
    frame(8, 24, 104, 24, 5)),

  // ── 3823 JavaScript i webbläsaren ──────────────────────────────────
  /** skriptspråk: a code window with purple curly brackets and round brackets and a turning cog; an arrow leads to a page where a button makes a number count up; the code is ringed. */
  'webdev.skriptspråk': all(bg(), code(6, 16, 56, 76, all(T(16, 40, '{', 16, PURP), cbar(24, 36, 26, '#8fd0f0', 2.4), T(30, 56, '( )', 12, '#9fe39f'), cbar(16, 64, 30, '#8fa0b4', 2.4), T(16, 82, '}', 16, PURP), cbar(24, 78, 18, '#8fa0b4', 2.4))),
    waSpin('webdev-skript', 6, gear(50, 78, 6, '#e0b23c')),
    arr(64, 54, 72, 54, C.dark, 2.2),
    win(74, 30, 40, 50, all(rect(80, 62, 28, 10, GREEN, 4, C.ink, 1), T(94, 54, '3', 14, C.ink))), waPulse('webdev-skript-n', T(94, 54, '3', 14, HL)),
    frame(3, 12, 62, 84, 6)),
  /** händelse (i ett program): a mouse pointer clicks a button and a flash goes out; a signal runs along an arrow to a code block { } that lights up. */
  'webdev.händelse.3': all(bg(), win(6, 20, 60, 70, all(rect(16, 56, 40, 14, GREEN, 5, C.ink, 1.2), line('M24 63 L48 63', C.white, 1.8))),
    cursor(42, 64, 1), waPulse('webdev-handelse', ...range(6).map((i) => { const a = -Math.PI / 2 + (i - 2.5) * 0.45; return line(`M${f1(36 + 13 * Math.cos(a))} ${f1(56 + 13 * Math.sin(a))} L${f1(36 + 19 * Math.cos(a))} ${f1(56 + 19 * Math.sin(a))}`, HL, 2); })),
    arr(66, 60, 78, 60, HL, 2.4), waIn('webdev-handelse-2', -12, 0, circle(72, 60, 2.4, YEL, null)),
    code(80, 34, 34, 52, all(T(88, 56, '{', 14, PURP), cbar(92, 62, 14, '#8fd0f0', 2), T(106, 78, '}', 14, PURP))), waPulse('webdev-handelse-3', rect(80, 34, 34, 52, 'none', 3, YEL, 2.4)),
    ring(36, 62, 22)),
  /** popupfönster: a grey page in the background and, in front of it, a small window that pops up with a close cross in its corner; the small window is ringed. */
  'webdev.popupfönster': all(bg(), greyed(win(8, 12, 104, 96, pageBody(12, 22, 96, 82))),
    waGrow('webdev-popup', all(rect(30, 40, 60, 42, C.white, 4, C.ink, 1.8), rect(30, 40, 60, 10, '#dde2e8', 4, C.ink, 1.2), line('M83 42 L87 46 M87 42 L83 46', C.ink, 1.4), bars(36, 58, 48, 2, 5), rect(46, 70, 28, 7, GREEN, 3, C.ink, 1))),
    frame(26, 36, 68, 50, 6)),
  /** statisk: the same page three times with a clock showing morning, noon and evening under each; all three pages look exactly the same and = signs stand between them; framed. */
  'webdev.statisk': all(bg(), ...[6, 45, 84].map((x, i) => all(dayPage(x, 26, all(pic(x + 3, 42, 12, 10), bars(x + 17, 44, 10, 2, 4, BAR, 1.4), bars(x + 3, 56, 24, 1, 4, BAR, 1.4))), clock(x + 15, 82, 7, [8, 1, 5][i]!))),
    T(40, 50, '=', 12, HL), T(79, 50, '=', 12, HL), frame(4, 22, 112, 70, 6)),
  /** dynamisk (som ändras): the same three pages with the clocks, but each page shows new content (sun, cloud, rain; 3, 7, 12) and ≠ signs stand between them; the last page changes while you watch. */
  'webdev.dynamisk.2': all(bg(),
    dayPage(6, 26, all(circle(14, 46, 4, YEL, C.ink, 0.8), T(28, 50, '3', 10, C.ink), bars(9, 58, 24, 1, 4, BAR, 1.4))), clock(21, 82, 7, 8),
    dayPage(45, 26, all(path('M48 48 C46 48 46 44 49 44 C50 41 55 41 56 44 C59 44 59 48 57 48 Z', C.white, C.ink, 0.8), T(67, 50, '7', 10, C.ink), bars(48, 58, 24, 1, 4, BAR, 1.4))), clock(60, 82, 7, 1),
    dayPage(84, 26, waPulse('webdev-dynamisk', all(path('M87 46 C85 46 85 42 88 42 C89 39 94 39 95 42 C98 42 98 46 96 46 Z', '#9aa3ad', C.ink, 0.8), line('M89 48 L88 51 M93 48 L92 51', LINK, 1), T(106, 50, '12', 9, C.ink)))), clock(99, 82, 7, 5),
    T(40, 50, '≠', 12, HL), T(79, 50, '≠', 12, HL), frame(4, 22, 112, 70, 6)),
  /** laddningstid (webbsida): an empty page with a spinning loading circle and a progress bar that fills up, and a stopwatch beside it counting seconds; the stopwatch is ringed. */
  'webdev.laddningstid.2': all(bg(), win(6, 18, 72, 84, all(waSpin('webdev-laddning', 1.4, path('M42 46 A10 10 0 1 1 32 56', 'none', BLUE, 3.4)), rect(16, 78, 52, 7, C.white, 3.5, C.ink, 1), moving('webdev-laddning-bar', '0%{transform:scaleX(.05)}100%{transform:scaleX(1)}', { dur: 3 }, rect(16, 78, 40, 7, GREEN, 3.5, null)))),
    at(96, 58, 1, circle(0, 0, 14, C.white, C.ink, 1.8), rect(-3, -20, 6, 5, C.dark, 1, C.ink, 1), path('M0 0 L0 -14 A14 14 0 0 1 12 7 Z', '#ffd9b8', null), circle(0, 0, 14, 'none', C.ink, 1.8), line('M0 0 L9 -9', C.ink, 1.6)), T(96, 88, '5', 12, C.ink), ring(96, 62, 22)),
  /** tillägg (i webbläsaren): a browser window whose toolbar gets a new puzzle-piece icon; a puzzle piece flies in from a small box below and snaps into the toolbar, where it is ringed. */
  'webdev.tillägg.3': all(bg(), win(8, 16, 104, 78, all(rect(12, 28, 96, 10, '#eef1f4', 3, C.grey2, 0.8), line('M16 33 L60 33', BAR, 1.4), pageBody(12, 42, 96, 48))),
    waIn('webdev-tillagg', -20, 50, puzzle(98, 33, 0.55)), rect(60, 98, 30, 12, '#dfe6ee', 2, C.ink, 1.2), puzzle(68, 104, 0.4, '#b9c2f5'), puzzle(80, 104, 0.4, '#f5c2b9'), ring(98, 33, 9)),
  /** inaktivera: a settings card with a puzzle-piece feature and its switch; the switch knob slides from green (on) to grey (off), and the feature turns grey; the switch is ringed. */
  'webdev.inaktivera': all(bg(), rect(10, 30, 100, 56, C.white, 5, C.ink, 1.6), greyed(puzzle(28, 58, 0.9), bars(42, 54, 30, 2, 7, BAR, 2.2)),
    at(88, 58, 1.3, rect(-14, -7, 28, 14, GREEN, 7, null), moving('webdev-inaktivera-bg', '0%,30%{opacity:0}60%,100%{opacity:1}', { dur: 3 }, rect(-14, -7, 28, 14, '#b8bec6', 7, null)), rect(-14, -7, 28, 14, 'none', 7, C.ink, 1.4), moving('webdev-inaktivera', '0%,30%{transform:translate(14px,0)}60%,100%{transform:translate(0,0)}', { dur: 3 }, circle(-7, 0, 5.4, C.white, C.ink, 1.2))),
    ring(88, 58, 22)),

  // ── 3824 Responsiv design ──────────────────────────────────────────
  /** skärmstorlek: a phone, a tablet and a laptop side by side, each with an orange arrow across its screen from corner to corner and a number under it (6, 11, 15). */
  'webdev.skärmstorlek': all(bg(), ground, phone(18, 82, 0.72), tablet(48, 78, 0.78), laptop(90, 90, 0.62),
    arr(11, 70, 25, 94, HL, 1.8), arr(25, 94, 11, 70, HL, 1.8), arr(37, 63, 59, 95, HL, 1.8), arr(59, 95, 37, 63, HL, 1.8), arr(76, 68, 104, 86, HL, 1.8), arr(104, 86, 76, 68, HL, 1.8),
    T(18, 30, '6', 12, C.ink), T(48, 30, '11', 12, C.ink), T(90, 30, '15', 12, C.ink)),
  /** responsiv (webbsida): the same page on a laptop with three coloured columns and on a phone with the same three blocks stacked under each other; the blocks move from side by side to stacked; framed. */
  'webdev.responsiv.1': all(bg(), ground, laptop(42, 82, 0.95, all(rect(-24, -34, 48, 6, BLUE, 1, null), rect(-24, -26, 14, 20, '#9fd1a8', 1, null), rect(-7, -26, 14, 20, '#f3c28a', 1, null), rect(10, -26, 14, 20, '#c7b3e6', 1, null))),
    phone(96, 78, 1, all(rect(-11.5, -19, 23, 5, BLUE, 1, null), waIn('webdev-resp-1', -6, 6, rect(-9, -12, 18, 8, '#9fd1a8', 1, null)), waIn('webdev-resp-2', 6, -4, rect(-9, -2, 18, 8, '#f3c28a', 1, null)), waIn('webdev-resp-3', 14, -14, rect(-9, 8, 18, 8, '#c7b3e6', 1, null)))),
    carr(64, 30, 80, 20, 92, 46, C.dark, 1.6), frame(4, 14, 112, 92, 6)),
  /** brytpunkt (i responsiv design): a ruler for the screen width with one orange mark; to the left of the mark a narrow page with one column, to the right a wide page with three columns; the mark is ringed. */
  'webdev.brytpunkt.2': all(bg(), rect(8, 18, 104, 10, '#f7efd8', 2, C.ink, 1.2), ...range(14).map((i) => line(`M${12 + i * 7.5} 28 L${12 + i * 7.5} ${i % 2 ? 24 : 22}`, C.ink, 0.8)),
    line('M46 14 L46 108', HL, 2.4, '5 3'), ring(46, 23, 8),
    win(12, 40, 28, 62, all(rect(14, 50, 24, 4, BLUE, 1, null), rect(15, 57, 22, 12, '#9fd1a8', 1, null), rect(15, 72, 22, 12, '#f3c28a', 1, null), rect(15, 87, 22, 12, '#c7b3e6', 1, null))),
    win(52, 40, 60, 46, all(rect(54, 50, 56, 5, BLUE, 1, null), rect(56, 58, 16, 24, '#9fd1a8', 1, null), rect(74, 58, 16, 24, '#f3c28a', 1, null), rect(92, 58, 16, 24, '#c7b3e6', 1, null))),
    T(28, 36, '1', 8, C.dark), T(82, 36, '3', 8, C.dark)),
  /** stående läge: a hand holds a phone upright (taller than wide) with a page on it; the phone is ringed; a small grey phone on its side beside it. */
  'webdev.stående-läge': all(bg(), phone(52, 52, 1.5, all(rect(-11.5, -19, 23, 5, BLUE, 1, null), pic(-9, -11, 18, 12), line('M-9 6 L9 6 M-9 10 L9 10 M-9 14 L5 14', BAR, 1.4))), holdHand(52, 88, 1.3),
    greyed(phoneL(96, 98, 0.6)), oval(52, 54, 26, 42)),
  /** liggande läge: a hand holds a phone on its side (wider than tall) with a film on it; the phone is ringed; a small grey upright phone beside it. */
  'webdev.liggande-läge': all(bg(), phoneL(60, 54, 1.6, play(-19, -11.5, 37, 23)), holdHand(28, 72, 1), g('translate(120 0) scale(-1 1)', holdHand(28, 72, 1)),
    greyed(phone(104, 98, 0.45)), oval(60, 54, 44, 28)),
  /** hamburgermeny: a phone with a page; the button with three short lines in the top corner is ringed, and a menu panel slides out from the side. */
  'webdev.hamburgermeny': all(bg(), phone(60, 60, 1.9, all(rect(-11.5, -19, 23, 7, BLUE, 1, null), line('M5 -17.5 L9 -17.5 M5 -15.5 L9 -15.5 M5 -13.5 L9 -13.5', C.white, 1), bars(-9, -6, 18, 4, 4, BAR, 1.2),
    waIn('webdev-hamburger', 12, 0, rect(-1, -12, 12.5, 30, '#fff4e6', 0.6, C.ink, 0.5), line('M1 -8 L9 -8 M1 -3 L9 -3 M1 2 L9 2 M1 7 L9 7', '#c77a2a', 1)))),
    ring(73, 30, 9)),
  /** radbrytning: a block of text bars; at the end of the first line an orange bent arrow (return) shows the text jumping down to the start of the next line; the arrow is ringed. */
  'webdev.radbrytning': all(bg(), rect(12, 20, 96, 80, C.white, 3, C.ink, 1.4), line('M84 20 L84 100', C.grey2, 1, '3 3'),
    line('M20 36 L80 36', C.dark, 3), path('M92 32 L92 46 L26 46', 'none', HL, 2.4), head(20, 46, Math.PI, HL, 1), line('M30 52 L70 52', C.dark, 3), line('M20 68 L78 68 M20 80 L80 80 M20 92 L54 92', C.dark, 3), ring(90, 40, 10)),
  /** användarupplevelse: a smiling person with a phone, five yellow stars and a heart above; a grey frowning person beside, with a tangled line above the phone. */
  'webdev.användarupplevelse': all(bg(), ground, person(42, C.orange, { h: 0.82 }), reach(42, 0.82, 1, 56, 70), phone(58, 66, 0.4, all(rect(-11.5, -19, 23, 6, GREEN, 1, null), bars(-8, -6, 16, 3, 5, BAR, 1.4))), stars(22, 18, 5, 3.6), path('M62 32 C56 26 52 32 58 38 L62 42 L66 38 C72 32 68 26 62 32 Z', '#e85a6a', C.ink, 1),
    greyed(person(96, C.green, { h: 0.66, face: 'neutral' }), path('M88 48 C96 38 104 52 92 50 C84 48 100 40 104 48', 'none', C.ink, 1.4)), oval(44, 58, 30, 52)),

  // ── 3825 Formulär och validering ───────────────────────────────────
  /** inmatning: keys of a keyboard at the bottom; letters (dots) fly up from the keys into a white field with a text cursor, where they line up; the field is ringed. */
  'webdev.inmatning': all(bg(), rect(10, 78, 100, 30, '#cfd5dc', 4, C.ink, 1.4), ...range(3).flatMap((r) => range(9 - r).map((k) => rect(15 + r * 5 + k * 10.5, 82 + r * 8, 8, 6, C.white, 1.5, C.ink, 0.6))),
    field(14, 24, 92, 16, C.ink, 1.4), ...range(5).map((i) => line(`M${20 + i * 8} 32 L${25 + i * 8} 32`, C.ink, 3)), ibeam(66, 27, 10),
    waIn('webdev-inmatning', 4, 44, line('M60 32 L64 32', HL, 3)), arr(40, 74, 50, 48, C.dark, 1.4, '3 2'), oval(60, 32, 50, 14)),
  /** platshållartext: an empty field with light grey, thin text bars inside and the text cursor at the very start; it is ringed; below, a grey field filled with dark text for comparison. */
  'webdev.platshållartext': all(bg(), field(12, 30, 96, 18, C.ink, 1.4), line('M24 39 L80 39', '#d5dae0', 3.2), ibeam(18, 34, 10, C.ink),
    greyed(field(12, 74, 96, 18, C.ink, 1.4), line('M18 83 L70 83', C.ink, 3.2)), oval(60, 39, 54, 16)),
  /** asterisk: a form with three fields; next to the label of the first field stands a big red *, which is ringed; the other two fields have none. */
  'webdev.asterisk': all(bg(), rect(14, 12, 92, 96, C.white, 4, C.ink, 1.5), line('M22 26 L46 26', C.dark, 2.4), T(56, 34, '*', 26, '#d64545'), field(22, 32, 76, 10, C.grey, 1),
    line('M22 56 L44 56', C.dark, 2.4), field(22, 62, 76, 10, C.grey, 1), line('M22 84 L40 84', C.dark, 2.4), field(22, 90, 76, 10, C.grey, 1), ring(56, 25, 10)),
  /** kryssruta: three small square boxes with grey text bars after them; two of the squares are blue with a white tick, one is empty; the squares are framed. */
  'webdev.kryssruta': all(bg(), rect(12, 16, 96, 88, C.white, 4, C.ink, 1.4), ...[0, 1, 2].map((i) => all(checkbox(24, 30 + i * 24, 14, i !== 1), line(`M46 ${37 + i * 24} L${92 - i * 6} ${37 + i * 24}`, BAR, 3))),
    frame(19, 25, 24, 72, 4)),
  /** alternativknapp: three small round buttons in a column with grey text bars; only one of them has a blue dot in the middle; the round buttons are framed. */
  'webdev.alternativknapp': all(bg(), rect(12, 16, 96, 88, C.white, 4, C.ink, 1.4), ...[0, 1, 2].map((i) => all(radio(31, 37 + i * 24, 7, i === 1), line(`M46 ${37 + i * 24} L${92 - i * 6} ${37 + i * 24}`, BAR, 3))),
    frame(20, 26, 22, 70, 11)),
  /** rullgardinsmeny: a box with a grey choice and a small down arrow; a list with four choices drops down below it, one choice blue; the box with the arrow is ringed. */
  'webdev.rullgardinsmeny': all(bg(), field(20, 16, 80, 16, C.ink, 1.4), line('M28 24 L62 24', C.dark, 2.6), rect(84, 16, 16, 16, '#e6ebf0', 2, C.ink, 1.2), path('M87 21 L92 27 L97 21 Z', C.ink, null),
    moving('webdev-rullgardin', '0%{transform:scaleY(.05);opacity:.3}50%,100%{transform:scaleY(1);opacity:1}', { dur: 2.6 }, rect(20, 34, 80, 64, C.white, 2, C.ink, 1.2), ...range(4).map((i) => all(i === 2 ? rect(21, 35 + i * 16, 78, 15, '#cfe0f7', 0, null) : '', line(`M28 ${43 + i * 16} L${70 - i * 5} ${43 + i * 16}`, BAR, 2.4)))),
    ring(92, 24, 11)),
  /** validering (av uppgifter): a form with three filled fields; a magnifying glass moves over them, and behind each field a green tick or a red cross appears in turn (the third is wrong). */
  'webdev.validering.2': all(bg(), rect(10, 14, 100, 92, C.white, 4, C.ink, 1.4), ...[0, 1, 2].map((i) => all(field(18, 26 + i * 26, 64, 13, i === 2 ? RED : C.grey, i === 2 ? 1.6 : 1), line(`M23 ${32.5 + i * 26} L${60 - i * 6} ${32.5 + i * 26}`, C.dark, 2.2))),
    moving('webdev-valid-1', '0%,20%{opacity:0}35%,100%{opacity:1}', { dur: 3.4 }, ok(96, 32, 7)), moving('webdev-valid-2', '0%,45%{opacity:0}60%,100%{opacity:1}', { dur: 3.4 }, ok(96, 58, 7)), moving('webdev-valid-3', '0%,70%{opacity:0}85%,100%{opacity:1}', { dur: 3.4 }, no(96, 84, 7)),
    moving('webdev-valid-glas', '0%{transform:translate(0,0)}33%{transform:translate(0,26px)}66%,100%{transform:translate(0,52px)}', { dur: 3.4 }, circle(70, 30, 8, 'rgba(220,240,252,0.6)', C.ink, 1.8), line('M76 36 L82 42', C.ink, 2.6))),

  // ── 3826 Webbtillgänglighet ────────────────────────────────────────
  /** synnedsättning: a person with dark glasses walking with a long white cane with a red tip; beside them a blurred grey eye chart; the person is ringed. */
  'webdev.synnedsättning': all(bg(), ground, person(48, C.orange, { h: 0.95 }), circle(45.2, 28.3, 2.9, C.ink, null), circle(50.8, 28.3, 2.9, C.ink, null), line('M45 28 L51 28', C.ink, 1.2),
    line('M66 64 L88 110', C.white, 3.4), line('M66 64 L88 110', C.ink, 0.6), line('M85 104 L88 110', '#d64545', 3.6), reach(48, 0.95, 1, 66, 64),
    `<g opacity="0.5" style="filter:blur(1.4px)">${all(rect(92, 18, 20, 30, C.white, 1, C.ink, 1), T(102, 30, 'E', 10, C.ink), line('M95 37 L109 37 M97 43 L107 43', C.ink, 2))}</g>`,
    oval(52, 66, 24, 46)),
  /** skärmläsare: a laptop whose text lines are marked one after the other while sound waves come from a speaker on the screen; a person with headphones listens; the laptop is ringed. */
  'webdev.skärmläsare': all(bg(), ground, desk(84, 8, 112), laptop(78, 82, 0.8, all(bars(-22, -30, 30, 4, 6, BAR, 2.2), moving('webdev-lasare', '0%{transform:translate(0,0)}33%{transform:translate(0,6px)}66%,100%{transform:translate(0,12px)}', { dur: 3 }, rect(-24, -33, 34, 6, 'rgba(242,193,78,0.6)', 1, null)), speaker(18, -16, 0.9))),
    waPulse('webdev-lasare-v', path('M100 40 C106 46 106 54 100 60 M106 34 C116 44 116 56 106 66', 'none', HL, 1.8)),
    person(28, C.green, { h: 0.86 }), path('M18 42 C18 30 38 30 38 42', 'none', C.dark, 2.6), rect(15, 40, 6, 9, C.dark, 2, null), rect(35, 40, 6, 9, C.dark, 2, null),
    oval(78, 62, 34, 26)),
  /** alternativtext: a picture of a café table in the sun; from it a dashed line leads to a speech bubble with grey text bars, which a small speaker reads out; the bubble is ringed. */
  'webdev.alternativtext': all(bg(), pic(14, 12, 54, 40), rect(28, 38, 26, 3, C.brown, 1, null), line('M41 41 L41 52', C.brown, 2),
    line('M41 54 L41 64', C.dark, 1.4, '3 2'), path('M12 66 L108 66 L108 96 L50 96 L42 104 L42 96 L12 96 Z', C.white, C.ink, 1.6), bars(20, 76, 80, 3, 7, '#8a939e', 2.4), speaker(94, 24, 1.3),
    oval(60, 82, 52, 20)),
  /** navigera (på en webbplats): a page with a menu and three links; an orange focus frame jumps from one link to the next, while a Tab-like key with an arrow is pressed below. */
  'webdev.navigera.2': all(bg(), win(10, 10, 100, 70, all(rect(14, 22, 92, 10, BLUE, 1, null), ...range(3).map((i) => all(line(`M${22 + i * 30} 46 L${42 + i * 30} 46`, LINK, 2.2), rect(16 + i * 30, 56, 26, 16, '#e7edf3', 2, null))))),
    moving('webdev-navigera', '0%,25%{transform:translate(0,0)}35%,60%{transform:translate(30px,0)}70%,100%{transform:translate(60px,0)}', { dur: 3.6 }, rect(18, 40, 28, 12, 'none', 3, HL, 2.6)),
    rect(36, 86, 48, 20, '#dfe4ea', 4, C.ink, 1.6), arr(46, 96, 70, 96, C.dark, 2), line('M74 91 L74 101', C.dark, 2)),
  /** riktlinje: an open booklet with a list of points, each with a green tick, and a signpost-like arrow above showing the way; the booklet is framed. */
  'webdev.riktlinje': all(bg(), path('M14 36 L58 32 L58 104 L14 108 Z', C.white, C.ink, 1.6), path('M58 32 L106 36 L106 108 L58 104 Z', '#f7f7f2', C.ink, 1.6),
    ...range(4).map((i) => all(ok(24, 48 + i * 14, 4), line(`M32 ${48 + i * 14} L${52 - (i % 2) * 6} ${48 + i * 14}`, BAR, 2.2), ok(68, 48 + i * 14, 4), line(`M76 ${48 + i * 14} L${100 - (i % 3) * 5} ${48 + i * 14}`, BAR, 2.2))),
    path('M50 10 L86 10 L94 18 L86 26 L50 26 Z', '#2f7a5a', C.ink, 1.4), line('M56 18 L80 18', C.white, 2), frame(10, 28, 100, 84, 5)),
  /** tillgänglighetsredogörelse: a web page with a document opened on it: the round access symbol (a person with open arms) at the top and a list where most points have a green tick and one has a red cross; the document is framed. */
  'webdev.tillgänglighetsredogörelse': all(bg(), greyed(win(6, 8, 108, 100, pageBody(10, 18, 100, 86))),
    rect(24, 20, 72, 88, C.white, 3, C.ink, 1.6), access(60, 36, 10), ...range(4).map((i) => all(i === 2 ? no(36, 58 + i * 12, 4) : ok(36, 58 + i * 12, 4), line(`M44 ${58 + i * 12} L${84 - (i % 2) * 8} ${58 + i * 12}`, BAR, 2.2))),
    frame(20, 16, 80, 96, 5)),

  // ── 3827 Frontend och backend ──────────────────────────────────────
  /** prototyp: a paper sketch of a phone app (boxes with crosses for pictures, a button) beside a pencil and two sticky notes; the sketch is ringed. */
  'webdev.prototyp': all(bg(), desk(98, 6, 114), rect(28, 12, 44, 82, '#fbfaf3', 6, C.ink, 1.4), rect(34, 20, 32, 8, 'none', 1, C.grey, 1.2, ),
    rect(34, 32, 32, 22, 'none', 1, C.grey, 1.2), line('M34 32 L66 54 M66 32 L34 54', C.grey, 1), line('M34 60 L62 60 M34 66 L56 66', C.grey, 1.6), rect(40, 74, 20, 8, 'none', 3, C.grey, 1.2),
    g('rotate(-20 92 70)', rect(88, 46, 6, 40, YEL, 1, C.ink, 1.2), path('M88 86 L91 94 L94 86 Z', '#f1c7a1', C.ink, 1)), rect(80, 16, 18, 16, '#ffe78a', 1, C.ink, 1), rect(84, 30, 18, 16, '#b8e3f7', 1, C.ink, 1),
    line('M83 22 L94 22 M87 37 L98 37', C.grey, 1.2), oval(50, 53, 28, 46)),
  /** frontend: a diagram – on the left a browser window with buttons and a picture, on the right a grey server and a store; arrows go between them; the browser side is ringed. */
  'webdev.frontend': all(bg(), win(6, 26, 50, 60, all(rect(10, 38, 42, 6, BLUE, 1, null), pic(12, 48, 18, 14), rect(34, 50, 14, 6, GREEN, 3, null), rect(34, 60, 14, 6, C.orange, 3, null), bars(12, 70, 36, 2, 5))), cursor(40, 60, 0.7),
    arr(60, 46, 80, 46, C.dark, 1.8), arr(80, 64, 60, 64, C.dark, 1.8), greyed(rack(96, 56, 1), dbase(96, 98, 0.8)), oval(31, 56, 30, 38)),
  /** backend: the same diagram, but now the browser on the left is grey and the server with the store on the right is coloured and ringed. */
  'webdev.backend': all(bg(), greyed(win(6, 26, 50, 60, all(rect(10, 38, 42, 6, BLUE, 1, null), pic(12, 48, 18, 14), rect(34, 50, 14, 6, GREEN, 3, null), rect(34, 60, 14, 6, C.orange, 3, null), bars(12, 70, 36, 2, 5)))),
    arr(60, 46, 80, 46, C.dark, 1.8), arr(80, 64, 60, 64, C.dark, 1.8), rack(96, 56, 1), dbase(96, 98, 0.8), gear(108, 30, 5, '#e0b23c'), oval(97, 66, 19, 46)),
  /** förfrågan (till en server): a browser window on the left sends a small message with a question mark along an arrow to a server on the right (the message travels); the message is ringed. */
  'webdev.förfrågan.2': all(bg(), ground, win(6, 40, 40, 46, pageBody(9, 50, 34, 33)), rack(98, 84, 1),
    line('M48 62 L84 62', C.dark, 1.6, '4 3'), head(86, 62, 0, C.dark, 0.8),
    waIn('webdev-forfragan', -26, 0, rect(58, 52, 20, 18, C.white, 3, C.ink, 1.4), T(68, 66, '?', 13, HL)), ring(68, 61, 15)),
  /** ramverk (i programmering): a ready frame like scaffolding with coloured building blocks with code signs already in place; a hand adds one last small block in the empty slot; the frame is ringed. */
  'webdev.ramverk.2': all(bg(), ground, rect(14, 20, 72, 88, 'none', 2, C.dark, 3), line('M14 50 L86 50 M14 79 L86 79 M50 20 L50 108', C.dark, 3),
    rect(18, 24, 28, 22, '#9fd1a8', 2, C.ink, 1), T(32, 40, '{ }', 11, C.ink), rect(54, 24, 28, 22, '#f3c28a', 2, C.ink, 1), T(68, 40, '&lt;/&gt;', 10, C.ink), rect(18, 54, 28, 21, '#c7b3e6', 2, C.ink, 1), T(32, 69, '( )', 11, C.ink), rect(54, 54, 28, 21, '#b9d3f0', 2, C.ink, 1), T(68, 69, '=', 12, C.ink), rect(18, 83, 28, 21, '#f6c9d4', 2, C.ink, 1), T(32, 98, '#', 11, C.ink),
    rect(54, 83, 28, 21, 'none', 2, C.grey, 1, ), waIn('webdev-ramverk', 26, -20, rect(56, 85, 24, 17, YEL, 2, C.ink, 1.2)), path('M96 78 C90 80 86 86 82 92', 'none', C.skin, 6), circle(98, 76, 4, C.skin, C.ink, 1.2),
    frame(10, 16, 80, 96, 5)),
};
