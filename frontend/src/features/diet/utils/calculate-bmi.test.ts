import { describe, expect, it } from 'vitest';

import { calculateBmi } from '@/features/diet/utils/calculate-bmi';

describe('calculateBmi', () => {
  it('computes BMI = weightKg / heightM^2', () => {
    // 70 / 1.75^2 = 70 / 3.0625 = 22.857...
    const result = calculateBmi(70, 175);

    expect(result.bmi).toBeCloseTo(22.857, 2);
  });

  it('computes the healthy weight range for the given height', () => {
    // heightM = 1.75, heightM^2 = 3.0625
    const result = calculateBmi(70, 175);

    expect(result.healthyWeightMinKg).toBeCloseTo(18.5 * 3.0625, 3);
    expect(result.healthyWeightMaxKg).toBeCloseTo(24.9 * 3.0625, 3);
  });

  it('scales with height for a taller person', () => {
    const shorter = calculateBmi(70, 160);
    const taller = calculateBmi(70, 190);

    // Same weight, taller person has a lower BMI.
    expect(taller.bmi).toBeLessThan(shorter.bmi);
    expect(taller.healthyWeightMaxKg).toBeGreaterThan(shorter.healthyWeightMaxKg);
  });
});
