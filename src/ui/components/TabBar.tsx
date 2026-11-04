import { href, type Route } from '../app/router';
import { Icon } from './Icon';

const TABS: { route: Route; label: string; icon: string; match: Route['name'][] }[] = [
  { route: { name: 'home' }, label: 'Hem', icon: 'home', match: ['home', 'settings', 'stats'] },
  { route: { name: 'explore' }, label: 'Utforska', icon: 'explore', match: ['explore', 'module'] },
  { route: { name: 'review' }, label: 'Repetition', icon: 'review', match: ['review'] },
  { route: { name: 'dictionary' }, label: 'Ordlista', icon: 'book', match: ['dictionary'] },
];

export function TabBar({ current }: { current: Route }) {
  return (
    <div className="tabbar">
      <nav aria-label="Huvudnavigering">
        {TABS.map((t) => (
          <a key={t.label} href={href(t.route)} aria-current={t.match.includes(current.name) ? 'page' : undefined}>
            <Icon name={t.icon} />
            {t.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
