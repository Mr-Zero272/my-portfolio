'use client';

import { handleError } from '@/utils';
import { useMemo, useState } from 'react';
import { EducationFormValues, toEducationFormValue } from '../data';
import { useCreateEducation, useUpdateEducation } from './mutations';
import { useEducation } from './queries';

type UseEducationFomProps = {
  id?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useEducationForm = ({ id, onSuccess, onError }: UseEducationFomProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useEducation(
    { path: { id: id ?? '' } },
    { enabled: isEditMode },
  );

  const { mutateAsync: createEducation, isPending: isPendingCreate } = useCreateEducation();
  const { mutateAsync: updateEducation, isPending: isPendingUpdate } = useUpdateEducation();

  const handleSubmit = async (values: EducationFormValues) => {
    try {
      if (serverError) setServerError(null);
      if (isEditMode) {
        await updateEducation({ path: { id: id ?? '' }, body: values });
      } else {
        await createEducation({ body: values });
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error);
      setServerError(handleError({ error, withToast: true }));
    }
  };

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toEducationFormValue(data);
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
