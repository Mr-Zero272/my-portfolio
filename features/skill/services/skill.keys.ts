import { GetSkillRequest, GetSkillsRequest } from '../types';

export const skillQueryKeys = {
  all: ['skill'] as const,
  lists: () => [...skillQueryKeys.all, 'list'] as const,
  list: (request?: GetSkillsRequest) => [...skillQueryKeys.all, 'list', request] as const,
  detail: (request: GetSkillRequest) =>
    [...skillQueryKeys.all, 'detail', request.path?.id] as const,
};
