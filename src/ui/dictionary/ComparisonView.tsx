import type { Comparison } from '../../content/schema';
import { getContent } from '../../content/repository';
import { Ja } from '../components/Ja';

const FORMALITY_SV = { informal: 'vardagligt', neutral: 'neutralt', formal: 'formellt' } as const;

/** Reusable synonym/near-synonym comparison (used in the dictionary and in exercises). */
export function ComparisonView({ cmp, onOpenSense, highlight }: { cmp: Comparison; onOpenSense?: (senseId: string) => void; highlight?: string }) {
  const repo = getContent();
  return (
    <div className="card stack-sm">
      <h3>{cmp.titleSv}</h3>
      <Ja text={cmp.titleJa} className="small muted" as="div" />
      <p className="small">{cmp.summarySv}</p>
      <Ja text={cmp.summaryJa} as="p" className="ja-word" />
      <ul className="list">
        {cmp.items.map((it) => {
          const ref = repo.getSense(it.senseId)!;
          return (
            <li key={it.senseId}>
              <div className="stack-sm" style={{ padding: '10px 0', background: highlight === it.senseId ? 'var(--c-highlight)' : undefined, borderRadius: 8 }}>
                <div className="row between wrap">
                  {onOpenSense ? (
                    <button className="btn ghost small" style={{ paddingLeft: 0 }} onClick={() => onOpenSense(it.senseId)}><strong>{ref.entry.lemma}</strong></button>
                  ) : <strong>{ref.entry.lemma}</strong>}
                  <span className="row" style={{ gap: 6 }}>
                    {it.intensity && <span className="badge" aria-label={`Styrka ${it.intensity} av 5`}>{'●'.repeat(it.intensity)}{'○'.repeat(5 - it.intensity)}</span>}
                    {it.formality && <span className="badge">{FORMALITY_SV[it.formality]}</span>}
                  </span>
                </div>
                <div className="small">{it.noteSv}</div>
                <Ja text={it.noteJa} as="div" className="ja-word" />
                <div className="small faint">”{it.exampleSv}”</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
