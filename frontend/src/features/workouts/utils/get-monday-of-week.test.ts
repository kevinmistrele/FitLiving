import { describe, expect, it } from 'vitest';

import { getMondayOfWeek } from '@/features/workouts/utils/get-monday-of-week';

describe('getMondayOfWeek', () => {
  it('returns the same date when given a Monday', () => {
    const monday = new Date(2026, 0, 5); // Jan 5 2026 is a Monday
    expect(getMondayOfWeek(monday)).toEqual(new Date(2026, 0, 5));
  });

  it("returns that week's Monday when given a mid-week date", () => {
    const wednesday = new Date(2026, 0, 7);
    expect(getMondayOfWeek(wednesday)).toEqual(new Date(2026, 0, 5));
  });

  it("returns the same week's Monday when given a Sunday (end of the ISO week)", () => {
    const sunday = new Date(2026, 0, 11);
    expect(getMondayOfWeek(sunday)).toEqual(new Date(2026, 0, 5));
  });

  it('crosses a month boundary correctly', () => {
    const sunday = new Date(2026, 1, 1); // Feb 1 2026 is a Sunday
    expect(getMondayOfWeek(sunday)).toEqual(new Date(2026, 0, 26));
  });
});
