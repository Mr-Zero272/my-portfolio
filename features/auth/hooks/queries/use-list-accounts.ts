'use client';

import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

export type LinkedAccount = {
  id: string;
  providerId: string;
  accountId?: string;
  issuer?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const accountQueryKeys = {
  all: ['auth', 'account'] as const,
};

/** Lists the auth methods (accounts) linked to the current user, read-only. */
export const useListAccounts = () =>
  useQuery({
    queryKey: accountQueryKeys.all,
    queryFn: async (): Promise<LinkedAccount[]> => {
      const { data, error } = await authClient.listAccounts();
      if (error) throw error;
      return (data ?? []) as LinkedAccount[];
    },
  });
