import { useLiveQuery } from 'dexie-react-hooks';
import { fitWord } from '../components/fitWord';
import { getContent } from '../../content/repository';
import { inflectionForms } from '../../content/morphology';
import type { VocabularyEntry } from '../../content/schema';
import { posSv } from '../../learning/exercises/generate';
import { knowledgeLevel } from '../../learning/knowledge';
import { queueForLearning, toggleSaved } from '../../modules/savedWords';
import { getDb } from '../../storage/db';
import { href } from '../app/router';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { SpeakButton } from '../components/SpeakButton';
import { toast } from '../components/Toast';
import { ComparisonView } from './ComparisonView';
import { SvText } from '../components/SvText';

const LEVEL_SV = { introduced: 'Introducerat', understood: 'Förstått', active: 'Aktivt behärskat', consolidated: 'Långsiktigt befäst' } as const;
const REGISTER_SV: Record<string, string> = { informal: 'vardagligt', formal: 'formellt', technical: 'fackspråk', historical: 'historiskt', literary: 'litterärt' };
const REL_SV: Record<string, string> = { synonym: 'synonym', near: 'närliggande', antonym: 'motsats', related: 'relaterat' };

function SenseStatus({ senseId }: { senseId: string }) {
  const data = useLiveQuery(async () => {
    const db = getDb();
    const [cards, events, saved] = await Promise.all([
      db.cards.where('senseId').equals(senseId).toArray(),
      db.reviewEvents.where('senseId').equals(senseId).toArray(),
      db.savedWords.get(senseId),
    ]);
    return { level: knowledgeLevel(cards, events), inPool: cards.length > 0, saved };
  }, [senseId]);
  if (!data) return null;
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {data.level && <span className="chip done">{LEVEL_SV[data.level]}</span>}
      <button className="btn secondary small" aria-pressed={!!data.saved} onClick={async () => toast((await toggleSaved(senseId)) ? 'Ordet sparades' : 'Borttaget från sparade ord')}>
        <Icon name="bookmark" size={16} /> {data.saved ? 'Sparat' : 'Spara ord'}
      </button>
      {!data.inPool && !data.saved?.queuedForLearning && (
        <button className="btn secondary small" onClick={async () => { await queueForLearning(senseId); toast('Lagt i kön ”Egna ord att lära”'); }}>
          + Lär mig ordet
        </button>
      )}
      {!data.inPool && data.saved?.queuedForLearning && <span className="badge">I kön för inlärning</span>}
    </div>
  );
}

export function EntryView({ entry, focusSenseId, onOpenSense }: { entry: VocabularyEntry; focusSenseId?: string; onOpenSense: (senseId: string) => void }) {
  const repo = getContent();
  const forms = inflectionForms(entry.inflection);
  const infl = entry.inflection;
  return (
    <article className="stack" lang="sv">
      <header>
        <div className="row">
          <h1 className="grow fit-box" style={{ marginBottom: 0 }}><span className="fit-word" style={{ display: 'block', ...fitWord(entry.lemma).style }}>
            {infl.kind === 'noun' && <span className="muted" style={{ fontWeight: 400 }}>{infl.gender} </span>}
            {entry.lemma}
          </span></h1>
          <SpeakButton text={entry.lemma} />
        </div>
        <div className="row wrap small muted" style={{ gap: 6 }}>
          <span>{posSv(entry.pos)}</span>
          {infl.kind === 'verb' && infl.particle && <span className="badge">partikelverb</span>}
          {infl.kind === 'noun' && infl.indefPl === null && <span className="badge">ingen plural</span>}
          <span className="badge">nivå {entry.level}</span>
        </div>
        {entry.pronunciationNote && <p className="small muted" style={{ marginTop: 6 }}>Uttal: {entry.pronunciationNote}</p>}
      </header>

      {entry.senses.length > 1 && (
        <nav className="card small" aria-label="Betydelser">
          <strong>{entry.senses.length} betydelser:</strong>{' '}
          {entry.senses.map((s, i) => <span key={s.id}>{i > 0 && ' · '}{i + 1}. {s.labelSv ?? <Ja text={s.ja} />}</span>)}
        </nav>
      )}
      {entry.senses.map((s, i) => {
        const comparisons = repo.comparisonsForSense(s.id);
        const notes = repo.grammarNotesFor(s.id);
        return (
          <section key={s.id} className="card stack-sm" style={focusSenseId === s.id && entry.senses.length > 1 ? { borderColor: 'var(--c-primary-soft)', borderWidth: 2 } : undefined}>
            <div className="row">
              {entry.senses.length > 1 && <span className="sense-num current">{i + 1}</span>}
              <div className="grow">
                {s.labelSv && entry.senses.length > 1 && <div className="small muted">{s.labelSv}</div>}
                <Ja text={s.ja} className="prompt-ja" />
              </div>
              {s.register !== 'neutral' && <span className="badge">{REGISTER_SV[s.register]}</span>}
            </div>
            <p><SvText text={s.defSv} exclude={[entry.id]} onOpen={(id) => onOpenSense(repo.getEntry(id)!.senses[0]!.id)} /></p>
            <Ja text={s.defJa} as="p" className="ja-word" />
            {s.explanation && (
              <div className="card tint-primary stack-sm small" style={{ boxShadow: 'none' }}>
                <div className="xsmall muted" style={{ fontWeight: 800 }}>Förklaring · <Ja text="{詳|くわ}しい{説明|せつめい}" /></div>
                <div><SvText text={s.explanation.sv} exclude={[entry.id]} onOpen={(id) => onOpenSense(repo.getEntry(id)!.senses[0]!.id)} /></div>
                <Ja text={s.explanation.ja} as="div" className="ja-word" />
              </div>
            )}
            {s.examples.map((ex, k) => (
              <div key={k} className="stack-sm" style={{ borderLeft: '3px solid var(--c-primary-tint)', paddingLeft: 10 }}>
                <div className="row"><span className="grow"><SvText text={ex.sv} exclude={[entry.id]} onOpen={(id) => onOpenSense(repo.getEntry(id)!.senses[0]!.id)} /></span><SpeakButton text={ex.sv} label="Lyssna på meningen" /></div>
                <Ja text={ex.ja} as="div" className="ja-word ja-example" />
              </div>
            ))}
            {s.collocations && s.collocations.length > 0 && (
              <div className="small"><span className="muted">Vanliga kombinationer: </span>{s.collocations.join(' · ')}</div>
            )}
            {s.usageNote && (
              <div className="card tint-warning stack-sm small" style={{ boxShadow: 'none' }}>
                <div>{s.usageNote.sv}</div>
                <Ja text={s.usageNote.ja} as="div" className="ja-word" />
              </div>
            )}
            {s.synonyms && s.synonyms.length > 0 && (
              <div className="stack-sm">
                <div className="small muted">Närliggande ord</div>
                {s.synonyms.map((r) => {
                  const other = repo.getSense(r.senseId);
                  if (!other) return null;
                  return (
                    <div key={r.senseId} className="small">
                      <button className="btn ghost small" style={{ paddingLeft: 0 }} onClick={() => onOpenSense(r.senseId)}>{other.entry.lemma}</button>
                      <span className="badge">{REL_SV[r.relation]}</span> <Ja text={other.sense.ja} className="ja-gloss" />
                      {r.noteSv && <div>{r.noteSv}</div>}
                      {r.noteJa && <Ja text={r.noteJa} as="div" className="ja-word" />}
                    </div>
                  );
                })}
              </div>
            )}
            {comparisons.map((c) => <ComparisonView key={c.id} cmp={c} onOpenSense={onOpenSense} highlight={s.id} />)}
            {notes.length > 0 && (
              <details>
                <summary>Grammatik <Ja text="（{日本語|にほんご}の{説明|せつめい}）" className="small" /></summary>
                <div className="stack-sm">
                  {notes.map((n) => (
                    <div key={n.id} className="small">
                      <Ja text={n.titleJa} as="div" className="ja-gloss" />
                      <Ja text={n.bodyJa} as="p" className="ja-word" />
                      {n.examples.map((x, k) => <div key={k}><span>{x.sv}</span> — <Ja text={x.ja} className="ja-gloss" /></div>)}
                    </div>
                  ))}
                </div>
              </details>
            )}
            <SenseStatus senseId={s.id} />
            {repo.modulesForSense(s.id).length > 0 && (
              <div className="small muted">Moduler: {repo.modulesForSense(s.id).map((m, k) => <span key={m.id}>{k > 0 && ', '}<a href={href({ name: 'module', id: m.id })}>{m.titleSv}</a></span>)}</div>
            )}
          </section>
        );
      })}

      {forms.length > 0 && (
        <section className="card">
          <h3>Böjning</h3>
          <table className="infl">
            <tbody>
              {forms.map((f) => (
                <tr key={f.key}>
                  <td>{f.labelSv}<br /><Ja text={f.labelJa} className="xsmall" /></td>
                  <td><strong>{f.form}</strong>{'variants' in infl && infl.variants?.[f.key] && <span className="muted"> / {infl.variants[f.key]!.join(', ')}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <p className="xsmall faint">Innehållsstatus: {entry.senses.every((s) => s.quality.status === 'reviewed') ? 'granskat' : 'AI-utkast, ej mänskligt granskat ännu'}</p>
    </article>
  );
}
