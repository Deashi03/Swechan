import { describe, expect, it } from 'vitest';
import { fitWord, longestToken } from './fitWord';

describe('fitWord – long headwords shrink to fit the card', () => {
  it('measures the longest unbreakable token, not the whole phrase', () => {
    expect(longestToken('yttrandefrihetsgrundlagen')).toBe(25);
    expect(longestToken('olaga integritetsintrång')).toBe(17);
    expect(longestToken('katt')).toBe(4);
    expect(longestToken('')).toBe(1);
  });
  it('passes the length to CSS as --fit-len', () => {
    expect(fitWord('hets mot folkgrupp').style).toEqual({ '--fit-len': 9 });
  });
});
