'use client';

import { handleError } from '@/utils';
import { useCallback, useMemo, useState } from 'react';
import { toPostFormValue } from '../data';
import { PostFormValues } from '../schemas';
import { useCreatePost, useUpdatePost } from './mutations';
import { usePost } from './queries';

type UsePostFormProps = {
  id?: string;

  // callbacks
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const usePostForm = ({ id, onSuccess, onError }: UsePostFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = usePost(
    {
      path: { id: id ?? '' },
    },
    { enabled: isEditMode },
  );

  const { mutateAsync: createPost, isPending: isPendingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isPendingUpdate } = useUpdatePost();

  const handleSubmit = useCallback(
    async (values: PostFormValues) => {
      try {
        if (serverError) setServerError(null);
        if (isEditMode) {
          await updatePost({ path: { id: id }, body: values });
        } else {
          await createPost({ body: values });
        }
        onSuccess?.();
      } catch (error) {
        onError?.(error);
        setServerError(handleError({ error, withToast: true }));
      }
    },
    [serverError, createPost, id, isEditMode, onError, onSuccess, updatePost],
  );

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toPostFormValue(data);
  }, [data]);

  return {
    serverError,
    isEditMode,
    isLoading,
    error,
    initialData,
    onSubmit: handleSubmit,
    isSubmitting: isPendingCreate || isPendingUpdate,
    originalData: data,
  };
};
