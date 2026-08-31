import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { DeleteSkillRequest } from '../../types';

type UseDeleteSkillOptions = Omit<
  UseMutationOptions<{ id: string }, Error, DeleteSkillRequest>,
  'mutationFn'
>;

export const useDeleteSkill = (options?: UseDeleteSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
