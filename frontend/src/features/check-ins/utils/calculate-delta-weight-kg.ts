// Delta vs. the previous check-in, per docs/firestore-data-model.md section 1.2:
// the very first check-in has no previous entry, so it falls back to the profile's
// initialWeightKg as the "week zero" reference weight.
export function calculateDeltaWeightKg(
  newWeightKg: number,
  previousWeightKg: number | null,
  initialWeightKg: number,
): number {
  const referenceWeightKg = previousWeightKg ?? initialWeightKg;

  return newWeightKg - referenceWeightKg;
}
