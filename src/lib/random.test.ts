import { createRng, lazyShuffle } from './random';

describe('lazyShuffle', () => {
  it('yields every item exactly once, in a seeded order', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const a = [...lazyShuffle(items, createRng(7))];
    expect([...a].sort((x, y) => x - y)).toEqual(items);
    expect(a).not.toEqual(items);
    expect([...lazyShuffle(items, createRng(7))]).toEqual(a);
  });
  it('can stop early without consuming the rest', () => {
    let calls = 0;
    const rng = createRng(3);
    const counted = () => { calls++; return rng(); };
    const first: number[] = [];
    for (const x of lazyShuffle([1, 2, 3, 4, 5, 6, 7, 8], counted)) { first.push(x); if (first.length === 2) break; }
    expect(first).toHaveLength(2);
    expect(calls).toBe(2);
  });
});
