'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import type { AccountInfoFormValues } from '../../schemas';
import type { CurrentUser } from '../use-current-user';

type UseUpdateAccountInfoOptions = Omit<
  UseMutationOptions<CurrentUser | undefined, Error, AccountInfoFormValues>,
  'mutationFn'
>;

/**
 * Updates the signed-in user's `name` / `image` via `authClient.updateUser`.
 * `image` is passed as `null` when cleared so better-auth unsets it.
 */
export const useUpdateAccountInfo = (options?: UseUpdateAccountInfoOptions) =>
  useMutation({
    mutationFn: async (values: AccountInfoFormValues) => {
      const image = values.image.trim();
      const res = await authClient.updateUser({
        name: values.name.trim(),
        image: image ? image : null,
      });
      if (res.error) {
        throw new Error(res.error.message ?? 'Failed to update your account');
      }
      // The client is not server-inferred, so better-auth types `data` loosely.
      return (res.data as unknown as { user?: CurrentUser } | null | undefined)?.user;
    },
    ...options,
  });
