import { calculateBmi } from '@/features/diet/utils/calculate-bmi';
import { calculateMacros } from '@/features/diet/utils/calculate-macros';
import { calculateTargetCalories } from '@/features/diet/utils/calculate-target-calories';
import { calculateBmr, calculateTdee } from '@/features/diet/utils/calculate-tdee';
import type { ActivityLevel, DietDeficitLevel, Sex } from '@/lib/profile';

export interface CalculateDietGoalsInput {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  dietDeficitLevel: DietDeficitLevel;
}

export interface DietGoals {
  bmrKcal: number;
  tdeeKcal: number;
  targetCalKcal: number;
  bmi: number;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  proteinG: number;
  proteinKcal: number;
  carbsG: number;
  carbsKcal: number;
  fatG: number;
  fatKcal: number;
  isCarbsBudgetTooLow: boolean;
  calculatedFromWeightKg: number;
}

// Composes calculate-bmr/tdee/target-calories/bmi/macros (docs/firestore-data-model.md
// section 2, in full) into the set of numbers the diet screen renders. Never persisted —
// docs/firestore-data-model.md section 1.6 calls for recomputing this in memory from
// profile/main on every render so it can never drift out of sync with a new check-in weight
// or an edited profile field (docs/project/fitliving-web.md section 4.1).
export function calculateDietGoals(input: CalculateDietGoalsInput): DietGoals {
  const { weightKg, heightCm, age, sex, activityLevel, dietDeficitLevel } = input;

  const bmrKcal = calculateBmr(weightKg, heightCm, age, sex);
  const tdeeKcal = calculateTdee(weightKg, heightCm, age, sex, activityLevel);
  const targetCalKcal = calculateTargetCalories(tdeeKcal, bmrKcal, dietDeficitLevel);
  const { bmi, healthyWeightMinKg, healthyWeightMaxKg } = calculateBmi(weightKg, heightCm);
  const macros = calculateMacros(weightKg, targetCalKcal);

  return {
    bmrKcal,
    tdeeKcal,
    targetCalKcal,
    bmi,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    ...macros,
    calculatedFromWeightKg: weightKg,
  };
}
