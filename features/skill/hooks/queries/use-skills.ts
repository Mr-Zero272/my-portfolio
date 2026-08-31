import { ListResponse } from '@/types/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { skillApi, skillQueryKeys } from '../../services';
import { GetSkillsRequest, SkillWithAllRelations } from '../../types';

type UseSkillsOptions = Omit<
  UseQueryOptions<
    ListResponse<SkillWithAllRelations>,
    Error,
    ListResponse<SkillWithAllRelations>,
    ReturnType<typeof skillQueryKeys.list>
  >,
  'queryKey' | 'queryFn'
>;

export const useSkills = (request?: GetSkillsRequest, options?: UseSkillsOptions) => {
  return useQuery({
    queryKey: skillQueryKeys.list(request),
    queryFn: () => skillApi.getAll(request),
    ...options,
  });
};
