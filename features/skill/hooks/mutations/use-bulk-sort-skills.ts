import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { BulkSortSkillsRequest } from '../../types';

type UseBulkSortSkillsOptions = Omit<
  UseMutationOptions<{ success: boolean }, Error, BulkSortSkillsRequest>,
  'mutationFn'
>;

export const useBulkSortSkills = (options?: UseBulkSortSkillsOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.bulkSort,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
