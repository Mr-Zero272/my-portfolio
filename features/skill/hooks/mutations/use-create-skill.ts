import { Skill } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { CreateSkillRequest } from '../../types';

type UseCreateSkillOptions = Omit<
  UseMutationOptions<Skill, Error, CreateSkillRequest>,
  'mutationFn'
>;

export const useCreateSkill = (options?: UseCreateSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillApi.create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
