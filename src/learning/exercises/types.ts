/**
 * Exercise model. Each exercise type has:
 *  - a generator (content → instance, may return null if not applicable),
 *  - a validator (instance + answer → result),
 *  - a presentation component (src/ui/exercises/*), registered in the UI registry.
 * All types produce the same `ExerciseResult`, so session engines never need
 * to know type-specific details.
 */
import type { Dimension } from '../../storage/types';

export type ExerciseType = 'meaning_choice' | 'reverse_choice' | 'context_choice' | 'synonym_choice' | 'spelling' | 'inflection';

export type ChoiceOption = { senseId: string | null; label: string; lang: 'sv' | 'ja' };

type Base = { senseId: string; dimension: Dimension };

export type ChoiceExercise = Base & {
  type: 'meaning_choice' | 'reverse_choice' | 'context_choice' | 'synonym_choice';
  /** Main prompt (Swedish text or Japanese markup). */
  prompt: string;
  promptLang: 'sv' | 'ja';
  /** Optional secondary line, e.g. disambiguating context or Japanese definition. */
  subPrompt?: string;
  subPromptLang?: 'sv' | 'ja';
  instructionSv: string;
  instructionJa: string;
  options: ChoiceOption[];
  correctIndex: number;
  /** Hint shown after the first wrong attempt (Japanese markup or Swedish). */
  hint?: { text: string; lang: 'sv' | 'ja' };
  /** Shown with the result. */
  explanation?: { text: string; lang: 'sv' | 'ja' };
  /** Extra line shown with the result (e.g. the Japanese translation of a context sentence). */
  note?: { text: string; lang: 'sv' | 'ja' };
  comparisonId?: string;
};

export type TypedExercise = Base & {
  type: 'spelling' | 'inflection';
  prompt: string;
  promptLang: 'sv' | 'ja';
  subPrompt?: string;
  subPromptLang?: 'sv' | 'ja';
  instructionSv: string;
  instructionJa: string;
  /** Sentence frame around the answer slot, e.g. ["två ", ""] */
  frame?: [string, string];
  accepted: string[];
  /** Forms of the right word that are not the requested form. */
  otherForms: string[];
  hint: string;
  explanation?: { text: string; lang: 'sv' | 'ja' };
};

export type ExerciseInstance = ChoiceExercise | TypedExercise;

export function isChoice(e: ExerciseInstance): e is ChoiceExercise {
  return e.type !== 'spelling' && e.type !== 'inflection';
}

export const DIMENSION_OF: Record<ExerciseType, Dimension> = {
  meaning_choice: 'meaning',
  reverse_choice: 'meaning',
  context_choice: 'meaning',
  synonym_choice: 'meaning',
  spelling: 'spelling',
  inflection: 'inflection',
};

export type Outcome = 'first' | 'retry' | 'failed';

/** Standard result format for every exercise type. */
export type ExerciseResult = {
  senseId: string;
  dimension: Dimension;
  exerciseType: ExerciseType;
  outcome: Outcome;
  attempts: number;
  confusedWithSenseId?: string;
};
