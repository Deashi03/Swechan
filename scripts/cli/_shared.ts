/** Shared loading for the content CLI tools (run with vite-node via npm scripts). */
import catalogFile from '../../planning/catalog/swechan-catalog.v1.json';
import coreJson from '../../src/content/data/core/coreVocabulary.json';
import mapping from '../../src/content/data/catalog/publishedMapping.json';
import { CatalogIndex } from '../../src/content/catalog/catalogIndex';
import { toolingRepository } from '../../src/content/tooling';
import { CoreVocabularyFile } from '../../src/content/vocabularyCheck';

export function loadAll() {
  const repo = toolingRepository();
  const catalog = new CatalogIndex(catalogFile, mapping, repo.modules.map((m) => m.id));
  const core = CoreVocabularyFile.parse(coreJson);
  return { repo, catalog, core };
}

export function args(): string[] {
  // vite-node removes the script path: argv = [node, vite-node, ...args]
  return process.argv.slice(2).filter((a) => a !== '--');
}
