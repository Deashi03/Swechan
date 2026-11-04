import { fireEvent, render, screen, within } from '@testing-library/react';
import { DictionarySheetProvider } from '../dictionary/DictionarySheet';
import { setupTestEnv } from '../../test/helpers';
import { CatalogModuleView, Explore, SEARCH_PAGE_SIZE } from './Explore';

const wrap = (ui: React.ReactNode) => render(<DictionarySheetProvider>{ui}</DictionarySheetProvider>);
const choices = async () => within(await screen.findByRole('list', { name: 'Val' })).getAllByRole('listitem');

describe('Kurser (catalog navigation)', () => {
  beforeEach(async () => { await setupTestEnv(); });

  it('root shows the eight real areas and no "all modules" list', async () => {
    wrap(<Explore />);
    const items = await choices();
    expect(items.length).toBe(8);
    expect(items[0]).toHaveTextContent('Vardag & hem');
    expect(screen.queryByText(/Alla moduler/)).toBeNull();
  });

  it('an area with published modules shows its topic groups plus the lessons (8 choices)', async () => {
    wrap(<Explore categoryId="R04-A02" />);
    const items = await choices();
    expect(items.length).toBe(8);
    expect(screen.getByText('Medeltida slott och belägringar')).toBeInTheDocument();
    expect(screen.getByText('Krig och försvar')).toBeInTheDocument();
  });

  it('a topic group lists its seven planned modules, clearly marked and not startable', async () => {
    wrap(<Explore categoryId="R04-A02-T03" />);
    const items = await choices();
    expect(items.length).toBe(7);
    expect(screen.getAllByText('Planerad').length).toBeGreaterThanOrEqual(7);
    expect(screen.getByText('Kapitulation och undsättning')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Starta/ })).toBeNull();
  });

  it('a planned module has an information view without a start button', async () => {
    wrap(<CatalogModuleView id="SWC-HIS-02-03-01" />);
    expect(await screen.findByText('Belägringens mål')).toBeInTheDocument();
    expect(screen.getByText(/inte färdig än/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Starta/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /Starta/ })).toBeNull();
    expect(screen.getByText('Medeltida slott och belägringar')).toBeInTheDocument(); // overlapping published lesson
  });

  it('search results are typed and paginated (max 8 per page)', async () => {
    wrap(<Explore />);
    await choices();
    fireEvent.change(screen.getByLabelText('Global sökning'), { target: { value: 'och' } });
    const planned = await screen.findByRole('region', { name: 'Planerade moduler' });
    expect(within(planned).getAllByRole('listitem').length).toBe(SEARCH_PAGE_SIZE);
    expect(within(planned).getByText(/Sida 1 av/)).toBeInTheDocument();
    fireEvent.click(within(planned).getByRole('button', { name: /Nästa/ }));
    expect(within(planned).getByText(/Sida 2 av/)).toBeInTheDocument();
  });
});
