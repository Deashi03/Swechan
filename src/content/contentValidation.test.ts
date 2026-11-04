import { getContent } from './repository';
import { validateContent } from './validateContent';

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
});
