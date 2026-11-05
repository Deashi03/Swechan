import { getContent } from '../content/repository';
import { completeReviewItem, ensureDailySession } from '../daily/dailySession';
import { subscribe, type LearningEvent } from '../feedback/events';
import { advanceLearnSession, isLearnSessionDone } from '../learning/learnPlan';
import { getDb, getMeta } from '../storage/db';
import type { StreakState } from '../storage/types';
import { setupTestEnv } from '../test/helpers';
import { completeStep, getModuleProgress, isStepUnlocked, recommendedModule, saveLearnState, startOrResumeLearn } from './moduleService';
import { finishPersonalLearn, pendingPersonalWords, queueForLearning, startOrResumePersonalLearn, toggleSaved } from './savedWords';

const MOD = 'm.hemmet-vardag';

async function finishLearn(moduleId: string) {
  let s = await startOrResumeLearn(moduleId);
  while (!isLearnSessionDone(s)) s = advanceLearnSession(s, s.plan[s.index]!.kind === 'intro' ? 'seen' : 'first');
  await saveLearnState(moduleId, s);
}

describe('module flow and daily session', () => {
  it('starts, pauses and resumes step 1 without losing progress', async () => {
    await setupTestEnv();
    let s = await startOrResumeLearn(MOD);
    expect(s.plan[0]!.kind).toBe('intro');
    for (let i = 0; i < 7; i++) s = advanceLearnSession(s, 'first');
    await saveLearnState(MOD, s);
    const resumed = await startOrResumeLearn(MOD);
    expect(resumed.index).toBe(7);
    expect(resumed.plan).toEqual(s.plan);
  });

  it('every target word is introduced and practised in step 1', async () => {
    await setupTestEnv();
    const s = await startOrResumeLearn(MOD);
    const m = getContent().getModule(MOD)!;
    for (const w of m.words) {
      expect(s.plan.some((p) => p.kind === 'intro' && p.senseId === w.senseId)).toBe(true);
      expect(s.plan.some((p) => p.kind === 'exercise' && p.senseId === w.senseId)).toBe(true);
      if (w.active) expect(s.plan.some((p) => p.kind === 'exercise' && p.senseId === w.senseId && p.exerciseType === 'spelling')).toBe(true);
    }
  });

  it('failed items are re-queued once without changing the recorded first outcome', async () => {
    await setupTestEnv();
    let s = await startOrResumeLearn(MOD);
    while (s.plan[s.index]!.kind === 'intro') s = advanceLearnSession(s, 'seen');
    const item = s.plan[s.index]!;
    const len = s.plan.length;
    s = advanceLearnSession(s, 'failed');
    expect(s.plan.length).toBe(len + 1);
    expect(s.results[`${item.senseId}|${item.kind === 'exercise' ? item.dimension : ''}`]).toBe('failed');
  });

  it('steps unlock in order and the module completes after all three', async () => {
    await setupTestEnv();
    expect(isStepUnlocked(undefined, 'read')).toBe(false);
    await finishLearn(MOD);
    let p = await completeStep(MOD, 'learn');
    expect(isStepUnlocked(p, 'read')).toBe(true);
    expect(isStepUnlocked(p, 'converse')).toBe(false);
    p = await completeStep(MOD, 'read');
    expect(p.status).toBe('in_progress');
    expect(await getDb().cards.count()).toBe(0); // words enter review only on completion
    p = await completeStep(MOD, 'converse');
    expect(p.status).toBe('completed');
    const m = getContent().getModule(MOD)!;
    const cards = await getDb().cards.toArray();
    expect(new Set(cards.map((c) => c.senseId)).size).toBe(m.words.length);
    // active words get production cards too
    const active = m.words.find((w) => w.active)!;
    expect(cards.filter((c) => c.senseId === active.senseId).map((c) => c.dimension)).toContain('spelling');
  });

  it('passive words only get a meaning card', async () => {
    await setupTestEnv();
    const mod = getContent().modules.find((x) => x.words.some((w) => !w.active))!;
    await finishLearn(mod.id);
    for (const st of ['learn', 'read', 'converse'] as const) await completeStep(mod.id, st);
    const passive = mod.words.find((w) => !w.active)!;
    const cards = await getDb().cards.where('senseId').equals(passive.senseId).toArray();
    expect(cards.map((c) => c.dimension)).toEqual(['meaning']);
  });

  it('a completed module + review completes the day and increments the streak (acceptance flow, 2 days)', async () => {
    const env = await setupTestEnv();
    const events: LearningEvent[] = [];
    const unsub = subscribe((e) => events.push(e));

    // Day 1: no earlier words → review auto-complete; finishing a module completes the day.
    const d1 = await ensureDailySession();
    expect(d1.noReviewMaterial).toBe(true);
    await finishLearn(MOD);
    await completeStep(MOD, 'learn');
    await completeStep(MOD, 'read');
    await completeStep(MOD, 'converse');
    const d1After = await getDb().dailySessions.get(d1.date);
    expect(d1After!.completedAt).toBeDefined();
    expect(d1After!.modulesCompleted).toEqual([MOD]);
    expect((await getMeta<StreakState>('streak'))!.current).toBe(1);
    expect(events.map((e) => e.type)).toEqual(expect.arrayContaining(['module_completed', 'daily_session_completed', 'streak_increased']));

    // Day 2: words from day 1 are reviewable; next module is recommended.
    env.advanceDays(1);
    const d2 = await ensureDailySession();
    expect(d2.reviewPlan.length).toBe(25);
    expect((await recommendedModule())!.id).not.toBe(MOD);
    for (const id of d2.reviewPlan) {
      const [senseId, dim] = id.split('|') as [string, 'meaning'];
      await completeReviewItem(d2.date, id, { senseId, dimension: dim, exerciseType: 'meaning_choice', outcome: 'first', attempts: 1 });
    }
    const d2mid = await getDb().dailySessions.get(d2.date);
    expect(d2mid!.reviewCompletedAt).toBeDefined();
    expect(d2mid!.completedAt).toBeUndefined(); // only one of two parts done
    const next = (await recommendedModule())!.id;
    await finishLearn(next);
    for (const st of ['learn', 'read', 'converse'] as const) await completeStep(next, st);
    expect((await getDb().dailySessions.get(d2.date))!.completedAt).toBeDefined();
    expect((await getMeta<StreakState>('streak'))!.current).toBe(2);
    unsub();
  });

  it('completing a second module the same day does not double-count the streak', async () => {
    await setupTestEnv();
    for (const id of ['m.hemmet-vardag', 'm.atomer-molekyler']) {
      await finishLearn(id);
      for (const st of ['learn', 'read', 'converse'] as const) await completeStep(id, st);
    }
    expect((await getMeta<StreakState>('streak'))!.current).toBe(1);
  });

  it('progress survives reopening the database (app closed)', async () => {
    await setupTestEnv();
    await finishLearn(MOD);
    await completeStep(MOD, 'learn');
    const db = getDb();
    db.close();
    await db.open();
    expect((await getModuleProgress(MOD))!.steps.learn).toBe('completed');
  });
});

describe('learning path (modules build on each other)', () => {
  async function complete(id: string) {
    await finishLearn(id);
    for (const st of ['learn', 'read', 'converse'] as const) await completeStep(id, st);
  }
  it('recommends a module only after its prerequisites, even for an advanced learner', async () => {
    await setupTestEnv();
    const { setMeta } = await import('../storage/db');
    await setMeta('placement', { takenAt: 0, skipped: false, estimatedLevel: 'B2', perLevel: {} });
    // B2 learner: the B2 castle module must not be suggested before "Krig och försvar"
    let rec = (await recommendedModule())!;
    expect(rec.id).not.toBe('m.medeltida-borgar');
    expect(rec.id).not.toBe('m.atomer-molekyler');
    await complete('m.krig-forsvar');
    rec = (await recommendedModule())!;
    expect(rec.id).toBe('m.medeltida-borgar');
  });
  it('follows the recommended order for a beginner', async () => {
    await setupTestEnv();
    const order: string[] = [];
    const total = getContent().modules.length;
    for (let i = 0; i < total; i++) {
      const m = (await recommendedModule())!;
      // a module is only recommended once all its prerequisites are done
      for (const p of m.prerequisites) expect(order, `${m.id} före ${p}`).toContain(p);
      order.push(m.id); await complete(m.id);
    }
    expect(order.slice(0, 5)).toEqual(['m.hemmet-vardag', 'm.material-amnen', 'm.atomer-molekyler', 'm.krig-forsvar', 'm.medeltida-borgar']);
    expect(new Set(order).size).toBe(total);
    expect(await recommendedModule()).toBeUndefined();
  });
});

describe('saved words', () => {
  it('saves, queues and learns a word outside a module', async () => {
    await setupTestEnv();
    expect(await toggleSaved('s.arg.1')).toBe(true);
    await queueForLearning('s.arg.1');
    expect(await pendingPersonalWords()).toEqual(['s.arg.1']);
    let pl = (await startOrResumePersonalLearn())!;
    expect(pl.senseIds).toEqual(['s.arg.1']);
    while (!isLearnSessionDone(pl.learn)) pl = { ...pl, learn: advanceLearnSession(pl.learn, 'first') };
    const { savePersonalLearn } = await import('./savedWords');
    await savePersonalLearn(pl);
    await finishPersonalLearn();
    expect(await getDb().cards.where('senseId').equals('s.arg.1').count()).toBeGreaterThan(0);
    expect(await pendingPersonalWords()).toEqual([]);
    expect(await toggleSaved('s.arg.1')).toBe(false);
  });
});
