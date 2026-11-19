/**
 * Kvalitetsplanen A4b: full dictionary entries are loaded per subject group in the production build.
 * A screen that shows definitions, examples or explanations waits for its senses with this hook (or
 * the <SensesGate> wrapper). In tests, tools and the dev server everything is loaded, so it is
 * immediately ready.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { getContent } from '../../content/repository';
import type { VocabularyEntry } from '../../content/schema';

export function useSensesReady(ids: readonly string[] | null | undefined): { ready: boolean; error: boolean; retry: () => void } {
  const repo = getContent();
  const key = ids ? ids.join('|') : '';
  const [state, setState] = useState(() => ({ key, ready: !ids || repo.sensesLoaded(ids), error: false }));
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!ids || repo.sensesLoaded(ids)) { setState({ key, ready: true, error: false }); return; }
    let alive = true;
    setState({ key, ready: false, error: false });
    repo.ensureSenses(ids)
      .then(() => { if (alive) setState({ key, ready: true, error: false }); })
      .catch(() => { if (alive) setState({ key, ready: false, error: true }); });
    return () => { alive = false; };
  }, [key, attempt, repo]);
  // a new set of ids is not ready until its effect has run (unless already loaded)
  const ready = state.key === key ? state.ready : !ids || repo.sensesLoaded(ids);
  return { ready, error: state.key === key && state.error, retry: () => setAttempt((a) => a + 1) };
}

export function SensesGate({ ids, children }: { ids: readonly string[] | null | undefined; children: ReactNode }) {
  const { ready, error, retry } = useSensesReady(ids);
  if (ready) return <>{children}</>;
  if (error) {
    return (
      <div className="card stack-sm">
        <p className="small">{navigator.onLine === false ? 'Du verkar vara offline, och de här orden har inte laddats på enheten än.' : 'Orden kunde inte laddas.'}</p>
        <button className="btn secondary small" onClick={retry}>Försök igen</button>
      </div>
    );
  }
  return <p className="small muted" aria-busy="true">Laddar ord …</p>;
}

/** Waits for a full headword (and it is passed to `children`). Unknown ids render `fallback`. */
export function EntryGate({ entryId, children, fallback = null }: { entryId: string; children: (entry: VocabularyEntry) => ReactNode; fallback?: ReactNode }) {
  const repo = getContent();
  const lex = repo.getLexEntry(entryId);
  const ids = lex ? lex.senses.map((s) => s.id) : null;
  const { ready, error, retry } = useSensesReady(ids);
  if (!lex) return <>{fallback}</>;
  const entry = repo.getEntry(entryId);
  if (ready && entry) return <>{children(entry)}</>;
  if (error) return <div className="card stack-sm"><p className="small">Ordet kunde inte laddas.</p><button className="btn secondary small" onClick={retry}>Försök igen</button></div>;
  return <p className="small muted" aria-busy="true">Laddar ord …</p>;
}
