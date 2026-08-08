import { useQuery } from '@tanstack/react-query';

import { listMeals } from '@/features/diet/api/meal-plan';

export const mealPlanQueryKey = (uid: string) => ['meal-plan', uid] as const;

export function useMealPlanQuery(uid: string | undefined) {
  return useQuery({
    queryKey: mealPlanQueryKey(uid ?? ''),
    queryFn: () => listMeals(uid ?? ''),
    enabled: Boolean(uid),
  });
}
