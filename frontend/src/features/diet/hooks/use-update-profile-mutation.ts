import { useMutation, useQueryClient } from '@tanstack/react-query';

import { profileQueryKey } from '@/lib/profile';
import { updateProfile, type ProfileUpdate } from '@/lib/profile';

export interface UpdateProfileParams {
  uid: string;
  payload: ProfileUpdate;
}

function updateProfileRequest(params: UpdateProfileParams): Promise<void> {
  return updateProfile(params.uid, params.payload);
}

// Saves the metas base fields (heightCm/age/sex/activityLevel/dietDeficitLevel) —
// docs/project/fitliving-web.md section 4.1. Invalidating ['profile', uid] here refetches the
// same query check-ins reads/writes, so a saved edit here is reflected there too.
export function useUpdateProfileMutation(uid: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: () => {
      if (!uid) return;

      void queryClient.invalidateQueries({ queryKey: profileQueryKey(uid) });
    },
  });
}
