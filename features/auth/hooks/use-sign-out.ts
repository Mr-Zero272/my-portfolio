'use client';

import { authClient } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useSignout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await authClient.signOut();
      await queryClient.clear(); // clear react-query cache after logout

      if (data?.success) {
        toast.success('Logout successfully');
      }

      if (error) {
        toast.error('Logout failed');
      }
      router.push(`/auth/sign-in?callbackUrl=${pathname}`); // redirect to sign-in page
    } catch (error) {
      console.log('Logout error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Logout failed');
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, router, queryClient]);

  return {
    handleSignOut,
    loading,
  };
};
