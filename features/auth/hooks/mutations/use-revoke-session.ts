'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { sessionQueryKeys } from '../queries/use-list-sessions';

type UseRevokeSessionOptions = Omit<
  UseMutationOptions<{ status: boolean }, Error, { token: string }>,
  'mutationFn'
>;

/** Revokes a single session by its `token`. */
export const useRevokeSession = (options?: UseRevokeSessionOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const res = await authClient.revokeSession({ token });
      if (res.error) {
        throw new Error(res.error.message ?? 'Failed to revoke this session');
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
