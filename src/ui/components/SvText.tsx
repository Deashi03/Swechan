/**
 * Swedish text where every word that exists in the dictionary can be tapped
 * to look it up (e.g. words from earlier modules used in a definition).
 * Words not in the dictionary are plain text.
 */
import { useMemo } from 'react';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { segmentText } from '../../dictionary/segmentText';
import { useDictionarySheet } from '../dictionary/DictionarySheet';

type Props = {
  text: string;
  className?: string;
  /** Entry ids that should NOT be links (typically the word being taught). */
  exclude?: string[];
  /** Custom handler (inside the dictionary sheet: push instead of replace). */
  onOpen?: (entryId: string) => void;
};

export function SvText({ text, className, exclude = [], onOpen }: Props) {
  const dict = useDictionarySheet();
  const spans = useMemo(() => segmentText(text, getDictionaryIndex()), [text]);
  return (
    <span lang="sv" className={className}>
      {spans.map((s, i) => {
        const id = s.entryIds[0];
        if (!s.isWord || !id || exclude.includes(id)) return <span key={i}>{s.text}</span>;
        return (
          <button key={i} type="button" className="word-link lookup" onClick={() => (onOpen ? onOpen(id) : dict.open({ entryId: id }))} aria-label={`${s.text} – slå upp`}>
            {s.text}
          </button>
        );
      })}
    </span>
  );
}
