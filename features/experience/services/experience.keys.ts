import { GetExperienceRequest, GetExperiencesRequest } from '../types';

export const experienceQueryKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceQueryKeys.all, 'list'] as const,
  list: (request?: GetExperiencesRequest) => [...experienceQueryKeys.all, 'list', request] as const,
  detail: (request: GetExperienceRequest) => [...experienceQueryKeys.all, 'detail', request.path?.id] as const,
};
