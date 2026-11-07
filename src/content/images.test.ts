import fs from 'node:fs';
import path from 'node:path';
import { allWordImages, imageDistractorAllowed, imageFor, quizImageFor } from './images';
import { getContent } from './repository';
import { generateExercise } from '../learning/exercises/generate';
import { isChoice } from '../learning/exercises/types';
import { buildLearnPlan } from '../learning/learnPlan';
import { hasMotif, loadAllMotifs, renderWordArt } from '../ui/wordArt/render';

beforeAll(async () => { await loadAllMotifs(); });
import { exerciseTypeFor } from '../ui/screens/ReviewSession';
import { Scene, migrateScene, compileScene, renderFrame, frameToSvg } from '../ui/anim/player';

const repo = getContent();
/** 0.6 pilot: every word in these modules has a picture. */
const PILOT = ['m.trojor-och-skjortor', 'm.byxor-och-kjolar', 'm.klanningar-och-kostymer', 'm.underklader-och-strumpor', 'm.jackor-och-ytterplagg', 'm.sportiga-vardagsklader', 'm.att-beskriva-en-outfit'];

describe('word images – data', () => {
  it('every pilot word has a picture', () => {
    for (const id of PILOT) for (const w of repo.getModule(id)!.words) expect(imageFor(w.senseId), w.senseId).toBeDefined();
  });
  it('every illustration has a motif that renders to an SVG', () => {
    for (const img of allWordImages()) {
      if (img.kind !== 'illustration') continue;
      expect(hasMotif(img.motif), img.motif).toBe(true);
      expect(renderWordArt(img.motif)).toMatch(/^<svg [^>]*viewBox="0 0 120 120"/);
    }
  });
  it('every photo file exists, is small and has a free licence with attribution', () => {
    for (const img of allWordImages()) {
      if (img.kind !== 'photo') continue;
      const file = path.join('public/img/words', img.file);
      expect(fs.existsSync(file), file).toBe(true);
      expect(fs.statSync(file).size).toBeLessThan(80_000);
      expect(img.credit.license).toMatch(/^(CC0|CC BY|Public domain)/);
    }
  });
  it('no picture spells out its own word (0.18.1) – pictures are shown in picture and spelling exercises', () => {
    const offenders: string[] = [];
    for (const img of allWordImages()) {
      const motif = img.kind === 'illustration' ? img.motif : 'fallbackMotif' in img ? img.fallbackMotif : undefined;
      if (!motif) continue;
      const lemma = repo.getSense(img.senseId)?.entry.lemma.toLowerCase().replace(/ /g, '');
      if (!lemma) continue;
      const stem = lemma.slice(0, Math.max(3, lemma.length - 2));
      const texts = [...(renderWordArt(motif) ?? '').matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]!.toLowerCase().replace(/ /g, ''));
      for (const tx of texts) if (tx.length >= 3 && (tx.includes(stem) || (tx.length >= 4 && stem.includes(tx)))) offenders.push(`${img.senseId}: ${tx}`);
    }
    expect(offenders).toEqual([]);
  });
  it('symbol pictures (abstract words) are never used in picture exercises', () => {
    for (const img of allWordImages()) if (img.symbol) expect(img.quiz, img.senseId).toBe(false);
  });
});

describe('word animations (0.12)', () => {
  const anims = allWordImages().filter((i) => i.kind === 'animation');
  it('there are imported animations', () => {
    expect(anims.length).toBeGreaterThan(50);
  });
  it('every animation scene file exists, is small, parses, compiles and renders an SVG frame', () => {
    for (const a of anims) {
      if (a.kind !== 'animation') continue;
      const file = path.join('public/anim/scenes', `${a.file}.json`);
      expect(fs.existsSync(file), file).toBe(true);
      expect(fs.statSync(file).size, file).toBeLessThan(20_000);
      const parsed = Scene.safeParse(migrateScene(JSON.parse(fs.readFileSync(file, 'utf8'))));
      expect(parsed.success, a.animationId).toBe(true);
      const compiled = compileScene(parsed.data!);
      expect(frameToSvg(renderFrame(compiled, compiled.posterMs)), a.animationId).toContain('<svg');
      expect(parsed.data!.senseId, a.animationId).toBe(a.senseId);
    }
  });
  it('a fallback motif, when given, exists', () => {
    for (const a of anims) if (a.kind === 'animation' && a.fallbackMotif) expect(hasMotif(a.fallbackMotif), a.fallbackMotif).toBe(true);
  });
  it('scene files in public/anim are all referenced by the registry (no orphans)', () => {
    const referenced = new Set(anims.map((a) => (a.kind === 'animation' ? `${a.file}.json` : '')));
    for (const f of fs.readdirSync('public/anim/scenes')) expect(referenced.has(f), f).toBe(true);
  });
  it('picture exercises work when the visuals are animations (poster frames)', () => {
    const quizAnims = anims.filter((a) => a.quiz);
    for (const a of quizAnims.slice(0, 20)) {
      const pool = quizAnims.map((x) => x.senseId);
      for (let seed = 0; seed < 5; seed++) {
        const ex = generateExercise('image_pick', a.senseId, { repo, poolSenseIds: pool, seed });
        if (!ex || !isChoice(ex)) continue;
        expect(ex.options[ex.correctIndex]!.senseId).toBe(a.senseId);
        for (const o of ex.options) if (o.senseId !== a.senseId) expect(imageDistractorAllowed(a.senseId, o.senseId!)).toBe(true);
      }
    }
  });
});

describe('word images – picture exercises never offer a confusable option', () => {
  const quiz = allWordImages().filter((i) => i.quiz);
  const poolFor = (senseId: string) => repo.modulesForSense(senseId)[0]?.words.map((w) => w.senseId) ?? [senseId];
  for (const type of ['image_choice', 'image_pick'] as const) {
    it(type, () => {
      for (const img of quiz) {
        for (let seed = 0; seed < 8; seed++) {
          const ex = generateExercise(type, img.senseId, { repo, poolSenseIds: poolFor(img.senseId), seed });
          expect(ex?.type, `${img.senseId} ${type}`).toBe(type);
          if (!ex || !isChoice(ex)) continue;
          expect(ex.options).toHaveLength(4);
          expect(ex.options[ex.correctIndex]!.senseId).toBe(img.senseId);
          expect(new Set(ex.options.map((o) => o.label)).size).toBe(4);
          for (const o of ex.options) {
            expect(quizImageFor(o.senseId!), o.senseId!).toBeDefined();
            if (o.senseId !== img.senseId) expect(imageDistractorAllowed(img.senseId, o.senseId!), `${img.senseId} vs ${o.senseId}`).toBe(true);
          }
        }
      }
    });
  }
  it('the rule rejects same group, declared confusions and non-quiz pictures', () => {
    expect(imageDistractorAllowed('s.kofta.1', 's.munkjacka.1')).toBe(false); // same group
    expect(imageDistractorAllowed('s.brud.1', 's.brudklänning.1')).toBe(false); // declared, other group
    expect(imageDistractorAllowed('s.brudklänning.1', 's.brud.1')).toBe(false); // both directions
    expect(imageDistractorAllowed('s.jeans.1', 's.långbyxor.1')).toBe(false); // generic word: no quiz picture
    expect(imageDistractorAllowed('s.bryna.1', 's.steka.1')).toBe(false); // the user's example
    expect(imageDistractorAllowed('s.jeans.1', 's.slips.1')).toBe(true);
  });
  it('words without an unambiguous picture fall back to ordinary meaning exercises', () => {
    const ex = generateExercise('image_choice', 's.klädstil.1', { repo, poolSenseIds: poolFor('s.klädstil.1'), seed: 1 });
    expect(ex?.type).not.toBe('image_choice');
  });
});

describe('word images – where pictures are used', () => {
  it('step 1 uses picture exercises in the recognition round for words with a quiz picture', () => {
    const words = repo.getModule('m.trojor-och-skjortor')!.words;
    const plan = buildLearnPlan(words, repo, 7);
    const types = new Set(plan.flatMap((p) => (p.kind === 'exercise' ? [p.exerciseType] : [])));
    expect(types.has('image_choice') && types.has('image_pick')).toBe(true);
    for (const p of plan) if (p.kind === 'exercise' && (p.exerciseType === 'image_choice' || p.exerciseType === 'image_pick')) expect(quizImageFor(p.senseId)).toBeDefined();
  });
  it('review offers picture exercises only for words with a quiz picture', () => {
    const days = Array.from({ length: 30 }, (_, i) => `2026-12-${String(i + 1).padStart(2, '0')}`);
    expect(days.some((d) => exerciseTypeFor('s.jeans.1|meaning', 'meaning', d, true).startsWith('image'))).toBe(true);
    expect(days.some((d) => exerciseTypeFor('s.villkor.1|meaning', 'meaning', d, false).startsWith('image'))).toBe(false);
  });
  it('spelling shows the picture; context sentences and inflection never do', () => {
    const pool = repo.getModule('m.trojor-och-skjortor')!.words.map((w) => w.senseId);
    expect(generateExercise('spelling', 's.skjorta.1', { repo, poolSenseIds: pool, seed: 1 })?.image).toBe('s.skjorta.1');
    for (const t of ['context_choice', 'inflection', 'reverse_choice'] as const) {
      const ex = generateExercise(t, 's.skjorta.1', { repo, poolSenseIds: pool, seed: 1 });
      expect(ex && 'image' in ex ? ex.image : undefined, t).toBeUndefined();
    }
  });
});
