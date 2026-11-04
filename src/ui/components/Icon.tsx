const PATHS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  explore: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5z',
  review: 'M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5',
  book: 'M5 4h9a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 3-.1-1.2 2-1.6-2-3.4-2.4.8a8 8 0 0 0-2-1.2L15 2h-4l-.5 2.4a8 8 0 0 0-2 1.2l-2.4-.8-2 3.4 2 1.6L6 12l.1 1.2-2 1.6 2 3.4 2.4-.8a8 8 0 0 0 2 1.2L11 22h4l.5-2.4a8 8 0 0 0 2-1.2l2.4.8 2-3.4-2-1.6z',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5 10 17l9-10',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4',
  speaker: 'M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  stop: 'M7 7h10v10H7z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  copy: 'M9 9h10v12H9zM5 15V3h10',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
};

export function Icon({ name, size = 22, label }: { name: keyof typeof PATHS | string; size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path d={PATHS[name] ?? ''} />
    </svg>
  );
}
