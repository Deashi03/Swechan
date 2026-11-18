#!/usr/bin/env node
/**
 * Kvalitetsmätning och spärr (kvalitetsplanen, etapp A2 och A7).
 *
 *   npm run audit:content                 skriv ut måtten och kontraktsfel
 *   npm run audit:content -- --check      fallera om ett mått blivit sämre än quality/metrics.json
 *                                         eller om en modul bryter mot kontraktet (används i CI)
 *   npm run audit:content -- --update     skriv in förbättrade mått som ny lägstanivå
 *   npm run audit:content -- --update --allow-worse "<mått>: <skäl>"
 *                                         tillåt ett sämre mått (skälet sparas i metrics.json)
 *   npm run audit:content -- --report     skriv quality/report.md (mått per ämnesgrupp)
 *   npm run audit:content -- --backlog    skriv arbetsköer till quality/backlog/*.json
 *   npm run audit:content -- --module <id> …   visa kontraktsfel för enstaka moduler
 *
 * Två omfång:
 *  - "Befintligt" = moduler i quality/legacy-modules.json som inte har standard 2. Måtten räknas här
 *    och får aldrig bli sämre (spärren).
 *  - "Kontrakt" = alla andra moduler (nya moduler och befintliga som lyfts till standard: 2). De
 *    kontrolleras strikt mot quality/contract.json. En modul som inte står i legacy-listan måste ha
 *    standard: 2.
 * Ett ord (en betydelse) hör till den första modul i modulindexets ordning där det är modulord.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.SWECHAN_REPO ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const D = path.join(root, 'src/content/data');
const Q = path.join(root, 'quality');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const opt = (p, d) => (fs.existsSync(p) ? readJson(p) : d);

// ---------------------------------------------------------------- data
export function loadContent() {
  const index = readJson(path.join(D, 'moduleIndex.json')).modules;
  const modules = index.map((m) => ({ ...readJson(path.join(D, 'modules', m.bodyFile)), bodyFile: m.bodyFile }));
  const entries = [];
  const senses = new Map(); // senseId -> {entry, sense}
  for (const dir of ['dictionary']) {
    for (const f of fs.readdirSync(path.join(D, dir)).filter((x) => x.endsWith('.json')).sort()) {
      const d = readJson(path.join(D, dir, f));
      for (const e of d.entries ?? []) {
        e._file = `${dir}/${f}`;
        entries.push(e);
        for (const s of e.senses) senses.set(s.id, { entry: e, sense: s });
      }
    }
  }
  const core = readJson(path.join(D, 'core/coreVocabulary.json'));
  const images = readJson(path.join(D, 'images/wordVisuals.json')).images;
  const vis = new Map();
  for (const i of images) { if (!vis.has(i.senseId)) vis.set(i.senseId, []); vis.get(i.senseId).push(i); }
  const plan = readJson(path.join(D, 'images/visualPlan.json')).plan;
  const faces = new Set(Object.keys(opt(path.join(D, 'faces/faces.json'), { faces: {} }).faces));
  const catalog = readJson(path.join(root, 'planning/catalog/swechan-catalog.v1.json'));
  const mapping = opt(path.join(D, 'catalog/publishedMapping.json'), { links: [], compatibilityPlacements: [] });
  return { index, modules, entries, senses, core, images, vis, plan, faces, catalog, mapping };
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const stripFuri = (t) => t.replace(/\{([^|{}]+)\|[^{}]+\}/g, '$1');
const isJaKey = (k) => k === 'ja' || /Ja$/.test(k) || k === 'jaAlt';
export const senseLevel = (e, s) => s.level ?? e.level;
const hard = (lv) => LEVELS.indexOf(lv) >= LEVELS.indexOf('B2');

export function isAnimated(c, sid) {
  return c.faces.has(sid) || (c.vis.get(sid) ?? []).some((i) => i.kind === 'animation' || i.kind === 'face' || i.animated === true);
}
export const hasVisual = (c, sid) => (c.vis.get(sid) ?? []).length > 0 || c.faces.has(sid);
/** Verbs and process nouns ("När …" definitions): the words where movement carries the meaning. */
export function isMotionWord(e, s) {
  return e.pos === 'verb' || (e.pos === 'noun' && /^När\s/.test(s.defSv));
}

/** Sentence count, tolerant of Swedish abbreviations and decimal numbers. */
export function svSentences(t) {
  const x = t.replace(/\b(t\.ex|bl\.a|m\.m|o\.s\.v|osv|s\.k|t\.o\.m|f\.d|ca|kl|nr|resp|dvs|d\.v\.s|jfr|f\.Kr|e\.Kr|p\.g\.a|i\.st\.f|mm|cm|km|kg|st|tr)\./gi, '$1')
    .replace(/\d\.\d/g, '00').replace(/\.{3}|…/g, ' ');
  const n = (x.match(/[.!?](?=["”»)\s]|$)/g) ?? []).length;
  return n + (/[^.!?"”»)\s]\s*$/.test(x) ? 1 : 0);
}
export function jaSentences(t) {
  const x = stripFuri(t).replace(/…|\.{3}/g, '');
  const n = (x.match(/[。！？]/g) ?? []).length;
  return n + (/[^。！？」）\s]\s*$/.test(x) ? 1 : 0);
}

/**
 * Swedish and Japanese text out of step: three or more sentences apart, or a Japanese text that is
 * unusually short for its Swedish (below 0.18
 * Japanese characters per Swedish character, quoted Swedish words excluded). A merged sentence is fine.
 */
export function parityProblem(sv, ja) {
  const a = svSentences(sv), b = jaSentences(ja);
  if (Math.abs(a - b) >= 3) return `${a} meningar på svenska men ${b} på japanska`;
  if (sv.length > 60) {
    const ratio = stripFuri(ja).replace(/「[\p{Script=Latin}\d\s,.:;!?'’()-]*」/gu, '').length / sv.length;
    if (ratio < 0.18) return 'den japanska texten är mycket kortare än den svenska (saknas något?)';
  }
  return null;
}

const ALSO_MEANS = /(kan också betyda|betyder också|kan även betyda|betyder även|har (också|även) betydelsen|i en annan betydelse|andra betydelser|två betydelser|flera betydelser)/i;
const DOUBLED_OK = new Set(['var var', 'de de', 'det det', 'att att', 'ha ha', 'hej hej', 'nej nej', 'ja ja', 'så så', 'kom kom']);

/** Calls cb(text, isJa) for every human-written string in a module or an entry. */
function eachText(o, cb) {
  const rec = (v, ja) => {
    if (typeof v === 'string') cb(v, ja);
    else if (Array.isArray(v)) v.forEach((x) => rec(x, ja));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
      if (k.startsWith('_') || ['id', 'senseId', 'categoryId', 'bodyFile', 'updatedAt', 'tags', 'prerequisites', 'related', 'pos', 'level', 'kind', 'focus', 'register', 'relation', 'status', 'reviewer', 'date', 'grammarNotes', 'checkedAgainst', 'coreSense'].includes(k)) continue;
      rec(x, ja || isJaKey(k));
    }
  };
  rec(o, false);
}

export function typography(t) {
  const out = [];
  if (/(?<!\.)\.\.(?!\.)/.test(t)) out.push('dubbelpunkt');
  const m = t.match(/(?<![\p{L}])(\p{L}{2,}) \1(?![\p{L}])/iu);
  if (m && !DOUBLED_OK.has(m[0].toLowerCase())) out.push('dubbla ord');
  if (/\S {2,}\S/.test(t)) out.push('dubbla blanksteg');
  if (t.includes('"')) out.push('raka citattecken');
  if (/\s[,.;:!?](?!\.)/.test(t) && !/\s\.\.\./.test(t)) out.push('blanksteg före skiljetecken');
  if (t !== t.trim()) out.push('blanksteg i början/slutet');
  return out;
}

const VOICED = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ばぱ', ひ: 'びぴ', ふ: 'ぶぷ', へ: 'べぺ', ほ: 'ぼぽ' };
/** Rendaku: the same reading with a voiced first sound (会社 かいしゃ → 子会社 こがいしゃ), in either direction. */
export function isRendaku(a, b) {
  if (!a || !b || a.slice(1) !== b.slice(1)) return false;
  return (VOICED[a[0]] ?? '').includes(b[0]) || (VOICED[b[0]] ?? '').includes(a[0]);
}
export function readingsOf(t) {
  return [...t.matchAll(/\{([^|{}]+)\|([^{}]+)\}/g)].map((m) => [m[1], m[2]]);
}

// ---------------------------------------------------------------- areas (for the report)
function areaResolver(c) {
  const catMods = new Map(c.catalog.modules.map((m) => [m.catalogId, m.catalogCategoryId]));
  const place = new Map(c.mapping.compatibilityPlacements.map((p) => [p.moduleId, p.catalogCategoryId]));
  const link = new Map(c.mapping.links.map((l) => [l.moduleId, catMods.get(l.catalogId)]));
  const titles = new Map(c.catalog.categories.map((x) => [x.catalogCategoryId, x.titleSv]));
  return (m) => {
    let cid = m.categoryId;
    if (!/^R\d\d-A\d\d/.test(cid)) cid = place.get(m.id) ?? link.get(m.id) ?? cid;
    const a = /^R\d\d-A\d\d/.test(cid) ? cid.slice(0, 7) : 'övrigt';
    return { area: a, title: titles.get(a) ?? a };
  };
}

// ---------------------------------------------------------------- analysis
export function analyse(c, opts = {}) {
  const legacyList = new Set(opts.legacy ?? opt(path.join(Q, 'legacy-modules.json'), { modules: [] }).modules);
  const contract = opts.contract ?? opt(path.join(Q, 'contract.json'), { rules: {} });
  const characters = opts.characters ?? opt(path.join(Q, 'characters.json'), { characters: [] });
  const readAllow = new Set((opts.readingsAllow ?? opt(path.join(Q, 'readings-allow.json'), { allow: [] })).allow.map((x) => `${x[0]}|${x[1]}`));
  const coreLemmas = new Set(c.core.lemmas.map((x) => x.toLowerCase()));
  const isLegacy = (m) => legacyList.has(m.id) && m.standard !== 2;

  // owner module per sense
  const owner = new Map();
  for (const m of c.modules) for (const w of m.words) if (!owner.has(w.senseId)) owner.set(w.senseId, m);
  const moduleSenses = [...owner.keys()].filter((s) => c.senses.has(s));
  const legacySense = (sid) => owner.has(sid) && isLegacy(owner.get(sid));
  const legacyEntry = (e) => e.senses.some((s) => legacySense(s.id));

  // global reading majority (for the contract: a new text must use the established reading)
  const readCount = new Map();
  const addReadings = (t) => { for (const [b, r] of readingsOf(t)) { if (b.length < 2) continue; const m = readCount.get(b) ?? new Map(); m.set(r, (m.get(r) ?? 0) + 1); readCount.set(b, m); } };
  for (const m of c.modules) eachText(m, (t, ja) => ja && addReadings(t));
  for (const e of c.entries) eachText(e, (t, ja) => ja && addReadings(t));
  const majority = new Map([...readCount].map(([b, m]) => [b, [...m].sort((x, y) => y[1] - x[1])[0][0]]));
  const readDeny = new Set((opts.readingsAllow ?? opt(path.join(Q, 'readings-allow.json'), { deny: [] })).deny?.map((x) => `${x[0]}|${x[1]}`) ?? []);
  const badReading = (b, r) => {
    if (readDeny.has(`${b}|${r}`)) return true;
    if (b.length < 2 || readAllow.has(`${b}|${r}`)) return false;
    const mj = majority.get(b);
    return mj !== r && !isRendaku(mj, r);
  };

  // characters: name -> katakana
  const charJa = new Map(characters.characters.map((x) => [x.name, x.ja]));
  const charRe = charJa.size ? new RegExp(`(?<![\\p{L}])(${[...charJa.keys()].join('|')})(?![\\p{L}])`, 'u') : null;
  const katakanaMismatch = (sv, ja) => {
    if (!charRe) return null;
    const found = [...new Set([...sv.matchAll(new RegExp(charRe.source, 'gu'))].map((m) => m[1]))];
    const j = stripFuri(ja);
    if (!/[ァ-ヴ]/.test(j)) return null; // the Japanese side does not name anyone
    const miss = found.filter((n) => !j.includes(charJa.get(n)));
    return miss.length ? miss : null;
  };

  const metrics = {};
  const backlog = {};
  const bump = (k, item) => { metrics[k] = (metrics[k] ?? 0) + 1; if (item !== undefined) (backlog[k] ??= []).push(item); };
  const area = areaResolver(c);
  const perArea = new Map();
  const areaBump = (m, k) => { const a = area(m); const r = perArea.get(a.area) ?? { title: a.title, n: {} }; r.n[k] = (r.n[k] ?? 0) + 1; perArea.set(a.area, r); };

  // ---- sense metrics (legacy scope)
  for (const sid of moduleSenses) {
    const { entry: e, sense: s } = c.senses.get(sid);
    const m = owner.get(sid);
    areaBump(m, 'ord');
    if (!isLegacy(m)) continue;
    const lv = senseLevel(e, s);
    const p = c.plan[sid];
    if (!hasVisual(c, sid)) { bump('ord utan bild', sid); areaBump(m, 'utan bild'); }
    if (isAnimated(c, sid)) { bump('ord med animation'); areaBump(m, 'animation'); }
    if (p?.kind === 'animation' && !isAnimated(c, sid) && !p.waiver) bump('planerad animation saknas', sid);
    if (isMotionWord(e, s)) {
      areaBump(m, 'verb och processord');
      if (!isAnimated(c, sid)) { bump('verb och processord utan animation', sid); }
      else areaBump(m, 'verb och processord med animation');
    }
    if (hard(lv)) {
      if (s.examples.length < 2) bump('B2+ med ett exempel', sid);
      if (!(s.collocations?.length || s.usageNote || (s.register && s.register !== 'neutral'))) bump('B2+ utan användningsuppgift', sid);
      const text = `${s.explanation?.sv ?? ''} ${s.usageNote?.sv ?? ''}`.toLowerCase();
      const syn = new Set((s.synonyms ?? []).map((x) => x.senseId));
      for (const i of c.vis.get(sid) ?? []) for (const o of i.confusableWith ?? []) {
        const oe = c.senses.get(o)?.entry;
        if (oe && !syn.has(o) && !text.includes(oe.lemma.toLowerCase())) bump('B2+ förväxlingsord som inte nämns', `${sid} ~ ${o}`);
      }
    }
    if (lv === 'B1' && p?.kind === 'symbol' && !s.explanation) bump('abstrakt B1 utan förklaring', sid);
  }

  // ---- entry metrics (legacy scope)
  for (const e of c.entries) {
    if (!legacyEntry(e)) continue;
    if (e.senses.length > 1) bump('poster med flera betydelser');
    if (e.senses.length === 1) {
      const s = e.senses[0];
      if (ALSO_MEANS.test(`${s.explanation?.sv ?? ''} ${s.usageNote?.sv ?? ''} ${s.defSv}`)) bump('"kan också betyda" utan egen betydelse', e.id);
      if (coreLemmas.has(e.lemma.toLowerCase()) && !e.senseInventory) bump('grundord med en betydelse, ej inventerat', e.id);
    }
    for (const s of e.senses) if (/；/.test(s.ja) || /\bOckså:/.test(s.defSv)) bump('glosa med två betydelser', s.id);
  }

  // ---- text metrics (legacy scope)
  const legacyTexts = [];
  for (const m of c.modules) if (isLegacy(m)) legacyTexts.push([m.id, m]);
  for (const e of c.entries) if (legacyEntry(e)) legacyTexts.push([e.id, e]);
  const conflictBases = new Set();
  for (const [id, o] of legacyTexts) {
    eachText(o, (t, ja) => {
      if (ja) { for (const [b, r] of readingsOf(t)) if (badReading(b, r)) { bump('avvikande läsning', `${id}: {${b}|${r}} (vanligast ${majority.get(b)})`); conflictBases.add(b); } }
      else for (const k of typography(t)) bump(`typografi: ${k}`, `${id}: ${t.slice(0, 80)}`);
    });
  }
  for (const [id, o] of legacyTexts) {
    if (!o.senses) continue;
    for (const s of o.senses) {
      const pairs = [...s.examples.map((x) => [x.sv, x.ja]), ...(s.explanation ? [[s.explanation.sv, s.explanation.ja]] : [])];
      for (const [sv, ja] of pairs) {
        if (parityProblem(sv, ja)) bump('sv/ja ur fas', s.id);
        const k = katakanaMismatch(sv, ja);
        if (k) bump('namn med fel katakana', `${s.id}: ${k.join(', ')}`);
      }
    }
    void id;
  }
  for (const m of c.modules) {
    if (!isLegacy(m)) continue;
    for (const qid of missingQuotes(m)) bump('frågeförklaring citerar text som saknas', `${m.id} ${qid}`);
    if (isWordListDescription(m, c)) bump('beskrivning som bara räknar upp orden', m.id);
  }

  // ---- contract
  const violations = [];
  const legacyIds = legacyList;
  for (const m of c.modules) {
    if (isLegacy(m)) continue;
    const v = checkContract(m, c, { contract, owner, badReading, majority, katakanaMismatch, coreLemmas, isNew: !legacyIds.has(m.id) });
    for (const x of v) violations.push({ module: m.id, ...x });
  }

  const info = {
    moduler: c.modules.length,
    'moduler med standard 2': c.modules.filter((m) => m.standard === 2).length,
    ordboksposter: c.entries.length,
    'modulord totalt': moduleSenses.length,
    'avvikande läsningar (olika kanjiord)': conflictBases.size,
  };
  return { metrics, info, backlog, violations, perArea, owner };
}

/** Quotes in a question explanation that do not occur in the reading text (meanings such as Betydelsen ”…” are skipped). */
export function missingQuotes(m) {
  const norm = (x) => x.toLowerCase().replace(/[^\p{L}\d ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  const body = norm(m.reading.paragraphs.join(' '));
  const out = [];
  for (const q of m.reading.questions) {
    for (const mm of (q.explanationSv ?? '').matchAll(/[”"«]([^”"»]{12,})[”"»]/g)) {
      const before = q.explanationSv.slice(Math.max(0, mm.index - 25), mm.index).toLowerCase();
      if (/(betydelsen|betyder|ordet|uttrycket|meningen)\s*$/.test(before)) continue;
      if (!mm[1].split(/\.\.\.|…/).every((part) => !norm(part) || body.includes(norm(part)))) out.push(q.id);
    }
  }
  return out;
}

export function isWordListDescription(m, c) {
  const lemmas = m.words.map((w) => c.senses.get(w.senseId)?.entry.lemma.toLowerCase()).filter(Boolean);
  const body = m.descriptionSv.replace(/^[^:]{2,80}:\s*/, '').replace(/[.]$/, '');
  const parts = body.split(/,\s*|\s+och\s+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (parts.length < 3) return false;
  const hit = parts.filter((p) => lemmas.some((l) => p === l || p.startsWith(l + ' ') || p.endsWith(' ' + l) || p.includes(l))).length;
  return hit / parts.length >= 0.6;
}

// ---------------------------------------------------------------- contract (quality/contract.json)
export function checkContract(m, c, ctx) {
  const R = ctx.contract.rules ?? {};
  const on = (k) => R[k] && R[k].enabled !== false;
  const out = [];
  const err = (rule, msg) => out.push({ rule, message: msg });
  if (ctx.isNew && m.standard !== 2) err('standard', 'ny modul måste ha "standard": 2');
  const own = m.words.map((w) => w.senseId).filter((sid) => ctx.owner.get(sid) === m && c.senses.has(sid));
  let motion = 0, motionAnim = 0;
  for (const sid of own) {
    const { entry: e, sense: s } = c.senses.get(sid);
    const lv = senseLevel(e, s);
    const p = c.plan[sid];
    if (on('K1') && !hasVisual(c, sid)) err('K1', `${sid}: saknar bild (manuellt spår om två omgångar underkänts)`);
    if (on('K2') && p?.kind === 'animation' && !isAnimated(c, sid) && !p.waiver) err('K2', `${sid}: planen säger animation men ordet har ingen (eller ange waiver med skäl)`);
    if (on('K2') && p?.kind === 'none') err('K2', `${sid}: plan "none" är inte tillåten för modulord`);
    if (on('K3') && !e.senseInventory) err('K3', `${e.id}: saknar senseInventory (kör tools/production/senses.py)`);
    if (on('K4') && ctx.coreLemmas.has(e.lemma.toLowerCase()) && !e.senseInventory?.coreSense) err('K4', `${e.id}: grundord – ange senseInventory.coreSense (grundbetydelsens id)`);
    if (hard(lv)) {
      if (on('K5')) {
        if (!(s.collocations?.length || s.usageNote || (s.register && s.register !== 'neutral'))) err('K5', `${sid}: B2+ saknar användningsuppgift (collocations, usageNote eller register)`);
        const text = `${s.explanation?.sv ?? ''} ${s.usageNote?.sv ?? ''}`.toLowerCase();
        const syn = new Set((s.synonyms ?? []).map((x) => x.senseId));
        for (const i of c.vis.get(sid) ?? []) for (const o of i.confusableWith ?? []) {
          const oe = c.senses.get(o)?.entry;
          if (oe && !syn.has(o) && !text.includes(oe.lemma.toLowerCase())) err('K5', `${sid}: förklaringen nämner inte förväxlingsordet "${oe.lemma}" (eller lägg till synonyms-länk)`);
        }
      }
      if (on('K6') && s.examples.length < (R.K6.minExamples ?? 2)) err('K6', `${sid}: B2+ behöver minst ${R.K6.minExamples ?? 2} exempel`);
    }
    if (on('K7') && lv === 'B1' && p?.kind === 'symbol') {
      if (!s.explanation) err('K7', `${sid}: abstrakt B1-ord behöver en kort förklaring`);
      else if (svSentences(s.explanation.sv) > (R.K7.maxSentences ?? 3)) err('K7', `${sid}: B1-förklaringen ska vara kort (högst ${R.K7.maxSentences ?? 3} meningar)`);
    }
    if (on('K8')) {
      const pairs = [...s.examples.map((x) => ['exempel', x.sv, x.ja]), ...(s.explanation ? [['förklaring', s.explanation.sv, s.explanation.ja]] : [])];
      for (const [k, sv, ja] of pairs) {
        const pp = parityProblem(sv, ja);
        if (pp) err('K8', `${sid}: ${k}: ${pp}`);
        const km = ctx.katakanaMismatch(sv, ja);
        if (km) err('K8', `${sid}: ${k}: ${km.join(', ')} ska skrivas som i quality/characters.json`);
      }
    }
    if (isMotionWord(e, s)) { motion++; if (isAnimated(c, sid)) motionAnim++; }
    if (on('TEXT')) eachText(e, (t, ja) => {
      if (ja) { for (const [b, r] of readingsOf(t)) if (ctx.badReading(b, r)) err('TEXT', `${e.id}: {${b}|${r}} – vanligast är ${ctx.majority.get(b)} (eller lägg paret i quality/readings-allow.json)`); }
      else for (const k of typography(t)) err('TEXT', `${e.id}: ${k}: ${t.slice(0, 60)}`);
    });
  }
  if (on('K10') && motion >= (R.K10.minWords ?? 3) && motionAnim / motion < (R.K10.minShare ?? 0.6)) {
    err('K10', `${motionAnim} av ${motion} verb och processord har animation; kravet är minst ${Math.round((R.K10.minShare ?? 0.6) * 100)} %`);
  }
  if (on('K9')) {
    for (const f of m.reading.factSources ?? []) {
      if (typeof f === 'string') err('K9', `factSources: "${f.slice(0, 50)}" ska vara { text, source, checked, recheck }`);
      else if (!f.source || !/^\d{4}-\d{2}-\d{2}$/.test(f.checked ?? '') || !['årligen', 'aldrig'].includes(f.recheck)) err('K9', `factSources: "${(f.text ?? '').slice(0, 50)}" saknar source, checked (ÅÅÅÅ-MM-DD) eller recheck (årligen/aldrig)`);
    }
  }
  if (on('TEXT')) {
    eachText(m, (t, ja) => {
      if (ja) { for (const [b, r] of readingsOf(t)) if (ctx.badReading(b, r)) err('TEXT', `{${b}|${r}} – vanligast är ${ctx.majority.get(b)}`); }
      else for (const k of typography(t)) err('TEXT', `${k}: ${t.slice(0, 60)}`);
    });
    for (const qid of missingQuotes(m)) err('TEXT', `${qid}: förklaringen citerar text som inte finns i lästexten`);
    if (isWordListDescription(m, c)) err('TEXT', 'descriptionSv räknar bara upp orden – skriv vad eleven får lära sig');
  }
  return out;
}

// ---------------------------------------------------------------- baseline handling
const HIGHER_IS_BETTER = new Set(['ord med animation', 'poster med flera betydelser']);
export function compare(current, baseline) {
  const worse = [], better = [];
  const keys = new Set([...Object.keys(current), ...Object.keys(baseline)]);
  for (const k of keys) {
    if (!(k in baseline)) continue; // new metric: becomes gated after the next --update
    const a = current[k] ?? 0, b = baseline[k] ?? 0;
    if (a === b) continue;
    const hi = HIGHER_IS_BETTER.has(k);
    ((hi ? a < b : a > b) ? worse : better).push({ metric: k, now: a, baseline: b });
  }
  return { worse, better };
}

function writeReport(res) {
  const cols = ['ord', 'utan bild', 'animation', 'verb och processord', 'verb och processord med animation'];
  const lines = ['# Kvalitetsrapport (genererad)', '', `Genererad av \`npm run audit:content -- --report\`. Redigera inte.`, '', '| Ämnesgrupp | ' + cols.join(' | ') + ' |', '|' + '---|'.repeat(cols.length + 1)];
  for (const [a, r] of [...res.perArea].sort()) lines.push(`| ${a} ${r.title} | ` + cols.map((k) => r.n[k] ?? 0).join(' | ') + ' |');
  lines.push('', '## Mått (befintliga moduler)', '', ...Object.entries(res.metrics).sort().map(([k, v]) => `- ${k}: ${v}`));
  fs.writeFileSync(path.join(Q, 'report.md'), lines.join('\n') + '\n');
}

// ---------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const c = loadContent();
  const res = analyse(c);
  const metricsFile = path.join(Q, 'metrics.json');
  const base = opt(metricsFile, { metrics: {}, exceptions: [] });
  const { worse, better } = compare(res.metrics, base.metrics);
  const onlyModules = args.includes('--module') ? args.slice(args.indexOf('--module') + 1).filter((x) => !x.startsWith('--')) : null;
  const viol = onlyModules ? res.violations.filter((v) => onlyModules.includes(v.module)) : res.violations;

  if (onlyModules) {
    for (const id of onlyModules) {
      const m = c.modules.find((x) => x.id === id);
      if (!m) { console.log(`${id}: finns inte`); continue; }
      if (!viol.some((v) => v.module === id)) console.log(`${id}: uppfyller kontraktet${m.standard === 2 ? '' : ' (OBS: modulen är befintlig och har inte standard 2)'}`);
    }
  } else {
    console.log('Mått för befintliga moduler (får inte bli sämre):');
    for (const [k, v] of Object.entries(res.metrics).sort()) {
      const b = base.metrics[k];
      console.log(`  ${k}: ${v}${b === undefined ? ' (nytt)' : b === v ? '' : ` (lägstanivå ${b})`}`);
    }
    for (const [k, v] of Object.entries(res.info)) console.log(`  · ${k}: ${v}`);
  }
  if (viol.length) {
    console.log(`\nKontraktsfel (${viol.length}):`);
    for (const v of viol.slice(0, 400)) console.log(`  ${v.module} [${v.rule}] ${v.message}`);
    if (viol.length > 400) console.log(`  … och ${viol.length - 400} till`);
  }
  if (args.includes('--report')) { writeReport(res); console.log('\nSkrev quality/report.md'); }
  if (args.includes('--backlog')) {
    const dir = path.join(Q, 'backlog');
    fs.mkdirSync(dir, { recursive: true });
    for (const [k, items] of Object.entries(res.backlog)) {
      const name = k.replace(/["+:]/g, '').replace(/[^\p{L}\d]+/gu, '-').replace(/^-|-$/g, '').toLowerCase();
      fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify({ _comment: `Genererad av npm run audit:content -- --backlog. Mått: ${k}`, count: items.length, items }, null, 1) + '\n');
    }
    console.log(`\nSkrev ${Object.keys(res.backlog).length} köer till quality/backlog/`);
  }
  if (args.includes('--update')) {
    const allow = args.includes('--allow-worse') ? args[args.indexOf('--allow-worse') + 1] : null;
    const allowed = new Set();
    if (allow) {
      const [metric, ...why] = allow.split(':');
      if (!why.join(':').trim()) { console.error('--allow-worse kräver "<mått>: <skäl>"'); process.exit(1); }
      allowed.add(metric.trim());
      base.exceptions = [...(base.exceptions ?? []), { date: new Date().toISOString().slice(0, 10), metric: metric.trim(), reason: why.join(':').trim(), from: base.metrics[metric.trim()], to: res.metrics[metric.trim()] }];
    }
    const blocked = worse.filter((w) => !allowed.has(w.metric) && base.metrics[w.metric] !== undefined);
    if (blocked.length) {
      console.error('\nSämre mått – lägstanivån skrivs inte om:');
      for (const w of blocked) console.error(`  ${w.metric}: ${w.now} (lägstanivå ${w.baseline})`);
      process.exit(1);
    }
    const next = { _comment: 'Lägstanivåer för kvalitetsmåtten. Skrivs av `npm run audit:content -- --update`. Redigera inte för hand.', metrics: Object.fromEntries(Object.entries(res.metrics).sort()), exceptions: base.exceptions ?? [] };
    fs.mkdirSync(Q, { recursive: true });
    fs.writeFileSync(metricsFile, JSON.stringify(next, null, 1) + '\n');
    console.log(`\nSkrev quality/metrics.json (${better.length} förbättrade mått).`);
  }
  if (args.includes('--check')) {
    let fail = false;
    if (worse.length) {
      fail = true;
      console.error('\nSPÄRR: dessa mått har blivit sämre än quality/metrics.json:');
      for (const w of worse) console.error(`  ${w.metric}: ${w.now} (lägstanivå ${w.baseline})`);
      console.error('Rätta felet. Om försämringen är avsiktlig: npm run audit:content -- --update --allow-worse "<mått>: <skäl>".');
    }
    if (better.length) console.log(`\n${better.length} mått är bättre än lägstanivån – kör \`npm run audit:content -- --update\` och checka in quality/metrics.json.`);
    if (res.violations.length) { fail = true; console.error(`\nSPÄRR: ${res.violations.length} kontraktsfel (se ovan).`); }
    if (fail) process.exit(1);
    console.log('\nKvalitetsspärren: OK.');
  }
}
