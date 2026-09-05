import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Request a password reset link for your account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
