import { describe, expect, it } from 'vitest';

import { calculateMacros } from '@/features/diet/utils/calculate-macros';

describe('calculateMacros', () => {
  it('computes protein at 2.0 g/kg and fat at 0.8 g/kg', () => {
    const result = calculateMacros(100, 2500);

    expect(result.proteinG).toBe(200);
    expect(result.proteinKcal).toBe(800);
    expect(result.fatG).toBe(80);
    expect(result.fatKcal).toBe(720);
  });

  it('fills the remaining budget with carbs when there is room', () => {
    // 2500 - 800 (protein) - 720 (fat) = 980 kcal carbs -> 245 g
    const result = calculateMacros(100, 2500);

    expect(result.carbsKcal).toBe(980);
    expect(result.carbsG).toBe(245);
    expect(result.isCarbsBudgetTooLow).toBe(false);
  });

  it('clamps carbs at 0 (never negative) when the calorie budget is too low for the floors', () => {
    // 100 kg -> protein 800 kcal + fat 720 kcal = 1520 kcal, but target is only 1200 kcal.
    const result = calculateMacros(100, 1200);

    expect(result.carbsKcal).toBe(0);
    expect(result.carbsG).toBe(0);
    expect(result.isCarbsBudgetTooLow).toBe(true);
  });

  it('does not flag a budget that lands exactly at zero carbs as too low', () => {
    // protein 800 + fat 720 = 1520 kcal, target exactly 1520 kcal -> carbs exactly 0.
    const result = calculateMacros(100, 1520);

    expect(result.carbsKcal).toBe(0);
    expect(result.isCarbsBudgetTooLow).toBe(false);
  });
});
