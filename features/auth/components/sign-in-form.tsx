'use client';

import { GoogleIcon } from '@/components/icons';
import GithubIcon from '@/components/icons/github';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const signInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [callBackUrl] = useQueryState('callbackUrl', { defaultValue: '/admin/dashboard' });
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmitForm = async (data: SignInFormData) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: callBackUrl,
      },
      {
        onError: (ctx) => {
          console.error(ctx.error.message, ctx.error);
          toast.error(ctx.error.message);
          form.setError('root', {
            message: ctx.error.message,
          });
        },
        onSuccess: (res) => {},
      },
    );
  };

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    await authClient.signIn.social(
      {
        provider: provider,
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

  return (
    <form className={cn('flex flex-col gap-6')} onSubmit={form.handleSubmit(handleSubmitForm)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Don&apos;t have an account?{' '}
          <Link className="hover:underline" href="/auth/sign-up">
            Sign up
          </Link>
        </p>
      </div>
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
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
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex-1"
            onClick={() => handleSocialSignIn('google')}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex-1"
            onClick={() => handleSocialSignIn('github')}
          >
            <GithubIcon />
            Github
          </Button>
        </div>
      </div>
      {/* <div className="text-center text-sm">Note: we now support for all users!!!</div> */}
    </form>
  );
};
