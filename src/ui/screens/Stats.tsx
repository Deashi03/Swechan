import { useLiveQuery } from 'dexie-react-hooks';
import { computeStats } from '../../stats/stats';
import { navigate } from '../app/router';
import { useStreak } from '../app/hooks';

const LEVELS = [
  { key: 'introduced', sv: 'Introducerade', help: 'Du har mött ordet.' },
  { key: 'understood', sv: 'Förstådda', help: 'Rätt betydelse på första försöket minst en gång.' },
  { key: 'active', sv: 'Aktivt behärskade', help: 'Du har stavat ordet (och böjt det, om det har en böjningsövning) rätt på första försöket.' },
  { key: 'consolidated', sv: 'Långsiktigt befästa', help: 'Alla repetitionskort har minnesstabilitet ≥ 21 dagar och du har svarat rätt minst 21 dagar efter att ordet lades till.' },
] as const;

export function StatsScreen() {
  const stats = useLiveQuery(() => computeStats(), []);
  const streak = useStreak();
  if (!stats) return <p className="muted">Laddar…</p>;
  const tl = stats.timeline.slice(-30);
  const max = Math.max(1, ...tl.map((t) => t.introduced));
  return (
    <div className="stack">
      <button className="btn ghost small" style={{ paddingLeft: 0 }} onClick={() => history.back()}>‹ Tillbaka</button>
      <h1>Statistik</h1>
      <section className="card stack-sm">
        {LEVELS.map((l) => (
          <div key={l.key} className="row between">
            <span>{l.sv}<br /><span className="xsmall muted">{l.help}</span></span>
            <strong style={{ fontSize: 'var(--fs-lg)' }}>{stats.levels[l.key]}</strong>
          </div>
        ))}
      </section>
      <section className="card small stack-sm">
        <div className="row between"><span>Genomförda moduler</span><strong>{stats.modulesCompleted}</strong></div>
        <div className="row between"><span>Genomförda repetitionsuppgifter</span><strong>{stats.reviewsDone}</strong></div>
        <div className="row between"><span>Aktuell streak</span><strong>{streak?.current ?? 0}</strong></div>
        <div className="row between"><span>Längsta streak</span><strong>{streak?.longest ?? 0}</strong></div>
        <div className="row between"><span>Studiedagar totalt</span><strong>{streak?.totalCompletedDays ?? 0}</strong></div>
      </section>
      <section className="card stack-sm">
        <strong>Introducerade ord över tid</strong>
        {tl.length === 0 ? <p className="small muted">Ingen historik ännu.</p> : (
          <>
            <div className="bar-chart" aria-label="Antal introducerade ord per studiedag (kumulativt)">
              {tl.map((t) => <span key={t.date} style={{ height: `${(t.introduced / max) * 100}%` }} title={`${t.date}: ${t.introduced}`} />)}
            </div>
            <div className="row between xsmall muted"><span>{tl[0]!.date}</span><span>{tl[tl.length - 1]!.date}</span></div>
          </>
        )}
      </section>
      <button className="btn secondary" onClick={() => navigate({ name: 'home' })}>Till startsidan</button>
    </div>
  );
}
