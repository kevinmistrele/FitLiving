import { describe, expect, it } from 'vitest';

import { calculateIncreasedVsPrevious } from '@/features/workouts/utils/calculate-increased-vs-previous';

describe('calculateIncreasedVsPrevious', () => {
  it('is never increased on the very first entry (nothing to compare against)', () => {
    expect(calculateIncreasedVsPrevious(40, null)).toBe(false);
  });

  it('returns true when the load increased vs. the previous entry', () => {
    expect(calculateIncreasedVsPrevious(45, 40)).toBe(true);
  });

  it('returns false when the load stayed the same', () => {
    expect(calculateIncreasedVsPrevious(40, 40)).toBe(false);
  });

  it('returns false when the load decreased', () => {
    expect(calculateIncreasedVsPrevious(35, 40)).toBe(false);
  });
});
