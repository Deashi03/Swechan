/**
 * Exercise presentation + answer handling (UI System) – Fjord layout (0.3).
 * Feedback policy: wrong answer → encourage a new try with an optional hint
 * (the answer is NOT revealed); second wrong answer → correct answer +
 * explanation. The result is shown in a bottom sheet with one "Fortsätt".
 * Typed exercises keep retry feedback inline so the iPhone keyboard never hides it.
 */
import { useEffect, useRef, useState } from 'react';
import { learnConfig } from '../../config/appConfig';
import { emit } from '../../feedback/events';
import { checkTypedAnswer, type NearMiss } from '../../learning/answerCheck';
import { isChoice, type ChoiceExercise, type ExerciseInstance, type ExerciseResult, type TypedExercise } from '../../learning/exercises/types';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { Ja, LangText } from '../components/Ja';

type Props = { exercise: ExerciseInstance; onDone: (r: ExerciseResult) => void };

export function ExerciseView({ exercise, onDone }: Props) {
  return isChoice(exercise) ? <ChoiceView ex={exercise} onDone={onDone} /> : <TypedView ex={exercise} onDone={onDone} />;
}

function Instruction({ sv, ja }: { sv: string; ja: string }) {
  return (
    <div className="small muted" style={{ fontWeight: 600 }}>
      <div>{sv}</div>
      <Ja text={ja} className="xsmall" />
    </div>
  );
}

function ResultSheet({ kind, title, children, onContinue }: { kind: 'ok' | 'fail'; title: React.ReactNode; children?: React.ReactNode; onContinue: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  return (
    <>
      <div className="sheet-spacer" aria-hidden />
      <div className={`feedback-sheet ${kind}`} role="status" aria-live="polite">
        <div className="inner stack-sm">
          <div className="title">{title}</div>
          {children}
          <button ref={ref} type="button" className={`btn block ${kind === 'ok' ? 'success' : ''}`} onClick={onContinue}>Fortsätt</button>
        </div>
      </div>
    </>
  );
}

const KEYS = ['A', 'B', 'C', 'D', 'E'];

function ChoiceView({ ex, onDone }: { ex: ChoiceExercise; onDone: (r: ExerciseResult) => void }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [state, setState] = useState<'answering' | 'correct' | 'revealed'>('answering');
  const [showHint, setShowHint] = useState(false);
  const dict = useDictionarySheet();
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone({
      senseId: ex.senseId, dimension: ex.dimension, exerciseType: ex.type,
      outcome: state === 'revealed' ? 'failed' : wrong.length === 0 ? 'first' : 'retry',
      attempts: Math.max(1, wrong.length + (state === 'correct' ? 1 : 0)),
      ...(wrong.length ? { confusedWithSenseId: ex.options[wrong[0]!]!.senseId ?? undefined } : {}),
    });
  };

  const choose = (i: number) => {
    if (state !== 'answering' || wrong.includes(i)) return;
    if (i === ex.correctIndex) { setState('correct'); emit({ type: 'answer_correct', senseId: ex.senseId, firstTry: wrong.length === 0 }); return; }
    const next = [...wrong, i];
    setWrong(next);
    emit({ type: 'answer_incorrect', senseId: ex.senseId });
    if (next.length >= learnConfig.maxAttempts) setState('revealed');
  };

  const correct = ex.options[ex.correctIndex]!;
  const wordCard = ex.promptLang === 'sv' && (ex.type === 'meaning_choice');
  return (
    <div className="stack">
      <Instruction sv={ex.instructionSv} ja={ex.instructionJa} />
      <div className="card stack-sm" style={{ padding: '22px 20px', borderRadius: 'var(--r-xl)' }}>
        <LangText text={ex.prompt} lang={ex.promptLang} className={ex.promptLang === 'ja' ? 'prompt-ja' : wordCard ? 'prompt-word' : ''} />
        {ex.subPrompt && (
          <div className="small" style={{ background: 'var(--c-primary-tint)', borderRadius: 12, padding: '10px 12px' }}>
            <LangText text={ex.subPrompt} lang={ex.subPromptLang ?? 'sv'} />
          </div>
        )}
      </div>
      <div className="options" role="group" aria-label="Svarsalternativ">
        {ex.options.map((o, i) => {
          const cls = (state !== 'answering' && i === ex.correctIndex) ? 'correct' : wrong.includes(i) ? 'wrong' : state !== 'answering' ? 'dim' : '';
          return (
            <button key={i} className={`option ${cls}`} onClick={() => choose(i)} disabled={state !== 'answering' || wrong.includes(i)}>
              <LangText text={o.label} lang={o.lang} />
              <span className="opt-key" aria-hidden>{cls === 'correct' ? '✓' : KEYS[i]}</span>
            </button>
          );
        })}
      </div>
      {state === 'answering' && wrong.length > 0 && (
        <div className="feedback retry stack-sm" aria-live="polite">
          <div><strong>Inte riktigt – försök igen!</strong> <Ja text="もう{一度|いちど}！" className="small" /></div>
          {ex.hint && (showHint ? <div className="small"><LangText text={ex.hint.text} lang={ex.hint.lang} /></div> : <button className="btn ghost small" onClick={() => setShowHint(true)}>Visa ledtråd</button>)}
        </div>
      )}
      {state === 'answering' && wrong.length === 0 && (
        <div className="row">
          {ex.hint && !showHint && <button className="btn ghost small" onClick={() => setShowHint(true)}>Ledtråd</button>}
          {showHint && ex.hint && <div className="small muted grow"><LangText text={ex.hint.text} lang={ex.hint.lang} /></div>}
          <button className="btn ghost small" style={{ marginLeft: 'auto' }} onClick={() => { setState('revealed'); emit({ type: 'answer_incorrect', senseId: ex.senseId }); }}>Jag vet inte</button>
        </div>
      )}
      {state === 'correct' && (
        <ResultSheet kind="ok" title={<>Rätt! <Ja text="{正解|せいかい}" className="small" /></>} onContinue={finish}>
          {ex.explanation && <div className="small"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
          {ex.note && <div className="xsmall muted"><LangText text={ex.note.text} lang={ex.note.lang} /></div>}
        </ResultSheet>
      )}
      {state === 'revealed' && (
        <ResultSheet kind="fail" title={<>Rätt svar: <LangText text={correct.label} lang={correct.lang} /></>} onContinue={finish}>
          {ex.explanation && <div className="small"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
          {ex.note && <div className="xsmall muted"><LangText text={ex.note.text} lang={ex.note.lang} /></div>}
          <button type="button" className="btn ghost small" style={{ alignSelf: 'flex-start', paddingLeft: 0 }} onClick={() => dict.open({ senseId: ex.senseId })}>Öppna i ordboken</button>
        </ResultSheet>
      )}
    </div>
  );
}

const NEAR_MISS_MSG: Record<Exclude<NearMiss, null>, { sv: string; ja: string }> = {
  diacritics: { sv: 'Nästan! Titta noga på å, ä och ö.', ja: 'おしい！å・ä・ö に{注意|ちゅうい}しましょう。' },
  'other-form': { sv: 'Rätt ord – men inte rätt form i den här meningen.', ja: '{単語|たんご}は{正|ただ}しいですが、この{文|ぶん}では{形|かたち}が{違|ちが}います。' },
  typo: { sv: 'Nästan! Kontrollera stavningen.', ja: 'おしい！つづりを{確認|かくにん}しましょう。' },
};

function TypedView({ ex, onDone }: { ex: TypedExercise; onDone: (r: ExerciseResult) => void }) {
  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<'answering' | 'correct' | 'revealed'>('answering');
  const [near, setNear] = useState<NearMiss>(null);
  const [wrongOnce, setWrongOnce] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const dict = useDictionarySheet();
  const doneRef = useRef(false);

  useEffect(() => { input.current?.focus({ preventScroll: true }); }, []);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone({
      senseId: ex.senseId, dimension: ex.dimension, exerciseType: ex.type,
      outcome: state === 'revealed' ? 'failed' : wrongOnce ? 'retry' : 'first',
      attempts: Math.max(1, attempts),
    });
  };

  const end = (s: 'correct' | 'revealed') => { input.current?.blur(); setState(s); };

  const submit = () => {
    if (state !== 'answering' || !value.trim()) return;
    const r = checkTypedAnswer(value, ex.accepted, ex.otherForms);
    if (r.correct) { setAttempts((a) => a + 1); end('correct'); emit({ type: 'answer_correct', senseId: ex.senseId, firstTry: !wrongOnce }); return; }
    setNear(r.nearMiss);
    setWrongOnce(true);
    emit({ type: 'answer_incorrect', senseId: ex.senseId });
    const used = r.nearMiss === 'other-form' ? attempts : attempts + 1; // right word, wrong form: free retry
    setAttempts(used);
    if (used >= learnConfig.maxAttempts) end('revealed');
    else input.current?.select();
  };

  const insert = (ch: string) => {
    const el = input.current;
    if (!el) return setValue((v) => v + ch);
    const s = el.selectionStart ?? value.length;
    const e = el.selectionEnd ?? value.length;
    setValue(value.slice(0, s) + ch + value.slice(e));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + 1, s + 1); });
  };

  const cls = state === 'correct' ? 'correct' : state === 'revealed' ? 'wrong' : '';
  return (
    <div className="stack">
      <Instruction sv={ex.instructionSv} ja={ex.instructionJa} />
      <div className="card stack-sm" style={{ padding: '20px', borderRadius: 'var(--r-xl)' }}>
        <LangText text={ex.prompt} lang={ex.promptLang} className={ex.promptLang === 'ja' ? 'prompt-ja' : 'prompt-word'} />
        {ex.subPrompt && <div className="small muted"><LangText text={ex.subPrompt} lang={ex.subPromptLang ?? 'sv'} /></div>}
      </div>
      <form className="stack-sm" onSubmit={(e) => { e.preventDefault(); if (state === 'answering') submit(); }}>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {ex.frame?.[0] && <span style={{ fontSize: 'var(--fs-lg)' }}>{ex.frame[0]}</span>}
          <input
            ref={input}
            className={`input ${cls}`}
            style={{ flex: '1 1 140px', minWidth: 120 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            readOnly={state !== 'answering'}
            lang="sv"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="done"
            aria-label="Ditt svar"
            onFocus={(e) => setTimeout(() => e.target.scrollIntoView?.({ block: 'center', behavior: 'smooth' }), 250)}
          />
          {ex.frame?.[1] && <span style={{ fontSize: 'var(--fs-lg)' }}>{ex.frame[1]}</span>}
        </div>
        {state === 'answering' && (
          <div className="keys" aria-label="Svenska bokstäver">
            {['å', 'ä', 'ö'].map((ch) => <button type="button" key={ch} className="key" onClick={() => insert(ch)} aria-label={`Skriv ${ch}`}>{ch}</button>)}
          </div>
        )}
        {state === 'answering' && wrongOnce && (
          <div className="feedback retry stack-sm" aria-live="polite">
            <strong>{near ? NEAR_MISS_MSG[near].sv : 'Inte riktigt – försök igen!'}</strong>
            <Ja text={near ? NEAR_MISS_MSG[near].ja : 'もう{一度|いちど}！'} className="small" as="div" />
            <div className="small">Ledtråd: {ex.hint}</div>
          </div>
        )}
        {state === 'answering' && (
          <div className="row">
            <button type="button" className="btn ghost small" onClick={() => { setAttempts((a) => Math.max(1, a)); end('revealed'); emit({ type: 'answer_incorrect', senseId: ex.senseId }); }}>Visa svaret</button>
            <button type="submit" className="btn grow" disabled={!value.trim()}>Kontrollera</button>
          </div>
        )}
      </form>
      {state === 'correct' && (
        <ResultSheet kind="ok" title={<>Rätt! <Ja text="{正解|せいかい}" className="small" /></>} onContinue={finish}>
          <div className="small">{ex.frame ? `${ex.frame[0]}${ex.accepted[0]}${ex.frame[1]}` : ex.accepted[0]}</div>
        </ResultSheet>
      )}
      {state === 'revealed' && (
        <ResultSheet kind="fail" title={<>Rätt svar: {ex.accepted[0]}</>} onContinue={finish}>
          {ex.frame && <div className="small">{ex.frame[0]}<strong>{ex.accepted[0]}</strong>{ex.frame[1]}</div>}
          {ex.explanation && <div className="xsmall muted"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
          <button type="button" className="btn ghost small" style={{ alignSelf: 'flex-start', paddingLeft: 0 }} onClick={() => dict.open({ senseId: ex.senseId })}>Öppna i ordboken</button>
        </ResultSheet>
      )}
    </div>
  );
}
