/**
 * Controlled-vocabulary checker (content QA tool, spec feedback 0.2).
 *
 * Pedagogical rule: Swedish explanations, examples, reading texts and
 * questions may only use
 *   (1) the core vocabulary (data/core/coreVocabulary.json, ≈A1–A2),
 *   (2) target words of the module's (transitive) prerequisite modules,
 *   (3) target words of the same module – for definitions only words
 *       introduced EARLIER in the module, for examples earlier words + the word itself,
 *       for reading texts and questions all words of the module.
 * Regular inflections of core lemmas are recognised with suffix rules; target
 * words are recognised through their explicitly stored forms. The heuristic
 * may occasionally accept a non-word, but it never rejects a correctly
 * inflected core or target word that follows regular patterns.
 */
import { z } from 'zod';
import { allForms, tokenize } from './morphology';
import type { ContentRepository } from './repository';
import type { Module, ModuleMeta } from './schema';

export const CoreVocabularyFile = z.object({
  lemmas: z.array(z.string()),
  irregularForms: z.array(z.string()),
  names: z.array(z.string()),
});
export type CoreVocabulary = z.infer<typeof CoreVocabularyFile>;

const SUFFIXES = ['arnas', 'ernas', 'ornas', 'arna', 'erna', 'orna', 'aste', 'ande', 'ende', 'ades', 'are', 'ast', 'ade', 'ats', 'ens', 'ets', 'na', 'ar', 'or', 'er', 'en', 'et', 'de', 'te', 'dd', 'tt', 'at', 'ad', 'an', 's', 't', 'a', 'r', 'n', 'e'];

export class VocabularyChecker {
  private lemmas: Set<string>;
  private surface: Set<string>;
  private names: Set<string>;
  constructor(core: CoreVocabulary) {
    this.lemmas = new Set(core.lemmas.map((w) => w.toLowerCase()));
    this.surface = new Set([...this.lemmas, ...core.irregularForms.map((w) => w.toLowerCase())]);
    this.names = new Set(core.names);
  }

  private coreKnown(w: string, depth = 0): boolean {
    if (this.surface.has(w)) return true;
    if (depth > 1) return false;
    // imperative = infinitive without -a ("drick", "glöm")
    const lastCh = w[w.length - 1]!;
    if (this.lemmas.has(`${w}a`) || this.lemmas.has(`${w}${lastCh}a`)) return true;
    for (const s of SUFFIXES) {
      if (!w.endsWith(s) || w.length - s.length < 2) continue;
      const base = w.slice(0, -s.length);
      const last = base[base.length - 1]!;
      const undoubled = base.length > 2 && base[base.length - 2] === last ? base.slice(0, -1) : base; // rummet → rum
      for (const c of [base, `${base}a`, `${base}e`, `${base}${last}a`, `${base}${last}`, undoubled]) if (this.lemmas.has(c)) return true;
      if (s === 's' && this.coreKnown(base, depth + 1)) return true; // genitive -s
    }
    return false;
  }

  isKnown(token: string, extra: Set<string>): boolean {
    if (token.length <= 1) return true; // symbols like H, O, C
    if (this.names.has(token) || (token.endsWith('s') && this.names.has(token.slice(0, -1)))) return true; // names, incl. genitive (Aikos)
    const w = token.toLowerCase();
    // target words: stored forms, plus genitive -s ("atomens", "fiendens")
    return extra.has(w) || (w.endsWith('s') && extra.has(w.slice(0, -1))) || this.coreKnown(w);
  }

  /** Unknown words in `text`. Multi-word target forms (particle verbs) are matched first. */
  unknownWords(text: string, extra: Set<string>): string[] {
    const words = tokenize(text).filter((t) => t.isWord).map((t) => t.text);
    const out: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const pair = i + 1 < words.length ? `${words[i]} ${words[i + 1]}`.toLowerCase() : '';
      if (pair && extra.has(pair)) { i++; continue; }
      if (!this.isKnown(words[i]!, extra)) out.push(words[i]!);
    }
    return out;
  }
}

function formsOfSenses(repo: ContentRepository, senseIds: string[]): Set<string> {
  const set = new Set<string>();
  for (const id of senseIds) {
    const ref = repo.getSense(id);
    if (ref) for (const f of allForms(ref.entry)) set.add(f);
  }
  return set;
}

export function prerequisiteClosure(repo: ContentRepository, m: Pick<ModuleMeta, 'prerequisites'>, seen = new Set<string>()): ModuleMeta[] {
  const out: ModuleMeta[] = [];
  for (const id of m.prerequisites) {
    if (seen.has(id)) continue;
    seen.add(id);
    const p = repo.getModule(id);
    if (!p) continue;
    out.push(...prerequisiteClosure(repo, p, seen), p);
  }
  return out;
}

export type VocabIssue = { where: string; unknown: string[]; text: string };

export function checkVocabulary(repo: ContentRepository, core: CoreVocabulary): VocabIssue[] {
  const checker = new VocabularyChecker(core);
  const issues: VocabIssue[] = [];
  const check = (where: string, text: string | undefined, known: Set<string>) => {
    if (!text) return;
    const unknown = checker.unknownWords(text, known);
    if (unknown.length) issues.push({ where, unknown: [...new Set(unknown)], text });
  };
  const union = (...sets: Set<string>[]) => new Set(sets.flatMap((s) => [...s]));
  const moduleOfSense = new Map<string, ModuleMeta>();

  for (const meta of repo.modules) {
    const m: Module | undefined = repo.getLoadedModuleBody(meta.id);
    if (!m) { issues.push({ where: meta.id, unknown: [], text: 'Lektionskroppen är inte laddad (använd toolingRepository())' }); continue; }
    const base = formsOfSenses(repo, prerequisiteClosure(repo, m).flatMap((p) => p.words.map((w) => w.senseId)));
    const ids = m.words.map((w) => w.senseId);
    const all = union(base, formsOfSenses(repo, ids));
    m.words.forEach((w, k) => {
      const ref = repo.getSense(w.senseId);
      if (!ref) return;
      if (!moduleOfSense.has(w.senseId)) moduleOfSense.set(w.senseId, meta);
      const before = union(base, formsOfSenses(repo, ids.slice(0, k)));
      const self = union(before, new Set(allForms(ref.entry)));
      const s = ref.sense;
      check(`${m.id} › ${s.id} defSv`, s.defSv, self);
      s.examples.forEach((ex, i) => check(`${m.id} › ${s.id} example ${i + 1}`, ex.sv, self));
      check(`${m.id} › ${s.id} usageNote`, s.usageNote?.sv, all);
      if (s.frame) check(`${m.id} › ${s.id} övningsram`, `${s.frame.subject ?? ''} ${s.frame.complement ?? ''}`, self);
      // other senses of the same headword are shown in the introduction
      for (const other of ref.entry.senses) {
        if (other.id === s.id || ids.includes(other.id)) continue;
        check(`${m.id} › ${other.id} (annan betydelse) defSv`, other.defSv, union(all, new Set(allForms(ref.entry))));
        other.examples.forEach((ex, i) => check(`${m.id} › ${other.id} (annan betydelse) example ${i + 1}`, ex.sv, union(all, new Set(allForms(ref.entry)))));
      }
    });
    m.reading.paragraphs.forEach((p, i) => check(`${m.id} › lästext stycke ${i + 1}`, p, all));
    check(`${m.id} › lästext rubrik`, m.reading.titleSv, all);
    for (const q of m.reading.questions) {
      if (q.kind === 'choice') {
        check(`${m.id} › ${q.id} fråga`, q.promptSv, all);
        q.options.forEach((o, i) => check(`${m.id} › ${q.id} alternativ ${i + 1}`, o, all));
      } else check(`${m.id} › ${q.id} påstående`, q.statementSv, all);
      check(`${m.id} › ${q.id} förklaring`, q.explanationSv, all);
    }
  }

  // Comparisons: in the context of the first module that contains one of their senses.
  for (const c of repo.comparisons) {
    const mod = c.items.map((i) => moduleOfSense.get(i.senseId)).find(Boolean);
    const ctx = union(
      mod ? formsOfSenses(repo, [...prerequisiteClosure(repo, mod).flatMap((p) => p.words.map((w) => w.senseId)), ...mod.words.map((w) => w.senseId)]) : new Set(),
      formsOfSenses(repo, c.items.map((i) => i.senseId)),
    );
    check(`${c.id} summary`, c.summarySv, ctx);
    for (const it of c.items) { check(`${c.id} › ${it.senseId} note`, it.noteSv, ctx); check(`${c.id} › ${it.senseId} example`, it.exampleSv, ctx); }
  }

  // Words outside any module (dictionary-only entries): core + all module words + the word itself.
  const allModuleWords = formsOfSenses(repo, repo.modules.flatMap((m) => m.words.map((w) => w.senseId)));
  for (const e of repo.entries) {
    if (e.senses.some((s) => moduleOfSense.has(s.id))) continue;
    const own = union(allModuleWords, new Set(allForms(e)));
    for (const s of e.senses) {
      check(`${s.id} defSv`, s.defSv, own);
      s.examples.forEach((ex, i) => check(`${s.id} example ${i + 1}`, ex.sv, own));
    }
  }
  return issues;
}
