/**
 * Feedback System – app-wide learning events.
 * Pedagogical code emits events; visuals (avatar, confetti, future sounds)
 * subscribe. Nothing in the learning logic depends on a subscriber existing.
 */
export type LearningEvent =
  | { type: 'answer_correct'; senseId: string; firstTry: boolean }
  | { type: 'answer_incorrect'; senseId: string }
  | { type: 'word_mastered'; senseId: string }
  | { type: 'review_completed' }
  | { type: 'module_step_completed'; moduleId: string; step: string }
  | { type: 'module_completed'; moduleId: string }
  | { type: 'daily_session_completed'; date: string }
  | { type: 'streak_increased'; current: number }
  | { type: 'streak_freeze_used'; date: string }
  | { type: 'streak_freeze_earned'; freezes: number };

type Listener = (e: LearningEvent) => void;
const listeners = new Set<Listener>();

export function emit(e: LearningEvent): void {
  for (const l of listeners) {
    try { l(e); } catch (err) { console.error('feedback listener failed', err); }
  }
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
