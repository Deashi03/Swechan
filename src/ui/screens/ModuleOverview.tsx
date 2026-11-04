import { useLiveQuery } from 'dexie-react-hooks';
import { getContent } from '../../content/repository';
import type { Module } from '../../content/schema';
import { getModuleProgress, isStepUnlocked } from '../../modules/moduleService';
import { getDb } from '../../storage/db';
import type { ModuleProgressRecord, StepId } from '../../storage/types';
import { href, navigate } from '../app/router';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { useDictionarySheet } from '../dictionary/DictionarySheet';

const STEPS: { id: StepId; sv: string; ja: string; tint: string; desc: string }[] = [
  { id: 'learn', sv: 'Lär dig orden', ja: '{言葉|ことば}を{覚|おぼ}える', tint: 'tint-module', desc: 'Interaktiva övningar' },
  { id: 'read', sv: 'Läs en text', ja: '{文章|ぶんしょう}を{読|よ}む', tint: 'tint-read', desc: 'Text + läsförståelse' },
  { id: 'converse', sv: 'Använd orden i samtal', ja: '{会話|かいわ}で{使|つか}う', tint: 'tint-converse', desc: 'Muntlig träning med ChatGPT' },
];

export function moduleStatusLabel(p: ModuleProgressRecord | undefined): string {
  if (!p) return 'Ej påbörjad';
  if (p.status === 'completed') return 'Klar ✓';
  const n = Object.values(p.steps).filter((s) => s === 'completed').length;
  return `Pågår · ${n}/3 steg`;
}

export function ModuleCard({ m, progress }: { m: Module; progress?: ModuleProgressRecord }) {
  return (
    <a className="card clickable" href={href({ name: 'module', id: m.id })} style={{ textDecoration: 'none' }}>
      <div className="row between"><strong>{m.titleSv}</strong><span className="badge">{m.level}</span></div>
      <Ja text={m.titleJa} className="small muted" as="div" />
      {m.prerequisites.length > 0 && (
        <div className="xsmall muted" style={{ marginTop: 4 }}>Bygger på: {m.prerequisites.map((id) => getContent().getModule(id)?.titleSv).filter(Boolean).join(', ')}</div>
      )}
      <div className="row between xsmall muted" style={{ marginTop: 4 }}>
        <span>{m.words.length} ord</span>
        <span>{moduleStatusLabel(progress)}</span>
      </div>
    </a>
  );
}

export function ModuleOverview({ id }: { id: string }) {
  const repo = getContent();
  const m = repo.getModule(id);
  const progress = useLiveQuery(() => getModuleProgress(id), [id]);
  const completedIds = useLiveQuery(async () => new Set((await getDb().moduleProgress.where('status').equals('completed').toArray()).map((p) => p.moduleId)), [], new Set<string>());
  const dict = useDictionarySheet();
  if (!m) return <p>Modulen finns inte.</p>;
  const path = repo.categoryPath(m.categoryId);
  const missingPrereq = m.prerequisites.filter((p) => !completedIds.has(p));
  return (
    <div className="stack">
      <nav className="crumbs" aria-label="Kategori">
        <a href={href({ name: 'explore' })}>Kurser</a>
        {path.map((c) => <span key={c.id}>› <a href={href({ name: 'explore', categoryId: c.id })}>{c.nameSv}</a></span>)}
      </nav>
      <header>
        <h1>{m.titleSv}</h1>
        <Ja text={m.titleJa} className="muted" as="div" />
        <p className="small" style={{ marginTop: 8 }}>{m.descriptionSv}</p>
        <Ja text={m.descriptionJa} as="p" className="small muted" />
        <div className="row wrap" style={{ gap: 6 }}>
          <span className="badge">Nivå {m.level}</span>
          <span className="badge">{m.words.length} ord</span>
          {m.tags.map((t) => <span key={t} className="badge">#{t}</span>)}
        </div>
      </header>
      {missingPrereq.length > 0 && (
        <div className="card tint-warning small stack-sm">
          <div><strong>Den här modulen bygger på:</strong> {missingPrereq.map((p) => <a key={p} href={href({ name: 'module', id: p })}>{repo.getModule(p)?.titleSv}</a>)}</div>
          <div>Förklaringarna använder ord från den modulen. Gör den gärna först – men du kan också börja direkt.</div>
          <Ja as="div" className="xsmall muted" text="このモジュールの{説明|せつめい}には、{前|まえ}のモジュールの{言葉|ことば}が{使|つか}われています。" />
        </div>
      )}
      {STEPS.map((s, i) => {
        const status = progress?.steps[s.id] ?? 'not_started';
        const unlocked = isStepUnlocked(progress, s.id);
        return (
          <div key={s.id} className={`card ${s.tint} row`} style={{ opacity: unlocked ? 1 : 0.6 }}>
            <span className={`step-num ${status === 'completed' ? 'done' : ''}`}>{status === 'completed' ? <Icon name="check" size={18} /> : i + 1}</span>
            <div className="grow">
              <strong>{s.sv}</strong>
              <Ja text={s.ja} className="xsmall muted" as="div" />
              <div className="xsmall muted">{s.desc}</div>
            </div>
            {status === 'completed' && s.id !== 'learn' ? (
              <button className="btn secondary small" onClick={() => navigate({ name: s.id, id })}>Öppna</button>
            ) : status === 'completed' ? (
              <span className="chip done">Klar</span>
            ) : (
              <button className="btn small" disabled={!unlocked} onClick={() => navigate({ name: s.id, id })} aria-label={`${status === 'in_progress' ? 'Fortsätt' : 'Starta'}: ${s.sv}`}>
                {status === 'in_progress' ? 'Fortsätt' : 'Starta'}
              </button>
            )}
          </div>
        );
      })}
      {!isStepUnlocked(progress, 'read') && <p className="xsmall faint">Stegen låses upp i tur och ordning.</p>}
      <details>
        <summary>Modulens ord ({m.words.length})</summary>
        <ul className="list">
          {m.words.map((w) => {
            const ref = repo.getSense(w.senseId);
            if (!ref) return null;
            return (
              <li key={w.senseId}>
                <button className="list-item" onClick={() => dict.open({ senseId: w.senseId })}>
                  <span className="grow"><strong lang="sv">{ref.entry.lemma}</strong> <Ja text={ref.sense.ja} className="small muted" /></span>
                  <span className="badge">{w.active ? 'aktivt' : 'förstå'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
