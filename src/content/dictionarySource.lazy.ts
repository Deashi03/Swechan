/**
 * Dictionary source for the production build (kvalitetsplanen A4b). The lexicon (light part of every
 * headword, generated at build time by the `swechan-lexicon` plugin in vite.config.ts) is part of the
 * start bundle; each dictionary file is its own lazily loaded module, grouped per subject group into
 * chunks (dict-R01-A01 …). ContentRepository.ensureSenses loads what a screen needs.
 */
import lexicon from 'virtual:swechan-lexicon';
import { expandLexicon, type CompactLexicon } from './lexicon';
import type { LexRow } from './repository';

export function dictionarySource(): { dictionaries: unknown[]; lexicon?: LexRow[]; loadDictionary?: (file: string) => Promise<unknown> } {
  const files = import.meta.glob('./data/dictionary/*.json', { import: 'default' });
  return {
    dictionaries: [],
    lexicon: expandLexicon<LexRow>(lexicon as unknown as CompactLexicon),
    loadDictionary: (file: string) => {
      const load = files[`./data/dictionary/${file}`];
      return load ? load() : Promise.reject(new Error(`Saknar ordboksfil ${file}`));
    },
  };
}
