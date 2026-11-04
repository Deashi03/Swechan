/**
 * Placeholder avatar ("Swe-kun"): a simple, original cute character drawn in SVG.
 * The component API (mood + reactions driven by learning events) is the
 * stable part; the artwork can later be replaced by the planned personal
 * avatar and richer animations without touching pedagogical code.
 */
import { useEffect, useState } from 'react';
import { subscribe, type LearningEvent } from '../../feedback/events';

export type AvatarMood = 'idle' | 'happy' | 'thinking' | 'cheer' | 'encourage';

const REACTIONS: Partial<Record<LearningEvent['type'], AvatarMood>> = {
  answer_correct: 'happy',
  answer_incorrect: 'encourage',
  word_mastered: 'cheer',
  review_completed: 'cheer',
  module_completed: 'cheer',
  daily_session_completed: 'cheer',
  streak_increased: 'cheer',
  streak_freeze_used: 'encourage',
};

/** Avatar state machine fed by the event bus; returns to the base mood after a reaction. */
export function useAvatarMood(base: AvatarMood = 'idle'): { mood: AvatarMood; pulse: number } {
  const [state, setState] = useState<{ mood: AvatarMood; pulse: number }>({ mood: base, pulse: 0 });
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

export function Avatar({ mood = 'idle', size = 64, pulse = 0 }: { mood?: AvatarMood; size?: number; pulse?: number }) {
  const anim = mood === 'happy' || mood === 'cheer' ? 'bounce' : mood === 'encourage' ? 'shake' : '';
  const eyes =
    mood === 'happy' || mood === 'cheer' ? (
      <g stroke="var(--c-text)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M34 50q5-6 10 0" /><path d="M56 50q5-6 10 0" />
      </g>
    ) : mood === 'thinking' ? (
      <g fill="var(--c-text)"><circle cx="40" cy="47" r="3.6" /><circle cx="62" cy="47" r="3.6" /><path d="M55 38l12-3" stroke="var(--c-text)" strokeWidth="2.5" strokeLinecap="round" /></g>
    ) : (
      <g fill="var(--c-text)"><circle cx="39" cy="50" r="4" /><circle cx="61" cy="50" r="4" /><circle cx="40.5" cy="48.5" r="1.3" fill="#fff" /><circle cx="62.5" cy="48.5" r="1.3" fill="#fff" /></g>
    );
  const mouth =
    mood === 'cheer' ? <path d="M42 60q8 10 16 0z" fill="var(--c-accent)" stroke="var(--c-text)" strokeWidth="2" strokeLinejoin="round" />
    : mood === 'thinking' ? <path d="M45 63h9" stroke="var(--c-text)" strokeWidth="2.5" strokeLinecap="round" />
    : mood === 'encourage' ? <path d="M44 61q6 5 12 0" stroke="var(--c-text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    : <path d="M44 60q6 6 12 0" stroke="var(--c-text)" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  return (
    <svg key={pulse} className={`avatar ${anim}`} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Swe-kun (${mood})`}>
      {/* knit hat */}
      <path d="M22 40q28-34 56 0z" fill="var(--c-primary-soft)" />
      <circle cx="50" cy="12" r="6" fill="var(--c-accent-soft)" />
      {/* face */}
      <ellipse cx="50" cy="56" rx="31" ry="28" fill="#fff4e6" stroke="#ead8c2" strokeWidth="2" />
      <rect x="20" y="36" width="60" height="9" rx="4.5" fill="var(--c-primary)" />
      {eyes}
      <ellipse cx="31" cy="60" rx="5" ry="3" fill="var(--c-accent-soft)" opacity="0.8" />
      <ellipse cx="69" cy="60" rx="5" ry="3" fill="var(--c-accent-soft)" opacity="0.8" />
      {mouth}
      {mood === 'cheer' && <g fill="var(--c-streak)"><path d="M86 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><path d="M12 26l1.5 3.5 3.5 1.5-3.5 1.5L12 36l-1.5-3.5L7 31l3.5-1.5z" /></g>}
    </svg>
  );
}
