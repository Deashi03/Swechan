/**
 * Animated word visual (0.12): loads the raw scene JSON for a sense from
 * public/anim/scenes/, compiles it with the Animation_tool- player and shows
 * - `intro`: the animation, played once; afterwards a ▶ button replays it (under reduced
 *   motion it starts paused on the poster frame with the same button – built into ScenePlayer),
 * - `once`: played once, then back to the poster frame with ▶ (picture → word exercise, 0.16),
 * - `still`: the poster frame only (pictures as answer options: equal terms for all).
 * This module is lazy-loaded so that the player is its own chunk.
 */
import { useEffect, useState } from 'react';
import { ScenePlayer, ScenePoster, Scene, migrateScene, type SceneT } from '../anim/player';
import { sceneUrl } from '../../content/images';

const cache = new Map<string, Promise<SceneT | null>>();
export function loadScene(file: string): Promise<SceneT | null> {
  let p = cache.get(file);
  if (!p) {
    p = fetch(sceneUrl(file))
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => { if (!raw) return null; const s = Scene.safeParse(migrateScene(raw)); return s.success ? s.data : null; })
      .catch(() => null);
    cache.set(file, p);
  }
  return p;
}

export default function AnimatedWordVisual({ file, size, mode, label, fallback }: {
  file: string; size: number; mode: 'intro' | 'once' | 'still'; label: string; fallback?: React.ReactNode;
}) {
  const [scene, setScene] = useState<SceneT | null | undefined>(undefined);
  useEffect(() => {
    let on = true;
    setScene(undefined);
    loadScene(file).then((s) => { if (on) setScene(s); });
    return () => { on = false; };
  }, [file]);
  if (scene === undefined) return <span className="word-image loading" role="img" aria-label={label} style={{ width: size, height: size }} />;
  if (scene === null) return <>{fallback ?? null}</>;
  return (
    <span className={`word-image anim ${mode}`} style={{ width: size }}>
      {mode !== 'still'
        ? <ScenePlayer scene={scene} size={size} autoplay loop={false} endOnPoster={mode === 'once'} ariaLabel={label} />
        : <ScenePoster scene={scene} size={size} ariaLabel={label} />}
    </span>
  );
}
