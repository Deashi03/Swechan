import { createSaveQueue } from './saveQueue';

describe('createSaveQueue', () => {
  it('kör sparningar i köordning även när en tidig är långsam', async () => {
    const q = createSaveQueue();
    const order: number[] = [];
    q.push(() => new Promise((r) => setTimeout(() => { order.push(1); r(null); }, 20)));
    q.push(async () => { order.push(2); });
    q.push(async () => { order.push(3); });
    await q.flush();
    expect(order).toEqual([1, 2, 3]);
  });

  it('ett fel stoppar inte senare sparningar och rapporteras', async () => {
    const seen: unknown[] = [];
    const q = createSaveQueue((e) => seen.push(e));
    const order: string[] = [];
    q.push(async () => { throw new Error('disk'); });
    q.push(async () => { order.push('efter'); });
    await q.flush();
    expect(order).toEqual(['efter']);
    expect(seen).toHaveLength(1);
    expect(q.takeErrors()).toHaveLength(1);
    expect(q.takeErrors()).toHaveLength(0);
  });

  it('flush väntar på allt som köats', async () => {
    const q = createSaveQueue();
    let done = false;
    q.push(() => new Promise((r) => setTimeout(() => { done = true; r(null); }, 10)));
    await q.flush();
    expect(done).toBe(true);
  });
});
