import type { DietDeficitLevel } from '@/lib/profile';

// Fixed kcal/day deficits (not percentages) per docs/firestore-data-model.md section 2.2.
const DEFICIT_KCAL: Record<DietDeficitLevel, number> = {
  mild: 250,
  moderate: 500,
  aggressive: 750,
};

// Daily calorie target = TDEE - deficit, floored at BMR * 1.0 so the app never recommends a
// deficit deep enough to sit below basal metabolic rate — docs/firestore-data-model.md
// section 2.2. When the raw calculation falls below the floor, it's rounded up to the BMR
// itself rather than the (lower) raw value.
export function calculateTargetCalories(
  tdeeKcal: number,
  bmrKcal: number,
  dietDeficitLevel: DietDeficitLevel,
): number {
  const rawTargetKcal = tdeeKcal - DEFICIT_KCAL[dietDeficitLevel];

  return Math.max(rawTargetKcal, bmrKcal);
}
