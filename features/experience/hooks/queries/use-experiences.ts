import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { experienceApi, experienceQueryKeys } from '../../services';
import { GetExperiencesRequest } from '../../types';

export const useExperiences = (request?: GetExperiencesRequest) => {
  return useQuery({
    queryKey: experienceQueryKeys.list(request),
    queryFn: () => experienceApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
