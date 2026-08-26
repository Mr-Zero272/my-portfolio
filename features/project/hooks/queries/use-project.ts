import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { projectApi, projectQueryKeys } from '../../services';
import { GetProjectRequest, ProjectWithAllRelations } from '../../types';

type UseProjectOptions = Omit<
  UseQueryOptions<
    ProjectWithAllRelations,
    Error,
    ProjectWithAllRelations,
    ReturnType<typeof projectQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const useProject = (request: GetProjectRequest, options: UseProjectOptions) => {
  return useQuery({
    queryKey: projectQueryKeys.detail(request),
    queryFn: () => projectApi.getById(request),
    ...options,
  });
};
