import { Skill } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { UpdateSkillRequest } from '../../types';

type UseUpdateSkillOptions = Omit<
  UseMutationOptions<Skill, Error, UpdateSkillRequest>,
  'mutationFn'
>;

export const useUpdateSkill = (options?: UseUpdateSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.update,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
