/**
 * Repetition Engine – scheduler interface.
 * The rest of the app only talks to `Scheduler`; the algorithm (currently
 * FSRS via ts-fsrs) can be swapped or re-parameterised behind it.
 */
import type { Rating, SchedulerState } from '../storage/types';

export type ScheduledState = { sched: SchedulerState; due: number };

export interface Scheduler {
  readonly name: string;
  /** State for a card that has never been reviewed. */
  initial(now: Date): ScheduledState;
  /** Apply a review result. Works for on-time, overdue AND early reviews. */
  review(current: ScheduledState, rating: Rating, now: Date): ScheduledState;
  /** Estimated probability (0–1) of recalling the card at `now`. */
  retrievability(current: ScheduledState, now: Date): number;
}
