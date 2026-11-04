import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { getContent } from '../../content/repository';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { getDb } from '../../storage/db';
import { href, navigate } from '../app/router';
import { Ja } from '../components/Ja';
import { EntryView } from '../dictionary/EntryView';
import { SearchResults } from '../dictionary/SearchResults';

export function DictionaryScreen({ entryId, tab }: { entryId?: string; tab?: 'saved' }) {
  const repo = getContent();
  const [q, setQ] = useState('');
  const saved = useLiveQuery(() => getDb().savedWords.orderBy('savedAt').reverse().toArray(), [], []);
  const entry = entryId ? repo.getEntry(entryId) : undefined;
  if (entry) {
    return (
      <div className="stack">
        <button className="btn ghost small" style={{ paddingLeft: 0 }} onClick={() => history.back()}>‹ Tillbaka</button>
        <EntryView entry={entry} onOpenSense={(senseId) => navigate({ name: 'dictionary', entryId: repo.getSense(senseId)!.entry.id })} />
      </div>
    );
  }
  return (
    <div className="stack">
      <h1>Ordlista</h1>
      <div className="row" role="tablist">
        <a role="tab" aria-selected={tab !== 'saved'} className={`btn small ${tab === 'saved' ? 'secondary' : ''}`} href={href({ name: 'dictionary' })}>Sök</a>
        <a role="tab" aria-selected={tab === 'saved'} className={`btn small ${tab === 'saved' ? '' : 'secondary'}`} href={href({ name: 'dictionary', tab: 'saved' })}>Sparade ord ({saved.length})</a>
      </div>
      {tab === 'saved' ? (
        saved.length === 0 ? <p className="muted small">Inga sparade ord ännu. Tryck på ”Spara ord” i en ordpost.</p> : (
          <ul className="list card" style={{ padding: '0 16px' }}>
            {saved.map((w) => {
              const ref = repo.getSense(w.senseId);
              if (!ref) return null;
              return (
                <li key={w.senseId}>
                  <a className="list-item" href={href({ name: 'dictionary', entryId: ref.entry.id })}>
                    <span className="grow"><strong lang="sv">{ref.entry.lemma}</strong> <Ja text={ref.sense.ja} className="small muted" /></span>
                    {w.queuedForLearning && !w.learnedAt && <span className="badge">i kön</span>}
                    {w.learnedAt && <span className="badge">i repetition</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        )
      ) : (
        <>
          <input className="input search" type="search" placeholder="Svenska, böjningsform, japanska, kana…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Sök i ordboken" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
          {q.trim() ? <SearchResults hits={getDictionaryIndex().search(q, 40)} onOpen={(id) => navigate({ name: 'dictionary', entryId: id })} /> : (
            <section>
              <div className="section-title">Alla ord ({repo.entries.length})</div>
              <ul className="list card" style={{ padding: '0 16px' }}>
                {[...repo.entries].sort((a, b) => a.lemma.localeCompare(b.lemma, 'sv')).map((e) => (
                  <li key={e.id}><a className="list-item" href={href({ name: 'dictionary', entryId: e.id })}><span className="grow"><strong lang="sv">{e.lemma}</strong> <Ja text={e.senses[0]!.ja} className="small muted" /></span></a></li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
