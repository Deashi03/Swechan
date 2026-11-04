import { useLiveQuery } from 'dexie-react-hooks';
import { getContent } from '../../content/repository';
import { ensureDailySession, reviewLoad } from '../../daily/dailySession';
import { confusedPairs, difficultItems } from '../../learning/knowledge';
import { pendingPersonalWords } from '../../modules/savedWords';
import { computeStats } from '../../stats/stats';
import { getDb } from '../../storage/db';
import { sessionConfig } from '../../config/appConfig';
import { navigate } from '../app/router';
import { Ja } from '../components/Ja';
import { ProgressBar } from '../components/Progress';
import { ComparisonView } from '../dictionary/ComparisonView';
import { useDictionarySheet } from '../dictionary/DictionarySheet';

const DIM_SV: Record<string, string> = { meaning: 'betydelse', spelling: 'stavning', inflection: 'böjning' };

export function ReviewHub() {
  const repo = getContent();
  const dict = useDictionarySheet();
  const data = useLiveQuery(async () => {
    const day = await ensureDailySession();
    const db = getDb();
    const [events, cards] = await Promise.all([db.reviewEvents.toArray(), db.cards.toArray()]);
    return { day, load: await reviewLoad(), difficult: difficultItems(events, cards).slice(0, 12), pairs: confusedPairs(events), pending: await pendingPersonalWords(), stats: await computeStats(), cardCount: cards.length };
  }, []);
  if (!data) return <p className="muted">Laddar…</p>;
  const { day, load, difficult, pairs, pending, stats } = data;

  return (
    <div className="stack">
      <h1>Repetition</h1>
      <section className="card tint-review stack-sm">
        <strong>Dagens repetition</strong>
        {day.noReviewMaterial ? <p className="small muted" style={{ margin: 0 }}>Inga tidigare inlärda ord ännu. Gör en modul först – orden kommer hit från och med i morgon.</p> : (
          <>
            <div className="small">{day.reviewIndex}/{day.reviewTarget} uppgifter</div>
            <ProgressBar value={day.reviewIndex} max={day.reviewTarget} label="Dagens repetition" />
            {day.reviewCompletedAt ? <span className="chip done">Klar ✓</span> : <button className="btn block" onClick={() => navigate({ name: 'reviewSession', mode: 'daily' })}>{day.reviewIndex ? 'Fortsätt' : 'Starta'}</button>}
          </>
        )}
      </section>

      {data.cardCount > 0 && (
        <section className="card stack-sm">
          <strong>Extra repetition (frivilligt)</strong>
          <div className="small">Förfallna ord idag: {load.dueToday}. {load.debt > 0 ? `${load.debt} ryms inte i dagens obligatoriska repetition.` : 'Alla förfallna ord ryms i dagens repetition.'}</div>
          {load.warn && (
            <div className="card tint-warning small" style={{ boxShadow: 'none' }}>
              Repetitionsskulden växer. Du kan göra extra repetitioner, höja det dagliga antalet i inställningarna, eller ta en dag med färre nya ord. Swechan ändrar aldrig din takt utan ditt godkännande.
            </div>
          )}
          <button className="btn secondary block" onClick={() => navigate({ name: 'reviewSession', mode: 'extra' })}>Repetera 10 ord till</button>
        </section>
      )}

      {pending.length > 0 && (
        <section className="card stack-sm">
          <strong>Egna ord att lära ({pending.length})</strong>
          <div className="small muted">Ord du har lagt till från ordboken. De introduceras först, och hamnar sedan i repetitionen.</div>
          <button className="btn secondary block" onClick={() => navigate({ name: 'personalLearn' })}>Lär dig {Math.min(5, pending.length)} ord</button>
        </section>
      )}

      <section>
        <div className="section-title">Svåra ord</div>
        {difficult.length === 0 ? <p className="small muted">Inga svåra ord just nu. Ord som du ofta svarar fel på visas här, uppdelat på betydelse, stavning och böjning.</p> : (
          <ul className="list card" style={{ padding: '0 16px' }}>
            {difficult.map((d) => {
              const ref = repo.getSense(d.senseId);
              if (!ref) return null;
              return (
                <li key={`${d.senseId}|${d.dimension}`}>
                  <button className="list-item" onClick={() => dict.open({ senseId: d.senseId })}>
                    <span className="grow"><strong lang="sv">{ref.entry.lemma}</strong> <Ja text={ref.sense.ja} className="small muted" /></span>
                    <span className="badge">{DIM_SV[d.dimension]}</span>
                    <span className="xsmall muted">{d.failures}/{d.total} fel</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {difficult.length > 0 && <p className="xsmall faint">Svåra ord prioriteras automatiskt i kommande repetitioner – t.ex. fler stavningsövningar för ord du ofta stavar fel.</p>}
      </section>

      {pairs.length > 0 && (
        <section className="stack-sm">
          <div className="section-title">Ord du blandar ihop</div>
          {pairs.map((p) => {
            const a = repo.getSense(p.a), b = repo.getSense(p.b);
            if (!a || !b) return null;
            const shared = repo.comparisonsForSense(p.a).find((c) => c.items.some((i) => i.senseId === p.b));
            if (shared) return <ComparisonView key={`${p.a}${p.b}`} cmp={shared} onOpenSense={(id) => dict.open({ senseId: id })} />;
            return (
              <div key={`${p.a}${p.b}`} className="card stack-sm small">
                <strong>{a.entry.lemma} ↔ {b.entry.lemma}</strong>
                {[a, b].map((r) => <div key={r.sense.id}><strong lang="sv">{r.entry.lemma}</strong>: <Ja text={r.sense.ja} /> — {r.sense.defSv}</div>)}
              </div>
            );
          })}
        </section>
      )}

      <section>
        <div className="section-title">Statistik</div>
        <div className="card small stack-sm">
          <div>Genomförda repetitionsuppgifter: <strong>{stats.reviewsDone}</strong></div>
          <div>Förstådda ord: <strong>{stats.levels.understood}</strong> · Aktivt behärskade: <strong>{stats.levels.active}</strong> · Långsiktigt befästa: <strong>{stats.levels.consolidated}</strong></div>
          <div className="muted xsmall">Dagligt mål: {day.reviewTarget || '—'} av max {sessionConfig.maxDailyReviewCount}. Ändra i inställningarna.</div>
        </div>
      </section>
    </div>
  );
}
