/**
 * FSRS scheduler (ts-fsrs, MIT, https://github.com/open-spaced-repetition/ts-fsrs).
 *
 * Configuration choices:
 * - enable_short_term = false: no intra-day learning steps. Swechan does its
 *   own short-term practice inside module step 1, so FSRS schedules in whole
 *   days from the first rating.
 * - Default FSRS parameters (not yet personalised/optimised per user).
 * - Early reviews (e.g. supplementary daily reviews) are passed to FSRS with
 *   the real elapsed time; FSRS then grows stability less than for an on-time
 *   review, which is the algorithm's documented behaviour.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating as FR, type Card, type Grade } from 'ts-fsrs';
import { repetitionConfig } from '../config/appConfig';
import type { Rating } from '../storage/types';
import type { ScheduledState, Scheduler } from './scheduler';

const RATING: Record<Rating, Grade> = { again: FR.Again, hard: FR.Hard, good: FR.Good, easy: FR.Easy };

function toCard(s: ScheduledState): Card {
  return {
    due: new Date(s.due),
    stability: s.sched.stability,
    difficulty: s.sched.difficulty,
    elapsed_days: 0,
    scheduled_days: s.sched.scheduledDays,
    learning_steps: s.sched.learningSteps,
    reps: s.sched.reps,
    lapses: s.sched.lapses,
    state: s.sched.state,
    last_review: s.sched.lastReview !== undefined ? new Date(s.sched.lastReview) : undefined,
  };
}

function fromCard(c: Card): ScheduledState {
  return {
    due: c.due.getTime(),
    sched: {
      algorithm: 'fsrs',
      stability: c.stability,
      difficulty: c.difficulty,
      state: c.state,
      scheduledDays: c.scheduled_days,
      learningSteps: c.learning_steps,
      reps: c.reps,
      lapses: c.lapses,
      lastReview: c.last_review?.getTime(),
    },
  };
}

export class FsrsScheduler implements Scheduler {
  readonly name = 'FSRS (ts-fsrs 5, default parameters)';
  private f;
  constructor(opts: { fuzz?: boolean } = {}) {
    this.f = fsrs(
      generatorParameters({
        request_retention: repetitionConfig.requestRetention,
        maximum_interval: repetitionConfig.maximumIntervalDays,
        enable_fuzz: opts.fuzz ?? true,
        enable_short_term: false,
      }),
    );
  }
  initial(now: Date): ScheduledState {
    return fromCard(createEmptyCard(now));
  }
  review(current: ScheduledState, rating: Rating, now: Date): ScheduledState {
    return fromCard(this.f.next(toCard(current), now, RATING[rating]).card);
  }
  retrievability(current: ScheduledState, now: Date): number {
    if (current.sched.reps === 0) return 0;
    return this.f.get_retrievability(toCard(current), now, false);
  }
}

let shared: Scheduler | null = null;
export function getScheduler(): Scheduler {
  if (!shared) shared = new FsrsScheduler();
  return shared;
}
export function setSchedulerForTests(s: Scheduler | null) { shared = s; }
