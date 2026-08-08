// Normalizes any date to the Monday of its week (local time, midnight), matching
// docs/firestore-data-model.md section 1.5's `weekOf` convention. Also used by
// is-completed-this-week.ts to detect week boundaries for the completedThisWeek reset.
export function getMondayOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diffToMonday);
  return result;
}
