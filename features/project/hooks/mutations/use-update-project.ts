import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { projectApi, projectQueryKeys } from '../../services';
import { ProjectWithAllRelations, UpdateProjectRequest } from '../../types';

type UseUpdateProjectOptions = Omit<
  UseMutationOptions<ProjectWithAllRelations, Error, UpdateProjectRequest, unknown>,
  'mutationFn'
>;

export const useUpdateProject = (options?: UseUpdateProjectOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProjectRequest) => projectApi.update(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
