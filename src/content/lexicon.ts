/**
 * The lexicon (kvalitetsplanen A4b): the light part of every headword, used by the production build
 * so that the start bundle does not contain definitions, examples and explanations. Built at build time
 * by the swechan-lexicon plugin (vite.config.ts) and in tests with the same function.
 *
 * Kept: lemma, word class, level, inflection; per sense the gloss (+ alternatives), label, order, level,
 * inflection, tags and synonym links (id + relation, without the notes). That is what search, word
 * lists, statistics, learning plans and exercise distractors need.
 */
export const LEX_ENTRY_KEYS = ['id', 'lemma', 'pos', 'level', 'inflection'] as const;
export const LEX_SENSE_KEYS = ['id', 'ja', 'jaAlt', 'labelSv', 'order', 'level', 'inflection', 'tags'] as const;

type Raw = Record<string, unknown>;
export type CompactLexicon = { files: string[]; rows: (Raw & { f: number })[] };

const pick = (o: Raw, keys: readonly string[]) => Object.fromEntries(keys.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]));

export function buildLexicon(dictionaries: { file: string; entries: Raw[] }[]): CompactLexicon {
  const files: string[] = [];
  const rows: (Raw & { f: number })[] = [];
  for (const d of dictionaries) {
    const f = files.push(d.file) - 1;
    for (const e of d.entries) {
      const senses = (e.senses as Raw[]).map((s) => {
        const out = pick(s, LEX_SENSE_KEYS);
        const syn = s.synonyms as { senseId: string; relation: string }[] | undefined;
        if (syn?.length) out.synonyms = syn.map((x) => ({ senseId: x.senseId, relation: x.relation }));
        return out;
      });
      rows.push({ ...pick(e, LEX_ENTRY_KEYS), senses, f });
    }
  }
  return { files, rows };
}

/** Rows with their dictionary file name, as ContentRepository expects them. */
export function expandLexicon<T>(lex: CompactLexicon): (T & { file: string })[] {
  return lex.rows.map(({ f, ...row }) => ({ ...(row as T), file: lex.files[f]! }));
}
