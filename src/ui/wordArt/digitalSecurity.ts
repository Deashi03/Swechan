/**
 * Teknik & digital värld → Datorer & internet → Digital säkerhet, 3751–3757 (0.54): strong passwords,
 * two-factor authentication, phishing, malware, encryption, privacy online and security updates.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame), grey parts show what
 * the word is not, and the bad side (attacker, malware) is a dark grey hooded figure or a red bug.
 * Contrast pairs share one layout: kryptering/klartext (one message between two phones, scrambled with a
 * padlock or readable and read by a stranger), gemen/specialtecken (one row of keys, small letters or signs
 * marked) and the four kinds of malware (one laptop; the marked part shows what the program does: spreads,
 * hides in a gift, watches, locks the files).
 * Digits, signs (! # % & @ * ?) and single letters (a b c / A B C on keys) only; no words, no brands, no logos.
 * Standard 2 (0.55): verbs and process words move (b4-digsak-* classes; base state = the poster frame, transform and
 * opacity only). byta-lösenord and säkerhetsrisk failed two blind-test rounds in 0.54 and are drawn by hand (manual
 * track): byta lösenord = the old code is thrown in a bin while the new one is typed in; säkerhetsrisk = a password
 * note stuck on a laptop under a big warning sign, next to a grey safe laptop.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, star, waBob, waIn, waPulse, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { figure } from './figures';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SCR = '#bfe3f5';
const BUG = '#5aa64a';
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 8, col, C.ink, 1.4), line('M-4 0 L-1 3.5 L4.5 -3.5', C.white, 2.4));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, col, C.ink, 1.4), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', C.white, 2.4));
const warn = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -11 L11 8 L-11 8 Z', C.yellow, C.ink, 1.6), line('M0 -4 L0 2', C.ink, 2.4), circle(0, 5, 1.3, C.ink, null));
const lock = (x: number, y: number, s = 1, open = false, col: string = C.gold) => at(x, y, s,
  path(open ? 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -14' : 'M-6 -4 L-6 -12 C-6 -20 6 -20 6 -12 L6 -4', 'none', C.ink, 3), rect(-10, -5, 20, 16, col, 3, C.ink, 1.6), circle(0, 2, 2, C.ink, null), line('M0 2 L0 7', C.ink, 1.6));
const shieldS = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.8));
const keyIcon = (x: number, y: number, s = 1, rot = 0, col: string = C.gold) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-8, 0, 6, col, C.ink, 1.4), circle(-8, 0, 2.2, C.paper, C.ink, 1),
  path('M-2 -2 L12 -2 L12 2 L10 2 L10 6 L7 6 L7 2 L4 2 L4 5 L1 5 L1 2 L-2 2 Z', col, C.ink, 1.2));
/** Password dots in a white field. */
const dots = (x: number, y: number, w: number, n: number, col: string = C.ink, bg: string = C.white) => all(rect(x, y, w, 10, bg, 2, C.ink, 1.2), ...range(n).map((i) => circle(x + 6 + i * ((w - 10) / Math.max(n - 1, 1)), y + 5, 1.8, col, null)));
/** Little user head-and-shoulders icon. */
const userIcon = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, circle(0, -3, 3.4, col, null), path('M-6 6 C-6 0 6 0 6 6 Z', col, null));
/** A bug (malware), centre (x, y). */
const bug = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, line('M-7 -4 L-11 -7 M-7 1 L-12 1 M-7 5 L-11 8 M7 -4 L11 -7 M7 1 L12 1 M7 5 L11 8 M-2 -8 L-4 -12 M2 -8 L4 -12', C.ink, 1.3),
  ellipse(0, 1, 7, 8.5, col, C.ink, 1.4), circle(0, -7, 3.6, C.dark, C.ink, 1), line('M0 -3 L0 9', C.ink, 1), circle(-3, 0, 1.3, C.ink, null), circle(3, 4, 1.3, C.ink, null));
/** Spiky green virus blob with an angry face. */
const blob = (x: number, y: number, r: number) => all(...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return all(line(`M${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)} L${(x + Math.cos(a) * r * 1.45).toFixed(1)} ${(y + Math.sin(a) * r * 1.45).toFixed(1)}`, C.ink, 1.4), circle(+(x + Math.cos(a) * r * 1.5).toFixed(1), +(y + Math.sin(a) * r * 1.5).toFixed(1), r * 0.16, BUG, C.ink, 0.8)); }),
  circle(x, y, r, BUG, C.ink, 1.4), line(`M${x - r * 0.5} ${y - r * 0.35} L${x - r * 0.15} ${y - r * 0.15} M${x + r * 0.5} ${y - r * 0.35} L${x + r * 0.15} ${y - r * 0.15}`, C.ink, 1.2), path(`M${x - r * 0.35} ${y + r * 0.45} Q${x} ${y + r * 0.15} ${x + r * 0.35} ${y + r * 0.45}`, 'none', C.ink, 1.2));
/** Laptop, base centre at (x, y); `scr` is drawn in local coordinates inside the screen (x −23…23, y −37…−9). */
const laptop = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR) => at(x, y, s,
  rect(-26, -40, 52, 34, C.dark, 3, C.ink, 1.8), rect(-23, -37, 46, 28, bg, 1, null), scr,
  path('M-32 0 L32 0 L28 -6 L-28 -6 Z', C.silver, C.ink, 1.6), line('M-6 -3 L6 -3', C.ink, 1));
/** Phone, centre (x, y); `scr` in local coordinates (x −8.5…8.5, y −15…13). */
const phone = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR, body: string = C.dark) => at(x, y, s, rect(-10, -18, 20, 36, body, 3.4, C.ink, 1.4), rect(-8.5, -15, 17, 28, bg, 1, null), scr, circle(0, 15.5, 1.2, C.grey, null));
/** Speech-bubble-shaped message on a phone screen (local). */
const msg = (y: number, inner: Svg = '', col: string = C.white) => all(path(`M-7 ${y - 5} L7 ${y - 5} L7 ${y + 4} L-3 ${y + 4} L-6 ${y + 7} L-5.5 ${y + 4} L-7 ${y + 4} Z`, col, C.ink, 0.6), inner);
/** Hooded attacker, standing, centre x, scale s (feet on y = 112 at s = 1). */
const hood = (x: number, s = 1, extra: Svg = '') => g(`translate(${x} 112) scale(${s})`,
  path('M-14 0 L-12 -40 C-12 -50 12 -50 12 -40 L14 0 Z', C.dark, C.ink, 1.8), path('M-11 -44 C-12 -64 12 -64 11 -44 Z', C.dark, C.ink, 1.8),
  ellipse(0, -50, 6.5, 7.5, '#5b5e68', null), circle(-2.5, -51, 1.2, C.white, null), circle(2.5, -51, 1.2, C.white, null), extra);
/** Document page with text lines. */
const doc = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-8 -10 L4 -10 L8 -6 L8 10 L-8 10 Z', col, C.ink, 1.2), line('M-5 -5 L3 -5 M-5 -1 L5 -1 M-5 3 L5 3 M-5 7 L2 7', C.grey, 1));
/** Keycap with a label. */
const keycap = (x: number, y: number, label: string, col: string = '#eef0f3', ink: string = C.ink, w = 18) => all(rect(x - w / 2, y - 9, w, 18, col, 3, C.ink, 1.4), rect(x - w / 2 + 2, y - 7, w - 4, 12, 'none', 2, C.white, 0.8), T(x, y + 4.5, label, 11, ink));
/** Map pin. */
const pin = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M0 10 C-3 4 -7 0 -7 -4 C-7 -9 -3.5 -12 0 -12 C3.5 -12 7 -9 7 -4 C7 0 3 4 0 10 Z', col, C.ink, 1.2), circle(0, -4, 2.4, C.white, null));
const foot = (x: number, y: number, rot: number, col: string, inner: Svg = '') => g(`translate(${x} ${y}) rotate(${rot})`, ellipse(0, 0, 6, 10, col, C.ink, 1.2), ...[-4.5, -1.5, 1.5, 4.5].map((d, i) => circle(d, -13 + Math.abs(i - 1.5) * 1.2, 1.7, col, C.ink, 0.8)), inner);
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -11, 14, 2.5, C.brown, 1, C.ink, 1), rect(-7, 8.5, 14, 2.5, C.brown, 1, C.ink, 1),
  path('M-5 -8.5 L5 -8.5 L0.8 0 L5 8.5 L-5 8.5 L-0.8 0 Z', '#e8f4fb', C.ink, 1.2), path('M-3 -6 L3 -6 L0.5 -1 Z M-4 8 L4 8 L0 3 Z', C.yellow, null));
const coins = (x: number, y: number, n = 4) => all(...range(n).map((i) => all(ellipse(x, y - i * 4, 9, 3.4, C.gold, C.ink, 1.2))));
const brick = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#c9734f', 1, C.ink, 1.6),
  line(range(Math.floor(h / 9)).map((r) => `M${x} ${y + (r + 1) * 9} L${x + w} ${y + (r + 1) * 9}` + range(Math.ceil(w / 16)).map((c) => ` M${x + c * 16 + (r % 2) * 8} ${y + r * 9} L${x + c * 16 + (r % 2) * 8} ${y + (r + 1) * 9}`).join('')).join(' '), '#8f4a30', 1));

// ── Shared layouts ───────────────────────────────────────────────────
/** gemen/specialtecken: one row of keycaps, small letters or signs are marked. */
const keyRow = (which: 'gemen' | 'tecken') => {
  const upper = all(keycap(16, 30, 'A'), keycap(38, 30, 'B'), keycap(60, 30, 'C'), keycap(82, 30, '7'), keycap(104, 30, '4'));
  const lower = all(keycap(24, 62, 'a', '#ffe3cf'), keycap(48, 62, 'b', '#ffe3cf'), keycap(72, 62, 'c', '#ffe3cf'), keycap(96, 62, 'd', '#ffe3cf'));
  const signs = all(keycap(24, 94, '!', '#ffe3cf'), keycap(48, 94, '#', '#ffe3cf'), keycap(72, 94, '%', '#ffe3cf'), keycap(96, 94, '&', '#ffe3cf'));
  return which === 'gemen'
    ? all(greyed(upper), lower, frame(10, 48, 100, 28), greyed(signs))
    : all(greyed(upper), greyed(lower), signs, frame(10, 80, 100, 28));
};
/** kryptering/klartext: one message between two phones; scrambled behind a padlock, or readable and read by a stranger. */
const message = (enc: boolean) => {
  const plain = all(rect(36, 18, 48, 30, C.white, 3, C.ink, 1.6), line('M42 26 L76 26 M42 33 L78 33 M42 40 L68 40', C.navy, 2.4));
  const scr = all(rect(36, 18, 48, 30, '#fde3cf', 3, C.ink, 1.6), T(60, 31, '#%&@', 10, C.purple), T(60, 43, '*?!#%', 10, C.purple), lock(84, 18, 0.75));
  const left = phone(18, 86, 1.25, msg(-5, line('M-4 -6 L4 -6 M-4 -3 L2 -3', C.navy, 1.2)));
  const right = phone(102, 86, 1.25, msg(-5, line('M-4 -6 L4 -6 M-4 -3 L2 -3', C.navy, 1.2)));
  const spy = hood(60, 0.62);
  return all(ground(), left, right, arrow(30, 56, 90, 56, C.grey, 2.2), spy,
    enc ? all(waIn('b4-digsak-kryptering-1', -22, 26, scr), frame(32, 10, 60, 42), waPulse('b4-digsak-kryptering-2', at(74, 66, 1, circle(0, 0, 6, C.white, C.ink, 1), T(0, 4, '?', 10, C.red))))
      : all(plain, frame(32, 14, 56, 38), line('M57 69 L50 50 M63 69 L70 50', '#f2c14e', 1.4, '2 2')));
};
/** The four malware words share one laptop on a desk. */
const desk = all(rect(6, 92, 108, 6, C.tan, 2, C.ink, 1.6), line('M14 98 L14 112 M106 98 L106 112', C.brown, 3));

export const DIGSEC_MOTIFS: Record<string, Svg> = {
  // ── 3751 Starka lösenord ───────────────────────────────────────────
  'digsak.inloggningsuppgift': all(rect(14, 16, 92, 82, C.white, 6, C.ink, 2), circle(60, 34, 10, '#dce9f5', C.ink, 1.4), userIcon(60, 36, 1.4),
    rect(24, 52, 72, 13, '#f4f6f8', 2, C.ink, 1.2), userIcon(31, 59, 0.75), line('M40 59 L80 59', C.navy, 2.4),
    dots(24, 71, 72, 8), lock(31, 76, 0.42), rect(40, 86, 40, 8, C.green, 3, C.ink, 1), frame(19, 48, 82, 36), keyIcon(98, 104, 1, -20)),
  'digsak.gemen': keyRow('gemen'),
  'digsak.specialtecken': keyRow('tecken'),
  'digsak.lösenordshanterare': all(phone(60, 62, 2.6, all(
    rect(-7.5, -14, 15, 7, '#f4e1b0', 1, null), lock(0, -10.3, 0.22),
    ...range(4).map((i) => all(rect(-7.5, -5 + i * 4.4, 15, 3.6, C.white, 0.6, null), circle(-5.5, -3.2 + i * 4.4, 1.2, [C.denim, C.red, C.green, C.purple][i]!, null),
      ...range(4).map((j) => circle(-1.5 + j * 2.4, -3.2 + i * 4.4, 0.55, C.ink, null)))))),
  keyIcon(98, 30, 1.2, -30), keyIcon(22, 30, 1, 210), keyIcon(100, 86, 1, 20), ring(60, 62, 52)),
  'digsak.byta-lösenord': all(ground(),
    laptop(66, 72, 1.6, all(userIcon(0, -30, 0.8), rect(-20, -24, 40, 11, C.white, 2, C.ink, 1),
      waIn('b4-digsak-byta-losenord-1', -10, 0, T(-2, -15.5, '#7%k!', 7.5, C.purple)), waPulse('b4-digsak-byta-losenord-2', line('M14 -22 L14 -15', C.ink, 1)))),
    frame(32, 18, 68, 26), check(100, 18, 0.7),
    line('M34 46 C24 50 18 56 16 62', C.grey, 2, '3 3'), path('M12 58 L15 66 L21 60', 'none', C.grey, 2),
    moving('b4-digsak-byta-losenord-3', '0%,15%{transform:translate(38px,-42px)}65%,100%{transform:translate(0,0)}', { dur: 3.2 },
      g('translate(26 78) rotate(-16)', rect(-17, -8, 34, 16, C.white, 2, C.ink, 1.4), T(0, 4, '1234', 10, C.ink), line('M-15 6 L15 -6', C.red, 2.4))),
    cross(44, 72, 0.6),
    path('M6 90 L46 90 L42 112 L10 112 Z', '#8d939c', C.ink, 1.6), rect(4, 86, 44, 5, '#a7adb5', 2, C.ink, 1.4), line('M17 95 L18 108 M26 95 L26 108 M35 95 L34 108', C.ink, 1)),

  // ── 3752 Tvåfaktorsautentisering ───────────────────────────────────
  'digsak.tvåfaktorsautentisering': all(ground(), laptop(38, 100, 1.3, all(dots(-18, -28, 36, 6), circle(-18, -32, 6, C.navy, C.ink, 1), T(-18, -28, '1', 8, C.white))),
    phone(98, 82, 1.6, all(msg(-6, T(0, -3.5, '384', 5.5, C.navy)), check(0, 7, 0.45))), circle(98, 46, 6, C.navy, C.ink, 1), T(98, 50, '2', 8, C.white),
    T(74, 70, '+', 18, HL), lock(60, 24, 1.3, true, C.green), frame(6, 8, 110, 98)),
  'digsak.engångskod': all(phone(46, 62, 2.6, all(msg(-5, all(T(0, -3.3, '4829', 4.6, C.navy))), rect(-6, 5, 12, 4, '#e8ebee', 1, C.ink, 0.4))),
    frame(22, 26, 48, 28), hourglass(96, 40, 1.6), at(96, 86, 1, circle(0, 0, 13, C.white, C.ink, 1.6), path('M0 0 L0 -13 A13 13 0 0 1 12.4 4 Z', '#f6c9a8', null), line('M0 0 L0 -9 M0 0 L6 3', C.ink, 1.6)), T(96, 110, '1×', 11, HL)),
  'digsak.ansiktsigenkänning': all(phone(78, 62, 2.7, all(circle(0, -2, 6, C.skin, C.ink, 0.6), path('M-6 -3 C-6 -10 6 -10 6 -3 C3 -6 -3 -6 -6 -3 Z', C.hair, null), circle(-2, -2, 0.6, C.ink, null), circle(2, -2, 0.6, C.ink, null),
    path('M-8 -12 L-8 -9 M-8 -12 L-5 -12 M8 -12 L8 -9 M8 -12 L5 -12 M-8 8 L-8 5 M-8 8 L-5 8 M8 8 L8 5 M8 8 L5 8', 'none', HL, 1), check(5, 10, 0.3))),
    circle(24, 54, 15, C.skin, C.ink, 2), path('M9 52 C9 32 39 32 39 52 C32 44 16 44 9 52 Z', C.hair, C.ink, 1.6), circle(30, 54, 1.6, C.ink, null), line('M27 62 Q31 64 34 62', C.ink, 1.4),
    line('M40 48 L56 40 M40 60 L56 68', '#f2c14e', 1.4, '3 2'), path('M10 112 C10 82 38 82 38 112 Z', C.sky, C.ink, 1.8)),
  'digsak.säkerhetsnyckel': all(laptop(40, 92, 1.2, check(0, -23, 1.1)), at(84, 70, 1, rect(-10, -8, 14, 16, C.silver, 1, C.ink, 1.2), rect(4, -12, 22, 24, C.dark, 5, C.ink, 1.6), circle(15, 0, 6, C.gold, C.ink, 1.2),
    circle(15, 0, 3.5, 'none', '#a8801f', 0.8), circle(29, 0, 4, 'none', C.grey, 2)), ring(98, 70, 18), keyIcon(100, 102, 0.8, 30)),
  'digsak.inloggningsförsök': all(laptop(60, 104, 1.5, all(dots(-18, -33, 36, 6), userIcon(-15, -21, 0.6), line('M-9 -21 L10 -21', C.navy, 1.4))),
    moving('b4-digsak-inloggningsforsok-1', '0%,8%{opacity:0}20%,100%{opacity:1}', { dur: 3.6 }, cross(18, 26, 0.9)),
    moving('b4-digsak-inloggningsforsok-2', '0%,33%{opacity:0}45%,100%{opacity:1}', { dur: 3.6 }, cross(40, 18, 0.9)),
    moving('b4-digsak-inloggningsforsok-3', '0%,58%{opacity:0}70%,100%{opacity:1}', { dur: 3.6 }, cross(62, 26, 0.9)), T(90, 30, '3×', 16, C.red), frame(6, 8, 108, 30)),

  // ── 3753 Nätfiske ──────────────────────────────────────────────────
  'digsak.bluff-sms': all(phone(46, 62, 2.7, all(msg(-6, all(rect(-5, -9.5, 5, 4, C.tan, 0.4, C.ink, 0.3), line('M-5 -8 L0 -8', C.brown, 0.4), T(4, -6, '19', 3.6, C.red))),
    rect(-6, 3, 12, 2.4, C.denim, 0.6, null), line('M-5 4.2 L5 4.2', C.white, 0.5))), frame(22, 22, 48, 30), warn(98, 30, 1.6), at(100, 80, 1, circle(0, 0, 14, '#fde3cf', C.ink, 1.6), T(0, 5, '?', 16, C.red)),
    line('M70 38 L86 32', C.red, 1.6, '3 2')),
  'digsak.utge-sig-för': all(ground(), hood(46, 1.15), waIn('b4-digsak-utge-sig-for-1', 12, 30, line('M60 66 L72 44', C.brown, 3),
    at(78, 34, 1, circle(0, 0, 15, C.skin, C.ink, 1.8), path('M-15 -2 C-15 -18 15 -18 15 -2 C9 -10 -9 -10 -15 -2 Z', C.hair, C.ink, 1.4), circle(-5, 0, 1.6, C.ink, null), circle(5, 0, 1.6, C.ink, null),
      path('M-6 6 Q0 11 6 6', 'none', C.ink, 1.6), path('M-6 18 L6 18 L0 26 Z', C.navy, C.ink, 1))),
    at(96, 82, 1, rect(-14, -10, 28, 20, C.white, 2, C.ink, 1.4), path('M-10 -4 L0 -8 L10 -4 Z', C.grey, C.ink, 0.8), line('M-8 -3 L-8 5 M-3 -3 L-3 5 M3 -3 L3 5 M8 -3 L8 5 M-10 6 L10 6', C.ink, 1.2)),
    ring(78, 38, 22)),

  // ── 3754 Skadlig programvara ───────────────────────────────────────
  'digsak.virus.2': all(desk, laptop(60, 92, 1.3, blob(0, -23, 7)), laptop(18, 52, 0.6, blob(0, -23, 7)), laptop(102, 52, 0.6, blob(0, -23, 7)),
    arrow(44, 60, 30, 50, HL, 2.6), arrow(76, 60, 90, 50, HL, 2.6), ring(60, 62, 26)),
  'digsak.trojan': all(desk, laptop(60, 92, 1.5, all(rect(-14, -34, 28, 22, C.red, 2, C.ink, 1), rect(-2, -34, 4, 22, C.yellow, 0, null), rect(-14, -25, 28, 4, C.yellow, 0, null),
    path('M0 -34 C-6 -42 -12 -36 -2 -34 M0 -34 C6 -42 12 -36 2 -34', C.yellow, C.ink, 0.8), circle(8, -18, 7, '#fde3cf', HL, 1.6), bug(8, -18, 0.42))),
    star(16, 24, 5, C.yellow), star(104, 26, 4, C.yellow), ring(72, 64, 13)),
  'digsak.spionprogram': all(desk, laptop(46, 92, 1.4, all(circle(0, -23, 8, C.white, C.ink, 1), circle(0, -23, 4, C.navy, null), circle(1, -24, 1.3, C.white, null))),
    line('M30 88 C60 76 80 94 92 72', HL, 2, '3 3'), ...range(3).map((i) => circle(44 + i * 16, 82 - (i % 2) * 4, 1.8, HL, null)),
    hood(94, 0.72, all(rect(-10, -56, 20, 6, C.black, 2, null), circle(-4, -52, 3, C.black, null), circle(4, -52, 3, C.black, null))), ring(94, 76, 21)),
  'digsak.utpressningsprogram': all(desk, laptop(46, 92, 1.4, all(rect(-23, -37, 46, 28, '#7a2f2f', 1, null), lock(0, -24, 0.9, false, C.silver),
    doc(-15, -20, 0.45, C.grey2), doc(15, -20, 0.45, C.grey2))), coins(96, 84, 4), T(96, 62, '?', 14, C.red), hourglass(100, 30, 1.2), arrow(84, 70, 74, 64, HL, 2.6), frame(8, 30, 78, 50)),
  'digsak.antivirusprogram': all(desk, laptop(60, 92, 1.5, all(shieldS(0, -23, 0.75, C.denim), line('M-5 -23 L-1 -19 L6 -28', C.white, 2.2))),
    bug(102, 36, 1, C.red), cross(102, 60, 0.6), arrow(92, 40, 82, 46, C.grey, 2), path('M80 48 L92 32', C.grey, null), ring(60, 64, 30)),

  // ── 3755 Kryptering ────────────────────────────────────────────────
  'digsak.kryptering': message(true),
  'digsak.klartext': message(false),
  'digsak.dataläcka': all(at(36, 40, 1, ...[16, 0, -16].map((dy) => all(ellipse(0, dy + 8, 24, 6.5, '#7fa6d6', C.ink, 1.6), rect(-24, dy - 8, 48, 16, '#7fa6d6', 0, null), line(`M-24 ${dy - 8} L-24 ${dy + 8} M24 ${dy - 8} L24 ${dy + 8}`, C.ink, 1.6))), ellipse(0, -24, 24, 6.5, '#a8c4e6', C.ink, 1.6),
    path('M24 -6 L18 0 L24 4 L19 10 L24 16', 'none', C.ink, 2.2)),
    waIn('b4-digsak-datalacka-1', -10, -6, doc(70, 46, 0.7)), waIn('b4-digsak-datalacka-2', -18, -24, at(78, 64, 0.8, rect(-9, -6, 18, 12, C.white, 2, C.ink, 1.2), userIcon(-4, 0, 0.6), line('M1 -2 L6 -2 M1 2 L5 2', C.grey, 1))),
    waIn('b4-digsak-datalacka-3', -6, -40, at(66, 80, 0.8, rect(-12, -5, 24, 10, C.white, 2, C.ink, 1.2), ...range(4).map((i) => circle(-7 + i * 4.6, 0, 1.4, C.ink, null)))),
    path('M60 44 C64 40 66 40 68 42', 'none', '#7fa6d6', 1.6), line('M62 50 L66 92', '#7fa6d6', 2, '2 4'),
    circle(84, 100, 14, '#bfe3f5', C.ink, 1.6), path('M76 94 C80 90 84 96 80 100 C76 104 74 98 76 94 Z M88 98 C92 94 96 100 92 106 C88 108 86 102 88 98 Z', C.green, C.ink, 0.8),
    ...[[104, 80], [108, 96], [100, 108], [62, 106]].map(([x, y]) => at(x!, y!, 0.8, circle(0, 0, 6, C.white, C.ink, 1), circle(0, 0, 2.6, C.grey, null))), ring(60, 46, 14, HL)),

  // ── 3756 Integritet på nätet ───────────────────────────────────────
  'digsak.digitalt-fotavtryck': all(phone(18, 92, 1.1), foot(36, 82, 60, '#f6c9a8', circle(0, 0, 3, C.denim, null)), foot(50, 68, 40, '#f6c9a8', rect(-3, -3, 6, 5, C.green, 1, null)),
    foot(64, 58, 60, '#f6c9a8', path('M-3 -3 L3 -3 L3 2 L-1 2 L-3 4 Z', C.white, C.ink, 0.6)), foot(78, 44, 40, '#f6c9a8', circle(0, 0, 2.6, 'none', C.ink, 1.2)), foot(92, 34, 60, '#f6c9a8', star(0, 0, 3, C.yellow)),
    path('M96 14 C104 6 116 12 112 20 C118 22 116 30 108 30 L94 30 C86 30 86 20 94 20 C92 16 94 14 96 14 Z', C.white, C.ink, 1.4), line('M22 98 C50 80 80 50 104 24', HL, 2, '2 4')),
  'digsak.dela-sin-position': all(phone(60, 70, 2.4, all(rect(-8.5, -15, 17, 28, '#dfeedd', 1, null), line('M-8 -6 L8 4 M-3 -15 L1 13', C.white, 2), waBob('b4-digsak-dela-sin-position-1', 1.5, pin(0, -3, 0.45)))),
    waPulse('b4-digsak-dela-sin-position-2', path('M84 40 A10 10 0 0 1 84 56 M90 34 A18 18 0 0 1 90 62', 'none', HL, 2), path('M36 40 A10 10 0 0 0 36 56 M30 34 A18 18 0 0 0 30 62', 'none', HL, 2)),
    phone(106, 92, 0.8, moving('b4-digsak-dela-sin-position-3', '0%,30%{opacity:0}55%,100%{opacity:1}', { dur: 2.6 }, pin(0, -2, 0.6))), phone(14, 92, 0.8, moving('b4-digsak-dela-sin-position-4', '0%,30%{opacity:0}55%,100%{opacity:1}', { dur: 2.6 }, pin(0, -2, 0.6))), ring(60, 64, 32)),
  'digsak.röstassistent': all(ground(), figure({ x: 28, top: C.green, h: 0.95 }), at(56, 34, 1, path('M-14 -10 L14 -10 L14 8 L-2 8 L-8 14 L-7 8 L-14 8 Z', C.white, C.ink, 1.4), path('M-2 -6 L-2 3 M-2 -6 L5 -8 L5 1', 'none', C.navy, 1.6), circle(-4, 3, 2, C.navy, null), circle(3, 1, 2, C.navy, null)),
    at(92, 86, 1, rect(-14, -26, 28, 52, '#4a4d58', 12, C.ink, 1.8), ellipse(0, -24, 13, 4, C.sky, C.ink, 1), ...range(5).map((i) => line(`M-9 ${-12 + i * 7} L9 ${-12 + i * 7}`, '#6c707c', 1.6))),
    path('M76 52 A8 8 0 0 0 76 40 M70 56 A14 14 0 0 0 70 36', 'none', HL, 1.8), frame(74, 54, 36, 62)),
  'digsak.id-kapning': all(ground(), hood(42, 1.2), waIn('b4-digsak-id-kapning-1', 30, 34, at(70, 50, 1, rect(-18, -12, 36, 24, C.white, 3, C.ink, 1.6), circle(-9, -1, 6, C.skin, C.ink, 1), path('M-15 -2 C-15 -10 -3 -10 -3 -2 C-6 -5 -12 -5 -15 -2 Z', C.hair, null),
    line('M2 -5 L13 -5 M2 0 L13 0 M2 5 L10 5', C.grey, 1.4)), line('M58 62 L62 58', C.ink, 1)), ring(70, 50, 22),
    moving('b4-digsak-id-kapning-2', '0%,40%{opacity:0;transform:translate(0,-10px)}70%,100%{opacity:1;transform:translate(0,0)}', { dur: 2.6 }, coins(80, 106, 3)), greyed(figure({ x: 104, h: 0.55, top: C.orange }))),

  // ── 3757 Säkerhetsuppdateringar ────────────────────────────────────
  'digsak.säkerhetsuppdatering': all(phone(60, 62, 2.7, all(shieldS(0, -3, 0.42, C.denim), line('M-2.4 -3 L-0.4 -1 L3 -5', C.white, 1.2), rect(-6, 8, 12, 2.4, C.white, 1, C.ink, 0.3), rect(-6, 8, 8, 2.4, C.green, 1, null))),
    path('M24 50 A38 38 0 0 1 88 26', 'none', C.green, 3), arrow(84, 22, 92, 30, C.green, 3), path('M96 76 A38 38 0 0 1 32 100', 'none', C.green, 3), arrow(36, 104, 28, 96, C.green, 3), ring(60, 62, 46)),
  'digsak.täppa-till': all(brick(6, 14, 108, 98), ellipse(56, 62, 16, 13, C.black, C.ink, 1.4),
    moving('b4-digsak-tappa-till-1', '0%,10%{transform:translate(34px,-14px)}60%,100%{transform:translate(0,0)}', { dur: 3 }, rect(40, 50, 34, 26, C.tan, 2, C.ink, 1.8),
      at(92, 70, 1, rect(-4, -2, 26, 8, C.skin, 3, C.ink, 1.4), rect(-12, -6, 12, 16, C.skin, 4, C.ink, 1.4))),
    moving('b4-digsak-tappa-till-2', '0%,60%{opacity:0}75%,100%{opacity:1}', { dur: 3 }, circle(44, 54, 1.4, C.ink, null), circle(70, 54, 1.4, C.ink, null), circle(44, 72, 1.4, C.ink, null), circle(70, 72, 1.4, C.ink, null)),
    arrow(100, 40, 80, 52, HL, 3), ring(57, 63, 26)),
  'digsak.säkerhetsrisk': all(ground(),
    greyed(all(laptop(22, 108, 0.62, all(dots(-16, -27, 32, 5), lock(0, -14, 0.4))), check(22, 66, 0.6, C.grey))),
    laptop(74, 108, 1.3, all(dots(-18, -30, 36, 6), lock(0, -16, 0.55, true, C.gold))),
    waSway('b4-digsak-sakerhetsrisk-1', 6, g('translate(98 60) rotate(10)', rect(-11, -10, 22, 20, '#f7e27a', 1, C.ink, 1.2), T(0, 3, '1234', 7, C.ink))),
    waPulse('b4-digsak-sakerhetsrisk-2', warn(74, 30, 2.1)), frame(40, 6, 76, 106)),
};
