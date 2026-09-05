'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { SocialProvider } from '../components/social-auth-buttons';
import { signInSchema, type SignInFormData } from '../schemas';

export const useSignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [callBackUrl] = useQueryState('callbackUrl', { defaultValue: '/dashboard' });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: callBackUrl,
      },
      {
        onError: (ctx) => {
          console.error(ctx.error.message, ctx.error);
          form.setError('root', {
            message: ctx.error.message,
          });
        },
        onSuccess: () => {},
      },
    );
  });

  const handleSocialSignIn = useCallback(
    async (provider: SocialProvider) => {
      await authClient.signIn.social(
        {
          provider,
          callbackURL: callBackUrl,
          errorCallbackURL: '/auth/sign-in/error',
          newUserCallbackURL: '/onboarding',
        },
        {
          onError: (ctx) => {
            console.error(ctx.error.message, ctx.error);
            toast.error(ctx.error.message);
          },
        },
      );
    },
    [callBackUrl],
  );

  const handleForgotPassword = useCallback(() => {
    const email = form.getValues('email').trim();
    router.push(
      email ? `/auth/forgot-password?email=${encodeURIComponent(email)}` : '/auth/forgot-password',
    );
  }, [form, router]);

  return {
    form,
    showPassword,
    setShowPassword,
    handleSubmit,
    handleSocialSignIn,
    handleForgotPassword,
  };
};
