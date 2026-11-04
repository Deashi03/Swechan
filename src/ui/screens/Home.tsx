/**
 * Home ("Hem") – Fjord layout (0.3):
 *   header (Jonathan + greeting + streak) → "Dagens pass" hero card with both
 *   parts and ONE primary action → week → "Dagens svenska ord" → notices.
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { getContent } from '../../content/repository';
import { ensureDailySession, reviewLoad } from '../../daily/dailySession';
import { wordOfTheDay } from '../../daily/wordOfTheDay';
import { getModuleProgress, isStepUnlocked, recommendedModule } from '../../modules/moduleService';
import { calendarDays } from '../../streak/streak';
import { getDb, getMeta } from '../../storage/db';
import type { ModuleProgressRecord, StepId } from '../../storage/types';
import { weekOf, weekdayShortSv } from '../../lib/date';
import { href, navigate, type Route } from '../app/router';
import { useStreak, useToday } from '../app/hooks';
import { Jonathan, useJonathanMood } from '../components/Jonathan';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { ProgressBar } from '../components/Progress';
import { useDictionarySheet } from '../dictionary/DictionarySheet';

const MARK_SV = { completed: 'klar', frozen: 'skyddad av freeze', missed: 'missad', today: 'idag, inte klar än', 'today-done': 'idag, klar', future: 'kommande', 'before-start': 'före start' } as const;
const DATE_FMT = new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });

const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function greeting(hour: number): string {
  if (hour < 10) return 'God morgon!';
  if (hour < 17) return 'Hej!';
  return 'God kväll!';
}

function nextModuleStep(p: ModuleProgressRecord | undefined): StepId {
  for (const s of ['learn', 'read', 'converse'] as StepId[]) if (p?.steps[s] !== 'completed' && isStepUnlocked(p, s)) return s;
  return 'learn';
}

export function Home() {
  const today = useToday();
  const [ready, setReady] = useState(false);
  useEffect(() => { if (today) ensureDailySession().then(() => setReady(true)); }, [today]);
  const day = useLiveQuery(() => (today ? getDb().dailySessions.get(today) : undefined), [today, ready]);
  const streak = useStreak();
  const installDate = useLiveQuery(() => getMeta<string>('installDate'), []);
  const rec = useLiveQuery(() => recommendedModule(), [day?.modulesCompleted.length]);
  const recProgress = useLiveQuery(() => (rec ? getModuleProgress(rec.id) : undefined), [rec?.id]);
  const load = useLiveQuery(() => (ready ? reviewLoad() : undefined), [ready, day?.reviewIndex]);
  const dict = useDictionarySheet();

  const reviewDone = !!day?.reviewCompletedAt;
  const moduleDone = (day?.modulesCompleted.length ?? 0) > 0;
  const allDone = !!day?.completedAt;
  const { mood, pulse } = useJonathanMood(allDone ? 'happy' : 'idle');
  const doneModule = day?.modulesCompleted[0] ? getContent().getModule(day.modulesCompleted[0]) : undefined;
  const now = new Date();
  const partsLeft = (reviewDone ? 0 : 1) + (moduleDone ? 0 : 1);
  const modSteps = recProgress ? Object.values(recProgress.steps).filter((s) => s === 'completed').length : 0;

  // ONE primary action: continue with whatever comes next.
  const next: { label: string; route: Route } | null = !reviewDone
    ? { label: (day?.reviewIndex ?? 0) > 0 ? 'Fortsätt där du slutade' : 'Starta dagens pass', route: { name: 'reviewSession', mode: 'daily' } }
    : !moduleDone && rec
      ? { label: recProgress ? 'Fortsätt med modulen' : 'Starta dagens modul', route: { name: nextModuleStep(recProgress), id: rec.id } }
      : null;

  const wotd = today ? wordOfTheDay(today) : undefined;

  return (
    <div className="stack">
      <header className="row" style={{ gap: 12 }}>
        <Jonathan mood={mood} pulse={pulse} size={48} />
        <div className="grow">
          <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)', lineHeight: 1.2 }}>{greeting(now.getHours())}</div>
          <div className="small muted">{capitalize(DATE_FMT.format(now))}</div>
        </div>
        <span className="chip streak" aria-label={`Streak: ${streak?.current ?? 0} ${streak?.current === 1 ? 'dag' : 'dagar'}`}>🔥 {streak?.current ?? 0}</span>
        <a className="icon-btn" href={href({ name: 'settings' })} aria-label="Inställningar och statistik"><Icon name="gear" /></a>
      </header>

      <section className="card primary stack-sm" aria-labelledby="today-title" style={{ padding: 18, borderRadius: 'var(--r-xl)' }}>
        <span className="hero-glow" aria-hidden />
        <div className="xsmall" style={{ fontWeight: 800, letterSpacing: '0.08em', opacity: 0.85 }}>DAGENS PASS</div>
        <h2 id="today-title" style={{ margin: 0, fontSize: 'var(--fs-xl)' }}>
          {allDone ? 'Klart för idag! 🎉' : partsLeft === 2 ? '2 delar · ca 20 min' : '1 del kvar'}
        </h2>
        <div className="hero-seg" style={{ marginTop: 6 }}>
          <div>
            <div className="row between"><strong className="small">Repetition</strong>{reviewDone && <Icon name="check" size={16} />}</div>
            <div className="xsmall" style={{ opacity: 0.85 }}>
              {day?.noReviewMaterial ? 'Inga tidigare ord ännu' : `${day?.reviewIndex ?? 0} av ${day?.reviewTarget ?? 0} ord`}
            </div>
            <div style={{ marginTop: 8 }}><ProgressBar value={day?.noReviewMaterial ? 1 : day?.reviewIndex ?? 0} max={day?.noReviewMaterial ? 1 : day?.reviewTarget ?? 0} label="Repetition" onPrimary /></div>
          </div>
          <div>
            <div className="row between"><strong className="small">{moduleDone ? 'Modul klar' : 'Ny modul'}</strong>{moduleDone && <Icon name="check" size={16} />}</div>
            <div className="xsmall" style={{ opacity: 0.85 }}>{moduleDone ? doneModule?.titleSv : rec?.titleSv ?? 'Alla moduler klara'}</div>
            <div style={{ marginTop: 8 }}><ProgressBar value={moduleDone ? 3 : modSteps} max={3} label="Dagens modul" onPrimary /></div>
          </div>
        </div>
        {next ? (
          <button className="btn light block" style={{ marginTop: 10 }} onClick={() => navigate(next.route)}>{next.label}</button>
        ) : (
          <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>Streaken är {streak?.current} {streak?.current === 1 ? 'dag' : 'dagar'}. Vill du göra mer? Prova extra repetition eller en ny modul.</div>
        )}
        {!moduleDone && rec && reviewDone === false && (
          <a href={href({ name: 'module', id: rec.id })} className="xsmall" style={{ color: '#fff', opacity: 0.85, textAlign: 'center' }}>Gå direkt till modulen</a>
        )}
      </section>

      {load && load.debt > 0 && reviewDone && (
        <div className={`card ${load.warn ? 'tint-warning' : ''} small row between`}>
          <span><strong>{load.debt} förfallna ord</strong> ryms inte i dagens repetition.</span>
          <a className="btn secondary small" href={href({ name: 'review' })}>Extra</a>
        </div>
      )}

      <div>
        <div className="section-head"><span>Veckan</span><a href={href({ name: 'stats' })}>Statistik</a></div>
        {streak && today && (
          <section className="card row between" aria-label="Veckans streak">
            <div className="week" style={{ flex: 1, maxWidth: 250 }}>
              {calendarDays(streak, weekOf(today), today, installDate ?? today).map((d) => (
                <div key={d.date} className="day">
                  <span className={`dot ${d.mark}`} aria-label={`${d.date}: ${MARK_SV[d.mark]}`}>{d.mark === 'frozen' ? '❄' : d.mark === 'completed' || d.mark === 'today-done' ? '✓' : ''}</span>
                  {weekdayShortSv(d.date)}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{streak.current}</div>
              <div className="xsmall muted">dagar · ❄ {streak.freezes}</div>
            </div>
          </section>
        )}
      </div>

      {wotd && (
        <button className="card clickable word-of-day" style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={() => dict.open({ senseId: wotd.sense.id })}>
          <span className="flag-mini" aria-hidden />
          <span className="grow">
            <strong>Dagens svenska ord: {wotd.entry.lemma}</strong><br />
            <Ja text={wotd.sense.ja} className="small muted" />
          </span>
          <Icon name="chevron" size={18} />
        </button>
      )}
    </div>
  );
}
