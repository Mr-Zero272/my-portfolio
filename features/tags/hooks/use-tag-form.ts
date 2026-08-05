'use client';

import { handleError } from '@/utils';
import { useCallback, useMemo, useState } from 'react';
import { toTagFormValue } from '../data';
import { TagFormValues } from '../schemas';
import { useCreateTag, useUpdateTag } from './mutations';
import { useTag } from './queries';

type UseTagFormProps = {
  id?: string;

  // callbacks
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useTagForm = ({ id, onSuccess, onError }: UseTagFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useTag(
    {
      path: { id: id ?? '' },
    },
    { enabled: isEditMode },
  );

  console.log({
    data,
  });

  const { mutateAsync: createTag, isPending: isPendingCreate } = useCreateTag();
  const { mutateAsync: updateTag, isPending: isPendingUpdate } = useUpdateTag();

  const handleSubmit = useCallback(
    async (values: TagFormValues) => {
      try {
        if (serverError) setServerError(null);
        if (isEditMode) {
          await updateTag({ path: { id: id }, body: values });
        } else {
          await createTag({ body: values });
        }
        onSuccess?.();
      } catch (error) {
        onError?.(error);
        setServerError(handleError({ error, withToast: true }));
      }
    },
    [serverError, createTag, id, isEditMode, onError, onSuccess, updateTag],
  );

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toTagFormValue(data);
  }, [data]);

  return {
    serverError,
    isEditMode,
    isLoading,
    error,
    initialData,
    onSubmit: handleSubmit,
    isSubmitting: isPendingCreate || isPendingUpdate,
  };
};
