'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, EyeIcon, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { useResetPassword } from '../hooks';
import { AuthHeader } from './auth-header';

export const ResetPasswordForm = () => {
  const { form, showPassword, setShowPassword, handleSubmit, invalid } = useResetPassword();

  if (invalid) {
    return (
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="Invalid reset link"
          subtitle={
            <>
              This password reset link is invalid or has expired. Please request a new one to
              continue.
            </>
          }
        />
        <Link
          href="/auth/forgot-password"
          className={buttonVariants({ className: 'w-full' })}
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form className={cn('flex flex-col gap-6')} onSubmit={handleSubmit}>
      <AuthHeader
        title="Reset your password"
        subtitle={
          <>
            Enter a new password below. You can then use it to sign in to your account.
          </>
        }
      />

      <div className="grid gap-6">
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  data-error={fieldState.invalid}
                  {...field}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  data-error={fieldState.invalid}
                  {...field}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-center text-sm">
          <KeyRound className="size-4" />
          <span>
            Password must be at least 6 characters and include uppercase, lowercase and a number.
          </span>
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Resetting...' : 'Reset password'}
        </Button>
        <Link
          href="/auth/sign-in"
          className={buttonVariants({ variant: 'link', className: 'w-full' })}
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
};
