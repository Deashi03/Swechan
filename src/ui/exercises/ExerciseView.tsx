/**
 * Exercise presentation + answer handling (UI System).
 * Feedback policy (pedagogy): wrong answer → encourage retry with a hint
 * (the answer is NOT revealed); second wrong answer → show the correct answer
 * and an explanation. Learners can always choose "Visa svaret".
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
    <div className="small muted">
      <div>{sv}</div>
      <Ja text={ja} className="xsmall" />
    </div>
  );
}

function Continue({ onClick, autoFocus = true }: { onClick: () => void; autoFocus?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (autoFocus) ref.current?.focus({ preventScroll: false }); }, [autoFocus]);
  return <button ref={ref} type="button" className="btn block" onClick={onClick}>Fortsätt</button>;
}

function ChoiceView({ ex, onDone }: { ex: ChoiceExercise; onDone: (r: ExerciseResult) => void }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [state, setState] = useState<'answering' | 'correct' | 'revealed'>('answering');
  const [showHint, setShowHint] = useState(false);
  const dict = useDictionarySheet();
  const attempts = wrong.length + (state === 'correct' ? 1 : 0);
  const doneRef = useRef(false);

  const finish = () => !doneRef.current && (doneRef.current = true) && onDone({
    senseId: ex.senseId, dimension: ex.dimension, exerciseType: ex.type,
    outcome: state === 'revealed' ? 'failed' : wrong.length === 0 ? 'first' : 'retry',
    attempts: Math.max(1, attempts),
    ...(wrong.length ? { confusedWithSenseId: ex.options[wrong[0]!]!.senseId ?? undefined } : {}),
  });

  // Fast path: correct on first try advances automatically after a short moment.
  useEffect(() => {
    if (state !== 'correct' || wrong.length > 0) return;
    const t = setTimeout(finish, 850);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const choose = (i: number) => {
    if (state !== 'answering' || wrong.includes(i)) return;
    if (i === ex.correctIndex) { setState('correct'); emit({ type: 'answer_correct', senseId: ex.senseId, firstTry: wrong.length === 0 }); return; }
    const next = [...wrong, i];
    setWrong(next);
    emit({ type: 'answer_incorrect', senseId: ex.senseId });
    if (next.length >= learnConfig.maxAttempts) setState('revealed');
  };

  return (
    <div className="stack">
      <Instruction sv={ex.instructionSv} ja={ex.instructionJa} />
      <div className="card stack-sm">
        <LangText text={ex.prompt} lang={ex.promptLang} className={ex.promptLang === 'ja' ? 'prompt-ja' : ex.type === 'context_choice' || ex.type === 'synonym_choice' ? '' : 'prompt-word'} />
        {ex.subPrompt && <div className="small muted"><LangText text={ex.subPrompt} lang={ex.subPromptLang ?? 'sv'} /></div>}
      </div>
      <div className="options" role="group" aria-label="Svarsalternativ">
        {ex.options.map((o, i) => {
          const cls = (state !== 'answering' && i === ex.correctIndex) ? 'correct' : wrong.includes(i) ? 'wrong' : state !== 'answering' ? 'dim' : '';
          return (
            <button key={i} className={`option ${cls}`} onClick={() => choose(i)} disabled={state !== 'answering' || wrong.includes(i)} aria-pressed={cls === 'correct' || cls === 'wrong'}>
              <LangText text={o.label} lang={o.lang} />
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="stack-sm">
        {state === 'answering' && wrong.length > 0 && (
          <div className="feedback retry stack-sm">
            <div><strong>Inte riktigt – försök igen!</strong> <Ja text="もう{一度|いちど}！" className="small" /></div>
            {ex.hint && (showHint ? <div className="small"><LangText text={ex.hint.text} lang={ex.hint.lang} /></div> : <button className="btn ghost small" onClick={() => setShowHint(true)}>Visa ledtråd</button>)}
          </div>
        )}
        {state === 'correct' && (
          <div className="feedback ok stack-sm">
            <strong>Rätt! <Ja text="{正解|せいかい}！" className="small" /></strong>
            {ex.explanation && wrong.length > 0 && <div className="small"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
          </div>
        )}
        {state === 'revealed' && (
          <div className="feedback fail stack-sm">
            <div><strong>Rätt svar:</strong> <LangText text={ex.options[ex.correctIndex]!.label} lang={ex.options[ex.correctIndex]!.lang} /></div>
            {ex.explanation && <div className="small"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
            <button className="btn ghost small" onClick={() => dict.open({ senseId: ex.senseId })}>Öppna i ordboken</button>
          </div>
        )}
        {state === 'answering' && wrong.length === 0 && (
          <button className="btn ghost small" onClick={() => { setWrong([]); setState('revealed'); emit({ type: 'answer_incorrect', senseId: ex.senseId }); }}>Jag vet inte – visa svaret</button>
        )}
        {(state === 'revealed' || (state === 'correct' && wrong.length > 0)) && <Continue onClick={finish} />}
        {state === 'correct' && wrong.length === 0 && <Continue onClick={finish} autoFocus={false} />}
      </div>
    </div>
  );
}

const NEAR_MISS_MSG: Record<Exclude<NearMiss, null>, { sv: string; ja: string }> = {
  diacritics: { sv: 'Nästan! Titta noga på å, ä och ö.', ja: 'おしい！å・ä・ö に{注意|ちゅうい}しましょう。' },
  'other-form': { sv: 'Rätt ord – men inte den form som efterfrågas.', ja: '{単語|たんご}は{正|ただ}しいですが、{形|かたち}が{違|ちが}います。' },
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

  const finish = () => !doneRef.current && (doneRef.current = true) && onDone({
    senseId: ex.senseId, dimension: ex.dimension, exerciseType: ex.type,
    outcome: state === 'revealed' ? 'failed' : wrongOnce ? 'retry' : 'first',
    attempts: Math.max(1, attempts),
  });

  const submit = () => {
    if (state !== 'answering' || !value.trim()) return;
    const r = checkTypedAnswer(value, ex.accepted, ex.otherForms);
    if (r.correct) { setAttempts((a) => a + 1); setState('correct'); emit({ type: 'answer_correct', senseId: ex.senseId, firstTry: !wrongOnce }); return; }
    setNear(r.nearMiss);
    setWrongOnce(true);
    emit({ type: 'answer_incorrect', senseId: ex.senseId });
    // "Right word, wrong form" does not use up an attempt.
    const used = r.nearMiss === 'other-form' ? attempts : attempts + 1;
    setAttempts(used);
    if (used >= learnConfig.maxAttempts) setState('revealed');
    else input.current?.select();
  };

  const insert = (ch: string) => {
    const el = input.current;
    if (!el) return setValue((v) => v + ch);
    const s = el.selectionStart ?? value.length;
    const e = el.selectionEnd ?? value.length;
    const next = value.slice(0, s) + ch + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + 1, s + 1); });
  };

  const cls = state === 'correct' ? 'correct' : state === 'revealed' ? 'wrong' : '';
  return (
    <div className="stack">
      <Instruction sv={ex.instructionSv} ja={ex.instructionJa} />
      <div className="card stack-sm">
        <LangText text={ex.prompt} lang={ex.promptLang} className={ex.promptLang === 'ja' ? 'prompt-ja' : 'prompt-word'} />
        {ex.subPrompt && <div className="small muted"><LangText text={ex.subPrompt} lang={ex.subPromptLang ?? 'sv'} /></div>}
      </div>
      <form className="stack-sm" onSubmit={(e) => { e.preventDefault(); if (state === 'answering') submit(); else finish(); }}>
        <div className="row">
          {ex.frame?.[0] && <span className="muted">{ex.frame[0]}</span>}
          <input
            ref={input}
            className={`input grow ${cls}`}
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
          {ex.frame?.[1] && <span className="muted">{ex.frame[1]}</span>}
        </div>
        {state === 'answering' && (
          <div className="keys" aria-label="Svenska bokstäver">
            {['å', 'ä', 'ö'].map((ch) => <button type="button" key={ch} className="key" onClick={() => insert(ch)} aria-label={`Skriv ${ch}`}>{ch}</button>)}
          </div>
        )}
        <div aria-live="polite" className="stack-sm">
          {state === 'answering' && wrongOnce && (
            <div className="feedback retry stack-sm">
              <div><strong>{near ? NEAR_MISS_MSG[near].sv : 'Inte riktigt – försök igen!'}</strong></div>
              <Ja text={near ? NEAR_MISS_MSG[near].ja : 'もう{一度|いちど}！'} className="small" as="div" />
              <div className="small">Ledtråd: {ex.hint}</div>
            </div>
          )}
          {state === 'correct' && <div className="feedback ok"><strong>Rätt!</strong> {ex.accepted[0]}</div>}
          {state === 'revealed' && (
            <div className="feedback fail stack-sm">
              <div><strong>Rätt svar:</strong> {ex.accepted.join(' / ')}</div>
              {ex.explanation && <div className="small muted"><LangText text={ex.explanation.text} lang={ex.explanation.lang} /></div>}
              <button type="button" className="btn ghost small" onClick={() => dict.open({ senseId: ex.senseId })}>Öppna i ordboken</button>
            </div>
          )}
        </div>
        {state === 'answering' ? (
          <div className="row">
            <button type="button" className="btn ghost small" onClick={() => { setAttempts((a) => Math.max(1, a)); setState('revealed'); emit({ type: 'answer_incorrect', senseId: ex.senseId }); }}>Visa svaret</button>
            <button type="submit" className="btn grow" disabled={!value.trim()}>Kontrollera</button>
          </div>
        ) : (
          <Continue onClick={finish} />
        )}
      </form>
    </div>
  );
}
