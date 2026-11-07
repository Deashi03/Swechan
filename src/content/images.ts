/**
 * Word visuals (0.6, animations 0.12): one optional visual per sense – an animation
 * from Animation_tool- (public/anim/), a code illustration (src/ui/wordArt) or a
 * freely licensed photo (public/img/words). The data says whether the visual is
 * unambiguous enough for picture exercises (`quiz`), which visual group it belongs
 * to and which senses it could be confused with. Distractor rules for picture
 * exercises live here so that the exercise generator and the tests use the same
 * definition. Picture exercises show the poster frame of an animation.
 */
import { z } from 'zod';
import raw from './data/images/wordVisuals.json';

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
  z.object({
    kind: z.literal('animation'),
    /** id in Animation_tool- (may contain å/ä/ö) */
    animationId: z.string().min(1),
    /** ASCII-safe base name of public/anim/scenes/<file>.json */
    file: z.string().regex(/^[a-z0-9.-]+$/),
    reviewStatus: z.enum(['ai-draft', 'validated', 'reviewed']),
    /** code illustration shown if the animation cannot be loaded */
    fallbackMotif: z.string().min(1).optional(),
    ...Common,
  }),
  /** 0.14: an animated face (face rig) – the scene is in data/faces/faces.json under the same senseId */
  z.object({ kind: z.literal('face'), reviewStatus: z.enum(['ai-draft', 'validated', 'reviewed']), fallbackMotif: z.string().min(1).optional(), ...Common }),
]);
export const WordImageFileSchema = z.object({ _comment: z.string().optional(), images: z.array(WordImageSchema) });
export type WordImage = z.infer<typeof WordImageSchema>;

const parsed = WordImageFileSchema.parse(raw);
const bySense = new Map<string, WordImage>(parsed.images.map((i) => [i.senseId, i]));

export function allWordImages(): readonly WordImage[] { return parsed.images; }
export function imageFor(senseId: string): WordImage | undefined { return bySense.get(senseId); }
/** Same as imageFor (0.12 name: a visual can be an animation, an illustration or a photo). */
export const visualFor = imageFor;
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
function baseUrl(): string { return (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'; }
/** URL of an animation scene (raw JSON from Animation_tool-). */
export function sceneUrl(file: string): string { return `${baseUrl()}anim/scenes/${file}.json`; }

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
