/**
 * User data model (stored locally in IndexedDB).
 * Content (words, modules) is NEVER copied into user data – records refer to
 * content by stable ids (senseId, moduleId). This keeps user progress intact
 * when content is corrected or reorganised.
 */
import type { Level } from '../content/schema';
import type { StudyDate } from '../lib/date';

/** Knowledge dimensions that are scheduled separately. */
export type Dimension = 'meaning' | 'spelling' | 'inflection';
export const DIMENSIONS: readonly Dimension[] = ['meaning', 'spelling', 'inflection'];

export type Rating = 'again' | 'hard' | 'good' | 'easy';

/** Algorithm-specific memory state, opaque to everything except the scheduler. */
export type SchedulerState = {
  algorithm: 'fsrs';
  stability: number;
  difficulty: number;
  state: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  /** ms epoch */
  lastReview?: number;
};

export type ReviewCardRecord = {
  /** `${senseId}|${dimension}` */
  id: string;
  senseId: string;
  dimension: Dimension;
  /** Study date when the card entered the review pool (module completed / personal word learned). */
  createdDate: StudyDate;
  createdAt: number;
  /** ms epoch of next due time (indexed). */
  due: number;
  sched: SchedulerState;
  source: 'module' | 'personal';
};

export type ExercisePhase = 'learn' | 'review' | 'extra';

export type ReviewEventRecord = {
  id?: number;
  cardId?: string;
  senseId: string;
  dimension: Dimension;
  exerciseType: string;
  phase: ExercisePhase;
  correct: boolean;
  attempts: number;
  rating?: Rating;
  at: number;
  date: StudyDate;
  /** Next due time the scheduler assigned (review phases). */
  nextDue?: number;
  /** For choice exercises: the sense the learner wrongly picked. */
  confusedWithSenseId?: string;
};

export type StepId = 'learn' | 'read' | 'converse';
export const STEP_IDS: readonly StepId[] = ['learn', 'read', 'converse'];
export type StepStatus = 'not_started' | 'in_progress' | 'completed';

export type LearnPlanItem =
  | { kind: 'intro'; senseId: string }
  | { kind: 'exercise'; senseId: string; exerciseType: string; dimension: Dimension; retry?: boolean };

/** Outcome of a sense/dimension during an introduction session. */
export type LearnOutcome = 'first' | 'retry' | 'failed';

export type LearnSessionState = {
  seed: number;
  plan: LearnPlanItem[];
  index: number;
  /** key `${senseId}|${dimension}` */
  results: Record<string, LearnOutcome>;
};

export type ModuleProgressRecord = {
  moduleId: string;
  contentVersion: number;
  status: 'in_progress' | 'completed';
  startedAt: number;
  completedAt?: number;
  completedDate?: StudyDate;
  steps: Record<StepId, StepStatus>;
  learn?: LearnSessionState;
  read?: { answers: Record<string, boolean>; questionIndex: number; textRead: boolean };
};

export type DailySessionRecord = {
  date: StudyDate;
  reviewTarget: number;
  /** Card ids planned for today's mandatory review, fixed when the day starts. */
  reviewPlan: string[];
  reviewIndex: number;
  reviewCompletedAt?: number;
  /** True if there were no earlier-learned words to review today. */
  noReviewMaterial: boolean;
  /** Modules completed on this date. */
  modulesCompleted: string[];
  completedAt?: number;
  extraReviewsDone: number;
};

export type SavedWordRecord = {
  senseId: string;
  savedAt: number;
  /** User asked to learn this word outside a module. */
  queuedForLearning: boolean;
  /** Set when the word has been introduced and added to the review pool. */
  learnedAt?: number;
};

export type DayMark = 'completed' | 'frozen';

export type StreakState = {
  current: number;
  longest: number;
  freezes: number;
  /** Last date whose outcome has been settled (completed, frozen or missed). */
  lastSettledDate: StudyDate;
  /** Completed days counted towards the next earned freeze. */
  completedTowardFreeze: number;
  totalCompletedDays: number;
  history: Record<StudyDate, DayMark>;
};

export type Settings = {
  dailyReviewCount: number;
  furigana: boolean;
  reducedMotion: 'system' | 'reduce' | 'full';
  /** null = device local time zone. */
  timeZone: string | null;
  ttsRate: number;
};

export type PlacementResult = {
  takenAt: number;
  skipped: boolean;
  /** Estimated vocabulary band. NOT an official CEFR assessment. */
  estimatedLevel: Level | null;
  perLevel: Partial<Record<Level, { correct: number; total: number }>>;
};

export type MetaKey = 'settings' | 'streak' | 'placement' | 'installDate' | 'restorePoint' | 'personalLearn' | 'onboarded';
