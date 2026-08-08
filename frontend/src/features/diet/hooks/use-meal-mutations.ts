import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMeal, deleteMeal, updateMeal } from '@/features/diet/api/meal-plan';
import { mealPlanQueryKey } from '@/features/diet/hooks/use-meal-plan-query';

// All three mutations write to the same mealPlan subcollection and invalidate the same query
// key, so they're grouped in one file instead of three near-identical ones (same pattern as
// workouts' use-exercise-mutations.ts).
function useInvalidateMealPlan(uid: string | undefined) {
  const queryClient = useQueryClient();

  return function invalidate() {
    if (!uid) return;

    void queryClient.invalidateQueries({ queryKey: mealPlanQueryKey(uid) });
  };
}

export function useCreateMealMutation(uid: string | undefined) {
  const invalidate = useInvalidateMealPlan(uid);

  return useMutation({ mutationFn: createMeal, onSuccess: invalidate });
}

export function useUpdateMealMutation(uid: string | undefined) {
  const invalidate = useInvalidateMealPlan(uid);

  return useMutation({ mutationFn: updateMeal, onSuccess: invalidate });
}

export function useDeleteMealMutation(uid: string | undefined) {
  const invalidate = useInvalidateMealPlan(uid);

  return useMutation({ mutationFn: deleteMeal, onSuccess: invalidate });
}
