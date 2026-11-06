/**
 * Visual for a word sense (0.6, animations 0.12): an animation from
 * Animation_tool- (player loaded lazily as its own chunk), a code illustration
 * (also lazy) or a freely licensed photo. Renders nothing for senses without a
 * visual. `mode="intro"` plays an animation once (word introduction); every
 * other use shows the poster frame.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { imageFor, photoUrl } from '../../content/images';

type Renderer = (motif: string) => string | null;
let rendererPromise: Promise<Renderer> | null = null;
let renderer: Renderer | null = null;
function loadRenderer(): Promise<Renderer> {
  rendererPromise ??= import('../wordArt/render').then((m) => (renderer = m.renderWordArt));
  return rendererPromise;
}
const AnimatedWordVisual = lazy(() => import('./AnimatedWordVisual'));
const AnimatedFace = lazy(() => import('./AnimatedFace'));

function Illustration({ motif, size, aria }: { motif: string; size: number; aria: string }) {
  const [, force] = useState(0);
  useEffect(() => { if (!renderer) loadRenderer().then(() => force((n) => n + 1)).catch(() => undefined); }, [motif]);
  const style = { width: size, height: size };
  const svg = renderer?.(motif);
  return svg
    ? <span className="word-image" role="img" aria-label={aria} style={style} dangerouslySetInnerHTML={{ __html: svg }} />
    : <span className="word-image loading" role="img" aria-label={aria} style={style} />;
}

export function WordImage({ senseId, size = 160, label, mode = 'still' }: { senseId: string; size?: number; label?: string; mode?: 'intro' | 'still' }) {
  const img = imageFor(senseId);
  if (!img) return null;
  const aria = label ?? 'Bild';
  if (img.kind === 'photo') {
    return <img className="word-image photo" src={photoUrl(img.file)} width={size} height={size} alt={aria} loading="lazy" decoding="async" style={{ width: size, height: size }} />;
  }
  if (img.kind === 'animation') {
    const fallback = img.fallbackMotif ? <Illustration motif={img.fallbackMotif} size={size} aria={aria} /> : null;
    return (
      <Suspense fallback={<span className="word-image loading" role="img" aria-label={aria} style={{ width: size, height: size }} />}>
        <AnimatedWordVisual file={img.file} size={size} mode={mode} label={aria} fallback={fallback} />
      </Suspense>
    );
  }
  if (img.kind === 'face') {
    const fallback = img.fallbackMotif ? <Illustration motif={img.fallbackMotif} size={size} aria={aria} /> : null;
    return (
      <Suspense fallback={<span className="word-image loading" role="img" aria-label={aria} style={{ width: size, height: size }} />}>
        <AnimatedFace senseId={senseId} size={size} mode={mode} label={aria} fallback={fallback} />
      </Suspense>
    );
  }
  return <Illustration motif={img.motif} size={size} aria={aria} />;
}

/** Short attribution line for photos (required by CC BY). */
export function PhotoCredit({ senseId }: { senseId: string }) {
  const img = imageFor(senseId);
  if (img?.kind !== 'photo') return null;
  return (
    <div className="xsmall faint">
      Foto: <a href={img.credit.source} target="_blank" rel="noreferrer">{img.credit.creator}</a> · <a href={img.credit.licenseUrl} target="_blank" rel="noreferrer">{img.credit.license}</a>
    </div>
  );
}
