/**
 * Word images (0.6): one optional picture per sense – a code illustration
 * (src/ui/wordArt) or a freely licensed photo (public/img/words). The data
 * says whether the picture is unambiguous enough for picture exercises
 * (`quiz`), which visual group it belongs to and which senses it could be
 * confused with. Distractor rules for picture exercises live here so that the
 * exercise generator and the tests use the same definition.
 */
import { z } from 'zod';
import raw from './data/images/wordImages.json';

const Credit = z.object({ title: z.string().min(1), creator: z.string().min(1), license: z.string().min(1), licenseUrl: z.string().url(), source: z.string().url() });
const Common = {
  senseId: z.string().regex(/^s\./),
  group: z.string().min(1),
  quiz: z.boolean(),
  confusableWith: z.array(z.string().regex(/^s\./)).optional(),
  symbol: z.boolean().optional(),
};
export const WordImageSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('illustration'), motif: z.string().min(1), ...Common }),
  z.object({ kind: z.literal('photo'), file: z.string().regex(/^[\w-]+\.(webp|jpg|png)$/), credit: Credit, ...Common }),
]);
export const WordImageFileSchema = z.object({ _comment: z.string().optional(), images: z.array(WordImageSchema) });
export type WordImage = z.infer<typeof WordImageSchema>;

const parsed = WordImageFileSchema.parse(raw);
const bySense = new Map<string, WordImage>(parsed.images.map((i) => [i.senseId, i]));

export function allWordImages(): readonly WordImage[] { return parsed.images; }
export function imageFor(senseId: string): WordImage | undefined { return bySense.get(senseId); }
/** The image if it may be used in picture exercises. */
export function quizImageFor(senseId: string): WordImage | undefined {
  const i = bySense.get(senseId);
  return i?.quiz ? i : undefined;
}
/** Public URL of a photo (respects the app's base path). */
export function photoUrl(file: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
  return `${base}img/words/${file}`;
}

/**
 * May `candidate` be offered as a wrong option next to the picture of `target`?
 * Only quiz pictures, never the same visual group, never a declared confusion
 * (in either direction).
 */
export function imageDistractorAllowed(targetSenseId: string, candidateSenseId: string): boolean {
  if (targetSenseId === candidateSenseId) return false;
  const t = bySense.get(targetSenseId), c = bySense.get(candidateSenseId);
  if (!t?.quiz || !c?.quiz) return false;
  if (t.group === c.group) return false;
  if (t.confusableWith?.includes(candidateSenseId) || c.confusableWith?.includes(targetSenseId)) return false;
  return true;
}
