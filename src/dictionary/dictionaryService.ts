import { getContent } from '../content/repository';
import { DictionaryIndex } from './searchIndex';

let index: DictionaryIndex | null = null;
/** Lazily built shared index (built on first search, not at startup). */
export function getDictionaryIndex(): DictionaryIndex {
  if (!index) index = new DictionaryIndex(getContent());
  return index;
}
