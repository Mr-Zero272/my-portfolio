'use client';

import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

export type SessionItem = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const sessionQueryKeys = {
  all: ['auth', 'session'] as const,
};

/** Lists every active session of the signed-in user. */
export const useListSessions = () =>
  useQuery({
    queryKey: sessionQueryKeys.all,
    queryFn: async (): Promise<SessionItem[]> => {
      const { data, error } = await authClient.listSessions();
      if (error) throw error;
      return (data ?? []) as SessionItem[];
    },
  });
