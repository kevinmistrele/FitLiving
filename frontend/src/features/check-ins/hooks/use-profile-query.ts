import { useQuery } from '@tanstack/react-query';

import { getOrCreateProfile } from '@/lib/profile';

export const profileQueryKey = (uid: string) => ['profile', uid] as const;

export function useProfileQuery(uid: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(uid ?? ''),
    queryFn: () => getOrCreateProfile(uid ?? ''),
    enabled: Boolean(uid),
  });
}
