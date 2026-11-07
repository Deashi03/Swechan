/**
 * Shows all senses of a headword, marking the one being taught. Used in the
 * word introduction so learners see clearly that a word (e.g. "ämne") has
 * several meanings, and which one this module teaches.
 */
import type { VocabularyEntry } from '../../content/schema';
import { Ja } from '../components/Ja';
import { SvText } from '../components/SvText';

export function OtherSenses({ entry, currentSenseId }: { entry: VocabularyEntry; currentSenseId: string }) {
  if (entry.senses.length < 2) return null;
  const idx = entry.senses.findIndex((s) => s.id === currentSenseId);
  return (
    <section className="card stack-sm" aria-label="Ordets betydelser">
      <div>
        <strong>”{entry.lemma}” har {entry.senses.length} betydelser</strong>
        <div className="small muted">Här lär du dig betydelse {idx + 1}{entry.senses[idx]?.labelSv ? ` (${entry.senses[idx]!.labelSv})` : ''}.</div>
        <Ja className="xsmall muted" as="div" text={`この{言葉|ことば}には{意味|いみ}が${entry.senses.length}つあります。ここでは${idx + 1}{番目|ばんめ}の{意味|いみ}を{学|まな}びます。`} />
      </div>
      <ol className="senses-list">
        {entry.senses.map((s, i) => (
          <li key={s.id} aria-current={s.id === currentSenseId ? 'true' : undefined}>
            <span className={`sense-num ${s.id === currentSenseId ? 'current' : ''}`}>{i + 1}</span>
            <div className="grow stack-sm">
              <div className="row wrap" style={{ gap: 6 }}>
                {s.labelSv && <strong className="small">{s.labelSv}</strong>}
                <Ja text={s.ja} className="ja-gloss" />
              </div>
              {s.id !== currentSenseId && (
                <>
                  <div className="small"><SvText text={s.examples[0]!.sv} exclude={[entry.id]} /></div>
                  <Ja text={s.examples[0]!.ja} as="div" className="ja-word ja-example" />
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
