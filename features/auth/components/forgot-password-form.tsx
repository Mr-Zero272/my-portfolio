'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { useForgotPassword } from '../hooks';
import { AuthHeader } from './auth-header';

export const ForgotPasswordForm = () => {
  const { form, handleSubmit, sent, sentTo } = useForgotPassword();

  return (
    <form className={cn('flex flex-col gap-6')} onSubmit={handleSubmit}>
      <AuthHeader
        title="Forgot password?"
        subtitle={
          <>
            No worries, we&apos;ll send you reset instructions.{' '}
            <Link className="hover:underline" href="/auth/sign-in">
              Back to sign in
            </Link>
          </>
        }
      />

      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <MailCheck className="size-10 text-emerald-500" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-muted-foreground text-sm text-balance">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-foreground">{sentTo}</span>. Follow the
              instructions in the email to reset your password.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  data-error={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </div>
      )}
    </form>
  );
};
