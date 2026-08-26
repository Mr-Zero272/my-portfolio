import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { projectApi, projectQueryKeys } from '../../services';
import { GetProjectsRequest } from '../../types';

export const useProjects = (request?: GetProjectsRequest) => {
  return useQuery({
    queryKey: projectQueryKeys.list(request),
    queryFn: () => projectApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
