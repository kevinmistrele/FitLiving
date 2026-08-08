import { describe, expect, it } from 'vitest';

import { fromDateInputValue, toDateInputValue } from '@/features/check-ins/utils/date-input';

describe('date-input', () => {
  it('formats a Date into a yyyy-mm-dd string using local date parts', () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('parses a yyyy-mm-dd string back into a local Date', () => {
    const date = fromDateInputValue('2026-01-05');

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it('round-trips a date through both conversions', () => {
    expect(toDateInputValue(fromDateInputValue('2026-11-30'))).toBe('2026-11-30');
  });
});
