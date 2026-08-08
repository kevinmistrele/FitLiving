import { describe, expect, it } from 'vitest';

import { calculateTargetCalories } from '@/features/diet/utils/calculate-target-calories';

describe('calculateTargetCalories', () => {
  it('subtracts the mild deficit (250 kcal/day)', () => {
    expect(calculateTargetCalories(2500, 1600, 'mild')).toBe(2250);
  });

  it('subtracts the moderate deficit (500 kcal/day), the spec default', () => {
    expect(calculateTargetCalories(2500, 1600, 'moderate')).toBe(2000);
  });

  it('subtracts the aggressive deficit (750 kcal/day)', () => {
    expect(calculateTargetCalories(2500, 1600, 'aggressive')).toBe(1750);
  });

  it('floors the target at BMR when the deficit would push it below basal rate', () => {
    // TDEE 1800 - 750 aggressive deficit = 1050, which is below the 1600 kcal BMR floor.
    expect(calculateTargetCalories(1800, 1600, 'aggressive')).toBe(1600);
  });

  it('returns exactly BMR when the raw target lands exactly on the floor', () => {
    expect(calculateTargetCalories(2100, 1600, 'moderate')).toBe(1600);
  });
});
