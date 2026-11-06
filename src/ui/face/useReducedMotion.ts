import { useEffect, useState } from 'react';
/** Same rule as the animation player: OS setting unless the app forces full or reduced motion (html classes). */
export function useReducedMotion(): boolean {
  const compute = () => {
    if (typeof document === 'undefined') return false;
    const html = document.documentElement;
    if (html.classList.contains('reduce-motion')) return true;
    if (html.classList.contains('full-motion')) return false;
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const [reduced, setReduced] = useState(compute);
  useEffect(() => {
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    const update = () => setReduced(compute());
    mq?.addEventListener?.('change', update);
    const mo = typeof MutationObserver === 'function' ? new MutationObserver(update) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { mq?.removeEventListener?.('change', update); mo?.disconnect(); };
  }, []);
  return reduced;
}
