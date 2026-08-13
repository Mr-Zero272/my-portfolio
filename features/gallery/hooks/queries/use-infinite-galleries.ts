import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { galleryApi, galleryQueryKeys } from '../../services';
import { GetGalleryImagesRequest } from '../../types';

/**
 * Infinite-scroll variant of `useGalleries`.
 *
 * `page` is driven internally by TanStack Query's `pageParam` (starting at 1);
 * every page response carries a pagination meta that tells us whether more
 * pages exist (`hasNextPage`) and which page was just loaded, so the next
 * `pageParam` is simply `page + 1`.
 */
export const useInfiniteGalleries = (request?: GetGalleryImagesRequest) => {
  return useInfiniteQuery({
    queryKey: galleryQueryKeys.list(request),
    queryFn: ({ pageParam }) =>
      galleryApi.getAll({
        ...request,
        query: {
          ...request?.query,
          page: pageParam,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination?.hasNextPage) return undefined;
      return pagination.page + 1;
    },
    placeholderData: keepPreviousData,
  });
};
