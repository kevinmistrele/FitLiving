// Progress toward the comfortable November goal, per docs/firestore-data-model.md section
// 5.3: (initialWeightKg - currentWeightKg) / (initialWeightKg - goalWeightKg), clamped 0-100.
export function calculateGoalProgressPercentage(
  initialWeightKg: number,
  currentWeightKg: number,
  goalWeightKg: number,
): number {
  const totalDistanceKg = initialWeightKg - goalWeightKg;

  if (totalDistanceKg <= 0) {
    return currentWeightKg <= goalWeightKg ? 100 : 0;
  }

  const progressKg = initialWeightKg - currentWeightKg;
  const percentage = (progressKg / totalDistanceKg) * 100;

  return Math.min(100, Math.max(0, percentage));
}
