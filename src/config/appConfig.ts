/**
 * Central, non-UI configuration. Pedagogical and gamification rules live
 * here (or in user settings) — never hard-coded inside components.
 */
export const APP_VERSION = '0.30.0';

/**
 * Development-phase switches (decided with the product owner in 0.3.1).
 * resetProgressOnUpdate: every new APP_VERSION starts all users from zero
 *   (a restore point is saved first). MUST be set to false before real use –
 *   it intentionally overrides the "preserve user data" rule.
 * toolsEnabled: shows the developer tools (time travel, unlock, shortcuts).
 */
export const devConfig = {
  resetProgressOnUpdate: true,
  toolsEnabled: true,
} as const;

export const streakConfig = {
  /** Freezes a brand-new user starts with. */
  initialFreezes: 1,
  /** Maximum freezes that can be stored. */
  maxFreezes: 2,
  /** A new freeze is earned after this many completed study days. */
  earnFreezeEveryCompletedDays: 7,
} as const;
export type StreakConfig = { initialFreezes: number; maxFreezes: number; earnFreezeEveryCompletedDays: number };

export const sessionConfig = {
  /** Default number of review tasks in the daily session (user-adjustable 20–25+). */
  defaultDailyReviewCount: 25,
  minDailyReviewCount: 10,
  maxDailyReviewCount: 60,
  /** Review debt (due cards not covered by today's session) above which we suggest adjusting pace. */
  debtWarningThreshold: 40,
} as const;

export const learnConfig = {
  /** Words introduced per mini-batch in step 1. */
  batchSize: 5,
  /** Attempts before the correct answer is shown. */
  maxAttempts: 2,
  /** Number of options in multiple choice exercises. */
  choiceCount: 4,
} as const;

export const repetitionConfig = {
  requestRetention: 0.9,
  maximumIntervalDays: 3650,
  /** Card stability (days) required for "långsiktigt befäst". */
  consolidatedStabilityDays: 21,
} as const;

export const externalLinks = {
  chatgpt: 'https://chatgpt.com/',
} as const;
