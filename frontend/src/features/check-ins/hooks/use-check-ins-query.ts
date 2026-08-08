import { useQuery } from '@tanstack/react-query';

import { listCheckIns } from '@/features/check-ins/api/list-check-ins';

export const checkInsQueryKey = (uid: string) => ['check-ins', uid] as const;

export function useCheckInsQuery(uid: string | undefined) {
  return useQuery({
    queryKey: checkInsQueryKey(uid ?? ''),
    queryFn: () => listCheckIns(uid ?? ''),
    enabled: Boolean(uid),
  });
}
