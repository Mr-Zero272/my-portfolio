import { Education } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { educationApi, educationQueryKeys } from '../../services';
import { CreateEducationRequest } from '../../types';

type UseCreateEducationOptions = Omit<
  UseMutationOptions<Education, Error, CreateEducationRequest, unknown>,
  'mutationFn'
>;

export const useCreateEducation = (options?: UseCreateEducationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEducationRequest) => educationApi.create(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: educationQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
