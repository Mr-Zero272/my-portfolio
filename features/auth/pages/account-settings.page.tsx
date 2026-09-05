'use client';

import { useQueryState } from 'nuqs';
import { Suspense, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import {
  AccountInfoForm,
  ConnectedAccountsCard,
  EmailVerificationCard,
} from '../components';
import { useCurrentUser } from '../hooks';
import { useUpdateAccountInfo } from '../hooks/mutations';
import type { AccountInfoFormValues } from '../schemas';

const AccountSettingsContent = () => {
  const { user, isLoading, refetch } = useCurrentUser();
  const [emailVerifiedFlag, setEmailVerifiedFlag] = useQueryState('emailVerified');

  // Better Auth redirects here (?emailVerified=1) after the email link is clicked.
  useEffect(() => {
    if (emailVerifiedFlag === '1') {
      toast.success('Email verified', {
        description: 'Your email has been verified successfully.',
      });
      void refetch();
      void setEmailVerifiedFlag(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailVerifiedFlag]);

  const { mutateAsync: updateAccountInfo, isPending } = useUpdateAccountInfo({
    onSuccess: () => {
      void refetch();
      toast.success('Account updated', {
        description: 'Your profile information has been updated.',
      });
    },
    onError: (error) => {
      toast.error('Could not update account', {
        description: error.message,
      });
    },
  });

  const handleSubmit = useCallback(
    (values: AccountInfoFormValues) => {
      void updateAccountInfo(values);
    },
    [updateAccountInfo],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl pb-20">
      <PageHeader
        title="Account"
        description="Manage your name, avatar, email verification and connected sign-in methods."
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
            <CardDescription>
              How you appear across the dashboard. Your email cannot be changed here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountInfoForm
              initialData={{ name: user.name ?? '', image: user.image ?? '' }}
              isSubmitting={isPending}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <EmailVerificationCard email={user.email} emailVerified={user.emailVerified} />

        <ConnectedAccountsCard />
      </div>
    </div>
  );
};

export const AccountSettingsPage = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    }
  >
    <AccountSettingsContent />
  </Suspense>
);
