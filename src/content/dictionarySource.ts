/**
 * Dictionary source (kvalitetsplanen A4b): every dictionary file, loaded at once. Used by tests,
 * tools and the dev server. The production build aliases this module to dictionarySource.lazy.ts
 * (vite.config.ts), which loads the lexicon at start and the full entries per file when needed.
 */
import type { LexRow } from './repository';

export function dictionarySource(): { dictionaries: unknown[]; lexicon?: LexRow[]; loadDictionary?: (file: string) => Promise<unknown> } {
  return { dictionaries: Object.values(import.meta.glob('./data/dictionary/*.json', { eager: true, import: 'default' })) };
}
