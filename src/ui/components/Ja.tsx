import { Fragment } from 'react';
import { parseFurigana } from '../../content/furigana';

/** Renders Japanese text with furigana as HTML ruby. Visibility is controlled globally (html.no-furigana). */
export function Ja({ text, className, as: Tag = 'span' }: { text: string; className?: string; as?: 'span' | 'p' | 'div' }) {
  return (
    <Tag className={`ja ${className ?? ''}`} lang="ja">
      {parseFurigana(text).map((seg, i) =>
        seg.reading ? (
          <ruby key={i}>
            {seg.text}
            <rp>(</rp>
            <rt>{seg.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </Tag>
  );
}

/** Swedish or Japanese text depending on lang. */
export function LangText({ text, lang, className }: { text: string; lang: 'sv' | 'ja'; className?: string }) {
  return lang === 'ja' ? <Ja text={text} className={className} /> : <span lang="sv" className={className}>{text}</span>;
}
