/**
 * Step 2 – interactive reading + comprehension questions.
 * Tapping a word opens the dictionary sheet on top; the text and scroll
 * position stay exactly where they were.
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { getSpeech } from '../../audio/speech';
import { getContent } from '../../content/repository';
import type { ReadingQuestion } from '../../content/schema';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { segmentText } from '../../dictionary/segmentText';
import { emit } from '../../feedback/events';
import { completeStep, getModuleProgress, saveReadState } from '../../modules/moduleService';
import { navigate } from '../app/router';
import { useModuleBody } from '../app/useModuleBody';
import { useSettings } from '../app/hooks';
import { Jonathan } from '../components/Jonathan';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { ProgressBar } from '../components/Progress';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { SvText } from '../components/SvText';

function useSwedishVoice() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => { getSpeech().isAvailable().then(setOk); return () => getSpeech().stop(); }, []);
  return ok;
}

function LessonLoadError({ error, retry }: { error: string; retry: () => void }) {
  return <div className="card stack-sm"><p>Lektionen kunde inte laddas.</p><p className="small muted">{error}</p><button className="btn secondary small" onClick={retry}>Försök igen</button></div>;
}
export { LessonLoadError };

export function ReadStep({ id }: { id: string }) {
  const repo = getContent();
  const meta = repo.getModule(id);
  const { body: m, error, retry } = useModuleBody(id);
  const progress = useLiveQuery(() => getModuleProgress(id), [id]);
  const [phase, setPhase] = useState<'text' | 'questions' | 'done' | null>(null);
  useEffect(() => {
    if (progress === undefined || phase !== null) return;
    const read = progress?.read;
    if (progress?.steps.read === 'completed') setPhase('done');
    else setPhase(read?.textRead ? 'questions' : 'text');
  }, [progress, phase]);
  if (!meta) return <p>Modulen finns inte.</p>;
  if (error && !m) return <LessonLoadError error={error} retry={retry} />;
  if (!phase || !m) return <p className="muted">Laddar…</p>;
  return (
    <div className="stack">
      <div className="session-bar">
        <button className="icon-btn" onClick={() => navigate({ name: 'module', id })} aria-label="Tillbaka till modulen"><Icon name="close" /></button>
        <strong className="grow">Steg 2 · Läsning</strong>
      </div>
      {phase === 'text' && <ReadingText moduleId={id} onDone={async () => { await saveReadState(id, { answers: {}, questionIndex: 0, textRead: true }); setPhase('questions'); }} />}
      {phase === 'questions' && <Questions moduleId={id} questions={m.reading.questions} initial={progress?.read} onDone={() => setPhase('done')} />}
      {phase === 'done' && (
        <div className="celebrate stack">
          <Jonathan mood="cheer" size={88} />
          <h1>Läsningen är klar!</h1>
          <button className="btn block" onClick={() => navigate({ name: 'converse', id }, { replace: true })}>Vidare till samtalet</button>
          <button className="btn ghost" onClick={() => setPhase('text')}>Läs texten igen</button>
        </div>
      )}
    </div>
  );
}

function ReadingText({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const repo = getContent();
  const m = repo.getLoadedModuleBody(moduleId)!; // loaded by ReadStep before rendering
  const dict = useDictionarySheet();
  const settings = useSettings();
  const voice = useSwedishVoice();
  const [speaking, setSpeaking] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const targetEntries = useMemo(() => new Set(m.words.map((w) => repo.getSense(w.senseId)?.entry.id)), [m, repo]);
  const senseFor = (entryId: string) => m.words.find((w) => repo.getSense(w.senseId)?.entry.id === entryId)?.senseId;
  const paragraphs = useMemo(() => m.reading.paragraphs.map((p) => segmentText(p, getDictionaryIndex())), [m]);

  const toggleSpeech = () => {
    const sp = getSpeech();
    if (speaking) { sp.stop(); setSpeaking(false); return; }
    setSpeaking(true);
    sp.speak(`${m.reading.titleSv}. ${m.reading.paragraphs.join(' ')}`, { rate: settings.ttsRate, onEnd: () => setSpeaking(false) });
  };

  return (
    <div className="stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>{m.reading.titleSv}</h1>
        {voice && (
          <button className="btn secondary small" onClick={toggleSpeech} aria-pressed={speaking}>
            <Icon name={speaking ? 'stop' : 'speaker'} size={18} /> {speaking ? 'Stoppa' : 'Lyssna'}
          </button>
        )}
      </div>
      {voice === false && <p className="xsmall faint">Uppläsning är inte tillgänglig: ingen svensk röst hittades på enheten. (På iPhone: Inställningar → Hjälpmedel → Uppläst innehåll → Röster → Svenska.)</p>}
      <p className="small muted">Tryck på ett ord för att slå upp det. Understrukna ord är modulens målord.</p>
      <div className="card reading" lang="sv">
        {paragraphs.map((spans, pi) => (
          <p key={pi}>
            {spans.map((s, si) => {
              if (!s.isWord) return <span key={si}>{s.text}</span>;
              const key = `${pi}-${si}`;
              const entryId = s.entryIds[0];
              const isTarget = !!entryId && targetEntries.has(entryId);
              return (
                <button
                  key={si}
                  className={`word-link ${isTarget ? 'target' : ''} ${active === key ? 'active' : ''}`}
                  onClick={() => {
                    setActive(key);
                    if (entryId) dict.open({ entryId, senseId: isTarget ? senseFor(entryId) : undefined });
                    else dict.open({ query: s.text });
                  }}
                >
                  {s.text}
                </button>
              );
            })}
          </p>
        ))}
      </div>
      <button className="btn block" onClick={() => { getSpeech().stop(); onDone(); }}>Jag har läst texten – till frågorna</button>
    </div>
  );
}

function Questions({ moduleId, questions, initial, onDone }: { moduleId: string; questions: ReadingQuestion[]; initial?: { answers: Record<string, boolean>; questionIndex: number }; onDone: () => void }) {
  const [index, setIndex] = useState(initial?.questionIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, boolean>>(initial?.answers ?? {});
  const [picked, setPicked] = useState<number | null>(null);
  const q = questions[index];

  if (!q) {
    const correct = Object.values(answers).filter(Boolean).length;
    return (
      <div className="stack celebrate">
        <h2>{correct} av {questions.length} rätt</h2>
        <p className="muted">{correct === questions.length ? 'Utmärkt läsförståelse!' : 'Bra! Läs gärna texten igen om något var oklart.'}</p>
        <button className="btn block" onClick={async () => { await completeStep(moduleId, 'read'); onDone(); }}>Klar med läsningen</button>
      </div>
    );
  }
  const options = q.kind === 'choice' ? q.options : ['Sant', 'Falskt'];
  const correctIndex = q.kind === 'choice' ? q.correctIndex : q.correct ? 0 : 1;
  const answered = picked !== null;
  const next = async () => {
    const nextAnswers = { ...answers, [q.id]: picked === correctIndex };
    const nextIndex = index + 1;
    await saveReadState(moduleId, { answers: nextAnswers, questionIndex: nextIndex, textRead: true });
    setAnswers(nextAnswers);
    setPicked(null);
    setIndex(nextIndex);
  };
  return (
    <div className="stack">
      <ProgressBar value={index} max={questions.length} label={`Fråga ${index + 1} av ${questions.length}`} accent />
      <div className="small muted">Fråga {index + 1} av {questions.length} · {q.kind === 'truefalse' ? 'Sant eller falskt?' : 'Välj rätt svar'}</div>
      <div className="card"><strong><SvText text={q.kind === 'choice' ? q.promptSv : q.statementSv} /></strong></div>
      <div className="options">
        {options.map((o, i) => (
          <button key={i} className={`option ${answered && i === correctIndex ? 'correct' : answered && i === picked ? 'wrong' : answered ? 'dim' : ''}`} disabled={answered}
            onClick={() => { setPicked(i); emit(i === correctIndex ? { type: 'answer_correct', senseId: '', firstTry: true } : { type: 'answer_incorrect', senseId: '' }); }}>
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <div className={`feedback ${picked === correctIndex ? 'ok' : 'fail'} stack-sm`} aria-live="polite">
          <strong>{picked === correctIndex ? 'Rätt!' : 'Inte riktigt.'}</strong>
          <div className="small"><SvText text={q.explanationSv} /></div>
          {q.explanationJa && <Ja text={q.explanationJa} as="div" className="small muted" />}
        </div>
      )}
      {answered && <button className="btn block" onClick={next} autoFocus>Fortsätt</button>}
    </div>
  );
}
