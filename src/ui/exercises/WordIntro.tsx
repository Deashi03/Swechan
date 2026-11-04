/**
 * Short word introduction in step 1. Length adapts to the word: concept words
 * show both definitions and examples expanded; simple words show a compact
 * card (details one tap away). Grammar notes on Japanese/Swedish differences
 * are optional and collapsed.
 */
import { useEffect, useRef } from 'react';
import { getContent } from '../../content/repository';
import { inflectionForms } from '../../content/morphology';
import { posSv } from '../../learning/exercises/generate';
import { Ja } from '../components/Ja';
import { SpeakButton } from '../components/SpeakButton';
import { ComparisonView } from '../dictionary/ComparisonView';

export function WordIntro({ senseId, compact, onNext }: { senseId: string; compact: boolean; onNext: () => void }) {
  const repo = getContent();
  const ref = repo.getSense(senseId);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => { btn.current?.focus({ preventScroll: true }); }, [senseId]);
  if (!ref) return <button className="btn block" onClick={onNext}>Fortsätt</button>;
  const { entry, sense } = ref;
  const infl = entry.inflection;
  const forms = inflectionForms(infl);
  const notes = repo.grammarNotesFor(senseId);
  const cmp = repo.comparisonsForSense(senseId)[0];
  return (
    <div className="stack">
      <div className="small muted">Nytt ord · <Ja text="{新|あたら}しい{言葉|ことば}" className="xsmall" /></div>
      <div className="card stack-sm">
        <div className="row">
          <div className="grow">
            <div className="prompt-word" lang="sv">{infl.kind === 'noun' && <span className="muted" style={{ fontWeight: 400 }}>{infl.gender} </span>}{entry.lemma}</div>
            <div className="small muted">{posSv(entry.pos)}{infl.kind === 'verb' && infl.particle ? ' · partikelverb' : ''}</div>
          </div>
          <SpeakButton text={entry.lemma} />
        </div>
        <Ja text={sense.ja} className="prompt-ja" as="div" />
        {forms.length > 1 && <div className="small" lang="sv">{forms.map((f) => f.form).join(' – ')}</div>}
      </div>
      <div className="card stack-sm">
        <p style={{ margin: 0 }}>{sense.defSv}</p>
        {(sense.concept || !compact) && <Ja text={sense.defJa} as="p" className="muted" />}
        <div className="stack-sm" style={{ borderLeft: '3px solid var(--c-primary-tint)', paddingLeft: 10 }}>
          <div className="row"><span className="grow" lang="sv">{sense.examples[0]!.sv}</span><SpeakButton text={sense.examples[0]!.sv} label="Lyssna på meningen" /></div>
          <Ja text={sense.examples[0]!.ja} as="div" className="small muted" />
        </div>
        {sense.usageNote && (
          <div className="card tint-warning small stack-sm" style={{ boxShadow: 'none' }}>
            <div>{sense.usageNote.sv}</div>
            <Ja text={sense.usageNote.ja} as="div" />
          </div>
        )}
      </div>
      {(notes.length > 0 || cmp) && (
        <details>
          <summary>Mer om ordet <Ja text="（{文法|ぶんぽう}・{似|に}た{言葉|ことば}）" className="small" /></summary>
          <div className="stack-sm">
            {notes.map((n) => (
              <div key={n.id} className="card small stack-sm">
                <Ja text={n.titleJa} as="div" className="small" />
                <Ja text={n.bodyJa} as="p" />
              </div>
            ))}
            {cmp && <ComparisonView cmp={cmp} highlight={senseId} />}
          </div>
        </details>
      )}
      <button ref={btn} className="btn block" onClick={onNext}>Jag förstår – nästa</button>
    </div>
  );
}
