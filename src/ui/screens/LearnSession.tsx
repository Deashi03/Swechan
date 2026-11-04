/**
 * Step-1 session player. Used for module words and for personal words.
 * Progress is persisted after every item (pause/resume safe).
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { getContent } from '../../content/repository';
import { generateExercise } from '../../learning/exercises/generate';
import type { ExerciseResult } from '../../learning/exercises/types';
import { advanceLearnSession, isLearnSessionDone, learnProgress } from '../../learning/learnPlan';
import { isWellBelowLevel } from '../../learning/placement';
import { now, todayStudyDate } from '../../lib/clock';
import { logLearnEvent } from '../../repetition/reviewService';
import { getMeta } from '../../storage/db';
import type { LearnSessionState, PlacementResult } from '../../storage/types';
import { Jonathan } from '../components/Jonathan';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/Progress';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { ExerciseView } from '../exercises/ExerciseView';
import { WordIntro } from '../exercises/WordIntro';

type Props = {
  state: LearnSessionState;
  poolSenseIds: string[];
  onSave: (s: LearnSessionState) => Promise<void>;
  onExit: () => void;
  onFinished: () => void;
  finishedLabel: string;
};

export function LearnSession({ state: initial, poolSenseIds, onSave, onExit, onFinished, finishedLabel }: Props) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState(false);
  const dict = useDictionarySheet();
  const placement = useLiveQuery(() => getMeta<PlacementResult>('placement'), []);
  const repo = getContent();
  const item = state.plan[state.index];
  const { done, total } = learnProgress(state);

  const exercise = useMemo(() => {
    if (!item || item.kind !== 'exercise') return null;
    return generateExercise(item.exerciseType as never, item.senseId, { repo, poolSenseIds, seed: state.seed + state.index * 7919 });
  }, [item, repo, poolSenseIds, state.seed, state.index]);

  const advance = async (outcome: Parameters<typeof advanceLearnSession>[1], result?: ExerciseResult) => {
    if (busy) return;
    setBusy(true);
    try {
      const next = advanceLearnSession(state, outcome);
      if (result) await logLearnEvent(result, now(), await todayStudyDate());
      await onSave(next);
      setState(next);
      window.scrollTo(0, 0);
    } finally {
      setBusy(false);
    }
  };

  if (isLearnSessionDone(state)) {
    const results = Object.values(state.results);
    const first = results.filter((r) => r === 'first').length;
    return (
      <div className="stack celebrate">
        <Jonathan mood="cheer" size={96} />
        <h1>Bra jobbat!</h1>
        <p className="muted">{first} av {results.length} övningar rätt på första försöket.</p>
        <button className="btn block" onClick={onFinished}>{finishedLabel}</button>
      </div>
    );
  }

  const compact = item?.kind === 'intro' && !!placement?.estimatedLevel && (() => {
    const ref = repo.getSense(item.senseId);
    return !!ref && isWellBelowLevel(ref.entry.level, placement.estimatedLevel);
  })();

  return (
    <div>
      <div className="session-bar">
        <button className="icon-btn" onClick={onExit} aria-label="Pausa och gå tillbaka"><Icon name="close" /></button>
        <ProgressBar value={done} max={total} label={`${done} av ${total}`} />
        <span className="xsmall muted" style={{ fontWeight: 800 }}>{done}/{total}</span>
        <button className="icon-btn" onClick={() => dict.open()} aria-label="Öppna ordboken"><Icon name="book" /></button>
      </div>
      {item?.kind === 'intro' && <WordIntro key={`${state.index}`} senseId={item.senseId} compact={compact} onNext={() => advance('seen')} />}
      {item?.kind === 'exercise' && exercise && (
        <ExerciseView key={`${state.index}`} exercise={exercise} onDone={(r) => advance(r.outcome, r)} />
      )}
      {item?.kind === 'exercise' && !exercise && (
        <div className="stack"><p className="muted">Övningen kunde inte skapas för det här ordet.</p><button className="btn" onClick={() => advance('seen')}>Hoppa över</button></div>
      )}
    </div>
  );
}
