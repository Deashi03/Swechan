/**
 * Exercise generators (pure functions of content + seed).
 */
import { stripFurigana } from '../../content/furigana';
import { acceptedForms, allForms, inflectionForms, tokenize } from '../../content/morphology';
import type { ContentRepository, SenseRef } from '../../content/repository';
import type { Inflection, VocabularyEntry } from '../../content/schema';
import { learnConfig } from '../../config/appConfig';
import { createRng, hashString, shuffle } from '../../lib/random';
import type { ChoiceExercise, ChoiceOption, ExerciseInstance, ExerciseType, TypedExercise } from './types';

export type GenContext = {
  repo: ContentRepository;
  /** Preferred distractor pool (e.g. the module's words or the learner's known words). */
  poolSenseIds: string[];
  seed: number;
};

const POS_SV: Record<string, string> = {
  noun: 'substantiv', verb: 'verb', adjective: 'adjektiv', adverb: 'adverb', preposition: 'preposition',
  conjunction: 'konjunktion', pronoun: 'pronomen', numeral: 'räkneord', interjection: 'interjektion', phrase: 'fras',
};
export const posSv = (pos: string) => POS_SV[pos] ?? pos;

function glossTerms(markup: string): string[] {
  return stripFurigana(markup).split(/[、；;,（）()]/).map((s) => s.trim()).filter((s) => s.length > 0);
}

/** Senses that must not be used as distractors because they could also be a correct answer. */
function conflicts(target: SenseRef, cand: SenseRef): boolean {
  if (cand.sense.id === target.sense.id || cand.entry.id === target.entry.id) return true;
  const rel = new Set((target.sense.synonyms ?? []).filter((r) => r.relation !== 'antonym').map((r) => r.senseId));
  if (rel.has(cand.sense.id)) return true;
  if ((cand.sense.synonyms ?? []).some((r) => r.senseId === target.sense.id && r.relation !== 'antonym')) return true;
  const t = new Set(glossTerms(target.sense.ja));
  return glossTerms(cand.sense.ja).some((x) => t.has(x)) || cand.entry.lemma === target.entry.lemma;
}

function distractors(target: SenseRef, ctx: GenContext, n: number, rng: () => number, filter?: (r: SenseRef) => boolean): SenseRef[] {
  const pool = ctx.poolSenseIds.map((id) => ctx.repo.getSense(id)).filter((r): r is SenseRef => !!r);
  const all = ctx.repo.entries.flatMap((e) => e.senses.map((_, i) => ctx.repo.getSense(e.senses[i]!.id)!));
  const ok = (r: SenseRef) => !conflicts(target, r) && (!filter || filter(r));
  const samePos = (r: SenseRef) => r.entry.pos === target.entry.pos;
  const ordered = [
    ...shuffle(pool.filter((r) => ok(r) && samePos(r)), rng),
    ...shuffle(all.filter((r) => ok(r) && samePos(r)), rng),
    ...shuffle(pool.filter(ok), rng),
    ...shuffle(all.filter(ok), rng),
  ];
  const out: SenseRef[] = [];
  const seenEntries = new Set<string>();
  for (const r of ordered) {
    if (out.length >= n) break;
    if (seenEntries.has(r.entry.id)) continue;
    seenEntries.add(r.entry.id);
    out.push(r);
  }
  return out;
}

function assemble(correct: ChoiceOption, wrong: ChoiceOption[], rng: () => number): { options: ChoiceOption[]; correctIndex: number } {
  const options = shuffle([correct, ...wrong], rng);
  return { options, correctIndex: options.indexOf(correct) };
}

const lemmaLabel = (e: VocabularyEntry) => (e.inflection.kind === 'noun' ? `${e.inflection.gender} ${e.lemma}` : e.lemma);

function contextLine(ref: SenseRef): string | undefined {
  // Multi-sense headwords: show an example so the intended meaning is unambiguous.
  return ref.entry.senses.length > 1 ? ref.sense.examples[0]!.sv : undefined;
}

export function genMeaningChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed);
  const wrong = distractors(ref, ctx, learnConfig.choiceCount - 1, rng);
  if (wrong.length < 2) return null;
  const { options, correctIndex } = assemble(
    { senseId: ref.sense.id, label: ref.sense.ja, lang: 'ja' },
    wrong.map((w) => ({ senseId: w.sense.id, label: w.sense.ja, lang: 'ja' as const })),
    rng,
  );
  const ctxLine = contextLine(ref);
  return {
    type: 'meaning_choice', senseId: ref.sense.id, dimension: 'meaning',
    prompt: lemmaLabel(ref.entry), promptLang: 'sv',
    subPrompt: ctxLine, subPromptLang: 'sv',
    instructionSv: ctxLine ? 'Vad betyder ordet i den här meningen?' : 'Vad betyder ordet?',
    instructionJa: ctxLine ? 'この{文|ぶん}では、どういう{意味|いみ}ですか。' : 'どういう{意味|いみ}ですか。',
    options, correctIndex,
    hint: { text: ref.sense.examples[0]!.sv, lang: 'sv' },
    explanation: { text: ref.sense.defJa, lang: 'ja' },
  };
}

export function genReverseChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed + 1);
  const wrong = distractors(ref, ctx, learnConfig.choiceCount - 1, rng);
  if (wrong.length < 2) return null;
  const { options, correctIndex } = assemble(
    { senseId: ref.sense.id, label: lemmaLabel(ref.entry), lang: 'sv' },
    wrong.map((w) => ({ senseId: w.sense.id, label: lemmaLabel(w.entry), lang: 'sv' as const })),
    rng,
  );
  return {
    type: 'reverse_choice', senseId: ref.sense.id, dimension: 'meaning',
    prompt: ref.sense.ja, promptLang: 'ja', subPrompt: ref.sense.defJa, subPromptLang: 'ja',
    instructionSv: 'Vilket svenskt ord passar?', instructionJa: 'どのスウェーデン{語|ご}ですか。',
    options, correctIndex,
    hint: { text: ref.sense.defSv, lang: 'sv' },
    explanation: { text: ref.sense.examples[0]!.sv, lang: 'sv' },
  };
}

/** Find the form key of `entry` used in `sentence`; returns the token span. */
function findFormInSentence(sentence: string, entry: VocabularyEntry): { start: number; end: number; formKey: string | null } | null {
  const tokens = tokenize(sentence).filter((t) => t.isWord);
  const forms = inflectionForms(entry.inflection);
  const formKeyOf = (surface: string): string | null => {
    const s = surface.toLowerCase();
    for (const f of forms) {
      const plain = f.key === 'indefSg' && entry.inflection.kind === 'noun' ? entry.inflection.indefSg : f.form;
      if (plain.toLowerCase() === s || acceptedForms(entry.inflection, f.key).some((x) => x.toLowerCase() === s)) return f.key;
    }
    return s === entry.lemma.toLowerCase() ? 'lemma' : null;
  };
  const wordsInLemma = entry.lemma.split(' ').length;
  for (let i = 0; i + wordsInLemma <= tokens.length; i++) {
    const span = tokens.slice(i, i + wordsInLemma);
    const surface = sentence.slice(span[0]!.start, span[span.length - 1]!.end);
    if (allForms(entry).includes(surface.toLowerCase())) return { start: span[0]!.start, end: span[span.length - 1]!.end, formKey: formKeyOf(surface) };
  }
  return null;
}

function formOf(infl: Inflection, key: string | null, lemma: string): string | null {
  if (key === null || key === 'lemma') return lemma;
  if (infl.kind === 'noun' && key === 'indefSg') return infl.indefSg;
  const v = (infl as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : null;
}

export function genContextChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed + 2);
  for (const ex of ref.sense.examples) {
    const hit = findFormInSentence(ex.sv, ref.entry);
    if (!hit) continue;
    const surface = ex.sv.slice(hit.start, hit.end);
    const keepCase = (w: string) => (surface[0] === surface[0]!.toUpperCase() ? w[0]!.toUpperCase() + w.slice(1) : w);
    const wrong = distractors(ref, ctx, learnConfig.choiceCount - 1, rng, (r) => r.entry.pos === ref.entry.pos && formOf(r.entry.inflection, hit.formKey, r.entry.lemma) !== null);
    if (wrong.length < 2) continue;
    const { options, correctIndex } = assemble(
      { senseId: ref.sense.id, label: keepCase(surface), lang: 'sv' },
      wrong.map((w) => ({ senseId: w.sense.id, label: keepCase(formOf(w.entry.inflection, hit.formKey, w.entry.lemma)!), lang: 'sv' as const })),
      rng,
    );
    return {
      type: 'context_choice', senseId: ref.sense.id, dimension: 'meaning',
      prompt: `${ex.sv.slice(0, hit.start)}＿＿＿${ex.sv.slice(hit.end)}`, promptLang: 'sv',
      subPrompt: ex.ja, subPromptLang: 'ja',
      instructionSv: 'Vilket ord passar i meningen?', instructionJa: '{文|ぶん}に{合|あ}う{言葉|ことば}はどれですか。',
      options, correctIndex,
      hint: { text: ref.sense.ja, lang: 'ja' },
      explanation: { text: ex.sv, lang: 'sv' },
    };
  }
  return null;
}

export function genSynonymChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const cmp = ctx.repo.comparisonsForSense(ref.sense.id)[0];
  if (!cmp) return null;
  const rng = createRng(ctx.seed + 3);
  const item = cmp.items.find((i) => i.senseId === ref.sense.id)!;
  const opts: ChoiceOption[] = cmp.items.map((i) => ({ senseId: i.senseId, label: ctx.repo.getSense(i.senseId)!.entry.lemma, lang: 'sv' }));
  const correct = opts.find((o) => o.senseId === ref.sense.id)!;
  const options = shuffle(opts, rng);
  return {
    type: 'synonym_choice', senseId: ref.sense.id, dimension: 'meaning',
    prompt: item.noteSv, promptLang: 'sv', subPrompt: item.noteJa, subPromptLang: 'ja',
    instructionSv: 'Vilket av de närliggande orden passar beskrivningen bäst?', instructionJa: '{説明|せつめい}にいちばん{合|あ}う{言葉|ことば}はどれですか。',
    options, correctIndex: options.indexOf(correct),
    hint: { text: cmp.summaryJa, lang: 'ja' },
    explanation: { text: `${item.exampleSv}`, lang: 'sv' },
    comparisonId: cmp.id,
  };
}

export function genSpelling(ref: SenseRef, ctx: GenContext): TypedExercise {
  void ctx;
  const e = ref.entry;
  const accepted = e.inflection.kind === 'noun' ? [e.lemma, `${e.inflection.gender} ${e.lemma}`] : [e.lemma];
  return {
    type: 'spelling', senseId: ref.sense.id, dimension: 'spelling',
    prompt: ref.sense.ja, promptLang: 'ja', subPrompt: ref.sense.defJa, subPromptLang: 'ja',
    instructionSv: `Skriv det svenska ordet (grundform, ${posSv(e.pos)}).`,
    instructionJa: 'スウェーデン{語|ご}で{書|か}いてください（{基本形|きほんけい}）。',
    accepted,
    otherForms: allForms(e).filter((f) => !accepted.map((a) => a.toLowerCase()).includes(f)),
    hint: `Börjar på ”${e.lemma.slice(0, 1)}” · ${e.lemma.replace(/ /g, '').length} bokstäver`,
    explanation: { text: e.inflection.kind === 'noun' ? `${e.inflection.gender} ${e.lemma}` : e.lemma, lang: 'sv' },
  };
}

type InflectionTarget = { key: string; frame?: [string, string] };

function inflectionTargets(e: VocabularyEntry): InflectionTarget[] {
  const i = e.inflection;
  switch (i.kind) {
    case 'noun':
      return [
        { key: 'defSg' },
        ...(i.indefPl ? [{ key: 'indefPl', frame: ['två ', ''] as [string, string] }] : []),
        ...(i.defPl ? [{ key: 'defPl', frame: ['alla ', ''] as [string, string] }] : []),
      ];
    case 'verb':
      return [
        { key: 'present', frame: ['Hon ', ' varje dag.'] },
        { key: 'past', frame: ['I går ', ' hon.'] },
        { key: 'supine', frame: ['Hon har ', '.'] },
      ];
    case 'adjective':
      if (i.indeclinable) return [];
      return [
        { key: 'neuter', frame: ['ett ', ' …'] },
        { key: 'plural', frame: ['två ', ' …'] },
        ...(i.comparative ? [{ key: 'comparative' }] : []),
      ];
    default:
      return [];
  }
}

export function hasInflectionExercise(e: VocabularyEntry): boolean {
  return inflectionTargets(e).length > 0;
}

export function genInflection(ref: SenseRef, ctx: GenContext): TypedExercise | null {
  const e = ref.entry;
  const targets = inflectionTargets(e);
  if (!targets.length) return null;
  const rng = createRng(ctx.seed + 4);
  const t = targets[Math.floor(rng() * targets.length)]!;
  const info = inflectionForms(e.inflection).find((f) => f.key === t.key)!;
  const accepted = acceptedForms(e.inflection, t.key);
  // Particle verbs: "I går plockade undan hon" is wrong word order – use neutral frame.
  const frame = e.inflection.kind === 'verb' && e.inflection.particle && t.key === 'past' ? (['Hon ', ' i går.'] as [string, string]) : t.frame;
  const genderHint = e.inflection.kind === 'noun' ? ` (${e.inflection.gender}-ord)` : '';
  return {
    type: 'inflection', senseId: ref.sense.id, dimension: 'inflection',
    prompt: `${e.lemma}${genderHint}`, promptLang: 'sv',
    subPrompt: ref.sense.ja, subPromptLang: 'ja',
    instructionSv: `Skriv formen: ${info.labelSv}`,
    instructionJa: `${info.labelJa}を{書|か}いてください。`,
    frame,
    accepted,
    otherForms: allForms(e).filter((f) => !accepted.map((a) => a.toLowerCase()).includes(f)),
    hint: `Börjar på ”${accepted[0]!.slice(0, Math.min(3, accepted[0]!.length - 1))}…”`,
    explanation: {
      text: inflectionForms(e.inflection).map((f) => f.form).join(' – '),
      lang: 'sv',
    },
  };
}

const GENERATORS: Record<ExerciseType, (ref: SenseRef, ctx: GenContext) => ExerciseInstance | null> = {
  meaning_choice: genMeaningChoice,
  reverse_choice: genReverseChoice,
  context_choice: genContextChoice,
  synonym_choice: genSynonymChoice,
  spelling: genSpelling,
  inflection: genInflection,
};

const FALLBACK: ExerciseType[] = ['reverse_choice', 'meaning_choice'];

/** Generate an exercise; falls back to a simpler meaning exercise if the requested type is not applicable. */
export function generateExercise(type: ExerciseType, senseId: string, ctx: GenContext): ExerciseInstance | null {
  const ref = ctx.repo.getSense(senseId);
  if (!ref) return null;
  const seeded = { ...ctx, seed: ctx.seed ^ hashString(senseId + type) };
  const first = GENERATORS[type](ref, seeded);
  if (first) return first;
  for (const fb of FALLBACK) {
    const x = GENERATORS[fb](ref, seeded);
    if (x) return x;
  }
  return null;
}
