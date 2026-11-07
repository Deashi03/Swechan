/**
 * Face player (0.14): plays a face scene (src/content/data/faces/faces.json) with the face rig.
 * `intro` plays once, then ▶ replays; under reduced motion it starts on the poster frame.
 * `once` plays once and returns to the poster frame (picture → word exercise, 0.16).
 * `still` shows the poster frame (pictures as answer options). Lazy-loaded: rig + data are one chunk.
 */
import { useEffect, useId, useRef, useState } from 'react';
import { faceSceneFor } from '../../content/faces';
import { faceSvg } from '../face/rig';
import { useReducedMotion } from '../face/useReducedMotion';

export default function AnimatedFace({ senseId, size, mode, label, fallback }: { senseId: string; size: number; mode: 'intro' | 'once' | 'still'; label: string; fallback?: React.ReactNode }) {
  const scene = faceSceneFor(senseId);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const plays = mode !== 'still';
  const [t, setT] = useState(() => (scene && plays && !reduced ? 0 : scene?.posterMs ?? 0));
  const [playing, setPlaying] = useState(plays && !reduced);
  const raf = useRef(0);
  useEffect(() => {
    if (!scene || !playing) return;
    const start = performance.now() - (t >= scene.durationMs ? 0 : t);
    const step = (now: number) => {
      const el = now - start;
      if (el >= scene.durationMs) { setT(mode === 'once' ? scene.posterMs : scene.durationMs); setPlaying(false); return; }
      setT(el);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, playing]);
  if (!scene) return <>{fallback ?? null}</>;
  const svg = faceSvg(scene, t, `f${uid}`);
  return (
    <span className={`word-image face ${mode}`} style={{ width: size, height: size, position: 'relative', display: 'inline-block' }}>
      <span role="img" aria-label={label} style={{ display: 'block', width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />
      {plays && !playing && (
        <button type="button" aria-label={reduced ? `Spela upp animationen ${label} (rörelse är avstängd i inställningarna)` : `Spela upp ${label}`}
          onClick={() => { setT(0); setPlaying(true); }}
          style={{ position: 'absolute', right: 6, bottom: 6, width: 34, height: 34, borderRadius: 17, border: 'none', background: 'rgba(43,42,51,0.78)', color: '#fff', fontSize: 16, lineHeight: 1, cursor: 'pointer' }}>▶</button>
      )}
    </span>
  );
}
