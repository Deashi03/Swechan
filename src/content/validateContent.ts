/**
 * Content quality validator (developer tool).
 * Run with `npm run validate:content`. Returns human-readable issues; an
 * empty list means the content passes all automatic checks. Automatic checks
 * do NOT replace human review of translations and facts.
 */
import { checkFurigana } from './furigana';
import { entryOccursIn } from './morphology';
import { allWordImages, imageFor } from './images';
import { allPlannedVisuals, plannedVisual } from './visualPlan';
import type { ContentRepository } from './repository';
import { needsExplanation } from './schema';

export type ContentIssue = { where: string; message: string };

/**
 * Product owner's rule (0.29): everything produced from now on has a picture, an animation or a symbol.
 * These 14 module words were published without a visualisation before the rule and are the only exceptions.
 * Never add to this list – draw a picture (and blind-test it) instead.
 */
export const VISUAL_EXCEPTIONS_BEFORE_0_29: ReadonlySet<string> = new Set([
  's.en-bit.1', 's.extremt.1', 's.frasighet.1', 's.ha-det-trevligt.1', 's.knaprig.1', 's.leverans.1', 's.motion.1',
  's.otrogen.1', 's.så-fort.1', 's.varifrån.1', 's.veckovis.1', 's.vänligen.1', 's.ödmjuk.1', 's.ömsint.1',
]);

/**
 * Product owner's rule (after 0.29): a picture gets at most two blind-test rounds. A word whose picture fails
 * the second round gets plan status `none` and is listed here and under "Saknade bilder" in PROJECT_STATUS.md.
 */
export const VISUAL_MISSING_AFTER_BLIND_TEST: ReadonlySet<string> = new Set([
  's.demenssjuk.1',
  // 0.30, after two blind-test rounds
  's.rösträtt.1', 's.utöva.1', 's.statsmakt.1', 's.medborgerlig.1', 's.representera.1', 's.institution.1', 's.ansvarig.1', 's.politisk.1', 's.bereda.1', 's.debattera.1', 's.valkampanj.1', 's.valkrets.1',
  's.regional.1', 's.motivering.1',
  's.diplomatisk.1', 's.åtagande.1', 's.samarbete.1', 's.liberal.1', 's.liberalism.1', 's.socialistisk.1',
  // 0.31, after two blind-test rounds
  's.utfärda.1', 's.föreskrift.1', 's.enligt-lag.1', 's.författning.1', 's.lagstadgad.1', 's.rätt.2', 's.skyldig.3', 's.plikt.1', 's.åligga.1', 's.privatperson.1', 's.offentlig-rätt.1',
  // 0.31 (Brott & straff, Polis), after two blind-test rounds
  's.gärning.1', 's.straffbar.1', 's.brottslig.1', 's.uppsåt.1', 's.vårdslös.1', 's.avsiktlig.1', 's.uppsåtlig.1', 's.oaktsamhet.1', 's.anstiftan.1', 's.straff.1', 's.individualprevention.1', 's.skäligen-misstänkt.1', 's.anhållande.1', 's.försvåra.1',
  // 0.31 (Domstolar & rättegång), after two blind-test rounds
  's.rättegång.1', 's.yrkande.2', 's.yrka.1', 's.åtalsplikt.1', 's.åtal.1', 's.stämning.1', 's.yttra-sig.1', 's.överklagande.1', 's.frikänna.1', 's.fria.2',
  // 0.31 (Civilrätt, Förvaltning), after two blind-test rounds
  's.sakliga-skäl.1', 's.handlägga.1', 's.ansökan.1', 's.sekretessbelagd.1', 's.sekretessmarkering.1', 's.sekretess.1', 's.konfidentiell.1', 's.serviceskyldighet.1', 's.service.2', 's.vägledning.1',
  // 0.32 (Privatekonomi, Arbetsplatsens vardag, Jobbsökande), after two blind-test rounds
  's.inflation.1', 's.räntekostnad.1', 's.låneränta.1', 's.inkomstskatt.1', 's.skattepliktig.1', 's.hushålla.1', 's.ha-hand-om.1', 's.tjänstledighet.1', 's.kränkande-särbehandling.1', 's.befattning.1',
  // 0.32 (Företagande), after two blind-test rounds
  's.F-skatt.1', 's.vinst.1', 's.förlust.1', 's.marknadsföring.1', 's.bolag.1',
  // 0.32 (Marknadsekonomi), after two blind-test rounds
  's.stiga.1', 's.konkurrent.1', 's.sektor.1', 's.effektivisera.1', 's.arbetsmarknad.1', 's.finanspolitik.1', 's.penningpolitik.1',
  // 0.32 (Banker & investeringar), after two blind-test rounds
  's.obligation.1', 's.sprida-riskerna.1', 's.riskspridning.1',
  // 0.33 (Studieteknik), after two blind-test rounds
  's.förförståelse.1', 's.visualisera.1', 's.studiesvårighet.1',
  // 0.33 (Universitet & högskola), after two blind-test rounds
  's.utexaminerad.1',
  // 0.33 (Svensk skola), after two blind-test rounds
  's.friskola.1', 's.bedömning.1', 's.specialpedagog.1', 's.särskilt-stöd.1', 's.ämnesplan.1', 's.antagning.1',
  // 0.33 (Pedagogik), after two blind-test rounds
  's.pedagogik.1', 's.lärande.1', 's.förmåga.1', 's.respons.1', 's.förutsättning.2',
  // 0.33 (Forskning & akademi), after two blind-test rounds
  's.vetenskaplig.1', 's.publikation.1', 's.källkritisk.1', 's.referera.1', 's.empirisk.1', 's.etisk.1', 's.fabricera.1', 's.tes.1', 's.motargument.1',
  // 0.33 (Utbildningssystem i världen), after two blind-test rounds
  's.skolgång.1', 's.yrkeshögskola.1',
  // 0.34 (Offentliga byggnader), after two blind-test rounds
  's.myndighet.1',
  // 0.34 (Stadens platser), after two blind-test rounds
  's.trivsam.1',
  // 0.34 (Samhällsservice), after two blind-test rounds
  's.medborgarservice.1',
  // 0.34 (Bostads- & stadsplanering), after two blind-test rounds
  's.framkomlighet.1',
  // 0.34 (Befolkning & migration), after two blind-test rounds
  's.vara-skriven.1', 's.befolkning.1', 's.utflyttning.2', 's.ursprungsland.2',
  // 0.34 (Civilsamhälle), after two blind-test rounds
  's.välgörenhet.1',
  // 0.35 (Nyhetsmedier), after two blind-test rounds
  's.sensation.1',
]);

export function validateContent(repo: ContentRepository): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (where: string, message: string) => issues.push({ where, message });
  const ja = (where: string, text: string | undefined) => {
    if (text === undefined) return;
    for (const i of checkFurigana(text)) add(where, i.message);
  };

  // Unique ids
  const seen = new Set<string>();
  const unique = (id: string, where: string) => { if (seen.has(id)) add(where, `Dubblett-ID ${id}`); seen.add(id); };

  for (const e of repo.entries) {
    unique(e.id, e.id);
    const infl = e.inflection;
    if (infl.kind === 'noun' && infl.indefSg !== e.lemma) add(e.id, 'indefSg måste vara lika med uppslagsordet');
    if (infl.kind === 'verb') {
      if (infl.infinitive !== e.lemma) add(e.id, 'infinitive måste vara lika med uppslagsordet');
      if (infl.particle)
        for (const f of [infl.infinitive, infl.present, infl.past, infl.supine, infl.imperative])
          if (!f.endsWith(` ${infl.particle}`)) add(e.id, `Partikelverbsformen "${f}" slutar inte på partikeln`);
    }
    if (infl.kind === 'adjective' && infl.common !== e.lemma) add(e.id, 'common måste vara lika med uppslagsordet');
    if (e.pos !== infl.kind && infl.kind !== 'none') add(e.id, `Ordklass ${e.pos} matchar inte böjningstyp ${infl.kind}`);
    for (const s of e.senses) {
      unique(s.id, s.id);
      if (!s.id.startsWith(`s.${e.id.slice(2)}.`)) add(s.id, `Betydelse-ID ska börja med s.${e.id.slice(2)}.`);
      ja(`${s.id}.ja`, s.ja);
      // The Japanese gloss and definition are recall prompts: the Swedish answer must not appear in them (0.5).
      for (const [k, t] of [['ja', s.ja], ['defJa', s.defJa]] as const)
        if (entryOccursIn(t, e)) add(`${s.id}.${k}`, 'Den japanska texten innehåller det svenska ordet (svaret syns i frågan) – flytta konstruktionen till usageNote');
      ja(`${s.id}.defJa`, s.defJa);
      s.examples.forEach((x, i) => ja(`${s.id}.examples[${i}]`, x.ja));
      ja(`${s.id}.usageNote`, s.usageNote?.ja);
      ja(`${s.id}.explanation`, s.explanation?.ja);
      if (s.explanation) {
        if (s.explanation.sv.trim() === s.defSv.trim()) add(`${s.id}.explanation`, 'Förklaringen får inte bara upprepa definitionen');
        if (s.explanation.sv.length < 60) add(`${s.id}.explanation`, 'Förklaringen är för kort – förklara vad ordet betyder i praktiken och när det används');
      }
      for (const r of s.synonyms ?? []) {
        if (!repo.getSense(r.senseId)) add(s.id, `Synonym pekar på okänd betydelse ${r.senseId}`);
        ja(`${s.id}.synonyms`, r.noteJa);
      }
      for (const g of s.grammarNotes ?? []) if (!repo.getGrammarNote(g)) add(s.id, `Okänd grammatiknotering ${g}`);
      // "reviewed" is a human statement: it needs who and when. AI tools never set it.
      if (s.quality.status === 'reviewed' && (!s.quality.reviewer || !s.quality.date)) add(s.id, 'Status reviewed kräver reviewer och date (mänsklig granskning)');
    }
  }

  for (const n of repo.grammarNotes) {
    unique(n.id, n.id);
    ja(n.id, n.titleJa); ja(n.id, n.bodyJa);
    n.examples.forEach((x) => ja(n.id, x.ja));
  }
  for (const c of repo.comparisons) {
    unique(c.id, c.id);
    ja(c.id, c.titleJa); ja(c.id, c.summaryJa);
    for (const it of c.items) {
      if (!repo.getSense(it.senseId)) add(c.id, `Okänd betydelse ${it.senseId}`);
      ja(c.id, it.noteJa);
    }
  }
  for (const c of repo.categories) {
    unique(c.id, c.id);
    ja(c.id, c.nameJa);
    if (c.parentId && !repo.getCategory(c.parentId)) add(c.id, `Okänd förälder ${c.parentId}`);
    if (repo.categoryPath(c.id).length >= 20) add(c.id, 'Kategorihierarkin innehåller en cykel');
  }
  for (const m of repo.modules) {
    unique(m.id, m.id);
    ja(m.id, m.titleJa); ja(m.id, m.descriptionJa);
    // Legacy c.* category or (0.4) a catalog category ID; the catalog placement itself is checked by catalog:validate.
    if (!repo.getCategory(m.categoryId) && !/^R\d{2}(-A\d{2}(-T\d{2})?)?$/.test(m.categoryId)) add(m.id, `Okänd kategori ${m.categoryId}`);
    for (const p of [...m.prerequisites, ...m.related]) if (!repo.getModule(p)) add(m.id, `Okänd modul ${p}`);
    const senseIds = new Set<string>();
    const body = repo.getLoadedModuleBody(m.id);
    if (!body) { add(m.id, 'Lektionskroppen är inte laddad (validera med toolingRepository())'); continue; }
    const fullText = body.reading.paragraphs.join('\n');
    for (const w of m.words) {
      if (senseIds.has(w.senseId)) add(m.id, `Målordet ${w.senseId} förekommer två gånger`);
      senseIds.add(w.senseId);
      const ref = repo.getSense(w.senseId);
      if (!ref) { add(m.id, `Okänd betydelse ${w.senseId}`); continue; }
      if (needsExplanation(ref.entry.level) && !ref.sense.explanation)
        add(m.id, `"${ref.entry.lemma}" (${ref.entry.level}) är svårt för en genomsnittlig elev i årskurs 9 och behöver en förklaring (explanation) på ${w.senseId}`);
      if (!entryOccursIn(fullText, ref.entry)) add(m.id, `Målordet "${ref.entry.lemma}" saknas i lästexten (ingen känd böjningsform hittades)`);
    }
    for (const q of body.reading.questions) {
      if (q.kind === 'choice' && q.correctIndex >= q.options.length) add(`${m.id}.${q.id}`, 'correctIndex utanför alternativen');
      ja(`${m.id}.${q.id}`, q.explanationJa);
    }
  }
  for (const p of repo.placementItems) {
    unique(p.id, p.id);
    ja(p.id, p.promptJa);
    p.options?.forEach((o) => ja(p.id, o));
    if (p.kind === 'meaning' && !(p.options ?? []).includes(p.answers[0]!)) add(p.id, 'Rätt svar saknas bland alternativen');
  }
  // Word images (0.6)
  const imageSeen = new Set<string>();
  for (const img of allWordImages()) {
    const w = `bild ${img.senseId}`;
    if (imageSeen.has(img.senseId)) add(w, 'Betydelsen har flera bilder');
    imageSeen.add(img.senseId);
    if (!repo.getSense(img.senseId)) add(w, 'Okänd betydelse');
    for (const c of img.confusableWith ?? []) if (!repo.getSense(c)) add(w, `confusableWith pekar på okänd betydelse ${c}`);
    if (img.symbol && img.quiz) add(w, 'En symbolbild får inte användas i bildövningar (quiz)');
    if (img.kind === 'animation' && img.quiz && plannedVisual(img.senseId)?.kind === 'symbol') add(w, 'En symbolisk scen (glosa) får inte användas i bildövningar (quiz)');
  }
  // Visual plan (0.12): every module word has a planned kind; every row points at a known sense
  for (const m of repo.modules) for (const wd of m.words) if (!plannedVisual(wd.senseId)) add(`${m.id} › ${wd.senseId}`, 'Visualiseringsplan saknas – kör npm run visuals:plan');
  for (const id of Object.keys(allPlannedVisuals())) if (!repo.getSense(id)) add(`visualiseringsplan ${id}`, 'Okänd betydelse');
  // Every module word has a visualisation (0.29, product owner's rule)
  for (const m of repo.modules) for (const wd of m.words) {
    if (VISUAL_EXCEPTIONS_BEFORE_0_29.has(wd.senseId) || VISUAL_MISSING_AFTER_BLIND_TEST.has(wd.senseId)) continue;
    if (!imageFor(wd.senseId)) add(`${m.id} › ${wd.senseId}`, 'Ordet saknar bild, animation eller symbol – från 0.29 ska varje modulord ha en visualisering');
    if (plannedVisual(wd.senseId)?.kind === 'none') add(`${m.id} › ${wd.senseId}`, 'Planen säger "ingen bild" – från 0.29 får nya modulord inte sakna visualisering');
  }

  return issues;
}
