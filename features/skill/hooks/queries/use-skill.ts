import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { GetSkillRequest, SkillWithAllRelations } from '../../types';

type UseSkillOptions = Omit<
  UseQueryOptions<
    SkillWithAllRelations,
    Error,
    SkillWithAllRelations,
    ReturnType<typeof skillQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const useSkill = (request: GetSkillRequest, options?: UseSkillOptions) => {
  return useQuery({
    queryKey: skillQueryKeys.detail(request),
    queryFn: () => skillApi.getById(request),
    ...options,
  });
};
