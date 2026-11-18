import { toolingRepository as getContent } from './tooling';
import { validateContent, visualMissingAllowed } from './validateContent';
import { allPlannedVisuals } from './visualPlan';
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

  it('every module word has a picture, animation or symbol – or waits in the manual track (kvalitetsplanen A5)', () => {
    const repo = getContent();
    const missing = repo.modules.flatMap((m) => m.words.map((w) => w.senseId)).filter((id) => !imageFor(id) && !visualMissingAllowed(id));
    expect(missing).toEqual([]);
    // no module word is planned as "none", and a word in the manual track really lacks a picture
    for (const m of repo.modules) for (const w of m.words) expect(allPlannedVisuals()[w.senseId]?.kind, w.senseId).not.toBe('none');
    for (const [id, p] of Object.entries(allPlannedVisuals())) if (p.status === 'manual') expect(imageFor(id), id).toBeUndefined();
  });
});
