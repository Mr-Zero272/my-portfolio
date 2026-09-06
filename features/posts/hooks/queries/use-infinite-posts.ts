import type { ListResponse } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostsRequest, PostWithAllRelations } from '../../types';

type UseInfinitePostsOptions = {
  /**
   * First page already fetched server-side (public API). Seeds the query so the
   * first paint is instant and "Load more" continues from page 2 seamlessly.
   */
  initialPage?: ListResponse<PostWithAllRelations>;
  /** Stale time (ms) used when `initialPage` is provided. Defaults to 1h (matches ISR). */
  staleTime?: number;
};

/**
 * Infinite-scroll list of posts. Defaults to the public endpoint
 * (`/public/posts`, published-only) — set `isPublic: false` for the admin feed.
 * The `page` param is injected per page and excluded from the query key so
 * all pages share one cache entry.
 */
export const useInfinitePosts = (
  request?: GetPostsRequest & { isPublic?: boolean },
  options?: UseInfinitePostsOptions,
) => {
  const isPublic = request?.isPublic ?? true;
  const baseRequest: GetPostsRequest | undefined = request ? { ...request } : undefined;

  if (baseRequest) {
    delete (baseRequest as GetPostsRequest & { isPublic?: boolean }).isPublic;
  }

  const initialData = options?.initialPage
    ? { pages: [options.initialPage], pageParams: [1] }
    : undefined;
  const staleTime = initialData ? options?.staleTime ?? 60 * 60 * 1000 : undefined;

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
    initialData,
    staleTime,
  });
};
