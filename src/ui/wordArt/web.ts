/**
 * Teknik & digital värld → Datorer & internet → Internet & webben, 3731–3737 (0.54): browsers and tabs, websites and
 * web addresses, search engines, links and downloads, cookies and cache, domains and servers, error messages.
 * Recurring signs: a browser window is a white box with a grey strip of tabs on top, a toolbar with back/forward/reload
 * and a long address bar, and the page below; text on screens is drawn as grey bars, never as letters; the part the word
 * names is ringed or framed in orange, and grey copies show what the word is not.
 * Close words share one layout where only the marked part differs: webbläsare/webbsida/flik/adressfält/bokmärke/
 * historik (the same browser window; the whole frame, the page, one tab, the address bar, the star, or the clock list);
 * webbplats/startsida/undersida (the same tree of pages; all of it, the top page, or one lower page);
 * användarnamn (the login card with the name field marked); formulär/fält (the same form; all of it,
 * or one field with the text cursor); felmeddelande/felkod (the same error box; the whole box, or only the digits);
 * server/datacenter (one machine sending pages to devices, or a whole building full of machines in the snow);
 * nedladdning/streama (a filling progress bar and an arrow down, or a film playing from a dotted stream with
 * nothing saved).
 * Digits, the signs . / ! ? + − and ✓ ✗ only; no words, no brands, no logos and no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const BG = '#eef3f7';
const CHROME = '#dde2e8';
const SCR = '#fbfbf8';
const BLUE = '#3a6ab0';
const LINK = '#2f6fd6';
const GREEN = '#3a9a5a';
const RED = '#e2553a';
const YEL = '#f2c14e';
const BAR = '#c3cad2';
const DARKW = '#2f3440';
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
/** Curved arrow through a control point. */
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
const num = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
/** Text drawn as grey bars. */
const bars = (x: number, y: number, w: number, n: number, gap = 5, col: string = BAR, sw = 1.8) => all(...range(n).map((i) => line(`M${x} ${y + i * gap} L${f1(x + w - ((i * 7) % 4) * w * 0.08 - (i === n - 1 ? w * 0.3 : 0))} ${y + i * gap}`, col, sw)));
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };

// ── Icons ────────────────────────────────────────────────────────────
const cursor = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L0 16 L4 12 L7 19 L10 18 L7 11 L12 11 Z', C.white, C.ink, 1.4));
const ibeam = (x: number, y: number, h = 10, col: string = C.ink) => line(`M${x} ${y} L${x} ${y + h} M${x - 2} ${y} L${x + 2} ${y} M${x - 2} ${y + h} L${x + 2} ${y + h}`, col, 1.3);
const mag = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, circle(0, 0, 5, 'rgba(220,240,252,0.8)', col, 1.6), line('M3.6 3.6 L8 8', col, 2.2));
const starIcon = (x: number, y: number, r: number, fill: string) => { const p: string[] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.45 : r; p.push(`${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`); } return path(`M${p.join(' L')} Z`, fill, C.ink, 0.9); };
const reloadIcon = (x: number, y: number, r: number, col: string = C.dark, sw = 1.3) => all(path(`M${f1(x + r)} ${y} A${r} ${r} 0 1 1 ${f1(x + r * 0.5)} ${f1(y - r * 0.87)}`, 'none', col, sw), head(f1(x + r * 0.95), f1(y - r * 0.35), -1.2, col, sw / 2.6));
const clockIcon = (x: number, y: number, r: number, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${x} ${y} L${x} ${f1(y - r * 0.6)} M${x} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.2)}`, C.ink, 1.2));
const pic = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#bfe3f5', 1, C.ink, 0.9), path(`M${x} ${y + h} L${f1(x + w * 0.35)} ${f1(y + h * 0.4)} L${f1(x + w * 0.55)} ${f1(y + h * 0.7)} L${f1(x + w * 0.75)} ${f1(y + h * 0.5)} L${x + w} ${y + h} Z`, '#6fae5a', null), circle(f1(x + w * 0.78), f1(y + h * 0.28), f1(Math.min(w, h) * 0.12), YEL, null), rect(x, y, w, h, 'none', 1, C.ink, 0.9));
const biscuit = (x: number, y: number, r: number) => all(circle(x, y, r, '#d9a05b', C.ink, 1.2), ...[[-0.4, -0.3], [0.35, -0.35], [0.1, 0.25], [-0.35, 0.4], [0.5, 0.25]].map(([a, b]) => circle(f1(x + a! * r), f1(y + b! * r), f1(r * 0.14), '#6b3f22', null)));
const trash = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 -8 L9 -8 L7 12 L-7 12 Z', '#9aa3ad', C.ink, 1.4), rect(-11, -12, 22, 4, '#7a8590', 1, C.ink, 1.2), rect(-3, -15, 6, 3, '#7a8590', 1, C.ink, 1), line('M-4 -4 L-3 9 M0 -4 L0 9 M4 -4 L3 9', '#5a636e', 1));
const cloud = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M-16 8 C-24 8 -24 -4 -15 -4 C-14 -14 -2 -16 2 -9 C7 -16 19 -12 17 -3 C24 -3 24 8 16 8 Z', fill, C.ink, 1.5));
const docIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-8 -10 L4 -10 L8 -6 L8 10 L-8 10 Z', col, C.ink, 1.3), path('M4 -10 L4 -6 L8 -6', 'none', C.ink, 1), bars(-5, -4, 10, 3, 4, BAR, 1.4));
const photoIcon = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -8, 20, 16, C.white, 2, C.ink, 1.3), pic(-8, -6, 16, 12));
const padlock = (x: number, y: number, s = 1, col: string = '#e0b23c') => at(x, y, s, path('M-6 -3 L-6 -10 C-6 -18 6 -18 6 -10 L6 -3', 'none', C.ink, 3.4), path('M-6 -3 L-6 -10 C-6 -18 6 -18 6 -10 L6 -3', 'none', '#b9c0c8', 1.8), rect(-10, -4, 20, 16, col, 3, C.ink, 1.6), circle(0, 2, 2.2, C.ink, null), line('M0 2 L0 8', C.ink, 1.8));
const avatarIcon = (x: number, y: number, r: number, col = '#7ab0e8') => all(circle(x, y, r, col, C.ink, 1.2), circle(x, f1(y - r * 0.25), f1(r * 0.36), C.white, null), path(`M${f1(x - r * 0.62)} ${f1(y + r * 0.72)} C${f1(x - r * 0.62)} ${f1(y + r * 0.05)} ${f1(x + r * 0.62)} ${f1(y + r * 0.05)} ${f1(x + r * 0.62)} ${f1(y + r * 0.72)}`, C.white, null));
const warnIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 L12 9 L-12 9 Z', YEL, C.ink, 1.6), line('M0 -4 L0 3', C.ink, 2.2), circle(0, 6, 1.2, C.ink, null));
const bang = (x: number, y: number, r: number) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.15)}`, C.white, r * 0.28), circle(x, f1(y + r * 0.5), f1(r * 0.14), C.white, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, '#e0b23c', C.ink, 1.2), circle(x, y, f1(r * 0.6), 'none', '#b8860b', 0.8));

// ── Devices ──────────────────────────────────────────────────────────
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, SCR, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', '#9aa3ad', C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '', col: string = C.dark) => at(x, y, s, rect(-14, -24, 28, 48, col, 4, C.ink, 1.6), rect(-11.5, -19, 23, 37, SCR, 1.4, null), inner);
const monitor = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, SCR, 1, null), inner, path(`M${f1(x + w / 2 - 5)} ${y + h} L${f1(x + w / 2 + 5)} ${y + h} L${f1(x + w / 2 + 8)} ${y + h + 9} L${f1(x + w / 2 - 8)} ${y + h + 9} Z`, '#9aa3ad', C.ink, 1.4), rect(f1(x + w / 2 - 16), y + h + 9, 32, 3, '#9aa3ad', 1, C.ink, 1.2));

// ── The browser window (shared layout) ───────────────────────────────
type Win = { tabs?: number; active?: number; dark?: boolean; starOn?: boolean; addr?: Svg; inner?: Svg; noBar?: boolean };
/** Browser window at (x, y) with size w × h: tab strip 10 high, toolbar 11 high, page below. */
const win = (x: number, y: number, w: number, h: number, o: Win = {}) => {
  const n = o.tabs ?? 1, act = o.active ?? 0, dark = o.dark ?? false;
  const strip = dark ? '#1f232b' : CHROME, tabCol = dark ? '#3a3f4b' : '#c9d0d8', actCol = dark ? DARKW : SCR, ink = dark ? '#c9d0d8' : C.dark;
  const tw = Math.min(26, (w - 14) / n);
  const tab = (i: number) => { const tx = x + 4 + i * tw; return path(`M${f1(tx)} ${y + 10} L${f1(tx + 2.5)} ${y + 3} L${f1(tx + tw - 3.5)} ${y + 3} L${f1(tx + tw - 1)} ${y + 10} Z`, i === act ? actCol : tabCol, dark ? '#11141a' : C.ink, 0.9); };
  const tabBars = (i: number) => line(`M${f1(x + 4 + i * tw + 5)} ${y + 6.8} L${f1(x + 4 + i * tw + tw - 8)} ${y + 6.8}`, i === act ? (dark ? '#8a93a0' : '#9aa3ad') : (dark ? '#5a6170' : '#aab2bb'), 1.4);
  const bx = x + 26, bw = w - 31;
  return all(
    rect(x, y, w, h, dark ? DARKW : SCR, 3, C.ink, 1.6),
    path(`M${x + 1} ${y + 10} L${x + 1} ${y + 3} Q${x + 1} ${y + 1} ${x + 3} ${y + 1} L${x + w - 3} ${y + 1} Q${x + w - 1} ${y + 1} ${x + w - 1} ${y + 3} L${x + w - 1} ${y + 10} Z`, strip, null),
    ...range(n).filter((i) => i !== act).map(tab), tab(act), ...range(n).map(tabBars),
    line(`M${x} ${y + 21} L${x + w} ${y + 21}`, dark ? '#11141a' : C.grey2, 1),
    // back, forward, reload
    path(`M${x + 8} ${y + 13.5} L${x + 5} ${y + 15.5} L${x + 8} ${y + 17.5}`, 'none', ink, 1.2), path(`M${x + 12} ${y + 13.5} L${x + 15} ${y + 15.5} L${x + 12} ${y + 17.5}`, 'none', ink, 1.2), reloadIcon(x + 21, y + 15.6, 2.3, ink, 1.1),
    o.noBar ? '' : rect(bx, y + 12.2, bw, 6.8, dark ? '#3a3f4b' : '#eef1f4', 3.4, dark ? '#11141a' : C.grey2, 0.8),
    o.noBar ? '' : (o.addr ?? line(`M${bx + 4} ${y + 15.6} L${f1(bx + bw * 0.55)} ${y + 15.6}`, dark ? '#6a7180' : BAR, 1.4)),
    o.noBar ? '' : starIcon(bx + bw - 4, y + 15.6, 2.4, o.starOn ? YEL : (dark ? '#3a3f4b' : '#eef1f4')),
    o.inner ?? '');
};
/** A typical page: blue header, a picture, grey text bars. */
const page = (x: number, y: number, w: number, h: number, col: string = BLUE) => all(rect(x, y, w, 7, col, 1, null), line(`M${x + 4} ${y + 3.5} L${x + 18} ${y + 3.5}`, C.white, 1.6),
  pic(x + 4, y + 11, f1(w * 0.42), f1(h * 0.42)), bars(f1(x + 8 + w * 0.42), y + 13, f1(w * 0.5 - 10), 4, 5), bars(x + 4, f1(y + 16 + h * 0.42), w - 8, Math.max(1, Math.floor((h * 0.58 - 18) / 5)), 5));
/** Standard big window used by the browser-part words. */
const W0 = { x: 8, y: 18, w: 104, h: 86 };
const stdWin = (o: Win = {}, grey = false) => { const w = win(W0.x, W0.y, W0.w, W0.h, { tabs: 3, active: 0, inner: page(W0.x + 6, W0.y + 26, W0.w - 12, W0.h - 30), ...o }); return grey ? greyed(w) : w; };

// ── A small site tree (webbplats / startsida / undersida) ────────────
const mini = (x: number, y: number, s: number, col: string = BLUE) => at(x, y, s, rect(-12, -15, 24, 30, SCR, 2, C.ink, 1.6), rect(-12, -15, 24, 6, col, 1.5, null), bars(-8, -4, 16, 3, 5, BAR, 1.6), rect(-12, -15, 24, 30, 'none', 2, C.ink, 1.6));
const TREE = { top: [60, 34] as [number, number], subs: [[26, 76], [60, 76], [94, 76]] as [number, number][] };
const treeLines = (grey = false) => all(...TREE.subs.map(([x, y]) => line(`M60 50 L60 56 L${x} 56 L${x} ${y - 15}`, grey ? C.grey2 : C.dark, 1.6)));
const treeAll = (focus: 'all' | 'top' | 'sub') => all(bg(),
  treeLines(focus !== 'all'),
  focus === 'sub' ? greyed(mini(...TREE.top, 1.1)) : mini(...TREE.top, 1.1, '#e07a3a'),
  ...TREE.subs.map(([x, y], i) => (focus === 'top' || (focus === 'sub' && i !== 2) ? greyed(mini(x, y, 0.95)) : mini(x, y, 0.95))));

// ── Login card (användarnamn) ────────────────────────────────────────
const loginCard = (x: number, y: number, s = 1, hlName = false, filled = true) => at(x, y, s,
  rect(-26, -34, 52, 68, SCR, 4, C.ink, 1.6), avatarIcon(0, -20, 8),
  rect(-20, -7, 40, 9, C.white, 2, hlName ? HL : C.grey2, hlName ? 1.8 : 1), avatarIcon(-15, -2.5, 3, '#9aa3ad'), filled ? line('M-9 -2.5 L10 -2.5', C.dark, 1.6) : '',
  rect(-20, 6, 40, 9, C.white, 2, C.grey2, 1), filled ? all(...range(5).map((i) => circle(-14 + i * 5, 10.5, 1.4, C.dark, null))) : '',
  rect(-14, 20, 28, 8, GREEN, 3, C.ink, 1), path('M-3 24 L4 24 M1 21.5 L4 24 L1 26.5', 'none', C.white, 1.2));

// ── Address strip (webbadress / snedstreck / domän) ──────────────────
/** An address made of grey "words" with dots and slashes; parts: [kind, width]; kind w = word, d = dot, s = slash. */
const addrStrip = (x: number, y: number, parts: [string, number][], hl: (i: number) => boolean = () => false, h = 14, tld = '') => {
  let cx = x + 6; const out: Svg[] = [rect(x, y, parts.reduce((a, [, w]) => a + w + 3, 9), h, C.white, h / 2, C.ink, 1.4)];
  parts.forEach(([k, w], i) => {
    const col = hl(i) ? HL : (k === 'w' ? '#7a8590' : C.ink);
    if (k === 'w') out.push(line(`M${cx} ${y + h / 2} L${cx + w} ${y + h / 2}`, col, h * 0.28));
    if (k === 'd') out.push(circle(cx + w / 2, y + h * 0.72, h * 0.09, col, null));
    if (k === 's') out.push(line(`M${cx + w * 0.15} ${f1(y + h * 0.86)} L${cx + w * 0.85} ${f1(y + h * 0.14)}`, col, hl(i) ? h * 0.18 : h * 0.12));
    if (k === 't') out.push(num(cx + w / 2, f1(y + h * 0.74), tld, h * 0.62, col, 700));
    cx += w + 3;
  });
  return all(...out);
};

// ── Server rack ──────────────────────────────────────────────────────
const rack = (x: number, y: number, s = 1, down = false) => at(x, y, s, rect(-14, -40, 28, 80, '#3d3f4a', 2, C.ink, 1.8),
  ...range(6).map((i) => all(rect(-11, -36 + i * 12.6, 22, 10, '#575b68', 1, C.ink, 0.8), line(`M-8 ${-31 + i * 12.6} L2 ${-31 + i * 12.6}`, '#2b2d35', 1.6), circle(6, -31 + i * 12.6, 1.4, down ? RED : (i % 2 ? '#7ee07e' : '#7ec8ff'), null))));

// ── Form (formulär / fält) ───────────────────────────────────────────
const formPage = (hlField = -1) => all(
  rect(16, 12, 88, 96, SCR, 4, C.ink, 1.8), rect(16, 12, 88, 10, BLUE, 3, null), line('M24 17 L46 17', C.white, 1.8),
  ...range(4).map((i) => all(line(`M24 ${32 + i * 16} L${40 + (i % 2) * 8} ${32 + i * 16}`, '#7a8590', 1.6), rect(24, 35 + i * 16, 72, 8, C.white, 2, i === hlField ? HL : C.grey, i === hlField ? 1.6 : 1),
    i < 2 && i !== hlField ? line(`M27 ${39 + i * 16} L${52 + i * 6} ${39 + i * 16}`, C.dark, 1.4) : '', i === hlField ? ibeam(29, 36 + i * 16, 6) : '')),
  rect(64, 96, 32, 8, GREEN, 3, C.ink, 1), path('M74 98 L86 100 L74 102 L76 100 Z', C.white, null));

// ── Error box (felmeddelande / felkod) ───────────────────────────────
const errBox = (code: boolean) => all(bg(), greyed(win(8, 12, 104, 92, { inner: page(14, 38, 92, 62) })),
  rect(18, 38, 84, 52, C.white, 4, C.ink, 2), rect(18, 38, 84, 9, '#f6d6cf', 3, null), line('M18 47 L102 47', C.grey2, 1),
  bang(32, 62, 8), code ? all(num(68, 67, '404', 17, RED, 900), greyed(bars(44, 76, 46, 1, 5)), oval(68, 61, 22, 11)) : all(num(68, 62, '404', 8, C.grey, 700), bars(44, 70, 46, 2, 5, '#7a8590')),
  rect(70, 80, 24, 7, BLUE, 3, null), line('M78 83.5 L86 83.5', C.white, 1.4),
  code ? '' : frame(14, 34, 92, 60, 6));

export const WEB_MOTIFS: Record<string, Svg> = {
  // ── 3731 Webbläsare och flikar ───────────────────────────────────────
  /** webbläsare: a desktop screen showing a whole browser window (tabs, toolbar with back/forward/reload, address bar, a page); a small grey writing app lies behind it; the whole browser window is framed in orange. */
  'webb.webbläsare': all(bg(), monitor(8, 12, 104, 78, all(greyed(rect(14, 18, 40, 30, SCR, 2, C.ink, 1.2), bars(18, 26, 30, 4, 5)), win(20, 22, 86, 62, { tabs: 3, inner: page(25, 47, 76, 34) }))), frame(16, 18, 94, 70, 5)),
  /** webbsida: the same browser window, but the window frame, tabs and toolbar are grey; only the page inside (blue header, a picture, text bars) is coloured and framed in orange. */
  'webb.webbsida': all(bg(), greyed(win(W0.x, W0.y, W0.w, W0.h, { tabs: 3 })), page(W0.x + 6, W0.y + 26, W0.w - 12, W0.h - 30), frame(W0.x + 3, W0.y + 23, W0.w - 6, W0.h - 25, 4)),
  /** flik: the browser window with three tabs at the top; one tab is lifted, white and ringed in orange, the rest of the window is grey. */
  'webb.flik': all(bg(), greyed(stdWin({ tabs: 3, active: 1 })), win(W0.x, W0.y, W0.w, 12, { tabs: 3, active: 1, noBar: true }), oval(W0.x + 4 + 26 * 1.5, W0.y + 6, 17, 8)),
  /** adressfält: the browser window in grey; only the long address bar in the toolbar is coloured, with grey text and a dot and slash, and it is ringed. */
  'webb.adressfält': all(bg(), greyed(stdWin()), rect(34, 30, 76, 6.8, '#eef1f4', 3.4, C.ink, 1), addrStrip(36, 30.6, [['w', 18], ['d', 2], ['w', 8], ['s', 4], ['w', 12]], () => false, 5.6), oval(72, 33.4, 42, 8)),
  /** zooma: on the left a grey page with tiny text; an orange arrow; on the right the same page with big text bars and a big magnifying glass with a plus sign over it. */
  'webb.zooma': all(bg(), greyed(rect(10, 34, 30, 40, SCR, 2, C.ink, 1.4), bars(14, 40, 22, 6, 4, BAR, 1)), arr(44, 54, 56, 54, HL, 3),
    rect(60, 16, 52, 82, SCR, 3, C.ink, 1.6), bars(66, 26, 40, 5, 12, '#7a8590', 5), at(88, 64, 2.2, circle(0, 0, 7, 'rgba(220,240,252,0.6)', C.ink, 1.2), line('M5 5 L11 11', C.ink, 2.2), line('M-3.5 0 L3.5 0 M0 -3.5 L0 3.5', HL, 1.6))),
  /** ladda om: the browser window with an empty white page; the round reload arrow in the toolbar is drawn very big in orange in the middle of the page, with a cursor on it. */
  'webb.ladda-om': all(bg(), stdWin({ inner: rect(14, 44, 92, 56, SCR, 1, null) }), ring(29, 33.6, 5.5), reloadIcon(60, 72, 16, HL, 4.4), cursor(70, 78, 1)),
  /** bokmärke: the browser window; the star at the end of the address bar is yellow and ringed; under the toolbar a strip of small saved page icons, and an orange dashed arrow goes from the star to the newest one. */
  'webb.bokmärke': all(bg(), greyed(stdWin()), rect(W0.x + 1, 40, W0.w - 2, 9, '#f2f4f6', 0, null), ...[0, 1, 2, 3].map((i) => all(rect(14 + i * 22, 42, 6, 5, i === 3 ? '#e07a3a' : BLUE, 1, null), line(`M${22 + i * 22} 44.5 L${30 + i * 22} 44.5`, BAR, 1.4))),
    starIcon(103, 33.6, 4.6, YEL), ring(103, 33.6, 7), carr(100, 40, 92, 46, 84, 45, HL, 1.8, '2.5 2')),
  /** historik: the browser window in grey; a panel slides out on the right with a clock at the top and a list of visited pages, each with a small page icon and a time (8:10, 9:25, 12:40, 15:05); the clock and the list are framed. */
  'webb.historik': all(bg(), greyed(stdWin()), rect(52, 40, 58, 62, C.white, 3, C.ink, 1.6), clockIcon(62, 49, 6),
    ...['8:10', '9:25', '12:40', '15:05'].map((t, i) => all(rect(58, 58 + i * 11, 7, 7, [BLUE, GREEN, '#e07a3a', '#7a5a8a'][i]!, 1, null), line(`M68 ${61.5 + i * 11} L86 ${61.5 + i * 11}`, BAR, 1.6), num(99, 64 + i * 11, t, 6, C.dark, 700))), frame(50, 38, 62, 66, 4)),
  /** inkognitoläge: a dark browser window; in the middle of the dark page a round face icon with a hat and dark glasses; next to the window a small grey clock list of visited pages with a red cross over it (nothing is saved). */
  'webb.inkognitoläge': all(bg(), win(6, 14, 78, 90, { tabs: 1, dark: true }), circle(45, 64, 18, '#4a505e', null),
    path('M31 60 L59 60 L55 56 L52 46 C50 42 40 42 38 46 L35 56 Z', '#c9d0d8', null), line('M28 60 L62 60', '#c9d0d8', 2.6),
    circle(39, 67, 5, '#c9d0d8', null), circle(51, 67, 5, '#c9d0d8', null), line('M44 67 L46 67', '#c9d0d8', 1.6),
    greyed(rect(88, 40, 26, 40, C.white, 2, C.ink, 1.2), clockIcon(101, 47, 4), bars(92, 56, 18, 4, 6)), no(101, 70, 7), frame(3, 11, 84, 96, 5)),
  /** surfa (på nätet): a woman sits on the ground holding a phone; above her a row of small web pages rides on a blue wave, joined by curved orange arrows from page to page. */
  'webb.surfa.2': all(bg(), ground, person(30, C.orange, { hairStyle: 'long', h: 0.72 }), reach(30, 0.72, 1, 50, 84), phone(54, 82, 0.55, page(-10, -17, 20, 30)),
    path('M4 40 C18 28 30 52 46 40 C62 28 74 52 90 40 C100 33 108 38 116 36', 'none', '#7ec8ff', 3),
    mini(22, 24, 0.55), mini(58, 20, 0.55, GREEN), mini(94, 24, 0.55, '#7a5a8a'), carr(30, 16, 40, 6, 51, 13, HL, 2), carr(66, 12, 78, 4, 87, 16, HL, 2), carr(60, 66, 66, 56, 62, 46, HL, 1.6, '2 2')),
  /** skriva ut (på papper): a laptop on a desk shows a picture; next to it a printer pushes out a sheet of paper with the same picture; an orange arrow goes from the laptop to the printer. */
  'webb.skriva-ut.2': all(bg(), rect(4, 86, 112, 6, '#c8a070', 1, C.ink, 1.4), laptop(34, 86, 0.75, all(pic(-20, -32, 40, 22), bars(-20, -8, 40, 1, 4))),
    rect(70, 64, 42, 22, '#d8dde2', 4, C.ink, 1.6), rect(76, 60, 30, 6, '#9aa3ad', 1, C.ink, 1.2), rect(76, 80, 30, 3, '#3d3f4a', 1, null), path('M78 82 L104 82 L102 104 L80 104 Z', C.white, C.ink, 1.4), pic(83, 86, 16, 11), circle(106, 70, 1.6, '#7ee07e', null), arr(58, 72, 68, 72, HL, 2.6), ring(91, 94, 14)),

  // ── 3732 Webbplatser och webbadresser ────────────────────────────────
  /** webbplats: a tree of pages: one top page with an orange header joined by lines to three lower pages; all of them are coloured and one big orange frame goes round the whole tree. */
  'webb.webbplats': all(treeAll('all'), frame(8, 14, 104, 82, 8)),
  /** startsida: the same tree of pages; only the top page is coloured and ringed, the three lower pages are grey. */
  'webb.startsida': all(treeAll('top'), ring(60, 34, 22)),
  /** undersida (på en webbplats): the same tree of pages; the top page and two lower pages are grey; one lower page on the right is coloured and ringed, with an orange arrow going down to it from the top. */
  'webb.undersida.2': all(treeAll('sub'), carr(70, 40, 92, 44, 93, 58, HL, 2.2), ring(94, 76, 19)),
  /** webbadress: a poster on a wall with a picture of a café and below it a long address strip (grey bars with a dot and slashes); a hand holds up a phone with the same strip in its address bar; the strip on the poster is ringed. */
  'webb.webbadress': all(bg('#e8dcc8'), rect(10, 10, 66, 86, C.white, 2, C.ink, 1.8), pic(16, 16, 54, 40), rect(28, 34, 24, 22, '#c84a3a', 1, C.ink, 1.2), rect(34, 42, 10, 14, '#a0673d', 1, C.ink, 1),
    bars(16, 64, 40, 1), addrStrip(14, 76, [['w', 14], ['d', 2], ['w', 10], ['d', 2], ['w', 6], ['s', 4], ['w', 8]]), oval(44, 83, 38, 12),
    phone(96, 74, 0.8, all(rect(-10, -16, 20, 5, '#eef1f4', 2.5, C.grey2, 0.6), line('M-8 -13.5 L6 -13.5', '#7a8590', 1.6), page(-10, -9, 20, 25)))),
  /** snedstreck: a big address strip of grey bars with dots; one of the slanted strokes between two bars is big, orange and ringed; the other slash is grey. */
  'webb.snedstreck': all(bg(), addrStrip(6, 46, [['w', 16], ['d', 3], ['w', 10], ['s', 10], ['w', 14], ['s', 10], ['w', 10]], (i) => i === 3, 26), ring(48, 59, 16)),
  /** mobilanpassad: two phones: on the left a grey phone where a wide computer page sticks out on both sides with tiny text; on the right a coloured phone where the page fits, with one column, big text and a green tick; the right phone is ringed. */
  'webb.mobilanpassad': all(bg(), greyed(phone(30, 60, 1.2), rect(4, 44, 52, 30, SCR, 1, C.ink, 1), page(6, 46, 48, 26), no(30, 98, 6)),
    phone(86, 60, 1.2, all(rect(-11.5, -19, 23, 5, BLUE, 1, null), pic(-9, -12, 18, 11), bars(-9, 3, 18, 3, 5, '#7a8590', 2.4))), ok(86, 98, 6), oval(86, 60, 22, 36)),
  /** användarnamn: a login card: a round profile picture at the top, a first field with a small person icon and a written name, a second field with dots, and a green button; the first field (the name) is ringed. */
  'webb.användarnamn': all(bg(), loginCard(60, 60, 1.45, true), oval(60, 57, 36, 11)),
  // ── 3733 Sökmotorer ──────────────────────────────────────────────────
  /** googla: a man holds a phone; a thought bubble with a question mark is above his head; the phone shows a search box with a magnifying glass and a list of results under it. */
  'webb.googla': all(bg(), ground, person(30, C.green), reach(30, 1, 1, 52, 70), phone(62, 66, 1.1, all(rect(-10, -16, 20, 6, C.white, 3, C.ink, 0.8), mag(6, -13, 0.4), ...[0, 1, 2].map((i) => all(line(`M-9 ${-5 + i * 7} L4 ${-5 + i * 7}`, LINK, 1.4), line(`M-9 ${-2 + i * 7} L8 ${-2 + i * 7}`, BAR, 1.2))))),
    path('M18 18 C10 18 10 4 22 4 L46 4 C58 4 58 18 46 18 L36 18 L32 24 L31 18 Z', C.white, C.ink, 1.4), num(34, 16, '?', 12, HL, 900), mag(96, 34, 2.2, HL)),
  /** sökförslag: a search box with two grey letters typed and a blinking cursor; under it a dropdown list of four suggestions, each with a small magnifying glass and a bar that starts with the same dark part; the dropdown is framed. */
  'webb.sökförslag': all(bg(), rect(12, 18, 96, 14, C.white, 7, C.ink, 1.6), mag(98, 25, 0.8), line('M20 25 L30 25', C.dark, 3), ibeam(33, 20, 10),
    rect(12, 34, 96, 62, C.white, 3, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => all(mag(22, 44 + i * 14, 0.5, '#7a8590'), line(`M30 ${44 + i * 14} L40 ${44 + i * 14}`, C.dark, 3), line(`M42 ${44 + i * 14} L${66 + ((i * 9) % 22)} ${44 + i * 14}`, BAR, 3))), frame(9, 31, 102, 68, 5)),
  /** bildsökning: a search box with a small picture icon and a magnifying glass; under it a grid of nine small pictures (mountains, flowers, houses) instead of text; the grid is framed. */
  'webb.bildsökning': all(bg(), rect(12, 12, 96, 14, C.white, 7, C.ink, 1.6), photoIcon(24, 19, 0.45), line('M32 19 L60 19', BAR, 2.4), mag(98, 19, 0.8),
    ...range(9).map((i) => { const x = 16 + (i % 3) * 30, y = 34 + Math.floor(i / 3) * 24; return i % 3 === 1 ? all(rect(x, y, 26, 20, '#f4e9f0', 1, C.ink, 1), circle(x + 13, y + 9, 4, '#e86a9a', C.ink, 0.8), circle(x + 13, y + 9, 1.6, YEL, null), line(`M${x + 13} ${y + 13} L${x + 13} ${y + 19}`, GREEN, 1.4)) : i % 3 === 2 ? all(rect(x, y, 26, 20, '#d8eef8', 1, C.ink, 1), rect(x + 7, y + 9, 12, 11, '#f2e2c4', 0, C.ink, 0.8), path(`M${x + 5} ${y + 9} L${x + 13} ${y + 3} L${x + 21} ${y + 9} Z`, '#c84a3a', C.ink, 0.8)) : pic(x, y, 26, 20); }), frame(12, 30, 96, 78, 5)),

  // ── 3734 Länkar och nedladdningar ────────────────────────────────────
  /** länk: a page of grey text bars; one piece of a line is blue and underlined, with the cursor on it and a small chain sign; a curved orange arrow goes from it to a second small page on the right; the blue piece is ringed. */
  'webb.länk': all(bg(), rect(8, 14, 66, 90, SCR, 3, C.ink, 1.6), bars(14, 24, 54, 4, 8), line('M14 64 L28 64', BAR, 1.8), line('M32 64 L56 64', LINK, 2.2), line('M32 67 L56 67', LINK, 1), line('M60 64 L66 64', BAR, 1.8), bars(14, 76, 54, 3, 8), cursor(48, 64, 0.8),
    at(44, 52, 0.9, ellipse(-5, 0, 6, 3.6, 'none', LINK, 1.8), ellipse(5, 0, 6, 3.6, 'none', LINK, 1.8)), oval(44, 65, 16, 8), carr(60, 60, 92, 50, 92, 34, HL, 2.4), mini(94, 30, 0.9, GREEN)),
  /** nedladdning: a cloud at the top; a document comes down out of it along a thick orange arrow into a laptop; on the laptop screen a big progress bar is two-thirds green; the progress bar is framed. */
  'webb.nedladdning': all(bg(), cloud(60, 20, 1.2), docIcon(60, 38, 0.9), arr(60, 48, 60, 62, HL, 4), laptop(60, 100, 1.15, all(rect(-22, -22, 44, 9, C.white, 4, C.ink, 1.2), rect(-21, -21, 28, 7, GREEN, 3.5, null), line('M-6 -32 L-6 -26 M-9 -29 L-6 -26 L-3 -29', '#7a8590', 1.4))), frame(32, 70, 56, 16, 5)),
  /** streama: a laptop plays a film (a play triangle over a landscape); a long line of dots runs from a cloud straight into the screen; next to it a grey folder with a red cross shows that nothing is saved. */
  'webb.streama': all(bg(), cloud(20, 22, 1), laptop(66, 92, 1.3, all(pic(-25, -35, 50, 30), circle(0, -20, 8, 'rgba(0,0,0,0.45)', null), path('M-3 -25 L5 -20 L-3 -15 Z', C.white, null))),
    ...range(7).map((i) => circle(f1(26 + i * 5.5), f1(32 + i * 3.4), 1.8, HL, null)), greyed(path('M86 14 L94 14 L97 18 L112 18 L112 34 L86 34 Z', '#e0b23c', C.ink, 1.2)), no(110, 38, 6)),
  // ── 3735 Cookies och cache ───────────────────────────────────────────
  /** cookie: a laptop shows a web page with a box across the bottom; in the box a round brown biscuit with chocolate dots, a green tick button and a grey button; the biscuit is ringed. */
  'webb.cookie': all(bg(), laptop(60, 98, 1.6, all(greyed(page(-26, -36, 52, 18)), rect(-26, -18, 52, 14, C.white, 1, C.ink, 0.8), biscuit(-18, -11, 5), bars(-10, -14, 16, 2, 3.5, '#7a8590', 1.2), rect(9, -16, 7, 5, GREEN, 1.5, null), rect(17, -16, 7, 5, '#c9ced4', 1.5, null))), ring(31, 80, 12)),
  /** tredje part: on the left a woman at a laptop, on the right a shop on the web (a small page with a cart), joined by a straight line; above them a third, ringed man gets copies of small documents along dashed orange arrows from the page. */
  'webb.tredje-part': all(bg(), ground, person(22, C.orange, { hairStyle: 'long', h: 0.8 }), laptop(44, 108, 0.42), mini(96, 88, 1, GREEN), line('M54 92 L82 92', C.dark, 2),
    at(96, 92, 0.6, path('M-8 -4 L8 -4 L6 4 L-6 4 Z', C.white, C.ink, 1.4), circle(-4, 7, 1.6, C.ink, null), circle(4, 7, 1.6, C.ink, null)),
    g('translate(0 -50)', person(60, C.purple, { h: 0.5 })), ring(60, 32, 18), carr(88, 70, 84, 40, 72, 34, HL, 2, '3 2'), docIcon(82, 52, 0.55), docIcon(46, 52, 0.55), carr(32, 62, 36, 40, 48, 34, HL, 2, '3 2')),
  /** personanpassad: two people with screens: on the left a grey person whose screen shows mixed ads (a shirt, a cup, a ball); on the right a coloured woman thinking of a shoe, and her screen shows only shoe ads; the right screen is ringed. */
  'webb.personanpassad': all(bg(), ground, greyed(person(18, C.green, { h: 0.7 }), rect(32, 46, 26, 30, SCR, 2, C.ink, 1.2), rect(36, 50, 8, 8, '#7ab0e8', 1, null), circle(51, 54, 4, C.white, C.ink, 1), circle(40, 68, 4, '#e07a3a', C.ink, 1), rect(48, 64, 8, 8, '#7a5a8a', 1, null)),
    person(76, C.orange, { hairStyle: 'long', h: 0.7 }), path('M70 22 C62 22 62 10 72 10 L94 10 C104 10 104 22 94 22 L84 22 L80 28 L79 22 Z', C.white, C.ink, 1.2), path('M74 19 L74 14 L80 14 C82 17 86 17 90 18 C92 19 92 20 91 20 L74 20 Z', BLUE, C.ink, 0.8),
    rect(90, 46, 26, 30, SCR, 2, C.ink, 1.4), ...[[96, 54], [109, 54], [96, 68], [109, 68]].map(([x, y]) => path(`M${x! - 4} ${y! + 2} L${x! - 4} ${y! - 2} L${x! - 1} ${y! - 2} C${x!} ${y!} ${x! + 2} ${y!} ${x! + 4} ${y! + 1} L${x! + 4} ${y! + 2} Z`, BLUE, C.ink, 0.6)), frame(87, 43, 32, 36, 4)),
  /** cache: the same page is opened twice. Top (1, grey): the browser fetches it from a far server along a long dashed road with an hourglass. Bottom (2, coloured): the browser takes it at once from a small box of saved page pieces right next to it, along a short orange arrow with a yellow lightning bolt; the small box and the short way are ringed. */
  'webb.cache': all(bg(), num(9, 22, '1', 9, C.grey, 900), greyed(win(14, 8, 46, 36, { inner: all(rect(18, 32, 38, 4, BLUE, 1, null), bars(18, 39, 30, 1)) }), rack(104, 26, 0.3), line('M96 26 L62 26', C.grey, 2, '4 3'), head(62, 26, Math.PI, C.grey, 0.8),
    path('M75 18 L85 18 L80 26 L85 34 L75 34 L80 26 Z', '#e8d4a8', C.ink, 1.2)), line('M4 54 L116 54', C.grey2, 1.2, '3 3'),
    num(9, 72, '2', 9, C.ink, 900), win(14, 60, 46, 36, { inner: all(rect(18, 84, 38, 4, BLUE, 1, null), bars(18, 91, 30, 1)) }), rect(72, 70, 26, 18, '#c8a070', 2, C.ink, 1.4), rect(75, 73, 20, 12, '#e8d4a8', 1, C.ink, 0.8), pic(76, 75, 8, 7), rect(86, 75, 8, 7, BLUE, 1, null),
    arr(70, 79, 62, 79, HL, 3), path('M68 60 L62 68 L66 68 L63 75 L71 65 L67 65 Z', YEL, C.ink, 0.8), greyed(rack(108, 80, 0.3)), ring(80, 80, 20)),
  /** rensa (i datorn): a settings panel with three rows (a clock list, a biscuit, picture pieces); an orange arrow sweeps them into a grey trash can; the panel behind is now clean, with sparkles. */
  'webb.rensa.4': all(bg(), rect(8, 14, 70, 90, SCR, 3, C.ink, 1.6), rect(8, 14, 70, 9, CHROME, 3, null),
    greyed(clockIcon(20, 36, 5), bars(30, 36, 40, 1), biscuit(20, 56, 5), bars(30, 56, 40, 1), pic(15, 70, 10, 8), bars(30, 74, 40, 1)), line('M16 92 L70 92', C.grey2, 1),
    carr(70, 44, 96, 48, 98, 70, HL, 3), trash(98, 92, 1.3), ...[[86, 66], [96, 62]].map(([x, y]) => biscuit(x!, y!, 3.4)),
    path('M60 96 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z', YEL, null)),

  // ── 3736 Domäner och servrar ─────────────────────────────────────────
  /** server: a tall dark machine with drawers and small coloured lights on the left; lines go out from it to a laptop, a phone and a tablet on the right, each showing a small page; the machine is ringed. */
  'webb.server': all(bg(), ground, rack(28, 66, 1), ...[[90, 30], [96, 64], [88, 96]].map(([x, y]) => arr(42, 66, x! - 18, y!, BLUE, 1.6)), laptop(92, 40, 0.42, page(-24, -34, 48, 28)), phone(98, 66, 0.5, page(-10, -17, 20, 32)), rect(76, 86, 26, 20, C.dark, 2, C.ink, 1.2), rect(78, 88, 22, 16, SCR, 1, null), oval(28, 66, 20, 46)),
  /** datacenter: a long low building in a snowy landscape, cut open so that rows and rows of dark server machines show inside; big fans on the roof; a tiny person by the door; the building is framed. */
  'webb.datacenter': all(bg('#dceaf5'), rect(4, 92, 112, 20, C.white, 0, null), ...[[14, 20], [40, 12], [96, 16], [78, 26]].map(([x, y]) => circle(x!, y!, 1.4, C.white, null)),
    rect(10, 46, 100, 48, '#d8dde2', 2, C.ink, 1.8), rect(16, 52, 88, 36, '#2b2d35', 1, C.ink, 1), ...range(8).map((i) => all(rect(19 + i * 11, 55, 8, 30, '#4a4e5a', 1, null), ...range(4).map((j) => circle(25 + i * 11, 59 + j * 7, 0.9, j % 2 ? '#7ee07e' : '#7ec8ff', null)))),
    ...[30, 60, 90].map((x) => all(rect(x - 9, 38, 18, 8, '#9aa3ad', 1, C.ink, 1.2), circle(x, 42, 3, '#6a7380', C.ink, 0.8), line(`M${x - 2.6} 42 L${x + 2.6} 42 M${x} 39.4 L${x} 44.6`, '#c9ced4', 0.8))),
    person(102, C.orange, { h: 0.16 }), frame(6, 34, 108, 64, 4)),
  /** domän: an address strip; the name part in the middle (grey bars with the ending .se) is orange and framed, the beginning and the part after the slash are grey; below, a house with a name sign that has the same orange bars. */
  'webb.domän': all(bg(), greyed(addrStrip(4, 24, [['w', 10], ['s', 4], ['s', 4]], () => false, 16)), addrStrip(34, 24, [['w', 22], ['d', 3], ['t', 10]], () => true, 16, 'se'), greyed(addrStrip(84, 24, [['s', 5], ['w', 18]], () => false, 16)), frame(32, 20, 50, 24, 8),
    rect(30, 70, 60, 40, '#f2e2c4', 1, C.ink, 1.6), path('M24 70 L60 50 L96 70 Z', '#c84a3a', C.ink, 1.6), rect(54, 86, 12, 24, '#a0673d', 1, C.ink, 1.2), rect(36, 76, 14, 10, '#bfe3f5', 1, C.ink, 1), rect(70, 76, 14, 10, '#bfe3f5', 1, C.ink, 1),
    rect(40, 56, 40, 10, C.white, 2, C.ink, 1.2), line('M44 61 L64 61', HL, 3), circle(67, 63, 0.9, HL, null), line('M70 61 L76 61', HL, 3), carr(58, 46, 54, 50, 56, 54, HL, 1.6, '2 2')),
  /** webbhotell: a tall hotel building whose windows are small web pages in different colours; at the entrance a woman gives a coin to the hotel; one window page is hers and is ringed; the building is framed. */
  'webb.webbhotell': all(bg(), ground, rect(36, 14, 60, 98, '#e8d3b0', 2, C.ink, 1.8), rect(32, 10, 68, 8, '#a0673d', 2, C.ink, 1.4),
    ...range(9).map((i) => { const x = 42 + (i % 3) * 18, y = 24 + Math.floor(i / 3) * 22; return mini(x + 6, y + 8, 0.45, [BLUE, GREEN, '#7a5a8a', RED, '#e07a3a', BLUE, GREEN, '#7a5a8a', BLUE][i]!); }),
    rect(58, 92, 16, 20, '#7a5030', 1, C.ink, 1.2), person(18, C.orange, { hairStyle: 'long', h: 0.7 }), coin(32, 82, 4), ring(84, 54, 10)),
  /** hänglås: a big golden padlock in the middle; below, an address bar with the same small padlock at its start, which is ringed. */
  'webb.hänglås': all(bg(), padlock(60, 46, 2.4), rect(10, 86, 100, 16, C.white, 8, C.ink, 1.6), padlock(22, 94, 0.5, '#3a9a5a'), line('M32 94 L84 94', BAR, 3), ring(22, 93, 9)),

  // ── 3737 Felmeddelanden på webben ────────────────────────────────────
  /** felmeddelande: over a grey web page a white box pops up with a red round sign with an exclamation mark, a small grey 404, two lines of grey text and a blue button; the whole box is framed. */
  'webb.felmeddelande': errBox(false),
  /** felkod: the same error box over a grey page, but here only the big red digits 404 are coloured and ringed, the text is grey. */
  'webb.felkod': errBox(true),
  /** ligga nere: a server machine with every light red, switched off, with a big red cross; next to it a big screen that is completely black; below, three people's phones are black too, each with a red cross: nobody gets in at all; the dead server and black screen are framed. */
  'webb.ligga-nere': all(bg(), rack(24, 42, 0.62, true), no(24, 14, 8), rect(46, 14, 66, 48, C.dark, 3, C.ink, 1.8), rect(49, 17, 60, 42, '#111216', 1, null), path('M77 62 L83 62 L86 70 L74 70 Z', '#9aa3ad', C.ink, 1.2),
    line('M34 42 L46 38', RED, 2, '3 3'), frame(6, 8, 108, 66, 5),
    ...[24, 60, 96].map((x) => all(phone(x, 94, 0.55, rect(-11.5, -19, 23, 37, '#111216', 1, null)), no(x + 9, 82, 5)))),
  /** driftstörning: one server at the top with a yellow warning triangle; uneven, broken zigzag lines go down from it to four phones; every phone shows the page half loaded and the same small red error box at the same time; the server with the triangle is ringed. */
  'webb.driftstörning': all(bg(), rack(56, 32, 0.45), warnIcon(76, 22, 1), ring(62, 30, 22),
    ...[18, 46, 74, 102].map((x, i) => all(line(`M56 52 L${f1((56 + x) / 2 + (i % 2 ? 4 : -4))} 70 L${x} 76`, i % 2 ? RED : '#e8a03a', 1.6, i % 2 ? '2 3' : '5 2'),
      phone(x, 94, 0.55, all(page(-11.5, -19, 23, 14), rect(-9, 0, 18, 12, C.white, 2, C.ink, 0.8), bang(-4, 6, 3.4), line('M0 4 L6 4 M0 8 L5 8', BAR, 1.2)))))),
  /** åtkomst: a door with a lock and a card reader with a green light; a coloured person with a key card walks in along a green arrow and a tick; a grey person stands outside with a red cross; the open way in is ringed. */
  'webb.åtkomst': all(bg(), ground, rect(50, 30, 32, 82, '#e8e2d4', 1, C.ink, 1.6), path('M54 34 L78 34 L78 112 L54 112 Z', '#fff6d8', C.ink, 1.4), path('M54 34 L64 38 L64 108 L54 112 Z', '#a0673d', C.ink, 1.4),
    rect(86, 56, 10, 16, C.dark, 2, C.ink, 1.2), circle(91, 61, 2, '#7ee07e', null), padlock(91, 80, 0.5, '#3a9a5a'),
    person(70, C.orange, { h: 0.62 }), rect(76, 72, 6, 4, C.white, 1, C.ink, 0.8), arr(40, 100, 60, 100, GREEN, 3), ok(70, 22, 6),
    greyed(person(18, C.green, { h: 0.62 })), no(18, 54, 6), oval(68, 72, 16, 40)),
  /** formulär: a web page with a blue top, four labelled fields (two filled in) and a green send button with a paper plane; the whole form is framed. */
  'webb.formulär': all(bg(), formPage(), frame(12, 8, 96, 104, 6)),
  /** fält (på skärmen): the same form, but grey; only one empty field in the middle is white with a text cursor in it and is ringed. */
  'webb.fält.2': all(bg(), greyed(formPage()), rect(24, 67, 72, 8, C.white, 2, C.ink, 1.4), ibeam(29, 68, 6), oval(60, 71, 42, 10)),
};
