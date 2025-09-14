'use client';

import { Github } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmitForm = async (data: SignInFormData) => {
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: searchParams.get('callbackUrl') || '/',
      });

      if (res?.ok && !res?.error) {
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
      } else {
        console.log('SignIn response:', res);
        toast.error('Login failed. Please check your credentials and try again.');
        form.setError('email', { message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form className={cn('flex flex-col gap-6')} onSubmit={form.handleSubmit(handleSubmitForm)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Enter your password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <AnimatedButton type="submit" className="w-full cursor-pointer" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </AnimatedButton>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Github />
            Login with GitHub
          </AnimatedButton>
        </div>
        <div className="text-center text-sm">Note: we only support login with admin account</div>
      </form>
    </Form>
  );
}
