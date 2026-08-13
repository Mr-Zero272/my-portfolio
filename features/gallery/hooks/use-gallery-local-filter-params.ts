'use client';

import { useCallback, useMemo, useState } from 'react';

import { MineTypeEnum } from '../constants';
import { GetGalleryImagesRequest } from '../types/api';
import { GalleryImageFilterParams } from '../types/gallery';


const ALL_MIME_TYPES = 'all-mine-types';

const DEFAULT_PARAMS: GalleryImageFilterParams = {
  page: 1,
  perPage: 20,
  search: '',
  mimeType: ALL_MIME_TYPES,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * Local (non-URL) version of gallery filter params — intended for use inside
 * dialogs/modals where we do NOT want to pollute the URL query string.
 */
export const useGalleryLocalFilterParams = (initial?: Partial<GalleryImageFilterParams>) => {
  const [params, setParams] = useState<GalleryImageFilterParams>({
    ...DEFAULT_PARAMS,
    ...initial,
  });

  const onPatchParams = useCallback((patch: Partial<GalleryImageFilterParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const request = useMemo<GetGalleryImagesRequest>(() => {
    const filters: NonNullable<GetGalleryImagesRequest['query']>['filters'] = {};

    if (params.mimeType && params.mimeType !== ALL_MIME_TYPES) {
      filters.mimeType =
        MineTypeEnum[params.mimeType as keyof typeof MineTypeEnum] ?? params.mimeType;
    }

    return {
      query: {
        limit: params.perPage,
        search: params.search || undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        filters,
      },
    };
  }, [params]);

  const reset = useCallback(() => {
    setParams({ ...DEFAULT_PARAMS, ...initial });
  }, [initial]);

  return { params, onPatchParams, request, reset };
};
