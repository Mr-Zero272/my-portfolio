'use client';

import { BadgeCheck, Mail, Send } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useSendVerificationEmail } from '../hooks';

type EmailVerificationCardProps = {
  email: string;
  emailVerified: boolean;
};

export const EmailVerificationCard = ({ email, emailVerified }: EmailVerificationCardProps) => {
  const { mutate, isPending, isSuccess, reset } = useSendVerificationEmail({
    onSuccess: () => {
      toast.success('Verification email sent', {
        description: `Check ${email} and click the link inside.`,
      });
    },
    onError: (error) => {
      toast.error('Could not send verification email', {
        description: error.message,
      });
    },
  });

  const handleSend = useCallback(() => {
    reset();
    mutate({ email });
  }, [email, mutate, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-4" />
          Email address
        </CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
        {emailVerified ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-success">
            <BadgeCheck className="size-4" />
            Your email is verified.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Your email is not verified yet. We&apos;ll send a link to{' '}
              <span className="font-medium text-foreground">{email}</span> to confirm it.
            </p>
            <div className="flex items-center gap-3">
              <Button type="button" onClick={handleSend} disabled={isPending || isSuccess}>
                {isPending ? <Spinner /> : <Send />}
                {isPending
                  ? 'Sending...'
                  : isSuccess
                    ? 'Verification email sent'
                    : 'Send verification email'}
              </Button>
              {isSuccess && (
                <span className="text-xs text-muted-foreground">Resend to get a new link.</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
