/**
 * Typed-answer checking.
 * Accepted as equal: surrounding/duplicate whitespace, letter case, Unicode
 * normalisation form. NOT accepted: missing/wrong å, ä, ö (reported as a
 * specific near miss so the feedback can point it out).
 */
export type NearMiss = 'diacritics' | 'typo' | 'other-form' | null;
export type CheckResult = { correct: boolean; nearMiss: NearMiss; normalized: string };

export function normalizeAnswer(s: string): string {
  return s.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
}

function foldDiacritics(s: string): string {
  return s.replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e');
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length]!;
}

/**
 * @param accepted correct answers
 * @param otherForms forms of the right word that are not what was asked (e.g. inflected form when the base form was asked)
 */
export function checkTypedAnswer(input: string, accepted: string[], otherForms: string[] = []): CheckResult {
  const n = normalizeAnswer(input);
  const acc = accepted.map(normalizeAnswer);
  if (acc.includes(n)) return { correct: true, nearMiss: null, normalized: n };
  if (acc.some((a) => foldDiacritics(a) === foldDiacritics(n))) return { correct: false, nearMiss: 'diacritics', normalized: n };
  if (otherForms.map(normalizeAnswer).includes(n)) return { correct: false, nearMiss: 'other-form', normalized: n };
  if (n.length >= 4 && acc.some((a) => levenshtein(a, n) === 1)) return { correct: false, nearMiss: 'typo', normalized: n };
  return { correct: false, nearMiss: null, normalized: n };
}
