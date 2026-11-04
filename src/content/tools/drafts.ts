/**
 * Module drafts (0.4 phase E). A draft is the planning step between a planned
 * catalog entry and a complete, validated lesson. It lives in content/drafts/
 * (outside the app bundle) and is never shown to learners.
 */
import { z } from 'zod';
import type { CatalogIndex } from '../catalog/catalogIndex';
import type { ContentRepository } from '../repository';
import { PartOfSpeech } from '../schema';

export const PlannedWord = z.object({
  lemma: z.string().min(1),
  pos: PartOfSpeech.optional(),
  active: z.boolean().default(true),
  /** Reuse an existing WordSense instead of creating a new entry (preferred – no duplicates). */
  existingSenseId: z.string().optional(),
  note: z.string().optional(),
});

export const ModuleDraft = z.object({
  draft: z.literal(true),
  catalogId: z.string(),
  titleSv: z.string(),
  /** Proposed published ID (m.<slug>). Must not collide with existing modules. */
  moduleId: z.string().regex(/^m\.[\w.-]+$/),
  targetWordCount: z.number().int().min(15).max(20),
  prerequisites: z.array(z.string()).default([]),
  plannedWords: z.array(PlannedWord),
  notes: z.string().default(''),
});
export type ModuleDraft = z.infer<typeof ModuleDraft>;

export function slugify(title: string): string {
  return title.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

/** A new draft for a planned catalog entry (title and target size come from the catalog). */
export function createDraft(catalog: CatalogIndex, catalogId: string, repo: ContentRepository): ModuleDraft {
  const entry = catalog.getModule(catalogId);
  if (!entry) throw new Error(`Okänt katalog-ID ${catalogId}`);
  if (catalog.publishedModuleFor(catalogId)) throw new Error(`${catalogId} är redan publicerad`);
  let moduleId = `m.${slugify(entry.titleSv)}`;
  for (let i = 2; repo.getModule(moduleId); i++) moduleId = `m.${slugify(entry.titleSv)}-${i}`;
  return {
    draft: true, catalogId, titleSv: entry.titleSv, moduleId, targetWordCount: entry.targetWordCount,
    prerequisites: [], plannedWords: [],
    notes: 'Fyll i 15–20 planerade målord (återanvänd befintliga betydelser med existingSenseId). Följ CONTENT_GUIDELINES.md.',
  };
}

export type DraftIssue = { level: 'error' | 'todo'; message: string };

export function validateDraft(raw: unknown, catalog: CatalogIndex, repo: ContentRepository): DraftIssue[] {
  const parsed = ModuleDraft.safeParse(raw);
  if (!parsed.success) return parsed.error.issues.map((i) => ({ level: 'error', message: `${i.path.join('.')}: ${i.message}` }));
  const d = parsed.data;
  const out: DraftIssue[] = [];
  const entry = catalog.getModule(d.catalogId);
  if (!entry) out.push({ level: 'error', message: `Okänt katalog-ID ${d.catalogId}` });
  else if (entry.titleSv !== d.titleSv) out.push({ level: 'error', message: `Titeln måste vara katalogens: "${entry.titleSv}"` });
  if (repo.getModule(d.moduleId)) out.push({ level: 'error', message: `Modul-ID ${d.moduleId} finns redan` });
  for (const p of d.prerequisites) if (!repo.getModule(p)) out.push({ level: 'error', message: `Förkunskap ${p} är inte publicerad` });
  const n = d.plannedWords.length;
  if (n < 15 || n > 20) out.push({ level: 'todo', message: `${n} planerade målord – behöver 15–20` });
  const seen = new Set<string>();
  for (const w of d.plannedWords) {
    const key = w.existingSenseId ?? w.lemma.toLowerCase();
    if (seen.has(key)) out.push({ level: 'error', message: `Dubblett: ${w.lemma}` });
    seen.add(key);
    if (w.existingSenseId && !repo.getSense(w.existingSenseId)) out.push({ level: 'error', message: `Okänd betydelse ${w.existingSenseId}` });
    if (!w.existingSenseId) {
      const existing = repo.entries.find((e) => e.lemma.toLowerCase() === w.lemma.toLowerCase());
      if (existing) out.push({ level: 'todo', message: `"${w.lemma}" finns redan i ordboken (${existing.senses.map((s) => s.id).join(', ')}) – återanvänd med existingSenseId om betydelsen är densamma` });
    }
  }
  return out;
}
