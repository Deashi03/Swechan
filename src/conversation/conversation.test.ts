import { toolingRepository } from '../content/tooling';
import { buildConversationPrompt } from './promptBuilder';

describe('conversation prompt', () => {
  const repo = toolingRepository();
  for (const meta of repo.modules) {
    const m = repo.getLoadedModuleBody(meta.id)!;
    it(`contains all target words and key instructions for ${m.id}`, () => {
      const p = buildConversationPrompt(m, repo, { estimatedLevel: 'B1', knownWordCount: 120 });
      for (const w of m.words) expect(p).toContain(`- ${repo.getSense(w.senseId)!.entry.lemma} – `);
      expect(p).toContain(m.titleSv);
      expect(p).toContain('ungefär B1');
      expect(p).toMatch(/taltranskription/);
      expect(p).toMatch(/japanska/);
      expect(p).not.toMatch(/\{[^}]*\|/); // no raw furigana markup leaks into the prompt
    });
  }
  it('lists active words before passive words', () => {
    const m = repo.getLoadedModuleBody('m.atomer-molekyler')!;
    const p = buildConversationPrompt(m, repo, { estimatedLevel: null, knownWordCount: 0 });
    expect(p.indexOf('- atom –')).toBeLessThan(p.indexOf('- proton –'));
  });
});
