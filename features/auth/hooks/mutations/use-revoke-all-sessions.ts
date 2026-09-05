'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type UseRevokeAllSessionsOptions = Omit<
  UseMutationOptions<{ status: boolean }, Error, void>,
  'mutationFn'
>;

/**
 * Signs out EVERY session, including the current device. The caller is
 * expected to clear the client state and redirect to sign-in afterwards.
 */
export const useRevokeAllSessions = (options?: UseRevokeAllSessionsOptions) =>
  useMutation({
    mutationFn: async () => {
      const res = await authClient.revokeSessions();
      if (res.error) {
        throw new Error(res.error.message ?? 'Failed to sign out all sessions');
      }
      return { status: true };
    },
    ...options,
  });
