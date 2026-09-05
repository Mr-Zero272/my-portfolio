'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { sessionQueryKeys } from '../queries/use-list-sessions';

type UseRevokeOtherSessionsOptions = Omit<
  UseMutationOptions<{ status: boolean }, Error, void>,
  'mutationFn'
>;

/** Signs out every session except the current one. */
export const useRevokeOtherSessions = (options?: UseRevokeOtherSessionsOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await authClient.revokeOtherSessions();
      if (res.error) {
        throw new Error(res.error.message ?? 'Failed to sign out other sessions');
      }
      return { status: true };
    },
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
