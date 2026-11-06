/**
 * Exercise generators (pure functions of content + seed).
 */
import { stripFurigana } from '../../content/furigana';
import { acceptedForms, allForms, inflectionForms, tokenize } from '../../content/morphology';
import { imageDistractorAllowed, imageFor, quizImageFor } from '../../content/images';
import type { ContentRepository, SenseRef } from '../../content/repository';
import type { Inflection, VocabularyEntry } from '../../content/schema';
import { learnConfig } from '../../config/appConfig';
import { createRng, hashString, lazyShuffle, shuffle } from '../../lib/random';
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

const glossCache = new WeakMap<object, Set<string>>();
/** Gloss terms of a sense, cached per sense object (the repository's data is immutable). */
function glossSet(r: SenseRef): Set<string> {
  let s = glossCache.get(r.sense);
  if (!s) { s = new Set(glossTerms(r.sense.ja)); glossCache.set(r.sense, s); }
  return s;
}

/** Senses that must not be offered together with `target` (same word, synonym, shared Japanese gloss). */
function conflictsWith(target: SenseRef): (cand: SenseRef) => boolean {
  const rel = new Set((target.sense.synonyms ?? []).filter((r) => r.relation !== 'antonym').map((r) => r.senseId));
  const t = glossSet(target);
  return (cand) => {
    if (cand.sense.id === target.sense.id || cand.entry.id === target.entry.id) return true;
    if (rel.has(cand.sense.id)) return true;
    if ((cand.sense.synonyms ?? []).some((r) => r.senseId === target.sense.id && r.relation !== 'antonym')) return true;
    if (cand.entry.lemma === target.entry.lemma) return true;
    for (const x of glossSet(cand)) if (t.has(x)) return true;
    return false;
  };
}

const allSensesCache = new WeakMap<object, SenseRef[]>();
function allSenses(repo: ContentRepository): SenseRef[] {
  let a = allSensesCache.get(repo);
  if (!a) { a = repo.entries.flatMap((e) => e.senses.map((s) => repo.getSense(s.id)!)); allSensesCache.set(repo, a); }
  return a;
}

function distractors(target: SenseRef, ctx: GenContext, n: number, rng: () => number, filter?: (r: SenseRef) => boolean): SenseRef[] {
  const pool = ctx.poolSenseIds.map((id) => ctx.repo.getSense(id)).filter((r): r is SenseRef => !!r);
  const conflicts = conflictsWith(target);
  const ok = (r: SenseRef) => !conflicts(r) && (!filter || filter(r));
  const samePos = (r: SenseRef) => r.entry.pos === target.entry.pos;
  const poolOk = pool.filter(ok);
  const all = allSenses(ctx.repo);
  // Preference order: pool (same POS), whole vocabulary (same POS), pool, whole vocabulary.
  // The whole-vocabulary stages are shuffled lazily and only as far as needed: filtering and
  // shuffling every sense for each exercise made generation scale with the size of the content.
  function* ordered(): Generator<SenseRef> {
    yield* shuffle(poolOk.filter(samePos), rng);
    for (const r of lazyShuffle(all, rng)) if (samePos(r) && ok(r)) yield r;
    yield* shuffle(poolOk, rng);
    for (const r of lazyShuffle(all, rng)) if (ok(r)) yield r;
  }
  const out: SenseRef[] = [];
  const seenEntries = new Set<string>();
  const seenGloss = new Set<string>(glossSet(target));
  for (const r of ordered()) {
    if (out.length >= n) break;
    if (seenEntries.has(r.entry.id)) continue;
    // two distractors with the same Japanese gloss would show the same label twice
    const g = glossSet(r);
    if ([...g].some((x) => seenGloss.has(x))) continue;
    seenEntries.add(r.entry.id);
    for (const x of g) seenGloss.add(x);
    out.push(r);
  }
  return out;
}

function assemble(correct: ChoiceOption, wrong: ChoiceOption[], rng: () => number): { options: ChoiceOption[]; correctIndex: number } {
  const options = shuffle([correct, ...wrong], rng);
  return { options, correctIndex: options.indexOf(correct) };
}

const lemmaLabel = (e: VocabularyEntry) => (e.inflection.kind === 'noun' ? `${e.inflection.gender} ${e.lemma}` : e.lemma);

/**
 * Hide every form of the answer word in a text shown with a recall exercise
 * (feedback 0.4: "the answer is in the question"). Multi-word forms first.
 */
const maskCache = new WeakMap<object, RegExp>();
export function maskAnswer(text: string, entry: VocabularyEntry): string {
  // One alternation per entry (longest form first), compiled once: building a Unicode regex for
  // every form on every call dominated exercise generation.
  let re = maskCache.get(entry);
  if (!re) {
    const forms = [...new Set([entry.lemma, ...allForms(entry)].map((f) => f.toLowerCase()))].sort((a, b) => b.length - a.length);
    const alt = forms.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')).join('|');
    re = new RegExp(`(^|[^\\p{L}])(?:${alt})(?=$|[^\\p{L}])`, 'giu');
    maskCache.set(entry, re);
  }
  return text.replace(re, '$1＿＿＿');
}

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
    prompt: maskAnswer(ref.sense.ja, ref.entry), promptLang: 'ja', subPrompt: maskAnswer(ref.sense.defJa, ref.entry), subPromptLang: 'ja',
    instructionSv: 'Vilket svenskt ord passar?', instructionJa: 'どのスウェーデン{語|ご}ですか。',
    options, correctIndex,
    hint: { text: maskAnswer(ref.sense.defSv, ref.entry), lang: 'sv' },
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

/** Do two senses belong to the same topic? Then one may fit the other's sentence just as well. */
function sameTopic(a: SenseRef, b: SenseRef): boolean {
  const ta = new Set(a.sense.tags ?? []);
  return (b.sense.tags ?? []).some((t) => ta.has(t));
}

export function genContextChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed + 2);
  for (const ex of ref.sense.examples) {
    const hit = findFormInSentence(ex.sv, ref.entry);
    if (!hit) continue;
    const surface = ex.sv.slice(hit.start, hit.end);
    const keepCase = (w: string) => (surface[0] === surface[0]!.toUpperCase() ? w[0]!.toUpperCase() + w.slice(1) : w);
    const sameGender = (r: SenseRef) =>
      ref.entry.inflection.kind !== 'noun' || (r.entry.inflection.kind === 'noun' && r.entry.inflection.gender === ref.entry.inflection.gender);
    // Same word class, same form AND (for nouns) same gender, so grammar never gives the answer away.
    const sameForm = (r: SenseRef) => r.entry.pos === ref.entry.pos && sameGender(r) && formOf(r.entry.inflection, hit.formKey, r.entry.lemma) !== null;
    // Distractors come from OTHER topics, so only the target fits the sentence
    // ("Det ligger leksaker på ___": not säng/bord, which would also fit).
    const wrong = distractors(ref, ctx, learnConfig.choiceCount - 1, rng, (r) => sameForm(r) && !sameTopic(ref, r));
    if (wrong.length < 2) continue;
    const { options, correctIndex } = assemble(
      { senseId: ref.sense.id, label: keepCase(surface), lang: 'sv' },
      wrong.map((w) => ({ senseId: w.sense.id, label: keepCase(formOf(w.entry.inflection, hit.formKey, w.entry.lemma)!), lang: 'sv' as const })),
      rng,
    );
    return {
      type: 'context_choice', senseId: ref.sense.id, dimension: 'meaning',
      prompt: `${ex.sv.slice(0, hit.start)}＿＿＿${ex.sv.slice(hit.end)}`, promptLang: 'sv',
      instructionSv: 'Vilket ord passar i meningen?', instructionJa: '{文|ぶん}に{合|あ}う{言葉|ことば}はどれですか。',
      options, correctIndex,
      // The Japanese translation would give the answer away – it is a hint and shown with the result.
      hint: { text: ex.ja, lang: 'ja' },
      explanation: { text: ex.sv, lang: 'sv' },
      note: { text: ex.ja, lang: 'ja' },
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
    ...(imageFor(ref.sense.id) ? { image: ref.sense.id } : {}),
    prompt: maskAnswer(ref.sense.ja, ref.entry), promptLang: 'ja', subPrompt: maskAnswer(ref.sense.defJa, ref.entry), subPromptLang: 'ja',
    instructionSv: 'Skriv ordet på svenska.',
    instructionJa: 'スウェーデン{語|ご}で{書|か}いてください。',
    accepted,
    otherForms: allForms(e).filter((f) => !accepted.map((a) => a.toLowerCase()).includes(f)),
    hint: `Börjar på ”${e.lemma.slice(0, 1)}” · ${e.lemma.replace(/ /g, '').length} bokstäver`,
    explanation: { text: e.inflection.kind === 'noun' ? `${e.inflection.gender} ${e.lemma}` : e.lemma, lang: 'sv' },
  };
}

type InflectionTarget = { key: string; frame: [string, string] };

/**
 * Natural sentence frames in which exactly ONE form fits – no grammar terms.
 *   noun:  "Jag tänker på den/det ___."  "… på två ___."  "… på de ___."
 *   verb:  "Hon ___ (complement) nu."  "… i går."  "Hon har ___ …"
 *   adj:   "Det är ___."  "De är ___."  "Den här är ___ än den där."
 * A sense may override the verb subject/complement (`frame`), e.g. "Isen" for smälta.
 */
function inflectionTargets(e: VocabularyEntry, frame?: { subject?: string; complement?: string }): InflectionTarget[] {
  const i = e.inflection;
  switch (i.kind) {
    case 'noun': {
      const art = i.gender === 'en' ? 'den' : 'det';
      return [
        { key: 'defSg', frame: [`Jag tänker på ${art} `, '.'] },
        ...(i.indefPl ? [{ key: 'indefPl', frame: ['Jag tänker på två ', '.'] as [string, string] }] : []),
        ...(i.defPl ? [{ key: 'defPl', frame: ['Jag tänker på de ', '.'] as [string, string] }] : []),
      ];
    }
    case 'verb': {
      const subject = frame?.subject ?? 'Hon';
      const c = frame?.complement ? ` ${frame.complement}` : '';
      return [
        { key: 'present', frame: [`${subject} `, `${c} nu.`] },
        { key: 'past', frame: [`${subject} `, `${c} i går.`] },
        { key: 'supine', frame: [`${subject} har `, `${c}.`] },
      ];
    }
    case 'adjective':
      if (i.indeclinable) return [];
      return [
        { key: 'neuter', frame: ['Det är ', '.'] },
        { key: 'plural', frame: ['De är ', '.'] },
        ...(i.comparative ? [{ key: 'comparative', frame: ['Den här är ', ' än den där.'] as [string, string] }] : []),
      ];
    default:
      return [];
  }
}

export function hasInflectionExercise(e: VocabularyEntry): boolean {
  return inflectionTargets(e).length > 0;
}

/** All frames for a sense (used by the content validator and tests). */
export function inflectionFramesFor(ref: SenseRef): { key: string; sentence: string; accepted: string[] }[] {
  return inflectionTargets(ref.entry, ref.sense.frame).map((t) => {
    const accepted = acceptedForms(ref.entry.inflection, t.key);
    return { key: t.key, sentence: `${t.frame[0]}${accepted[0]}${t.frame[1]}`, accepted };
  });
}

export function genInflection(ref: SenseRef, ctx: GenContext): TypedExercise | null {
  const e = ref.entry;
  const targets = inflectionTargets(e, ref.sense.frame);
  if (!targets.length) return null;
  const rng = createRng(ctx.seed + 4);
  const t = targets[Math.floor(rng() * targets.length)]!;
  const accepted = acceptedForms(e.inflection, t.key);
  return {
    type: 'inflection', senseId: ref.sense.id, dimension: 'inflection',
    prompt: lemmaLabel(e), promptLang: 'sv',
    subPrompt: ref.sense.ja, subPromptLang: 'ja',
    instructionSv: 'Skriv ordet i den form som passar i meningen.',
    instructionJa: '{文|ぶん}に{合|あ}う{形|かたち}で{書|か}いてください。',
    frame: t.frame,
    accepted,
    otherForms: allForms(e).filter((f) => !accepted.map((a) => a.toLowerCase()).includes(f)),
    hint: `Börjar på ”${accepted[0]!.slice(0, Math.min(3, accepted[0]!.length - 1))}…”`,
    explanation: { text: inflectionForms(e.inflection).map((f) => f.form).join(' – '), lang: 'sv' },
  };
}

/** Wrong options for a picture exercise: only senses whose picture can never be mistaken for the target (see content/images). */
function imageDistractors(ref: SenseRef, ctx: GenContext, rng: () => number): SenseRef[] | null {
  if (!quizImageFor(ref.sense.id)) return null;
  const wrong = distractors(ref, ctx, learnConfig.choiceCount - 1, rng, (r) => imageDistractorAllowed(ref.sense.id, r.sense.id));
  return wrong.length < learnConfig.choiceCount - 1 ? null : wrong;
}

/** Picture → word (0.6). */
export function genImageChoice(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed + 5);
  const wrong = imageDistractors(ref, ctx, rng);
  if (!wrong) return null;
  const { options, correctIndex } = assemble(
    { senseId: ref.sense.id, label: lemmaLabel(ref.entry), lang: 'sv' },
    wrong.map((w) => ({ senseId: w.sense.id, label: lemmaLabel(w.entry), lang: 'sv' as const })),
    rng,
  );
  return {
    type: 'image_choice', senseId: ref.sense.id, dimension: 'meaning', image: ref.sense.id,
    prompt: '', promptLang: 'sv',
    instructionSv: 'Vilket ord passar till bilden?', instructionJa: '{絵|え}に{合|あ}う{言葉|ことば}はどれですか。',
    options, correctIndex,
    explanation: { text: ref.sense.ja, lang: 'ja' },
    note: { text: ref.sense.examples[0]!.sv, lang: 'sv' },
  };
}

/** Word → picture (0.6). */
export function genImagePick(ref: SenseRef, ctx: GenContext): ChoiceExercise | null {
  const rng = createRng(ctx.seed + 6);
  const wrong = imageDistractors(ref, ctx, rng);
  if (!wrong) return null;
  const opt = (r: SenseRef): ChoiceOption => ({ senseId: r.sense.id, label: lemmaLabel(r.entry), lang: 'sv', image: r.sense.id });
  const { options, correctIndex } = assemble(opt(ref), wrong.map(opt), rng);
  return {
    type: 'image_pick', senseId: ref.sense.id, dimension: 'meaning',
    prompt: lemmaLabel(ref.entry), promptLang: 'sv',
    instructionSv: 'Vilken bild passar till ordet?', instructionJa: '{言葉|ことば}に{合|あ}う{絵|え}はどれですか。',
    options, correctIndex,
    explanation: { text: ref.sense.ja, lang: 'ja' },
    note: { text: ref.sense.examples[0]!.sv, lang: 'sv' },
  };
}

const GENERATORS: Record<ExerciseType, (ref: SenseRef, ctx: GenContext) => ExerciseInstance | null> = {
  meaning_choice: genMeaningChoice,
  reverse_choice: genReverseChoice,
  context_choice: genContextChoice,
  synonym_choice: genSynonymChoice,
  image_choice: genImageChoice,
  image_pick: genImagePick,
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
