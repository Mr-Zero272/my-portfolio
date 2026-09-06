import { Experience } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { experienceApi, experienceQueryKeys } from '../../services';
import { UpdateExperienceRequest } from '../../types';

type UseUpdateExperienceOptions = Omit<
  UseMutationOptions<Experience, Error, UpdateExperienceRequest, unknown>,
  'mutationFn'
>;

export const useUpdateExperience = (options?: UseUpdateExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateExperienceRequest) => experienceApi.update(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: experienceQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
