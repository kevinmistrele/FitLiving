import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createExercise,
  deleteExercise,
  setExerciseCompleted,
  updateExercise,
} from '@/features/workouts/api/exercises';
import { exercisesQueryKey } from '@/features/workouts/hooks/use-exercises-query';
import type { WorkoutDayId } from '@/features/workouts/types/workout.types';

// All four mutations write to the same day's exercises subcollection and invalidate the same
// query key, so they're grouped in one file instead of four near-identical ones.
function useInvalidateExercises(uid: string | undefined, dayId: WorkoutDayId) {
  const queryClient = useQueryClient();

  return function invalidate() {
    if (!uid) return;

    void queryClient.invalidateQueries({ queryKey: exercisesQueryKey(uid, dayId) });
  };
}

export function useCreateExerciseMutation(uid: string | undefined, dayId: WorkoutDayId) {
  const invalidate = useInvalidateExercises(uid, dayId);

  return useMutation({ mutationFn: createExercise, onSuccess: invalidate });
}

export function useUpdateExerciseMutation(uid: string | undefined, dayId: WorkoutDayId) {
  const invalidate = useInvalidateExercises(uid, dayId);

  return useMutation({ mutationFn: updateExercise, onSuccess: invalidate });
}

export function useDeleteExerciseMutation(uid: string | undefined, dayId: WorkoutDayId) {
  const invalidate = useInvalidateExercises(uid, dayId);

  return useMutation({ mutationFn: deleteExercise, onSuccess: invalidate });
}

export function useSetExerciseCompletedMutation(uid: string | undefined, dayId: WorkoutDayId) {
  const invalidate = useInvalidateExercises(uid, dayId);

  return useMutation({ mutationFn: setExerciseCompleted, onSuccess: invalidate });
}
