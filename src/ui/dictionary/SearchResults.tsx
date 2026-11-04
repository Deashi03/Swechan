import { getContent } from '../../content/repository';
import type { DictionaryHit } from '../../dictionary/searchIndex';
import { posSv } from '../../learning/exercises/generate';
import { Ja } from '../components/Ja';
import { Icon } from '../components/Icon';

export function SearchResults({ hits, onOpen }: { hits: DictionaryHit[]; onOpen: (entryId: string, senseId?: string) => void }) {
  const repo = getContent();
  const seen = new Set<string>();
  const rows = hits.filter((h) => { const k = h.senseId ?? h.entryId; if (seen.has(h.entryId)) return false; seen.add(h.entryId); return !!k; });
  if (!rows.length) return <p className="muted small">Inga träffar.</p>;
  return (
    <ul className="list" aria-label="Sökresultat">
      {rows.map((h) => {
        const e = repo.getEntry(h.entryId)!;
        const sense = (h.senseId && repo.getSense(h.senseId)?.sense) || e.senses[0]!;
        return (
          <li key={h.entryId}>
            <button className="list-item" onClick={() => onOpen(h.entryId, h.senseId)}>
              <span className="grow">
                <strong>{e.lemma}</strong> <span className="xsmall muted">{posSv(e.pos)}</span>
                {h.kind === 'form' && <span className="xsmall faint"> ← {h.matchedKey}</span>}
                <br />
                <Ja text={sense.ja} className="small muted" />
                {e.senses.length > 1 && <span className="xsmall faint"> (+{e.senses.length - 1} betydelse{e.senses.length > 2 ? 'r' : ''})</span>}
              </span>
              <Icon name="chevron" size={18} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
