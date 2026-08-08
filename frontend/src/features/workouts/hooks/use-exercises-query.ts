import { useQuery } from '@tanstack/react-query';

import { listExercises } from '@/features/workouts/api/exercises';
import type { WorkoutDayId } from '@/features/workouts/types/workout.types';

export const exercisesQueryKey = (uid: string, dayId: WorkoutDayId) =>
  ['exercises', uid, dayId] as const;

export function useExercisesQuery(uid: string | undefined, dayId: WorkoutDayId) {
  return useQuery({
    queryKey: exercisesQueryKey(uid ?? '', dayId),
    queryFn: () => listExercises(uid ?? '', dayId),
    enabled: Boolean(uid),
  });
}
