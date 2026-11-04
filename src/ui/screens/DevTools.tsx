/**
 * Developer tools panel (development phase only, devConfig.toolsEnabled).
 */
import { useEffect, useState } from 'react';
import { APP_VERSION, devConfig } from '../../config/appConfig';
import {
  addAllWordsToReview, completeTodaysReviewInstantly, getDevState, makeAllCardsDue, recreateTodaysReview, resetAllProgress, updateDevState, type DevState,
} from '../../dev/devTools';
import { now, todayStudyDate } from '../../lib/clock';
import { toast } from '../components/Toast';

export function DevToolsPanel() {
  const [st, setSt] = useState<DevState>(getDevState());
  const [today, setToday] = useState('');
  useEffect(() => { todayStudyDate(now()).then(setToday); }, [st.clockOffsetDays]);
  if (!devConfig.toolsEnabled) return null;
  const run = async (label: string, fn: () => Promise<unknown>) => { await fn(); toast(label); };
  const shift = async (d: number) => setSt(await updateDevState({ clockOffsetDays: st.clockOffsetDays + d }));
  return (
    <section className="card stack-sm" style={{ borderStyle: 'dashed' }}>
      <h2>Utvecklarverktyg</h2>
      <p className="xsmall muted">Bara under utvecklingen. Vid varje ny version nollställs all progression automatiskt{devConfig.resetProgressOnUpdate ? '' : ' (avstängt)'}; en återställningspunkt sparas (Säkerhetskopia → Ångra).</p>
      <div className="row between small">
        <span>Simulerat datum<br /><strong>{today}</strong>{st.clockOffsetDays !== 0 && <span className="muted"> ({st.clockOffsetDays > 0 ? '+' : ''}{st.clockOffsetDays} d)</span>}</span>
        <span className="row">
          <button className="btn secondary small" onClick={() => shift(-1)}>−1 dag</button>
          <button className="btn small" onClick={() => shift(1)}>+1 dag</button>
        </span>
      </div>
      {st.clockOffsetDays !== 0 && <button className="btn ghost small" onClick={async () => setSt(await updateDevState({ clockOffsetDays: 0 }))}>Tillbaka till riktigt datum</button>}
      <label className="row between small">
        <span>Lås upp alla modulsteg</span>
        <input type="checkbox" checked={st.unlockAllSteps} onChange={async (e) => setSt(await updateDevState({ unlockAllSteps: e.target.checked }))} style={{ width: 24, height: 24 }} />
      </label>
      <button className="btn secondary small" onClick={() => run('Alla ord ligger nu i repetitionen', addAllWordsToReview)}>Lägg alla ord i repetitionen</button>
      <button className="btn secondary small" onClick={() => run('Alla repetitionskort är förfallna', makeAllCardsDue)}>Gör alla repetitionskort förfallna nu</button>
      <button className="btn secondary small" onClick={() => run('Dagens repetition är planerad på nytt', recreateTodaysReview)}>Planera dagens repetition på nytt</button>
      <button className="btn secondary small" onClick={() => run('Dagens repetition markerad som klar', completeTodaysReviewInstantly)}>Slutför dagens repetition direkt</button>
      <button className="btn secondary small" style={{ color: 'var(--c-error)' }} onClick={async () => { if (confirm('Nollställa all progression nu? (En återställningspunkt sparas.)')) { await resetAllProgress('Progressionen nollställdes manuellt.'); location.reload(); } }}>Nollställ all progression</button>
      <p className="xsmall faint">Version {APP_VERSION}</p>
    </section>
  );
}
