import { toolingRepository as getContent } from './tooling';
import { validateContent, VISUAL_EXCEPTIONS_BEFORE_0_29, VISUAL_MISSING_AFTER_BLIND_TEST } from './validateContent';
import { imageFor } from './images';

describe('content validation', () => {
  it('all bundled content passes schema and quality checks', () => {
    const repo = getContent();
    const issues = validateContent(repo);
    if (issues.length) console.error(issues.map((i) => `${i.where}: ${i.message}`).join('\n'));
    expect(issues).toEqual([]);
  });

  it('has at least three complete modules with 15–20 words', () => {
    const repo = getContent();
    expect(repo.modules.length).toBeGreaterThanOrEqual(3);
    for (const m of repo.modules) {
      expect(m.words.length).toBeGreaterThanOrEqual(15);
      expect(m.words.length).toBeLessThanOrEqual(20);
    }
  });

  it('every module word has a picture, animation or symbol (0.29) – only the listed exceptions lack one', () => {
    const repo = getContent();
    expect(VISUAL_EXCEPTIONS_BEFORE_0_29.size).toBe(14);
    const missing = repo.modules.flatMap((m) => m.words.map((w) => w.senseId)).filter((id) => !imageFor(id) && !VISUAL_EXCEPTIONS_BEFORE_0_29.has(id) && !VISUAL_MISSING_AFTER_BLIND_TEST.has(id));
    // the missing ones really lack a picture and are planned as `none`
    for (const id of VISUAL_MISSING_AFTER_BLIND_TEST) expect(imageFor(id)).toBeUndefined();
    expect(missing).toEqual([]);
  });
});
