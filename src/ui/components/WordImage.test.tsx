import fs from 'node:fs';
import path from 'node:path';
import { render, screen, waitFor } from '@testing-library/react';
import { WordImage } from './WordImage';
import { allWordImages } from '../../content/images';

const anim = allWordImages().find((i) => i.kind === 'animation')!;

describe('WordImage with an animation (0.12)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const file = path.join('public', String(url).replace(/^.*?anim\//, 'anim/'));
      if (!fs.existsSync(file)) return { ok: false, json: async () => null };
      return { ok: true, json: async () => JSON.parse(fs.readFileSync(file, 'utf8')) };
    }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it('plays the animation in the word introduction and offers a replay button when it is paused', async () => {
    const { container } = render(<WordImage senseId={anim.senseId} size={180} label="ord" mode="intro" />);
    await waitFor(() => expect(container.querySelector('.scene-player svg')).not.toBeNull(), { timeout: 5000 });
    expect(container.querySelector('.word-image.anim.intro')).not.toBeNull();
  });

  it('shows only the poster frame in picture exercises', async () => {
    const { container } = render(<WordImage senseId={anim.senseId} size={140} label="Bild A" />);
    await waitFor(() => expect(container.querySelector('.word-image.anim.still svg')).not.toBeNull(), { timeout: 5000 });
    expect(container.querySelector('.scene-player')).toBeNull();
    expect(screen.getByLabelText('Bild A')).toBeTruthy();
  });

  it('falls back to nothing (or the illustration) when the scene cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => null })));
    const missing = allWordImages().find((i) => i.kind === 'animation' && !i.fallbackMotif && i.senseId !== anim.senseId) ?? anim;
    const { container } = render(<WordImage senseId={missing.senseId} size={140} label="x" />);
    await waitFor(() => expect(container.querySelector('.loading')).toBeNull(), { timeout: 5000 });
    expect(container.querySelector('.scene-player')).toBeNull();
  });
});
