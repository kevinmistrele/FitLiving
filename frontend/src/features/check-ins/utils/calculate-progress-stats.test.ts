import { describe, expect, it } from 'vitest';

import { calculateProgressStats } from '@/features/check-ins/utils/calculate-progress-stats';
import type { CheckIn } from '@/features/check-ins/types/check-in.types';

function buildCheckIn(overrides: Partial<CheckIn>): CheckIn {
  return {
    id: 'id',
    date: '2026-01-01',
    weightKg: 100,
    waistCm: 100,
    notes: '',
    deltaWeightKg: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('calculateProgressStats', () => {
  it('returns null when there are no check-ins', () => {
    expect(calculateProgressStats([], 105)).toBeNull();
  });

  it('returns totalLostKg but no average pace for a single check-in (no elapsed weeks)', () => {
    const checkIns = [buildCheckIn({ date: '2026-01-01', weightKg: 103 })];

    const result = calculateProgressStats(checkIns, 105);

    expect(result?.totalLostKg).toBeCloseTo(2);
    expect(result?.averagePaceKgPerWeek).toBeNull();
  });

  it('computes total lost and average pace across multiple check-ins', () => {
    const checkIns = [
      buildCheckIn({ date: '2026-01-01', weightKg: 105 }),
      buildCheckIn({ date: '2026-01-08', weightKg: 104 }),
      buildCheckIn({ date: '2026-01-15', weightKg: 103 }),
    ];

    const result = calculateProgressStats(checkIns, 105);

    expect(result?.totalLostKg).toBeCloseTo(2);
    expect(result?.averagePaceKgPerWeek).toBeCloseTo(1);
  });
});
