import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createLoadEntry } from '@/features/workouts/api/load-history';
import { loadHistoryQueryKey } from '@/features/workouts/hooks/use-load-histories-query';
import type { WorkoutDayId } from '@/features/workouts/types/workout.types';

export function useCreateLoadEntryMutation(uid: string | undefined, dayId: WorkoutDayId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoadEntry,
    onSuccess: (_loadEntry, variables) => {
      if (!uid) return;

      void queryClient.invalidateQueries({
        queryKey: loadHistoryQueryKey(uid, dayId, variables.exerciseId),
      });
    },
  });
}
