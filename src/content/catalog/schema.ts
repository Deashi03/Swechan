/**
 * Planned module catalog (0.4) – lightweight planning metadata, kept strictly
 * separate from the full `Module` lesson schema (src/content/schema.ts).
 *
 * Source of truth: planning/catalog/swechan-catalog.v1.json (product owner).
 * A planned entry has only a title, a placement, a status and a target word
 * count – no words, texts or exercises – and can never be started.
 */
import { z } from 'zod';

export const CATALOG_SCHEMA_VERSION = '0.4-plan-index-v1';

/** R01 (root area) · R01-A01 (sub-area) · R01-A01-T01 (topic group). */
export const CatalogCategoryId = z.string().regex(/^R\d{2}(-A\d{2}(-T\d{2})?)?$/);

export const CatalogCategory = z.object({
  catalogCategoryId: CatalogCategoryId,
  parentCatalogCategoryId: CatalogCategoryId.nullable(),
  titleSv: z.string().min(1),
  /** null = no reviewed Japanese title yet (never invent one). */
  titleJa: z.string().min(1).nullable(),
});
export type CatalogCategory = z.infer<typeof CatalogCategory>;

export const CatalogModuleStatus = z.enum(['planned', 'published']);

export const CatalogModule = z.object({
  /** Stable planning ID, e.g. SWC-VAR-01-01-01. Never reused or renumbered. */
  catalogId: z.string().regex(/^SWC-[A-Z]{3}-\d{2}-\d{2}-\d{2}$/),
  catalogCategoryId: CatalogCategoryId,
  titleSv: z.string().min(1),
  titleJa: z.string().min(1).nullable(),
  status: CatalogModuleStatus,
  targetWordCount: z.number().int().min(15).max(20),
});
export type CatalogModule = z.infer<typeof CatalogModule>;

export const CatalogFile = z.object({
  schemaVersion: z.literal(CATALOG_SCHEMA_VERSION),
  sourceTaxonomyVersion: z.string(),
  note: z.string().optional(),
  categories: z.array(CatalogCategory),
  modules: z.array(CatalogModule),
});
export type CatalogFile = z.infer<typeof CatalogFile>;

/**
 * App-owned mapping between the catalog and already published lessons.
 * - links: VERIFIED 1:1 equivalence catalogId ⇔ published moduleId (only after review).
 * - compatibilityPlacements: a published module (m.*) that does not equal one
 *   catalog entry is shown at a catalog category without claiming a catalogId.
 */
export const PublishedMapping = z.object({
  links: z.array(z.object({ catalogId: z.string(), moduleId: z.string(), verifiedBy: z.string(), note: z.string().optional() })),
  compatibilityPlacements: z.array(z.object({
    moduleId: z.string(),
    catalogCategoryId: CatalogCategoryId,
    /** Planned entries whose subject overlaps (NOT equivalence) – for production planning. */
    overlapsCatalogIds: z.array(z.string()).default([]),
    reason: z.string(),
  })),
});
export type PublishedMapping = z.infer<typeof PublishedMapping>;
