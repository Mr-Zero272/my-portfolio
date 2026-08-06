import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostsRequest } from '../../types';

export const usePosts = (request?: GetPostsRequest) => {
  return useQuery({
    queryKey: postQueryKeys.list(request),
    queryFn: () => postApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
