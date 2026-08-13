'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { SortOrder } from '@/types/api';

import { MineTypeEnum } from '../constants';
import { GetGalleryImagesRequest } from '../types/api';
import { GalleryImageFilterParams, GalleryImageSortByField } from '../types/gallery';

const ALL_MINE_TYPES = 'all-mine-types';

/**
 * Manages the gallery image list filter state (kept in the URL query string)
 * and builds the `GetGalleryImagesRequest` consumed by `useInfiniteGalleries`.
 *
 * `page` is intentionally left out of the request — infinite scroll drives it
 * internally. The toolbar's `mimeType` uses the enum *key* (e.g. `'WEBP'`) or
 * `'all-mine-types'` for "everything", so we map it to the actual MIME string
 * (`MineTypeEnum.WEBP` → `'image/webp'`) before sending it to the API. The
 * `'all-mine-types'` sentinel is simply omitted from the request.
 */
export const useGalleryFilterParams = () => {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(20),
    search: parseAsString.withDefault(''),
    mimeType: parseAsString.withDefault(ALL_MINE_TYPES),
    sortBy: parseAsString.withDefault('createdAt'),
    sortOrder: parseAsString.withDefault('desc'),
  });

  const filterParams = useMemo<GalleryImageFilterParams>(
    () => ({
      page: params.page,
      perPage: params.perPage,
      search: params.search,
      mimeType: params.mimeType,
      sortBy: params.sortBy as GalleryImageSortByField,
      sortOrder: params.sortOrder as SortOrder,
    }),
    [params],
  );

  const onPatchParams = useCallback(
    (patch: Partial<GalleryImageFilterParams>) => {
      setParams((prev) => ({
        page: patch.page ?? prev.page,
        perPage: patch.perPage ?? prev.perPage,
        search: patch.search ?? prev.search,
        mimeType: patch.mimeType ?? prev.mimeType,
        sortBy: patch.sortBy ?? prev.sortBy,
        sortOrder: patch.sortOrder ?? prev.sortOrder,
      }));
    },
    [setParams],
  );

  const request = useMemo<GetGalleryImagesRequest>(() => {
    const filters: NonNullable<GetGalleryImagesRequest['query']>['filters'] = {};

    if (filterParams.mimeType && filterParams.mimeType !== ALL_MINE_TYPES) {
      filters.mimeType =
        MineTypeEnum[filterParams.mimeType as keyof typeof MineTypeEnum] ??
        filterParams.mimeType;
    }

    return {
      query: {
        limit: filterParams.perPage,
        search: filterParams.search || undefined,
        sortBy: filterParams.sortBy,
        sortOrder: filterParams.sortOrder,
        filters,
      },
    };
  }, [filterParams]);

  const hasFilters = useMemo(
    () => Boolean(filterParams.search) || filterParams.mimeType !== ALL_MINE_TYPES,
    [filterParams],
  );

  return { params: filterParams, onPatchParams, request, hasFilters };
};
