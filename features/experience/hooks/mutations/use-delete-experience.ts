import { Experience } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { experienceApi, experienceQueryKeys } from '../../services';
import { DeleteExperienceRequest } from '../../types';

type UseDeleteExperienceOptions = Omit<
  UseMutationOptions<Pick<Experience, 'id'>, Error, DeleteExperienceRequest, unknown>,
  'mutationFn'
>;

export const useDeleteExperience = (options?: UseDeleteExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteExperienceRequest) => experienceApi.delete(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: experienceQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
