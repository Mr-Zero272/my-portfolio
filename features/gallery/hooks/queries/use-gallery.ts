import { GalleryImage } from '@/lib/generated/prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { galleryApi, galleryQueryKeys } from '../../services';
import { GetGalleryImageRequest } from '../../types';

type UseGalleryOptions = Omit<
  UseQueryOptions<GalleryImage, Error, ReturnType<typeof galleryQueryKeys.detail>>,
  'queryKey' | 'queryFn'
>;

export const useGallery = (request: GetGalleryImageRequest, options?: UseGalleryOptions) => {
  return useQuery({
    queryKey: galleryQueryKeys.detail(request),
    queryFn: () => galleryApi.getById(request),
    ...options,
  });
};
