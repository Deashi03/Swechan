/**
 * Content quality validator (developer tool).
 * Run with `npm run validate:content`. Returns human-readable issues; an
 * empty list means the content passes all automatic checks. Automatic checks
 * do NOT replace human review of translations and facts.
 */
import { checkFurigana } from './furigana';
import { entryOccursIn } from './morphology';
import type { ContentRepository } from './repository';

export type ContentIssue = { where: string; message: string };

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
      ja(`${s.id}.defJa`, s.defJa);
      s.examples.forEach((x, i) => ja(`${s.id}.examples[${i}]`, x.ja));
      ja(`${s.id}.usageNote`, s.usageNote?.ja);
      for (const r of s.synonyms ?? []) {
        if (!repo.getSense(r.senseId)) add(s.id, `Synonym pekar på okänd betydelse ${r.senseId}`);
        ja(`${s.id}.synonyms`, r.noteJa);
      }
      for (const g of s.grammarNotes ?? []) if (!repo.getGrammarNote(g)) add(s.id, `Okänd grammatiknotering ${g}`);
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
    if (!repo.getCategory(m.categoryId)) add(m.id, `Okänd kategori ${m.categoryId}`);
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
  return issues;
}
