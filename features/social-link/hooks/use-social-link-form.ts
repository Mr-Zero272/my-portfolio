'use client';

import { handleError } from '@/utils';
import { useMemo, useState } from 'react';
import { SocialLinkFormValues, toSocialLinkFormValues } from '../data';
import { useCreateSocialLink, useUpdateSocialLink } from './mutations';
import { useSocialLink } from './queries';

type UseSocialLinkFormProps = {
  id?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useSocialLinkForm = ({ id, onSuccess, onError }: UseSocialLinkFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = !!id && id !== 'new';

  const { data, isLoading, error } = useSocialLink({ path: { id: id ?? '' } }, { enabled: isEditMode });

  const { mutateAsync: createSocialLink, isPending: isPendingCreate } = useCreateSocialLink();
  const { mutateAsync: updateSocialLink, isPending: isPendingUpdate } = useUpdateSocialLink();

  const handleSubmit = async (values: SocialLinkFormValues) => {
    try {
      if (serverError) setServerError(null);
      if (isEditMode) {
        await updateSocialLink({ path: { id: id ?? '' }, body: values });
      } else {
        await createSocialLink({ body: values });
      }
      onSuccess?.();
    } catch (err) {
      onError?.(err as Error);
      setServerError(handleError({ error: err, withToast: true }));
    }
  };

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toSocialLinkFormValues(data);
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
