import { getContent } from '../content/repository';
import { completeExtraReview, completeReviewItem, ensureDailySession, planExtraReviews, reviewLoad } from '../daily/dailySession';
import type { ExerciseResult } from '../learning/exercises/types';
import { getDb } from '../storage/db';
import type { ReviewCardRecord } from '../storage/types';
import { setupTestEnv } from '../test/helpers';
import { addWordsToReview, cardId } from './reviewService';
import { selectReviewCards, spreadBySense } from './selection';

const res = (senseId: string, dimension: ExerciseResult['dimension'], outcome: ExerciseResult['outcome']): ExerciseResult =>
  ({ senseId, dimension, exerciseType: dimension === 'meaning' ? 'meaning_choice' : dimension, outcome, attempts: outcome === 'first' ? 1 : 2 });

const senses = () => getContent().modules[0]!.words.map((w) => w.senseId);

describe('repetition engine', () => {
  it('creates separate cards per knowledge dimension, with schedules from initial ratings', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning', 'spelling', 'inflection'], ratings: { meaning: 'good', spelling: 'again' } }], 'module', env.now(), '2026-03-02');
    const cards = await getDb().cards.toArray();
    expect(cards.map((c) => c.dimension).sort()).toEqual(['inflection', 'meaning', 'spelling']);
    const m = cards.find((c) => c.dimension === 'meaning')!;
    const s = cards.find((c) => c.dimension === 'spelling')!;
    expect(m.due).toBeGreaterThan(s.due); // good schedules later than again
    expect(m.sched.stability).toBeGreaterThan(s.sched.stability);
  });

  it('never resets history when the same word is added again (e.g. from another module)', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: { meaning: 'good' } }], 'module', env.now(), '2026-03-02');
    const before = await getDb().cards.get(cardId('s.kök.1', 'meaning'));
    env.advanceDays(5);
    const created = await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: { meaning: 'again' } }], 'module', env.now(), '2026-03-07');
    expect(created).toBe(0);
    expect(await getDb().cards.get(cardId('s.kök.1', 'meaning'))).toEqual(before);
  });

  it('with no earlier words, today\'s review is complete immediately', async () => {
    await setupTestEnv();
    const day = await ensureDailySession();
    expect(day.noReviewMaterial).toBe(true);
    expect(day.reviewCompletedAt).toBeDefined();
  });

  it('words learned today are not reviewed today, but are available tomorrow', async () => {
    const env = await setupTestEnv();
    await addWordsToReview(senses().slice(0, 10).map((s) => ({ senseId: s, dimensions: ['meaning'], ratings: { meaning: 'good' } })), 'module', env.now(), '2026-03-02');
    expect((await ensureDailySession()).reviewPlan).toEqual([]);
    env.advanceDays(1);
    const d2 = await ensureDailySession();
    // only 10 earlier words (none due yet) → session uses the 10 available, without exceeding them
    expect(d2.reviewPlan.length).toBe(10);
    expect(d2.reviewTarget).toBe(10);
  });

  it('caps the session at the daily limit when more cards are due, and reports review debt', async () => {
    const env = await setupTestEnv();
    const all = getContent().entries.flatMap((e) => e.senses.map((s) => s.id)).slice(0, 40);
    await addWordsToReview(all.map((s) => ({ senseId: s, dimensions: ['meaning'], ratings: { meaning: 'again' } })), 'module', env.now(), '2026-03-02');
    env.advanceDays(3); // all due
    const day = await ensureDailySession();
    expect(day.reviewPlan.length).toBe(25);
    expect(new Set(day.reviewPlan.map((id) => id.split('|')[0])).size).toBe(25); // distinct words
    const load = await reviewLoad();
    expect(load.dueToday).toBe(40);
    expect(load.debt).toBe(15);
    const extra = await planExtraReviews(10);
    expect(extra.length).toBe(10);
    expect(extra.some((id) => day.reviewPlan.includes(id))).toBe(false);
  });

  it('a correct answer pushes the card later, a wrong one brings it back soon; history is kept', async () => {
    const env = await setupTestEnv();
    const ids = senses().slice(0, 2);
    await addWordsToReview(ids.map((s) => ({ senseId: s, dimensions: ['meaning'], ratings: { meaning: 'good' } })), 'module', env.now(), '2026-03-02');
    env.advanceDays(3);
    const day = await ensureDailySession();
    const [a, b] = day.reviewPlan as [string, string];
    await completeReviewItem(day.date, a, res(a.split('|')[0]!, 'meaning', 'first'));
    await completeReviewItem(day.date, b, res(b.split('|')[0]!, 'meaning', 'failed'));
    const ca = (await getDb().cards.get(a))!;
    const cb = (await getDb().cards.get(b))!;
    expect(ca.due - env.now().getTime()).toBeGreaterThan(5 * 86_400_000);
    expect(cb.due - env.now().getTime()).toBeLessThanOrEqual(2 * 86_400_000);
    expect(cb.sched.lapses).toBe(1);
    const events = await getDb().reviewEvents.toArray();
    expect(events.map((e) => e.correct)).toEqual([true, false]);
    expect(events[1]).toMatchObject({ dimension: 'meaning', phase: 'review', rating: 'again', attempts: 2 });
    const after = await getDb().dailySessions.get(day.date);
    expect(after!.reviewIndex).toBe(2);
    expect(after!.reviewCompletedAt).toBeDefined();
  });

  it('a correct meaning answer does not change the spelling card', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning', 'spelling'], ratings: { meaning: 'good', spelling: 'good' } }], 'module', env.now(), '2026-03-02');
    const spellingBefore = await getDb().cards.get('s.kök.1|spelling');
    env.advanceDays(3);
    await ensureDailySession();
    await completeExtraReview('s.kök.1|meaning', res('s.kök.1', 'meaning', 'first'));
    expect(await getDb().cards.get('s.kök.1|spelling')).toEqual(spellingBefore);
  });

  it('ignores duplicate submits of the same review item', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: { meaning: 'good' } }], 'module', env.now(), '2026-03-02');
    env.advanceDays(1);
    const day = await ensureDailySession();
    await completeReviewItem(day.date, day.reviewPlan[0]!, res('s.kök.1', 'meaning', 'first'));
    await completeReviewItem(day.date, day.reviewPlan[0]!, res('s.kök.1', 'meaning', 'first'));
    expect(await getDb().reviewEvents.count()).toBe(1);
  });
});

describe('selection (pure)', () => {
  const mk = (senseId: string, dim: string, dueDays: number, created = '2026-03-01'): ReviewCardRecord => ({
    id: `${senseId}|${dim}`, senseId, dimension: dim as never, createdDate: created, createdAt: 0,
    due: new Date('2026-03-10T12:00:00Z').getTime() + dueDays * 86_400_000,
    sched: { algorithm: 'fsrs', stability: 3, difficulty: 5, state: 2, scheduledDays: 3, learningSteps: 0, reps: 1, lapses: 0 }, source: 'module',
  });
  const base = { now: new Date('2026-03-10T12:00:00Z'), today: '2026-03-10', timeZone: 'UTC', retrievability: () => 0.5 };

  it('prefers due cards and different words', () => {
    const cards = [mk('a', 'meaning', -1), mk('a', 'spelling', -1), mk('b', 'meaning', -2), mk('c', 'meaning', 5)];
    const r = selectReviewCards({ ...base, cards, limit: 2 });
    expect(new Set(r.cardIds.map((x) => x.split('|')[0]))).toEqual(new Set(['a', 'b']));
    expect(r.dueCount).toBe(3);
    expect(r.debt).toBe(1);
  });
  it('supplements with not-yet-due cards when few are due', () => {
    const cards = [mk('a', 'meaning', -1), mk('b', 'meaning', 4), mk('c', 'meaning', 9)];
    expect(selectReviewCards({ ...base, cards, limit: 3 }).cardIds.length).toBe(3);
  });
  it('boosts difficult cards', () => {
    const cards = [mk('a', 'meaning', -1), mk('b', 'meaning', -1)];
    const r = selectReviewCards({ ...base, cards, limit: 1, difficultCardIds: new Set(['b|meaning']) });
    expect(r.cardIds).toEqual(['b|meaning']);
  });
  it('excludes cards created today', () => {
    expect(selectReviewCards({ ...base, cards: [mk('a', 'meaning', -1, '2026-03-10')], limit: 5 }).cardIds).toEqual([]);
  });
  it('spreads items so the same word is not repeated back-to-back', () => {
    const out = spreadBySense([{ senseId: 'a' }, { senseId: 'a' }, { senseId: 'b' }, { senseId: 'b' }]);
    for (let i = 1; i < out.length; i++) expect(out[i]!.senseId).not.toBe(out[i - 1]!.senseId);
  });
});
