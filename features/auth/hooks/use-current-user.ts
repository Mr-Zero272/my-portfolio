'use client';

import { authClient } from '@/lib/auth-client';

/**
 * Reads the currently signed-in user from the better-auth session.
 *
 * NOTE: must use the SAME `authClient` instance as the header/NavUser so that
 * `refetch()` here refreshes the avatar/name shown in the dashboard sidebar.
 */
export const useCurrentUser = () => {
  const session = authClient.useSession();

  return {
    user: session.data?.user,
    isLoading: session.isPending,
    error: session.error,
    refetch: session.refetch,
  };
};

export type CurrentUser = NonNullable<
  NonNullable<ReturnType<typeof authClient.useSession>['data']>['user']
>;
