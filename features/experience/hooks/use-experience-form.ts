'use client';

import { handleError } from '@/utils';
import { useMemo, useState } from 'react';
import { ExperienceFormValues } from '../data';
import { toExperienceFormValues } from '../data/experience/input-mapper';
import { useCreateExperience, useUpdateExperience } from './mutations';
import { useExperience } from './queries';

type UseExperienceFormProps = {
  id?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useExperienceForm = ({ id, onSuccess, onError }: UseExperienceFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useExperience(
    { path: { id: id ?? '' } },
    { enabled: isEditMode },
  );

  const { mutateAsync: createExperience, isPending: isPendingCreate } = useCreateExperience();
  const { mutateAsync: updateExperience, isPending: isPendingUpdate } = useUpdateExperience();

  const handleSubmit = async (values: ExperienceFormValues) => {
    try {
      if (serverError) setServerError(null);
      if (isEditMode) {
        await updateExperience({ path: { id: id ?? '' }, body: values });
      } else {
        await createExperience({ body: values });
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error);
      setServerError(handleError({ error, withToast: true }));
    }
  };

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toExperienceFormValues(data);
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
