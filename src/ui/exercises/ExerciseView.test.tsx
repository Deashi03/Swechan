import { render, screen, fireEvent } from '@testing-library/react';
import { getContent } from '../../content/repository';
import { genSpelling, genReverseChoice } from '../../learning/exercises/generate';
import type { ExerciseResult } from '../../learning/exercises/types';
import { DictionarySheetProvider, useDictionarySheet } from '../dictionary/DictionarySheet';
import { ExerciseView } from './ExerciseView';

const repo = getContent();
const ctx = { repo, poolSenseIds: repo.modules[0]!.words.map((w) => w.senseId), seed: 3 };

function OpenDict() {
  const d = useDictionarySheet();
  return <button onClick={() => d.open()}>open-dict</button>;
}

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
