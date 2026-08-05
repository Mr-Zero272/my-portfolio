import { GetTagRequest, GetTagsRequest } from '../types';

export const tagQueryKeys = {
  all: ['tags'] as const,
  lists: () => [...tagQueryKeys.all, 'list'],
  list: (request?: GetTagsRequest) => [...tagQueryKeys.all, 'list', request] as const,
  detail: (request: GetTagRequest) => [...tagQueryKeys.all, 'detail', request.path?.id] as const,
};
