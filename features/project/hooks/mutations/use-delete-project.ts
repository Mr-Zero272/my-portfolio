import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { projectApi, projectQueryKeys } from '../../services';
import { DeleteProjectRequest } from '../../types';

type UseDeleteProjectOptions = Omit<
  UseMutationOptions<{ id: string }, Error, DeleteProjectRequest, unknown>,
  'mutationFn'
>;

export const useDeleteProject = (options?: UseDeleteProjectOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteProjectRequest) => projectApi.delete(request),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
