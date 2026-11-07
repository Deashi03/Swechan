/**
 * Word illustrations (0.6 pilot: Vardagskläder). Keyed by image id as used in
 * src/content/data/images/wordImages.json. Each value is the drawing body; the
 * renderer adds the background. Distinguishing features are exaggerated on
 * purpose (kofta = buttons, munkjacka = zip + hood, polotröja = high collar …).
 */
import { BODY_MOTIFS } from './bodyMotifs';
import { FAMILY_MOTIFS } from './family';
import { CELEBRATION_MOTIFS } from './celebrations';
import { C, all, arrow, button, circle, dress, ellipse, g, hand, heart, jacket, line, mirror, path, person, place, rect, skirt, sock, sparkle, star, top, trousers, type Svg } from './kit';

const shirt = (color: string = C.white, trim?: string) => top({ color, collar: 'shirt', opening: 'buttons', cuffs: true, pocket: 'chest', trim });
const highlight = (d: string): Svg => line(d, C.accent, 4.5);
const tag = (cx: number, cy: number, text: string) => rect(cx - 13, cy - 7, 26, 14, C.white, 4, C.ink, 1.4) + `<text x="${cx}" y="${cy + 4}" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" fill="${C.ink}">${text}</text>`;
const moon = (cx: number, cy: number, r: number) => path(`M${cx} ${cy - r} A${r} ${r} 0 1 0 ${cx} ${cy + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${cx} ${cy - r} Z`, C.yellow, C.ink, 1.2);
const mirrorFrame = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.sky, 6, C.ink, 2), line(`M${x + 6} ${y + 10} L${x + 14} ${y + 4} M${x + 6} ${y + 20} L${x + 22} ${y + 6}`, C.white, 2));

export const WORD_MOTIFS: Record<string, Svg> = {
  // ── Tröjor och skjortor ──────────────────────────────────────
  skjorta: shirt(C.white, C.sky),
  ärm: all(shirt(C.sky), highlight('M38 28 L16 88 L30 92 L44 52 Z')),
  krage: all(shirt(C.sky), highlight('M46 22 L60 36 L50 44 L42 26 Z M74 22 L60 36 L70 44 L78 26 Z')),
  blus: top({ color: C.rose, collar: 'round', opening: 'buttons', sleeves: 'long', cuffs: true, trim: C.white }),
  't-shirt': top({ color: C.green, sleeves: 'short', collar: 'crew' }),
  kofta: top({ color: C.beige, collar: 'v', opening: 'buttons', ribHem: true, cuffs: true, trim: C.tan, pocket: 'none' }),
  huvtröja: top({ color: C.grey, hood: true, pocket: 'kangaroo', ribHem: true, cuffs: true, trim: C.grey2 }),
  polotröja: top({ color: C.navy, collar: 'polo', cuffs: true }),
  topp: top({ color: C.pink, straps: true }),
  kortärmad: all(top({ color: C.sky, sleeves: 'short', collar: 'shirt', opening: 'buttons', trim: C.white }), highlight('M38 28 L20 52 L34 60 L42 46 Z')),
  långärmad: all(top({ color: C.sky, sleeves: 'long', collar: 'crew', cuffs: true }), highlight('M38 28 L16 88 L30 92 L44 52 Z')),
  knäppa: all(rect(14, 20, 50, 84, C.white, 4), rect(56, 20, 50, 84, C.sky, 4), line('M60 24 L60 100', C.ink, 1.4), ellipse(84, 44, 3, 9, C.ink, null), ellipse(84, 78, 3, 9, C.ink, null), button(36, 44, 7, C.white), circle(34, 42, 1.2, C.ink, null), circle(38, 46, 1.2, C.ink, null), button(84, 78, 7, C.white), hand(26, 60, 1.1, -10), arrow(46, 44, 76, 44)),
  'knäppa upp': all(place(10, 0, 0.9, all(top({ color: C.white, collar: 'shirt', trim: C.sky }), path('M56 40 L60 40 L58 102 L54 102 Z', C.white, null))), line('M60 30 L56 40 L54 100', C.ink, 1.6), line('M60 30 L64 40 L66 100', C.ink, 1.6), arrow(56, 70, 34, 70), arrow(66, 70, 88, 70)),
  'kavla upp': all(top({ color: C.sky, sleeves: 'long', collar: 'shirt', opening: 'buttons', rolled: true, trim: C.white }), arrow(12, 92, 20, 68), mirror(arrow(12, 92, 20, 68))),
  'ta på sig': all(person({ x: 20, s: 0.7, topColor: C.green }), g('translate(70 10) scale(0.38)', top({ color: C.red, collar: 'crew' })), arrow(96, 58, 70, 40)),
  'ta av sig': all(person({ x: 20, s: 0.7, topColor: C.green, armsUp: true }), g('translate(70 40) scale(0.38)', top({ color: C.red, collar: 'crew' })), arrow(60, 24, 86, 46)),
  // ── Byxor och kjolar ─────────────────────────────────────────
  'ha på sig': all(person({ x: 22, s: 0.8, topColor: C.red, bottomColor: C.denim }), star(98, 24, 8)),
  jeans: trousers({ color: C.denim, fly: true, pockets: true, stitch: C.orange, cuffs: C.denim2 }),
  långbyxor: trousers({ color: C.tan, fly: true, pockets: true }),
  shorts: trousers({ color: C.orange, length: 'short', fly: true, pockets: true }),
  kjol: skirt({ color: C.purple, length: 'knee', pleats: true }),
  leggings: trousers({ color: C.black, fit: 'tight', elastic: false }),
  minikjol: skirt({ color: C.red, length: 'mini' }),
  långkjol: skirt({ color: C.green, length: 'long', pleats: true }),
  knälång: all(skirt({ color: C.navy, length: 'knee' }), highlight('M30 82 L36 82 M84 82 L90 82'), arrow(104, 30, 104, 78), line('M98 80 L110 80', C.accent, 3)),
  byxben: all(trousers({ color: C.tan, fly: true }), highlight('M60 42 L64 108 L86 108 L82 30')),
  ficka: all(trousers({ color: C.denim, fly: true, pockets: true }), highlight('M40 22 Q48 30 50 22'), hand(26, 30, 1, 30)),
  bakficka: all(trousers({ color: C.denim }), path('M42 30 L54 30 L54 44 L48 47 L42 44 Z M66 30 L78 30 L78 44 L72 47 L66 44 Z', C.denim2, C.ink, 1.6), highlight('M42 30 L54 30 L54 44 L48 47 L42 44 Z')),
  gylf: all(trousers({ color: C.navy, fly: true, pockets: true }), highlight('M60 21 L60 40')),
  skoluniform: person({ x: 0, s: 1, topColor: C.white, bottomColor: C.navy, skirt: true, jacket: C.navy, tie: C.red, hair: 'long' }),
  'stoppa in': all(top({ color: C.white, collar: 'shirt', opening: 'buttons', trim: C.sky }), place(0, 48, 1, trousers({ color: C.navy, fly: false })), arrow(28, 70, 40, 92), mirror(arrow(28, 70, 40, 92))),
  // ── Klänningar och kostymer ──────────────────────────────────
  klänning: dress({ color: C.red, length: 'knee', sleeves: 'short' }),
  sommarklänning: all(dress({ color: C.yellow, length: 'knee', sleeves: 'none', pattern: all(circle(54, 60, 2.4, C.white, null), circle(66, 70, 2.4, C.white, null), circle(58, 78, 2.4, C.white, null), circle(70, 56, 2.4, C.white, null)) }), circle(100, 18, 9, C.yellow, C.orange, 2), line('M100 4 L100 0 M112 18 L116 18 M110 8 L113 5', C.orange, 2)),
  långklänning: dress({ color: C.purple, length: 'long', sleeves: 'none', neck: 'v', belt: C.gold }),
  brud: all(path('M60 2 C40 10 34 60 32 92 L46 90 C46 60 50 30 52 14 L68 14 C70 30 74 60 74 90 L88 92 C86 60 80 10 60 2 Z', C.white, C.grey, 1.2), person({ x: 0, s: 1, dress: C.white, hair: 'bun', extra: all(circle(60, 70, 6, C.pink, C.ink, 1.4), circle(55, 72, 4, C.rose, C.ink, 1.2)) })),
  brudgum: person({ x: 0, s: 1, topColor: C.white, bottomColor: C.black, jacket: C.black, lapels: C.dark, tie: C.white, extra: circle(68, 42, 3, C.pink, C.ink, 1.2) }),
  brudklänning: all(dress({ color: C.white, length: 'long', sleeves: 'none', belt: C.silver }), path('M60 0 C44 6 40 40 40 70 L46 70 C46 40 52 14 60 8 C68 14 74 40 74 70 L80 70 C80 40 76 6 60 0 Z', 'rgba(255,255,255,.7)', C.grey, 1)),
  kostym: all(jacket({ color: C.dark, lapels: C.black, closing: 'buttons', pockets: true }), path('M56 22 L64 22 L60 50 Z', C.white, C.ink, 1.2), path('M58 24 L62 24 L63 44 L60 48 L57 44 Z', C.red, C.ink, 1.2), place(84, 70, 0.3, trousers({ color: C.dark }))),
  kavaj: jacket({ color: C.navy, lapels: C.navy, closing: 'buttons', pockets: true, trim: C.gold }),
  blazer: all(jacket({ color: C.denim2, lapels: C.denim2, closing: 'buttons', pockets: true, trim: C.gold }), place(42, 76, 0.38, trousers({ color: C.denim, fly: true }))),
  dräkt: all(jacket({ color: C.grey, lapels: C.grey2, closing: 'buttons' }), place(36, 78, 0.4, skirt({ color: C.grey, length: 'knee', legs: false }))),
  slips: all(path('M52 6 L68 6 L64 18 L56 18 Z', C.red), path('M56 18 L64 18 L72 92 L60 108 L48 92 Z', C.red), line('M54 34 L66 26 M52 54 L68 44 M50 74 L70 62 M50 92 L70 80', C.white, 2.4)),
  knyta: all(path('M48 16 L72 16 L70 24 L50 24 Z', C.white), path('M54 22 L66 22 L63 34 L57 34 Z', C.red), path('M57 34 L63 34 L70 92 L60 104 L50 92 Z', C.red), path('M66 28 C90 20 92 52 70 50', 'none', C.accent, 0), line('M70 30 C92 24 92 52 70 50', C.accent, 3.4), arrow(76, 50, 68, 50), line('M50 30 C28 24 28 52 50 50', C.accent, 3.4)),
  smoking: all(jacket({ color: C.black, lapels: C.dark, closing: 'buttons', trim: C.black }), path('M52 22 L60 26 L68 22 L68 32 L60 28 L52 32 Z', C.black, C.ink, 1.4), path('M56 26 L64 26 L60 48 Z', C.white, null)),
  fluga: all(path('M58 54 L20 34 C14 50 14 70 20 86 L58 66 Z', C.black), path('M62 54 L100 34 C106 50 106 70 100 86 L62 66 Z', C.black), rect(54, 50, 12, 20, C.dark, 4)),
  folkdräkt: person({ x: 0, s: 1, topColor: C.white, bottomColor: C.yellow, skirt: true, hair: 'long', extra: all(path('M46 50 L74 50 L74 66 L46 66 Z', C.red, C.ink, 1.6), path('M50 66 L70 66 L72 88 L48 88 Z', C.navy, C.ink, 1.4), line('M48 72 L72 72 M48 78 L72 78', C.red, 2)) }),
  'klä upp sig': all(person({ x: 10, s: 0.9, topColor: C.white, bottomColor: C.black, jacket: C.navy, lapels: C.navy, tie: C.red }), sparkle(100, 20, 8), sparkle(92, 40, 5), mirrorFrame(86, 56, 26, 52)),
  // ── Underkläder och strumpor ─────────────────────────────────
  par: all(sock({ color: C.red, length: 'ankle', x: -18, s: 0.9, heel: C.white }), sock({ color: C.red, length: 'ankle', x: 22, y: 6, s: 0.9, heel: C.white }), tag(98, 16, '× 2')),
  underkläder: all(place(4, 6, 0.55, path('M34 30 L86 30 L84 58 Q72 60 60 80 Q48 60 36 58 Z', C.sky)), place(56, 40, 0.55, path('M30 24 L90 24 L92 66 L64 70 L60 56 L56 70 L28 66 Z', C.green)), place(18, 64, 0.5, all(path('M24 40 Q40 20 56 40 Q48 56 36 56 Q26 54 24 40 Z M64 40 Q80 20 96 40 Q94 54 84 56 Q72 56 64 40 Z', C.pink), line('M56 40 L64 40 M24 40 L18 20 M96 40 L102 20', C.ink, 2)))),
  trosor: path('M26 32 L94 32 L92 54 Q76 58 66 90 L54 90 Q44 58 28 54 Z', C.pink),
  kalsonger: all(path('M28 24 L92 24 L96 84 L66 88 L60 58 L54 88 L24 84 Z', C.navy), path('M28 24 L92 24 L92.4 34 L27.6 34 Z', C.white), line('M60 34 L60 54', C.white, 1.6)),
  bh: all(line('M30 42 L22 12 M90 42 L98 12', C.ink, 2.4), path('M22 44 Q40 18 58 44 Q50 66 38 66 Q24 64 22 44 Z M62 44 Q80 18 98 44 Q96 64 82 66 Q70 66 62 44 Z', C.lilac), line('M58 44 L62 44 M22 46 L8 50 M98 46 L112 50', C.ink, 2.4)),
  strumpa: sock({ color: C.green, length: 'ankle', heel: C.white }),
  udda: all(sock({ color: C.red, length: 'ankle', x: -20, s: 0.9 }), sock({ color: C.sky, length: 'ankle', x: 24, y: 8, s: 0.9, stripe: C.yellow }), `<text x="60" y="30" font-size="22" font-weight="800" font-family="system-ui, sans-serif" text-anchor="middle" fill="${C.accent}">≠</text>`),
  knästrumpa: sock({ color: C.white, length: 'knee', stripe: C.navy }),
  raggsocka: sock({ color: C.grey2, length: 'ankle', thick: true, stripe: C.red }),
  strumpbyxor: all(trousers({ color: C.dark, fit: 'tight' }), path('M44 104 L56 104 L56 112 L40 112 Z M64 104 L76 104 L80 112 L64 112 Z', C.dark)),
  pyjamas: all(place(14, 0, 0.62, top({ color: C.sky, collar: 'shirt', opening: 'buttons', trim: C.white })), place(44, 44, 0.62, trousers({ color: C.sky })), moon(24, 92, 8), star(100, 18, 6), star(30, 72, 4)),
  nattlinne: all(dress({ color: C.lilac, length: 'long', sleeves: 'short', neck: 'round' }), moon(100, 22, 10), star(20, 24, 6)),
  'klä på sig': all(person({ x: 0, s: 1, topColor: C.red, bottomColor: C.denim }), arrow(12, 100, 12, 30), mirror(arrow(12, 100, 12, 30))),
  'klä av sig': all(person({ x: 0, s: 1, topColor: C.white, bottomColor: C.white, shoes: C.skin }), g('translate(86 70) scale(0.28)', top({ color: C.red })), g('translate(4 78) scale(0.26)', trousers({ color: C.denim })), arrow(76, 50, 98, 70), mirror(arrow(76, 50, 98, 74))),
  'byta om': all(place(4, 14, 0.42, top({ color: C.white, collar: 'shirt', opening: 'buttons', trim: C.sky })), place(70, 14, 0.42, top({ color: C.green, sleeves: 'short' })), arrow(52, 40, 70, 40), arrow(70, 52, 52, 52), place(30, 64, 0.45, person({ topColor: C.green, bottomColor: C.navy }))),
  // ── Jackor och ytterplagg ────────────────────────────────────
  ytterkläder: all(place(2, 6, 0.55, jacket({ color: C.red, hood: true })), place(60, 4, 0.45, path('M30 70 C30 30 90 30 90 70 Z', C.navy) + rect(28, 66, 64, 14, C.navy, 4)), place(62, 64, 0.45, all(path('M30 30 L50 30 L50 70 C50 84 36 90 26 82 C20 76 24 64 30 60 Z', C.yellow), path('M90 30 L70 30 L70 70 C70 84 84 90 94 82 C100 76 96 64 90 60 Z', C.yellow)))),
  kappa: jacket({ color: C.tan, length: 'long', lapels: C.tan, closing: 'buttons', pockets: true, trim: C.dark }),
  vinterjacka: all(jacket({ color: C.navy, hood: true, style: 'puffer', pockets: true }), path('M40 28 C38 10 82 10 80 28', 'none', C.white, 4)),
  täckjacka: jacket({ color: C.green, style: 'puffer', collar: C.green, pockets: true }),
  dunjacka: all(jacket({ color: C.red, style: 'down', collar: C.red }), path('M102 18 C96 10 100 2 106 6 C108 12 106 16 102 18 Z M110 32 C104 26 108 18 114 22 C116 28 114 32 110 32 Z', C.white, C.ink, 1.2)),
  vårjacka: all(jacket({ color: C.mint, collar: C.mint, pockets: true, closing: 'zip' }), path('M98 20 Q104 10 110 20 Q104 26 98 20 Z', C.pink, C.ink, 1.2), path('M8 30 Q14 20 20 30 Q14 36 8 30 Z', C.yellow, C.ink, 1.2)),
  regnjacka: jacket({ color: C.yellow, hood: true, style: 'rain', pockets: true }),
  regnbyxor: all(trousers({ color: C.yellow, elastic: true }), path('M100 10 Q97 18 100 21 Q103 18 100 10 Z M16 20 Q13 28 16 31 Q19 28 16 20 Z', C.sky, C.ink, 1)),
  regnställ: all(place(2, 4, 0.58, jacket({ color: C.yellow, hood: true })), place(50, 44, 0.58, trousers({ color: C.yellow, elastic: true })), path('M104 8 Q101 16 104 19 Q107 16 104 8 Z M90 22 Q87 30 90 33 Q93 30 90 22 Z', C.sky, C.ink, 1)),
  galonbyxor: all(trousers({ color: C.red, elastic: false }), path('M44 14 L40 0 M76 14 L80 0', 'none', C.red, 5), line('M44 14 L40 0 M76 14 L80 0', C.ink, 1), path('M64 112 C70 104 86 104 92 112 Z', C.sky, C.ink, 1.4)),
  overall: all(path('M40 30 C34 4 80 4 80 30 Z', C.purple), jacket({ color: C.purple, closing: 'zip' }), path('M34 90 L86 90 L84 112 L64 112 L60 98 L56 112 L36 112 Z', C.purple), circle(60, 22, 9, C.skin, C.ink, 1.6)),
  huva: all(jacket({ color: C.orange, hood: true }), highlight('M40 30 C34 2 86 2 80 30')),
  dragkedja: all(rect(48, 4, 24, 112, C.grey2, 4), line('M60 8 L60 110', C.dark, 3), line('M54 14 L60 14 M60 20 L66 20 M54 26 L60 26 M60 32 L66 32 M54 38 L60 38 M60 44 L66 44 M54 50 L60 50 M60 56 L66 56 M54 62 L60 62 M60 68 L66 68 M54 74 L60 74 M60 80 L66 80 M54 86 L60 86 M60 92 L66 92 M54 98 L60 98 M60 104 L66 104', C.dark, 2.4), rect(53, 40, 14, 20, C.silver, 4), rect(57, 58, 6, 18, C.silver, 3)),
  'dra upp': all(rect(48, 4, 24, 112, C.grey2, 4), line('M60 8 L60 110', C.dark, 3), rect(53, 52, 14, 20, C.silver, 4), hand(78, 60, 1.2, 180), arrow(96, 90, 96, 30)),
  'dra ner': all(rect(48, 4, 24, 112, C.grey2, 4), line('M60 8 L60 110', C.dark, 3), rect(53, 52, 14, 20, C.silver, 4), hand(78, 60, 1.2, 180), arrow(96, 30, 96, 90)),
  // ── Sportiga vardagskläder ───────────────────────────────────
  sportig: all(person({ x: 0, s: 1, topColor: C.orange, bottomColor: C.black, shoes: C.white, hair: 'bun' }), path('M46 34 L74 34 L72 40 L48 40 Z', C.white, null)),
  mjukisbyxor: all(trousers({ color: C.grey2, elastic: true, cuffs: C.grey }), line('M48 56 Q52 60 50 66 M70 50 Q66 56 70 62', C.grey, 1.4)),
  mysbyxor: all(trousers({ color: C.pink, elastic: true }), heart(48, 60, 4, C.white), heart(72, 80, 4, C.white), heart(46, 92, 3, C.white)),
  slappa: all(path('M8 80 L8 58 C8 48 26 48 26 58 L26 70 L94 70 L94 58 C94 48 112 48 112 58 L112 80 Z', C.green), rect(8, 76, 104, 20, C.green, 8), rect(14, 96, 6, 8, C.brown, 1), rect(100, 96, 6, 8, C.brown, 1), path('M30 70 L84 62 L88 70 L32 76 Z', C.grey2), circle(88, 54, 10, C.skin), path('M80 50 C80 40 96 40 96 50 C92 46 84 46 80 50 Z', C.hair), line('M84 58 Q88 60 92 57', C.ink, 1.4), `<text x="100" y="30" font-size="12" font-weight="700" font-family="system-ui, sans-serif" fill="${C.navy}">z z</text>`),
  collegetröja: top({ color: C.green, collar: 'crew', ribHem: true, cuffs: true, trim: C.mint }),
  munkjacka: top({ color: C.red, hood: true, opening: 'zip', pocket: 'kangaroo', ribHem: true, cuffs: true, trim: C.red }),
  träningskläder: all(place(2, 6, 0.55, top({ color: C.orange, sleeves: 'short' })), place(58, 6, 0.55, trousers({ color: C.black, length: 'short', elastic: true })), place(30, 66, 0.4, all(path('M10 60 C10 40 30 30 50 40 L100 50 C112 52 112 72 100 72 L14 72 C8 72 8 64 10 60 Z', C.white), line('M10 66 L108 66', C.ink, 2), line('M40 44 L48 52 M50 42 L56 50', C.ink, 1.6)))),
  träningsbyxor: trousers({ color: C.black, elastic: true, stripe: C.white, fit: 'tight' }),
  träningsoverall: all(place(2, 4, 0.58, jacket({ color: C.navy, collar: C.navy, closing: 'zip', trim: C.white })), place(50, 44, 0.58, trousers({ color: C.navy, elastic: true, stripe: C.white }))),
  sportbh: all(path('M40 14 L50 14 Q60 34 70 14 L80 14 L82 34 Q92 40 92 62 L28 62 Q28 40 38 34 Z', C.purple), path('M28 60 L92 60 L92 74 L28 74 Z', C.black), line('M60 40 L60 60', C.ink, 1), line('M32 64 L88 64 M32 70 L88 70', C.white, 1)),
  cykelbyxor: all(trousers({ color: C.black, length: 'short', fit: 'tight' }), path('M30 62 L56 64 L56 70 L30 68 Z M64 64 L90 62 L90 68 L64 70 Z', C.black), line('M34 30 L32 60 M86 30 L88 60', C.yellow, 3)),
  pannband: all(circle(60, 64, 30, C.skin), path('M30 56 C30 26 90 26 90 56 C84 44 36 44 30 56 Z', C.hair), path('M29 52 Q60 36 91 52 L91 62 Q60 46 29 62 Z', C.red), circle(48, 70, 2.4, C.ink, null), circle(72, 70, 2.4, C.ink, null), line('M52 82 Q60 86 68 82', C.ink, 2)),
  reflex: all(rect(0, 0, 120, 120, C.navy, 18, null), path('M40 60 L56 40 L72 60 L56 80 Z', C.reflex, C.ink, 2), line('M56 40 L56 30', C.ink, 2), line('M84 30 L96 22 M88 50 L104 50 M84 70 L96 78', C.yellow, 3), circle(20, 20, 6, C.yellow, null), line('M26 22 L38 34', C.yellow, 2, '3 3')),
  reflexväst: all(path('M36 14 L50 14 Q60 34 70 14 L84 14 L88 104 L32 104 Z', C.reflex), path('M32 62 L88 62 L88 70 L32 70 Z M32 82 L88 82 L88 90 L32 90 Z', C.silver, C.ink, 1.6), line('M60 34 L60 104', C.ink, 1.6)),
  omklädningsrum: all(rect(6, 10, 108, 70, C.grey2, 4), rect(10, 14, 30, 62, C.sky, 3), rect(45, 14, 30, 62, C.sky, 3), rect(80, 14, 30, 62, C.sky, 3), line('M18 22 L32 22 M18 26 L32 26 M53 22 L67 22 M53 26 L67 26 M88 22 L102 22 M88 26 L102 26', C.ink, 1.4), circle(36, 48, 1.8, C.ink, null), circle(71, 48, 1.8, C.ink, null), circle(106, 48, 1.8, C.ink, null), rect(10, 90, 100, 8, C.tan, 2), rect(16, 98, 5, 14, C.brown, 1), rect(99, 98, 5, 14, C.brown, 1), place(36, 70, 0.22, top({ color: C.orange, sleeves: 'short' }))),
  // ── Att beskriva en outfit ───────────────────────────────────
  'klä sig': all(person({ x: 10, s: 0.92, topColor: C.sky, bottomColor: C.navy }), mirrorFrame(84, 24, 30, 76)),
  outfit: all(place(30, 0, 0.42, top({ color: C.white, collar: 'shirt', opening: 'buttons', trim: C.sky })), place(34, 42, 0.38, trousers({ color: C.denim, fly: true })), place(4, 20, 0.36, jacket({ color: C.tan, lapels: C.tan, closing: 'none' })), place(74, 82, 0.3, path('M10 60 C10 40 30 30 50 40 L100 50 C112 52 112 72 100 72 L14 72 C8 72 8 64 10 60 Z', C.brown)), place(80, 20, 0.32, path('M30 30 L90 30 L84 100 L36 100 Z', C.black) + line('M44 30 C44 10 76 10 76 30', C.ink, 4))),
  klädstil: all(place(-2, 18, 0.46, person({ topColor: C.white, bottomColor: C.black, jacket: C.black, lapels: C.dark, tie: C.dark })), place(37, 18, 0.46, person({ topColor: C.orange, bottomColor: C.grey, hair: 'bun', shoes: C.white })), place(76, 18, 0.46, person({ dress: C.pink, hair: 'long' }))),
  mode: all(line('M60 108 L60 80 M44 112 L76 112', C.ink, 3), path('M44 14 Q60 22 76 14 L82 30 L76 80 L44 80 L38 30 Z', C.beige), line('M60 6 L60 14', C.ink, 3), path('M44 40 L76 40 L80 80 L40 80 Z', C.red), sparkle(96, 26, 8), sparkle(22, 40, 6), sparkle(100, 60, 5)),
  trendig: all(person({ x: -12, s: 0.95, topColor: C.lilac, bottomColor: C.black, jacket: C.dark, extra: rect(48, 18, 24, 6, C.black, 3) }), arrow(84, 96, 112, 46), star(100, 24, 7)),
  omodern: all(place(18, 12, 0.75, top({ color: C.orange, collar: 'shirt', opening: 'buttons', trim: C.brown, pattern: all(line('M34 50 L86 50 M34 66 L86 66 M34 82 L86 82', C.brown, 2.5)) })), rect(6, 6, 30, 18, C.white, 3, C.ink, 1.4), `<text x="21" y="19" font-size="10" font-weight="700" font-family="system-ui, sans-serif" text-anchor="middle" fill="${C.ink}">1975</text>`),
  tidlös: all(place(0, 8, 0.7, shirt(C.white, C.white)), path('M86 20 L110 20 L98 44 L110 68 L86 68 L98 44 Z', C.sky), path('M90 24 L106 24 L98 38 Z M92 64 L104 64 L98 54 Z', C.yellow, null), line('M84 18 L112 18 M84 70 L112 70', C.ink, 3)),
  klädsam: all(person({ x: -14, s: 0.9, dress: C.green, hair: 'long' }), mirrorFrame(70, 12, 40, 84), place(78, 22, 0.5, person({ dress: C.green, hair: 'long' })), heart(98, 104, 7)),
  välklädd: all(person({ x: 0, s: 1, topColor: C.white, bottomColor: C.navy, jacket: C.navy, lapels: C.navy, tie: C.red, shoes: C.brown }), sparkle(20, 24, 6), sparkle(100, 40, 5)),
  stilig: person({ x: 0, s: 1, topColor: C.white, bottomColor: C.grey, jacket: C.grey, lapels: C.dark, tie: C.navy, shoes: C.black, extra: all(path('M44 12 L76 12 L74 0 L46 0 Z', C.dark), path('M38 14 L82 14 L82 17 L38 17 Z', C.dark)) }),
  cool: person({ x: 0, s: 1, topColor: C.black, bottomColor: C.denim, jacket: C.dark, extra: all(path('M48 19 L58 19 L57 25 L49 25 Z M62 19 L72 19 L71 25 L63 25 Z', C.black, C.ink, 1.4), line('M58 21 L62 21', C.ink, 1.6)) }),
  originell: all(place(0, 20, 0.5, person({ topColor: C.grey2, bottomColor: C.grey })), place(60, 20, 0.5, person({ topColor: C.grey2, bottomColor: C.grey })), place(30, 4, 0.6, person({ topColor: C.orange, bottomColor: C.purple, hair: 'bun', hairColor: C.pink, extra: star(60, 50, 6, C.yellow) })), place(0, 64, 0.5, person({ topColor: C.grey2, bottomColor: C.grey })), place(60, 64, 0.5, person({ topColor: C.grey2, bottomColor: C.grey }))),
  modemedveten: all(person({ x: -16, s: 0.9, topColor: C.lilac, bottomColor: C.black, hair: 'long' }), rect(64, 40, 44, 56, C.white, 3, C.ink, 2), rect(70, 48, 32, 26, C.pink, 2, C.ink, 1.4), place(76, 46, 0.25, dress({ color: C.red, length: 'knee' })), line('M70 82 L102 82 M70 88 L94 88', C.ink, 1.6)),
  favoritplagg: all(place(4, 10, 0.8, top({ color: C.beige, collar: 'v', opening: 'buttons', ribHem: true, cuffs: true, trim: C.tan })), heart(96, 26, 12)),
  uttrycka: all(person({ x: -18, s: 0.95, topColor: C.orange, bottomColor: C.purple, hair: 'bun' }), path('M70 14 L114 14 L114 50 L86 50 L76 60 L78 50 L70 50 Z', C.white, C.ink, 2), heart(84, 32, 6), star(102, 32, 7)),
  // ── Kroppen & sinnena (0.13), see bodyMotifs.ts ──────────────
  ...BODY_MOTIFS,
  // ── Relationer & familj (0.14), see family.ts ─────────────────
  ...FAMILY_MOTIFS,
  ...CELEBRATION_MOTIFS,
};

/** Exported for tests and the review sheet: every motif id. */
export const WORD_MOTIF_IDS = Object.keys(WORD_MOTIFS);
