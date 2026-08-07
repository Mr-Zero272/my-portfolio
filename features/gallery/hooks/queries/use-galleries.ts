import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { galleryApi, galleryQueryKeys } from '../../services';
import { GetGalleryImagesRequest } from '../../types';

export const useGalleries = (request?: GetGalleryImagesRequest) => {
  return useQuery({
    queryKey: galleryQueryKeys.list(request),
    queryFn: () => galleryApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
