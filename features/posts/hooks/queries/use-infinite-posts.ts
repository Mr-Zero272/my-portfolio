import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostsRequest } from '../../types';

/**
 * Infinite-scroll list of posts. Defaults to the public endpoint
 * (`/public/posts`, published-only) — set `isPublic: false` for the admin feed.
 * The `page` param is injected per page and excluded from the query key so
 * all pages share one cache entry.
 */
export const useInfinitePosts = (request?: GetPostsRequest & { isPublic?: boolean }) => {
  const isPublic = request?.isPublic ?? true;
  const baseRequest: GetPostsRequest | undefined = request
    ? { ...request }
    : undefined;

  if (baseRequest) {
    delete (baseRequest as GetPostsRequest & { isPublic?: boolean }).isPublic;
  }

  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: postQueryKeys.infinite(baseRequest),
    queryFn: ({ pageParam }) => {
      const pageRequest: GetPostsRequest = {
        ...baseRequest,
        query: { ...baseRequest?.query, page: pageParam },
      };

      return isPublic ? postApi.getAllPublic(pageRequest) : postApi.getAll(pageRequest);
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }

      return undefined;
    },
  });
};
