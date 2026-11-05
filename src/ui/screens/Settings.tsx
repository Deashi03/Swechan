import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { getSpeech } from '../../audio/speech';
import { APP_VERSION, sessionConfig } from '../../config/appConfig';
import { allWordImages } from '../../content/images';
import { getContent } from '../../content/repository';
import { getScheduler } from '../../repetition/fsrsScheduler';
import { downloadJson, exportBackup, hasRestorePoint, importBackup, undoLastImport } from '../../storage/backup';
import { getMeta, requestPersistentStorage } from '../../storage/db';
import { updateSettings } from '../../storage/settings';
import type { PlacementResult } from '../../storage/types';
import { useSettings } from '../app/hooks';
import { href, navigate } from '../app/router';
import { toast } from '../components/Toast';
import { DevToolsPanel } from './DevTools';

export function SettingsScreen() {
  const s = useSettings();
  const placement = useLiveQuery(() => getMeta<PlacementResult>('placement'), []);
  const restore = useLiveQuery(() => hasRestorePoint(), []);
  const [voice, setVoice] = useState<string | null | undefined>(undefined);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { getSpeech().isAvailable().then((ok) => setVoice(ok ? getSpeech().voiceName : null)); navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null)); }, []);

  const doExport = async () => {
    const b = await exportBackup();
    downloadJson(`swechan-backup-${b.exportedAt.slice(0, 10)}.json`, b);
    toast('Säkerhetskopian är skapad');
  };
  const doImport = async (f: File) => {
    if (!confirm('Importera säkerhetskopian? Nuvarande data ersätts (en återställningspunkt sparas först).')) return;
    const r = await importBackup(await f.text());
    setImportMsg(r.ok ? `Importerat: ${r.counts.cards} repetitionskort, ${r.counts.modules} moduler, ${r.counts.savedWords} sparade ord.` : r.error);
  };

  return (
    <div className="stack">
      <button className="btn ghost small" style={{ paddingLeft: 0 }} onClick={() => navigate({ name: 'home' })}>‹ Hem</button>
      <h1>Inställningar</h1>

      <section className="card stack-sm">
        <h2>Studier</h2>
        <label className="row between">
          <span>Repetitionsuppgifter per dag<br /><span className="xsmall muted">Standard {sessionConfig.defaultDailyReviewCount}. Gäller från nästa dag.</span></span>
          <span className="row">
            <button className="icon-btn" aria-label="Minska" onClick={() => updateSettings({ dailyReviewCount: s.dailyReviewCount - 5 })}>−</button>
            <strong aria-live="polite">{s.dailyReviewCount}</strong>
            <button className="icon-btn" aria-label="Öka" onClick={() => updateSettings({ dailyReviewCount: s.dailyReviewCount + 5 })}>+</button>
          </span>
        </label>
        <div className="row between">
          <span>Nivåtest<br /><span className="xsmall muted">{placement?.estimatedLevel ? `Uppskattad nivå: ungefär ${placement.estimatedLevel}` : placement?.skipped ? 'Överhoppat' : 'Inte gjort'}</span></span>
          <a className="btn secondary small" href={href({ name: 'placement' })}>{placement && !placement.skipped ? 'Gör om' : 'Gör testet'}</a>
        </div>
      </section>

      <section className="card stack-sm">
        <h2>Visning</h2>
        <label className="row between">
          <span>Visa furigana</span>
          <input type="checkbox" checked={s.furigana} onChange={(e) => updateSettings({ furigana: e.target.checked })} style={{ width: 24, height: 24 }} />
        </label>
        <label className="row between">
          <span>Animationer</span>
          <select value={s.reducedMotion} onChange={(e) => updateSettings({ reducedMotion: e.target.value as never })} className="input" style={{ width: 'auto', minHeight: 40, fontSize: 'var(--fs-sm)' }}>
            <option value="system">Följ systemet</option>
            <option value="reduce">Minska</option>
            <option value="full">Visa alla</option>
          </select>
        </label>
        <div className="row between">
          <span>Uppläsning (svensk röst)<br /><span className="xsmall muted">{voice === undefined ? 'Kontrollerar…' : voice ? `Röst: ${voice}` : 'Ingen svensk röst hittades på enheten'}</span></span>
          {voice && <button className="btn secondary small" onClick={() => getSpeech().speak('Hej! Välkommen till Swechan.', { rate: s.ttsRate })}>Testa</button>}
        </div>
        <label className="row between">
          <span>Taltempo</span>
          <input type="range" min={0.6} max={1.2} step={0.1} value={s.ttsRate} onChange={(e) => updateSettings({ ttsRate: Number(e.target.value) })} aria-label="Taltempo" />
        </label>
        <div className="xsmall muted">Studiedatum: enhetens lokala tid{s.timeZone ? ` (fast tidszon: ${s.timeZone})` : ''}.</div>
      </section>

      <section className="card stack-sm">
        <h2>Säkerhetskopia</h2>
        <p className="small muted">Din progression sparas bara lokalt på den här enheten. Lokal lagring är inte en permanent säkerhetskopia – exportera regelbundet och spara filen t.ex. i iCloud Drive.</p>
        <button className="btn block" onClick={doExport}>Exportera progression</button>
        <button className="btn secondary block" onClick={() => file.current?.click()}>Importera säkerhetskopia</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ''; }} />
        {importMsg && <p className="small" role="status">{importMsg}</p>}
        {restore && (
          <button className="btn ghost small" onClick={async () => { if (confirm('Ångra senaste importen och återställ datan som fanns innan?')) { await undoLastImport(); toast('Återställt'); } }}>
            Ångra senaste import ({new Date(restore).toLocaleString('sv-SE')})
          </button>
        )}
        <div className="row between xsmall muted">
          <span>Skyddad lagring: {persisted === null ? 'okänt' : persisted ? 'ja' : 'nej'}</span>
          {!persisted && <button className="btn ghost small" onClick={async () => setPersisted(await requestPersistentStorage())}>Begär skydd</button>}
        </div>
      </section>

      <DevToolsPanel />

      <a className="card clickable" href={href({ name: 'stats' })} style={{ textDecoration: 'none' }}><strong>Statistik och kunskapsutveckling ›</strong></a>

      <details className="card small">
        <summary><strong>Bildkällor</strong></summary>
        <p className="muted">Illustrationerna är ritade för Swechan. Fotona är fritt licensierade:</p>
        <ul className="stack-sm" style={{ paddingLeft: 18, margin: 0 }}>
          {allWordImages().map((img) => img.kind === 'photo' && (
            <li key={img.senseId}>
              <span lang="sv">{getContent().getSense(img.senseId)?.entry.lemma}</span>: <a href={img.credit.source} target="_blank" rel="noreferrer">{img.credit.title}</a> av {img.credit.creator}, <a href={img.credit.licenseUrl} target="_blank" rel="noreferrer">{img.credit.license}</a> (beskuren och komprimerad)
            </li>
          ))}
        </ul>
      </details>

      <section className="small muted stack-sm">
        <div>Swechan {APP_VERSION}</div>
        <div>Repetitionsalgoritm: {getScheduler().name}</div>
        <div>Innehållet i version 0.1 är framtaget med AI-stöd och har ännu inte granskats av en mänsklig språkgranskare.</div>
      </section>
    </div>
  );
}
