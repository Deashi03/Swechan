/**
 * Visual plan (0.12): which kind of visual every sense should get
 * (src/content/data/images/visualPlan.json, maintained with `npm run visuals:plan`).
 * Developer tooling only – the app reads the produced visuals (images.ts), not the plan.
 */
import { z } from 'zod';
import raw from './data/images/visualPlan.json';
import { allWordImages } from './images';

export const VISUAL_KINDS = ['animation', 'scene', 'symbol', 'none'] as const;
export type VisualKind = (typeof VISUAL_KINDS)[number];
const PlanRow = z.object({ kind: z.enum(VISUAL_KINDS), by: z.enum(['heuristic', 'manual']) });
const PlanFile = z.object({ _comment: z.string().optional(), plan: z.record(z.string().regex(/^s\./), PlanRow) });
const parsed = PlanFile.parse(raw);

export function plannedVisual(senseId: string): z.infer<typeof PlanRow> | undefined { return parsed.plan[senseId]; }
export function allPlannedVisuals(): Readonly<Record<string, z.infer<typeof PlanRow>>> { return parsed.plan; }

/** Coverage of a set of senses: how many are planned per kind and how many already have a produced visual. */
export function visualCoverage(senseIds: readonly string[]): { planned: Record<VisualKind, number>; produced: number; missingPlan: number; total: number } {
  const planned = { animation: 0, scene: 0, symbol: 0, none: 0 } as Record<VisualKind, number>;
  const produced = new Set(allWordImages().map((i) => i.senseId));
  let have = 0, missingPlan = 0;
  for (const id of senseIds) {
    const p = parsed.plan[id];
    if (p) planned[p.kind]++; else missingPlan++;
    if (produced.has(id) || p?.kind === 'none') have++;
  }
  return { planned, produced: have, missingPlan, total: senseIds.length };
}
