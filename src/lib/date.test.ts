import { addDays, dateRange, diffDays, toStudyDate, weekOf } from './date';

describe('study dates', () => {
  it('uses the given time zone to determine the study date', () => {
    const instant = new Date('2026-03-01T23:30:00Z');
    expect(toStudyDate(instant, 'Europe/Stockholm')).toBe('2026-03-02');
    expect(toStudyDate(instant, 'Asia/Tokyo')).toBe('2026-03-02');
    expect(toStudyDate(instant, 'America/New_York')).toBe('2026-03-01');
  });
  it('is unaffected by DST transitions', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(addDays('2026-10-25', 1)).toBe('2026-10-26');
    expect(diffDays('2026-03-28', '2026-03-30')).toBe(2);
    expect(dateRange('2026-10-24', '2026-10-26')).toEqual(['2026-10-24', '2026-10-25', '2026-10-26']);
  });
  it('local midnight in Stockholm across DST gives consecutive dates', () => {
    expect(toStudyDate(new Date('2026-03-28T23:30:00Z'), 'Europe/Stockholm')).toBe('2026-03-29');
    expect(toStudyDate(new Date('2026-03-29T22:30:00Z'), 'Europe/Stockholm')).toBe('2026-03-30');
  });
  it('returns Monday-based weeks', () => {
    expect(weekOf('2026-11-04')[0]).toBe('2026-11-02');
    expect(weekOf('2026-11-08')[6]).toBe('2026-11-08');
  });
});
