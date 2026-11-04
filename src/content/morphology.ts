/**
 * Morphology helpers built on the explicitly stored inflection tables.
 *
 * v0.1 deliberately avoids automatic morphological analysis: every inflected
 * form comes from content data. Recognition = matching tokens against the
 * set of stored forms (including multi-word forms such as particle verbs).
 * The `FormAnalyzer` seam lets a future SALDO-based analyser replace this.
 */
import type { Inflection, VocabularyEntry } from './schema';

export type FormInfo = { key: string; labelSv: string; labelJa: string; form: string };

/** Display-ordered list of the forms in an inflection table. */
export function inflectionForms(infl: Inflection): FormInfo[] {
  switch (infl.kind) {
    case 'noun': {
      const out: FormInfo[] = [
        { key: 'indefSg', labelSv: 'obestämd singular', labelJa: '{単数|たんすう}・{未知形|みちけい}', form: `${infl.gender} ${infl.indefSg}` },
        { key: 'defSg', labelSv: 'bestämd singular', labelJa: '{単数|たんすう}・{限定形|げんていけい}', form: infl.defSg },
      ];
      if (infl.indefPl !== null) out.push({ key: 'indefPl', labelSv: 'obestämd plural', labelJa: '{複数|ふくすう}・{未知形|みちけい}', form: infl.indefPl });
      if (infl.defPl !== null) out.push({ key: 'defPl', labelSv: 'bestämd plural', labelJa: '{複数|ふくすう}・{限定形|げんていけい}', form: infl.defPl });
      return out;
    }
    case 'verb': {
      const out: FormInfo[] = [
        { key: 'infinitive', labelSv: 'infinitiv', labelJa: '{不定形|ふていけい}', form: infl.infinitive },
        { key: 'present', labelSv: 'presens', labelJa: '{現在形|げんざいけい}', form: infl.present },
        { key: 'past', labelSv: 'preteritum', labelJa: '{過去形|かこけい}', form: infl.past },
        { key: 'supine', labelSv: 'supinum', labelJa: 'スピーヌム（har ＋）', form: infl.supine },
        { key: 'imperative', labelSv: 'imperativ', labelJa: '{命令形|めいれいけい}', form: infl.imperative },
      ];
      if (infl.pastParticiple) out.push({ key: 'pastParticiple', labelSv: 'perfekt particip', labelJa: '{過去分詞|かこぶんし}', form: infl.pastParticiple });
      return out;
    }
    case 'adjective': {
      if (infl.indeclinable) return [{ key: 'common', labelSv: 'oböjligt', labelJa: '{変化|へんか}しない', form: infl.common }];
      const out: FormInfo[] = [
        { key: 'common', labelSv: 'en-form', labelJa: 'en {名詞|めいし}', form: infl.common },
        { key: 'neuter', labelSv: 'ett-form', labelJa: 'ett {名詞|めいし}', form: infl.neuter },
        { key: 'plural', labelSv: 'plural', labelJa: '{複数|ふくすう}', form: infl.plural },
        { key: 'definite', labelSv: 'bestämd form', labelJa: '{限定形|げんていけい}', form: infl.definite },
      ];
      if (infl.comparative) out.push({ key: 'comparative', labelSv: 'komparativ', labelJa: '{比較級|ひかくきゅう}', form: infl.comparative });
      if (infl.superlative) out.push({ key: 'superlative', labelSv: 'superlativ', labelJa: '{最上級|さいじょうきゅう}', form: infl.superlative });
      return out;
    }
    case 'none':
      return [];
  }
}

/** Accepted forms for a single slot (main form + variants). */
export function acceptedForms(infl: Inflection, key: string): string[] {
  if (infl.kind === 'none') return [];
  const main = (infl as Record<string, unknown>)[key];
  const variants = ('variants' in infl && infl.variants?.[key]) || [];
  return [...(typeof main === 'string' ? [main] : []), ...variants];
}

/** Every surface form of an entry (lower-case, unique), including variants. */
export function allForms(entry: VocabularyEntry): string[] {
  const infl = entry.inflection;
  const set = new Set<string>([entry.lemma.toLowerCase()]);
  if (infl.kind !== 'none') {
    for (const [k, v] of Object.entries(infl)) {
      if (k === 'kind' || k === 'gender' || k === 'group' || k === 'particle') continue;
      if (typeof v === 'string') set.add(v.toLowerCase());
    }
    if (infl.variants) for (const list of Object.values(infl.variants)) list.forEach((f) => set.add(f.toLowerCase()));
  }
  return [...set];
}

export type Token = { text: string; start: number; end: number; isWord: boolean };

const WORD_RE = /[A-Za-zÅÄÖåäöÉéÜü]+(?:-[A-Za-zÅÄÖåäöÉéÜü]+)*/g;

export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(WORD_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: text.slice(last, idx), start: last, end: idx, isWord: false });
    out.push({ text: m[0], start: idx, end: idx + m[0].length, isWord: true });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), start: last, end: text.length, isWord: false });
  return out;
}

/** True if any form (possibly multi-word) of the entry occurs in the text. */
export function entryOccursIn(text: string, entry: VocabularyEntry): boolean {
  const words = tokenize(text).filter((t) => t.isWord).map((t) => t.text.toLowerCase());
  const joined = ` ${words.join(' ')} `;
  return allForms(entry).some((f) => joined.includes(` ${f} `));
}
