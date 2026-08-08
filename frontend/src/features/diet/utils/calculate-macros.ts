export interface MacroTargets {
  proteinG: number;
  proteinKcal: number;
  fatG: number;
  fatKcal: number;
  carbsG: number;
  carbsKcal: number;
  // True when the calorie budget is too low for the protein + fat floors, meaning carbs had
  // to be clamped at 0 instead of the (negative) raw calculation — docs/firestore-data-model.md
  // section 2.4's note to signal this in the UI.
  isCarbsBudgetTooLow: boolean;
}

// Macro distribution prioritizing protein — docs/firestore-data-model.md section 2.4. Order
// matters: protein first (2.0 g/kg), then fat as a floor (0.8 g/kg), then carbs fill whatever
// calorie budget remains, never negative.
export function calculateMacros(weightKg: number, targetCalKcal: number): MacroTargets {
  const proteinG = 2.0 * weightKg;
  const proteinKcal = proteinG * 4;

  const fatG = 0.8 * weightKg;
  const fatKcal = fatG * 9;

  const rawCarbsKcal = targetCalKcal - proteinKcal - fatKcal;
  const carbsKcal = Math.max(rawCarbsKcal, 0);
  const carbsG = carbsKcal / 4;

  return {
    proteinG,
    proteinKcal,
    fatG,
    fatKcal,
    carbsG,
    carbsKcal,
    isCarbsBudgetTooLow: rawCarbsKcal < 0,
  };
}
