import { describe, expect, it } from 'vitest';

import { calculateBmr, calculateTdee } from '@/features/diet/utils/calculate-tdee';

describe('calculateBmr', () => {
  it('adds 5 for men (Mifflin-St Jeor)', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBmr(80, 180, 30, 'male')).toBeCloseTo(1780);
  });

  it('subtracts 161 for women (Mifflin-St Jeor)', () => {
    // 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
    expect(calculateBmr(60, 165, 28, 'female')).toBeCloseTo(1330.25);
  });

  it('differs between sexes for the same weight/height/age', () => {
    const male = calculateBmr(80, 180, 30, 'male');
    const female = calculateBmr(80, 180, 30, 'female');

    // Difference is always exactly 5 - (-161) = 166.
    expect(male - female).toBeCloseTo(166);
  });
});

describe('calculateTdee', () => {
  it('applies the sedentary multiplier (1.2)', () => {
    const bmr = calculateBmr(80, 180, 30, 'male');

    expect(calculateTdee(80, 180, 30, 'male', 'sedentary')).toBeCloseTo(bmr * 1.2);
  });

  it('applies the moderate multiplier (1.55), the spec default', () => {
    const bmr = calculateBmr(105, 175, 30, 'male');

    expect(calculateTdee(105, 175, 30, 'male', 'moderate')).toBeCloseTo(bmr * 1.55);
  });

  it('applies the very_active multiplier (1.9)', () => {
    const bmr = calculateBmr(70, 170, 25, 'female');

    expect(calculateTdee(70, 170, 25, 'female', 'very_active')).toBeCloseTo(bmr * 1.9);
  });
});
