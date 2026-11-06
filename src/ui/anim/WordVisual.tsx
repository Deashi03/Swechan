/**
 * <WordVisual> – reference wiring for Swechan. Looks up the sense in the visuals
 * registry, lazy-loads the animation JSON and plays it (autoplay once in the
 * word introduction; poster only in quizzes). Falls back to `renderImage`
 * (Swechan's wordArt) when there is no animation. Copy and adapt; the player
 * itself (ScenePlayer/ScenePoster) is the stable part.
 */
import { useEffect, useState, type ReactElement } from 'react';
import { ScenePlayer, ScenePoster } from './player';
import { Scene, type Scene as SceneT } from './schema/scene';
import { migrateScene } from './schema/migrate';

export type VisualEntry = { senseId: string; kind: 'animation' | 'illustration' | 'symbol' | 'photo'; animationId?: string; motif?: string; quiz?: boolean; group?: string; confusableWith?: string[] };
export type WordVisualProps = {
  senseId: string; size?: number; mode?: 'intro' | 'quiz' | 'spelling';
  registry: Record<string, VisualEntry>;
  /** returns the raw scene JSON for an animationId (fetch of a static file, or import.meta.glob) */
  loadScene: (animationId: string) => Promise<unknown>;
  /** Swechan's existing still image for a sense (wordArt), or null */
  renderImage?: (entry: VisualEntry, size: number) => ReactElement | null;
};
export function WordVisual({ senseId, size = 180, mode = 'intro', registry, loadScene, renderImage }: WordVisualProps): ReactElement | null {
  const entry = registry[senseId];
  const [scene, setScene] = useState<SceneT | null>(null);
  useEffect(() => { let on = true; setScene(null); if (entry?.kind === 'animation' && entry.animationId) loadScene(entry.animationId).then((raw) => { const p = Scene.safeParse(migrateScene(raw)); if (on && p.success) setScene(p.data); }).catch(() => undefined); return () => { on = false; }; }, [entry?.animationId, entry?.kind, loadScene]);
  if (!entry) return null;
  if (entry.kind === 'animation') {
    if (!scene) return <div style={{ width: size, height: size, borderRadius: 16, background: '#f6f2ea' }} aria-hidden />;
    // quizzes and spelling show the poster frame only: equal terms for every alternative, no moving image
    if (mode !== 'intro') return <ScenePoster scene={scene} size={size} ariaLabel={scene.titleSv} />;
    return <ScenePlayer scene={scene} size={size} autoplay loop={false} controls ariaLabel={scene.titleSv} />;
  }
  return renderImage ? renderImage(entry, size) : null;
}
