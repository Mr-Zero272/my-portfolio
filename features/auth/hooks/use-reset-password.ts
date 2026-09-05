'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';

export const useResetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [token] = useQueryState('token', { defaultValue: '' });
  const [errorParam] = useQueryState('error');
  const invalid = !token || Boolean(errorParam);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const { error } = await authClient.resetPassword({
      token,
      newPassword: data.password,
    });

    if (error) {
      console.error(error.message, error);
      toast.error(error.message);
      form.setError('root', {
        message: error.message,
      });
      return;
    }

    toast.success('Your password has been reset successfully');
    router.push('/auth/sign-in');
  });

  return {
    form,
    showPassword,
    setShowPassword,
    handleSubmit,
    invalid,
  };
};
