import { describe, expect, it } from 'vitest';

import { calculateGoalProgressPercentage } from '@/features/check-ins/utils/calculate-goal-progress-percentage';

describe('calculateGoalProgressPercentage', () => {
  it('computes the percentage of progress toward the goal', () => {
    // 105 -> 94 is 11kg total; 105 -> 99.5 is 5.5kg done = 50%
    expect(calculateGoalProgressPercentage(105, 99.5, 94)).toBeCloseTo(50);
  });

  it('clamps at 100 when the goal has been surpassed', () => {
    expect(calculateGoalProgressPercentage(105, 80, 94)).toBe(100);
  });

  it('clamps at 0 when weight increased past the starting point', () => {
    expect(calculateGoalProgressPercentage(105, 110, 94)).toBe(0);
  });

  it('returns 0 before any progress has been made', () => {
    expect(calculateGoalProgressPercentage(105, 105, 94)).toBe(0);
  });

  it('does not divide by zero when initial and goal weight are equal', () => {
    expect(calculateGoalProgressPercentage(94, 94, 94)).toBe(100);
    expect(calculateGoalProgressPercentage(94, 96, 94)).toBe(0);
  });
});
