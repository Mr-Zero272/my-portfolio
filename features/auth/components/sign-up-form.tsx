'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { useSignUp } from '../hooks';
import { AuthHeader } from './auth-header';
import { SocialAuthButtons } from './social-auth-buttons';

export const SignUpForm = () => {
  const { form, showPassword, setShowPassword, handleSubmit, handleSocialSignIn } = useSignUp();

  return (
    <form className={cn('flex flex-col gap-6')} onSubmit={handleSubmit}>
      <AuthHeader
        title="Sign up"
        subtitle={
          <>
            Back to Sign in?{' '}
            <Link className="hover:underline" href="/auth/sign-in">
              Click here
            </Link>
          </>
        }
      />
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
          name="name"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter your name"
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
          {form.formState.isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>
        <SocialAuthButtons onProviderClick={handleSocialSignIn} />
      </div>
    </form>
  );
};
