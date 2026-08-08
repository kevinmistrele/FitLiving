import { useQuery } from '@tanstack/react-query';

import { getOrCreateWorkoutDays } from '@/features/workouts/api/workout-days';

export const workoutDaysQueryKey = (uid: string) => ['workout-days', uid] as const;

export function useWorkoutDaysQuery(uid: string | undefined) {
  return useQuery({
    queryKey: workoutDaysQueryKey(uid ?? ''),
    queryFn: () => getOrCreateWorkoutDays(uid ?? ''),
    enabled: Boolean(uid),
  });
}
