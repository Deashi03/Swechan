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
import { SvText } from '../components/SvText';
import { OtherSenses } from './OtherSenses';
import { PhotoCredit, WordImage } from '../components/WordImage';
import { imageFor } from '../../content/images';

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
      <p className="xsmall faint" style={{ margin: 0 }}>Tips: tryck på ett understruket ord för att slå upp det.</p>
      <div className="card stack-sm">
        {imageFor(senseId) && <div className="intro-picture"><WordImage senseId={senseId} size={180} label={entry.lemma} /><PhotoCredit senseId={senseId} /></div>}
        <div className="row">
          <div className="grow">
            <div className="prompt-word" lang="sv">{infl.kind === 'noun' && <span className="muted" style={{ fontWeight: 400 }}>{infl.gender} </span>}{entry.lemma}</div>
            <div className="small muted">{posSv(entry.pos)}{infl.kind === 'verb' && infl.particle ? ' · partikelverb' : ''}</div>
          </div>
          <SpeakButton text={entry.lemma} />
        </div>
        <Ja text={sense.ja} className="prompt-ja" as="div" />
        {entry.senses.length > 1 && sense.labelSv && <div className="xsmall muted">Betydelse {entry.senses.findIndex((x) => x.id === senseId) + 1} av {entry.senses.length}: {sense.labelSv}</div>}
        {forms.length > 1 && <div className="small" lang="sv">{forms.map((f) => f.form).join(' – ')}</div>}
      </div>
      <div className="card stack-sm">
        <p style={{ margin: 0 }}><SvText text={sense.defSv} exclude={[entry.id]} /></p>
        {(sense.concept || sense.explanation || !compact) && <Ja text={sense.defJa} as="p" className="muted" />}
        <div className="stack-sm" style={{ borderLeft: '3px solid var(--c-primary-tint)', paddingLeft: 10 }}>
          <div className="row"><span className="grow"><SvText text={sense.examples[0]!.sv} exclude={[entry.id]} /></span><SpeakButton text={sense.examples[0]!.sv} label="Lyssna på meningen" /></div>
          <Ja text={sense.examples[0]!.ja} as="div" className="small muted" />
        </div>
        {sense.explanation && (
          <div className="card tint-primary small stack-sm" style={{ boxShadow: 'none' }} data-testid="word-explanation">
            <div className="xsmall muted" style={{ fontWeight: 800 }}>Förklaring · <Ja text="{詳|くわ}しい{説明|せつめい}" /></div>
            <div><SvText text={sense.explanation.sv} exclude={[entry.id]} /></div>
            <Ja text={sense.explanation.ja} as="div" className="muted" />
          </div>
        )}
        {sense.usageNote && (
          <div className="card tint-warning small stack-sm" style={{ boxShadow: 'none' }}>
            <div><SvText text={sense.usageNote.sv} exclude={[entry.id]} /></div>
            <Ja text={sense.usageNote.ja} as="div" />
          </div>
        )}
      </div>
      <OtherSenses entry={entry} currentSenseId={senseId} />
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
