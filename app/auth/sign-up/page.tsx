import { SignUpScreen } from '@/features/auth/screens';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account to get started.',
};

export default function SignUpPage() {
  return <SignUpScreen />;
}
