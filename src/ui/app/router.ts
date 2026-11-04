/**
 * Minimal hash router (works on GitHub Pages and any static host, no server rewrites).
 */
import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'explore'; categoryId?: string }
  | { name: 'module'; id: string }
  | { name: 'learn'; id: string }
  | { name: 'read'; id: string }
  | { name: 'converse'; id: string }
  | { name: 'review' }
  | { name: 'reviewSession'; mode: 'daily' | 'extra' }
  | { name: 'personalLearn' }
  | { name: 'dictionary'; entryId?: string; tab?: 'saved' }
  | { name: 'settings' }
  | { name: 'stats' }
  | { name: 'placement' }
  | { name: 'welcome' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [a, b, c] = parts;
  switch (a) {
    case undefined: return { name: 'home' };
    case 'explore': return b ? { name: 'explore', categoryId: b } : { name: 'explore' };
    case 'module':
      if (!b) return { name: 'explore' };
      if (c === 'learn' || c === 'read' || c === 'converse') return { name: c, id: b };
      return { name: 'module', id: b };
    case 'review':
      if (b === 'session') return { name: 'reviewSession', mode: c === 'extra' ? 'extra' : 'daily' };
      if (b === 'personal') return { name: 'personalLearn' };
      return { name: 'review' };
    case 'dictionary':
      if (b === 'saved') return { name: 'dictionary', tab: 'saved' };
      return b ? { name: 'dictionary', entryId: b } : { name: 'dictionary' };
    case 'settings': return { name: 'settings' };
    case 'stats': return { name: 'stats' };
    case 'placement': return { name: 'placement' };
    case 'welcome': return { name: 'welcome' };
    default: return { name: 'home' };
  }
}

export function href(r: Route): string {
  const e = encodeURIComponent;
  switch (r.name) {
    case 'home': return '#/';
    case 'explore': return r.categoryId ? `#/explore/${e(r.categoryId)}` : '#/explore';
    case 'module': return `#/module/${e(r.id)}`;
    case 'learn': case 'read': case 'converse': return `#/module/${e(r.id)}/${r.name}`;
    case 'review': return '#/review';
    case 'reviewSession': return `#/review/session/${r.mode}`;
    case 'personalLearn': return '#/review/personal';
    case 'dictionary': return r.tab === 'saved' ? '#/dictionary/saved' : r.entryId ? `#/dictionary/${e(r.entryId)}` : '#/dictionary';
    default: return `#/${r.name}`;
  }
}

export function navigate(r: Route, opts: { replace?: boolean } = {}) {
  const h = href(r);
  if (opts.replace) history.replaceState(null, '', h);
  else history.pushState(null, '', h);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  window.scrollTo(0, 0);
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  return parseHash(hash);
}

/** Routes that hide the tab bar so the learner can focus. */
export function isFocusRoute(r: Route): boolean {
  return ['learn', 'read', 'converse', 'reviewSession', 'personalLearn', 'placement', 'welcome'].includes(r.name);
}
