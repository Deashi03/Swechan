import { render } from '@testing-library/react';
import { allWordImages } from '../../content/images';
import { exerciseSenseIds, loadedRenderer, preloadVisual, resetPreloadForTests } from './preloadVisual';
import { WordImage } from './WordImage';

describe('förladdning av ordbilder (kvalitetsplanen A3)', () => {
  beforeEach(() => resetPreloadForTests());

  it('en förladdad illustration visas direkt, utan väntebild', async () => {
    const img = allWordImages().find((i) => i.kind === 'illustration' && i.motif.includes('.'))!;
    if (img.kind !== 'illustration') throw new Error('no illustration');
    preloadVisual(img.senseId);
    await vi.waitFor(() => expect(loadedRenderer()?.renderWordArt(img.motif)).toBeTruthy(), { timeout: 10000 });
    const { container } = render(<WordImage senseId={img.senseId} size={120} label="bild" />);
    expect(container.querySelector('.word-image.loading')).toBeNull();
    expect(container.querySelector('.word-image svg')).not.toBeNull();
  });

  it('samlar målord och bildalternativ ur en övning', () => {
    expect(exerciseSenseIds({ senseId: 's.a.1', options: [{ senseId: 's.b.1' }, { senseId: null }, { senseId: 's.c.1' }] })).toEqual(['s.a.1', 's.b.1', 's.c.1']);
    expect(exerciseSenseIds(null)).toEqual([]);
  });

  it('tål ord utan bild och upprepade anrop', () => {
    expect(() => { preloadVisual('s.finns-inte.1'); preloadVisual('s.finns-inte.1'); preloadVisual(null); }).not.toThrow();
  });
});

describe('rörelse i illustrationer (kvalitetsplanen A5)', () => {
  it('spelas bara i ordintroduktionen; annars visas affischbilden', async () => {
    const img = allWordImages().find((i) => i.kind === 'illustration' && i.animated)!;
    if (img.kind !== 'illustration') throw new Error('no animated illustration');
    preloadVisual(img.senseId);
    await vi.waitFor(() => expect(loadedRenderer()?.renderWordArt(img.motif)).toBeTruthy(), { timeout: 10000 });
    const intro = render(<WordImage senseId={img.senseId} size={120} label="a" mode="intro" />);
    expect(intro.container.querySelector('.word-image.play [data-wa]')).not.toBeNull();
    const still = render(<WordImage senseId={img.senseId} size={120} label="b" />);
    expect(still.container.querySelector('.word-image.play')).toBeNull();
    expect(still.container.querySelector('[data-wa]')).not.toBeNull();
  });
});
