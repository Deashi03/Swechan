import { moving } from '../ui/wordArt/kit';
import { posterOf, visualFingerprintSource, visualHash } from './blindTest';
import type { WordImage } from './images';

describe('affischbild för rörliga illustrationer (kvalitetsplanen A5)', () => {
  const still = '<circle cx="1" cy="2" r="3"/><rect width="4" height="5"/>';
  it('posterOf tar bort rörelsen och lämnar exakt den stilla bilden', () => {
    const animated = `<circle cx="1" cy="2" r="3"/>${moving('t', '0%{opacity:0}', { dur: 2 }, '<rect width="4" height="5"/>')}`;
    expect(animated).toContain('data-wa');
    expect(posterOf(animated)).toBe(still);
  });
  it('att lägga till rörelse ändrar inte blindtestets fingeravtryck', () => {
    const img = { kind: 'illustration', motif: 'x', senseId: 's.x.1', group: 'g', quiz: false } as WordImage;
    const io = (svg: string) => ({ renderMotif: () => svg, sceneFile: () => '', faceScene: () => null });
    const a = visualFingerprintSource(img, io(still));
    const b = visualFingerprintSource(img, io(`<circle cx="1" cy="2" r="3"/>${moving('t', '0%{opacity:0}', {}, '<rect width="4" height="5"/>')}`));
    expect(visualHash(a!)).toBe(visualHash(b!));
  });
});
