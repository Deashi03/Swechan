import { useEffect, useState } from 'react';
import { getSpeech } from '../../audio/speech';
import { useSettings } from '../app/hooks';
import { Icon } from './Icon';

/** Pronunciation button – only rendered if a Swedish voice is available (no fake functionality). */
export function SpeakButton({ text, label = 'Lyssna' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  const settings = useSettings();
  useEffect(() => { let alive = true; getSpeech().isAvailable().then((v) => alive && setOk(v)); return () => { alive = false; }; }, []);
  if (!ok) return null;
  return (
    <button className="icon-btn" onClick={() => getSpeech().speak(text, { rate: settings.ttsRate })} aria-label={`${label}: ${text}`}>
      <Icon name="speaker" />
    </button>
  );
}
