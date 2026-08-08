// Highlights week-over-week progress per docs/firestore-data-model.md section 1.5: true only
// when this week's load is strictly greater than the previous entry's. The very first entry
// for an exercise has nothing to compare against, so it is never "increased".
export function calculateIncreasedVsPrevious(
  loadKg: number,
  previousLoadKg: number | null,
): boolean {
  if (previousLoadKg === null) {
    return false;
  }

  return loadKg > previousLoadKg;
}
