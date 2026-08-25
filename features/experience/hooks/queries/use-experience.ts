import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { experienceApi, experienceQueryKeys } from '../../services';
import { ExperienceWithAllRelations, GetExperienceRequest } from '../../types';

type UseExperienceOptions = Omit<
  UseQueryOptions<
    ExperienceWithAllRelations,
    Error,
    ExperienceWithAllRelations,
    ReturnType<typeof experienceQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const useExperience = (request: GetExperienceRequest, options: UseExperienceOptions) => {
  return useQuery({
    queryKey: experienceQueryKeys.detail(request),
    queryFn: () => experienceApi.getById(request),
    ...options,
  });
};
