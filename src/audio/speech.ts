/**
 * Audio service (text-to-speech).
 * v0.1 uses the browser's Web Speech API and only if a Swedish voice exists.
 * Callers use `getSpeech()`; a future implementation can play recorded audio
 * files or call an external TTS provider behind the same interface.
 */
export interface SpeechService {
  /** Resolves true if Swedish speech is available on this device. */
  isAvailable(): Promise<boolean>;
  speak(text: string, opts?: { rate?: number; onEnd?: () => void }): void;
  stop(): void;
  readonly voiceName: string | null;
}

class BrowserSpeech implements SpeechService {
  private voice: SpeechSynthesisVoice | null = null;
  private ready: Promise<boolean> | null = null;
  get voiceName() { return this.voice?.name ?? null; }

  isAvailable(): Promise<boolean> {
    if (this.ready) return this.ready;
    this.ready = new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve(false);
      const pick = () => {
        const voices = window.speechSynthesis.getVoices();
        const sv = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('sv'));
        this.voice = sv.find((v) => v.localService) ?? sv[0] ?? null;
        return voices.length > 0;
      };
      if (pick()) return resolve(!!this.voice);
      const onChange = () => { pick(); resolve(!!this.voice); };
      window.speechSynthesis.addEventListener?.('voiceschanged', onChange, { once: true });
      setTimeout(() => { pick(); resolve(!!this.voice); }, 1500);
    });
    return this.ready;
  }

  speak(text: string, opts: { rate?: number; onEnd?: () => void } = {}) {
    if (!this.voice) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = opts.rate ?? 0.9;
    if (opts.onEnd) { u.onend = opts.onEnd; u.onerror = opts.onEnd; }
    window.speechSynthesis.speak(u);
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

let service: SpeechService | null = null;
export function getSpeech(): SpeechService {
  if (!service) service = new BrowserSpeech();
  return service;
}
