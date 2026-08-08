import { useQueries } from '@tanstack/react-query';

import { listLoadHistory } from '@/features/workouts/api/load-history';
import type { WorkoutDayId } from '@/features/workouts/types/workout.types';

export const loadHistoryQueryKey = (uid: string, dayId: WorkoutDayId, exerciseId: string) =>
  ['load-history', uid, dayId, exerciseId] as const;

// One query per exercise on the selected day (typically a handful), so the exercise list can
// show each exercise's latest logged load and highlight week-over-week progress at a glance —
// docs/project/fitliving-web.md section 3.2.
export function useLoadHistoriesQuery(
  uid: string | undefined,
  dayId: WorkoutDayId,
  exerciseIds: string[],
) {
  return useQueries({
    queries: exerciseIds.map((exerciseId) => ({
      queryKey: loadHistoryQueryKey(uid ?? '', dayId, exerciseId),
      queryFn: () => listLoadHistory(uid ?? '', dayId, exerciseId),
      enabled: Boolean(uid),
    })),
  });
}
