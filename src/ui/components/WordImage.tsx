/**
 * Picture for a word sense (0.6): a code illustration (loaded lazily as its
 * own chunk) or a freely licensed photo. Renders nothing for senses without a
 * picture.
 */
import { useEffect, useState } from 'react';
import { imageFor, photoUrl } from '../../content/images';

type Renderer = (motif: string) => string | null;
let rendererPromise: Promise<Renderer> | null = null;
let renderer: Renderer | null = null;
function loadRenderer(): Promise<Renderer> {
  rendererPromise ??= import('../wordArt/render').then((m) => (renderer = m.renderWordArt));
  return rendererPromise;
}

export function WordImage({ senseId, size = 160, label }: { senseId: string; size?: number; label?: string }) {
  const img = imageFor(senseId);
  const [, force] = useState(0);
  useEffect(() => {
    if (img?.kind === 'illustration' && !renderer) loadRenderer().then(() => force((n) => n + 1)).catch(() => undefined);
  }, [img]);
  if (!img) return null;
  const style = { width: size, height: size };
  const aria = label ?? 'Bild';
  if (img.kind === 'photo') {
    return <img className="word-image photo" src={photoUrl(img.file)} width={size} height={size} alt={aria} loading="lazy" decoding="async" style={style} />;
  }
  const svg = renderer?.(img.motif);
  return svg
    ? <span className="word-image" role="img" aria-label={aria} style={style} dangerouslySetInnerHTML={{ __html: svg }} />
    : <span className="word-image loading" role="img" aria-label={aria} style={style} />;
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
