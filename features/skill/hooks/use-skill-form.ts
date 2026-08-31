'use client';

import { handleError } from '@/utils';
import { useMemo, useState } from 'react';
import { SkillFormValues } from '../data';
import { toSkillFormValues } from '../data/skill/input-mapper';
import { useCreateSkill, useUpdateSkill } from '../hooks/mutations';
import { useSkill } from './queries';

type UseSkillFormProps = {
  id?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useSkillForm = ({ id, onSuccess, onError }: UseSkillFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useSkill({ path: { id: id ?? '' } }, { enabled: isEditMode });

  const { mutateAsync: createSkill, isPending: isPendingCreate } = useCreateSkill();
  const { mutateAsync: updateSkill, isPending: isPendingUpdate } = useUpdateSkill();

  const handleSubmit = async (values: SkillFormValues) => {
    try {
      if (serverError) setServerError(null);
      if (isEditMode) {
        await updateSkill({ path: { id: id ?? '' }, body: values });
      } else {
        await createSkill({ body: values });
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
      setServerError(handleError({ error, withToast: true }));
    }
  };

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toSkillFormValues(data);
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
