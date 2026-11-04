/**
 * Review player for the daily mandatory review and optional extra reviews.
 * Each answer is persisted immediately (schedule + history + session index).
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { getContent } from '../../content/repository';
import { completeExtraReview, completeReviewItem, ensureDailySession, planExtraReviews } from '../../daily/dailySession';
import { generateExercise } from '../../learning/exercises/generate';
import type { ExerciseResult, ExerciseType } from '../../learning/exercises/types';
import { hashString } from '../../lib/random';
import { getDb } from '../../storage/db';
import type { Dimension } from '../../storage/types';
import { navigate } from '../app/router';
import { Jonathan } from '../components/Jonathan';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/Progress';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { ExerciseView } from '../exercises/ExerciseView';

const MEANING_TYPES: ExerciseType[] = ['meaning_choice', 'reverse_choice', 'context_choice', 'synonym_choice'];

/** Vary exercise types for the meaning dimension deterministically per card and day. */
export function exerciseTypeFor(cardIdValue: string, dimension: Dimension, date: string): ExerciseType {
  if (dimension === 'spelling') return 'spelling';
  if (dimension === 'inflection') return 'inflection';
  return MEANING_TYPES[hashString(cardIdValue + date) % MEANING_TYPES.length]!;
}

export function ReviewSession({ mode }: { mode: 'daily' | 'extra' }) {
  const [date, setDate] = useState<string | null>(null);
  const [extra, setExtra] = useState<{ ids: string[]; index: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const dict = useDictionarySheet();
  useEffect(() => {
    ensureDailySession().then((d) => setDate(d.date));
    if (mode === 'extra') planExtraReviews(10).then((ids) => setExtra({ ids, index: 0 }));
  }, [mode]);
  const day = useLiveQuery(() => (date ? getDb().dailySessions.get(date) : undefined), [date]);
  const pool = useLiveQuery(async () => [...new Set((await getDb().cards.toArray()).map((c) => c.senseId))], [], []);

  const ids = mode === 'daily' ? day?.reviewPlan ?? [] : extra?.ids ?? [];
  const index = mode === 'daily' ? day?.reviewIndex ?? 0 : extra?.index ?? 0;
  const currentId = ids[index];
  const card = useLiveQuery(() => (currentId ? getDb().cards.get(currentId) : undefined), [currentId]);
  const exercise = useMemo(() => {
    if (!card || !date || card.id !== currentId) return null;
    return generateExercise(exerciseTypeFor(card.id, card.dimension, date), card.senseId, { repo: getContent(), poolSenseIds: pool, seed: hashString(card.id + date) });
  }, [card, date, pool, currentId]);

  const onDone = async (r: ExerciseResult) => {
    if (!currentId || !date || busy) return;
    setBusy(true);
    try {
      // The card's dimension decides which memory is updated, even if a fallback exercise type was shown.
      const result = { ...r, dimension: card!.dimension };
      if (mode === 'daily') await completeReviewItem(date, currentId, result);
      else { await completeExtraReview(currentId, result); setExtra((e) => (e ? { ...e, index: e.index + 1 } : e)); }
      window.scrollTo(0, 0);
    } finally {
      setBusy(false);
    }
  };

  if (!date || (mode === 'daily' && !day) || (mode === 'extra' && !extra)) return <p className="muted">Laddar…</p>;
  if (!currentId) {
    return (
      <div className="celebrate stack">
        <Jonathan mood="cheer" size={96} />
        <h1>{ids.length === 0 ? 'Inget att repetera just nu' : mode === 'daily' ? 'Dagens repetition är klar!' : 'Extra repetition klar!'}</h1>
        <p className="muted">{ids.length > 0 && `${ids.length} uppgifter genomförda.`}</p>
        <button className="btn block" onClick={() => navigate({ name: 'home' })}>Till startsidan</button>
        {mode === 'extra' && ids.length > 0 && <button className="btn secondary block" onClick={() => planExtraReviews(10).then((n) => setExtra({ ids: n, index: 0 }))}>10 till</button>}
      </div>
    );
  }
  return (
    <div>
      <div className="session-bar">
        <button className="icon-btn" onClick={() => navigate({ name: mode === 'daily' ? 'home' : 'review' })} aria-label="Pausa"><Icon name="close" /></button>
        <ProgressBar value={index} max={ids.length} label={`${index} av ${ids.length}`} />
        <span className="xsmall muted" style={{ fontWeight: 800 }}>{index}/{ids.length}</span>
        <button className="icon-btn" onClick={() => dict.open()} aria-label="Öppna ordboken"><Icon name="book" /></button>
      </div>
      {exercise ? <ExerciseView key={`${currentId}-${index}`} exercise={exercise} onDone={onDone} />
        : card && card.id === currentId ? <div className="stack"><p className="muted">Det här ordet finns inte längre i innehållet och kan inte visas.</p><button className="btn" onClick={() => navigate({ name: 'home' })}>Till startsidan</button></div>
        : <p className="muted">Laddar…</p>}
    </div>
  );
}
