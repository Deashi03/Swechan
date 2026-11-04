/**
 * Step 3 – spoken conversation in ChatGPT (v0.1). Swedish copy explains the
 * flow; Swechan cannot observe ChatGPT, so completion is confirmed manually.
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { getContent } from '../../content/repository';
import { buildConversationPrompt } from '../../conversation/promptBuilder';
import { chatGptProvider } from '../../conversation/provider';
import { completeStep, getModuleProgress } from '../../modules/moduleService';
import { getDb, getMeta } from '../../storage/db';
import type { PlacementResult } from '../../storage/types';
import { navigate } from '../app/router';
import { Jonathan } from '../components/Jonathan';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { toast } from '../components/Toast';

export function ConverseStep({ id }: { id: string }) {
  const repo = getContent();
  const m = repo.getModule(id);
  const ctx = useLiveQuery(async () => ({
    placement: await getMeta<PlacementResult>('placement'),
    known: new Set((await getDb().cards.toArray()).map((c) => c.senseId)).size,
    progress: await getModuleProgress(id),
  }), [id]);
  const [copied, setCopied] = useState(false);
  const [finished, setFinished] = useState(false);
  const prompt = useMemo(() => (m && ctx ? buildConversationPrompt(m, repo, { estimatedLevel: ctx.placement?.estimatedLevel ?? null, knownWordCount: ctx.known }) : ''), [m, ctx, repo]);
  if (!m) return <p>Modulen finns inte.</p>;
  if (!ctx) return <p className="muted">Laddar…</p>;

  if (finished || ctx.progress?.status === 'completed') {
    return (
      <div className="celebrate stack">
        <Jonathan mood="cheer" size={110} />
        <h1>Modulen är klar! 🎉</h1>
        <p className="muted">Orden från ”{m.titleSv}” finns nu i din repetition.</p>
        <button className="btn block" onClick={() => navigate({ name: 'home' })}>Till startsidan</button>
      </div>
    );
  }

  const copy = async () => {
    const r = await chatGptProvider.deliverPrompt(prompt);
    setCopied(r === 'copied');
    toast(r === 'copied' ? 'Samtalsprompten är kopierad' : 'Kunde inte kopiera – markera texten nedan och kopiera manuellt');
  };

  return (
    <div className="stack">
      <div className="session-bar">
        <button className="icon-btn" onClick={() => navigate({ name: 'module', id })} aria-label="Tillbaka till modulen"><Icon name="close" /></button>
        <strong className="grow">Steg 3 · Samtal</strong>
      </div>
      <div className="card tint-converse stack-sm">
        <h2>Prata om ämnet med ChatGPT</h2>
        <ol className="small" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Tryck på <strong>Kopiera samtalsprompt</strong>.</li>
          <li>Öppna ChatGPT, klistra in prompten och starta röstläget.</li>
          <li>Prata i 10–15 minuter. Försök använda modulens ord.</li>
          <li>Kom tillbaka hit och markera samtalet som genomfört.</li>
        </ol>
        <Ja as="p" className="small muted" text="プロンプトをコピーして ChatGPT に{貼|は}り{付|つ}け、{音声|おんせい}モードで{話|はな}しましょう。{終|お}わったら、ここに{戻|もど}って「{完了|かんりょう}」を{押|お}してください。" />
      </div>
      <button className="btn block" onClick={copy}><Icon name="copy" size={18} /> {copied ? 'Kopierad ✓ – kopiera igen' : 'Kopiera samtalsprompt'}</button>
      <a className="btn secondary block" href={chatGptProvider.externalUrl} target="_blank" rel="noopener noreferrer"><Icon name="external" size={18} /> Öppna ChatGPT</a>
      <details>
        <summary>Visa prompten</summary>
        <pre className="card small" style={{ whiteSpace: 'pre-wrap', userSelect: 'text', fontFamily: 'inherit' }}>{prompt}</pre>
      </details>
      <hr />
      <button className="btn accent block" onClick={async () => { await completeStep(id, 'converse'); setFinished(true); }}>Jag har genomfört samtalet</button>
      <p className="xsmall faint center">Swechan kan inte se vad som händer i ChatGPT – markera själv när du är klar.</p>
    </div>
  );
}
