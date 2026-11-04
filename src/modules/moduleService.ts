/**
 * Module progression (three steps: learn → read → converse).
 * Progress is saved after every answered item so a module can be paused and
 * resumed at any point. When all three steps are done the module is
 * completed, its words enter the review pool, and the daily session is told.
 */
import { getContent } from '../content/repository';
import type { Module } from '../content/schema';
import { registerModuleCompletion } from '../daily/dailySession';
import { emit } from '../feedback/events';
import { dimensionsForWord, newLearnSession } from '../learning/learnPlan';
import { levelIndex } from '../learning/placement';
import { now as clockNow, todayStudyDate } from '../lib/clock';
import { hashString } from '../lib/random';
import { addWordsToReview, outcomeToRating } from '../repetition/reviewService';
import { getDb, getMeta } from '../storage/db';
import type { Dimension, LearnSessionState, ModuleProgressRecord, PlacementResult, Rating, StepId } from '../storage/types';

export async function getModuleProgress(moduleId: string): Promise<ModuleProgressRecord | undefined> {
  return getDb().moduleProgress.get(moduleId);
}

function freshProgress(m: Module, at: Date): ModuleProgressRecord {
  return {
    moduleId: m.id,
    contentVersion: m.contentVersion,
    status: 'in_progress',
    startedAt: at.getTime(),
    steps: { learn: 'not_started', read: 'not_started', converse: 'not_started' },
  };
}

/** Start or resume step 1. Returns the persisted learn session. */
export async function startOrResumeLearn(moduleId: string, at: Date = clockNow()): Promise<LearnSessionState> {
  const repo = getContent();
  const m = repo.getModule(moduleId);
  if (!m) throw new Error(`Unknown module ${moduleId}`);
  const db = getDb();
  return db.transaction('rw', db.moduleProgress, async () => {
    const p = (await db.moduleProgress.get(moduleId)) ?? freshProgress(m, at);
    if (p.learn) return p.learn;
    const learn = newLearnSession(m.words, repo, hashString(`${moduleId}:${at.getTime()}`));
    await db.moduleProgress.put({ ...p, learn, steps: { ...p.steps, learn: 'in_progress' } });
    return learn;
  });
}

export async function saveLearnState(moduleId: string, learn: LearnSessionState): Promise<void> {
  const db = getDb();
  await db.transaction('rw', db.moduleProgress, async () => {
    const p = await db.moduleProgress.get(moduleId);
    if (p) await db.moduleProgress.put({ ...p, learn });
  });
}

export async function saveReadState(moduleId: string, read: NonNullable<ModuleProgressRecord['read']>, at: Date = clockNow()): Promise<void> {
  const m = getContent().getModule(moduleId);
  if (!m) return;
  const db = getDb();
  await db.transaction('rw', db.moduleProgress, async () => {
    const p = (await db.moduleProgress.get(moduleId)) ?? freshProgress(m, at);
    await db.moduleProgress.put({ ...p, read, steps: { ...p.steps, read: p.steps.read === 'completed' ? 'completed' : 'in_progress' } });
  });
}

/** Is the step available? Steps unlock in order (pedagogical sequence), all are always visible. */
export function isStepUnlocked(p: ModuleProgressRecord | undefined, step: StepId): boolean {
  if (step === 'learn') return true;
  if (step === 'read') return p?.steps.learn === 'completed';
  return p?.steps.read === 'completed';
}

export async function completeStep(moduleId: string, step: StepId, at: Date = clockNow()): Promise<ModuleProgressRecord> {
  const repo = getContent();
  const m = repo.getModule(moduleId);
  if (!m) throw new Error(`Unknown module ${moduleId}`);
  const db = getDb();
  const today = await todayStudyDate(at);
  const updated = await db.transaction('rw', db.moduleProgress, async () => {
    const p = (await db.moduleProgress.get(moduleId)) ?? freshProgress(m, at);
    return { ...p, steps: { ...p.steps, [step]: 'completed' } } as ModuleProgressRecord;
  });
  emit({ type: 'module_step_completed', moduleId, step });
  const allDone = updated.steps.learn === 'completed' && updated.steps.read === 'completed' && updated.steps.converse === 'completed';
  if (!allDone || updated.status === 'completed') {
    await db.moduleProgress.put(updated);
    return updated;
  }
  // Module completed → words enter the review pool with ratings from step 1.
  const results = updated.learn?.results ?? {};
  const words = m.words.map((w) => {
    const dims = dimensionsForWord(w, repo);
    const ratings: Partial<Record<Dimension, Rating>> = {};
    for (const d of dims) {
      const r = results[`${w.senseId}|${d}`];
      ratings[d] = r ? outcomeToRating(r) : 'hard';
    }
    return { senseId: w.senseId, dimensions: dims, ratings };
  });
  await addWordsToReview(words, 'module', at, today);
  const completed: ModuleProgressRecord = { ...updated, status: 'completed', completedAt: at.getTime(), completedDate: today };
  await db.moduleProgress.put(completed);
  emit({ type: 'module_completed', moduleId });
  await registerModuleCompletion(moduleId, at);
  return completed;
}

/**
 * "Dagens modul": a module in progress if there is one (most recently
 * started); otherwise the first uncompleted module whose recommended
 * prerequisites are done (modules build on each other), in recommended
 * order, preferring modules near the learner's estimated level.
 * Prerequisites are recommendations only – any module can still be opened.
 */
export async function recommendedModule(): Promise<Module | undefined> {
  const repo = getContent();
  const progress = await getDb().moduleProgress.toArray();
  const inProgress = progress.filter((p) => p.status === 'in_progress').sort((a, b) => b.startedAt - a.startedAt);
  for (const p of inProgress) { const m = repo.getModule(p.moduleId); if (m) return m; }
  const done = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.moduleId));
  const open = repo.modules.filter((m) => !done.has(m.id));
  const ready = open.filter((m) => m.prerequisites.every((id) => done.has(id) || !repo.getModule(id)));
  const candidates = ready.length ? ready : open;
  const placement = await getMeta<PlacementResult>('placement');
  const lvl = levelIndex(placement?.estimatedLevel);
  if (lvl < 0) return candidates[0];
  return [...candidates].sort((a, b) => Math.abs(levelIndex(a.level) - lvl) - Math.abs(levelIndex(b.level) - lvl) || a.recommendedOrder - b.recommendedOrder)[0];
}

/** Recommended prerequisites of a module that are not yet completed. */
export function missingPrerequisites(m: Module, completed: Set<string>): Module[] {
  const repo = getContent();
  return m.prerequisites.filter((id) => !completed.has(id)).map((id) => repo.getModule(id)).filter((x): x is Module => !!x);
}
