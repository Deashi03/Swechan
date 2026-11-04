import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { getContent } from '../../content/repository';
import { completeStep, getModuleProgress, saveLearnState, startOrResumeLearn } from '../../modules/moduleService';
import type { LearnSessionState } from '../../storage/types';
import { navigate } from '../app/router';
import { LearnSession } from './LearnSession';

export function ModuleLearnScreen({ id }: { id: string }) {
  const m = getContent().getModule(id);
  const [state, setState] = useState<LearnSessionState | null>(null);
  const progress = useLiveQuery(() => getModuleProgress(id), [id]);
  useEffect(() => { if (m) startOrResumeLearn(id).then(setState); }, [id, m]);
  if (!m) return <p>Modulen finns inte.</p>;
  if (!state) return <p className="muted">Laddar…</p>;
  const alreadyDone = progress?.steps.learn === 'completed';
  return (
    <LearnSession
      state={state}
      poolSenseIds={m.words.map((w) => w.senseId)}
      onSave={(s) => saveLearnState(id, s)}
      onExit={() => navigate({ name: 'module', id })}
      finishedLabel="Vidare till läsningen"
      onFinished={async () => {
        if (!alreadyDone) await completeStep(id, 'learn');
        navigate({ name: 'read', id }, { replace: true });
      }}
    />
  );
}
