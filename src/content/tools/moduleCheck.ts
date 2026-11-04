/**
 * Validation of ONE module (published or about to be published) – used by
 * `npm run module:validate`. Combines the schema, the shared content checks,
 * the controlled-vocabulary check and the catalog placement.
 */
import type { CatalogIndex } from '../catalog/catalogIndex';
import { validateCatalog } from '../catalog/validateCatalog';
import type { ContentRepository } from '../repository';
import { validateContent } from '../validateContent';
import { checkVocabulary, type CoreVocabulary } from '../vocabularyCheck';

export type ModuleCheck = { moduleId: string; errors: string[] };

export function checkModule(moduleId: string, repo: ContentRepository, core: CoreVocabulary, catalog: CatalogIndex): ModuleCheck {
  const errors: string[] = [];
  const meta = repo.getModule(moduleId);
  if (!meta) return { moduleId, errors: [`Modulen ${moduleId} finns inte bland publicerade moduler`] };
  const senseIds = new Set(meta.words.map((w) => w.senseId));
  const mine = (where: string) => where.startsWith(moduleId) || [...senseIds].some((s) => where.startsWith(s));
  for (const i of validateContent(repo)) if (mine(i.where)) errors.push(`${i.where}: ${i.message}`);
  for (const i of checkVocabulary(repo, core)) if (i.where.startsWith(moduleId)) errors.push(`${i.where}: okända ord [${i.unknown.join(', ')}]`);
  for (const i of validateCatalog(catalog, repo.modules.map((m) => m.id))) if (i.where === moduleId) errors.push(`katalog: ${i.message}`);
  const n = meta.words.length;
  if (n < 15 || n > 20) errors.push(`${n} målord (ska vara 15–20)`);
  return { moduleId, errors };
}
