import { render, screen, fireEvent } from '@testing-library/react';
import { getContent } from '../../content/repository';
import { genSpelling, genReverseChoice, genImageChoice, genImagePick } from '../../learning/exercises/generate';
import type { ExerciseResult } from '../../learning/exercises/types';
import { DictionarySheetProvider, useDictionarySheet } from '../dictionary/DictionarySheet';
import { ExerciseView } from './ExerciseView';
import { WordIntro } from './WordIntro';
import { pictureMode } from './pictureMode';

const repo = getContent();
const ctx = { repo, poolSenseIds: repo.modules[0]!.words.map((w) => w.senseId), seed: 3 };

function OpenDict() {
  const d = useDictionarySheet();
  return <button onClick={() => d.open()}>open-dict</button>;
}

describe('ExerciseView – pictures (0.6)', () => {
  const pool = repo.getModule('m.trojor-och-skjortor')!.words.map((w) => w.senseId);
  it('picture → word: shows the picture and four words', () => {
    const ex = genImageChoice(repo.getSense('s.kofta.1')!, { repo, poolSenseIds: pool, seed: 2 })!;
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={() => undefined} /></DictionarySheetProvider>);
    expect(screen.getByText('Vilket ord passar till bilden?')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button').filter((b) => b.classList.contains('option'))).toHaveLength(4);
  });
  it('word → picture: four picture options, names hidden until answered', () => {
    const results: ExerciseResult[] = [];
    const ex = genImagePick(repo.getSense('s.kofta.1')!, { repo, poolSenseIds: pool, seed: 2 })!;
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={(r) => results.push(r)} /></DictionarySheetProvider>);
    const opts = screen.getAllByRole('button').filter((b) => b.classList.contains('image-option'));
    expect(opts).toHaveLength(4);
    for (const o of ex.options) if (o.senseId !== 's.kofta.1') expect(screen.queryByText(o.label)).toBeNull();
    fireEvent.click(opts[ex.correctIndex]!);
    fireEvent.click(screen.getByRole('button', { name: 'Fortsätt' }));
    expect(results).toEqual([expect.objectContaining({ outcome: 'first', exerciseType: 'image_pick', dimension: 'meaning' })]);
  });
});

describe('ExerciseView', () => {
  it('typed: å/ä/ö near miss gives a hint (answer hidden), second miss reveals the answer', () => {
    const results: ExerciseResult[] = [];
    const ex = genSpelling(repo.getSense('s.fönster.1')!, ctx);
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={(r) => results.push(r)} /></DictionarySheetProvider>);
    const input = screen.getByLabelText('Ditt svar');
    fireEvent.change(input, { target: { value: 'fonster' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kontrollera' }));
    expect(screen.getByText(/Titta noga på å, ä och ö/)).toBeInTheDocument();
    expect(screen.queryByText(/Rätt svar:/)).toBeNull();
    fireEvent.change(input, { target: { value: 'fenster' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kontrollera' }));
    expect(screen.getByText(/Rätt svar:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fortsätt' }));
    expect(results).toEqual([expect.objectContaining({ outcome: 'failed', dimension: 'spelling', attempts: 2 })]);
  });

  it('typed: correct after a hint counts as retry; case and spaces are ignored', () => {
    const results: ExerciseResult[] = [];
    const ex = genSpelling(repo.getSense('s.säng.1')!, ctx);
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={(r) => results.push(r)} /></DictionarySheetProvider>);
    const input = screen.getByLabelText('Ditt svar');
    fireEvent.change(input, { target: { value: 'sang' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kontrollera' }));
    fireEvent.change(input, { target: { value: '  Säng ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kontrollera' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fortsätt' }));
    expect(results[0]).toMatchObject({ outcome: 'retry' });
  });

  it('choice: wrong answer → retry with hint, records the confused sense', () => {
    const results: ExerciseResult[] = [];
    const ex = genReverseChoice(repo.getSense('s.kök.1')!, ctx)!;
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={(r) => results.push(r)} /></DictionarySheetProvider>);
    const options = screen.getAllByRole('button').filter((b) => b.classList.contains('option'));
    const wrongIdx = ex.correctIndex === 0 ? 1 : 0;
    fireEvent.click(options[wrongIdx]!);
    expect(screen.getByText(/Inte riktigt – försök igen!/)).toBeInTheDocument();
    fireEvent.click(options[ex.correctIndex]!);
    fireEvent.click(screen.getByRole('button', { name: 'Fortsätt' }));
    expect(results[0]).toMatchObject({ outcome: 'retry', confusedWithSenseId: ex.options[wrongIdx]!.senseId });
  });

  it('choice: a first-try correct answer shows the result sheet and waits for "Fortsätt" (no auto-advance)', () => {
    vi.useFakeTimers();
    const results: ExerciseResult[] = [];
    const ex = genReverseChoice(repo.getSense('s.säng.1')!, ctx)!;
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={(r) => results.push(r)} /></DictionarySheetProvider>);
    fireEvent.click(screen.getAllByRole('button').filter((b) => b.classList.contains('option'))[ex.correctIndex]!);
    vi.advanceTimersByTime(5000);
    expect(results).toEqual([]);
    expect(screen.getByText(/Rätt!/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fortsätt' }));
    expect(results[0]).toMatchObject({ outcome: 'first' });
    vi.useRealTimers();
  });

  it('opening and closing the dictionary keeps the typed answer', () => {
    const ex = genSpelling(repo.getSense('s.kök.1')!, ctx);
    render(<DictionarySheetProvider><OpenDict /><ExerciseView exercise={ex} onDone={() => {}} /></DictionarySheetProvider>);
    fireEvent.change(screen.getByLabelText('Ditt svar'), { target: { value: 'kö' } });
    fireEvent.click(screen.getByText('open-dict'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Sök i ordboken'), { target: { value: 'kök' } });
    expect(screen.getAllByText('kök').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Stäng' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect((screen.getByLabelText('Ditt svar') as HTMLInputElement).value).toBe('kö');
  });
});

describe('WordIntro – explanations for hard words (0.8)', () => {
  it('shows the explanation openly, also in compact mode', () => {
    render(<DictionarySheetProvider><WordIntro senseId="s.specificerad.1" compact onNext={() => undefined} /></DictionarySheetProvider>);
    const box = screen.getByTestId('word-explanation');
    expect(box.textContent).toMatch(/specificerat kvitto/);
    expect(box.textContent).toMatch(/Förklaring/);
  });
  it('shows no explanation box for an easy word without one', () => {
    render(<DictionarySheetProvider><WordIntro senseId="s.skjorta.1" compact onNext={() => undefined} /></DictionarySheetProvider>);
    expect(screen.queryByTestId('word-explanation')).toBeNull();
  });
});

describe('Japanese about the word is large and dark (0.15)', () => {
  it('word introduction: definition, example and explanation use ja-word, never the muted style', () => {
    const { container } = render(<DictionarySheetProvider><WordIntro senseId="s.rynka-pannan.1" compact={false} onNext={() => undefined} /></DictionarySheetProvider>);
    const jaBlocks = [...container.querySelectorAll('[lang="ja"]')].filter((el) => el.closest('.card'));
    const word = jaBlocks.filter((el) => el.classList.contains('ja-word'));
    expect(word.length).toBeGreaterThanOrEqual(2); // definition + example
    for (const el of word) expect(el.classList.contains('muted')).toBe(false);
  });
  it('picture exercise feedback shows the Japanese gloss with ja-word', () => {
    const pool = repo.getModule('m.ansiktsuttryck-och-miner')!.words.map((w) => w.senseId);
    const ex = genImageChoice(repo.getSense('s.rynka-pannan.1')!, { repo, poolSenseIds: pool, seed: 1 })!;
    render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={() => undefined} /></DictionarySheetProvider>);
    const right = ex.options[ex.correctIndex]!;
    fireEvent.click(screen.getByText(right.label));
    if (ex.explanation?.lang === 'ja') expect(document.querySelector('.ja-word')).not.toBeNull();
  });
});

describe('picture → word shows the Japanese word and plays an animation once (0.16)', () => {
  it('the Japanese word of the target is shown under the picture', () => {
    const sense = repo.getSense('s.rynka-pannan.1')!;
    const pool = repo.getModule('m.ansiktsuttryck-och-miner')!.words.map((w) => w.senseId);
    const ex = genImageChoice(sense, { repo, poolSenseIds: pool, seed: 1 })!;
    expect(ex.prompt).toBe(sense.sense.ja);
    expect(ex.promptLang).toBe('ja');
    const { container } = render(<DictionarySheetProvider><ExerciseView exercise={ex} onDone={() => undefined} /></DictionarySheetProvider>);
    const prompt = container.querySelector('.picture-prompt + .prompt-ja');
    expect(prompt).not.toBeNull();
    expect(prompt!.getAttribute('lang')).toBe('ja');
  });
  it('only the picture → word exercise plays the animation (once); every other picture is still', () => {
    expect(pictureMode('image_choice')).toBe('once');
    for (const t of ['image_pick', 'meaning_choice', 'reverse_choice', 'context_choice', 'spelling'] as const) expect(pictureMode(t)).toBe('still');
  });
});
