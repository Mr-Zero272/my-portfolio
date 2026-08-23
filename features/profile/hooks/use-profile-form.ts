import { handleError } from '@/utils';
import { useCallback, useMemo, useState } from 'react';
import { ProfileFormValues, toProfileFormValue } from '../data';
import { useUpdateProfile } from './mutations';
import { useProfileMe } from './queries';

type UseProfileFormProps = {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
};

export const useProfileForm = (props?: UseProfileFormProps) => {
  const { onSuccess, onError } = props ?? {};
  const [serverError, setServerError] = useState<string | null>(null);

  const { data, isLoading, error } = useProfileMe();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const handleSubmit = useCallback(
    async (values: ProfileFormValues) => {
      try {
        if (serverError) setServerError(null);

        await updateProfile({ body: values });

        onSuccess?.();
      } catch (error) {
        onError?.(error);
        setServerError(handleError({ error, withToast: true }));
      }
    },
    [onError, onSuccess, serverError, updateProfile],
  );

  const initialData = useMemo(() => {
    if (!data) return undefined;
    return toProfileFormValue(data);
  }, [data]);

  return {
    serverError,
    isLoading,
    error,
    onSubmit: handleSubmit,
    isSubmitting: isPending,
    initialData,
    originalData: data,
  };
};
