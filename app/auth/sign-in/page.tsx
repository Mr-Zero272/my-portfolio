import { SignInForm } from '@/features/auth/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Welcome back! Please enter your details to sign in to your account.',
};

export default function SignInPage() {
  return <SignInForm />;
}
