'use client';

import { PageHeader } from '@/components/shared/page-header copy';
import StateWrapper from '@/components/shared/state-wrapper';
import { toast } from 'sonner';
import { ProfileForm } from '../components';
import { useProfileForm } from '../hooks';

export const ProfileFormPage = () => {
  const { serverError, isLoading, error, onSubmit, isSubmitting, initialData, originalData } =
    useProfileForm({
      onSuccess: () => {
        toast.success('Profile updated successfully.', {
          description: 'Your profile information has been updated successfully.',
        });
      },
    });

  return (
    <div className="max-w-2xl pb-20">
      <PageHeader title="Profile" description="Update your basic profile information." />
      <StateWrapper data="profile-form-data" isLoading={isLoading} error={error}>
        {() => {
          return (
            <ProfileForm
              initialData={initialData}
              serverErrors={{ root: serverError ?? '' }}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              context={{
                heroImage: originalData?.heroImage ?? undefined,
              }}
            />
          );
        }}
      </StateWrapper>
    </div>
  );
};
