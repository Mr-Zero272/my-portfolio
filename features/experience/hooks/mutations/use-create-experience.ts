import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Experience } from '../../../../lib/generated/prisma/client';
import { experienceApi, experienceQueryKeys } from '../../services';
import { CreateExperienceRequest } from '../../types';

type UseCreateExperienceOptions = Omit<
  UseMutationOptions<Experience, Error, CreateExperienceRequest, unknown>,
  'mutationFn'
>;

export const useCreateExperience = (options?: UseCreateExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExperienceRequest) => experienceApi.create(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: experienceQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
