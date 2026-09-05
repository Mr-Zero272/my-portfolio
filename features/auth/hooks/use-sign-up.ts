'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { SocialProvider } from '../components/social-auth-buttons';
import { signUpSchema, type SignUpFormData } from '../schemas';

export const useSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [callBackUrl] = useQueryState('callbackUrl', { defaultValue: '/admin/dashboard' });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await authClient.signUp.email(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: '/onboarding',
      },
      {
        onError: (ctx) => {
          console.error(ctx.error.message, ctx.error);
          toast.error(ctx.error.message);
          form.setError('root', {
            message: ctx.error.message,
          });
        },
      },
    );
  });

  const handleSocialSignIn = async (provider: SocialProvider) => {
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
  };

  return {
    form,
    showPassword,
    setShowPassword,
    handleSubmit,
    handleSocialSignIn,
  };
};
