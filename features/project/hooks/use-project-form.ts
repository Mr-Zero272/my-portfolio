'use client';

import { handleError } from '@/utils';
import { useMemo, useState } from 'react';
import { ProjectFormValues, toProjectFormValues } from '../data';
import { useCreateProject, useUpdateProject } from './mutations';
import { useProject } from './queries';

type UseProjectFormProps = {
  id?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useProjectForm = ({ id, onSuccess, onError }: UseProjectFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useProject(
    { path: { id: id ?? '' } },
    { enabled: isEditMode },
  );

  const { mutateAsync: createProject, isPending: isPendingCreate } = useCreateProject();
  const { mutateAsync: updateProject, isPending: isPendingUpdate } = useUpdateProject();

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      if (serverError) setServerError(null);
      if (isEditMode) {
        await updateProject({ path: { id: id ?? '' }, body: values });
      } else {
        await createProject({ body: values });
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error);
      setServerError(handleError({ error, withToast: true }));
    }
  };

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toProjectFormValues(data);
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
