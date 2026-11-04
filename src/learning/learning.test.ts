import { getContent } from '../content/repository';
import { stripFurigana } from '../content/furigana';
import { checkTypedAnswer } from './answerCheck';
import { generateExercise, genContextChoice, genInflection, genSpelling, inflectionFramesFor, type GenContext } from './exercises/generate';
import { isChoice, type ExerciseType } from './exercises/types';
import { knowledgeLevel, difficultItems, confusedPairs } from './knowledge';
import { scorePlacement, isWellBelowLevel } from './placement';
import type { ReviewCardRecord, ReviewEventRecord } from '../storage/types';

const repo = getContent();
const ctx = (senseIds: string[] = repo.modules[0]!.words.map((w) => w.senseId)): GenContext => ({ repo, poolSenseIds: senseIds, seed: 42 });

describe('answer checking', () => {
  it('accepts irrelevant variation (spaces, case)', () => {
    expect(checkTypedAnswer('  Fönster ', ['fönster']).correct).toBe(true);
    expect(checkTypedAnswer('plocka   undan', ['plocka undan']).correct).toBe(true);
  });
  it('does NOT treat å/ä/ö as a/o, but reports it as a diacritics near miss', () => {
    const r = checkTypedAnswer('fonster', ['fönster']);
    expect(r.correct).toBe(false);
    expect(r.nearMiss).toBe('diacritics');
    expect(checkTypedAnswer('smutsig', ['smutsig']).correct).toBe(true);
  });
  it('detects another form of the right word and typos', () => {
    expect(checkTypedAnswer('köket', ['kök'], ['köket', 'köken']).nearMiss).toBe('other-form');
    expect(checkTypedAnswer('molekul', ['molekyl']).nearMiss).toBe('typo');
  });
});

describe('exercise generation', () => {
  const types: ExerciseType[] = ['meaning_choice', 'reverse_choice', 'context_choice', 'synonym_choice', 'spelling', 'inflection'];
  it('produces a valid exercise for every module word and type (with fallback)', () => {
    for (const m of repo.modules) {
      for (const w of m.words) {
        for (const t of types) {
          const ex = generateExercise(t, w.senseId, ctx(m.words.map((x) => x.senseId)));
          expect(ex).not.toBeNull();
          if (ex && isChoice(ex)) {
            expect(ex.options.length).toBeGreaterThanOrEqual(ex.type === 'synonym_choice' ? 2 : 3);
            expect(ex.options[ex.correctIndex]!.senseId).toBe(w.senseId);
            expect(new Set(ex.options.map((o) => o.label)).size).toBe(ex.options.length);
          }
        }
      }
    }
  });
  it('never offers an ambiguous distractor (shared Japanese gloss or synonym)', () => {
    for (let seed = 0; seed < 20; seed++) {
      const ex = generateExercise('reverse_choice', 's.borg.1', { ...ctx(repo.modules[2]!.words.map((w) => w.senseId)), seed });
      expect(ex && isChoice(ex) && ex.options.map((o) => o.label)).not.toContain('ett slott');
    }
  });
  it('disambiguates multi-sense words with a context sentence', () => {
    const ex = generateExercise('meaning_choice', 's.laga.1', ctx());
    expect(ex && isChoice(ex) && ex.subPrompt).toBe('Vi lagar middag tillsammans.');
    expect(ex && isChoice(ex) && ex.options.some((o) => o.senseId === 's.laga.2')).toBe(false);
  });
  it('context exercise blanks the word and offers distractors in the same form', () => {
    const ex = genContextChoice(repo.getSense('s.städa.1')!, ctx())!;
    expect(ex.prompt).toBe('Vi ＿＿＿ lägenheten varje lördag.');
    expect(ex.options[ex.correctIndex]!.label).toBe('städar');
    expect(ex.options.every((o) => /r$/.test(o.label))).toBe(true); // all present tense
    expect(ex.subPrompt).toBeUndefined(); // translation would give the answer away – only as hint/result
    expect(ex.hint?.lang).toBe('ja');
  });
  it('context exercise distractors never come from the same topic (only one option fits)', () => {
    for (const m of repo.modules) {
      for (const w of m.words) {
        for (let seed = 0; seed < 5; seed++) {
          const ref = repo.getSense(w.senseId)!;
          const ex = genContextChoice(ref, { repo, poolSenseIds: m.words.map((x) => x.senseId), seed });
          if (!ex) continue;
          const tags = new Set(ref.sense.tags ?? []);
          for (const o of ex.options) {
            if (o.senseId === w.senseId) continue;
            const other = repo.getSense(o.senseId!)!;
            expect((other.sense.tags ?? []).some((t) => tags.has(t)), `${w.senseId} vs ${o.senseId}`).toBe(false);
            if (ref.entry.inflection.kind === 'noun' && other.entry.inflection.kind === 'noun') expect(other.entry.inflection.gender).toBe(ref.entry.inflection.gender);
          }
        }
      }
    }
  });
  it('form exercises use natural one-answer frames without grammar terms', () => {
    const GRAMMAR = /bestämd|obestämd|plural|singular|preteritum|supinum|presens|komparativ|infinitiv|imperativ/i;
    for (const m of repo.modules) {
      for (const w of m.words.filter((x) => x.active)) {
        const ref = repo.getSense(w.senseId)!;
        for (const f of inflectionFramesFor(ref)) {
          expect(f.sentence).not.toMatch(/\balla\b/); // "alla ___" accepts both sängar and sängarna
          expect(f.sentence).not.toMatch(GRAMMAR);
        }
        for (let seed = 0; seed < 4; seed++) {
          const ex = genInflection(ref, { ...ctx(), seed });
          if (ex) expect(ex.instructionSv).not.toMatch(GRAMMAR);
        }
        expect(genSpelling(ref, ctx()).instructionSv).not.toMatch(/grundform|substantiv|verb|adjektiv/);
      }
    }
    const säng = inflectionFramesFor(repo.getSense('s.säng.1')!).map((f) => f.sentence);
    expect(säng).toEqual(['Jag tänker på den sängen.', 'Jag tänker på två sängar.', 'Jag tänker på de sängarna.']);
    expect(inflectionFramesFor(repo.getSense('s.smälta.1')!).map((f) => f.sentence)).toEqual(['Isen smälter nu.', 'Isen smälte i går.', 'Isen har smält.']);
  });
  it('spelling accepts the noun with or without article; inflection uses stored forms incl. variants', () => {
    const sp = genSpelling(repo.getSense('s.fönster.1')!, ctx());
    expect(sp.accepted).toEqual(['fönster', 'ett fönster']);
    for (let seed = 0; seed < 30; seed++) {
      const inf = genInflection(repo.getSense('s.dammsuga.1')!, { ...ctx(), seed })!;
      if (inf.frame?.[1].includes('i går')) { expect(inf.accepted).toEqual(['dammsög', 'dammsugde']); return; }
    }
  });
  it('Japanese prompts carry furigana markup, not parentheses', () => {
    const ex = genSpelling(repo.getSense('s.molekyl.1')!, ctx());
    expect(ex.prompt).toBe('{分子|ぶんし}');
    expect(stripFurigana(ex.prompt)).toBe('分子');
  });
});

describe('knowledge levels', () => {
  const card = (dim: string, stability: number, createdAt = 0): ReviewCardRecord => ({
    id: `s.x.1|${dim}`, senseId: 's.x.1', dimension: dim as never, createdDate: '2026-01-01', createdAt, due: 0,
    sched: { algorithm: 'fsrs', stability, difficulty: 5, state: 2, scheduledDays: 1, learningSteps: 0, reps: 2, lapses: 0 }, source: 'module',
  });
  const ev = (dim: string, correct: boolean, attempts = 1, at = 0, phase: ReviewEventRecord['phase'] = 'learn'): ReviewEventRecord =>
    ({ senseId: 's.x.1', dimension: dim as never, exerciseType: 'x', phase, correct, attempts, at, date: '2026-01-01' });

  it('follows the documented criteria', () => {
    expect(knowledgeLevel([], [])).toBeNull();
    expect(knowledgeLevel([], [ev('meaning', false)])).toBe('introduced');
    expect(knowledgeLevel([card('meaning', 3)], [ev('meaning', true)])).toBe('understood');
    expect(knowledgeLevel([card('meaning', 3), card('spelling', 3)], [ev('meaning', true), ev('spelling', true)])).toBe('active');
    expect(knowledgeLevel([card('meaning', 3), card('spelling', 3), card('inflection', 3)], [ev('meaning', true), ev('spelling', true)])).toBe('understood');
    const late = 22 * 86_400_000;
    expect(knowledgeLevel([card('meaning', 30), card('spelling', 30)], [ev('meaning', true), ev('spelling', true), ev('meaning', true, 1, late, 'review')])).toBe('consolidated');
    expect(knowledgeLevel([card('meaning', 30), card('spelling', 5)], [ev('meaning', true), ev('spelling', true), ev('meaning', true, 1, late, 'review')])).toBe('active');
  });
  it('identifies difficult dimensions and confused pairs', () => {
    const events = [ev('spelling', false), ev('spelling', false), ev('spelling', true), ev('meaning', true), ev('meaning', true), ev('meaning', true)];
    expect(difficultItems(events, []).map((d) => d.dimension)).toEqual(['spelling']);
    const conf = [1, 2].map(() => ({ ...ev('meaning', false), confusedWithSenseId: 's.y.1' }));
    expect(confusedPairs(conf)).toEqual([{ a: 's.x.1', b: 's.y.1', count: 2 }]);
  });
});

describe('placement', () => {
  it('estimates the highest unbroken level with ≥ 2/3 correct', () => {
    const items = repo.placementItems;
    const correct = new Set(items.filter((i) => ['A1', 'A2'].includes(i.level)).map((i) => i.id));
    expect(scorePlacement(items, correct, 0).estimatedLevel).toBe('A2');
    expect(scorePlacement(items, new Set(), 0).estimatedLevel).toBeNull();
    expect(isWellBelowLevel('A1', 'B1')).toBe(true);
    expect(isWellBelowLevel('A2', 'B1')).toBe(false);
  });
});

import { newLearnSession, batchProgress, advanceLearnSession } from './learnPlan';
describe('learner-facing progress', () => {
  it('shows the current part (batch) instead of the long total', () => {
    const m = repo.modules[0]!;
    let s = newLearnSession(m.words, repo, 1);
    let bp = batchProgress(s);
    expect(bp).toMatchObject({ part: 1, parts: Math.ceil(m.words.length / 5), doneInPart: 0 });
    expect(bp.sizeOfPart).toBeLessThan(40);
    while (batchProgress(s).part === 1) s = advanceLearnSession(s, 'first');
    bp = batchProgress(s);
    expect(bp.part).toBe(2);
    expect(bp.doneInPart).toBe(0);
  });
});
