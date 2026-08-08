import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCheckIn } from '@/features/check-ins/api/create-check-in';
import { checkInsQueryKey } from '@/features/check-ins/hooks/use-check-ins-query';
import { profileQueryKey } from '@/features/check-ins/hooks/use-profile-query';

export function useCreateCheckInMutation(uid: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      if (!uid) return;

      void queryClient.invalidateQueries({ queryKey: checkInsQueryKey(uid) });
      void queryClient.invalidateQueries({ queryKey: profileQueryKey(uid) });
    },
  });
}
