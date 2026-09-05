'use client';

import { authClient } from '@/lib/auth-client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type SendVerificationEmailInput = {
  email: string;
};

type UseSendVerificationEmailOptions = Omit<
  UseMutationOptions<{ status: boolean }, Error, SendVerificationEmailInput>,
  'mutationFn'
>;

/** After verifying, better-auth redirects here and the page shows a toast. */
export const VERIFY_EMAIL_CALLBACK_URL = '/settings/account?emailVerified=1';

/** Sends the better-auth email verification link to the current user's email. */
export const useSendVerificationEmail = (options?: UseSendVerificationEmailOptions) =>
  useMutation({
    mutationFn: async ({ email }: SendVerificationEmailInput) => {
      const res = await authClient.sendVerificationEmail({
        email,
        callbackURL: VERIFY_EMAIL_CALLBACK_URL,
      });
      if (res.error) {
        throw new Error(res.error.message ?? 'Failed to send the verification email');
      }
      return { status: true };
    },
    ...options,
  });
