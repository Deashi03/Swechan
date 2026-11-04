/**
 * Lazy loader for the catalog index. The ~350 kB planning catalog is NOT part
 * of the startup bundle: it is fetched as its own chunk the first time a
 * screen needs it, then cached.
 */
import { getContent } from '../repository';
import mapping from '../data/catalog/publishedMapping.json';
import { CatalogIndex } from './catalogIndex';

let cached: Promise<CatalogIndex> | null = null;
let ready: CatalogIndex | null = null;

export function loadCatalog(): Promise<CatalogIndex> {
  if (!cached) {
    cached = import('../../../planning/catalog/swechan-catalog.v1.json')
      .then((m) => {
        ready = new CatalogIndex(m.default, mapping, getContent().modules.map((x) => x.id));
        return ready;
      })
      .catch((e) => { cached = null; throw e; }); // allow a retry after a failed load
  }
  return cached;
}

/** The index if it has already been loaded, otherwise undefined. */
export function getLoadedCatalog(): CatalogIndex | undefined {
  return ready ?? undefined;
}
