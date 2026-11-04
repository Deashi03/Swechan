import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

/**
 * Modal bottom sheet. Rendered on top of the current screen WITHOUT
 * unmounting it, so an exercise or reading position underneath is preserved.
 */
export function BottomSheet({ title, onClose, children, headerExtra }: { title: string; onClose: () => void; children: ReactNode; headerExtra?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}>
        <div className="sheet-grip" />
        <div className="sheet-head">
          <strong className="grow">{title}</strong>
          {headerExtra}
          <button className="icon-btn" onClick={onClose} aria-label="Stäng"><Icon name="close" /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
