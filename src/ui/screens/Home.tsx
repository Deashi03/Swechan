import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { getContent } from '../../content/repository';
import { ensureDailySession, reviewLoad } from '../../daily/dailySession';
import { getModuleProgress, recommendedModule } from '../../modules/moduleService';
import { calendarDays } from '../../streak/streak';
import { computeStats } from '../../stats/stats';
import { getDb, getMeta } from '../../storage/db';
import { weekOf, weekdayShortSv } from '../../lib/date';
import { href, navigate } from '../app/router';
import { useStreak, useToday } from '../app/hooks';
import { Avatar, useAvatarMood } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { ProgressBar } from '../components/Progress';
import { moduleStatusLabel } from './ModuleOverview';

export function Home() {
  const today = useToday();
  const [ready, setReady] = useState(false);
  useEffect(() => { if (today) ensureDailySession().then(() => setReady(true)); }, [today]);
  const day = useLiveQuery(() => (today ? getDb().dailySessions.get(today) : undefined), [today, ready]);
  const streak = useStreak();
  const installDate = useLiveQuery(() => getMeta<string>('installDate'), []);
  const rec = useLiveQuery(() => recommendedModule(), [day?.modulesCompleted.length]);
  const recProgress = useLiveQuery(() => (rec ? getModuleProgress(rec.id) : undefined), [rec?.id]);
  const stats = useLiveQuery(() => computeStats(), [day?.reviewIndex, day?.modulesCompleted.length]);
  const load = useLiveQuery(() => (ready ? reviewLoad() : undefined), [ready, day?.reviewIndex]);
  const reviewDone = !!day?.reviewCompletedAt;
  const moduleDone = (day?.modulesCompleted.length ?? 0) > 0;
  const allDone = !!day?.completedAt;
  const { mood, pulse } = useAvatarMood(allDone ? 'happy' : 'idle');
  const doneModule = day?.modulesCompleted[0] ? getContent().getModule(day.modulesCompleted[0]) : undefined;

  const greeting = allDone
    ? { sv: 'Dagens Swechan är klar! Bra jobbat!', ja: '{今日|きょう}の Swechan は{完了|かんりょう}！よくがんばりました！' }
    : reviewDone || moduleDone
      ? { sv: 'En sak kvar idag – du klarar det!', ja: 'あと1つ！がんばって！' }
      : { sv: 'Hej! Två saker idag: repetition och en ny modul.', ja: '{今日|きょう}は{復習|ふくしゅう}と{新|あたら}しいモジュールの2つです。' };

  return (
    <div className="stack">
      <header className="row between">
        <div className="row" style={{ gap: 6 }}>
          <strong style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-primary)' }}>Swechan</strong>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <span className="chip streak" aria-label={`Streak: ${streak?.current ?? 0} ${streak?.current === 1 ? "dag" : "dagar"}`}>🔥 {streak?.current ?? 0}</span>
          <span className="chip freeze" aria-label={`${streak?.freezes ?? 0} streak freeze`}>❄️ {streak?.freezes ?? 0}</span>
          <a className="icon-btn" href={href({ name: 'settings' })} aria-label="Inställningar och statistik"><Icon name="gear" /></a>
        </div>
      </header>

      <div className="avatar-wrap">
        <Avatar mood={mood} pulse={pulse} size={72} />
        <div className="bubble"><div>{greeting.sv}</div><Ja text={greeting.ja} className="xsmall muted" as="div" /></div>
      </div>

      <section className="card stack" aria-labelledby="today-title">
        <div className="row between">
          <h2 id="today-title" style={{ margin: 0 }}>Dagens Swechan</h2>
          {allDone && <span className="chip done">Klar ✓</span>}
        </div>

        <div className="card tint-review stack-sm" style={{ boxShadow: 'none' }}>
          <div className="row between">
            <strong>A. Repetition</strong>
            {reviewDone && <span className="chip done"><Icon name="check" size={14} /> Klar</span>}
          </div>
          {day?.noReviewMaterial ? (
            <p className="small muted" style={{ margin: 0 }}>Inga tidigare inlärda ord att repetera ännu – räknas som klar idag.</p>
          ) : (
            <>
              <div className="small">{day?.reviewIndex ?? 0}/{day?.reviewTarget ?? 0} ord repeterade</div>
              <ProgressBar value={day?.reviewIndex ?? 0} max={day?.reviewTarget ?? 0} label="Repetition" />
              {!reviewDone && <button className="btn block" onClick={() => navigate({ name: 'reviewSession', mode: 'daily' })}>{(day?.reviewIndex ?? 0) > 0 ? 'Fortsätt repetitionen' : 'Starta repetitionen'}</button>}
            </>
          )}
        </div>

        <div className="card tint-module stack-sm" style={{ boxShadow: 'none' }}>
          <div className="row between">
            <strong>B. Dagens modul</strong>
            {moduleDone && <span className="chip done"><Icon name="check" size={14} /> Klar</span>}
          </div>
          {moduleDone && doneModule ? (
            <div className="small">{doneModule.titleSv} <span className="muted">– genomförd</span></div>
          ) : rec ? (
            <>
              <div>{rec.titleSv}</div>
              <Ja text={rec.titleJa} className="small muted" as="div" />
              <div className="xsmall muted">{moduleStatusLabel(recProgress)}</div>
              <ProgressBar value={recProgress ? Object.values(recProgress.steps).filter((s) => s === 'completed').length : 0} max={3} label="Modulens steg" accent />
              <div className="row">
                <button className="btn grow" onClick={() => navigate({ name: 'module', id: rec.id })}>{recProgress ? 'Fortsätt modulen' : 'Starta modulen'}</button>
                <a className="btn ghost small" href={href({ name: 'explore' })}>Välj annan</a>
              </div>
            </>
          ) : (
            <p className="small muted" style={{ margin: 0 }}>Du har gjort alla moduler som finns just nu! Fler kommer.</p>
          )}
        </div>
        {allDone && (
          <div className="celebrate" style={{ padding: 'var(--sp-2)' }}>
            <div className="big-emoji" aria-hidden>🎉</div>
            <strong>Streaken är uppdaterad: {streak?.current} {streak?.current === 1 ? 'dag' : 'dagar'}!</strong>
          </div>
        )}
      </section>

      {load && load.debt > 0 && reviewDone && (
        <div className={`card ${load.warn ? 'tint-warning' : ''} small stack-sm`}>
          <div><strong>{load.debt} förfallna ord</strong> ryms inte i dagens repetition.</div>
          <a className="btn secondary small" href={href({ name: 'review' })}>Extra repetition</a>
        </div>
      )}

      {streak && today && (
        <section className="card stack-sm" aria-label="Veckans streak">
          <div className="row between small">
            <span>🔥 Streak <strong>{streak.current}</strong></span>
            <span className="muted">Längsta: {streak.longest} · ❄️ {streak.freezes}</span>
          </div>
          <div className="week">
            {calendarDays(streak, weekOf(today), today, installDate ?? today).map((d) => (
              <div key={d.date} className="day">
                <span className={`dot ${d.mark}`} aria-label={`${d.date}: ${MARK_SV[d.mark]}`}>{d.mark === 'completed' || d.mark === 'today-done' ? '✓' : d.mark === 'frozen' ? '❄' : ''}</span>
                {weekdayShortSv(d.date)}
              </div>
            ))}
          </div>
        </section>
      )}

      {stats && (
        <a className="card clickable row" href={href({ name: 'stats' })} style={{ textDecoration: 'none' }}>
          <div className="grow small">
            <div><strong>{stats.levels.introduced}</strong> ord introducerade · <strong>{stats.levels.active}</strong> aktivt behärskade</div>
            <div className="muted">{stats.modulesCompleted} moduler klara</div>
          </div>
          <Icon name="chart" />
        </a>
      )}
    </div>
  );
}

const MARK_SV = { completed: 'klar', frozen: 'skyddad av freeze', missed: 'missad', today: 'idag, inte klar än', 'today-done': 'idag, klar', future: 'kommande', 'before-start': 'före start' } as const;
