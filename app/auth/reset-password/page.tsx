import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
