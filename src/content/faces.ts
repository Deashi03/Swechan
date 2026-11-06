/**
 * Face scenes (0.14): keyframed parameters for the face rig (src/ui/face/rig.ts), one per
 * sense whose visual has `kind: "face"` in wordVisuals.json. The data file is generated from
 * scripts/faces/*.faces.ts (`npm run faces:build`) and is only loaded with the face player
 * (its own lazy chunk).
 */
import { z } from 'zod';
import raw from './data/faces/faces.json';
import type { FaceScene } from '../ui/face/rig';

const OVERLAYS = ['sun', 'smell', 'stink', 'waves', 'note', 'bulb', 'question', 'exclaim', 'zzz', 'bubble', 'heart', 'tear', 'sweat', 'spray', 'breath', 'lamp', 'bell', 'star', 'lightning', 'bin', 'plate', 'cloud', 'clock'] as const;
const Overlay = z.object({ id: z.string().regex(/^[a-z0-9]+$/), kind: z.enum(OVERLAYS), x: z.number(), y: z.number(), text: z.string().max(12).optional(), s: z.number().positive().optional(), flip: z.boolean().optional() }).strict();
const Key = z.object({ t: z.number().int().min(0), e: z.enum(['linear', 'in', 'out', 'inout']).optional() }).catchall(z.number());
export const FaceSceneSchema = z.object({
  durationMs: z.number().int().min(500).max(8000),
  posterMs: z.number().int().min(0),
  overlays: z.array(Overlay).optional(),
  keys: z.array(Key).min(1),
}).strict().superRefine((s, ctx) => {
  if (s.posterMs > s.durationMs) ctx.addIssue({ code: 'custom', message: 'posterMs after the end' });
  for (let i = 1; i < s.keys.length; i++) if (s.keys[i]!.t < s.keys[i - 1]!.t) ctx.addIssue({ code: 'custom', message: `keys not sorted at ${i}` });
  const ids = new Set((s.overlays ?? []).map((o) => o.id));
  for (const k of s.keys) for (const name of Object.keys(k)) {
    if (name === 't' || name === 'e') continue;
    const m = name.match(/^[oxy]:(.+)$/);
    if (m && !ids.has(m[1]!)) ctx.addIssue({ code: 'custom', message: `unknown overlay "${m[1]}"` });
  }
});
export const FacesFileSchema = z.object({ _comment: z.string().optional(), faces: z.record(z.string().regex(/^s\./), FaceSceneSchema) });

const parsed = FacesFileSchema.parse(raw);
export function faceSceneFor(senseId: string): FaceScene | undefined { return parsed.faces[senseId] as FaceScene | undefined; }
export function allFaceScenes(): Record<string, FaceScene> { return parsed.faces as Record<string, FaceScene>; }
