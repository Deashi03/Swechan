import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { getMeta, requestPersistentStorage } from '../../storage/db';
import { DictionarySheetProvider } from '../dictionary/DictionarySheet';
import { TabBar } from '../components/TabBar';
import { ToastHost } from '../components/Toast';
import { ConverseStep } from '../screens/ConverseStep';
import { DictionaryScreen } from '../screens/DictionaryScreen';
import { Explore } from '../screens/Explore';
import { Home } from '../screens/Home';
import { ModuleLearnScreen } from '../screens/ModuleSteps';
import { ModuleOverview } from '../screens/ModuleOverview';
import { PersonalLearnScreen } from '../screens/PersonalLearn';
import { PlacementScreen, WelcomeScreen } from '../screens/Placement';
import { ReadStep } from '../screens/ReadStep';
import { ReviewHub } from '../screens/ReviewHub';
import { ReviewSession } from '../screens/ReviewSession';
import { SettingsScreen } from '../screens/Settings';
import { StatsScreen } from '../screens/Stats';
import { useSettings } from './hooks';
import { isFocusRoute, navigate, useRoute, type Route } from './router';

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home': return <Home />;
    case 'explore': return <Explore key={route.categoryId ?? 'root'} categoryId={route.categoryId} />;
    case 'module': return <ModuleOverview id={route.id} />;
    case 'learn': return <ModuleLearnScreen id={route.id} />;
    case 'read': return <ReadStep id={route.id} />;
    case 'converse': return <ConverseStep id={route.id} />;
    case 'review': return <ReviewHub />;
    case 'reviewSession': return <ReviewSession key={route.mode} mode={route.mode} />;
    case 'personalLearn': return <PersonalLearnScreen />;
    case 'dictionary': return <DictionaryScreen key={`${route.entryId}${route.tab}`} entryId={route.entryId} tab={route.tab} />;
    case 'settings': return <SettingsScreen />;
    case 'stats': return <StatsScreen />;
    case 'placement': return <PlacementScreen />;
    case 'welcome': return <WelcomeScreen />;
  }
}

export function App() {
  const route = useRoute();
  const settings = useSettings();
  const onboarded = useLiveQuery(async () => (await getMeta<boolean>('onboarded')) ?? false, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('no-furigana', !settings.furigana);
    html.classList.toggle('reduce-motion', settings.reducedMotion === 'reduce');
    html.classList.toggle('full-motion', settings.reducedMotion === 'full');
  }, [settings.furigana, settings.reducedMotion]);

  useEffect(() => { requestPersistentStorage(); }, []);

  useEffect(() => {
    if (onboarded === false && route.name !== 'welcome' && route.name !== 'placement') navigate({ name: 'welcome' }, { replace: true });
  }, [onboarded, route.name]);

  if (onboarded === undefined) return null;
  const focus = isFocusRoute(route);
  return (
    <DictionarySheetProvider>
      <div className="app">
        <main className={`screen ${focus ? 'focus-mode' : ''}`}>
          <Screen route={route} />
        </main>
        {!focus && <TabBar current={route} />}
        <ToastHost />
      </div>
    </DictionarySheetProvider>
  );
}
