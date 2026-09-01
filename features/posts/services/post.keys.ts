import { GetPostRequest, GetPostsRequest } from '../types';

export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postQueryKeys.all, 'list'],
  list: (request?: GetPostsRequest) => [...postQueryKeys.all, 'list', request] as const,
  infinite: (request?: GetPostsRequest) => [...postQueryKeys.all, 'infinite', request] as const,
  detail: (request: GetPostRequest) => [...postQueryKeys.all, 'detail', request.path?.id] as const,
};
