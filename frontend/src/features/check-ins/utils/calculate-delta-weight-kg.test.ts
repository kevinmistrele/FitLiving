import { describe, expect, it } from 'vitest';

import { calculateDeltaWeightKg } from '@/features/check-ins/utils/calculate-delta-weight-kg';

describe('calculateDeltaWeightKg', () => {
  it('uses the profile initialWeightKg as the reference when there is no previous check-in', () => {
    expect(calculateDeltaWeightKg(103, null, 105)).toBeCloseTo(-2);
  });

  it('uses the previous check-in weight as the reference when one exists', () => {
    expect(calculateDeltaWeightKg(101, 103, 105)).toBeCloseTo(-2);
  });

  it('returns a positive delta when weight increased', () => {
    expect(calculateDeltaWeightKg(106, 105, 105)).toBeCloseTo(1);
  });

  it('returns zero when weight did not change', () => {
    expect(calculateDeltaWeightKg(105, 105, 105)).toBe(0);
  });
});
