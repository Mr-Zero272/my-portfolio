'use client';

import StateUI from '@/components/shared/state-ui';
import { Spinner } from '@/components/ui/spinner';
import { appPath } from '@/constants/path';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { useCallback } from 'react';
import { PostForm } from '../components';
import { usePostForm } from '../hooks';

export const PostFormPage = ({ postId }: { postId?: string }) => {
  const router = useRouter();

  const handleSuccess = useCallback(() => {
    router.push(appPath.admin.post.list);
  }, [router]);

  const { serverError, isEditMode, isLoading, error, initialData, onSubmit, isSubmitting } =
    usePostForm({ id: postId, onSuccess: handleSuccess });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <StateUI
          icon={<Spinner />}
          title="Please wait"
          description="The setup will complete automatically in a few seconds..."
          className="border-none"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <StateUI
          variant="error"
          icon={<TriangleAlert />}
          title="Something went wrong"
          description="Please try again later."
          className="border-none"
        />
      </div>
    );
  }

  return (
    <PostForm
      initialData={initialData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverErrors={serverError ? { root: serverError } : undefined}
      isEditMode={isEditMode}
      context={{
        featureImage: initialData?.featureImage ?? null,
      }}
    />
  );
};
