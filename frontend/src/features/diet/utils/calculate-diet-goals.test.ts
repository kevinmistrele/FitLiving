import { describe, expect, it } from 'vitest';

import { calculateDietGoals } from '@/features/diet/utils/calculate-diet-goals';

describe('calculateDietGoals', () => {
  it('composes BMR/TDEE/target calories/BMI/macros for a full profile', () => {
    const result = calculateDietGoals({
      weightKg: 100,
      heightCm: 180,
      age: 30,
      sex: 'male',
      activityLevel: 'moderate',
      dietDeficitLevel: 'moderate',
    });

    // BMR = 10*100 + 6.25*180 - 5*30 + 5 = 1000 + 1125 - 150 + 5 = 1980
    expect(result.bmrKcal).toBeCloseTo(1980);
    // TDEE = 1980 * 1.55 = 3069
    expect(result.tdeeKcal).toBeCloseTo(3069);
    // target = 3069 - 500 = 2569 (above the BMR floor, no clamping)
    expect(result.targetCalKcal).toBeCloseTo(2569);
    expect(result.proteinG).toBe(200);
    expect(result.fatG).toBe(80);
    expect(result.calculatedFromWeightKg).toBe(100);
  });

  it('recomputes from the given weight rather than caching a previous result', () => {
    const input = {
      heightCm: 175,
      age: 28,
      sex: 'female' as const,
      activityLevel: 'light' as const,
      dietDeficitLevel: 'moderate' as const,
    };

    const heavier = calculateDietGoals({ ...input, weightKg: 90 });
    const lighter = calculateDietGoals({ ...input, weightKg: 70 });

    expect(heavier.tdeeKcal).toBeGreaterThan(lighter.tdeeKcal);
    expect(heavier.proteinG).toBeGreaterThan(lighter.proteinG);
    expect(heavier.calculatedFromWeightKg).toBe(90);
    expect(lighter.calculatedFromWeightKg).toBe(70);
  });
});
