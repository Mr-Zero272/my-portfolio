'use client';

import { useRouter } from 'nextjs-toploader/app';
import { useCallback } from 'react';
import { PostForm } from '../components';
import { usePostForm } from '../hooks';

export const PostFormPage = ({ postId }: { postId?: string }) => {
  const router = useRouter();

  const handleSuccess = useCallback(() => {
    router.back();
  }, [router]);

  const { serverError, isEditMode, isLoading, error, initialData, onSubmit, isSubmitting } =
    usePostForm({ id: postId, onSuccess: handleSuccess });

  return (
    <PostForm
      initialData={initialData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      serverErrors={serverError ? { root: serverError } : undefined}
      isEditMode={isEditMode}
      // isLoading={isLoading}
      // error={error}
    />
  );
};
