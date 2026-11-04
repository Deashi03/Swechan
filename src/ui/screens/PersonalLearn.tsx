import { useEffect, useState } from 'react';
import { finishPersonalLearn, savePersonalLearn, startOrResumePersonalLearn } from '../../modules/savedWords';
import { navigate } from '../app/router';
import { LearnSession } from './LearnSession';

type PL = Awaited<ReturnType<typeof startOrResumePersonalLearn>>;

export function PersonalLearnScreen() {
  const [pl, setPl] = useState<PL | undefined>(undefined);
  useEffect(() => { startOrResumePersonalLearn().then(setPl); }, []);
  if (pl === undefined) return <p className="muted">Laddar…</p>;
  if (pl === null) return <div className="stack"><p>Inga ord i kön.</p><button className="btn" onClick={() => navigate({ name: 'review' })}>Tillbaka</button></div>;
  return (
    <LearnSession
      state={pl.learn}
      poolSenseIds={pl.senseIds}
      onSave={(learn) => savePersonalLearn({ ...pl, learn })}
      onExit={() => navigate({ name: 'review' })}
      finishedLabel="Lägg orden i min repetition"
      onFinished={async () => { await finishPersonalLearn(); navigate({ name: 'review' }, { replace: true }); }}
    />
  );
}
