'use client';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas';

export const useForgotPassword = () => {
  const [queryEmail] = useQueryState('email', { defaultValue: '' });
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: queryEmail ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error(error.message, error);
      toast.error(error.message);
      form.setError('root', {
        message: error.message,
      });
      return;
    }

    setSent(true);
    setSentTo(data.email);
  });

  return {
    form,
    handleSubmit,
    sent,
    sentTo,
  };
};
