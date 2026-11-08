/**
 * Blind-test gate for word visuals (0.19.1). Pictures of properties (adjectives) and symbols are the
 * ones most likely to look right to their author and still not show the word. Each of them must carry a
 * `blindTest` record from an independent reviewer who saw the picture without its word, and the record
 * stores a fingerprint of exactly what was tested – redrawing the picture invalidates it.
 * Record results with `npm run art:blind:record`.
 */
import type { WordImage } from './images';

/** FNV-1a 32-bit hash as 8 hex characters – a stable fingerprint of a rendered picture. */
export function visualHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

/** What the reviewer actually saw: the rendered illustration, or the scene data of an animation/face. */
export function visualFingerprintSource(img: WordImage, io: { renderMotif: (m: string) => string | null; sceneFile: (f: string) => string; faceScene: (senseId: string) => unknown }): string | null {
  if (img.kind === 'illustration') return io.renderMotif(img.motif);
  if (img.kind === 'animation') return io.sceneFile(img.file);
  if (img.kind === 'face') return JSON.stringify(io.faceScene(img.senseId) ?? null);
  return null;
}

/** Visuals that must pass a blind test: symbols and pictures of adjectives that are taught in a module. */
export function needsBlindTest(img: WordImage, pos: string | undefined, inModule: boolean): boolean {
  if (img.kind === 'photo' || !inModule) return false;
  return img.symbol === true || pos === 'adjective';
}
