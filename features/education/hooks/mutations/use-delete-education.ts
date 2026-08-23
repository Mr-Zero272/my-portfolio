import { Education } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { educationApi, educationQueryKeys } from '../../services';
import { DeleteEducationRequest } from '../../types';

type UseDeleteEducationOptions = Omit<
  UseMutationOptions<Pick<Education, 'id'>, Error, DeleteEducationRequest>,
  'mutationFn'
>;

export const useDeleteEducation = (options?: UseDeleteEducationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: educationApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: educationQueryKeys.lists(), exact: false });
      queryClient.invalidateQueries({
        queryKey: educationQueryKeys.detail({ path: { id: args[1]?.path?.id || '' } }),
      });
      options?.onSuccess?.(...args);
    },
  });
};
