import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { projectApi, projectQueryKeys } from '../../services';
import { CreateProjectRequest, ProjectWithAllRelations } from '../../types';

type UseCreateProjectOptions = Omit<
  UseMutationOptions<ProjectWithAllRelations, Error, CreateProjectRequest, unknown>,
  'mutationFn'
>;

export const useCreateProject = (options?: UseCreateProjectOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProjectRequest) => projectApi.create(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
