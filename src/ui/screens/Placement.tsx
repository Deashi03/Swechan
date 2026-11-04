import { useState } from 'react';
import { getContent } from '../../content/repository';
import { checkTypedAnswer } from '../../learning/answerCheck';
import { scorePlacement } from '../../learning/placement';
import { setMeta } from '../../storage/db';
import { navigate } from '../app/router';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { ProgressBar } from '../components/Progress';
import type { PlacementResult } from '../../storage/types';

export function PlacementScreen() {
  const items = getContent().placementItems;
  const [index, setIndex] = useState(-1);
  const [correct, setCorrect] = useState<Set<string>>(new Set());
  const [value, setValue] = useState('');
  const [result, setResult] = useState<PlacementResult | null>(null);

  const finishTest = async (c: Set<string>) => {
    const r = scorePlacement(items, c, Date.now());
    await setMeta('placement', r);
    await setMeta('onboarded', true);
    setResult(r);
  };
  const answer = async (ok: boolean) => {
    const it = items[index]!;
    const c = new Set(correct);
    if (ok) c.add(it.id);
    setCorrect(c);
    setValue('');
    if (index + 1 >= items.length) await finishTest(c);
    else setIndex(index + 1);
  };
  const skip = async () => {
    await setMeta('placement', { takenAt: Date.now(), skipped: true, estimatedLevel: null, perLevel: {} } satisfies PlacementResult);
    await setMeta('onboarded', true);
    navigate({ name: 'home' }, { replace: true });
  };

  if (result) {
    return (
      <div className="stack celebrate">
        <Avatar mood="happy" size={96} />
        <h1>Tack!</h1>
        <p>{result.estimatedLevel ? <>Ditt ordförråd verkar ligga ungefär på nivå <strong>{result.estimatedLevel}</strong>.</> : 'Vi börjar från grunden.'}</p>
        <p className="small muted">Det här är en grov uppskattning från ett kort test – inte en officiell eller validerad CEFR-bedömning. Den används för att föreslå moduler, anpassa samtalsprompten och korta ner introduktionen av mycket enkla ord. Du kan göra om testet i inställningarna.</p>
        <button className="btn block" onClick={() => navigate({ name: 'home' }, { replace: true })}>Till Swechan</button>
      </div>
    );
  }
  if (index < 0) {
    return (
      <div className="stack">
        <h1>Kort nivåtest</h1>
        <p>{items.length} snabba frågor om ordförråd, stavning och böjning på olika nivåer. Det tar ungefär 3 minuter. Gissa inte – välj ”Vet inte” om du inte vet.</p>
        <Ja as="p" className="muted small" text="{語彙|ごい}・つづり・{語形変化|ごけいへんか}の{短|みじか}いテストです（{約|やく}3{分|ぷん}）。わからないときは「Vet inte」を{押|お}してください。" />
        <button className="btn block" onClick={() => setIndex(0)}>Starta testet</button>
        <button className="btn ghost block" onClick={skip}>Hoppa över</button>
      </div>
    );
  }
  const it = items[index]!;
  return (
    <div className="stack">
      <div className="session-bar">
        <button className="icon-btn" onClick={skip} aria-label="Avbryt testet"><Icon name="close" /></button>
        <ProgressBar value={index} max={items.length} label={`Fråga ${index + 1} av ${items.length}`} />
      </div>
      {it.kind === 'meaning' ? (
        <>
          <div className="small muted">Vad betyder ordet?</div>
          <div className="card prompt-word" lang="sv">{it.promptSv}</div>
          <div className="options">
            {(it.options ?? []).map((o) => <button key={o} className="option" onClick={() => answer(o === it.answers[0])}><Ja text={o} /></button>)}
          </div>
        </>
      ) : (
        <form className="stack" onSubmit={(e) => { e.preventDefault(); if (value.trim()) answer(checkTypedAnswer(value, it.answers).correct); }}>
          <div className="small muted">{it.kind === 'spelling' ? it.promptSv : 'Skriv rätt form.'}</div>
          <div className="card">{it.promptJa ? <Ja text={it.promptJa} className="prompt-ja" /> : <strong lang="sv">{it.promptSv}</strong>}</div>
          <input className="input" value={value} onChange={(e) => setValue(e.target.value)} lang="sv" autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} autoFocus aria-label="Ditt svar" />
          <button className="btn block" type="submit" disabled={!value.trim()}>Nästa</button>
        </form>
      )}
      <button className="btn ghost block" onClick={() => answer(false)}>Vet inte</button>
    </div>
  );
}

export function WelcomeScreen() {
  return (
    <div className="stack celebrate">
      <Avatar mood="happy" size={120} />
      <h1>Välkommen till Swechan!</h1>
      <Ja as="p" text="Swechan へようこそ！{毎日|まいにち}{少|すこ}しずつ、スウェーデン{語|ご}の{言葉|ことば}を{増|ふ}やしていきましょう。" />
      <p className="muted">Varje dag: repetera tidigare ord och lär dig en ny modul med 20–30 ord.</p>
      <button className="btn block" onClick={() => navigate({ name: 'placement' }, { replace: true })}>Gör ett kort nivåtest</button>
      <button className="btn ghost block" onClick={async () => {
        await setMeta('placement', { takenAt: Date.now(), skipped: true, estimatedLevel: null, perLevel: {} });
        await setMeta('onboarded', true);
        navigate({ name: 'home' }, { replace: true });
      }}>Hoppa över</button>
    </div>
  );
}
