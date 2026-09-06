import { Education } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { educationApi, educationQueryKeys } from '../../services';
import { UpdateEducationRequest } from '../../types';

type UseUpdateEducationOptions = Omit<
  UseMutationOptions<Education, Error, UpdateEducationRequest, unknown>,
  'mutationFn'
>;

export const useUpdateEducation = (options?: UseUpdateEducationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateEducationRequest) => educationApi.update(request),
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
