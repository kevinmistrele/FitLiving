import { describe, expect, it } from 'vitest';

import { isCompletedThisWeek } from '@/features/workouts/utils/is-completed-this-week';

describe('isCompletedThisWeek', () => {
  const thisWeekWednesday = new Date(2026, 0, 7);

  it('returns false when the exercise was never completed', () => {
    expect(isCompletedThisWeek(false, null, thisWeekWednesday)).toBe(false);
  });

  it('returns true when completed earlier in the current week', () => {
    const completedMonday = new Date(2026, 0, 5);
    expect(isCompletedThisWeek(true, completedMonday, thisWeekWednesday)).toBe(true);
  });

  it('returns false when completed the previous week, even if the flag is still true', () => {
    const completedLastWeek = new Date(2025, 11, 29);
    expect(isCompletedThisWeek(true, completedLastWeek, thisWeekWednesday)).toBe(false);
  });

  it('returns false when completedThisWeek is true but lastCompletedAt is missing', () => {
    expect(isCompletedThisWeek(true, null, thisWeekWednesday)).toBe(false);
  });
});
