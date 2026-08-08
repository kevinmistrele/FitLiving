import type { ActivityLevel, Sex } from '@/lib/profile';

// Multipliers per docs/firestore-data-model.md section 2.1.
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor basal metabolic rate — docs/firestore-data-model.md section 2.1. The
// constant term differs by sex (+5 for men, -161 for women); everything else is shared.
export function calculateBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  return sex === 'male' ? base + 5 : base - 161;
}

// Total daily energy expenditure = BMR * activity multiplier — docs/firestore-data-model.md
// section 2.1.
export function calculateTdee(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
  activityLevel: ActivityLevel,
): number {
  return calculateBmr(weightKg, heightCm, age, sex) * ACTIVITY_MULTIPLIERS[activityLevel];
}
