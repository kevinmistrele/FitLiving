import { getMondayOfWeek } from '@/features/workouts/utils/get-monday-of-week';

// No scheduled job resets completedThisWeek — the UI derives it instead, per
// docs/firestore-data-model.md section 1.4: if lastCompletedAt falls in a week before the
// current one, treat the exercise as not completed even though the raw field may still be
// true in Firestore.
export function isCompletedThisWeek(
  completedThisWeek: boolean,
  lastCompletedAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (!completedThisWeek || !lastCompletedAt) {
    return false;
  }

  return getMondayOfWeek(lastCompletedAt).getTime() === getMondayOfWeek(now).getTime();
}
