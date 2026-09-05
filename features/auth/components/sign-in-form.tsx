'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, EyeIcon, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSignIn } from '../hooks';
import { AuthHeader } from './auth-header';
import { SocialAuthButtons } from './social-auth-buttons';

export const SignInForm = () => {
  const {
    form,
    showPassword,
    setShowPassword,
    handleSubmit,
    handleSocialSignIn,
    handleForgotPassword,
  } = useSignIn();

  return (
    <form className={cn('flex flex-col gap-6')} onSubmit={handleSubmit}>
      <AuthHeader
        title="Sign in"
        subtitle={
          <>
            Don&apos;t have an account?{' '}
            <Link className="hover:underline" href="/auth/sign-up">
              Sign up
            </Link>
          </>
        }
      />
      {form.formState.errors.root && (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Failed to sign in</AlertTitle>
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="Enter your email"
                data-error={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={buttonVariants({ size: 'sm', variant: 'link' })}
                >
                  Forgot password?
                </button>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
        <SocialAuthButtons onProviderClick={handleSocialSignIn} />
      </div>
    </form>
  );
};
