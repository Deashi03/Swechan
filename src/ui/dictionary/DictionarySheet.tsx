import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getContent } from '../../content/repository';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
import { EntryView } from './EntryView';
import { SearchResults } from './SearchResults';

type OpenArg = { senseId?: string; entryId?: string; query?: string };
type Ctx = { open: (arg?: OpenArg) => void };
const DictCtx = createContext<Ctx>({ open: () => {} });
export const useDictionarySheet = () => useContext(DictCtx);

/**
 * Global dictionary overlay. Opening it never navigates away: the current
 * screen (exercise, reading text) stays mounted underneath with all state.
 */
export function DictionarySheetProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<OpenArg[] | null>(null);
  const open = useCallback((arg: OpenArg = {}) => setStack([arg]), []);
  const close = useCallback(() => setStack(null), []);
  const value = useMemo(() => ({ open }), [open]);
  const top = stack?.[stack.length - 1];
  return (
    <DictCtx.Provider value={value}>
      {children}
      {stack && top && (
        <BottomSheet
          title="Ordbok"
          onClose={close}
          headerExtra={stack.length > 1 ? <button className="icon-btn" aria-label="Tillbaka" onClick={() => setStack((s) => (s && s.length > 1 ? s.slice(0, -1) : s))}><Icon name="back" /></button> : null}
        >
          <SheetContent arg={top} push={(a) => setStack((s) => [...(s ?? []), a])} />
        </BottomSheet>
      )}
    </DictCtx.Provider>
  );
}

function SheetContent({ arg, push }: { arg: OpenArg; push: (a: OpenArg) => void }) {
  const repo = getContent();
  const [q, setQ] = useState(arg.query ?? '');
  const entry = arg.entryId ? repo.getEntry(arg.entryId) : arg.senseId ? repo.getSense(arg.senseId)?.entry : undefined;
  if (entry) return <EntryView entry={entry} focusSenseId={arg.senseId} onOpenSense={(senseId) => push({ senseId })} />;
  const hits = q.trim() ? getDictionaryIndex().search(q, 30) : [];
  return (
    <div className="stack">
      <input className="input search" placeholder="Sök på svenska eller japanska" value={q} onChange={(e) => setQ(e.target.value)} autoFocus aria-label="Sök i ordboken" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      {q.trim() && <SearchResults hits={hits} onOpen={(entryId, senseId) => push({ entryId, senseId })} />}
      {arg.query && !hits.length && <p className="muted small">Ordet finns ännu inte i Swechans ordbok.</p>}
    </div>
  );
}
