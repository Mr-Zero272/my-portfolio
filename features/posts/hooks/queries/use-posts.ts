import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostsRequest } from '../../types';

export const usePosts = (request?: GetPostsRequest & { isPublic?: boolean }) => {
  const isPublic = request?.isPublic;
  const queryRequest = { ...request };

  delete queryRequest.isPublic;

  return useQuery({
    queryKey: postQueryKeys.list(queryRequest),
    queryFn: () => (isPublic ? postApi.getAllPublic(queryRequest) : postApi.getAll(queryRequest)),
    placeholderData: keepPreviousData,
  });
};
