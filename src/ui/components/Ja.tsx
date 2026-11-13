import { Fragment, type CSSProperties } from 'react';
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

/** Swedish or Japanese text depending on lang. `jaClassName` replaces `className` when the text is Japanese
 * (0.15: Japanese about the word being learned uses `ja-word` / `ja-gloss` – large, dark, readable furigana). */
export function LangText({ text, lang, className, jaClassName, style }: { text: string; lang: 'sv' | 'ja'; className?: string; jaClassName?: string; style?: CSSProperties }) {
  return lang === 'ja' ? <Ja text={text} className={jaClassName ?? className} /> : <span lang="sv" className={className} style={style}>{text}</span>;
}
