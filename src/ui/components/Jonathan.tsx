/**
 * Jonathan – the app's companion avatar.
 *
 * 0.3 ships a deliberate placeholder (a friendly "J" monogram). The planned
 * illustrated Jonathan avatar replaces only the inside of this component:
 * size, placement, mood states and event-driven reactions are already wired
 * up everywhere it appears (home header, intro, celebrations).
 */
import { useEffect, useState } from 'react';
import { subscribe, type LearningEvent } from '../../feedback/events';

export type JonathanMood = 'idle' | 'happy' | 'thinking' | 'cheer' | 'encourage';

const REACTIONS: Partial<Record<LearningEvent['type'], JonathanMood>> = {
  answer_correct: 'happy',
  answer_incorrect: 'encourage',
  word_mastered: 'cheer',
  review_completed: 'cheer',
  module_completed: 'cheer',
  daily_session_completed: 'cheer',
  streak_increased: 'cheer',
  streak_freeze_used: 'encourage',
};

/** Mood state machine fed by the learning-event bus; returns to the base mood after a reaction. */
export function useJonathanMood(base: JonathanMood = 'idle'): { mood: JonathanMood; pulse: number } {
  const [state, setState] = useState<{ mood: JonathanMood; pulse: number }>({ mood: base, pulse: 0 });
  useEffect(() => setState((s) => ({ ...s, mood: base })), [base]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const off = subscribe((e) => {
      const m = REACTIONS[e.type];
      if (!m) return;
      setState((s) => ({ mood: m, pulse: s.pulse + 1 }));
      clearTimeout(t);
      t = setTimeout(() => setState((s) => ({ ...s, mood: base })), 1600);
    });
    return () => { off(); clearTimeout(t); };
  }, [base]);
  return state;
}

const MOOD_LABEL: Record<JonathanMood, string> = { idle: '', happy: 'glad', thinking: 'fundersam', cheer: 'firar', encourage: 'uppmuntrar' };

export function Jonathan({ mood = 'idle', size = 48, pulse = 0 }: { mood?: JonathanMood; size?: number; pulse?: number }) {
  const anim = mood === 'happy' || mood === 'cheer' ? 'bounce' : mood === 'encourage' ? 'shake' : '';
  return (
    <div
      key={pulse}
      className={`jonathan ${anim}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      role="img"
      aria-label={`Jonathan${MOOD_LABEL[mood] ? ` (${MOOD_LABEL[mood]})` : ''}`}
    >
      J
      {mood === 'cheer' && <span aria-hidden style={{ position: 'absolute', right: -4, top: -6, fontSize: Math.round(size * 0.32) }}>✨</span>}
    </div>
  );
}
