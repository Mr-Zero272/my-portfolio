import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tagApi, tagQueryKeys } from '../../services';
import { GetTagsWithMostPostsRequest } from '../../types';

export const useTagsWithMostPosts = (request?: GetTagsWithMostPostsRequest) => {
  return useQuery({
    queryKey: tagQueryKeys.mostPosts(request),
    queryFn: () => tagApi.getTagsWithMostPosts(request),
    placeholderData: keepPreviousData,
  });
};
