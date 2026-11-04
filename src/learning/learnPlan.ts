/**
 * Step 1 ("Lära sig orden") session plan.
 *
 * Words are introduced in small batches (default 5). Each batch:
 *   1. short introduction card per word (longer for concept words),
 *   2. recognition round (meaning or reverse choice),
 *   3. context/production round (context choice; spelling for active words),
 *   4. form/nuance round (inflection for active words; synonym nuance where a comparison exists).
 * Exercise types vary between words; items are interleaved so the same word
 * is not practised twice in a row. Failed items are re-queued a few steps later.
 */
import { learnConfig } from '../config/appConfig';
import type { ContentRepository } from '../content/repository';
import type { ModuleWord } from '../content/schema';
import { createRng, shuffle } from '../lib/random';
import type { Dimension, LearnOutcome, LearnPlanItem, LearnSessionState } from '../storage/types';
import { hasInflectionExercise } from './exercises/generate';
import type { ExerciseType } from './exercises/types';
import { DIMENSION_OF } from './exercises/types';
import { spreadBySense } from '../repetition/selection';

const ex = (senseId: string, exerciseType: ExerciseType): LearnPlanItem => ({ kind: 'exercise', senseId, exerciseType, dimension: DIMENSION_OF[exerciseType] });

export function buildLearnPlan(words: ModuleWord[], repo: ContentRepository, seed: number): LearnPlanItem[] {
  const rng = createRng(seed);
  const plan: LearnPlanItem[] = [];
  for (let b = 0; b < words.length; b += learnConfig.batchSize) {
    const batch = words.slice(b, b + learnConfig.batchSize);
    for (const w of batch) plan.push({ kind: 'intro', senseId: w.senseId });
    const r1: LearnPlanItem[] = [];
    const r2: LearnPlanItem[] = [];
    const r3: LearnPlanItem[] = [];
    batch.forEach((w, i) => {
      const ref = repo.getSense(w.senseId);
      if (!ref) return;
      r1.push(ex(w.senseId, i % 2 === 0 ? 'meaning_choice' : 'reverse_choice'));
      r2.push(ex(w.senseId, i % 2 === 0 ? 'context_choice' : 'reverse_choice'));
      if (w.active) r2.push(ex(w.senseId, 'spelling'));
      if (w.active && hasInflectionExercise(ref.entry)) r3.push(ex(w.senseId, 'inflection'));
      if (repo.comparisonsForSense(w.senseId).length) r3.push(ex(w.senseId, 'synonym_choice'));
    });
    const batchNo = b / learnConfig.batchSize;
    const start = plan.length;
    for (const round of [r1, r2, r3]) plan.push(...spreadBySense(shuffle(round, rng)));
    for (let i = start - batch.length; i < plan.length; i++) plan[i] = { ...plan[i]!, batch: batchNo };
  }
  return plan;
}

export function newLearnSession(words: ModuleWord[], repo: ContentRepository, seed: number): LearnSessionState {
  return { seed, plan: buildLearnPlan(words, repo, seed), index: 0, results: {} };
}

const SEVERITY: Record<LearnOutcome, number> = { first: 0, retry: 1, failed: 2 };

/** Record an exercise outcome and advance. Pure: returns a new state. */
export function advanceLearnSession(state: LearnSessionState, outcome: LearnOutcome | 'seen'): LearnSessionState {
  const item = state.plan[state.index];
  if (!item) return state;
  const plan = [...state.plan];
  const results = { ...state.results };
  if (item.kind === 'exercise' && outcome !== 'seen') {
    if (!item.retry) {
      const key = `${item.senseId}|${item.dimension}`;
      const prev = results[key];
      if (!prev || SEVERITY[outcome] > SEVERITY[prev]) results[key] = outcome;
    }
    if (outcome === 'failed' && !item.retry) {
      plan.splice(Math.min(state.index + 4, plan.length), 0, { ...item, retry: true });
    }
  }
  return { ...state, plan, results, index: state.index + 1 };
}

export function isLearnSessionDone(state: LearnSessionState): boolean {
  return state.index >= state.plan.length;
}

export function learnProgress(state: LearnSessionState): { done: number; total: number } {
  return { done: Math.min(state.index, state.plan.length), total: state.plan.length };
}

/**
 * Progress shown to the learner: only the current part (batch of ~5 words),
 * never the long total ("32/122" was demoralising – feedback 0.3.1).
 */
export function batchProgress(state: LearnSessionState): { part: number; parts: number; doneInPart: number; sizeOfPart: number } {
  const batchOf = (i: number) => state.plan[i]?.batch ?? 0;
  const parts = state.plan.length ? Math.max(...state.plan.map((p) => p.batch ?? 0)) + 1 : 1;
  const idx = Math.min(state.index, state.plan.length - 1);
  const part = batchOf(idx);
  let first = idx;
  while (first > 0 && batchOf(first - 1) === part) first--;
  let last = idx;
  while (last + 1 < state.plan.length && batchOf(last + 1) === part) last++;
  return { part: part + 1, parts, doneInPart: Math.max(0, state.index - first), sizeOfPart: last - first + 1 };
}

/** Dimensions that get their own review card for a word. */
export function dimensionsForWord(word: ModuleWord, repo: ContentRepository): Dimension[] {
  const ref = repo.getSense(word.senseId);
  if (!ref) return [];
  if (!word.active) return ['meaning'];
  return ['meaning', 'spelling', ...(hasInflectionExercise(ref.entry) ? (['inflection'] as Dimension[]) : [])];
}
