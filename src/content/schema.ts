/**
 * Content System – validated data formats.
 *
 * All teaching content (dictionary, categories, modules, grammar notes,
 * synonym comparisons, placement items) is plain JSON validated by these Zod
 * schemas. Components never embed word lists or lesson text.
 */
import { z } from 'zod';

/** Japanese text with `{漢字|かんじ}` furigana markup (see furigana.ts). */
export const JaText = z.string().min(1);
export const Level = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export type Level = z.infer<typeof Level>;
export const LEVELS: readonly Level[] = Level.options;

export const PartOfSpeech = z.enum([
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'numeral', 'interjection', 'phrase',
]);
export type PartOfSpeech = z.infer<typeof PartOfSpeech>;

/**
 * Inflection is modelled per word class – there is deliberately no universal
 * paradigm. Every form is stored explicitly (no rule-based generation), so a
 * reviewer can check it and a correction propagates to every module.
 */
export const NounInflection = z.object({
  kind: z.literal('noun'),
  gender: z.enum(['en', 'ett']),
  indefSg: z.string(),
  defSg: z.string(),
  /** null = no plural in normal use (uncountable / mass noun). */
  indefPl: z.string().nullable(),
  defPl: z.string().nullable(),
  variants: z.record(z.array(z.string())).optional(),
});
export const VerbInflection = z.object({
  kind: z.literal('verb'),
  infinitive: z.string(),
  present: z.string(),
  past: z.string(),
  supine: z.string(),
  imperative: z.string(),
  /** Perfect participle (common gender), e.g. "belägrad". Optional. */
  pastParticiple: z.string().optional(),
  /** Conjugation group for teaching (1–4, or irregular). */
  group: z.enum(['1', '2', '3', '4', 'irregular']),
  /** Particle verbs: the stressed particle, e.g. "upp" in "plocka upp". */
  particle: z.string().optional(),
  reflexive: z.boolean().optional(),
  /** Accepted alternative forms, keyed by form name, e.g. { past: ["dammsugde"] }. */
  variants: z.record(z.array(z.string())).optional(),
});
export const AdjectiveInflection = z.object({
  kind: z.literal('adjective'),
  common: z.string(),
  neuter: z.string(),
  plural: z.string(),
  definite: z.string(),
  comparative: z.string().optional(),
  superlative: z.string().optional(),
  indeclinable: z.boolean().optional(),
  variants: z.record(z.array(z.string())).optional(),
});
export const NoInflection = z.object({ kind: z.literal('none') });
export const Inflection = z.discriminatedUnion('kind', [NounInflection, VerbInflection, AdjectiveInflection, NoInflection]);
export type Inflection = z.infer<typeof Inflection>;
export type NounInflection = z.infer<typeof NounInflection>;
export type VerbInflection = z.infer<typeof VerbInflection>;
export type AdjectiveInflection = z.infer<typeof AdjectiveInflection>;

export const ExampleSentence = z.object({ sv: z.string(), ja: JaText });
export type ExampleSentence = z.infer<typeof ExampleSentence>;

export const SynonymRelation = z.object({
  senseId: z.string(),
  relation: z.enum(['synonym', 'near', 'antonym', 'related']),
  noteSv: z.string().optional(),
  noteJa: JaText.optional(),
});
export type SynonymRelation = z.infer<typeof SynonymRelation>;

export const ReviewStatus = z.object({
  /** ai-draft = produced with AI assistance, not yet checked by a human reviewer. */
  status: z.enum(['ai-draft', 'reviewed']),
  reviewer: z.string().optional(),
  date: z.string().optional(),
});

export const WordSense = z.object({
  id: z.string().regex(/^s\.[\wåäöé-]+\.\d+$/),
  /** Short label distinguishing this sense from the headword's other senses, e.g. "substans", "skolämne". */
  labelSv: z.string().optional(),
  /** Japanese gloss with furigana markup. */
  ja: JaText,
  /** Extra Japanese search keys (plain text or markup), e.g. alternative translations. */
  jaAlt: z.array(z.string()).optional(),
  defSv: z.string(),
  defJa: JaText,
  /** Needs a real explanation (technical/historical/abstract), not just a gloss. Affects intro length. */
  concept: z.boolean().default(false),
  examples: z.array(ExampleSentence).min(1),
  collocations: z.array(z.string()).optional(),
  register: z.enum(['neutral', 'informal', 'formal', 'technical', 'historical', 'literary']).default('neutral'),
  usageNote: z.object({ sv: z.string(), ja: JaText }).optional(),
  synonyms: z.array(SynonymRelation).optional(),
  /** Ids of reusable Japanese-language grammar notes (grammarNotes.json). */
  grammarNotes: z.array(z.string()).optional(),
  /** Sentence frame parts for form exercises, e.g. subject "Isen" for "smälta" (default subject "Hon"). */
  frame: z.object({ subject: z.string().optional(), complement: z.string().optional() }).optional(),
  /** Tags (topic labels) for search and grouping. */
  tags: z.array(z.string()).optional(),
  quality: ReviewStatus,
});
export type WordSense = z.infer<typeof WordSense>;

export const VocabularyEntry = z.object({
  id: z.string().regex(/^e\.[\wåäöé-]+$/),
  lemma: z.string(),
  pos: PartOfSpeech,
  level: Level,
  inflection: Inflection,
  /** Optional stress/pronunciation hint in Swedish, e.g. "betoning på andra stavelsen". */
  pronunciationNote: z.string().optional(),
  senses: z.array(WordSense).min(1),
});
export type VocabularyEntry = z.infer<typeof VocabularyEntry>;

export const DictionaryFile = z.object({ entries: z.array(VocabularyEntry) });

export const GrammarNote = z.object({
  id: z.string(),
  titleSv: z.string(),
  titleJa: JaText,
  bodyJa: JaText,
  examples: z.array(ExampleSentence),
});
export type GrammarNote = z.infer<typeof GrammarNote>;
export const GrammarNotesFile = z.object({ notes: z.array(GrammarNote) });

export const Comparison = z.object({
  id: z.string(),
  titleSv: z.string(),
  titleJa: JaText,
  summarySv: z.string(),
  summaryJa: JaText,
  items: z
    .array(
      z.object({
        senseId: z.string(),
        /** 1 (weak) – 5 (strong), when the group differs in intensity. */
        intensity: z.number().int().min(1).max(5).optional(),
        formality: z.enum(['informal', 'neutral', 'formal']).optional(),
        noteSv: z.string(),
        noteJa: JaText,
        exampleSv: z.string(),
      }),
    )
    .min(2),
});
export type Comparison = z.infer<typeof Comparison>;
export const ComparisonsFile = z.object({ comparisons: z.array(Comparison) });

export const Category = z.object({
  id: z.string().regex(/^c\.[\w.-]+$/),
  parentId: z.string().nullable(),
  nameSv: z.string(),
  nameJa: JaText,
  order: z.number(),
  icon: z.string().optional(),
});
export type Category = z.infer<typeof Category>;
export const CategoriesFile = z.object({ categories: z.array(Category) });

export const ChoiceQuestion = z.object({
  kind: z.literal('choice'),
  id: z.string(),
  /** Question type, for analysis: detail | cause | usage | inference */
  focus: z.enum(['detail', 'cause', 'usage', 'inference']),
  promptSv: z.string(),
  options: z.array(z.string()).min(2).max(5),
  correctIndex: z.number().int().min(0),
  explanationSv: z.string(),
  explanationJa: JaText.optional(),
});
export const TrueFalseQuestion = z.object({
  kind: z.literal('truefalse'),
  id: z.string(),
  focus: z.enum(['detail', 'cause', 'usage', 'inference']),
  statementSv: z.string(),
  correct: z.boolean(),
  explanationSv: z.string(),
  explanationJa: JaText.optional(),
});
export const ReadingQuestion = z.discriminatedUnion('kind', [ChoiceQuestion, TrueFalseQuestion]);
export type ReadingQuestion = z.infer<typeof ReadingQuestion>;

export const ModuleWord = z.object({
  senseId: z.string(),
  /** true = productive (active) vocabulary: spelling & inflection are trained and prioritised. */
  active: z.boolean(),
});
export type ModuleWord = z.infer<typeof ModuleWord>;

export const ReadingText = z.object({
  titleSv: z.string(),
  paragraphs: z.array(z.string()).min(1),
  questions: z.array(ReadingQuestion).min(3),
  /** Where the facts were checked (free text). */
  factSources: z.array(z.string()).optional(),
});
export type ReadingText = z.infer<typeof ReadingText>;

export const ConversationConfig = z.object({
  scenarioSv: z.string(),
  discussionPoints: z.array(z.string()).min(2),
  /** How many of the active words to emphasise (default: all active words). */
  focusCount: z.number().int().positive().optional(),
});
export type ConversationConfig = z.infer<typeof ConversationConfig>;

export const Module = z.object({
  id: z.string().regex(/^m\.[\w.-]+$/),
  contentVersion: z.number().int().positive(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  titleSv: z.string(),
  titleJa: JaText,
  descriptionSv: z.string(),
  descriptionJa: JaText,
  categoryId: z.string(),
  tags: z.array(z.string()),
  level: Level,
  /** Recommended (never required) earlier modules. */
  prerequisites: z.array(z.string()),
  related: z.array(z.string()),
  /** Order hint for "Dagens modul" recommendations (lower first). */
  recommendedOrder: z.number(),
  words: z.array(ModuleWord).min(20).max(30),
  reading: ReadingText,
  conversation: ConversationConfig,
});
export type Module = z.infer<typeof Module>;

export const PlacementItem = z.object({
  id: z.string(),
  level: Level,
  kind: z.enum(['meaning', 'spelling', 'inflection']),
  /** meaning: Swedish word shown; spelling: Japanese cue shown; inflection: instruction */
  promptSv: z.string(),
  promptJa: JaText.optional(),
  options: z.array(z.string()).optional(),
  /** Correct option (meaning) or accepted typed answers. */
  answers: z.array(z.string()).min(1),
});
export type PlacementItem = z.infer<typeof PlacementItem>;
export const PlacementFile = z.object({ items: z.array(PlacementItem) });
