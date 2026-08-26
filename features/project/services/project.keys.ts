import { GetProjectRequest, GetProjectsRequest } from '../types';

export const projectQueryKeys = {
  all: ['project'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (request?: GetProjectsRequest) => [...projectQueryKeys.all, 'list', request] as const,
  detail: (request: GetProjectRequest) =>
    [...projectQueryKeys.all, 'detail', request.path?.id] as const,
};
